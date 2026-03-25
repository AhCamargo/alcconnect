import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../database/prisma";
import { AppError } from "../errors/AppError";
import { randomUUID } from "crypto";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  document: string;
  phone: string;
  whatsapp: string;
  tenantId: string;
}) {
  console.log("[registerUser] dados recebidos:", data);
  const existsEmail = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existsEmail) {
    throw new AppError(409, "Email já cadastrado.");
  }

  const existsDoc = await prisma.user.findUnique({
    where: { document: data.document },
  });
  if (existsDoc) {
    throw new AppError(409, "CPF/CNPJ já cadastrado.");
  }

  const hashed = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
      document: data.document,
      phone: data.phone,
      whatsapp: data.whatsapp,
      tenantId: data.tenantId || randomUUID(),
    },
  });

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(401, "Credenciais inválidas.");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new AppError(401, "Credenciais inválidas.");
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
}

export async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  if (!user) {
    throw new AppError(404, "Usuário não encontrado.");
  }
  return user;
}
