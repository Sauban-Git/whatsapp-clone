import { Router, type Request, type Response } from "express";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();
const router = Router();

router.post("/webhook", async (req: Request, res: Response) => {
    try {
        const payload = req.body; 

        if (payload.messages) {
            for (const message of payload.messages) {
                const { id, text, from, to, timestamp } = message;

                let conversation = await prisma.conversation.findFirst({
                    where: {
                        participants: {
                            some: {
                                userId: from,  
                            },
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
                                create: [
                                    { userId: from },
                                    { userId: to },  
                                ],
                            },
                        },
                        include: {
                            participants: true,  
                        },
                    });
                }

                await prisma.message.create({
                    data: {
                        id: id,  
                        content: text,  
                        senderId: from, 
                        conversationId: conversation.id,  
                        statuses: {
                            create: [
                                {
                                    userId: from, 
                                    status: 'SENT',
                                },
                                {
                                    userId: to,  
                                    status: 'SENT',
                                },
                            ],
                        },
                        createdAt: new Date(timestamp),  
                    }
                });
            }
        }


        return res.status(200).json({ message: "Webhook processed successfully" });
    } catch (error) {
        console.error("Error processing webhook payload:", error);
        return res.status(500).json({ error: "Failed to process webhook" });
    }
});

export { router as webhookRouter };
