import http from "k6/http";
import { check } from "k6";

// Carrega os dados JSON no init stage
const dados = JSON.parse(open("../../data/values.json"));
const _url = __ENV.URL;
const _auth = dados.config.token;

export const options = {
  vus: 1, // número de usuários virtuais
  //duration: "1s", // duração total do teste
  iterations: 1,
};

export default function () {
  const index = __VU - 1;
  if (index >= dados.statusUser.code.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }      

  const _code = dados.statusUser.code[index];
  const _email = dados.statusUser.email[index];
  const headers = {
    "Authorization": _auth,
    "UserCode": _code,
    "UserEmail": _email,
  };

  const res = http.get(`${_url}awsusuario/StatusUser`, { headers });

  check(res, {
    "Status code 200": (r) => r.status === 200,
  });
}
