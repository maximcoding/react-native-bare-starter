/**
 * If adb has no device, start the first available AVD with flags that reduce
 * flaky boots, then poll until a device appears (or timeout).
 */
const { spawn, execSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

function listAdbDevices() {
  try {
    return execSync('adb devices', { encoding: 'utf8' })
  } catch {
    return ''
  }
}

function hasReadyDevice() {
  return listAdbDevices()
    .split('\n')
    .some(line => /\tdevice\s*$/.test(line))
}

function getSdkHome() {
  return (
    process.env.ANDROID_HOME ||
    process.env.ANDROID_SDK_ROOT ||
    `${process.env.HOME || process.env.USERPROFILE}/Library/Android/sdk`
  )
}

function getEmulatorBin(sdk) {
  const bin = path.join(sdk, 'emulator', 'emulator')
  return fs.existsSync(bin) ? bin : null
}

function getAvdName(sdk) {
  const fromEnv = process.env.ANDROID_AVD?.trim()
  if (fromEnv) return fromEnv
  const emulatorBin = getEmulatorBin(sdk)
  if (!emulatorBin) return null
  try {
    const out = execSync(`"${emulatorBin}" -list-avds`, { encoding: 'utf8' })
    const lines = out
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
    return lines[0] ?? null
  } catch {
    return null
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function main() {
  if (hasReadyDevice()) {
    return
  }

  const sdk = getSdkHome()
  const emulatorBin = getEmulatorBin(sdk)
  const avd = getAvdName(sdk)

  if (!emulatorBin || !avd) {
    console.error(
      '[android] No device in `adb devices`. Set ANDROID_HOME / ANDROID_AVD or create an AVD in Android Studio.',
    )
    process.exit(1)
  }

  console.log(
    `[android] No device detected — starting "${avd}" (-no-snapshot-load -no-audio)...`,
  )

  const child = spawn(
    emulatorBin,
    ['-avd', avd, '-no-snapshot-load', '-no-audio'],
    { detached: true, stdio: 'ignore' },
  )
  child.unref()

  const deadline = Date.now() + 240_000
  while (Date.now() < deadline) {
    await sleep(4000)
    if (hasReadyDevice()) {
      console.log('[android] Device is online.')
      return
    }
  }

  console.error(
    '[android] Timed out waiting for emulator. Fix the AVD (e.g. wipe data / API 34–35) or connect a USB device with debugging enabled.',
  )
  process.exit(1)
}

main()
