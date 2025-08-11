import http from "k6/http";
import { check } from "k6";
import { open } from "k6/fs";

// Carrega o JSON no escopo global (apenas 1x antes do teste começar)
const dados = JSON.parse(open("./valores.json"));
// valores.json → por exemplo: [123, 456, 789, 999]

export const options = {
  vus: 4, // número de usuários virtuais
  iterations: 4, // 1 request por VU para este exemplo
};

export default function () {
  // __VU é 1-based, por isso usamos (__VU - 1) como índice
  const meuValor = dados[__VU - 1];

  const res = http.get(`https://httpbin.org/get?valor=${meuValor}`);

  check(res, {
    "status 200": (r) => r.status === 200,
  });
}
