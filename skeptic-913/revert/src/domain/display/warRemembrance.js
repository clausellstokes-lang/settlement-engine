/**
 * warRemembrance.js — THE REMEMBRANCE READER (RR-2): the read side of W-MEM's
 * concluded-war ledger.
 *
 * ── WHY IT EXISTS ──────────────────────────────────────────────────────────────
 * `warMemoryEnabled` opens `worldState.concludedWars` and one writer
 * (`worldPulse/concludedWars.js`) fills it with typed, prose-free records of wars
 * that ENDED. Until this module nothing read them: the flag lit a writer whose
 * output no surface could show, which is a dark mechanism wearing a lit flag. This
 * is the reader that makes the record legible, and it is the ONLY place the record
 * becomes sentences.
 *
 * ⭐ THE READ-SIDE ADAPTER THE RECORD ITSELF NAMED. `concludedWarRecord.js`'s fact
 * block deliberately stores neither the attacker nor the defender nor the ENDING:
 * "the read-side adapter derives them from the record's orientation and pair — one
 * home per datum", and "the ending is NOT stored: it derives at read, so one
 * resolver owns the question and an improved classifier improves every recorded
 * war". This module is that adapter. It calls `classifyWarEnding` and never
 * re-implements a single one of its branches.
 *
 * ── PROSE_RENDER, NEVER PROSE_PERSISTED (CH-9) ────────────────────────────────
 * Every sentence here is authored at READ time and written nowhere. The record
 * holds no prose by design (settlement names would freeze against renames, and
 * seven close roads author no sentence at all), so re-wording anything in this file
 * changes what a reader sees and changes no lived history and no golden. That is
 * the whole reason the bands are persisted as KEYS and resolved to WORDS here.
 *
 * ── LAZY, AND MEASURED (CH-9) ─────────────────────────────────────────────────
 * Both consumers sit behind lazy seams — the Herald's Remembrance door is mounted
 * through `lazy()` in HeraldBody, and the World Book is reached only by a dynamic
 * import on user action. Nothing on the entry static graph imports this module, so
 * its first-paint cost is ZERO. Its lazy-chunk cost is real and was measured rather
 * than asserted: `warEndingClassifier` brings `warConvergenceContract` and
 * `warConvergenceForces` with it. That is the price of one resolver, and the
 * alternative the record's design forbids is a second classifier.
 *
 * ── WHAT IT REFUSES TO SAY ────────────────────────────────────────────────────
 * · STATE, NEVER FATE. Not one sentence here decides or reports a named person's
 *   fate. `fact.loserDied` is the engine's SETTLEMENT death stamp, read through the
 *   writer's own `principalDied` helper, so the annihilation telling speaks about a
 *   seat that did not outlast the war and never about a person.
 * · NO INVENTED PRODUCERS. An unclassifiable ending reads as an honest silence.
 *   The classifier's three unclassified reasons are distinct diagnoses and each
 *   gets its own sentence, because "we saw nothing" and "we saw a razing we could
 *   not attribute" are different truths.
 * · NO NUMBERS. No tick, no score, no capacity, no headcount. Ages are TURNINGS,
 *   strength is the persisted band's word, weariness is the persisted band's word.
 * · FAITH IS CULTURE. The record's `sacredAnchors` are patron REFERENCES and this
 *   reader does not render them: a war's cause is already carried in world words by
 *   the casus clause, and a patron ref rendered here would be a theological claim.
 *
 * ⚠ DELIBERATELY DEFERRED, DOCUMENTED, NOT A GAP TO RE-FIND. `heraldRegister.js`
 * carries a private `turningsAgoLabel` over the SAME turning ladder this module
 * declares below (0 / 1 / 4 / 13). The two are thresholds-identical and were kept
 * separate ON PURPOSE by this car: unifying them edits a LIT surface, and this car
 * lands dark-inert. The unification is one import and belongs to whoever next opens
 * that file; the thresholds are named in both places so a drift is visible.
 *
 * Pure: no rng, no wall clock, no mutation, no state writes, no I/O.
 *
 * @see src/domain/worldPulse/concludedWarRecord.js — the record and its normalizer.
 * @see src/domain/worldPulse/concludedWars.js — W-MEM's one writer.
 * @see src/domain/certification/warEndingClassifier.js — the one ending resolver.
 */

import { classifyWarEnding } from '../certification/warEndingClassifier.js';
import { deriveWarName, pinnedWarReasonOf } from './warAndRoadNames.js';
import { remainingStrengthPhraseFor } from './armyStrength.js';
import { warExhaustionWordFor } from './warStatus.js';
import { humanizeToken } from './humanizeEngineTokens.js';

/** Codepoint comparator. Never localeCompare: host ICU tables are not a stable order.
 * @param {string} a @param {string} b @returns {number} */
function codepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {Array<Record<string, unknown>>} */
function recordsOf(value) {
  return Array.isArray(value) ? value.map(recordOf) : [];
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value : '';
}

/** @param {unknown} value @returns {number|null} */
function wholeTick(value) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null;
}

/**
 * ⭐ ONE LADDER, TWO PROJECTIONS — the same law `warStatus.js` states for the
 * weariness bands, applied to time. The KEY is a typed token; the WORDS below are
 * display copy and may be re-worded without touching a stored byte, because this
 * reader stores nothing.
 *
 * The floors are the Herald register's own turning ladder (see the deferral note in
 * the header): the turning itself, the one before it, up to four, up to thirteen,
 * and everything older. A tick is an engine count and never reaches the page.
 * @type {ReadonlyArray<string>}
 */
export const WAR_TURNING_BAND_KEYS = Object.freeze([
  'unrecorded', 'this_turning', 'last_turning', 'a_few', 'some', 'long_before',
]);

/**
 * The turning band for an elapsed count of ticks. Total over garbage: a missing or
 * malformed span reads `unrecorded`, never a wrong band and never a throw.
 * @param {number|null} elapsed
 * @returns {string} one of WAR_TURNING_BAND_KEYS
 */
export function warTurningBandKey(elapsed) {
  if (elapsed == null || !Number.isFinite(elapsed)) return 'unrecorded';
  if (elapsed <= 0) return 'this_turning';
  if (elapsed === 1) return 'last_turning';
  if (elapsed <= 4) return 'a_few';
  if (elapsed <= 13) return 'some';
  return 'long_before';
}

/** How long ago the war ended, in the Herald's own time word.
 * @type {Readonly<Record<string, string>>} */
const ENDED_WORDS = Object.freeze({
  unrecorded: 'The record does not set down when it ended.',
  this_turning: 'Ended this turning.',
  last_turning: 'Ended last turning.',
  a_few: 'Ended a few turnings back.',
  some: 'Ended some turnings back.',
  long_before: 'Ended long before the present turning.',
});

/** How long the war ran, over the same ladder.
 * @type {Readonly<Record<string, string>>} */
const RAN_WORDS = Object.freeze({
  unrecorded: 'How long it ran is not set down.',
  this_turning: 'It was over inside the turning that opened it.',
  last_turning: 'It ran a single turning.',
  a_few: 'It ran a few turnings.',
  some: 'It ran some turnings.',
  long_before: 'It ran for many turnings.',
});

/**
 * ⭐ THE ENDING, IN WORLD WORDS. One entry per key in the classifier's own closed
 * `WAR_ENDING_PRECEDENCE`, plus one per `WAR_ENDING_UNCLASSIFIED_REASONS` member.
 * The classifier owns WHICH ending a war had; this table owns only how that ending
 * is said, and a key it does not know renders as an honest silence rather than a
 * token. Totality over both vocabularies is pinned by test.
 *
 * `{victor}` is the only interpolation, and it is filled with a NAME, never an id.
 * @type {Readonly<Record<string, string>>}
 */
export const WAR_ENDING_TELLINGS = Object.freeze({
  punitive_sack_vengeance: 'It ended in a sack, taken as the answer to a burning of its own.',
  punitive_sack_initiation: 'It ended in a sack, and that burning was the opening of the reckoning, not its answer.',
  conquest: 'It ended in conquest: {victor} held what it had taken.',
  annihilation: 'It ended with a seat that did not outlast the war.',
  fragmentation: 'It ended piecemeal, the coalition falling apart into separate peaces.',
  ruler_change: 'It ended when a court changed hands and the new seat put the war down.',
  exhaustion: 'It ended in exhaustion, with neither court left willing to carry it.',
  terms: 'It ended at the table, with terms written down.',
  not_a_closed_war: 'The record does not yet call this war closed.',
  no_terminal_evidence: 'How it ended is not set down in the record.',
  razing_road_unreconstructable: 'It ended with a burning the record cannot attribute, so the manner is left unsaid.',
});

/** The word for a war whose ending key this build does not recognise. */
const UNKNOWN_ENDING_TELLING = 'How it ended is not set down in the record.';

/** The territorial outcome kinds, as the sentence says them. Closed by the record.
 * @type {Readonly<Record<string, string>>} */
const TERRITORY_WORDS = Object.freeze({
  occupied: 'held',
  razed: 'burned',
});

/**
 * The name a place is remembered by: the LIVE name first, the name it carried at
 * the war's conclusion second, and the id never. A rename re-titles the war; a
 * settlement that has left the canon stays nameable from the record's own label.
 *
 * @param {unknown} id
 * @param {(id: string) => string} nameFor
 * @param {Map<string, string>} labels
 * @returns {string}
 */
function rememberedName(id, nameFor, labels) {
  const key = text(id) || String(id ?? '');
  const live = text(nameFor(key)).trim();
  if (live && live !== key) return live;
  const recorded = text(labels.get(key)).trim();
  if (recorded) return recorded;
  return live || 'a court the record no longer names';
}

/**
 * The banded cost, as one sentence or none. Both halves are persisted KEYS resolved
 * to words here; a key this build does not know contributes silence rather than a
 * wrong band, which is the same refusal both band resolvers make.
 *
 * @param {Record<string, unknown>} cost
 * @param {string} attackerName
 * @param {Array<{ id: string, name: string }>} sides
 * @returns {string}
 */
function costLineOf(cost, attackerName, sides) {
  const clauses = [];
  const remaining = remainingStrengthPhraseFor(text(cost.attackerRemainingBand));
  if (remaining) clauses.push(`${attackerName} came out of it ${remaining}`);
  const bands = recordOf(cost.exhaustionBands);
  const weary = [];
  for (const side of sides) {
    const word = warExhaustionWordFor(bands[side.id]);
    if (word) weary.push(`${side.name} ${word}`);
  }
  if (weary.length) clauses.push(`the realms left it ${weary.join(' and ')}`);
  return clauses.length ? `${clauses.join(', and ')}.` : '';
}

/**
 * What the war did to the map, one sentence per place. Names, a typed action and
 * the court that did it: the news address law, in the past tense.
 *
 * @param {Array<Record<string, unknown>>} outcomes
 * @param {(id: string) => string} nameFor
 * @param {Map<string, string>} labels
 * @returns {string[]}
 */
function territoryLines(outcomes, nameFor, labels) {
  const lines = [];
  for (const outcome of outcomes) {
    const place = text(outcome.settlementId);
    const verb = TERRITORY_WORDS[text(outcome.kind)];
    if (!place || !verb) continue;
    const occupier = text(outcome.occupierId);
    const placeName = rememberedName(place, nameFor, labels);
    const seat = text(outcome.fallenSeatLabel);
    const seatClause = seat ? `, and the seat that fell there was ${seat}` : '';
    lines.push(occupier
      ? `${rememberedName(occupier, nameFor, labels)} ${verb} ${placeName}${seatClause}.`
      : `${placeName} was ${verb}${seatClause}.`);
  }
  return lines;
}

/**
 * The engagement epitomes the record kept, in world words.
 *
 * ⚠ THE KIND IS AN OPEN VOCABULARY and is routed through the general
 * `humanizeToken` chokepoint on purpose: `DISPLAY_LEXICON`'s own header refuses a
 * bucket for the news kinds ("measured at ~200 distinct tokens across 415 emit
 * sites ... a table nobody can keep complete is worse than none"), and this reader
 * does not open a second one.
 *
 * @param {Array<Record<string, unknown>>} engagements
 * @param {(id: string) => string} nameFor
 * @param {Map<string, string>} labels
 * @returns {string[]}
 */
function engagementLines(engagements, nameFor, labels) {
  const lines = [];
  for (const engagement of engagements) {
    const kind = humanizeToken(text(engagement.kind));
    if (!kind) continue;
    const region = text(engagement.region);
    lines.push(region
      ? `${kind}, at ${rememberedName(region, nameFor, labels)}.`
      : `${kind}.`);
  }
  return lines;
}

/**
 * ONE concluded war, as the realm remembers it.
 *
 * @param {Record<string, unknown>} record
 * @param {number|null} nowTick
 * @param {(id: string) => string} nameFor
 * @param {boolean} seesSecrets
 * @returns {{
 *   id: string, name: string, line: string, endingKey: string|null,
 *   endingLine: string, whenLabel: string, ranLabel: string, costLine: string,
 *   territory: string[], engagements: string[], allies: string[],
 *   staged: boolean, stagedNote: string,
 *   receipts: Array<{ id: string, label: string, detail: string }>,
 *   receiptsRedacted: boolean,
 * }}
 */
function remembranceRow(record, nowTick, nameFor, seesSecrets) {
  const pair = Array.isArray(record.originPair) ? record.originPair.map((id) => text(id)) : [];
  const attackerId = text(record.originAttackerId);
  const defenderId = pair.find((id) => id !== attackerId) || '';

  const participants = recordsOf(record.participants);
  /** @type {Map<string, string>} */
  const labels = new Map();
  for (const participant of participants) {
    const label = text(participant.label);
    if (label) labels.set(text(participant.id), label);
  }

  const attackerName = rememberedName(attackerId, nameFor, labels);
  const defenderName = rememberedName(defenderId, nameFor, labels);
  const named = deriveWarName({
    attackerId,
    defenderId,
    reasonType: pinnedWarReasonOf(record),
    nameFor: (id) => rememberedName(id, nameFor, labels),
  });

  // THE ENDING IS ASKED FOR, NEVER RECOMPUTED. The fact block is the classifier's
  // persisted input; the orientation it deliberately does not store is supplied here.
  const verdict = classifyWarEnding(
    /** @type {Parameters<typeof classifyWarEnding>[0]} */ ({
      ...recordOf(record.fact),
      attackerId,
      defenderId,
    }),
  );
  const tellingKey = verdict.ending || verdict.reason;
  const victorName = text(record.victorId)
    ? rememberedName(record.victorId, nameFor, labels)
    : attackerName;
  const endingLine = (WAR_ENDING_TELLINGS[tellingKey] || UNKNOWN_ENDING_TELLING)
    .replace('{victor}', victorName);

  const openedTick = wholeTick(record.openedTick);
  const concludedTick = wholeTick(record.concludedTick);
  const ranBand = openedTick != null && concludedTick != null
    ? warTurningBandKey(concludedTick - openedTick)
    : 'unrecorded';
  const agoBand = nowTick != null && concludedTick != null
    ? warTurningBandKey(nowTick - concludedTick)
    : 'unrecorded';

  const sides = [
    { id: attackerId, name: attackerName },
    ...(defenderId ? [{ id: defenderId, name: defenderName }] : []),
  ];
  const allies = participants
    .filter((participant) => text(participant.side).endsWith('_ally'))
    .map((participant) => rememberedName(participant.id, nameFor, labels))
    .sort(codepoint);

  // THE RECEIPTS SEAM, the RoadScenePanel idiom the sibling register door already
  // uses: the war and its ending are the world's own facts and ship to every
  // audience; the ledger key and the mechanical close road are the keeper's record
  // and are NEVER BUILT for an unproven session.
  const receipts = [];
  if (seesSecrets) {
    const warId = text(record.warId);
    if (warId) receipts.push({ id: 'ledger', label: 'In the ledger', detail: warId });
    const closeRoad = text(recordOf(record.fact).closeRoad);
    if (closeRoad) {
      receipts.push({ id: 'road', label: 'The road it closed on', detail: humanizeToken(closeRoad) });
    }
    if (verdict.evidence) {
      receipts.push({ id: 'evidence', label: 'Read from', detail: verdict.evidence });
    }
  }

  const staged = record.sealed === false;
  return {
    id: text(record.warId),
    name: named.name,
    line: named.line,
    endingKey: verdict.ending,
    endingLine,
    whenLabel: ENDED_WORDS[agoBand],
    ranLabel: RAN_WORDS[ranBand],
    costLine: costLineOf(recordOf(record.cost), attackerName, sides),
    territory: territoryLines(recordsOf(record.territorialOutcomes), nameFor, labels),
    engagements: engagementLines(recordsOf(record.notableEngagements), nameFor, labels),
    allies,
    staged,
    // A staged record is a war whose negotiated facts may still be arriving. Saying
    // so is honest; showing a sealed reading of it would not be.
    stagedNote: staged ? 'The account of it is still being written down.' : '',
    receipts,
    receiptsRedacted: !seesSecrets,
  };
}

/**
 * THE REMEMBRANCE ROSTER — every war the realm has written down, newest first.
 *
 * Returns [] for a world that never opened the ledger, so a DARK campaign renders
 * exactly as it does today: the flag is read nowhere in this module, because the
 * ledger key is simply absent until the writer's own gate opens it.
 *
 * @param {Object} args
 * @param {unknown} [args.worldState]
 * @param {(id: string) => string} [args.nameFor]  live-name resolver; the record's
 *   own recorded label is the fallback, and an id never reaches the page.
 * @param {boolean} [args.seesSecrets]  a proven owner session (viewerSeesDmSecrets)
 * @returns {Array<ReturnType<typeof remembranceRow>>}
 */
export function concludedWarRows({ worldState, nameFor = (id) => String(id), seesSecrets = false } = {}) {
  const state = recordOf(worldState);
  const ledger = recordOf(state.concludedWars);
  const nowTick = wholeTick(state.tick);
  const keys = Object.keys(ledger).sort(codepoint);
  const rows = keys.map((key) => remembranceRow(recordOf(ledger[key]), nowTick, nameFor, seesSecrets));
  // Newest first: a remembrance reads back from the present. The codepoint key order
  // above is the tiebreak, so the roster is stable for a fixed world.
  return rows
    .map((row, index) => ({ row, index, at: wholeTick(recordOf(ledger[keys[index]]).concludedTick) ?? 0 }))
    .sort((a, b) => (b.at - a.at) || (a.index - b.index))
    .map((entry) => entry.row);
}

/**
 * THE BOUND-BOOK PROJECTION — the same rows as flat lines for the World Book's
 * State of the Realm chapter, which paints one string per line and cannot show a
 * card. One deriver, two renders: the chapter can never disagree with the door.
 *
 * @param {ReadonlyArray<ReturnType<typeof remembranceRow>>} rows
 * @returns {string[]}
 */
export function warRemembranceChapterLines(rows) {
  return (Array.isArray(rows) ? rows : []).map((row) => {
    const parts = [row.line, row.endingLine, row.whenLabel];
    if (row.stagedNote) parts.push(row.stagedNote);
    return parts.filter((part) => text(part) !== '').join(' ');
  });
}
