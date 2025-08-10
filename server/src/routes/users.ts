import { Router, type Request, type Response } from "express";
import { PrismaClient } from "../generated/prisma/index.js";

const router = Router();
const prisma = new PrismaClient();

router.get("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (!userId)
    return res.status(400).json({
      error: "Please send valid user id",
    });
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Error getting user info: ", error);
    return res.status(500).json({
      error: "Error getting user information",
    });
  }
});
router.post("/", async (req: Request, res: Response) => {
  const { phoneNumber, name } = req.body;
  if (!phoneNumber || !name)
    return res.status(400).json({
      error: "Please send valid user id",
    });
  try {
    const user = await prisma.user.create({
      data: {
        phoneNumber,
        name,
      },
    });
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Error creating user: ", error);
    return res.status(500).json({
      error: "Error creating user",
    });
  }
});
router.put("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { name } = req.body;
  if (!userId || !name)
    return res.status(400).json({
      error: "Please send valid user id",
    });
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
      },
    });
    return res.status(200).json({
      message: "Successfully updated!",
    });
  } catch (error) {
    console.error("Error updating: ", error);
    return res.status(500).json({
      error: "Error updating info",
    });
  }
});
