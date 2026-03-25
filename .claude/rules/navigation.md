---
globs: src/navigation/**
---

Global rules: [AGENTS.md](../../AGENTS.md). Claude stack summary: [CLAUDE.md](../CLAUDE.md).

# Rules — navigation

## Structure
- **Static config** (`src/navigation/root/root-navigator.tsx`): `createNativeStackNavigator({screens:{}})` — no JSX navigator wrappers.
- **Root entry** `src/navigation/NavigationRoot.tsx`: `createStaticNavigation(RootStack)` — render exactly once, no second instance.
- **Initial route:** `getInitialRoute()` from `src/session/bootstrap.ts` — sync MMKV read that resolves `ROOT_ONBOARDING | ROOT_AUTH | ROOT_APP`.
- **Routes:** all constants in `src/navigation/routes.ts` — never inline route string literals anywhere.
- **ParamList:** `RootStackParamList` in `src/navigation/root-param-list.ts`; declared manually (not via `StaticParamList`) to avoid circular deps through feature screens. Declared globally once:
  ```ts
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }
  ```
- **Imperative navigation** outside the React tree: use `navigationRef` from `src/navigation/helpers/navigation-helpers.ts`.

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

## Static config rules (React Navigation v7)
- Add screens via the `screens` object — each value is a component, a nested static navigator, or `{ screen, options, linking }`.
- Use `groups` to share `screenOptions` across a set of screens — do not create a nested navigator just for code organization.
- Use the `if` property (hook callback) on a screen or group for conditional rendering (auth gate, feature flag). Never call `navigation.navigate()` after auth state changes — React Navigation transitions automatically.
- Attach dynamic logic (runtime `screenOptions`, `screenListeners`) via `.with()` — it shallow-merges with the static config.

## Params
- Params must be **JSON-serializable** — required for state persistence and deep linking.
- Pass **IDs only**, never full data objects. Fetch data from React Query cache using the ID inside the screen.
- Do not use reserved param keys: `screen`, `params`, `initial`, `state`.
- To update params from within a screen: `navigation.setParams({...})` (merge) or `navigation.replaceParams({...})` (replace).
- To pass data back to a previous screen: `navigation.popTo('ScreenName', { result })`.
- To navigate to a nested screen with params: `navigation.navigate('Parent', { screen: 'Child', params: { id } })`.

## Navigation actions
- `navigate()` — standard transition; no-op if already on that screen (safe, no duplication).
- `push()` — forces a new instance of the same screen; use when multiple instances are needed.
- `goBack()` — standard back; hardware back and swipe gestures call this automatically.
- `popTo('ScreenName')` — jump back to a specific screen, skipping intermediates.
- `popToTop()` — reset a stack to its root screen.

## Screen lifecycle
- Use `useFocusEffect(useCallback(() => { ... return cleanup }, []))` for side effects that must run on focus (data refresh, analytics). Always return a cleanup function.
- Use `useIsFocused()` when a component must re-render on focus state change.
- Use `navigation.addListener('focus' | 'blur', cb)` inside `useEffect` — always return the unsubscribe result.
- Do not use plain `useEffect` for focus-aware operations without listener subscriptions.

## TypeScript
- ParamList entries must use `type`, never `interface`.
- Do not annotate `useNavigation<T>()` with a specific type — declare the global `RootParamList` instead.
- Do not annotate `useRoute<T>()` — use `route` from screen props (`NativeStackScreenProps<RootStackParamList, 'RouteName'>`).
- Use `CompositeScreenProps` for screens inside nested navigators that need access to parent navigation.
- Use `NavigatorScreenParams<ChildParamList>` when a parent ParamList entry wraps a nested navigator.

## Half-sheet modals
- Register with `presentation: 'transparentModal'`, `animation: 'none'`, `gestureEnabled: false` (see `HALF_SHEET_OPTIONS` in `root-navigator.tsx`).
- Use `HalfSheet` from `src/shared/components/ui/HalfSheet.tsx` as the content wrapper.

## Must
- All route constants from `src/navigation/routes.ts` — never inline strings.
- New screens: add constant to `routes.ts`, add `ParamList` entry to `root-param-list.ts`, register in `root-navigator.tsx`.
- `navigationRef` for imperative navigation outside the React tree.
- `useFocusEffect` + `useCallback` for focus-scoped side effects.
- `InteractionManager.runAfterInteractions` for heavy non-UI work triggered by navigation.

## Must not
- Do not render a second `createStaticNavigation(...)` instance — one root only.
- Do not call `navigation.navigate()` after an auth state change — conditional screen rendering handles it.
- Do not nest navigators of the same type (tabs-in-tabs, stack-in-stack at the same level).
- Do not create a nested navigator solely for code organization — use `groups` instead.
- Do not navigate from `src/shared/**` directly — pass callbacks as props or use `navigationRef` helpers.
- Do not add navigation logic inside `src/shared/components/ui/` components.
- Do not pass full data objects as params — pass IDs and fetch data inside the screen.
- Do not leave empty directories under `src/navigation/` — remove the folder when the last file is deleted.
