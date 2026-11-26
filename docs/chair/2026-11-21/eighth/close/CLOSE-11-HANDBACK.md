# CLOSE-11 — HAND-BACK (section 0 is the whole memory)

A seat of THE TENTH CHAIR (session_019yED1SUxGVHyjQnoqoFvQ8), successor of CLOSE-10, for POINT 119. Its law:
`docs/chair/2026-11-24/tenth/prompts/START-CLOSE-11.txt` on `lane/chair-2026-11-08`. No pull request, ever. Seated 16:07 UTC
2026-11-26.

## 0. WHERE THE SEAT STANDS

Base: the line `lane/join-2026-11-14` at POINT 118, 9d22f040e. Each unit in its own worktree (`/home/user/wt-<unit>`,
node_modules symlinked; `/node_modules` and `/.husky/_` in the clone's `info/exclude`), pushed from that worktree.

### 0.1 The units (order by the chair, 17:01 UTC: B1(i)c-2, C4's gate, VIABILITY-TRUE-2, P9b-2, B1(ii); then the join)

| unit | branch | tip | state |
|---|---|---|---|
| (1) B1(i)c-2 (G67) | lane/close-11-2026-11-26-b1ic2-wip | 38e92b68e (on 19a5855f3) | built; dirs gate (lint, generators, data, copy) RUNNING; then push + hand-in |
| (2) E13d-3 (G67) | lane/close-11-2026-11-26-e13d3-wip | 9e73a943a | PUSHED, HANDED IN, ACCEPTED (17:01) |
| (3) C4's gate (copy of CLOSE-10's 3647bae53) | lane/close-11-2026-11-26-c4second-wip | 1e35d273a (wiring census by its door) | gate: 20 red, 7 line's, 13 its own; ruling asked on the shift register (owner-gated pins) and A0b over-claim 20>19 |
| (4) VIABILITY-TRUE-2 (G68: V1 debt homes, V2 the tab's fallback, V3 comment) | lane/close-11-2026-11-26-viability2-wip | 7279e571c + V2 uncommitted in /home/user/wt-via2 | V1's render measure (debt homes, scratch via/) and V3's measure queued on /home/user/wt-via-base |
| (5) P9b-2 (G68: P1 SummaryTab sixth mean, P2 non-numeric score) | — | — | not started |
| (6) B1(ii) (G64) | lane/close-11-2026-11-26-b1ii-wip | uncommitted in /home/user/wt-b1ii | coded (`settlement.schema.js :: bornByThisEngine`; `genesis.js :: fieldRiteRefused`, the rule after the draw; census row B1furrow + plant/controls); typechecks green; line measure: field shown 362/1800, refusing 246, refusing+field 61, farmland admits 32; master-born 360 (stamp 0.9.0) shown sets byte-equal 360/360; after-births queued |

**C4's 13 own reds** (a) count pins +1: projection MUTANT 3182, proseComposed GUARD 3182, wiring VARIANT 3182, composeStateProse 3182,
proseEntryContradiction 3650/2942, PAYOFF Poor/road 3->4, stateProseKernel UNIFORM group list; (b) doors: wiring census (DONE
1e35d273a), observed-shape baseline --write (owed); (c) SHIFT REGISTER 5 pins, owner-gated: ASKED; (d) A0b over-claim 20 > 19: re-run
after the census queued (shared run).

**For the chair (asked 16:50):** the file of the start list that cost the most and gave the least: `docs/OPERATING_STANDARD.md`
(36 KB, nearly all about seats, batching and the chair's own tooling; for a close seat only rule 1 and §6 bind, and CLAUDE.md
and COMMON-RULES already carry both).

### 0.2 Tools (scratch: /tmp/claude-0/…/scratchpad/tools)
CLOSE-8's births harness (`births.mjs`, `births.census.jsx`), CLOSE-10's measures; `run-births.sh <tree> <plan> <out>
<measure>` and `run-gate.sh <cwd> <log> <cmd…>` (exclusive mutex, retry on 3, `EXIT n` appended). NEVER swap a file in a
tree whose births are queued: a red-first at base runs in a detached scratch tree (`/home/user/wt-c4base`), test copied in.
