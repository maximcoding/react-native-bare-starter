/**
 * Ensures `.env` exists for react-native-config (Gradle reads it at configure time).
 * Copies `.env.example` → `.env` only when `.env` is missing.
 */
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const envPath = path.join(root, '.env')
const examplePath = path.join(root, '.env.example')

if (!fs.existsSync(envPath) && fs.existsSync(examplePath)) {
  fs.copyFileSync(examplePath, envPath)
  console.log('[ensure-env] Created .env from .env.example')
}
