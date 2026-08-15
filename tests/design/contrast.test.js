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
  AMBER_BG, AMBER_DEEP, BLUE, BLUE_BG, BODY, BORDER, BORDER_STRONG, CARD,
  FLETCH_BARB, FLETCH_LEAD, FLETCH_RACHIS, FLETCH_SEAM, FLETCH_SHEEN, FLETCH_SHEEN_LIFT,
  FLETCH_TIP, FLETCH_VANE, GOLD, GOLD_DEEP, GOLD_SOFT,
  GOLD_TXT, GREEN, GREEN_BG, GREEN_DEEP, INK, INK_DEEP, MUTED, PARCH, PARCH_100, RED, RED_BG,
  SECOND, SHAFT, SHAFT_BODY, SHAFT_EDGE, SHAFT_RIM, SHAFT_RULE, SHAFT_SHEEN,
  SHAFT_SAGE, SHAFT_STEEL, SLATE, SLATE_BG, SLATE_DEEP, WRAP, WRAP_EDGE, WRAP_GLOSS,
  BOLE, BOLE_DEEP, GILT, GILT_LIGHT, HEADER_RIDERS, SHAFT_STOPS,
  SEAL_WAX, cylinderToneAt, riderFloorTone, riderGrainShare,
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

/**
 * An sRGB triple back to the 6-digit hex `luminance` above insists on.
 *
 * ⚠️ IT ROUNDS, AND THAT IS THE HONEST DIRECTION. cylinderToneAt interpolates in
 * floats; a real raster quantises to 8 bits per channel, so rounding here measures the
 * tone a reader's screen actually shows rather than one no display can produce.
 */
function hexOf(rgb) {
  return `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
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

// ── THE WAR ARROW, REPAINTED (ribbon V4, owner directive 2026-08-03 night) ────
//
// Two grounds, ONE register, and the whole point of this section is that a tone is
// only ever correct WITH RESPECT TO THE GROUND IT LANDS ON. The ribbon has now moved
// ground three times, and every move broke foregrounds that had been fine the day
// before:
//
//   V1  a dark ink bar    → pale labels, gold wordmark.
//   V2  a cream plank     → PARCH_100 and GOLD both collapsed on light wood; the
//                           labels went ink and the wordmark went GOLD_TXT.
//   V3  a honey-tan shaft → the barrel is much darker than the cream, and GOLD_TXT
//                           (5.75 → 3.38), GREEN_DEEP (5.00 → 2.93) and SLATE_DEEP
//                           (4.28 → 3.53) ALL fell below AA in turn.
//   V4  a CEDAR war shaft → the ink register itself becomes impossible. INK_DEEP
//                           measures 1.97:1, BODY 1.36:1, GOLD_TXT 1.06:1 — and the
//                           feather went dark with the wood, so the vane lost its
//                           4.46:1 boundary against the barrel as well.
//
// Every one of those is pinned below as a NEGATIVE CONTROL, so "just put the old
// colour back" reds here with the reason attached rather than shipping a header that
// screenshots fine and is unreadable in the app. That is the only defence against this
// class: nothing else in the suite notices, because the cells still render, still
// navigate and still carry aria-current.

describe('⚠️⚠️ THE MID-RUSSET DEAD BAND — the one law this palette cannot break', () => {
  // THE SINGLE MOST IMPORTANT DON'T IN THE FILE, as arithmetic rather than as advice.
  // A wood body whose relative luminance lands between the two numbers below clears
  // NEITHER register at any hue, and NOTHING about that failure is visible in a
  // screenshot: the labels still render, in a colour that looks deliberate.
  const paleCeiling = (luminance(PARCH_100) + 0.05) / AA_TEXT - 0.05;
  const darkFloor = AA_TEXT * (luminance(INK_DEEP) + 0.05) - 0.05;

  test('the band is real: between the two floors, BOTH registers fail', () => {
    expect(paleCeiling).toBeCloseTo(0.1447, 4);
    expect(darkFloor).toBeCloseTo(0.2523, 4);
    expect(paleCeiling).toBeLessThan(darkFloor); // …or there would be no band at all
    // A grey at the middle of the band, measured both ways. Neither reaches 4.5.
    const mid = (paleCeiling + darkFloor) / 2;
    const at = (L) => (Math.max(L, luminance(PARCH_100)) + 0.05) / (Math.min(L, luminance(PARCH_100)) + 0.05);
    const atDark = (L) => (Math.max(L, luminance(INK_DEEP)) + 0.05) / (Math.min(L, luminance(INK_DEEP)) + 0.05);
    expect(at(mid)).toBeLessThan(AA_TEXT);
    expect(atDark(mid)).toBeLessThan(AA_TEXT);
  });

  test('⚠️⚠️ SHAFT_BODY IS COMMITTED BELOW THE BAND — L ≤ 0.13, and it is a LAW', () => {
    // The owner's directive is a dark cedar shaft, and the only safe side of the band
    // is the DARK one. This is the pin that stops a future "warm it up a little" from
    // walking the whole bar into a place where no label of any colour is legible.
    expect(luminance(SHAFT_BODY)).toBeLessThanOrEqual(0.13);
    expect(luminance(SHAFT_BODY)).toBeLessThan(paleCeiling);
    // Today's value, in its own assertion so a retune edits an obvious record.
    expect(luminance(SHAFT_BODY).toFixed(4)).toBe('0.0820');
    // …and EVERY step of the barrel is out of the band, not just the body one.
    for (const [name, tone] of Object.entries({ SHAFT_SHEEN, SHAFT, SHAFT_BODY, SHAFT_EDGE, SHAFT_RIM })) {
      expect(luminance(tone), `${name} is inside the dead band`).toBeLessThan(darkFloor);
    }
  });
});

describe('⚠️⚠️ THE PALE REGISTER — the polarity flip, measured per rider', () => {
  // THE INVERSION, STATED ONCE. A dark-on-light label fails at its ground's DARKEST
  // point; a light-on-dark label fails at its LIGHTEST. Every floor below is the
  // rider's own top-of-ink tone, which is what riderFloorTone now returns for a pale
  // rider — and the grain, a darkening wash, is deliberately absent from it.
  const paleFloor = (key) => luminance(hexOf(riderFloorTone(HEADER_RIDERS[key])));
  const onFloor = (ink, key) => {
    const l = paleFloor(key);
    const li = luminance(ink);
    return (Math.max(l, li) + 0.05) / (Math.min(l, li) + 0.05);
  };

  test('the sheen is CONFINED ABOVE EVERY RIDER — the geometric guarantee', () => {
    // The V4 analogue of SHAFT_STOPS.body, and the claim the whole register rests on.
    // SHAFT_SHEEN itself (L 0.1467) does NOT clear PARCH_100's 4.5:1 ceiling; it never
    // has to, because no rider's ink reaches it. Asserted as a relationship, so a
    // future edit that lowers a rider or raises the stop reds here.
    const shallowest = Math.min(...Object.values(HEADER_RIDERS).map((r) => r.ink[0] / r.bar));
    expect(shallowest).toBeGreaterThan(SHAFT_STOPS.lit);
    expect(shallowest).toBeCloseTo(0.1995, 4);        // the wordmark's own top of ink
    expect(luminance(SHAFT_SHEEN)).toBeGreaterThan((luminance(PARCH_100) + 0.05) / AA_TEXT - 0.05);
    // …and the lightest ground a rider actually touches DOES clear it.
    expect(luminance(hexOf(cylinderToneAt(shallowest)))).toBeLessThan(
      (luminance(PARCH_100) + 0.05) / AA_TEXT - 0.05,
    );
  });

  test('every PALE rider clears AA on its own lightest ground', () => {
    for (const key of ['tab', 'signIn', 'chip', 'mobileTab']) {
      expect(onFloor(PARCH_100, key), `PARCH_100 on ${key}`).toBeGreaterThanOrEqual(AA_TEXT);
      expect(onFloor(PARCH, key), `PARCH on ${key}`).toBeGreaterThanOrEqual(AA_TEXT);
    }
    // the chip's own status tints, on the chip's own ground
    expect(onFloor(SHAFT_SAGE, 'chip')).toBeGreaterThanOrEqual(AA_TEXT);
    expect(onFloor(SHAFT_STEEL, 'chip')).toBeGreaterThanOrEqual(AA_TEXT);
    // the active plain tab's underline is a BOUNDARY beside a legible label
    expect(onFloor(GILT, 'tabRule')).toBeGreaterThanOrEqual(AA_UI);
  });

  test('the recorded pale ratios are the MEASURED ones, to 2dp', () => {
    expect(onFloor(PARCH_100, 'tab').toFixed(2)).toBe('5.73');
    expect(onFloor(PARCH, 'tab').toFixed(2)).toBe('6.31');
    expect(onFloor(PARCH_100, 'signIn').toFixed(2)).toBe('5.27');
    expect(onFloor(SHAFT_SAGE, 'chip').toFixed(2)).toBe('4.63');
    expect(onFloor(SHAFT_STEEL, 'chip').toFixed(2)).toBe('4.63');
    expect(onFloor(GILT, 'tabRule').toFixed(2)).toBe('3.74');
    expect(onFloor(PARCH_100, 'mobileTab').toFixed(2)).toBe('6.32');
  });

  test('⚠️ POLARITY IS READ, NOT ASSUMED — the pin that would go vacuous without it', () => {
    // riderFloorTone used to take ink[1] unconditionally. Pointed at a pale rider that
    // hands back the FRIENDLIEST ground on the bar and reports a comfortable pass while
    // the real worst case is never measured. So the non-vacuity is asserted directly:
    // for every pale rider the floor really is its TOP of ink, and the top really is
    // lighter than the bottom.
    for (const [key, r] of Object.entries(HEADER_RIDERS)) {
      if (r.polarity === 'bed') continue;
      expect(r.polarity).toBe('pale');
      expect(riderFloorTone(r)).toEqual(cylinderToneAt(r.ink[0] / r.bar));
      expect(luminance(hexOf(cylinderToneAt(r.ink[0] / r.bar))))
        .toBeGreaterThan(luminance(hexOf(cylinderToneAt(r.ink[1] / r.bar))));
      // …and a pale rider's floor carries NO grain, because a darkening wash is its
      // best case rather than its worst.
      expect(riderGrainShare(r)).toBe(0);
    }
    // A 'bed' rider has no barrel ground at all, and says so rather than guessing.
    expect(HEADER_RIDERS.wordmark.polarity).toBe('bed');
    expect(HEADER_RIDERS.seal.polarity).toBe('bed');
    expect(() => riderFloorTone(HEADER_RIDERS.wordmark)).toThrow(/no barrel ground/);
  });

  test('⚠️⚠️ NEGATIVE CONTROLS: every V3 ink tone FAILS on cedar', () => {
    // These are the exact substitutions V4 was forced into, pinned as failures. Every
    // one was CORRECT on the honey barrel — this is not a list of mistakes, it is a
    // list of tones whose ground moved out from under them, for the third time.
    for (const [name, tone] of Object.entries({ INK_DEEP, BODY, SECOND, GOLD_TXT })) {
      expect(onFloor(tone, 'tab'), `${name} still reads on cedar`).toBeLessThan(AA_TEXT);
    }
    // …including as a BOUNDARY, which is the weaker claim GOLD_TXT survived V3 on.
    expect(onFloor(GOLD_TXT, 'tabRule')).toBeLessThan(AA_UI);
    // …and the V3 DARK chip steps, which is why the chip flipped to pale tints.
    expect(ratio('#2A4420', SHAFT_BODY)).toBeLessThan(AA_TEXT);   // the V3 SHAFT_GREEN
    expect(ratio('#303E4A', SHAFT_BODY)).toBeLessThan(AA_TEXT);   // the V3 SHAFT_SLATE
    // …and the replacements really are better, or the swap bought nothing.
    expect(onFloor(SHAFT_SAGE, 'chip')).toBeGreaterThan(onFloor('#2A4420', 'chip'));
    expect(onFloor(SHAFT_STEEL, 'chip')).toBeGreaterThan(onFloor('#303E4A', 'chip'));
  });
});

describe('THE DARK-INK VANE — a pale label on a dark feather owes AA at the LIGHT points', () => {
  // ⚠️⚠️ THE LIGHTEST BAND GOVERNS, NOT THE VANE. This is the same inversion the shaft
  // block above makes, and it is the mistake that is easy to make: a dark-on-light
  // label fails at the ground's darkest point, a light-on-dark label fails at its
  // LIGHTEST. So the reference is FLETCH_SHEEN_LIFT — the active fletch's brightened
  // sheen — and every tone in the ladder is authored OPAQUE precisely so that
  // reference is a value this file can name instead of a hand-wave.
  const LADDER = Object.freeze({
    FLETCH_TIP, FLETCH_BARB, FLETCH_VANE, FLETCH_LEAD, FLETCH_SHEEN,
    FLETCH_RACHIS, FLETCH_SHEEN_LIFT,
  });

  test('FLETCH_SHEEN_LIFT really IS the lightest band — the reference is not assumed', () => {
    for (const [name, tone] of Object.entries(LADDER)) {
      expect(luminance(tone), `${name} is lighter than the reference band`)
        .toBeLessThanOrEqual(luminance(FLETCH_SHEEN_LIFT));
    }
  });

  test('both label registers clear AA on the lightest band, and on every other one', () => {
    expect(ratio(PARCH_100, FLETCH_SHEEN_LIFT)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(ratio(PARCH, FLETCH_SHEEN_LIFT)).toBeGreaterThanOrEqual(AA_TEXT);
    for (const [name, tone] of Object.entries(LADDER)) {
      expect(ratio(PARCH_100, tone), `PARCH_100 on ${name}`).toBeGreaterThanOrEqual(AA_TEXT);
      expect(ratio(PARCH, tone), `PARCH on ${name}`).toBeGreaterThanOrEqual(AA_TEXT);
    }
  });

  test('the recorded vane ratios in theme.js are the MEASURED ones, to 2dp', () => {
    expect(ratio(PARCH_100, FLETCH_SHEEN_LIFT).toFixed(2)).toBe('6.60');
    expect(ratio(PARCH, FLETCH_SHEEN_LIFT).toFixed(2)).toBe('7.27');
    expect(ratio(PARCH_100, FLETCH_SHEEN).toFixed(2)).toBe('7.86');
    expect(ratio(PARCH_100, FLETCH_LEAD).toFixed(2)).toBe('8.92');
    expect(ratio(PARCH_100, FLETCH_VANE).toFixed(2)).toBe('11.50');
    expect(ratio(PARCH_100, FLETCH_BARB).toFixed(2)).toBe('11.82');
  });

  test('⚠️ THE SPECIES PIN — goose barbs are a comb, turkey barring is a stripe', () => {
    // The owner corrected the species, and this is that correction as a number. A
    // turkey primary is boldly barred; a goose primary is not. V2's texture dropped
    // ~27% of its vane's luminance, which is barring. ⚠️ THE LADDER MOVED IN V4 AND
    // THIS NUMBER MOVED WITH IT — 7.96% → 7.92% — because both tones were re-authored
    // one register down. The INVARIANT (4 < drop < 12) is what defends the species;
    // the quoted value is a record and is expected to move whenever the ladder does.
    const drop = (luminance(FLETCH_VANE) - luminance(FLETCH_BARB)) / luminance(FLETCH_VANE) * 100;
    expect(drop).toBeCloseTo(7.92, 1);
    expect(drop).toBeGreaterThan(4);  // a striation you can actually see
    expect(drop).toBeLessThan(12);    // and never a bar
  });

  test('the ladder is ORDERED, so "paler leading edge, darker tip" is true', () => {
    expect(luminance(FLETCH_TIP)).toBeLessThan(luminance(FLETCH_VANE));
    expect(luminance(FLETCH_VANE)).toBeLessThan(luminance(FLETCH_LEAD));
    expect(luminance(FLETCH_LEAD)).toBeLessThan(luminance(FLETCH_SHEEN));
    expect(luminance(FLETCH_SHEEN)).toBeLessThan(luminance(FLETCH_SHEEN_LIFT));
  });

  test('⚠️⚠️ THE VANE-vs-WOOD BOUNDARY IS RE-SCOPED, AND THE NUMBER IS QUOTED', () => {
    // THE TRADE V4 MAKES, IN THE OPEN. The owner's directive puts a DARK INK feather on
    // a DARK CEDAR shaft, so the boundary that used to say "fletch" at 4.46:1 now
    // measures 1.73:1 and no honest retune recovers it: lifting the vane walks it into
    // the label register's way, lifting the wood walks it into the dead band.
    expect(ratio(FLETCH_VANE, SHAFT_BODY)).toBeLessThan(AA_UI);
    expect(ratio(FLETCH_VANE, SHAFT_BODY).toFixed(2)).toBe('1.73');
    // SO THE IDENTIFICATION MOVES, AND EACH REPLACEMENT IS ASSERTED RATHER THAN
    // CLAIMED. SC 1.4.11 asks whether a component is IDENTIFIABLE, and three separate
    // channels answer that here, none of them this boundary:
    //   1. THE LABEL — each cell carries its own name, well past AA on every band.
    expect(ratio(PARCH_100, FLETCH_SHEEN_LIFT)).toBeGreaterThanOrEqual(AA_TEXT);
    //   2. THE INDICATOR — the active lane's gold, which DOES clear 3:1 on the sheen
    //      zone it is drawn in, and is why the indicator had to leave the house GOLD.
    expect(ratio(GILT_LIGHT, SHAFT_SHEEN)).toBeGreaterThanOrEqual(AA_UI);
    expect(ratio(GILT_LIGHT, SHAFT_SHEEN).toFixed(2)).toBe('3.34');
    expect(ratio(GOLD, SHAFT_SHEEN)).toBeLessThan(AA_UI);          // the house gold cannot
    expect(ratio(GOLD, SHAFT_SHEEN).toFixed(2)).toBe('2.23');
    //   3. THE HANG — the lower half of every vane sits on the parchment PAGE, not on
    //      wood at all, where the same silhouette is unmissable.
    expect(ratio(FLETCH_VANE, PARCH)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  test('the quill seam is nearly tonal, and that is RECORDED, not hidden', () => {
    // V2 cut its seams in GILT and they read as ornament. Real fletching has no metal
    // in it: where two vanes meet you see one feather's shadow on the next. ⚠️ The seam
    // is now the TIP tone BY CONSTRUCTION rather than by a matching literal, so the two
    // can never drift apart the way two hand-keyed copies of one tone do.
    expect(FLETCH_SEAM).toBe(FLETCH_TIP);
    expect(ratio(FLETCH_SEAM, FLETCH_VANE)).toBeLessThan(AA_UI);
    expect(ratio(FLETCH_SEAM, FLETCH_VANE).toFixed(2)).toBe('1.23');
  });
});

describe('THE GILT LADDER + THE BOLE BED — the wordmark brings its own ground', () => {
  test('⚠️⚠️ THE BED IS THE REASON THERE CAN BE GOLD AT ALL', () => {
    // No gold a reader would call gold clears AA on the barrel's lit sheen: that is the
    // whole argument for the bed, and it is asserted rather than asserted-about.
    expect(ratio(GILT, SHAFT_SHEEN)).toBeLessThan(AA_TEXT);
    expect(ratio(GILT_LIGHT, SHAFT_SHEEN)).toBeLessThan(AA_TEXT);
    // …and on the bole it clears with room. 4.8:1 is the spec's own floor, above AA.
    expect(ratio(GILT, BOLE)).toBeGreaterThanOrEqual(4.8);
    expect(ratio(GILT, BOLE).toFixed(2)).toBe('7.50');
    expect(ratio(GILT_LIGHT, BOLE).toFixed(2)).toBe('9.84');
  });

  test('EVERY GILT STOP IS AT OR ABOVE L 0.44 — the fill carries 100% of the claim', () => {
    // A gradient fill is only as legible as its darkest stop, and a "modelling" stop
    // below the floor is invisible to any token-vs-token pin. There are exactly two
    // stops and both are above it.
    for (const [name, tone] of Object.entries({ GILT, GILT_LIGHT })) {
      expect(luminance(tone), `${name} is below the leaf's fill floor`).toBeGreaterThanOrEqual(0.44);
    }
    expect(luminance(GILT).toFixed(4)).toBe('0.4509');
    // …and the light stop clears the SEPARATE, higher floor the indicator owes,
    // because it is drawn on the shaft's sheen zone rather than on the bole.
    expect(luminance(GILT_LIGHT)).toBeGreaterThanOrEqual(0.58);
    expect(luminance(GILT_LIGHT).toFixed(4)).toBe('0.6068');
  });

  test('⚠️ THE BOLE’S CORE IS AT OR BELOW L 0.06 — the ground every gilt ratio uses', () => {
    // If the bed were allowed to drift lighter, every ratio above would fall together
    // and nothing else in the suite would notice.
    expect(luminance(BOLE)).toBeLessThanOrEqual(0.06);
    expect(luminance(BOLE_DEEP)).toBeLessThanOrEqual(0.06);
    expect(luminance(BOLE_DEEP)).toBeLessThan(luminance(BOLE)); // the scorch is deeper
    expect(luminance(BOLE).toFixed(4)).toBe('0.0168');
  });

  test('THE GILDED SEAL: three tones, three LUMINANCE steps, no hue doing any work', () => {
    // ⚠️ THE OWNER-VETO CANDIDATE, measured. The `o` is a gold annulus; the wax fills
    // between ring and counter; the counter is a true hole showing the bole.
    expect(ratio(SEAL_WAX, GILT)).toBeGreaterThanOrEqual(AA_UI);
    expect(ratio(SEAL_WAX, GILT).toFixed(2)).toBe('5.34');
    expect(ratio(BOLE, GILT).toFixed(2)).toBe('7.50');
    // AND THE NEGATIVE CONTROL THAT FORCED IT: bare wax on cedar is unreadable, which
    // is why the seal could not simply keep riding the wood.
    expect(ratio(SEAL_WAX, SHAFT_BODY)).toBeLessThan(AA_UI);
    expect(ratio(SEAL_WAX, SHAFT_BODY).toFixed(2)).toBe('1.41');
    // …and lightening the wax is not the escape hatch: a wax bright enough to clear
    // 4.5:1 on cedar would have to land inside the dead band's own lower half.
    expect(luminance(SEAL_WAX)).toBeLessThan(0.13);
  });
});

describe('THE CEDAR SHAFT — the barrel, the wraps, and the groove cut in it', () => {
  test('the cylinder ladder is ORDERED — lighter above, darker toward the silhouette', () => {
    const ladder = [SHAFT_SHEEN, SHAFT, SHAFT_BODY, SHAFT_EDGE, SHAFT_RIM];
    for (let i = 1; i < ladder.length; i += 1) {
      expect(luminance(ladder[i])).toBeLessThan(luminance(ladder[i - 1]));
    }
    // A real barrel: 2.76:1 top to bottom. V3's first cut modelled only 1.89:1 and read
    // as a flat tan bar with a gradient; the modelling range is deliberately preserved
    // across the repaint even though every tone in it moved.
    expect(ratio(SHAFT_SHEEN, SHAFT_RIM).toFixed(2)).toBe('2.76');
  });

  test('⚠️ THE PLANK BECAME A MATERIAL, AND THEN A WEAPON — both shifts recorded', () => {
    // V2 pinned SHAFT vs PARCH between 1.1 and 1.4 ("separates without becoming a dark
    // bar") and measured 1.15; V3 measured 1.85 and recorded honey-tan wood as the
    // directive. V4 is a CEDAR WAR SHAFT and measures far past both — it IS a dark bar
    // now, deliberately, because the owner's arrow is made of dark wood. Recorded here
    // rather than left to be re-found as a mystery.
    expect(luminance(SHAFT)).toBeLessThan(luminance(PARCH));
    expect(ratio(SHAFT, PARCH)).toBeGreaterThan(2.5);   // the V3 band, deliberately broken
    expect(ratio(SHAFT, PARCH).toFixed(2)).toBe('6.53');
  });

  test('⚠️ THE WRAP IS IDENTIFIED BY ITS OWN STRUCTURE — the scoping, with numbers', () => {
    // On honey wood the whipping cleared 1.4.11 at 3.16:1 against the barrel. On cedar
    // the wood is the SAME HUE, so a wrap bright enough to clear 3:1 would be a
    // different red rather than a deeper one — and the spec deepens it to oxblood. The
    // claim therefore moves from "a step against the wood" to "a wound structure", and
    // both halves are pinned — the step here, the rendered structure in navFletching's
    // R5 — so neither can quietly disappear.
    expect(ratio(WRAP, SHAFT_BODY)).toBeLessThan(AA_UI);
    expect(ratio(WRAP, SHAFT_BODY).toFixed(2)).toBe('1.69');
    // 1 — it IS still a darker band than the wood, at both of its dark steps.
    expect(luminance(WRAP)).toBeLessThan(luminance(SHAFT_BODY));
    expect(ratio(WRAP_EDGE, SHAFT_BODY).toFixed(2)).toBe('2.22');
    // 2 — 2.12 is the AUTHORED-TOKEN ratio, and pinning it guards exactly one thing: that
    // the hex pair keeps its separation and cannot quietly collapse in a repaint.
    // ⚠️⚠️ IT IS NOT WHY THE WRAP READS AS THREAD — this line used to say it was. What a
    // reader sees is the COMPOSITED pixel: WRAP_BARREL multiplies its luminance modulator
    // over the turns, and that modulator is WHITE — identity — from the top of the bar down
    // to SHAFT_STOPS.lit, so 2.12 is the true pixel ladder across the top 9% and ONLY
    // there. Below the lit stop both tones dim together and the ladder falls (1.82 mid-bar,
    // 1.37 at the edge stop, 1.23 in the silhouette), so it is never the ratio anywhere in
    // the readable BODY of the bar — which is the whole span the thread has to read as
    // thread across. theme.js's WRAPS note carries the rendered figure, 1.81:1 at crest
    // #6A311E..#6B311F over valley #270D07; tests/components/navFletching.test.jsx (R5)
    // performs the compositor's multiply and pins the analytic mid-bar ladder at 1.82.
    expect(ratio(WRAP_GLOSS, WRAP_EDGE)).toBeGreaterThan(2);
    expect(ratio(WRAP_GLOSS, WRAP_EDGE).toFixed(2)).toBe('2.12');
    expect(luminance(WRAP_EDGE)).toBeLessThan(luminance(WRAP));
    expect(luminance(WRAP)).toBeLessThan(luminance(WRAP_GLOSS));
  });

  test('the reference-tab groove is a SHADOW, and quieter than the fletching', () => {
    // Both seams are decorative dividers with no WCAG floor, so what is pinned is the
    // RELATIONSHIP the design depends on. ⚠️ THE OLD SECOND HALF INVERTED: the pin used
    // to read "louder than BORDER", and on cedar BORDER is LIGHTER than the wood, so it
    // would be the loudest mark on the bar. It fails now for the opposite reason, and
    // the pin says which.
    expect(luminance(SHAFT_RULE)).toBeLessThan(luminance(SHAFT_BODY));   // a cut, not a highlight
    expect(ratio(SHAFT_RULE, SHAFT_BODY).toFixed(2)).toBe('1.41');
    expect(ratio(SHAFT_RULE, SHAFT_BODY)).toBeLessThan(ratio(FLETCH_VANE, SHAFT_BODY));
    expect(luminance(BORDER)).toBeGreaterThan(luminance(SHAFT_BODY)); // why BORDER cannot serve
  });
});
