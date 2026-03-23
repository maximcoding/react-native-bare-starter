# Offline behavior

This starter wires **network state**, the shared **transport**, a **mutation queue + replay**, and **TanStack Query persistence** (MMKV). Together they provide practical offline behavior; they are not a full offline-first product by default.

## How it fits together

1. **NetInfo** ([`src/shared/services/api/network/netinfo.ts`](../src/shared/services/api/network/netinfo.ts)) — If `@react-native-community/netinfo` is installed, the app subscribes to connectivity and sets transport offline mode via `setOfflineMode()`. When the device goes from offline → online, [`syncEngine.onConnected()`](../src/shared/services/api/offline/sync-engine.ts) runs to replay queued mutations.

2. **Transport** ([`src/shared/services/api/transport/transport.ts`](../src/shared/services/api/transport/transport.ts)) — While offline:
   - **Queries** throw an error with code `NETWORK_OFFLINE` (no live fetch through the adapter).
   - **Mutations and uploads** are pushed to the offline queue and resolve with a queued result instead of calling the adapter.
   - **Subscriptions** silently return a no-op unsubscribe — not queued, no error thrown.

3. **Offline queue** ([`src/shared/services/api/offline/offline-queue.ts`](../src/shared/services/api/offline/offline-queue.ts)) — FIFO, **in-memory only**. Queued work is **lost if the process is killed** while offline. For production durability, replace or back this with MMKV/SQLite (see comments in that file).

4. **Sync engine** ([`src/shared/services/api/offline/sync-engine.ts`](../src/shared/services/api/offline/sync-engine.ts)) — Replays queued mutations via the transport when back online, removes successful items, and can invalidate React Query caches using **tags** on queued items. Replay **stops on the first failure** to avoid cascading errors.

5. **React Query + MMKV** ([`src/shared/services/api/query/client/provider.tsx`](../src/shared/services/api/query/client/provider.tsx), [`mmkv-persister`](../src/shared/services/api/query/persistence/mmkv-persister.ts), [`persistence/limits`](../src/shared/services/api/query/persistence/limits.ts)) — Previously fetched query data can be **dehydrated to MMKV** under a policy (sensitive queries excluded, freshness/TTL rules). That is the main way **reads** still have data offline or after a cold start—**not** the snapshot `cache-engine` below.

6. **cache-engine** ([`src/shared/services/storage/cache-engine.ts`](../src/shared/services/storage/cache-engine.ts)) — Optional **in-memory** key/value snapshots for services; **not persisted**. Logout clears it alongside the offline queue.

## Query client behavior

[`createQueryClient`](../src/shared/services/api/query/client/query-client.ts) suppresses retries and error toasts for both query and mutation errors when the normalized error code is `NETWORK_OFFLINE`, and enables `refetchOnReconnect`.

## Optional module

If NetInfo is **not** installed, `initNetInfoBridge()` is a no-op; you can still test offline using the dev helper `__setOfflineForDev` in `netinfo.ts` (development only).
