# Stack · Portafolio Adrián Marchan

<!-- Fase 2. Rellenado con la matriz de decisión (_framework/docs/05). Cada fila con decisión cerrada tiene ADR.
     Versiones verificadas con búsqueda web el 2026-09-18. -->

## Ponderación de criterios (1–5) para este proyecto

| Criterio | Peso | Motivo |
|---|---|---|
| Ajuste al problema | 5 | Sitio de contenido de 8 páginas con una sola operación de servidor; cualquier capacidad que no sirva a eso es peso muerto |
| Familiaridad | 3 | Hay tiempo para aprender (el brief no fija fecha de lanzamiento) y el proyecto es también un ejercicio de aprendizaje |
| Madurez y mantenimiento | 4 | El sitio debe vivir años con mantenimiento de una sola persona |
| Ecosistema | 3 | Las necesidades son acotadas y conocidas; no hace falta una biblioteca para cada cosa |
| Rendimiento | **5** | CA-N01.6 convierte el presupuesto de rendimiento en un límite que bloquea la integración. Es el criterio más restrictivo del proyecto |
| Costo de operación | **5** | Presupuesto declarado de ~2 USD/mes, con exigencia de uso comercial permitido |
| Soporte de IA | 4 | El proyecto se desarrolla con asistencia de IA; el tipado estático y los errores claros son lo que permite verificar |
| Testabilidad | 4 | Tier 2: la DoD exige pruebas de integración y un recorrido completo |
| Seguridad por defecto | 4 | Trata datos personales por formulario; Ley 29733 |
| Reversibilidad | 3 | Proyecto pequeño: rehacerlo costaría semanas, no meses |

Los dos criterios con peso 5 (rendimiento y costo) son los que decidieron el framework y el alojamiento, y ambos cambiaron respecto al plan previo al marco.

## Stack técnico

| Decisión | Elegido | Versión verificada | Alternativas evaluadas | ADR |
|---|---|---|---|---|
| Arquitectura | Generación en build + un endpoint de servidor | — | Renderizado por petición · aplicación de una sola página | [ADR-001](decisiones/ADR-001-arquitectura-sitio-estatico.md) |
| Framework | Astro | 7.3.1 (2026-09-03) | Next.js 16.2.10 · prueba comparativa | [ADR-002](decisiones/ADR-002-framework-astro.md) |
| Lenguaje | TypeScript en modo estricto | 6.0.3 (la mayor que admite `@astrojs/check`; 7.x aún no) | — | [ADR-002](decisiones/ADR-002-framework-astro.md) |
| Estilos y tokens | Tailwind CSS v4 con `@theme` | 4.3.2 (2026-06-29) | CSS propio con variables · estilos en JavaScript | [ADR-003](decisiones/ADR-003-estilos-tailwind.md) |
| Contenido | Content Collections nativas + MDX + esquemas Zod | nativo de Astro | Gestor externo · JSON sin validar | [ADR-004](decisiones/ADR-004-contenido-collections-mdx.md) |
| Interactividad | TypeScript sobre el DOM, sin framework de interfaz | — | Islas React · islas Svelte | [ADR-005](decisiones/ADR-005-interactividad-islas-gsap.md) |
| Animación | GSAP (gratuito desde abril de 2025, complementos incluidos) | 3.13+ | Solo CSS y transiciones nativas · sin animación | [ADR-005](decisiones/ADR-005-interactividad-islas-gsap.md) |
| Formulario | Endpoint propio + Resend + Turnstile + campo trampa | Resend: 3.000/mes, 100/día | Servicio de formularios externo · verificador con acertijos | [ADR-006](decisiones/ADR-006-formulario-correo-antibot.md) |
| Alojamiento | Cloudflare Workers con activos estáticos | 100.000 pet./día · activos ilimitados | Cloudflare Pages · alojamiento de pago | [ADR-007](decisiones/ADR-007-alojamiento-cloudflare-ci.md) |
| Integración y publicación | GitHub Actions | — | Publicación manual | [ADR-007](decisiones/ADR-007-alojamiento-cloudflare-ci.md) |
| Medición | Gestor de etiquetas + analítica de Google con consentimiento denegado por defecto | — | Analítica ligera sin cookies · sin medición | [ADR-008](decisiones/ADR-008-medicion-consentimiento.md) |
| Pruebas | Vitest + Playwright + axe (accesibilidad) + Lighthouse CI y script propio de tamaños (presupuesto de rendimiento) | — | Solo unitarias · solo navegador | [ADR-009](decisiones/ADR-009-pruebas-y-verificacion.md), [ADR-012](decisiones/ADR-012-herramientas-verificacion.md) |
| Gestor de paquetes | pnpm | 12.4.2 | npm 11.11 (instalado) · yarn · bun | — |
| Formateador y análisis estático | Prettier + ESLint con la configuración de Astro | — | Biome | [ADR-012](decisiones/ADR-012-herramientas-verificacion.md) |
| Hook de confirmación | `core.hooksPath` nativo de git con `.githooks/pre-commit` | — | husky · lefthook · hook del kit | [ADR-012](decisiones/ADR-012-herramientas-verificacion.md) |

**Coste de operación previsto**: solo el dominio. Las peticiones a activos estáticos no se cobran, el endpoint del formulario cabe holgadamente en la capa gratuita, y el servicio de correo, el verificador anti-automatización y la integración continua están en capa gratuita.

## Stack de IA

Decidido en [ADR-010](decisiones/ADR-010-stack-de-ia.md), con el principio de necesidad demostrada.

| Componente | Decisión | Motivo |
|---|---|---|
| `CLAUDE.md` | Sí, por debajo de 200 líneas | Activo desde la Fase 0 |
| Reglas por carpeta | No por ahora | Se añadirán si `CLAUDE.md` supera 150 líneas |
| Subagentes | Los cinco del kit: explorador, revisor-codigo, revisor-seguridad, qa-tester, documentador | Tier 2 los exige |
| Hooks activos | block-destructive, protect-files, format-file, session-start | Del kit, verificados en el Gate 0 |
| Hook de pruebas previas a confirmar | Sustituido por el hook nativo de git ([ADR-012](decisiones/ADR-012-herramientas-verificacion.md)); `pre-commit-tests.py` del kit queda desactivado | El hook de git también cubre las confirmaciones de Claude; activar los dos duplicaría el trabajo |
| Inteligencia de código | Complemento de TypeScript | Único lenguaje; permite a la IA ver errores de tipo tras cada edición |
| Revisión de seguridad continua | Instalada | Tier 2 |
| Servidores externos de contexto | Ninguno | Sin base de datos que consultar ni diseño en herramienta externa; las operaciones de repositorio se harán con la línea de comandos de GitHub |
| Habilidades propias | Ninguna todavía | Se crearán en la Fase 8 según repetición observada |
| Modelo por fase | Planificar y revisar: el más capaz · ejecutar tareas especificadas: el intermedio · búsqueda y resumen: el ligero | Coste real = contexto por turnos |

## Verificación de versiones

Consultado el **2026-09-18**. Las versiones se revisan al inicio de cada iteración; si alguna queda fuera de soporte, se abre un ADR de actualización.

| Pieza | Estado comprobado |
|---|---|
| Astro | 7.3.1, publicada el 3 de septiembre de 2026. Astro 6 (marzo de 2026) introdujo Content Collections con Zod, gestión nativa de fuentes, API de política de seguridad de contenido y ejecución del runtime de producción en desarrollo sobre Cloudflare Workers |
| Next.js (descartado) | 16.2.10, publicada el 1 de julio de 2026; v16 en soporte activo, v15 en mantenimiento hasta octubre de 2026 |
| Tailwind CSS | 4.3.2, publicada el 29 de junio de 2026 |
| GSAP | Gratuito al 100 % desde abril de 2025, incluidos los complementos antes de pago, con uso comercial cubierto |
| Cloudflare Workers | Capa gratuita: 100.000 peticiones al día, 10 ms de CPU por invocación, activos estáticos gratuitos e ilimitados, sin restricción de uso comercial. Paridad con Pages desde marzo de 2026 y vía recomendada para proyectos nuevos |
| Resend | Capa gratuita: 3.000 correos al mes, tope de 100 al día, un dominio verificado |
| Node.js | v24.14.1 instalada en la máquina de desarrollo |
| Gestor de paquetes | pnpm 12.4.2 activo (comprobado el 2026-09-26); npm 11.11.0 y corepack 0.34.6 también instalados |
