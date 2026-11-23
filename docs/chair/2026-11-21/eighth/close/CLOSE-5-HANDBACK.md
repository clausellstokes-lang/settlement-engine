# CLOSE-5 — HAND-BACK (kept current at every push; for a reader who has never seen this session)

The close's seat for THE FLIP (switching the two new birth laws on), seated by THE NINTH CHAIR (session_01FbPLbdpQrxXktCeSf32d4j)
on 2026-11-23; the successor of CLOSE-4. Its law: `docs/chair/2026-11-23/ninth/prompts/START-CLOSE-5.txt` and
`docs/chair/2026-11-21/eighth/prompts/CLOSE-3.txt` (reading CLOSE-5 for CLOSE-3), both on `lane/chair-2026-11-08`.
A successor reads those two, then this section, then `FLIP-PLAN.md`.

## 0. WHERE THE SEAT STANDS (written 2026-11-23 04:02 UTC, read from date -u)

| ref | tip | state |
|---|---|---|
| `lane/close-5-2026-11-23` (this lane) | this push | docs only: this hand-back; `FLIP-PLAN.md`; `close-5/ANCHORS-BY-FILE.tsv`; `close-5/WHY-DRAFT.md` |
| `lane/close-5-2026-11-23-flip` | not cut | THE FLIP: cut ONLY on the chair's "BUILD THE FLIP <tip>", from that tip |
| `lane/close-5-2026-11-23-lit-scratch` | not made | a read-only trial, only if the chair answers Q8 yes |

- STOOD ON: `lane/close-4-2026-11-23` at e5d1ca80a (CLOSE-4's final hand-back). The line: `lane/join-2026-11-14` at 244fa84ef;
  the stack `lane/stack-106-wip-2026-11-23` at cb598376f (106, 107 merged; read-only).
- READ (the start message's list, no wider): CLAUDE.md, OPERATING_STANDARD; COMMON-EIGHTH, COMMON-RULES, CLOSE-3.txt whole;
  CLOSE-2.txt unit (5); the eighth handoff's E30 .. E131 as CLOSE-3.txt lists; the ninth's N25, N26, N28, N31; LINE-NOW's
  first block and the red list; CLOSE-4-HANDBACK, CLOSE-RECIPE, FLIP-CENSUS, FOR-THE-OWNER-DRAFT, FLIP-LIST-VACANT;
  CENSUS-FINAL whole and CLOSE-2-HANDBACK section 0 (ref `lane/close-2-2026-11-22` b99d46e5b); FLIP-LIST.md (seat-10),
  FLIP-LIST-B.md (fortune-7). Beside them, by grep only: the three dial lines and the `powersList` row at 244fa84ef (each
  `sed` pattern matches one line), the two `why` rows and arm 4 of the wiring tests.
- UNIT (1) THE PLAN: `FLIP-PLAN.md` written; "PLAN <commit>" sent with this push; WAITING for the chair's answers Q1 .. Q8
  and its word. NOTHING OF THE FLIP IS BUILT.
- THE BOX: `npm ci` done (exit 0); the ledger ref `review-fixes-2026-07-08` local at 235efce1a. No worktree yet.
- NEXT, in one line: on "BUILD THE FLIP <tip>": cut the flip branch in `/home/user/wt/flip` and make the commits of
  `FLIP-PLAN.md` section 1 in order, with the chair's answers.

## 1. RULINGS IN FORCE FOR THIS SEAT (numbered; the chair's)
1. No pull request, ever; push only `lane/close-5-2026-11-23*`, by its own local branch name, `git ls-remote` first; never
   `--no-verify`, never force, never master (N2, COMMON-EIGHTH 15).
2. No golden, reference snapshot, tuning signature or size rise is recorded or signed: prepared and NAMED in
   `close/FOR-THE-OWNER.md` with the command after his signing (N4).
3. No line of the flip's code before "BUILD THE FLIP <tip>" (the start message).
4. Every merge and every commit of code in a worktree of this seat's own, each merge a plain command (N3).
5. One heavy run at a time through `scripts/gate-mutex.sh`; runs over five minutes in the background with the exit
   appended to the log, waited in pieces under ten minutes (N6).
6. The anchors that pin words are re-pinned only on the line holding PRONOUN and the Daily Life landing (the start message;
   N31).
