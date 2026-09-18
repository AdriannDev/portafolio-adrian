# Stack · [Nombre del proyecto]

<!-- Fase 2. Se llena con la matriz de decisión (_framework/docs/05). Cada fila con decisión cerrada tiene ADR. -->

## Ponderación de criterios (1–5) para este proyecto
| Criterio | Peso | Motivo |
|---|---|---|
| Ajuste al problema | 5 | |
| Familiaridad | [ ] | |
| Madurez y mantenimiento | [ ] | |
| Ecosistema | [ ] | |
| Rendimiento | [ ] | |
| Costo de operación | [ ] | |
| Soporte de IA (LSP, docs, errores claros) | [ ] | |
| Testabilidad | [ ] | |
| Seguridad por defecto | [ ] | |
| Reversibilidad | [ ] | |

## Stack técnico
| Decisión | Elegido | Versión | Alternativas evaluadas | ADR |
|---|---|---|---|---|
| Arquitectura | | — | | ADR-001 |
| Lenguaje | | | | ADR-002 |
| Framework | | | | ADR-003 |
| Base de datos / ORM | | | | ADR-004 |
| Autenticación | | | | ADR-005 |
| Hosting / CI | | | | ADR-006 |
| Gestor de paquetes | | | | — |
| Formateador / linter | | | | — |
| Runner de tests | | | | — |

## Stack de IA
| Componente | Decisión | Motivo |
|---|---|---|
| CLAUDE.md | sí | siempre |
| Rules (.claude/rules/) | [no · sí: cuáles] | |
| Subagentes | explorador, revisor-codigo [+ revisor-seguridad, qa-tester, documentador] | según tier |
| Hooks activos | block-destructive, protect-files, format-file [+ pre-commit-tests] | según tier |
| Plugin LSP | [typescript-lsp · pyright-lsp · …] | lenguaje principal |
| security-guidance | [sí (Tier 2–3) · no] | |
| MCPs | [ninguno · github · figma · db-lectura · sentry] | necesidad demostrada |
| Skills propias | [ninguna aún · lista] | se crean en Fase 8 |
| Modelo por fase | planificar/revisar: [opus] · ejecutar: [sonnet] · subagentes de búsqueda: [haiku] | costo/calidad |
