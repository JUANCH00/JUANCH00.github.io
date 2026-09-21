# Hero

El primer viewport: estado de disponibilidad, nombre en `display-hero` a dos líneas, una frase y dos acciones. Nada más.

- Cuatro elementos de texto como máximo: estado (`label` + punto `accent`, único eyebrow de la página), nombre, `lead` de ≤ 20 palabras, CTAs.
- Nombre en 2 líneas (*Juan Esteban* / *Moreno*) con `clamp(3.25rem, 10vw, 9rem)`: a 1440×900 y 390×844 los CTA se ven sin scroll. Padding superior ≤ 96px bajo la nav.
- La franja "Systems Engineering — UPTC / Machine learning / backend" y el kicker de Outlier salen del hero: el primero cabe en el lead, el segundo ya está en Experience.
- Animación: cada línea del nombre sube una vez (`duration-slow`, `ease-out-expo`, 100ms de desfase). Con movimiento reducido aparece quieta.
- Debajo del hero va el Marquee del stack (el único de la página).
- El consumidor aporta: `displayLines` (2), el texto de estado, el lead y la URL del CV.
