#!/usr/bin/env node
/**
 * Remove a `.next` junction/symlink created by rehome-next-cache and restore a normal
 * `.next` directory inside the repo. Required for Turbopack/PostCSS: workers load code from
 * paths under `.next`; if that lives outside the project, `require('@tailwindcss/postcss')`
 * cannot resolve to ./node_modules.
 *
 * Usage (dev server stopped): pnpm undo-rehome-next-cache
 */
import fs from 'node:fs'
import path from 'node:path'

const projectRoot = path.resolve(import.meta.dirname, '..')
const nextPath = path.join(projectRoot, '.next')

function main() {
  if (!fs.existsSync(nextPath)) {
    fs.mkdirSync(nextPath, { recursive: true })
    console.log('Created empty .next')
    return
  }

  let target
  try {
    target = fs.readlinkSync(nextPath)
  } catch {
    console.log('.next is already a normal folder; nothing to undo.')
    return
  }

  fs.unlinkSync(nextPath)
  fs.mkdirSync(nextPath, { recursive: true })
  console.log('Removed .next → redirect.')
  const prev = path.isAbsolute(target) ? target : path.resolve(path.dirname(nextPath), target)
  console.log(`Previous cache (safe to delete for disk space): ${prev}`)
  console.log('Run `pnpm dev` again.')
}

main()
