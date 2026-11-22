/**
 * WF-8a phrased-kind walker: the exact ONE-kind census of the FAITH registry, its
 * annex-authored five-variant pool, its governed metadata, and the desk-BEARING posture a
 * Chronicle obituary holds. This certifies presentation width only; it is not behavioral soak
 * evidence — the beat's own battery lives in tests/domain/patronFall.test.js.
 *
 * ⭐⭐ THE ANNEX PREDATES THE WAVE BY THREE WEEKS, AND THAT IS THE FINDING THIS FILE ENFORCES.
 * docs/content/RECEIPT_POOLS_FAITH.md was authored 2026-08-02 under SP-6 and verifier-passed
 * 2026-08-03 — one hundred three kinds at seven hundred thirty-six variants — and NOTHING in the
 * tree read a line of it until this member. `faith.extinction.last_altar` is the settlement
 * obituary's governed pool, and `faithReceiptPools.js` is its transcription. This walker
 * re-derives the whole pool from the DOCUMENT on every run through the shared fail-closed
 * reader, so the transcription cannot fork from the corpus in either direction.
 *
 * ⚠ THE KIND ID IS THIS WAVE'S AND THE SENTENCES ARE THE ANNEX'S, so the join between the two
 * spellings is itself a pin: the annex heads the pool `faith.extinction.last_altar` (its own
 * preface calls those ids "DESCRIPTIVE placeholders … the canonical spelling of every id is
 * minted by the wave that mints the kind"), and the registry spells it `faith_last_altar_dark`.
 * Neither side can drift alone while ANNEX_KIND and the registry census are both asserted here.
 *
 * ⭐⭐ THE REGISTRATION SHAPE IS DELIBERATE AND IT IS A CENSUS FACT, NOT A STYLE. ONE literal
 * `describe`, straight-line literal `test` calls, no table-driven registration, no nesting,
 * nothing skipped. A table-driven case is invisible to the estate-wide lighting census by
 * construction and parks the WHOLE FILE, so the census arithmetic would still close while
 * `credited` silently failed to move.
 *
 * ⚠ THE ANNEX URL IS DECLARED HERE RATHER THAN IN tests/helpers/receiptAnnex.js, and that is a
 * scope decision rather than a fork: the shared module owns the READER (the address-lie and
 * first-match cures), which this file uses unmodified; only the volume's own path literal lives
 * here, because adding a sixth exported URL constant would put this member one file over its
 * chair-ruled handwritten-file override. The first SECOND consumer of the FAITH volume should
 * promote it to `FAITH_ANNEX_URL` beside its five siblings.
 *
 * ⛔ THE FAITH VOLUME'S REGISTER PERMITS THE EM-DASH — its §B says so in terms ("semicolons and
 * em-dashes") — so this file does NOT copy the INFORMATION walker's no-em-dash scan. It scans
 * the laws this volume actually declares: no digits, no exclamation, no unresolved slot.
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import { anchoredOnce, receiptAnnexPool } from '../helpers/receiptAnnex.js';
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
  FAITH_KIND_REGISTRY,
  FAITH_KINDS,
  FAITH_NEWS_TUNING,
  faithLine,
  faithReceipt,
} from '../../src/domain/worldPulse/faithNews.js';
// ⛔ THE CORPUS MODULE IS IMPORTED DIRECTLY AND THE IMPORT IS LOAD-BEARING TWICE OVER. It lets
// the census below pin the registry's pool IDENTICAL to the corpus module's own export, so a
// registry that had inlined its sentences would red here rather than passing on a pool that
// merely renders the same; and it is what gives faithReceiptPools.js AUTO lit coverage in
// tests/property/mechanismLitCoverage.test.js, which is why this member owes that walker's
// shrink-only baseline no debt row at all.
import { FAITH_RECEIPTS } from '../../src/domain/worldPulse/faithReceiptPools.js';

/** kind, significance, audience, desk, authored depth. */
const EXPECTED = Object.freeze([
  ['faith_last_altar_dark', 'major', 'public', 'faith', 5],
]);

/** The annex's own descriptive heading for this pool, and the wave's canonical spelling. */
const ANNEX_KIND = 'faith.extinction.last_altar';
/** The wave's own slice anchors inside the FAITH volume. */
const SECTION = '## §D WF-1';
const UNTIL = '## §E WF-2';
const ANNEX_URL = new URL('../../docs/content/RECEIPT_POOLS_FAITH.md', import.meta.url);
const ANNEX_SOURCE = readFileSync(ANNEX_URL, 'utf8');

/** Slots the deletion seam can actually supply: the creed's name and the settlement's. */
const SUPPLIABLE = Object.freeze({ creed: 'the Lady of Harvests', settlement: 'Bramwell' });
/** The same, plus the slot no supplier exists for — the second arm of the eligibility control. */
const WITH_TEMPLE = Object.freeze({ ...SUPPLIABLE, temple: 'the Grey Chapel' });

/** Every slot the §D obituary block declares, so the sentinel probe can see all three. */
const ALL_SLOTS = Object.freeze(['creed', 'settlement', 'temple']);
/** Markers no authored sentence contains, so a surviving one names the slot that placed it. */
const SENTINEL = Object.freeze(Object.fromEntries(ALL_SLOTS.map((slot) => [slot, `<<${slot}>>`])));

/**
 * The one variant the deletion seam can never reach, by ZERO-BASED index into the authored pool:
 * the annex's numbered variant two, the only one that names a temple. The seam reads a creed
 * name and a settlement name off state that is about to be deleted, and nothing in that scope
 * knows which house held the rite.
 */
const TEMPLE_ONLY_INDEXES = Object.freeze([1]);

/**
 * The shared, fail-closed annex read: line-anchored headings asserted to occur EXACTLY once, and
 * a throw instead of the empty array that made the address-lie class invisible.
 * @param {string} kind @param {Record<string,string>} interp
 */
function annexPool(kind, interp) {
  return receiptAnnexPool(kind, {
    source: ANNEX_SOURCE, section: SECTION, until: UNTIL, interp, annex: 'faith',
  });
}

/** Every template index a caller can actually REACH under one interpolation. */
function reachableIndexes(kind, interp, draws = 400) {
  const seen = new Set();
  for (let draw = 0; draw < draws; draw += 1) {
    const line = faithLine(kind, `wf-8a:${draw}`, interp);
    if (line) seen.add(line.templateIndex);
  }
  return [...seen].sort((a, b) => a - b);
}

describe('SP-6 phrased-kind registry — WF-8a the FAITH settlement obituary', () => {
  test('the one-kind census and every reader join are exact', () => {
    expect(FAITH_KINDS).toEqual(EXPECTED.map(([kind]) => kind));
    expect(FAITH_KIND_REGISTRY).toHaveLength(1);
    for (const [kind, significance, audience, section, depth] of EXPECTED) {
      const row = FAITH_KIND_REGISTRY.find((candidate) => candidate.kind === kind);
      expect(row).toMatchObject({ kind, significance, audience, section });
      expect(row.pool).toHaveLength(depth);
      expect(row.requiredSlots).toHaveLength(depth);
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.requiredSlots)).toBe(true);
      // Five authored variants clear the derived `major` floor of four OUTRIGHT, which is why
      // this row needs no declared floor exception — asserted against the derived table rather
      // than a re-typed number.
      expect(row.pool.length).toBeGreaterThanOrEqual(FREQUENCY_FLOORS[significance]);
      // ⛔ THE REGISTRY READS THE CORPUS MODULE, it does not carry its own copy. Without this
      // the annex equality two tests below would still pass over an inlined array that happened
      // to render the same sentences, and the corpus module would have no consumer at all.
      expect(row.pool).toBe(FAITH_RECEIPTS[kind]);
      // THE FIVE TYPED JOINS AS ONE VALUE. A deleted clause changes this array rather than
      // merely relaxing a bound; both readers are handed in, so a row that LOST its phrase or
      // acquired a different desk reds here instead of being read as compliant forever.
      expect(registrationReasons(row, { sectionOf: SECTION_OF, phrases: WHAT_PHRASES })).toEqual([]);
    }
    // THE SHARED TEMPLATE'S OWN CONTROLS, executed here rather than inherited: a two-variant
    // chronic kind is exactly as broken as an unregistered one, and the predicate says so in
    // values. The compliant probe is what stops a predicate that reddened everything from
    // satisfying both negatives.
    expect(floorReasons(UNREGISTERED_PROBE)).toEqual(['starved']);
    expect(floorReasons(CHRONIC_TWO_VARIANT_PROBE)).toEqual(['starved']);
    expect(floorReasons(CHRONIC_COMPLIANT_PROBE)).toEqual([]);
    // THE REGISTRY IS CLOSED AND WHOLLY PUBLIC. Asserted as emptiness of the complement rather
    // than per-row, so a SECOND row arriving covert reds here instead of slipping past a loop
    // written for one kind.
    expect(FAITH_KIND_REGISTRY.filter((row) => row.audience !== 'public')).toEqual([]);
    expect(faithLine('faith_unknown_kind', 'seed', WITH_TEMPLE)).toBeNull();
    // Read against a call known to ANSWER, so the null above is a closed door rather than a
    // picker that returns nothing for everything.
    expect(faithLine('faith_last_altar_dark', 'seed', WITH_TEMPLE)).toBeTruthy();
  });

  test('the pool is the annex\'s, verbatim and in order, and the annex decides the arity', () => {
    const row = FAITH_KIND_REGISTRY[0];
    const rendered = row.pool.map((variant) => (
      typeof variant === 'function' ? String(variant(WITH_TEMPLE)) : String(variant)
    ));
    expect(rendered).toEqual(annexPool(ANNEX_KIND, WITH_TEMPLE).lines);
    expect(new Set(rendered).size).toBe(row.pool.length);
    // THE ORTHOGONAL WITNESS. Each variant's slot set is derived from the DOCUMENT — render the
    // annex under markers no sentence contains, then read back which survived — and pinned
    // against the registry's parallel array. A registry whose arity drifted from the corpus reds
    // here even though both would still render five sentences.
    const fromAnnex = annexPool(ANNEX_KIND, SENTINEL).lines
      .map((line) => ALL_SLOTS.filter((slot) => line.includes(SENTINEL[slot])));
    expect(fromAnnex).toEqual(row.requiredSlots.map((slots) => [...slots]));
    // …and the witness is only a witness if it can DISAGREE: the sentinel render must really
    // differ from the plain one, or every arity above would read as the empty array.
    expect(fromAnnex.filter((slots) => slots.length > 0)).toHaveLength(5);
    for (const line of rendered) {
      expect(line).toBe(line.trim());
      expect(line.length).toBeGreaterThan(0);
      // `rendered` is pinned EQUAL to the annex lines and to the authored depth above, and each
      // line is pinned non-empty, so this loop always runs over real sentences. The pattern also
      // matches the word an absent slot renders, so a lost fill reds.
      // anchored: annex-equality, authored depth, and per-line non-emptiness above.
      expect(line).not.toMatch(/\d|%|×|_|\$\{|\bundefined\b|\bNaN\b/);
      // The FAITH volume's §B laws, read against sentences known to be live. ⛔ The em-dash is
      // NOT scanned here: this volume's register declares it, unlike the INFORMATION annex's.
      // anchored: same liveness — the rendered set is annex-equal and non-empty above.
      expect(line).not.toMatch(/!|\b(?:believe|believes|thinks|perceive)\b/i);
    }
  });

  test('the annex address of the pool is the FAITH volume, not a legacy forward', () => {
    // The census, not a bare absence pin: the kind must RESOLVE (the shared reader throws on a
    // rotted or duplicated heading) and the resolution must land in the FAITH volume. If a later
    // merge forwards this pool to the legacy annex, this reddens instead of the pool silently
    // reading as stale sentences.
    expect(annexPool(ANNEX_KIND, WITH_TEMPLE).from).toBe('faith');
    expect(annexPool(ANNEX_KIND, WITH_TEMPLE).lines).toHaveLength(5);
  });

  test('THE FIRST-MATCH LAW: every document anchor this walker rides matches exactly once', () => {
    // A substring document pin retargets SILENTLY when a second matching heading appears (the
    // recorded first-match hazard). Both slice anchors and the kind heading are asserted single
    // here, and the two mutants below prove the guard fires rather than decorating.
    expect(() => anchoredOnce(ANNEX_SOURCE, /^## §D WF-1(?=[ \n])/gm, 'WF-1 section')).not.toThrow();
    expect(() => anchoredOnce(ANNEX_SOURCE, /^## §E WF-2(?=[ \n])/gm, 'terminator')).not.toThrow();
    const hits = [...ANNEX_SOURCE.matchAll(new RegExp(`^### ${ANNEX_KIND.replace(/\./g, '\\.')}(?= )`, 'gm'))];
    expect(hits, `${ANNEX_KIND}: annex heading count`).toHaveLength(1);
  });

  test('MUTANT — a duplicated section heading throws instead of retargeting the slice', () => {
    const doctored = `${ANNEX_SOURCE}\n## §D WF-1 — A SECOND HEADING NOBODY NOTICED\n`;
    expect(() => receiptAnnexPool(ANNEX_KIND, {
      source: doctored, section: SECTION, until: UNTIL, interp: WITH_TEMPLE, annex: 'faith',
    })).toThrow(/expected exactly 1 match/);
  });

  test('MUTANT — a rotted kind heading throws instead of returning an empty pool', () => {
    const doctored = ANNEX_SOURCE.replace(`### ${ANNEX_KIND} (WF-1)`, `### ${ANNEX_KIND}X (WF-1)`);
    // anchored: the UNdoctored source resolves this exact kind to five lines one line below, so
    // a reader that had stopped resolving anything at all would fail there rather than let this
    // throw-pin pass for the wrong reason.
    expect(() => receiptAnnexPool(ANNEX_KIND, {
      source: doctored, section: SECTION, until: UNTIL, interp: WITH_TEMPLE, annex: 'faith',
    })).toThrow(/expected exactly 1 match/);
    expect(annexPool(ANNEX_KIND, WITH_TEMPLE).lines).toHaveLength(5);
  });

  test('the desk-bearing row files one desk, carries one phrase, and holds one letter section', () => {
    const row = FAITH_KIND_REGISTRY[0];
    // THE POSITIVE CONTROLS COME FIRST, because every claim below is only a measurement if the
    // readers it is read against are alive and populated on this run.
    expect(Object.keys(WHAT_PHRASES).length).toBeGreaterThan(1);
    expect(Object.keys(KIND_SECTION).length).toBeGreaterThan(1);
    expect(SECTION_OF(row.kind)).toBe('faith');
    expect(row.section).toBe('faith');
    // ⛔ EXPLICITLY ROUTED, NOT MERELY PREFIX-ROUTED. The `faith_` family prefix would answer
    // 'faith' for a token nobody filed, so the desk answer alone cannot tell a registered kind
    // from an unfiled one; this is the arm that separates them.
    expect(isExplicitlyRouted(row.kind)).toBe(true);
    // The reader phrase is real prose, not the de-underscored engine token the fallback returns.
    expect(WHAT_PHRASES[row.kind]).toBe('a creed\'s last altar gone dark');
    // The Chronicle filing the annex names, and its SPLIT: `traditions` corresponds to
    // faith|events, so the letter row and the Herald desk agree without a divergence row.
    expect(KIND_SECTION[row.kind]).toBe('traditions');
  });

  test('the eligible set is exactly four without a temple and exactly five with one', () => {
    const [[kind]] = EXPECTED;
    const withoutTemple = reachableIndexes(kind, SUPPLIABLE);
    // ⛔ BOTH ARMS OR NOTHING. Asserting only that four are reachable would pass just as happily
    // against a filter that had STOPPED filtering and a pool that had lost a variant: four is a
    // stable number either way. The second arm is what separates "the temple slot has no
    // supplier" from "the eligibility axis is broken".
    expect(withoutTemple).toHaveLength(4);
    expect(withoutTemple.filter((index) => TEMPLE_ONLY_INDEXES.includes(index))).toEqual([]);
    expect(reachableIndexes(kind, WITH_TEMPLE)).toEqual([0, 1, 2, 3, 4]);
    // The unreachable variant is named BY INDEX rather than by count, so a corpus edit that
    // moved the temple into a different variant reds instead of counting to four again.
    const row = FAITH_KIND_REGISTRY[0];
    expect(row.requiredSlots
      .map((slots, index) => (slots.includes('temple') ? index : -1))
      .filter((index) => index >= 0)).toEqual([...TEMPLE_ONLY_INDEXES]);
    // ⭐ AND THE REACHABLE FOUR ARE EXACTLY THE DERIVED FLOOR, which is why the corpus is a full
    // authored pool at the seam rather than a reachable remainder.
    expect(withoutTemple).toHaveLength(FREQUENCY_FLOORS.major);
  });

  test('the keyed pick is deterministic and the pool genuinely spreads', () => {
    const [[kind]] = EXPECTED;
    // Same key, same sentence — forever. THE PROMISE, asserted on the registry's own picker.
    expect(faithLine(kind, 'k::a::b', SUPPLIABLE)).toEqual(faithLine(kind, 'k::a::b', SUPPLIABLE));
    // …and DIFFERENT keys really do reach different variants, or the determinism above would be
    // the determinism of a picker that answers one sentence to everything. The witness keys are
    // derived by execution rather than authored.
    const spread = new Set(reachableIndexes(kind, SUPPLIABLE));
    expect(spread.size).toBeGreaterThanOrEqual(2);
    // THE CURED SPELLING IS OBSERVABLE, not merely commented: an `fnv % length` pick aliases
    // onto a parity class, so the four eligible indexes would not all be reachable. All four are.
    expect(spread.size).toBe(4);
  });

  test('the one authored tuning value sits below the major-entry line, and the axes are separate', () => {
    // ⛔ THE TWO SIGNIFICANCE AXES ARE DISTINCT INSTRUMENTS, and this is the arm the packet's §6
    // battery obligation names. The KIND's cadence class is `major` (the pool-floor axis: how
    // OFTEN a reader meets the beat). The ENTRY's significance is decided by severity against
    // newsEntryForOutcome's 0.72 line, and 0.5 is deliberately below it, so the obituary surfaces
    // as a `notable` RECORD rather than an alarm. Nothing ties one axis to the other: the row's
    // significance and the tuning value are read from different modules and neither derives the
    // other, which is asserted here by holding both and comparing them.
    expect(FAITH_NEWS_TUNING.LAST_ALTAR_SEVERITY).toBe(0.5);
    expect(Object.isFrozen(FAITH_NEWS_TUNING)).toBe(true);
    expect(FAITH_KIND_REGISTRY[0].significance).toBe('major');
    expect(FAITH_NEWS_TUNING.LAST_ALTAR_SEVERITY).toBeLessThan(0.72);
    // The receipt really carries the tuned value through to the outcome, so the constant is a
    // live dial rather than an exported number nothing reads.
    const receipt = faithReceipt({
      cid: 'z', settlementName: 'Bramwell', ref: 'custom:lu_lady', creedName: 'the Lady of Harvests', tick: 4,
    });
    expect(receipt.severity).toBe(FAITH_NEWS_TUNING.LAST_ALTAR_SEVERITY);
    expect(receipt.candidateType).toBe(FAITH_KINDS[0]);
    expect(receipt.affectedSettlementIds).toEqual(['z']);
    // ⛔ IT IS A RECORD, NEVER A MUTATION. The positive control above proves the receipt is
    // populated, so these absences are the shape of the outcome and not an empty object.
    // anchored: severity, candidateType and affectedSettlementIds are asserted present above.
    expect(receipt).not.toHaveProperty('stressor');
    // anchored: same populated receipt — the three positives above are on this exact object.
    expect(receipt).not.toHaveProperty('deityReembed');
    // anchored: same populated receipt; a record carries no condition patch to apply.
    expect(receipt).not.toHaveProperty('condition');
  });

  test('the DEITY DOCTRINE is asserted on the rendered corpus, never assumed', () => {
    const row = FAITH_KIND_REGISTRY[0];
    const rendered = row.pool.map((variant) => (
      typeof variant === 'function' ? String(variant(WITH_TEMPLE)) : String(variant)
    ));
    // The positive control first: the sentences really name the creed and the settlement, so the
    // absences below are read against prose that could have carried a divine act and does not.
    expect(rendered.filter((line) => line.includes('the Lady of Harvests'))).toHaveLength(4);
    expect(rendered.filter((line) => line.includes('Bramwell'))).toHaveLength(4);
    for (const line of rendered) {
      // Faith is CULTURAL, never theological: the subject is the altar, the roster, the parish,
      // the undercroft — what the PEOPLE stopped keeping. No line may confirm that a god acted.
      // anchored: the two populated-corpus controls above prove these are real sentences naming real parties.
      expect(line).not.toMatch(/\b(?:god|goddess|deity|divine|smote|forsook|abandoned by|departed|withdrew)\b/i);
      // …and no engine slug reaches an authored sentence.
      // anchored: same populated corpus — every line is annex-equal and names both parties.
      expect(line).not.toMatch(/custom:|_deityRef|lu_/);
    }
  });
});
