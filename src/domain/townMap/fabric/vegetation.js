/**
 * domain/townMap/fabric/vegetation.js — MF-T2L · ODQ §287.5 · SPEC §10.6 / §10.5 ·
 * ⭐⭐ VEGETATION IS A MASS, AND ITS FIELD IS A LAW RATHER THAN A LIST. Both halves of §287.5's
 * vegetation sentence — *"vegetation gains a durable selectable trunk/canopy mass plus a separate
 * deterministic nonpersistent instance field"* — in one leaf, because a member that lands only the
 * durable mass has landed half a contract and made the other half harder.
 *
 * ⭐⭐ THIS IS A MINT, NOT A PORT, AND THAT WAS MEASURED. The sealed W3 sandbox carries ZERO
 * vegetation modules: its entire tree surface is PRESENTATION (`groundDress.js` stipples canopy
 * dots and winter bare-tree ticks; the legacy `TreeSymbols`/`ForestsLayer` components are paint).
 * That is the volume's own two-contracts law already lived by the sandbox — land-use texture
 * *"cannot mint population, density, species, phenology or a `VegetationInstanceField`"* — so the
 * sources here are SPEC §10.6's contract and the landed substrate, and there was nothing to port.
 *
 * ⭐⭐ THE ERA-SLICE LAW, INHERITED WHOLE FROM MF-T2E: AN UNVALIDATABLE REQUIRED FIELD IS WORSE
 * THAN AN ABSENT ONE. SPEC §10.6's full contract resolves through registries this era does not
 * have — `CanonicalVegetationPhase`, `CanonicalVegetationAggregate` authority, the recipe and
 * species registries, `ArtifactHashRef`, epochs, provenance, the opacity-band manifest. This
 * module therefore mints the D3a-core slice: the closed phenology vocabulary, the mass whose
 * trunk and canopy are REAL landed `solidPartQ` volumes on ONE derived support key, the anchor
 * equalities made structural, the field record over the region law the foundation already
 * published, and the deterministic derivation that makes "nonpersistent" a behaviour instead of
 * an adjective. The field NAMES are the SPEC's, so the registry era ADDS fields and renames
 * nothing.
 *
 * ⭐⭐ ONE GROUND AUTHORITY, AND IT IS A STRUCTURAL IMPOSSIBILITY RATHER THAN A CHECK. SPEC §10.6:
 * *"`VegetationMass` has no second support: all placement reads `trunk.support`… Support truth
 * rejects any consumer or serialized cache that gives trunk and canopy different ground
 * authority."* The constructor RE-DERIVES the caller's support record through MF-T2K's own
 * `supportSurfaceRef` and refuses a record whose `surfaceId` disagrees, naming both keys — so a
 * hand-built alias wearing K's record shape cannot pass, and K's blocked-kind refusal and segment
 * grammar arrive free from the same call. The one derived key is then threaded into BOTH solids
 * and neither the trunk nor the canopy input may carry a key of its own. Trunk and canopy cannot
 * disagree because only one key exists in scope.
 *
 * ⛔ R-MF-2, ANSWERED HEAD-ON RATHER THAN WAVED AT (preamble §P1). This leaf MULTIPLIES NO QUANTA.
 * Its only coordinate arithmetic is `minX + (uint32 % widthQ)`: `hash32` is a pure `xmur3`
 * returning `h >>> 0`, so the left operand of the modulo is a non-negative integer below 2**32 and
 * the remainder lies in `[0, widthQ)`; `minX` and `widthQ` are wall-validated integers, and the
 * sum is bounded by `maxX`. Every intermediate is a safe integer and no product of ABI quanta is
 * formed anywhere, so the sign-flip class R-MF-2 measures has no surface here.
 * ⛔ `hashUnit`/`hashInt` are deliberately NOT used: both route through a float divide by 2**32,
 * and a float has no business touching a published quantum even where the result would round
 * back. The integer-modulo spelling makes the question unaskable.
 *
 * ⛔ WHAT THIS MEMBER DELIBERATELY DOES NOT DO.
 *   · No `CanonicalVegetationAggregate`, no EXPLICIT_CANON/RSLP authority arms, no population
 *     disposition, no density law, no rounding law, no subdivision/conservation/mixed-stand law
 *     and no `SINGLE_FIELD_EXACT_REGION` enforcement. Those bind field↔aggregate PAIRS and arrive
 *     with the aggregate member; §10.6's materialisation law admits the KNOWN-COUNT arm, which is
 *     the arm this era can execute, and half-minting a disposition axis on the field would put a
 *     second vocabulary in the wrong place.
 *   · No recipe registry and so no DERIVED `fieldKey`. The SPEC's `DerivationKey` derives from the
 *     aggregate and recipe refs, which do not exist; a coordinate-derived stand-in would be
 *     determinism theatre AND would embed signed quanta into id grammar. The key is a
 *     wall-validated id this era, exactly as MF-T2E's `supportSurfaceId` was before MF-T2K derived
 *     it — and that arc is the point: the aggregate member owns the derivation flip, and because
 *     the field name is the SPEC's the migration is upward-compatible.
 *   · No `recipeId`/`lawVersion`/`effectiveAt`/`artifactId`/`contentHash`/`provenanceRef` stamp on
 *     any record. These are validated IN-MEMORY vocabulary under MF-T2E's ratified resolution (ODQ
 *     §348); the first persisting member mints the stamps against the then-complete shape.
 *   · No `CanonicalVegetationPhase`, no `VegetationObservation`, no opacity bands, no phenology
 *     MOTION. Seasons move observations, never durable geometry; `phenologyClass` here is the
 *     durable CLASS only.
 *   · No promotion. §10.6 routes promoting an instance to a real mass through *"a declared
 *     operation"*, and the operation seam sits behind the ODQ §299.3c chair ruling (MF-T2S). No
 *     constructor here converts an instance into a mass.
 *   · No epoch fields — no epoch substrate is landed and its member owns them.
 *   · No canopy shell machinery: no `closedShell`/`SolidQ` (no shell substrate exists this era, so
 *     the canopy volume takes massPart's own era slice of the SPEC's shelled solid under a landed
 *     field name — naming a `SolidPartQ` `closedShell` would force a TYPE swap on a SPEC name
 *     later, which the add-only contract forbids), no `receiverSurfacePatchIds` (§288 is DORMANT
 *     and its member owns receiver resolution), no `bounds` cache, and no `offsetXYQ` — its
 *     shell-agreement law needs a ring reference point the era cannot define, and an unvalidatable
 *     required field is worse than an absent one.
 *   · No polygonal region and no point-in-polygon geometry. The era region is the canonical
 *     axis-aligned rectangle the landed `canonicalRectBounds` already publishes as the first
 *     tranche's law; broader planar-face support belongs to the member that ports the geometry
 *     kernel's region machinery.
 *   · No second spelling of anything landed: no ring validation, no interval law, no freeze
 *     helper, no overlap predicate, no key derivation, no hash primitive. The internal
 *     `requireVocabularyMember` copy follows the massPart/supportSurface precedent of an
 *     unexported helper.
 *   · No tuning constant of any kind. ⭐ The instance derivation has ZERO free parameters — no
 *     spacing, density, jitter or shape dial exists anywhere in it — which is what keeps this
 *     member off THE PROMISE's owner-signature surface (preamble §P2.5).
 *
 * ⛔ THE IMPORT CLOSURE IS A DESIGN CONSTRAINT, NOT AN ACCIDENT. This leaf imports EXACTLY
 * `./foundation.js`, `./massPart.js`, `./supportSurface.js` and `./fabricRng.js`.
 * `tests/lint/townMapStageManifest.walker.test.js` freezes `FOUNDATION_READERS` over the whole
 * fabric directory, and the four modules it tracks are `coordinateAbi.js`, `solidLegality.js`,
 * `spatialReceipt.js` and `stageManifest.js` — none of them needed here. There is no ABI stamp to
 * mint (`solidPartQ` stamps `abiVersion` itself) and the legality predicate is the ACCEPTANCE
 * FILE's consumer, never this leaf's. Importing either would owe a roster edit inside another
 * member's reserved file for zero behaviour.
 *
 * ⚠ DORMANT BY DESIGN (preamble §P2.1). No landed module imports this file, it carries no barrel
 * row, and nothing persists these records. That is the member's declared state, not an oversight.
 *
 * PURITY: pure over arguments; string, array and integer handling plus the landed calls. No clock,
 * no randomness beyond the keyed hash of the caller's own strings, no locale ordering, no
 * iteration-order dependence; fields are written in fixed literal order and no spread of caller
 * input reaches a published record.
 */

import {
  canonicalRectBounds, deepFreezeCanonical, requireCanonicalId, requireCanonicalInt,
  requireCanonicalRecord,
} from './foundation.js';
import { solidPartQ } from './massPart.js';
import { supportSurfaceRef } from './supportSurface.js';
import { hash32 } from './fabricRng.js';

/** SPEC §10.6's phenology union, verbatim and in SPEC order (4). Closed. */
export const VEGETATION_PHENOLOGY_CLASSES = Object.freeze([
  'EVERGREEN', 'DECIDUOUS', 'DROUGHT_DECIDUOUS', 'BARREN',
]);

/**
 * ⭐ THE ERA INSTANCE-DERIVATION LAW'S VERSION STAMP (the `FABRIC_FOUNDATION_LAW_VERSION`
 * precedent). It is part of every derivation basis, so when the recipe registry arrives and real
 * recipes supersede this law, the successor cannot do it silently: instance positions MOVE, and
 * that is a DECLARED SHIFT priced in the packet that lands the recipes. Naming it now is what
 * makes it a declaration instead of a surprise.
 */
export const VEGETATION_FIELD_LAW_VERSION = 'mf-vegfield-era-uniform-rect-v1';

/** The exact field sets. A record that is missing one, or carries one more, is refused. */
const MASS_FIELDS = Object.freeze([
  'bodyId', 'support', 'trunk', 'canopy', 'canopyAnchor', 'phenologyClass',
]);
const TRUNK_FIELDS = Object.freeze(['partId', 'footprint', 'vertical']);
const CANOPY_FIELDS = Object.freeze(['canopyId', 'speciesClassId', 'footprint', 'topQ']);
const ANCHOR_FIELDS = Object.freeze(['trunkPartId', 'baseHeightAboveSupportQ']);
const FIELD_FIELDS = Object.freeze([
  'fieldKey', 'supportRegion', 'instanceCount', 'speciesClassId', 'phenologyClass',
]);

/** @typedef {Readonly<{ fieldKey: string, supportRegion: Array<[number, number]>,
 *    instanceCount: number, speciesClassId: string, phenologyClass: string }>}
 *    VegetationInstanceFieldRecord */

/**
 * Membership in a CLOSED vocabulary, with the guard-the-guard arm first: an empty or non-array
 * vocabulary is itself the defect, because a membership test against nothing admits everything.
 * ⛔ Internal and unexported, exactly as in `massPart.js` and `supportSurface.js` — a second
 * exported membership helper in this directory is what the single-declaration law refuses.
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
 * ⛔ THE EXACT FIELD SET — one door, in both directions. A missing field and an extra field are
 * the same defect wearing two faces, and `supportSurfaceId` gets its own sentence because a caller
 * who reaches this refusal has tried to open the second ground authority §10.6 forbids.
 * @param {unknown} value @param {readonly string[]} fields @param {string} label
 * @returns {Record<string, unknown>}
 */
function requireExactFields(value, fields, label) {
  const source = requireCanonicalRecord(value, label);
  for (const field of fields) {
    if (!(field in source)) {
      throw new TypeError(`${label} must carry ${field}: it takes exactly ${fields.join(', ')}`);
    }
  }
  for (const field of Object.keys(source)) {
    if (fields.includes(field)) continue;
    throw new TypeError(field === 'supportSurfaceId'
      ? `${label}.supportSurfaceId may not be supplied: a VegetationMass has ONE ground authority,`
        + ' and the key derived from its own support record is threaded into the trunk and the'
        + ' canopy alike, so the two cannot be given different ground (SPEC §10.6 support truth)'
      : `${label}.${field} is not a field of this record, which takes exactly:`
        + ` ${fields.join(', ')}`);
  }
  return source;
}

/**
 * ⭐⭐ THE DURABLE MASS — half one. One typed support in, one derived key threaded everywhere, and
 * two REAL landed `solidPartQ` volumes constructed internally, so no half-validated solid can
 * circulate. §10.5's identity law (*"A `VegetationMass.trunk.partId` … equals its
 * `canopyAnchor.trunkPartId`"*) is refused naming both ids. The canopy's vertical base IS the
 * anchor's `baseHeightAboveSupportQ` — derived rather than validated, because a field with one
 * writer cannot mismatch — and `verticalIntervalQ`'s strictly-positive-measure law then refuses a
 * canopy that would close below its own anchor, free, from the landed spelling. `ownerBodyId` and
 * `kind` are WRITTEN, never accepted, for the same reason.
 * @param {unknown} input @returns {Readonly<Record<string, unknown>>}
 */
export function vegetationMass(input) {
  const source = requireExactFields(input, MASS_FIELDS, 'vegetationMass input');
  const bodyId = requireCanonicalId(source.bodyId, 'vegetationMass.bodyId');
  const phenologyClass = requireVocabularyMember(
    source.phenologyClass, VEGETATION_PHENOLOGY_CLASSES, 'vegetationMass.phenologyClass',
  );
  const given = requireCanonicalRecord(source.support, 'vegetationMass.support');
  const claimed = requireCanonicalId(given.surfaceId, 'vegetationMass.support.surfaceId');
  /** @type {Record<string, unknown>} */
  const branch = {};
  for (const field of Object.keys(given)) if (field !== 'surfaceId') branch[field] = given[field];
  const { surfaceId } = supportSurfaceRef(branch);
  if (surfaceId !== claimed) {
    throw new TypeError(`vegetationMass.support.surfaceId ${JSON.stringify(claimed)} is not the`
      + ` key its own branch derives, ${JSON.stringify(surfaceId)}: SPEC §10.5 requires a`
      + ' deterministic owner-qualified key, not a free alias, so the record is re-derived here'
      + ' and an alias cannot enter by wearing the right shape');
  }
  const trunkSource = requireExactFields(source.trunk, TRUNK_FIELDS, 'vegetationMass.trunk');
  const trunk = solidPartQ({
    partId: trunkSource.partId,
    supportSurfaceId: surfaceId,
    footprint: trunkSource.footprint,
    vertical: trunkSource.vertical,
  });
  const anchorSource = requireExactFields(
    source.canopyAnchor, ANCHOR_FIELDS, 'vegetationMass.canopyAnchor',
  );
  const trunkPartId = requireCanonicalId(
    anchorSource.trunkPartId, 'vegetationMass.canopyAnchor.trunkPartId',
  );
  if (trunkPartId !== trunk.partId) {
    throw new TypeError(`vegetationMass.canopyAnchor.trunkPartId ${JSON.stringify(trunkPartId)}`
      + ` must equal vegetationMass.trunk.partId ${JSON.stringify(trunk.partId)}: a canopy anchor`
      + ' names the trunk it hangs on, and that trunk is uniquely owned by this vegetation body'
      + ' (SPEC §10.5)');
  }
  const baseHeightAboveSupportQ = requireCanonicalInt(
    anchorSource.baseHeightAboveSupportQ, 'vegetationMass.canopyAnchor.baseHeightAboveSupportQ',
  );
  const canopySource = requireExactFields(source.canopy, CANOPY_FIELDS, 'vegetationMass.canopy');
  const canopyId = requireCanonicalId(canopySource.canopyId, 'vegetationMass.canopy.canopyId');
  const speciesClassId = requireCanonicalId(
    canopySource.speciesClassId, 'vegetationMass.canopy.speciesClassId',
  );
  const solid = solidPartQ({
    partId: canopyId,
    supportSurfaceId: surfaceId,
    footprint: canopySource.footprint,
    vertical: { baseQ: baseHeightAboveSupportQ, topQ: canopySource.topQ },
  });
  return deepFreezeCanonical({
    bodyId,
    kind: 'VEGETATION',
    trunk,
    canopy: { canopyId, ownerBodyId: bodyId, speciesClassId, solid },
    canopyAnchor: { trunkPartId, baseHeightAboveSupportQ },
    phenologyClass,
  });
}

/**
 * ⭐⭐ THE INSTANCE FIELD — half two's record. §10.6's materialisation law admits a field only when
 * its aggregate supplies *"a known count … and one known species class and one known phenology
 * class"*; no aggregate, density law or rounding registry exists this era, so this is the
 * KNOWN-COUNT arm and the other arms are named OUT in the docblock rather than half-minted.
 * The region goes through the landed `canonicalRectBounds`, whose own docblock is this era's
 * region law — *"The first tranche deliberately admits a canonical axis-aligned rectangle only"* —
 * and which refuses zero measure, so a degenerate field cannot exist. A count of ZERO is admitted:
 * a felled stand is a known emptiness, and every index against it is refused by name.
 * ⭐ The record re-validates its own output, so the instance derivation can re-check a
 * caller-held field without a second spelling of any of this.
 * @param {unknown} input @returns {VegetationInstanceFieldRecord}
 */
export function vegetationInstanceField(input) {
  const source = requireExactFields(input, FIELD_FIELDS, 'vegetationInstanceField input');
  const fieldKey = requireCanonicalId(source.fieldKey, 'vegetationInstanceField.fieldKey');
  const region = canonicalRectBounds(
    source.supportRegion, 'vegetationInstanceField.supportRegion',
  );
  const instanceCount = requireCanonicalInt(
    source.instanceCount, 'vegetationInstanceField.instanceCount', 0,
  );
  const speciesClassId = requireCanonicalId(
    source.speciesClassId, 'vegetationInstanceField.speciesClassId',
  );
  const phenologyClass = requireVocabularyMember(
    source.phenologyClass, VEGETATION_PHENOLOGY_CLASSES, 'vegetationInstanceField.phenologyClass',
  );
  return deepFreezeCanonical({
    fieldKey, supportRegion: region.ring, instanceCount, speciesClassId, phenologyClass,
  });
}

/**
 * ⭐⭐ THE INSTANCES — half two's BEHAVIOUR, and the reason "nonpersistent" is a structural fact
 * here rather than an adjective. §10.6: *"individual instances are regenerated from `(fieldKey,
 * instanceIndex)`, carry no entity id, are not individually persisted or selectable, and cannot be
 * named by a domain receipt."*
 *
 * ⛔ THE RECORD HAS NO ID FIELD OF ANY KIND — no `bodyId`, no `entityId`, no `instanceId`, no
 * `artifactId` — so it cannot be selected, persisted or named by a receipt even by a confused
 * consumer. The strongest guarantee is for the value not to exist (MF-T2E's UNKNOWN-carries-no-
 * value law, applied to identity itself).
 *
 * The position is the landed `hash32` of a VERSIONED basis, folded into the region by integer
 * modulo, so containment in the half-open `[minX, maxX) × [minZ, maxZ)` rect holds BY
 * CONSTRUCTION rather than by test alone. Same `(field, index)`, same frozen record, forever.
 * @param {unknown} field a `vegetationInstanceField` record (re-validated here)
 * @param {unknown} instanceIndex @returns {Readonly<Record<string, unknown>>}
 */
export function vegetationFieldInstance(field, instanceIndex) {
  const checked = vegetationInstanceField(field);
  if (checked.instanceCount === 0) {
    throw new TypeError('vegetationFieldInstance cannot index the field'
      + ` ${JSON.stringify(checked.fieldKey)}: its instanceCount is 0, so the stand is known to be`
      + ' empty and there is no instance for any index to regenerate');
  }
  const region = canonicalRectBounds(
    checked.supportRegion, 'vegetationFieldInstance.field.supportRegion',
  );
  const index = requireCanonicalInt(
    instanceIndex, 'vegetationFieldInstance.instanceIndex', 0, checked.instanceCount - 1,
  );
  const basis = `${VEGETATION_FIELD_LAW_VERSION}:${checked.fieldKey}:${index}`;
  const xQ = region.minX + (hash32(`${basis}:x`) % region.widthQ);
  const zQ = region.minZ + (hash32(`${basis}:z`) % region.depthQ);
  return deepFreezeCanonical({
    fieldKey: checked.fieldKey,
    instanceIndex: index,
    positionQ: [xQ, zQ],
    speciesClassId: checked.speciesClassId,
    phenologyClass: checked.phenologyClass,
  });
}
