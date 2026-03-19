# Agent context — React Native Starter

Primary project context for AI agents: follow this file first when editing or adding code.

## Project

React Native 0.82 app, TypeScript strict, bare workflow. **`src/shared/`** holds all cross-app code (navigation, UI, hooks, services, theme, i18n, session, config, types); **`src/features/<name>/`** holds feature slices.

## Build and run

- Start Metro: `npm run start`
- iOS: `npm run ios`
- Android: `npm run android`
- First-time iOS: after `npm install`, run `npm run pod-install` (or `npx pod-install ios`)

## Quality and guards

- **Lint/format:** `npm run lint` (Biome); `npm run format` to apply fixes
- **Type-check:** `npx tsc --noEmit`
- **Tests:** `npm test`
- **Guards:** `npm run check:icons`, `npm run check:imports`

When changing SVGs, run `npm run gen:icons`. When changing i18n keys, run `npm run i18n:all`.

## Where code lives

- **src/navigation/** — App-level wiring: stacks, tabs, routes, modals, helpers (`AppLayout`, `root-navigator`, etc.). Top-level because it imports from features (screens, param-lists) — it is not "shared" in the pure sense.
- **src/session/** — Bootstrap, logout, session-bridge. Top-level because it carries side effects (storage, query client, nav reset) and auth logic — app infrastructure, not a utility.
- **src/config/** — App-level env, constants, feature flags.
- **src/i18n/** — useT, locales, extraction.
- **src/shared/components/ui/** — Reusable UI primitives (Button, Text, ScreenWrapper, …). If a component needs sharing, it either belongs here (truly generic) or stays in the feature that owns it — there is no intermediate category.
- **src/shared/hooks/** — Shared hooks.
- **src/shared/services/api/** — HTTP, transport, query client, network, offline.
- **src/shared/services/storage/** — MMKV, cache, Zustand persistence adapter.
- **src/shared/utils/platform/** — device-info, haptics, permissions.
- **src/shared/utils/** — Other shared utilities (normalize-error, toast).
- **src/shared/stores/** — Zustand global UI state only (e.g. last tab, onboarding flag). No domain data; no auth tokens; no user profile — those belong in a feature or `src/session/`.
- **src/shared/theme/** — Tokens, ThemeProvider, useTheme.
- **src/shared/types/** — Global types (e.g. SVG).
- **src/features/<feature>/** — Screens, components, hooks, domain `services/`, `api/keys.ts`, `navigation/param-list.ts`.

Inside a feature use: `screens/`, `components/`, `hooks/`, `services/`, `api/keys.ts`, `navigation/param-list.ts`, and optionally `models/`. Do **not** add type-based folders at **`src/` root** for app-only code. Reusable cross-feature UI: `src/shared/components/ui/`.

Use path alias `@/` only (e.g. `@/navigation/`, `@/session/`, `@/config/`, `@/i18n/`, `@/shared/...`, `@/features/...`). No deep relative imports.

## State & storage

- **MMKV:** `kvStorage` in `src/shared/services/storage/mmkv.ts`; keys in `src/config/constants.ts`.
- **TanStack Query:** feature `api/keys.ts`, e.g. `src/features/user/hooks/useMeQuery.ts`.
- **Zustand:** `src/shared/stores/app.store.ts`; persisted via `src/shared/services/storage/zustand-mmkv-storage.ts`. No server data in stores.

## Conventions

- **Theme:** tokens only (no raw colors/spacing/fonts in UI).
- **Styles:** `StyleSheet.create()` with theme tokens; avoid inline styles except for dynamic values.
- **Server state:** React Query; keys in feature `api/keys.ts`; mutations with `meta.tags` and targeted invalidation.
- **Global UI state:** Zustand only; no server data in stores.
- **Validation:** Zod for API and domain models.
- **Navigation:** routes in `src/navigation/routes.ts`. ParamLists per feature under `features/<name>/navigation/param-list.ts`; root shell in `src/navigation/root-param-list.ts`.
- **i18n:** `useT` / namespace; no hardcoded copy in UI.
- **File naming:** PascalCase for components/screens; camelCase or kebab for utils/services.

## Don'ts

- Do not add new dependencies without an agreed process.
- No Tailwind, NativeWind, or Styled Components.
- No `fetch`; use project HTTP/transport layer only.
- No raw colors or spacing in UI; use theme tokens.
- No server data in Zustand; no feature logic in `src/shared/components/ui/` or `src/shared/stores/`.
- No deep relative imports; path aliases only (`check:imports`).
- When adding/changing SVGs: run `npm run gen:icons` and keep `check:icons` passing.

## When adding

- **New screen:** `src/features/<feature>/screens/`, register in `src/navigation/routes.ts`, extend that feature’s `navigation/param-list.ts`.
- **New API/query:** feature `services/` + `api/keys.ts`; use transport from `src/shared/services/api/`; validate with Zod.
- **New shared UI:** `src/shared/components/ui/`; feature-specific UI in the feature’s `components/`.

## More context

Full docs: README.md. Detailed patterns: .claude/CLAUDE.md.
