#!/bin/bash

#  CORES E ESTILOS
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
CYAN='\033[1;36m'
BOLD='\033[1m'
REV='\033[7m'   # Inversão de cor (highlight)
NC='\033[0m'    # Sem cor

#  FUNÇÕES DE INTERFACE
draw_line() {
    printf '═%.0s' $(seq 1 72)
}

# Função genérica para menu com navegação por setas
menu_with_arrows() {
    local title=$1
    shift
    local options=("$@")
    local selected=0
    local key
    local width=79
    local line
    line=$(printf '═%.0s' $(seq 1 $width))

    while true; do
        clear
        echo -e "${BLUE}${BOLD}╔${line}╗${NC}"

        # título simples (sem emoji)
        local title_len=${#title}
        local pad_left=$(( (width - title_len) / 2 ))
        local pad_right=$(( width - pad_left - title_len ))
        printf "${BLUE}${BOLD}║%*s%s%*s║${NC}\n" $pad_left "" "$title" $pad_right ""

        echo -e "${BLUE}${BOLD}╠${line}╣${NC}"

        # campo fixo: 72 colunas para texto
        for i in "${!options[@]}"; do
            local number=$(printf "%2d" $((i+1)))
            local text="${options[$i]}"
            if [[ $i -eq $selected ]]; then
                echo -ne "${REV}"
                printf "║  ${YELLOW}%s) %-72s ║${NC}\n" "$number" "$text"
            else
                printf "${BLUE}${BOLD}║  ${YELLOW}%s)${NC} %-72s ${BLUE}${BOLD}║${NC}\n" \
                    "$number" "$text"
            fi
        done

        echo -e "${BLUE}${BOLD}╚${line}╝${NC}"
        echo -e "${BOLD}Use ↑ ↓ para navegar, Enter para selecionar, 'q' para voltar.${NC}"

        read -rsn1 key
        if [[ $key == $'\x1b' ]]; then
            read -rsn2 key
            case $key in
                "[A") ((selected--)); ((selected < 0)) && selected=$((${#options[@]} - 1)) ;;
                "[B") ((selected++)); ((selected >= ${#options[@]})) && selected=0 ;;
            esac
        elif [[ $key == "" ]]; then
            return $selected
        elif [[ $key == "q" ]]; then
            return 255
        fi
    done
}


finish_message() {
    local width=79
    local line
    line=$(printf '═%.0s' $(seq 1 $width))

    echo -e "${BLUE}${BOLD}╔${line}╗${NC}"
    printf "${BLUE}${BOLD}║ %-79s ║${NC}\n" "✅ Execução Finalizada com Sucesso"
    printf "${BLUE}${BOLD}║ %-79s ║${NC}\n" "🌐 Acesse http://localhost:3000 para visualizar as métricas"
    echo -e "${BLUE}${BOLD}╚${line}╝${NC}"


    echo -ne "${NC}Pressione Enter para continuar..."
    read -r
}


#  VERIFICAÇÃO DE SERVIÇOS DOCKER
verify_docker() {
    for service in grafana influxdb; do
        if docker ps --format '{{.Names}}' | grep -qE "^${service}$"; then
            echo -e "✅ ${GREEN}${service^} está em execução${NC}"
        else
            echo -e "🔄 ${YELLOW}Iniciando serviço $service...${NC}"
            docker start "$service"
        fi
    done
}


#  EXECUÇÃO DOS TESTES
run_test() {
    local type=$1
    local test_file=$2
    export $(grep -v '^#' .env | xargs)
    verify_docker
    sleep 2

    clear
    echo -e "${CYAN}${BOLD}🚀 Executando teste: ${test_file}${NC}"
    echo "--------------------------------------------"

    if [[ $type == "api" ]]; then
        k6 run --out influxdb=localhost:8086/k6 --tag test_type=api "tests/api/$test_file"
    else
        K6_BROWSER_HEADLESS=false k6 run --out influxdb=localhost:8086/k6 --tag test_type=browser "tests/browser/$test_file"
    fi

    finish_message
}

#  MAPAS DE TESTES
declare -A test_map_api_wsassessoria=(
    [1]="acordo_canal_listar.js"
    [2]="acordo_canal_lote.js"
    [3]="blocklist_listar.js"
    [4]="boleto_2via.js"
    [5]="calcular_acordo.js"
    [6]="cancelar_meio_pagamento.js"
    [7]="consulta_acordo.js"
    [8]="fraudes_rejeitadas.js"
    [9]="incluir_acionamento.js"
    [10]="meio_pagamento_acordo.js"
    [11]="obter_divida_calculada.js"
    [12]="obter_divida_receptivo.js"
    [13]="pagamento_acordo_receptivo.js"
    [14]="quebrar_acordo.js"
    [15]="suspeita_fraude.js"
)

declare -A test_map_browser=(
    [1]="acionamento.js"
    [2]="gerarAcordo.js"
)

declare -A test_map_api_wsfraude=(
    [1]="fraudeAprovar.js"
    [2]="fraudeReprovar.js"
    [3]="fraudeCancelar.js"
) 

declare -A test_map_api_wsusuario=(
    [1]="listPermission.js"
    [2]="listPermissionUser.js"
    [3]="addPermissionUser.js"
    [4]="removePermissionUser.js"
    [5]="listUser.js"
    [6]="createUser.js"
    [7]="statusUser.js"
    [8]="updateUser.js"
    [9]="listGroup.js"
    [10]="listGroupUser.js"
) 


#  LOOP PRINCIPAL
while :; do
    main_options=("Executar testes do WSAssessoria" "Executar testes do WSFraude" "Executar testes do WSUsuario" "Executar testes de Tela")
    menu_with_arrows "Menu Principal" "${main_options[@]}"
    choice=$?
    if [[ $choice -eq 255 ]]; then
        clear
        echo -e "${YELLOW}Execução cancelada.${NC}"
        break
    fi

    case $choice in
        0) # API – WSAssessoria
            api_options=()
            for i in $(seq 1 ${#test_map_api_wsassessoria[@]}); do
                api_options+=("${test_map_api_wsassessoria[$i]}")
            done
            menu_with_arrows "Seleção do Serviço (API – WSAssessoria)" "${api_options[@]}"
            selected=$?
            if [[ $selected -ne 255 ]]; then
                file="${api_options[$selected]}"
                run_test "api" "$file"
            fi
            ;;
        1) # API – WSFraude
            api_options=()
            for i in $(seq 1 ${#test_map_api_wsfraude[@]}); do
                api_options+=("${test_map_api_wsfraude[$i]}")
            done
            menu_with_arrows "Seleção do Serviço (API – WSFraude)" "${api_options[@]}"
            selected=$?
            if [[ $selected -ne 255 ]]; then
                file="${api_options[$selected]}"
                run_test "api" "$file"
            fi
            ;;
        2) # API – WSUsuario
            api_options=()
            for i in $(seq 1 ${#test_map_api_wsusuario[@]}); do
                api_options+=("${test_map_api_wsusuario[$i]}")
            done
            menu_with_arrows "Seleção do Serviço (API – WSUsuario)" "${api_options[@]}"
            selected=$?
            if [[ $selected -ne 255 ]]; then
                file="${api_options[$selected]}"
                run_test "api" "$file"
            fi
            ;;
        3) # Browser
            browser_options=()
            for i in $(seq 1 ${#test_map_browser[@]}); do
                browser_options+=("${test_map_browser[$i]}")
            done
            menu_with_arrows "Seleção de Tela (Browser)" "${browser_options[@]}"
            selected=$?
            if [[ $selected -ne 255 ]]; then
                file="${browser_options[$selected]}"
                run_test "browser" "$file"
            fi
            ;;
        4)
            clear
            echo -e "${YELLOW}Execução cancelada.${NC}"
            break
            ;;
    esac
done
