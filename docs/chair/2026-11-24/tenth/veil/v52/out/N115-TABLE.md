# N115 (VEIL-52 (1)(c)), run 2026-11-24T22:32Z by run52.sh (q52.sh n115), CONFIRMED (executed)

Tip chain v28tpl (001..211 + the tip's 212) against master's own chain (db832c892, 001..203); the today-born stored 140 as public rows: 840 = 140 x {unmarked, default, hand} x Reveal off/on; 1 = the first document alone (hand, off). Timed: the hand marker, Reveal off, one read per document (840) or 30 reads of the one (1). Median ms. CAVEAT: the 1-row figure is ONE document, the 840 figure the 140 documents' median: the 840/1 ratios mix document size with row count; tip/master at equal rows are like for like.

```
tip 840 rc=0
tip 1 rc=0
master 840 rc=0
master 1 rc=0
door | tip 1 row | tip 840 | master 1 row | master 840 | tip/master at 840 | tip 840/1 | master 840/1   (median ms)
gallery | 109.02 | 4830.4 | 69.42 | 4661.55 | 1.04 | 44.3 | 67.1
link | 94.2 | 200.69 | 40.66 | 51.15 | 3.92 | 2.1 | 1.3
import | 100.86 | 218.24 | 64.5 | 79.08 | 2.76 | 2.2 | 1.2
map | 80.44 | 177.09 | 42.49 | 51.43 | 3.44 | 2.2 | 1.2
tip 1 public rows 1 missing [] empty {}
tip 840 public rows 840 missing [] empty {}
master 1 public rows 1 missing [] empty {}
master 840 public rows 840 missing [] empty {}
```

p90 and means: the per-side json files (/var/tmp/v52/out/n115/*.json, container-only), copied below.

tip-840: {"db":"v52t_tip_840","rows":"840","publicRows":840,"missingColumns":[],"empty":{},"doors":{"gallery":{"n":140,"median":4830.4,"p90":5124.49,"mean":4831.76},"link":{"n":140,"median":200.69,"p90":383.95,"mean":209.61},"import":{"n":140,"median":218.24,"p90":411.71,"mean":225.88},"map":{"n":140,"median":177.09,"p90":341.11,"mean":189.2}}}

tip-1: {"db":"v52t_tip_1","rows":"1","publicRows":1,"missingColumns":[],"empty":{},"doors":{"gallery":{"n":30,"median":109.02,"p90":138.83,"mean":113.73},"link":{"n":30,"median":94.2,"p90":122.97,"mean":98.7},"import":{"n":30,"median":100.86,"p90":118.93,"mean":103.89},"map":{"n":30,"median":80.44,"p90":99.64,"mean":83.92}}}

master-840: {"db":"v52t_master_840","rows":"840","publicRows":840,"missingColumns":[],"empty":{},"doors":{"gallery":{"n":140,"median":4661.55,"p90":4997.76,"mean":4709.18},"link":{"n":140,"median":51.15,"p90":93.52,"mean":53.78},"import":{"n":140,"median":79.08,"p90":141.79,"mean":83.76},"map":{"n":140,"median":51.43,"p90":90.46,"mean":54.21}}}

master-1: {"db":"v52t_master_1","rows":"1","publicRows":1,"missingColumns":[],"empty":{},"doors":{"gallery":{"n":30,"median":69.42,"p90":79.42,"mean":71.17},"link":{"n":30,"median":40.66,"p90":50.59,"mean":42.25},"import":{"n":30,"median":64.5,"p90":69.97,"mean":65.68},"map":{"n":30,"median":42.49,"p90":48.59,"mean":44.06}}}
