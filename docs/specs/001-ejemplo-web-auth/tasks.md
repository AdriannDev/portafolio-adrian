# Tareas 001 · Registro e inicio de sesión

- [ ] T1 · Modelo `Usuario` en Prisma + migración — archivos: prisma/schema.prisma, prisma/migrations/001_usuarios — cubre: base de CA-1 — verificar: `npx prisma migrate dev && npx prisma validate`
- [ ] T2 · `password.ts` (argon2id) con tests unitarios — archivos: src/lib/password.ts, tests/auth/password.test.ts — cubre: CA-9 — verificar: `npm test -- password`
- [ ] T3 [P] · `rate-limit.ts` con tests (reloj falso) — archivos: src/lib/rate-limit.ts, tests/auth/rate-limit.test.ts — cubre: CA-6 — verificar: `npm test -- rate-limit`
- [ ] T4 · Configuración Auth.js (Credentials, cookie httpOnly, 7 d) + handler — archivos: src/lib/auth.ts, src/app/api/auth/[...nextauth]/route.ts, .env.example — cubre: CA-4, CA-5, CA-7 — verificar: test de integración login ok/401
- [ ] T5 · Endpoint `POST /api/registro` con validación zod y normalización — archivos: src/app/api/registro/route.ts, tests/auth/registro.test.ts — cubre: CA-1, CA-2, CA-3, bordes email/doble envío — verificar: `npm test -- registro`
- [ ] T6 · Middleware de rutas protegidas con `callbackUrl` — archivos: src/middleware.ts, tests/auth/middleware.test.ts — cubre: CA-10 — verificar: test de integración
- [ ] T7 [P] · Páginas de registro y login (validación cliente) — archivos: src/app/(auth)/registro/page.tsx, src/app/(auth)/login/page.tsx — cubre: CA-1, CA-3, CA-4 — verificar: captura en navegador integrado (escritorio y móvil)
- [ ] T8 · Botón cerrar sesión — archivos: src/components/BotonCerrarSesion.tsx — cubre: CA-8 — verificar: captura + test de integración (sesión invalidada)
- [ ] T9 · Documentar endpoints en docs/03-diseno/api.md y README — verificar: revisión
- [ ] T10 · Verificación end-to-end del plan + `/code-review` + `revisor-seguridad` + converger spec (tabla de convergencia) — verificar: todos los CA con evidencia

## Registro
| Tarea | Commit | Notas |
|---|---|---|
| T1 | | |
