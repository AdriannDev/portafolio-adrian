# Spec 001 · Registro e inicio de sesión con email y contraseña

<!-- EJEMPLO COMPLETO (pista web, Tier 2). Muestra el nivel de detalle esperado. Bórralo o reemplázalo en tu proyecto. -->

| Campo | Valor |
|---|---|
| Estado | Aprobada |
| Requerimientos que cubre | RF-01 (registro), RF-02 (login), RNF-02 (seguridad) |
| Iteración | 1 |
| Rama | feat/001-auth |

## Objetivo
Que una persona pueda crear una cuenta con su email y una contraseña, iniciar sesión y mantenerla iniciada, para que el resto de la aplicación pueda asociar datos a un usuario.

## Historias de usuario
- Como visitante, quiero registrarme con email y contraseña para tener mi propia cuenta.
- Como usuario registrado, quiero iniciar sesión y que la sesión se mantenga al recargar para no autenticarme en cada visita.
- Como usuario, quiero cerrar sesión desde cualquier página para proteger mi cuenta en dispositivos compartidos.

## Criterios de aceptación (EARS)
- CA-1 CUANDO el visitante envía el formulario de registro con un email válido no registrado y una contraseña de ≥ 10 caracteres EL SISTEMA DEBE crear la cuenta, iniciar sesión automáticamente y redirigir a `/inicio` en menos de 2 s.
- CA-2 SI el email ya está registrado ENTONCES EL SISTEMA DEBE mostrar "No se pudo completar el registro" sin revelar si el email existe, y no crear la cuenta.
- CA-3 SI la contraseña tiene menos de 10 caracteres ENTONCES EL SISTEMA DEBE marcar el campo con el mensaje "Mínimo 10 caracteres" y no enviar el formulario.
- CA-4 CUANDO el usuario envía credenciales correctas en `/login` EL SISTEMA DEBE iniciar sesión y redirigir a la página que intentaba visitar (o a `/inicio`).
- CA-5 SI las credenciales son incorrectas ENTONCES EL SISTEMA DEBE responder "Email o contraseña incorrectos" (mensaje idéntico para ambos casos) con estado 401.
- CA-6 SI hay 5 intentos fallidos desde la misma IP en 15 minutos ENTONCES EL SISTEMA DEBE rechazar nuevos intentos con estado 429 durante 15 minutos.
- CA-7 MIENTRAS la sesión esté activa EL SISTEMA DEBE mantenerla al recargar la página durante 7 días de inactividad máxima.
- CA-8 CUANDO el usuario pulsa "Cerrar sesión" EL SISTEMA DEBE invalidar la sesión en el servidor y redirigir a `/login`.
- CA-9 EL SISTEMA DEBE almacenar contraseñas solo como hash (argon2id o bcrypt con coste ≥ 12); nunca en claro ni en logs.
- CA-10 EL SISTEMA DEBE proteger las rutas bajo `/app/*`: sin sesión válida redirige a `/login` conservando la URL destino.

## Casos borde
- Email con mayúsculas o espacios alrededor → se normaliza (trim + minúsculas) antes de comparar.
- Doble envío del formulario (doble clic) → una sola cuenta.
- Cookie de sesión manipulada → 401, no 500.
- Usuario borrado con sesión activa → la siguiente petición cierra la sesión.

## Fuera de alcance
- Verificación de email, recuperación de contraseña, login social (OAuth), 2FA → specs futuras (002, 003).
- Gestión de roles/permisos más allá de "autenticado / no autenticado".

## Dependencias
- Specs previas: ninguna. Requiere modelo de datos base (usuarios) → esta spec lo crea.
- Servicios externos: ninguno.

## Riesgos y preguntas abiertas
- [x] ¿Sesión por cookie o JWT en almacenamiento local? → Cookie httpOnly + SameSite=Lax (decisión en plan.md; ADR-005).
- [x] ¿Rate limit en memoria o en BD? → En memoria para Tier 2 con una instancia; anotar en deuda técnica.

## Convergencia (se llena en Fase 6)
| Criterio | Evidencia | Estado |
|---|---|---|
| CA-1 | tests/auth/registro.test.ts · QA iteración 1 caso 1 | verificado |
| CA-2 | tests/auth/registro.test.ts (email duplicado) | verificado |
| … | | |
