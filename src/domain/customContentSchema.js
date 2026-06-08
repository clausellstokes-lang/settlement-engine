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

// How (if at all) an entity contributes to the settlement's defense. Feeds the
// Defense readiness model in generation (P2): garrisons/militia raise standing
// forces, fortifications raise the wall rating, arcane wards add magical defense.
export const DEFENSE_ROLES = Object.freeze([
  { key: 'none',          label: 'Does not contribute to defense' },
  { key: 'fortification', label: 'Fortification — walls, towers' },
  { key: 'garrison',      label: 'Garrison — standing troops' },
  { key: 'militia',       label: 'Militia — muster of locals' },
  { key: 'watch',         label: 'Watch — patrol & policing' },
  { key: 'arcane_ward',   label: 'Arcane wards' },
  { key: 'logistics',     label: 'Logistics — supply & siege endurance' },
  { key: 'intelligence',  label: 'Intelligence — scouting & spies' },
]);
export const DEFENSE_ROLE_KEYS = Object.freeze(DEFENSE_ROLES.map((d) => d.key));

// Which authority an entity feeds in the power structure (e.g. a temple →
// religious authority, a garrison → martial). Feeds legitimacy/power generation
// (P2) so homebrew shifts who actually holds sway.
export const POWER_AUTHORITIES = Object.freeze([
  { key: 'religious', label: 'Religious authority' },
  { key: 'martial',   label: 'Martial authority' },
  { key: 'economic',  label: 'Economic authority' },
  { key: 'arcane',    label: 'Arcane authority' },
  { key: 'civic',     label: 'Civic / legal authority' },
  { key: 'popular',   label: 'Popular support' },
  { key: 'noble',     label: 'Noble / dynastic' },
  { key: 'criminal',  label: 'Criminal influence' },
]);
export const POWER_AUTHORITY_KEYS = Object.freeze(POWER_AUTHORITIES.map((a) => a.key));

// Controlled tag vocabulary (selectable, not free text) — descriptors that map
// onto the same domains as CONTENT_GROUPS, so tags stay meaningful to the
// generator instead of arbitrary strings.
export const CONTENT_TAGS = Object.freeze([
  'essential', 'civic', 'legal', 'administrative', 'sacred', 'arcane',
  'martial', 'defensive', 'mercantile', 'agricultural', 'industrial', 'craft',
  'illicit', 'scholarly', 'medical', 'cultural', 'logistical', 'noble',
]);

// Controlled commodity vocabulary for resources/goods (selectable, not free text).
export const COMMODITY_TYPES = Object.freeze([
  'grain', 'livestock', 'fish', 'timber', 'stone', 'ore', 'metal', 'gems',
  'salt', 'textiles', 'leather', 'spices', 'wine', 'tools', 'weapons',
  'pottery', 'herbs', 'furs', 'reagents', 'oil',
]);

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
 * Filter a whole customContent blob to the items eligible for a settlement of
 * `tier`, honoring each item's tier gate (§14 P2 — gates honored in generation).
 * Items with no gate pass through, so ungated buckets (resources, stressors, …)
 * are unaffected. Pure — never mutates the input; returns the blob unchanged
 * when no tier is given.
 *
 * @param {Object|null} customContent
 * @param {{ tier?: string }} [opts]
 * @returns {Object|null}
 */
export function eligibleCustomContent(customContent, { tier } = {}) {
  if (!customContent || typeof customContent !== 'object' || !tier) return customContent;
  const out = {};
  for (const [bucket, items] of Object.entries(customContent)) {
    out[bucket] = Array.isArray(items) ? items.filter((it) => passesTierGate(it, tier)) : items;
  }
  return out;
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
