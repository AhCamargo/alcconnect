import { prisma } from "../database/prisma";
import { AppError } from "../errors/AppError";

function generatePhoneNumber(ddd: string): string {
  const suffix = Math.floor(10000000 + Math.random() * 90000000);
  return `+55${ddd}9${suffix}`;
}

export async function listNumbers(userId: string) {
  return prisma.number.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function buyNumber(userId: string, ddd: string) {
  const phoneNumber = generatePhoneNumber(ddd);
  return prisma.number.create({
    data: { phoneNumber, ddd, status: "active", userId },
  });
}

export async function getNumber(userId: string, numberId: string) {
  const number = await prisma.number.findFirst({
    where: { id: numberId, userId },
  });
  if (!number) {
    throw new AppError(404, "Número não encontrado.");
  }
  return number;
}

export async function getNumberEvents(userId: string, numberId: string) {
  const number = await prisma.number.findFirst({
    where: { id: numberId, userId },
  });
  if (!number) {
    throw new AppError(404, "Número não encontrado.");
  }

  return prisma.webhookEvent.findMany({
    where: {
      payload: { path: ["number"], equals: number.phoneNumber },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
