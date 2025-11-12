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
  const headers = {
    "Authorization": _auth,
  };
  
  const res = http.get(`${_url}awsusuario/ListPermission`, { headers }); 
    
  check(res, {
    "Status code 200": (r) => r.status === 200,
  });
}
