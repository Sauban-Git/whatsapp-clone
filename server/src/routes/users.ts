import { Router, type Request, type Response } from "express";
import { prisma } from "../db/db.js";
import { userMiddleware } from "../middleware/userMiddleware.js";

const router = Router();

router.get("/", userMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
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

router.get(
  "/users/:query",
  userMiddleware,
  async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const query = req.params.query;
    if (!userId || !query)
      return res.status(400).json({
        error: "Please send valid user id",
      });
    try {
      const users = await prisma.user.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
          NOT: {
            id: userId,
          },
        },
        select: {
          id: true,
          name: true,
        },
      });
      return res.status(200).json({
        users,
      });
    } catch (error) {
      console.log("Error fetching all user: ", error);
      return res.status(500).json({
        error: "Error getting all users list",
      });
    }
  }
);

router.post("/", async (req: Request, res: Response) => {
  const { phoneNumber, name } = req.body;
  const parsedPhone = Number(phoneNumber);
  if (!phoneNumber || isNaN(parsedPhone) || parsedPhone <= 0)
    return res.status(400).json({
      error: "Please send valid phone number",
    });

  try {
    const user = await prisma.user.upsert({
      where: {
        phoneNumber: parsedPhone,
      },
      update: {
        name,
      },
      create: {
        phoneNumber: parsedPhone,
        name,
      },
    });

    res.cookie("userId", user.id, {
      httpOnly: process.env.HTTP_ONLY === "true",
      sameSite: process.env.SAME_SITE as "lax" | "strict" | "none" | undefined,
      secure: process.env.SECURE === "true",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
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

router.put("/", userMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
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

export { router as userRouter };
