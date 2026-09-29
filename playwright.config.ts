import { defineConfig, devices } from "@playwright/test";

// Puerto propio de las pruebas de navegador: el 4321 lo ocupa `astro dev` y el 4322 el `preview` del navegador
// integrado (.claude/launch.json). Con reuseExistingServer se probaría ese servidor ajeno en vez del dist/ recién
// construido, que es justo lo que estas pruebas verifican
const PORT = 4323;
const BASE_URL = `http://localhost:${PORT}`;

// https://playwright.dev/docs/test-configuration
export default defineConfig({
  testDir: "tests/e2e",
  // Un .only olvidado dejaría en verde una ejecución que no probó nada
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  // Con reintentos, un fallo en la integración continua no deja nada que mirar si no se guarda la traza
  use: { baseURL: BASE_URL, trace: "on-first-retry", screenshot: "only-on-failure" },
  projects: [{ name: "chromium", use: devices["Desktop Chrome"] }],
  webServer: {
    // astro preview sirve dist/, y el script test:e2e construye antes de llamar aquí
    command: `pnpm preview --port ${PORT}`,
    url: BASE_URL,
    // Nunca se reutiliza un servidor ya levantado: si el puerto está ocupado, es mejor fallar que medir otro sitio
    reuseExistingServer: false,
    // Sin la salida del servidor, un puerto ocupado por algo que no habla HTTP solo da un tiempo de espera opaco
    stdout: "pipe",
    timeout: 60_000,
  },
});
