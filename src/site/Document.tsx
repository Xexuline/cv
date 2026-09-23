import { HTML_LANG, LOCALE_PATH, SUPPORTED_LOCALES, type Locale } from '~/i18n/locale';
import { uiStrings } from '~/i18n/messages';
import { THEME_COLOR_META } from '~/lib/theme';
import type { SocialMeta } from '~/site/metadata';
import { withBase } from '~/site/site';
import { THEME_SCRIPT } from '~/site/theme-script';

/** Name the CSS build is required to emit; see `scripts/build-site.mjs`. */
const CSS_HREF = withBase('assets/site.css');

/**
 * The whole document, per locale.
 *
 * This markup is the finished page: nothing hydrates it, so every tag written here
 * is what the browser paints. Two consequences are load-bearing.
 *
 * The `<html lang>` and the `<title>`/description pair are taken from the locale
 * being rendered rather than from a request, so each prerendered page is correct
 * on its own — the thing a single shell could not promise.
 *
 * `theme-color` is emitted twice, once per `prefers-color-scheme`, because the
 * browser paints its chrome before any script runs. Both values still come from
 * `THEME_COLOR_META`, so they cannot drift from the palette.
 *
 * The social card arrives as `social`, already assembled by `socialMeta`, so this
 * component decides where the tags sit and nothing about what they say.
 */
export function Document({
  locale,
  social,
  children,
}: {
  locale: Locale;
  social: SocialMeta[];
  children: React.ReactNode;
}) {
  const t = uiStrings[locale];

  return (
    <html lang={HTML_LANG[locale]} className="bg-bg text-text antialiased">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <title>{t.htmlTitle}</title>
        <meta name="description" content={t.description} />
        {/* `property`, not `name`: the Open Graph and Twitter vocabularies are
            property-prefixed, colon-suffixed variants included. */}
        {social.map((meta) => (
          <meta
            key={meta.property}
            property={meta.property}
            content={meta.content}
          />
        ))}
        {(
          [
            ['light', THEME_COLOR_META.light],
            ['dark', THEME_COLOR_META.dark],
          ] as const
        ).map(([scheme, color]) => (
          <meta
            key={scheme}
            name="theme-color"
            media={`(prefers-color-scheme: ${scheme})`}
            content={color}
          />
        ))}
        <link rel="icon" type="image/svg+xml" href={withBase('favicon.svg')} />
        {/* Every page in the site is one locale and one path, so the alternates are
            known at build time and can be listed from the table instead of a
            per-route constant. */}
        {SUPPORTED_LOCALES.map((alternate) => (
          <link
            key={alternate}
            rel="alternate"
            hrefLang={alternate}
            href={withBase(LOCALE_PATH[alternate])}
          />
        ))}
        <link rel="stylesheet" href={CSS_HREF} />
        {/* Runs before first paint, so the theme lands with the first frame. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
