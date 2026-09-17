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

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  AMBER_BG, AMBER_DEEP, BLUE, BLUE_BG, BODY, BORDER, BORDER_STRONG, CARD,
  GOLD, GOLD_DEEP, GOLD_SOFT,
  GOLD_TXT, GREEN, GREEN_BG, GREEN_DEEP, INK, INK_DEEP, MUTED, PARCH, PARCH_100, RED, RED_BG,
  SECOND, SLATE, SLATE_BG, SLATE_DEEP,
  swatch,
} from '../../src/components/theme.js';
// THE LIVING BACKDROP wash strength — imported (not hard-coded) so raising the
// backdrop opacity re-runs this contrast proof against the new value.
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
import { resolveTownMapStyle, ILLUSTRATED_STYLE_ID, TOWN_MAP_STYLE_IDS } from '../../src/design/townMapStyles.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
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

// ── THE LIVING BACKDROP wash (LB-c) — RETIRED by TE-STRIP-1 (owner ruling, ODQ §725) ──
// The library dossier's background WAS the last-viewed town map painted as an ink wash
// at WASH_INK_OPACITY; the whole surface (SettlementDossierBackdrop.jsx) left with the
// legacy settlement map, so the four AA arms that proved dossier copy legible over that
// wash — and the `composite()` helper written for them — have no subject and are removed.
// Every other ground in this file is unaffected: dossier copy still owes AA on plain
// PARCH, which the organic ink-ramp arms above already pin.

// ── THE ILLUSTRATED TOWN — GROUND DRESS legibility + colour-vision safety (IT-2) ─────
// The dress marks (farm furrows / woods stipple / water ripples / meadow / hedges / wall
// shadows / relief) are decorative GRAPHICS, so they owe the 3:1 non-text floor (1.4.11)
// at the mark's ink strength on the illustrated ground — comfortably cleared, with text-AA
// headroom (the low dress OPACITY is a deliberate texture-density choice, not a contrast
// failure, exactly like the organic hairline / landform stipple). And the marks carry ONLY
// the ink — never a district or water hue — so colour is NEVER the sole channel (pattern is
// the discriminator, colourblind-safe by construction). The accessible lens names no dress
// field, so it renders NONE of this and its palette contract is untouched.
// ⚰ THE ILLUSTRATED GROUND-DRESS legibility block (WCAG 1.4.11, 3:1 for non-text graphics)
// was retired with the mark layer it measured — the legacy settlement map's ground dress
// left under ODQ §725/§772. Nothing on a shipped surface draws those marks now, so the
// contrast law they owed has no subject; the accessible lens's own colour pins, which are
// about the LENS and not the dress, are unaffected and stay below.

// ── THE PAINTED ARROW HEADER (owner orders 2026-09-16) ────────────────────────────
// ⚰ THE HEADER'S FIVE CSS-ARROW DESCRIBES (the mid-russet dead band, the pale register per
// rider, the dark-ink vane, the gilt ladder and bole bed, the cedar shaft) were retired with
// the ribbon they measured: the header is now the owner's own painting, and its tokens left
// src/components/theme.js in the same change. THIS IS THE FOURTH MOVE OF THE HEADER'S
// GROUND (HZ-GROUNDMOVE), and every surviving foreground was re-measured on the new ground:
//   - on the painted WOOD itself (the focus ring's two tones, the active-page rule, the house
//     bronze as the negative control) the ground is pixels, not a token, so those riders are
//     measured on the shipped strip by tests/build/arrowHeaderAssets.test.js, and a re-cut
//     of the art reds there instead of shipping unmeasured contrast;
//   - the account's text now brings its OWN ground, the PARCH_100 label slip on the blank
//     plate (live text on the bare brass failed AA), so its riders are token pairs, here.
describe('THE PAINTED ARROW HEADER: the plate slip and the ring tones (the fourth ground move)', () => {
  const READ = (rel) => readFileSync(join(process.cwd(), rel), 'utf8');

  test('the slip\'s INK capitals clear AA on its PARCH_100 ground', () => {
    expect(ratio(INK, PARCH_100)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  test('the slip\'s status rules clear the 1.4.11 boundary floor on PARCH_100: gold signed out, green member, slate elevated', () => {
    expect(ratio(GOLD_TXT, PARCH_100)).toBeGreaterThanOrEqual(AA_UI);
    expect(ratio(GREEN, PARCH_100)).toBeGreaterThanOrEqual(AA_UI);
    expect(ratio(SLATE, PARCH_100)).toBeGreaterThanOrEqual(AA_UI);
  });

  test('the source spends exactly those tones: INK on PARCH_100, and the three rules by status', () => {
    const menu = READ('src/components/AccountMenu.jsx');
    expect(menu).toMatch(/background: PARCH_100, border: `1px solid \$\{rule\}`/);
    expect(menu).toMatch(/const rule = isAnon \? GOLD_TXT : isElevated \? SLATE : GREEN;/);
    expect(menu).toMatch(/color: INK, fontFamily: sans, fontWeight: 700/);
  });

  test('the ring\'s two tones are far apart (one of them always contrasts with the wood), and the controls spend them', () => {
    // INK clears 3:1 on the band's lit rows and PARCH_100 on its shaded rows (the asset
    // test measures both on the real pixels); between them the two-tone ring is ~15:1.
    expect(ratio(INK, PARCH_100)).toBeGreaterThanOrEqual(12);
    const control = READ('src/components/nav/ArrowControl.jsx');
    expect(control).toMatch(/'--sf-focus': INK,/);
    expect(control).toMatch(/outline: `2px solid \$\{PARCH_100\}`/);
    // The active-page rule under a painted word is PARCH_100, the tone that clears the
    // shaded rows it sits on (8.3:1 or more there, measured on the pixels).
    expect(READ('src/components/nav/ArrowHeader.jsx')).toMatch(/background: PARCH_100,/);
  });

  test('NEGATIVE CONTROL: the house bronze ring is not a slip tone (it is the tone the override replaces)', () => {
    const house = (READ('src/styles/a11y.css').match(/--sf-focus:\s*(#[0-9A-Fa-f]{6})/) || [])[1];
    expect(house).toBe('#a0762a');
    expect(ratio(house, PARCH_100)).toBeLessThan(ratio(INK, PARCH_100));
    expect(ratio(house, INK)).toBeLessThan(AA_TEXT);
  });
});
