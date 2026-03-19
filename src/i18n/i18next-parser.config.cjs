module.exports = {
  locales: ['en', 'ru', 'de'],
  output: 'src/i18n/locales/$LOCALE/$NAMESPACE.json',
  defaultNamespace: 'common',
  namespaceSeparator: ':',
  keySeparator: '.',
  keepRemoved: false,
  lexers: {
    tsx: ['JsxLexer'],
    ts: ['JsxLexer'],
  },
}
