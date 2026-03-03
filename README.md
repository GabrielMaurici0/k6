# K6 - Performance Testing Suite

A comprehensive automation project for performance and load testing using **K6**, integrating API tests, browser tests, and real-time metrics visualization with Grafana.

## 📋 About the Project

This project provides a comprehensive testing suite focused on:

- **API Testing**: Validation of multiple web services (WSAssessoria, WSFraude, WSUsuario)
- **Browser Testing**: UI automation scenarios with K6
- **Real-time Monitoring**: Integration with InfluxDB and Grafana for metrics visualization
- **Data Import**: Parameterized tests with 68 validation scenarios
- **Infrastructure as Code**: Automatic provisioning with Terraform

## 🚀 Getting Started

### Prerequisites

- **Docker** and **Docker Compose** installed
- **Node.js** 18+ (for local development)
- **K6** installed globally (optional, works via Docker)
- **Git** for version control

### Quick Installation

#### 1. Clone the repository

```bash
git clone <your-repository>
cd k6
```

#### 2. Start services with Docker Compose

```bash
cd Docker
docker compose up -d
```

This will start:

- **InfluxDB** (port 8086): Time-series database
- **Grafana** (port 3000): Visualization dashboard

#### 3. Run tests via interactive script

```bash
cd k6
chmod +x run.sh
./run.sh
```

Or run pipeline tests:

```bash
chmod +x pipeline-run.sh
./pipeline-run.sh
```

## 📁 Project Structure

```
k6/
├── tests/
│   ├── api/
│   │   ├── config/              # Global test configurations
│   │   ├── acordo_canal_*.js    # WSAssessoria service tests
│   │   ├── fraude*.js           # WSFraude service tests
│   │   ├── *User.js             # WSUsuario service tests
│   │   └── main.js              # Main file with all scenarios
│   └── browser/
│       ├── config/              # Browser configurations
│       ├── pages/               # Page objects for Playwright
│       ├── acionamentoEstatico.js
│       ├── gerarAcordo.js
│       ├── quebrarAcordo.js
│       └── importacaoAcionamento.js
├── database/
│   ├── values.json              # Parameterized test data
│   └── triggerFilesGenerator.mjs
├── Docker/
│   ├── docker-compose.yaml      # Service orchestration
│   ├── grafana/                 # Grafana configurations
│   │   ├── dashboards/
│   │   ├── datasources/
│   │   └── data/
├── run.sh                        # Interactive execution script
├── pipeline-run.sh              # Automated pipeline script
└── Dockerfile                   # K6 container

```

## 🧪 Running Tests

### Via Interactive Script (run.sh)

```bash
./run.sh
```

Offers menu with options:

1. Run WSAssessoria tests
2. Run WSFraude tests
3. Run WSUsuario tests
4. Run Browser tests (UI)

### Via K6 Direct (Docker)

```bash
docker build -t k6testmanager:latest .

# Specific API test
docker run --rm -v $(pwd):/scripts k6testmanager:latest \
  run --out influxdb=http://influxdb:8086/k6 \
  scripts/tests/api/acordo_canal_listar.js

# Browser test
K6_BROWSER_HEADLESS=true docker run --rm -v $(pwd):/scripts k6testmanager:latest \
  run scripts/tests/browser/acionamentoEstatico.js
```

### Via Pipeline (pipeline-run.sh)

```bash
./pipeline-run.sh
```

Executes:

1. Docker image build
2. Starts services (InfluxDB, Grafana)
3. Verifies service health
4. Executes all API tests
5. Executes all Browser tests

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
URL=http://your-api.com/
USER=your_username
PASS=your_password
INFLUXDB_URL=http://influxdb:8086
```

### Test Data File (database/values.json)

Structure of parameterized data:

```json
{
  "config": {
    "token": "your_token_here",
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

### Global Thresholds

Edit `tests/api/config/globalThresholds.js`:

```javascript
export const globalThresholds = {
  checks: ["rate > 0.9"], // 90% success rate
};
```

## 📊 Viewing Metrics

1. Access **http://localhost:3000** (Grafana)
2. Default login: `admin` / `admin`
3. Pre-configured dashboards display:
   - Request rate per second
   - Latency (P50, P95, P99)
   - Error rate
   - Test duration

## 🏗️ Infrastructure (Terraform)

To provision infrastructure on GitHub:

```bash
cd terraform
terraform init
terraform plan
terraform apply -var="github_token=your_token" -var="github_owner=your_username"
```

## 📚 Test Structure

### Basic API Test

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

### Browser Test

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
      "Element visible": () => element.isVisible(),
    });
  } finally {
    await page.close();
  }
}
```

## 🎯 Available Test Scenarios

### API - WSAssessoria (15 tests)

- `acordo_canal_listar`: List agreements by channel
- `acordo_canal_lote`: Query agreements by period
- `boleto_2via`: Generate second copy of invoice
- `calcular_acordo`: Calculate agreement values
- `cancelar_meio_pagamento`: Cancel payment method
- And more...

### API - WSFraude (3 tests)

- `fraudeAprovar`: Approve reported fraud
- `fraudeReprovar`: Reject fraud with attachments
- `fraudeCancelar`: Cancel fraud analysis

### API - WSUsuario (10 tests)

- `createUser`: Create new user
- `updateUser`: Update user data
- `listUser`: List users by status
- `addPermissionUser`: Add privilege
- And more...

### Browser (4 tests)

- `acionamentoEstatico`: UI validation test
- `gerarAcordo`: Complete agreement generation test
- `quebrarAcordo`: Agreement break test
- `importacaoAcionamento`: 68 import scenarios

## 🐛 Troubleshooting

### Docker Compose won't start

```bash
docker compose down
docker system prune
docker compose up -d
```

### InfluxDB won't connect

Check if port 8086 is available:

```bash
lsof -i :8086
```

### Tests failing due to missing data

Review `database/values.json` and ensure you have enough data for the configured number of VUs.

### Grafana not showing data

- Verify InfluxDB is running
- Confirm datasource in Settings → Data Sources
- Wait a few seconds after tests start

## 📈 Expected Performance

Based on standard scenarios:

- **API Tests**: ~95% success rate
- **Browser Tests**: ~90% success rate
- **P95 Latency**: < 500ms
- **Error Rate**: < 5%

## 🤝 Contributing

1. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License

This project is under the MIT license.

## 👨‍💻 Author

Gabriel Mauricio - Performance Testing Team

## 📞 Support

For questions or issues, open an issue in the repository.

---

**Last updated**: March 3, 2026
