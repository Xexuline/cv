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
import { mkdir, readdir, readFile, rename, stat, writeFile } from 'node:fs/promises'
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

/** `stat` as an answer rather than an exception: a missing file is expected here. */
async function isFile(path) {
  return await stat(path).then(
    (info) => info.isFile(),
    () => false,
  )
}

/**
 * The URLs in a page that resolve from the deployment root.
 *
 * Absolute (`https:`), mail (`mailto:`), protocol-relative (`//`) and in-page
 * (`#`) URLs are somebody else's resolution problem. Only a path that starts at
 * the deployment root can be glued together by a malformed base, so only those
 * are worth checking.
 */
function rootRelativeUrls(html) {
  const urls = []
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]*)"/g)) {
    if (url.startsWith('/') && !url.startsWith('//')) {
      urls.push(url.split('#')[0].split('?')[0])
    }
  }
  return urls
}

/**
 * The file in `dist/` that serves `url`, or `undefined` if nothing does.
 *
 * `dist/` holds the site *at* the base: Pages mounts it at `/cv/`, so
 * `/cv/assets/site.css` is `dist/assets/site.css` and not
 * `dist/cv/assets/site.css`. The base is therefore what gets removed before
 * looking the rest up — not one path segment, which would silently agree with a
 * malformed base and would mis-resolve a deployment mounted at the root.
 *
 * A URL that does not start with the base is a finding even when the matching
 * file happens to exist: on a project site it resolves above the mount point and
 * 404s there.
 */
function servedFile(url, base) {
  // The mount point itself, asked for without its trailing slash.
  if (url === base.slice(0, -1)) return 'index.html'
  if (!url.startsWith(base)) return undefined
  const rest = url.slice(base.length)
  return rest === '' || rest.endsWith('/') ? join(rest, 'index.html') : rest
}

/**
 * Every root-relative URL in the emitted HTML must name a file this build wrote.
 *
 * Pages serves byte-for-byte what lands in `dist/`, and a base that is one slash
 * short — `actions/configure-pages` reports `/cv`, and gluing it onto
 * `assets/site.css` gives `/cvassets/site.css` — publishes an unstyled site that
 * passes every other gate. Reading the URLs back out of the finished pages and
 * resolving them against the artifact is what catches that: it compares the two
 * halves of the build against each other, where grepping the markup for an
 * interpolated `${SITE_BASE}assets/…` only ever agreed with itself.
 */
async function verifyEmittedUrls(base) {
  const failures = new Set()
  const written = await readdir(outDir, { recursive: true, withFileTypes: true })

  for (const entry of written) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue
    const page = join(entry.parentPath ?? entry.path, entry.name)
    for (const url of rootRelativeUrls(await readFile(page, 'utf8'))) {
      const served = servedFile(url, base)
      if (served === undefined || !(await isFile(join(outDir, served)))) {
        failures.add(`${relative(root, page)} -> ${url}`)
      }
    }
  }

  if (failures.size > 0) {
    throw new Error(
      `No file in dist/ serves ${failures.size} root-relative URL(s) under base ${base}:\n\n`
        + `${[...failures].map((failure) => `  ${failure}`).join('\n')}\n\n`
        + `A first segment that has swallowed the next one (/cvassets/site.css) means the\n`
        + `deployment base lost its trailing slash — see vite.config.ts.`,
    )
  }
}

const started = Date.now()
const renamedSheet = await buildStyles()
const pages = await buildPages()

// Resolved before the pages are checked: the URLs can only be interpreted
// against the base that produced them.
const config = await resolveConfig({ root, configFile: join(root, 'vite.config.ts') }, 'build')
const base = config.base ?? '/'

await verifyEmittedUrls(base)

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
