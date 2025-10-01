import http from "k6/http";
import { check } from "k6";

// Carrega os dados JSON no init stage
const dados = JSON.parse(open("../../data/values.json"));
const _url = __ENV.URL;
const _auth = dados.config.token;


export const options = {
  vus: 2, // número de usuários virtuais
  //duration: "1s", // duração total do teste
  iterations: 2,
};

export default function () {
    const idx = __VU - 1
    const _status = dados.listUser.status[idx]

  const headers = {
      "Authorization": _auth,
      "UserStatus": _status
  };
    
  const res = http.get(`${_url}awsusuario/ListUser`, { headers });

  console.log(res.body);
  
    
  check(res, {
    "Status code 200": (r) => r.status === 200,
  });
}
