import http from "k6/http";
import { check } from "k6";
import encoding from "k6/encoding";
import { baseScenario } from "./config/scenario.config.js";
import { globalThresholds } from "./config/globalThresholds.js";

// Carrega os dados JSON no init stage
const dados = JSON.parse(open("../../database/values.json"));
const _url = __ENV.URL;
const _auth = dados.config.token;

const arquivosBase64 = dados.fraudeReprovar.arquivo.map((path) => {
  const fileData = open(path, "b"); // Retorna ArrayBuffer
  return encoding.b64encode(fileData); // Converte para Base64 string
});

export const options = {
  ...baseScenario,
  thresholds: globalThresholds,
};

export default function () {
  const index = __VU - 1;
  if (index >= dados.fraudeReprovar.fraude.length) {
    console.error(`Não há dados suficientes para o VU ${__VU}`);
    return;
  }

  // Extrai dados para este VU
  const _fraude = dados.fraudeReprovar.fraude[index];
  const _usuario = dados.fraudeReprovar.usuario[index];
  const _observacao = dados.fraudeReprovar.observacao[index];
  const _base64 = arquivosBase64[index];
  let payload;

  if (arquivosBase64[index] != null) {
    payload = {
      idFraude: _fraude,
      usuarioAcao: _usuario,
      observacao: _observacao,
      anexo: _base64,
    };
  } else {
    payload = {
      idFraude: _fraude,
      usuarioAcao: _usuario,
      observacao: _observacao,
    };
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: _auth,
  };

  const res = http.post(`${_url}awsfraudeapi/fraudeReprovar`, payload, {
    headers,
  });

  check(res, {
    "Status code 201": (r) => r.status === 201,
  });
}
