# IN-FLIGHT AGENT PROGRESS — scanned 2026-09-08 08:09:27 (inflight-scan.py; every 120 s; the autosave seals this dir)

| sweep | role | angle / chunk | journal | urls fetched | files written | checkpoint | last activity |
|---|---|---|---|---:|---|---|---|
| ? | other |  | in-flight | 0 | — | — | 12:08:59 |
| ? | other |  | in-flight | 0 | — | — | 12:09:24 |
| ? | other |  | in-flight | 0 | — | — | 12:09:21 |

RECOVERY after a cutoff: for a finder whose journal says in-flight/failed and whose checkpoint is absent or complete=false, its urlsFetched list is the seed for the re-run (`mk-round.py … --inflight` folds it into the angle prompt as PRIOR PROGRESS); a verifier chunk without its verdict file simply re-runs (15 claims).
