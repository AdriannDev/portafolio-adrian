# Kit de proyecto

Plantillas listas para copiar a la raíz de cada proyecto nuevo. **No modifica nada por sí solo**: hasta que no se copia y se abre Claude Code en la carpeta destino, es inerte.

| Ruta | Qué es | Cuándo se completa |
|---|---|---|
| `CLAUDE.md` | Instrucciones persistentes del proyecto (< 200 líneas) | Fase 0 (mínimo), Fase 2 (comandos y convenciones) |
| `.gitignore` | Excluye locales, secretos y builds | Fase 0 |
| `.claude/settings.json` | Permisos (allow/ask/deny) + hooks + plugin de seguridad | Fase 0; ajustar en Fase 2 |
| `.claude/hooks/` | Scripts Python de los hooks + `hooks.config.json` | Fase 2 (formateadores, comando de tests) |
| `.claude/agents/` | Subagentes: explorador, revisor-codigo, revisor-seguridad, qa-tester, documentador | Listos; se usan desde Fase 2 |
| `.claude/claude-security-guidance.md` | Modelo de amenazas para el plugin `security-guidance` y el revisor | Fase 2 (Tier 2–3) |
| `.mcp.json.ejemplo` | Ejemplo de MCPs a nivel de proyecto | Fase 2, solo si se decide usar MCP |
| `docs/01-contexto/` | brief, requerimientos (EARS), usuarios | Fase 1 |
| `docs/02-arquitectura/` | arquitectura, stack (+ stack de IA), constitución, ADRs | Fase 2 |
| `docs/03-diseno/` | modelo de datos, API | Fase 3 (opcional) |
| `docs/04-roadmap.md` | Features priorizadas por iteración + ruta corta | Fase 4 |
| `docs/specs/000-plantilla/` | spec.md, plan.md, tasks.md | Fase 4, una copia por feature |
| `docs/specs/001-*`, `002-*` | Ejemplos completos (web con auth; pipeline de datos) | Referencia; borrar en proyectos reales |
| `docs/specs/ACTIVA.md` | Puntero a la spec en curso (lo lee el hook SessionStart) | Cada vez que se cambia de feature |
| `docs/qa/`, `docs/retros/` | Reportes de QA y retros por iteración | Fases 6 y 8 |
| `checklists/` | Gates 0, 1, 2, 4; DoD por tier; retro | Al cerrar cada fase |

Cómo copiarlo y activarlo paso a paso: `_framework/docs/07-guia-de-activacion.md`.
