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
  // Validação para evitar erros se faltar dados
  if (index >= dados.fraudeAprovar.fraude.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }

  // Extrai dados para este VU
  const _fraude = dados.fraudeAprovar.fraude[index];
  const _usuario = dados.fraudeAprovar.usuario[index];
  const _observacao = dados.fraudeAprovar.observacao[index];
  const payload = {
    idFraude: _fraude,
    usuarioAcao: _usuario,
    observacao: _observacao,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: _auth,
  };

  const res = http.post(`${_url}awsfraudeapi/fraudeAprovar`, payload, {
    headers,
  });

  check(res, {
    "Status code 201": (r) => r.status === 201,
  });
}
