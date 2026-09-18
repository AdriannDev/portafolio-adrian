# Spec 002 · Pipeline diario de ventas: de exportaciones CSV a informe consolidado

<!-- EJEMPLO COMPLETO (pista datos/automatización, Tier 2). Muestra cómo se escribe una spec cuando no hay UI. -->

| Campo | Valor |
|---|---|
| Estado | Aprobada |
| Requerimientos que cubre | RF-03 (consolidar ventas), RF-04 (alertar fallos), RNF-03 (operación) |
| Iteración | 1 |
| Rama | feat/002-pipeline-ventas |

## Objetivo
Que cada mañana exista un informe consolidado de las ventas del día anterior, generado automáticamente a partir de los CSV que exportan las tres tiendas, para que la dueña del negocio deje de unirlos a mano en una hoja de cálculo (hoy: 40 minutos diarios y errores frecuentes).

## Historias de usuario
- Como dueña del negocio, quiero recibir cada mañana un archivo con las ventas del día anterior por tienda y producto, para revisar el negocio en 5 minutos.
- Como dueña, quiero que se me avise si falta el archivo de alguna tienda o si los datos tienen errores, para reclamarlo a tiempo.
- Como operadora (yo misma), quiero poder reejecutar el pipeline de un día concreto sin duplicar datos, para corregir problemas.

## Criterios de aceptación (EARS)
- CA-1 CUANDO son las 06:00 (hora local) EL SISTEMA DEBE buscar en `entrada/AAAA-MM-DD/` los archivos `tienda-{norte,centro,sur}.csv` del día anterior y procesarlos.
- CA-2 SI falta el archivo de una tienda ENTONCES EL SISTEMA DEBE generar el informe con las tiendas disponibles, marcar la tienda ausente en el informe y enviar una alerta por email con el nombre de la tienda.
- CA-3 SI una fila tiene importe no numérico, fecha fuera del día o producto vacío ENTONCES EL SISTEMA DEBE excluirla del consolidado, registrarla en `rechazadas-AAAA-MM-DD.csv` con el motivo y continuar.
- CA-4 SI más del 5 % de las filas de un archivo son rechazadas ENTONCES EL SISTEMA DEBE abortar el informe de ese día y enviar alerta con el porcentaje y los tres motivos más frecuentes.
- CA-5 CUANDO el procesamiento termina EL SISTEMA DEBE escribir `salida/ventas-AAAA-MM-DD.xlsx` con una hoja "Resumen" (total por tienda y total general) y una hoja "Detalle" (tienda, producto, unidades, importe), y guardar las filas consolidadas en la tabla `ventas_diarias` de la base de datos.
- CA-6 CUANDO se ejecuta el pipeline dos veces para el mismo día EL SISTEMA DEBE producir exactamente el mismo resultado sin duplicar filas en `ventas_diarias` (idempotencia por clave tienda+fecha+producto).
- CA-7 EL SISTEMA DEBE registrar en el log, por ejecución: fecha procesada, archivos encontrados, filas leídas, rechazadas y escritas por tienda, duración total.
- CA-8 EL SISTEMA DEBE completar la ejecución en menos de 2 minutos para archivos de hasta 50 000 filas cada uno.
- CA-9 SI la ejecución falla por un error inesperado ENTONCES EL SISTEMA DEBE enviar alerta con el mensaje de error y no dejar archivos de salida parciales.

## Casos borde
- Archivo vacío (solo cabecera) → se trata como presente con 0 filas, sin alerta.
- Codificación Latin-1 en vez de UTF-8 (una tienda exporta así) → se detecta y convierte.
- Separador `;` en vez de `,` → se detecta por cabecera.
- Día sin ventas en ninguna tienda → informe con ceros, sin alerta.
- Ejecución manual de un día pasado (`--fecha 2026-09-01`) → mismo comportamiento que la programada.

## Fuera de alcance
- Dashboard web de ventas (spec futura). Integración directa con el sistema de punto de venta (las tiendas seguirán exportando CSV).
- Predicciones o análisis; solo consolidación.

## Dependencias
- Base de datos PostgreSQL existente (tabla `ventas_diarias` la crea esta spec).
- Cuenta de email SMTP para alertas (variables en `.env`).

## Riesgos y preguntas abiertas
- [x] ¿Orquestador o cron? → Programador de tareas de Windows / cron en el servidor con un solo script (ruta "script" de la matriz); pasar a Prefect si aparecen más pipelines (ADR-003).
- [x] ¿Excel o CSV de salida? → Excel (la dueña lo abre directamente); CSV adicional si se pide.

## Convergencia (se llena en Fase 6)
| Criterio | Evidencia | Estado |
|---|---|---|
| CA-1 | tests/test_descubrir_archivos.py | |
| CA-6 | tests/test_idempotencia.py (dos ejecuciones, misma BD) | |
| … | | |
