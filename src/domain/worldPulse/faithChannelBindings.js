/**
 * domain/worldPulse/faithChannelBindings.js — THE CAUSAL BINDING, split out of the
 * field so the substrate can price a channel without loading the field (SUBSTRATE
 * coupling wave 6, REC-1; the WAVE-D `userRouteIdentity.js` idiom).
 *
 * ⭐⭐ WHY THIS FILE EXISTS, AND IT IS A MEASUREMENT RATHER THAN A PREFERENCE.
 * `causalState.js` is EAGER — it is reachable from `main.jsx` through the store — and
 * W-FAITH F4c gave it a static `import … from './worldPulse/faithField.js'` for exactly
 * two things: the binding table and one pricing function. That single edge dragged the
 * whole field kernel into the first-paint closure, and with it `worldPulse/piety.js`,
 * which had been lazy since it was written:
 *
 *   `faithField.js`  28,309 B rendered / 11,065 B gzip     — newly eager
 *   `worldPulse/piety.js`  28,584 B / 9,556 B              — newly eager BY DRAG
 *
 * ⛔ AND NO CHUNK PIN CAN CURE THAT, which was proved by execution rather than by
 * citing the law: pinning the three newly-eager modules to a dedicated lazy chunk made
 * the closure WORSE by 291 B, because an eager importer re-parents its "lazy" chunk
 * straight back into the closure (FP-G17). A genuinely-eager static edge admits only
 * one cure — MOVE THE FUNCTION, NOT THE CHUNK PIN — and this leaf is that move. The
 * measured closure went 1,054,284 → 1,047,041 B (−7,243).
 *
 * ⛔⛔ SO THE ONE INVARIANT THIS FILE MUST KEEP IS **ZERO IMPORTS**. Everything here is
 * pure arithmetic over a plain record and a frozen table; the moment it imports
 * anything, whatever that is becomes first-paint weight again and the cure silently
 * unwinds with every test still green. `tests/property/faithFieldDormancyFence.test.js`
 * carries this file in `FAITH_FIELD_SET`, so its purity arm scans this leaf too.
 *
 * NOTHING HERE IS NEW. Every declaration below moved from `faithField.js` verbatim —
 * same bodies, same comments, same values — and `faithField.js` re-exports all three
 * public names so no consumer's address changed. The one edit the move forced is that
 * `faithChannelLift` now reads the bare `CAUSAL_SWING` where it read
 * `FAITH_FIELD_TUNING.CAUSAL_SWING`; the constant is the same 20 and
 * `FAITH_FIELD_TUNING` still carries it, imported from here, so the tuning surface the
 * owner signs (F6c) is still one object.
 */

/**
 * ⭐⭐ THE CHANNEL → CAUSAL-VARIABLE BINDINGS (W-FAITH F4c). This table is the car,
 * and it is a REGISTER rather than a comment because of what measuring it found.
 *
 * `customContentSchema.js` states the channel register's premise in terms:
 *
 *   > Each key names an EXISTING settlement causal quantity; none invents one.
 *
 * ⚠⚠ MEASURED AT THIS TIP, THAT IS TRUE OF SIX OF THE NINE AND FALSE OF THREE.
 * `causalState.SYSTEM_VARIABLES` is the estate's causal substrate — sixteen named
 * variables, each derived from a contributor chain — and `sea`, `learning` and
 * `hearth` name nothing in it, nor anywhere else in `src/domain`:
 *
 *   • `sea`      — the estate's only sea quantity is `stormMultOf`
 *                  (`spatial/navalLayer.js`), whose sole consumer is `roads/seaRoads.js`,
 *                  in the SPATIAL layer behind the dark virtual `navalEnabled`.
 *                  `causalState.js` reads no port, sea or naval input at all.
 *   • `learning` — no settlement causal quantity of that name exists. The only
 *                  `learning` in the engine is `LAW_BAND_KEYS`'s law-band ADAPTATION
 *                  RATE and `dispositionTreatyLearningActive` — different concepts
 *                  that would be actively wrong to bind to "Learning and record".
 *   • `hearth`   — no fertility or household causal quantity exists. The word appears
 *                  in a founding-myth vocabulary and as INTERIOR FURNITURE.
 *
 * ⛔ SO THE THREE ARE DECLARED UNBOUND RATHER THAN GIVEN A NEIGHBOUR'S HOME, and
 * that refusal is the important half of this table. Binding `learning` to
 * `social_trust` because it is nearby is the estate's own most-bitten class — a
 * quantity acquiring a different meaning at each consumer while nothing ever reds.
 * An authored `boon: learning` is therefore PROVABLY inert (this register says so,
 * and `faithChannelWiring.test.js` executes it) rather than SILENTLY inert.
 *
 * The remedy is the pen's, not a lane's: §D3's vocabulary is an owner-UNSIGNED
 * CANDIDATE register (the volume's own §3.4), so the owner either signs three new
 * causal variables into the substrate, or strikes the three words from the register.
 * Both are register acts. F6c carries the row.
 *
 * ⚠ THE UNBOUND HALF STAYS IN `faithField.js` (`FAITH_UNBOUND_CHANNELS`), and that is
 * not an accident of the split: only the BOUND table is on the causal path, and the
 * wiring test still asserts `FAITH_CHANNELS === keys(BINDINGS) ∪ keys(UNBOUND)` across
 * the two files, so the pair cannot drift apart at their new addresses.
 *
 * @type {Readonly<Record<string, string>>} channel → `causalState.SYSTEM_VARIABLES` member
 */
export const FAITH_CHANNEL_BINDINGS = Object.freeze({
  harvest: 'food_security',
  trade: 'trade_connectivity',
  craft: 'economic_capacity',
  healing: 'healing_capacity',
  order: 'law_order',
  war_readiness: 'defense_readiness',
});

/**
 * ⚠ AN OWNER-UNSIGNED CANDIDATE (§763's tuning carve-out), exactly as it was inside
 * `FAITH_FIELD_TUNING` — which still carries it under the same key, imported from here,
 * so the tuning surface stays one object.
 *
 * W-FAITH F4c — THE CAUSAL SWING: score points on a `causalState` variable per unit
 * of signed channel total. It is DERIVED from an existing calibrated constant rather
 * than invented, which is the only reason a lane may set it at all:
 *
 *   `DEITY_LAW_TUNING.lawOrderSwing = 8` is the law_order swing a fully lawful patron
 *   applies, and its own comment calibrates it as "comparable in scale to the
 *   government-archetype term (±8), so a patron meaningfully tilts order without
 *   overwhelming the institutional signals". At SWING = 20 a heavy boon from a lone
 *   ascendant major patron holding the whole adherent pool (channel total 0.38 at
 *   neutral piety) lifts its variable by round(0.38 × 20) = 8 — EXACTLY the lawful
 *   patron's swing. The two authored deity levers therefore speak at one volume by
 *   construction rather than by coincidence.
 *
 * ⚠ THE CLAMPED EXTREME IS LOUDER THAN THAT, and it is stated rather than hidden:
 * `channels[ch]` already carries `pietyMultOf` (0.5..2.0), so a devout city can drive
 * a channel to the DAMP_MAX backstop, where the lift is round(0.6 × 20) = 12. F3c's
 * recorded 0.38 bound was measured at piety 1 and is a bound on the WEIGHT fold, not
 * on the term; this car re-measures the reachable maximum end to end rather than
 * inheriting that figure. Both numbers are owner-taste rows for F6c.
 */
export const CAUSAL_SWING = 20;

/**
 * One channel's signed total, read off a PROJECTION RECORD.
 *
 * Absent record, absent channel, unknown channel ⇒ literal 0, never `undefined`: a
 * consumer that mistypes a channel gets silence, not a NaN in a score.
 *
 * ⚠⚠ IT TAKES THE RECORD, NOT THE SETTLEMENT, AND THE OBSERVED-SHAPE RATCHET IS WHY.
 * The obvious signature is `(settlement, channel)` — and it costs this file a NEW
 * `faithProfile on config` inventory row against a frozen ceiling of ZERO, because
 * `faithProfile` is a key the GENERATOR never writes (the pulse mints it). The estate's
 * cure for that class is to read the key where a row already exists and hand the value
 * down, which is what `causalState.pietyLocalAmp` now does with its single frozen read.
 * ⭐ It is also the better decomposition: this leaf stops needing to know what a
 * settlement is, and becomes a pure function of the record it defined.
 *
 * @param {{ channels?: Record<string, unknown> } | null | undefined} field a projection record
 * @param {string} channel
 * @returns {number}
 */
export function faithChannelTotalOf(field, channel) {
  const raw = field?.channels?.[channel];
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : 0;
}

/**
 * THE ONE PLACE A CHANNEL TOTAL BECOMES A CAUSAL SCORE DELTA.
 *
 * `causalState`'s contributors are signed INTEGERS added to a 0..100 score, so the
 * field's signed total is converted here and nowhere else — six derivers name a
 * channel, and exactly one function decides what a channel is worth.
 *
 * ⚠⚠ THE PIETY AMPLIFIER IS **NOT** APPLIED HERE, AND THAT IS A CORRECTNESS
 * REQUIREMENT RATHER THAN A STYLE CHOICE. `causalState`'s existing deity terms
 * multiply their lift by `pietyLocalAmp(s)` because `deityLawDirection` is a bare
 * axis sign that has never met piety. `faithFieldOf` ALREADY folds the full composite
 * `pietyMultOf(settlement)` into every term, so amplifying again at the causal site
 * would square the piety multiplier — a devout city's boon counted twice, which is
 * exactly the double-count W-FAITH D1 forbids, wearing a second subsystem's clothes.
 *
 * ⭐ ROUNDING IS THE SPARSITY PROPERTY, not a rounding error: any total below
 * 1/(2 × CAUSAL_SWING) = 0.025 rounds to 0 and pushes NO contributor, so a faint boon
 * from a marginal cult is inaudible in the substrate rather than appearing as a
 * receipt line worth zero points.
 *
 * @param {{ channels?: Record<string, unknown> } | null | undefined} field a projection record
 * @param {string} channel
 * @returns {number} a signed integer score delta; 0 when the field is silent here
 */
export function faithChannelLift(field, channel) {
  if (!Object.prototype.hasOwnProperty.call(FAITH_CHANNEL_BINDINGS, channel)) return 0;
  const lift = Math.round(faithChannelTotalOf(field, channel) * CAUSAL_SWING);
  // `Math.round(-0.2)` is `-0`; a `-0` delta would serialise as "-0" in a contributor
  // receipt and compare unequal under Object.is. Normalised at the boundary.
  return lift === 0 ? 0 : lift;
}
