import { SUPPORTED_LOCALES, type Locale } from '~/i18n/locale';
import { uiStrings } from '~/i18n/messages';
import { withBase } from '~/site/site';

/**
 * One `<meta property=… content=…>` pair of the social card.
 *
 * The card is data rather than markup, so it is built here as a list and rendered
 * by `Document` in one place. A page that advertises itself with a relative URL,
 * or with an image no crawler can rasterise, is a card that silently degrades to a
 * bare link, and nothing at view time would notice.
 */
export interface SocialMeta {
  property: string;
  content: string;
}

/**
 * The card image, committed at `public/og-image.png`.
 *
 * It is a PNG rather than `favicon.svg` on purpose: Facebook, LinkedIn, Slack and
 * X do not rasterise SVG, so the asset a browser uses as a favicon is not usable
 * here. The dimensions are emitted next to it because a card is laid out before
 * its image has downloaded — an unstated box is a layout shift once it arrives.
 */
const OG_IMAGE = 'og-image.png';
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

/**
 * `og:locale` wants a `language_COUNTRY` tag.
 *
 * `HTML_LANG` deliberately is not that — it exists to pick a regional voice for
 * assistive tech (`es-ES` for copy written for Spain), and a social platform fed a
 * subtag it does not know simply ignores it. The two tables serve different
 * consumers and are kept apart so one cannot rename the other.
 */
const OG_LOCALE: Record<Locale, string> = { en: 'en_US', es: 'es_ES' };

/** An origin: scheme and host, and nothing below them. */
const ORIGIN = /^https:\/\/[^/\s]+$/;

/**
 * Absolute URL for a site-root-relative path on a given origin.
 *
 * `withBase` already supplies the leading slash of the deployment base, which is
 * why `socialMeta` refuses an origin that ends in one: `https://host/` + `/cv/`
 * publishes `https://host//cv/`, a URL that resolves to nothing.
 */
function absoluteUrl(origin: string, path: string): string {
  return `${origin}${withBase(path)}`;
}

/**
 * Reject anything that is not a bare https origin.
 *
 * One rule, called by both producers of an absolute page URL (`socialMeta` and
 * `canonicalUrl`) so the two can never disagree about what origin is usable.
 */
function requireOrigin(origin: string): void {
  if (!ORIGIN.test(origin)) {
    throw new Error(
      `SITE_ORIGIN must be an https origin without a path or trailing slash, got "${origin}".`,
    );
  }
}

/**
 * The canonical URL of one page, or `null` when the page has none.
 *
 * This is the single source of the page's own address: `og:url` is taken from it,
 * so the `<link rel="canonical">` and the social card cannot drift apart. It is
 * `null` for the `404.html` (`pagePath: null`) — see `socialMeta`.
 */
export function canonicalUrl({
  origin,
  pagePath,
}: {
  origin: string;
  pagePath?: string | null;
}): string | null {
  if (pagePath === null || pagePath === undefined) {
    return null;
  }

  requireOrigin(origin);
  return absoluteUrl(origin, pagePath);
}

/**
 * The `og:` and `twitter:` metadata of one page.
 *
 * `origin` is the deployment origin (`https://xexuline.github.io`), not a URL with
 * a path in it — where the site is mounted is the base's job, and the two meet
 * only here. It is validated rather than trusted because crawlers resolve
 * `og:url` and `og:image` away from the page, so a relative value is not cosmetic:
 * the card loses its image and its canonical URL.
 *
 * `pagePath` is the page's path without the base, as `LOCALE_PATH` spells it, and
 * is `null` for the single `404.html` GitHub Pages serves: an unknown URL has no
 * canonical form to advertise, and naming one would tell a crawler that the miss
 * is a duplicate of the front page. The rest of the card — title, description,
 * image — is still true of the site, so it is still emitted.
 *
 * `twitter:site` and `twitter:creator` are not emitted: no X handle is recorded
 * anywhere in this repository, and inventing one for a card would be worse than
 * the missing attribution.
 */
export function socialMeta({
  origin,
  locale,
  pagePath,
}: {
  origin: string;
  locale: Locale;
  pagePath?: string | null;
}): SocialMeta[] {
  requireOrigin(origin);

  const t = uiStrings[locale];
  const image = absoluteUrl(origin, OG_IMAGE);

  const meta: SocialMeta[] = [
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: t.ogTitle },
    { property: 'og:description', content: t.ogDescription },
  ];

  // `canonicalUrl` is the page URL: emitting anything else here would let the
  // social card and `<link rel="canonical">` name different pages.
  const url = canonicalUrl({ origin, pagePath });
  if (url !== null) {
    meta.push({ property: 'og:url', content: url });
  }

  meta.push(
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: String(OG_IMAGE_WIDTH) },
    { property: 'og:image:height', content: String(OG_IMAGE_HEIGHT) },
    { property: 'og:image:alt', content: t.ogImageAlt },
    { property: 'og:locale', content: OG_LOCALE[locale] },
  );

  // Both locales are prerendered pages of one site, so the alternates are known
  // here exactly as `Document` lists them for `<link rel="alternate">`.
  for (const alternate of SUPPORTED_LOCALES) {
    if (alternate !== locale) {
      meta.push({
        property: 'og:locale:alternate',
        content: OG_LOCALE[alternate],
      });
    }
  }

  // Twitter falls back to `og:image` when `twitter:image` is missing but states
  // its own card shape, so the pair is emitted in full instead of relying on the
  // fallback to still be there after the next edit.
  meta.push(
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:title', content: t.ogTitle },
    { property: 'twitter:description', content: t.ogDescription },
    { property: 'twitter:image', content: image },
    { property: 'twitter:image:alt', content: t.ogImageAlt },
  );

  return meta;
}
