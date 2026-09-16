/**
 * tests/domain/humanizeEngineTokens.test.js — the presentation-boundary humanizer.
 *
 * Two properties matter: (1) the calendar phrase agrees with the engine's
 * seasonForTick derivation (the display-local copy cannot drift — the
 * chronicleReadModel pin idiom), and (2) flag/schema tokens come out as plain
 * house-voice words with no camelCase or snake_case residue.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  DISPLAY_LEXICON,
  displayLabel,
  humanizeFlagKey,
  humanizeIfToken,
  humanizeToken,
  tickCalendarDetailLabel,
  settlementSizeLabel,
  tickCalendarLabel,
  tickDurationLabel,
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

describe('tickDurationLabel — HOW LONG, which the calendar label cannot say', () => {
  it('reads as a span in the reader own unit, exactly', () => {
    expect(tickDurationLabel(1)).toBe('one week');
    expect(tickDurationLabel(2)).toBe('2 weeks');
    expect(tickDurationLabel(13)).toBe('13 weeks');
    expect(tickDurationLabel(0)).toBe('less than a week');
  });

  it('is total on garbage', () => {
    expect(tickDurationLabel(NaN)).toBe('less than a week');
    expect(tickDurationLabel(-4)).toBe('less than a week');
    expect(tickDurationLabel(/** @type {any} */ (undefined))).toBe('less than a week');
    expect(tickDurationLabel(2.7)).toBe('2 weeks');
  });

  it('never emits a bare tick token', () => {
    for (const t of [0, 1, 2, 13, 52, 400]) {
      expect(/\btick/i.test(tickDurationLabel(t)), `tick leaked at ${t}`).toBe(false);
    }
  });

  // ⛔ THE DISCRIMINATION THAT MAKES THIS A SECOND EXPORT RATHER THAN A REUSE.
  // The compile's named STOP: routing a DURATION through the calendar translator
  // yields "Roughly the spring of year 1 ticks from marching." The two answer
  // different questions and must never collapse into one another, so the pin
  // asserts they DISAGREE on the same input rather than merely that each works.
  it('is not interchangeable with the calendar label at any span in a year', () => {
    for (let t = 0; t <= 52; t++) {
      expect(tickDurationLabel(t), `duration and calendar collided at ${t}`)
        .not.toBe(tickCalendarLabel(t));
    }
    expect(`Roughly ${tickDurationLabel(6)} from marching.`).toBe('Roughly 6 weeks from marching.');
    expect(`Roughly ${tickCalendarLabel(6)} from marching.`).toBe('Roughly the spring of year 1 from marching.');
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

describe('the authored display lexicon — typed buckets, closed and enumerable', () => {
  /**
   * ⭐⭐ THE tradeRouteAccess BUCKET IS PINNED AGAINST ITS PRODUCER'S SOURCE, not
   * against a copy of itself. A hand-listed table is exactly the shape that rots
   * the day the generator gains a sixth route: the label would silently fall
   * through to the humanizer and nobody would learn the bucket had a hole. So
   * this arm reads `resolveConfig.js` and requires the two sets to be EQUAL —
   * a new route reds here, and a label for a route nobody produces reds too.
   */
  it('covers EVERY trade-route token the generator can actually produce', () => {
    const source = readFileSync('src/generators/steps/resolveConfig.js', 'utf8');
    const pools = source.slice(
      source.indexOf('const TERRAIN_ROUTE_POOLS'),
      source.indexOf('export const CULTURES'),
    );
    const produced = new Set();
    // The terrain table plus every inline fallback pool: any array literal on a
    // line that names a pool is a place a route token can be born.
    for (const block of [pools, ...source.split('\n').filter((l) => /pool/i.test(l))]) {
      for (const [, token] of block.matchAll(/'([a-z_]+)'/g)) produced.add(token);
    }
    // ANTI-VACUITY: a scan that stopped matching would report an empty set, and
    // "every member of {} is covered" is true of any table at all.
    expect(produced.size).toBeGreaterThanOrEqual(5);
    expect([...produced].sort()).toEqual(
      Object.keys(DISPLAY_LEXICON.tradeRouteAccess).sort(),
    );
  });

  it('says what the token means where the token alone would mislead', () => {
    // The one that earns the lexicon outright: nothing in the word `isolated`
    // tells a reader it is a statement about TRADE.
    expect(displayLabel('tradeRouteAccess', 'isolated')).toBe('No trade route');
    expect(displayLabel('tradeRouteAccess', 'crossroads')).toBe('Trade crossroads');
    expect(displayLabel('supplyChainStatus', 'entrepot')).toBe('Transhipment hub');
  });

  it('carries the five legacy chain statuses the generator records producing', () => {
    // settlement.schema.js: "today's generator produces chain entries with shape
    // { …, status: 'operational' | 'running' | 'entrepot' | 'vulnerable' | 'impaired' }".
    expect(Object.keys(DISPLAY_LEXICON.supplyChainStatus).sort())
      .toEqual(['entrepot', 'impaired', 'operational', 'running', 'vulnerable']);
  });

  it('falls through for an unknown token instead of leaking or vanishing', () => {
    expect(displayLabel('tradeRouteAccess', 'canal_barge')).toBe('Canal barge');
    expect(displayLabel('noSuchBucket', 'river')).toBe('River');
    expect(displayLabel('tradeRouteAccess', null, 'Unknown')).toBe('Unknown');
    expect(displayLabel('tradeRouteAccess', '   ')).toBe('');
  });

  it('is FROZEN data, never a branch to extend', () => {
    expect(Object.isFrozen(DISPLAY_LEXICON)).toBe(true);
    for (const bucket of Object.values(DISPLAY_LEXICON)) expect(Object.isFrozen(bucket)).toBe(true);
  });
});

describe('humanizeIfToken — the slot that carries prose OR a token', () => {
  it('humanizes a token and leaves an authored headline alone', () => {
    expect(humanizeIfToken('succession_coup')).toBe('succession coup');
    expect(humanizeIfToken('goalProgress')).toBe('goal progress');
    // ⭐ THE REGRESSION THIS EXPORT EXISTS TO PREVENT: the plain humanizer
    // lowercases, and chronicleFeed fills the same slot from raw.title.
    expect(humanizeIfToken('The Siege of Redwater')).toBe('The Siege of Redwater');
    expect(humanizeToken('The Siege of Redwater')).toBe('the siege of redwater');
  });

  it('leaves a lone plain word untouched — it is already a word', () => {
    expect(humanizeIfToken('Famine')).toBe('Famine');
    expect(humanizeIfToken('war')).toBe('war');
  });

  it('is total on garbage and honours the fallback', () => {
    expect(humanizeIfToken(null, 'Event')).toBe('Event');
    expect(humanizeIfToken('   ', 'Event')).toBe('Event');
    expect(humanizeIfToken(undefined)).toBe('');
  });
});
