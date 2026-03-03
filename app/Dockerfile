# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ---------- Runtime Stage ----------
FROM node:20-alpine

WORKDIR /app

# Instalar cliente do Postgres para rodar migration/seed
RUN apk add --no-cache postgresql-client

COPY --from=builder /app ./

# Copiar pasta de banco
COPY ../db /app/db

RUN chmod +x migrate.sh
RUN chmod +x seed.sh

EXPOSE 8080

CMD ["npm", "run", "start"]