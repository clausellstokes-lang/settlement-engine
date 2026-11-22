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
   *
   * ⛔ IT READS THE DECLARATION, NEVER A SECOND UNRELATED MARKER (CURE-E).
   * The first cut sliced from `const TERRAIN_ROUTE_POOLS` to `export const
   * CULTURES`. EM-P3 (f4e5b64c5) hoisted the CULTURES re-export ABOVE the table
   * for reasons that had nothing to do with routes; the two markers INVERTED
   * (1061/1632 → 1646/1601) and `String.prototype.slice(start > end)` returned
   * '' SILENTLY — no throw, no -1, no signal at all. The pin went half-blind,
   * 5 tokens to 3, losing exactly `port` and `river` (the two that live only
   * inside the table), and stayed that way across five landings. A scan that
   * cannot find its target must RED, never return an empty string. So:
   *   · the table is brace-matched from its OWN declaration, which cannot be
   *     reordered away from itself;
   *   · every anchor is asserted FOUND, and a two-anchor span is asserted
   *     ORDERED, BEFORE any slice is taken;
   *   · the scan parses ARRAY LITERALS rather than filtering lines — a line
   *     that merely names a pool is not where a token is born, and the old
   *     line filter both missed the else-branch pools (their literals sit on
   *     continuation lines that do not say "pool") and scooped tokens out of
   *     comparisons that mint nothing.
   */
  it('covers EVERY trade-route token the generator can actually produce', () => {
    const source = readFileSync('src/generators/steps/resolveConfig.js', 'utf8');

    /**
     * Brace-match an object literal from its OWN declaration (the estate's
     * `objectLiteralKeys` idiom). Asserts the declaration is found and that a
     * literal opens after it, so an absent target reds instead of scanning ''.
     */
    const declarationBody = (src, decl) => {
      const at = src.indexOf(decl);
      expect(at, `resolveConfig.js no longer declares \`${decl}\``).toBeGreaterThanOrEqual(0);
      const open = src.indexOf('{', at);
      expect(open, `\`${decl}\` is no longer followed by an object literal`).toBeGreaterThan(at);
      let depth = 0;
      for (let i = open; i < src.length; i++) {
        if (src[i] === '{') depth++;
        else if (src[i] === '}' && --depth === 0) return src.slice(open, i + 1);
      }
      throw new Error(`unbalanced object literal for \`${decl}\``);
    };

    /** A span between two anchors, both asserted FOUND and asserted ORDERED. */
    const spanBetween = (src, startAnchor, endAnchor) => {
      const from = src.indexOf(startAnchor);
      const to = src.indexOf(endAnchor);
      expect(from, `resolveConfig.js no longer contains \`${startAnchor}\``).toBeGreaterThanOrEqual(0);
      expect(to, `resolveConfig.js no longer contains \`${endAnchor}\``).toBeGreaterThanOrEqual(0);
      // ⛔ THE ASSERTION THE FIRST CUT LACKED. Without it an inverted span is ''.
      expect(from, `\`${startAnchor}\` no longer precedes \`${endAnchor}\``).toBeLessThan(to);
      return src.slice(from, to);
    };

    // The terrain table, read from its own declaration, PLUS the route-production
    // block, which carries the inline fallbacks and the two else-branch pools that
    // no terrain key reaches.
    const table = declarationBody(source, 'const TERRAIN_ROUTE_POOLS');
    const production = spanBetween(source, 'let routePool = null;', 'const rawRoute = routePool');

    // PARSED, NOT LINE-FILTERED. A route token is born in an ARRAY LITERAL. The
    // innermost-bracket match therefore reads `['road', …]` and skips the index
    // `[resolvedTerrain]`; `pool.filter(r => r !== 'isolated')` and
    // `tradeRoute === 'isolated'` carry no literal and contribute nothing.
    const produced = new Set();
    for (const block of [table, production]) {
      for (const literal of block.matchAll(/\[[^[\]]*\]/g)) {
        for (const [, token] of literal[0].matchAll(/'([a-z_]+)'/g)) produced.add(token);
      }
    }

    // ANTI-VACUITY, ANCHORED ON NAMED MEMBERS and not on a bare count: a scan that
    // stopped matching would report an empty set, and "every member of {} is
    // covered" is true of any table at all. `port` and `river` are named because
    // they are reachable ONLY through the terrain table — they are precisely what
    // a silently-empty table span loses.
    expect(produced.size).toBeGreaterThanOrEqual(5);
    expect([...produced], 'the terrain table stopped contributing').toContain('port');
    expect([...produced], 'the terrain table stopped contributing').toContain('river');

    // EXACT, BOTH DIRECTIONS (the vocabularyTotality.walker spelling), so each
    // direction can say which way the table rotted.
    const setDiff = (a, b) => a.filter((x) => !b.includes(x)).sort();
    const producers = [...produced].sort();
    const consumers = Object.keys(DISPLAY_LEXICON.tradeRouteAccess).sort();
    expect(
      setDiff(producers, consumers),
      'the generator can roll a trade route with NO lexicon row — it would reach a reader as '
      + 'a raw engine token. Author its label in DISPLAY_LEXICON.tradeRouteAccess rather than '
      + 'widening this scan.',
    ).toEqual([]);
    expect(
      setDiff(consumers, producers),
      'a lexicon row has no producer left — delete it in the same commit that removes its pool '
      + 'entry, so the table cannot rot into a list of words nothing can say.',
    ).toEqual([]);
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
