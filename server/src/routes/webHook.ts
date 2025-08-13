import express from "express";
import multer from "multer";
import AdmZip from "adm-zip";
import fs from "fs/promises";
import { prisma } from "../db/db.js";
import {
  DeliveryStatus,
  type MessageType,
} from "../../generated/prisma/index.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("payload"), async (req, res) => {
  console.log("hitted webhook");
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const zip = new AdmZip(req.file.path);
    const zipEntries = zip.getEntries();

    for (const entry of zipEntries) {
      if (!entry.entryName.endsWith(".json")) continue;

      const fileContent = zip.readAsText(entry);
      const data = JSON.parse(fileContent);

      const entries = data.metaData?.entry || [];
      for (const entryItem of entries) {
        const changes = entryItem.changes || [];
        for (const change of changes) {
          const value = change.value;
          const contacts = value.contacts || [];
          const metadata = value.metadata || {};

          if (!contacts.length || !metadata.display_phone_number) continue;

          const contact = contacts[0];
          const waId = contact.wa_id;
          const name = contact.profile?.name || null;
          const displayPhoneNumber = metadata.display_phone_number;

          const senderPhone = parseInt(waId); // User A
          const receiverPhone = parseInt(displayPhoneNumber); // User B

          // Upsert sender (User A)
          const sender = await prisma.user.upsert({
            where: { phoneNumber: senderPhone },
            update: { name },
            create: { phoneNumber: senderPhone, name },
          });

          // Upsert receiver (User B)
          const receiver = await prisma.user.upsert({
            where: { phoneNumber: receiverPhone },
            update: {},
            create: { phoneNumber: receiverPhone, name: null },
          });

          // Create conversation ID key
          const [user1, user2] = [senderPhone, receiverPhone].sort(
            (a, b) => a - b
          );
          const convKey = `conversation_${user1}_${user2}`;

          let conversation = await prisma.conversation.findFirst({
            where: {
              isGroup: false,
              participants: {
                every: {
                  userId: {
                    in: [sender.id, receiver.id],
                  },
                },
                // Also make sure it ONLY has these two participants
                some: {},
              },
            },
            include: {
              participants: true,
            },
          });

          if (!conversation) {
            conversation = await prisma.conversation.create({
              data: {
                name: convKey,
                isGroup: false,
                participants: {
                  create: [{ userId: sender.id }, { userId: receiver.id }],
                },
              },
              include: { participants: true },
            });
          }

          const isMessageFile = entry.entryName
            .toLowerCase()
            .includes("message");
          const isStatusFile = entry.entryName.toLowerCase().includes("status");

          const messages = value.messages || [];

          for (const msg of messages) {
            if (isMessageFile) {
              const messageType = msg.type.toUpperCase() as MessageType;
              const content = msg.text?.body || "";

              // Save message
              const message = await prisma.message.upsert({
                where: { externalId: msg.id },
                update: {},
                create: {
                  externalId: msg.id,
                  content,
                  type: messageType,
                  senderId: sender.id,
                  conversationId: conversation.id,
                },
              });

              // Set initial status SENT
              await prisma.messageStatus.upsert({
                where: {
                  messageId_userId: {
                    messageId: message.id,
                    userId: sender.id,
                  },
                },
                update: { status: DeliveryStatus.SENT },
                create: {
                  messageId: message.id,
                  userId: sender.id,
                  status: DeliveryStatus.SENT,
                },
              });
            }

            if (isStatusFile) {
              const statusToSet: DeliveryStatus = data.completedAt
                ? DeliveryStatus.READ
                : DeliveryStatus.DELIVERED;

              const message = await prisma.message.findFirst({
                where: { externalId: msg.id }, // msg.id is the WhatsApp ID
              });

              await prisma.messageStatus.upsert({
                where: {
                  messageId_userId: {
                    messageId: message?.id ?? "",
                    userId: sender.id,
                  },
                },
                update: { status: statusToSet },
                create: {
                  messageId: msg.id,
                  userId: sender.id,
                  status: statusToSet,
                },
              });
            }
          }
        }
      }
    }

    await fs.unlink(req.file.path);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    if (req.file) await fs.unlink(req.file.path);
    res.status(500).json({ error: "Webhook processing failed." });
  }
});

export { router as webhookRouter };
