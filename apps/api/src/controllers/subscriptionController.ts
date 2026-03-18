import type { Request, Response } from "express";
import { createSubscriptionSchema } from "../validators/schemas";
import * as subscriptionService from "../services/subscriptionService";

export async function createSubscription(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = createSubscriptionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  try {
    const subscription = await subscriptionService.createSubscription(
      parsed.data,
    );
    res.status(201).json({ subscription });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar assinatura." });
  }
}
