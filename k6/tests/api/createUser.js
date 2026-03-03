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
  if (index >= dados.createUser.nome.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }
  
  const _nome = dados.createUser.nome[index];
  const _email = dados.createUser.email[index];
  const _cpf = dados.createUser.cpf[index];
  const _aniversario = dados.createUser.aniversario[index];
  const _telefone = dados.createUser.telefone[index];
  const _tipoUsuario = dados.createUser.tipo_usuario[index];
  const _horarioAcesso = dados.createUser.horario_acesso[index];
  const _grupo = dados.createUser.grupo[index];
  const _status = dados.createUser.status[index];
  const _azureAD = dados.createUser.azureAD[index];
  const headers = {
    "Authorization": _auth,
    "Content-Type": "application/json",
  };
  const payload = JSON.stringify({
    userName: _nome,
    userEmail: _email,
    userCPF: _cpf,
    userBirthDate: _aniversario,
    userCell: _telefone,
    userUserType: _tipoUsuario,
    userTime: _horarioAcesso,
    userPrivilegeGroup: _grupo,
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
