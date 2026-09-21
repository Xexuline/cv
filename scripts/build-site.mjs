#!/usr/bin/env node
/**
 * Build the static site.
 *
 * There is no client bundle. Vite is used twice, never as an app bundler:
 *
 *   1. a CSS build, so Tailwind scans the sources and emits one stylesheet plus the
 *      Inter font files, and `public/` is copied;
 *   2. an in-memory module loader (`ssrLoadModule`) that can import the `.tsx`
 *      components, which are then stringified with `renderToStaticMarkup`.
 *
 * What lands in `dist/` is plain HTML, CSS, fonts and the PDF. It works with
 * JavaScript switched off; the only script in the page is the inline theme bootstrapper.
 */
import { readdir, mkdir, rename, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build, createServer, resolveConfig } from 'vite'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'dist')
const assetsDir = join(outDir, 'assets')
/** The stylesheet name `src/site/Document.tsx` links to. */
const CSS_NAME = 'site.css'

/** Tailwind + fonts + `public/`. `emptyOutDir` makes this the clean step. */
async function buildStyles() {
  await build({
    root,
    logLevel: 'warn',
    // A single CSS entry point already produces a single stylesheet. Vite 8 rejects
    // `cssCodeSplit: false` combined with a CSS input, and does not need it here.
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: { input: 'src/styles/app.css' },
    },
  })

  const sheets = (await readdir(assetsDir)).filter((name) => name.endsWith('.css'))
  if (sheets.length !== 1) {
    throw new Error(
      `Expected exactly one stylesheet in dist/assets, found ${sheets.length}: ${sheets.join(', ')}`,
    )
  }
  await rename(join(assetsDir, sheets[0]), join(assetsDir, CSS_NAME))
  return sheets[0]
}

/** Render every page to a string and write it out. */
async function buildPages() {
  const server = await createServer({
    root,
    logLevel: 'warn',
    appType: 'custom',
    server: { middlewareMode: true },
  })

  let pages
  try {
    const module = await server.ssrLoadModule('/src/site/render.tsx')
    pages = module.renderPages()
  } finally {
    await server.close()
  }

  for (const page of pages) {
    const target = join(outDir, page.fileName)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, page.html, 'utf8')
  }
  return pages
}

const started = Date.now()
const renamedSheet = await buildStyles()
const pages = await buildPages()

const config = await resolveConfig({ root, configFile: join(root, 'vite.config.ts') }, 'build')
const base = config.base ?? '/'

console.log(
  `\n  ${pages.length} pages under base ${base} (stylesheet renamed from ${renamedSheet})\n`,
)
for (const page of pages) {
  const size = Buffer.byteLength(page.html, 'utf8')
  console.log(
    `  ${page.fileName.padEnd(16)} ${(size / 1024).toFixed(1).padStart(6)} kB  ${relative(root, join(outDir, page.fileName))}`,
  )
}
console.log(`\n  Built in ${Date.now() - started} ms. Serve locally: npm run serve\n`)
