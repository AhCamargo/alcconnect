import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../database/prisma";
import { AppError } from "../errors/AppError";

export async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    throw new AppError(409, "Email já cadastrado.");
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
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
