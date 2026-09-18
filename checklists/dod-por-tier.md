# Gate 6 · Definition of Done por tier

<!-- Marca solo la columna de tu tier (acumulativa: Tier 2 incluye Tier 1; Tier 3 incluye Tier 2). Se firma al cerrar cada iteración. Detalle en _framework/docs/04-tiers-de-calidad.md -->

Iteración: ____ · Specs incluidas: ____ · Tier: ____ · Fecha: ____

## Tier 1 · Prototipo / personal
- [ ] Lint, formato y type-check pasan (hooks activos).
- [ ] Tests unitarios de la lógica central en verde.
- [ ] Recorrido manual de los flujos principales hecho, con captura o salida guardada.
- [ ] Sin secretos en el repo; `.env.example` al día.
- [ ] `/code-review` ejecutado sobre el diff de la iteración; hallazgos de corrección resueltos.
- [ ] Cada CA de cada spec tiene evidencia en su tabla de convergencia.
- [ ] README con cómo correr. Deploy documentado (aunque sea manual).
- [ ] Specs marcadas "Convergida"; roadmap actualizado.

## Tier 2 · Producción (además de Tier 1)
- [ ] Tests de integración de los bordes (BD, HTTP, externos) y ≥ 1 E2E del flujo principal.
- [ ] Cobertura de la lógica central ≥ 80 %; test de regresión por cada bug corregido.
- [ ] Reporte de QA (`docs/qa/iteracion-NN.md`) generado por `qa-tester` con todos los CA y viewport móvil si hay UI.
- [ ] `security-guidance` activo durante la iteración; `/security-review` sobre la rama sin hallazgos altos/críticos abiertos.
- [ ] `revisor-seguridad` ejecutado; auditoría de dependencias sin críticas.
- [ ] Autenticación y autorización cubiertas por tests.
- [ ] Lighthouse (o equivalente) ≥ 80 en rendimiento y accesibilidad en páginas clave; tiempos de API medidos.
- [ ] Accesibilidad básica: teclado, etiquetas, contraste AA.
- [ ] CI en verde (lint + tests + build) en `main`; deploy automático o semiautomático.
- [ ] Monitoreo de errores configurado; backups si hay BD.
- [ ] README (correr, configurar, desplegar) + CHANGELOG actualizados.

## Tier 3 · Crítico (además de Tier 2)
- [ ] Suite E2E de todos los flujos con dinero o datos sensibles en verde.
- [ ] Tests de contrato para APIs consumidas por terceros.
- [ ] Prueba de carga básica del flujo principal con resultado dentro de RNF.
- [ ] Modelo de amenazas (`docs/seguridad/amenazas.md`) revisado en esta iteración; `.claude/claude-security-guidance.md` al día.
- [ ] Segunda pasada de seguridad con contexto fresco antes del release.
- [ ] Secretos en gestor; logs sin datos sensibles verificados.
- [ ] Plan de rollback probado; runbook de incidentes actualizado; alertas de errores y latencia activas.
- [ ] Backup restaurado en prueba durante la iteración.
- [ ] PR con `/code-review` completo por spec; ninguna fusión sin CI verde.
- [ ] Tag de versión (SemVer) y CHANGELOG del release; ADRs y arquitectura (C4) al día.

Firmado: ____ (tú) · Observaciones: ____
