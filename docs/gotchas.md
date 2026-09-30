# Gotchas del entorno y del stack

<!-- Trampas ya pagadas, para no volver a pagarlas. Se alimenta al terminar una tarea, en vez de engordar su fila en
     tasks.md. Una entrada por trampa, con qué pasa y qué hacer. Si algo deja de aplicar, se borra. -->

## Windows y terminal

- **`node` huérfano en un puerto.** Parar un `astro dev` o `astro preview` lanzado en segundo plano deja el proceso escuchando. La siguiente ejecución falla con el puerto ocupado. Se libera con `netstat -ano | grep <puerto>` y `taskkill //PID <pid> //F` (doble barra en Git Bash).
- **Puertos repartidos**: 4321 lo suele tener un `astro dev` de Adrián desde VS Code · 4322 es el `preview` del navegador integrado (`.claude/launch.json`) · 4323 es el `webServer` de Playwright, con `reuseExistingServer: false`. Reutilizar cualquiera probaría otro servidor en vez del `dist/` recién construido.
- **`grep -c $'\r'` no cuenta CR**: devuelve el número de líneas del archivo y da falsos positivos de CRLF. Usar `git ls-files --eol` o contar bytes con Python.
- **Al escribir archivos con Python**, `newline="\n"`: en Windows convierte a CRLF por defecto.
- **`lhci autorun` falla a veces con `EPERM … Temp\lighthouse.NNNN`.** Es `chrome-launcher` al borrar su perfil temporal (bug 266) y aborta la ejecución entera aunque el informe ya esté calculado. En T9 salió en 4 de 6 intentos con una página que deja una tarea larga; en T14 salió en 4 de 5 con la portada tal cual, así que no depende de la página. Solo en Windows: la integración continua corre en Linux. La salida es reintentar. No se parchea: el arreglo conocido es fijar un `--user-data-dir`, y eso cambiaría el perfil de medición que `lighthouserc.json` fija a propósito.

## Astro

- **Comprime el HTML y borra el espacio en blanco que contiene un salto de línea junto a una etiqueta.** `puedes⏎<a>` se renderiza como «puedesescribirme». El espacio antes de un elemento en línea va en la misma línea que el texto; Prettier lo reescribe como `puedes{" "}`, que se renderiza igual.
- **`prettier-plugin-astro` 1.x asume `compressHTML: "jsx"`**, el valor por defecto de Astro 7, con su opción `astroCompressHTML`. Si se cambia uno, hay que cambiar el otro.
- **El cuerpo de `<script>` y `<style>` es texto crudo**: las llaves no se interpretan como expresiones.
- **`astro check` revisa todos los `.ts` y los `.mjs` con `// @ts-check` del `tsconfig`**, no solo los `.astro`. Es lo que domina el tiempo de `pnpm check` (~30 s en frío).
- **Las fuentes variables vienen de Fontsource `@latest`** y el proveedor no admite fijar la versión: un build sin caché puede traer una nueva.

## Tailwind y tokens

- **`source("..")` en el `@import` limita el escaneo a `src/`.** Es lo que impide que las clases de ejemplo de `docs/` y `design/` (`bg-[#fff]`) lleguen al CSS. Efecto lateral: **`content/` queda fuera del escaneo**, así que una clase escrita solo en un MDX no se generaría. El estilo del contenido vive en componentes de `src/`.
- **Tailwind solo emite en `:root` las variables de tema que se usan.** Un script que lea un token en tiempo de ejecución debe nombrarlo literalmente en algún archivo de `src/`.
- **Lightning CSS reescribe las duraciones en segundos** (`0s`, `.48s`): al comprobarlas hay que comparar el valor numérico, no el texto `0ms`.
- **Huecos conocidos de la regla 6**: `globals.css` no reinicia `--leading-*`, `--tracking-*`, `--container-*` ni `--spacing`, así que `dist/` publica defaults de Tailwind (`leading-loose`, `tracking-wide`, `max-w-4xl`, `gap-8`). CA-5 no nombra esas categorías; la regla 6 sí nombra espaciado. Pendiente de decidir en la retro.

## Herramientas de verificación

- **`pnpm test -- <patrón>` no filtra**: pnpm 12 reenvía el `--` al script y Vitest guarda lo de detrás en `options["--"]`, que `vitest run` no lee. Usar `pnpm test <patrón>`, sin `--`.
- **Chromium de Playwright se instala aparte**: `pnpm exec playwright install chromium` (310 MB en `%LOCALAPPDATA%\ms-playwright`). `pnpm install` no lo trae.
- **`pnpm perf` necesita un Chrome del sistema.** Tampoco lo trae `pnpm install`.
- **`pnpm perf` no cubre los cinco límites de CA-N01.1 a CA-N01.5 por sí solo**: las familias y los archivos de fuente los comprueba `tests/e2e/foundation.spec.ts`. Solo la integración continua encadena los dos.
- **El escáner de tamaños solo ve el JavaScript que el HTML nombra.** Un fragmento cargado con `import()` dinámico no entra en el presupuesto: Vite lo carga en tiempo de ejecución, no con un `<link>`. Tampoco entra el que un módulo importa de forma estática: si dos islas comparten GSAP, Rollup lo separa en un fragmento propio, y Astro no emite `modulepreload` para él (`/code-review` de T14). Hoy es teórico (0 kB de JS en la portada), pero **con GSAP se esconderían 70-90 kB**. Hay que cerrarlo antes de la primera isla, siguiendo los `import` de cada módulo contado o leyendo el manifiesto de Vite.
- **`check-literals` solo revisa `src/components`, `src/pages` y `src/layouts`**, y en ellos no mira los `.css` (`/code-review` de T14). Un `el.style.transform = "translateY(12px)"` en una isla de `src/scripts/`, o un `.css` junto a un componente, pasan en verde. Un `.css` hay que tratarlo entero como CSS, porque `cssRanges` solo reconoce atributos `style` y elementos `<style>`. Hay que cerrarlo antes de la primera isla.
- **Un script que bloquea el análisis del documento no mueve el tiempo de bloqueo**, que se mide entre el primer pintado y la interactividad: su coste va a LCP. Para provocar `total-blocking-time` hay que lanzar la tarea larga **después** del primer pintado.
- **Para superar un presupuesto de tamaño hay que usar relleno incompresible** (base64 aleatorio): un relleno repetitivo se comprime a nada.
- **Los dos ejecutables, `check-literals.mjs` y `check-size-budget.mjs`, no tienen prueba automática** (constitución regla 1). Sus salvaguardas se han visto en rojo a mano.
- **`pnpm install` no ejecuta `prepare` si no tiene nada que instalar**: sale con «Already up to date» en milisegundos y se lo salta, así que el hook de git no se activa. Solo lo dispara una instalación real (clon nuevo, lockfile cambiado, `--force`).
- **Un hook de git con CRLF falla** con `/bin/sh^M: bad interpreter`. `.githooks/pre-commit` va en LF, y el bit de ejecución se pone en el índice con `git update-index --chmod=+x`, porque Windows no lo guarda en el sistema de archivos.
- **El hook tarda ~15 s en caliente y ~61 s en frío** justo después de instalar, porque Vite reoptimiza las dependencias. El techo acordado son 60 s: en frío lo roza.
- **ESLint no lee `.gitignore`**: cada carpeta generada nueva se añade a `globalIgnores` de `eslint.config.js`.
- **`"types": ["node"]` en `tsconfig.json` apaga la inclusión automática del resto de `@types/*`**: el que dependa de ella hay que nombrarlo en esa lista.
- **`pnpm add -D @types/node` instala la última mayor**, más nueva que el Node de la máquina, y aceptaría API que no existen. Fijar `^24`.
- **Node mínimo 24.16.0**: lo exige `eslint-plugin-astro` en todas sus versiones compatibles con ESLint 10.

## Cloudflare y GitHub

- **El repositorio es público** (se creó así y se decidió mantenerlo el 2026-09-30). Todo lo que se versiona, historial incluido, lo puede leer cualquiera. A cambio, la protección de ramas es gratuita y los minutos de Actions no tienen límite.
- **El ruleset de `main` exige el check `verify`.** Con eso, un empuje directo a `main` de un commit sin verificar se rechaza: todo entra por propuesta. En el ruleset solo se puede elegir un check que se haya ejecutado en los últimos 7 días. Si se renombra el trabajo `verify` en `ci.yml`, hay que actualizar el ruleset, o ninguna propuesta volverá a poder integrarse.
- **Las propuestas desde un fork no se previsualizan**: no reciben los secretos de Cloudflare ni un token con escritura. `deploy-preview` solo corre para ramas del propio repositorio. `verify` sí corre, previa aprobación en el caso de quien contribuye por primera vez.
- **Conectar el repositorio al crear el Worker desde el panel activa Workers Builds**: un segundo camino de despliegue que no espera a `verify`, así que publicaría un commit en rojo en `main` y previsualizaciones sin verificar. En la 001 no llegó a publicar porque sus builds fallaban. Se desconecta en el Worker → Settings → Build, y se desinstala la aplicación «Cloudflare Workers and Pages» de GitHub. Si una propuesta de cambio vuelve a mostrar el check «Workers Builds», alguien lo ha reconectado.
- **El historial de versiones conserva las que se crearon desde el panel** al crear el Worker (plantilla de ejemplo, origen «Dashboard»). Volver a «la anterior» sin mirar puede dejar producción sirviendo esa plantilla: comprobar antes la versión de destino. Las que publica la integración continua figuran como «Wrangler by Unknown» en el panel y como `Unknown (deployment)` en `wrangler deployments list`, porque el token no pertenece a ningún usuario.
- **`pnpm rollback` sin argumentos vuelve al despliegue anterior con el 100 % del tráfico.** Las versiones subidas como previsualización no son despliegues, así que nunca son su destino. Pregunta primero el mensaje y después la confirmación: una «y» escrita a destiempo acaba como mensaje del despliegue.
- **Un alias de previsualización nuevo tarda ~1 min en responder.** Antes, Cloudflare devuelve su «Page not found» genérica, no la página del sitio. No es un fallo del despliegue: se reintenta.
- **`wrangler` acepta las comas finales** que Prettier añade en `wrangler.jsonc`.

## Pendientes que ya sabemos que van a morder

| Spec | Qué |
|---|---|
| 002 | Una clase escrita solo en un MDX de `content/` no se genera: ver `source("..")` arriba |
| 003 | Un `<meta name="theme-color" content="#…">` falla por `hex-color`: el valor tiene que derivarse del token |
| 003 | Del HTML se leen los `<style>` pero no los atributos `style="--x: …"` con los que Astro materializa `define:vars` |
| 002 / 007 | Cerrar el hueco del `import()` dinámico y de los `import` estáticos entre fragmentos en el presupuesto antes de meter la primera isla |
| 002 / 007 | Ampliar `check-literals` a `src/scripts/` y a los `.css` antes de meter la primera isla |
| 010 | Una plantilla de correo HTML con estilos en línea dentro de `api/contact.ts` fallaría por literales; la 010 decide dónde vive |
| 010 / 015 | Cloudflare aplica `_headers` solo a los activos estáticos, no a lo que genere el Worker |
