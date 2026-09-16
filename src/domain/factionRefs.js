/**
 * domain/factionRefs.js — the small, import-free faction-reference contract.
 *
 * `linkedFactionIds` predates a uniformly ID-bearing faction schema. Its entries
 * are therefore canonical id-first HANDLES today: an authored `faction.id` when
 * present, otherwise the generated seat's canonical `.faction` / legacy `.name`.
 * Keep production and compatibility matching here until a governed save migration
 * can make the field ID-only.
 *
 * Pure leaf: no catalog, world-pulse, store, or presentation imports.
 */

/** @typedef {{ id?: unknown, faction?: unknown, name?: unknown }} FactionRefRecord */

/** @param {unknown} value @returns {string} */
function refText(value) {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
}

/**
 * Canonical faction display label: generated `.faction`, then legacy `.name`.
 * @param {FactionRefRecord | null | undefined} faction
 * @returns {string}
 */
export function factionDisplayNameOf(faction) {
  const f = /** @type {FactionRefRecord | null | undefined} */ (faction);
  return refText(f?.faction) || refText(f?.name);
}

/**
 * Canonical persisted faction handle for `linkedFactionIds` and other identity
 * seams. A durable authored id wins; name-only generated seats remain supported.
 *
 * @param {FactionRefRecord | null | undefined} faction
 * @returns {string}
 */
export function factionRefOf(faction) {
  return refText(faction?.id) || factionDisplayNameOf(faction);
}

/**
 * Every exact historical handle by which this faction can still be addressed.
 * Canonical id comes first; `.faction` and `.name` remain read aliases while old
 * saves can contain display-name links.
 *
 * @param {FactionRefRecord | null | undefined} faction
 * @returns {string[]}
 */
export function factionRefAliases(faction) {
  const aliases = [
    refText(faction?.id),
    refText(faction?.faction),
    refText(faction?.name),
  ].filter(Boolean);
  return [...new Set(aliases)];
}

/**
 * Exact, case-preserving compatibility match against one faction record.
 * @param {FactionRefRecord | null | undefined} faction
 * @param {unknown} ref
 * @returns {boolean}
 */
export function factionMatchesRef(faction, ref) {
  const target = refText(ref);
  return Boolean(target) && factionRefAliases(faction).includes(target);
}

/**
 * Resolve a handle against a roster without false joins. Exact ids have priority
 * over display aliases; an ambiguous duplicate id or duplicate name resolves to
 * null instead of selecting whichever record happened to be iterated first.
 *
 * @template {FactionRefRecord} F
 * @param {F[] | null | undefined} factions
 * @param {unknown} ref
 * @returns {F | null}
 */
export function resolveFactionRef(factions, ref) {
  const target = refText(ref);
  if (!target || !Array.isArray(factions)) return null;

  const idMatches = factions.filter((faction) => refText(faction?.id) === target);
  if (idMatches.length) return idMatches.length === 1 ? idMatches[0] : null;

  const nameMatches = factions.filter((faction) => (
    refText(faction?.faction) === target || refText(faction?.name) === target
  ));
  return nameMatches.length === 1 ? nameMatches[0] : null;
}

/**
 * Does an entity's `linkedFactionIds` roster address this faction? When the full
 * roster is supplied, resolution honors id priority and ambiguity rejection.
 *
 * @param {{ linkedFactionIds?: unknown } | null | undefined} entity
 * @param {FactionRefRecord | null | undefined} faction
 * @param {FactionRefRecord[] | null | undefined} [factions]
 * @returns {boolean}
 */
export function entityLinksFaction(entity, faction, factions) {
  const links = Array.isArray(entity?.linkedFactionIds) ? entity.linkedFactionIds : [];
  if (Array.isArray(factions)) {
    return links.some((ref) => resolveFactionRef(factions, ref) === faction);
  }
  return links.some((ref) => factionMatchesRef(faction, ref));
}
