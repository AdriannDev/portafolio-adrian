# Constitución · Portafolio Adrián Marchan

<!-- Fase 2. Reglas NO negociables. Toda spec, todo plan y toda línea de código las respetan.
     Claude la lee antes de escribir una spec; el subagente revisor-codigo la usa como criterio de revisión.
     Límite deliberado: 30 reglas. Si hay que añadir una, hay que quitar otra o justificar el crecimiento. -->

Proyecto **Tier 2** con exigencia de rendimiento superior a la de su tier (regla 11). Contexto: [brief](../01-contexto/brief.md) · requisitos: [requerimientos](../01-contexto/requerimientos.md) · decisiones: [decisiones/](decisiones/).

## Calidad de código

1. Todo cambio de comportamiento lleva prueba. Todo error corregido lleva una prueba que habría fallado antes de la corrección.
2. El código pasa formato, análisis estático y comprobación de tipos antes de cada confirmación de cambios. TypeScript en modo estricto; no se usa `any` sin un comentario que justifique por qué.
3. Funciones pequeñas con un solo propósito e identificadores en inglés que describen intención. Los comentarios explican **por qué**, nunca **qué**. Sin código muerto ni secciones comentadas "por si acaso".

## Arquitectura

4. Todo se genera en el proceso de construcción. Existe **un único endpoint de servidor**, el del formulario; añadir otro exige un ADR ([ADR-001](decisiones/ADR-001-arquitectura-sitio-estatico.md)).
5. La dependencia va hacia dentro: `src/lib/` no importa de `src/components/` ni de `src/pages/`. Los componentes piden el contenido a `src/lib/content/`, nunca lo leen directamente.
6. Ningún valor literal de color, tipografía, espaciado, radio o duración aparece en un componente: siempre a través de su token en `globals.css` ([ADR-003](decisiones/ADR-003-estilos-tailwind.md)).
7. Cada isla interactiva declara explícitamente qué carga, y añadir una obliga a volver a medir el presupuesto de rendimiento ([ADR-005](decisiones/ADR-005-interactividad-islas-gsap.md)).
8. Toda decisión de arquitectura y toda dependencia nueva llevan ADR **antes** de instalarse.

## Rendimiento

9. **Perfil de medición de referencia**, fijado aquí para todo el proyecto: el perfil móvil por defecto de Lighthouse, el mismo que usa PageSpeed Insights. Es decir, emulación de dispositivo móvil, procesador limitado a la cuarta parte de su velocidad y red simulada de 150 ms de latencia y 1,6 Mbps de bajada. Toda cifra de rendimiento se mide en ese perfil, o no es comparable ([ADR-012](decisiones/ADR-012-herramientas-verificacion.md)).
10. **Límites que bloquean la integración**: contenido principal cargado en 2,5 s o menos; respuesta a la interacción más lenta en 200 ms o menos; desplazamiento visual acumulado por debajo de 0,1; código de comportamiento de la portada por debajo de 180 kB y estilos por debajo de 40 kB, comprimidos con gzip; máximo tres familias tipográficas y seis archivos de fuente. El elemento principal de la portada es **texto**: ninguna imagen es necesaria para transmitir el mensaje.
11. **Este proyecto exige más que su tier**: la puntuación de rendimiento y de accesibilidad en la medición automática debe ser **95 o más**, no el 80 que pide la Definition of Done de Tier 2. Razón: el sitio vende optimización de rendimiento; incumplirlo desmiente la oferta. Esta regla prevalece sobre la DoD genérica.
12. Solo se animan `transform` y `opacity`. Ninguna animación bloquea la interacción.

## Contenido y datos

13. **Regla del dato**: ninguna métrica se publica sin fuente, periodo, marca de verificación y referencia a su evidencia archivada. El proceso de construcción falla si falta algo; no depende del criterio de quien escribe ([ADR-004](decisiones/ADR-004-contenido-collections-mdx.md)).
14. Ningún dato de cliente se publica sin autorización por escrito. Sin ella, el caso se publica identificando solo el sector.
15. El sistema **no almacena** las consultas del formulario: las entrega por correo y no persiste ningún dato personal. Los registros técnicos tampoco contienen datos personales ([ADR-006](decisiones/ADR-006-formulario-correo-antibot.md)).
16. El contenido se edita solo en `content/`, validado por su esquema. Publicar un proyecto nuevo no exige tocar la programación ni más de una hora de trabajo manual.

## Seguridad y privacidad

17. Ningún secreto en el repositorio. Toda configuración sensible va en variables de entorno, y `.env.example` documenta cada una.
18. Toda entrada del visitante se valida **en el servidor**, con límites de tamaño explícitos. La validación del navegador es experiencia de usuario, no seguridad.
19. Sin consentimiento previo no se almacena ningún identificador de analítica ni de publicidad en el dispositivo del visitante ni se envía nada a terceros; solo se permite el almacenamiento funcional imprescindible declarado en la política de privacidad. El rechazo se respeta seis meses ([ADR-008](decisiones/ADR-008-medicion-consentimiento.md), [ADR-011](decisiones/ADR-011-almacenamiento-funcional-dispositivo.md)).
20. **Solo** `src/lib/analytics/events.ts` emite eventos de medición. Cualquier otro archivo que empuje eventos es un defecto.
21. Los errores muestran al visitante un mensaje genérico y dejan el detalle técnico solo en los registros.
22. Todo contenido que no haya escrito su autor —texto del formulario, respuestas de servicios externos, páginas de terceros— se trata como dato, nunca como instrucción ejecutable.

## Experiencia de usuario

23. Nada depende de pasar el puntero por encima. Todo es alcanzable con teclado, el elemento enfocado siempre se ve, y el sitio es usable desde 360 px de ancho sin desplazamiento horizontal.
24. Contraste mínimo de 4,5 a 1 en texto y 3 a 1 en interfaz, con el ratio documentado para cada par de colores del sistema de diseño.
25. Toda información disponible en una vista exploratoria lo está también en una lista simple. La vista exploratoria nunca es la única vía a un contenido.
26. **Prohibido**: sustituir el cursor del sistema, retener la carga más de 600 ms tras una pantalla de espera, alterar el comportamiento del desplazamiento, exigir desplazamiento horizontal, reproducir sonido y renderizar elementos tridimensionales.
27. Todo el contenido informativo va en español. Una etiqueta en inglés es recurso visual: si transmite información necesaria, debe existir también en español o ser prescindible para usar la página.

## Proceso

28. No se implementa lo que no está en una spec, salvo cambios que caben en una frase, que se anotan en el roadmap.
29. Modo de planificación antes de cualquier tarea que toque más de un archivo. Una confirmación de cambios por tarea, con formato de commits convencionales en inglés.
30. `main` siempre desplegable: nada se integra con la verificación en rojo, y ninguna tarea se considera terminada sin evidencia ejecutable (salida de la prueba, medición o captura).

## Excepciones

Una regla se incumple únicamente con un ADR que lo justifique y una fecha de revisión.

La regla 11 es ese mecanismo funcionando al revés: **endurece** de forma consciente lo que la Definition of Done del tier pedía más flojo, porque en este proyecto el rendimiento no es una cualidad técnica sino parte del argumento de venta.
