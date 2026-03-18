FROM node:20-alpine3.21 AS build

WORKDIR /app

# Copy source for building the API
COPY package.json package-lock.json tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npm ci

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine3.21

WORKDIR /app

# Install runtime dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy build artifacts and Prisma schema
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 3000

ENV NODE_ENV=production

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]

