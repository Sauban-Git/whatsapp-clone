import { Router, type Request, type Response } from "express";
import { prisma } from "../db/db.js";
import { userMiddleware } from "../middleware/userMiddleware.js";

const router = Router();

router.use(userMiddleware);

router.get(
  "/conversation/:conversationId",
  async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const conversationId = req.params.conversationId;
    if (!conversationId)
      return res.status(403).json({ error: "No conversation id provided" });
    try {
      const messages = await prisma.message.findMany({
        where: {
          conversationId,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          type: true,
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
          statuses: {
            where: {
              userId: userId
            },
            select: {
              status: true,
              updatedAt: true,
            },
          },
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
    const userId = (req as any).userId;
    const conversationId = req.params.conversationId;
    const { content } = req.body;

    if (!content || !conversationId)
      return res.status(400).json({ error: "Please send required data" });

    try {
      // Create the message
      const message = await prisma.message.create({
        data: {
          externalId: String(Date.now()),
          content,
          senderId: userId,
          conversationId,
        },
      });

      // Create status only for sender (not all participants)
      await prisma.messageStatus.create({
        data: {
          messageId: message.id,
          userId: userId, // Only sender
          status: "SENT",
        },
      });

      return res.status(200).json({
        message: "Message sent with sender status created",
      });
    } catch (error) {
      console.error("Error creating message: ", error);
      return res.status(500).json({
        error: "Error sending message",
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
    return res.status(200).json({
      message: "Done deleting message",
    });
  } catch (error) {
    console.error("Error deleting message: ", error);
    return res.status(500).json({
      error: "Error deleting message",
    });
  }
});

export { router as messagesRouter };
