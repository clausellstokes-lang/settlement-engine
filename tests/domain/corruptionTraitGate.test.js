/**
 * tests/domain/corruptionTraitGate.test.js
 *
 * The flaw/temperament corruption rule (game-balance, user-confirmed):
 *   • A character FLAW (greed, ambition, a vice) is the weakness organized crime
 *     leverages to turn an NPC. No flaw ⇒ nothing to leverage.
 *   • A steady TEMPERAMENT (personality.dominant) makes an NPC harder to sway.
 * This governs ONLY the background world-pulse sim that gradually turns NPCs:
 *     flaw, no temperament  → can be turned (baseline chance)
 *     flaw + temperament    → can be turned but HARDER (lower chance)
 *     temperament only      → CANNOT be turned by the sim (no flaw to leverage)
 *     neither               → CANNOT be turned (no flaw)
 * The manual "Impose corruption" DM override works on ANY NPC with no flaw check.
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  corruptibility,
  npcHasTemperament,
  npcCorruptibleFlaw,
  onsetHazard,
  CORRUPTION_TUNING,
} from '../../src/domain/corruption.js';
import { TRAIT_PRESENCE_DISTRIBUTION } from '../../src/data/npcData.js';
import { generateReligionType } from '../../src/generators/npcGenerator.js';
import { setActiveRng, clearActiveRng } from '../../src/generators/rngContext.js';
import { createPRNG } from '../../src/generators/prng.js';
import { ensureNpcStates, advanceNpcCorruption } from '../../src/domain/worldPulse/npcAgency.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';

afterEach(() => clearActiveRng());

// ── 1. Trait-presence distribution yields all four combos over seeds ─────────
describe('TRAIT_PRESENCE_DISTRIBUTION — seeded, tunable, all four combos appear', () => {
  it('weights are frozen and sum to 1.0', () => {
    expect(Object.isFrozen(TRAIT_PRESENCE_DISTRIBUTION)).toBe(true);
    const { both, flawOnly, temperamentOnly, neither } = TRAIT_PRESENCE_DISTRIBUTION;
    expect(both + flawOnly + temperamentOnly + neither).toBeCloseTo(1.0, 10);
  });

  it('a solid majority keep a flaw (both + flawOnly ≥ 0.5) so the sim still turns people', () => {
    const { both, flawOnly } = TRAIT_PRESENCE_DISTRIBUTION;
    expect(both + flawOnly).toBeGreaterThanOrEqual(0.5);
  });

  it('over many seeds, generates every {flaw?, temperament?} combination', () => {
    setActiveRng(createPRNG('trait-presence-spread'));
    const seen = { both: 0, flawOnly: 0, temperamentOnly: 0, neither: 0 };
    for (let i = 0; i < 4000; i++) {
      const r = generateReligionType();
      const hasFlaw = Boolean(r.flaw);
      const hasTemp = Boolean(r.dominant);
      if (hasFlaw && hasTemp) seen.both++;
      else if (hasFlaw) seen.flawOnly++;
      else if (hasTemp) seen.temperamentOnly++;
      else seen.neither++;
    }
    // All four buckets are reached (the rule must have a no-flaw / temperament-only
    // NPC to act on, not just always-both).
    expect(seen.both).toBeGreaterThan(0);
    expect(seen.flawOnly).toBeGreaterThan(0);
    expect(seen.temperamentOnly).toBeGreaterThan(0);
    expect(seen.neither).toBeGreaterThan(0);
    // Roughly tracks the weights (loose bands — this is a distribution sanity check).
    const N = 4000;
    expect(seen.both / N).toBeGreaterThan(0.30);
    expect(seen.neither / N).toBeLessThan(0.20);
  });

  it('is deterministic: the same seed replays the exact same draws', () => {
    const draw = () => {
      setActiveRng(createPRNG('replay-seed'));
      const out = Array.from({ length: 50 }, () => {
        const r = generateReligionType();
        return `${r.dominant || ''}|${r.flaw || ''}`;
      });
      clearActiveRng();
      return out;
    };
    expect(draw()).toEqual(draw());
  });
});

// ── 2. The pure gate helper ──────────────────────────────────────────────────
describe('corruptibility(npc) — the background-sim susceptibility gate', () => {
  const npc = (personality) => ({ personality });

  it('returns 0 when the NPC has NO corruptible flaw (the sim can never turn them)', () => {
    expect(corruptibility(npc({ dominant: 'steadfast' }))).toBe(0); // temperament only
    expect(corruptibility(npc({}))).toBe(0); // neither
    expect(corruptibility(npc({ flaw: 'kind' }))).toBe(0); // a non-corruptible "flaw"
  });

  it('returns the full base (1) for a flaw with NO temperament', () => {
    expect(corruptibility(npc({ flaw: 'greedy' }))).toBe(1);
  });

  it('returns a strictly-lower-but-positive value for flaw + temperament', () => {
    const flawOnly = corruptibility(npc({ flaw: 'greedy' }));
    const flawSteady = corruptibility(npc({ flaw: 'greedy', dominant: 'steadfast' }));
    expect(flawSteady).toBe(CORRUPTION_TUNING.temperamentSteadiness);
    expect(flawSteady).toBeGreaterThan(0);
    expect(flawSteady).toBeLessThan(flawOnly);
  });

  it('npcHasTemperament reads the dominant slot only', () => {
    expect(npcHasTemperament(npc({ dominant: 'steadfast' }))).toBe(true);
    expect(npcHasTemperament(npc({ flaw: 'greedy' }))).toBe(false);
    expect(npcHasTemperament(npc({}))).toBe(false);
  });

  it('npcCorruptibleFlaw NO LONGER reads the temperament (dominant) slot as a flaw', () => {
    // 'corrupt' lives in the negative pool and IS a corruptible flaw — but if it
    // were (mis)placed in the dominant/temperament slot it must NOT count.
    expect(npcCorruptibleFlaw(npc({ dominant: 'corrupt' }))).toBeNull();
    expect(npcCorruptibleFlaw(npc({ flaw: 'greedy' }))).toBe('greedy');
  });

  it('the steadiness factor is a tunable, frozen knob in (0, 1)', () => {
    expect(Object.isFrozen(CORRUPTION_TUNING)).toBe(true);
    expect(CORRUPTION_TUNING.temperamentSteadiness).toBeGreaterThan(0);
    expect(CORRUPTION_TUNING.temperamentSteadiness).toBeLessThan(1);
  });

  it('onsetHazard halves with steadiness (post-sum, pre-clamp multiplier)', () => {
    const args = { crime: 0.8, security: 0.1, prosperity: 0.1 };
    const full = onsetHazard(args);
    const steady = onsetHazard({ ...args, steadiness: CORRUPTION_TUNING.temperamentSteadiness });
    expect(steady).toBeLessThan(full);
    // default steadiness=1 leaves the hazard byte-identical
    expect(onsetHazard({ ...args, steadiness: 1 })).toBe(full);
  });
});

// ── 3. The background loop honours the gate ──────────────────────────────────
const snapWith = (npcs) => ({
  settlements: [{
    id: 's1',
    activeConditions: [],
    settlement: {
      tier: 'city',
      institutions: [{ name: 'Thieves Guild' }, { name: 'City Watch' }],
      economicState: {
        prosperity: 'Poor',
        safetyProfile: {
          safetyRatio: 0.5,
          blackMarketCapture: 60,
          compound: { criminalEffective: 80 },
        },
      },
      npcs,
    },
  }],
});

const findByName = (ws, re) => Object.values(ws.npcStates).find((s) => re.test(s.name));

const runOnset = (npcs, seed, ticks = 60) => {
  const snap = snapWith(npcs);
  let ws = ensureNpcStates({ npcStates: {} }, snap, createPRNG(`${seed}:init`).fork('init'));
  for (const id of Object.keys(ws.npcStates)) {
    ws.npcStates[id] = { ...ws.npcStates[id], corruption: false, corruptionProfile: { corrupted: false, vector: null } };
  }
  const base = createPRNG(seed).fork('corruption');
  for (let t = 0; t < ticks; t++) ws = advanceNpcCorruption(ws, snap, base, { tick: t }).worldState;
  return ws;
};

describe('background turning loop — gated by flaw + dampened by temperament', () => {
  it('NEVER turns a no-flaw NPC (temperament-only or neither)', () => {
    const ws = runOnset([
      { name: 'Steady Saint', personality: { dominant: 'steadfast' } },      // temperament only
      { name: 'Blank Slate', personality: {} },                              // neither
      { name: 'Greedy Guard', personality: { flaw: 'greedy' } },             // flaw-only (control)
    ], 'noflaw-skip');
    expect(findByName(ws, /Steady Saint/).corruption).toBe(false);
    expect(findByName(ws, /Blank Slate/).corruption).toBe(false);
    expect(findByName(ws, /Greedy Guard/).corruption).toBe(true); // the leverageable one turns
  });

  it('turns flaw+temperament NPCs at a REDUCED rate vs flaw-only (over many seeds)', () => {
    let flawOnlyTurned = 0;
    let steadyTurned = 0;
    const SEEDS = 80;
    for (let i = 0; i < SEEDS; i++) {
      const ws = runOnset([
        { name: 'Greedy Guard', personality: { flaw: 'greedy' } },
        { name: 'Greedy Stoic', personality: { flaw: 'greedy', dominant: 'steadfast' } },
      ], `rate:${i}`, 8); // short horizon so the steadiness gap is visible (not both saturated)
      if (findByName(ws, /Greedy Guard/).corruption) flawOnlyTurned++;
      if (findByName(ws, /Greedy Stoic/).corruption) steadyTurned++;
    }
    // A steady disposition resists the pull: strictly fewer turn over the same seeds.
    expect(steadyTurned).toBeLessThan(flawOnlyTurned);
    expect(steadyTurned).toBeGreaterThan(0); // but a real, > 0 chance — not skipped
  });
});

// ── 4. The manual DM override is untouched ───────────────────────────────────
describe('IMPOSE_CORRUPTION (DM override) ignores the flaw gate', () => {
  const NOW = '2026-06-22T00:00:00.000Z';
  const settlement = () => ({
    name: 'Town',
    institutions: [
      { id: 'i1', name: "Thieves' Guild", category: 'criminal' },
      { id: 'i2', name: 'City Watch' },
    ],
    powerStructure: { factions: [{ id: 'f1', name: 'City Watch' }] },
    factions: [],
    npcs: [
      // A genuinely no-flaw NPC: temperament only, the sim could never turn them.
      { id: 'npc_saint', name: 'Saint Cora', corrupt: false, personality: { dominant: 'incorruptible' } },
    ],
  });

  it('turns a NO-FLAW NPC anyway (DM declares it; no flaw check)', () => {
    const next = mutateSettlement({
      settlement: settlement(),
      event: { id: 'e1', type: 'IMPOSE_CORRUPTION', targetId: 'Saint Cora' },
      now: NOW,
    });
    const cora = next.npcs.find(n => n.name === 'Saint Cora');
    expect(cora.corrupt).toBe(true);
    expect(typeof cora.corruptionVector).toBe('string');
    expect(cora.corruptionVector.length).toBeGreaterThan(0); // defaults to greed
    expect(cora.corruptTies?.criminalInstitution).toBe("Thieves' Guild");
  });
});
