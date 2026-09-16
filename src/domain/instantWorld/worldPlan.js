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
import { assignGenesisRelations } from './genesisDiplomacy.js';

/**
 * ⭐⭐ THE PLAN LAW VERSION — POLIS-1, and it is THE PROMISE made mechanical (Q-W3,
 * pre-ruled: worldCode v2 ships and v1 codes REPLAY AS v1 FOREVER).
 *
 * A share code is a world. The commons promise is that anyone who holds an old code
 * gets back the world it always named — not "the same seed re-run under whatever laws
 * we have now", which would silently rewrite worlds other people had already saved,
 * posted, and played. So the plan law is a VERSION, carried in the code, and it selects
 * which derivation runs. Law 1 is frozen for life; every improvement lands as a new law.
 *
 * This is why POLIS-1's shift is safe to declare at all: it moves NEW worlds only, and
 * a v1 code is byte-identical forever by construction rather than by care.
 */
export const PLAN_LAW_VERSION = 2;
/** The frozen original law — what every pre-POLIS-1 share code replays under. */
export const PLAN_LAW_LEGACY = 1;

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
    blurb: 'A compact frontier: one market town and its hamlets.',
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

// ── Magic → the realm's arcane stance (MG-1, DESIGN_REALM_MAGIC_TOGGLE §4) ───
// THE FOURTH KNOB, and the only one asked as a QUESTION rather than a chip: the
// pre-generation modal puts it to the DM before the realm exists, because it is
// the one answer that cannot be nudged afterwards without regenerating (every
// member is minted under it — see composeInstantWorld's projection).
//
// It is a BINARY by design (§5): 'yes' maps to today's behavior verbatim, 'no'
// stamps `magicExists:false` + `priorityMagic:0` into every member's config at
// mint. There is deliberately no third "low magic" rung in v1 — the graded realm
// would need the dead genre/magicBias axis revived, which is an owner call.
//
// MAGIC IS NOT FAITH (MG-LAW-2): this knob gates the ARCANE axis and functioning
// supernatural effects. Deities, temples, patrons, and belief are untouched — a
// mundane realm still prays; its prayers move belief, never physics. The modal
// copy says so plainly so the DM is never surprised by a temple.
export const MAGIC_CHOICES = Object.freeze([
  Object.freeze({
    id: 'yes',
    label: 'A world of magic',
    blurb: 'Mages, arcane orders, enchanted trade, and magical events all belong here.',
  }),
  Object.freeze({
    id: 'no',
    label: 'A mundane world',
    blurb: 'No working magic anywhere in the realm. Gods and temples remain.',
  }),
]);
export const DEFAULT_MAGIC = 'yes';
// The pool a "Random island" resolves within (mirrors SF_TEMPLATES' randomizable
// members — everything except the probability-0 sfArchipelago and the '' sentinel).
const RANDOMIZABLE_MAP_KINDS = Object.freeze(['highIsland', 'lowIsland', 'volcano', 'peninsula', 'pangea', 'atoll']);

// Nominal FMG map canvas (map-pixel <g>-space). Placement sites are scattered in
// a central box of this space so the staged settlements sit on-screen over the
// generated geography; every site is freely draggable at t=0, so exact
// coordinates are COSMETIC IN PLAY — a user may drag any of them anywhere.
//
// ⚠ CORRECTED BY POLIS-1 (A1.2.5). This comment used to add "…and they are excluded
// from the coherence contract and the structural fingerprint". The second half was
// FALSE and had been since the fingerprint was written: `instantWorldFingerprint`
// maps `{ slot, tier, x, y }` for every site, so the coordinates ARE fingerprinted
// and a change to this scatter is a same-seed shift that the determinism pin will
// catch. Cosmetic to the PLAYER is not the same as absent from the CONTRACT, and a
// comment that conflated the two would have told the next plan-touching lane its
// jitter was free.
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
/** @param {unknown} v */
export function isMagicChoice(v) { return MAGIC_CHOICES.some(m => m.id === v); }

/**
 * Normalize loose basic-config input to the four resolved knobs. Unknown /
 * missing values fall back to the deterministic defaults, so a partial config
 * (or none) still yields a valid, replayable plan — and in particular a caller
 * that predates the magic knob (a stored basicConfig, a soak harness, a test)
 * resolves to 'yes', which is today's behavior verbatim.
 * @param {{ realmSize?: string, tone?: string, mapKind?: string, magic?: string }} [basicConfig]
 */
export function normalizeBasicConfig(basicConfig = {}) {
  return {
    realmSize: isRealmSize(basicConfig.realmSize) ? String(basicConfig.realmSize) : DEFAULT_REALM_SIZE,
    tone: isTone(basicConfig.tone) ? String(basicConfig.tone) : DEFAULT_TONE,
    mapKind: isMapKind(basicConfig.mapKind) ? String(basicConfig.mapKind) : DEFAULT_MAP_KIND,
    magic: isMagicChoice(basicConfig.magic) ? String(basicConfig.magic) : DEFAULT_MAGIC,
  };
}

/**
 * THE SURPRISE-ME SENTINEL, generalized (POLIS-1, review candidate #11a).
 *
 * The map-kind knob already had this device: `''` means "you choose", and the plan
 * RESOLVES it from the seed so the world stays replayable. realmSize and tone had no
 * such rung — `normalizeBasicConfig` coerced anything unknown, `''` included, straight
 * to the fixed default, so a DM who wanted a surprise realm had to pick one anyway.
 *
 * This extends THE EXISTING IDIOM rather than importing upstream's per-slider gaussian
 * jitter: same sentinel, same resolved/requested split, one fork per knob. Jittering
 * the pyramid COUNTS was considered and refused — the authored counts are bound to two
 * external consumers (the analytics settlement-count bands and the canonize-time
 * simulation cap), and a jittered small-of-four falls outside every named band. Choosing
 * among the three authored pyramids gets the surprise without breaking either.
 *
 * LAW 2 ONLY. Under law 1 the sentinel is not consulted at all, so a v1 code that
 * happens to carry `''` resolves to the fixed default exactly as it always did.
 * @param {unknown} v
 */
export function isRandomSentinel(v) { return v === ''; }

/**
 * Derive the full, deterministic plan from the outer seed + basic knobs.
 *
 * @param {{ seed?: string, basicConfig?: { realmSize?: string, tone?: string, mapKind?: string, magic?: string },
 *           planLaw?: number }} [args] `planLaw` selects the derivation law; absent or
 *           unrecognised ⇒ the LEGACY law, which is what keeps a v1 code replaying forever.
 * @returns {{
 *   seed: string,
 *   realmSize: string,
 *   tonePresetId: string,
 *   magic: string,              // 'yes' | 'no' — the realm's arcane stance
 *   mapSeed: string,
 *   mapKind: string,            // resolved concrete template (never '')
 *   requestedMapKind: string,   // the knob as given ('' = random)
 *   sites: Array<{ slot:number, tier:string, seed:string, x:number, y:number, burgId:string }>,
 * }}
 */
export function deriveWorldPlan({ seed, basicConfig, planLaw } = {}) {
  const outerSeed = String(seed == null ? '' : seed);
  const knobs = normalizeBasicConfig(basicConfig);
  // A law we do not recognise is treated as the LEGACY law rather than the newest one.
  // Fail-closed matters here in a specific way: guessing "newest" for an unknown code
  // would hand someone a DIFFERENT world than their code names, which is the one
  // outcome the version exists to prevent.
  const law = planLaw === PLAN_LAW_LEGACY ? PLAN_LAW_LEGACY
    : planLaw === PLAN_LAW_VERSION ? PLAN_LAW_VERSION
      : (planLaw == null ? PLAN_LAW_VERSION : PLAN_LAW_LEGACY);
  const rng = createPRNG(`instantWorld::${outerSeed}`);

  // Resolve a concrete map template deterministically when the knob is "Random".
  // ⛔ THIS DRAW STAYS FIRST AND UNCONDITIONAL IN BOTH LAWS. Every law-2 addition below
  // draws from its OWN labelled fork, and a fork derives from the seed STRING rather
  // than from stream position — so none of them can displace this roll. That is what
  // makes law 1 and law 2 agree on the map template for the same seed.
  const resolvedMapKind = String(knobs.mapKind || rng.pick([...RANDOMIZABLE_MAP_KINDS]) || RANDOMIZABLE_MAP_KINDS[0]);

  // ── The surprise-me sentinels (law 2 only) ─────────────────────────────────
  const requestedRealmSize = basicConfig && typeof basicConfig === 'object' ? basicConfig.realmSize : undefined;
  const requestedTone = basicConfig && typeof basicConfig === 'object' ? basicConfig.tone : undefined;
  let resolvedRealmSize = knobs.realmSize;
  let resolvedTone = knobs.tone;
  if (law >= PLAN_LAW_VERSION) {
    if (isRandomSentinel(requestedRealmSize)) {
      resolvedRealmSize = String(rng.fork('pyramid').pick(Object.keys(REALM_SIZES)));
    }
    if (isRandomSentinel(requestedTone)) {
      resolvedTone = String(rng.fork('tone').pick(TONES.map(t => t.id)));
    }
  }

  const size = REALM_SIZES[/** @type {keyof typeof REALM_SIZES} */ (resolvedRealmSize)] || REALM_SIZES[DEFAULT_REALM_SIZE];
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

  // ── The realm's founding ties (law 2 only) ────────────────────────────────
  // ABSENT WHEN DARK: under law 1 the key is never written, so a v1 plan is
  // byte-identical to a pre-POLIS-1 plan — no key, not an empty array.
  const relations = law >= PLAN_LAW_VERSION
    ? assignGenesisRelations(sites, rng.fork('diplomacy'))
    : undefined;

  return {
    seed: outerSeed,
    // The plan law that DERIVED this plan, recorded so a reader never has to infer it
    // from the shape of what it produced — but ABSENT UNDER LAW 1, because law 1's
    // whole promise is that its plan is byte-identical to the plan this module
    // produced before the version existed. Absence means law 1; it cannot mean
    // anything else, since every later law writes the key.
    ...(law >= PLAN_LAW_VERSION ? { planLaw: law } : {}),
    realmSize: resolvedRealmSize,
    tonePresetId: resolvedTone,
    // The knobs AS ASKED, preserved beside the resolved answers — the same
    // resolved/requested split `mapKind`/`requestedMapKind` already keeps, so a
    // surprise-me realm can still say that it was a surprise.
    ...(law >= PLAN_LAW_VERSION && isRandomSentinel(requestedRealmSize) ? { requestedRealmSize: '' } : {}),
    ...(law >= PLAN_LAW_VERSION && isRandomSentinel(requestedTone) ? { requestedTone: '' } : {}),
    ...(relations && relations.length ? { relations } : {}),
    // The arcane stance rides BESIDE the tone preset, and for the same reason:
    // both are answers the composer STAMPS (tone → the campaign's rules, magic →
    // every member's config), never gates it consults later. It draws no rng, so
    // adding it cannot shift a single seeded roll above.
    magic: knobs.magic,
    mapSeed: `${outerSeed}::map`,
    mapKind: resolvedMapKind,
    requestedMapKind: knobs.mapKind,
    sites,
  };
}
