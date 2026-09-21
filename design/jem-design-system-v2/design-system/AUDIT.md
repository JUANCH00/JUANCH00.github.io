# Auditoría

Revisión del sitio en `main@0670fa3`, renderizado a 1440×900 y 390×844, contra las reglas de impeccable, design-taste-frontend y ui-ux-pro-max. Modo: **refinamiento que preserva la identidad** (casi negro, naranja #ff3d00, Anton, filetes, esquina viva). Lo que funciona se queda; lo que falla se corrige en este sistema.

## Lo que ya funciona

- Identidad clara y propia: un cartel tipográfico, no una plantilla de portafolio.
- Un solo acento bien elegido: #ff3d00 da 5.5:1 sobre `bg`, válido incluso como texto.
- El Lab: dos demos reales (penalti con la precisión real del modelo, clúster con failover) que prueban lo que dicen los proyectos. Es el mejor activo del sitio.
- Base técnica seria: landmarks, skip link, `prefers-reduced-motion` en tokens, filas enteras como un único enlace, notas sin publicar que no fingen ser enlaces.

## Hallazgos y corrección

| # | Área | Hallazgo en el repo | Regla | Corrección en v2 |
|---|---|---|---|---|
| 1 | Contraste | `--color-text-dim` #7a746a da 4.2:1 en `bg` y 4.1:1 en `surface`: falla AA y es el color de todas las etiquetas, fechas y contextos. | ui-ux: contraste 4.5:1 | `text-dim` → #8f887d (≥ 4.9:1 en todas las superficies). |
| 2 | Contraste | `--color-text-faint` #5c564e (2.7:1) se usa para texto real: footer, ubicación, "Writing, not published yet". | ui-ux: contraste 4.5:1 | `text-faint` queda solo para decoración/deshabilitado; esos textos pasan a `text-dim`. |
| 3 | Contraste de controles | Borde del botón ghost y de los nodos en #3a352f: 1.6:1, el control no se distingue. | WCAG 1.4.11: 3:1 | Nuevo token `border-control` #6e685f (≥ 3.2:1). |
| 4 | Tamaño de texto | Etiquetas a 10px, 10.5px y 11px (`--text-micro`, `--text-mono`, tags, log). | ui-ux: texto ≥ 12px | Estilos `label`, `meta`, `button`: 12 a 13px. |
| 5 | Objetivos táctiles | Enlaces de la nav a 10px con 12px de gap en móvil; botones de nodo ~30px de alto. | ui-ux: 44×44px | `target-min` 44px en nav, nodos y copiar email. |
| 6 | Hero | Nombre a 230px en 3 líneas: a 1440×900 el CTA queda en el borde inferior, y en móvil muy abajo. Padding superior 120px. | taste 4.7: hero cabe en el viewport, pt ≤ 96px | Nombre en 2 líneas a `display-hero` (clamp máx. 144px), padding ≤ 96px. |
| 7 | Hero | 7 elementos de texto: franja meta de 3 ítems, nombre, lead de 32 palabras, kicker, 2 CTAs. | taste: máx. 4 elementos, subtexto ≤ 20 palabras | Estado de disponibilidad (1 etiqueta), nombre, lead ≤ 20 palabras, 2 CTAs. El kicker de Outlier se mueve a Experience, donde ya está. |
| 8 | Jerarquía | Los h2 de sección son etiquetas mono de 11px en gris tenue: la estructura de la página es invisible al escanear. | impeccable: jerarquía; taste: restricción de eyebrows (máx. 1 cada 3 secciones) | h2 en `display-section`. Las 6 etiquetas mono en mayúsculas quedan en 1 (el estado del hero). |
| 9 | Acento | El naranja pinta además títulos del Stack, roles, viñetas, badges, categorías de notas y la mitad del titular de contacto. Pierde su función de "mira aquí". | taste 4.2: bloqueo de color; principio del ADR 0003 | El acento queda en 4 usos: CTA primario, disponibilidad, métrica de proyecto, foco. |
| 10 | Em-dash | "Systems Engineering — UPTC", "Lab — two things…", "Apr 2025 — Aug 2026", roles, aria-labels, footer. | taste 9.G: cero em-dashes | Guion simple en rangos; saltos de línea como separador. |
| 11 | Numeración decorativa | "01 / Penalty shootout", "02 / Kill a node", "01 / ML" en notas, "(03)". | taste 9.F: sin numeración de sección | Eliminada. |
| 12 | Cursor | PointerHalo: punto con `mix-blend-mode: difference` que sigue al ratón. | taste 9.A: sin cursores personalizados | Retirado. |
| 13 | Franjas de lugar/hora | Reloj en vivo "11:44:32 TUNJA" en la nav y "Tunja, Colombia — hora" en el footer. | taste 9.F: sin franjas de lugar/hora | Retirado de la nav; en el footer queda "Tunja, Colombia" como dato de contacto, sin reloj. |
| 14 | NavBar | `mix-blend-mode: difference` con #fff puro: el color cambia sobre cada bloque y el blanco puro rompe la paleta cálida. | taste 8.B: sin #fff puro | Fondo `scrim` + blur, filete `line`, texto `text`. Altura `nav-height` 64px. |
| 15 | Notas | Tres tarjetas idénticas, todas "not published yet": la sección promete contenido que no existe. | taste 9.C: sin 3 tarjetas iguales; 4.9 densidad | NoteRow: lista compacta "In progress" con filetes; al publicar una nota su fila se vuelve enlace. |
| 16 | Hover de fila | ProjectRow anima `padding-left`: recalcula layout en cada frame. | taste 6.A: solo transform/opacity | `translateX` del contenido interior. |
| 17 | Espaciado | Escala con 22px, 26px y 44px fuera de la rejilla; margen lateral máx. 26px y sin ancho máximo: a 1440px el contenido toca los bordes. | ui-ux: espaciado consistente | Rejilla de 4px, `page-gutter` hasta 48px, `page-max` 1440px. |
| 18 | CTA duplicado | "Download CV (PDF)" en el hero y "Full CV (PDF) →" en Experience. | taste 4.5: una etiqueta por intención | "Download CV" en ambos. |
| 19 | Superficies | `--color-surface-hover` #141210 es más oscuro que `--color-surface-raised` #171514: el hover "hunde" en vez de elevar. | impeccable: coherencia de estados | `surface-raised` #1a1816, `surface-hover` #1f1d1a. |
| 20 | Tema | Solo oscuro, sin tokens para claro. | taste 6.C / ui-ux: modo claro y oscuro | Tema `light` (Paper) completo y con contraste verificado, opcional por `prefers-color-scheme`. |

## Pendiente de decisión (no aplicado)

- **Copy**: el lead del hero se recorta a ≤ 20 palabras; la frase propuesta es *"I train models, serve them through an API and put them in front of a user."* (tomada de la meta description). Confírmala o propón otra.
- **Orden de secciones**: mover el Lab justo después de Projects.
- **Imagen**: design-taste-frontend pide imágenes reales en portafolios. Aquí el Lab cumple ese papel; una foto tuya o capturas reales de GoalPredict y GoalQuest sumarían, pero hacen falta los archivos.
