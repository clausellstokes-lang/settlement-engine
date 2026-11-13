# REVIEW-W2-FIX-DATA — status at the chair's STOP AND SAVE (2026-11-13)

**FINISHED.** The verdict is NOT CLEAR: `docs/chair/2026-11-13/REVIEW-W2-FIX-DATA-4114cf5a6-2026-11-13.md`.
No render or census was in flight at the stop.

## The brief (copied here, because the brief itself is not on the branch)
- **Lane read:** lane/w2-fix-data-2026-11-13, base 31f57e8eb, tip 4114cf5a6.
- **Hand-back:** docs/chair/2026-11-13/W2-FIX-DATA-HANDBACK.md at 4114cf5a6.
- **Rules:** scratch worktrees only; commit only the review file and probes under docs/chair/2026-11-13/; plain push; read gates through `sh scripts/gate-tail.sh`; query by script.
- **Fixture:** origin lane/review-w2b-2026-11-13 :: docs/chair/2026-11-13/REVIEW-W2B-COLD-LIST.json.
- **Census instrument:** origin lane/second-wave-census-2026-11-12 :: docs/chair/2026-11-12/probes/SECOND-WAVE-CENSUS/.

## Steps
| step | state | where |
|---|---|---|
| 1. Own cold list: 20 fresh towns, all six sizes, siege and famine, committed BEFORE the hand-back was read | DONE | REVIEW-W2-FIX-DATA-COLD-LIST.json (fdb5331eb); towns in mine-towns.json (all 20 read) |
| 2.1 The 56 rows called cured, on the fixture towns | DONE | verdict, "The seat's claims" + F1 |
| 2.2 New words: the twins and rewords, on births the seat did not use | DONE | newwords.mjs over 1800 rvx births |
| 2.3 No true line lost on the fixture towns | DONE | verdict |
| 2.4 Census, base against tip | DONE | the census run matches the seat; pattern 10 17→0 |
| 2.5 The seat's own calls (watch gate twins, guard captain, re-keyed pins) | DONE | captain.mjs, defencepin.mjs |
| 2.6 A plant of my own | DONE | verdict (4 plants; materializeCulturalIdentity drops its declaration) |
| 2.7 One cured line checked on every surface | DONE | "separate quarters": page, PDF, Foundry, world exports |
| 2.8 The WAITING rows | DONE | F3 (open-cast mine is cheaper to cure than the seat claims) |
| Verdict and message to the chair | DONE | 0f1253c86 |
| Owed, NOT STARTED | — | the worker byte ceiling (needs a production build); the F1 fix's whole-suite effect (`npx vitest run` with the one-line fix in F1-FIX-NOTE.txt applied) |

## Re-running the probes
- **Corpora:**
  - census 720: `sh census.sh <tree> <out>` (the census instrument).
  - fresh 1800: `TREE=<tree> OUT=<dir> N=1800 node births.mjs`.
- **Town render:** `TREE=<tree> OUT=<dir> LIST=<towns.json> node render.mjs`.
- **F1:**
  - `node granary.mjs <corpus.ndjson.gz>` and `node siegedesc.mjs <corpus.ndjson.gz>`: twin firings, app shape.
  - `TREE=<tree> CORPUS=<corpus> node selfcheck.mjs`: declared lines the final record refuses.
