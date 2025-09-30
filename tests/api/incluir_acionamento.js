import http from "k6/http";
import { check } from "k6";

const dados = JSON.parse(open("../../data/values.json"));

export let options = {
  vus: 10, // usuários virtuais
  duration: "30s", // duração do teste
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
  
  const _hour =
    String(_dateTime.getHours()).padStart(2, "0") +
    ":" +
    String(_dateTime.getMinutes()).padStart(2, "0");
  
  const _agenda = new Date(_dateTime);
  _agenda.setDate(_agenda.getDate() + 3);
  
  
  const _url = __ENV.URL
  const _auth = dados.config.token;
  const _carcod = dados.config.carcod;
  const _empcod = dados.config.empcod;

  const _devid = dados.incluir_acionamento.devedor[index];
  const _acaoId = dados.incluir_acionamento.acao[index];
  const _sitcod = dados.incluir_acionamento.situacao[index];
  const _operador = dados.incluir_acionamento.operador[index];
  const _descricao = dados.incluir_acionamento.descricao[index];
  const _tipo = dados.incluir_acionamento.tipo[index];
  const _telefone = dados.incluir_acionamento.telefone[index];
  const _email = dados.incluir_acionamento.email[index];
  const _codInadimplencia = dados.incluir_acionamento.inadimplencia[index];
  const _telInvalido = dados.incluir_acionamento.telefoneIncorreto[index];
  const _emailInvalido = dados.incluir_acionamento.emailIncorreto[index];
  const _canal = dados.incluir_acionamento.canal[index];

  const payload = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sis="siscobra">
   <soapenv:Header/>
   <soapenv:Body>
      <sis:WSAssessoria.Execute>
        <sis:Token>${_auth}</sis:Token>
        <sis:Carcod>${_carcod}</sis:Carcod>
        <sis:Metodo>INCLUIR_ACIONAMENTO</sis:Metodo>
        <sis:Xmlin>
            &lt;incluir_acionamento&gt;
                &lt;cod_assessoria/&gt;
                &lt;emp_cliente&gt;${_empcod}&lt;/emp_cliente&gt;
                &lt;cod_cliente&gt;${_devid}&lt;/cod_cliente&gt;
                &lt;acao_id&gt;${_acaoId}&lt;/acao_id&gt; 
                &lt;dat_acao&gt;${_date}&lt;/dat_acao&gt;
                &lt;hor_acao&gt;${_hour}&lt;/hor_acao&gt;
                &lt;cod_sit&gt;${_sitcod}&lt;/cod_sit&gt;
                &lt;dat_agenda&gt;${_agenda}&lt;/dat_agenda&gt;
                &lt;nom_operador&gt;${_operador}&lt;/nom_operador&gt;
                &lt;aca_descricao&gt;${_descricao}&lt;/aca_descricao&gt;
                &lt;aca_tipo&gt;${_tipo}&lt;/aca_tipo&gt;
                &lt;aca_telefone&gt;${_telefone}&lt;/aca_telefone&gt;
                &lt;aca_email&gt;${_email}&lt;/aca_email&gt;
                &lt;mot_inadimplencia&gt;${_codInadimplencia}&lt;/mot_inadimplencia&gt;
                &lt;telefones_invalidos&gt;
                      &lt;telefone&gt;${_telInvalido}&lt;/telefone&gt;
                &lt;/telefones_invalidos&gt;
                &lt;emails_invalidos&gt;
                      &lt;email&gt;${_emailInvalido}&lt;/email&gt;
                &lt;/emails_invalidos&gt;
                &lt;can_atendimento&gt;${_canal}&lt;/can_atendimento&gt;
            &lt;/incluir_acionamento&gt;
        </sis:Xmlin>
      </sis:WSAssessoria.Execute>
   </soapenv:Body>
</soapenv:Envelope>`;

  const headers = {
    "Content-Type": " application/xml",
  };

  const res = http.post(_url + "awsassessoria#incluir_acionamento", payload, {headers});

  
check(res, {
  'Retorno positivo': (r) =>
    /<retorno>\s*<codigo>200<\/codigo>\s*<descricao>Sucesso<\/descricao>/i.test(r.body),
});

}
