import { LOCALE_PATH, type Locale } from '~/i18n/locale';
import { uiStrings } from '~/i18n/messages';
import { withBase } from '~/site/site';

/**
 * Body of the static `404.html`.
 *
 * GitHub Pages serves this one document for every unknown path and cannot pick a
 * language for it, so it renders in the default locale and offers the Spanish
 * front page explicitly: a reader who mistyped a `/es/...` path is exactly the
 * reader who needs that link, and there is no server to redirect them.
 */
export function NotFoundPage({ locale }: { locale: Locale }) {
  const t = uiStrings[locale];
  const other: Locale = locale === 'en' ? 'es' : 'en';

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold text-accent">
          {t.notFound.heading}
        </h1>
        <p className="mb-6 text-muted">{t.notFound.body}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <a
            href={withBase(LOCALE_PATH[locale])}
            className="rounded-md border-2 border-border px-4 py-2 font-semibold text-text transition-colors hover:border-accent hover:text-accent motion-reduce:transition-none"
          >
            {t.notFound.home}
          </a>
          <a
            href={withBase(LOCALE_PATH[other])}
            hrefLang={other}
            className="text-muted underline underline-offset-4 hover:text-accent"
          >
            {t.notFound.otherLanguage}
          </a>
        </div>
      </div>
    </div>
  );
}
