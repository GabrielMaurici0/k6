import http from "k6/http";
import { check } from "k6";
import { baseScenario } from "./config/scenario.config.js";
import { globalThresholds } from "./config/globalThresholds.js";

// Carrega os dados JSON no init stage
const dados = JSON.parse(open("../../database/values.json"));
const _url = __ENV.URL;
const _auth = dados.config.token;

export const options = {
  ...baseScenario,
  thresholds: globalThresholds,
};

export default function () {
  const index = __VU - 1;
  if (index >= dados.updateUser.usuario.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }      

  const _usuario = dados.updateUser.usuario[index];
  const _email = dados.updateUser.email[index];
  const _nome = dados.updateUser.nome[index];
  const _cpf = dados.updateUser.cpf[index];
  const _aniversario = dados.updateUser.aniversario[index];
  const _telefone = dados.updateUser.telefone[index];
  const _privilegio = dados.updateUser.privilegio[index];
  const headers = {
    "Authorization": _auth,
    "UserCode": _usuario,
    "UserEmail": _email,
    "Content-Type": "application/json",
  };
  const payload = JSON.stringify({
    userName: _nome,
    userCPF: _cpf,
    userBirthDate: _aniversario,
    userCell: _telefone,
    userPrivilegeGroupCode: _privilegio,
  });

  const res = http.post(`${_url}awsusuario/UpdateUser`, payload, {
    headers,
  });

  check(res, {
    "Status code 200": (r) => r.status === 200,
  });
}
