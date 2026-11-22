/**
 * npcGrowthKernel.test.js — THE GROWTH LAYER pins (owner commission #36).
 *
 * The mechanics pins (the dormancy GOLDEN is its own driven-pulse file,
 * tests/property/npcGrowthDormancyGolden.test.js):
 *   • bank-bounded vocabulary — every mintable trait is a bank word (no new words)
 *   • the no-dead-facet walker — every mintable trait moves ≥1 existing consumer map
 *   • distance-from-core resistance — a far-core candidate acquires slower than a near one
 *   • acquisition + mint + provenance — durable outcomes deposit → threshold → sticky trait
 *   • overlay-not-mutation — the core personality is byte-identical through an acquisition
 *   • both signs — an unreinforced minted trait decays away (D5-band-scaled)
 *   • cap + hysteresis — bounded concurrent traits; a shed needs a deeper fall than a mint
 *   • the overlay reaches the consumers — npcAlignmentScore / aggression shift on acquired
 *   • the office-holder floor — a nameless extra never acquires
 */
import { describe, it, expect } from 'vitest';
import {
  advanceNpcGrowth, npcGrowthActive, acquiredTraitsOf, oppositionOf,
  ACQUIRED_TRAIT_VOCAB, GROWTH_DEPOSIT_MAP, GROWTH_TUNING,
} from '../../src/domain/worldPulse/npcGrowthKernel.js';
import { npcId } from '../../src/domain/worldPulse/npcAgency.js';
import { TRAIT_ALIGNMENT, TRAIT_AGGRESSION } from '../../src/data/npcTraitWeights.js';
import { TRAIT_MOMENTUM } from '../../src/domain/worldPulse/momentum.js';
import { NPC_PERSONALITY_TRAITS } from '../../src/data/npcData.js';
import { npcAlignmentScore } from '../../src/domain/corruption.js';

const NOW = '2026-01-01T00:00:00.000Z';

/** Build a one-settlement world for the mover. */
function makeWorld({ npcs, conditions = [], calamityHistory = [], warEdges = [], year = 5, band = null, lit = true, ledger = null, npcStates = {} }) {
  const settlement = {
    name: 'Ashford', npcs,
    activeConditions: conditions, calamityHistory,
    ...(band ? { facets: { memoryHorizon: band } } : {}),
  };
  const worldState = {
    simulationRules: lit ? { npcGrowthEnabled: true } : {},
    calendar: { year },
    npcStates,
    ...(ledger ? { spatialLedgers: { npcGrowth: ledger } } : {}),
  };
  const snapshot = { settlements: [{ id: 'a', name: 'Ashford', settlement }] };
  const settlementUpdates = [{ saveId: 'a', settlement }];
  return { worldState, snapshot, settlementUpdates, graph: { edges: warEdges } };
}

/** Drive N mover ticks, carrying worldState + settlementUpdates forward. */
function drive(world, ticks, startTick = 0) {
  let { worldState, snapshot, settlementUpdates, graph } = world;
  let news = [];
  for (let t = 0; t < ticks; t++) {
    const r = advanceNpcGrowth({ snapshot, worldState, settlementUpdates, graph, tick: startTick + t, now: NOW });
    worldState = r.worldState;
    settlementUpdates = r.settlementUpdates;
    news = news.concat(r.newsEntries);
  }
  return { worldState, settlementUpdates, news };
}

const growthLedger = (ws) => (ws?.spatialLedgers?.npcGrowth) || {};
const stockOf = (ws, nid, trait) => growthLedger(ws)[nid]?.[trait]?.stock ?? 0;
const npcInUpdate = (updates, index = 0) => updates[0]?.settlement?.npcs?.[index];

// ── The bank-bounded vocabulary + the no-dead-facet walker ────────────────────
describe('growth vocabulary — bank-bounded + walker-readable', () => {
  const bankAll = new Set([
    ...NPC_PERSONALITY_TRAITS.positive, ...NPC_PERSONALITY_TRAITS.negative, ...NPC_PERSONALITY_TRAITS.neutral,
  ]);

  it('every mintable trait is a bank personality word (no new words)', () => {
    for (const t of ACQUIRED_TRAIT_VOCAB) expect(bankAll.has(t), `"${t}" must be an authored bank word`).toBe(true);
  });

  it('the walker: every mintable trait carries a weight in ≥1 existing consumer map (readable)', () => {
    for (const t of ACQUIRED_TRAIT_VOCAB) {
      const readable = Number.isFinite(TRAIT_ALIGNMENT[t]) || Number.isFinite(TRAIT_AGGRESSION[t]) || Number.isFinite(TRAIT_MOMENTUM[t]);
      expect(readable, `"${t}" is a dead facet — no consumer map scores it`).toBe(true);
    }
  });

  it('every deposit-map candidate is in the mintable vocabulary', () => {
    for (const row of GROWTH_DEPOSIT_MAP) expect(ACQUIRED_TRAIT_VOCAB).toContain(row.trait);
  });
});

// ── The distance-from-core rule (opposition metric) ───────────────────────────
describe('distance-from-core — the opposition metric (bank-derivable)', () => {
  it('a candidate opposite the core resists more than one aligned with it', () => {
    const far = oppositionOf('cruel', { personality: { dominant: 'compassionate' } });
    const near = oppositionOf('cruel', { personality: { dominant: 'ruthless' } });
    expect(far).toBeGreaterThan(near);
    expect(far).toBeGreaterThan(0.5);
    expect(near).toBeLessThan(0.2);
  });
});

// ── Dormancy contract (the full byte-golden is npcGrowthDormancyGolden.test.js) ─
describe('dormancy — the flag absent is a complete no-op', () => {
  it('npcGrowthActive is false without the flag', () => {
    expect(npcGrowthActive({})).toBe(false);
    expect(npcGrowthActive({ simulationRules: {} })).toBe(false);
    expect(npcGrowthActive({ simulationRules: { npcGrowthEnabled: true } })).toBe(true);
  });

  it('a struck town DARK grows nothing — no npcGrowth ledger, no acquiredTraits', () => {
    const world = makeWorld({
      lit: false,
      npcs: [{ id: 'steward', name: 'Steward Vale', importance: 'pillar', personality: { dominant: 'brave' } }],
      calamityHistory: [{ type: 'fire', year: 4 }],
    });
    const { worldState, settlementUpdates } = drive(world, 20);
    expect(growthLedger(worldState)).toEqual({});
    expect(npcInUpdate(settlementUpdates)?.acquiredTraits).toBeUndefined();
  });
});

// ── Acquisition + mint + provenance + mirror ──────────────────────────────────
describe('acquisition — durable outcomes mint a sticky trait with provenance', () => {
  it('a town living under a calamity grows its steward cautious, mirrored + provenanced', () => {
    const world = makeWorld({
      npcs: [{ id: 'steward', name: 'Steward Vale', importance: 'pillar', personality: { dominant: 'brave' } }],
      calamityHistory: [{ type: 'fire', year: 4 }],
    });
    const { worldState, settlementUpdates, news } = drive(world, 20);
    const nid = npcId('a', { id: 'steward' }, 0);

    const acquired = acquiredTraitsOf(worldState, nid);
    expect(acquired.map((a) => a.trait)).toContain('cautious');
    const cautious = acquired.find((a) => a.trait === 'cautious');
    expect(cautious.provenance).toContain('calamity'); // enumerable provenance
    expect(cautious.intensity).toBeGreaterThan(0);

    // mirrored onto the roster (the overlay source the consumers read)
    const npc = npcInUpdate(settlementUpdates);
    expect(Array.isArray(npc.acquiredTraits)).toBe(true);
    expect(npc.acquiredTraits.some((a) => a.trait === 'cautious')).toBe(true);

    // a chronicle beat was emitted
    expect(news.some((n) => n.impactKind === 'npc_growth' && n.tags.includes('trait_gained'))).toBe(true);
  });

  it('the office-holder floor: a nameless extra (notable) never acquires', () => {
    const world = makeWorld({
      npcs: [{ id: 'extra', name: 'A Passerby', importance: 'notable', personality: { dominant: 'brave' } }],
      calamityHistory: [{ type: 'fire', year: 4 }],
    });
    const { worldState } = drive(world, 24);
    expect(growthLedger(worldState)).toEqual({});
  });
});

// ── Overlay-not-mutation — the core is byte-identical through an acquisition ────
describe('overlay-not-mutation — the constitutional core is never written', () => {
  it('personality is byte-identical after an acquisition; only acquiredTraits is added', () => {
    const corePersonality = { dominant: 'brave', flaw: 'reckless', modifier: 'proud' };
    const world = makeWorld({
      npcs: [{ id: 'steward', name: 'Steward Vale', importance: 'pillar', personality: { ...corePersonality } }],
      calamityHistory: [{ type: 'fire', year: 4 }],
    });
    const { settlementUpdates } = drive(world, 20);
    const npc = npcInUpdate(settlementUpdates);
    // the acquisition happened
    expect(Array.isArray(npc.acquiredTraits) && npc.acquiredTraits.length).toBeGreaterThan(0);
    // the core is untouched, byte-for-byte
    expect(npc.personality).toEqual(corePersonality);
  });
});

// ── Determinism — same seed/inputs ⇒ same acquisitions ────────────────────────
describe('determinism — same inputs ⇒ byte-identical growth', () => {
  it('two identical drives produce identical ledger, mirror, and news', () => {
    const mk = () => makeWorld({
      npcs: [{ id: 'steward', name: 'Steward Vale', importance: 'pillar', personality: { dominant: 'brave' } }],
      calamityHistory: [{ type: 'fire', year: 4 }],
      conditions: [{ archetype: 'boom' }],
    });
    const a = drive(mk(), 18);
    const b = drive(mk(), 18);
    expect(JSON.stringify(growthLedger(a.worldState))).toEqual(JSON.stringify(growthLedger(b.worldState)));
    expect(JSON.stringify(a.settlementUpdates)).toEqual(JSON.stringify(b.settlementUpdates));
    expect(JSON.stringify(a.news)).toEqual(JSON.stringify(b.news));
  });
});

// ── Distance-from-core resistance — measurably different deposit counts ─────────
describe('distance-from-core — a far-core soul resists acquisition', () => {
  it('after equal exposure the near-core steward carries more cautious stock than the far-core one', () => {
    // Both office-holders, both fed the SAME calamity signal; npcStates dark ⇒ same domain.
    // near: level-headed core (close to cautious on the axes); far: cruel core (opposite pole).
    const world = makeWorld({
      npcs: [
        { id: 'near', name: 'Steady Reeve', importance: 'pillar', personality: { dominant: 'level-headed' } },
        { id: 'far', name: 'Cruel Reeve', importance: 'pillar', personality: { dominant: 'cruel' } },
      ],
      calamityHistory: [{ type: 'fire', year: 4 }],
    });
    const { worldState } = drive(world, 10);
    const nearStock = stockOf(worldState, npcId('a', { id: 'near' }, 0), 'cautious');
    const farStock = stockOf(worldState, npcId('a', { id: 'far' }, 1), 'cautious');
    expect(nearStock).toBeGreaterThan(0);
    expect(farStock).toBeGreaterThan(0);
    expect(nearStock).toBeGreaterThan(farStock);
  });

  it('the near-core steward mints before the far-core one (more events needed further from core)', () => {
    const world = makeWorld({
      npcs: [
        { id: 'near', name: 'Steady Reeve', importance: 'pillar', personality: { dominant: 'level-headed' } },
        { id: 'far', name: 'Cruel Reeve', importance: 'pillar', personality: { dominant: 'cruel' } },
      ],
      calamityHistory: [{ type: 'fire', year: 4 }],
    });
    const { worldState } = drive(world, 16);
    const nearMinted = acquiredTraitsOf(worldState, npcId('a', { id: 'near' }, 0)).some((a) => a.trait === 'cautious');
    const farMinted = acquiredTraitsOf(worldState, npcId('a', { id: 'far' }, 1)).some((a) => a.trait === 'cautious');
    expect(nearMinted).toBe(true);
    expect(farMinted).toBe(false);
  });
});

// ── Both signs — an unreinforced minted trait decays away ─────────────────────
describe('both signs — decay sheds an unreinforced trait (D5-band-scaled)', () => {
  it('a minted trait near the relinquish floor sheds when the signal stops', () => {
    // Pre-seed a minted `cautious` just above the floor, then drive with NO signal.
    const nid = npcId('a', { id: 'steward' }, 0);
    const ledger = { [nid]: { cautious: { stock: 3.2, sinceTick: 0, lastDepositTick: 0, minted: true, mintedAt: 0, deposits: [{ tick: 0, signal: 'calamity', mag: 0.5 }] } } };
    const world = makeWorld({
      npcs: [{ id: 'steward', name: 'Steward Vale', importance: 'pillar', personality: { dominant: 'brave' } }],
      calamityHistory: [], conditions: [], ledger,
    });
    // give the seed a minted mirror so we can watch it clear
    world.settlementUpdates[0].settlement.npcs[0].acquiredTraits = [{ trait: 'cautious', intensity: 0.27, since: 0, provenance: ['calamity'] }];
    const { worldState, settlementUpdates, news } = drive(world, 40, 1);
    expect(acquiredTraitsOf(worldState, nid).some((a) => a.trait === 'cautious')).toBe(false);
    expect(npcInUpdate(settlementUpdates)?.acquiredTraits).toBeUndefined();
    expect(news.some((n) => n.tags.includes('trait_shed'))).toBe(true);
  });

  it('hysteresis: a minted trait HOLDS between the floor and the mint cliff (no oscillation)', () => {
    const nid = npcId('a', { id: 'steward' }, 0);
    // stock 4.5 ∈ [RELINQUISH_FLOOR 3, MINT_CLIFF 6): a fresh candidate could NOT mint here,
    // but an already-minted one holds. One tick, no signal, only a shallow decay.
    const ledger = { [nid]: { cautious: { stock: 4.5, sinceTick: 0, lastDepositTick: 0, minted: true, mintedAt: 0, deposits: [{ tick: 0, signal: 'calamity', mag: 0.5 }] } } };
    const world = makeWorld({
      npcs: [{ id: 'steward', name: 'Steward Vale', importance: 'pillar', personality: { dominant: 'brave' } }],
      ledger,
    });
    const { worldState } = drive(world, 1, 1);
    expect(acquiredTraitsOf(worldState, nid).some((a) => a.trait === 'cautious')).toBe(true);
    expect(GROWTH_TUNING.RELINQUISH_FLOOR).toBeLessThan(GROWTH_TUNING.MINT_CLIFF); // the hysteresis band exists
  });
});

// ── Cap — bounded concurrent acquired traits ──────────────────────────────────
describe('cap — a soul carries at most MAX_ACQUIRED learned traits', () => {
  it('a settlement drowning in every signal still mints ≤ MAX_ACQUIRED on one soul', () => {
    // calamity(cautious) + reconstruction(tenacious) + betrayal(cynical) + boom(proud) all at once.
    const world = makeWorld({
      npcs: [
        { id: 'ruler', name: 'Lord Vale', importance: 'pillar', personality: { dominant: 'clever' } },
        { id: 'traitor', name: 'The Turncoat', importance: 'notable', corrupt: true, ousted: true, personality: { dominant: 'greedy' } },
      ],
      calamityHistory: [{ type: 'fire', year: 4 }],
      conditions: [{ archetype: 'reconstruction' }, { archetype: 'boom' }],
    });
    const { worldState } = drive(world, 40);
    const minted = acquiredTraitsOf(worldState, npcId('a', { id: 'ruler' }, 0));
    expect(minted.length).toBeGreaterThan(0);
    expect(minted.length).toBeLessThanOrEqual(GROWTH_TUNING.MAX_ACQUIRED);
  });
});

// ── The overlay reaches the existing consumers ────────────────────────────────
describe('effects are overlays — the consumers read core + acquired', () => {
  it('npcAlignmentScore shifts when an acquired trait is present, byte-identical when absent', () => {
    const core = { personality: { dominant: 'honest' } }; // TRAIT_ALIGNMENT honest +0.75
    const base = npcAlignmentScore(core);
    const withAcquired = npcAlignmentScore({ ...core, acquiredTraits: [{ trait: 'cynical' }] }); // cynical −0.2
    expect(withAcquired).toBeLessThan(base);
    // absent field ⇒ byte-identical
    expect(npcAlignmentScore({ ...core, acquiredTraits: [] })).toBe(base);
    expect(npcAlignmentScore({ ...core, acquiredTraits: undefined })).toBe(base);
  });
});
