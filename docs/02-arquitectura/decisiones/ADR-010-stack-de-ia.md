# ADR-010 · Stack de IA del proyecto: subagentes y hooks del kit, inteligencia de código de TypeScript, y ningún servidor externo de contexto por ahora

- Fecha: 2026-09-18
- Estado: Aceptado
- Decide: Adrián Marchan
- Fase: 2 (arquitectura)

## Contexto

El marco exige decidir el stack de IA con el mismo rigor que el técnico y por necesidad demostrada, no por moda (documento 05, pista C). El proyecto es Tier 2, lo desarrolla una sola persona con asistencia de IA, y el entorno ya quedó verificado en la Fase 0 con cinco subagentes, cinco hooks y el complemento de revisión de seguridad instalados.

## Opciones consideradas

Por componente, en lugar de opciones globales:

| Componente | Decisión | Motivo |
|---|---|---|
| Instrucciones del proyecto | `CLAUDE.md`, por debajo de 200 líneas | Ya activo desde la Fase 0 |
| Reglas por carpeta | **No** por ahora | `CLAUDE.md` no llega al límite; se añadirán si supera 150 líneas |
| Subagentes | Los cinco del kit | Tier 2 los exige: revisión de código, revisión de seguridad, calidad y documentación |
| Hooks | Los cinco del kit; el de pruebas previas a confirmar se activará al existir el comando de pruebas | Tier 2 exige pruebas antes de confirmar cambios |
| Inteligencia de código | Complemento de TypeScript | Único lenguaje del proyecto; permite a la IA ver errores de tipo tras cada edición, que es lo que sostiene el principio de verificación |
| Revisión de seguridad continua | Instalada | Tier 2 |
| Servidores externos de contexto | **Ninguno** | No hay base de datos que consultar, ni diseño en una herramienta externa, ni errores en producción todavía. Las operaciones de repositorio se harán con la herramienta de línea de comandos de GitHub |
| Diseño | Sin conexión automatizada | El sistema de diseño llegará como tokens y componentes en documentos, no como archivo vivo |
| Habilidades propias | Ninguna todavía | Se crearán en la Fase 8 según la repetición observada |
| Modelos | Planificar y revisar con el más capaz; ejecutar tareas especificadas con el intermedio; búsqueda y resumen con el ligero | Coste real = contexto por turnos |

## Decisión

El conjunto de la tabla. Se revisará en la retrospectiva de cada iteración, añadiendo un componente solo cuando aparezca su disparador: una corrección repetida dos veces va a `CLAUDE.md`, un procedimiento repetido dos o tres veces se convierte en habilidad, algo que deba ocurrir siempre se convierte en hook, y datos que haya que copiar a mano desde otro sistema justifican un servidor externo de contexto.

## Consecuencias

- Positivas: contexto ligero y superficie de riesgo mínima; cada pieza añadida tendrá una justificación observada.
- Negativas: algunas tareas repetitivas se harán a mano antes de automatizarse, que es el precio deliberado de no configurar de más.
- Revisar el: en cada retrospectiva (Fase 8).

## Efecto en el proyecto

- `stack.md`: sección de stack de IA.
- Fase 8: catálogo de habilidades candidatas.
