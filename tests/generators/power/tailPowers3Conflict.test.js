/**
 * TAIL-POWERS-3 · batch 2 (READ-ALL rows 20273, B19612, 20194, 20963, 21564, 22394, 21066, 21067, 21062; the brief's law: a
 * line about the seat's rival needs a rival). The baseline conflict ladder (power/governanceNarrative.js ::
 * deriveBaselineConflict, written to powerStructure.recentConflict) set the seat against itself or against a body the
 * record does not hold:
 * - the crusader rung's "The commander-prelate has declared a heresy investigation ... The garrison is mobilizing." and
 *   the heresy rung's church courts ("A hedge wizard was dragged before the ecclesiastical court. The mages' quarter is
 *   very quiet", "The priest has summoned someone before the church court") where no church holds the seat and no
 *   religious power of weight stands (P16's G3 atom): the 7 commander-prelate towns of the 720 are all of that kind;
 * - "The church is demanding veto power over council appointments" under a church's own seat (Church, Ecclesiastical,
 *   High Theocratic Council, Priestly Guidance) or with no church of its own ("Access to parish church" only);
 * - "The military commanders are pushing for expanded authority over civilian courts, and <the seat> is losing ground"
 *   where the seat is the commanders' own (Military, Military City, Grand Military Council).
 * Each rung now needs its rival; the ladder's next rung prints (the existing lines, each with its own conditions).
 * A DECLARED MOVE: powerStructure.recentConflict in 29 towns of the 720, pressureSentence (its reader) in 9; nothing else.
 * Births as the census's 720 (each pair red at the base); KEEP: each line where its rival stands.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced?.[2], selectedStresses: [forced?.[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}

describe("TAIL-POWERS-3 · batch 2: a conflict line about the seat's rival needs the rival", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  /** seed -> [the conflict line that must NOT be written, the line written instead] */
  const CURED = /** @type {Record<string, [string, string]>} */ ({
    'r2r-city-18': ['The commander-prelate has declared a heresy investigation', 'A noble house has begun recruiting its own soldiers'],
    'r2r-metropolis-29': ['The commander-prelate has declared a heresy investigation', 'The merchant class is outbuying noble landholdings'],
    'r2r-city-20': ['The church is demanding veto power over council appointments', 'Ecclesiastical Council has been debating market levies'],
    'r2r-hamlet-41': ['The church is demanding veto power over council appointments', 'The most devout households want a say over who may trade and when'],
    'r2r-city-6': ['The military commanders are pushing for expanded authority over civilian courts', 'Military City Council has been debating market levies'],
    'r2r-metropolis-53': ['The military commanders are pushing for expanded authority over civilian courts', 'The church is demanding veto power over council appointments'],
    'r2r-metropolis-3': ['A hedge wizard was dragged before the ecclesiastical court', 'The military commanders are pushing for expanded authority over civilian courts'],
    'r2r-hamlet-55': ['The priest has summoned someone before the church court', 'The most devout households want a say over who may trade and when'],
  });
  for (const [seed, [was, now]] of Object.entries(CURED)) {
    it(`${seed}: the conflict reads "${now}", not "${was}"`, () => {
      const rc = String(born(seed).powerStructure.recentConflict || '');
      expectAbsentWithAnchor(rc, was, now, seed);
      expect(rc, seed).toContain(now);
    }, 120_000);
  }

  /** KEEP: each line where its rival stands. seed -> the line that still prints */
  const KEEP = /** @type {Record<string, string>} */ ({
    'r2r-town-54': 'The church is demanding veto power over council appointments', // a church of its own; a Feudal Appointee holds the seat
    'r2r-town-15': 'The military commanders are pushing for expanded authority over civilian courts', // a Guild Council holds the seat
    'r2r-metropolis-28': 'A hedge wizard was dragged before the ecclesiastical court', // a High Theocratic Council holds the seat
  });
  for (const [seed, keep] of Object.entries(KEEP)) {
    it(`KEEP ${seed}: "${keep}" still prints where its rival stands`, () => {
      expect(String(born(seed).powerStructure.recentConflict || ''), seed).toContain(keep);
    }, 120_000);
  }
});
