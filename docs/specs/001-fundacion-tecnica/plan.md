# Plan 001 · Fundación técnica y verificación automática

<!-- CÓMO. Escrito en plan mode con la spec aprobada. Autocontenido: la sesión que implemente no ve la conversación
     en la que se escribió. Tareas en tasks.md. -->

| Campo | Valor |
|---|---|
| Spec | [spec.md](spec.md), aprobada el 2026-09-26 |
| Estado | Aprobado el 2026-09-26 |
| Decisiones de la sesión de planificación | Repositorio privado con producción blindada (límite de CA-10 aceptado, ver spec). Perfil de medición = perfil móvil por defecto de Lighthouse (regla 9). Nuevo [ADR-012](../../02-arquitectura/decisiones/ADR-012-herramientas-verificacion.md) |
| Fuentes consultadas el 2026-09-26 | Documentación de Astro (fuentes, despliegue en Cloudflare), Cloudflare Workers (`_headers`, URLs de versión, vuelta atrás, `workers.dev`), GitHub (ramas protegidas) y Lighthouse CI (configuración) |

## Resumen del enfoque

Proyecto Astro 7 **estático, sin adaptador**: el adaptador de Cloudflare llega con el endpoint del formulario en la spec 010. Se publica en Cloudflare Workers solo con activos estáticos. Los tokens de `docs/03-diseno/sistema-diseno.md` §12.1 se copian a `src/styles/globals.css` con Tailwind v4, reiniciando sus paletas por defecto. Las fuentes se autoalojan con la **API de fuentes nativa de Astro**, estable: descarga los archivos en el build, los sirve desde el propio origen y genera respaldos ajustados en métrica, sin dependencias nuevas.

La verificación tiene cinco puertas, y cada una **se demuestra fallando al menos una vez** con un cambio provocado a propósito y revertido después (caso borde de la spec):

1. `pnpm check`: tipos, análisis estático, formato y literales.
2. Pruebas unitarias: tokens y contraste, y la lógica de los scripts propios.
3. Pruebas de navegador: idioma, fuentes solo del propio origen, movimiento reducido y accesibilidad.
4. `pnpm perf`: Lighthouse CI más un script propio de tamaños con gzip.
5. Hook de git que impide confirmar con fallos.

GitHub Actions ejecuta las cinco y publica: una previsualización por propuesta de cambio con `wrangler versions upload --preview-alias` y producción al integrar en `main`, **siempre el mismo `dist/` que se verificó**.

## Archivos afectados

| Archivo | Acción | Qué cambia | Tarea |
|---|---|---|---|
| `docs/02-arquitectura/decisiones/ADR-012-herramientas-verificacion.md` | crear | Regla 8: herramientas e inventario de dependencias | T1 ✔ |
| `docs/02-arquitectura/constitution.md` | modificar | Regla 9 con las cifras exactas del perfil | T1 ✔ |
| `docs/02-arquitectura/stack.md` | modificar | pnpm 12.4.2; formato, pruebas y hook enlazados a ADR-012 | T1 ✔ |
| `docs/specs/001-fundacion-tecnica/spec.md` | modificar | Preguntas abiertas resueltas; límites de CA-10 y CA-18 | T1 ✔ |
| `docs/04-roadmap.md` | modificar | Cabeceras de seguridad en 003; CA-17 y CA-18 se completan en 015 | T1 ✔ |
| `package.json` | crear | `packageManager: "pnpm@12.4.2"`, scripts (tabla de §Diseño técnico), dependencias | T2 |
| `astro.config.mjs` | crear | Plugin de Tailwind para Vite; `fonts` con 3 familias | T2, T3 |
| `tsconfig.json` | crear | Extiende `astro/tsconfigs/strict` (ADR-002) | T2 |
| `.gitignore` | modificar | Añadir `.astro/`, `.wrangler/`, `.lighthouseci/`, `test-results/`, `playwright-report/`, `coverage/` | T2 |
| `src/styles/globals.css` | crear | Bloque de §12.1 íntegro; las familias apuntan a las variables de la API de fuentes | T3 |
| `src/layouts/BaseLayout.astro` | crear | `<html lang="es-PE">`, `title`, `description`, `<Font>` (solo display con `preload`) | T3 |
| `docs/03-diseno/sistema-diseno.md` | modificar | §12.1: líneas de familias según la API de fuentes (mismo commit que `globals.css`) | T3 |
| `src/pages/index.astro` | crear | Página provisional | T2, T4 |
| `public/_headers` | crear | `X-Robots-Tag: noindex` en `/*` | T4 |
| `eslint.config.js` · `.prettierrc.json` · `.prettierignore` | crear | Análisis estático y formato | T5 |
| `.claude/hooks/hooks.config.json` | modificar | Formateadores para `.astro`, `.mjs`, `.jsonc` y `.yml`; `pre_commit_test_command` sigue vacío | T5 |
| `scripts/lib/find-literals.mjs` · `scripts/check-literals.mjs` | crear | Lógica pura de detección y su ejecutable | T6 |
| `vitest.config.ts` | crear | Pruebas unitarias en `tests/unit/` | T6 |
| `tests/unit/find-literals.test.ts` | crear | Casos que deben pasar y fallar | T6 |
| `tests/unit/design-tokens.test.ts` | crear | Sincronía documento–CSS, reinicios y matriz de contraste | T7 |
| `playwright.config.ts` · `tests/e2e/foundation.spec.ts` | crear | Pruebas de navegador contra `astro preview` | T8 |
| `lighthouserc.json` | crear | Perfil fijado, 3 ejecuciones, mediana, aserciones | T9 |
| `scripts/lib/size-budget.mjs` · `scripts/check-size-budget.mjs` · `tests/unit/size-budget.test.ts` | crear | Tamaños con gzip de la portada | T9 |
| `.githooks/pre-commit` | crear | `pnpm check && pnpm test`, ejecutable | T10 |
| `wrangler.jsonc` | crear | Configuración del Worker de activos | T11 |
| `.github/workflows/ci.yml` | crear | `verify` → `deploy-preview` · `deploy-production` | T11, T12 |
| `README.md` | reescribir | Del README del kit al del proyecto | T13 |
| `CLAUDE.md` | modificar | Comandos reales y vuelta atrás | T13 |

## Diseño técnico

### Scripts

Coherentes con la sección Comandos de `CLAUDE.md` (CA-1):

| Script | Comando |
|---|---|
| `dev` · `build` · `preview` | `astro dev` · `astro build` · `astro preview` |
| `check` | `astro check && eslint . && prettier --check . && node scripts/check-literals.mjs` |
| `format` | `prettier --write .` |
| `test` | `vitest run`; se filtra con `pnpm test -- <patrón>` |
| `test:e2e` | `playwright test` (necesita `dist/`; lo sirve `astro preview`) |
| `test:all` | `vitest run && pnpm build && playwright test` |
| `perf` | `pnpm build && pnpm perf:measure` |
| `perf:measure` | `lhci autorun && node scripts/check-size-budget.mjs` (la integración continua lo llama tras su propio build) |
| `rollback` | `wrangler rollback` |
| `prepare` | `git config core.hooksPath .githooks` |

### Tokens y fuentes (CA-5, CA-6, CA-9)

- `globals.css` contiene, en este orden: `@import "tailwindcss";`, el bloque `@theme` de §12.1 con los reinicios (`--color-*: initial;` y el resto), el bloque `:root` de duraciones y capas, y la consulta `@media (prefers-reduced-motion: reduce)`. Se copia literalmente del documento, salvo las familias.
- Fuentes en `astro.config.mjs` con `fontProviders.fontsource()` y `subsets: ["latin"]`: Instrument Serif (peso 400, estilos normal y cursiva), Geist (variable, 300–700) y Geist Mono (variable, 400–500). Cada familia recibe su propia variable CSS de Astro; en `globals.css`, `--font-display`, `--font-sans` y `--font-mono` apuntan a ellas dentro de `@theme inline`. Así, el nombre del token no cambia y las utilidades usan el valor resuelto con su respaldo ajustado. §12.1 se actualiza en el mismo commit.
- En `BaseLayout.astro`, `<Font>` de las tres familias en el `<head>`, y **solo la display con `preload`**: el `h1` provisional está en display y será el elemento principal de carga.
- Límite de 6 archivos de fuente: lo verifica la prueba de navegador (T8). Si el proveedor genera un archivo por peso en vez de uno variable, se ajustan los pesos declarados hasta cumplirlo, sin cambiar las familias.

### Página provisional (CA-3, CA-4)

- `BaseLayout` recibe `title` y `description`. Título: «Adrián Marchan · Sitio en construcción». Descripción: «Desarrollo web, e-commerce, automatización, SEO y analítica en Lima, Perú.»
- Contenido de `index.astro`:
  - etiqueta decorativa `SYSTEM ONLINE`, con `aria-hidden="true"`;
  - `h1` en display: «Construyo sistemas digitales que hacen *crecer* negocios.», con «crecer» en cursiva y `text-accent`;
  - nombre público;
  - etiqueta informativa `EN CONSTRUCCIÓN` en mono;
  - un párrafo en sans con un enlace a `https://wa.me/51937422519` (dato del brief).
- Solo tokens: ninguna clase con valor arbitrario (lo vigila T6).

### Comprobación de literales (CA-7)

`scripts/lib/find-literals.mjs` exporta una función pura `findLiterals(filePath, content) → [{ line, match, rule }]`. `scripts/check-literals.mjs` recorre `src/components`, `src/pages` y `src/layouts` (`.astro`, `.ts`, `.tsx`, `.mjs`), imprime `archivo:línea: regla — fragmento` y sale con código 1 si hay alguno. Reglas:

| Regla | Patrón | Ejemplo prohibido | Ejemplo permitido |
|---|---|---|---|
| `arbitrary-value` | Clase de Tailwind con corchetes `-[…]` | `bg-[#fff]`, `p-[13px]` | `p-4`, `duration-(--duration-ui)` |
| `hex-color` | `#` seguido de 3, 4, 6 u 8 dígitos hexadecimales dentro de `class` o `style` | `style="color:#fff"` | `href="#contacto"` |
| `color-function` | `rgb(`, `rgba(`, `hsl(`, `hsla(`, `oklch(`, `oklab(`, `lab(`, `lch(` | `style="color: rgb(0 0 0)"` | — |
| `numeric-utility` | `duration-N`, `delay-N`, `z-N` con número | `duration-300`, `z-50` | `z-(--z-header)` |
| `inline-length` | Longitud literal (`px`, `rem`, `em`, `ms`, `s`) dentro de `style=""` | `style="margin: 12px"` | — |

### Contraste y sincronía (CA-5, CA-8)

`tests/unit/design-tokens.test.ts` lee `docs/03-diseno/sistema-diseno.md` y `src/styles/globals.css`:

1. Extrae el primer bloque ```` ```css ```` de §12.1 y comprueba que **cada** variable declarada allí existe en `globals.css` con el mismo valor. Las familias se comparan por el nombre de la familia principal.
2. Comprueba que están los nueve reinicios (`--color-*: initial`, etc.).
3. Recalcula la matriz de §2.2 con la fórmula de WCAG 2.x:
   - texto (`fg`, `fg-muted`, `fg-subtle`, `accent`, `success`, `warning`, `danger`) ≥ 4,5 sobre `bg`, `bg-elevated`, `surface` y `surface-hover`;
   - `line-control` y `accent` ≥ 3 sobre los mismos fondos;
   - `accent-fg` ≥ 4,5 sobre `accent` y `accent-hover`.

   Cada fallo nombra el par y su ratio.

### Presupuesto de rendimiento (CA-11)

`lighthouserc.json`:

- `collect`: `staticDistDir: "./dist"`, `numberOfRuns: 3`, `settings` con el perfil fijado **explícitamente**: `formFactor: "mobile"`, emulación de pantalla móvil, `throttlingMethod: "simulate"`, `throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 }`. Son los valores por defecto de Lighthouse; se escriben para que un cambio de versión no los mueva sin que se note.
- `assert.assertions`, todas con `aggregationMethod: "median"`:
  - `categories:performance` y `categories:accessibility`: `minScore: 0.95` (regla 11);
  - `largest-contentful-paint`: `maxNumericValue: 2500`;
  - `cumulative-layout-shift`: `maxNumericValue: 0.099` (el requisito dice «por debajo de 0,1»);
  - `total-blocking-time`: `maxNumericValue: 200`. Es el sustituto de laboratorio de la respuesta a interacciones, que Lighthouse no mide sin interacción. La medición real llega con la spec 011 y la analítica.
- `upload`: `target: "filesystem"`, `outputDir: ".lighthouseci"`. Se publica como artefacto de la integración continua. **No** se usa el almacenamiento público temporal.

`scripts/lib/size-budget.mjs` exporta una función pura que, a partir del HTML y de un lector de archivos, suma con gzip (nivel por defecto de `zlib`):
- el JS: `<script src>`, `<link rel="modulepreload">` y `<script>` en línea;
- el CSS: `<link rel="stylesheet">` y `<style>` en línea.

`scripts/check-size-budget.mjs` la aplica a `dist/index.html`, imprime los dos totales y falla por encima de **180 kB de JS o 40 kB de CSS** (CA-N01.4).

### Pruebas de navegador (CA-4, CA-6, CA-9, accesibilidad)

`playwright.config.ts`: Chromium, `webServer` con `pnpm preview` en el puerto 4321 y `reuseExistingServer` fuera de la integración continua. `tests/e2e/foundation.spec.ts`:

- `html[lang="es-PE"]`, `<title>` y `<meta name="description">` no vacíos.
- Registro de todas las peticiones: todas del propio origen; como máximo 6 de fuentes; como máximo 3 valores distintos de `font-family` resueltos por los elementos visibles.
- Con `page.emulateMedia({ reducedMotion: 'reduce' })`, `getComputedStyle(document.documentElement).getPropertyValue('--duration-section')` vale `0ms`.
- `@axe-core/playwright` sin violaciones de impacto `serious` ni `critical`.
- Ningún CSS de `dist/` contiene variables de la paleta por defecto (`--color-red-`, `--color-blue-`, `--shadow-`…).

### Hook local (CA-12)

`.githooks/pre-commit` (`#!/bin/sh`): `pnpm check && pnpm test`. Se marca ejecutable en el índice con `git update-index --chmod=+x .githooks/pre-commit`. El script `prepare` configura `core.hooksPath` al instalar. Git ejecuta este hook también en las confirmaciones de Claude, por eso `pre_commit_test_command` del kit queda vacío (ADR-012). Se mide cuánto tarda; si pasa de 60 s, se anota en la retro.

### Integración continua y publicación (CA-10, CA-13 a CA-16, CA-20)

`.github/workflows/ci.yml`, en `pull_request` y en `push` a `main`:

- `concurrency: ci-${{ github.ref }}` con `cancel-in-progress` **solo** en propuestas, para no cortar nunca un despliegue de `main`.
- **`verify`** (`permissions: contents: read`): checkout → `pnpm/action-setup` (lee `packageManager`) → `actions/setup-node` con Node 24 y caché de pnpm → `pnpm install --frozen-lockfile` → `pnpm check` → `pnpm test` → `pnpm build` → `pnpm exec playwright install --with-deps chromium` → `pnpm test:e2e` → `pnpm perf:measure`. Sube `dist/` como artefacto, y `.lighthouseci/` y el informe de Playwright con `if: always()`.
- **`deploy-preview`** (solo en `pull_request`; `needs: verify`; permisos `contents: read` y `pull-requests: write`): descarga `dist/`, instala, ejecuta `pnpm exec wrangler versions upload --preview-alias pr-${{ github.event.pull_request.number }}`, extrae la URL de la salida y la publica como comentario en la propuesta, editando el anterior si existe (CA-13).
- **`deploy-production`** (solo en `push` a `main`; `needs: verify`): descarga `dist/`, instala y ejecuta `pnpm exec wrangler deploy` (CA-14). Como depende de `verify`, un rojo impide publicar (CA-15).
- Las acciones de terceros se fijan **por SHA de commit**, resuelto al implementar (cadena de suministro).
- Secretos en GitHub, nunca en el repositorio: `CLOUDFLARE_API_TOKEN` (plantilla «Edit Cloudflare Workers», permiso mínimo) y `CLOUDFLARE_ACCOUNT_ID` (CA-19). Esta spec no necesita variables en `.env.example`.

`wrangler.jsonc`:

```jsonc
{
  "name": "portafolio-adrian",            // confirmar con el nombre elegido al crear la cuenta
  "compatibility_date": "2026-09-26",
  "assets": { "directory": "./dist" },
  "workers_dev": true,
  "preview_urls": true
}
```

- **Orden obligatorio**: el primer despliegue a producción crea el Worker; sin él, `versions upload` falla. El primer empuje va a `main` y solo después se abren propuestas.
- **Vuelta atrás** (CA-16): `pnpm rollback` sin argumentos ofrece las versiones recientes; con un identificador vuelve a esa versión. Cloudflare conserva las 100 últimas.
- **`noindex`** (CA-17): `public/_headers` con `/*` → `X-Robots-Tag: noindex`. Workers aplica `_headers` a los activos estáticos. La spec 015 lo retira al lanzar.
- **Cifrado** (CA-18): en `*.workers.dev`, el dominio `.dev` está en la lista de precarga HSTS, así que ningún navegador usa HTTP. La redirección explícita para otros clientes se activa con el dominio propio en la 015.
- **Coste** (CA-20): Workers con activos estáticos, capa gratuita con uso comercial permitido (ADR-007). Repositorio privado: 2.000 minutos al mes de integración continua en la capa gratuita; se mide el consumo al cerrar la iteración (ADR-012).

## Patrones existentes a seguir

- Bloque de tokens: `docs/03-diseno/sistema-diseno.md` §12.1 es el contrato; se copia, no se reinterpreta.
- Hooks del kit: `.claude/hooks/hooks.config.json` es la única configuración que se edita; los scripts `.py` no se tocan.
- Formato de los documentos: el del resto de `docs/`, en español, con tildes.
- No hay código de producto previo: esta spec crea los patrones de estructura (`src/layouts`, `src/pages`, `src/styles`, `scripts/lib` con lógica pura y un ejecutable fino), que las specs siguientes reutilizan.

## Dependencias nuevas

Todas de desarrollo salvo `astro`. El inventario completo, con el ADR que cubre cada una, está en ADR-012.

| Paquete | Motivo | Alternativa descartada | ADR |
|---|---|---|---|
| `astro`, `typescript`, `@astrojs/check` | Framework, TypeScript estricto, comprobación de tipos | Next.js | 002 |
| `tailwindcss`, `@tailwindcss/vite` | Estilos y tokens | CSS propio con variables | 003 |
| `vitest` | Pruebas unitarias | — | 009 |
| `@playwright/test`, `@axe-core/playwright` | Pruebas de navegador y de accesibilidad | — | 009 |
| `@lhci/cli` | Presupuesto de rendimiento | Solo PageSpeed Insights por API · `size-limit` | 009 y 012 |
| `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-astro` | Análisis estático | Biome | 012 |
| `prettier`, `prettier-plugin-astro` | Formato | Biome | 012 |
| `wrangler` | Publicación, previsualización y vuelta atrás | Integración de Cloudflare con el repositorio | 007 |

Descartados a propósito: gestores de hooks (`husky`, `lefthook`), porque `core.hooksPath` es nativo; `@astrojs/cloudflare`, que no hace falta hasta la spec 010; y cualquier biblioteca de iconos o de fuentes.

**Aviso de instalación**: pnpm 12 bloquea por defecto los scripts de compilación de las dependencias. Hay que aprobar los que lo necesiten (previsiblemente `esbuild`, `sharp` y `workerd`) con `pnpm approve-builds` y dejar la aprobación versionada. El lockfile lo genera `pnpm install`: los hooks del kit impiden editarlo a mano.

## Estrategia de pruebas (Tier 2)

- **Unitarias** (Vitest, `tests/unit/`):
  - `find-literals`: cada regla con un caso prohibido y uno permitido; anclas `href="#…"`; sintaxis `-(--token)`.
  - `size-budget`: suma de externos y en línea, justo en el límite, por encima del límite.
  - `design-tokens`: sincronía, reinicios y matriz.
- **Navegador** (Playwright + axe, `tests/e2e/`): `foundation.spec.ts` sobre el `dist/` construido.
- **Presupuesto**: `pnpm perf`.
- **Puertas demostradas fallando**, un cambio provocado cada una. Se guarda la salida en rojo como evidencia y se revierte el cambio:
  1. `class="bg-[#fff]"` en `index.astro` → `pnpm check` falla con archivo y línea.
  2. `--color-fg-subtle` oscurecido a `#5A5E69` → `pnpm test -- design-tokens` falla con el par y el ratio.
  3. Un `<script>` en línea de más de 180 kB → `pnpm perf` falla por tamaño y por tiempo de bloqueo.
  4. Una aserción rota en un test → `git commit` bloqueado por el hook.
  5. Una propuesta de cambio con una prueba en rojo → comprobación roja en GitHub y ningún despliegue de previsualización.
- **Datos de prueba**: casos en línea dentro de cada test. Esta spec no tiene contenido: eso es la 002.

## Verificación end-to-end

Lo ejecuta T14, desde Git Bash en la raíz del proyecto:

```bash
pnpm install
pnpm check && pnpm test
pnpm build && pnpm test:e2e
pnpm perf
```

1. Capturas de la página provisional a 360 y 1440 px en el navegador integrado.
2. Las cinco provocaciones de la estrategia de pruebas, con su salida en rojo.
3. Empuje a `main` → integración continua en verde → producción en `https://portafolio-adrian.<subdominio>.workers.dev`.
4. `curl -sI` a esa dirección → cabecera `x-robots-tag: noindex` (CA-17).
5. Rama con un cambio trivial → propuesta → comentario con la URL de previsualización → la misma comprobación `noindex` sobre ella (CA-13).
6. `pnpm rollback` → la dirección sirve la versión anterior → volver a publicar la actual (CA-16).
7. `git clone` en una carpeta nueva del directorio temporal → seguir **solo** el README → instala, construye y pasa las pruebas (caso borde «máquina limpia», CA-2).

## Fuera del plan

- Cabeceras de seguridad (política de contenido, `nosniff`, `Referrer-Policy`) → spec 003 (roadmap).
- `site` en `astro.config.mjs` y la dirección canónica → 003, con los metadatos por página.
- Adaptador de Cloudflare y variables del formulario en `.env.example` → 010.
- Dominio propio, redirección HTTPS explícita y retirada del `noindex` → 015.
