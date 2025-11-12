export const baseScenario = {
  executor: "shared-iterations", 
  iterations: 1, // número de iterações por VU
  vus: 1, // número de usuários virtuais
  options: {
    browser: {
      type: "chromium", // tipo de navegador (chromium, firefox, webkit)
    },
  },
};
