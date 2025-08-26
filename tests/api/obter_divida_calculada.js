import http from "k6/http";
import { check } from "k6";



const dados = JSON.parse(open("../../data/values.json"));

export default function () {
  
  const _url = __ENV.URL
  const _auth = __ENV.AUTH
  const _carcod = __ENV.CARCOD
  const _empcod = __ENV.EMPCOD

  const _dateTime = new Date()

  const _date = String(_dateTime.getDate()).padStart(2, '0') + '/' +
    String(_dateTime.getMonth()).padStart(2, '0') + '/' +
    _dateTime.getFullYear()

  const _value = dados.gerar_acordo[__VU - 1];

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
</soapenv:Envelope>`

  const headers = {
    "Content-Type": " application/xml",
  };

  const res = http.post(_url + "awsassessoria#obter_divida_calculada", payload, {headers});

  

  check(res, {
    "status 200": (r) => r.status === 200,
  });
}
