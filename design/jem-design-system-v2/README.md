# JEM Portfolio: design system v2

Auditoría y sistema de diseño del portafolio juanch00.github.io (repo `JUANCH00/JUANCH00.github.io`, commit `0670fa3`), hecho con impeccable, design-taste-frontend y ui-ux-pro-max.

## Cómo usarlo con Claude Code

1. Descomprime esta carpeta dentro de tu repo, por ejemplo en `design/jem-design-system-v2/` (no la metas en `src/`).
2. Abre Claude Code en el repo y pega este prompt:

```
Lee design/jem-design-system-v2/implementation/CLAUDE_CODE_BRIEF.md y aplícalo al repo.
Empieza por leer AUDIT.md y README.md del design system. Trabaja en una rama nueva,
un commit por paso, y pregúntame las "Pending decisions" antes de tocarlas.
Al final corre npm run verify y compara con las capturas de screenshots/.
```

## Qué hay dentro

| Carpeta | Contenido |
|---|---|
| `implementation/CLAUDE_CODE_BRIEF.md` | Instrucciones paso a paso para Claude Code, archivo por archivo, con criterios de aceptación. |
| `implementation/tokens.css` | Reemplazo directo de `src/ui/styles/tokens.css`, con los nombres que ya usa el repo. |
| `design-system/AUDIT.md` | Los 20 hallazgos de la auditoría y su corrección. |
| `design-system/README.md` | Reglas de uso: principios, voz, color, tipografía, espacio, movimiento, estados. |
| `design-system/tokens.json` | Tokens en formato máquina (temas Dark y Paper). |
| `design-system/tokens.generated.css` | Los mismos tokens con nombres cortos (los que usa `bundle.css`). |
| `design-system/components/` | 11 componentes: guía (`README.md`) y vista previa (`preview.html`), más `bundle.css` de referencia. |
| `design-system/fonts/` | Anton, Space Grotesk (400/500/700) e IBM Plex Mono (400/500) en woff2 (licencia OFL). |
| `design-system/assets/Logos/` | El favicon original. |
| `screenshots/antes/` | El sitio actual (escritorio y móvil). |
| `screenshots/componentes-v2/` | Los componentes nuevos en Dark (960 y 390px) y en Paper. |

Para ver una vista previa en el navegador, abre el `preview.html` con `tokens.generated.css` y `components/bundle.css` enlazados, o simplemente mira las capturas de `screenshots/componentes-v2/`.
