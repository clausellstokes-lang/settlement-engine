/**
 * foundingSeeds.probe.test.js — R-2 CLAIMS-PARITY: each seed's synopsis proven.
 *
 * The editorial promise made testable. Every `receipts` line in the registry maps
 * to an assertion here: the seed is GENERATED (same seed + config ⇒ same world) and
 * the claimed dramatic elements are asserted present. If the generator drifts and a
 * claim no longer holds, THIS reds — the synopsis can never out-run what the engine
 * actually forges (the owner's claims-parity law).
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { archetypePatch, ARCHETYPES } from '../../src/components/generate/characterPresets.js';
import { FOUNDING_SEEDS, foundingSeedById } from '../../src/data/foundingSeeds.js';

/** Forge the settlement exactly as the store's basic forge does (randomSliderMode on). */
function forge(entry) {
  const cfg = { ...DEFAULT_CONFIG, settType: entry.settType, ...archetypePatch(entry.archetype), _randomizePriorities: true };
  return generateSettlementPipeline(cfg, null, { seed: entry.seed, customContent: {} });
}
const eventsOf = (t) => (Array.isArray(t.history?.historicalEvents) ? t.history.historicalEvents : []);
const goalsOf = (t) => (Array.isArray(t.npcs) ? t.npcs : []).filter((n) => n?.goal?.short).map((n) => n.goal.short);
const legitOf = (t) => t.powerStructure?.publicLegitimacy || {};

describe('every founding seed forges deterministically', () => {
  for (const entry of FOUNDING_SEEDS) {
    it(`${entry.id} (${entry.seed}) is deterministic and valid`, () => {
      expect(archetypePatch(entry.archetype)).toBeTruthy();
      expect(ARCHETYPES.some((a) => a.key === entry.archetype)).toBe(true);
      const a = forge(entry);
      const b = forge(entry);
      expect(a.name).toBe(b.name);
      expect(a.population).toBe(b.population);
      expect(JSON.stringify(a.history)).toBe(JSON.stringify(b.history));
      expect(typeof a.name).toBe('string');
      expect(a.name.length).toBeGreaterThan(0);
    });
  }
});

describe('claims-parity — each synopsis is proven by the forged world', () => {
  it('THE CROWN THAT WILL NOT HOLD — a brewing coup in a legitimacy crisis', () => {
    const t = forge(foundingSeedById('the-contested-crown'));
    const legit = legitOf(t);
    // Receipt 1: Legitimacy Crisis, governance fractured.
    expect(legit.label).toBe('Legitimacy Crisis');
    expect(legit.governanceFractured).toBe(true);
    // Receipt 2: a catastrophic siege within the last fifteen years.
    expect(eventsOf(t).some((e) => /siege/i.test(e.name) && e.severity === 'catastrophic' && e.yearsAgo <= 15)).toBe(true);
    // Receipt 3: a figure formalising the independent authority the collapse created.
    expect(goalsOf(t).some((g) => /independent operational authority|exit before the gap between title and authority/i.test(g))).toBe(true);
  });

  it('THE MILL THAT OUTLIVED ITS WARS — a scarred survivor', () => {
    const t = forge(foundingSeedById('the-enduring-mill'));
    // Receipt 1: five or more MAJOR upheavals.
    expect(eventsOf(t).filter((e) => e.severity === 'major').length).toBeGreaterThanOrEqual(5);
    // Receipt 2: a major siege in its history.
    expect(eventsOf(t).some((e) => /siege/i.test(e.name) && e.severity === 'major')).toBe(true);
    // Receipt 3: founded on mill rights from an absent lord.
    expect(/mill/i.test(t.history?.founding?.reason || '')).toBe(true);
    // Receipt 4: approved, steady governance today.
    expect(legitOf(t).label).toBe('Approved');
  });

  it('THE ROT BENEATH THE ORE — contested authority, a recent uprising, criminal arrangements', () => {
    const t = forge(foundingSeedById('the-rot-beneath-the-ore'));
    // Receipt 1: contested legitimacy.
    expect(legitOf(t).label).toBe('Contested');
    // Receipt 2: an uprising of the first rank within the last fifteen years.
    expect(eventsOf(t).some((e) => /uprising/i.test(e.name) && e.severity === 'major' && e.yearsAgo <= 15)).toBe(true);
    // Receipt 3: a figure holding the line around criminal/informal arrangements.
    expect(goalsOf(t).some((g) => /informal arrangements|criminal arrangements|corrupt interests/i.test(g))).toBe(true);
  });
});
