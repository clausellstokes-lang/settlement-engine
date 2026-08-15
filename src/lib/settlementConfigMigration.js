/**
 * settlementConfigMigration.js — MG-3f (leak L8): THE ONE WRITER of the saved-config
 * forward migration.
 *
 * THE LEAK: the `magicExists` inference — "a save written before the magic axis existed
 * has magic iff its priority dial is non-zero" — was spelled out THREE times across the
 * tree, not the two the register found:
 *
 *   • src/components/settlements/helpers.js   (the live saves-panel path)
 *   • src/components/SettlementDetail.jsx     (a zero-caller copy that had already
 *                                              rotted into dead code)
 *   • src/components/generate/FoundingWorlds.jsx (a DELIBERATE inline copy, whose own
 *                                              comment records why: importing the
 *                                              saves-panel helper set dragged that whole
 *                                              module into a lazy create-surface chunk
 *                                              and pushed bytes toward the first-paint
 *                                              closure)
 *
 * A rule with three homes has no home. It decides whether a legacy settlement is
 * magical AT ALL — the single most load-bearing bit in the realm magic toggle's world —
 * and a change to one copy would silently fork the others, which is exactly the drift
 * the single-writer law exists to prevent.
 *
 * WHY A NEW LEAF RATHER THAN "JUST IMPORT THE HELPER": the third copy's rationale was
 * REAL, not laziness. This module dissolves it instead of living with it — it carries
 * the migration and NOTHING else, so importing it costs a create-surface chunk two
 * statements' worth of bytes rather than the entire saves-panel helper set. The
 * chunk-shape objection that justified the fork no longer applies to anyone.
 *
 * Pure, dependency-free, and byte-for-byte the behaviour all three copies shared — this
 * consolidation changes no output, only the number of places the rule can drift from.
 */

/**
 * Upgrade an old saved settlement config to the current schema. Safe to call on any
 * save, any number of times (idempotent), and never mutates its input.
 *
 * The magic inference is the load-bearing line: a config written before `magicExists`
 * existed is read as magical exactly when its priority dial is non-zero, with the
 * historical default of 50 for a dial that was never written either. An EXPLICIT
 * `magicExists` — including the realm magic toggle's projected `false` — is always
 * left exactly as the save carries it.
 *
 * @param {Record<string, any> | null | undefined} config
 * @returns {Record<string, any>}
 */
export function migrateSettlementConfig(config) {
  if (!config) return {};
  const c = { ...config };
  if (c.magicExists === undefined) c.magicExists = (c.priorityMagic ?? 50) > 0;
  if (!c.nearbyResourcesState) c.nearbyResourcesState = {};
  return c;
}
