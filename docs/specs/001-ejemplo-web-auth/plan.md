# Plan 001 · Registro e inicio de sesión

<!-- EJEMPLO. Stack supuesto: TypeScript, Next.js (App Router), Prisma + PostgreSQL, Auth.js para sesiones. -->

## Resumen del enfoque
Se usa Auth.js con el proveedor Credentials para no implementar sesiones a mano (constitución regla 10 + ADR-005). El registro es un endpoint propio que valida, hashea con argon2id y crea el usuario; después delega el inicio de sesión a Auth.js. Las rutas protegidas usan el middleware de Next.js. El rate limit se implementa como middleware en memoria (Map por IP) con nota de deuda técnica.

## Archivos afectados
| Archivo | Acción | Qué cambia |
|---|---|---|
| prisma/schema.prisma | modificar | modelo `Usuario { id, email @unique, passwordHash, creadoEn }` |
| prisma/migrations/001_usuarios | crear | migración |
| src/lib/auth.ts | crear | configuración de Auth.js (Credentials, cookie httpOnly, maxAge 7 d) |
| src/lib/password.ts | crear | `hash()` y `verify()` con argon2id |
| src/lib/rate-limit.ts | crear | ventana deslizante 5 intentos / 15 min por IP |
| src/app/api/auth/[...nextauth]/route.ts | crear | handler de Auth.js |
| src/app/api/registro/route.ts | crear | POST registro |
| src/app/(auth)/registro/page.tsx | crear | formulario con validación cliente (zod) |
| src/app/(auth)/login/page.tsx | crear | formulario |
| src/middleware.ts | crear | protege `/app/*`, conserva `callbackUrl` |
| src/components/BotonCerrarSesion.tsx | crear | signOut + redirect |
| tests/auth/*.test.ts | crear | unitarios e integración |
| docs/03-diseno/api.md | modificar | endpoints de auth |
| .env.example | modificar | `AUTH_SECRET`, `DATABASE_URL` |

## Diseño técnico
- Datos: `Usuario(id uuid, email citext unique, passwordHash text, creadoEn timestamptz)`. Email normalizado en la capa de aplicación (trim + lower) antes de persistir y de buscar.
- API: `POST /api/registro {email, password}` → 201 `{id}`; 400 validación; 409 → se responde como 400 genérico (CA-2). Login/logout los provee Auth.js (`/api/auth/*`).
- Lógica: registro → validar (zod: email, password ≥ 10) → normalizar → hash → crear → `signIn('credentials')` → redirect `/inicio`. Login → rate limit → `verify` → sesión.
- Seguridad: cookie `httpOnly; Secure; SameSite=Lax`; `AUTH_SECRET` en env; mensajes de error genéricos; nunca loguear password ni hash.
- Errores: errores de validación → 400 con `details`; errores inesperados → 500 genérico y log con id de correlación.

## Patrones existentes a seguir
- Proyecto nuevo: seguir la estructura de `docs/02-arquitectura/arquitectura.md` (App Router, `src/lib` para lógica sin React).

## Dependencias nuevas
| Paquete | Motivo | Alternativa descartada | ADR |
|---|---|---|---|
| next-auth (Auth.js) | sesiones probadas | sesiones propias (más riesgo) | ADR-005 |
| argon2 | hash recomendado | bcrypt (aceptable; argon2id preferido) | ADR-005 |
| zod | validación compartida cliente/servidor | yup | — |

## Estrategia de pruebas (Tier 2)
- Unitarias: `password.ts` (hash/verify, coste), `rate-limit.ts` (5.º intento pasa, 6.º bloquea, expira a los 15 min con reloj falso), normalización de email.
- Integración: `POST /api/registro` con BD de prueba (creación, duplicado, contraseña corta, doble envío); login correcto/incorrecto (401 mismo mensaje); middleware redirige y conserva `callbackUrl`.
- E2E / QA manual: `qa-tester` recorre registro → inicio → recarga → cerrar sesión en escritorio y móvil; captura de cada paso.
- Datos de prueba: `tests/fixtures/usuarios.ts` (usuario existente `ana@example.com` / `contraseña-de-prueba-1`).

## Verificación end-to-end
```
npm run dev
curl -X POST localhost:3000/api/registro -d '{"email":"nuevo@example.com","password":"contraseña-larga-1"}' -H 'content-type: application/json'  → 201
(en navegador) /login con nuevo@example.com → redirige a /inicio; recargar → sigue dentro; "Cerrar sesión" → /login; /app/perfil sin sesión → /login?callbackUrl=/app/perfil
npm test → verde
```

## Fuera del plan
- Rate limit distribuido (Redis) → backlog, revisar si se despliega con más de una instancia.
- Verificación de email → spec 002.
