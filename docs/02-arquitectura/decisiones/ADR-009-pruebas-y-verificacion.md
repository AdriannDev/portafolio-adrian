# ADR-009 · La verificación combina pruebas unitarias, recorrido de navegador, accesibilidad automática y presupuesto de rendimiento en cada integración

- Fecha: 2026-09-18
- Estado: Aceptado
- Decide: Adrián Marchan
- Fase: 2 (arquitectura)

## Contexto

El proyecto es Tier 2: su Definition of Done exige pruebas de integración, al menos un recorrido completo, informe de calidad con evidencias y verificación automática antes de integrar. Los requisitos que deben quedar cubiertos son CA-N06.3 (80 % de la lógica propia y un recorrido de contacto), CA-N01.6 (los límites de rendimiento bloquean la integración), CA-N03.x (accesibilidad) y CA-N04.2 (verificación automática previa a publicar).

El principio 4 del marco exige que toda tarea tenga una comprobación ejecutable cuyo resultado la IA pueda leer. Esto no es solo control de calidad: es lo que permite trabajar con asistencia de IA sin ser la persona el detector de errores.

## Opciones consideradas

| Opción | Cobertura | Velocidad | Ajuste al tier | Notas |
|---|---|---|---|---|
| **A · Unitarias + navegador + accesibilidad + presupuesto de rendimiento** | 5 | 4 | 5 | Cuatro capas, cada una con un objetivo distinto y sin solaparse |
| B · Solo pruebas unitarias | 3 | 5 | 2 | Deja sin cubrir el recorrido de contacto, exigido por la DoD |
| C · Solo recorrido de navegador | 3 | 2 | 3 | Lento para iterar; no cubre la lógica de validación de contenido |

## Decisión

Opción A, con cuatro capas:

1. **Unitarias**: validación de esquemas de contenido, filtrado del listado, lógica del endpoint del formulario y cálculo de las métricas de sesión. Mínimo 80 % de esa lógica.
2. **Navegador**: el recorrido completo de contacto (obligatorio), la navegación principal y la página de error.
3. **Accesibilidad automática**: análisis sin violaciones críticas en las páginas principales, como parte del recorrido de navegador. No sustituye la prueba manual con teclado y lector de pantalla que exige la Fase 6.
4. **Presupuesto de rendimiento**: medición automática contra los límites de CA-N01.1 a CA-N01.5 en cada propuesta de cambio, con fallo si se superan.

Mientras se itera se ejecuta la prueba concreta de la tarea, no la suite completa.

## Consecuencias

- Positivas: cada requisito no funcional crítico tiene una comprobación ejecutable; la IA puede verificar su propio trabajo.
- Negativas: cuatro herramientas que configurar en la fundación técnica; la medición de rendimiento alarga la verificación de cada cambio.
- Revisar el: al cerrar la primera iteración, midiendo cuánto tarda la verificación completa.

## Efecto en el proyecto

- CLAUDE.md: comandos de prueba rápida y completa.
- Hooks: el comando de pruebas previas a confirmar cambios se activa al montar la fundación técnica.
