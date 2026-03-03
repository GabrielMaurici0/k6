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

#---------- Exec Stage ----------

FROM grafana/k6:master-with-browser

USER root 
WORKDIR /usr/src/k6-app

RUN apk update && \
    apk add --no-cache nodejs npm bash

RUN npm install --save-dev @types/pg && \
    npm install --save pg && \
    npm install --save pg-copy-streams

COPY . .

RUN chmod +x ./run.sh

# Comando padrão de execução
ENTRYPOINT [ "sh", "-c", "node", "../k6/database/triggerFilesGenerator.mjs", "&&", "while true; do sleep 60; done"]

