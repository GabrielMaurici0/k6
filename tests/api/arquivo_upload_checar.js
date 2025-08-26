import http from "k6/http";
import { check } from "k6";

const dados = JSON.parse(open("../../data/values.json"));

export default function () {
  
  const _url = __ENV.URL
  const _auth = __ENV.AUTH
  const _carcod = __ENV.CARCOD

  const _value = dados.arquivo_upload_checar.id[__VU - 1];
  
  const payload = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
   <soapenv:Header/>
   <soapenv:Body>
      <sis:WSAssessoria.Execute>
         <sis:Token>${_auth}</sis:Token>
         <sis:Carcod>${_carcod}</sis:Carcod>
         <sis:Metodo>ARQUIVO_UPLOAD_CHECAR</sis:Metodo>
         <sis:Xmlin>
            &lt;arquivo_upload_checar&gt;
                &lt;id_arquivo&gt;${_value}&lt;/id_arquivo&gt;
            &lt;/arquivo_upload_checar&gt;
         </sis:Xmlin>
      </sis:WSAssessoria.Execute>
   </soapenv:Body>`;

  const headers = {
    "Content-Type": " application/xml",
  };

  const res = http.post(_url + "awsassessoria#arquivo_upload_checar", payload, {headers});

  

  check(res, {
    "status 200": (r) => r.status === 200,
  });
}
