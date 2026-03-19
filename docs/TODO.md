## Roadmap

- [x] Zustand stores in `src/shared/stores/`
- [ ] Extend shared components: Inputs, Cards, Lists, Toasts
- [ ] Sentry / Crashlytics integration
- [ ] Storybook for shared components
- [ ] CodePush / OTA update support
- [ ] Clean up GitHub workflow files (keep only android/ios/release)
- [ ] End-to-end tests (Detox or Maestro)

---

New react components
 1. <Activity> - wrapper which show / hide elements but remains the state
 2. <Suspense> - loading until promise is resolved ( TanQuery )
 3. <ErrorBoundary> - catch errors in child components and show fallback UI
 4. <Portal> - render children into a DOM node that exists outside the DOM hierarchy of the parent component
 5. <LazyLoad> - load components only when they are visible in viewport

## Making the repo public and discoverable

In-repo work (LICENSE, CONTRIBUTING, CHANGELOG, issue/PR templates, README updates) is done. Remaining items (repo: `https://github.com/maximcoding/react-native-starter`):

### GitHub repo (manual in UI)

- [ ] Set repo description (e.g. "Production-ready React Native (bare) starter: TypeScript, feature-first, theme, i18n, offline, React Query.")
- [ ] Add topics: `react-native`, `typescript`, `starter`, `boilerplate`, `bare-workflow`, `react-query`, `mmkv`, `i18n`, `offline-first`, `template`
- [ ] Optionally set Website if you add a docs/landing page

### Screenshots / media

- [ ] Add 1–2 app screenshots or a short GIF (e.g. light/dark theme, main screens)
- [ ] Store in `docs/images/` and reference in README "Screenshots" section (placeholder comment is already there)

### Releases

- [ ] When tagging versions (`npm run release:patch` etc.), create a **GitHub Release** for the tag and paste the relevant CHANGELOG section into the release notes

### Discoverability

- [ ] Submit a PR to [awesome-react-native](https://github.com/jondot/awesome-react-native) (Starter Kits / Templates) with repo URL and one-line description
- [ ] One launch post: r/reactnative, React Native Discord, or Twitter/X with repo link and 2–3 bullet points (what's included, why bare)

### Optional

- [ ] Add `.github/CODE_OF_CONDUCT.md` (e.g. Contributor Covenant)
- [ ] Add `SECURITY.md` with how to report vulnerabilities
- [ ] GitHub Pages or short blog post for extra SEO

