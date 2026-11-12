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
5. **F12b's forest word: AUTHORISED as a rule, BUILT in 080527677.** Every shortage label now names its own resource.
   - CHANGED (13): fishing_grounds → "sea fisheries"; salt_flats → "salt flats"; shipbuilding_timber → "shipbuilding stands"; river_clay → "clay pits"; managed_forest → "managed woodland"; grain_fields → "grain fields"; precious_metals → "gold and silver veins"; gemstone_deposits → "gem deposits"; hot_springs → "hot springs"; glass_sand → "sand pits"; camel_herds → "camel herds"; mountain_timber → "mountain timber"; hot_springs_mineral → "mineral springs".
   - READ AND LEFT (19): deep_harbour, river_mills, fertile_floodplain, river_fish, hunting_grounds, foraging_areas, ancient_grove, grazing_land, crossroads_position, stone_quarry, coal_deposits, ancient_ruins, magical_node, defended_pass, marshlands, oasis_water, date_palms, desert_salt, alpine_pasture.
   - The guard's shortage member now reads what the bracket's words name, by family.
   - **STOP:** iron_deposits ("local mines" also names a live coal or gem working; the text is a Founding World card's printed promise and a goodsCatalog alias, neither file mine). The guard does not read "(local mines" until the chair rules.
6. **(iii) A′ as one datum with two readers.** STOP raised before building:
   - The random roll filters on `getCompatibleResources`' `compatible` flag, so the wizard's dimming needs a second field.
   - A forced position on port, river or isolated access raises `structuralValidator.js`'s `resource_access_violation`; on a road it would raise nothing unless that file reads the datum (not authorised).
   - No per-resource hand-forced mark exists in the config; the manual roster is the only one.
7. **The pushes.** This session refuses `--no-verify`, so every push ran without it. No pre-push hook is installed in this checkout (`npm ci --ignore-scripts` skipped the installer; `.git/hooks` holds samples only), so no hook ran.

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

## Part B (iii) A′, built (6b932d3e8) — what moved

**The field diff:** parent 303396f74 against 6b932d3e8, over L2 and the golden.
- **Holders only.** It moves exactly the 538 L2 births that held the position on a road: 0 non-holders, and 0 still hold it off a crossroads afterwards.
- **Golden:** 2 rows move, `town|germanic|auto|random_trade|civilized|gm-seed-a` and `town|germanic|plains|road|civilized|gm-seed-a`, both road holders.
- **Labels (L2), a false advantage leaving:**
  - defence: down a step 23 (Defensible→Lightly 11, Well-Defended→Defensible 9, Lightly→Vulnerable 3); up 18 (Defensible→Well-Defended 8, Lightly→Defensible 8, Vulnerable→Lightly 1, Well-Defended→Fortress 1);
  - prosperity: down 15 (Comfortable→Moderate 4, Poor→Struggling 4, Wealthy→Prosperous 2, Prosperous→Comfortable 2, Prosperous→Moderate 1, Moderate→Poor 1, Comfortable→Poor 1); up 5;
  - food band: pressured→secure 1;
  - storage note: seasonal→months 1.

**`rvw12-village-19`, before → after:**
- The strength "Central trade hub" goes, and the export "Transit trade" goes with it.
- The exports "Toll revenue" and "Pass transit trade" STAY: they are the village's defended pass's own goods, and true of it.
- It had no Toll Revenue income line, before or after.

**Toward danger, town by town (L2, 38 rows):**
```
agree-village-58: prosperity Comfortable -> Moderate
agree-town-10: defence Well-Defended -> Defensible
agree-town-18: prosperity Wealthy -> Prosperous
agree-town-27: defence Defensible -> Lightly Defended
agree-town-33: defence Well-Defended -> Defensible
agree-town-45: defence Well-Defended -> Defensible
agree-town-62: prosperity Prosperous -> Comfortable
agree-town-66: defence Lightly Defended -> Vulnerable
l2-wartime-town-2: prosperity Poor -> Struggling
rvw12-town-12: defence Defensible -> Lightly Defended
rvw12-town-146: prosperity Comfortable -> Moderate
rvw12b-village-26: prosperity Prosperous -> Moderate
rvw12b-town-6: prosperity Moderate -> Poor
rvw12b-town-14: prosperity Poor -> Struggling
rvw12b-town-15: defence Defensible -> Lightly Defended
rvw12b-town-65: prosperity Comfortable -> Moderate
rvw12b-town-68: prosperity Comfortable -> Moderate
rvw12b-town-125: defence Defensible -> Lightly Defended
rvw12b-town-132: defence Well-Defended -> Defensible
rvw12b-town-136: prosperity Poor -> Struggling
rvw12b-town-166: defence Well-Defended -> Defensible
rvw12b-town-170: defence Well-Defended -> Defensible
rvw12b-town-269: prosperity Prosperous -> Comfortable
rvw12b-town-313: prosperity Wealthy -> Prosperous
rvw12b-town-318: defence Defensible -> Lightly Defended
rvw12b-town-352: defence Lightly Defended -> Vulnerable
rvw12b-town-394: defence Well-Defended -> Defensible
rvw12b-town-394: prosperity Comfortable -> Poor
rvw12b-town-408: defence Defensible -> Lightly Defended
rvw12b-town-408: prosperity Poor -> Struggling
rvw12b-town-551: defence Defensible -> Lightly Defended
rvw12b-town-639: defence Defensible -> Lightly Defended
rvw12b-city-108: defence Defensible -> Lightly Defended
rvw12b-city-236: defence Well-Defended -> Defensible
rvw12b-city-370: defence Well-Defended -> Defensible
rvwfam-town-92: defence Lightly Defended -> Vulnerable
rvwfam-city-31: defence Defensible -> Lightly Defended
rvwfam-city-62: defence Defensible -> Lightly Defended
```

**The hand-picked choice:**
- **Before:** on a road the wizard offered the position as compatible, and the validator was silent.
- **After:** the wizard dims it on a road, with the row's own words and "Click to force include anyway", exactly as on a port. A forced one is kept, and the structural validator warns in the same words as on a port.
- **The guard** exempts a manual roster.

**The iron label (303396f74).** "Iron ore (local iron mines exhausted)":
- The goods catalogue keeps the old spelling as an alias beside the new one, because saved records carry it and subsumption re-runs over their lists.
- Black Crag's quoted dossier label is re-keyed by identity; the card's promise is unchanged.
- The two fixtures that quote the old label are untouched and green (`readerValidationOnPage.births.json` is read stored; `goods-matcher-identity-corpus.json` is an input corpus).

## STOP 3 (point 43): where it stands — THE SEAT HANDS BACK BY FILE HERE (context near its limit)

**(b) DONE — e69dc5d5f merges `origin/lane/integration-2026-11-07` at e883780bb into the lane, theirs into ours.**
- holderTable keeps the lane's symbol cite.
- The wiring census was re-taken by its writer.
- The lighting census and the edge bundles were taken from the line; each is re-taken through its own door below.
- After the merge: typecheck:ratchet 167/167 at exit 0; domain-strict 1113 at exit 0.

**(c) the presumed-things walker — b72d27005.**
- The nine rows marked "other-lane" that are this lane's cures left through the register (arm 2: 7; arm 1: 2). Both stale-row arms are green.
- STILL RED, arm 1 ("every source literal that names a thing declares it, or has its row"): five literals of this seat, open for the next seat, which must DECLARE them, never bank them:
  - `prosperity.js` — the theocratic market twin names the church (`temple`);
  - `generationCoherence.js` — three receipt messages that name what they test (mercenary; market twice);
  - `safetyProfile.js` — F5's walls-and-no-gate twin, a template over the force noun, which names the walls.

**(c) `node scripts/census/pool-dominance.mjs` — exit 1.** These rows read above their ceilings on the merged tree; per the chair's ruling NONE is re-banked by this seat:
```
ledger:ARRIVAL_SENSES.bread.dominant: top1 0.4286 > ceiling 0.4091
ledger:ARRIVAL_SENSES.faith.dominant: top1 0.6000 > ceiling 0.5676
ledger:ARRIVAL_SENSES.kilns.dominant: top1 0.5000 > ceiling 0.4286
ledger:ARRIVAL_SENSES.market.lines: top1 0.5000 > ceiling 0.4
ledger:ARRIVAL_SENSES.tanners.dominant: top1 0.5000 > ceiling 0.4
ledger:ARRIVAL_TENSIONS.unsafe: top1 0.5294 > ceiling 0.5
ledger:FOODWAYS.FRAMES.more: top1 0.6000 > ceiling 0.5
ledger:FOODWAYS.FRAMES.one: top1 0.5280 > ceiling 0.5129
ledger:FOODWAYS.FRAMES.two: top1 0.5484 > ceiling 0.5455
ledger:FOODWAYS.SOURCE_PHRASES.fish: top1 0.4020 > ceiling 0.3726
ledger:POLITICAL_FLAVOR.catastrophic: top1 0.1557 > ceiling 0.1548
ledger:conflicts:HOOKS: top5 0.2043 > ceiling 0.1973
ledger:historyData:HISTORICAL_EVENTS_DATA.plotHooks:crime_wave: top1 0.3389 > ceiling 0.3389
ledger:historyData:HISTORICAL_EVENTS_DATA.plotHooks:disputed_land: top1 0.5676 > ceiling 0.5653
ledger:historyData:HISTORICAL_EVENTS_DATA.plotHooks:generational_divide: top1 0.5556 > ceiling 0.5439
ledger:historyData:HISTORICAL_EVENTS_DATA.plotHooks:magical_controversy: top1 0.7834 > ceiling 0.7821
ledger:historyData:HISTORICAL_EVENTS_DATA.plotHooks:outside_debt: top1 0.5701 > ceiling 0.562
ledger:historyData:HISTORICAL_EVENTS_DATA.plotHooks:popular_uprising: top1 0.5733 > ceiling 0.5642
ledger:historyData:HISTORICAL_EVENTS_DATA.plotHooks:population_friction: top1 0.9126 > ceiling 0.9118
ledger:institutionDescVariants:city|Crafts|Specialized metalworkers: top1 0.4074 > ceiling 0.4025
ledger:institutionDescVariants:city|Criminal|Underground network: top1 0.4667 > ceiling 0.4375
ledger:institutionDescVariants:metropolis|Crafts|Bowyers & fletchers (guild): top1 0.3611 > ceiling 0.3514
ledger:institutionDescVariants:town|Crafts|Bakers (5-15): top1 0.4091 > ceiling 0.3954
ledger:institutionDescVariants:town|Entertainment|Traveling performers: top1 0.4483 > ceiling 0.4445
ledger:institutionDescVariants:town|Government|Town crier: top1 0.5000 > ceiling 0.4348
ledger:npcData:HANDLER_TIE_ARCHETYPES.handler_leverage_crime: top1 0.3333 > ceiling 0.3244
ledger:npcData:HANDLER_TIE_ARCHETYPES.handler_leverage_debt: top1 0.3939 > ceiling 0.3637
ledger:npcData:HANDLER_TIE_ARCHETYPES.handler_leverage_loved: top1 0.3333 > ceiling 0.3077
ledger:npcData:NPC_FACTION_LOYALTY: top5 0.2922 > ceiling 0.2914
ledger:npcData:NPC_PLOT_HOOKS: top1 0.2615 > ceiling 0.2609
ledger:npcData:NPC_WANTS: top1 0.1305 > ceiling 0.1303
ledger:npcData:NPC_WANTS: top5 0.6406 > ceiling 0.6402
ledger:npcData:STRESS_ECONOMIC_EFFECTS.bitter_history: top5 0.6667 > ceiling 0.6623
ledger:npcData:STRESS_ECONOMIC_EFFECTS.econ_crim_blur: top1 0.1892 > ceiling 0.1715
ledger:npcData:STRESS_ECONOMIC_EFFECTS.econ_crim_exploitation: top1 0.2381 > ceiling 0.2174
ledger:npcData:STRESS_ECONOMIC_EFFECTS.econ_crim_exploitation: top5 0.8095 > ceiling 0.7827
ledger:npcData:STRESS_ECONOMIC_EFFECTS.econ_mil_contract: top1 0.3125 > ceiling 0.2858
ledger:npcData:STRESS_ECONOMIC_EFFECTS.family_complication: top1 0.1467 > ceiling 0.1412
ledger:npcData:STRESS_ECONOMIC_EFFECTS.family_complication: top5 0.6678 > ceiling 0.6522
ledger:npcData:STRESS_ECONOMIC_EFFECTS.gov_econ_dependence: top1 0.1714 > ceiling 0.1459
ledger:npcData:STRESS_ECONOMIC_EFFECTS.gov_econ_dependence: top5 0.6786 > ceiling 0.6737
ledger:npcData:STRESS_ECONOMIC_EFFECTS.mentor_legacy: top1 0.1330 > ceiling 0.1325
ledger:npcData:STRESS_ECONOMIC_EFFECTS.mil_crim_corruption: top1 0.1818 > ceiling 0.1644
ledger:npcData:STRESS_ECONOMIC_EFFECTS.mil_crim_corruption: top5 0.7403 > ceiling 0.7398
ledger:npcData:STRESS_ECONOMIC_EFFECTS.mil_crim_suppression: top1 0.1733 > ceiling 0.1691
ledger:npcData:STRESS_ECONOMIC_EFFECTS.mil_crim_suppression: top5 0.7467 > ceiling 0.7465
ledger:npcData:STRESS_ECONOMIC_EFFECTS.peer_rivalry: top5 0.6507 > ceiling 0.6492
ledger:npcData:STRESS_ECONOMIC_EFFECTS.wary_alliance: top5 0.6524 > ceiling 0.6505
ledger:stressInstitutionEffects:STRESS_INSTITUTION_EFFECTS: top1 0.1620 > ceiling 0.1605
record:conflicts.plotHooks: top5 0.2035 > ceiling 0.1966
record:safetyProfile.plotHooks: top5 0.7377 > ceiling 0.7238
```
- FOODWAYS.SOURCE_PHRASES.fish is the one this seat's cures touch directly (F6 filters the culture's foodways lines).
- The rest are draws downstream of births whose generated text this lane moves, chiefly the crossroads cure's 538 holders, whose resources leave.
- Not attributed one by one: that is open work for the next seat.

**(d) NOT DONE.** The court and prison dimensions in `factVocabulary.js`, and the three court-without-prison lines declared. The arm's court member still reads them.

**NOT DONE at the final tip, open for the next seat:**
- the equal-failing-set run over the six directories (the earlier run was stopped because the tree moved under it);
- the lighting census re-take (this seat added a test file and titles after its F15 re-take; the merge took the line's figures);
- the edge bundles re-emitted as the last commit, alone;
- a final L3 diff of the post-ruling commits (each cure carries its own measure in its commit body).

# PART FOUR — the fourth seat (COHERENCE-AGREE-4, 2026-11-12), from 8be24bf61

**THE NARROW DOOR, FOR THE MERGE SEAT AND THE POWERS LANE: `aab389759`** adds `--bank-new` to the pool-dominance
register (`scripts/census/pool-dominance.mjs`). Usage: `node scripts/census/pool-dominance.mjs --bank-new`. It banks a row
for each drawn pool that has none, at the higher of the banked corpus's and the second corpus's readings, with its
count of lines. It touches no other row (the census header is re-taken, as every door does). It refuses another
corpus and a foreign `--seed-prefix`. A lane's own new pool goes in through it; `--tighten` is the chair's door
only (`docs/DESIGN_POOL_CENSUS.md`). Pinned both ways in `tests/lint/poolDominance.walker.test.js` ("--bank-new: a
pool with no row gains exactly that row, and nothing else moves"). This lane banked its own pool through it at
`ca1ed8ddd`: `ledger:prosperity:PROSPERITY_LINE_SIBLINGS`, top1 0.6833, top5 1, lines 2. The guard exits 0.

The seat's tip is named in its one message to the chair; the edge bundles are re-emitted alone as the last commit.

## The corpus and the field diffs (L2, L3)

The third seat's L2 (2,866 births, defined in PART THREE) plus the golden's 525 (3,391 births), re-built in the
seat's scratch space (births through `birthConfig({ ...DEFAULT_CONFIG, ...dials, settType })`, forced stresses as
`selectedStresses: [s]`; the golden as `generatorGoldenMaster.test.js` births it). Every leaf is flattened and array
indices are folded to `[]`. A leaf "moves" when its value differs. Corpora were taken at 65ce74ce6, 303396f74,
6b932d3e8, f8932a3e5, e883780bb (the integration line the lane holds), 8be24bf61 (the seat's start) and the seat's
generation-moving commits.

## Per item: the commit, the pin, the count before → after

| Item | Commit | Pin (red at the parent → green) | Count before → after |
|---|---|---|---|
| 1 (a) the theocratic twin's church | 64a62785e | coherenceAgreeCures "item 1 (a)"; the walker's arm 1 | walker fresh 5 → 4; the line prints in 39 births, its twin in 0, 0 without a sacred house |
| 1 (b) F5's walls twin | cc7e60d82 | the walker's arm 1 lists it at the parent | walker fresh 4 → 3; 38 births, all palisades, 0 without walls or with a gate |
| 1 (c) the receipt's finding messages (the walker rule, the chair's authority) | 071ea4cfd, 075079528 | presumedThings.walker "no reader prints a finding's words"; the planted finding | walker fresh 3 → 0; `ARM1_NOT_PRINTED` keyed by file, callee and argument (`generationCoherence.js :: finding`, argument 1) |
| 2 (i) court and prison dimensions | f6000464f | coherenceAgreeCures "item 2" | the home's prison and the writer's flag disagree in 0 of 3,391 |
| 2 (ii) the three court-without-prison lines | 4d12a1447 | coherenceAgreeCures "item 2 (ii)" | declared 0 → 3; 347 printings, 0 where court ∧ ¬prison fails |
| 3 Floodplain | — | — | DROPPED by the chair (no such strength in the tree) |
| 3′ (i) the exporter's refusal, one predicate | da4f6a87b | coherenceAgreeCures "item 3′ (i)" ×2 | 0 leaves move |
| A′ refilled (the chair's ruling) | 1dde265d8 | coherenceAgreeCures "A′ refilled" (nine road holders at the bottom of their range) | holders below their size's range → 0; no-live-resource holders 13 → 0; 540 births move = the holders, 0 non-holders |
| 3′ (ii) "Normally yields" on the tab and the PDF's three writers | 6677d60fe | economicsChainYieldLabel (24 seeds); coherenceAgreeCures "item 3′ (ii)" guard | refused chains printed as outputs 6,559 in 1,838 births (151 golden) → 0; no generated leaf |
| 4 the repetition guard | 5172b3d24 (merge at 5b31cdfcc), aab389759 (the door), ca1ed8ddd (the row) | poolDominance.walker "--bank-new" ×2 | the guard exit 1 → 0; one row added, no other row moved |
| 5 the lighting census | b4670a365 | the census through its ritual | files 3205 → 3210, parked 397 → 398, credited 2808 → 2812, titles 29133 → 29187, suite titles 7879 → 7902 |

**L3, the seat's own commits:** 8be24bf61 → 4d12a1447, 0 leaves move in 3,391 births. da4f6a87b: 0. 1dde265d8: the
540 holders and nothing else (the record's A′ declaration). From 1dde265d8 to the tip: 0 of 3,391.

## The fifth law: the whole-suite run, and every red classed

One `npx vitest run` over all of tests/ at b4670a365 (the ledger ref fetched first; `--maxWorkers=2`): **66 failing
in 47 files of 3,210; 38,630 passed; 252 skipped.** Each failing file was then re-run at e883780bb (the line) and at
8be24bf61 (the seat's start), in `git archive` copies, so each red is placed by where it first stands.

**MINE, CURED ON THE LANE (each red at b4670a365, green at its commit):**

| Commit | Red | Cause | Cure |
|---|---|---|---|
| 18f5e5c30 | negativeAssertionAnchor ×2 | four bare negatives, the lane's (coherenceAgreeCures 157, 280, 299; crossroadsRequiredAccess 34) | each anchored on its own subject; none loosened |
| e6e50b7a1 | w0WriterAgreement "ONE FOOD-SOURCE COUNT" (7 rows) | AGREE-3's declared zero-source pair (e4a897c2a) | re-keyed by identity: the exact line foodGenerator chooses (`foodLandOf(...).worksOwnLand`) |
| 4c33003d0 | vendorPdfLazy "the goods migration roster" | A′ (6b932d3e8) imports `RESOURCE_DATA` into generationCoherence.js | the roster row says identity, direct |
| e8f54fc57 | proseWiringCensus ×3 | item 2 (i): the `prison` atom is a producer; the leaf chainYield.js | the census re-taken by its writer (`--check` exit 0); measured 586 → 590, not-produced 66 → 62 |
| 3dec3ae21 | narrativeQualityCorpus "city district-market revenue" | AGREE-3 F9 (e373a7836): the market home reads the catalogue; the fixture's "District market" is no catalogue name | the fixture is the city's own "Multiple market squares", the same branch |
| d35631f20 | tuningRegister "no file carries more bare decimals" (prosperity.js 13 → 17) | AGREE-3 F11 (b13fb5f30): four bare thresholds | they are PROSPERITY_RANK's Wealthy / Prosperous / Moderate / Poor by name; 0 of 3,391 leaves |
| ed159ff8c | generationForkCensus A4 | the refill (1dde265d8): a golden road holder's re-dealt roster | the register's door: the four fresh figures (same 21 → 22, transformed 42 → 41, two rows) |
| the last commit | edge bundles ×7, engineBundleReplay ×3, engineServiceCore, engineServiceStoreParity ×3 | the bundles stale against src/ | re-emitted alone; tests/edgeFunctions + the three build suites 960 passed with them |

**THE LINE'S KNOWN SET (red at e883780bb, §2f "where things stand after point 43"):** landingFixtureFreshness ×2
(FOUNDING-WORLDS re-runs it); newsHeadlineContract, newsVoiceContract and proseFamilyContract (act 4; at the tip
proseFamilyContract fails at load, below); dossierProseManifest's DRIFT arm (act 2).

**THE MERGE SEAT'S ROWS, NAMED IN THE DRAFT** (each a byte-identity, digest or corpus figure over generated output;
red from 8be24bf61, i.e. the earlier seats, unless marked; the record gives each its figures): the four golden
surfaces that move (gm, fence, herald, the prose manifest's four-seed arm) and the PDF golden (cure 9);
generationForkCensus A1; dmLayerGoldenIsolation A7; nameHeldThroughAssembly A1; pipelinePinnedChoosers A1;
pipelinePinnedMode A1, A2, A5; powerEconomyFreshness A4; rosterFinalUnderHeldRoster A1; worldFactRederive A7;
x46NpcBand; institutionBudgetPromise; editWorldFactResources A2, A6; editCorpusRatchet A4, A7, A8;
mergeLadderHeldKeys A2, A5, A6; hookThemeDraws; institutionTable; siteCoherenceRatchet C1 (its one rise, desert
dunes 29 → 30, named, not banked); townCartographyCalibration; undercitySewerDerivation; intentAtlasSoakDistiller;
statecraftExposureBand ×2 (scandals 16, mobilizations 20 against floor 72; POWERS' point keys the floor). **Two
instrument seeds the lane's generation moved, each re-searched by the rule in its own header, which moves a closing
act's register:** the observed-shape corpus's `osr-tier-14` (mints no tier candidate from 8be24bf61, so
observedShapeReaders, writerReach and proseFamilyContract fail at load); the taste fixture towns
(`tests/fixtures/tasteTowns.js`): proseTasteInterested ×3 and proseWaveGate (d) ×2 from 8be24bf61, proseComposed A13
and proseWaveGate (d) "differ in exactly one way" from the refill.

**ABSENT AT THE TIP, AN ARTIFACT OF THE COPY:** the archive copies have no `.git`, so the rows that read history
fail there only (controlBytes, declaredLineShape, drawDeclaredKeys, ledgerCitationIntegrity, observedShapeSentinel's
history probe, tuningRegister's four refreeze rows, wiringCensusDeclared, edgeSharedBundleReproducibility's
committed-tree rows, editCorpusRatchet A5/A6). Every one is green in the real tree at b4670a365.

## The equal-failing set: seven directories and the three L1 gates, the line against the tip

| | e883780bb (the line) | the tip |
|---|---|---|
| tests/architecture | 344 passed | 0 failed |
| tests/build | 2 failed: landingFixtureFreshness ×2 | landingFixtureFreshness ×2 (known); bundle rows cured by the last commit; vendorPdfLazy cured |
| tests/domain | 18,256 passed | 9 failed, all the merge seat's (above) |
| tests/generators | 1,817 passed | 11 failed, all the merge seat's; w0, narrativeQuality, fork A4 cured |
| tests/lint | news ×2, proseFamily A1/A3/A5 (known), plus the copy's history rows | news ×2, proseFamily (known); institutionTable, siteCoherence (merge seat's); OSR, writerReach (the seed); taste ×7 (the towns); anchor, tuning, wiring ×3 cured |
| tests/property | 1 failed: the DRIFT arm (known) | the DRIFT arm (known); four-seed arm, dmLayer A7, editCorpus ×3, fence, gm, herald, statecraft ×2 (merge seat's) |
| tests/simulation | 187 passed | 0 failed |
| domain-strict | 1113 / 1113, exit 0 | 1113 / 1113, exit 0 |
| typecheck:ratchet | 167 / 167, exit 0 | 167 / 167, exit 0 |
| eslint | src, exit 0 | src and every touched file, exit 0 |

Outside the seven, tests/pdf holds goldenViewModel (cure 9) and tests/edgeFunctions the bundle rows (the last commit).

## The six golden surfaces (the fourth law)

gm MOVED 501/525; the fence MOVED 359/360 (37bd444b at the tip); the prose manifest MOVED (954 drift rows; its
four-seed arm from 8be24bf61); the PDF golden MOVED by cure 9 alone (defense.scoreAvg 43 → 40, first at c20042d2c);
the herald MOVED (a89eda1e → 479da6ba; 8aaf2b3d at 8be24bf61); the preset-lighting witness UNMOVED (7/7). 3′ (ii)
leaves the PDF golden and the phone floor unmoved. The record says each with its measure.

## The STOPs raised, and the chair's rulings

1. **Item 1 (c)**: the walker had no rule for a check's diagnostics. Ruled: a walker rule keyed by file, callee and
   argument, pinned so no reader prints a finding's words (071ea4cfd).
2. **Item 3**: "Floodplain Agriculture" is a chain, never a strength. Ruled: item 3 DROPPED; 3′ (refused chains read
   "Normally yields"), built in (i) a leaf predicate and (ii) the tab and the PDF's three writers.
3. **The A′ record**: the re-deal moves labels inside the holders. Ruled: declare every family; then THE SLOT IS
   REFILLED with no further roll (1dde265d8); the record taken once after (0db835f6f) and the old sentence struck.
4. **Item 4**: `--tighten` run before the amendment (d329b828c) was reverted (8ea25ef31); the narrow door built.
5. **Cure 9's legitimacy**: declared under cure 9, with the lane's legitimacy total (85f08688c).

## What was banked

One register row through the narrow door (ca1ed8ddd). The wiring census and the fork census register re-taken by
their own doors (e8f54fc57, ed159ff8c), the goods roster's row by the walker's own reading (4c33003d0), the lighting
census by its ritual (b4670a365). No test skipped, no pin loosened, no baseline banked upward, no golden door run.

# PART FIVE — the sixth seat (COHERENCE-AGREE-6, 2026-11-12), from 8866a0ddd

REVIEW-AGREE-2 (`lane/review-agree-2-2026-11-12`, NOT CLEAR, nine findings) answered as the chair ruled it. This
seat worked in a scratch worktree on the lane branch, under the owner's word given in its session. Every push was a
plain push, and the hook's three lane gates ran on each.

## Calls taken without the chair (the chair's standing rule of 2026-11-12: declared or named only)

- **F2's moves**: declared inside the item's bound. 131 births: the two trade lists and the text that reads them.
  No label moves.
- **F2's writers**: four writers were found, not two. Besides the export bonus and the land's commodity list, the
  land's raw goods (Charcoal, Peat fuel, Salted fish) and the entrepôt transit branch ("Preserved foods (transit)"
  from a depleted salt chain) each read the leaf. The guard reads the writer's suffixes off.
- **F1's datum lives in its own leaf**: `src/data/chainAccessNames.js`. The chain's catalogue entry carries it by
  reference, because the page's leaf sits in the first-paint graph, which the chains table may not reach (the goods
  surface law in vendorPdfLazy). The leaf takes a row in the goods roster.
- **F1's print sites**: every changed line is folded so that the prose-numerics register (line-keyed) does not move.
- **F8 (i)**: only name-like constants are resolved (no comma, 40 characters at most), as the chair ruled. 0 new
  readers, and nothing banked.
- **F5 (a)'s key**: `requiresTerrain`, not `terrain`, which the pool reads, and not `terrainRequired`, which the
  cascade and institution rolls read.
- **Re-keyed by identity, never loosened**: coherenceAgreeCures `item 3′ (i)` (the exporter's one import now also
  names the goods set) and w0WriterAgreement (F7, now a literal per row).
- **The ledger ref fetched for the suite** (L5): `ledgerCitationIntegrity` fails at load without it.

## Per item: commit, count before -> after, pin, plant

| Item | Commit | Before -> after (corpus of 4,141 = L2 2,866 + golden 525 + REVIEW-AGREE-2's 750; and the reviewer's seeds) | Pin, and the plant executed |
|---|---|---|---|
| 1 the line | d0f0d022b | merge of 3575cf061. Generated files: wiring census by its writer, lighting baseline the line's, bundles the lane's. 0 leaves in 4,141 | - |
| 2 F1 the toll's name | bdb2cb8cb | Printed "Crossroads" off a crossroads: 636 -> 0 (river 399, port 237). Reviewer's seeds 90 -> 0. 600 fresh births of six sizes 75 -> 0. The record moves 0 leaves | chainPrintName.test.jsx (5 seeds). chainPrintSites.walker. Receipt "A chain prints a resource whose row refuses the town's access". PLANT, the river row removed: 6 tests red |
| 3 F2 refused goods | e449afc4e, 1a3a1f51b | Exports 191 in 101 births -> 0. Local production 17 births -> 0. Reviewer's seeds 28/15 -> 0, 6 -> 0. Golden 2/1 -> 0 | coherenceAgreeCures "F2" (4 seeds). Receipt "A trade list carries a good only a refused chain makes". PLANT, the export bonus not asking: 2 red |
| 4 F3 reach | 2c428c7a0 | G2 convicted in 41 births, G5 in 10 (seeds below). Every one of 23 members live in 1 or more arm-2 births | All six plants red, below. The reach test is red with its two surplus seeds removed |
| 5 F7 literal pin | e1bc84b23 | 14 zero-source golden rows written as literals | PLANT, `worksOwnLand` inverted: new pin red, old pin green |
| 6 F8 the walker | 682ddc2f3 (constants), a9d2bc1cf (prison), 9b5fb174a (`:828`) | Constants: 0 new readers. Prison: 0 leaves | Constant plant red. Ruined-prison and gaol pin red at the parent. (ii) widening PARKED (P1) |
| 7 F5 the pass | deb1544eb (a), 97804b535 (d, wizard) | 0 leaves each | "F5 (a)": the row agrees with the geography table. "F5 (d)": offered on the mountains only. (b), (c) and (d)-validator PARKED (P2-P4) |
| 8 F6 directions | the draft record (this seat's paragraph) | Every family restated as counts by direction on named corpora | - |
| 9 F4 income | - | PARKED (P5) on its own STOP bounds | - |

**F3's six plants**, each executed alone in a scratch tree:
- G1 (gates read the walls): red in "every seed …" and "every reviewer seed …".
- G2 (the company read off the garrison): red in "every reviewer seed …", on agree-town-146, agree-city-60,
  rvw12b-metropolis-52 and r2read-city-4.
- G3 (the watch read off the militia): red in "every seed …" and "every reviewer seed …".
- G4 (the surplus swap off): red in "every seed …" and "every reviewer seed …".
- G5 (the market filter off): red in "every reviewer seed …", on agree-thorp-56, r2r-hamlet-5 and rvw12-village-25.
- G6 (the access refusal off): red in both arm-2 tests and coherenceAgreeCures "road holders at the bottom of their
  range …".

## The field diffs (L3)

- **The seat's own, 8866a0ddd -> the tip**: 131 births (1 golden). The families are economicState.primaryExports
  114 and .localProduction 17, and the text that reads them: arrivalScene 30, npcs[].goal 4, npcs[].secret 3,
  history.founding 3, history.currentTensions 3, history.historicalEvents 1, pressureSentence 1. No label moves.
  These are F2's moves; every other commit of the seat moves 0 leaves.
- **The lane's total, the line 3575cf061 -> the tip**: 4,084 of 4,141 births (golden 501 of 525). The families most
  touched are economicStrengths 3,888, primaryImports 1,924, safetyProfile 1,602, foodSecurity 1,560, incomeSources
  1,542, plotHooks 1,412, defence scores 1,371, strategicValue 1,156, foodways 1,050, primaryExports 732, and A′'s
  666 holders.

Label moves by direction (toward safety / toward danger):

| Family | L2 | The second review's 750 | Golden |
|---|---|---|---|
| Readiness | 29 / 46 | 6 / 4 | - |
| Public legitimacy | 9 / 18 | 3 / 1 | - |
| Prosperity | 4 / 14 | 3 / 0 | 0 / 1 |
| Safety | 6 / 8, 1 level | 1 / 1 | - |
| Food band | 2 / 0 | 2 / 1 | - |

The R2 moves toward danger, by town, with their causes:
- r2s-politically_fractured-town-1 and r2s-wartime-village-3, readiness: cure 9.
- r2r-town-42, readiness: A′.
- r2r-village-22, readiness and legitimacy: A′.
- r2r-town-57, safety: A′.
- r2s-under_siege-city-3, food band importDependent -> deficit: A′ (F6).

Every one is a cause the record declares. A re-deal moves each family both ways.

## A′ re-taken on the 4,141 (the counterfactual: the tip with the access refusal off)

There are 666 holders. Toward safety / toward danger:

| Family | L2 | R2 |
|---|---|---|
| Readiness | 21 / 17 | 4 / 2 |
| Legitimacy | 7 / 12 | 3 / 1 |
| Prosperity | 4 / 14 | 3 / 0 |
| Safety | 6 / 8 | 1 / 1 |
| Food band | 2 / 0 | 2 / 1 |

The golden's prosperity moves 0 / 1. The L2 figures equal the fourth seat's figures exactly.

## PARKED (the chair's standing rule: sent together once, at the end; detail in the seat's scratch PARKED.md, summarised here)

- **P1, F8 (ii)**: the hospital cure (`home.hasHospital || home.hasHealer`) moves LABELS, all toward safety.
  Readiness: Well-Defended -> Fortress 16, Defensible -> Well-Defended 3, Undefended -> Vulnerable 1. Legitimacy
  3 up. 176 births. The ruling was to stop on a label that moves. The widening (the third member, the atom test, all
  nine plants) waits on it, because the lane's own reader may not be banked.
- **P2, F5 (c)**: built in scratch. 963 holders, 0 non-holders, golden 297, every family under the one-in-fifty
  bound (prosperity's net is 10 toward danger against about 19). It FAILS A′'s proof: 11 holders are left with
  nothing live, because the slot's depletion draw lands on the replacement. Left out, as the brief says.
  Recommendation: a refilled slot takes a draw only where the refused member could be depleted.
- **P3, F5 (b)**: 269 holders, confined. Depleted arrivals 34.9% against the base roll's 35.0%. It grows the
  certification corpus's identity pin by one specimen (certification-v1-plagued-martial-city-bracken: a re-dealt
  role-only person).
- **P4, F5 (d)'s validator half**: waits on (c).
- **P5, F4**: the chain gate moves the income list in 2,019 births. Prosperity moves in 54 of the 1,671 that lose a
  source (3.2%, over 2%). One roster moves (rvw12b-town-264 gains a harbour master's office). The history
  annotations move in 22.

## Found, not mine

- `region/goodsCatalog.js :: normalizeGood` reads "River traffic" and "River Toll" as **fish**, by a fuzzy match.
- The 15 logic readers of a chain's printed strings (to be kept on the record's strings by the next wave):
  - institutionLifecycle :: institutionContribution
  - supplyCompleteness :: chainGoodIds
  - supplyKernel :: resolveConsumingInstitution and countProducingChains
  - supplyChainState :: searchableChainText and chainIdFromShape
  - EconomicsTab's income keyword
  - propagation :: matchingGoods
  - magicReliance :: chainNeedsMagic
  - viewModel :: isArcaneChain
  - economicState's allowsGeneratedContent(label)
  - chainYield's resource fallback
  - generalStateProse :: homeFedChain
  - resourceDynamicsKernel :: resourceProjection
  - goals.js's target id
- **The defence atoms' private readers outside the lane**, for the next wave's charter. Hospital or healer:
  - institutionProbability.js 144 (steers the roll)
  - defenseGenerator.js 313 (steers the scores; the upkeep lane's file)
  - narrativeGenerator.js 505 and 509
  - spatialGenerator.js 99
  - services/serviceClassifier.js 413
  - stressGenerator.js 123
  - display/threatAssessment.js 92

  Palisade: power/rulingStructure.js 707 (the powers lane's). Two need a rule, not a row:
  worldPulse/npcGoalBranches.js 130 (a role archetype) and summary/settlementQuickGuide.js 280 (an agreement check).
- **F2's readers of the export list print poorly once an export changes.** "Secure enough recovered reserves to
  outlast the blockade" (the first export's first word); "The speculative fever in recovered artefacts (naval route
  only) and land" (the list's suffix printed). This is the B class, not the lane's.
- **The PDF's flag-off chain path** (`viewModelBodySlices.js :: economicsSlice`) names every chain `c.name ||
  c.chainName || 'Chain'`. An active chain carries `label`, so with `pdfVisualChains` off every card reads "Chain".

## New words, for the owner's veto

- "River Toll" / "River traffic"; "Harbour Dues" / "Harbour traffic". These are printed.
- "Only available in mountain terrain": the wizard's reason, on the existing pattern.
- The receipt's findings: "A chain prints a resource whose row refuses the town's access." and "A trade list
  carries a good only a refused chain makes." These are never printed: the presumed-things walker's rule exempts a
  finding's words.

## What was banked

Nothing. No register row was added, no test skipped, no pin loosened and no golden door run. The wiring census was
re-taken by its writer twice (the merge; F1's new leaf: producerIndexFiles 1325 -> 1326). The lighting census was
re-taken by its ritual (87a14f413: files 3211 -> 3218). The mutation manifest gained one rationale row
(chainPrintSites.walker), and its F8 text was corrected.

## The fifth law: the whole suite, once, every red classed

One `npx vitest run tests --maxWorkers=2` at **87a14f413**, with the ledger ref fetched first: **48 failing titles in
37 of 3,218 files**; 38,682 passed; 252 skipped. After 87a14f413 the seat changed only docs, one test file
(CENSUS-5b, below: its own file green, 14/14), the lighting baseline (its walker green) and the bundles (the last
commit).

**THE LINE'S KNOWN SET:**
- landingFixtureFreshness ×2
- newsHeadlineContract and newsVoiceContract
- proseFamilyContract
- the prose manifest's DRIFT arm

**THE MERGE SEAT'S, named in the draft.** These are byte identities, digests and corpus figures over generated
output, at the figures PART FOUR gives:
- generatorGoldenMaster (501 rows)
- espionageDormancyFence (driven hash 4c0fe1fe; F2 moves it again)
- heraldKnowledgeDeskGolden (ca07dcdc; F2 again)
- the prose manifest's four-seed arm
- goldenViewModel (cure 9's one field)
- generationForkCensus A1
- dmLayerGoldenIsolation A7
- nameHeldThroughAssembly A1
- pipelinePinnedChoosers A1
- pipelinePinnedMode A1, A2, A5
- powerEconomyFreshness A4
- rosterFinalUnderHeldRoster A1
- worldFactRederive A7
- x46NpcBand
- institutionBudgetPromise
- editWorldFactResources A2, A6
- editCorpusRatchet A4, A7, A8
- mergeLadderHeldKeys A2, A5, A6
- hookThemeDraws (2149 against 2157, unchanged)
- institutionTable (1847 against 1849, unchanged)
- siteCoherenceRatchet C1
- townCartographyCalibration W2
- undercitySewerDerivation
- intentAtlasSoakDistiller
- statecraftExposureBand (one title, 16 and 20 as before)

**THE INSTRUMENT SEEDS** (PART FOUR):
- observedShapeReaders and writerReach (fail at load, the seed osr-tier-14)
- proseTasteInterested ×3 and proseWaveGate (d) ×3 (the taste towns)
- proseComposed A13

**THE EDGE BUNDLES, CURED BY THE LAST COMMIT:** engineBundleReplay ×3, aiGroundingBundle.freshness, and
edgeSharedBundleReproducibility (aiGrounding, engine). They are stale against this seat's `src/` and re-emitted alone
as the last commit.

**YOURS TO CURE: none.** No title is new against PART FOUR's classes, except the bundle rows the last commit cures.
The preset-lighting witness is green.

## Added by the chair during the seat: CENSUS-5b's complement rule (fd10c7dc6, one commit)

`tests/generators/census5bOffCensusDeclarations.test.js :: twinAnswersOnItsKey`: a twin is the complement of its
original on the ONE atom the pair is keyed on, and on no other. The plant (keyed on the walls, both naming the
garrison) was RED under the old rule and is GREEN here. Existing pairs the narrower rule asks a declaration of: **0 of
21**. Nothing was banked. The upkeep lane's four lines meet the rule at their merge. The lighting census was re-taken
after it (326e711b0).
