import { Router, type Request, type Response } from "express";
import { prisma } from "../db/db.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const {userId} = req.body;
  if (!userId) return res.status(400).json({
    error: "Error!, Please include userId"
  })
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
        Message: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            senderId: true,
            type: true,
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
  const body = req.body;
  if (!body.to || !body.from ) return res.status(400).json({
    error: "Error!, Please tag body with from and to for conversation"
  })
  try {
    const conversation = await prisma.conversation.create({
      data: {
        isGroup: false,
        participants: {
          create: [{ userId: body.to }, { userId: body.from }],
        },
      },
      include: {
        participants: true,
      },
    });
    return res.status(200).json({
      conversation,
      msg: "Initiated conversation",
    });
  } catch (error) {
    console.error("Error creating conversation: ", error);
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
