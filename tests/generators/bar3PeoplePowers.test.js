/**
 * bar3PeoplePowers.test.js — BAR3-PEOPLE batch 2 (REVIEW-BAR-3 C5598, the wide read C7553; the chair's direction P2 and
 * word of 2026-11-15 19:53, vetoable by the owner), on births: "Holds the title; the decisions that matter are made by
 * <power>." prints on the governing power's crisis note only where the record holds NO relation row of the governing
 * power and that power: a relation row of the pair is the pair's one home (it says "the two do not agree on who
 * decides", "taxes are bargained over, not ordered", "each props up the other"), and beside it the note claims no
 * decider. THE REST OF THE NOTE (the fracture reading) STILL PRINTS. Page only: no record moves.
 * RED AT THE BASE (52f0a1684): every refused town; KEEP towns green before and after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { APPEARS_TO_GOVERN, crisisNoteFor } from '../../src/domain/dossier/powerStrata.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape (r2r-) @param {string} seed */
function born(seed) {
  const m = seed.match(/^r2r-(\w+)-\d+$/);
  if (!m) throw new Error(`no shape for ${seed}`);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} });
}

const SAID = 'Holds the title; the decisions that matter are made by';
/** [town, the power the note must not name as deciding] (the pair holds a relation row) */
const ROWS = /** @type {Array<[string, string]>} */ ([
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit) (A JUDGEMENT, AT ANOTHER SIZE): r2r-village-1's governing note lit carries no claim, and no r2r-village of
  // 0..799 (nor hamlet, thorp or town of 0..199) holds the Merchant Guilds as the decider beside a relation row of the pair; the
  // lowest r2r-city that does is city-51 (alone of 0..199; the Arcane Council governs)
  ['r2r-city-51', 'Merchant Guilds'],
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): the governing powers of r2r-village-9 and -41 lit carry no claim on their note; the two lowest r2r-villages
  // whose governing note carries it, with the Religious Authorities the decider and a relation row of the pair, are village-28
  // and -29 (28 29 34 50 105 150 168 172 of 0..172)
  ['r2r-village-28', 'Religious Authorities'],
  ['r2r-village-29', 'Religious Authorities'],
]);
/** KEEP: [town, the deciding power still named] (no relation row of the pair) */
const KEEP = /** @type {Array<[string, string]>} */ ([
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): r2r-thorp-25's governing note lit carries no claim; the lowest r2r-thorp whose note carries it, with the
  // People's Council the decider and no relation row of the pair, is thorp-264 (alone of 0..799)
  ['r2r-thorp-264', "People's Council"],
  ['r2r-town-5', "People's Council"],
]);

/** @type {Record<string, { note: string, raw: string }>} */
const notes = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const [seed] of [...ROWS, ...KEEP]) {
    const s = born(seed);
    const gov = (s.powerStructure?.factions || []).find((/** @type {any} */ f) => f.isGoverning);
    notes[seed] = { note: crisisNoteFor(/** @type {any} */ (s), gov), raw: String(gov?.crisisNote ?? '') };
  }
}, 600000);

describe('BAR3-PEOPLE · the note names a decider only where no relation row of the pair speaks (P2)', () => {
  for (const [seed, power] of ROWS) {
    it(`${seed}: not "${SAID} ${power}."; the rest of the note prints`, () => {
      const { note, raw } = notes[seed];
      // the record carries the governing claim's marker; what prints is the rest of the note (silent by design where the
      // marker was the whole note), and it names no decider
      expect(raw).toContain(APPEARS_TO_GOVERN);
      expect(note).toBe(raw.replace(APPEARS_TO_GOVERN, '').replace(/\s{2,}/g, ' ').trim());
      expect(`${note} `.includes(`${SAID} ${power}.`)).toBe(false);
    });
  }
  for (const [seed, power] of KEEP) {
    it(`KEEP ${seed}: the note still names ${power}`, () => {
      expect(notes[seed].note).toContain(`${SAID} ${power}.`);
    });
  }
});
