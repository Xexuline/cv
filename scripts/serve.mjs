#!/usr/bin/env node
/**
 * Serve `dist/` the way GitHub Pages will.
 *
 * The point is not convenience, it is fidelity: a project site lives under
 * `/<repo>/`, and that is where these deployments break — a stray absolute URL is
 * invisible when the site is served from the domain root in dev. This server
 * reproduces the base path, the directory-to-`index.html` mapping and the static
 * `404.html`, so a build that looks right here will look right once published.
 *
 * Read-only. Refuses to serve anything outside `dist/`.
 */
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const base = (process.env.SITE_BASE ?? '/cv/').replace(/\/?$/, '/')
const port = Number(process.env.PORT ?? 8888)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
}

function resolveTarget(pathname) {
  if (!pathname.startsWith(base)) return { redirect: base }
  const rel = decodeURIComponent(pathname.slice(base.length))
  // Contain the request inside dist/ before trusting anything about it.
  const candidate = resolve(dist, rel)
  if (candidate !== dist && !candidate.startsWith(dist + '/')) return { missing: true }

  if (existsSync(candidate) && statSync(candidate).isDirectory()) {
    const index = join(candidate, 'index.html')
    if (existsSync(index)) return { file: index }
  }
  if (existsSync(candidate) && statSync(candidate).isFile()) return { file: candidate }
  return { missing: true }
}

const server = createServer((request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname
  const target = resolveTarget(pathname)

  if (target.redirect) {
    response.writeHead(302, { location: target.redirect })
    response.end()
    return
  }

  let file = target.file
  let status = 200
  if (target.missing) {
    file = join(dist, '404.html')
    status = 404
    if (!existsSync(file)) {
      response.writeHead(404, { 'content-type': 'text/plain' })
      response.end('404: run npm run build first (dist/404.html is missing)')
      return
    }
  }

  response.writeHead(status, {
    'content-type': TYPES[file.slice(file.lastIndexOf('.'))] ?? 'application/octet-stream',
  })
  createReadStream(file).pipe(response)
})

if (!existsSync(join(dist, 'index.html'))) {
  console.error(`\n  dist/index.html not found. Run \`npm run build\` first.\n`)
  process.exit(1)
}

server.listen(port, () => {
  console.log(`\n  GitHub Pages simulation on http://localhost:${port}${base}`)
  console.log(`  Spanish: http://localhost:${port}${base}es/  (try a path that does not exist for the 404)\n`)
})
