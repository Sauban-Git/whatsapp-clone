import express, { type Request, type Response } from "express";
import multer from "multer";
import { prisma } from "../db/db.js";
import unzipper from "unzipper";
import { DeliveryStatus } from "../../generated/prisma/index.js";
import fs from "fs/promises";
import path from "path";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  upload.single("payload"),
  async (req: Request, res: Response) => {
    console.log("hitted webhook");
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const directory = await unzipper.Open.file(req.file.path);

    for (const file of directory.files) {
      if (!file.path.endsWith(".json")) continue;

      const content = await file.buffer();

      try {
        const payload = JSON.parse(content.toString("utf-8"));

        // If it is not a status file
        if (!payload.metaData.entry[0].changes[0].value.statuses) {
          const userA = {
            phoneNumber: parseInt(
              payload.metaData.entry[0].changes[0].value.metadata
                .display_phone_number
            ),
          };
          const userB = {
            name: payload.metaData.entry[0].changes[0].value.contacts[0].profile
              .name,
            phoneNumber: parseInt(
              payload.metaData.entry[0].changes[0].value.contacts[0].wa_id
            ),
          };

          // Upsert importer (User A)
          const importer = await prisma.user.upsert({
            where: { phoneNumber: userA.phoneNumber },
            update: {},
            create: { phoneNumber: userA.phoneNumber },
          });

          // Upsert receiver (User B)
          const otherUser = await prisma.user.upsert({
            where: { phoneNumber: userB.phoneNumber },
            update: {},
            create: { phoneNumber: userB.phoneNumber, name: userB.name },
          });

          let conversation = await prisma.conversation.findFirst({
            where: {
              isGroup: false,
              participants: {
                every: {
                  userId: {
                    in: [importer.id, otherUser.id],
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
                isGroup: false,
                participants: {
                  create: [{ userId: importer.id }, { userId: otherUser.id }],
                },
              },
              include: { participants: true },
            });
          }

          const message = {
            senderId:
              parseInt(
                payload.metaData.entry[0].changes[0].value.messages[0].from
              ) === importer.phoneNumber
                ? importer.id
                : otherUser.id,
            id: payload.metaData.entry[0].changes[0].value.messages[0].id,
            type: payload.metaData.entry[0].changes[0].value.messages[0].type.toUpperCase(),
            content:
              payload.metaData.entry[0].changes[0].value.messages[0].text.body,
            sender:
              parseInt(
                payload.metaData.entry[0].changes[0].value.messages[0].from
              ) === userA.phoneNumber
                ? userA.phoneNumber
                : userB.name,
          };

          const msg = await prisma.message.upsert({
            where: {
              externalId: message.id,
            },
            update: {},
            create: {
              externalId: message.id,
              content: message.content,
              type: message.type,
              senderId: message.senderId,
              conversationId: conversation.id,
            },
          });

          await prisma.messageStatus.upsert({
            where: {
              messageId_userId: {
                messageId: msg.id,
                userId: message.senderId,
              },
            },
            update: { status: DeliveryStatus.SENT },
            create: {
              messageId: msg.id,
              userId: message.senderId,
              status: DeliveryStatus.SENT,
            },
          });
        }
        // If not a status file
        else {
          const statusToSet = payload.completedAt
            ? DeliveryStatus.READ
            : DeliveryStatus.DELIVERED;
          const messageId =
            payload.metaData.entry[0].changes[0].value.statuses[0].id;

          const message = await prisma.message.findFirst({
            where: { externalId: messageId },
          });

          await prisma.messageStatus.upsert({
            where: {
              messageId_userId: {
                messageId: message!.id,
                userId: message!.senderId,
              },
            },
            update: { status: statusToSet },
            create: {
              messageId: message!.id,
              userId: message!.senderId,
              status: statusToSet,
            },
          });
        }
      } catch (error) {
        console.error("Error parsing: ", error);
        return res.status(500).json({
          error: "Something went wrong",
        });
      }
    }
    // Delete uploaded zip file
    try {
      await fs.unlink(path.resolve(req.file.path));
      console.log("Uploaded file deleted");
    } catch (err) {
      console.error("Failed to delete uploaded file:", err);
    }

    return res.status(200).json({
      message: "Done! importing payload",
    });
  }
);

export { router as webhookRouter };
