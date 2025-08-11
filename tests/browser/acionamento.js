import { browser } from "k6/browser";
import { Login } from "../../pages/loginPage.js"

export const options = {
  scenarios: {
    ui: {
      executor: "shared-iterations",
      iterations: 5, //quantia de vezes que vai executar
      vus: 1, //quantia de guias que vão ser abertas 
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
  thresholds: {
    checks: ["rate==1.0"],
  },
};

export default async function () {

  let page 
  
  try {

    page = await browser.newPage();

    const login = new Login(page)

    await login.goto()

    await login.submitForm()

    const expandir = page.locator("#toggleIcon");

    if (expandir.isEnabled()) {
      await expandir.click()
    }

    const pesquisar = page.locator("#searchInput");
    
    if (pesquisar.isEnabled()) {
      await pesquisar.click();
    } else {
      await expandir.click()
      await pesquisar.click()
    }

    await pesquisar.fill('Pesquisar')

    await page.waitForTimeout(1000)

    const menu = await page.waitForSelector(
      "#dynamic-sidebar > div:nth-child(2) > a:nth-child(2)",
      {
        state: "visible",
        timeout: 5000,
      }
    );

    await menu.click();

    await page.waitForTimeout(1000);

    const devedor = page.locator("#_DEVEDOR_CODIGO");

    const _devcod = __ENV.DEVCOD

    if (devedor.isEnabled()) {
      await page.waitForTimeout(500);
      await devedor.click()
      await devedor.fill(_devcod)
      await page
        .locator("#TABLE7 > tbody > tr > td:nth-child(1) > input:nth-child(2)")
        .click();
    } else {
      console.log('Não está disponivel para informar devcod');
      await page.close();
    }

    await page.waitForTimeout(1000);

    const submit = page.locator("#span__DEVCOD_0001 > a");
    

    if (submit.isEnabled()) {
      await submit.click()
    } else {
      console.log("Não foi possível abrir a ficha do devedor");
      await page.close();
    }

    await page.waitForTimeout(10000);

  }catch(error){
    console.error(`${error.message}`);

  } finally {
      
    await page.close();
  }
}