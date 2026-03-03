import path from "path";
import { browser } from "k6/browser";
import { Login } from "../../pages/loginPage.js";
import { cenarios } from "./config/scenario.list.js";
import { baseScenario } from "./config/scenario.config.js";
import { globalThresholds } from "./config/globalThresholds.js";

const dados = JSON.parse(open("../../database/values.json"));
const _pathFile = "../../temp/";

export const options = {
  scenarios: Object.fromEntries(
    cenarios.map((nome) => [nome, { ...baseScenario, exec: nome }])
  ),
  thresholds: globalThresholds,
};

async function importarArquivo(nomeArquivo, inconsistencia) {
  const idx = __VU - 1;
  let page;
  try {
    page = await browser.newPage();

    // Login
    const login = new Login(page);
    await login.goto();
    await login.submitForm();

    // Abre menu lateral
    const expandir = page.locator("#toggleIcon");
    if (await expandir.isEnabled()) await expandir.click();

    const pesquisar = page.locator("#searchInput");
    if (!(await pesquisar.isEnabled())) await expandir.click();
    await pesquisar.click();
    await pesquisar.fill("importação");

    await page.waitForTimeout(1000);

    const menu = await page.waitForSelector(
      "#dynamic-sidebar > div:nth-child(4) > a:nth-child(5)",
      { state: "visible", timeout: 5000 }
    );
    await menu.click();
    await page.waitForTimeout(1000);
    await expandir.click();

    // Dados do JSON
    const { assessoria, empresa, layout } = dados.importacaoAcionamento;
    const _empresaValue = empresa[idx];
    const _layoutValue = layout[idx];

    console.log(`Importando arquivo: ${nomeArquivo}`);

    await page
      .locator("#TABLE1 > tbody > tr:nth-child(1) > td:nth-child(2) > select")
      .selectOption(assessoria);

    await page
      .locator("#TABLE1 > tbody > tr:nth-child(2) > td:nth-child(2) > select")
      .selectOption(_empresaValue);

    if (inconsistencia === "s") {
      await page
        .locator(
          "#TABLE1 > tbody > tr:nth-child(3) > td:nth-child(2) > input[type=checkbox]"
        )
        .click();
    }

    await page
      .locator("#TABLE1 > tbody > tr:nth-child(4) > td:nth-child(2) > select")
      .selectOption(_layoutValue);

    await page.waitForTimeout(1000);

    // Upload
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator("#_FILE").click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(_pathFile, nomeArquivo));

    // Importar
    const btnImportar = page.locator("#btnImportar");
    if (await btnImportar.isEnabled()) await btnImportar.click();

    await page.waitForTimeout(3000);
    console.log(`Arquivo ${nomeArquivo} importado com sucesso`);
  } catch (err) {
    console.error(`Erro ao importar ${nomeArquivo}: ${err.message}`);
  } finally {
    if (page) await page.close();
  }
}

// Cria dinamicamente as funções de cenário com base no cenario.list.js
for (const nome of cenarios) {
  // Se o nome termina com "_fix", marca como inconsistente
  const inconsistencia = nome.endsWith("_fix") ? "s" : "n";

  // Cria dinamicamente a função e a exporta
  exports[nome] = async function () {
    await importarArquivo(`${nome}.txt`, inconsistencia);
  };
}
