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
- Antes de implementar cualquier tarea que toque más de un archivo: plan mode.
- Cada tarea termina con: tests verdes + revisión (`/code-review` o subagente revisor-codigo) + commit.

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
<!-- PENDIENTES DE VERIFICAR: el proyecto Astro aún no está creado. Al crearlo, ejecuta cada uno una vez y borra esta advertencia. Un comando inventado es peor que ninguno. -->
- Instalar: `pnpm install`
- Ejecutar en desarrollo: `pnpm dev`
- Tests (rápidos, para el ciclo por tarea): `pnpm test <patrón>` — un test concreto, no la suite. Sin `--`: pnpm 12 lo pasa tal cual y Vitest ignora el filtro que va detrás
- Tests completos: `pnpm test:all` (unitarios + navegador)
- Lint / formato / type-check: `pnpm check`
- Build: `pnpm build`
- Medición de rendimiento contra el presupuesto: `pnpm perf`

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
- Repositorio remoto en GitHub: **no existe todavía**. Se crea privado en la iteración 1 (spec 001); lo crea Adrián.
- La capa gratuita del servicio de correo tiene un tope de 100 envíos al día.
