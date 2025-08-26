import script1 from "./acionamento.js";

// export const options = {
//   scenarios: {
//     teste1: {
//       executor: "constant-vus",
//       exec: "func1",
//       vus: 1,
//       duration: '1m',
//     },
    // teste2: {
    //   executor: "ramping-vus",
    //   exec: "func2",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },
//   },
// };

export const options = {
    scenarios: {
        teste1: {
            executor: "shared-iterations",
            exec: "func1",
            iterations: 5, //quantia de vezes que vai executar
            vus: 1, //quantia de guias que vão ser abertas 
            options: {
                browser: {
                    type: "chromium",
                },
            },
        },
    },
    thresholds: {
      checks: ["rate==1.0"],
    },
  };

export function func1() {
  script1();
}

// export function func2() {
//   script2();
// }
