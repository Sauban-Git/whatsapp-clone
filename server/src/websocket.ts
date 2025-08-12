import { WebSocket, WebSocketServer } from "ws";
import { parse as parseCookie } from "cookie";
import type { Server } from "http";
import { MongoClient, ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import {
  addConversationSubscriber,
  addUserSubscriber,
  getConversationSubscribers,
  getUserSubscribers,
  removeUserSubscriber,
  removeConversationSubscriber,
} from "./db/redis.js";
import { prisma } from "./db/db.js";

type ExtendedWebSocket = WebSocket & { userId?: string; clientId?: string };

const clientsMap = new Map<string, ExtendedWebSocket>();
const clientSubscriptions = new Map<string, Set<string>>();

let mongoClient: MongoClient;

export async function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  mongoClient = new MongoClient("mongodb://localhost:27017");

  try {
    await mongoClient.connect();
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }

  const db = mongoClient.db("whatsapp");
  const messagesCollection = db.collection("Message");

  const changeStream = messagesCollection.watch([], {
    fullDocument: "updateLookup",
  });

  changeStream.on("change", async (change) => {
    if (change.operationType === "insert") {
      const newMessage = change.fullDocument;
      const conversationId = newMessage.conversationId;
      const senderId = newMessage.senderId;

      // Fetch sender info from Prisma

      const sender = await prisma.user.findUnique({
        where: { id: newMessage.senderId },
        select: { id: true, name: true },
      });

      newMessage.id = newMessage._id.toString()
      // Attach structured sender object
      newMessage.sender = sender;

      // Notify conversation subscribers
      const convClientIds = await getConversationSubscribers(conversationId);
      for (const clientId of convClientIds) {
        const ws = clientsMap.get(clientId);
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "new_message",
              data: newMessage,
            })
          );
        }
      }

      // Notify sender's conversation list subscribers
      const userClientIds = await getUserSubscribers(senderId);
      for (const clientId of userClientIds) {
        const ws = clientsMap.get(clientId);
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "new_conversation_activity",
              data: newMessage,
            })
          );
        }
      }
    }
  });

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
