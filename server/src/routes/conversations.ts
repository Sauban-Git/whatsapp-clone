import { Router, type Request, type Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    // Get all conversations
});
router.post("/", (req: Request, res: Response) => {
    // Create a conversation
});
router.put("/:id", (req: Request, res: Response) => {
   // Update a conversation 
});
router.delete("/:id", (req: Request, res: Response) => {
    // Delete a conversation
});

export { router as conversationRouter };
