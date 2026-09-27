// Comprobación de literales (regla 6, CA-7), último paso de pnpm check: revisa componentes, páginas y layouts, imprime
// cada literal como archivo:línea: regla — fragmento y termina con código 1 si encuentra alguno
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";
import { findLiterals } from "./lib/find-literals.mjs";

const ROOT = join(import.meta.dirname, "..");
const DIRECTORIES = ["src/components", "src/pages", "src/layouts"];
// Además de componentes y scripts, las otras formas de página que admite Astro en src/pages (.md, .mdx, .html)
const EXTENSIONS = new Set([".astro", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".md", ".mdx", ".html"]);

const files = DIRECTORIES.flatMap((directory) => sourceFiles(join(ROOT, directory)))
  .map((file) => relative(ROOT, file).split(sep).join("/"))
  .sort();
const literals = files.flatMap((path) =>
  findLiterals(readFileSync(join(ROOT, path), "utf8")).map((literal) => ({ path, ...literal })),
);

for (const { path, line, rule, match } of literals) console.error(`${path}:${line}: ${rule} — ${match}`);

if (!files.some((path) => path.startsWith("src/pages/"))) {
  // El sitio siempre tiene páginas: si faltan, se movieron las carpetas y la comprobación no debe pasar en verde
  // habiendo revisado menos de lo que cree
  console.error("check-literals: ninguna página que revisar en src/pages");
  process.exitCode = 1;
} else if (literals.length > 0) {
  const affected = new Set(literals.map(({ path }) => path)).size;
  console.error(
    `check-literals: ${plural(literals.length, "literal", "literales")} en ${plural(affected, "archivo", "archivos")}. ` +
      "Usa los tokens de src/styles/globals.css (regla 6)",
  );
  process.exitCode = 1;
} else {
  console.log(`check-literals: ${plural(files.length, "archivo revisado", "archivos revisados")}, ningún literal`);
}

/**
 * @param {string} directory
 * @returns {string[]}
 */
function sourceFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && EXTENSIONS.has(extname(entry.name)))
    .map((entry) => join(entry.parentPath, entry.name));
}

/**
 * @param {number} count
 * @param {string} singular
 * @param {string} pluralForm
 */
function plural(count, singular, pluralForm) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}
