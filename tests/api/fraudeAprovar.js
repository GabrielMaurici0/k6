import http from "k6/http";
import { check } from "k6";

// Carrega os dados JSON no init stage
const dados = JSON.parse(open("../../data/values.json"));
const _url = __ENV.URL;
const _auth = dados.config.token;

export const options = {
  vus: 1, // número de usuários virtuais
  iteration: 1, //duration: "5s", // duração total do teste
};

export default function () {
  const index = __VU - 1;

  // Validação para evitar erros se faltar dados
  if (index >= dados.fraudeAprovar.fraude.length) {
    console.error(`🚨 Não há dados suficientes para o VU ${__VU}`);
    return;
  }

  // Extrai dados para este VU
  const _fracod = dados.fraudeAprovar.fraude[index];
  const _user = dados.fraudeAprovar.usuario[index];
  const _obs = dados.fraudeAprovar.observacao[index];


    const payload = {
      idFraude: _fracod,
      usuarioAcao: _user,
      observacao: _obs,
    };

  const headers = {
    "Content-Type": "application/json",
    Authorization: _auth,
  };

  const res = http.post(`${_url}awsfraudeapi/fraudeAprovar`, payload, {
    headers,
  });

  check(res, {
    "Status code 201": (r) => r.status === 201,
  });
}
