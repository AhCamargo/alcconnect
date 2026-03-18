FROM node:20-alpine3.21 AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci

# Copy source
COPY prisma ./prisma
COPY src ./src

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine3.21

WORKDIR /app

# Install only runtime deps
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy build artifacts and Prisma schema
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 3000

ENV NODE_ENV=production

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]