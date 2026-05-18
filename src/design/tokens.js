/**
 * design/tokens.js — Single source of truth for every visual value in the app.
 *
 * This is the foundation the rest of the design system stands on. Every
 * colour, font, spacing value, radius, elevation, motion curve comes from
 * here. Three big consequences:
 *
 *   1. Adding dark mode later means swapping `light` for `dark` in one
 *      `theme` map — no component changes.
 *   2. Adding a brand variant means a new theme map, not a fork of every
 *      component file.
 *   3. WCAG contrast fixes happen by editing token values, not by hunting
 *      hard-coded hex strings across 80+ components.
 *
 * The legacy flat constants in `src/components/theme.js` are now a thin
 * re-export shim pointing here. New code should import from this file or
 * read CSS custom properties (which we emit once at app boot).
 *
 * Token naming follows a tier-suffix convention:
 *   - Backgrounds get the lighter range (50, 100, 200)
 *   - Text + accents get the mid-to-dark range (500, 600, 700, 800, 900)
 *   - Lower number = lighter; higher = darker (matches Tailwind's mental
 *     model and avoids re-teaching every new contributor)
 *
 * Spec references (UI Redesign PDF):
 *   §2.1 Typography  — display/prose/ui/mono tokens
 *   §2.2 Colour      — parchment / ink / gold / muted / violet / red / green / amber
 *   §2.3 Spacing     — 8-pt grid (space-1 .. space-12)
 *   §2.3 Radius      — card / button / input
 *   §2.3 Elevation   — 1 / 2 / 3
 *   §2.4 Motion      — quick / base / page / ambient
 */

// ── Colours ────────────────────────────────────────────────────────────────
// Light theme (canonical). A dark theme can be added later by defining
// `darkColors` with the same keys and swapping which map is exported.
const lightColors = Object.freeze({
  // Parchment — page + card surfaces
  'parchment-50':  '#FBF5E6',  // page background, default card surface
  'parchment-100': '#F4EAD0',  // hover surface, subtle fill
  'parchment-200': '#E8D9B0',  // card border, dividers

  // Ink — text + dark gradient surfaces
  'ink-900': '#1B1408',  // header gradient end, primary text
  'ink-800': '#2C2210',  // header gradient start, secondary text
  'ink-600': '#4A3B22',  // tertiary text, BODY COPY (replaces legacy MUTED for body)

  // Gold — primary accent, CTAs, brand
  'gold-500': '#C9A24C',  // primary CTA, brand mark, badges
  'gold-400': '#D9B566',  // CTA hover
  'gold-700': '#8C6F32',  // active/pressed gold

  // Muted — chrome-only secondary text (NEVER body copy — fails WCAG)
  'muted-500': '#9C8068',

  // Violet — AI affordances. The single visual marker that means
  // "this surface is gated / opt-in / spends credits". Never used for
  // anything else, never collapses with gold.
  'violet-500': '#7B4FCF',
  'violet-100': '#EBE2FA',

  // Red — destructive actions and hard errors only
  'red-600': '#A23434',
  'red-100': '#F4DEDE',

  // Green — confirmation, canon-phase badge
  'green-600': '#4A7A3A',

  // Amber — warnings, drift-detected banners, founder lifetime pill
  'amber-500': '#D08020',
});

export const color = lightColors;

// ── Semantic colour aliases ─────────────────────────────────────────────────
// These map "what is this colour for" to "which raw token". When you
// change brand colours later, you change the raw tokens, not the
// semantic aliases.
export const semantic = Object.freeze({
  // Surfaces
  pageBg:        color['parchment-50'],
  cardBg:        color['parchment-50'],
  cardHover:     color['parchment-100'],
  cardBorder:    color['parchment-200'],

  // Text
  textPrimary:   color['ink-900'],
  textSecondary: color['ink-800'],
  textBody:      color['ink-600'],   // WCAG-passing body copy
  textChrome:    color['muted-500'], // chrome-only (header subtitles etc.)

  // Action
  ctaPrimary:        color['gold-500'],
  ctaPrimaryHover:   color['gold-400'],
  ctaPrimaryActive:  color['gold-700'],
  ctaAi:             color['violet-500'],
  ctaAiBg:           color['violet-100'],

  // Status
  destructive:    color['red-600'],
  destructiveBg:  color['red-100'],
  success:        color['green-600'],
  warning:        color['amber-500'],
});

// ── Typography ─────────────────────────────────────────────────────────────
// Token names follow the role (display-xl, prose-m, ui-s) rather than
// raw size. Adding a font weight or size variant means adding a token,
// not finding every place we wrote font-size: 14px inline.
export const fontFamily = Object.freeze({
  serif: '"Crimson Text", Georgia, serif',
  sans:  '"Nunito", system-ui, sans-serif',
  mono:  '"JetBrains Mono", "Fira Code", Consolas, monospace',
});

export const type = Object.freeze({
  // Display — Crimson serif, used for hero + section titles
  'display-xl': { family: fontFamily.serif, size: 40, weight: 600, lineHeight: 1.15 },
  'display-l':  { family: fontFamily.serif, size: 32, weight: 600, lineHeight: 1.2 },
  'display-m':  { family: fontFamily.serif, size: 22, weight: 600, lineHeight: 1.25 },

  // Prose — Crimson serif, used for dossier body
  'prose-l':    { family: fontFamily.serif, size: 18, weight: 400, lineHeight: 1.65, style: 'italic' },
  'prose-m':    { family: fontFamily.serif, size: 16, weight: 400, lineHeight: 1.65 },

  // UI — Nunito sans, used for chrome
  'ui-l':       { family: fontFamily.sans, size: 13, weight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' },
  'ui-m':       { family: fontFamily.sans, size: 14, weight: 600 },
  'ui-s':       { family: fontFamily.sans, size: 12, weight: 600 },

  // Mono — pipeline step IDs in "How this was simulated", JSON views
  'mono':       { family: fontFamily.mono, size: 13, weight: 400, lineHeight: 1.5 },
});

// ── Spacing (8-pt grid) ─────────────────────────────────────────────────────
export const space = Object.freeze({
  'space-1':  4,
  'space-2':  8,
  'space-3':  12,
  'space-4':  16,
  'space-5':  20,
  'space-6':  24,
  'space-7':  32,
  'space-8':  48,
  'space-9':  64,
  'space-10': 96,
  'space-11': 128,
  'space-12': 160,
});

// ── Border radius ──────────────────────────────────────────────────────────
export const radius = Object.freeze({
  card:   8,
  input:  6,
  button: 999,  // pill — matches the parchment-cartouche aesthetic
  sm:     4,
  md:     6,
  lg:     8,
  xl:     12,
});

// ── Elevation (shadow) ─────────────────────────────────────────────────────
export const elevation = Object.freeze({
  '1': '0 1px 3px rgba(27,20,8,0.08)',   // default cards
  '2': '0 4px 12px rgba(27,20,8,0.12)',  // hovered cards, sticky chrome
  '3': '0 12px 32px rgba(27,20,8,0.18)', // modals, popovers
});

// ── Motion ─────────────────────────────────────────────────────────────────
export const motion = Object.freeze({
  quick:   { duration: 120, easing: 'ease-out' },                       // hover, focus
  base:    { duration: 220, easing: 'cubic-bezier(.2,.7,.3,1)' },       // modal open, tab switch
  page:    { duration: 320, easing: 'cubic-bezier(.2,.7,.3,1)' },       // route change fade
  ambient: { duration: 600, easing: 'ease-in-out' },                    // hero parchment glow
});

// ── CSS custom property emission ────────────────────────────────────────────
// Call this once at app boot. Emits all tokens as CSS variables on the
// :root so any stylesheet can read them as `var(--color-gold-500)` etc.
// Components that import from this module get JS access; CSS gets the
// vars. Single source either way.
export function emitCssTokens(target = document.documentElement) {
  if (typeof document === 'undefined' || !target) return;
  const set = (k, v) => target.style.setProperty(k, String(v));

  for (const [k, v] of Object.entries(color))     set(`--color-${k}`, v);
  for (const [k, v] of Object.entries(semantic))  set(`--sem-${k.replace(/([A-Z])/g, '-$1').toLowerCase()}`, v);
  for (const [k, v] of Object.entries(space))     set(`--${k}`, `${v}px`);
  for (const [k, v] of Object.entries(radius))    set(`--radius-${k}`, typeof v === 'number' ? `${v}px` : v);
  for (const [k, v] of Object.entries(elevation)) set(`--elevation-${k}`, v);
}

// ── Backward-compat shim ───────────────────────────────────────────────────
// These constants mirror the legacy `src/components/theme.js` exports so
// the ~80 components that import from theme keep working unchanged. The
// shim file re-exports from here. Over time, components migrate to read
// tokens directly. Until then, both work.
export const legacy = Object.freeze({
  GOLD:     color['gold-500'],
  GOLD_B:   color['gold-400'],
  GOLD_BG:  'rgba(201,162,76,0.12)',
  INK:      color['ink-900'],
  INK_DEEP: color['ink-800'],
  MUTED:    color['muted-500'],   // unchanged — chrome only (eyebrows, subtitles)
  // BODY — new export. The WCAG-passing body-copy color. Components
  // currently using MUTED for actual prose (description text, helper
  // text, paragraph body) should migrate to this. The 4.5:1 contrast
  // ratio on parchment is what AA mandates and what MUTED fails.
  BODY:     color['ink-600'],
  SECOND:   color['ink-800'],
  BORDER:   color['parchment-200'],
  BORDER2:  '#F0E5C8',            // a lighter parchment-150
  CARD:     '#FFFBF5',            // slightly warmer than parchment-50 for cards
  PARCH:    color['parchment-50'],
  CARD_ALT: '#FAF6EF',
  CARD_HDR: '#FAF4E8',

  sans:   fontFamily.sans,
  serif_: fontFamily.serif,

  SP: { xs: space['space-1'], sm: space['space-2'], md: space['space-3'],
        lg: space['space-4'], xl: space['space-5'], xxl: space['space-6'] },
  R:  { sm: radius.sm, md: radius.md, lg: radius.lg, xl: radius.xl },
  FS: { xxs: 10, xs: 11, sm: 12, md: 13, lg: 15, xl: 17, xxl: 20, h1: 24 },
});
