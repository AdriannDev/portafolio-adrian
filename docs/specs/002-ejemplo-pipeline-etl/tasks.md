# Tareas 002 · Pipeline diario de ventas

- [ ] T1 · Esqueleto del paquete + `pyproject.toml` + `config.py` (pydantic-settings) + `.env.example` — cubre: base — verificar: `uv run python -c "import ventas_pipeline"` y `uv run ruff check`
- [ ] T2 · Migración `ventas_diarias` con clave única — archivos: migrations/001_ventas_diarias.sql — cubre: CA-5, CA-6 — verificar: aplicar en BD de prueba y `\d ventas_diarias`
- [ ] T3 · `descubrir.py` + tests (3 presentes, 1 ausente, carpeta inexistente) — cubre: CA-1, CA-2 — verificar: `uv run pytest tests/test_descubrir.py`
- [ ] T4 [P] · `leer.py` con detección de codificación y separador + fixtures latin-1 y `;` — cubre: bordes — verificar: `uv run pytest tests/test_leer.py`
- [ ] T5 · `validar.py` (modelo `FilaVenta`, motivos normalizados, umbral 5 %) + tests por motivo y umbral — cubre: CA-3, CA-4 — verificar: `uv run pytest tests/test_validar.py`
- [ ] T6 · `consolidar.py` (polars) + tests con totales conocidos y día sin ventas — cubre: CA-5 — verificar: `uv run pytest tests/test_consolidar.py`
- [ ] T7 · `escribir.py`: Excel (2 hojas) a temporal + upsert transaccional + renombrado — cubre: CA-5, CA-6, CA-9 — verificar: test de integración con BD (dos ejecuciones → mismas filas)
- [ ] T8 [P] · `notificar.py` (SMTP) con doble para tests — cubre: CA-2, CA-4, CA-9 — verificar: test unitario del doble
- [ ] T9 · `cli.py` (`ejecutar --fecha`), logging estructurado con conteos, códigos de salida — cubre: CA-7, CA-9 — verificar: ejecución con fixtures y lectura del log
- [ ] T10 · Test de rendimiento 50 000 filas × 3 (`@pytest.mark.slow`) — cubre: CA-8 — verificar: `uv run pytest -m slow` < 2 min
- [ ] T11 · `scripts/programar.md` (Programador de tareas de Windows / cron) + README — verificar: registrar la tarea y ejecutar una vez a mano
- [ ] T12 · Verificación end-to-end del plan + `/code-review` + `revisor-seguridad` (secretos SMTP, inyección en SQL) + converger spec — verificar: tabla de convergencia completa

## Registro
| Tarea | Commit | Notas |
|---|---|---|
| T1 | | |
