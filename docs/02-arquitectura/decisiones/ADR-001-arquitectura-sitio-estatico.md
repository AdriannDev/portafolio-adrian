# ADR-001 · El sitio se genera en build y se sirve como archivos estáticos, con un único endpoint de servidor

- Fecha: 2026-09-18
- Estado: Aceptado
- Decide: Adrián Marchan
- Fase: 2 (arquitectura)

## Contexto

El brief impone tres restricciones que apuntan en la misma dirección: presupuesto de operación de ~2 USD/mes, ninguna necesidad de servidor de aplicación permanente (CA-N04.3) y un límite de rendimiento que bloquea la integración (CA-N01.1 a CA-N01.6). El contenido son 8 páginas y unos 6 proyectos que cambian pocas veces al mes, editados por una sola persona (CA-N06.1). La única operación que necesita servidor es el envío del formulario de contacto (RF-07), y el sistema no almacena esas consultas.

RNF-07 exige además que el contenido sea legible por buscadores sin ejecutar comportamiento en el navegador (CA-N07.1).

## Opciones consideradas

| Opción | Ajuste | Costo | Rendimiento | Soporte IA | Notas |
|---|---|---|---|---|---|
| **A · Estático en build + 1 endpoint** | 5 | 5 | 5 | 5 | El HTML ya existe cuando llega la petición; el endpoint solo vive al enviar el formulario |
| B · Renderizado en servidor por petición | 3 | 3 | 3 | 5 | Flexibilidad que este contenido no necesita; más latencia y más superficie que mantener |
| C · Aplicación de una sola página | 1 | 4 | 1 | 4 | Incompatible con CA-N07.1: el contenido dependería de ejecutar JavaScript |

## Decisión

Opción A. Todo el contenido se genera en el proceso de construcción y se publica como archivos estáticos. Se admite un único endpoint de servidor, el del formulario de contacto. Cualquier necesidad futura de renderizado por petición exige un ADR nuevo.

## Consecuencias

- Positivas: coste de servir ≈ 0, el mejor rendimiento posible, superficie de ataque mínima, contenido indexable por construcción.
- Negativas / deuda asumida: cada cambio de contenido exige una publicación nueva (aceptable: CA-N06.5 pide menos de una hora de trabajo manual). Los datos "vivos" (hora local, métricas de la sesión) se calculan en el navegador del visitante, en islas pequeñas.
- Para revertirla habría que introducir un servidor de renderizado, lo que rompería CA-N04.3.
- Revisar el: si aparece contenido que deba cambiar sin publicar (por ejemplo un panel con datos en vivo).

## Efecto en el proyecto

- Constitución: regla sobre renderizado estático por defecto.
- CLAUDE.md: se documenta que solo existe un endpoint de servidor.
