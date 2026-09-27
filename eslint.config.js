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
    // El frontmatter es TypeScript: los nombres no definidos ya los detecta astro check, y no-undef daría falsos
    // positivos con tipos globales como HTMLElement o ImageMetadata (lo que recomienda typescript-eslint)
    files: ["**/*.astro"],
    rules: { "no-undef": "off" },
  },
  {
    // Scripts de verificación que ejecuta Node: console y process son globales de Node; el resto se importa de node:*
    files: ["scripts/**/*.mjs"],
    languageOptions: { globals: { console: "readonly", process: "readonly" } },
  },
);
