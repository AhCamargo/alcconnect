import { AppDataSource } from "../database/data-source";
import { Webhook } from "../entities/Webhook";
import { WebhookEvent } from "../entities/WebhookEvent";
import { Payment } from "../entities/Payment";
import { AppError } from "../errors/AppError";

export async function createWebhook(
  userId: string,
  url: string,
  eventType: string,
) {
  const repo = AppDataSource.getRepository(Webhook);
  const webhook = repo.create({ url, eventType, userId });
  return repo.save(webhook);
}

export async function listWebhooks(userId: string) {
  const repo = AppDataSource.getRepository(Webhook);
  return repo.find({
    where: { userId },
    order: { createdAt: "DESC" },
  });
}

export async function deleteWebhook(userId: string, webhookId: string) {
  const repo = AppDataSource.getRepository(Webhook);
  const webhook = await repo.findOneBy({ id: webhookId, userId });
  if (!webhook) {
    throw new AppError(404, "Webhook não encontrado.");
  }
  await repo.delete({ id: webhook.id });
}

export async function listEvents(userId: string) {
  const webhookRepo = AppDataSource.getRepository(Webhook);
  const eventRepo = AppDataSource.getRepository(WebhookEvent);
  const webhooks = await webhookRepo.find({ where: { userId } });
  const webhookIds = webhooks.map((w) => w.id);
  if (webhookIds.length === 0) return [];
  return eventRepo.find({
    where: { webhookId: (id: string) => webhookIds.includes(id) },
    order: { createdAt: "DESC" },
    take: 50,
  });
}

function mapAsaasEventToPaymentStatus(event: string) {
  switch (event) {
    case "PAYMENT_CONFIRMED":
      return "CONFIRMED" as const;
    case "PAYMENT_OVERDUE":
      return "FAILED" as const;
    case "SUBSCRIPTION_CANCELLED":
      return "REFUNDED" as const;
    case "PAYMENT_RECEIVED":
      return "CONFIRMED" as const;
    default:
      return "PENDING" as const;
  }
}

export async function handleAsaasWebhook(payload: any) {
  // Busca pagamento pelo asaasId
  const paymentRepo = AppDataSource.getRepository(Payment);
  const payment = await paymentRepo.findOneBy({ asaasId: payload.payment.id });
  if (!payment) {
    console.error(
      `[WEBHOOK][Asaas] Pagamento não encontrado: ${payload.payment.id}`,
    );
    throw new AppError(404, "Pagamento não encontrado.");
  }

  // Idempotência: não processa se já está confirmado
  if (payment.status === "CONFIRMED") {
    console.log(`[WEBHOOK][Asaas] Pagamento já confirmado: ${payment.id}`);
    return;
  }

  // Atualiza status do pagamento
  const newStatus = mapAsaasEventToPaymentStatus(payload.event);

  payment.status = newStatus;
  payment.webhookPayload = payload;
  payment.paidAt = newStatus === "CONFIRMED" ? new Date() : payment.paidAt;
  await paymentRepo.save(payment);

  // Log estruturado
  console.log(
    `[WEBHOOK][Asaas] Processado: paymentId=${payment.id} event=${payload.event}`,
  );
}

export async function triggerWebhook(
  eventType: string,
  payload: Record<string, unknown>,
) {
  const webhookRepo = AppDataSource.getRepository(Webhook);
  const webhooks = await webhookRepo.find({ where: { eventType, active: true } });

  const eventRepo = AppDataSource.getRepository(WebhookEvent);
  await Promise.allSettled(
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
        // Aqui você pode salvar o evento no banco, se necessário
      } catch (err) {
        // Trate erros de envio de webhook
      }
    })
  );
}
