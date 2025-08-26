export class Login {
  constructor(page) {
    this.page = page;
    this.userField = this.page.locator("#_USUCODC");
    this.passField = this.page.locator("#_USUSEN");
    this.submitButton = this.page.locator(
      "#TABLE > tbody > tr:nth-child(6) > td:nth-child(3) > input:nth-child(1)"
    );
    this.checkButton = this.page.locator(
      "#TABLE_DERRUBA_SESSAO > tbody > tr:nth-child(5) > td:nth-child(3) > input:nth-child(1)"
    );
    this.errorLogin = this.page.locator("#swal2-html-container");

    this.modalError = this.page.locator(
      "body > div.swal2-container.swal2-center.swal2-backdrop-show > div"
    );
  }

  async goto() {
    const _url = __ENV.URL;
    await this.page.goto(_url+'hsiscobra');
  }

  async submitForm() {
    const _user = __ENV.USER;
    const _pass = __ENV.PASS; 
    await this.userField.fill(_user); 
    await this.passField.fill(_pass);
    await this.submitButton.click(); 
    await this.page.waitForTimeout(2000);

    if (await this.checkButton.isVisible()) {
      await this.checkButton.click();
    } else {
      if (await this.modalError.isVisible()) {
        const textoErro = await this.errorLogin.textContent();
        if (
          textoErro === "Informe o usuário." ||
          textoErro === "Informe a senha."
        ) {
          throw new Error(
            "\x1b[31m Execução encerrada: erro nas credenciais de login"
          );
        } else if (textoErro === "Resolva o Captcha para continuar.") {
          throw new Error(
            "\x1b[31m Execução encerrada: Necessário resolver o captcha para seguir"
          );
        }
      } 
    }
    await this.page.waitForLoadState("domcontentloaded");
  }
}
