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
  if (index >= dados.updateUser.usuario.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }      

  const _user = dados.updateUser.usuario[index];
  const _email = dados.updateUser.email[index];
  const _name = dados.updateUser.nome[index];
  const _cpf = dados.updateUser.cpf[index];
  const _bday = dados.updateUser.bday[index];
  const _phone = dados.updateUser.phone[index];
  const _pgc = dados.updateUser.privilegio[index];
  const headers = {
    "Authorization": _auth,
    "UserCode": _user,
    "UserEmail": _email,
    "Content-Type": "application/json",
  };
  const payload = JSON.stringify({
  userName: _name ,
  userCPF: _cpf,
  userBirthDate: _bday,
  userCell: _phone,
  userPrivilegeGroupCode: _pgc
  });

  const res = http.post(`${_url}awsusuario/UpdateUser`, payload, {
    headers,
  });

  check(res, {
    "Status code 200": (r) => r.status === 200,
  });
}
