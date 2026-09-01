/**
 * domain/worldPulse/faithTuningSurface.js — THE FAITH TUNING SIGNATURE SURFACE
 * (W-FAITH F6c; the TE-DENSITY-1 D4 pattern applied to faith).
 *
 * ⭐ THIS IS THE ONE FILE THE OWNER'S PEN EDITS. Every faith-side tuning number the
 * W-FAITH train minted as an owner-unsigned candidate LIVES here — the field kernel,
 * the flaw register and the witness adapter import their tables from this file — so
 * the owner's tune-and-sign act is a SINGLE FILE'S DIFF. That is the property the
 * D4 car built for the density ladder (`REGISTER_VII_SIGNATURE` in `densityBands.js`:
 * the dial derives from the record, so signing stopped being a two-file act), applied
 * here to the faith program.
 *
 * THE SIGNATURE IS TWO WORDS, NOT ONE, AND THE PAIR IS THE STRUCTURE:
 *
 *   • `signed` — the owner has signed these numbers and word lists. Until then every
 *     value below is a CANDIDATE (§763's tuning carve-out): the SHAPE of each row is
 *     a lane's claim, the VALUE is the pen's. Signing is `signed: true` plus a name
 *     in `FAITH_TUNING_PROVENANCE.signedBy` — one file's diff.
 *   • `live` — new worlds may open the faith door under these numbers. It DERIVES
 *     through `faithTuningArmed()`, which is `signed && live`: lighting an unsigned
 *     surface is structurally impossible, not procedurally discouraged. The owner
 *     can therefore sign, soak, and only then light (the terminal-soak order the
 *     density signature was built to preserve).
 *
 * WHAT `live` GOVERNS — AND, STATED HONESTLY, WHAT IT DOES NOT:
 *
 *   • IT GOVERNS THE DOOR. `FAITH_FIELD_DOOR` (the virtual flag key D7 names,
 *     still owed a home by TE-VIRT-1) moved here to sit beside the word that will
 *     gate it. The car that mints that flag MUST read `faithTuningArmed()` when it
 *     wires the door's lighting: a door opened over an unsigned surface is the
 *     "mint under unsigned numbers" defect §810 R5 names, and the derivation makes
 *     it unconstructible. Nothing reads the door today — the same named-seam
 *     discipline the door key itself has carried since F3c.
 *   • IT DOES NOT RE-GATE THE LANDED F4c WIRING. A deity that AUTHORS a bound boon
 *     or bane moves its causal variable today, magic-gated, exactly as the promoted
 *     manifest claims and their executable probes state. That is chartered
 *     mechanics with its own governance surface; making it read this record would
 *     be a behaviour change wearing a bookkeeping commit, and this car changes NO
 *     behaviour. The estate stays dark the way it is dark today: no deity in it
 *     authors any of these fields.
 *
 * EVERY VALUE BELOW IS AT ITS EXACT PRE-CONSOLIDATION STATE. This car minted NO
 * number and moved none: the tables came here verbatim from `faithField.js`,
 * `deityFlaws.js` and `faithWitnessSource.js`, which now import and re-export them,
 * so every existing consumer path still resolves and the objects are the SAME
 * objects (the fork is unconstructible — pinned by identity in
 * `tests/domain/faithTuningSurface.test.js`). The dormant world's byte-identity is
 * proved by FENCE 4's untouched golden, not asserted.
 *
 * THE VOCABULARIES ARE SIGNED BY REFERENCE, NOT BY RESIDENCE. The candidate word
 * lists (channels, bindings, unbound rows, strength bands, flaw words) stay in the
 * homes whose partition and mirror pins already guard them; `FAITH_TUNING_COVERAGE`
 * below enumerates them so the signature's reach is machine-checkable. Signing this
 * surface signs exactly what the coverage roster names — no more, and provably no
 * less (the both-ways partition arm reds on a tunable without a coverage row).
 *
 * PURE + rng-free + store-blind: this file imports NOTHING. It is a member of
 * FAITH_FIELD_SET, so the dormancy fence's consumer census and purity pin cover it.
 */

/**
 * THE SIGNATURE RECORD. Two words; see the header for why not one.
 * Today: unsigned and dark — every consumer of the tables below is either dormant
 * by data (no deity authors the fields) or chartered under its own governance.
 * @type {Readonly<{ signed: boolean, live: boolean }>}
 */
export const FAITH_TUNING_SIGNATURE = Object.freeze({ signed: false, live: false });

/**
 * THE DERIVATION — sign-then-light, structural. `live` cannot arm while `signed`
 * is false because the record only arms through this conjunction; there is no
 * second reader of the raw words. The signature argument is defaulted rather than
 * closed over so the law itself is executable: the test drives the three
 * counterfactual corners without mutating the frozen record.
 * @param {{ signed?: unknown, live?: unknown }} [signature]
 * @returns {boolean} true only when the surface is BOTH signed and lit
 */
export function faithTuningArmed(signature = FAITH_TUNING_SIGNATURE) {
  return signature.signed === true && signature.live === true;
}

/**
 * The virtual flag key D7 names (`faithFieldEnabled`), moved here from
 * `faithField.js` (which still re-exports it) so the door's NAME sits beside the
 * `live` word that will gate it. Still a STRING with no reader, deliberately:
 * TE-VIRT-1 owes every virtual key a home, and a flag with no reader is a worse
 * artifact than a named seam. The car that mints the flag reads
 * `faithTuningArmed()` — see the header.
 */
export const FAITH_FIELD_DOOR = 'faithFieldEnabled';

/**
 * Provenance of the whole surface, carried in the module so a reader who arrives
 * at the code before the docs learns the signature status here (the
 * DEITY_FLAW_PROVENANCE / CATALOG_PROVENANCE idiom).
 * NOTE for a later editor: plain string literals inside src/domain are scanned by
 * tests/copy/voiceMechanics.test.js. Keep the punctuation flat.
 * @type {Readonly<{ status: string, signedBy: string|null, source: string, ritual: string, coverage: string }>}
 */
export const FAITH_TUNING_PROVENANCE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (every table below is a draft; frozen only by the owner pen)',
  signedBy: null,
  source: 'W-FAITH cars F1c-F5c as built; DESIGN_W_FAITH D3/D4 and the D2 supersession (ODQ 800.3 J2); the D4 density signature precedent',
  ritual: 'To sign: set signed true and write the name here, in this file, in one diff. To light: set live true in a LATER diff; faithTuningArmed() answers true only when both words are true, so lighting an unsigned surface cannot be expressed.',
  coverage: 'FAITH_TUNING_COVERAGE enumerates every tunable key and every candidate vocabulary this signature reaches; the partition test holds it to the tables both ways.',
});

/**
 * ⚠ EVERY NUMBER BELOW IS AN OWNER-UNSIGNED CANDIDATE (§763's tuning carve-out).
 * The SHAPE is the train's claim; the values are the pen's. Values verbatim from
 * `faithField.js` at e0b4c371b — this car moved them and minted nothing.
 */
export const FAITH_FIELD_TUNING = Object.freeze({
  // The patron is louder than a co-resident cult, but not categorically different —
  // the whole point of a FIELD is that the patron stopped being the only voice.
  PATRON_AMP: 1.6,
  // Band → signed magnitude, before any weighting. `heavy` at full weight is a
  // quarter-turn on a channel; a cult with a faint boon is nearly inaudible, which
  // is the intended texture.
  STRENGTH: Object.freeze({ faint: 0.05, firm: 0.12, heavy: 0.25 }),
  // THE SATURATION CAP — the piety module's own DAMP_MAX by value and by intent.
  //
  // ⚠⚠ IT IS A BACKSTOP, NOT THE RUNAWAY GUARANTEE, AND THAT WAS MEASURED RATHER
  // THAN ASSUMED (F3c, executed over 200,000 random conserved pantheons). The real
  // bound is STRUCTURAL: `renormShares` conserves the adherent pool at 100 points,
  // so Σ share01 ≤ 1 and the whole fold is bounded by
  //     max|channel| = STRENGTH.heavy × DEITY_RANK_STRENGTH.major × PATRON_AMP
  //                  = 0.25 × 0.95 × 1.6 = 0.38
  // attained only by a lone ascendant major patron holding the entire pool. A
  // pantheon cannot run away because ADDING a god DIVIDES the pool rather than
  // adding to it. The clamp stays live for UNNORMALISED callers (measured — ten
  // members at 100 share each clamp to exactly 0.6); both halves are pinned in
  // `faithFieldEquation.test.js`.
  //
  // ⚠ FOR THE PEN: the reachable band therefore uses 63 % of the declared cap.
  // Whether that is right taste — a lower cap, or a louder STRENGTH ladder — is
  // this surface's row 30 in the pack; not a lane's call to make silently.
  DAMP_MAX: 0.6,
  // W-FAITH F4c — THE CAUSAL SWING: score points on a `causalState` variable per unit
  // of signed channel total. It is DERIVED from an existing calibrated constant rather
  // than invented, which is the only reason a lane may set it at all:
  //
  //   `DEITY_LAW_TUNING.lawOrderSwing = 8` is the law_order swing a fully lawful patron
  //   applies, and its own comment calibrates it as "comparable in scale to the
  //   government-archetype term (±8), so a patron meaningfully tilts order without
  //   overwhelming the institutional signals". At SWING = 20 a heavy boon from a lone
  //   ascendant major patron holding the whole adherent pool (channel total 0.38 at
  //   neutral piety) lifts its variable by round(0.38 × 20) = 8 — EXACTLY the lawful
  //   patron's swing. The two authored deity levers therefore speak at one volume by
  //   construction rather than by coincidence. The full band ladder at that same
  //   extreme is faint/firm/heavy → lifts 2/4/8.
  //
  // ⚠ THE CLAMPED EXTREME IS LOUDER THAN THAT, and it is stated rather than hidden:
  // the term already carries `pietyMultOf` (0.5..2.0), so a devout city can drive
  // a channel to the DAMP_MAX backstop, where the lift is round(0.6 × 20) = 12.
  CAUSAL_SWING: 20,
});

/**
 * ⚠ EVERY NUMBER BELOW IS AN OWNER-UNSIGNED CANDIDATE (§763's tuning carve-out).
 * Values verbatim from `deityFlaws.js` at e0b4c371b. The flaw WORDS themselves are
 * `deityFlaws.DEITY_FLAWS` — a coverage row below, not a resident here.
 */
export const DEITY_FLAW_TUNING = Object.freeze({
  // The fraction of the boon lost at FULL contest by a `defining` jealous god. At 1,
  // the blessing fades in exact proportion to the share rivals hold: a god whose
  // pantheon is half contested blesses at half strength before weighting. Legible by
  // construction; the value is a taste row.
  JEALOUS_BOON_FADE: 1,
  // How deeply each authored level engages a modulation. The axis level is a POSITION
  // band, not a magnitude band (the schema keeps the two ladders distinct on purpose),
  // so this is the kernel's interpretation of the position ladder, exactly as
  // FAITH_FIELD_TUNING.STRENGTH interprets the magnitude ladder.
  LEVEL_SCALE: Object.freeze({ a_touch: 0.35, marked: 0.7, defining: 1 }),
  // Rungs of exposure demotion a falling-fortunes wrathful pull recovers. One rung:
  // the god is felt more keenly, never above its authored ceiling (arithmetic, not
  // discipline — the demotion is floored at 0).
  WRATH_SHARPEN_RUNGS: 1,
});

/**
 * ⚠ OWNER-UNSIGNED CANDIDATES (§763's tuning carve-out). The SHAPE — a step ladder
 * that only ever steps DOWN — is the train's claim; the thresholds are the pen's.
 * Values verbatim from `faithWitnessSource.js` at e0b4c371b.
 */
export const FAITH_WITNESS_TUNING = Object.freeze({
  // Exposure thresholds on `memberWeight × pietyMult`. A soul among a dominant,
  // devoutly-kept faith feels its god at the level the god is authored at; a soul
  // among a minor cult feels a fainter version of the same character; below the
  // last rung it is not marked at all.
  //
  // ⭐ THE LADDER ONLY STEPS DOWN — never up (§856: "family ladders step never
  // multiply"). An authored `defining` on a tiny cult must not teach as `heavy`,
  // and no exposure however total may teach MORE than the god is authored to be.
  // The deity's authored level is a CEILING; exposure decides how far below it the
  // lesson lands.
  FULL_EXPOSURE: 0.6,   // ≥ this: the lesson lands at the authored level
  PART_EXPOSURE: 0.25,  // ≥ this: one rung down
  // below PART_EXPOSURE: two rungs down — which silences `a_touch` and `marked`
  // outright, and leaves only a `defining` god faintly felt through a small cult.
});

/**
 * @typedef {Object} FaithTuningCoverageRow
 * @property {'tunable'|'vocabulary'} kind
 * @property {string} [table]      tunable rows: which table in THIS file holds it
 * @property {string} [key]        tunable rows: the key inside that table
 * @property {string} [exportName] vocabulary rows: the export the signature reaches
 * @property {string} [home]       vocabulary rows: the repo-relative module that owns it
 * @property {string} note         why the row is on the pen's desk
 */

/**
 * THE COVERAGE ROSTER — what signing this surface actually signs.
 *
 * Machine-walkable both ways: the partition arm asserts that the `tunable` rows are
 * EXACTLY the keys of the three tables above (a new tunable smuggled into a table
 * without a coverage row reds, and so does a coverage row naming a dead key), and
 * the vocabulary arm asserts every named export exists frozen at its named home.
 * @type {readonly FaithTuningCoverageRow[]}
 */
export const FAITH_TUNING_COVERAGE = Object.freeze([
  Object.freeze({ kind: 'tunable', table: 'FAITH_FIELD_TUNING', key: 'PATRON_AMP', note: 'How much louder the patron is than a co-resident cult.' }),
  Object.freeze({ kind: 'tunable', table: 'FAITH_FIELD_TUNING', key: 'STRENGTH', note: 'The kernel reading of the three authored strength bands.' }),
  Object.freeze({ kind: 'tunable', table: 'FAITH_FIELD_TUNING', key: 'DAMP_MAX', note: 'The channel backstop; the reachable band uses 63 percent of it (pack row 30).' }),
  Object.freeze({ kind: 'tunable', table: 'FAITH_FIELD_TUNING', key: 'CAUSAL_SWING', note: 'Score points per unit channel total; derived to lawOrderSwing parity (pack row 31).' }),
  Object.freeze({ kind: 'tunable', table: 'DEITY_FLAW_TUNING', key: 'JEALOUS_BOON_FADE', note: 'Boon fraction lost at full contest by a defining jealous god.' }),
  Object.freeze({ kind: 'tunable', table: 'DEITY_FLAW_TUNING', key: 'LEVEL_SCALE', note: 'How deeply each authored position level engages a flaw modulation.' }),
  Object.freeze({ kind: 'tunable', table: 'DEITY_FLAW_TUNING', key: 'WRATH_SHARPEN_RUNGS', note: 'Demotion rungs a falling-fortunes wrathful pull recovers (pack row 33).' }),
  Object.freeze({ kind: 'tunable', table: 'FAITH_WITNESS_TUNING', key: 'FULL_EXPOSURE', note: 'Exposure at which a lesson lands at the authored level.' }),
  Object.freeze({ kind: 'tunable', table: 'FAITH_WITNESS_TUNING', key: 'PART_EXPOSURE', note: 'Exposure at which a lesson lands one rung down.' }),
  Object.freeze({ kind: 'vocabulary', exportName: 'FAITH_CHANNELS', home: 'src/domain/worldPulse/faithField.js', note: 'The nine effect-channel words; the pack had no such register (F1c M1), so the roster is D3 prose awaiting the pen.' }),
  Object.freeze({ kind: 'vocabulary', exportName: 'FAITH_CHANNEL_BINDINGS', home: 'src/domain/worldPulse/faithField.js', note: 'The six channels that name a real causal variable.' }),
  Object.freeze({ kind: 'vocabulary', exportName: 'FAITH_UNBOUND_CHANNELS', home: 'src/domain/worldPulse/faithField.js', note: 'The three channels that name nothing; sign three variables or strike three words (pack row 26).' }),
  Object.freeze({ kind: 'vocabulary', exportName: 'FAITH_STRENGTHS', home: 'src/domain/worldPulse/faithField.js', note: 'The three authored strength band words, mirrored from the schema.' }),
  Object.freeze({ kind: 'vocabulary', exportName: 'DEITY_FLAWS', home: 'src/domain/worldPulse/deityFlaws.js', note: 'The eight D2 flaw words as dispositioned onto the chart: two modulate, one declared dormant (pack row 27), four vocabulary-only, meddling unhomed (pack row 28).' }),
  Object.freeze({ kind: 'vocabulary', exportName: 'FLAW_EFFECTS', home: 'src/domain/worldPulse/deityFlaws.js', note: 'The two chartered modulations; promoting a third word is the pen act the partition test guards.' }),
]);
