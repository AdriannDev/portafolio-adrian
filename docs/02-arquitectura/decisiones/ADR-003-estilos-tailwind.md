# ADR-003 · Los estilos se escriben con Tailwind CSS v4 y los tokens viven en `@theme`

- Fecha: 2026-09-18
- Estado: Aceptado
- Decide: Adrián Marchan
- Fase: 2 (arquitectura)

## Contexto

El sistema de diseño que producirá la Fase 3 entrega tokens con nombres fijos (colores semánticos, tipografía, espaciado, radios, motion, z-index). Hace falta una única fuente de verdad para esos tokens, compartida entre el diseño y el código, sin coste en tiempo de ejecución (CA-N01.4). El sitio es de tema oscuro con un solo acento, y RNF-03 exige contrastes documentados.

Verificado el 2026-09-18: Tailwind CSS 4.3.2, publicada el 29 de junio de 2026.

## Opciones consideradas

| Opción | Ajuste | Rendimiento | Fuente única de tokens | Notas |
|---|---|---|---|---|
| **A · Tailwind CSS v4 con `@theme`** | 5 | 5 | 5 | Los tokens se declaran como variables CSS y generan utilidades; cero runtime |
| B · CSS propio con variables y módulos | 4 | 5 | 4 | Control total, más código que mantener y sin utilidades consistentes |
| C · Estilos en JavaScript | 2 | 2 | 3 | Añade runtime; contradice el presupuesto de rendimiento |

## Decisión

Tailwind CSS v4 con todos los tokens declarados en `@theme` dentro de la hoja global. Los nombres de los tokens serán exactamente los que entregue el sistema de diseño de la Fase 3, sin renombrar. Ningún color se escribe literal en un componente: siempre a través de su token semántico.

## Consecuencias

- Positivas: una sola fuente de verdad; los cambios de paleta no obligan a tocar componentes; sin coste en tiempo de ejecución.
- Negativas: los nombres de token quedan acoplados al diseño; renombrarlos exige una pasada por el código.
- Revisar el: al cerrar la Fase 3, para confirmar que la lista de tokens coincide con la entregada.

## Efecto en el proyecto

- Constitución: prohibido escribir valores de color, tipografía o espaciado fuera de los tokens.
