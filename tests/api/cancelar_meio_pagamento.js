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
  if (index >= dados.cancelar_meio_pagamento.devedor.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }

  const _url = __ENV.URL;
  const _auth = dados.config.token;
  const _carteira = dados.config.carteira;
  const _empresa = dados.config.empresa;
  const _devedor = dados.cancelar_meio_pagamento.devedor[index];
  const _meioPagamento = dados.cancelar_meio_pagamento.meio_pagamento[index];
  const payload = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
      <soapenv:Body>
        <sis:WSAssessoria.Execute>
          <sis:Token>${_auth}</sis:Token>
          <sis:Carcod>${_carteira}</sis:Carcod>
          <sis:Metodo>CANCELAR_MEIO_PAGAMENTO</sis:Metodo>
          <sis:Xmlin>
            &lt;cancelar_meio_pagamento&gt;
              &lt;assessoria&gt;${_carteira}&lt;/assessoria&gt;
              &lt;emp_cliente&gt;${_empresa}&lt;/emp_cliente&gt;
              &lt;cod_cliente&gt;${_devedor}&lt;/cod_cliente&gt;
              &lt;meipag_seq&gt;${_meioPagamento}&lt;/meipag_seq&gt;
            &lt;/cancelar_meio_pagamento&gt;
          </sis:Xmlin>
        </sis:WSAssessoria.Execute>
      </soapenv:Body>
    </soapenv:Envelope>`;
  const headers = {
    "Content-Type": " application/xml",
  };

  const res = http.post(
    _url + "awsassessoria#cancelar_meio_pagamento",
    payload,
    {
      headers,
    }
  );

  check(res, {
    "Retorno positivo": (r) =>
      /<retorno>\s*<codigo>200<\/codigo>\s*<descricao>Sucesso<\/descricao>\s*<\/retorno>/i.test(
        r.body
      ),
  });
}
