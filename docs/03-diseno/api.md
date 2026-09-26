# API · Portafolio Adrián Marchan

<!-- Fase 3. El sitio tiene UN endpoint de servidor (regla 4, ADR-001): este documento es su contrato.
     Añadir otro endpoint exige un ADR. Cambiar este contrato exige actualizar este documento en el mismo commit. -->

| Campo | Valor |
|---|---|
| Fecha | 2026-09-26 |
| Estado | Aprobado |
| Requisitos que sostiene | RF-07, CA-10.5, RNF-02 |
| Reglas de la constitución | 4, 15, 17, 18, 21, 22 |
| Decisiones | [ADR-006](../02-arquitectura/decisiones/ADR-006-formulario-correo-antibot.md), [ADR-007](../02-arquitectura/decisiones/ADR-007-alojamiento-cloudflare-ci.md) |

## 1. Convenciones

Sustituyen a las de la plantilla del kit, pensadas para APIs con varios recursos:

- **Un solo endpoint**: `POST /api/contact`. Sin versión en la ruta: su único cliente es la isla del propio formulario, que se publica en el mismo despliegue. Si algún día hubiera un cliente externo, se versiona con un ADR.
- JSON en UTF-8 en la petición y en la respuesta.
- Sin autenticación. La protección es por origen, verificación anti-automatización y límite de frecuencia.
- Sin CORS: la respuesta no incluye `Access-Control-Allow-Origin`, así que ningún otro sitio puede leerla.
- Sin almacenamiento (regla 15): solo un contador efímero para el límite de frecuencia (§6).
- Mensajes al visitante siempre en español y genéricos; el detalle técnico, solo en los registros (regla 21).

## 2. Piezas de código

| Archivo | Responsabilidad |
|---|---|
| `src/lib/contact/schema.ts` | Esquema Zod de la petición. **El mismo** lo usan la isla del navegador y el endpoint (CA-07.4, ADR-006) |
| `src/lib/contact/messages.ts` | Textos en español por código de error y de campo, compartidos por navegador y servidor |
| `src/lib/contact/handler.ts` | Lógica del endpoint como función que recibe sus dependencias: verificador, envío de correo, limitador y reloj. Se prueba sin red |
| `src/pages/api/contact.ts` | Adaptador fino: lee la petición y el entorno, construye las dependencias reales y llama al manejador |

`src/lib/contact/` es una subcarpeta nueva respecto a `arquitectura.md`: la spec del formulario la añade a la estructura documentada.

## 3. POST /api/contact

### 3.1 Petición

Cabeceras obligatorias: `Content-Type: application/json` y `Origin` igual al origen del sitio. Cuerpo de **16 KB como máximo**.

| Campo | Tipo | Obligatorio | Reglas | Requisito |
|---|---|---|---|---|
| `name` | string | sí | Recortado; 1–200 caracteres; sin caracteres de control | CA-07.1, CA-N02.3 |
| `email` | string | sí | Recortado; hasta 200; formato de correo; dominio en minúsculas | CA-07.1, CA-07.3 |
| `company` | string | no | Recortado; hasta 200 | CA-07.1 |
| `projectType` | enum | sí | `web` · `ecommerce` · `seo` · `ads` · `analytics` · `other` | CA-07.1 |
| `budget` | enum | no | Tramos orientativos más `undecided`; ver nota | CA-07.1 |
| `message` | string | sí | Recortado; 1–5000 | CA-07.1, CA-N02.3 |
| `consent` | literal `true` | sí | Cualquier otro valor es un error | CA-07.7 |
| `website` | string | sí | **Campo trampa**: debe llegar vacío | CA-07.6 |
| `turnstileToken` | string | sí | 1–2048 | CA-07.6 |

- **Tramos de `budget`**: pendientes de la pregunta abierta sobre precios del brief. La spec del formulario fija los valores; ninguno se inventa antes.
- El **campo trampa** está en el formulario pero oculto para las personas: fuera de la vista, `aria-hidden="true"`, `tabindex="-1"` y `autocomplete="off"`. Un robot que rellena todos los campos lo rellena.
- Los dos mecanismos independientes de CA-07.6 son el campo trampa y el token de Turnstile; ninguno exige resolver acertijos.

### 3.2 Procesamiento

En este orden. Las comprobaciones baratas van primero, y el límite de frecuencia va antes de cualquier llamada a un servicio externo, para no consumir sus cuotas con tráfico abusivo.

| Paso | Comprobación | Si falla |
|---|---|---|
| 1 | El método es `POST` | 405 |
| 2 | `Origin` existe y coincide con el sitio | 403 `FORBIDDEN_ORIGIN` |
| 3 | `Content-Type` es `application/json` | 415 |
| 4 | El cuerpo no supera 16 KB | 413 |
| 5 | El cuerpo es JSON válido | 400 `BAD_REQUEST` |
| 6 | El campo trampa está vacío | **200 como si todo fuera bien**, sin enviar nada: no se revela la detección |
| 7 | El cuerpo cumple el esquema | 422 `VALIDATION_ERROR` con los campos |
| 8 | El origen no ha superado 5 envíos en la última hora (§6) | 429 `RATE_LIMITED` con `Retry-After` |
| 9 | Turnstile valida el token (tiempo máximo: 3 s) | 403 `BOT_CHECK_FAILED`; si no responde, 503 `SERVICE_UNAVAILABLE` |
| 10 | El servicio de correo acepta el envío (tiempo máximo: 5 s) | 502 `DELIVERY_FAILED`; si se agotó la cuota diaria, 503 `SERVICE_UNAVAILABLE` |
| 11 | — | 200 |

Cualquier excepción no prevista: 500 `INTERNAL_ERROR`.

El paso 6 tiene un coste asumido: la respuesta 200 hace que la isla registre la conversión. El impacto es mínimo, porque un robot rara vez consiente la medición.

### 3.3 Respuestas

```ts
type ContactResponse =
  | { ok: true }
  | {
      ok: false;
      error: {
        code: ContactErrorCode;
        message: string; // en español, genérico
        fields?: Partial<Record<ContactField, FieldErrorCode>>; // solo con VALIDATION_ERROR
      };
    };

type FieldErrorCode = "required" | "too_long" | "invalid_format" | "invalid_option" | "must_accept";
```

| HTTP | `code` | Mensaje al visitante | Qué hace la isla |
|---|---|---|---|
| 200 | — | «Consulta enviada. Te respondo en un plazo de {plazo}.», con el plazo de `profile.contact.responseTime` | Sustituye el formulario por la confirmación (CA-07.2) y registra `generate_lead` con `method: "form"` (CA-10.5) |
| 400 | `BAD_REQUEST` | «No se pudo procesar el envío. Inténtalo de nuevo.» | Aviso con reintento |
| 403 | `FORBIDDEN_ORIGIN` | El mismo que 400 | Aviso; no debería ocurrir desde el propio sitio |
| 403 | `BOT_CHECK_FAILED` | «No se pudo verificar el envío. Inténtalo de nuevo o escríbeme por WhatsApp.» | Renueva el token y ofrece reintentar |
| 405 · 413 · 415 | — | El mismo que 400 | No deberían ocurrir desde el propio sitio |
| 422 | `VALIDATION_ERROR` | «Revisa los campos marcados.» | Marca cada campo con su mensaje de `messages.ts` y lleva el foco al primero (CA-07.3) |
| 429 | `RATE_LIMITED` | «Has enviado varias consultas seguidas. Espera un momento o escríbeme por WhatsApp.» | Aviso; reintento tras `Retry-After` |
| 502 | `DELIVERY_FAILED` | «No se pudo enviar tu consulta. Lo que escribiste sigue aquí: inténtalo de nuevo.» | Conserva lo escrito y ofrece reintentar (CA-07.5) |
| 503 | `SERVICE_UNAVAILABLE` | «El formulario no está disponible ahora mismo. Escríbeme por WhatsApp o por correo.» | Muestra los canales directos |
| 500 | `INTERNAL_ERROR` | «Algo falló al enviar tu consulta. Inténtalo de nuevo.» | Conserva lo escrito y ofrece reintentar |

Toda respuesta distinta de 200 registra `contact_error` con el `code` como motivo (CA-10.4). `generate_lead` es el evento recomendado por la analítica de Google para una conversión de contacto, el que se importa a la plataforma de anuncios (ADR-008). El catálogo completo de eventos lo fija la spec de medición. Los eventos los emite solo `src/lib/analytics/events.ts` (regla 20).

## 4. Correo entregado

| Parte | Contenido |
|---|---|
| Remitente | `CONTACT_FROM_EMAIL`, de un dominio verificado en el servicio de correo |
| Destinatario | `CONTACT_TO_EMAIL` |
| Responder a | El email del visitante, ya validado: Adrián contesta directamente desde su buzón |
| Asunto | «Nueva consulta del portafolio · {tipo de proyecto}». **Ningún texto libre del visitante en el asunto ni en otra cabecera** |
| Cuerpo | Texto plano y HTML mínimo con los seis campos y la hora de recepción en `America/Lima`. Sin IP, sin agente de usuario |

- Todo valor del visitante se **escapa** antes de insertarse en el HTML y se trata como dato, nunca como marcado ni como instrucción (regla 22, CA-N02.7).
- El envío se hace con la API HTTP del servicio mediante `fetch`, sin su SDK: una dependencia menos (regla 8).
- Sin idempotencia en el servidor, porque exigiría guardar las peticiones. Los envíos duplicados los evita la isla (CA-07.8); si llegara un doble envío, el límite de frecuencia lo acota.

## 5. Seguridad

| Riesgo (OWASP 2021) | Control |
|---|---|
| A01 · Control de acceso: peticiones desde otros sitios | Comprobación de `Origin` (paso 2) y ausencia de CORS |
| A03 · Inyección en el correo | Escapado de HTML; ningún dato del visitante en cabeceras salvo `Reply-To`, que es un email ya validado |
| A04 · Abuso del formulario | Campo trampa, Turnstile y límite de 5 envíos por hora y origen (CA-N02.4) |
| A05 · Configuración | Secretos en variables de entorno de la plataforma, nunca en el código (CA-N02.2); tiempos máximos en las llamadas externas |
| A09 · Registros | Sin datos personales en los registros; mensajes genéricos al visitante |
| Denegación de cartera | Límite de tamaño (16 KB) y de frecuencia antes de llamar a servicios con cuota |

## 6. Límite de frecuencia

- Como máximo **5 peticiones** por origen en una ventana de **60 minutos** (CA-N02.4). Cuenta toda petición que supera la validación del esquema, se entregue o no: así un envío fallido no regala intentos.
- Clave: SHA-256 de la IP del visitante concatenada con `RATE_LIMIT_SALT`. La IP no se guarda en claro en ningún sitio (regla 15).
- Almacén: el almacenamiento efímero de la plataforma, con caducidad de 3600 s. No guarda nada más que la clave y el contador.
- **A concretar en la spec**, con la documentación vigente de la plataforma: qué almacén se usa. Consideraciones conocidas al redactar: el limitador nativo de Workers admite periodos cortos, no de una hora; el almacén clave-valor tiene tope diario de escrituras en la capa gratuita; y cualquier opción que guarde más que la clave y el contador incumple la regla 15.

## 7. Registros

Una línea por petición:

```json
{ "requestId": "…", "status": 200, "outcome": "delivered", "durationMs": 412, "botCheckMs": 180, "deliveryMs": 190 }
```

`outcome` toma los valores `delivered`, `honeypot`, `invalid`, `rate_limited`, `bot_check_failed`, `delivery_failed`, `unavailable` o `error`.

**Nunca** se registra: nombre, email, empresa, mensaje, IP, su huella, agente de usuario ni el cuerpo de la respuesta de un servicio externo (puede repetir los datos enviados). De un fallo externo se registra solo su código de estado (CA-N02.5).

## 8. Variables de entorno

| Variable | Dónde se usa | Secreta |
|---|---|---|
| `RESEND_API_KEY` | Servidor: envío de correo | sí |
| `TURNSTILE_SECRET_KEY` | Servidor: verificación del token | sí |
| `PUBLIC_TURNSTILE_SITE_KEY` | Navegador: widget del verificador | no |
| `CONTACT_TO_EMAIL` | Servidor: buzón de destino | no, pero no se publica |
| `CONTACT_FROM_EMAIL` | Servidor: remitente de dominio verificado | no |
| `RATE_LIMIT_SALT` | Servidor: sal de la huella de la IP | sí |

El origen del sitio (paso 2) sale de la configuración `site` de Astro, no de una variable. Todas deben estar documentadas en `.env.example` (regla 17).

## 9. Carga del verificador en la página

- El script de Turnstile se carga solo en `/contact` y **en la primera interacción** con el formulario, no al abrir la página: no pesa en la carga inicial ni en el presupuesto de rendimiento.
- Turnstile lo sirve Cloudflare, que ya es la plataforma de alojamiento y procesa todas las peticiones del sitio: no es un tercero nuevo a efectos de CA-10.1. Aun así, la política de privacidad lo declara junto al servicio de correo, como encargados del tratamiento (CA-10.6).
- Sin JavaScript no hay token posible: el formulario muestra WhatsApp y el correo como alternativa.

## 10. Pruebas

Según [ADR-009](../02-arquitectura/decisiones/ADR-009-pruebas-y-verificacion.md):

- **Unitarias** sobre `handler.ts` con dependencias simuladas: una prueba por fila de §3.2 y de §3.3; el escapado de HTML; los límites de longitud; el campo trampa; y una prueba que compruebe que ninguna línea de registro contiene los datos del visitante.
- **Esquema compartido**: una batería de casos válidos e inválidos que se ejecuta igual contra la validación del navegador y la del servidor.
- **Recorrido completo** (Playwright), obligatorio por la DoD: rellenar, enviar, ver la confirmación; y el caso de error con lo escrito conservado. Usa las claves de prueba públicas de Turnstile (una que siempre valida y otra que siempre rechaza) y un modo de prueba del envío de correo que la spec concreta con la documentación vigente del servicio.

## 11. Contrato OpenAPI

No se usa. Con un único endpoint y un único cliente del mismo repositorio, el esquema Zod compartido **es** el contrato ejecutable, y este documento su descripción. Se reconsidera si aparece un cliente externo.
