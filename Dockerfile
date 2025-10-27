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
ENTRYPOINT ["sh", "-c", "while true; do sleep 60; done"]
