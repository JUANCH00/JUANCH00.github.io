# 3. CSS Modules over a utility framework

- **Status:** Accepted
- **Date:** 2026-08-24

## Context

The design is a specific one — an oversized display face, a single hot accent on
near-black, hairline rules — not a generic component library. It needs a small
number of very deliberate values used consistently, and it must respond to
`prefers-reduced-motion`.

Options considered: a utility framework (Tailwind), a CSS-in-JS runtime, or
plain CSS Modules over custom properties.

## Decision

CSS Modules, one file per component, over a single token file
(`src/ui/styles/tokens.css`) of custom properties.

## Consequences

- Zero runtime styling cost and no extra dependency; the whole stylesheet is
  20 KB (4.4 KB gzipped).
- Class names are locally scoped, so no BEM discipline is required and no
  component can leak a style into another.
- Every colour, size, space step and easing curve is declared once. Retheming is
  editing one file; reduced-motion is handled by overriding three duration
  tokens in one media query.
- The trade-off is more files and no utility-class shorthand — acceptable for a
  design with this few, this intentional, values.
