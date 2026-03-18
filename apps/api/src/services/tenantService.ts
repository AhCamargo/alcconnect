export async function activateTenant(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) throw new Error("Tenant não encontrado.");
  if (tenant.status === "ACTIVE") return;
  await prisma.tenant.update({
    where: { id: tenantId },
    data: { status: "ACTIVE" },
  });
}
import { prisma } from "../database/prisma";

export async function createTenant(data: {
  name: string;
  email: string;
  document: string;
  phone: string;
}) {
  // Verifica duplicidade
  const exists = await prisma.tenant.findFirst({
    where: {
      OR: [{ email: data.email }, { document: data.document }],
    },
  });
  if (exists) throw new Error("Cliente já existe.");

  return prisma.tenant.create({ data });
}
