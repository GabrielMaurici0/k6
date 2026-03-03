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
  if (index >= dados.quebrar_acordo.devedor.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }

  const _devedor = dados.quebrar_acordo.devedor[index];
  const _acordo = dados.quebrar_acordo.acordo[index];
  const _motivoQuebra = dados.quebrar_acordo.motivo_quebra[index];
  const payload = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
      <soapenv:Body>
          <sis:WSAssessoria.Execute>
            <sis:Token>${_auth}</sis:Token>
            <sis:Carcod>${_carteira}</sis:Carcod>
            <sis:Metodo>QUEBRAR_ACORDO</sis:Metodo>
            <sis:Xmlin>
              &lt;quebrar_acordo&gt;
                &lt;cod_assessoria&gt;${_carteira}&lt;/cod_assessoria&gt;
                &lt;emp_cliente&gt;${_empresa}&lt;/emp_cliente&gt;
                &lt;cod_cliente&gt;${_devedor}&lt;/cod_cliente&gt;
                &lt;codigo_acordo&gt;${_acordo}&lt;/codigo_acordo&gt;
                &lt;motivo_quebra&gt;${_motivoQuebra}&lt;/motivo_quebra&gt;
              &lt;/quebrar_acordo&gt;
          </sis:Xmlin>
        </sis:WSAssessoria.Execute>
      </soapenv:Body>
    </soapenv:Envelope>`;
  const headers = {
    "Content-Type": " application/xml",
  };

  const res = http.post(_url + "awsassessoria#quebrar_acordo", payload, {
    headers,
  });

  check(res, {
    "Retorno positivo": (r) =>
      /<retorno>\s*<codigo>200<\/codigo>\s*<descricao>Sucesso<\/descricao>\s*<\/retorno>/i.test(
        r.body
      ),
  });
}
