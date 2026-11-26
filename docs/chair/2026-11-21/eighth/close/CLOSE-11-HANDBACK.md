# CLOSE-11 — HAND-BACK (section 0 is the whole memory)

A seat of THE TENTH CHAIR (session_019yED1SUxGVHyjQnoqoFvQ8), successor of CLOSE-10, for POINT 119. Its law:
`docs/chair/2026-11-24/tenth/prompts/START-CLOSE-11.txt` on `lane/chair-2026-11-08`. No pull request, ever. Seated 16:07 UTC
2026-11-26.

## 0. WHERE THE SEAT STANDS — HANDED OVER (every unit pushed and handed in to the chair)

| unit | branch | tip | state |
|---|---|---|---|
| E13d-3 (G67) | lane/close-11-2026-11-26-e13d3-wip | 9e73a943a | handed in, ACCEPTED 17:01 |
| B1(i)c-2 (G67) | lane/close-11-2026-11-26-b1ic2-wip | 38e92b68e | handed in 18:06; gate: the line's 17 + C1, hookThemeDraws 2145->2144, A6 32->33 (named) |
| C4-SECOND-LINE gated (G49, G69) | lane/close-11-2026-11-26-c4second-wip | 40eec947a | handed in; line 8 reworded by the chair's (B); A0b over 19; shift register's 5 pins PREPARED, untouched (`close-11/c4/SHIFT-REGISTER-PREPARED.md`) |
| P9b-2 (G68) | lane/close-11-2026-11-26-p9b2-wip | cabb56d92 | handed in; gate: the line's 3 |
| VIABILITY-TRUE-2 (G68) | lane/close-11-2026-11-26-viability2-wip | ecb5b9853 | handed in; gate: the line's; OWED to the helper: the per-line false-print table by the rendered page (C, V small, soak) |
| B1(ii) | lane/close-11-2026-11-26-b1ii-wip | e809f2a2e | NOT MINE (chair 18:07): coded, unproven, for the chair's builder |

MERGE ORDER (each hand-in's note): C4-SECOND-LINE, then VIABILITY-TRUE-2, then `npm run gen:dossier-prose` ONCE, the wiring
census and the observed-shape --write by their doors; P9b-2 and VIABILITY-TRUE-2 share dossierViewModel.js (keep both
end-of-file imports); the lighting census by its door at the join. The sameness register is NOT re-taken.

THE DEAREST READING FOR THE LEAST: `docs/OPERATING_STANDARD.md` (36 KB, nearly all seats, batching and the chair's
tooling; for a close seat only rule 1 and §6 bind, and CLAUDE.md and COMMON-RULES carry both).

LESSONS THAT COST TOKENS: (1) never swap a file in a tree whose run is queued: red-firsts at base run in a detached copy
(`git worktree add --detach`), test copied in; (2) `gate-mutex.sh --run` gives up after 40 polls (exit 3): wrap every
queued run in a retry (`run-gate.sh`); (3) a measure file outside the tree cannot import bare modules: copy it into the
scratch tree; (4) `pkill -f <log name>` also kills a monitor whose script names that log.
