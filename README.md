# Testes de Carga com k6

Este projeto utiliza o [k6](https://k6.io/) para testes de carga de APIs e aplicações web.

## 1. Pré-requisitos

Instale o k6:

- **macOS (Homebrew)**:
```bash
brew install k6
```

- **Windows (Chocolatey)**:
```bash
choco install k6
```

- **Linux (Debian/Ubuntu)**:
```bash
sudo apt install k6
```

## 2. Estrutura do Projeto
```bash
meu-projeto-k6/
├── tests/
│   └── teste_api.js
```

## 3. Criação de um teste simples
    Crie tests/teste_api.js:
```javascript
import http from 'k6/http';
import { sleep, check } from 'k6';


export let options = {
    vus: 10,        // usuários virtuais
    duration: '30s' // duração do teste
};

export default function () {
    let res = http.get('https://api.exemplo.com/endpoint');
    
    check(res, {
        'status é 200': (r) => r.status === 200,
        'tempo de resposta < 500ms': (r) => r.timings.duration < 500
    });
    
    sleep(1);
}
```

## 4. Executando o Teste
No terminal, execute:
```bash
k6 run tests/teste_api.js
```

Você verá estatísticas de requisições, tempos de resposta e falhas em tempo real.