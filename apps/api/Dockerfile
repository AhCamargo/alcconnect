FROM node:20-alpine3.21 AS build

WORKDIR /app

# Install pnpm and copy monorepo lockfiles
RUN npm install -g pnpm
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy only the API workspace sources
COPY apps/api/package.json apps/api/package.json
COPY apps/api/tsconfig.json apps/api/tsconfig.json
COPY apps/api/prisma apps/api/prisma
COPY apps/api/src apps/api/src

# Install dependencies only for the API workspace
RUN pnpm install --frozen-lockfile --filter @alcconnect/api...

WORKDIR /app/apps/api
RUN pnpm prisma generate
RUN pnpm build

FROM node:20-alpine3.21

WORKDIR /app

# Install pnpm for runtime (needed to run prisma migrate)
RUN npm install -g pnpm

# Copy runtime deps and build artifacts
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY apps/api/package.json ./apps/api/package.json

EXPOSE 3000

ENV NODE_ENV=production

CMD ["sh", "-c", "cd apps/api && npx prisma migrate deploy && node dist/server.js"]

