/**
 * lib/scribeEpochStamp.js — THE EPOCH RECORD IS COMPUTED AT ADVANCE TIME (chair ruling 21;
 * DESIGN_SCRIBE_GENERATION_TIME_PROSE §5b).
 *
 * ── ⛔⛔ THE GAP THIS CLOSES, IN W2's OWN WORDS ──────────────────────────────────────
 * `scribeTransport.js` shipped with `record: null` on every render and a comment saying why: §5b
 * wants epoch k rendered from the prior cards as typed deltas, the past lane is COMPACT by the
 * same design (units only, no card), and so a prior card cannot be rebuilt from the artefact once
 * the settlement has moved. The render is at the OPEN (rule 14), which may be a week and a reload
 * after the advance. There is therefore exactly ONE moment at which both sides of the delta exist
 * at once, and it is the advance itself. This module is that moment.
 *
 * ── ⭐⭐ THE TWO CARDS ARE BUILT FROM THE TWO SETTLEMENTS, NOT READ OFF THE BLOB ─────
 * JUDGMENT (vetoable): the brief's letter is `epochRecord(prose.current.card, townCard(newState))`,
 * which would need the rendered card kept on `current`. It is not kept there today and it is NOT
 * added here. MEASURED: one tab's card is 42-47 KB and a settlement fires six of them, so keeping
 * the render's cards would put a quarter of a megabyte of card bytes on a save row whose account
 * transfer already refuses four of seven real generated towns on the 20,000-node budget (ruling
 * 24). The advance path holds BOTH settlements in one function — the pre-advance member saves it
 * cloned for the pulse, and the post-advance ones the pulse returned — and the card is a pure
 * function of the settlement. So the prior card is BUILT, not stored, and the blob carries only
 * the record, which is small.
 *
 * ── ⭐ THE CARD PAIR IS THE TAB-FREE CARD, AND THAT IS A DELIBERATE NARROWING ───────
 * JUDGMENT (vetoable): `townCard(s, {tab: ''})` renders no page and therefore carries no `pools`,
 * but carries `town`, `epoch` and `lastAdvance` WHOLE — the sections that are byte-identical on
 * every one of the thirteen tabs. That is the right grain for this record for two reasons and one
 * measurement:
 *   · ONE record is sent with EVERY tab's render, so a record whose contents differed per tab
 *     would be wrong on twelve of them;
 *   · what a reader means by "what has moved since the last survey" is the roster, the roles, the
 *     institutions, the holders, the bodies, the forces and the clock — all of which are `town`
 *     and `epoch`;
 *   · MEASURED on a generated town: the tab-free card is 2 ms and 10.9 KB, while all thirteen tabs
 *     are 62 ms and ~500 KB. Two full card sets per settlement per advance would be ~124 ms a town,
 *     which is 3.7 s of main-thread work for a thirty-town realm, for a per-pool delta that is
 *     wrong on every tab but one.
 * WHAT IS THEREFORE NOT IN THE RECORD, said plainly rather than left to be discovered: the
 * per-pool rows — `poolsStarted`, `poolsStopped` and the per-pool field moves — are always empty
 * on a record built here. The refuter's EPOCH arm reads `delta.fields`, which is populated; a pool
 * that started or stopped firing is a fact the writer's own card already tells it, because the
 * card it is writing from lists exactly the pools that fire now.
 *
 * ── ⭐ TWO ADVANCES AND ONE SURVEY ──────────────────────────────────────────────────
 * A realm is advanced and only some of its towns are opened, so a settlement can take two or five
 * advances between surveys. The record parked by the last advance alone would describe the last
 * advance, and "since the last survey" would then name the wrong before. So an existing pending
 * record is COMPOSED with the fresh one (`mergeEpochRecords`), keeping the older `before` and the
 * newer `after`, and a field that moved and moved back drops out of the merge entirely.
 *
 * ⛔ LAZY BY CONTRACT. It imports the town card, which pulls the six generated prose leaves, and
 * must never enter the first-paint closure — the same rule `lib/scribeGround.js` lives under, and
 * for the same reason. Its one caller reaches it through a dynamic import on a path that is dormant
 * unless `FLAGS.scribe` is lit AND the advanced settlement actually carries a rendered survey.
 */

import { pendingRecordOf, proseOf, setPendingRecord, attachProse } from './scribeArtefact.js';

/**
 * ⭐ THE TAB THE RECORD'S CARD PAIR IS BUILT ON. The empty string is not a missing value: it is
 * the tab-free card, whose page renders nothing and whose `town`/`epoch` sections are the ones
 * every tab shares. Named so the two builds and the test all spell it once.
 */
export const EPOCH_CARD_TAB = '';

/**
 * The record of ONE advance for ONE settlement, or null when there is nothing to record.
 *
 * @param {object} before the settlement as it stood before the advance
 * @param {object} after the settlement the advance produced
 * @param {{worldBefore?: object|null, worldAfter?: object|null, eventLog?: ReadonlyArray<object>,
 *   advanceSeq?: number}} ctx
 * @param {{townCard: Function, epochRecord: Function}} deps injected so this module can be read
 *   and tested without the six prose leaves; `stampScribeEpochRecords` supplies the real two
 * @returns {object}
 */
export function epochRecordAcrossAdvance(before, after, ctx, deps) {
  const prevCard = deps.townCard(before, {
    tab: EPOCH_CARD_TAB, audience: 'dm', world: ctx?.worldBefore || null,
  });
  const nextCard = deps.townCard(after, {
    tab: EPOCH_CARD_TAB, audience: 'dm', world: ctx?.worldAfter || null,
  });
  return deps.epochRecord(prevCard, nextCard, {
    eventLog: Array.isArray(ctx?.eventLog) ? ctx.eventLog : [],
    advanceSeq: ctx?.advanceSeq,
  });
}

/**
 * ⭐ PARK ONE RECORD ON ONE SETTLEMENT, composing it with whatever an earlier un-surveyed advance
 * already left there. PURE: returns a new settlement, or the SAME one when there is nothing to
 * record, so an unscribed estate pays nothing.
 *
 * A settlement with NO CURRENT RENDER gets no record, and that is the design's own rule read
 * straight: there is no prior survey for a delta to be "since", so the first render of this town
 * is told nothing moved and writes from the card alone.
 *
 * @param {object} settlement the POST-advance settlement (it carries the artefact, spread through
 *   the pulse like every other top-level key)
 * @param {object|null} record @param {Function} merge `mergeEpochRecords`
 * @returns {object}
 */
export function stampPendingRecord(settlement, record, merge) {
  const prose = proseOf(settlement);
  if (!prose || !prose.current || !record) return settlement;
  const held = pendingRecordOf(prose);
  const composed = held && typeof merge === 'function' ? merge(held, record) : record;
  return attachProse(settlement, setPendingRecord(prose, composed));
}

/**
 * ⭐⭐ THE ADVANCE'S ONE SCRIBE ACT, wired. Walks the pulse's settlement updates, builds the card
 * pair for every one that carries a rendered survey, and REPLACES `update.settlement` with the
 * stamped settlement so the record rides into the store's own commit and the same atomic persist.
 *
 * ⛔ IT NEVER THROWS INTO THE ADVANCE. An advance is the campaign's own state moving and it must
 * land whether or not a convenience for a dark feature could be computed, so every settlement is
 * stamped inside its own try and a failure leaves that update exactly as the pulse produced it.
 *
 * @param {ReadonlyArray<{saveId?: unknown, settlement?: object}>} updates the pulse's
 *   `settlementUpdates`, mutated IN PLACE (they are plain objects lifted out of the draft)
 * @param {{before: Map<string, object>, worldBefore?: object|null, worldAfter?: object|null,
 *   eventLogBySaveId?: Map<string, ReadonlyArray<object>>, advanceSeq?: number}} ctx
 * @returns {Promise<number>} how many settlements were stamped
 */
export async function stampScribeEpochRecords(updates, ctx) {
  const rows = Array.isArray(updates) ? updates : [];
  if (rows.length === 0) return 0;
  // Nothing is imported until at least one advanced settlement actually carries a survey.
  const owed = rows.filter((row) => proseOf(row?.settlement)?.current);
  if (owed.length === 0) return 0;

  const [{ townCard }, { epochRecord, mergeEpochRecords }] = await Promise.all([
    import('../domain/prose/townCard.js'),
    import('../domain/prose/epochRecord.js'),
  ]);

  let stamped = 0;
  for (const row of owed) {
    const saveId = String(row?.saveId ?? '');
    const before = ctx?.before instanceof Map ? ctx.before.get(saveId) : null;
    if (!before) continue;
    try {
      const record = epochRecordAcrossAdvance(before, row.settlement, {
        worldBefore: ctx?.worldBefore,
        worldAfter: ctx?.worldAfter,
        eventLog: ctx?.eventLogBySaveId instanceof Map ? ctx.eventLogBySaveId.get(saveId) : [],
        advanceSeq: ctx?.advanceSeq,
      }, { townCard, epochRecord });
      const next = stampPendingRecord(row.settlement, record, mergeEpochRecords);
      if (next !== row.settlement) {
        row.settlement = next;
        stamped += 1;
      }
    } catch (error) {
      // The advance is the campaign's state moving; a dark feature's convenience never stops it.
      console.warn('[scribe] the epoch record could not be computed for', saveId, error);
    }
  }
  return stamped;
}
