# ProjectRow

Un proyecto como una sola fila enlazada: nombre en `display-project`, métrica real en acento, contexto, resumen y stack.

- Toda la fila es un `<a>` (un tab stop, objetivo grande). `aria-label` sin em-dash: *"GoalPredict, 54% validation accuracy. Open the repository on GitHub."*
- La métrica es el único texto en `accent-text` de la fila y debe ser un dato real.
- Contexto en `meta` con coma, no "·" ni "—": *"UPTC, 2025 - present"*.
- Hover: fondo `surface-hover` y el contenido se desplaza con `transform: translateX(space-4)`. El repo animaba `padding-left` (layout en cada frame).
- Filete superior por fila; el contenedor `.jem-projects` pone el inferior.
- El consumidor aporta: `name`, `metric`, `context`, `summary`, `tags`, `repositoryUrl`.
