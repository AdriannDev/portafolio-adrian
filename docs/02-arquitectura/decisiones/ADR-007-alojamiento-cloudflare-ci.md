# ADR-007 · El sitio se aloja en Cloudflare Workers con activos estáticos y se publica desde GitHub Actions

- Fecha: 2026-09-18
- Estado: Aceptado
- Decide: Adrián Marchan
- Fase: 2 (arquitectura)

## Contexto

El brief fija un presupuesto de ~2 USD/mes y exige que la modalidad contratada **permita uso comercial**, porque el sitio vende servicios (CA-N04.3). Esto descartó explícitamente la recomendación de alojamiento de pago del plan v2 (§8.1). Además se exige publicación automática al integrar cambios (CA-N04.1), verificación automática previa (CA-N04.2) y posibilidad de volver a la versión anterior sin intervención manual (CA-N04.5).

Verificado el 2026-09-18: la capa gratuita de Cloudflare Workers ofrece 100.000 peticiones al día, 10 ms de CPU por invocación y **peticiones a activos estáticos gratuitas e ilimitadas**, sin cláusula que restrinja el uso comercial. Desde marzo de 2026 Workers tiene paridad de funciones con Pages para activos estáticos, renderizado en servidor y dominios propios, y Cloudflare recomienda Workers con activos estáticos para proyectos nuevos; Pages sigue soportado pero sin desarrollo nuevo.

## Opciones consideradas

| Opción | Costo | Uso comercial | Encaje con ADR-001/002 | Continuidad | Notas |
|---|---|---|---|---|---|
| **A · Cloudflare Workers con activos estáticos** | 5 | 5 | 5 | 5 | Activos ilimitados gratis; el endpoint del formulario cabe holgadamente en 100.000 peticiones diarias; es la vía que Cloudflare recomienda para proyectos nuevos |
| B · Cloudflare Pages | 5 | 5 | 5 | 3 | Equivalente hoy, pero sin desarrollo nuevo por parte del proveedor |
| C · Alojamiento de pago del plan v2 | 2 | 5 | 5 | 5 | Unos 20 USD/mes: diez veces el presupuesto declarado, sin beneficio para este caso |

## Decisión

Cloudflare Workers con activos estáticos, y GitHub Actions como proceso de verificación y publicación. El repositorio se alojará en GitHub. Cada integración en la línea principal ejecuta formato, análisis estático, pruebas y comprobación de los límites de rendimiento; si todo pasa, publica.

Como el tráfico de activos estáticos no se cobra, el único consumo medible es el endpoint del formulario, de modo que el coste de operación previsto es **solo el dominio**.

## Consecuencias

- Positivas: presupuesto cumplido con margen; uso comercial sin ambigüedad; misma plataforma para el sitio, el verificador anti-automatización y el almacenamiento efímero del límite de envíos.
- Negativas / deuda asumida: dependencia de un solo proveedor para alojamiento y protección del formulario; el límite de 10 ms de CPU por invocación obliga a que el endpoint no haga trabajo intensivo (enviar un correo es espera de red, no cálculo). El repositorio en GitHub aún no existe: crearlo es tarea previa a la Fase 7.
- Para revertirla: el sitio es estático y portable; habría que reescribir el endpoint y el proceso de publicación.
- Revisar el: si el consumo se acerca a los límites de la capa gratuita.

## Efecto en el proyecto

- CLAUDE.md: comandos de publicación y nombre del proyecto en la plataforma.
- Checklist de lanzamiento: dominio, certificado, redirecciones.
