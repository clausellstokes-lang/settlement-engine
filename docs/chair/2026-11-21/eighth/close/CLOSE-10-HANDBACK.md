# CLOSE-10 — HAND-BACK (section 0 is the whole memory)

A seat of THE TENTH CHAIR (session_019yED1SUxGVHyjQnoqoFvQ8), successor of CLOSE-9, for POINT 119. Its law:
`docs/chair/2026-11-24/tenth/prompts/START-CLOSE-10.txt` on `lane/chair-2026-11-08`. No pull request, ever.

## 0. WHERE THE SEAT STANDS (kept current at every push)

Base: the line `lane/join-2026-11-14` at POINT 118, 9d22f040e. Every unit is a branch cut there, in its own worktree
(`/home/user/wt-<unit>`, node_modules symlinked; `/node_modules` and `/.husky/_` in the clone's `info/exclude`).

| unit | branch | tip | state |
|---|---|---|---|
| B1(i)c (G60) | lane/close-10-2026-11-26-b1ic-wip | 19a5855f3 | built; gates running; not yet pushed |
| E13d-2 + SAMENESS-KEYS | lane/close-10-2026-11-26-e13d2-wip | 245ded883 | PUSHED, HANDED IN |
| P9b (G48) | lane/close-10-2026-11-26-p9b-wip | 12c77ae3f | built; 175 V texts byte-equal, V records 0 moved; gate queued |
| C4-SECOND-LINE (G49) | lane/close-10-2026-11-26-c4second-wip | 3647bae53 | line 8 written and projected; header measure (soak, C, V) running |
| VIABILITY-TRUE (G53) | — | — | measure message owed first |
| D13 STABLE-PICKS | — | — | measure + design, two messages, build nothing |
| B1(ii) REDESIGNED | — | — | design message first |

Tools (session scratchpad, lost with the container; their sources are on origin): CLOSE-8's births harness
(`origin/lane/close-8-2026-11-25:docs/chair/2026-11-21/eighth/close/close-8/proof/tools/birth-1/`: births.mjs, make-plan.mjs
for C, make-visitor-plan.mjs + the chair's `tenth/read/plan-lit.json` for V); the soak plan from
`scripts/audit/soak-review/corpus.mjs :: cellFor(i)`; the page text of any plan (web, three PDFs, session sheet):
`node scripts/sameness-census.mjs --measure --plan=<plan.json> --text --out=<dir>`.

Rulings in force for this seat: G60 (B1(i)c as P1, entrepot routes read from deriveIsEntrepot's home); E13d-2 reading
accepted 12:22 UTC with the title-table arm (asked: a third exception, a row keyed by its title).

CORRECTION owed and told: 3ad7acaa0's message says 2,655 files; the guard reads 2,659.

Next step: B1(i)c's gates and push and hand-in; P9b's proof; C4's proof; VIABILITY-TRUE's measure.
