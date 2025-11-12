import { browser } from "k6/browser";
import { check } from "https://jslib.k6.io/k6-utils/1.5.0/index.js";
import { Login } from "./pages/loginPage.js";
import { baseScenario } from "./config/scenario.config.js";
import { globalThresholds } from "./config/globalThresholds.js";

const dados = JSON.parse(open("../../database/values.json"));

export const options = {
  scenarios: {
    telaAcionamento: {
      ...baseScenario,
      exec: "telaAcionamento",
    },
  },
  thresholds: globalThresholds,
};

export default async function () {
  let page;
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

    if (__VU - 1 >= dados.acionamento.length) {
      console.error(`Não há dados suficientes para o VU ${__VU}`);
      return;
    } else {
      if (devedor.isEnabled()) {
        await page.waitForTimeout(500);
        await devedor.click();
        await devedor.fill(_value);
        await page
          .locator(
            "#TABLE7 > tbody > tr > td:nth-child(1) > input:nth-child(2)"
          )
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

      await page.waitForTimeout(5000);

      const pageUrl = await page.evaluate(() => window.location.href);

      await check(page, {
        "URL contém hacionamento": () => pageUrl.includes("hacionamento"),
      });
    }
  } catch (error) {
    console.error(`${error.message}`);
  } finally {
    await page.close();
  }
}
