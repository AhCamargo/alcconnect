FROM node:20-alpine3.21 AS build

WORKDIR /app

COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

COPY apps/api/package.json ./apps/api/
COPY apps/api/tsconfig.json ./apps/api/
COPY apps/api/prisma ./apps/api/prisma
COPY apps/api/src ./apps/api/src

RUN npm install -g pnpm && pnpm install --frozen-lockfile

WORKDIR /app/apps/api
RUN pnpm exec prisma generate
RUN pnpm run build

WORKDIR /app

FROM node:20-alpine3.21

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar dependências da raiz
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY apps/api/package.json ./apps/api/

# Instalar apenas dependências de produção
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

# Copiar artifacts do build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY apps/api/prisma ./apps/api/prisma

EXPOSE 3000

ENV NODE_ENV=production

CMD ["sh", "-c", "cd apps/api && npx prisma migrate deploy && node dist/server.js"]

