/**
 * domain/prose/epochRecord.js — THE EPOCH RECORD (W1 deliverable 2;
 * DESIGN_SCRIBE_GENERATION_TIME_PROSE §5b, SCRIBE-RULINGS item 13).
 *
 * THE OWNER'S RULE, verbatim (2026-09-14 ~06:1x): "when advance time happens, the program reads
 * the new town card, the history of town cards, and what happened last … This is essentially the
 * narrative overlay set as default and without prose already constructed for it to refine … how
 * it reads past settlements data to make things remain coherent."
 *
 * READ AS: the artefact is write-once PER EPOCH. The Scribe renders epoch k from (card_k, the
 * history card_0..k-1 AS TYPED DELTAS, the typed record of advance k) and NEVER from its own
 * prior prose. That is the whole reason this file exists: coherence has to come from the
 * ENGINE'S history rather than from a model re-reading its own words, because a model re-reading
 * its own words compounds drift and an engine's typed delta cannot.
 *
 * ── ⭐⭐ WHAT `cardDelta` IS FOR, AND WHY IT MUST NAME NOTHING ELSE ─────────────────
 * It is the licence for one sentence class. Floor 2 (the elapsed course) lets a face say "since
 * the last survey" ONLY over a field the delta names; `refuteUnit.js`'s EPOCH arm reads
 * `delta.fields` and FAILS an elapsed course over a field that did not move. So a delta that
 * over-reports licenses a false history, and a delta that under-reports refuses a true one. It
 * is therefore built to name TYPED FIELDS and their before and after values, keyed by PATH, and
 * nothing else: no prose, no derived summary, no count that is not a count of the rows above it.
 *
 * ── ⛔ THREE LISTS ARE KEYED AND NOT INDEXED, AND THAT IS THE DESIGN ────────────────
 * A positional diff over `town.institutions` reports every row below an insertion as changed.
 * Three of the card's lists are records with a natural key, so they are diffed BY THAT KEY:
 *   `town.institutions`  by `name`  -> the roster rows added and removed, which is what §5b asks
 *   `town.roles`         by `source`
 *   `pools`              by `blockId :: poolKey` -> the pools that STARTED and STOPPED firing
 * Everything else is compared by path, primitive by primitive. `page` is EXCLUDED from the field
 * diff and reported only as a line count: it is a rendering of the two lists above and diffing it
 * would report every fact twice, once as a field and once as the sentence carrying it.
 *
 * ── ⚠ THE EPOCH KEY IS THE CAMPAIGN'S, BECAUSE THE BLOB HAS NONE ───────────────────
 * W0 measured this and it is the reason the card carries `epoch` at all: `history.age` is FROZEN
 * at generation and no advance counter, nonce or epoch field lives on a settlement. So the epoch
 * is `worldState.tick`, which reaches the card through `options.world`, and a card built without
 * a world carries `epoch.tick: null` and `advanced: false`. Two such cards have NO epoch to
 * record and this module says so rather than inventing a sequence.
 *
 * PURE and HEADLESS: no clock, no RNG, no store, no file system, no DOM.
 *
 * @enforced-by tests/domain/epochRecord.test.js
 */
import { compareCodepoint } from '../deterministicSort.js';

/** The record's schema id. A shape change takes the next number and says why. */
export const EPOCH_RECORD_SCHEMA = 'scribe-epoch-record/1';

/**
 * ⭐ THE ONE RECORD BUILDER, the same one `townCard.js` uses and for the same measured reason:
 * the census's `producerCitations` reads every `Property` key under `src/domain/**` as a WRITE of
 * world state, so no record this module returns carries a non-computed key. It sorts, so the
 * output is key-sorted at every level and two builds of one pair are byte-equal.
 */
const rec = (pairs) => Object.fromEntries(
  pairs.filter(([, v]) => v !== undefined).sort((a, b) => compareCodepoint(a[0], b[0])),
);

/** @param {unknown} v @returns {boolean} */
const isRecord = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/**
 * THE KEYED LISTS. A path whose value is an array of records with a natural key is diffed by that
 * key rather than by position. See the header on why.
 * @type {ReadonlyArray<{path: string, by: ReadonlyArray<string>}>}
 */
export const KEYED_LISTS = Object.freeze([
  Object.freeze({ path: 'town.institutions', by: Object.freeze(['name']) }),
  Object.freeze({ path: 'town.roles', by: Object.freeze(['source']) }),
  Object.freeze({ path: 'pools', by: Object.freeze(['blockId', 'poolKey']) }),
  Object.freeze({ path: 'mounts', by: Object.freeze(['mount']) }),
  Object.freeze({ path: 'lastAdvance.outcomes', by: Object.freeze(['id']) }),
]);

/** The paths whose contents are a RENDERING of other paths and are therefore not field-diffed. */
export const DERIVED_PATHS = Object.freeze(['page']);

/** @param {object} row @param {ReadonlyArray<string>} by @returns {string} */
const keyOf = (row, by) => by.map((k) => String(row?.[k] ?? '')).join(' :: ');

/** @param {string} path @returns {{by: ReadonlyArray<string>}|null} */
function keyRuleFor(path) {
  // A pool's own sub-lists ride under a keyed parent, so the rule is matched on the path with
  // every keyed segment collapsed: `pools[DS-DEF-2 :: x].fields` matches the rule for
  // `pools.fields` when one exists, and otherwise falls through to the positional compare.
  const bare = path.replace(/\[[^\]]*\]/g, '');
  return KEYED_LISTS.find((rule) => rule.path === bare) || null;
}

/**
 * A value as the delta prints it. A primitive rides whole; a container is summarised, because a
 * delta row is a sentence's licence and a forty-row array is not a licence anybody can read.
 * @param {unknown} value
 * @returns {string|number|boolean|null}
 */
export function deltaValue(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) return `[${value.length} rows]`;
  return `{${Object.keys(value).sort(compareCodepoint).join(', ')}}`;
}

/**
 * The deep walk. Every leaf whose value differs is pushed as one row naming its PATH.
 * @param {unknown} before @param {unknown} after @param {string} path
 * @param {{moved: Array<object>, added: string[], removed: string[]}} out
 */
function walk(before, after, path, out) {
  if (DERIVED_PATHS.includes(path)) return;
  if (before === after) return;
  if (Array.isArray(before) && Array.isArray(after)) {
    const rule = keyRuleFor(path);
    if (rule) {
      const left = new Map(before.map((row) => [keyOf(row, rule.by), row]));
      const right = new Map(after.map((row) => [keyOf(row, rule.by), row]));
      for (const key of [...left.keys()].sort(compareCodepoint)) {
        if (right.has(key)) walk(left.get(key), right.get(key), `${path}[${key}]`, out);
        else out.removed.push(`${path}[${key}]`);
      }
      for (const key of [...right.keys()].sort(compareCodepoint)) {
        if (!left.has(key)) out.added.push(`${path}[${key}]`);
      }
      return;
    }
    if (before.length !== after.length) {
      out.moved.push(rec([
        ['path', `${path}.length`],
        ['before', before.length],
        ['after', after.length],
      ]));
    }
    for (let i = 0; i < Math.max(before.length, after.length); i += 1) {
      walk(before[i], after[i], `${path}[${i}]`, out);
    }
    return;
  }
  if (isRecord(before) && isRecord(after)) {
    const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort(compareCodepoint);
    for (const key of keys) walk(before[key], after[key], path === '' ? key : `${path}.${key}`, out);
    return;
  }
  const wasValue = deltaValue(before);
  const nowValue = deltaValue(after);
  if (wasValue === nowValue) return;
  out.moved.push(rec([['path', path], ['before', wasValue], ['after', nowValue]]));
}

/**
 * ⭐⭐ THE DELTA BETWEEN TWO TOWN CARDS — every typed field that moved, and nothing else.
 *
 * @param {object} prev the earlier card
 * @param {object} next the later card
 * @returns {{schema: string, moved: Array<{path: string, before: unknown, after: unknown}>,
 *   fields: Record<string, {before: unknown, after: unknown}>, added: string[], removed: string[],
 *   poolsStarted: string[], poolsStopped: string[], rosterAdded: string[], rosterRemoved: string[],
 *   pageLines: {before: number, after: number}, counts: {moved: number, added: number,
 *   removed: number}, empty: boolean}}
 */
export function cardDelta(prev, next) {
  /** @type {{moved: Array<object>, added: string[], removed: string[]}} */
  const out = { moved: [], added: [], removed: [] };
  walk(prev || {}, next || {}, '', out);
  out.moved.sort((a, b) => compareCodepoint(String(a.path), String(b.path)));
  out.added.sort(compareCodepoint);
  out.removed.sort(compareCodepoint);
  const named = (list, prefix) => list.filter((p) => p.startsWith(prefix))
    .map((p) => p.slice(prefix.length + 1, -1));
  const fields = rec(out.moved.map((row) => [
    String(row.path),
    rec([['before', row.before], ['after', row.after]]),
  ]));
  const pageOf = (card) => (Array.isArray(card?.page) ? card.page.length : 0);
  return rec([
    ['schema', EPOCH_RECORD_SCHEMA],
    ['moved', out.moved],
    // ⭐ THE SAME ROWS KEYED BY PATH, because that is the shape the refuter's EPOCH arm reads and
    // a consumer that had to scan an array to answer "did this field move" would scan it once per
    // clause of every face on the page.
    ['fields', fields],
    ['added', out.added],
    ['removed', out.removed],
    ['poolsStarted', named(out.added, 'pools')],
    ['poolsStopped', named(out.removed, 'pools')],
    ['rosterAdded', named(out.added, 'town.institutions')],
    ['rosterRemoved', named(out.removed, 'town.institutions')],
    ['pageLines', rec([['before', pageOf(prev)], ['after', pageOf(next)]])],
    ['counts', rec([
      ['moved', out.moved.length], ['added', out.added.length], ['removed', out.removed.length],
    ])],
    ['empty', out.moved.length === 0 && out.added.length === 0 && out.removed.length === 0],
  ]);
}

/**
 * One typed event of the campaign's own log, as the record carries it. The log is the estate's
 * receipted, typed record (`settlementSlice.js:674-700`); nothing here re-words it.
 * @param {object} entry
 * @returns {object}
 */
function eventRow(entry) {
  return rec([
    ['id', String(entry?.id ?? '')],
    ['tick', typeof entry?.tick === 'number' ? entry.tick : null],
    ['type', String(entry?.type ?? entry?.kind ?? '')],
    ['ruleId', String(entry?.ruleId ?? '')],
    ['headline', String(entry?.headline ?? '')],
    ['summary', String(entry?.summary ?? '')],
    ['settlementId', String(entry?.settlementId ?? entry?.saveId ?? '')],
  ]);
}

/**
 * ⭐⭐ THE EPOCH RECORD — what the Scribe is told about the advance that produced `nextCard`.
 *
 * ⛔ PLAIN DATA IN THE ENGINE'S OWN TYPED VOCABULARY, AND NO PROSE. The model is told WHAT MOVED
 * and WHAT HAPPENED; it is never told how to say either, and it is never shown what it said last
 * time. §5b's whole point is that the coherence comes from here.
 *
 * ⛔ `events` IS FILTERED TO THIS TOWN AND TO THIS EPOCH'S SPAN. A campaign log carries every
 * settlement's rows and every tick's; a card is about one town at one tick, and handing the model
 * the region's whole log would licence a face about a neighbour the card does not name.
 *
 * @param {object} prevCard the card of epoch k-1, or null for the first epoch
 * @param {object} nextCard the card of epoch k
 * @param {object} [campaignState] the owning campaign's state, for `eventLog`
 * @returns {{schema: string, advanceSeq: number|null, from: number|null, to: number|null,
 *   delta: object, events: Array<object>, pulse: object|null, isFirstEpoch: boolean}}
 */
export function epochRecord(prevCard, nextCard, campaignState) {
  const from = typeof prevCard?.epoch?.tick === 'number' ? prevCard.epoch.tick : null;
  const to = typeof nextCard?.epoch?.tick === 'number' ? nextCard.epoch.tick : null;
  const townId = String(nextCard?.town?.id ?? '');
  const log = Array.isArray(campaignState?.eventLog) ? campaignState.eventLog : [];
  const mine = log.filter((entry) => {
    const owner = String(entry?.settlementId ?? entry?.saveId ?? townId);
    if (owner !== townId) return false;
    if (typeof entry?.tick !== 'number') return true;
    if (from !== null && entry.tick <= from) return false;
    if (to !== null && entry.tick > to) return false;
    return true;
  });
  // THE PULSE IS THE CARD'S OWN `lastAdvance`, which W0 harvested from `worldState.pulseHistory`
  // and filtered to this town. It is carried here rather than re-read so the record and the card
  // can never disagree about what the last advance was.
  const pulse = nextCard?.lastAdvance || null;
  return rec([
    ['schema', EPOCH_RECORD_SCHEMA],
    // The epoch key. `advanceSeqByCampaign` is the session counter the push site increments and
    // it does not reach a domain leaf, so the tick is the key the card can actually carry; a
    // caller holding the counter passes it through `campaignState.advanceSeq`.
    ['advanceSeq', typeof campaignState?.advanceSeq === 'number' ? campaignState.advanceSeq : to],
    ['from', from],
    ['to', to],
    ['delta', cardDelta(prevCard, nextCard)],
    ['events', mine.map(eventRow)],
    ['pulse', pulse],
    ['isFirstEpoch', prevCard === null || prevCard === undefined],
  ]);
}

/** The record as the bytes that cross the boundary, so one serialisation is measured. */
export const epochRecordJson = (record) => JSON.stringify(record);
