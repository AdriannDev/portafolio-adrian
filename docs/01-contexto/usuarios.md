# Usuarios · Portafolio Adrián Marchan

<!-- Fase 1. Una ficha por tipo de usuario. Sirve para escribir historias en las specs y casos de prueba en QA.
     Los flujos numerados son los recorridos que el subagente qa-tester debe poder reproducir. -->

## Persona 1 · "Rosa, dueña de una distribuidora en Lima" (audiencia A · principal)

- **Quién es**: 45 años, dueña de un negocio de 8 empleados en Lima. Vende por catálogo de WhatsApp y quiere una tienda en línea. Nivel técnico bajo: usa el teléfono para casi todo y desconfía de la jerga.
- **Qué necesita lograr**: encontrar a alguien de confianza que le haga una web que venda, sin que le hablen en términos que no entiende ni le desaparezcan a mitad del proyecto.
- **Cómo lo hace hoy**: pide recomendaciones en grupos de WhatsApp y busca en Google "hacer página web Lima". Le han presupuestado tres veces con precios muy distintos y sin explicar qué incluye cada uno. Una vez le entregaron una web que nunca salió en Google.
- **Frecuencia de uso**: una o dos visitas antes de decidir; luego no vuelve.
- **Dispositivo / entorno**: teléfono Android de gama media, datos móviles, a menudo con mala señal. Pantalla de 360 a 390 px.
- **Qué le haría abandonar**: que tarde en cargar; que no encuentre precios ni ejemplos; que no haya WhatsApp; que todo esté en inglés; que parezca de una agencia grande y por tanto cara.
- **Flujos principales**:
  1. **Descubrir y contactar rápido**: entra desde el teléfono → lee la declaración de posicionamiento sin desplazar → reconoce "comercio electrónico" entre las áreas → pulsa el acceso a WhatsApp, visible sin desplazar → escribe con el mensaje ya redactado. *(Este es el flujo que el sitio debe optimizar por encima de todos.)* Garantizado por CA-01.1, CA-01.2 y CA-08.1.
  2. **Comprobar antes de escribir**: entra → baja en la misma página hasta la selección de proyectos destacados → abre el caso más parecido a su negocio → ve el resultado con su fuente y periodo → abre el sitio real del proyecto en una pestaña nueva → vuelve → contacta. Garantizado por CA-01.5, CA-04.1, CA-05.1 y CA-04.4.
  3. **Verificar precio**: entra → va a servicios → busca "desde cuánto" en comercio electrónico → si encaja, contacta; si no, se va (y eso también es un éxito: no se pierde tiempo mutuo). Garantizado por CA-02.3.

## Persona 2 · "Diego, director de una agencia de marketing" (audiencia B · secundaria)

- **Quién es**: 34 años, dirige una agencia pequeña en Lima. Necesita un desarrollador externo fiable para proyectos de clientes. Nivel técnico medio-alto: sabe qué es una métrica de carga y detecta humo.
- **Qué necesita lograr**: verificar que hay oficio real y un proceso formal antes de pasarle un cliente propio.
- **Cómo lo hace hoy**: prueba a varios freelancers en proyectos pequeños; la mayoría falla en plazos o en calidad técnica. Revisa portafolios buscando profundidad, no estética.
- **Frecuencia de uso**: varias visitas a lo largo de días, en escritorio.
- **Dispositivo / entorno**: portátil, pantalla de 1440 px o más, buena conexión. Usa teclado intensivamente.
- **Qué le haría abandonar**: casos sin profundidad técnica; métricas sin fuente; un sitio lento hecho por alguien que dice optimizar el rendimiento de otros.
- **Flujos principales**:
  1. **Auditar el criterio técnico**: entra → servicios → lee el proceso de trabajo → abre un caso de estudio → lee enfoque, tecnologías y aprendizajes → revisa el panel de ficha → contacta por formulario indicando tipo de proyecto y presupuesto.
  2. **Verificar coherencia**: abre las herramientas de desarrollo o mide el propio sitio → compara con lo que el sitio afirma sobre rendimiento → busca el autocaso del portafolio para ver si documenta sus propias decisiones.
  3. **Navegar con teclado**: abre la consola de comandos → busca un proyecto por nombre → salta directo a su caso sin usar el ratón.

## Persona 3 · "Karla, reclutadora técnica" (audiencia C · futura, v1.1+)

- **Quién es**: 29 años, contrata perfiles de desarrollo para una empresa de producto. Revisa decenas de perfiles por semana y dedica menos de dos minutos a cada portafolio.
- **Qué necesita lograr**: decidir en dos minutos si el perfil tiene fondo de ingeniería suficiente para una entrevista técnica.
- **Cómo lo hace hoy**: LinkedIn y GitHub; el portafolio solo como confirmación.
- **Frecuencia de uso**: una visita, en escritorio, con varias pestañas abiertas.
- **Dispositivo / entorno**: escritorio, alta velocidad de lectura, escaneo visual.
- **Qué le haría abandonar**: no encontrar trayectoria ni tecnologías en la primera pantalla; no haber forma de descargar un currículum.
- **Flujos principales**:
  1. **Evaluación rápida**: entra → perfil → lee trayectoria y principios → revisa el panel de tecnologías agrupadas por etapa del modelo de trabajo → descarga el currículum. Garantizado por CA-09.1, CA-09.2 y CA-09.4. La descarga del currículum es RF-14, de prioridad **Could**: si no existe el documento, este paso del flujo no está disponible en el MVP.
  2. **Profundidad técnica** (cuando exista Lab, fuera del MVP): entra → busca experimentos o notas técnicas → evalúa criterio de arquitectura. **Fuera del MVP.**

## Operador del sitio · Adrián (mantenimiento)

No es un usuario visitante, pero sus tareas condicionan requisitos de mantenibilidad (RNF-06).

- **Tareas habituales**:
  1. Publicar un proyecto nuevo: escribir su contenido, añadir capturas, registrar métricas con su fuente y archivar la evidencia y la autorización del cliente.
  2. Actualizar el estado de disponibilidad y en qué está trabajando, sin tocar la programación del sitio.
  3. Revisar mensualmente la analítica y el posicionamiento, y aplicar una mejora medible.
  4. Actualizar trimestralmente el autocaso del portafolio con los datos acumulados.
- **Restricción real**: lo hace en horas residuales entre trabajos de cliente. Si publicar un proyecto cuesta más de una hora de trabajo mecánico, deja de hacerse; de ahí CA-N06.1 y CA-N06.2.
