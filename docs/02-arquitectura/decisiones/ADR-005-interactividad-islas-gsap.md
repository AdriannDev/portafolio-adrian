# ADR-005 · La interactividad se escribe en TypeScript sin framework de interfaz, y la animación con GSAP

- Fecha: 2026-09-18
- Estado: Aceptado
- Decide: Adrián Marchan
- Fase: 2 (arquitectura)

## Contexto

El sitio necesita poca interactividad y muy localizada: filtros y cambio de vista del listado (RF-03), consola de comandos (RF-12, Should), métricas de la sesión y reloj local (RF-11), banner de consentimiento (RF-10), formulario (RF-07) y el mapa exploratorio de proyectos. Astro obliga a declarar cada isla, así que la elección de qué cargar en cada una es explícita y medible.

Decisión de negocio ya tomada: GSAP como biblioteca de animación, desde el inicio del proyecto. Verificado el 2026-09-18: GSAP es completamente gratuito desde abril de 2025, incluidos los complementos antes de pago (ScrollTrigger, SplitText), con uso comercial cubierto.

Presupuesto disponible: 180 kB de código comprimido en la portada (CA-N01.4). GSAP con su complemento de scroll consume del orden de 50 kB.

## Opciones consideradas

| Opción | Peso base | Ajuste | Ecosistema | Notas |
|---|---|---|---|---|
| **A · TypeScript sin framework de interfaz + GSAP** | ~50 kB | 5 | 3 | Todas las islas son código propio; la consola se implementa a mano o con una biblioteca ligera |
| B · Islas React + GSAP | ~95 kB | 4 | 5 | Permite usar `cmdk`; más de la mitad del presupuesto consumido en base |
| C · Islas Svelte + GSAP | ~55 kB | 4 | 4 | Compromiso razonable; añade un lenguaje de plantillas más al proyecto |

## Decisión

Opción A. Las islas se escriben en TypeScript sobre elementos del DOM, sin framework de interfaz. GSAP se usa para las animaciones, cargado solo en las páginas que lo necesitan. Si una isla concreta demuestra ser inmanejable así, se podrá añadir Svelte **para esa isla** mediante un ADR nuevo; React queda descartado por su coste en el presupuesto.

Regla que acompaña a la decisión: solo se animan las propiedades `transform` y `opacity`; con la preferencia de movimiento reducido activa (CA-N03.3) se suprime toda animación que no comunique un cambio de estado.

## Consecuencias

- Positivas: el presupuesto de rendimiento queda holgado; sin capas de abstracción entre el código y el DOM; GSAP sin coste de licencia.
- Negativas / deuda asumida: `cmdk` y el resto del ecosistema React no están disponibles; la consola de comandos exige implementar a mano el foco, la navegación por teclado y la accesibilidad, que es la parte difícil de ese componente. Al ser RF-12 de prioridad Should, el riesgo es acotado.
- Revisar el: al implementar la consola de comandos, midiendo cuánto código propio costó frente a los 45 kB de la alternativa React.

## Efecto en el proyecto

- Constitución: reglas de animación y de presupuesto por isla.
- CLAUDE.md: convención de que las islas son TypeScript sobre el DOM.
