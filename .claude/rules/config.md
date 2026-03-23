---
globs: src/config/**
---

Global rules: [AGENTS.md](../../AGENTS.md). Claude stack summary: [CLAUDE.md](../CLAUDE.md).

# Rules — config

`src/config/` is the **environment boundary**: everything that varies between dev / staging / prod lives here and nowhere else.

## Files
| File | Purpose |
|------|---------|
| `env.ts` | Reads `react-native-config` vars; exports a single typed `env` object (`env.API_URL`, `env.ENV`, `env.SENTRY_DSN`, `env.WS_URL`, …) |
| `app-config.ts` | Static app metadata (`appName`, `version`, `build`) and derived runtime flags (`enableLogs` from `__DEV__`); not wired to `.env` |
| `feature-flags.ts` | Product feature gates as plain boolean exports (`featureFlags.enableOffline`, …); env-independent |
| `constants.ts` | MMKV storage keys, fixed numeric limits (`MAX_UPLOAD_SIZE`, `DEFAULT_PAGE_SIZE`), and dev infrastructure flags (`flags.USE_MOCK` — gated on `__DEV__`). Not a dumping ground for shared logic. |

**Two flag objects — distinct purposes:**
- `featureFlags` (in `feature-flags.ts`) — product feature gates, safe to ship; no `__DEV__` gating required.
- `flags` (in `constants.ts`) — dev-mode infrastructure toggles (e.g. mock transport); always gated on `__DEV__`.

## Must
- `env.ts` is the single point that touches `react-native-config`. All other files import from `env.ts`.
- `feature-flags.ts` must expose plain boolean exports; no UI or hooks inside.
- Storage keys (MMKV) live in `constants.ts` here, not in `src/shared/constants/`.
- When adding a new env var to `env.ts`, also add it to `.env.example` with a placeholder value.

## Must not
- Do not put theme values, i18n helpers, or component logic in `src/config/`.
- Do not import from `src/features/**` or `src/shared/**` — config must have no upward dependencies.
- Do not hard-code secrets; read them from `env.ts` (which reads from `.env` via `react-native-config`).
