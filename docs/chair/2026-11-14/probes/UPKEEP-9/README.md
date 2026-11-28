# UPKEEP-9's probes (2026-11-14)

- `birthgz.mjs`: `TREE=<tree> node birthgz.mjs <seeds> <out.ndjson.gz>`: the lane's 1,490 (UPKEEP-8's `seeds.all.txt`, its `cfgFor`), whole records, gzipped.
- `fdgz.mjs`: UPKEEP-8's `fielddiff.mjs` over two gzipped corpora: `node fdgz.mjs a.gz b.gz [examples]`.
- `m7.mjs`: step 7's measures on a gzipped corpus (#1082's gang flag, #598's court flag, viability.js's machinery, the isolation note, #869's band under a siege). `m7-33acecd6d.json`: at the merge.
- `vfind.mjs`, `vroster.mjs`: births with one dial at its extreme (`v9-<dial>-<size>-<crisis|calm>-<i>`), to find where each viability row prints, and the magic houses on their rosters.
- `court598.mjs`, `court598b.mjs`: over a CENSUS-2 output directory, every rendered line naming a court in towns whose court flag stands with no courthouse. `court598-33acecd6d.json`: at the merge.
- `census2-seedcfg-v9.mjs`: CENSUS-2's `seedcfg.mjs` (lane/census-2-2026-11-13) with the v9 shapes added; copy it over a scratch copy of that probe to render v9 seeds. `read-via.seeds`: the towns the viability rows were read in.
