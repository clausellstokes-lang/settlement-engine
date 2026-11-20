# BUILD-1-FINISH — finish PROSE-1's BUILD-1 from its pushed -wip branch (PROSE-2's builder brief)

Written by PROSE-2, 2026-11-20, on the chair's order of 18:34 UTC. PROSE-1's BUILD-1 builder did not return; its work is pushed UNREAD as `lane/prose-1-build-1-2026-11-20-wip` at 400b9978b (three commits on 87f03395b: eb33b8f71 step 1, the verdict applied to the two line files; 0f86cd1e4 step 2, the source rows + `gen:dossier-prose` + the WORD_CORRECTIONS row; 400b9978b step 3, the faith teaser's licence line). Its gates, measure and confinement are NOT shown. You finish it.

## WHERE YOU WORK
Your own worktree; `git fetch origin lane/prose-1-build-1-2026-11-20-wip lane/prose-2-2026-11-20`; check out a NEW branch `lane/prose-2-2026-11-20-build1` AT 400b9978b (you continue its commits; you never rewrite them). `npm ci` first (dependencies AND hooks). Commit by explicit paths with the hooks; never push; never `--no-verify`; never a pull request; never the whole suite. Use your worktree's own absolute path in every command. Read `CLAUDE.md` first.

## READ WHOLE, IN THIS ORDER
`docs/chair/2026-11-20/content/prose/briefs/BUILD-1.md` (it binds you: its steps 2 to 5, RED FIRST, REPORT) · `briefs/BUILD-1-VERDICT.md` (the chair's verdict) · `PROSE-1-HANDBACK.md` rulings 9, 12, 13, 16, 17 (on `lane/prose-1-2026-11-20` at adc8b5251: `git show adc8b5251:docs/chair/2026-11-20/content/prose/PROSE-1-HANDBACK.md`).

## FIRST: CHECK WHAT IS THERE (before any new work)
1. Steps 1 to 3 as committed: read `git diff 87f03395b..400b9978b --stat` and confirm the paths are ONLY: the two line files, `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` (APPENDED rows plus the one DS-POW-2 #1 reword of ruling 13), the six `src/data/dossierStateProse/*.generated.js`, the WORD_CORRECTIONS row in `scripts/generate-dossier-state-prose.mjs`, ONE line in `tests/lint/faithTeaserLicence.test.js`. Anything else: STOP and report it.
2. The verdict's every change is present in the source rows (the noun rule: `grep -n -i town` over the NEW rows only, 0; the dm-only marks of ruling 9(2) on every new line of file 1 pool 7 and file 2 pools 4, 17, 20; the rewordings). List each verdict item: present / missing. A missing item is applied in a NEW commit, in the line file and the source row together, then the door re-run.
3. `npm run gen:dossier-prose -- --check` passes at the tip.

## THEN, BY BUILD-1.md
Step 3 (the corpus's own gates), step 4 (the measure), step 5 (the confinement), RED FIRST, REPORT, with these changes:
- THE MEASURE: `map/run-map.sh` hard-codes `ROOT=/home/user/settlement-engine`: run a SCRATCH COPY with ROOT set to YOUR worktree (never edit the committed one), print the ROOT and `git rev-parse HEAD` at the head of each measure's output (ruling 16: a before-and-after without both is not accepted). **150 places a size** (`draws` mode, prefix `hxd`, n = 150, six sizes), at the BASE (87f03395b, in a second scratch worktree of yours) and at your tip. `rank-reach.mjs` on each into `map/RANK-REACH-BUILD1-BEFORE.md` and `-AFTER.md` (if it hard-codes 50 places a size, pass or patch a SCRATCH copy, never the committed one, and say so). THE BAR: a sentence's share over ALL places of a size, about 15% (to 20% passes).
- HEAVY RUNS (`tests/lint` whole, the 150-a-size measure) go one at a time through `sh scripts/gate-mutex.sh --run -- <command>` (another builder shares this machine).
- A red that is the line's own known figure (e.g. `generationForkCensus` A1) is shown red at the base by name, never cured.

## ALSO OWED (measure only, into the same report)
THE COUNT OF EXISTING LINES THAT SAY "TOWN" (the chair's ruling of 17:28, item 1): in the six generated files at the tip, every EXISTING (not new) wording that contains "town" or "town's" as the settlement's noun (not "townsfolk"/"downtown"/a proper name: say how you excluded them), and for each, the sizes at which it is ELIGIBLE (from the measure's draws: the sizes where any place had it in its eligible set) and how many places drew it at the non-town sizes (thorp, hamlet, village, city, metropolis). A table: block · pool · vid · the line · non-town sizes eligible · places drawn at non-town sizes. Change NONE of them.

## REPORT
`docs/chair/2026-11-20/content/prose/BUILD-1-REPORT.md` as BUILD-1.md's REPORT, plus FIRST's three checks and the "town" table. Final message at most 200 words: your branch and tip, every gate's count line and exit, pools over the bar before and after (with ROOT and commit printed), the confinement count, the "town" count, executed vs inferred.
