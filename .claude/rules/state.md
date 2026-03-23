---
globs: src/shared/stores/**
---

Global rules: [AGENTS.md](../../AGENTS.md). Claude stack summary: [CLAUDE.md](../CLAUDE.md).

# Rules — state management (Zustand)

Zustand is for **global UI state only**. Server state belongs in React Query.

## What belongs in Zustand
Flags, enums, selected IDs, tiny derived booleans (e.g. `isOnboarded`, `activeTheme`, `activeLocale`).

## What does not belong in Zustand
Server collections, entities, or any data that comes from the API — React Query is the source of truth for those.

## Must
- Store files live in `src/shared/stores/` (e.g. `app.store.ts`). Split into focused slices when complexity grows; do not build one monolithic store.
- Actions must be **atomic and side-effect-free** inside the store definition. Side effects (API calls, navigation, toasts) belong in hooks or services that call the store action.
- Use **narrow selectors** — subscribe to specific fields, not the whole slice.
- Persist only safe, small bits (theme preference, locale) via `zustand-mmkv-storage.ts`. Keys must come from `src/config/constants.ts`.
- **Logout:** reset all slices and clear sensitive storage.

## Must not
- No secrets, tokens, or credentials in Zustand — use Keychain/Keystore.
- No server data or user profile in stores — use React Query.
- No side effects inside `set(...)` calls or action definitions.
