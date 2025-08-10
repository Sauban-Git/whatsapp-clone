import { Router, type Request, type Response } from "express";
import { prisma } from "../db/db.js";

const router = Router();

router.get(
  "/conversation/:conversationId",
  async (req: Request, res: Response) => {
    const conversationId = req.params.conversationId;
    if (!conversationId)
      return res.status(403).json({ error: "No conversation id provided" });
    try {
      const messages = await prisma.message.findMany({
        where: {
          conversationId,
        },
      });
      return res.status(200).json({
        messages,
      });
    } catch (error) {
      console.error(
        "Error getting messages at conversation Id: ",
        conversationId,
        " and error is: ",
        error
      );
      return res.status(500).json({
        error: "Error getting messages",
      });
    }
  }
);

router.post(
  "/conversation/:conversationId",
  async (req: Request, res: Response) => {
    const conversationId = req.params.conversationId;
    const { content, senderId } = req.body;
    if (!content || !senderId || !conversationId)
      return res.status(400).json({ error: "Please send required data" });
    try {
      const messages = await prisma.message.create({
        data: {
          content: content,
          senderId: senderId,
          conversationId: conversationId,
        },
      });
      return res.status(200).json({
        message: "Done sending message",
      });
    } catch (error) {
      console.error("Error creating message: ", error);
      return res.status(500).json({
        error: "Error sending messages",
      });
    }
  }
);

router.put("/:messageId", async (req: Request, res: Response) => {
  // Update msg with msg_id
});

router.delete("/:messageId", async (req: Request, res: Response) => {
  const messageId = req.params.messageId;
  if (!messageId)
    return res.status(400).json({
      error: "Please provide message id.",
    });
  try {
    const message = await prisma.message.delete({
      where: {
        id: messageId,
      },
    });
  } catch (error) {
    console.error("Error deleting message: ", error);
    return res.status(500).json({
      error: "Error deleting message",
    });
  }
});

export { router as messagesRouter };
