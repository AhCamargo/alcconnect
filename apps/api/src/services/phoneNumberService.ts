import AppDataSource from "../database/data-source";
import { PhoneNumber } from "../entities/PhoneNumber";
import { AppError } from "../errors/AppError";

interface ListAvailableFilters {
  ddd?: string;
  type?: string;
  page: number;
  limit: number;
}

export async function listAvailable(filters: ListAvailableFilters) {
  const repo = AppDataSource.getRepository(PhoneNumber);

  const qb = repo.createQueryBuilder("pn").where("pn.status = :status", {
    status: "AVAILABLE",
  });
  if (filters.ddd) qb.andWhere("pn.ddd = :ddd", { ddd: filters.ddd });
  if (filters.type) qb.andWhere("pn.type = :type", { type: filters.type });

  const [data, total] = await Promise.all([
    qb
      .select([
        "pn.id",
        "pn.phoneNumber",
        "pn.ddd",
        "pn.region",
        "pn.type",
        "pn.monthlyPrice",
        "pn.setupPrice",
        "pn.createdAt",
      ])
      .orderBy("pn.createdAt", "DESC")
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .getRawMany(),
    qb.getCount(),
  ]);

  return { data, total, page: filters.page, limit: filters.limit };
}

export async function listMine(userId: string) {
  const repo = AppDataSource.getRepository(PhoneNumber);
  return repo.find({
    where: { userId },
    order: { createdAt: "DESC" },
    select: [
      "id",
      "phoneNumber",
      "ddd",
      "region",
      "type",
      "status",
      "monthlyPrice",
      "setupPrice",
      "activatedAt",
      "expiresAt",
      "createdAt",
    ],
  });
}

export async function getById(id: string, userId: string) {
  const repo = AppDataSource.getRepository(PhoneNumber);
  const phoneNumber = await repo.findOne({ where: { id } });

  if (!phoneNumber) {
    throw new AppError(404, "Número não encontrado.");
  }

  if (phoneNumber.userId !== userId) {
    throw new AppError(403, "Você não tem permissão para acessar este número.");
  }

  return phoneNumber;
}

export async function listAll(filters: ListAvailableFilters) {
  const repo = AppDataSource.getRepository(PhoneNumber);
  const qb = repo.createQueryBuilder("pn");
  if (filters.ddd) qb.andWhere("pn.ddd = :ddd", { ddd: filters.ddd });
  if (filters.type) qb.andWhere("pn.type = :type", { type: filters.type });

  const [data, total] = await Promise.all([
    qb
      .orderBy("pn.createdAt", "DESC")
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .getMany(),
    qb.getCount(),
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
  const repo = AppDataSource.getRepository(PhoneNumber);
  const exists = await repo.findOneBy({ phoneNumber: data.phoneNumber });
  if (exists) {
    throw new AppError(409, "Este número já está cadastrado.");
  }

  const pn = repo.create({
    phoneNumber: data.phoneNumber,
    ddd: data.ddd,
    region: data.region,
    type: data.type as string,
    monthlyPrice: String(data.monthlyPrice),
    setupPrice: String(data.setupPrice),
    providerRef: data.providerRef,
  });
  return repo.save(pn);
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
  const repo = AppDataSource.getRepository(PhoneNumber);
  const phoneNumber = await repo.findOne({ where: { id } });

  if (!phoneNumber) {
    throw new AppError(404, "Número não encontrado.");
  }

  if (data.phoneNumber && data.phoneNumber !== phoneNumber.phoneNumber) {
    const exists = await repo.findOneBy({ phoneNumber: data.phoneNumber });
    if (exists) {
      throw new AppError(409, "Este número já está cadastrado.");
    }
  }

  await repo.update(id, data as any);
  return repo.findOne({ where: { id } });
}

export async function remove(id: string) {
  const repo = AppDataSource.getRepository(PhoneNumber);
  const phoneNumber = await repo.findOne({ where: { id } });
  if (!phoneNumber) {
    throw new AppError(404, "Número não encontrado.");
  }
  if (phoneNumber.status !== "AVAILABLE") {
    throw new AppError(
      400,
      "Só é possível remover números com status AVAILABLE.",
    );
  }
  await repo.delete(id);
  return { id };
}
