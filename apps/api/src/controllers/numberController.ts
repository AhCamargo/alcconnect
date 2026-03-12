import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth";
import { buyNumberSchema } from "../validators/schemas";
import * as numberService from "../services/numberService";
import { AppError } from "../errors/AppError";

export async function listNumbers(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const numbers = await numberService.listNumbers(req.userId!);
  res.json({ numbers });
}

export async function buyNumber(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const parsed = buyNumberSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  const number = await numberService.buyNumber(req.userId!, parsed.data.ddd);
  res.status(201).json({ number });
}

export async function getNumber(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const number = await numberService.getNumber(
      req.userId!,
      req.params.id as string,
    );
    res.json({ number });
  } catch (err: unknown) {
    const status = err instanceof AppError ? err.status : 500;
    const message = err instanceof AppError ? err.message : "Erro interno.";
    res.status(status).json({ error: message });
  }
}

export async function getNumberEvents(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const events = await numberService.getNumberEvents(
      req.userId!,
      req.params.id as string,
    );
    res.json({ events });
  } catch (err: unknown) {
    const status = err instanceof AppError ? err.status : 500;
    const message = err instanceof AppError ? err.message : "Erro interno.";
    res.status(status).json({ error: message });
  }
}
