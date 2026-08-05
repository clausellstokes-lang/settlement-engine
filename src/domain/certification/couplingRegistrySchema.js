/**
 * domain/certification/couplingRegistrySchema.js — CW-0's registry schema: the
 * row shape, the freeze factory, and the schema version, shared by every
 * per-volume row leaf.
 *
 * CW-0w slice 1 lifted this out of couplingRegistry.js so the growing family
 * has ONE import target that is not a row leaf and not the composing head. The
 * head (couplingRegistry.js) re-exports the version and composes the leaves;
 * each volume's leaf (couplingRegistryWar.js, and its future siblings) imports
 * `couplingRow` from HERE. That direction is one-way on purpose: a leaf that
 * imported the head would close a module cycle, and this estate has already
 * paid once for a chunk-cycle TDZ that made dist un-bootable.
 *
 * Pure data plus pure lookup only: no state, writer, clock, or randomness.
 *
 * @enforced-by tests/domain/couplingRegistry.test.js
 */

/**
 * v3 (CW-0w slice 3) adds the OPTIONAL `kinds[]` — the Herald kinds a coupling
 * mints, which is the row-to-routing join the desk walker needs and v2 lacked.
 * Optional means ABSENT, never empty: an empty array is a key and a key is a
 * byte (the T4 discipline, applied to source data). Deriving kinds from the
 * receiptField string instead would be word-association by another name and is
 * refused on the moverFamilyOf precedent — but the desk walker DOES scan
 * receiptFields for undeclared kinds, so a row cannot dodge the join by simply
 * declining to declare one.
 */
export const COUPLING_REGISTRY_SCHEMA_VERSION = 3;

/**
 * @typedef {Object} CouplingRegistryRow
 * @property {string} couplingId
 * @property {string} pairId
 * @property {string} direction
 * @property {string} read
 * @property {string} receiptField
 * @property {string} counterforce
 * @property {ReadonlyArray<string>} flags
 * @property {string} owningVolume
 * @property {string} owningWave
 * @property {string} intendedDesk
 * @property {ReadonlyArray<string>} [kinds] Herald kinds this coupling mints,
 *   omitted entirely when it mints none.
 */

/**
 * Freeze one row and its list fields together. A coupling row is evidence, not
 * a runtime switchboard, so callers may inspect it but can never retune it.
 *
 * @param {CouplingRegistryRow} row
 * @returns {Readonly<CouplingRegistryRow>}
 */
export function couplingRow(row) {
  const frozen = { ...row, flags: Object.freeze([...row.flags]) };
  if (frozen.kinds !== undefined) frozen.kinds = Object.freeze([...frozen.kinds]);
  return Object.freeze(frozen);
}
