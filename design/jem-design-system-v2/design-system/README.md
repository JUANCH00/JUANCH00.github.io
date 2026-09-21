Sistema visual del portafolio de Juan Esteban Moreno (juanch00.github.io): un cartel tipográfico sobre casi negro, un solo acento naranja incandescente y filetes finos en lugar de cajas. Lectura de diseño: **portafolio de desarrollador para recruiters y líderes técnicos, lenguaje editorial-brutalista oscuro, CSS Modules sobre tokens, tipografía cinética contenida.** Diales: variación 6, movimiento 5, densidad 4.

## Principios

1. **La tipografía es la imagen.** El nombre, los proyectos y las secciones se componen en `display` (Anton) a gran escala. No hay ilustraciones ni fotos decorativas: el único "visual" real es el Lab, que es interactivo.
2. **Un acento, un trabajo.** `accent` significa "mira aquí": el CTA primario, el estado de disponibilidad, la métrica de cada proyecto y el anillo de foco. Nada más se pinta de naranja: ni títulos de grupo, ni roles, ni viñetas.
3. **Filetes, no tarjetas.** Agrupa con `line` (hairline superior) y espacio. Solo las demos del Lab son tarjetas, porque contienen un escenario con estado propio.
4. **Esquina viva.** `radius-none` en todo. `radius-full` solo para lo que es un círculo en el mundo real (balón, nodo, punto de estado).
5. **Legible primero.** Todo texto ≥ 12px y ≥ 4.5:1 en su superficie, todo control ≥ 44px de lado con borde ≥ 3:1.

## Contenido y voz

- Inglés, primera persona, frases cortas y concretas. Verbos de ingeniería, no de marketing: *"I train models, serve them through an API and put them in front of a user."*
- Números reales y con fuente: *"54% validation accuracy"*, *"1,000+ model completions"*. Nunca cifras inventadas para rellenar.
- Casing: titulares en `display` siempre en MAYÚSCULAS vía `text-transform`; el texto fuente se escribe en sentence case (*"Selected projects"*), para que los lectores de pantalla no deletreen.
- **Sin guion largo (—) ni semicorto (–)** en ningún texto visible. Rangos con guion: *"Apr 2025 - Aug 2026"*. Separadores de metadatos: salto de línea o columnas; como mucho un `·` por línea.
- Sin numeración decorativa (*"01 / Penalty shootout"*, *"02 / Distributed"*) y sin emoji. El orden de la página ya numera.
- Una etiqueta por intención: el CV siempre es **"Download CV"** y los proyectos **"See projects"**.

## Color

- Página en `bg`; escenarios del Lab en `surface`; tarjetas en `surface-raised`; hover de filas enlazadas en `surface-hover`.
- Texto: titulares y cuerpo en `text`; listas y roles en `text-soft`; párrafos de apoyo en `text-muted`; fechas, contexto y etiquetas en `text-dim`. `text-faint` no es para leer: solo decoración o deshabilitado.
- Texto en acento con `accent-text` (en oscuro es `accent`; en Paper baja a #b82c00). Sobre relleno `accent`, siempre `on-accent`, nunca blanco.
- `line` y `line-strong` son decorativos. Todo borde que delimita un control usa `border-control`.
- NavBar fija sobre `scrim` + `backdrop-filter: blur(12px)` y un filete `line` inferior. Nada de `mix-blend-mode: difference` ni `#fff` puro.
- Tema: el sitio es oscuro (`dark`). `light` (Paper) es opcional vía `prefers-color-scheme: light`; si se activa, se activa entero, nunca por secciones.

## Tipografía

- `display` (Anton 400) para nombre, secciones, proyectos, tarjetas y organizaciones, en MAYÚSCULAS con interlineado 0.88 a 1.05. Es la voz de la marca.
- `sans` (Space Grotesk 400/500/700) para todo lo que se lee: `lead`, `body`, `body-sm`, `title`.
- `mono` (IBM Plex Mono 400/500) para metadatos: `label`, `meta`, `button`. Nunca por debajo de 12px.
- Tamaños de display fluidos con `clamp()` (ver la nota de cada estilo); el valor del token es el máximo.
- Énfasis dentro de un titular: color `accent-text` en la MISMA familia, nunca otra fuente.
- Párrafos a `measure` (640px) como máximo.

## Espacio y maquetación

- Rejilla de 4px: `space-1` (4) a `space-11` (128). Nada de 22px, 26px o 44px sueltos.
- Contenedor centrado a `page-max` con margen `page-gutter` (clamp 16 a 48px).
- Sección: `space-10` arriba en escritorio, `space-9` en móvil; titular `display-section` y luego `space-7` hasta el contenido.
- Hero: padding superior ≤ 96px, nombre en 2 líneas, CTA visible sin scroll a 1440×900 y a 390×844.
- Todo layout de varias columnas colapsa a una columna por debajo de 768px.
- Orden de secciones recomendado: Hero, Projects, Lab, Experience, Stack, Notes, Contact. El Lab es la prueba de lo que dicen los proyectos: va justo después.

## Movimiento

- Solo `transform` y `opacity`. Duraciones `duration-fast` (feedback), `duration-base` (estado), `duration-slow` (entradas); curvas `ease-out-expo` y, solo para el portero, `ease-spring`.
- Cada animación tiene un porqué: el nombre sube una vez al cargar (jerarquía), las secciones aparecen al entrar (secuencia), el portero rebota (feedback del juego).
- Un único Marquee por página (el del stack), a `duration-marquee`, pausado en hover.
- Sin cursor personalizado: el halo de puntero (PointerHalo) se retira.
- `prefers-reduced-motion: reduce` apaga todo: el Marquee pasa a scroll manual, el reveal aparece sin desplazamiento.

## Estados e interacción

- Foco: `outline: 2px solid accent-text` con `outline-offset: 3px` en todo lo interactivo. En oscuro es el naranja (≥ 4.7:1); en Paper baja a #b82c00, porque #ff3d00 sobre `surface` claro da 2.9:1. ≥ 4.5:1 en todas las superficies de ambos temas.
- Pulsación: `transform: translateY(1px)` en `:active`.
- Hover de fila: fondo `surface-hover` y el contenido se desplaza con `translateX(space-4)`, no con `padding-left` (que recalcula el layout).
- Objetivos táctiles de al menos `target-min`: enlaces de la nav, botones de nodo, botón de copiar email.

## Iconografía

El repo no usa librería de iconos, y el sistema tampoco la necesita: flechas tipográficas (→ ↓) dentro de los botones y nada más. Si más adelante hace falta un icono, usa Phosphor (trazo 1.5) y una sola familia.

## Logo

`assets/Logos/favicon.svg`: la J en `accent` sobre un cuadrado `bg`. Es la única marca; en la nav la identidad se escribe en texto: **J.E.M.** en `label`.
