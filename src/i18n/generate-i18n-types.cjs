const fs = require('fs')
const path = require('path')

const localesDir = path.join(__dirname, 'locales')
const languages = ['en', 'ru', 'de']

/** Flat locale files: `locales/en.json` (matches i18n.ts imports). */
let template = null
for (const lang of languages) {
  const p = path.join(localesDir, `${lang}.json`)
  if (fs.existsSync(p)) {
    template = JSON.parse(fs.readFileSync(p, 'utf8'))
    break
  }
}

if (!template) {
  throw new Error(
    `No locale JSON found in ${localesDir} (expected ${languages.join(', ')}.json)`,
  )
}

function toTS(obj, indent = 2) {
  const spacing = ' '.repeat(indent)
  return Object.entries(obj)
    .map(([k, v]) => {
      if (typeof v === 'string')
        return `${spacing}${JSON.stringify(k)}: string;`
      return `${spacing}${JSON.stringify(k)}: {\n${toTS(v, indent + 2)}\n${spacing}};`
    })
    .join('\n')
}

const dts = `// AUTO-GENERATED — DO NOT EDIT

import 'i18next'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: {
${toTS(template, 8)}
      };
    };
  }
}
`

fs.writeFileSync(path.join(__dirname, 'i18n-types.d.ts'), dts)
console.log('i18n types generated.')
