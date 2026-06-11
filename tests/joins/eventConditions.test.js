/**
 * Join harness — config.eventConditions: the conditions EVENTS promote
 * survive regeneration.
 *
 * The seam: mutate handlers promote durable effects into
 * settlement.activeConditions (cutTradeRoute → trade_route_cut, plague →
 * plague, refugeeWave → regional_migration_pressure, removedThreat →
 * siege_lifted, applyStressor → famine/custom_crisis/…). But
 * activeConditions is a derivation OUTPUT: a what-if regeneration
 * (applyChange) rebuilds the pipeline input from the raw _config and
 * replaces the settlement wholesale, and assembleSettlement re-promotes
 * only stressor-derived conditions — so every event-promoted condition
 * silently vanished on the first applyChange. config.eventConditions is the
 * authored record that closes the loop (the customTradeGoods / resourceEdits
 * architecture):
 *
 *   - mutateSettlement projects the live EVENT-sourced conditions
 *     (causes[].source === 'event') into config.eventConditions and mirrors
 *     the record into _config (withEventConditionsSynced — one chokepoint
 *     covers every handler, onsets and the RESOLVE_STRESSOR wind-down);
 *   - the aging helpers keep the record following the live conditions, so
 *     elapsed ticks survive a regeneration and an EXPIRED crisis does not
 *     resurrect;
 *   - assembleSettlement re-promotes the record after its stressor
 *     promotion (reapplyEventConditions), dropping the GENERATION-stamped
 *     same-archetype twin the re-rolled stressors mint — the
 *     authored-beats-generation rule promoteStressorsToConditions already
 *     applies for authored onsets.
 *
 * Generation/world-pulse/regional conditions are deliberately NOT recorded:
 * generation re-derives its own, and world/regional conditions belong to the
 * campaign layer (worldPulse/reconcile.js preserveWorldConditions).
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import {
  withTickedConditionDurations,
  withExpiredConditionsRemoved,
} from '../../src/domain/activeConditions.js';
import { reconcileSettlementChange } from '../../src/domain/settlementReconciliation.js';
import { applyPartyImpact } from '../../src/domain/worldPulse/index.js';
import {
  stripDerivedConfigKeys,
  DERIVED_CONFIG_KEYS,
} from '../../src/store/settlementSlice.js';

const NOW = '2026-06-11T00:00:00.000Z';

const gen = (config, seed) =>
  generateSettlementPipeline(config, null, { seed, customContent: {} });

const BASE_CFG = {
  settType: 'town',
  culture: 'germanic',
  tradeRouteAccess: 'road',
  monsterThreat: 'frontier',
};

// Probed shape for this seed: BASE_CFG rolls NO stressors and NO
// activeConditions — every condition in these round trips is event-authored.
const SEED = 'ec-rt-1';

/** Exactly how settlementSlice.applyChange rebuilds the next run's input. */
const buildNextConfig = (settlement) => ({
  ...(settlement?._config
    || stripDerivedConfigKeys(settlement?.config)
    || {}),
});

const ev = (type, overrides = {}) => ({
  id: `ev_${type.toLowerCase()}`,
  type,
  targetId: '',
  payload: {},
  cause: 'player_action',
  ...overrides,
});

function deepFreeze(o) {
  if (o && typeof o === 'object') {
    Object.freeze(o);
    for (const k of Object.keys(o)) deepFreeze(o[k]);
  }
  return o;
}

const mutate = (settlement, event) =>
  mutateSettlement({ settlement: deepFreeze(settlement), event, now: NOW });

const condOf = (s, archetype) =>
  (s.activeConditions || []).filter(c => c.archetype === archetype);

describe('join: CUT_TRADE_ROUTE survives a full regeneration (the reported bug)', () => {
  test('cut → regenerate → the condition is still there, with event provenance', () => {
    const s1 = gen(BASE_CFG, SEED);
    expect(s1.activeConditions).toEqual([]);

    const cut = mutate(s1, ev('CUT_TRADE_ROUTE', { id: 'ev-cut', targetId: 'River road south' }));
    const live = condOf(cut, 'trade_route_cut');
    expect(live).toHaveLength(1);
    // The authored record lands in BOTH config formats (the dual-write
    // discipline — applyChange regenerates from the raw _config first).
    expect(cut.config.eventConditions).toEqual(live);
    expect(cut._config.eventConditions).toEqual(live);

    // Full regeneration, exactly as applyChange rebuilds its input.
    const s2 = gen(buildNextConfig(cut), SEED);
    const carried = condOf(s2, 'trade_route_cut');
    expect(carried).toHaveLength(1);
    expect(carried[0].causes.some(c => c.source === 'event' && c.eventId === 'ev-cut')).toBe(true);
    // The record survives into the next generation's raw config — chained
    // what-ifs keep working.
    expect(s2._config.eventConditions).toEqual(carried);
    const s3 = gen(buildNextConfig(s2), SEED);
    expect(condOf(s3, 'trade_route_cut')).toHaveLength(1);
  });

  test('two severed routes are two conditions, and both survive', () => {
    const s1 = gen(BASE_CFG, SEED);
    const cutA = mutate(s1, ev('CUT_TRADE_ROUTE', { id: 'ev-cut-a', targetId: 'River road south' }));
    const cutB = mutate(cutA, ev('CUT_TRADE_ROUTE', { id: 'ev-cut-b', targetId: 'Mountain pass east' }));
    expect(condOf(cutB, 'trade_route_cut')).toHaveLength(2);

    const s2 = gen(buildNextConfig(cutB), SEED);
    const carried = condOf(s2, 'trade_route_cut');
    expect(carried).toHaveLength(2);
    expect(new Set(carried.map(c => c.id)).size).toBe(2);
  });
});

describe('join: PLAGUE survives with its authored severity', () => {
  test('plague → regenerate → same severity, same event cause', () => {
    const s1 = gen(BASE_CFG, SEED);
    const sick = mutate(s1, ev('PLAGUE', {
      id: 'ev-plague', targetId: 'Red sweat', payload: { severity: 0.8 },
    }));
    expect(condOf(sick, 'plague')).toHaveLength(1);

    const s2 = gen(buildNextConfig(sick), SEED);
    const plague = condOf(s2, 'plague');
    expect(plague).toHaveLength(1);
    expect(plague[0].severity).toBe(0.8);
    expect(plague[0].causes.some(c => c.source === 'event' && c.eventId === 'ev-plague')).toBe(true);
  });
});

describe('join: the authored condition owns its archetype across regeneration (dedupe)', () => {
  const FAMINE_CFG = {
    ...BASE_CFG,
    selectedStressesRandom: false,
    selectedStresses: ['famine'],
  };
  // Probed: this seed + forced famine generates exactly ONE famine condition,
  // GENERATION-stamped, severity 0.65.
  const FAMINE_SEED = 'ec-famine-1';

  test('APPLY_STRESSOR famine beats the regenerated GENERATION twin — one condition, event-stamped', () => {
    const s1 = gen(FAMINE_CFG, FAMINE_SEED);
    expect(condOf(s1, 'famine')).toHaveLength(1);
    expect(condOf(s1, 'famine')[0].triggeredAt.sourceEventType).toBe('GENERATION');

    const authored = mutate(s1, ev('APPLY_STRESSOR', {
      id: 'ev-onset', targetId: 'famine',
      payload: { stressorType: 'famine', label: 'Famine', severity: 0.9 },
    }));
    expect(condOf(authored, 'famine')).toHaveLength(1);
    expect(condOf(authored, 'famine')[0].severity).toBe(0.9);

    // The regeneration re-rolls the forced famine stressor, which re-promotes
    // a GENERATION famine — the record entry must REPLACE it (different
    // derived id, so replace-by-id alone would leave both standing and
    // double-penalize the same affectedSystems).
    const s2 = gen(buildNextConfig(authored), FAMINE_SEED);
    const famines = condOf(s2, 'famine');
    expect(famines).toHaveLength(1);
    expect(famines[0].triggeredAt.sourceEventType).toBe('APPLY_STRESSOR');
    expect(famines[0].severity).toBe(0.9);
  });

  test('RESOLVE_STRESSOR on the GENERATION-rolled famine — the resolution survives regeneration', () => {
    const s1 = gen(FAMINE_CFG, FAMINE_SEED);
    expect(condOf(s1, 'famine')[0].triggeredAt.sourceEventType).toBe('GENERATION');

    // Pipeline settlements carry the single stressor as a bare OBJECT
    // (stress + stressors) — resolving it must clear that shape too, not
    // leave a raging stressor beside an easing condition.
    const resolved = mutate(s1, ev('RESOLVE_STRESSOR', { id: 'ev-end', targetId: 'famine' }));
    expect(resolved.stressors).toBeNull();
    expect(resolved.stress).toBeNull();
    expect(condOf(resolved, 'famine')[0].status).toBe('easing');
    // The record's only GENERATION-stamped entry: a wound-down generated crisis.
    expect(resolved.config.eventConditions).toHaveLength(1);
    expect(resolved.config.eventConditions[0].triggeredAt.sourceEventType).toBe('GENERATION');

    // The regen re-mints the forced famine stressor, but the resolve's
    // config.stressorEdits suppression (stressorEdits.test.js) keeps it out
    // of the container, so no GENERATION twin is promoted at all — the eased
    // record re-applies alone. Pin the outcome either way: one famine, still
    // easing, never a fresh worsening crisis.
    const s2 = gen(buildNextConfig(resolved), FAMINE_SEED);
    const famines = condOf(s2, 'famine');
    expect(famines).toHaveLength(1);
    expect(famines[0].status).toBe('easing');
    expect(famines[0].duration.expiresAtTicks)
      .toBeLessThanOrEqual(famines[0].duration.elapsedTicks + 2);
    expect(famines[0].causes.some(c => c.source === 'event' && c.eventId === 'ev-end')).toBe(true);
  });
});

describe('join: PLAGUE beside a GENERATION plague twin — regeneration is a fixpoint', () => {
  const PLAGUE_CFG = {
    ...BASE_CFG,
    selectedStressesRandom: false,
    selectedStresses: ['plague_onset'],
  };
  // Probed: this seed + forced plague_onset generates exactly ONE plague
  // condition, GENERATION-stamped.
  const PLAGUE_SEED = 'p1';

  test('the authored outbreak owns the archetype at EVENT time, so pre- and post-regen agree', () => {
    const s1 = gen(PLAGUE_CFG, PLAGUE_SEED);
    const generated = condOf(s1, 'plague');
    expect(generated).toHaveLength(1);
    expect(generated[0].triggeredAt.sourceEventType).toBe('GENERATION');

    // Without the event-time twin drop, the live settlement carried TWO
    // plague conditions (double-penalizing the substrate) that a no-edit
    // regeneration silently collapsed to one.
    const sick = mutate(s1, ev('PLAGUE', { id: 'ev-plague', targetId: 'Red sweat', payload: { severity: 0.8 } }));
    const live = condOf(sick, 'plague');
    expect(live).toHaveLength(1);
    expect(live[0].triggeredAt.sourceEventType).toBe('PLAGUE');
    expect(live[0].severity).toBe(0.8);

    const s2 = gen(buildNextConfig(sick), PLAGUE_SEED);
    const carried = condOf(s2, 'plague');
    expect(carried).toHaveLength(1);
    expect(carried[0].triggeredAt.sourceEventType).toBe('PLAGUE');
    expect(carried[0].severity).toBe(0.8);
  });
});

describe('join: RESOLVE_STRESSOR wind-down round trips', () => {
  const onsetEv = ev('APPLY_STRESSOR', {
    id: 'ev-dragon', targetId: 'dragon_tax',
    payload: { stressorType: 'dragon_tax', label: 'Dragon Tax', severity: 0.6, isCustom: true },
  });

  test('resolve BEFORE the regeneration → the eased state survives, not a fresh crisis', () => {
    const s1 = gen(BASE_CFG, SEED);
    const onset = mutate(s1, onsetEv);
    const resolved = mutate(onset, ev('RESOLVE_STRESSOR', { id: 'ev-dragon-end', targetId: 'dragon_tax' }));
    expect(condOf(resolved, 'custom_crisis')[0].status).toBe('easing');

    const s2 = gen(buildNextConfig(resolved), SEED);
    const carried = condOf(s2, 'custom_crisis');
    expect(carried).toHaveLength(1);
    expect(carried[0].status).toBe('easing');
    // The wind-down's near-term trail-off survived too — never an extension.
    expect(carried[0].duration.expiresAtTicks)
      .toBeLessThanOrEqual(carried[0].duration.elapsedTicks + 2);
    expect(carried[0].causes.some(c => c.eventId === 'ev-dragon-end')).toBe(true);
  });

  test('resolve AFTER the regeneration → the carried condition is still resolvable', () => {
    // The authored stress ENTRY now survives the regen too (the
    // config.stressorEdits overlay — stressorEdits.test.js), so this resolve
    // finds a live entry; resolveStressor's no-entry bridge remains for
    // legacy saves regenerated before the stressorEdits record existed.
    const s1 = gen(BASE_CFG, SEED);
    const s2 = gen(buildNextConfig(mutate(s1, onsetEv)), SEED);
    expect(condOf(s2, 'custom_crisis')).toHaveLength(1);

    const resolved = mutate(s2, ev('RESOLVE_STRESSOR', { id: 'ev-late-end', targetId: 'dragon_tax' }));
    const eased = condOf(resolved, 'custom_crisis')[0];
    expect(eased.status).toBe('easing');
    expect(eased.causes.some(c => c.eventId === 'ev-late-end')).toBe(true);
    // …and the record follows the wind-down, so the NEXT regeneration carries
    // the eased state.
    const s3 = gen(buildNextConfig(resolved), SEED);
    expect(condOf(s3, 'custom_crisis')[0].status).toBe('easing');
  });
});

describe('join: the record follows the aging lifecycle', () => {
  test('elapsed ticks survive a regeneration — a half-run plague does not restart', () => {
    const s1 = gen(BASE_CFG, SEED);
    const sick = mutate(s1, ev('PLAGUE', { id: 'ev-plague', targetId: 'Red sweat', payload: { severity: 0.8 } }));
    const aged = withTickedConditionDurations(sick, 'one_year'); // 6 of 12 ticks
    expect(aged.config.eventConditions[0].duration.elapsedTicks).toBe(6);

    const s2 = gen(buildNextConfig(aged), SEED);
    expect(condOf(s2, 'plague')[0].duration.elapsedTicks).toBe(6);
    // The drifted severity rides the same projection (0.8 worsening +
    // 0.04/tick × 6, clamped at the ceiling).
    expect(condOf(s2, 'plague')[0].severity).toBe(1);
  });

  test('an EXPIRED condition is cleared from the record and does NOT resurrect', () => {
    const s1 = gen(BASE_CFG, SEED);
    const sick = mutate(s1, ev('PLAGUE', { id: 'ev-plague', targetId: 'Red sweat', payload: { severity: 0.8 } }));
    let aged = withTickedConditionDurations(sick, 'one_year');
    aged = withTickedConditionDurations(aged, 'one_year'); // 12 of 12 ticks

    const { settlement: cleared, expired } = withExpiredConditionsRemoved(aged);
    expect(expired).toHaveLength(1);
    expect(cleared.config.eventConditions).toEqual([]);
    expect(cleared._config.eventConditions).toEqual([]);

    const s2 = gen(buildNextConfig(cleared), SEED);
    expect(condOf(s2, 'plague')).toEqual([]);
  });
});

describe('join: only EVENT-sourced conditions enter the record', () => {
  test('a regional/world condition rides the live array but stays out of the record', () => {
    const s1 = gen(BASE_CFG, SEED);
    const regional = {
      id: 'condition.regional_route_disruption.abc123',
      archetype: 'regional_route_disruption',
      severity: 0.5,
      triggeredAt: { tick: 3, sourceEventType: 'route_cut', sourceEventTargetId: 'channel.x' },
      duration: { elapsedTicks: 0, expiresAtTicks: 7 },
      causes: [{ source: 'channel.x', detail: 'Regional disruption.' }],
    };
    const withRegional = { ...s1, activeConditions: [regional] };

    const cut = mutate(withRegional, ev('CUT_TRADE_ROUTE', { id: 'ev-cut', targetId: 'River road south' }));
    expect(cut.activeConditions).toHaveLength(2);
    expect(cut.config.eventConditions).toHaveLength(1);
    expect(cut.config.eventConditions[0].archetype).toBe('trade_route_cut');
  });

  test('RESOLVE_STRESSOR never winds down a campaign-owned condition', () => {
    const s1 = gen(BASE_CFG, SEED);
    // A regional channel condition whose archetype collides with a stressor
    // rule ('smuggling ring' → regional_criminal_pressure). Its ORIGIN cause
    // is the channel — the campaign layer owns it, and a local resolve must
    // not stamp an event cause onto it (which would recruit it into the
    // record and resurrect it after the campaign layer resolves it).
    const regional = {
      id: 'condition.regional_criminal_pressure.chan99',
      archetype: 'regional_criminal_pressure',
      severity: 0.45,
      status: 'worsening',
      triggeredAt: { tick: 3, sourceEventType: 'regional_wave', sourceEventTargetId: 'channel.x' },
      duration: { elapsedTicks: 0, expiresAtTicks: 6 },
      causes: [{ source: 'channel.x', detail: 'A criminal corridor is transmitting opportunism.' }],
    };
    const withRegional = { ...s1, activeConditions: [regional] };

    const next = mutate(withRegional, ev('RESOLVE_STRESSOR', { id: 'ev-nope', targetId: 'smuggling ring' }));
    expect(next.activeConditions).toEqual([regional]);
    expect('eventConditions' in next.config).toBe(false);
  });
});

describe('join: the applyEvent reconcile step never claims event conditions', () => {
  test('REFUGEE_WAVE wind-down is not clobbered back by preserveWorldConditions', () => {
    // REFUGEE_WAVE promotes a regional_* archetype WITH event provenance —
    // isWorldAuthoredCondition must not claim it by archetype prefix, or the
    // reconcile that follows every applyEvent replaces the eased copy with
    // the stale prior one and the next event's sync reverts the record.
    const s1 = gen(BASE_CFG, SEED);
    const wave = mutate(s1, ev('REFUGEE_WAVE', { id: 'ev-wave', targetId: 'the_burned_coast', payload: { size: 'large' } }));
    const reconciledWave = reconcileSettlementChange(wave, s1, {});
    expect(condOf(reconciledWave, 'regional_migration_pressure')).toHaveLength(1);

    const resolved = mutate(reconciledWave, ev('RESOLVE_STRESSOR', { id: 'ev-wave-end', targetId: 'mass_migration' }));
    expect(condOf(resolved, 'regional_migration_pressure')[0].status).toBe('easing');

    const reconciled = reconcileSettlementChange(resolved, reconciledWave, {});
    expect(condOf(reconciled, 'regional_migration_pressure')[0].status).toBe('easing');

    // …and the NEXT event's record sync stays honest instead of reverting.
    const later = mutate(reconciled, ev('ADD_NPC', { id: 'ev-npc', targetId: 'Someone New' }));
    expect(later.config.eventConditions[0].status).toBe('easing');
  });
});

describe('join: a party-impact clear also clears the record', () => {
  test('clear_condition → no resurrection on the next regeneration', () => {
    const s1 = gen(BASE_CFG, SEED);
    const sick = mutate(s1, ev('PLAGUE', { id: 'ev-plague', targetId: 'Red sweat', payload: { severity: 0.8 } }));
    expect(sick.config.eventConditions).toHaveLength(1);

    const result = applyPartyImpact({
      campaign: {
        id: 'camp-ec',
        settlementIds: ['a'],
        worldState: { rngSeed: 'ec-party', tick: 1, stressors: [] },
        wizardNews: { currentTick: 1, entries: [] },
      },
      saves: [{ id: 'a', name: sick.name, phase: 'canon', settlement: sick }],
      action: { kind: 'clear_condition', settlementId: 'a', condition: 'plague', label: 'The party cured the plague' },
      now: NOW,
    });
    const cured = result.settlementUpdates.find(u => String(u.saveId) === 'a').settlement;
    expect(condOf(cured, 'plague')).toEqual([]);
    expect(cured.config.eventConditions).toEqual([]);
    expect(cured._config.eventConditions).toEqual([]);

    const s2 = gen(buildNextConfig(cured), SEED);
    expect(condOf(s2, 'plague')).toEqual([]);
  });
});

describe('join: chokepoint hygiene — backfill and identity', () => {
  test('a LEGACY settlement (live event conditions, no record key) is backfilled by any event', () => {
    const s1 = gen(BASE_CFG, SEED);
    const sick = mutate(s1, ev('PLAGUE', { id: 'ev-plague', targetId: 'Red sweat', payload: { severity: 0.8 } }));
    // Simulate a pre-feature save: the conditions exist, the record does not.
    const { eventConditions: _a, ...cfg } = sick.config;
    const { eventConditions: _b, ...raw } = sick._config;
    const legacy = { ...sick, config: cfg, _config: raw };

    const touched = mutate(legacy, ev('ADD_NPC', { id: 'ev-npc', targetId: 'Someone New' }));
    expect(touched.config.eventConditions).toHaveLength(1);
    expect(touched._config.eventConditions).toHaveLength(1);
    expect(condOf(gen(buildNextConfig(touched), SEED), 'plague')).toHaveLength(1);
  });

  test('an in-sync record is identity-stable: an unrelated event leaves config REFERENCE-identical', () => {
    const s1 = gen(BASE_CFG, SEED);
    const sick = mutate(s1, ev('PLAGUE', { id: 'ev-plague', targetId: 'Red sweat', payload: { severity: 0.8 } }));
    const later = mutate(sick, ev('ADD_NPC', { id: 'ev-npc', targetId: 'Someone New' }));
    expect(later.config).toBe(sick.config);
    expect(later._config).toBe(sick._config);
  });

  test('an event on a plain settlement never grows the key', () => {
    const s1 = gen(BASE_CFG, SEED);
    const next = mutate(s1, ev('ADD_NPC', { id: 'ev-npc', targetId: 'Someone New' }));
    expect('eventConditions' in next.config).toBe(false);
    expect('eventConditions' in next._config).toBe(false);
  });
});

describe('join: the record consumes no rng and the slice strip never eats the key', () => {
  test('a config with EMPTY eventConditions generates byte-identically to one without', () => {
    const plain = gen(BASE_CFG, SEED);
    const withEmpty = gen({ ...BASE_CFG, eventConditions: [] }, SEED);

    // The only permitted difference is the eventConditions key itself riding
    // through config/_config — everything derived must be byte-identical.
    const scrub = (s) => {
      const clone = JSON.parse(JSON.stringify(s));
      delete clone.config.eventConditions;
      delete clone._config.eventConditions;
      return clone;
    };
    expect(scrub(withEmpty)).toEqual(scrub(plain));
  });

  test('stripDerivedConfigKeys preserves eventConditions (it is user input, not derived)', () => {
    expect(DERIVED_CONFIG_KEYS).not.toContain('eventConditions');
    const stripped = stripDerivedConfigKeys({
      stressType: 'plague',
      eventConditions: [{ archetype: 'trade_route_cut' }],
    });
    expect(stripped.stressType).toBeUndefined();
    expect(stripped.eventConditions).toEqual([{ archetype: 'trade_route_cut' }]);
  });
});
