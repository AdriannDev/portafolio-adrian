# ADR-011 · Antes del consentimiento solo se guarda en el dispositivo el almacenamiento funcional imprescindible

- Fecha: 2026-09-26
- Estado: Aceptado
- Decide: Adrián Marchan
- Fase: 4 (planificación), detectado al cerrar la Fase 3

## Contexto

La regla 19 de la constitución decía: «Sin consentimiento previo no se almacena **nada** en el dispositivo del visitante ni se envía nada a terceros». Al escribir el modelo de datos (`docs/03-diseno/modelo-datos.md` §8) apareció una contradicción con dos requerimientos Must:

- **CA-10.3** exige conservar el rechazo de la medición durante seis meses sin volver a preguntar. Para conservarlo hay que guardarlo en el dispositivo, y se guarda precisamente **sin** consentimiento.
- **CA-03.4** exige recordar la vista del listado elegida por el visitante en visitas siguientes.

Los requerimientos ya trataban este almacenamiento como legítimo: CA-10.6 obliga a declarar «el almacenamiento funcional de CA-03.4» en la política de privacidad, y CA-10.1 solo prohíbe, antes del consentimiento, los **identificadores de analítica o de publicidad** y el envío de datos a terceros. La regla 19 era más estricta que los requerimientos a los que servía, y en su literalidad era imposible de cumplir.

## Opciones consideradas

| Opción | Cumple CA-10.3 y CA-03.4 | Protección del visitante | Notas |
|---|---|---|---|
| **A · Permitir solo el almacenamiento funcional imprescindible, declarado** | sí | Alta: nada que identifique ni rastree | Alinea la regla con CA-10.1 y CA-10.6 |
| B · Mantener la regla y guardar el rechazo solo durante la sesión | no | Máxima | Incumple CA-10.3: el banner reaparecería en cada visita, que es justo la molestia que el requisito evita |
| C · Mantener la regla y no recordar la vista | no | Máxima | Incumple CA-03.4 y solo resuelve la mitad del problema |

## Decisión

Opción A. La regla 19 pasa a decir:

> Sin consentimiento previo no se almacena ningún identificador de analítica ni de publicidad en el dispositivo del visitante ni se envía nada a terceros; solo se permite el almacenamiento funcional imprescindible declarado en la política de privacidad. El rechazo se respeta seis meses.

«Funcional imprescindible» queda acotado a lo que enumera `modelo-datos.md` §8: la decisión de consentimiento (`am.consent`) y la vista preferida del listado (`am.projects-view`). Ninguno contiene identificadores, y ninguno sale del dispositivo.

## Consecuencias

- Positivas: la constitución vuelve a ser cumplible; el criterio para decidir qué se puede guardar deja de ser interpretativo, porque hay una lista cerrada.
- Negativas: añadir una clave nueva al dispositivo exige actualizar esa lista y la política de privacidad; no basta con que parezca inocua.
- Qué habría que hacer para revertirla: nada en el código mientras no existan claves; después, eliminar las claves y aceptar el incumplimiento de CA-10.3 y CA-03.4.
- Revisar el: al redactar la política de privacidad (spec de consentimiento y medición).

## Efecto en el proyecto

- Constitución: nueva redacción de la regla 19.
- `docs/03-diseno/modelo-datos.md` §8: la nota de incoherencia se sustituye por la referencia a este ADR.
- Política de privacidad: debe enumerar las dos claves funcionales (CA-10.6).
