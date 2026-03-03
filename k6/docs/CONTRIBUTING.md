# Load Testing with k6

This project uses [k6](https://k6.io/) for load testing APIs and web applications.

## 1. Prerequisites

Install k6:

* **macOS (Homebrew)**:

```bash
brew install k6
```

* **Windows (Chocolatey)**:

```bash
choco install k6
```

* **Linux (Debian/Ubuntu)**:

```bash
sudo apt install k6
```

Install Docker (Desktop)

Windows 10/11

1. **Download the installer**

   * Go to [Docker Desktop](https://www.docker.com/products/docker-desktop)
   * Click **Download for Windows**

2. **Run the installer**

   * Open the downloaded `.exe` file
   * Choose the options (WSL2 or Hyper-V)
   * Click **OK**

3. **Finish installation**

   * Restart the computer if prompted
   * Open **Docker Desktop**

4. **Initial configuration**

   * Accept the terms of use
   * Choose **WSL 2 (recommended)**
   * Configure the backend if necessary

5. **Test the installation**

   ```bash
   docker --version
   docker run hello-world
   ```

macOS

1. **Download the installer**

   * Go to Docker Desktop
   * Choose the version for Intel or Apple Silicon

2. **Install**

   * Open the .dmg file
   * Drag Docker.app to Applications

3. **Run**

   * Open Docker Desktop
   * Authorize with the administrator password if necessary

4. **Test the installation**

   ```bash
   docker --version
   docker run hello-world
   ```

Linux (Ubuntu/Debian)

| On Linux, you can use Docker Engine or Docker Desktop.

1. **Download the package**

   ```bash
   curl -fsSL https://desktop.docker.com/linux/main/amd64/docker-desktop-<version>-amd64.deb -o docker-desktop.deb
   ```

2. **Install**

   ```bash
   sudo apt-get update
   sudo apt-get install ./docker-desktop.deb
   ```

3. **Start the service**

   ```bash
   systemctl --user start docker-desktop
   systemctl --user enable docker-desktop
   ```

4. **Test the installation**

   ```bash
   docker --version
   docker run hello-world
   ```

## 2. Project Structure

```bash
my-k6-project/
├── tests/
│   └── api_test.js
```

## 3. Creating a simple test

Create tests/api_test.js:

```javascript
import http from 'k6/http';
import { sleep, check } from 'k6';


export let options = {
    vus: 10,        // virtual users
    duration: '30s' // test duration
};

export default function () {
    let res = http.get('https://api.example.com/endpoint');
    
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500
    });
    
    sleep(1);
}
```

## 4. Running the Test

In the terminal, run:

```bash
k6 run tests/api_test.js
```

You will see request statistics, response times, and failures in real time.

## Metrics Visualization

1. Access [http://localhost:3000](http://localhost:3000).
2. Enter your credentials to log in.
3. Navigate to the corresponding dashboard to view execution metrics:

   * Browser – metrics related to browser execution.
   * API – metrics related to execution via API.
