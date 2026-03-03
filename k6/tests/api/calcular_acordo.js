import http from "k6/http";
import { check } from "k6";
import { baseScenario } from "./config/scenario.config.js";
import { globalThresholds } from "./config/globalThresholds.js";

const dados = JSON.parse(open("../../database/values.json"));

export const options = {
  ...baseScenario,
  thresholds: globalThresholds,
};

export default function () {
  const index = __VU - 1;
  if (index >= dados.calcular_acordo.devedor.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }

  const _url = __ENV.URL;
  const _auth = dados.config.token;
  const _carteira = dados.config.carteira;
  const _empresa = dados.config.empresa;
  const _devedor = dados.calcular_acordo.devedor[index];
  const _date = dados.calcular_acordo.data_calculo[index];
  const _acordo = dados.calcular_acordo.acordo[index];
  const _formaNegociacao = dados.calcular_acordo.forma_negociacao[index];
  const payload = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
      <soapenv:Body>
        <sis:WSAssessoria.Execute>
          <sis:Token>${_auth}</sis:Token>
          <sis:Carcod>${_carteira}</sis:Carcod>
          <sis:Metodo>CALCULAR_ACORDO</sis:Metodo>
          <sis:Xmlin>
            &lt;calcular_acordo&gt;
              &lt;cod_assessoria&gt;${_carteira}&lt;/cod_assessoria&gt;
              &lt;emp_cliente&gt;${_empresa}&lt;/emp_cliente&gt;
              &lt;cod_cliente&gt;${_devedor}&lt;/cod_cliente&gt;
              &lt;data_calculo&gt;${_date}&lt;/data_calculo&gt;
              &lt;codigo_acordo&gt;${_acordo}&lt;/codigo_acordo&gt;
              &lt;forma_negociacao&gt;${_formaNegociacao}&lt;/forma_negociacao&gt;
            &lt;/calcular_acordo&gt;
          </sis:Xmlin>
        </sis:WSAssessoria.Execute>
      </soapenv:Body>
    </soapenv:Envelope>`;
  const headers = {
    "Content-Type": " application/xml",
  };

  const res = http.post(_url + "awsassessoria#calcular_acordo", payload, {
    headers,
  });

  check(res, {
    "Retorno positivo": (r) =>
      /<calcular_acordos>\s*<acordo_parcelas>/i.test(r.body),
  });
}
