/**
 * domain/customContentSchema.js — the shared backbone for homebrew custom
 * content (§14 P1). One source of truth for the cross-type taxonomies every
 * custom entity (institution, service, resource, trade good, faction, supply
 * chain) shares — the domain GROUP it belongs to, its TAGS (magical / criminal
 * / …), how much it reinforces the economy, how critical it is, and its tier
 * gate — consumed by BOTH the management UI and the structural classifier so
 * they never drift.
 *
 * Pure data + tiny helpers; no store / React. Generation phases (P2–P4) read
 * the helpers here (tier gates, effective tags, criticality) so homebrew flows
 * through the same simulation rails as built-in content.
 */

// Domain groups. Beyond categorizing, the group decides WHERE an entity surfaces
// in the dossier (government → Power, economic → Economics, religious/arcane →
// Services, etc.), so placement stays coherent.
export const CONTENT_GROUPS = Object.freeze([
  { key: 'government',     label: 'Government & Law' },
  { key: 'infrastructure', label: 'Infrastructure' },
  { key: 'economic',       label: 'Economy & Trade' },
  { key: 'military',       label: 'Military & Defense' },
  { key: 'religious',      label: 'Religion' },
  { key: 'arcane',         label: 'Arcane & Magic' },
  { key: 'criminal',       label: 'Crime & Underworld' },
  { key: 'social',         label: 'Social & Cultural' },
]);
export const CONTENT_GROUP_KEYS = Object.freeze(CONTENT_GROUPS.map((g) => g.key));

// How critical a good / resource / service is. Drives consequence weight when
// its supply is disrupted (P4 wires this into stressors + viability): a broken
// CRITICAL chain (food, timber) is a crisis; a luxury one is a minor dip.
export const CRITICALITY = Object.freeze([
  { key: 'critical',      label: 'Critical — food, water, timber' },
  { key: 'important',     label: 'Important' },
  { key: 'discretionary', label: 'Discretionary — luxury / comfort' },
]);
export const CRITICALITY_KEYS = Object.freeze(CRITICALITY.map((c) => c.key));

// How much a good / service reinforces the local economy.
export const ECONOMIC_WEIGHT = Object.freeze([
  { key: 'minor',    label: 'Minor' },
  { key: 'moderate', label: 'Moderate' },
  { key: 'major',    label: 'Major' },
  { key: 'backbone', label: 'Backbone of the economy' },
]);
export const ECONOMIC_WEIGHT_KEYS = Object.freeze(ECONOMIC_WEIGHT.map((w) => w.key));

// Settlement tiers, smallest → largest, for tier gates (min/max).
export const TIER_ORDER = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Normalize a comma-string or array of tags to a clean lowercase array. */
export function normalizeTags(raw) {
  if (Array.isArray(raw)) return raw.map((t) => String(t).trim().toLowerCase()).filter(Boolean);
  if (typeof raw === 'string') return raw.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
  return [];
}

/** Effective tags including the magical / criminal toggles folded in. */
export function effectiveTags(entity = {}) {
  const tags = new Set(normalizeTags(entity?.tags));
  if (entity?.magical) tags.add('magical');
  if (entity?.criminal) tags.add('criminal');
  return Array.from(tags);
}

export function isMagical(entity = {}) {
  return entity?.magical === true || normalizeTags(entity?.tags).includes('magical');
}

export function isCriminal(entity = {}) {
  return entity?.criminal === true || normalizeTags(entity?.tags).includes('criminal');
}

/**
 * Does `entity` satisfy its tier gate at the given settlement `tier`?
 * tierMin / tierMax are inclusive; missing gates mean "no bound". Unknown tiers
 * pass (fail-open — never hide content over a typo).
 */
export function passesTierGate(entity = {}, tier) {
  if (!tier) return true;
  const ti = TIER_ORDER.indexOf(String(tier).toLowerCase());
  if (ti === -1) return true;
  const minRaw = entity?.tierMin ? TIER_ORDER.indexOf(String(entity.tierMin).toLowerCase()) : -1;
  const maxRaw = entity?.tierMax ? TIER_ORDER.indexOf(String(entity.tierMax).toLowerCase()) : -1;
  if (minRaw !== -1 && ti < minRaw) return false;
  if (maxRaw !== -1 && ti > maxRaw) return false;
  return true;
}
