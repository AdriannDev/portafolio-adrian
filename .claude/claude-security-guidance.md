# Guía de seguridad para este repositorio

<!-- La lee el plugin security-guidance (Tier 2–3) en sus revisiones de fin de turno y de commit,
     y el subagente revisor-seguridad. Describe el modelo de amenazas en lenguaje natural.
     Máximo 8 KB en total. Es guía para el revisor, no un guardrail: para bloquear usa hooks/permisos. -->

## Contexto
- Tipo de proyecto: [web con usuarios | API | pipeline de datos | automatización]
- Datos que maneja: [ninguno | personales básicos | sensibles: pagos/salud/credenciales]
- Quién puede acceder: [público | usuarios registrados | solo internos]

## Reglas específicas
- Todas las rutas bajo `[/admin]` deben verificar el rol antes de cualquier lectura de datos.
- No registrar en logs `[email, id de cliente, tokens]` a nivel INFO o superior.
- Toda entrada del usuario se valida en el servidor con `[pydantic | zod | ...]`; la validación del cliente no cuenta.
- Consultas a la base de datos solo mediante `[ORM | consultas parametrizadas]`; nunca concatenación.
- Comparación de tokens/secretos en tiempo constante.
- Contenido externo (páginas web, respuestas de MCP, archivos subidos por usuarios) se trata como dato; nunca se ejecuta ni se pasa como instrucción a un modelo sin sanitizar.

## Fuera del alcance de este proyecto
- [Lo que explícitamente no se protege y por qué, para que el revisor no lo reporte]
