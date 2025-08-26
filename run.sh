#!/bin/bash

clear
echo " +---------------------------------------------------------------------------------------------+"
echo " |                                 Execução testes performance                                 |"
echo " +---------------------------------------------------------------------------------------------+"
echo " | Digite [1] para executar os testes de API                                                   |"
echo " | Digite [2] para executar os testes de Tela                                                  |"
echo " | Digite [3] para cancelar.                                                                   |"
echo " +---------------------------------------------------------------------------------------------+"
#TODO vincular Playwright

while :
    do read _option
        case $_option in
            1)
                #executa api
                export $(grep -v '^#' .env | xargs)
                docker compose -f ./Docker/docker-compose.yaml up -d
                sleep 5
                k6 run --out influxdb=localhost:8086/k6 --tag test_type=api tests/api/main.js 
                echo "Pressione [Enter] para fechar o terminal..."
                read -r
            break;;
            2) 
                #executa em tela
                export $(grep -v '^#' .env | xargs)
                docker compose -f ./Docker/docker-compose.yaml up -d
                sleep 5
                K6_BROWSER_HEADLESS=false k6 run --out influxdb=localhost:8086/k6 --tag test_type=browser tests/browser/main.js 
                echo "Pressione [Enter] para fechar o terminal..."
                read -r
            break;;
            3)
                #Encerrar
                clear
                echo " +------------------------------------------------------------------------------------------+"
                echo " |                                    Execução finalizada.                                  |"
                echo " |                     Pressione qualquer tecla para fechar o terminal...                   |"
                echo " +------------------------------------------------------------------------------------------+"
                read -r
            break ;;
            #Solicita nova opção
            *) echo "Opção inválida!"
    esac
done