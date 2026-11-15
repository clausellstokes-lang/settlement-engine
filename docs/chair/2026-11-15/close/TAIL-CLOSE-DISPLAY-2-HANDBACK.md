# TAIL-CLOSE-DISPLAY-2 — hand-back (current at each push)

Branch `lane/tail-close-display-2026-11-15`, succeeding TAIL-CLOSE-DISPLAY-1 at 71ac99969. First act: the joined line
merged at ae50369d4 (70f7635c, clean); the line moved to ceeaeec8 (it touches red 9's file), merged again (6f39cb2a,
clean). Work in a scratch clone with its own `npm ci`. Every red run alone at the merged tree first: all nine red.
Bisect: each file over the joined line's first parent from d817736d8 (green there for reds 1-8; red 9's file joins the
line at fp 55, 412938baf), the version of the test file each point holds; docs-only points skipped.

## The nine

| red | file | turned at | verdict |
| --- | --- | --- | --- |
| 6 | incomeRowsBorneOut.test.js (1) | fp 23, 390168d6b (JOIN-7 · 26, lane/tail-defecon-c at ea788e17c): TAIL-DEFECON-C-2's D25 pin (28f86423, anchor "Agricultural Rents" in r2r-thorp-24) met TAIL-DEFECON-2's DECLARED move D10 (df2fa5ca, already on the line at fp 21: the rents row is titled "Harvest" where no lord's steward or reeve stands) | RE-KEYED by identity: the same town, the same row under its D10 title ("Harvest") |
