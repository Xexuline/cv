import { LOCALE_PATH, SUPPORTED_LOCALES, type Locale } from '~/i18n/locale';
import { withBase } from '~/site/site';

const LOCALE_NAMES: Record<Locale, string> = { en: 'English', es: 'Español' };

/**
 * Language picker.
 *
 * One prerendered page per locale, so this is a pair of ordinary links: no
 * JavaScript, no cookie, no reload, and crawlers reach both languages from either
 * page. `aria-current` marks the language the reader is already in.
 *
 * The link text stays in its own language rather than being translated, which is
 * the convention that lets a reader who cannot read this page still recognise
 * "Español".
 */
export function LanguageSwitcher({
  current,
  label,
}: {
  current: Locale;
  label: string;
}) {
  return (
    <nav aria-label={label} className="text-sm">
      <ul className="flex items-center gap-x-3" role="list">
        {SUPPORTED_LOCALES.map((locale) => (
          <li key={locale}>
            <a
              href={withBase(LOCALE_PATH[locale])}
              hrefLang={locale}
              aria-current={locale === current ? 'true' : undefined}
              className={
                locale === current
                  ? 'font-semibold text-text'
                  : 'text-muted underline-offset-4 hover:text-accent hover:underline'
              }
            >
              {LOCALE_NAMES[locale]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
