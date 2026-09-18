"""SessionStart: recuerda el proceso y la spec activa.

Lo que este hook imprime por stdout se añade al contexto de Claude al
iniciar la sesión (o tras /clear). Busca docs/specs/ACTIVA.md para
señalar la spec en curso; si no existe, solo imprime el recordatorio.
"""
from _common import PROJECT_DIR, load_config, ok

cfg = load_config()
lines = []
msg = cfg.get("session_start_message", "")
if msg:
    lines.append(msg)

activa = PROJECT_DIR / "docs" / "specs" / "ACTIVA.md"
if activa.exists():
    try:
        contenido = activa.read_text(encoding="utf-8").strip()
        if contenido:
            lines.append("Spec activa: " + contenido.splitlines()[0])
    except OSError:
        pass

if lines:
    print("\n".join(lines))
ok()
