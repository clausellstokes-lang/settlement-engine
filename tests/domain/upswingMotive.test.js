/**
 * upswingMotive.test.js — W-UPSWING stage 4 (MOTIVE INTEGRATION) pins.
 * The bounded extraction-upswing EV term in the deploy score: what a conquest BUYS,
 * after a flat occupation burden, SCALED DOWN by the conqueror's OWN corruption leak
 * (the constitution §0.5 term + the §0.3c leak). 0-when-dark is proven at the caller
 * (the strategy suite is byte-identical with the flag off); here we pin the term math.
 */
import { describe, expect, it } from 'vitest';
import { extractionUpswingAdj } from '../../src/domain/worldPulse/settlementStrategy.js';

/** A wealthy target (high economicStrength01) vs a poor one. */
function target(id, over = {}) {
  return {
    id, name: id,
    settlement: {
      name: id, tier: 'city', population: 8000,
      economicState: { prosperity: 'Wealthy', primaryExports: ['Fine goods', 'Grain', 'Ore'], economicBase: 'trade' },
      ...over,
    },
  };
}
const poorTarget = (id) => ({
  id, name: id,
  settlement: { name: id, tier: 'thorp', population: 80, economicState: { prosperity: 'Subsistence', primaryExports: [], economicBase: 'agrarian' } },
});

const litWorld = (over = {}) => ({ spatialCanonVersion: 1, simulationRules: { upswingArcsEnabled: true, ...over } });

describe('upswing — stage 4 motive: the extraction-upswing EV term', () => {
  it('a WEALTHY target yields a positive conquest EV; a POOR target does not (burden bites)', () => {
    const snapshot = { settlements: [{ id: 'C', name: 'C', settlement: { name: 'C', tier: 'city', population: 5000, economicState: { prosperity: 'Comfortable' } } }, target('Rich'), poorTarget('Poor')] };
    const rich = extractionUpswingAdj({ worldState: litWorld(), snapshot, conquerorId: 'C', targetId: 'Rich' });
    const poor = extractionUpswingAdj({ worldState: litWorld(), snapshot, conquerorId: 'C', targetId: 'Poor' });
    expect(rich, 'a rich prize is worth conquering').toBeGreaterThan(0);
    expect(rich, 'the richer target motivates more than the poor one').toBeGreaterThan(poor);
  });

  it('the term is BOUNDED (±EXTRACTION_EV_BOUND ≈ 0.14) — a signed nudge, never a runaway', () => {
    const snapshot = { settlements: [{ id: 'C', name: 'C', settlement: { name: 'C', economicState: { prosperity: 'Comfortable' } } }, target('Rich')] };
    const adj = extractionUpswingAdj({ worldState: litWorld(), snapshot, conquerorId: 'C', targetId: 'Rich' });
    expect(Math.abs(adj)).toBeLessThanOrEqual(0.14 + 1e-9);
  });

  it('an unknown target ⇒ 0 (no phantom motive)', () => {
    const snapshot = { settlements: [] };
    expect(extractionUpswingAdj({ worldState: litWorld(), snapshot, conquerorId: 'C', targetId: 'nope' })).toBe(0);
  });

  it('THE LEAK PIN: the extraction benefit is SCALED DOWN under high conqueror corruption', () => {
    // A corrupt NPC in settlement V, leashed FOREIGN to the conqueror C ⇒ C's foreignGrip > 0.
    const corruptV = {
      id: 'V', name: 'V',
      settlement: {
        name: 'V', tier: 'town', population: 1200, economicState: { prosperity: 'Moderate' },
        npcs: [
          { id: 'spy1', name: 'Spy One', corrupt: true, corruptTies: { leash: { kind: 'foreign_settlement', settlementId: 'C' } } },
          { id: 'spy2', name: 'Spy Two', corrupt: true, corruptTies: { leash: { kind: 'foreign_settlement', settlementId: 'C' } } },
          { id: 'spy3', name: 'Spy Three', corrupt: true, corruptTies: { leash: { kind: 'foreign_settlement', settlementId: 'C' } } },
        ],
      },
    };
    const snapshot = {
      settlements: [{ id: 'C', name: 'C', settlement: { name: 'C', economicState: { prosperity: 'Comfortable' } } }, target('Rich'), corruptV],
    };
    // Corruption DARK (corruptionWebEnabled absent) ⇒ leak 0 ⇒ the full benefit.
    const clean = extractionUpswingAdj({ worldState: litWorld(), snapshot, conquerorId: 'C', targetId: 'Rich' });
    // Corruption LIT (belief marker + infoMode full + corruptionWebEnabled) ⇒ C's foreign
    // grip > 0 ⇒ the benefit is skimmed ⇒ a LOWER motive (the leak in the pipe).
    const leaky = extractionUpswingAdj({ worldState: litWorld({ infoMode: 'full', corruptionWebEnabled: true }), snapshot, conquerorId: 'C', targetId: 'Rich' });
    expect(leaky, 'a corruption-heavy conqueror skims its own spoils ⇒ less motive').toBeLessThan(clean);
  });
});
