"""Utilidades compartidas por los hooks del kit.

Los hooks reciben por stdin un JSON con el evento (ver
https://code.claude.com/docs/en/hooks). Este módulo lo lee, carga
hooks.config.json y expone helpers. No requiere dependencias externas.
"""
import json
import os
import sys
from pathlib import Path

# Salida siempre en UTF-8 (en Windows la consola puede usar cp1252 y corromper acentos).
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass

HOOKS_DIR = Path(__file__).resolve().parent
PROJECT_DIR = Path(os.environ.get("CLAUDE_PROJECT_DIR") or HOOKS_DIR.parent.parent).resolve()

DEFAULTS = {
    "pre_commit_test_command": "",
    "format_on_edit": True,
    "formatters": {},
    "protected_patterns": [".env", "secrets/", ".pem", ".key", ".git/"],
    "protected_exceptions": [".env.example", ".env.sample"],
    "destructive_patterns": ["rm -rf", "git push --force", "git reset --hard"],
    "session_start_message": "",
}


def load_config() -> dict:
    cfg = dict(DEFAULTS)
    path = HOOKS_DIR / "hooks.config.json"
    try:
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
        cfg.update({k: v for k, v in data.items() if not k.startswith("_")})
    except (OSError, json.JSONDecodeError):
        pass
    return cfg


def read_event() -> dict:
    """Evento JSON de stdin. Si no se puede parsear devuelve {} y el hook deja pasar
    (fallo abierto). En Tier 3 puede preferirse bloquear: cambiar el except por block().
    """
    try:
        raw = sys.stdin.read()
        return json.loads(raw) if raw.strip() else {}
    except json.JSONDecodeError:
        return {}


def normalize(path: str) -> str:
    """Rutas de Windows a formato POSIX para comparar patrones."""
    return path.replace("\\", "/")


def block(reason: str) -> None:
    """Exit 2 = Claude Code bloquea la acción y muestra la razón a Claude."""
    sys.stderr.write(f"BLOQUEADO por hook del kit: {reason}\n")
    sys.exit(2)


def ok() -> None:
    sys.exit(0)
