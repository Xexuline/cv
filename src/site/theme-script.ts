import { SITE_BASE } from '~/site/site';
import {
  THEME_COOKIE,
  THEME_COOKIE_MAX_AGE,
  THEMES,
} from '~/lib/theme';

/**
 * The whole of this site's JavaScript, inlined into `<head>`.
 *
 * There is no bundle and nothing to hydrate: the prerendered HTML is the page.
 * This script owns exactly two things the HTML cannot do on its own — remember an
 * explicit theme choice, and offer a control that changes it.
 *
 * Order of precedence for the theme: an explicit `theme` cookie, then
 * `prefers-color-scheme`. It lives in the head so the theme lands before first
 * paint and the page never flashes the wrong colours.
 *
 * Two details are load-bearing:
 *
 * - `data-theme` is set on `<html>`, and `app.css` only reveals the toggle when
 *   that attribute is present. With JavaScript off the attribute is never set, so
 *   the theme still follows the operating system through the media query and the
 *   button is not rendered as a control that would do nothing.
 * - The click handler is delegated from `document` rather than attached to the
 *   button, because this script runs before the body exists.
 *
 * The theme cookie is scoped to the deployment base (`SITE_BASE`) rather than
 * `path=/` because GitHub Pages domains are shared by every project on them.
 * `SITE_BASE` always carries a trailing slash, so a root deployment still yields
 * `path=/`.
 */
export const THEME_SCRIPT = `(function () {
  var COOKIE = ${JSON.stringify(THEME_COOKIE)};
  var MAX_AGE = ${THEME_COOKIE_MAX_AGE};
  var PATH = ${JSON.stringify(SITE_BASE)};
  var VALID = ${JSON.stringify(THEMES)};
  var root = document.documentElement;
  var scheme = window.matchMedia('(prefers-color-scheme: light)');

  function saved() {
    var match = document.cookie.match('(?:^|; )' + COOKIE + '=([^;]*)');
    if (!match) return '';
    var value;
    try {
      value = decodeURIComponent(match[1]);
    } catch (error) {
      // A malformed percent escape elsewhere in the jar must not take the
      // whole script down: fall back to "no explicit choice" instead.
      return '';
    }
    return VALID.indexOf(value) === -1 ? '' : value;
  }

  function paint(theme) {
    root.setAttribute('data-theme', theme);
  }

  paint(saved() || (scheme.matches ? 'light' : 'dark'));

  document.addEventListener('click', function (event) {
    var trigger = event.target;
    var button = trigger && trigger.closest
      ? trigger.closest('[data-theme-toggle]')
      : null;
    if (!button) return;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    paint(next);
    var secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = COOKIE + '=' + next + '; max-age=' + MAX_AGE
      + '; path=' + PATH + '; SameSite=Lax' + secure;
  });

  scheme.addEventListener('change', function (event) {
    if (saved()) return;
    paint(event.matches ? 'light' : 'dark');
  });
})();
`;
