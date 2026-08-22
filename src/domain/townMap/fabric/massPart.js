/**
 * domain/townMap/fabric/massPart.js — MF-T2E · ODQ §287.16 · SPEC §7.1.2 / §10.5 / §10.16(3) ·
 * ⭐⭐ THE TYPED FUNCTIONAL-VOLUME VOCABULARY AND THE QUANTIZED VERTICAL TRUTH.
 *
 * SPEC §10.16(3) names this member in its own D1 row: *"The volume law's attachment vocabulary
 * needs `MassPartQ`/`SolidPartQ`, which D3a mints — the typed contract lands here, the third
 * dimension there."* D1 landed the contract. This module is "there".
 *
 * ⭐⭐ THE VERTICAL RULE IS INHERITED, NOT RE-MINTED. MF-D1's `solidLegality.js` declared it in
 * advance precisely so this member would not mint a second one: vertical extents are half-open
 * intervals `[baseQ, topQ)` on a NAMED SUPPORT SURFACE, and two solids on DIFFERENT supports do
 * not intersect merely because their intervals do. What this module publishes is exactly the
 * `{kind:'INTERVAL', baseQ, topQ}` discriminant that predicate reads, so the port that brings it
 * home admits these records with zero adaptation. Executed against the sealed predicate at this
 * member's own base, read-only: the stacked pair `[0,5000)` / `[5000,9000)` sharing one support
 * and one footprint reads `VOLUME sharedAreaQ=100000000 sharedHeightQ=0 sharedVolumeQ=0 ->
 * DISJOINT_OR_ABUTTING`. That is the half-open law as behavior rather than as prose: the two
 * parts touch at quantum 5000 and enclose no shared volume.
 *
 * ⛔⛔ WHY THE DEGENERACY CHECK IS BigInt, INTERNAL, AND UNEXPORTED (preamble §P1, R-MF-2). The
 * only arithmetic decision in this leaf is "does this footprint ring enclose any ground", a
 * product of two ABI quanta. At ABI scale the float spelling is WRONG, and the divergence was
 * MEASURED at this base rather than reasoned about: on the triangle `a=[0,0] b=[m-1,m]
 * c=[m,m+1]` with `m = 1286630001`, the Number shoelace reads `2A = 0` and this tree's own
 * `exactGeometry.area()` / `absArea()` read `0` — while the exact BigInt shoelace reads
 * `2A = -1`. A Number-based check would REFUSE that valid sliver as degenerate ground. So
 * `exactGeometry.js` is deliberately NOT imported here and deliberately NOT extended: the check
 * is exact, internal and unexported, because a second exported area spelling inside this
 * directory is precisely the defect the fabric single-declaration law exists to refuse.
 * The control that keeps the reasoning honest: on a genuinely collapsed ring (three collinear
 * points) BOTH spellings read `2A = 0`, so the BigInt check is sharper, never merely different.
 *
 * ⛔ WHAT THIS MEMBER DELIBERATELY DOES NOT DO.
 *   · No overlap, interval-intersection, shared-volume or legality predicate. There is ONE
 *     predicate home and it is not this file; a second spelling here would be the §287.12 defect.
 *   · No `heightQ()` motion, no world-unit-to-quantum conversion, and no height published into
 *     any artifact. This module mints the vertical CONTRACT in explicit integer quanta validated
 *     through the landed wall; the height door itself (§P2.7) stays shut, and height's first
 *     PUBLICATION remains owed by a later member.
 *   · No `artifactKind`, no `schemaVersion`, no law-version string. These records are validated
 *     IN-MEMORY VOCABULARY — nothing persists them, so no reload/regen/undo/migration seam
 *     exists yet. The member that first persists a massing phase mints the stamp once, against
 *     the then-complete shape; stamping now and then growing the shape would put two different
 *     shapes under one name.
 *   · Nothing in production imports this module. It lands dormant, and its acceptance battery is
 *     its only caller.
 *
 * ⚠ SLICE BOUNDARY, NAMED RATHER THAN SILENT. SPEC §7.1.2's `MassingKnowledge<T>` carries a
 * required `provenanceRef` and an optional `coverageRef`; §10.5's `SolidPartQ` carries
 * `lowerOffset`, `upperEnvelope` and `closedShell`, and its `support` is a typed five-branch
 * `SupportSurfaceRef`. None of that substrate exists in this era, and an unvalidatable required
 * field is worse than an absent one — the same "named ABSENT rather than faked" posture the
 * landed ABI record takes for its own null refs. This is the D3a-core slice: the exact shape the
 * legality predicate admits. The field NAMES are upward-compatible — a later member types
 * `supportSurfaceId` and adds fields; it renames nothing.
 *
 * PURITY: pure over arguments. Integer and BigInt arithmetic only. No clock, no randomness, no
 * locale ordering, no iteration-order dependence — fields are written in fixed literal order and
 * no spread of caller input reaches a published record.
 */

import {
  deepFreezeCanonical, requireCanonicalId, requireCanonicalInt, requireCanonicalRecord,
} from './foundation.js';
import { COORDINATE_ABI_VERSION } from './coordinateAbi.js';

/** SPEC §7.1.2 `FunctionalVolume`, verbatim and in SPEC order. Closed. */
export const FUNCTIONAL_VOLUME_KINDS = Object.freeze([
  'OPEN_CLEAR', 'DOMESTIC_STACK', 'STORAGE_STACK', 'PARTIAL_LOFT',
  'OCCUPIED_ATTIC', 'UNINHABITED_ATTIC',
]);

/** SPEC §7.1.2 `MorphologyRole`, verbatim and in SPEC order (17). Arrangement, never use. */
export const MORPHOLOGY_ROLE_KINDS = Object.freeze([
  'MAIN_RANGE', 'CROSS_WING', 'REAR_RANGE', 'ANNEX',
  'STAIR_TOWER', 'GALLERY', 'PASSAGE', 'LEAN_TO',
  'CURTAIN_RUN', 'WALL_TOWER', 'GATEHOUSE', 'KEEP', 'BELFRY',
  'SPIRE', 'COVERED_PASSAGE', 'LAND_CAP', 'LAND_KEEL',
]);

/** SPEC §7.1.2 `MassingUnknownReason`, verbatim and in SPEC order. Closed. */
export const MASSING_UNKNOWN_REASONS = Object.freeze([
  'NOT_OBSERVED', 'OUTSIDE_COVERAGE', 'CONFLICTING_EVIDENCE', 'WITHHELD',
]);

/** @typedef {{ status: 'KNOWN', value: string }} KnownMassingFact */
/** @typedef {{ status: 'UNKNOWN', reason: string }} UnknownMassingFact */
/** @typedef {KnownMassingFact | UnknownMassingFact} MassingFact */
/** @typedef {{ kind: 'INTERVAL', baseQ: number, topQ: number }} VerticalIntervalQ */
/**
 * @typedef {{ partId: string, supportSurfaceId: string, footprint: Array<[number, number]>,
 *   vertical: Readonly<VerticalIntervalQ>, abiVersion: number }} SolidPartQRecord
 */
/**
 * @typedef {{ partId: string, parentBodyId: string, morphologyRole: string,
 *   functionalVolume: Readonly<MassingFact>, solid: Readonly<SolidPartQRecord> }} MassPartQRecord
 */

/**
 * Membership in a CLOSED vocabulary, with the guard-the-guard arm first: an empty or non-array
 * vocabulary is itself the defect, because a membership test against nothing admits everything.
 * @param {unknown} value @param {readonly string[]} vocabulary @param {string} label
 * @returns {string}
 */
function requireVocabularyMember(value, vocabulary, label) {
  if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
    throw new TypeError(`${label} has no closed vocabulary to be checked against`);
  }
  if (typeof value !== 'string' || !vocabulary.includes(value)) {
    throw new TypeError(`${label} must be one of: ${vocabulary.join(', ')}`);
  }
  return value;
}

/**
 * ⭐ The sign of twice the exact signed area of a ring — the R-MF-2 decision, in BigInt because
 * the float spelling reads 0 on valid ground at ABI scale (see the module docblock).
 * @param {ReadonlyArray<readonly [number, number]>} ring @returns {-1|0|1}
 */
function ringAreaSign2x(ring) {
  let sum = 0n;
  for (let index = 0; index < ring.length; index += 1) {
    const [ax, az] = ring[index];
    const [bx, bz] = ring[(index + 1) % ring.length];
    sum += BigInt(ax) * BigInt(bz) - BigInt(bx) * BigInt(az);
  }
  if (sum === 0n) return 0;
  return sum > 0n ? 1 : -1;
}

/**
 * A KNOWN fact on a closed axis. The vocabulary is a parameter so later massing members reuse
 * this pair rather than minting their own knowledge shape.
 * @param {unknown} value @param {readonly string[]} vocabulary @param {string} label
 * @returns {Readonly<KnownMassingFact>}
 */
export function knownMassingFact(value, vocabulary, label) {
  /** @type {KnownMassingFact} */
  const fact = { status: 'KNOWN', value: requireVocabularyMember(value, vocabulary, label) };
  return deepFreezeCanonical(fact);
}

/**
 * An UNKNOWN fact. ⛔ It carries NO value field, and that is structural rather than stylistic:
 * the SPEC's no-inference law says an unknown fact cannot trigger a value-conditioned resolver,
 * and the strongest way to guarantee that is for the value not to exist on the record.
 * @param {unknown} reason @param {string} label @returns {Readonly<UnknownMassingFact>}
 */
export function unknownMassingFact(reason, label) {
  const checked = requireVocabularyMember(reason, MASSING_UNKNOWN_REASONS, label);
  /** @type {UnknownMassingFact} */
  const fact = { status: 'UNKNOWN', reason: checked };
  return deepFreezeCanonical(fact);
}

/**
 * Route a caller's knowledge input onto the total KNOWN/UNKNOWN axis. Any third status shape is
 * refused rather than defaulted — a total axis with a silent fallback is not total.
 * @param {unknown} input @param {readonly string[]} vocabulary @param {string} label
 * @returns {Readonly<MassingFact>}
 */
function massingFactOf(input, vocabulary, label) {
  const source = requireCanonicalRecord(input, label);
  if (source.status === 'KNOWN') {
    return knownMassingFact(source.value, vocabulary, `${label}.value`);
  }
  if (source.status === 'UNKNOWN') {
    if ('value' in source) {
      throw new TypeError(`${label} is UNKNOWN and must carry no value: an unknown fact cannot`
        + ' feed a value-conditioned resolver (the no-inference law)');
    }
    return unknownMassingFact(source.reason, `${label}.reason`);
  }
  throw new TypeError(`${label}.status must be exactly 'KNOWN' or 'UNKNOWN'`);
}

/**
 * ⭐ The half-open vertical extent `[baseQ, topQ)`, in explicit integer quanta through the landed
 * wall. Negatives are legal: a keel sits below its support datum. ⛔ STRICTLY POSITIVE MEASURE —
 * `[b, b)` is empty and is refused, so no published record can claim a zero-height solid.
 * @param {unknown} baseQ @param {unknown} topQ @returns {Readonly<VerticalIntervalQ>}
 */
export function verticalIntervalQ(baseQ, topQ) {
  const base = requireCanonicalInt(baseQ, 'verticalIntervalQ.baseQ');
  const top = requireCanonicalInt(topQ, 'verticalIntervalQ.topQ');
  if (!(top > base)) {
    throw new TypeError(`verticalIntervalQ [${base}, ${top}) is empty or inverted: topQ must be`
      + ' strictly greater than baseQ (the half-open interval law)');
  }
  /** @type {VerticalIntervalQ} */
  const interval = { kind: 'INTERVAL', baseQ: base, topQ: top };
  return deepFreezeCanonical(interval);
}

/**
 * ⭐⭐ The quantized solid: a footprint ring on a NAMED support surface, carrying a half-open
 * vertical interval and the ABI version it was minted under. This is the exact shape the D1
 * legality predicate admits.
 * ⛔ No ring-simplicity or self-crossing check lives here: ring simplicity is the kernel's
 * guarantee and a second spelling of it in this directory is forbidden.
 * @param {unknown} input @returns {Readonly<SolidPartQRecord>}
 */
export function solidPartQ(input) {
  const source = requireCanonicalRecord(input, 'solidPartQ input');
  const partId = requireCanonicalId(source.partId, 'solidPartQ.partId');
  const supportSurfaceId = requireCanonicalId(
    source.supportSurfaceId, 'solidPartQ.supportSurfaceId',
  );
  const ring = source.footprint;
  if (!Array.isArray(ring) || ring.length < 3) {
    throw new TypeError('solidPartQ.footprint must be a ring of at least three [xQ, zQ] points');
  }
  const footprint = ring.map((point, index) => {
    if (!Array.isArray(point) || point.length !== 2) {
      throw new TypeError(`solidPartQ.footprint[${index}] must be an [xQ, zQ] point`);
    }
    return /** @type {[number, number]} */ ([
      requireCanonicalInt(point[0], `solidPartQ.footprint[${index}][0]`),
      requireCanonicalInt(point[1], `solidPartQ.footprint[${index}][1]`),
    ]);
  });
  if (ringAreaSign2x(footprint) === 0) {
    throw new TypeError('solidPartQ.footprint has zero exact signed area (degenerate ring):'
      + ' the ring encloses no ground');
  }
  const verticalSource = requireCanonicalRecord(source.vertical, 'solidPartQ.vertical');
  const vertical = verticalIntervalQ(verticalSource.baseQ, verticalSource.topQ);
  /** @type {SolidPartQRecord} */
  const record = {
    partId, supportSurfaceId, footprint, vertical, abiVersion: COORDINATE_ABI_VERSION,
  };
  return deepFreezeCanonical(record);
}

/**
 * ⭐⭐ The mass part: one solid, its arrangement role, and its functional-volume knowledge.
 * ⛔ THE IDENTITY LAW (SPEC §10.5, verbatim): `part.solid.partId === part.partId`. A mismatch is
 * refused naming both ids, because a part whose solid belongs to another part is two records
 * pretending to be one.
 * The solid is constructed INTERNALLY from its input shape — one construction route, so no
 * half-validated solid can ever circulate.
 * @param {unknown} input @returns {Readonly<MassPartQRecord>}
 */
export function massPartQ(input) {
  const source = requireCanonicalRecord(input, 'massPartQ input');
  const partId = requireCanonicalId(source.partId, 'massPartQ.partId');
  const parentBodyId = requireCanonicalId(source.parentBodyId, 'massPartQ.parentBodyId');
  const morphologyRole = requireVocabularyMember(
    source.morphologyRole, MORPHOLOGY_ROLE_KINDS, 'massPartQ.morphologyRole',
  );
  const functionalVolume = massingFactOf(
    source.functionalVolume, FUNCTIONAL_VOLUME_KINDS, 'massPartQ.functionalVolume',
  );
  const solidSource = requireCanonicalRecord(source.solid, 'massPartQ.solid');
  if (solidSource.partId !== partId) {
    throw new TypeError(`massPartQ.solid.partId ${JSON.stringify(solidSource.partId)} must equal`
      + ` massPartQ.partId ${JSON.stringify(partId)} (the part/solid identity law)`);
  }
  const solid = solidPartQ(solidSource);
  /** @type {MassPartQRecord} */
  const record = { partId, parentBodyId, morphologyRole, functionalVolume, solid };
  return deepFreezeCanonical(record);
}
