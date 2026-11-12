/**
 * powerTextFinalRoster.test.js — COHERENCE-POWERS-3, F2 (REVIEW-POWERS-1a32c200a-2026-11-12): EVERY TEXT THAT NAMES A
 * POWER READS THE FINAL ROSTER. The density law sizes the roster at assembly, after the power step wrote each power's
 * standing sentence and the history step wrote its tensions' parties; before this cure a town printed "they play
 * Religious Authorities and Church Council against each other" with the Religious Authorities gone, a History-tab
 * tension chip for a power the Power tab did not show, and "Three powers stand almost level here" beside one power.
 *
 * THE CORPUS: every crisis forced at every size, and six sizes on the browser's random dials, each born twice through
 * the browser's create boundary — with the density law (the town the page shows) and without it (the same seed, the
 * roster before any power is trimmed: the names that can leave). A name the law-free birth holds and the town does not
 * is a power that left. No printed string of the town names one, and no standing sentence ranks a power against powers
 * the page does not show.
 *
 * NOT READ, each with its reason: the simulation trace and an institution's `factionSource` (never printed); the safety
 * profile's criminal institutions and the economy's income sources (house names: a thieves' guild house stands where
 * the Thieves' Guild power was trimmed, measured 90 of 90 on 3,780 births); the relationship narratives, until the
 * chair rules the one line they share (factionDynamics.js, another lane's file).
 *
 * RED FIRST at the merged start e17edb8ee (the pass in steps/assembleSettlement.js absent): the chips, the
 * descriptions and the rank lines each named.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { STRESS_TYPE_MAP } from '../../../src/data/stressTypes.js';

/** The browser's dials (the charters' §0.4). */
const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});
const TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
/** Paths whose strings are never printed, or print a house's name. */
const NOT_READ = /^\.(simulationTrace|institutions\[\]\.factionSource|defenseProfile\.institutions\.[a-z]+\[\]\.factionSource|economicState\.safetyProfile\.criminalInstitutions|economicState\.incomeSources)/;
/** The standing sentences that count the powers above a power (power/factionStanding.js): each needs that many powers
 *  on the page beside it. (A doubled niche's rival copies its parent's sentence at its own rank: a FOUND class, the
 *  line's, reported to the chair; this guard reads the count, as the review's finding does.) */
const COUNTING = Object.freeze([
  [/Three powers stand almost level/, 3],
  [/Close enough to the two above/, 3],
]);

const corpus = [];
for (const stress of Object.keys(STRESS_TYPE_MAP)) for (const settType of TIERS) {
  corpus.push({ seed: `f2g-${stress}-${settType}-0`, config: { ...DIALS, settType, selectedStresses: [stress], selectedStressesRandom: false } });
}
for (const settType of TIERS) for (let i = 0; i < 5; i++) corpus.push({ seed: `f2g-${settType}-${i}`, config: { ...DIALS, settType } });

/** @type {{ seed: string, s: Record<string, any>, gone: string[] }[]} */
let births = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  births = corpus.map(({ seed, config }) => {
    const law = birthConfig(config);
    const free = { ...law };
    delete free._densityLawVersion;
    const s = generateSettlementPipeline(law, null, { seed, customContent: {} });
    const before = generateSettlementPipeline(free, null, { seed, customContent: {} });
    const onPage = new Set((s.powerStructure?.factions || []).map((f) => f.faction));
    const gone = (before.powerStructure?.factions || []).map((f) => f.faction).filter((name) => name && !onPage.has(name));
    return { seed, s, gone };
  });
}, 240_000);

describe('COHERENCE-POWERS-3 F2 — every text that names a power reads the final roster', () => {
  it('no printed string names a power the final roster does not hold', () => {
    const misses = [];
    for (const { seed, s, gone } of births) {
      if (!gone.length) continue;
      const walk = (v, p) => {
        if (typeof v === 'string') {
          const at = p.replace(/\[\d+\]/g, '[]');
          if (NOT_READ.test(at)) return;
          for (const name of gone) if (v.includes(name)) misses.push(`${seed} ${at}: names ${name}`);
        } else if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], `${p}${Array.isArray(v) ? `[${k}]` : `.${k}`}`);
      };
      walk(s, '');
    }
    expect(births.length).toBe(corpus.length);
    expect(misses).toEqual([]);
  });

  it('no standing sentence counts powers the page does not show', () => {
    const misses = [];
    for (const { seed, s } of births) {
      const size = (s.powerStructure?.factions || []).length;
      for (const f of s.powerStructure?.factions || []) {
        for (const [line, needs] of COUNTING) {
          if (line.test(String(f.desc || '')) && size < needs) misses.push(`${seed}: ${f.faction} reads "${String(f.desc).match(line)[0]}" beside ${size} power(s)`);
        }
      }
    }
    expect(misses).toEqual([]);
  });
});
