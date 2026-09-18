# Plan 002 · Pipeline diario de ventas

<!-- EJEMPLO. Stack supuesto: Python 3.12 con uv, polars para transformación, pydantic para validación, SQLAlchemy + PostgreSQL, openpyxl para Excel, typer para CLI. -->

## Resumen del enfoque
Un solo paquete Python (`ventas_pipeline`) con etapas puras y separadas: **descubrir** archivos → **leer** (detección de codificación y separador) → **validar** fila a fila (pydantic) → **consolidar** (polars) → **escribir** (Excel + BD en una transacción) → **notificar**. La CLI (`typer`) expone `ejecutar --fecha`. La idempotencia se logra borrando e insertando las filas del día dentro de una transacción (clave tienda+fecha+producto). Las alertas van por SMTP con un módulo mínimo. Programación externa (cron / Programador de tareas) llamando a la CLI.

## Archivos afectados
| Archivo | Acción | Qué cambia |
|---|---|---|
| pyproject.toml | crear | dependencias: polars, pydantic, sqlalchemy, psycopg, openpyxl, typer |
| src/ventas_pipeline/__init__.py | crear | |
| src/ventas_pipeline/config.py | crear | rutas, tiendas, umbral 5 %, SMTP desde env (pydantic-settings) |
| src/ventas_pipeline/descubrir.py | crear | localiza `entrada/AAAA-MM-DD/tienda-*.csv`; reporta ausentes |
| src/ventas_pipeline/leer.py | crear | detecta codificación (utf-8 → latin-1) y separador; devuelve DataFrame crudo |
| src/ventas_pipeline/validar.py | crear | modelo `FilaVenta` (pydantic); separa válidas/rechazadas con motivo |
| src/ventas_pipeline/consolidar.py | crear | agregados por tienda y producto (polars) |
| src/ventas_pipeline/escribir.py | crear | Excel (2 hojas) + upsert transaccional en `ventas_diarias` |
| src/ventas_pipeline/notificar.py | crear | email SMTP para alertas |
| src/ventas_pipeline/cli.py | crear | `ejecutar --fecha AAAA-MM-DD` (por defecto ayer) |
| migrations/001_ventas_diarias.sql | crear | tabla con clave única (tienda, fecha, producto) |
| tests/fixtures/*.csv | crear | 3 tiendas × casos: normal, vacío, latin-1, `;`, con errores, > 5 % errores |
| tests/test_*.py | crear | unitarios por etapa + integración con BD de prueba |
| scripts/programar.md | crear | cómo registrar la tarea diaria en Windows y en cron |
| .env.example | crear | `DATABASE_URL`, `SMTP_*`, `ALERTA_EMAIL` |
| README.md | modificar | ejecución manual y reejecución |

## Diseño técnico
- Datos: tabla `ventas_diarias(tienda text, fecha date, producto text, unidades int, importe_centimos bigint, PRIMARY KEY (tienda, fecha, producto))`. Importes en céntimos (constitución regla 17).
- Interfaz: CLI `ventas ejecutar [--fecha AAAA-MM-DD] [--sin-alertas]`. Código de salida 0 éxito, 1 abortado por calidad, 2 error inesperado.
- Lógica: cada etapa es una función pura que recibe y devuelve datos (DataFrames o listas); `cli.py` las encadena y captura excepciones para CA-9. Escritura: primero Excel a archivo temporal, luego transacción BD, luego renombrar el Excel (sin parciales).
- Validación (`FilaVenta`): `producto: str` no vacío, `unidades: int ≥ 0`, `importe: Decimal ≥ 0`, `fecha == fecha objetivo`. Motivos de rechazo normalizados: `importe_no_numerico`, `fecha_fuera_de_dia`, `producto_vacio`.
- Alertas: una función `alertar(asunto, cuerpo)`; en tests se sustituye por un doble que registra llamadas.
- Errores: logging estructurado (JSON) con los conteos de CA-7; excepciones inesperadas → alerta + exit 2.

## Patrones existentes a seguir
- Proyecto nuevo. Convención: `src/` layout, tests con pytest, `ruff` para lint/format, tipado estricto (pyright) — definidos en CLAUDE.md.

## Dependencias nuevas
| Paquete | Motivo | Alternativa descartada | ADR |
|---|---|---|---|
| polars | rápido, sin índice implícito | pandas (válido; polars por rendimiento CA-8) | ADR-004 |
| pydantic + pydantic-settings | validación y config | validación manual | — |
| sqlalchemy + psycopg | BD | consultas crudas | ADR-004 |
| openpyxl | escribir Excel | xlsxwriter | — |
| typer | CLI | argparse | — |

## Estrategia de pruebas (Tier 2)
- Unitarias por etapa con fixtures pequeñas: detección de codificación/separador; validación (cada motivo de rechazo); consolidación (totales conocidos); umbral 5 % (4,9 % pasa, 5,1 % aborta).
- Integración: ejecución completa contra PostgreSQL de prueba (docker o BD local) con las 3 tiendas; idempotencia (dos ejecuciones → mismas filas); tienda ausente → informe parcial + alerta registrada.
- Rendimiento: fixture generada de 50 000 filas × 3 → < 2 min (marcado `@pytest.mark.slow`).
- QA manual (`qa-tester`): ejecutar la CLI con las fixtures y abrir el Excel resultante; comprobar hojas y totales.

## Verificación end-to-end
```
uv run ventas ejecutar --fecha 2026-09-14        # con fixtures copiadas a entrada/2026-09-14/
→ salida/ventas-2026-09-14.xlsx existe, hoja Resumen con 3 tiendas, log con conteos
uv run ventas ejecutar --fecha 2026-09-14        # segunda vez
→ mismo Excel (hash idéntico), SELECT count(*) FROM ventas_diarias WHERE fecha='2026-09-14' no cambia
uv run pytest -q                                  # verde
```

## Fuera del plan
- Orquestador (Prefect) → cuando haya un segundo pipeline.
- Dashboard → spec futura.
