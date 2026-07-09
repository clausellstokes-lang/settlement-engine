/**
 * @typedef {{ id?: string, refId?: string, name?: string, label?: string, faction?: string, [key: string]: unknown }} EntityLike
 * @typedef {{ personality?: Record<string, any> | string | string[] | null, secret?: unknown, goal?: unknown, goals?: unknown, [key: string]: unknown }} NpcLike
 * @typedef {{ key: string, label: string, value: string, visibility: string }} Trait
 * @typedef {{ npcs?: NpcLike[], powerStructure?: { factions?: EntityLike[] }, factions?: EntityLike[], institutions?: EntityLike[], config?: { nearbyResources?: unknown[] }, resourceAnalysis?: { availableResources?: unknown[] }, [key: string]: unknown }} DossierSettlement
 */

/** @type {Readonly<Record<string, string>>} */
const KIND_PREFIX = Object.freeze({
  settlement: 'settlement',
  npc: 'npc',
  faction: 'faction',
  institution: 'institution',
  resource: 'resource',
  service: 'service',
  relationship: 'relationship',
  hook: 'hook',
  condition: 'condition',
});

/** @param {unknown} value @returns {string} */
export function slugifyEntity(value) {
  return String(value || 'unknown')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'unknown';
}

/** @param {string} kind @param {EntityLike | null | undefined} entity @param {string} [fallback] @returns {string} */
export function entityAnchor(kind, entity, fallback = '') {
  const prefix = KIND_PREFIX[kind] || slugifyEntity(kind);
  const raw = entity?.id || entity?.refId || entity?.name || entity?.label || fallback;
  return `dossier-${prefix}-${slugifyEntity(raw)}`;
}

/** @param {string} kind @param {EntityLike | null | undefined} entity @param {string} [fallback] */
export function entityLink(kind, entity, fallback = '') {
  const label = entity?.name || entity?.label || fallback || String(entity?.id || kind || 'item');
  const anchor = entityAnchor(kind, entity, label);
  return {
    kind,
    id: entity?.id || entity?.refId || slugifyEntity(label),
    label,
    anchor,
    href: `#${anchor}`,
  };
}

/** @param {unknown} value @returns {string[]} */
function normalizeList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return [String(value)].filter(Boolean);
}

/** @param {Trait[]} out @param {string} key @param {string} label @param {unknown} value @param {string} [visibility] */
function pushTrait(out, key, label, value, visibility = 'public') {
  const values = normalizeList(value);
  for (const item of values) {
    const trimmed = item.trim();
    if (!trimmed) continue;
    out.push({ key, label, value: trimmed, visibility });
  }
}

/** @param {...unknown} values @returns {string | null} */
function firstText(...values) {
  for (const value of values) {
    if (!value) continue;
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
      const hit = value.find(item => typeof item === 'string' && item.trim());
      if (hit) return hit;
      continue;
    }
    if (typeof value === 'object') {
      const hit = /** @type {Record<string, any>} */ (value).short
        || /** @type {Record<string, any>} */ (value).description
        || /** @type {Record<string, any>} */ (value).long
        || /** @type {Record<string, any>} */ (value).text
        || /** @type {Record<string, any>} */ (value).name;
      if (typeof hit === 'string' && hit.trim()) return hit;
    }
  }
  return null;
}

/** @param {NpcLike} [npc] @returns {Trait[]} */
export function normalizeNpcTraits(npc = {}) {
  /** @type {Trait[]} */
  const traits = [];
  const personality = npc.personality;

  if (Array.isArray(personality)) {
    pushTrait(traits, 'personality', 'Personality', personality.slice(0, 2));
  } else if (personality && typeof personality === 'object') {
    pushTrait(traits, 'ideal', 'Ideal', personality.ideal || personality.ideals);
    pushTrait(traits, 'flaw', 'Flaw', personality.flaw || personality.flaws);
    pushTrait(traits, 'bond', 'Bond', personality.bond || personality.bonds);
    pushTrait(traits, 'ambition', 'Ambition', personality.ambition || personality.ambitions);
    pushTrait(traits, 'personality', 'Temperament', personality.dominant);
  } else {
    pushTrait(traits, 'personality', 'Personality', personality);
  }

  pushTrait(traits, 'ideal', 'Ideal', npc.ideal || npc.ideals);
  pushTrait(traits, 'flaw', 'Flaw', npc.flaw || npc.flaws);
  pushTrait(traits, 'bond', 'Bond', npc.bond || npc.bonds);
  pushTrait(traits, 'ambition', 'Ambition', npc.ambition || npc.ambitions);
  pushTrait(traits, 'loyalty', 'Loyalty', npc.loyalty || npc.loyalties);
  pushTrait(traits, 'fear', 'Fear', npc.fear || npc.fears);
  pushTrait(traits, 'goal', 'Goal', firstText(npc.goal, npc.goals));
  pushTrait(traits, 'secret', 'Secret', typeof npc.secret === 'string' ? npc.secret : (/** @type {{ what?: unknown }} */ (npc.secret))?.what, 'gm');

  const seen = new Set();
  return traits.filter((trait) => {
    const key = `${trait.label}:${trait.value}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** @param {DossierSettlement} [settlement] */
export function buildDossierEntityIndex(settlement = {}) {
  const npcs = (settlement.npcs || []).map(npc => ({
    ...entityLink('npc', npc),
    traits: normalizeNpcTraits(npc),
    raw: npc,
  }));
  const factions = (settlement.powerStructure?.factions || settlement.factions || []).map(faction => ({
    ...entityLink('faction', faction, faction.faction),
    label: faction.faction || faction.name || faction.label || 'Faction',
    raw: faction,
  }));
  const institutions = (settlement.institutions || []).map(inst => ({
    ...entityLink('institution', inst),
    raw: inst,
  }));
  const resources = [
    ...(settlement.config?.nearbyResources || []),
    ...(settlement.resourceAnalysis?.availableResources || []),
  ].map(resource => {
    const entity = typeof resource === 'string'
      ? { id: resource, name: resource.replace(/_/g, ' ') }
      : resource;
    return { ...entityLink('resource', /** @type {EntityLike} */ (entity)), raw: resource };
  });

  return { npcs, factions, institutions, resources };
}
