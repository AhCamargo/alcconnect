import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth";
import {
  listPhoneNumbersQuerySchema,
  createPhoneNumberSchema,
  updatePhoneNumberSchema,
} from "../validators/schemas";
import * as phoneNumberService from "../services/phoneNumberService";
import { AppError } from "../errors/AppError";

// ─── Públicas ───────────────────────────────────────────

export async function listAvailable(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = listPhoneNumbersQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  try {
    const result = await phoneNumberService.listAvailable(parsed.data);
    res.json(result);
  } catch (err: unknown) {
    const status = err instanceof AppError ? err.status : 500;
    const message = err instanceof AppError ? err.message : "Erro interno.";
    res.status(status).json({ error: message });
  }
}

// ─── Autenticadas ───────────────────────────────────────

export async function listMine(req: AuthRequest, res: Response): Promise<void> {
  try {
    const numbers = await phoneNumberService.listMine(req.userId!);
    res.json({ numbers });
  } catch (err: unknown) {
    const status = err instanceof AppError ? err.status : 500;
    const message = err instanceof AppError ? err.message : "Erro interno.";
    res.status(status).json({ error: message });
  }
}

export async function getById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const number = await phoneNumberService.getById(
      req.params.id as string,
      req.userId!,
    );
    res.json({ number });
  } catch (err: unknown) {
    const status = err instanceof AppError ? err.status : 500;
    const message = err instanceof AppError ? err.message : "Erro interno.";
    res.status(status).json({ error: message });
  }
}

// ─── Admin ──────────────────────────────────────────────

export async function listAll(req: AuthRequest, res: Response): Promise<void> {
  const parsed = listPhoneNumbersQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  try {
    const result = await phoneNumberService.listAll(parsed.data);
    res.json(result);
  } catch (err: unknown) {
    const status = err instanceof AppError ? err.status : 500;
    const message = err instanceof AppError ? err.message : "Erro interno.";
    res.status(status).json({ error: message });
  }
}

export async function create(req: AuthRequest, res: Response): Promise<void> {
  const parsed = createPhoneNumberSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  try {
    const number = await phoneNumberService.create(parsed.data);
    res.status(201).json({ number });
  } catch (err: unknown) {
    const status = err instanceof AppError ? err.status : 500;
    const message = err instanceof AppError ? err.message : "Erro interno.";
    res.status(status).json({ error: message });
  }
}

export async function update(req: AuthRequest, res: Response): Promise<void> {
  const parsed = updatePhoneNumberSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  try {
    const number = await phoneNumberService.update(
      req.params.id as string,
      parsed.data,
    );
    res.json({ number });
  } catch (err: unknown) {
    const status = err instanceof AppError ? err.status : 500;
    const message = err instanceof AppError ? err.message : "Erro interno.";
    res.status(status).json({ error: message });
  }
}

export async function remove(req: AuthRequest, res: Response): Promise<void> {
  try {
    await phoneNumberService.remove(req.params.id as string);
    res.json({ message: "Número removido com sucesso." });
  } catch (err: unknown) {
    const status = err instanceof AppError ? err.status : 500;
    const message = err instanceof AppError ? err.message : "Erro interno.";
    res.status(status).json({ error: message });
  }
}
