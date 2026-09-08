# IN-FLIGHT AGENT PROGRESS — scanned 2026-09-08 18:01:44 (inflight-scan.py; every 120 s; the autosave seals this dir)

| sweep | role | angle / chunk | journal | urls fetched | files written | checkpoint | last activity |
|---|---|---|---|---:|---|---|---|
| ? | other |  | in-flight | 0 | — | — | 22:01:42 |
| ? | other |  | in-flight | 0 | — | — | 22:01:41 |
| ? | other |  | in-flight | 0 | — | — | 22:01:43 |

RECOVERY after a cutoff: for a finder whose journal says in-flight/failed and whose checkpoint is absent or complete=false, its urlsFetched list is the seed for the re-run (`mk-round.py … --inflight` folds it into the angle prompt as PRIOR PROGRESS); a verifier chunk without its verdict file simply re-runs (15 claims).
