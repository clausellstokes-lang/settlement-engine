/**
 * livingContentRoster.js — the INERT roster of reviewed living-content
 * definitions that were in scope for one generation run.
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
 *   • Nothing in `src/` reads this key. It is regression-grade by construction,
 *     and saying so plainly is the honest reading rather than a gap.
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
import { LIVING_CONTENT_BUCKETS, materializesLivingContent } from './livingContentLaw.js';

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
