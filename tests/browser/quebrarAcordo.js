import { browser } from "k6/browser";
import { check } from "https://jslib.k6.io/k6-utils/1.5.0/index.js";
import { Login } from "../../pages/loginPage.js"

const dados = JSON.parse(open("../../data/values.json"));

export const options = {
  scenarios: {
    ui: {
      executor: "shared-iterations",
      iterations: 1, //quantia de vezes que vai executar
      vus: 1, //quantia de janelas que vão ser abertas simultaneamente
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
  thresholds: {
    checks: ["rate > 0.9"],
  },
};

export default async function () {
  let page 
  try {
    page = await browser.newPage();

    const login = new Login(page);

    await login.goto();

    await login.submitForm();

    const expandir = page.locator("#toggleIcon");
    if (expandir.isEnabled()) {
      await expandir.click();
    }

    const pesquisar = page.locator("#searchInput");
    if (pesquisar.isEnabled()) {
      await pesquisar.click();
    } else {
      await expandir.click();
      await pesquisar.click();
    }
    await pesquisar.fill("Pesquisar");

    await page.waitForTimeout(1000);

    const menu = await page.waitForSelector(
      "#dynamic-sidebar > div:nth-child(2) > a:nth-child(2)",
      {
        state: "visible",
        timeout: 5000,
      }
    );
    await menu.click();

    await page.waitForTimeout(1000);

    await expandir.click();

    const devedor = page.locator("#_DEVEDOR_CODIGO");

    const _value = dados.acionamento[__VU - 1];
    if ( __VU - 1 >= dados.acionamento.length) {
      console.error(`Não há dados suficientes para o VU ${__VU}`);
      return;
    } 


    if (devedor.isEnabled()) {
      await page.waitForTimeout(1000);
      await devedor.click();
      await devedor.fill(_value);
      await page
        .locator("#TABLE7 > tbody > tr > td:nth-child(1) > input:nth-child(2)")
        .click();
    } else {
      console.log("Não está disponivel para informar devcod");
      await page.close();
    }

    await page.waitForTimeout(1000);

    const submit = page.locator("#span__DEVCOD_0001 > a");
    if (submit.isEnabled()) {
      await submit.click();
    } else {
      console.log("Não foi possível abrir a ficha do devedor");
      await page.close();
    }

    await page.waitForTimeout(7000);

    const frameElement = await page.$(
      "#TBL2 > tbody > tr:nth-child(3) > td > div:nth-child(13) > iframe"
    );
    const frame = await frameElement.contentFrame();
    // Interação iframe
    const limpar = frame.locator(
      "#TABELA_MASTER > tbody > tr:nth-child(7) > td > input[type=SUBMIT]:nth-child(2)"
    );

    await limpar.focus();
    await limpar.click();

    await page.waitForTimeout(5000);
    // Obtem todos os inputs válidos
    const validCheckboxes = await frame.evaluate(() => {
      const all = Array.from(
        document.querySelectorAll('input[name^="_G_SELECIONAR_"]')
      );
      return all
        .filter((cb) => !cb.disabled) // só habilitados
        .map((cb) => cb.getAttribute("name")); // retorna o nome exato (_G_SELECIONAR_0001, _G_SELECIONAR_0010, etc.)
    });

    if (validCheckboxes.length === 0) {
      console.log("Nenhum checkbox disponível.");
      return;
    }

    // Embaralha os disponíveis
    for (let i = validCheckboxes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [validCheckboxes[i], validCheckboxes[j]] = [
        validCheckboxes[j],
        validCheckboxes[i],
      ];
    }
    // Seleciona no máximo 3
    const toSelect = validCheckboxes.slice(
      0,
      Math.min(1, validCheckboxes.length)
    );
    // Marca cada um
    for (const name of toSelect) {
      await frame.evaluate((name) => {
        const cb = document.querySelector(`input[name="${name}"]`);
        if (cb && !cb.checked) cb.click();
      }, name);
    }

    await page.waitForTimeout(3000);

    const atualizar = await frame.locator(
      "#TABELA_MASTER > tbody > tr:nth-child(7) > td > input:nth-child(5)"
    );

    await atualizar.focus()
    await atualizar.click()

    await page.waitForTimeout(7000);

    const negociar = await frame.locator(
      "#TABELA_MASTER > tbody > tr:nth-child(7) > td > input:nth-child(6)"
    );
    await negociar.focus()
    await negociar.click()

    await page.waitForTimeout(5000);

    //vai clicar no primeiro para efetuar o acordo
    const efetuar = await frame.locator("#BTN_PROCESSAR_ACORDO_0001 > a");
    await efetuar.focus()
    await efetuar.click()

    const confirmar = await page.locator("body > div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-actions > button.swal2-confirm.swal2-styled")
    await confirmar.focus();
    await confirmar.click()

    await page.waitForTimeout(5000);

    const table = await frame.$("#TABELA_CALCULO")

    const quebrar = await frame.locator("#BOTAO_QUEBRAR_ACORDO > a");
    await quebrar.focus();
    await quebrar.click();

    await page.waitForTimeout(5000);

    const historico = await page.locator("#W0346AGENDA > a"); 
    await historico.focus();
    await historico.click();

    await page.waitForTimeout(3000);


    const historicoElement = await page.$(
      "#TABLE1"
    );
    const tableHistorico = await historicoElement.contentFrame();

    const textoAcordo = await tableHistorico.$("#span__RETACA_0001")
    const text = await textoAcordo.evaluate((el) => el.textContent.trim());
    await check(page, {
      'Acordo Quebrado com sucesso': () => text === 'Quebra de acordo'
    });

  }catch(error){
    console.error(`${error.message}`);
  } finally {
    await page.close();
  }
}


