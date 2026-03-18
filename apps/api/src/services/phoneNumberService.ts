import { prisma } from "../database/prisma";
import { AppError } from "../errors/AppError";
import type { NumberType, NumberStatus, Prisma } from "@prisma/client";

interface ListAvailableFilters {
  ddd?: string;
  type?: NumberType;
  page: number;
  limit: number;
}

export async function listAvailable(filters: ListAvailableFilters) {
  const where: Prisma.PhoneNumberWhereInput = {
    status: "AVAILABLE",
    ...(filters.ddd && { ddd: filters.ddd }),
    ...(filters.type && { type: filters.type }),
  };

  const [data, total] = await Promise.all([
    prisma.phoneNumber.findMany({
      where,
      select: {
        id: true,
        phoneNumber: true,
        ddd: true,
        region: true,
        type: true,
        monthlyPrice: true,
        setupPrice: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    }),
    prisma.phoneNumber.count({ where }),
  ]);

  return { data, total, page: filters.page, limit: filters.limit };
}

export async function listMine(userId: string) {
  return prisma.phoneNumber.findMany({
    where: { userId },
    select: {
      id: true,
      phoneNumber: true,
      ddd: true,
      region: true,
      type: true,
      status: true,
      monthlyPrice: true,
      setupPrice: true,
      activatedAt: true,
      expiresAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getById(id: string, userId: string) {
  const phoneNumber = await prisma.phoneNumber.findUnique({
    where: { id },
    select: {
      id: true,
      phoneNumber: true,
      ddd: true,
      region: true,
      type: true,
      status: true,
      monthlyPrice: true,
      setupPrice: true,
      userId: true,
      activatedAt: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!phoneNumber) {
    throw new AppError(404, "Número não encontrado.");
  }

  if (phoneNumber.userId !== userId) {
    throw new AppError(403, "Você não tem permissão para acessar este número.");
  }

  return phoneNumber;
}

export async function listAll(filters: ListAvailableFilters) {
  const where: Prisma.PhoneNumberWhereInput = {
    ...(filters.ddd && { ddd: filters.ddd }),
    ...(filters.type && { type: filters.type }),
  };

  const [data, total] = await Promise.all([
    prisma.phoneNumber.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    }),
    prisma.phoneNumber.count({ where }),
  ]);

  return { data, total, page: filters.page, limit: filters.limit };
}

export async function create(data: {
  phoneNumber: string;
  ddd: string;
  region?: string;
  type: NumberType;
  monthlyPrice: number;
  setupPrice: number;
  providerRef?: string;
}) {
  const exists = await prisma.phoneNumber.findUnique({
    where: { phoneNumber: data.phoneNumber },
  });

  if (exists) {
    throw new AppError(409, "Este número já está cadastrado.");
  }

  return prisma.phoneNumber.create({
    data: {
      phoneNumber: data.phoneNumber,
      ddd: data.ddd,
      region: data.region,
      type: data.type,
      monthlyPrice: data.monthlyPrice,
      setupPrice: data.setupPrice,
      providerRef: data.providerRef,
    },
  });
}

export async function update(
  id: string,
  data: {
    phoneNumber?: string;
    ddd?: string;
    region?: string;
    type?: NumberType;
    status?: NumberStatus;
    monthlyPrice?: number;
    setupPrice?: number;
    providerRef?: string;
  },
) {
  const phoneNumber = await prisma.phoneNumber.findUnique({ where: { id } });

  if (!phoneNumber) {
    throw new AppError(404, "Número não encontrado.");
  }

  if (data.phoneNumber && data.phoneNumber !== phoneNumber.phoneNumber) {
    const exists = await prisma.phoneNumber.findUnique({
      where: { phoneNumber: data.phoneNumber },
    });
    if (exists) {
      throw new AppError(409, "Este número já está cadastrado.");
    }
  }

  return prisma.phoneNumber.update({
    where: { id },
    data,
  });
}

export async function remove(id: string) {
  const phoneNumber = await prisma.phoneNumber.findUnique({ where: { id } });

  if (!phoneNumber) {
    throw new AppError(404, "Número não encontrado.");
  }

  if (phoneNumber.status !== "AVAILABLE") {
    throw new AppError(
      400,
      "Só é possível remover números com status AVAILABLE.",
    );
  }

  return prisma.phoneNumber.delete({ where: { id } });
}
