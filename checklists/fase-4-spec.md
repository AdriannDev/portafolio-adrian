# Gate 4 · Spec aprobada (por feature)

## spec.md
- [ ] Objetivo en una frase; historias con persona, acción y beneficio.
- [ ] Criterios de aceptación numerados (CA-n) en EARS; cada uno verificable por test o QA.
- [ ] Casos borde listados (vacío, inválido, duplicado, límites, permisos, sin conexión).
- [ ] Fuera de alcance explícito. Dependencias identificadas.
- [ ] Preguntas abiertas resueltas o con dueño y fecha.
- [ ] Ninguna decisión tecnológica dentro de spec.md.
- [ ] No contradice la constitución ni los requerimientos (trazabilidad actualizada en `requerimientos.md`).

## plan.md (escrito en plan mode)
- [ ] Autocontenido: una sesión nueva puede implementarlo sin leer la conversación.
- [ ] Tabla de archivos afectados completa; patrón existente de referencia indicado.
- [ ] Dependencias nuevas justificadas (y ADR si son estructurales).
- [ ] Estrategia de pruebas acorde al tier; datos de prueba definidos.
- [ ] Verificación end-to-end escrita como comandos/pasos concretos.

## tasks.md
- [ ] Tareas ≤ 2 h, ordenadas por dependencia; `[P]` marcadas donde haya paralelismo real.
- [ ] Cada tarea indica archivos, criterios que cubre y comando/forma de verificación.
- [ ] Última tarea = verificación e2e + revisión + convergencia.

## Antes de implementar
- [ ] `docs/specs/ACTIVA.md` apunta a esta spec.
- [ ] Rama `feat/NNN-nombre` creada desde `main` actualizado.
- [ ] `/clear`: la implementación empieza en sesión limpia.
