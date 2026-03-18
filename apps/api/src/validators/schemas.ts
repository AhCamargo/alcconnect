import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  document: z
    .string()
    .regex(
      /^\d{11}$|^\d{14}$/,
      "CPF (11 dígitos) ou CNPJ (14 dígitos) inválido",
    ),
  phone: z
    .string()
    .regex(
      /^\d{10,11}$/,
      "Telefone inválido. Informe DDD + número (10 ou 11 dígitos)",
    ),
  whatsapp: z
    .string()
    .regex(
      /^\d{10,11}$/,
      "WhatsApp inválido. Informe DDD + número (10 ou 11 dígitos)",
    ),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const buyNumberSchema = z.object({
  ddd: z.string().regex(/^\d{2}$/, "DDD inválido. Informe 2 dígitos."),
});

export const createWebhookSchema = z.object({
  url: z.string().url("URL inválida."),
  eventType: z.enum(["incoming_call", "incoming_sms", "incoming_whatsapp"], {
    message:
      "event_type deve ser: incoming_call, incoming_sms ou incoming_whatsapp",
  }),
});

export const createLeadSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  ddd: z.string().regex(/^\d{2}$/, "DDD inválido"),
  uso: z.enum(["whatsapp", "automacao", "pabx", "testes"], {
    message: "Uso pretendido inválido",
  }),
});

// ─── PhoneNumber ────────────────────────────────────────

export const listPhoneNumbersQuerySchema = z.object({
  ddd: z
    .string()
    .regex(/^\d{2}$/, "DDD inválido")
    .optional(),
  type: z
    .enum(["ESIM", "VOIP", "WHATSAPP"], {
      message: "Tipo deve ser: ESIM, VOIP ou WHATSAPP",
    })
    .optional(),
  page: z.coerce.number().int().min(1, "Página mínima é 1").default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100, "Limite máximo é 100")
    .default(20),
});

export const createPhoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Número de telefone é obrigatório")
    .max(20, "Número de telefone muito longo"),
  ddd: z.string().regex(/^\d{2}$/, "DDD inválido. Informe 2 dígitos."),
  region: z.string().min(1, "Região é obrigatória").optional(),
  type: z.enum(["ESIM", "VOIP", "WHATSAPP"], {
    message: "Tipo deve ser: ESIM, VOIP ou WHATSAPP",
  }),
  monthlyPrice: z.coerce.number().min(0, "Preço mensal deve ser positivo"),
  setupPrice: z.coerce
    .number()
    .min(0, "Preço de ativação deve ser positivo")
    .default(0),
  providerRef: z.string().optional(),
});

// ─── Tenant ─────────────────────────────────────────────
export const createTenantSchema = z.object({
  name: z.string().min(1, "Nome do cliente é obrigatório"),
  email: z.string().email("Email inválido"),
  document: z.string().regex(/^\d{11}$|^\d{14}$/, "CPF ou CNPJ inválido"),
  phone: z.string().regex(/^\d{10,11}$/, "Telefone inválido"),
});

// ─── Subscription ───────────────────────────────────────
export const createSubscriptionSchema = z.object({
  tenantId: z.string().uuid("tenantId inválido"),
  planId: z.string().min(1, "Plano é obrigatório"),
});

// ─── Payment ────────────────────────────────────────────
export const createPaymentSchema = z.object({
  orderId: z.string().uuid("orderId inválido"),
  amount: z.coerce.number().min(0.01, "Valor deve ser positivo"),
  method: z.enum(["PIX", "BOLETO", "CREDIT_CARD"], {
    message: "Método deve ser PIX, BOLETO ou CREDIT_CARD",
  }),
});

// ─── Asaas Webhook ──────────────────────────────────────
export const asaasWebhookSchema = z.object({
  event: z.enum([
    "PAYMENT_CONFIRMED",
    "PAYMENT_RECEIVED",
    "PAYMENT_OVERDUE",
    "SUBSCRIPTION_CANCELLED",
  ]),
  payment: z.object({
    id: z.string(),
    status: z.string(),
    customer: z.string(),
    subscription: z.string().optional(),
    value: z.number(),
  }),
});

export const updatePhoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Número de telefone é obrigatório")
    .max(20, "Número de telefone muito longo")
    .optional(),
  ddd: z
    .string()
    .regex(/^\d{2}$/, "DDD inválido. Informe 2 dígitos.")
    .optional(),
  region: z.string().min(1, "Região é obrigatória").optional(),
  type: z
    .enum(["ESIM", "VOIP", "WHATSAPP"], {
      message: "Tipo deve ser: ESIM, VOIP ou WHATSAPP",
    })
    .optional(),
  status: z
    .enum(["AVAILABLE", "RESERVED", "SOLD", "SUSPENDED"], {
      message: "Status deve ser: AVAILABLE, RESERVED, SOLD ou SUSPENDED",
    })
    .optional(),
  monthlyPrice: z.coerce
    .number()
    .min(0, "Preço mensal deve ser positivo")
    .optional(),
  setupPrice: z.coerce
    .number()
    .min(0, "Preço de ativação deve ser positivo")
    .optional(),
  providerRef: z.string().optional(),
});
