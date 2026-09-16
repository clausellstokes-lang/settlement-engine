/**
 * espionageGate.js — ES-0: the ONE door the espionage layer passes through.
 *
 * docs/DESIGN_FP_ARCH_ES.md §2. `espionageEnabled` is a VIRTUAL flag under the CQ5 law
 * (FP §3, CR-WR10-C): absent from DEFAULT_SIMULATION_RULES and from every preset spread,
 * so a campaign that never lights it pays ZERO persisted bytes for this layer; read
 * strictly with `=== true`, so ABSENT and FALSE are identical at every decision site;
 * and manifested in `ENGINE_GATED_VIRTUAL_RULE_KEYS` with its AUTHORED certification row
 * in the SAME COMMIT as this, its first real gate read. There is no manifest-without-row
 * state: manifesting is what makes a virtual key censusable, so manifesting is the act
 * that comes due.
 *
 * ⚠ THE GATE IS A CONJUNCTION AND EVERY DOOR IS PINNED SEPARATELY. Three conditions
 * must hold, and a test that only proves the last one has proven nothing about the first
 * two — a second guard silently covering a deleted first is the recorded defect this
 * estate has now been bitten by twice. tests/property/espionageDormancyFence.test.js
 * drops each door individually.
 *
 *   1. BELIEFS ARE LIVE (`beliefsActive`). Every product this layer will ever make is a
 *      belief write. A spy who returns to a world with no belief substrate has nowhere
 *      to put what he learned, so the layer is meaningless without it. Imported, never
 *      respelled — J-WR-10.
 *   2. THE ERRAND SPINE IS LIT (`errandSpineEnabled`). Covert missions ride SP-D's
 *      generalized errand row (J-ES-1); there is no espionage host without it.
 *      ⚠ THE `!== true` SPELLING IS DELIBERATE, NOT A STYLE SLIP. `errandSpineEnabled`
 *      is SP-D's flag and SP-D HAS NOT LANDED (measured at this commit: the key exists
 *      only as a declared-pending row in tradeConvergenceContract.js, nowhere in
 *      simulationRules.js). Writing this door as `=== true` would register a gate read
 *      for a key that owns no manifest entry and no certification row, and
 *      tests/lint/engineGatedRuleKeys.walker.test.js would red it as an unaccounted
 *      gated key — correctly, because that walker's whole job is to stop a subsystem
 *      from being gated invisibly. This lane does not get to manifest another lane's
 *      flag; it reads the negative form until SP-D lands its own CQ5 trio, at which
 *      point ES-1 flips the spelling in the commit that also lights the mint.
 *      ⏱ UPDATE, 2026-08-06 — SP-D HAS NOW LANDED (errandMint.js, its manifest entry
 *      and its certification row, one commit). The paragraph above is preserved as the
 *      record of why this door was written negatively, and the SPELLING IS DELIBERATELY
 *      UNCHANGED HERE: flipping it is ES-1's act, in the commit that mints the first
 *      covert errand, because this door is a LIGHTING-ORDER precondition and not a gate
 *      on SP-D's layer — `!== true` is exactly as strict as `=== true` (absent and false
 *      refuse identically), so nothing is loose in the meantime. What DID change is that
 *      the key is now real: it sits in ENGINE_GATED_VIRTUAL_RULE_KEYS, and both doors'
 *      polarities are pinned together in tests/property/errandSpineDormancyFence.test.js,
 *      whose downstream-seam block executes this gate in both flag states and proves the
 *      espionage family stays parked while the spine is dark.
 *      ⏱ UPDATE, 2026-08-09 (F-S1): the original header's promise that ES-1 would flip
 *      this spelling was SUPERSEDED, not executed — the certification row pins both
 *      polarities (=== true at the mint gate in errandMint.js, !== true here) as
 *      deliberate and permanent.
 *   3. THE FLAG ITSELF, BY NAME (`espionageEnabled === true`). BY NAME is the point:
 *      a frozen-list `REQUIRED_RULES.every(...)` conjunction is a COMPUTED member access
 *      and attributes to NO key at all, which is exactly how lane WW-A shipped a fully
 *      wired flag that the census could not see. One by-name strict read closes that
 *      hole for this family permanently.
 *
 * NOT WAR-GATED, and that is a design statement rather than an omission: none of the six
 * ENVOY_REQUIRED_RULES war flags enters this conjunction. Espionage serves ALL
 * statecraft, not war alone (the owner directive), and SP-D's generalized mint is
 * precisely what frees the errand from `envoyDiplomacyActive`'s six-flag weld.
 *
 * LIGHTING ORDER (FP §3's contract): `espionageEnabled` lights only AFTER
 * `errandSpineEnabled`. Out-of-order lighting is an invalid config, and it is invalid
 * SAFELY — door 2 refuses, so the layer stays dark rather than half-running.
 *
 * PURE: no rng, no clock, no store, no write.
 */
import { beliefsActive } from '../beliefMap.js';

/**
 * Is the espionage layer live for this world?
 *
 * @param {unknown} worldState
 * @returns {boolean}
 */
export function espionageActive(worldState) {
  if (!beliefsActive(/** @type {Parameters<typeof beliefsActive>[0]} */ (worldState))) return false;
  const rules = /** @type {{ simulationRules?: Record<string, unknown> }} */ (worldState)?.simulationRules;
  if (!rules || typeof rules !== 'object') return false;
  // Door 2 — see the header: the negative spelling is load-bearing until SP-D lands.
  if (rules.errandSpineEnabled !== true) return false;
  return rules.espionageEnabled === true;
}
