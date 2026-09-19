/**
 * domain/display/stateProse/relationshipsDeskRead.js — THE TWO LISTS DS-REL-1 READS,
 * assembled ONCE, in the layer both surfaces share.
 *
 * ── WHAT THIS EXISTS FOR (ODQ §934.9, the owner's "do these as well", 2026-09-18) ────
 * `relationships.network` was mounted in `printProse.js` and STARVED. The desk takes two
 * lists — the neighbour standings and the typed cross-settlement engagements — and those
 * lists were assembled inside `RelationshipsTab.jsx`, where a headless builder cannot reach
 * them. So the paid PDF printed nothing at that position on a SAVED world, while the screen
 * printed the whole standing. The assembly was lifted out to a sibling; this is that sibling,
 * one layer further down.
 *
 * ── ⛔ WHY IT MOVED OUT OF src/components (ODQ §934.16, the owner's order) ────────────
 * It first landed at `src/components/new/relationshipsDeskRead.js`, and its own header said
 * it "MAY NOT MOVE TO src/domain": spelling these reads in the domain builder put NEW
 * identities into `check-observed-shape-readers.mjs`, because every key here is written at
 * SAVE time and no world the observed-shape corpus generates carries one. That was a true
 * measurement of a real refusal and the WRONG conclusion. The owner ruled the other way:
 *
 *     "If a future car wants a domain-side reader of the relationship keys, it is a
 *      governed register migration."
 *
 * So the register pays for the move rather than the layering doing so. The consequence is
 * that `printProse.js` — a `src/domain` module — no longer reaches into `src/components` for
 * DS-REL-1, and `RelationshipsTab.jsx` reads DOWN into the shared layer the way every other
 * display leaf is read. The reads themselves are unchanged in number and in spelling.
 *
 * ── ⛔ ONE PERSISTED KEY IS DELIBERATELY NOT READ, AND IT IS A BEHAVIOUR CHANGE ───────
 * The component-side assembler also merged `settlement.crossSettlementConflicts`. NOTHING IN
 * `src/` WRITES THAT KEY — the deterministic generator that mints those rows writes them into
 * `interSettlementRelationships` (`domain/relationships/neighbourBackLink.js`), and
 * `tests/lint/writerReach.walker.test.js` carries the key in its own `unwritten` roster — so
 * it is a DERIVED fact that briefly had a persisted spelling, never a key this estate
 * produces. The chair's ODQ §934.16 ruling is that the domain reader derives the conflicts
 * and does not read that key. A record authored before the merge moved therefore stops
 * contributing its legacy rows to DS-REL-1's prose and to the screen's engagement cards.
 * ⚠ `src/pdf/lib/viewModel.js:796` STILL READS IT for the printed Relationships SECTION, so
 * that one surface keeps the legacy rows while the prose no longer does. Recorded here, in
 * `tests/pdf/statePrintParity.test.jsx`, and in the commit body, to be vetoed rather than
 * discovered. Re-admitting the read is one line plus an ordinary register row.
 *
 * ── ⛔ ONE ASSEMBLY, NOT TWO ─────────────────────────────────────────────────────────
 * The whole point is that the prose and the cards cannot describe two different sets. The
 * live-conflict derivation is NOT injected by the caller: an injection point is a second way
 * to produce the list, and "a second derivation of the same fact is a fork that drifts" is
 * the rule the two sibling desk readers are built on. Callers pass the settlement and
 * nothing else. The derivation itself sits in `domain/relationships/neighbourBackLink.js`
 * beside the SAVED half of the same rows — see the note there for why the generator import
 * may not move with this file.
 *
 * ⛔ PURE, AND NO MOUNT. Same settlement ⇒ same lists, forever: no clock, no ambient RNG
 * (the derivation takes the pair's stable identity), no store, no React. This module names
 * NO mount id — `generalDeskRead.js` owns `relationships.network`.
 *
 * @enforced-by tests/pdf/statePrintParity.test.jsx (the saved-world parity arm)
 * @enforced-by tests/ui/generalDeskTabFlow.test.js (the rendered DS-REL-1 sentences)
 */
import { liveNeighbourEngagements } from '../../relationships/neighbourBackLink.js';

/**
 * The engagement types DS-REL-1 draws. Raw NPC contacts carry no `type` and are NOT
 * engagements — they are the named-people half of a neighbour's own pair.
 */
const ENGAGEMENT_TYPES = Object.freeze(['conflict', 'faction_engagement']);

/** @typedef {Record<string, unknown>} DeskRow */

/** The silent lists: what a caller gets before it has a settlement. */
export const SILENT_RELATIONSHIP_LISTS = /** @type {Readonly<{
 *   neighbours: ReadonlyArray<DeskRow>, crossEngagements: ReadonlyArray<DeskRow> }>} */ (
  Object.freeze({
    neighbours: Object.freeze([]),
    crossEngagements: Object.freeze([]),
  })
);

/**
 * Whether one row is a typed engagement rather than a bare contact.
 * @param {DeskRow|null|undefined} row
 * @returns {boolean}
 */
const isEngagement = (row) => ENGAGEMENT_TYPES.includes(/** @type {string} */ (row?.type));

/**
 * THE TWO LISTS, for one settlement.
 *
 * `neighbours` is the persisted network plus the live generator neighbour when that name is
 * not already in it, so an unsaved town shows the standing it was generated with.
 * `crossEngagements` is every typed engagement the record knows — persisted and live —
 * deduped on the same key the screen deduped on, because the cards and the sentences are
 * index-paired and must agree row for row.
 *
 * @param {{ neighbourNetwork?: unknown, interSettlementRelationships?: unknown,
 *   neighborRelationship?: { name?: unknown, tier?: unknown, relationshipType?: unknown }|null
 *   }|null|undefined} settlement
 * @returns {Readonly<{neighbours: ReadonlyArray<DeskRow>,
 *   crossEngagements: ReadonlyArray<DeskRow>}>}
 */
export function relationshipsDeskLists(settlement) {
  if (!settlement) return SILENT_RELATIONSHIP_LISTS;

  const live = liveNeighbourEngagements(settlement);
  // ⛔ EACH PERSISTED KEY IS READ EXACTLY ONCE, and that is machinery rather than style: the
  // observed-shape register freezes a per-identity READ COUNT, `neighbourNetwork on
  // settlement` is a banked explained-writer identity, and a second access here would move
  // the bank (and therefore `tests/lint/observedShapeBank.literal.js`) for a refactor that
  // reads nothing new. One access, then narrow the local.
  const interRows = settlement.interSettlementRelationships;
  const persisted = /** @type {ReadonlyArray<DeskRow>} */ (
    Array.isArray(interRows) ? interRows : []
  );
  const raw = [...persisted.filter(isEngagement), ...live.filter(isEngagement)];
  /** @type {Set<string>} */
  const seen = new Set();
  const crossEngagements = raw.filter((row) => {
    const description = typeof row.description === 'string' ? row.description : '';
    const nature = typeof row.conflictNature === 'string' ? row.conflictNature : '';
    const key = description.slice(0, 40) || nature || '';
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const liveNeighbour = settlement.neighborRelationship;
  const networkRows = settlement.neighbourNetwork;
  const net = /** @type {ReadonlyArray<DeskRow>} */ (
    Array.isArray(networkRows) ? networkRows : []
  );
  const liveName = typeof liveNeighbour?.name === 'string' ? liveNeighbour.name : '';
  const liveType = typeof liveNeighbour?.relationshipType === 'string'
    ? liveNeighbour.relationshipType : 'neutral';
  const liveEntry = liveName && !net.some((n) => n.name === liveName)
    ? [/** @type {DeskRow} */ ({
      id: `live_${liveName}`,
      name: liveName,
      neighbourName: liveName,
      neighbourTier: typeof liveNeighbour?.tier === 'string' ? liveNeighbour.tier : '',
      relationshipType: liveType,
      description: `Generated with ${liveName} as neighbour (${liveType.replace(/_/g, ' ')}).`,
      fromGeneration: true,
    })]
    : [];

  return Object.freeze({
    neighbours: Object.freeze([...net, ...liveEntry]),
    crossEngagements: Object.freeze(crossEngagements),
  });
}

export default relationshipsDeskLists;
