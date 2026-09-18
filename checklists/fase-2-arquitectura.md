# Gate 2 · ADRs aprobados

## Decisiones
- [ ] Cada fila de `docs/02-arquitectura/stack.md` con decisión cerrada tiene su ADR en `decisiones/`.
- [ ] Cada ADR compara ≥ 2 opciones con los criterios ponderados y cita fuentes verificadas (versión estable, mantenimiento).
- [ ] La arquitectura elegida es la más simple que cumple los RNF (monolito modular salvo motivo).
- [ ] `arquitectura.md` tiene diagrama de contexto, contenedores y estructura de repo con reglas de dependencia.

## Constitución (`docs/02-arquitectura/constitution.md`)
- [ ] Reglas completadas y adaptadas al proyecto (≤ 30). Regla específica del dominio añadida si aplica.
- [ ] Ninguna regla contradice un requerimiento.

## Stack de IA
- [ ] Sección "Stack de IA" de `stack.md` completada: subagentes, hooks, plugin LSP, security-guidance, MCPs, modelos por fase.
- [ ] Cada MCP o plugin externo tiene motivo (necesidad demostrada) y, si es relevante, ADR.

## CLAUDE.md actualizado
- [ ] Comandos reales de instalar, ejecutar, tests rápidos, tests completos, lint, build — probados una vez.
- [ ] Convenciones (estructura, estilo, tests, errores) y gestor de paquetes fijados.
- [ ] Sigue por debajo de 200 líneas.
- [ ] `.claude/hooks/hooks.config.json`: formateadores del lenguaje activos; `pre_commit_test_command` definido si Tier 2–3.

## Diseño (si aplica Fase 3)
- [ ] Decidido si hay Fase 3 y qué artefactos produce.
