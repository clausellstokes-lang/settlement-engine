import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { readCorruptionClimate } from '../../src/domain/corruption.js';

// §corruption Phase 1a — generation-time onset, exercised through the REAL
// pipeline. Asserts the invariants rather than a specific (seed-dependent)
// corrupt outcome, so the test is stable while still proving the wiring.
const gen = (seed) => generateSettlementPipeline(
  { settType: 'metropolis', culture: 'mediterranean', terrain: 'river', tradeRouteAccess: 'port' },
  null,
  { seed, customContent: {} },
);

const SEEDS = ['corr-1', 'corr-2', 'corr-3', 'corr-4', 'corr-5', 'corr-6'];

describe('corruptionPass — generation-time onset (integration)', () => {
  it('marks corruption iff a criminal institution is present, and corrupt NPCs are fully wired', () => {
    let sawCriminalSettlement = false;
    let sawCorruptNpc = false;

    for (const seed of SEEDS) {
      const s = gen(seed);
      const climate = readCorruptionClimate(s);
      const npcs = Array.isArray(s.npcs) ? s.npcs : [];

      if (climate.hasCriminalInst) {
        sawCriminalSettlement = true;
        // corruptionPass marks the generated roster; a couple of faction-structural
        // NPCs are appended afterward and are resolved by the world-pulse climate
        // fallback instead — so `corrupt` is a boolean for those it processed and
        // undefined for the late arrivals (never some other type).
        const processed = npcs.filter((n) => typeof n.corrupt === 'boolean');
        expect(processed.length).toBeGreaterThan(0);
        for (const npc of npcs) {
          expect(npc.corrupt === undefined || typeof npc.corrupt === 'boolean').toBe(true);
          if (npc.corrupt === true) {
            sawCorruptNpc = true;
            expect(npc.corruptionVector).toBeTruthy();
            expect(npc.corruptTies?.criminalInstitution).toBeTruthy();
            expect(npc.corruptTies?.thievesGuild).toBeTruthy();
            expect(npc.goal?.short).toBeTruthy(); // goal rewritten to a compromised motivation
          }
        }
      } else {
        // no criminal institution → the rule forbids corruption
        for (const npc of npcs) {
          expect(npc.corrupt === true).toBe(false);
        }
      }
    }

    // A river-port metropolis across six seeds should surface criminal institutions
    // at least once, exercising the true path.
    expect(sawCriminalSettlement).toBe(true);
    // And with eligible NPCs under real crime pressure, corruption should fire.
    expect(sawCorruptNpc).toBe(true);
  });

  it('is deterministic — same seed yields identical corruption flags', () => {
    const a = gen('corr-determinism');
    const b = gen('corr-determinism');
    const flagsOf = (s) => (s.npcs || []).map((n) => `${n.name}:${n.corrupt}:${n.corruptionVector || ''}`);
    expect(flagsOf(a)).toEqual(flagsOf(b));
  });
});
