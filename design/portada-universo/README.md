# Portada de referencia · The Universe + Mission Control

Diseño de la portada hecho con Claude Design el 2026-09-26. Es la **referencia visual** del sitio: cabecera, hero con fondo estrellado, vistas de proyectos, servicios, resultados, contacto, pie de telemetría y consola.

| Archivo | Qué es |
|---|---|
| `portada-universo.dc.html` | El diseño, tal como salió de Claude Design (sin modificar) |
| `support.js` | Runtime de Claude Design que necesita el diseño para mostrarse |
| `miniatura.webp` | Miniatura de la exportación |

## Cómo verlo

Desde Git Bash, en esta carpeta:

```bash
python -m http.server 8766 --bind 127.0.0.1
```

y abrir `http://127.0.0.1:8766/portada-universo.dc.html` en el navegador.

## Cómo se usa

- **No es código del sitio.** Es una referencia: el sitio se construye con los tokens y componentes de `docs/03-diseno/sistema-diseno.md`.
- Las decisiones que se tomaron al revisarlo y las **diez correcciones obligatorias** están en `sistema-diseno.md` §14. Donde contradice los requisitos, mandan los requisitos.
- **Todos sus datos son de ejemplo e inventados**: misiones, métricas, número de WhatsApp y correo. Ninguno se publica (regla del dato, constitución 13).
