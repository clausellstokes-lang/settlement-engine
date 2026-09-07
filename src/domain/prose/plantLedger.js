/**
 * domain/prose/plantLedger.js — D8's LEDGER WALKER (Part B §5, D8), report-only.
 *
 * ── THE RULE IT INSTRUMENTS ────────────────────────────────────────────────────────
 * D8: **every ANSWERABLE plant is answered on the DM page, literally; and a seeded,
 * non-zero share of plants is named as OPEN.** The second half needs a typed `unresolved`
 * class, which the sitting ADDED as a design and which does not exist in the engine today.
 *
 * ── WHAT THIS WALKER FOUND, AND WHY IT REPORTS RATHER THAN FAILS ───────────────────
 * MEASURED at 3b1c0eaa5, and stated here because a walker that quietly returned "0 problems"
 * would be the false green the estate has already burned:
 *
 *   1. THE PLANTS EXIST. `domain/dossier/plotHooks.js` produces them — ~38 per town over
 *      seven categories, each carrying `text`, `source`, `role`, `category`, `priority` and
 *      `links`.
 *   2. **NO PLANT CARRIES AN ID.** D8 says "every answerable PLANT ID has exactly one
 *      [answer]"; there are no plant ids. `links[].id` is the NPC's id, not the hook's. So
 *      this module DERIVES a content id (below) to have something to reconcile against, and
 *      that derived id is report-only and never persisted.
 *   3. **NO ANSWER CHANNEL EXISTS.** There is no `[answer]`, no `[gap-reason]`, and no
 *      `answerable` flag anywhere in `src` (the word appears only as ordinary English inside
 *      authored prose and comments). So the open share is 1.00 on every seed, by
 *      construction rather than by a defect of any town.
 *
 * A constant open share of 1.00 is exactly the condition D8's walker is designed to fail on
 * — and it must NOT fail on it yet, because the spec's own clause says the walker fails on a
 * zero or constant open share **only once the class exists**. Until then this returns
 * NOT-EXECUTABLE naming the three fields it wanted. That is the §908 law applied to a rule
 * keyed on a field no receipt ships.
 *
 * ⛔ THE SEEDED SHARE IS A SEED INPUT and is not implemented here. Making a share of plants
 * open per seed changes what an installed world renders — owner-gated under THE PROMISE, and
 * parked at dossier item 30(e). This module MEASURES; it plants nothing and persists nothing.
 *
 * PURE, HEADLESS.
 *
 * @enforced-by tests/lint/plantLedger.walker.test.js
 */
import { fnv1a32 } from '../../kernel/proseHash.js';

/**
 * The three fields D8's arm needs, none of which the engine holds today. Named here so the
 * NOT-EXECUTABLE verdict says what would make it executable.
 * @type {ReadonlyArray<string>}
 */
export const REQUIRED_FIELDS = Object.freeze([
  'plant.id — a stable identity on the plant itself (today: none; `links[].id` is the NPC\'s)',
  'plant.answerable — the typed flag that makes a plant owe an answer (today: absent)',
  'plant.answer | plant.gapReason — the DM page\'s answer channel (today: neither exists)',
]);

/**
 * A DERIVED, REPORT-ONLY plant id: the category, the source and a content fold of the text.
 *
 * ⛔ NEVER PERSISTED AND NEVER A SEED INPUT. It exists so a ledger has something to reconcile
 * against while the real id is owner-gated. `fnv1a32` is the estate's own zero-draw fold and
 * consumes no PRNG.
 * @param {{text?: unknown, source?: unknown, category?: unknown}} plant
 * @returns {string}
 */
export function plantIdOf(plant) {
  const category = String(plant?.category || 'uncategorised');
  const source = String(plant?.source || '-');
  return `${category}:${source}:${fnv1a32(String(plant?.text || '')).toString(16)}`;
}

/**
 * @typedef {object} PlantRow
 * @property {string} id
 * @property {string} category
 * @property {string} source
 * @property {boolean} answerable
 * @property {boolean} answered
 * @property {boolean} hasGapReason
 */

/**
 * The ledger for one settlement's plants.
 * @param {ReadonlyArray<Record<string, unknown>>} plants the hooks, as `collectPlotHooks`
 *   returns them
 * @param {{answers?: Record<string, string>, gapReasons?: Record<string, string>}} [ledger]
 *   the DM page's answer channel, when one exists
 * @returns {{rows: PlantRow[], answerable: number, answered: number, gapReasons: number,
 *   openShare: number|null, duplicates: string[], notExecutable: string[]}}
 */
export function plantLedgerOf(plants, ledger = {}) {
  const answers = ledger.answers || {};
  const gapReasons = ledger.gapReasons || {};
  /** @type {PlantRow[]} */
  const rows = [];
  /** @type {Map<string, number>} */
  const seen = new Map();
  for (const plant of plants || []) {
    const id = plantIdOf(plant);
    seen.set(id, (seen.get(id) || 0) + 1);
    rows.push({
      id,
      category: String(plant?.category || ''),
      source: String(plant?.source || ''),
      // ⚠ `answerable` is READ, never inferred. A walker that guessed which plants owe an
      // answer would be authoring the rule it is meant to check.
      answerable: plant?.answerable === true,
      answered: typeof answers[id] === 'string' && answers[id].trim() !== '',
      hasGapReason: typeof gapReasons[id] === 'string' && gapReasons[id].trim() !== '',
    });
  }
  const answerable = rows.filter((r) => r.answerable);
  const answered = answerable.filter((r) => r.answered).length;
  const withGap = answerable.filter((r) => r.hasGapReason).length;
  /** @type {string[]} */
  const notExecutable = [];
  if (answerable.length === 0) {
    notExecutable.push(
      'no plant carries `answerable: true` — D8\'s arm has no subject, so the open share is'
      + ' not a measurement of this town but of the missing class. Wanted: '
      + REQUIRED_FIELDS.join(' · '),
    );
  }
  return {
    rows,
    answerable: answerable.length,
    answered,
    gapReasons: withGap,
    openShare: answerable.length ? (answerable.length - answered - withGap) / answerable.length : null,
    duplicates: [...seen].filter(([, n]) => n > 1).map(([id]) => id),
    notExecutable,
  };
}

/**
 * THE D8 ARM. Every answerable plant must carry EXACTLY ONE of an answer or a gap-reason —
 * never both, never neither.
 * @param {ReturnType<typeof plantLedgerOf>} ledger
 * @returns {{fails: string[], notes: string[], notExecutable: string[]}}
 */
export function walkPlantLedger(ledger) {
  /** @type {string[]} */
  const fails = [];
  /** @type {string[]} */
  const notes = [];
  for (const row of ledger.rows) {
    if (!row.answerable) continue;
    if (row.answered && row.hasGapReason) {
      fails.push(`${row.id}: carries BOTH an answer and a gap-reason — D8 says exactly one`);
    } else if (!row.answered && !row.hasGapReason) {
      fails.push(`${row.id}: answerable and carries NEITHER an answer nor a gap-reason`);
    }
  }
  for (const id of ledger.duplicates) {
    notes.push(`${id}: two plants fold to one derived id — the derived id is a content fold and`
      + ' two identical plants are indistinguishable to it; a real plant id would separate them');
  }
  return { fails, notes, notExecutable: ledger.notExecutable };
}
