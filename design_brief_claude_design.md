# Design Brief — "The Universe + Mission Control"

**Uso:** contexto para Claude Design. Produce, en este orden: (1) moodboards de 3 direcciones → (2) design system de la dirección elegida → (3) wireframes → (4) hi-fi de pantallas y componentes clave.
**Cómo usarlo:** pega el bloque **CONTEXTO BASE** (§1–§7) al inicio de cada sesión y añade el prompt de la etapa que toque (§8–§11). Los prompts están listos para copiar.
**Fuente:** `plan_portfolio_universe_mission_control_v2.md` (este brief es autónomo; no hace falta pegar el plan).

---

# CONTEXTO BASE

## 1. Proyecto en 10 líneas

1. Plataforma profesional personal (portfolio evolutivo) de **Adrián**, desarrollador web y especialista en crecimiento digital: desarrollo web, e-commerce, SEO, Google Ads, Analytics. Base: Lima, Perú. Trabajo remoto.
2. Posicionamiento: **"Construyo sistemas digitales que se miden, se optimizan y crecen."** Modelo: **BUILD → MEASURE → OPTIMIZE → GROW**.
3. Audiencia principal: dueños y gerentes de PYMES en Perú / LATAM. Secundaria: agencias y partners. Futura: empresas tech (sección Lab).
4. Objetivo de negocio: generar contacto (formulario y WhatsApp). Métrica: `generate_lead`.
5. Idioma del contenido: **español**. Los "system labels" van en inglés como lenguaje visual (`SYSTEM ONLINE`, `MISSION`, `STATUS: LIVE`), nunca como portadores de información crítica.
6. Páginas del MVP: Home · Projects (índice) · Project detail ("Mission debrief") · Services · About · Contact · 404 · Privacy.
7. Proyectos ("misiones"): M-000 The Universe (este portfolio) · M-001 EVOX (e-commerce, 2026) · M-002 Tensolanas Perú (web corporativa) · M-003 Andeccoberturas (web corporativa) · M-004 Portfolio de fotografía · M-005 Portfolio de publicidad y medios digitales.
8. Stack de implementación: Next.js + Tailwind CSS v4 (tokens como CSS variables) + GSAP. **Sin 3D en el MVP.** El mapa de proyectos es SVG.
9. Tema oscuro. **Un solo color de acento.** Mobile first (375 px).
10. Restricciones duras: contraste AA, `prefers-reduced-motion`, performance (el hero es texto, sin imagen hero pesada).

## 2. Concepto (definición operativa)

- **The Universe** = capa de **exploración**: el contenido se organiza espacialmente, la navegación es no lineal, hay sensación de descubrimiento.
- **Mission Control** = capa de **precisión**: datos reales, estados, estructura, control total para el usuario.
- Identidad = **curiosidad con rigor**.

Tres capas de experiencia que el diseño debe hacer visibles:

```text
THE MAP        explorar     universo de misiones (Home, Projects en modo mapa)
THE CONSOLE    controlar    command palette (⌘K), modo lista, filtros, teclado
THE TELEMETRY  demostrar    datos reales: métricas de casos, Web Vitals de la sesión del visitante, estado del sistema
```

Regla: **la metáfora organiza la información; no decora.** Todo lo que hace el mapa se puede hacer con la lista.

## 3. Personalidad

- **Es:** cinematográfico, científico, editorial, calmado, preciso, curioso, confiable, contenido.
- **No es:** gamer, futurista-neón, glitch, "startup genérica", corporativo frío, juguetón, recargado.
- **Test:** si un ingeniero de la NASA y un director de arte de una revista científica lo ven, ambos lo reconocen como propio.

## 4. Referencias y anti-referencias

**Referencias estéticas:** Interstellar (UI de TARS, paleta apagada) · fotografía NASA / ESA / JWST tratada en monocromo · cartografía lunar y marciana del USGS (curvas de nivel, coordenadas) · documentos técnicos de la era Apollo (tablas, numeración, grids) · observatorios · revistas científicas · arquitectura minimalista.

**Referencias de interacción:** overlays de telemetría de webcasts espaciales · timelines de misión (`T-00:00`) · command palettes (Linear, Raycast) · sitios editoriales con índice numerado.

**Anti-referencias:** portfolios 3D con planetas girando · HUDs de videojuego · fondos de galaxia saturados · tipografías sci-fi · cursores personalizados · preloaders largos · neón / cian / verde Matrix.

## 5. Restricciones no negociables

- Contraste **AA**: texto 4.5:1, UI 3:1. Documentar el ratio de cada par color/fondo en el design system.
- Nada depende de hover. Todo funciona por teclado y en móvil de 375 px.
- Texto nunca sobre imagen estelar sin overlay de contraste.
- Sin cursor custom, sin preloader > 600 ms, sin scroll hijacking, sin sonido.
- Hero = texto (es el LCP). Máximo 3–5 fotografías grandes en todo el sitio.
- Radios pequeños (0–4 px). Sin sombras difusas: la elevación se resuelve con bordes y cambio de fondo.
- Tipografía: máximo 3 familias (display, sans, mono).
- Cada número visible lleva fuente y periodo (`+42 % tráfico orgánico · GA4 · Ene–Jun 2026 · ✓ VERIFIED`).
- Motion: entradas una sola vez; parallax ≤ 8 %; duraciones 120 / 240 / 480 / 900 ms; easing out-expo. Con reduced-motion todo se reduce a fades.

## 6. Dirección visual de partida

**Paleta (roles; los hex se definen en el design system):**
`bg` (casi negro azulado, nunca `#000`) · `bg-elevated` · `surface` · `surface-hover` · `fg` (blanco roto) · `fg-muted` · `fg-subtle` · `line` · `line-strong` · `accent` · `accent-fg` · `success` · `warning` · `danger` · `overlay`.

**Acento a explorar (elegir uno):**
- *International Orange* (naranja aeroespacial, ~`#FF4F00` / `#F04E23`).
- *Amber telemetry* (~`#FFB000`, fósforo de instrumentos).
- *Signal white* (blanco cálido como acento por contraste + un único verde apagado para estados).

**Tipografía candidata (elegir una combinación):**
- A · Instrument Serif (display) + Geist Sans (cuerpo) + Geist Mono (labels / datos) — editorial-científica, gratis.
- B · Fraunces (display) + Inter (cuerpo) + JetBrains Mono (labels / datos) — cálida-precisa, gratis.
- C · PP Editorial New + PP Neue Montreal + GT America Mono — premium, pago.
- Evitar: Orbitron, Exo, Rajdhani, Space Mono / Space Grotesk, Playfair Display.

**Recursos gráficos:** líneas orbitales finas · curvas de nivel · coordenadas · grids a ≤ 10 % de opacidad · numeración (`01 —`, `M-001`) · indicadores de estado (punto + label) · grain al 3–5 % · gradientes muy controlados · fotografías grandes muy tratadas (desaturadas, teñidas hacia la paleta).

**Fotografía:** texturas (superficie lunar, gas, Tierra nocturna, mapas topográficos), no planetas completos. Fuentes de dominio público / CC BY: NASA, ESA/Hubble, ESA/Webb, USGS Astrogeology.

**Sistema de labels (glosario cerrado, mono, mayúsculas, tracking amplio):**
`SYSTEM ONLINE` · `MISSION` · `M-###` · `L-###` · `J-###` · `STATUS: LIVE / IN PROGRESS / ARCHIVED / CONFIDENTIAL` · `SECTOR` · `T+` · `LAT / LON` · `VERIFIED` · `TELEMETRY` · `NEXT MISSION` · `PREV MISSION` · `LOST IN SPACE` · `NEW MISSION REQUEST` · `NO MISSIONS IN THIS SECTOR`. Se usan como metadatos, nunca como titulares.

## 7. Contenido real y placeholders

**Hero (borrador, español; 3 líneas máximo):**

```text
SYSTEM ONLINE · v1.0.0

Construyo sistemas digitales
que hacen crecer negocios.

Desarrollo web · E-commerce · SEO · Google Ads · Analytics

[ Explorar proyectos ]   [ Contactar ]

LIMA 14:32 · STATUS: AVAILABLE · LAT -12.046 · LON -77.043
```

**Misiones (para cards y mapa):**

| ID | Título | Sector | Año | Estado | Stack (ejemplo) |
|---|---|---|---|---|---|
| M-000 | The Universe | platform | 2026 | IN PROGRESS | Next.js · TypeScript · GSAP · GA4 |
| M-001 | EVOX | ecommerce | 2026 | LIVE | Next.js · TypeScript · Analytics |
| M-002 | Tensolanas Perú | corporate | — | LIVE | — |
| M-003 | Andeccoberturas | corporate | — | LIVE | — |
| M-004 | Photography Portfolio | portfolio | — | LIVE | — |
| M-005 | Advertising & Digital Media Portfolio | portfolio | — | LIVE | — |

**Capacidades:** 01 Desarrollo web · 02 E-commerce · 03 SEO · 04 Google Ads · 05 Analytics.
**Modelo de crecimiento:** BUILD (construir) → MEASURE (medir) → OPTIMIZE (optimizar) → GROW (crecer).
**CTA final:** "¿Listo para una nueva misión?" · email · WhatsApp · formulario.
**Formulario de contacto:** nombre · email · empresa (opcional) · tipo de proyecto (select) · presupuesto orientativo (select, opcional) · mensaje. Éxito: `MISSION REQUEST RECEIVED · ETA 48H`.
**Footer:** navegación · social (LinkedIn, GitHub, WhatsApp) · `LIMA, PE · LAT -12.046 · LON -77.043` · hora local · `BUILD v1.0.0 · 2026-09-14` · `YOUR SESSION → LCP 1.1 s · INP 40 ms · CLS 0.00` · privacidad.

---

# ENTREGABLES Y PROMPTS

## 8. Entregable 1 — Moodboards (3 direcciones)

Un artboard por dirección + un cuarto artboard comparativo. Cada moodboard incluye: paleta con roles, tipografía en uso (statement + párrafo + label), 4–6 imágenes de referencia tratadas, recursos gráficos (órbitas, grids, labels), un mini key-screen del hero (desktop) y una mission card. Todo con contenido real de §7.

| Dirección | Idea | Peso de cada capa | Riesgo a vigilar |
|---|---|---|---|
| **1 · Universe Minimal** | Universo elegante y editorial. Mucho blanco roto sobre oscuro, tipografía display protagonista, órbitas como líneas finas, casi sin fotografía | MAP 40 · CONSOLE 30 · TELEMETRY 30 | Quedarse en "portfolio minimal genérico" sin identidad |
| **2 · Mission Control** | Interfaz técnica y de datos: grids visibles, labels mono, paneles de telemetría, estados. El mapa es un instrumento, no un paisaje | MAP 20 · CONSOLE 40 · TELEMETRY 40 | Parecer dashboard o HUD gamer; frialdad excesiva para PYMES |
| **3 · Cinematic Universe** | Inmersiva y cinematográfica: fotografía grande tratada, gradientes profundos, hero con presencia, transiciones lentas | MAP 50 · CONSOLE 20 · TELEMETRY 30 | Performance, legibilidad, cliché espacial |

**Prompt 1 (copiar):**

> Con el CONTEXTO BASE anterior, crea 4 artboards en un canvas: tres moodboards para el concepto "The Universe + Mission Control" y un cuarto artboard comparativo.
>
> Moodboard 1 — "Universe Minimal": universo elegante y editorial, tipografía display protagonista, órbitas como líneas finas, casi sin fotografía.
> Moodboard 2 — "Mission Control": interfaz técnica y de datos, grids visibles, labels mono, paneles de telemetría; el mapa es un instrumento.
> Moodboard 3 — "Cinematic Universe": inmersiva, fotografía grande muy tratada, gradientes profundos, presencia cinematográfica.
>
> Cada moodboard debe incluir: (a) paleta con roles `bg / surface / fg / fg-muted / line / accent` y hex propuestos, con el acento elegido entre International Orange, Amber telemetry o Signal white; (b) una combinación tipográfica de las tres candidatas mostrada en uso: statement del hero, párrafo de 3 líneas y una fila de labels mono; (c) 4–6 referencias visuales tratadas (texturas astronómicas y cartográficas desaturadas, no planetas completos); (d) recursos gráficos: órbitas, grid, coordenadas, indicador de estado, numeración; (e) un mini key-screen del hero en desktop 1440 con el copy real de §7; (f) una mission card de M-001 EVOX con ID, sector, año, estado, stack y cover.
>
> Artboard 4 — comparación: una tabla con las tres direcciones evaluadas contra estos criterios (1–5): diferenciación frente a otros portfolios, confianza para una PYME peruana, legibilidad y contraste AA, viabilidad de performance (hero texto, pocas imágenes), capacidad de escalar a Lab/Journal, riesgo de cliché. Incluye una recomendación razonada y qué tomarías de cada dirección para un híbrido.
>
> Reglas: tema oscuro, un solo acento, radios 0–4 px, sin sombras difusas, sin neón ni cian, sin tipografías sci-fi, sin cursor custom. Español para el contenido; labels en inglés en mono.

## 9. Entregable 2 — Design System

Basado en la dirección elegida (o el híbrido). Los nombres de los tokens deben ser **exactamente** estos, porque se mapean 1:1 a Tailwind v4 `@theme`.

**Tokens a definir:**

| Grupo | Tokens | Requisito |
|---|---|---|
| Color | `bg`, `bg-elevated`, `surface`, `surface-hover`, `fg`, `fg-muted`, `fg-subtle`, `line`, `line-strong`, `accent`, `accent-fg`, `success`, `warning`, `danger`, `overlay` | Hex + ratio de contraste de cada par texto/fondo (mínimo AA) |
| Tipografía | `font-display`, `font-sans`, `font-mono`; escala fluida `text-xs … text-8xl` con `clamp(min, fluid, max)`; `leading-tight / normal / relaxed`; `tracking-tight / normal / wide / label` | Mostrar la escala completa en desktop y móvil |
| Spacing | Base 4 px: `space-1 … space-24`; `section-y-mobile`, `section-y-desktop`; `container-max` = 1440; `gutter-mobile` = 16, `gutter-desktop` = 24 | |
| Radios | `radius-none` 0 · `radius-sm` 2 · `radius-md` 4 · `radius-full` | |
| Bordes / elevación | `line-1` (1 px `line`), `line-2` (1 px `line-strong`); niveles de elevación = combinación borde + `bg-elevated` / `surface` | Sin box-shadow difuso |
| Motion | `duration-micro` 120 · `duration-ui` 240 · `duration-section` 480 · `duration-cinematic` 900; `ease-out-expo` `cubic-bezier(0.16, 1, 0.3, 1)`, `ease-in-out`, `ease-linear` | Especificar comportamiento con reduced-motion |
| Grid | 12 col desktop · 6 col tablet · 4 col móvil | |
| Breakpoints | 640 · 768 · 1024 · 1280 · 1536 | |
| Z-index | `z-base`, `z-sticky`, `z-overlay`, `z-modal`, `z-console`, `z-toast` | |

**Componentes a diseñar (con variantes y estados):**

```text
Primitivos    Button (primary · secondary · ghost · link | sm · md · lg | default · hover · focus · loading · disabled)
              Badge (live · in-progress · archived · confidential · verified)
              Tag (stack · category) · Metric (value · label · source · period · verified)
              StatusIndicator (available · limited · unavailable; pulsa solo si available)
              Field · Select · Textarea (default · focus · error · disabled) · Checkbox de consentimiento
              Prose (estilos de MDX: h2 numerado, párrafo, lista, cita, código, figura con caption)
Layout        Container · Grid · Section (con numeración "01 —") · PageHeader · Header · Footer
Navegación    MainNav · MobileNav (full-screen) · CommandPalette (⌘K) · ViewToggle (MAP | GRID | LIST)
              AnchorNav (sticky) · Breadcrumbs · MissionPagination (prev / next)
Universe      UniverseMap (desktop) · OrbitRing · MissionNode (default · hover · focus · active)
              MissionCard (default · compact · row) · TrajectoryList (móvil) · Starfield (spec, no imagen)
Mission       MissionHeader · TelemetryPanel (sticky desktop · collapsed móvil) · MissionSection (numerada)
              Gallery (grid · single · video con poster)
Secciones     Hero · Capabilities · GrowthModel (horizontal → vertical) · Proof · AboutTeaser · ClosingCTA
              FAQ · ServiceSection · ProcessSteps · Timeline · StackPanel · NowBlock
Telemetría    TelemetryStrip · SessionTelemetry · LocalClock · BuildInfo
Feedback      Toast · EmptyState ("NO MISSIONS IN THIS SECTOR") · Skeleton
```

**Prompt 2 (copiar):**

> Con el CONTEXTO BASE y la dirección elegida [pegar aquí el nombre y 3 líneas de la dirección / híbrido], crea el design system en un canvas con estos artboards:
>
> 1. **Tokens de color**: paleta con los roles exactos `bg, bg-elevated, surface, surface-hover, fg, fg-muted, fg-subtle, line, line-strong, accent, accent-fg, success, warning, danger, overlay`, hex de cada uno y una matriz de contraste texto/fondo con el ratio y si cumple AA. Un solo acento.
> 2. **Tipografía**: las tres familias (display, sans, mono) y la escala fluida `text-xs … text-8xl` con valores `clamp()` mostrada en desktop y móvil; ejemplos reales: statement del hero, título de misión, párrafo, label mono `M-001 · STATUS: LIVE`, métrica.
> 3. **Spacing, radios, bordes, grid, breakpoints, z-index y motion** con los nombres de la tabla de tokens de este brief; incluye la especificación de reduced-motion.
> 4. **Componentes primitivos** con todas las variantes y estados listados.
> 5. **Componentes de navegación** incluyendo CommandPalette abierta con resultados reales (páginas, misiones, acciones: copiar email, abrir WhatsApp, cambiar vista, descargar CV).
> 6. **Componentes Universe**: UniverseMap desktop con 6 nodos en 3–4 órbitas por sector, un nodo en hover mostrando la MissionCard; TrajectoryList móvil equivalente; MissionCard en sus tres variantes.
> 7. **Componentes Mission**: MissionHeader, TelemetryPanel (sticky y colapsado), MissionSection numerada con Prose, Gallery.
> 8. **Telemetría y feedback**: TelemetryStrip, SessionTelemetry, BuildInfo, Toast, EmptyState.
> 9. **Glosario de labels**: los términos del sistema de labels con su uso permitido.
>
> Reglas: cada token tiene nombre, valor y ejemplo de uso; nada de sombras difusas; radios 0–4 px; los labels son metadatos, no titulares. Contenido en español, labels en inglés en mono. Anota cualquier decisión que rompa una restricción del brief.

## 10. Entregable 3 — Wireframes

Lo-fi primero (estructura, jerarquía, contenido real), luego hi-fi de Home y Mission debrief. Breakpoints: **375** (móvil) y **1440** (desktop); 768 solo para Universe Map y Mission debrief. Cada wireframe anotado con: prioridad de contenido, componente usado, CTA, evento de analytics.

**Páginas y secciones:**

```text
HOME
  01 Hero (SYSTEM ONLINE · statement 3 líneas · subtítulo · 2 CTA · telemetry strip)
  02 Universe Map (6 nodos · leyenda · toggle a lista) → móvil: TrajectoryList
  03 Capabilities (01–05, expandibles)
  04 Growth Model (BUILD → MEASURE → OPTIMIZE → GROW)
  05 Proof (métricas verificadas o hechos)
  06 About teaser (retrato + 3 líneas)
  07 Closing CTA
  Footer (nav · social · coordenadas · hora · build · session telemetry · legal)

PROJECTS
  Header (MISSIONS · contador) · FilterBar + ViewToggle · listado en GRID (default), MAP y LIST · EmptyState · CTA

PROJECT DETAIL — MISSION DEBRIEF
  MissionHeader (ID · sector · año · estado · título · frase · VISIT WEBSITE · cover 21:9)
  Dos columnas: secciones numeradas 01–10 (opcionales) | TelemetryPanel sticky (cliente, rol, stack, servicios, periodo, métricas ✓, enlaces, índice)
  Gallery · MissionPagination (prev / next) · CTA
  Móvil: TelemetryPanel colapsable bajo el header

SERVICES
  Header + GrowthModel compacto · AnchorNav sticky (01–05) · 5 ServiceSection (para quién · incluye · proceso · misiones relacionadas · herramientas · desde) · EngagementModels · FAQ · CTA

ABOUT
  Statement + retrato · Timeline "flight log" · Principios · StackPanel (Build / Measure / Grow) · NowBlock (disponibilidad, ubicación, hora) · CTA + CV

CONTACT
  Header (NEW MISSION REQUEST · "respondo en 24–48 h") · Formulario (6 campos · consentimiento · Turnstile) · Canales directos (email copiar · WhatsApp · LinkedIn) · Ubicación
  Estados: enviando · éxito (MISSION REQUEST RECEIVED · ETA 48H) · error

404
  LOST IN SPACE · coordenadas · buscador (abre Console) · enlaces principales

GLOBAL
  Header desktop y móvil · MobileNav full-screen · CommandPalette · banner de consentimiento (2 botones + enlace)
```

**Prompt 3 (copiar):**

> Con el CONTEXTO BASE y el design system ya definido, crea wireframes lo-fi en un canvas para estas páginas: Home, Projects (vista GRID y vista MAP), Mission debrief (M-001 EVOX), Services, About, Contact (incluyendo estados de éxito y error), 404, y los elementos globales (header desktop, header móvil, MobileNav abierto, CommandPalette abierta, banner de consentimiento). Cada página en 375 px y 1440 px; Universe Map y Mission debrief también en 768 px.
>
> Usa la estructura de secciones de este brief (§10) y el contenido real de §7. Anota en cada sección: prioridad de contenido (1–3), componente del design system que la implementa, CTA y evento de analytics (`select_mission`, `toggle_universe_view`, `select_capability`, `view_service`, `contact_start`, `generate_lead`, `download_cv`, `open_console`).
>
> Reglas: el hero es texto; en móvil el mapa se convierte en TrajectoryList; toda información del mapa debe existir también en la vista lista; los labels en inglés en mono son metadatos; los números llevan fuente y periodo. Marca cualquier sección que se pueda eliminar sin perder el objetivo de la página.

**Prompt 4 (copiar) — hi-fi de pantallas clave:**

> A partir de los wireframes aprobados y el design system, produce en alta fidelidad: (1) Home completa en 1440 y 375 con el copy real; (2) Mission debrief de M-001 EVOX en 1440 y 375 con TelemetryPanel sticky y al menos 6 secciones numeradas con texto placeholder realista; (3) Projects en vista MAP (1440) con un nodo en hover y en vista GRID (375); (4) CommandPalette abierta sobre la Home con resultados reales; (5) estados del formulario de Contact.
>
> Incluye un artboard de "motion spec" que describa para Hero, Universe Map, MissionCard, transición entre páginas y entradas por scroll: qué propiedad se anima (solo `transform` y `opacity`), duración, easing, si ocurre una sola vez y qué pasa con `prefers-reduced-motion`.

## 11. Criterios para evaluar los resultados

Antes de aceptar cualquier entregable, comprobar:

- [ ] ¿Se distingue de un "portfolio espacial" típico por la **interacción** (mapa + consola + telemetría) y no solo por la estética?
- [ ] ¿Una PYME peruana lo entendería y confiaría en 5 segundos? ¿El CTA de contacto es evidente?
- [ ] ¿Cada par texto/fondo cumple AA y está documentado?
- [ ] ¿Funciona en 375 px sin hover ni animaciones?
- [ ] ¿El hero es texto? ¿Hay ≤ 5 fotografías grandes en todo el sitio?
- [ ] ¿Un solo acento? ¿≤ 3 familias tipográficas? ¿Radios 0–4 px, sin sombras difusas?
- [ ] ¿Los labels en inglés son metadatos y no titulares? ¿Se respeta el glosario?
- [ ] ¿Todo número visible tiene fuente y periodo?
- [ ] ¿Los nombres de tokens coinciden exactamente con la tabla de §9?
- [ ] ¿No aparece ningún anti-patrón de §4 y §5?
