import { gzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { BUDGETS, budgetFailures, measurePageWeight } from "../../scripts/lib/size-budget.mjs";

// Presupuesto de tamaños de la portada (CA-11, CA-N01.4). La medición y la decisión se prueban por separado:
// acertar un gzip de exactamente 180 000 bytes es inviable, pero budgetFailures sí admite números sintéticos.

/** Tamaño con gzip que debe dar la medición. El nivel por defecto de zlib es el que fija el plan */
const gz = (content: string) => gzipSync(content).length;

/** Lector de activos publicados: la prueba no toca disco */
const publishing =
  (files: Record<string, string>) =>
  (path: string): string | null =>
    path in files ? files[path] : null;

const nothing = () => null;

// Contenido variado para que el gzip de cada activo dé un tamaño distinto y una suma equivocada se note
const SCRIPT = "export const mission = () => console.info('M-001 en curso, telemetría activa');\n";
const STYLES = ".hero { color: var(--color-accent); letter-spacing: var(--tracking-label); }\n";

describe("measurePageWeight: qué cuenta", () => {
  it("suma los activos externos y los que van dentro del HTML", () => {
    const inlineScript = "queueMicrotask(() => (document.documentElement.dataset.ready = 'true'));";
    const inlineStyle = ":root { color-scheme: dark; }";
    const html = `<html><head>
      <link rel="stylesheet" href="/_astro/index.css">
      <style>${inlineStyle}</style>
      </head><body><script type="module" src="/_astro/island.js"></script>
      <script>${inlineScript}</script></body></html>`;

    const weight = measurePageWeight(html, publishing({ "_astro/index.css": STYLES, "_astro/island.js": SCRIPT }));

    expect(weight.js).toBe(gz(SCRIPT) + gz(inlineScript));
    expect(weight.css).toBe(gz(STYLES) + gz(inlineStyle));
    expect(weight.unresolved).toEqual([]);
    expect(weight.assets.map(({ kind, source }) => `${kind} ${source}`)).toEqual([
      "css _astro/index.css",
      "css <style> en línea #1",
      "js _astro/island.js",
      "js <script> en línea #1",
    ]);
  });

  it("cuenta el modulepreload como JavaScript", () => {
    const html = '<link rel="modulepreload" href="/_astro/island.js">';
    expect(measurePageWeight(html, publishing({ "_astro/island.js": SCRIPT }))).toMatchObject({
      js: gz(SCRIPT),
      css: 0,
    });
  });

  it("cuenta una vez el módulo que llevan a la vez script src y modulepreload", () => {
    const html = `<link rel="modulepreload" href="/_astro/island.js">
      <script type="module" src="/_astro/island.js"></script>`;
    const weight = measurePageWeight(html, publishing({ "_astro/island.js": SCRIPT }));

    expect(weight.js).toBe(gz(SCRIPT));
    expect(weight.assets).toHaveLength(1);
  });

  it("no cuenta el cuerpo de un script que además tiene src, que el navegador ignora", () => {
    const html = `<script src="/_astro/island.js">${"// relleno\n".repeat(500)}</script>`;
    expect(measurePageWeight(html, publishing({ "_astro/island.js": SCRIPT })).js).toBe(gz(SCRIPT));
  });

  it("no cuenta los enlaces que no son hoja de estilo ni modulepreload", () => {
    const html = `<link rel="preload" href="/_astro/fonts/geist.woff2" as="font" type="font/woff2" crossorigin>
      <link rel="icon" href="/favicon.svg">
      <link rel="canonical" href="/">`;
    expect(measurePageWeight(html, nothing)).toMatchObject({ js: 0, css: 0, unresolved: [] });
  });

  it("lee rel como lista de palabras y no distingue mayúsculas", () => {
    const html = '<LINK REL="STYLESHEET PRELOAD" HREF="/_astro/index.css">';
    expect(measurePageWeight(html, publishing({ "_astro/index.css": STYLES })).css).toBe(gz(STYLES));
  });

  it("descarta la consulta y el fragmento al resolver la ruta", () => {
    const html = `<link rel="stylesheet" href="/_astro/index.css?v=2">
      <script type="module" src="/_astro/island.js#entry"></script>`;
    const files = { "_astro/index.css": STYLES, "_astro/island.js": SCRIPT };

    expect(measurePageWeight(html, publishing(files))).toMatchObject({
      js: gz(SCRIPT),
      css: gz(STYLES),
      unresolved: [],
    });
  });

  it("ignora los bloques en línea vacíos o con solo espacios", () => {
    expect(measurePageWeight("<script></script><style>\n  \n</style>", nothing)).toMatchObject({
      js: 0,
      css: 0,
      assets: [],
    });
  });

  it("no cuenta nada en un documento sin activos", () => {
    expect(measurePageWeight("<html><body><h1>Hola</h1></body></html>", nothing)).toMatchObject({ js: 0, css: 0 });
  });
});

describe("measurePageWeight: solo el JavaScript que es código (CA-N01.4)", () => {
  // Los datos estructurados de la spec 003 viajan en un <script>, pero no son «código de comportamiento»
  it.each(["application/ld+json", "importmap", "speculationrules", "text/template"])("no cuenta type=%s", (type) => {
    const html = `<script type="${type}">${JSON.stringify({ "@context": "https://schema.org" })}</script>`;
    expect(measurePageWeight(html, nothing).js).toBe(0);
  });

  it.each([
    "",
    ' type="module"',
    ' type="text/javascript"',
    ' type="text/javascript; charset=utf-8"',
    // La lista de «tipos MIME de JavaScript» de HTML: el navegador ejecuta todos estos
    ' type="application/javascript"',
    ' type="text/ecmascript"',
    ' type="application/ecmascript"',
    ' type="text/jscript"',
  ])("cuenta un script con%s", (attribute) => {
    const html = `<script${attribute}>${SCRIPT}</script>`;
    expect(measurePageWeight(html, nothing).js).toBe(gz(SCRIPT));
  });
});

describe("measurePageWeight: bordes del escáner", () => {
  it.each([
    ["un --> dentro de un script en línea", 'const cierre = "-->";'],
    ["un < dentro de un script en línea", "if (peso < 180) console.info('<style> de prueba');"],
  ])("no se confunde con %s", (_caso, script) => {
    const html = `<script>${script}</script><link rel="stylesheet" href="/_astro/index.css">`;

    expect(measurePageWeight(html, publishing({ "_astro/index.css": STYLES }))).toMatchObject({
      js: gz(script),
      css: gz(STYLES),
    });
  });

  it("ignora lo que va dentro de un comentario de HTML", () => {
    const html = `<!-- <script src="/_astro/island.js"></script> <style>${STYLES}</style> -->
      <link rel="stylesheet" href="/_astro/index.css">`;
    const files = { "_astro/index.css": STYLES, "_astro/island.js": SCRIPT };

    expect(measurePageWeight(html, publishing(files))).toMatchObject({ js: 0, css: gz(STYLES) });
  });

  it("un <style /> autocerrado no se traga el resto del documento", () => {
    const html = `<style />${STYLES}<link rel="stylesheet" href="/_astro/index.css">`;
    expect(measurePageWeight(html, publishing({ "_astro/index.css": STYLES })).css).toBe(gz(STYLES));
  });

  // Cierres y comentarios que el navegador termina donde el escáner podría no darse cuenta: si se pasa de largo, el
  // resto del documento deja de contarse y el presupuesto pasa en verde habiendo medido de menos
  it.each([
    ["</script/>", `<script>${SCRIPT}</script/>`],
    ["</script atributos>", `<script>${SCRIPT}</script data-x="y">`],
  ])("reconoce el cierre %s y sigue contando lo que viene detrás", (_caso, prefix) => {
    const html = `${prefix}<link rel="stylesheet" href="/_astro/index.css">`;

    expect(measurePageWeight(html, publishing({ "_astro/index.css": STYLES }))).toMatchObject({
      js: gz(SCRIPT),
      css: gz(STYLES),
    });
  });

  it.each([["<!-->"], ["<!--->"]])("cierra el comentario abreviado %s donde lo cierra el navegador", (comment) => {
    const html = `${comment}<link rel="stylesheet" href="/_astro/index.css">`;
    expect(measurePageWeight(html, publishing({ "_astro/index.css": STYLES })).css).toBe(gz(STYLES));
  });
});

describe("measurePageWeight: activos que no se pueden medir", () => {
  // Un activo que desaparece y hace bajar el total es el falso verde que esta puerta no debe permitir
  // El lector publica justamente la ruta que saldría si la guardia de origen desapareciera, así que la prueba
  // discrimina: sin la guardia, el activo se resolvería contra dist/ y se contaría en vez de salir por unresolved
  it.each([
    [
      "de otro origen",
      '<script src="https://cdn.example.invalid/x.js"></script>',
      "https://cdn.example.invalid/x.js",
      { "https://cdn.example.invalid/x.js": SCRIPT },
    ],
    [
      "con origen relativo al esquema",
      '<link rel="stylesheet" href="//cdn.example.invalid/x.css">',
      "//cdn.example.invalid/x.css",
      { "cdn.example.invalid/x.css": STYLES },
    ],
    ["ausente de dist", '<link rel="stylesheet" href="/_astro/borrado.css">', "/_astro/borrado.css", {}],
  ])("recoge como no resuelto un activo %s", (_caso, html, href, files) => {
    expect(measurePageWeight(html, publishing(files))).toMatchObject({ js: 0, css: 0, unresolved: [href] });
  });

  it("no lo suma al total ni lo lista como activo medido", () => {
    const weight = measurePageWeight('<link rel="stylesheet" href="/_astro/borrado.css">', nothing);
    expect(weight).toMatchObject({ css: 0, assets: [] });
  });
});

describe("budgetFailures: el límite es estricto", () => {
  it("fija los límites de CA-N01.4 con el kB del SI", () => {
    expect(BUDGETS).toEqual({ js: 180_000, css: 40_000 });
  });

  it("deja pasar un byte por debajo del límite", () => {
    expect(budgetFailures({ js: 180_001, css: 39_999 })).toEqual([]);
  });

  it.each([
    ["justo en el límite", 180_000, 40_000],
    ["por encima del límite", 180_001, 40_001],
  ])("falla %s", (_caso, js, css) => {
    expect(budgetFailures({ js, css })).toEqual([
      { kind: "js", bytes: js, limit: 180_000 },
      { kind: "css", bytes: css, limit: 40_000 },
    ]);
  });

  it("señala solo el tipo que se pasa", () => {
    expect(budgetFailures({ js: 180_000, css: 0 })).toEqual([{ kind: "js", bytes: 180_000, limit: 180_000 }]);
    expect(budgetFailures({ js: 0, css: 40_000 })).toEqual([{ kind: "css", bytes: 40_000, limit: 40_000 }]);
  });
});
