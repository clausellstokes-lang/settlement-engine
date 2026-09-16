/**
 * livingContentRoster.js — the INERT roster of reviewed living-content
 * definitions that were in scope for one generation run.
 *
 * ⭐⭐ THE LOADER HAS A CALLER NOW, AND THAT WAS THE LIGHTING DAY'S FIRST ACT
 * (lane LIGHT, car 1a). This paragraph used to read "THE LOADER HAS NO CALLER, SO
 * LIGHTING IT TAKES GENERATION DOWN" (§912, R-J — recorded, not cured), and it was
 * true: `loadLivingContentRoster` (`livingContentSeam.js`) is the only thing that
 * registers this module's builder, and nothing in `src/` invoked it, so a lit
 * config found no registered builder and THREW
 * `[livingContentSeam] v2 world, roster payload not loaded` out of
 * `generateSettlementPipeline` — not a leaky world, no world at all. The cure is
 * `loadGenerationLawPayloads()` in `src/domain/density/densityCreateBoundary.js`,
 * awaited by every main-thread module that can reach the pipeline, and the seam's
 * `loadLivingContentRoster()` itself in the two WORKER shells, which are held
 * under a byte ceiling the aggregate would cost them for nothing (car 3a);
 * `tests/lint/densityCreateBoundary.walker.test.js` holds that caller set to the
 * tree, per row and flatly, with the two worker rows declared by name, so the
 * outage cannot return silently.
 *
 * ⇒ AND THE OUTAGE, WHILE IT STOOD, WAS THE TRUE GROUND OF EVERY "THE ROSTER IS
 * INERT" CLAIM IN THIS ESTATE — the correction is kept rather than deleted,
 * because the second half of it still binds. The dial was never that ground: the
 * gate is `materializesLivingContent(settlement.config)` — the WORLD'S config, not
 * the build's dial — and a config carrying the marker can arrive from an import
 * file without any dial being moved. That is why the import boundaries below are
 * cured on their own account and not on the dial's. Tests that arm the seam
 * themselves (they call `registerLivingContentRosterBuilder` directly) were how a
 * real roster could be built at all while the loader was uncalled, which is why
 * the security arms could measure a drop on a build the product could not light.
 *
 * ⛔ WHAT THIS IS FOR. ODQ §866 found the presentation-neutrality instrument
 * vacuous for the `deities.*` cases; TE-INSTR-1 re-measured it and the vacuity
 * was twice as wide — 26 of 52 cases, four whole categories, one mechanism: the
 * reference pack's `stressors`, `factions`, `deities` and `traditions`
 * definitions never materialize into a generated settlement at all, so both
 * sides of every such case compare two settlements that are identical for a
 * reason with nothing to do with presentation neutrality. A claim about what a
 * field does not affect is worth nothing until the subject is demonstrably
 * there to affect something.
 *
 * ⭐⭐ MATERIALIZATION IS NOT ADOPTION, AND THE ENTIRE DESIGN IS THAT SENTENCE.
 * `tests/fixtures/customContentReferencePack.js` states the governing law in its
 * own header: the living-content definitions "deliberately have no automatic
 * activation event: their presence in a reviewed environment must not make a
 * generated settlement silently adopt a deity, faction, stressor, or
 * tradition." That law is obeyed here, not bent:
 *
 *   • This roster RECORDS. It does not activate, adopt, enrol, or empower.
 *   • It is written to ONE additive key, `settlement.customContentRoster`.
 *   • It NEVER writes `settlement.factions`, `settlement.stressors`,
 *     `settlement.traditions`, `config.primaryDeitySnapshot` or
 *     `config.cultDeitySnapshots` — the four MECHANICAL surfaces
 *     `settlementContentProvenance.js` already reads. Writing a custom
 *     definition into any of them is adoption, and adoption is a
 *     presentation→mechanical promotion of the F2c tripwire class. That
 *     promotion is OWNER-GATED and deliberately not taken;
 *     `tests/domain/livingContentMaterialization.test.js` pins the gap so
 *     crossing it reds rather than arriving quietly.
 *   • NO GENERATOR, MECHANIC OR SURFACE reads this key — it is regression-grade
 *     by construction, and saying so plainly is the honest reading rather than a
 *     gap. ⚠ AMENDED (lane L-MAT, O-11 path 2): there is now exactly ONE reader
 *     in `src/`, and it is a PORTABILITY reader rather than a consumer.
 *     `src/store/accountImportBody.js` reads the key on an imported settlement so
 *     `remapAccountSettlementLivingContentRoster` can rewrite its account-scoped
 *     identifiers into the receiving namespace — or, when the archive receipt
 *     cannot map them, delete the key and push a per-settlement warning. That is
 *     the same law the provenance receipt three lines above it obeys. Nothing
 *     reads the key for its CONTENT, which is the claim this bullet makes.
 *
 * ⚠ AND THE READER BULLET ABOVE NAMES ONE FILE WHERE THE TREE HAS TWO ASSIGNMENT
 * SITES (§912, from the skeptic pass's X8). `accountImportBody.js` writes this key
 * on the LIVE imported settlement and, since §912, again on every
 * `versionHistory[i].settlement` — because undo is a write path and restoring a
 * snapshot re-persists whatever it holds. Both sites obey the same remap-or-drop
 * law. Recorded here because `writerReach.walker` cannot see the second one: it
 * probes `read(row.writer)` for the register row's single declared writer, so a
 * green there says nothing about a second assignment site. The walker is NOT
 * widened for this — that is a separate instrument's car — and this sentence is
 * the interim record.
 *
 * ⛔ EVERY IMPORT BOUNDARY IS NOW CURED, AND HOW EACH ONE IS CURED DIFFERS BY
 * WHAT IT CAN RESOLVE (§912; this paragraph used to record the reconciliation gap
 * as a DEFERRAL, on an inertness ground that was false — the input to an import
 * boundary is a FILE, which is exactly where a roster comes from without any
 * dial, and an executed probe put a foreign roster through that path into
 * persistence).
 *   • ACCOUNT FILE (`accountImportBody.js`) — REMAPS through the archive receipt,
 *     or drops the whole record with a per-settlement warning. It is the only
 *     boundary with an archive-backed identity map, so it is the only one that
 *     can honestly rewrite ids.
 *   • RECONCILIATION (`importReconciliationAdmission.js`) — DROPS, with one
 *     reported `unsupported` issue per record. Measured: that source is an export
 *     file with no archive, no receipt and no pack, so the only identity map
 *     constructible there is empty and a remap would compute a foregone refusal.
 *   • GALLERY, both paths (`importScrub.js`'s `scrubGalleryImportLivingContent`) —
 *     DROPS, with `customContentProvenance` and the law marker, for the same
 *     reason: a dossier carries no archive to resolve source ids against.
 * `customContentProvenance` travels with this key on all three, which is the
 * pairing the earlier deferral asked for.
 *
 * ⛔ WHY THE ROWS CARRY ONLY MANIFEST-ADMITTED FIELDS. A roster that copied
 * whatever the author's object happened to hold would be an uncontrolled
 * widening of the persisted settlement shape, and would let an un-admitted key
 * ride into a saved world. Every row is therefore projected through
 * `CUSTOM_CONTENT_MANIFEST`: admitted authorable fields, in the manifest's own
 * declaration order, and nothing else.
 *
 * ⛔ WHY IDENTITY GOES THROUGH `projectCustomDefinitionIdentity`. That is the
 * estate's one home for the `customDefinition*` spelling, and it emits ONLY
 * `customDefinition*`-prefixed keys. That matters beyond tidiness: the
 * presentation-neutrality instrument's canonical projection strips exactly the
 * `customDefinition*` prefix, `localUid`, and each category's manifest-declared
 * presentation fields. A row spelled any other way — a bare `contentHash`, say —
 * would survive that strip and would make every one of the 26 cases FAIL the
 * neutrality half while appearing to fix the discovery half.
 *
 * Pure. No RNG, no store, no React, no wall clock. Built after every draw is
 * finished, so it cannot perturb a seeded run.
 */

import { compareCodepoint } from '../deterministicSort.js';
import {
  getCustomContentCategory,
} from './customContentManifest.js';
import {
  projectCustomDefinitionIdentity,
} from './customDefinitionIdentityProjection.js';
import { LIVING_CONTENT_BUCKETS } from './livingContentLaw.js';
// The gate is the dependency-free LEAF's, not the law file's and not the seam's
// — importing it from the seam is what closed the F29 cycle. See
// livingContentLawVersion.js.
import { materializesLivingContent } from './livingContentLawVersion.js';

/** The roster's own schema version, independent of the settlement's. An older
 *  saved world carries no roster at all, so this starts at 1 and a widening
 *  bumps it here rather than anywhere else. */
export const LIVING_CONTENT_ROSTER_SCHEMA_VERSION = 1;

/**
 * ⛔ THE FOUR MECHANICAL SURFACES THIS MODULE MUST NEVER WRITE.
 *
 * Named as data rather than left to prose, so the tripwire that enforces the
 * boundary and the module that respects it read the SAME list and cannot drift
 * apart. These are precisely the surfaces `settlementContentProvenance.js`'s
 * `materializedCandidates()` already scans for living-content definitions and
 * never finds any on — the readers exist, and keeping them empty is the
 * boundary, not an oversight.
 *
 * @type {ReadonlyArray<string>}
 */
export const LIVING_CONTENT_ADOPTION_SURFACES = Object.freeze([
  'config.cultDeitySnapshots',
  'config.primaryDeitySnapshot',
  'factions',
  'powerStructure.factions',
  'stressors',
  'traditions',
]);

/** @param {unknown} value @returns {Record<string, unknown>} */
function record(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {unknown[]} */
function array(value) {
  return Array.isArray(value) ? value : [];
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Project one authored definition into an inert roster row.
 *
 * Returns `null` for anything without a usable local identity: a row nothing
 * can be joined back to is noise in a persisted blob, and omitting it is
 * strictly better than persisting an anonymous one.
 *
 * @param {string} bucket
 * @param {unknown} value
 * @returns {Record<string, unknown>|null}
 */
function rosterRow(bucket, value) {
  const definition = record(value);
  const category = getCustomContentCategory(bucket);
  if (!category) return null;

  const identity = projectCustomDefinitionIdentity(definition);
  const localUid = text(definition.localUid);
  if (!localUid && !text(identity.customDefinitionId)) return null;

  /** @type {Record<string, unknown>} */
  const row = {
    // `source`/`isCustom` are what the estate's custom-content readers key on,
    // and what the neutrality instrument's projection uses to know which
    // presentation fields to strip from this row.
    source: 'custom',
    isCustom: true,
    customDefinitionCategory: bucket,
    ...(localUid ? { localUid } : {}),
    ...identity,
  };
  // Manifest declaration order, so two runs of the same pack serialize
  // identically and a field's position never depends on authoring order.
  for (const field of array(category.fields)) {
    const key = text(record(field).key);
    if (!key || !Object.hasOwn(definition, key)) continue;
    const authored = definition[key];
    if (authored === undefined) continue;
    row[key] = authored;
  }
  return row;
}

/**
 * Build the inert living-content roster for one generation run.
 *
 * Returns `null` — and therefore writes NO key at all — whenever the law is
 * dormant or the run had no living-content definition to record. That
 * same-reference dormancy is what makes a v1 world byte-identical to a world
 * generated before this module existed.
 *
 * @param {unknown} customContent  the run's custom-content snapshot
 * @param {Record<string, unknown>|null|undefined} config  the resolved config
 * @returns {Readonly<{
 *   schemaVersion:number,
 *   buckets:Readonly<Record<string, ReadonlyArray<Record<string, unknown>>>>,
 * }>|null}
 */
export function buildLivingContentRoster(customContent, config) {
  // THE GATE, AND IT IS THE FIRST THING THAT HAPPENS. A dormant run does not
  // read the pack, does not allocate, and returns the same `null` a run with no
  // pack at all returns — so a world that was lit, generated, and unlit again
  // is indistinguishable from one that was never lit.
  if (!materializesLivingContent(config)) return null;

  const content = record(customContent);
  /** @type {Record<string, ReadonlyArray<Record<string, unknown>>>} */
  const buckets = {};
  let rows = 0;
  // LIVING_CONTENT_BUCKETS is already in codepoint order; iterating it rather
  // than the pack's own key order keeps serialization independent of how the
  // snapshot was assembled.
  for (const bucket of LIVING_CONTENT_BUCKETS) {
    const projected = array(content[bucket])
      .map(definition => rosterRow(bucket, definition))
      .filter(row => row !== null);
    if (projected.length === 0) continue;
    projected.sort((left, right) => (
      compareCodepoint(
        text(left?.customDefinitionId) || text(left?.localUid),
        text(right?.customDefinitionId) || text(right?.localUid),
      )
    ));
    buckets[bucket] = Object.freeze(projected);
    rows += projected.length;
  }
  if (rows === 0) return null;

  return Object.freeze({
    schemaVersion: LIVING_CONTENT_ROSTER_SCHEMA_VERSION,
    buckets: Object.freeze(buckets),
  });
}
