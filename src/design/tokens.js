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
  'amber-100': '#FDF4EC',
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
  successBg:      '#f0faf2',
  info:           '#2a3a7a',
  infoBg:         '#f0f4ff',
  warning:        color['amber-500'],
  warningBg:      color['amber-100'],
});

// ── Exact-value migration swatchbook (P120 / V-2 colour burn-down) ───────────
// The burn-down found ~140 distinct raw hex colours inline across the screen
// UI — a long tail of near-duplicate browns, creams, reds, greens, blues and
// purples accumulated over many phases. Consolidating them onto the curated
// palette above is a *visual* change (sub-perceptual for near-dupes, real for
// a few), so it is deferred to a separate, reviewed follow-up pass.
//
// To let `no-raw-color` go to ERROR *now* with zero rendered-pixel change,
// every such colour is routed through this map. value === the exact hex it
// replaces, so the render is byte-identical. The high-frequency, clearly
// semantic tones get readable keys; the rest are keyed by their exact hex.
// A future consolidation pass repoints keys here at curated tokens — call
// sites never change again.
export const swatch = Object.freeze({
  // Recurring tones — named for readability (exact values; consolidation deferred)
  danger: '#8b1a1a',
  dangerBg: '#fdf4f4',
  success: '#1a5a28',
  successBg: '#f0faf2',
  info: '#2a3a7a',
  infoBg: '#f0f4ff',
  magic: '#5a2a8a',
  ai: '#6a2a9a',
  white: '#ffffff',
  inkMag: '#1c1409',
  inkMag2: '#3d2b1a',
  inkMag3: '#6b5340',
  // OutputContainer JSX migration (A+ components-core.2) — exact values, zero
  // rendered change; consolidation deferred like the rest of the long tail.
  errorBgDeep: '#2d0a0a',
  errorText: '#f0a0a0',
  stressAmber: '#ffd080',
  mutedBrown: '#9c8068',
  '#4A3B22': '#4a3b22',
  '#7B4FCF': '#7b4fcf',
  // Long tail — keyed by exact hex (consolidation deferred)
  '#1A2A5A': '#1a2a5a',
  '#1A3A8B': '#1a3a8b',
  '#1A4A2A': '#1a4a2a',
  '#2A3A6A': '#2a3a6a',
  '#2A5A7A': '#2a5a7a',
  '#2A5A8A': '#2a5a8a',
  '#2A7A2A': '#2a7a2a',
  '#2D1F0E': '#2d1f0e',
  '#3A1A1A': '#3a1a1a',
  '#3A1A5A': '#3a1a5a',
  '#3A1A7A': '#3a1a7a',
  '#3A2A10': '#3a2a10',
  '#3A2F18': '#3a2f18',
  '#3A5A1A': '#3a5a1a',
  '#3A5AB0': '#3a5ab0',
  '#4A1A4A': '#4a1a4a',
  '#4A3020': '#4a3020',
  '#4A3A1A': '#4a3a1a',
  '#4A8A60': '#4a8a60',
  '#5A1A1A': '#5a1a1a',
  '#5A3010': '#5a3010',
  '#5A3A00': '#5a3a00',
  '#5A3A10': '#5a3a10',
  '#5A3A1A': '#5a3a1a',
  '#5A3A2A': '#5a3a2a',
  '#5A3E28': '#5a3e28',
  '#5A4A2A': '#5a4a2a',
  '#5A6A1A': '#5a6a1a',
  '#5A6A9A': '#5a6a9a',
  '#6B4040': '#6b4040',
  '#6B4C2A': '#6b4c2a',
  '#7A0A0A': '#7a0a0a',
  '#7A1A1A': '#7a1a1a',
  '#7A3A00': '#7a3a00',
  '#7A4AAA': '#7a4aaa',
  '#7A4F0F': '#7a4f0f',
  '#7A5010': '#7a5010',
  '#7A5A1A': '#7a5a1a',
  '#7A5A2A': '#7a5a2a',
  '#7A6440': '#7a6440',
  '#7C3AED': '#7c3aed',
  '#8A2A2A': '#8a2a2a',
  '#8A3010': '#8a3010',
  '#8A3434': '#8a3434',
  '#8A5010': '#8a5010',
  '#8A5050': '#8a5050',
  '#8A50B0': '#8a50b0',
  '#8A5A20': '#8a5a20',
  '#8A6020': '#8a6020',
  '#8A8A8A': '#8a8a8a',
  '#8B3000': '#8b3000',
  '#8B3A1A': '#8b3a1a',
  '#991B1B': '#991b1b',
  '#A070C0': '#a070c0',
  '#A0762A': '#a0762a',
  '#A08060': '#a08060',
  '#B8860B': '#b8860b',
  '#BBBBBB': '#bbbbbb',
  '#C04040': '#c04040',
  '#C05000': '#c05000',
  '#C05010': '#c05010',
  '#C0CCE8': '#c0cce8',
  '#C49A3C': '#c49a3c',
  '#C54A4A': '#c54a4a',
  '#C88A8A': '#c88a8a',
  '#C8A0F0': '#c8a0f0',
  '#C8B098': '#c8b098',
  '#C8ECD4': '#c8ecd4',
  '#D0B880': '#d0b880',
  '#D0C0A8': '#d0c0a8',
  '#D4C4A0': '#d4c4a0',
  '#D8ECD8': '#d8ecd8',
  '#E0C080': '#e0c080',
  '#E0F0E0': '#e0f0e0',
  '#E0F0E4': '#e0f0e4',
  '#E2EEDB': '#e2eedb',
  '#E7D7B8': '#e7d7b8',
  '#E8D8B0': '#e8d8b0',
  '#E8D8C0': '#e8d8c0',
  '#E8DCC8': '#e8dcc8',
  '#E8E0D4': '#e8e0d4',
  '#E8ECFF': '#e8ecff',
  '#E8EEFF': '#e8eeff',
  '#E8F0E8': '#e8f0e8',
  '#E8F5EC': '#e8f5ec',
  '#EDE3CC': '#ede3cc',
  '#EEF0FF': '#eef0ff',
  '#F0D8FF': '#f0d8ff',
  '#F0E0F0': '#f0e0f0',
  '#F0E4C0': '#f0e4c0',
  '#F0E8D8': '#f0e8d8',
  '#F0EAD8': '#f0ead8',
  '#F0EBFF': '#f0ebff',
  '#F0F4E0': '#f0f4e0',
  '#F0F4FD': '#f0f4fd',
  '#F0FAF4': '#f0faf4',
  '#F4E4FF': '#f4e4ff',
  '#F4F6FD': '#f4f6fd',
  '#F4FAF4': '#f4faf4',
  '#F5E8C0': '#f5e8c0',
  '#F5EDE0': '#f5ede0',
  '#F5F0E8': '#f5f0e8',
  '#F7F0E4': '#f7f0e4',
  '#F8F0FC': '#f8f0fc',
  '#F8F0FF': '#f8f0ff',
  '#F8F4EE': '#f8f4ee',
  '#F8F4FD': '#f8f4fd',
  '#F8F4FF': '#f8f4ff',
  '#F8F9FF': '#f8f9ff',
  '#F9F3E8': '#f9f3e8',
  '#FAF6EE': '#faf6ee',
  '#FAF8F4': '#faf8f4',
  '#FDE8E8': '#fde8e8',
  '#FDEBEC': '#fdebec',
  '#FDF0E0': '#fdf0e0',
  '#FDF0E8': '#fdf0e8',
  '#FDF0F0': '#fdf0f0',
  '#FDF4EC': '#fdf4ec',
  '#FDF4F0': '#fdf4f0',
  '#FDF8E8': '#fdf8e8',
  '#FDF8EC': '#fdf8ec',
  '#FDF8EE': '#fdf8ee',
  '#FDF8F0': '#fdf8f0',
  '#FEF9EE': '#fef9ee',
  '#FFCFCF': '#ffcfcf',
  '#FFF0E0': '#fff0e0',
  '#FFF3ED': '#fff3ed',
  '#FFF7EC': '#fff7ec',
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

// ── Layout (page content widths) ─────────────────────────────────────────────
// Single source of truth for how wide page content runs on desktop. Before
// this, every top-level page hard-coded its own centered max-width (440 / 680 /
// 760 / 860 / 960 / 1100 …), so the site read as arbitrary and felt narrow on
// wide monitors — a ~860px column on a 2000px screen leaves ~570px of painting
// dead on each side.
//
//   page  — the shared cap for content / reference / marketing pages. Wide
//           enough to use a large monitor, capped so it still reads as a
//           framed document on the parchment rather than a full-bleed app.
//   prose — comfortable single-column reading width for long-form text that
//           lives *inside* a `page`-wide container (keeps line length sane
//           even when the surrounding card is wide).
//   form  — genuine single-task forms (sign-in / sign-up / success). These
//           stay narrow on purpose; a 1200px-wide login form is bad UX.
export const layout = Object.freeze({
  page:  1200,
  prose: 820,
  form:  460,
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

  // Flat aliases for palette colours that previously had only dashed keys
  // (color['violet-500'] etc.). Added in the P120 / V-2 colour burn-down so
  // exact-match call sites can route through a flat name like the rest.
  VIOLET:    color['violet-500'],
  VIOLET_BG: color['violet-100'],
  RED:       color['red-600'],
  RED_BG:    color['red-100'],
  GREEN:     color['green-600'],
  GREEN_BG:  semantic.successBg,
  AMBER:     color['amber-500'],
  AMBER_BG:  semantic.warningBg,
  BLUE:      semantic.info,
  BLUE_BG:   semantic.infoBg,
  GOLD_DEEP: color['gold-700'],
  PARCH_100: color['parchment-100'],

  sans:   fontFamily.sans,
  serif_: fontFamily.serif,

  SP: { xs: space['space-1'], sm: space['space-2'], md: space['space-3'],
        lg: space['space-4'], xl: space['space-5'], xxl: space['space-6'] },
  R:  { sm: radius.sm, md: radius.md, lg: radius.lg, xl: radius.xl },
  // pico/nano/micro extend the scale below xxs for the dense micro-typography
  // (badges, pills, eyebrows) the app legitimately uses. Ordered by SI magnitude
  // (pico < nano < micro < …) so 7 < 8 < 9 reads correctly. Added in P140 so the
  // ~400 raw sub-10px sizes have exact tokens to migrate to (zero visual change).
  //
  // The half-step and gap/display sizes below were added in the visual-budget
  // burn-down (P120 close-out) so EVERY raw inline fontSize in the screen UI has
  // an exact token to route through — keyed by size so the migration is
  // pixel-identical (zero visual change). The curated t-shirt steps above remain
  // the preferred vocabulary for new code; a future pass can consolidate the
  // dense legacy sizes onto them. Until then these let the no-raw-fontsize rule
  // go to error without changing a single rendered pixel.
  FS: {
    pico: 7, nano: 8, micro: 9, xxs: 10, xs: 11, sm: 12, md: 13, lg: 15, xl: 17, xxl: 20, h1: 24,
    '7.5': 7.5, '8.5': 8.5, '9.5': 9.5, '10.5': 10.5, '11.5': 11.5, '12.5': 12.5, '13.5': 13.5,
    '14': 14, '14.5': 14.5, '16': 16, '18': 18, '22': 22, '26': 26, '28': 28, '32': 32, '36': 36,
  },
  // ELEV — the 3-tier elevation (box-shadow) scale, exposed to legacy
  // importers. 1 = default cards, 2 = hover/sticky chrome, 3 = modals/popovers.
  // Added in P141/V-4 so components stop inventing bespoke shadows.
  ELEV: elevation,

  // Layout — shared page content widths (see `layout` above). Added so every
  // top-level page references one cap instead of inventing its own narrow
  // column. PAGE_MAX for content pages, PROSE_MAX for reading columns inside
  // them, FORM_MAX for genuine forms that should stay narrow.
  PAGE_MAX:  layout.page,
  PROSE_MAX: layout.prose,
  FORM_MAX:  layout.form,
});
