/**
 * IN-1c-a phrased-kind walker: the exact ONE-kind census of the INFORMATION registry, its
 * frequency-scaled annex-authored pool, its governed metadata, and the no-desk posture that a
 * dossier line must hold. This certifies presentation width only; it is not behavioral soak
 * evidence.
 *
 * THE ANNEX-READ POLICY, DECIDED UP FRONT: INFORMATION-VOLUME-ONLY. The one-kind-one-pool
 * merge (2026-08-03) forwarded twenty-three older pools into RECEIPT_POOLS_LEGACY.md; the IN
 * volume carries no such forward, and this walker asserts that POSITIVELY (the kind resolves
 * `from === 'information'`) rather than leaving it to be discovered when a future merge moves
 * a pool and the pin goes quietly stale.
 *
 * ⭐⭐ THE REGISTRATION SHAPE IS DELIBERATE AND IT IS A CENSUS FACT, NOT A STYLE. ONE literal
 * `describe`, EIGHT literal straight-line `test` calls, no table-driven registration, no
 * nesting, nothing skipped. A table-driven case is invisible to the estate-wide lighting
 * census by construction and parks the WHOLE FILE, so the census arithmetic would still close
 * while `credited` silently failed to move. The sibling WR-10 walker mixes both shapes and
 * pays exactly that price; this one does not.
 *
 * ⚠ THE ORTHOGONAL WITNESS IS DERIVED FROM THE DOCUMENT, NOT RETURNED BY THE READER. The
 * shared extractor returns its parsed `requiredSlots` only for a pool that took the legacy
 * forward, because the declaration lives on the relocated rows' own tags. The INFORMATION
 * volume carries none, so arm 2 derives each variant's slot set by rendering the pool through
 * the SAME governed reader under a sentinel interpolation and reading back which markers
 * survived. That still lets the CORPUS, rather than the registry, decide the arity — which is
 * the whole point of the witness — and it needs no second extractor.
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import { anchoredOnce, receiptAnnexPool, INFORMATION_ANNEX_URL } from '../helpers/receiptAnnex.js';
import {
  CHRONIC_COMPLIANT_PROBE,
  CHRONIC_TWO_VARIANT_PROBE,
  FREQUENCY_FLOORS,
  UNREGISTERED_PROBE,
  floorReasons,
  registrationReasons,
} from '../helpers/kindPoolWalker.js';
import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { SECTION_OF } from '../../src/domain/realm/heraldRouting.js';
import {
  INFORMATION_KIND_REGISTRY,
  INFORMATION_KINDS,
  informationReceipt,
} from '../../src/domain/worldPulse/informationNews.js';

/** kind, significance, audience, desk, authored depth. */
const EXPECTED = Object.freeze([
  ['mirror_standing_line', 'routine', 'public', null, 9],
]);

/** The wave's own slice anchors. */
const SECTION = '## IN-1';
const UNTIL = '## IN-2';

/** Slots the read-model can actually supply today (CR-IN1C-2 rules out the season). */
const SUPPLIABLE = Object.freeze({ counterpart: 'Bramwell', band: 'a strong hand' });
/** The same, plus the slot no supplier exists for — the second arm of the eligibility control. */
const WITH_SEASON = Object.freeze({ ...SUPPLIABLE, season: 'high summer' });

/** Every slot the IN-1 block declares, so the sentinel probe can see all three. */
const ALL_SLOTS = Object.freeze(['counterpart', 'band', 'season']);
/** Markers no authored sentence contains, so a surviving one names the slot that placed it. */
const SENTINEL = Object.freeze(Object.fromEntries(ALL_SLOTS.map((slot) => [slot, `<<${slot}>>`])));

/**
 * The two variants CR-IN1C-2 declares unreachable, by ZERO-BASED index into the authored pool:
 * the annex's numbered variants two and seven, the only two that name a season.
 */
const SEASON_ONLY_INDEXES = Object.freeze([1, 6]);

const ANNEX_SOURCE = readFileSync(INFORMATION_ANNEX_URL, 'utf8');

/**
 * The shared, fail-closed annex read: line-anchored headings asserted to occur EXACTLY once,
 * and a throw instead of the empty array that made the address-lie class invisible.
 * @param {string} kind @param {Record<string,string>} interp
 */
function annexPool(kind, interp) {
  return receiptAnnexPool(kind, {
    source: ANNEX_SOURCE, section: SECTION, until: UNTIL, interp, annex: 'information',
  });
}

/** Every template index a caller can actually REACH under one interpolation. */
function reachableIndexes(kind, interp, draws = 400) {
  const seen = new Set();
  for (let draw = 0; draw < draws; draw += 1) {
    const receipt = informationReceipt(kind, `in-1c-a:${draw}`, interp);
    if (receipt) seen.add(receipt.templateIndex);
  }
  return [...seen].sort((a, b) => a - b);
}

describe('SP-6 phrased-kind registry — IN-1c-a the INFORMATION standing line', () => {
  test('the one-kind census and every reader join are exact', () => {
    expect(INFORMATION_KINDS).toEqual(EXPECTED.map(([kind]) => kind));
    expect(INFORMATION_KIND_REGISTRY).toHaveLength(1);
    for (const [kind, significance, audience, section, depth] of EXPECTED) {
      const row = INFORMATION_KIND_REGISTRY.find((candidate) => candidate.kind === kind);
      expect(row).toMatchObject({ kind, significance, audience, section });
      expect(row.pool).toHaveLength(depth);
      expect(row.requiredSlots).toHaveLength(depth);
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.requiredSlots)).toBe(true);
      // Nine authored variants clear the chronic floor of eight OUTRIGHT, which is why this
      // row needs no declared floor exception at all (CR-IN1C-1) — asserted against the
      // derived table rather than a re-typed number.
      expect(row.pool.length).toBeGreaterThanOrEqual(FREQUENCY_FLOORS[significance]);
      // The pool keeps SLOTLESS families, so a receipt whose named evidence is absent still
      // has an honest authored sentence instead of a fabricated name.
      expect(row.requiredSlots.filter((slots) => slots.length === 0)).toHaveLength(4);
      // THE FIVE TYPED JOINS AS ONE VALUE. A deleted clause changes this array rather than
      // merely relaxing a bound, and the desk reader is handed in so a row that ACQUIRED a
      // section would red here instead of being read as a no-desk row forever.
      expect(registrationReasons(row, { sectionOf: SECTION_OF })).toEqual([]);
    }
    // THE SHARED TEMPLATE'S OWN CONTROLS, executed here rather than inherited: the estate's
    // constitution says a two-variant chronic kind is exactly as broken as an unregistered
    // one, and the predicate says so in values. The compliant probe is what stops a predicate
    // that reddened everything from satisfying both negatives.
    expect(floorReasons(UNREGISTERED_PROBE)).toEqual(['starved']);
    expect(floorReasons(CHRONIC_TWO_VARIANT_PROBE)).toEqual(['starved']);
    expect(floorReasons(CHRONIC_COMPLIANT_PROBE)).toEqual([]);
    // THE REGISTRY IS CLOSED, AND IT IS WHOLLY PUBLIC AND WHOLLY DESKLESS. Asserted as
    // emptiness of the complements rather than per-row, so a SECOND row that arrived covert
    // or desk-bearing reds here instead of slipping past a loop written for one kind.
    expect(INFORMATION_KIND_REGISTRY.filter((row) => row.audience !== 'public')).toEqual([]);
    expect(INFORMATION_KIND_REGISTRY.filter((row) => row.section !== null)).toEqual([]);
    expect(informationReceipt('mirror_unknown', 'seed', WITH_SEASON)).toBeNull();
    // Read against a call known to ANSWER, so the null above is a closed door rather than a
    // picker that returns nothing for everything.
    expect(informationReceipt('mirror_standing_line', 'seed', WITH_SEASON)).toBeTruthy();
    // Same seed, same world, same sentence — forever. The determinism the whole dossier line
    // rests on, asserted on the registry's own picker rather than through the read-model.
    expect(informationReceipt('mirror_standing_line', 'same', WITH_SEASON))
      .toEqual(informationReceipt('mirror_standing_line', 'same', WITH_SEASON));
  });

  test('the pool is the annex\'s, verbatim and in order, and the annex decides the arity', () => {
    const [[kind]] = EXPECTED;
    const row = INFORMATION_KIND_REGISTRY[0];
    const rendered = row.pool.map((variant) => (
      typeof variant === 'function' ? String(variant(WITH_SEASON)) : String(variant)
    ));
    expect(rendered).toEqual(annexPool(kind, WITH_SEASON).lines);
    expect(new Set(rendered).size).toBe(row.pool.length);
    // THE ORTHOGONAL WITNESS. Each variant's slot set is derived from the DOCUMENT — render
    // the annex under markers no sentence contains, then read back which survived — and
    // pinned against the registry's parallel array. A registry whose arity drifted from the
    // corpus reds here even though both would still render nine sentences.
    const fromAnnex = annexPool(kind, SENTINEL).lines
      .map((line) => ALL_SLOTS.filter((slot) => line.includes(SENTINEL[slot])));
    expect(fromAnnex).toEqual(row.requiredSlots.map((slots) => [...slots]));
    // …and the witness is only a witness if it can DISAGREE: the sentinel render must really
    // differ from the plain one, or every arity above would read as the empty array.
    expect(fromAnnex.filter((slots) => slots.length > 0)).toHaveLength(5);
    for (const line of rendered) {
      expect(line).toBe(line.trim());
      expect(line.length).toBeGreaterThan(0);
      // `rendered` is pinned EQUAL to the annex lines and to the authored depth above, and
      // each line is pinned non-empty, so this loop always runs over real sentences. The
      // pattern also matches the word an absent slot renders, so a lost fill reds.
      // anchored: annex-equality, authored depth, and per-line non-emptiness above.
      expect(line).not.toMatch(/\d|%|×|_|\$\{|\bundefined\b|\bNaN\b/);
      // The annex's own no-digits and voice laws, read against sentences known to be live.
      // anchored: same liveness — the rendered set is annex-equal and non-empty above.
      expect(line).not.toMatch(/—|!|\b(?:believe|believes|thinks|perceive)\b/i);
    }
  });

  test('the annex address of the pool is the INFORMATION volume, not a legacy forward', () => {
    // The census, not a bare absence pin: the kind must RESOLVE (the shared reader throws on
    // a rotted or duplicated heading) and the resolution must land in the INFORMATION volume.
    // If a later merge forwards this pool to the legacy annex, this reddens instead of the
    // pool silently reading as stale sentences.
    const address = INFORMATION_KINDS.map((kind) => annexPool(kind, WITH_SEASON).from);
    expect(address).toHaveLength(1);
    expect([...new Set(address)]).toEqual(['information']);
  });

  test('THE FIRST-MATCH LAW: every document anchor this walker rides matches exactly once', () => {
    // A substring document pin retargets SILENTLY when a second matching heading appears (the
    // recorded first-match hazard). Both slice anchors and the kind heading are asserted
    // single here, and the two mutants below prove the guard fires rather than decorating.
    expect(() => anchoredOnce(ANNEX_SOURCE, /^## IN-1(?=[ \n])/gm, 'IN-1 section')).not.toThrow();
    expect(() => anchoredOnce(ANNEX_SOURCE, /^## IN-2(?=[ \n])/gm, 'terminator')).not.toThrow();
    for (const kind of INFORMATION_KINDS) {
      const hits = [...ANNEX_SOURCE.matchAll(new RegExp(`^### ${kind}(?= )`, 'gm'))];
      expect(hits, `${kind}: annex heading count`).toHaveLength(1);
    }
  });

  test('MUTANT — a duplicated section heading throws instead of retargeting the slice', () => {
    const doctored = `${ANNEX_SOURCE}\n## IN-1 — A SECOND HEADING NOBODY NOTICED\n`;
    expect(() => receiptAnnexPool('mirror_standing_line', {
      source: doctored, section: SECTION, until: UNTIL, interp: WITH_SEASON, annex: 'information',
    })).toThrow(/expected exactly 1 match/);
  });

  test('MUTANT — a rotted kind heading throws instead of returning an empty pool', () => {
    const doctored = ANNEX_SOURCE.replace('### mirror_standing_line (IN-1;', '### mirror_standing_lineX (IN-1;');
    // anchored: the UNdoctored source resolves this exact kind to nine lines two lines below,
    // so a reader that had stopped resolving anything at all would fail there rather than let
    // this throw-pin pass for the wrong reason.
    expect(() => receiptAnnexPool('mirror_standing_line', {
      source: doctored, section: SECTION, until: UNTIL, interp: WITH_SEASON, annex: 'information',
    })).toThrow(/expected exactly 1 match/);
    expect(annexPool('mirror_standing_line', WITH_SEASON).lines).toHaveLength(9);
  });

  test('the no-desk row files no desk and claims no reader phrase', () => {
    const row = INFORMATION_KIND_REGISTRY[0];
    // THE POSITIVE CONTROL COMES FIRST, because both absences below are only measurements if
    // the readers they are read against are alive and populated on this run.
    expect(Object.keys(WHAT_PHRASES).length).toBeGreaterThan(1);
    expect(typeof SECTION_OF).toBe('function');
    expect(row.section).toBeNull();
    // A dossier line renders INTO the town page and reaches no desk, so a reader phrase would
    // be vocabulary with no address. The estate FORBIDS the row rather than merely not owing
    // it, and the honest way to say so is that the lookup answers nothing.
    expect(WHAT_PHRASES[row.kind]).toBeUndefined();
    // ⛔ And the token itself is unrouted: the desk map answers the catch-all for this kind,
    // which is precisely why registering it WITHOUT routing it raises the estate-wide
    // registered-minus-routed honesty check by exactly one. A desk here would be IN-5's.
    expect(SECTION_OF(row.kind)).toBe('events');
    // The control on THAT: the same reader really does file a routed kind somewhere else, so
    // the catch-all above is a routing fact rather than a reader that answers one word.
    expect(SECTION_OF('treaty_lapsed')).toBe('trade');
  });

  test('the eligible set is exactly seven without a season and exactly nine with one', () => {
    const [[kind]] = EXPECTED;
    const withoutSeason = reachableIndexes(kind, SUPPLIABLE);
    // ⛔ BOTH ARMS OR NOTHING. Asserting only that seven are reachable would pass just as
    // happily against a filter that had STOPPED filtering and a pool that had lost two
    // variants: seven is a stable number either way. The second arm is what separates
    // "the season slot has no supplier" from "the eligibility axis is broken".
    expect(withoutSeason).toHaveLength(7);
    expect(withoutSeason.filter((index) => SEASON_ONLY_INDEXES.includes(index))).toEqual([]);
    expect(reachableIndexes(kind, WITH_SEASON)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    // The two unreachable variants are named BY INDEX rather than by count, so a corpus edit
    // that moved the season into a different variant reds instead of counting to seven again.
    const row = INFORMATION_KIND_REGISTRY[0];
    expect(row.requiredSlots
      .map((slots, index) => (slots.includes('season') ? index : -1))
      .filter((index) => index >= 0)).toEqual([...SEASON_ONLY_INDEXES]);
  });
});
