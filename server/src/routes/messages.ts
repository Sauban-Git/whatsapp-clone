import { Router, type Request, type Response } from "express";

const router = Router();

router.get("/conversation/:conversationId", (req: Request, res: Response) => {
    // Get all msgs of a conversation_id
});
router.post("/conversation/:conversationId", (req: Request, res: Response) => {
    // Send a msg to a conversation_id
});
router.put("/:messageId", (req: Request, res: Response) => {
    // Update msg with msg_id
});
router.delete("/:messageId", (req: Request, res: Response) => {
    // Delete msg with msg_id
});

export { router as messagesRouter };
