# Constitución · [Nombre del proyecto]

<!-- Fase 2. Reglas NO negociables. Toda spec, plan y línea de código las respeta. Máximo ~30 reglas; si crece, algo sobra.
     Claude la lee antes de escribir specs y el revisor-codigo la usa como criterio. -->

## Calidad de código
1. Todo cambio de comportamiento lleva test. Los bugs corregidos llevan test de regresión.
2. El código pasa lint, formato y type-check antes de cada commit (hooks lo aplican).
3. Sin código muerto ni comentarios explicando "qué"; los comentarios explican "por qué".
4. Funciones pequeñas con un propósito; nombres que describen intención.

## Testing
5. Pirámide: unitarios para lógica; integración para bordes (BD, HTTP); E2E solo flujos críticos.
6. Los tests no dependen de servicios reales externos; se usan dobles o entornos locales.
7. Un test que falla de forma intermitente se arregla o se elimina, nunca se ignora.

## Seguridad
8. Ningún secreto en el repositorio. Configuración por variables de entorno; `.env.example` documenta todas.
9. Toda entrada externa se valida en el servidor. Consultas siempre parametrizadas.
10. Autorización explícita en cada acción sobre recursos; nunca confiar en que "el frontend lo oculta".
11. Dependencias con lockfile; sin vulnerabilidades críticas conocidas al fusionar.

## Proceso
12. No se implementa lo que no está en una spec (o en la ruta corta anotada en el roadmap).
13. Plan mode para tareas que tocan más de un archivo. Commit por tarea con Conventional Commits.
14. `main` siempre desplegable; nada se fusiona con tests en rojo.
15. Toda decisión de arquitectura o de dependencia nueva lleva ADR.

## Datos y usuarios
16. Datos personales: mínimos necesarios, nunca en logs, con forma de borrarlos.
17. [Regla específica del dominio, p. ej. "los importes se manejan en enteros de céntimos"]

## Experiencia de usuario (si hay UI)
18. Funciona con teclado; formularios con etiquetas; mensajes de error comprensibles.
19. Móvil primero desde 360 px.

## Excepciones
Una regla se incumple solo con ADR que lo justifique y fecha de revisión.
