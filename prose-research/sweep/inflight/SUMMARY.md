# IN-FLIGHT AGENT PROGRESS — scanned 2026-09-08 19:03:46 (inflight-scan.py; every 120 s; the autosave seals this dir)

| sweep | role | angle / chunk | journal | urls fetched | files written | checkpoint | last activity |
|---|---|---|---|---:|---|---|---|
| ? | other |  | result | 0 | — | — | 22:20:21 |
| ? | other |  | result | 0 | — | — | 22:24:50 |
| ? | other |  | result | 0 | FOLD.md | — | 22:39:03 |
| ? | other |  | result | 0 | seam.md | — | 22:17:35 |

RECOVERY after a cutoff: for a finder whose journal says in-flight/failed and whose checkpoint is absent or complete=false, its urlsFetched list is the seed for the re-run (`mk-round.py … --inflight` folds it into the angle prompt as PRIOR PROGRESS); a verifier chunk without its verdict file simply re-runs (15 claims).
