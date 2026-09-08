/**
 * domain/prose/plantLedger.js — D8's LEDGER WALKER (Part B §5, D8), report-only.
 *
 * ── THE RULE IT INSTRUMENTS ────────────────────────────────────────────────────────
 * D8: **every ANSWERABLE plant is answered on the DM page, literally; and a seeded,
 * non-zero share of plants is named as OPEN.** The second half needs a typed `unresolved`
 * class, which the sitting ADDED as a design and which does not exist in the engine today.
 *
 * ── WHAT THIS WALKER FOUND, AND WHY IT REPORTS RATHER THAN FAILS ───────────────────
 * MEASURED at 3b1c0eaa5, and stated here because a walker that quietly reported a clean sweep
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
 * ── D8's PROVISO IS CODE HERE, NOT A SENTENCE IN A RECEIPT (Part B §18; SITTING §L.2/72) ──
 * The receipt's car-6 claim — "a constant open share of 1.00 is exactly the condition D8's
 * walker is designed to fail on" — was FALSE of this module as car 6 shipped it: no open-share
 * arm existed in either direction, an executed control at open share 0 returned `fails []`,
 * and the cross-seed limb was implemented nowhere. And the "only once the class exists"
 * proviso is not in D8's Statement at all; it was the brief's sentence. The chair AMENDED D8
 * in its own words instead, and this module now carries the amendment:
 *
 *   the walker REPORTS while no plant class exists in the shipped corpus, and FAILS on a zero
 *   or constant open share once ANY plant is authored — the class-existence GUARD, in code.
 *
 * So `walkPlantLedger` fails on a zero open share behind `ledger.answerable > 0`, and
 * `walkPlantLedgersAcrossSeeds` carries the constant-across-seeds limb the single-ledger arm
 * cannot see. Both are proved on fixtures that carry the class, because a guard nothing ever
 * passes through is a guard nobody has measured.
 *
 * ⛔ THE SEEDED SHARE IS A SEED INPUT and is not implemented here. Making a share of plants
 * open per seed changes what an installed world renders — owner-gated under THE PROMISE, and
 * parked at dossier item 30(e). This module MEASURES; it plants nothing and persists nothing.
 *
 * PURE, HEADLESS.
 *
 * @enforced-by tests/lint/proseMeasures.walker.test.js
 */
import { fnv1a32 } from '../../kernel/proseHash.js';

/**
 * The three fields D8's arm needs, none of which the engine holds today. Named here so the
 * NOT-EXECUTABLE verdict says what would make it executable.
 * @type {ReadonlyArray<string>}
 */
export const REQUIRED_FIELDS = Object.freeze([
  'plant.id: a stable identity on the plant itself (today: none; `links[].id` is the NPC\'s)',
  'plant.answerable: the typed flag that makes a plant owe an answer (today: absent)',
  'plant.answer | plant.gapReason: the DM page\'s answer channel (today: neither exists)',
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
 *   closed: number, openShare: number|null, namedOpenShare: number|null,
 *   duplicates: string[], notExecutable: string[]}}
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
  // ⚠ A PLANT CARRYING BOTH IS CLOSED ONCE, NOT TWICE, AND THE FIRST CUT SUBTRACTED IT TWICE.
  // `(answerable - answered - withGap)` reads −1 on a single plant holding an answer AND a
  // gap-reason — a share outside [0, 1] that any future arm would have read as a number. The
  // shape is a defect D8 itself names (exactly one of the two), so the ledger reports it as a
  // FAIL through `walkPlantLedger` and still computes an open share inside the interval.
  const closed = answerable.filter((r) => r.answered || r.hasGapReason).length;
  /** @type {string[]} */
  const notExecutable = [];
  if (answerable.length === 0) {
    notExecutable.push(
      'no plant carries `answerable: true`; D8\'s arm has no subject, so the open share is'
      + ' not a measurement of this town but of the missing class. Wanted: '
      + REQUIRED_FIELDS.join(' · '),
    );
  }
  return {
    rows,
    answerable: answerable.length,
    answered,
    gapReasons: withGap,
    closed,
    openShare: answerable.length ? (answerable.length - closed) / answerable.length : null,
    // ⭐ TWO SHARES, BECAUSE D8 HAS TWO HALVES AND THEY READ DIFFERENT CHANNELS. `openShare`
    // is the share of answerable plants carrying NEITHER channel — the first half's defect
    // rate, and the figure cure 10 pinned inside [0, 1]. `namedOpenShare` is the share
    // carrying a GAP-REASON: the second half's subject, "a seeded, non-zero share of plants
    // is named as OPEN". A ledger can satisfy the first half perfectly and still hold nothing
    // open, and only the second figure can see that.
    namedOpenShare: answerable.length ? withGap / answerable.length : null,
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
      fails.push(`${row.id}: carries BOTH an answer and a gap-reason; D8 says exactly one`);
    } else if (!row.answered && !row.hasGapReason) {
      fails.push(`${row.id}: answerable and carries NEITHER an answer nor a gap-reason`);
    }
  }
  for (const id of ledger.duplicates) {
    notes.push(`${id}: two plants fold to one derived id; the derived id is a content fold and`
      + ' two identical plants are indistinguishable to it; a real plant id would separate them');
  }
  // ── THE OPEN-SHARE ARM, BEHIND THE CLASS-EXISTENCE GUARD ──────────────────────────
  // D8 as the chair amended it: zero (or constant) open share FAILS once any plant is
  // authored. With no answerable plant the guard is shut and `ledger.notExecutable` already
  // carries the reason, so the arm is silent WITHOUT ever having been a pass.
  if (ledger.answerable > 0) {
    if (!(Number.isFinite(ledger.openShare) && Number(ledger.openShare) >= 0 && Number(ledger.openShare) <= 1)) {
      fails.push(`open share ${String(ledger.openShare)} lies outside [0, 1]; a plant carrying`
        + ' both an answer and a gap-reason must be counted closed ONCE');
    } else if (ledger.namedOpenShare === 0) {
      fails.push(`nothing is named OPEN over ${ledger.answerable} answerable plant(s); D8 wants a`
        + ' SEEDED, NON-ZERO share named as open, and a record that answers everything is a'
        + ' record with nothing left to find');
    }
  }
  return { fails, notes, notExecutable: ledger.notExecutable };
}

/**
 * D8's SECOND LIMB — the share must VARY ACROSS SEEDS, which one ledger cannot show.
 *
 * ⭐ THE LIMB EXISTS BECAUSE A SINGLE-LEDGER WALKER CANNOT SEE IT, and car 6 reported the limb
 * as though it had. A constant share across seeds is the seeded-openness rule failing in the
 * one way a per-town arm is blind to: every town answers the same proportion, which is a
 * constant wearing a seed's coat.
 * @param {ReadonlyArray<ReturnType<typeof plantLedgerOf>>} ledgers one per seed
 * @returns {{fails: string[], notes: string[], notExecutable: string[]}}
 */
export function walkPlantLedgersAcrossSeeds(ledgers) {
  /** @type {string[]} */
  const fails = [];
  /** @type {string[]} */
  const notes = [];
  /** @type {string[]} */
  const notExecutable = [];
  const withClass = (ledgers || []).filter((l) => l && l.answerable > 0);
  if (withClass.length < 2) {
    notExecutable.push(`${withClass.length} of ${(ledgers || []).length} ledger(s) carry an`
      + ' answerable plant; the cross-seed limb needs at least two, so it declares itself'
      + ` not-executable rather than answering []. Wanted: ${REQUIRED_FIELDS[1]}`);
    return { fails, notes, notExecutable };
  }
  const shares = withClass.map((l) => Number(l.namedOpenShare));
  const distinct = [...new Set(shares.map((v) => v.toFixed(6)))];
  if (distinct.length === 1) {
    fails.push(`the named-open share is ${shares[0].toFixed(3)} on all ${shares.length} seeds.`
      + ' D8 wants a SEEDED share, and a share that never moves is a constant the seed does'
      + ' not reach');
  } else {
    notes.push(`named-open share varies across ${shares.length} seeds: ${distinct.join(' · ')}`);
  }
  return { fails, notes, notExecutable };
}
