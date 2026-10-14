# design-sync notes

- This repo is a SvelteKit site, not a React component library. The sync is tokens-only by the owner's choice (2026-10-13): no components, `window.Portfolio` is empty.
- The bundle is produced off-script, by hand, because the converter needs a built React package entry. Files in `ds-bundle/`: `tokens/tokens.css` (the first `:root`, the first `.theme-dark` and the `--shadow-surface` blocks of `src/app.css`, verbatim; line numbers drift, so find them by block), `tokens/base.css`, `styles.css`, `_ds_bundle.js` (header only), `README.md` (a copy of `.design-sync/conventions.md`), `.ds-build-meta.json` (`componentCount: 0`).
- No `_ds_bundle.css` is shipped: an empty one trips `[CSS_PLACEHOLDER]`.
- No `_ds_sync.json` anchor is uploaded (off-script layout). Every re-sync re-uploads everything; that is five small files.
- Validate with `node .ds-sync/package-validate.mjs ./ds-bundle --no-render-check`. There are no previews to render.

## Re-sync risks

- `tokens/tokens.css` is copied by line numbers. If `src/app.css` changes, re-extract the `:root`, `.theme-dark` and `--shadow-surface` blocks instead of reusing the line ranges.
- The type scale and widths in `conventions.md` are written by hand from the heading, text and image components. They go stale if those components change.
- Fonts load from Google Fonts at runtime; nothing is shipped in `fonts/`.
