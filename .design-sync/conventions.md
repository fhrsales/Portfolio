# Fabio Sales Portfolio: how to build with it

This system ships tokens only. The site is built in Svelte, so `window.Portfolio` is empty and there are no components to import. Build every layout with plain elements styled by the CSS variables below. Do not invent class names from the site, and do not import a UI library.

## Setup

- Load `styles.css`. It brings the two fonts from Google Fonts, the variables (`tokens/tokens.css`) and the body ground (`tokens/base.css`). Read `tokens/tokens.css` before styling: it is the whole vocabulary.
- Light is the default. For dark, put the class `theme-dark` on `<html>`; every colour variable flips. There is no provider and no script.
- `--color-dark` is the ink and `--color-light` is the paper. They swap in the dark theme, so never read the names literally and never hard-code `#fff` or `#121214`.

## Colour

| Variable | Use |
|---|---|
| `--color-dark` | all text, headings, the 2px section rule, icon strokes |
| `--color-light` | page background |
| `--color-primary` | the only accent: uppercase labels, the underline of the current menu item, link underlines, dates in a timeline. Small things only, never a section fill |
| `--color-on-primary` | text on a `--color-primary` fill |
| `--color-rule` | 1px hairlines between list rows; too faint to carry meaning |
| `--color-tertiary` | a raised surface in the dark theme |
| `--color-danger`, `--color-success` | editor tooling only, not public pages |

Secondary text is the ink at reduced strength, `color-mix(in srgb, var(--color-dark) 70%, transparent)`, not a separate grey.

## Type

Two families: `var(--font-display)` (Newsreader) for headings, `var(--font-primary)` (Fira Sans) for everything else. Sizes are multiples of `--grid` (9px):

| Role | Family | Size | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| Page title | display | `calc(var(--grid) * 4.2)` | 500 | 1.08 | -0.015em |
| Section title | display | `calc(var(--grid) * 3.4)` | 500 | 1.12 | -0.015em |
| Subsection | display | `calc(var(--grid) * 2.8)` | 500 | 1.15 | -0.015em |
| Home opening paragraph | primary | `calc(var(--grid) * 3.3)` | 300 | 1.5 | -0.02em |
| Body | primary | `calc(var(--grid) * 2)` | 400 | 1.55 | -0.01em |
| Menu link | primary | `calc(var(--grid) * 1.7)` | 500 | | |
| Caption | primary | `calc(var(--grid) * 1.6)` | 400 | 1.45 | |
| Label above a heading | primary | `calc(var(--grid) * 1.5)` | 600 | 1.3 | 0.06em, uppercase, `--color-primary` |

Sentence case everywhere. Uppercase only in that label.

## Layout

- One reading column: `max-width: var(--w-text)` (580px), `width: calc(100% - var(--grid) * 4)`, centred. Figures may open wider, up to `var(--w-page)`; widths in use are 250, 450, 640 and 875px.
- Space in multiples of `--grid`: 2 between paragraphs, 8 around a block, 11 above and 5 below a section rule.
- Sections are separated by a `2px solid var(--color-dark)` rule across the text column, not by cards or background bands.
- One breakpoint at 600px, where titles step down about one grid unit.

## Surfaces

Flat. No cards, no rounded panels, no gradients. `var(--shadow-surface)` means a printed page or a screen capture lying on the page, and is used on images only. Screen captures get `border-radius: 12px`; newspaper pages get an 8px white margin. `var(--shadow-2)` is for small pill buttons.

## Links

A link inside text is ink at weight 600 and turns `--color-primary` on hover with a 2px underline. A follow-on link under a paragraph is weight 500 with a permanent 2px `--color-primary` underline and a trailing arrow.

## Movement

- Movement explains a change of state or leads the eye; it never decorates. One idea of movement per screen.
- Never hijack the scroll. Anything pinned shows how much is left (a "2 / 3" count or a progress bar) and lets go at the end.
- Animate `transform` and `opacity` only. Durations: 180ms hover and colour, 360ms change of state, 600ms entrance. Easing `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- With `prefers-reduced-motion: reduce`, show the final state with no transition.
- A pinned stage on a phone is `100svh` tall, not `100vh`.
- Patterns the site uses, to rebuild with plain elements: a figure that settles 28px upward while fading in; a 2px rule drawn from the left; a pinned screen that changes as each text step crosses the middle of the viewport; a pinned page that zooms to the detail each note talks about; two pictures with a draggable divider (a real `<input type="range">` over the image); figures that count up once when they come into view.

## Example

```html
<main style="max-width:var(--w-text);width:calc(100% - var(--grid) * 4);margin:0 auto;color:var(--color-dark);font-family:var(--font-primary)">
  <p style="font-size:calc(var(--grid) * 1.5);font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--color-primary);margin-bottom:calc(var(--grid) * .8)">Case study</p>
  <h1 style="font-family:var(--font-display);font-weight:500;font-size:calc(var(--grid) * 4.2);line-height:1.08;letter-spacing:-.015em;margin-bottom:calc(var(--grid) * 2)">A product that runs a company</h1>
  <p style="font-size:calc(var(--grid) * 2);line-height:1.55;letter-spacing:-.01em;margin-bottom:calc(var(--grid) * 2)">I design complex products and build them.</p>
  <hr style="border:0;border-top:2px solid var(--color-dark);margin:calc(var(--grid) * 11) 0 calc(var(--grid) * 5)">
  <h2 style="font-family:var(--font-display);font-weight:500;font-size:calc(var(--grid) * 3.4);line-height:1.12;letter-spacing:-.015em">Selected career chapters</h2>
</main>
```

## Voice

First person, short plain sentences, concrete nouns. No emoji, no exclamation marks in body copy. English is the source language; Portuguese is a line-by-line translation.
