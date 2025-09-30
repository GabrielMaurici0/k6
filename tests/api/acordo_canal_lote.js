import http from "k6/http";
import { check } from "k6";

const dados = JSON.parse(open("../../data/values.json"));

export let options = {
  vus: 10, // usuários virtuais
  duration: "30s", // duração do teste
};


export default function () {
  const index = __VU - 1;
    
  const _url = __ENV.URL
  const _auth = dados.config.token;
  const _carcod = dados.config.carcod;
  const _empcod = dados.config.empcod;

  const _inicio = dados.acordo_canal_lote.data_inicial[index];
  const _fim = dados.acordo_canal_lote.data_final[index];

  const payload = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
   <soapenv:Header/>
   <soapenv:Body>
      <sis:WSAssessoria.Execute>
        <sis:Token>${_auth}</sis:Token>
        <sis:Carcod>${_carcod}</sis:Carcod>
        <sis:Metodo>ACORDO_CANAL_LOTE</sis:Metodo>
        <sis:Xmlin>
			&lt;acordo_canal_lote&gt;
				&lt;cod_assessoria&gt;${_carcod}&lt;/cod_assessoria&gt;
				&lt;emp_cliente&gt;${_empcod}&lt;/emp_cliente&gt;
				&lt;data_inicial&gt;${_inicio}&lt;/data_inicial&gt;
				&lt;data_final&gt;${_fim}&lt;/data_final&gt;
			&lt;/acordo_canal_lote&gt;
        </sis:Xmlin>
      </sis:WSAssessoria.Execute>
   </soapenv:Body>
</soapenv:Envelope>`;

  const headers = {
    "Content-Type": " application/xml",
  };

  const res = http.post(_url + "awsassessoria#acordo_canal_lote", payload, {headers});

  
check(res, {
  'Retorno positivo': (r) =>
    /<acordo_canal_lote>\s*<cod_lote>/i.test(r.body),
});
}
