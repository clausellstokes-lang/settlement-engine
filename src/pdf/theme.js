/**
 * PDF design system — palette, type scale, spacing, page geometry.
 *
 * Mirrors src/components/theme.js (the on-screen palette) so the printed
 * artifact reads as an extension of the app, not a separate product.
 *
 * All measurements in PDF points (pt). 1mm = 2.83465pt; @react-pdf accepts
 * either a number (pt) or a string with unit (e.g. "16mm"). For consistency
 * we use numbers everywhere and pre-convert mm where it's natural to think
 * in mm (page margins).
 */
import { Font, StyleSheet } from '@react-pdf/renderer';

// ── Color palette ────────────────────────────────────────────────────────────
// Ported from src/components/theme.js. Hex values match the on-screen UI.
export const palette = {
  ink:     '#1c1409',  // primary text
  second:  '#3d2b1a',  // body text
  muted:   '#6b5340',  // captions, meta
  faint:   '#9c8068',  // hairline meta
  gold:    '#a0762a',  // section accents, badges
  goldBg:  '#f5ede0',  // gold tint for callouts
  card:    '#fffbf5',  // page background
  border:  '#e0d0b0',  // dividers, table borders

  // Tone accents — ported from individual tab components
  good:        '#1a5a28',   // viability ok, allied, prosperity positive
  goodBg:      '#e8f5e8',
  warn:        '#a0762a',   // friction, mid stress
  warnBg:      'rgba(160,118,42,0.08)',
  bad:         '#8b1a1a',   // critical, hostile, criminal
  badBg:       '#fde8e8',
  cool:        '#2a3a7a',   // patron/client, infrastructure
  coolBg:      '#f0f4ff',

  // AI narrative — purple lens
  ai:          '#6a2a9a',
  aiTint:      '#f4ecf8',
  aiRule:      '#8a50b0',
};

// Faction / category colors — match the tab components
export const factionColors = {
  government:    '#a0762a',
  military:      '#8b1a1a',
  economy:       '#1a5a28',
  religious:     '#2a3a7a',
  magic:         '#5a2a8a',
  criminal:      '#5a2a8a',
  infrastructure:'#3d6b8a',
  crafts:        '#7a5a1a',
  defense:       '#8b1a1a',
  entertainment: '#a06a8a',
  adventuring:   '#5a8a2a',
  other:         '#6b5340',
};

// Relationship colors
export const relColors = {
  rival:           '#8b1a1a',
  cold_war:        '#8b1a1a',
  hostile:         '#8b1a1a',
  allied:          '#1a5a28',
  secret_alliance: '#1a5a28',
  trade_partner:   '#a0762a',
  patron:          '#2a3a7a',
  client:          '#2a3a7a',
  criminal_network:'#5a2a8a',
};

// ── Font registration ────────────────────────────────────────────────────────
// Lora (open SIL) for serif body — close in feel to Georgia at print sizes,
// no licensing question. Nunito for sans labels/nav. Both pulled from Google
// Fonts CDN at build time and bundled by @react-pdf into the resulting PDF.
Font.register({
  family: 'Lora',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/lora/v32/0QIvMX1D_JOuMw_jLdNrJfh84A.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/lora/v32/0QIvMX1D_JOuMw_jLdNrIPg84A.ttf', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/lora/v32/0QIgMX1D_JOuO7HFKnKduQy8RA.ttf', fontWeight: 400, fontStyle: 'italic' },
    { src: 'https://fonts.gstatic.com/s/lora/v32/0QIgMX1D_JOuO7HFKny5tAy8RA.ttf', fontWeight: 700, fontStyle: 'italic' },
  ],
});

Font.register({
  family: 'Nunito',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/nunito/v25/XRXI3I6Li01BKofiOc5wtlZ2di8HDLshRTM9jo7eTWk.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/nunito/v25/XRXI3I6Li01BKofiOc5wtlZ2di8HDFEvRTM9jo7eTWk.ttf', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/nunito/v25/XRXI3I6Li01BKofiOc5wtlZ2di8HDDsuRTM9jo7eTWk.ttf', fontWeight: 800 },
  ],
});

// Disable hyphenation — looks bad in narrative prose and breaks names like
// "Becanahau" mid-line.
Font.registerHyphenationCallback(word => [word]);

// ── Type scale ───────────────────────────────────────────────────────────────
// Print-tuned. Body 10pt, labels 8.5pt, page heads 28pt, cover title 56pt.
export const type = {
  cover_title: { fontFamily: 'Lora', fontSize: 56, fontWeight: 700, lineHeight: 1.1, color: palette.ink },
  cover_meta:  { fontFamily: 'Nunito', fontSize: 11, color: palette.muted, letterSpacing: 1.2 },

  page_head:   { fontFamily: 'Lora', fontSize: 28, fontWeight: 700, color: palette.ink, lineHeight: 1.2 },
  section:     { fontFamily: 'Lora', fontSize: 18, fontWeight: 700, color: palette.ink, lineHeight: 1.25 },
  sub:         { fontFamily: 'Nunito', fontSize: 12, fontWeight: 800, color: palette.gold, textTransform: 'uppercase', letterSpacing: 0.8 },
  sub_alt:     { fontFamily: 'Nunito', fontSize: 11, fontWeight: 800, color: palette.muted, textTransform: 'uppercase', letterSpacing: 0.8 },

  body:        { fontFamily: 'Lora', fontSize: 10, color: palette.second, lineHeight: 1.45 },
  body_em:     { fontFamily: 'Lora', fontSize: 10, color: palette.ink, fontWeight: 700, lineHeight: 1.45 },
  prose:       { fontFamily: 'Lora', fontSize: 10.5, color: palette.second, lineHeight: 1.55 },
  italic:      { fontFamily: 'Lora', fontSize: 10, color: palette.second, fontStyle: 'italic', lineHeight: 1.5 },

  label:       { fontFamily: 'Nunito', fontSize: 8.5, color: palette.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 },
  label_em:    { fontFamily: 'Nunito', fontSize: 9.5, color: palette.ink, fontWeight: 800 },

  caption:     { fontFamily: 'Nunito', fontSize: 8, color: palette.muted, lineHeight: 1.35 },
  pill:        { fontFamily: 'Nunito', fontSize: 8.5, fontWeight: 700, letterSpacing: 0.4 },

  numeric_xl:  { fontFamily: 'Lora', fontSize: 28, fontWeight: 700, color: palette.ink, lineHeight: 1 },
  numeric:     { fontFamily: 'Lora', fontSize: 16, fontWeight: 700, color: palette.ink },
};

// ── Spacing scale ────────────────────────────────────────────────────────────
export const space = {
  xxs: 2,
  xs:  4,
  sm:  6,
  md:  10,
  lg:  16,
  xl:  24,
  xxl: 36,
  section: 28,
};

// ── Page geometry ────────────────────────────────────────────────────────────
// A4: 595.28 × 841.89 pt. Letter: 612 × 792 pt. Both portrait.
export const page = {
  A4:     { size: 'A4',     marginTop: 51, marginBottom: 62, marginH: 45 },  // ~18mm/22mm/16mm
  letter: { size: 'LETTER', marginTop: 51, marginBottom: 62, marginH: 48 },
};

// ── Shared StyleSheets ───────────────────────────────────────────────────────
export const sheet = StyleSheet.create({
  page: {
    backgroundColor: palette.card,
    paddingTop: page.A4.marginTop,
    paddingBottom: page.A4.marginBottom,
    paddingLeft: page.A4.marginH,
    paddingRight: page.A4.marginH,
    fontFamily: 'Lora',
    fontSize: 10,
    color: palette.second,
  },
  // Cover page — full bleed, no header/footer
  coverPage: {
    backgroundColor: palette.card,
    padding: 0,
  },
  row:        { flexDirection: 'row' },
  col:        { flexDirection: 'column' },
  fill:       { flex: 1 },
  rule:       { height: 0.6, backgroundColor: palette.border, marginVertical: space.md },
  ruleAccent: { height: 1, backgroundColor: palette.gold, marginVertical: space.sm },
});

// ── Convenience helpers ──────────────────────────────────────────────────────
export const tone = (k) => ({ color: palette[k] || palette.second });

// Slightly translucent background for a tone (used on Pill, Stat tiles).
// @react-pdf doesn't accept rgba in some contexts; use hex8 for safety.
export const toneBg = {
  good:  '#e8f5e8',
  warn:  '#fdf6e8',
  bad:   '#fde8e8',
  cool:  '#f0f4ff',
  ai:    '#f4ecf8',
  gold:  palette.goldBg,
  muted: '#f5f0e8',
};
