# F-FORTUNE: the hand anchors of the fortune lane's files, re-pinned lit (CLOSE-6's builder; not committed)

Written 2026-11-23 (`date -u` 10:4x UTC). Worktree `/home/user/wt/flip`, branch `lane/close-6-2026-11-23-flip`, from its tip
9df6731ee (both laws lit by 2bc483fc8). COMMIT: f02f969c2 (one commit, 18 test files by explicit pathspec; nothing pushed).
Logs and probes: `/tmp/claude-0/-home-user-settlement-engine/237fca18-9a05-575d-8f9a-f8032f4bd46d/scratchpad/flip/F-FORTUNE/`
(`run0.log` before, `run2.log` after, `lint2.log`, `probes/*.probe.test.js` and their `.out`).

## The first run, on the tip (run0.log)
The 20 files of the row list: 18 files red, 2 green; 35 tests red of 287. Every red is a row of the list (0 reds off the
list: no STOP of that kind). The 4 rows not red are not mine: the 3 DIAL PINs of `fortuneLawWiring` and the
`dualHatPoliticalMass` ORIGINAL arm, all done in F1 (2bc483fc8). GONE (a row of mine now green): 0.
The listed `defenceParts` R13 (E112) is red, and is left red.

## The rows, 34 moved (by the census's kind: PREMISE 17, BORN ANCHOR 16, STORED PIN 1)
Every value read from the flipped tree by a probe or by the test itself. "Re-picked" = the lowest seed of the same family
lit that meets the case's own predicate (never the asserted outcome). Born anchors whose CASE no longer held were treated as
premises, by CLOSE-5's ruling on 9df6731ee (marked "born, read as premise").

**tests/components/powerSeatRender.test.jsx** (PREMISE, 2) — thorp 57 and thorp 13 carry no governing crisis note lit.
- names the outranking rival: thorp 57 / People's Council -> thorp 35 / The Independent Bloc (78 over the Elder Council 22).
  Predicate: the note AND a rival outranking on power; scanned 0..199: 35 73 96 106 109 136. Title renamed.
- drops the claim: thorp 13 -> thorp 3 (note, no rival outranks; the lowest). Title renamed.

**tests/components/tailDisplayCivicBatch1.test.jsx** (BORN 2, PREMISE 1)
- cured: r2r-city-3 'Crime is the reason.' / 'Insecurity is the reason.' -> the Contested slot's sentence lit:
  'Crime has left ... contested in Androntopia.' / 'Insecurity has left the City-State Council's right to rule contested in
  Androntopia.' Cause: the seat moved Tolerated -> Contested lit (score 38).
- kept: r2r-city-0 'Crime keeps Goraka from ...' -> 'Weak defences keep Goraka from more than tolerating the Merchant City
  Council.' Cause: the town's cause moved. NOTE: this row no longer exercises "a plain safety label keeps crime".
- Foundations row: r2s-infiltrated-thorp-0 'Tolerated' -> 'Approved' (record Approved). The premise still holds (the ladder
  bands it `adequate`, so the ladder's word is not the record's); only the label moved.

**tests/components/tailDisplayCivicBatch4.test.jsx** (BORN 1) — KEEP r2r-city-27 'Surplus' -> 'Adequate': its composite bands
`adequate` lit with no cap (Approved, not fractured): still a keep, the composite moved.

**tests/generators/bar4HistoryOneTelling.test.js** (PREMISE 2, BORN 2)
- (e) and (f): HELD_AT_BASE re-picked (approved seat AND a legitimacy_crisis tension), lowest unlisted of 200 per family:
  r2r-city-12 -> 75, r2r-metropolis-21 -> 122, r2s-infiltrated-metropolis-0 -> 33. JUDGMENT: r2s-religious_conversion-city
  holds 0 approved seats of 500 lit (town 1 of 100, village 1 of 100, metropolis 0 of 100), so its row takes the same stress
  at the next size down that holds it: r2s-religious_conversion-town-62. (f) reads the list's first three, unchanged code.
- (e2) BORN: KEEP r2s-infiltrated-hamlet-0 /openly and widely questioned/ -> /^Most here accept the current authority's
  right to rule, but some question it openly/: the hamlet is Endorsed at the end lit (a probe of the twin swap,
  `legitimacyHeldTensions` mocked: approved at the history step and at the end). The case (accepted at the history step,
  unapproved at the end) holds on no r2s-infiltrated-hamlet of 200 lit, so it could not be re-picked. Title: "Tolerated at
  the end" -> "Endorsed at the end". The edge the KEEP guarded is no longer exercised by a named town (the guard loop stays).
- (h) born, read as premise: r2s-religious_conversion-village-0 -> 21, bar0-city-under_siege+famine-rand-110 -> 5. Both old
  seats read Holding lit (rand-110 also has its seat's holder apart). Predicate: coup reading Contested, rank 1 its first
  challenger, governing first power, gap over 6, rank 1 not the holder apart. Observation (PLAUSIBLE, not asserted here):
  village-29, 85 and 165 meet my predicate lit yet do not print the line; my predicate reads the final record, the
  standing is written earlier.

**tests/generators/bar7Scenes.test.js** (PREMISE 1) — C15153 bar0-city-wartime-rand-43 (Moderate lit) -> rand-170. Predicate:
Comfortable, a losing war (`wartimeGoesWell` false), the slot drew the requisition row (both its branches name the order):
170 179 of 200. (A first pick, rand-19, missed the drawn-row clause and went red; corrected before any commit.) Title and
the born-towns list renamed.

**tests/generators/defenceParts.test.js** (BORN 1, PREMISE 1; R13 left red)
- PRINTED_AT_BASE: 8 of 16 labels re-pinned lit (hamlet-0 Poor->Comfortable, village-0 Struggling->Moderate, town-0 and
  town-2 Moderate->Poor, city-1 Prosperous->Moderate, metropolis-0 Wealthy->Prosperous, metropolis-2 Comfortable->Moderate,
  wartime-town-0 Comfortable->Moderate). Cause: the fortune law moves the label by design.
- W3 READER re-picked (hired-only, keep.bought under 1, no hold, no crisis on the will), lowest unlisted: calm-hamlet-9 ->
  56, calm-hamlet-28 -> 260 (calm-hamlet holds 14 33 56 in 0..199, 260 first of 200..799), calm-village-1 -> 132,
  calm-village-38 -> 176, wartime-village-30 -> 62. Still ten births.

**tests/generators/prosperityStanding.test.js** (BORN 4) — PINS re-pinned lit (printed/standing/months): hamlet-2
Struggling/Moderate/1.6 -> Poor/Comfortable/1.7; village-0 Struggling/Moderate/1.7 -> Moderate/Prosperous/1.9; town-1
Moderate/Comfortable/6.1 -> Comfortable/Prosperous/6.3; metropolis-1 Moderate/Moderate/14.1 -> Poor/Poor/13.2;
under_siege-city-0 Struggling/Wealthy/8.8 -> Struggling/Comfortable/8.5; wartime-town-0 Comfortable/Wealthy/6.3 ->
Moderate/Prosperous/6.3; occupied-city-0 Poor/Prosperous/9 -> Poor/Comfortable/8.7. keepOfRecord equals keepOf(standing) on
all 13 (probe).

**tests/generators/tailNarrativeRows.test.js** (born, read as premise, 1) — 03831 r2s-indebted-metropolis-0 -> 4. Lit its first
power (Thieves' Guild) is not the governing one (Arcane Senate), so the contrast is true there. Predicate: the slot drew the
loans row AND the first power governs: 4 5 12 27 ... of 200.

**tests/generators/tailTies3Batch1.test.js** (born, read as premise, 2) — the three towns are out of the contested condition lit
(`getPrimaryCondition`: village-48 Approved, hamlet-32 and thorp-30 Tolerated).
- NOT (b): r2r-village-48 -> r2r-village-10 (the lowest contested village that also seats a faith card on the dominant rank,
  for the line-88 KEEP: Palnatoke Andersson; village-1, the lowest contested, seats none); r2r-hamlet-32 -> r2r-hamlet-4.
- INSTEAD (b): r2r-thorp-30 / Thecla Schulz -> r2r-thorp-5 / Banbh Ryan (lowest contested thorp; its seat-holder card).

**tests/generators/upkeepHired.test.js** (PREMISE 4)
- agree-village-16 (Comfortable, output 16; Prosperous lit) -> agree-village-10 (Comfortable, output 38). Predicate: the
  label Comfortable, compound.economyOutput under 50 (UPKEEP-ECONOMICS-PAGE-97's disagreement).
- agree-village-5 (Struggling, output 57; Poor lit) -> agree-hamlet-88 (Struggling, output 60). JUDGMENT: no agree-village of
  800 lit is Struggling at output 50 or more (21 of 200 Struggling, highest 44); the next size down that holds it is
  agree-hamlet (88 94 199 of 200).
- agree-village-40 (Comfortable lit) -> agree-village-28 (Poor, charter hall, no standing force: 28 alone of 200).
- agree-village-43 (standing Comfortable lit) -> agree-village-28 (standing Poor, same forces: 28 102). Titles renamed.

**tests/generators/warContractsSecretProsperity.test.js** (PREMISE 1) — r2s-wartime-city-0 (Moderate lit) -> 6 (Comfortable: 6 13
53 59 ... of 100; every Comfortable or Prosperous city of the 100 holds the secret, so the label is the premise). Title.

**tests/domain/bar5SafetyLawBand.test.js** (STORED PIN 1) — the quiet places the floor lifts in the 720: 45 -> 21, re-measured
by the test; the town-by-town loop above it passes.

**tests/domain/bar7DesksLines.test.js** (born, read as premise, 1) — C27960 bar0-metropolis-calm-rand-43 (Moderate lit) -> rand-3.
Predicate: DS-ECO-8's pool COMFORTABLE drawn at the ledger angle (the rung's provenance), no indebted crisis: 3 9 22 24 ...
Title renamed.

**tests/domain/corpusCureGuards.test.js** (PREMISE 2, re-keyed by the rows' own door) — titles carry the seed.
- DS-DEF-11::WALLED-STRAINED v7: w5-thorp-occupied-1 -> 4 (the lowest of 200 that reads the pool; it is mute there).
- DS-DEF-1::readiness CRITICAL v3: w5-hamlet-famine-5 (reads readiness WEAK lit) -> 54 (reads the pool, draws 2/4, behind a
  palisade by `defenseWallOf`: 54 69 70 72 ...).

**tests/domain/defenseWordsFindings.test.js** (PREMISE 2)
- the charter-hall row: defense-hamlet-1 (Prosperous standing, funded 1, note null) -> defense-village-16 (Moderate, "at 88%").
  JUDGMENT: no defense-hamlet of 1,000 lit is charter-only and short of purse (56 charter-only, all Comfortable or Prosperous
  standing) and no defense-thorp of 400 seats a charter hall; the next size up is the village (16 204 of 400). Title renamed.
- the palisade row: defense-thorp-20 (Comfortable, funded 1) -> defense-thorp-35 (Moderate, "at 88%": 35 144 154 168).

**tests/domain/outlookSaysThePages.test.js** (PREMISE 1) — #608 rww-metropolis-infiltrated-1 (Poor lit, output 28) -> 12
(Prosperous, output 33: 12 42 71 102 132 of 200).

**tests/domain/tailDisplayCivic3V1.test.js** (BORN 1: three pairs)
- r2r-hamlet-18 names its Guard nowhere lit (born, read as premise): -> r2r-hamlet-10, the lowest census hamlet naming the Guard
  (10, 27), its own pair kept.
- r2r-city-37: 'The hall is at odds with the ...Guard' -> 'The Military/Guard takes its orders no longer.' / 'The Guard takes
  its orders no longer.' (governanceAccount.js's line, as city-44's row).
- r2r-hamlet-27: 'Military/Guard answers to ...' -> DS-POW-4 'riskLabel: Contested' v1, COMPUTED through `variantByVid` (the
  clause before the sentinel; `powerSentenceName` for the sentence-start form). A first literal pin of it reddened
  `proseDrawnAnchors` (2 new literal anchors); fixed before the commit, the walker green.

**tests/generators/power/standingReadsTheNamedPower.test.js** (born, read as premise, 1: five towns) — predicate read from the line
handed to `settleClaimsToLabel` (mocked), the card's final label and the crisis the settle reads: r2r-city-10 (craft guild
leaves the roster) -> city-5, r2r-city-22 (Minor) -> city-56 (craft hits 1 5 11 21 56 ...; 1, 11, 21 already keys);
r2r-hamlet-17 (Contested) -> hamlet-28 (16 already a key); r2r-thorp-19, -25 (Contested) -> thorp-29, -54.

## The runs (all through the gate mutex, in /home/user/wt/flip, lit)
- Before (run0, the tip 9df6731ee): 20 files, 18 failed / 2 passed; 287 tests, 35 failed / 252 passed.
- After (run2, the final tree): 20 files, 1 failed / 19 passed; 287 tests, 1 failed / 286 passed. The one red is the listed
  R13 (`defenceParts` "the martial will (R13, R14) > R13 ..."), left red by the brief. No test dropped (287 both runs).
- `tests/lint` whole (lint2, the final tree): 3,374 tests, 3,371 passed, 3 failed: the line's three (proseComposed A0b; proseCorpusBytes RAW and GZIP). An earlier run (lint.log) had a fourth, `proseDrawnAnchors` (my V1 literals), fixed before the commit.
- `npx eslint` on the 18 files: exit 0.
- The lighting register (`sovereigntyLightingContract.walker`) stayed green despite the renamed titles (both lint runs).

## STOPs
None by the common law's letter (every red was listed and explained by its cause; no assertion weakened, no sample shrunk).

## For CLOSE-6 to rule (JUDGMENT, vetoable; each an isolated hunk)
1. Three premises extinct in their family; I took the nearest size holding the case: bar4 (e) r2s-religious_conversion-town-62,
   upkeepHired agree-hamlet-88, defenseWordsFindings defense-village-16. A STOP on these three rows is the alternative.
2. bar4 (e2) re-pinned as a born anchor (its case has no member in its family of 200) and its title's "Tolerated" corrected.
3. Born anchors read as premises (re-picked, not re-pinned) per CLOSE-5's ruling on 9df6731ee: bar4 (h), tailNarrativeRows
   03831, tailTies3Batch1 (both), bar7DesksLines C27960, standingReadsTheNamedPower (five), V1 hamlet-18.
4. tailDisplayCivicBatch1's r2r-city-0 KEEP now pins "Weak defences ...": the plain-label "crime" keep is no longer covered.

CONFIRMED: every count and value above, read from the runs and probes named. PLAUSIBLE: that the extinct premises are the
fortune law's design (read from the labels' distributions, not bisected), and the factionStanding observation in bar4 (h).

## F-FORTUNE-2 (CLOSE-6's ruling on f02f969c2 and the chair's two additions; one commit, ec216e759, on f02f969c2)
Written 2026-11-23, about 11:30 UTC (`date -u`). A KEEP or CURED row whose new value no longer carried its case's FORM was treated as a premise: it is
re-picked by the case's predicate and the original line or pair is restored. Every value was read lit by a probe
(`probes/f2.probe.test.js`, `e2.probe.test.js`, `surplus.probe.test.js` and their `.out` files).
1. **tailDisplayCivicBatch1, ACCOUNT_KEPT r2r-city-0 -> r2r-hamlet-161**, which prints 'Crime keeps Dar-al-serai from more than
   tolerating the Elder Council.' (the original form). No r2r-city of 200 and no census r2s town prints a crime sibling. The
   lowest r2r seed of 200 whose account prints the form is hamlet-161 (161, 196).
2. **tailDisplayCivic3V1, CURED r2r-city-37 (hall-as-subject) -> r2r-town-7**, the original pair restored ('The hall is at odds
   with the Military/Guard.' -> '... the Guard.'). No r2r-city of 200 prints it. town-7 is the lowest census r2r seed that does
   (r2r: town 7, 111, 188; metropolis 69, 106, 199; census r2s: 5 more).
3. **tailDisplayCivic3V1, r2r-hamlet-27 ("answers to") -> r2r-hamlet-128**, the lowest r2r-hamlet of 200 (128, 143). Its hall
   is the Feudal Stewardship. The pair is computed from DS-POW-6 'GM ADVISORY: the commander is a political actor' v3 (the
   clause before the settlement sentinel): 'Military/Guard answers to the Feudal Stewardship' -> 'The Guard answers to the
   Feudal Stewardship'. POW4H is dropped and POW6A replaces it.
4. **bar4HistoryOneTelling (e2): STOP (this row only).** The predicate: the tension's form is twinnable, the seat is accepted at
   the history step (the first `legitimacyHeldTensions` call reads isApproved true; mocked) and unapproved at the end. It holds
   on no seed of any family the file uses:
   - census r2r 0..59 and r2s 0..3, all sizes (720 births): 0.
   - r2r 60..199, all sizes (840 births): 54 twinnable, 7 accepted at the history step, 47 unapproved at the end, 0 both.
   - r2s 4..11, all sizes (720 births): 149 twinnable, 1 accepted at the history step, 148 unapproved at the end, 0 both.

   The row stays as f02f969c2 left it (the twin re-pin, title "Endorsed at the end") for CLOSE-6 to rule. The original
   /openly and widely questioned/ cannot be restored green.
5. **tailDisplayCivicBatch4, KEPT r2r-city-27 -> r2r-city-95**, 'Surplus' restored. The predicate: the Ruling authority row bands
   'surplus' and `rulingAuthorityCapOf` reads null. Lowest of r2r-city 200: 95, 149 (metropolis: 71; town: 4, 6, 16, ...). The
   KEEP list guards one word per band at or below its cap, and 'Surplus' was pinned by no other row: a fifth, as the chair
   ruled.
6. **defenceParts, PRINTED_AT_BASE's header** now says that, since THE FLIP, the values are the lit births' labels. No value moves.

Runs (through the mutex, lit, on the F-FORTUNE-2 tree):
- The 18 files: 276 tests, 275 passed, 1 failed (the listed R13).
- `tests/lint` whole: 3,374 tests, 3,371 passed, 3 failed, the line's three (proseComposed A0b; proseCorpusBytes RAW and GZIP).
- `npx eslint` on the 4 changed files: exit 0.

## F-FORTUNE-3 (the chair's ruling on the e2 STOP; one commit, 8f882d0f0, on 83baeaf14)
Written 2026-11-23, about 12:15 UTC (`date -u`). Only (e2)'s KEEP assertion in bar4HistoryOneTelling changed. That assertion now
bears r2s-infiltrated-hamlet-0 under LAW 1: both laws are forced to 1 in its own config (`_seatLawVersion: 1`,
`_fortuneLawVersion: 1`, the keys `densityCreateBoundary.js :: birthConfig` mints; COMMON-RULES 14 (c)).
- A probe (`probes/e2law1.probe.test.js`) read the law-1 birth: accepted at the history step (the twin swap's calls
  [true, false]), Tolerated at the end, and printing the original form ('... openly and widely questioned ...').
- Restored: /openly and widely questioned/ and the title's "Tolerated at the end". An anchored assertion pins the law-1 label
  'Tolerated'.
- The comment names the 2,280 lit births searched (r2r 0..199 and r2s 0..11, all sizes: 8 accepted at the history step, none
  of them unapproved at the end). Its PLAUSIBLE reading: the fortune law's merits only add to the seat's standing after the
  history step (FLIP-LIST-B s.1), so a seat that is accepted there ends accepted.
- The lit STRIDE arm (`['r2s-infiltrated-hamlet-0', ...STRIDE]`) is untouched and runs lit.

Runs (through the mutex): the file lit, 9 passed of 9. `tests/lint` whole: 3,374 tests, 3,371 passed, 3 failed, the line's three. `npx eslint` on the file: exit 0.
