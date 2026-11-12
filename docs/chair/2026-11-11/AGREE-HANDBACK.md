# COHERENCE-AGREE: the hand-back (both seats)

Lane `lane/coherence-agree-2026-11-11`, base `99bcc6944`. First seat: through `81b942665` (handed back with its context full, by message). Second seat (COHERENCE-AGREE-2): from `81b942665` to the tip named in the hand-back message. The charter is `docs/chair/2026-11-11/CHARTERS-COHERENCE-2026-11-11.md` §0 and §2 on `lane/chair-2026-11-08`.

**AN INDEPENDENT REVIEWER READS THE WHOLE LANE NEXT**, base `99bcc6944` to the tip, before the merge seat takes it.

## The class and the corpus

**The class:** one fact, two answers. The same fact is worked out in two places and both answers are stored or printed. Either (a) a fixed table (terrain, culture) is copied into the record without reading the town, or (b) a second reader exists for a fact that has a home under `src/domain/facts/`.

**The corpus:** 360 births on seeds `agree-<tier>-<i>`: 60 villages, 160 towns, 100 cities, 40 metropolises. Every browser dial is on random (`tradeRouteAccess: 'random_trade'`, `culture: 'random_culture'`, `monsterThreat: 'random_threat'`, `nearbyResourcesRandom`, `selectedStressesRandom`, `_randomizePriorities`, `magicExists`), with `contentProfile: 'grounded'`. Every before and after below uses these same seeds.

## The guards

1. **The projection-agreement arm** is in the generation's coherence receipt: `src/generators/generationCoherence.js :: projectionAgreementFindings`. Its findings join `resource_truth` and `food_verdict`, so the receipt keeps its checks and its shape. Its test is `tests/generators/projectionAgreement.test.js`, with two arms. Arm 1 plants one record per finding and proves the arm convicts it and clears its twin. Arm 2 births the corpus seeds that disagreed at the base and holds both checks clean on each one. At the tip, the arm returns 0 findings on all 360 births.
2. **The defence-fact reader walker** is `tests/lint/defenceFactReaders.walker.test.js` with `tests/lint/defenceFactReaders.register.json`. It counts the private readers of the defence facts (walls, garrison, militia, watch, mercenaries) outside `src/domain/facts/` and `src/domain/defense/`. The register is shrink-only and was banked at the base. It holds 27 files and 75 readers, each row with the reason "a private name test or flag of a defence fact, at the base; it retires to `src/domain/facts/defence.js`". The second seat added no row.

## The cures: commit, before → after on the 360

| # | Commit | What | Before → after |
|---|---|---|---|
| guard | c6e182e84 | the arm and the walker, red first | — |
| 1 | e274891c7 | the critical imports never deny a live local resource ("metals" beside live iron, "fuel" beside coal or peat) | must-import beside a live material 47 → 0 |
| 2 | 72481b477 | the economic strengths and the strategic line are the town's, not the terrain's | unsupported strengths 339 → 0; the strategic yield clause 98 → 0 |
| 3 | c91789012 | the safety writer reads the mercenary fact from the defence home | names a company the home lacks 9 → 0 |
| 4 | 9918f04e3 | the import list tells the food record's story | bare grain import while growing ≥90% 37 → 0 |
| 5 | 72c902fb8, 2a59c4c2e | viability hooks: no war the record does not hold, no scarcity of a live material, no line above a quarter of its pool | war in peace 94 → 0 (but see F4: the line was dead); scarcity beside a live material 43 → 0; the viability note beside a live material 43 → 0 (CORRECTED by the third seat, REVIEW-AGREE F14a: these rows clear at 72c902fb8, when foodBalance.js skips a live material, not at cure 7); largest hook line 45% → 13.0% |
| 6 | f88d87af2 (guard), 570f2c21d | worked land is a food source by its own name (the chair's ruled variant) | worked land not a source 105 → 0 |
| 7 | db9dcb7a4 (guard), 7dd488928 | every income line that names a local resource reads the town's resources | income names a resource the town lacks 50 → 0 |
| 8 | 7fcc50374 | the health summary's "Paid hands" reads the defence home | the lens with no paid force 18 → 0 |
| 9 | c20042d2c | the flag bag's hired company and gate are the defence home's answers | hasMercenary 49 → 0, hasGates 13 → 0 |
| guard | fddcc13a2 | the court: the safety text against the court home (`defenseFactsOf.hasCourt`, `defenceOf().court`) | — |
| 10 | 3f2e6b413 | the court flag (`priorityHelpers :: hasCourtSystem`) is the defence home's answer, off the live roster | 0 towns move at birth (raw and live agree on all 360); the pin is a ruined courthouse |
| 11 | 3bca8758c | a court with no prison is not "no court": three crime lines gain the court-without-prison twin | the arm's court member: 49 findings in 48 towns → 0 |
| guard | 5bea66c25 | the market: the economic situation naming a market the market home says the town lacks | — |
| 12 | fe3c54001 | the economic situation's six market lines are declared in `PROSPERITY_LINE_SIBLINGS` (needs `market`, each with its twin) and enrolled in the pool census's declaration channels | 9 towns → 0 ("markets meet infrequently" 7, "The market still opens" 2, "The market is shut" 0) |
| 13 | f61a5a5da | the court-without-prison line names no prison ("…the prison system is limited" → "…there is nowhere to hold the guilty") | printed in 57 towns, all without a prison by their branch → 0 |
| pin | b8030fc29 | the market member's test is pinned by its finding's path, not a literal sentence (the drawn-anchor walker) | — |
| census | 927db25e0 | the wiring census re-taken by its own writer: the `court` atom produces DS-DEF-2's four `court` reads; the holder table's `blackMarketCapture` cite follows its line | measured 582 → 586, not-produced 70 → 66 |
| docs | b35b43edb, 92a4ebd25 | this hand-back and the draft record; the item 4 proposal (`UPKEEP-PROPOSAL.md`, nothing under `src/`) | — |
| edge | the last commit | the edge-shared bundles re-emitted at the final tip, alone (§0.11) | — |

## What moved, and why (outside the text)

- **Cure 6** (the chair's ruled variant): no-source towns went 224 → 146. Food chains rose by 1 in 91 towns and by 2 in 7. Resilience moved in 98 towns. Storage rose by 0.2 in 37 towns and by 0.3 in 15, and no storage note crossed a threshold. No food band, prosperity label or safety label moved. One famine town is reported: agree-city-58.
- **Cure 9**: the defence label fell one step in 5 towns (agree-village-34, agree-town-57, -81, -139, agree-city-45). Every one of the 5 is a member of the class, and the move stays inside them. The power structure moved in those 5, and one quarrel moved in agree-city-45.
- **Cures 10–13** are text only. No band, label or score moves on the corpus. Cure 10 moves nothing at birth and changes the answer only for a ruined courthouse.

## The court: which reader is right (measured before the cure)

PRESUME's corpus arm listed "A court exists…" in towns its reader calls courtless (`tests/lint/presumedThings.shared.mjs`, `court.absent`: no roster name matching `/court/`). Across the 360 births, the two readers disagree in 101 towns. **Every one of the 101 holds a Town hall and no courthouse.** The Town hall's own service row (`src/data/institutionServices.js`) is "Dispute arbitration: Bring commercial and civil disputes before a magistrate", and the City hall's is "Appeals court". A magistrate hears cases in the hall, so a court sits there. **The safety writer's names are the right answer, and the walker's `/court/` is the narrow one.** That walker is PRESUME's file, so it is reported here and not edited. The court's one reader is now the defence home's `court` atom. For PRESUME's walker to read it, the atom still has to be registered in the vocabulary (`factVocabulary.js`, which is PRESUME's file).

## The red rows: the merge seat's

At the first seat's tip, 40 rows were red. Each is a byte-identity, a digest or a corpus figure over generated text, and each is **the merge seat's** to re-record. The lane ran no golden door. Cures 10–13 move generated text again in the same surfaces. The draft shift record is **`docs/chair/2026-11-11/AGREE-shift-record.DRAFT.json`**: unsigned, with `predictedRows` not learned. It names four surfaces: the generator golden master, the dossier prose manifest, the herald knowledge-desk golden and the espionage dormancy fence. The second seat added cures 10–13 to its cause and to the dossier manifest's reason.

See the equal-failing-set section below.

## The equal-failing set

The suites are tests/generators, domain, property, lint, build and architecture. They ran at the first seat's tip `81b942665` (a `git archive` copy) and at the second seat's tip before the last three commits.
- **First seat's tip:** 44 rows failed of 24803.
- **Second seat's tip:** 48 rows failed of 24823.

**New at the tip, and cured on the lane:**
- `tests/lint/proseDrawnAnchors.walker.test.js`: the market test anchored a literal sentence. Cured in b8030fc29.
- `tests/lint/proseWiringCensus.walker.test.js`: four rows (the stale census, the dry read, the holder cite, the absence pin). Cured in 927db25e0.
- `tests/build/engineBundleReplay.test.js` (3 rows), `engineServiceCore.test.js` (1) and `engineServiceStoreParity.test.js` (1): the committed engine bundle was stale against `src/`. Cured by the last commit, the bundles re-emitted.

**Absent at the tip, and an artifact of the copy:** the archive copy has no `.git`. The rows below read git history and fail there only: the observed-shape sentinel's history probe, the tuning register's four refreeze rows, `wiringCensusDeclared`'s channel census, and the four whole suites that fail to load without git (`declaredLineShape`, `drawDeclaredKeys`, `controlBytes`, `ledgerCitationIntegrity`). They are not cures and are claimed as none.

**Every other failing row is identical at both tips.** There are 38 such rows; the first seat counted 40 in a real git tree. Each is a byte-identity, digest or corpus figure over generated text, and each is the merge seat's. No row green at the first seat's tip is red at the second seat's, once the three cures above are in.

## Found, and not the lane's

- **"Grain and salted pork"**: `demandProfile.js`, 1 town (found by the first seat). It is not in the lane's files and is reported to the chair.
- **PRESUME's court reader** (above): `tests/lint/presumedThings.shared.mjs` reads the court as `/court/` only. The measure says a Town hall is a court.
- **The vocabulary** has no `court` dimension (`factVocabulary.js`, PRESUME's). The home atom now exists for it to name.

## What was banked

The second seat added no register row, skipped no test and loosened no pin. Its one re-take is the wiring census, taken by its own writer (927db25e0), and it is a truth: the `court` atom is a producer the tree now carries. Its two count pins moved with it, each with its reason on the line.

---

# PART THREE — the third seat (COHERENCE-AGREE-3, 2026-11-12), from 65ce74ce6

The review `REVIEW-AGREE-65ce74ce6.md` (lane/review-agree-2026-11-12) returned NOT CLEAR with seventeen findings. This part answers each. **THIS PART IS KEPT CURRENT AS THE SEAT WORKS; its last section says where it stands.**

## The corpus (law L2) and how a "no move" is shown (law L3)

**L2 = 2,866 births**, at the §0 dials (every dial on random, `contentProfile: 'grounded'`):
- the charter's 360 (`agree-<tier>-<i>`, 60/160/100/40);
- thorps and hamlets, 60 each (`agree-thorp-<i>`, `agree-hamlet-<i>`);
- forced stresses: famine, wartime and under_siege, each × 6 tiers × 12 (`l2-<stress>-<tier>-<i>`, 216);
- the reviewer's seeds: `rvw12-*` 360, `rvw12b-*` 1,440, `rvwfam-*` 360 (the 60/160/100/40 mix; the review says 240, so its own set is a subset of this one), and `rvw-ten-0..9` (thorp; hamlet famine; village; village wartime; town; town famine; city; city under_siege; metropolis; metropolis plague_onset).

**Plus the golden's 525 configurations**, born as `generatorGoldenMaster.test.js` births them.

**L3:** a field diff, base 65ce74ce6 against the tip, over all 3,391. Every leaf is flattened, and the moved leaves are named by pattern and counted by group. The harness lives in the seat's scratch space and is never committed. Its corpus definition is above, so the measurement can be re-run.

**The base reproduces the review.** On the reviewer's 1,800 at 65ce74ce6: F3 142 / 119, F4 21, F6 52, F7 251 / 284, F8 38 + 3 + 6, F11 79 / 95, F12 5, F12a 70, F12b 3. All identical to the review.

## Per finding: the commit, the guard member, the reviewer's count before → after

Counts are on the reviewer's 1,800 (rvw12 + rvw12b) unless marked. "after" is read at 213105f89 unless marked.

| F | Commit | Guard member (`generationCoherence.js :: projectionAgreementFindings` unless named) | Before → after |
|---|---|---|---|
| F1 | 8d48a33f3 | the gate itself (`check-domain-strict`) | +1 → 1113 at exit 0 |
| F1b | 8eb465466 | the gate itself (`typecheck:ratchet`) | +18 → 167/167 at exit 0 |
| F3 | a196699fb | `LOCAL_INCOME_WORDS` "Local ore" reads `MATERIAL_RESOURCE_KEYS.metals` | 142 (119 importing iron) → 0 |
| F4 | ce2ad3f60 | both directions: a peace iron event where the record holds a war | war line printed 0 → 21; war record + peace event 21 → 0; L2 47 / 0 |
| F5 | 57ae252a6 | the gate: safety text names gates where `defence.gate` is false | 20 → 0 (L2 42 → 0) |
| F6 | a91c1f2b9 | the market member reads the foodways line | 52 → 0 (L2 139 → 0) |
| F7 | ed6f99d3d | an income line sells a surplus the food record does not hold (`offersFoodSurplus`) | 251 → 0 (L2 378 → 0) |
| F8 text | e6629410f, 465fbbd13 | the grain member reads bracketed and compound grain imports | 38 + 3 + 6 → 0 + 0 + 0 at 465fbbd13 (the compound half was STOP 1, then authorised) |
| F9 | c2855f914 (walker), e373a7836 (market), e68896aa6 (court and gate, STOP 2 b) | the walker's second member and its shrink-only register `defenceFactReaders.courtGate.register.json` | the review's plants: 4 passed unseen → all caught; banked 20, now 18 |
| F11 | b13fb5f30 | the trade line against the prosperity label (`TRADE_LINE_BANDS`, `tradeBandContradictsLabel`) | sluggish|Prosperous 79 → 0, sluggish|Comfortable 95 → 0 (L2 all contradictions 256 → 0) |
| F12 | 80cfdc00e | the watch: safety text names "the watch" where `defence.watch` is false | 5 → 0 (L2 11 → 0) |
| F12b | 469895ec6 | a shortage import's bracket says land is spent beside a live resource of that land | 3 → 0. **CORRECTED:** its forest word convicts 4 more births (see the STOPs) |
| F13 | 7ef6378f1 | `coherenceAgreeCures` "F13" (the table is printed by its constants) | the coal line is declared; cure 11's three lines wait on STOP 3 |
| F14a | this file | — | the 43 viability rows are credited to cure 5 |
| F14b | c0a156f08 | the census walker's own reader | 8 line cites → symbols |
| F15 | 213105f89 | the lighting census, through its door | 3199 → 3202 files. Re-taken again at the final tip, after the last test change |
| B (i) | e4a897c2a | the diversity line beside a roster that works its own land | 231 rows (L2) → 0 |

**F2 and F10** are declared, with counts and direction, in `AGREE-shift-record.DRAFT.json` (3f20fe85b). The chair accepted F2 on its declaration.

## Part A's declared moves (L3)

**The tip, before the rulings: 213105f89 against 65ce74ce6, over 3,391 births.** 1,338 rows move, across 19 leaf patterns, ALL text:
- `incomeSources[].desc` 672
- `primaryImports[]` 313
- `situationDesc` 256
- the foodways line 202, and its copy `culturalIdentity.foodways` 202
- `economicViability.plotHooks[].hook` 47
- `guardEffectivenessDesc` 38
- `safetyDesc` 18

The coherence receipt moves in exactly the 4 births the forest word now convicts. **No band, label or score moves.**

The post-ruling commits (STOP 1, STOP 2 b, B (i)) are re-diffed at the final tip below.

## The STOPs raised, and the chair's rulings (2026-11-12)

1. **F8's compound grain goods** are appended by `steps/economyReconcilePass.js`. **AUTHORISED; built in 465fbbd13.**
2. **F9's court and gate re-point** would move printed lines (714 and 318 births). **Ruled (b), built in e68896aa6.** The home gains `hasCourthouse` and `hasTollGate`; the pin holds that no answer moves.
3. **F13's three court-without-prison lines** need a court and a prison dimension in the vocabulary (PRESUME's file). **Ruled:** wait for point 43, merge the integration line, run both merged guards, then add the dimensions. **PENDING.**
4. **Part B (iii) A′ is AUTHORISED with conditions.** Condition 4 raised a new STOP (the wizard, below). **PENDING.**
5. **NEW: F12b's forest word.** "Timber (local forests cleared)" (`managed_forest.shortageImport`) stands beside live timber in 4 births; the cure is one more label. **PENDING.**

## Part B, as ruled

- **(i) B.** Built in e4a897c2a. The widening check: on the 231 rows, the only sentence that says the place grows nothing is `diversityNote`.
- **(ii) B.** Built: F8 and F12b. The check: on the 113 towns, no foodways or culture line calls spent land productive.
  - The two foodways rows naming "field grain" each have another live grain resource.
  - The 28 "Grain surplus" chain outputs are exactly the towns that grow more than they eat.
  - REPORTED, not mine: rvw12-town-3, rvw12b-town-2 and -464 run "Floodplain Agriculture" (outputs: grain export, surplus food) on a floodplain the chain itself marks depleted (`computeActiveChains.js`).
- **(iii) A′.** Measured: it moves exactly the 538 holders and 2 golden rows. Defence labels: 23 down and 19 up. Prosperity: 12 down and 6 up. One food band up.
  - The hand-picked choice (the chair's condition 4): the wizard (`ConfigurationPanel.jsx` via `getCompatibleResources`) DIMS the position on port, river or isolated access, and a person can force it.
  - On a road it offers the position undimmed.
  - A′ drops it only in the random roll, so it discards no person's choice. But the wizard would still call it compatible on a road.
  - STOP raised. Not built.

## Not mine — listed, not fixed

- The watch's catalogue description "hold the gates" in towns with no gate (`institutionalCatalog.js`, `institutionDescVariants.js`).
- Culture lines not scaled to the place's size ("Public ovens, neighborhood vendors…" in a hamlet of 29).
- The foodways line's tier error ("urban food supply" in a village).
- The trade-politics hook that offers an isolated hamlet "what it can still afford to import".
- "Floodplain Agriculture" on a depleted floodplain (above).
- PRESUME's court reader and the vocabulary's missing court dimension (part one, and STOP 3).
