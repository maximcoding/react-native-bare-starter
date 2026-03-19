# React Native Mobile Starter

![React Native](https://img.shields.io/badge/React%20Native-0.82.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen?logo=node.js)

Production-ready React Native starter (bare workflow) with TypeScript, feature-first architecture, theming, i18n, and offline support. A TypeScript boilerplate for teams that want a bare React Native app with typed navigation, theme tokens, and pluggable transport (REST / GraphQL / WebSocket / Firebase).

### Quick start

```bash
git clone https://github.com/maximcoding/react-native-starter.git
cd react-native-starter
npm install && npx pod-install ios
npm start
# In another terminal: npm run ios  or  npm run android
```

Full setup (prerequisites, env, scripts): see [Getting Started](#getting-started).

---

## Table of Contents

- [Why this starter?](#why-this-starter)
- [Screenshots](#screenshots)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Key Commands](#key-commands)
- [Documentation](#documentation)
- [Changelog](#changelog)
- [Hooks](#hooks)
- [Architecture Overview](#architecture-overview)
- [Feature Development](#feature-development)
- [SVG Icons](#svg-icons)
- [i18n Workflow](#i18n-workflow)
- [Permissions](#permissions)
- [CI/CD & Release](#cicd--release)
- [Roadmap & backlog](docs/TODO.md)

---

## Why this starter?

This repo is a **react native bare workflow starter** and **TypeScript boilerplate** for production apps. You get full control over native code and dependencies. It focuses on:

- **Bare only** — React Native CLI and native tooling directly.
- **Offline-first** — MMKV storage, React Query persistence, offline mutation queue and sync engine.
- **Typed navigation** — Centralized routes and ParamLists; type-safe screen params.
- **Theme tokens** — Light/dark theming via semantic tokens; no raw colors or spacing in UI.
- **No Tailwind/NativeWind** — Styles are `StyleSheet.create()` with theme tokens only.

If you need a managed workflow or a different stack, this starter is not for you. If you want a bare React Native app with a clear feature-first layout and shared conventions, start here.

---

### Screenshots

<!-- Add app screenshots or a short GIF here, e.g. light/dark theme or main screens. Store images in docs/images/ and reference with relative path: ![App screenshot](docs/images/screenshot.png) -->

---

## Features

| Category | Library | Version | Description |
|---|---|---|---|
| **Framework** | react-native | 0.82.1 | Bare workflow, TypeScript, Hermes engine |
| **Theme** | — | — | Light & Dark via `ThemeProvider`; semantic tokens; `useTheme()` |
| **Navigation** | @react-navigation | ^7.x | Native stacks, Bottom Tabs, Modals; |
| **i18n** | i18next + react-i18next | ^25.x / ^16.x | Per-feature namespaces, type-safe `useT()` |
| **Validation** | zod | ^4.1.13 | Schema validation on every API response; typed domain mappers |
| **HTTP** | apisauce | ^2.1.3 | Centralized instance with auth, error, and logging interceptors |
| **Transport** | — | — | Pluggable adapters: REST (Axios), GraphQL, WebSocket, Firebase |
| **Server State** | @tanstack/react-query | ^5.90.12 | Query/mutation management with persistence and tag-based invalidation |
| **Offline** | — | — | Cache engine, offline mutation queue, sync engine, NetInfo wrapper |
| **Storage** | react-native-mmkv | ^4.1.0 | Fast, synchronous, encrypted key-value store |
| **Lists** | @shopify/flash-list | ^2.2.0 | High-performance virtualized lists |
| **SVG** | react-native-svg | ^15.15.1 | SVG rendering; icons auto-generated via `npm run gen:icons` |
| **Splash Screen** | react-native-bootsplash | ^6.3.11 | `npm run bootsplash:generate` |
| **Native Utils** | — | — | Device info, haptics, runtime permissions |
| **Biome** | @biomejs/biome | ^2.4.8 | Single tool: format, lint rules, import organization (`biome check`) |
| **CI/CD** | GitHub Actions | — | Android / iOS build workflows; run **Biome** and tests locally before push |

---

## Project Structure

```
src/
├── navigation/                 # App wiring: stacks, tabs, routes, modals, helpers
├── session/                    # Bootstrap, logout, session-bridge
├── config/                     # App-level: env, constants, feature-flags
├── i18n/                       # useT, locales, extraction
├── shared/                     # Cross-app code (must NOT import from features)
│   ├── components/ui/          # Button, Text, ScreenWrapper, OfflineBanner, IconSvg
│   ├── hooks/                  # Shared hooks (useAppState, useToggle, …)
│   ├── constants/              # Shared non-config constants (e.g. query tag lists)
│   ├── services/
│   │   ├── api/                # http, transport, query, network, offline
│   │   └── storage/            # MMKV, cache, Zustand persistence adapter
│   ├── stores/                 # Zustand global UI state only
│   ├── utils/                  # normalize-error, toast, platform/
│   ├── theme/                  # Tokens, ThemeProvider, useTheme
│   └── types/                  # Global types (e.g. SVG declarations)
└── features/                   # Per-feature slices
    └── <feature>/

assets/
├── svgs/                       # Source SVGs — run gen:icons after changes
├── bootsplash/                 # Generated splash screen assets
├── bootsplash-logo.svg         # Splash screen source logo
└── icons.ts                    # Auto-generated icon registry (never edit manually)
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- Xcode (for iOS)
- Android Studio + Android SDK (for Android)
- CocoaPods (for iOS): `gem install cocoapods`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/maximcoding/react-native-starter.git
cd react-native-starter

# 2. Install JS dependencies
npm install
# Use --legacy-peer-deps if you hit peer dependency conflicts

# 3. Install iOS native dependencies
npx pod-install ios

# 4. Copy environment config
cp .env.example .env
# Edit .env to set your API_URL and other values
```

### Running the App

```bash
# Start Metro bundler
npm start

# iOS simulator
npm run ios

# Android emulator / device
npm run android
```

---

## Key Commands

### Development

| Command | Description |
|---|---|
| `npm start` | Start Metro bundler (with cache reset) |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator/device |
| `npm run lint` | **Biome:** `biome check .` (format + lint + import check; no writes) |
| `npm run format` | **Biome:** `biome check . --write` (apply format, organize imports, safe fixes) |
| `npm test` | Run Jest test suite |
| `npx tsc --noEmit` | Type-check without emitting |

### Assets & Guards

| Command | Description |
|---|---|
| `npm run gen:icons` | Regenerate `assets/icons.ts` from SVGs |
| `npm run check:icons` | Verify `icons.ts` is in sync (use in CI) |
| `npm run check:imports` | Enforce path alias usage (no deep relative imports) |

### i18n

| Command | Description |
|---|---|
| `npm run i18n:extract` | Extract i18next keys from source into JSON |
| `npm run i18n:types` | Generate TypeScript types for i18n keys |
| `npm run i18n:all` | Extract + generate types in one step |

### Android Build

| Command | Description |
|---|---|
| `npm run android:build:debug` | Build debug APK |
| `npm run android:build:release` | Build release APK |
| `npm run android:clean` | Clean Android build artifacts |
| `npm run android:rebuild` | Full clean + assemble + run |

### Release

| Command | Description |
|---|---|
| `npm run release:patch` | Bump patch version + changelog |
| `npm run release:minor` | Bump minor version + changelog |
| `npm run release:major` | Bump major version + changelog |

---

## Documentation

**Where to look (single source of truth by topic)**

| Topic | Doc |
|-------|-----|
| Onboarding, commands, overview | This README |
| Agent rules (Cursor, coding agents) | [AGENTS.md](AGENTS.md) |
| Claude Code stack reference | [.claude/CLAUDE.md](.claude/CLAUDE.md) |
| Extended policies & PR checklists | [docs/MOBILE_E2E_GUIDE_additions.md](docs/MOBILE_E2E_GUIDE_additions.md) |
| Roadmap & backlog | [docs/TODO.md](docs/TODO.md) |

**Guides**

- [Permissions (bare RN)](docs/permissions-bare-rn.md) — Android/iOS permission catalog.
- [Mobile E2E guide additions](docs/MOBILE_E2E_GUIDE_additions.md) — Production mobile guidelines (state, Query, navigation, CI); paths match this repo.

---

## Changelog

Version history is in [CHANGELOG.md](CHANGELOG.md). For tagged releases, see [GitHub Releases](https://github.com/maximcoding/react-native-starter/releases) .

---

## Hooks

Reusable hooks in `@/shared/hooks` — import and use across any feature.

| Hook | What it does |
|------|----------------|
| `useAppState` | Track foreground / background lifecycle |
| `useBackHandler` | Intercept Android hardware back button |
| `useKeyboard` | Keyboard visibility and height |
| `useRefreshControl` | Pull-to-refresh state for lists |
| `useDebounce` / `useDebouncedValue` | Delay a value (e.g. search, autosave) |
| `useTimeout` | Declarative `setTimeout` with cleanup |
| `useInterval` | Declarative `setInterval` with optional pause |
| `useCountdown` | Countdown timer with start / pause / resume / stop |
| `useToggle` | Boolean state plus toggle / setTrue / setFalse |
| `usePrevious` | Previous render's value |
| `useMountEffect` | Run an effect once on mount |
| `useIsFirstRender` | `true` only on first render |
| `useArray` | Managed array with push, removeAt, updateAt, clear |
| `useAsync` | Async function → loading / error / data state |
| `useForm` | Lightweight form state and validation |
| `useClipBoard` | Clipboard read/write and local state |
| `useWindowDimensions` | Screen dimensions (re-export from React Native) |
| `useToast` | Show toast / error toast |
| `useAppLaunch` | App bootstrap ready |
| `useSafeAreaScroll` | Safe area insets for ScrollView content |
| `useOnlineStatus` | Online / offline status |

---

## Architecture Overview

| Directory | Purpose |
|-----------|---------|
| `src/navigation/` | Stacks, tabs, routes, modals |
| `src/session/` | Bootstrap, logout, session bridge |
| `src/config/` | Env, constants, feature flags |
| `src/i18n/` | useT, locales, extraction |
| `src/shared/` | Cross-app: components, hooks, services, stores, utils, theme, types |
| `src/features/<name>/` | Product slices |

### Navigation

- Root stack (`src/navigation/root/root-navigator.tsx`): `ROOT_ONBOARDING` (OnboardingStack), `ROOT_AUTH` (AuthStack), `ROOT_APP` (HomeTabs) — initial route from `getBootstrapRoute()` in `src/session/bootstrap.ts`
- Route names: `src/navigation/routes.ts`
- Options: `src/navigation/options/navigation.tokens.ts`, `src/navigation/options/navigation.presets.ts`
- ParamLists: per-feature `param-list.ts`; root in `src/navigation/root-param-list.ts`

### Theme System

| Item | Location / Rule |
|------|-----------------|
| Tokens | `src/shared/theme/tokens/` — spacing, radius, typography, elevation, fonts |
| Palettes | `light.ts` / `dark.ts` — `background`, `surface`, `textPrimary`, `primary`, `danger` |
| Access | `useTheme()` only; no raw hex or magic numbers in components |

### Transport & Services

`src/shared/services/api/transport/` — `setTransport()` in `App.tsx` picks an adapter (e.g. REST vs mock via `flags.USE_MOCK` in `src/config/constants.ts`). Feature services call the transport; screens use feature services only. Zod validates responses; mappers convert to domain models.

| Adapter | Use case |
|---------|----------|
| `rest.adapter.ts` | REST (apisauce) |
| `mock.adapter.ts` | Local / dev mock data |
| `graphql.adapter.ts` | GraphQL |
| `websocket.adapter.ts` | WebSocket |
| `firebase.adapter.ts` | Firebase |

### Offline Infrastructure

Flow: Offline → queue buffers mutations → online → sync replays queue → cache provides reads.

| File | Role |
|------|------|
| `src/shared/services/api/offline/offline-queue.ts` | Buffer mutations while offline |
| `src/shared/services/api/offline/sync-engine.ts` | Replay queue when online |
| `src/shared/services/storage/cache-engine.ts` | Snapshots for offline reads |
| `src/shared/services/api/network/netinfo.ts` | NetInfo wrapper |

### React Query

| What | Where / Format |
|------|----------------|
| Server state | TanStack Query v5 |
| Keys | `src/features/<name>/api/keys.ts` — `[feature, entity, id?, params?]` |
| Invalidation | Mutations use `meta.tags` |
| Persistence | MMKV and `@tanstack/react-query-persist-client` |

### State & storage (when to use what)

| Need | Use | Where |
|------|-----|-------|
| Key-value (sync) | MMKV | `src/shared/services/storage/mmkv.ts` (`kvStorage`); key names in `src/config/constants.ts` |
| Server / API data | TanStack Query | Feature `api/keys.ts`; e.g. `useMeQuery`, `useLoginMutation` |
| Global UI state | Zustand | `src/shared/stores/app.store.ts`; `zustand-mmkv-storage.ts` — no server data |

---

## Feature Development

### Guide for adding a New Feature

1. **Create the directory structure:**

```
src/features/<feature-name>/
  screens/              # Screen components
  components/           # Feature-local components
  hooks/                # Feature-local hooks
  services/<name>/      # Schemas, types, mappers, service module
  api/
    keys.ts             # React Query key factory
  navigation/
    param-list.ts       # Stack/tab ParamList types for this feature
```

2. **Build screens** using `ScreenWrapper` as the root and theme-driven components — not raw RN views.

3. **Add translations** in `src/i18n/locales/en.json` (and `de.json`, `ru.json`). Run `npm run i18n:all` after.

4. **Service layer** — API logic in `src/features/<name>/services/`; include a Zod schema, a mapper, and a service module. Screens use feature services only — not the shared HTTP layer directly.

5. **Wire navigation** — add the route in `src/navigation/routes.ts`, `ParamList` entry, register in stack/tab.

---

## SVG Icons
The project uses a code-generation workflow to keep SVG assets in sync with a type-safe icon registry.

### How it works

1. **Source:** Drop `.svg` files into `assets/svgs/`.
2. **Generate:** Run `npm run gen:icons` — the script (`scripts/generate-icons.js`) reads every `.svg` file in that directory and writes `assets/icons.ts`. **Never edit `assets/icons.ts` manually** — it is always overwritten.
3. **Output:** `assets/icons.ts` exports:
   - `IconName` enum — one entry per SVG (e.g. `IconName.ARROW_RIGHT`)
   - `AppIcon` registry — maps each `IconName` to its imported SVG component
   - `IconNameType` — union type of all valid icon keys

### Full workflow

```bash
# 1. Add your SVG file
cp my-icon.svg assets/svgs/my-icon.svg

# 2. Regenerate the registry
npm run gen:icons

# 3. Verify icons.ts is in sync (also runs in CI)
npm run check:icons
```

### Using an icon in code

```tsx
import { AppIcon, IconName } from '@assets/icons';

const ArrowIcon = AppIcon[IconName.ARROW_RIGHT];

<ArrowIcon width={24} height={24} />
```

### CI guard

`npm run check:icons` (`scripts/check-icons-stale.js`) compares the SVG files in `assets/svgs/` against the imports in `assets/icons.ts`. It exits with a non-zero code if they are out of sync — add this step to your CI pipeline to catch forgotten regenerations.

```
[FAIL] assets/icons.ts is stale vs assets/svgs
  Not imported:
   - my-new-icon.svg

Run: npm run gen:icons
```

### Naming convention

SVG filenames are converted automatically:

| File | `IconName` enum key | Component name |
|---|---|---|
| `arrow-right.svg` | `ARROW_RIGHT` | `Arrow-right` |
| `home.svg` | `HOME` | `Home` |
| `user_profile.svg` | `USER_PROFILE` | `User_profile` |

---

## i18n Workflow

1. Use keys in code:

```tsx
const { t } = useT('auth'); // namespace
return <Text>{t('login.title')}</Text>;
```

2. Run extraction to update JSON files:

```bash
npm run i18n:all
```

3. The parser extracts new keys into locale JSON files and the generator produces TypeScript types for type-safe key usage.

4. Add translations for all supported locales (`en`, `de`, `ru`).

---

## Permissions
Only declare permissions your app actually uses.
See full catalog [`docs/permissions-bare-rn.md`](docs/permissions-bare-rn.md) .

| Category | Android | iOS |
|---|---|---|
| Location | `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION` | `NSLocationWhenInUseUsageDescription` |
| Camera | `CAMERA` | `NSCameraUsageDescription` |
| Microphone | `RECORD_AUDIO` | `NSMicrophoneUsageDescription` |
| Notifications | `POST_NOTIFICATIONS` (API 33+) | Runtime prompt |
| Contacts | `READ_CONTACTS`, `WRITE_CONTACTS` | `NSContactsUsageDescription` |
| Photos | `READ_MEDIA_IMAGES` | `NSPhotoLibraryUsageDescription` |
| Biometrics | `USE_BIOMETRIC` | `NSFaceIDUsageDescription` |
| Bluetooth | `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT` | `NSBluetoothAlwaysUsageDescription` |


---

## CI/CD & Release

See [CHANGELOG.md](CHANGELOG.md) for version history.

### GitHub Actions

Separate workflows are provided for Android and iOS:

- **Feature branches:** Biome check, tests, and build checks — fast feedback, no release artifacts.
- **Release tags (`vX.Y.Z`) or `release/*` branches:** full release build; optional upload to Google Play Internal (Android AAB) or TestFlight (iOS IPA).

### Local Release Builds

```bash
# Android release APK
npm run android:build:release

# iOS — via Xcode or Fastlane when configured
```

### Required Secrets (GitHub)

| Secret | Purpose |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Google Play upload via `supply` |
| `APP_STORE_CONNECT_API_KEY_JSON` | TestFlight upload via `pilot` |

### Splash Screen

Regenerate native splash assets after changing the **logo source** used by the script (see `bootsplash:generate` in `package.json` — currently `assets/logo.png`):

```bash
npm run bootsplash:generate
```

Output goes under `assets/bootsplash/` (and native projects are updated by the CLI).
