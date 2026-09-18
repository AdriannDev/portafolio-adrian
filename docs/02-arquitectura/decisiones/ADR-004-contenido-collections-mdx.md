# ADR-004 · El contenido vive en archivos MDX versionados, validados con esquemas Zod en el build

- Fecha: 2026-09-18
- Estado: Aceptado
- Decide: Adrián Marchan
- Fase: 2 (arquitectura)

## Contexto

CA-N06.1 exige poder añadir o corregir un proyecto, un servicio o el estado de disponibilidad editando solo contenido, sin tocar la programación. CA-N06.2 exige que el proceso de publicación rechace el contenido que no cumpla la estructura definida. RF-05 exige que una métrica sin marca de verificación y sin referencia a su evidencia **no se publique** (CA-05.2): esa regla debe ser estructural, no un recordatorio.

## Opciones consideradas

| Opción | Ajuste | Mantenibilidad | Costo | Validación | Notas |
|---|---|---|---|---|---|
| **A · Content Collections nativas + MDX + Zod** | 5 | 5 | 5 | 5 | El contenido se versiona con el código; los tipos se generan en el build; el build falla si el esquema no se cumple |
| B · Gestor de contenido externo | 3 | 4 | 2 | 3 | Otro servicio que pagar y mantener; el contenido deja de versionarse con el código |
| C · Datos en archivos JSON o YAML sin validar | 3 | 2 | 5 | 1 | No cumple CA-N06.2 ni CA-05.2 |

## Decisión

Opción A. Cada tipo de contenido (proyecto, servicio, estado del sitio) tiene un esquema Zod que define sus campos obligatorios. El esquema de métrica exige fuente, periodo, marca de verificación y referencia a la evidencia; una métrica sin marca de verificación no se renderiza en producción. El proceso de construcción falla si algún archivo no cumple su esquema.

## Consecuencias

- Positivas: CA-05.2 deja de depender de la disciplina y pasa a ser imposible de incumplir sin que falle el build; los tipos del contenido están disponibles en el editor.
- Negativas: publicar contenido exige conocer el formato y hacer una publicación; la evidencia de las métricas se guarda fuera del repositorio publicado y su custodia es manual (CA-05.4).
- Revisar el: si el volumen de contenido crece hasta hacer incómoda la edición en archivos.

## Efecto en el proyecto

- Constitución: regla de contenido validado y regla del dato verificado.
- Estructura del repositorio: carpeta `content/` fuera de `src/`.
