import { describe, expect, test } from 'vitest';

import { EVENT_REGISTRY, EVENT_TYPES, RERUN_KEYS_FOR_EVENT } from '../../src/domain/events/registry.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { promoteStressorsToConditions } from '../../src/domain/conditionPromotion.js';
import { buildStressorPickerItems, pulseTypeForStressorKey, GEN_TO_PULSE_TYPE } from '../../src/domain/stressorPicker.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { STRESSOR_CATALOG } from '../../src/domain/worldPulse/stressors.js';

function settlementFixture() {
  return {
    name: 'Oakmere',
    tier: 'town',
    institutions: [],
    npcs: [],
    activeConditions: [],
    powerStructure: {
      governingName: 'Town Council',
      publicLegitimacy: { score: 40, label: 'Contested', govMultiplier: 0.8, crimMultiplier: 1.15 },
      factions: [
        { faction: 'Town Council', power: 24, category: 'government', isGoverning: true },
        { faction: 'The Garrison', power: 30, category: 'military' },
        { faction: 'Merchant Guilds', power: 26, category: 'economy' },
      ],
      factionRelationships: [],
    },
  };
}

describe('event registry — coup wave', () => {
  test('APPLY_STRESSOR and CHANGE_RULING_POWER are first-class event types', () => {
    expect(EVENT_TYPES).toContain('APPLY_STRESSOR');
    expect(EVENT_TYPES).toContain('CHANGE_RULING_POWER');
    expect(RERUN_KEYS_FOR_EVENT.APPLY_STRESSOR).toBeTruthy();
    expect(RERUN_KEYS_FOR_EVENT.CHANGE_RULING_POWER).toBeTruthy();
    expect(EVENT_REGISTRY.APPLY_STRESSOR.requiresTarget).toBe(true);
    expect(EVENT_REGISTRY.CHANGE_RULING_POWER.requiresTarget).toBe(true);
  });

  test('stateDeltas shape by cause and stressor flavor', () => {
    const coup = EVENT_REGISTRY.CHANGE_RULING_POWER.stateDeltas({ payload: { cause: 'coup' } });
    expect(coup.volatility).toBeGreaterThan(0);
    expect(coup.resilience).toBeLessThan(0);
    const election = EVENT_REGISTRY.CHANGE_RULING_POWER.stateDeltas({ payload: { cause: 'election' } });
    expect(election.volatility).toBeLessThan(coup.volatility);

    const siege = EVENT_REGISTRY.APPLY_STRESSOR.stateDeltas({
      targetId: 'under_siege', payload: { stressorType: 'under_siege', severity: 0.8 },
    });
    expect(siege.externalThreat).toBeGreaterThan(0);
    const famine = EVENT_REGISTRY.APPLY_STRESSOR.stateDeltas({
      targetId: 'famine', payload: { stressorType: 'famine', severity: 0.8 },
    });
    expect(famine.resourcePressure).toBeGreaterThan(0);
    expect(famine.externalThreat).toBeUndefined();
  });
});

describe('mutateSettlement — APPLY_STRESSOR', () => {
  test('writes the stress entry and promotes the matching condition archetype', () => {
    const next = mutateSettlement({
      settlement: settlementFixture(),
      event: {
        id: 'ev1', type: 'APPLY_STRESSOR', targetId: 'famine',
        payload: { stressorType: 'famine', label: 'Famine', severity: 0.7 },
        cause: 'player_action',
      },
      now: '2026-06-10T00:00:00.000Z',
    });
    const entry = (next.stress || []).find(s => s.type === 'famine');
    expect(entry).toBeTruthy();
    expect(entry.severity).toBe(0.7);
    expect(entry.addedByEventId).toBe('ev1');
    expect((next.activeConditions || []).some(c => c.archetype === 'famine')).toBe(true);
  });

  test('the promoted condition carries AUTHORED provenance, not a generation stamp', () => {
    const next = mutateSettlement({
      settlement: settlementFixture(),
      event: {
        id: 'ev-prov', type: 'APPLY_STRESSOR', targetId: 'famine',
        payload: { stressorType: 'famine', label: 'Famine', severity: 0.7 },
        cause: 'player_action',
      },
      now: '2026-06-10T00:00:00.000Z',
    });
    const condition = (next.activeConditions || []).find(c => c.archetype === 'famine');
    // Before the fix this said GENERATION / 'Settlement generated under
    // stressor "Famine"' — the explanation surface lied to the DM about a
    // crisis they authored this session, and the event id was lost.
    expect(condition.triggeredAt.sourceEventType).toBe('APPLY_STRESSOR');
    expect(condition.causes).toEqual([
      { source: 'event', eventId: 'ev-prov', detail: 'Famine began.' },
    ]);
  });

  test('authoring a stressor the settlement was GENERATED under replaces the twin condition', () => {
    // A settlement generated mid-famine: generation stamps live on the entry
    // and the promoted condition.
    const generated = {
      ...settlementFixture(),
      stress: [{ type: 'famine', label: 'Famine', severity: 0.5 }],
    };
    const promoted = mutateSettlement({
      settlement: generated,
      event: {
        id: 'ev-twin', type: 'APPLY_STRESSOR', targetId: 'famine',
        payload: { stressorType: 'famine', label: 'Famine', severity: 0.8 },
        cause: 'player_action',
      },
      now: '2026-06-10T00:00:00.000Z',
    });
    const famines = (promoted.activeConditions || []).filter(c => c.archetype === 'famine');
    // ONE condition (no generation-stamped twin left behind to double-penalize
    // the substrate), owned by the authored event at the authored severity.
    expect(famines).toHaveLength(1);
    expect(famines[0].triggeredAt.sourceEventType).toBe('APPLY_STRESSOR');
    expect(famines[0].severity).toBeCloseTo(0.8, 5);
  });

  test('an unrelated authored stressor does NOT re-attribute existing crises', () => {
    // Generated mid-plague; the DM authors a famine. The plague condition must
    // keep its generation provenance — only the famine is the event's doing.
    const generated = promoteStressorsToConditions({
      ...settlementFixture(),
      stress: [{ type: 'plague_onset', name: 'Plague', severity: 0.6 }],
    });
    const next = mutateSettlement({
      settlement: generated,
      event: {
        id: 'ev-unrelated', type: 'APPLY_STRESSOR', targetId: 'famine',
        payload: { stressorType: 'famine', label: 'Famine', severity: 0.7 },
        cause: 'player_action',
      },
      now: '2026-06-10T00:00:00.000Z',
    });
    const plague = (next.activeConditions || []).find(c => c.archetype === 'plague');
    expect(plague.triggeredAt.sourceEventType).toBe('GENERATION');
    expect(plague.causes[0].source).toBe('generation');
    expect((next.activeConditions || []).find(c => c.archetype === 'famine').causes[0].eventId)
      .toBe('ev-unrelated');
  });

  test('two successive authored stressors never duplicate the first archetype', () => {
    // The first event promotes an APPLY_STRESSOR-stamped famine. Authoring a
    // SECOND, unrelated stressor must not re-run promotion over the whole
    // container with GENERATION defaults — that minted a generation-stamped
    // famine twin beside the authored one (different derived ids) and
    // double-penalized the same affectedSystems in the causal substrate.
    const afterFirst = mutateSettlement({
      settlement: settlementFixture(),
      event: {
        id: 'ev-first', type: 'APPLY_STRESSOR', targetId: 'famine',
        payload: { stressorType: 'famine', label: 'Famine', severity: 0.7 },
        cause: 'player_action',
      },
      now: '2026-06-10T00:00:00.000Z',
    });
    const afterSecond = mutateSettlement({
      settlement: afterFirst,
      event: {
        id: 'ev-second', type: 'APPLY_STRESSOR', targetId: 'under_siege',
        payload: { stressorType: 'under_siege', label: 'Under siege', severity: 0.6 },
        cause: 'player_action',
      },
      now: '2026-06-10T00:00:00.000Z',
    });
    const famines = (afterSecond.activeConditions || []).filter(c => c.archetype === 'famine');
    expect(famines).toHaveLength(1);
    expect(famines[0].triggeredAt.sourceEventType).toBe('APPLY_STRESSOR');
    expect(famines[0].causes[0].eventId).toBe('ev-first');
  });

  test('an authored stressor leaves unrelated evolved conditions untouched', () => {
    // A pulse-evolved plague (aged clock, escalated severity, accumulated
    // causes) must survive an unrelated authored onset byte-identical:
    // re-promotion previously replaced it by id with a fresh template partial
    // (elapsedTicks 0, original severity, single generation cause).
    const generated = promoteStressorsToConditions({
      ...settlementFixture(),
      stress: [{ type: 'plague_onset', name: 'Plague', severity: 0.6 }],
    });
    const evolved = {
      ...generated,
      activeConditions: (generated.activeConditions || []).map(c =>
        c.archetype === 'plague'
          ? {
              ...c, severity: 0.85, status: 'easing',
              duration: { ...(c.duration || {}), elapsedTicks: 7 },
              causes: [
                ...(c.causes || []),
                { source: 'world_pulse', detail: 'The outbreak spread along the river trade.' },
              ],
            }
          : c),
    };
    const plagueBefore = evolved.activeConditions.find(c => c.archetype === 'plague');
    const next = mutateSettlement({
      settlement: evolved,
      event: {
        id: 'ev-aside', type: 'APPLY_STRESSOR', targetId: 'famine',
        payload: { stressorType: 'famine', label: 'Famine', severity: 0.7 },
        cause: 'player_action',
      },
      now: '2026-06-10T00:00:00.000Z',
    });
    const plagueAfter = (next.activeConditions || []).find(c => c.archetype === 'plague');
    expect(plagueAfter).toEqual(plagueBefore);
  });

  test('a custom stressor sharing a display name never clobbers a typed entry', () => {
    // 'Dragon famine' authored with the label 'Famine' must land beside the
    // generation famine entry, not overwrite its type — a typed entry only
    // matches by type, so type-keyed consumers (pulse twin, picker) keep it.
    const generated = {
      ...settlementFixture(),
      stress: [{ type: 'famine', name: 'Famine', label: 'Famine', severity: 0.5 }],
    };
    const next = mutateSettlement({
      settlement: generated,
      event: {
        id: 'ev-custom-name', type: 'APPLY_STRESSOR', targetId: 'dragon_famine',
        payload: { stressorType: 'dragon_famine', label: 'Famine', severity: 0.9, isCustom: true },
        cause: 'player_action',
      },
      now: '2026-06-10T00:00:00.000Z',
    });
    const types = (next.stress || []).map(st => st.type);
    expect(types).toContain('famine');
    expect(types).toContain('dragon_famine');
    expect((next.stress || []).find(st => st.type === 'famine').severity).toBe(0.5);
  });

  // Pin reconciled (Wave 7 #2a): magical_instability was this test's example
  // of an UNMAPPED type — it now promotes to its own archetype (the deadzone/
  // instability family finally reaches the substrate's magical_stability), and
  // with it every world-pulse catalog type maps. The custom_crisis fallback
  // remains pinned below via an uncatalogued authored type.
  test('magical_instability promotes to its own archetype (formerly the custom_crisis example)', () => {
    const next = mutateSettlement({
      settlement: settlementFixture(),
      event: {
        id: 'ev2', type: 'APPLY_STRESSOR', targetId: 'magical_instability',
        payload: { stressorType: 'magical_instability', label: 'Magical instability', severity: 0.6 },
        cause: 'player_action',
      },
      now: '2026-06-10T00:00:00.000Z',
    });
    const condition = (next.activeConditions || []).find(c => c.archetype === 'magical_instability');
    expect(condition).toBeTruthy();
    expect(condition.affectedSystems).toEqual(
      expect.arrayContaining(['magical_stability', 'healing_capacity', 'public_legitimacy']),
    );
    expect((next.activeConditions || []).some(c => c.archetype === 'custom_crisis')).toBe(false);
  });

  test('unmapped uncatalogued types still fall back to a custom_crisis condition', () => {
    const next = mutateSettlement({
      settlement: settlementFixture(),
      event: {
        id: 'ev2b', type: 'APPLY_STRESSOR', targetId: 'shadow_curse',
        payload: { stressorType: 'shadow_curse', label: 'Shadow curse', severity: 0.6, isCustom: true },
        cause: 'player_action',
      },
      now: '2026-06-10T00:00:00.000Z',
    });
    const condition = (next.activeConditions || []).find(c => c.archetype === 'custom_crisis');
    expect(condition).toBeTruthy();
    // No world-pulse catalog entry to borrow systems from — the
    // custom_crisis defaults apply.
    expect(condition.affectedSystems).toEqual(['public_legitimacy', 'social_trust']);
    expect(condition.severity).toBe(0.6);
  });

  test('re-applying the same stressor does not stack entries', () => {
    const event = {
      id: 'ev3', type: 'APPLY_STRESSOR', targetId: 'famine',
      payload: { stressorType: 'famine', label: 'Famine', severity: 0.5 },
      cause: 'player_action',
    };
    const once = mutateSettlement({ settlement: settlementFixture(), event, now: '2026-06-10T00:00:00.000Z' });
    const twice = mutateSettlement({ settlement: once, event: { ...event, id: 'ev4' }, now: '2026-06-10T00:00:01.000Z' });
    expect((twice.stress || []).filter(s => s.type === 'famine')).toHaveLength(1);
  });

  test('re-authoring an existing stressor type UPSERTS severity (no stale local entry)', () => {
    // The roaming world-pulse twin (settlementSlice -> injectCampaignStressor)
    // upserts at the new severity; the local entry must agree, not keep the old
    // value behind the duplicate guard. Promotion then re-evaluates.
    const event = {
      id: 'ev-up1', type: 'APPLY_STRESSOR', targetId: 'famine',
      payload: { stressorType: 'famine', label: 'Famine', severity: 0.5 },
      cause: 'player_action',
    };
    const once = mutateSettlement({ settlement: settlementFixture(), event, now: '2026-06-10T00:00:00.000Z' });
    const twice = mutateSettlement({
      settlement: once,
      event: { ...event, id: 'ev-up2', payload: { ...event.payload, severity: 0.9 } },
      now: '2026-06-10T00:00:01.000Z',
    });
    const entries = (twice.stress || []).filter(s => s.type === 'famine');
    expect(entries).toHaveLength(1);
    expect(entries[0].severity).toBe(0.9);
    expect(entries[0].addedByEventId).toBe('ev-up2');
    // The promoted condition tracks the re-authored severity too.
    const condition = (twice.activeConditions || []).find(c => c.archetype === 'famine');
    expect(condition.severity).toBeCloseTo(0.9, 5);
    expect(condition.causes[0].eventId).toBe('ev-up2');
  });
});

describe('mutateSettlement — CHANGE_RULING_POWER', () => {
  test('reshapes the seat and stamps the government_overthrown condition', () => {
    const next = mutateSettlement({
      settlement: settlementFixture(),
      event: {
        id: 'ev5', type: 'CHANGE_RULING_POWER', targetId: 'The Garrison',
        payload: { cause: 'coup' }, cause: 'player_action',
      },
      now: '2026-06-10T00:00:00.000Z',
    });
    expect(next.powerStructure.governingName).toBe('Military Council');
    expect(next.powerStructure.government).toBe('Military Council');
    expect(next.powerStructure.previousGovernments).toHaveLength(1);
    expect((next.activeConditions || []).some(c => c.archetype === 'government_overthrown')).toBe(true);
  });

  test('an unknown faction is a safe no-op on the settlement', () => {
    const before = settlementFixture();
    const next = mutateSettlement({
      settlement: before,
      event: {
        id: 'ev6', type: 'CHANGE_RULING_POWER', targetId: 'No Such Power',
        payload: { cause: 'coup' }, cause: 'player_action',
      },
      now: '2026-06-10T00:00:00.000Z',
    });
    expect(next.powerStructure.governingName).toBe('Town Council');
    expect((next.activeConditions || []).length).toBe(0);
  });
});

describe('stressorPicker — the unified vocabulary', () => {
  test('the union covers generation types, campaign-only types, and custom', () => {
    const items = buildStressorPickerItems([], [
      { id: 'c1', name: 'Dragon Tax', description: 'The dragon wants its tithe.' },
    ]);
    const keys = new Set(items.map(i => i.key));
    // Every generation type is pickable.
    for (const key of Object.keys(STRESS_TYPE_MAP)) expect(keys.has(key)).toBe(true);
    // The previously-unpickable campaign types are now in the list.
    for (const type of ['rebellion', 'market_shock', 'criminal_corridor', 'magical_instability', 'coup_detat']) {
      expect(keys.has(type)).toBe(true);
    }
    // Aliased pairs never double up: under_siege is in, raw 'siege' is not.
    expect(keys.has('siege')).toBe(false);
    // Custom stressors ride along.
    expect(items.some(i => i.name === 'Dragon Tax' && i.isCustom)).toBe(true);
  });

  test('alias map covers every generation type and resolves to real catalog types', () => {
    for (const [genKey, pulseType] of Object.entries(GEN_TO_PULSE_TYPE)) {
      expect(STRESS_TYPE_MAP[genKey]).toBeTruthy();
      expect(STRESSOR_CATALOG[pulseType]).toBeTruthy();
      expect(pulseTypeForStressorKey(genKey)).toBe(pulseType);
    }
    expect(pulseTypeForStressorKey('coup_detat')).toBe('coup_detat');
    expect(pulseTypeForStressorKey('totally_custom')).toBeNull();
  });

  test('existing stresses are filtered out of the picker', () => {
    const items = buildStressorPickerItems([{ type: 'famine' }], []);
    expect(items.some(i => i.key === 'famine')).toBe(false);
  });

  test('tolerates the legacy bare-object stress container (single stressor, un-wrapped)', () => {
    // stressGenerator returns ONE entry un-wrapped, and both call sites pass
    // the raw container — before normalizing through canonStressors this
    // threw (.map on a non-array).
    const items = buildStressorPickerItems({ type: 'famine', label: 'Famine' }, []);
    expect(items.some(i => i.key === 'famine')).toBe(false);
    expect(items.some(i => i.key === 'under_siege')).toBe(true);
  });
});
