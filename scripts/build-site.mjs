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

/**
 * Origin this repository is published under, unless `SITE_ORIGIN` says otherwise.
 *
 * An origin is not the Vite `base`. `SITE_BASE` says where *under* the origin the
 * site is mounted (`/cv/` on a project site, `/` on a user site); the origin says
 * which host the mount sits on. Only the prerender needs it, because a social
 * crawler resolves `og:url` and `og:image` off-page — it has no document to
 * resolve them against, so `/cv/og-image.png` is not a usable answer.
 *
 * A custom domain is therefore `SITE_ORIGIN=https://example.com SITE_BASE=/`; the
 * two are joined, and validated, in `src/site/metadata.ts`.
 */
const DEFAULT_SITE_ORIGIN = 'https://xexuline.github.io'

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

/**
 * Render every page to a string and write it out, together with the discovery files.
 *
 * `robots.txt` and `sitemap.xml` are emitted in this same pass and from the same
 * module graph: they name the pages by their absolute URLs, so they have to be
 * built by the same origin and the same base the pages were, and they have to
 * exist before anything reads them back off disk to check that.
 */
async function buildPages(origin) {
  const server = await createServer({
    root,
    logLevel: 'warn',
    appType: 'custom',
    server: { middlewareMode: true },
  })

  let pages, discovery
  try {
    const module = await server.ssrLoadModule('/src/site/render.tsx')
    pages = module.renderPages({ origin })
    const discoveryModule = await server.ssrLoadModule('/src/site/discovery.ts')
    discovery = discoveryModule.discoveryFiles({ origin })
  } finally {
    await server.close()
  }

  for (const page of pages) {
    const target = join(outDir, page.fileName)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, page.html, 'utf8')
  }
  for (const file of discovery) {
    await writeFile(join(outDir, file.fileName), file.body, 'utf8')
  }
  return { pages, discovery }
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

/**
 * The two social tags whose value is a URL must name a file this build wrote.
 *
 * `verifyEmittedUrls` above checks the root-relative URLs a browser resolves
 * against the page; it cannot see these, because they are absolute on purpose —
 * that is what makes them work off-page. Checking them against the artifact is
 * what keeps the origin and the base from drifting apart: an origin that carries a
 * path, or one that kept a trailing slash, produces an `og:image` that every
 * unfurler silently drops, and the published page looks fine to anyone who opens it.
 */
async function verifySocialCardUrls(base) {
  const failures = new Set()
  const written = await readdir(outDir, { recursive: true, withFileTypes: true })

  for (const entry of written) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue
    const page = join(entry.parentPath ?? entry.path, entry.name)
    for (const [, property, value] of (await readFile(page, 'utf8')).matchAll(
      /property="(og:url|og:image)" content="([^"]*)"/g,
    )) {
      let pathname
      try {
        const url = new URL(value)
        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
          throw new Error(`${url.protocol} is not http(s)`)
        }
        pathname = url.pathname
      } catch (cause) {
        failures.add(
          `${relative(root, page)} -> ${property}="${value}" (${cause.message})`,
        )
        continue
      }
      const served = servedFile(pathname, base)
      if (served === undefined || !(await isFile(join(outDir, served)))) {
        failures.add(
          `${relative(root, page)} -> ${property}="${value}" is not served `
            + `from dist/ under base ${base}`,
        )
      }
    }
  }

  if (failures.size > 0) {
    throw new Error(
      `${failures.size} social-card URL(s) are not absolute or not served by this build:\n\n`
        + `${[...failures].map((failure) => `  ${failure}`).join('\n')}\n\n`
        + `A crawler fetches og:image without fetching the page, so it needs the full URL:\n`
        + `the origin it resolves against comes from SITE_ORIGIN.`,
    )
  }
}

/**
 * `robots.txt` and `sitemap.xml` must name only pages this build wrote.
 *
 * The pages are checked against the artifact by `verifyEmittedUrls`; this is the
 * same idea applied to the files whose entire job is to name pages. A sitemap is
 * read by software that never looks at the site first, so an entry for a page that
 * was not emitted is an invented page, and one non-`https:` URL is an entry no
 * crawler accepts. Both are invisible to anyone who opens the site in a browser.
 *
 * The files are read back off disk rather than passed in from memory: what is
 * published is the artifact, and a check that reads the same strings the writer
 * produced only agrees with itself.
 */
async function verifyDiscoveryFiles(base) {
  const failures = new Set()
  const bodies = new Map()

  for (const fileName of ['robots.txt', 'sitemap.xml']) {
    const body = await readFile(join(outDir, fileName), 'utf8').catch(() => undefined)
    if (body === undefined) {
      failures.add(`${fileName} was not emitted`)
      continue
    }
    bodies.set(fileName, body)
  }

  const urls = []
  const sitemap = bodies.get('sitemap.xml')
  if (sitemap !== undefined) {
    for (const [, url] of sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)) {
      urls.push(['sitemap.xml <loc>', url])
    }
    for (const [, url] of sitemap.matchAll(/<xhtml:link\b[^>]*\bhref="([^"]*)"/g)) {
      urls.push(['sitemap.xml xhtml:link href', url])
    }
    // An empty <urlset> is well-formed XML and a perfectly valid way to tell every
    // crawler the site has no pages.
    if (!sitemap.includes('<loc>')) {
      failures.add('sitemap.xml contains no <loc>: it announces a site with no pages')
    }
    if (sitemap.includes('404')) {
      failures.add('sitemap.xml references 404: a miss is not a page to be crawled')
    }
  }

  const robots = bodies.get('robots.txt')
  if (robots !== undefined) {
    const sitemaps = [...robots.matchAll(/^Sitemap:[ \t]*(\S+)[ \t]*$/gim)]
    if (sitemaps.length === 0) {
      failures.add('robots.txt names no Sitemap: URL, which is the reason it exists')
    }
    for (const [, url] of sitemaps) {
      urls.push(['robots.txt Sitemap', url])
    }
  }

  for (const [where, value] of urls) {
    let pathname
    try {
      const url = new URL(value)
      if (url.protocol !== 'https:') {
        throw new Error(`${url.protocol} is not https`)
      }
      pathname = url.pathname
    } catch (cause) {
      failures.add(`${where}="${value}" (${cause.message})`)
      continue
    }
    const served = servedFile(pathname, base)
    if (served === undefined || !(await isFile(join(outDir, served)))) {
      failures.add(
        `${where}="${value}" is not served from dist/ under base ${base}`,
      )
    }
  }

  if (failures.size > 0) {
    throw new Error(
      `${failures.size} problem(s) with the files that tell crawlers which pages exist:\n\n`
        + `${[...failures].map((failure) => `  ${failure}`).join('\n')}\n\n`
        + `robots.txt and sitemap.xml are generated from the same origin and base as the\n`
        + `pages (src/site/discovery.ts); an entry that names no emitted file is a page\n`
        + `this build never wrote.`,
    )
  }
}

const started = Date.now()
const renamedSheet = await buildStyles()
// Trailing slashes are trimmed here rather than rejected: `SITE_BASE` already has
// to be normalised for the same reason, and `socialMeta` validates the result.
const origin = (process.env.SITE_ORIGIN ?? DEFAULT_SITE_ORIGIN).replace(/\/+$/, '')
const { pages, discovery } = await buildPages(origin)

// Resolved before the pages are checked: the URLs can only be interpreted
// against the base that produced them.
const config = await resolveConfig({ root, configFile: join(root, 'vite.config.ts') }, 'build')
const base = config.base ?? '/'

await verifyEmittedUrls(base)
await verifySocialCardUrls(base)
await verifyDiscoveryFiles(base)

console.log(
  `\n  ${pages.length} pages under base ${base} (stylesheet renamed from ${renamedSheet})\n`,
)
for (const item of [...pages, ...discovery]) {
  const size = Buffer.byteLength(item.html ?? item.body, 'utf8')
  console.log(
    `  ${item.fileName.padEnd(16)} ${(size / 1024).toFixed(1).padStart(6)} kB  ${relative(root, join(outDir, item.fileName))}`,
  )
}
console.log(`\n  Built in ${Date.now() - started} ms. Serve locally: npm run serve\n`)
