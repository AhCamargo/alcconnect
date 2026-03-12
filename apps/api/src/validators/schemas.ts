import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
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
