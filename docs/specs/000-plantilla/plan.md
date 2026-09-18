# Plan NNN · [Nombre de la feature]

<!-- CÓMO. Se escribe en plan mode con la spec aprobada. Debe ser autocontenido: quien implemente (una sesión nueva de Claude)
     no ve la conversación en la que se escribió. -->

## Resumen del enfoque
[Tres a cinco frases: qué se construye, dónde encaja en la arquitectura, qué patrón existente se sigue.]

## Archivos afectados
| Archivo | Acción | Qué cambia |
|---|---|---|
| src/[…] | crear · modificar | |
| tests/[…] | crear | |
| docs/03-diseno/api.md | modificar | nuevo endpoint |

## Diseño técnico
- Datos: [entidades/campos/migración]
- API o interfaz: [endpoints, firmas, contratos]
- Lógica: [pasos, validaciones, estados]
- UI (si aplica): [pantallas, componentes reutilizados, referencia Figma]
- Seguridad: [autorización, validación, secretos]
- Errores: [qué puede fallar y cómo se reporta]

## Patrones existentes a seguir
- [Archivo de referencia que ya hace algo parecido: "sigue la estructura de src/pedidos/service.ts"]

## Dependencias nuevas
| Paquete | Motivo | Alternativa descartada | ADR |
|---|---|---|---|
| ninguna | | | |

## Estrategia de pruebas (según tier)
- Unitarias: [qué funciones, qué casos borde de la spec]
- Integración: [qué bordes: BD, HTTP, servicio externo]
- E2E / QA manual: [flujo que recorrerá qa-tester]
- Datos de prueba: [fixtures]

## Verificación end-to-end
[Comando o secuencia que demuestra que la feature funciona de principio a fin: "levantar app → POST /auth/login con usuario de prueba → 200 con token → GET /perfil con token → 200". Es lo que ejecuta la última tarea.]

## Fuera del plan
- [Lo que conscientemente no se hace ahora y dónde se anota (roadmap/backlog)]
