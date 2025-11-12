#!/bin/bash
#set -e  # Encerra se algum comando falhar // descomentar caso necessário

# ==========================================================
# Cores e estilos
# ==========================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
CYAN='\033[1;36m'
BOLD='\033[1m'
NC='\033[0m'

# ==========================================================
# Configurações
# ==========================================================
COMPOSE_DIR="../Docker/docker-compose.yaml"   
DOCKER_IMAGE_NAME="k6testmanager:latest"   

# ==========================================================
# Funções utilitárias
# ==========================================================

build_docker_image() {
    echo -e "\n${BOLD}${BLUE}Buildando imagem Docker...${NC}"
    docker build -t "$DOCKER_IMAGE_NAME" . || {
        echo -e "${RED}Falha ao buildar imagem Docker${NC}"
        exit 1
    }
    echo -e "${GREEN}Imagem Docker '$DOCKER_IMAGE_NAME' criada com sucesso${NC}"
}

run_docker_compose() {
    echo -e "\n${BOLD}${BLUE} Subindo serviços com Docker Compose...${NC}"
    if [ ! -d "$COMPOSE_DIR" ]; then
        echo -e "${RED}Diretório $COMPOSE_DIR não encontrado${NC}"
        exit 1
    fi

    pushd "$COMPOSE_DIR" >/dev/null
    docker compose up -d || {
        echo -e "${RED}Falha ao executar docker compose up${NC}"
        popd >/dev/null
        exit 1
    }
    popd >/dev/null

    echo -e "${GREEN}Serviços do Compose iniciados com sucesso${NC}"
}

verify_docker() {
    for service in grafana influxdb; do
        if docker ps --format '{{.Names}}' | grep -qE "^${service}$"; then
            echo -e "${GREEN}${service^} está em execução${NC}"
        else
            echo -e "${YELLOW}Iniciando serviço $service...${NC}"
            docker start "$service" >/dev/null 2>&1 || {
                echo -e "❌ ${RED}Falha ao iniciar o serviço $service${NC}"
                exit 1
            }
            sleep 3
            if ! docker ps --format '{{.Names}}' | grep -qE "^${service}$"; then
                echo -e "${RED}Serviço $service não está em execução após tentativa.${NC}"
                exit 1
            fi
            echo -e "${GREEN}${service^} iniciado com sucesso${NC}"
        fi
    done
}

run_test_file() {
    local type=$1
    local test_file=$2

    echo -e "\n${CYAN}${BOLD}Executando teste: ${test_file}${NC}"

    if [[ $type == "api" ]]; then
        k6 run --out influxdb=http://influxdb:8086/k6 --tag test_type=api "tests/api/$test_file"
    else
        K6_BROWSER_HEADLESS=true k6 run --out influxdb=http://influxdb:8086/k6 --tag test_type=browser "tests/browser/$test_file"
    fi
}

finish_message() {
    echo -e "\n${BLUE}${BOLD}==============================================================${NC}"
    echo -e "${GREEN}Todos os testes foram executados com sucesso${NC}"
    echo -e "Acesse ${CYAN}http://localhost:3000${NC} para visualizar as métricas no Grafana"
    echo -e "${BLUE}${BOLD}==============================================================${NC}"
}

# ==========================================================
# Execução principal
# ==========================================================

echo -e "${BOLD}${BLUE}Iniciando processo de build e preparação de ambiente...${NC}"

build_docker_image
run_docker_compose
verify_docker

sleep 2

echo -e "\n${BOLD}${BLUE}Iniciando execução de testes de API...${NC}"
for test_file in $(find tests/api -type f -name "*.js" | sort); do
    run_test_file "api" "$(basename "$test_file")"
done

echo -e "\n${BOLD}${BLUE}Iniciando execução de testes de Browser...${NC}"
for test_file in $(find tests/browser -type f -name "*.js" | sort); do
    run_test_file "browser" "$(basename "$test_file")"
done

finish_message
