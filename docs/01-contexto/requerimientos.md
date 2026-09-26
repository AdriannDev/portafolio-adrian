# Requerimientos · Portafolio Adrián Marchan

<!-- Fase 1. Cada requerimiento tiene ID, prioridad MoSCoW y al menos un criterio de aceptación en EARS.
     EARS (https://alistairmavin.com/ears/):
       Ubicuo:      EL SISTEMA DEBE <respuesta>
       Evento:      CUANDO <disparador> EL SISTEMA DEBE <respuesta>
       Estado:      MIENTRAS <estado> EL SISTEMA DEBE <respuesta>
       Opcional:    DONDE <característica> EL SISTEMA DEBE <respuesta>
       No deseado:  SI <condición> ENTONCES EL SISTEMA DEBE <respuesta>

     REGLA DEL GATE 1: ningún requerimiento nombra tecnología de implementación. Las decisiones
     técnicas van a la Fase 2 (ADRs). "Sistema de medición" o "almacén de contenido" describen
     capacidades, no productos.

     EXCEPCIÓN EXPLÍCITA: sí se nombran por su nombre (a) los canales de contacto del negocio
     —WhatsApp y correo electrónico—, porque son una decisión de negocio cerrada en el brief, igual
     que el idioma o el precio, y no una opción de implementación; y (b) los navegadores del
     visitante en CA-N05.1, porque son el entorno de ejecución, no una elección del sistema.

     Revisado el 2026-09-17 con revisión adversarial de contexto fresco (32 hallazgos).
     Cambio del 2026-09-26: en CA-01.2, la automatización sustituye a la publicidad de pago (decisión de negocio, ver brief). -->

Capacidades del MVP (ver brief): **C1** propuesta de valor y servicios · **C2** casos verificables · **C3** contacto cualificado · **C4** credibilidad personal · **C5** medición propia.

## Funcionales

### RF-01 · Presentación de la propuesta de valor

- Capacidad: C1 · Prioridad: **Must**
- Descripción: Como dueño de PYME que llega por primera vez, quiero entender de inmediato quién es Adrián, qué hace y cómo escribirle, para decidir en segundos si me sirve.
- Criterios de aceptación:
  - CA-01.1 CUANDO un visitante abre la página principal EL SISTEMA DEBE mostrar, sin que el visitante desplace la página, el nombre público, una declaración de posicionamiento de 120 caracteres como máximo y **un acceso al canal de contacto principal definido en el brief (WhatsApp)**.
  - CA-01.2 EL SISTEMA DEBE presentar las cinco áreas de trabajo (desarrollo web, comercio electrónico, automatización, posicionamiento en buscadores y analítica), cada una con una descripción de una frase y tres entregables.
  - CA-01.3 EL SISTEMA DEBE presentar el modelo de trabajo en cuatro etapas (construir, medir, optimizar, crecer) indicando qué entrega cada etapa.
  - CA-01.4 EL SISTEMA DEBE mostrar el elemento principal de la página de inicio como texto, sin depender de ninguna imagen para transmitir el mensaje.
  - CA-01.5 EL SISTEMA DEBE mostrar en la página principal una selección de entre cinco y seis proyectos destacados, cada uno con acceso directo a su caso de estudio, más un acceso al listado completo.
- Notas: CA-01.1 se verifica en ventana de 360 px de ancho y en escritorio. Es el criterio que protege el flujo prioritario de la Persona 1.

### RF-02 · Catálogo de servicios con precio de referencia

- Capacidad: C1 · Prioridad: **Must**
- Descripción: Como visitante con presupuesto limitado, quiero saber desde cuánto cuesta cada servicio, para no perder tiempo (ni hacérselo perder) si no encaja.
- Criterios de aceptación:
  - CA-02.1 EL SISTEMA DEBE describir cada servicio con: para quién es, qué incluye, cómo se trabaja paso a paso y herramientas empleadas.
  - CA-02.2 CUANDO existe al menos un proyecto publicado que aplicó un servicio EL SISTEMA DEBE mostrarlo como caso relacionado en ese servicio.
  - CA-02.3 EL SISTEMA DEBE mostrar por cada servicio un precio de referencia en formato "desde" con su moneda.
  - CA-02.4 EL SISTEMA DEBE presentar las formas de contratación disponibles (proyecto cerrado, servicio mensual recurrente y consultoría).
  - CA-02.5 EL SISTEMA DEBE responder al menos seis preguntas frecuentes sobre plazos, precios, mantenimiento y qué debe aportar el cliente.
- Notas / dependencias: CA-02.3 depende de la pregunta abierta "rangos de precio" del brief. Si al construir la página no hay cifras aprobadas, ese criterio se marca **bloqueado** y no se publica un número inventado.

### RF-03 · Índice de proyectos explorable

- Capacidad: C2 · Prioridad: **Must**
- Descripción: Como visitante, quiero recorrer los proyectos y filtrarlos, para encontrar rápido uno parecido a lo que necesito.
- Criterios de aceptación:
  - CA-03.1 EL SISTEMA DEBE listar todos los proyectos publicados mostrando de cada uno: identificador, título, categoría, año, estado, tecnologías principales y un resumen de 160 caracteres como máximo.
  - CA-03.2 CUANDO el visitante aplica filtros EL SISTEMA DEBE mostrar solo los proyectos que satisfacen **todos** los tipos de filtro activos, combinando los valores de un mismo tipo con "o" y los tipos distintos entre sí con "y".
  - CA-03.3 SI ningún proyecto satisface los filtros activos ENTONCES EL SISTEMA DEBE mostrar un mensaje de lista vacía y un control para restablecer los filtros.
  - CA-03.4 EL SISTEMA DEBE ofrecer al menos dos formas de ver el listado, una de ellas en lista simple, y recordar la última elegida por el visitante en visitas siguientes.
  - CA-03.5 EL SISTEMA DEBE mostrar por cada proyecto del listado una imagen de portada con texto alternativo descriptivo.
- Notas: la navegación por teclado del listado se exige en CA-N03.2 (RNF-03), para no duplicar el requisito.

### RF-04 · Caso de estudio por proyecto

- Capacidad: C2 · Prioridad: **Must**
- Descripción: Como agencia o cliente potencial, quiero leer cómo se resolvió un proyecto concreto, para juzgar el criterio técnico y el resultado.
- Criterios de aceptación:
  - CA-04.1 EL SISTEMA DEBE mostrar por cada proyecto: objetivo, rol desempeñado, enfoque, tecnologías, resultado y aprendizajes.
  - CA-04.2 EL SISTEMA DEBE mostrar un panel con los datos de ficha del proyecto: cliente o sector, roles, tecnologías, servicios aplicados, periodo, métricas y enlaces.
  - CA-04.3 SI una sección del caso no tiene contenido ENTONCES EL SISTEMA DEBE omitirla por completo, sin mostrar encabezados vacíos ni textos de relleno.
  - CA-04.4 CUANDO el proyecto tiene una dirección pública EL SISTEMA DEBE ofrecer un enlace que la abra en una pestaña nueva, conservando la página del caso abierta.
  - CA-04.5 EL SISTEMA DEBE permitir avanzar al proyecto siguiente y al anterior desde el final de cada caso.
  - CA-04.6 SI un cliente no ha autorizado que se le nombre ENTONCES EL SISTEMA DEBE publicar el caso identificando solo el sector, sin nombre ni marca del cliente.
  - CA-04.7 DONDE el proyecto aporte imágenes adicionales EL SISTEMA DEBE mostrarlas como galería, cada una con texto alternativo y descripción opcional.

### RF-05 · Trazabilidad de las métricas publicadas

- Capacidad: C2 · Prioridad: **Must**
- Descripción: Como visitante escéptico, quiero saber de dónde sale cada número, para creerlo.
- Criterios de aceptación:
  - CA-05.1 CUANDO el sistema muestra una métrica de resultado EL SISTEMA DEBE mostrar junto a ella su fuente y el periodo al que corresponde.
  - CA-05.2 SI una métrica no está marcada como verificada, o su marca no referencia la evidencia archivada ENTONCES EL SISTEMA DEBE omitirla en la versión publicada.
  - CA-05.3 EL SISTEMA DEBE distinguir visualmente las métricas verificadas de los datos meramente descriptivos.
  - CA-05.4 EL SISTEMA DEBE conservar la evidencia de cada métrica (exportación o captura del origen, más la autorización del cliente) fuera del contenido publicado.
- Notas: sostiene el criterio de éxito E5 del brief. CA-05.2 es verificable por el sistema (comprueba la marca y su referencia); CA-05.4 es un requisito de proceso, verificable por inspección.

### RF-06 · Autocaso del propio portafolio

- Capacidad: C2 · Prioridad: **Must**
- Descripción: Como visitante, quiero ver que Adrián aplica a su propio sitio lo que vende, para confiar en el método.
- Criterios de aceptación:
  - CA-06.1 EL SISTEMA DEBE incluir un caso de estudio del propio portafolio con el mismo formato que el resto.
  - CA-06.2 EL SISTEMA DEBE mostrar en ese caso las decisiones de arquitectura tomadas y los resultados de rendimiento medidos del propio sitio.
- Notas: es Must porque el brief lo declara en su "Solución en una frase" y el criterio de éxito E5 lo exige al lanzar. Alcance mínimo para lanzar: decisiones y medición propia; los datos acumulados en el tiempo se añaden después.

### RF-07 · Formulario de contacto

- Capacidad: C3 · Prioridad: **Must**
- Descripción: Como visitante interesado, quiero enviar una consulta con contexto, para recibir una respuesta útil.
- Criterios de aceptación:
  - CA-07.1 EL SISTEMA DEBE ofrecer un formulario con los campos: nombre, correo electrónico, empresa (opcional), tipo de proyecto, presupuesto orientativo (opcional) y mensaje.
  - CA-07.2 CUANDO el visitante envía el formulario con datos válidos EL SISTEMA DEBE hacer llegar la consulta al buzón del negocio y mostrar una confirmación que indique el plazo de respuesta declarado en el brief (48 horas hábiles).
  - CA-07.3 SI un campo obligatorio está vacío o el correo tiene formato inválido ENTONCES EL SISTEMA DEBE señalar el campo concreto con un mensaje comprensible y no enviar el formulario.
  - CA-07.4 EL SISTEMA DEBE validar todos los datos recibidos en el servidor, con independencia de lo que valide el navegador.
  - CA-07.5 SI el envío falla por un error técnico ENTONCES EL SISTEMA DEBE informar del fallo, conservar lo escrito por el visitante y ofrecer reintentar.
  - CA-07.6 EL SISTEMA DEBE rechazar envíos automatizados mediante al menos dos mecanismos independientes, sin exigir al visitante resolver acertijos visuales.
  - CA-07.7 EL SISTEMA DEBE solicitar consentimiento explícito para el tratamiento de los datos antes del envío, con enlace a la política de privacidad.
  - CA-07.8 MIENTRAS el envío está en curso EL SISTEMA DEBE impedir envíos duplicados y comunicar que la operación está en proceso.
- Notas: el sistema **no almacena** las consultas: las entrega al buzón del negocio y no las persiste. Es coherente con la restricción técnica del brief y reduce la superficie de datos personales.

### RF-08 · Canales de contacto directo

- Capacidad: C3 · Prioridad: **Must**
- Descripción: Como dueño de PYME, quiero escribir por WhatsApp sin rellenar formularios, porque es como me comunico.
- Criterios de aceptación:
  - CA-08.1 EL SISTEMA DEBE ofrecer un acceso a conversación de WhatsApp con el número del negocio y un mensaje inicial ya redactado.
  - CA-08.2 CUANDO el visitante activa el acceso al correo electrónico EL SISTEMA DEBE copiar la dirección al portapapeles y confirmar visualmente que se copió.
  - CA-08.3 EL SISTEMA DEBE mostrar la ubicación declarada y la hora local del negocio (el estado de disponibilidad lo exige CA-09.3).
  - CA-08.4 EL SISTEMA DEBE ofrecer al menos un acceso a contacto en todas las páginas del sitio.
  - CA-08.5 EL SISTEMA DEBE enlazar los perfiles profesionales públicos del autor, y declararlos como perfiles de la misma persona en los datos estructurados (ver CA-N07.3).

### RF-09 · Perfil profesional y disponibilidad

- Capacidad: C4 · Prioridad: **Must**
- Descripción: Como visitante, quiero saber quién está detrás y si está disponible, porque contrato a personas.
- Criterios de aceptación:
  - CA-09.1 EL SISTEMA DEBE mostrar una presentación personal, un retrato y la trayectoria profesional ordenada cronológicamente.
  - CA-09.2 EL SISTEMA DEBE declarar la forma de trabajar en entre cuatro y seis principios concretos.
  - CA-09.3 EL SISTEMA DEBE mostrar el estado de disponibilidad actual y en qué está trabajando, de forma que se pueda actualizar sin modificar la programación del sitio.
  - CA-09.4 EL SISTEMA DEBE agrupar las tecnologías y herramientas dominadas por etapa del modelo de trabajo (construir, medir, optimizar).
- Notas / dependencias: CA-09.1 exige un retrato que hoy no existe (pregunta abierta del brief).

### RF-10 · Medición con consentimiento previo

- Capacidad: C5 · Prioridad: **Must**
- Descripción: Como responsable del sitio, quiero medir el comportamiento de los visitantes cumpliendo la normativa, para optimizar con datos y sin riesgo legal.
- Criterios de aceptación:
  - CA-10.1 MIENTRAS el visitante no haya dado su consentimiento EL SISTEMA DEBE abstenerse de almacenar identificadores de analítica o de publicidad en su dispositivo, y de enviar datos a terceros.
  - CA-10.2 CUANDO el visitante no tiene una decisión de consentimiento vigente EL SISTEMA DEBE solicitarla con una opción de aceptar y otra de rechazar igual de accesibles, y un enlace a la política de privacidad.
  - CA-10.3 CUANDO el visitante rechaza la medición EL SISTEMA DEBE seguir funcionando con todas sus capacidades y conservar ese rechazo durante seis meses sin volver a preguntar.
  - CA-10.4 CUANDO el visitante ha consentido y realiza una acción relevante EL SISTEMA DEBE registrar el evento correspondiente: ver un proyecto, abrir el enlace externo de un proyecto, seleccionar un proyecto desde cualquier vista, filtrar el listado, cambiar la forma de ver el listado, seleccionar una capacidad, ver un servicio, abrir la consola de comandos, iniciar un contacto, completar un contacto, fallar un contacto y descargar el currículum.
  - CA-10.5 CUANDO se produce un contacto EL SISTEMA DEBE registrar la conversión indicando el canal, entendiendo por contacto: en el formulario, la confirmación de entrega devuelta por el servidor; en WhatsApp y en el correo electrónico, la activación del acceso por parte del visitante.
  - CA-10.6 EL SISTEMA DEBE publicar una política de privacidad que explique qué se mide y con qué finalidad, qué datos recoge el formulario y a dónde se envían, qué se guarda en el dispositivo del visitante (incluido el almacenamiento funcional de CA-03.4), y cómo ejercer los derechos de acceso, rectificación, cancelación y oposición.
- Notas: cumplimiento de la Ley 29733 (Perú). CA-10.5 es la definición operativa de "contacto conseguido" del criterio de éxito E1: para los canales directos mide intención de contacto, no recepción del mensaje, y así está declarado en el brief.

### RF-11 · Telemetría de la sesión del visitante

- Capacidad: C5 · Prioridad: **Must**
- Descripción: Como visitante técnico, quiero ver las métricas de rendimiento de mi propia visita, porque demuestra dominio de la medición mejor que cualquier afirmación.
- Criterios de aceptación:
  - CA-11.1 EL SISTEMA DEBE medir en el navegador del visitante las tres métricas de experiencia de carga de su sesión (carga del contenido principal, capacidad de respuesta a las interacciones y estabilidad visual de la maquetación) y mostrarlas cuando estén disponibles.
  - CA-11.2 SI alguna métrica de sesión no está disponible todavía ENTONCES EL SISTEMA DEBE indicarlo en lugar de mostrar un valor vacío o inventado.
  - CA-11.3 EL SISTEMA DEBE mostrar el identificador de la versión publicada del sitio.
  - CA-11.4 EL SISTEMA DEBE calcular y mostrar estas métricas en el propio navegador, sin enviarlas a ningún tercero mientras no haya consentimiento.
- Notas: es Must porque el brief lo declara en la capacidad C5. CA-11.4 es lo que hace compatible este requerimiento con CA-10.1.

### RF-12 · Consola de comandos

- Capacidad: transversal · Prioridad: **Should**
- Descripción: Como visitante que prefiere el teclado, quiero un buscador de acciones, para moverme sin ratón ni menús.
- Criterios de aceptación:
  - CA-12.1 CUANDO el visitante pulsa la combinación de apertura de la consola EL SISTEMA DEBE abrir un buscador de acciones que permita al menos: ir a una página, ir a un proyecto, copiar el correo, abrir WhatsApp y cambiar la forma de ver el listado.
  - CA-12.2 EL SISTEMA DEBE ofrecer un control visible para abrir la consola, para quien no conozca la combinación de teclas.
- Notas: la navegación por teclado en general es **Must** y vive en CA-N03.2. Esta consola es una mejora de eficiencia, no la única vía a ningún contenido. La combinación de teclas concreta se fija en la spec.

### RF-13 · Páginas de error y legales

- Capacidad: transversal · Prioridad: **Must**
- Criterios de aceptación:
  - CA-13.1 SI el visitante solicita una dirección inexistente ENTONCES EL SISTEMA DEBE responder con una página de error que ofrezca enlaces a todas las secciones principales y al listado de proyectos, sin depender de la consola de comandos.
  - CA-13.2 DONDE la consola de comandos exista EL SISTEMA DEBE ofrecer también un acceso a la búsqueda desde la página de error.
  - CA-13.3 EL SISTEMA DEBE publicar la política de privacidad accesible desde todas las páginas.

### RF-14 · Currículum descargable

- Capacidad: C4 · Prioridad: **Could**
- Descripción: Como reclutadora técnica, quiero descargar un currículum, para adjuntarlo a un proceso.
- Criterios de aceptación:
  - CA-14.1 DONDE exista un currículum publicado EL SISTEMA DEBE ofrecer su descarga en un formato imprimible desde la página de perfil.
- Notas: separado de RF-09 porque sirve a la Persona 3 (audiencia futura, v1.1+) y depende de un documento que hoy no existe. Si no se produce, no bloquea el lanzamiento; el evento de descarga de CA-10.4 queda entonces sin uso.

## No funcionales

### RNF-01 · Rendimiento · Prioridad: **Must**

Perfil de medición de referencia: dispositivo móvil de gama media con procesador limitado a la cuarta parte de su velocidad y red móvil rápida simulada. El perfil exacto se fija en la Fase 2 junto con la herramienta de medición y queda anotado en la constitución del proyecto.

- CA-N01.1 EL SISTEMA DEBE cargar su contenido principal en **2,5 segundos o menos** en el perfil de referencia. Objetivo interno: 2,0 segundos.
- CA-N01.2 EL SISTEMA DEBE responder a las interacciones del visitante en **200 milisegundos o menos**, medido sobre la interacción más lenta de la sesión. Objetivo interno: 150 milisegundos.
- CA-N01.3 EL SISTEMA DEBE mantener el desplazamiento visual acumulado de la maquetación **por debajo de 0,1**. Objetivo interno: 0,05.
- CA-N01.4 EL SISTEMA DEBE mantener el código de comportamiento de la página principal por debajo de **180 kB** y los estilos por debajo de **40 kB**, medidos comprimidos con gzip.
- CA-N01.5 EL SISTEMA DEBE usar como máximo tres familias tipográficas y seis archivos de fuente, con los caracteres reducidos al alfabeto necesario.
- CA-N01.6 SI un cambio supera alguno de los **límites** de CA-N01.1 a CA-N01.5 ENTONCES EL SISTEMA DEBE impedir su integración hasta que se corrija. Los objetivos internos no bloquean: se revisan en la retrospectiva de cada iteración.

### RNF-02 · Seguridad y privacidad · Prioridad: **Must**

- CA-N02.1 EL SISTEMA DEBE servirse íntegramente por conexión cifrada.
- CA-N02.2 EL SISTEMA DEBE mantener fuera del código publicado toda credencial, clave o secreto de configuración.
- CA-N02.3 EL SISTEMA DEBE rechazar entradas del formulario que superen 200 caracteres en los campos cortos o 5.000 caracteres en el mensaje.
- CA-N02.4 EL SISTEMA DEBE aceptar como máximo 5 envíos de formulario por hora desde un mismo origen, y rechazar el resto con un mensaje explicativo.
- CA-N02.5 EL SISTEMA DEBE excluir los datos personales de los registros de actividad técnica.
- CA-N02.6 SI ocurre un error inesperado ENTONCES EL SISTEMA DEBE mostrar al visitante un mensaje genérico y dejar el detalle técnico solo en los registros internos.
- CA-N02.7 EL SISTEMA DEBE tratar como dato, nunca como instrucción ejecutable, todo contenido que no haya escrito su autor: texto recibido por el formulario, respuestas de servicios externos y contenido de páginas de terceros.

### RNF-03 · Accesibilidad e interacción · Prioridad: **Must**

- CA-N03.1 EL SISTEMA DEBE cumplir una relación de contraste mínima de 4,5 a 1 en texto y 3 a 1 en elementos de interfaz.
- CA-N03.2 EL SISTEMA DEBE permitir alcanzar todas las páginas, todos los proyectos y todas las acciones usando solo el teclado, sin depender de pasar el puntero por encima de ningún elemento.
- CA-N03.3 CUANDO el visitante ha pedido en su sistema reducir el movimiento EL SISTEMA DEBE suprimir toda animación que no comunique un cambio de estado o de contenido, y limitar las restantes a cambios de opacidad.
- CA-N03.4 EL SISTEMA DEBE etiquetar todos los campos de formulario y anunciar los cambios de estado del envío a los lectores de pantalla.
- CA-N03.5 EL SISTEMA DEBE describir con texto alternativo toda imagen portadora de información.
- CA-N03.6 EL SISTEMA DEBE mantener un único encabezado de primer nivel por página y una jerarquía de encabezados sin saltos.
- CA-N03.7 SI un texto se superpone a una imagen ENTONCES EL SISTEMA DEBE interponer una capa que garantice el contraste mínimo.
- CA-N03.8 EL SISTEMA DEBE mostrar en todo momento qué elemento tiene el foco del teclado.
- CA-N03.9 EL SISTEMA DEBE abstenerse de: sustituir el cursor del sistema, retener la carga tras una pantalla de espera de más de 600 milisegundos, alterar el comportamiento normal del desplazamiento, exigir desplazamiento horizontal, reproducir sonido y renderizar elementos tridimensionales.
- Notas: CA-N03.9 traduce a requisito verificable los anti-patrones declarados en el concepto del proyecto y la mitigación del riesgo "otro portafolio espacial" del brief.

### RNF-04 · Operación y despliegue · Prioridad: **Must** (excepto CA-N04.4, **Should**)

- CA-N04.1 EL SISTEMA DEBE publicarse mediante un proceso automático disparado por la integración de cambios en la línea principal de desarrollo.
- CA-N04.2 EL SISTEMA DEBE verificar de forma automática, antes de cada publicación, el formato del código, el análisis estático, las pruebas y los límites de rendimiento de CA-N01.6.
- CA-N04.3 EL SISTEMA DEBE poder alojarse y operarse dentro del presupuesto declarado en el brief, en una modalidad que permita uso comercial, y sin requerir un servidor de aplicación encendido de forma permanente.
- CA-N04.4 EL SISTEMA DEBE registrar los errores ocurridos en producción y notificarlos al responsable del sitio por un canal que él revise a diario. *(Should: su implementación debe caber en el presupuesto; si no cabe, se cumple con los registros de la plataforma y revisión manual semanal.)*
- CA-N04.5 EL SISTEMA DEBE poder volver a la versión anterior publicada sin intervención manual sobre los datos.

### RNF-05 · Compatibilidad · Prioridad: **Must**

- CA-N05.1 EL SISTEMA DEBE funcionar en las dos últimas versiones estables de Chrome, Safari, Firefox y Edge, en escritorio y en móvil.
- CA-N05.2 EL SISTEMA DEBE ser usable a partir de 360 píxeles de ancho de ventana, sin desplazamiento horizontal.
- CA-N05.3 EL SISTEMA DEBE mostrar todo su contenido informativo aunque fallen las animaciones o los elementos gráficos decorativos.

### RNF-06 · Mantenibilidad · Prioridad: **Must**

- CA-N06.1 EL SISTEMA DEBE permitir añadir o corregir un proyecto, un servicio o el estado de disponibilidad editando únicamente contenido, sin modificar la programación.
- CA-N06.2 EL SISTEMA DEBE rechazar en el proceso de publicación todo contenido que no cumpla la estructura de datos definida para su tipo.
- CA-N06.3 EL SISTEMA DEBE tener pruebas automáticas que cubran al menos el 80 % de la lógica propia (validación de contenido, filtrado, envío de formulario y cálculo de métricas de sesión) y al menos una prueba del recorrido completo de contacto.
- CA-N06.4 EL SISTEMA DEBE documentar cómo instalarlo, ejecutarlo, probarlo y publicarlo.
- CA-N06.5 EL SISTEMA DEBE permitir publicar un proyecto nuevo completo en menos de una hora de trabajo manual, una vez reunidos su texto, sus imágenes y sus métricas.

### RNF-07 · Visibilidad en buscadores · Prioridad: **Must**

- CA-N07.1 EL SISTEMA DEBE entregar el contenido de cada página de forma legible por los buscadores sin necesidad de ejecutar comportamiento en el navegador.
- CA-N07.2 EL SISTEMA DEBE definir en cada página título, descripción, dirección canónica e imagen de previsualización para redes sociales.
- CA-N07.3 EL SISTEMA DEBE publicar datos estructurados válidos que describan a la persona (con sus perfiles públicos), el servicio profesional, el sitio y cada proyecto.
- CA-N07.4 EL SISTEMA DEBE publicar un índice de direcciones actualizado automáticamente y las reglas de rastreo.
- CA-N07.5 EL SISTEMA DEBE declarar el idioma español de Perú como idioma del contenido.

### RNF-08 · Idioma y comprensión · Prioridad: **Must**

- CA-N08.1 EL SISTEMA DEBE redactar en español todo el contenido informativo: títulos, descripciones, textos de los casos, servicios, formularios y mensajes de error.
- CA-N08.2 SI una etiqueta se muestra en inglés como recurso visual ENTONCES EL SISTEMA DEBE garantizar que la información que transmite esté disponible también en español, o que la etiqueta sea prescindible para comprender y usar la página.
- CA-N08.3 EL SISTEMA DEBE abstenerse de usar jerga técnica en el contenido dirigido a la audiencia principal sin explicarla en la misma frase.
- Notas: traduce a requisito verificable el motivo de abandono declarado por la Persona 1 ("que todo esté en inglés") y la decisión de idioma del brief.

## Trazabilidad

| Requerimiento | Prioridad | Capacidad | Criterio de éxito | Spec que lo implementa | Estado |
|---|---|---|---|---|---|
| RF-01 | Must | C1 | E1, E2 | 005 (acceso a WhatsApp de 003) | pendiente |
| RF-02 | Must | C1 | E1 | 008 | pendiente |
| RF-03 | Must | C2 | E2 | 006 (vista mapa: 014) | pendiente |
| RF-04 | Must | C2 | E2 | 007 | pendiente |
| RF-05 | Must | C2 | E5 | 002 (regla del dato), 007 (presentación) | pendiente |
| RF-06 | Must | C2 | E5 | 007 (medición en producción: 015) | pendiente |
| RF-07 | Must | C3 | E1 | 010 | pendiente |
| RF-08 | Must | C3 | E1 | 003 (CA-08.1, .3, .4), 010 (CA-08.2, .5) | pendiente |
| RF-09 | Must | C4 | E1 | 009 | pendiente |
| RF-10 | Must | C5 | E1, E2 | 004 | pendiente |
| RF-11 | Must | C5 | — | 011 | pendiente |
| RF-12 | Should | transversal | E2 | 013 | pendiente |
| RF-13 | Must | transversal | — | 003 (CA-13.2: 013) | pendiente |
| RF-14 | Could | C4 | — | 009, si existe el documento | pendiente |
| RNF-01 | Must | transversal | E3 | 001 (límites que bloquean); cada spec se mide contra ellos | pendiente |
| RNF-02 | Must | transversal | — | 001 (CA-N02.1, .2), 010 (CA-N02.3 a .7) | pendiente |
| RNF-03 | Must | transversal | — | Cada spec de página; 001 (contraste automático) | pendiente |
| RNF-04 | Must / Should | transversal | — | 001 (CA-N04.1, .2, .3, .5), 015 (CA-N04.4) | pendiente |
| RNF-05 | Must | transversal | E3 | Cada spec de página, verificado en QA | pendiente |
| RNF-06 | Must | transversal | — | 001 (CA-N06.4), 002 (CA-N06.1 a .3), 007 (CA-N06.5) | pendiente |
| RNF-07 | Must | transversal | E4 | 012 (metadatos base: 003; idioma: 001) | pendiente |
| RNF-08 | Must | transversal | E1 | Cada spec de página; `sistema-diseno.md` §9 | pendiente |

Nota sobre E3: el criterio se mide con **datos de campo**, que requieren un volumen mínimo de visitas reales. Hasta alcanzarlo se verifica con mediciones de laboratorio en el perfil de referencia de RNF-01. RF-11 muestra las métricas de la sesión de cada visitante, que es una demostración pública, no la fuente de medición de E3.
