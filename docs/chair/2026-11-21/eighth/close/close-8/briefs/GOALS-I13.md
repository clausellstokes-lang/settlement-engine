# BRIEF: GOALS I-13 (CLOSE-8's cure 3a; the tenth chair's R24q 2). ONE BUILDER. A UNIT OF SOURCE.

## THE FAULT (CLOSE-7's READS-117 item 2 and BATCH.md § GOALS I-13; CONFIRMED by run there)
`src/generators/people/goals.js :: dealGoals` keys each card's draw on its own fork, but its GOAL RECEIPT (`goalReceiptsOf`)
does not record every card a draw READ, so I-13's law ("removing a card leaves every card whose draw read nothing of it
byte-identical", `tests/generators/people/goals.test.js` describe 'I-13: keyed determinism') is measured against an incomplete
receipt. Three unrecorded reads, from BOTH passes:
- PASS ONE, THE HELD LINES: `heldShort` / `heldLong` take every line an earlier card holds out of a later card's candidates.
- PASS ONE, THE WHOLE-ROSTER READS: e.g. `facesInPower(cards, power).length` deciding the RANK cell's refusal.
- PASS TWO (GR1's repeat/rotation pass): it reads every OTHER holder of a wording to decide a repeat and rotates; none of those
  holders enters `receipt.refs` (Portaminus at the line: with the middle card removed, a wording becomes a repeat and rotates).
I-13 is red at the line on that town (on RED-AT-LINE as `goals.test` I-13).

## WHAT TO BUILD (THE CHAIR's RULING: the receipt records every card EITHER pass read; THE DRAWS DO NOT CHANGE)
1. RED FIRST in `tests/generators/people/goals.test.js`: the I-13 arm is red at the base; if it does not already name the town,
   add a case that does, red at the base. Say titles and counts.
2. THE CURE in `goals.js` only: the held lines become maps from a line to its holder's id; where a candidate is taken out because
   another card holds it, that holder's id joins the drawing card's receipt `refs`; where a refusal reads the roster, the counted
   members' ids join; PASS TWO adds every card whose wording it read for that card's repeat/rotation. Draw calls, their order,
   their keys and the candidate lists are UNCHANGED. The receipts live in a WeakMap (never on the record): 0 births move.
3. THE RULE AS A CHECK OVER EVERY BIRTH of C and V: `tools/goals-i13.census.jsx` beside this brief (CLOSE-7's measure, its header
   says how to run it: env GI_TREE, GI_PLAN, GI_OUT; a vitest config rooted at the tree, as `tools/births.mjs` writes one) on the
   base and on your tip: faults before (CLOSE-7 measured 136 on C and 172 on V at an older tree: re-measure on THIS base) and 0
   after, with the count of refs your cure added.
4. RECORDS MOVED on C and V: 0 expected (`tools/births.mjs` with `tools/measure-keys.mjs`, base against tip): any moved field is a
   STOP.
5. ONE LINE OWED: every reader of a goal receipt's `refs` outside the measure and the test (file :: symbol), and whether more refs
   change what it does.

## WHERE
- Worktree `/home/user/wt/goals-i13` on branch `lane/close-8-2026-11-25-goals-i13-wip`, cut by CLOSE-8 at the JOIN's tip after
  E13b (it carries E1, E8, E8b, E13b, which all edit goals.js); node_modules and `.husky/_` linked. Commit there by explicit paths.
  DO NOT PUSH.
- Files you may change: `src/generators/people/goals.js`, `tests/generators/people/goals.test.js`. Anything else: STOP and report.
- Measures: `/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-8/goals-i13/` (uncommitted).

## LAWS
- Read `goals.js` WHOLE once before a line is written. Every heavy run (vitest, tsc, births) through
  `GATE_MUTEX_MAX_POLLS=40000 sh scripts/gate-mutex.sh --run -- <cmd> > <log> 2>&1; echo "exit=$?" >> <log>`; logs read by
  tail/grep; never a gate through a pipe. One heavy run at a time.
- The hooks are never bypassed (`--no-verify`, `core.hooksPath`, HUSKY=0).
- Before green: `npm run typecheck:ratchet` and `npm run typecheck:domain:strict` (167 and 1113); the goals tests
  (`tests/generators/people/`); `tests/lint` whole (a test file changed). Known reds of `tests/lint`: `proseComposed` A0b,
  `proseCorpusBytes` RAW and GZIP: name any other.
- No golden, fingerprint, register or budget re-recorded. A permission refusal stands: report it, try nothing else.

## REPORT (at most 300 words + one table), also to `goals-i13/REPORT.md`
The commit(s); red before, green after; the every-birth check before/after on C and V and refs added; records moved; the readers
of `refs`; the gates' counts.
