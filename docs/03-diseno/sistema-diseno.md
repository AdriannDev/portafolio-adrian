# Sistema de diseño · Portafolio Adrián Marchan

<!-- Fase 3. Fuente normativa de los tokens (ADR-003) y del vocabulario visual.
     Los nombres de token de este documento son los de `src/styles/globals.css`, sin renombrar.
     Cambiar un valor aquí obliga a cambiarlo allí en el mismo commit, y al revés.
     Cierra la revisión pendiente de ADR-003 ("al cerrar la Fase 3, confirmar la lista de tokens"). -->

| Campo | Valor |
|---|---|
| Fecha | 2026-09-26 |
| Estado | Aprobado |
| Dirección | **Híbrido**, elegido tras los moodboards (`design/moodboards/`, artboard 04) |
| Requisitos que sostiene | RNF-03 (accesibilidad), RNF-01 (fuentes y peso), RNF-08 (idioma de las etiquetas), CA-01.4, CA-N05.3 |
| Reglas de la constitución | 6 (sin literales), 10 (texto como elemento principal), 12 (solo `transform` y `opacity`), 23–27 |

## 1. Dirección: el híbrido

**El sistema de Mission Control con el tono de Universe Minimal, y un único momento cinematográfico.**

| Tomado de | Qué | Dónde se nota |
|---|---|---|
| Universe Minimal · el tono | Serif display para enunciados y títulos; fondo plano; contención; casi sin fotografía | Todo el sitio |
| Mission Control · el sistema | Labels mono, panel de telemetría, indicadores de estado, retícula visible **solo donde organiza datos** | Ficha de misión, listado, cabecera, pie |
| Cinematic Universe · un momento | Gradiente profundo con grano en el hero; transición lenta entre páginas | Portada; navegación entre páginas |

Lo que **no** se toma: fotografía a sangre, texturas espaciales de fondo, retícula como papel pintado, tipografía display en mayúsculas, acento ámbar.

### Reglas de dirección

Verificables en revisión de diseño y de código:

1. **Serif display** solo en el `h1` de cada página y en los enunciados de sección (`h2`). Nunca en párrafos, botones, etiquetas ni datos.
2. **Mono** solo en etiquetas, identificadores, datos y valores de telemetría. Nunca en párrafos.
3. **Retícula visible** (líneas) solo dentro de componentes que muestran datos tabulados: `TelemetryPanel`, `MissionRow`, pie. Nunca como fondo de página.
4. **El acento** marca exclusivamente: la acción principal, el foco, el estado activo o seleccionado, y la palabra de énfasis del hero. Como máximo un bloque sólido de acento (botón primario) por pantalla.
5. **Fotografía** (sin contar las capturas de proyectos): como máximo tres imágenes en todo el sitio. En el MVP son dos: el retrato del perfil y una imagen astronómica tratada en la página de error.
6. **Ninguna decoración transmite información**: el sitio se entiende con las decoraciones ocultas (CA-N05.3).

## 2. Color

### 2.1 Tokens

| Token | Valor | Rol | Uso |
|---|---|---|---|
| `bg` | `#0B0D12` | Fondo de página | Casi negro azulado, nunca `#000` |
| `bg-elevated` | `#10131A` | Banda | Secciones alternas, pie |
| `surface` | `#151923` | Superficie | Tarjetas, paneles, campos de formulario |
| `surface-hover` | `#1B2030` | Superficie activa | Hover y selección de superficie; consola; menú móvil |
| `fg` | `#F2EFE8` | Texto principal | Blanco roto cálido |
| `fg-muted` | `#A9ABB3` | Texto secundario | Entradillas, descripciones |
| `fg-subtle` | `#8A8E99` | Texto terciario | Etiquetas, metadatos, ayudas de campo |
| `line` | `#23272F` | Divisor decorativo | Separadores internos |
| `line-strong` | `#363B47` | Divisor de sección | Bordes de tarjeta y de sección |
| `line-control` | `#6A707C` | Borde de control | Campos, casillas, conmutadores: lo que **identifica** un control |
| `accent` | `#FF5A1F` | Acento | International Orange, aclarado para ganar margen de contraste (§2.2) |
| `accent-hover` | `#FF7A45` | Acento en hover | Solo el botón primario |
| `accent-fg` | `#0B0D12` | Texto sobre acento | Texto e iconos del botón primario |
| `success` | `#6FB583` | Estado correcto | Disponible, verificado, envío correcto |
| `warning` | `#E2BD4F` | Aviso | Agenda limitada, proyecto en desarrollo |
| `danger` | `#F2666F` | Error | Errores de formulario, sin disponibilidad |
| `overlay` | `rgb(11 13 18 / 0.8)` | Velo | Detrás de la consola y del menú móvil; bajo texto sobre imagen (CA-N03.7) |

Se eligió International Orange sobre ámbar porque el ámbar coincide con el color semántico de aviso, que el sistema de estados necesita. Cambiar el acento es cambiar un token.

### 2.2 Matriz de contraste

Calculada con la fórmula de WCAG 2.x el 2026-09-26. Una prueba unitaria la recalcula desde `globals.css` (§12), para que este documento y el código no diverjan.

**Texto** (mínimo 4,5:1, CA-N03.1) sobre los cuatro fondos:

| Token | `bg` | `bg-elevated` | `surface` | `surface-hover` |
|---|---|---|---|---|
| `fg` | 16,92 | 16,18 | 15,30 | 14,11 |
| `fg-muted` | 8,48 | 8,11 | 7,67 | 7,07 |
| `fg-subtle` | 5,93 | 5,67 | 5,36 | 4,95 |
| `accent` | 6,23 | 5,96 | 5,63 | 5,20 |
| `success` | 7,97 | 7,62 | 7,21 | 6,65 |
| `warning` | 10,76 | 10,29 | 9,73 | 8,97 |
| `danger` | 6,39 | 6,11 | 5,78 | 5,33 |

**Interfaz** (mínimo 3:1): `line-control` 3,91 · 3,74 · 3,53 · 3,26. `accent` como anillo de foco: 6,23 · 5,96 · 5,63 · 5,20.

**Texto sobre acento** (mínimo 4,5:1): `accent-fg` sobre `accent` 6,23; sobre `accent-hover` 7,52.

**Decorativas** (sin mínimo, por diseño): `line` 1,08–1,30 y `line-strong` 1,45–1,73. Nunca son la única pista de que algo es un control; para eso existe `line-control`.

Consecuencia práctica: **cualquier token de texto es legible sobre cualquier fondo del sistema**. No hay combinaciones prohibidas que recordar.

### 2.3 Reglas de uso

- El color nunca es el único portador de un estado (WCAG 1.4.1): todo estado lleva texto y, cuando procede, icono. Es especialmente importante entre `accent` y `danger`, de tono cercano.
- Foco visible en todo elemento interactivo: contorno de 2 px en `accent` con 2 px de separación. Prohibido `outline: none` sin sustituto (regla 23, CA-N03.8).
- Selección de texto: fondo `accent`, texto `accent-fg`.
- Tailwind arranca **sin paleta por defecto** (`--color-*: initial`): en el código solo existen estos tokens (§12).

## 3. Tipografía

### 3.1 Familias

| Token | Familia | Archivos (subconjunto latino) | Uso |
|---|---|---|---|
| `--font-display` | Instrument Serif | 2: regular 400 y cursiva 400 | `h1`, enunciados `h2`, valores grandes de métrica. La cursiva, solo para una palabra de énfasis |
| `--font-sans` | Geist | 1: variable 300–700 | Cuerpo, interfaz, botones, `h3` |
| `--font-mono` | Geist Mono | 1: variable 400–500 | Etiquetas, identificadores, datos |

Total: **3 familias y 4 archivos** (límite: 3 y 6, CA-N01.5). Licencia SIL OFL. Pendiente de concretar en la spec: los archivos definitivos y el mecanismo de carga (gestión nativa de fuentes de Astro o archivos en `public/fonts/`).

Condiciones de carga:

- **Autoalojadas**, nunca desde un servicio de fuentes de terceros: pedirlas a un tercero enviaría la dirección IP del visitante antes de su consentimiento (CA-10.1).
- Solo se precarga la serif regular: el `h1` de la portada es el elemento principal de carga (LCP) y está escrito en ella.
- `font-display: swap` con fuentes de respaldo ajustadas en métrica (`size-adjust`), para que el cambio de fuente no desplace la maquetación (CA-N01.3).
- Respaldo: serif → Georgia, "Times New Roman"; sans → system-ui, "Segoe UI"; mono → ui-monospace, Consolas.
- El subconjunto latino cubre el español (á é í ó ú ü ñ ¿ ¡ « » —). Los glifos fuera de él (⌘ → ✓ ↗) **nunca se escriben como texto**: son iconos SVG (§8). En sistemas que no son de Apple, el atajo de la consola se muestra como texto «Ctrl K».

### 3.2 Escala fluida

Interpolación lineal entre 360 px y 1440 px de ancho de ventana. El componente en `rem` hace que el texto siga escalando con el zoom del navegador (WCAG 1.4.4); la proporción máxima/mínima no pasa de 2,1.

| Token | Valor | 360 px | 1440 px |
|---|---|---|---|
| `--text-xs` | `0.75rem` | 12 | 12 |
| `--text-sm` | `0.875rem` | 14 | 14 |
| `--text-base` | `clamp(1rem, 0.9792rem + 0.0926vw, 1.0625rem)` | 16 | 17 |
| `--text-lg` | `clamp(1.125rem, 1.0833rem + 0.1852vw, 1.25rem)` | 18 | 20 |
| `--text-xl` | `clamp(1.25rem, 1.1667rem + 0.3704vw, 1.5rem)` | 20 | 24 |
| `--text-2xl` | `clamp(1.5rem, 1.375rem + 0.5556vw, 1.875rem)` | 24 | 30 |
| `--text-3xl` | `clamp(1.75rem, 1.5rem + 1.1111vw, 2.5rem)` | 28 | 40 |
| `--text-4xl` | `clamp(2rem, 1.5833rem + 1.8519vw, 3.25rem)` | 32 | 52 |
| `--text-5xl` | `clamp(2.25rem, 1.6667rem + 2.5926vw, 4rem)` | 36 | 64 |
| `--text-6xl` | `clamp(2.5rem, 1.5833rem + 4.0741vw, 5.25rem)` | 40 | 84 |

No hay tamaños mayores: no los usa ningún componente del MVP (regla 3, sin código muerto).

### 3.3 Roles

| Rol | Familia | Tamaño | Peso | Interlineado | Espaciado | Caja |
|---|---|---|---|---|---|---|
| Enunciado del hero (`h1` portada) | display | `6xl` | 400 | `display` 1 | `tight` −0,01em | normal |
| Título de página (`h1`) | display | `5xl` | 400 | `tight` 1,1 | `tight` | normal |
| Enunciado de sección (`h2`) | display | `3xl` | 400 | `tight` | normal | normal |
| Título de tarjeta de misión | display | `2xl` | 400 | `tight` | normal | normal |
| Subtítulo (`h3`) | sans | `xl` | 500 | `snug` 1,3 | normal | normal |
| Entradilla | sans | `lg` | 400 | `normal` 1,5 | normal | normal |
| Cuerpo | sans | `base` | 400 | `relaxed` 1,65 | normal | normal |
| Texto pequeño | sans | `sm` | 400 | `normal` | normal | normal |
| Botón | sans | `sm` | 500 | `snug` | normal | normal |
| Etiqueta | mono | `xs` | 500 | `normal` | `label` 0,14em | mayúsculas |
| Dato | mono | `sm` | 400 | `normal` | `data` 0,02em | normal, cifras tabulares |
| Valor de métrica | display | `4xl` | 400 | `display` | normal | normal |

Longitud de línea del cuerpo: 65 caracteres como máximo (`max-w-prose`).

### 3.4 Números, fechas y horas

Siempre con `Intl` y la configuración regional `es-PE`: separadores, meses abreviados y hora. Nunca se formatean a mano. La hora del negocio usa la zona `America/Lima`.

## 4. Espacio y maquetación

| Token | Valor | Uso |
|---|---|---|
| `--spacing` | `0.25rem` | Base de 4 px de Tailwind: `p-4` son 16 px |
| `--spacing-gutter` | `clamp(1.25rem, 0.1667rem + 4.8148vw, 4.5rem)` | Margen lateral de página: 20 px → 72 px |
| `--spacing-section` | `clamp(4rem, 2.6667rem + 5.9259vw, 8rem)` | Separación vertical entre secciones: 64 px → 128 px |
| `--container-page` | `90rem` | Ancho máximo de página, márgenes incluidos (1440 px) |

Pasos de espaciado preferidos: 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24 (de 4 a 96 px). Otros valores exigen justificación en la revisión.

| Rango | Columnas | Separación | Uso típico |
|---|---|---|---|
| < 768 px | 4 | 16 px | Una tarjeta por fila |
| 768–1023 px | 6 | 24 px | Dos tarjetas por fila |
| ≥ 1024 px | 12 | 24 px | Tres tarjetas por fila; ficha de misión en dos columnas (8 + 4) |

- Puntos de corte: los de Tailwind (640, 768, 1024, 1280, 1536). Ancho mínimo soportado: **360 px** sin desplazamiento horizontal (CA-N05.2).
- Objetivos táctiles de **44 × 44 px** como mínimo en todo elemento interactivo.
- La vista de mapa del listado solo existe a partir de 1024 px; por debajo se ofrece la trayectoria vertical (§10.3).

## 5. Radios, bordes y elevación

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | `2px` | Etiquetas, insignias |
| `--radius-md` | `4px` | Botones, campos, tarjetas, paneles |
| `rounded-none` · `rounded-full` | utilidades nativas | Sin radio · puntos de estado |

Sin sombras: Tailwind arranca sin ellas (`--shadow-*: initial`). Sobre fondo oscuro no se perciben y ensucian. La elevación se expresa con fondo y borde:

| Nivel | Fondo | Borde | Ejemplos |
|---|---|---|---|
| 0 · Página | `bg` | — | Cuerpo |
| 1 · Banda | `bg-elevated` | — | Secciones alternas, pie |
| 2 · Tarjeta | `surface` | 1 px `line-strong` | `MissionCard`, `TelemetryPanel`, campos |
| 3 · Capa | `surface-hover` | 1 px `line-strong` | Consola, menú móvil, banner de consentimiento; las dos primeras con `overlay` detrás |

## 6. Movimiento

| Token | Valor | Uso |
|---|---|---|
| `--duration-micro` | `120ms` | Hover, foco, pulsación |
| `--duration-ui` | `240ms` | Abrir y cerrar capas, cambio de vista |
| `--duration-section` | `480ms` | Entradas por desplazamiento, transición entre páginas |
| `--duration-cinematic` | `900ms` | Secuencia del hero (duración total) |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entradas |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Transiciones de estado |

Reglas:

1. Solo se animan `transform` y `opacity` (regla 12). Ninguna animación desactiva la interacción mientras dura.
2. Las entradas por desplazamiento ocurren **una sola vez** y con un recorrido de 12 px como máximo. Paralaje: 8 % como máximo.
3. **El `h1` de la portada nunca parte de opacidad cero.** Es el elemento principal de carga: ocultarlo retrasa la medición de LCP lo que dure la animación. En el hero solo se animan la etiqueta, la entradilla y las acciones.
4. **El estado inicial de todo contenido es visible en CSS.** El estado oculto previo a una animación lo aplica el propio script al arrancar; si el script falla, el contenido se ve igual (CA-N05.3).
5. GSAP se usa solo para la secuencia del hero, las entradas por desplazamiento y el mapa de misiones, y solo se carga en las páginas que lo usan (ADR-005). Todo lo demás es CSS.
6. Transición entre páginas: transiciones de vista nativas entre documentos (`@view-transition`), sin JavaScript. Donde el navegador no las soporta, la navegación es instantánea.

**Con movimiento reducido** (CA-N03.3), los tokens `--duration-section` y `--duration-cinematic` pasan a `0ms` desde la propia hoja global, así que las transiciones CSS lo respetan sin código adicional. Los scripts consultan la misma preferencia.

| Elemento | Normal | Reducido |
|---|---|---|
| Entradas por desplazamiento | Opacidad y 12 px, 480 ms | Ninguna: contenido visible desde el inicio |
| Secuencia del hero | Etiqueta, entradilla y acciones en cascada, 900 ms en total | Ninguna |
| Órbitas del mapa | Rotación lenta | Estáticas |
| Transición entre páginas | Fundido de 480 ms | Ninguna |
| Hover y foco | 120 ms | Sin cambios: comunican estado |
| Abrir la consola o el menú | Opacidad, 240 ms | Opacidad, 120 ms: comunica cambio de estado |
| Indicador «disponible» | Pulso de opacidad | Punto fijo |
| Valores de telemetría | Cuentan hasta la cifra | Cifra final directa |

## 7. Capas (z-index)

Tailwind v4 no tiene espacio de nombres para capas: se declaran como variables y se usan con `z-(--z-header)`.

| Token | Valor | Uso |
|---|---|---|
| `--z-base` | `0` | Contenido |
| `--z-raised` | `1` | Tarjeta enfocada sobre sus vecinas |
| `--z-sticky` | `100` | Panel de telemetría fijo, navegación de anclas |
| `--z-header` | `200` | Cabecera |
| `--z-banner` | `300` | Banner de consentimiento |
| `--z-overlay` | `400` | Velo del menú móvil |
| `--z-console` | `500` | Consola de comandos |
| `--z-toast` | `600` | Confirmaciones breves («Correo copiado») |

## 8. Iconografía

- **Juego propio de iconos SVG** en línea, en `src/components/ui/icons/`. Sin biblioteca: unos dieciséis iconos no justifican una dependencia, que además exigiría un ADR (regla 8).
- Retícula de 24, trazo de 1,5, extremos y uniones redondeados, color `currentColor`. Tamaños: 16, 20 y 24 px.
- Inventario del MVP: flecha derecha, flecha a enlace externo, flechas anterior y siguiente, verificación, cerrar, menú, consola, copiar, correo, WhatsApp, LinkedIn, GitHub, vista mapa, vista cuadrícula, vista lista.
- Las marcas (WhatsApp, LinkedIn, GitHub) se dibujan con su forma oficial monocroma, respetando sus normas de uso.
- Un botón que solo tiene icono lleva `aria-label` en español. Un icono que acompaña a un texto lleva `aria-hidden="true"`.
- Nunca emoji ni caracteres Unicode como iconos.

## 9. Sistema de etiquetas

Las etiquetas mono en mayúsculas son la firma visual del sistema. CA-N08.2 y la regla 27 exigen que ninguna información necesaria dependa del inglés. Por eso cada etiqueta pertenece a una de tres clases:

| Clase | Idioma | Para lectores de pantalla | Ejemplos |
|---|---|---|---|
| **Decorativa**: prescindible para entender y usar la página | Inglés | `aria-hidden="true"` | `SYSTEM ONLINE`, `T+00:00:00`, coordenadas |
| **Identificador**: neutro de idioma | — | Se lee | `M-001`, `v1.4.2`, `01 —` |
| **Informativa**: transmite estado o navegación | **Español**, con el mismo estilo | Se lee | `PUBLICADO`, `DISPONIBLE`, `VERIFICADO` |

Glosario cerrado. Añadir un término exige añadir su fila:

| Término | Clase | Uso |
|---|---|---|
| `SYSTEM ONLINE` | Decorativa | Etiqueta del hero |
| `MISSION` | Decorativa | Prefijo junto al código en la ficha; el código se lee aparte |
| `TELEMETRY` | Decorativa | Acompaña al título «Ficha técnica» del panel; los campos del panel están en español |
| `T+00:00:00` | Decorativa | Tiempo desde la carga, en el pie |
| `LAT −12.046 · LON −77.043` | Decorativa | Coordenadas de Lima; la ubicación se declara aparte en español (CA-08.3) |
| `M-000` … `M-999` | Identificador | Código de misión |
| `v1.4.2` | Identificador | Versión publicada (CA-11.3) |
| `01 —` | Identificador | Numeración de secciones y de navegación |
| `PUBLICADO` · `EN DESARROLLO` · `ARCHIVADO` | Informativa | Estado de un proyecto |
| `CLIENTE CONFIDENCIAL` | Informativa | Caso sin autorización para nombrar al cliente (CA-04.6) |
| `DISPONIBLE` · `AGENDA LIMITADA` · `SIN DISPONIBILIDAD` | Informativa | Disponibilidad (CA-09.3) |
| `VERIFICADO` | Informativa | Métrica con evidencia (CA-05.3) |
| `PROYECTOS` · `SERVICIOS` · `PERFIL` · `CONTACTO` | Informativa | Navegación principal |
| `ANTERIOR` · `SIGUIENTE` | Informativa | Paginación entre casos (CA-04.5) |
| `CARGA` · `RESPUESTA` · `ESTABILIDAD` | Informativa | Métricas de la sesión (RF-11); el pie enlaza a la explicación en MISSION 000 para no dejar jerga sin explicar (CA-N08.3) |

Consecuencia sobre los moodboards: las etiquetas de estado y de navegación que allí aparecían en inglés (`STATUS: LIVE`, `01 PROJECTS`, `VERIFIED`, `NEXT MISSION`, `NO MISSIONS IN THIS SECTOR`) pasan al español.

## 10. Componentes

### 10.1 Inventario

Carpetas según `docs/02-arquitectura/arquitectura.md`. Los estados `hover` y `focus-visible` se dan por incluidos en todo componente interactivo.

| Componente | Carpeta | Variantes | Estados adicionales | Requisitos |
|---|---|---|---|---|
| `Button` | ui | primario · secundario · fantasma · enlace | activo, deshabilitado, cargando | CA-07.8 |
| `Badge` | ui | estado de proyecto · verificado · confidencial | — | CA-03.1, CA-05.3 |
| `Tag` | ui | tecnología · categoría | — | CA-03.1 |
| `Metric` | ui | normal · compacta | borrador (solo en desarrollo) | RF-05 |
| `StatusIndicator` | ui | disponible · limitada · sin disponibilidad | — | CA-09.3 |
| `Field` · `Select` · `Textarea` · `Checkbox` | ui | — | error, deshabilitado | CA-07.3, CA-N03.4 |
| `Prose` | ui | — | — | Cuerpo de los casos |
| Iconos | ui/icons | 16 · 20 · 24 | — | §8 |
| `Container` · `Section` · `PageHeader` | layout | sección numerada o no | — | — |
| `Header` | layout | escritorio · móvil | menú abierto | CA-08.4 |
| `Footer` | layout | — | — | CA-08.3, CA-11.3, CA-13.3 |
| `ConsentBanner` | layout | — | visible, oculto | CA-10.2 |
| `MainNav` · `MobileNav` | navigation | — | página actual | CA-N03.2 |
| `CommandPalette` | navigation | — | abierta, sin resultados | RF-12 |
| `ViewToggle` | navigation | mapa · cuadrícula · lista | seleccionada | CA-03.4 |
| `FilterBar` | navigation | — | filtros activos | CA-03.2, CA-03.3 |
| `AnchorNav` | navigation | — | sección actual | Servicios |
| `UniverseMap` · `OrbitRing` · `MissionNode` | universe | — | nodo enfocado | Vista exploratoria, regla 25 |
| `MissionCard` | universe | tarjeta · fila (`MissionRow`) | — | CA-01.5, CA-03.1, CA-03.5 |
| `TrajectoryList` | universe | — | — | Mapa por debajo de 1024 px |
| `MissionHeader` · `MissionSection` | mission | — | — | CA-04.1, CA-04.3 |
| `TelemetryPanel` | mission | fijo (≥ 1024 px) · plegable | plegado, desplegado | CA-04.2 |
| `Gallery` · `MissionPagination` | mission | — | — | CA-04.7, CA-04.5 |
| `Hero` · `Capabilities` · `GrowthModel` · `Proof` · `ClosingCTA` · `FAQ` · `Timeline` | sections | — | — | RF-01, RF-02, RF-09 |
| `ContactForm` | forms | — | enviando, enviado, error | RF-07 |
| `TelemetryStrip` · `SessionTelemetry` · `LocalClock` · `BuildInfo` | telemetry | — | métrica no disponible | RF-11, CA-08.3 |

`ConsentBanner` no figuraba en la estructura de `arquitectura.md`, aunque su isla sí: se ubica en `layout/`.

### 10.2 Especificaciones de los componentes críticos

**Button**
- Primario: fondo `accent`, texto `accent-fg`; hover `accent-hover`. Secundario: transparente, borde `line-control`, texto `fg`; hover fondo `surface-hover`. Fantasma: sin borde, texto `fg`, subrayado en hover. Enlace: texto `accent`, subrayado.
- Altura mínima 44 px, radio `md`, texto en rol «Botón».
- Cargando: conserva el ancho, cambia el texto a un gerundio («Enviando…»), `aria-busy="true"` y deja de aceptar pulsaciones (CA-07.8).
- Un primario por pantalla (regla de dirección 4).

**Badge de estado**
- Punto de 8 px + etiqueta informativa en español; borde `line-strong`, radio `sm`.
- Colores del punto: publicado `success`, en desarrollo `warning`, archivado `fg-subtle`. Verificado: icono de verificación y texto en `success`. Confidencial: sin punto.

**Metric**
- Valor en display `4xl`; rótulo en sans `sm` `fg-muted`; fuente y periodo en etiqueta mono `fg-subtle` («GA4 · ENE–JUN 2026»); insignia `VERIFICADO`.
- En producción solo existen métricas verificadas (RF-05). En desarrollo, las no verificadas se muestran con la marca «SIN VERIFICAR» en `warning`, para que el autor las vea.

**Field · Select · Textarea · Checkbox**
- Rótulo visible siempre encima del control; nunca el marcador de posición como rótulo.
- Fondo `surface`, borde `line-control`, altura 48 px, radio `md`; foco con el anillo de `accent`.
- Error: borde `danger`, mensaje en `danger` bajo el campo con icono, `aria-invalid="true"` y `aria-describedby` apuntando al mensaje (CA-07.3, CA-N03.4).
- El mensaje muestra un contador de caracteres (`0 / 5000`).

**MissionCard**
- Portada 16:10 con marco de ventana dibujado en CSS, no incrustado en la imagen; código, categoría y año en etiqueta; `Badge` de estado; título en display `2xl`; resumen de 160 caracteres como máximo; hasta cuatro tecnologías en `Tag`.
- Toda la tarjeta es **un único enlace** al caso (patrón de enlace extendido sobre el título). El enlace al sitio publicado vive en el caso, no en la tarjeta, para no anidar controles.
- Variante fila (`MissionRow`): los mismos datos en una línea tabulada, sin portada. Es la vista de lista simple que exige la regla 25.

**TelemetryPanel** (ficha de la misión)
- Título visible «Ficha técnica» (`h2`) con la etiqueta decorativa `TELEMETRY`.
- Lista de descripción (`dl`): CLIENTE o SECTOR, ROL, TECNOLOGÍAS, SERVICIOS, PERIODO, MÉTRICAS, ENLACES (CA-04.2). Retícula de líneas `line` entre filas.
- A partir de 1024 px, columna derecha fija (`sticky`). Por debajo, un `details` nativo plegado bajo la cabecera del caso: sin JavaScript.

**UniverseMap**
- SVG plano, sin tridimensionalidad (regla 26): órbitas por categoría y un nodo por misión.
- Cada nodo es un enlace real al caso, con nombre accesible. El orden de tabulación es el mismo que el de la lista.
- La `MissionCard` aparece al pasar el puntero **y** al recibir el foco, y se sitúa en HTML fuera del SVG.
- Siempre acompañado de `ViewToggle`: nunca es la única vía (regla 25).

**CommandPalette**
- `dialog` nativo abierto con `showModal()`: atrapa el foco y se cierra con Escape sin código propio.
- Campo de búsqueda con patrón *combobox* y lista de resultados; flechas para moverse, Intro para ejecutar.
- Atajo: Ctrl K, o ⌘ K en Apple; la combinación definitiva la fija la spec (RF-12). Botón visible en la cabecera (CA-12.2).
- Capa de nivel 3, con `overlay` detrás.

**ConsentBanner**
- Región no modal fija abajo; no bloquea la lectura ni la navegación.
- **Aceptar y Rechazar con la misma variante de botón**, mismo tamaño y mismo orden de tabulación contiguo (CA-10.2), más el enlace a la política de privacidad.
- Texto breve: un banner grande puede convertirse en el elemento principal de carga y empeorar el LCP de todas las páginas.

**ContactForm**
- Estados: en reposo → enviando (botón en carga, campos conservados) → enviado (el formulario se sustituye por una confirmación con el plazo de 48 horas hábiles y el foco pasa a su título) → error (aviso en `danger` al inicio del formulario, con lo escrito conservado, opción de reintentar y el foco en el aviso) (CA-07.2, CA-07.5).
- Anuncio de los cambios de estado en una región `aria-live` (CA-N03.4).
- Sin JavaScript, el formulario no puede pasar la verificación anti-automatización: se muestra un aviso con WhatsApp y correo como alternativa.

**Hero**
- Etiqueta decorativa `SYSTEM ONLINE`; `h1` con la declaración de posicionamiento (`profile.positioning`, 120 caracteres como máximo, CA-01.1) y su palabra de énfasis en cursiva y acento; nombre público; entradilla con las cinco áreas de trabajo.
- **Acción primaria: «Escribir por WhatsApp»**; secundaria: «Ver proyectos». Los moodboards invertían el orden; CA-01.1 exige el acceso a WhatsApp visible sin desplazar.
- Todo lo anterior cabe sin desplazar en una ventana de **360 × 640 px** (verificable en la spec con Playwright).
- Fondo: gradiente radial de `surface-hover` a `bg` con grano al 4 %. Ninguna imagen (CA-01.4, regla 10).

### 10.3 Vistas del listado de proyectos

| Vista | Desde | Componente | Notas |
|---|---|---|---|
| Mapa | 1024 px | `UniverseMap` | Exploratoria |
| Cuadrícula | 360 px | `MissionCard` | Vista por defecto |
| Lista | 360 px | `MissionRow` | Lista simple (regla 25) |
| Trayectoria | < 1024 px | `TrajectoryList` | Sustituye al mapa en pantallas estrechas |

Si el visitante eligió la vista mapa y la ventana baja de 1024 px, se muestra la trayectoria sin cambiar la preferencia guardada.

## 11. Imágenes

| Tipo | Proporción | Tamaño de origen | Reglas |
|---|---|---|---|
| Portada de proyecto | 16:10 | 1600 × 1000 | Captura real con encuadre uniforme; texto alternativo obligatorio (CA-03.5) |
| Galería | libre | 2400 px de ancho como máximo | Texto alternativo obligatorio; descripción opcional (CA-04.7) |
| Retrato | 4:5 | 1200 × 1500 | Fondo oscuro neutro, luz lateral, desaturación parcial hacia la paleta (CA-09.1) |
| Imagen astronómica (página de error) | 16:9 | 2400 px de ancho | NASA, ESA o USGS, dominio público o CC BY con atribución; tratada en la paleta |
| Previsualización para redes | 1.91:1 | 1200 × 630 | Plantilla: fondo `bg`, código de misión, título en display, categoría (CA-N07.2) |

- Formatos AVIF y WebP generados en el build; dimensiones siempre declaradas para no desplazar la maquetación.
- Carga diferida salvo en lo visible sin desplazar.
- Texto sobre imagen: solo con `overlay` debajo (CA-N03.7). En el MVP no hay ningún caso.
- Pendiente para la spec de SEO: si las imágenes de previsualización se generan en el build (añade una dependencia y, por tanto, un ADR) o se producen a mano.

## 12. Del documento al código

### 12.1 Bloque de tokens

Contrato para `src/styles/globals.css`. La spec de fundación lo copia tal cual.

```css
@import "tailwindcss";

@theme {
  /* Sin valores por defecto: en el código solo existen los tokens del proyecto (regla 6) */
  --color-*: initial;
  --font-*: initial;
  --text-*: initial;
  --radius-*: initial;
  --shadow-*: initial;
  --inset-shadow-*: initial;
  --drop-shadow-*: initial;
  --ease-*: initial;
  --animate-*: initial;

  --color-bg: #0b0d12;
  --color-bg-elevated: #10131a;
  --color-surface: #151923;
  --color-surface-hover: #1b2030;
  --color-fg: #f2efe8;
  --color-fg-muted: #a9abb3;
  --color-fg-subtle: #8a8e99;
  --color-line: #23272f;
  --color-line-strong: #363b47;
  --color-line-control: #6a707c;
  --color-accent: #ff5a1f;
  --color-accent-hover: #ff7a45;
  --color-accent-fg: #0b0d12;
  --color-success: #6fb583;
  --color-warning: #e2bd4f;
  --color-danger: #f2666f;
  --color-overlay: rgb(11 13 18 / 0.8);

  --font-display: "Instrument Serif", Georgia, "Times New Roman", serif;
  --font-sans: "Geist", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: "Geist Mono", ui-monospace, "SF Mono", Consolas, monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: clamp(1rem, 0.9792rem + 0.0926vw, 1.0625rem);
  --text-lg: clamp(1.125rem, 1.0833rem + 0.1852vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1667rem + 0.3704vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.375rem + 0.5556vw, 1.875rem);
  --text-3xl: clamp(1.75rem, 1.5rem + 1.1111vw, 2.5rem);
  --text-4xl: clamp(2rem, 1.5833rem + 1.8519vw, 3.25rem);
  --text-5xl: clamp(2.25rem, 1.6667rem + 2.5926vw, 4rem);
  --text-6xl: clamp(2.5rem, 1.5833rem + 4.0741vw, 5.25rem);

  --leading-display: 1;
  --leading-tight: 1.1;
  --leading-snug: 1.3;
  --leading-normal: 1.5;
  --leading-relaxed: 1.65;

  --tracking-tight: -0.01em;
  --tracking-data: 0.02em;
  --tracking-label: 0.14em;

  --spacing-gutter: clamp(1.25rem, 0.1667rem + 4.8148vw, 4.5rem);
  --spacing-section: clamp(4rem, 2.6667rem + 5.9259vw, 8rem);
  --container-page: 90rem;

  --radius-sm: 2px;
  --radius-md: 4px;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}

/* Tokens sin espacio de nombres en Tailwind: se usan con la sintaxis de variable, p. ej. z-(--z-header) */
:root {
  --duration-micro: 120ms;
  --duration-ui: 240ms;
  --duration-section: 480ms;
  --duration-cinematic: 900ms;

  --z-base: 0;
  --z-raised: 1;
  --z-sticky: 100;
  --z-header: 200;
  --z-banner: 300;
  --z-overlay: 400;
  --z-console: 500;
  --z-toast: 600;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-section: 0ms;
    --duration-cinematic: 0ms;
  }
}
```

El gradiente y el grano del hero se definen en la misma hoja a partir de estos tokens, nunca con valores literales en el componente. Cómo se escriben (variables CSS o utilidades propias) lo decide la spec de fundación.

### 12.2 Uso en componentes

- Utilidades resultantes: `bg-bg`, `bg-surface`, `text-fg-muted`, `border-line-control`, `font-display`, `text-6xl`, `leading-display`, `tracking-label`, `px-gutter`, `py-section`, `max-w-page`, `rounded-md`, `ease-out-expo`, `duration-(--duration-ui)`, `z-(--z-header)`.
- Prohibidos en `src/components/` y `src/pages/`: valores arbitrarios de color, tamaño, espaciado, radio o duración (`bg-[#…]`, `text-[18px]`, `p-[13px]`, `rgb(…)`, `style="color:…"`).

### 12.3 Verificación

La spec de fundación debe incluir:

1. **Prueba de contraste**: lee los tokens de color de `globals.css`, recalcula la matriz de §2.2 y falla si algún par baja de su mínimo. Evita que un cambio de valor rompa la regla 24 sin que nadie lo note.
2. **Comprobación de literales**: busca en `src/components/` y `src/pages/` los patrones prohibidos de §12.2 y falla en la integración continua si encuentra alguno. Sin dependencia nueva.
3. **Prueba del hero en 360 × 640**: el nombre, el enunciado y el acceso a WhatsApp son visibles sin desplazar (CA-01.1).
4. **Presupuesto de fuentes**: como máximo 3 familias y 6 archivos servidos (CA-N01.5), dentro de la medición de rendimiento.
