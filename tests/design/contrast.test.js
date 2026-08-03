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
  AMBER_BG, AMBER_DEEP, BLUE, BLUE_BG, BODY, BORDER, BORDER_STRONG, CARD, FLETCH_BARB,
  FLETCH_BARB_LIFT, FLETCH_BROWN, FLETCH_BROWN_LIFT, GILT, GILT_ACTIVE,
  GOLD, GOLD_DEEP, GOLD_SOFT,
  GOLD_TXT, GREEN, GREEN_BG, GREEN_DEEP, INK, MUTED, PARCH, PARCH_100, RED, RED_BG, SECOND,
  SHAFT, SHAFT_GRAIN, SHAFT_GRAIN_DEEP, SHAFT_RULE, SLATE, SLATE_BG, SLATE_DEEP,
  swatch,
} from '../../src/components/theme.js';
// THE LIVING BACKDROP wash strength — imported (not hard-coded) so raising the
// backdrop opacity re-runs this contrast proof against the new value.
import { WASH_INK_OPACITY } from '../../src/components/settlementDetail/SettlementDossierBackdrop.jsx';
// THE ORGANIC CRAFT ink ramp + rubric (design/organic/*). Imported DIRECTLY, never
// via the theme.js shim — the whole organic layer is lazy and must stay out of the
// first-paint static closure (the shim is eager). Every text step owes AA at the
// letterform on the DARKEST paper tone it sits on (PARCH_100 light / the field panel
// dim); the decorative hairline is pinned as a negative control (fails as text).
import { INK as OINK, FIELD_INK, INK_TEXT_STEPS, FIELD_TEXT_STEPS } from '../../src/design/organic/ink.js';
import { RUBRIC, FIELD_RUBRIC } from '../../src/design/organic/rubrication.js';
import { INSTRUMENT, FIELD_INSTRUMENT } from '../../src/design/organic/instruments.js';
// THE LANTERN TABLE (C14) — the four lamp-tone kind accents (moss/gold/slate/ember)
// worn by TableView on its umber field ground; pinned per-state below.
import { LAMP_ACCENTS } from '../../src/design/organic/lampTones.js';
// Badge primitive (src/components/primitives/Badge.jsx) tinted tones. The gold /
// warning / ai tones previously coloured their LABEL with the -500 fill hue
// (GOLD / AMBER / SLATE), which failed AA as text on their soft tints. They now
// use the darker text steps (GOLD_TXT, AMBER_DEEP, SLATE_DEEP). Pinned so a
// future edit can't drop the label back onto its fill hue. GOLD_BG is a
// translucent rgba over varying surfaces, so the gold tone is checked against its
// opaque soft-gold reference (GOLD_SOFT), the worst-case lightest backing.
import { BAND_COLOR } from '../../src/domain/state/bands.js';
// THE ILLUSTRATED TOWN (IT-2) — the GROUND DRESS marks (groundDress.js) drawn under the
// illustrated lens. The marks are non-text GRAPHICS (WCAG 1.4.11 → 3:1) whose legibility
// is carried by the ink colour at full strength (opacity is a texture-density choice, the
// engraver's idiom — exactly like the organic hairline / landform stipple). The accessible
// lens deliberately names NO dress field, so it never renders them — its byte-identity +
// colourblind-safe contract is untouched. Imported directly (the lazy town-map surface).
import { resolveTownMapStyle, ILLUSTRATED_STYLE_ID, TOWN_MAP_STYLE_IDS } from '../../src/design/townMapStyles.js';
import { groundDressOps } from '../../src/domain/townMap/groundDress.js';
import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';
import { semantic } from '../../src/design/tokens.js';

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

describe('Operator unread badge legibility (WCAG AA 4.5:1)', () => {
  test('white numeral clears AA on the named chrome-alert token', () => {
    expect(ratio(swatch.white, semantic.operatorAlert)).toBeGreaterThanOrEqual(AA_TEXT);
  });
});

describe('Button variant text legibility (WCAG AA 4.5:1)', () => {
  // Each pair is the label foreground over the variant's resting fill.
  const pairs = [
    ['primary',   INK,        GOLD],      // brand CTA — ink on gold fill
    ['gold',      GOLD_TXT,   GOLD_SOFT], // tertiary/active — gold-800 on opaque soft-gold
    ['warning',   AMBER_DEEP, AMBER_BG],  // amber-700 on amber-100
    ['danger',    RED,        RED_BG],
    ['ai',        SLATE_DEEP, SLATE_BG],
    ['aiSolid',   '#FFFFFF',   SLATE],     // loud AI primary — white on slate-500
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

describe('Badge tinted-tone text legibility (WCAG AA 4.5:1)', () => {
  const pairs = [
    ['gold',    GOLD_TXT,    GOLD_SOFT], // gold-800 on opaque soft-gold (GOLD_BG backing)
    ['warning', AMBER_DEEP,  AMBER_BG],  // amber-700 on amber-100
    ['ai',      SLATE_DEEP, SLATE_BG], // slate-700 on slate-100
  ];
  for (const [name, fg, bg] of pairs) {
    test(`${name}: ${fg} on ${bg} >= ${AA_TEXT}:1`, () => {
      expect(ratio(fg, bg)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  }
  test('the retired fill-hue labels would fail as text (documents the split)', () => {
    expect(ratio(GOLD, GOLD_SOFT)).toBeLessThan(AA_TEXT);
    expect(ratio(SLATE, SLATE_BG)).toBeLessThan(AA_TEXT);
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

// ServicesTab per-state tints (C4c-h — the state-tint contrast pass). The
// impaired/reduced/missing status pills + the category-health grid were re-
// grounded off the SaaS alert fills (bright pink/peach/cream) and the cool mint
// 'healthy' wash onto the WARM PARCHMENT family, per the C4c-e recipe (impaired→
// oxblood, reduced→amber-deep, missing→gold, healthy→warm parchment). The state
// rides the INK: oxblood text for impaired, amber-deep for reduced, gold for
// missing, neutral ink for healthy — and each pill/cell also carries a bold
// status WORD (and the grid/cards a left rule), so colour is never the sole
// channel. These pin the fg text over each new parchment fill at AA as text.
describe('ServicesTab state-tint text legibility (WCAG AA 4.5:1)', () => {
  const pairs = [
    ['impaired', swatch['#7A1A1A'], swatch['#F4DEDE']], // oxblood on warm rose-parchment
    ['reduced',  swatch['#7A3A00'], swatch['#FBEAD0']], // amber-deep on warm amber-parchment
    ['missing',  swatch['#7A5010'], swatch['#F0E4C0']], // gold on warm gold-parchment
    ['healthy',  swatch.inkMag3,    swatch['#F0EAD8']], // neutral ink on warm parchment
  ];
  for (const [name, fg, bg] of pairs) {
    test(`${name}: ${fg} on ${bg} >= ${AA_TEXT}:1`, () => {
      expect(ratio(fg, bg)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  }
  // The missing card's darker body ink + the grid's near-black category title
  // clear AA a fortiori on their fills (documents the headroom above the floor).
  test('missing card body ink + grid title clear AA on their fills', () => {
    expect(ratio(swatch['#5A3A10'], swatch['#F0E4C0'])).toBeGreaterThanOrEqual(AA_TEXT);
    expect(ratio(swatch.inkMag, swatch['#F4DEDE'])).toBeGreaterThanOrEqual(AA_TEXT);
  });
});

// ── THE ORGANIC CRAFT ink tonal ramp (law §3/§6) ─────────────────────────────
// The ramp replaces drop-shadow hierarchy with graded ink on parchment. Each
// TEXT step is measured against PARCH_100 (#F4EAD0) — the darkest paper tone a
// glyph sits on — so the floor holds on every surface, with headroom above 4.5
// reserved for a future grain overlay. The `hairline` step is the sole non-text
// tone (a feint receding rule); it is pinned as a negative control that would
// fail AS text, documenting the split exactly like the app's fill-vs-text tokens.
describe('Organic ink ramp text legibility (WCAG AA 4.5:1 on the darkest ground)', () => {
  for (const step of INK_TEXT_STEPS) {
    test(`ink.${step} (${OINK[step]}) on parchment-100 >= ${AA_TEXT}:1`, () => {
      expect(ratio(OINK[step], PARCH_100)).toBeGreaterThanOrEqual(AA_TEXT);
      // and on the two lighter grounds, a fortiori
      expect(ratio(OINK[step], CARD)).toBeGreaterThanOrEqual(AA_TEXT);
      expect(ratio(OINK[step], PARCH)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  }
  test('the feint hairline is a decorative rule tone, not text (documents the split)', () => {
    expect(ratio(OINK.hairline, PARCH_100)).toBeLessThan(AA_TEXT);
  });
});

// ── THE RUBRIC (law §3) — one reserved accent, AA as text ────────────────────
// Rubric tones ("the interface speaking") are used for section labels / do-this
// instructions / the current entry, so they carry text and owe AA on the darkest
// paper tone. The oxblood is deliberately distinct from the destructive red-600
// (that hue owns errors); both channels stay legible and separate.
describe('Organic rubric text legibility (WCAG AA 4.5:1)', () => {
  for (const [role, hex] of Object.entries(RUBRIC)) {
    test(`rubric.${role} (${hex}) on parchment-100 >= ${AA_TEXT}:1`, () => {
      expect(ratio(hex, PARCH_100)).toBeGreaterThanOrEqual(AA_TEXT);
      expect(ratio(hex, CARD)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  }
  test('rubric oxblood is a distinct hue from the destructive red-600', () => {
    expect(RUBRIC.rubric).not.toBe(RED);
  });
});

// ── FIELD MODE (dim) legibility — warm ink on warm dark gray (law §6) ─────────
// The field notebook's own ramp: off-white-ish ink on a warm dark ground, never
// pure white on pure black (halation). Text steps + rubric owe AA against the
// darkest field ground text sits on (the lifted panel).
describe('Organic FIELD mode legibility (WCAG AA 4.5:1 on the warm dark panel)', () => {
  for (const step of FIELD_TEXT_STEPS) {
    test(`fieldInk.${step} (${FIELD_INK[step]}) on the field panel >= ${AA_TEXT}:1`, () => {
      expect(ratio(FIELD_INK[step], FIELD_INK.panel)).toBeGreaterThanOrEqual(AA_TEXT);
      expect(ratio(FIELD_INK[step], FIELD_INK.ground)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  }
  for (const [role, hex] of Object.entries(FIELD_RUBRIC)) {
    test(`fieldRubric.${role} (${hex}) on the field panel >= ${AA_TEXT}:1`, () => {
      expect(ratio(hex, FIELD_INK.panel)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  }
  test('the field ground is warm, not pure black (halation rule)', () => {
    expect(FIELD_INK.ground).not.toBe('#000000');
    expect(FIELD_INK.ink).not.toBe('#FFFFFF');
  });
});

// ── THE LANTERN TABLE (C14) — the four lamp-tone kind accents on the umber ground ─
// TableView is the dim "desk by night" (reference plate 04): the four cheat-sheet
// kinds (NPC / HOOK / TWIST / RED) are accented with LAMP TONES (moss / gold / slate
// / ember) instead of the light-theme saturated hues. Each tone is used BOTH as the
// KIND label (owes AA 4.5:1 as text) and as the card's left rule (owes 1.4.11's 3:1
// UI-boundary floor). The ground is FIELD_INK.panel — the lifted umber plate, the
// darkest tone a lamp label sits on; the desk behind it (FIELD_INK.ground) is darker
// still, so the tones clear there a fortiori. slate supersedes the violet TWIST accent
// on this surface (the honesty law's AI hue, cooled to a lamp tone for the field).
describe('THE LANTERN TABLE lamp-tone kind accents (WCAG AA 4.5:1 on the umber field ground)', () => {
  const pairs = [
    ['NPC / moss',    LAMP_ACCENTS.NPC],
    ['HOOK / gold',   LAMP_ACCENTS.HOOK],
    ['TWIST / slate', LAMP_ACCENTS.TWIST],
    ['RED / ember',   LAMP_ACCENTS.RED],
  ];
  for (const [name, hex] of pairs) {
    test(`${name} (${hex}) label on the umber panel >= ${AA_TEXT}:1`, () => {
      expect(ratio(hex, FIELD_INK.panel)).toBeGreaterThanOrEqual(AA_TEXT); // as label text
      expect(ratio(hex, FIELD_INK.panel)).toBeGreaterThanOrEqual(AA_UI);   // as the card's left rule (1.4.11)
      expect(ratio(hex, FIELD_INK.ground)).toBeGreaterThanOrEqual(AA_TEXT); // on the darker desk, a fortiori
    });
  }
  // The retired accents documented: brand amber failed AA as a label even on white
  // (3.09:1) — the exact deferral the lamp tones pay by re-grounding onto the umber.
  test('the retired saturated amber accent would fail AA as a label even on white (documents the lift)', () => {
    expect(ratio(swatch['#D08020'], '#FFFFFF')).toBeLessThan(AA_TEXT);
  });
});

// ── HomeSampleDossier callout eyebrows (a11y-3 / content-1) ───────────────────
// The three 9px uppercase eyebrows on the public landing sample-dossier card
// read in the darker -700 INK of their accent hue (bright accent kept only for
// the left border, a UI boundary with no text floor). Pins the AA lift so a
// future edit can't drop the eyebrow text back onto its sub-AA -500/-600 accent.
describe('HomeSampleDossier eyebrows — WCAG AA at 9px', () => {
  const EYEBROWS = [
    ['newDm green ink', GREEN_DEEP, '#E2EEDB'],
    ['worldbuilder slate ink', SLATE_DEEP, '#E4E9EE'],
    ['fridaysSession amber ink', AMBER_DEEP, '#FBEAD0'],
  ];
  for (const [name, ink, bg] of EYEBROWS) {
    test(`${name}: ${ink} on ${bg} >= ${AA_TEXT}:1`, () => {
      expect(ratio(ink, bg)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  }
  test('the bright accents (used for the border only) would FAIL AA as eyebrow text — documents the lift', () => {
    expect(ratio(GREEN, '#E2EEDB')).toBeLessThan(AA_TEXT);
    expect(ratio(SLATE, '#E4E9EE')).toBeLessThan(AA_TEXT);
    expect(ratio(swatch['#D08020'], '#FBEAD0')).toBeLessThan(AA_TEXT);
  });
});

// ── THE INSTRUMENT FILLS — legible at EVERY state, light + field (§2/§6) ──────
// Ornamented/quiet controls owe three contrasts per state (label/fill, boundary/
// ground, focus/landing). These pin the label/fill and boundary/ground floors for
// the instrument register's fills in both modes, so a machined control is always
// readable — the per-state validation the depth standard demands, not a screenshot.
describe('Organic instrument fills — legible at every state (WCAG AA / 1.4.11)', () => {
  test('quiet fill: ink on fill clears AA', () => {
    expect(ratio(INSTRUMENT.ink, INSTRUMENT.fill)).toBeGreaterThanOrEqual(AA_TEXT);
  });
  test('primary fill: ink on the gold primary clears AA (never white-on-gold)', () => {
    expect(ratio(INSTRUMENT.primaryInk, INSTRUMENT.primary)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(ratio('#FFFFFF', INSTRUMENT.primary)).toBeLessThan(AA_TEXT); // documents the retired pairing
  });
  test('instrument boundary is perceivable on card + page (1.4.11)', () => {
    expect(ratio(INSTRUMENT.border, CARD)).toBeGreaterThanOrEqual(AA_UI);
    expect(ratio(INSTRUMENT.border, PARCH)).toBeGreaterThanOrEqual(AA_UI);
  });
  test('FIELD quiet + primary fills clear AA on the dark ground', () => {
    expect(ratio(FIELD_INSTRUMENT.ink, FIELD_INSTRUMENT.fill)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(ratio(FIELD_INSTRUMENT.primaryInk, FIELD_INSTRUMENT.primary)).toBeGreaterThanOrEqual(AA_TEXT);
  });
  test('FIELD boundary is perceivable on the field ground + panel (1.4.11)', () => {
    expect(ratio(FIELD_INSTRUMENT.border, FIELD_INK.ground)).toBeGreaterThanOrEqual(AA_UI);
    expect(ratio(FIELD_INSTRUMENT.border, FIELD_INK.panel)).toBeGreaterThanOrEqual(AA_UI);
  });
});

// ── THE LIVING BACKDROP wash (LB-c) — dossier text stays AA over the map ink wash ──
// The library dossier's background is the last-viewed town map: a parchment layer
// with the map SVG painted at WASH_INK_OPACITY on top. The darkest a wash pixel can
// ever get is the map's darkest ink over parchment at that opacity. Model the worst
// case conservatively as PURE BLACK (darker than any lens tone) composited over
// PARCH, and prove the dossier's heading (INK) and body (BODY) copy still clear AA
// over it. MUTED is pinned as the negative control: it is chrome-only and fails as
// body over the wash exactly as it does on plain parchment — the backdrop never
// carries MUTED body text, so this documents the split, it does not gate it.
/** Alpha-composite `top` over `bottom` at `alpha` → the effective background hex. */
function composite(top, bottom, alpha) {
  const t = parseInt(top.slice(1), 16);
  const b = parseInt(bottom.slice(1), 16);
  const mix = (sh) => Math.round(alpha * ((t >> sh) & 255) + (1 - alpha) * ((b >> sh) & 255));
  return `#${[mix(16), mix(8), mix(0)].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

describe('THE LIVING BACKDROP wash — dossier text legibility over the map ink wash', () => {
  // Worst case: a fully-black map pixel washed over parchment at the wash opacity.
  const washFloor = composite('#000000', PARCH, WASH_INK_OPACITY);

  test(`heading ink (INK) clears AA over the wash @ opacity ${WASH_INK_OPACITY}`, () => {
    expect(ratio(INK, washFloor)).toBeGreaterThanOrEqual(AA_TEXT);
  });
  test('body copy (BODY) clears AA over the wash', () => {
    // BODY already owes AA on plain parchment; the wash only nudges the ground
    // darker, so proving it here proves the whole read surface holds.
    expect(ratio(BODY, PARCH)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(ratio(BODY, washFloor)).toBeGreaterThanOrEqual(AA_TEXT);
  });
  test('the wash opacity is faint (a ghost, not a background image)', () => {
    // A guard on the taste value itself: a wash strong enough to threaten body
    // contrast would be a design regression, caught here before it ships.
    expect(WASH_INK_OPACITY).toBeLessThanOrEqual(0.15);
  });
  test('MUTED is chrome-only — it fails as body over the wash (documents the split)', () => {
    expect(ratio(MUTED, washFloor)).toBeLessThan(AA_TEXT);
  });
});

// ── THE ILLUSTRATED TOWN — GROUND DRESS legibility + colour-vision safety (IT-2) ─────
// The dress marks (farm furrows / woods stipple / water ripples / meadow / hedges / wall
// shadows / relief) are decorative GRAPHICS, so they owe the 3:1 non-text floor (1.4.11)
// at the mark's ink strength on the illustrated ground — comfortably cleared, with text-AA
// headroom (the low dress OPACITY is a deliberate texture-density choice, not a contrast
// failure, exactly like the organic hairline / landform stipple). And the marks carry ONLY
// the ink — never a district or water hue — so colour is NEVER the sole channel (pattern is
// the discriminator, colourblind-safe by construction). The accessible lens names no dress
// field, so it renders NONE of this and its palette contract is untouched.
describe('Illustrated ground-dress legibility (WCAG 1.4.11 — 3:1 graphics on the ground)', () => {
  const il = resolveTownMapStyle(ILLUSTRATED_STYLE_ID);
  test('dress ink clears the graphics floor on the illustrated ground (with AA headroom)', () => {
    expect(ratio(il.palette.ink, il.background)).toBeGreaterThanOrEqual(AA_UI);
    expect(ratio(il.palette.ink, il.background)).toBeGreaterThanOrEqual(AA_TEXT); // 14.4:1 — ample
  });

  test('every dress mark carries only the ink — colour is never the sole channel', () => {
    const model = buildTownMapModel(makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'dress-contrast' }));
    const ops = groundDressOps(model, ILLUSTRATED_STYLE_ID);
    expect(ops.length).toBeGreaterThan(0);
    for (const o of ops) {
      if (o.stroke != null) expect(o.stroke).toBe(il.palette.ink);
      if (o.fill != null) expect(o.fill).toBe(il.palette.ink);
    }
  });

  test('the accessible lens names NO dress field ⇒ renders zero dress (byte-identical, a11y-safe)', () => {
    const acc = resolveTownMapStyle('accessible');
    expect(acc.opacity.dress).toBeUndefined();
    expect(acc.stroke.dress).toBeUndefined();
    const model = buildTownMapModel(makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'dress-acc' }));
    expect(groundDressOps(model, 'accessible')).toEqual([]);
    // and no re-skin lens names it either (only the illustrated lens dresses the ground)
    for (const id of TOWN_MAP_STYLE_IDS) expect(resolveTownMapStyle(id).opacity.dress).toBeUndefined();
  });

  // IT-3 — the SEASON + STATE marks (snow fleck / bare tree / harvest stubble / parched crack /
  // siege ring / scar grain / rebirth scaffold) are the SAME engraver's register: all-ink, so the
  // discriminator is PATTERN, never colour (colourblind-safe by construction), and each clears the
  // 3:1 graphics floor at the ink strength. The accessible lens stays dress-free EVEN WITH a full
  // season+state context (byte-identical, a11y-safe) — the dormancy law holds at the dress fields.
  test('every SEASON + STATE mark carries only the ink (pattern, not colour, is the channel)', () => {
    const model = buildTownMapModel(makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'dress-season' }));
    const cats = [...new Set((model.districts || []).map((d) => d.category))];
    const full = { season: 'winter', severity: 'hard_winter', state: { besieged: true, scarLevel: 1, rebuiltCategories: cats } };
    for (const dress of [{ season: 'winter' }, { season: 'autumn' }, { season: 'summer', severity: 'drought' }, full]) {
      const ops = groundDressOps(model, ILLUSTRATED_STYLE_ID, dress);
      expect(ops.length).toBeGreaterThan(0);
      for (const o of ops) {
        if (o.stroke != null) expect(o.stroke).toBe(il.palette.ink);
        if (o.fill != null) expect(o.fill).toBe(il.palette.ink);
      }
    }
  });

  test('the accessible lens renders ZERO dress even WITH a full season+state context', () => {
    const model = buildTownMapModel(makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'dress-acc2' }));
    const cats = [...new Set((model.districts || []).map((d) => d.category))];
    const full = { season: 'winter', severity: 'hard_winter', state: { besieged: true, scarLevel: 1, rebuiltCategories: cats } };
    expect(groundDressOps(model, 'accessible', full)).toEqual([]);
  });
});

// ── THE FLETCHED RIBBON (owner directive, 2026-08-03; lane FL) ────────────────
// The desktop ribbon's Create · Library · Realm band is a leather-brown fill
// carrying LABEL TEXT, so its floor is AA 4.5:1 — not the 3:1 graphics floor. The
// theme records these exact ratios in prose beside the tokens; this block is what
// makes that prose a measurement rather than a claim, recomputed from the token
// values themselves so a palette edit that darkens the parchment or lightens the
// brown reds here instead of shipping an illegible ribbon.
//
// The one sub-3:1 pair is asserted AS SUCH, deliberately: the active feather's
// gold bottom edge against its OWN lifted fill is 2.59:1. It is a REDUNDANT
// channel and never a state carrier — the active feather is already told by the
// lifted fill, the brighter label, weight 700 and aria-current="page" (pinned in
// tests/components/navFletching.test.jsx) — so recording it honestly is the point.
// If a future edit made it PASS, that would be a real improvement and this
// assertion is written to red so the note gets updated rather than rotting.
describe('THE FLETCHED RIBBON — the leather band carries text, so it owes AA', () => {
  test('both feather labels clear AA on both band tones', () => {
    // Resting label on the band, and on the active lift it can sit over.
    expect(ratio(PARCH_100, FLETCH_BROWN)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(ratio(PARCH_100, FLETCH_BROWN_LIFT)).toBeGreaterThanOrEqual(AA_TEXT);
    // The active label's own brighter parchment, on the lift it actually sits on.
    expect(ratio(PARCH, FLETCH_BROWN_LIFT)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(ratio(PARCH, FLETCH_BROWN)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  test('the recorded ratios in theme.js are the MEASURED ones, to 2dp', () => {
    // The theme's prose table, re-derived. A token edit that moves any of these
    // reds here and the note is corrected in the same commit.
    expect(ratio(PARCH_100, FLETCH_BROWN).toFixed(2)).toBe('6.24');
    expect(ratio(PARCH, FLETCH_BROWN_LIFT).toFixed(2)).toBe('5.71');
    expect(ratio(PARCH_100, FLETCH_BROWN_LIFT).toFixed(2)).toBe('5.18');
    expect(ratio(GOLD, FLETCH_BROWN).toFixed(2)).toBe('3.12');
    expect(ratio(GOLD, FLETCH_BROWN_LIFT).toFixed(2)).toBe('2.59');
  });

  test('the fletch seam stroke clears the 3:1 UI-boundary floor on the band', () => {
    // NavDivider draws the angled seam in GOLD, cut into the brown band — a
    // non-text boundary, so SC 1.4.11 governs it.
    expect(ratio(GOLD, FLETCH_BROWN)).toBeGreaterThanOrEqual(AA_UI);
  });

  test('the active feather’s gold edge is BELOW 3:1 — recorded, and never rendered', () => {
    // GOLD on the LIFT is the pairing V1 shipped and recorded as under-floor. V2
    // does not render it at all: an active feather wears GILT_ACTIVE, a resting one
    // sits on FLETCH_BROWN, so this combination has no drawing site left. Kept as
    // the negative control that the brighter gilt really did replace it.
    expect(ratio(GOLD, FLETCH_BROWN_LIFT)).toBeLessThan(AA_UI);
    expect(ratio(GILT_ACTIVE, FLETCH_BROWN_LIFT)).toBeGreaterThanOrEqual(AA_UI);
  });

  test('the ACTIVE gilt clears 3:1 on both tones it can touch', () => {
    // The brighter gilt is the channel that replaced weight-700, so unlike a
    // decorative edge it does carry state — and therefore owes the UI floor on
    // the lifted fill it traces AND on the band it is cut into.
    expect(ratio(GILT_ACTIVE, FLETCH_BROWN_LIFT)).toBeGreaterThanOrEqual(AA_UI);
    expect(ratio(GILT_ACTIVE, FLETCH_BROWN)).toBeGreaterThanOrEqual(AA_UI);
    expect(ratio(GILT_ACTIVE, FLETCH_BROWN).toFixed(2)).toBe('3.83');
    expect(ratio(GILT_ACTIVE, FLETCH_BROWN_LIFT).toFixed(2)).toBe('3.18');
  });

  test('the BARB texture darkens the feather without dropping its label below AA', () => {
    // The barbs are opaque steps, so the darkest pixel a label can sit on is a
    // KNOWN colour rather than a guess — which is the whole reason they were
    // authored opaque. Each label is measured against its own register's barb.
    expect(ratio(PARCH_100, FLETCH_BARB)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(ratio(PARCH, FLETCH_BARB_LIFT)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(ratio(PARCH_100, FLETCH_BARB).toFixed(2)).toBe('6.43');
    expect(ratio(PARCH, FLETCH_BARB_LIFT).toFixed(2)).toBe('5.88');
    // And the texture stays INSIDE the directive's 3–5% luminance band: strong
    // enough to be a material, weak enough not to become stripes.
    const drop = (barb, base) => ((luminance(base) - luminance(barb)) / luminance(base)) * 100;
    for (const [barb, base] of [[FLETCH_BARB, FLETCH_BROWN], [FLETCH_BARB_LIFT, FLETCH_BROWN_LIFT]]) {
      expect(drop(barb, base)).toBeGreaterThanOrEqual(3);
      expect(drop(barb, base)).toBeLessThanOrEqual(5);
    }
  });

  test('the band is DERIVED from the gold family, not invented beside it', () => {
    // FLETCH_BROWN is the theme's own gold-800 (GOLD_TXT), so a palette edit
    // moves the fletching with it rather than leaving a stranded hex.
    expect(FLETCH_BROWN).toBe(GOLD_TXT);
    // And the lift is a genuine step LIGHTER than the band — otherwise "active
    // brightens" would be a lie the eye could not see.
    expect(ratio(FLETCH_BROWN_LIFT, '#000000')).toBeGreaterThan(ratio(FLETCH_BROWN, '#000000'));
  });
});

/**
 * THE LIGHT-WOOD SHAFT (ribbon v2 directive §2–§3) — every label that rides the
 * plank, measured against THE DARKEST STREAK OF THE GRAIN.
 *
 * ⚠️ THE REFERENCE GROUND IS SHAFT_GRAIN_DEEP, NOT SHAFT. This is the whole point
 * of the block. The bar is not one flat colour: it is a base with two streak
 * gradients painted over it, so a label's worst case is wherever a dark streak
 * happens to run behind a letterform — and on a 48px bar with a 13px and a 29px
 * period, some letter somewhere always lands there. Measuring against SHAFT would
 * pass a palette that is genuinely unreadable at the streaks; that is why the
 * grain tones were authored as OPAQUE steps rather than an alpha wash, so "the
 * darkest pixel" is a value this file can name.
 *
 * The inversion is also why this block exists at all. Every one of these
 * foregrounds was correct on the ink bar V1 drew and wrong on wood, and NOTHING
 * else in the suite would have noticed: the header still rendered, the tabs still
 * navigated, the structural nav pins all stayed green.
 */
describe('THE LIGHT-WOOD SHAFT — the plank carries text, so it owes AA at its darkest streak', () => {
  const DARKEST = SHAFT_GRAIN_DEEP;

  test('the grain stays inside the directive’s 2–4% luminance band', () => {
    // Below 2% the wood reads as flat paper; above 4% it reads as stripes. Both
    // streak tones are checked, and the ORDER is checked too — a "deep" streak
    // lighter than the mid one would silently make DARKEST the wrong reference.
    const drop = (streak) => ((luminance(SHAFT) - luminance(streak)) / luminance(SHAFT)) * 100;
    expect(drop(SHAFT_GRAIN)).toBeGreaterThanOrEqual(1.5);
    expect(drop(SHAFT_GRAIN)).toBeLessThanOrEqual(4);
    expect(drop(SHAFT_GRAIN_DEEP)).toBeGreaterThanOrEqual(2);
    expect(drop(SHAFT_GRAIN_DEEP)).toBeLessThanOrEqual(4);
    expect(luminance(SHAFT_GRAIN_DEEP)).toBeLessThan(luminance(SHAFT_GRAIN));
  });

  test('the shaft separates from the cream page body without becoming a dark bar', () => {
    // A plank, not a stripe: deeper than PARCH, but nowhere near a boundary that
    // would make the header read as chrome bolted onto the page.
    expect(ratio(SHAFT, PARCH)).toBeGreaterThan(1.1);
    expect(ratio(SHAFT, PARCH)).toBeLessThan(1.4);
    expect(luminance(SHAFT)).toBeLessThan(luminance(PARCH));
  });

  test('every label on the shaft clears AA against the darkest streak', () => {
    const riders = [
      ['wordmark + active reference tab', GOLD_TXT],
      ['resting reference tab',           BODY],
      ['ghost buttons (Upgrade)',         SECOND],
      ['signed-in account chip',          GREEN_DEEP],
      ['developer account chip',          SLATE_DEEP],
    ];
    for (const [who, fg] of riders) {
      expect(ratio(fg, DARKEST), `${who}: ${fg} on ${DARKEST}`).toBeGreaterThanOrEqual(AA_TEXT);
    }
  });

  test('⚠️ NEGATIVE CONTROLS: the tones V1 used on the ink bar FAIL on wood', () => {
    // These are the exact substitutions ribbon v2 had to make. Pinned as failures
    // so that "just put the old colour back" reds here with the reason attached,
    // instead of shipping an unreadable header that screenshots fine in isolation.
    expect(ratio(PARCH_100, DARKEST)).toBeLessThan(AA_TEXT);  // the old nav label tone
    expect(ratio(GOLD, DARKEST)).toBeLessThan(AA_TEXT);       // the old wordmark tone
    expect(ratio(GREEN, DARKEST)).toBeLessThan(AA_TEXT);      // the old account-chip tone
    // …and the replacement really is better, or the swap bought nothing.
    expect(ratio(GREEN_DEEP, DARKEST)).toBeGreaterThan(ratio(GREEN, DARKEST));
    expect(ratio(GOLD_TXT, DARKEST)).toBeGreaterThan(ratio(GOLD, DARKEST));
  });

  test('the recorded shaft ratios in theme.js are the MEASURED ones, to 2dp', () => {
    expect(ratio(GOLD_TXT, DARKEST).toFixed(2)).toBe('5.75');
    expect(ratio(BODY, DARKEST).toFixed(2)).toBe('8.33');
    expect(ratio(SECOND, DARKEST).toFixed(2)).toBe('12.04');
    expect(ratio(GREEN_DEEP, DARKEST).toFixed(2)).toBe('5.00');
    expect(ratio(GREEN, DARKEST).toFixed(2)).toBe('3.91');
    expect(ratio(SHAFT, PARCH).toFixed(2)).toBe('1.15');
  });

  test('the account chip’s BORDER stays a 1.4.11 boundary even though its label moved', () => {
    // The label went to GREEN_DEEP for AA; the rule stayed GREEN so the status
    // colour still reads. That is only defensible if the rule itself clears the
    // 3:1 UI floor on the ground it is drawn against.
    expect(ratio(GREEN, DARKEST)).toBeGreaterThanOrEqual(AA_UI);
    expect(ratio(SLATE, DARKEST)).toBeGreaterThanOrEqual(AA_UI);
  });

  test('the feather is the boundary that says "feather", and the gilt is not', () => {
    // The structural claim behind recording the gilt as decoration: what tells a
    // user where a feather is, is the DARK BROWN against the wood — comfortably
    // past 1.4.11 — not the hairline, which is 1.85:1 there and carries nothing.
    expect(ratio(FLETCH_BROWN, SHAFT)).toBeGreaterThanOrEqual(AA_UI);
    expect(ratio(FLETCH_BROWN, DARKEST)).toBeGreaterThanOrEqual(AA_UI);
    expect(ratio(FLETCH_BROWN, SHAFT).toFixed(2)).toBe('5.97');
    expect(ratio(GILT, SHAFT)).toBeLessThan(AA_UI); // recorded, not hidden
    expect(ratio(GILT, SHAFT).toFixed(2)).toBe('1.92');
  });

  test('the reference-tab groove is quieter than the fletching’s gilt seam — the hierarchy', () => {
    // Both are decorative dividers with no WCAG floor, so what is pinned is the
    // RELATIONSHIP the design depends on: the journey's seams read stronger than
    // the shelf's. If a future edit inverted these, the band would stop leading.
    expect(ratio(GILT, FLETCH_BROWN)).toBeGreaterThan(ratio(SHAFT_RULE, SHAFT));
    expect(ratio(SHAFT_RULE, SHAFT).toFixed(2)).toBe('2.50');
    // And the groove is genuinely visible, unlike the BORDER it replaced here.
    expect(ratio(SHAFT_RULE, SHAFT)).toBeGreaterThan(ratio(BORDER, SHAFT));
    expect(ratio(BORDER, SHAFT)).toBeLessThan(1.6); // why BORDER had to go
  });
});
