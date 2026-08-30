/**
 * genesisDiplomacy.js — POLIS-2, the MATERIALIZATION half of genesis diplomacy
 * (DESIGN_FMG_WEAVE D6, amended by A1.2.5 and ordered by A1.2.12).
 *
 * THE SPLIT, AND WHY IT IS A SPLIT. The plan car (POLIS-1) DECIDES which founding
 * ties a realm is born holding and writes them SLOT-ADDRESSED onto `plan.relations`.
 * This module TRANSLATES those slot pairs into the link shape the rest of the estate
 * already reads, once the composer has minted the members and knows their save ids.
 * Two acts, two reviewable units: a plan law that any reader can check against the
 * tier pyramid, and a materializer that any reader can check against the link
 * vocabulary — neither hiding inside the other.
 *
 * WHY SLOTS IN AND IDS OUT. A plan is derived before a single save exists, so a
 * plan may only speak in slots (the position in the realm's authored tier ladder).
 * Every consumer downstream of the composer matches on save ID
 * (`discoverDependencyCandidates.js` resolves a link by `n.id` against the target
 * save's `id`), so the materializer is the exact seam where slots become ids. A
 * link that spoke names instead would break the moment two members shared a name —
 * which is precisely the collision the faction de-dup pass upstream exists to fix.
 *
 * ORDER IS LOAD-BEARING, AND IT IS STEP-RELATIVE (A1.2.12). This runs AFTER the
 * world-scoped faction de-dup (so a link's stored neighbour name is the FINAL name)
 * and BEFORE the composer's channel discovery — because discovery INGESTS
 * `neighbourNetwork` to derive its channels. Materializing after discovery would
 * produce a realm whose founding ties exist on the members but are invisible to the
 * regional graph; the ordering is the feature, not housekeeping. The composer states
 * this coupling in prose at the call site rather than pinning a line number, because
 * a line number is the one thing about a call site that is guaranteed to rot.
 *
 * WHAT THIS DELIBERATELY DOES NOT WRITE (D6, and each omission is a ruling):
 *   • NO `relationshipStates` rows. The pulse materializes an edge lazily from
 *     RELATIONSHIP_DEFAULTS the first time it needs one, so writing them here would
 *     duplicate a derivation the engine already owns — and would cost persisted
 *     bytes on every founding for a value the reader can always recompute.
 *   • NO tick-stamped history. A founding-time type and its typed cause are
 *     GENERATION: this is how the realm was born. A transition stamped at tick N
 *     would be a lived event that never happened, and the estate's constitutional
 *     line is that lived history is immutable BECAUSE it is real.
 *   • NO invented relationship words. Every type resolves through
 *     `relationshipDefinition`, the estate's single home for relationship spelling
 *     and role inversion. A second inversion table here is exactly the "one home,
 *     two tables" defect that file's own header warns about.
 *
 * DORMANCY (the raw-byte bar, §713.2). A plan with no `relations` array is the
 * ONLY state that exists until the plan car lands, and it writes NOTHING — no key,
 * no empty array, no touched settlement. `materializeGenesisRelations` returns a
 * zero receipt and the composed bundle is byte-identical to the pre-POLIS-2 bundle.
 * The fingerprint section follows the same absent-when-dark discipline the composer
 * already applies to the realm's arcane stance.
 */
import {
  relationshipDefinition,
  relationshipLinkMetadata,
  RELATIONSHIP_SELECTIONS,
} from '../relationships/canonicalRelationship.js';

/**
 * The provenance token stamped on every link this module mints. It is what lets a
 * later reader tell a tie the realm was BORN with from one a player brokered — a
 * distinction the estate could not previously make on the neighbour plane, because
 * every link there looked hand-made.
 */
export const GENESIS_LINK_SOURCE = 'genesis_diplomacy';

/**
 * The closed selection vocabulary a genesis tie may be drawn from — the estate's
 * existing picker roster, not a new one (D6: "types drawn ONLY from the existing
 * closed vocabularies"). Deriving it from RELATIONSHIP_SELECTIONS rather than
 * re-listing it means a word added to the picker cannot silently become a word
 * genesis refuses, and a word removed cannot become one genesis still mints.
 */
export const GENESIS_SELECTIONS = Object.freeze(RELATIONSHIP_SELECTIONS.map(s => s.value));

/**
 * THE TYPED CAUSE VOCABULARY — closed, and the reason a tie exists at founding.
 *
 * §774.1 (decide in code, interpolate words): the plan car decides a CAUSE TOKEN;
 * the words a reader sees are looked up here and nowhere else. That keeps the
 * decision auditable as data and the prose replaceable without touching a law.
 *
 * Every cause is derivable from what genuinely exists at compose time — the tier
 * pyramid and the plan's own seeded draws. There is deliberately no geographic
 * cause (no "shared frontier", no "across the strait"): geography does not exist
 * when the plan is derived, and a cause naming one would be a fabricated fact
 * dressed as a derivation.
 *
 * @type {Readonly<Record<string, Readonly<{ phrase: string }>>>}
 */
export const GENESIS_RELATION_CAUSES = Object.freeze({
  // The dominant centre and a lesser member: the realm's own tier ladder is the
  // whole evidence, and it is evidence a reader can check by looking at the map key.
  tier_dominance: Object.freeze({ phrase: 'the older seat has long overshadowed the younger' }),
  // Peers of comparable standing who chose to stand together at the founding.
  mutual_defence: Object.freeze({ phrase: 'both seats agreed to stand together from the first' }),
  // A tie of goods rather than of arms.
  market_exchange: Object.freeze({ phrase: 'goods have moved between the two since the founding' }),
  // Peers of comparable standing who did not.
  standing_rivalry: Object.freeze({ phrase: 'neither seat has ever conceded precedence to the other' }),
});

/** The cause tokens, frozen for the plan car and the walkers to iterate. */
export const GENESIS_CAUSE_TOKENS = Object.freeze(Object.keys(GENESIS_RELATION_CAUSES));

/**
 * The sentence stored on a materialized link. It states the TIE and its TYPED
 * CAUSE and asserts nothing further — no battles, no dates, no outcomes. The
 * address (the neighbour's name) leads, matching how every other link on this
 * plane reads, so the sentence still identifies its subject when a reader meets it
 * out of context.
 *
 * @param {string} neighbourName
 * @param {string} roleWord   the LOCAL settlement's role, already de-underscored
 * @param {string} cause      a GENESIS_RELATION_CAUSES key
 */
function genesisDescription(neighbourName, roleWord, cause) {
  const row = GENESIS_RELATION_CAUSES[cause];
  const because = row ? ` — ${row.phrase}` : '';
  return `A tie that dates to the realm's founding: here stands as ${roleWord} to ${neighbourName}${because}.`;
}

/**
 * One endpoint's half of a genesis tie. Only keys the neighbour plane already
 * uses: a founding tie must be legible to every surface that reads the network
 * without any of them learning a new word — the same law the hand-chartered route
 * entry was built under.
 *
 * @param {{
 *   selfId: string, otherId: string, otherName: string, otherTier: string|null,
 *   linkId: string, definition: ReturnType<typeof relationshipDefinition>,
 *   localRole: string, cause: string,
 * }} input
 */
function genesisNeighbourEntry(input) {
  const roleWord = String(input.localRole).replace(/_/g, ' ');
  return {
    id: String(input.otherId),
    linkId: input.linkId,
    name: input.otherName,
    neighbourName: input.otherName,
    tier: input.otherTier || null,
    neighbourTier: input.otherTier || null,
    ...relationshipLinkMetadata(input.definition, input.localRole),
    description: genesisDescription(input.otherName, roleWord, input.cause),
    bidirectional: true,
    // The two fields that make a founding tie self-describing to a later reader:
    // where it came from, and the typed cause the plan drew. Neither is a tick.
    source: GENESIS_LINK_SOURCE,
    genesisCause: input.cause,
  };
}

/**
 * Materialize `plan.relations` onto the minted member saves as RECIPROCAL
 * neighbour links.
 *
 * Mutates the passed saves in place — the same posture as the world-scoped faction
 * de-dup that runs immediately before it, and for the same reason: the members are
 * already minted, so this is a post-pass over composed output, not a generation step.
 * It draws no randomness and reads no clock.
 *
 * REFUSALS ARE COUNTED, NEVER SILENT. A row naming a slot that does not exist, a
 * slot paired with itself, a type outside the closed vocabulary, or a pair already
 * tied is REFUSED rather than coerced. Coercing an unknown type to 'neutral' would
 * invent a tie the plan never declared, and coercion is how a plan defect ships
 * looking like a feature. The receipt makes every refusal countable by a caller.
 *
 * @param {{
 *   settlements: Array<{ id: string, name?: string, tier?: string, _slot?: number, settlement?: any }>,
 *   relations?: Array<{ a: number, b: number, type: string, cause: string }> | null,
 * }} input
 * @returns {{ linked: number, refusedUnknownSlot: number, refusedSelfPair: number,
 *             refusedUnknownType: number, refusedDuplicatePair: number }}
 */
export function materializeGenesisRelations({ settlements, relations }) {
  const receipt = {
    linked: 0,
    refusedUnknownSlot: 0,
    refusedSelfPair: 0,
    refusedUnknownType: 0,
    refusedDuplicatePair: 0,
  };
  // THE DORMANT PATH, and it is the whole dormancy proof: no relations means no
  // key is read, no settlement is touched, and nothing is written.
  if (!Array.isArray(relations) || relations.length === 0) return receipt;

  const bySlot = new Map();
  for (const save of settlements || []) {
    if (save && typeof save._slot === 'number') bySlot.set(save._slot, save);
  }
  const seenPairs = new Set();
  const selections = new Set(GENESIS_SELECTIONS);

  for (const row of relations) {
    const a = Number(row?.a);
    const b = Number(row?.b);
    const saveA = bySlot.get(a);
    const saveB = bySlot.get(b);
    if (!saveA || !saveB) { receipt.refusedUnknownSlot++; continue; }
    if (a === b) { receipt.refusedSelfPair++; continue; }
    const type = String(row?.type || '');
    if (!selections.has(type)) { receipt.refusedUnknownType++; continue; }
    // Slot-addressed pair key: stable across id runs, and order-free so a plan
    // cannot tie the same two seats twice by naming them in the other order.
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    const pairKey = `${lo}::${hi}`;
    if (seenPairs.has(pairKey)) { receipt.refusedDuplicatePair++; continue; }
    seenPairs.add(pairKey);

    const cause = String(row?.cause || '');
    // `sourceRole` always describes the FIRST id argument and `targetRole` the
    // second, even for the asymmetric selections that swap `from`/`to` — the
    // invariant the hand-link path already depends on.
    const definition = relationshipDefinition(type, saveA.id, saveB.id);
    const linkId = `genesis_${lo}_${hi}`;

    appendLink(saveA, genesisNeighbourEntry({
      selfId: saveA.id,
      otherId: saveB.id,
      otherName: nameOf(saveB),
      otherTier: tierOf(saveB),
      linkId,
      definition,
      localRole: definition.sourceRole,
      cause,
    }));
    appendLink(saveB, genesisNeighbourEntry({
      selfId: saveB.id,
      otherId: saveA.id,
      otherName: nameOf(saveA),
      otherTier: tierOf(saveA),
      linkId,
      definition,
      localRole: definition.targetRole,
      cause,
    }));
    receipt.linked++;
  }
  return receipt;
}

/** @param {any} save */
function nameOf(save) { return String(save?.settlement?.name || save?.name || ''); }
/** @param {any} save */
function tierOf(save) { return save?.settlement?.tier || save?.tier || null; }

/**
 * Append one link to a member's neighbour network, minting the array only when a
 * tie actually exists. A member with no founding ties keeps no `neighbourNetwork`
 * key at all, so its bytes are unchanged from a realm composed before this module
 * existed — the absent-when-dark discipline applied per MEMBER, not merely per realm.
 * @param {any} save
 * @param {any} entry
 */
function appendLink(save, entry) {
  const settlement = save.settlement;
  if (!settlement || typeof settlement !== 'object') return;
  const existing = Array.isArray(settlement.neighbourNetwork) ? settlement.neighbourNetwork : [];
  settlement.neighbourNetwork = [...existing, entry];
}

/**
 * The SLOT-ADDRESSED relations section of the composer's structural fingerprint
 * (D6: the fingerprint "does not cover edges today — a determinism blind spot
 * exactly where the feature lands").
 *
 * Slot-addressed and sorted, so the section is stable across id runs and across any
 * reordering of the plan's own row list: two plans that declare the same ties are
 * the same world, and the fingerprint should say so.
 *
 * ABSENT WHEN DARK: returns `undefined` for a plan with no relations, and the
 * fingerprint's serializer SKIPS undefined keys — so a realm composed without a
 * relations plan fingerprints byte-identically to one composed before this section
 * existed. That is the same virtual-flag discipline the composer applies to the
 * realm's arcane stance, and it is what keeps this car's dormancy claim a BIT claim.
 *
 * @param {Array<{ a: number, b: number, type: string, cause: string }> | null | undefined} relations
 */
export function genesisRelationsSection(relations) {
  if (!Array.isArray(relations) || relations.length === 0) return undefined;
  return relations
    .map(r => ({
      a: Math.min(Number(r?.a), Number(r?.b)),
      b: Math.max(Number(r?.a), Number(r?.b)),
      type: String(r?.type || ''),
      cause: String(r?.cause || ''),
    }))
    .sort((x, y) => (x.a - y.a) || (x.b - y.b) || (x.type < y.type ? -1 : x.type > y.type ? 1 : 0));
}
