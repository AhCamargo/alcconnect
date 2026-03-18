import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth";
import { prisma } from "../database/prisma";

export async function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    res.status(403).json({ error: "Acesso restrito a administradores." });
    return;
  }

  next();
}
