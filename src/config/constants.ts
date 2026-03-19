import Config from 'react-native-config'

// --- APPEND (do not remove anything) ---
export const constants = {
  // ...your existing entries
  MAX_UPLOAD_SIZE: 20 * 1024 * 1024,
  DEFAULT_PAGE_SIZE: 20,
  AUTH_TOKEN: 'auth.token',
  RQ_CACHE: 'rq.cache.v1',
  REFRESH_TOKEN: 'auth.refreshToken', // ← add this line
  ONBOARDING_DONE: 'onboarding.done.v1',
  APP_PREFERENCES_STORE: 'app.preferences',
  IS_FIRST_TIME_OPEN_KEY: 'user.isFirstTimeOpen',
  HIDE_USE_CAMERA_KEY: 'user.hideUseCamera',
  DONT_SHOW_AGAIN_KEY: 'user.dontShowAgain',
  CONFIRMATION_KEY: 'user.confirmation',
  ACCOUNTS_KEY: 'user.accounts',
  CONTACTS_KEY: 'user.contacts',
}

export const flags = {
  USE_MOCK: __DEV__ && (Config.USE_MOCK_API ?? '0') === '1',
}
