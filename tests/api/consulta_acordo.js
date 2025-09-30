import http from "k6/http";
import { check } from "k6";

const dados = JSON.parse(open("../../data/values.json"));

export let options = {
  vus: 10, // usuários virtuais
  duration: "30s", // duração do teste
};

export default function () {
  const index = __VU - 1;

  const _url = __ENV.URL;
  const _auth = dados.config.token;
  const _carcod = dados.config.carcod;
  const _empcod = dados.config.empcod;

  const _devid = dados.consulta_acordo.devid[index];
  const _acocod = dados.consulta_acordo.devid[index];
  const _detalhado = dados.consulta_acordo.devid[index];

  const payload = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
   <soapenv:Header/>
   <soapenv:Body>
      <sis:WSAssessoria.Execute>
        <sis:Token>${_auth}</sis:Token>
        <sis:Carcod>${_carcod}</sis:Carcod>
        <sis:Metodo>CONSULTA_ACORDO</sis:Metodo>
        <sis:Xmlin>
            &lt;consulta_acordo&gt;
                &lt;cod_assessoria/&gt;
                &lt;emp_cliente&gt;${_empcod}&lt;/emp_cliente&gt;
                &lt;cod_cliente&gt;${_devid}&lt;/cod_cliente&gt;
                &lt;codigo_acordo&gt;${_acocod}&lt;/codigo_acordo&gt;
				        &lt;acordo_detalhado&gt;${_detalhado}&lt;/acordo_detalhado&gt;
            &lt;/consulta_acordo&gt;
        </sis:Xmlin>
      </sis:WSAssessoria.Execute>
   </soapenv:Body>
</soapenv:Envelope>`;

  const headers = {
    "Content-Type": " application/xml",
  };

  const res = http.post(_url + "awsassessoria#consulta_acordo", payload, {
    headers,
  });

check(res, {
  'Retorno positivo': (r) =>
    /<acordo>\s*<ass_cod>/i.test(r.body),
});

}
