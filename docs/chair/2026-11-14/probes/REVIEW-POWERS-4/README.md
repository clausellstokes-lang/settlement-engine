# REVIEW-POWERS-4 probes

Run from OUTSIDE every repository tree (copy out with `git archive`). Each probe reads corpora written by CENSUS-2's
`births.mjs` (`lane/census-2-2026-11-13`, `docs/chair/2026-11-13/probes/CENSUS-2/`) and dumps written by its `census2.sh`.

- `seedcfg.mjs`: CENSUS-2's `seedcfg.mjs` plus two prefixes, `r4-` (the app's own shape, as `rww-`) and `r4g-` (the same under `contentProfile: 'grim'`). To use it, copy CENSUS-2's directory and replace its `seedcfg.mjs` with this one.
- `seeds.x.txt` (648: the earlier reader's 360 `rww-` plus `seeds.r4.txt`, 288) and `seeds.war.txt` (180 wartime, records only).
- The four corpora: the 720 and the 648, each at 96a6ced46 (base), a5402c006 (the lane's pre-merge tip) and 3909655c3 (tip). Only the tip's are rendered.
- `lines4.mjs`: step 1's line classes, read where they print (`TREE= CORPUS= BCORPUS= DUMPS= OUT=`).
- `rungdiff4.mjs`, `rungfalse4.mjs`, `twins4.mjs`: the claim rungs placed, read against the final roster; the ladders' native twins (`BASE= TIP=`).
- `supply4.mjs`: the SUPPLY goals' chain status, crisis and house fill. `goalmove4.mjs`: every goal move classed by cause.
- `exports4.mjs`: the PDF view model and the Foundry journal for every town.
- `fielddiff.mjs`: the earlier reader's REVIEW-POWERS-3 field diff, unchanged.
- `plants4.py`: step 4's plants (run in a detached tip worktree used for nothing else).
- `results/`: the outputs (`*.tip.*` at 3909655c3; `lines720.mid.json` at a5402c006 against the base; `fd.base-mid` = lane-only, `fd.mid-tip` = the merge).
- `claims4.mjs`: the statement's headline counts at one tree (`TREE= CORPUS=`). `redclass4.mjs`: the named files' reds at the tip, the base and the line, classed.
- `results/redclass4.txt`, `results/class.rerun.txt` (the two load timeouts, green alone), `results/plants*.summary.txt`, `results/c2.counts.{base,mid,tip}.txt`.
