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
    
  const _name = dados.createUser.name[index];
  const _email = dados.createUser.email[index];
  const _cpf = dados.createUser.cpf[index];
  const _bday = dados.createUser.bday[index];
  const _phone = dados.createUser.phone[index];
  const _type = dados.createUser.type[index];
  const _time = dados.createUser.time[index];
  const _group = dados.createUser.gruop[index];
  const _status = dados.createUser.status[index];
  const _azureAD = dados.createUser.azureAD[index];

  const headers = {
    "Authorization": _auth,
    "Content-Type": "application/json",
  };

  const payload = JSON.stringify({
    userName: _name,
    userEmail: _email,
    userCPF: _cpf,
    userBirthDate: _bday,
    userCell: _phone,
    userUserType: _type,
    userTime: _time,
    userPrivilegeGroup: _group,
    userStatus: _status,
    userAzureAD: _azureAD,
  });

  const res = http.post(`${_url}awsusuario/CreateUser`, payload, {
    headers,
  });

  check(res, {
    "Status code 201": (r) => r.status === 201,
  });
}
