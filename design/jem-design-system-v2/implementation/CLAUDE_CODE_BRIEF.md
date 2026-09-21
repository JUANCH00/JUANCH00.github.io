# Brief for Claude Code: apply design system v2 to juanch00.github.io

You are working in the repo `JUANCH00/JUANCH00.github.io` (React 19 + Vite + TypeScript, CSS Modules over `src/ui/styles/tokens.css`, layered architecture described in `docs/ARCHITECTURE.md`). This folder is the output of a design audit made against the rules of three skills: **impeccable**, **design-taste-frontend** and **ui-ux-pro-max**. Your job is to implement it in code.

**Mode: refinement that preserves the identity.** Keep the near-black ground, the #ff3d00 accent, Anton / Space Grotesk / IBM Plex Mono, hairlines and sharp corners. Do NOT redesign. Do NOT change architecture, section ids, URLs, the data model shape (unless listed), SEO meta or JSON-LD.

## Read first (in this order)

1. `../design-system/AUDIT.md`: the 20 findings, each with its fix. This is the spec.
2. `../design-system/README.md`: the usage rules (principles, voice, colour, type, space, motion, states).
3. `../design-system/components/<Name>/README.md` + `preview.html`: target look per component. `../design-system/components/bundle.css` is a reference implementation of every component in plain CSS (class prefix `jem-`); port the values into the matching CSS Modules, do not import that file.
4. `../screenshots/antes/`: the site today. `../screenshots/componentes-v2/`: the target components (dark 960px, Paper 960px, dark 390px).

`../design-system/tokens.json` is the machine-readable source; `tokens.css` next to this brief is the same thing already in the repo's naming convention.

## Step 1: tokens

Replace `src/ui/styles/tokens.css` with `implementation/tokens.css`. Then update every CSS Module that uses a removed or renamed token:

| Old token | New token / action |
|---|---|
| `--color-text-dim` #7a746a | same name, new value #8f887d (no code change) |
| `--color-text-faint` used for readable text (SiteFooter, `.location` in Experience, `.status` in Notes) | switch those to `--color-text-dim`; keep `--color-text-faint` only for disabled/decoration |
| `--color-line-focus` (Hero `.action`, ClusterLab `.node/.restore`, PenaltyLab `.cell`) | `--color-border-control` |
| `--text-micro` (10px), `--text-mono` (11px), hard-coded `0.65625rem`, `0.90625rem`, `0.9375rem`, `0.75rem` | `--text-label` (12px) for mono labels/meta/tags/log, `--text-button` (13px) for buttons, `--text-sm` (15px) for summaries/highlights/blurbs |
| `--text-xl` | `--text-lg` (19px) |
| `--tracking-nav` | `--tracking-button` |
| `--space-5..10` (values changed: 22→24, 26→32, 32→40, 44→48, 56→64, 80→96) | same names, new values; eyeball each section after the change |
| `--max-measure` 41.25rem | same name, 40rem |
| `--z-cursor` | delete (PointerHalo removed) |
| hard-coded `#fff` in NavBar | `--color-text` |

Add a page container: sections get `max-width: var(--page-max); margin-inline: auto; padding-inline: var(--page-gutter)` (put it in `Section.module.css`, Hero, Contact, Footer and the Marquee wrapper, or add a `Container` primitive in `src/ui/primitives`).

Global (`global.css`): focus ring becomes `outline: 2px solid var(--color-accent-text)`; `scroll-padding-top: calc(var(--nav-height) + var(--space-4))`; `::selection` uses `--color-accent` / `--color-on-accent`.

## Step 2: components (map to repo files)

- **PointerHalo** (`src/ui/effects/`): remove it from `App.tsx` and delete the component + CSS. Remove `useFinePointer` only if nothing else uses it. (Audit #12)
- **NavBar** (`src/features/navigation/`): drop `mix-blend-mode: difference` and `#fff`; background `--color-scrim` + `backdrop-filter: blur(12px)` + bottom border `--color-line`; height `--nav-height`. Remove the live clock (and `useLocalTime` if unused afterwards). Brand text `J.E.M.` (drop "⌁ 2027"). Every link `min-height: var(--target-min)`, mono 12px, `--color-text-soft`, hover/active `--color-text` + `box-shadow: inset 0 -2px 0 var(--color-accent)`. Mark the active section with `aria-current="true"` using an IntersectionObserver hook (no scroll listener). On mobile: one row, links scroll horizontally (`overflow-x: auto`), never wrap to two lines. Keep nav labels as they are ("Work" etc.). (Audit #5, #13, #14)
- **Hero** (`src/features/hero/`): max 4 text elements: (1) status line `Open to internships, January 2027` in mono label style with an 8px accent dot (the only eyebrow on the page), (2) name on **2 lines**: change `identity.displayLines` to `['Juan Esteban', 'Moreno']`, size `--display-hero`, line-height 0.88, (3) lead ≤ 20 words (see "Pending decisions"), (4) CTAs `See projects ↓` (primary) + `Download CV` (ghost). Remove the meta strip (UPTC / ML backend) and the kicker paragraph from the hero. Top padding ≤ `--space-10` under the nav. Buttons: min-height 48px, one line, `:active { transform: translateY(1px) }`. Check at 1440×900 and 390×844 that the CTAs are visible without scrolling. (Audit #6, #7, #18)
- **Section** primitive (`src/ui/primitives/Section.tsx`): the visible `h2` becomes a real display heading (`--display-section`, Anton, uppercase via CSS) using `title`; drop the mono kicker labels. Optional count renders as a small mono number next to the title; `aside` link stays, styled like `.jem-link` in bundle.css (44px tall). Update callers: Work (`title="Selected projects"`, count 3, aside "All repos on GitHub →"), Experience (aside "Download CV →", same label as the hero CTA), Lab, Stack, Notes. (Audit #8, #18)
- **ProjectRow**: hover no longer animates `padding-left`; wrap content in an inner div and animate `transform: translateX(var(--space-4))` on hover/focus-visible, background `--color-surface-hover`. aria-label without em dash: `${name}, ${metric}. Open the repository on GitHub.` Context in 12px mono. (Audit #16, #10)
- **TagList**: 12px (`--text-label`). (Audit #4)
- **ExperienceSection**: role in `--color-text-soft` (not accent). Location in `--color-text-dim`. Bullet marker: a 10×1px line in `--color-text-dim` instead of the orange "—". (Audit #9, #2)
- **LabSection / LabCard**: remove numbering from titles ("Penalty shootout", "Kill a node"); card background `--color-surface-raised`, border `--color-line-strong`; title colour `--color-text`; badge in mono 12px `--color-text-dim`. PenaltyLab cells: border `--color-border-control`. ClusterLab node/restore buttons: `min-height: var(--target-min)`, border `--color-border-control`; log 12px. (Audit #3, #5, #9, #11)
- **StackSection**: group titles in `--color-text`, not accent. (Audit #9)
- **Marquee**: separator `/` in `--color-text-dim` instead of the orange asterisk; items in `--color-text-soft`; duration `--duration-marquee`; `animation-play-state: paused` on hover. Keep the reduced-motion fallback. (Audit #9)
- **NotesSection**: replace the 3-card grid with a list of rows (NoteRow): category (mono 12px) | title (19px, 500) | status. Unpublished: plain `<li>`/`article`, status `In progress` in `--color-text-dim`. Published: whole row is a link, title underlined with `--color-border-control`, status `Read →`. No numbering. Keep the existing rule that unpublished notes are not links (there is a test for it). (Audit #15)
- **ContactSection**: headline at `--display-section` (not 150px). Accent only on the key phrase via `<em>` styled `font-style: normal; color: var(--color-accent-text)`: `Let's talk about <em>an internship</em>`. Email: show it as a real `mailto:` link PLUS a separate `Copy` button (small ghost button, 44px); on success the button says `Copied`. Labels 12px mono (`Email`, `Phone`, `Elsewhere`, `Availability`). Links underlined with `--color-border-control`. (Audit #4, #9)
- **SiteFooter**: remove the clock; text in `--color-text-dim` (not faint), 12px.

## Step 3: copy (no em dashes, no decorative numbering)

Remove every `—` and `–` from user-visible strings, aria-labels and screen-reader text. Ranges use a plain hyphen, separators a comma or a line break:

- `staticProfile.data.ts`: `UPTC, 2025 - present`; `AI Trainer, LLM evaluation and prompt engineering`; `Apr 2025 - Aug 2026`; `Jun-Aug 2024, Jun-Aug 2026`; "…7+ nationalities, the same English I use today…"; project `context` values use a comma instead of `·`.
- `PenaltyLab.tsx`: `saved, the model called it`, `goal, outside the model`, aria-label `Goal: pick a corner to shoot`.
- `clusterMessages.ts`: `> n2 down: balancer rerouted, 2/3 serving` (same pattern for the other messages).
- `ContactSection.tsx`: `Copy blocked by the browser. Open your mail client instead.`
- Code comments may keep em dashes; this rule is about what users see or hear.

**Tests will break on some of these strings** (e.g. `tests/app.test.tsx` expects `/n2 down — balancer rerouted, 2\/3 serving/` and `/saved|goal —/`). Update those assertions to the new copy; do not weaken what they test.

## Step 4: Paper theme (optional, do last)

`tokens.css` already defines `[data-theme='light']`. The site stays dark by default. If Juan approves, either set it from `prefers-color-scheme: light` or add a small toggle in the nav that sets `data-theme` on `<html>` (persisting in localStorage inside try/catch). Whole page switches, never per section. Update `<meta name="theme-color">` accordingly.

## Acceptance criteria

- `npm run verify` passes (typecheck, lint, tests, build).
- No text below 12px; every readable text colour ≥ 4.5:1 on its surface; every control border and the focus ring ≥ 3:1 (values in tokens are pre-checked, do not introduce new colours).
- Every interactive target ≥ 44×44px (nav links, node buttons, copy button, CTAs).
- Zero `—`/`–` in rendered text (`grep` the built `dist/index.html` + the JS bundle strings you control).
- Hero CTA visible without scrolling at 1440×900 and 390×844; nav on one line at both widths.
- Only animated properties are `transform` and `opacity`; `prefers-reduced-motion` still disables all motion.
- Accent (#ff3d00) appears only on: primary CTA, availability status, project metrics, focus ring, the contact key phrase, Lab stage elements (keeper, cluster lines, cell hover).
- Take before/after screenshots at 1440 and 390 and compare with `../screenshots/`.

## Pending decisions (ask Juan, do not assume)

1. **Hero lead** (≤ 20 words). Proposed: *"Systems Engineering student and AI Trainer. I train models, serve them through an API and put them in front of a user."* The current summary sentence "That last part is the one almost nobody does." would be dropped.
2. **Section order**: move Lab right after Work (Hero, Work, Lab, Experience, Stack, Notes, Contact). Update `SECTIONS` in `src/app/navigation.ts` and the order in `App.tsx` together.
3. **Nav label** "Work" vs "Projects" (section id stays `work` either way).
4. **Paper theme**: ship it or not.
5. **Imagery**: real screenshots of GoalPredict / GoalQuest would strengthen the project rows; needs files from Juan.

Commit in small steps (tokens, then each component, then copy), one commit per step, on a feature branch, not on `main`.
