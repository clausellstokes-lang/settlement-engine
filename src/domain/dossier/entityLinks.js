import { factionIdFromName } from '../../lib/entities.js';
import { slugify as kernelSlugify } from '../../kernel/slugify.js';
import { fnv1a32 } from '../../kernel/proseHash.js';

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
  neighbour: 'neighbour',
  // Deities are addressable entities (the patron-faith snapshot). Declared
  // explicitly so a `deity` anchor reads `dossier-deity-<slug>` rather than
  // falling through to slugifyEntity('deity') — keeps the sink anchor legible.
  deity: 'deity',
  event: 'event',
  hook: 'hook',
  condition: 'condition',
});

/** @param {unknown} value @returns {string} */
export function slugifyEntity(value) {
  return kernelSlugify(value, { sep: '-', max: 80, fallback: 'unknown', empty: 'unknown' });
}

/** @param {string} kind @param {EntityLike | null | undefined} entity @param {string} [fallback] @returns {string} */
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
 * @param {EntityLike | null | undefined} [entity]
 * @param {string} [fallback]
 * @returns {string}
 */
export function entityIdFor(kind, entity, fallback = '') {
  const label = entity?.name || entity?.label || fallback || String(entity?.id || kind || 'item');
  return String(entity?.id || entity?.refId || slugifyEntity(label));
}

/** @param {string} kind @param {EntityLike | null | undefined} entity @param {string} [fallback] */
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

/**
 * Resolve a LOCAL NPC's display name to its canonical index id (rename-safe).
 * Matches against the live `currentName` of each indexed npc, so a renamed NPC
 * still maps to its card and a slug-derived guess from an object lacking the
 * NPC's stable `.id` doesn't silently miss. Returns null for a name absent from
 * the index (a foreign-settlement contact) — the caller then renders plain text.
 *
 * @param {{ npcs?: Array<{ id: string, currentName?: string }> } | null | undefined} index
 * @param {string} name        The NPC's stated name.
 * @returns {string|null}
 */
export function localNpcId(index, name) {
  if (!index || !name) return null;
  const key = String(name).trim().toLowerCase();
  if (!key) return null;
  const hit = (index.npcs || []).find(
    n => String(n.currentName || '').trim().toLowerCase() === key,
  );
  return hit ? hit.id : null;
}

/**
 * Resolve an institution display name to its stable index id, matching against
 * the index's STRUCTURED institution entries (by slugified current name) — never
 * by regex-scanning prose. Returns the entry's id (rename-safe) or null when no
 * institution matches, in which case the caller degrades to plain text.
 *
 * @param {{ institutions?: Array<{ id: string, currentName?: string, raw?: { name?: string } }> } | null | undefined} index
 * @param {string} name         Institution display name to resolve.
 * @returns {string|null}       Stable institution id, or null.
 */
export function institutionIdFromName(index, name) {
  if (!index?.institutions?.length || !name) return null;
  const key = slugifyEntity(name);
  const hit = index.institutions.find(
    inst => slugifyEntity(inst.currentName) === key || slugifyEntity(inst.raw?.name) === key);
  return hit ? hit.id : null;
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

/**
 * Which dossier tab owns each entity type. `navigateToEntity` reads this to
 * decide which tab to switch to before scrolling. Institutions land on
 * 'overview' (their only self-enumerated sink); neighbours route to the
 * superset 'relationships' tab so a neighbour link never no-ops.
 * @type {Readonly<Record<string, string>>}
 */
export const TYPE_TO_TAB = Object.freeze({
  npc: 'npcs',
  faction: 'power',
  institution: 'overview',
  deity: 'war_faith',
  settlement: 'overview',
  neighbour: 'relationships',
  event: 'history',
  resource: 'resources',
  service: 'services',
});

/**
 * Read the live current name off a raw entity (rename-safe getter source).
 * @param {string} type
 * @param {{ faction?: string, name?: string, label?: string, neighbourName?: string, title?: string, type?: string } | null | undefined} raw
 * @param {string} fallback
 * @returns {string}
 */
function readCurrentName(type, raw, fallback) {
  if (!raw || typeof raw !== 'object') return fallback;
  if (type === 'faction') return raw.faction || raw.name || raw.label || fallback;
  // A neighbour entry's display name is its neighbourName (the partner).
  if (type === 'neighbour') return raw.neighbourName || raw.name || raw.label || fallback;
  // Historical events title off name/title/type.
  if (type === 'event') return raw.name || raw.title || raw.label || raw.type || fallback;
  return raw.name || raw.label || fallback;
}

/**
 * Decorate a base entityLink entry with the navigator contract: a `type`, the
 * owning `tab`, and a LIVE `currentName` getter. The getter reads the raw
 * entity at access time (never caches a name at build time) so a renamed
 * entity always reports its current name — what makes EntityLink rename-safe.
 *
 * @param {string} type
 * @param {Record<string, any>} base   The entityLink(...) result (id, label, anchor, href).
 * @param {Record<string, any>} raw    The raw settlement entity the entry points at.
 * @returns {Record<string, any>}
 */
function decorateEntry(type, base, raw) {
  const fallbackLabel = base.label;
  const authoredIdentity = typeof raw?.id === 'string' && raw.id.trim()
    || typeof raw?.refId === 'string' && raw.refId.trim();
  return {
    ...base,
    type,
    tab: TYPE_TO_TAB[type] || 'overview',
    raw,
    identity: {
      state: authoredIdentity ? 'authored' : 'derived_legacy',
      interactive: true,
      reason: null,
    },
    get currentName() {
      return readCurrentName(type, raw, fallbackLabel);
    },
  };
}

/**
 * Stable id for a neighbour-network entry. Prefers the entry's own persisted id
 * (the `link_*` / `generated_*` / `live_*` ids the link/save/render paths mint),
 * falling back to a name-derived `neighbour.<snake>` so an entry that predates
 * those ids still resolves.
 *
 * @param {Record<string, any> | null | undefined} entry
 * @returns {string|null}
 */
export function neighbourIdFor(entry) {
  if (!entry || typeof entry !== 'object') return null;
  if (typeof entry.id === 'string' && entry.id) return entry.id;
  const name = entry.neighbourName || entry.name || entry.label;
  return name ? `neighbour.${slugifyEntity(name)}` : null;
}

/**
 * Stable id for a historical / timeline event. Events already carry an `id` in
 * most generated saves; legacy events without one get a deterministic
 * `event.<snake(name)>`, and a last-resort `event.index-N` when even the name
 * is missing.
 *
 * @param {Record<string, any> | null | undefined} event
 * @param {number} [_index] retained for call-site compatibility; never identity
 * @returns {string|null}
 */
export function eventIdFor(event, _index) {
  if (!event || typeof event !== 'object') return null;
  if (typeof event.id === 'string' && event.id) return event.id;
  const name = event.name || event.title || event.label;
  if (name) return `event.${slugifyEntity(name)}`;
  // The former `event.index-N` fallback relinked an old event when an unrelated
  // sibling was inserted or reordered. Canonical key ordering makes this
  // surrogate stable across JSON export/import and object-key insertion order.
  // Byte-identical anonymous events intentionally collide; the index marks that
  // ambiguity non-interactive below rather than smuggling array position back
  // into durable-looking identity.
  const canonical = JSON.stringify(stableEntityClone(event)) || '{}';
  return `event.legacy-${fnv1a32(canonical).toString(36)}`;
}

/**
 * Build a JSON-safe, key-sorted value for deterministic legacy identity.
 *
 * @param {unknown} value
 * @param {WeakSet<object>} [ancestors]
 * @returns {unknown}
 */
function stableEntityClone(value, ancestors = new WeakSet()) {
  if (value == null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : String(value);
  if (typeof value === 'bigint') return String(value);
  if (typeof value === 'undefined' || typeof value === 'function' || typeof value === 'symbol') {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString();
  }
  if (typeof value !== 'object') return String(value);
  if (ancestors.has(value)) return '[Circular]';
  ancestors.add(value);

  let clone;
  if (Array.isArray(value)) {
    clone = value.map(entry => stableEntityClone(entry, ancestors));
  } else {
    /** @type {Record<string, unknown>} */
    const objectClone = {};
    const record = /** @type {Record<string, unknown>} */ (value);
    for (const key of Object.keys(record).sort()) {
      objectClone[key] = stableEntityClone(record[key], ancestors);
    }
    clone = objectClone;
  }
  ancestors.delete(value);
  return clone;
}

/**
 * Build a navigable index of the dossier's structured entities.
 *
 * Returns the original per-kind arrays (npcs / factions / institutions /
 * resources / neighbours / events / deities) PLUS a flat `byId` map and a
 * `resolve(id)` lookup so the hyperlink layer can turn a stable id into
 * `{ id, type, tab, anchor, currentName }`. Faction ids are the canonical
 * `factionIdFromName` (snake) so a name-stated NPC affiliation resolves with no
 * name-matching. All ids derive from existing fields (no generator change), so
 * generator output stays byte-identical and links follow entities by id.
 *
 * @param {Record<string, any>} [settlement]
 */
export function buildDossierEntityIndex(settlement = {}) {
  const npcs = (settlement.npcs || []).map((/** @type {any} */ npc) =>
    decorateEntry('npc', { ...entityLink('npc', npc), traits: normalizeNpcTraits(npc) }, npc));

  const factions = (settlement.powerStructure?.factions || settlement.factions || []).map((/** @type {any} */ faction) => {
    const displayName = faction.faction || faction.name || faction.label;
    const base = {
      ...entityLink('faction', faction, faction.faction),
      label: displayName || 'Faction',
    };
    // IDENTITY must be the canonical snake id (== npc.factionLink), not the
    // hyphen anchor slug entityLink derives. Override it here.
    base.id = factionIdFromName(displayName) || base.id;
    // RENAME-TOLERANCE SEAM: the name-derived id above stays the primary key
    // every current consumer computes from the display name. But when a faction
    // carries a STABLE, rename-decoupled `faction.id`, ALSO register the entry
    // under that id so a link holding the stable id resolves to the same card.
    const entry = decorateEntry('faction', base, faction);
    if (typeof faction.id === 'string' && faction.id && faction.id !== base.id) {
      entry.aliasIds = [faction.id];
    }
    return entry;
  });

  const institutions = (settlement.institutions || []).map((/** @type {any} */ inst) =>
    decorateEntry('institution', { ...entityLink('institution', inst) }, inst));

  const resources = [
    ...(settlement.config?.nearbyResources || []),
    ...(settlement.resourceAnalysis?.availableResources || []),
  ].map((/** @type {any} */ resource) => {
    const entity = typeof resource === 'string'
      ? { id: resource, name: resource.replace(/_/g, ' ') }
      : resource;
    return decorateEntry('resource', { ...entityLink('resource', entity) }, entity);
  });

  // NEIGHBOURS — the unified neighbourNetwork plus the live generator
  // `neighborRelationship` entry RelationshipsTab synthesizes for unsaved
  // settlements. Dedup by neighbour name keeps the persisted entry authoritative
  // over the synthesized live one.
  /** @type {Record<string, any>[]} */
  const neighbourEntries = [];
  const seenNeighbourNames = new Set();
  const pushNeighbour = (/** @type {any} */ entry) => {
    if (!entry || typeof entry !== 'object') return;
    const id = neighbourIdFor(entry);
    if (!id) return;
    const nameKey = String(entry.neighbourName || entry.name || '').toLowerCase();
    if (nameKey && seenNeighbourNames.has(nameKey)) return;
    if (nameKey) seenNeighbourNames.add(nameKey);
    const base = {
      ...entityLink('neighbour', { id, name: entry.neighbourName || entry.name }),
      label: entry.neighbourName || entry.name || 'Neighbour',
    };
    base.id = id;
    neighbourEntries.push(decorateEntry('neighbour', base, entry));
  };
  for (const entry of settlement.neighbourNetwork || []) pushNeighbour(entry);
  const liveNeighbour = settlement.neighborRelationship;
  if (liveNeighbour?.name) {
    pushNeighbour({
      id: `live_${liveNeighbour.name}`,
      name: liveNeighbour.name,
      neighbourName: liveNeighbour.name,
      relationshipType: liveNeighbour.relationshipType || 'neutral',
    });
  }

  // EVENTS — historical + timeline beats, indexed as link TARGETS. Keyed by the
  // event's own id or a name-derived `event.<snake>`; first id wins on collision.
  /** @type {Record<string, any>[]} */
  const eventEntries = [];
  const rawEvents = [
    ...(settlement.history?.historicalEvents || []),
    ...(settlement.history?.eventsTimeline || []),
  ];
  rawEvents.forEach((/** @type {any} */ event, /** @type {number} */ i) => {
    if (!event || typeof event !== 'object') return;
    const id = eventIdFor(event, i);
    if (!id) return;
    const base = {
      ...entityLink('event', { id, name: event.name || event.title || event.type || 'Event' }),
      label: event.name || event.title || event.type || 'Event',
    };
    base.id = id;
    eventEntries.push(decorateEntry('event', base, event));
  });

  // Optional deity (war/faith snapshot). Indexed only when a recognizable name
  // is present, as a TRUE `deity` entry: identity is the `deity.<slug>` id
  // WarFaithSection's EntityLink carries; the anchor is `dossier-deity-<slug>`.
  /** @type {Record<string, any>[]} */
  const deities = [];
  const deityName = settlement.config?.primaryDeitySnapshot?.name
    || settlement.primaryDeity?.name
    || settlement.config?.primaryDeitySnapshot?.deity;
  if (deityName) {
    const rawDeity = settlement.config?.primaryDeitySnapshot || settlement.primaryDeity || { name: deityName };
    const deityId = `deity.${slugifyEntity(deityName)}`;
    const base = {
      ...entityLink('deity', { name: deityName }),
      id: deityId,
    };
    deities.push(decorateEntry('deity', base, rawDeity));
  }

  // The settlement itself is addressable (overview tab).
  /** @type {Record<string, any>[]} */
  const settlementEntries = [];
  if (settlement.id || settlement.name) {
    settlementEntries.push(decorateEntry('settlement', { ...entityLink('settlement', settlement) }, settlement));
  }

  // byId order = resolution precedence on id collision (first wins). Named
  // entities come before resources/neighbours/events so a richer card always
  // wins a shared slug; deities + settlement last as catch-alls.
  const all = [
    ...npcs, ...factions, ...institutions,
    ...resources, ...neighbourEntries, ...eventEntries,
    ...deities, ...settlementEntries,
  ];

  // Same-family identity reuse is ambiguous. Preserve every readable entry in
  // its family array, but make the shared reference non-interactive so no link
  // can silently choose the first sibling. Cross-family collisions keep the
  // historical richer-kind precedence because callers also carry a type.
  const identityCounts = new Map();
  for (const entry of all) {
    const key = `${entry.type}:${entry.id}`;
    identityCounts.set(key, (identityCounts.get(key) || 0) + 1);
  }
  for (const entry of all) {
    if ((identityCounts.get(`${entry.type}:${entry.id}`) || 0) <= 1) continue;
    entry.identity = {
      state: 'degraded_collision',
      interactive: false,
      reason: 'More than one legacy record resolves to this identity.',
    };
  }
  /** @type {Map<string, Record<string, any>>} */
  const byId = new Map();
  for (const entry of all) {
    if (entry.id && !byId.has(entry.id)) byId.set(entry.id, entry);
  }
  // Register alias ids AFTER every primary id so a primary always wins a shared
  // key. Today only factions carry `aliasIds` (their stable rename-decoupled id).
  for (const entry of all) {
    const aliases = entry.aliasIds;
    if (!Array.isArray(aliases)) continue;
    for (const aliasId of aliases) {
      if (aliasId && !byId.has(aliasId)) byId.set(aliasId, entry);
    }
  }

  return {
    npcs,
    factions,
    institutions,
    resources,
    neighbours: neighbourEntries,
    events: eventEntries,
    deities,
    settlement: settlementEntries[0] || null,
    byId,
    /**
     * Resolve a stable id to its decorated entry, or null (broken-link guard).
     * @param {string} id
     */
    resolve: (id) => (id && byId.get(id)) || null,
    /**
     * Resolve a trade partner (a neighbour NAME or id stored in economicState)
     * to its neighbour entry — trade-partner links reuse the SAME relationship
     * card rather than minting a separate type. Returns null when no neighbour
     * matches (degrade to plain text).
     * @param {string} nameOrId
     */
    resolveTradePartner: (nameOrId) => {
      if (!nameOrId) return null;
      const direct = byId.get(nameOrId);
      if (direct && direct.type === 'neighbour') return direct;
      const key = slugifyEntity(nameOrId);
      return neighbourEntries.find((/** @type {any} */ n) =>
        slugifyEntity(n.currentName) === key
        || slugifyEntity(n.raw?.neighbourName || n.raw?.name) === key) || null;
    },
  };
}
