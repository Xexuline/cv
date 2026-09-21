#!/usr/bin/env node
/**
 * WCAG 2.x AA contrast check for cv-web themes.
 *
 * Parses color tokens from src/styles/app.css:
 *   - `:root` block            -> dark theme (default, also the no-JS fallback)
 *   - `[data-theme="light"]`   -> light theme overrides
 * and verifies every text / UI pair actually used in the UI.
 *
 * Thresholds (WCAG 2.x AA):
 *   - 4.5:1 for normal text (1.4.3)
 *   - 3.0:1 for focus outlines / UI component boundaries (1.4.11, 2.4.7)
 *
 * Pairs marked INFO are reported but never fail the run. The single INFO pair
 * (link text against the muted body copy around it) is only safe because the
 * footer links are underlined at rest: WCAG 1.4.1 accepts an underlined link at any
 * contrast, but if that underline ever goes away the ~2.1:1 colour difference is
 * not enough to separate a link from its sentence, and this script cannot see it.
 *
 * Usage: node scripts/contrast-check.mjs   (exit 0 = all pass, 1 = failures)
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(root, 'src/styles/app.css'), 'utf8');

/** Extract `--name: value` custom properties from a CSS block by selector. */
function blockVars(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  if (!m) throw new Error(`CSS block not found: ${selector}`);
  // Drop comments before splitting on ';': a comment mentioning a ratio such as
  // "3:1" would otherwise become the tail of the previous declaration and swallow
  // the custom property declared after it.
  const body = m[1].replace(/\/\*[\s\S]*?\*\//g, '');
  const vars = {};
  for (const part of body.split(';')) {
    const idx = part.indexOf(':');
    if (idx === -1) continue;
    const name = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (name.startsWith('--')) vars[name] = value;
  }
  return vars;
}

/** Parse #rgb, #rrggbb, rgb()/rgba() into [r, g, b, a]. */
function parseColor(value) {
  const v = value.trim().toLowerCase();
  let m = v.match(/^#([0-9a-f]{3})$/);
  if (m) {
    const [r, g, b] = [...m[1]].map((c) => parseInt(c + c, 16));
    return [r, g, b, 1];
  }
  m = v.match(/^#([0-9a-f]{6})$/);
  if (m) {
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  m = v.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+)\s*)?\)$/);
  if (m) {
    return [Number(m[1]), Number(m[2]), Number(m[3]), m[4] === undefined ? 1 : Number(m[4])];
  }
  throw new Error(`Unsupported color value: ${value}`);
}

/** Alpha-composite fg over bg (returns opaque [r, g, b]). */
function composite(fg, bg) {
  if (fg[3] >= 1) return [fg[0], fg[1], fg[2]];
  const a = fg[3];
  return [
    Math.round(fg[0] * a + bg[0] * (1 - a)),
    Math.round(fg[1] * a + bg[1] * (1 - a)),
    Math.round(fg[2] * a + bg[2] * (1 - a)),
  ];
}

function srgbToLinear(c) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance([r, g, b]) {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrast(fg, bg) {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

function checkTheme(name, raw) {
  const bg = parseColor(raw['--bg']);
  const token = (name_) => {
    if (raw[name_] === undefined) {
      failures.push(`${name}: missing token ${name_}`);
      return [0, 0, 0];
    }
    let [r, g, b, a] = parseColor(raw[name_]);
    if (a < 1) [r, g, b] = composite([r, g, b, a], bg); // translucent tokens sit on --bg
    return [r, g, b];
  };
  // Experience row hover surface: Tailwind `bg-surface/60` over the page background.
  const hoverRow60 = (() => {
    const [r, g, b] = parseColor(raw['--surface']);
    return composite([r, g, b, 0.6], bg);
  })();

  const pairs = [
    ['text on bg (1.4.3)', token('--text'), bg, 4.5],
    ['muted on bg (1.4.3)', token('--text-muted'), bg, 4.5],
    ['text on hover row (1.4.3)', token('--text'), hoverRow60, 4.5],
    ['muted on hover row (1.4.3)', token('--text-muted'), hoverRow60, 4.5],
    ['muted on surface (1.4.3)', token('--text-muted'), token('--surface'), 4.5],
    ['accent on bg (1.4.3)', token('--accent'), bg, 4.5],
    ['accent on hover row (1.4.3)', token('--accent'), hoverRow60, 4.5],
    ['accent on accent-dim badge (1.4.3)', token('--accent'), token('--accent-dim'), 4.5],
    ['text on surface (skip link / error page)', token('--text'), token('--surface'), 4.5],
    // --border draws the boundary of the icon-only theme toggle, the language
    // <select> and the contact links, so it is a UI boundary and not decoration.
    // The focus ring needs no equivalent pair: outline-offset is 2px, so the ring
    // is separated from --border by a gap showing the page background, and the two
    // focus pairs below are what it actually has to clear.
    ['border vs bg (1.4.11)', token('--border'), bg, 3.0],
    ['border vs surface (1.4.11)', token('--border'), token('--surface'), 3.0],
    ['focus outline vs bg (1.4.11)', token('--accent'), bg, 3.0],
    ['focus outline vs surface (1.4.11)', token('--accent'), token('--surface'), 3.0],
    ['error text on surface (1.4.3)', token('--error'), token('--surface'), 4.5],
    ['button text on accent (1.4.3)', token('--on-accent'), token('--accent'), 4.5],
    [
      'link text vs surrounding muted text (1.4.1)',
      token('--text'),
      token('--text-muted'),
      3.0,
      'informational: the footer links are underlined at rest, and that is what satisfies 1.4.1',
    ],
  ];

  let min = Infinity;
  console.log(`\n[${name}]`);
  for (const [label, fg, bgc, req, note] of pairs) {
    const c = contrast(fg, bgc);
    const ok = c >= req - 1e-9;
    const status = note ? 'INFO' : ok ? 'PASS' : 'FAIL';
    // Advisory pairs stay out of the reported minimum so they cannot hide a
    // regression in a pair that actually gates the run.
    if (!note) min = Math.min(min, c);
    console.log(`  ${status}  ${c.toFixed(2).padStart(6)}:1  (req ${req}:1)  ${label}`);
    if (note) {
      console.log(
        ok
          ? `        ^ ${note}`
          : `        ^ under ${req}:1; covered today only by the link underline`,
      );
    } else if (!ok) {
      failures.push(`${name}: ${label} = ${c.toFixed(2)}:1 < ${req}:1`);
    }
  }
  console.log(`  min pair: ${min.toFixed(2)}:1`);
}

const failures = [];
const dark = blockVars(':root');
const lightBlock = blockVars('[data-theme="light"]');
const light = { ...dark, ...lightBlock };

checkTheme('dark  ', dark);
checkTheme('light ', light);

if (failures.length) {
  console.error(`\n${failures.length} contrast failure(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('\nAll contrast checks pass (WCAG 2.x AA).');
