import type { Prisma } from "@prisma/client";
import { prisma } from "../database/prisma";
import { AppError } from "../errors/AppError";

export async function createWebhook(
  userId: string,
  url: string,
  eventType: string,
) {
  return prisma.webhook.create({
    data: { url, eventType, userId },
  });
}

export async function listWebhooks(userId: string) {
  return prisma.webhook.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteWebhook(userId: string, webhookId: string) {
  const webhook = await prisma.webhook.findFirst({
    where: { id: webhookId, userId },
  });
  if (!webhook) {
    throw new AppError(404, "Webhook não encontrado.");
  }
  await prisma.webhook.delete({ where: { id: webhook.id } });
}

export async function listEvents(userId: string) {
  const webhooks = await prisma.webhook.findMany({
    where: { userId },
    select: { id: true },
  });

  return prisma.webhookEvent.findMany({
    where: { webhookId: { in: webhooks.map((w) => w.id) } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
export async function handleAsaasWebhook(payload: any) {
  // Busca pagamento pelo asaasId
  const payment = await prisma.payment.findUnique({
    where: { asaasId: payload.payment.id },
  });
  if (!payment) {
    console.error(
      `[WEBHOOK][Asaas] Pagamento não encontrado: ${payload.payment.id}`,
    );
    throw new AppError(404, "Pagamento não encontrado.");
  }

  // Idempotência: não processa se já está confirmado
  if (payment.status === "PAYMENT_CONFIRMED") {
    console.log(`[WEBHOOK][Asaas] Pagamento já confirmado: ${payment.id}`);
    return;
  }

  // Atualiza status do pagamento
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: payload.event,
      webhookPayload: payload,
      paidAt:
        payload.event === "PAYMENT_CONFIRMED" ? new Date() : payment.paidAt,
    },
  });

  // Ativa tenant se pagamento confirmado
  if (payload.event === "PAYMENT_CONFIRMED") {
    try {
      await activateTenant(payment.tenantId);
      console.log(`[WEBHOOK][Asaas] Tenant ativado: ${payment.tenantId}`);
    } catch (err) {
      console.error(
        `[WEBHOOK][Asaas] Erro ao ativar tenant: ${payment.tenantId}`,
        err,
      );
    }
  }

  // Log estruturado
  console.log(
    `[WEBHOOK][Asaas] Processado: paymentId=${payment.id} event=${payload.event}`,
  );
}

export async function triggerWebhook(
  eventType: string,
  payload: Record<string, unknown>,
) {
  const webhooks = await prisma.webhook.findMany({
    where: { eventType, active: true },
  });

  const results = await Promise.allSettled(
    webhooks.map(async (webhook) => {
      const body = JSON.stringify({
        event: eventType,
        timestamp: new Date().toISOString(),
        ...payload,
      });

      try {
        const response = await fetch(webhook.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          signal: AbortSignal.timeout(10000),
        });

        const status = response.ok ? "delivered" : "failed";
        await prisma.webhookEvent.create({
          data: {
            eventType,
            payload: {
              ...payload,
              responseStatus: response.status,
            } as Prisma.InputJsonValue,
            status,
            webhookId: webhook.id,
          },
        });

        console.log(
          `[WEBHOOK] ${status} → ${webhook.url} (${response.status})`,
        );
        return { webhookId: webhook.id, status };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        await prisma.webhookEvent.create({
          data: {
            eventType,
            payload: { ...payload, error: message } as Prisma.InputJsonValue,
            status: "failed",
            webhookId: webhook.id,
          },
        });

        console.error(`[WEBHOOK] failed → ${webhook.url}: ${message}`);
        return { webhookId: webhook.id, status: "failed" as const };
      }
    }),
  );

  return results.map((r) =>
    r.status === "fulfilled" ? r.value : { status: "failed" as const },
  );
}
