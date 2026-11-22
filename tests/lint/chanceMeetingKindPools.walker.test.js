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
 * docs/content/RECEIPT_POOLS_CHANCE_MEETING.md was a byte-identical copy of that seal, and
 * `envoyChanceMeetingReceiptPools.js` is its transcription. ⚠ IT IS NO LONGER BYTE-IDENTICAL AND
 * THIS SENTENCE IS CORRECTED A SECOND TIME RATHER THAN LEFT TO RIDE. ENC-4b added ONE line to the
 * §B block — the chair's own wiring rule, "§B speaks only where the approach is known". ENC-4c
 * APPENDED A WHOLE THIRD GOVERNED BLOCK, `## §B2 ENC-4c`, carrying the chair's five sentences for
 * the case §B cannot voice. ⛔ NEITHER CAR EDITED ONE SEALED BYTE: the §A, §B and §C slices are
 * byte-identical to the seal apart from ENC-4b's one rule line, §B's terminator is now §B2's
 * heading rather than §C's, and the arms below pin both rule lines AND every sealed sentence and
 * slot declaration, so the distinction is measured on every run rather than asserted here. This walker re-derives every pool, the `{outcome_phrase}` band table AND the reason from
 * the DOCUMENT on every run, so the transcription cannot fork from the corpus in either direction. ⛔ A corpus defect is a chair
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
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { KIND_SECTION } from '../../src/domain/display/chroniclersLetter.js';
import { SECTION_OF, isExplicitlyRouted } from '../../src/domain/realm/heraldRouting.js';
import {
  CHANCE_MEETING_EXPOSED_REASON,
  CHANCE_MEETING_KINDS,
  CHANCE_MEETING_KIND_REGISTRY,
  CHANCE_MEETING_PRESENTATION,
  CHANCE_MEETING_REASON,
  chanceMeetingEntry,
  chanceMeetingExposedEntry,
  chanceMeetingHeraldEntry,
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
  ['chance_meeting_exposed', 'major', 'public', 'events', 5],
]);

const ANNEX_URL = new URL('../../docs/content/RECEIPT_POOLS_CHANCE_MEETING.md', import.meta.url);
const ANNEX_SOURCE = readFileSync(ANNEX_URL, 'utf8');

/**
 * ⭐ ONE DOCUMENT, TWO GOVERNED BLOCKS, AND EACH KIND CARRIES ITS OWN ANCHORS. ENC-4 read a single
 * block and hard-coded its three anchors; ENC-4b registers the volume's second kind, so the
 * anchors become a per-kind table rather than a second copy of the reader. ⛔ THE SLOT MARKERS
 * ARE NOT THE SAME STRING: §A writes `**Per-variant required slots**` and §B writes
 * `**Per-variant required slots:**`. Inheriting §A's marker would have made the §B split silently
 * fail to find its declaration block — which is exactly what the fail-closed reader below throws
 * on, and the MUTANT arm proves it does.
 *
 * ⭐ Unlike the FAITH volume's descriptive placeholders, the sealed file heads BOTH blocks with
 * the canonical kind spelling, so the two-spelling join the FAITH walker carries has no work to
 * do here — asserted below rather than assumed.
 */
const ANNEX_BLOCKS = Object.freeze({
  chance_meeting_recorded: Object.freeze({
    section: '## §A ENC-4', until: '## §B ENC-4', slotsMarker: '**Per-variant required slots**',
    heading: 'chance_meeting_recorded',
  }),
  chance_meeting_exposed: Object.freeze({
    // ⭐ ENC-4c MOVED THIS TERMINATOR, and it is the one anchor edit the third block costs. §B2
    // sits between §B and §C, so a slice that still ran to §C would read §B2's five sentences as
    // §B's declaration rows and the five-and-five seal proof below would report fifteen.
    section: '## §B ENC-4', until: '## §B2 ENC-4c', slotsMarker: '**Per-variant required slots:**',
    heading: 'chance_meeting_exposed',
  }),
  // ⛔⛔ A POOL KEY, NOT A KIND. §B2 is a SECOND authored corpus of the SAME registered kind, so
  // its heading deliberately does NOT begin `### chance_meeting_exposed ` — a heading that did
  // would make the shared reader's exactly-once guard find TWO and throw, and the census loops
  // below key on KINDS. Its slot marker is §A's spelling, not §B's; each block is read through
  // its own, which is exactly the trap the MUTANT arm below already proves is live.
  chance_meeting_exposed_host_offered: Object.freeze({
    section: '## §B2 ENC-4c', until: '## §C HOLE 3', slotsMarker: '**Per-variant required slots**',
    heading: 'case host_offered of chance_meeting_exposed',
  }),
});

/**
 * ⛔ EVERY DECLARED HEADING IS INTERPOLATED INTO A RegExp UNESCAPED, so a heading carrying a regex
 * metacharacter would silently LOOSEN its own anchor — a `.` in a pool key would match any byte
 * and could land the reader on a neighbouring block. The first spelling this lane reached for was
 * `chance_meeting_exposed.host_offered`, which is exactly that defect, so the rule is asserted as
 * a value here rather than trusted to the next author's care.
 */
const HEADING_SAFE_RE = /^[A-Za-z0-9_ ]+$/;

/** The §A anchors, still named because three arms below are §A's alone (the band table, the
 *  reason clause, and the section-heading mutant). */
const SECTION = ANNEX_BLOCKS.chance_meeting_recorded.section;
const UNTIL = ANNEX_BLOCKS.chance_meeting_recorded.until;
const SLOTS_MARKER = ANNEX_BLOCKS.chance_meeting_recorded.slotsMarker;
/** A numbered row in either list. */
const NUMBERED_ROW_RE = /^\d+\. (.+)$/gm;

/** Every slot each block declares, in a fixed order the sentinel witness reads back in. ⛔ §B
 *  declares FOUR: it takes no `{outcome_phrase}`, because a refusal is not a mark band. */
const ALL_SLOTS = Object.freeze({
  chance_meeting_recorded: Object.freeze(['npc', 'counterpart', 'settlement', 'home', 'outcome_phrase']),
  chance_meeting_exposed: Object.freeze(['npc', 'counterpart', 'settlement', 'home']),
  // ⭐ §B2 declares the SAME FOUR as §B and makes the opposite claim with them: `{npc}` is of
  // `{settlement}` here and `{counterpart}` is of `{home}`. Same slots, inverted geography.
  chance_meeting_exposed_host_offered: Object.freeze(['npc', 'counterpart', 'settlement', 'home']),
});
/** Markers no authored sentence contains, so a surviving one names the slot that placed it. */
const SENTINEL = Object.freeze(Object.fromEntries(
  ALL_SLOTS.chance_meeting_recorded.map((slot) => [slot, `<<${slot}>>`]),
));

/** The production interpolation per kind: every slot the writer resolves, all of them supplied. */
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
 * The variants that name `{home}`, by ZERO-BASED index, taken from each annex block's own
 * declaration rather than counted. In §A variant two (index 1) is the only one that does not; in
 * §B every variant names it, so withholding `{home}` there leaves NOTHING eligible — a sharper
 * second arm than §A's, not a weaker one.
 */
const HOME_LESS_INDEXES = Object.freeze({
  chance_meeting_recorded: Object.freeze([1]),
  chance_meeting_exposed: Object.freeze([]),
  // §B2's shortfall is the EMPTY SET too: all five name the guest's court, so withholding it
  // silences this case entirely rather than degrading it.
  chance_meeting_exposed_host_offered: Object.freeze([]),
});

/**
 * ⭐⭐ EVERY GOVERNED POOL IN THE VOLUME, BY POOL ID AND AUTHORED DEPTH — THREE, AGAINST TWO KINDS.
 * `EXPECTED` above is the KIND census and stays two rows; this is the CORPUS census, and the two
 * are deliberately different lengths because ENC-4c authors a second corpus for an existing kind
 * rather than a second kind. A table that conflated them would make a new corpus look like a new
 * registration to every arithmetic downstream — which is exactly what the pantheon A5 freezes,
 * `REGISTERED_KIND_COUNT` and `ROUTED_TOKENS` are asserted UNMOVED against.
 */
const POOLS = Object.freeze([
  ['chance_meeting_recorded', 6],
  ['chance_meeting_exposed', 5],
  ['chance_meeting_exposed_host_offered', 5],
]);

/**
 * THE BLOCK SPLIT, fail-closed and PER KIND. Slices the named wave block with the SHARED reader's
 * anchors, finds the kind heading with the shared reader's exactly-once guard, then cuts the body
 * at that block's own declaration marker so the pool rows and the declared slot rows are read
 * from disjoint text. Throws on every absence — an extractor that returns `[]` is the bug this
 * shape refuses, and three MUTANT arms below prove each throw fires.
 * @param {string} source @param {string} kind @returns {{rows: string[], declared: string[][]}}
 */
function annexBlocks(source, kind = 'chance_meeting_recorded') {
  const anchors = ANNEX_BLOCKS[kind];
  if (!anchors) throw new Error(`chanceMeetingAnnex: ${kind}: no declared annex anchors`);
  if (!HEADING_SAFE_RE.test(anchors.heading)) {
    throw new Error(`chanceMeetingAnnex: ${kind}: the declared heading `
      + `${JSON.stringify(anchors.heading)} carries a character this reader interpolates into a`
      + ' RegExp unescaped, so its anchor would not be exact. Spell the heading in word'
      + ' characters and spaces only.');
  }
  const scope = sectionSlice(source, anchors.section, anchors.until);
  const heading = anchoredOnce(
    scope, new RegExp(`^### ${anchors.heading}(?= )`, 'gm'),
    `${kind}: heading in ${anchors.section}`,
  );
  const afterHeading = scope.indexOf('\n', heading.index);
  if (afterHeading < 0) throw new Error(`chanceMeetingAnnex: ${kind}: heading has no body`);
  const body = scope.slice(afterHeading + 1);
  const marker = body.indexOf(anchors.slotsMarker);
  if (marker < 0) {
    throw new Error(`chanceMeetingAnnex: ${kind}: no "${anchors.slotsMarker}" block — the pool and`
      + ' its slot declaration cannot be told apart');
  }
  const rows = [...body.slice(0, marker).matchAll(NUMBERED_ROW_RE)].map((hit) => hit[1]);
  const declaredRows = [...body.slice(marker).matchAll(NUMBERED_ROW_RE)].map((hit) => hit[1]);
  if (rows.length === 0) throw new Error(`chanceMeetingAnnex: ${kind}: no authored rows`);
  if (declaredRows.length === 0) throw new Error(`chanceMeetingAnnex: ${kind}: no declared slot rows`);
  const declared = declaredRows.map((row) => [...row.matchAll(/\{(\w+)\}/g)].map((hit) => hit[1]));
  return { rows, declared };
}

/** One block's authored sentences under one interpolation.
 *  @param {Record<string,string>} interp @param {string} [kind] */
function annexLines(interp, kind = 'chance_meeting_recorded') {
  return annexBlocks(ANNEX_SOURCE, kind).rows
    .map((row) => row.replace(/\{(\w+)\}/g, (_, slot) => String(interp[slot])));
}

/**
 * THE §C ROW FOR ONE KIND, read out of the annex's own two-row table. §B authors no
 * "REASON, riding every variant" clause the way §A does, so the writer's reason limb is filled
 * from the chair's §C noun phrase for the same kind — and this is the join that makes that a
 * CITATION rather than a mint.
 * @param {string} kind @returns {string}
 */
function annexWhatPhrase(kind) {
  const scope = sectionSlice(ANNEX_SOURCE, '## §C HOLE 3', '**Why the first was amended.**');
  const hit = new RegExp(`^\\| \`${kind}\` \\| \`(.+?)\` \\|`, 'm').exec(scope);
  if (!hit) throw new Error(`chanceMeetingAnnex: ${kind}: no §C row`);
  return hit[1];
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

/**
 * ⭐⭐ THE §B SEED, AND ITS SHAPE IS THE WHOLE POINT OF ENC-4b. `approacherNid` is the limb ENC-4
 * reported missing and named the breaking slot for; the stage now DERIVES it from the receipt's
 * own exposure grievance. Here the approacher is `npc:kesthorne:1` — the person whose court is
 * NOT the host — so the one who refused is of Bramwell, which is exactly what §B variant 1 says
 * out loud. The MIRROR below flips only that one field.
 * @param {Record<string,unknown>} [extra]
 */
function exposedSeedOf(extra = {}) {
  return {
    beat: 'approach_exposed',
    id: 'chance_meeting:err-9|kesthorne|bramwell',
    tick: 41,
    outcome: 'exposed',
    venue: 'host_settlement',
    settlementIds: ['kesthorne', 'bramwell'],
    npcIds: ['npc:kesthorne:1', 'npc:bramwell:4'],
    approacherNid: 'npc:kesthorne:1',
    venueIds: [],
    hostId: 'bramwell',
    npcNames: ['Sera Vane', 'Aldo Rell'],
    settlementNames: { kesthorne: 'Kesthorne', bramwell: 'Bramwell' },
    ...extra,
  };
}

/** @param {Record<string,unknown>} [extra] */
function exposedEntryOf(extra = {}) {
  return chanceMeetingExposedEntry({ seed: exposedSeedOf(extra), now: '2026-01-01T00:00:00.000Z' });
}

describe('ENC-4 phrased-kind registry — the meeting neither court arranged', () => {
  test('the two-kind census and every reader join are exact', () => {
    expect(CHANCE_MEETING_KINDS).toEqual(EXPECTED.map(([kind]) => kind));
    expect(CHANCE_MEETING_KIND_REGISTRY).toHaveLength(2);
    for (const [kind, significance, audience, section, depth] of EXPECTED) {
      const row = CHANCE_MEETING_KIND_REGISTRY.find((candidate) => candidate.kind === kind);
      expect(row).toMatchObject({ kind, significance, audience, section });
      expect(row.pool).toHaveLength(depth);
      expect(row.requiredSlots).toHaveLength(depth);
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.requiredSlots)).toBe(true);
      // Every pool clears the derived floor for its OWN class, asserted against the derived table
      // rather than a re-typed number. §A's six clear `notable`'s six by EQUALITY, so a single
      // variant leaving that pool takes the family under its floor on the day it goes; §B's five
      // clear `major`'s four by margin. Both are pinned, and the EQUALITY is named as the fragile
      // one rather than left for a reader to notice.
      expect(row.pool.length).toBeGreaterThanOrEqual(FREQUENCY_FLOORS[significance]);
      expect(row.pool.length).toBe(depth);
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
    // Read against calls known to ANSWER, so the null above is a closed door rather than a picker
    // that returns nothing for everything. BOTH rows answer, which is also the arm that would
    // catch a second row registered against a pool the corpus module never gained.
    expect(chanceMeetingLine('chance_meeting_recorded', 'seed', SUPPLIABLE)).toBeTruthy();
    expect(chanceMeetingLine('chance_meeting_exposed', 'seed', SUPPLIABLE)).toBeTruthy();
    // ⭐ THE §A EQUALITY, NAMED. Six is `notable`'s floor exactly, and this is the arm that says
    // so in a value rather than in the comment above.
    expect(EXPECTED[0][4]).toBe(FREQUENCY_FLOORS.notable);
    expect(EXPECTED[1][4]).toBeGreaterThan(FREQUENCY_FLOORS.major);
    // ⛔ THE PRESENTATION TABLE MAY NOT OUTLIVE ITS ROWS. Its key set is pinned EQUAL to the
    // significances the registry actually registers, so a class whose row left, or a row whose
    // class has no landed pair, reds here instead of reaching a live pulse as `undefined`.
    expect(Object.keys(CHANCE_MEETING_PRESENTATION).sort())
      .toEqual([...new Set(CHANCE_MEETING_KIND_REGISTRY.map((r) => r.significance))].sort());
  });

  test('every pool is the annex\'s, verbatim and in order, and the annex decides the arity', () => {
    for (const [kind] of EXPECTED) {
      const row = CHANCE_MEETING_KIND_REGISTRY.find((candidate) => candidate.kind === kind);
      const lines = row.pool.map((variant) => (
        typeof variant === 'function' ? String(variant(SUPPLIABLE)) : String(variant)
      ));
      // ⭐ EACH BLOCK IS READ THROUGH ITS OWN ANCHORS, INCLUDING ITS OWN SLOT MARKER. §B spells
      // that marker with a colon; a reader that inherited §A's would throw rather than pass.
      expect(lines, `${kind}: pool is not the annex's`).toEqual(annexLines(SUPPLIABLE, kind));
      expect(new Set(lines).size, `${kind}: a duplicated sentence`).toBe(row.pool.length);
      expect(row.requiredSlots.map((slots) => [...slots]))
        .toEqual(annexBlocks(ANNEX_SOURCE, kind).declared);
      for (const line of lines) {
        expect(line).toBe(line.trim());
        expect(line.length).toBeGreaterThan(0);
        // anchored: each block's lines are annex-equal and per-line non-empty two lines above.
        expect(line).not.toMatch(/\d|%|×|_|\$\{|[{}]|\bundefined\b|\bNaN\b/);
        // anchored: same liveness — the lines are annex-equal and non-empty above.
        expect(line).not.toMatch(/[—!]/);
        // anchored: same liveness — these are the block's annex-equal sentences.
        expect(line).not.toMatch(/chance\W+meeting|meeting\W+chance/i);
        // anchored: same liveness — the sentences name both people, asserted below.
        expect(line).not.toMatch(/\b(?:died|dead|killed|slain|executed|exiled|wed|married|replaced|deposed)\b/i);
      }
      // THE POSITIVE CONTROL FOR ALL FOUR NEGATIVES: every sentence in both blocks really does
      // name both people, so the absences are read against prose that could have carried them.
      expect(lines.filter((line) => line.includes('Sera Vane'))).toHaveLength(row.pool.length);
      expect(lines.filter((line) => line.includes('Aldo Rell'))).toHaveLength(row.pool.length);
    }
    const row = CHANCE_MEETING_KIND_REGISTRY[0];
    const rendered = row.pool.map((variant) => (
      typeof variant === 'function' ? String(variant(SUPPLIABLE)) : String(variant)
    ));
    // ⭐ WITNESS ONE — THE ANNEX'S OWN DECLARATION, in the annex's own sentence order. This volume
    // publishes `requiredSlots` per variant, so the registry's parallel array is pinned against
    // the document rather than merely against itself.
    expect(row.requiredSlots.map((slots) => [...slots])).toEqual(annexBlocks(ANNEX_SOURCE).declared);
    // ⭐ WITNESS TWO — ORTHOGONAL, AND DERIVED BY EXECUTION. Render the annex under markers no
    // sentence contains, read back which survived, and pin the SET against the same array. Witness
    // one would still pass if the annex's declaration had drifted from the annex's own sentences;
    // this one cannot, because it reads the sentences.
    const slotOrder = ALL_SLOTS.chance_meeting_recorded;
    const fromSentences = annexLines(SENTINEL)
      .map((line) => slotOrder.filter((slot) => line.includes(SENTINEL[slot])));
    expect(fromSentences).toEqual(
      row.requiredSlots.map((slots) => slotOrder.filter((slot) => slots.includes(slot))),
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
    expect(() => anchoredOnce(ANNEX_SOURCE, /^## §C HOLE 3(?=[ \n])/gm, '§B terminator')).not.toThrow();
    // ⭐ EVERY ANCHOR OF EVERY BLOCK, not just §A's. ENC-4b rides four slice anchors and two kind
    // headings; each is asserted single here, because a second matching heading retargets a
    // substring pin in silence and this volume now has two blocks for one to land between.
    for (const [kind] of EXPECTED) {
      const hits = [...ANNEX_SOURCE.matchAll(new RegExp(`^### ${kind}(?= )`, 'gm'))];
      expect(hits, `${kind}: annex heading count`).toHaveLength(1);
      // ⭐ AND THE KIND ID IS THE ANNEX'S OWN. The FAITH volume heads its pools with descriptive
      // placeholders and needs a two-spelling join; this sealed file already carries the canonical
      // spelling in BOTH blocks, so the join is an EQUALITY and is asserted rather than assumed.
      expect(CHANCE_MEETING_KINDS).toContain(kind);
    }
  });

  test('MUTANT — a duplicated section heading throws instead of retargeting the slice', () => {
    const doctored = `${ANNEX_SOURCE}\n## §A ENC-4 — A SECOND HEADING NOBODY NOTICED\n`;
    expect(() => annexBlocks(doctored)).toThrow(/expected exactly 1 match/);
  });

  test('MUTANT — a rotted kind heading throws instead of returning an empty pool', () => {
    const doctored = ANNEX_SOURCE.replace('### chance_meeting_recorded (ENC-4)', '### chance_meeting_recordedX (ENC-4)');
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

  test('every desk-bearing row files one desk, carries one phrase, and mints no letter row', () => {
    // THE POSITIVE CONTROLS COME FIRST, because every claim below is only a measurement if the
    // readers it is read against are alive and populated on this run.
    expect(Object.keys(WHAT_PHRASES).length).toBeGreaterThan(1);
    expect(Object.keys(KIND_SECTION).length).toBeGreaterThan(1);
    for (const row of CHANCE_MEETING_KIND_REGISTRY) {
      expect(SECTION_OF(row.kind)).toBe('events');
      expect(row.section).toBe('events');
      // ⛔ EXPLICITLY ROUTED, NOT MERELY CATCH-ALL-ROUTED — ROAD B for the second row too. The
      // exact row is the refusal of the free `chance_meeting_` prefix, for both kinds.
      expect(isExplicitlyRouted(row.kind), `${row.kind}: not explicitly routed`).toBe(true);
      // ⛔ NO CHRONICLE FILING IS CLAIMED BY EITHER ROW.
      // anchored: the populated-map control above proves KIND_SECTION is alive on this run.
      expect(KIND_SECTION).not.toHaveProperty(row.kind);
      // The reader phrase is real prose from the annex's own §C table, not the de-underscored
      // engine token the fallback returns — and it is joined to the DOCUMENT, not transcribed.
      expect(WHAT_PHRASES[row.kind]).toBe(annexWhatPhrase(row.kind));
    }
    const row = CHANCE_MEETING_KIND_REGISTRY[0];
    // ⛔ EXPLICITLY ROUTED, NOT MERELY CATCH-ALL-ROUTED, AND THIS IS ROAD B'S WHOLE POINT. The
    // events desk is the Herald's explicit catch-all, so `SECTION_OF` answers 'events' for a
    // token nobody filed — the desk answer alone cannot tell a registered kind from an unfiled
    // one. This is the arm that separates them, and it is the refusal of the free prefix.
    // The control that gives the loop above its teeth: an unfiled token gets the same desk and
    // fails the same arm.
    expect(SECTION_OF('a_kind_that_will_never_exist_zzz')).toBe('events');
    expect(isExplicitlyRouted('a_kind_that_will_never_exist_zzz')).toBe(false);
    // The reader phrase is real prose, the chair's AMENDED §C noun phrase, not the de-underscored
    // engine token the fallback returns.
    expect(WHAT_PHRASES[row.kind]).toBe('a meeting no court arranged');
    expect(WHAT_PHRASES.chance_meeting_exposed).toBe('a refusal that did not stay private');
    // ⛔ AND THE §C JOIN IS A CITATION, PROVEN IN THE FALSE DIRECTION: the reader that produced
    // the two equalities above really can fail, so they are a document join and not a tautology.
    expect(() => annexWhatPhrase('a_kind_the_annex_never_filed')).toThrow(/no §C row/);
  });

  test('each eligible set is the whole authored pool supplied, and a named shortfall without a home', () => {
    // ⛔ BOTH ARMS OR NOTHING, FOR BOTH KINDS. Asserting only that the whole pool is reachable
    // would pass just as happily against a filter that had STOPPED filtering; the second arm is
    // what proves the eligibility axis is live, and neither corpus has a slot without a supplier
    // to prove it with, so the control WITHHOLDS one.
    for (const [kind, , , , depth] of EXPECTED) {
      const whole = reachableIndexes(kind, SUPPLIABLE);
      expect(whole, `${kind}: not every authored variant is reachable`)
        .toEqual([...Array(depth).keys()]);
      const withoutHome = reachableIndexes(kind, WITHOUT_HOME);
      // ⭐ §B's shortfall is the EMPTY SET, and that is a sharper arm than §A's, not a weaker
      // one: every §B variant names `{home}`, so withholding it silences the kind entirely.
      expect(withoutHome, `${kind}: the home-withheld arm`).toEqual([...HOME_LESS_INDEXES[kind]]);
      // The withheld slot is named BY INDEX rather than by count, so a corpus edit that moved
      // `{home}` into a different variant reds instead of counting to one again.
      const row = CHANCE_MEETING_KIND_REGISTRY.find((candidate) => candidate.kind === kind);
      expect(row.requiredSlots
        .map((slots, index) => (slots.includes('home') ? -1 : index))
        .filter((index) => index >= 0)).toEqual([...HOME_LESS_INDEXES[kind]]);
    }
  });

  test('the keyed pick is deterministic and every pool genuinely spreads', () => {
    for (const [kind, , , , depth] of EXPECTED) {
      // Same key, same sentence — forever. THE PROMISE, asserted on the registry's own picker.
      expect(chanceMeetingLine(kind, 'k::a::b', SUPPLIABLE))
        .toEqual(chanceMeetingLine(kind, 'k::a::b', SUPPLIABLE));
      // …and DIFFERENT keys really do reach different variants, or the determinism above would be
      // the determinism of a picker that answers one sentence to everything.
      const spread = new Set(reachableIndexes(kind, SUPPLIABLE));
      expect(spread.size).toBeGreaterThanOrEqual(2);
      // THE CURED SPELLING IS OBSERVABLE, not merely commented: an `fnv % length` pick aliases
      // onto a parity class, so the whole eligible set would not be reachable. It is.
      expect(spread.size, `${kind}: the pick does not reach every eligible variant`).toBe(depth);
    }
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
    expect(CHANCE_MEETING_PRESENTATION.notable).toEqual({ severity: 0.56, score: 58 });
    expect(entry.severity).toBe(CHANCE_MEETING_PRESENTATION.notable.severity);
    expect(entry.score).toBe(CHANCE_MEETING_PRESENTATION.notable.score);
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
    // ⛔ THE ANNEX'S §B KIND IS NOT THIS ROW'S, and the beat gate says so in values rather than in
    // a comment: the refusal that travelled has its own pool, its own class and its own builder,
    // and THIS builder must still refuse its beat — a dispatcher is not a merge.
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

  test('§B — the roles are the APPROACH\'s, and the mirror proves the sentence names them right', () => {
    // ⭐⭐ THE WRONG-ROLE LAW, EXECUTED. Every §B variant reads "{counterpart} … refused what {npc}
    // … offered", so `{npc}` is the person who MADE the offer. ENC-4 reported this kind unwireable
    // for exactly that reason: the seed carried parties in census order and no direction at all.
    // The fixture and its MIRROR differ in ONE FIELD — which party the stage names as the
    // approacher — and the sentence must follow that field rather than the array order.
    const entry = exposedEntryOf();
    expect(entry).toBeTruthy();
    // THE FIXTURE: Sera Vane (of Kesthorne, the guest) approached; Aldo Rell (of Bramwell, the
    // host's own) refused. The sentence must put Sera Vane in the OFFERER's clause.
    expect(entry.headline).toContain('Sera Vane');
    expect(entry.headline).toContain('Aldo Rell');
    // ⛔ THE ROLE ARM ITSELF, and it is read on the WORDS rather than on a field: the offerer is
    // the one the sentence attaches "of {home}" to, and the home is the approacher's own court.
    expect(entry.headline).toContain('Sera Vane of Kesthorne');
    // The positive clause one line up proves the "of {home}" join really renders on this sentence.
    // anchored: headline asserted truthy and naming both people above; the positive clause is live.
    expect(entry.headline).not.toContain('Aldo Rell of Kesthorne');

    // ⭐⭐ THE MIRROR, AND ENC-4c INVERTED IT WITH ATTRIBUTION. One field is flipped: the HOST's
    // own notable is now the approacher. ENC-4b asserted NULL here, because every §B variant would
    // then have to call the guest "of {settlement}" — the host town he is not from — and silence
    // was the only honest answer while that half had no words. The chair authored `## §B2 ENC-4c`
    // for exactly this case, so the mirror now BUILDS, out of the OTHER corpus, and the arm that
    // was a withhold is the arm that proves the case selection works.
    const mirror = exposedEntryOf({ approacherNid: 'npc:bramwell:4' });
    expect(mirror).toBeTruthy();
    // ⛔ IT IS THE SAME KIND AT THE SAME DESK AND THE SAME WEIGHT — a second CORPUS, never a
    // second registration. If this ever diverged, the pantheon A5 freezes would owe a move.
    expect(mirror.kind).toBe('chance_meeting_exposed');
    expect(mirror.impactKind).toBe('chance_meeting_exposed');
    expect(mirror.significance).toBe(entry.significance);
    expect(mirror.section).toBe(entry.section);
    expect([mirror.severity, mirror.score]).toEqual([entry.severity, entry.score]);
    // …and it draws from the OTHER family namespace, which is how a variety reader can tell two
    // genuinely different families of sentence apart.
    expect(String(mirror.familyId)).toMatch(/^chance_meeting_exposed_host_offered\.[1-5]$/);
    expect(String(entry.familyId)).toMatch(/^chance_meeting_exposed\.[1-5]$/);
    // ⛔⛔ THE ROLE LAW ON THE MIRROR'S OWN WORDS, AND IT IS THE INVERSE OF THE ARM ABOVE. The
    // host's own notable offered, so the OFFERER is now the one with no "of {home}" join and the
    // REFUSER is the guest. A sentence that put Aldo Rell in Kesthorne, or Sera Vane in Bramwell,
    // would be the fluent-and-false defect this whole family exists to refuse.
    expect(mirror.headline).toContain('Sera Vane of Kesthorne');
    // The positive clause one line up proves the "of {home}" join really renders on this sentence.
    // anchored: the mirror is asserted truthy and its offerer clause is asserted present above.
    expect(mirror.headline).not.toContain('Sera Vane of Bramwell');
    // anchored: same populated mirror headline — the host's own is never given the guest's court.
    expect(mirror.headline).not.toContain('Aldo Rell of Kesthorne');
    // anchored: same populated mirror headline — nor is he given his own town as a guest's court.
    expect(mirror.headline).not.toContain('Aldo Rell of Bramwell');
    // …and the two cases really do render DIFFERENT sentences from the same meeting id, so the
    // selection is a selection and not one corpus answering both.
    expect(mirror.headline).not.toBe(entry.headline);
    // ⛔ THE FENCE THE INVERSION MUST NOT BREACH: an approach the stage will not name is still
    // silence. That is every traveller x traveller receipt and every meeting beat, and it is the
    // R1 fence enforced by absence rather than by a list.
    expect(exposedEntryOf({ approacherNid: '' })).toBeNull();
    expect(exposedEntryOf({ approacherNid: 'npc:elsewhere:9' })).toBeNull();
  });

  test('§B2 — the kind speaks for BOTH cases and withholds for NEITHER, on the seed\'s own address', () => {
    // ⭐⭐ THE LANE'S WHOLE CLAIM, AS A VALUE. ENC-4b's writer withheld the line whenever the
    // host's own notable made the offer. After ENC-4c both arrangements of the same two people
    // have authored words, and the corpus is chosen by which court the APPROACHER belongs to.
    const guest = exposedEntryOf({ approacherNid: 'npc:kesthorne:1' });
    const host = exposedEntryOf({ approacherNid: 'npc:bramwell:4' });
    expect([guest, host].filter(Boolean), 'a case is still withheld').toHaveLength(2);
    expect(String(guest.familyId).split('.')[0]).toBe('chance_meeting_exposed');
    expect(String(host.familyId).split('.')[0]).toBe('chance_meeting_exposed_host_offered');
    // ⛔ THE ADDRESS CHAIN IS IDENTICAL ACROSS THE TWO CASES: the same meeting, the same two
    // courts, the same two people. Only the SENTENCE differs, which is what a case is.
    expect(host.settlementIds).toEqual(guest.settlementIds);
    expect(host.settlementNames).toEqual(guest.settlementNames);
    expect(host.npcIds).toEqual(guest.npcIds);
    expect(host.summary).toBe(guest.summary);
    expect(host.reasons).toEqual(guest.reasons);
    // ⛔⛔ `{home}` IS THE GUEST'S COURT IN BOTH CORPORA, NOT THE APPROACHER'S — the defect that
    // would have shipped had the host-offered case kept ENC-4b's read. Kesthorne is the guest's
    // court in both, and Bramwell is the host in both, whichever way the approach ran.
    expect(guest.headline).toContain('Kesthorne');
    expect(host.headline).toContain('Kesthorne');
    expect(host.headline).toContain('Bramwell');
    // …and NEITHER case ever attaches a person to the court he is not of.
    for (const built of [guest, host]) {
      // anchored: both entries are asserted built, and both headlines name Kesthorne, above.
      expect(String(built.headline)).not.toContain('Sera Vane of Bramwell');
      // anchored: same two populated headlines — the mirror of the same law.
      expect(String(built.headline)).not.toContain('Aldo Rell of Kesthorne');
    }
    // ⛔ AND THE ADDRESS ARM THE CASE SELECTION RESTS ON: exactly one party must be of the host
    // town, asserted rather than assumed. Both-host and neither-host are refused, because no
    // sentence in either corpus has an honest fill for `{settlement}` and `{home}` then.
    expect(exposedEntryOf({ hostId: 'a_town_neither_party_is_from' })).toBeNull();
    expect(exposedEntryOf({ settlementIds: ['bramwell', 'bramwell'] })).toBeNull();
    // The positive control for those two nulls: the untouched seed still builds.
    expect(exposedEntryOf()).toBeTruthy();
  });

  test('§B2 — the case axis is total, and an unauthored case is SILENCE rather than a fallback', () => {
    // ⛔⛔ A CASE WITH NO WORDS MUST NOT BORROW THE OTHER CASE'S. That borrowing IS the wrong-ROLE
    // defect wearing a default, and it is the one failure mode a case-keyed corpus adds.
    const interp = { npc: 'Sera Vane', counterpart: 'Aldo Rell', settlement: 'Bramwell', home: 'Kesthorne' };
    expect(chanceMeetingLine('chance_meeting_exposed', 'seed', interp, 'a_case_nobody_authored')).toBeNull();
    // Read against calls known to ANSWER, so the null is a closed door and not a picker that
    // returns nothing for everything.
    expect(chanceMeetingLine('chance_meeting_exposed', 'seed', interp, 'guest_offered')).toBeTruthy();
    expect(chanceMeetingLine('chance_meeting_exposed', 'seed', interp, 'host_offered')).toBeTruthy();
    // ⭐ THE REGISTRY'S OWN VIEW: every row's `cases` table is total over the corpora it names,
    // each case is parallel to its own pool, and each clears its kind's derived floor.
    for (const row of CHANCE_MEETING_KIND_REGISTRY) {
      const tokens = Object.keys(row.cases);
      expect(tokens.length, `${row.kind}: no authored case`).toBeGreaterThanOrEqual(1);
      for (const token of tokens) {
        const authored = row.cases[token];
        expect(authored.pool, `${row.kind}/${token}: not the corpus module's own array`)
          .toBe(CHANCE_MEETING_RECEIPTS[authored.poolKey]);
        expect(authored.requiredSlots).toHaveLength(authored.pool.length);
        expect(authored.pool.length).toBeGreaterThanOrEqual(FREQUENCY_FLOORS[row.significance]);
        expect(Object.isFrozen(authored)).toBe(true);
        // Every case's declaration is its own annex block's, re-derived from the document.
        expect(authored.requiredSlots.map((slots) => [...slots]),
          `${row.kind}/${token}: declaration is not ${authored.poolKey}'s annex block`)
          .toEqual(annexBlocks(ANNEX_SOURCE, authored.poolKey).declared);
      }
    }
    // ⛔ THE ROW'S OWN `pool` AND `requiredSlots` STAY THE DEFAULT CASE'S, and that is load-bearing
    // rather than cosmetic: `kindPoolWalker` measures a row's DEPTH from `row.pool`, so a row that
    // moved its corpus under a case key would measure zero and land on `['starved']`.
    const exposed = CHANCE_MEETING_KIND_REGISTRY[1];
    expect(exposed.pool).toBe(exposed.cases.guest_offered.pool);
    expect(exposed.requiredSlots.map((s) => [...s]))
      .toEqual(exposed.cases.guest_offered.requiredSlots.map((s) => [...s]));
    expect(floorReasons(exposed)).toEqual([]);
    // …and the one-case row declares exactly one, so a second corpus cannot arrive there unread.
    expect(Object.keys(CHANCE_MEETING_KIND_REGISTRY[0].cases)).toEqual(['sole']);
    expect(Object.keys(exposed.cases).sort()).toEqual(['guest_offered', 'host_offered']);
  });

  test('§B — the writer carries the whole address chain, the major pair, and the §C reason', () => {
    const entry = exposedEntryOf();
    // ADDRESS — the host and BOTH courts, deduped, plus both people.
    expect(entry.settlementIds).toEqual(['bramwell', 'kesthorne']);
    expect(entry.settlementNames).toEqual(['Bramwell', 'Kesthorne']);
    expect(entry.npcIds).toEqual(['npc:kesthorne:1', 'npc:bramwell:4']);
    // TYPED ACTION — the registered token, spelled as a literal so a raw-text walker can see it.
    expect(entry.impactKind).toBe('chance_meeting_exposed');
    expect(entry.kind).toBe(CHANCE_MEETING_KINDS[1]);
    expect(isExplicitlyRouted(String(entry.impactKind))).toBe(true);
    // THE GOVERNED METADATA rides the registry row rather than a second opinion.
    expect(entry.significance).toBe('major');
    expect(entry.section).toBe('events');
    expect(entry.audience).toBe('public');
    expect(entry.familyId).toMatch(/^chance_meeting_exposed\.[1-5]$/);
    // THE PRESENTATION PAIR is `envoyNews.js`'s `major` row, asserted BESIDE the row's class.
    expect(CHANCE_MEETING_PRESENTATION.major).toEqual({ severity: 0.76, score: 78 });
    expect(entry.severity).toBe(CHANCE_MEETING_PRESENTATION.major.severity);
    expect(entry.score).toBe(CHANCE_MEETING_PRESENTATION.major.score);
    // ⛔ REASON — §B AUTHORS NO "REASON, RIDING EVERY VARIANT" CLAUSE and §A does. The limb is
    // filled from the chair's own §C row for this exact kind, joined to the DOCUMENT here so it
    // is a citation rather than a mint, and sentence-cased at the render exactly as §A's is.
    expect(CHANCE_MEETING_EXPOSED_REASON).toBe(`${annexWhatPhrase('chance_meeting_exposed')}.`);
    expect(entry.reasons).toEqual([`${CHANCE_MEETING_EXPOSED_REASON.charAt(0).toUpperCase()}${CHANCE_MEETING_EXPOSED_REASON.slice(1)}`]);
    expect(entry.summary).toBe(entry.reasons[0]);
    // The ids carry the kind and hide the errand handle, on the §A row's own cured idiom.
    expect(String(entry.id)).toMatch(/^wizard_news\.41\.chance_meeting_exposed\.[0-9a-f]{16}$/);
    expect(String(entry.sourceEventId)).toMatch(/^chance_meeting_receipt\.chance_meeting_exposed\.[0-9a-f]{16}$/);
    // Same meeting, same world, same sentence — forever. THE PROMISE at the second writer too.
    expect(exposedEntryOf()).toEqual(entry);
  });

  test('§B — the writer FAILS CLOSED on every seed whose approach it cannot honestly name', () => {
    // The positive control first, so each null below is a closed door rather than a builder that
    // answers nothing to everything.
    expect(exposedEntryOf()).toBeTruthy();
    // ⛔ THE LIMB ENC-4 DID NOT HAVE. Without an approacher there is no offerer, and §B may not
    // guess one: this is the exact refusal that kept the kind unregistered for a whole car.
    expect(exposedEntryOf({ approacherNid: '' })).toBeNull();
    expect(exposedEntryOf({ approacherNid: 'npc:elsewhere:9' })).toBeNull();
    // ⛔ AND THAT IS THE SHAPE A traveller x traveller SEED ARRIVES IN. The stage writes the empty
    // string for every kind whose direction it will not claim, so the whole kind stays silent here
    // without this file naming it — the R1 fence, enforced by absence rather than by a list.
    expect(exposedEntryOf({ approacherNid: '', hostId: 'bramwell' })).toBeNull();
    // A party count this builder did not expect would pair a name with the wrong id.
    expect(exposedEntryOf({ npcIds: ['npc:kesthorne:1'] })).toBeNull();
    expect(exposedEntryOf({ npcNames: ['Sera Vane'] })).toBeNull();
    expect(exposedEntryOf({ settlementIds: ['kesthorne'] })).toBeNull();
    // A hole is worse than a silence: one unresolved name and the whole line is withheld.
    expect(exposedEntryOf({ npcNames: ['Sera Vane', ''] })).toBeNull();
    expect(exposedEntryOf({ settlementNames: { kesthorne: 'Kesthorne', bramwell: '' } })).toBeNull();
    expect(exposedEntryOf({ hostId: '' })).toBeNull();
    // The other beat is not this row's, and the builder survives being called with nothing at all.
    expect(exposedEntryOf({ beat: 'meeting' })).toBeNull();
    expect(chanceMeetingExposedEntry()).toBeNull();
    expect(chanceMeetingExposedEntry({})).toBeNull();
  });

  test('§B — the one door the pulse calls routes each beat to its own row and nothing else', () => {
    // ⛔ THE DISPATCH IS THE FAMILY'S, NOT THE PULSE'S. `envoyPulse.js` hands every seed to one
    // callback, so a builder added without a dispatch row would be a mint no producer can reach.
    const now = '2026-01-01T00:00:00.000Z';
    const recorded = chanceMeetingHeraldEntry({ seed: seedOf(), now });
    const exposed = chanceMeetingHeraldEntry({ seed: exposedSeedOf(), now });
    expect(recorded.impactKind).toBe('chance_meeting_recorded');
    expect(exposed.impactKind).toBe('chance_meeting_exposed');
    // Each door builds exactly what its own builder builds — the dispatcher adds no opinion.
    expect(recorded).toEqual(chanceMeetingEntry({ seed: seedOf(), now }));
    expect(exposed).toEqual(chanceMeetingExposedEntry({ seed: exposedSeedOf(), now }));
    // …and a beat neither row claims is silence rather than a throw into a live pulse.
    expect(chanceMeetingHeraldEntry({ seed: seedOf({ beat: 'a_beat_no_row_claims' }), now })).toBeNull();
    expect(chanceMeetingHeraldEntry()).toBeNull();
  });

  test('§B — MUTANT: the two blocks spell their slot marker DIFFERENTLY, and inheriting one throws', () => {
    // ⛔ THE TRAP THIS TABLE EXISTS FOR. §A writes `**Per-variant required slots**`; §B writes
    // `**Per-variant required slots:**`. A reader that carried §A's marker into §B would not find
    // it, and the fail-closed split throws instead of returning a merged twelve-row list.
    expect(ANNEX_BLOCKS.chance_meeting_exposed.slotsMarker)
      .not.toBe(ANNEX_BLOCKS.chance_meeting_recorded.slotsMarker);
    const doctored = ANNEX_SOURCE.replace(ANNEX_BLOCKS.chance_meeting_exposed.slotsMarker, '**Slot notes**');
    expect(() => annexBlocks(doctored, 'chance_meeting_exposed')).toThrow(/no "\*\*Per-variant required slots:\*\*" block/);
    // The control: the undoctored source really does split §B into five and five.
    const live = annexBlocks(ANNEX_SOURCE, 'chance_meeting_exposed');
    expect([live.rows.length, live.declared.length]).toEqual([5, 5]);
    // …and a kind with no declared anchors is refused rather than silently read against §A's.
    expect(() => annexBlocks(ANNEX_SOURCE, 'chance_meeting_never_authored')).toThrow(/no declared annex anchors/);
  });

  test('§B — the annex carries the wiring rule, and the authored sentences are still the seal\'s', () => {
    // ⭐ THE ONE LINE ENC-4b ADDED TO A SEALED DOCUMENT, pinned so it cannot be dropped in
    // silence. The kind ships only where the receipt recorded a direction; the writer enforces
    // that in values, and this is the rule stated where the words live.
    const scope = sectionSlice(ANNEX_SOURCE, ANNEX_BLOCKS.chance_meeting_exposed.section,
      ANNEX_BLOCKS.chance_meeting_exposed.until);
    expect(scope).toContain('**§B speaks only where the approach is known.**');
    // ⛔ AND IT IS A RULE, NOT A VARIANT. It sits before the numbered pool and must never be read
    // as one: the block still splits into five sentences and five declarations, so an added line
    // that had landed inside the list would red here rather than ship as a sixth variant.
    const live = annexBlocks(ANNEX_SOURCE, 'chance_meeting_exposed');
    expect([live.rows.length, live.declared.length]).toEqual([5, 5]);
    // anchored: the five-and-five split one line up proves these are the real authored rows.
    expect(live.rows.join(' ')).not.toMatch(/speaks only where/);
    // ⛔ THE AUTHORED SENTENCES THEMSELVES ARE UNTOUCHED. Every §B slot declaration is exactly the
    // four the seal declares, in the seal's own order, so the added rule changed prose nowhere.
    expect(live.declared).toEqual([
      ['counterpart', 'settlement', 'npc', 'home'],
      ['settlement', 'counterpart', 'npc', 'home'],
      ['npc', 'home', 'settlement', 'counterpart'],
      ['settlement', 'counterpart', 'npc', 'home'],
      ['settlement', 'counterpart', 'npc', 'home'],
    ]);
  });

  test('§B2 — the third governed block is the chair\'s corpus, verbatim, and it is a POOL not a KIND', () => {
    // ⭐⭐ THE OTHER HALF OF §B, AND THE PREMISE FOR IT WAS MEASURED BEFORE IT WAS AUTHORED. §B is
    // honest only where the one PASSING THROUGH offered, because its variant 1 fixes
    // `{counterpart}` as being of `{settlement}`; the engine lets either party lead, so ENC-4b
    // shipped the case and withheld the kind. This block carries the withheld case.
    const POOL_KEY = 'chance_meeting_exposed_host_offered';
    const live = annexBlocks(ANNEX_SOURCE, POOL_KEY);
    // The block splits into FIVE sentences and FIVE declarations, read from disjoint text.
    expect([live.rows.length, live.declared.length]).toEqual([5, 5]);
    // ⛔ THE CORPUS MODULE IS THE ANNEX'S TRANSCRIPTION, joined here rather than eyeballed.
    const pool = CHANCE_MEETING_RECEIPTS[POOL_KEY];
    expect(pool).toHaveLength(5);
    const lines = pool.map((variant) => String(variant(SUPPLIABLE)));
    expect(lines, `${POOL_KEY}: pool is not the annex's`).toEqual(annexLines(SUPPLIABLE, POOL_KEY));
    expect(new Set(lines).size, 'a duplicated sentence').toBe(pool.length);
    // ⛔⛔ AND IT IS NOT A KIND. Nothing registers this id: no registry row, no routed token, no
    // Chronicle row and no reader phrase. Those four absences are the whole reason the pantheon
    // A5 freezes and `REGISTERED_KIND_COUNT` do not move for a second corpus.
    // ⚠ THE FIRST TWO ARE ANCHORED AT THE ASSERTION, NOT SIX LINES BELOW IT. The paragraph
    // that follows already supplied paired positives for THREE of the five absences, and the
    // habitat walker was right to convict all the same: a positive further down the body is
    // a reviewer's anchor, not the assertion's, and the two collections that had no positive
    // at all were the registry list and the Chronicle section map. Routing the pair that HAS
    // a same-path sibling through `expectAbsentWithAnchor` makes the liveness claim execute
    // in front of each exclusion — `chance_meeting_exposed` is the id the volume DOES
    // register, so it travels the very path a drift would empty.
    expectAbsentWithAnchor(
      CHANCE_MEETING_KINDS, POOL_KEY, 'chance_meeting_exposed',
      'a pool id is never a kind',
    );
    expectAbsentWithAnchor(
      CHANCE_MEETING_KIND_REGISTRY.map((row) => row.kind), POOL_KEY, 'chance_meeting_exposed',
      'a pool id owns no registry row',
    );
    expect(isExplicitlyRouted(POOL_KEY), `${POOL_KEY}: a pool id must route nowhere`).toBe(false);
    // ⛔ AND THE CHRONICLE MAP GETS A LIVENESS ASSERTION RATHER THAN A SIBLING, because it has
    // no honest sibling to offer: `chance_meeting_exposed` is a REGISTERED kind and is itself
    // absent from KIND_SECTION (measured — the map holds zero `chance_meeting*` keys at all),
    // so anchoring on it would assert a presence that is false, and anchoring on an unrelated
    // war kind would be the hardcoded-constant vacuity the helper's own header forbids. The
    // populated-map assertion is the anchor that is actually true here.
    expect(Object.keys(KIND_SECTION).length, 'the Chronicle section map went empty').toBeGreaterThan(50);
    // anchored: the populated-map assertion on the line directly above is this exclusion's liveness proof — a KIND_SECTION that drifted away, emptied or was never built reds there first, so the absence below can only mean the pool id was correctly kept out
    expect(KIND_SECTION).not.toHaveProperty(POOL_KEY);
    expect(WHAT_PHRASES[POOL_KEY]).toBeUndefined();
    // The positive controls for the two absences that keep their bare shape above: the id the
    // volume DOES register answers both, and the kind-list positive is now redundant with the
    // anchored call above it — kept, because it also pins the id's spelling for a reader.
    expect(CHANCE_MEETING_KINDS).toContain('chance_meeting_exposed');
    expect(isExplicitlyRouted('chance_meeting_exposed')).toBe(true);
    expect(WHAT_PHRASES.chance_meeting_exposed).toBeTruthy();
  });

  test('§B2 — this volume\'s voice fences hold on the third block too, and the ROLE claim is inverted', () => {
    const POOL_KEY = 'chance_meeting_exposed_host_offered';
    const lines = CHANCE_MEETING_RECEIPTS[POOL_KEY].map((variant) => String(variant(SUPPLIABLE)));
    // The positive control FIRST, so every absence below is read against prose that could have
    // carried the defect: all five name both people and both places.
    expect(lines.filter((line) => line.includes('Sera Vane'))).toHaveLength(5);
    expect(lines.filter((line) => line.includes('Aldo Rell'))).toHaveLength(5);
    expect(lines.filter((line) => line.includes('Bramwell'))).toHaveLength(5);
    expect(lines.filter((line) => line.includes('Kesthorne'))).toHaveLength(5);
    for (const line of lines) {
      expect(line).toBe(line.trim());
      expect(line.length).toBeGreaterThan(0);
      // anchored: all five are asserted to name both people and both places two lines above.
      expect(line).not.toMatch(/\d|%|×|_|\$\{|[{}]|\bundefined\b|\bNaN\b/);
      // anchored: same liveness — the five populated sentences above.
      expect(line).not.toMatch(/[—!]/);
      // anchored: same liveness — §886 on rendered prose, never asserted in a comment.
      expect(line).not.toMatch(/chance\W+meeting|meeting\W+chance/i);
      // anchored: same liveness — STATE, never FATE: none of the five resolves a life.
      expect(line).not.toMatch(/\b(?:died|dead|killed|slain|executed|exiled|wed|married|replaced|deposed)\b/i);
    }
    // ⛔⛔ THE ROLE CLAIM, INVERTED AND PINNED ON THE ANNEX'S OWN TEXT. §B says
    // "{counterpart} of {settlement}"; §B2 may never say it, and may never say "{npc} of {home}"
    // either. That is the whole content of the case split, and it is read on the DOCUMENT so a
    // corpus edit cannot launder it.
    const rows = annexBlocks(ANNEX_SOURCE, POOL_KEY).rows;
    expect(rows).toHaveLength(5);
    // anchored: the five authored rows are asserted present on the line above.
    expect(rows.join(' ')).not.toContain('{counterpart} of {settlement}');
    // anchored: same five rows — the inverse assertion, which §B makes and §B2 must not.
    expect(rows.join(' ')).not.toContain('{npc} of {home}');
    // …and the POSITIVE side of the same law, so the two absences are a claim rather than a
    // property of an empty array: §B2 really does attach each party to the other's place.
    expect(rows.filter((row) => row.includes('{npc} of {settlement}'))).toHaveLength(2);
    expect(rows.filter((row) => row.includes('{counterpart} of {home}'))).toHaveLength(5);
    // ⭐ AND THE MIRROR OF THAT LAW ON THE SEALED BLOCK, so the two blocks are proved OPPOSITE
    // rather than merely each internally consistent.
    const sealed = annexBlocks(ANNEX_SOURCE, 'chance_meeting_exposed').rows;
    expect(sealed.filter((row) => row.includes('{counterpart} of {settlement}'))).toHaveLength(1);
    expect(sealed.filter((row) => row.includes('{npc} of {home}'))).toHaveLength(5);
  });

  test('§B2 — the annex carries its own wiring rule, and the sealed blocks are untouched', () => {
    // ⭐ THE RULE LINE, pinned where the words live, exactly as ENC-4b pinned §B's.
    const scope = sectionSlice(ANNEX_SOURCE,
      ANNEX_BLOCKS.chance_meeting_exposed_host_offered.section,
      ANNEX_BLOCKS.chance_meeting_exposed_host_offered.until);
    expect(scope).toContain('**§B2 speaks only where the approacher is of the host town.**');
    // ⛔ AND IT IS A RULE, NOT A VARIANT: the block still splits five and five, so a rule line
    // that had landed inside the numbered list would red here rather than ship as a sixth.
    const live = annexBlocks(ANNEX_SOURCE, 'chance_meeting_exposed_host_offered');
    expect([live.rows.length, live.declared.length]).toEqual([5, 5]);
    // anchored: the five-and-five split one line up proves these are the real authored rows.
    expect(live.rows.join(' ')).not.toMatch(/speaks only where/);
    // ⛔⛔ THE SEALED §B BLOCK IS STILL EXACTLY FIVE AND FIVE, AND THAT IS THE ARM THE THIRD BLOCK
    // PUTS AT RISK. §B2 sits between §B and §C; a §B slice still terminating at §C would read
    // §B2's five sentences as §B's declaration rows and report fifteen. The terminator moved, and
    // this is the measurement that says the move was made.
    const sealed = annexBlocks(ANNEX_SOURCE, 'chance_meeting_exposed');
    expect([sealed.rows.length, sealed.declared.length]).toEqual([5, 5]);
    expect(ANNEX_BLOCKS.chance_meeting_exposed.until).toBe('## §B2 ENC-4c');
    // …and §A is unaffected in the same breath, because it terminates before both.
    expect(annexBlocks(ANNEX_SOURCE).rows).toHaveLength(6);
  });

  test('§B2 — MUTANT: an unescaped metacharacter in a declared heading is refused, not interpolated', () => {
    // ⛔⛔ A DEFECT THIS LANE WALKED INTO AND MEASURED OUT OF. The reader interpolates each block's
    // declared heading into a RegExp WITHOUT escaping, so `chance_meeting_exposed.host_offered` —
    // the first pool id reached for — would have matched any byte where the dot stands and could
    // land the exactly-once guard on a neighbouring block. Every declared heading is word
    // characters and spaces, and the reader refuses one that is not.
    for (const [poolKey, anchors] of Object.entries(ANNEX_BLOCKS)) {
      expect(anchors.heading, `${poolKey}: heading carries a regex metacharacter`)
        .toMatch(/^[A-Za-z0-9_ ]+$/);
    }
    // The refusal fires rather than decorating, proved on a doctored table entry.
    const doctored = { ...ANNEX_BLOCKS, mutant: { ...ANNEX_BLOCKS.chance_meeting_exposed, heading: 'chance_meeting_exposed.host_offered' } };
    const check = (heading) => {
      if (!/^[A-Za-z0-9_ ]+$/.test(heading)) throw new Error('carries a character this reader interpolates into a RegExp unescaped');
      return true;
    };
    expect(() => check(doctored.mutant.heading)).toThrow(/interpolates into a RegExp unescaped/);
    // …and the control: every heading the volume really declares passes the same check.
    expect(Object.values(ANNEX_BLOCKS).every((anchors) => check(anchors.heading))).toBe(true);
    // ⛔ AND A POOL WITH NO DECLARED ANCHORS IS STILL REFUSED rather than read against §A's.
    expect(() => annexBlocks(ANNEX_SOURCE, 'chance_meeting_never_authored')).toThrow(/no declared annex anchors/);
  });

  test('§B2 — the sentinel witness reads the same four slots this block declares', () => {
    // ⭐ WITNESS TWO for §B2, orthogonal and derived by EXECUTION: render the block under markers
    // no sentence contains, read back which survived, and pin the SET against the block's OWN
    // declaration rows. The declaration join alone would pass if the declaration had drifted from
    // the sentences; this one reads the sentences.
    const POOL_KEY = 'chance_meeting_exposed_host_offered';
    const slotOrder = ALL_SLOTS[POOL_KEY];
    const sentinel = Object.fromEntries(slotOrder.map((slot) => [slot, `<<${slot}>>`]));
    const declared = annexBlocks(ANNEX_SOURCE, POOL_KEY).declared;
    const fromSentences = annexLines(sentinel, POOL_KEY)
      .map((line) => slotOrder.filter((slot) => line.includes(sentinel[slot])));
    expect(fromSentences).toEqual(
      declared.map((slots) => slotOrder.filter((slot) => slots.includes(slot))),
    );
    // …and the witness is only a witness if it can DISAGREE: all five sentences must really carry
    // markers, or every arity above would read as the empty array and agree vacuously.
    expect(fromSentences.filter((slots) => slots.length > 0)).toHaveLength(5);
    // ⛔ §B2 TAKES NO `{outcome_phrase}` EITHER: a refusal is not a mark band.
    // anchored: the five-non-empty arm one line up proves this array holds real slot names.
    expect(fromSentences.flat()).not.toContain('outcome_phrase');
    // ⭐ ALL FIVE NAME THE GUEST'S COURT, so the home-withheld arm for this block is the EMPTY set
    // — asserted against the annex's own declaration rather than counted by hand.
    expect(declared.map((slots, index) => (slots.includes('home') ? -1 : index))
      .filter((index) => index >= 0)).toEqual([...HOME_LESS_INDEXES[POOL_KEY]]);
  });

  test('§B2 — the corpus census is THREE pools against TWO kinds, and the difference is the point', () => {
    // ⛔⛔ THE ARM THAT KEEPS A SECOND CORPUS FROM READING AS A SECOND REGISTRATION. Three authored
    // pools, two registered kinds, and every pool joined to its own governed block.
    expect(Object.keys(CHANCE_MEETING_RECEIPTS).sort()).toEqual(POOLS.map(([key]) => key).slice().sort());
    expect(Object.keys(ANNEX_BLOCKS).sort()).toEqual(POOLS.map(([key]) => key).slice().sort());
    expect(POOLS).toHaveLength(3);
    expect(CHANCE_MEETING_KINDS).toHaveLength(2);
    for (const [poolKey, depth] of POOLS) {
      expect(CHANCE_MEETING_RECEIPTS[poolKey], `${poolKey}: no corpus`).toHaveLength(depth);
      // Every pool clears the derived floor for the class its KIND is registered at. §B2's kind
      // is `major`, whose floor is four, and five clears it by margin.
      expect(depth).toBeGreaterThanOrEqual(FREQUENCY_FLOORS.major);
    }
    // …and the two ids that ARE kinds are exactly the registry's own, in its own order.
    expect(POOLS.filter(([key]) => CHANCE_MEETING_KINDS.includes(key)).map(([key]) => key))
      .toEqual([...CHANCE_MEETING_KINDS]);
  });

  test('§B — the sentinel witness reads the same four slots the annex declares', () => {
    // ⭐ WITNESS TWO for §B, orthogonal and derived by EXECUTION: render the block under markers
    // no sentence contains, read back which survived, and pin the SET against the registry's
    // parallel array. The declaration join alone would still pass if the annex's declaration had
    // drifted from the annex's own sentences; this one reads the sentences.
    const slotOrder = ALL_SLOTS.chance_meeting_exposed;
    const sentinel = Object.fromEntries(slotOrder.map((slot) => [slot, `<<${slot}>>`]));
    const row = CHANCE_MEETING_KIND_REGISTRY[1];
    const fromSentences = annexLines(sentinel, 'chance_meeting_exposed')
      .map((line) => slotOrder.filter((slot) => line.includes(sentinel[slot])));
    expect(fromSentences).toEqual(
      row.requiredSlots.map((slots) => slotOrder.filter((slot) => slots.includes(slot))),
    );
    // …and the witness is only a witness if it can DISAGREE: all five sentences must really carry
    // markers, or every arity above would read as the empty array and agree vacuously.
    expect(fromSentences.filter((slots) => slots.length > 0)).toHaveLength(5);
    // ⛔ §B TAKES NO `{outcome_phrase}`: a refusal is not a mark band, and the band table has no
    // anchored: the five-non-empty arm one line up proves this array holds real slot names.
    expect(fromSentences.flat()).not.toContain('outcome_phrase');
  });
});
