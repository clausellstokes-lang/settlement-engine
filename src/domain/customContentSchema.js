/**
 * domain/customContentSchema.js — the shared backbone for homebrew custom
 * content. One source of truth for the cross-type taxonomies every
 * custom entity (institution, service, resource, trade good, faction, supply
 * chain) shares — the domain GROUP it belongs to, its TAGS (magical / criminal
 * / …), how much it reinforces the economy, how critical it is, and its tier
 * gate — consumed by BOTH the management UI and the structural classifier so
 * they never drift.
 *
 * Pure data + tiny helpers; no store / React. The generation phases read
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
// its supply is disrupted (wired into stressors + viability): a broken
// CRITICAL chain (food, timber) is a crisis; a luxury one is a minor dip.
export const CRITICALITY = Object.freeze([
  { key: 'critical',      label: 'Critical: food, water, timber' },
  { key: 'important',     label: 'Important' },
  { key: 'discretionary', label: 'Discretionary: luxury / comfort' },
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
// Defense readiness model in generation: garrisons/militia raise standing
// forces, fortifications raise the wall rating, arcane wards add magical defense.
export const DEFENSE_ROLES = Object.freeze([
  { key: 'none',          label: 'Does not contribute to defense' },
  { key: 'fortification', label: 'Fortification: walls, towers' },
  { key: 'garrison',      label: 'Garrison: standing troops' },
  { key: 'militia',       label: 'Militia: muster of locals' },
  { key: 'watch',         label: 'Watch: patrol & policing' },
  { key: 'arcane_ward',   label: 'Arcane wards' },
  { key: 'logistics',     label: 'Logistics: supply & siege endurance' },
  { key: 'intelligence',  label: 'Intelligence: scouting & spies' },
]);
export const DEFENSE_ROLE_KEYS = Object.freeze(DEFENSE_ROLES.map((d) => d.key));

// Which authority an entity feeds in the power structure (e.g. a temple →
// religious authority, a garrison → martial). Feeds legitimacy/power generation
// so homebrew shifts who actually holds sway.
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

// Whether an institution / good / service / resource moves the settlement's
// food balance. Feeds the food-security model (dailyProduction / dailyNeed) so a
// custom farm actually shrinks the deficit and a luxury-only economy widens it.
// Distinct from CRITICALITY (how essential a good is); this is supply vs demand.
export const FOOD_IMPACT = Object.freeze([
  { key: 'none',     label: 'No food impact' },
  { key: 'produces', label: 'Produces food. Raises supply' },
  { key: 'consumes', label: 'Consumes food. Raises demand' },
]);
export const FOOD_IMPACT_KEYS = Object.freeze(FOOD_IMPACT.map((f) => f.key));

// The unified TRADE-CATEGORY taxonomy a custom good/institution declares via
// `satisfies`. One list, two kinds:
//   • demandLive (military…alchemical): keys MUST match INSTITUTION_FINISHED_GOODS_DEMAND
//     in src/data/economicData.js — the generator counts the item as local supply
//     for that demand (shrinks the matching import, e.g. an institution needing arms
//     buys local Dragonbone Greatswords; exports the surplus once demand is met).
//   • classification (agricultural…food_processed): mirror GOODS_CATEGORIES. No demand
//     consumer, but a custom good still FOLDS into this category's trade line and
//     exports as surplus — so the Economics tab shows one bucket, not a pill per good.
// Free-text ("Other") values are allowed too: they fold under the typed label and
// persist in the picker as long as some item references them (see satisfiesOptions).
export const TRADE_CATEGORIES = Object.freeze([
  { key: 'military',      label: 'Weapons & armour',      demandLive: true },
  { key: 'religious',     label: 'Religious consumables', demandLive: true },
  { key: 'maritime',      label: 'Maritime supplies',     demandLive: true },
  { key: 'luxury',        label: 'Luxury goods',          demandLive: true },
  { key: 'alchemical',    label: 'Alchemical supplies',   demandLive: true },
  { key: 'agricultural',  label: 'Agricultural produce' },
  { key: 'raw_materials', label: 'Raw materials' },
  { key: 'manufactured',  label: 'Manufactured goods' },
  { key: 'food_processed', label: 'Processed food' },
]);
const _TRADE_CAT_BY_KEY = new Map(TRADE_CATEGORIES.map((c) => [c.key, c]));

/** Display label for a `satisfies` value: a known category key → its label; a
 *  free-text ("Other") value → returned as-is by the caller (this returns null). */
export function tradeCategoryLabelOf(value) {
  if (!value) return null;
  return _TRADE_CAT_BY_KEY.get(String(value))?.label || null;
}

/** Picker options for the `satisfies` field: the unified categories as builtins
 *  (value=key) + any free-text value currently in use across custom goods/
 *  institutions (the "Other" escape hatch — persists only while referenced). */
export function satisfiesOptions(customContent) {
  const builtins = TRADE_CATEGORIES.map((c) => ({ value: c.key, label: c.label }));
  const knownKeys = new Set(TRADE_CATEGORIES.map((c) => c.key));
  const seen = new Map();
  for (const type of ['institutions', 'tradeGoods']) {
    for (const item of (customContent?.[type] || [])) {
      const v = String(item?.satisfies || '').trim();
      if (!v || knownKeys.has(v)) continue;
      if (!seen.has(v.toLowerCase())) seen.set(v.toLowerCase(), v);
    }
  }
  return { builtins, customs: [...seen.values()].sort((a, b) => a.localeCompare(b)) };
}

// Back-compat: the DEMAND subset (the 5 categories that drive
// INSTITUTION_FINISHED_GOODS_DEMAND). finishedGoodsSupply + the demand engine
// match against these keys; the classification categories above are display/export
// buckets only.
export const SATISFIES_CATEGORIES = Object.freeze(TRADE_CATEGORIES.filter((c) => c.demandLive));
export const SATISFIES_KEYS = Object.freeze(SATISFIES_CATEGORIES.map((c) => c.key));

// ── Deities ─────────────────────────────────────────────────────────────────
// A homebrew deity is authored content under the `religious` group. It is INERT
// (dormant) until a DM assigns it as a settlement's primary deity — only then
// does a resolved snapshot embed on the settlement record (the embed bridge) and
// feed the religion substrate. Three frozen tag axes describe the god; all three
// are required at author time (the DB CHECK in 049 mirrors these enums exactly).

// Moral alignment — good / evil / neutral. Feeds the good↔evil NPC substrate
// and the contest's alignment-direction match.
export const DEITY_ALIGNMENT = Object.freeze([
  { key: 'good',    label: 'Good' },
  { key: 'evil',    label: 'Evil' },
  { key: 'neutral', label: 'Neutral' },
]);
export const DEITY_ALIGNMENT_KEYS = Object.freeze(DEITY_ALIGNMENT.map((a) => a.key));

// Temperament — warlike / peacelike / neutral. A warlike-evil god is a casus belli;
// feeds the warlike-posture term of the contest.
export const DEITY_TEMPER = Object.freeze([
  { key: 'warlike',   label: 'Warlike' },
  { key: 'peacelike', label: 'Peacelike' },
  { key: 'neutral',   label: 'Neutral' },
]);
export const DEITY_TEMPER_KEYS = Object.freeze(DEITY_TEMPER.map((t) => t.key));

// Rank/scale — major / minor / cult. Scales how strongly the deity lifts
// religious_authority (a major pantheon-head outweighs a fringe cult).
export const DEITY_TIER = Object.freeze([
  { key: 'major', label: 'Major: a pillar of the pantheon' },
  { key: 'minor', label: 'Minor: a lesser god' },
  { key: 'cult',  label: 'Cult: a fringe or secret following' },
]);
export const DEITY_TIER_KEYS = Object.freeze(DEITY_TIER.map((r) => r.key));

// Law/chaos — lawful / chaotic / neutral. The 4th axis. Couples
// into the law_order causal variable: a lawful god RAISES order/legitimacy
// pressure; a chaotic god LOWERS order AND makes corruption more TOLERATED — a
// DISTINCT lever from the good/evil corruption knobs, which drive onset/
// exposure directly. `neutral` is the back-compat default: a 3-axis deity
// authored before this axis existed is tolerated as lawAxis === 'neutral' (no law_order term).
export const DEITY_LAW = Object.freeze([
  { key: 'lawful',  label: 'Lawful: upholds order and oaths' },
  { key: 'chaotic', label: 'Chaotic: erodes order, tolerates corruption' },
  { key: 'neutral', label: 'Neutral' },
]);
export const DEITY_LAW_KEYS = Object.freeze(DEITY_LAW.map((l) => l.key));

/**
 * Validate an authored deity record. Returns { ok, errors } — mirrors the
 * write-time validation the other buckets perform implicitly (a name is
 * required; the first three axes must each be one of their frozen enums). Pure;
 * no store/React. The store slice rejects a write whose `errors` is non-empty so
 * a bad axis never reaches the cloud (where the 049/056 CHECK would hard-reject
 * it).
 *
 * The 4th axis `lawAxis` is BACK-COMPAT TOLERANT: a NEW deity should set it
 * (the authoring UI always does), but a deity authored before the axis existed carries no
 * lawAxis at all — that ABSENCE is tolerated and read as `neutral` (no law_order
 * term), so legacy deity content never breaks. An explicitly PRESENT-but-invalid
 * lawAxis is still rejected (a typo can't slip through). The 056 DB CHECK mirrors
 * exactly this: NULL/absent lawAxis is admitted, a present bad value rejected.
 *
 * @param {any} deity
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateDeity(deity = {}) {
  const errors = [];
  const name = String(deity?.name || '').trim();
  if (!name) errors.push('A deity needs a name.');
  if (!DEITY_ALIGNMENT_KEYS.includes(deity?.alignmentAxis)) {
    errors.push(`alignmentAxis must be one of: ${DEITY_ALIGNMENT_KEYS.join(', ')}.`);
  }
  if (!DEITY_TEMPER_KEYS.includes(deity?.temperamentAxis)) {
    errors.push(`temperamentAxis must be one of: ${DEITY_TEMPER_KEYS.join(', ')}.`);
  }
  if (!DEITY_TIER_KEYS.includes(deity?.rankAxis)) {
    errors.push(`rankAxis must be one of: ${DEITY_TIER_KEYS.join(', ')}.`);
  }
  // lawAxis: tolerate ABSENCE (legacy 3-axis deity ⇒ neutral); reject only a
  // present-but-invalid value. `== null` covers both undefined and null.
  if (deity?.lawAxis != null && !DEITY_LAW_KEYS.includes(deity.lawAxis)) {
    errors.push(`lawAxis must be one of: ${DEITY_LAW_KEYS.join(', ')}.`);
  }
  return { ok: errors.length === 0, errors };
}

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
 * `tier`, honoring each item's tier gate (gates honored in generation).
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
