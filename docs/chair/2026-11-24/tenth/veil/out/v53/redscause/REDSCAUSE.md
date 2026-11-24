# V53-REDSCAUSE: why each of the trial join's six red files is red (VEIL-53 unit (1))
The tree is `/home/user/join53` at ba7460c33. It was read and run only: no file was edited and no cure was built. Every run went through `gate-mutex.sh --run` and its exit was read from `gate-tail.sh`. The probes are in this directory: `r6`, `r12` (reds 1 and 2), `r34` (reds 3 and 4) and `r5`, each a `*.probe.test.js` with its `.out` file, run under `vitest.config.mjs`. The server is PGlite with every migration on disk (`veilChain.shared.mjs :: bootChain`, boot failures `[]`), read as anon through `get_gallery_dossier` under the default veil.
WHOSE RED: at the lane tip b58abc48b, reds 5 and 6 are GREEN (one run, `lanetip.txt`: "Test Files 2 passed (2) / Tests 8 passed (8)", exit 0). Test files 1 to 4 do not exist at the lane tip: they are the line's (`git log -1 b58abc48b -- <file>` returns nothing).
## (1) fortuneLawMerits U5a (S): JOIN (the line's test, the lane's withhold; not the lit dial), CONFIRMED
VERDICT: The widest veil runs `galleryWithholdAlways.js :: withholdAlways`, whose row `legitimacy.breakdown` strips the
prosperity, safety and defence terms. The third equality (breakdown) breaks on 19 of 19 towns. Merits and score still hold on
all 19 under both reads, and the plain `toPublicSafe` read passes. The legacy notes are also withheld (row `history.legacy`),
but they move no merit: `weatheredCatastrophe` gives the same answer with the notes and without them on 19 of 19 (`R1N`).
- (a) From `r12.out`: "R1 hxd-hamlet-39 widest merits own=["weathered"] shared=["weathered"] score own=75 shared=75 sbd={"food":0,"merits":10}". The owner's breakdown is `{prosperity:15,safety:0,defense:0,food:0,merits:10}`.
- (b) The twin is `galleryWithholdAlways.js :: withholdAlways` (`// registry: legitimacy.breakdown`). The server is 212 :: `_gallery_veil_withhold_always` ("registry: legitimacy.breakdown", minus_at `{prosperity,safety,defense}`). The row is `undrawn({ id: 'legitimacy.breakdown' ... vr14: 'iii' })`, added by lane commit 4ddf8c60c (R2, VEIL-21).
- (c) The server serves what the twin serves. From `r12.out`: "C c-hxd-hamlet-39 server bd={"food":0,"merits":10} ... legacy=null merits=["weathered"] | twin(default veil) bd={"food":0,"merits":10}". Every server read withholds the terms, the default veil included. The test's "shared" read (`toPublicSafe`) is not what the server sends.
- WHAT THE TERMS COULD TELL: on 19 of 19 towns, `computePublicLegitimacy` run over the SERVED labels with the born law (`economy.prosperity`, `safety.safetyLabel`, `defence.readiness.label`, tier) equals the stored terms ("equalStoredTerms=true" on all 38 reads). Serving the terms tells nothing beyond what is already served. Those labels are themselves VR26's inverting rows (red 6), but that is VR19's matter, not the terms'.
## (2) fortuneLastingSentence U7b (d): JOIN (same cause as (1)), CONFIRMED
VERDICT: Under the widest veil the breakdown loses its terms, so `governanceAccount.js :: legitimacyCausesOf` returns `[]`. The
standing then prints without a cause and opens on the place. `governanceAccountOf` turns on `onIt`
(`!both && !causes.length && standing.startsWith(place)`), so the lasting row prints as "It has lasted..." instead of the
owner's "Radhawadi has lasted...". With the terms put back on the widest read, the owner's sentence prints ("widest+terms").
The slots and merits are equal on all three reads, so only the paragraph check is red.
- (a) From `r12.out`, the owner reads "...Prosperity has earned the Household Council the approval of Radhawadi. Radhawadi has lasted for centuries...". The widest read is "Radhawadi approves of the Household Council. It has lasted for centuries...". Case visitor-hamlet-139 goes the same way.
- (b) The same row and commit as (1): `legitimacy.breakdown`, 4ddf8c60c. The sentence is `governanceAccount.js :: governanceAccountOf`.
- (c) The server equals the twin. From `r12.out`: "C c-visitor-thorp-52 serverPARA=... It has lasted for centuries..." equals `twinPARA`, on the DEFAULT veil.
### (1)-(2) THE CURES, costed (lines are estimates from reading; losses from PAGES (F), read and not re-run)
| cure | what changes | cost | LOSSES on a shared page |
|---|---|---|---|
| (S) serve the terms | delete the `legitimacy.breakdown` rule in the twin and in a successor of 212's `_gallery_veil_withhold_always` (212 lines 1947-2093); re-class the registry row; `importRederive.js` step 7 becomes dead | about 4 files: -2 twin, -2 SQL in a new migration (the owner's hand), 1 registry line, -12 import lines; plus the tests that pin the withhold (grep: fortuneLawStanding, fortuneLawSafety, powerEconomyFreshness, proseWiringCensus.walker) | 0. Greens (1) and (2); leaks nothing beyond the served labels (the 19 of 19 above) |
| (R) the page prints what is stored | NONE in src: a shared page already prints the stamped `power:governance` block (`powerDeskRead.js :: governanceAccountRead`, `publicDossier`), and `breakdown.merits` is served (`{food,merits}`) | 2 test files re-pointed at the stamped block (about 10 lines) | 0. PAGES (F): 720 of 720 print; a cause lost 0; merit and lasting changed 0. Any reader that RE-COMPOSES over a veiled document still drifts as in (2) |
| LEAN: fail closed on a veiled read | `governanceAccount.js`: a breakdown that is not whole names no cause (true today), the merit sentence prints only where `breakdown.merits` carries it, and `onIt` must not flip on a cause-less veiled standing | about 5 to 8 lines in 1 src file; 2 tests restated (the equality becomes "no cause named") | stamped page: 0 (PAGES (F)). On a re-composing veiled read: the cause clause on every place with a non-zero term (15 of the 19 U5a towns) |
SMALLER: (R), with no src change. (S) is the smaller code cure that keeps re-composition honest. The lean costs more than (R)
and loses causes where anything re-composes.
## (3) tensionCause CAUSES-PARITY-2 F, hxd-city-138: JOIN (the line's test, the lane's crimeWave rule), CONFIRMED
VERDICT: This is chain A's (v)(2) class. The black market is the only criminal house. Hidden, it leaves the served crime signal
false, so `galleryRosterChoices.js :: applyRosterChoices` (row `history.tension.crimeWave`) drops the crime_wave tension.
`t2` is then undefined and the sentence is null. The house-free twin keeps the tension, because no house is hidden there, and
prints "Crime is on the rise here." The chair ruled that the rule stands (N102), so THE CURE IS THE TEST'S. Line 305 asserts a
cause sentence for a tension that the served document does not carry.
- (a) From `r34.out`: "R3 served tensions=["disputed_land"] crime={"crimHouses":[],"crimPowers":[]} t2=null". The twin is "twinSentence="Crime is on the rise here."". Handed the tension back, the served read prints the same sentence.
- (b) The registry row is `choiceWithhold({ id: 'history.tension.crimeWave' ...})` and the SQL is 212 ("registry: history.tension.crimeWave"). Lane commit 411565ff9 (R3) added it.
- (c) "R3 C server tensions=["disputed_land"] ... sentence=null": the server serves what the twin serves.
## (4) traditionDescriptionSharedPage TRAD-2 UNIT 2 x3: JOIN; THE UNIVERSE MOVED (not the point-88 sites), CONFIRMED (commit attribution PLAUSIBLE for CONTROL)
VERDICT: There are three causes, all from the lane's veil, and the traditions text itself stands.
- (a) NOT VACUOUS: the test expects this tree's curate model to OMIT a house's People eye. Lane commit 97e51d7f6 (VR34) builds `staffed` from `npcHouseOf` over every npc copy (the line read `str(n.institution)`), so `galleryVeil.js :: curateModelFor` now offers it. `added` holds no `:people`. From `r34.out`: "R4 NV town here:people=24 v22:people=24 added=0 addedPeople=0". The other anti-vacuity checks hold (income=true, crisisActive=true, roster copies 50 > 24).
- (b) CONTROL: the planted hidden house "Street gang" is counted twice, as a hidden HOUSE and as a removed PHRASE. The lane's veil leaves the name in no string of the served document, so `hiddenNamesOf` puts it in `values` too. From `r34.out`: "named=["The Old Founding Feast: Street gang","The Old Founding Feast: Street gang"] valuesHolding=["Street gang"]". WHICH lane rule removes the last copy is PLAUSIBLE: `gallerySecondHomes.js :: withholdSecondHomes`, a file new on the lane (first commit 7270c3dad).
- (c) QUESTIONS (a) and (b): the lane's row `power.share` (rule `recompose`, when `house-hidden`; `galleryRosterChoices.js :: largestRemainder`, commit 06e9e64b3) rescales the open powers' `power` to sum to 100 when a power is withheld. The floor `[name, category, power, ...]` moves on 3 towns. From `r34.out`: "metropolis ... Military/Guard 21 -> 22 ... veiledInBefore=[["Thieves' Guild",5]] sumBefore=95 sumAfter=100". The city goes 88 to 100 and the town 91 to 100. The seat, crisis, events and founding all stand (no AB-OTHER line).
- The server equals the twin: "R4 C server metropolis powers=[["Military/Guard",22],...]" equals `twin(default veil)`. Every cause is the test's universe: it treats the share as a floor and the People eye as veil-22's extra.
## (5) recentConflictReaders.walker: JOIN (the line's reader, the lane's walker), CONFIRMED
VERDICT: unregistered = [`src/domain/seat/holderOfSeat.js :: transferTakerOf (1)`]; stale [], moved [], reasonless [] (the six
run's log). The read came on the line before 9b0ffaa97 (6fa7063fb and b9bb5620e: `-S recentConflict`). The lane tip has no
`holderOfSeat.js`. On a shared read the key is withheld and `pageRederive.js :: rederiveRecentConflict` puts back the BASELINE
sentence, which names no transfer. With two takers, `transferTakerOf` then falls to the LAST edge, and the shared page names
ANOTHER HOLDER than the owner's.
- (a) The construction (r5 probe; two "power behind" edges, with `recentConflict` naming the first taker): "owner ... taker="Military/Guard" holder="Military/Guard"". The shared read is "recentConflict(re-derived)="The City Council has been debating market levies..." ... taker="Merchant Guilds" holder="Merchant Guilds"". The person is the same on both reads (Rionach Fitzgerald). The construction is in play only: `rulingPower.js :: transferRulingPower` retires the earlier edge, so a birth or a single transfer leaves one taker.
- (b) The registry rows are `power.recentConflict` (withhold always, commit bbad923a5) and the walker's REGISTER (806217e88).
- (c) The server withholds the key always (212 `_gallery_veil_withhold_always`, "registry: power.recentConflict"). This was not re-run here; the claim follows from (b) and red 6's boot.
## (6) rosterChoiceInversion.pglite VR26 FIDELITY + MAIN: JOIN (needs the LIT fortune dial, 2bc483fc8, and the lane's harness), CONFIRMED
VERDICT: The lead is CONFIRMED. The harness's `revisit` (`rosterChoiceInversion.pglite.test.js :: revisit`) calls
`factionDynamics.js :: computePublicLegitimacy(e, dp.readiness.label, r.tier)` without its fourth argument, so it uses the
DARK version 1. The born towns carry `config._fortuneLawVersion: 2` (`fortuneLaw.js :: FORTUNE_LAW_CONFIG_KEY`), lit by line
commit 2bc483fc8. The defence term is size-relative under the law. Passing `resolveFortuneLawVersion(cfg)` gives FIDELITY `[]`
and MAIN exactly KNOWN_INVERTING and KNOWN_NOT_REDERIVABLE.
- (a) From `r6.out`, case city-calm-3: stored `{score:28,label:Legitimacy Crisis,color:#8b1a1a,bd:{prosperity:-10,safety:-12,defense:0}}`, while the harness gives `{score:38,label:Contested,color:#8a4010,bd:{...defense:10}}`. Five of the eight births differ, among them village-calm-6 (46 against 43).
- MAIN is the SAME cause. Under the harness, the three legitimacy rows also differ on open towns and move from inverting to not-rederivable: "MAIN inverting=["economy.prosperity","economy.prosperityStanding","safety.safetyLabel"]". With the law, "LAW-AWARE FIDELITY unfaithful=[]", and inverting holds all six known rows.
- (b) The harness is the lane's (4ddf8c60c). The law is the line's (2bc483fc8). The line f9531eb3a does not carry this test (`git log -1 f9531eb3a -- <file>` returns nothing). The lane tip is green.
- (c) The same defect is in the IMPORT. `importRederive.js :: rederiveInPlace` step 7 calls `computePublicLegitimacy` without the law. From `r5.out`: "IMPORT vr26-city-calm-3 law=2 stored={...defense:0} ... importRederived={...defense:10}". An importer's record gets a wrong defence cause. This is outside the six; it is reported, not cured.
## CONFIRMED vs PLAUSIBLE
CONFIRMED by execution: every verdict above, each server comparison, and the lane-tip greens of 5 and 6.
PLAUSIBLE, by reading: which rule removes the last "Street gang" string (4, CONTROL); the cost line counts; red 5's server leg
(not re-run); and "red at the old join with a dark dial" for reds 1 to 5, taken from V43's brief, not re-run here.
