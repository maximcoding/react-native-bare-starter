---
globs: src/navigation/**
---

Global rules: [AGENTS.md](../../AGENTS.md). Claude stack summary: [CLAUDE.md](../CLAUDE.md).

# Rules — navigation

## Structure
- **Root stack** (`src/navigation/root/root-navigator.tsx`): `ROOT_ONBOARDING`, `ROOT_AUTH`, `ROOT_APP`.
- **Bootstrap:** `src/session/useBootstrapRoute.ts` determines the initial route.
- **Routes:** all constants in `src/navigation/routes.ts` — never inline route strings.
- **ParamLists:** per-feature at `src/features/<name>/navigation/param-list.ts`; root shell at `src/navigation/root-param-list.ts`.
- **`NavigationContainer`** lives inside `src/navigation/NavigationRoot.tsx` — do not add a second one.

## Provider order (must match `App.tsx`)
```
i18n side-effect import  ← module-level, above the component
GestureHandlerRootView
  SafeAreaProvider
    ThemeProvider
      ErrorBoundary
        QueryProvider
          OfflineBanner
          NavigationRoot
```

## Half-sheet modals
Use `presentation: 'transparentModal'`, `animation: 'none'`, `gestureEnabled: false` (see `HALF_SHEET_OPTIONS` in `root-navigator.tsx`).

## Must
- All route constants from `src/navigation/routes.ts` — never use inline string literals for routes.
- New screens: register in `routes.ts` and add the ParamList entry to the feature's `navigation/param-list.ts`.
- Use `navigationRef` from `src/navigation/helpers/navigation-helpers.ts` for imperative navigation outside React tree.

## Must not
- Do not nest a second `NavigationContainer`.
- Do not navigate from `src/shared/**` directly — navigate only via helpers or callbacks passed in as props.
- Do not add navigation logic inside `src/shared/components/ui/` components.
