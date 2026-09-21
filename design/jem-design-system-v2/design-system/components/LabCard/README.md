# LabCard

Tarjeta de una demo del Lab: título, dato real, una frase, el escenario interactivo y una fila de estado. Las únicas tarjetas del sistema.

- Fondo `surface-raised` con borde `line-strong`; el escenario dentro en `surface` (antes ambos casi iguales).
- Título en `display-card` y color `text`, sin numeración ("01 / Penalty shootout" pasa a *Penalty shootout*).
- El dato (*Keeper accuracy 54%*, *3 replicas*) en `meta` `text-dim`; no compite con el escenario.
- Controles dentro del escenario: casillas con borde `border-control` punteado y hover `accent-wash`; botones de nodo con `jem-btn--sm`.
- Log y marcador en `meta` a 12px con cifras tabulares; mensajes de estado en una región `aria-live="polite"`.
- Dos tarjetas lado a lado desde 720px; una columna debajo.
- El consumidor aporta: `title`, `badge`, `blurb` y el escenario como `children`.
