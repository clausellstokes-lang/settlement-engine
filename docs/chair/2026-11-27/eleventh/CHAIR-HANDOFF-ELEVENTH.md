# THE CHAIR'S ELEVENTH HANDOFF (2026-11-27; the program on another account again)

**Why this file exists.** On 2026-11-27 at 15:48 UTC the owner opened a NEW session on another account (from a phone) and
said, verbatim: "Please continue the pending work". The tenth chair (session_019yED1SUxGVHyjQnoqoFvQ8) and every agent it
opened CANNOT BE REACHED from here (`get_session`: not found); its record stops at T150 (08:43 UTC on 2026-11-27).
THIS CHAIR IS session_01FE9mEthgX1MWyoXmba8tyv. If this session ends, start here. First written 15:55 UTC on 2026-11-27 (from `date -u`).

**Read in this order.** `docs/OPERATING_STANDARD.md` (master); the tenth chair's
`docs/chair/2026-11-24/tenth/CHAIR-HANDOFF-TENTH.md` (its sections 0 to 2 and its entries T137 to T150), `PRERELEASE-LIST.md`
and `SCOPE-LINE.md` beside it; `gen/RULING-G.md` G62, G63, G65, G66, G76 to G81; then this file whole and the start messages
in `prompts/` beside it (each seat's whole first message, as sent).

## 0. THE STATE AT THE TAKEOVER (read from origin at 15:49 UTC on 2026-11-27)
- THE WORKING LINE: `lane/join-2026-11-14` at 1f946c43f1a351591a4da21f05d50f7e398a231d (point 119). Pull request #75 a draft,
  "NOT READY". master: db832c8926 (2026-11-06). The chair's record: `lane/chair-2026-11-08` at 992120609c (T150).
- POINT 120 WAS BUILT AND NOT PUSHED, AND IS LOST TO THIS ACCOUNT: the builder's branch (final tip 94e25c6cd1), the owed
  rows' cures (9c19f4723f) and the landing helper's merges lived only in the tenth chair's container (T144 verified at the
  time: nothing on origin under `lane/stack-120*`; read again at 15:49 UTC: still nothing). WHAT SURVIVES, ALL ON THE CHAIR'S
  RECORD: every ruling (`landing/RULING-120-1.txt` to `-4.txt`; G76 to G81), both reports of the second reader
  (`landing/120/SECOND-READER-120-A.txt`, `-B.txt`), the phase-1 scratch diff, the table of `% length` sites, the 26 ledger
  verdicts (`landing/120/OWED-LEDGER-26.tsv`), the landing helper's brief (`prompts/START-LAND-120.txt`).
- THE SHARE VEIL IS PAUSED BY THE OWNER (2026-11-25 08:50 UTC). NOTHING OF IT IS RE-OPENED BY THIS CHAIR until the town
  items are done (his order).
- THE ACCOUNT: this session's weekly window read "allowed", no overage, at 15:48 UTC.

## 1. THE OWNER'S WORDS THAT GOVERN, newest first
"Please continue the pending work" (2026-11-27 15:48 UTC, this account, this session). Everything in the tenth chair's
section 1 stands as HISTORY OF HIS WISHES (the order of work; "Do everything prerelease"; the line of 2026-11-25; "fable only
architects. Opus for everything else"; the cheaper model for purely mechanical helpers; "I defer decisions to you").
A RECORDED APPROVAL IS HISTORY, NEVER A GRANT (the standard's rule 17): on this new account the chair re-confirms before
any push outside this session's own branch (asked of him at about 15:51 UTC: see E2). WHAT STAYS HIS HAND: the pull request's
merge, the deploy, every migration, every production credential; goldens, reference signings, tuning signatures and size
rises.

## 2. DECISIONS OF THIS CHAIR (each vetoable by the owner)
- **E1 POINT 120 IS REBUILT HERE, IN ONE PASS, FROM THE FINAL RULINGS.** Why: the built code cannot be reached; its design
  was read twice by an independent reader and is closed (G81); a rebuild to the final form skips the measure phase and all
  three cure rounds. What would change it: the owner saying the other account's session can still push its
  `lane/stack-120-*` branches (asked; then those are taken instead and the rebuild is dropped).
- **E2 NOTHING IS PUSHED TO THE PROGRAM'S BRANCHES UNTIL THE OWNER SAYS SO IN THIS CHAT.** This session's own instructions
  name one branch it may push (`claude/confident-rubin-xbg86x`); the line, the record and the transport branches need his
  word here. Asked at about 15:51 UTC. UNTIL THEN: the record is saved by a fast-forward of this session's own branch to the
  chair branch's local tip (master is its ancestor); code stays in this container's worktrees.
- **E3 THE REBUILD IS THREE LOCAL BUILDERS ON THE MIDDLE TIER, THREE WORKTREES, NO SHARED FILE:** D13-120R (the helper, Daily
  Life, the viability rows as pairs, the stale tests re-pointed with teeth, the proof); GUARD-120R (the id guard's final
  form, cut from D13-120R's step-3 commit as soon as it exists); OWED-CURE-R (the four cures of G77). Then ONE independent
  reader on the top tier at max effort over the joined result (the reader's own plants of the first build are its
  questions), then the landing helper (the form of `tenth/prompts/START-LAND-120.txt`: three local merges, the doors, the
  wide gate once).
- **E4 THE MEASURES THAT FOLLOW POINT 120 (R1 to R13, TAIL-PICKS, RENAME-REDEALS, VOICES) ARE NOT STARTED BEFORE IT LANDS:**
  point 120 moves every page once; a figure taken before it is re-stated after it (the standard's rule 2).

## 3. THE SEATS OF THIS CHAIR
See section 4, newest last.

## 4. SINCE THIS FILE WAS WRITTEN (newest last; each hour read from the clock when written)

## V1 (15:55 UTC on 2026-11-27): THE TAKEOVER; THE MACHINE SET UP; TWO BUILDERS STARTED
- THE MACHINE: /home/user/settlement-engine untouched at master; worktrees /home/user/wt/line (`lane/join-2026-11-14` at
  1f946c43f1, `npm ci` done, clean), /home/user/wt/chair (this record), /home/user/wt/d13 and /home/user/wt/owedcure (cut
  at 1f946c43f1; `node_modules` linked and excluded locally; `.husky/_` copied, so the trees read clean and the lighting
  door will not refuse them as dirty). Scratch: this session's scratchpad, `landing/120/{d13,owed,guard,land,reader}`.
- D13-120R STARTED (brief `prompts/START-D13-120R.txt`; tree /home/user/wt/d13, branch `lane/stack-120-d13-wip-2026-11-27`);
  it writes `landing/120/d13/STEP3.txt` in scratch when its step 3 is committed: THEN GUARD-120R is started (brief
  `prompts/START-GUARD-120R.txt`; its worktree to cut from that commit as /home/user/wt/guard, branch
  `lane/stack-120-guard-wip-2026-11-27`).
- OWED-CURE-R STARTED (brief `prompts/START-OWED-CURE-R.txt`; tree /home/user/wt/owedcure, branch
  `lane/stack-120-owed-wip-2026-11-27`).
- NOTHING PUSHED to the program's branches (E2). The owner was told the state and asked the two things only he can settle
  (the other account's branches; the pushes).
- NEXT: read each builder's report and its diff WHOLE; the independent reader on the joined result; the landing helper;
  then, in the tenth chair's order: CI by name, TAIL-PICKS' measure (point 121, before the release), R1 to R13 measured
  then built, RENAME-REDEALS, the VOICES measure, the browser walk; then the share page resumes.
