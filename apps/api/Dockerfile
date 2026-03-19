FROM node:20-alpine3.21 AS build

WORKDIR /app

# Instala pnpm e dependências
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-lock.yaml ./
COPY apps/api/package.json ./package.json
COPY apps/api/tsconfig.json ./tsconfig.json
RUN pnpm install --no-frozen-lockfile

# Copia código fonte
COPY apps/api/prisma ./prisma
COPY apps/api/src ./src

# Gera Prisma Client e build
RUN npx prisma generate
RUN pnpm run build

FROM node:20-alpine3.21

WORKDIR /app

# Instala pnpm e dependências de produção
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-lock.yaml ./
COPY apps/api/package.json ./package.json
RUN pnpm install --prod --no-frozen-lockfile

# Copia artefatos de build e Prisma schema
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 3000

ENV NODE_ENV=production

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]