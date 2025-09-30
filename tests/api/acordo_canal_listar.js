import http from "k6/http";
import { check } from "k6";

const dados = JSON.parse(open("../../data/values.json"));

export let options = {
  vus: 1, // usuários virtuais
  duration: "5s", // duração do teste
};

export default function () {
  const index = __VU - 1;
  
  const _url = __ENV.URL;
  const _auth = dados.config.token;
  const _carcod = dados.config.carcod;
  const _empcod = dados.config.empcod;

  const _value = dados.acordo_canal_listar[index];

  const payload = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
   <soapenv:Header/>
   <soapenv:Body>
      <sis:WSAssessoria.Execute>
        <sis:Token>${_auth}</sis:Token>
        <sis:Carcod>${_carcod}</sis:Carcod>
        <sis:Metodo>ACORDO_CANAL_LISTAR</sis:Metodo>
        <sis:Xmlin>
			&lt;acordo_canal_listar&gt;
				&lt;cod_assessoria&gt;${_carcod}&lt;/cod_assessoria&gt;
				&lt;emp_cliente&gt;${_empcod}&lt;/emp_cliente&gt;
				&lt;cod_lote&gt;${_value}&lt;/cod_lote&gt;
			&lt;/acordo_canal_listar&gt;
        </sis:Xmlin>
      </sis:WSAssessoria.Execute>
   </soapenv:Body>
</soapenv:Envelope>`;

  const headers = {
    "Content-Type": " application/xml",
  };

  const res = http.post(_url + "awsassessoria#acordo_canal_listar", payload, {headers});

  console.log(_auth);
  

check(res, {
  'Retorno positivo': (r) =>
    /<acordo_canal_listar>\s*<lote>/i.test(r.body),
});

}
