# Button

Botón rectangular en mono mayúsculas: primario en `accent` para la acción de la vista, ghost con `border-control` para el resto, y `--sm` para controles del Lab.

- **Primario** (`jem-btn jem-btn--primary`): una vez por vista. En el hero es *See projects*. Texto `on-accent`, nunca blanco.
- **Ghost** (`jem-btn`): *Download CV* y acciones secundarias. Borde `border-control` (≥ 3:1): el borde antiguo #3a352f no se veía.
- **Pequeño** (`jem-btn--sm`): botones de nodo y *Restore all* del clúster. Alto `target-min` (44px). Con `aria-pressed="true"` se tacha y baja a `text-dim`.
- Altura 48px, etiqueta en una línea (`white-space: nowrap`), máximo 3 palabras. Flecha tipográfica opcional al final.
- `:active` baja 1px; foco con el anillo global en `accent`.
- El consumidor aporta: el elemento (`<a>` si navega o descarga, `<button type="button">` si actúa) y el texto.
