import http from "k6/http";
import { check } from "k6";

const dados = JSON.parse(open("../../data/values.json"));

export let options = {
  vus: 2, // usuários virtuais
  duration: "5s", // duração do teste
};

export default function () {
  const index = __VU - 1;
  
  const _url = __ENV.URL;
  const _auth = dados.config.token;
  const _carcod = dados.config.carcod;
  const _empcod = dados.config.empcod;

  const _cpfValue = dados.pagamento_acordo_receptivo.cpf[index];
  const _dddValue = dados.pagamento_acordo_receptivo.ddd[index];
  const _telefoneValue = dados.pagamento_acordo_receptivo.telefone[index];

  const payload = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
   <soapenv:Header/>
   <soapenv:Body>
		<sis:WSAssessoria.Execute>
			<sis:Token>${_auth}</sis:Token>
			<sis:Carcod>${_carcod}</sis:Carcod>
			<sis:Metodo>PAGAMENTO_ACORDO_RECEPTIVO</sis:Metodo>
			<sis:Xmlin>
				&lt;pagamento_acordo_receptivo&gt;
					&lt;emp_cliente&gt;${_empcod}&lt;/emp_cliente&gt;
					&lt;cpf_cliente&gt;${_cpfValue}&lt;/cpf_cliente&gt;						
					&lt;ddd_cliente&gt;${_dddValue}&lt;/ddd_cliente&gt;
					&lt;fone_cliente&gt;${_telefoneValue}&lt;/fone_cliente&gt;																	
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
  'Retorno positivo': (r) =>
    /<meio_pagamento>\s*<ass_cod>/i.test(r.body),
});

}
