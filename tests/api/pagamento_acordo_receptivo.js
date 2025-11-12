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
  if (index >= dados.pagamento_acordo_receptivo.cpf.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }

  const _url = __ENV.URL;
  const _auth = dados.config.token;
  const _carteira = dados.config.carteira;
  const _empresa = dados.config.empresa;
  const _cpf = dados.pagamento_acordo_receptivo.cpf[index];
  const _ddd = dados.pagamento_acordo_receptivo.ddd[index];
  const _telefone = dados.pagamento_acordo_receptivo.telefone[index];
  const payload = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
      <soapenv:Body>
		    <sis:WSAssessoria.Execute>
          <sis:Token>${_auth}</sis:Token>
          <sis:Carcod>${_carteira}</sis:Carcod>
          <sis:Metodo>PAGAMENTO_ACORDO_RECEPTIVO</sis:Metodo>
          <sis:Xmlin>
            &lt;pagamento_acordo_receptivo&gt;
              &lt;emp_cliente&gt;${_empresa}&lt;/emp_cliente&gt;
              &lt;cpf_cliente&gt;${_cpf}&lt;/cpf_cliente&gt;						
              &lt;ddd_cliente&gt;${_ddd}&lt;/ddd_cliente&gt;
              &lt;fone_cliente&gt;${_telefone}&lt;/fone_cliente&gt;																	
            &lt;/pagamento_acordo_receptivo&gt;
          </sis:Xmlin>
        </sis:WSAssessoria.Execute>
      </soapenv:Body>
    </soapenv:Envelope>`;
  const headers = {
    "Content-Type": " application/xml",
  };

  const res = http.post(
    _url + "awsassessoria#pagamento_acordo_receptivo",
    payload,
    { headers }
  );

  check(res, {
    "Retorno positivo": (r) => /<meio_pagamento>\s*<ass_cod>/i.test(r.body),
  });
}
