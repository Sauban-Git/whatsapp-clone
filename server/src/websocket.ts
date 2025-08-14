import { WebSocket, WebSocketServer } from "ws";
import { parse as parseCookie } from "cookie";
import type { Server } from "http";
import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import {
  addConversationSubscriber,
  addUserSubscriber,
  getConversationSubscribers,
  getUserSubscribers,
  removeUserSubscriber,
  removeConversationSubscriber,
} from "./db/redis.js";
import { prisma } from "./db/db.js";

dotenv.config();

type ExtendedWebSocket = WebSocket & { userId?: string; clientId?: string };

const clientsMap = new Map<string, ExtendedWebSocket>();
const clientSubscriptions = new Map<string, Set<string>>();

let mongoClient: MongoClient;

export async function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  mongoClient = new MongoClient(`${process.env.DATABASE_URL}`);

  try {
    await mongoClient.connect();
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }

  const db = mongoClient.db("whatsapp");
  const messagesCollection = db.collection("Message");
  const conversationsCollection = db.collection("Conversation");

  /**
   * WATCH: New Messages
   */
  const messageStream = messagesCollection.watch([], {
    fullDocument: "updateLookup",
  });

  messageStream.on("change", async (change) => {
    if (change.operationType !== "insert") return;

    const newMessage = change.fullDocument;
    const conversationId = newMessage.conversationId;
    const senderId = newMessage.senderId;

    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { id: true, name: true },
    });

    // Attach IDs and sender
    newMessage.id = newMessage._id.toString();
    newMessage.sender = sender;

    // Notify conversation subscribers
    const convClientIds = await getConversationSubscribers(conversationId);
    for (const clientId of convClientIds) {
      const ws = clientsMap.get(clientId);
      if (ws && ws.readyState === WebSocket.OPEN && ws.userId) {
        const statuses = await prisma.messageStatus.findUnique({
          where: {
            messageId_userId: {
              messageId: newMessage._id.toString(),
              userId: ws.userId!,
            },
          },
          select: { status: true, updatedAt: true },
        });

        const messagePayload = {
          id: newMessage._id.toString(),
          content: newMessage.content,
          createdAt: newMessage.createdAt,
          updatedAt: newMessage.updatedAt,
          type: newMessage.type,
          conversationId: newMessage.conversationId,
          sender: {
            id: sender?.id,
            name: sender?.name,
          },
          statuses: [statuses],
        };

        ws.send(JSON.stringify({ type: "new_message", data: messagePayload }));
      }
    }

    // Notify sender's conversation list subscribers
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        name: true,
        isGroup: true,
        createdAt: true,
        updatedAt: true,
        participants: {
          select: {
            user: { select: { id: true, name: true, phoneNumber: true } },
          },
        },
      },
    });

    // Fetch full conversation in API format
    const fullConversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        name: true,
        isGroup: true,
        createdAt: true,
        updatedAt: true,
        Message: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            content: true,
            createdAt: true,
            type: true,
            senderId: true,
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        participants: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                phoneNumber: true,
              },
            },
          },
        },
      },
    });

    if (fullConversation) {
      const userClientIds = await getUserSubscribers(senderId);
      for (const clientId of userClientIds) {
        const ws = clientsMap.get(clientId);
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "new_conversation_activity",
              data: fullConversation,
            })
          );
        }
      }
    }
  });

  /**
   * WATCH: New Conversations
   */
  const conversationStream = conversationsCollection.watch([], {
    fullDocument: "updateLookup",
  });

  conversationStream.on("change", async (change) => {
    if (change.operationType !== "insert") return;

    const newConversation = change.fullDocument;
    const conversationId = newConversation._id.toString();

    // Get participants from Prisma
    const participants = await prisma.participant.findMany({
      where: { conversationId },
      select: {
        user: { select: { id: true, name: true, phoneNumber: true } },
      },
    });

    // Notify each participant's connected clients
    for (const { user } of participants) {
      const clientIds = await getUserSubscribers(user.id);
      for (const clientId of clientIds) {
        const ws = clientsMap.get(clientId);
        if (ws && ws.readyState === WebSocket.OPEN) {
          // Fetch full conversation in API format
          const fullConversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            select: {
              id: true,
              name: true,
              isGroup: true,
              createdAt: true,
              updatedAt: true,
              Message: {
                orderBy: { createdAt: "desc" },
                take: 1,
                select: {
                  id: true,
                  content: true,
                  createdAt: true,
                  type: true,
                  senderId: true,
                  sender: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              participants: {
                select: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      phoneNumber: true,
                    },
                  },
                },
              },
            },
          });

          if (fullConversation) {
            for (const { user } of participants) {
              const clientIds = await getUserSubscribers(user.id);
              for (const clientId of clientIds) {
                const ws = clientsMap.get(clientId);
                if (ws && ws.readyState === WebSocket.OPEN) {
                  ws.send(
                    JSON.stringify({
                      type: "new_conversation_activity",
                      data: fullConversation,
                    })
                  );
                  // Auto-subscribe them to this new conversation
                  await addConversationSubscriber(conversationId, clientId);
                  const subs = clientSubscriptions.get(clientId) || new Set();
                  subs.add(conversationId);
                  clientSubscriptions.set(clientId, subs);
                }
              }
            }
          }

          // Auto-subscribe them to this new conversation
          await addConversationSubscriber(conversationId, clientId);
          const subs = clientSubscriptions.get(clientId) || new Set();
          subs.add(conversationId);
          clientSubscriptions.set(clientId, subs);
        }
      }
    }
  });

  /**
   * WebSocket connection handler
   */
  wss.on("connection", async (ws: ExtendedWebSocket, req) => {
    try {
      const cookies = parseCookie(req.headers.cookie || "");
      const userId = cookies["userId"];

      if (!userId) {
        ws.close(1008, "Unauthorized");
        return;
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        ws.close(1008, "Unauthorized");
        return;
      }

      ws.userId = user.id;
      const clientId = uuidv4();
      ws.clientId = clientId;
      clientsMap.set(clientId, ws);

      // Auto-subscribe to all existing conversations
      const participants = await prisma.participant.findMany({
        where: { userId: user.id },
        select: { conversationId: true },
      });

      const subscribedConversations = new Set<string>();
      for (const { conversationId } of participants) {
        await addConversationSubscriber(conversationId, clientId);
        subscribedConversations.add(conversationId);
        console.log(
          `User ${user.id} auto-subscribed to conversation ${conversationId}`
        );
      }
      clientSubscriptions.set(clientId, subscribedConversations);

      await addUserSubscriber(user.id, clientId);
      console.log(`User ${user.id} subscribed to their conversation list`);

      ws.on("message", async (message) => {
        try {
          const data = JSON.parse(message.toString());

          if (data.type === "subscribe") {
            if (data.conversationId) {
              await addConversationSubscriber(data.conversationId, clientId);
              const subs = clientSubscriptions.get(clientId) || new Set();
              subs.add(data.conversationId);
              clientSubscriptions.set(clientId, subs);
              console.log(
                `User ${ws.userId} subscribed to conversation ${data.conversationId}`
              );
            }
            if (data.list === "conversation_list") {
              await addUserSubscriber(ws.userId!, clientId);
              console.log(
                `User ${ws.userId} subscribed to their conversation list`
              );
            }
          }
        } catch (err) {
          console.error("Invalid message format:", err);
        }
      });

      ws.on("close", async () => {
        await removeUserSubscriber(ws.userId!, clientId);

        const subs = clientSubscriptions.get(clientId);
        if (subs) {
          for (const convId of subs) {
            await removeConversationSubscriber(convId, clientId);
            console.log(
              `Client ${clientId} unsubscribed from conversation ${convId}`
            );
          }
        }

        clientSubscriptions.delete(clientId);
        clientsMap.delete(clientId);
        console.log(`WebSocket disconnected for user ${ws.userId}`);
      });

      console.log(
        `WebSocket connected for user ${ws.userId}, clientId ${clientId}`
      );
    } catch (error) {
      console.error("WebSocket connection error:", error);
      ws.close(1011, "Internal server error");
    }
  });

  console.log(
    "✅ WebSocket server initialized with Redis subscription tracking"
  );
}
