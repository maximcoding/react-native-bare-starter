module.exports = {
  locales: ['en', 'ru', 'de'],
  /** One JSON per language — matches `i18n.ts` imports and `generate-i18n-types.cjs`. */
  output: 'src/i18n/locales/$LOCALE.json',
  defaultNamespace: 'translation',
  namespaceSeparator: ':',
  keySeparator: '.',
  keepRemoved: false,
  lexers: {
    tsx: ['JsxLexer'],
    ts: ['JsxLexer'],
  },
}
