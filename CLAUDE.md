# Portafolio Adrián · The Universe + Mission Control

## Qué es
Plataforma profesional personal de Adrián (desarrollo web, e-commerce, automatización, SEO, analítica; Lima, Perú): portafolio evolutivo que presenta proyectos como "misiones", vende servicios a PYMES de Perú/LATAM y se mide a sí mismo (MISSION 000).
Brief: docs/01-contexto/brief.md · Requerimientos: docs/01-contexto/requerimientos.md
Diseño (Fase 3): docs/03-diseno/sistema-diseno.md (tokens y componentes; dirección **híbrida** decidida) · modelo-datos.md (colecciones de contenido) · api.md (contrato de /api/contact)
Origen (teoría previa al marco, en la raíz): plan_portfolio_universe_mission_control_v2.md · design_brief_claude_design.md · design/moodboards/.
**Ojo**: el plan v2 eligió Next.js y alojamiento de pago; ambas quedaron superadas en la Fase 2 (ver ADR-002 y ADR-007). Donde el plan v2 y `docs/` discrepen, manda `docs/`.

## Tier y proceso
- Tier: 2, confirmado en el Gate 1, **con exigencia de rendimiento superior** (constitución regla 11: 95 o más, no el 80 de la DoD). DoD por tier: checklists/dod-por-tier.md.
- Proceso SDD del marco: spec → plan → tasks → implementar → converger.
- Spec activa: docs/specs/ACTIVA.md (actualízala al cambiar de feature).
- Antes de implementar cualquier tarea que toque más de un archivo: plan mode (constitución regla 29). Para una página o un componente, el plan son cinco viñetas en el chat, no un documento.
- Cada tarea termina con: tests verdes + evidencia + commit.

### Ritmo (revisado el 2026-09-29)
La 001 salió con 1443 líneas de herramienta de verificación para 171 de producto, y las notas de registro crecieron de 101 a 1042 palabras en ocho tareas. El rigor estaba calibrado al riesgo de las herramientas, no al del producto. Correcciones, sin tocar la constitución ni el Tier 2:

- **Revisión por radio de impacto, no por tarea.** Subagente `revisor-codigo` solo en: `src/lib/`, `src/pages/api/contact.ts`, consentimiento y medición, y los esquemas de contenido. En páginas, componentes, estilos y contenido basta `pnpm check` + presupuesto + releer el diff. `qa-tester`, `revisor-seguridad` y `/security-review` van **al cierre de iteración**, que es donde los pone la DoD, no en cada tarea.
- **Ninguna herramienta de verificación nueva.** Toda comprobación automática nueva tiene que ser una línea de configuración en algo que ya existe (ESLint, Astro, Tailwind, Playwright). Ya hay dos escáneres propios; no hay un tercero.
- **Varias tareas por sesión.** Agrupar 3–5 tareas relacionadas en vez de `/clear` entre cada una: reconstruir contexto es el coste fijo más alto.
- **Registro con tope.** En `tasks.md`, cada fila es el commit más **tres viñetas como máximo**, solo lo que afecte a tareas futuras. Lo reutilizable va a docs/gotchas.md. Objetivo: 80 palabras por fila.
- **Tareas de medio día en specs de contenido**, 5–7 por spec, no de dos horas. A 12 tareas por spec, las 15 specs no entran antes del 2026-12-19.
- **Sin ritual de provocación en cada test nuevo.** Demostrar la puerta cerrada valía para las cinco que bloquean la integración (hechas en la 001). No se repite por cada aserción.

No se relaja: la regla 11 (rendimiento y accesibilidad ≥ 95), el presupuesto, `pnpm check`, el hook, un commit por tarea y la evidencia ejecutable.

## Stack
<!-- Decisiones y alternativas descartadas en docs/02-arquitectura/decisiones/. Resumen en docs/02-arquitectura/stack.md -->
- Framework: **Astro 7** (sitio generado en build) + TypeScript estricto — ADR-002
- Estilos: **Tailwind CSS v4**, tokens en `@theme` de src/styles/globals.css — ADR-003
- Contenido: **MDX + Content Collections con esquemas Zod** en src/content.config.ts — ADR-004
- Interactividad: **TypeScript sobre el DOM, sin framework de UI** + GSAP para animación — ADR-005
- Base de datos: **ninguna**. El contenido son archivos versionados; no se persiste ningún dato personal — ADR-001, ADR-006
- Formulario: endpoint único `src/pages/api/contact.ts` + Resend + Turnstile — ADR-006
- Hosting/CI: **Cloudflare Workers** con activos estáticos + GitHub Actions — ADR-007
- Medición: gestor de etiquetas + analítica de Google, **no carga sin consentimiento** — ADR-008
- Gestor de paquetes: **pnpm** (activado con corepack). Usar siempre este, no npm ni yarn.

## Comandos
<!-- Verificados en la 001. Instalación desde cero y requisitos (Node, Chromium, Chrome): README.md -->
- Instalar: `pnpm install` (activa el hook de git con `prepare`); navegador de pruebas aparte: `pnpm exec playwright install chromium`
- Ejecutar en desarrollo: `pnpm dev`
- Tests (rápidos, para el ciclo por tarea): `pnpm test <patrón>` — un test concreto, no la suite. Sin `--`: pnpm 12 lo pasa tal cual y Vitest ignora el filtro que va detrás
- Tests de navegador: `pnpm test:e2e` (construye antes: nunca prueba un `dist/` viejo)
- Tests completos: `pnpm test:all` (unitarios + navegador)
- Lint / formato / type-check: `pnpm check` · formatear: `pnpm format`
- Build: `pnpm build`
- Medición de rendimiento contra el presupuesto: `pnpm perf` (construye y mide; `pnpm perf:measure` mide sin construir, es el de la integración continua)
- Volver a la versión publicada anterior: `pnpm rollback` (requiere `pnpm exec wrangler login` una vez). Publicar solo lo hace `ci.yml`

## Convenciones
- Idioma: respuestas y documentación en español; identificadores de código en inglés; textos de UI y contenido en español (los "system labels" en inglés — SYSTEM ONLINE, MISSION, STATUS — son capa visual y nunca portan información crítica: constitución regla 27).
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`), en inglés, imperativo.
- Ramas: `main` siempre desplegable; una rama `feat/NNN-nombre` por spec.
- Estructura: `content/` contenido editorial · `src/pages/` rutas · `src/components/` por dominio (ui, layout, navigation, universe, mission, sections, forms, telemetry, seo) · `src/lib/` lógica sin vista (content, analytics, seo, motion, utils) · `src/scripts/` islas interactivas · `tests/{unit,e2e}`. Detalle y diagramas: docs/02-arquitectura/arquitectura.md.
- Dependencias: `src/lib/` **no** importa de components ni pages. Los componentes piden contenido a `src/lib/content/`, nunca lo leen directamente.
- Estilo: ningún literal de color, tipografía, espaciado, radio o duración en un componente — solo tokens.
- Tests: Vitest en `tests/unit/`, Playwright en `tests/e2e/`. Mientras iteras ejecuta el test concreto, no la suite.
- Errores: al visitante mensaje genérico; el detalle solo en registros, sin datos personales.
- Animación: solo `transform` y `opacity`. Con movimiento reducido activo se suprime lo que no comunique cambio de estado.

## Reglas del proyecto
- No editar `.env*`, lockfiles ni `secrets/` (hay hooks que lo bloquean; si hace falta, pídelo al usuario).
- No instalar dependencias nuevas sin proponerlo primero y anotar el motivo en el plan de la spec. Toda dependencia nueva lleva ADR (constitución regla 8).
- Lo que la spec no pide, no se implementa; si algo falta en la spec, se actualiza la spec primero.
- **Regla del dato**: ninguna métrica se publica sin fuente, periodo, marca de verificación y referencia a su evidencia. El build debe fallar si falta algo.
- **Solo** `src/lib/analytics/events.ts` emite eventos de medición. Cualquier otro archivo que empuje eventos es un defecto.
- Al terminar una tarea muestra evidencia: salida de tests, medición o captura, no solo "listo".
- Gotchas del entorno y del stack: docs/gotchas.md. Antes de pelearse con algo, mirar si ya está ahí; al aprender algo reutilizable, añadirlo ahí y no en la fila de `tasks.md`.
- Al compactar, conserva siempre: lista de archivos modificados, comandos de test y la spec/tarea activa.

## Presupuesto de rendimiento (bloquea la integración)
Medido en el perfil de referencia de la constitución (móvil con CPU a un cuarto y red móvil rápida simulada):
carga del contenido principal ≤ 2,5 s · interacción más lenta ≤ 200 ms · desplazamiento visual < 0,1 · JS de la portada ≤ 180 kB y CSS ≤ 40 kB comprimidos con gzip · ≤ 3 familias tipográficas y 6 archivos de fuente · puntuación de rendimiento y accesibilidad ≥ 95.

## Constitución
30 reglas no negociables en docs/02-arquitectura/constitution.md. Léela antes de escribir una spec.

## Subagentes disponibles (.claude/agents/)
explorador (mapear código) · revisor-codigo (revisar diff vs spec) · revisor-seguridad (OWASP) · qa-tester (recorrer flujos con evidencias) · documentador (README/CHANGELOG/docs).

## Gotchas
<!-- Comportamientos no obvios del entorno: variables necesarias, puertos, servicios externos, cosas que Claude hizo mal más de una vez. -->
- Entorno Windows 11 + Git Bash. Los hooks del kit corren con `python` (3.12.2 instalado).
- Los archivos de texto van en UTF-8 sin BOM y con finales de línea LF (`.gitattributes` lo fuerza). Al escribir archivos con Python usa `newline="\n"`: en Windows convierte a CRLF por defecto.
- Para comprobar finales de línea usa `git ls-files --eol` o cuenta bytes con Python. En este Git Bash, `grep -c $'\r'` devuelve el número de líneas del archivo, no los CR: da falsos positivos de CRLF.
- Repositorio remoto: GitHub, **público**, `AdriannDev/portafolio-adrian` (decisión del 2026-09-30). El ruleset de `main` exige `verify` en verde para integrar: todo entra por propuesta. El único camino de despliegue es `ci.yml`; Workers Builds de Cloudflare va desconectado (docs/gotchas.md).
- La capa gratuita del servicio de correo tiene un tope de 100 envíos al día.
