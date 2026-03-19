import { ROUTES } from '@/navigation/routes'

/** Root navigator: onboarding, auth, and main app shell. Not owned by a single feature. */
export type RootStackParamList = {
  [ROUTES.ROOT_APP]: undefined
  [ROUTES.ROOT_AUTH]: undefined
  [ROUTES.ROOT_ONBOARDING]: undefined
}
