# TAIL-CONTENT-CLOSE-2: hand-back (the two cures TAIL-CONTENT-CLOSE-1 built and did not push)

Branch `lane/tail-content-close-2026-11-15`, base `b5eaf5087`. Every run went to a file in this seat's scratch trees (git
worktrees outside the main checkout, their own `npm ci`). The receipts are in `docs/chair/2026-11-15/probes/TAIL-CONTENT-CLOSE-2/`.
The 720 births were re-made from W2-B-DECLARE's `births.mjs` (the SECOND-WAVE-CENSUS 720: r2r- 6 sizes x 60, r2s- 15 crises x 6
sizes x 4) and its `fielddiff.mjs`, both copied there.

## FOR THE OWNER, IN PLAIN WORDS

| # | what a reader saw | what a reader sees now | count | commit | a veto | goldens and registers it moves |
|---|---|---|---|---|---|---|
| 4 | In a town at war with no smith and no smithy (presume-town-25, Shankou): "Being on the right side of it keeps the forges of Shankou running day and night, and the fish trade has never paid better, …" | "Being on the right side of it, Shankou's fish trade has never paid better, and the place now needs the war to go on to pay for what the war has already cost it." A town with a smith still hears of its forges. | 0 of the 720 births (byte-identical corpus); 1 town of the walker's 360 (one field: its `pressureSentence`) | `0b140b40` | revert it: the forges line prints again where no smith stands | none moved. The widened presumed-things register (`tests/lint/presumedThings.widened.register.json`) holds a row naming the forges line: its seat re-measures (not written here) |
| 2 | In 9 of the 720 births (metropolises), a power's description: "Magical practitioners are consulted but not formally empowered …" where no one works magic | (unchanged on the branch) | 13 descriptions in 9 of 720 towns, one family | **NOT PUSHED** | n/a | (expected, from its patch: the 9 towns' `powerStructure.factions[].desc`; `generatorGoldenMaster` and the driven goldens) |

**Cure 2 is the first item of the next content round, with its patch** (`probes/TAIL-CONTENT-CLOSE-1/cure2-practitioners.patch`,
which applies clean at `b5eaf5087`). Its measure is re-proven here (below); its test sweep is not: 690 test files name
`generateSettlementPipeline.js`, and two runs of them (base and tip) do not fit this seat's thirty minutes.

## CURE 4 — THE PROOF

- **The cure** (unchanged from the patch): a declared twin row beside the forges row (`narrativeText.js`, `twinOf`), taken out
  of the draw's domain (`narrativeGenerator.js :: generatePressureSentence`: the pick is over the same rows as before, so no roll
  moves) and reached only where no row of the pool is admitted and the drawn row is the forges row, in place of keeping the
  refused row.
- **The 720 births:** 0 of 720 moved; the gzipped corpora at the base and at the cure are byte-identical (`births-sha256.txt`).
- **The walker's 360 births** (`ps160.mjs`): one line moved, presume-town-25's `pressureSentence`; that town's every other field
  hashes the same (`ps360-diff-base-vs-cure4.txt`). Exactly the hand-back's statement.
- **The guard** `tests/generators/wartimeForgesSmith.test.js`: RED with only the twin's resolution removed (`?? twinOfDrawn`):
  "presume-town-25: no smith" (`cure4-guard-red.txt`); GREEN with it. NOTE: the old door with the new data is NOT a red: the
  old wrap-around search (`find(admitted)` from the drawn row onward) reaches the twin as an ordinary admitted row. That is why
  the twin must sit outside the drawn pool (it would otherwise be drawable and move rolls), and why the red is the resolution's.
- **The sweep:** 59 test files that name `narrativeGenerator.js` / `narrativeText.js` or quote the old words (`cure4-sweep-tests.txt`; one vitest JSON run at the base, one at the cure, diffed: `cure4-sweep-base-vs-cure.txt`). Base: 657 tests, 11 red. Cure: 658 tests (the guard, green), the SAME 11 red. None turned by the cure, so nothing was re-keyed. The 11, red at the base too and NOT this cure's: `generalStateProseDesk` (1), `worldFactRederive` (1), `powerStructure` F31 (1), `rosterFinalUnderHeldRoster` (1), `proseWiringCensus.walker` (5), `espionageDormancyFence` driven golden (1), `generatorGoldenMaster` (1). (Run in a git worktree of the base, so path-reading walkers may read the tree differently from the main checkout; the full check at the composed tip is the authority.)
- **Gates on the touched files:** eslint 0; `typecheck:ratchet` 0; `typecheck:domain:strict` 0.
- **Presumed-things door `--check`:** identical at the base and the cure: fresh 4 · stale 2 (the landing fixture's rows and
  `priorityHelpers.js`; none is this cure's). The expected stale row did NOT appear: the door's registers bank no row for the
  forges line; the only register that names it is the widened one, for its seat to re-measure.
- **The twelve-birth grid:** `page-census --grid`: 0 falls at the base, 0 at the cure (no rise).

## CURE 2 — WHAT WAS PROVEN HERE, FOR THE NEXT ROUND

- **The 720 births** (base `b5eaf5087` vs the patch applied): 9 of 720 moved; 1 family (`powerStructure.factions`), 13 leaves,
  all `desc` (`fd-c2.txt`). Exactly the hand-back's statement. Not done: the guard red/green, the sweep, the gates, the door, the grid.

## NAMED, NOT MINE

- In the same pressure draw, a drawn garrison row where nothing is admitted still falls back to itself (`?? drawn`) when its
  pool was not narrowed by the defence-word filter; the twin reaches only the forges row. Read from the code, not measured; named, not cured.
