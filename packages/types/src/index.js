/**
 * Tipos de eventos suportados pelo sistema de webhooks.
 */
const EVENT_TYPES = {
  SMS_RECEIVED: "sms_received",
  CALL_RECEIVED: "call_received",
};

/**
 * Status possíveis de um número virtual.
 */
const NUMBER_STATUS = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  CANCELLED: "cancelled",
};

/**
 * Status possíveis de entrega de um webhook event.
 */
const WEBHOOK_EVENT_STATUS = {
  PENDING: "pending",
  DELIVERED: "delivered",
  FAILED: "failed",
};

module.exports = {
  EVENT_TYPES,
  NUMBER_STATUS,
  WEBHOOK_EVENT_STATUS,
};
