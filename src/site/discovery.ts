import { alternateUrls, canonicalUrl } from '~/site/metadata';

/**
 * One file the build emits that is not a page: `robots.txt` and `sitemap.xml`.
 *
 * `fileName` is relative to `dist/`, exactly like `RenderedPage.fileName`, so the
 * prerender writes it with the same two lines of code.
 */
export interface DiscoveryFile {
  fileName: string;
  body: string;
}

/** The file the `Sitemap:` line of `robots.txt` points at. */
const SITEMAP_FILE_NAME = 'sitemap.xml';

/**
 * `sitemap.xml` for the whole site.
 *
 * Every URL — the `<loc>`s and the `hreflang` alternates alike — comes out of
 * `canonicalUrl`, the same function the pages ask for their own
 * `<link rel="canonical">`. That is the point: a sitemap that builds its URLs
 * separately can silently disagree with the canonicals it is supposed to
 * describe, and a crawler treats the canonical as the truth about the sitemap
 * rather than the other way round.
 *
 * The same holds for the base. `canonicalUrl` joins the origin and `withBase`'s
 * deployment base, so `SITE_BASE=/` moves these URLs the same way it moves the
 * links in the pages, with no second place to edit.
 *
 * Each `<url>` lists every supported locale as an `xhtml:link` alternate, itself
 * included: `sitemaps.org` describes a synchronised set, and a page that omits
 * itself from its own alternates is a set the crawler has to complete by guesswork.
 *
 * `404.html` is deliberately absent — see `socialMeta` for the same reasoning on
 * `rel="canonical"`: a miss is not a page, and listing it tells crawlers to go
 * looking for content that is not there.
 *
 * Nothing is XML-escaped because nothing here can need it: the inputs are a
 * validated https origin (`canonicalUrl` rejects anything else) and the literal
 * path table in `locale.ts`.
 */
function sitemapBody(origin: string): string {
  // The same list the pages declare in their `<head>`, so the two cannot drift
  // apart: `alternateUrls` is the only place a locale becomes a URL.
  const urls = alternateUrls({ origin });
  const entries = urls.map(({ url }) =>
    [
      '  <url>',
      `    <loc>${url}</loc>`,
      ...urls.map(
        (alternate) =>
          `    <xhtml:link rel="alternate" hreflang="${alternate.locale}" ` +
          `href="${alternate.url}"/>`,
      ),
      '  </url>',
    ].join('\n'),
  );

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'
    + ' xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
    + `${entries.join('\n')}\n`
    + '</urlset>\n'
  );
}

/**
 * `robots.txt`.
 *
 * There is nothing to disallow: a public CV wants to be read. The file exists for
 * the `Sitemap:` line, which is the only part with any consequence — it is how a
 * crawler that landed on one page learns the site has another one.
 *
 * The sitemap URL is absolute because that is the only form the Robots Exclusion
 * Protocol recognises here, and it is built by `canonicalUrl` — `origin` joined to
 * `withBase`, which is where every other URL in the site gets its prefix — for the
 * same reason the `<loc>`s are: the origin and the base are each written down once
 * elsewhere.
 */
function robotsBody(origin: string): string {
  const sitemapUrl = canonicalUrl({ origin, pagePath: SITEMAP_FILE_NAME });
  if (sitemapUrl === null) {
    throw new Error(`No sitemap URL for origin "${origin}".`);
  }

  return (
    '# The whole site is public; the page list lives in the sitemap because a crawler\n'
    + '# that finds one page by luck finds the rest only if someone writes it down.\n'
    + 'User-agent: *\n'
    + 'Allow: /\n'
    + '\n'
    + `Sitemap: ${sitemapUrl}\n`
  );
}

/**
 * The files that tell crawlers which pages this site has.
 *
 * Called by `scripts/build-site.mjs` with the same origin the pages are rendered
 * with, and emitted next to them, so `robots.txt` and `sitemap.xml` describe the
 * artifact they were built with rather than a hand-maintained list that rots the
 * first time a locale is added or the base moves.
 */
export function discoveryFiles({ origin }: { origin: string }): DiscoveryFile[] {
  return [
    { fileName: 'robots.txt', body: robotsBody(origin) },
    { fileName: SITEMAP_FILE_NAME, body: sitemapBody(origin) },
  ];
}
