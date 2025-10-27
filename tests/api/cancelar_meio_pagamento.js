import http from "k6/http";
import { check } from "k6";

const dados = JSON.parse(open("../../data/values.json"));

export let options = {
  vus: 10, // usuários virtuais
  duration: "30s", // duração do teste
};

export default function () {
  const index = __VU - 1;
  if (index >= dados.cancelar_meio_pagamento.devid.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }
  
  const _url = __ENV.URL;
  const _auth = dados.config.token;
  const _carcod = dados.config.carcod;
  const _empcod = dados.config.empcod;
  const _devid = dados.cancelar_meio_pagamento.devid[index];
  const _meio = dados.cancelar_meio_pagamento.meiopagamento[index];
  const payload = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
      <soapenv:Body>
        <sis:WSAssessoria.Execute>
          <sis:Token>${_auth}</sis:Token>
          <sis:Carcod>${_carcod}</sis:Carcod>
          <sis:Metodo>CANCELAR_MEIO_PAGAMENTO</sis:Metodo>
          <sis:Xmlin>
            &lt;cancelar_meio_pagamento&gt;
              &lt;assessoria&gt;${_carcod}&lt;/assessoria&gt;
              &lt;emp_cliente&gt;${_empcod}&lt;/emp_cliente&gt;
              &lt;cod_cliente&gt;${_devid}&lt;/cod_cliente&gt;
              &lt;meipag_seq&gt;${_meio}&lt;/meipag_seq&gt;
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
