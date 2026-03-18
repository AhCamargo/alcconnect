export interface AdminPhoneNumber {
  id: string;
  phoneNumber: string;
  ddd: string;
  region: string;
  type: "ESIM" | "VOIP" | "WHATSAPP";
  status: "AVAILABLE" | "RESERVED" | "SOLD" | "SUSPENDED";
  priceMonthly: number;
  priceActivation: number;
  providerRef: string;
  clientName?: string;
}

export async function getAllNumbers() {
  const { data } = await api.get("/phone-numbers/admin/all");
  return data.numbers as AdminPhoneNumber[];
}

export async function createNumber(payload: {
  phoneNumber: string;
  ddd: string;
  region: string;
  type: "ESIM" | "VOIP" | "WHATSAPP";
  priceMonthly: number;
  priceActivation: number;
  providerRef: string;
}) {
  const { data } = await api.post("/phone-numbers", payload);
  return data.number as AdminPhoneNumber;
}

export async function updateNumber(
  id: string,
  payload: {
    phoneNumber: string;
    ddd: string;
    region: string;
    type: "ESIM" | "VOIP" | "WHATSAPP";
    priceMonthly: number;
    priceActivation: number;
    providerRef: string;
  },
) {
  const { data } = await api.put(`/phone-numbers/${id}`, payload);
  return data.number as AdminPhoneNumber;
}

export async function deleteNumber(id: string) {
  await api.delete(`/phone-numbers/${id}`);
}
import { api } from "@/lib/api";

export interface AvailablePhoneNumber {
  id: string;
  phoneNumber: string;
  ddd: string;
  region: string;
  type: "ESIM" | "VOIP" | "WHATSAPP";
  priceMonthly: number;
  priceActivation: number;
}

export interface MyPhoneNumber {
  id: string;
  phoneNumber: string;
  ddd: string;
  type: "ESIM" | "VOIP" | "WHATSAPP";
  status: "ativo" | "suspenso" | "expirado";
  activatedAt: string;
  expiresAt: string;
}

export interface GetAvailableNumbersParams {
  ddd?: string;
  type?: "ESIM" | "VOIP" | "WHATSAPP";
  page?: number;
  pageSize?: number;
}

export async function getAvailableNumbers(
  params: GetAvailableNumbersParams = {},
) {
  const { data } = await api.get("/phone-numbers", { params });
  return data as { numbers: AvailablePhoneNumber[]; total: number };
}

export async function getMyNumbers() {
  const { data } = await api.get("/phone-numbers/mine");
  return data.numbers as MyPhoneNumber[];
}
