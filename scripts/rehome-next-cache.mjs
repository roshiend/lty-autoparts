#!/usr/bin/env node
/**
 * Move `.next` to a fast local disk and replace it with a symlink/junction.
 *
 * WARNING: Do not use this with Next.js Turbopack + PostCSS (e.g. @tailwindcss/postcss).
 * Bundler workers resolve modules from paths inside `.next`; if that tree lives outside
 * the repo, `require()` cannot see ./node_modules — you get "Cannot find module".
 * Prefer moving the whole repo to a fast disk (e.g. WSL: ~/project, not /mnt/d/).
 * To revert a prior run: pnpm undo-rehome-next-cache
 *
 * Usage (from repo root, dev server stopped):
 *   pnpm rehome-next-cache
 *
 * If removal of `.next` fails (Windows file locks), delete the `.next` folder manually,
 * then run: pnpm rehome-next-cache --finish
 *
 * Optional: NEXT_CACHE_TARGET=/path/on/fast/disk
 * Default: Windows → %LOCALAPPDATA%\LtyAutoParts-next-cache
 *          Unix    → ~/.cache/lty-autoparts-next-cache
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const projectRoot = path.resolve(import.meta.dirname, '..')
const nextPath = path.join(projectRoot, '.next')

const defaultTarget =
  process.env.NEXT_CACHE_TARGET ||
  (process.platform === 'win32'
    ? path.join(process.env.LOCALAPPDATA || os.tmpdir(), 'LtyAutoParts-next-cache')
    : path.join(os.homedir(), '.cache', 'lty-autoparts-next-cache'))

const rmOptions = { recursive: true, force: true, maxRetries: 8, retryDelay: 250 }

function copyTree(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  if (!fs.existsSync(src)) return
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, ent.name)
    const d = path.join(dest, ent.name)
    if (ent.isDirectory()) copyTree(s, d)
    else if (ent.isFile()) fs.copyFileSync(s, d)
    else if (ent.isSymbolicLink()) {
      fs.symlinkSync(fs.readlinkSync(s), d)
    }
  }
}

function linkOnly(target) {
  if (fs.existsSync(nextPath)) {
    try {
      fs.readlinkSync(nextPath)
      console.log('.next is already a symlink/junction; nothing to do.')
      return
    } catch {
      console.error(
        '`.next` still exists as a normal folder. Stop `next dev`, close editors holding files, delete `.next`, then run:\n  pnpm rehome-next-cache --finish'
      )
      process.exit(1)
    }
  }
  fs.mkdirSync(target, { recursive: true })
  fs.symlinkSync(target, nextPath, process.platform === 'win32' ? 'junction' : 'dir')
  console.log(`Created .next → ${target}`)
}

function main() {
  const target = path.resolve(defaultTarget)
  const finish = process.argv.includes('--finish')

  if (finish) {
    linkOnly(target)
    return
  }

  if (fs.existsSync(nextPath)) {
    try {
      const dest = fs.readlinkSync(nextPath)
      console.log('.next is already a symlink/junction; nothing to do.')
      console.log(`→ ${dest}`)
      return
    } catch {
      /* existing real directory */
    }
  }

  if (!fs.existsSync(nextPath)) {
    linkOnly(target)
    return
  }

  fs.mkdirSync(target, { recursive: true })
  console.log(`Copying .next → ${target} (may take a minute)...`)
  copyTree(nextPath, target)
  console.log('Removing old .next folder...')
  try {
    fs.rmSync(nextPath, rmOptions)
  } catch (e) {
    console.error(
      `Could not remove .next automatically (${e.code || e.message}).\n` +
        `Copy finished at ${target}. After you delete the folder "${nextPath}" manually, run:\n` +
        `  pnpm rehome-next-cache --finish`
    )
    process.exit(1)
  }
  fs.symlinkSync(target, nextPath, process.platform === 'win32' ? 'junction' : 'dir')
  console.log(`Done. .next now points at ${target}`)
}

main()
