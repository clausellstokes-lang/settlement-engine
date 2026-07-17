/**
 * worldPlan.js — the PURE, deterministic plan for an Instant World (W-R2 INSTANT
 * WORLD, owner commission). Given an outer seed + the three basic knobs, this
 * derives EVERYTHING the composer needs — WITHOUT touching a generator, engine,
 * or the store. It is the "derive full config from the basic knobs" step of the
 * composer: seed → realm size (→ tier-mixed settlement count) · tone (→ existing
 * simulation preset) · map kind (→ FMG template) · a seeded scatter of placement
 * sites · a forked per-settlement seed.
 *
 * DETERMINISM: `deriveWorldPlan({ seed })` is a pure function of the seed alone
 * (the knobs default deterministically). Same seed + same knobs → byte-identical
 * plan (no Date, no Math.random, no uuid here). The composer's fingerprint pin
 * rides on this.
 *
 * TIER-BLIND: nothing here reads auth/tier/entitlement. A free user's manual
 * realm and a premium instant realm plan from the same knobs are identical.
 *
 * This module imports ONLY the tier vocabulary + the seeded PRNG — both light,
 * first-paint-safe leaves — so it never drags the generator or region graph in.
 * It is nevertheless reached ONLY behind the composer's dynamic import (the store
 * binding lazy-loads composeInstantWorld), so it costs zero eager bytes.
 */
import { createPRNG } from '../../kernel/prng.js';

// ── Realm size → tier-mixed settlement count ─────────────────────────────────
// JUDGMENT (vetoable — "veto realm-N-mapping"): there is NO forward
// realm-size→count generator in the tree (the survey confirmed the manual flow
// mints ONE settlement per click; multi-settlement realms are hand-assembled),
// so the appropriate-N mapping is authored here from the existing TIER_ORDER
// ladder. Each realm is a plausible pyramid — ONE dominant centre over a spread
// of smaller members — spanning the tier ladder (genuinely "tier-mixed"), sized
// to the honest bands the reverse analytics already speak (constructionUsage.js
// settlementCountBand: 5→'5_9', 9→'5_9', 14→'10_19'; galleryMapsUtils.memberBand:
// small-realm / large-realm). Counts stay modest so a fresh instant realm sits
// well inside the canonize-time simulation cap.
export const REALM_SIZES = Object.freeze({
  small: Object.freeze({
    id: 'small',
    label: 'Small',
    blurb: 'A compact frontier — one market town and its hamlets.',
    // 5 settlements: 1 town · 2 villages · 1 hamlet · 1 thorp
    tiers: Object.freeze(['town', 'village', 'village', 'hamlet', 'thorp']),
  }),
  medium: Object.freeze({
    id: 'medium',
    label: 'Medium',
    blurb: 'A settled region anchored by a walled city.',
    // 9 settlements: 1 city · 2 towns · 3 villages · 2 hamlets · 1 thorp
    tiers: Object.freeze(['city', 'town', 'town', 'village', 'village', 'village', 'hamlet', 'hamlet', 'thorp']),
  }),
  large: Object.freeze({
    id: 'large',
    label: 'Large',
    blurb: 'A whole realm under a great metropolis.',
    // 14 settlements: 1 metropolis · 2 cities · 3 towns · 4 villages · 3 hamlets · 1 thorp
    tiers: Object.freeze(['metropolis', 'city', 'city', 'town', 'town', 'town', 'village', 'village', 'village', 'village', 'hamlet', 'hamlet', 'hamlet', 'thorp']),
  }),
});
export const DEFAULT_REALM_SIZE = 'medium';

// ── Tone → existing simulation-rule preset ───────────────────────────────────
// JUDGMENT (vetoable — "veto tone-mapping"): the commission names the tone class
// "quiet / living / dramatic". The manual flow's one-click tone chips
// (WorldMapToolbar) are Quiet / Realistic / Dramatic → the three canonical
// SIMULATION_RULE_PRESETS ids below; realistic_regional is the manual default.
// The composer applies the chosen preset's rules to the campaign's worldState,
// exactly as the manual "apply preset" path does. (living_realm / full_simulation
// remain reachable via the manual Realm rules dialog.)
export const TONES = Object.freeze([
  Object.freeze({ id: 'quiet_local', label: 'Quiet', blurb: 'Ties hold; change is local and slow.' }),
  Object.freeze({ id: 'realistic_regional', label: 'Realistic', blurb: 'A balanced, believable region.' }),
  Object.freeze({ id: 'dramatic_campaign', label: 'Dramatic', blurb: 'War, faith, and upheaval run hot.' }),
]);
export const DEFAULT_TONE = 'realistic_regional';

// ── Map kind → FMG template ──────────────────────────────────────────────────
// The exact curated island-shape set the manual World-Map toolbar exposes
// (public/map/sf-bridge.js SF_TEMPLATES). '' = "Random island" → the composer
// RESOLVES a concrete template from the seed so same-seed stays byte-identical.
// sfArchipelago (Island Chain) is a valid explicit pick but is excluded from the
// random pool (probability 0 in FMG), matching the toolbar.
export const MAP_KINDS = Object.freeze([
  Object.freeze({ id: '', label: 'Random island' }),
  Object.freeze({ id: 'highIsland', label: 'Mountainous Island' }),
  Object.freeze({ id: 'lowIsland', label: 'Low Island' }),
  Object.freeze({ id: 'volcano', label: 'Volcanic Island' }),
  Object.freeze({ id: 'peninsula', label: 'Peninsula' }),
  Object.freeze({ id: 'pangea', label: 'Supercontinent' }),
  Object.freeze({ id: 'atoll', label: 'Atoll' }),
  Object.freeze({ id: 'sfArchipelago', label: 'Island Chain' }),
]);
export const DEFAULT_MAP_KIND = '';
// The pool a "Random island" resolves within (mirrors SF_TEMPLATES' randomizable
// members — everything except the probability-0 sfArchipelago and the '' sentinel).
const RANDOMIZABLE_MAP_KINDS = Object.freeze(['highIsland', 'lowIsland', 'volcano', 'peninsula', 'pangea', 'atoll']);

// Nominal FMG map canvas (map-pixel <g>-space). Placement sites are scattered in
// a central box of this space so the staged settlements sit on-screen over the
// generated geography; every site is freely draggable at t=0, so exact
// coordinates are cosmetic, not load-bearing (they are excluded from the
// coherence contract and the structural fingerprint).
const MAP_W = 1000;
const MAP_H = 600;
const MARGIN_X = 150;
const MARGIN_Y = 100;

/** @param {unknown} v */
export function isRealmSize(v) { return typeof v === 'string' && Object.prototype.hasOwnProperty.call(REALM_SIZES, v); }
/** @param {unknown} v */
export function isTone(v) { return TONES.some(t => t.id === v); }
/** @param {unknown} v */
export function isMapKind(v) { return MAP_KINDS.some(k => k.id === v); }

/**
 * Normalize loose basic-config input to the three resolved knobs. Unknown /
 * missing values fall back to the deterministic defaults, so a partial config
 * (or none) still yields a valid, replayable plan.
 * @param {{ realmSize?: string, tone?: string, mapKind?: string }} [basicConfig]
 */
export function normalizeBasicConfig(basicConfig = {}) {
  return {
    realmSize: isRealmSize(basicConfig.realmSize) ? String(basicConfig.realmSize) : DEFAULT_REALM_SIZE,
    tone: isTone(basicConfig.tone) ? String(basicConfig.tone) : DEFAULT_TONE,
    mapKind: isMapKind(basicConfig.mapKind) ? String(basicConfig.mapKind) : DEFAULT_MAP_KIND,
  };
}

/**
 * Derive the full, deterministic plan from the outer seed + basic knobs.
 *
 * @param {{ seed?: string, basicConfig?: { realmSize?: string, tone?: string, mapKind?: string } }} [args]
 * @returns {{
 *   seed: string,
 *   realmSize: string,
 *   tonePresetId: string,
 *   mapSeed: string,
 *   mapKind: string,            // resolved concrete template (never '')
 *   requestedMapKind: string,   // the knob as given ('' = random)
 *   sites: Array<{ slot:number, tier:string, seed:string, x:number, y:number, burgId:string }>,
 * }}
 */
export function deriveWorldPlan({ seed, basicConfig } = {}) {
  const outerSeed = String(seed == null ? '' : seed);
  const knobs = normalizeBasicConfig(basicConfig);
  const rng = createPRNG(`instantWorld::${outerSeed}`);

  // Resolve a concrete map template deterministically when the knob is "Random".
  const resolvedMapKind = String(knobs.mapKind || rng.pick([...RANDOMIZABLE_MAP_KINDS]) || RANDOMIZABLE_MAP_KINDS[0]);

  const size = REALM_SIZES[/** @type {keyof typeof REALM_SIZES} */ (knobs.realmSize)] || REALM_SIZES[DEFAULT_REALM_SIZE];
  const tiers = size.tiers;
  // Placement scatter — a seeded jitter in the central box. Largest member (slot
  // 0) anchors near centre; the rest scatter around it. Independent RNG fork so
  // adding/removing a tier can't shift the map-kind roll above.
  const posRng = rng.fork('sites');
  const sites = tiers.map((/** @type {string} */ tier, /** @type {number} */ slot) => {
    const x = slot === 0
      ? Math.round(MAP_W / 2)
      : Math.round(posRng.randFloat(MARGIN_X, MAP_W - MARGIN_X));
    const y = slot === 0
      ? Math.round(MAP_H / 2)
      : Math.round(posRng.randFloat(MARGIN_Y, MAP_H - MARGIN_Y));
    return {
      slot,
      tier,
      // Per-settlement seed forked from the outer seed → each dossier is itself
      // byte-stable for a fixed outer seed, and independent across slots.
      seed: `${outerSeed}::iw${slot}`,
      x,
      y,
      burgId: `iw_b${slot}`,
    };
  });

  return {
    seed: outerSeed,
    realmSize: knobs.realmSize,
    tonePresetId: knobs.tone,
    mapSeed: `${outerSeed}::map`,
    mapKind: resolvedMapKind,
    requestedMapKind: knobs.mapKind,
    sites,
  };
}
