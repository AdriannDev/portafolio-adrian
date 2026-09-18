# Gate 0 · Entorno verificado

<!-- Marca cada punto antes de pasar a la Fase 1. Se hace una vez por proyecto. -->

## Repositorio
- [ ] `git init` hecho y primer commit realizado (worktrees, `/code-review` y `security-guidance` lo necesitan).
- [ ] `.gitignore` incluye `CLAUDE.local.md`, `.claude/settings.local.json`, `.env`, `secrets/`.
- [ ] `.env.example` existe (aunque esté vacío) y `.env` no está en el repo.

## Kit copiado
- [ ] `CLAUDE.md` en la raíz con nombre, tipo de proyecto y tier provisional completados.
- [ ] `.claude/settings.json`, `.claude/hooks/*`, `.claude/agents/*` presentes.
- [ ] `docs/` con las plantillas (01-contexto, 02-arquitectura, 03-diseno, 04-roadmap, specs/000-plantilla) y `checklists/` en la raíz del proyecto.
- [ ] Ejemplos `docs/specs/001-*` y `002-*` borrados o conservados conscientemente como referencia.

## Claude Code
<!-- /context, /hooks, /agents y /doctor son comandos de la CLI interactiva. En la app de escritorio: verificar disparando los hooks y listando .claude/agents/. -->
- [ ] Al abrir Claude Code en la carpeta, `/context` muestra `CLAUDE.md` bajo *Memory files*.
- [ ] `/hooks` muestra los hooks del kit (PreToolUse, PostToolUse, SessionStart).
- [ ] `/agents` lista explorador, revisor-codigo, revisor-seguridad, qa-tester, documentador.
- [ ] Prueba de guardrail: pedir a Claude "muestra el contenido de .env" → debe ser bloqueado por permisos.
- [ ] Prueba de hook: pedir a Claude que ejecute `git push --force` (con un remoto ficticio) → bloqueado por `block-destructive`.
- [ ] `python --version` funciona en la terminal que usa Claude Code (los hooks lo necesitan).

## Plugins (según tier; se pueden completar en Fase 2)
- [ ] Tier 2–3: `security-guidance@claude-plugins-official` instalado (`/plugin install …`) o `enabledPlugins` en settings; Python ≥ 3.10 disponible.
- [ ] Tier 1: línea `enabledPlugins` de `security-guidance` eliminada de `.claude/settings.json` si no se quiere.
- [ ] Plugin LSP del lenguaje (cuando se conozca): `typescript-lsp`, `pyright-lsp`, etc., con su binario instalado.

## Preferencias personales (una sola vez por máquina, opcional)
- [ ] `~/.claude/CLAUDE.md` con preferencias globales (idioma de respuestas, estilo de commits, etc.).
