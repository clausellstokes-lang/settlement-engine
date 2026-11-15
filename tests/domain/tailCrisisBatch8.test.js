/**
 * TAIL-CRISIS batch 8 (TAIL-CRISIS-6, the chair's rulings K24 and K25 of 2026-11-15, vetoable by the owner): A POWER THE
 * CRISIS ITSELF RAISED HAS THE STAKE ITS NAME SAYS. The famine's Grain Holders, the plague's Quarantine Council and the
 * betrayal's Inquiry (K24), and every other power a crisis raises or writes into (K25 (a)), were stored as untouched by their
 * own crisis ("has no stake yet · it could side with either camp"). A declared move of stored text (granted): each keeps the
 * waverer's `split` (K22's form: no cast role moves) and its reason says what its own record holds (`crisisCast.js ::
 * RAISED_BY_CRISIS`, read by the description the crisis gave it, so a name re-drawn at the label close keeps its stake: "The
 * Establishment" and "The Administrative Circle" below).
 *
 * One collected test on births of the census's own seeds (CENSUS-3 seedcfg.mjs, the r2s- arm, copied): each FALSE pair a
 * (seed, power, stored reason) red at aa78d1ec9 ("it could side with either camp"), with what is stored in its place; each
 * KEEP pair a true sibling, green at both.
 */
import fs from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import * as cast from '../../src/domain/crisis/crisisCast.js';

/** Read through the namespace, so the pairs run (and red) at a base that has no table. @type {Record<string, string>} */
const STAKE_REASONS = /** @type {any} */ (cast).STAKE_REASONS;
/** @type {ReadonlyArray<readonly [string, string, string, boolean?]>} */
const RAISED_BY_CRISIS = /** @type {any} */ (cast).RAISED_BY_CRISIS || [];

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** @type {Map<string, any>} */
const born = new Map();
/** @type {(seed: string) => any} */
let birth;

beforeAll(async () => {
  const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  await loadGenerationLawPayloads();
  birth = (seed) => {
    if (born.has(seed)) return born.get(seed);
    const m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
    if (!m) throw new Error(`no configuration for ${seed}`);
    const cfg = birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
    const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
    born.set(seed, s);
    return s;
  };
}, 240000);

/** The stored stake of a power in the town's crisis of a kind. @param {any} s @param {string} kind @param {string} power */
const stakeOf = (s, kind, power) => ([].concat(s.stress || []).find((/** @type {any} */ e) => e?.type === kind)?.cast?.stakes || [])
  .find((/** @type {any} */ k) => k.factionId === power);

/** [seed, kind, power, the reason now stored] where the crisis's own power was stored as untouched (the census's r2s- arm). */
const FALSE = /** @type {Array<[string, string, string, string]>} */ ([
  ["r2s-famine-village-2", "famine", "Grain Holders", "holdsFood"],
  ["r2s-famine-town-2", "famine", "Grain Holders", "holdsFood"],
  ["r2s-famine-city-1", "famine", "Grain Holders", "holdsFood"],
  ["r2s-famine-city-2", "famine", "Grain Holders", "holdsFood"],
  ["r2s-famine-city-3", "famine", "Grain Holders", "holdsFood"],
  ["r2s-famine-metropolis-0", "famine", "Grain Holders", "holdsFood"],
  ["r2s-famine-metropolis-2", "famine", "Grain Holders", "holdsFood"],
  ["r2s-famine-metropolis-3", "famine", "Grain Holders", "holdsFood"],
  ["r2s-recently_betrayed-village-0", "recently_betrayed", "The Inquiry", "leadsInquiry"],
  ["r2s-recently_betrayed-village-2", "recently_betrayed", "The Inquiry", "leadsInquiry"],
  ["r2s-recently_betrayed-town-2", "recently_betrayed", "The Inquiry", "leadsInquiry"],
  ["r2s-recently_betrayed-town-3", "recently_betrayed", "The Inquiry", "leadsInquiry"],
  ["r2s-recently_betrayed-city-0", "recently_betrayed", "The Inquiry", "leadsInquiry"],
  ["r2s-recently_betrayed-metropolis-1", "recently_betrayed", "The Inquiry", "leadsInquiry"],
  ["r2s-recently_betrayed-metropolis-2", "recently_betrayed", "The Inquiry", "leadsInquiry"],
  ["r2s-recently_betrayed-metropolis-3", "recently_betrayed", "The Inquiry", "leadsInquiry"],
  ["r2s-plague_onset-town-1", "plague_onset", "Quarantine Council", "chargedWithSickness"],
  ["r2s-plague_onset-city-0", "plague_onset", "Quarantine Council", "chargedWithSickness"],
  ["r2s-plague_onset-city-1", "plague_onset", "Quarantine Council", "chargedWithSickness"],
  ["r2s-plague_onset-city-2", "plague_onset", "Quarantine Council", "chargedWithSickness"],
  ["r2s-plague_onset-metropolis-0", "plague_onset", "Quarantine Council", "chargedWithSickness"],
  ["r2s-plague_onset-metropolis-0", "plague_onset", "The Establishment", "chargedWithSickness"],
  ["r2s-plague_onset-metropolis-1", "plague_onset", "Quarantine Council", "chargedWithSickness"],
  ["r2s-plague_onset-metropolis-1", "plague_onset", "The Administrative Circle", "chargedWithSickness"],
  ["r2s-plague_onset-metropolis-2", "plague_onset", "Quarantine Council", "chargedWithSickness"],
  ["r2s-plague_onset-metropolis-3", "plague_onset", "Quarantine Council", "chargedWithSickness"],
]);

describe('a power the crisis itself raised is never stored as untouched by it', () => {
  it.each(FALSE)('%s (%s): %s stores its own stake, keeping the waverer\'s split (red at aa78d1ec9: "it could side with either camp")', (seed, kind, power, key) => {
    const k = stakeOf(birth(seed), kind, power);
    expect(k?.reason).not.toBe('it could side with either camp');
    expect(k).toEqual({ factionId: power, stake: 'split', reason: STAKE_REASONS[key] });
  });
  it('KEEPS a power the crisis did not raise as untouched (r2s-slave_revolt-metropolis-0, Arcane Orders)', () => {
    expect(stakeOf(birth('r2s-slave_revolt-metropolis-0'), 'slave_revolt', 'Arcane Orders')?.reason).toBe('it could side with either camp');
  });
  it('KEEPS the slave revolt\'s leadership on its K22 row (r2s-slave_revolt-town-0)', () => {
    expect(stakeOf(birth('r2s-slave_revolt-town-0'), 'slave_revolt', 'Revolt Leadership')?.reason).toBe('it leads the revolt, and rises or falls with it');
  });

  it('each row names the roster\'s own description, written under the kind it names (stressFactions.js)', () => {
    const src = fs.readFileSync(new URL('../../src/generators/power/stressFactions.js', import.meta.url), 'utf8');
    expect(RAISED_BY_CRISIS.length).toBeGreaterThan(0);
    for (const [kind, opening, key] of RAISED_BY_CRISIS) {
      const at = src.indexOf(`ke('${kind}')`), next = src.indexOf(" ke('", at + 4);
      expect(at, kind).toBeGreaterThan(-1);
      expect(src.slice(at, next < 0 ? undefined : next), `${kind}: ${opening}`).toContain(opening);
      expect(typeof STAKE_REASONS[key], key).toBe('string');
    }
  });
});
