Global rules: [AGENTS.md](../../AGENTS.md). Claude stack summary: [CLAUDE.md](../CLAUDE.md).

# Rules — security

## Storage
- Tokens and credentials: **Keychain (iOS) / Keystore (Android)** only.
- App preferences and safe small bits: **MMKV** (`kvStorage`).
- Never store secrets in Zustand persisted state, AsyncStorage, or plain files.

## Config & secrets
- All env-backed values come from `react-native-config` via `src/config/env.ts` — never hardcode secrets or API keys in source code.
- Never commit `.env`; `.env.example` must have placeholder values only.

## HTTP
- Never use bare `fetch` — always go through the project transport layer (`src/shared/services/api/transport/transport.ts`), which enforces auth interceptors, error normalisation, and offline handling.

## Logging & analytics
- Do not log sensitive data (tokens, PII, `Authorization` headers) — sanitize before any log or analytics call.
- Sentry: `captureBoundaryError` / `captureException` must go through `src/shared/services/monitoring/sentry.ts` helpers; avoid attaching user PII to error contexts.

## Dependencies
- All new third-party dependencies require an agreed review process before adding — do not `npm install` without discussion.

## Must not
- No secrets or tokens in Zustand, Redux, or any JS-accessible plain-object store.
- No direct Sentry SDK calls in feature code — use the monitoring helpers.
- No `fetch` — transport layer only.
