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

/**
 * ── W-OPS DOOR 1 · THE INFILTRATION LADDER (DESIGN_W_OPS §6) ──────────────────
 *
 * `infiltrationDepthEnabled` is the second door DESIGN_W_OPS §6 charters, and it lives
 * HERE rather than in `infiltrationDepth.js` for a reason that leaf states in its own
 * header: every door-bearing export there takes an explicit `lit` ARGUMENT and returns
 * `null` when it is anything but `true`. The leaf is deliberately gate-free — three of
 * its suite's arms pin that it names neither `simulationRules` nor `=== true` — so the
 * module that RESOLVES `lit` from a world is the espionage family's one door module,
 * which is this one. That keeps the leaf pure and injected exactly as its charter says,
 * and keeps the estate's "one by-name read per key" law literal.
 *
 * ⛔ THE CONJUNCTION IS MEANT. The ladder deepens ES's own rooted dwell (the leaf
 * `extends` espionageMath#dwellRamp and espionageGauntlet#gatherOrGovernRead), so a lit
 * ladder over a dark espionage layer would be a depth reading on missions that cannot
 * exist. W-OPS §2 says it in terms: everything in that volume sits behind
 * `espionageActive` / `errandSpineActive` / its own doors.
 *
 * ⚠ NO PRODUCTION CONSUMER AT THIS CAR, AND THAT IS DECLARED RATHER THAN HIDDEN. The
 * ladder leaf has an empty src importer set, pinned by its own suite, so this predicate
 * is REGRESSION-grade today and becomes discovery-grade when the wiring car lands a
 * caller — the `foreignSeatOf` disposition at SEAT-1, verbatim. What the mint buys now
 * is CENSUS VISIBILITY: CR-WR10-C exists because a built, dark, ungated subsystem is
 * invisible to the totality walker that demands its certification row.
 *
 * @param {unknown} worldState
 * @returns {boolean}
 */
export function infiltrationDepthActive(worldState) {
  if (!espionageActive(worldState)) return false;
  const rules = /** @type {{ simulationRules?: Record<string, unknown> }} */ (worldState)?.simulationRules;
  if (!rules || typeof rules !== 'object') return false;
  return rules.infiltrationDepthEnabled === true;
}

/**
 * ── W-OPS DOOR 2 · THE MISSION DISPATCHER (DESIGN_W_OPS §6) ───────────────────
 *
 * `missionDispatcherEnabled` is the other door DESIGN_W_OPS §6 charters by name, and it
 * lands here for door 1's reason one step further along: the dispatcher leaf is PURE and
 * INJECTED — it takes needs, a cap and a frequency as arguments and never reaches for a
 * world — so it has no receiver to gate on. Its own header names the seam and asks for
 * exactly this mint. ⛔ THAT LEAF IS ALSO THE ONE ADMITTED IMPORTER OF THE ESPIONAGE SET,
 * and `tests/property/espionageDormancyFence.test.js`'s reachability-chain arm asserts it
 * names neither this module nor the layer flag — so the door may live HERE and never
 * there, and this paragraph is the record of why the obvious home is the wrong one.
 *
 * ⛔ THE CONJUNCTION IS MEANT. W-OPS §2: everything in that volume sits behind
 * `espionageActive` / `errandSpineActive` / its own doors. A dispatcher casting covert
 * operations into a world with no espionage layer would be minting work nothing can run.
 *
 * ⚠ NO PRODUCTION CONSUMER AT THIS CAR, DECLARED: the dispatcher's suite pins an empty
 * src importer set by an IMPORT-SPECIFIER census, and this predicate does not change that
 * — it names the key, never the file. The mint buys CENSUS VISIBILITY, which is the whole
 * of CR-WR10-C's purpose for a built-and-dark subsystem.
 *
 * @param {unknown} worldState
 * @returns {boolean}
 */
export function missionDispatcherActive(worldState) {
  if (!espionageActive(worldState)) return false;
  const rules = /** @type {{ simulationRules?: Record<string, unknown> }} */ (worldState)?.simulationRules;
  if (!rules || typeof rules !== 'object') return false;
  return rules.missionDispatcherEnabled === true;
}

/**
 * ── W-OPS DOOR 3 · THE OPERATIONS VOICE (the leaf's own provenance row) ───────
 *
 * `operationsVoiceEnabled` is not one of §6's two chartered doors; it is the door the
 * VOICE leaf names for itself, and its own provenance states the shape this predicate
 * implements verbatim: *"beneath it every surface inherits the doors of the subsystem
 * whose receipts it voices"*. That is why the conjunction is with `espionageActive` and
 * not with something narrower — the leaf voices espionage receipts, so it can have no
 * more life than the layer whose receipts it reads.
 *
 * ⛔ IT MAY NOT LIVE IN THE LEAF. That module's suite pins that its LOGIC — its source
 * with comments stripped and string literals blanked — carries no `Enabled` token at all,
 * anchored on its provenance constant so an unreadable leaf reds instead of certifying.
 * The door is deliberately "an address for the flag car, not a gate this leaf opens", and
 * the flag car keeps it that way.
 *
 * ⚠ NO PRODUCTION CONSUMER AT THIS CAR: the leaf's `consumers` field says NONE by design,
 * and the feed envelope and desk registration belong to the wiring car. This predicate is
 * REGRESSION-grade until that lands. What the mint buys is CENSUS VISIBILITY.
 *
 * @param {unknown} worldState
 * @returns {boolean}
 */
export function operationsVoiceActive(worldState) {
  if (!espionageActive(worldState)) return false;
  const rules = /** @type {{ simulationRules?: Record<string, unknown> }} */ (worldState)?.simulationRules;
  if (!rules || typeof rules !== 'object') return false;
  return rules.operationsVoiceEnabled === true;
}
