/**
 * domain/regionalGraph.js — Typed neighbour graph.
 *
 * Tier 4.13 of the roadmap. Neighbours are currently a free-form
 * list (or empty). Phase 30 promotes them to a typed graph where
 * each link has a canonical relationship type, a direction, and
 * propagation hints describing how events on the other settlement
 * affect this one.
 *
 *   deriveRegionalGraph(settlement) -> {
 *     center,
 *     nodes: [{ id, name, distanceCategory? }],
 *     links: [{ from, to, relationshipType, severity, direction, propagationHints[] }]
 *   }
 *
 * Pure read-only. Composes Phase 9 factions (for "tax_authority"
 * inference) and Phase 17 substrate (for "supplier" / "market_hub"
 * inference based on trade connectivity).
 *
 * Active propagation (Ironmere mine collapse → Westford tool prices)
 * is reserved for a future tier — Phase 30 exposes the structural
 * graph that future propagation logic will read.
 */


// ── Catalog ──────────────────────────────────────────────────────────────

export const REGIONAL_RELATIONSHIP_TYPES = Object.freeze([
  'supplier',
  'dependent',
  'rival',
  'protector',
  'tax_authority',
  'pilgrimage_center',
  'market_hub',
  'refugee_source',
  'military_threat',
  'smuggling_partner',
  'religious_superior',
  'resource_provider',
  'other',
]);

// ── Helpers ──────────────────────────────────────────────────────────────

function snakeCase(s) {
  return String(s).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

function neighbourId(n) {
  if (!n) return null;
  if (typeof n === 'string') return `settlement.${snakeCase(n)}`;
  if (n.id) return n.id;
  if (n.name) return `settlement.${snakeCase(n.name)}`;
  return null;
}

function neighbourName(n) {
  if (typeof n === 'string') return n;
  return n?.name || n?.id || 'Unnamed';
}

// Map legacy relationshipType strings → canonical regional relationship types.
const LEGACY_RELATIONSHIP_MAP = Object.freeze({
  hostile:             'military_threat',
  cold_war:            'rival',
  rival:               'rival',
  ally:                'protector',
  allied:              'protector',
  alliance:            'protector',
  vassal:              'tax_authority',         // we are vassal -> they are tax authority
  overlord:            'tax_authority',
  trade_partner:       'market_hub',
  trade:               'market_hub',
  supplier:            'supplier',
  pilgrim:             'pilgrimage_center',
  pilgrimage:          'pilgrimage_center',
  religious_partner:   'religious_superior',
  religious_superior:  'religious_superior',
  resource_partner:    'resource_provider',
  refugee_source:      'refugee_source',
  smuggling:           'smuggling_partner',
  smuggling_partner:   'smuggling_partner',
  neutral:             'other',
});

// Pattern-based inference fallback (when relationshipType is missing).
const NEIGHBOUR_NAME_PATTERNS = Object.freeze([
  { pattern: /(temple|cathedral|monastery|see|seat)/i, type: 'religious_superior' },
  { pattern: /(market|trade|exchange|emporium)/i,     type: 'market_hub' },
  { pattern: /(fort|garrison|legion|march)/i,         type: 'protector' },
  { pattern: /(mine|quarry|forest|vein|spring)/i,     type: 'resource_provider' },
  { pattern: /(realm|empire|king|duchy|crown)/i,      type: 'tax_authority' },
  { pattern: /(border|march|wild|frontier)/i,         type: 'military_threat' },
]);

function inferRelationshipType(rawNeighbour) {
  if (!rawNeighbour) return 'other';
  // Explicit canonical type wins
  if (typeof rawNeighbour.regionalType === 'string'
      && REGIONAL_RELATIONSHIP_TYPES.includes(rawNeighbour.regionalType)) {
    return rawNeighbour.regionalType;
  }
  // Map legacy relationshipType
  const legacy = String(rawNeighbour.relationshipType || '').toLowerCase();
  if (legacy && LEGACY_RELATIONSHIP_MAP[legacy]) return LEGACY_RELATIONSHIP_MAP[legacy];
  // Fall back to name pattern
  const name = String(rawNeighbour.name || '');
  for (const { pattern, type } of NEIGHBOUR_NAME_PATTERNS) {
    if (pattern.test(name)) return type;
  }
  return 'other';
}

function inferSeverity(rawNeighbour, relType) {
  // Explicit numeric severity wins
  if (typeof rawNeighbour?.severity === 'number') {
    return Math.max(0, Math.min(1, rawNeighbour.severity));
  }
  // Otherwise pick a category-default
  const defaults = {
    military_threat:    0.7,
    rival:              0.5,
    tax_authority:      0.5,
    refugee_source:     0.5,
    pilgrimage_center:  0.4,
    religious_superior: 0.4,
    smuggling_partner:  0.4,
    supplier:           0.5,
    dependent:          0.4,
    resource_provider:  0.5,
    protector:          0.6,
    market_hub:         0.6,
    other:              0.3,
  };
  return defaults[relType] || 0.3;
}

function inferDirection(relType) {
  // 'incoming' = the other settlement acts on us
  // 'outgoing' = we act on them
  // 'bidirectional' = both
  switch (relType) {
    case 'supplier':            return 'incoming';
    case 'dependent':           return 'outgoing';
    case 'resource_provider':   return 'incoming';
    case 'refugee_source':      return 'incoming';
    case 'military_threat':     return 'incoming';
    case 'tax_authority':       return 'incoming';
    case 'religious_superior':  return 'incoming';
    case 'protector':           return 'incoming';
    case 'pilgrimage_center':   return 'outgoing';
    case 'market_hub':          return 'bidirectional';
    case 'rival':               return 'bidirectional';
    case 'smuggling_partner':   return 'bidirectional';
    default:                    return 'bidirectional';
  }
}

// What events on the other settlement should propagate here, and how?
const PROPAGATION_HINTS = Object.freeze({
  supplier:           ['DEPLETE_RESOURCE there → RESOURCE_PRESSURE here', 'cut route there → IMPORTS DROP here'],
  dependent:          ['unrest there → REFUGEE_WAVE here', 'collapse there → TAX_BASE narrows here'],
  rival:              ['military buildup there → DEFENSE_READINESS demand here', 'crisis there → opportunity here'],
  protector:          ['siege there → DEFENSE_READINESS demand here', 'collapse there → military vacuum here'],
  tax_authority:      ['change of rule there → POLICY shifts here', 'crisis there → tribute pause here'],
  pilgrimage_center:  ['plague there → PILGRIM flow stalls', 'reform there → THEOLOGY shifts here'],
  market_hub:         ['economic collapse there → TRADE_CONNECTIVITY drops here', 'opened route there → MERCHANT_WEALTH up here'],
  refugee_source:     ['unrest there → REFUGEE_WAVE here', 'famine there → REFUGEE_WAVE here'],
  military_threat:    ['raid there → RAID_OR_MONSTER_ATTACK here', 'buildup there → DEFENSE demand here'],
  smuggling_partner:  ['enforcement crackdown there → SMUGGLING relocates here', 'route open there → GOODS flow here'],
  religious_superior: ['heresy there → DOCTRINE shifts here', 'reform there → CLERGY rotate here'],
  resource_provider:  ['mine collapse there → RAW MATERIAL prices rise here', 'tax change there → COST OF GOODS shifts here'],
  other:              [],
});

function propagationHintsFor(relType) {
  return [...(PROPAGATION_HINTS[relType] || [])];
}

// ── Single-link derivation ───────────────────────────────────────────────

export function deriveRegionalLink(rawNeighbour, settlement) {
  if (!rawNeighbour) return null;
  const otherId = neighbourId(rawNeighbour);
  if (!otherId) return null;
  const centerId = settlement?.id || 'settlement.center';
  const relType = inferRelationshipType(rawNeighbour);
  return {
    from: centerId,
    to: otherId,
    toName: neighbourName(rawNeighbour),
    relationshipType: relType,
    severity: inferSeverity(rawNeighbour, relType),
    direction: inferDirection(relType),
    propagationHints: propagationHintsFor(relType),
    contributors: [{
      source: rawNeighbour?.relationshipType ? 'legacy.relationshipType' : 'name_pattern',
      effect: 'classified',
      reason: `Neighbour "${neighbourName(rawNeighbour)}" classified as ${relType}.`,
    }],
  };
}

// ── Graph composer ───────────────────────────────────────────────────────

/**
 * Derive the full regional graph centered on this settlement.
 *
 * @param {Object} settlement
 * @returns {Object} RegionalGraph
 */
export function deriveRegionalGraph(settlement) {
  if (!settlement) return { center: null, nodes: [], links: [] };
  const centerId = settlement.id || 'settlement.center';
  const centerName = settlement.name || 'Center';

  const sources = [];
  if (Array.isArray(settlement.neighbours))        sources.push(...settlement.neighbours);
  if (Array.isArray(settlement.neighbourNetwork))  sources.push(...settlement.neighbourNetwork);
  if (Array.isArray(settlement.neighborNetwork))   sources.push(...settlement.neighborNetwork);

  const links = sources.map(n => deriveRegionalLink(n, settlement)).filter(Boolean);

  const nodes = [
    { id: centerId, name: centerName, role: 'center' },
    ...links.map(l => ({ id: l.to, name: l.toName, role: 'neighbour' })),
  ];

  return { center: centerId, nodes, links };
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

export function supportedRelationshipTypes() {
  return [...REGIONAL_RELATIONSHIP_TYPES];
}

/** Group links by relationship type. */
export function regionalBreakdown(settlement) {
  const out = {};
  for (const type of REGIONAL_RELATIONSHIP_TYPES) out[type] = 0;
  const g = deriveRegionalGraph(settlement);
  for (const l of g.links) {
    if (out[l.relationshipType] !== undefined) out[l.relationshipType] += 1;
  }
  return out;
}

/** Human-readable lines. */
export function summarizeRegional(settlement) {
  const g = deriveRegionalGraph(settlement);
  if (g.links.length === 0) return ['No structured regional neighbours.'];
  return g.links.map(l =>
    `${l.toName} — ${l.relationshipType} (${l.direction}, severity ${l.severity}).`
  );
}
