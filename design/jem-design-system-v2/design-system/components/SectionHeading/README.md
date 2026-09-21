# SectionHeading

El h2 visible de cada sección en `display-section`, con un conteo opcional y un enlace secundario alineado a la base.

- Sustituye a la etiqueta mono de 11px del repo, que era el h2 real pero no se veía: ahora la estructura se lee al escanear.
- Texto del título en sentence case en el HTML (*Projects*, *Lab*, *Experience*, *Stack*, *Notes*); las mayúsculas las pone el CSS.
- Sin subtítulos tipo "Lab — two things built from the projects above": si hace falta contexto, una frase `body-sm` debajo, no una eyebrow.
- Enlace secundario en `jem-link` (mono 12px, 44px de alto); hover a `accent-text`.
- El consumidor aporta: `id`, título, conteo opcional y enlace opcional.
