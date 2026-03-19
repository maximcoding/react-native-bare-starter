---
globs: src/config/**
---

# Rules — config

`src/config/` is the **environment boundary**: everything that varies between dev / staging / prod lives here and nowhere else.

## Files
| File | Purpose |
|------|---------|
| `env.ts` | Reads `react-native-config` vars; exports typed constants (`API_URL`, `ENV`, …) |
| `app-config.ts` | Derived runtime config built from env vars |
| `feature-flags.ts` | Boolean flags; can gate on env or remote config |
| `constants.ts` | **MMKV storage keys and fixed app-wide enumerations only.** Not a dumping ground for shared logic. |

## Must
- `env.ts` is the single point that touches `react-native-config`. All other files import from `env.ts`.
- `feature-flags.ts` must expose plain boolean exports; no UI or hooks inside.
- Storage keys (MMKV) live in `constants.ts` here, not in `src/shared/constants/`.

## Must not
- Do not put theme values, i18n helpers, or component logic in `src/config/`.
- Do not import from `src/features/**` or `src/shared/**` — config must have no upward dependencies.
- Do not hard-code secrets; read them from `env.ts` (which reads from `.env` via `react-native-config`).
