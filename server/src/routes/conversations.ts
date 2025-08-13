import { Router, type Request, type Response } from "express";
import { prisma } from "../db/db.js";
import { userMiddleware } from "../middleware/userMiddleware.js";

const router = Router();

router.use(userMiddleware);

router.get("/", async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        isGroup: true,
        createdAt: true,
        updatedAt: true,
        Message: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
            type: true,
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
                phoneNumber: true
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      conversations,
    });
  } catch (error) {
    console.error("Error fetching conversations: ", error);
    return res.status(500).json({
      error: "Failed to get conversations",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { to } = req.body;
  const userId = (req as any).userId;
  if (!to)
    return res.status(400).json({
      error: "Error!, Please tag body with from and to for conversation",
    });
  try {
    // 1. Find existing conversation with exactly these two participants
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        participants: {
          every: {
            userId: {
              in: [userId, to],
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

    // 2. If exists, return it
    if (
      existingConversation &&
      existingConversation.participants.length === 2 &&
      existingConversation.participants.some((p) => p.userId === userId) &&
      existingConversation.participants.some((p) => p.userId === to)
    ) {
      return res.status(200).json({
        conversation: existingConversation,
        msg: "Conversation already exists",
      });
    }

    // 3. Otherwise, create new conversation
    const newConversation = await prisma.conversation.create({
      data: {
        isGroup: false,
        participants: {
          create: [{ userId: to }, { userId }],
        },
      },
      include: {
        participants: true,
      },
    });

    return res.status(200).json({
      conversation: newConversation,
      msg: "Initiated new conversation",
    });
  } catch (error) {
    console.error("Error creating or finding conversation: ", error);
    return res.status(500).json({
      error: "Unable to initiate conversation now.",
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  // Update conversation name
});

router.delete("/:id", async (req: Request, res: Response) => {
  const conversationId = req.params.id;
  if (!conversationId)
    return res
      .status(500)
      .json({ error: "Specified conversation doesn't exist!" });
  try {
    const result = await prisma.conversation.delete({
      where: {
        id: conversationId,
      },
    });
    return res.status(200).json({
      msg: "Deleted conversation",
    });
  } catch (error) {
    console.error("Error deleting conversation: ", error);
    return res.status(500).json({
      error: "Error deleting conversation",
    });
  }
});

export { router as conversationRouter };
