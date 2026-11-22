/**
 * tests/domain/economyFreshness.test.js — Wave R-3 Lane C pins for the
 * post-applyEvent economy stale-window declaration (atlas economy-family
 * gap 2).
 *
 * Pins:
 *   • DETECTOR SEMANTICS — economyShiftSinceSurvey walks the
 *     reconciliationLog newest-first: economy-touching event entries since
 *     the last 'regenerate' boundary flag the shift; a boundary newer than
 *     every event clears it; draft and canon sources both count; malformed
 *     entries and absent trails are quiet.
 *   • CLASSIFIER COMPLETENESS — eventTypeShiftsEconomy answers from the
 *     registry's own RERUN_KEYS_FOR_EVENT declaration for EVERY registered
 *     event type (no hand-kept type list that could drift), and every
 *     registered event type HAS a rerun row (the registry header's own
 *     rule: "every event needs (2) a rerun-affected map entry").
 *   • RE-EXPORT PARITY — the Wave R-3 extraction of RERUN_KEYS_FOR_EVENT
 *     into registryRerunKeys.js left registryFull's export the SAME object,
 *     so every pre-extraction consumer sees identical data.
 */
import { describe, expect, test } from 'vitest';
import {
  economyShiftSinceSurvey,
  eventTypeShiftsEconomy,
} from '../../src/domain/display/economyFreshness.js';
import { RERUN_KEYS_FOR_EVENT } from '../../src/domain/events/registryRerunKeys.js';
import {
  RERUN_KEYS_FOR_EVENT as RERUN_KEYS_VIA_FULL,
  EVENT_TYPES,
} from '../../src/domain/events/registryFull.js';

const ECONOMY_KEYS = ['services', 'activeChains', 'economicState'];

function entry(source, changeType) {
  return { at: null, source, changeType, changeLabel: null, preservedWorldConditionIds: [] };
}

describe('economyShiftSinceSurvey — detector semantics', () => {
  test('no settlement / no trail / empty trail → not shifted', () => {
    expect(economyShiftSinceSurvey(null)).toEqual({ shifted: false, eventCount: 0 });
    expect(economyShiftSinceSurvey({})).toEqual({ shifted: false, eventCount: 0 });
    expect(economyShiftSinceSurvey({ reconciliationLog: [] })).toEqual({ shifted: false, eventCount: 0 });
  });

  test('a canon economy event since generation → shifted', () => {
    const s = { reconciliationLog: [entry('canon_event', 'ADD_INSTITUTION')] };
    expect(economyShiftSinceSurvey(s)).toEqual({ shifted: true, eventCount: 1 });
  });

  test('a DRAFT economy event counts the same as canon', () => {
    const s = { reconciliationLog: [entry('draft_event', 'REMOVE_INSTITUTION')] };
    expect(economyShiftSinceSurvey(s)).toEqual({ shifted: true, eventCount: 1 });
  });

  test('a regenerate boundary NEWER than the events clears the shift', () => {
    const s = {
      reconciliationLog: [
        entry('canon_event', 'ADD_INSTITUTION'),
        entry('canon_event', 'DEPLETE_RESOURCE'),
        entry('regenerate', 'GENERATE_SETTLEMENT'),
      ],
    };
    expect(economyShiftSinceSurvey(s)).toEqual({ shifted: false, eventCount: 0 });
  });

  test('an economy event AFTER the last regenerate boundary re-flags the shift', () => {
    const s = {
      reconciliationLog: [
        entry('canon_event', 'ADD_INSTITUTION'),
        entry('regenerate', 'GENERATE_SETTLEMENT'),
        entry('canon_event', 'CUT_TRADE_ROUTE'),
      ],
    };
    expect(economyShiftSinceSurvey(s)).toEqual({ shifted: true, eventCount: 1 });
  });

  test('non-economy events do not flag the shift', () => {
    const s = {
      reconciliationLog: [
        entry('canon_event', 'BROKERED_ALLIANCE'),
        entry('canon_event', 'SET_PRIMARY_DEITY'),
        entry('draft_event', 'ADD_NPC'),
      ],
    };
    expect(economyShiftSinceSurvey(s)).toEqual({ shifted: false, eventCount: 0 });
  });

  test('mixed trail counts only the economy-touching events', () => {
    const s = {
      reconciliationLog: [
        entry('canon_event', 'ADD_NPC'),
        entry('canon_event', 'SHIFT_TIER'),
        entry('canon_event', 'REFUGEE_WAVE'),
      ],
    };
    expect(economyShiftSinceSurvey(s)).toEqual({ shifted: true, eventCount: 2 });
  });

  test('malformed entries (missing source/changeType, non-object) are quiet', () => {
    const s = {
      reconciliationLog: [
        null,
        {},
        entry(undefined, 'ADD_INSTITUTION'),
        entry('canon_event', undefined),
        entry('canon_event', 'NOT_A_REAL_TYPE'),
      ],
    };
    expect(economyShiftSinceSurvey(s)).toEqual({ shifted: false, eventCount: 0 });
  });
});

describe('eventTypeShiftsEconomy — classifier completeness', () => {
  test('answers from the declared rerun keys for EVERY registered type', () => {
    for (const type of Object.keys(RERUN_KEYS_FOR_EVENT)) {
      const declared = RERUN_KEYS_FOR_EVENT[type].some(k => ECONOMY_KEYS.includes(k));
      expect(eventTypeShiftsEconomy(type), `classifier disagrees with the declaration for ${type}`).toBe(declared);
    }
  });

  test('canonical members and non-members', () => {
    expect(eventTypeShiftsEconomy('ADD_INSTITUTION')).toBe(true);
    expect(eventTypeShiftsEconomy('DEPLETE_RESOURCE')).toBe(true);
    expect(eventTypeShiftsEconomy('SHIFT_TIER')).toBe(true);
    expect(eventTypeShiftsEconomy('BROKERED_ALLIANCE')).toBe(false);
    expect(eventTypeShiftsEconomy('SET_PRIMARY_DEITY')).toBe(false);
    expect(eventTypeShiftsEconomy('UNKNOWN_TYPE')).toBe(false);
    expect(eventTypeShiftsEconomy(null)).toBe(false);
  });

  test('every registered event type has a rerun-keys row (registry header rule)', () => {
    const missing = EVENT_TYPES.filter(t => !Array.isArray(RERUN_KEYS_FOR_EVENT[t]));
    expect(missing, 'event types with no RERUN_KEYS_FOR_EVENT row').toEqual([]);
  });
});

describe('RERUN_KEYS_FOR_EVENT — extraction re-export parity', () => {
  test('registryFull re-exports the SAME table object', () => {
    expect(RERUN_KEYS_VIA_FULL).toBe(RERUN_KEYS_FOR_EVENT);
  });

  test('the table is non-vacuous', () => {
    expect(Object.keys(RERUN_KEYS_FOR_EVENT).length).toBeGreaterThanOrEqual(40);
  });
});
