// @ts-check
// Presupuesto de tamaños de la portada (CA-11, CA-N01.4), segunda mitad de pnpm perf: mide dist/index.html, imprime
// el desglose con gzip y termina con código 1 si el JS o el CSS llegan a su límite. Lighthouse no garantiza que su
// servidor comprima, por eso los tamaños se miden aquí y no con una aserción suya (ADR-012)
import { readFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import { BUDGETS, budgetFailures, measurePageWeight } from "./lib/size-budget.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const DIST = resolve(ROOT, "dist");
const PAGE = resolve(DIST, "index.html");

const html = read(PAGE);
if (html === null) {
  // Sin build no hay nada que medir, y pasar en verde sin haber medido es el peor resultado posible
  console.error(`check-size-budget: falta ${posix(PAGE)}. Ejecuta pnpm build antes de medir`);
  process.exit(1);
}

const { js, css, assets, unresolved } = measurePageWeight(html.toString("utf8"), (path) => {
  const file = resolve(DIST, path);
  return file.startsWith(DIST + sep) ? read(file) : null;
});

console.log(`check-size-budget: portada ${posix(PAGE)}`);
const width = Math.max(...assets.map(({ source }) => source.length), 0);
for (const { kind, source, bytes } of [...assets].sort((a, b) => b.bytes - a.bytes)) {
  console.log(`  ${kind.toUpperCase().padEnd(3)} ${source.padEnd(width)}  ${kilobytes(bytes)}`);
}
console.log(`  JS  ${kilobytes(js)} de ${limit(BUDGETS.js)} · CSS ${kilobytes(css)} de ${limit(BUDGETS.css)}`);

if (assets.length === 0) {
  // La portada siempre sirve al menos su hoja de estilos: sin ningún activo, lo medido no es la portada, sino un
  // build a medias o un dist/ de otra rama. Pasar en verde sin haber medido nada es el peor resultado posible
  console.error(`check-size-budget: ningún activo que medir en ${posix(PAGE)}. Ejecuta pnpm build antes de medir`);
  process.exitCode = 1;
}
for (const href of unresolved) {
  console.error(`check-size-budget: no se pudo medir «${href}» (otro origen, o el archivo no está en dist/)`);
}
const failures = budgetFailures({ js, css });
for (const { kind, bytes, limit: max } of failures) {
  const label = kind === "js" ? "El JavaScript" : "El CSS";
  console.error(
    `check-size-budget: ${label} de la portada ocupa ${kilobytes(bytes)} con gzip y el presupuesto es ` +
      `${limit(max)}, que hay que quedar por debajo (CA-N01.4)`,
  );
}
if (unresolved.length > 0 || failures.length > 0) process.exitCode = 1;

/**
 * @param {string} file
 * @returns {Buffer | null}
 */
function read(file) {
  try {
    return readFileSync(file);
  } catch {
    // No existe, o es una carpeta: quien llama decide si eso es un fallo
    return null;
  }
}

/** @param {number} bytes */
function kilobytes(bytes) {
  return `${(bytes / 1000).toFixed(1).replace(".", ",")} kB`;
}

/** @param {number} bytes */
function limit(bytes) {
  return `${bytes / 1000} kB`;
}

/** @param {string} file */
function posix(file) {
  return relative(ROOT, file).split(sep).join("/");
}
