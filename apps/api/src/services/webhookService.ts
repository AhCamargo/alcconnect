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
