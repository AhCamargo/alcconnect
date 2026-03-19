FROM node:20-alpine3.21 AS build

WORKDIR /app

# Install pnpm and dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY ../../pnpm-lock.yaml ./
COPY package.json tsconfig.json ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY prisma ./prisma
COPY src ./src

# Generate Prisma client and build
RUN npx prisma generate
RUN pnpm run build

FROM node:20-alpine3.21

WORKDIR /app

# Install pnpm and dependencies of production
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY ../../pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm install --prod --frozen-lockfile

# Copy build artifacts and Prisma schema
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 3000

ENV NODE_ENV=production

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]