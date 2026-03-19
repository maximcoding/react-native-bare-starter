---
globs: src/features/**
---

# Rules — features

Each feature (`auth`, `home`, `settings`, `user`, …) is a self-contained vertical slice.

## Structure inside a feature
```
src/features/<name>/
  screens/              # Screen components (route leaf nodes)
  components/           # Feature-private UI
  hooks/                # Feature-private React hooks (useLoginMutation, useMeQuery, …)
  services/             # API schemas (Zod) + mappers + service functions
  api/
    keys.ts             # React Query key factory
  navigation/
    param-list.ts       # TypeScript ParamList for this feature's screens
```

## Must
- Screens must use `ScreenWrapper` as the root element.
- Services must validate every API response with a Zod schema and map it to a domain model before returning.
- Query keys must be defined in `api/keys.ts` using the format `[feature, entity, id?, params?]`.
- Mutations must include `meta.tags` for targeted React Query invalidation.
- Route constants must be added to `src/shared/navigation/routes.ts`; ParamList entries to this feature's `navigation/param-list.ts`.

## Must not
- **Features must never import from other features** (`src/features/auth` must not import `src/features/user`). Cross-feature data flows through shared services or React Query.
- Screens must not call `src/shared/services/api/**` directly — all HTTP goes through feature service functions.
- No hardcoded user-facing strings. Use `useT('<feature>')` with a per-feature namespace.
- No raw colors, spacing, or font sizes. Use `useTheme()`.
