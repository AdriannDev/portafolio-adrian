# ADR-012 · El formato, el análisis estático y el presupuesto se verifican con Prettier, ESLint y Lighthouse CI, y el hook de confirmación es nativo de git

- Fecha: 2026-09-26
- Estado: Aceptado
- Decide: Adrián Marchan
- Fase: 4 (spec 001)

## Contexto

La regla 8 de la constitución exige un ADR **antes** de instalar cualquier dependencia nueva. Al planificar la spec 001 aparecieron tres huecos:

- **Formato y análisis estático**: `stack.md` ya elegía Prettier y ESLint, pero sin ADR.
- **Medición del presupuesto de rendimiento**: ADR-009 decide la capa (medición automática que bloquea la integración), pero no la herramienta.
- **Pruebas previas a confirmar**: ADR-010 preveía activar el hook del kit, que solo actúa cuando confirma Claude. CA-12 de la spec 001 exige bloquear **cualquier** confirmación con las pruebas en rojo, también las de Adrián.

Además, la spec 001 necesita un inventario que muestre qué ADR cubre cada paquete, para que la regla 8 sea comprobable.

## Opciones consideradas

| Pieza | Opción elegida | Alternativas | Por qué |
|---|---|---|---|
| Formato | **Prettier** + `prettier-plugin-astro` | Biome | Prettier con su complemento de Astro es el formateador de referencia del ecosistema Astro y el que ya usa el hook de formato del kit; el soporte de Biome para `.astro` ha sido parcial |
| Análisis estático | **ESLint** + `typescript-eslint` + `eslint-plugin-astro` | Biome | Mismo motivo; las reglas de Astro solo existen para ESLint |
| Presupuesto de rendimiento | **Lighthouse CI** (`@lhci/cli`) + script propio de tamaños con gzip | Solo PageSpeed Insights por API · `size-limit` | Lighthouse CI mide en local y en la integración continua con el mismo perfil que PageSpeed Insights (el que usarán los clientes); los tamaños con gzip se calculan sobre `dist/` sin dependencia, porque la documentación de Lighthouse CI no garantiza que su servidor comprima |
| Hook de confirmación | **`core.hooksPath` nativo de git** con `.githooks/pre-commit` versionado | `husky` · `lefthook` · hook del kit | Cero dependencias; cubre por igual los commits de Adrián y los de Claude |

## Decisión

Se adoptan las cuatro opciones elegidas. Lighthouse CI se configura con el perfil móvil por defecto de Lighthouse, que es el de PageSpeed Insights y el que fija la regla 9. Decide sobre la **mediana** de tres ejecuciones, para que el ruido de la medición no rechace propuestas válidas. El hook `pre-commit-tests.py` del kit queda **desactivado** (`pre_commit_test_command` vacío): el hook de git ya se ejecuta en cada confirmación de Claude, y activar los dos duplicaría el trabajo. La intención de ADR-010 se cumple con más cobertura.

**Inventario de dependencias de la spec 001**

| Paquete | Uso | ADR que lo cubre |
|---|---|---|
| `astro` | Framework | ADR-002 |
| `typescript`, `@astrojs/check` | Tipado estricto y su comprobación | ADR-002 |
| `tailwindcss`, `@tailwindcss/vite` | Estilos y tokens | ADR-003 |
| `vitest` | Pruebas unitarias | ADR-009 |
| `@playwright/test`, `@axe-core/playwright` | Pruebas de navegador y de accesibilidad | ADR-009 |
| `@lhci/cli` | Presupuesto de rendimiento | ADR-009 y este ADR |
| `prettier`, `prettier-plugin-astro` | Formato | Este ADR |
| `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-astro` | Análisis estático | Este ADR |
| `wrangler` | Publicación, previsualización y vuelta atrás | ADR-007 |

Las fuentes tipográficas no añaden paquete: las gestiona la API de fuentes nativa de Astro.

## Consecuencias

- Positivas: toda dependencia de la fundación tiene un ADR que la justifica; las mismas comprobaciones corren en local y en la integración continua; el hook de git no depende de ninguna herramienta.
- Negativas / deuda asumida: `core.hooksPath` se configura por clon. Lo hace el script `prepare` al instalar, pero si alguien clona sin instalar, el hook no está activo (la integración continua sigue verificando). La medición de laboratorio no mide la respuesta a interacciones: se usa el tiempo total de bloqueo como sustituto, y la medición real llega con la spec 011 y la analítica.
- Qué habría que hacer para revertirla: sustituir las configuraciones de formato y análisis y el archivo del presupuesto; ningún código de producto depende de estas herramientas.
- Revisar el: al cerrar la iteración 1, midiendo cuánto tarda el hook de confirmación y cuántos minutos consume la integración continua.

## Efecto en el proyecto

- `stack.md`: las filas de pruebas y de formato enlazan a este ADR.
- Hooks del kit: `pre_commit_test_command` vacío; se añaden los formateadores de `.astro`, `.mjs`, `.jsonc` y `.yml`.
- Constitución: la regla 9 nombra las cifras exactas del perfil de medición.
