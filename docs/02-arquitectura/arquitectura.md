# Arquitectura · [Nombre del proyecto]

<!-- Fase 2. Corto y visual. Las decisiones van en decisiones/ADR-*.md; aquí solo el resultado. -->

## Estilo arquitectónico
[Monolito modular · frontend + API · serverless · estático + funciones · pipeline] — ADR: decisiones/ADR-001-*.md

## Diagrama de contexto (C4 nivel 1)
```
[Usuario] → [Sistema] → [Servicios externos: auth, pagos, email, BD gestionada]
```
[Sustituye por un diagrama real (Mermaid, imagen o Figma). Qué hay dentro del sistema y qué fuera.]

## Contenedores (C4 nivel 2)
| Contenedor | Tecnología | Responsabilidad | Se comunica con |
|---|---|---|---|
| Web | [ ] | UI | API |
| API | [ ] | Lógica de negocio | BD, servicios externos |
| BD | [ ] | Persistencia | — |
| Worker / pipeline | [ ] | Tareas programadas | BD, fuentes |

## Estructura del repositorio
```
src/
  [capa o módulo]/   ← qué va aquí
  [capa o módulo]/
tests/
docs/
```
Reglas de dependencia: [p. ej. "dominio no importa de infraestructura"; "cada módulo expone un index"].

## Flujos clave
1. [Flujo principal: petición → capa → capa → respuesta]
2. [Flujo de error / autenticación]

## Datos
Ver docs/03-diseno/modelo-datos.md. Migraciones: [herramienta]. Backups: [política].

## Entornos y despliegue
| Entorno | Dónde | Cómo se despliega | Config |
|---|---|---|---|
| Desarrollo | local | `[comando]` | `.env` |
| Producción | [hosting] | CI desde `main` | variables en [panel/gestor] |

## Observabilidad
Logs: [ ] · Errores: [Sentry u otro] · Métricas/alertas: [Tier 2–3]

## Riesgos técnicos y deuda asumida
- [Qué se simplificó a propósito y cuándo revisarlo]
