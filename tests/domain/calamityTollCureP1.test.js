/**
 * calamityTollCureP1.test.js — CURE LANE FP-P1, unit U2 (FPQ-22; FP EXPERIENCE READ 1, worst
 * sentence 2 and fault P3):
 *
 *   'A great calamity has fallen on Invershaw. The toll is 2 institutions lie in ruin, some 166
 *    dead, and many take flight along the roads.'
 *
 * Two faults in one receipt. The composer (calamityKernel.js :: strikeNews) handed the pool a
 * bare digit for each count, and the pool's third telling (eventProse.js :: CALAMITY_SUMMARIES)
 * set a whole clause after "The toll is". The counts now reach the reader in the estate's own
 * number idiom, measured rather than invented: a small count through `display/numberWords.js ::
 * numberWord` (THE ONE SPELLING OF A SMALL COUNT) and a head count through
 * `demographicsHerald.js :: quantityWords` (the Herald's closed quantity vocabulary, the one its
 * burial and departure lines already speak). The clause reads "The toll: <clause>, <dead>".
 *
 * The fixture reproduces the read's sentence byte for byte at the base: a town named Invershaw
 * whose two strikable institutions fall, 3,320 souls at the stub's five-percent death draw
 * (166 dead), and a tick whose seed selects the third telling.
 */
import { describe, it, expect } from 'vitest';
import { advanceCalamity } from '../../src/domain/worldPulse/calamityKernel.js';
import { fnv1a32 } from '../../src/domain/worldPulse/eventProse.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

// The integration suite's key-aware stub (calamity.kernel.integration.test.js): the strike
// DECISION fires for the target only, K takes its maximum, and every other draw is zero.
function stubRng(target) {
  const val = (key) => {
    const m = /^disaster:([^:]+):\d+$/.exec(key);
    if (m) return m[1] === target ? 0 : 0.99;
    if (/^disaster:k:/.test(key)) return 0.99;
    return 0;
  };
  const make = (key) => ({ random: () => val(key), fork: (k) => make(k) });
  return { fork: (k) => make(k) };
}

const HALL = Object.freeze({ name: 'Town hall', required: true, category: 'civic' });
const TWO_FALL = Object.freeze([HALL, { name: 'Tannery', category: 'crafts' }, { name: 'Chandlery', category: 'crafts' }]);

function strike({ population, institutions, tier = 'town', tick }) {
  const invershaw = {
    name: 'Invershaw', tier, population, config: { terrainType: 'plains' },
    institutions: institutions.map((inst) => ({ ...inst })),
    economicState: { primaryExports: [], primaryImports: [], activeChains: [] },
    powerStructure: { publicLegitimacy: { score: 60 }, factions: [], conflicts: [] },
    npcs: [], activeConditions: [], populationHistory: [],
  };
  const steinheim = {
    name: 'Steinheim', tier: 'town', population: 1500, config: { terrainType: 'plains' },
    institutions: [{ name: 'Market', category: 'trade' }],
    economicState: { primaryExports: [], primaryImports: [], activeChains: [] }, activeConditions: [], npcs: [],
  };
  const settlements = [
    { id: 'soak-d', name: 'Invershaw', settlement: invershaw },
    { id: 'soak-a', name: 'Steinheim', settlement: steinheim },
  ];
  const snapshot = {
    settlements,
    regionalGraph: ensureRegionalGraph({ edges: [{ id: 'e.d.a', from: 'soak-d', to: 'soak-a', relationshipType: 'trade_partner' }], channels: [] }),
  };
  const r = advanceCalamity({
    settlementUpdates: settlements.map((u) => ({ saveId: u.id, settlement: u.settlement })),
    worldState: { tick, simulationRules: { disastersEnabled: true } },
    snapshot, digest: null, pIndex: { get: () => ({ score: 0.4 }) }, rules: { disastersEnabled: true },
    rng: stubRng('soak-d'), season: 'spring', prevWeeks: 51, weeks: 52, tick, now: null,
  });
  const receipt = r.receipts.find((x) => x.kind === 'strike');
  const news = r.newsEntries.find((x) => x.impactKind === 'calamity');
  return { receipt, summary: news ? String(news.summary) : '' };
}

/** The first tick at or after 52 whose `soak-d::<tick>` seed selects each of the five tellings. */
const TICK_FOR_TELLING = (() => {
  /** @type {Record<number, number>} */
  const out = {};
  for (let t = 52; Object.keys(out).length < 5; t += 1) {
    const i = fnv1a32(`soak-d::${t}`) % 5;
    if (!(i in out)) out[i] = t;
  }
  return out;
})();

describe('CURE-P1 U2 — the calamity toll speaks its counts in words (FPQ-22)', () => {
  it('the read\'s own sentence: the third telling reads as a toll, in words', () => {
    const { receipt, summary } = strike({ population: 3320, institutions: TWO_FALL, tick: TICK_FOR_TELLING[2] });
    expect(receipt, 'the stub fired the strike').toBeTruthy();
    expect([receipt.k, receipt.deaths], 'the fixture is the read\'s toll: two fallen, 166 dead').toEqual([2, 166]);
    expect(summary).toBe('A great calamity has fallen on Invershaw. The toll: two institutions lie in ruin,'
      + ' several hundred dead, and many take flight along the roads.');
  });

  it('every telling of the same toll carries no digit and the same two worded counts', () => {
    for (const telling of [0, 1, 2, 3, 4]) {
      const { summary } = strike({ population: 3320, institutions: TWO_FALL, tick: TICK_FOR_TELLING[telling] });
      expect(summary, `telling ${telling} is the calamity bucket`).toMatch(/calamity/i);
      expect(summary, `telling ${telling}: the fallen, in words`).toContain('two institutions lie in ruin');
      expect(summary, `telling ${telling}: the dead, in the Herald's quantity words`).toContain('several hundred dead');
      // anchored: the two worded counts were found in this very summary on the lines above.
      expect(summary, `telling ${telling}: no bare numeral reaches the reader`).not.toMatch(/\d/);
    }
  });

  it('a strike that fells nothing and kills no one says so in words, never with a zero', () => {
    const { receipt, summary } = strike({ population: 19, institutions: [HALL], tier: 'thorp', tick: TICK_FOR_TELLING[0] });
    expect([receipt.k, receipt.deaths], 'the fixture is the empty toll').toEqual([0, 0]);
    expect(summary).toBe('A calamity has struck Invershaw: no institution lies in ruin, nobody dead,'
      + ' and many more take to the roads.');
  });
});
