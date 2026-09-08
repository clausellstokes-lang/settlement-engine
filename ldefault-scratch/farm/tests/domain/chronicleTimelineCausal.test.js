/**
 * tests/domain/chronicleTimelineCausal.test.js — components-dossier-7.
 *
 * The ChronicleScrollback per-tick causal diff had a dead prop: `causalByTick` had
 * no supplier, so the "Causal shift this tick" block could never render. The new
 * pure supplier `causalByTickFromSnapshots` builds that Map from the SESSION pulse
 * undo stack (pre-pulse member snapshots) + the current live saves — no engine,
 * persist, or schema change. These pins fix the wiring and the max-change selection.
 */
import { describe, test, expect } from 'vitest';
import { causalByTickFromSnapshots, tickCausalDiff } from '../../src/domain/display/chronicleTimeline.js';

// A settlement whose ONLY causal lever here is governing legitimacy — governanceLedger
// reads powerStructure.publicLegitimacy.score, which moves law_order / ruling_authority.
function settlementWithLegit(score) {
  return {
    name: 'Ashford', tier: 'town', population: 1500,
    economicState: { primaryImports: [], primaryExports: [] },
    powerStructure: {
      publicLegitimacy: { score, label: score >= 50 ? 'Secure' : 'Contested' },
      factions: [], conflicts: [],
    },
    institutions: [], npcs: [],
  };
}

describe('causalByTickFromSnapshots', () => {
  test('brackets an advance: snapshot (before) → live saves (after), keyed by the resulting tick', () => {
    const before = settlementWithLegit(20); // contested order
    const after = settlementWithLegit(90);  // secure order
    const map = causalByTickFromSnapshots({
      snapshots: [{ campaignId: 'c', tick: 4, saves: [{ id: 'ashford', settlement: before }] }],
      liveSaves: [{ id: 'ashford', settlement: after }],
      currentTick: 5,
    });
    // The diff is keyed at the RESULTING tick (5), aligning with the timeline entry.
    const entry = map.get(5);
    expect(entry).toBeTruthy();
    const diff = tickCausalDiff(entry.before, entry.after);
    expect(diff.length).toBeGreaterThan(0);
    expect(diff.some(d => d.variable === 'law_order')).toBe(true);
  });

  test('nothing moved ⇒ no entry (the block self-hides, byte-identical off-state)', () => {
    const same = settlementWithLegit(50);
    const map = causalByTickFromSnapshots({
      snapshots: [{ campaignId: 'c', tick: 4, saves: [{ id: 'x', settlement: same }] }],
      liveSaves: [{ id: 'x', settlement: same }],
      currentTick: 5,
    });
    expect(map.size).toBe(0);
  });

  test('picks the member that moved the MOST when several changed', () => {
    const map = causalByTickFromSnapshots({
      snapshots: [{ campaignId: 'c', tick: 0, saves: [
        { id: 'still', settlement: settlementWithLegit(50) },
        { id: 'shaken', settlement: settlementWithLegit(15) },
      ] }],
      liveSaves: [
        { id: 'still', settlement: settlementWithLegit(50) },   // unchanged
        { id: 'shaken', settlement: settlementWithLegit(95) },  // big swing
      ],
      currentTick: 1,
    });
    const entry = map.get(1);
    expect(entry).toBeTruthy();
    // The chosen pair is the shaken settlement's (its law_order actually moved).
    expect(tickCausalDiff(entry.before, entry.after).some(d => d.variable === 'law_order')).toBe(true);
  });

  test('a member absent from the snapshot is skipped (no crash, no phantom diff)', () => {
    const map = causalByTickFromSnapshots({
      snapshots: [{ campaignId: 'c', tick: 0, saves: [] }],
      liveSaves: [{ id: 'newcomer', settlement: settlementWithLegit(90) }],
      currentTick: 1,
    });
    expect(map.size).toBe(0);
  });

  test('empty inputs ⇒ empty Map (dormant campaign renders no causal diff)', () => {
    expect(causalByTickFromSnapshots({}).size).toBe(0);
    expect(causalByTickFromSnapshots({ snapshots: [], liveSaves: [], currentTick: 0 }).size).toBe(0);
  });
});
