/**
 * components/new/relationshipsDeskRead.js — THE TWO LISTS DS-REL-1 READS, assembled ONCE.
 *
 * ── WHAT THIS EXISTS FOR (ODQ §934.9, the owner's "do these as well", 2026-09-18) ────
 * `relationships.network` was mounted in `printProse.js` and STARVED. The builder's own
 * seam note recorded it as a deliberate deferral: the desk takes two lists — the neighbour
 * standings and the typed cross-settlement engagements — and those lists were assembled
 * inside `RelationshipsTab.jsx`, where a headless builder cannot reach them. So the paid
 * PDF printed nothing at that position on a SAVED world, while the screen printed the
 * whole standing. This is the act that note prescribed, in the file it named:
 *
 *     "THE ONE ACT THAT LIGHTS IT: a `relationshipsDeskRead.js` sibling under
 *      `src/components/new/` holding that merge, called by both RelationshipsTab and
 *      this builder's caller — the shape `generalDeskRead.js` and `economyDeskRead.js`
 *      already have."
 *
 * ── ⛔ WHY IT LIVES UNDER src/components AND MAY NOT MOVE TO src/domain ──────────────
 * Not layering taste — a MEASURED ratchet refusal, and `printProse.js:334-343` records the
 * measurement: spelling these three reads in the domain builder put THREE NEW identities
 * into `check-observed-shape-readers.mjs` against that file. All three keys are written at
 * SAVE time (`src/lib/saves.js`, the link / undo / import paths), so no generated world the
 * observed-shape corpus executes carries one, and the scan convicts every reader of them.
 * `neighbourNetwork on settlement` and `interSettlementRelationships on settlement` already
 * carry frozen rows across the `src/components` tree, and `crossSettlementConflicts on
 * settlement` carries one at `src/pdf/lib/viewModel.js` — so this is the estate's accepted
 * cure, the one `generalDeskRead.js:223-232` spells for `lifecycleStatus`: READ THE FIELD
 * WHERE THE READ IS ALREADY ACCEPTED AND HAND IT OVER.
 *
 * ⚠⚠ AND `crossSettlementConflicts` HAS NO WRITER AT ALL — not a save-time one, none. The
 * deterministic generator that mints those rows writes them into
 * `interSettlementRelationships` (`domain/relationships/neighbourBackLink.js:144,149`), and
 * `tests/lint/writerReach.walker.test.js` lists the key in its own `unwritten` roster. An
 * M8/M9 explained-writer declaration is therefore STRUCTURALLY UNAVAILABLE for it: gate 0
 * re-proves on every scan that the declared writer still writes the key, and there is no
 * writer to name. The read is inbound compatibility for records authored before the merge
 * moved, and it stays where the ratchet has already banked it.
 *
 * ── ⛔ ONE ASSEMBLY, NOT TWO ─────────────────────────────────────────────────────────
 * The whole point is that the prose and the cards cannot describe two different sets. The
 * live-conflict derivation moves here WITH the merges rather than being injected by the
 * caller: an injection point is a second way to produce the list, and "a second derivation
 * of the same fact is a fork that drifts" is the rule the two sibling desk readers are
 * built on. Callers pass the settlement and nothing else.
 *
 * ⛔ PURE, AND NO MOUNT. Same settlement ⇒ same lists, forever: no clock, no ambient RNG
 * (the generator takes the pair's stable identity), no store, no React. This module names
 * NO mount id — `generalDeskRead.js` owns `relationships.network` and the registry's
 * reachability arm refuses a position named twice under `src/components`.
 *
 * @enforced-by tests/pdf/statePrintParity.test.jsx (the saved-world parity arm)
 * @enforced-by tests/ui/generalDeskTabFlow.test.js (the rendered DS-REL-1 sentences)
 */
import { generateCrossSettlementConflictsDeterministic } from '../../generators/crossSettlementConflicts.js';

/**
 * The engagement types DS-REL-1 draws. Raw NPC contacts carry no `type` and are NOT
 * engagements — they are the named-people half of a neighbour's own pair.
 */
const ENGAGEMENT_TYPES = Object.freeze(['conflict', 'faction_engagement']);

/** The silent lists: what a caller gets before it has a settlement. */
export const SILENT_RELATIONSHIP_LISTS = Object.freeze({
  neighbours: Object.freeze([]),
  crossEngagements: Object.freeze([]),
});

/** Whether one row is a typed engagement rather than a bare contact. */
const isEngagement = (row) => ENGAGEMENT_TYPES.includes(row?.type);

/**
 * The engagements a settlement has with a LIVE, unsaved generator neighbour.
 *
 * A generated town carries `neighborRelationship` and no link rows; a saved one carries the
 * rows. Deriving these keeps an unsaved settlement's prose and cards identical to the saved
 * settlement's, which is what the screen already did.
 *
 * ⛔ THE SEED IS THE PAIR'S STABLE IDENTITY (`_seed` / `id`), never the transient `{name}`
 * shape — the determinism note `crossSettlementConflicts.js:5-14` records why: the ambient
 * RNG fallback made the same pair render different conflicts on every mount.
 * @param {object|null|undefined} settlement
 * @returns {ReadonlyArray<object>}
 */
function liveEngagementsOf(settlement) {
  const nr = settlement?.neighborRelationship;
  if (!settlement || !nr?.name) return SILENT_RELATIONSHIP_LISTS.crossEngagements;
  try {
    const own = {
      _seed: settlement._seed,
      id: settlement.id,
      name: settlement.name || '',
      npcs: settlement.npcs || [],
      factions: settlement.factions || [],
    };
    const partner = {
      id: nr.id, name: nr.name, npcs: nr.npcs || [], factions: nr.factions || [],
    };
    const { forA } = generateCrossSettlementConflictsDeterministic(
      own, partner, nr.relationshipType || 'neutral', 'live',
    );
    return forA;
  } catch {
    // A malformed partner record must not take the tab or the export down with it; the
    // position simply draws on what did resolve.
    return SILENT_RELATIONSHIP_LISTS.crossEngagements;
  }
}

/**
 * THE TWO LISTS, for one settlement.
 *
 * `neighbours` is the persisted network plus the live generator neighbour when that name is
 * not already in it, so an unsaved town shows the standing it was generated with.
 * `crossEngagements` is every typed engagement the record knows — persisted, inbound-legacy
 * and live — deduped on the same key the screen deduped on, because the cards and the
 * sentences are index-paired and must agree row for row.
 *
 * @param {object|null|undefined} settlement
 * @returns {Readonly<{neighbours: ReadonlyArray<object>,
 *   crossEngagements: ReadonlyArray<object>}>}
 */
export function relationshipsDeskLists(settlement) {
  if (!settlement) return SILENT_RELATIONSHIP_LISTS;

  const live = liveEngagementsOf(settlement);
  const raw = [
    ...(settlement.interSettlementRelationships || []).filter(isEngagement),
    ...(settlement.crossSettlementConflicts || []).filter(isEngagement),
    ...live.filter(isEngagement),
  ];
  const seen = new Set();
  const crossEngagements = raw.filter((row) => {
    const key = row.description?.slice(0, 40) || row.conflictNature || '';
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const liveNeighbour = settlement.neighborRelationship;
  const net = settlement.neighbourNetwork || [];
  const liveEntry = liveNeighbour?.name && !net.some((n) => n.name === liveNeighbour.name)
    ? [{
      id: `live_${liveNeighbour.name}`,
      name: liveNeighbour.name,
      neighbourName: liveNeighbour.name,
      neighbourTier: liveNeighbour.tier || '',
      relationshipType: liveNeighbour.relationshipType || 'neutral',
      description: `Generated with ${liveNeighbour.name} as neighbour (${(liveNeighbour.relationshipType || 'neutral').replace(/_/g, ' ')}).`,
      fromGeneration: true,
    }]
    : [];

  return Object.freeze({
    neighbours: Object.freeze([...net, ...liveEntry]),
    crossEngagements: Object.freeze(crossEngagements),
  });
}

export default relationshipsDeskLists;
