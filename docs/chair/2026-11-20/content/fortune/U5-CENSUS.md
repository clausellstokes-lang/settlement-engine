# FORTUNE U5, STEP 1: THE CENSUS of every birth reader of a band above Tolerated

Written 2026-11-20 (`date -u` 16:33 UTC) by the census builder seated by FORTUNE-3, on `lane/fortune-3-u5c-2026-11-20`
cut at `abae6ab7e` (the lane tip). READ-ONLY: no file under `src/` or `tests/` changed. The brief: `briefs/U5-BUILD.md`
STEP 1 and the chair's condition 3 ("THE MERITS ARE A LATE STEP THAT RE-BANDS; THE BIRTH'S POWERS STAND ... NO PRINTED
WORD MAY CONTRADICT THE STORED BAND").

## 1. The answer first

| | count | rows |
|---|---|---|
| **WORD-writers** (run at birth before the late step, distinguish a band above Tolerated, write a string a page prints) | **5** | W1 to W5 |
| ... of which re-run in the late step | 2 | W1 (the relation's direction), W2 (the standing sentence) |
| ... of which proved the same / never contradicted at both bands | 2 | W3 (legitimacy tension twins: the same), W5 (the political flavour's law atom: never contradicted, see its row) |
| ... of which **STOP** (a word-writer in a file `COMMON.md` forbids) | **1** | **W4: `src/domain/crisis/crisisCast.js` (the merchants' crisis stake)** |
| **NUMBER-writers** (listed with what they read; they stay) | **2** | N1 (the multipliers), N2 (the generation trace's score) |
| **RENDER readers** (read the STORED band at render; read the moved band correctly) | **13** | section 5 |
| Readers that read only Contested and below (the same at Tolerated, Approved and Endorsed: no row) | 10 | section 4 |

WHAT THE LATE STEP CAN MOVE (arithmetic from the U5-BUILD rows, PLAUSIBLE until U5a): `meritPoints` 10 a merit, two merits
at most, the two-reason guard. So the moves are Tolerated -> Approved, Approved -> Endorsed, AND **Tolerated -> Endorsed**
(a score of 55 to 59 with two merits reaches 75; the guard counts a merit or a positive breakdown term as a reason, so two
merits always pass it). Every reader below that distinguishes Endorsed therefore matters for a Tolerated start too.

THE STEP ORDER (EXECUTED, the runner's `onStep` order on a birth at `abae6ab7e`): `resolveConfig > buildGenerationContext >
resolveResources > resolveStress > resolveNeighbour > assembleInstitutions > subsumptionPass > cascadePass > isolationPass >
stressConfirmPass > generateEconomy > generatePower > neighbourFactions > factionCorrelationPass > coherenceRepairPass >
economyReconcilePass > powerEconomyReconcilePass > structuralValidationPass > generatePopulation > generateNarratives >
assembleSettlement > resolveCrisisCast`, then `generateSettlementPipeline.js :: generateSettlementPipeline`'s own tail
(the provenance receipt, the living-content roster, `keepOneDominant`, `settleClergyToFinalRoster`,
`settleArcaneToPractitioners`, `withConflictRelations`), then **the late step** (the prototype's place, just before
`onComplete`), then `onComplete`. So `assembleSettlement` and `resolveCrisisCast`, both after `generateNarratives`, run
BEFORE the late step; every reader in them is in scope.

HOW THE CENSUS WAS TAKEN (EXECUTED). Beside the brief's grep (`isEndorsed|isApproved|govMultiplier|crimMultiplier|
'Endorsed'|'Approved'|LEGITIMACY_CUTS`, then every file that names `publicLegitimacy`), a SCRATCH COPY of the tree (outside
the worktree; no source file of the checkout touched) wrapped `computePublicLegitimacy`'s return in a logging Proxy (every
`get`, `has`, `ownKeys`, with its stack) and births were run on the fixture arm of `COMMON.md`
(`{ ...birthConfig(cfg), _fortuneLawVersion: 2 }`, `customContent: {}`), logging stopped at `onComplete`: 30 births
(`u5c-<size>-<0..4>`), then 240 (`hxd-<size>-<0..19>` untouched settings, and `hxr-<size>-<0..19>` with the proposal's
every-dial set: random trade, culture, threat, resources, stresses, priorities, magic). 0 errors. Every read site the
Proxy saw is in this file; no birth read made a copy of the object (`ownKeys` came only from the generic walkers of
section 4). A site the 270 births did not reach would be missed by the Proxy; the grep list was read for those (section 4,
last row).

## 2. The table (birth readers that distinguish a band above Tolerated)

Cited as `path :: symbol`. "Runs" = the pipeline steps the Proxy saw it read in (EXECUTED).

| # | reader (`path :: symbol`) | reads | runs (before the late step) | writes | WORD / NUMBER | printed where |
|---|---|---|---|---|---|---|
| W1 | `src/generators/factionDynamics.js :: govCriminalRelation` (through `computeFactionRelationships`, and re-run by `withCaptureRelations` at the coherence seam, `narrativeGenerator.js`) | `isEndorsed` (and `isLegitimacyCrisis`) | `generatePower`, `powerEconomyReconcilePass`, `assembleSettlement` (re-projection, then the seam's `withCaptureRelations`) | `powerStructure.factionRelationships[]` row of the seat and the criminal power: `direction` is `'declining'` at Endorsed, `'stable'` at Approved or Tolerated (only where the capture rung is `none` or `adversarial`; at `equilibrium` it is `'stable'` whatever the band; the late step never runs at `corrupted` or `capture`). Its `narrative` and `type` read the rung only. | WORD (a stored key the page prints as the row's chip) | Power tab, `src/components/new/tabs/power/PowerStrata.jsx :: chipDirection` (the relation row's chip: "declining" / "stable"), from `src/domain/dossier/powerStrata.js`'s read model |
| W2 | `src/generators/power/factionStanding.js :: annotateFactionStanding` (its coup reading: `src/domain/rulingPowerCoup.js :: coupContenders` and `coupRiskLabel`) | `govMultiplier` (1.00 Tolerated, 1.15 Approved, 1.30 Endorsed), through `coupContenders`'s `amplifiedWeight` and `gated` | `generatePower` (`rulingStructure.js :: generatePowerStructure`), `powerEconomyReconcilePass` and `assembleSettlement` (the re-projections), and LAST `assembleSettlement`'s `rosterText.js :: settleStandingToRoster` (twice: the before and after rosters, both at the stored band of that moment) | the rank-1 power's standing sentence at the end of `factions[].desc`: `SEAT_CONTESTED_STANDING` ("Close enough now to contest the seat, and they know it.") where the coup reading is `Contested`, else the gap ladder's line ("in the shadow of", "Behind ... by too much to challenge openly"). A higher multiplier can turn `Contested` to `Holding` (the line leaves) or `Critical` (ungated) to `Contested` (the line arrives). | WORD (stored in the description) | every power card's description (Power tab; the PDF's power section) |
| W3 | `src/data/historyData.js :: legitimacyHeldTensions` | `isApproved` | `generateNarratives` (`historyGenerator.js :: generateHistory`) and `assembleSettlement` (`rosterText.js :: settleTensionsToRoster`, its `legitimacyToSeat`) | the `legitimacy_crisis` tension's `description` and `plotHooks`: the "widely questioned" forms at Tolerated and below, `LEGITIMACY_HELD_TWINS` at Approved and Endorsed. Every other tension is returned untouched. | WORD (stored) | History tab (today's tensions and their hooks) |
| W4 | `src/domain/crisis/crisisCast.js :: deriveCrisisCast` (its stakes map) | `isEndorsed` (also `crimMultiplier > 1`, `isContested`, `isLegitimacyCrisis`: those only below Tolerated) | `resolveCrisisCast` (the last pipeline step; only where the town carries a stress entry) | `stress[].cast.stakes[]`: a MERCHANT power whose stake falls through the earlier rules takes `STAKE_REASONS.gainsMerchants` ("the merchants gain while the seat is endorsed", stake `gains`) at Endorsed only; below it falls to the untouched/raised reason. | WORD (stored on the stress entry; NOT re-derived at render) | Crisis tab: `src/domain/crisis/crisisPage.js` reads `entry.cast.stakes` and `src/components/new/tabs/CrisisTab.jsx :: CrisisSection` prints each stake's `reason` |
| W5 | `src/generators/narrative/historyCoherence.js :: flavorOf` (`POLITICAL_FLAVOR` through `domain/facts/drawDeclared.js :: drawDeclared`), whose `law` atom reads `src/domain/facts/lawBand.js :: lawBandOf` -> `src/domain/causalState.js :: deriveLawOrder` -> `src/domain/governanceLedger.js :: governanceLedger` | the SCORE (law_order gains `round((score - 50) * 0.4)`), so a band DERIVED from the score: the law band | `assembleSettlement` (the coherence seam's stress profile, `buildStressProfile`) | the drawn political-flavour line of the stress profile. The pool's ONE law-gated row (`src/generators/narrativeText.js`, "Records here are kept carefully and disputes settled by precedent ...", `needs: ['exports', 'law: ≥ strained']`) is refused where the law band is below `strained`, and the argmax over the admitted rows takes its place. | WORD (stored), drawn (`pickRandom2` and a seeded argmax: NOT pure) | History / the stress profile's political line |
| N1 | `src/generators/factionDynamics.js :: applyLegitimacyMultipliers` | `govMultiplier`, `crimMultiplier`, `isEndorsed` (merchants x1.05) (and below Tolerated: `governanceFractured`, `isLegitimacyCrisis`, `isContested`) | `generatePower`, `powerEconomyReconcilePass`, `assembleSettlement` (each re-projection) | `factions[].power` (renormalised to 100), `rawPower`, the roster's sort order, and `powerLabel` = `powerLabelOf(power)` (a word, but a word OF THE STORED NUMBER, never of the band) | NUMBER | power cards (share and label), the raw -> effective figures |
| N2 | `src/domain/factionProfile.js :: deriveFactionProfile` (`legitimacyFor` -> `governanceLedger`) | `score` (and `label`, unused there) | `generatePower` (the step's traces) and `economyReconciliation.js :: refreshPowerGenerationTraces` in `powerEconomyReconcilePass` and `assembleSettlement` | `simulationTrace[]` of the seat: the cause reason "As the governing power, X inherits the settlement's public-legitimacy score (N)." with the PRE-merit score N | NUMBER (a score inside a diagnostic string) | read only by `src/domain/explanation.js :: explainFaction`; no component imports `explanation.js` (PLAUSIBLE: no page prints it) |

Not rows, but in the path: `rulingPowerCoup.js :: coupContenders` and `causalState.js :: deriveLawOrder` /
`lawBand.js :: lawBandOf` read the band or the score and store nothing at birth; each feeds exactly one row above (W2, W5).
`coupContenders` sits in `src/domain/rulingPower*.js` (forbidden to EDIT): W2's re-run CALLS it, read-only, and edits nothing
there. In 270 births `coupContenders` was reached at birth only through `annotateFactionStanding` (EXECUTED; the
`src/generators/people/castPowers.js` call was not reached at birth).

## 3. The plan, row by row

**W1, the relation's direction: RE-RUN in the late step.** `factionDynamics.js :: withCaptureRelations(powerStructure,
state)` is pure (returns a copy, never mutates its input; "Draw-free"), and rebuilds every row that carries a `captureState`
from the pair, the rung and the legitimacy alone, so a second run equals the first (idempotent by construction; the test
runs it twice). Call it as `withCaptureRelations(ps, ps.criminalCaptureState)` after the re-band. The tail's
`withConflictRelations` rewrites only `symbiotic`/`dependent` rows and the merchant-craft vote, never a capture row
(`corrupted`/`tense`/`competitive`), and `settleNarrativesToRoster` only the vote: so the rebuild loses no later write.
ARM CHECK (EXECUTED, section 6): the rebuild at the band the town was born with equals the stored rows. FILE: no edit of
`factionDynamics.js` (released to the seat's lane); but U5a's manifest allows "`legitimacyBandFor`'s import only", so this
SECOND named import (`withCaptureRelations`) needs FORTUNE-3's word first. Alternative if refused: the step re-derives only
the seat-criminal row's `direction` by `govCriminalRelation` (the same import question).

**W2, the standing sentence: RE-RUN in the late step.** The machinery exists: `rosterText.js :: settleStandingToRoster`
computes every power's sentence on description-free copies (`standingsOf` -> `annotateFactionStanding` on `seats`, no
draw, the input untouched) for a BEFORE and an AFTER roster and swaps the sentence at a description's end where they differ.
What the late step needs is the same swap with the same roster and two LEGITIMACIES: before = the pre-merit object, after
= the stored one. Plan: a sibling export in `src/generators/power/rosterText.js` (e.g. `settleStandingToLegitimacy(powerStructure,
previousLegitimacy, force)`: `standingRosterOf(factions)` once, `standingsOf(roster, force, { publicLegitimacy: previous })`
and `standingsOf(roster, force, { publicLegitimacy: powerStructure.publicLegitimacy })`, the existing tail swap; returns the
same object where nothing moves). Pure and draw-free; idempotent (a second run with the stored band on both sides moves
nothing, and with the pre band on the left finds no old sentence at the end). FILE: `rosterText.js` is NOT forbidden by
`COMMON.md`, but it is outside U5a's manifest: report it to FORTUNE-3 first, as the manifest asks.
`factionStanding.js` and `rulingPowerCoup.js` are not edited.

**W3, the legitimacy tension's twins: PROVED THE SAME at both bands.** It rewrites only tensions of type `legitimacy_crisis`
(`t?.type !== 'legitimacy_crisis'` returns the tension untouched; with none, the same array returns). `legitimacy_crisis`
is one of the ruler's-trouble kinds of condition 1 (U5-BUILD step 2 item 1), so a town that carries one is troubled and the
late step never moves it. On every moved town the function is the identity at both bands. Test: on each moved town of the
forced births, `legitimacyHeldTensions(tensions, { publicLegitimacy: pre })` and `(..., stored)` are both `===` the stored
array. (It is also pure and a one-to-one swap, so a re-run would be harmless; not needed.) FILE: none touched.

**W4, the merchants' crisis stake: STOP.** The writer is `src/domain/crisis/crisisCast.js` (`COMMON.md`: NEVER
`src/domain/crisis/`). Its stake is stored on the stress entry at birth and printed from the store; a town the late step lifts
to Endorsed that carries a stress and a merchant power whose stake falls through to the band rule keeps the stake written at
the lower band (no "the merchants gain while the seat is endorsed" beside an Endorsed seat). It cannot be proved the same
(section 6: 0 differences on the 8 stressed towns the step moved of 1,200 births, but the branch is reachable). A re-run is not offered: `deriveCrisisCast` is called by `resolveCrisisCast` with a minting
callback (a temporary person joins the roster and the coherence receipt is rewritten), so a second call from the late step
is neither the step's own call nor clearly idempotent, and the module is forbidden. The choices are the chair's: (a) grant
`crisisCast.js` (or a re-derivation of the stakes only); (b) place the late step as its own pipeline step after
`assembleSettlement` and BEFORE `resolveCrisisCast` (the merits read the ruler's card and the history, both assembled by
then; `resolveCrisisCast`'s temporary person has no membership, so it cannot be the ruler: PLAUSIBLE), which moves the
step's ruled place; W1, W2, W3, W5 are unchanged by that move (all run in `assembleSettlement` or earlier), and the tail's
`withConflictRelations` would then read the moved band's rows too; (c) accept the stake as written at the lower band.
FORTUNE-3 tells the chair.

**W5, the political flavour's law atom: NEVER CONTRADICTED at the moved band (not the same draw).** Monotone: a merit only
raises the score; `deriveLawOrder`'s legitimacy term `round((score - 50) * 0.4)` never falls as the score rises; the
law band's cap (a crime wave) and floor (a quiet place) do not read the score. So `lawBandOf(stored) >= lawBandOf(pre)`.
The pool's only law atom is a floor (`≥ strained`), so every row admitted at the pre band is admitted at the stored band:
the stored line stays true. What can differ: a row REFUSED at the pre band (law below `strained`) might have been admitted
at the stored band, so the draw might have chosen otherwise; the stored line is still true of the town. A re-run is not
possible (a draw, `pickRandom2`, inside a seeded substream). Test (U5a): on every moved town, `lawBandOf` at the pre band
and at the stored band, and the stored flavour row's `needs` admitted at the stored band. Section 6 counts how often the
law band moves at all. The chair rules whether "never contradicted" meets condition 3 for this row. FILE: none touched.
(Every other `law:` atom in `src` is a render pool: `dossierStateProse/*.generated.js`, `display/guardLineUnderTheLaw.js`,
`display/stateProse/crimeLineDisqualifiers.js`; they read the stored record at render.)

**N1, the multipliers: LISTED AND LEFT** (the chair's ruling: "No multiplier is re-run"). Read: `govMultiplier`,
`crimMultiplier`, `isEndorsed`. The words that follow from its output (`powerLabel`, `settleClaimsToLabel`'s rungs,
`annotateFactionStanding`'s gap lines, `keepOneDominant`, `settleClergyToFinalRoster`) read the STORED POWERS, which stay,
so they agree with the page's figures. What the page will show on a moved town: a seat whose share was multiplied at the
pre-merit band (x1.00 where the stored band says x1.15; x1.15 where it says x1.30; the merchants x1.00 where Endorsed says
x1.05) and a raw -> effective pair that reflects the birth's multiplier. A number, by the ruling.

**N2, the trace's score: LISTED AND LEFT.** Read: `score`. It is the one stored copy of the pre-merit score at birth (a
diagnostic receipt, not printed: PLAUSIBLE). The integrator may refresh it in the late step by the same sentence; not
required by condition 3.

## 4. Readers that read only Contested and below (the same at Tolerated, Approved and Endorsed; EXECUTED as reached, read for what they read)

`factionDynamics.js :: criminalMilitaryRelation` (`isContested`, `isLegitimacyCrisis`); `power/claimStanding.js ::
settleClaimsToLabel` (`isLegitimacyCrisis` only: the proposal's section 11 named it; its label rungs read `powerLabel`, a
number's word, N1); `power/rulingStructure.js :: generatePowerStructure`'s stability line (`label === 'Legitimacy Crisis'`);
`applyLegitimacyMultipliers`'s crisis note (`governanceFractured`); `npcStructure.js :: getPrimaryCondition`
(`governanceFractured`, `isContested`); `legacyGenerator.js :: classifyLegitimacy` (score below 30 or 45); `facts/legitimacyCrisis.js ::
legitimacyCrisisOf` (`isLegitimacyCrisis`); `crisisCast.js`'s `legitimacyContested`, and its stakes `gainsCrime`
(`crimMultiplier > 1`: 1.00 at Tolerated, 0.90 Approved, 0.75 Endorsed, never above 1), `gainsVacuum`, `gainsChurch`;
the generic judgment walkers (`generationCoherence.js :: buildGenerationCoherenceReceipt`'s `collectStrings`,
`generationReceiptJudgments.js :: collectNonFiniteNumbers`, `recordBatteryFindings.js :: recordTextSurfaces`, in
`assembleSettlement` and `resolveCrisisCast`): they read every key and write findings on tokens, grammar and non-finite
numbers, none of which a band word or a finite score trips (PLAUSIBLE). Grep-only files not reached at birth in 270 births
(play-time or render): `domain/worldPulse/*`, `domain/rulingPower.js`, `domain/timeProgression.js`, `domain/roads/state.js`,
`domain/hookEscalation.js`, `domain/simulationSpine.js`, `domain/capacityModel.js`, `domain/traditions/politics.js`,
`domain/events/*`, `lib/structuralFingerprint.js` and `store/settlementGenerateAction.js` (after birth returns).

## 5. Render readers (read the stored band; they read the moved band correctly)

`display/stateProse/powerStateProse.js :: powerStateProse` (the banner by `label`, the lens, `legitimacyHoldPoolKey` by
`govMultiplier`); `display/governanceAccount.js` (the account's `label` switch, "approves of" / "stands behind");
`components/dossier/EngineSections.jsx`, `components/new/powerDeskRead.js`, `display/stateProse/printProse.js`,
`dossier/powerStrata.js` (the coup reading through `coupContenders`: it WILL read the moved multiplier, which is why W2's
stored sentence must follow it); `components/new/tabs/PowerTab.jsx`; `components/new/tabs/SubstrateTab.jsx`;
`display/rulingAuthorityShown.js` (crisis cap only); `facts/lawBand.js :: lawBandOf` through the Foundations row (`Law &
order`); `pdf/lib/viewModel.js` (the label, and every breakdown key: a new `merits` key prints as "Merits" through
`humanize`, a U5b note); `edit/recordInvariants.js` (`V-LEGIT-FLAGS`: the flags must agree with the label, so the late
step re-stamps the whole tuple, as the build already requires); `data/dossierStateProse/power.generated.js` (the
`Endorsed`/`Approved` pools, read by the prose desks). NOT a render reader: `crisis/crisisPage.js` prints the STORED stakes
(W4).

## 6. The arm, measured (EXECUTED on a scratch copy holding the prototype late step)

A second scratch copy of the tree carried the PROTOTYPE late step (`instruments/u5-rule.mjs`'s merits block, rows of
U5-BUILD: 10 points, 40 years, the Tolerated gate 45, the two-reason guard; re-banded by `legitimacyBandFor`; WITHOUT U5s's
safety term, which is not on this tip), placed just before `onComplete`. For every town it moved, each writer was computed
at the pre-merit legitimacy and at the stored one (fixture arm, `hxd-<size>-<0..99>` untouched and
`hxr-<size>-<0..99>` every dial; 1,200 births). Instrument: `u5c-arm/arm.mjs` in the session scratchpad (not committed).
This is what U5a's arm test (g) will assert; it is a measure on the prototype, not U5a's proof.

| | hxd (600) | hxr (600) |
|---|---|---|
| score moved by the step | 63 | 45 |
| band moved: Tolerated -> Approved | 44 | 17 |
| band moved: Approved -> Endorsed | 15 | 15 |
| band moved: Tolerated -> Endorsed | 0 | 0 |
| W1 seat-criminal `direction` differs (pre vs stored band) | 0 | **2** (`hxr-town-34`, `hxr-city-13`: rung `adversarial`, Approved -> Endorsed, stored `stable`, the stored band says `declining`) |
| W1 re-run safety: `withCaptureRelations(born record, criminalCaptureState)` equals the stored capture rows | 19 of 19 towns with capture rows | 98 of 98 |
| W2 any power's standing sentence differs | 0 | 0 |
| W3 moved towns holding a `legitimacy_crisis` tension / output differs | 0 / 0 | 0 / 0 |
| W4 moved towns with a stress entry / stakes differ | 4 / 0 | 4 / 0 |
| W5 law band differs (every one shown rose: `strained -> adequate` 4, `adequate -> surplus` 1) | 9 | 1 |

READING: W1 is a live contradiction on this sample (2 of 32 Endorsed moves), so its re-run is needed, and the rebuild
reproduces every stored capture row exactly at the born band. W2 and W4 did not move on these 1,200 births but are not
proved: W2 needs a coup reading at the gate's edge, W4 a stressed town lifted to Endorsed with a merchant power whose stake
falls through (none here); both are reachable by the code. W5's law band moves on 10 towns, upward, as the monotone
argument says. No Tolerated -> Endorsed move occurred here (it needs a score of 55 to 59 and both merits).

## 7. EXECUTED vs PLAUSIBLE

EXECUTED: the step order; every birth read site of section 2 and 4 and the steps it runs in (the Proxy, 270 births, both
setting sets); section 6's counts (1,200 births on a scratch copy holding the prototype late step). PLAUSIBLE (read only): what each writer writes and where it prints; that N2's trace is
printed nowhere; the walkers' band-invariance; W4's option (b)'s safety; the move arithmetic of section 1 until U5a builds
the rows.
