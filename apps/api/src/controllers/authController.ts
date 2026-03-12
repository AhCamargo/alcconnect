import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth";
import { registerSchema, loginSchema } from "../validators/schemas";
import * as authService from "../services/authService";
import { AppError } from "../errors/AppError";

export async function register(req: AuthRequest, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  try {
    const result = await authService.registerUser(
      parsed.data.name,
      parsed.data.email,
      parsed.data.password,
    );
    res.status(201).json(result);
  } catch (err: unknown) {
    const status = err instanceof AppError ? err.status : 500;
    const message = err instanceof AppError ? err.message : "Erro interno.";
    res.status(status).json({ error: message });
  }
}

export async function login(req: AuthRequest, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  try {
    const result = await authService.loginUser(
      parsed.data.email,
      parsed.data.password,
    );
    res.json(result);
  } catch (err: unknown) {
    const status = err instanceof AppError ? err.status : 500;
    const message = err instanceof AppError ? err.message : "Erro interno.";
    res.status(status).json({ error: message });
  }
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = await authService.getUser(req.userId!);
    res.json({ user });
  } catch (err: unknown) {
    const status = err instanceof AppError ? err.status : 500;
    const message = err instanceof AppError ? err.message : "Erro interno.";
    res.status(status).json({ error: message });
  }
}
