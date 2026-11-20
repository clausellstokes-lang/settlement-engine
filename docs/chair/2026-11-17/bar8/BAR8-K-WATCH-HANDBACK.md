# BAR8-K-WATCH · HAND-BACK · the watch, the court and the war bar say what the town's own force and row say

Seat K-WATCH of `docs/chair/2026-11-17/sixth/briefs/BRIEF-BAR8.md` (the chair's lane), with the seat's section as my
prompt gave it. Base: `lane/bar8-audit-k-2026-11-17` at **1ceae1ede** (checked: `git rev-parse HEAD` read 1ceae1ede at
the start). Branch `lane/bar8-k-watch-2026-11-17`. Rulings in force: BR14 (c).

## 0. NOT COMMITTED, NOT PUSHED: MY PERMISSION CHECK REFUSED THE COMMIT

My first `git add` + `git commit` on the branch was REFUSED by this session's own permission check ("Destructive or
Unwanted Actions": the checkout's CLAUDE.md asks for explicit authority to stage or commit, and the seat's prompt reached
me as a system notification, not as the owner's message). The brief's rule holds: the refusal stands, and I did not route
round it. **Everything below is in the checkout's working tree, uncommitted**: five source files modified, one new leaf,
one new test, and this file. The branch holds no commit of mine and nothing was pushed. The owner can authorise the
commit, or the chair can take the diff (about 24 KB with the new files). Every figure below was measured on exactly that
diff, in a scratch worktree at 1ceae1ede holding the same files (I diffed the two `git diff`s: no difference).

## 1. THE RULES, BEFORE AND AFTER (instances · the thirty · the 150 · the 720; `runK.mjs`)

| rule | base | tip | the guard |
|---|---|---|---|
| 13a.court, THE SERVICE LINE (`servicesGenerator.js :: SLOW_LAW_DESC`) | 1 · 0 · 0 | **0 · 0 · 0** | (1) |
| 13a.court, the desk's line (`defense.generated.js`: K-DESKS's, not mine) | 2 · 0 · 2 | 2 · 0 · 2 | — |
| 13e.hours | 1 · 2 · 4 | **0 · 0 · 0** | (2) |
| 15d.bar | 1 · 0 · 2 | 1 · 0 · 2 | **LEFT BY NAME (§8, 2)** |

Across the three populations, NO OTHER RULE OF THE RUNNER MOVES: the per-rule tables of base and tip differ only in the
13a and 13e rows. Pages that change at all, dump against dump: in the thirty, bar0-town-occupied-rand-47 (13a) and
bar0-village-calm-rand-46 (13e); in the 150, bar0-town-calm-rand-31 and -41 (13e); in the 720, r2r-town-21, -31, -41 and
r2s-wartime-town-2 (13e). (I rendered the tip with 15d's reading still in it. The only other changed lines were the PDF bar
word "Adequate" → "Weak" in 1 town of the thirty and 6 of the 720. That reading is now taken out, and
`defenseDisplay.js` is byte-identical to the base, so I derived these lists from that render rather than rendering again.)

13a's count "to zero": the auditor's 13a covers 2 towns of the 720 and 3 instances of the thirty, desk and service
together. The SERVICE LINE accounts for 1 instance (the thirty: C39616) and none in the 150 or the 720; at the tip it is
0 everywhere. The other 2 + 2 instances are the desk's line ("arrested, heard and held"), which is K-DESKS's.

THE GUARD: `tests/generators/bar8Watch.test.js` (new). Six fixed seeds; each rule's law runs over all of them, with a
positive and a negative per rule, plus the atom tested on constructed rosters. **5 of 8 red at 1ceae1ede** (each rule's
law and each positive, and the declaration arm; the three green there are the two negatives and the leaf's own unit arm,
with the leaf copied in). **8 of 8 green at the tip.** Anchors: (1) bar0-town-occupied-rand-47 (C39616); NEGATIVE
bar0-town-occupied-rand-28 (a court sits and a gaol holds, so the line stays). (2) bar0-village-calm-rand-46 (C42053),
bar0-town-calm-rand-31 and -41; NEGATIVE bar0-town-calm-rand-36 (a force that keeps the day, so the line stays).

## 2. THE CONTROLS (the thirty; `controlsK.json`)

- **C39616** (13a, the service line): GONE. bar0-town-occupied-rand-47's Services row now reads "The law here is slow and
  easily outbid. Disputes end with whoever can apply more violence or pay more for protection." Its Legal row reads
  Prison only / Detention without process.
- **C42053** (13e): GONE. bar0-village-calm-rand-46's guard line now reads "The local watch maintains standard patrol
  coverage. ...". Its watch's own text is "Each household takes its turn walking the lanes after dark ...".
- **C18613** (15d): STANDS, as at the base (§8, 2).
- C40154 and C34395 (13a, the desk's line) still stand; they are K-DESKS's. C6290 (WEAK) is as it was (clear). C18612
  (EXPLAINED, "Adequate▼") is clear at both base and tip. Every other control in the file is as it was. The runner reports
  `controls: 49 of 49` at the base and `47 of 49` at the tip; the two misses are C39616 and C42053, cleared by design. So
  the runner exits 3 BY DESIGN over the thirty at the tip, and 0 over the 150 and the 720 (they hold no control's town).

## 3. THE CURES

1. **13a** (`servicesGenerator.js`): `lawlessRow` now reads the Legal row's court, through `courtHoldersOf({
   institutions, availableServices: <the services drawn so far> })` (the reader of the atom `court sits`, in
   `defence.js`), instead of the `court` name test. `SLOW_LAW_DESC` declares `needs: ['court sits', 'prison']`. Checked
   against the final record over the three populations: every "The court sits and the gaol holds" at the tip stands where
   `courtHoldersOf(record)` holds and a gaol stands (0 against, of 4 printed).
2. **13e** (`safetyProfile.js`, plus the new leaf): #18 is now drawn through `drawDeclared`, with the seed's frame chosen
   exactly as `voiceOf` chose it (no roll). Its fourth line declares `needs: ['force walks by day']`. A refused frame
   resolves to an admitted line of the same pool, so only a refused winner moves. Checked against the final record:
   every "most hours of the day" at the tip stands where the atom holds (0 against, of 54 printed). The detector's
   instances match the atom one for one: the 3 in the thirty and the 150 are exactly the towns where the atom reads
   `false`. `STANDARD_PATROL` keeps its four strings, because the guard line's re-readings match a text by its frame. I
   build the declared pool inline at the draw so the file stays at the generators' 800-line ceiling: it counts 800 at the
   base and 800 at the tip.

R7, THE POOL: #18 has four lines and only the fourth is declared, so no town's admitted pool falls below three lines.
13a draws nothing.

## 4. NEW VOCABULARY FOR THE OWNER'S VETO LIST (BR14 (c), rule R6)

- **THE ATOM `force walks by day`** (13e). It is written in `factVocabulary.js` beneath `patrol`, its subject (the force).
  Its reader is `src/domain/facts/forceHours.js :: forceWalksByDayOf`, which imports nothing (EG1). It reads true where
  some live order-keeping house (watch, militia, garrison, guard, barracks, patrol, constabulary or warden; not
  "Access to ...") is not kept to the night by its own description. A description is night-only when it says "after
  dark" or "night" and names no day and no gate; a gate is held by day, so "walk the night and hold the gates" counts as
  walking by day. It reads false where every such house is night-only, or where none stands, and undefined where there
  is no roster. It refuses the line in bar0-village-calm-rand-46, bar0-town-calm-rand-31 and bar0-town-calm-rand-41, and
  in r2r-town-21, -31, -41 and r2s-wartime-town-2 of the 720.
- THE SHARED FACTS' FILES, line by line: `factVocabulary.js` (the entry, and its getter's `@property` in the `FactsLike`
  typedef), `factsOf.js` (the import and the getter), and **`factLayers.js` (one home row, `forceWalksByDay`, beside
  `paidWatch`)**. My section names two touches. The third is the layer table's row, which every vocabulary home must have
  (the table's own docblock: "Every `home` a vocabulary dimension names is a row here"). I name it here for the chair; it
  is one line.
- NO NEW TEXT. Every line a reader now sees in a changed place already printed elsewhere: the service row's other
  description, and the patrol pool's other three lines.

## 5. DECLARED MOVES (R5): the 525 reference configurations, every top-level field hashed, base against tip

**93 of the 525 move, all in one field family: `economicState.safetyProfile.guardEffectivenessDesc`** (13e). No other
field of `economicState` moves, and no other top-level field. These are true instances. For example,
`town|germanic|plains|road|civilized|golden-master-v3` has a "Town watch" whose text is "Part-time guards who walk the
night and keep the peace."; it printed "You will see the town watch on the rounds most hours of the day" and now prints
"The town watch patrols on a regular round ...". The reference corpus repeats its seeds across configurations, so it holds
the night-only town watch far more often than the census does (4 of 720). 13a moves none of the 525 (`availableServices`
is unmoved); across the populations it moves 1 town, in the thirty. (I hashed the 525 with 15d's print-time reading still
in the tree; that reading moved no record, so the count stands.) No new field on the saved record; nothing in
`assembleSettlement.js`, `vite.config.js` or `package.json`.

## 6. THE BOOKS MY CURES MOVE (stored figures: the close's, R10; I re-took none)

`tests/fixtures/generator-golden-master.json` and the instruments pinned to the golden. N3's `pipelinePinnedMode.test.js`
(A1, A2, A5) and `generationForkCensus.test.js` (A1, A3e, A4, A6) are red at the base and at the tip under the same seven
names. In their messages the arrays of moved golden rows grow from 37 to 38 (the one more is mine), and the control row's
hash changes. The census's and the readers' renders also move on any page with a night-walking watch.

## 7. THE NET (each alone, through `sh scripts/gate-tail.sh`; base 1ceae1ede in a scratch worktree, tip the checkout)

| gate | base | tip |
|---|---|---|
| the doors' last lines | classes `hits 1787 · banked 1938 · fresh 0 · stale 151 · ceiling 1938`; things `fresh 39 · stale 72 · first-register stale 7 · banked 4688 · strips fresh 0 stale 0 banked 107` | THE SAME for both doors: no fresh line. (An earlier shape of my 13e draw made a fresh strip, `STANDARD_PATROL_DECLARED(lawRef)`; I rewrote it.) |
| `typecheck:domain:strict` | — | OK, 1113 / ceiling 1113 |
| `typecheck:ratchet` | — | OK, 167 / ceiling 167 |
| `npx eslint` on the changed sources and the guard | clean | clean (max-lines: `safetyProfile.js` at 800) |
| `tests/architecture` | 0 red of 347 | 0 red of 347 |
| `npm run build`, then `vendorPdfLazy` + `bootSmoke` | `vendorPdfLazy` "every consumer in the tree is declared" red (`src/domain/display/crisisStoppedRow.js` is absent from the goods roster) | built; the same one red with the same message; `bootSmoke` green |
| N3 (`pipelineContract`, `isolatedTrade`, `pipelinePinnedMode`, `generationForkCensus`, `publicProseEquality`) | 7 red (§6) | the same 7 by name (37 → 38 rows, §6); `publicProseEquality` green at both |
| the earlier guards (`bar5*`, `bar6*`, `bar7*` of `tests/domain`, `tests/generators`, `tests/components`) | 1 red: `bar6MarksLaw8.test.js` (a) THE ZERO over the census's 720 | the same one |
| N2 `tests/lint`, by name | 68 red tests (71 names) | the same names. The one exception, `ledgerCitationIntegrity` ("git ls-tree ... refs/heads/review-fixes-2026-07-08"), is red at both; its name carries the checkout's path, so it differs by path only. `chartProportionCensus` ARM 4 went red under 15d's reading and is green again with it taken out (§8, 2) |
| my guard | 5 of 8 red | 8 of 8 |
| N5 | — | **clean**: at the line's tip `lane/join-2026-11-14` 9378609ba (which holds my base), my diff applies with no collision and my guard is 8 of 8 there (a scratch worktree; nothing committed) |

## 8. LEFT BY NAME

1. **The commit and the push** (§0): refused by my permission check. The work is in the working tree.
2. **15d · the war bar's word: STOPPED ON A MISMATCH WITH THE OWNER'S STANDING GUARD.** I wrote the reading the brief
   asked for, in `defenseDisplay.js`: the Invasion & War band held at Weak where the place has no wall, garrison, militia,
   watch or contracted company (`standingDefenseForces`, the roster the Invasion row's sentence reads). It fixed the PDF's
   word (1 town of the thirty, 6 of the 720). It also turned red `tests/lint/chartProportionCensus.walker.test.js` ARM 4,
   the guard of ODQ §934.20: "pdf-defense-threat-row: src/domain/display/defenseDisplay.js no longer reads `status:
   scoreBand(score)`: the run and its label have parted". That census holds the PDF bar's label to the band of the very
   score the bar is drawn from. A word read off the roster beside an unchanged bar length (a 44 % bar labelled Weak, where
   44 is Adequate on the ladder) is exactly the class that guard forbids. The guard is not mine to edit, and a re-key would
   loosen it. So I TOOK THE READING OUT: `defenseDisplay.js` is byte-identical to the base, and the guard holds no 15d arm.
   Two further facts for the ruling: (a) the web Defense tab does not read `deriveDefenseReadiness` for its badge at all;
   `src/components/new/tabs/DefenseTab.jsx:422-424` computes `scoreBand(sc)` and `scoreColor(sc)` from
   `defenseProfile.scores` itself, and it is the only bar the detector reads, so even the reading I took out moved 15d's
   count by nothing (2 → 2). (b) Any cure that keeps §934.20 must move the run and the word together: either the military
   score is held for a place with no line and no force where the score is written (`defenseGenerator.js`, a declared
   move of `defenseProfile.scores.military`), or both bars (PDF and web) draw a held score. Either way it is the owner's or
   the chair's call and outside my files.
3. **13a, the desk's line** (`defense.generated.js`, "arrested, heard and held"): K-DESKS's (2 · 0 · 2 stand).
4. **The lawless row's third writer** (my file, NOT my rule, not touched): the crime-type path in `servicesGenerator.js`
   (`crimeTypes.has('Lawlessness')`) adds "Weak law, bring coin" with the "easily outbid ... whoever can apply more
   violence" description directly, past `lawlessRow`. So it prints in r2r-city-41 (the 720; base and tip alike), where
   "Multiple courthouses" sit and a large prison holds. That belongs to BAR6-CRIME's 9a.lawless family (the line is false
   where a court and a gaol stand), not to 13a. The cure would be the same `lawlessRow(institutions, buckets)` at that
   site. Left for the chair.
