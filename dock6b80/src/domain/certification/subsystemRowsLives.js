/**
 * domain/certification/subsystemRowsLives.js — THE W-LIVES FAMILY'S CERTIFICATION
 * ROWS. EMPTY ON PURPOSE, AND THE EMPTINESS IS THE DELIVERABLE.
 *
 * ── A HOME, NOT A BEHAVIOUR ────────────────────────────────────────────────
 *
 * This leaf lights nothing, asserts nothing and grades nothing. It is a reserved
 * SLOT: the address a W-LIVES virtual key registers its row at, so that the car
 * which finally lands one adds a row to an existing leaf instead of authoring a
 * file at a landing — which is exactly the act T12 refused as "a structural call
 * chartered to TE-VIRT-1, not a landing's to make" (ODQ §868). TE-VIRT-1 makes it
 * here, before the doors arrive, which is the only time it can be made cheaply.
 *
 * ── THE KEY THIS LEAF IS WAITING FOR — RULED, NOT GUESSED ──────────────────
 *
 * `characterDriftEnabled` is the volume's ONE door. The substrate coupling
 * ruled the spelling (car `aba45d7a0`, "the door gets ONE spelling"): the built
 * seam `src/domain/npc/characterDrift.js` exports `CHARACTER_DRIFT_FLAG_KEY =
 * 'characterDriftEnabled'` and names this lane in its own header — "⚠ TE-VIRT-1
 * OWES THE FLAG'S HOME — the registration that lets a rule surface turn it on.
 * THAT REGISTRATION IS THE ONLY WIRING NEEDED; the seam is
 * `CHARACTER_DRIFT_FLAG_KEY` below." The volume's two other door names WERE
 * RULED OUT — one the same door, one unnecessary — and their tombstones live as
 * ACTS at the seam's declaration (per §769.4), kept true by
 * `tests/domain/npc/characterDrift.test.js`'s ONE-SPELLING walker. They are
 * deliberately NOT respelled here: this leaf awaits `characterDriftEnabled`'s
 * row and no other.
 *
 * ── ⛔ WHY THE MANIFEST ENTRY IS **NOT** PART OF THIS ACT ───────────────────
 *
 * The drift module's header asks for a registration in
 * `ENGINE_GATED_VIRTUAL_RULE_KEYS` (`worldPulse/simulationRules.js`). That
 * registration is still NOT this lane's, and the reason moved with the branch:
 * the seam has since LANDED (§874's coupling), so the original cause — "the
 * module does not exist yet" — is spent, and the live one is the manifest law.
 * `tests/lint/engineGatedRuleKeys.walker.test.js` proves the manifest against the
 * tree in BOTH directions, and the seam exports its key while nothing in src/
 * gate-reads it, so a manifest entry added alone reds direction 1 immediately.
 * The manifest entry, the row and the first by-name gate read are ONE COMMIT by
 * standing law (ODQ §49 ruling 3, CR-WR10-C item 4), and that commit is the door
 * car's. What this lane owes and pays is the HOME.
 *
 * TO LAND A W-LIVES ROW: author it into the array below, add its key to
 * `ENGINE_GATED_VIRTUAL_RULE_KEYS` and its first by-name `=== true` gate read in
 * the SAME commit, then pay the three module-scope edits in
 * `tests/domain/subsystemRowsVirtual.test.js` (the key const, the `VIRTUAL_RULES`
 * member in position, the `LANE_LEAVES` entry). ⭐ Appending here shifts NO
 * existing row — this leaf sits after every authored row, which is the whole point
 * of putting the door homes at the tail (§864's append-last precedent).
 *
 * ⛔ IT DELIBERATELY DOES NOT JOIN `subsystemCertification.js`'s import list; the
 * rows spread back into `VIRTUAL_SUBSYSTEM_ROWS`, the ONE export every consumer,
 * walker and bijection reads. Spreading an empty frozen array is a no-op, so this
 * leaf is provably byte-neutral to every certification output until its first row
 * lands — the same deliberate-empty idiom `VIRTUAL_PENDING_RULE_KEYS` already uses.
 *
 * @see docs/DESIGN_W_LIVES.md §8
 * @see docs/OWNER_DECISION_QUEUE.md §801, §868, §870.4, §874 (car `aba45d7a0`
 *   ruled the door's ONE spelling)
 * @enforced-by tests/lint/subsystemCertificationTotality.walker.test.js,
 *   tests/lint/engineGatedRuleKeys.walker.test.js,
 *   tests/domain/subsystemRowsVirtual.test.js
 */

/** @typedef {import('./subsystemCertification.js').SubsystemRow} SubsystemRow */

/**
 * The W-LIVES family's authored rows. EMPTY until the volume's first virtual door
 * lands its key, its gate read and its row in one commit.
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const LIVES_SUBSYSTEM_ROWS = Object.freeze([]);
