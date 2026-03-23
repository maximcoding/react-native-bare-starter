**Not architecture SSOT.** Product backlog, publishing checklist, and “what’s left for open source.” For structure and rules see [AGENTS.md](../AGENTS.md), [README.md](../README.md), and [production-guidelines.md](production-guidelines.md).

---

## Shipped in this template

These are **already in the repo** (no action required to “add” them):

- [x] Zustand global UI store — `src/shared/stores/`
- [x] Sentry — `@sentry/react-native`, `src/shared/services/monitoring/sentry.ts`, `ErrorBoundary` → `captureBoundaryError`; [OPERATIONS.md § Sentry](OPERATIONS.md#sentry)
- [x] OTA policy — env placeholders only; no default vendor SDK; [OPERATIONS.md § Over-the-air updates](OPERATIONS.md#over-the-air-updates)
- [x] CI on push/PR — Biome, `tsc`, Jest, `check:icons`, `check:imports` — `.github/workflows/ci.yml`
- [x] Manual Android / iOS workflows — Node 20, `npm ci`; [OPERATIONS.md § GitHub Actions](OPERATIONS.md#github-actions)
- [x] Maestro smoke starters — `maestro/smoke-*.yaml`; [OPERATIONS.md § Maestro](OPERATIONS.md#maestro)
- [x] Community files — [LICENSE](../LICENSE), [CONTRIBUTING.md](../CONTRIBUTING.md), [CHANGELOG.md](../CHANGELOG.md), [.github/ISSUE_TEMPLATE/](../.github/ISSUE_TEMPLATE/), [.github/PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md), [.github/CODE_OF_CONDUCT.md](../.github/CODE_OF_CONDUCT.md)
- [x] Single root README + doc matrix in [AGENTS.md](../AGENTS.md) (`#documentation-map`)

---

## Before / when you go public (maintainer)

**Copy-paste text and templates:** [OPERATIONS.md § Publishing & discoverability](OPERATIONS.md#publishing--discoverability).

These steps happen **outside** git (GitHub UI, design assets, community). Leave them unchecked until you actually do them:

- [ ] Set repository visibility to **Public** (GitHub → Settings → Danger zone).
- [ ] Set **description** and **topics** on the repo (suggested strings in [OPERATIONS.md § GitHub repository settings](OPERATIONS.md#github-repository-settings)).
- [ ] Add or refresh **README / marketing visuals** — screenshots or short GIF (guidance: [OPERATIONS.md § Screenshots](OPERATIONS.md#screenshots)); use stable paths (e.g. under `docs/images/`) if you commit images.
- [ ] Publish a **GitHub Release** for your first tag (process: [OPERATIONS.md § GitHub Releases](OPERATIONS.md#github-releases)).
- [ ] Submit a PR to **[awesome-react-native](https://github.com/jondot/awesome-react-native)** (Starter Kits / Templates) using the one-liner template in OPERATIONS.
- [ ] Post a **short launch** note (e.g. r/reactnative, React Native Discord, X) — bullet template in OPERATIONS.
- [ ] **Optional:** enable **GitHub Pages** or a small landing page — [OPERATIONS.md § Optional: GitHub Pages](OPERATIONS.md#optional-github-pages).

---

## After launch (ongoing)

Habits that help the repo stay trustworthy and discoverable (not one-and-done checkboxes):

- [ ] **Triage** issues and PRs within a few days early on.
- [ ] Keep **`main` CI green** (same checks as `.github/workflows/ci.yml`).
- [ ] Label **`good first issue`** where appropriate; pin a short roadmap or welcome issue if useful.
- [ ] **Tag releases** and paste CHANGELOG excerpts into GitHub Releases when you ship meaningful changes.
