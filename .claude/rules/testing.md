---
globs: src/**/*.test.*,src/**/__tests__/**
---

Global rules: [AGENTS.md](../../AGENTS.md). Claude stack summary: [CLAUDE.md](../CLAUDE.md).

# Rules — testing

## Test placement
- Colocate test files next to the source: `Button.test.tsx` beside `Button.tsx`.
- Alternatively place under a sibling `__tests__/` directory (e.g. `__tests__/App.test.tsx`).

## What to test
- **Components:** user-visible behavior (renders, interactions, state changes) — snapshots only for simple, stable UI.
- **Hooks:** state transitions, side effects, error paths.
- **Services:** key shapes, Zod validation, error mapping, offline paths, cache invalidations.
- **Stores:** actions, selectors, logout reset.

## Determinism
- No real network calls — mock the transport layer or service functions.
- No MMKV / filesystem access — mock storage.
- Mock SVG assets with lightweight component stubs (already configured in `jest.setup.js`).
- Use **Zod-validated fixtures** for API payloads to keep mocks honest.

## Must
- Run `npm test` before committing; CI enforces this.
- Prefer behavior assertions over implementation details.
- When testing React Query hooks, wrap with a test `QueryClientProvider`.

## Must not
- No real IO (network, storage, permissions) in unit/integration tests.
- No snapshot tests for complex, logic-heavy components — use behavior tests instead.
