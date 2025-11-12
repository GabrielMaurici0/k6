import http from "k6/http";
import { check } from "k6";
import { baseScenario } from "./config/scenario.config.js";
import { globalThresholds } from "./config/globalThresholds.js";

// Carrega os dados JSON no init stage
const dados = JSON.parse(open("../../database/values.json"));

export const options = {
  ...baseScenario,
  thresholds: globalThresholds,
};

export default function () {
  const index = __VU - 1;
  if (index >= dados.meio_pagamento_acordo.devedor.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }

  const _url = __ENV.URL;
  const _auth = dados.config.token;
  const _carteira = dados.config.carteira;
  const _empresa = dados.config.empresa;
  const _devedor = dados.meio_pagamento_acordo.devedor[index];
  const _acordo = dados.meio_pagamento_acordo.acordo[index];
  const _numero_parcela = dados.meio_pagamento_acordo.numero_parcela[index];
  const _vencimento_parcela = dados.meio_pagamento_acordo.vencimento_parcela[index];

  const payload = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra"> 
      <soapenv:Body>
        <sis:WSAssessoria.Execute>
          <sis:Token>${_auth}</sis:Token>
          <sis:Carcod>${_carteira}</sis:Carcod>
          <sis:Metodo>MEIO_PAGAMENTO_ACORDO</sis:Metodo>
          <sis:Xmlin>
            &lt;acordo&gt;&gt;
              &lt;cod_assessoria&gt;${_carteira}&lt;/cod_assessoria&gt;
              &lt;emp_cliente&gt;${_empresa}&lt;/emp_cliente&gt;
              &lt;cod_cliente&gt;${_devedor}&lt;/cod_cliente&gt;
              &lt;aco_cod&gt;${_acordo}&lt;/aco_cod&gt;
              &lt;acordo_parcelas&gt;
                &lt;parcela&gt;
                  &lt;Par_Num&gt;${_numero_parcela}&lt;/Par_Num&gt;
                  &lt;Par_Ven&gt;${_vencimento_parcela}&lt;/Par_Ven&gt;
                &lt;/parcela&gt;
              &lt;/acordo_parcelas&gt;
            &lt;/acordo&gt;																
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
