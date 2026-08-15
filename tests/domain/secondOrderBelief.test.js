/**
 * secondOrderBelief.test.js — FP IN-1a's acceptance battery (C1–C7).
 *
 * The claim under test is narrow and it is about REFUSAL as much as derivation: the
 * mirror answers "what does OUR OWN durable record say that court has been shown of us?"
 * and it may never answer anything else. So the battery drives the reachable arm, then
 * spends most of its length proving what the leaf declines to do — an empty record, a
 * pruned handover, a malformed world, and above all the partition it must not cross.
 *
 * ⚠ C8 (a duplicate/idempotent write case) is OMITTED rather than replaced: IN-1a writes
 * nothing, so there is no idempotency to assert.
 *
 * Every case is registered STRAIGHT-LINE. A `test(` inside a loop parks the WHOLE file in
 * the estate's lighting census and loses every other title in it.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import {
  MIRROR_BANDS,
  MIRROR_PERCEPTION_BANNED,
  MIRROR_STALENESS_BANDS,
  MIRROR_UNKNOWN,
  mirrorInputsAt,
  secondOrderBeliefActive,
  secondOrderMirrorOf,
} from '../../src/domain/worldPulse/secondOrderBelief.js';
import { HALF_LIFE_BANDS } from '../../src/domain/worldPulse/bandedStock.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF = 'src/domain/worldPulse/secondOrderBelief.js';

/** Source with comments blanked. A claim about what a module CANNOT reach must read the
 *  code: this leaf's header names the forbidden call in prose, and a raw scan would count
 *  that refusal as the offence. */
const codeOf = (rel) => readFileSync(join(ROOT, rel), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

const importsOf = (source) => [
  ...new Set([...source.matchAll(/from '([^']+)'/g)].map((m) => m[1])),
].sort();

const LIT = Object.freeze({ secondOrderBeliefEnabled: true });
const SEAT = 'seat';

const world = (ledgers = {}, extra = {}) => ({ simulationRules: LIT, spatialLedgers: ledgers, ...extra });
const plantRow = (audienceId, assertedBand, seededTick, subjectId = 's') => ({
  liarId: 's', subjectId, audienceId, assertedBand, trueBand: 1, seededTick, lineageId: `disinfo:s:${audienceId}:${seededTick}`,
});
const transferRow = (depositTick, strengthBand = 2, fidelity01 = 0.4) => ({
  sellerId: 's', receiverId: 'o', subjectId: 's', mode: 'sale', belief: { strengthBand }, fidelity01, depositTick,
});
const heldRecord = (lastUpdateTick = 14) => ({
  readiness: 0.4, strengthBand: 2, allianceLabel: 'hostile', faithLabel: null, confidence01: 0.8, lastUpdateTick,
});
/** Our errand, taken by them — the direction that is silent if it is wrong. */
const ourErrandTakenBy = (interceptorId) => ([
  { from: 's', to: 'o', state: 'intercepted', encounters: [{ interceptorId, encounteredTick: 15 }] },
]);

const mirrorOfWorld = (w, self = 's', observer = 'o', tick = 20) => secondOrderMirrorOf(mirrorInputsAt(w, self, observer, tick));

describe('IN-1a C1 — the reachable read: what our own record says we showed them', () => {
  test('a plant aimed at the observer bands the assertion, dates it, and names its channel', () => {
    const record = mirrorOfWorld(world({ disinfo: { 'lie:s:o': plantRow('o', 4, 10) } }));
    expect(record.strengthShown).toBe(MIRROR_BANDS[MIRROR_BANDS.length - 1]);
    expect(record.lastShownTick).toBe(10);
    expect(MIRROR_STALENESS_BANDS).toContain(record.staleness);
    expect(record.staleness).toBe(HALF_LIFE_BANDS[0]);
    expect(record.basis).toContain('plant:strengthBand');
  });

  test('the gate is the one door: dark, the same world yields the frozen unknown', () => {
    const ledgers = { disinfo: { 'lie:s:o': plantRow('o', 4, 10) } };
    expect(secondOrderBeliefActive(world(ledgers))).toBe(true);
    expect(secondOrderBeliefActive({ ...world(ledgers), simulationRules: {} })).toBe(false);
    expect(mirrorOfWorld({ ...world(ledgers), simulationRules: {} })).toBe(MIRROR_UNKNOWN);
  });

  test('the staleness clock spans the whole borrowed half-life ladder', () => {
    // Driven, not transcribed: every rung must be reachable or the clock is decoration.
    const reached = new Set();
    for (const age of [0, 13, 52, 156, 520, 1040, 5000]) {
      reached.add(mirrorOfWorld(world({ disinfo: { 'lie:s:o': plantRow('o', 2, 0) } }), 's', 'o', age).staleness);
    }
    expect([...reached].sort()).toEqual([...HALF_LIFE_BANDS].sort());
  });
});

describe('IN-1a C2 — the empty-record negative, with its seeded sibling', () => {
  test('nothing shown yields the frozen unknown, never a fabricated middle band', () => {
    // The SIBLING is what makes this a measurement: the SAME world carries a real record
    // toward `o`, so an unknown toward `p` cannot be passing on an empty world.
    const shared = world({ disinfo: { 'lie:s:o': plantRow('o', 4, 10) } });
    const seeded = mirrorOfWorld(shared, 's', 'o');
    const empty = mirrorOfWorld(shared, 's', 'p');

    expect(seeded.strengthShown).toBe(MIRROR_BANDS[MIRROR_BANDS.length - 1]);
    expect(seeded.lastShownTick).toBe(10);

    expect(empty).toBe(MIRROR_UNKNOWN);
    expect(empty.strengthShown).toBe(MIRROR_BANDS[0]);
    expect(empty.wealthShown).toBe(MIRROR_BANDS[0]);
    expect(empty.devotionShown).toBe(MIRROR_BANDS[0]);
    expect(empty.confidence).toBe(MIRROR_BANDS[0]);
    expect(empty.lastShownTick).toBeNull();
    expect(empty.staleness).toBe(MIRROR_STALENESS_BANDS[0]);
  });

  test('an act aimed elsewhere or about someone else is not evidence toward this observer', () => {
    const elsewhere = world({ disinfo: { 'lie:s:c': plantRow('c', 4, 10) } });
    const aboutAnother = world({ disinfo: { 'lie:s:o': plantRow('o', 4, 10, 'c') } });
    expect(mirrorOfWorld(elsewhere)).toBe(MIRROR_UNKNOWN);
    expect(mirrorOfWorld(aboutAnother)).toBe(MIRROR_UNKNOWN);
  });

  test('a seal with no act behind it is evidence we showed them nothing', () => {
    // Hiding says they have LESS, never what they hold. An impression built out of our own
    // silence would be an opinion manufactured from nothing.
    expect(mirrorOfWorld(world({ secrecyPostures: { s: { level01: 0.8, enteredTick: 12 } } }))).toBe(MIRROR_UNKNOWN);
  });
});

describe('IN-1a C3 — the reversal pin: evidence drives confidence DOWN, on both legs', () => {
  const seed = () => ({
    disinfo: { 'lie:s:o': plantRow('o', 4, 10) },
    secrecyPostures: { s: { level01: 0.8, enteredTick: 12 } },
  });
  const rung = (record) => MIRROR_BANDS.indexOf(record.confidence);

  test('LEG (b): an errand of OURS taken by THEM degrades the mirror', () => {
    const base = mirrorOfWorld(world(seed()));
    const caught = mirrorOfWorld(world(seed(), { envoyErrands: ourErrandTakenBy('o') }));
    expect(rung(base)).toBeGreaterThan(0);
    expect(rung(caught)).toBeLessThan(rung(base));
    expect(caught.basis).toContain('intercept:caught');
  });

  test('LEG (b) DIRECTION: an interception by a third court does not degrade it', () => {
    // The errand's origin is us and the encounter's interceptor is them. Reversing that
    // pair reads as a perfectly clean mirror forever, which is why it is pinned.
    const base = mirrorOfWorld(world(seed()));
    const byAnother = mirrorOfWorld(world(seed(), { envoyErrands: ourErrandTakenBy('c') }));
    const theirErrand = mirrorOfWorld(world(seed(), {
      envoyErrands: [{ from: 'o', to: 's', state: 'intercepted', encounters: [{ interceptorId: 's', encounteredTick: 15 }] }],
    }));
    expect(rung(byAnother)).toBe(rung(base));
    expect(rung(theirErrand)).toBe(rung(base));
  });

  test('LEG (c): our OWN record of their acts degrades it, independently of leg (b)', () => {
    const base = mirrorOfWorld(world(seed()));
    const heard = mirrorOfWorld(world({ ...seed(), beliefMaps: { s: { [SEAT]: { o: heldRecord() } } } }));
    expect(rung(heard)).toBeLessThan(rung(base));
    expect(heard.basis).toContain('record:independent');
  });

  test('both legs together degrade further than either alone', () => {
    const one = mirrorOfWorld(world(seed(), { envoyErrands: ourErrandTakenBy('o') }));
    const both = mirrorOfWorld(
      world({ ...seed(), beliefMaps: { s: { [SEAT]: { o: heldRecord() } } } }, { envoyErrands: ourErrandTakenBy('o') }),
    );
    expect(rung(both)).toBeLessThan(rung(one));
  });
});

describe('IN-1a C4 — the frozen closed shape (coupling manifest row 14 PRE-PIN)', () => {
  test('the key set is exactly eight, codepoint-ordered, and closed', () => {
    const record = mirrorOfWorld(world({ disinfo: { 'lie:s:o': plantRow('o', 3, 10) } }));
    const KEYS = ['basis', 'confidence', 'devotionShown', 'lastShownTick', 'sealed', 'staleness', 'strengthShown', 'wealthShown'];
    expect(Object.keys(record)).toEqual(KEYS);
    expect(Object.keys(MIRROR_UNKNOWN)).toEqual(KEYS);
    expect([...KEYS]).toEqual([...KEYS].sort());
  });

  test('the record and its arrays are frozen, and every band is a declared ladder member', () => {
    const record = mirrorOfWorld(world({ disinfo: { 'lie:s:o': plantRow('o', 3, 10) } }));
    expect(Object.isFrozen(record)).toBe(true);
    expect(Object.isFrozen(record.basis)).toBe(true);
    expect(Object.isFrozen(MIRROR_UNKNOWN)).toBe(true);
    expect(Object.isFrozen(MIRROR_BANDS)).toBe(true);
    expect(MIRROR_BANDS).toContain(record.strengthShown);
    expect(MIRROR_BANDS).toContain(record.wealthShown);
    expect(MIRROR_BANDS).toContain(record.devotionShown);
    expect(MIRROR_BANDS).toContain(record.confidence);
    expect(MIRROR_STALENESS_BANDS).toContain(record.staleness);
    expect(typeof record.sealed).toBe('boolean');
  });

  test('the two unsubstantiated axes answer the head rung at this HEAD', () => {
    // MINTED NOW and answering `unknown` on purpose: widening a frozen cross-program shape
    // later is the expensive act, so the keys exist before the substrate does.
    const record = mirrorOfWorld(world({ disinfo: { 'lie:s:o': plantRow('o', 4, 10) } }));
    expect(record.strengthShown).not.toBe(MIRROR_BANDS[0]);
    expect(record.wealthShown).toBe(MIRROR_BANDS[0]);
    expect(record.devotionShown).toBe(MIRROR_BANDS[0]);
  });

  test('the basis is codepoint-ordered so two reads of one record agree', () => {
    const record = mirrorOfWorld(world({
      disinfo: { 'lie:s:o': plantRow('o', 4, 10) },
      secrecyPostures: { s: { level01: 0.8, enteredTick: 12 } },
    }));
    expect(record.basis).toEqual([...record.basis].sort());
    expect(record.basis.length).toBeGreaterThan(1);
  });
});

describe('IN-1a C5 — the adapter contract, and totality on everything malformed', () => {
  test('the three renames land, and a LIVE handover reaches the derivation', () => {
    const input = mirrorInputsAt(world({ intelTransfers: { k: transferRow(20) } }), 's', 'o', 20);
    expect(input.transfers).toHaveLength(1);
    expect(input.transfers[0]).toEqual({ fidelity01: 0.4, strengthBand: 2, subjectId: 's', tick: 20, toId: 'o' });
    const record = secondOrderMirrorOf(input);
    expect(record.basis).toContain('transfer:strengthBand');
    expect(record.basis).toContain('transfer:partial');
    expect(record.strengthShown).toBe(MIRROR_BANDS[3]);
  });

  test('a PRIOR-tick handover produces none — the channel is live but memoryless', () => {
    // Asserted rather than assumed: the handover ledger drops every prior-tick row, so a
    // transfer can say what we showed them this tick and can never age into the clock.
    const live = mirrorInputsAt(world({ intelTransfers: { k: transferRow(20) } }), 's', 'o', 20);
    const stale = mirrorInputsAt(world({ intelTransfers: { k: transferRow(19) } }), 's', 'o', 20);
    expect(live.transfers).toHaveLength(1);
    expect(stale.transfers).toHaveLength(0);
    expect(secondOrderMirrorOf(stale)).toBe(MIRROR_UNKNOWN);
  });

  test('a live handover alone never dates the record, because it cannot age', () => {
    const record = mirrorOfWorld(world({ intelTransfers: { k: transferRow(20) } }));
    expect(record.lastShownTick).toBeNull();
    expect(record.staleness).toBe(MIRROR_STALENESS_BANDS[0]);
    expect(record.strengthShown).toBe(MIRROR_BANDS[3]);
  });

  test('the share channel is empty at this HEAD, because no ledger records one', () => {
    const input = mirrorInputsAt(world({ disinfo: { 'lie:s:o': plantRow('o', 2, 5) } }), 's', 'o', 20);
    // anchored: the SAME input carries a populated `plants` array one line below, which
    // proves the collector ran and was correctly keyed, so the empty share list measures
    // the recorded deferral rather than a reader that returned nothing.
    expect(input.shares).toEqual([]);
    expect(input.plants).toHaveLength(1);
  });

  test('missing ledgers, junk rows and junk ids all answer the unknown without throwing', () => {
    const junk = [null, undefined, 42, 'x', [], {}, { spatialLedgers: null }, { spatialLedgers: 7 }];
    for (const w of junk) expect(secondOrderMirrorOf(mirrorInputsAt(w, 's', 'o', 20))).toBe(MIRROR_UNKNOWN);
    for (const bad of junk) expect(secondOrderMirrorOf(bad)).toBe(MIRROR_UNKNOWN);
    const rows = world({ disinfo: [1, 'x', null, { subjectId: 's', audienceId: 'o' }], intelTransfers: 'nope' });
    expect(() => mirrorOfWorld(rows)).not.toThrow();
    for (const id of [null, 42, '', {}]) {
      expect(secondOrderMirrorOf(mirrorInputsAt(world(), id, 'o', 20))).toBe(MIRROR_UNKNOWN);
      expect(secondOrderMirrorOf(mirrorInputsAt(world(), 's', id, 20))).toBe(MIRROR_UNKNOWN);
    }
    expect(secondOrderMirrorOf(mirrorInputsAt(world(), 's', 's', 20))).toBe(MIRROR_UNKNOWN);
  });

  test('a non-finite tick cannot reach the throwing half-life accessor', () => {
    // The weeks accessor throws on an unknown band by design; the leaf clamps and guards
    // before it, so a junk clock degrades to the head rung instead of exploding.
    const ledgers = { disinfo: { 'lie:s:o': plantRow('o', 2, 10) } };
    for (const tick of [NaN, Infinity, -Infinity, null, undefined, 'soon', {}]) {
      const record = mirrorOfWorld(world(ledgers), 's', 'o', tick);
      expect(MIRROR_STALENESS_BANDS).toContain(record.staleness);
    }
    expect(mirrorOfWorld(world(ledgers), 's', 'o', -9999).staleness).toBe(HALF_LIFE_BANDS[0]);
  });
});

describe('IN-1a C6 — determinism and the lifecycle round trip', () => {
  const rich = () => world({
    disinfo: { 'lie:s:o': plantRow('o', 4, 10), 'lie:s:c': plantRow('c', 1, 3) },
    intelTransfers: { k: transferRow(20) },
    secrecyPostures: { s: { level01: 0.8, enteredTick: 12 } },
    beliefMaps: { s: { [SEAT]: { o: heldRecord() } } },
  }, { envoyErrands: ourErrandTakenBy('o') });

  test('two identical inputs yield byte-identical mirrors', () => {
    const a = mirrorOfWorld(rich());
    const b = mirrorOfWorld(rich());
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.basis.length).toBeGreaterThan(0);
  });

  test('a JSON save/load round trip yields a byte-identical mirror', () => {
    // The volume's "never stored" clause, proved rather than asserted: the mirror is a
    // derivation, so a world that has been through persistence must answer identically.
    const before = mirrorOfWorld(rich());
    const after = mirrorOfWorld(JSON.parse(JSON.stringify(rich())));
    expect(JSON.stringify(after)).toBe(JSON.stringify(before));
    expect(before.lastShownTick).toBe(12);
  });

  test('ledger enumeration order cannot move a byte of the answer', () => {
    const forward = world({ disinfo: { a: plantRow('o', 1, 4), b: plantRow('o', 3, 9) } });
    const reversed = world({ disinfo: { b: plantRow('o', 3, 9), a: plantRow('o', 1, 4) } });
    expect(JSON.stringify(mirrorOfWorld(reversed))).toBe(JSON.stringify(mirrorOfWorld(forward)));
  });

  test('the collector never mutates the world it reads', () => {
    const w = rich();
    const before = JSON.stringify(w);
    mirrorOfWorld(w);
    expect(JSON.stringify(w)).toBe(before);
  });
});

describe('IN-1a C7 — the K3 boundary, its three arms, and guard-the-guard', () => {
  test('ARM 1 (structural): the derivation takes no world at all', () => {
    // The strongest arm and the free one. A function with no world cannot reach a belief
    // partition, by construction, forever — no scan can be fooled about an argument that
    // does not exist.
    expect(secondOrderMirrorOf.length).toBe(1);
    const signature = codeOf(LEAF).match(/export function secondOrderMirrorOf\(([^)]*)\)/);
    expect(signature, 'the derivation export moved — re-anchor this arm').toBeTruthy();
    // The anchor is the parameter that IS there, so an absence measured here cannot be an
    // absence produced by a regex that quietly stopped biting.
    expectAbsentWithAnchor(signature[1], 'worldState', 'input', 'the derivation signature');
    expect(signature[1].trim()).toBe('input');
  });

  test('ARM 2 (allow-list): the reachable set is exactly the three reviewed modules', () => {
    const source = codeOf(LEAF);
    // ANTI-VACUITY FLOOR FIRST: a blanked or emptied read would report a clean allow-list.
    expect(source.length).toBeGreaterThan(1000);
    expect(source).toContain('secondOrderMirrorOf');
    expect(importsOf(source)).toEqual(['./bandedStock.js', './beliefMap.js', './outboundImpression.js']);
  });

  test('ARM 3 (argument order): one belief call, and our id stands in the observer slot', () => {
    const source = codeOf(LEAF);
    const calls = source.match(/beliefRecord\([^)]*\)/g) || [];
    expect(calls).toHaveLength(1);
    expect(calls[0]).toBe('beliefRecord(world, self, observer)');
  });

  test('GUARD THE GUARD: the same partition scan DOES flag the module that opens it', () => {
    // A scan that cannot convict the one module it should convict is decoration.
    const PARTITION_TOKENS = ['beliefMaps', 'getSpatialLedger'];
    const opener = codeOf('src/domain/worldPulse/beliefMap.js');
    const leaf = codeOf(LEAF);
    const flagged = PARTITION_TOKENS.filter((token) => opener.includes(token));
    expect(flagged).toEqual(PARTITION_TOKENS);
    expect(PARTITION_TOKENS.filter((token) => leaf.includes(token))).toEqual([]);
  });

  test('the forbidden direction is unreachable: their record of US moves nothing', () => {
    const seed = {
      disinfo: { 'lie:s:o': plantRow('o', 4, 10) },
      secrecyPostures: { s: { level01: 0.8, enteredTick: 12 } },
    };
    const base = mirrorOfWorld(world(seed));
    const theirs = mirrorOfWorld(world({ ...seed, beliefMaps: { o: { [SEAT]: { s: heldRecord() } } } }));
    expect(JSON.stringify(theirs)).toBe(JSON.stringify(base));
  });

  test('the mirror speaks of the record, never of a mind', () => {
    const single = MIRROR_PERCEPTION_BANNED.filter((word) => !word.includes(' '));
    const phrases = MIRROR_PERCEPTION_BANNED.filter((word) => word.includes(' '));
    expect(MIRROR_PERCEPTION_BANNED.length).toBeGreaterThan(0);
    expect(single.length).toBeGreaterThan(0);
    expect(phrases.length).toBeGreaterThan(0);

    // The vocabulary is DRIVEN out of the leaf rather than transcribed, so a token the
    // derivation invents tomorrow is scanned the day it appears.
    const spoken = new Set(MIRROR_BANDS);
    const driven = mirrorOfWorld(world({
      disinfo: { 'lie:s:o': plantRow('o', 4, 10) },
      intelTransfers: { k: transferRow(20) },
      secrecyPostures: { s: { level01: 0.8, enteredTick: 12 } },
      beliefMaps: { s: { [SEAT]: { o: heldRecord() } } },
    }, { envoyErrands: ourErrandTakenBy('o') }));
    for (const token of driven.basis) spoken.add(token);
    expect(spoken.size).toBeGreaterThan(MIRROR_BANDS.length);

    const offends = (value) => {
      const lower = String(value).toLowerCase();
      const words = lower.split(/[^a-z]+/).filter(Boolean);
      return single.some((w) => words.includes(w)) || phrases.some((p) => lower.includes(p));
    };
    expect([...spoken].filter(offends)).toEqual([]);
    // THE MUTANT: the predicate has to bite, or the emptiness above proves nothing.
    expect(['what they believe of us'].filter(offends)).toHaveLength(1);
    expect(['a picture held in their eyes'].filter(offends)).toHaveLength(1);
  });
});
