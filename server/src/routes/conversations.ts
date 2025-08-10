import { Router, type Request, type Response } from "express";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: body.userId,
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
  // Create a conversation
});

router.put("/:id", async (req: Request, res: Response) => {
  // Update a conversation
});

router.delete("/:id", async (req: Request, res: Response) => {
  // Delete a conversation
});

export { router as conversationRouter };
