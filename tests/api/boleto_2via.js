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

  const _devid = dados.boleto_2via.devid[index];
  const _parcela = dados.boleto_2via.parcela[index];
  const _enviaWpp = dados.boleto_2via.envia_whats[index];
  const _telefone = dados.boleto_2via.telefone[index];
  const _enviaEmail = dados.boleto_2via.envia_email[index];
  const _email = dados.boleto_2via.email[index];

  const payload = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
   <soapenv:Header/>
   <soapenv:Body>
      <sis:WSAssessoria.Execute>
        <sis:Token>${_auth}</sis:Token>
        <sis:Carcod>${_carcod}</sis:Carcod>
        <sis:Metodo>BOLETO_2VIA</sis:Metodo>
        <sis:Xmlin>
			&lt;obter_boleto_2via&gt;
				&lt;cod_empresa&gt;${_empcod}&lt;/cod_empresa&gt;
				&lt;cod_cliente&gt;${_devid}&lt;/cod_cliente&gt;
				&lt;cod_parcela&gt;${_parcela}&lt;/cod_parcela&gt;
				&lt;envia_whatsapp&gt;${_enviaWpp}&lt;/envia_whatsapp&gt; 
			    &lt;cliente_whatsapp&gt;${_telefone}&lt;/cliente_whatsapp&gt; 
				&lt;envia_email&gt;${_enviaEmail}&lt;/envia_email&gt;
				&lt;cliente_email&gt;${_email}&lt;/cliente_email&gt;
			&lt;/obter_boleto_2via&gt;
        </sis:Xmlin>
      </sis:WSAssessoria.Execute>
   </soapenv:Body>
</soapenv:Envelope>`;

  const headers = {
    "Content-Type": " application/xml",
  };

  const res = http.post(_url + "awsassessoria#boleto_2via", payload, {
    headers,
  });

check(res, {
  'Retorno positivo': (r) =>
    /<boleto_2via>\s*<cod_empresa>/i.test(r.body),
});

}
