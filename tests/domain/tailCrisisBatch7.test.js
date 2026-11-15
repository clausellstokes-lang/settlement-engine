/**
 * TAIL-CRISIS batch 7 (TAIL-CRISIS-5, the chair's ruling K22 of 2026-11-15, vetoable by the owner): THE STORED STAKE ROW.
 * READ-ALL X9 22718, "Revolt Leadership has no stake yet · it could side with either camp" (8 towns, the exports): the slave
 * revolt's own leadership, pushed onto the roster by the crisis itself, was stored as untouched by it. A declared move of
 * stored text (granted): the stake keeps the waverer's `split` (no cast role moves) and its reason says it leads the revolt.
 *
 * One collected test on births of the census's own seeds (CENSUS-3 seedcfg.mjs, the r2s- arm, copied): each FALSE pair a
 * (seed, stored reason) red at 3f45e6fa9, with what is stored in its place; each KEEP pair a true sibling, green at both.
 */
import fs from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import * as cast from '../../src/domain/crisis/crisisCast.js';

const { STAKE_REASONS } = cast;
/** Read through the namespace, so the pairs run (and red) at a base that has no table. @type {Record<string, string>} */
const RAISED_TO_LEAD = /** @type {any} */ (cast).RAISED_TO_LEAD || {};

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
}, 120000);

/** The stored stake of a power in the town's slave revolt. @param {any} s @param {string} power */
const stakeOf = (s, power) => ([].concat(s.stress || []).find((/** @type {any} */ e) => e?.type === 'slave_revolt')?.cast?.stakes || [])
  .find((/** @type {any} */ k) => k.factionId === power);

/** [seed] where the leadership was stored as untouched (the 8 of the census). */
const FALSE = ['r2s-slave_revolt-town-0', 'r2s-slave_revolt-town-2', 'r2s-slave_revolt-city-1', 'r2s-slave_revolt-city-3',
  'r2s-slave_revolt-metropolis-0', 'r2s-slave_revolt-metropolis-1', 'r2s-slave_revolt-metropolis-2', 'r2s-slave_revolt-metropolis-3'];

describe('the revolt\'s own leadership is never untouched by the revolt', () => {
  it.each(FALSE)('%s stores "it leads the revolt", keeping the waverer\'s split (red at 3f45e6fa9: "it could side with either camp")', (seed) => {
    const k = stakeOf(birth(seed), 'Revolt Leadership');
    expect(k?.reason).not.toBe(STAKE_REASONS.untouched);
    expect(k).toEqual({ factionId: 'Revolt Leadership', stake: 'split', reason: 'it leads the revolt, and rises or falls with it' });
  });
  it.each(['r2s-slave_revolt-hamlet-2', 'r2s-slave_revolt-village-2'])('%s KEEPS its earlier rule: the leadership outweighs the seat (gains)', (seed) => {
    expect(stakeOf(birth(seed), 'Revolt Leadership')).toEqual({ factionId: 'Revolt Leadership', stake: 'gains', reason: STAKE_REASONS.gainsRival });
  });
  it('KEEPS a power the revolt did not raise as untouched (r2s-slave_revolt-metropolis-0, Arcane Orders)', () => {
    expect(stakeOf(birth('r2s-slave_revolt-metropolis-0'), 'Arcane Orders')?.reason).toBe(STAKE_REASONS.untouched);
  });
  it('the table names the roster\'s own literal, pushed under the kind it names (stressFactions.js)', () => {
    const src = fs.readFileSync(new URL('../../src/generators/power/stressFactions.js', import.meta.url), 'utf8');
    for (const name of Object.values(RAISED_TO_LEAD)) expect(src, name).toContain(`faction: '${name}'`);
    expect(Object.keys(RAISED_TO_LEAD)).toEqual(['slave_revolt']);
  });
});
