# Spec 001 · Fundación técnica y verificación automática

<!-- QUÉ y POR QUÉ. Nada de tecnología aquí: las herramientas concretas van en plan.md.
     Gate 4: cada criterio es verificable; nada contradice la constitución. -->

| Campo | Valor |
|---|---|
| Estado | Aprobada (Gate 4 de la spec, 2026-09-26) |
| Requerimientos que cubre | RNF-01 (CA-N01.4, CA-N01.5, CA-N01.6), RNF-04 (CA-N04.1, CA-N04.2, CA-N04.3, CA-N04.5), CA-N02.1, CA-N02.2, CA-N06.4, CA-N07.5 |
| Reglas de la constitución | 2, 6, 9, 10, 11, 17, 24, 30 |
| Iteración | 1 (cierre 2026-10-10) |
| Rama | feat/001-fundacion-tecnica |

## Objetivo

Que exista un sitio todavía vacío pero publicado, cuya calidad se verifica sola: cada cambio se construye, se valida y se mide contra el presupuesto de rendimiento antes de integrarse, y se publica sin pasos manuales. Así, ninguna spec posterior puede introducir una regresión de rendimiento, de contraste o de estilo sin que el sistema la detenga.

## Historias de usuario

- Como operador del sitio, quiero que cada cambio se verifique automáticamente antes de integrarse, para no ser yo quien detecte las regresiones.
- Como operador, quiero una previsualización publicada de cada propuesta de cambio, para revisarla en un teléfono real antes de integrarla.
- Como operador, quiero que integrar en la línea principal publique el sitio sin pasos manuales, y poder volver a la versión anterior si algo sale mal.
- Como sesión de IA que implementará las specs siguientes, quiero comandos de verificación que devuelvan un resultado legible, para comprobar mi propio trabajo sin depender de que una persona lo revise (ADR-009).
- Como visitante, quiero que el sitio se lea bien y cargue rápido desde el primer día, porque la calidad no se añade al final.

## Criterios de aceptación (EARS)

**Comandos y documentación**

- CA-1 EL SISTEMA DEBE ofrecer un comando para cada una de estas operaciones: instalar dependencias, ejecutar en desarrollo, construir, comprobar formato, análisis estático y tipos, ejecutar una prueba concreta, ejecutar todas las pruebas y medir el rendimiento contra el presupuesto.
- CA-2 EL SISTEMA DEBE documentar en el archivo de presentación del repositorio cómo instalarlo, ejecutarlo, probarlo, publicarlo y volver a una versión anterior, desde una máquina Windows con la terminal del proyecto (CA-N06.4).

**Página provisional**

- CA-3 CUANDO se construye el sitio EL SISTEMA DEBE generar una página de inicio provisional como archivo estático, que muestre el nombre público y un enunciado provisional usando las tres familias tipográficas y los tokens de color del sistema de diseño.
- CA-4 EL SISTEMA DEBE declarar el español de Perú como idioma de todo documento que genere (CA-N07.5), y dar a la página provisional un título y una descripción.

**Sistema de diseño en el código**

- CA-5 EL SISTEMA DEBE exponer todos los tokens de `docs/03-diseno/sistema-diseno.md` §12.1 con sus nombres exactos, y ningún valor por defecto de color, familia tipográfica, tamaño de texto, radio, sombra ni curva de animación ajeno a ellos (regla 6).
- CA-6 MIENTRAS el visitante tenga activa la preferencia de movimiento reducido EL SISTEMA DEBE reducir a cero las duraciones de sección y cinematográfica (sistema de diseño §6).
- CA-7 SI un componente o una página contiene un valor literal de color, tamaño, espaciado, radio o duración ENTONCES la verificación automática DEBE fallar indicando el archivo y la línea (regla 6).
- CA-8 SI algún par de colores del sistema de diseño cae por debajo de su contraste mínimo ENTONCES la verificación automática DEBE fallar indicando el par y su ratio (regla 24).
- CA-9 EL SISTEMA DEBE servir las tres familias tipográficas desde su propio origen, con seis archivos de fuente como máximo, y sin hacer ninguna petición a terceros al cargar la página (CA-N01.5, CA-10.1).

**Verificación y presupuesto**

- CA-10 CUANDO se abre o actualiza una propuesta de cambio EL SISTEMA DEBE ejecutar automáticamente formato, análisis estático, tipos, pruebas, construcción y medición del presupuesto de rendimiento, y marcar la propuesta como no integrable si cualquiera falla (CA-N04.2).
- CA-11 EL SISTEMA DEBE medir el rendimiento en el perfil de referencia de la regla 9 y fallar si se supera cualquier límite de CA-N01.1 a CA-N01.5, o si la puntuación de rendimiento o la de accesibilidad baja de 95 (regla 11, CA-N01.6).
- CA-12 SI se intenta confirmar localmente un cambio con las pruebas en rojo ENTONCES EL SISTEMA DEBE impedir la confirmación e indicar qué prueba falla (reglas 2 y 30).

**Publicación**

- CA-13 CUANDO la verificación de una propuesta de cambio pasa EL SISTEMA DEBE publicar una previsualización en una dirección propia y enlazarla desde la propuesta.
- CA-14 CUANDO se integra un cambio en la línea principal y la verificación pasa EL SISTEMA DEBE publicarlo en producción sin intervención manual (CA-N04.1). Hasta el lanzamiento (spec 015), producción usa la dirección provisional de la plataforma.
- CA-15 SI la verificación falla en la línea principal ENTONCES EL SISTEMA NO DEBE publicar (regla 30).
- CA-16 EL SISTEMA DEBE permitir volver a la versión publicada anterior con una sola operación documentada, sin tocar datos (CA-N04.5).
- CA-17 MIENTRAS el sitio no esté lanzado EL SISTEMA DEBE impedir que los buscadores indexen cualquier publicación, previsualizaciones incluidas. Una dirección provisional indexada competiría después con el dominio definitivo (RNF-07).
- CA-18 EL SISTEMA DEBE servirse solo por conexión cifrada, redirigiendo cualquier petición sin cifrar (CA-N02.1).

**Secretos y coste**

- CA-19 EL SISTEMA DEBE mantener fuera del repositorio toda credencial, y documentar cada variable de configuración que necesite, con su propósito y sin su valor (CA-N02.2, regla 17).
- CA-20 EL SISTEMA DEBE poder publicarse y operarse en modalidades gratuitas que permitan uso comercial (CA-N04.3).

## Casos borde

- **Máquina limpia**: la instalación y la primera construcción funcionan en Windows 11 con Git Bash siguiendo solo la documentación de CA-2, sin pasos implícitos.
- **La verificación tiene que poder fallar**: cada comprobación que bloquea (literales, contraste, presupuesto, pruebas previas a confirmar) se demuestra fallando al menos una vez con un cambio provocado a propósito, que después se revierte. Una puerta que nunca se ha visto cerrada no se considera verificada.
- **Medición inestable**: las mediciones de laboratorio varían entre ejecuciones. Una propuesta no debe rechazarse por ruido: la medición repite la toma y decide sobre un valor representativo.
- **Página casi vacía**: la página provisional pasará el presupuesto con holgura. Por eso la prueba de que el presupuesto funciona es el caso anterior, no el resultado en verde.
- **Finales de línea**: todo archivo generado o formateado queda con finales de línea LF y en UTF-8 sin BOM, en coherencia con `.gitattributes`.
- **Cuota de la integración continua**: el repositorio es privado y su capa gratuita tiene minutos limitados. La verificación completa debe caber holgadamente en esa cuota con el ritmo de trabajo previsto.
- **Propuesta sin cambios de código** (solo documentación): la verificación se ejecuta igualmente; puede omitir la medición de rendimiento solo si el plan justifica cómo se garantiza que no afecta al sitio.

## Fuera de alcance

- Páginas reales, cabecera, pie y navegación → 003 y siguientes.
- Colecciones de contenido, sus esquemas y reglas → 002.
- Dominio propio y sus redirecciones, monitorización de errores en producción → 015.
- Analítica, consentimiento y banner → 004.
- Endpoint del formulario y su configuración → 010.
- Animación con biblioteca → 014. Esta spec solo deja los tokens de movimiento.

## Dependencias

- Specs previas: ninguna.
- Servicios externos: repositorio privado en la plataforma de código y cuenta en la plataforma de alojamiento (ADR-007). **Los crea Adrián**; la spec no puede cerrarse sin ellos (pista de contenido del roadmap, fecha límite 2026-10-03).
- Documentos de entrada: `docs/03-diseno/sistema-diseno.md` §3, §6 y §12; constitución, reglas 9 a 11.

## Riesgos y preguntas abiertas

- [x] ¿Se crea ya el repositorio remoto? → Sí, privado, en esta iteración (decisión del 2026-09-26).
- [ ] Formato, análisis estático y sus configuraciones figuran en `stack.md` sin ADR, y la regla 8 lo exige para toda dependencia nueva. → Dueño: plan.md. Se resuelve con un ADR antes de instalar, o justificando qué ADR existente las cubre.
- [ ] Herramienta de medición de rendimiento, número de repeticiones y cómo se aplica el perfil de referencia → Dueño: plan.md, con la documentación vigente.
- [ ] Mecanismo de carga de las fuentes (gestión nativa del framework o archivos propios) → Dueño: plan.md (sistema de diseño §3.1).
- [ ] Nombre del proyecto en la plataforma de alojamiento y dirección provisional → Adrián, al crear la cuenta.
- [ ] Las variables de configuración que aparezcan deben añadirse a `.env.example`. Las añade Adrián: la IA no edita archivos `.env*` (CLAUDE.md).

## Convergencia (se llena en Fase 6)

| Criterio | Evidencia (test / captura / reporte QA) | Estado |
|---|---|---|
| CA-1 | | |
| CA-2 | | |
| CA-3 | | |
| CA-4 | | |
| CA-5 | | |
| CA-6 | | |
| CA-7 | | |
| CA-8 | | |
| CA-9 | | |
| CA-10 | | |
| CA-11 | | |
| CA-12 | | |
| CA-13 | | |
| CA-14 | | |
| CA-15 | | |
| CA-16 | | |
| CA-17 | | |
| CA-18 | | |
| CA-19 | | |
| CA-20 | | |
