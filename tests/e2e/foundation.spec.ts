import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Lo que solo se puede comprobar sobre la página ya construida y servida: idioma y metadatos (CA-4), el CSS que
// realmente se publica (CA-5), el movimiento reducido (CA-6), las fuentes y el origen de cada petición (CA-9) y la
// accesibilidad. La sincronía entre el sistema de diseño y globals.css la cubre tests/unit/design-tokens.test.ts.

const DIST = new URL("../../dist/", import.meta.url);

/** `.48s` o `480ms` → 480. Lightning CSS reescribe las duraciones en segundos, así que no vale comparar el texto. */
function toMilliseconds(value: string): number {
  const match = /^(-?[\d.]+)(ms|s)$/.exec(value.trim());
  if (!match) throw new Error(`Duración con un formato que no se reconoce: "${value}"`);
  return Number(match[1]) * (match[2] === "s" ? 1000 : 1);
}

test.describe("Portada servida desde dist/", () => {
  test("declara el español de Perú, un título y una descripción (CA-4)", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "es-PE");
    expect((await page.title()).trim()).toBeTruthy();
    const description = await page.locator('head meta[name="description"]').getAttribute("content");
    expect(description?.trim()).toBeTruthy();
  });

  test("no pide nada a terceros y sirve como mucho seis archivos de fuente (CA-9)", async ({ page, baseURL }) => {
    const urls: string[] = [];
    // El registro se instala antes de navegar: si no, se pierden las peticiones del propio documento y sus fuentes
    page.on("request", (request) => urls.push(request.url()));

    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    // Al reposo de red, y no solo a las fuentes: lo que pida un script diferido (la analítica de la 004) tiene que
    // entrar en el registro, o esta prueba dejaría de ser la red de seguridad de CA-9 sin avisar
    await page.waitForLoadState("networkidle");

    const own = new URL(baseURL!).origin;
    // data: y blob: se resuelven dentro del documento; tercero es solo lo que sale a la red hacia otro origen
    const remote = urls.filter((url) => url.startsWith("http://") || url.startsWith("https://"));
    expect(remote.length).toBeGreaterThan(0);
    expect(remote.filter((url) => new URL(url).origin !== own)).toEqual([]);

    const fonts = remote.filter((url) => /\.(woff2?|ttf|otf)$/.test(new URL(url).pathname));
    expect(fonts.length).toBeGreaterThan(0);
    expect(fonts.length).toBeLessThanOrEqual(6);
  });

  test("resuelve exactamente las tres familias tipográficas (CA-9)", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    const families = await page.evaluate(() => {
      const elements = [document.documentElement, ...document.querySelectorAll<HTMLElement>("body, body *")];
      // Solo la primera entrada de font-family: las siguientes son los respaldos, no familias que se descarguen
      return [
        ...new Set(
          elements.map((element) => getComputedStyle(element).fontFamily.split(",")[0]!.trim().replaceAll(/["']/g, "")),
        ),
      ];
    });

    // Exactamente tres, no «como mucho tres»: si la portada dejara de usar una, se seguirían sirviendo sus archivos
    // y la prueba de peticiones tampoco lo vería. Los nombres no se fijan porque Astro les añade un hash
    expect(families.length, `Familias resueltas: ${families.join(" · ")}`).toBe(3);
  });

  test("reduce a cero las duraciones de sección y cinematográfica con movimiento reducido (CA-6)", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const durations = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        section: styles.getPropertyValue("--duration-section"),
        cinematic: styles.getPropertyValue("--duration-cinematic"),
      };
    });

    expect(toMilliseconds(durations.section)).toBe(0);
    expect(toMilliseconds(durations.cinematic)).toBe(0);
  });

  test("mantiene esas duraciones cuando no hay movimiento reducido (CA-6)", async ({ page }) => {
    // Sin esta contraprueba, unas duraciones puestas a cero siempre dejarían la prueba anterior en verde
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");

    const durations = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        section: styles.getPropertyValue("--duration-section"),
        cinematic: styles.getPropertyValue("--duration-cinematic"),
      };
    });

    expect(toMilliseconds(durations.section)).toBeGreaterThan(0);
    expect(toMilliseconds(durations.cinematic)).toBeGreaterThan(0);
  });

  test("no tiene violaciones de accesibilidad serias ni críticas", async ({ page }) => {
    await page.goto("/");

    const { violations, incomplete } = await new AxeBuilder({ page }).analyze();
    const serious = violations.filter(({ impact }) => impact === "serious" || impact === "critical");
    const list = (results: typeof violations) =>
      results
        .map(({ id, impact, nodes }) => `${id} (${impact}): ${nodes.map((node) => node.target.join(" ")).join(", ")}`)
        .join("\n");

    // Los resultados «incompletos» (axe no pudo decidir, típico del contraste sobre un fondo que no resuelve) no
    // hacen fallar, pero se imprimen: son la pista de por qué una violación real podría estar pasando inadvertida
    const report = `Violaciones de axe:\n${list(serious)}\n\nSin decidir:\n${list(incomplete)}`;
    expect(serious, report).toEqual([]);
  });
});

test.describe("Artefacto publicado en dist/", () => {
  /**
   * Nombres de las propiedades personalizadas que **declara** una hoja, incluidos los reinicios de Tailwind, que
   * llevan un asterisco (`--color-*: initial`). Las cadenas se neutralizan antes que los comentarios: al revés, un
   * `content: "/*"` abriría un comentario falso y se tragaría en silencio todo el CSS hasta el siguiente cierre.
   */
  function declaredVariables(css: string): string[] {
    const clean = css.replaceAll(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""').replaceAll(/\/\*[\s\S]*?\*\//g, "");
    return [...clean.matchAll(/(--[\w-]+\*?)\s*:/g)].map(([, name]) => name!);
  }

  // Categorías que nombra CA-5: color, familia tipográfica, tamaño de texto, radio, sombra y curva de animación.
  // --font-weight-*, --leading-*, --tracking-*, --spacing y --container-* quedan fuera porque CA-5 no los enumera y
  // globals.css no los reinicia: hueco conocido, anotado para la retro en el registro de T7 y T8
  const CATEGORIES = [
    "--color-",
    "--font-",
    "--text-",
    "--radius-",
    "--shadow-",
    "--inset-shadow-",
    "--drop-shadow-",
    "--ease-",
    "--animate-",
  ];
  // --tw-* son variables internas de Tailwind, no tokens; --font-weight-* cae dentro de --font- sin ser una familia
  const EXCLUDED = ["--tw-", "--font-weight-"];
  const inScope = (name: string) =>
    !EXCLUDED.some((prefix) => name.startsWith(prefix)) && CATEGORIES.some((prefix) => name.startsWith(prefix));

  /** Rutas de dist/ con una extensión, relativas a dist/ y con barras normales para que el mensaje se lea igual. */
  async function distFiles(extension: string): Promise<string[]> {
    const entries = await readdir(DIST, { recursive: true, withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
      .map((entry) => relative(fileURLToPath(DIST), join(entry.parentPath, entry.name)).replaceAll("\\", "/"));
  }

  const readDist = (file: string) => readFile(new URL(file, DIST), "utf8");

  test("declara el español de Perú en todos los documentos que genera (CA-4)", async () => {
    // CA-4 dice «todo documento que genere», no solo la portada: la prueba crece sola con las páginas de la 002
    const documents = await distFiles(".html");
    expect(documents.length).toBeGreaterThan(0);

    const wrong: string[] = [];
    for (const file of documents) if (!/<html[^>]*\slang="es-PE"/i.test(await readDist(file))) wrong.push(file);
    expect(wrong, 'Documentos sin lang="es-PE"').toEqual([]);
  });

  test("no publica ningún valor por defecto de las categorías de CA-5", async () => {
    const globals = await readFile(new URL("../../src/styles/globals.css", import.meta.url), "utf8");
    // Los reinicios (--color-*: initial) no son tokens. Las referencias sí: así entran --font-instrument-serif,
    // --font-geist y --font-geist-mono, que declara la API de fuentes de Astro y globals.css enlaza en @theme inline
    const allowed = new Set([
      ...declaredVariables(globals).filter((name) => !name.endsWith("*")),
      ...[...globals.matchAll(/var\(\s*(--[\w-]+)/g)].map(([, name]) => name!),
    ]);

    const stylesheets = await distFiles(".css");
    const documents = await distFiles(".html");
    expect(stylesheets.length + documents.length).toBeGreaterThan(0);

    const published: { file: string; name: string }[] = [];
    for (const file of [...stylesheets, ...documents]) {
      const content = await readDist(file);
      // De los .html solo interesa el CSS: los <style> que Astro incrusta cuando la hoja es pequeña o son de fuentes
      const css = file.endsWith(".css")
        ? content
        : [...content.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(([, block]) => block!).join("\n");
      published.push(
        ...declaredVariables(css)
          .filter(inScope)
          .map((name) => ({ file, name })),
      );
    }

    expect(published.length).toBeGreaterThan(0);
    const foreign = published.filter(({ name }) => !allowed.has(name));
    expect(
      [...new Set(foreign.map(({ file, name }) => `${file}: ${name}`))],
      "Variables que no son tokens del proyecto (regla 6, CA-5)",
    ).toEqual([]);
  });

  test("sirve como mucho seis archivos de fuente (CA-9)", async () => {
    // Se busca en todo dist/ y no en _astro/fonts/: si Astro cambia de carpeta, el fallo debe ser este mensaje y no
    // un ENOENT que no dice nada de CA-9
    const files = await distFiles("");
    const fonts = files.filter((file) => /\.(woff2?|ttf|otf)$/.test(file));

    expect(
      fonts.length,
      "Ningún archivo de fuente en dist/: las fuentes deben servirse desde el propio origen",
    ).toBeGreaterThan(0);
    expect(fonts.length, `Archivos de fuente: ${fonts.join(" · ")}`).toBeLessThanOrEqual(6);
  });
});
