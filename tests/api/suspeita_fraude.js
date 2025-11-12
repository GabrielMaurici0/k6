import http from "k6/http";
import { check } from "k6";
import encoding from "k6/encoding";
import { baseScenario } from "./config/scenario.config.js";
import { globalThresholds } from "./config/globalThresholds.js";

// Carrega os dados JSON no init stage
const dados = JSON.parse(open("../../database/values.json"));
const _url = __ENV.URL;
const _auth = dados.config.token;
const _carteira = dados.config.carteira;
const _empresa = dados.config.empresa;

const arquivosBase64 = dados.suspeita_fraude.arquivo.map((path) => {
  const fileData = open(path, "b"); // Retorna ArrayBuffer
  return encoding.b64encode(fileData); // Converte para Base64 string
});

export const options = {
  ...baseScenario,
  thresholds: globalThresholds,
};

export default function () {
  const index = __VU - 1;
  // Validação para evitar erros se faltar dados
  if (index >= dados.suspeita_fraude.devedor.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }

  // Extrai dados para este VU
  const _devedor = dados.suspeita_fraude.devedor[index];
  const _nivel = dados.suspeita_fraude.nivel[index];
  const _telefone = dados.suspeita_fraude.telefone[index];
  const _titulo = dados.suspeita_fraude.titulo[index];
  const _extensao = dados.suspeita_fraude.extensao[index];
  const _base64 = arquivosBase64[index];
  // Monta payload SOAP
  const payload = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
      <soapenv:Body>
        <sis:WSAssessoria.Execute>
          <sis:Token>${_auth}</sis:Token>
          <sis:Carcod>${_carteira}</sis:Carcod>
          <sis:Metodo>SUSPEITA_FRAUDE</sis:Metodo>
          <sis:Xmlin>
            &lt;suspeita_fraude&gt;
              &lt;cod_assessora&gt;${_carteira}&lt;/cod_assessora&gt;
              &lt;emp_cliente&gt;${_empresa}&lt;/emp_cliente&gt;
              &lt;cod_cliente&gt;${_devedor}&lt;/cod_cliente&gt;
              &lt;fraude_nivel_fraude&gt;${_nivel}&lt;/fraude_nivel_fraude&gt;
              &lt;fraude_telefone_contato&gt;${_telefone}&lt;/fraude_telefone_contato&gt;
              &lt;fraude_observacao&gt;Suspeita de fraude cadastrada via teste com K6&lt;/fraude_observacao&gt;
              &lt;titulos&gt;
                &lt;titulo&gt;${_titulo}&lt;/titulo&gt;
              &lt;/titulos&gt;
              &lt;documentos&gt;
                &lt;documento&gt;
                  &lt;documento_extensao&gt;${_extensao}&lt;/documento_extensao&gt;
                  &lt;documento_base64&gt;${_base64}&lt;/documento_base64&gt;
                &lt;/documento&gt;
              &lt;/documentos&gt;
            &lt;/suspeita_fraude&gt;
          </sis:Xmlin>
        </sis:WSAssessoria.Execute>
      </soapenv:Body>
    </soapenv:Envelope>`;
  const headers = {
    "Content-Type": "application/xml",
  };

  const res = http.post(`${_url}awsassessoria#suspeita_fraude`, payload, {
    headers,
  });

  check(res, {
    "Retorno positivo": (r) =>
      /<codigo>200<\/codigo>\s*<descricao>Sucesso<\/descricao>/i.test(r.body),
  });
}
