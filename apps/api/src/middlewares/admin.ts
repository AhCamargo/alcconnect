import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth";
import AppDataSource from "../database/data-source";
import { User } from "../entities/User";

// Middleware admin: valida se o usuário tem role ADMIN e e-mail cadastrado em ADMIN_EMAILS
// Nunca expõe e-mails admin no frontend
export async function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({
    where: { id: req.userId },
    select: { role: true, email: true } as any,
  });

  if (!user || user.role !== "ADMIN") {
    res.status(403).json({ error: "Acesso restrito a administradores." });
    return;
  }

  // Valida e-mail admin
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase());
  if (!user.email || !adminEmails.includes(user.email.toLowerCase())) {
    res.status(403).json({ error: "Acesso restrito a administradores." });
    return;
  }

  next();
}
