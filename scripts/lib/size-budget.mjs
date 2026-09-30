// @ts-check
// Presupuesto de tamaños de la portada (CA-11, CA-N01.4). Lógica pura, sin acceso a disco: la usan
// scripts/check-size-budget.mjs y tests/unit/size-budget.test.ts. Diseño y límites conocidos:
// docs/specs/001-fundacion-tecnica/plan.md

import { gzipSync } from "node:zlib";

/**
 * @typedef {"js" | "css"} Kind
 * @typedef {{ kind: Kind, source: string, bytes: number }} Asset
 * @typedef {{ js: number, css: number, assets: Asset[], unresolved: string[] }} PageWeight
 * @typedef {{ kind: Kind, bytes: number, limit: number }} Failure
 * @typedef {(path: string) => string | Uint8Array | null | undefined} ReadAsset
 */

/**
 * Límites de CA-N01.4 en bytes comprimidos con gzip. «kB» es el prefijo del SI: 1000 bytes. El requisito dice «por
 * debajo de», así que el límite exacto ya incumple; es la misma lectura que el 0,099 del desplazamiento visual
 * @type {Readonly<Record<Kind, number>>}
 */
export const BUDGETS = { js: 180_000, css: 40_000 };

// Tipos que el navegador ejecuta como código: el vacío, module y la lista de «tipos MIME de JavaScript» de HTML. Los
// demás —application/ld+json (spec 003), importmap, speculationrules— son datos, y CA-N01.4 limita el «código de
// comportamiento», no todo lo que viaja dentro de un <script>
const JS_TYPES = new Set(
  `
    application/ecmascript application/javascript application/x-ecmascript application/x-javascript text/ecmascript
    text/javascript text/javascript1.0 text/javascript1.1 text/javascript1.2 text/javascript1.3 text/javascript1.4
    text/javascript1.5 text/jscript text/livescript text/x-ecmascript text/x-javascript module
  `
    .trim()
    .split(/\s+/)
    .concat(""),
);

// Los cuantificadores van acotados: sin tope, una lista de atributos con una comilla sin cerrar hace retroceder al
// motor en tiempo exponencial (mismo motivo que en find-literals.mjs)
const TAG = /<([a-z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*'){0,4000})>/iy;
// Apertura de una etiqueta que se mide, para detectar las que TAG no reconoce
const MEASURED_TAG_START = /<(script|style|link)(?![\w-])/iy;
const ATTRIBUTE = /([a-z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;
// El navegador también cierra con </script/> y con </script atributos>: si el cierre no se reconoce, el cuerpo se
// traga el resto del documento y el CSS que venga detrás deja de contarse
const CLOSING_TAG = { script: /<\/script(?:[\s/][^>]*)?>/gi, style: /<\/style(?:[\s/][^>]*)?>/gi };

/**
 * Suma el peso con gzip del JavaScript y de los estilos que pide un documento. Cuentan como JS los <script src>, los
 * <link rel="modulepreload"> y los <script> en línea; como CSS, los <link rel="stylesheet"> y los <style> en línea.
 *
 * Cada activo se comprime por separado y se suman los tamaños: es lo que viaja por el cable en los externos y una
 * sobreestimación —nunca una subestimación— en los que van dentro del HTML.
 * @param {string} html
 * @param {ReadAsset} readAsset contenido del activo publicado en esa ruta, o null si no existe
 * @returns {PageWeight}
 */
export function measurePageWeight(html, readAsset) {
  /** @type {Asset[]} */
  const assets = [];
  /** @type {Set<string>} */
  const unresolved = new Set();
  /** Un mismo archivo citado por <script src> y por <link rel="modulepreload"> se cuenta una vez @type {Set<string>} */
  const counted = new Set();
  const inline = { js: 0, css: 0 };

  /**
   * @param {Kind} kind
   * @param {string} href
   */
  const addExternal = (kind, href) => {
    const raw = href.trim();
    if (raw === "") return;
    const path = assetPath(raw);
    // Otro origen, un esquema que no es una ruta o un archivo que no está publicado. No se ignora en silencio: un
    // activo que desaparece y hace bajar el total es justo el falso verde que esta puerta no debe permitir
    if (path === null) {
      unresolved.add(raw);
      return;
    }
    const key = `${kind}\u0000${path}`;
    if (counted.has(key)) return;
    counted.add(key);
    const content = readAsset(path);
    if (content === null || content === undefined) {
      unresolved.add(raw);
      return;
    }
    assets.push({ kind, source: path, bytes: gzipSync(content).length });
  };

  /**
   * @param {Kind} kind
   * @param {string} content
   */
  const addInline = (kind, content) => {
    if (content.trim() === "") return;
    const element = kind === "js" ? "script" : "style";
    assets.push({ kind, source: `<${element}> en línea #${++inline[kind]}`, bytes: gzipSync(content).length });
  };

  let index = 0;
  while (index < html.length) {
    const open = html.indexOf("<", index);
    if (open === -1) break;

    if (html.startsWith("<!--", open)) {
      // Desde open + 2, no desde open + 4: así también se cierran los comentarios abreviados <!--> y <!--->, que el
      // navegador termina ahí mismo. Buscando más allá, el escáner se saltaba el resto del documento
      const close = html.indexOf("-->", open + 2);
      index = close === -1 ? html.length : close + 3;
      continue;
    }

    TAG.lastIndex = open;
    const tag = TAG.exec(html);
    if (tag === null) {
      // Una etiqueta de las que se miden que TAG no reconoce (comilla sin cerrar, más atributos de los que admite el
      // tope) no se salta en silencio: su activo dejaría de contarse y el total bajaría sin avisar
      MEASURED_TAG_START.lastIndex = open;
      const unparsed = MEASURED_TAG_START.exec(html);
      if (unparsed !== null) unresolved.add(`<${unparsed[1].toLowerCase()}> sin analizar en la posición ${open}`);
      index = open + 1;
      continue;
    }
    const name = tag[1].toLowerCase();
    const attributeText = tag[2];
    const afterTag = TAG.lastIndex;
    index = afterTag;

    if (name !== "script" && name !== "style" && name !== "link") continue;
    const attributes = parseAttributes(attributeText);

    if (name === "link") {
      const rel = new Set((attributes.get("rel") ?? "").toLowerCase().split(/\s+/));
      if (rel.has("stylesheet")) addExternal("css", attributes.get("href") ?? "");
      else if (rel.has("modulepreload")) addExternal("js", attributes.get("href") ?? "");
      continue;
    }

    // El cuerpo se consume entero, así que un --> o un < dentro de una cadena no confunden al escáner. Un cierre
    // explícito /> se toma como elemento vacío: el analizador del navegador no lo honraría, pero Astro no lo emite y
    // así un <style /> no se traga el resto del documento (falso positivo que ya mordió en T6)
    let body = "";
    if (!/\/\s*$/.test(attributeText)) {
      const closing = CLOSING_TAG[name];
      closing.lastIndex = afterTag;
      const found = closing.exec(html);
      body = html.slice(afterTag, found === null ? html.length : found.index);
      index = found === null ? html.length : closing.lastIndex;
    }

    if (name === "style") {
      addInline("css", body);
      continue;
    }

    const type = (attributes.get("type") ?? "").split(";")[0].trim().toLowerCase();
    if (!JS_TYPES.has(type)) continue;
    const src = attributes.get("src");
    if (src === undefined) addInline("js", body);
    else addExternal("js", src);
  }

  const total = (/** @type {Kind} */ kind) =>
    assets.reduce((sum, asset) => (asset.kind === kind ? sum + asset.bytes : sum), 0);
  return { js: total("js"), css: total("css"), assets, unresolved: [...unresolved] };
}

/**
 * Los tipos que superan su límite. El límite exacto cuenta como incumplimiento: CA-N01.4 pide quedar «por debajo de»
 * @param {{ js: number, css: number }} weight
 * @returns {Failure[]}
 */
export function budgetFailures({ js, css }) {
  return [
    { kind: /** @type {Kind} */ ("js"), bytes: js, limit: BUDGETS.js },
    { kind: /** @type {Kind} */ ("css"), bytes: css, limit: BUDGETS.css },
  ].filter(({ bytes, limit }) => bytes >= limit);
}

/**
 * Ruta del activo dentro de la carpeta publicada, o null si no se puede resolver ahí (otro origen, data:, blob:)
 * @param {string} href
 * @returns {string | null}
 */
function assetPath(href) {
  if (href.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(href)) return null;
  const withoutQuery = href.split("#")[0].split("?")[0];
  let decoded = withoutQuery;
  try {
    decoded = decodeURIComponent(withoutQuery);
  } catch {
    // Una secuencia %XX inválida se queda tal cual: que falle al leerla y salga como no resuelta
  }
  const path = decoded.replace(/^\/+/, "").replace(/^(?:\.\/)+/, "");
  return path === "" ? null : path;
}

/**
 * Atributos con valor de una etiqueta, con el nombre en minúsculas. De un nombre repetido vale el primero, como en el
 * analizador del navegador
 * @param {string} text
 * @returns {Map<string, string>}
 */
function parseAttributes(text) {
  /** @type {Map<string, string>} */
  const attributes = new Map();
  for (const match of text.matchAll(ATTRIBUTE)) {
    const name = match[1].toLowerCase();
    if (!attributes.has(name)) attributes.set(name, match[2] ?? match[3] ?? match[4] ?? "");
  }
  return attributes;
}
