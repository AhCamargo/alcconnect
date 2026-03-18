import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth";
import { asaasWebhookSchema, createWebhookSchema } from "../validators/schemas";
import * as webhookService from "../services/webhookService";
import { AppError } from "../errors/AppError";

export async function asaasWebhook(req: Request, res: Response): Promise<void> {
  const parsed = asaasWebhookSchema.safeParse(req.body);
  if (!parsed.success) {
    console.error("[WEBHOOK][Asaas] Dados inválidos", parsed.error.errors);
    res.status(400).json({ error: "Dados do webhook inválidos." });
    return;
  }

  try {
    await webhookService.handleAsaasWebhook(parsed.data);
    res.status(200).json({ message: "Webhook processado com sucesso." });
  } catch (err: any) {
    console.error("[WEBHOOK][Asaas] Erro ao processar webhook", err);
    res
      .status(err.statusCode || 500)
      .json({ error: err.message || "Erro ao processar webhook." });
  }
}

export async function createWebhook(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const parsed = createWebhookSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  const webhook = await webhookService.createWebhook(
    req.userId!,
    parsed.data.url,
    parsed.data.eventType,
  );
  res.status(201).json({ webhook });
}

export async function listWebhooks(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const webhooks = await webhookService.listWebhooks(req.userId!);
  res.json({ webhooks });
}

export async function deleteWebhook(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    await webhookService.deleteWebhook(req.userId!, req.params.id as string);
    res.json({ message: "Webhook removido." });
  } catch (err: unknown) {
    const status = err instanceof AppError ? err.status : 500;
    const message = err instanceof AppError ? err.message : "Erro interno.";
    res.status(status).json({ error: message });
  }
}

export async function listEvents(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const events = await webhookService.listEvents(req.userId!);
  res.json({ events });
}
