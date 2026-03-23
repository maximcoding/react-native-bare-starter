---
globs: src/shared/services/**
---

Global rules: [AGENTS.md](../../AGENTS.md). Claude stack summary: [CLAUDE.md](../CLAUDE.md).

# Rules — shared/services

Infrastructure-level data layer. Split into two sub-trees:

```
shared/services/
  api/
    http/          # axios instance + interceptors (auth, error, logging, refresh)
    transport/     # pluggable adapters: rest (apisauce), graphql, websocket, firebase
    query/         # TanStack Query client, MMKV persister, policy (retry/freshness), key factory
    network/       # netinfo wrapper
    offline/       # offline-queue.ts, sync-engine.ts
  storage/
    mmkv.ts        # kvStorage singleton
    cache-engine.ts
    zustand-mmkv-storage.ts
```

## Must
- All HTTP calls must go through `http/http.client.ts` (exported `httpClient`) / `http/api.ts` helpers or a `transport/` adapter — never bare `fetch`.
- Every adapter must pass responses through `normalize-error.ts` for consistent error shapes.
- React Query client configuration (staleTime, retry, persistence) must live in `query/policy/` and `query/client/` — not scattered across feature hooks.
- MMKV key strings must be imported from `src/config/constants.ts`.

## Must not
- Do not import from `src/features/**` — this layer is feature-agnostic.
- Do not put business logic or domain models here. Domain logic belongs in `src/features/<name>/services/`; domain **interfaces and type aliases** belong in `src/features/<name>/types/`.
- Do not use Zustand stores inside this layer — pass data up via return values or callbacks.
