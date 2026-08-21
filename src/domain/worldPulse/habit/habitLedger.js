/**
 * habitLedger.js — HB-2. THE HABIT SUB-LEDGER AND ITS ONE WRITER.
 *
 * Where a conditioned court's learned contrasts are STORED. It computes no habit, decides
 * nothing with one, and classifies no circumstance — the class arrives as an ARGUMENT.
 *
 * ⛔ DARK. `writeHabits` exists and nothing in `src/` calls it. That is the wave's identity
 * claim rather than an omission: with `habitConditioningEnabled` absent or false the writer
 * returns the INPUT `worldState` REFERENCE — not a copy, not an equal object — so
 * `setSpatialLedger`, which is what CREATES the namespace, is unreachable. The gate returns
 * FIRST, before any allocation.
 *
 * ── THE SHAPE ───────────────────────────────────────────────────────────────────
 *
 *   spatialLedgers.habits = {
 *     rows: { <actorId>: { <class>: { <action>: [stockInt, weekStamp] } } },
 *     open: { <pledgeId>: [actorId, class, action, weekStamp] },
 *   }
 *
 * Every value is a JSON scalar. ⚠ NEVER a Map, Set, Symbol, BigInt or Date anywhere in a
 * stock, a pledge or a key — the persist-local, persist-cloud and worker-transport paths all
 * cross real serialization, and an in-memory probe cannot tell a shared reference from a copy.
 *
 * ── THE FOUR LAWS THIS LEAF ENFORCES ────────────────────────────────────────────
 *
 * 1. THE CLOCK LAW. A write that cannot resolve `calendar.elapsedWeeks` writes NOTHING and
 *    returns the input reference. ⚠ It never stamps a 0, which would read as "written at the
 *    dawn of the world" and would age instantly past every sweep.
 * 2. TOTAL ON GARBAGE. An unusable stock resolves to ABSENT, never to a partially healed
 *    number. An empty ledger is not a ledger of zeros; it is an absent key.
 * 3. DROP-WHEN-NEUTRAL, AT FOUR LEVELS — the neutral row, the emptied class, the emptied
 *    actor, and finally the whole sub-ledger, which drops the `spatialLedgers` namespace with
 *    it when it was the last one. This is what keeps an emptied world byte-identical to a
 *    dormant one, and the drop pass runs over the WHOLE ledger rather than only over rows this
 *    call touched, so a world that arrives holding neutrals is normalized on the way out.
 * 4. DETERMINISTIC EVICTION. Rows evict NEAREST-NEUTRAL and the book evicts OLDEST-FIRST, each
 *    with a codepoint tiebreak. ⚠ Insertion order is never consulted, because insertion order
 *    would break replay — which is precisely why the eviction exists in a deterministic engine.
 *
 * ── TWO CONSTRAINTS THAT LOOK LIKE STYLE AND ARE NOT ────────────────────────────
 *
 * ⛔ NO ROUNDING OPERATOR MAY BE SPELLED IN THIS FILE. The habit family holds exactly ONE
 * rounding door, and its walker scans the WHOLE family for a second spelling; this leaf
 * joining the directory doubles that family's size without widening the fence. Every rounding
 * routes through the imported `roundToUnits`, and the eviction compares integers that function
 * already produced. The normalizer and the nearest-neutral distance are exactly where an
 * implementer reaches for one, which is why the point is made here rather than discovered.
 *
 * ⛔ `num` AND `asObject` ARE LOCAL AND MUST STAY LOCAL. `npcLadderState.js` exports both, and
 * importing them would give this leaf a real INTERIOR read — that module matches the interior
 * layer family — which reds its own declared empty `reads` row by name, in both directions.
 *
 * ⚠ NO CIRCUMSTANCE-CLASS TOKEN IS SPELLED HERE, INCLUDING IN THIS COMMENT. A class is
 * validated by calling the vocabulary's own predicate, never by comparing against a name.
 *
 * @enforced-by tests/domain/habitLedger.test.js
 */
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../../spatial/spatialLedgerAccess.js';
import { HABIT_TUNING, roundToUnits } from './habitCurve.js';
import { habitsActive } from './habitGate.js';
import { isCircumstanceClass } from './habitVocabulary.js';

/** The sub-ledger's key inside `spatialLedgers`. The coverage walker resolves this constant. */
export const HABIT_LEDGER_KEY = 'habits';

/** @param {unknown} value @param {number} fallback @returns {number} */
function num(value, fallback) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {unknown[]} */
function asArray(value) {
  return Array.isArray(value) ? value : [];
}

/** Byte-stable iteration order. @param {string} a @param {string} b @returns {number} */
function compareCodepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * THE NORMALIZER, TOTAL ON GARBAGE. Anything that is not a finite number resolves to `null`,
 * meaning ABSENT — never a partially healed value. Everything else passes through the family's
 * one rounding door, so a stored stock is always a whole ten-thousandth unit inside the bounds.
 * @param {unknown} value
 * @returns {number|null}
 */
function normalizeStock(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return roundToUnits(value);
}

/** Distance from neutral, computed on an already-rounded integer. @param {number} stock */
function distanceFromNeutral(stock) {
  const delta = stock - HABIT_TUNING.NEUTRAL_I;
  return delta < 0 ? -delta : delta;
}

/**
 * A defensive deep copy of the row tree, so no prior world is ever mutated.
 * @param {Record<string, unknown>} rows
 * @returns {Record<string, Record<string, Record<string, unknown>>>}
 */
function cloneRows(rows) {
  /** @type {Record<string, Record<string, Record<string, unknown>>>} */
  const out = {};
  for (const actorId of Object.keys(rows)) {
    const byClass = asObject(rows[actorId]);
    /** @type {Record<string, Record<string, unknown>>} */
    const copy = {};
    for (const className of Object.keys(byClass)) copy[className] = { ...asObject(byClass[className]) };
    out[actorId] = copy;
  }
  return out;
}

/**
 * Fold one credit into the row tree. An unknown class, a blank id or an unusable stock is
 * ABSENCE rather than a partial write.
 * @param {Record<string, Record<string, Record<string, unknown>>>} rows
 * @param {unknown} credit
 * @param {number} weeks
 */
function applyCreditRow(rows, credit, weeks) {
  const row = asObject(credit);
  const actorId = String(row.actorId ?? '');
  const className = String(row.circumstanceClass ?? '');
  const action = String(row.action ?? '');
  if (!actorId || !action || !isCircumstanceClass(className)) return;
  const stock = normalizeStock(row.stock);
  if (stock === null) return;
  if (!rows[actorId]) rows[actorId] = {};
  if (!rows[actorId][className]) rows[actorId][className] = {};
  rows[actorId][className][action] = [stock, weeks];
}

/**
 * THE PLEDGE BOOK IS FIRST-WINS. A second open on a live id is refused rather than
 * overwriting, so a duplicated emission cannot silently re-date an episode already running.
 * @param {Record<string, unknown>} open
 * @param {unknown} pledge
 * @param {number} weeks
 */
function openPledge(open, pledge, weeks) {
  const row = asObject(pledge);
  const pledgeId = String(row.pledgeId ?? '');
  const actorId = String(row.actorId ?? '');
  const className = String(row.circumstanceClass ?? '');
  const action = String(row.action ?? '');
  if (!pledgeId || !actorId || !action || !isCircumstanceClass(className)) return;
  if (Object.prototype.hasOwnProperty.call(open, pledgeId)) return;
  open[pledgeId] = [actorId, className, action, weeks];
}

/**
 * THE AGE SWEEP. Past its max age a pledge cannot pay back the decay accrued while its
 * episode ran, so grading it teaches nothing and it is dropped.
 * @param {Record<string, unknown>} open
 * @param {number} weeks
 */
function sweepAgedPledges(open, weeks) {
  for (const pledgeId of Object.keys(open)) {
    const stamp = num(asArray(open[pledgeId])[3], weeks);
    if (weeks - stamp > HABIT_TUNING.PLEDGE_MAX_AGE_WEEKS) delete open[pledgeId];
  }
}

/**
 * ROW EVICTION, NEAREST-NEUTRAL AND DETERMINISTIC. The row carrying the least learning goes
 * first; ties break on the codepoint order of class then action. Insertion order is never read.
 * @param {Record<string, Record<string, unknown>>} byClass
 */
function evictRowsToCap(byClass) {
  /** @type {Array<[string, string]>} */
  const entries = [];
  for (const className of Object.keys(byClass)) {
    for (const action of Object.keys(byClass[className])) entries.push([className, action]);
  }
  const surplus = entries.length - HABIT_TUNING.HABIT_ROWS_PER_ACTOR_CAP;
  if (surplus <= 0) return;
  entries.sort((left, right) => {
    const a = distanceFromNeutral(num(asArray(byClass[left[0]][left[1]])[0], HABIT_TUNING.NEUTRAL_I));
    const b = distanceFromNeutral(num(asArray(byClass[right[0]][right[1]])[0], HABIT_TUNING.NEUTRAL_I));
    if (a !== b) return a - b;
    return compareCodepoint(`${left[0]}\u0000${left[1]}`, `${right[0]}\u0000${right[1]}`);
  });
  for (let index = 0; index < surplus; index += 1) {
    delete byClass[entries[index][0]][entries[index][1]];
  }
}

/**
 * BOOK EVICTION, OLDEST-FIRST. ⚠ This is the book's one SILENT loss — a lapse leaves a
 * receipt and an eviction does not — which is why the cap sits far above ordinary play.
 * @param {Record<string, unknown>} open
 */
function evictBookToCap(open) {
  const ids = Object.keys(open);
  const surplus = ids.length - HABIT_TUNING.PLEDGE_BOOK_CAP;
  if (surplus <= 0) return;
  ids.sort((left, right) => {
    const a = num(asArray(open[left])[3], 0);
    const b = num(asArray(open[right])[3], 0);
    if (a !== b) return a - b;
    return compareCodepoint(left, right);
  });
  for (let index = 0; index < surplus; index += 1) delete open[ids[index]];
}

/**
 * THE DROP PASS — levels 1 to 3 of drop-when-neutral, over the WHOLE tree, emitting keys in
 * codepoint order so the serialized bytes are stable across replay.
 * @param {Record<string, Record<string, Record<string, unknown>>>} rows
 * @returns {Record<string, unknown>}
 */
function pruneRows(rows) {
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const actorId of Object.keys(rows).sort(compareCodepoint)) {
    /** @type {Record<string, unknown>} */
    const keptClasses = {};
    for (const className of Object.keys(rows[actorId]).sort(compareCodepoint)) {
      const actions = asObject(rows[actorId][className]);
      /** @type {Record<string, unknown>} */
      const keptActions = {};
      for (const action of Object.keys(actions).sort(compareCodepoint)) {
        const entry = asArray(actions[action]);
        const stock = normalizeStock(entry[0]);
        if (stock === null || stock === HABIT_TUNING.NEUTRAL_I) continue;
        keptActions[action] = [stock, num(entry[1], 0)];
      }
      if (Object.keys(keptActions).length > 0) keptClasses[className] = keptActions;
    }
    if (Object.keys(keptClasses).length > 0) out[actorId] = keptClasses;
  }
  return out;
}

/**
 * THE ONE WRITER. Every write form in this leaf lives inside this function's own body — a
 * second writer elsewhere in the file would satisfy a file-level scan while breaking the law,
 * which is why the single-writer census asserts FUNCTION SCOPE rather than file scope.
 *
 * @param {Record<string, unknown>} worldState
 * @param {{ credits?: unknown[], opens?: unknown[], closes?: unknown[] }} [changes]
 * @returns {Record<string, unknown>} a new worldState, or the INPUT REFERENCE when dark
 */
export function writeHabits(worldState, changes = {}) {
  if (!habitsActive(worldState)) return worldState;
  const stamp = asObject(asObject(worldState).calendar).elapsedWeeks;
  if (typeof stamp !== 'number' || !Number.isFinite(stamp)) return worldState;

  const prior = asObject(getSpatialLedger(worldState, HABIT_LEDGER_KEY));
  const rows = cloneRows(asObject(prior.rows));
  /** @type {Record<string, unknown>} */
  const open = { ...asObject(prior.open) };

  for (const credit of asArray(changes.credits)) applyCreditRow(rows, credit, stamp);
  for (const pledge of asArray(changes.opens)) openPledge(open, pledge, stamp);
  for (const pledgeId of asArray(changes.closes)) delete open[String(pledgeId)];

  sweepAgedPledges(open, stamp);
  for (const actorId of Object.keys(rows)) evictRowsToCap(rows[actorId]);
  evictBookToCap(open);

  const keptRows = pruneRows(rows);
  /** @type {Record<string, unknown>} */
  const book = {};
  for (const pledgeId of Object.keys(open).sort(compareCodepoint)) book[pledgeId] = open[pledgeId];

  if (Object.keys(keptRows).length === 0 && Object.keys(book).length === 0) {
    return dropSpatialLedger(worldState, HABIT_LEDGER_KEY);
  }
  return setSpatialLedger(worldState, HABIT_LEDGER_KEY, { open: book, rows: keptRows });
}
