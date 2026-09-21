/**
 * The two locales the site is built for.
 *
 * There is deliberately no `isLocale` guard: nothing reads a locale from a URL, a
 * cookie or `Accept-Language` anymore. One page is rendered per entry of
 * `SUPPORTED_LOCALES`, so the locale is always one of these by construction, and an
 * untrusted value never enters the system.
 */
export type Locale = 'en' | 'es';

export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'es'];

/**
 * Value for the document `lang` attribute.
 *
 * More specific than the app's own locale keys so assistive tech picks a regional
 * voice; the route segments and the `cv` map keep using the short keys. `es-ES`
 * because the copy is written for Spain.
 */
export const HTML_LANG: Record<Locale, string> = {
  en: 'en',
  es: 'es-ES',
};

/**
 * Public path for a locale, without the site base.
 *
 * Each locale is its own prerendered page, so switching language is a plain link
 * and needs no JavaScript, no cookie and no reload. English is the site root.
 */
export const LOCALE_PATH: Record<Locale, string> = {
  en: '/',
  es: '/es/',
};
