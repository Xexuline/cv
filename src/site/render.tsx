import { renderToStaticMarkup } from 'react-dom/server';
import { LOCALE_PATH, SUPPORTED_LOCALES, type Locale } from '~/i18n/locale';
import { Document } from '~/site/Document';
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
 * Render every page of the site to a string.
 *
 * One page per locale, plus the `404.html` GitHub Pages serves for unknown paths.
 * `LOCALE_PATH.en` and `LOCALE_PATH.es` are directories, so both become
 * `index.html` inside them and the published URLs keep their trailing slash.
 */
export function renderPages(): RenderedPage[] {
  const pages: RenderedPage[] = SUPPORTED_LOCALES.map((locale) => ({
    fileName: `${LOCALE_PATH[locale].slice(1)}index.html`,
    html: renderDocument(
      <Document locale={locale}>
        <Page locale={locale} />
      </Document>,
    ),
  }));

  pages.push({
    fileName: '404.html',
    html: renderDocument(
      <Document locale={DEFAULT_404_LOCALE}>
        <NotFoundPage locale={DEFAULT_404_LOCALE} />
      </Document>,
    ),
  });

  for (const page of pages) {
    assertAnchorsResolve(page.html, page.fileName);
  }

  return pages;
}
