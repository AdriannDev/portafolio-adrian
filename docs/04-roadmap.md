# Roadmap · Portafolio Adrián Marchan

<!-- Fase 4. Features priorizadas (MoSCoW) agrupadas en iteraciones. Cada feature con spec enlaza a docs/specs/NNN-*/.
     Regla del brief: si una iteración llega a su fecha sin cerrar, se reduce su alcance, no se mueve la fecha. -->

| Campo | Valor |
|---|---|
| Fecha | 2026-09-26 |
| Iteraciones | 6, de 2 semanas; cierre en sábado |
| Lanzamiento previsto | 2026-12-19 (cierre de la iteración 6) |
| Primer recorte si hace falta | 014 y luego 013 (Should). Nunca un Must. El fondo estrellado está en la 003 (Must): no se recorta, se optimiza |
| Referencia visual | Portada en `design/portada-universo/` y sus correcciones (`sistema-diseno.md` §14) |

## Cómo se ordenó

1. **Dependencias técnicas primero**: nada se construye sin la fundación (001) ni sin el modelo de contenido (002).
2. **Después, el flujo que el sitio debe optimizar por encima de todos** (Persona 1, flujo 1): la iteración 2 lo deja funcionando de extremo a extremo.
3. **Después, por valor para las personas**: comprobar (It3), contactar y confiar (It4), encontrar y explorar (It5).
4. Los dos Should (013, 014) van al final porque son los primeros candidatos a recorte.

## Iteración 1 · Cimientos verificables · cierre: 2026-10-10

**Objetivo**: un sitio que todavía no muestra nada, pero que ya se construye, se valida, se mide contra el presupuesto y se publica con cada cambio.

| # | Feature | Prioridad | Spec | Cubre | Depende de | Estado |
|---|---|---|---|---|---|---|
| 1 | Fundación técnica y verificación automática | Must | [001-fundacion-tecnica](specs/001-fundacion-tecnica/spec.md) | RNF-01 (límites), RNF-04, CA-N06.4, CA-N07.5, CA-N02.1, CA-N02.2, regla 24 | — | plan aprobado; T1 hecha |
| 2 | Modelo de contenido y reglas del dato | Must | 002-modelo-contenido | CA-N06.1, CA-N06.2, CA-05.2, CA-05.4, `modelo-datos.md` §3–§7 | 1 | pendiente |

## Iteración 2 · El flujo prioritario de Rosa · cierre: 2026-10-24

**Objetivo**: desde un móvil de 360 px se entra, se entiende qué hace Adrián y se escribe por WhatsApp, con el consentimiento y la medición ya en marcha.

| # | Feature | Prioridad | Spec | Cubre | Depende de | Estado |
|---|---|---|---|---|---|---|
| 3 | Estructura global: cabecera, pie, navegación, fondo estrellado, página de error, metadatos base, cabeceras de seguridad | Must | 003-estructura-global | CA-08.1, CA-08.3, CA-08.4, CA-13.1, CA-13.3, CA-N03.2, CA-N03.6, CA-N03.8, CA-N05.2; fondo estrellado en todo el sitio (`sistema-diseno.md` §13); correcciones 2 a 4 de la portada de referencia (§14); cabeceras de seguridad (política de contenido, `nosniff`, `Referrer-Policy`), propuestas en el plan de 001 | 1, 2 | pendiente |
| 4 | Consentimiento, medición y política de privacidad | Must | 004-consentimiento-medicion | RF-10, regla 20, ADR-011 | 3 | pendiente |
| 5 | Portada | Must | 005-portada | RF-01; secciones de la portada de referencia (`sistema-diseno.md` §14) más el modelo de trabajo (CA-01.3); correcciones 1, 5, 7 y 9 | 2, 3, 4 | pendiente |

## Iteración 3 · Casos verificables · cierre: 2026-11-07

**Objetivo**: se recorren los proyectos, se abre cualquier caso con sus métricas verificadas y se comprueba desde cuánto cuesta un servicio.

| # | Feature | Prioridad | Spec | Cubre | Depende de | Estado |
|---|---|---|---|---|---|---|
| 6 | Listado de proyectos: cuadrícula, lista, filtros y vista recordada | Must | 006-listado-proyectos | RF-03, regla 25 | 2, 3, 4 | pendiente |
| 7 | Caso de estudio y autocaso M-000 | Must | 007-caso-de-estudio | RF-04, CA-05.1, CA-05.3, RF-06 | 2, 3 | pendiente |
| 8 | Servicios | Must | 008-servicios | RF-02 | 2, 3, 7 | pendiente |

## Iteración 4 · Contacto y credibilidad · cierre: 2026-11-21

**Objetivo**: Diego audita un caso y envía el formulario; Karla revisa la trayectoria; cada visitante ve las métricas de su propia visita.

| # | Feature | Prioridad | Spec | Cubre | Depende de | Estado |
|---|---|---|---|---|---|---|
| 9 | Perfil profesional y disponibilidad | Must (RF-14: Could) | 009-perfil | RF-09, RF-14 si existe el documento | 2, 3 | pendiente |
| 10 | Formulario y canales de contacto | Must | 010-contacto | RF-07, CA-08.2, CA-08.5, CA-N02.3 a CA-N02.7, `api.md` | 3, 4 | pendiente |
| 11 | Telemetría de la sesión | Must | 011-telemetria-sesion | RF-11 | 3 | pendiente |

## Iteración 5 · Visibilidad y firma · cierre: 2026-12-05

**Objetivo**: el sitio se encuentra en los buscadores y tiene completas sus tres capas: mapa, consola y telemetría.

| # | Feature | Prioridad | Spec | Cubre | Depende de | Estado |
|---|---|---|---|---|---|---|
| 12 | SEO técnico: datos estructurados, índice de direcciones, reglas de rastreo, previsualización | Must | 012-seo-tecnico | RNF-07 | 5 a 10 | pendiente |
| 13 | Consola de comandos | Should | 013-consola-comandos | RF-12, CA-13.2 | 3, 6 | pendiente |
| 14 | Mapa de misiones y movimiento | Should | 014-mapa-y-movimiento | Vista exploratoria, CA-N03.3, CA-N03.9, `sistema-diseno.md` §6 | 6 | pendiente |

## Iteración 6 · Lanzamiento · cierre: 2026-12-19

**Objetivo**: el sitio está en producción con su dominio, las reglas de lanzamiento en verde y M-000 con su primera medición real.

| # | Feature | Prioridad | Spec | Cubre | Depende de | Estado |
|---|---|---|---|---|---|---|
| 15 | Lanzamiento: dominio, comprobación de lanzamiento, monitorización, medición real de M-000 | Must (CA-N04.4: Should) | 015-lanzamiento | RL-1 a RL-5, CA-06.2, CA-N04.4, criterio E5; redirección HTTPS explícita (CA-18 de 001) y retirada del `noindex` (CA-17 de 001) | todas | pendiente |

La iteración 6 incluye además el cierre de calidad de Tier 2: informe del `qa-tester` con todos los criterios, revisión de seguridad y DoD firmada.

## Pista de contenido

El brief lo señala como riesgo alto: sin material real no se pueden cerrar las specs de página. Dueño de todo: **Adrián**. Las fechas son el último día útil para que la spec que lo necesita no se bloquee.

| Material | Lo necesita | Fecha límite | Estado |
|---|---|---|---|
| Cuenta de GitHub con repositorio privado, y cuenta de Cloudflare | 001 | 2026-10-03 | pendiente |
| **Pedir por escrito la autorización de cada cliente** (EVOX, Tensolanas Perú, Andeccoberturas, portafolio de fotografía, portafolio de publicidad). Tarda en llegar: pedirla ya | 007 | 2026-10-10 (pedida) | pendiente |
| Email público y perfiles profesionales (LinkedIn, GitHub) | 003 | 2026-10-10 | pendiente |
| Propiedad de analítica y contenedor del gestor de etiquetas | 004 | 2026-10-17 | pendiente |
| Declaración de posicionamiento definitiva (máx. 120 caracteres) y su palabra de énfasis; frase y tres entregables de cada área; qué entrega cada etapa del modelo de trabajo | 005 | 2026-10-17 | pendiente |
| Capturas de cada proyecto: portada 16:10 y galería | 006, 007 | 2026-10-24 | pendiente |
| Borrador de cada caso con las cinco secciones obligatorias; métricas con su evidencia archivada (`EV-…`) | 007 | 2026-10-31 | pendiente |
| Nombre público de MISSION 000 y firma visual (callsign) | 007 | 2026-10-31 | pendiente |
| Precios «desde» por servicio y por forma de contratación; seis o más preguntas frecuentes | 008 | 2026-10-31 | pendiente |
| **Dominio definitivo**: el servicio de correo exige un dominio verificado para enviar | 010 | 2026-11-07 | pendiente |
| Tramos de presupuesto del formulario | 010 | 2026-11-07 | pendiente |
| Retrato (sesión de fotos), trayectoria, 4–6 principios, herramientas por etapa | 009 | 2026-11-14 | pendiente |
| Currículum imprimible (Could) | 009 | 2026-11-14 | pendiente |
| 3–5 consultas locales objetivo (criterio E4), con investigación de palabras clave | 012 | 2026-11-28 | pendiente |

Con esta tabla, todas las preguntas abiertas del brief tienen dueño y fecha.

## Trazabilidad de flujos (Gate 3)

Cada flujo de `usuarios.md` tiene página o endpoint y la spec que lo cierra de extremo a extremo.

| Flujo | Recorrido | Spec que lo cierra | Iteración |
|---|---|---|---|
| Persona 1 · 1 · Descubrir y contactar rápido | `/` → WhatsApp | 005 (con 003) | 2 |
| Persona 1 · 2 · Comprobar antes de escribir | `/` → `/projects/[slug]` → sitio del proyecto | 007 | 3 |
| Persona 1 · 3 · Verificar precio | `/services` | 008 | 3 |
| Persona 2 · 1 · Auditar el criterio técnico | `/services` → `/projects/[slug]` → `/contact` → `POST /api/contact` | 010 | 4 |
| Persona 2 · 2 · Verificar coherencia | `/projects/m-000-…` y telemetría de sesión en el pie | 011 | 4 |
| Persona 2 · 3 · Navegar con teclado | Consola de comandos, desde cualquier página | 013 | 5 |
| Persona 3 · 1 · Evaluación rápida | `/about` y currículum | 009 | 4 |
| Operador · 1 y 2 · Publicar un proyecto, actualizar disponibilidad | Archivos de `content/` | 002 | 1 |

## Backlog (sin iteración)

| Feature | Prioridad | Notas |
|---|---|---|
| Descarga del currículum (RF-14) | Could | Dentro de 009 solo si el documento existe al empezarla |
| Imágenes de previsualización generadas en el build | Could | Se decide en 012: añade dependencia y, por tanto, ADR |
| Lab y Journal | Won't (esta versión) | El brief exige 3 o más entradas reales antes de publicar la sección |
| Versión en inglés | Won't (esta versión) | Fuera de alcance en el brief |
| Páginas individuales por servicio | Won't (esta versión) | v1.1, cuando haya inversión en anuncios que las justifique |
| Elementos tridimensionales y sonido | Won't | Prohibidos por la regla 26 |

## Ruta corta (cambios sin spec)

<!-- Cambios que caben en una frase y se hicieron con plan mode directo. Fecha, qué, commit. -->
| Fecha | Cambio | Commit |
|---|---|---|
| 2026-09-26 | Regla 19 de la constitución corregida con ADR-011 (almacenamiento funcional) | commit de la Fase 4 |
| 2026-09-26 | `CLAUDE.md`: el repositorio remoto se crea en la It1; gotcha de `grep -c $'\r'` en Git Bash | commit de la Fase 4 |
| 2026-09-26 | Borradas las specs de ejemplo del kit (`001-ejemplo-web-auth`, `002-ejemplo-pipeline-etl`): ocupaban la numeración real | commit de la Fase 4 |
| 2026-09-26 | Portada de referencia incorporada: automatización en lugar de publicidad de pago, fondo estrellado global, correcciones en `sistema-diseno.md` §14 | commit de la portada de referencia |
