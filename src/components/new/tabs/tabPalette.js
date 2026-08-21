/**
 * tabPalette.js — the dossier-tab READING palette, named in one place.
 *
 * The dense dossier tabs (Overview, Economics, …) render on a parchment reading
 * surface and deliberately use a DARKER, higher-ink status palette than the app
 * chrome tokens (screen gold-500 / green-600 / red-600 are tuned for buttons and
 * badges on white, and read washed-out in a dense dossier column) — the same
 * print-legibility rationale as the PDF palette. Those darker values were, until
 * now, scattered as raw hex across the tab files, invisible to the token system and
 * to a contrast audit. This module gives the RECURRING semantic ones a single named
 * home so a re-skin or contrast pass is a one-file edit.
 *
 * Values route through the `swatch` registry (design/tokens.js) — the sanctioned
 * exact-value escape hatch — so they are lint-clean (no forked hex constants),
 * resolve-checked (tests/lint/swatchResolves.test.js), and byte-identical to the
 * literals they replace (zero rendered change). Decorative one-offs (gradients,
 * hairline borders, tint backgrounds) are NOT here yet — they remain per-site
 * pending the broader raw-hex sweep (the `no-raw-color-literal` rule stays dormant
 * until that lands).
 */
import { swatch } from '../../theme.js';

// Semantic status scale (good → critical). Used by score tiers, status tags,
// deficit/surplus, and severity accents across the tabs.
export const TAB_GOOD = swatch['#1A5A28']; // strong / viable / surplus / allied
export const TAB_WARN = swatch['#A0762A']; // fair / friction / moderate
export const TAB_WEAK = swatch['#8A4010']; // weak (amber-brown, distinct from bad)
export const TAB_BAD  = swatch['#8B1A1A']; // critical / not-viable / deficit / hostile

// Faction / service category colors (Overview institution + faction grids).
export const TAB_CATEGORY_COLORS = Object.freeze({
  government:     swatch['#2A3A7A'],
  military:       swatch['#8B1A1A'],
  economy:        swatch['#A0762A'],
  religious:      swatch['#1A5A28'],
  magic:          swatch['#5A2A8A'],
  criminal:       swatch['#4A1A4A'],
  other:          swatch['#5A4A2A'],
  Essential:      swatch['#6B5340'],
  Crafts:         swatch['#7A4A1A'],
  Infrastructure: swatch['#1A4A5A'],
  Defense:        swatch['#8B1A1A'],
  Entertainment:  swatch['#7A1A5A'],
  Adventuring:    swatch['#1A5A3A'],
});

/** Default category color for an unmapped category. */
export const TAB_CATEGORY_DEFAULT = swatch['#6B5340'];
