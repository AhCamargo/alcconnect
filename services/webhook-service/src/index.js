/**
 * Webhook Service — standalone dispatcher
 *
 * No MVP este serviço roda integrado na API (apps/api/src/services/webhookService.js).
 * Quando escalar, este módulo pode virar um worker independente
 * consumindo eventos de uma fila (Redis, RabbitMQ, etc).
 */

async function dispatchWebhook(url, eventType, payload) {
  const body = JSON.stringify({
    event: eventType,
    timestamp: new Date().toISOString(),
    ...payload,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    signal: AbortSignal.timeout(10000),
  });

  return {
    status: response.ok ? "delivered" : "failed",
    httpStatus: response.status,
  };
}

module.exports = { dispatchWebhook };
