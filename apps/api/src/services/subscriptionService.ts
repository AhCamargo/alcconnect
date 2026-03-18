import { prisma } from "../database/prisma";

export async function createSubscription(data: {
  tenantId: string;
  planId: string;
}) {
  // Cria assinatura vinculada ao tenant
  return prisma.subscription.create({
    data: {
      tenantId: data.tenantId,
      planId: data.planId,
      status: "ACTIVE",
    },
  });
}
