import http from "k6/http";
import { check } from "k6";

const dados = JSON.parse(open("../../data/values.json"));

export let options = {
  vus: 10, // usuários virtuais
  duration: "30s", // duração do teste
};

export default function () {
  const index = __VU - 1;
  if (index >= dados.fraude_rejeitadas.inicial.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }
  
  const _url = __ENV.URL
  const _auth = dados.config.token;
  const _carcod = dados.config.carcod;
  const _inicial = dados.fraude_rejeitadas.inicial[index];
  const _final = dados.fraude_rejeitadas.final[index];
  const payload = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
      <soapenv:Body>
        <sis:WSAssessoria.Execute>
          <sis:Token>${_auth}</sis:Token>
          <sis:Carcod>${_carcod}</sis:Carcod>
          <sis:Metodo>ACORDO_CANAL_LISTAR</sis:Metodo>
          <sis:Xmlin>
            &lt;fraudes_rejeitadas&gt;
              &lt;data_inicial&gt;${_inicial}&lt;/data_inicial&gt;
              &lt;data_final&gt;${_final}&lt;/data_final&gt;
            &lt;/fraudes_rejeitadas&gt;
          </sis:Xmlin>
        </sis:WSAssessoria.Execute>
      </soapenv:Body>
    </soapenv:Envelope>`;
  const headers = {
    "Content-Type": " application/xml",
  };

  const res = http.post(_url + "awsassessoria#fraudes_rejeitadas", payload, {headers});

  check(res, {
    "Retorno positivo": (r) =>
      /<fraudes_rejeitadas>\s*<fraude_rejeitada>/i.test(r.body),
  });
}
