# K6 - Suite de Testes de Performance

Projeto completo de automação de testes de performance e carga utilizando **K6**, integrando testes de API, testes de browser e visualização de métricas em tempo real com Grafana.

## 📋 Sobre o Projeto

Este projeto fornece uma suite abrangente para testes de performance com foco em:

- **Testes de API**: Validação de múltiplos serviços web (WSAssessoria, WSFraude, WSUsuario)
- **Testes de Browser**: Automação de cenários de UI com K6
- **Monitoramento em Tempo Real**: Integração com InfluxDB e Grafana para visualização de métricas
- **Importação de Dados**: Testes parametrizados com 68 cenários de validação
- **Infraestrutura como Código**: Provisioning automático com Terraform

## 🚀 Primeiros Passos

### Pré-requisitos

- **Docker** e **Docker Compose** instalados
- **Node.js** 18+ (para desenvolvimento local)
- **K6** instalado globalmente (opcional, funciona via Docker)
- **Git** para versionamento

### Instalação Rápida

#### 1. Clonar o repositório

```bash
git clone <seu-repositorio>
cd k6
```

#### 2. Subir os serviços com Docker Compose

```bash
cd Docker
docker compose up -d
```

Isso iniciará:

- **InfluxDB** (porta 8086): Banco de dados de séries temporais
- **Grafana** (porta 3000): Dashboard de visualização

#### 3. Executar testes via script interativo

```bash
cd k6
chmod +x run.sh
./run.sh
```

Ou executar testes da pipeline:

```bash
chmod +x pipeline-run.sh
./pipeline-run.sh
```

## 📁 Estrutura do Projeto

```
k6/
├── tests/
│   ├── api/
│   │   ├── config/              # Configurações globais de testes
│   │   ├── acordo_canal_*.js    # Testes do serviço WSAssessoria
│   │   ├── fraude*.js           # Testes do serviço WSFraude
│   │   ├── *User.js             # Testes do serviço WSUsuario
│   │   └── main.js              # Arquivo principal com todos os cenários
│   └── browser/
│       ├── config/              # Configurações de browser
│       ├── pages/               # Page objects para Playwright
│       ├── acionamentoEstatico.js
│       ├── gerarAcordo.js
│       ├── quebrarAcordo.js
│       └── importacaoAcionamento.js
├── database/
│   ├── values.json              # Dados parametrizados para testes
│   └── triggerFilesGenerator.mjs
├── Docker/
│   ├── docker-compose.yaml      # Orquestração de serviços
│   ├── grafana/                 # Configurações do Grafana
│   │   ├── dashboards/
│   │   ├── datasources/
│   │   └── data/
├── run.sh                        # Script interativo de execução
├── pipeline-run.sh              # Script de pipeline automatizado
└── Dockerfile                   # Container K6

```

## 🧪 Executando Testes

### Via Script Interativo (run.sh)

```bash
./run.sh
```

Oferece menu com opções:

1. Executar testes do WSAssessoria
2. Executar testes do WSFraude
3. Executar testes do WSUsuario
4. Executar testes de Tela (Browser)

### Via K6 Direto (Docker)

```bash
docker build -t k6testmanager:latest .

# Teste de API específico
docker run --rm -v $(pwd):/scripts k6testmanager:latest \
  run --out influxdb=http://influxdb:8086/k6 \
  scripts/tests/api/acordo_canal_listar.js

# Teste de Browser
K6_BROWSER_HEADLESS=true docker run --rm -v $(pwd):/scripts k6testmanager:latest \
  run scripts/tests/browser/acionamentoEstatico.js
```

### Via Pipeline (pipeline-run.sh)

```bash
./pipeline-run.sh
```

Executa:

1. Build da imagem Docker
2. Levanta serviços (InfluxDB, Grafana)
3. Verifica saúde dos serviços
4. Executa todos os testes de API
5. Executa todos os testes de Browser

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
URL=http://sua-api.com/
USER=seu_usuario
PASS=sua_senha
INFLUXDB_URL=http://influxdb:8086
```

### Arquivo de Dados (database/values.json)

Estructura dos dados parametrizados:

```json
{
  "config": {
    "token": "seu_token_aqui",
    "carteira": "001",
    "empresa": "001"
  },
  "acordo_canal_listar": ["001", "002", "003"],
  "acordo_canal_lote": {
    "data_inicial": ["01/01/2024", "02/01/2024"],
    "data_final": ["31/01/2024", "28/02/2024"]
  },
  ...
}
```

### Thresholds Globais

Edite `tests/api/config/globalThresholds.js`:

```javascript
export const globalThresholds = {
  checks: ["rate > 0.9"], // 90% de taxa de sucesso
};
```

## 📊 Visualizando Métricas

1. Acesse **http://localhost:3000** (Grafana)
2. Login padrão: `admin` / `admin`
3. Dashboards pré-configurados mostram:
   - Taxa de requisições por segundo
   - Latência (P50, P95, P99)
   - Taxa de erro
   - Duração dos testes

## 🏗️ Infraestrutura (Terraform)

Para provisionar a infraestrutura no GitHub:

```bash
cd terraform
terraform init
terraform plan
terraform apply -var="github_token=seu_token" -var="github_owner=seu_usuario"
```

## 📚 Estrutura de Testes

### Teste de API Básico

```javascript
import http from "k6/http";
import { check } from "k6";
import { baseScenario } from "./config/scenario.config.js";
import { globalThresholds } from "./config/globalThresholds.js";

const dados = JSON.parse(open("../../database/values.json"));

export const options = {
  ...baseScenario,
  thresholds: globalThresholds,
};

export default function () {
  const index = __VU - 1;
  const payload = {
    /* ... */
  };

  const res = http.post(__ENV.URL + "endpoint", JSON.stringify(payload), {
    headers: { "Content-Type": "application/json" },
  });

  check(res, {
    "Status 200": (r) => r.status === 200,
  });
}
```

### Teste de Browser

```javascript
import { browser } from "k6/browser";
import { check } from "k6";

export default async function () {
  let page;
  try {
    page = await browser.newPage();
    await page.goto(__ENV.URL);

    const element = page.locator("#selector");
    await element.click();

    check(page, {
      "Elemento visível": () => element.isVisible(),
    });
  } finally {
    await page.close();
  }
}
```

## 🎯 Cenários de Teste Disponíveis

### API - WSAssessoria (15 testes)

- `acordo_canal_listar`: Lista acordos por canal
- `acordo_canal_lote`: Consulta acordos por período
- `boleto_2via`: Gera segunda via de boleto
- `calcular_acordo`: Calcula valores de acordo
- `cancelar_meio_pagamento`: Cancela forma de pagamento
- E mais...

### API - WSFraude (3 testes)

- `fraudeAprovar`: Aprova fraude denunciada
- `fraudeReprovar`: Reprova fraude com anexos
- `fraudeCancelar`: Cancela análise de fraude

### API - WSUsuario (10 testes)

- `createUser`: Cria novo usuário
- `updateUser`: Atualiza dados do usuário
- `listUser`: Lista usuários por status
- `addPermissionUser`: Adiciona privilégio
- E mais...

### Browser (4 testes)

- `acionamentoEstatico`: Validação de tela de acionamentos
- `gerarAcordo`: Teste completo de geração de acordo
- `quebrarAcordo`: Teste de quebra de acordo
- `importacaoAcionamento`: 68 cenários de importação

## 🐛 Troubleshooting

### Docker Compose não sobe

```bash
docker compose down
docker system prune
docker compose up -d
```

### InfluxDB não conecta

Verifique se a porta 8086 está disponível:

```bash
lsof -i :8086
```

### Testes falhando por falta de dados

Revise `database/values.json` e certifique-se de ter dados suficientes para o número de VUs configurado.

### Grafana não mostra dados

- Verifique se InfluxDB está rodando
- Confirme a datasource em Settings → Data Sources
- Aguarde alguns segundos após testes iniciarem

## 📈 Performance Esperada

Baseado em cenários padrão:

- **API Tests**: ~95% de sucesso
- **Browser Tests**: ~90% de sucesso
- **Latência P95**: < 500ms
- **Taxa de Erro**: < 5%

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Gabriel Mauricio - Performance Testing Team

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

**Última atualização**: 3 de março de 2026
