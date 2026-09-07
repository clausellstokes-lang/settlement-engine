/**
 * faithSpreadGate.test.js — the Phase 4 W-F1 gate split contract.
 *
 * The single religionDynamicsEnabled flag (which gated ALL faith dynamics) is split
 * into two lanes:
 *   - LOCAL lane — per-settlement pantheon evolution (contest / legitimacy / patron /
 *     divine mandate) runs on deity presence ALONE (isSubsystemActive), no rule flag.
 *   - SPREAD lane — cross-settlement propagation (mints, carrier reach, prevalence,
 *     neighbour recognition, occupation pull) is gated by `faithSpreadEnabled`
 *     (tolerant of the legacy religionDynamicsEnabled alias — ratification 2).
 *
 * This file lands the owner's four contract pins under their contract names, the
 * flag-migration tests, and the freeze/coupling semantics of toggling spread off.
 */
import { describe, it, expect } from 'vitest';

import { advanceReligionStates } from '../../src/domain/worldPulse/religiousContest.js';
import { patronSnapshot, projectReligionStateOntoSettlement, applyDivineMandate } from '../../src/domain/worldPulse/religionState.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { normalizeSimulationRules, isFaithSpreadEnabled, DEFAULT_SIMULATION_RULES } from '../../src/domain/worldPulse/simulationRules.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';
const RNG_SEED = 'faith-spread-gate';

const deity = (name, temper, align, rank = 'minor') => ({
  _deityRef: `custom:lu_${name.toLowerCase()}`, name, temperamentAxis: temper, alignmentAxis: align, rankAxis: rank, lawAxis: 'neutral',
});
const ref = (n) => `custom:lu_${n.toLowerCase()}`;

function save(id, name, d, { tier = 'town', government = 'Town Council', legitimacy = 50 } = {}) {
  return {
    id, name, phase: 'canon',
    settlement: {
      name, tier, population: 6000,
      config: { tradeRouteAccess: 'road', ...(d ? { primaryDeityRef: d._deityRef, primaryDeitySnapshot: d } : {}) },
      institutions: [], economicState: { primaryExports: [], primaryImports: [] },
      powerStructure: {
        government, governingName: government,
        publicLegitimacy: { score: legitimacy, label: 'Stable' },
        factions: [{ id: 'f.gov', name: government, archetype: 'government', power: 60, isGoverning: true }],
        conflicts: [],
      },
      npcs: [{ id: `n_${id}`, name: `Steward ${id}`, importance: 'pillar', linkedFactionIds: ['f.gov'], personality: { dominant: 'principled' } }],
      activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function campaignOf(saves, edges) {
  return {
    id: 'fsg', name: 'fsg', settlementIds: saves.map((s) => s.id),
    worldState: { rngSeed: RNG_SEED, tick: 1, simulationRules: {} },
    regionalGraph: ensureRegionalGraph({ edges }),
    wizardNews: { currentTick: 1, entries: [] },
  };
}

// Drive advanceReligionStates for `ticks` ticks — threading religionStates forward,
// re-embedding each patron onto config (what the kernel does via deityReembed), and
// rebuilding the snapshot each tick. Returns the final ledger + every cross-settlement
// artifact emitted along the way (channels + outcomes) + the re-embedded saves.
function runLocal(saves0, edges, rules, ticks, initialStates = undefined) {
  let saves = saves0.map((s) => ({ ...s, settlement: { ...s.settlement, config: { ...s.settlement.config } } }));
  let worldState = { rngSeed: RNG_SEED, tick: 1, simulationRules: rules, religionStates: initialStates };
  const allChannels = [];
  const allOutcomes = [];
  for (let t = 0; t < ticks; t++) {
    const campaign = campaignOf(saves, edges);
    const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
    const rng = createPRNG(`${RNG_SEED}::tick:${worldState.tick}`);
    const r = advanceReligionStates({ snapshot, worldState, tick: worldState.tick, now: NOW, rules, rng });
    allChannels.push(...r.graphChannels);
    allOutcomes.push(...r.outcomes);
    worldState = { ...worldState, tick: worldState.tick + 1, religionStates: r.religionStates || worldState.religionStates };
    saves = saves.map((s) => {
      const st = r.religionStates?.[s.id];
      const p = st ? patronSnapshot(st) : null;
      return p ? { ...s, settlement: { ...s.settlement, config: { ...s.settlement.config, primaryDeityRef: p._deityRef, primaryDeitySnapshot: p } } } : s;
    });
  }
  return { religionStates: worldState.religionStates || {}, allChannels, allOutcomes, saves };
}

// ─────────────────────────────────────────────────────────────────────────────
// FLAG MIGRATION (ratification 2 — the tolerant reader)
// ─────────────────────────────────────────────────────────────────────────────
describe('faithSpreadEnabled migration (W-F1 / ratification 2)', () => {
  it('normalize maps the legacy religionDynamicsEnabled onto faithSpreadEnabled (kept in lockstep)', () => {
    const on = normalizeSimulationRules({ religionDynamicsEnabled: true });
    expect(on.faithSpreadEnabled).toBe(true);
    expect(on.religionDynamicsEnabled).toBe(true);
    const off = normalizeSimulationRules({ religionDynamicsEnabled: false });
    expect(off.faithSpreadEnabled).toBe(false);
    expect(off.religionDynamicsEnabled).toBe(false);
  });

  it('normalize honors the new faithSpreadEnabled key (and mirrors it onto the legacy key)', () => {
    const n = normalizeSimulationRules({ faithSpreadEnabled: true });
    expect(n.faithSpreadEnabled).toBe(true);
    expect(n.religionDynamicsEnabled).toBe(true);
  });

  it('default (no faith flag) ⇒ both false', () => {
    const n = normalizeSimulationRules({});
    expect(n.faithSpreadEnabled).toBe(false);
    expect(n.religionDynamicsEnabled).toBe(false);
    expect(DEFAULT_SIMULATION_RULES.faithSpreadEnabled).toBe(false);
  });

  it('fail-closed: non-boolean faith flags ⇒ false (no silent activation from a corrupted blob)', () => {
    const n = normalizeSimulationRules({ faithSpreadEnabled: 1, religionDynamicsEnabled: 'true' });
    expect(n.faithSpreadEnabled).toBe(false);
    expect(n.religionDynamicsEnabled).toBe(false);
  });

  it('store-merge back-compat: the legacy gate write wins over a stale mirror (Living-World gate keeps working)', () => {
    // The store merges {...stored, ...patch} then re-normalizes. Stored is already
    // mirrored (both true); the not-yet-migrated gate writes the LEGACY key false —
    // spread must resolve OFF (the gate's intent wins over the stale mirror).
    const stored = normalizeSimulationRules({ faithSpreadEnabled: true });
    const gateOff = normalizeSimulationRules({ ...stored, religionDynamicsEnabled: false });
    expect(gateOff.faithSpreadEnabled).toBe(false);
    expect(gateOff.religionDynamicsEnabled).toBe(false);
    // ...and a fresh gate-ON write flips both back on.
    const gateOn = normalizeSimulationRules({ ...gateOff, religionDynamicsEnabled: true });
    expect(gateOn.faithSpreadEnabled).toBe(true);
    expect(gateOn.religionDynamicsEnabled).toBe(true);
  });

  it('isFaithSpreadEnabled tolerant reader: honors the new key, falls back to legacy, fails closed', () => {
    expect(isFaithSpreadEnabled({ faithSpreadEnabled: true })).toBe(true);
    expect(isFaithSpreadEnabled({ faithSpreadEnabled: false })).toBe(false);
    expect(isFaithSpreadEnabled({ religionDynamicsEnabled: true })).toBe(true);   // legacy fallback
    expect(isFaithSpreadEnabled({})).toBe(false);
    expect(isFaithSpreadEnabled(null)).toBe(false);
    expect(isFaithSpreadEnabled({ faithSpreadEnabled: 'yes' })).toBe(false);       // fail-closed
  });

  it('preset identity survives the new flag (the default still resolves to realistic_regional)', () => {
    expect(normalizeSimulationRules({}).presetId).toBe('realistic_regional');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// OWNER PIN 1 — faithSpreadInertness
// ─────────────────────────────────────────────────────────────────────────────
describe('faithSpreadInertness (owner pin 1) — spread OFF ⇒ zero cross-settlement faith influence', () => {
  const A = deity('Aurum', 'peaceful', 'good', 'major');
  const K = deity('Korl', 'warlike', 'evil', 'major');   // a different niche from Aurum
  const region = () => [
    save('a', 'Acity', A, { tier: 'city' }),
    save('b', 'Bburg', K, { tier: 'city' }),
    save('f', 'Ffree', null, { tier: 'town', legitimacy: 30 }),   // deity-free would-be convert
  ];
  const edges = [
    { id: 'e.a.f', from: 'a', to: 'f', relationshipType: 'allied' },
    { id: 'e.b.f', from: 'b', to: 'f', relationshipType: 'trade_partner' },
    { id: 'e.a.b', from: 'a', to: 'b', relationshipType: 'allied' },
  ];

  it('over 30 ticks: no mints, no reach entries, the deity-free bystander is never touched, no conversions', () => {
    const { religionStates, allChannels, allOutcomes } = runLocal(region(), edges, { faithSpreadEnabled: false }, 30);
    // No religious_authority mints crossed any boundary.
    expect(allChannels).toEqual([]);
    // The deity-free bystander F received no faith (no carrier reach) ⇒ no state at all.
    expect('f' in religionStates).toBe(false);
    // Only the two deity-bearers carry state, each holding its OWN patron — no foreign
    // faith (and thus no prevalence/neighbour influence) ever entered either pantheon.
    expect(Object.keys(religionStates).sort()).toEqual(['a', 'b']);
    expect(religionStates.a.patronRef).toBe(ref('Aurum'));
    expect(religionStates.b.patronRef).toBe(ref('Korl'));
    expect(Object.keys(religionStates.a.deities)).toEqual([ref('Aurum')]);
    expect(Object.keys(religionStates.b.deities)).toEqual([ref('Korl')]);
    // No cross-settlement conversion outcomes.
    expect(allOutcomes).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// OWNER PIN 2 — faithSpreadDeterminism
// ─────────────────────────────────────────────────────────────────────────────
describe('faithSpreadDeterminism (owner pin 2) — spread ON ⇒ same seed ⇒ identical states across runs + member order', () => {
  const V = deity('Vael', 'warlike', 'good', 'major');
  const K = deity('Korl', 'warlike', 'evil', 'major');
  const sources = () => [
    save('asource', 'Asource', V, { tier: 'city' }),
    save('bsource', 'Bsource', K, { tier: 'city' }),
    save('cconv', 'Cconv', null, { tier: 'town', legitimacy: 30 }),
  ];
  const edges = [
    { id: 'e.a.c', from: 'asource', to: 'cconv', relationshipType: 'allied' },
    { id: 'e.b.c', from: 'bsource', to: 'cconv', relationshipType: 'trade_partner' },
  ];
  const canon = (rs) => JSON.stringify(Object.fromEntries(Object.keys(rs).sort().map((k) => [k, rs[k]])));
  const outShape = (r) => JSON.stringify(r.allOutcomes.map((o) => [o.targetSaveId, o.deityReembed?.snapshot?.name]));

  it('two runs with the same seed produce identical religionStates + conversion outcomes', () => {
    const r1 = runLocal(sources(), edges, { faithSpreadEnabled: true }, 25);
    const r2 = runLocal(sources(), edges, { faithSpreadEnabled: true }, 25);
    expect(canon(r1.religionStates)).toBe(canon(r2.religionStates));
    expect(outShape(r1)).toBe(outShape(r2));
    // Anti-vacuity: spread ON actually did cross-settlement work (C received a faith).
    expect('cconv' in r1.religionStates).toBe(true);
  });

  it('reversing member + edge order yields identical religionStates (order independence)', () => {
    const fwd = runLocal(sources(), edges, { faithSpreadEnabled: true }, 25);
    const rev = runLocal([...sources()].reverse(), [...edges].reverse(), { faithSpreadEnabled: true }, 25);
    expect(canon(fwd.religionStates)).toBe(canon(rev.religionStates));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// OWNER PIN 3 — settlementFaithStandalone
// ─────────────────────────────────────────────────────────────────────────────
describe('settlementFaithStandalone (owner pin 3) — spread OFF ⇒ shares/legitimacy/mandate evolve the same alone or amid other faiths', () => {
  const T = deity('Ordin', 'peaceful', 'good', 'major');
  const O1 = deity('Malfea', 'warlike', 'evil', 'major');
  const O2 = deity('Sylv', 'neutral', 'neutral', 'minor');
  // The target is a THEOCRACY so the divine mandate is live and observable.
  const target = () => save('t', 'Tcity', T, { tier: 'city', government: 'Theocracy', legitimacy: 40 });
  const others = () => [
    save('o1', 'O1city', O1, { tier: 'city' }),
    save('o2', 'O2town', O2, { tier: 'town' }),
  ];
  const edges = [
    { id: 'e.t.o1', from: 't', to: 'o1', relationshipType: 'allied' },
    { id: 'e.t.o2', from: 't', to: 'o2', relationshipType: 'trade_partner' },
  ];
  const mandateScore = (settlement, religionStates) =>
    applyDivineMandate(projectReligionStateOntoSettlement(settlement, religionStates, 't')).powerStructure.publicLegitimacy.score;

  it("T's pantheon (shares + legitimacy) and its divine mandate are identical solo vs amid other faiths", () => {
    const solo = runLocal([target()], [], { faithSpreadEnabled: false }, 25);
    const multi = runLocal([target(), ...others()], edges, { faithSpreadEnabled: false }, 25);
    // Shares + legitimacy: T's pantheon is byte-identical.
    expect(JSON.stringify(multi.religionStates.t)).toBe(JSON.stringify(solo.religionStates.t));
    // Mandate: the divine-mandate-adjusted publicLegitimacy is identical too.
    const tSolo = solo.saves.find((s) => s.id === 't').settlement;
    const tMulti = multi.saves.find((s) => s.id === 't').settlement;
    expect(mandateScore(tMulti, multi.religionStates)).toBe(mandateScore(tSolo, solo.religionStates));
    // Anti-vacuity: T's legitimacy actually moved off its seed (the lane did work).
    expect(solo.religionStates.t.deities[ref('Ordin')].legitimacy).not.toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// OWNER PIN 4 — coexistenceIndependence
// ─────────────────────────────────────────────────────────────────────────────
describe('coexistenceIndependence (owner pin 4) — N distinct deities, spread OFF ⇒ every pantheon evolves as if alone', () => {
  const gods = [
    deity('Aurum', 'peaceful', 'good', 'major'),
    deity('Korl', 'warlike', 'evil', 'major'),
    deity('Sylv', 'neutral', 'neutral', 'minor'),
    deity('Brand', 'warlike', 'good', 'minor'),
  ];
  const members = () => gods.map((g, i) => save(`m${i}`, `M${i}`, g, { tier: i % 2 ? 'city' : 'town' }));
  const edges = [
    { id: 'e01', from: 'm0', to: 'm1', relationshipType: 'allied' },
    { id: 'e12', from: 'm1', to: 'm2', relationshipType: 'trade_partner' },
    { id: 'e23', from: 'm2', to: 'm3', relationshipType: 'vassal' },
    { id: 'e30', from: 'm3', to: 'm0', relationshipType: 'allied' },
  ];

  it('each member pantheon equals its solo-run counterpart (pairwise)', () => {
    const K = 25;
    const multi = runLocal(members(), edges, { faithSpreadEnabled: false }, K);
    for (let i = 0; i < gods.length; i++) {
      const solo = runLocal([members()[i]], [], { faithSpreadEnabled: false }, K);
      expect(JSON.stringify(multi.religionStates[`m${i}`])).toBe(JSON.stringify(solo.religionStates[`m${i}`]));
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FREEZE + COUPLING — toggling spread OFF freezes the ledger (does not delete it)
// ─────────────────────────────────────────────────────────────────────────────
describe('freeze + coupling (W-F1 semantics) — spread OFF preserves the ledger and couples from current state', () => {
  const A = deity('Aurum', 'peaceful', 'good', 'major');
  const K = deity('Korl', 'warlike', 'evil', 'major');
  const region = () => [
    save('a', 'Acity', A, { tier: 'city' }),
    save('b', 'Bburg', K, { tier: 'city' }),
    save('f', 'Ffree', null, { tier: 'town', legitimacy: 30 }),
  ];
  const edges = [
    { id: 'e.a.f', from: 'a', to: 'f', relationshipType: 'allied' },
    { id: 'e.b.f', from: 'b', to: 'f', relationshipType: 'trade_partner' },
  ];

  it('faiths that reached a bystander under spread ON persist and keep evolving locally after spread OFF (no delete, no new reach)', () => {
    // Phase 1 — spread ON: Aurum/Korl reach the deity-free bystander F.
    const on = runLocal(region(), edges, { faithSpreadEnabled: true }, 20);
    expect('f' in on.religionStates).toBe(true);
    const reachedFaiths = Object.keys(on.religionStates.f.deities).sort();
    expect(reachedFaiths.length).toBeGreaterThan(0);

    // Phase 2 — continue from that coupled ledger with spread OFF for 10 ticks.
    const off = runLocal(on.saves, edges, { faithSpreadEnabled: false }, 10, on.religionStates);
    // Freeze-not-delete: F's state persists (the conditional ledger is not dropped).
    expect('f' in off.religionStates).toBe(true);
    // Coupling-from-current-state: no NEW foreign faith enters F once spread is off —
    // its faith set is a subset of what it already carried (existing faiths keep evolving).
    const afterFaiths = Object.keys(off.religionStates.f.deities);
    for (const dref of afterFaiths) expect(reachedFaiths).toContain(dref);
    // And no fresh cross-settlement artifacts are emitted while spread is off.
    expect(off.allChannels).toEqual([]);
  });
});
