import type { Request, Response } from "express";
import { createPaymentSchema } from "../validators/schemas";
import * as paymentService from "../services/paymentService";

export async function createPayment(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = createPaymentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  try {
    const payment = await paymentService.createPayment(parsed.data);
    res.status(201).json({ payment });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar pagamento." });
  }
}
