/**
 * Pre-filled when `flags.USE_MOCK` is true (__DEV__ + `USE_MOCK_API` in `.env`).
 * The mock adapter accepts any valid email and non-empty password; these values are defaults only.
 */
export const AUTH_MOCK_DEMO = {
  email: 'demo@example.com',
  password: 'password',
} as const
