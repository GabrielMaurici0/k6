import http from "k6/http";
import { check } from "k6";

const dados = JSON.parse(open("../../data/values.json"));

export let options = {
  vus: 10, // usuários virtuais
  duration: "30s", // duração do teste
};

export default function () {
  const index = __VU - 1;
  if (index >= dados.calcular_acordo.devid.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }
  
  const _url = __ENV.URL;
  const _auth = __ENV.AUTH;
  const _carcod = __ENV.CARCOD;
  const _empcod = __ENV.EMPCOD;
  const _devid = dados.calcular_acordo.devid[index];
  const _date = dados.calcular_acordo.data_calculo[index];
  const _acordo = dados.calcular_acordo.acocod[index];
  const _forpagcod = dados.calcular_acordo.forma_negociacao[index];
  const payload = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
      <soapenv:Body>
        <sis:WSAssessoria.Execute>
          <sis:Token>${_auth}</sis:Token>
          <sis:Carcod>${_carcod}</sis:Carcod>
          <sis:Metodo>CALCULAR_ACORDO</sis:Metodo>
          <sis:Xmlin>
            &lt;calcular_acordo&gt;
              &lt;cod_assessoria&gt;${_carcod}&lt;/cod_assessoria&gt;
              &lt;emp_cliente&gt;${_empcod}&lt;/emp_cliente&gt;
              &lt;cod_cliente&gt;${_devid}&lt;/cod_cliente&gt;
              &lt;data_calculo&gt;${_date}&lt;/data_calculo&gt;
              &lt;codigo_acordo&gt;${_acordo}&lt;/codigo_acordo&gt;
              &lt;forma_negociacao&gt;${_forpagcod}&lt;/forma_negociacao&gt;
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
