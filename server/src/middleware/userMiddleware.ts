import type { NextFunction, Request, Response } from "express";
import { prisma } from "../db/db.js";

export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.cookies?.userId;

  if (!userId) {
    return res
      .status(401)
      .json({ error: "Unauthorized. Missing userId cookie." });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized. User not found." });
    }
    (req as any).userId = userId;
    next();
  } catch (error) {
    console.error("Error searching user in database: ", error);
    return res.status(500).json({
      error: "Error while validating user. Please login again",
    });
  }
};
