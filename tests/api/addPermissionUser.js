import http from "k6/http";
import { check } from "k6";

// Carrega os dados JSON no init stage
const dados = JSON.parse(open("../../data/values.json"));
const _url = __ENV.URL;
const _auth = dados.config.token;

export const options = {
  vus: 1,
  iterations: 1,
};

export default function () {
  const index = __VU - 1;
  if (index >= dados.addPermissionUser.usuario.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }

  const _user = dados.addPermissionUser.usuario[index];
  const _email = dados.addPermissionUser.email[index];
  const _code = dados.addPermissionUser.privilegio[index];
  const headers = {
    "Authorization": _auth,
    "UserCode": _user,
    "UserEmail": _email,
    "Content-Type": "application/json",
  };
  const payload = JSON.stringify({
    privilegeCode: _code,
  });

  const res = http.post(`${_url}awsusuario/AddPermissionUser`, payload, {
    headers,
  }); 

  check(res, {
    "Status code 200": (r) => r.status === 200,
  });
}
