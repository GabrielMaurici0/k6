import path from "path";
import { browser } from "k6/browser";
import { Login } from "../../pages/loginPage.js";

const dados = JSON.parse(open("../../data/values.json"));
const _pathFile = "../../temp/";

// Cada cenário abaixo executa uma função diferente
export const options = {
  scenarios: {
    import_l1: {
      executor: "shared-iterations",
      exec: "importarL1", // função que será chamada
      iterations: 1,
      vus: 1,
      options: { browser: { type: "chromium" } },
    },
    import_l2: {
      executor: "shared-iterations",
      exec: "importarL2",
      iterations: 1,
      vus: 1,
      options: { browser: { type: "chromium" } },
    },
    import_l3: {
      executor: "shared-iterations",
      exec: "importarL3",
      iterations: 1,
      vus: 1,
      options: { browser: { type: "chromium" } },
    },
  },
  thresholds: {
    checks: ["rate > 0.9"],
  },
};

// Função principal compartilhada por todos os cenários
async function importarArquivo(nomeArquivo, _inconsistenciaValue) {
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

    // Lê os dados correspondentes do JSON para este VU
    const _assessoriaValue = dados.importacaoAcionamento.assessoria;
    const _empresaValue = dados.importacaoAcionamento.empresa[idx];
    const _layoutValue = dados.importacaoAcionamento.layout[idx];

    console.log(`Importando arquivo: ${nomeArquivo}`);

    // Preenche os campos
    const assessoria = page.locator(
      "#TABLE1 > tbody > tr:nth-child(1) > td:nth-child(2) > select"
    );
    await assessoria.selectOption(_assessoriaValue);

    const empresa = page.locator(
      "#TABLE1 > tbody > tr:nth-child(2) > td:nth-child(2) > select"
    );
    await empresa.selectOption(_empresaValue);

    if (_inconsistenciaValue.toLowerCase() === "s") {
      const inconsistencia = page.locator(
        "#TABLE1 > tbody > tr:nth-child(3) > td:nth-child(2) > input[type=checkbox]"
      );
      await inconsistencia.click();
    }

    const layout = page.locator(
      "#TABLE1 > tbody > tr:nth-child(4) > td:nth-child(2) > select"
    );
    await layout.selectOption(_layoutValue);

    await page.waitForTimeout(1000);

    // Upload do arquivo
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator("#_FILE").click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(_pathFile, nomeArquivo));

    // Clicar no botão de importação
    const btnImportar = page.locator("#btnImportar");
    if (await btnImportar.isEnabled()) {
      await btnImportar.click();
    }

    await page.waitForTimeout(3000);
    console.log(`Arquivo ${nomeArquivo} importado com sucesso`);
  } catch (err) {
    console.error(`Erro ao importar ${nomeArquivo}: ${err.message}`);
  } finally {
    if (page) await page.close();
  }
}

// Cada função abaixo é um cenário independente
export async function l1_ok() {
  await importarArquivo("l1_ok.txt","n");
}

export async function l1_1inc() {
  await importarArquivo("l1_1inc.txt", "n");
}

export async function l1_all_inc() {
  await importarArquivo("l1_all_inc.txt", "n");
}

export async function l1_same_dev() {
  await importarArquivo("l1_same_dev.txt", "n");
}

export async function l1_dist_dev() {
  await importarArquivo("l1_dist_dev.txt", "n");
}

export async function l1_ok_fix() {
  await importarArquivo("l1_ok_fix.txt","s");
}

export async function l1_1inc_fix() {
  await importarArquivo("l1_1inc_fix.txt","s");
}

export async function l1_all_inc_fix() {
  await importarArquivo("l1_all_inc_fix.txt","s");
}

export async function l1_same_dev_fix() {
  await importarArquivo("l1_same_dev_fix.txt","s");
}

export async function l1_dist_dev_fix() {
  await importarArquivo("l1_dist_dev_fix.txt","s");
}

export async function l2_ok() {
  await importarArquivo("l2_ok.txt","n");
}

export async function l2_1inc() {
  await importarArquivo("l2_1inc.txt","n");
}

export async function l2_all_inc() {
  await importarArquivo("l2_all_inc.txt","n");
}

export async function l2_same_dev() {
  await importarArquivo("l2_same_dev.txt","n");
}

export async function l2_same_tel_inv() {
  await importarArquivo("l2_same_tel_inv.txt","n");
}

export async function l2_same_email_mix() {
  await importarArquivo("l2_same_email_mix.txt","n");
}

export async function l2_dist_dev() {
  await importarArquivo("l2_dist_dev.txt","n");
}

export async function l2_ok_fix() {
  await importarArquivo("l2_ok_fix.txt","s");
}

export async function l2_1inc_fix() {
  await importarArquivo("l2_1inc_fix.txt","s");
}

export async function l2_all_inc_fix() {
  await importarArquivo("l2_all_inc_fix.txt","s");
}

export async function l2_same_dev_fix() {
  await importarArquivo("l2_same_dev_fix.txt","s");
}

export async function l2_same_tel_inv_fix() {
  await importarArquivo("l2_same_tel_inv_fix.txt","s");
}

export async function l2_same_email_mix_fix() {
  await importarArquivo("l2_same_email_mix_fix.txt","s");
}

export async function l2_dist_dev_fix() {
  await importarArquivo("l2_dist_dev_fix.txt","s");
}

export async function l3_ok() {
  await importarArquivo("l3_ok.txt","n");
}

export async function l3_1inc() {
  await importarArquivo("l3_1inc.txt","n");
}

export async function l3_all_inc() {
  await importarArquivo("l3_all_inc.txt","n");
}

export async function l3_same_dev() {
  await importarArquivo("l3_same_dev.txt","n");
}

export async function l3_same_tel_inv() {
  await importarArquivo("l3_same_tel_inv.txt","n");
}

export async function l3_same_email_mix() {
  await importarArquivo("l3_same_email_mix.txt","n");
}

export async function l3_dist_dev() {
  await importarArquivo("l3_dist_dev.txt","n");
}

export async function l3_ok_fix() {
  await importarArquivo("l3_ok_fix.txt","s");
}

export async function l3_1inc_fix() {
  await importarArquivo("l3_1inc_fix.txt","s");
}

export async function l3_all_inc_fix() {
  await importarArquivo("l3_all_inc_fix.txt","s");
}

export async function l3_same_dev_fix() {
  await importarArquivo("l3_same_dev_fix.txt","s");
}

export async function l3_same_tel_inv_fix() {
  await importarArquivo("l3_same_tel_inv_fix.txt","s");
}
export async function l3_same_email_mix_fix() {
  await importarArquivo("l3_same_email_mix_fix.txt","s");
}

export async function l3_dist_dev_fix() {
  await importarArquivo("l3_dist_dev_fix.txt","s");
}

export async function l4_ok() {
  await importarArquivo("l4_ok.txt","n");
}

export async function l4_1inc() {
  await importarArquivo("l4_1inc.txt","n");
}

export async function l4_all_inc() {
  await importarArquivo("l4_all_inc.txt","n");
}

export async function l4_same_dev() {
  await importarArquivo("l4_same_dev.txt","n");
}

export async function l4_same_tel_inv() {
  await importarArquivo("l4_same_tel_inv.txt","n");
}

export async function l4_same_email_mix() {
  await importarArquivo("l4_same_email_mix.txt","n");
}

export async function l4_dist_dev() {
  await importarArquivo("l4_dist_dev.txt","n");
}

export async function l4_ok_fix() {
  await importarArquivo("l4_ok_fix.txt","s");
}

export async function l4_1inc_fix() {
  await importarArquivo("l4_1inc_fix.txt","s");
}

export async function l4_all_inc_fix() {
  await importarArquivo("l4_all_inc_fix.txt","s");
}

export async function l4_same_dev_fix() {
  await importarArquivo("l4_same_dev_fix.txt","s");
}

export async function l4_same_tel_inv_fix() {
  await importarArquivo("l4_same_tel_inv_fix.txt","s");
}

export async function l4_same_email_mix_fix() {
  await importarArquivo("l4_same_email_mix_fix.txt","s");
}

export async function l4_dist_dev_fix() {
  await importarArquivo("l4_dist_dev_fix.txt","s");
}

export async function l5_ok() {
  await importarArquivo("l5_ok.txt","n");
}

export async function l5_1inc() {
  await importarArquivo("l5_1inc.txt","n");
}

export async function l5_all_inc() {
  await importarArquivo("l5_all_inc.txt","n");
}

export async function l5_same_dev() {
  await importarArquivo("l5_same_dev.txt","n");
}

export async function l5_same_tel_inv() {
  await importarArquivo("l5_same_tel_inv.txt","n");
}

export async function l5_same_email_mix() {
  await importarArquivo("l5_same_email_mix.txt","n");
}

export async function l5_dist_dev() {
  await importarArquivo("l5_dist_dev.txt","n");
}

export async function l5_ok_fix() {
  await importarArquivo("l5_ok_fix.txt","s");
}

export async function l5_1inc_fix() {
  await importarArquivo("l5_1inc_fix.txt","s");
}

export async function l5_all_inc_fix() {
  await importarArquivo("l5_all_inc_fix.txt","s");
}

export async function l5_same_dev_fix() {
  await importarArquivo("l5_same_dev_fix.txt","s");
}

export async function l5_same_tel_inv_fix() {
  await importarArquivo("l5_same_tel_inv_fix.txt","s");
}

export async function l5_same_email_mix_fix() {
  await importarArquivo("l5_same_email_mix_fix.txt","s");
}

export async function l5_dist_dev_fix() {
  await importarArquivo("l5_dist_dev_fix.txt","s");
}
