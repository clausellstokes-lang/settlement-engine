/**
 * domain/townMap/fabric/supportSurface.js — MF-T2K · ODQ §287.16 · SPEC §10.5 / §6.4.1 ·
 * ⭐⭐ SUPPORT-RELATIVE SOLIDS AND COMPONENT SLOTS: the typed support surface MF-T2E left as a
 * bare id, the owner-qualified key MF-T2F's `DIFFERENT_SUPPORT_SURFACE` refusal consumes, §10.5's
 * acyclicity law made executable, and the total PRESENT/NONE/UNKNOWN component-slot axis.
 *
 * ⭐⭐ THE ERA-SLICE LAW, INHERITED WHOLE FROM MF-T2E: AN UNVALIDATABLE REQUIRED FIELD IS WORSE
 * THAN AN ABSENT ONE. SPEC §10.5's full `SupportSurfaceRef` resolves through a ground-surface
 * registry, datum registries, an `ArtifactHashRef` and massing-phase registries, and equality-pins
 * a `localDatumCache` height. None of that substrate exists in this era — `heightQ()` still throws
 * (§P2.7) — so this module mints the D3a-core slice: the closed kind vocabulary, the DERIVED
 * owner-qualified key, branch-shaped records over facts that exist today, the roster-level
 * acyclicity law, and the total slot axis. The field NAMES are the SPEC's, so the registry era
 * ADDS fields and renames nothing — the same upward-compatibility contract MF-T2E published for
 * `supportSurfaceId`. ⛔ This member TYPES that reference; it does not open `massPart.js`.
 *
 * ⭐⭐ THE KEY IS DERIVED, NEVER ACCEPTED. SPEC §10.5: *"`SupportSurfaceRefBase.surfaceId` is a
 * deterministic owner-qualified key, not a free alias"*. Every landed caller today hand-writes the
 * id, which is exactly the free alias the SPEC forbids, so `supportSurfaceRef` derives the key and
 * REFUSES a caller-supplied `surfaceId`: an accepted alias would be this module's own defect class.
 *
 * ⛔⛔ WHY INJECTIVITY IS BOUGHT WITH A SEGMENT GRAMMAR AND NOT WITH A SEPARATOR BYTE. The estate's
 * fresh separator lesson is MF-T2Bf, whose non-injective join over `:`-bearing segments collided
 * and whose cure was U+001F. That idiom is UNAVAILABLE here, and the reason is measured rather than
 * stylistic: the derived key must pass the landed id wall `/^[a-z0-9][a-z0-9:._-]{0,95}$/`, which
 * admits no C0 byte, and `tests/lint/controlBytes.test.js` forbids the raw byte in source anyway.
 * The lawful cure runs the other way: `:` is RESERVED as this key's separator, so every segment is
 * validated against the id grammar MINUS `:`. With `:`-free segments and a fixed field order per
 * kind the join is invertible by construction, and a `:`-bearing segment is refused naming the
 * reservation. An over-long derivation is refused BY THE WALL, typed — never truncated, because a
 * truncation would re-open the aliasing the derivation exists to close.
 *
 * ⭐ THE UNKNOWN VOCABULARY IS IMPORTED, NOT RE-DECLARED. SPEC §6.4.1's `UnknownMaterialFact.reason`
 * is byte-identical, and in the same order, to the landed `MASSING_UNKNOWN_REASONS`. One vocabulary
 * makes drift structurally impossible; a local copy would make it merely discouraged.
 *
 * ⛔ WHAT THIS MEMBER DELIBERATELY DOES NOT DO.
 *   · No connection vocabulary, no portal, no cross-support licensing. MF-T2F's refusal detail says
 *     a cross-support comparison needs *"a registered connection"*; a connection resolves host,
 *     support and lifecycle through the receipt/operation seam, none of which this era can
 *     validate. ⭐ THE REFUSAL STAYS A REFUSAL: nothing here licenses what F refuses.
 *   · No registry of any kind — ground-surface, datum, massing-phase, material. `materialId` and
 *     every owner id are validated identifiers, unresolved this era.
 *   · No `EXTERNAL_MASSING_PHASE`. No `MAINTAINED_FREE_SPACE` construction: maintained free space
 *     needs a pre-existing support-OPERATION ref and operations sit behind the §299.3c chair
 *     ruling. The KIND vocabulary still ships the SPEC's full seven — a closed list is ported whole
 *     and a trimmed one would be a second vocabulary wearing the same name — so the seventh kind
 *     is present and its constructor arm refuses with a typed message naming the blocked
 *     substrate. That arm flips from refusal to construction in the member that lands the
 *     operation seam, deliberately, in its own packet.
 *   · No `supportSchemaVersion`, no `artifactKind`/`schemaVersion`/`lawVersion` stamp. These are
 *     validated IN-MEMORY vocabulary under MF-T2E's ratified resolution (ODQ §348); the first
 *     persisting member mints the stamp once, against the then-complete shape.
 *   · No schema-conformance law for slots (`materialSlotSchemaRef`, *"no required slot may be
 *     omitted"*): no schema substrate exists, and a fake schema would be the defect. The roster
 *     free-stands on an `ownerPartId` join; the member that composes rosters INTO `MassPartQ` owns
 *     the embedding and the `part.partId === roster.ownerPartId` equality at that seam.
 *   · No second spelling of anything landed — no overlap, legality or area predicate, no validator,
 *     no freeze helper. No quanta arithmetic AT ALL: this leaf carries ids and vocabulary only, so
 *     R-MF-2 has no surface here, and saying so is what keeps a reviewer from hunting for it.
 *   · No vegetation names: `trunk.support`, `canopyAnchor` and the species classes are MF-T2L's.
 *
 * ⛔ THE IMPORT CLOSURE IS A DESIGN CONSTRAINT, NOT AN ACCIDENT. This leaf imports EXACTLY
 * `./foundation.js` and `./massPart.js`. `tests/lint/townMapStageManifest.walker.test.js` freezes
 * `FOUNDATION_READERS` over the whole fabric directory — *"a new reader is a deliberate act"* — and
 * `coordinateAbi.js` and `solidLegality.js` are both tracked there. Neither is needed: there are no
 * quanta to stamp an ABI onto, and the legality predicate is the ACCEPTANCE FILE's consumer, never
 * this leaf's. Importing either would owe a roster edit inside another member's reserved file for
 * zero behaviour.
 *
 * PURITY: pure over arguments; string, array and Map handling only. No clock, no randomness, no
 * locale ordering (every comparison is an explicit codepoint compare), no iteration-order
 * dependence; fields are written in fixed table-driven order and no spread of caller input reaches
 * a published record.
 */

import {
  deepFreezeCanonical, requireCanonicalId, requireCanonicalRecord,
} from './foundation.js';
import { MASSING_UNKNOWN_REASONS } from './massPart.js';

/** SPEC §10.5's `SupportSurfaceRef` union, verbatim kinds in SPEC order (7). Closed. */
export const SUPPORT_SURFACE_KINDS = Object.freeze([
  'WORLD_DATUM', 'TERRAIN_FACE', 'FLOOR_PLANE', 'ROOF_FACE', 'WALL_TOP', 'LAND_CAP',
  'MAINTAINED_FREE_SPACE',
]);

/** SPEC §6.4.1 `MaterialComponentRole`, verbatim and in SPEC order (9). Closed. */
export const COMPONENT_SLOT_ROLES = Object.freeze([
  'BASE', 'LOADBEARING', 'FRAME', 'INFILL', 'CLADDING', 'FLOOR', 'ROOF_STRUCTURE',
  'ROOF_COVERING', 'REPAIR',
]);

/** SPEC §6.4.1 `MaterialAbsenceReason`, verbatim and in SPEC order (4). Closed. */
export const MATERIAL_ABSENCE_REASONS = Object.freeze([
  'NOT_APPLICABLE', 'OPEN_STRUCTURE', 'UNCLAD', 'UNCOVERED_BY_DESIGN',
]);

/** The owner-qualified branch fields, shared by the four massing-owned kinds. */
const MASSING_OWNED_SEGMENTS = Object.freeze(['ownerBodyId', 'ownerPartId', 'patchId']);

/** @typedef {Readonly<{ token: string, segments: readonly string[] | null }>} SupportKindGrammar */

/**
 * ⭐ THE KIND GRAMMAR — TOTAL over `SUPPORT_SURFACE_KINDS`, and total is the point: a general
 * case-transform would silently mint a token for a future kind, and a table missing a row would
 * make the membership test above admit a kind nothing can spell. `segments: null` is the typed era
 * refusal (§299.3c), carried as data so the blocked kind is a row rather than a special case.
 * @type {Readonly<Record<string, SupportKindGrammar>>}
 */
const SUPPORT_SURFACE_GRAMMAR = Object.freeze({
  WORLD_DATUM: Object.freeze({ token: 'world-datum', segments: Object.freeze(['datumId']) }),
  TERRAIN_FACE: Object.freeze({ token: 'terrain-face', segments: Object.freeze(['patchId']) }),
  FLOOR_PLANE: Object.freeze({ token: 'floor-plane', segments: MASSING_OWNED_SEGMENTS }),
  ROOF_FACE: Object.freeze({ token: 'roof-face', segments: MASSING_OWNED_SEGMENTS }),
  WALL_TOP: Object.freeze({ token: 'wall-top', segments: MASSING_OWNED_SEGMENTS }),
  LAND_CAP: Object.freeze({ token: 'land-cap', segments: MASSING_OWNED_SEGMENTS }),
  MAINTAINED_FREE_SPACE: Object.freeze({ token: 'maintained-free-space', segments: null }),
});

/** The id grammar MINUS `:` — the reservation that makes the key join invertible. */
const KEY_SEGMENT_PATTERN = /^[a-z0-9][a-z0-9._-]{0,31}$/;

/** @typedef {Readonly<{ kind: string, surfaceId: string }>} SupportSurfaceRefRecord */
/** @typedef {Readonly<{ slotId: string, role: string, status: string }>} ComponentSlotRecord */

/**
 * Membership in a CLOSED vocabulary, with the guard-the-guard arm first: an empty or non-array
 * vocabulary is itself the defect, because a membership test against nothing admits everything.
 * ⛔ Internal and unexported, exactly as in `massPart.js` — a second exported membership helper in
 * this directory is what the fabric single-declaration law exists to refuse.
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
 * One `:`-free key segment. The message names the RESERVATION rather than merely the pattern,
 * because a caller who reaches this refusal has almost always tried to pass a compound id.
 * @param {unknown} value @param {string} label @returns {string}
 */
function requireKeySegment(value, label) {
  if (typeof value !== 'string' || !KEY_SEGMENT_PATTERN.test(value)) {
    throw new TypeError(`${label} must be a key segment ${KEY_SEGMENT_PATTERN.source}: ':' is`
      + ' RESERVED as the support-key separator, so no segment may contain one (the injectivity'
      + ' law — a non-injective join over :-bearing segments is the MF-T2Bf collision)');
  }
  return value;
}

/**
 * ⭐⭐ THE TYPED SUPPORT REFERENCE, WITH ITS KEY DERIVED. Input per kind (era slice):
 *   `{kind:'WORLD_DATUM', datumId}` · `{kind:'TERRAIN_FACE', patchId}` ·
 *   `{kind:'FLOOR_PLANE'|'ROOF_FACE'|'WALL_TOP'|'LAND_CAP', ownerBodyId, ownerPartId, patchId}`
 * The derived key is `support:<kind-token>[:<segment>…]` and is re-validated through the landed id
 * wall, so an over-long derivation is refused there rather than truncated here.
 * @param {unknown} input @returns {SupportSurfaceRefRecord}
 */
export function supportSurfaceRef(input) {
  const source = requireCanonicalRecord(input, 'supportSurfaceRef input');
  const kind = requireVocabularyMember(
    source.kind, SUPPORT_SURFACE_KINDS, 'supportSurfaceRef.kind',
  );
  if ('surfaceId' in source) {
    throw new TypeError('supportSurfaceRef.surfaceId is DERIVED and may not be supplied: SPEC'
      + ' §10.5 requires a deterministic owner-qualified key, not a free alias');
  }
  const grammar = SUPPORT_SURFACE_GRAMMAR[kind];
  if (grammar.segments === null) {
    throw new TypeError(`supportSurfaceRef cannot construct ${kind} in this era: it names a`
      + ' pre-existing support-OPERATION ref, and the operation seam is blocked behind the ODQ'
      + ' §299.3c chair ruling (MF-T2S); the kind stays in the closed vocabulary and this arm'
      + ' becomes a construction in the member that lands that seam');
  }
  for (const field of Object.keys(source)) {
    if (field !== 'kind' && !grammar.segments.includes(field)) {
      throw new TypeError(`supportSurfaceRef.${field} is not a field of ${kind}, which takes`
        + ` exactly: ${grammar.segments.join(', ')}`);
    }
  }
  const values = grammar.segments.map(
    (field) => requireKeySegment(source[field], `supportSurfaceRef.${field}`),
  );
  const surfaceId = requireCanonicalId(
    `support:${grammar.token}:${values.join(':')}`, 'supportSurfaceRef derived surfaceId',
  );
  /** @type {Record<string, string>} */
  const branch = {};
  grammar.segments.forEach((field, index) => { branch[field] = values[index]; });
  return deepFreezeCanonical({ kind, surfaceId, ...branch });
}

/**
 * Fill `depths` for one part and every ancestor on its support chain, memoised across calls.
 * ⛔ A cycle is refused NAMING ITS MEMBER IDS, and self-support is the length-1 case of the same
 * walk rather than a second guard. The unwind carries the depth in an accumulator rather than
 * re-reading the map, so no lookup here can answer "absent" and be silently read as zero.
 * @param {string} partId @param {Map<string, string|null>} owners @param {Map<string, number>} depths
 * @returns {void}
 */
function fillSupportDepths(partId, owners, depths) {
  /** @type {string[]} */
  const chain = [];
  let cursor = partId;
  while (!depths.has(cursor)) {
    const seenAt = chain.indexOf(cursor);
    if (seenAt !== -1) {
      throw new TypeError('assertSupportAcyclicity found a support cycle through'
        + ` ${chain.slice(seenAt).join(', ')}: support ownership forms one acyclic DAG (SPEC`
        + ' §10.5) and a part cannot support itself or any ancestor it already depends on');
    }
    chain.push(cursor);
    const owner = owners.get(cursor) ?? null;
    if (owner === null) { depths.set(cursor, 0); chain.pop(); break; }
    cursor = owner;
  }
  // `cursor` is in `depths` on both exits — the loop's own condition, or the root branch above.
  let depth = depths.get(cursor) ?? 0;
  for (let index = chain.length - 1; index >= 0; index -= 1) {
    depth += 1;
    depths.set(chain[index], depth);
  }
}

/**
 * ⭐⭐ §10.5's ACYCLICITY LAW, EXECUTABLE THIS ERA. No phase registry exists, so the law cannot
 * live in a validator-of-a-registry — but it lives perfectly as a pure function over a
 * caller-supplied roster, which is also the exact shape the first persisting member calls at
 * publication time. Returns `{orderedPartIds}` with supports strictly before dependents; the order
 * is INPUT-INDEPENDENT (depth, then codepoint) so the same roster in any array order yields the
 * same answer.
 * @param {unknown} parts nonempty `[{partId, support}]`, `support` from `supportSurfaceRef`
 * @returns {Readonly<{ orderedPartIds: readonly string[] }>}
 */
export function assertSupportAcyclicity(parts) {
  if (!Array.isArray(parts) || parts.length === 0) {
    throw new TypeError('assertSupportAcyclicity.parts must be a nonempty array of'
      + ' {partId, support} records');
  }
  /** @type {Map<string, string|null>} */
  const owners = new Map();
  parts.forEach((part, index) => {
    const label = `assertSupportAcyclicity.parts[${index}]`;
    const source = requireCanonicalRecord(part, label);
    const partId = requireCanonicalId(source.partId, `${label}.partId`);
    if (owners.has(partId)) {
      throw new TypeError(`${label} repeats partId ${JSON.stringify(partId)}: a support roster is`
        + ' uniquely keyed (the SPEC §10.5 identity law)');
    }
    const support = requireCanonicalRecord(source.support, `${label}.support`);
    const kind = requireVocabularyMember(
      support.kind, SUPPORT_SURFACE_KINDS, `${label}.support.kind`,
    );
    const owned = SUPPORT_SURFACE_GRAMMAR[kind].segments === MASSING_OWNED_SEGMENTS;
    owners.set(partId, owned
      ? requireCanonicalId(support.ownerPartId, `${label}.support.ownerPartId`) : null);
  });
  for (const [partId, ownerPartId] of owners) {
    if (ownerPartId !== null && !owners.has(ownerPartId)) {
      throw new TypeError(`assertSupportAcyclicity: ${JSON.stringify(partId)} rests on`
        + ` ${JSON.stringify(ownerPartId)}, which does not resolve in the roster —`
        + ' EXTERNAL_MASSING_PHASE is OUT this era, so an unresolved owner is an error and never'
        + ' silently a root');
    }
  }
  /** @type {Map<string, number>} */
  const depths = new Map();
  for (const partId of owners.keys()) fillSupportDepths(partId, owners, depths);
  const orderedPartIds = [...owners.keys()].sort((left, right) => {
    const byDepth = (depths.get(left) ?? 0) - (depths.get(right) ?? 0);
    if (byDepth !== 0) return byDepth;
    if (left === right) return 0;
    return left < right ? -1 : 1;
  });
  return deepFreezeCanonical({ orderedPartIds });
}

/**
 * ⭐⭐ ONE COMPONENT SLOT ON THE TOTAL AXIS (SPEC §6.4.1). `PRESENT` owns exactly one component;
 * `NONE` carries a closed structural reason; `UNKNOWN` carries an `UnknownMaterialFact` reason.
 * ⛔ Any other status is REFUSED, never defaulted — a total axis with a silent fallback is not
 * total. ⛔ AND THE NO-INFERENCE LAW IS STRUCTURAL IN BOTH DIRECTIONS: a `NONE`/`UNKNOWN` slot
 * carrying a `materialId` is refused, because a value that exists can feed a value-conditioned
 * resolver and the strongest guarantee is for it not to exist; a `PRESENT` slot carrying a
 * `reason` is refused symmetrically.
 * @param {unknown} input @returns {ComponentSlotRecord}
 */
export function componentSlot(input) {
  const source = requireCanonicalRecord(input, 'componentSlot input');
  const slotId = requireCanonicalId(source.slotId, 'componentSlot.slotId');
  const role = requireVocabularyMember(source.role, COMPONENT_SLOT_ROLES, 'componentSlot.role');
  const status = source.status;
  if (status === 'PRESENT') {
    if ('reason' in source) {
      throw new TypeError('componentSlot PRESENT must carry no reason: a present component is'
        + ' named by its material, and an absence reason beside it states two things at once');
    }
    const materialId = requireCanonicalId(source.materialId, 'componentSlot.materialId');
    return deepFreezeCanonical({ slotId, role, status: 'PRESENT', materialId });
  }
  if (status === 'NONE' || status === 'UNKNOWN') {
    if ('materialId' in source) {
      throw new TypeError(`componentSlot ${status} must carry no materialId: a value that exists`
        + ' can feed a value-conditioned resolver (the no-inference law)');
    }
    const reason = requireVocabularyMember(
      source.reason,
      status === 'NONE' ? MATERIAL_ABSENCE_REASONS : MASSING_UNKNOWN_REASONS,
      `componentSlot ${status}.reason`,
    );
    return deepFreezeCanonical({ slotId, role, status, reason });
  }
  throw new TypeError("componentSlot.status must be exactly 'PRESENT', 'NONE' or 'UNKNOWN'");
}

/**
 * ⭐ THE ROSTER (SPEC §6.4.1): *"every part carries one nonempty, uniquely keyed
 * `MaterialSlotDisposition` roster"*. Slots are constructed INTERNALLY through `componentSlot` —
 * one construction route, so no half-validated slot can circulate. ⛔ Role uniqueness is
 * deliberately NOT required: the SPEC's own roof contract has plural structural slots.
 * @param {unknown} input @returns {Readonly<{ ownerPartId: string, slots: readonly ComponentSlotRecord[] }>}
 */
export function componentSlotRoster(input) {
  const source = requireCanonicalRecord(input, 'componentSlotRoster input');
  const ownerPartId = requireCanonicalId(source.ownerPartId, 'componentSlotRoster.ownerPartId');
  const given = source.slots;
  if (!Array.isArray(given) || given.length === 0) {
    throw new TypeError('componentSlotRoster.slots must be a nonempty array of slot inputs');
  }
  /** @type {Set<string>} */
  const seen = new Set();
  const slots = given.map((slotInput, index) => {
    const slot = componentSlot(slotInput);
    if (seen.has(slot.slotId)) {
      throw new TypeError(`componentSlotRoster.slots[${index}] repeats slotId`
        + ` ${JSON.stringify(slot.slotId)}: the roster is uniquely keyed (SPEC §6.4.1)`);
    }
    seen.add(slot.slotId);
    return slot;
  });
  return deepFreezeCanonical({ ownerPartId, slots });
}
