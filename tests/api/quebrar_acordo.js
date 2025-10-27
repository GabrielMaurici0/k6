import http from "k6/http";
import { check } from "k6";

const dados = JSON.parse(open("../../data/values.json"));
const _url = __ENV.URL;
const _auth = dados.config.token;
const _carcod = dados.config.carcod;
const _empcod = dados.config.empcod;

export let options = {
  vus: 10, // usuários virtuais
  duration: "30s", // duração do teste
};

export default function () {
  const index = __VU - 1;
  if (index >= dados.quebrar_acordo.devid.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }      

  const _devid = dados.quebrar_acordo.devid[index];
  const _acocod = dados.quebrar_acordo.acocod[index];
  const _motivo = dados.quebrar_acordo.motivo[index];
  const payload = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
      <soapenv:Body>
          <sis:WSAssessoria.Execute>
            <sis:Token>${_auth}</sis:Token>
            <sis:Carcod>${_carcod}</sis:Carcod>
            <sis:Metodo>QUEBRAR_ACORDO</sis:Metodo>
            <sis:Xmlin>
              &lt;quebrar_acordo&gt;
                &lt;cod_assessoria&gt;${_carcod}&lt;/cod_assessoria&gt;
                &lt;emp_cliente&gt;${_empcod}&lt;/emp_cliente&gt;
                &lt;cod_cliente&gt;${_devid}&lt;/cod_cliente&gt;
                &lt;codigo_acordo&gt;${_acocod}&lt;/codigo_acordo&gt;
                &lt;motivo_quebra&gt;${_motivo}&lt;/motivo_quebra&gt;
              &lt;/quebrar_acordo&gt;
          </sis:Xmlin>
        </sis:WSAssessoria.Execute>
      </soapenv:Body>
    </soapenv:Envelope>`;
  const headers = {
    "Content-Type": " application/xml",
  };

  const res = http.post(
    _url + "awsassessoria#quebrar_acordo",
    payload,
    { headers }
  );

  check(res, {
    "Retorno positivo": (r) =>
      /<retorno>\s*<codigo>200<\/codigo>\s*<descricao>Sucesso<\/descricao>\s*<\/retorno>/i.test(
        r.body
      ),
  });
}
