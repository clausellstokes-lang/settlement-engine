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
| 5 | 72c902fb8, 2a59c4c2e | viability hooks: no war the record does not hold, no scarcity of a live material, no line above a quarter of its pool | war in peace 94 → 0; scarcity beside a live material 43 → 0; largest hook line 45% → 13.0% |
| 6 | f88d87af2 (guard), 570f2c21d | worked land is a food source by its own name (the chair's ruled variant) | worked land not a source 105 → 0 |
| 7 | db9dcb7a4 (guard), 7dd488928 | every income line that names a local resource reads the town's resources | income names a resource the town lacks 50 → 0; the viability note beside a live material 43 → 0 |
| 8 | 7fcc50374 | the health summary's "Paid hands" reads the defence home | the lens with no paid force 18 → 0 |
| 9 | c20042d2c | the flag bag's hired company and gate are the defence home's answers | hasMercenary 49 → 0, hasGates 13 → 0 |
| guard | fddcc13a2 | the court: the safety text against the court home (`defenseFactsOf.hasCourt`, `defenceOf().court`) | — |
| 10 | 3f2e6b413 | the court flag (`priorityHelpers :: hasCourtSystem`) is the defence home's answer, off the live roster | 0 towns move at birth (raw and live agree on all 360); the pin is a ruined courthouse |
| 11 | 3bca8758c | a court with no prison is not "no court": three crime lines gain the court-without-prison twin | the arm's court member: 49 findings in 48 towns → 0 |
| guard | 5bea66c25 | the market: the economic situation naming a market the market home says the town lacks | — |
| 12 | fe3c54001 | the economic situation's six market lines are declared in `PROSPERITY_LINE_SIBLINGS` (needs `market`, each with its twin) and enrolled in the pool census's declaration channels | 9 towns → 0 ("markets meet infrequently" 7, "The market still opens" 2, "The market is shut" 0) |
| 13 | f61a5a5da | the court-without-prison line names no prison ("…the prison system is limited" → "…there is nowhere to hold the guilty") | printed in 57 towns, all without a prison by their branch → 0 |

## What moved, and why (outside the text)

- **Cure 6** (the chair's ruled variant): no-source towns went 224 → 146. Food chains rose by 1 in 91 towns and by 2 in 7. Resilience moved in 98 towns. Storage rose by 0.2 in 37 towns and by 0.3 in 15, and no storage note crossed a threshold. No food band, prosperity label or safety label moved. One famine town is reported: agree-city-58.
- **Cure 9**: the defence label fell one step in 5 towns (agree-village-34, agree-town-57, -81, -139, agree-city-45). Every one of the 5 is a member of the class, and the move stays inside them. The power structure moved in those 5, and one quarrel moved in agree-city-45.
- **Cures 10–13** are text only. No band, label or score moves on the corpus. Cure 10 moves nothing at birth and changes the answer only for a ruined courthouse.

## The court: which reader is right (measured before the cure)

PRESUME's corpus arm listed "A court exists…" in towns its reader calls courtless (`tests/lint/presumedThings.shared.mjs`, `court.absent`: no roster name matching `/court/`). Across the 360 births, the two readers disagree in 101 towns. **Every one of the 101 holds a Town hall and no courthouse.** The Town hall's own service row (`src/data/institutionServices.js`) is "Dispute arbitration: Bring commercial and civil disputes before a magistrate", and the City hall's is "Appeals court". A magistrate hears cases in the hall, so a court sits there. **The safety writer's names are the right answer, and the walker's `/court/` is the narrow one.** That walker is PRESUME's file, so it is reported here and not edited. The court's one reader is now the defence home's `court` atom. For PRESUME's walker to read it, the atom still has to be registered in the vocabulary (`factVocabulary.js`, which is PRESUME's file).

## The red rows: the merge seat's

At the first seat's tip, 40 rows were red. Each is a byte-identity, a digest or a corpus figure over generated text, and each is **the merge seat's** to re-record. The lane ran no golden door. Cures 10–13 move generated text again in the same surfaces. The draft shift record is **`docs/chair/2026-11-11/AGREE-shift-record.DRAFT.json`**: unsigned, with `predictedRows` not learned. It names four surfaces: the generator golden master, the dossier prose manifest, the herald knowledge-desk golden and the espionage dormancy fence. The second seat added cures 10–13 to its cause and to the dossier manifest's reason.

EQUAL-FAILING-SET: see the section below.

## Found, and not the lane's

- **"Grain and salted pork"**: `demandProfile.js`, 1 town (found by the first seat). It is not in the lane's files and is reported to the chair.
- **PRESUME's court reader** (above): `tests/lint/presumedThings.shared.mjs` reads the court as `/court/` only. The measure says a Town hall is a court.
- **The vocabulary** has no `court` dimension (`factVocabulary.js`, PRESUME's). The home atom now exists for it to name.

## What was banked

The second seat banked nothing. It added no register row, skipped no test and loosened no pin.
