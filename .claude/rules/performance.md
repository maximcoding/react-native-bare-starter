---
globs: src/features/*/screens/**,src/shared/components/**
---

Global rules: [AGENTS.md](../../AGENTS.md). Claude stack summary: [CLAUDE.md](../CLAUDE.md).

# Rules — performance & accessibility

## Lists
- Use **FlashList** (not `FlatList`) for all long or infinite lists. Add item type hints when the list has multiple row layouts; use `overrideItemLayout` to hint item sizes when they are known and uniform.

## Images
- Use **FastImage** (not `Image`) for all remote images.

## Rendering
- Avoid creating inline functions or objects in render — memoize with `useCallback` / `useMemo` where the cost is real.
- Memoize heavy child components with `React.memo` when they receive stable props.
- Schedule heavy tasks (non-UI work after navigation) via `InteractionManager.runAfterInteractions`.

## Accessibility (required on all interactive components)
- Provide `accessibilityRole`, `accessibilityLabel`, and `accessibilityHint` where needed.
- Respect `hitSlop` minimums for touch targets.
- Support Dynamic Type (do not clip text at fixed sizes).
- Maintain correct focus order for screen readers.

## Offline UX
- Always show cached data when available rather than a blank screen.
- Pull-to-refresh must be available on every data-driven screen.

## Must not
- Do not use `FlatList` for long or paginated lists.
- Do not block the JS thread during or immediately after navigation — defer with `InteractionManager`.
