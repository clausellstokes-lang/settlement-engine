/**
 * tests/design/contrast.test.js — WCAG 2.2 AA contrast floor for the design
 * backbone.
 *
 * The "illegible buttons" class of bug (gold-on-gold at ~2.0:1, white-on-gold
 * at ~2.4:1) lived in the shared Button primitive and the status-band palette.
 * These assertions pin the readable token pairs so a future palette edit that
 * reintroduces a failing foreground/background combination fails CI instead of
 * shipping. Thresholds per WCAG 2.2: 4.5:1 for normal text, 3:1 for UI
 * component boundaries (1.4.11).
 */

import { describe, expect, test } from 'vitest';

import {
  AMBER_BG, AMBER_DEEP, BLUE, BLUE_BG, BORDER_STRONG, CARD, GOLD, GOLD_DEEP, GOLD_SOFT,
  GOLD_TXT, GREEN, GREEN_BG, INK, PARCH, RED, RED_BG, VIOLET, VIOLET_BG, VIOLET_DEEP,
  swatch,
} from '../../src/components/theme.js';
import { BAND_COLOR } from '../../src/domain/state/bands.js';

// ── WCAG relative-luminance contrast ─────────────────────────────────────────
function channel(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
function luminance(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`contrast test expects 6-digit hex, got: ${hex}`);
  const n = parseInt(m[1], 16);
  return 0.2126 * channel((n >> 16) & 255)
    + 0.7152 * channel((n >> 8) & 255)
    + 0.0722 * channel(n & 255);
}
function ratio(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

const AA_TEXT = 4.5; // normal-size text
const AA_UI = 3.0;   // UI component boundary (1.4.11)

describe('Button variant text legibility (WCAG AA 4.5:1)', () => {
  // Each pair is the label foreground over the variant's resting fill.
  const pairs = [
    ['primary',   INK,        GOLD],      // brand CTA — ink on gold fill
    ['gold',      GOLD_TXT,   GOLD_SOFT], // tertiary/active — gold-800 on opaque soft-gold
    ['warning',   AMBER_DEEP, AMBER_BG],  // amber-700 on amber-100
    ['danger',    RED,        RED_BG],
    ['ai',        VIOLET_DEEP, VIOLET_BG],
    ['aiSolid',   '#FFFFFF',   VIOLET],     // loud violet primary — white on violet-500
    ['success',   GREEN,      GREEN_BG],
    ['info',      BLUE,       BLUE_BG],
  ];
  for (const [name, fg, bg] of pairs) {
    test(`${name}: ${fg} on ${bg} >= ${AA_TEXT}:1`, () => {
      expect(ratio(fg, bg)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  }

  test('primary no longer uses the failing white-on-gold pairing', () => {
    expect(ratio('#FFFFFF', GOLD)).toBeLessThan(AA_TEXT); // documents why we moved off it
    expect(ratio(INK, GOLD)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  // PricingPage's "Most popular" tier badge + the emphasised credit-pack
  // discount badge both render on solid GOLD. They use INK text (the house
  // recommended-badge idiom), NOT white — white-on-gold was 2.4:1 and is the
  // exact pairing the app retired in Button. Pinned so it can't creep back onto
  // the page's highest-value labels.
  test('pricing gold badges use ink-on-gold, not the failing white-on-gold', () => {
    expect(ratio(INK, GOLD)).toBeGreaterThanOrEqual(AA_TEXT);   // 7.6:1
    expect(ratio('#FFFFFF', GOLD)).toBeLessThan(AA_TEXT);       // why white is wrong here
  });
});

// PricingPage decorative gold marks (FeatureRow check, used as the sole glyph
// distinguishing an included feature) must clear the 3:1 non-text graphics
// floor on card (WCAG 1.4.11). Brand GOLD was 2.33:1; the gold-700 step clears it.
describe('Pricing decorative gold-mark legibility (WCAG 1.4.11 — 3:1 on card)', () => {
  test('GOLD_DEEP (gold-700) feature check clears the graphics floor', () => {
    expect(ratio(GOLD_DEEP, CARD)).toBeGreaterThanOrEqual(AA_UI);
  });
  test('brand GOLD would fail the graphics floor as a lone mark (documents the lift)', () => {
    expect(ratio(GOLD, CARD)).toBeLessThan(AA_UI);
  });
});

describe('Interactive border boundary (WCAG 1.4.11 — 3:1)', () => {
  test('secondary/input border is perceivable on both card and page', () => {
    expect(ratio(BORDER_STRONG, CARD)).toBeGreaterThanOrEqual(AA_UI);
    expect(ratio(BORDER_STRONG, PARCH)).toBeGreaterThanOrEqual(AA_UI);
  });
});

describe('Status-band foreground legibility on card (WCAG AA 4.5:1)', () => {
  for (const [band, hex] of Object.entries(BAND_COLOR)) {
    test(`${band} (${hex}) on card >= ${AA_TEXT}:1`, () => {
      expect(ratio(hex, CARD)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  }
});

// Settlement threat pills (SettlementPalette / DossierHeaderRow, via the shared
// threatDisplay helper). The pill is two-channel (uppercase label + tint), but the
// LABEL TEXT itself must still clear AA on the card. embattled's raw hue (#C87060)
// fails as text (3.43:1) — the helper uses the darkened #A0492F as the -text step
// while #C87060 stays the fill, the exact fill-vs-text split the rest of the app
// follows. Pinned so a future palette edit can't reintroduce the unreadable pill.
describe('Settlement threat pill text legibility (WCAG AA 4.5:1)', () => {
  const pairs = [
    ['frontier', swatch['#8C6F32']], // gold-700 text
    ['embattled', swatch['#A0492F']], // darkened terracotta text (NOT #C87060)
    ['plagued',   swatch['#A23434']], // red-600 text
  ];
  for (const [name, fg] of pairs) {
    test(`${name}: ${fg} on card >= ${AA_TEXT}:1`, () => {
      expect(ratio(fg, CARD)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  }
  test('embattled raw fill hue would fail as text (documents the split)', () => {
    expect(ratio(swatch['#C87060'], CARD)).toBeLessThan(AA_TEXT);
  });
});

// Compendium economic-text token. The lighter economic gold (#a0762a) is used
// as a FILL/border across the Compendium (tier/route accents, Tag tints) but
// fails AA as TEXT (~3.98:1 on card). The darker gold-as-text token (#7A5A1A)
// is the text/label step — Tag, category pills, and tier/route name colors all
// route through it. Pinned so a palette edit can't reintroduce the unreadable
// gold label.
describe('Compendium economic-text token legibility (WCAG AA 4.5:1)', () => {
  test('#7A5A1A clears AA on card and parchment', () => {
    expect(ratio(swatch['#7A5A1A'], CARD)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(ratio(swatch['#7A5A1A'], PARCH)).toBeGreaterThanOrEqual(AA_TEXT);
  });
  test('#a0762a would fail as text (documents the fill-vs-text split)', () => {
    expect(ratio(swatch['#A0762A'], CARD)).toBeLessThan(AA_TEXT);
  });
});

// ConfigurationPanel NearbyResources four-state chips (a11y burndown). These
// fg/bg pairs were previously inline hex outside any contrast audit; pinned here
// so the green/orange tints stay proven legible on their soft backgrounds. The
// state is also carried by a glyph + label, so colour is never the sole channel.
describe('Resource-state chip legibility (WCAG AA 4.5:1)', () => {
  const pairs = [
    ['abundant', swatch['#1A5A28'], swatch.successBg],  // green on mint
    ['depleted', swatch['#C05000'], swatch['#FFF7F0']], // orange on warm-white
  ];
  for (const [name, fg, bg] of pairs) {
    test(`${name}: ${fg} on ${bg} >= ${AA_TEXT}:1`, () => {
      expect(ratio(fg, bg)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  }
});
