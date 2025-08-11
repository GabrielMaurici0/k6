#!/bin/bash

export $(grep -v '^#' .env | xargs)

#K6_BROWSER_HEADLESS=false 
k6 run --out influxdb=localhost:8086/k6 tests/browser/acionamento.js 

echo "Pressione [Enter] para fechar o terminal..."
read -r