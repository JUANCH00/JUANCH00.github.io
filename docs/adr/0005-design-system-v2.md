# 5. Design system v2: an audit, a token file and executable rules

- **Status:** Accepted
- **Date:** 2026-09-21

## Context

The first version of the site had a strong identity (near-black ground, one
incandescent accent, a condensed display face, hairlines instead of boxes) and
a list of problems an audit against three sets of design rules made concrete:
labels at 10px, a dim text colour at 4.2:1, control borders at 1.6:1, 44px
targets missed in the nav and the lab, a hero whose actions sat on the bottom
edge of a laptop screen, section headings nobody could see, an accent spent on
nine different jobs, a custom cursor, a live clock, and a row hover that
animated `padding-left`.

The full audit, its 20 findings and the target components are in
`design/jem-design-system-v2/`.

## Decision

Refine, do not redesign. Keep the identity and fix the findings:

- Replace `tokens.css` with v2: a strict 4px space scale, nothing under 12px,
  contrast checked for every text and border colour, a page column capped at
  1440px, and a light "Paper" palette kept ready but disabled.
- Spend the accent on four things only: the primary action, availability,
  project metrics and focus, plus the contact phrase and the lab's stage.
- Remove the pointer halo and the live clocks; make section headings the
  display face; move the Lab right after Projects, where it proves them.
- Share one `Button` and one `Container` instead of per-section copies.
- Animate `transform` and `opacity` only.
- Turn every rule a machine can check into a test: no em or en dash in any
  visible or spoken string, a hero lead of at most 20 words, no decorative
  numbering, nav order equal to page order.

The design package is committed under `design/` and excluded from Prettier:
it is reference material, not source.

## Consequences

- The site passes the design system's acceptance checks, measured in a real
  browser: no text under 12px, lowest text contrast 5.05:1, every target at
  least 44x44px, hero actions visible without scrolling at 1440x900 and
  390x844.
- A future copy edit that reintroduces an em dash, or a section added to the
  page but not to the nav, fails CI instead of shipping.
- The light theme costs nothing until it is wanted; enabling it is a
  `data-theme` attribute, since every colour, including the canvas palette,
  already comes from tokens.
- The repository carries about 1.8 MB of design screenshots and fonts that the
  site does not load.
