"""PostToolUse (Edit|Write): formatea el archivo recién editado.

Busca la extensión en `formatters` de hooks.config.json y ejecuta el
comando si la herramienta está instalada. Si no lo está, no hace nada
(exit 0) para no molestar en proyectos que aún no eligieron stack.

El comando se ejecuta como lista de argumentos, sin shell: así las rutas
con espacios, paréntesis o corchetes (p. ej. `src/app/(auth)/page.tsx`)
llegan intactas al formateador tanto en Windows como en POSIX.
"""
import shlex
import shutil
import subprocess
from pathlib import Path

from _common import PROJECT_DIR, load_config, normalize, ok, read_event

cfg = load_config()
if not cfg.get("format_on_edit", True):
    ok()

event = read_event()
file_path = normalize(str(event.get("tool_input", {}).get("file_path", "")))
if not file_path:
    ok()

ext = Path(file_path).suffix.lower()
template = cfg.get("formatters", {}).get(ext)
if not template:
    ok()

# La plantilla se parte en tokens ANTES de sustituir {file}: la ruta nunca se re-parsea.
try:
    args = [tok.replace("{file}", file_path) for tok in shlex.split(template)]
except ValueError:
    ok()  # plantilla mal escrita: no bloquear la edición por esto
if not args:
    ok()
exe = shutil.which(args[0])
if exe is None:
    ok()  # herramienta no instalada: silencio

try:
    subprocess.run([exe, *args[1:]], cwd=PROJECT_DIR, timeout=50, capture_output=True)
except (subprocess.TimeoutExpired, OSError):
    pass
ok()
