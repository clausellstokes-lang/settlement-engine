/**
 * outboundImpression.test.js — SP-B's second-order heuristic, where its bodies are
 * readable.
 *
 * The claim under test is narrow on purpose: what a court can honestly infer about a
 * rival's picture of it is EXACTLY what it has shown that rival, and nothing else. So the
 * battery is mostly about what the reader REFUSES — an unaimed act, an act about someone
 * else, an empty outbound record — because a heuristic that guesses is worse than none:
 * it would read as knowledge on a receipt.
 *
 * The zero-import contract (the structural half of the Law One recursion ban) is pinned
 * in tests/property/believedWorldAxesDormancyFence.test.js beside the flag census, where
 * the source blanker already lives.
 */
import { describe, expect, test } from 'vitest';

import { outboundImpressionOf, OUTBOUND_CHANNELS } from '../../src/domain/worldPulse/outboundImpression.js';

const plant = (audienceId, subjectId, assertedBand, seededTick) => ({ audienceId, subjectId, assertedBand, seededTick });
const transfer = (toId, subjectId, strengthBand, tick, fidelity01 = 1) => ({ toId, subjectId, strengthBand, fidelity01, tick });
const share = (toId, subjectId, allianceLabel, tick) => ({ toId, subjectId, allianceLabel, tick });

describe('outboundImpressionOf — nothing shown, nothing known', () => {
  test('an empty outbound record yields NULL, not a midpoint', () => {
    expect(outboundImpressionOf({ selfId: 'a', observerId: 'b' })).toBeNull();
    expect(outboundImpressionOf({ selfId: 'a', observerId: 'b', plants: [], transfers: [], shares: [] })).toBeNull();
  });

  test('a sealed posture alone is not evidence about their picture', () => {
    // Hiding tells us they have LESS, never what they have. A `sealed` impression with no
    // act behind it would be an opinion manufactured out of our own silence.
    expect(outboundImpressionOf({ selfId: 'a', observerId: 'b', sealed: true })).toBeNull();
  });

  test('acts aimed elsewhere or about someone else are refused', () => {
    const impression = outboundImpressionOf({
      selfId: 'a',
      observerId: 'b',
      plants: [plant('c', 'a', 4, 1)],           // shown to the wrong court
      transfers: [transfer('b', 'c', 4, 2)],     // about the wrong subject
    });
    expect(impression).toBeNull();
  });

  test('a self-read is refused outright', () => {
    expect(outboundImpressionOf({ selfId: 'a', observerId: 'a', plants: [plant('a', 'a', 4, 1)] })).toBeNull();
    expect(outboundImpressionOf({ selfId: '', observerId: 'b', plants: [plant('b', '', 4, 1)] })).toBeNull();
  });
});

describe('outboundImpressionOf — the latest act on a field is what they were last told', () => {
  test('a plant asserts the band outright and names its channel', () => {
    const impression = outboundImpressionOf({ selfId: 'a', observerId: 'b', plants: [plant('b', 'a', 4, 7)] });
    expect(impression.strengthBand).toBe(4);
    expect(impression.basis).toEqual(['plant:strengthBand']);
    expect(impression.sealed).toBe(false);
  });

  test('a later act supersedes an earlier one', () => {
    const impression = outboundImpressionOf({
      selfId: 'a',
      observerId: 'b',
      plants: [plant('b', 'a', 4, 3)],
      transfers: [transfer('b', 'a', 1, 9)],
    });
    expect(impression.strengthBand).toBe(1);
    expect(impression.basis).toContain('transfer:strengthBand');
  });

  test('a same-tick tie resolves to the plant, because we chose that number', () => {
    // Stated in the module rather than incidental: the channel order is the tie-break,
    // and a lie we seeded is the louder act.
    const impression = outboundImpressionOf({
      selfId: 'a',
      observerId: 'b',
      plants: [plant('b', 'a', 4, 5)],
      transfers: [transfer('b', 'a', 1, 5)],
    });
    expect(impression.strengthBand).toBe(4);
    // OUTBOUND_CHANNELS is STRONGEST-FIRST, so `plant` carries the lower index. Pinning
    // the direction here is not decoration: the sort comparator inside the module has to
    // invert this list to make the strongest act land last, and writing that comparator
    // the natural way round is exactly how a same-tick tie silently resolves to the
    // quieter act. It did, on the first draft, and this pin is what caught it.
    expect(OUTBOUND_CHANNELS.indexOf('plant')).toBeLessThan(OUTBOUND_CHANNELS.indexOf('transfer'));
  });

  test('a partial handover says so on the receipt rather than bending the number', () => {
    const impression = outboundImpressionOf({
      selfId: 'a', observerId: 'b', transfers: [transfer('b', 'a', 3, 4, 0.4)],
    });
    expect(impression.strengthBand).toBe(3);
    expect(impression.basis).toContain('transfer:partial');
  });

  test('only an ally share declares a relationship, and only the latest one', () => {
    const impression = outboundImpressionOf({
      selfId: 'a',
      observerId: 'b',
      shares: [share('b', 'a', 'rival', 2), share('b', 'a', 'allied', 8)],
    });
    expect(impression.allianceLabel).toBe('allied');
    // anchored: the same call returns a populated `basis`, which proves the reader ran
    // and was correctly keyed, so the absence of a strength band measures the rule.
    expect(impression.basis).toEqual(['share:allianceLabel']);
    expect(impression.strengthBand).toBeUndefined();
  });

  test('the sealed posture rides the receipt when there IS an act behind it', () => {
    const impression = outboundImpressionOf({
      selfId: 'a', observerId: 'b', plants: [plant('b', 'a', 2, 1)], sealed: true,
    });
    expect(impression.sealed).toBe(true);
    // It changes how OLD their picture is, never what it is — the one decay law in the
    // estate lives in beliefMap.js and this file does not mint a second one.
    expect(impression.strengthBand).toBe(2);
  });
});

describe('outboundImpressionOf — deterministic', () => {
  test('input order does not change the result', () => {
    const args = {
      selfId: 'a',
      observerId: 'b',
      plants: [plant('b', 'a', 4, 3), plant('b', 'a', 2, 3)],
      transfers: [transfer('b', 'a', 1, 1)],
      shares: [share('b', 'a', 'allied', 6), share('b', 'a', 'rival', 6)],
    };
    const forward = JSON.stringify(outboundImpressionOf(args));
    const reversed = JSON.stringify(outboundImpressionOf({
      ...args,
      plants: [...args.plants].reverse(),
      transfers: [...args.transfers].reverse(),
      shares: [...args.shares].reverse(),
    }));
    expect(reversed).toBe(forward);
    // anchored: the forward result is non-null and carries a basis, so the equality is a
    // determinism measurement rather than two nulls agreeing.
    expect(JSON.parse(forward).basis.length).toBeGreaterThan(0);
  });

  test('the basis is codepoint-ordered so a receipt reads the same way twice', () => {
    const impression = outboundImpressionOf({
      selfId: 'a',
      observerId: 'b',
      transfers: [transfer('b', 'a', 3, 4, 0.4)],
      shares: [share('b', 'a', 'allied', 1)],
    });
    expect(impression.basis).toEqual([...impression.basis].sort());
    expect(impression.basis.length).toBe(3);
  });
});
