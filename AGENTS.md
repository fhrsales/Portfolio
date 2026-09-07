# Repository Guidelines

## Project Structure & Module Organization

- `src/` – SvelteKit app code. Key areas: `routes/` (pages like `+page.svelte`, server files, admin UI), `lib/components/` (PascalCase Svelte components), `lib/*.js` (stores and utilities).
- `static/` – versioned public assets. `src/lib/archiePages.json` is the only content source.
- `build/` – generated output (do not edit manually).
- Config: `svelte.config.js`, `vite.config.js`, `eslint.config.js`, `.prettierrc`.

## Build, Test, and Development Commands

- `npm run dev` – start local dev server (Vite + SvelteKit).
- `npm run build` – builds the tracked sources without rewriting content, components, or assets.
- `npm run preview` – serve the production build (opens `http://localhost:4173/Portfolio/`).
- `npm run lint` – Prettier check + ESLint.
- `npm run format` – format code with Prettier.
- `npm run test:unit` – run Vitest projects (browser + node) per `vite.config.js`.

## Coding Style & Naming Conventions

- Prettier: tabs, single quotes, no trailing commas, `printWidth: 100`.
- Svelte: components in PascalCase under `src/lib/components/`; routes follow SvelteKit (`+layout.svelte`, `+page.{svelte,js}`).
- JS/TS: camelCase for variables/functions; kebab-case for files except Svelte components.
- Keep modules small; colocate tests next to source when practical.

## Testing Guidelines

- Framework: Vitest (configured for browser and node). Example: `src/routes/page.svelte.test.js`.
- File patterns: client `src/**/*.svelte.{test,spec}.{js,ts}`; server `src/**/*.{test,spec}.{js,ts}` excluding Svelte tests.
- Prefer unit tests for components and stores; mock network and file IO.

## Commit & Pull Request Guidelines

- Commits: imperative mood, concise subject, optional scope (e.g., `components: add VideoBlock lazy-load`).
- PRs: include summary, rationale, screenshots/GIFs for UI, steps to verify, and linked issues.
- Before opening: run `npm run format`, `npm run lint`, and `npm run test:unit`.

## Security & Configuration Tips

- Edit `src/lib/archiePages.json` directly, including Archive. Commit media and image metadata; never generate them during build/deploy.
- Production uses `adapter-static` with `base` set when `NODE_ENV=production`; verify links under `/Portfolio` in preview.
- Do not edit `build/` or `.svelte-kit/` by hand; never commit secrets.
