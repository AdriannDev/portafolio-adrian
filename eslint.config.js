// @ts-check
import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

// https://eslint.org/docs/latest/use/configure/configuration-files
export default defineConfig(
  // ESLint no lee .gitignore: salidas de build, pruebas y medición (con JS generado) y los prototipos de design/
  globalIgnores([
    "dist/",
    ".astro/",
    ".wrangler/",
    ".lighthouseci/",
    "test-results/",
    "playwright-report/",
    "coverage/",
    "design/",
  ]),
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  {
    // Scripts de verificación que ejecuta Node: console y process son globales de Node; el resto se importa de node:*
    files: ["scripts/**/*.mjs"],
    languageOptions: { globals: { console: "readonly", process: "readonly" } },
  },
);
