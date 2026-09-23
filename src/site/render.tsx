import { renderToStaticMarkup } from 'react-dom/server';
import { LOCALE_PATH, SUPPORTED_LOCALES, type Locale } from '~/i18n/locale';
import { Document } from '~/site/Document';
import { socialMeta } from '~/site/metadata';
import { NotFoundPage } from '~/site/NotFoundPage';
import { Page } from '~/site/Page';

export interface RenderedPage {
  /** Path relative to the site base, always ending in `.html`. */
  fileName: string;
  html: string;
}

/**
 * Language of the `404.html` that GitHub Pages serves.
 *
 * A 404 carries no path to infer a locale from, and one document answers every
 * unknown URL, so it is rendered in the default language and offers the Spanish
 * front page as an explicit link — see `NotFoundPage`.
 */
const DEFAULT_404_LOCALE: Locale = 'en';

const DOCTYPE = '<!DOCTYPE html>\n';

function renderDocument(element: React.ReactElement): string {
  return DOCTYPE + renderToStaticMarkup(element);
}

/**
 * Fail the build when the finished markup contradicts itself.
 *
 * Two things drift here. `navItems` in `Page.tsx` is hand-maintained, so a new
 * `<Section>` can render without ever getting a link; and a link can outlive the
 * element it pointed at. Both produce an in-page anchor that goes nowhere, which
 * nothing else would notice before a reader clicks it.
 *
 * The check runs on the rendered string rather than on the components because
 * this is the only place that sees the finished markup of every page, and the
 * repo has no test runner — so the build is the assertion point.
 */
function assertAnchorsResolve(html: string, fileName: string): void {
  const ids = new Set(Array.from(html.matchAll(/id="([^"]+)"/g), (m) => m[1]));
  const sectionIds = new Set(
    Array.from(html.matchAll(/<section[^>]*\bid="([^"]+)"/g), (m) => m[1]),
  );
  const anchors = new Set(
    Array.from(html.matchAll(/href="#([^"]+)"/g), (m) => m[1]),
  );

  for (const anchor of anchors) {
    if (!ids.has(anchor)) {
      throw new Error(
        `<Page ${fileName}> links to "#${anchor}" but no element has that id.`,
      );
    }
  }

  for (const id of sectionIds) {
    if (!anchors.has(id)) {
      throw new Error(
        `<Page ${fileName}> renders section "${id}" with no in-page link to it. ` +
          'Add it to `navItems` in src/site/Page.tsx.',
      );
    }
  }
}

/**
 * Fail the build when a page advertises itself with a URL nothing can resolve.
 *
 * `og:url` and `og:image` are fetched by another machine, from outside the page,
 * so a relative value is not cosmetic — the card loses its canonical URL and its
 * image and nobody reports that back. A doubled slash is the other shape of the
 * same mistake: an origin that kept its trailing slash plus a base that has one
 * publishes `https://host//cv/og-image.png`, which resolves to nothing.
 */
function assertSocialUrlsAbsolute(html: string, fileName: string): void {
  for (const [, property, url] of html.matchAll(
    /property="(og:url|og:image)" content="([^"]*)"/g,
  )) {
    if (!url.startsWith('https://')) {
      throw new Error(
        `<Page ${fileName}> advertises ${property}="${url}", which is not an absolute https URL.`,
      );
    }
    if (url.slice('https://'.length).includes('//')) {
      throw new Error(
        `<Page ${fileName}> advertises ${property}="${url}": the origin and the ` +
          'deployment base both contributed a slash.',
      );
    }
  }
}

/**
 * Render every page of the site to a string.
 *
 * One page per locale, plus the `404.html` GitHub Pages serves for unknown paths.
 * `LOCALE_PATH.en` and `LOCALE_PATH.es` are directories, so both become
 * `index.html` inside them and the published URLs keep their trailing slash.
 *
 * `origin` is the deployment origin the pages are published under, and it reaches
 * `socialMeta` because a social card cannot name its own image relative to itself.
 * The `404.html` is rendered with `pagePath: null` — see `socialMeta`.
 */
export function renderPages({ origin }: { origin: string }): RenderedPage[] {
  const pages: RenderedPage[] = SUPPORTED_LOCALES.map((locale) => ({
    fileName: `${LOCALE_PATH[locale].slice(1)}index.html`,
    html: renderDocument(
      <Document
        locale={locale}
        social={socialMeta({ origin, locale, pagePath: LOCALE_PATH[locale] })}
      >
        <Page locale={locale} />
      </Document>,
    ),
  }));

  pages.push({
    fileName: '404.html',
    html: renderDocument(
      <Document
        locale={DEFAULT_404_LOCALE}
        social={socialMeta({
          origin,
          locale: DEFAULT_404_LOCALE,
          pagePath: null,
        })}
      >
        <NotFoundPage locale={DEFAULT_404_LOCALE} />
      </Document>,
    ),
  });

  for (const page of pages) {
    assertAnchorsResolve(page.html, page.fileName);
    assertSocialUrlsAbsolute(page.html, page.fileName);
  }

  return pages;
}
