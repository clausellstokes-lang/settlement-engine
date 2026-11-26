# CLOSE-11 — HAND-BACK (section 0 is the whole memory)

A seat of THE TENTH CHAIR (session_019yED1SUxGVHyjQnoqoFvQ8), successor of CLOSE-10, for POINT 119. Its law:
`docs/chair/2026-11-24/tenth/prompts/START-CLOSE-11.txt` on `lane/chair-2026-11-08`. No pull request, ever. Seated 16:07 UTC
2026-11-26.

## 0. WHERE THE SEAT STANDS

Base: the line `lane/join-2026-11-14` at POINT 118, 9d22f040e. Each unit in its own worktree (`/home/user/wt-<unit>`,
node_modules symlinked; `/node_modules` and `/.husky/_` in the clone's `info/exclude`), pushed from that worktree.

### 0.1 The units (the chair, 18:07 UTC: FOUR HAND-INS, then "CLOSE-11 HANDS OVER"; B1(ii) and THE JOIN are NOT this seat's)

| unit | branch | tip | state |
|---|---|---|---|
| B1(i)c-2 (G67) | lane/close-11-2026-11-26-b1ic2-wip | 38e92b68e (on 19a5855f3) | PUSHED, HANDED IN 18:06 (gate: 20 red = 17 line's + C1, hookThemeDraws 2145->2144, A6 32->33) |
| E13d-3 (G67) | lane/close-11-2026-11-26-e13d3-wip | 9e73a943a | PUSHED, HANDED IN, ACCEPTED 17:01 (not among the four: done before) |
| C4-SECOND-LINE gated (G49, G69) | lane/close-11-2026-11-26-c4second-wip | 3edb597c2 (on CLOSE-10's 3647bae53: census 1e35d273a, pins 6a8d5f673, observed-shape bd2ac3285, shift register PREPARED 3edb597c2) | full gate re-run queued (c4-gate2.log); then push + hand-in |
| VIABILITY-TRUE-2 (G68 V1-V3) | lane/close-11-2026-11-26-viability2-wip | 7279e571c + V2 uncommitted in /home/user/wt-via2 | V1 render measure (via/base.log) and V3 measure (via/v3.jsonl) queued on /home/user/wt-via-base |
| P9b-2 (G68 P1, P2) | lane/close-11-2026-11-26-p9b2-wip | 12c77ae3f + red test tests/ui/defenceMeanAsShown.test.jsx (uncommitted) | red run queued (p9b2-red.log); cures designed: SummaryTab defScore = avgScore(scoresAsShown(r, dp.scores)) on its own line, imports at line 9 and the file's end; scoresAsShown passes a non-numeric monster through |
| B1(ii) | lane/close-11-2026-11-26-b1ii-wip | e809f2a2e | NOT MINE (chair 18:07): coded, unproven, pushed for the chair's builder |

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
