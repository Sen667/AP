# -------- BUILD --------
FROM node:20-slim AS builder
WORKDIR /app

ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN apt-get update && apt-get install -y openssl --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts .

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
RUN npx prisma generate --config prisma.config.ts

COPY . .
RUN npm run build

# -------- PROD --------
FROM node:20-slim AS prod
WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl netcat-openbsd openssl chromium \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*


ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm install -g npm@latest

RUN useradd -m fripouilles

# Copie des fichiers de build
COPY --from=builder --chown=fripouilles:fripouilles /app/package*.json ./
COPY --from=builder --chown=fripouilles:fripouilles /app/node_modules ./node_modules
COPY --from=builder --chown=fripouilles:fripouilles /app/dist ./dist
COPY --from=builder --chown=fripouilles:fripouilles /app/prisma ./prisma
COPY --from=builder --chown=fripouilles:fripouilles /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=fripouilles:fripouilles /app/generated ./generated

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV NODE_ENV=production
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
