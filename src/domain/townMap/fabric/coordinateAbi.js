/**
 * domain/townMap/fabric/coordinateAbi.js — ⭐⭐⭐ MF-D1 · §287.5 / SPEC §10.4 ·
 * **THE VERSIONED INTEGER COORDINATE ABI.**
 *
 * SPEC §10.4 states the problem in one sentence: *"Any raw floating result that decides
 * topology, legality, ordering, identity or a content hash is nondeterministic authority."*
 * The sandbox already answered half of it. `fabricGeometry.TOPOLOGY_PLACES = 6` and `q6` fix
 * the TEXT a receipt is hashed over — but §234's own comment says the quantum is *"a
 * SERIALIZATION RULE, NOT A STORAGE RULE"*, so what the program publishes today is a decimal
 * STRING and what it decides from is still a float. A string is not an integer: `"1.500000"`
 * and `"1.5"` are different bytes for one coordinate, and nothing declared which one is
 * canonical, at what version, under whose rounding.
 *
 * ⭐⭐⭐ THIS MODULE PUBLISHES THE INTEGER AND VERSIONS IT, AND IT DOES NOT RE-ROUND.
 *
 * ⛔⛔ THE ONE DECISION THAT MATTERS, AND IT IS THE WHOLE REASON THIS IS A WRAP AND NOT A
 * REWRITE. The obvious spelling of the integer quantum is `Math.round(v * 1e6)`. It is WRONG in
 * two independent ways and both are measurable:
 *
 *   (1) THE TIE RULE DIVERGES ON NEGATIVE COORDINATES. `Number.prototype.toFixed` strips the
 *       sign FIRST and then breaks a tie by taking the LARGER magnitude — round-half-AWAY-FROM-
 *       ZERO. `Math.round` breaks a tie toward `+∞`. On `x = -1/128` — an exactly representable
 *       double whose sixth decimal place is an exact tie — `q6` says `-0.007813` and
 *       `Math.round(x * 1e6)` says `-7812`. The fabric's coordinates run negative (a leaf frame
 *       is centred), so this is not a corner case; it is a wrong answer on real ground.
 *   (2) THE MULTIPLY ITSELF IS LOSSY. `v * 1e6` is one more rounded IEEE operation before the
 *       rounding that was supposed to be canonical, so the integer can disagree with the text
 *       the program has already been hashing.
 *
 * ⭐ THE WRAP: the integer is READ OUT OF `q6`'s OWN TEXT — sign, digits, decimal point removed.
 * By construction it cannot round differently from the six-decimal serializer the corpus has
 * been publishing since §234, so **the existing fixed-precision topology keys reconcile to this
 * ABI exactly, and the reconciliation is an identity rather than an approximation.** ODQ §269.3's
 * tie-rule argument is on the record and this module does not reopen it — it names it, pins it,
 * and refuses to let a second rounding rule into the tree.
 *
 * ⚠ WHAT IS NOT CLAIMED. Nothing here quantizes STORED geometry, and no consumer in the
 * generation path imports this module. §234's own handoff stands: *"Quantizing the STORED
 * legality geometry moves every pixel in the corpus and owes its own equivalence proof."* This
 * lane publishes the ABI, proves the bounds and proves the reconciliation; the cutover is a
 * later wave's declared shift, per SPEC §10.15(4)'s "keep consumers on the legacy accessor".
 *
 * PURITY: pure. `+ − × ÷`, string slicing and `Number()`. No Date, no Math.random, no trig.
 */

import { TOPOLOGY_PLACES, TRIG_N, q6 } from './fabricGeometry.js';

/**
 * ⭐⭐ THE VERSION CONSTANT §287.5 ASKS FOR BY NAME. It moves when any field of
 * `COORDINATE_ABI` moves — quantum, axis convention, orientation, boundary rule or encoding.
 * A consumer asserts equality against it; an artifact minted under v1 is not readable as v2
 * without a declared migration. It is deliberately NOT derived from the file's contents: a
 * derived version silently renumbers itself on a comment edit and proves nothing.
 */
export const COORDINATE_ABI_VERSION = 1;

/** The ABI's own schema version — the SHAPE of the record, not the values in it. */
export const COORDINATE_ABI_SCHEMA_VERSION = 1;

/** RatioQ (SPEC §10.4): reduced integers, never a float. One quantum = 1/1000000 map unit. */
export const GEOMETRY_QUANTUM = Object.freeze({ numerator: 1, denominator: 1000000 });

/**
 * ⚠ THE HEIGHT QUANTUM IS DECLARED AND UNEXERCISED, AND SAYING SO IS THE POINT. The plan-era
 * sandbox publishes no height: §7's `MassPartQ`/`SolidPartQ` are design-only (SPEC §10.16's
 * status override says so). Declaring the quantum now means D3a inherits a versioned rule
 * instead of minting a second one; `heightQ` below REFUSES rather than guessing, so no lane can
 * read an unexercised path as a working one.
 */
export const HEIGHT_QUANTUM = Object.freeze({ numerator: 1, denominator: 1000000 });

/** Largest magnitude a world coordinate may carry and still be a safe integer after quantizing.
 *  `Number.MAX_SAFE_INTEGER / 1e6`, floored — the bound §10.4 orders proved over the largest map. */
export const MAX_WORLD_UNITS = Math.floor(Number.MAX_SAFE_INTEGER / GEOMETRY_QUANTUM.denominator);

/**
 * ⭐ THE PUBLISHED ABI RECORD (SPEC §10.4's `CoordinateAbi`, minus the artifact-identity fields
 * that need a `ProvenanceRef`/`UnitRegistry` this era does not have — those are named ABSENT
 * rather than faked, because a `contentHash` field carrying a placeholder is a worse lie than a
 * missing one). `worldUnitsPerMapUnit` is 1: the fabric's leaf frame IS its map frame today,
 * and inventing a scale factor nobody measured would be a free parameter.
 */
export const COORDINATE_ABI = Object.freeze({
  artifactKind: 'COORDINATE_ABI',
  schemaVersion: COORDINATE_ABI_SCHEMA_VERSION,
  abiVersion: COORDINATE_ABI_VERSION,
  worldUnitsPerMapUnit: 1,
  geometryQuantum: GEOMETRY_QUANTUM,
  heightQuantum: HEIGHT_QUANTUM,
  angleTableSize: TRIG_N,
  axisX: 'EAST',
  axisY: 'NORTH',
  axisZ: 'UP',
  azimuthZero: 'PAGE_NORTH',
  azimuthPositive: 'CLOCKWISE',
  elevationZero: 'HORIZON',
  elevationPositive: 'UP',
  canonicalRingOrientation: 'CCW_OUTER_CW_HOLE',
  boundaryRule: 'CLOSED',
  hashEncoding: 'DOMAIN_SEPARATED_CANONICAL_BYTES',
  /** ⚠ The dependency refs SPEC §10.4 requires and this era cannot resolve, named as absent. */
  unitRegistryRef: null,
  provenanceRef: null,
  contentHash: null,
  /** ⚠ THE FRAME CAVEAT, CARRIED WITH THE RECORD RATHER THAN IN PROSE SOMEWHERE ELSE. The
   *  fabric draws in a y-DOWN view frame (`fabricGeometry.area`'s own docstring says so), while
   *  §10.4's world convention is +Y north. The two are one sign flip on Y and NOTHING in this
   *  lane applies it: applying it would move every published coordinate. The flip is a named
   *  migration owed by the wave that first publishes a world-framed artifact. */
  viewFrameYAxis: 'DOWN',
  worldFrameYAxis: 'NORTH_UP',
  viewToWorldYFlipApplied: false,
});

/** The exact tie rule, published as data so a test can assert it rather than a comment claim it. */
export const ROUNDING_RULE = Object.freeze({
  source: 'Number.prototype.toFixed',
  places: TOPOLOGY_PLACES,
  tieBreak: 'HALF_AWAY_FROM_ZERO',
  reRounded: false,
  note: 'the integer is read out of the six-decimal text; no second rounding rule exists',
});

/**
 * ⭐⭐⭐ THE QUANTUM ITSELF. `null` for a non-finite input — never `NaN`, which compares unequal
 * to itself and would make an identity unstable against its own value (`q6`'s own argument).
 * @param {number} v @returns {number|null} a safe integer count of geometry quanta
 */
export function worldQ(v) {
  const t = q6(v);
  if (t === 'na') return null;
  const neg = t.charCodeAt(0) === 45;
  const body = neg ? t.slice(1) : t;
  const dot = body.indexOf('.');
  const digits = dot < 0 ? body : body.slice(0, dot) + body.slice(dot + 1);
  const n = Number(digits);
  if (!Number.isSafeInteger(n)) return null;
  return neg && n !== 0 ? -n : n;
}

/** ⛔ D3a's door, held shut on purpose. No height is published in the plan era, so a caller
 *  asking for one is asking about an artifact that does not exist. */
export function heightQ() {
  throw new Error('COORDINATE_ABI: heightQ is declared and UNEXERCISED — no height artifact '
    + 'exists in the plan era (SPEC §10.16 status override); D3a owns its first publication');
}

/** Is this coordinate inside the ABI's safe-integer envelope? */
export function withinAbiBounds(v) {
  return Number.isFinite(v) && v <= MAX_WORLD_UNITS && v >= -MAX_WORLD_UNITS && worldQ(v) !== null;
}

/** One point at ABI precision. @returns {[number,number]|null} */
export function pointQ(p) {
  if (!p) return null;
  const x = worldQ(p[0]), y = worldQ(p[1]);
  return x === null || y === null ? null : [x, y];
}

/** A ring or polyline at ABI precision, in its own vertex order. */
export function ringQ(poly) {
  const out = [];
  for (const p of poly || []) {
    const q = pointQ(p);
    if (q === null) return null;
    out.push(q);
  }
  return out;
}

/** The six-decimal text this ABI's integer reconstructs — the inverse of `worldQ`. */
export function topologyTextOf(n) {
  if (n === null) return 'na';
  const neg = n < 0;
  const digits = String(neg ? -n : n).padStart(TOPOLOGY_PLACES + 1, '0');
  const cut = digits.length - TOPOLOGY_PLACES;
  return `${neg ? '-' : ''}${digits.slice(0, cut)}.${digits.slice(cut)}`;
}

/**
 * ⛔⛔ THE ONE PLACE THE LEGACY TEXT IS NOT CANONICAL, FOUND BY BUILDING THE ABI AND MEASURED
 * RATHER THAN ASSUMED. `q6` inherits `toFixed`'s sign handling, which strips the sign before
 * rounding and puts it back afterwards — so a coordinate that rounds to zero from BELOW is
 * published as `"-0.000000"` and one that rounds to zero from above as `"0.000000"`. **Those
 * are different bytes for the same quantum**, which means the six-decimal topology key has two
 * spellings of zero and a receipt hashed over it can move without any geometry moving.
 *
 * The ABI has ONE zero, because an integer has one zero. This predicate names the exception in
 * the direction that is true: the ABI is canonical and the legacy text is not. It is exported
 * so the exception can be COUNTED over the corpus rather than argued about — a latent defect
 * and a live one are different findings, and only a census can tell them apart.
 */
export function isNegativeZeroText(v) { return q6(v) === '-0.000000'; }

/**
 * ⭐⭐ THE RECONCILIATION, AS AN EXECUTABLE FUNCTION RATHER THAN A CLAIM. Does the integer this
 * ABI publishes reproduce the six-decimal text the program has been hashing since §234? It is
 * an identity by construction everywhere except the negative-zero spelling above; this is the
 * arm that proves the construction was not broken by a later edit, and it is what makes "the
 * fixed-precision topology keys reconcile to the ABI" a measured statement rather than a hope.
 */
export function reconcilesToTopologyText(v) {
  const n = worldQ(v);
  if (n === null) return q6(v) === 'na';
  if (topologyTextOf(n) === q6(v)) return true;
  return n === 0 && isNegativeZeroText(v);
}

/**
 * ⭐ DOMAIN-SEPARATED CANONICAL BYTES (`COORDINATE_ABI.hashEncoding`). The ABI owns the
 * ENCODING; it does not own the digest algorithm, and pretending otherwise would put a hash
 * function nobody chose into the geometry layer. Every field that could make two different
 * artifacts encode alike is in the prefix: kind, schema, ABI version, and the ordered
 * dependency refs.
 * @param {string} artifactKind @param {number} schemaVersion
 * @param {readonly string[]} orderedDependencyRefs @param {string} bodyText
 */
export function canonicalBytes(artifactKind, schemaVersion, orderedDependencyRefs, bodyText) {
  const deps = (orderedDependencyRefs || []).map((d) => String(d)).join(',');
  return `abi:${COORDINATE_ABI_VERSION}kind:${artifactKind}schema:${schemaVersion}`
    + `deps:[${deps}]body:${bodyText}`;
}

/** A ring as canonical ABI text — integers, never the decimal string. */
export function ringText(poly) {
  const r = ringQ(poly);
  return r === null ? 'na' : r.map(([x, y]) => `${x},${y}`).join(';');
}
