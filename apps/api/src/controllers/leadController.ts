import type { Request, Response } from "express";
import { createLeadSchema } from "../validators/schemas";
import * as leadService from "../services/leadService";

export async function createLead(req: Request, res: Response): Promise<void> {
  const parsed = createLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ success: false, error: parsed.error.errors[0].message });
    return;
  }

  try {
    await leadService.createLead(
      parsed.data.nome,
      parsed.data.email,
      parsed.data.ddd,
      parsed.data.uso,
    );
    res.json({ success: true });
  } catch (err) {
    console.error("[ERRO] Lead:", err instanceof Error ? err.message : err);
    res
      .status(500)
      .json({ success: false, error: "Erro ao processar solicitação." });
  }
}
