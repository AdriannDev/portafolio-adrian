# ADR-002 · El sitio se construye con Astro 7 y TypeScript en modo estricto

- Fecha: 2026-09-18
- Estado: Aceptado
- Decide: Adrián Marchan
- Fase: 2 (arquitectura)

## Contexto

El plan previo al marco (`plan_portfolio_universe_mission_control_v2.md`, §8.1) eligió Next.js sobre Astro con tres argumentos: Server Actions, internacionalización y capacidad de crecer hacia aplicaciones sin migrar. **La Fase 1 invalidó dos de los tres**: el brief descarta la versión en inglés y excluye Lab y Journal del MVP. Quedó en pie una sola operación de servidor, ya acotada en ADR-001.

Al mismo tiempo la Fase 1 añadió dos restricciones que el plan no tenía: presupuesto de ~2 USD/mes y CA-N01.4, que limita el código de comportamiento de la portada a 180 kB comprimidos y **bloquea la integración** si se supera (CA-N01.6).

Verificado el 2026-09-18: Next.js 16.2.10 (LTS activo, publicada el 1 de julio de 2026) y Astro 7.3.1 (publicada el 3 de septiembre de 2026).

## Opciones consideradas

| Opción | Ajuste | Cumplir CA-N01.4 | Encaje con alojamiento | Dependencias | Soporte IA | Total |
|---|---|---|---|---|---|---|
| **A · Astro 7.3.1** | 5 | 5 | 5 | 5 | 4 | **24** |
| B · Next.js 16.2.10 | 4 | 3 | 3 | 3 | 5 | 18 |
| C · Prueba comparativa antes de decidir | — | — | — | — | — | descartada: un día de trabajo para confirmar una diferencia de arquitectura ya conocida |

Detalle de las diferencias que pesaron:

- **Presupuesto de JavaScript**: Astro no envía nada por defecto y obliga a declarar cada isla interactiva. Next.js parte de React más su propio runtime, que consumen buena parte del presupuesto antes de escribir código propio. Con GSAP ya decidido (ADR-005), esa diferencia es la que hace viable el presupuesto.
- **Alojamiento**: Astro 6 introdujo la Environment API de Vite, que ejecuta en desarrollo el mismo runtime que producción sobre Cloudflare Workers. Next.js requiere un adaptador de terceros (OpenNext) para el mismo destino.
- **Dependencias**: Astro trae Content Collections con validación Zod y gestión de fuentes de forma nativa. Con Next.js habría que añadir `content-collections` (sustituto de Contentlayer, que quedó sin mantenimiento) y `next/font`.
- **A favor de Next.js**: mejor material de apoyo para asistencia de IA y acceso directo al ecosistema React, incluido `cmdk` para la consola de comandos (RF-12, prioridad Should).

## Decisión

Astro 7 con TypeScript en modo estricto. La consola de comandos se resolverá sin React (ver ADR-005).

## Consecuencias

- Positivas: el límite de rendimiento se cumple por arquitectura y no por vigilancia; menos piezas de terceros; el runtime de producción se reproduce en desarrollo.
- Negativas / deuda asumida: `cmdk` no se usa tal cual; si en el futuro Lab necesita una aplicación React, se añadirá como isla, no migrando el sitio. Algo menos de material de referencia para la asistencia de IA que con Next.js.
- El documento `design_brief_claude_design.md` **no se ve afectado**: está escrito en tokens y componentes, es agnóstico del framework.
- Para revertirla: el contenido en MDX y los tokens en CSS son portables; habría que reescribir plantillas y endpoint.
- Revisar el: cuando se planifique Lab (v1.1) o si aparece una necesidad real de renderizado por petición.

## Efecto en el proyecto

- CLAUDE.md: comandos de instalar, desarrollar, construir, probar y verificar tipos.
- Constitución: regla de límite de JavaScript por página.
- Plugins: se instala el plugin de inteligencia de código de TypeScript (ver ADR-010).
