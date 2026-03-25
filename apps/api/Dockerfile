
FROM node:20.19-alpine AS build

# Permite passar DATABASE_URL no build
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app

# Instala dependências com npm
COPY apps/api/package.json ./package.json
COPY apps/api/tsconfig.json ./tsconfig.json
RUN npm install

# Copia código fonte
COPY apps/api/prisma ./prisma
COPY apps/api/src ./src

# Gera build (pulamos `prisma generate` localmente para evitar incompatibilidades de versão)
RUN npm run build

FROM node:20.19-alpine

WORKDIR /app

# Instala dependências de produção com npm
COPY apps/api/package.json ./package.json
RUN npm install --omit=dev

# Copia artefatos de build e Prisma schema
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 3000

ENV NODE_ENV=production
# Garante DATABASE_URL no runtime
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]