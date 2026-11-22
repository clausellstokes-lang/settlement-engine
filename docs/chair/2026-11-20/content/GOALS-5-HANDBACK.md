# GOALS-5 · the hand-back (kept current at every push)

Seat: GOALS-5, a seat of the eighth chair (session_01ACmDYY29VRchM87v1yhL9Q). Orders: `docs/chair/2026-11-21/eighth/prompts/GOALS-5.txt` (from 9d7a3c1dd) and `COMMON-EIGHTH.txt` on `lane/chair-2026-11-08`; COMMON-RULES.txt binds where they are silent. The lane's ONE list of rulings is GOALS-4-HANDBACK.md's "Every ruling in force" (1 to 16), plus the rulings added below.

## WHERE THE LANE STANDS

PARKED at 09:1x UTC on 2026-11-22 by the chair's order (the owner's six-seat limit). Nothing merged by this seat; no builder started.
- DONE AND PROVEN: `lane/goals-5-2026-11-22` cut at 825ed351f (GOALS-4's tip, verified equal to origin); `npm ci`; a fresh `npm run build` at 825ed351f (exit 0); a trial merge of the line at 2486d1301 (scratch worktree, not committed): NO code conflict, only `scripts/.writer-reach-baseline.json` and `tests/lint/.lighting-census-baseline.json` (the line's side, then each by its door).
- STOPPED IN THE AIR: unit 1's ONE run (`VERIFY_DIST=1`, `tests/generators tests/data tests/lint tests/build`) at 393 of 813 files; killed, its partial log kept in this seat's scratch (`unit1-run.PARTIAL-393of813.log`; the JSON writes only at the end, so none). 13 files red so far: `tests/build` vendorPdfLazy (4: first paint x3, engine chunk), generationWorkerLazy (1: the worker ceiling), engineBundleReplay (3), engineServiceStoreParity (4); `tests/generators` pipelinePinnedMode (3), generationForkCensus (A1), powerEconomyFreshness, pipelinePinnedChoosers, x46NpcBand, institutionBudgetPromise, rosterFinalUnderHeldRoster, nameHeldThroughAssembly (1 each: golden/digest identity rows); `tests/lint` mutationCoverageManifest (TOTALITY). NOT YET READ against the list.
- NOT STARTED: the arm (u) knock-on probe (written, `zzArmUKnockOn.probe.test.js` in the scratch worktree `/home/user/wt-measure`, never committed).
- NEXT STEP on "GO GOALS-5": re-run unit 1's one run whole (the mutex's stale lock from dead PID 899 is reclaimed by `--run`), read every row by name against the point-96 `ci/RED-AT-LINE.tsv`, then the probe.
- Count: about 115,000 tokens (own estimate).

## Rulings added for this seat

- E54 (in GOALS-5.txt): TIES-HOLD lands as built, the 266 named by size in "WANTS"; arm (u) holds the fixture the line holds (the first lane to land brings its change, the second re-states its movers); the re-pointed fixture d8b174237 lands only with the "held-text knock-on" class narrowed, as the chair rules after the measure.

## Readers of `goal.intent.target` outside the card (unit 3; first read at 825ed351f, by grep of `src/`)

- `src/domain/factionRename.js` :: the rename rows on `goal.intent.short.target` / `goal.intent.long.target` (kind `power`: the id is re-keyed when a faction is renamed).
- `src/domain/institutionRename.js` :: the rename rows on the same two parents (kind `house`: `removal: 'delete-key'`).
- `src/generators/people/goals.js` :: the post-pass (`intentAt`, `intentOf`): the card's own writer.
- Not readers of the target: `src/lib/structuralFingerprint.js` (reads `intent[v].family` only); `src/domain/npc/npcFacetContract.js` (the `key`).
- The edge bundles under `supabase/functions/_shared/` carry copies; they are the chair's at the close.
