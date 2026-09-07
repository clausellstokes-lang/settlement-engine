/**
 * domain/certification/subsystemRowsOps.js — THE W-OPS FAMILY'S CERTIFICATION
 * ROWS. EMPTY ON PURPOSE, on the `subsystemRowsLives.js` model.
 *
 * A reserved SLOT rather than a behaviour: the address a W-OPS virtual key
 * registers its row at, so the car that lands one adds a row to an existing leaf
 * instead of authoring a file at a landing (ODQ §868's refusal, discharged here).
 *
 * ── THE KEYS THIS LEAF IS WAITING FOR ──────────────────────────────────────
 *
 * `docs/DESIGN_W_OPS.md` §6: "Doors: the inherited ES/errand stack +
 * `missionDispatcherEnabled` and `infiltrationDepthEnabled` (virtual, dark by
 * default, lit in full simulation). Dark ⇒ zero keys written ⇒ byte-identical."
 *
 * ⭐ ONE OF THE TWO IS NOW BUILT-AND-DARK, measured at this landing rather than
 * assumed: `src/domain/worldPulse/operations/missionDispatcher.js` exists (W-OPS
 * O1), names `missionDispatcherEnabled` as its door in its own header, and is
 * pinned to an EMPTY src importer set by `tests/domain/missionDispatcher.test.js`
 * — so its home is reserved against a landed seam, not only a chartered design.
 * `infiltrationDepthEnabled` is still design-only, and for it this leaf is the
 * chartered-design case the tail slot exists for.
 *
 * ⚠ THE ANCESTOR ROW STAYS WHERE IT IS, DELIBERATELY. W-OPS joins the ES charter
 * "by EXTENSION rather than collision", the mission dispatcher is named as "ES's
 * deliberately-deferred piece designed", and `infiltrationDepthEnabled` deepens
 * ES's own ladder — so the ESPIONAGE row is this family's ancestor and a tidier
 * decomposition would have moved it here. It is NOT moved: that row sits at index
 * 1 of `VIRTUAL_SUBSYSTEM_ROWS`, its position is a certification output under the
 * ordered-equality pin, and a leaf holding it would be a leaf that cannot grow
 * without shifting twenty-six rows. Family tidiness is not worth a reorder nobody
 * asked for. The ancestry is recorded here instead, where the next reader of this
 * leaf will find it.
 *
 * ⚠ AND THE KEY IS DELIBERATELY NOT SPELLED IN THE LINE ABOVE. The espionage key
 * carries twenty-odd dormancy fences, several of which assert an EXACT SET or an
 * EXACT COUNT of the src files that name it; a header that spelled it here would
 * enrol this leaf in every one of them and red a fence that is working perfectly.
 * That is the string-presence hazard ODQ §843 recorded for this very lane — a
 * mention scan cannot tell prose from a gate — and the cheapest cure is to not
 * write the token. The same restraint is why nothing here spells a REGISTERED key.
 *
 * TO LAND A W-OPS ROW: author it into the array below, add its key to
 * `ENGINE_GATED_VIRTUAL_RULE_KEYS` and its first by-name `=== true` gate read in
 * the SAME commit (ODQ §49 ruling 3, CR-WR10-C item 4), then pay the three
 * module-scope edits in `tests/domain/subsystemRowsVirtual.test.js`. ⭐ Appending
 * here shifts NO existing row.
 *
 * ⛔ IT DELIBERATELY DOES NOT JOIN `subsystemCertification.js`'s import list.
 * Spreading an empty frozen array is a no-op, so this leaf is provably
 * byte-neutral to every certification output until its first row lands.
 *
 * @see docs/DESIGN_W_OPS.md §6
 * @see docs/OWNER_DECISION_QUEUE.md §868, §870.4
 * @enforced-by tests/lint/subsystemCertificationTotality.walker.test.js,
 *   tests/lint/engineGatedRuleKeys.walker.test.js,
 *   tests/domain/subsystemRowsVirtual.test.js
 */

/** @typedef {import('./subsystemCertification.js').SubsystemRow} SubsystemRow */

/**
 * The W-OPS family's authored rows. EMPTY until the volume's first virtual door
 * lands its key, its gate read and its row in one commit.
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const OPS_SUBSYSTEM_ROWS = Object.freeze([]);
