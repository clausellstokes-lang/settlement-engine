# CURE-NINE report (DEPTH-5 builder, 2026-11-22): PARTIAL, stopped by the coordinator (the program is parked)

Reds 2 to 8 were each shown red at the base ebb1e264c (one run, `5 failed`, `7 failed | 24 passed (31)`) and are green at
f4b4d3d98. The whole `tests/lint` run was stopped by the coordinator's STOP before it finished, so this report has no count
line for it.

| red | failing title at the base (from the log) | at the tip |
|---|---|---|
| 2 | declaredLineShape > every declared line the declaring modules export carries a string or function text (baseline zero, only shrinks) (`src/data/powerSiblings.js.QUARREL_POOLS.GRAZING.1 :: null`) | green |
| 3 | drawDeclaredKeys > every caller passes a key (`quarrelPick.js#71`) | green |
| 4 | drawDeclaredKeys > a generator-time key leads with the stream seed or names the settlement; ... | green |
| 5 | moduleScopeCwdRatchet > A4 — NO GUARDED DIRECTORY CARRIES MORE MODULE-SCOPE WORKING-DIRECTORY ROOTS THAN BANKED (19 of 17) | green (17; the ceiling was not raised) |
| 6 | mutationCoverageManifest > TOTALITY: every enumerated invariant file has a manifest entry | green (10 passed) |
| 7 | seedLoopTotality > no NEW bare seed loop anywhere in the test corpus | green |
| 8 | seedLoopTotality > the generation-facing quarantine is EXACT | green |

**How each was cured.** Red 2: GRAZING[1] is now `FIELD_ROTATION_SLOT` (`{ id, needs }` and no text) in the same place.
`pickQuarrel` composes GRAZING at its call, with the site's `FIELD_ROTATION_QUARREL` in the slot. The pool order, every id
and needs, and the admitted list are unchanged. Reds 3-4: the key is now passed as `key: seedKey`, with the same value. Red
5: both walkers use the TOOL-31 root. Red 6: sweep plant #143 for the quarrel pick (measured: clean 9 passed; planted 1 red,
title (h) once; restored with cp and checked identical with cmp), and the subject-coupled ref for depthHooksAppended
(its plant target, npcData.js, is the sibling's file). Reds 7-8: the three loops collect what each seed shows and assert
once after the loop. No claim or seed was dropped.

**Generator tests at the tip:** conflictQuarrelPick 9/9 and depthHooksAppended both green. powerStructure F31 is RED on
`relationshipArchetypes.js: 1 packed lines`. That file is untouched since the base and outside my manifest, so this red is
not mine.

**Whole-lint partial reds seen before the stop:** `styleLaw.walker` (known, the sibling's), and `chainPrintSites.walker`
"the roots are every top-level directory of code". The likely cause of the second is my own untracked `.cure-logs/qp-copy.js`,
which I have now removed from the worktree. This is not verified.

**Not done:** the whole `tests/lint` count line. **Next step:** reclaim the stale mutex lock left by the stopped run (dead
PID 14534; `--run` reclaims it), then run `tests/lint` whole and confirm that chainPrintSites is green.

Commits: 5c9ea5047 (red 5), 08616b323 (reds 2-4, 7-8), f4b4d3d98 (red 6).
