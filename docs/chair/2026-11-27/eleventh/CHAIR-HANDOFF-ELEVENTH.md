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

## V2 (16:02 UTC on 2026-11-27): THE OWED ROWS' FOUR CURES REBUILT, READ BY THE CHAIR AND ACCEPTED; THE TAIL'S CENSUS STARTED
- OWED-CURE-R finished: `lane/stack-120-owed-wip-2026-11-27` (local, /home/user/wt/owedcure) at c1dd12135 on 1f946c43f1:
  bf1e97af1 the ledger's 26 rows (all 26 texts byte-equal to the accepted table `tenth/landing/120/OWED-LEDGER-26.tsv`,
  so the verdicts read under G78 stand: 26 colour), 90675fcfd and 1361cdf37 the two stale tests read the pool's head (a
  planted repeat still reds), c1dd12135 the `quiet` helper over six lines. THE CHAIR READ THE DIFF WHOLE: source one file,
  seven lines, statements unchanged; tests three lines. ONE THING THE FIRST BUILD'S RECORD DOES NOT MENTION: the ledger head's
  `lines` 306 to 332 (it counts the rows: 306 + 26); `declaring` left at 30 as G78 left it. ACCEPTED (E5); the wide gate
  decides if anything pins the old figure. Records moved 0 of 300; both typechecks at their ceilings; `tests/data` whole: the
  two listed rows of `dossierStateProseProjection.contract` only.
- D13-120R: steps 1 and 2 committed (be58ebed1 the helper: mix32 over fnv1a32 of `<key>::<id>`, a tie to the smaller id,
  a falsy key the first line; cf9ce97ca Daily Life and the eight headers), BOTH READ BY THE CHAIR: keys and ids unchanged; the
  outsider second pick's id is the option's branch name (a rename of a branch would re-deal that pick: for the guard's
  "does not catch" list or a scope of its own: put to GUARD-120R).
- TAIL-CENSUS STARTED (brief `prompts/START-TAIL-CENSUS.txt`; read-only, no test runs; scratch `tail/`): the 18 and 7
  town-page sites of point 121's candidate, each with its pool, its ids and a proposal.
- BRIEFS WRITTEN AHEAD: `START-GUARD-120R.txt`, `START-READER-120R.txt`, `START-LAND-120R.txt`, `START-R-MEASURE.txt`.

## V3 (16:08 UTC on 2026-11-27): STEP 3 READ; THE GUARD AND THE WHOLE-TOWN MEASURE STARTED; THE TAIL'S CENSUS IN AND RULED (E6); POINT 121's BUILDER IN PHASE 1
- D13-120R's STEP 3 (df0401af658b36cf86ed39bf82b97b9a89433710), READ WHOLE BY THE CHAIR: 22 rows as pairs, ids NV1-2, IC1-2,
  IU1-2, DC1-4, DL1-2, DG1-3, DN1-2, SS1-5 (the first build's prefixes), seven picks through the helper, `pickTrue` the
  highest hash among the true rows, no sentence changed. The builder goes on to the stale tests and the proof.
- GUARD-120R STARTED (tree /home/user/wt/guard, branch `lane/stack-120-guard-wip-2026-11-27` cut at df0401af6; told to NAME
  the outsider second pick's branch-name id in "does not catch").
- R-MEASURE STARTED (tree /home/user/wt/rmeasure, detached at df0401af6; scratch `rmeasure/`; no vitest; changes nothing):
  R1 to R13, the vacuous row, OVERVIEW-NAMES-THE-SEAT, each counted on C and V as the pages will print after point 120.
- TAIL-CENSUS finished (`tail/TAIL-REPORT.md`, `tail/TAIL-SITES.tsv` beside this file): 24 sites: 1 covered by point 120,
  8 OUT of the owner's line (each prints only after an advance, on the map or the war tab, or from a campaign ledger),
  3 LEAVE, 12 CONVERT in 6 units.
- **E6, THE TAIL RULED:** POINT 121 IS FIVE UNITS (fortune; hooks; tradition description; tonight's cast wants; page frames).
  TENSION CAUSE IS NOT CONVERTED (no importer in src: dormant code is not changed, G79 (5)); a condition of its wiring.
  THE BAR FOR A SITE WITH A DOOR, as the chair read `facts/drawDeclared.js :: drawDeclared`: a plain rendezvous in the
  door's `draw` callback does NOT hold the bar (a line ADDED that a place refuses can move it from its top line's twin to
  the door's argmax, which is keyed by another hash and by POSITION where a line has no id). RULED: the printed line is the
  highest-ranked line the place CAN PRINT (admitted, or refused with an admitted twin); the "next one" rules become "the
  next in rank"; keys unchanged; every pool exported as rows a walker reads at run time. HOW each site holds it (the Daily
  Life route, or a ranked mode of the door, with every walker and register that reads the door named) is PHASE 1 of the
  builder, with the stale-test cost by a scratch build: the chair rules before phase 2.
- TAIL-121 STARTED IN PHASE 1 (brief `prompts/START-TAIL-121.txt`; tree /home/user/wt/tail, branch
  `lane/stack-121-tail-wip-2026-11-27` cut at df0401af6; scratch `landing/121/tail/`).
- **E7, POINTS 120 AND 121 LAND AS ONE STACK WITH ONE WIDE GATE IF 121 IS BUILT AND READ BY THE TIME 120's READER IS RULED;**
  else 120 lands alone (the standard's rule 8; the wide gate is about three hours of the one test gate).
- FIVE SEATS WORK: D13-120R, GUARD-120R, R-MEASURE, TAIL-121; OWED-CURE-R and TAIL-CENSUS are finished.

## V4 (16:08 UTC on 2026-11-27): THE OWNER'S WORD ON PUSHES, MODELS AND EFFORT; E2 IS ANSWERED
- HIS WORDS, VERBATIM, in this session (about 16:08 UTC on 2026-11-27): "Please use the best combinations of models and effort per model to
  complete the tasks. I defer all judgement (absolutely all judgement to you), and give you all permissions!"
- THE CHAIR'S READING, TOLD TO HIM THE SAME MINUTE: (1) IT ANSWERS E2: this session pushes the record to
  `lane/chair-2026-11-08`, the working line to `lane/join-2026-11-14` (only after a landing's gate is ruled, a
  fast-forward, the hook let run) and transport branches under `lane/stack-*`. (2) MODELS AND EFFORT ARE THE CHAIR'S PER
  SEAT: builders and measures on the middle tier at high effort; the independent reader of a change on the top tier at max
  effort; a helper that only starts a run, waits and sorts failures by name on a cheaper model at low effort; the chair
  architects, reads and rules. (3) IT IS NOT READ AS A GRANT OF: the pull request's merge, the deploy, any migration or SQL
  on the live database, a credential, a permission setting, or the final signings (goldens, size budgets, tuning numbers):
  each is asked in its own words at its hour (the standard's rule 17), and anything a permission check refuses is reported,
  never routed round.

## V5 (16:37 UTC on 2026-11-27): THE OWNER: "Feel free to make children sessions"; TRANSPORT PUSHED; THE FOUR-WAY PRE-RUN OF POINT 120's SOURCE COMMIT STARTED
- HIS WORDS, VERBATIM (about 16:14 UTC): "Feel free to make children sessions". WHY IT MATTERS: this machine has ONE test gate
  and four cores (load 13 at 16:31 UTC with four seats on it; `tests/domain` alone had held the gate 25 minutes).
- PUSHED AS TRANSPORT (the hook let run each time): `lane/stack-120-owed-wip-2026-11-27` at c1dd12135;
  `lane/stack-120-d13-wip-2026-11-27` at df0401af6 (step 3: the source change whole; the builder's later commits are
  tests). THE RECORD is pushed to `lane/chair-2026-11-08` at every entry from now on.
- **E8, THE SHARD RUNNER:** a child session on the cheaper tier at medium effort that runs ONE shard of a vitest run on ONE
  exact commit, lists the failing tests by name (file, whole title, first message line), commits the two result files on
  top of that commit at `docs/chair/2026-11-27/eleventh/shards/<LABEL>/<k>-of-<n>/` and pushes the branch
  `lane/shard-<label>-<k>of<n>-2026-11-27` (transport only, never merged). Template `prompts/TEMPLATE-SHARD-RUNNER.txt`;
  `shards/render.sh` fills it; the rendered prompts are kept in `shards/prompts/`; a child's first message only points at
  its prompt on this branch. It judges nothing: the chair or a builder sorts its list.
- THE PRE-RUN "PRE120" (the whole suite on df0401af6 in four shards): session_01FE9mEupamfS4E6NusGuxsz (1/4),
  session_01FE9mExDNXYRJtQXW9MZH4X (2/4), session_01FE9mEvd8izCmWeTqbQX6hm (3/4), session_01FE9mEwk4UASe5AMnH1k4MA (4/4).
  WHAT IT IS FOR: every test OUTSIDE the builder's seven directories that pins a line the pick moved, and every stored
  figure that follows the pages, is named NOW and goes to D13-120R before the landing, not after its wide gate. IT IS NOT
  the landing's gate (that runs on the joined tip, in shards the same way).
- TAIL-121 TOLD (ruling 121-0, by message): its cost run (B) is the children's: it commits its scratch build on the local
  branch `lane/scratch-121-costbuild-2026-11-27` and writes `landing/121/tail/COSTBUILD.txt`; the chair pushes it and
  starts three shards on it (the eight directories), then continues the builder with the failing names.
- PLANNED WITH CHILDREN: the independent reader of point 120 in its own container (top tier, max effort) as soon as both
  of its branches are finished and pushed; the landing's wide gate in four shards.

## V6 (17:09 UTC on 2026-11-27): POINT 121's PHASE 1 IN AND RULED (E9); ITS COST RUN ON THREE CHILDREN; PHASE 2 STARTED; THIS MACHINE UNSHALLOWED
- TAIL-121's PHASE 1 (58 minutes; scratch `landing/121/tail/`): on 300 births of C and 300 of V, base against a scratch
  build: RECORDS MOVED 0 and 0; lines outside the five units 0; lines moved: tradition description 826 and 832 (279 and 280
  towns), PDF headlines 435 and 403, the quick guide's scope line 242 and 242, the ring vantage 24 and 34, fortune 23 and 19,
  the cast wants 9 and 12, the hooks 0 and 2 (one town). FOUR OF THE SITES ARE ALSO STORED AT SAVE on the shared page's stamp
  (`power:governance`, `traditions`, `defense:criminal.ringNote`, `overview:identity`): the A18 kind; no master save holds a
  stamp. THE DOOR: `filterDeclared` notes every admitted line (it feeds the soak's declared share and pool dominance), so
  the Daily Life route is refused at door sites; the unchanged door fails the bar (the chair's own read, V3); the builder's
  scratch gives the door a RANKED MODE.
- **E9, RULED (`landing/RULING-121-1.txt`):** (1) the ranked mode of `drawDeclared` (`rankKey`, `taken`;
  `kernel/proseHash.js :: rankRendezvous`) ACCEPTED, built with no `any`, six tests of its own; (2) rows inside a door
  `{ id, text, ...declaration }`, outside a door `{ id, say }`; (3) THE HOOKS ARE NOT CONVERTED: 1 town in 600 and 0 in 600
  print one, and they carry the most machinery: `hookLines.js` byte-equal; written down as HOOKS-PICKS; (4) FOUR UNITS:
  fortune, tradition description, tonight's cast wants, page frames (the ring vantage, the PDF's headlines, the scope
  line); (5) the stored stamps are the share lane's A18: no version bump here; (6) an empty key picks the first row.
  PHASE 2 STARTED BEFORE THE COST COUNT IS IN (the standard's rule 35: run to the default, vetoable): a stored figure or a
  shrink-only door that reds STOPS its unit.
- THE COST RUN "TAILCOST" (the eight directories on the scratch build c9ebf6b696, pushed as
  `lane/scratch-121-costbuild-2026-11-27`, never merged), three shards: session_01FE9mEx65EbCgq1jyMNZZeq (1/3),
  session_01FE9mEscgc4h5rEg42ku2E8 (2/3), session_01FE9mEtishfjiASjkBYWq31 (3/3). Their lists go to TAIL-121 by message.
- THIS MACHINE's CLONE WAS SHALLOW (`domainAnyCastBaseline` red for that alone: "resolves to NO commit", found by D13-120R):
  unshallowed at 17:09 UTC on 2026-11-27. THE SHARD RUNNER's TEMPLATE now unshallows its clone first; the four PRE120 children did NOT (their
  lists will hold that environment red: read by its message).
- GUARD-120R has committed the guard (edad442d6) and holds the gate for `tests/lint` whole. D13-120R is in its test runs.
  R-MEASURE is rendering (its table is filling in `rmeasure/R-TABLE.tsv`).

## V7 (17:22 UTC on 2026-11-27): THE ID GUARD REBUILT, READ BY THE CHAIR AND ACCEPTED (E10); THE PRE-RUN THREE QUARTERS IN
- GUARD-120R finished (77 minutes, most of it waiting for the gate): `lane/stack-120-guard-wip-2026-11-27` (local,
  /home/user/wt/guard; being pushed as transport) at 30539f145 on df0401af6: five test-side files, no file under src.
  144 scopes, 637 ids: 615 Daily Life ids in 143 `<slot>|<branch>` scopes and 22 viability ids. THE FIRST BUILD's RECORD SAID
  636 Daily Life ids; THE CHAIR COUNTED THE POOL FILES ITSELF (`id: '` in `src/data/dailyLife/*.js`): 615, as G76 (A) said:
  the 636 is not explained and is not this build's.
- ITS PROOFS, as reported (plants (a) to (h)): the shifted insertion and the swap red and refused, each also with a trailing
  space; a retired id reused red and refused; a second SS1 over three lines, in double quotes, in backticks: each red; the
  baseline moved away or emptied: refused; a re-wording in place re-banked by the door and green; an appended id, a retired
  sentence under a new id, a comment naming an id: green; the unplanted tree green, the door "matches the tree".
- THE CHAIR READ `tests/lint/stablePickIds.shared.mjs` WHOLE: Daily Life is read BY IMPORT and fail-closed (every id-bearing
  export must be named; every named export read exactly once; an emptied pool file red: the builder's own addition, taken);
  the viability rows by a small lexer (comments dropped, any quote style, id keys counted against rows); a move is matched
  against present ids only; the door refuses a move, a reuse, a duplicate, a missing or emptied baseline. NO ENVIRONMENT
  VARIABLE re-points the baseline (one fewer hole than the first build). "DOES NOT CATCH" carries five lines, the outsider
  second pick's branch-name id among them. ONE HONEST CASE REFUSED, NAMED: a wholly retired branch that comes back.
- **E10: ACCEPTED. THE GUARD IS CLOSED AGAIN (G81 stands):** the independent reader plants on it once; a finding of the
  deliberate kind is recorded, not cured.
- `tests/lint` whole on its tip: the base's four, the lighting census (the join's), and `ledgerCitationIntegrity`, an
  ENVIRONMENT red (no local ref `review-fixes-2026-07-08`): THE CHAIR FETCHED THAT REF HERE at 17:22 UTC on 2026-11-27.
- THE PRE-RUN (PRE120), three shards of four: 31,865 tests; every failing test not on the list is in `tests/domain` or is
  the lighting census (sorted by `shards/sort.py`, kept in scratch `shards/`). Shard 4 still runs.

## V8 (17:27 UTC on 2026-11-27): THE INDEPENDENT READER OF POINT 120 STARTED IN ITS OWN CHILD SESSION; THE BUILDER TOLD TO USE THE PRE-RUN's LIST
- THE OWNER ASKED (about 17:15 UTC) "Where are we at right now and what are your comprehensive thoughts?": ANSWERED IN FULL,
  first. What the chair told him it intends, vetoable: the scope held where it is (new ideas to an after-release list unless
  leaving them out would move saved towns twice); VOICES measured and brought to him as one number with a recommendation,
  not assumed in; THE SHARE VEIL RESUMED ON CHILD MACHINES BESIDE THE TOWN CURES once 120 and 121 land (the live site hides
  only in the browser today), unless he keeps the old order; the guess: five to six days if the scope holds.
- READER 120R: session_01FE9mEvGeBq7canVFL3PMpz (the top tier, max effort; briefs `prompts/START-READER-120R-CHILD.txt`,
  which governs, and `prompts/START-READER-120R.txt`): started EARLY on the source whole (df0401af6) and the guard
  (30539f145); it pushes its report and notes to `lane/reader-120r-2026-11-27` and sends the report by message; a fault
  that would stop the landing comes at once in a message of its own. OWED TO IT BY THE CHAIR: the builder's `repointed.tsv`
  by message when D13-120R reports (its question (8)).
- D13-120R TOLD (ruling 120R-1, by message): no further whole-directory runs; step 6's list is the pre-run's
  (`shards/PRE120-new.tsv` in scratch: 20 rows from three shards, all `tests/domain` and the lighting census); no
  `tests/lint` whole (the guard's builder ran it over the same source).
- PUSHED AS TRANSPORT: `lane/stack-120-guard-wip-2026-11-27` at 30539f145.
- WHO WORKS NOW: here: D13-120R (tests, proof), TAIL-121 (phase 2), R-MEASURE (C partly born, V not yet). Children: PRE120
  4/4, TAILCOST 1 to 3 of 3, READER 120R.
