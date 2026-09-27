import { defineConfig } from "vitest/config";

// https://vitest.dev/config/
export default defineConfig({
  test: {
    // Solo las pruebas unitarias: las de navegador de tests/e2e/ son de Playwright (T8) y Vitest no debe recogerlas
    include: ["tests/unit/**/*.test.ts"],
  },
});
