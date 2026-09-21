# Marquee

Cinta horizontal del stack bajo el hero, en `display` y `text-soft`. Única por página.

- Separador "/" en `text-dim`; el asterisco naranja del repo se retira para liberar el acento.
- Vuelta completa en `duration-marquee` (40s), pausa en hover. Con movimiento reducido no se mueve y hace scroll manual.
- La pista duplicada va con `aria-hidden`; la lista legible la da un `VisuallyHidden` o el `aria-label`.
- El consumidor aporta: `items`.
