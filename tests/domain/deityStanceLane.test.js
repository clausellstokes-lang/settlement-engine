/**
 * tests/domain/deityStanceLane.test.js — Phase 4 W-F4b, item 1 (the global stance
 * lane). Pins the SPREAD-lane inter-deity consumer that turns deityStance's pure
 * stances into discrete, seeded, cause-chained BETRAYAL / PACT events:
 *   - evil-pact COHESION on MIN-lawfulness (LE×LE bonds hardest ⇒ least betrayal;
 *     any chaotic-evil party ⇒ brittle ⇒ most betrayal): the owner's
 *     LE×LE > LE×CE ≥ CE×CE cooperation ordering, read off betrayal frequency;
 *   - GOOD never initiates (asymmetry by design);
 *   - the piety COMPOSITION (acting settlement's zeal amplifies frequency + severity);
 *   - the CADENCE GUARDS — per-pair cooldown (pulseHistory) + per-tick realm cap;
 *   - DETERMINISM (pair-forked, replay-identical);
 *   - the True-Neutral / legacy NEUTRALITY anchor (zero events ⇒ byte-identical);
 *   - and the spread-gate integration through advanceReligionStates.
 */
import { describe, expect, test } from 'vitest';

import {
  evaluateDeityStanceLane,
  betrayalCooldownPairs,
  pactBetrayalHazard,
  stancePairKey,
  footholdOutcome,
  STANCE_LANE_TUNING,
} from '../../src/domain/worldPulse/deityStanceLane.js';
import { targetedFootholds } from '../../src/domain/worldPulse/clergyTraitPlane.js';
import { advanceReligionStates } from '../../src/domain/worldPulse/religiousContest.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';

const CE = { name: 'Vorr', alignmentAxis: 'evil', lawAxis: 'chaotic' };
const CE2 = { name: 'Skarn', alignmentAxis: 'evil', lawAxis: 'chaotic' };
const LE = { name: 'Moloch', alignmentAxis: 'evil', lawAxis: 'lawful' };
const LE2 = { name: 'Kael', alignmentAxis: 'evil', lawAxis: 'lawful' };
const LG = { name: 'Aurum', alignmentAxis: 'good', lawAxis: 'lawful' };
const CG = { name: 'Sylra', alignmentAxis: 'good', lawAxis: 'chaotic' };
const TN = { name: 'Tal', alignmentAxis: 'neutral', lawAxis: 'neutral' };

const noPiety = () => 1;
const nameOf = (id) => id;

/** Run the lane over N ticks with a fresh forked PRNG per tick; count events + keep first sample. */
function runLane({ pairs, deityOf, pietyMultOf = noPiety, ticks = 40, cooldownPairs = new Set() }) {
  let outcomes = [];
  for (let t = 1; t <= ticks; t++) {
    const rng = createPRNG(`lane::tick:${t}`);
    const r = evaluateDeityStanceLane({ pairs, deityOf, pietyMultOf, nameFor: nameOf, tick: t, rng, cooldownPairs });
    outcomes = outcomes.concat(r.outcomes);
  }
  return outcomes;
}

describe('evil-pact cohesion on MIN-lawfulness (owner: LE×LE > LE×CE ≥ CE×CE)', () => {
  test('betrayal hazard is DAMPED by the least-lawful party: LE×LE ≪ LE×CE ≤ CE×CE', () => {
    const leLe = pactBetrayalHazard(LE, LE2);
    const leCe = pactBetrayalHazard(LE, CE);
    const ceCe = pactBetrayalHazard(CE, CE2);
    expect(leLe).toBeLessThan(leCe);
    expect(leCe).toBeLessThanOrEqual(ceCe);
    // Good / neutral never carry a betrayal hazard.
    expect(pactBetrayalHazard(LG, CG)).toBe(0);
    expect(pactBetrayalHazard(TN, CE)).toBe(0);
  });

  test('cohesion translates to FREQUENCY: LE×LE betrays far less often than CE×CE', () => {
    const ceEvents = runLane({ pairs: [{ a: 'a', b: 'b', positive: true }], deityOf: (id) => (id === 'a' ? CE : CE2) });
    const leEvents = runLane({ pairs: [{ a: 'a', b: 'b', positive: true }], deityOf: (id) => (id === 'a' ? LE : LE2) });
    expect(ceEvents.length).toBeGreaterThan(0);
    expect(leEvents.length).toBeLessThan(ceEvents.length);
  });
});

describe('betrayal events — plumbing + cause chains', () => {
  test('a chaotic-evil betrayal seeds the betrayal stressor with a full cause chain', () => {
    const events = runLane({ pairs: [{ a: 'ash', b: 'black', positive: true }], deityOf: (id) => (id === 'ash' ? CE : CE2) });
    expect(events.length).toBeGreaterThan(0);
    const o = events[0];
    expect(o.type).toBe('stressor');
    expect(o.stressor.type).toBe('betrayal');
    expect(o.ruleId).toBe('religious_pact_betrayal');
    expect(o.applyMode).toBe('auto');
    expect(o.metadata.pairKey).toBe(stancePairKey('ash', 'black'));
    expect(o.metadata.conversionCause).toBe('deity_pact_betrayal');
    // The betrayed settlement is the target; NO originContext ⇒ no traitor seeding.
    expect(o.targetSaveId).toBe('black');
    expect(o.stressor.originContext).toBeFalsy();   // null/absent ⇒ apply seeds no traitor
    // Legibility law: a non-empty reasons chain naming both patrons' axes.
    expect(Array.isArray(o.reasons)).toBe(true);
    expect(o.reasons[0]).toMatch(/betrayal hazard/i);
    expect(o.condition.causes.length).toBeGreaterThan(0);
    expect(o.condition.triggeredAt.sourceEventType).toBe('DEITY_PACT_BETRAYAL');
  });

  test('GOOD never initiates a betrayal (even between two allied good faiths)', () => {
    const events = runLane({ pairs: [{ a: 'g1', b: 'g2', positive: true }], deityOf: (id) => (id === 'g1' ? LG : CG) });
    expect(events).toEqual([]);
  });
});

describe('pact events — the positive lane (news only, no relationship weights this wave)', () => {
  test('two related-but-unallied good faiths form a cause-chained faith_pact', () => {
    const events = runLane({ pairs: [{ a: 'high', b: 'river', positive: false }], deityOf: (id) => (id === 'high' ? LG : CG) });
    expect(events.length).toBeGreaterThan(0);
    const o = events[0];
    expect(o.type).toBe('faith_pact');
    expect(o.ruleId).toBe('religious_pact_formation');
    expect(o.reasons[0]).toMatch(/common ground/i);
  });

  test('evil TRANSACTIONAL cooperation stays below the pact floor ⇒ no pact', () => {
    // Two chaotic-evil faiths cooperate only transactionally (< PACT_MIN_COOP).
    const events = runLane({ pairs: [{ a: 'a', b: 'b', positive: false }], deityOf: (id) => (id === 'a' ? CE : CE2) });
    // No pact; and (positive:false) so no betrayal branch either.
    expect(events.filter((o) => o.type === 'faith_pact')).toEqual([]);
  });
});

describe('cadence guards (absolute — never piety-amplified)', () => {
  test('a pair on cooldown fires no betrayal', () => {
    const cool = new Set([stancePairKey('a', 'b')]);
    const events = runLane({ pairs: [{ a: 'a', b: 'b', positive: true }], deityOf: (id) => (id === 'a' ? CE : CE2), cooldownPairs: cool });
    expect(events).toEqual([]);
  });

  test('betrayalCooldownPairs reads pulseHistory within the window', () => {
    const key = stancePairKey('a', 'b');
    const ws = {
      pulseHistory: [
        { tick: 10, selectedOutcomes: [{ ruleId: 'religious_pact_betrayal', tick: 10, metadata: { pairKey: key } }] },
      ],
    };
    // Within the cooldown window ⇒ present; after it ⇒ absent.
    expect(betrayalCooldownPairs(ws, 12).has(key)).toBe(true);
    expect(betrayalCooldownPairs(ws, 10 + STANCE_LANE_TUNING.BETRAYAL_COOLDOWN_TICKS).has(key)).toBe(false);
  });

  test('the per-tick realm cap bounds betrayals (MAX_BETRAYALS_PER_TICK)', () => {
    // Many allied chaotic-evil pairs in one tick; only up to the cap may fire.
    const pairs = [];
    const deities = {};
    for (let i = 0; i < 10; i++) {
      const a = `p${i}a`; const b = `p${i}b`;
      pairs.push({ a, b, positive: true });
      deities[a] = { ...CE, name: `V${i}` };
      deities[b] = { ...CE2, name: `S${i}` };
    }
    const rng = createPRNG('cap::tick:1');
    const r = evaluateDeityStanceLane({ pairs, deityOf: (id) => deities[id], pietyMultOf: noPiety, nameFor: nameOf, tick: 1, rng, cooldownPairs: new Set() });
    expect(r.betrayed.length).toBeLessThanOrEqual(STANCE_LANE_TUNING.MAX_BETRAYALS_PER_TICK);
  });
});

describe('piety composition + neutrality', () => {
  test('the acting settlement piety amplifies betrayal frequency', () => {
    const nominal = runLane({ pairs: [{ a: 'a', b: 'b', positive: true }], deityOf: (id) => (id === 'a' ? CE : CE2) });
    const devout = runLane({ pairs: [{ a: 'a', b: 'b', positive: true }], deityOf: (id) => (id === 'a' ? CE : CE2), pietyMultOf: (id) => (id === 'a' ? 1.6 : 1) });
    expect(devout.length).toBeGreaterThan(nominal.length);
  });

  test('a True-Neutral / legacy realm is INERT (zero events, byte-identical)', () => {
    expect(runLane({ pairs: [{ a: 'x', b: 'y', positive: true }], deityOf: () => TN })).toEqual([]);
    expect(runLane({ pairs: [{ a: 'x', b: 'y', positive: false }], deityOf: () => TN })).toEqual([]);
  });

  test('determinism — the same seed yields identical events', () => {
    const rngA = createPRNG('det::1');
    const rngB = createPRNG('det::1');
    const args = { pairs: [{ a: 'a', b: 'b', positive: true }], deityOf: (id) => (id === 'a' ? CE : CE2), pietyMultOf: noPiety, nameFor: nameOf, tick: 7, cooldownPairs: new Set() };
    expect(JSON.stringify(evaluateDeityStanceLane({ ...args, rng: rngA })))
      .toBe(JSON.stringify(evaluateDeityStanceLane({ ...args, rng: rngB })));
  });
});

// ── Item 3 — targeted footholds ────────────────────────────────────────────────
describe('targeted footholds — rival deities recruit the specific minister who matches them', () => {
  const patron = { name: 'Aurum', alignmentAxis: 'good', lawAxis: 'lawful' };
  const rivalCE = { name: 'Vorr', alignmentAxis: 'evil', lawAxis: 'chaotic' };
  const clergySettlement = (npcs) => ({ powerStructure: { factions: [{ id: 'temple', archetype: 'religious' }, { id: 'gov', archetype: 'government' }] }, npcs });

  test('a corrupt influential minister is recruited by the plane-matching rival; the aligned one is not', () => {
    const settlement = clergySettlement([
      { id: 'n1', name: 'High Priest Cael', importance: 'pillar', linkedFactionIds: ['temple'], personality: { dominant: 'corrupt', flaw: 'deceitful' } },
      { id: 'n2', name: 'Sister Wren', importance: 'key', linkedFactionIds: ['temple'], personality: { dominant: 'compassionate', flaw: 'principled' } },
    ]);
    const matches = targetedFootholds(settlement, patron, [{ ref: 'Vorr', snapshot: rivalCE }]);
    expect(matches).toHaveLength(1);
    expect(matches[0].npcId).toBe('n1');
    expect(matches[0].rivalRef).toBe('Vorr');
  });

  test('minor (low-org-power) clergy are ignored', () => {
    const settlement = clergySettlement([{ id: 'n3', name: 'Acolyte Pim', importance: 'minor', linkedFactionIds: ['temple'], personality: { dominant: 'corrupt' } }]);
    expect(targetedFootholds(settlement, patron, [{ ref: 'Vorr', snapshot: rivalCE }])).toEqual([]);
  });

  test('trait-neutral clergy / no religious faction / no rival ⇒ zero footholds (byte-identical)', () => {
    const neutral = clergySettlement([{ id: 'n1', name: 'Bland', importance: 'pillar', linkedFactionIds: ['temple'], personality: { dominant: 'stoic' } }]);
    expect(targetedFootholds(neutral, patron, [{ ref: 'Vorr', snapshot: rivalCE }])).toEqual([]);
    expect(targetedFootholds({ powerStructure: { factions: [{ id: 'gov', archetype: 'government' }] }, npcs: [] }, patron, [{ ref: 'Vorr', snapshot: rivalCE }])).toEqual([]);
    const withClergy = clergySettlement([{ id: 'n1', name: 'Cael', importance: 'pillar', linkedFactionIds: ['temple'], personality: { dominant: 'corrupt' } }]);
    expect(targetedFootholds(withClergy, patron, [])).toEqual([]);
  });

  test('footholdOutcome carries a named, cause-chained receipt', () => {
    const o = footholdOutcome({ cid: 'c', cityName: 'Highvale', npcId: 'n1', npcName: 'Cael', rivalRef: 'Vorr', rivalName: 'Vorr', patronName: 'Aurum', tick: 4, reasons: ['Cael leans toward Vorr and away from Aurum.'], amplifiers: null });
    expect(o.type).toBe('faith_foothold');
    expect(o.ruleId).toBe('religious_targeted_foothold');
    expect(o.metadata.npcId).toBe('n1');
    expect(o.metadata.rivalRef).toBe('Vorr');
    expect(o.condition.causes[0].effect).toBe('faith_foothold');
  });
});

// ── Integration through advanceReligionStates' spread gate ─────────────────────
const NOW = '2026-01-01T00:00:00.000Z';
function save(id, name, d, edgesTier = 'city') {
  return {
    id, name, phase: 'canon',
    settlement: {
      name, tier: edgesTier, population: 6000,
      config: { primaryDeityRef: d.name, primaryDeitySnapshot: { ...d, _deityRef: d.name } },
      institutions: [], economicState: {},
      powerStructure: { government: 'Warlord', governingName: 'Warlord', publicLegitimacy: { score: 50 }, factions: [], conflicts: [] },
      npcs: [], activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}
function run(saves, edges, rules) {
  const campaign = { id: 'x', name: 'x', settlementIds: saves.map((s) => s.id), worldState: { rngSeed: 's', tick: 3 }, regionalGraph: ensureRegionalGraph({ edges }), wizardNews: { currentTick: 3, entries: [] } };
  const worldState = { rngSeed: 's', tick: 3, simulationRules: rules, pulseHistory: [] };
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
  const rng = createPRNG('s::tick:3');
  return advanceReligionStates({ snapshot, worldState, tick: 3, now: NOW, rules, rng });
}

describe('spread gate — the lane is inert when spread is off, active when on', () => {
  const saves = () => [save('a', 'Ashfall', CE), save('b', 'Blackmoor', CE2)];
  const edges = [{ id: 'e', from: 'a', to: 'b', relationshipType: 'allied' }];

  test('spread OFF ⇒ no stance outcomes at all', () => {
    const r = run(saves(), edges, { faithSpreadEnabled: false });
    expect(r.outcomes.filter((o) => o.ruleId === 'religious_pact_betrayal')).toEqual([]);
  });

  test('spread ON ⇒ an allied chaotic-evil pair can betray (event present, deterministic)', () => {
    const r1 = run(saves(), edges, { faithSpreadEnabled: true });
    const r2 = run(saves(), edges, { faithSpreadEnabled: true });
    const b1 = r1.outcomes.filter((o) => o.ruleId === 'religious_pact_betrayal');
    expect(b1.length).toBeGreaterThan(0);
    expect(JSON.stringify(r1.outcomes)).toBe(JSON.stringify(r2.outcomes));   // replay-identical
  });
});
