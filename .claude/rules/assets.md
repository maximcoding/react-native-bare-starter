---
globs: assets/**
---

Global rules: [AGENTS.md](../../AGENTS.md). Claude stack summary: [CLAUDE.md](../CLAUDE.md).

# Rules — assets

Static assets: fonts, SVGs, and the auto-generated icon registry.

## Must
- **Fonts:** place under `assets/fonts/`; reference only via theme typography tokens — never raw font name strings in UI.
- **SVGs:** place under `assets/svgs/`; import only via `@assets/svgs/<name>.svg`.
- **After any SVG add/change:** run `npm run gen:icons` to regenerate `assets/icons.ts`, then verify with `npm run check:icons`.
- **SVG filenames:** single-word, lowercase (e.g. `home.svg`, `settings.svg`). The generator capitalises only the first letter — hyphens and underscores are kept as-is and produce invalid JS identifiers (`Arrow-right`).

## Must not
- Never edit `assets/icons.ts` by hand — it is always overwritten by `scripts/generate-icons.js`.
- Never import SVG files by relative path — use `@assets/svgs/...` only.
- Never reference font names as raw strings in `StyleSheet.create()` — use theme tokens.

## CI guard
`npm run check:icons` (`scripts/check-icons-stale.js`) exits non-zero if `assets/icons.ts` is out of sync with `assets/svgs/`. This runs in CI and in the husky pre-commit hook.
