// @ts-check
// Comprobación de literales (regla 6, CA-7). Lógica pura, sin acceso a disco: la usan scripts/check-literals.mjs y
// tests/unit/find-literals.test.ts. Reglas y límites conocidos: docs/specs/001-fundacion-tecnica/plan.md

/**
 * @typedef {{ line: number, match: string, rule: string }} Literal
 * @typedef {{ start: number, end: number, match: string, rule: string }} Finding
 * @typedef {{ rule: string, scope: "file" | "css", pattern: RegExp, ignore?: (match: string) => boolean }} Rule
 */

// Palabras clave de color de CSS Color 4. Fuera quedan transparent y currentColor, que no son colores de una paleta
const NAMED_COLORS = `
  aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood
  cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray
  darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen
  darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue
  firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew
  hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan
  lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray
  lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue
  mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred
  midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid
  palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple
  rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue
  slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow
  yellowgreen
`
  .trim()
  .split(/\s+/);

// Unidades de longitud y de tiempo de CSS. Sin %: marcaría los pasos de @keyframes
const UNITS = "px|r?(?:em|ex|ch|ic|cap|lh)|[sld]?v(?:w|h|i|b|min|max)|cq(?:w|h|i|b|min|max)|cm|mm|q|in|pt|pc|m?s";

// Los cuantificadores van acotados: sin tope, una línea larga sin espacios (un base64, por ejemplo) tarda un tiempo
// cuadrático y colgaría pnpm check
/** @type {Rule[]} */
const RULES = [
  // Clase de Tailwind con valor o modificador entre corchetes, con sus variantes: bg-[#fff], hover:p-[13px],
  // text-sm/[18px]. También cuentan las variantes con corchetes (data-[state=open]:, max-[600px]:): una variante o una
  // utilidad propias se declaran con @custom-variant o @utility en globals.css
  {
    rule: "arbitrary-value",
    scope: "file",
    pattern:
      /(?<![\w!/.@-])(?:[\w!@-][\w:!/.@-]{0,200})?\w(?:-\[[^\]\s]{1,200}\]|\/\[[\d.][^\]\s]{0,200}\])[\w:!/.%-]{0,200}/g,
  },
  // Variantes con corchetes sin guion delante: @[500px]:flex, [@media(min-width:600px)]:hidden
  {
    rule: "arbitrary-value",
    scope: "file",
    pattern:
      /(?<![\w\]-])(?:@\[[\d.][^\]\s]{0,200}\]|\[@(?:media|supports|container)\b[^\]\s]{0,200}\])[\w:!/.%-]{0,200}/gi,
  },
  // Propiedad arbitraria: [margin:12px], [--gap:1rem]. No lleva espacios dentro, y eso la distingue de una firma de
  // TypeScript como [key: string]
  { rule: "arbitrary-value", scope: "file", pattern: /(?<![\w\]-])\[-{0,2}[a-z][\w-]{0,50}:[^\]\s]{1,200}\]/gi },
  // #rgb, #rgba, #rrggbb y #rrggbbaa en cualquier parte: una prop o un fill de SVG también son literales. No cuentan las
  // anclas (href="#cafe", { href: "#cafe" }, url(#fade)), las entidades HTML (&#123;), los fragmentos de una URL
  // (…/#add) ni los campos privados (this.#add)
  {
    rule: "hex-color",
    scope: "file",
    pattern:
      /(?<![\w&/#.])(?<!\bhref\s*[=:]\s*\{?\s*["'`])(?<!\burl\(\s*["']?)#(?:[\da-f]{8}|[\da-f]{6}|[\da-f]{3,4})(?![\w-])/gi,
  },
  { rule: "color-function", scope: "file", pattern: /\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\([^)\n]{0,200}\)?/gi },
  // Utilidades con número que eluden los tokens de duración y de capa: duration-300, delay-150, z-50, -z-10
  { rule: "numeric-utility", scope: "file", pattern: /(?<![\w-])!?-?(?:duration|delay|z)-\d+(?![\w.[-])/g },
  {
    rule: "inline-length",
    scope: "css",
    pattern: new RegExp(`(?<![\\w.#-])-?(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:${UNITS})(?![\\w-])`, "gi"),
    // Un cero no es un literal, y en CSS una duración nula tiene que llevar unidad (transition-delay: 0s)
    ignore: (match) => Number.parseFloat(match) === 0,
  },
  {
    rule: "named-color",
    scope: "css",
    pattern: new RegExp(`(?<![\\w.#-])(?:${NAMED_COLORS.join("|")})(?![\\w-])`, "gi"),
  },
];

// Tramos que son CSS: el atributo style (también el.style.width = …), define:vars de <style> y los atributos de
// presentación de SVG de color y de tamaño, entre comillas o como expresión {…}. Una asignación de TypeScript con esos
// nombres (const color = "white") casa igual, y también es un literal
const CSS_ATTRIBUTE =
  /(?<![\w-])(?:style(?:\.[\w-]+)?|define:vars|fill|stroke|color|stop-color|flood-color|lighting-color|font-size|letter-spacing|word-spacing|stroke-width|rx|ry)\s*=\s*(?=["'`{])/gi;
// <style> con contenido; no <style-guide> ni un <style … /> autocerrado
const STYLE_ELEMENT = /(<style(?![\w-])[^>]*(?<!\/)>)([\s\S]*?)<\/style\s*>/gi;
// Los comentarios de CSS no son CSS: en español, «tan» o «red» son palabras corrientes
const CSS_COMMENT = /\/\*[\s\S]*?\*\//g;

/**
 * Valores literales de estilo en el contenido de un componente, una página o un layout
 * @param {string} content
 * @returns {Literal[]}
 */
export function findLiterals(content) {
  const css = cssRanges(content);
  // Mismas posiciones que content, con los comentarios de CSS en blanco
  const withoutComments = content.replace(CSS_COMMENT, (comment) => comment.replace(/[^\n]/g, " "));
  /** @type {Finding[]} */
  const found = [];
  for (const { rule, scope, pattern, ignore } of RULES) {
    for (const { index: start, 0: match } of (scope === "css" ? withoutComments : content).matchAll(pattern)) {
      if (scope === "css" && !css.some(([from, to]) => from <= start && start < to)) continue;
      if (ignore?.(match)) continue;
      found.push({ start, end: start + match.length, match, rule });
    }
  }
  return withoutNested(found)
    .sort((a, b) => a.start - b.start)
    .map(({ start, match, rule }) => ({ line: lineAt(content, start), match, rule }));
}

/**
 * Tramos del contenido que son CSS, como pares [inicio, fin)
 * @param {string} content
 * @returns {[number, number][]}
 */
function cssRanges(content) {
  /** @type {[number, number][]} */
  const ranges = [];
  for (const { index, 0: attribute } of content.matchAll(CSS_ATTRIBUTE)) {
    const open = index + attribute.length;
    ranges.push([open + 1, valueEnd(content, open)]);
  }
  for (const { index, 1: openingTag, 2: css } of content.matchAll(STYLE_ELEMENT)) {
    const start = index + openingTag.length;
    ranges.push([start, start + css.length]);
  }
  return ranges;
}

/**
 * Posición donde se cierra el valor que abre content[open]: la comilla pareja, o la llave que equilibra la primera sin
 * contar las que van dentro de una cadena
 * @param {string} content
 * @param {number} open
 */
function valueEnd(content, open) {
  if (content[open] !== "{") {
    const close = content.indexOf(content[open], open + 1);
    return close === -1 ? content.length : close;
  }
  let depth = 0;
  for (let i = open; i < content.length; i++) {
    const char = content[i];
    if (char === '"' || char === "'" || char === "`") i = stringEnd(content, i);
    else if (char === "{") depth++;
    else if (char === "}" && --depth === 0) return i;
  }
  return content.length;
}

/**
 * Posición de la comilla que cierra la cadena de TypeScript que abre content[open], saltando las escapadas con \
 * @param {string} content
 * @param {number} open
 */
function stringEnd(content, open) {
  for (let i = open + 1; i < content.length; i++) {
    if (content[i] === "\\") i++;
    else if (content[i] === content[open]) return i;
  }
  return content.length;
}

/**
 * Quita los hallazgos contenidos en otro, como #fff dentro de bg-[#fff]. De dos tramos iguales queda el primero
 * @param {Finding[]} found
 */
function withoutNested(found) {
  return found.filter(
    (inner, i) =>
      !found.some(
        (outer, j) =>
          j !== i &&
          outer.start <= inner.start &&
          inner.end <= outer.end &&
          (outer.end - outer.start > inner.end - inner.start || j < i),
      ),
  );
}

/**
 * @param {string} content
 * @param {number} index
 */
function lineAt(content, index) {
  return content.slice(0, index).split("\n").length;
}
