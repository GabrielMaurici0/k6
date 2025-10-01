import http from "k6/http";
import { check } from "k6";

// Carrega os dados JSON no init stage
const dados = JSON.parse(open("../../data/values.json"));
const _url = __ENV.URL;
const _auth = dados.config.token;


export const options = {
    vus: 1, // número de usuários virtuais
    //duration: "1s", // duração total do teste
    iteration:1,
};

export default function () {
    const index = [__VU - 1]
    const _code = dados.listPermissionUser.usuario[index]
    const _email = dados.listPermissionUser.email[index]

    const headers = {
      "Authorization": _auth,
      "UserCode": _code,
      "UserEmail":_email
  };

    const res = http.get(`${_url}awsusuario/ListPermissionUser`, { headers }); 
    
  check(res, {
    "Status code 200": (r) => r.status === 200,
  });
}
