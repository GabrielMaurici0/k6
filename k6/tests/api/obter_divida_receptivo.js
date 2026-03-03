import http from "k6/http";
import { check } from "k6";
import { baseScenario } from "./config/scenario.config.js";
import { globalThresholds } from "./config/globalThresholds.js";

const dados = JSON.parse(open("../../database/values.json"));
const _url = __ENV.URL;
const _auth = dados.config.token;
const _carteira = dados.config.carteira;
const _empresa = dados.config.empresa;

export const options = {
  ...baseScenario,
  thresholds: globalThresholds,
};

export default function () {
  const index = __VU - 1;
  if (index >= dados.obter_divida_receptivo.cpf.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }

  const _dateTime = new Date();
  const _date =
    String(_dateTime.getDate()).padStart(2, "0") +
    "/" +
    String(_dateTime.getMonth()).padStart(2, "0") +
    "/" +
    _dateTime.getFullYear();
  const _cpf = dados.obter_divida_receptivo.cpf[index];
  const payload = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
      <soapenv:Body>
        <sis:WSAssessoria.Execute>
          <sis:Token>${_auth}</sis:Token>
          <sis:Carcod>${_carteira}</sis:Carcod>
          <sis:Metodo>OBTER_DIVIDA_RECEPTIVO</sis:Metodo>
          <sis:Xmlin>
            &lt;obter_divida_receptivo&gt;
              &lt;cod_assessoria&gt;${_carteira}&lt;/cod_assessoria&gt;
              &lt;emp_cliente&gt;${_empresa}&lt;/emp_cliente&gt;
              &lt;cpf_cliente&gt;${_cpf}&lt;/cpf_cliente&gt;
              &lt;data_calculo&gt;${_date}&lt;/data_calculo&gt;
            &lt;/obter_divida_receptivo&gt;
          </sis:Xmlin>
        </sis:WSAssessoria.Execute>
      </soapenv:Body>
    </soapenv:Envelope>`;
  const headers = {
    "Content-Type": " application/xml",
  };

  const res = http.post(
    _url + "awsassessoria#obter_divida_receptivo",
    payload,
    { headers }
  );

  check(res, {
    "Retorno positivo": (r) => /<dividas_calculadas>\s*<cliente>/i.test(r.body),
  });
}
