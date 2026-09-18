"""PreToolUse (Bash|PowerShell): bloquea comandos destructivos.

Complementa a permissions.deny de settings.json: las reglas de permisos
comparan el texto tal como Claude lo escribe; este hook inspecciona el
comando completo (incluidos subcomandos encadenados) y bloquea si
contiene un patrón de la lista `destructive_patterns` de hooks.config.json.
"""
from _common import block, load_config, ok, read_event

event = read_event()
command = str(event.get("tool_input", {}).get("command", "")).lower()
if not command:
    ok()

cfg = load_config()
for pattern in cfg["destructive_patterns"]:
    if pattern.lower() in command:
        block(
            f"el comando contiene '{pattern}'. Si es intencional, ejecútalo tú desde tu terminal "
            "o ajusta destructive_patterns en .claude/hooks/hooks.config.json."
        )
ok()
