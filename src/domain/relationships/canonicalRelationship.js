const SYMMETRIC_TYPES = new Set([
  'neutral',
  'trade_partner',
  'allied',
  'rival',
  'cold_war',
  'hostile',
  'criminal_network',
]);

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

function strengthScore(save) {
  const tier = String(save?.tier || save?.settlement?.tier || 'village').toLowerCase();
  const population = Number(save?.settlement?.population?.total || save?.settlement?.population || 0);
  return (TIER_RANK[tier] ?? 2) + Math.min(0.8, Math.log10(Math.max(1, population)) / 8);
}

function strongerFirst(sourceId, targetId, sourceSave, targetSave) {
  return strengthScore(targetSave) > strengthScore(sourceSave)
    ? { from: String(targetId), to: String(sourceId) }
    : { from: String(sourceId), to: String(targetId) };
}

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

export function relationshipLinkMetadata(definition, localRole) {
  return {
    relationshipType: definition.relationshipType,
    relationshipFrom: definition.from,
    relationshipTo: definition.to,
    localRelationshipRole: localRole,
    displayRelationshipType: localRole,
  };
}

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
    return { ...strongerFirst(sourceId, targetId, sourceSave, targetSave), relationshipType: 'vassal' };
  }
  return { from: String(sourceId), to: String(targetId), relationshipType: rawType };
}

export function localPropagationType(link) {
  const role = link?.localRelationshipRole || link?.displayRelationshipType;
  if (role === 'client') return 'patron';
  if (role === 'patron') return 'client';
  if (role === 'vassal') return 'vassal';
  if (role === 'overlord') return 'client';
  return link?.relationshipType || link?.type || 'neutral';
}
