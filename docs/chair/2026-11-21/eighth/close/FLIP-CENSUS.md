# THE FLIP'S CENSUS (CLOSE-1 unit 4; IN PROGRESS; last written 2026-11-22 14:56 UTC, read from `date -u`)

THE RUN (the chair's cut, 13:07 UTC): ONLY THE LIT HALF, on the lit scratch `lane/close-1-lit-scratch-2026-11-22` at
e987c3e36 (the trial join of point 97 and fortune f13f31820, its doors, and the three dials). THE DARK LIST IS
`ci/RED-AT-LINE.tsv` (64 rows at the line 1ec3e81d1, point 97). Every lit red is read BY NAME against it
(`census/match.mjs`); a red not on it is the flip's (or the trial fortune's), and is classed:
(a) a pin, born row or census its door or the test re-records at the flip; (b) a golden or reference, the owner's;
(c) a size figure; (d) A TRUE FAULT. The classing of a part's reds is a read-only helper's from each test's source,
every (d) and (d?) VERIFIED BY CLOSE-1 by run. Per-part lists: `census/lit-<part>-match.tsv` (ON/NEW) and
`census/lit-<part>-classed.tsv` (class, lane list, cause). The runner: `census/run-parts.sh`.

"Lane list" says whether a lane's OWN flip census already named the red: SEAT (SEAT-10's `recut/CENSUS-LISTS.md`),
FORTUNE (FORTUNE-3/6's `LIGHTING-WORKLIST.md` B1), or JOIN: named by neither (the two laws' interaction, or a test
neither lane ran). JOIN is what this census adds.

## PART 1: tests/generators, tests/data, tests/property (lit, ended 14:17 UTC)
633 files, 4,692 tests: 99 red; 20 on RED-AT-LINE; 79 NEW, classed:

| class | SEAT | FORTUNE | JOIN | all |
|---|---|---|---|---|
| (a) pin / born anchor / premise | 9 | 22 | 46 | 77 |
| (a*) a guard that predates a ruled design (re-cut) | 0 | 1 | 0 | 1 |
| (d) TRUE FAULT | 0 | 0 | 1 | 1 |
| (b), (c) | 0 | 0 | 0 | 0 |

### (d) TRUE FAULT 1: FORTUNE LIT CUTS THE CRISIS'S OWN POWER IN A THORP (sent to the chair at once)
`tests/generators/people/dualHatPoliticalMass.test.js` › "a small place keeps the power the fold of the office's face
into the leader's house cut". CONFIRMED by `census/dualhat-probe.mjs` on four trees: dark 8/8 hold; SEAT ALONE 8/8;
FORTUNE ALONE and BOTH: 3 misses (rvf-slave_revolt-thorp-5 no Revolt Leadership; rvf-wartime-thorp-2 no War Council;
rvw-thorp-86 no Highborn Circle; each roster "Elder Council*" alone). On the slave-revolt thorp (`census/dualhat-one.mjs`):
prosperity Poor → Comfortable, legitimacy 19 "Legitimacy Crisis" → 38 "Contested", factions [Revolt Leadership 59,
Elder Council 41] → [Elder Council 100], the revolt's leader gone from the cast, and stability STILL "Unstable (revolt
not contained)": the record states a revolt with no power and no leader. THE LANE: fortune.

### (a*) `tests/generators/defenceParts.test.js` › "R13: where something is built or standing, the will counts no more than the armed bodies that carry it"
"v3build-village-3: expected 6.9 to be less than or equal to 6.8". NOT a product fault: `defenseGenerator.js`'s own
X4 rule (UPKEEP-MEASURE-2, ruled after R13) holds the will at or above the place's unheld base rate ("so a wall never
lowers the will"), which may sit above the armed bodies; the test's R13 bound does not include that floor and held on
the dark corpus only. FOR THE CHAIR: the guard re-cut with the X4 floor (the upkeep lane's), not re-pinned.

### (a) the 77 pins: see `census/lit-gen-classed.tsv` (one row each, its cause). No test names a refreeze door
except `tests/fixtures/goalHashes.mjs` (the goal sentences' hashes).

### Related evidence for U8 (the fortune lane's CRISIS-POWER unit, E86): class (a), NOT a fault on its own
`tests/generators/people/successionClaimants.test.js` (the review's two towns) and `tests/domain/people/seatKeeper.test.js`
(the review's Grudino): rvf-succession_void-city-4 loses its "Noble Claimant (Reform Line)" UNDER FORTUNE ALONE
(`census/claimant-probe.mjs` on four trees: dark and seat-alone keep both claimants; fortune-alone and both keep one),
with prosperity Comfortable → Struggling and legitimacy 53 → 14 (a city read against cities). The page stays true of
its record ("a claimant circles"), so it is a premise that moved; but it is the SAME EFFECT as true fault 1 (the fortune
law changes which powers a crisis is born with), in a city and in the other direction (the place falls, not rises).

## PART 2: tests/domain (lit, ended 14:51 UTC)
1,353 files, 20,060 tests: 62 red; 5 on RED-AT-LINE; 57 NEW, ALL class (a) (`census/lit-domain-classed.tsv`):

| kind | SEAT | FORTUNE | JOIN | all |
|---|---|---|---|---|
| PREMISE (a seed chosen to meet a case; ten corpus pool rows name their door: re-key the row) | 0 | 6 | 26 | 32 |
| DIAL PIN (pins a dial's dark default or the absent marker: the three wiring files, seatContest, livingContentLawWiring, fortuneMeritSentence U5b (b)) | 10 | 3 | 1 | 14 |
| BORN ANCHOR | 2 | 2 | 5 | 9 |
| STORED PIN (`dailyLifeNoPeople`: door `tests/fixtures/daily-life-no-people-before.json`; `bar5SafetyLawBand`'s in-test count 22 vs 45) | 0 | 1 | 1 | 2 |
| (b), (c), (d) | 0 | 0 | 0 | 0 |

NOTES: `tests/domain/fortuneLawEconomyHeader.test.js` ("law 1 still fills the slot") is the red fortune's U5d cured
(199a29f82, merged 5110c1e8d, on the line): the lit scratch lacks it; it clears when the lit ref takes c110dd85b.
MASKED GUARDS, re-read after their re-pin: `tensionCause` and `dailyLifeNoPeople` stop at a failed premise, so their
owner-versus-public parity arms are not read on the seeds that failed.

## PART 3: tests/build whole, after one build (lit, ended 14:55 UTC)
621 tests: 15 red, ALL 15 ON RED-AT-LINE; nothing new. THE LIT SIZE FIGURES (class (c), for the owner's size signing),
beside the line at point 98 (dark):

| figure | the line, point 98 (dark) | the lit scratch | difference |
|---|---|---|---|
| first paint raw | 1,184,071 | 1,184,071 | 0 |
| first paint gzip | 376,756 | 376,747 | -9 |
| first paint Brotli | 316,424 | 316,505 | +81 (PLAUSIBLY hash entropy) |
| the generation worker | 2,704,317 | 2,706,652 | +2,335 (PLAUSIBLY the flip: the dark dials let the minifier drop dead lit branches; NOT YET PROVEN by a dark build of the same tree) |
| the engine chunk | 929,672 | 929,672 | 0 |

## PART 4: tests/lint whole (lit, ended 15:10 UTC)
223 files, 3,364 tests: 5 red; 3 on RED-AT-LINE (the line's three size rows); 2 NEW, both one fault:

### (d) FAULT 2 FOR THE CHAIR'S RULING: THE SEAT LAW LIT BREAKS THE FACT LAYERS (sent to the chair at once)
`tests/lint/factLayers.walker.test.js` › "every leaf declares exactly the strata it touches, and every stored field it
reads is placed" and › "nothing reads at or above its own layer (shrink-only) LEAVES: the tree reads exactly the
register". CONFIRMED by `census/leaf-probe.mjs` (the walker's own `gridBirths` and `leafArm`) on four trees: the leaf
`powersList` (`factLayers.js`: layer 3, `domain/dossier/powerStrata.js :: derivePowerStrata`, reads powerStructure,
config, _config) touches exactly those three dark and with fortune alone; with the SEAT law (alone or both) it also
touches economicState (stratum 1), npcs (3), stress (0), stressors (0) and tier (0): npcs at the leaf's own layer is
the VIOLATION. PLAUSIBLY by `rulingPowerCoup.js :: coupContenders`, whose lit contest (`SEAT_CONTEST_LIT`) reads the
circumstances and the cast. Two cures, the chair's to rule: the contest does not read the cast inside that leaf (a src
cure of the seat lane), or the row is re-declared and re-layered by the chair's leave (COMMON-RULES 6). Neither lane's
own census ran `tests/lint` lit: JOIN.

RULED (the chair's E91, 15:13 UTC): NOT a lane's fault but an EXPECTED MOVE OF THE FLIP: the lit contest is meant to
read the circumstances and the cast; the leaf's row moves to layer 4 with its eight reads IN THE FLIP'S OWN COMMIT
(`CLOSE-RECIPE.md` step 1b). The path is CONFIRMED by `census/path-probe.mjs`; the row change REHEARSED in a copy of the
lit tree by `census/all-leaves.mjs`: no knock-on. For the veil (the chair carries it): the contenders list read from
the cast on a shared read goes on the security reader's list.

## PART 5: tests/components, tests/ui, tests/pdf, tests/store, tests/lib (lit, ended 15:29 UTC)
1,057 files, 8,489 tests: 14 red; 2 on RED-AT-LINE; 12 NEW, ALL class (a) after verification (`census/lit-ui-classed.tsv`):
PREMISE 4, BORN ANCHOR 4, STORED PIN 3 (one is `pageCensus.walker`: the rendered dossier LOSES one banked finding,
P16three, and gains none; its door `scripts/census/page-census.register.json`), and one the helper marked (d?), VERIFIED
NOT (d) by CLOSE-1 (`census/mod-probe.mjs`): `tests/components/governingModifierSurfaces.test.jsx` › "r2r-city-56
(arcane-advised): every surface prints 'mage counsel' and none prints the key": lit, the governing Merchant Guild
Council falls from 3rd to 8th by power, so the Summary's power bar (`SummaryTab.jsx`: `allFactions.slice(0,5)`) does not
list it, and its chip with it; the Power tab and the PDF still print "mage counsel". A premise that moved (class (a)).
A PAGE QUESTION FOR THE CHAIR, not a fault: under the lit laws a ruler can rank below fifth by power, and the Summary's
bar then does not show the ruling power at all. By lane list: FORTUNE 6, JOIN 6, SEAT 0.

## FOR THE VEIL (the chair's 15:29 question): `powerStructure.recentConflict` at birth, lit
`census/rc-count.mjs` over the 900 visitor births (`visitor-<size>-0..149`, 150 a size, the plan of unit 6; born through
`birthConfig` WITHOUT the store's custom-content runtime) on the lit scratch: EVERY ONE of the 900 stores the BASELINE's
sentence (`governanceNarrative.js :: buildGovernanceLabels`); 0 store a transfer's (`rulingPower.js ::
transferRulingPower`'s wordings, `holderOfSeat.js :: TRANSFER_WORDINGS`); `previousGovernments` is empty on all 900. So
AT BIRTH no transfer sentence exists to withhold, criminal taker or not: a transfer's sentence is written only in play.
