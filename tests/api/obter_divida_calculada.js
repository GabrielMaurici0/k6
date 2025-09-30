import http from "k6/http";
import { check } from "k6";

const dados = JSON.parse(open("../../data/values.json"));
const _url = __ENV.URL;
const _auth = dados.config.token;
const _carcod = dados.config.carcod;
const _empcod = dados.config.empcod;

export let options = {
  vus: 1, // usuários virtuais
  duration: "10s", // duração do teste
};

export default function () {
  const index = __VU - 1;

  const _dateTime = new Date();

  const _date =
    String(_dateTime.getDate()).padStart(2, "0") +
    "/" +
    String(_dateTime.getMonth()).padStart(2, "0") +
    "/" +
    _dateTime.getFullYear();

  const _value = dados.obter_divida_calculada.devid[index];

  const payload = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
   <soapenv:Header/>
   <soapenv:Body>
      <sis:WSAssessoria.Execute>
        <sis:Token>${_auth}</sis:Token>
        <sis:Carcod>${_carcod}</sis:Carcod>
            <sis:Metodo>OBTER_DIVIDA_CALCULADA</sis:Metodo>
            <sis:Xmlin>
                &lt;obter_divida_calculada&gt;
                    &lt;cod_assessoria&gt;${_carcod}&lt;/cod_assessoria&gt;
                    &lt;emp_cliente&gt;${_empcod}&lt;/emp_cliente&gt;
                    &lt;cod_cliente&gt;${_value}&lt;/cod_cliente&gt;
                    &lt;data_calculo&gt;${_date}&lt;/data_calculo&gt;
                &lt;/obter_divida_calculada&gt;
              </sis:Xmlin>
        </sis:WSAssessoria.Execute>
    </soapenv:Body>
</soapenv:Envelope>`;

  const headers = {
    "Content-Type": " application/xml",
  };

const res = http.post(
  _url + "awsassessoria#obter_divida_calculada",
  payload,
  { headers }
);

  console.log(res.body)
  

// const xmloutMatch = res.body.match(/<Xmlout>([\s\S]*?)<\/Xmlout>/i);

//   if (!xmloutMatch) {
//     console.error('Não encontrou a tag <Xmlout> no response');
//     check(res, { 'Retorno positivo': () => false });
//   } else {
//     // decodificar entidades HTML
//     const xmlText = xmloutMatch[1]
//       .replace(/&lt;/g, '<')
//       .replace(/&gt;/g, '>');

//     check(res, {
//       'Retorno positivo': () =>
//         /<\s*dividas_calculadas\s*>[\s\S]*?<\s*produtos\s*>[\s\S]*?<\s*produto\s*>/i.test(xmlText),
//     });
//   }

}
