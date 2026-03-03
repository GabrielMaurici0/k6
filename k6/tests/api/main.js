import script1 from "./obter_divida_calculada.js";
import script2 from "./pagamento_acordo_receptivo.js";
import script3 from "./acordo_canal_listar.js";
import script4 from "./acordo_canal_lote.js";
import script5 from "./blocklist_listar.js";
import script6 from "./boleto_2via.js";
import script7 from "./calcular_acordo.js";
import script8 from "./cancelar_meio_pagamento.js";
import script9 from "./consulta_acordo.js";
import script10 from "./fraudes_rejeitadas.js";
import script11 from "./incluir_acionamento.js";
import script12 from "./meio_pagamento_acordo.js";
import script13 from "./obter_divida_receptivo.js";
import script14 from "./quebrar_acordo.js";
import script15 from "./suspeita_fraude.js";


/*
      {
    //   executor: "ramping-vus",
    //   exec: "func9",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },
*/
export const options = {
  scenarios: {
    teste1: {
      executor: "constant-vus",
      exec: "func1",
      vus: 1,
      duration: "1m",
    },
    teste2: {
      executor: "constant-vus",
      exec: "func2",
      vus: 1,
      duration: "1m",
    },
    teste3: {
      executor: "constant-vus",
      exec: "func3",
      vus: 1,
      duration: "1m",
    },
    teste4: {
      executor: "constant-vus",
      exec: "func4",
      vus: 1,
      duration: "1m",
    },
    teste5:  {
      executor: "constant-vus",
      exec: "func5",
      vus: 5,
      duration: "1m",
    },
    teste6: {
      executor: "constant-vus",
      exec: "func6",
      vus: 5,
      duration: "1m",
    },
    teste7:  {
      executor: "constant-vus",
      exec: "func7",
      vus: 5,
      duration: "1m",
    },
    teste8: {
      executor: "constant-vus",
      exec: "func8",
      vus: 5,
      duration: "1m",
    },
    teste9: {
      executor: "ramping-vus",
      exec: "func9",
      startVUs: 0,
      stages: [
        { duration: "20s", target: 10 },
        { duration: "10s", target: 0 },
      ],
    },
    teste10: {
      executor: "ramping-vus",
      exec: "func10",
      startVUs: 0,
      stages: [
        { duration: "20s", target: 10 },
        { duration: "10s", target: 0 },
      ],
    },
    teste11: {
      executor: "ramping-vus",
      exec: "func11",
      startVUs: 0,
      stages: [
        { duration: "20s", target: 10 },
        { duration: "10s", target: 0 },
      ],
    },
    teste12: {
      executor: "ramping-vus",
      exec: "func12",
      startVUs: 0,
      stages: [
        { duration: "20s", target: 10 },
        { duration: "10s", target: 0 },
      ],
    },
    teste13: {
      executor: "ramping-vus",
      exec: "func13",
      startVUs: 0,
      stages: [
        { duration: "20s", target: 10 },
        { duration: "10s", target: 0 },
      ],
    },
    teste14: {
      executor: "ramping-vus",
      exec: "func14",
      startVUs: 0,
      stages: [
        { duration: "20s", target: 10 },
        { duration: "10s", target: 0 },
      ],
    },
    teste15: {
      executor: "ramping-vus",
      exec: "func15",
      startVUs: 0,
      stages: [
        { duration: "20s", target: 10 },
        { duration: "10s", target: 0 },
      ],
    }
  },
};

export function func1() {
  script1();
}

export function func2() {
  script2();
}

export function func3() {
  script3();
}

export function func4() {
  script4();
}

export function func5() {
  script5();
}

export function func6() {
  script6();
}

export function func7() {
  script7();
}

export function func8() {
  script8();
}

export function func9() {
  script9();
}

export function func10() {
  script10();
}

export function func11() {
  script11();
}

export function func12() {
  script12();
}

export function func13() {
  script13();
}

export function func14() {
  script14();
}

export function func15() {
  script15();
}
