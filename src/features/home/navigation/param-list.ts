import { ROUTES } from '@/navigation/routes'

/** Bottom tabs inside the authenticated app (Home + Settings entry). */
export type HomeTabsParamList = {
  [ROUTES.TAB_HOME]: undefined
  [ROUTES.TAB_SETTINGS]: undefined
}

/** Home area stack param list when using nested stack + tabs. */
export type HomeStackParamList = {
  [ROUTES.TAB_HOME]: undefined
  [ROUTES.HOME_TABS]: undefined
}
