# Plan de Desarrollo v2.0 — "The Universe + Mission Control"

**Versión:** 2.0 (revisión de concepto, arquitectura y estructura)
**Estado:** Arquitectura definida → listo para Fase 0 y Art Direction
**Stack:** Next.js (App Router) + React + TypeScript + Tailwind CSS v4 + GSAP
**Documento complementario:** `design_brief_claude_design.md` (contexto para Claude Design: moodboards, design system, wireframes)

---

## 0. Resumen de cambios respecto a v1

| Área | v1 | v2 | Por qué |
|---|---|---|---|
| Concepto | Metáfora visual (universo + control) | Sistema de interacción con tres capas: **MAP / CONSOLE / TELEMETRY** | Un portfolio "espacial" solo estético es un cliché; la diferencia real está en cómo se usa, no en cómo se ve |
| Diferenciador | Implícito | **Telemetría real**: el sitio muestra sus propias métricas (Web Vitals de tu sesión, build, disponibilidad) y se documenta a sí mismo como **MISSION 000** | Conecta directamente con el posicionamiento Build → Measure → Optimize → Grow. Nadie más lo hace |
| Idioma | No definido (labels en inglés, público peruano) | Decisión explícita: contenido en **español** + "system labels" en inglés como capa visual; i18n preparado | Afecta SEO, Ads, copy, rutas y modelo de contenido |
| Navegación | Lista numerada | Navegación dual (Map ↔ Console) + Command palette (⌘K) + móvil como "trayectoria" | Exploración sin sacrificar eficiencia ni accesibilidad |
| Estructura de páginas | Descripción general | Blueprint sección por sección: contenido, componentes, CTA, evento de analytics y SEO por página | Es lo que Claude Design necesita para producir wireframes útiles |
| Modelo de contenido | Objeto de ejemplo | Schemas tipados (Zod) para Project, Metric, Service, Lab, Journal + protocolo de verificación de métricas | Cumple "nunca inventar métricas" de forma estructural, no como buena intención |
| Stack técnico | Lista de tecnologías | Decisiones cerradas: estilos, pipeline de contenido, formularios, analytics/consent, OG, hosting, testing, CI | Elimina ambigüedad antes de programar |
| Performance | Principios | Presupuesto numérico verificado en CI | Los principios sin números no se cumplen |
| Roadmap | 10 fases secuenciales | 8 fases con **"Content first"** al inicio y Definition of Done por fase | Sin contenido real no se puede diseñar ni medir |
| Assets | No definido | Guía por tipo, fuente, licencia, tratamiento y formato | Solicitado |
| Lab / Journal | Visibles en navegación | Ocultos hasta tener ≥ 3 entradas | Las secciones vacías destruyen credibilidad |
| Hosting | "Vercel" | Vercel **Pro** o Cloudflare Workers | El plan Hobby de Vercel prohíbe uso comercial; un portfolio que vende servicios es comercial |

---

## 1. Visión y posicionamiento

### 1.1 Idea central (se mantiene)

> Construir sistemas digitales que no solo se vean bien, sino que puedan medirse, optimizarse y evolucionar.

### 1.2 Posicionamiento en una frase

> Ingeniería digital para negocios que quieren crecer: construyo, mido y optimizo.

(Trabajar la versión final en Fase 0. Debe caber en el hero en tres líneas.)

### 1.3 Audiencias y qué necesita ver cada una

| Audiencia | Qué busca | Qué debe encontrar en < 30 s | Ruta clave |
|---|---|---|---|
| **A. Dueños / gerentes de PYMES (Perú / LATAM)** — principal en el MVP | Una web o tienda que venda; alguien confiable que responda | Proyectos reales parecidos al suyo, servicios claros, contacto inmediato (WhatsApp) | Home → Projects → Contact |
| **B. Agencias / partners** | Un desarrollador senior que entregue con calidad | Stack, proceso, casos con profundidad técnica | Services → Projects/[slug] → Contact |
| **C. Empresas tech / reclutadores** — futuro | Profundidad de ingeniería | Lab, arquitectura, decisiones técnicas | About → Lab → GitHub |

La audiencia A define el idioma (español), el tono (claro, sin jerga innecesaria: la jerga vive en la capa técnica visual) y el CTA principal (WhatsApp + formulario).

### 1.4 Objetivos medibles del propio portfolio (KPIs)

- Tasa de lead: `generate_lead` / sesiones ≥ 2 %.
- Profundidad: ≥ 40 % de las sesiones ven al menos un case study.
- Core Web Vitals en campo (CrUX): 100 % "Good" en LCP, INP y CLS.
- Orgánico: top 10 en 3–5 consultas objetivo a 6 meses (definir en Fase 0; p. ej. "desarrollo web Lima", "tienda online Perú", "agencia google ads Lima").

Estos KPIs se publican, cuando existan, en MISSION 000: el portfolio se audita a sí mismo.

---

## 2. Concepto: de metáfora visual a sistema de interacción

### 2.1 El riesgo del "portfolio espacial"

Fondos estelares, planetas 3D y tipografía futurista existen en cientos de portfolios. Si la diferencia es solo visual, el resultado será "otro portfolio espacial bonito". La diferencia tiene que estar en **cómo funciona**.

### 2.2 Definición operativa

- **The Universe** = capa de exploración: contenido organizado espacialmente, navegación no lineal, sensación de descubrimiento.
- **Mission Control** = capa de precisión: datos reales, estado, estructura, control total para el usuario.

La tensión entre ambas es la identidad: **curiosidad con rigor**.

### 2.3 Tres capas de experiencia

```text
THE MAP        →  explorar    Home: universo de misiones · Projects en modo mapa
THE CONSOLE    →  controlar   Command palette (⌘K) · modo lista · filtros · teclado
THE TELEMETRY  →  demostrar   datos reales: métricas de casos · Web Vitals de tu sesión · estado del sistema
```

**Regla:** cada página debe ser 100 % usable solo con THE CONSOLE (lista + teclado). THE MAP es la capa memorable, nunca la única vía.

### 2.4 Signature moments (priorizados por valor / costo)

| # | Momento | Dónde | Valor | Costo | MVP |
|---|---|---|---|---|---|
| 1 | **Hero "SYSTEM ONLINE"**: el statement aparece como un sistema arrancando. Es texto, no imagen → LCP rápido | Home | Alto | Bajo | ✅ |
| 2 | **Universe Map**: proyectos como nodos en órbitas por categoría; hover/focus abre una "mission card" | Home, Projects | Alto | Medio | ✅ (SVG, sin WebGL) |
| 3 | **Telemetry strip**: hora local Lima / hora del visitante, disponibilidad, versión de build | Header / Footer | Medio | Bajo | ✅ |
| 4 | **Session telemetry**: "TU SESIÓN → LCP 1.1 s · INP 40 ms · CLS 0.00", medido en vivo con `useReportWebVitals` | Console / Footer | Alto (único, honesto, demuestra expertise en medición) | Bajo | ✅ |
| 5 | **Console (⌘K / Ctrl+K)**: navegar, ir a una misión, copiar email, abrir WhatsApp, cambiar vista, cambiar idioma, descargar CV | Global | Medio | Bajo | ✅ |
| 6 | **Mission debrief**: case study con panel de telemetría fijo + secciones numeradas | Projects/[slug] | Alto | Medio | ✅ |
| 7 | **MISSION 000**: el propio portfolio como case study, con métricas reales que se acumulan en el tiempo | Projects | Alto | Bajo (es contenido) | ✅ (v0 al lanzar) |
| 8 | Transiciones de "trayectoria" entre páginas (crossfade + desplazamiento sutil) | Global | Medio | Medio | Fase 5 |
| 9 | Starfield procedural en `<canvas>` (no imagen), pausado fuera de viewport y en reduced-motion | Home | Medio | Bajo | Fase 5 |
| 10 | 404 "LOST IN SPACE" con coordenadas y ruta de regreso | 404 | Bajo | Bajo | ✅ |
| 11 | Terreno/planeta 3D con mapas topográficos reales (USGS) | About / Lab | Medio | Alto | ❌ (v2, solo si aporta) |

### 2.5 Anti-patrones (prohibidos)

- Cursor personalizado (rompe usabilidad; cliché).
- Preloader > 600 ms o no saltable. Como máximo, un "boot" breve solo en la primera visita.
- Scroll hijacking, scroll horizontal obligatorio.
- Texto sobre fondo estrellado sin capa de contraste.
- Neón, glitch, scanlines, HUD "gamer", tipografías sci-fi.
- Sonido automático (ni opt-in en MVP).
- 3D en el hero.
- Secciones vacías o "coming soon" en la navegación.
- Métricas inventadas o sin fuente.

### 2.6 Referencias

- **Estéticas (se mantienen y se afinan):** Interstellar (UI de TARS, paleta), fotografía NASA / ESA / JWST, cartografía lunar y marciana (USGS), documentos técnicos de la era Apollo, observatorios, revistas científicas, arquitectura minimalista.
- **De interacción (nuevas):** overlays de telemetría de webcasts espaciales, timelines de misión, command palettes (Linear, Raycast), sitios editoriales con navegación por índice.
- **Mood:** cinematográfico + científico + editorial + calmado. **Contención > espectáculo.**

---

## 3. Principios UX (se mantienen) + reglas duras

1. **Experiencia primero, magia después (80/20).**
2. **El universo es metáfora, no decoración.**
3. **Mobile first**: el mapa se convierte en trayectoria vertical; nada depende de hover.
4. **Regla de los 5 segundos**: en cualquier página se entiende quién eres, qué haces y cómo contactarte.
5. **Regla de la consola**: toda ruta es alcanzable por teclado y por lista, sin animación.
6. **Regla del dato**: todo número visible tiene fuente y periodo (§7.2).
7. **Regla del presupuesto**: ninguna decisión visual puede romper §8.10.

---

## 4. Idioma y localización (decisión nueva)

**Situación:** los clientes actuales son peruanos; el copy conceptual de v1 está en inglés.

**Recomendación:**

- **Idioma de contenido: español (es-PE)** en el MVP. Es el idioma de la audiencia A y del SEO/Ads local.
- **"System labels" en inglés como parte del lenguaje visual**: `SYSTEM ONLINE`, `MISSION`, `STATUS: LIVE`, `T+`, `LAT/LON`. Son universales en contexto aeroespacial y funcionan como identidad, no como idioma. Nunca llevan información crítica sin equivalente en español.
- **i18n desde el día 1** (`next-intl`, `/` = es, `/en` = inglés) **solo si** se prevé publicar en inglés en < 12 meses (audiencia C). Si no, no añadir esa complejidad ahora.
- Contenido por locale desde el inicio: `content/projects/evox.es.mdx` (+ `evox.en.mdx` cuando exista).

Decisión a cerrar en Fase 0 (§12).

---

## 5. Arquitectura de información

### 5.1 Sitemap completo con fases

```text
/                                   Home                                        MVP
├── /projects                       Índice de misiones (MAP | GRID | LIST)      MVP
│   ├── /projects/m-000-universe    MISSION 000: este portfolio                 MVP (v0)
│   ├── /projects/evox              M-001 · E-commerce
│   ├── /projects/tensolanas-peru   M-002 · Corporativa
│   ├── /projects/andeccoberturas   M-003 · Corporativa
│   ├── /projects/photography-portfolio     M-004 · Portfolio
│   └── /projects/advertising-portfolio     M-005 · Portfolio
├── /services                       Una página con anclas                       MVP
│   ├── /services/desarrollo-web    Landing individual (SEO + destino de Ads)   v1.1
│   ├── /services/ecommerce
│   ├── /services/seo
│   ├── /services/google-ads
│   └── /services/analytics
├── /about                          Perfil, trayectoria, forma de trabajar      MVP
├── /contact                        Formulario + canales directos               MVP
├── /lab                            Índice de experimentos                      v1.1 (oculto hasta ≥ 3 entradas)
│   └── /lab/[slug]
├── /journal                        Artículos                                   v2  (oculto hasta ≥ 3 entradas)
│   └── /journal/[slug]
├── /privacy                        Privacidad (GA4/Ads/formulario · Ley 29733) MVP
├── /404                            LOST IN SPACE                               MVP
├── /sitemap.xml · /robots.txt · /manifest.webmanifest                          MVP
└── /en/…                           Espejo en inglés (solo si se decide i18n)   v1.1
```

Una sola ruta para proyectos: `/projects` (no duplicar con `/work`).

### 5.2 Navegación dual

```text
Desktop
┌────────────────────────────────────────────────────────────────────────────┐
│ [MARCA / CALLSIGN]        01 PROJECTS   02 SERVICES   03 ABOUT   04 CONTACT │
│                                         LIMA 14:32 · STATUS: AVAILABLE · ⌘K │
└────────────────────────────────────────────────────────────────────────────┘

Móvil
┌──────────────────────────┐
│ [MARCA]      ● AVAIL  ≡  │   Menú full-screen: lista numerada grande,
└──────────────────────────┘   telemetría abajo, CTA de contacto fijo.
```

- Ítems numerados 01–04. Lab y Journal aparecen como 05 / 06 solo cuando existen.
- **Console (⌘K):** búsqueda y acciones (páginas, misiones, copiar email, WhatsApp, cambiar vista, idioma, CV). Botón visible en el header para quien no conoce el atajo.
- **ViewToggle** en Projects: `MAP | GRID | LIST`, persistido en `localStorage`. Default: GRID en móvil; MAP en desktop si no hay reduced-motion.

### 5.3 Flujos principales (≤ 3 clics desde Home)

1. **PYME:** Home (hero) → Universe Map → Mission EVOX → "VISIT WEBSITE" / CTA → Contact (WhatsApp).
2. **Agencia:** Home → Services (proceso) → Projects (grid) → Mission → Contact (formulario).
3. **Tech:** Home → About (trayectoria) → Lab → GitHub / Contact.

---

## 6. Estructura de páginas (blueprint)

Formato por sección: **Contenido · Componentes · Evento de analytics · Notas**.

### 6.1 Home

| # | Sección | Contenido | Componentes | Evento | Notas |
|---|---|---|---|---|---|
| 1 | **Hero** | Etiqueta `SYSTEM ONLINE` · statement de 3 líneas (≤ 8 palabras por línea) · subtítulo de posicionamiento (1 frase) · CTA primario "Explorar proyectos" y secundario "Contactar" · telemetry strip | `Hero`, `Button`, `TelemetryStrip`, `StatusIndicator` | `page_view` | El LCP es el statement (texto). Sin imagen hero. Fondo: gradiente + grain; el starfield entra en Fase 5 |
| 2 | **Universe Map** | 5–6 misiones destacadas como nodos; órbitas = categoría; nodo activo abre `MissionCard` (nombre, categoría, año, stack, 1 línea); leyenda; toggle a lista | `UniverseMap`, `OrbitRing`, `MissionNode`, `MissionCard`, `ViewToggle` | `select_mission`, `toggle_universe_view` | Móvil: `TrajectoryList` (vertical, numerada). Reduced-motion: mapa estático |
| 3 | **Capabilities** | 5 capacidades numeradas 01–05; cada una: nombre, 1 frase, 3 entregables, enlace a Services | `CapabilityList`, `CapabilityItem` | `select_capability` | Hover/focus expande; en móvil acordeón |
| 4 | **Growth Model** | BUILD → MEASURE → OPTIMIZE → GROW; qué entrega cada etapa; conecta desarrollo con crecimiento | `GrowthModel` (stepper horizontal → vertical en móvil) | — | Es la sección de posicionamiento; sin ella el sitio es "otro dev" |
| 5 | **Proof** | Solo datos verificados: nº de misiones live, años, 1–3 métricas reales; si no hay métricas, hechos (stack, herramientas, certificaciones) | `MetricGrid`, `Metric` (badge `VERIFIED` + fuente) | — | Regla del dato §7.2 |
| 6 | **About teaser** | Retrato + 3 líneas + "Leer trayectoria" | `AboutTeaser`, `Image` | — | Humaniza; la audiencia A contrata personas |
| 7 | **Closing CTA** | "¿Listo para una nueva misión?" + email + WhatsApp + enlace al formulario | `ClosingCTA`, `Button` | `contact_start` | |
| — | **Footer** | Nav, social, coordenadas (`LIMA, PE · LAT -12.046 · LON -77.043`), hora local, build (`v1.4.2 · 2026-09-14`), session telemetry (LCP/INP/CLS), legal | `Footer`, `SessionTelemetry`, `BuildInfo` | — | |

SEO: title "Adrián [Apellido] — Desarrollo web, e-commerce y analítica en Lima" (ajustar en Fase 0); schema `Person` + `ProfessionalService` + `WebSite`.

### 6.2 Projects (índice)

| # | Sección | Contenido | Componentes | Evento |
|---|---|---|---|---|
| 1 | Header | "MISSIONS" + contador (`6 MISSIONS · 4 LIVE · 2024–2026`) + intro de 1 frase | `PageHeader`, `Counter` | `page_view` |
| 2 | Controls | Filtros: categoría, servicio, año, estado · ViewToggle MAP / GRID / LIST · orden (destacado, año) | `FilterBar`, `ViewToggle` | `filter_projects` |
| 3 | Listado | Cards: ID (`M-001`), título, cliente, categoría, año, estado, roles, stack (≤ 4 tags), cover 16:10, resumen ≤ 120 caracteres | `MissionCard` / `UniverseMap` / `MissionRow` | `select_mission` |
| 4 | CTA | "¿Tu proyecto podría ser la siguiente misión?" | `ClosingCTA` | `contact_start` |

Estado vacío de filtros: `NO MISSIONS IN THIS SECTOR` + botón de reset. SEO: `CollectionPage` + `ItemList`.

### 6.3 Project detail — "Mission debrief"

```text
┌────────────────────────────────────────────────────────────────────┐
│ M-001 · SECTOR: ECOMMERCE · 2026 · STATUS: LIVE                    │
│ EVOX                                                               │
│ Una frase que resume la misión.                                    │
│ [ VISIT WEBSITE ↗ ]                                                │
│ ────────────────────── cover 21:9 ──────────────────────           │
├───────────────────────────────────────┬────────────────────────────┤
│ 01 OBJECTIVE                          │ TELEMETRY (sticky)         │
│ 02 ROLE                               │ Cliente · Sector           │
│ 03 APPROACH                           │ Rol(es)                    │
│ 04 TECHNOLOGY                         │ Stack (tags)               │
│ 05 ARCHITECTURE        (opcional)     │ Servicios aplicados        │
│ 06 EXPERIENCE          (galería)      │ Periodo                    │
│ 07 SEO                 (opcional)     │ Métricas  ✓ VERIFIED       │
│ 08 ANALYTICS           (opcional)     │ Enlaces                    │
│ 09 RESULT                             │ Índice de secciones        │
│ 10 LESSONS                            │                            │
├───────────────────────────────────────┴────────────────────────────┤
│ ← PREV MISSION                        NEXT MISSION → M-002 TENSOL  │
│ CTA de contacto                                                    │
└────────────────────────────────────────────────────────────────────┘
```

- Las secciones son opcionales: solo se renderizan las que existen en el MDX (nunca "N/A").
- Galería: imágenes con caption; opcional un vídeo corto muted (≤ 2 MB, con poster).
- Móvil: el panel de telemetría pasa a bloque colapsable bajo el header.
- Eventos: `view_project`, `click_project_external`, `view_gallery_item`.
- SEO: `CreativeWork` + `BreadcrumbList`; OG dinámico con `ImageResponse` reutilizando el estilo de `MissionCard`.

### 6.4 Services

| # | Sección | Contenido | Componentes |
|---|---|---|---|
| 1 | Header | "El servicio no termina al publicar la web" + Build / Measure / Grow | `PageHeader`, `GrowthModel` (compacto) |
| 2 | Nav de anclas (sticky) | 01 Desarrollo web · 02 E-commerce · 03 SEO · 04 Google Ads · 05 Analytics | `AnchorNav` |
| 3–7 | Un bloque por servicio | Para quién es · Qué incluye (lista) · Cómo trabajo (3–4 pasos) · Misiones relacionadas (2 cards) · Herramientas · Rango "desde" (si se decide, §12) | `ServiceSection`, `MissionCard` (compact), `ProcessSteps` |
| 8 | Formas de trabajar | Proyecto cerrado · Retainer mensual (medición + optimización) · Consultoría | `EngagementModels` |
| 9 | FAQ | 6–8 preguntas reales (plazos, precios orientativos, mantenimiento, qué necesita el cliente) | `FAQ` (schema `FAQPage`) |
| 10 | CTA | | `ClosingCTA` |

Eventos: `view_service` (por intersección de sección), `contact_start`. En v1.1 cada servicio tendrá su landing `/services/[slug]` (SEO + destino de Google Ads) reutilizando `ServiceSection`.

### 6.5 About

| # | Sección | Contenido | Componentes |
|---|---|---|---|
| 1 | Statement | Quién eres en 2 líneas + retrato tratado | `PageHeader`, `Portrait` |
| 2 | Trayectoria | Timeline "flight log": hitos (año, evento) incluyendo la dirección futura (Lab: backend, arquitectura, IA) | `Timeline` |
| 3 | Cómo trabajo | 4–6 principios (medición, claridad, performance, comunicación) | `PrincipleList` |
| 4 | Instrument panel | Stack y herramientas agrupadas por Build / Measure / Grow | `StackPanel`, `Tag` |
| 5 | Ahora | Disponibilidad, ubicación, hora, en qué estás trabajando (editable en `content/site/status.json`) | `NowBlock`, `StatusIndicator` |
| 6 | CTA + CV | Contacto y descarga de CV | `ClosingCTA`, `Button` (`download_cv`) |

Schema `Person` (`sameAs`: LinkedIn, GitHub).

### 6.6 Contact

| # | Sección | Contenido | Componentes |
|---|---|---|---|
| 1 | Header | `NEW MISSION REQUEST` + expectativa: "Respondo en 24–48 h" | `PageHeader` |
| 2 | Formulario | Nombre, email, empresa (opcional), tipo de proyecto (select), presupuesto orientativo (select, opcional), mensaje · honeypot + Turnstile | `ContactForm`, `Field`, `Select`, `Textarea` |
| 3 | Canales directos | Email (copiar al portapapeles), WhatsApp (`wa.me` con mensaje prellenado), LinkedIn | `ChannelList` |
| 4 | Ubicación | Lima, Perú · hora local · trabajo remoto | `TelemetryStrip` |

Estados: enviando → éxito (`MISSION REQUEST RECEIVED · ETA 48H`) → error con reintento. Eventos: `contact_start` (primer focus), `generate_lead` (éxito; `method: form | whatsapp | email`), `contact_error`.

### 6.7 Lab (v1.1) y Journal (v2)

- **Lab entry:** `L-001` · tipo (backend, api, architecture, automation, ai, data) · estado (experiment / active / archived) · problema · arquitectura (diagrama SVG) · decisiones · stack · repo · aprendizajes.
- **Journal post:** `J-001` · tema · tiempo de lectura · serie · MDX con código.
- Ambos comparten `EntryHeader`, `TelemetryPanel` (variante) y `Prose`.

### 6.8 404 y legales

- **404:** `LOST IN SPACE · coordenadas desconocidas` + buscador (abre la Console) + enlaces principales.
- **Privacy:** qué se mide (GA4, GTM, Ads), consentimiento, datos del formulario, contacto. Redactar en Fase 6.

---

## 7. Modelo de contenido

### 7.1 Estructura de carpetas de contenido

```text
content/
├── projects/
│   ├── m-000-universe.es.mdx
│   ├── evox.es.mdx
│   ├── tensolanas-peru.es.mdx
│   ├── andeccoberturas.es.mdx
│   ├── photography-portfolio.es.mdx
│   └── advertising-portfolio.es.mdx
├── services/
│   ├── desarrollo-web.es.mdx
│   ├── ecommerce.es.mdx
│   ├── seo.es.mdx
│   ├── google-ads.es.mdx
│   └── analytics.es.mdx
├── lab/                 (vacío en MVP)
├── journal/             (vacío en MVP)
└── site/
    ├── status.json      # disponibilidad, "now", ubicación, timezone
    ├── navigation.json
    └── seo.json         # defaults de metadata
```

### 7.2 Schemas (Zod, validados en build por content-collections)

```ts
// Métrica con procedencia obligatoria: implementa "nunca inventar métricas" a nivel de datos.
const Metric = z.object({
  label: z.string(),                        // "Tráfico orgánico"
  value: z.string(),                        // "+42 %"
  period: z.string().optional(),            // "Ene–Jun 2026"
  source: z.enum(["ga4", "gsc", "google_ads", "lighthouse", "crux", "client", "internal"]),
  verified: z.boolean().default(false),     // true solo si existe evidencia archivada
  evidence: z.string().optional(),          // ruta a captura/export en /private (no se publica)
  note: z.string().optional(),
});

const Project = z.object({
  id: z.string().regex(/^M-\d{3}$/),        // "M-001"
  slug: z.string(),
  title: z.string(),
  client: z.string().optional(),
  category: z.enum(["ecommerce", "corporate", "portfolio", "landing", "webapp", "platform"]),
  services: z.array(z.enum(["web", "ecommerce", "seo", "ads", "analytics"])),
  year: z.number().int(),
  period: z.string().optional(),            // "2025-11 → 2026-02"
  status: z.enum(["live", "in-progress", "archived", "confidential"]),
  featured: z.boolean().default(false),
  order: z.number().default(100),
  roles: z.array(z.string()),
  stack: z.array(z.string()),
  summary: z.string().max(160),
  cover: z.object({ src: z.string(), alt: z.string() }),
  gallery: z.array(z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() })).default([]),
  externalUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  metrics: z.array(Metric).default([]),
  map: z.object({ orbit: z.number().int().min(1).max(4), angle: z.number() }).optional(),
  seo: z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
});

// El cuerpo MDX usa headings fijos y opcionales:
// ## Objective · ## Role · ## Approach · ## Technology · ## Architecture
// ## Experience · ## SEO · ## Analytics · ## Result · ## Lessons
```

**Regla de publicación:** un `Metric` con `verified: false` **no se renderiza en producción**. Sin evidencia archivada no hay número en pantalla.

### 7.3 Otros tipos

- `Service`: id, slug, title, tagline, audience[], includes[], process[], tools[], relatedProjects[], faq[], priceFrom?.
- `LabEntry`: id `L-###`, type, status, problem, stack[], repoUrl?, diagram (svg), body.
- `JournalPost`: id `J-###`, title, description, date, tags[], series?, readingTime (calculado), body.
- `SiteStatus`: availability (`available | limited | unavailable`), availableFrom?, location, timezone, now (texto corto).

---

## 8. Arquitectura técnica

### 8.1 Decisiones de stack

| Capa | Decisión | Alternativa descartada | Motivo |
|---|---|---|---|
| Framework | Next.js (App Router, última estable) + React 19 + TypeScript `strict` | Astro | Astro sería más ligero para un sitio estático, pero Next permite Server Actions, OG dinámico, i18n y crecer hacia Lab/apps sin migrar |
| Estilos | Tailwind CSS v4 con tokens en `@theme` (CSS variables) | CSS Modules, CSS-in-JS | Tokens en una sola fuente compartida con el design system; cero runtime |
| Contenido | MDX + `content-collections` (schemas Zod, tipos generados en build) | Contentlayer (sin mantenimiento), CMS | Contenido versionado con el código; validación en build |
| Animación | GSAP 3.13+ (todos los plugins son gratuitos desde 2025: ScrollTrigger, SplitText…) + `@gsap/react` (`useGSAP`) | Motion (ex Framer Motion) | Timelines y scroll con una sola librería de animación |
| Universe Map | SVG + React (nodos como `<a>`), starfield en `<canvas>` 2D | Three.js / React Three Fiber | Accesible, indexable, ligero; 3D solo si un caso lo justifica (§2.4 #11) |
| Command palette | `cmdk` | Implementación propia | Accesible y probado |
| Formularios | Server Action + Zod + Resend (email) + Cloudflare Turnstile + honeypot | API route + reCAPTCHA | Sin backend propio; reCAPTCHA penaliza performance |
| Analytics | GTM vía `@next/third-parties/google` + Consent Mode v2 + `dataLayer` tipado | gtag directo | GTM es parte de la oferta de servicios; el sitio debe demostrar buenas prácticas |
| SEO | Metadata API, `sitemap.ts`, `robots.ts`, JSON-LD por página, `opengraph-image.tsx` | Plugins de terceros | Nativo de Next |
| Imágenes | `next/image` (AVIF/WebP) + blur placeholders generados en build | — | |
| i18n | `next-intl` (solo si se decide bilingüe en §12) | — | |
| Testing | Vitest (utils, schemas) + Playwright (smoke: navegación, formulario, 404; a11y con `@axe-core/playwright`) + Lighthouse CI con budgets | — | Lo mínimo que protege lo importante |
| Hosting | Vercel **Pro** o Cloudflare Workers (adaptador OpenNext) | Vercel Hobby | Hobby prohíbe uso comercial. Decidir en Fase 3 |
| Repo / CI | GitHub + Actions (lint, typecheck, build, tests, LHCI) + preview deploys por PR | — | |

### 8.2 Estrategia de renderizado

- Todo estático en build (SSG). Sin API routes en MVP.
- Único punto dinámico: la Server Action del formulario.
- Datos "vivos" del cliente (hora, Web Vitals de sesión) se calculan en el navegador en islas pequeñas (`"use client"`) que no bloquean el render.
- Datos agregados (v1.1): un cron diario (GitHub Action) consulta la GA4 Data API y escribe `content/site/telemetry.json` → commit → redeploy. Cero backend en runtime.

### 8.3 Tokens y estilos

- `src/styles/globals.css` define `@theme` con: colores semánticos (`--color-bg`, `--color-bg-elevated`, `--color-surface`, `--color-fg`, `--color-fg-muted`, `--color-accent`, `--color-line`, `--color-success`, `--color-warning`, `--color-danger`), tipografía (`--font-display`, `--font-sans`, `--font-mono`), escala fluida con `clamp()`, spacing (base 4 px), radios, z-index, motion (`--duration-*`, `--ease-*`).
- Los tokens son la **única fuente de verdad**: el design system producido en Claude Design debe entregar exactamente estos nombres (ver brief §9).
- Tema: oscuro como base. Superficies claras ("Paper") quedan reservadas para lectura larga en v2 si el diseño lo justifica; los tokens semánticos lo permiten sin refactor.

### 8.4 Arquitectura de motion (tres capas)

```text
Capa 1 · CSS      hover, focus, estados, transiciones ≤ 240 ms        → sin JS
Capa 2 · GSAP     entradas por scroll (una sola vez), timelines, hero  → useGSAP + ScrollTrigger
Capa 3 · Canvas   starfield, partículas                               → lazy, pausado fuera de viewport
```

- `MotionProvider` expone `reducedMotion` (media query + toggle manual en la Console). Con reduced-motion: capa 3 apagada, capa 2 reducida a fades de opacidad ≤ 200 ms, capa 1 intacta.
- Presupuesto: ninguna animación bloquea la interacción; parallax ≤ 8 % de desplazamiento; solo se animan `transform` y `opacity`.
- Smooth scroll (Lenis): **no** en MVP (accesibilidad e INP). Reevaluar en Fase 5 con medición real.

### 8.5 Universe Map

- Datos: `project.map.orbit` (1–4 = categoría) y `angle`; si no hay override, se distribuyen automáticamente.
- Render: `<svg>` con un `<g>` por órbita; cada nodo es `<a href="/projects/slug">` con `<title>` y `aria-label`; hover/focus muestra `MissionCard` en HTML (no dentro del SVG) posicionado con portal.
- El toggle LIST siempre está disponible como equivalente accesible.
- Móvil (< 768 px): `TrajectoryList` en lugar del SVG. Reduced-motion: sin órbitas animadas.
- Starfield: `<canvas>` con ≤ 300 partículas, `requestAnimationFrame` con throttle, `IntersectionObserver` para pausar, `devicePixelRatio` limitado a 2.

### 8.6 Formularios

`app/contact/actions.ts` → valida con Zod (mismo schema en cliente) → verifica Turnstile → envía email con Resend (plantilla "MISSION REQUEST") → devuelve estado tipado. Rate limit simple por IP. Copia al remitente opcional.

### 8.7 Analytics, consent y eventos

- GTM cargado `afterInteractive`; Consent Mode v2 con defaults `denied` para `ad_storage` / `analytics_storage` hasta consentimiento; banner mínimo (2 botones + enlace a privacy).
- `lib/analytics/events.ts`: funciones tipadas (`track.viewProject({...})`) que hacen `dataLayer.push`. Prohibido `dataLayer.push` fuera de este módulo.
- Eventos (nomenclatura GA4, `snake_case`):

```text
view_project             { project_id, project_slug, category }
click_project_external   { project_id, url }
select_mission           { project_id, source: map | grid | list | console }
toggle_universe_view     { view }
filter_projects          { filter_type, value }
view_service             { service_id }
select_capability        { capability }
open_console             { source: keyboard | button }
contact_start            { method }
generate_lead            { method: form | whatsapp | email }     ← conversión (evento recomendado GA4)
contact_error            { reason }
download_cv              {}
web_vitals               { metric, value, rating }               (opcional; alimenta MISSION 000)
```

- Conversión: `generate_lead` importada a Google Ads desde GA4. UTMs en todo enlace saliente propio.
- Search Console verificado desde el lanzamiento.

### 8.8 SEO técnico

- Metadata por ruta con `generateMetadata` y plantilla de título `%s · [Marca]`.
- JSON-LD: `Person`, `ProfessionalService` (Lima), `WebSite`, `CreativeWork` / `ItemList` (projects), `Service`, `FAQPage`, `BreadcrumbList`.
- OG dinámico por misión (`ImageResponse`): fondo, ID, título, categoría, stack — reutiliza el estilo de `MissionCard`.
- Canonical, `hreflang` (si i18n), `sitemap.ts` generado desde content-collections, `robots.ts`.
- Semántica: un `h1` por página, landmarks, `nav aria-label`, breadcrumbs en detalle.
- Keywords objetivo (Fase 0): 5–10 consultas locales para Home y Services; los posts del Journal (v2) cubren long-tail.

### 8.9 Imágenes y assets en código

- Ruta: `public/images/<área>/<slug>/<nombre>.{avif|webp|jpg}`; originales (PSD, RAW) fuera del repo.
- `next/image` con `sizes` correcto; covers 1600×1000 (16:10), galería 2400 px de ancho máximo, OG 1200×630.
- Blur placeholders generados en build (transform de content-collections o `plaiceholder`).
- Iconos: SVG inline (Lucide) con `currentColor`; glyphs propios en sprite.

### 8.10 Presupuesto de performance (verificado en CI)

| Métrica | Objetivo | Máximo |
|---|---|---|
| LCP (móvil, 4G simulado) | ≤ 2.0 s | 2.5 s |
| INP | ≤ 150 ms | 200 ms |
| CLS | ≤ 0.05 | 0.1 |
| JS inicial Home (gzip) | ≤ 150 KB | 180 KB |
| CSS (gzip) | ≤ 30 KB | 40 KB |
| Fuentes | ≤ 3 familias · ≤ 6 archivos · subset latin | 120 KB |
| Imagen más pesada above-the-fold | 0 (el hero es texto) | 200 KB |
| Lighthouse móvil | Perf ≥ 95 · A11y 100 · SEO 100 · Best Practices 100 | Perf 90 |
| Three.js en MVP | 0 KB | — |

Lighthouse CI corre en cada PR contra la preview con `budget.json`; el PR falla si se supera el máximo.

### 8.11 Accesibilidad (se mantiene) + verificación

Contraste AA (4.5:1 texto, 3:1 UI; crítico en fondo oscuro con grises) · foco visible con el color de acento · navegación por teclado incluida en el mapa · `prefers-reduced-motion` · `aria-live` en el formulario · axe en Playwright sin violaciones críticas · prueba manual con lector de pantalla antes del lanzamiento.

### 8.12 Estructura de carpetas (revisada)

```text
/
├── content/                    # §7.1 — contenido versionado, fuera de src
├── public/
│   ├── images/{projects,about,brand}/
│   └── fonts/                  # solo si no se usa next/font/google
├── src/
│   ├── app/
│   │   ├── layout.tsx          # fonts, providers, header/footer, GTM, JSON-LD global
│   │   ├── page.tsx            # Home
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       ├── page.tsx
│   │   │       └── opengraph-image.tsx
│   │   ├── services/page.tsx   # + [slug]/page.tsx en v1.1
│   │   ├── about/page.tsx
│   │   ├── contact/
│   │   │   ├── page.tsx
│   │   │   └── actions.ts      # Server Action
│   │   ├── lab/                # v1.1
│   │   ├── journal/            # v2
│   │   ├── privacy/page.tsx
│   │   ├── not-found.tsx
│   │   ├── sitemap.ts · robots.ts · manifest.ts
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # Button, Badge, Tag, Metric, StatusIndicator, Field, Select, Textarea, Prose, Image
│   │   ├── layout/             # Container, Grid, Section, PageHeader, Header, Footer
│   │   ├── navigation/         # MainNav, MobileNav, CommandPalette, ViewToggle, AnchorNav, Breadcrumbs
│   │   ├── universe/           # UniverseMap, OrbitRing, MissionNode, MissionCard, TrajectoryList, Starfield
│   │   ├── mission/            # MissionHeader, TelemetryPanel, MissionSection, Gallery, MissionPagination
│   │   ├── sections/           # Hero, Capabilities, GrowthModel, Proof, AboutTeaser, ClosingCTA, FAQ, ServiceSection, Timeline
│   │   ├── forms/              # ContactForm
│   │   ├── telemetry/          # TelemetryStrip, SessionTelemetry, LocalClock, BuildInfo
│   │   └── seo/                # JsonLd, PersonSchema, ProjectSchema…
│   ├── lib/
│   │   ├── content/            # queries: getProjects(), getProject(slug), getFeatured()
│   │   ├── analytics/          # events.ts (tipado), consent.ts, gtm.ts
│   │   ├── seo/                # metadata.ts, schema.ts
│   │   ├── motion/             # gsap.ts (registro de plugins), presets.ts
│   │   └── utils/
│   ├── hooks/                  # useReducedMotion, useLocalTime, useWebVitals, useMediaQuery
│   ├── providers/              # MotionProvider, ConsentProvider
│   ├── styles/                 # globals.css (@theme tokens), fonts.ts
│   ├── types/                  # content.ts (inferidos de Zod), analytics.ts
│   └── config/                 # site.ts, navigation.ts, env.ts (validación Zod de variables de entorno)
├── content-collections.ts
├── budget.json · lighthouserc.js
├── .github/workflows/ci.yml
└── next.config.ts · tsconfig.json · eslint.config.js · prettier
```

Eliminado respecto a v1: `app/api/` (innecesario en MVP), `components/animations/` (la animación vive junto al componente que anima) y `components/projects/` (se divide en `universe/` para el índice y `mission/` para el detalle).

---

## 9. Design System — qué debe definir el diseño

### 9.1 Tokens

| Grupo | Tokens | Guía |
|---|---|---|
| Color | `bg`, `bg-elevated`, `surface`, `surface-hover`, `fg`, `fg-muted`, `fg-subtle`, `line`, `line-strong`, `accent`, `accent-fg`, `success`, `warning`, `danger`, `overlay` | Base oscura (casi negro azulado, nunca negro puro); un solo acento. Cada par texto/fondo con ratio documentado |
| Tipografía | `font-display`, `font-sans`, `font-mono`; escala `xs … 8xl` fluida; `leading-*`; `tracking-*` (mono con tracking amplio en labels) | Display para statements; sans para cuerpo; mono para labels y datos |
| Spacing | Base 4 px: `1 … 24`; `section-y` (móvil / desktop); `container-max` (1440); `gutter` | |
| Radios | `none`, `sm` (2), `md` (4), `full` | Estética técnica → radios pequeños |
| Bordes / elevación | `line-1`, `line-2`; sin sombras difusas; elevación = borde + cambio de fondo | En fondo oscuro las sombras no se ven |
| Motion | `duration-micro` 120 · `ui` 240 · `section` 480 · `cinematic` 900; `ease-out-expo`, `ease-in-out`, `ease-linear` | |
| Breakpoints | `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536 | Defaults de Tailwind |
| Grid | 12 columnas desktop · 6 tablet · 4 móvil; gutter 24 / 16 | |
| Z-index | `base`, `sticky`, `overlay`, `modal`, `console`, `toast` | |

### 9.2 Componentes (con variantes y estados)

```text
Primitivos    Button (primary · secondary · ghost · link | sm · md · lg | loading · disabled)
              Badge (status: live · in-progress · archived · confidential · verified)
              Tag (stack · category) · Metric (value · label · source · verified)
              StatusIndicator (punto + label; pulsa solo si available)
              Field / Select / Textarea (default · focus · error · disabled) · Prose (MDX)
Layout        Container · Grid · Section (numeración opcional "01 —") · PageHeader · Header · Footer
Navegación    MainNav · MobileNav · CommandPalette · ViewToggle · AnchorNav · Breadcrumbs · MissionPagination
Universe      UniverseMap · OrbitRing · MissionNode (default · hover · focus · active)
              MissionCard (default · compact · row) · TrajectoryList · Starfield
Mission       MissionHeader · TelemetryPanel (sticky · collapsed) · MissionSection (numerada)
              Gallery (grid · single · video)
Secciones     Hero · Capabilities · GrowthModel · Proof · AboutTeaser · ClosingCTA · FAQ
              ServiceSection · ProcessSteps · Timeline · StackPanel · NowBlock
Telemetría    TelemetryStrip · SessionTelemetry · LocalClock · BuildInfo
Feedback      Toast · EmptyState ("NO MISSIONS IN THIS SECTOR") · Skeleton (solo islas cliente)
```

### 9.3 Sistema de "labels" (lenguaje visual)

Etiquetas en mono, mayúsculas, tracking amplio: `M-001`, `STATUS: LIVE`, `SYSTEM ONLINE`, `T+00:00`, `LAT -12.046 · LON -77.043`, `SECTOR: ECOMMERCE`. Se usan como **metadatos**, nunca como titulares. Glosario cerrado (≤ 20 términos) para que no degenere en decorado.

---

## 10. Assets — recomendación

| Tipo | Recomendación | Fuentes / licencia | Tratamiento | Formato |
|---|---|---|---|---|
| **Fotografía astronómica** | 3–5 imágenes "héroe" como máximo en todo el sitio (About, 404, fondos de sección). Preferir **texturas** (superficie lunar, nubes de gas, Tierra de noche) a "planetas completos" | NASA Image and Video Library (dominio público), ESA/Hubble y ESA/Webb (CC BY 4.0, con atribución), NASA Earth Observatory "Black Marble" | Desaturar, bajar contraste, teñir hacia la paleta, grain. Nunca bajo texto sin overlay | AVIF/WebP, ≤ 200 KB, 2400 px máx |
| **Cartografía espacial** | Mapas topográficos lunares y marcianos como textura y motivo gráfico (curvas de nivel = "órbitas"). Es el recurso más distintivo y menos usado | USGS Astrogeology (dominio público), NASA LRO / MOLA | Recorte en monocromo, líneas finas | SVG vectorizado o WebP |
| **Documentos técnicos históricos** | Planos, tablas y diagramas de misiones Apollo como referencia de estilo para labels y grids (no como asset directo) | NASA Technical Reports Server, archivos Apollo (dominio público; evitar personas identificables) | Solo inspiración | — |
| **Starfield / partículas** | Procedural en `<canvas>` (único, 0 KB de imagen); versión SVG estática para reduced-motion | Propio | Densidad baja, sin twinkle exagerado | Código |
| **Grain / ruido** | `feTurbulence` en SVG o PNG 256×256 tileado a 3–5 % de opacidad | Propio | Probar en pantallas OLED (el banding se nota) | SVG/PNG |
| **Grids y líneas** | CSS (`linear-gradient` repetido); líneas orbitales en SVG | Propio | Opacidad ≤ 10 % | Código |
| **Capturas de proyectos** | Capturas reales a 2× (Playwright a 1600 / 2400 px) dentro de marcos propios en SVG coherentes con el estilo; 1 cover + 4–8 imágenes de galería por misión; opcional 1 vídeo de interacción ≤ 2 MB, muted, con poster | Propio | Mismo encuadre y fondo para todas las misiones | AVIF/WebP + MP4/WebM |
| **Diagramas (Lab / Architecture)** | Un solo estilo: una grosura de línea, monocromo + acento, tipografía mono | Propio (Excalidraw → SVG limpio, o Figma) | Exportar SVG optimizado con SVGO | SVG |
| **Retrato** | Una sesión: fondo oscuro neutro, luz lateral, 2 encuadres (busto y medio cuerpo) | Propio | Desaturado parcial coherente con la paleta | AVIF/WebP |
| **Marca** | Monograma + wordmark en mono + "callsign" (p. ej. `AM-01`); set de favicons; plantilla OG | Propio (Claude Design / Figma) | Vector | SVG + PNG |
| **Iconos** | Lucide (MIT) como base, stroke 1.5; ≤ 8 glyphs propios (estados de misión, órbitas) | Lucide | `currentColor` | SVG inline |
| **Tipografías** | Ver combinaciones abajo | Google Fonts (OFL) o fundiciones de pago | `next/font`, subset latin | woff2 |
| **Vídeo ambiente** | **No** en el hero (peso, LCP). Solo micro-vídeos de producto en galerías | — | — | — |
| **3D** | **No** en MVP. Si llega en v2: una sola escena (esfera con mapa topográfico real USGS o partículas), R3F, lazy, con imagen de fallback | USGS | — | GLB ≤ 500 KB |
| **Sonido** | **No** | — | — | — |

**Tipografía — combinaciones candidatas** (todas con `next/font`, subset latin, ≤ 6 archivos):

| Opción | Display (titulares) | Sans (cuerpo) | Mono (labels / datos) | Carácter |
|---|---|---|---|---|
| A · Editorial-científica (gratis) | Instrument Serif | Geist Sans | Geist Mono | Contraste editorial + técnico limpio |
| B · Cálida-precisa (gratis) | Fraunces (variable, con eje óptico) | Inter | JetBrains Mono | Más humana; funciona bien en español |
| C · Premium (pago) | PP Editorial New | PP Neue Montreal | GT America Mono o ABC Diatype Mono | Nivel estudio |

Evitar: Orbitron, Exo, Rajdhani (sci-fi), Space Mono / Space Grotesk (chiste demasiado obvio), Playfair Display (sobreexplotada).

**Color de acento — candidatos para explorar en moodboards:**

- **International Orange** (naranja aeroespacial, ~`#FF4F00` / `#F04E23`): trajes de vuelo, señalética de pruebas; alto contraste en oscuro; poco usado en portfolios.
- **Amber telemetry** (~`#FFB000`): fósforo de instrumentos; cálido y legible.
- **Signal white**: blanco cálido como acento por contraste + un único tono de estado (verde apagado). Máxima contención.

Evitar cian / neón (gamer) y verde "Matrix".

---

## 11. Roadmap v2

| Fase | Objetivo | Entregables | Definition of Done | Duración |
|---|---|---|---|---|
| **0 · Estrategia + Content first** | Cerrar decisiones y **cosechar contenido real** | Posicionamiento final · decisiones de §12 · por proyecto: capturas 2×, datos reales (GA4 / GSC / Ads / Lighthouse, con permiso del cliente), testimonio, borrador del debrief en texto plano · keywords objetivo · copy del hero (3 variantes) | 5 debriefs en borrador con evidencia archivada; decisiones firmadas | 1–2 semanas |
| **1 · Art direction** | Convertir el concepto en sistema visual | 3 moodboards (Universe Minimal · Mission Control · Cinematic Universe) + key screen (hero + mission card + telemetry) de la dirección elegida | Dirección elegida y documentada | 1–2 semanas |
| **2 · Design system + wireframes** | Sistema y estructura | Tokens (§9.1) con contrastes · componentes (§9.2) con estados · wireframes lo-fi de 7 páginas × 2 breakpoints · hi-fi de Home y Mission debrief · spec de motion | Tokens exportables; wireframes anotados con contenido real | 1–2 semanas |
| **3 · Fundación técnica** | Repo listo para construir | Next + TS strict + Tailwind v4 con tokens + content-collections + schemas + CI (lint, typecheck, build, LHCI) + preview deploy + scaffold de analytics/consent + scaffold SEO + `MotionProvider` | `main` despliega una Home vacía con tokens y 100 / 100 / 100 / 100 en Lighthouse | 1 semana |
| **4 · MVP build** | Todas las páginas MVP | Layout · nav (+ Console) · Home · Projects (grid / list) · Mission debrief · Services · About · Contact (formulario funcional) · 404 · Privacy · MISSION 000 v0 | Todas las rutas en preview con contenido real; presupuesto §8.10 cumplido; axe sin críticos | 3–4 semanas |
| **5 · Motion + signature moments** | Magia sobre base sólida | Universe Map (SVG) interactivo · starfield canvas · transiciones · entradas por scroll · hero boot | Reduced-motion verificado; INP ≤ 200 ms en móvil real | 1–2 semanas |
| **6 · Calidad** | SEO, analytics, performance, accesibilidad | JSON-LD validado · GTM + eventos verificados en DebugView · conversión en Ads · Search Console · auditoría a11y manual (teclado + lector) · CWV en móvil real · copy revisado · página de privacidad | Checklist §11.1 completa | 1 semana |
| **7 · Launch** | Publicar | Dominio · HTTPS · redirects · OG verificadas · sitemap enviado · GA4 / GTM en producción · monitorización (uptime + CWV field) | Live + primera medición registrada en MISSION 000 | 2–3 días |
| **8 · Operación** | Build → Measure → Optimize → Grow aplicado al propio sitio | Mensual: revisar GA4 / GSC, 1 mejora medible, 1 entrada de Lab o Journal · trimestral: actualizar MISSION 000 con datos · v1.1: landings de servicios + Lab · v2: Journal, i18n si procede | Cadencia sostenida 3 meses | Continuo |

### 11.1 Checklist de lanzamiento

Dominio y DNS · HTTPS · redirects (www, trailing slash) · metadata y OG en todas las rutas · sitemap y robots · JSON-LD sin errores (Rich Results Test) · GA4 + GTM + Consent Mode verificados · conversión `generate_lead` en Ads · Search Console verificado y sitemap enviado · formulario probado end-to-end (email recibido) · enlace de WhatsApp probado en móvil · 404 y páginas legales · Lighthouse móvil ≥ 95 · axe sin críticos · navegación por teclado completa · reduced-motion probado · imágenes con alt · favicons y manifest · monitorización de uptime · backup del repo y del contenido privado.

---

## 12. Decisiones pendientes (cerrar en Fase 0)

| # | Decisión | Opciones | Recomendación |
|---|---|---|---|
| 1 | Idioma | es · es + en | es en MVP; i18n desde el día 1 solo si EN se publicará en < 12 meses |
| 2 | Marca | Nombre propio · marca / callsign | Nombre propio como marca principal + callsign como firma visual (SEO personal + confianza) |
| 3 | Dominio | `.pe` · `.com` · `.dev` | `.com` si está disponible, con redirect desde alternativos |
| 4 | Color de acento | International Orange · Amber · Signal white | Explorar los 3 en moodboards; elegir 1 |
| 5 | Modo claro | Solo oscuro · dual (Space / Paper) | Solo oscuro en MVP; tokens semánticos preparados |
| 6 | 3D en MVP | Sí · No | No |
| 7 | Hosting | Vercel Pro · Cloudflare Workers | Decidir en Fase 3 según presupuesto; ambos soportan el stack |
| 8 | Email de formularios | Resend · Formspree | Resend (control total, plantilla propia) |
| 9 | Retrato | Sí · No | Sí: la audiencia A contrata personas |
| 10 | Rangos de precio | Mostrar "desde" · No mostrar | Mostrar en Services: filtra leads no cualificados |
| 11 | WhatsApp como canal principal | Sí · No | Sí para la audiencia A; medir `generate_lead { method }` |
| 12 | Nombre público de MISSION 000 | "The Universe" · otro | Definir junto con la marca |

---

## 13. Riesgos y mitigación

| Riesgo | Mitigación |
|---|---|
| El concepto se percibe como cliché espacial | Diferenciar por interacción (Map / Console / Telemetry) y contención visual; sin 3D ni neón |
| Sobre-alcance | MVP cerrado en §5.1; todo lo demás con fase asignada |
| Contenido no listo al diseñar | Fase 0 content-first; no se diseña sin debriefs en borrador |
| Performance degradada por motion | Presupuesto §8.10 en CI; motion en Fase 5 sobre una base ya medida |
| Métricas no verificables | Schema `Metric` con `verified` + evidencia archivada; sin evidencia no se publica |
| Secciones vacías (Lab / Journal) | Ocultas hasta ≥ 3 entradas |
| Términos de hosting (uso comercial) | Vercel Pro o Cloudflare |
| Datos de clientes en case studies | Permiso escrito; opción `status: confidential` (caso sin nombre de cliente) |

---

## 14. Principios de arquitectura

1. Evolucionar sin sobreingeniería.
2. Separar contenido y presentación.
3. Performance como requisito.
4. Accesibilidad desde el inicio.
5. SEO desde la arquitectura.
6. Medición desde el lanzamiento.
7. La tecnología sirve al concepto.
8. **(Nuevo) El sitio practica lo que vende**: se construye, se mide, se optimiza y crece, y lo documenta en MISSION 000.

---

## 15. Próximo paso

1. Cerrar las decisiones de §12 y ejecutar la **Fase 0** (content first): sin debriefs en borrador y evidencia real no conviene diseñar.
2. Abrir Claude Design con `design_brief_claude_design.md`: moodboards (3 direcciones) → elegir → design system → wireframes → hi-fi de Home y Mission debrief.
3. Solo entonces, Fase 3 (fundación técnica).
