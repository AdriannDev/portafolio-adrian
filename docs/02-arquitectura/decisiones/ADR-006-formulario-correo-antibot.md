# ADR-006 · El formulario se procesa en un endpoint propio, envía correo con un servicio transaccional y se protege con dos mecanismos

- Fecha: 2026-09-18
- Estado: Aceptado
- Decide: Adrián Marchan
- Fase: 2 (arquitectura)

## Contexto

RF-07 pide un formulario de seis campos que llegue al buzón del negocio en 48 horas hábiles, con validación en servidor (CA-07.4), dos mecanismos independientes anti-automatización sin acertijos visuales (CA-07.6), consentimiento explícito (CA-07.7) y un máximo de 5 envíos por hora y origen (CA-N02.4). El sistema **no almacena** las consultas (brief y nota de RF-07). El presupuesto es de ~2 USD/mes.

Verificado el 2026-09-18: la capa gratuita de Resend ofrece 3.000 correos al mes con un tope de 100 al día y un dominio verificado. Turnstile, el verificador de Cloudflare, es gratuito y no exige resolver acertijos visuales.

## Opciones consideradas

| Opción | Costo | Control | Privacidad | Notas |
|---|---|---|---|---|
| **A · Endpoint propio + Resend + Turnstile + campo trampa** | 5 | 5 | 5 | Plantilla de correo propia; ningún dato se persiste; ambos servicios en capa gratuita |
| B · Servicio de formularios de terceros | 4 | 2 | 3 | El proveedor almacena las consultas: amplía la superficie de datos personales y contradice la nota de RF-07 |
| C · Endpoint propio + verificador con acertijos visuales | 4 | 5 | 3 | Incumple CA-07.6 y penaliza el rendimiento |

## Decisión

Opción A. Un endpoint del propio sitio valida los datos con el mismo esquema que usa el navegador, verifica el token de Turnstile, comprueba el campo trampa, aplica el límite de envíos y entrega el mensaje por correo mediante Resend. No se guarda nada. Los secretos viven en variables de entorno de la plataforma (CA-N02.2).

## Consecuencias

- Positivas: mínima superficie de datos personales; control total del contenido del correo; coste cero.
- Negativas: el tope de 100 correos al día del plan gratuito es un límite a vigilar (muy por encima del tráfico previsto); si se supera, el visitante debe recibir un error claro y el canal de WhatsApp sigue disponible. El límite de envíos por origen necesita almacenamiento efímero de la plataforma, que se concreta al implementar la spec.
- Revisar el: si el volumen de contactos se acerca al tope diario.

## Efecto en el proyecto

- `.env.example`: claves del servicio de correo, del verificador anti-automatización y buzón de destino.
- Constitución: regla de validación en servidor y de no persistencia de datos personales.
