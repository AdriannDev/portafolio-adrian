# API · [Nombre del proyecto]

<!-- Fase 3 (opcional). Si se usa OpenAPI, este archivo enlaza al contrato y resume convenciones. -->

## Convenciones
- Base: `/api/v1`. Versionado en la ruta.
- Formato: JSON; fechas ISO 8601 en UTC; ids uuid.
- Nombres: rutas en kebab-case, propiedades en camelCase.
- Paginación: `?page=1&pageSize=20` → `{ items, page, pageSize, total }`.
- Errores: `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }` con el HTTP status adecuado (400, 401, 403, 404, 409, 422, 500).
- Autenticación: [Bearer JWT · sesión por cookie]; cada endpoint indica el rol requerido.

## Endpoints
| Método | Ruta | Rol | Descripción | Spec |
|---|---|---|---|---|
| POST | /auth/login | público | Inicia sesión | 001 |
| GET | /pedidos | usuario | Lista pedidos propios | 00N |

### POST /auth/login
- Request: `{ "email": string, "password": string }`
- 200: `{ "token": string, "expiresAt": string }`
- 401: credenciales inválidas (mensaje genérico)
- 429: demasiados intentos

## Contrato OpenAPI
Archivo: [openapi.yaml] · Generado desde código: [sí/no] · Validado en CI: [sí/no]
