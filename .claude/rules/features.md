---
globs: src/features/**
---

Global rules: [AGENTS.md](../../AGENTS.md). Claude stack summary: [CLAUDE.md](../CLAUDE.md).

# Rules — features

Each feature (`auth`, `home`, `settings`, `user`, …) is a self-contained vertical slice.

## Structure inside a feature

**Always present** (when applicable):
```
src/features/<name>/
  screens/              # Screen components (route leaf nodes) — omit for headless features
  types/
    index.ts            # Barrel — import from @/features/<name>/types
  navigation/
    param-list.ts       # TypeScript ParamList — omit for headless features (no screens)
```

**Add when needed**:
```
  components/           # Feature-private UI
  hooks/                # Feature-private React hooks (useLoginMutation, useMeQuery, …)
  constants/            # Feature-scoped constants (e.g. oauth-brand-colors.ts); or constants.ts at feature root
  services/
    <name>/             # One subdir per service domain:
      <name>.schemas.ts # Zod schemas for API responses
      <name>.mappers.ts # response → domain model transformations
      <name>.service.ts # exported async service functions
  api/
    keys.ts             # React Query key factory — add when feature fetches or mutates server data
```

**Headless features** (hooks + services, no screens — e.g. `user`): omit `screens/` and `navigation/`.

## Must
- Screens must use `ScreenWrapper` as the root element.
- Services must validate every API response with a Zod schema and map it to a domain model before returning.
- Query keys must be defined in `api/keys.ts` using the format `[feature, entity, id?, params?]` — for features that fetch or mutate server data.
- Mutations must include `meta.tags` for targeted React Query invalidation.
- Features with screens: route constants must be added to `src/navigation/routes.ts`; ParamList entries to this feature's `navigation/param-list.ts`.
- i18n: add translations under the feature-named section in `src/i18n/locales/en.json` (and `de.json`, `ru.json`). The section name matches the feature directory name, lowercase. Use `t('auth.key')` — not `useT('auth')`. Run `npm run i18n:all` after.

## Must not
- **Features must never import from other features** (`src/features/auth` must not import `src/features/user`). Cross-feature data flows through shared services or React Query.
- Screens must not call `src/shared/services/api/**` directly — all HTTP goes through feature service functions.
- No hardcoded user-facing strings. Use `t('feature.key')` via `useT()`.
- No raw colors, spacing, or font sizes. Use `useTheme()`.
- Screen-only components that are not reused may live next to the screen file; move to `components/` only when shared within the feature, and to `src/shared/components/ui/` only when shared across features.
