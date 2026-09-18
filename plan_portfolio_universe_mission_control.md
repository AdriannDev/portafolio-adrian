# Plan de Desarrollo — Plataforma Profesional “The Universe + Mission Control”

**Versión:** 1.0  
**Estado:** Planificación / arquitectura inicial  
**Tecnología base:** Next.js + TypeScript

---

## 1. Visión del proyecto

El proyecto no se plantea como un portfolio tradicional, sino como una **plataforma profesional digital evolutiva**.

La primera versión mostrará los trabajos realizados hasta ahora —desarrollo web corporativo, ecommerce y portfolios— y presentará una propuesta profesional que combine:

- Desarrollo web.
- E-commerce.
- SEO.
- Google Ads.
- Google Analytics / Google Tag Manager.
- Medición y optimización digital.

La arquitectura se diseñará desde el inicio para crecer posteriormente hacia una especialización más profunda en:

- Backend.
- Arquitectura de software.
- APIs y sistemas distribuidos.
- Microservicios.
- Automatizaciones.
- Inteligencia artificial.
- Proyectos personales y experimentales.

La sección **Lab** será el espacio destinado a esa evolución.

### Idea central

> Construir sistemas digitales que no solo se vean bien, sino que puedan medirse, optimizarse y evolucionar.

---

# 2. Concepto creativo

## 2.1 Concepto seleccionado

### The Universe + Mission Control

El concepto visual combina dos ideas:

**The Universe**

El portfolio se percibe como un universo digital que el visitante puede explorar. Los proyectos son cuerpos celestes, puntos de interés o destinos dentro de ese universo.

**Mission Control**

La experiencia incorpora una segunda capa más técnica: cada proyecto puede presentarse como una misión, con información sobre objetivos, rol, tecnología, arquitectura, resultados y estado.

La combinación busca transmitir:

- Exploración.
- Ingeniería.
- Tecnología.
- Curiosidad.
- Precisión.
- Evolución.
- Profundidad técnica.

## 2.2 Referencias estéticas

La dirección visual puede inspirarse en:

- Ciencia ficción cinematográfica.
- Interstellar.
- Interfaces de centros de control.
- NASA y observatorios.
- Cartografía espacial.
- Sistemas científicos.
- Editorial design.
- Fotografía astronómica.
- Arquitectura minimalista.

Debe evitarse el aspecto de “web gamer futurista”.

La intención es conseguir una estética:

**cinematográfica + científica + minimalista + profesional.**

---

# 3. Principios UI/UX

## 3.1 La experiencia primero

La estética espacial no debe perjudicar:

- legibilidad,
- navegación,
- accesibilidad,
- rendimiento,
- SEO,
- conversión.

## 3.2 El universo como metáfora, no como decoración

No es necesario utilizar planetas 3D en cada sección.

Los recursos espaciales deben servir para:

- organizar información,
- crear orientación,
- representar evolución,
- reforzar la identidad,
- generar momentos memorables.

## 3.3 80% UX + 20% magia

Primero debe existir una experiencia sólida.

Después se incorporan:

- parallax,
- transiciones cinematográficas,
- partículas,
- WebGL,
- elementos 3D,
- scroll storytelling.

## 3.4 Mobile first

La experiencia espacial debe adaptarse a dispositivos móviles sin depender de interacciones que solamente funcionen con mouse.

---

# 4. Dirección visual

## 4.1 Paleta

Dirección inicial:

- Fondo espacial oscuro.
- Gris carbón.
- Blanco / blanco roto.
- Tonos neutros.
- Un único color de acento.

El color de acento debe utilizarse para:

- estados activos,
- navegación,
- puntos de interés,
- CTA,
- datos importantes.

## 4.2 Tipografía

Se recomienda una combinación de:

**Tipografía editorial / display**
- Titulares.
- Mensajes principales.
- Statements.

**Tipografía técnica / sans**
- Datos.
- Metadatos.
- Navegación.
- Tecnologías.
- Métricas.

## 4.3 Recursos gráficos

- Líneas orbitales.
- Coordenadas.
- Grids.
- Puntos de navegación.
- Indicadores de estado.
- Numeración de misiones.
- Ruido/grain sutil.
- Gradientes extremadamente controlados.
- Fotografías grandes.

---

# 5. Arquitectura de información

```text
/
├── Home
│
├── Projects
│   ├── EVOX
│   ├── Tensolanas Perú
│   ├── Andeccoberturas
│   ├── Photography Portfolio
│   └── Advertising / Digital Media Portfolio
│
├── Services
│   ├── Web Development
│   ├── E-commerce
│   ├── SEO
│   ├── Google Ads
│   └── Analytics / Tracking
│
├── About
│
├── Lab
│
├── Journal
│
└── Contact
```

## 5.1 MVP

La primera versión debe limitarse a:

```text
/
├── Projects
├── Projects/[slug]
├── Services
├── About
└── Contact
```

**Lab** y **Journal** pueden estar preparados arquitectónicamente, pero no necesitan desarrollarse completamente en el MVP.

---

# 6. Estructura de la Home

La Home debe funcionar como una experiencia narrativa.

## 6.1 Entrada

Ejemplo conceptual:

```text
SYSTEM ONLINE

DIGITAL ENGINEERING

I BUILD DIGITAL
SYSTEMS THAT
MOVE BUSINESSES
FORWARD.

[ EXPLORE WORK ]
```

No es necesario utilizar literalmente estos textos; representan la intención visual.

## 6.2 Universo / selección de proyectos

Los proyectos aparecen como puntos dentro de un espacio.

```text
                 ● EVOX

       ·

                         ● TENSOL

  ✦

             ● ANDECC

                  YOU ARE HERE
```

La interacción puede permitir seleccionar una misión.

## 6.3 Capabilities

```text
01 — WEB ENGINEERING
02 — E-COMMERCE
03 — SEO
04 — PAID TRAFFIC
05 — ANALYTICS
```

## 6.4 Modelo de crecimiento

Una sección central:

```text
BUILD
  ↓
MEASURE
  ↓
OPTIMIZE
  ↓
GROW
```

Esto conecta desarrollo con servicios de crecimiento digital.

## 6.5 Cierre

CTA final orientado a contacto:

```text
READY TO START
A NEW MISSION?

[ CONTACT ]
```

---

# 7. Projects

La página de proyectos debe funcionar como un mapa o catálogo de misiones.

Cada proyecto tendrá:

- Nombre.
- Categoría.
- Año.
- Estado.
- Rol.
- Tecnologías.
- Imagen principal.
- Breve descripción.
- Enlace al caso de estudio.
- Enlace al sitio publicado cuando corresponda.

## Proyectos iniciales

1. EVOX — Ecommerce.
2. Tensolanas Perú — Web corporativa.
3. Andeccoberturas — Web corporativa.
4. Portfolio de fotografía.
5. Portfolio de publicidad y medios digitales.

---

# 8. Case Studies

Cada proyecto importante debe tener una página propia.

## Estructura

```text
MISSION / EVOX

OBJECTIVE
Problema y objetivo del proyecto.

ROLE
Responsabilidades realizadas.

APPROACH
Decisiones y estrategia.

TECHNOLOGY
Stack utilizado.

ARCHITECTURE
Descripción técnica cuando sea relevante.

EXPERIENCE
Diseño y experiencia.

SEO
Implementación SEO.

ANALYTICS
Medición y tracking.

RESULT
Resultado real del proyecto.

LESSONS
Aprendizajes.

[ VISIT WEBSITE ]
```

## Regla importante

Nunca inventar métricas.

Si existen datos reales, pueden mostrarse:

- tráfico,
- conversiones,
- rendimiento,
- resultados SEO,
- eventos,
- mejoras.

Si no existen, se presenta el resultado cualitativo.

---

# 9. Services

La plataforma debe comunicar que el servicio no termina al publicar una web.

## Web Development

- Websites corporativos.
- Landing pages.
- Portfolios.
- Aplicaciones web.
- Integraciones.

## E-commerce

- Tiendas online.
- Catálogo.
- Checkout.
- Integraciones.
- Analytics.

## SEO

- SEO técnico.
- Metadata.
- Structured Data.
- Sitemap.
- Core Web Vitals.
- Optimización de contenido.

## Google Ads

- Configuración.
- Tracking.
- Campañas.
- Conversiones.
- Optimización.

## Analytics

- Google Analytics.
- Google Tag Manager.
- Eventos.
- Conversion tracking.
- Análisis de comportamiento.

---

# 10. Posicionamiento profesional

El portfolio debe evolucionar de:

> “Soy desarrollador y hago páginas web.”

hacia:

> “Construyo sistemas digitales que ayudan a negocios a crecer.”

El posicionamiento debe comunicar tres capacidades:

```text
BUILD
Desarrollo

MEASURE
Analítica

GROW
Optimización
```

Esto permite que el proyecto tenga una identidad profesional más amplia.

---

# 11. Arquitectura técnica

## Stack principal

### Frontend / aplicación

- Next.js.
- React.
- TypeScript.

### Animación

- GSAP, incorporado progresivamente.
- CSS animations/transitions para interacciones simples.

### 3D / experiencias especiales

- Three.js, únicamente cuando aporte valor real.

### Contenido

Para el MVP se puede comenzar con:

- MDX.
- Archivos estructurados.
- Contenido versionado junto al proyecto.

Posteriormente se puede incorporar un CMS si el volumen de contenido lo justifica.

### Hosting

Una opción natural para Next.js es Vercel, aunque la arquitectura debe mantener el proyecto razonablemente portable.

---

# 12. Principio tecnológico

No utilizar una tecnología solamente porque sea posible.

Ejemplo:

- Una transición CSS no necesita GSAP.
- Una animación compleja puede justificar GSAP.
- Un efecto 3D real puede justificar Three.js.
- Un fondo con partículas no necesariamente necesita WebGL.
- Un portfolio no necesita microservicios en su primera versión.

La arquitectura debe crecer según las necesidades reales.

---

# 13. Estructura de carpetas propuesta

```text
src/
│
├── app/
│   ├── page.tsx
│   │
│   ├── projects/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── services/
│   │   └── page.tsx
│   │
│   ├── about/
│   │   └── page.tsx
│   │
│   ├── contact/
│   │   └── page.tsx
│   │
│   └── api/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── navigation/
│   ├── animations/
│   ├── projects/
│   └── sections/
│
├── content/
│   ├── projects/
│   └── services/
│
├── lib/
│   ├── analytics/
│   ├── seo/
│   └── utils/
│
├── styles/
│
└── config/
```

Esta estructura debe mantenerse flexible. No es necesario crear carpetas o abstracciones que todavía no tengan una función real.

---

# 14. Modelo de contenido de proyectos

Los proyectos deben tratarse como contenido estructurado.

Ejemplo conceptual:

```ts
{
  slug: "evox",
  title: "EVOX",
  category: "ecommerce",
  year: 2026,
  featured: true,
  status: "live",
  role: [
    "Development",
    "Architecture",
    "Analytics"
  ],
  technologies: [
    "Next.js",
    "TypeScript"
  ],
  summary: "...",
  challenge: "...",
  approach: "...",
  result: "...",
  externalUrl: "..."
}
```

El modelo puede evolucionar según los proyectos futuros.

---

# 15. Design System

Antes de desarrollar todas las páginas debe definirse un pequeño sistema visual.

## Componentes iniciales

```text
Button
Navigation
Container
Grid
ProjectCard
ProjectHeader
SectionTitle
Badge
Metric
Image
Tag
Timeline
StatusIndicator
```

## Tokens

Definir:

- colores,
- tipografía,
- tamaños,
- spacing,
- border radius,
- sombras,
- breakpoints,
- velocidades de animación,
- easing.

El objetivo es evitar diseñar cada página como un proyecto independiente.

---

# 16. Navegación

La navegación puede reforzar el concepto de exploración.

Ejemplo:

```text
YOUR NAME

01 WORK
02 SERVICES
03 ABOUT
04 LAB
05 CONTACT
```

Puede incorporar elementos como:

```text
SYSTEM 01
ONLINE
```

o coordenadas/estado, siempre que no dificulten la navegación.

En móvil debe simplificarse.

---

# 17. Lab

## Propósito

El Lab representa la evolución profesional.

No estará limitado al desarrollo frontend.

Puede contener proyectos de:

```text
BACKEND
APIs
ARCHITECTURE
MICROSERVICES
AUTOMATION
AI
DATABASES
EXPERIMENTS
```

## Ejemplo

```text
LAB 001
AUTOMATION SYSTEM

LAB 002
AI EXPERIMENT

LAB 003
MICROSERVICE ARCHITECTURE

LAB 004
BACKEND API

LAB 005
DATA PIPELINE
```

Cada proyecto puede documentar:

- Problema.
- Arquitectura.
- Decisiones.
- Tecnologías.
- Diagramas.
- Código relevante.
- Aprendizajes.

El Lab puede convertirse posteriormente en una de las partes más importantes de la plataforma.

---

# 18. Journal

Se plantea como una extensión futura.

Contenido posible:

- Ingeniería de software.
- Desarrollo web.
- SEO.
- Analytics.
- Arquitectura.
- Backend.
- Automatización.
- IA.

Además de compartir conocimiento, puede funcionar como estrategia de SEO.

---

# 19. SEO

El propio portfolio debe ser un caso de estudio de SEO.

## SEO técnico

Implementar:

- Metadata dinámica.
- Open Graph.
- URLs limpias.
- Canonical.
- Sitemap.
- Robots.
- Structured Data.
- Schema.org.
- Optimización de imágenes.
- Core Web Vitals.
- Accesibilidad.
- Buen HTML semántico.

## SEO de contenido

Crear contenido útil posteriormente mediante Journal/Case Studies.

La estrategia debe evitar contenido creado únicamente para llenar palabras clave.

---

# 20. Analytics y tracking

Integrar progresivamente:

- Google Analytics 4.
- Google Tag Manager.
- Google Search Console.

## Eventos sugeridos

```text
project_view
project_external_click
service_view
contact_start
contact_submit
cv_download
whatsapp_click
```

Los nombres pueden modificarse durante la implementación.

El objetivo es poder medir el comportamiento real de la plataforma.

---

# 21. Google Ads

Google Ads debe integrarse como parte de la propuesta de Digital Growth.

La arquitectura de tracking debe permitir posteriormente medir:

```text
AD
 ↓
LANDING
 ↓
INTERACTION
 ↓
CONVERSION
```

La implementación debe separar correctamente:

- adquisición,
- comportamiento,
- conversión.

---

# 22. Performance

La experiencia visual no puede convertirse en una carga excesiva.

Principios:

- Optimizar imágenes.
- Utilizar formatos modernos.
- Lazy loading cuando corresponda.
- Reducir JavaScript innecesario.
- Evitar librerías innecesarias.
- Cargar WebGL de forma progresiva.
- Preferir CSS para animaciones simples.
- Mantener buena experiencia en dispositivos móviles.
- Revisar Core Web Vitals.

---

# 23. Accesibilidad

Debe considerarse desde el diseño:

- Contraste adecuado.
- Navegación mediante teclado.
- Estados focus.
- HTML semántico.
- Textos alternativos.
- Jerarquía correcta de headings.
- Respeto a `prefers-reduced-motion`.
- No depender exclusivamente del movimiento.

El universo visual debe tener una alternativa funcional para usuarios que reduzcan animaciones.

---

# 24. MVP

## Incluido

### Home

- Hero.
- Universo / proyectos destacados.
- Capabilities.
- Build → Measure → Optimize → Grow.
- CTA.

### Projects

- Catálogo.
- Filtros simples si son necesarios.
- Proyectos destacados.

### Project Detail

- Case study.
- Información técnica.
- Galería.
- Enlace externo.

### Services

- Desarrollo.
- Ecommerce.
- SEO.
- Ads.
- Analytics.

### About

- Perfil profesional.
- Enfoque.
- Evolución.

### Contact

- Formulario.
- Canales de contacto.

---

# 25. Fuera del MVP

No es prioritario inicialmente:

- Sistema 3D complejo.
- CMS avanzado.
- Backend complejo.
- Microservicios.
- Sistema de usuarios.
- Dashboard privado.
- Automatizaciones internas.
- IA integrada.
- Journal completo.
- Lab completo.

Estas funcionalidades deben aparecer cuando exista una necesidad real.

---

# 26. Roadmap de desarrollo

## Fase 0 — Estrategia

**Objetivo:** definir la identidad del proyecto.

Entregables:

- Posicionamiento.
- Público objetivo.
- Propuesta de valor.
- Arquitectura general.
- Dirección conceptual.

---

## Fase 1 — Art Direction

**Objetivo:** convertir “The Universe + Mission Control” en un sistema visual.

Definir:

- Moodboard.
- Tipografías.
- Colores.
- Grid.
- Componentes.
- Estilo fotográfico.
- Movimiento.
- Iconografía.

---

## Fase 2 — UX Architecture

Definir:

- Sitemap.
- Navegación.
- User flows.
- Wireframes.
- Estructura de Home.
- Estructura de Case Studies.

---

## Fase 3 — Technical Architecture

Definir:

- Next.js.
- TypeScript.
- Estructura de carpetas.
- Modelo de contenido.
- Estrategia de imágenes.
- SEO.
- Analytics.
- Deployment.

---

## Fase 4 — Design System

Construir:

- Typography.
- Colors.
- Spacing.
- Buttons.
- Cards.
- Navigation.
- Sections.
- Project components.
- Motion system.

---

## Fase 5 — MVP Development

Implementar:

1. Layout.
2. Navigation.
3. Home.
4. Projects.
5. Case Studies.
6. Services.
7. About.
8. Contact.

---

## Fase 6 — Motion & Interaction

Incorporar:

- GSAP.
- Scroll storytelling.
- Transiciones.
- Parallax.
- Microinteracciones.
- Universo interactivo.

Three.js solamente donde aporte una experiencia que no pueda conseguirse razonablemente con tecnologías más simples.

---

## Fase 7 — SEO & Analytics

Implementar:

- SEO técnico.
- Schema.
- Search Console.
- GA4.
- GTM.
- Eventos.
- Conversion tracking.

---

## Fase 8 — Performance & Accessibility

Auditar:

- Lighthouse.
- Core Web Vitals.
- Mobile.
- Keyboard navigation.
- Screen readers.
- Reduced motion.
- Bundle size.
- Imágenes.

---

## Fase 9 — Launch

Checklist:

- Dominio.
- HTTPS.
- Metadata.
- Sitemap.
- Robots.
- OG images.
- Analytics.
- Formularios.
- Links.
- Mobile.
- Performance.
- Accessibility.
- SEO.

---

# 27. Evolución futura

La arquitectura debe permitir evolucionar hacia:

```text
PORTFOLIO
    │
    ├── WEB
    ├── E-COMMERCE
    ├── SEO
    ├── ADS
    └── ANALYTICS
             │
             ▼
            LAB
             │
      ┌──────┼────────┐
      ▼      ▼        ▼
   BACKEND  AI   AUTOMATION
      │
      ▼
 ARCHITECTURE
      │
      ▼
 MICROSERVICES
```

La plataforma puede terminar representando no solamente los servicios actuales, sino la evolución profesional completa.

---

# 28. Principios de arquitectura

## 1. Evolucionar sin sobreingeniería

Construir solamente lo que el proyecto necesita hoy, dejando puntos claros de extensión.

## 2. Separar contenido y presentación

Los proyectos deben poder modificarse sin tener que reconstruir manualmente cada página.

## 3. Performance como requisito

La experiencia visual no debe justificar una web lenta.

## 4. Accesibilidad desde el inicio

No tratarla como una tarea posterior.

## 5. SEO desde arquitectura

No añadir SEO al final.

## 6. Medición desde el lanzamiento

La plataforma debe poder responder qué funciona y qué no.

## 7. La tecnología debe servir al concepto

Nunca al contrario.

---

# 29. Definición final del proyecto

### Nombre conceptual

**The Universe**

### Sistema visual

**The Universe + Mission Control**

### Naturaleza

**Plataforma profesional digital evolutiva**

### Stack principal

**Next.js + React + TypeScript**

### Animación

**GSAP**

### 3D / WebGL

**Three.js, de forma selectiva**

### Contenido inicial

**Proyectos + Case Studies + Services + About + Contact**

### Evolución

**Lab + Journal + Backend + Architecture + Automation + AI**

### Filosofía

> Build. Measure. Optimize. Grow.

---

# 30. Próximo paso recomendado

No comenzar directamente programando la Home.

El siguiente paso debe ser:

**FASE 1 — ART DIRECTION**

Crear tres exploraciones visuales concretas del concepto híbrido:

1. **Universe Minimal** — universo elegante, editorial y muy limpio.
2. **Mission Control** — interfaz técnica, datos y navegación de misión.
3. **Cinematic Universe** — experiencia más inmersiva y cinematográfica.

Después de elegir la dirección, se define el **Design System**, luego los wireframes y finalmente la arquitectura de implementación en Next.js.

Esto reduce el riesgo de construir una arquitectura técnicamente correcta alrededor de una identidad visual que todavía no está definida.
