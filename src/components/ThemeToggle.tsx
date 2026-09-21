/**
 * Dark/light theme toggle, rendered as static markup.
 *
 * There is no state here and nothing to hydrate. The script in `theme-script.ts`
 * sets `data-theme` on `<html>` before first paint and handles clicks by
 * delegation; this component only draws the button and both of its icons.
 *
 * Which icon is visible is CSS, keyed off `[data-theme]` — see `app.css`. The same
 * selector is what makes the button appear at all: with JavaScript switched off
 * there is no `data-theme`, so the control is hidden rather than offered as a
 * button that would silently do nothing. The theme still follows the operating
 * system in that case, through a media query.
 */
export function ThemeToggle({ label }: { label: string }) {
  return (
    <button
      type="button"
      data-theme-toggle
      aria-label={label}
      className="theme-toggle h-9 w-9 items-center justify-center rounded-md border-2 border-border text-text transition-colors hover:text-accent motion-reduce:transition-none"
    >
      {/* Sun: shown while the dark theme is active. */}
      <svg
        aria-hidden="true"
        className="theme-icon-sun h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      {/* Moon: shown while the light theme is active. */}
      <svg
        aria-hidden="true"
        className="theme-icon-moon h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
