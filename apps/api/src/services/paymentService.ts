import { prisma } from "../database/prisma";

export async function createPayment(data: {
  orderId: string;
  amount: number;
  method: "PIX" | "BOLETO" | "CREDIT_CARD";
}) {
  // Cria pagamento vinculado ao pedido
  return prisma.payment.create({
    data: {
      orderId: data.orderId,
      amount: data.amount,
      method: data.method,
      status: "PENDING",
    },
  });
}
