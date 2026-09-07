# IN-FLIGHT AGENT PROGRESS — scanned 2026-09-07 11:03:30 (inflight-scan.py; every 120 s; the autosave seals this dir)

| sweep | role | angle / chunk | journal | urls fetched | files written | checkpoint | last activity |
|---|---|---|---|---:|---|---|---|
| ai | verifier | i1214-1239 | in-flight | 2 | — | verdict file absent | 11:54:36 |
| ai | verifier | i1240-1270 | in-flight | 7 | — | verdict file absent | 11:54:36 |
| ai | verifier | i1271-1298 | in-flight | 5 | — | verdict file absent | 11:54:36 |
| ai | verifier | i1299-1315 | in-flight | 2 | — | verdict file absent | 11:54:36 |
| dnd | critic |  | failed | 0 | — | — | 09:05:59 |
| dnd | regrade | regrade-r13 | result | 0 | — | — | 08:47:59 |
| dnd | synth |  | failed | 0 | _r13-apply.mjs, dnd-coverage.mjs, dnd-stats.mjs | — | 09:05:58 |
| dnd | verifier | i819-823 | result | 1 | verdicts-dnd-i819-823.json | verdict file WRITTEN | 08:39:30 |
| leguin | verifier | i384-536 | in-flight | 6 | — | verdict file absent | 11:54:36 |
| leguin | verifier | i542-616 | in-flight | 13 | — | verdict file absent | 11:54:36 |
| leguin | verifier | i618-693 | in-flight | 2 | — | verdict file absent | 11:54:36 |
| leguin | verifier | i694-849 | in-flight | 6 | — | verdict file absent | 11:54:36 |
| ? | other |  | in-flight | 0 | — | — | 15:03:20 |
| ? | other |  | in-flight | 0 | — | — | 15:03:21 |
| ? | other |  | in-flight | 0 | — | — | 15:03:14 |
| ? | other |  | in-flight | 0 | — | — | 15:03:10 |
| ? | other |  | in-flight | 0 | — | — | 15:03:21 |
| ? | other |  | in-flight | 0 | — | — | 15:03:26 |
| ? | other |  | in-flight | 0 | — | — | 15:03:20 |
| ? | other |  | in-flight | 0 | — | — | 15:03:29 |
| ? | other |  | in-flight | 0 | — | — | 15:03:29 |
| ? | other |  | in-flight | 0 | — | — | 14:27:52 |
| ? | other |  | result | 0 | reconcile-dossier-archivist.md | — | 14:10:11 |
| ? | other |  | in-flight | 0 | — | — | 14:27:45 |
| ? | other |  | result | 0 | — | — | 14:14:25 |
| ? | other |  | in-flight | 0 | — | — | 14:26:49 |
| ? | other |  | result | 0 | reconcile-npc-ladder.md | — | 14:16:27 |
| ? | other |  | in-flight | 0 | — | — | 13:53:19 |
| ? | other |  | in-flight | 0 | — | — | 13:53:19 |
| ? | other |  | in-flight | 0 | — | — | 13:53:19 |
| ? | other |  | result | 0 | — | — | 12:10:50 |
| ? | other |  | result | 0 | — | — | 12:39:01 |
| ? | other |  | result | 0 | best-ai.md | — | 12:53:34 |
| ? | other |  | result | 0 | best-leguin.md | — | 12:22:45 |
| ? | other |  | result | 0 | EXEMPLAR-BEST-PARTS.md | — | 13:39:01 |
| ? | other |  | result | 0 | — | — | 12:24:43 |
| ? | other |  | result | 0 | — | — | 12:38:09 |
| ? | other |  | result | 0 | — | — | 12:54:49 |
| ? | other |  | result | 0 | best-martin.md | — | 12:08:17 |
| ? | other |  | result | 0 | best-own.md | — | 13:08:59 |

RECOVERY after a cutoff: for a finder whose journal says in-flight/failed and whose checkpoint is absent or complete=false, its urlsFetched list is the seed for the re-run (`mk-round.py … --inflight` folds it into the angle prompt as PRIOR PROGRESS); a verifier chunk without its verdict file simply re-runs (15 claims).
