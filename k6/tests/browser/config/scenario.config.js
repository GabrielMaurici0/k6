export const baseScenario = {
  executor: "shared-iterations", 
  iterations: 50, // número de iterações por VU
  vus: 1, // número de usuários virtuais
  options: {
    browser: {
      type: "chromium", // tipo de navegador (chromium, firefox, webkit)
    },
  },
};
