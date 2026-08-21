/**
 * domain/townMap/fabric/fabricRng.js — THE SEEDING LAW, key-anchored (§11.0, §8.3).
 *
 * Every random-looking quantity in the fabric comes from here, and from nowhere else.
 * The fork is a PURE HASH of the persisted settlement seed — never the live generation
 * `rngContext`, never a generation-step fork, never ambient. This is the townMapModel
 * idiom stated at its own line 361-363 ("derived INTERNALLY from the settlement seed"),
 * carried one level finer.
 *
 * ⭐⭐ THE INERTIA LAW (§11.0) IS AN ARCHITECTURAL PRECONDITION, NOT AN OPTIMIZATION.
 * The built world has MEMORY: year over year, UNCHANGED facts must produce BYTE-
 * UNCHANGED fabric, and CHANGED facts must produce LOCAL change only. A new road
 * appears; the town does not reshuffle. Without this the year dimension is a re-roll
 * wearing a timestamp; with it, a snapshot sequence is an animation of history.
 *
 * The mechanism is one rule: THERE IS NO SHARED SEQUENTIAL STREAM. Each ENTITY hashes
 * its own stable key, so its draws are a pure function of (seed, variant, entityKey,
 * changeYear). Adding, removing or changing entity A cannot move entity B's bytes,
 * because B's stream never observed A. The prototype forked per COMPONENT
 * ('substrate', 'organisms', …), which already bought "adding a component cannot shift
 * another component's bytes"; this is that property at ENTITY grain, which is what the
 * drift grammar actually needs.
 *
 * WHAT THIS FORBIDS, CONCRETELY — every one of these was in the prototype and every one
 * is an inertia violation:
 *   • one `fabricRng(seed,'accretion')` drawn in a loop over all lobes;
 *   • normalizing the grown plan against a measured union area (adding one district
 *     rescales every other district);
 *   • a Voronoi partition over lobe sites where lobe COUNT is a global draw;
 *   • ranking or relaxing entities in an order that depends on the entity set.
 * Where a global quantity is genuinely needed (the settlement's built extent), it is
 * derived from POPULATION and TIER — facts that do not move when one shop opens.
 *
 * DETERMINISM: integer ops only (Math.imul, >>>, ^) plus one correctly-rounded divide.
 * No Date, no Math.random, no localeCompare.
 */

/** The fork-key namespace. A literal, so a grep finds every fabric fork. */
export const FABRIC_FORK_NAMESPACE = 'map-fabric:v3';

/**
 * The number of leading draws discarded after seeding. sfc32's first outputs correlate
 * across near-identical seeds — and near-identical seeds are exactly what an
 * entity-keyed fork produces ('district.market' vs 'district.marsh'). Without the
 * discard, two adjacent districts draw visibly similar first values and the fabric
 * develops a family resemblance it has not earned.
 */
const WARMUP_DRAWS = 12;

/** xmur3 — string to 32-bit seed generator. Integer ops only. */
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function next() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

/** sfc32 — a 32-bit counter PRNG. The final divide by 2**32 is exact in IEEE-754. */
function sfc32(a, b, c, d) {
  return function rand() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

/**
 * @typedef {Object} FabricRng
 * @property {() => number} next        float in [0,1)
 * @property {(lo:number, hi:number) => number} range   float in [lo,hi)
 * @property {(lo:number, hi:number) => number} int     integer in [lo,hi] inclusive
 * @property {(p:number) => boolean} chance             true with probability p
 * @property {<T>(arr: readonly T[]) => T} pick         one element of an ORDERED array
 * @property {(m:number) => number} jitter              symmetric jitter in [-m,+m]
 * @property {(items: readonly {weight:number}[]) => number} weighted  weighted index
 * @property {string} key                               the fork key, for provenance
 */

/**
 * Compose the canonical fork key. Exported so a test can assert two entities never
 * share one, and so the source scan has a single spelling to look for.
 *
 * The key's parts, in order, and why each is there:
 *   seed        — the world's own persisted seed. The whole map is a projection of it.
 *   namespace   — 'map-fabric:v3'. A future v4 fabric is a different world of bytes,
 *                 declared rather than silently overlapping v3's.
 *   variant     — mapEdits.layoutVariant, the user's REROLL salt. It must salt the ROOT
 *                 so every entity fork inherits it: salting only some entities gives a
 *                 reroll that changes half the town, which reads as a bug.
 *   entityKey   — the stable identity of the thing being drawn (see ./lineage.js).
 *   changeYear  — the year this entity last CHANGED. Same entity, same facts, same
 *                 year ⇒ same bytes forever; a rebuild at a new year re-rolls that one
 *                 entity's detail and nothing else's.
 *
 * @param {string|number} settlementSeed
 * @param {string} entityKey
 * @param {{ variant?: number, changeYear?: number }} [opts]
 * @returns {string}
 */
export function fabricForkKey(settlementSeed, entityKey, opts = {}) {
  const variant = Number.isInteger(opts.variant) && Number(opts.variant) > 0 ? Number(opts.variant) : 0;
  const year = Number.isFinite(opts.changeYear) ? Math.trunc(Number(opts.changeYear)) : 0;
  const salt = variant ? `::variant:${variant}` : '';
  return `${String(settlementSeed)}::${FABRIC_FORK_NAMESPACE}${salt}::${entityKey}::y${year}`;
}

/**
 * Fork a fabric PRNG for ONE ENTITY. The only entry point in the fabric layer.
 *
 * @param {string|number} settlementSeed  settlement._seed (never the live rng context)
 * @param {string} entityKey              a stable key from ./lineage.js
 * @param {{ variant?: number, changeYear?: number }} [opts]
 * @returns {FabricRng}
 */
export function fabricRng(settlementSeed, entityKey, opts = {}) {
  const key = fabricForkKey(settlementSeed, entityKey, opts);
  const seedGen = xmur3(key);
  const rand = sfc32(seedGen(), seedGen(), seedGen(), seedGen());
  for (let i = 0; i < WARMUP_DRAWS; i++) rand();

  return {
    key,
    next: rand,
    range(lo, hi) { return lo + rand() * (hi - lo); },
    int(lo, hi) { return lo + Math.floor(rand() * (hi - lo + 1)); },
    chance(p) { return rand() < p; },
    pick(arr) { return arr[Math.floor(rand() * arr.length)]; },
    jitter(m) { return (rand() * 2 - 1) * m; },
    /**
     * Pick an index under non-negative weights — THE SAMPLER §167's affinity-matrix law
     * requires: the roll is BIASED by the weights, never dictated by them, so a lawful
     * town lands its granary beside its mill most of the time and a chaotic one does
     * not. All-zero weights degrade to a uniform pick rather than to index 0 (a silent
     * "always the first candidate" is the failure mode that reads as a bug).
     * @param {readonly {weight:number}[]} items
     */
    weighted(items) {
      let total = 0;
      for (const it of items) total += it.weight > 0 ? it.weight : 0;
      if (!(total > 0)) return Math.floor(rand() * items.length);
      let t = rand() * total;
      for (let i = 0; i < items.length; i++) {
        const w = items[i].weight > 0 ? items[i].weight : 0;
        if (t < w) return i;
        t -= w;
      }
      return items.length - 1;
    },
  };
}

/**
 * ⭐⭐⭐ MF-D1 · §297.4c · **THE SUBSTRATE'S SECOND SALT SPELLING, LIFTED TO THE ONE HOME AND
 * FROZEN THERE — the duplicated RULE is cured; the KEY is deliberately not moved.**
 *
 * ⛔⛔ WHY THE ORDERED CURE COULD NOT BE THE OBVIOUS ONE, WITH THE TWO KEY STRINGS ON THE RECORD.
 * ODQ §297.4c routes *"substrate.js's second salt spelling (4 sites)"* into this brief.
 * `substrate.js` composed its own root — `` `${seed}::substrate::variant:N` `` — a SECOND spelling
 * of a rule `fabricForkKey` already owns. Converting it to `fabricForkKey` produces a DIFFERENT
 * STRING and therefore a different draw:
 *
 *     legacy   `demo::substrate::variant:3|valley|bearing`
 *     canonical `demo::map-fabric:v3::variant:3::substrate::y0#valley.bearing#0`
 *
 * No choice of arguments closes that gap: `fabricForkKey` interpolates the namespace
 * unconditionally and always appends `::y${year}`, and the legacy root carries neither. The four
 * consumer draws place the VALLEY AXIS and the COASTAL RAMP EDGE, which the whole heightfield is
 * built on — so the conversion re-rolls the ground on every leaf, at every variant. **That is a
 * declared same-seed shift and it belongs to a wave that owns one. This lane's proof floor is
 * ZERO moved bytes, so it may not be smuggled in here.** (§7 RAISED — the chair decides.)
 *
 * ⭐⭐ WHAT IS CURED, AND IT IS THE PART THAT WAS ACTUALLY THE DEFECT. The complaint in §241.5b is
 * a DUPLICATED RULE — a salt spelled in two places, so a fix to one survives in the other. The
 * rule now has ONE home: this function. `substrate.js` no longer composes a salt; it asks for
 * one. The byte the caller receives is character-identical to the byte it used to build itself,
 * which is what makes this landable inside a zero-shift wave.
 *
 * ⚠ DO NOT "TIDY" THIS INTO `fabricForkKey`. The pin in `derivationGraph.walker.test.js` asserts
 * the two are DIFFERENT and asserts this one's exact text, precisely so a later lane cannot
 * convert it by accident and call the resulting corpus-wide re-roll a refactor.
 *
 * @param {string|number} settlementSeed @param {number} [variant] @returns {string}
 */
export function legacySubstrateForkKey(settlementSeed, variant) {
  return `${String(settlementSeed)}::substrate${variant ? `::variant:${variant}` : ''}`;
}

/** Stable 32-bit hash of a string — per-item variation with NO stream at all.
 * Used wherever a value must depend only on an entity's identity (tone jitter, a
 * shape variant, a rotation), because a stream would couple items to each other.
 * @param {string} str @returns {number} */
export function hash32(str) { return xmur3(String(str))(); }

/** Stable float in [0,1) from a string — order-independent per-item jitter.
 * @param {string} str @returns {number} */
export function hashUnit(str) { return hash32(str) / 4294967296; }

/** Stable integer in [lo,hi] from a string. @returns {number} */
export function hashInt(str, lo, hi) { return lo + Math.floor(hashUnit(str) * (hi - lo + 1)); }

/**
 * ⭐⭐⭐ `keyedRandom(worldSeed, featureId, mechanicId, sampleIndex)` — THE §234 RANDOMNESS
 * PRIMITIVE, and the one composer for every stream-free draw in the fabric.
 *
 * ⛔⛔ WHAT IT REPLACES, AND WHY IT IS NOT COSMETIC. `hashUnit` is order-independent and correct,
 * but it takes a STRING THE CALLER MINTS, and MF-ARCH counted **142 `hashUnit`/`hash32`/
 * `hashInt` call sites and 12 places that mint a fork key by hand** as `` `${seed}|umb` ``,
 * `` `${seed}|meander` ``, `` `${seed}|built|wall` `` and so on. Two consequences, both measured:
 *
 *  1. ⛔ **FIVE OF THOSE TWELVE DROP THE REROLL SALT.** `fabricForkKey` exists precisely to put
 *     `mapEdits.layoutVariant` into the ROOT of every key — this file's own header says
 *     "salting only some entities gives a reroll that changes half the town, which reads as a
 *     bug" — and five sites in `buildFabric` compose from the bare `seed` instead, while
 *     `colonize` re-adds the salt BY HAND. ⚠ THE DAMAGE IS LATENT RATHER THAN ACTIVE ON THE
 *     CORPUS, and the distinction is the honest one: every affected mechanic's INPUTS also
 *     carry the variant, so its output moves anyway. The one path where it is ACTIVE is the
 *     coast fallback (`` `${seed}|coast|${i}` ``), whose input is the LANDED model's two-point
 *     path — variant-invariant — so that jitter is identical at every reroll. The corpus does
 *     not exercise it.
 *  2. ⛔ **THE EXISTING PIN IS TRUE OF THE COMPOSER AND FALSE OF THE FABRIC.** "layoutVariant
 *     salts the ROOT, so every entity fork inherits it" asserts against `fabricForkKey` — which
 *     obeys it — while five mechanics never call `fabricForkKey` at all. ⭐ THE CLASS:
 *     **A PIN ON A COMPOSER IS NOT A PIN ON ITS CALLERS**, and the gap is invisible precisely
 *     because the composer is correct.
 *
 * ⭐ THE FOUR PARTS ARE SEPARATE ARGUMENTS SO THEY CANNOT BE FORGOTTEN OR CONFLATED:
 *   worldSeed    the world's persisted seed (never the live rng context)
 *   featureId    the stable identity of the thing drawn for (lineage.js)
 *   mechanicId   WHICH RULE is drawing — namespaced, so two mechanics asking about one
 *                feature can never collide, and a new mechanic cannot silently reuse a stream
 *   sampleIndex  which draw within that mechanic — so adding a draw at k+1 cannot move k
 *
 * ⚠ IT IS DELIBERATELY BYTE-COMPATIBLE WITH `fabricForkKey`'s key grammar so it can land with
 * NO same-seed shift: it composes the same root and appends `#mechanic#k`. Converting the
 * twelve hand-minted sites DOES move bytes and is therefore wave nine's single deliberate act,
 * recorded rather than smuggled into an architecture wave under a feature-law freeze.
 *
 * DETERMINISM: integer hashing only (`Math.imul`, `^`, `>>>`) plus the one exact divide.
 *
 * @param {string|number} worldSeed
 * @param {string} featureId
 * @param {string} mechanicId
 * @param {number} [sampleIndex]
 * @param {{ variant?: number, changeYear?: number }} [opts]
 * @returns {number} float in [0,1)
 */
export function keyedRandom(worldSeed, featureId, mechanicId, sampleIndex = 0, opts = {}) {
  return hashUnit(keyedRandomKey(worldSeed, featureId, mechanicId, sampleIndex, opts));
}

/** The key `keyedRandom` hashes — exported so a walker and a pin can both assert its shape. */
export function keyedRandomKey(worldSeed, featureId, mechanicId, sampleIndex = 0, opts = {}) {
  const k = Number.isFinite(sampleIndex) ? Math.trunc(Number(sampleIndex)) : 0;
  return `${fabricForkKey(worldSeed, String(featureId), opts)}#${String(mechanicId)}#${k}`;
}

/** Symmetric jitter in [-m, +m] from a keyed draw — the commonest use, spelled once. */
export function keyedJitter(worldSeed, featureId, mechanicId, sampleIndex, m, opts = {}) {
  return (keyedRandom(worldSeed, featureId, mechanicId, sampleIndex, opts) * 2 - 1) * m;
}

/**
 * ⭐⭐ THE LINEAGE DESCENT KEY — `child = hash(parentId, k)`, so a split or a merge keeps
 * DERIVABLE descendants (§234's lineage-identity requirement).
 *
 * ⚠ IT IS A KEY, NOT A HASH DIGEST, and that is deliberate: `lineage.subdividedParcelKey`
 * already mints `parent/ordinal` strings that a reader can follow by eye, and replacing a
 * legible ancestry with a 32-bit digest would make a parcel's descent unreadable in a receipt
 * for no gain. What this adds is the STABILITY GUARANTEE those keys need in order to be
 * random-draw inputs: the child's key is a pure function of (parentId, ordinal), it never
 * mentions position, and re-splitting the same parent the same way reproduces it exactly.
 *
 * @param {string} parentId @param {number} k @returns {string}
 */
export function descendantId(parentId, k) {
  return `${String(parentId)}/${Math.trunc(Number(k)) >>> 0}`;
}
