import type { Request, Response } from "express";
import { createTenantSchema } from "../validators/schemas";
import * as tenantService from "../services/tenantService";

export async function createTenant(req: Request, res: Response): Promise<void> {
  const parsed = createTenantSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  try {
    const tenant = await tenantService.createTenant(parsed.data);
    res.status(201).json({ tenant });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar cliente." });
  }
}
