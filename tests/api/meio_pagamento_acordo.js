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

  const _devid = dados.pagamento_acordo_receptivo.devid[index];
  const _acocod = dados.pagamento_acordo_receptivo.acordo[index];
  const _parnum = dados.pagamento_acordo_receptivo.parnum[index];
  const _parven = dados.pagamento_acordo_receptivo.parven[index];

  const payload = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
   <soapenv:Header/>
   <soapenv:Body>
		<sis:WSAssessoria.Execute>
			<sis:Token>${_auth}</sis:Token>
			<sis:Carcod>${_carcod}</sis:Carcod>
			<sis:Metodo>PAGAMENTO_ACORDO_RECEPTIVO</sis:Metodo>
			<sis:Xmlin>
            &lt;acordo&gt;&gt;
              &lt;cod_assessoria&gt;${_carcod}&lt;/cod_assessoria&gt;
              lt;emp_cliente&gt;${_empcod}&lt;/emp_cliente&gt;
              &lt;cod_cliente&gt;${_devid}&lt;/cod_cliente&gt;
              &lt;aco_cod&gt;${_acocod}&lt;/aco_cod&gt;
              &lt;acordo_parcelas&gt;
                &lt;parcela&gt;
                  &lt;Par_Num&gt;${_parnum}&lt;/Par_Num&gt;
                  &lt;Par_Ven&gt;${_parven}&lt;/Par_Ven&gt;
                &lt;/parcela&gt;
              &lt;/acordo_parcelas&gt;
            &lt;/acordo&gt;																
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
    "Retorno positivo": (r) => /<meio_pagamento>\s*<ass_cod>/i.test(r.body),
  });
}
