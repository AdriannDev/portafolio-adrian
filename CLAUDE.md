# Portafolio Adrián · The Universe + Mission Control

## Qué es
Plataforma profesional personal de Adrián (desarrollo web, e-commerce, SEO, Google Ads, Analytics; Lima, Perú): portafolio evolutivo que presenta proyectos como "misiones", vende servicios a PYMES de Perú/LATAM y se mide a sí mismo (MISSION 000).
Brief: docs/01-contexto/brief.md · Requerimientos: docs/01-contexto/requerimientos.md
Origen (teoría previa al marco, en la raíz): plan_portfolio_universe_mission_control_v2.md (vigente; v1 superado) · design_brief_claude_design.md · design/moodboards/ (recomendación: híbrido Mission Control + tono Universe Minimal)

## Tier y proceso
- Tier: 2 (provisional; se confirma en Gate 1). Motivo: vende servicios a clientes reales, formulario con datos personales, KPIs de negocio. La DoD por tier está en checklists/dod-por-tier.md.
- Este proyecto sigue el proceso SDD del marco: spec → plan → tasks → implementar → converger.
- Spec activa: docs/specs/ACTIVA.md (actualízala al cambiar de feature).
- Antes de implementar cualquier tarea que toque más de un archivo: plan mode.
- Cada tarea termina con: tests verdes + revisión (`/code-review` o subagente revisor-codigo) + commit.

## Stack
<!-- Rellenar en Fase 2. Decisiones en docs/02-arquitectura/decisiones/ -->
- Lenguaje/framework: [ ]
- Base de datos: [ ]
- Hosting/CI: [ ]
- Gestor de paquetes: [ ] (usar siempre este, no otro)

## Comandos
<!-- Solo los que Claude no puede adivinar. Verifícalos: si un comando falla, corrige aquí. -->
- Instalar: `[ ]`
- Ejecutar en desarrollo: `[ ]`
- Tests (rápidos, para el ciclo por tarea): `[ ]`
- Tests completos: `[ ]`
- Lint / formato / type-check: `[ ]`
- Build: `[ ]`

## Convenciones
- Idioma: respuestas y documentación en español; identificadores de código en inglés; textos de UI y contenido en español (los "system labels" en inglés — SYSTEM ONLINE, MISSION, STATUS — son capa visual y nunca portan información crítica).
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`), en inglés, imperativo.
- Ramas: `main` siempre desplegable; una rama `feat/NNN-nombre` por spec.
- Estructura: [capas o módulos principales y dónde va cada cosa, en 3–6 líneas]
- Estilo: [solo lo que difiera del default del formateador]
- Tests: [runner, ubicación, convención de nombres; "prefiere ejecutar un test concreto, no toda la suite, mientras iteras"]
- Errores: [cómo se manejan y reportan los errores en este proyecto]

## Reglas del proyecto
- No editar `.env*`, lockfiles ni `secrets/` (hay hooks que lo bloquean; si hace falta, pídelo al usuario).
- No instalar dependencias nuevas sin proponerlo primero y anotar el motivo en el plan de la spec.
- Lo que la spec no pide, no se implementa; si algo falta en la spec, se actualiza la spec primero.
- Al terminar una tarea muestra evidencia: salida de tests o captura, no solo "listo".
- Al compactar, conserva siempre: lista de archivos modificados, comandos de test y la spec/tarea activa.

## Constitución
Reglas no negociables en docs/02-arquitectura/constitution.md. Léela antes de escribir una spec.

## Subagentes disponibles (.claude/agents/)
explorador (mapear código) · revisor-codigo (revisar diff vs spec) · revisor-seguridad (OWASP) · qa-tester (recorrer flujos con evidencias) · documentador (README/CHANGELOG/docs).

## Gotchas
<!-- Comportamientos no obvios del entorno: variables necesarias, puertos, servicios externos, cosas que Claude hizo mal más de una vez. -->
- [ ]
