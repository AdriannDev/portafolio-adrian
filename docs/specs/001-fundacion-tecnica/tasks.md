# Tareas 001 · Fundación técnica y verificación automática

<!-- Tareas de ≤ 2 h, ordenadas por dependencia. [P] = puede ejecutarse en paralelo con la anterior.
     Cada tarea: qué, archivos, criterio(s) de aceptación que cubre y cómo se verifica.
     La sesión de implementación marca [x] al terminar y anota el commit.
     Una tarea por sesión: /clear entre tareas (marco, Fase 5). Diseño técnico de cada una: plan.md. -->

Rama: `feat/001-fundacion-tecnica`, creada desde `main` antes de T2.

- [x] T1 · Documentación derivada del plan: ADR-012, regla 9 con las cifras del perfil, `stack.md`, preguntas abiertas y límites de CA-10 y CA-18 en la spec, roadmap — archivos: `docs/02-arquitectura/decisiones/ADR-012-herramientas-verificacion.md`, `docs/02-arquitectura/constitution.md`, `docs/02-arquitectura/stack.md`, `spec.md`, `docs/04-roadmap.md` — cubre: regla 8, regla 9 — verificar: revisión (hecho en la sesión de planificación)
- [ ] T2 · Proyecto base: `package.json` con `packageManager` y scripts, `astro.config.mjs`, `tsconfig.json` estricto, `.gitignore`, instalación con `pnpm install` y aprobación de builds, página mínima — archivos: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/pages/index.astro`, `pnpm-lock.yaml` (generado) — cubre: base de CA-1 y CA-3 — verificar: `pnpm build` genera `dist/index.html` y `pnpm dev` la sirve
- [ ] T3 · Tokens, Tailwind y fuentes; `BaseLayout` con idioma, título y descripción; §12.1 actualizado en el mismo commit — archivos: `src/styles/globals.css`, `src/layouts/BaseLayout.astro`, `astro.config.mjs`, `docs/03-diseno/sistema-diseno.md` — cubre: CA-4, CA-5, CA-6, CA-9 — verificar: `pnpm build`; número de archivos de fuente en `dist/` ≤ 6; `grep -c "color-red" dist/_astro/*.css` devuelve 0
- [ ] T4 · Página provisional con los tokens y `public/_headers` con `noindex` — archivos: `src/pages/index.astro`, `public/_headers` — cubre: CA-3, CA-17 — verificar: capturas a 360 y 1440 px en el navegador integrado; `dist/_headers` existe
- [ ] T5 · ESLint, Prettier y el script `check`; formateadores del kit para `.astro`, `.mjs`, `.jsonc` y `.yml` — archivos: `eslint.config.js`, `.prettierrc.json`, `.prettierignore`, `package.json`, `.claude/hooks/hooks.config.json` — cubre: CA-1 — verificar: `pnpm check` en verde; con un error de tipos provocado, en rojo
- [ ] T6 · Comprobación de literales: lógica pura, ejecutable y pruebas; integrada en `pnpm check` — archivos: `scripts/lib/find-literals.mjs`, `scripts/check-literals.mjs`, `vitest.config.ts`, `tests/unit/find-literals.test.ts`, `package.json` — cubre: CA-7 — verificar: `pnpm test -- find-literals`; provocación 1 (`bg-[#fff]` → `pnpm check` falla con archivo y línea)
- [ ] T7 · Prueba de tokens (usa el `vitest.config.ts` de T6): sincronía documento–CSS, reinicios y matriz de contraste — archivos: `tests/unit/design-tokens.test.ts` — cubre: CA-5, CA-8 — verificar: `pnpm test -- design-tokens`; provocación 2 (`--color-fg-subtle` a `#5A5E69` → falla con el par y el ratio)
- [ ] T8 · Pruebas de navegador: idioma y metadatos, peticiones solo del propio origen, fuentes, movimiento reducido, accesibilidad, paleta por defecto ausente — archivos: `playwright.config.ts`, `tests/e2e/foundation.spec.ts`, `package.json` — cubre: CA-4, CA-5, CA-6, CA-9 — verificar: `pnpm build && pnpm test:e2e`
- [ ] T9 · Presupuesto de rendimiento: `lighthouserc.json` con el perfil fijado, script de tamaños con gzip y sus pruebas — archivos: `lighthouserc.json`, `scripts/lib/size-budget.mjs`, `scripts/check-size-budget.mjs`, `tests/unit/size-budget.test.ts`, `package.json` — cubre: CA-11 — verificar: `pnpm test -- size-budget`; `pnpm perf` en verde; provocación 3 (script en línea de más de 180 kB → falla por tamaño y tiempo de bloqueo)
- [ ] T10 · Hook de git versionado y ejecutable, activado por `prepare` — archivos: `.githooks/pre-commit`, `package.json` — cubre: CA-12 — verificar: provocación 4 (aserción rota → `git commit` bloqueado); anotar cuánto tarda el hook
- [ ] **Antes de T11, lo hace Adrián con guía paso a paso**: repositorio privado vacío en GitHub; cuenta de Cloudflare y subdominio `workers.dev`; token de API con la plantilla «Edit Cloudflare Workers» e identificador de cuenta; secretos `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` en el repositorio; `git remote add origin`
- [ ] T11 · `wrangler.jsonc`, trabajo `verify` y `deploy-production` en `ci.yml`, acciones fijadas por SHA; primer empuje a `main` — archivos: `wrangler.jsonc`, `.github/workflows/ci.yml`, `package.json` (dependencia `wrangler`) — cubre: CA-10, CA-14, CA-15, CA-20 — verificar: integración continua en verde en `main`; la dirección de producción responde; `curl -sI` muestra `x-robots-tag: noindex`; provocación 5 (propuesta con prueba en rojo → rojo y sin despliegue)
- [ ] T12 · Trabajo `deploy-preview` con comentario en la propuesta; ejercicio de vuelta atrás — archivos: `.github/workflows/ci.yml` — cubre: CA-13, CA-16, CA-17, CA-18 — verificar: propuesta con comentario y URL de previsualización con `noindex`; `pnpm rollback` sirve la versión anterior y se vuelve a publicar la actual
- [ ] T13 · README del proyecto en lugar del del kit (instalar, ejecutar, probar, publicar, volver atrás, secretos necesarios, coste) y comandos en `CLAUDE.md` — archivos: `README.md`, `CLAUDE.md` — cubre: CA-2, CA-19, CA-20 — verificar: `git clone` en una carpeta nueva del directorio temporal, siguiendo solo el README → instala, construye y pasa las pruebas
- [ ] T14 · Verificación end-to-end de `plan.md`, `/code-review` sobre la rama, tabla de convergencia de la spec completa, roadmap y `ACTIVA.md` actualizados, integración a `main` — cubre: CA-1 a CA-20 — verificar: los 20 criterios con evidencia en la tabla de convergencia

## Registro

| Tarea | Commit | Notas |
|---|---|---|
| T1 | commit `docs:` del plan de 001 | Hecha en la sesión de planificación, junto con `plan.md` y este archivo |
