const SYMMETRIC_TYPES = new Set([
  'neutral',
  'trade_partner',
  'allied',
  'rival',
  'cold_war',
  'hostile',
  'criminal_network',
]);

// ── Canonical relationship-label normalizer ─────────────────────────────────
//
// ONE alias table shared by every regional system (lib/relationshipGraph,
// domain/regionalGraph, domain/region/graph) so a label authored as 'ally',
// 'overlord', or the legacy plural 'trade_partners' resolves to the same
// canonical base label everywhere instead of silently drifting in one
// subsystem. Each subsystem still maps FROM this canonical
// label to its own effect profile.
//
// This table is CROSS-VOCAB-SAFE: it only collapses spelling/synonym variants
// onto a base label that every consumer already recognizes. It deliberately
// does NOT collapse 'smuggling_partner' → 'criminal_network', because
// 'smuggling_partner' is the CANONICAL term in the regional structural vocab
// (REGIONAL_RELATIONSHIP_TYPES). That matrix-specific collapse lives in
// localPropagationType (see PROPAGATION_ALIASES below).
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

// Matrix/channel-bundle vocabulary: canonical labels that have NO row in the
// propagation matrix (lib/relationshipGraph PROPAGATION_MATRIX) map onto the
// row that carries their semantics. Applied AFTER canonicalRelationshipLabel so
// 'smuggling'→'smuggling_partner'→'criminal_network' resolves in one pass.
// Kept separate from the cross-vocab table so the regional
// structural graph keeps 'smuggling_partner' as a first-class type.
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

/** @param {any} save */
function strengthScore(save) {
  const tier = String(save?.tier || save?.settlement?.tier || 'village').toLowerCase();
  const population = Number(save?.settlement?.population?.total || save?.settlement?.population || 0);
  return (TIER_RANK[tier] ?? 2) + Math.min(0.8, Math.log10(Math.max(1, population)) / 8);
}

/**
 * @param {any} sourceId
 * @param {any} targetId
 * @param {any} sourceSave
 * @param {any} targetSave
 */
function strongerFirst(sourceId, targetId, sourceSave, targetSave) {
  return strengthScore(targetSave) > strengthScore(sourceSave)
    ? { from: String(targetId), to: String(sourceId) }
    : { from: String(sourceId), to: String(targetId) };
}

/**
 * @param {any} selection
 * @param {any} sourceId
 * @param {any} targetId
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
 * @param {any} definition
 * @param {any} localRole
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
 * @param {any} edge
 * @param {any} sourceId
 * @param {any} [_targetId]
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
 * @param {any} link
 * @param {any} sourceSave
 * @param {any} targetSave
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
 * @param {{ localRelationshipRole?: string, displayRelationshipType?: string, relationshipType?: string }} link
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

/** @param {any} link */
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
