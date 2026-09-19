/**
 * Review addendum A-1 — prose-numerics class-kill + legacy ratchet.
 *
 * Reader prose may name quantities in world words, bands, and honest whole
 * counts. It may not expose the engine's float/scalar notation. This scanner
 * covers authored headline/summary/reason/receipt templates in JavaScript under
 * src and
 * the full E-E JSX corpus. Its four detector classes are independently mutant-
 * proven below; live debt is frozen by exact path + line + snippet identity in
 * .prose-numerics-baseline.json and may only shrink.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { scanProseNumericsSource } from '../helpers/proseNumericsWalk.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BASELINE_PATH = join(ROOT, 'tests/lint/.prose-numerics-baseline.json');
// CW-0w slice 4 admits the FIFTH detector class with its own ceiling. The four
// above are untouched: the push-indirection walk defers to them, so a leak they
// already see keeps its own category and only what escaped every named prose
// surface becomes a pushIndirection row. Measured at landing: exactly 3, all
// three in relationshipMemory.js's postureReasons, which the scanner had never
// seen at all.
//
// 2026-09-19 — THE DEBT FELL BY ONE AND THE CEILINGS FOLLOW IT DOWN. 225 -> 224, floatInterpolation
// 148 -> 147: DefenseSecurity.jsx's `{Math.round(sc.score)}` — the raw capability digit beside the
// PDF's capability rows — was replaced by the band word the screen prints (R-5b item #20, the
// 2026-09-18 fixes consist), so its row leaves the baseline as a CURE, never a bank. Every other
// row kept its path, category and snippet at a new address (the build's line moves), regenerated
// by the test's own scanner; the +1 arm below states the new figures.
//
// CR-FP-2 — THE ONE RULED RE-RECORD (FP cycle 1 close). 404 -> 413.
//
// This is a DELIBERATE upward move of three ceilings, recorded here because the
// rule elsewhere in this file is that ceilings only fall. It was ruled once, for
// a ratchet that had been RED AT BASE since the war lane, and the measurement
// behind it is this:
//
//   - The instrument is byte-identical to the one that recorded the 404 census
//     (tests/helpers/proseNumericsWalk.js, unchanged since e30770bd). Running it
//     against the e30770bd tree yields 413, not 404: the slice-4 commit banked a
//     baseline its own scanner already disagreed with by nine rows. The
//     PRE-slice-4 walker against that same tree yields 410 — the identical nine
//     rows, minus the three pushIndirection finds. So the gap is NOT instrument
//     reach; slice 4's reach was fully absorbed at 401 -> 404.
//   - The nine rows are war-lane prose authored between WR-2 and CW-0w, which
//     nobody re-recorded: conquestFeasibility.js (WR-8 slice 1, e8354fb9),
//     occupation.js x2 sentences (W8-C slice 3, ab71f940), razing.js (WR-8
//     slice 4, bf731ea6) — four REAL reader-prose float leaks — plus three rows
//     on receipt-SHAPED ledger fields that are not prose at all (the `receipt:`
//     key and the `receiptTick` name pull `Math.floor` ids and integer ticks
//     into the walk: warCoalitionExpenditure.js x2, warCostsNews.js x1).
//   - Everything else that moved is address rot, not debt: 88 pure line moves
//     and 13 WR-7b decomposition relocations (peaceTerms.js ->
//     peaceTermsDrafting.js x6, warDeployment.js -> warHomeCosts.js x6 and
//     warSiegeVerdict.js x1). This discharges SOL-BANK-2's parked line-drift
//     red, whose "line-location drift CONFIRMED, whole-baseline equivalence
//     PLAUSIBLE" is now measured on both counts.
//   - FP cycle 1 authored ZERO prose numerics. Between e30770bd and this
//     commit the live hit set changed by exactly four rows, all four the same
//     two tradeWar.js sentences at shifted line addresses after TR-1's seam.
//
// FOUR SENTENCES ARE THEREFORE FROZEN AS UN-HUMANIZED DEBT, not as clean rows.
// They are owed a humanization wave and are named above so the debt cannot be
// lost in the count. Ceilings are pinned to the EXACT live census rather than
// rounded up, so the next leak of any class is red on arrival.
// HK-1 (ODQ §445.3) — SIX PURE LINE MOVES, NO DEBT MOTION. The clandestine-facet cure adds
// eleven lines to institutionLifecycle.js above its prose block, so the six rows that file
// owns re-address 764 -> 775, 832 -> 843 and 833 -> 844. This is the ADDRESS-ROT shape the
// CR-FP-2 note above already names ("88 pure line moves"), and it is re-addressed rather
// than regenerated or deleted: path, category and snippet are byte-identical on all six,
// the census stays at 413 against a 413 ceiling, and no other row in the file moved (the
// whole diff is twelve lines, six -/+ pairs). No prose numeric was authored by that member.
// TE-CH-4 (ODQ §555) — ONE PURE LINE MOVE, NO DEBT MOTION. The district-profile registry car
// inserts the QUARTER_CATEGORY table, the canonical-routing preference lists and their
// rationale above districtProfile.js's prose block, so the single row that file owns
// re-addresses 238 -> 373. Same shape as CR-FP-2's "88 pure line moves" and HK-1's six above:
// path, category and snippet are byte-identical, the census stays at 413 against a 413
// ceiling, and districtProfile.js owns no other row that could have moved with it.
// ⚠ The car's added COMMENTS are dense with measured figures ("168 of 168", 3,038 factions,
// a 504-settlement corpus). None of them is debt and none is in this baseline: the detector
// reads numerics that FLOW INTO A PROSE KEY, not numbers written in comments. Humanizing
// them would have removed reviewable evidence to satisfy an instrument that never saw it.
// ── LOWERED 2026-08-29 BY TE-STRIP-1 (owner ruling, ODQ §725) ─────────────────────
// 413 → 408, floatInterpolation 236 → 233, percentToken 79 → 77. THE CAUSE IS TWO DELETED
// FILES and nothing else: src/components/townMap/scene3d/TownSceneInspector.jsx (3 rows —
// the severity-permille readouts) and TownSceneViewerControls.jsx (2 rows — the effective-
// percent readout) left with the legacy settlement map's UI. EVERY REMOVED ROW WAS REVIEWED
// against the diff, as this ratchet's own message demands; the only other baseline movement
// is two pure LINE re-addresses (OutputContainer.jsx 983→966, LandingArtifacts.jsx 187→185)
// where path, category and snippet are byte-identical and the shrink came from lines this
// lane deleted above them. multiplier/twoDecimalScore/pushIndirection are untouched.
// ⛔ THE CEILINGS HAD TO COME DOWN WITH THE BASELINE, AND THE GATE PROVED IT. Leaving them
// at 413/236 was tried first: the '+1 leak' control below reds, because with live at 408 a
// planted leak lands at 409 — comfortably UNDER a stale 413 — so the control that exists to
// prove a regenerated baseline cannot launder a leak would itself have gone vacuous. A
// shrink here is not optional bookkeeping; the ceiling IS the control's teeth.
// TE-CAP (WEAVE W-CAP CAP-3, ODQ §758) — TWO PURE LINE MOVES, NO DEBT MOTION, NO CEILING
// CHANGE. The climate-band car adds the `amplitudeByClimate` table, the `climateBandFor`
// reader and their rationale ABOVE seasons.js's prose block, so the two rows that file owns
// — one `floatInterpolation`, one `percentToken`, both on the same hungry-gap reason line —
// re-address 252 -> 318. Same shape as CR-FP-2's "88 pure line moves", HK-1's six and
// TE-CH-4's one above: path, category and snippet are byte-identical on both, the census
// stays at 408 against a 408 ceiling, and seasons.js owns no other row that could have moved
// with them. The whole baseline diff is four lines, two -/+ pairs.
// ⚠ The car's added comments carry measured figures of their own (band cuts −5/25/8/5/4/10,
// amplitudes 38/30/22). None is debt and none is in this baseline: the detector reads
// numerics that FLOW INTO A PROSE KEY, not numbers written in comments — the same
// distinction TE-CH-4's note above had to draw.
// T7 · HYGIENE (car TE-NPCGEN-1a, ODQ §759 weakness 4) — SEVEN PURE LINE MOVES, NO DEBT
// MOTION, NO CEILING CHANGE. The 23-site institution-toggle ladder collapses onto one shared
// reader, which costs each of three consumers an import line and two of them a rationale
// comment ABOVE their existing prose. So six rows in assembleInstitutions.js re-address
// 61 -> 62 and 68 -> 69, and one in discoverDependencyCandidates.js goes 441 -> 443 (its
// file gained the `careServices` note in the same train's E-RES-11 car). Same shape as
// TE-CAP's two, CR-FP-2's eighty-eight and HK-1's six: path, category and snippet are
// byte-identical on every one, the census stays at 227 against a 227 ceiling, and no other
// row in either file could have moved with them. The whole baseline diff is fourteen lines,
// seven -/+ pairs.
// T11 · UI LANDING (§805/§807/§815, 2026-08-31) — SEVEN NEW LEAKS HUMANIZED, EIGHT PURE LINE
// MOVES RE-ADDRESSED, NO CEILING CHANGE. The lane's own gate run was the first instrument to
// see this file, and it caught both shapes at once. They are recorded separately because they
// are answered differently, which is the whole point of the exact-identity baseline:
//   · THE SEVEN ARE PAID, NOT BANKED. FaithTab's patron line carried
//     `(rightful claim ${Math.round(patron.legitimacy * 100)}%)` one space after the band word
//     that already said it — an engine scalar restating a word — and it is DELETED, not
//     re-sited. Its niche rows carried `{d.standing} · {d.share}%`, copied in shape from
//     FaithSection.jsx:174, which is itself BANKED DEBT in this very file: `standing` is a
//     finite typed word and is now named `standingWord`, and `share` is banded through a new
//     `shareBandLabel` beside faithPanelModel's two existing band helpers. PowerTab's
//     `chain.power.government` and WarTab's `b.confidence`/`b.staleness` were words all along,
//     read through paths whose FLOAT_TOKENS (`power`, `confidence`) made them look scalar;
//     each is declared at its render with this walker's own word-suffix convention, which the
//     sibling fields on the very same WarTab record (`strengthWord`, `readinessWord`) already
//     use. ⚠ THE LESSON WORTH KEEPING: a banked row is DEBT, never a sanctioned idiom to copy
//     into a new surface — the debt in FaithSection is exactly what taught FaithTab the shape.
//   · THE EIGHT ARE ADDRESS ROT. §815 inserts the ruling-chain block at the top of PowerTab
//     and §807(b) adds a mount to OutputContainer, so rows below them re-address:
//     OutputContainer 966 -> 979, LayersPanel 229 -> 231 (x2), PowerTab 81 -> 149,
//     130 -> 198, 200 -> 268 (x2), 212 -> 280. Same shape as CR-FP-2's eighty-eight, HK-1's
//     six, TE-CH-4's one, TE-CAP's two and T7's seven: path, category and snippet are
//     byte-identical on all eight, and the whole baseline diff is sixteen lines, eight -/+
//     pairs, verified by grepping the diff for any changed line that is not a `"line"` value.
// The census ends at 227 against a 227 ceiling — the seven additions net out against nothing,
// because they were cured rather than counted. No ceiling moved in either direction.
// TAIL-F · W-FAITH LANDING (the F5c->F6c->F7c consist) — ONE ROW THAT WAS NEVER DEBT, CURED
// BY RENAME, AND SEVEN PURE LINE MOVES. NO CEILING CHANGE, NO DEBT MOTION.
//   · THE ONE IS NOT A LEAK, AND THE PRECEDENT FOR SAYING SO IS IN THIS FILE. F7c's faith-tab
//     deepening rows render `{' · '}{g.channelWord}{' · '}{g.strength}` at FaithTab.jsx:97.
//     `strength` HOLDS A WORD — the model types it `@property {string}` over the closed
//     vocabulary `faint | firm | heavy`, and the leaf's own arm 'NO NUMERAL ever reaches a
//     display string' asserts that no digit occurs in any emitted string. ⚠ THAT SENTENCE IS
//     WRITTEN IN WORDS ON PURPOSE: spelling the matcher call here convicted this very file
//     in `negativeAssertionAnchor`, which line-scans the TEST corpus and cannot tell a
//     citation from a call — the same shape §879.15's PAIDFIX row records, where the prose
//     was right and only its placement was wrong for a line-scan walker. The detector
//     fired on the IDENTIFIER, whose last camel token is a FLOAT_TOKEN — character for
//     character the shape HER-7 already ruled above at `settlementPolitics.js:358`, whose
//     note reads 'the cure is the RENAME and nothing else; the emitted sentence is
//     byte-identical'. So: `strength` -> `strengthWord`, matching the two siblings on the
//     very same record (`channelWord`, and the top-3 rows' `levelWord`) and the
//     `strengthWord`/`readinessWord` pair T11's note names on the WarTab record. The rendered
//     sentence is byte-identical; the row leaves this census because it was never owed.
//     ⚠ IT IS CALLED OUT RATHER THAN COUNTED QUIETLY, exactly as HER-7's note demands of a
//     census row cleared by renaming — and it is the SECOND sighting of T11's lesson that a
//     banked row is debt and never an idiom to copy: FaithSection taught FaithTab the shape,
//     and FaithTab taught the deepening model this one.
//   · THE SEVEN ARE ADDRESS ROT. F7c act 3 replaces the retired `temperamentAxis` tag with the
//     derived `temper` and puts a three-line rationale above it at FaithWar.jsx:289 — entirely
//     ABOVE every row that file owns — so all seven re-address +3: 332 -> 335 (x2),
//     340 -> 343 (x2), 410 -> 413 (x3). Same shape as CR-FP-2's eighty-eight, HK-1's six,
//     TE-CH-4's one, TE-CAP's two, T7's seven, T11's eight and T12's one: path, category and
//     snippet are byte-identical on all seven (verified by reading each snippet back at its NEW
//     address, not assumed), FaithWar.jsx owns exactly seven rows and all seven moved, and the
//     whole baseline diff is fourteen lines, seven -/+ pairs — grepped for any changed line
//     that is not a `"line"` value, as T11's note prescribes, and there is none.
// The census ends at 225 against a 225 ceiling; floatInterpolation holds at 148. No ceiling
// moved in either direction, and this consist authored no prose numeric that survives.
// T13 TRANS LANDING (ODQ §883, 2026-09-02) — TWO PURE LINE MOVES, NO CEILING CHANGE, NO
// DEBT MOTION. The cross-engine transcendental retirement's Car 4 family (vi) (`5eb02872d`)
// rewrites moralDrift.js:221's integer-exponent power as an exact multiply and adds one net
// line ABOVE the reckoning sentence, so the two rows that file owns re-address 314 -> 315.
// Path, category and snippet are byte-identical on both — and they are TWO CATEGORIES, not
// one: `floatInterpolation` and `twoDecimalScore` freeze the same sentence under two rules,
// which is why the diff is four lines rather than two. Same shape as CR-FP-2's eighty-eight,
// HK-1's six, TE-CH-4's one, TE-CAP's two, T7's seven, T11's eight, T12's one and TAIL-F's
// seven; the whole baseline diff is four lines, two -/+ pairs, grepped for any changed line
// that is not a `"line"` value, as T11's note prescribes, and there is none. ⚠ WORTH SAYING
// PLAINLY: the consist's own pre-board read this register as UNMOVED and it was wrong — the
// walker freezes debt by exact path AND line AND snippet, so a cure three hundred lines away
// in the same file is enough to re-address it. A landing that only greps for NEW leaks will
// miss this class every time; the check that catches it is the register's own run.
// The census ends at 225 against a 225 ceiling; floatInterpolation holds at 148. No ceiling
// moved in either direction, and this consist authored no prose numeric: its thirty cured
// sites are arithmetic, and the two new kernel leaves emit no reader prose at all.
// T12 · W-MEM LANDING (ODQ §834, 2026-08-31) — ONE PURE LINE MOVE, ZERO NEW LEAKS.
// The Remembrance ledger's registration car inserts twelve lines into worldSnapshotPublic.js
// at its hard-deny block, entirely ABOVE the one banked row that file carries, so that row
// re-addresses 603 -> 615. Path, category and snippet are byte-identical, the census stays at
// 227 against a 227 ceiling, and no category count moves (floatInterpolation holds at 149).
// Same shape as CR-FP-2's eighty-eight, HK-1's six, TE-CH-4's one, TE-CAP's two, T7's seven
// and T11's eight; the whole baseline diff is two lines, one -/+ pair. ⭐ WORTH SAYING
// PLAINLY, because the lane's brief predicted the opposite: this lane authored NO new prose
// numeric. Its own new leaves carry none, and the row that moved is pre-existing banked debt
// — a cap computation, not reader prose — so there was nothing here to humanize.
// THE PADLOCK REMOVAL (owner order 2026-09-17: "remove the other padlocks") — TWO PURE LINE
// MOVES, NO CEILING CHANGE, NO DEBT MOTION. Deleting the roster row's padlock (the copy block,
// the tone constants, the row state and the control) removes twenty-two lines ABOVE the two
// relationship rows npcComponents.jsx owns, so `{rel.strength}` re-addresses 154 -> 132 and
// `{rel.tension}` 161 -> 139. Path, category and snippet are byte-identical, the census stays at
// 225 against a 225 ceiling, and no category count moves. The whole baseline diff is four lines,
// two -/+ pairs, `"line"` values and nothing else.
// COMPENDIUM TRIM (owner order 2026-09-16: the map lenses and interior pages removed from the
// Compendium) — ONE PURE LINE MOVE, NO CEILING CHANGE, NO DEBT MOTION. Deleting the Lenses
// and Facets hubs from CatalogHubs.jsx removes fifty-two lines ABOVE the Calamity hub's
// severity row, so the one row that file owns (`multiplier`, `{b.scale}`) re-addresses
// 95 -> 43. Path, category and snippet are byte-identical, the census stays at 225 against a
// 225 ceiling, and the removed hubs carried no banked row. The whole baseline diff is two
// lines, one -/+ pair, a `"line"` value and nothing else.
// THE DOSSIER-UI FIXES (owner order 2026-09-18, "impliment every fix") — PURE LINE MOVES IN
// FOUR FILES, NO CEILING CHANGE, NO DEBT MOTION. The NPC card's goal repair and its phone
// prose floor add four lines ABOVE the two relationship rows npcComponents.jsx owns, so
// `{rel.strength}` re-addresses 132 -> 136 and `{rel.tension}` 139 -> 143; the Power tab's
// basis-caption grouping adds thirty-three lines ABOVE every row PowerStrata.jsx owns, so its
// distribution-bar pair re-addresses 189 -> 222, `{pct}` 191 -> 224 and `{r.power}`
// 232 -> 265; the phone prose floor adds nine lines above TableView's `{pressure}`
// (236 -> 245) and nine above SessionMode's `{n?.power || 0}` (436 -> 445), and one more above
// npcComponents' pair (so 132 -> 137 and 139 -> 144) when the floor helper moved out of
// `hooks/useIsMobile.js` into its own `design/proseScale.js` leaf and each consumer's single
// import line became two. Path, category and snippet are byte-identical in all eight, the
// census stays at 225 against a 225 ceiling, and no category count moves. The whole baseline
// diff is sixteen lines, eight -/+ pairs, `"line"` values and nothing else.
// THE SAME ORDER'S REMAINDER (2026-09-18, second sitting) — ONE MORE PURE LINE MOVE IN
// PowerStrata.jsx, NO CEILING CHANGE, NO DEBT MOTION. Carrying the prose floor into the
// faction and web strata adds two import lines and a five-line hook block ABOVE every row
// that file owns, so all four re-address by seven: the distribution-bar pair 222 -> 229,
// `{pct}` 224 -> 231 and `{r.power}` 265 -> 272. The five other files this car touches
// (serviceComponents, NarrativeNote, Primitives' PlotHook, neighbourComponents,
// DossierNarrativeBanner) carry NO banked row, and npcComponents' pair is untouched because
// its edits all sit below line 144. Path, category and snippet are byte-identical, the
// census stays at 225 against a 225 ceiling, and no category count moves.
// ══ LOWERED BY TE-HERALD-1, THE HUMANIZATION WAVE (owner directive, ODQ §754.3;
//    boundary ruled §763.2) ═══════════════════════════════════════════════════════
// This is the wave the four sentences frozen above were "owed". The debt named in the
// CR-FP-2 note — "FROZEN AS UN-HUMANIZED DEBT, not as clean rows… owed a humanization
// wave" — is being PAID, not re-addressed: the reader prose at each cured site now
// carries the fact the arithmetic used, in world words, and the row leaves this census
// because the leak is gone rather than because it moved.
//
// THE RULED BOUNDARY, so a later reader can tell a cure from an over-cure: honest
// concrete counts in world words STAY and are census-legitimate ("stores below half a
// month", "for three years", a formatCount of survivors). What dies is the ABSTRACT
// ENGINE SCALAR — ratios, probabilities, rolls, indices, percentages of an invisible
// quantity, and `toFixed` anything. No row here was cleared by deleting information:
// each was TRANSLATED, and where the scalar had no world meaning to translate (a roll
// that was never drawn) that is recorded at the site.
//
// EVERY REMOVED ROW WAS REVIEWED AGAINST THE DIFF, as this ratchet's own message
// demands, and each car below reports its own count. No row moved by ADDRESS ROT in
// this wave: the removals are exact-sentence removals and the ADDED count is zero at
// every car, which is asserted by the regeneration report rather than argued.
//
//   car HER-1 (the war verdicts)  408 -> 381  (-27, ADDED 0). Five files, ten sentences:
//     deploymentReturn.js :211/:369/:405/:471 (the returning host's muster share, its
//     success probability, its roll, the coup verdict's hold chance) · warDeployment.js
//     :814/:815/:1190/:1195/:1201 (both siege capacities, the feasibility ratio, the fall
//     chance and its roll, the sizing and deployed-quality multipliers, the casus score)
//     · feasibilityGate.js :197 (the capacity ratio) · warSiegeVerdict.js :230 (the two
//     auto-resolve capacities) · conquestFeasibility.js :417 (the bargaining range's two
//     belief reads). float 233->221, percent 77->73, twoDecimal 71->62, multiplier
//     24->22. pushIndirection untouched.
//     ⚠ ONE ROW WAS AUTHORED AND THEN REMOVED WITHIN THIS CAR, and the lesson is worth
//     more than the row: the first draft of warDeployment's sizing sentence interpolated
//     `seededRec.sizingBias > 1 ? 'over' : 'under'` — a BOOLEAN — and the census counted
//     it, correctly. The detector reads a scalar's NAME inside an interpolation, not the
//     type the expression evaluates to, and that is the right rule: the cure is to decide
//     in code and interpolate WORDS. The regeneration report showed ADDED 1 and the
//     sentence was restructured before anything was banked.
//   car HER-2 (the occupations)  381 -> 365  (-16, ADDED 0). occupation.js :767/:950/
//     :1021/:1118/:1120/:1171/:1173 (the resistance scalar at four sites, the occupation
//     burden, the occupier benefit against its own hard cap, the relief, and the inherited
//     hunger twice) · occupationRecordMode.js :195 (a benefit falling "to 0.00").
//     float 221->213, twoDecimal 62->54. percent and multiplier untouched.
//   car HER-3 (the relationships)  365 -> 338  (-27, ADDED 0). relationshipRulesCore.js
//     :63/:82/:260/:745/:780/:781 · relationshipRulesAdversarial.js :90/:200/:401/:608/:650
//     · relationshipMemory.js :300/:301/:302. Every one of these was a bare readout appended
//     to a reason line that ALREADY said the same thing in world words, which is why the
//     translation reads as an improvement rather than a loss.
//     float 213->201, twoDecimal 54->42.
//     ⛔ pushIndirection FALLS TO ZERO, and the ceiling falls with it. All three rows of
//     that class lived in relationshipMemory's `postureReasons`, and all three were GATED
//     above a threshold (`resentment > 0.5`, `trust > 0.65`, `dependency > 0.6`) — so the
//     word "High" in each sentence was already the honest band and the float only repeated
//     it. The class is NOT deleted and its detector is NOT weakened: the four executed
//     pushIndirection mutants above still prove the walk, and the ceiling of 0 means the
//     next wrapped-return leak is red on arrival rather than absorbed into a stale budget
//     of three. That is the same argument TE-STRIP-1's note makes about a ceiling being the
//     control's teeth, at its limit.
//   car HER-4 (the cost of war)  338 -> 296  (-42, ADDED 0). attrition.js :222 — SEVEN rows
//     on ONE line, the whole derivation term by term · reinforcement.js :143 (the same shape)
//     · warHomeCosts.js :547/:597/:598 · warRecordMode.js :139 · tradeWar.js :683/:720 ·
//     supplyWebWarfare.js :431/:432/:907/:931/:983 · momentum.js :1166/:1167/:1169/:1171.
//   car HER-5 (institutions and the arcs)  296 -> 272  (-24, ADDED 0).
//     institutionLifecycle.js :775/:843/:844 · moralInstitutionPressure.js :372/:526 ·
//     resourceDynamicsKernel.js :379 · tierResourceDynamics.js :226/:490/:541 ·
//     settlementLifecycleKernel.js :1008 · settlementLifecycleFirstClass.js :203 ·
//     magicRegimeLifecycle.js :246.
//   car HER-6 (faith, belief, the ladder of persons)  272 -> 256  (-16, ADDED 0).
//     deityStanceLane.js :373/:394 · religiousContest.js :979/:1011 · beliefMap.js :1569 ·
//     npcAgency.js :914 · npcLadderKernel.js :1087/:1088.
//   car HER-7 (strategy, mobilization, the remainder)  256 -> 227  (-29, ADDED 0).
//     settlementStrategy.js :287/:875/:928/:937 · mobilization.js :413 ·
//     mobilizationReactions.js :333 · stressorDynamics.js :900 · populationDynamics.js :485 ·
//     flows.js :96 · seasons.js :318 · peaceTermsDrafting.js :87/:88/:90 · razing.js :378 ·
//     settlementPolitics.js :358.  (npcAgency.js :914 is STOPPED — see the note below.)
//     ⚠ ONE OF THOSE ROWS WAS NEVER DEBT. settlementPolitics.js:358 interpolated a binding
//     named `strength` that HOLDS A WORD — `String(rel?.strength ?? '').toLowerCase()` — so
//     the sentence was compliant all along and the detector fired on the IDENTIFIER, whose
//     last camel token is a FLOAT_TOKEN. The cure is the RENAME and nothing else; the
//     emitted sentence is byte-identical. It is called out here rather than counted quietly,
//     because a census row cleared by renaming is a different kind of win from the other 112
//     and a later reader should not have to rediscover which.
//     ⚠ THE 113 REMOVALS WERE MEASURED BEFORE THEY WERE MADE. The whole cars-4..7 patch was
//     first applied to a MIRROR of src and censused there; that dry run reported ADDED 14 —
//     fourteen inline ternaries that named their scalar inside a template — and every one was
//     hoisted before anything touched the tree. The rule they taught is E-HER-3's, and it is
//     now written at the top of the patch that obeys it: decide in code, interpolate words.
//     Two shapes are clean and both are used: a bare CONDITIONAL over string literals as the
//     array element, and a decision hoisted into a `...Word` binding.
//     ⚠ THE FOUR PER-CAR DELTAS ABOVE ARE RE-DERIVED FROM THE TWO COMMITTED BASELINES, not
//     carried forward from the lane's running notes. The four figures written by hand were
//     ALL wrong by a few rows, and re-deriving them is the only reason that did not ship in
//     a comment — which is this file's own standing complaint about numbers in prose.
//     ⭐ THE ONE SITE THIS WAVE STOPPED IS NOW CURED, AND ITS DEBT IS DISCHARGED (T8, ODQ
//     §774.2 ratifying J-HER-I). HER-7 left `npcAgency.js:914` ("Pressure gate 0.62,
//     ambition 0.41.") standing as two named rows, because humanizing it MOVES A SAME-SEED
//     GOLDEN and that is not a call an implementing seat folds into a prose wave. The
//     ruling came, the shift was taken in T8's declared window, and the census fell
//     227 → 225 (floatInterpolation 149 → 148, twoDecimalScore 12 → 11) with ADDED 0 and
//     exactly those two rows REMOVED — the ceilings above came down with it.
//     THE MECHANISM IS WORTH KEEPING EVEN THOUGH THE DEBT IS GONE, because it is the
//     suppressor-defeat class and E-HER-9 hunts its siblings in T9:
//       `worldPulseFeedCuration.js` `isMetronomeRepeat` suppresses a beat that repeats the
//       same impactKind, headline, settlements AND REASONS inside a six-tick window
//       (`DRIFT_REEMIT_COOLDOWN_TICKS`), and `stateOnlyRumorSeedsFromHistory` runs the
//       PRIVATE rumor seeds through the same predicate. A per-tick jittering float in a
//       reason made every re-emission a different STRING, so the suppressor never fired on
//       this family — the float was not merely ugly, it was DISABLING A GUARD. Banded to
//       four fixed sentences, it fires.
//     ⚠ ADDRESS ROT, corrected rather than carried: this note used to cite
//       `worldPulseFeedCuration.js:128`. The predicate has since moved to :140 and :128 is
//       now a different function, which is why the citation here is by NAME and not by line.
//     ⭐ THE PUBLIC NEWS ENTRIES ARE BYTE-IDENTICAL EITHER WAY. The whole effect lives on
//       the STATE-ONLY seed path, which is why it took a ledger-level diff rather than an
//       entry diff to see it, and why a lane that only checked "did the feed change" would
//       have shipped it blind. The measured golden movement is recorded in the SHIFT RECORD
//       in `tests/property/rumorLedgerGolden.test.js`, re-measured at T8's own base rather
//       than inherited from HER-7's figures.
// ODQ §934.20 + §934.23 (the chart-proportion and no-clamp consist, 2026-09-19) — FORTY-SEVEN
// PURE LINE MOVES ACROSS FOUR FILES, NO CEILING CHANGE, NO DEBT MOTION. The Economics tab's food balance bar now draws the
// magical food offset the record credits, so the tab gains a nine-line rationale block
// above its prose and loses three decorative JSX comment lines inside the bar; the
// eighteen rows EconomicsTab.jsx owns re-address 393 -> 402, 395 -> 404, 534 -> 542,
// 535 -> 543, 536 -> 544, 541 -> 549, 543 -> 551, 544 -> 552, 545 -> 553, 724 -> 732 and
// 730 -> 738. Same shape as CR-FP-2's eighty-eight, HK-1's six and TE-CH-4's one: path,
// category and snippet are byte-identical on every one, the census stays at 224 against a
// 224 ceiling, no category count moves, and the whole baseline diff is thirty-six lines,
// eighteen -/+ pairs.
// ⛔ THE NEW CLAUSES CARRY FIGURES AND STILL BANK NOTHING, which is the half worth reading.
// bc32a5a97 could only add a NUMBER-FREE magic clause; this car needed the reader to add the
// figures up, so the clause now names the offset in lb/day. It costs no row because of WHERE
// each one lands: on :551 the clause sits past `snippetOf`'s 237-character truncation (which
// ends at "...Residual sho"), so the frozen prefix is unchanged; on :552 it stays CONCATENATED
// outside the literal, leaving that node's 101 bytes untouched; and `formatCount(...)` is not
// a numeric-formatting call to this detector, which is why the sibling "+ N imported" chip has
// never been a row either. The PDF chapters take the same clause through `smart(...)` with no
// per-cent token, so Overview.jsx:566 and EconomicsTrade.jsx:534/:539 do not move at all.
// THE OTHER EIGHT MOVES are the faction share bars, and they are the same shape. SummaryTab
// and PowerStrata each re-normalised `factions[].power` — a DECLARED unit
// (domain/factionPowerShare.js: an integer percent share, renormalised by
// rulingStructure.normalizeAndAnnotateFactions) — and then printed the re-derivation INSIDE
// the run while the legend beside it printed the field. Reading the declared share once
// costs each file a rationale comment and refunds it the roster-sum line, so SummaryTab.jsx
// re-addresses 65 -> 74 and 80 -> 89, and PowerStrata.jsx 239 -> 243, 241 -> 245 and
// 282 -> 286. Not one of the five snippets changed: the aria-label on :243 still reads
// `${pct} percent (power ${r.power})`, which is now two spellings of ONE number rather than
// two numbers, and re-wording it would have been the only way to bank a row where there is
// no debt to bank.
// AND TWENTY-ONE MORE WITH THE CLAMP CAR (ODQ §934.23, the same day). "Authored text is
// never clamped on the dossier" collapses the Economics revenue row's desktop/phone branch
// into one gazetteer line — the share bar full-width, the source in bold and its description
// running on beneath it — which is FOUR effective lines shorter than the two-column row it
// replaces, and adds one rationale comment to SummaryTab and one to PowerTab. So
// EconomicsTab.jsx re-addresses BACKWARD (402->401, 404->403, 542->538, 543->539, 544->540,
// 549->545, 551->547, 552->548, 553->549, 732->728, 738->734), SummaryTab.jsx 89->90 and
// PowerTab.jsx 518->519. The direction is new; the shape is not. Not one snippet changed:
// the income row's two `{src.percentage}` reads are carried into the new markup byte for
// byte, because the clamp was never on the figure — it was on the sentence beside it.
// MEASURED, not assumed: live 224 rows, exact-equal to this baseline, 0 added and 0 removed
// on path + category + snippet.
// ODQ §934.22 (the label-seam car, 2026-09-19) — THIRTY-NINE PURE LINE MOVES ACROSS SEVEN
// FILES, NO CEILING CHANGE, NO DEBT MOTION, AND ELEVEN OF THEM WERE ALREADY OWED.
// ⛔ THE CONSIST TIP WAS RED ON THIS RATCHET BEFORE THIS LANE REBASED ONTO IT, and that is
// measured rather than alleged: scanning 2ac3c9c5f's own `src/` against 2ac3c9c5f's own
// committed baseline yields 224 live rows against 224 banked and ELEVEN STALE ADDRESSES —
// DefenseTab.jsx:510, PowerStrata.jsx:239/:241/:282, SessionMode.jsx:442,
// DefenseSecurity.jsx:235 and Overview.jsx:566 (three rows). The label-seam cars moved lines
// above them and did not re-address. Nothing was added and nothing fell; it is the address
// rot this file's CR-FP-2 note already names, inherited rather than authored. It is cured
// here because a lane cannot leave its own branch red on a ratchet it can close mechanically,
// and it is NAMED here because a debt that is silently absorbed is a debt nobody reviewed.
// THIS CAR'S OWN SHARE is the other twenty-eight: threading `resourceDisplayName` and
// `institutionDisplayName` costs EconomicsTab.jsx one import line and a seven-line rationale
// above the Imports pills (204 -> 205, 212 -> 213, 401 -> 402, 403 -> 404, 538 -> 545,
// 539 -> 546, 540 -> 547, 545 -> 552, 547 -> 554, 548 -> 555, 549 -> 556, 728 -> 735,
// 734 -> 741) and EconomicsTrade.jsx two imports and a six-line rationale inside
// `renderedTradeLabel` (304 -> 312, 427 -> 435, 534 -> 542, 539 -> 547).
// MEASURED: path, category and snippet byte-identical on all thirty-nine, 0 added and 0
// removed, the census at 224 against a 224 ceiling and no category count moved.
// 2026-09-19 (the chair, at the 2026-09-18 fixes consist's final tip) — THE DEBT FELL BY SIX AND
// THE CEILINGS FOLLOW IT DOWN: 224 -> 218, percentToken 56 -> 54, multiplier 10 -> 8,
// twoDecimalScore 11 -> 9; floatInterpolation holds at 147. The six rows were the landing
// fixture's — engine receipts in a GENERATED file, now scoped out of the authored-prose walk
// (GENERATED_SOURCES above; its freshness is pinned by landingFixtureFreshness). The one NEW
// leak of the wave — GalleryImage's stock-painting alt, a template in JSX — was humanized
// through the copy dictionary (gallery.stockImageAlt), never banked. Ceilings only fall.
const REVIEWED_TOTAL_CEILING = 218;
const REVIEWED_CATEGORY_CEILINGS = Object.freeze({
  floatInterpolation: 147,
  percentToken: 54,
  multiplier: 8,
  twoDecimalScore: 9,
  pushIndirection: 0,
});

/**
 * GENERATED SOURCES ARE NOT AUTHORED PROSE. The landing fixture is written by
 * scripts/generate-landing-fixture.mjs from a real generation and a real twelve-week pulse;
 * its sentences are the ENGINE'S receipts ("Base chance 59% lifted by ×1.01 …") and its
 * freshness is pinned by tests/build/landingFixtureFreshness.test.js. Humanizing them would
 * falsify the receipt, and banking them would make a regeneration a prose-numerics event.
 * So the walk skips them here and in the chair's re-address tool alike (2026-09-19, §934.30).
 */
const GENERATED_SOURCES = new Set(['src/components/home/landingFixture.js']);

function walkSourceFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) walkSourceFiles(abs, out);
    else if (/\.(?:js|jsx)$/.test(entry)) {
      const rel = relative(ROOT, abs).replace(/\\/g, '/');
      if (!GENERATED_SOURCES.has(rel)) out.push(abs);
    }
  }
  return out;
}

function scanLiveTree() {
  const hits = [];
  const parseErrors = [];
  for (const abs of walkSourceFiles(join(ROOT, 'src')).sort()) {
    const path = relative(ROOT, abs).replace(/\\/g, '/');
    const result = scanProseNumericsSource({ source: readFileSync(abs, 'utf8'), path });
    hits.push(...result.hits);
    if (result.parseError) parseErrors.push(`${path}: ${result.parseError}`);
  }
  return { hits, parseErrors };
}

function ceilingViolations(hits) {
  const counts = Object.fromEntries(
    Object.keys(REVIEWED_CATEGORY_CEILINGS).map((category) => [category, 0]),
  );
  const unknownCategories = new Set();

  for (const hit of hits) {
    if (Object.prototype.hasOwnProperty.call(counts, hit.category)) {
      counts[hit.category] += 1;
    } else {
      unknownCategories.add(String(hit.category));
    }
  }

  const violations = [];
  if (hits.length > REVIEWED_TOTAL_CEILING) {
    violations.push(`total ${hits.length} exceeds reviewed ceiling ${REVIEWED_TOTAL_CEILING}`);
  }
  for (const [category, ceiling] of Object.entries(REVIEWED_CATEGORY_CEILINGS)) {
    if (counts[category] > ceiling) {
      violations.push(`${category} ${counts[category]} exceeds reviewed ceiling ${ceiling}`);
    }
  }
  for (const category of [...unknownCategories].sort()) {
    violations.push(`unknown detector category ${category} has no reviewed ceiling`);
  }
  return violations;
}

const LIVE = scanLiveTree();

describe('prose numerics detector discriminates (executed mutants)', () => {
  const cases = [
    {
      category: 'floatInterpolation',
      clean: "export const beat = { headline: 'The levy gathers.' };",
      mutant: 'export const beat = { headline: `The levy gathers at pressure ${pressure}.` };',
    },
    {
      category: 'percentToken',
      clean: "export const beat = { summary: 'The levy loses nearly half its strength.' };",
      mutant: 'export const beat = { summary: `The levy loses ${Math.round(loss * 100)}% of its strength.` };',
    },
    {
      category: 'multiplier',
      clean: "export const beat = { reasons: ['The levy outmatches the watch.'] };",
      mutant: 'export const beat = { reasons: [`The levy stands at ${depth}× the watch.`] };',
    },
    {
      category: 'twoDecimalScore',
      clean: "export const beat = { reason: 'The court believes the road unsafe.' };",
      mutant: 'export const beat = { reason: `The court reads danger ${score.toFixed(2)}.` };',
    },
  ];

  it.each(cases)('$category: the clean control stays quiet and the mutant is caught', ({ category, clean, mutant }) => {
    expect(scanProseNumericsSource({ source: clean, path: 'src/control.js' }).hits).toEqual([]);
    const found = scanProseNumericsSource({ source: mutant, path: 'src/mutant.js' }).hits;
    expect(found.map((hit) => hit.category)).toContain(category);
  });

  it('allows whole world counts and dates rather than banning all numbers', () => {
    const clean = 'export const beat = { summary: `${wagons} wagons arrived over ${years} years.` };';
    expect(scanProseNumericsSource({ source: clean, path: 'src/counts.js' }).hits).toEqual([]);
  });

  it('catches scalar concatenation as the same leak class as template interpolation', () => {
    const mutant = "export const beat = { headline: 'The court reads danger ' + score + '.' };";
    const found = scanProseNumericsSource({ source: mutant, path: 'src/concat-mutant.js' }).hits;
    expect(found.map((hit) => hit.category)).toContain('floatInterpolation');
  });

  it('follows one unique local binding when it flows into a prose key', () => {
    const mutant = [
      'const opaqueBody = `The court reads danger ${score.toFixed(2)}.`;',
      'export const beat = { headline: opaqueBody };',
    ].join('\n');
    const found = scanProseNumericsSource({ source: mutant, path: 'src/binding-mutant.js' }).hits;
    expect(found.map((hit) => hit.category)).toEqual(['floatInterpolation', 'twoDecimalScore']);
  });

  it('follows a direct local function return when the call flows into a prose key', () => {
    const mutant = [
      'function opaqueComposer() { return `The levy roll was ${roll.toFixed(2)}.`; }',
      'export const beat = { summary: opaqueComposer() };',
    ].join('\n');
    const found = scanProseNumericsSource({ source: mutant, path: 'src/return-mutant.js' }).hits;
    expect(found.map((hit) => hit.category)).toEqual(['floatInterpolation', 'twoDecimalScore']);
  });

  it('follows push arguments on a flowed local sentence array', () => {
    const mutant = [
      'const parts = [];',
      'parts.push(`The levy chance was ${chance.toFixed(2)}.`);',
      'export const beat = { reasons: parts };',
    ].join('\n');
    const found = scanProseNumericsSource({ source: mutant, path: 'src/push-mutant.js' }).hits;
    expect(found.map((hit) => hit.category)).toEqual(['floatInterpolation', 'twoDecimalScore']);
  });

  it('does not guess through reassigned, imported, or second-hop opaque values', () => {
    const clean = [
      "import { externalComposer } from './elsewhere.js';",
      'const firstHop = `The court reads danger ${score.toFixed(2)}.`;',
      'const secondHop = firstHop;',
      'let reassigned = `The levy chance was ${chance.toFixed(2)}.`;',
      "reassigned = 'The levy looks uncertain.';",
      'export const beats = [',
      '  { headline: secondHop },',
      '  { summary: reassigned },',
      '  { reason: externalComposer() },',
      '];',
    ].join('\n');
    expect(scanProseNumericsSource({ source: clean, path: 'src/opaque-control.js' }).hits).toEqual([]);
  });

  it('does not fall through a parameter shadow to an outer binding', () => {
    const clean = [
      'const opaqueBody = `The court reads danger ${score.toFixed(2)}.`;',
      'export function authored(opaqueBody) {',
      '  return { headline: opaqueBody };',
      '}',
    ].join('\n');
    expect(scanProseNumericsSource({ source: clean, path: 'src/shadow-control.js' }).hits).toEqual([]);
  });

  it('pushIndirection: a float reaches the reader through a WRAPPED return', () => {
    // The exact live shape CW-0w was pointed at (relationshipMemory.js's
    // postureReasons): a non-prose-named local array, pushed with a float, then
    // returned through `.slice(...)` from a prose-NAMED function. None of the
    // four detectors above can see it — the array is not prose-named and the
    // return is a call, not the array.
    const mutant = [
      'function postureReasons(relState) {',
      '  const out = [];',
      '  out.push(`High resentment (${relState.resentment.toFixed(2)}) shapes the posture.`);',
      '  return out.slice(0, 4);',
      '}',
    ].join('\n');
    const found = scanProseNumericsSource({ source: mutant, path: 'src/wrapped-return.js' }).hits;
    expect(found.map((hit) => hit.category)).toEqual(['pushIndirection']);
  });

  it('pushIndirection: the array may also travel through a NON-prose-named carrier', () => {
    // The second escape the interior survey named: the array leaves an ordinary
    // function and the CALL is what lands on the prose surface.
    const mutant = [
      'function buildLines(state) {',
      '  const parts = [];',
      '  parts.push(`Danger ${state.score.toFixed(2)} decides it.`);',
      '  return parts;',
      '}',
      'export const beat = { reasons: buildLines(state) };',
    ].join('\n');
    const found = scanProseNumericsSource({ source: mutant, path: 'src/carrier.js' }).hits;
    expect(found.map((hit) => hit.category)).toEqual(['pushIndirection']);
  });

  it('pushIndirection: a wrapped array that reaches NO reader surface stays quiet', () => {
    // The false-positive control. Same array, same float, same `.slice` — but
    // the function is not prose-named and nothing prose-named consumes it, so a
    // detector that fired here would be reporting sentences no reader sees.
    const clean = [
      'function auditTrail(state) {',
      '  const out = [];',
      '  out.push(`Danger ${state.score.toFixed(2)} decides it.`);',
      '  return out.slice(0, 4);',
      '}',
      'export const debugOnly = { trace: auditTrail(state) };',
    ].join('\n');
    expect(scanProseNumericsSource({ source: clean, path: 'src/audit-control.js' }).hits).toEqual([]);
  });

  it('pushIndirection: a TRANSFORMING method is not followed, and banded words stay quiet', () => {
    // `.map` rebuilds every element, so following it would report a sentence
    // that may no longer exist. And the whole point of the estate's rule is that
    // BANDED prose is fine — a wrapped return carrying only words is not a leak.
    const clean = [
      'function reasonsA(state) {',
      '  const out = [];',
      '  out.push(`Danger ${state.score.toFixed(2)} decides it.`);',
      '  return out.map((line) => line.toUpperCase());',
      '}',
      'function reasonsB() {',
      '  const out = [];',
      '  out.push(\'Resentment runs high enough to shape the posture.\');',
      '  return out.slice(0, 4);',
      '}',
      'export const beats = [reasonsA, reasonsB];',
    ].join('\n');
    expect(scanProseNumericsSource({ source: clean, path: 'src/transform-control.js' }).hits).toEqual([]);
  });

  it('does not attribute a future array push to an earlier authored value', () => {
    const clean = [
      'const parts = [];',
      'export const beat = { reasons: parts };',
      'parts.push(`A later diagnostic reads ${score.toFixed(2)}.`);',
    ].join('\n');
    expect(scanProseNumericsSource({ source: clean, path: 'src/future-push-control.js' }).hits).toEqual([]);
  });
});

describe('E-E JSX prose numerics detector discriminates (executed mutants)', () => {
  const cases = [
    ['floatInterpolation', '<p>Pressure {score.toFixed(1)}</p>'],
    ['percentToken', '<p>Chance {Math.round(chance * 100)}%</p>'],
    ['multiplier', '<p>Commitment {depth}× the old mark</p>'],
    ['twoDecimalScore', '<p>Hold chance 0.62, roll 0.41</p>'],
  ];

  it.each(cases)('%s: a JSX mutant is caught', (category, body) => {
    const source = `export function Mutant() { return (${body}); }`;
    const result = scanProseNumericsSource({ source, path: 'src/Mutant.jsx' });
    expect(result.parseError).toBeNull();
    expect(result.hits.map((hit) => hit.category)).toContain(category);
  });

  it('the clean JSX control stays quiet', () => {
    const source = 'export function Clean() { return (<p>The watch is badly outmatched.</p>); }';
    expect(scanProseNumericsSource({ source, path: 'src/Clean.jsx' }).hits).toEqual([]);
  });

  it('follows one local JSX reader binding without scanning unrelated component state', () => {
    const source = [
      'export function Mutant() {',
      '  const opaqueBody = `Hold chance ${chance.toFixed(2)}.`;',
      '  return <p>{opaqueBody}</p>;',
      '}',
    ].join('\n');
    const found = scanProseNumericsSource({ source, path: 'src/Mutant.jsx' }).hits;
    expect(found.map((hit) => hit.category)).toEqual(['floatInterpolation', 'twoDecimalScore']);
  });

  it('layout/control/CSS numerics are not reader prose (negative matrix)', () => {
    const source = [
      "const css = '.meter { width: 100%; opacity: 0.62; }';",
      'export function SummaryTab({ active, cats, keyName }) {',
      '  return (<>',
      '    <style>{css}</style>',
      "    <p>{t('generate.title')}</p>",
      "    <p>{keyName.replace(/_/g, ' ')}</p>",
      "    <p>{cats.join(' / ')}</p>",
      "    <p>{active ? 'The gate is open.' : 'The gate is closed.'}</p>",
      "    <div style={{ width: '100%', opacity: 0.62, transform: 'scale(1.20)' }} />",
      '  </>);',
      '}',
    ].join('\n');
    const result = scanProseNumericsSource({ source, path: 'src/Clean.jsx' });
    expect(result.parseError).toBeNull();
    expect(result.hits).toEqual([]);
  });
});

describe('prose numerics live-tree ratchet (exact legacy identity, shrink-only)', () => {
  it('the complete JS/JSX corpus parses, so a green scan cannot mean skipped files', () => {
    expect(LIVE.parseErrors, LIVE.parseErrors.join('\n')).toEqual([]);
  });

  it('the committed exact baseline exists', () => {
    expect(
      existsSync(BASELINE_PATH),
      'baseline missing; restore the reviewed exact A-1 census rather than creating an empty or anonymous budget',
    ).toBe(true);
  });

  it('path + line + category + snippet debt exactly matches the committed baseline', () => {
    const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
    expect(
      LIVE.hits,
      'A new prose numeric leaked, or legacy debt moved/fell. Humanize additions; when debt falls, regenerate once and review every removed row before committing the lower baseline.',
    ).toEqual(baseline);
  });

  it('the reviewed post-sweep total and per-category ceilings can only move down', () => {
    const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
    const categoryCeilingTotal = Object.values(REVIEWED_CATEGORY_CEILINGS)
      .reduce((sum, ceiling) => sum + ceiling, 0);

    expect(categoryCeilingTotal).toBe(REVIEWED_TOTAL_CEILING);
    expect(
      ceilingViolations(baseline),
      'The committed baseline exceeds the reviewed 225-row census. Remove the leak; never raise a ceiling.',
    ).toEqual([]);
    expect(
      ceilingViolations(LIVE.hits),
      'The live tree exceeds the reviewed 218-row census. Humanize the new leak; never raise a ceiling.',
    ).toEqual([]);
  });

  it('a regenerated exact baseline cannot make an executed +1 leak green', () => {
    const mutant = scanProseNumericsSource({
      source: 'export const beat = { headline: `The court reads pressure ${pressure}.` };',
      path: 'src/governance-mutant.js',
    }).hits;
    expect(mutant.map((hit) => hit.category)).toEqual(['floatInterpolation']);

    const mutatedLive = [...LIVE.hits, ...mutant];
    const temporaryRegeneratedBaseline = JSON.parse(JSON.stringify(mutatedLive));
    expect(mutatedLive).toEqual(temporaryRegeneratedBaseline);
    expect(ceilingViolations(temporaryRegeneratedBaseline)).toEqual([
      'total 219 exceeds reviewed ceiling 218',
      'floatInterpolation 148 exceeds reviewed ceiling 147',
    ]);
  });

  it('the baseline itself has exact, unique, source-verifiable identities', () => {
    const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
    const keys = baseline.map((hit) => `${hit.path}|${hit.line}|${hit.category}|${hit.snippet}`);
    expect(new Set(keys).size).toBe(keys.length);
    for (const hit of baseline) {
      expect(typeof hit.path).toBe('string');
      expect(Number.isInteger(hit.line) && hit.line > 0).toBe(true);
      expect(['floatInterpolation', 'percentToken', 'multiplier', 'twoDecimalScore', 'pushIndirection']).toContain(hit.category);
      expect(typeof hit.snippet === 'string' && hit.snippet.length > 0).toBe(true);
      const source = readFileSync(join(ROOT, hit.path), 'utf8');
      const sourceLines = source.split(/\r?\n/);
      expect((sourceLines[hit.line - 1] || '').trim().length, `${hit.path}:${hit.line} is no longer a source line`)
        .toBeGreaterThan(0);
      const frozenSource = hit.snippet.endsWith('...') ? hit.snippet.slice(0, -3) : hit.snippet;
      expect(oneLineForIdentity(source), `${hit.path}:${hit.line} no longer contains its frozen snippet`)
        .toContain(frozenSource);
    }
  });
});

function oneLineForIdentity(text) {
  return text.replace(/\s+/g, ' ').trim();
}
