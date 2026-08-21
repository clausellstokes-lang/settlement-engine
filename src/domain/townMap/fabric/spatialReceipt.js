/**
 * domain/townMap/fabric/spatialReceipt.js — ⭐⭐⭐ MF-D1 · §287.4 / SPEC §10.1–§10.2 ·
 * **THE `state_t → canonicalSpatial_t → spatialReceipt_t` SEAM, AS A TYPED ARTIFACT.**
 *
 * ODQ §287.4, binding: *"`state_t → canonicalSpatial_t → spatialReceipt_t → state_t+1`. Same-pass
 * map→economy→map feedback is forbidden. Durable SPATIAL, time-indexed OBSERVATION, semantic
 * PROJECTION and RASTER have separate digests."*
 *
 * ⛔⛔ THE DEFECT THIS FORECLOSES, IN SPEC §10.2's OWN WORDS: *"§6.7's floating land currently
 * casts shade, S18 consumes that shade, and S18 can affect prosperity/siting that helped decide
 * what the floating land carries. That is a same-pass causal cycle even if the module graph is
 * acyclic."* A cycle the import graph cannot see is the hardest kind to refuse, which is why the
 * refusal has to be a SHAPE — a receipt dated for later — and not a lint rule about imports.
 *
 * ⭐⭐⭐ THE THREE RULES THIS MODULE MAKES UNREPRESENTABLE RATHER THAN FORBIDDEN:
 *
 *   1. **A RECEIPT IS DATED FOR LATER.** `effectiveAt` must be strictly greater than every source
 *      time. A receipt that could be applied in the pass that produced it cannot be constructed.
 *   2. **THE DEPENDENCY ROSTER IS CLOSED BY KIND.** §10.2 fixes it exactly: a `SHADE_EXPOSURE`
 *      receipt carries `SPATIAL, OBSERVATION, SOLAR_PROFILE, LAW`; a static `ACCESS`/`BLOCKAGE`/
 *      `CONNECTION` carries exactly `SPATIAL, LAW`. An extra role, a missing role or a duplicate
 *      is a construction failure, not a validation warning.
 *   3. **A NO-EFFECT RESULT IS NOT AN EMPTY RECEIPT.** §10.2: *"a genuine no-effect result uses a
 *      separately typed diagnostic, never an empty causal receipt."* `sourceIds`/`affectedIds` are
 *      nonempty by construction and `noEffectDiagnostic` is the other door.
 *
 * ⭐⭐ AND THE DIGESTS ARE FOUR, NOT ONE (§10.1). The spatial digest is taken over DURABLE facts
 * only; a projection or raster change may not move it, and the fabric's existing WORLD/PROJECTION/
 * RASTER tiers are its ancestors. §10.1's own refusal is carried here: *"No aggregate digest is
 * accepted as proof of a narrower invariant."* `spatialDigestOf` therefore reads a NAMED field
 * roster and refuses to hash a whole fabric object — an aggregate hash would pass every narrower
 * gate for the wrong reason.
 *
 * ⚠ WHAT IS ABSENT AND NAMED. `ArtifactId`, `ProvenanceRef`, `LawVersion` and the closed id
 * registries (`AccessModeId`, `CapacityMeasureId`, …) are §10.2 artifact families that do not
 * exist in the plan era. They are `null` here rather than stubbed. The digest is a 128-bit
 * FINGERPRINT built from the fabric's own `hash32`, declared as a fingerprint and never as
 * cryptography or as an authorization decision.
 *
 * PURITY: pure. No Date, no Math.random, no I/O. Times are supplied by the caller, never read.
 */

import { hash32 } from './fabricRng.js';
import { canonicalBytes, COORDINATE_ABI_VERSION, ringText, worldQ } from './coordinateAbi.js';

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

/** A 128-bit fingerprint over canonical bytes. ⚠ A FINGERPRINT, NOT A CONTENT HASH: it is four
 *  salted 32-bit streams of the fabric's own integer hash, it is not cryptographic, and no
 *  authorization may ever be decided from it. Named so nobody promotes it by accident. */
export function fingerprint(text) {
  const s = String(text);
  const a = hash32(`f0:${s}`), b = hash32(`f1:${s}`), c = hash32(`f2:${s}`), d = hash32(`f3:${s}`);
  const hex = (v) => (v >>> 0).toString(16).padStart(8, '0');
  return `fp-v1-${hex(a)}${hex(b)}${hex(c)}${hex(d)}`;
}

/**
 * ⭐⭐ THE DURABLE SPATIAL FIELD ROSTER — named, closed, and the reason this is not a whole-object
 * hash. §10.1: *"No aggregate digest is accepted as proof of a narrower invariant."* Every entry
 * is a durable, ordered, quantized identity or geometry; live season, selected leaf, camera,
 * light, ink and document state are excluded BY NAME, so a projection change provably cannot move
 * the spatial digest.
 */
export const SPATIAL_FIELDS = Object.freeze(['walls', 'channels', 'water', 'parcels', 'blocks',
  'commons', 'compounds', 'fields', 'organisms', 'landmarks', 'bridges', 'enclosure']);

/** Fields that must NEVER enter the spatial digest — the §10.1 exclusion, made checkable. */
export const NON_SPATIAL_FIELDS = Object.freeze(['immersion', 'lod', 'measure', 'record',
  'stateMarks', 'meta', 'relief', 'substrate', 'suitability']);

const ringOf = (v) => (Array.isArray(v) && v.length && Array.isArray(v[0]) ? ringText(v) : null);

/** Canonical text for one durable field — geometry through the ABI, identities as themselves. */
function fieldText(name, value) {
  if (value == null) return `${name}:∅`;
  if (Array.isArray(value)) {
    const parts = value.map((v, i) => {
      if (v == null) return `${i}:∅`;
      const r = ringOf(v.polygon) || ringOf(v.line) || ringOf(v);
      const id = v.key || v.id || v.organismKey || '';
      return `${i}:${id}:${r === null ? '' : r}`;
    });
    return `${name}[${value.length}]{${parts.join('|')}}`;
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
export function canonicalSpatial(fabric, effectiveAt = 0) {
  const parts = [];
  for (const f of SPATIAL_FIELDS) parts.push(fieldText(f, fabric[f]));
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

/** A reference that resolves an exact artifact identity AND content. */
export function spatialRef(spatial) {
  return Object.freeze({ artifactId: spatial.artifactId, contentHash: spatial.spatialHash,
    effectiveAt: spatial.effectiveAt });
}

/**
 * ⭐⭐⭐ `spatialReceipt_t`. Immutable, idempotent, dated for LATER.
 *
 * @param {{kind:string, temporalMode?:string, sourceSpatialRef:any, payload:object,
 *          sourceIds:string[], affectedIds:string[], observedAt:number, effectiveAt:number,
 *          dependencies:{role:string, contentHash:string}[]}} input
 */
export function spatialEffectReceipt(input) {
  const { kind, temporalMode = 'STATIC_POTENTIAL', sourceSpatialRef, payload,
    sourceIds, affectedIds, observedAt, effectiveAt, dependencies } = input;
  if (!RECEIPT_KINDS.includes(kind)) {
    throw new TypeError(`SPATIAL_EFFECT_RECEIPT: '${kind}' is not a registered receipt kind`);
  }
  const rosterKey = `${kind}|${temporalMode}`;
  const roster = DEPENDENCY_ROSTER[rosterKey];
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
  const sourceTimes = [sourceSpatialRef.effectiveAt, observedAt].filter(Number.isFinite);
  const latest = sourceTimes.length ? Math.max(...sourceTimes) : null;
  if (latest === null || !(effectiveAt > latest)) {
    throw new TypeError(`SPATIAL_EFFECT_RECEIPT: effectiveAt (${effectiveAt}) must be STRICTLY `
      + `later than every source time (${latest}) — same-pass map→economy→map feedback is forbidden`);
  }
  const body = canonicalBytes('SPATIAL_EFFECT_RECEIPT', 1,
    dependencies.map((d) => `${d.role}=${d.contentHash}`),
    `${kind}|${temporalMode}|${observedAt}|${effectiveAt}|${sourceIds.join(',')}|`
      + `${affectedIds.join(',')}|${JSON.stringify(payload)}`);
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
 *  census can tell "nothing happened" from "nobody looked". */
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
