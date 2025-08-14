import type { NextFunction, Request, Response } from "express";
import { prisma } from "../db/db.js";

export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.cookies?.userId;
  if (!userId) return res.status(400).json({
    error: "Please provide userId"
  })

  // const user = await prisma.user.findFirst({
  //   where: {
  //     AND: [{ name: { not: null } }, { name: { not: "" } }],
  //   },
  // });

  // if (!userId) {
  //   userId = user?.id;
  // }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized. User not found." });
    }
    res.cookie("userId", user.id, {
      httpOnly: process.env.HTTP_ONLY === "true",
      sameSite: process.env.SAME_SITE as "lax" | "strict" | "none" | undefined,
      secure: process.env.SECURE === "true",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    (req as any).userId = userId;
    next();
  } catch (error) {
    console.error("Error searching user in database: ", error);
    return res.status(500).json({
      error: "Error while validating user. Please login again",
    });
  }
};
