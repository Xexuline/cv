/// <reference types="vite/client" />

/**
 * Deployment base, always with a leading and a trailing slash.
 *
 * `import.meta.env.BASE_URL` is Vite's own normalisation of its `base` option, so
 * this is the same value the bundler stamps into asset URLs — the markup and the
 * stylesheet cannot disagree about where the site is mounted.
 *
 * GitHub Pages serves a project site from `https://<user>.github.io/<repo>/`. That
 * is why every absolute URL here goes through `withBase`: unprefixed ones 404 and
 * the page comes out unstyled. `vite.config.ts` reads `SITE_BASE` from an env var
 * with the same default, so `SITE_BASE=/ npm run build` publishes to a domain root
 * or a user site instead.
 */
export const SITE_BASE = import.meta.env.BASE_URL;

/** Prefix a site-root-relative path with the base. */
export function withBase(path: string): string {
  if (/^(https?:|mailto:|#|\/\/)/.test(path)) return path;
  const withoutLeading = path.replace(/^\/+/, '');
  return withoutLeading === '' ? SITE_BASE : `${SITE_BASE}${withoutLeading}`;
}
