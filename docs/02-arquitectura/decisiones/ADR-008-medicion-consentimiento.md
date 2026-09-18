# ADR-008 · La medición se hace con gestor de etiquetas y analítica de Google, con consentimiento denegado por defecto

- Fecha: 2026-09-18
- Estado: Aceptado
- Decide: Adrián Marchan
- Fase: 2 (arquitectura)

## Contexto

RF-10 exige medir cumpliendo la Ley 29733: nada se almacena en el dispositivo del visitante ni se envía a terceros antes del consentimiento (CA-10.1), con opciones de aceptar y rechazar igual de accesibles (CA-10.2) y el rechazo conservado seis meses (CA-10.3). Hay doce eventos que registrar (CA-10.4) y una conversión por canal (CA-10.5), que alimenta el criterio de éxito E1.

Hay además una razón de negocio: Adrián vende servicios de analítica y publicidad. El sitio es su demostración pública de que sabe implementar medición correctamente, y la conversión debe poder importarse a la plataforma de anuncios.

## Opciones consideradas

| Opción | Ajuste al negocio | Peso | Privacidad | Notas |
|---|---|---|---|---|
| **A · Gestor de etiquetas + analítica de Google con modo de consentimiento** | 5 | 3 | 4 | Es la herramienta que el negocio vende y la que conecta con la plataforma de anuncios; carga solo tras el consentimiento |
| B · Analítica ligera sin cookies | 3 | 5 | 5 | Mejor rendimiento y privacidad, pero no demuestra la competencia que se vende ni alimenta la plataforma de anuncios |
| C · Sin medición | 1 | 5 | 5 | Incompatible con los criterios de éxito E1 y E2 y con el propio posicionamiento del sitio |

## Decisión

Opción A, con tres condiciones que la hacen compatible con el presupuesto de rendimiento y con la norma:

1. El gestor de etiquetas **no se carga** hasta que el visitante consiente. El presupuesto de CA-N01.4 se mide en la carga inicial sin consentimiento, de modo que la medición no compite con él.
2. Todos los eventos se emiten desde un único módulo con tipos definidos; está prohibido empujar eventos a la capa de datos desde cualquier otro sitio del código.
3. Las métricas de la sesión del visitante (RF-11) se calculan y muestran en el navegador sin enviarse a ningún tercero, con consentimiento o sin él (CA-11.4).

## Consecuencias

- Positivas: el sitio demuestra en sí mismo el servicio que vende; la conversión es importable a la plataforma de anuncios; el rendimiento medido no se degrada por la medición.
- Negativas / deuda asumida: los visitantes que rechazan no se miden, por lo que E1 y E2 se calculan sobre sesiones medibles, tal como ya declara el brief; dependencia de un tercero para la analítica.
- Revisar el: a los tres meses del lanzamiento, comparando la tasa de consentimiento con la pérdida de datos.

## Efecto en el proyecto

- Constitución: regla de un único módulo emisor de eventos y de consentimiento previo.
- Política de privacidad: qué se mide, con qué finalidad y qué se guarda en el dispositivo.
