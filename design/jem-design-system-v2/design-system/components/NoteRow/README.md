# NoteRow

Una nota técnica como fila: categoría, título en `title` y estado. Sustituye a las tres tarjetas iguales del repo.

- Sin publicar: `<li>` no enlazado con estado *In progress* en `text-dim` (antes *Writing — not published yet* en `text-faint`).
- Publicada: la fila entera es un `<a>`, el título se subraya con `border-control` y el estado dice *Read →*.
- Categoría sin numeración ("01 / ML" pasa a *ML*).
- Si ninguna nota está publicada, la sección puede ir como subsección pequeña de Stack; no merece un titular propio.
- El consumidor aporta: `category`, `title`, `status`, `url` opcional.
