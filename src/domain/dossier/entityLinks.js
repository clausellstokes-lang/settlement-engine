import { factionIdFromName } from '../../lib/entities.js';

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
  // falling through to slugifyEntity('deity') — keeps the sink anchor legible
  // and self-documenting.
  deity: 'deity',
  event: 'event',
  hook: 'hook',
  condition: 'condition',
});

export function slugifyEntity(/** @type {any} */ value) {
  return String(value || 'unknown')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'unknown';
}

export function entityAnchor(/** @type {any} */ kind, /** @type {any} */ entity, fallback = '') {
  const prefix = (/** @type {any} */ (KIND_PREFIX))[kind] || slugifyEntity(kind);
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

export function entityLink(/** @type {any} */ kind, /** @type {any} */ entity, fallback = '') {
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
 * Shared by every site that holds a bare NPC name (or a partial object without
 * the stable id): NeighbourLinkCard's npcConnections, PowerTab sub-faction
 * members, EngineSections rivals.
 *
 * @param {object|null} index  buildDossierEntityIndex result (or null).
 * @param {string} name        The NPC's stated name.
 * @returns {string|null}
 */
export function localNpcId(index, name) {
  if (!index || !name) return null;
  const key = String(name).trim().toLowerCase();
  if (!key) return null;
  const hit = ((/** @type {any} */ (index)).npcs || []).find(
    (/** @type {any} */ n) => String(n.currentName || '').trim().toLowerCase() === key,
  );
  return hit ? hit.id : null;
}

/**
 * Resolve an institution display name to its stable index id, matching against
 * the index's STRUCTURED institution entries (by slugified current name) — never
 * by regex-scanning prose. Returns the entry's id (rename-safe: EntityLink
 * re-resolves the current name at render) or null when no institution matches,
 * in which case the caller degrades to plain text rather than a dead link.
 *
 * Shared by every tab that holds a bare institution name and wants a link:
 * EconomicsTab's `Via:` providers, PowerTab's per-faction institutional
 * footprint. Slugify normalizes case + punctuation so the match holds
 * regardless of the source's casing.
 *
 * @param {{institutions?: Array<{id: string, currentName?: string, raw?: {name?: string}}>}|null} index
 *   buildDossierEntityIndex result (or null off-dossier).
 * @param {string} name         Institution display name to resolve.
 * @returns {string|null}       Stable institution id, or null.
 */
export function institutionIdFromName(index, name) {
  if (!index?.institutions?.length || !name) return null;
  const key = slugifyEntity(name);
  const hit = index.institutions.find(
    /** @param {{id: string, currentName?: string, raw?: {name?: string}}} inst */
    inst =>
      slugifyEntity(inst.currentName) === key
      || slugifyEntity(inst.raw?.name) === key);
  return hit ? hit.id : null;
}

function normalizeList(/** @type {any} */ value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return [String(value)].filter(Boolean);
}

function pushTrait(/** @type {any} */ out, /** @type {any} */ key, /** @type {any} */ label, /** @type {any} */ value, visibility = 'public') {
  const values = normalizeList(value);
  for (const item of values) {
    const trimmed = item.trim();
    if (!trimmed) continue;
    out.push({ key, label, value: trimmed, visibility });
  }
}

function firstText(/** @type {any[]} */ ...values) {
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

export function normalizeNpcTraits(/** @type {any} */ npc = {}) {
  /** @type {any[]} */
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
 * decide which tab to switch to before scrolling.
 *
 * Institutions are enumerated as their own objects ONLY in the Overview tab's
 * Institutions disclosure (the Power tab renders none; Services/Defense/
 * Economics only mention them as 'Via:' providers), so institution links land
 * on 'overview' where the sink lives.
 *
 * Neighbours route to 'relationships' rather than 'neighbours': the
 * NeighbourLinkCard sink renders on BOTH the full Relationships tab and the
 * neighbours-only tab, but 'relationships' is registered on a superset
 * condition (relationships/factions/conflicts OR a neighbour network) whereas
 * 'neighbours' is gated more narrowly. Routing to the superset tab means a
 * neighbour link never no-ops on a settlement that registered only the full
 * tab.
 * @type {Readonly<Record<string,string>>}
 */
export const TYPE_TO_TAB = Object.freeze({
  npc: 'npcs',
  faction: 'power',
  institution: 'overview',
  deity: 'war_faith',
  settlement: 'overview',
  // Phase C additions — the tab each newly-indexed type calls home. Neighbours
  // (and the trade partners that resolve to them) live on the Relationships
  // tab; historical events on History; resources/services on their own tabs.
  neighbour: 'relationships',
  event: 'history',
  resource: 'resources',
  service: 'services',
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
  // A neighbour entry's display name is its neighbourName (the partner
  // settlement), falling back to the generic name/label.
  if (type === 'neighbour') return raw.neighbourName || raw.name || raw.label || fallback;
  // Historical events title off name/title/type.
  if (type === 'event') return raw.name || raw.title || raw.label || raw.type || fallback;
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
 * Stable id for a neighbour-network entry. Prefers the entry's own persisted id
 * (the `link_*` / `generated_*` / `live_*` ids the link/save/render paths mint),
 * falling back to a name-derived `neighbour.<snake>` so an entry that predates
 * those ids still resolves. Mirrors the id RelationshipsTab keys its cards by.
 *
 * @param {Record<string, any>} entry
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
 * `event.<snake(name)>` so cross-references and the chronicle TOC resolve.
 * Falls back to the supplied list index only when even the name is missing
 * (last-resort, still stable within a single settlement render).
 *
 * @param {Record<string, any>} event
 * @param {number} index
 * @returns {string|null}
 */
export function eventIdFor(event, index) {
  if (!event || typeof event !== 'object') return null;
  if (typeof event.id === 'string' && event.id) return event.id;
  const name = event.name || event.title || event.label;
  if (name) return `event.${slugifyEntity(name)}`;
  return `event.index-${index}`;
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
 * Phase C extends the index to be EXHAUSTIVE: neighbours (relationship cards),
 * historical events (link targets), and resources are now resolvable, and trade
 * partners reuse the neighbour entries via {@link resolveTradePartner}. All ids
 * are derived from existing fields (no generator change), so generator output
 * stays byte-identical and links follow entities by id (rename-safe).
 *
 * @param {Record<string, any>} [settlement]
 * @returns {{
 *   npcs: object[], factions: object[], institutions: object[], resources: object[],
 *   neighbours: object[], events: object[],
 *   deities: object[], settlement: (object|null),
 *   byId: Map<string, object>,
 *   resolve: (id: string) => (object|null),
 *   resolveTradePartner: (nameOrId: string) => (object|null),
 * }}
 */
export function buildDossierEntityIndex(settlement = {}) {
  const npcs = (settlement.npcs || []).map((/** @type {any} */ npc) =>
    decorateEntry('npc', { ...entityLink('npc', npc), traits: normalizeNpcTraits(npc) }, npc));

  const factions = (settlement.powerStructure?.factions || settlement.factions || []).map((/** @type {any} */ faction) => {
    const base = {
      ...entityLink('faction', faction, faction.faction),
      label: faction.faction || faction.name || faction.label || 'Faction',
    };
    // IDENTITY must be the canonical snake id (== npc.factionLink), not the
    // hyphen anchor slug entityLink derives. Override it here.
    base.id = factionIdFromName(faction.faction || faction.name || faction.label) || base.id;
    return decorateEntry('faction', base, faction);
  });

  const institutions = (settlement.institutions || []).map((/** @type {any} */ inst) =>
    decorateEntry('institution', { ...entityLink('institution', inst) }, inst));

  const resources = [
    ...(settlement.config?.nearbyResources || []),
    ...(settlement.resourceAnalysis?.availableResources || []),
  ].map(resource => {
    const entity = typeof resource === 'string'
      ? { id: resource, name: resource.replace(/_/g, ' ') }
      : resource;
    return decorateEntry('resource', { ...entityLink('resource', entity) }, entity);
  });

  // NEIGHBOURS — the unified neighbourNetwork plus the live generator
  // `neighborRelationship` entry RelationshipsTab synthesizes for unsaved
  // settlements (same `live_<name>` id it mints), so a trade partner / actor
  // ref resolves to the relationship card whether the settlement is saved or
  // freshly generated. Dedup by neighbour name keeps the persisted entry
  // authoritative over the synthesized live one.
  /** @type {object[]} */
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

  // EVENTS — historical + timeline beats, indexed as link TARGETS (actor
  // cross-refs, the chronicle TOC). Keyed by the event's own id or a
  // name-derived `event.<snake>`; first id wins on collision.
  /** @type {object[]} */
  const eventEntries = [];
  const rawEvents = [
    ...(settlement.history?.historicalEvents || []),
    ...(settlement.history?.eventsTimeline || []),
  ];
  rawEvents.forEach((event, i) => {
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

  // Optional deity (war/faith snapshot). No dedicated typedef today, so it is
  // only indexed when a recognizable name is present — kept minimal for Phase A.
  const deities = [];
  const deityName = settlement.config?.primaryDeitySnapshot?.name
    || settlement.primaryDeity?.name
    || settlement.config?.primaryDeitySnapshot?.deity;
  if (deityName) {
    const rawDeity = settlement.config?.primaryDeitySnapshot || settlement.primaryDeity || { name: deityName };
    // Mint a TRUE deity entry (kind 'deity'): identity is the `deity.<slug>` id
    // WarFaithSection's EntityLink carries, and the anchor is `dossier-deity-
    // <slug>` — the SAME string the WarFaithSection sink declares via
    // entityAnchor('deity', …). (Earlier this borrowed kind 'settlement', which
    // produced a `dossier-settlement-<slug>` anchor with no matching sink.)
    const deityId = `deity.${slugifyEntity(deityName)}`;
    const base = {
      ...entityLink('deity', { name: deityName }),
      // Identity is the `deity.<slug>` id WarFaithSection's EntityLink carries;
      // the anchor (built from the name above) stays `dossier-deity-<slug(name)>`,
      // the SAME string the WarFaithSection sink declares via
      // entityAnchor('deity', { name }). Setting `id` from a `{name}`-derived
      // link (not an `{id}`-derived one) keeps anchor and id independent: the
      // anchor never doubles the `deity-` prefix.
      id: deityId,
    };
    deities.push(decorateEntry('deity', base, rawDeity));
  }

  // The settlement itself is addressable (overview tab).
  const settlementEntries = [];
  if (settlement.id || settlement.name) {
    settlementEntries.push(decorateEntry('settlement', { ...entityLink('settlement', settlement) }, settlement));
  }

  // byId order = resolution precedence on id collision (first wins). Named
  // entities (npcs/factions/institutions) come before resources/neighbours/
  // events so a richer card always wins a shared slug; deities + settlement
  // last as catch-alls.
  const all = [
    ...npcs, ...factions, ...institutions,
    ...resources, ...neighbourEntries, ...eventEntries,
    ...deities, ...settlementEntries,
  ];
  const byId = new Map();
  for (const entry of all) {
    if (entry.id && !byId.has(entry.id)) byId.set(entry.id, entry);
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
     * @returns {(object|null)}
     */
    resolve: (id) => (id && byId.get(id)) || null,
    /**
     * Resolve a trade partner (a neighbour NAME or id stored in economicState)
     * to its neighbour entry — Phase B trade-partner links reuse the SAME
     * relationship card rather than minting a separate type. Returns null when
     * no neighbour matches (degrade to plain text). Rename-safe: the returned
     * entry's currentName is still the live getter.
     * @param {string} nameOrId
     * @returns {(object|null)}
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
