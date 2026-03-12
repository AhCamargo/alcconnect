FROM node:20-alpine

ENV CI=true

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile --filter @alcconnect/api

WORKDIR /app/apps/api

COPY apps/api/tsconfig.json ./
COPY apps/api/prisma ./prisma
RUN pnpm db:generate

COPY apps/api/src ./src
RUN pnpm build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
