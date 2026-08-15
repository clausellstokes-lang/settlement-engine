const SYMMETRIC_TYPES = new Set([
  'neutral',
  'trade_partner',
  'allied',
  'rival',
  'cold_war',
  'hostile',
  'criminal_network',
]);

// ── THE HOME OF RELATIONSHIP SPELLING KNOWLEDGE ─────────────────────────────
//
// This file is the SINGLE HOME for relationship spelling knowledge: every alias
// table mapping a legacy or synonym spelling onto a canonical relationship label
// is declared HERE. `tests/lint/implicitNeutralSingleSource.test.js` enforces it
// as a single-writer law over a declaration-shaped scan of all of `src/`, with
// the remaining private folds enumerated there as a shrink-only banked inventory.
//
// ⛔ ONE HOME IS NOT ONE TABLE. There are TWO — one per plane — and they are
// deliberately NOT merged:
//
//   RELATIONSHIP_LABEL_ALIASES  the REGIONAL plane (lib/relationshipGraph,
//     domain/regionalGraph, domain/region/graph). STRUCTURAL vocabulary: it
//     keeps 'war', 'subject' and 'tributary' as themselves, because the regional
//     graph carries them as first-class types.
//   RELATIONSHIP_PLANE_ALIASES  the RELATIONSHIP-STATE plane (worldPulse).
//     EFFECT-PROFILE vocabulary: it collapses those same three onto the keys
//     RELATIONSHIP_DEFAULTS actually carries ('hostile', 'vassal'), because a
//     plane that cannot find a defaults row has no numbers to apply.
//
// The two resolvers disagree on 17 of a 40-input corpus, ON PURPOSE. An
// exact-equality identity pin in `tests/domain/regionalNeighbourSeam.test.js`
// holds that divergence at exactly 17, so a later cure cannot quietly converge
// the planes. Merging their CONTENT is owner-gated (ODQ §64.2) and is not this
// file's to do; hosting them side by side is what makes this file the one home.
//
// Each subsystem still maps FROM its canonical label to its own effect profile.
//
// Both tables are CROSS-VOCAB-SAFE: each only collapses spelling/synonym variants
// onto a base label its own consumers already recognize. The regional table
// deliberately does NOT collapse 'smuggling_partner' → 'criminal_network',
// because 'smuggling_partner' is the CANONICAL term in the regional structural
// vocab (REGIONAL_RELATIONSHIP_TYPES). That matrix-specific collapse lives in
// canonicalPropagationLabel (see PROPAGATION_ALIASES below).
/** @type {Readonly<Record<string, string>>} */
const RELATIONSHIP_LABEL_ALIASES = Object.freeze({
  // Legacy plural the old 'Opened Trade Route' event wrote.
  trade_partners: 'trade_partner',
  trade: 'trade_partner',
  // Alliance spellings.
  ally: 'allied',
  alliance: 'allied',
  allies: 'allied',
  // Hierarchical synonyms (every consumer treats overlord/vassal as one edge).
  overlord: 'vassal',
  suzerain: 'vassal',
  liege: 'vassal',
  // Smuggling spelling drift onto the regional canonical term.
  smuggling: 'smuggling_partner',
  // Cold-war spelling drift.
  coldwar: 'cold_war',
  'cold-war': 'cold_war',
});

/**
 * Normalize a raw/legacy relationship label to its canonical base label.
 * Unknown labels pass through verbatim (trimmed) so subsystem-specific
 * vocabularies (e.g. regional 'protector', 'tax_authority') are untouched.
 *
 * @param {string} label
 * @returns {string}
 */
export function canonicalRelationshipLabel(label) {
  const raw = String(label || '').trim();
  return RELATIONSHIP_LABEL_ALIASES[raw.toLowerCase()] || raw;
}

/**
 * The RELATIONSHIP-STATE plane's alias table — the second table this home hosts.
 *
 * Consumed by `src/domain/worldPulse/relationshipState.js`, which re-exports it as
 * `RELATIONSHIP_TYPE_ALIASES` and builds `normalizeRelationshipType` over it. It lives
 * here rather than there so that spelling knowledge has ONE home; it is a separate
 * export rather than a merge because the two planes legitimately disagree.
 *
 * ⛔ WHERE IT DIVERGES FROM THE REGIONAL TABLE ABOVE, AND WHY THAT IS CORRECT:
 *   war, enemy   → 'hostile'   the state plane needs a RELATIONSHIP_DEFAULTS row;
 *   subject      → 'vassal'    the regional plane keeps these as structural types.
 *   tributary    → 'vassal'
 *   criminal_corridor → 'criminal_network'  (both planes agree here)
 * And where the regional table folds and this one does NOT: 'trade_partners',
 * 'allies', 'overlord', 'suzerain', 'liege', 'smuggling', 'coldwar', 'cold-war'.
 * Folding those here is the LEGACY-LIVE content cure and is arm B1's owner-gated
 * row — NOT this member's. The 17-of-40 divergence pin is what holds that line.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const RELATIONSHIP_PLANE_ALIASES = Object.freeze({
  trade: 'trade_partner',
  alliance: 'allied',
  ally: 'allied',
  war: 'hostile',
  enemy: 'hostile',
  subject: 'vassal',
  tributary: 'vassal',
  criminal_corridor: 'criminal_network',

  // ⛔ RN-B1 — THE LEGACY-LIVE MERGE. OWNER-GATED AND SIGNED (ODQ §48.4, §64.2).
  //
  // Each row below is a spelling this tree DOCUMENTS as real save content. Before this
  // merge a persisted edge carrying one of them resolved to a label with NO
  // RELATIONSHIP_DEFAULTS row, so it silently received `neutral`'s numbers under its own
  // contradicting label. That preserved a MISREADING, not lived history; these rows
  // restore the reading the persisted label always claimed. THE PROMISE is not touched:
  // no same-seed generation cell moves, because nothing in src/ can PRODUCE any of these
  // spellings — they can only arrive from an already-saved world.
  //
  //   trade_partners     RELATIONSHIP_OPTIONS.OPENED_TRADE_ROUTE still offers it and the
  //                      write chokepoint folds it; named a legacy-save spelling at
  //                      populationDynamics.js:182 and stressorDynamics.js:74.
  //   overlord           canonicalEdgeForLink handles it as a legacy-save direction hint.
  //   smuggling          the smuggling family collapses onto the defaults row it has
  //   smuggling_partner  always meant on THIS plane — `criminal_network`, exactly as
  //                      `criminal_corridor` above and as canonicalPropagationLabel does.
  //                      (The REGIONAL table deliberately keeps `smuggling_partner` as a
  //                      first-class structural type; that asymmetry is the point.)
  //   hostile rival      the Axis-2 carrier. The key is the LOWERCASED form because this
  //                      plane lowercases before lookup; the file's own comment above
  //                      records that 'Hostile rival' reads at the hostile tier.
  //
  // ⚠ `tense` IS DELIBERATELY NOT MERGED, AND ITS ABSENCE IS A DECISION, NOT AN OVERSIGHT.
  // It is the fifth LEGACY-LIVE spelling the cure names, but no ruling determines WHICH
  // defaults row it should claim: `rival`, `cold_war` and `hostile` are all defensible and
  // they carry materially different trust/resentment/fear numbers, so choosing one here
  // would be inventing owner-gated content rather than executing it. It stays unmapped
  // (neutral numbers, as today) and is raised as an open chair question. Adding it later
  // is a one-row diff with a signed target.
  //
  // ⛔ ARM B2 STAYS REFUSED (§64.3): allies, suzerain, liege, coldwar, cold-war, war,
  // enemy, subject, tributary are SPECULATIVE — zero producers and zero evidence any world
  // carried them. The four already present above predate this merge and are not widened.
  trade_partners: 'trade_partner',
  overlord: 'vassal',
  smuggling: 'criminal_network',
  smuggling_partner: 'criminal_network',
  'hostile rival': 'hostile',
});

// Matrix/channel-bundle vocabulary: canonical labels that have NO row in the
// propagation matrix (lib/relationshipGraph PROPAGATION_MATRIX) map onto the
// row that carries their semantics. Applied AFTER canonicalRelationshipLabel so
// 'smuggling'→'smuggling_partner'→'criminal_network' resolves in one pass.
// Kept separate from the cross-vocab table so the regional structural graph
// keeps 'smuggling_partner' as a first-class type.
/** @type {Readonly<Record<string, string>>} */
const PROPAGATION_ALIASES = Object.freeze({
  smuggling_partner: 'criminal_network',
  criminal_corridor: 'criminal_network',
});

/**
 * Normalize a relationship label to the propagation-matrix vocabulary.
 * @param {string} label
 * @returns {string}
 */
export function canonicalPropagationLabel(label) {
  const base = canonicalRelationshipLabel(label);
  return PROPAGATION_ALIASES[base.toLowerCase()] || base;
}

/** @type {Record<string, number>} */
const TIER_RANK = {
  thorp: 0,
  hamlet: 1,
  village: 2,
  town: 3,
  city: 4,
  metropolis: 5,
};

export const RELATIONSHIP_SELECTIONS = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'trade_partner', label: 'Trade partners' },
  { value: 'allied', label: 'Allies' },
  { value: 'rival', label: 'Rivals' },
  { value: 'cold_war', label: 'Cold war' },
  { value: 'hostile', label: 'Hostile' },
  { value: 'criminal_network', label: 'Criminal network' },
  { value: 'patron_of', label: 'Current settlement is patron' },
  { value: 'client_of', label: 'Current settlement is client' },
  { value: 'overlord_of', label: 'Current settlement is overlord' },
  { value: 'vassal_of', label: 'Current settlement is vassal' },
];

// The relationship families that militarize governance narrative — the
// hostile-neighbour stability band and the "Ongoing tensions with {neighbour}"
// recentConflict line. Canonical vocabulary ('rival'/'cold_war'/'hostile') plus
// the legacy save spellings ('tense', 'hostile_rival'/'Hostile rival', which
// lower+substring-match 'hostile'). Substring-tolerant so a single predicate
// serves both generatePower's gate and priorityHelpers' military/economy reader.
export const ADVERSARIAL_RELATIONSHIP_MATCHES = ['hostile', 'rival', 'cold_war', 'tense'];

/**
 * @param {string | null | undefined} relType
 * @returns {boolean} true when the neighbour relationship is adversarial
 */
export function isAdversarialRelationship(relType) {
  const t = String(relType || '').toLowerCase();
  return t !== '' && ADVERSARIAL_RELATIONSHIP_MATCHES.some((k) => t.includes(k));
}

/**
 * A settlement save record (or the settlement itself) — only the fields this
 * module reads. Legacy saves store population as a bare number, canonical ones
 * as `{ total }`.
 * @typedef {Object} SettlementSaveLike
 * @property {string=} id
 * @property {string=} tier
 * @property {{ id?: string, tier?: string, population?: number | { total?: number } }=} settlement
 */

/**
 * @param {SettlementSaveLike | null | undefined} save
 * @returns {number} tier rank plus a small population-scaled bonus
 */
function strengthScore(save) {
  const tier = String(save?.tier || save?.settlement?.tier || 'village').toLowerCase();
  // @ts-expect-error -- population is number | { total } across save generations; `.total ||` is the tolerant read
  const population = Number(save?.settlement?.population?.total || save?.settlement?.population || 0);
  return (TIER_RANK[tier] ?? 2) + Math.min(0.8, Math.log10(Math.max(1, population)) / 8);
}

/**
 * @param {string} sourceId
 * @param {string} targetId
 * @param {SettlementSaveLike | null | undefined} sourceSave
 * @param {SettlementSaveLike | null | undefined} targetSave
 * @returns {{ from: string, to: string }} stronger endpoint first
 */
function strongerFirst(sourceId, targetId, sourceSave, targetSave) {
  return strengthScore(targetSave) > strengthScore(sourceSave)
    ? { from: String(targetId), to: String(sourceId) }
    : { from: String(sourceId), to: String(targetId) };
}

/**
 * @typedef {{ relationshipType: string, from: string, to: string, sourceRole: string, targetRole: string }} RelationshipDefinition
 * @param {string} selection  a RELATIONSHIP_SELECTIONS value
 * @param {string} sourceId
 * @param {string} targetId
 * @returns {RelationshipDefinition}
 */
export function relationshipDefinition(selection, sourceId, targetId) {
  const source = String(sourceId);
  const target = String(targetId);
  if (SYMMETRIC_TYPES.has(selection)) {
    return {
      relationshipType: selection,
      from: source,
      to: target,
      sourceRole: selection,
      targetRole: selection,
    };
  }
  if (selection === 'patron_of') {
    return { relationshipType: 'patron', from: source, to: target, sourceRole: 'patron', targetRole: 'client' };
  }
  if (selection === 'client_of') {
    return { relationshipType: 'patron', from: target, to: source, sourceRole: 'client', targetRole: 'patron' };
  }
  if (selection === 'overlord_of') {
    return { relationshipType: 'vassal', from: source, to: target, sourceRole: 'overlord', targetRole: 'vassal' };
  }
  if (selection === 'vassal_of') {
    return { relationshipType: 'vassal', from: target, to: source, sourceRole: 'vassal', targetRole: 'overlord' };
  }
  return relationshipDefinition('neutral', source, target);
}

/**
 * @param {RelationshipDefinition} definition
 * @param {string} localRole
 * @returns {{ relationshipType: string, relationshipFrom: string, relationshipTo: string, localRelationshipRole: string, displayRelationshipType: string }}
 */
export function relationshipLinkMetadata(definition, localRole) {
  return {
    relationshipType: definition.relationshipType,
    relationshipFrom: definition.from,
    relationshipTo: definition.to,
    localRelationshipRole: localRole,
    displayRelationshipType: localRole,
  };
}

/**
 * @param {{ from?: string, relationshipType?: string } | null | undefined} edge
 * @param {string} sourceId
 * @param {string} [_targetId]
 * @returns {{ sourceRole: string, targetRole: string }}
 */
export function rolesForCanonicalEdge(edge, sourceId, _targetId) {
  const sourceIsFrom = String(edge?.from) === String(sourceId);
  if (edge?.relationshipType === 'patron') {
    return sourceIsFrom
      ? { sourceRole: 'patron', targetRole: 'client' }
      : { sourceRole: 'client', targetRole: 'patron' };
  }
  if (edge?.relationshipType === 'vassal') {
    return sourceIsFrom
      ? { sourceRole: 'overlord', targetRole: 'vassal' }
      : { sourceRole: 'vassal', targetRole: 'overlord' };
  }
  return {
    sourceRole: edge?.relationshipType || 'neutral',
    targetRole: edge?.relationshipType || 'neutral',
  };
}

/**
 * Resolve new canonical metadata and old display-oriented saves to one edge.
 * Legacy hierarchical links infer the stronger endpoint as patron/overlord.
 *
 * @typedef {Object} RelationshipLinkLike
 * @property {string=} relationshipType
 * @property {string=} type                      legacy alias of relationshipType
 * @property {string=} relationshipFrom
 * @property {string=} relationshipTo
 * @property {string=} localRelationshipRole
 * @property {string=} sourceRole            authored canonical role on the source side
 * @property {string=} displayRelationshipType
 *
 * @param {RelationshipLinkLike | null | undefined} link
 * @param {SettlementSaveLike | null | undefined} sourceSave
 * @param {SettlementSaveLike | null | undefined} targetSave
 * @returns {{ from: string, to: string, relationshipType: string } | null}
 */
export function canonicalEdgeForLink(link, sourceSave, targetSave) {
  const sourceId = sourceSave?.id || sourceSave?.settlement?.id;
  const targetId = targetSave?.id || targetSave?.settlement?.id;
  if (!sourceId || !targetId) return null;

  if (link?.relationshipFrom && link?.relationshipTo) {
    return {
      from: String(link.relationshipFrom),
      to: String(link.relationshipTo),
      relationshipType: link.relationshipType || 'neutral',
    };
  }

  const rawType = link?.relationshipType || link?.type || 'neutral';
  if (rawType === 'patron') {
    return { from: String(targetId), to: String(sourceId), relationshipType: 'patron' };
  }
  if (rawType === 'client') {
    return { from: String(sourceId), to: String(targetId), relationshipType: 'patron' };
  }
  if (rawType === 'vassal' || rawType === 'overlord') {
    // Prefer the link's AUTHORED direction over the size heuristic.
    // A legacy save where the smaller settlement is canonically the overlord
    // (a deposed-but-sovereign capital, a small theocratic seat) was silently
    // inverted by strongerFirst, mis-attributing who owes/commands whom.
    //   - canonical edge: from = overlord, to = vassal.
    //   - a role hint ('overlord'/'vassal') on the SOURCE is directional.
    //   - the raw word 'overlord' likewise means "the source is the overlord".
    // Only when no directional signal exists do we fall back to strongerFirst.
    const role = link?.localRelationshipRole || link?.sourceRole || link?.displayRelationshipType;
    if (role === 'overlord' || rawType === 'overlord') {
      return { from: String(sourceId), to: String(targetId), relationshipType: 'vassal' };
    }
    if (role === 'vassal') {
      return { from: String(targetId), to: String(sourceId), relationshipType: 'vassal' };
    }
    return { ...strongerFirst(sourceId, targetId, sourceSave, targetSave), relationshipType: 'vassal' };
  }
  return { from: String(sourceId), to: String(targetId), relationshipType: rawType };
}

// Asymmetric roles → a directional phrase template. The neighbour name fills the
// {neighbour} slot so "overlord" reads as "Overlord of Thornmere" and its inverse
// "Vassal to Ironhold". The symmetric relationships ('allied', 'hostile', ...) carry
// no direction and are intentionally absent here — they fall through to the plain
// titled label so nothing about their phrasing changes.
/** @type {Readonly<Record<string, (n: string) => string>>} */
const DIRECTIONAL_ROLE_PHRASES = Object.freeze({
  overlord: n => `Overlord of ${n}`,
  vassal: n => `Vassal to ${n}`,
  patron: n => `Patron of ${n}`,
  client: n => `Client of ${n}`,
});

/**
 * Render the directional label for a neighbour link, naming WHICH SIDE this
 * settlement is for the two asymmetric pairs (overlord/vassal, patron/client).
 *
 * The direction is read off the link's per-side role
 * (`localRelationshipRole`, with `displayRelationshipType` as the legacy
 * fallback), which the link composer already stamps from the canonical
 * `sourceRole`/`targetRole`. A symmetric relationship, an unknown role, or a
 * legacy row with neither field present returns null so the caller keeps its
 * existing non-directional label (no regression).
 *
 * @param {{ localRelationshipRole?: string, displayRelationshipType?: string, relationshipType?: string } | null | undefined} link
 *   the neighbourNetwork entry.
 * @param {string} [neighbourName] the linked settlement's name (fills the slot).
 * @returns {string|null} e.g. "Overlord of Thornmere", or null when not directional.
 */
export function directionalRelationshipLabel(link, neighbourName) {
  const role = String(link?.localRelationshipRole || link?.displayRelationshipType || '').toLowerCase();
  const phrase = DIRECTIONAL_ROLE_PHRASES[role];
  if (!phrase) return null;
  const name = String(neighbourName || '').trim();
  if (!name) return null;
  return phrase(name);
}

/**
 * @param {RelationshipLinkLike | null | undefined} link
 * @returns {string} relationship type as seen from the local settlement
 */
export function localPropagationType(link) {
  const role = link?.localRelationshipRole || link?.displayRelationshipType;
  if (role === 'client') return 'patron';
  if (role === 'patron') return 'client';
  if (role === 'vassal') return 'vassal';
  if (role === 'overlord') return 'client';
  // A legacy link with a raw relationshipType ('ally', 'overlord',
  // 'smuggling_partner', 'trade_partners') carries no localRelationshipRole, so
  // it reached the propagation matrix unnormalized and silently fell through to
  // 'neutral'. Route it through the matrix-vocab normalizer so it lands on a
  // real matrix key (allied / vassal / criminal_network / trade_partner).
  return canonicalPropagationLabel(link?.relationshipType || link?.type || 'neutral');
}
