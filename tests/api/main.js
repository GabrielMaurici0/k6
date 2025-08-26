import script1 from "./obter_divida_calculada.js";
import script2 from "./pagamento_acordo_receptivo.js";
// import script3 from "./script2.js";
// import script4 from "./script2.js";
// import script5 from "./script2.js";
// import script6 from "./script2.js";
// import script7 from "./script2.js";
// import script8 from "./script2.js";
// import script9 from "./script2.js";
// import script10 from "./script2.js";
// import script11 from "./script2.js";
// import script12 from "./script2.js";
// import script13 from "./script2.js";
// import script14 from "./script2.js";
// import script15 from "./script2.js";
// import script16 from "./script2.js";
// import script17 from "./script2.js";
// import script18 from "./script2.js";
// import script19 from "./script2.js";
// import script20 from "./script2.js";


export const options = {
  scenarios: {
    teste1: {
      executor: "constant-vus",
      exec: "func1",
      vus: 1,
      duration: '1m',
    },
    teste2: {
      executor: "ramping-vus",
      exec: "func2",
      startVUs: 0,
      stages: [
        { duration: "20s", target: 10 },
        { duration: "10s", target: 0 },
      ],
    },
    // teste3: {
    //   executor: "ramping-vus",
    //   exec: "func3",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },
    // teste4: {
    //   executor: "ramping-vus",
    //   exec: "func4",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },
    // teste5: {
    //   executor: "ramping-vus",
    //   exec: "func5",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },
    // teste6: {
    //   executor: "ramping-vus",
    //   exec: "func6",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },
    // teste7: {
    //   executor: "ramping-vus",
    //   exec: "func7",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },
    // teste8: {
    //   executor: "ramping-vus",
    //   exec: "func8",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },
    // teste9: {
    //   executor: "ramping-vus",
    //   exec: "func9",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },
    // teste10: {
    //   executor: "ramping-vus",
    //   exec: "func10",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },
    // teste11: {
    //   executor: "ramping-vus",
    //   exec: "func11",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },  
    // teste12: {
    //   executor: "ramping-vus",
    //   exec: "func12",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },  
    // teste13: {
    //   executor: "ramping-vus",
    //   exec: "func13",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },  
    // teste14: {
    //   executor: "ramping-vus",
    //   exec: "func14",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },  
    // teste15: {
    //   executor: "ramping-vus",
    //   exec: "func15",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },  
    // teste16: {
    //   executor: "ramping-vus",
    //   exec: "func16",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },  
    // teste17: {
    //   executor: "ramping-vus",
    //   exec: "func17",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },  
    // teste18: {
    //   executor: "ramping-vus",
    //   exec: "func18",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },  
    // teste19: {
    //   executor: "ramping-vus",
    //   exec: "func19",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },  
    // teste20: {
    //   executor: "ramping-vus",
    //   exec: "func20",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "20s", target: 10 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },  
  },
};

export function func1() {
  script1();
}

export function func2() {
  script2();
}

// export function func3() {
//   script3();
// }

// export function func4() {
//   script4();
// }

// export function func5() {
//   script5();
// }

// export function func6() {
//   script6();
// }

// export function func7() {
//   script7();
// }

// export function func8() {
//   script8();
// }

// export function func9() {
//   script9();
// }

// export function func10() {
//   script10();
// }

// export function func11() {
//   script11();
// }

// export function func12() {
//   script12();
// }

// export function func13() {
//   script13();
// }

// export function func14() {
//   script14();
// }

// export function func15() {
//   script15();
// }

// export function func16() {
//   script16();
// }

// export function func17() {
//   script17();
// }

// export function func18() {
//   script18();
// }

// export function func19() {
//   script19();
// }

// export function func20() {
//   script20();
// }

