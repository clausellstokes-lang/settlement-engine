/**
 * ENC-4 phrased-kind walker: the exact ONE-kind census of the CHANCE_MEETING registry, its
 * annex-authored six-variant pool, the closed band table beside it, the governed metadata, and
 * the desk-BEARING posture ROAD B chose. This certifies presentation width and the document
 * join only; it is not behavioral soak evidence — the beat's own battery lives in
 * tests/domain/envoyChanceMeetingStage.test.js.
 *
 * ⭐⭐ THE WORDS ARE THE CHAIR'S, AND THAT IS THE FINDING THIS FILE ENFORCES. The owner handed
 * ENC-5 to the chair in chat ("Also for ENC-5.. you write it") and the authored file was sealed
 * at `refs/preserve/enc5-words-2026-09-04` before any wiring existed.
 * docs/content/RECEIPT_POOLS_CHANCE_MEETING.md is a byte-identical copy of that seal, and
 * `envoyChanceMeetingReceiptPools.js` is its transcription. This walker re-derives the whole pool, the
 * `{outcome_phrase}` band table AND the reason from the DOCUMENT on every run, so the
 * transcription cannot fork from the corpus in either direction. ⛔ A corpus defect is a chair
 * annex act; a word that cannot be wired is a finding back to the chair with the slot that
 * breaks, never an edit here.
 *
 * ⭐⭐ THIS ANNEX CARRIES ITS OWN `requiredSlots` DECLARATION, AND THAT IS WHY THE READER IS
 * EXTENDED RATHER THAN COPIED. The shared fail-closed reader (tests/helpers/receiptAnnex.js) is
 * used for both of its cures — `sectionSlice` for the address lie and `anchoredOnce` for the
 * first-match hole — but its `numberedRows` pass cannot be used whole here: this volume writes a
 * SECOND numbered list inside the same kind block (`**Per-variant required slots**`), so the
 * shared extractor would return twelve rows where six are the pool. The block SPLIT is this
 * file's, the ANCHORS are the shared reader's, and the split is fail-closed exactly as the reader
 * is — it throws rather than returning a short list, and two mutants below prove it.
 *
 * That second list is not a nuisance; it is a free ORTHOGONAL WITNESS the FAITH volume did not
 * have. This walker therefore pins the registry's parallel array TWICE from two independent
 * derivations: against the annex's own DECLARED slot rows (in sentence order), and against a
 * sentinel render of the annex sentences (which slot markers actually survive). A registry that
 * drifted from the corpus reds on both, and a corpus whose declaration drifted from its own
 * sentences reds on the disagreement between them.
 *
 * ⛔ THIS VOLUME'S REGISTER FORBIDS THE EM-DASH, so this file DOES scan for one — the exact
 * opposite of tests/lint/faithKindPools.walker.test.js, which does not, because the FAITH
 * volume's §B declares the em-dash in terms. Each walker scans the laws ITS OWN volume declares;
 * copying a sibling's scan set is how a fence stops matching its fence-post.
 *
 * ⛔ §886 IS SCANNED ON RENDERED PROSE, NOT ASSERTED IN A COMMENT. `chance_meeting` is already a
 * live constant in this tree, and the annex's own preface promises that no variant puts "chance"
 * and "meeting" adjacent in either order. That promise is executed here against real sentences.
 *
 * ⭐⭐ THE REGISTRATION SHAPE IS DELIBERATE AND IT IS A CENSUS FACT, NOT A STYLE. ONE literal
 * `describe`, straight-line literal `test` calls, no table-driven registration, no nesting,
 * nothing skipped. A table-driven case is invisible to the estate-wide lighting census by
 * construction and parks the WHOLE FILE, so the census arithmetic would still close while
 * `credited` silently failed to move.
 *
 * ⚠ THE ANNEX URL IS DECLARED HERE rather than in tests/helpers/receiptAnnex.js, on the FAITH
 * walker's own recorded reasoning: the shared module owns the READER, and this volume has exactly
 * one consumer. The first SECOND consumer of the CHANCE_MEETING volume should promote it to
 * `CHANCE_MEETING_ANNEX_URL` beside its siblings.
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import { anchoredOnce, sectionSlice } from '../helpers/receiptAnnex.js';
import {
  CHRONIC_COMPLIANT_PROBE,
  CHRONIC_TWO_VARIANT_PROBE,
  FREQUENCY_FLOORS,
  UNREGISTERED_PROBE,
  floorReasons,
  registrationReasons,
} from '../helpers/kindPoolWalker.js';
import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { KIND_SECTION } from '../../src/domain/display/chroniclersLetter.js';
import { SECTION_OF, isExplicitlyRouted } from '../../src/domain/realm/heraldRouting.js';
import {
  CHANCE_MEETING_KINDS,
  CHANCE_MEETING_KIND_REGISTRY,
  CHANCE_MEETING_PRESENTATION,
  CHANCE_MEETING_REASON,
  chanceMeetingEntry,
  chanceMeetingLine,
} from '../../src/domain/worldPulse/envoyChanceMeetingNews.js';
// ⛔ THE CORPUS MODULE IS IMPORTED DIRECTLY AND THE IMPORT IS LOAD-BEARING TWICE OVER, on the
// FAITH walker's recorded reasoning. It lets the census below pin the registry's pool IDENTICAL
// to the corpus module's own export, so a registry that had inlined its sentences would red here
// rather than passing on a pool that merely renders the same; and it is what gives
// envoyChanceMeetingReceiptPools.js AUTO lit coverage in tests/property/mechanismLitCoverage.test.js.
import {
  CHANCE_MEETING_OUTCOME_PHRASES,
  CHANCE_MEETING_RECEIPTS,
} from '../../src/domain/worldPulse/envoyChanceMeetingReceiptPools.js';

/** kind, significance, audience, desk, authored depth. */
const EXPECTED = Object.freeze([
  ['chance_meeting_recorded', 'notable', 'public', 'events', 6],
]);

/** The annex heading for this pool. ⭐ Unlike the FAITH volume's descriptive placeholder, the
 *  sealed file heads the block with the CANONICAL spelling already, so the two-spelling join the
 *  FAITH walker carries has no work to do here — asserted below rather than assumed. */
const ANNEX_KIND = 'chance_meeting_recorded';
/** The wave's own slice anchors inside the CHANCE_MEETING volume. */
const SECTION = '## §A ENC-4';
const UNTIL = '## §B ENC-4';
const ANNEX_URL = new URL('../../docs/content/RECEIPT_POOLS_CHANCE_MEETING.md', import.meta.url);
const ANNEX_SOURCE = readFileSync(ANNEX_URL, 'utf8');

/** The line that separates the authored POOL from the annex's own slot DECLARATION. */
const SLOTS_MARKER = '**Per-variant required slots**';
/** A numbered row in either list. */
const NUMBERED_ROW_RE = /^\d+\. (.+)$/gm;

/** Every slot the §A block declares, in a fixed order the sentinel witness reads back in. */
const ALL_SLOTS = Object.freeze(['npc', 'counterpart', 'settlement', 'home', 'outcome_phrase']);
/** Markers no authored sentence contains, so a surviving one names the slot that placed it. */
const SENTINEL = Object.freeze(Object.fromEntries(ALL_SLOTS.map((slot) => [slot, `<<${slot}>>`])));

/** The production interpolation: every slot the writer resolves, all five supplied. */
const SUPPLIABLE = Object.freeze({
  npc: 'Sera Vane',
  counterpart: 'Aldo Rell',
  settlement: 'Bramwell',
  home: 'Kesthorne',
  outcome_phrase: 'found a friend',
});
/** The same with the guest's home withheld — the second arm of the eligibility control. */
const WITHOUT_HOME = Object.freeze({ ...SUPPLIABLE, home: '' });
/**
 * The variants that name `{home}`, by ZERO-BASED index, taken from the annex's own declaration
 * rather than counted. Variant two (index 1) is the only one that does not.
 */
const HOME_LESS_INDEXES = Object.freeze([1]);

/**
 * THE BLOCK SPLIT, fail-closed. Slices the §A wave block with the SHARED reader's anchors, finds
 * the kind heading with the shared reader's exactly-once guard, then cuts the body at the
 * declaration marker so the pool rows and the declared slot rows are read from disjoint text.
 * Throws on every absence — an extractor that returns `[]` is the bug this shape refuses.
 * @param {string} source @returns {{rows: string[], declared: string[][]}}
 */
function annexBlocks(source) {
  const scope = sectionSlice(source, SECTION, UNTIL);
  const heading = anchoredOnce(
    scope, new RegExp(`^### ${ANNEX_KIND}(?= )`, 'gm'), `${ANNEX_KIND}: heading in ${SECTION}`,
  );
  const afterHeading = scope.indexOf('\n', heading.index);
  if (afterHeading < 0) throw new Error(`chanceMeetingAnnex: ${ANNEX_KIND}: heading has no body`);
  const body = scope.slice(afterHeading + 1);
  const marker = body.indexOf(SLOTS_MARKER);
  if (marker < 0) {
    throw new Error(`chanceMeetingAnnex: ${ANNEX_KIND}: no "${SLOTS_MARKER}" block — the pool and`
      + ' its slot declaration cannot be told apart');
  }
  const rows = [...body.slice(0, marker).matchAll(NUMBERED_ROW_RE)].map((hit) => hit[1]);
  const declaredRows = [...body.slice(marker).matchAll(NUMBERED_ROW_RE)].map((hit) => hit[1]);
  if (rows.length === 0) throw new Error(`chanceMeetingAnnex: ${ANNEX_KIND}: no authored rows`);
  if (declaredRows.length === 0) throw new Error(`chanceMeetingAnnex: ${ANNEX_KIND}: no declared slot rows`);
  const declared = declaredRows.map((row) => [...row.matchAll(/\{(\w+)\}/g)].map((hit) => hit[1]));
  return { rows, declared };
}

/** The annex's six sentences under one interpolation. @param {Record<string,string>} interp */
function annexLines(interp) {
  return annexBlocks(ANNEX_SOURCE).rows
    .map((row) => row.replace(/\{(\w+)\}/g, (_, slot) => String(interp[slot])));
}

/** The annex's own `{outcome_phrase}` table, band -> fill. @returns {Record<string,string>} */
function annexBands() {
  const scope = sectionSlice(ANNEX_SOURCE, SECTION, UNTIL);
  const rows = [...scope.matchAll(/^\| `(\w+)` \| (.+?) \|$/gm)].map((hit) => [hit[1], hit[2]]);
  if (rows.length === 0) throw new Error('chanceMeetingAnnex: the band table resolved to nothing');
  return Object.fromEntries(rows);
}

/** The annex's own REASON clause, unwrapped. @returns {string} */
function annexReason() {
  const scope = sectionSlice(ANNEX_SOURCE, SECTION, UNTIL);
  const hit = /\*\*REASON, riding every variant\*\* \(design §8\.3\): ([\s\S]*?)\n\n/.exec(scope);
  if (!hit) throw new Error('chanceMeetingAnnex: the REASON clause resolved to nothing');
  return hit[1].replace(/\s+/g, ' ').trim();
}

/** Every template index a caller can actually REACH under one interpolation. */
function reachableIndexes(kind, interp, draws = 400) {
  const seen = new Set();
  for (let draw = 0; draw < draws; draw += 1) {
    const line = chanceMeetingLine(kind, `enc-4:${draw}`, interp);
    if (line) seen.add(line.templateIndex);
  }
  return [...seen].sort((a, b) => a - b);
}

/**
 * One production-shaped seed from ENC-3's seam, names included. ⭐ THE NAME FIELDS ARE THE SEED'S
 * OWN and not this fixture's invention: ENC-4 measured that the landed seed carried only ids
 * while the seam's contract promised "both courts, both names", and completed the address there.
 * @param {Record<string,unknown>} [extra]
 */
function seedOf(extra = {}) {
  return {
    beat: 'meeting',
    id: 'chance_meeting:err-7|kesthorne|bramwell',
    tick: 41,
    outcome: 'bond',
    venue: 'host_settlement',
    settlementIds: ['kesthorne', 'bramwell'],
    npcIds: ['npc:kesthorne:1', 'npc:bramwell:4'],
    venueIds: [],
    hostId: 'bramwell',
    npcNames: ['Sera Vane', 'Aldo Rell'],
    settlementNames: { kesthorne: 'Kesthorne', bramwell: 'Bramwell' },
    ...extra,
  };
}

/** @param {Record<string,unknown>} [extra] */
function entryOf(extra = {}) {
  return chanceMeetingEntry({ seed: seedOf(extra), now: '2026-01-01T00:00:00.000Z' });
}

describe('ENC-4 phrased-kind registry — the meeting neither court arranged', () => {
  test('the one-kind census and every reader join are exact', () => {
    expect(CHANCE_MEETING_KINDS).toEqual(EXPECTED.map(([kind]) => kind));
    expect(CHANCE_MEETING_KIND_REGISTRY).toHaveLength(1);
    for (const [kind, significance, audience, section, depth] of EXPECTED) {
      const row = CHANCE_MEETING_KIND_REGISTRY.find((candidate) => candidate.kind === kind);
      expect(row).toMatchObject({ kind, significance, audience, section });
      expect(row.pool).toHaveLength(depth);
      expect(row.requiredSlots).toHaveLength(depth);
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.requiredSlots)).toBe(true);
      // Six authored variants clear the derived `notable` floor of six by EQUALITY rather than by
      // margin, asserted against the derived table rather than a re-typed number. ⛔ A single
      // variant leaving this pool takes the family under its floor on the day it goes.
      expect(row.pool.length).toBeGreaterThanOrEqual(FREQUENCY_FLOORS[significance]);
      expect(row.pool.length).toBe(FREQUENCY_FLOORS.notable);
      // ⛔ THE REGISTRY READS THE CORPUS MODULE, it does not carry its own copy. Without this the
      // annex equality below would still pass over an inlined array that happened to render the
      // same sentences, and the corpus module would have no consumer at all.
      expect(row.pool).toBe(CHANCE_MEETING_RECEIPTS[kind]);
      // THE FIVE TYPED JOINS AS ONE VALUE. A deleted clause changes this array rather than merely
      // relaxing a bound; both readers are handed in, so a row that LOST its phrase or acquired a
      // different desk reds here instead of being read as compliant forever.
      expect(registrationReasons(row, { sectionOf: SECTION_OF, phrases: WHAT_PHRASES })).toEqual([]);
    }
    // THE SHARED TEMPLATE'S OWN CONTROLS, executed here rather than inherited.
    expect(floorReasons(UNREGISTERED_PROBE)).toEqual(['starved']);
    expect(floorReasons(CHRONIC_TWO_VARIANT_PROBE)).toEqual(['starved']);
    expect(floorReasons(CHRONIC_COMPLIANT_PROBE)).toEqual([]);
    // THE REGISTRY IS CLOSED AND WHOLLY PUBLIC, asserted as emptiness of the complement so a
    // SECOND row arriving covert reds here instead of slipping past a loop written for one kind.
    expect(CHANCE_MEETING_KIND_REGISTRY.filter((row) => row.audience !== 'public')).toEqual([]);
    expect(chanceMeetingLine('chance_meeting_unknown_kind', 'seed', SUPPLIABLE)).toBeNull();
    // Read against a call known to ANSWER, so the null above is a closed door rather than a
    // picker that returns nothing for everything.
    expect(chanceMeetingLine('chance_meeting_recorded', 'seed', SUPPLIABLE)).toBeTruthy();
  });

  test('the pool is the annex\'s, verbatim and in order, and the annex decides the arity', () => {
    const row = CHANCE_MEETING_KIND_REGISTRY[0];
    const rendered = row.pool.map((variant) => (
      typeof variant === 'function' ? String(variant(SUPPLIABLE)) : String(variant)
    ));
    expect(rendered).toEqual(annexLines(SUPPLIABLE));
    expect(new Set(rendered).size).toBe(row.pool.length);
    // ⭐ WITNESS ONE — THE ANNEX'S OWN DECLARATION, in the annex's own sentence order. This volume
    // publishes `requiredSlots` per variant, so the registry's parallel array is pinned against
    // the document rather than merely against itself.
    expect(row.requiredSlots.map((slots) => [...slots])).toEqual(annexBlocks(ANNEX_SOURCE).declared);
    // ⭐ WITNESS TWO — ORTHOGONAL, AND DERIVED BY EXECUTION. Render the annex under markers no
    // sentence contains, read back which survived, and pin the SET against the same array. Witness
    // one would still pass if the annex's declaration had drifted from the annex's own sentences;
    // this one cannot, because it reads the sentences.
    const fromSentences = annexLines(SENTINEL)
      .map((line) => ALL_SLOTS.filter((slot) => line.includes(SENTINEL[slot])));
    expect(fromSentences).toEqual(
      row.requiredSlots.map((slots) => ALL_SLOTS.filter((slot) => slots.includes(slot))),
    );
    // …and the witness is only a witness if it can DISAGREE: the sentinel render must really
    // differ from the plain one, or every arity above would read as the empty array.
    expect(fromSentences.filter((slots) => slots.length > 0)).toHaveLength(6);
    for (const line of rendered) {
      expect(line).toBe(line.trim());
      expect(line.length).toBeGreaterThan(0);
      // `rendered` is pinned EQUAL to the annex lines and to the authored depth above, and each
      // line is pinned non-empty, so this loop always runs over real sentences.
      // anchored: annex-equality, authored depth, and per-line non-emptiness are asserted above.
      expect(line).not.toMatch(/\d|%|×|_|\$\{|[{}]|\bundefined\b|\bNaN\b/);
      // ⛔ THIS VOLUME'S DECLARED VOICE FENCES: no em dash and no exclamation. The FAITH walker
      // scans neither, because the FAITH volume declares the em-dash; this annex forbids it.
      // anchored: same liveness — the rendered set is annex-equal and non-empty above.
      expect(line).not.toMatch(/[—!]/);
      // ⛔ §886: the engine's own identifier may never assemble itself in a townsperson's mouth.
      // anchored: same liveness — these are the six annex-equal sentences asserted above.
      expect(line).not.toMatch(/chance\W+meeting|meeting\W+chance/i);
      // ⛔ STATE, NEVER FATE. Nothing this beat says may resolve a named person's life.
      // anchored: same liveness — the six sentences are annex-equal and name both people below.
      expect(line).not.toMatch(/\b(?:died|dead|killed|slain|executed|exiled|wed|married|replaced|deposed)\b/i);
    }
    // THE POSITIVE CONTROL FOR ALL FOUR NEGATIVES ABOVE: the sentences really do name both people
    // and both places, so the absences are read against prose that could have carried the defects.
    expect(rendered.filter((line) => line.includes('Sera Vane'))).toHaveLength(6);
    expect(rendered.filter((line) => line.includes('Aldo Rell'))).toHaveLength(6);
    expect(rendered.filter((line) => line.includes('Bramwell'))).toHaveLength(6);
    expect(rendered.filter((line) => line.includes('Kesthorne'))).toHaveLength(5);
  });

  test('the band table and the reason are the annex\'s too, and the band map is closed at three', () => {
    // The `{outcome_phrase}` fills are AUTHORED WORDS keyed by a typed outcome, not a dial, and
    // they are joined to the document exactly as the sentences are.
    expect(CHANCE_MEETING_OUTCOME_PHRASES).toEqual(annexBands());
    expect(Object.keys(CHANCE_MEETING_OUTCOME_PHRASES)).toEqual(['bond', 'respect', 'rivalry']);
    expect(Object.isFrozen(CHANCE_MEETING_OUTCOME_PHRASES)).toBe(true);
    // ⛔ THE THREE ABSENT OUTCOMES ARE ABSENT BY CONSTRUCTION. ENC-3's seam mints no seed for
    // `nothing`, `compromised` or `rejected`, so a fill for any of them would be a word no
    // producer can reach — the dead-arm class, refused rather than carried for symmetry.
    for (const band of ['nothing', 'compromised', 'rejected', 'exposed']) {
      expect(CHANCE_MEETING_OUTCOME_PHRASES[band]).toBeUndefined();
    }
    // The reason limb of the NEWS ADDRESS LAW is the annex's own clause, byte-for-byte.
    expect(CHANCE_MEETING_REASON).toBe(annexReason());
    expect(CHANCE_MEETING_REASON.length).toBeGreaterThan(40);
    // anchored: the equality and the length above prove this is the live annex clause, not '' .
    expect(CHANCE_MEETING_REASON).not.toMatch(/[—!]|chance\W+meeting|meeting\W+chance/i);
  });

  test('THE FIRST-MATCH LAW: every document anchor this walker rides matches exactly once', () => {
    // A substring document pin retargets SILENTLY when a second matching heading appears (the
    // recorded first-match hazard). Both slice anchors and the kind heading are asserted single
    // here, and the mutants below prove the guard fires rather than decorating.
    expect(() => anchoredOnce(ANNEX_SOURCE, /^## §A ENC-4(?=[ \n])/gm, 'ENC-4 §A section')).not.toThrow();
    expect(() => anchoredOnce(ANNEX_SOURCE, /^## §B ENC-4(?=[ \n])/gm, 'terminator')).not.toThrow();
    const hits = [...ANNEX_SOURCE.matchAll(new RegExp(`^### ${ANNEX_KIND}(?= )`, 'gm'))];
    expect(hits, `${ANNEX_KIND}: annex heading count`).toHaveLength(1);
    // ⭐ AND THE KIND ID IS THE ANNEX'S OWN. The FAITH volume heads its pools with descriptive
    // placeholders and needs a two-spelling join; this sealed file already carries the canonical
    // spelling, so the join is an EQUALITY and is asserted rather than assumed.
    expect(ANNEX_KIND).toBe(CHANCE_MEETING_KINDS[0]);
  });

  test('MUTANT — a duplicated section heading throws instead of retargeting the slice', () => {
    const doctored = `${ANNEX_SOURCE}\n## §A ENC-4 — A SECOND HEADING NOBODY NOTICED\n`;
    expect(() => annexBlocks(doctored)).toThrow(/expected exactly 1 match/);
  });

  test('MUTANT — a rotted kind heading throws instead of returning an empty pool', () => {
    const doctored = ANNEX_SOURCE.replace(`### ${ANNEX_KIND} (ENC-4)`, `### ${ANNEX_KIND}X (ENC-4)`);
    // anchored by execution: the UNdoctored source resolves this exact kind to six lines one line
    // below, so a reader that had stopped resolving anything would fail there rather than let
    // this throw-pin pass for the wrong reason.
    expect(() => annexBlocks(doctored)).toThrow(/expected exactly 1 match/);
    expect(annexBlocks(ANNEX_SOURCE).rows).toHaveLength(6);
  });

  test('MUTANT — a lost slot-declaration block throws instead of silently merging the two lists', () => {
    // The defect THIS file's block split exists to prevent: without the marker the shared
    // extractor would read twelve numbered rows as one twelve-variant pool, and the arity join
    // would compare a pool against itself.
    const doctored = ANNEX_SOURCE.replace(SLOTS_MARKER, '**Per-variant slot notes**');
    expect(() => annexBlocks(doctored)).toThrow(/no "\*\*Per-variant required slots\*\*" block/);
    // The control: the undoctored source really does split into six and six.
    const live = annexBlocks(ANNEX_SOURCE);
    expect([live.rows.length, live.declared.length]).toEqual([6, 6]);
  });

  test('the desk-bearing row files one desk, carries one phrase, and mints no letter row', () => {
    const row = CHANCE_MEETING_KIND_REGISTRY[0];
    // THE POSITIVE CONTROLS COME FIRST, because every claim below is only a measurement if the
    // readers it is read against are alive and populated on this run.
    expect(Object.keys(WHAT_PHRASES).length).toBeGreaterThan(1);
    expect(Object.keys(KIND_SECTION).length).toBeGreaterThan(1);
    expect(SECTION_OF(row.kind)).toBe('events');
    expect(row.section).toBe('events');
    // ⛔ EXPLICITLY ROUTED, NOT MERELY CATCH-ALL-ROUTED, AND THIS IS ROAD B'S WHOLE POINT. The
    // events desk is the Herald's explicit catch-all, so `SECTION_OF` answers 'events' for a
    // token nobody filed — the desk answer alone cannot tell a registered kind from an unfiled
    // one. This is the arm that separates them, and it is the refusal of the free prefix.
    expect(isExplicitlyRouted(row.kind)).toBe(true);
    // The control that gives the line above its teeth: an unfiled token gets the same desk and
    // fails the same arm.
    expect(SECTION_OF('a_kind_that_will_never_exist_zzz')).toBe('events');
    expect(isExplicitlyRouted('a_kind_that_will_never_exist_zzz')).toBe(false);
    // The reader phrase is real prose, the chair's AMENDED §C noun phrase, not the de-underscored
    // engine token the fallback returns.
    expect(WHAT_PHRASES[row.kind]).toBe('a meeting no court arranged');
    // ⛔ NO CHRONICLE FILING IS CLAIMED. The annex files a Herald desk and names no letter
    // section; the routing walker asserts KIND_SECTION → routed and never the reverse, so a row
    // here would claim a filing the corpus never made.
    // anchored: the populated-map control above proves KIND_SECTION is alive on this run.
    expect(KIND_SECTION).not.toHaveProperty(row.kind);
  });

  test('the eligible set is exactly six with every slot supplied and five without a home', () => {
    const [[kind]] = EXPECTED;
    const whole = reachableIndexes(kind, SUPPLIABLE);
    // ⛔ BOTH ARMS OR NOTHING. Asserting only that six are reachable would pass just as happily
    // against a filter that had STOPPED filtering; the second arm is what proves the eligibility
    // axis is live, and this corpus has no slot without a supplier to prove it with, so the
    // control WITHHOLDS one.
    expect(whole).toEqual([0, 1, 2, 3, 4, 5]);
    const withoutHome = reachableIndexes(kind, WITHOUT_HOME);
    expect(withoutHome).toEqual([...HOME_LESS_INDEXES]);
    // The withheld slot is named BY INDEX rather than by count, so a corpus edit that moved
    // `{home}` into a different variant reds instead of counting to one again.
    const row = CHANCE_MEETING_KIND_REGISTRY[0];
    expect(row.requiredSlots
      .map((slots, index) => (slots.includes('home') ? -1 : index))
      .filter((index) => index >= 0)).toEqual([...HOME_LESS_INDEXES]);
  });

  test('the keyed pick is deterministic and the pool genuinely spreads', () => {
    const [[kind]] = EXPECTED;
    // Same key, same sentence — forever. THE PROMISE, asserted on the registry's own picker.
    expect(chanceMeetingLine(kind, 'k::a::b', SUPPLIABLE)).toEqual(chanceMeetingLine(kind, 'k::a::b', SUPPLIABLE));
    // …and DIFFERENT keys really do reach different variants, or the determinism above would be
    // the determinism of a picker that answers one sentence to everything.
    const spread = new Set(reachableIndexes(kind, SUPPLIABLE));
    expect(spread.size).toBeGreaterThanOrEqual(2);
    // THE CURED SPELLING IS OBSERVABLE, not merely commented: an `fnv % length` pick aliases onto
    // a parity class, so all six eligible indexes would not be reachable. All six are.
    expect(spread.size).toBe(6);
  });

  test('the writer carries the NEWS ADDRESS LAW\'s whole chain, and the presentation pair is the landed one', () => {
    const entry = entryOf();
    expect(entry).toBeTruthy();
    // ADDRESS — the host and BOTH courts, deduped, plus both people.
    expect(entry.settlementIds).toEqual(['bramwell', 'kesthorne']);
    expect(entry.settlementNames).toEqual(['Bramwell', 'Kesthorne']);
    expect(entry.npcIds).toEqual(['npc:kesthorne:1', 'npc:bramwell:4']);
    expect(String(entry.sourceEventId)).toMatch(/^chance_meeting_receipt\.chance_meeting_recorded\.[0-9a-f]{16}$/);
    // TYPED ACTION — the registered token, spelled as a literal so a raw-text walker can see it,
    // and pinned EQUAL to the registry row so the two spellings cannot drift apart.
    expect(entry.impactKind).toBe(CHANCE_MEETING_KINDS[0]);
    expect(entry.kind).toBe(CHANCE_MEETING_KINDS[0]);
    expect(isExplicitlyRouted(String(entry.impactKind))).toBe(true);
    // NAMES — both people inside the authored sentence, both courts beside the ids.
    expect(entry.headline).toContain('Sera Vane');
    expect(entry.headline).toContain('Aldo Rell');
    // REASON — the annex's clause, sentence-cased at the render exactly as the pool is.
    expect(entry.reasons).toEqual([`${CHANCE_MEETING_REASON.charAt(0).toUpperCase()}${CHANCE_MEETING_REASON.slice(1)}`]);
    expect(entry.summary).toBe(entry.reasons[0]);
    // THE GOVERNED METADATA rides the registry row rather than a second opinion.
    expect(entry.significance).toBe('notable');
    expect(entry.section).toBe('events');
    expect(entry.audience).toBe('public');
    expect(entry.familyId).toMatch(/^chance_meeting_recorded\.[1-6]$/);
    // THE PRESENTATION PAIR is `envoyNews.js`'s `notable` row, transcribed under GR-4B §6.2's
    // ruling and asserted BESIDE the row's class so the constant cannot outlive it.
    expect(CHANCE_MEETING_PRESENTATION).toEqual({ severity: 0.56, score: 58 });
    expect(entry.severity).toBe(CHANCE_MEETING_PRESENTATION.severity);
    expect(entry.score).toBe(CHANCE_MEETING_PRESENTATION.score);
    // THE WIZARD-NEWS AUTHORING WALL's three required fields, asserted at the value level here as
    // well as structurally there.
    expect(String(entry.id)).toMatch(/^wizard_news\.41\.chance_meeting_recorded\.[0-9a-f]{16}$/);
    expect(Array.isArray(entry.settlementIds) && entry.settlementIds.length).toBeTruthy();
    expect(typeof entry.severity).toBe('number');
  });

  test('the public reference is COLLISION-FREE and leaks no errand handle', () => {
    // ⛔⛔ BOTH DEFECTS WERE MEASURED AT THE DOCK, NOT IMAGINED. A meeting key is built from the
    // errand id and runs past `stablePart`'s eighty-character cap, so slugging it did TWO wrong
    // things at once: it published an internal errand handle on a reader surface, and it made two
    // DIFFERENT meetings between long-named towns share an id. `appendWizardNewsEntries` dedupes
    // by id, so the second line would have been swallowed in silence.
    const long = 'chance_meeting:68:envoy_errand:17:northharrowfield::southharrowfield';
    const left = entryOf({ id: `${long}|7:northharrowfield|8:southharrowfield|1:4` });
    const right = entryOf({ id: `${long}|7:northharrowfield|9:eastharrow|2:9` });
    // The positive control: both really built, so the inequality below is between two entries.
    expect([left, right].filter(Boolean)).toHaveLength(2);
    // THE CONTROL THAT MAKES THE INEQUALITY MEAN SOMETHING: these two keys are IDENTICAL under
    // the slug this builder used to carry, so a builder that regressed to it reds here.
    expect(left.id).not.toBe(right.id);
    // anchored: both entries are asserted built two lines above, so this is a real id string.
    expect(String(left.id)).not.toMatch(/envoy_errand|northharrowfield/);
    // anchored: same two built entries — the public source ref is asserted non-empty below.
    expect(String(left.sourceEventId)).not.toMatch(/envoy_errand|northharrowfield/);
    expect(String(left.sourceEventId).length).toBeGreaterThan(20);
    // …and the reference is STABLE: the same meeting always publishes under the same handle.
    expect(entryOf({ id: `${long}|7:northharrowfield|8:southharrowfield|1:4` }).id).toBe(left.id);
  });

  test('the writer FAILS CLOSED on every seed it cannot voice honestly', () => {
    // The positive control first: the very same seed builds a real entry one line down, so each
    // null below is a closed door rather than a builder that answers nothing to everything.
    expect(entryOf()).toBeTruthy();
    // ⛔ THE THREE SILENT OUTCOMES. ENC-3 mints no seed for them; if one ever arrives it must not
    // be voiced by a fill this corpus never authored.
    expect(entryOf({ outcome: 'nothing' })).toBeNull();
    expect(entryOf({ outcome: 'compromised' })).toBeNull();
    expect(entryOf({ outcome: 'rejected' })).toBeNull();
    // ⛔ THE ANNEX'S §B KIND IS NOT THIS ROW'S, and the beat gate says so in values rather than
    // in a comment: the refusal that travelled has its own authored pool and no wiring today.
    expect(entryOf({ beat: 'approach_exposed' })).toBeNull();
    expect(entryOf({ beat: '' })).toBeNull();
    // ⛔ A HOLE IS WORSE THAN A SILENCE. One unresolved name and the whole line is withheld. The
    // stage writes an EMPTY STRING for a name it could not resolve rather than omitting the key,
    // so this is the exact shape a real unresolved address arrives in.
    expect(entryOf({ npcNames: ['Sera Vane', ''] })).toBeNull();
    expect(entryOf({ npcNames: ['', 'Aldo Rell'] })).toBeNull();
    expect(entryOf({ settlementNames: { kesthorne: 'Kesthorne', bramwell: '' } })).toBeNull();
    expect(entryOf({ settlementNames: { kesthorne: '', bramwell: 'Bramwell' } })).toBeNull();
    expect(entryOf({ npcNames: [] })).toBeNull();
    expect(entryOf({ settlementNames: {} })).toBeNull();
    // …and the builder survives being called with nothing at all rather than throwing into a pulse.
    expect(chanceMeetingEntry()).toBeNull();
    expect(chanceMeetingEntry({})).toBeNull();
  });

  test('the writer is a RECORD, not a mutation, and the same meeting always reads the same', () => {
    const entry = entryOf();
    // Same meeting id, same world, same sentence — forever. THE PROMISE at the writer.
    expect(entryOf()).toEqual(entry);
    // The three band fills each reach a real authored phrase, so the closed map is live at the
    // writer and not merely at the corpus.
    const bands = ['bond', 'respect', 'rivalry'].map((outcome) => entryOf({ outcome }).headline);
    expect(bands.filter(Boolean)).toHaveLength(3);
    for (const [band, fill] of Object.entries(CHANCE_MEETING_OUTCOME_PHRASES)) {
      expect(entryOf({ outcome: band, id: `chance_meeting:${band}` }).headline).toContain(fill);
    }
    // ⛔ IT CARRIES NO PATCH OF ANY KIND. The positive control above proves the entry is
    // populated, so these absences are the shape of the record and not an empty object.
    // anchored: id, headline, settlementIds and severity are all asserted present in the arms above.
    expect(entry).not.toHaveProperty('stressor');
    // anchored: same populated entry — a record carries no condition patch to apply.
    expect(entry).not.toHaveProperty('condition');
    // anchored: same populated entry — nothing here proposes a world change.
    expect(entry).not.toHaveProperty('proposalPayload');
    // anchored: same populated entry — no deltas, the stage already wrote every ledger it owns.
    expect(entry).not.toHaveProperty('deltas');
  });
});
