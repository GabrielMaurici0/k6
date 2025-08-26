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
                #TODO adicionar lista com as opções 1 executar especifico 2 executar todos 3 voltar
                export $(grep -v '^#' .env | xargs)
                docker compose -f ./Docker/docker-compose.yaml up -d
                sleep 5
                k6 run --out influxdb=localhost:8086/k6 --tag test_type=api tests/api/main.js 

                echo ""
                echo ""
                echo ""

                echo " +----------------------------------------------------------------------------------------+"
                echo " |                                                                                        |"
                echo " |                                  Execução finalizada.                                  |"
                echo " |                                                                                        |"
                echo " |                  Pressione qualquer tecla para fechar o terminal...                    |"
                echo " |                                                                                        |"
                echo " +----------------------------------------------------------------------------------------+"
                read -rx'x'
            break;;
            2) 
                #executa em tela
                #TODO adicionar lista com as opções 1 executar especifico 2 executar todos 3 voltar
                #Obs.: Dar opção apenas de lista e opção de voltar
                export $(grep -v '^#' .env | xargs)
                docker compose -f ./Docker/docker-compose.yaml up -d
                sleep 5
                K6_BROWSER_HEADLESS=false k6 run --out influxdb=localhost:8086/k6 --tag test_type=browser tests/browser/main.js 


                echo ""
                echo ""
                echo ""

                echo " +----------------------------------------------------------------------------------------+"
                echo " |                                                                                        |"
                echo " |                                  Execução finalizada.                                  |"
                echo " |                                                                                        |"
                echo " |                  Pressione qualquer tecla para fechar o terminal...                    |"
                echo " |                                                                                        |"
                echo " +----------------------------------------------------------------------------------------+"
                read -r
            break;;
            3)
                #Encerrar
                clear
                echo " +----------------------------------------------------------------------------------------+"
                echo " |                                                                                        |"
                echo " |                                  Execução finalizada.                                  |"
                echo " |                                                                                        |"
                echo " |                  Pressione qualquer tecla para fechar o terminal...                    |"
                echo " |                                                                                        |"
                echo " +----------------------------------------------------------------------------------------+"
                read -r
            break ;;
            #Solicita nova opção
            *) echo "Opção inválida!"
    esac
done