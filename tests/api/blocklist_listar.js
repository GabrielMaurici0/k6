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

  const _inicio = dados.blocklist_listar.data_inicial[index];
  const _fim = dados.blocklist_listar.data_final[index];
  const _tipo = dados.blocklist_listar.tipo[index];

  const payload = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
   <soapenv:Header/>
   <soapenv:Body>
      <sis:WSAssessoria.Execute>
        <sis:Token>${_auth}</sis:Token>
        <sis:Carcod>${_carcod}</sis:Carcod>
        <sis:Metodo>BLOCKLIST_LISTAR</sis:Metodo>
        <sis:Xmlin>
			&lt;blocklist&gt; 
				&lt;cod_empresa&gt;${_empcod}&lt;/cod_empresa&gt; 
				 &lt;dat_inicial&gt;${_inicio}&lt;/dat_inicial&gt; 
				 &lt;dat_final&gt;${_fim}&lt;/dat_final&gt; 
				&lt;tip_blocklist&gt;${_tipo}&lt;/tip_blocklist&gt;  
			&lt;/blocklist&gt;
        </sis:Xmlin>
      </sis:WSAssessoria.Execute>
   </soapenv:Body>
</soapenv:Envelope>`;

  const headers = {
    "Content-Type": " application/xml",
  };

  const res = http.post(_url + "awsassessoria#blocklist_listar", payload, {
    headers,
  });

check(res, {
  'Retorno positivo': (r) =>
    /<blocklist>\s*<telefones>/i.test(r.body),
});

}
