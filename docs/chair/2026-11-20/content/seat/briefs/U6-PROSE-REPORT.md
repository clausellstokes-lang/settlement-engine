# U6-PROSE REPORT (builder BU6, for SEAT-10)

Tree: scratch clone `bu6`, branch `u6`, cut at `46339e5c7`. Times are UTC, read from `date -u`. Each claim is CONFIRMED (run) or PLAUSIBLE (read).

## THE CURE, BY `file :: symbol`

- `src/data/seatHolderLines.js :: SEAT_HOLDER_LINES` (NEW). One table: `relation` (W1, six lines), `licensed` (W2, one line), `standing` (W3, five lines), in the chair's wordings. The slots: `{form}` (the form after its article), `{form's}`, `{holder}` (with its article), and `{holder|one|many}` (the verb's number, `fillAgreement`). CONFIRMED that it renders verbatim (test arms 2 and 4).
- `src/generators/factionDynamics.js :: seatHolderApartOf` (NEW, the gate, condition 3). It returns null unless all of these hold: `seatsByHolder(config)` (the born config); a governing row exists; `holderOf({ powerStructure: { factions }, config }, { audience: 'owner' }).holder` stands apart from it; and `isVeiledRow(holder)` is false. It also carries `licensed = pairLicense(kind, form).pair === 'licensed'`.
- `src/generators/factionDynamics.js :: seatHolderLineOf` (NEW). It draws ONLY through `pickVariantMixed`, keyed `${seed}::seatHolder:${pool}:${form}:${holder}`, where the seed is the birth's (`getActiveRng().seed`). It fills the slots, and `opening` raises the sentence's first "the".
- `src/generators/factionDynamics.js :: computeFactionRelationships`. It takes an 8th parameter, `seatConfig`. In `addRel`, a row whose pair is {form, holder} takes W1, plus " " + W2 on a licensed pair.
- `src/generators/power/factionStanding.js :: annotateFactionStanding`. When `seat.config` is present and the gate holds, the holder row's rank-1 standing is W3. It replaces the "The gap between them", the contested, the "in the shadow of" and the "Behind" branches.
- `src/generators/power/claimStanding.js :: settleClaimsToLabel`. It takes a 5th parameter, `holderName`, and uses `SEAT_ACCESS`, derived from `SEAT_WORDS`' last pair. On the holder's row, " and expect council access in return." and " and expect access to the hall in return." become ".", so the claim reads "Established merchant community; fund civic works.". No word is authored (condition 4). CONFIRMED (arm 2, u6t-town-22).
- `src/generators/power/rulingStructure.js :: generatePowerStructure`:
  - FAULT (c): `annotateFactionStanding(factions, standingForce, { publicLegitimacy, config })`.
  - The born config is handed to `computeFactionRelationships`.
  - `seatHolderApartOf(...)?.holder.faction` is handed to `settleClaimsToLabel`.
  - The gate's import specifier joins the existing `computePublicLegitimacy,` line, because F31's module line ceiling (800) stood one over.
- FAULT (b), `people/castPowers.js :: raiseToOfficeBand`: NOT CURED, no witness (below). castPowers.js is untouched.

## THE TWO WITNESSES

- FAULT (c), witness `u6f-town-18` (lit, town, germanic). It was found by a search over 600 lit births (`u6f-<size>-0..99`) in the flipped copy, instrumented and then reverted. 38 power-step calls had a law-1 `contestedBy` that differed from the law-2 field. On the witness, law 1 reads "Landed Gentry" and the law reads null. CONFIRMED.
  - RED FIRST: with line 738 put back to `{ publicLegitimacy }`, the new file went 3 failed / 6 passed (07:54:00Z). The arm-1 red: "the power step hands annotateFactionStanding the born config: expected false to be true". Both arm-2 cases also went red, because W3 rides the same config. Restored, the file is 9/9 green. CONFIRMED.
- FAULT (b): NO WITNESS. The same 600 lit births made 526 `raiseToOfficeBand` calls, and 0 of them took a different band under the law's fold. The office role is `seatPoolFor(tier).role`, one of Elder, Mayor or Governor, and the fold maps each to itself. By the brief's rule I stopped there: no fabricated fault, no cure, no arm. CONFIRMED (run, 07:44:35Z to 07:46:20Z).

## A FINDING THE INTEGRATOR NEEDS (STOP-class, by symbol) — RULED BY E65, CURED BY THE ADDENDUM BELOW

The brief puts the writers at the power step, and there `holderOf` sees no people: it reads only R3, or R4/R5. On the finished record the holder is mostly R2, the person's first power, which is cast after the power step.

- In 60 lit births: 32 had the holder apart, 25 of them by R2 and 7 by R3. The power step's read agreed with the record in 18 of the 32. In the other 14 the step read no holder (R4), so those 14 keep today's lines. In this sample no case showed a power-step holder that differed from the record's. CONFIRMED.
- The chair's probe (150 lit births) after the cure:
  - Of the 63 form↔holder rows, 28 now print W1. 32 still print the "taxes and loans" or "work under the rules" lines, all on R2 holders.
  - The holder rows print W3 in at least 20 births (counted on the top-25 shapes). At least 22 keep the rank-1 lines.
  - `contestedOnHolder` is 0.
  - CONFIRMED.
- W2 can never fire at birth: a merchant holds a Royal Authority only by R2. W2 is proved by a planted holding (arm 4).
- To cure the R2 births, the gate and the two lines must also run once on the FINAL record. The seam is `generators/generateSettlementPipeline.js`, beside `claimStanding.js :: settleArcaneToPractitioners` (line 205). That file is outside this manifest, so I did not touch it. PLAUSIBLE (read).
- Residues, not in the brief and left as they are:
  - A holder at rank 2 keeps "They are always at the table…".
  - `withConflictRelations` appends "Even so, the two are now at odds over…" after W1.
  - `power/rosterText.js :: standingsOf` re-reads the standing with no config, which is fault (c)'s twin.
  - The row's `type` stays `subordinate` or `dependent`.

## ADDENDUM (the chair's E65; the brief's ADDENDUM of 09:19:34Z): THE FINAL-RECORD PASS

### The cure, by `file :: symbol`
- `src/generators/power/factionStanding.js :: settleSeatHolderToRecord` (NEW). It runs on the final record and has the same gate as the power step: `factionDynamics.js :: seatHolderApartOf(factions, record, record)`, which now reads `holderOf` off the whole record, so R2 is visible. That gate is the record's own seat law, the holder apart from the form, and `!isVeiledRow`. Under law 1 it returns at `seatsByHolder(record)` and reads nothing more. On a lit record:
  - every {form, holder} relation row takes W1, plus W2 on a licensed pair (`seatHolderRelationLineOf`);
  - the holder's row loses the "expect council access" clause (`claimStanding.js :: withoutSeatAccess`, the same cut as the power step);
  - W3 replaces, in this order of preference, a W3 the power step wrote, or else the first rank line it carries (`RANK_STANDINGS`: the eleven rank-1, rank-2 and last-rank lines, read and never written), or else it is appended. This holds at ANY rank (E65 (2));
  - ONE ROW A SEAT: a W3 on any other row is cut and not reworded. This is a density-law rival copied from its host, measured at 7 births before the cut and 0 after.
- `factionDynamics.js`:
  - `seatHolderLineOf` takes a `seed`. The pass keys by the record's `_seed`, because the stream is spent by then.
  - `seatHolderLinesOf` (the pool filled, no draw) and `seatHolderRelationLineOf` are new.
  - The 7 new imports sit below the lines the holder census cites by number, which cures the `proseWiringCensus` red without packing a line.
- `src/generators/generateSettlementPipeline.js`: one call, `settleSeatHolderToRecord(finalCtx.settlement)`, immediately after `settleArcaneToPractitioners` and before `withConflictRelations`.

### (a) It draws nothing from the stream
- The pass uses keyed picks only. CONFIRMED by two in-tree arms:
  - **Arm 5, law 1 (the law's key absent).** Five births: `u6d-town-0`, `u6d-village-0`, `u6d-city-0`, `u6t-city-4` and the R2 seat `u6p-village-3`. Each is compared with the same birth with every new path and the pass forced off: byte-identical, with 0 differences of any kind (`diffPaths`, empty).
  - **Arm 6, lit.** `u6p-village-3` with the pass alone off against on. The only paths that differ are `powerStructure.factionRelationships.N.narrative` and `powerStructure.factions.N.desc`: no draw count, id or other field moved.
- Confine-two is the integrator's.

### (b) Under the lit law, on u6probe's 150 births (09:41:36Z)
CONFIRMED (`u6work/bar.mjs`, in the flipped copy):
- 78 births have the holder apart, with 63 form↔holder rows between them.
- **All 63 rows print W1**, so no row is left to name.
- **78 of 78 holder rows print W3.** No row carries two W3 lines, no stray W3 sits on another row, and no stray W1 sits on another pair.
- **W2: 0 places.** None of the 150 births seats a merchant holder in a Royal Authority or a Ducal Governorship, the only licensed pair. W2 is proved by arm 4, a planted holding.

### (c) THE BAR
The commonest W1 sentence and the commonest W3 sentence in each size, out of 25 places per size. 15% of 25 is 3.75.

| size | W1 rows | commonest W1 | W3 rows | commonest W3 |
|---|---|---|---|---|
| thorp | 0 | none | 0 | none |
| hamlet | 0 | none | 2 | 1 ("They are the ones who sit in the Feudal Stewardship, and its word is theirs.") |
| village | 9 | 3 ("The Elder Council's seats are filled by the Merchant Guilds.") | 9 | 3 ("They govern through the Elder Council, and what it orders is their order.") |
| town | 16 | 3 ("The Guild Council is the office here, and the Merchant Guilds hold it.") | 19 | 2 ("They govern through the Guild Council, and what it orders is their order.") |
| city | 18 | **4** ("It is the Merchant Guilds who sit in the City Council.") | 23 | 3 ("They govern through the Merchant oligarchy, and what it orders is their order.") |
| metropolis | 20 | 3 ("The Grand Guild Consortium is how this place is ruled, and the Merchant Guilds rule through it.") | 25 | **4** ("They sit in the Grand Guild Consortium themselves, and its rulings are their own.") |

- Two cells reach 4 of 25 (16%). Every other cell is at 3 or under (12% or less). CONFIRMED.
- An earlier cut keyed the pass with no seed, because the stream is spent at that point, so every pass draw took line 0. That cut put the city's commonest W1 at 10 of 25. Keying the pass by `record._seed` cured it.

### (d) Named, and what it moves
- **Where the pipeline's settle passes are listed or pinned.** I searched `tests`, `scripts` and the registers. No register lists or pins the final passes as a sequence.
  - `tests/generators/power/arcanePractitioners.test.js` pins `settleArcaneToPractitioners` alone, and `conflictRelationsTwin.test.js` and `regenDerivedState.test.js` pin `withConflictRelations` alone.
  - The mutation manifest's rationale text names `settleArcaneToPractitioners`.
  - The pass is named at its call in the pipeline, in its own header, and here. PLAUSIBLE (search).
- **Stored fingerprints and censuses it moves:**
  - `supabase/functions/_shared/engineBundle.js` and its `.meta.json` `sourceHash` are generated, so any src change moves them. This shows as `tests/edgeFunctions/edgeSharedBundleReproducibility.test.js` ×4 ("the recorded sourceHash equals the builder hash over INDEX content"), ALL FOUR ALREADY RED on RED-AT-LINE. No build was run, by the rules.
  - The estate's file count in `sovereigntyLightingContract.walker.test.js` (3748 → 3749) is moved by the new test file, not by the pass. NOT on RED-AT-LINE.
  - The holder census (`proseWiringCensus`) is NOT moved: the imports moved below its cited lines, and it is CONFIRMED green.
- **Under law 1 the output moves nowhere** (arm 5). The pipeline's output fingerprints were run at 09:45:10Z, and 11 reds came back:
  - `generatorGoldenMaster` "every config produces byte-identical output…";
  - `dossierProseManifest` "THE DRIFT ARM…";
  - `generationForkCensus` "A1 — the instrument reaches…";
  - `pipelinePinnedMode` A1, A2 and A5;
  - `pipelinePinnedChoosers` A1;
  - `edgeSharedBundleReproducibility` ×4.
  - EVERY ONE is a row on RED-AT-LINE (`ral/chair-2026-11-08:docs/chair/2026-11-20/seventh/ci/RED-AT-LINE.tsv`, fetched from the clone's origin as `refs/remotes/origin/lane/chair-2026-11-08`). That they did not move FURTHER is PLAUSIBLE, from arm 5 and the in-tree differential: their figures were not compared with 46339e5c7's.
  - Green in the same run: `regenDerivedState`, `conflictRelationsTwin`, `arcanePractitioners`.
- Residue, not cured: a section regen (`regenSectionAction`: npcs) re-casts the people without re-running this pass, so a regen that moves R2 can leave the lines on the old holder. PLAUSIBLE (read).

### (e) ONE ORDERING PROOF
Arm 6, `u6p-village-3`, an R2 seat. CONFIRMED:
- The pass ran once.
- When it ran, the record had people cast (`npcs > 0`).
- When it ran, no row yet carried the conflicts' " Even so, " clause.
- On the final record the rewritten row reads "The Elder Council's seats are filled by the Merchant Guilds. Even so, the two are now at odds over blame for a costly failure last season.", so `withConflictRelations` read the rewritten row after the pass.
- Only `power/rosterText.js :: settleNarrativesToRoster` reads a relation narrative before the pass, and it reads only the merchant↔craft vote lines. `people/goals.js` reads a row's `type`, which the pass does not touch. PLAUSIBLE (read).

### (2) W3 at any rank
CONFIRMED:
- Arm 6, `u6p-village-18`: the Military Party holds the Headman's Authority by R2 from rank 2. Its "They are always at the table, but cannot set their own terms." gives way to "They are the ones who sit in the Headman's Authority, and its word is theirs.".
- A planted record: a rank-2 power that does NOT hold keeps "always at the table", and exactly one row carries W3.

### (3) Fault (b): CLOSED, not cured
- The guard is arm 7: 6 lit births, one of each size (`u6b-<size>-0`).
- Every band that `castPowers.js` asks `powerBandOfRole` for reads the same under the law's fold. The test asserts that more than 0 bands were asked for and that 0 differ.
- The whole file of 11 tests runs in about 6 seconds. CONFIRMED.

## ADDENDUM 2 (the chair's E70; the brief's ADDENDUM 2 of 10:29:54Z)

### (a) The regex copies: the pass now reads the ladder's own table
- `src/generators/power/factionStanding.js :: LADDER` (NEW, exported).
  - It holds the standing ladder's eleven rank lines (rank 1, rank 2, the last rank), lifted from `annotateFactionStanding` byte-identical. Each row is its sentence's fixed parts, with a name or the count word between each pair.
  - The ladder now writes from `LADDER`. The final-record pass reads `RANK_STANDINGS`, which is derived from `LADDER`, so no wording is copied a second time.
- **Byte proof**, a two-tree differential. `u6base` is this tree with `factionStanding.js` put back to `c1ffee696`; `bu6` is this tree. The 30 births are `u6p-<size>-0..4`, all six sizes. CONFIRMED, at 10:37 to 10:38Z and again on the final ladder (`5dd0e7b22`, 11:29Z):
  - law 1, the law's key absent: sha256 equal (`c2c30c9a…`);
  - lit (the flipped copy, before and after the lift): sha256 equal (`8ea3538a…`).
- **Totality**, arm 8, executed. CONFIRMED.
  - A grid of rosters drives every branch of the rank ladder: 48 named heads, plus 3 unnamed heads.
  - Each rank line the ladder writes must be matched WHOLE by one of `RANK_STANDINGS`, and every `LADDER` row must be reached. The contested line needs a coup reading, so it is checked against the pass directly.
  - A planted rewording of one inline line turned the arm red: "They are always at the table, and cannot set their own terms." gave 12 unrecognised. The file was restored from a backup (`cmp`-clean).
  - `LADDER.level` keeps its literal whole, "Three powers stand almost level here, and no one leads; every ". That literal is the `presumedThings.widened.register.json` row (`powersCount`/`almostLevel`, `632f1a6fe6e2cb93`), so the shrink-only register is not moved. A first cut split "Three" off and turned `presumedThings.walker` red twice; it is CONFIRMED green on `5dd0e7b22`. The pass's pattern reads "Three" as the count word (`\\b\\w+`).

### (b) `regenSection('npcs')`: MEASURED, it re-runs no final pass
- `store/settlementRegenAction.js` (the `section === 'npcs'` branch) calls `generateSettlementPipeline.js :: regenNPCsPipeline`. That function calls none of `keepOneDominant`, `settleClergyToFinalRoster`, `settleArcaneToPractitioners` or `settleSeatHolderToRecord`. Its `powerStructure` is the record's, carried through `withHallCapture` (rederive) and `withConflictRelations` for the newly drawn quarrels. CONFIRMED (read and run). No file was widened.
- **THE NAMED GAP**, pinned in arm 9: on `u6p-village-3` (lit, R2), regenerating the people with seed `u6r-0` CONFIRMED all of the following:
  - no final-record pass ran;
  - the holder stands (R2, the Merchant Guilds);
  - the form↔holder row and the holder's row are the birth's, byte for byte.
- **What a game master sees** after regenerating the people of a lit place whose holder is R2: the same W1 and W3 lines as at birth, and they are still true.
  - Measured: 67 lit R2 places among the 125 births `u6p-<hamlet..metropolis>-0..24`, three regens each, 201 regens in all. The holder moved in 0 of them. CONFIRMED (10:35Z).
  - In 48 of the 201 the rows changed, by the regen's own conflict clauses for the newly drawn quarrels, never by the holder lines.
  - The day a regen can move the holder, arm 9 reds on its holder check. The lines would then name the old holder until the pass is joined to `regenNPCsPipeline`. That call site is the cure; it is not made.

### (c) The bar at 150 a size
Not run: the integrator's, under rule 8.

### GREEN, `tests/lint` whole and the flipped copy, on the tree as delivered
- **New file:** 13/13. CONFIRMED.
- **GREEN set:** 12 files, 232 tests, 231 passed, at 11:29:37Z on `5dd0e7b22`. The one red is RED-AT-LINE's `relationshipArchetypes.js` packing. CONFIRMED.
- **Flipped copy:** the new file is green (13/13), and `tests/domain/seat` passes 211 tests, 205 passed. The six reds are the same dark-dial pins named above (`seatContest` ×3, `seatLawWiring` ×3). CONFIRMED.
- **`tests/lint` whole**, 11:30:36Z to 11:55:59Z, on `5dd0e7b22`, the tree as delivered: 223 files (5 failed), 3,352 tests, 3,347 passed, 5 failed. CONFIRMED.
  - These are the same five as at `f16551bc4`: the line's three (`proseCorpusBytes` ×2, `proseComposed` SHIPPED CORPUS); `sovereigntyLightingContract`'s estate file count, 3748 to 3749; and `mutationCoverageManifest` TOTALITY, which needs the new file's row in `scripts/mutation-coverage-manifest.json`. `ledgerCitationIntegrity` also cannot load, because the clone lacks the ref.
  - The run before it, at 10:40:13Z on `70c5e5d6e`, also had `presumedThings.walker` ×2. That was the split literal above, now cured.

## GREEN

All runs used `TMPDIR=/tmp GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 …`, with output to a file that was read afterwards.

- The new file `tests/generators/seat/seatHolderLines.test.js`: 11/11 on the tree as delivered (09:53:49Z, run with `proseWiringCensus`, which is green). CONFIRMED.
- The final GREEN set, run together at 09:44:24Z on `479ea3034` (the pass and its arms in): 12 files, 230 tests, 229 passed. It covered the new file, `tests/domain/seat` (the filter also takes `tests/domain/seatLawWiring.test.js`), `tests/generators/seatBandFold.test.js`, `tests/generators/people/seatKeeperContender.test.js` and `tests/generators/powerStructure.test.js`. The one red is RED-AT-LINE's own: `powerStructure.test.js` "no power/ module packs more statements…", with `relationshipArchetypes.js: 1 packed lines`, a file I did not touch. `power/factionStanding.js` stands at 400 lines, under the 800 ceiling. CONFIRMED. After it came only arm 5's widening and the import move in `factionDynamics.js`, which is a move with no change in meaning. Neither was run again through this whole set, but the new file and `tests/domain/seat` ran again on the flipped copy. PLAUSIBLE that the set is unmoved.
- `tests/lint/samenessHideable.walker.test.js`: 29/29 with the new row and HAND_CEILING at 74. The house readings were re-taken and needed no row: RULE 2 is green, and none of the six lines on THE WATCH is this table's. CONFIRMED.

## `tests/lint` WHOLE

The final run was 09:54:51Z to 10:18:12Z, on `f16551bc4`, the tree as delivered; no test or source changed after it. Result: 223 files (5 failed), 3,352 tests, 3,347 passed, 5 failed. CONFIRMED. The reds by name:

- **The line's own (RED-AT-LINE), unmoved, 3:**
  - `proseCorpusBytes.test.js` "RAW is EXACT…".
  - `proseCorpusBytes.test.js` "GZIP sits inside the 1 % band…".
  - `proseComposed.walker.test.js` "⭐ THE SHIPPED CORPUS READING…".
- **For the integrator's door, outside this manifest, 2:**
  - `sovereigntyLightingContract.walker.test.js` "THE CENSUS IS AN ASSERTION, NOT A SENTENCE…": "the estate's file count moved — re-measure, do not re-word: expected 3749 to be 3748". The +1 is the new test file. The figure lives in that walker. Not on RED-AT-LINE.
  - `mutationCoverageManifest.test.js` "TOTALITY: every enumerated invariant file has a manifest entry" names `tests/generators/seat/seatHolderLines.test.js`. `mutationCoverage.shared.mjs :: enumerateInvariants` takes EVERY file under `tests/generators` (ENFORCER_DIRS), whatever its basename. The cure is one row in `scripts/mutation-coverage-manifest.json`, presumably under `generators-tree-admitted-subject-coupled-2026-08-30`. Not on RED-AT-LINE.
- **Environmental, 1 file with no test:** `ledgerCitationIntegrity.test.js` cannot load, with "fatal: Not a valid object name refs/heads/review-fixes-2026-07-08". The scratch clone has no such ref.
- **Cured on the way, 4.** Each was CONFIRMED with a targeted rerun and by this run.
  - `proseWiringCensus` "⭐⭐ EVERY MAPPING ROW IS CITED…": the imports moved below the cited lines `factionDynamics.js:109/115/161`.
  - `sovereigntyLightingContract` "⛔ THE EACH-FAMILY PARK DEBT ONLY SHRINKS": no `it.each`.
  - `seedLoopTotality` ×2: the rows are collected through `collectSeedFailures`.

The earlier whole runs were 08:44:19Z (on `e9c302208`), with 6 failed, the wiring census among them, and 07:55:52Z (on `a5532af3e`), with 7 failed.

## THE FLIPPED COPY

`scratchpad/bu6-flipped` is the tree's files plus exactly two dials. It is not committed. Its diff against the tree:

```
src/domain/seat/seatCircumstances.js:50  - export const SEAT_CONTEST_LIT = false;
                                         + export const SEAT_CONTEST_LIT = true;
src/domain/seat/seatLaw.js:77            - export const NEW_SETTLEMENT_SEAT_LAW_VERSION = DEFAULT_SEAT_LAW_VERSION;
                                         + export const NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION;
```

The run at 09:54:25Z, on the tree as delivered, covered the new file and `tests/domain/seat`: 9 files, 209 tests, 203 passed.

- The new file is green (11/11). CONFIRMED.
- Six reds are tests that pin the DARK dials, and the flip turns them by construction. PLAUSIBLE (read) that they are only that: they were not run against an unmodified flipped tree.
  - `tests/domain/seat/seatContest.test.js`, 3: "the dial is dark and every factor…", "under the law, dark: the kind read is today's…", "dark: today's read (a craft archetype has no row…)".
  - `tests/domain/seatLawWiring.test.js`, 3: "the vocabulary: … the dial at the default", "1. CREATE (dark)…", "2. CREATE (THE CLAMP)…".

## COMMITS

The commits are `72db0b9f3` (source), `f75114c2f` (the test and the hand list), `a5532af3e` (F31's ceiling) and `089bc7eea` (arm 5 as a loop), then `e9c302208` (arm 5 collected), `98d998287` (the first report). The addendum's commits: `b965259f4` (the final-record pass), `479ea3034` (arms 6 and 7), `a22a75dee` (arm 5 widened), `f16551bc4` (the imports below the census lines), `c1ffee696` (the report). Addendum 2's commits: `a11234d4e` (LADDER), `70c5e5d6e` (arms 8 and 9), `5dd0e7b22` (LADDER.level whole), then this report's commit, whose sha is in the final message. Nothing was pushed.
