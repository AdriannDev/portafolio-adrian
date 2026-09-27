import { describe, expect, it } from "vitest";
import { findLiterals } from "../../scripts/lib/find-literals.mjs";

describe("findLiterals: literales prohibidos", () => {
  it.each([
    { rule: "arbitrary-value", content: '<div class="bg-[#fff]"></div>', match: "bg-[#fff]" },
    { rule: "arbitrary-value", content: '<p class="flex hover:p-[13px]"></p>', match: "hover:p-[13px]" },
    { rule: "arbitrary-value", content: '<p class="bg-[rgb(0,0,0)]/50"></p>', match: "bg-[rgb(0,0,0)]/50" },
    { rule: "arbitrary-value", content: '<p class="text-sm/[18px]"></p>', match: "text-sm/[18px]" },
    { rule: "arbitrary-value", content: '<p class="bg-accent/[0.35]"></p>', match: "bg-accent/[0.35]" },
    { rule: "arbitrary-value", content: '<p class="max-[600px]:hidden"></p>', match: "max-[600px]:hidden" },
    { rule: "arbitrary-value", content: '<ul class="[&>*]:p-[13px]"></ul>', match: "p-[13px]" },
    { rule: "arbitrary-value", content: '<div class="@[500px]:flex"></div>', match: "@[500px]:flex" },
    {
      rule: "arbitrary-value",
      content: '<p class="[@media(min-width:600px)]:hidden"></p>',
      match: "[@media(min-width:600px)]:hidden",
    },
    { rule: "arbitrary-value", content: '<p class="[margin:12px]"></p>', match: "[margin:12px]" },
    {
      rule: "arbitrary-value",
      content: '<li class:list={["card", { "text-[18px]": big }]}></li>',
      match: "text-[18px]",
    },
    { rule: "arbitrary-value", content: 'const width = "w-[calc(100%-2rem)]";', match: "w-[calc(100%-2rem)]" },
    { rule: "hex-color", content: '<p style="color:#fff"></p>', match: "#fff" },
    { rule: "hex-color", content: '<path fill="#25D366" />', match: "#25D366" },
    { rule: "hex-color", content: '<Dot color="#ffff" />', match: "#ffff" },
    { rule: "hex-color", content: 'const accent = "#ff5a1fcc";', match: "#ff5a1fcc" },
    { rule: "color-function", content: '<p style="color: rgb(0 0 0)"></p>', match: "rgb(0 0 0)" },
    { rule: "color-function", content: "<style>p { color: oklch(70% 0.1 30); }</style>", match: "oklch(70% 0.1 30)" },
    { rule: "color-function", content: "const glow = 'hsla(20, 100%, 50%, 0.4)';", match: "hsla(20, 100%, 50%, 0.4)" },
    { rule: "numeric-utility", content: '<div class="transition duration-300"></div>', match: "duration-300" },
    { rule: "numeric-utility", content: '<div class="delay-150"></div>', match: "delay-150" },
    { rule: "numeric-utility", content: '<header class="md:z-50"></header>', match: "z-50" },
    { rule: "numeric-utility", content: '<div class="-z-10"></div>', match: "-z-10" },
    { rule: "inline-length", content: '<p style="margin: 12px"></p>', match: "12px" },
    { rule: "inline-length", content: "<p style='letter-spacing: -0.02em'></p>", match: "-0.02em" },
    { rule: "inline-length", content: '<p style="max-width: 60rch"></p>', match: "60rch" },
    { rule: "inline-length", content: '<p style={{ transitionDuration: ".3s" }}></p>', match: ".3s" },
    { rule: "inline-length", content: "<p style={`animation-delay: 200ms`}></p>", match: "200ms" },
    { rule: "inline-length", content: "<style>.hero { min-height: 100svh; }</style>", match: "100svh" },
    { rule: "inline-length", content: '<style define:vars={{ gap: "12px" }}></style>', match: "12px" },
    { rule: "inline-length", content: 'card.style.width = "12px";', match: "12px" },
    { rule: "inline-length", content: '<text font-size="11px">M-001</text>', match: "11px" },
    { rule: "inline-length", content: '<rect rx="4px" />', match: "4px" },
    { rule: "named-color", content: '<p style="color: white"></p>', match: "white" },
    { rule: "named-color", content: '<circle fill="Red" />', match: "Red" },
    { rule: "named-color", content: '<path stroke="black" />', match: "black" },
    { rule: "named-color", content: '<Dot color="white" />', match: "white" },
    { rule: "named-color", content: '<stop stop-color="white" />', match: "white" },
    { rule: "named-color", content: '<feFlood flood-color="black" />', match: "black" },
    { rule: "named-color", content: '<feDiffuseLighting lighting-color="white" />', match: "white" },
    { rule: "named-color", content: "<style>.dot { background: rebeccapurple; }</style>", match: "rebeccapurple" },
  ])("$rule: $content", ({ rule, content, match }) => {
    expect(findLiterals(content)).toEqual([{ line: 1, rule, match }]);
  });
});

describe("findLiterals: lo que no es un literal", () => {
  it.each([
    ["utilidades de tokens", '<p class="bg-surface p-4 text-fg-muted font-display text-6xl rounded-md"></p>'],
    ["sintaxis de variable", '<div class="duration-(--duration-ui) delay-(--duration-micro) z-(--z-header)"></div>'],
    ["espaciado y foco de 2 px (§2.3)", '<a class="gap-8 px-2 outline-2 outline-offset-2 underline-offset-4"></a>'],
    ["modificadores sin corchetes", '<p class="text-sm/7 bg-accent/50 w-1/2 aspect-16/9"></p>'],
    ["ruta dinámica de Astro", 'const pattern = "/misiones/[slug]";'],
    ["anclas con aspecto hexadecimal", '<a href="#contacto"></a><a href="#cafe"></a><a href={"#face"}></a>'],
    ["ancla en datos de navegación", 'const nav = [{ href: "#cafe", label: "Café" }];'],
    ["referencias url(#…) de SVG", '<rect fill="url(#fade)" />'],
    ["entidades HTML", "<p>&#039;hola&#123;</p>"],
    ["fragmento de una URL", '<a href="https://example.com/#add"></a>'],
    ["campo privado de una clase", "this.#add(item);"],
    ["variables y cero en estilos", '<p style="color: var(--color-fg); margin: 0"></p>'],
    ["cero con unidad", "<style>.a { transition-delay: 0s; margin: 0px; }</style>"],
    ["currentColor y transparent", '<path fill="currentColor" stroke="transparent" />'],
    ["valor calculado al ejecutar", "<div style={`left: ${x}px`}></div>"],
    ["palabra que contiene un color", '<p style="white-space: nowrap"></p>'],
    ["comentario de CSS", "<style>/* Es tan sutil que en red lenta no se nota: 44px */ .a { opacity: 0.5 }</style>"],
    ["pasos de @keyframes", "<style>@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }</style>"],
    ["firma de índice de TypeScript", "type Sizes = { [key: string]: number };"],
    ["unidades y colores fuera de CSS", "<p>Objetivos táctiles de 44px; el aviso en red no es un color</p>"],
    ["elemento que empieza por style", "<style-guide>44px en red</style-guide>"],
  ])("%s", (_, content) => {
    expect(findLiterals(content)).toEqual([]);
  });
});

describe("findLiterals: tramos de CSS, posición y orden", () => {
  it("indica la línea de cada literal", () => {
    const content = [
      "---",
      'const title = "Inicio";',
      "---",
      "",
      '<main class="p-4">',
      '  <p class="z-50">hola</p>',
      "</main>",
    ];
    expect(findLiterals(content.join("\n"))).toEqual([{ line: 6, rule: "numeric-utility", match: "z-50" }]);
  });

  it("indica la línea dentro de un bloque <style> de varias líneas", () => {
    const content = ["<p>hola</p>", "<style>", "  p {", "    margin: 12px;", "  }", "</style>"];
    expect(findLiterals(content.join("\n"))).toEqual([{ line: 4, rule: "inline-length", match: "12px" }]);
  });

  it("cierra un style entre comillas en su comilla", () => {
    expect(findLiterals('<p style="color: var(--color-fg)">44px en red</p>')).toEqual([]);
  });

  it("cierra un style={{…}} de varias líneas en su llave", () => {
    const content = ["<p", "  style={{", '    color: "var(--color-fg)",', "  }}", ">", "  44px en el texto", "</p>"];
    expect(findLiterals(content.join("\n"))).toEqual([]);
  });

  it("cuenta la profundidad de las llaves de un style={{…}}", () => {
    expect(findLiterals('<p style={{ a: `${b}`, margin: "12px" }}></p>')).toEqual([
      { line: 1, rule: "inline-length", match: "12px" },
    ]);
  });

  it("no cuenta las llaves que van dentro de una cadena", () => {
    const content = ['<p style={{ content: "{" }}></p>', "<p>Hecho en red, tan simple, con 44px</p>"];
    expect(findLiterals(content.join("\n"))).toEqual([]);
  });

  it("no toma un <style … /> autocerrado por un bloque de CSS", () => {
    const content = ["<style is:inline set:html={css} />", "<p>44px en red</p>", "<style>.a { opacity: 1 }</style>"];
    expect(findLiterals(content.join("\n"))).toEqual([]);
  });

  it("sigue marcando lo que está fuera de un comentario de CSS", () => {
    expect(findLiterals("<style>/* 44px */ .a { margin: 12px }</style>")).toEqual([
      { line: 1, rule: "inline-length", match: "12px" },
    ]);
  });

  it("devuelve varios literales en orden de aparición", () => {
    expect(findLiterals('<div class="z-50 bg-[#fff]" style="color: white"></div>')).toEqual([
      { line: 1, rule: "numeric-utility", match: "z-50" },
      { line: 1, rule: "arbitrary-value", match: "bg-[#fff]" },
      { line: 1, rule: "named-color", match: "white" },
    ]);
  });

  it("no repite un literal contenido en otro", () => {
    expect(findLiterals('<p class="[color:#fff]"></p>')).toEqual([
      { line: 1, rule: "arbitrary-value", match: "[color:#fff]" },
    ]);
  });

  it("revisa en poco tiempo una línea larga sin espacios", () => {
    const start = performance.now();
    findLiterals("a-".repeat(100_000) + "[a:".repeat(50_000));
    expect(performance.now() - start).toBeLessThan(1000);
  });
});
