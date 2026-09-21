export type Theme = 'light' | 'dark';

/**
 * Cookie holding an explicit user choice.
 *
 * Its absence means "follow the OS", which `app.css` resolves with a
 * `prefers-color-scheme` media query, so the correct theme is painted with
 * JavaScript switched off. Only an explicit choice needs the cookie.
 */
export const THEME_COOKIE = 'theme';

export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** The only two values the theme cookie is ever allowed to hold. */
export const THEMES = ['light', 'dark'] as const;

/**
 * Page background per theme, mirrored into `<meta name="theme-color">`.
 *
 * Two media-scoped tags are emitted from here so the browser chrome matches the
 * page before any script runs; `content` is the only place these colours exist.
 */
export const THEME_COLOR_META: Record<Theme, string> = {
  light: '#f8fafc',
  dark: '#0f172a',
};
