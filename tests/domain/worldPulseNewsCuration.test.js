/**
 * tests/domain/worldPulseNewsCuration.test.js — Cohesion Wave 7 pins
 * (Wizard News feed curation: the feed stops drowning the story).
 *
 * The probe-grounded experience assessment measured 8-13 feed entries/tick,
 * dominated by NPC micro-posturing and a population_growth metronome with
 * identical reasons every tick — flushing major arcs out of the 240-cap feed
 * the paid chronicle grounds on. Pins:
 *
 *   • Metronome suppression: an auto-applied DRIFT-ONLY outcome repeating the
 *     same (settlement, candidateType, headline) story with materially
 *     identical reasons within the 6-tick cooldown does not re-emit a feed
 *     entry. Changed reasons re-emit; a lapsed cooldown re-emits. The
 *     headline is part of the key so the suppression is never actor-blind:
 *     a DIFFERENT NPC acting in the same family is a new story, not a repeat.
 *   • Party actions are NEVER drift: a party-sourced outcome (partySourced,
 *     stamped by partyImpact.js) repeated inside the cooldown emits every
 *     time — a deliberate DM action never changes the world silently.
 *   • State changes ALWAYS emit: an outcome carrying a discrete transition
 *     (condition onset, tier change, stressor, power transfer, multi-
 *     settlement migration) is exempt from suppression.
 *   • The ledger is untouched: autoApplied still returns every outcome —
 *     only the FEED is curated.
 *   • Significance honesty: npc_* candidateTypes at settlement scope below
 *     the severity bar never exceed 'notable' (proposal routing alone no
 *     longer inflates posturing to 'major'); non-npc transitions keep 'major'.
 *   • Facts, not hypotheticals: kind='applied' entries state what HAPPENED —
 *     outcome.appliedHeadline wins when provided, otherwise known hedge
 *     patterns de-hedge ('may grow' → 'grows'); unknown phrasings pass
 *     through untouched. An applied population_growth entry contains no 'may'.
 *     Resource rewrites are number-invariant ('depleted' / 'recovering'):
 *     ~half the resource catalog is plural ('grain fields', 'salt flats'),
 *     so a singular verb ('is depleted', 'recovers') would mangle them.
 */

import { describe, expect, test } from 'vitest';

import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-06-11T00:00:00.000Z';

function bareWorldState() {
  return { stressors: [], npcStates: {}, proposals: [] };
}

function town(name) {
  return {
    name,
    tier: 'town',
    population: 1500,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: { factions: [], conflicts: [] },
    npcs: [],
    activeConditions: [],
  };
}

function alphaMap() {
  return new Map([
    ['alpha', { saveId: 'alpha', save: { name: 'Alphaville' }, settlement: town('Alphaville') }],
  ]);
}

function pulse({ outcomes, tick, wizardNews, worldState }) {
  const graph = ensureRegionalGraph({ nodes: [{ id: 'alpha', name: 'Alphaville' }] });
  return applyWorldPulseOutcomes({
    snapshot: { regionalGraph: graph, settlements: [{ id: 'alpha', name: 'Alphaville' }], campaign: {} },
    worldState: worldState || bareWorldState(),
    regionalGraph: graph,
    wizardNews: wizardNews || { currentTick: 0, entries: [] },
    settlementMap: alphaMap(),
    outcomes,
    tick,
    now: NOW,
  });
}

function popOutcome(tick, overrides = {}) {
  return {
    id: `outcome.population.growth.alpha.${tick}`,
    type: 'population',
    candidateType: 'population_growth',
    applyMode: 'auto',
    severity: 0.2,
    headline: 'Alphaville population may grow',
    summary: 'Alphaville gains about 12 people from favorable conditions.',
    reasons: ['Food 0.29, defense pressure 0.29, trade pressure 0.17.', 'Interval one month with standard intensity.'],
    targetSaveId: 'alpha',
    populationDeltas: [{ saveId: 'alpha', delta: 12, reason: 'Organic growth from favorable conditions.' }],
    ...overrides,
  };
}

const appliedEntryFor = (result, outcome) =>
  result.newsEntries.find(entry => entry.sourceEventId === outcome.id && entry.kind === 'applied');

describe('metronome suppression (feed curation, not ledger curation)', () => {
  test('an identical-reason repeat inside the cooldown is suppressed from the feed but kept in the ledger', () => {
    const first = pulse({ outcomes: [popOutcome(6)], tick: 6 });
    expect(appliedEntryFor(first, popOutcome(6))).toBeTruthy();

    const repeat = popOutcome(7);
    const second = pulse({ outcomes: [repeat], tick: 7, wizardNews: first.wizardNews });
    // Ledger untouched: the outcome auto-applied (and population moved).
    expect(second.autoApplied.map(o => o.id)).toContain(repeat.id);
    expect(second.settlementUpdates[0].settlement.population).toBe(1512);
    // Feed curated: no second applied entry for the same metronome story.
    expect(appliedEntryFor(second, repeat)).toBeUndefined();
  });

  test('materially different reasons re-emit inside the cooldown', () => {
    const first = pulse({ outcomes: [popOutcome(6)], tick: 6 });
    const changed = popOutcome(7, {
      reasons: ['Food 0.29, defense pressure 0.29, trade pressure 0.30.', 'Interval one month with standard intensity.'],
    });
    const second = pulse({ outcomes: [changed], tick: 7, wizardNews: first.wizardNews });
    expect(appliedEntryFor(second, changed)).toBeTruthy();
  });

  test('a lapsed cooldown re-emits (long drifts stay visible)', () => {
    const first = pulse({ outcomes: [popOutcome(6)], tick: 6 });
    const later = popOutcome(12);
    const second = pulse({ outcomes: [later], tick: 12, wizardNews: first.wizardNews });
    expect(appliedEntryFor(second, later)).toBeTruthy();
  });

  test('a state change always emits: identical-reason condition onset inside the cooldown', () => {
    const conditionOutcome = (tick) => ({
      id: `outcome.pressure.famine.alpha.${tick}`,
      type: 'pressure',
      candidateType: 'famine_pressure',
      applyMode: 'auto',
      severity: 0.55,
      headline: 'Famine pressure may take hold',
      summary: 'The granaries are thin.',
      reasons: ['Food pressure is critical.'],
      targetSaveId: 'alpha',
      condition: { archetype: 'famine', severity: 0.55, triggeredAt: { tick, sourceEventType: 'WORLD_PULSE' } },
    });
    const first = pulse({ outcomes: [conditionOutcome(6)], tick: 6 });
    expect(appliedEntryFor(first, conditionOutcome(6))).toBeTruthy();
    const second = pulse({ outcomes: [conditionOutcome(7)], tick: 7, wizardNews: first.wizardNews });
    expect(appliedEntryFor(second, conditionOutcome(7))).toBeTruthy();
  });

  test('multi-settlement migration deltas are propagation, never suppressed', () => {
    const migration = (tick) => popOutcome(tick, {
      candidateType: 'population_emigration',
      headline: 'Alphaville population may fall',
      populationDeltas: [
        { saveId: 'alpha', delta: -60, reason: 'Population loss from cumulative settlement pressure.' },
        { saveId: 'beta', delta: 27, reason: 'Migrants arrive.' },
      ],
    });
    const first = pulse({ outcomes: [migration(6)], tick: 6 });
    const second = pulse({ outcomes: [migration(7)], tick: 7, wizardNews: first.wizardNews });
    expect(appliedEntryFor(second, migration(7))).toBeTruthy();
  });

  // The suppression key includes the headline, so it is never actor-blind:
  // the probe showed 'Priest Bram may protect' auto-applying SILENTLY one
  // tick after 'Reeve Alda protects' emitted (same impactKind/settlement,
  // and npc/faction families carry near-constant reasons strings).
  const npcProtect = (tick, name) => ({
    id: `outcome.npc.protect.${name.toLowerCase().replace(/\s+/g, '_')}.${tick}`,
    type: 'npc',
    candidateType: 'npc_protect',
    applyMode: 'auto',
    severity: 0.4,
    headline: `${name} may protect`,
    summary: 'A guardian steps up.',
    reasons: ['Pressure gate 0.40, loyalty 0.70.'],
    targetSaveId: 'alpha',
    npcId: `alpha:${name.toLowerCase().replace(/\s+/g, '_')}:0`,
    npcPatch: { momentum: 0.1 },
  });

  test('a DIFFERENT actor in the same action family inside the cooldown is a new story, not a repeat', () => {
    const first = pulse({ outcomes: [npcProtect(6, 'Reeve Alda')], tick: 6 });
    expect(appliedEntryFor(first, npcProtect(6, 'Reeve Alda')).headline).toBe('Reeve Alda protects');
    const bram = npcProtect(7, 'Priest Bram');
    const second = pulse({ outcomes: [bram], tick: 7, wizardNews: first.wizardNews });
    expect(appliedEntryFor(second, bram)).toBeTruthy();
    expect(appliedEntryFor(second, bram).headline).toBe('Priest Bram protects');
  });

  test('the SAME actor repeating the same story inside the cooldown is still suppressed', () => {
    const first = pulse({ outcomes: [npcProtect(6, 'Reeve Alda')], tick: 6 });
    const repeat = npcProtect(7, 'Reeve Alda');
    const second = pulse({ outcomes: [repeat], tick: 7, wizardNews: first.wizardNews });
    expect(second.autoApplied.map(o => o.id)).toContain(repeat.id); // ledger intact
    expect(appliedEntryFor(second, repeat)).toBeUndefined();
  });

  test('a repeated party action is never drift-suppressed: the table acted twice, the feed says so twice', () => {
    // Same action, same story, same cooldown window — partyImpact.js stamps
    // partySourced on every outcome it builds, which exempts it from
    // drift-only classification entirely.
    const bolster = (tick) => ({
      id: `party.bolster_faction.back_the_league.alpha.${tick}`,
      type: 'faction',
      candidateType: 'party_bolster_faction',
      partySourced: true,
      applyMode: 'auto',
      severity: 0.55,
      headline: 'Empower a faction',
      summary: 'The party strengthened a faction\'s standing.',
      reasons: ['Party action: Empower a faction'],
      targetSaveId: 'alpha',
      factionId: 'alpha:merchant_league',
      factionPatch: { momentum: 0.2 },
    });
    const first = pulse({ outcomes: [bolster(6)], tick: 6 });
    expect(appliedEntryFor(first, bolster(6))).toBeTruthy();
    const again = bolster(7);
    const second = pulse({ outcomes: [again], tick: 7, wizardNews: first.wizardNews });
    expect(appliedEntryFor(second, again)).toBeTruthy();
  });
});

describe('significance honesty', () => {
  test('npc_* posturing at settlement scope below the severity bar is notable, even routed as a proposal', () => {
    const posturing = {
      id: 'outcome.npc.seek_promotion.reeve.6',
      type: 'npc',
      candidateType: 'npc_seek_promotion',
      applyMode: 'proposal',
      severity: 0.5,
      headline: 'Reeve Alda may seek promotion',
      summary: 'Ambition stirs.',
      reasons: ['Pressure gate 0.40, ambition 0.60.'],
      targetSaveId: 'alpha',
      npcId: 'alpha:reeve_alda:0',
      npcPatch: { momentum: 0.2 },
    };
    const result = pulse({ outcomes: [posturing], tick: 6 });
    const entry = result.newsEntries.find(e => e.sourceEventId === posturing.id);
    expect(entry.significance).toBe('notable');
  });

  test('a high-severity npc outcome and non-npc transitions keep major', () => {
    const heavyNpc = {
      id: 'outcome.npc.defect.reeve.6',
      type: 'npc',
      candidateType: 'npc_defect',
      applyMode: 'proposal',
      severity: 0.8,
      headline: 'Reeve Alda may defect',
      reasons: ['Loyalty has collapsed.'],
      targetSaveId: 'alpha',
      npcId: 'alpha:reeve_alda:0',
      npcPatch: { loyalty: 0 },
    };
    const transfer = {
      id: 'outcome.power.coup.alpha.6',
      type: 'power_transfer',
      candidateType: 'coup_power_transfer',
      applyMode: 'auto',
      severity: 0.6,
      headline: 'The Merchant League seizes Alphaville',
      reasons: ['The coup succeeded.'],
      targetSaveId: 'alpha',
      powerTransfer: { toPowerName: 'Merchant League', cause: 'coup', tick: 6 },
      applyModeNote: null,
    };
    const result = pulse({ outcomes: [heavyNpc, { ...transfer, severity: 0.8 }], tick: 6 });
    const npcEntry = result.newsEntries.find(e => e.sourceEventId === heavyNpc.id);
    const transferEntry = result.newsEntries.find(e => e.sourceEventId === transfer.id);
    expect(npcEntry.significance).toBe('major');
    expect(transferEntry.significance).toBe('major');
  });
});

describe('facts, not hypotheticals (applied entries state what happened)', () => {
  test('an applied population_growth entry contains no "may"', () => {
    const outcome = popOutcome(6);
    const result = pulse({ outcomes: [outcome], tick: 6 });
    const entry = appliedEntryFor(result, outcome);
    expect(entry.headline).toBe('Alphaville population grows');
    expect(entry.headline).not.toMatch(/\bmay\b/);
  });

  test('outcome.appliedHeadline wins when a generator provides one', () => {
    const outcome = popOutcome(6, { appliedHeadline: 'Alphaville swells with newcomers' });
    const result = pulse({ outcomes: [outcome], tick: 6 });
    expect(appliedEntryFor(result, outcome).headline).toBe('Alphaville swells with newcomers');
  });

  test('known hedge patterns de-hedge; queued proposals keep the hedge', () => {
    const tierDrift = popOutcome(6, {
      id: 'outcome.tier.promotion.alpha.6',
      candidateType: 'tier_promotion',
      headline: 'Alphaville may rise to city',
      populationDeltas: [],
      tierChange: { fromTier: 'town', toTier: 'city' },
    });
    const proposal = popOutcome(6, {
      id: 'outcome.population.growth.alpha.6.p',
      applyMode: 'proposal',
    });
    const result = pulse({ outcomes: [tierDrift, proposal], tick: 6 });
    expect(result.newsEntries.find(e => e.sourceEventId === tierDrift.id).headline)
      .toBe('Alphaville rises to city');
    const queued = result.newsEntries.find(e => e.sourceEventId === proposal.id);
    expect(queued.kind).toBe('queued');
    expect(queued.headline).toBe('Alphaville population may grow');
  });

  test('resource de-hedges are number-invariant: plural subjects are not mangled', () => {
    const resourceOutcome = (id, candidateType, headline, state) => popOutcome(6, {
      id,
      type: 'resource',
      candidateType,
      headline,
      populationDeltas: [],
      resourcePatch: { saveId: 'alpha', resource: headline.split(' may')[0].replace(/ /g, '_'), state },
    });
    const depleted = resourceOutcome('outcome.resource.deplete.alpha.grain_fields.6', 'resource_depletion', 'grain fields may be depleted', 'depleted');
    const recovering = resourceOutcome('outcome.resource.recover.alpha.salt_flats.6', 'resource_recovery', 'salt flats may recover', 'allow');
    const result = pulse({ outcomes: [depleted, recovering], tick: 6 });
    expect(appliedEntryFor(result, depleted).headline).toBe('grain fields depleted');
    expect(appliedEntryFor(result, recovering).headline).toBe('salt flats recovering');
    for (const entry of [appliedEntryFor(result, depleted), appliedEntryFor(result, recovering)]) {
      expect(entry.headline).not.toMatch(/\bmay\b/);
      // No singular-verb mangling of a plural subject.
      expect(entry.headline).not.toMatch(/\bis depleted\b|\brecovers\b/);
    }
  });

  test('an unknown hedge phrasing passes through untouched (no invented facts)', () => {
    const odd = popOutcome(6, {
      candidateType: 'faction_exhaustion',
      type: 'faction',
      factionId: 'alpha:merchant_league',
      headline: 'Merchant League may exhaustion',
      populationDeltas: [],
      factionPatch: { momentum: 0.1 },
    });
    const result = pulse({ outcomes: [odd], tick: 6 });
    expect(result.newsEntries.find(e => e.sourceEventId === odd.id).headline)
      .toBe('Merchant League may exhaustion');
  });
});
