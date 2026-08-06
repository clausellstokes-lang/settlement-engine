/**
 * phraseRepetitionEnvelope.walker.test.js — SP-E. THE ENVELOPE'S OWN PROOF.
 *
 * The instrument (src/domain/certification/phraseRepetitionEnvelope.js) grades what a town was
 * TOLD over a season, not what the corpus HOLDS. Everything below drives it with the estate's
 * REAL narration kit — the envoy registry's authored pools through `envoyReceipt`, the actual
 * picker the engine uses — because an envelope proven only against synthetic strings proves a
 * property of the test's string generator.
 *
 * ── THE COLLAPSE MUTANT IS THE POINT ────────────────────────────────────────────
 *
 * An envelope that has never been shown to FAIL is not a guardrail. The mutant is executed:
 * the same three towns, the same thirteen weeks, the same instrument — but the pool collapsed
 * to a single variant. It must breach, and the compliant run beside it must not.
 *
 * ── THE MEASURED SEPARATION (2026-08-06, driven from the live registry) ─────────
 *
 *   depth 12 (routine) at weekly cadence  -> worst repeat share 0.3846
 *   depth  6 (notable) at weekly cadence  -> worst repeat share 0.5385
 *   depth  5 (major)   at weekly cadence  -> worst repeat share 0.6154
 *   COLLAPSED to one variant              -> worst repeat share 0.9231
 *
 * The ceiling of 0.75 sits between the worst compliant case and the collapse with real margin
 * on BOTH sides (0.135 below, 0.173 above), so it is neither a bound the estate grazes nor one
 * a collapse could slip under. Every one of those figures is re-measured below rather than
 * quoted — a comment cannot rot into fiction if the number beside it is asserted.
 *
 * That descending sequence is also the frequency-scaled floor law's own justification, executed
 * rather than argued: at one fixed cadence, the shallower the pool, the more a season repeats.
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  PHRASE_REPETITION_CEILING,
  POWERED_WINDOW_MINIMUM,
  SEASON_WINDOW_WEEKS,
  phraseRepetitionReport,
  phraseRepetitionViolations,
  phraseRepetitionWindows,
} from '../../src/domain/certification/phraseRepetitionEnvelope.js';
import { ENVOY_KIND_REGISTRY, envoyReceipt } from '../../src/domain/worldPulse/eventProse.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const INTERP = Object.freeze({
  settlement: 'Ashford',
  counterpart: 'Irontown',
  npc: 'Reeve Mara',
  route: 'North Road',
  third_party: 'Westmere',
  term: 'road concession',
  reason: 'the sealed terms',
});

const TOWNS = Object.freeze(['ashford', 'irontown', 'westmere']);

/** The registry row for a kind, so depth and significance are read live rather than typed. */
function rowFor(kind) {
  const row = ENVOY_KIND_REGISTRY.find((candidate) => candidate.kind === kind);
  if (!row) throw new Error(`${kind}: no registry row — re-anchor this walker`);
  return row;
}

/**
 * One season of weekly beats of `kind` for every town, rendered through the REAL picker.
 * Seeds are derived from town and week, so the stream is deterministic and re-runnable.
 */
function seasonStream(kind, weeks = SEASON_WINDOW_WEEKS) {
  const out = [];
  for (const town of TOWNS) {
    for (let week = 0; week < weeks; week += 1) {
      const receipt = envoyReceipt(kind, `${town}:${kind}:${week}`, INTERP);
      if (receipt) out.push({ settlementId: town, tick: week, line: receipt.line });
    }
  }
  return out;
}

/** The same season, but the pool COLLAPSED to its first variant — the mutant. */
function collapsedStream(kind, weeks = SEASON_WINDOW_WEEKS) {
  const [only] = rowFor(kind).pool;
  const line = typeof only === 'function' ? String(only(INTERP)) : String(only);
  const out = [];
  for (const town of TOWNS) {
    for (let week = 0; week < weeks; week += 1) out.push({ settlementId: town, tick: week, line });
  }
  return out;
}

describe('SP-E phrase-repetition envelope — anti-vacuity anchors', () => {
  test('the real narration kit drives the instrument', () => {
    // Every claim below is worthless if the picker stopped returning lines or the registry
    // emptied — a stream of zero receipts measures nothing and reports no violation.
    const stream = seasonStream('envoy_on_the_road');
    expect(stream).toHaveLength(TOWNS.length * SEASON_WINDOW_WEEKS);
    for (const beat of stream) expect(beat.line.length).toBeGreaterThan(10);
    expect(rowFor('envoy_on_the_road').pool.length).toBe(12);
  });

  test('the season window MIRRORS the calendar\'s own quarter', () => {
    // The calendar's constant is module-private, so the instrument declares its own and this
    // scan keeps the two equal. A calendar change must re-band the instrument DELIBERATELY,
    // with a signature, rather than silently following.
    const worldState = readFileSync(join(ROOT, 'src/domain/worldPulse/worldState.js'), 'utf8');
    const matches = [...worldState.matchAll(/^const WEEKS_PER_SEASON = (\d+);/gm)];
    expect(matches, 'WEEKS_PER_SEASON moved in worldState.js — re-anchor this pin').toHaveLength(1);
    expect(Number(matches[0][1])).toBe(SEASON_WINDOW_WEEKS);
  });

  test('the ceiling lies strictly inside the interval it grades', () => {
    expect(PHRASE_REPETITION_CEILING).toBeGreaterThan(0);
    expect(PHRASE_REPETITION_CEILING).toBeLessThan(1);
    expect(POWERED_WINDOW_MINIMUM).toBe(4);
  });
});

describe('SP-E phrase-repetition envelope — the compliant estate', () => {
  test('a CHRONIC pool at weekly cadence sits well inside the envelope', () => {
    const report = phraseRepetitionReport(seasonStream('envoy_on_the_road'));
    expect(report.poweredWindows).toBe(TOWNS.length);
    expect(report.unpoweredWindows).toBe(0);
    expect(report.carriesEvidence).toBe(true);
    expect(report.withinEnvelope).toBe(true);
    expect(report.violations).toEqual([]);
    // The MEASURED value, not merely "under the ceiling": a re-tuning that moved the picker
    // reds here rather than silently eating the margin.
    expect(report.worstRepeatShare).toBeCloseTo(0.3846, 4);
  });

  test('the worst compliant case keeps REAL margin below the ceiling', () => {
    // A rare kind fired at chronic cadence is the hardest legitimate case in the estate — five
    // voices asked to fill thirteen weeks. It must still pass, and by a margin the ceiling can
    // be seen to have, so the bound is not a coin flip that has yet to come up tails.
    const report = phraseRepetitionReport(seasonStream('envoy_home'));
    expect(rowFor('envoy_home').significance).toBe('major');
    expect(report.worstRepeatShare).toBeCloseTo(0.6154, 4);
    expect(report.withinEnvelope).toBe(true);
    expect(PHRASE_REPETITION_CEILING - report.worstRepeatShare).toBeGreaterThan(0.1);
  });

  test('at ONE cadence, a shallower pool repeats more — the floor law, executed', () => {
    // Not an argument for the frequency-scaled floor: a measurement of it. Three kinds, one
    // cadence, depth descending, repeat share ascending, monotone.
    const measured = ['envoy_on_the_road', 'envoy_departed', 'envoy_home'].map((kind) => ({
      kind,
      depth: rowFor(kind).pool.length,
      worst: phraseRepetitionReport(seasonStream(kind)).worstRepeatShare,
    }));
    expect(measured.map((m) => m.depth)).toEqual([12, 6, 5]);
    expect(measured[0].worst).toBeLessThan(measured[1].worst);
    expect(measured[1].worst).toBeLessThan(measured[2].worst);
    expect(measured.map((m) => Number(m.worst.toFixed(4)))).toEqual([0.3846, 0.5385, 0.6154]);
  });
});

describe('SP-E phrase-repetition envelope — THE COLLAPSE MUTANT, executed', () => {
  test('a ONE-VARIANT pool breaches the envelope in every window', () => {
    const report = phraseRepetitionReport(collapsedStream('envoy_on_the_road'));
    expect(report.carriesEvidence).toBe(true);
    expect(report.withinEnvelope).toBe(false);
    expect(report.violations).toHaveLength(TOWNS.length);
    expect(report.worstRepeatShare).toBeCloseTo(0.9231, 4);
    expect(report.violations.map((v) => v.settlementId).sort()).toEqual([...TOWNS]);
    for (const violation of report.violations) {
      expect(violation.distinct).toBe(1);
      expect(violation.sampled).toBe(SEASON_WINDOW_WEEKS);
    }
    // anchored: the SAME kind, the SAME towns and the SAME thirteen weeks are asserted to pass
    // through the identical instrument two describes above, so this failure is the collapsed
    // pool and not an envelope that reds on everything.
    expect(phraseRepetitionReport(seasonStream('envoy_on_the_road')).withinEnvelope).toBe(true);
  });

  test('the collapse clears the ceiling by a margin, not by a hair', () => {
    const report = phraseRepetitionReport(collapsedStream('envoy_on_the_road'));
    expect(report.worstRepeatShare - PHRASE_REPETITION_CEILING).toBeGreaterThan(0.15);
  });

  test('a HALF-collapse — two voices where twelve were authored — also breaches', () => {
    // The constitution's two-variant sentence, measured on the display side this time: a pool
    // cut to two is not "nearly fine", it reads as a loop within one season.
    const [first, second] = rowFor('envoy_on_the_road').pool;
    const render = (variant) => (typeof variant === 'function' ? String(variant(INTERP)) : String(variant));
    const lines = [render(first), render(second)];
    const stream = [];
    for (const town of TOWNS) {
      for (let week = 0; week < SEASON_WINDOW_WEEKS; week += 1) {
        stream.push({ settlementId: town, tick: week, line: lines[week % 2] });
      }
    }
    const report = phraseRepetitionReport(stream);
    expect(report.withinEnvelope).toBe(false);
    expect(report.violations).toHaveLength(TOWNS.length);
  });
});

describe('SP-E phrase-repetition envelope — an instrument that cannot fail is not one', () => {
  test('too thin a season carries NO EVIDENCE, and that is not a pass', () => {
    const report = phraseRepetitionReport([
      { settlementId: 'ashford', tick: 0, line: 'a first word' },
      { settlementId: 'ashford', tick: 1, line: 'a second word' },
    ]);
    expect(report.carriesEvidence).toBe(false);
    // THE ARM THAT MATTERS: an unpowered report is NOT within the envelope. Reporting a soak
    // that produced two lines as a variety pass is the vacuous green this pin exists to refuse.
    expect(report.withinEnvelope).toBe(false);
    expect(report.worstRepeatShare).toBeNull();
    expect(report.unpoweredWindows).toBe(1);
    expect(report.poweredWindows).toBe(0);
  });

  test('an unpowered window is never counted as a VIOLATION either', () => {
    // ⚠ THE POWER FILTER IS UNREACHABLE AT THE DEFAULT CEILING, AND THIS PIN IS WRITTEN AROUND
    // THAT. An unpowered window holds at most three lines, so its repeat share cannot exceed
    // (3-1)/3 = 0.667 — below the 0.75 ceiling. Grading such a window against the DEFAULT
    // therefore proves nothing: the first draft of this test did exactly that, and a mutant
    // that DELETED `row.powered &&` from the violation predicate ran green through all sixteen
    // arms. The clause is real for any tighter ceiling, and the ceiling is an owner-signed
    // tunable, so the guard is pinned at a ceiling where it can actually fire.
    const windows = phraseRepetitionWindows([
      { settlementId: 'ashford', tick: 0, line: 'same' },
      { settlementId: 'ashford', tick: 1, line: 'same' },
      { settlementId: 'ashford', tick: 2, line: 'same' },
    ]);
    expect(windows).toHaveLength(1);
    expect(windows[0]).toMatchObject({ sampled: 3, distinct: 1, powered: false });
    expect(windows[0].repeatShare).toBeCloseTo(2 / 3, 6);
    // The reachable arm: at a ceiling of 0.5 this window's 0.667 IS above the bound, and only
    // the power filter keeps it out of the violation list.
    expect(windows[0].repeatShare).toBeGreaterThan(0.5);
    expect(phraseRepetitionViolations(windows, 0.5)).toEqual([]);
    // anchored: a POWERED window at the same 0.5 ceiling and the same all-identical lines DOES
    // red (below), so the emptiness here is the power filter and nothing else.
    const poweredAtHalf = phraseRepetitionWindows(
      [0, 1, 2, 3, 4].map((tick) => ({ settlementId: 'irontown', tick, line: 'same' })),
    );
    expect(phraseRepetitionViolations(poweredAtHalf, 0.5)).toHaveLength(1);
    // …and the default-ceiling arm, kept because it is the configuration the soak runs.
    expect(phraseRepetitionViolations(windows)).toEqual([]);
    // anchored: the same all-identical lines at FIVE samples DO red, so the emptiness above is
    // the power filter and not a violation predicate that never fires.
    const powered = phraseRepetitionWindows(
      [0, 1, 2, 3, 4].map((tick) => ({ settlementId: 'ashford', tick, line: 'same' })),
    );
    expect(powered[0]).toMatchObject({ sampled: 5, distinct: 1, powered: true });
    expect(phraseRepetitionViolations(powered)).toHaveLength(1);
  });

  test('the ceiling is INCLUSIVE: a window ON the bound is inside it', () => {
    // Found by this walker's own first run, and kept as a pin rather than quietly fixed. Four
    // identical lines measure a repeat share of exactly 0.75 — the ceiling itself — and pass.
    // The boundary is where an envelope is most likely to be read two different ways by two
    // later waves, so it is stated once here in values.
    const onTheBound = phraseRepetitionWindows(
      [0, 1, 2, 3].map((tick) => ({ settlementId: 'ashford', tick, line: 'same' })),
    );
    expect(onTheBound[0].repeatShare).toBe(PHRASE_REPETITION_CEILING);
    expect(onTheBound[0].powered).toBe(true);
    expect(phraseRepetitionViolations(onTheBound)).toEqual([]);
    // anchored: one hair above the same bound DOES red, so the pass above is the inclusive
    // boundary and not a predicate that ignores its ceiling.
    expect(phraseRepetitionViolations(onTheBound, PHRASE_REPETITION_CEILING - 0.01)).toHaveLength(1);
  });

  test('the instrument REFUSES a ceiling or a window that could never fail', () => {
    const stream = seasonStream('envoy_on_the_road');
    expect(() => phraseRepetitionReport(stream, { ceiling: 1 })).toThrow(/strictly inside/);
    expect(() => phraseRepetitionReport(stream, { ceiling: 0 })).toThrow(/strictly inside/);
    expect(() => phraseRepetitionWindows(stream, { windowWeeks: 0 })).toThrow(/positive integer/);
    expect(() => phraseRepetitionWindows(stream, { windowWeeks: 6.5 })).toThrow(/positive integer/);
  });
});

describe('SP-E phrase-repetition envelope — the read is deterministic and total', () => {
  test('receipt ORDER cannot change the measurement', () => {
    // A certification read that depended on arrival order would produce a different verdict
    // from the same soak run twice.
    const stream = seasonStream('envoy_on_the_road');
    const reversed = [...stream].reverse();
    const shuffled = [...stream].sort((a, b) => a.line.localeCompare(b.line));
    expect(phraseRepetitionWindows(reversed)).toEqual(phraseRepetitionWindows(stream));
    expect(phraseRepetitionWindows(shuffled)).toEqual(phraseRepetitionWindows(stream));
  });

  test('the season boundary FALLS where the calendar puts it', () => {
    // Week 12 and week 13 belong to different seasons; a stream that straddles the boundary
    // must produce two windows, not one. An off-by-one here would let a year of repeats hide
    // inside a single oversized bucket.
    const windows = phraseRepetitionWindows([
      { settlementId: 'ashford', tick: SEASON_WINDOW_WEEKS - 1, line: 'a' },
      { settlementId: 'ashford', tick: SEASON_WINDOW_WEEKS, line: 'b' },
    ]);
    expect(windows.map((w) => w.window)).toEqual([0, 1]);
  });

  test('malformed receipts are DROPPED, never filed under an invented season', () => {
    const windows = phraseRepetitionWindows([
      { settlementId: 'ashford', tick: 0, line: 'a real line' },
      { settlementId: 'ashford', tick: 1, line: 'another real line' },
      { settlementId: 'ashford', tick: Number.NaN, line: 'no tick' },
      { settlementId: null, tick: 2, line: 'no town' },
      { settlementId: 'ashford', tick: 3, line: '   ' },
      null,
      'not a receipt',
    ]);
    expect(windows).toHaveLength(1);
    expect(windows[0].sampled).toBe(2);
  });
});
