/**
 * tests/domain/crisisStandInWords.test.js — THE MINTED STAND-IN'S WORDS CLAIM NO OFFICE, HOUSE OR FORCE THE PAGE DENIES
 * (R2-CODE-B-12; the chair's ruling (c) on H2-14, H2-16, H1-3 and M6's minted half; the reader of 2026-11-14 at ac8168c8c).
 *
 * A temporary person is minted only where a natural crisis's lever has neither a house nor an office-holder, so the
 * record holds no such office. Before the cure the card said "Healer" beside the Defense tab's "No healer is kept here"
 * (r2s-plague_onset-thorp-0), "Grain Steward" beside "No granary" (r2r-thorp-17), "Warden" where no force stands
 * (r2r-thorp-5), the Tonight want "decide who gets the guards" beside the sheet's own "Defence: No walls and no standing
 * force.", and the plague hook "Jiahao Wu, the healer who identified the outbreak first". Measured on the reader's 1,536
 * births: 141 minted roles in an office word -> 0 (the field diff: `npcs[minted].role`, 141 leaves, nothing else); the
 * want's "guards" 36 -> 0 (all 36 where no garrison, watch, militia or free company stands; now "shelter"); the plague
 * hook's "the healer" on a stand-in 20 -> 0.
 *
 * THE ARMS: (1) COLLECTED, the role: every census town below mints a stand-in whose role is its lay words, never an
 * office; (2) the want: guards only where a force stands (the keep-guard: a force keeps "guards"); (3) the hook: the
 * stand-in is named without "the healer" (the keep-guard: r2r-city-19's apothecary, a real healer, keeps it).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { STAND_IN_ROLE } from '../../src/domain/crisis/crisisCast.js';
import { crisisHookFor } from '../../src/domain/crisis/crisisHooks.js';
import { castWantOf, composeTonightSheet } from '../../src/domain/summary/tonightSheet.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own cfgFor (r2r-<size>-<i>, r2s-<crisis>-<size>-<i>). @param {string} seed */
const born = (seed) => {
  const m = seed.match(/^r2r-(\w+)-(\d+)$/); const f = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  const config = m ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] })
    : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [f[1]], selectedStressesRandom: false, settType: f[2] });
  return generateSettlementPipeline(config, null, { seed, customContent: {} });
};
const OFFICE = /healer|steward|warden|granar|guard|watch|captain|keeper/i;
const entriesOf = (s) => (Array.isArray(s.stress) ? s.stress : [s.stress]).filter(Boolean);

beforeAll(async () => { await loadGenerationLawPayloads(); }, 60_000);

// Three of each kind of stand-in, from the census's 57 (thorp, hamlet and village: the sizes a stand-in reaches).
const TOWNS = [
  'r2s-plague_onset-thorp-0', 'r2s-plague_onset-thorp-1', 'r2s-plague_onset-hamlet-0',
  'r2s-mass_migration-thorp-3', 'r2s-mass_migration-hamlet-0', 'r2s-mass_migration-hamlet-1',
  'r2r-thorp-17', 'r2r-hamlet-24', 'r2s-wartime-thorp-2',
  'r2r-thorp-5', 'r2r-thorp-10', 'r2r-thorp-19',
];

describe('(1) the stand-in\'s role is what they do, in lay words (collected)', () => {
  it('every town mints one whose role names no office', () => {
    const bad = [];
    for (const seed of TOWNS) {
      const s = born(seed);
      const temps = (s.npcs || []).filter((n) => n.temporary);
      if (temps.length !== 1) { bad.push(`${seed}: ${temps.length} minted`); continue; }
      const [p] = temps;
      if (OFFICE.test(p.role) || !Object.values(STAND_IN_ROLE).includes(p.role)) bad.push(`${seed}: "${p.role}"`);
      if (p.role !== STAND_IN_ROLE[p.crisisIds[0]]) bad.push(`${seed}: "${p.role}" is not the words of ${p.crisisIds[0]}`);
    }
    expect(bad).toEqual([]);
  }, 120_000);
});

describe('(2) the lever\'s want names a scarce thing the town has', () => {
  it('r2r-thorp-5 (no walls and no standing force): the stand-in wants shelter, never guards', () => {
    const t = composeTonightSheet(born('r2r-thorp-5'));
    expect(t.facts.find((f) => f.id === 'defence')?.text).toBe('No walls and no standing force.');
    const p = t.people.find((x) => x.name === 'Deirdre Murphy');
    expect(p?.line).toMatch(/\bshelter\b/);
    expect(p?.line).not.toMatch(/guards/);
  }, 60_000);
  it('keep-guard: where a force stands the raids still make guards scarce', () => {
    const lines = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].map((id) => castWantOf('lever', id, 'monster_pressure', '', '', { forceStands: true }));
    expect(lines.some((l) => /\bguards\b/.test(l))).toBe(true);
    const none = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].map((id) => castWantOf('lever', id, 'monster_pressure', '', '', { forceStands: false }));
    expect(none.filter((l) => /guards/.test(l))).toEqual([]);
  });
});

describe('(3) the plague hook names a stand-in without calling them a healer', () => {
  const plagueHookOf = (s) => crisisHookFor(s, entriesOf(s).find((e) => e?.type === 'plague_onset'));
  it('r2s-plague_onset-thorp-0 (no healer is kept here): the stand-in is named, the word "healer" is not', () => {
    expect(plagueHookOf(born('r2s-plague_onset-thorp-0'))).toMatch(/^Jiahao Wu, the first to name the outbreak, has gone quiet\./); // no healer stands: the twin, the stand-in named
  }, 60_000);
  it('keep-guard: r2r-city-19\'s apothecary, a healer, keeps the word', () => {
    expect(plagueHookOf(born('r2r-city-19'))).toMatch(/^Una Murray, the healer who identified the outbreak first, has gone quiet\./);
  }, 60_000);
});
