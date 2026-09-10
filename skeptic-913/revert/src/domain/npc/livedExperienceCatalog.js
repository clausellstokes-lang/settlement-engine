/**
 * domain/npc/livedExperienceCatalog.js — THE LIVED-EXPERIENCE VOCABULARY
 * (W-LIVES car L3; DESIGN_W_LIVES.md §3, as amended by §15's panel fold, which
 * OUTRANKS it; the candidate table is pack Register III).
 *
 * WHAT THIS HOLDS. The closed vocabulary every lesson must enter through, and the
 * two INDEPENDENT PARTITIONS over it:
 *
 *   PLANE   — how close the event stood to the person (personal > affiliation >
 *             witness). One event teaches one NPC on its CLOSEST plane only; that
 *             is the structural cure for double-counting, and it is the funnel's
 *             job, not this file's.
 *   FAMILY  — what kind of lesson it is (ordeal, bond, fall, career, house, realm,
 *             creed, repute, word, milieu), which sets how hard it teaches.
 *
 * Both partitions are asserted BOTH WAYS in the test — forward (nothing is
 * classified that the vocabulary does not speak) and reverse (nothing the
 * vocabulary speaks is left unclassified). The reverse direction is the one that
 * reds when a twenty-ninth kind lands and nobody decides what it teaches; without
 * it an unclassified kind is silently a kind that teaches nothing, which is
 * indistinguishable from a kind nobody wired.
 *
 * ── THE PATTERN, VERBATIM: DISPOSITION_SOURCE_KINDS ──────────────────────────
 *
 * `dispositionLedger.js` is the worked example this file copies rather than
 * reinvents: a frozen source-kind list, a SILENT FALLBACK KIND that any string
 * outside the vocabulary collapses to, and a partition asserted both ways. The
 * silent kind matters more than it looks — it is what makes an unrecognised token
 * unable to move a soul, which is precisely the open-schema leak a closed
 * vocabulary exists to prevent. Here that kind is `ordinary_day`: life went on and
 * taught nothing, which is both the honest generic and the honest fallback.
 *
 * ── PULLS ARE BAND WORDS, NEVER FLOATS (pack Register III's own law) ─────────
 *
 * A pull says WHICH AXIS, WHICH POLE, and HOW HARD in one of three words —
 * `faint` / `firm` / `heavy`. No magnitude appears in this file. The words map to
 * numbers in exactly one place (`livedExperienceFunnel.js`'s PULL_TUNING), which
 * is the row the owner signs; a number written here would be unsigned taste
 * wearing the authority of code, and it would be wearing it in the file the pen
 * is supposed to read.
 *
 * A pull names a POLE SIDE (`virtue` / `vice`), never a pole WORD. The words are
 * car L1's `paradigmAxisCatalog.js` authority; naming them here would fork them.
 * The test reconciles both ways the moment L1 shares a tree: every axis id this
 * file speaks must be a real axis, and every (axis, pole) pair must resolve to a
 * real pole word.
 *
 * ── THE SOURCE QUALIFICATION LAW (§3, and it is load-bearing) ────────────────
 *
 * "A source registers only if it already emits a receipted outcome — drift never
 * invents event streams." Every row below was WALKED against this tree, and the
 * census is carried IN THE TABLE rather than in a receipt that will rot:
 *
 *   `receipt`        the module and token that actually emits it, so car L4 has an
 *                    ADDRESS rather than a search — and so a reader can check the
 *                    claim instead of trusting it.
 *   `receiptDark`    the receipt exists but its flag is lit in NO preset. Real
 *                    machinery, no live stream. L4 may wire it; nothing will come.
 *   `sourceUnverified` NO receipt exists. The kind stays in the vocabulary so the
 *                    partition is honest and the owner can see the gap, and the
 *                    FUNNEL REFUSES IT AT THE DOOR (`source_unverified`). Marking
 *                    is the only honest third option between wiring a phantom and
 *                    deleting a row the owner drafted.
 *
 * TWELVE OF THIRTY-ONE KINDS CARRY NO RECEIPT, and that is the single most useful
 * fact this file holds. The register drafted a world richer than the engine emits;
 * finding out at the adapter car, one phantom at a time, would have been the
 * expensive way to learn it.
 *
 * ⚠⚠ AND THE FINDING THAT OUTRANKS ALL OF THEM — A SECOND FUNNEL ALREADY EXISTS.
 * `worldPulse/npcGrowthKernel.js` maps eight settlement signals (`GROWTH_DEPOSIT_MAP`:
 * calamity, bust, besieged, siege_survived, reconstruction, betrayal, boom,
 * flourishing) onto learned NPC traits and emits `impactKind: 'npc_growth'` with a
 * real `npcIds` actor layer — LIT in three presets today, and keyed on the
 * POSITIONAL `nid` that car L2's whole recon refuted. Two signal vocabularies over
 * the same souls is precisely the fork hazard `characterDrift.js`'s own header
 * warns about and `bandedStock.js` was minted to end. Whether L3+ EXTENDS that
 * table or stands beside it is an architectural call above this lane's seat: it is
 * raised in LIVED_EXPERIENCE_PROVENANCE and in the lane receipt, deliberately
 * UNRESOLVED here rather than settled by the fact that this file was written second.
 *
 * OWNER-UNSIGNED. Every row here is a CANDIDATE (`signedBy: null`), the L1 idiom.
 * The table is a first draft the pen freezes, not a decision this lane made.
 *
 * PURE. No world state, no clock, no PRNG, no I/O, no mutation. Consumed by
 * `livedExperienceFunnel.js` and by nothing in production — dark by construction.
 *
 * @see docs/DESIGN_W_LIVES.md §3, §5, §15 (F6, F9 as amended at §853)
 * @see docs/briefs/W-REGISTERS-PACK.md Register III
 * @see docs/OWNER_DECISION_QUEUE.md §800, §800.4, §806, §853
 * @enforced-by tests/domain/npc/livedExperienceCatalog.test.js
 */

import { compareCodepoint } from '../deterministicSort.js';
// ⭐ THE ONE CROSS-LEAF IMPORT THE COUPLING ADDS, and it REPLACES a hand-kept copy of
// the same seventeen ids rather than adding a reach. See `PARADIGM_AXIS_IDS` below for
// why this leaf is the only one of the four mirrors where the import is free.
import { PARADIGM_AXES } from './paradigmAxisCatalog.js';

/**
 * THE THREE PLANES, ORDERED CLOSEST FIRST. The order IS the precedence law: index
 * 0 is closest, and closest-plane-wins is `indexOf` on this array. Writing the
 * precedence as the array's own order means a fourth plane cannot be added without
 * deciding where it sits, which is the decision that matters.
 * @type {readonly string[]}
 */
export const EXPERIENCE_PLANES = Object.freeze(['personal', 'affiliation', 'witness']);

/**
 * THE LESSON FAMILIES, HEAVIEST-TEACHING FIRST (pack Register III's candidate
 * ladder: "ordeal > bond > fall > career > house > realm > creed > repute > word >
 * milieu"). The ORDER is the ladder; the numbers it maps to live in the funnel's
 * tuning row, derived from this order rather than authored beside it.
 * @type {readonly string[]}
 */
export const LESSON_FAMILIES = Object.freeze([
  'ordeal',
  'bond',
  'fall',
  'career',
  'house',
  'realm',
  'creed',
  'repute',
  'word',
  'milieu',
]);

/**
 * The three pull words. Ascending, so a family step is an index shift on a ladder
 * rather than a multiplication that could land under the materialization floor.
 * @type {readonly string[]}
 */
export const PULL_BANDS = Object.freeze(['faint', 'firm', 'heavy']);

/** The two sides of any axis. Neutral is not a third side (characterDrift's law). */
export const PULL_POLES = Object.freeze(['virtue', 'vice']);

/**
 * THE SILENT KIND. `experienceKindOf` collapses any string outside the vocabulary
 * to this, and it is classified into NO lesson family — so an unrecognised token
 * cannot move a soul. It is a real member of the vocabulary rather than a
 * sentinel, because "a day on which nothing happened to you" is a true thing that
 * a lived-experience feed will genuinely need to say.
 */
export const SILENT_EXPERIENCE_KIND = 'ordinary_day';

/**
 * ⭐⭐ THE AXIS ID ROSTER, NO LONGER MIRRORED — DERIVED FROM CAR L1'S CATALOG ITSELF.
 *
 * This was seventeen hand-kept strings with a comment saying "MIRRORED NOT IMPORTED:
 * L1's `paradigmAxisCatalog.js` is UNLANDED at this base". The substrate coupling
 * landed L1, so the reason expired and the fork with it. `PARADIGM_AXES[].id` IS the
 * roster now; there is no second list left to drift.
 *
 * ⭐ AND THIS IS THE ONE MIRROR OF THE FOUR WHERE AN IMPORT COSTS NOTHING. The other
 * three leaves are reachable from production through car L5's consumer door
 * (`personaSlicer` / `clergyTraitPlane` / `espionageTap` import `characterConsumers.js`),
 * so importing the catalog there would light a 628-line table on a live path and spend
 * a darkness the catalog's own walker reserves to L5's deliberate re-pointing. This
 * leaf's only importers are the funnel and the sources leaf, both of which are imported
 * by nobody — so the catalog stays unreachable from production THROUGH it, which the
 * catalog's suite asserts rather than assumes. The other three are proven equal by the
 * one mirror census in `tests/domain/npc/paradigmAxisCatalog.test.js`.
 *
 * Codepoint-ordered, so the roster is permutation-independent exactly as the kind
 * vocabulary below is.
 * @type {readonly string[]}
 */
export const PARADIGM_AXIS_IDS = Object.freeze(
  PARADIGM_AXES.map((axis) => axis.id).sort(compareCodepoint),
);

/**
 * @typedef {Object} ExperiencePull
 * @property {string} axisId  a PARADIGM_AXIS_IDS member
 * @property {string} pole    a PULL_POLES member — the SIDE, never the word
 * @property {string} band    a PULL_BANDS member — the word, never a number
 */

/**
 * @typedef {Object} ExperienceKindRow
 * @property {string} plane                 an EXPERIENCE_PLANES member
 * @property {string|null} family           a LESSON_FAMILIES member; null ⇒ silent
 * @property {readonly ExperiencePull[]} pulls
 * @property {boolean} ambient              ⇒ must declare a span (F9 as amended)
 * @property {string|null} receipt          module:token that emits it; null ⇒ none exists
 * @property {boolean} receiptDark          the receipt exists but is lit in no preset
 * @property {boolean} sourceUnverified     ⇒ no receipt found; the funnel refuses it
 * @property {boolean} ownerRulingPending   ⇒ the row's own existence/shape is a taste row
 * @property {boolean} [vectorSupplied]     ENC-2 (§12 row 10) ⇒ the ADAPTER computes this
 *   kind's pull vector and the funnel takes it, at span 1 and non-ambient. The table holds
 *   no vector for such a kind because there is no constant one to hold: what a chance
 *   meeting teaches is a function of WHO was met, and only the caller knows that. Absent
 *   on every row at this commit, so the field is inert until ENC-3 lands `met_a_foreigner`.
 */

/**
 * Shorthand for one pull, so the table below reads as the register does.
 * @param {string} axisId @param {string} pole @param {string} band
 * @returns {ExperiencePull}
 */
const pull = (axisId, pole, band) => Object.freeze({ axisId, pole, band });

/**
 * Shorthand for one row. `receipt` null and `sourceUnverified` true are the SAME
 * fact stated twice, and the test asserts they can never disagree — a row claiming
 * a receipt while marked unverified would be the exact confusion this census
 * exists to remove.
 */
/**
 * @param {string} plane @param {string|null} family
 * @param {ExperiencePull[]} pulls @param {string|null} receipt
 * @param {Partial<ExperienceKindRow>} [extra]
 * @returns {ExperienceKindRow}
 */
const row = (plane, family, pulls, receipt, extra = {}) => Object.freeze({
  plane,
  family,
  pulls: Object.freeze(pulls),
  ambient: false,
  receipt,
  receiptDark: false,
  sourceUnverified: receipt === null,
  ownerRulingPending: false,
  ...extra,
});

/**
 * THE EXPERIENCE TABLE — pack Register III, first draft, every row a CANDIDATE.
 *
 * `ambient` marks the continuous sources F9-as-amended (§853) governs: they emit
 * at INTERVAL CADENCE with TIME-INTEGRATED magnitude, never per tick. The flag is
 * data here and machinery in the funnel, which REFUSES an ambient entry that
 * declares no span — the source-design law made structural rather than remembered.
 *
 * `sourceUnverified` is this lane's measurement, not the pack's: see the receipt
 * for the per-kind census. A marked row is vocabulary WITHOUT an adapter.
 *
 * @type {Readonly<Record<string, ExperienceKindRow>>}
 */
export const EXPERIENCE_TABLE = Object.freeze({
  // ── PERSONAL: what happened TO you (hardest) ───────────────────────────────
  // NO RECEIPT: there is no NPC-to-NPC betrayal edge in the tree. The nearest
  // thing, npcGrowthKernel's `betrayal` growth signal, is SETTLEMENT-derived — it
  // is a thing that happened to the town, not to a friendship.
  betrayed_by_friend: row('personal', 'bond',
    [pull('TRUST', 'vice', 'heavy'), pull('CHEER', 'vice', 'firm')], null),
  // NO RECEIPT, AND NO HABITAT: NPC records carry no kin, spouse or sibling field
  // at all, so there is nothing a bereavement could be a bereavement OF.
  bereavement_close: row('personal', 'bond',
    [pull('CHEER', 'vice', 'firm'), pull('DEVOTION', 'virtue', 'faint')], null),
  // ENC-3 (DESIGN_ENCOUNTERS §5.3): a named person met a named foreigner abroad and
  // took something of him away. THE TABLE HOLDS NO VECTOR ON PURPOSE, and that is what
  // `vectorSupplied` declares: what a meeting teaches depends on WHO was met — the axes
  // the two charts actually differ on, and in which direction — so a constant vector
  // here would be a lie about the mechanism. The adapter supplies it per receipt, and
  // ENC-2's third admission arm in the funnel is what lets it through. NOT ambient: an
  // ambient kind divides its quantum by a season, which a one-week meeting can never
  // cross. The receipt is REAL — its adapter is homed out of leaf in
  // `livedExperienceSources.ADAPTER_HOMED_ELSEWHERE`, resolved there against the tree.
  met_a_foreigner: row('personal', 'bond', [],
    'envoyChanceMeetingStage.js:chance meeting receipts', { vectorSupplied: true }),
  // DOUBLE-DARK: the receipt is real, and BOTH its flags (infoStatecraftEnabled,
  // npcCredibilityEnabled) are absent from the defaults AND from every preset.
  caught_lying_exposed: row('personal', 'repute',
    // CHASTENING, not reinforcement: being caught pulls toward CANDOR's virtue.
    [pull('CANDOR', 'virtue', 'firm'), pull('CHEER', 'vice', 'faint')],
    'informationStatecraft.js:infowar_lie_exposed', { receiptDark: true }),
  // ⭐ THE STRONGEST SOURCE IN THE TABLE — the only kind behind no flag at all
  // (`advanceNpcCorruption` is called unconditionally from the pulse), carrying a
  // typed record, a state transition AND a per-person address.
  corruption_exposed: row('personal', 'repute',
    // RESIDUE: exposure does not leave you clean (§12 R3c's law, in the register).
    [pull('JUSTICE', 'vice', 'faint'), pull('TRUST', 'vice', 'firm')],
    'npcAgency.js:exposures -> pulseKernel.js:corruptionEvents'),
  // DARK: `npcConsequencesEnabled`. ⚠ Do NOT mistake corruption ONSET for this —
  // onset writes npcStates only and receipts nothing; the verdict is the receipt.
  turned_by_crime: row('personal', 'fall',
    [pull('JUSTICE', 'vice', 'heavy'), pull('CANDOR', 'vice', 'firm')],
    'npcVerdictTable.js:criminal_founding', { receiptDark: true }),
  captured_held: row('personal', 'ordeal',
    // ⚠ THE COURAGE HALF IS DELIBERATELY ABSENT. The register drafts it as
    // "hardens or breaks? — seeded either, weighted by current COURAGE" (taste
    // row 10). A seeded fork needs a PRNG, and this leaf is pure; inventing a
    // direction would answer an owner question in code. TRUST stands alone until
    // the pen rules, and the omission is named in LIVED_EXPERIENCE_PROVENANCE.
    [pull('TRUST', 'vice', 'firm')],
    'roadsKernel.js:capture tag + RansomRec', { ownerRulingPending: true }),
  ransomed_home: row('personal', 'ordeal',
    [pull('GENEROSITY', 'virtue', 'faint'), pull('FIDELITY', 'virtue', 'firm')],
    'roadsKernel.js:ransom tag'),
  // NO RECEIPT, AND THE SHAPE IS UNREACHABLE: `ransomChoices.js` holds an
  // ABANDONMENT_GRIEVANCE_KIND with ZERO consumers, and roads structurally
  // resolves EVERY captivity to a release at term-end or earlier. There is no
  // "never came home" outcome in this engine to teach from.
  abandoned_unransomed: row('personal', 'ordeal',
    [pull('FIDELITY', 'vice', 'firm'), pull('CHEER', 'vice', 'heavy')], null),
  // DARK and DM-ONLY: a registered store op with a UI button and NO pulse call
  // site. Real, receipted, and only ever a human's act.
  pardoned_released: row('personal', 'ordeal',
    [pull('MERCY', 'virtue', 'firm'), pull('DEVOTION', 'virtue', 'faint')],
    'npcDmVerbRecords.js:npc_pardon', { receiptDark: true }),
  // NO RECEIPT AT THIS GRAIN, BY LAW: battle and naval news are AGGREGATE on
  // purpose — armyTransitKernel states "no npc named". A survivor is not a
  // person the engine can currently point at.
  survived_battle: row('personal', 'ordeal',
    [pull('MERCY', 'vice', 'firm'), pull('COURAGE', 'virtue', 'faint')], null),
  // Both ladder outcomes ride ONE beat, gated by `npcLadderEnabled` — a virtual
  // flag lit in three presets but absent from the defaults. Not dark; not default.
  promotion_won: row('personal', 'career',
    [pull('HUMILITY', 'vice', 'faint'), pull('CHEER', 'virtue', 'firm')],
    'npcLadderKernel.js:ladderBeat(rise)'),
  rung_lost: row('personal', 'career',
    [pull('CHEER', 'vice', 'firm'), pull('CONTENT', 'vice', 'firm')],
    'npcLadderKernel.js:ladderBeat(failed)'),
  // ⚠ NO RECEIPT, AND THE TREE HAS ALREADY DECIDED THERE SHOULD NOT BE ONE.
  // `brokerageServicesRules.js` refuses the refusal path in so many words — "A
  // REFUSAL IS NOT AN EVENT" — because receipting it "would let the knowledge lane
  // certify itself off failures." The register's taste row 6 asks whether this
  // kind should teach; the tree has already answered whether it can be HEARD.
  refused_by_patron: row('personal', 'career',
    [pull('CHEER', 'vice', 'faint'), pull('HUMILITY', 'virtue', 'faint')], null,
    { ownerRulingPending: true }),
  // Fully landed and lit by DEFAULT (`npcAgencyEnabled` is true in the defaults) —
  // the cleanest verification in the set.
  goal_culminated: row('personal', 'career',
    [pull('CONTENT', 'virtue', 'firm'), pull('TEMPERANCE', 'vice', 'faint')],
    'npcAgency.js:npc_goal_culmination'),
  // The commitment events §3 names: LARGE TARGETED PUSHES riding the creed family
  // at `heavy`. They are PERSONAL, not affiliation — taking orders happens TO you,
  // whatever it happens through. NO RECEIPT for either: every `consecrat`/`ordain`/
  // `took_orders` hit in the tree is PROSE, and the one real conversion receipt is
  // a SETTLEMENT changing patron deity, never a person finding a vocation.
  took_holy_orders: row('personal', 'creed',
    [pull('DEVOTION', 'virtue', 'heavy'), pull('TEMPERANCE', 'virtue', 'firm')], null),
  converted_faith: row('personal', 'creed',
    [pull('DEVOTION', 'virtue', 'heavy')], null),

  // ── AFFILIATION: what happened to what you belong to (moderate) ────────────
  // ⚠ NAME COLLISION, AND IT IS A TRAP FOR THE ADAPTER CAR: the literal string
  // `faction_captured` exists in this tree as TWO unrelated things — an NPC
  // role-quality enum value and a ladder challenge WINDOW name — and neither is
  // ever emitted. The real receipt is `impactKind: 'faction_capture'`. Keying an
  // adapter on this kind's own name would be the phantom the law forbids.
  faction_captured: row('affiliation', 'house',
    [pull('TRUST', 'vice', 'firm'), pull('JUSTICE', 'vice', 'faint')],
    'factionCapture.js:faction_capture (to=capture)'),
  faction_cleansed: row('affiliation', 'house',
    [pull('JUSTICE', 'virtue', 'firm'), pull('CHEER', 'virtue', 'faint')],
    'factionCapture.js:faction_capture (from=capture)'),
  // NO RECEIPT AND NO POLARITY PAIR: `faction_power_shift` is a proposal payload
  // kind, not a candidateType; the only receipted neighbour
  // (`faction_rival_power_contest`) carries a power transfer solely above severity
  // 0.7. A contest is receipted; a power LEVEL change is not.
  house_power_rose: row('affiliation', 'house',
    [pull('HUMILITY', 'vice', 'faint'), pull('CHEER', 'virtue', 'faint')], null),
  house_power_fell: row('affiliation', 'house',
    [pull('HUMILITY', 'virtue', 'faint'), pull('CHEER', 'vice', 'faint')], null),
  // Receipted, but SETTLEMENT-addressed: the adapter writes the targetSaveId ->
  // NPC-home join itself, and no npcIds ride these entries.
  home_occupied: row('affiliation', 'realm',
    // SIEGE SOLIDARITY: the register's own reading, and it is the interesting one.
    [pull('MERCY', 'vice', 'firm'), pull('FIDELITY', 'virtue', 'firm')],
    'warDeployment.js:conquest'),
  // ⭐ The one kind that is already HOME-addressed by its own emitter.
  home_liberated: row('affiliation', 'realm',
    [pull('CHEER', 'virtue', 'heavy'), pull('FORBEARANCE', 'virtue', 'faint')],
    'deploymentReturn.js:occupation_lifted'),
  // ⭐ DEFAULT-ON, and car L4's executed census is what found it: the coup verdict
  // rides `stressorsEnabled`, which is TRUE in DEFAULT_SIMULATION_RULES and lit in
  // all six presets. This row was drafted as though it were preset-gated; it is the
  // FIFTH default-on kind, and the only one on the affiliation plane.
  coup_at_home: row('affiliation', 'realm',
    [pull('TRUST', 'vice', 'heavy'), pull('PRUDENCE', 'virtue', 'faint')],
    'coup.js:coup_succeeded | coup_suppressed'),
  // ⚠ NARROWED BY MEASUREMENT: a deity's `wins`/`losses` move every tick as BARE
  // MUTABLE FIELDS with no record. Only the hysteresis-dwelled TIER crossing is
  // receipted — so this kind is rare and lagging by construction, which makes it a
  // good source for decisive arcs and a bad one for per-tick fortune drift.
  god_fortunes_rose: row('affiliation', 'creed',
    [pull('DEVOTION', 'virtue', 'firm')], 'realmEvents.js:pantheon_ascendancy'),
  god_fortunes_fell: row('affiliation', 'creed',
    [pull('DEVOTION', 'vice', 'firm')], 'realmEvents.js:pantheon_twilight'),

  // ── WITNESS: what you lived among and heard (gentle) ───────────────────────
  // ⚠⚠ NARROWED, AND THE NARROWING MATTERS: §3 writes milieu as "dwell in ANY
  // settlement", but the whereabouts mirror is an AWAY-ONLY structure — its states
  // are traveling/visiting/returning/hostage, and roads DELETES the key when the
  // NPC is home. A soul at home is invisible to this source by construction, so
  // the "gentle man in a cruel city" §800.4 promises only works for VISITORS today.
  // (`npcResidency.js` is the near-perfect fit for home-dwell and has ZERO src
  // importers; its own certification row calls a residency deposit
  // "NOT EXPRESSIBLE FROM ANY RECEIPT". Wiring it would be minting a source.)
  dwell_milieu: Object.freeze({
    plane: 'witness',
    family: 'milieu',
    // ⚠ THE PULLS ARE EMPTY BY DESIGN, AND THIS IS THE ONE ROW WHERE THAT IS THE
    // TRUTH. §800.4 (5): ambient milieu pull touches ALL AXES toward the HOST
    // SETTLEMENT's poles — the vector is a read of the host's conduct plane and
    // alignment at the moment of dwell, not a constant this table could hold. The
    // adapter (car L4) computes it and supplies it; the table's job is to declare
    // the row ambient, name its family, and refuse to freeze a variable.
    pulls: Object.freeze([]),
    ambient: true,
    receipt: 'roadsKernel.js:whereabouts mirror (stayWeeks) + impactKind roads',
    receiptDark: false,
    sourceUnverified: false,
    ownerRulingPending: true,
  }),
  // ⭐⭐ ADMITTED AT THE SUBSTRATE COUPLING — the kind W-FAITH's witness adapter
  // MINTED and this catalog OWED (§806/F14; DESIGN_W_FAITH D4/D5(2); W-LIVES §6).
  // `faithWitnessSource.js` has emitted `faith_milieu` since car F3c and declared,
  // in its own header, that "this adapter's output is refused at the funnel door by
  // construction, which is the correct dormant state" until the row exists. The two
  // stacks now share a tree, so the debt is paid rather than restated.
  //
  // ⚠ WHY IT IS NOT A SECOND SPELLING OF `dwell_milieu`, WHICH WOULD BE THE EASY
  // MISTAKE. Both are witness/milieu/ambient and both ride the SAME dwell — but they
  // read different teachers off it: `dwell_milieu` is what a settlement's CONDUCT
  // teaches a soul who lives in it, `faith_milieu` is what its GODS do. W-LIVES §3
  // lists them as separate witness-plane sources and §6 names the faith pull
  // explicitly, so folding them would delete a distinction the volumes make. The
  // §856 non-overlap law is not engaged: it governs signals npcGrowthKernel already
  // eats, and no term here is one of its eight.
  //
  // ⚠ PULLS EMPTY, FOR THE SECOND TIME IN THIS TABLE AND FOR A DIFFERENT REASON.
  // `dwell_milieu`'s vector is a read of the HOST SETTLEMENT; this one's is a read
  // of the DEITY'S AUTHORED CHART (`characterAxes`), demoted by exposure. Neither is
  // a constant a table could hold, and the funnel accepts a caller-supplied vector
  // ONLY for an ambient kind whose tabled vector is empty — so this shape is forced
  // by the funnel's own guard, not chosen.
  //
  // ⛔ THE ADAPTER IS REAL BUT IT IS NOT HOMED IN `livedExperienceSources.js`, and
  // that is stated in `ADAPTER_HOMED_ELSEWHERE` there rather than left to be
  // discovered. Registering it into the source roster is W-FAITH car 6's bill (the
  // faith-pull SOURCE ADAPTER + the clergy re-route, Opus seat, recon row first).
  faith_milieu: Object.freeze({
    plane: 'witness',
    family: 'milieu',
    pulls: Object.freeze([]),
    ambient: true,
    receipt: 'faithWitnessSource.js:faithWitnessEntries (religionState pantheon x pietyField) x roadsKernel.js whereabouts dwell',
    receiptDark: false,
    sourceUnverified: false,
    // The row's EXISTENCE is ruled (W-LIVES §6, W-FAITH D4). What is unsigned is the
    // adapter's exposure ladder, and that lives in `FAITH_WITNESS_TUNING` where the
    // pen can reach it — not here.
    ownerRulingPending: false,
  }),
  // NO RECEIPT AT THIS GRAIN: the settlement's plague ending IS receipted
  // (`stressor_aftermath` over a `disease_outbreak`, carrying peakSeverity), but
  // "this person survived it" is not — that needs presence-at-home, which is
  // exactly the gap `dwell_milieu` names above.
  plague_season_survived: Object.freeze({
    plane: 'witness',
    family: 'milieu',
    pulls: Object.freeze([pull('DEVOTION', 'virtue', 'faint'), pull('CHEER', 'vice', 'faint')]),
    ambient: true,
    receipt: null,
    receiptDark: false,
    sourceUnverified: true,
    ownerRulingPending: false,
  }),
  // ⚠⚠ NO RECEIPT, AND THE MACHINERY THE REGISTER NAMES DOES NOT DO WHAT THE NAME
  // SUGGESTS. distancePricedNews prices staleness and carries no news;
  // fidelityNoise is decision-noise, not belief; and beliefMap's OBSERVERS AND
  // SUBJECTS ARE BOTH SETTLEMENTS. A per-PERSON belief about a specific event does
  // not exist anywhere in the tree. These two rows are the register's largest gap.
  news_believed_atrocity: row('witness', 'word',
    [pull('MERCY', 'vice', 'faint'), pull('TRUST', 'vice', 'faint')], null),
  news_believed_triumph: row('witness', 'word',
    [pull('CHEER', 'virtue', 'faint'), pull('COURAGE', 'virtue', 'faint')], null),
  // ⭐ NOT DARK — CORRECTED BY CAR L4's EXECUTED PRESET CENSUS. This row was drafted
  // `receiptDark: true`; running the real preset table shows `traditionsEnabled`
  // sits in the ONE_REGEN fragment (`simulationRules.js:666`) and is therefore lit
  // in dramatic_campaign, living_realm and full_simulation — and, SINCE THE LIGHTING
  // WAVE LIT THE DEFAULT PRESET (L-DEFAULT hunk 1, 2026-09-06), in realistic_regional
  // too: the SAME four presets as roads and the ladder, which share that one fragment.
  // The count read THREE until that hunk and is kept visible here rather than erased;
  // the address read :499, already stale before the hunk, corrected by measurement.
  // It is preset-gated, exactly like `captured_held` and
  // `promotion_won`, and not dark at all.
  // AGGREGATE by its own header, though — "the town's festival, never a named
  // soul's fate". The per-soul join EXISTS and the adapter uses it: the roads
  // `observance` purpose sends a NAMED npc to a festival, so the legitimate hook is
  // that journey CROSSED with the tradition's outcome.
  festival_kept: row('witness', 'word',
    [pull('CHEER', 'virtue', 'faint'), pull('CONTENT', 'virtue', 'faint')],
    'traditionsKernel.js:tradition (TRADITION_OUTCOME) x roads observance'),

  // ── THE SILENT KIND ───────────────────────────────────────────────────────
  // No family, so it teaches nothing; a real vocabulary member, so the fallback is
  // an honest sentence rather than a sentinel.
  [SILENT_EXPERIENCE_KIND]: row('witness', null, [], 'n/a - teaches nothing'),
});

/**
 * THE CLOSED VOCABULARY, codepoint-ordered so the list is permutation-independent
 * and the census bill's arithmetic is reproducible.
 * @type {readonly string[]}
 */
export const LIVED_EXPERIENCE_KINDS = Object.freeze(
  Object.keys(EXPERIENCE_TABLE).sort(compareCodepoint),
);

const KIND_SET = new Set(LIVED_EXPERIENCE_KINDS);

/**
 * kind -> lesson family, DERIVED from the table so a family list and a table row
 * can never disagree. The silent kind maps to `null`, which is what makes it
 * silent: the funnel emits nothing for a null family rather than defaulting.
 * @type {Readonly<Record<string, string|null>>}
 */
export const LESSON_FAMILY_OF = Object.freeze(Object.fromEntries(
  LIVED_EXPERIENCE_KINDS.map((kind) => [kind, EXPERIENCE_TABLE[kind].family]),
));

/**
 * family -> the kinds it teaches, DERIVED. Present so the partition test can
 * assert the reverse direction against a structure built the other way round from
 * the one it checks.
 * @type {Readonly<Record<string, readonly string[]>>}
 */
export const LESSON_FAMILY_KINDS = Object.freeze(Object.fromEntries(
  LESSON_FAMILIES.map((family) => [
    family,
    Object.freeze(LIVED_EXPERIENCE_KINDS.filter((kind) => EXPERIENCE_TABLE[kind].family === family)),
  ]),
));

/** The kinds classified into NO family — they teach nothing. @type {readonly string[]} */
export const SILENT_EXPERIENCE_KINDS = Object.freeze(
  LIVED_EXPERIENCE_KINDS.filter((kind) => EXPERIENCE_TABLE[kind].family === null),
);

/**
 * plane -> its kinds, DERIVED. The plane partition's reverse direction.
 * @type {Readonly<Record<string, readonly string[]>>}
 */
export const PLANE_KINDS = Object.freeze(Object.fromEntries(
  EXPERIENCE_PLANES.map((plane) => [
    plane,
    Object.freeze(LIVED_EXPERIENCE_KINDS.filter((kind) => EXPERIENCE_TABLE[kind].plane === plane)),
  ]),
));

/**
 * The kinds carrying no verified receipt in the tree. The L4 adapter car MAY NOT
 * wire these; they are vocabulary and a visible gap, never a phantom source.
 * @type {readonly string[]}
 */
export const SOURCE_UNVERIFIED_KINDS = Object.freeze(
  LIVED_EXPERIENCE_KINDS.filter((kind) => EXPERIENCE_TABLE[kind].sourceUnverified),
);

/**
 * The kinds whose receipt EXISTS — the ones an adapter may honestly wire. The
 * complement of SOURCE_UNVERIFIED_KINDS, derived rather than listed so the two can
 * never drift apart.
 * @type {readonly string[]}
 */
export const RECEIPTED_EXPERIENCE_KINDS = Object.freeze(
  LIVED_EXPERIENCE_KINDS.filter((kind) => !EXPERIENCE_TABLE[kind].sourceUnverified),
);

/**
 * The kinds whose receipt exists but whose flag is lit in NO preset. An adapter
 * may wire them; nothing will arrive until somebody lights the flag. Named so that
 * "wired and silent" is a legible state rather than a bug hunt.
 * @type {readonly string[]}
 */
export const RECEIPT_DARK_KINDS = Object.freeze(
  LIVED_EXPERIENCE_KINDS.filter((kind) => EXPERIENCE_TABLE[kind].receiptDark),
);

/** The kinds that must declare a span (F9 as amended, §853). @type {readonly string[]} */
export const AMBIENT_EXPERIENCE_KINDS = Object.freeze(
  LIVED_EXPERIENCE_KINDS.filter((kind) => EXPERIENCE_TABLE[kind].ambient),
);

/**
 * Provenance, in the module, so a reader who reaches the code before the docs
 * learns the signature status here (the L1 catalog's idiom).
 * @type {Readonly<{ status: string, signedBy: string|null, source: string,
 *   ownerRows: readonly string[], consumers: string }>}
 */
export const LIVED_EXPERIENCE_PROVENANCE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (pack Register III, first draft)',
  signedBy: null,
  source: 'docs/briefs/W-REGISTERS-PACK.md Register III, as amended by DESIGN_W_LIVES §15/§853',
  ownerRows: Object.freeze([
    'the whole kind roster, every plane assignment, every family assignment and every pull vector',
    'taste row 10 — captured_held: does it HARDEN or BREAK? The register drafts a seeded fork weighted by current COURAGE; this leaf is pure and carries only the TRUST half, so the COURAGE pull is ABSENT rather than guessed',
    'taste row 6 — whether refused_by_patron teaches at all (carried with the register draft so there is something to strike)',
    'taste row 12 — the family learn-rate ladder ORDER (carried as LESSON_FAMILIES order; the funnel derives its steps from that order mechanically rather than authoring rates)',
    'dwell_milieu carries NO fixed pulls: §800.4 makes its vector a read of the HOST settlement, so the adapter computes it and the table refuses to freeze a variable',
    'faith_milieu (admitted at the substrate coupling, §806/F14) carries no fixed pulls either, for a DIFFERENT reason: its vector is the DEITY\'S AUTHORED chart demoted by exposure. Its existence is ruled (W-LIVES §6); what is unsigned is the exposure ladder in faithWitnessSource.FAITH_WITNESS_TUNING, and whether a soul may be taught by BOTH milieu rows in one season is an aggregate question F11 answers over the summed ambient equilibrium rather than per-row',
    'whether the commitment kinds (took_holy_orders, converted_faith) belong on the PERSONAL plane as drafted here, or ride AFFILIATION with the rest of the creed family',
  ]),
  // Raised BY the source census, and each is a decision above this lane's seat.
  raisedByCensus: Object.freeze([
    '⚠⚠ npcGrowthKernel.js IS ALREADY A LIVED-EXPERIENCE FUNNEL — eight settlement signals onto learned traits, LIT in three presets, keyed on the POSITIONAL nid that L2 refuted. EXTEND its GROWTH_DEPOSIT_MAP or stand beside it? Two vocabularies over the same souls is the fork class bandedStock was minted to end',
    '⚠⚠ THE MILIEU SOURCE ONLY SEES VISITORS: whereabouts is away-only (roads DELETES the key at home), so §800.4\'s "gentle man in a cruel city" cannot reach a resident today. npcResidency.js is the fit and has zero importers; its certification row calls the deposit NOT EXPRESSIBLE FROM ANY RECEIPT',
    'THE WITNESS PLANE IS NEARLY EMPTY: per-PERSON belief about an event does not exist (beliefMap observers and subjects are both SETTLEMENTS), so news_believed_* has no source at all — the register\'s largest single gap',
    'refused_by_patron: the tree has already ruled a refusal is NOT an event, in those words. Taste row 6 asks whether it should teach; this asks whether it can be heard',
    'TWELVE of THIRTY-TWO kinds carry no receipt (SOURCE_UNVERIFIED_KINDS) and THREE of the remaining twenty are receipt-dark (RECEIPT_DARK_KINDS): the lit surface is far smaller than the register implies, and FIVE are on by DEFAULT — corruption_exposed, goal_culminated, faction_captured, faction_cleansed and coup_at_home (car L4 corrected the last two figures by executing the real preset table rather than reading the flag files: festival_kept is preset-lit, not dark, and the coup verdict rides the default-on stressorsEnabled)',
  ]),
  consumers: 'livedExperienceFunnel.js only; NONE in production by design (the adapters are car L4)',
});

/**
 * THE TOLERANT READER, with the silent fallback. Any string outside the closed
 * vocabulary collapses to `SILENT_EXPERIENCE_KIND` — so an engine token that
 * escaped its home, a typo in an adapter, or a kind from a future version cannot
 * move a soul. It reads as a day on which nothing happened, which is the honest
 * thing to say about an event nobody classified.
 * @param {unknown} value @returns {string} a LIVED_EXPERIENCE_KINDS member
 */
export function experienceKindOf(value) {
  const kind = typeof value === 'string' ? value : '';
  return KIND_SET.has(kind) ? kind : SILENT_EXPERIENCE_KIND;
}

/**
 * The table row for a kind, TOTAL: an unknown kind reads as the silent one's row,
 * so every accessor below is total without a guard.
 * @param {unknown} value @returns {ExperienceKindRow}
 */
export function experienceRowOf(value) {
  return EXPERIENCE_TABLE[experienceKindOf(value)];
}

/**
 * The plane a kind teaches on. The KIND owns its plane — an entry may declare one
 * as a cross-check, but it may not choose one (see the funnel's plane_mismatch
 * refusal). Closest-plane-wins then operates over ENTRIES, which is where the same
 * event reaching one person two ways actually gets resolved.
 * @param {unknown} value @returns {string} an EXPERIENCE_PLANES member
 */
export function planeOfKind(value) {
  return experienceRowOf(value).plane;
}

/**
 * How close a plane stood, as a rank: 0 is closest. An unknown plane sorts LAST
 * (never closest), so a malformed declaration can never win a precedence contest.
 * @param {unknown} plane @returns {number}
 */
export function planeRank(plane) {
  const rank = EXPERIENCE_PLANES.indexOf(typeof plane === 'string' ? plane : '');
  return rank === -1 ? EXPERIENCE_PLANES.length : rank;
}

/**
 * The lesson family a kind belongs to, or `null` for a silent kind.
 * @param {unknown} value @returns {string|null}
 */
export function familyOfKind(value) {
  return experienceRowOf(value).family;
}

/**
 * The pull vector for a kind, in band words. Empty for a silent kind, for an
 * unverified kind's adapter to notice, and for `dwell_milieu`, whose vector is a
 * read of the host settlement rather than a constant.
 * @param {unknown} value @returns {readonly ExperiencePull[]}
 */
export function pullsOfKind(value) {
  return experienceRowOf(value).pulls;
}
