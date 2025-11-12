import http from "k6/http";
import { check } from "k6";
import { baseScenario } from "./config/scenario.config.js";
import { globalThresholds } from "./config/globalThresholds.js";

// Carrega os dados JSON no init stage
const dados = JSON.parse(open("../../database/values.json"));

export const options = {
  ...baseScenario,
  thresholds: globalThresholds,
};

export default function () {
  const index = [__VU - 1]
  if (index >= dados.listPermissionUser.usuario.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }  

  const _auth = dados.config.token[index];
  const _usuario = dados.listPermissionUser.usuario[index]
  const _email = dados.listPermissionUser.email[index]
  const headers = {
    "Authorization": _auth,
    "UserCode": _usuario,
    "UserEmail":_email
  };

  const res = http.get(`${_url}awsusuario/ListPermissionUser`, { headers }); 
    
  check(res, {
    "Status code 200": (r) => r.status === 200,
  });
}
