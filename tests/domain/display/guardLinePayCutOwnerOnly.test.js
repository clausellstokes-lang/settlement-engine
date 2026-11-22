/**
 * GUARDLINE-HK1 (1) (PAGE-12's brief of 2026-11-22; the chair's ruling 22, option (a); vetoable by the owner): THE GUARD
 * LINE'S PAY-CUT TWIN IS AN OWNER-ONLY TWIN, held as a differential.
 *
 * `display/guardLineUnderTheLaw.js :: guardLineUnderTheForce` swaps a "well paid" claim for its pay-cut twin
 * (`PAY_CUT_TWINS`) where `facts/orderForce.js :: orderForceOf(record).payCut` holds, and `payCut` reads
 * `npcs[].settlementCondition`, which no shared read serves. So on a shared read the guard line is the line a place with no
 * cut prints: not a leak (nothing on the served page lets a reader infer the cut), an owner-only twin. Held here:
 *   (a) on a SHARED READ (`toPublicSafe`, and the gallery's default veil over it) a place WITH the cut prints the same guard
 *       line as that place with the cut REMOVED (its twin: every soldier's `settlementCondition` cleared), at every size of
 *       `tests/components/pageCensusWalk.shared.mjs :: SIZES`;
 *   (b) the OWNER'S read of the place with the cut prints the pay-cut twin, and of the place without it the plain line;
 *   (c) the cases DISCRIMINATE: where the stored line makes a well-paid claim, (b)'s two owner lines differ.
 *
 * THE PLACES. Born (the banked corpus `r2`, born as `pageCensusWalk.shared.mjs :: configOf` births it; each the first of its
 * size whose owner record holds the cut): hamlet, village, town, city, metropolis. PLANTED: the thorp (no thorp of the 360
 * holds the cut: no soldier is on a thorp's cast), a born thorp with one planted soldier carrying the condition. Only one
 * birth of the 720 holds both the cut and a well-paid stored line (`r2s-slave_revolt-city-0`, the city here), so each place
 * is also read with its stored guard line PLANTED as that birth's own well-paid line (taken from the record, never quoted),
 * which makes (c) hold at every size.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { toPublicSafe } from '../../../src/domain/display/publicSafe.js';
import { applyVeil, defaultVeilFor, resolveVeil } from '../../../src/domain/display/galleryVeil.js';
import { deriveGuardAssessment } from '../../../src/domain/display/defenseDisplay.js';
import { orderForceOf } from '../../../src/domain/facts/orderForce.js';
import { SIZES, configOf } from '../../components/pageCensusWalk.shared.mjs';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

/** Each size's place: a born seed of `r2` whose owner record holds the cut, or (thorp) a born seed the soldier is planted on. */
const PLACES = Object.freeze([
  { size: 'thorp', seed: 'r2r-thorp-0', crisis: null, planted: true },
  { size: 'hamlet', seed: 'r2r-hamlet-6', crisis: null, planted: false },
  { size: 'village', seed: 'r2r-village-3', crisis: null, planted: false },
  { size: 'town', seed: 'r2r-town-20', crisis: null, planted: false },
  { size: 'city', seed: 'r2s-slave_revolt-city-0', crisis: 'slave_revolt', planted: false },
  { size: 'metropolis', seed: 'r2s-occupied-metropolis-1', crisis: 'occupied', planted: false },
]);
/** The well-paid claims `PAY_CUT_TWINS` answers (their heads, as `bar6CrimeOneReading.test.js`'s WELL_PAID reads them). */
const WELL_PAID = /^The (.+?) (?:is|are) (?:well paid|disciplined, paid in full)\b/;
/** The pay-cut twins' own words (`PAY_CUT_TWINS`, not exported: its two tellings, as `bar6CrimeOneReading.test.js` reads the first). */
const PAY_CUT_WORDS = /\bthough (?:the pay for keeping order is being cut|short of pay)\b/;
/** The hard-times condition whose line says the pay of those keeping order is cut (`orderForce.js`'s `payCut`). */
const CUT = 'economic_stress';

/** The gallery's hiding read: `toPublicSafe`, then the veil's default set over it. @param {any} r */
const veiled = (r) => { const pub = toPublicSafe(r); return applyVeil(pub, resolveVeil(defaultVeilFor(pub), null)); };
/** The place with the cut removed: every soldier's condition cleared. @param {any} r */
const cutRemoved = (r) => {
  const twin = structuredClone(r);
  for (const n of twin.npcs ?? []) if (n?.category === 'military' && n.settlementCondition === CUT) delete n.settlementCondition;
  return twin;
};
/** The place with its stored guard line planted as the born well-paid line. @param {any} r @param {string} line */
const wellPaid = (r, line) => {
  const out = structuredClone(r);
  out.economicState.safetyProfile.guardEffectivenessDesc = line;
  return out;
};

/** @type {Array<{ size: string, seed: string, planted: boolean, doc: any }>} */ let places = [];
/** The one born well-paid line beside the cut (the city's stored line). */ let WELL_LINE = '';

beforeAll(async () => {
  await loadGenerationLawPayloads();
  places = PLACES.map((p) => {
    const doc = /** @type {any} */ (generateSettlementPipeline(configOf(p, DEFAULT_CONFIG, birthConfig), null, { seed: p.seed, customContent: {} }));
    if (p.planted) doc.npcs = [...(doc.npcs ?? []), { id: 'planted-soldier', name: 'Planted Soldier', category: 'military', settlementCondition: CUT }];
    return { size: p.size, seed: p.seed, planted: p.planted, doc };
  });
  WELL_LINE = String(places.find((p) => p.size === 'city')?.doc.economicState.safetyProfile.guardEffectivenessDesc);
}, 240_000);

describe('the guard line\'s pay-cut twin is the owner\'s alone (GUARDLINE-HK1 (1))', () => {
  it('the places: one per size, born where a birth holds the cut, the thorp planted; the city born well paid beside its cut', () => {
    expect(places.map((p) => p.size)).toEqual([...SIZES]);
    expectNoSeedFailures(collectSeedFailures(places, (p) => {
      expect(orderForceOf(p.doc).payCut, `${p.seed}: the owner record holds the cut`).toBe(true);
      expect(orderForceOf(cutRemoved(p.doc)).payCut, `${p.seed}: its twin holds none`).toBe(false);
      expect(typeof deriveGuardAssessment(p.doc), `${p.seed}: the place prints a guard line`).toBe('string');
    }), 'each size\'s place holds the cut, its twin does not, and the guard line prints');
    expect(WELL_LINE).toMatch(WELL_PAID);
  });

  it('(a) on a shared read the place with the cut prints what the place without it prints, at every size, stored and well paid', () => {
    expectNoSeedFailures(collectSeedFailures(places, (p) => {
      for (const [label, doc] of /** @type {Array<[string, any]>} */ ([['as born', p.doc], ['well paid', wellPaid(p.doc, WELL_LINE)]])) {
        const twin = cutRemoved(doc);
        expect(deriveGuardAssessment(toPublicSafe(doc)), `${p.seed} ${label}: toPublicSafe`).toBe(deriveGuardAssessment(toPublicSafe(twin)));
        expect(deriveGuardAssessment(veiled(doc)), `${p.seed} ${label}: the gallery's default veil`).toBe(deriveGuardAssessment(veiled(twin)));
        expect(orderForceOf(toPublicSafe(doc)).payCut, `${p.seed} ${label}: no shared read serves the cut`).toBe(false);
      }
    }), 'a shared read prints the twin\'s guard line');
  });

  it('(b) the owner of the place with the cut prints the pay-cut twin; of the place without it, the plain line', () => {
    expectNoSeedFailures(collectSeedFailures(places, (p) => {
      const doc = wellPaid(p.doc, WELL_LINE);
      const owner = String(deriveGuardAssessment(doc));
      const plain = String(deriveGuardAssessment(cutRemoved(doc)));
      expect(owner, `${p.seed}: the owner's line is the twin`).toMatch(PAY_CUT_WORDS);
      // anchored: the same place's plain line matches WELL_PAID two lines below, and this line matches PAY_CUT_WORDS above
      expect(owner, p.seed).not.toMatch(WELL_PAID);
      expect(plain, `${p.seed}: the plain line keeps the claim`).toMatch(WELL_PAID);
      // anchored: the same place's owner line with the cut matches PAY_CUT_WORDS above
      expect(plain, p.seed).not.toMatch(PAY_CUT_WORDS);
      expect(deriveGuardAssessment(veiled(doc)), `${p.seed}: the served line is the plain line`).toBe(plain);
    }), 'the owner reads the twin, the place without the cut the plain line');
  });

  it('(c) the differential discriminates: the owner\'s two lines differ, on the born city with no plant and at every size planted', () => {
    const city = /** @type {{ doc: any }} */ (places.find((p) => p.size === 'city'));
    expect(deriveGuardAssessment(city.doc)).not.toBe(deriveGuardAssessment(cutRemoved(city.doc)));
    expect(deriveGuardAssessment(city.doc)).toMatch(PAY_CUT_WORDS);
    expectNoSeedFailures(collectSeedFailures(places, (p) => {
      const doc = wellPaid(p.doc, WELL_LINE);
      expect(deriveGuardAssessment(doc), p.seed).not.toBe(deriveGuardAssessment(cutRemoved(doc)));
    }), 'the owner\'s line with the cut differs from the line without it');
  });
});
