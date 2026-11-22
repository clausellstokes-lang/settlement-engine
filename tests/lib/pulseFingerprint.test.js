/**
 * pulseFingerprint.test.js — the privacy guarantee for world-pulse capture, as a
 * test. Same posture as structuralFingerprint.test.js: a pulse `result` stuffed
 * with distinctive names/prose is fed through every extractor, and none of those
 * strings may appear in the serialized output. If someone later "enriches" an
 * extractor by spreading an outcome, this canary fails loudly.
 *
 * It also pins the SIGNAL (genesis, bands, family counts, fixed new_stressor_count
 * bug) and the deterministic, seed-independent config_signature behaviour that the
 * variance plane depends on.
 */

import { describe, it, expect } from 'vitest';
import {
  extractPulseSummary, extractPulseEffects, extractStressorTransitions,
  extractProposalDecision, extractPartyImpact, extractSimulationRules, signedBand,
} from '../../src/lib/pulseFingerprint.js';
import {
  computeConfigSignature, usedRandomSentinels, extractStressorGenesis, stableStringify,
} from '../../src/lib/structuralFingerprint.js';

// Distinctive strings that must NEVER survive into any emitted shape.
const SENSITIVE = [
  'The Baron seized the granary',     // outcome headline (prose)
  'Lord Aldric Thorne',               // npc name in a summary
  'betrayal by the spymaster',        // reason prose
  'The Great Hunger of Blackmire',    // stressor label (prose)
  'save-uuid-SECRET-7f3a',            // a save id we deliberately keep as a join key only where allowed
  'Blackmire Hollow',                 // settlement name
];

const outcome = (over = {}) => ({
  id: 'o1', type: 'stressor', candidateType: 'stressor_birth_famine', ruleFamily: 'stressor',
  targetSaveId: 'save-1', severity: 0.82, probability: 0.4, applyMode: 'proposal',
  headline: 'The Baron seized the granary', summary: 'Lord Aldric Thorne moved against the council',
  reasons: ['betrayal by the spymaster'],
  populationDeltas: [{ delta: -120 }],
  stressor: { id: 's1', type: 'famine', label: 'The Great Hunger of Blackmire', severity: 0.82, affectedSettlementIds: ['a', 'b'] },
  ...over,
});

const result = {
  tick: 7,
  interval: 'one_month',
  candidates: [outcome(), outcome(), {}],
  selected: [outcome()],
  autoApplied: [
    outcome(),
    outcome({ id: 'o2', type: 'npc', candidateType: 'npc_seek_promotion', ruleFamily: 'npc', applyMode: 'auto', severity: 0.3, stressor: null, populationDeltas: null }),
    outcome({ id: 'o3', type: 'population', candidateType: 'population_decline', applyMode: 'auto', severity: 0.2, stressor: null, populationDeltas: [{ delta: -600 }] }),
    outcome({ id: 'o4', type: 'stressor', candidateType: 'stressor_spread_plague', applyMode: 'auto', severity: 0.5, partySourced: false, stressor: { type: 'plague', label: 'x', affectedSettlementIds: ['c'] } }),
    outcome({ id: 'o5', type: 'relationship', candidateType: 'relationship_shift', applyMode: 'auto', severity: 0.4, partySourced: true, stressor: null, populationDeltas: null }),
  ],
  proposals: [{ id: 'p1', outcome: outcome() }],
  resolvedStressors: [{ id: 's9', type: 'siege', label: 'The Long Siege of Blackmire Hollow' }],
  pulseRecord: {
    graduatedStressors: [{ id: 's8', type: 'unrest', label: 'whatever' }],
    corruptionEvents: [{ settlementId: 'x', name: 'Lord Aldric Thorne', kind: 'ousted' }],
    factionCaptureEvents: [{ settlementId: 'x', name: 'The Hidden Hand', from: 'none', to: 'adversarial' }],
  },
};

function assertNoLeak(obj) {
  const json = stableStringify(obj);
  for (const s of SENSITIVE) expect(json, `leaked: ${s}`).not.toContain(s);
  return json;
}

describe('pulseFingerprint — redaction canary', () => {
  it('extractPulseEffects leaks no names/prose/labels', () => {
    assertNoLeak(extractPulseEffects(result));
  });
  it('extractPulseSummary leaks nothing', () => {
    assertNoLeak(extractPulseSummary(result, 'one_month'));
  });
  it('extractStressorTransitions leaks nothing', () => {
    assertNoLeak(extractStressorTransitions(result));
  });
  it('extractProposalDecision / extractPartyImpact leak nothing', () => {
    assertNoLeak(extractProposalDecision(result.proposals[0], 'applied'));
    assertNoLeak(extractPartyImpact({ kind: 'resolve_stressor', targetKind: 'stressor', magnitude: 0.6, note: 'Lord Aldric Thorne did a thing' }, result));
  });
  it('extractSimulationRules leaks nothing even with prose in unexpected fields', () => {
    // SIMULATION_RULES_UPDATED is essential-class → mirrored to the third-party
    // provider, so its allowlist must be locked: a prose value smuggled into the
    // rules object or changedKeys must never survive.
    assertNoLeak(extractSimulationRules(
      { propagationMode: 'full', intensity: 'dramatic', stressorsEnabled: true, someProseField: 'Lord Aldric Thorne', note: 'Blackmire Hollow secrets' },
      ['intensity', 'Blackmire Hollow'],
    ));
  });
});

describe('pulseFingerprint — signal is captured', () => {
  it('summary tallies effect families and FIXES new_stressor_count', () => {
    const s = extractPulseSummary(result, 'one_month');
    expect(s.auto_applied_count).toBe(5);
    expect(s.new_stressor_count).toBe(1); // exactly one stressor_birth_* (old code returned 0)
    expect(s.effect_family_counts.stressor).toBe(2); // birth + spread
    expect(s.effect_family_counts.npc).toBe(1);
    expect(s.effect_family_counts.population).toBe(1);
    expect(s.resolved_stressor_count).toBe(1);
    expect(s.corruption_event_count).toBe(1);
    expect(s.faction_capture_transition_count).toBe(1);
    // proposal side comes from result.proposals (autoApplied never holds proposal-mode)
    expect(s.auto_vs_proposal).toEqual({ auto: 5, proposal: 1 });
  });

  it('per-effect rows carry genesis + bands, never raw ids beyond the join uuid', () => {
    const { rows } = extractPulseEffects(result);
    expect(rows).toHaveLength(5);
    const birth = rows.find(r => r.candidate_type === 'stressor_birth_famine');
    expect(birth).toMatchObject({
      effect_kind: 'birth', subject_kind: 'stressor', stressor_type: 'famine',
      genesis: 'world_pulse', apply_mode: 'proposal', was_proposal: true, severity_band: 'severe',
    });
    expect(birth.population_delta_band).toBe('neg_medium');
    // spread → regional propagation genesis; party-sourced → party genesis
    expect(rows.find(r => r.candidate_type === 'stressor_spread_plague').genesis).toBe('regional_propagation');
    expect(rows.find(r => r.candidate_type === 'relationship_shift').genesis).toBe('party');
    // no prose keys
    for (const r of rows) {
      expect(r).not.toHaveProperty('headline');
      expect(r).not.toHaveProperty('summary');
      expect(r).not.toHaveProperty('reasons');
    }
  });

  it('stressor transitions tally per type', () => {
    const t = extractStressorTransitions(result);
    expect(t.births_by_type).toEqual({ famine: 1 });
    expect(t.spreads_by_type).toEqual({ plague: 1 });
    expect(t.resolutions_by_type).toEqual({ siege: 1 });
    expect(t.auto_births).toBe(1);     // famine birth in autoApplied
    expect(t.proposal_births).toBe(1); // famine birth queued in result.proposals
  });

  it('proposal decision + party impact carry the decision + bands', () => {
    expect(extractProposalDecision(result.proposals[0], 'dismissed')).toMatchObject({
      resolution: 'dismissed', proposal_type: 'stressor_birth_famine', stressor_type: 'famine', severity_band: 'severe',
    });
    expect(extractPartyImpact({ kind: 'resolve_stressor', targetKind: 'stressor', magnitude: 0.6 }, result)).toMatchObject({
      action_kind: 'resolve_stressor', target_kind: 'stressor', magnitude_band: 'high', resulting_outcome_count: 5,
    });
  });

  it('signedBand boundaries', () => {
    expect(signedBand(0)).toBe('none');
    expect(signedBand(-120)).toBe('neg_medium');
    expect(signedBand(50)).toBe('pos_small');
    expect(signedBand(5000)).toBe('pos_huge');
  });

  it('simulation rules emit values + toggles', () => {
    const r = extractSimulationRules({ propagationMode: 'full', intensity: 'dramatic', migrationMode: 'distributed', stressorsEnabled: true, npcAgencyEnabled: false }, ['intensity']);
    expect(r.propagation_mode).toBe('full');
    expect(r.intensity).toBe('dramatic');
    expect(r.toggles.stressorsEnabled).toBe(true);
    expect(r.toggles.npcAgencyEnabled).toBe(false);
    expect(r.changed_keys).toEqual(['intensity']);
  });
});

describe('config signature — deterministic, seed-independent grouping key', () => {
  const base = {
    settType: 'town', culture: 'germanic', terrainType: 'swamp', tradeRouteAccess: 'river',
    monsterThreat: 'frontier', magicExists: true, magicLevel: 'low',
    priorityEconomy: 60, priorityMilitary: 40, priorityReligion: 30, priorityCriminal: 20, priorityMagic: 10,
    selectedStresses: ['famine'], _institutionToggles: { Blacksmiths: 'require' },
  };

  it('same config → same signature; differing only by seed → same signature', async () => {
    const a = await computeConfigSignature({ ...base, _seed: 'seed-A' });
    const b = await computeConfigSignature({ ...base, _seed: 'seed-B' });
    expect(a).toBe(b);
    expect(typeof a).toBe('string');
    expect(a.length).toBeGreaterThanOrEqual(8);
  });

  it('a different config dimension → a different signature', async () => {
    const a = await computeConfigSignature(base);
    const b = await computeConfigSignature({ ...base, culture: 'norse' });
    expect(a).not.toBe(b);
  });

  it('the signature carries no institution name (it is a hash)', async () => {
    const sig = await computeConfigSignature(base);
    expect(sig).not.toContain('Blacksmiths');
  });

  it('usedRandomSentinels flags moving-target configs', () => {
    expect(usedRandomSentinels({ settType: 'town', culture: 'germanic', nearbyResourcesRandom: false })).toBe(false);
    expect(usedRandomSentinels({ settType: 'random', nearbyResourcesRandom: false })).toBe(true);
    expect(usedRandomSentinels({ _randomizePriorities: true, nearbyResourcesRandom: false })).toBe(true);
  });
});

describe('extractStressorGenesis — per-type genesis at generation', () => {
  it('maps trace results to genesis enums', () => {
    const settlement = {
      simulationTrace: [
        { targetType: 'stressor', targetId: 'stressor.famine', result: 'applied', causes: [{ source: 'userConfig' }] },
        { targetType: 'stressor', targetId: 'stressor.plague', result: 'emergent', causes: [{ source: 'stressGenerator' }] },
        { targetType: 'stressor', targetId: 'stressor.siege', result: 'declined', causes: [{ source: 'stressGenerator' }] },
        { targetType: 'stressor', targetId: 'stressor.unrest', result: 'suppressed_by_institutions', causes: [{ source: 'stressConfirmPass' }] },
        { targetType: 'stressor', targetId: 'stressor.revolt', result: 'applied', causes: [{ source: 'event' }] },
        { targetType: 'institution', targetId: 'inst.whatever', result: 'applied', causes: [] }, // ignored
      ],
    };
    expect(extractStressorGenesis(settlement)).toEqual({
      famine: 'user_forced_pre_gen',
      plague: 'generation',
      siege: 'declined',
      unrest: 'suppressed',
      revolt: 'user_forced_post_gen',
    });
  });

  it('handles a settlement with no trace', () => {
    expect(extractStressorGenesis({})).toEqual({});
    expect(extractStressorGenesis(null)).toEqual({});
  });
});
