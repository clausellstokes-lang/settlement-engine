/**
 * domain/townMap/arch/params.js -- K-3 -> K-4: THE FROZEN PARAMETER CONTRACT (co-signed for K-2/K-4).
 *
 * At K-3 exit this module FREEZES the exact surface every grammar exposes -- the condition-vector +
 * style-token vocabulary K-2 authors its ~16-18 rulesets against, and K-4 drives its drift binding
 * through. Freezing it now means K-2 can be written ONCE against a stable contract (kernel doc: "K-2
 * the kit LAST, written once against the frozen op vocabulary + parameter surface").
 *
 * THE CONTRACT (a GrammarParams bag every ruleset builder accepts):
 *   footprint       -- [width, depth] world units (the plan the massing fills).
 *   heightClass     -- a HEIGHT_CLASSES token (discrete massing height band).
 *   lodTier         -- an LOD tier (0/1/2), the K-1 defer axis.
 *   seedId          -- the PRNG seed (a seed is a world, forever -- THE PROMISE).
 *   anchorKey       -- the stable placement/edit-anchor key (K-5 editor edits pin to it).
 *   styleTokens     -- a StyleTokens bag (shapeFamily + skinId + ornamentDensity + tracery family).
 *   conditionVector -- the frozen 1/64-lattice drift vector, from EXISTING state only (K-4 owns the
 *                      wiring; K-3 freezes the SHAPE + the security invariants).
 *
 * K-4 CO-SIGN -- the conditionVector fields map to K-4's design (docs/KERNEL_MAX_PROGRAM.md, K-4):
 *   patronAlignLaw / patronAlignGood  <- latentPantheon patron alignment (NEVER primaryDeitySnapshot,
 *                                        which is 0/48; the latent fallback is tier-invariant, PROMISE-safe).
 *   moral                              <- moralDrift.
 *   prosperity                         <- economic profile.
 *   terrain                            <- terrain/resource band.
 *   warScar                            <- the SATURATING war-scar integral (never decreases below record).
 *   corruptionCovert                   <- EXACTLY ZERO (a security invariant: the map never leaks what the
 *                                        dossier hides -- covert corruption is dossier-only, never dressed).
 *   corruptionRevealed                 <- revealed corruption only (dresses the geometry).
 *   legitimacy                         <- legitimacy.
 *   patronEmblem                       <- the patron emblem index (a finite emblem, NEVER a name/text).
 *   historyMark                        <- recorded history marks (a siege -> a relief band; never fades below the record).
 *
 * PURITY: {+,-,*,/} + Math.round/min/max only; 0 transcendental sites; pure data + validators.
 */

/** the contract version -- bumps only on a field-set / range / quantization change (a K-2/K-4 re-sign). */
export const PARAM_CONTRACT_VERSION = 1;

/** the drift lattice denominator (1/64) -- every conditionVector scalar quantizes to k/64 (K-4 design). */
export const DRIFT_LATTICE = 64;

/** the finite HEIGHT classes (discrete massing bands). @type {ReadonlyArray<string>} */
export const HEIGHT_CLASSES = Object.freeze(['squat', 'low', 'mid', 'tall', 'soaring']);

/** the finite SHAPE FAMILIES the registry is organized by (functional archetype packs). @type {ReadonlyArray<string>} */
export const SHAPE_FAMILIES = Object.freeze(['sacred', 'civic', 'martial', 'industrial', 'mercantile', 'domestic', 'agrarian', 'exotic']);

/** the finite TRACERY families (mirrors ornament/tracery.js TRACERY_FAMILIES; pinned here for the contract). @type {ReadonlyArray<string>} */
export const TRACERY_FAMILY_TOKENS = Object.freeze(['plate', 'geometric', 'flamboyant', 'perpendicular']);

/** the finite ornament-density tokens (drift saliency budget selects among these). @type {ReadonlyArray<string>} */
export const ORNAMENT_DENSITY = Object.freeze(['bare', 'restrained', 'rich', 'encrusted']);

/**
 * CONDITION_VECTOR_FIELDS -- the FROZEN field set + ranges of the drift vector. Every scalar is a
 * [lo, hi] band quantized to the 1/64 lattice; `patronEmblem` + `historyMark` are integer indices.
 * @type {Readonly<Record<string, { kind: 'scalar'|'index', lo: number, hi: number }>>}
 */
export const CONDITION_VECTOR_FIELDS = /** @type {Readonly<Record<string, { kind: 'scalar'|'index', lo: number, hi: number }>>} */ (Object.freeze({
  patronAlignLaw: { kind: 'scalar', lo: 0, hi: 1 },      // lawful(1) .. chaotic(0)
  patronAlignGood: { kind: 'scalar', lo: 0, hi: 1 },     // good(1) .. evil(0)
  moral: { kind: 'scalar', lo: 0, hi: 1 },
  prosperity: { kind: 'scalar', lo: 0, hi: 1 },
  terrain: { kind: 'scalar', lo: 0, hi: 1 },
  warScar: { kind: 'scalar', lo: 0, hi: 1 },             // saturating integral (monotone up)
  corruptionCovert: { kind: 'scalar', lo: 0, hi: 0 },    // EXACTLY ZERO -- the security invariant
  corruptionRevealed: { kind: 'scalar', lo: 0, hi: 1 },
  legitimacy: { kind: 'scalar', lo: 0, hi: 1 },
  patronEmblem: { kind: 'index', lo: 0, hi: 47 },        // a finite emblem index (48 emblems), NEVER a name
  historyMark: { kind: 'index', lo: 0, hi: 15 },         // a finite recorded-mark index
}));

/** the frozen conditionVector field names (ascending). @type {ReadonlyArray<string>} */
export const CONDITION_VECTOR_KEYS = Object.freeze(Object.keys(CONDITION_VECTOR_FIELDS).sort());

/** quantize x into [lo,hi] on the 1/64 lattice. @param {number} x @param {number} lo @param {number} hi @returns {number} */
function quant(x, lo, hi) {
  const c = x < lo ? lo : x > hi ? hi : x;
  if (hi === lo) return lo;
  const t = (c - lo) / (hi - lo);
  return lo + (Math.round(t * DRIFT_LATTICE) / DRIFT_LATTICE) * (hi - lo);
}

/**
 * The NEUTRAL condition vector -- the dormancy default (absent drift ⇒ this). Scalars at the band
 * center (0.5 where the band allows), integers at 0, covert EXACTLY 0. Absent-vector byte-identical
 * dormancy is enforced by the caller (a grammar with the neutral vector == a grammar with no vector).
 * @returns {Readonly<Record<string, number>>}
 */
export function neutralConditionVector() {
  /** @type {Record<string, number>} */ const v = {};
  for (const [k, f] of Object.entries(CONDITION_VECTOR_FIELDS)) {
    if (f.kind === 'index') v[k] = f.lo;
    else v[k] = f.hi === f.lo ? f.lo : quant((f.lo + f.hi) / 2, f.lo, f.hi);
  }
  return Object.freeze(v);
}

/**
 * Build a validated conditionVector from a raw bag: quantize scalars to 1/64, clamp indices, and
 * FAIL CLOSED on an unknown field or a covert-corruption leak. @param {Record<string, number>} raw @returns {Readonly<Record<string, number>>}
 */
export function makeConditionVector(raw) {
  // fail-closed on a covert-corruption leak at the INPUT (before quantizing it into the [0,0] band) --
  // a caller passing covert > 0 is a bug to surface, never to silently swallow (the security invariant).
  if (raw && typeof raw.corruptionCovert === 'number' && raw.corruptionCovert !== 0) {
    throw new Error('arch/params: corruptionCovert must be EXACTLY 0 (covert corruption is dossier-only -- the map never leaks it)');
  }
  /** @type {Record<string, number>} */ const v = {};
  for (const [k, f] of Object.entries(CONDITION_VECTOR_FIELDS)) {
    const x = raw && typeof raw[k] === 'number' ? raw[k] : (f.kind === 'index' ? f.lo : (f.lo + f.hi) / 2);
    v[k] = f.kind === 'index' ? Math.max(f.lo, Math.min(f.hi, Math.round(x))) : quant(x, f.lo, f.hi);
  }
  if (v.corruptionCovert !== 0) throw new Error('arch/params: corruptionCovert must be EXACTLY 0 (covert corruption is dossier-only -- the map never leaks it)');
  return Object.freeze(v);
}

/** validate a conditionVector (field set + ranges + covert=0), fail-closed. @param {Record<string, number>} v @returns {Readonly<Record<string, number>>} */
export function assertConditionVector(v) {
  if (!v || typeof v !== 'object') throw new Error('arch/params: conditionVector must be an object');
  const keys = Object.keys(v).sort();
  if (keys.length !== CONDITION_VECTOR_KEYS.length || keys.some((k, i) => k !== CONDITION_VECTOR_KEYS[i])) {
    throw new Error(`arch/params: conditionVector field set mismatch (expected ${CONDITION_VECTOR_KEYS.join(',')})`);
  }
  for (const [k, f] of Object.entries(CONDITION_VECTOR_FIELDS)) {
    const x = v[k];
    if (typeof x !== 'number' || Number.isNaN(x) || x < f.lo || x > f.hi) throw new Error(`arch/params: conditionVector.${k}=${x} out of band [${f.lo},${f.hi}]`);
  }
  if (v.corruptionCovert !== 0) throw new Error('arch/params: conditionVector.corruptionCovert must be EXACTLY 0');
  return Object.freeze(v);
}

/** validate a styleTokens bag, fail-closed. @param {{ shapeFamily: string, skinId: string, traceryFamily: string, ornamentDensity: string }} s @returns {object} */
export function assertStyleTokens(s) {
  if (!s || typeof s !== 'object') throw new Error('arch/params: styleTokens must be an object');
  if (!SHAPE_FAMILIES.includes(s.shapeFamily)) throw new Error(`arch/params: styleTokens.shapeFamily "${s.shapeFamily}" not in SHAPE_FAMILIES`);
  if (!TRACERY_FAMILY_TOKENS.includes(s.traceryFamily)) throw new Error(`arch/params: styleTokens.traceryFamily "${s.traceryFamily}" invalid`);
  if (!ORNAMENT_DENSITY.includes(s.ornamentDensity)) throw new Error(`arch/params: styleTokens.ornamentDensity "${s.ornamentDensity}" invalid`);
  if (typeof s.skinId !== 'string' || !s.skinId) throw new Error('arch/params: styleTokens.skinId required (a SKINS id)');
  return s;
}

/**
 * Build + validate a GrammarParams bag -- the frozen surface every K-2 ruleset builder accepts. K-3
 * freezes it; the milestone rulesets accept it via their `p` argument. @param {{ footprint: [number, number],
 * heightClass: string, lodTier: number, seedId: string, anchorKey: string, styleTokens: { shapeFamily: string, skinId: string, traceryFamily: string, ornamentDensity: string }, conditionVector?: Record<string, number> }} p @returns {Readonly<object>}
 */
export function makeGrammarParams(p) {
  if (!p || !Array.isArray(p.footprint) || p.footprint.length !== 2) throw new Error('arch/params: footprint must be [width, depth]');
  if (!HEIGHT_CLASSES.includes(p.heightClass)) throw new Error(`arch/params: heightClass "${p.heightClass}" not in HEIGHT_CLASSES`);
  if (![0, 1, 2].includes(p.lodTier)) throw new Error(`arch/params: lodTier ${p.lodTier} invalid (0|1|2)`);
  if (typeof p.seedId !== 'string' || !p.seedId) throw new Error('arch/params: seedId required (a seed is a world)');
  if (typeof p.anchorKey !== 'string' || !p.anchorKey) throw new Error('arch/params: anchorKey required (the edit-anchor key)');
  assertStyleTokens(p.styleTokens);
  const conditionVector = p.conditionVector ? makeConditionVector(p.conditionVector) : neutralConditionVector();
  return Object.freeze({
    footprint: Object.freeze([p.footprint[0], p.footprint[1]]),
    heightClass: p.heightClass, lodTier: p.lodTier, seedId: p.seedId, anchorKey: p.anchorKey,
    styleTokens: Object.freeze({ ...p.styleTokens }), conditionVector,
    contractVersion: PARAM_CONTRACT_VERSION,
  });
}
