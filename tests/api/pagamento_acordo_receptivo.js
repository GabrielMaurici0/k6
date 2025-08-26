import http from "k6/http";
import { check } from "k6";

const dados = JSON.parse(open("../../data/values.json"));

export default function () {
  
  const _url = __ENV.URL
  const _auth = __ENV.AUTH
  const _carcod = __ENV.CARCOD
  const _empcod = __ENV.EMPCOD

  const _cpfValue = dados.pagamento_acordo_receptivo.cpf[__VU - 1];
  const _dddValue = dados.pagamento_acordo_receptivo.ddd[__VU - 1];
  const _telefoneValue = dados.pagamento_acordo_receptivo.telefone[__VU - 1];

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

  const res = http.post(_url + "awsassessoria#pagamento_acordo_receptivo", payload, {headers});

  

  check(res, {
    "status 200": (r) => r.status === 200,
  });
}
