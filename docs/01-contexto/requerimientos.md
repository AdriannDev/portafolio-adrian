# Requerimientos · [Nombre del proyecto]

<!-- Fase 1. Cada requerimiento tiene ID, prioridad MoSCoW y al menos un criterio de aceptación en EARS.
     EARS (https://alistairmavin.com/ears/):
       Ubicuo:      EL SISTEMA DEBE <respuesta>
       Evento:      CUANDO <disparador> EL SISTEMA DEBE <respuesta>
       Estado:      MIENTRAS <estado> EL SISTEMA DEBE <respuesta>
       Opcional:    DONDE <característica> EL SISTEMA DEBE <respuesta>
       No deseado:  SI <condición> ENTONCES EL SISTEMA DEBE <respuesta>
     Un criterio es bueno si se puede convertir en un test o en un paso de QA sin interpretar. -->

## Funcionales

### RF-01 · [Título corto]
- Prioridad: Must · Should · Could · Won't
- Descripción: Como [usuario], quiero [acción] para [beneficio].
- Criterios de aceptación:
  - CA-01.1 CUANDO [el usuario envía el formulario con datos válidos] EL SISTEMA DEBE [guardar y mostrar confirmación en < 2 s].
  - CA-01.2 SI [un campo obligatorio está vacío] ENTONCES EL SISTEMA DEBE [marcar el campo y no enviar].
- Notas / dependencias: [ ]

### RF-02 · [ ]
- Prioridad:
- Descripción:
- Criterios de aceptación:
  - CA-02.1

## No funcionales

### RNF-01 · Rendimiento
- EL SISTEMA DEBE [responder las páginas principales en < 1 s con 50 usuarios concurrentes].

### RNF-02 · Seguridad
- EL SISTEMA DEBE [cifrar en tránsito; almacenar contraseñas con hash; validar toda entrada en servidor].

### RNF-03 · Disponibilidad y operación
- EL SISTEMA DEBE [desplegarse con un comando; tener backups diarios de la BD].

### RNF-04 · Compatibilidad
- EL SISTEMA DEBE [funcionar en Chrome/Firefox/Safari actuales y en móvil ≥ 360 px].

### RNF-05 · Mantenibilidad
- EL SISTEMA DEBE [tener tests de la lógica central; documentación de despliegue].

## Trazabilidad
| Requerimiento | Spec(s) que lo implementan | Estado |
|---|---|---|
| RF-01 | docs/specs/001-... | pendiente · en curso · verificado |
