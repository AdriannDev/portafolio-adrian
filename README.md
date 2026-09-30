# Portafolio Adrián · The Universe + Mission Control

Plataforma profesional de Adrián Marchan (desarrollo web, e-commerce, automatización, SEO y analítica; Lima, Perú): un portafolio que presenta los proyectos como misiones, vende servicios a PYMES y se mide a sí mismo.

Estado: **en construcción**. Producción provisional en https://portafolio-adrian.pininodev.workers.dev, con `noindex` hasta el lanzamiento (spec 015).

Astro 7 con TypeScript estricto, Tailwind CSS 4, sin base de datos, publicado en Cloudflare Workers con activos estáticos. Decisiones: [docs/02-arquitectura/](docs/02-arquitectura/).

## Requisitos

| Qué | Versión | Por qué |
|---|---|---|
| Node.js | 24.16.0 o posterior en la línea 24 | Lo exige `eslint-plugin-astro`. Node 24 incluye corepack |
| pnpm | la de `packageManager` en `package.json` | Se activa con corepack; no uses npm ni yarn |
| Git | cualquiera reciente | El hook de confirmación es un script `sh` (en Windows, Git Bash) |
| Chromium de Playwright | la que fija el lockfile | Pruebas de navegador. Se instala aparte (unos 310 MB, fuera del repositorio) |
| Google Chrome del sistema | estable | Solo para `pnpm perf` (Lighthouse) |

## Instalar

```bash
git clone https://github.com/AdriannDev/portafolio-adrian.git
cd portafolio-adrian
corepack enable
pnpm install
pnpm exec playwright install chromium
```

`pnpm install` activa el hook de git (`.githooks/pre-commit`) con el script `prepare`, pero **solo si instala algo**: si responde «Already up to date», no se ejecuta. Para activarlo a mano:

```bash
git config core.hooksPath .githooks
```

## Ejecutar

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo en http://localhost:4321 |
| `pnpm build` | Genera el sitio estático en `dist/` |
| `pnpm preview` | Sirve `dist/` tal como se publicará |

## Probar

| Comando | Qué hace | Tiempo aproximado |
|---|---|---|
| `pnpm check` | Tipos, análisis estático, formato y literales de estilo fuera de los tokens | 10 s (30 s en frío) |
| `pnpm test <patrón>` | Las pruebas unitarias cuyo archivo coincide con el patrón. Sin `--` delante: pnpm 12 lo reenvía y Vitest no filtra | < 1 s |
| `pnpm test` | Todas las pruebas unitarias | < 1 s |
| `pnpm test:e2e` | Construye y ejecuta las pruebas de navegador contra `dist/` en el puerto 4323 | 15 s |
| `pnpm test:all` | Unitarias + navegador | 20 s |
| `pnpm perf` | Construye y mide la portada contra el presupuesto de rendimiento. En Windows puede abortar con `EPERM … Temp\lighthouse.NNNN` sin que falle el presupuesto: se reintenta ([gotchas](docs/gotchas.md)) | 70 s |
| `pnpm format` | Formatea el código con Prettier | |

El hook de confirmación ejecuta `pnpm check && pnpm test` y bloquea el commit si algo falla (unos 15 s).

## Publicar

Solo publica la integración continua ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)). Nunca se despliega a mano.

1. **Propuesta de cambio** contra `main`: `verify` repite todas las comprobaciones de arriba. Si pasa, `deploy-preview` sube una versión sin desplegarla y el bot comenta en la propuesta dos direcciones: `https://pr-<número>-portafolio-adrian.pininodev.workers.dev`, que apunta siempre a la última versión verificada, y la de esa versión concreta. Una dirección nueva puede tardar alrededor de un minuto en responder; antes, Cloudflare devuelve «Page not found».
2. **Integración en `main`**: `verify` y, si pasa, `deploy-production` publica en producción el mismo `dist/` que se verificó. Si `verify` falla, no se publica nada.

El ruleset de `main` exige `verify` en verde: GitHub no deja fusionar una propuesta en rojo ni empujar a `main` un commit sin verificar. Una propuesta desde un fork se verifica, pero no se previsualiza, porque no recibe los secretos de Cloudflare.

No conectes el repositorio desde el panel de Cloudflare: activaría Workers Builds, un segundo camino de despliegue que no espera a `verify`.

## Volver atrás

Una sola operación, sin datos que tocar (el sitio no guarda ninguno). Requiere autorizar `wrangler` una vez; abre el navegador:

```bash
pnpm exec wrangler login
```

Para ver los despliegues recientes y la versión de cada uno:

```bash
pnpm exec wrangler deployments list
```

Para volver al despliegue anterior (pide confirmación):

```bash
pnpm rollback
```

Con un identificador, `pnpm rollback <id-de-versión>` vuelve a esa versión concreta; sirve también para regresar a la actual. Comprueba antes el destino: las primeras versiones del historial se crearon desde el panel y son la plantilla de ejemplo, no el sitio. El siguiente empuje a `main` vuelve a publicar con normalidad.

## Configuración y secretos

Ninguna credencial vive en el repositorio. Hoy no hace falta ninguna variable en local.

| Variable | Dónde | Para qué |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Secreto del repositorio en GitHub | Token de API con la plantilla «Edit Cloudflare Workers». Lo usan `deploy-preview` y `deploy-production` |
| `CLOUDFLARE_ACCOUNT_ID` | Secreto del repositorio en GitHub | Identificador de la cuenta de Cloudflare donde vive el Worker |

El token con el que el bot comenta en las propuestas lo pone GitHub en cada ejecución; no hay que crearlo.

## Coste

- **Cloudflare Workers**, capa gratuita: las peticiones a activos estáticos son gratuitas e ilimitadas y se permite el uso comercial ([ADR-007](docs/02-arquitectura/decisiones/ADR-007-alojamiento-cloudflare-ci.md)).
- **GitHub Actions**, repositorio público: los minutos de los runners estándar son gratuitos e ilimitados. Cada ejecución tarda unos 3.
- Coste previsto de operación: solo el dominio, cuando llegue (spec 015).

## Documentación

- Instrucciones para Claude Code y convenciones: [CLAUDE.md](CLAUDE.md)
- Contexto y requerimientos: [docs/01-contexto/](docs/01-contexto/)
- Arquitectura, constitución y decisiones: [docs/02-arquitectura/](docs/02-arquitectura/)
- Sistema de diseño: [docs/03-diseno/](docs/03-diseno/)
- Spec en curso: [docs/specs/ACTIVA.md](docs/specs/ACTIVA.md)
- Trampas conocidas del entorno: [docs/gotchas.md](docs/gotchas.md)
