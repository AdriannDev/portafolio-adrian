# Hooks del kit

Scripts en Python (sin dependencias) que Claude Code ejecuta en eventos del ciclo de vida. Se registran en `.claude/settings.json`; se configuran en `hooks.config.json` (no toques los scripts salvo para añadir comportamientos).

| Script | Evento | Qué hace | Cómo se desactiva |
|---|---|---|---|
| `block-destructive.py` | `PreToolUse` Bash/PowerShell | Bloquea `rm -rf`, `git push --force`, `git reset --hard`, `drop table`… | Vaciar `destructive_patterns` |
| `protect-files.py` | `PreToolUse` Edit/Write | Bloquea edición de `.env*`, secretos, lockfiles, `.git/` | Vaciar `protected_patterns` |
| `format-file.py` | `PostToolUse` Edit/Write | Formatea el archivo con la herramienta del lenguaje si está instalada (sin shell; en `formatters` usa `/` en las rutas) | `"format_on_edit": false` |
| `pre-commit-tests.py` | `PreToolUse` Bash/PowerShell (actúa solo si el comando contiene `git commit`) | Ejecuta tests rápidos y bloquea el commit si fallan | Dejar `pre_commit_test_command` vacío (así viene) |
| `session-start.py` | `SessionStart` | Recuerda el proceso e indica la spec activa (`docs/specs/ACTIVA.md`) | Vaciar `session_start_message` |

Requisitos: Python 3.8+ en el PATH (`python`). En Windows los hooks corren en Git Bash; si no hay Git Bash, en PowerShell; en ambos casos el comando `python "$CLAUDE_PROJECT_DIR/.claude/hooks/x.py"` funciona.

Probar un hook a mano:

```bash
echo '{"tool_input":{"command":"git push --force origin main"}}' | python .claude/hooks/block-destructive.py; echo "exit=$?"
```

Debe imprimir `BLOQUEADO…` y `exit=2`.

Ver los hooks cargados en sesión: `/hooks`. Apagar todos: `"disableAllHooks": true` en settings.
