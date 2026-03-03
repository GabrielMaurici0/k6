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
Instale o Docker (Desktop)

Windows 10/11
1. **Baixar o instalador**  
   - Acesse [Docker Desktop](https://www.docker.com/products/docker-desktop)  
   - Clique em **Download for Windows**  

2. **Executar o instalador**  
   - Abra o arquivo `.exe` baixado  
   - Escolha as opções (WSL2 ou Hyper-V)  
   - Clique em **OK**  

3. **Finalizar instalação**  
   - Reinicie o computador se for solicitado  
   - Abra o **Docker Desktop**  

4. **Configuração inicial**  
   - Aceite os termos de uso  
   - Escolha **WSL 2 (recomendado)**  
   - Configure o backend se necessário  

5. **Testar instalação**  
    ```bash
    docker --version
    docker run hello-world
    ```

macOS

1. **Baixar o instalador**
    - Acesse Docker Desktop
    - Escolha a versão para Intel ou Apple Silicon

2. **Instalar**
    - Abra o arquivo .dmg
    - Arraste o Docker.app para Aplicativos

3. **Executar**
    - Abra o Docker Desktop
    - Autorize com senha de administrador se necessário

4. **Testar instalação**
    ```bash
    docker --version
    docker run hello-world
    ```

Linux (Ubuntu/Debian)

\| No Linux, pode-se usar o Docker Engine ou o Docker Desktop.

1. **Baixar o pacote**
    ```bash
    curl -fsSL https://desktop.docker.com/linux/main/amd64/docker-desktop-<versão>-amd64.deb -o docker-desktop.deb
    ```

2. **Instalar**
    ```bash
    sudo apt-get update
    sudo apt-get install ./docker-desktop.deb
    ```

3. **Iniciar serviço**
    ```bash
    systemctl --user start docker-desktop
    systemctl --user enable docker-desktop
    ```

4. **Testar instalação**
    ```bash
    docker --version
    docker run hello-world
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

## Visualização de Métricas

1. Acesse http://localhost:3000.
2. Insira suas credenciais para efetuar o login.
3. Navegue até o dashboard correspondente para visualizar as métricas de execução:
    - Browser – métricas relacionadas à execução no navegador.
    - API – métricas relacionadas à execução via API.