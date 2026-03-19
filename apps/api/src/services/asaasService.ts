import axios from "axios";

const ASAAS_API_KEY = process.env.ASAAS_API_KEY || "";
const ASAAS_BASE_URL =
  process.env.ASAAS_SANDBOX === "true"
    ? "https://sandbox.asaas.com/api/v3"
    : "https://www.asaas.com/api/v3";

const client = axios.create({
  baseURL: ASAAS_BASE_URL,
  headers: {
    Authorization: `Bearer ${ASAAS_API_KEY}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export async function createPayment(data: any) {
  // Mock: retorna objeto de pagamento fake se não houver credencial
  if (!ASAAS_API_KEY) {
    return {
      id: "mock-payment-id",
      status: "PENDING",
      paymentUrl: "https://sandbox.asaas.com/pay/mock-payment-id",
    };
  }
  // ...implementação real quando credencial disponível
  // return await client.post("/payments", data);
}

export async function getPayment(paymentId: string) {
  if (!ASAAS_API_KEY) {
    return {
      id: paymentId,
      status: "PENDING",
      paymentUrl: "https://sandbox.asaas.com/pay/mock-payment-id",
    };
  }
  // ...implementação real
  // return await client.get(`/payments/${paymentId}`);
}
