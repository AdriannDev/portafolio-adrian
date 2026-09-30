import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

// Los tokens viven en dos sitios: el contrato en prosa (§12.1 del sistema de diseño) y la hoja que compila Tailwind.
// Esta prueba impide que diverjan (CA-5) y recalcula la matriz de contraste de §2.2 (CA-8, constitución regla 24).

const read = async (path: string) => (await readFile(new URL(path, import.meta.url), "utf8")).replaceAll("\r\n", "\n");

const designSystem = await read("../../docs/03-diseno/sistema-diseno.md");
const globals = await read("../../src/styles/globals.css");

// --- Lectura del CSS -------------------------------------------------------------------------------------------

type Declaration = { block: string; name: string; value: string };

// Las cadenas se casan antes que los comentarios y se conservan: si no, un `content: "/*"` abriría un comentario falso
// que se tragaría las mismas declaraciones en los dos archivos, y la sincronía seguiría en verde sin compararlas
const withoutComments = (css: string) =>
  css.replaceAll(
    /("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|\/\*[\s\S]*?\*\//g,
    (_match, string?: string) => string ?? "",
  );
const collapse = (text: string) => text.trim().replaceAll(/\s+/g, " ");

/**
 * Recorre una hoja y devuelve sus propiedades personalizadas con el bloque que las contiene. El bloque forma parte
 * de la identidad porque --duration-section se declara dos veces con valores distintos: en :root y en la consulta
 * de movimiento reducido.
 */
function parseDeclarations(css: string): Declaration[] {
  const declarations: Declaration[] = [];
  const blocks: string[] = [];
  let buffer = "";
  let quote: string | null = null;

  const flush = () => {
    // Las propiedades personalizadas admiten un * final: así se escriben los reinicios de Tailwind (--color-*)
    const property = /^\s*(--[\w-]*\*?)\s*:\s*([\s\S]+?)\s*$/.exec(buffer);
    if (property) declarations.push({ block: blocks.join(" > "), name: property[1]!, value: collapse(property[2]!) });
    buffer = "";
  };

  for (const character of withoutComments(css)) {
    if (quote !== null) {
      // Dentro de una cadena no hay separadores: un data URI trae ; y el valor no debe cortarse ahí
      buffer += character;
      if (character === quote) quote = null;
    } else if (character === '"' || character === "'") {
      quote = character;
      buffer += character;
    } else if (character === "{") {
      blocks.push(collapse(buffer));
      buffer = "";
    } else if (character === "}") {
      flush(); // la última declaración de un bloque puede no llevar ; y sigue siendo CSS válido
      blocks.pop();
    } else if (character === ";") {
      flush();
    } else {
      buffer += character;
    }
  }

  return declarations;
}

/** Las instrucciones que no son declaraciones (hoy solo el @import de Tailwind): también son parte del contrato. */
const parseStatements = (css: string) =>
  [...withoutComments(css).matchAll(/@[\w-]+[^;{}]*;/g)].map((m) => collapse(m[0]));

const key = ({ block, name }: Declaration) => `${block} > ${name}`;
const describeDeclaration = (declaration: Declaration) => `${key(declaration)}: ${declaration.value}`;

/** El primer bloque de CSS que sigue a un encabezado del documento de diseño. */
function extractCssBlock(markdown: string, heading: string): string {
  const start = markdown.indexOf(heading);
  if (start === -1) throw new Error(`El sistema de diseño ya no tiene el encabezado "${heading}"`);
  const block = /```css\n([\s\S]*?)```/.exec(markdown.slice(start));
  if (!block) throw new Error(`No hay ningún bloque de CSS bajo "${heading}"`);
  return block[1]!;
}

const tokenBlock = extractCssBlock(designSystem, "### 12.1 Bloque de tokens");
const documentedTokens = parseDeclarations(tokenBlock);
const implementedTokens = parseDeclarations(globals);

// --- Sincronía entre el documento y el código (CA-5) -----------------------------------------------------------

// Un bloque por cada forma de anidamiento de la hoja. Anclan el parseo: sin ellas, toda la sincronía compararía dos
// parseos del mismo lector, y una regresión que perdiera las mismas declaraciones en los dos archivos sería invisible
const ANCHORS = [
  "@theme > --color-accent",
  "@theme inline > --font-display",
  ":root > --duration-section",
  "@media (prefers-reduced-motion: reduce) > :root > --duration-section",
];

describe("lector de CSS de esta prueba", () => {
  it("un /* dentro de una cadena no abre un comentario", () => {
    const css = ':root { --a: "/*"; --b: 1px; } /* fin */';
    expect(parseDeclarations(css).map(({ name }) => name)).toEqual(["--a", "--b"]);
  });
});

describe("§12.1 del sistema de diseño y globals.css (CA-5)", () => {
  const documentedByKey = new Map(documentedTokens.map((declaration) => [key(declaration), declaration]));
  const implementedByKey = new Map(implementedTokens.map((declaration) => [key(declaration), declaration]));

  it.each(ANCHORS)("el lector conserva %s en los dos archivos", (anchor) => {
    expect({ "§12.1": documentedByKey.has(anchor), "globals.css": implementedByKey.has(anchor) }).toEqual({
      "§12.1": true,
      "globals.css": true,
    });
  });

  it("globals.css declara todas las variables de §12.1", () => {
    const missing = documentedTokens.filter((declaration) => !implementedByKey.has(key(declaration))).map(key);
    expect(missing).toEqual([]);
  });

  it("globals.css no declara ninguna variable que §12.1 no tenga", () => {
    const extra = implementedTokens.filter((declaration) => !documentedByKey.has(key(declaration))).map(key);
    expect(extra).toEqual([]);
  });

  it("cada variable tiene el mismo valor en los dos archivos", () => {
    const divergent = documentedTokens
      .map((documented) => ({ documented, implemented: implementedByKey.get(key(documented)) }))
      .filter(({ documented, implemented }) => implemented !== undefined && implemented.value !== documented.value)
      .map(
        ({ documented, implemented }) =>
          `${key(documented)}: §12.1 dice ${documented.value}, globals.css dice ${implemented!.value}`,
      );
    expect(divergent).toEqual([]);
  });

  it("las instrucciones que no son declaraciones coinciden", () => {
    // El source("..") del @import es lo que impide que las clases de ejemplo de docs/ y design/ lleguen al CSS
    expect(parseStatements(globals)).toEqual(parseStatements(tokenBlock));
  });
});

// --- Reinicios de las paletas por defecto de Tailwind (CA-5) ---------------------------------------------------

const RESETS = [
  "--color-*",
  "--font-*",
  "--text-*",
  "--text-shadow-*",
  "--radius-*",
  "--shadow-*",
  "--inset-shadow-*",
  "--drop-shadow-*",
  "--ease-*",
  "--animate-*",
];

describe("reinicios de las paletas por defecto (CA-5)", () => {
  const resets = implementedTokens.filter((declaration) => declaration.name.endsWith("*"));

  it.each(RESETS)("globals.css reinicia %s en @theme", (name) => {
    expect(resets.map(describeDeclaration)).toContain(`@theme > ${name}: initial`);
  });

  it("no hay más reinicios que esos diez", () => {
    // --leading-* y --tracking-* no se reinician a propósito (decidido en T7): CA-5 no nombra esas categorías.
    // Siguen disponibles leading-loose, tracking-tighter, -normal, -wide, -wider y -widest, que no son tokens
    expect(resets.map((declaration) => declaration.name).sort()).toEqual([...RESETS].sort());
  });
});

// --- Matriz de contraste (CA-8, regla 24) ----------------------------------------------------------------------

const BACKGROUNDS = ["bg", "bg-elevated", "surface", "surface-hover"];
const TEXT_TOKENS = ["fg", "fg-muted", "fg-subtle", "accent", "success", "warning", "danger"];
const TEXT_MINIMUM = 4.5;
const INTERFACE_MINIMUM = 3;
/** §2.2 documenta el acento dos veces: como texto en la tabla y como anillo de foco en prosa, con mínimos distintos. */
const FOCUS_RING = "accent (anillo de foco)";

const colors = new Map(
  implementedTokens
    .filter(({ name, value }) => name.startsWith("--color-") && /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value))
    .map(({ name, value }) => [name.slice("--color-".length), value]),
);

/** Luminancia relativa en sRGB, fórmula de WCAG 2.x. */
function relativeLuminance(hex: string): number {
  const digits = hex.slice(1);
  const pairs = digits.length === 3 ? [...digits].map((digit) => digit + digit) : digits.match(/../g)!;
  const [red, green, blue] = pairs.map((pair) => {
    const channel = Number.parseInt(pair, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a) as [
    number,
    number,
  ];
  return (lighter + 0.05) / (darker + 0.05);
}

const round = (ratio: number) => Math.round(ratio * 100) / 100;
/** Dos decimales y coma, como los escribe §2.2. */
const spanish = (ratio: number) => round(ratio).toFixed(2).replace(".", ",");
/**
 * WCAG no redondea: 4,496 a 1 no llega a 4,5. El redondeo a dos decimales solo sirve para cotejar el ratio con el que
 * escribe §2.2; el mínimo se compara con el valor exacto.
 */
const meetsMinimum = (ratio: number, minimum: number) => ratio >= minimum;
/** Truncado, no redondeado: un ratio que no llega al mínimo nunca se muestra como si llegara («4,49», no «4,50»). */
const spanishTruncated = (ratio: number) => (Math.floor(ratio * 100) / 100).toFixed(2).replace(".", ",");
/** El mínimo se lee mejor sin decimales de relleno: «mínimo 3», «mínimo 4,5». */
const spanishMinimum = (minimum: number) => String(minimum).replace(".", ",");

// Ratios publicados en §2.2. La regla 24 pide el ratio documentado de cada par, así que se comparan uno a uno.

function section(markdown: string, heading: string): string {
  const start = markdown.indexOf(heading);
  if (start === -1) throw new Error(`El sistema de diseño ya no tiene el encabezado "${heading}"`);
  const rest = markdown.slice(start + heading.length);
  const end = rest.indexOf("\n### ");
  return end === -1 ? rest : rest.slice(0, end);
}

const contrastSection = section(designSystem, "### 2.2 Matriz de contraste");
const unwrap = (cell: string) => cell.replaceAll("`", "").trim();
const toNumber = (ratio: string) => Number(ratio.replace(",", "."));
const pairKey = (foreground: string, background: string) => `${foreground} sobre ${background}`;

/** La tabla de texto de §2.2: una fila por token de texto, una columna por fondo. */
function parseTable(): Map<string, number> {
  const rows = contrastSection
    .split("\n")
    .filter((line) => line.startsWith("|"))
    .map((line) => line.split("|").slice(1, -1).map(unwrap));
  const header = rows.find((cells) => cells[0] === "Token");
  if (!header) throw new Error("§2.2 ya no tiene la tabla de contraste de texto");

  const ratios = new Map<string, number>();
  for (const cells of rows) {
    const token = cells[0];
    if (!token || token === "Token" || /^-+$/.test(token)) continue;
    cells.slice(1).forEach((ratio, index) => {
      const background = header[index + 1];
      if (background && /^\d+,\d+$/.test(ratio)) ratios.set(pairKey(token, background), toNumber(ratio));
    });
  }
  return ratios;
}

/** Los pares que §2.2 documenta en prosa, no en la tabla. */
function parseProse(): Map<string, number> {
  const ratios = new Map<string, number>();
  // Sin saltar de línea: si a una frase le faltara un ratio, no debe arrastrar el primero de la siguiente
  const fourRatios = String.raw`(\d+,\d+)[^\d\n]+?(\d+,\d+)[^\d\n]+?(\d+,\d+)[^\d\n]+?(\d+,\d+)`;

  const readRow = (token: string, prefix: string) => {
    const found = new RegExp(prefix + fourRatios).exec(contrastSection);
    if (!found) return;
    BACKGROUNDS.forEach((background, index) => ratios.set(pairKey(token, background), toNumber(found[index + 1]!)));
  };

  readRow("line-control", String.raw`\x60line-control\x60\s*`);
  readRow(FOCUS_RING, String.raw`\x60accent\x60 como anillo de foco:\s*`);

  const overAccent = /`accent-fg` sobre `accent` (\d+,\d+); sobre `accent-hover` (\d+,\d+)/.exec(contrastSection);
  if (overAccent) {
    ratios.set(pairKey("accent-fg", "accent"), toNumber(overAccent[1]!));
    ratios.set(pairKey("accent-fg", "accent-hover"), toNumber(overAccent[2]!));
  }
  return ratios;
}

const tableRatios = parseTable();
const proseRatios = parseProse();
const documentedRatios = new Map([...tableRatios, ...proseRatios]);

/** El color que se mide es `source`; `foreground` solo distingue el par cuando §2.2 documenta el mismo color dos veces. */
const pairs = [
  ...TEXT_TOKENS.flatMap((foreground) =>
    BACKGROUNDS.map((background) => ({ foreground, source: foreground, background, minimum: TEXT_MINIMUM })),
  ),
  // line-control identifica un control y accent es el anillo de foco: son interfaz, no texto, y su mínimo es 3
  ...BACKGROUNDS.map((background) => ({
    foreground: "line-control",
    source: "line-control",
    background,
    minimum: INTERFACE_MINIMUM,
  })),
  ...BACKGROUNDS.map((background) => ({
    foreground: FOCUS_RING,
    source: "accent",
    background,
    minimum: INTERFACE_MINIMUM,
  })),
  { foreground: "accent-fg", source: "accent-fg", background: "accent", minimum: TEXT_MINIMUM },
  { foreground: "accent-fg", source: "accent-fg", background: "accent-hover", minimum: TEXT_MINIMUM },
];

describe("matriz de contraste de §2.2 recalculada desde globals.css (CA-8)", () => {
  it("compara el mínimo con el ratio exacto, sin redondear (WCAG)", () => {
    // Redondeados a dos decimales, 4,496 y 2,996 darían 4,50 y 3,00 y pasarían
    expect(meetsMinimum(4.496, TEXT_MINIMUM)).toBe(false);
    expect(meetsMinimum(2.996, INTERFACE_MINIMUM)).toBe(false);
    expect(meetsMinimum(TEXT_MINIMUM, TEXT_MINIMUM)).toBe(true);
  });

  it("la tabla y la prosa de §2.2 documentan pares distintos", () => {
    // Si compartieran clave, la prosa pisaría a la tabla al fusionarlas y esa fila dejaría de comprobarse
    expect([...proseRatios.keys()].filter((pair) => tableRatios.has(pair))).toEqual([]);
  });

  it.each(pairs)("$foreground sobre $background", ({ foreground, source, background, minimum }) => {
    const text = colors.get(source);
    const surface = colors.get(background);
    expect(text, `globals.css no declara --color-${source} con un valor hexadecimal`).toBeDefined();
    expect(surface, `globals.css no declara --color-${background} con un valor hexadecimal`).toBeDefined();

    const ratio = contrastRatio(text!, surface!);
    const pair = pairKey(foreground, background);
    expect(
      meetsMinimum(ratio, minimum),
      `${pair}: ${spanishTruncated(ratio)} (mínimo ${spanishMinimum(minimum)})`,
    ).toBe(true);

    const documented = documentedRatios.get(pair);
    expect(documented, `§2.2 no documenta el ratio de ${pair}`).toBeDefined();
    expect(round(ratio), `${pair}: calculado ${spanish(ratio)}, documentado en §2.2 ${spanish(documented!)}`).toBe(
      documented,
    );
  });

  it("§2.2 no documenta ratios de pares que la prueba no comprueba", () => {
    const checked = new Set(pairs.map(({ foreground, background }) => pairKey(foreground, background)));
    expect([...documentedRatios.keys()].filter((pair) => !checked.has(pair))).toEqual([]);
  });
});
