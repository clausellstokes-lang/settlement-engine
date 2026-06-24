import { factionIdFromName } from '../../lib/entities.js';

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

export function slugifyEntity(value) {
  return String(value || 'unknown')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'unknown';
}

export function entityAnchor(kind, entity, fallback = '') {
  const prefix = KIND_PREFIX[kind] || slugifyEntity(kind);
  const raw = entity?.id || entity?.refId || entity?.name || entity?.label || fallback;
  return `dossier-${prefix}-${slugifyEntity(raw)}`;
}

/**
 * The stable id buildDossierEntityIndex assigns a raw entity of the given kind.
 * Cards use this to compute their OWN id so it matches the index entry exactly
 * (the same string `focusedEntity.id` carries), with no name-matching.
 *
 * Note: factions are the exception — the index keys them by the canonical
 * `factionIdFromName` (snake) rather than this slug, so faction focus must use
 * `factionIdFromName`, not this helper.
 *
 * @param {string} kind
 * @param {Record<string, any>} [entity]
 * @param {string} [fallback]
 * @returns {string}
 */
export function entityIdFor(kind, entity, fallback = '') {
  const label = entity?.name || entity?.label || fallback || String(entity?.id || kind || 'item');
  return entity?.id || entity?.refId || slugifyEntity(label);
}

export function entityLink(kind, entity, fallback = '') {
  const label = entity?.name || entity?.label || fallback || String(entity?.id || kind || 'item');
  const anchor = entityAnchor(kind, entity, label);
  return {
    kind,
    id: entityIdFor(kind, entity, fallback),
    label,
    anchor,
    href: `#${anchor}`,
  };
}

function normalizeList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return [String(value)].filter(Boolean);
}

function pushTrait(out, key, label, value, visibility = 'public') {
  const values = normalizeList(value);
  for (const item of values) {
    const trimmed = item.trim();
    if (!trimmed) continue;
    out.push({ key, label, value: trimmed, visibility });
  }
}

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
      const hit = value.short || value.description || value.long || value.text || value.name;
      if (typeof hit === 'string' && hit.trim()) return hit;
    }
  }
  return null;
}

export function normalizeNpcTraits(npc = {}) {
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
  pushTrait(traits, 'secret', 'Secret', typeof npc.secret === 'string' ? npc.secret : npc.secret?.what, 'gm');

  const seen = new Set();
  return traits.filter((trait) => {
    const key = `${trait.label}:${trait.value}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Which dossier tab owns each entity type. `navigateToEntity` reads this to
 * decide which tab to switch to before scrolling. Institutions surface across
 * several tabs today; 'power' is the closest single home for Phase A (a later
 * phase can route them per-context).
 * @type {Readonly<Record<string,string>>}
 */
export const TYPE_TO_TAB = Object.freeze({
  npc: 'npcs',
  faction: 'power',
  institution: 'power',
  deity: 'war_faith',
  settlement: 'overview',
});

/**
 * Read the live current name off a raw entity (rename-safe getter source).
 * @param {string} type
 * @param {Record<string, any>} raw
 * @param {string} fallback
 * @returns {string}
 */
function readCurrentName(type, raw, fallback) {
  if (!raw || typeof raw !== 'object') return fallback;
  if (type === 'faction') return raw.faction || raw.name || raw.label || fallback;
  return raw.name || raw.label || fallback;
}

/**
 * Decorate a base entityLink entry with the navigator contract: a `type`, the
 * owning `tab`, and a LIVE `currentName` getter. The getter reads the raw
 * entity at access time (never caches a name at build time) so a renamed
 * entity always reports its current name — this is what makes EntityLink
 * rename-safe by construction.
 *
 * @param {string} type
 * @param {Record<string, any>} base   The entityLink(...) result (id, label, anchor, href).
 * @param {Record<string, any>} raw    The raw settlement entity the entry points at.
 * @returns {Record<string, any>}
 */
function decorateEntry(type, base, raw) {
  const fallbackLabel = base.label;
  return {
    ...base,
    type,
    tab: TYPE_TO_TAB[type] || 'overview',
    raw,
    get currentName() {
      return readCurrentName(type, raw, fallbackLabel);
    },
  };
}

/**
 * Build a navigable index of the dossier's structured entities.
 *
 * Returns the original per-kind arrays (npcs / factions / institutions /
 * resources) PLUS a flat `byId` map and a `resolve(id)` lookup so the hyperlink
 * layer can turn a stable id into `{ id, type, tab, anchor, currentName }`.
 *
 * Faction ids are derived with the canonical {@link factionIdFromName} (snake_case,
 * underscores) — the SAME function that produces an NPC's `factionLink` — so an
 * NPC's stated affiliation resolves to its faction card by id with no
 * name-matching. (The anchor still uses the hyphen slug for the DOM id; identity
 * and anchor are intentionally distinct strings.)
 *
 * @param {Record<string, any>} [settlement]
 * @returns {{
 *   npcs: object[], factions: object[], institutions: object[], resources: object[],
 *   deities: object[], settlement: (object|null),
 *   byId: Map<string, object>,
 *   resolve: (id: string) => (object|null),
 * }}
 */
export function buildDossierEntityIndex(settlement = {}) {
  const npcs = (settlement.npcs || []).map(npc =>
    decorateEntry('npc', { ...entityLink('npc', npc), traits: normalizeNpcTraits(npc) }, npc));

  const factions = (settlement.powerStructure?.factions || settlement.factions || []).map(faction => {
    const base = {
      ...entityLink('faction', faction, faction.faction),
      label: faction.faction || faction.name || faction.label || 'Faction',
    };
    // IDENTITY must be the canonical snake id (== npc.factionLink), not the
    // hyphen anchor slug entityLink derives. Override it here.
    base.id = factionIdFromName(faction.faction || faction.name || faction.label) || base.id;
    return decorateEntry('faction', base, faction);
  });

  const institutions = (settlement.institutions || []).map(inst =>
    decorateEntry('institution', { ...entityLink('institution', inst) }, inst));

  const resources = [
    ...(settlement.config?.nearbyResources || []),
    ...(settlement.resourceAnalysis?.availableResources || []),
  ].map(resource => {
    const entity = typeof resource === 'string'
      ? { id: resource, name: resource.replace(/_/g, ' ') }
      : resource;
    return { ...entityLink('resource', entity), raw: resource };
  });

  // Optional deity (war/faith snapshot). No dedicated typedef today, so it is
  // only indexed when a recognizable name is present — kept minimal for Phase A.
  const deities = [];
  const deityName = settlement.config?.primaryDeitySnapshot?.name
    || settlement.primaryDeity?.name
    || settlement.config?.primaryDeitySnapshot?.deity;
  if (deityName) {
    const rawDeity = settlement.config?.primaryDeitySnapshot || settlement.primaryDeity || { name: deityName };
    deities.push(decorateEntry('deity', { ...entityLink('settlement', { id: `deity.${slugifyEntity(deityName)}`, name: deityName }) }, rawDeity));
  }

  // The settlement itself is addressable (overview tab).
  const settlementEntries = [];
  if (settlement.id || settlement.name) {
    settlementEntries.push(decorateEntry('settlement', { ...entityLink('settlement', settlement) }, settlement));
  }

  const all = [...npcs, ...factions, ...institutions, ...deities, ...settlementEntries];
  const byId = new Map();
  for (const entry of all) {
    if (entry.id && !byId.has(entry.id)) byId.set(entry.id, entry);
  }

  return {
    npcs,
    factions,
    institutions,
    resources,
    deities,
    settlement: settlementEntries[0] || null,
    byId,
    resolve: (id) => (id && byId.get(id)) || null,
  };
}
