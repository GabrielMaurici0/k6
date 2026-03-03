import http from "k6/http";
import { check } from "k6";
import { baseScenario } from "./config/scenario.config.js";
import { globalThresholds } from "./config/globalThresholds.js";

const dados = JSON.parse(open("../../database/values.json"));

export const options = {
  ...baseScenario,
  thresholds: globalThresholds,
};

export default function () {
  const index = __VU - 1;
  if (index >= dados.blocklist_listar.data_inicial.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }

  const _url = __ENV.URL;
  const _auth = dados.config.token;
  const _carteira = dados.config.carteira;
  const _empresa = dados.config.empresa;
  const _dataInicial = dados.blocklist_listar.data_inicial[index];
  const _dataFinal = dados.blocklist_listar.data_final[index];
  const _tipoBlocklist = dados.blocklist_listar.tipo_blocklist[index];
  const payload = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
      <soapenv:Body>
        <sis:WSAssessoria.Execute>
          <sis:Token>${_auth}</sis:Token>
          <sis:Carcod>${_carteira}</sis:Carcod>
          <sis:Metodo>BLOCKLIST_LISTAR</sis:Metodo>
          <sis:Xmlin>
            &lt;blocklist&gt; 
              &lt;cod_empresa&gt;${_empresa}&lt;/cod_empresa&gt; 
              &lt;dat_inicial&gt;${_dataInicial}&lt;/dat_inicial&gt; 
              &lt;dat_final&gt;${_dataFinal}&lt;/dat_final&gt; 
              &lt;tip_blocklist&gt;${_tipoBlocklist}&lt;/tip_blocklist&gt;  
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
    "Retorno positivo": (r) => /<blocklist>\s*<telefones>/i.test(r.body),
  });
}
