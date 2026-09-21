# NavBar

Barra fija de 64px (`nav-height`) sobre `scrim` con blur y filete `line`: marca en texto a la izquierda, anclas de sección a la derecha.

- Reemplaza al `mix-blend-mode: difference` con `#fff` puro del repo: el color ya no cambia sobre cada bloque.
- Sin reloj ni ciudad (era una franja de lugar/hora decorativa).
- Cada enlace mide al menos `target-min` de alto; la sección activa lleva `aria-current="true"` y un subrayado interior de 2px en `accent`.
- En móvil los enlaces hacen scroll horizontal en una sola línea en vez de partirse en dos filas a 10px.
- Marca: **J.E.M.** en `label`. El "⌁ 2027" del repo se retira: el año de disponibilidad ya está en el hero.
- El consumidor aporta: la lista de secciones `{id, label}` y la sección activa (IntersectionObserver, nunca un listener de scroll).
