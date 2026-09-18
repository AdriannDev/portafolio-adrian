"""PreToolUse (Bash|PowerShell): tests rápidos antes de commitear.

El propio script comprueba que el comando contiene "git commit"; para el
resto de comandos sale en silencio.

Se activa solo si `pre_commit_test_command` en hooks.config.json no está
vacío (p. ej. "npm test -- --run" o "pytest -q -x"). Si los tests fallan,
bloquea el commit y muestra el final de la salida a Claude para que corrija.
Recomendado en Tier 2 y 3.
"""
import subprocess

from _common import PROJECT_DIR, block, load_config, ok, read_event

cfg = load_config()
test_cmd = (cfg.get("pre_commit_test_command") or "").strip()
if not test_cmd:
    ok()

event = read_event()
command = str(event.get("tool_input", {}).get("command", ""))
if "git commit" not in command:
    ok()

try:
    result = subprocess.run(test_cmd, shell=True, cwd=PROJECT_DIR, timeout=280, capture_output=True, text=True)
except subprocess.TimeoutExpired:
    block(f"los tests ('{test_cmd}') superaron el tiempo límite. Reduce el alcance del comando o el timeout.")
except OSError as exc:
    block(f"no se pudo ejecutar '{test_cmd}': {exc}")

if result.returncode != 0:
    tail = (result.stdout + result.stderr)[-3000:]
    block(f"los tests fallaron antes del commit (comando: {test_cmd}).\n{tail}")
ok()
