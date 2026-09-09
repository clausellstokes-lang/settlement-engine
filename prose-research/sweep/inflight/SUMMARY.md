# IN-FLIGHT AGENT PROGRESS — scanned 2026-09-09 10:40:57 (inflight-scan.py; every 120 s; the autosave seals this dir)

| sweep | role | angle / chunk | journal | urls fetched | files written | checkpoint | last activity |
|---|---|---|---|---:|---|---|---|
| ? | other |  | result | 0 | — | — | 11:49:05 |
| ? | other |  | result | 0 | fences-registers-receipt.md | — | 11:47:17 |
| ? | other |  | result | 0 | — | — | 11:56:04 |
| ? | other |  | result | 0 | instruments-and-gate.md | — | 11:46:59 |

RECOVERY after a cutoff: for a finder whose journal says in-flight/failed and whose checkpoint is absent or complete=false, its urlsFetched list is the seed for the re-run (`mk-round.py … --inflight` folds it into the angle prompt as PRIOR PROGRESS); a verifier chunk without its verdict file simply re-runs (15 claims).
