# IN-FLIGHT AGENT PROGRESS — scanned 2026-09-08 13:29:39 (inflight-scan.py; every 120 s; the autosave seals this dir)

| sweep | role | angle / chunk | journal | urls fetched | files written | checkpoint | last activity |
|---|---|---|---|---:|---|---|---|
| ? | other |  | result | 0 | — | — | 12:27:49 |
| ? | other |  | result | 0 | — | — | 12:46:56 |
| ? | other |  | result | 0 | manifest.md | — | 12:27:01 |
| ? | other |  | result | 0 | — | — | 12:36:29 |

RECOVERY after a cutoff: for a finder whose journal says in-flight/failed and whose checkpoint is absent or complete=false, its urlsFetched list is the seed for the re-run (`mk-round.py … --inflight` folds it into the angle prompt as PRIOR PROGRESS); a verifier chunk without its verdict file simply re-runs (15 claims).
