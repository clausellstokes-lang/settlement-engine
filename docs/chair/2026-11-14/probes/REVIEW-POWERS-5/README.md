# REVIEW-POWERS-5 probes

Run from OUTSIDE every repository tree (copy out with `git archive`). The corpora are written by CENSUS-2's `births.mjs`
and `census2.sh` (`lane/census-2-2026-11-13`, `docs/chair/2026-11-13/probes/CENSUS-2/`), with its `seedcfg.mjs` replaced by
the one here (REVIEW-POWERS-4's, its `r4` prefix widened to `r[45]`: `r5-` is the app's own shape, as `rww-`).

- Seeds: the census's 720 (CENSUS-2 `seeds.txt`); `seeds.own.txt` (996: REVIEW-POWERS-4's `seeds.x.txt`, 648, and `seeds.r5.txt`, 348); `seeds.ownrender.txt` (the 271 of them rendered).
- Trees: detached worktrees at 3909655c3 (base) and 0ea65f574 (tip); `npm ci --ignore-scripts` in the tip, its `node_modules` linked into the base (the lockfile is equal).
- `lines5.mjs` (`TREE= BTREE= CORPUS= BCORPUS= [DUMPS=] OUT=`): every line class of step 1, in every town, with the record's facts and the base's line.
- `summ5.mjs <lines json>...`: the counts step 1 quotes. `roster12.mjs <corpus>...` (`TREE=`): the conflict lines that name what the town lacks. `hall0.mjs` (`TREE= CORPUS=`): where the none rung's first line still prints.
- `fd5.mjs` (`BASE= TIP= OUT=`): the whole-record field diff, every leaf path.
- `pdf5.test.jsx` + `vitest.pdf5.config.mjs` (run from the tip tree: `CORPUS= OUTF= npx vitest run --config <here>/vitest.pdf5.config.mjs`; the paths inside name `/tmp/rp5/tip`): the PDF's Power chapter built for every town, its text leaves read.
- `results/`: `lines720.tip.json.gz` (the 720, with the dumps), `linesown.records.json.gz` (the 996, records), `linesownR.tip.json.gz` (the 271, with the dumps), `summ.records.json`, `fd.720.json`, `fd.own.json`, `pdf5.720.json`, `c2.counts.tip720.txt` (CENSUS-2's counts at the tip).
