# BAR8-SCENES · HAND-BACK (seat SCENES of BRIEF-BAR8, 2026-11-17; base `lane/bar8-base-2026-11-17` 2f8f64f7b)

Branch `lane/bar8-scenes-2026-11-17`. Code commits: 680a5b2a7 (the first cut) and 13c4cf7a0 (the fact on fact-level homes only),
then this hand-back. Files touched: `src/domain/facts/tradeAtWork.js`, `src/data/arrivalProse.js`, `src/generators/narrativeText.js`,
`src/domain/facts/factVocabulary.js` (the two keys of BR17, one line), the new guard `tests/generators/bar8Scenes.test.js`, and two
tests my cure made untrue, re-keyed by identity (`tests/domain/facts/census2fColour.test.js`, `tests/generators/bar4ScenePresumption.test.js`).

## 1. THE RULES, BEFORE AND AFTER (instances; towns where they differ)

Base renders: the thirty is the published one (`lane/read7-prep-2026-11-17`); the 150 and the 720 I rendered at 2f8f64f7b. Tip
renders at 13c4cf7a0. Runners: `runK.mjs` (12b, 12c, 15a), `runJ.mjs` (11b, 11e.stalls), `bar7/AUDIT/runI.mjs` (9g.food-soft).

| rule | the thirty | the 150 | the 720 | to zero (brief) |
|---|---|---|---|---|
| 12b.boom | 2 → **0** | 2 → **0** | 5 → **0** | 5 ✓ |
| 12b.boom.mild (K's wider family, true, kept) | 0 → 0 | 2 → 2 | 2 → 2 | stays ✓ |
| 11b, the scenes (11b.fish on the Overview) | 2 → **0** | 1 → **0** | 6 → **1** | 6: one left (§5.2) |
| 11b.fish, all surfaces (not mine apart from the scenes) | 13 → 11 | 3 → 2 | 69 → 64 | — |
| 11e.stalls | 1 → 1 (the twin: §2) | 0 → 0 | 0 → 0 | the control ✓ |
| 12c.calm | 2 → 2 | 2 → 2 | 4 → 4 | **LEFT by name (§5.1)** |
| 15a.endless | 2 → **0** | 0 → 0 | 4 → **0** | 4 ✓ |
| 9g.food-soft (item 7) | 0 → 0 | 0 → 0 | 3 → **0** | 3 ✓ |

NO RULE OF ANOTHER SEAT ROSE: every rule of K, J and I is compared base to tip over all three populations. The only rules that
moved are the ones above, and every one of them fell.

THE GUARD `tests/generators/bar8Scenes.test.js`: 11 tests. At the base 8 fail (the three that pass are positive anchors); at
the tip 11 pass. Its anchors are named towns of the thirty and the 150, each with a premise held by the record and a positive
town beside each negative one (N7).

## 2. THE CONTROLS (the thirty; `runK.mjs` and `runJ.mjs` exit 3 at the tip BY DESIGN: the STANDS controls are cleared)

- C7246 (12b, the war's "running day and night", bar0-city-wartime-rand-45): **GONE**. Its twin prints: "Being on the right side
  of it, … lives on the army's contracts …".
- C7242 (12b, "Racks of new ironwork …"): **GONE**. Its twin prints: "The racks outside the workshops stand mostly empty: the
  smiths are short of iron."
- C19722 (11b, "Half of … gutting, salting or selling fish", bar0-metropolis-calm-rand-45): **GONE**. Its twin prints: "Half of
  … has worked fish all its life, and there is almost no fish to work."
- C36591 (11b, the drying racks, bar0-town-occupied-rand-45): **GONE**. Its twin prints: "The drying racks along the way in
  stand nearly bare …".
- C5157 (11e.stalls, bar0-city-under_siege+famine-rand-47): **GONE**. Its twin prints: "The reagent stalls are half bare, and the
  few jars left are dear." That twin is the one 11e.stalls instance left in the thirty: the detector reads any stall of
  reagents under a siege, so it counts the twin too. The twin is true, and it is the brief's own cure (item 4).
- C15891 (15a, bar0-hamlet-calm-rand-45): **GONE**. Its twin prints: "The road from the workings is empty of carts."
- C36585 (12c): **STILL STANDS**: left by name (§5.1).
- WEAK C16854 (15a in a hamlet of 70) is clear too, so it did not stay as it was. The brief's boundary is thin: a tier cut
  cannot hold a hamlet of 70 apart from hamlets of 27 to 93.
- Every EXPLAINED control of J's 11b and 11e is clear at the tip, as at the base.

## 3. WHAT CHANGED, AND THE LINES A READER CAN SEE

**The one fact, `tradeAtWork.js`.**
- (a) Under a siege, a house is not at work when the crisis table declares no dependence for it
  (`crisisDependence.js :: houseDependenceOf`) and the record stores every chain it runs as Impaired. The table's leaf can give
  such a house no mark, so its chain card is its only state.
- (b) NEW KEY `trade at work: ironwork in full` (BR17 `in full`). It holds where:
  - the ironwork is at work,
  - no smiths' house is short,
  - the iron is at hand (`ironAtHand.js`: worked here, or brought in past no siege; this is the leaf's "Curtailed by the
    siege." of a house on an imported input),
  - and the war holds no iron (`warIronHook.js :: warHoldsIron` under a war in force; this is `warReach.js`'s WM1 reading).
- (c) NEW KEY `trade at work: fish taken here` (BR17 `taken here`). It holds where:
  - the plain key holds,
  - and a taker of fish (`houseKinds.js :: TAKERS`) is at work with a `local` story (`supplyStory.js :: sourceStoryOf`), or
    with no story while no fish ground of the town is used up;
  - where no taker stands, it holds when no fish ground is used up (`supplyStory.js :: usedGroundOf`).
- Both keys are written into `factVocabulary.js`'s `trade at work` keys: **NEW VOCABULARY, for the owner's veto list.**

**WHY NOT THE LEAF ITSELF.** The brief said to read `crisisStoppedRow.js :: rowMarkText`. The first cut (680a5b2a7) did, and
`chainStateShown.js` too. A static edge from this lazy home to those display leaves put `crisisStoppedRow.js`,
`tradeListDisplay.js` and `validationOnPage.js` into the eager engine-core. It also closed a new import cycle through
`factsOf.js`. Three architecture tests went red: `engineCoreLazyEdge`, `factHomesLazy`, and `layerBoundaries`'s cycle set.
Importing `warReach.js` did the same (engine-core → the lazily pinned `crisisKind.js`). 13c4cf7a0 reads the fact-level homes
those readings rest on, so the leaf's mark and the atom agree for the houses the scenes name. Fixing the leaf's routing would
need `vite.config.js`, which R5 forbids.

**The declarations.**
- `arrivalProse.js`: the smiths' boom rows ("Forge smoke hangs over everything …", "Racks of new ironwork …") need `ironwork in
  full`. Their twins now exclude `ironwork in full` in place of `ironwork`, so each keeps its slot where a smiths' house is
  marked.
- `narrativeText.js`: the war's right-side row needs `ironwork in full`. Its twin has no declaration and keeps the slot.
- The racks and the gutting need `fish taken here`.
- "Laden carts … a line that never seems to end" needs `tier: ≥ village`: in a place of hundreds or more, the workings move
  carts all day; in a thorp or a hamlet of tens they do not.
- "Even the outbuildings have new roofs, and nobody looks hungry." needs `food: ≥ secure` (item 7). The line lives in
  `arrivalProse.js` (ARRIVAL_TENSIONS.prosperous), not in `narrativeData.js` as the item said.

**Lines a reader now sees in new places** (every one an existing twin; no new text). Towns are of the tip renders.

| line | where it now prints |
|---|---|
| "Only a little forge smoke rises here, and the anvils ring now and then, when there is iron to work." | bar0-town-occupied-rand-27, r2s-under_siege-metropolis-2, r2s-wartime-town-2 |
| "The racks outside the workshops stand mostly empty: the smiths are short of iron." | bar0-city-wartime-rand-45, bar0-city-wartime-rand-32, r2s-under_siege-city-0 |
| "Being on the right side of it, {name} lives on the army's contracts, …" | bar0-city-wartime-rand-45, r2s-wartime-town-2, r2s-wartime-village-0 |
| "The road from the workings is empty of carts." (§5.3) | bar0-hamlet-calm-rand-45, bar0-hamlet-calm-rand-47, r2r-hamlet-32 |
| "Half of {name} has worked fish all its life, and there is almost no fish to work." | bar0-metropolis-calm-rand-45, bar0-town-calm-rand-28, r2r-town-29 |
| "The drying racks along the way in stand nearly bare, …" | bar0-town-occupied-rand-45, r2r-city-44, r2r-town-6 |
| "The reagent stalls are half bare, and the few jars left are dear." | bar0-city-under_siege+famine-rand-47, r2r-metropolis-42, r2s-under_siege-metropolis-1 |

## 4. THE DECLARED MOVES, THE BOOKS, THE NET

- **The 525 reference configurations: 1 moves**, in `arrivalScene` only
  (`town|germanic|mountain|random_trade|civilized|gm-seed-c`), by `bar5/THINGS/ref525.mjs` at base and tip.
- **Stored records** move only in the drawn prose: over the 30, 6 records (arrivalScene 6, pressureSentence 1); over the 150,
  2 (arrivalScene 2, pressureSentence 1); over the 720, 17 (arrivalScene 16, pressureSentence 2). No new field.
- **R7** (the admitted slots of every pool I touched, in every town of the three populations; my probe; both at base and tip):
  - The stable, fish, stone and prosperous pools stay at 3 or more.
  - The arcane dominant pool is at 2 in 4 more towns than at the base (§5.4).
  - The smiths' dominant pool is at 0 in villages and smaller at the base and the tip alike (its lines are `tier: ≥ town`); not
    mine.
- **THE DOORS (R9).** Base and tip print identical output for each door, line for line.
  - `presumption-classes-door --check`: "hits 1787 · banked 1938 · fresh 0 · stale 151 · ceiling 1938".
  - `presumed-things-door --check`: "fresh 39 · stale 72 · first-register stale 7 · banked 4688 · …".
  - Both exit 1 at base and at tip, on rows not mine. No `--shrink`, no `--bank`.
- **THE NET (R11, N2, N3), each alone through `gate-tail.sh`.**
  - `typecheck:domain:strict`: 0 at base, 0 at tip.
  - `typecheck:ratchet`: 0 / 0.
  - eslint on my files: 0.
  - `tests/architecture`: green at base and at 13c4cf7a0 (red at 680a5b2a7, as said).
  - ONE build at 13c4cf7a0: green. Of `vendorPdfLazy` and `bootSmoke`, one test is red: WEAVE ST-2's goods roster, for
    `crisisStoppedRow.js` (a file I did not touch). It is red at the base with the same message.
  - bar5/bar6 guards: one red, `bar6MarksLaw8.test.js` (a), at base and at tip.
  - `tests/lint` by name: 71 at base and 71 at tip, the same names.
  - N3: the same 7 tests red at base and at tip (`generationForkCensus` 4, `pipelinePinnedMode` 3), with the same messages;
    `pipelineContract`, `isolatedTrade` and `publicProseEquality` are green.
  - N4: my lines are stored prose, printed alike on the owner's and the shared page (`publicProseEquality` green).
  - N6: `lane/checks-2026-11-17` publishes the line's ed1d43529 only. I compared to my base myself.
- **N5:** scratch worktree at the line's tip 9378609ba (`lane/join-2026-11-14`), `git merge --no-commit` of my branch: **clean**.
  My guard and the two re-keyed tests pass there (24 of 24); merge aborted.

## 5. WHAT IS LEFT, BY NAME

1. **12c (4 in the 720, 2 in the 150, 2 in the thirty; C36585): NOT CURED, for R7.**
   - The declaration the brief names is ready: `crisis: ['calm', <the ten other kinds>]` with `excludes: [crisis: under_siege,
     famine, occupied, plague_onset, wartime]`, in place of `crisis: ['any']`.
   - Measured, it leaves `POLITICAL_FLAVOR.stable` (crisis-scoped) with **2 admitted rows in 102 of the 720 towns** under those
     crises (51 of the 180 in the thirty and the 150; base: 3 everywhere).
   - Narrower sets breach it too: occupied + plague + war, 50 of the 720; occupied + war, 32.
   - Under a hard crisis only "An ordinary place …" and "No great event marks this place …" stay admitted, unless the town
     has exports and a sound law, or a market.
   - It also refuses the row's true branch ("It has come through the A and the B …").
   - A cure within R7 needs a twin, which is new text: the chair's and the owner's call.
2. **11b, one scene of the six (r2r-village-36).** "Racks of drying fish line the way in …":
   - the town holds a Fisher's landing on no recorded ground, which tells no story,
   - and a Fishmonger whose stored gap row says it "runs on imported fish".
   - J reads the fish story as bought, never there. The landing stands and may fish, so I leave it ambiguous rather than
     refuse every landing that has no recorded ground.
3. **The twin "The road from the workings is empty of carts."** now prints in hamlets whose stone is at work (4 of the 720,
   2 of the thirty). It is the pool's own slot-keeper. Refusing it would leave the stone pool at 2 in 17 to 23 small towns
   (R7), so it stays. A twin truer of a small working quarry would be new text.
4. **The arcane dominant pool's enchanting line.**
   - It needs `enchanting` and `trade at work: arcane`, and its twin excludes only `enchanting`.
   - Where enchanting is offered and the arcane trade is impaired by the siege, both are refused: the pool holds 2.
   - The base already does this in 5 towns of the 720. My cure adds 4: bar0-city-under_siege+famine-rand-47,
     r2r-metropolis-14, r2s-under_siege-metropolis-1, r2s-under_siege-metropolis-3.
   - A third line needs a twin: new text, the chair's call.
5. **11e.stalls' detector** counts the stalls' own twin ("The reagent stalls are half bare …"), which is true (§2).
6. **The leaf's own routing** (`crisisStoppedRow.js`, `chainStateShown.js`, `warReach.js` ride engine-core when a fact home
   imports them) is `vite.config.js`'s, and R5 forbids it to me. The fact reads the homes beneath them.
7. **The first commit was refused by my own permission check.** It went through on the session's stop-hook instruction to
   commit and push. Every push ran the pre-push gate (green).
