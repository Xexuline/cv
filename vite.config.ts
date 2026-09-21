import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

/**
 * Deployment base.
 *
 * GitHub Pages serves a project site from `https://<user>.github.io/<repo>/`, so
 * the default mounts the site under `/cv/`. `SITE_BASE=/` publishes to a domain
 * root or to a `https://<user>.github.io/` user site instead.
 *
 * `actions/configure-pages` emits the base path WITHOUT a trailing slash. We
 * normalize it here (`.replace(/\/?$/, '/')`) so every emitted URL has exactly
 * one leading and one trailing slash. `src/site/site.ts` expects this invariant
 * and builds all links accordingly.
 *
 * This is the only place the base is written down: Vite turns it into
 * `import.meta.env.BASE_URL`, which `src/site/site.ts` reads to build every link,
 * so the stylesheet URLs and the generated markup cannot drift apart.
 */
const base = (process.env.SITE_BASE ?? '/cv/').replace(/\/?$/, '/')

export default defineConfig({
  base,
  resolve: {
    /**
     * `~/` is spelled out rather than inferred from `tsconfig.json`.
     *
     * `resolve.tsconfigPaths` did not apply to the `ssrLoadModule` graph this build
     * renders through, so `~/lib/theme` failed to resolve there. An explicit prefix
     * alias behaves identically in the CSS build and in the render pass. The `paths`
     * entry in tsconfig.json stays as the copy `tsc` reads.
     */
    alias: {
      '~/': `${fileURLToPath(new URL('./src/', import.meta.url))}/`,
    },
  },
  plugins: [viteReact(), tailwindcss()],
})
