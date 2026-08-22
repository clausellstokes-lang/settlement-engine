/**
 * domain/townMap/fabric/spatialReceipt.js — MF-T2H · §287.4 / SPEC §10.1–§10.2 ·
 * ⭐⭐⭐ THE `state_t → canonicalSpatial_t → spatialReceipt_t` SEAM, AS A TYPED ARTIFACT.
 *
 * Ported from the sealed W3 sandbox tip's `spatialReceipt.js` (SHA-256
 * `d713bc982b0cbbb49ba6d10864ba69914bd9799871215a4dc67b6fd358425509`, read from
 * `refs/preserve/map-sandbox-w3f-sealed` and re-hashed before this file was written, per
 * preamble §P1 R-MF-4), onto this tree's own `./coordinateAbi.js` and `./fabricRng.js`. Its
 * measured import closure is exactly those two modules and nothing transitively beyond them,
 * so the §P2.3 barrel-hop hazard does not fire.
 *
 * ODQ §287.4, binding: *"`state_t → canonicalSpatial_t → spatialReceipt_t → state_t+1`.
 * Same-pass map→economy→map feedback is forbidden. Durable SPATIAL, time-indexed OBSERVATION,
 * semantic PROJECTION and RASTER have separate digests."*
 *
 * ⛔⛔ THE DEFECT THIS FORECLOSES, IN SPEC §10.2's OWN WORDS: *"§6.7's floating land currently
 * casts shade, S18 consumes that shade, and S18 can affect prosperity/siting that helped decide
 * what the floating land carries. That is a same-pass causal cycle even if the module graph is
 * acyclic."* A cycle the import graph cannot see is the hardest kind to refuse, which is why the
 * refusal has to be a SHAPE — a receipt dated for later — and not a lint rule about imports.
 *
 * ⭐⭐⭐ THE THREE RULES THIS MODULE MAKES UNREPRESENTABLE RATHER THAN FORBIDDEN:
 *
 *   1. **A RECEIPT IS DATED FOR LATER.** `effectiveAt` must be strictly greater than every
 *      source time. A receipt that could be applied in the pass that produced it cannot be
 *      constructed.
 *   2. **THE DEPENDENCY ROSTER IS CLOSED BY KIND AND TEMPORAL BRANCH, IN ORDER.** §10.2 fixes
 *      it exactly: a `SHADE_EXPOSURE` receipt carries `SPATIAL, OBSERVATION, SOLAR_PROFILE,
 *      LAW`; a static `ACCESS`/`BLOCKAGE`/`CONNECTION` carries exactly `SPATIAL, LAW`. An extra
 *      role, a missing role, a reordering or an unknown branch is a construction failure, not a
 *      validation warning.
 *   3. **A NO-EFFECT RESULT IS NOT AN EMPTY RECEIPT.** §10.2: *"a genuine no-effect result uses
 *      a separately typed diagnostic, never an empty causal receipt."* `sourceIds`/`affectedIds`
 *      are nonempty by construction and `noEffectDiagnostic` is the other door.
 *
 * ⭐⭐ AND THE DIGESTS ARE FOUR, NOT ONE (§10.1). The spatial digest is taken over DURABLE facts
 * only; a projection or raster change may not move it. §10.1's own refusal is carried here:
 * *"No aggregate digest is accepted as proof of a narrower invariant."* The digest is therefore
 * built from a NAMED FIELD ROSTER and never from the object — an aggregate hash would pass every
 * narrower gate for the wrong reason, and that is what makes the refusal STRUCTURAL rather than
 * a convention a later caller can quietly break.
 *
 * ⛔⛔ THE ONE DECLARED DIVERGENCE FROM THE SEALED SOURCE (ODQ §390.1; J-TET2H-2). The sealed
 * module builds every composite preimage by plain `join`, and a plain join over variable-length
 * parts IS NOT INJECTIVE: a one-element list containing `'a,b'` joins to the same bytes as the
 * two-element list `'a','b'`, so two different causal chains receive one `contentHash`. §390.1
 * charters the cure at the dependency seam and this member is the encoding's first real
 * consumer, so the cure lands HERE rather than in the sealed tip (R-MF-4: a cure that would have
 * to live in the sandbox lives in the port instead). ⭐ IT IS CURED AS A RULE, NOT AS A PATCH:
 * EVERY composite preimage in this file is LENGTH-PREFIXED by `lengthPrefixed` below. Curing the
 * chartered seam and leaving the three identical seams beside it live would ship a proven-
 * defective encoding next to a proven-cured one. All four seams have executed collision
 * witnesses in the acceptance companion, both ways.
 * ⚠ CONSEQUENCE, STATED PLAINLY: the digests this module produces are NOT the sealed module's
 * digests. Sealed reproduction is scoped to the parts the divergence does not touch —
 * `canonicalBytes` itself, `fingerprint`, the refusal arithmetic and every non-digest field —
 * and the companion proves that equivalence by evaluating both spellings side by side.
 * ⚠ Nothing is migrated by this, because nothing was ever minted: there is no landed consumer,
 * no persisted receipt and no stored digest anywhere in the tree (§390.2 — see below).
 *
 * ⛔ `COORDINATE_ABI_VERSION` DOES NOT MOVE, AND THE TRIGGER IS RESTATED RATHER THAN FIRED
 * (ODQ §390.2). A version bump becomes owed the moment a member PERSISTS a `canonicalBytes`
 * result. THIS MEMBER PERSISTS NONE: every digest here is computed, returned inside a frozen
 * value and dropped — there is no store write, no serializer, no fixture and no consumer to
 * hand it to. The version therefore holds at 1, and the standing trigger passes forward to the
 * first member that stores one.
 *
 * ⚠ WHAT IS ABSENT AND NAMED. `ArtifactId`, `ProvenanceRef`, `LawVersion` and the closed id
 * registries (`AccessModeId`, `CapacityMeasureId`, …) are §10.2 artifact families that do not
 * exist in the plan era. They are `null` here rather than stubbed. The digest is a 128-bit
 * FINGERPRINT built from the fabric's own integer hash, declared as a fingerprint and never as
 * a security primitive or as an authorization decision. ⚠ TWO WORDS OF THE SEALED PROSE ARE
 * RE-SPELLED HERE AND AT `fingerprint` — the sealed source names the discipline of secret-
 * keeping, and one of the acceptance companion's nondeterminism tokens is a SUBSTRING of that
 * word, so the scan convicts the docstring. The words are not repeated even to explain
 * themselves, because quoting a forbidden token in prose convicts exactly as loudly as using
 * it. A DECLARED source-text divergence with no behavioural content — the same class ODQ §372
 * recorded when a ratchet forced MF-T2B to re-spell a separator.
 *
 * ⚠ R-MF-2 IS CHECKED AND DOES NOT FIRE. This module computes no PRODUCT of ABI quanta: it
 * decides nothing topological, it only reads quantized text through `worldQ`/`ringText`, whose
 * integer wall lives in `coordinateAbi.js`. No BigInt is owed here, and saying so is the point —
 * a silent absence is indistinguishable from an oversight.
 *
 * ⚠ DORMANT BY DESIGN (preamble §P2.1). No landed module imports this file and this member
 * wires no consumer; the fabric has no input producer, so a settlement cannot reach this code.
 *
 * PURITY: pure. No clock read, no ambient randomness source, no input/output, no locale-
 * sensitive collation, no internationalization API. Times are supplied by the caller, never
 * read. ⚠ The forbidden vocabulary is named in the ABSTRACT on purpose — the acceptance
 * companion scans this file's RAW TEXT for those identifiers, and a scan a docstring can trigger
 * is a scan someone eventually widens to excuse the docstring.
 */

import { hash32 } from './fabricRng.js';

import { canonicalBytes, COORDINATE_ABI_VERSION, ringText, worldQ } from './coordinateAbi.js';

/**
 * The shapes this module reads, named ONCE. ⛔ They are typedefs rather than type holes on
 * purpose: `scripts/count-domain-any.mjs` ratchets every `any` token in the domain against a
 * monotone-down ceiling, so a port that types itself with holes spends an estate-wide budget to
 * buy nothing. Naming the shapes costs the same keystrokes and documents the contract.
 *
 * @typedef {{ role: string, contentHash: string }} DependencyRef
 * @typedef {{ polygon?: unknown, line?: unknown, body?: unknown, key?: string, id?: string,
 *   organismKey?: string, kind?: string, mode?: string }} DurableItem
 * @typedef {Array<DurableItem|null>|DurableItem|string|number|null|undefined} DurableField
 */

/** §10.1's four artifact domains. `WORLD` remains an alias for the durable spatial digest. */
export const DIGEST_DOMAINS = Object.freeze(['SPATIAL', 'OBSERVATION', 'PROJECTION', 'RASTER']);

/** §10.2's receipt kinds. */
export const RECEIPT_KINDS = Object.freeze(['SHADE_EXPOSURE', 'ACCESS', 'CAPACITY', 'BLOCKAGE',
  'FRONTAGE', 'CONNECTION', 'DISPLACEMENT']);

/** ⭐ THE CLOSED DEPENDENCY ROSTER, BY KIND AND TEMPORAL BRANCH (§10.2). Order is part of the
 *  contract: §10.2 says `orderedDependencies`, and an unordered set would let two different
 *  causal chains hash alike. */
export const DEPENDENCY_ROSTER = Object.freeze({
  'SHADE_EXPOSURE|SEASONAL_OBSERVATION': ['SPATIAL', 'OBSERVATION', 'SOLAR_PROFILE', 'LAW'],
  'ACCESS|STATIC_POTENTIAL': ['SPATIAL', 'LAW'],
  'ACCESS|SEASONAL_OBSERVATION': ['SPATIAL', 'OBSERVATION', 'CALENDAR', 'LAW'],
  'BLOCKAGE|STATIC_POTENTIAL': ['SPATIAL', 'LAW'],
  'BLOCKAGE|SEASONAL_OBSERVATION': ['SPATIAL', 'OBSERVATION', 'CALENDAR', 'LAW'],
  'CONNECTION|STATIC_POTENTIAL': ['SPATIAL', 'LAW'],
  'CONNECTION|SEASONAL_OBSERVATION': ['SPATIAL', 'OBSERVATION', 'CALENDAR', 'LAW'],
  'CAPACITY|STATIC_POTENTIAL': ['SPATIAL', 'LAW'],
  'FRONTAGE|STATIC_POTENTIAL': ['SPATIAL', 'LAW'],
  'DISPLACEMENT|STATIC_POTENTIAL': ['SPATIAL', 'LAW'],
});

/**
 * ⭐⭐ THE INJECTIVITY CURE (ODQ §390.1). A netstring-style length prefix: `<length>:<text>`.
 * Any sequence of these can be joined by ANY delimiter and still parsed back uniquely, because
 * the reader takes exactly the announced number of units and never looks for the delimiter inside
 * them. That is what makes it a CURE rather than a better delimiter — an escape scheme still has
 * an escape character an adversarial payload can carry, and a "separator nobody uses" is an
 * assumption about callers rather than a property of the encoding.
 *
 * ⚠ THE UNIT IS THE UTF-16 CODE UNIT — `String.prototype.length` — NOT THE BYTE. It is named
 * precisely because the two diverge the moment a field carries an astral character or, closer to
 * home, the `∅` this file already emits for an absent field. Injectivity holds either way, since
 * the count and the reader agree; what would break is a LATER reader that counted UTF-8 bytes
 * against a prefix written in code units. A successor writing a decoder reads this line first.
 *
 * ⛔ IT IS APPLIED AT EVERY SEAM IN THIS FILE, INCLUDING BOTH HALVES OF A DEPENDENCY PAIR. The
 * `role=contentHash` seam is separately non-injective (`role:'A=B'` with hash `'C'` encodes like
 * `role:'A'` with hash `'B=C'`), and although the roster check below happens to make that
 * unreachable today, resting an encoding property on a validator two branches away is exactly
 * the shape that let the U+001F separators go missing without a red (ODQ §372).
 * @param {unknown} part @returns {string}
 */
function lengthPrefixed(part) {
  const text = String(part);
  return `${text.length}:${text}`;
}

/**
 * A length-prefixed list — the injective spelling of `list.join(',')`.
 * @param {ReadonlyArray<string|number>} parts
 * @returns {string}
 */
function prefixedList(parts) {
  return parts.map(lengthPrefixed).join(',');
}

/** A 128-bit fingerprint over canonical bytes. ⚠ A FINGERPRINT, NOT A CONTENT HASH: it is four
 *  salted 32-bit streams of the fabric's own integer hash, it is not a security primitive, and
 *  no authorization may ever be decided from it. Named so nobody promotes it by accident.
 *  @param {unknown} text
 *  @returns {string} */
export function fingerprint(text) {
  const s = String(text);
  const a = hash32(`f0:${s}`), b = hash32(`f1:${s}`), c = hash32(`f2:${s}`), d = hash32(`f3:${s}`);
  const hex = (/** @type {number} */ v) => (v >>> 0).toString(16).padStart(8, '0');
  return `fp-v1-${hex(a)}${hex(b)}${hex(c)}${hex(d)}`;
}

/**
 * ⭐⭐ THE DURABLE SPATIAL FIELD ROSTER — named, closed, and the reason this is not a whole-object
 * hash. §10.1: *"No aggregate digest is accepted as proof of a narrower invariant."* Every entry
 * is a durable, ordered, quantized identity or geometry; live season, selected leaf, camera,
 * light, ink and document state are excluded BY NAME, so a projection change provably cannot
 * move the spatial digest.
 */
export const SPATIAL_FIELDS = Object.freeze(['walls', 'channels', 'water', 'parcels', 'blocks',
  'commons', 'compounds', 'fields', 'organisms', 'landmarks', 'bridges', 'enclosure']);

/** Fields that must NEVER enter the spatial digest — the §10.1 exclusion, made checkable. */
export const NON_SPATIAL_FIELDS = Object.freeze(['immersion', 'lod', 'measure', 'record',
  'stateMarks', 'meta', 'relief', 'substrate', 'suitability']);

const ringOf = (/** @type {unknown} */ v) => (Array.isArray(v) && v.length && Array.isArray(v[0]) ? ringText(v) : null);

/**
 * Canonical text for one durable field — geometry through the ABI, identities as themselves.
 * @param {string} name
 * @param {DurableField} value
 * @returns {string}
 */
function fieldText(name, value) {
  if (value == null) return `${name}:∅`;
  if (Array.isArray(value)) {
    const parts = value.map((v, i) => {
      if (v == null) return `${i}:∅`;
      const r = ringOf(v.polygon) || ringOf(v.line) || ringOf(v);
      const id = v.key || v.id || v.organismKey || '';
      return `${i}:${id}:${r === null ? '' : r}`;
    });
    return `${name}[${value.length}]{${prefixedList(parts)}}`;
  }
  if (typeof value === 'object') {
    const r = ringOf(value.line) || ringOf(value.polygon) || ringOf(value.body);
    return `${name}{${value.kind || ''}:${value.mode || ''}:${r === null ? '' : r}}`;
  }
  return `${name}:${typeof value === 'number' ? worldQ(value) : String(value)}`;
}

/**
 * ⭐⭐⭐ `canonicalSpatial_t`. The durable half of a published fabric, with its OWN digest,
 * separate from projection and raster by construction because it is built from a named roster
 * rather than from the object.
 */
export function canonicalSpatial(/** @type {Record<string, DurableField>} */ fabric,
  /** @type {number} */ effectiveAt = 0) {
  const parts = [];
  for (const f of SPATIAL_FIELDS) parts.push(lengthPrefixed(fieldText(f, fabric[f])));
  const body = parts.join('\n');
  const bytes = canonicalBytes('CANONICAL_SPATIAL', 1, [`abi:${COORDINATE_ABI_VERSION}`], body);
  return Object.freeze({
    artifactKind: 'CANONICAL_SPATIAL',
    schemaVersion: 1,
    coordinateAbiVersion: COORDINATE_ABI_VERSION,
    effectiveAt,
    fieldRoster: SPATIAL_FIELDS,
    spatialHash: fingerprint(bytes),
    canonicalByteLength: bytes.length,
    artifactId: null,
    provenanceRef: null,
    lawVersion: null,
  });
}

/**
 * A reference that resolves an exact artifact identity AND content.
 * @param {{ artifactId: string|null, spatialHash: string, effectiveAt: number }} spatial
 * @returns {{ artifactId: string|null, contentHash: string, effectiveAt: number }}
 */
export function spatialRef(spatial) {
  return Object.freeze({ artifactId: spatial.artifactId, contentHash: spatial.spatialHash,
    effectiveAt: spatial.effectiveAt });
}

/**
 * ⭐⭐⭐ `spatialReceipt_t`. Immutable, idempotent, dated for LATER.
 *
 * @param {{kind:string, temporalMode?:string, sourceSpatialRef:{effectiveAt?:number}, payload:object,
 *          sourceIds:string[], affectedIds:string[], observedAt:number, effectiveAt:number,
 *          dependencies:DependencyRef[]}} input
 */
export function spatialEffectReceipt(input) {
  const { kind, temporalMode = 'STATIC_POTENTIAL', sourceSpatialRef, payload,
    sourceIds, affectedIds, observedAt, effectiveAt, dependencies } = input;
  if (!RECEIPT_KINDS.includes(kind)) {
    throw new TypeError(`SPATIAL_EFFECT_RECEIPT: '${kind}' is not a registered receipt kind`);
  }
  const rosterKey = `${kind}|${temporalMode}`;
  const roster = /** @type {Readonly<Record<string, readonly string[]>>} */ (DEPENDENCY_ROSTER)[rosterKey];
  if (!roster) {
    throw new TypeError(`SPATIAL_EFFECT_RECEIPT: ${kind} has no '${temporalMode}' branch — a new `
      + 'causal constraint needs a new discriminated branch, never an extra role in a tuple');
  }
  const got = (dependencies || []).map((d) => d.role);
  if (got.length !== roster.length || got.some((r, i) => r !== roster[i])) {
    throw new TypeError(`SPATIAL_EFFECT_RECEIPT: ${rosterKey} requires exactly [${roster.join(', ')}]`
      + ` in that order; got [${got.join(', ')}]`);
  }
  if (!sourceIds || !sourceIds.length || !affectedIds || !affectedIds.length) {
    throw new TypeError('SPATIAL_EFFECT_RECEIPT: sourceIds and affectedIds are NONEMPTY — a '
      + 'genuine no-effect result uses noEffectDiagnostic, never an empty causal receipt');
  }
  // ⛔⛔ THE SAME-PASS REFUSAL, AS ARITHMETIC. This is §287.4's whole content: a receipt that
  // could be applied in the pass that produced it is unrepresentable.
  // ⚠ Collected by an explicit guard rather than `.filter(Number.isFinite)`: the predicate form
  // does not narrow `number|undefined` away, and the honest cure is the guard, never a cast that
  // asserts the absent source time is a number. Behaviour is identical — `Number.isFinite` is
  // already false for every non-number.
  /** @type {number[]} */
  const sourceTimes = [];
  for (const t of [sourceSpatialRef.effectiveAt, observedAt]) {
    if (typeof t === 'number' && Number.isFinite(t)) sourceTimes.push(t);
  }
  const latest = sourceTimes.length ? Math.max(...sourceTimes) : null;
  if (latest === null || !(effectiveAt > latest)) {
    throw new TypeError(`SPATIAL_EFFECT_RECEIPT: effectiveAt (${effectiveAt}) must be STRICTLY `
      + `later than every source time (${latest}) — same-pass map→economy→map feedback is forbidden`);
  }
  // ⭐ §390.1: both halves of every dependency pair, both id lists and every body field are
  // length-prefixed, so no repacking of one field into its neighbour can forge a preimage.
  const body = canonicalBytes('SPATIAL_EFFECT_RECEIPT', 1,
    dependencies.map((d) => `${lengthPrefixed(d.role)}=${lengthPrefixed(d.contentHash)}`),
    prefixedList([kind, temporalMode, observedAt, effectiveAt, prefixedList(sourceIds),
      prefixedList(affectedIds), JSON.stringify(payload)]));
  return Object.freeze({
    artifactKind: 'SPATIAL_EFFECT_RECEIPT',
    schemaVersion: 1,
    kind,
    temporalMode,
    sourceSpatialRef,
    orderedDependencies: Object.freeze(dependencies.map(Object.freeze)),
    payload: Object.freeze({ ...payload }),
    sourceIds: Object.freeze([...sourceIds]),
    affectedIds: Object.freeze([...affectedIds]),
    observedAt,
    effectiveAt,
    contentHash: fingerprint(body),
    artifactId: null,
    provenanceRef: null,
    lawVersion: null,
  });
}

/** ⭐ THE OTHER DOOR (§10.2). A measured no-effect is a diagnostic, not a causal receipt — so a
 *  census can tell "nothing happened" from "nobody looked".
 *  @param {string} kind
 *  @param {unknown} sourceSpatialRef
 *  @param {ReadonlyArray<string>} examinedIds
 *  @param {number} observedAt */
export function noEffectDiagnostic(kind, sourceSpatialRef, examinedIds, observedAt) {
  return Object.freeze({
    artifactKind: 'SPATIAL_EFFECT_DIAGNOSTIC',
    kind,
    sourceSpatialRef,
    examinedIds: Object.freeze([...examinedIds]),
    observedAt,
    result: 'NO_EFFECT',
  });
}
