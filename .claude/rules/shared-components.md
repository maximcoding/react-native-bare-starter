---
globs: src/shared/components/**
---

Global rules: [AGENTS.md](../../AGENTS.md). Claude stack summary: [CLAUDE.md](../CLAUDE.md).

# Rules — shared/components

Components here are **stateless, themed primitives**. They form the UI kit used across all features.

## Must
- Accept only display-level props (text, callbacks, style overrides). No data-fetching, no React Query hooks, no Zustand selectors inside these files.
- Use `useTheme()` for every color, spacing, radius, and typography value. No raw hex or numeric literals in `StyleSheet.create()`.
- Use `StyleSheet.create()`. Inline styles only for values that are dynamically computed at render time.
- Place feature-agnostic primitives (Button, Text, ScreenWrapper, OfflineBanner, …) in `ui/`. There is no `features/` sub-dir here — a domain-shaped component either belongs in `ui/` (if truly generic) or in the feature that owns it. If two features share it, promote to `ui/` or keep it in the feature closest to the data and accept the dependency direction.

## Must not
- Import from `src/features/**`, `src/navigation/**`, or `src/session/**` — `src/shared/` must be the lowest layer with no upward dependencies.
- Import from `src/shared/services/**`, `src/shared/stores/**`, or `src/i18n/**` — keep these components pure UI.
- Hardcode any user-facing copy. Accept strings as props; callers use `useT()`.
