// THE CORPUS LANE'S CURE GUARDS (W2-WRITE, the read of 2026-11-13, finding M5: "no guard reds when a
// cure's crisis disqualifier is undone or mis-written").
//
// Every disqualifier cure on the dossier's state prose (docs/content/RECEIPT_POOLS_DOSSIER_STATE.md and the
// files generated from it) has a row here: a FIXED TOWN, born as the app births it, in which the cured line
// must not be eligible. Each row also proves the town still reaches the pool, so a guard can never pass
// because its town drifted away from the case it guards: a town that no longer reads the pool reds by name,
// and the row is re-keyed to a new town (by identity, with the cause), never dropped.
//
// The town is born in the app's own configuration shape: DEFAULT_CONFIG as the store ships it, the stress
// panel with Random off (`selectedStressesRandom: false`, the ticked crises), and the priorities randomised.
// Every public prose site is then drawn as the owner's page draws it, and the kernel's draw records which
// lines of each pool were eligible.
import { beforeAll, describe, expect, it, vi } from 'vitest';

const seen = vi.hoisted(() => ({ cur: /** @type {Record<string, Set<number>>|null} */ (null) }));

vi.mock('../../src/domain/display/stateProse/stateProseKernel.js', async (importOriginal) => {
  const kernel = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...kernel,
    drawVariant: (/** @type {any[]} */ eligible, /** @type {string} */ blockId, /** @type {string} */ poolKey, /** @type {string} */ seed) => {
      if (seen.cur) {
        const row = (seen.cur[`${blockId}::${poolKey}`] ||= new Set());
        for (const variant of eligible || []) row.add(variant.vid);
      }
      return kernel.drawVariant(eligible, blockId, poolKey, seed);
    },
  };
});

/**
 * One row per cure: the town (its seed names its size and its ticked crises), the pool, the cured line's
 * vid, and what makes the line false there. A row marked `by: 'record'` guards a line the public sites
 * never draw (a `dm-only` line, read on the owner's page only): it reads the fixed town's own record
 * against the line's declaration through the kernel's one rule, and its control is that another line of
 * the same pool is admitted there.
 * @type {ReadonlyArray<{seed: string, pool: string, vid: number, why: string, by?: 'record'}>}
 */
const GUARDS = [
  { seed: 'w5-village-under_siege-1', pool: 'DS-ECO-9::DEFICIT', vid: 1, why: 'a siege: "not enough comes in" presumes a road that is open (the second seat\'s `no crisis: under_siege`)' },
  { seed: 'w5-village-under_siege-1', pool: 'DS-DEF-2::Invasion & War: neither walls nor force', vid: 5, why: 'a siege: "each household is deciding for itself whether to stay" where nobody can leave (LINES-READ, village-under_siege-1)' },
  { seed: 'w5-hamlet-occupied-2', pool: 'DS-DEF-2::Invasion & War: neither walls nor force', vid: 4, why: 'an occupation: "the threat now at hand has noticed both" of a town the threat already holds' },
  { seed: 'w5-town-under_siege-1', pool: 'DS-DEF-2::Invasion & War: walls with NO force', vid: 6, why: 'a town watch: "had nobody to put on its walls until the siege came" (the read\'s H3; its siblings v1-v3 carry `no watch`)' },
  { seed: 'rww-town-occupied-1', pool: 'DS-DEF-2::Invasion & War: walls with NO force', vid: 4, why: 'an occupation: "kept by its watch and nobody else" beside the occupiers\' troops (the read\'s H5, its own town)' },
  { seed: 'w5-hamlet-occupied-104', pool: 'DS-DEF-2::Invasion & War: walls with NO force', vid: 1, why: 'an occupation: "has walls and nobody to put on them" of walls the occupier holds' },
  { seed: 'w5-town-monster_pressure-2', pool: 'DS-DEF-2::Beasts & Monsters: settled, nothing organized', vid: 6, why: 'a town watch: "nothing organised against what has come out of the country" (the read\'s H4)' },
  { seed: 'w5-village-under_siege-3', pool: 'DS-DEF-2::Beasts & Monsters: settled, nothing organized', vid: 6, why: 'a siege: the threat at hand is an army, not what came out of the country' },
  { seed: 'w5-hamlet-occupied-2', pool: 'DS-DEF-2::Beasts & Monsters: settled, nothing organized', vid: 6, why: 'an occupation with no beasts on the page (the read\'s H4, Malotsy)' },
  { seed: 'w5-metropolis-under_siege-6', pool: 'DS-GEN-17::GREAT HOUSE: monastery', vid: 1, why: 'a siege: "a common sight on the way into" a town nobody can enter by road (the read\'s H5)' },
  { seed: 'w5-town-under_siege-102', pool: 'DS-GEN-17::GREAT HOUSE: monastery', vid: 3, why: 'a siege: "anyone new ... is sent to the monks" where nobody new arrives' },
  { seed: 'w5-metropolis-under_siege-2', pool: 'DS-DEF-5::garrison PRESENT', vid: 3, why: 'a siege: "everyone entering is counted at the gate" of a town nobody enters' },
  { seed: 'w5-thorp-under_siege-3', pool: 'DS-ECO-12::INCOME WEIGHT: the religious houses', vid: 4, why: 'a siege: "the feast days set the calendar of buying and selling" where nothing is bought or sold (the read\'s H5)' },
  { seed: 'w5-thorp-under_siege-3', pool: 'DS-ECO-12::INCOME WEIGHT: the religious houses', vid: 3, why: 'a siege: "what its people give for their faith leaves with them on the feast days" out of a town nobody leaves' },
  { seed: 'rww-city-under_siege-1', pool: 'DS-GEN-13::MARKET-OPEN', vid: 3, why: 'a siege: "Visitors find X\'s market without asking" beside a market critically impaired by the siege (the read\'s M2)' },
  { seed: 'rww-metropolis-under_siege-1', pool: 'DS-GEN-13::MARKET-OPEN', vid: 3, why: 'a siege: the same (the read\'s M2, its second town)' },
  { seed: 'rw3-town-under_siege-1', pool: 'DS-GEN-13::MARKET-OPEN', vid: 4, why: 'a siege: "The market stands where carts always stopped" beside "the caravans have stopped coming" (the read\'s M4, #964)' },
  { seed: 'w5-city-slave_revolt-102', pool: 'DS-POW-6::capture pressure ADVANCING (weak security, poor prosperity)', vid: 7, by: 'record', why: 'a slave revolt: "its watch keeps the streets" while the revolt holds them (LINES-READ, slave_revolt-town-3)' },
  { seed: 'w5-city-slave_revolt-102', pool: 'DS-POW-6::capture pressure ADVANCING (weak security, poor prosperity)', vid: 8, by: 'record', why: 'a slave revolt: "A watch walks X\'s streets" (v7\'s twin)' },
  { seed: 'rww-metropolis-under_siege-1', pool: 'DS-GEN-18::STALLED', vid: 2, why: 'a siege: "depends on goods brought in from outside" as if they still came (the read\'s M6; the siege twin is v4)' },
  { seed: 'rww-metropolis-under_siege-1', pool: 'DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks', vid: 3, why: 'a siege over fifteen months of grain in the granary: "none of the grain ... has reached it, and that work has stopped or soon will" (the read\'s reason for v4, struck; v3 takes its draws)' },
  { seed: 'w5-city-plague_onset-3', pool: 'DS-ECO-1::COMBINATION C4: a low rung on a working approach', vid: 1, why: 'a plague\'s quarantine: "Trade comes and goes by X\'s river" beside "Nobody comes into X and nobody leaves" (the defence page\'s QUARANTINE ACTIVE override)' },
  { seed: 'rww-metropolis-under_siege-1', pool: 'DS-ECO-11::EXPLOITATION: fullyExploited', vid: 3, why: 'a siege: "carried through here from start to finish, from what the country gives" of a town whose fields and trade have stopped (v1, its twin, carries `no crisis: under_siege`)' },
  { seed: 'rww-city-under_siege-1', pool: 'DS-ECO-10::POSTURE: established', vid: 5, why: 'a siege: "More than one of X\'s goods finds a buyer beyond the town" where nothing goes out by road (its siblings v2-v4, v6 carry `no crisis: under_siege`; v7 is the siege row)' },
  { seed: 'w5-city-plague_onset-3', pool: 'DS-ECO-9::HOW THE NEED IS MET: much of it brought in', vid: 1, why: 'a plague\'s quarantine: "Food carts come into X most days" beside "Nobody comes into X and nobody leaves"' },
  { seed: 'w5-city-plague_onset-3', pool: 'DS-ECO-9::HOW THE NEED IS MET: much of it brought in', vid: 2, why: 'a plague\'s quarantine: "the rest comes in from the farms around it and from trade" beside "Nobody comes into X and nobody leaves"' },
  { seed: 'w5-city-plague_onset-3', pool: 'DS-ECO-9::HOW THE NEED IS MET: much of it brought in', vid: 3, why: 'a plague\'s quarantine: "everyone knows when the next load is due" beside "Nobody comes into X and nobody leaves"' },
];

/** @param {string} seed */
function configOf(seed) {
  const m = seed.match(/^[a-z0-9]+-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-(\d+)$/);
  if (!m) throw new Error(`a guard seed names its size and crises: ${seed}`);
  return { settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true };
}

/** @type {Map<string, Record<string, Set<number>>>} */
const READ = new Map();
/** @type {Map<string, object>} */
const FACTS = new Map();
/** @type {Record<string, any>} */
const CORPUS = {};
/** @type {{ variantFactDeclaration?: Function, declarationAdmits?: Function }} */
const RULE = {};

beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
  const { composePublicProse, PUBLIC_PROSE_SITES } = await import('../../src/components/new/publicProseCompose.js');
  const { publicVeiledRecordOf } = await import('../../src/domain/display/publicSafe.js');
  const { factsOf } = await import('../../src/domain/facts/factsOf.js');
  const kernel = await import('../../src/domain/display/stateProse/stateProseKernel.js');
  const vocabulary = await import('../../src/domain/facts/factVocabulary.js');
  RULE.variantFactDeclaration = kernel.variantFactDeclaration;
  RULE.declarationAdmits = vocabulary.declarationAdmits;
  for (const desk of ['defense', 'economy', 'general', 'power', 'stressors', 'warFaith']) {
    const leaf = Object.values(await import(`../../src/data/dossierStateProse/${desk}.generated.js`)).find((v) => v && typeof v === 'object');
    for (const [blockId, block] of Object.entries(leaf)) CORPUS[blockId] = block;
  }
  await boundary.loadGenerationLawPayloads();
  for (const seed of new Set(GUARDS.map((g) => g.seed))) {
    let town = generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} });
    town = withPublicProse(town, composePublicProse(town));
    seen.cur = {};
    const ctx = { veiledRecord: publicVeiledRecordOf(town) };
    for (const [, draw] of PUBLIC_PROSE_SITES) {
      try { draw(town, false, ctx); } catch { /* a site that throws prints nothing; the row's own control says so */ }
    }
    READ.set(seed, seen.cur);
    FACTS.set(seed, factsOf(town));
    seen.cur = null;
  }
}, 300000);

describe('a cured line is not eligible in the fixed town that made it false', () => {
  for (const g of GUARDS) {
    it(`${g.pool} v${g.vid} at ${g.seed}: ${g.why}`, () => {
      if (g.by === 'record') {
        const [blockId, ...rest] = g.pool.split('::'); const key = rest.join('::');
        const block = CORPUS[blockId]; const pool = block?.pools?.[key] || [];
        const crisisScoped = block?.poolMeta?.[key]?.crisisScoped === true;
        const admits = (/** @type {any} */ v) => RULE.declarationAdmits?.(RULE.variantFactDeclaration?.(v), FACTS.get(g.seed), { crisisScoped }).admitted;
        expect(pool.filter((v) => v.vid !== g.vid).some(admits), `${g.seed}'s record admits no other line of ${g.pool}: re-key the row`).toBe(true);
        expect(admits(pool.find((v) => v.vid === g.vid)), `${g.pool} v${g.vid} is admitted by ${g.seed}'s record`).toBe(false);
        return;
      }
      const pools = READ.get(g.seed) || {};
      expect(Object.keys(pools), `${g.seed} no longer reads ${g.pool}: re-key the row to a town of the case`).toContain(g.pool);
      expect([...pools[g.pool]], `${g.pool} v${g.vid} is eligible at ${g.seed}`).not.toContain(g.vid);
    });
  }
});
