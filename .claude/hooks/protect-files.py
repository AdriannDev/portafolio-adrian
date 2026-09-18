"""PreToolUse (Edit|Write): impide editar archivos protegidos.

Bloquea .env*, secretos, claves, lockfiles y .git/ salvo las excepciones
(`protected_exceptions`, p. ej. .env.example). Claude recibe la razón y
puede pedirte que hagas el cambio a mano.
"""
from _common import block, load_config, normalize, ok, read_event

event = read_event()
file_path = normalize(str(event.get("tool_input", {}).get("file_path", "")))
if not file_path:
    ok()

cfg = load_config()
name = file_path.rsplit("/", 1)[-1]
if name in cfg["protected_exceptions"]:
    ok()

for pattern in cfg["protected_patterns"]:
    hit = file_path.endswith(pattern) if pattern.startswith(".") and "/" not in pattern else pattern in file_path
    if hit or name == pattern:
        block(
            f"'{file_path}' coincide con el patrón protegido '{pattern}'. "
            "Los secretos y lockfiles se editan a mano; pide al usuario que lo haga."
        )
ok()
