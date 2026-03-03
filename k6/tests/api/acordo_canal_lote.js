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
  if (index >= dados.acordo_canal_lote.data_inicial.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }

  const _url = __ENV.URL;
  const _auth = dados.config.token;
  const _carteira = dados.config.carteira;
  const _empresa = dados.config.empresa;
  const _dataInicial = dados.acordo_canal_lote.data_inicial[index];
  const _dataFinal = dados.acordo_canal_lote.data_final[index];
  const payload = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
      <soapenv:Body>
        <sis:WSAssessoria.Execute>
          <sis:Token>${_auth}</sis:Token>
          <sis:Carcod>${_carteira}</sis:Carcod>
          <sis:Metodo>ACORDO_CANAL_LOTE</sis:Metodo>
          <sis:Xmlin>
            &lt;acordo_canal_lote&gt;
              &lt;cod_assessoria&gt;${_carteira}&lt;/cod_assessoria&gt;
              &lt;emp_cliente&gt;${_empresa}&lt;/emp_cliente&gt;
              &lt;data_inicial&gt;${_dataInicial}&lt;/data_inicial&gt;
              &lt;data_final&gt;${_dataFinal}&lt;/data_final&gt;
            &lt;/acordo_canal_lote&gt;
          </sis:Xmlin>
        </sis:WSAssessoria.Execute>
      </soapenv:Body>
    </soapenv:Envelope>`;
  const headers = {
    "Content-Type": " application/xml",
  };

  const res = http.post(_url + "awsassessoria#acordo_canal_lote", payload, {
    headers,
  });

  check(res, {
    "Retorno positivo": (r) => /<acordo_canal_lote>\s*<cod_lote>/i.test(r.body),
  });
}
