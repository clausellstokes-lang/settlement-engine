/**
 * tests/domain/humanizeEngineTokens.test.js — the presentation-boundary humanizer.
 *
 * Two properties matter: (1) the calendar phrase agrees with the engine's
 * seasonForTick derivation (the display-local copy cannot drift — the
 * chronicleReadModel pin idiom), and (2) flag/schema tokens come out as plain
 * house-voice words with no camelCase or snake_case residue.
 */
import { describe, expect, it } from 'vitest';
import {
  humanizeFlagKey,
  humanizeToken,
  tickCalendarDetailLabel,
  settlementSizeLabel,
  tickCalendarLabel,
} from '../../src/domain/display/humanizeEngineTokens.js';
import { seasonForTick } from '../../src/domain/worldPulse/worldState.js';
import { DEFAULT_SIMULATION_RULES, SIMULATION_RULE_PRESETS } from '../../src/domain/worldPulse/simulationRules.js';

describe('tickCalendarLabel — the calendar phrase', () => {
  it('agrees with the engine seasonForTick across eight years of weeks', () => {
    for (let tick = 0; tick <= 52 * 8; tick++) {
      const eng = seasonForTick(tick);
      expect(tickCalendarLabel(tick)).toBe(`the ${eng.season} of year ${eng.year}`);
    }
  });
  it('is total on garbage', () => {
    expect(tickCalendarLabel(NaN)).toBe('the spring of year 1');
    expect(tickCalendarLabel(-3)).toBe('the spring of year 1');
    expect(tickCalendarLabel(/** @type {any} */ (undefined))).toBe('the spring of year 1');
  });
  it('never emits a bare tick token', () => {
    for (const t of [0, 1, 13, 51, 52, 400]) {
      expect(/\btick\b/i.test(tickCalendarLabel(t))).toBe(false);
    }
  });
});

describe('tickCalendarDetailLabel — Chronicle-scale calendar precision', () => {
  it('distinguishes adjacent weeks without exposing the engine counter', () => {
    expect(tickCalendarDetailLabel(5)).toBe('week 6 of spring, year 1');
    expect(tickCalendarDetailLabel(7)).toBe('week 8 of spring, year 1');
    expect(tickCalendarDetailLabel(13)).toBe('week 1 of summer, year 1');
    expect(tickCalendarDetailLabel(52)).toBe('week 1 of spring, year 2');
    expect(tickCalendarDetailLabel(5)).not.toMatch(/\btick\b/i);
  });
});

describe('humanizeToken — schema tokens to words', () => {
  it('spaces snake_case, kebab-case, and camelCase, lowercased', () => {
    expect(humanizeToken('succession_coup')).toBe('succession coup');
    expect(humanizeToken('war-declared')).toBe('war declared');
    expect(humanizeToken('goalProgress')).toBe('goal progress');
    expect(humanizeToken('npc_goal_culmination')).toBe('npc goal culmination');
  });
  it('is total on garbage', () => {
    expect(humanizeToken(null)).toBe('');
    expect(humanizeToken(42)).toBe('42');
  });
});

describe('settlementSizeLabel — one reader-facing size vocabulary', () => {
  it('resolves canonical, legacy, and imported multiword size tokens', () => {
    expect(settlementSizeLabel('town')).toBe('Town');
    expect(settlementSizeLabel('capital')).toBe('Metropolis');
    expect(settlementSizeLabel('large_town')).toBe('Large town');
    expect(settlementSizeLabel('river-port')).toBe('River port');
  });

  it('uses the explicit fallback only when the stored value is absent', () => {
    expect(settlementSizeLabel(null, 'Unknown size')).toBe('Unknown size');
  });
});

describe('humanizeFlagKey — flag keys to layer names', () => {
  it('reads as prose for the known flags', () => {
    expect(humanizeFlagKey('warLayerEnabled')).toBe('the war layer');
    expect(humanizeFlagKey('faithSpreadEnabled')).toBe('the faith spread');
    expect(humanizeFlagKey('traditionsEnabled')).toBe('the traditions');
  });
  it('leaves no camelCase residue for ANY flag the rules can carry (defaults + presets)', () => {
    const keys = new Set(
      Object.keys(DEFAULT_SIMULATION_RULES).filter(
        (k) => typeof (/** @type {Record<string, unknown>} */ (DEFAULT_SIMULATION_RULES)[k]) === 'boolean',
      ),
    );
    for (const preset of Object.values(SIMULATION_RULE_PRESETS)) {
      for (const [k, v] of Object.entries(preset.rules)) if (typeof v === 'boolean') keys.add(k);
    }
    expect(keys.size).toBeGreaterThanOrEqual(25); // the detector set did not silently collapse
    for (const k of keys) {
      const out = humanizeFlagKey(k);
      expect(out.startsWith('the '), `${k} → "${out}"`).toBe(true);
      expect(/[A-Z_]/.test(out), `${k} → "${out}" carries engine casing`).toBe(false);
    }
  });
});
