# Contributing to React Native Starter

Thanks for your interest in contributing. This document explains how to get your changes merged.

## Before you start

- Read the [README](README.md) for project overview and setup.
- For code layout, conventions, and where things live, see [AGENTS.md](AGENTS.md) (written for AI agents but useful for humans too).

## Development setup

1. Clone the repo and install dependencies: `npm install`, then `npx pod-install ios` for iOS.
2. Copy `.env.example` to `.env` and adjust if needed.
3. Run the app: `npm start`, then `npm run ios` or `npm run android`.

## Quality checks (required before submitting)

Run these locally; CI will run them as well:

- **Biome:** `npm run lint` runs `biome check .` (no writes). `npm run format` applies fixes (`biome check . --write`). There is no ESLint/Prettier in this repo.
- **Type-check:** `npx tsc --noEmit`
- **Tests:** `npm test`
- **Guards (if you touched relevant files):**
  - After changing SVGs: `npm run gen:icons` and ensure `npm run check:icons` passes.
  - After changing i18n keys: `npm run i18n:all`.
  - `npm run check:imports` must pass (path aliases only, no deep relative imports).

## Branch naming

Use a short, descriptive branch name, e.g. `fix/auth-redirect`, `feat/settings-theme-toggle`, `docs/readme-quick-start`.

## Pull requests

- Keep PRs focused: one feature or fix per PR when possible.
- Ensure all quality checks above pass.
- If your change is user-facing or notable, add an entry to [CHANGELOG.md](CHANGELOG.md) under `## Unreleased`.
- Do not include unrelated refactors or formatting-only changes in the same PR.

## Reporting issues

Use the [bug report](.github/ISSUE_TEMPLATE/bug_report.md) or [feature request](.github/ISSUE_TEMPLATE/feature_request.md) templates when opening an issue. Include environment details (React Native version, Node version, OS) for bugs.

For **security** concerns, do not file a public issue. Use **GitHub → Security → Report a vulnerability** if enabled for this repository, or contact the maintainers privately.
