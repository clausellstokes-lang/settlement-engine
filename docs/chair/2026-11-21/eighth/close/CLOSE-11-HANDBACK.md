# CLOSE-11 — HAND-BACK (section 0 is the whole memory)

A seat of THE TENTH CHAIR (session_019yED1SUxGVHyjQnoqoFvQ8), successor of CLOSE-10, for POINT 119. Its law:
`docs/chair/2026-11-24/tenth/prompts/START-CLOSE-11.txt` on `lane/chair-2026-11-08`. No pull request, ever. Seated 16:07 UTC
2026-11-26.

## 0. WHERE THE SEAT STANDS

Base: the line `lane/join-2026-11-14` at POINT 118, 9d22f040e. Each unit in its own worktree (`/home/user/wt-<unit>`,
node_modules symlinked; `/node_modules` and `/.husky/_` in the clone's `info/exclude`), pushed from that worktree.

### 0.1 The units

| unit | branch | tip | state |
|---|---|---|---|
| (1) B1(i)c-2 (G67) | lane/close-11-2026-11-26-b1ic2-wip | 38e92b68e (on CLOSE-10's 19a5855f3) | built, red 5 then 30/30; dirs gate queued |
| (2) E13d-3 (G67) | lane/close-11-2026-11-26-e13d3-wip | 9e73a943a (on CLOSE-10's 559fcc0d1) | built; typechecks green; tests/lint whole running |
| (3) C4-SECOND-LINE (G49) | lane/close-11-2026-11-26-c4second-wip | (uncommitted in /home/user/wt-c4s) | line 8 appended and projected; red-first and measure running |
| (4) B1(ii) (G64) | — | — | not started |
| (5) cures of P9b / VIABILITY-TRUE | — | — | wait for the chair's rulings |
| (6) THE JOIN | — | — | when the chair says |

**(1) B1(i)c-2.** `LAND_GIVERS.furs.routes: ['port']`; comments in geographyData.js and the catalogue row corrected, the
port residual named. Measured (V and soak city+metro, 632; 120 desert ports forced, `dpp-<size>-<i>` = V's config +
`terrainOverride: 'desert'`, `tradeRouteAccess: 'port'`): every desert port prints isEntrepot (soak 9/9, forced 120/120);
desert ports byte-equal to the line 129/129; everything else byte-equal to 19a5855f3 623/623; moved vs the line V 10,
soak 18, forced 0, non-desert 0. Stored at birth. OWED: the dirs gate (lint, generators, data, copy) read against the
line's list + C1 + the two stored figures; push; hand-in.

**(2) E13d-3.** b52ec10f5 reverts SAMENESS-KEYS (sameness-census.mjs byte-equal to 50765e60d); 228123b7b `isNotDrawn`
(one leading bullet dropped; the bare side matched against the skip set and each title as printed, uncut: 10 titles of
23-24 letters) + the guard's header names what it does not see; 9e73a943a the lighting census by its door (titles
32028 -> 32026). Red first 1, walker 33/33. Typechecks 167/1113. Register NOT re-taken.

**(3) C4-SECOND-LINE.** Line 8 `[street · no crisis: under_siege · no crisis: plague_onset]` in the content document,
`npm run gen:dossier-prose` (economy 519 -> 520 variants). Red-first arm at the foot of
`tests/domain/economyStateProseDesk.test.js` (the calm-only lines are [1, 8]). EXPECTED to move: the same file's
"THE PAYOFF" pin `drawnKeys('Poor', 'road', …).size` 3 (a count my unit moves: re-record in the same commit, named).

### 0.2 Tools (scratch: /tmp/claude-0/…/scratchpad/tools)
CLOSE-8's births harness (`births.mjs`, `births.census.jsx`), CLOSE-10's measures; `run-births.sh <tree> <plan> <out>
<measure>` and `run-gate.sh <cwd> <log> <cmd…>` (exclusive mutex, retry on 3, `EXIT n` appended). NEVER swap a file in a
tree whose births are queued: a red-first at base runs in a detached scratch tree (`/home/user/wt-c4base`), test copied in.
