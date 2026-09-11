# IN-FLIGHT AGENT PROGRESS — scanned 2026-09-11 05:31:32 (inflight-scan.py; every 120 s; the autosave seals this dir)

| sweep | role | angle / chunk | journal | urls fetched | files written | checkpoint | last activity |
|---|---|---|---|---:|---|---|---|
| ? | other |  | in-flight | 0 | — | — | 09:28:55 |
| ? | other |  | in-flight | 0 | — | — | 09:28:08 |
| ? | other |  | in-flight | 0 | — | — | 09:28:32 |
| ? | other |  | in-flight | 0 | — | — | 09:30:00 |
| ? | other |  | in-flight | 0 | — | — | 09:29:37 |
| ? | other |  | in-flight | 0 | — | — | 09:26:54 |
| ? | other |  | in-flight | 0 | _partA.md, _partB.md | — | 09:29:53 |
| ? | other |  | result | 0 | — | — | 09:30:09 |
| ? | other |  | in-flight | 0 | — | — | 09:26:09 |
| ? | other |  | in-flight | 0 | — | — | 09:31:16 |
| ? | other |  | in-flight | 0 | — | — | 09:31:31 |
| ? | other |  | in-flight | 0 | — | — | 09:30:56 |
| ? | other |  | result | 0 | — | — | 09:24:54 |

RECOVERY after a cutoff: for a finder whose journal says in-flight/failed and whose checkpoint is absent or complete=false, its urlsFetched list is the seed for the re-run (`mk-round.py … --inflight` folds it into the angle prompt as PRIOR PROGRESS); a verifier chunk without its verdict file simply re-runs (15 claims).
