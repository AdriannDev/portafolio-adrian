# Brief · Portafolio Adrián Marchan — "The Universe + Mission Control"

<!-- Fase 1. Una página. Lo lee cualquier persona (y Claude en cada spec). Fuente previa: plan_portfolio_universe_mission_control_v2.md (raíz). -->

| Campo | Valor |
|---|---|
| Fecha | 2026-09-17 |
| Tier | **2 · Producción** — lo usan clientes reales y potenciales; recoge datos personales por formulario (nombre, email, empresa); de él dependen leads del negocio. No es Tier 3: no procesa pagos ni datos sensibles. |
| Tipo | web (sitio de contenido + formulario) |
| Estado | Gate 1 superado (2026-09-17) |
| Cambios | 2026-09-26: la automatización sustituye a la publicidad de pago como área de servicio, por decisión de negocio tomada al revisar el diseño de la portada |

## Problema

Dos problemas conectados, uno propio y uno del mercado al que sirve.

1. **Propio.** Adrián trabaja en cinco frentes (desarrollo web, e-commerce, automatización, SEO, analítica) y tiene proyectos publicados, pero no existe un lugar donde eso se pueda comprobar. Hoy los clientes llegan por referencia y cada conversación comercial empieza desde cero: explicando qué hace, sin casos a mano y sin pruebas de resultado. Ocurre **en cada conversación comercial**.
2. **Del cliente.** Las PYMES de Perú y LATAM contratan webs que se ven bien pero que nadie mide: no saben si venden, ni qué mejorar después del lanzamiento. Encargan una web y reciben un archivo, no un sistema que crezca.

El portafolio resuelve el primero demostrando que el segundo se puede resolver.

## Para quién

| Audiencia | Prioridad | Qué necesita comprobar en menos de 30 s |
|---|---|---|
| **A · Dueños y gerentes de PYME (Perú / LATAM)** | Principal en el MVP | Que hay trabajos reales parecidos al suyo, servicios claros y una forma inmediata de escribir |
| **B · Agencias y partners** | Secundaria | Que hay oficio técnico y un proceso serio detrás |
| **C · Empresas tech y reclutadores** | Futura (v1.1+) | Profundidad de ingeniería y criterio de arquitectura |

Fichas completas y flujos paso a paso: [usuarios.md](usuarios.md).

La audiencia A determina tres cosas: el idioma (español), el tono (claro, sin jerga innecesaria) y el canal de contacto principal (WhatsApp).

## Solución en una frase

Un portafolio evolutivo que presenta cada proyecto como una "misión" con datos verificables, explica el modelo Construir → Medir → Optimizar → Crecer y se audita a sí mismo en público.

## Alcance de la primera entrega (MVP)

Cinco capacidades. Nada fuera de esta lista entra en el MVP.

| # | Capacidad | El visitante puede... |
|---|---|---|
| **C1** | Comunicar propuesta de valor y servicios | Entender en segundos qué hace Adrián, en qué cinco áreas trabaja y con qué modelo de trabajo |
| **C2** | Demostrar trabajo con casos verificables | Recorrer los proyectos, abrir el detalle de cada uno y ver resultados con su fuente y periodo |
| **C3** | Captar contacto cualificado | Escribir por WhatsApp, copiar el email o enviar un formulario indicando tipo de proyecto y presupuesto orientativo |
| **C4** | Dar credibilidad personal | Ver quién está detrás: trayectoria, forma de trabajar, disponibilidad actual |
| **C5** | Medirse a sí mismo | Consentir o rechazar la medición, y ver las métricas de rendimiento de su propia visita |

Requisitos transversales al MVP (no cuentan como capacidad): página de error, página de privacidad, navegación completa por teclado, indexabilidad.

## Fuera de alcance (explícito)

- **Lab** y **Journal**: se construyen cuando existan 3 o más entradas reales. Una sección vacía resta credibilidad.
- **Versión en inglés / i18n**: el contenido será solo español (es-PE). No se prepara infraestructura de idiomas.
- **3D y WebGL**: ningún elemento tridimensional. El mapa de proyectos es plano.
- **Sonido**: ninguno, ni siquiera opcional.
- **Landings individuales por servicio**: v1.1, cuando haya inversión en anuncios propios que las justifique.
- **Panel de administración o CMS externo**: el contenido lo edita su autor en archivos versionados.
- **Blog** y **newsletter**: no en esta entrega.
- **Cualquier dato de cliente sin permiso escrito**: el caso se publica sin nombrar al cliente, o no se publica.

## Restricciones

**Técnicas**

- Trabajo individual con asistencia de IA; sin equipo ni revisores externos.
- Entorno de desarrollo: Windows 11, Git Bash, Claude Code CLI.
- No debe requerir un servidor de aplicación encendido de forma permanente, y la única operación de servidor prevista es el envío del formulario. Es una consecuencia del presupuesto, no una decisión de arquitectura: la arquitectura concreta se decide en la Fase 2.
- El sistema **no almacena** las consultas del formulario: las entrega al buzón del negocio. Reduce la superficie de datos personales y es coherente con la restricción anterior.

**De negocio**

- **Sin fecha de lanzamiento**: manda la calidad. Se mitiga con fecha de cierre por iteración (ver riesgos).
- Presupuesto de operación: **aproximadamente 2 USD/mes** (dominio amortizado más servicios en capa gratuita). Excluye tipografías de pago y planes de alojamiento de pago. **Este brief prevalece sobre la recomendación de alojamiento de pago del plan v2 (§8.1): la Fase 2 no debe heredarla.**
- La plataforma de alojamiento debe permitir **uso comercial** en la capa contratada: el sitio vende servicios.
- Plazo de respuesta comprometido a quien contacta: **48 horas hábiles** (se muestra en el sitio, ver CA-07.2).

**De operación**

- Lo mantiene una sola persona, en horas residuales entre trabajos de cliente.
- El contenido de las misiones depende de permisos de terceros (clientes) y de material que aún no existe (capturas, retrato).
- Cumplimiento de la Ley 29733 de protección de datos personales (Perú) en el formulario y en la medición.

## Criterios de éxito

Medidos **desde el lanzamiento**, no desde hoy.

| # | Criterio | Objetivo | Plazo |
|---|---|---|---|
| E1 | Tasa de lead (contactos / sesiones medibles) | 2 % o más | 3 meses |
| E2 | Sesiones medibles que abren al menos un caso de estudio | 40 % o más | 3 meses |
| E3 | Las tres métricas de experiencia de carga (carga del contenido principal, respuesta a interacciones, estabilidad visual) | 100 % en rango "bueno" | 3 meses |
| E4 | Consultas locales objetivo en los 10 primeros resultados | entre 3 y 5 consultas | 6 meses |
| E5 | Misiones publicadas con métrica y evidencia archivada | 100 % | al lanzar |

Definiciones que hacen medibles estos criterios:

- **Contacto** (E1): en el formulario, la confirmación de entrega devuelta por el servidor; en WhatsApp y en el correo electrónico, la activación del acceso por parte del visitante. Para los canales directos se mide intención de contacto, no recepción del mensaje. Detalle en CA-10.5.
- **Sesión medible** (E1, E2): solo las sesiones de visitantes que consintieron la medición. Las tasas se calculan sobre ese subconjunto, no sobre el tráfico total.
- **E3** se mide con datos de campo, que requieren un volumen mínimo de visitas reales. Hasta alcanzarlo se verifica con mediciones de laboratorio en el perfil de referencia de RNF-01.
- **E5** es el criterio que protege la credibilidad: sin evidencia archivada, el número no se publica.

## Riesgos conocidos

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| **Sin fecha de lanzamiento el proyecto no se publica**: el trabajo de cliente siempre entra antes | alta | alto | No se fija fecha global, pero **cada iteración lleva fecha de cierre** y termina en retro. Si una iteración llega a su fecha sin cerrar, se reduce su alcance, no se mueve la fecha |
| Falta material visual: no hay capturas ni retrato | alta | alto | Producirlos es tarea explícita de contenido antes de la fase de diseño; las capturas se generan automatizadas y con encuadre uniforme. Son requisito: imagen de portada por proyecto (CA-03.5), galería opcional (CA-04.7), retrato (CA-09.1), imagen de previsualización por página (CA-N07.2) |
| Los permisos de cliente se retrasan o se deniegan | media | medio | Permiso por escrito solicitado por adelantado; alternativa prevista: caso sin nombrar al cliente |
| El concepto se percibe como "otro portafolio espacial" | media | alto | La diferencia está en el funcionamiento (exploración, consola, telemetría), no en la estética. Los anti-patrones concretos (cursor propio, pantalla de espera larga, desplazamiento alterado, sonido, elementos 3D) están prohibidos de forma verificable en CA-N03.9 |
| Sobre-alcance por entusiasmo (Lab, Journal, 3D, animación) | alta | medio | Fuera de alcance explícito arriba; cada añadido exige spec y pasa por el roadmap |
| El rendimiento se degrada al añadir animación | media | alto | Presupuesto de rendimiento verificado de forma automática antes de cada integración |
| Métricas no verificables publicadas por descuido | baja | alto | Regla estructural: sin fuente y evidencia archivada, el dato no se muestra |
| Los KPIs de negocio dependen de tráfico que aún no existe | alta | medio | E1 y E2 se miden como tasas sobre sesiones medibles, no como totales; E3 se verifica en laboratorio hasta tener volumen de campo; E4 reconoce 6 meses de plazo |

## Preguntas abiertas

- [ ] Rangos de precio "desde" por servicio (se necesitan al especificar la página de servicios). Dueño: Adrián.
- [ ] Dominio definitivo. Se cierra antes del lanzamiento. Dueño: Adrián.
- [ ] Consultas locales objetivo para E4 (entre 3 y 5). Se definen con investigación de palabras clave antes de escribir los textos.
- [ ] Callsign o firma visual (por ejemplo `AM-01`). Se decide en la fase de dirección de arte.
- [ ] Nombre público del autocaso (MISSION 000). Se decide junto con la marca.
- [ ] Email público y perfiles sociales (LinkedIn, GitHub) a mostrar en el sitio. Los exige CA-08.5. Dueño: Adrián.
- [ ] **Retrato**: lo exige CA-09.1 (Must) y hoy no existe. Requiere una sesión de fotos. Dueño: Adrián.
- [ ] **Currículum** en formato imprimible: lo pide RF-14 (Could) y hoy no existe. Si no se produce, no bloquea el lanzamiento. Dueño: Adrián.
- [ ] **Perfil de dispositivo y red de referencia** para las mediciones de RNF-01: se fija en la Fase 2 al elegir la herramienta de medición y se anota en la constitución del proyecto.

## Datos del negocio para el contenido del sitio

- Nombre público: **Adrián Marchan**.
- WhatsApp (canal de contacto principal): **+51 937 422 519** (enlace directo `wa.me/51937422519`).
- Plazo de respuesta declarado: **48 horas hábiles**.
- Ubicación declarada: Lima, Perú. Modalidad: remoto.
