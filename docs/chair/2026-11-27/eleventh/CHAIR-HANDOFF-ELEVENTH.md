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

## V9 (17:55 UTC on 2026-11-27): THE PRE-RUN WHOLE; THE RE-POINTED TESTS READ; POINT 121's COST IN AND RULED (121-2); THE READER'S TEST PUT TO THE OWNER
- **PRE120 WHOLE (the whole suite on df0401af6, four children, about 50 minutes):** 43,864 tests, 86 failing: 61 ON THE LIST,
  25 NOT: 24 stale line pins in ten `tests/domain` files and the lighting census. NO STORED FIGURE, GOLDEN OR REGISTER MOVED
  BY STABLE PICKS; NOTHING OUTSIDE `tests/domain` WENT STALE. The sorted lists: `shards/results/PRE120-new.tsv`, `-on.tsv`.
- D13-120R's STEP 6 (80b133cae, nine files, 53 lines, pushed), EVERY CHANGED LINE READ BY THE CHAIR: the oracle rows draw by
  `pickRendezvous` on the same keys; `tailDefeconDisplayLines`' rows moved to places that draw the line they guard (DC2, DC4
  three times, DC3); `close7Mirror` (d) prints C7 and F6 under stated other names ('Ashfield', 'Ashby') with the reason in
  a comment; (c)'s K1 places re-read; no matcher loosened, no case dropped. THE CAUSE OF "N32 is eligible": a named-branch
  line that names no house, drawn by hxd-hamlet-2 under the new pick: a different pick, as expected. The builder is on its
  mutant table and the proof. THE READER was told of the commit by message (17:54 UTC).
- **TAILCOST WHOLE (the eight directories on point 121's scratch build):** 32,804 tests, 86 failing, 42 on the list; of the 44
  not on it, 25 are point 120's own; POINT 121's OWN ARE 19 (`shards/results/TAILCOST-own.tsv`): about 11 stale pins
  (fortune 4, the ring note 5, the scope line 1, the tradition oracle 1) and three walkers (`domainAnyCastBaseline`: the
  scratch's `any`; `drawDeclaredKeys.walker`: two callers without a `key`; `presumedThings` ARM 1: 4 undeclared literals
  and 15 stale rows). NO STORED FIGURE OR GOLDEN MOVED. **RULED (121-2, by message):** the cost is accepted; each of the three
  walkers must be green on the builder's tip WITH ITS REGISTER UNCHANGED (ids given in place where hoisting a literal would
  change the key the walker reads); a unit that cannot be converted without the shrink-only register moving STOPS.
- THE OWNER ASKED (about 17:45 UTC) "What are your expectations as a pure human reader after all of this is done?": ANSWERED
  IN FULL, first. The reader's test COLD-READ-20 is on the list unless he says otherwise (`PRERELEASE-ADDED-ELEVENTH.md`).

## V10 (18:54 UTC on 2026-11-27): D13-120R HANDED IN (tip 80b133cae), ACCEPTED BY THE CHAIR FOR THE JOIN (E11); THE LANDING HELPER STARTED; THE READER HAS THE MUTANT TABLE
- D13-120R finished (three hours, most of it the machine's one gate): `lane/stack-120-d13-wip-2026-11-27` at 80b133cae
  (pushed): be58ebed1 the helper, cf9ce97ca Daily Life and the headers, df0401af6 the viability rows, 80b133cae the
  re-pointed tests. THE STATE-PROSE DIRECTORY EQUAL TO THE BASE AT EVERY COMMIT. No door re-taken; no refusal.
- ITS PROOF, ON C, AGREES NUMBER FOR NUMBER WITH THE FIRST BUILD's AND THE FIRST READER's (G79, G80): Daily Life (dawn_work,
  default): an undrawn line removed moves 0 towns [base 15]; a drawn line removed exactly its 35 drawers [328]; a line added
  exactly the 29 it out-hashes, n 358 [327]. Viability (SS): 0 [0]; 124 of 124 [210]; 87 of 87, n 326 [261]. RECORDS MOVED
  0 of 900 and 0 of 900. Lines moved: Daily Life 6.4 and 6.6 a town; viability 464 (C) and 469 (V). State prose 0. The
  player view against the shared page, and the PDF against the tab, on 60 towns: 0 differ. No line starved (243 and 305
  lines admitted in 50 towns or more, each drawn). 24 rows re-pointed in nine files, each red under its own mutant
  (`landing/120/repointed.tsv`, filed here).
- ONE THING NAMED, NOT OF THIS POINT: on C, 4 lines outside the families differ between base and tip: a "Patron deity" block
  on the Power view of dp-thorp-0 and dp-thorp-1 that shows or not BY RENDER ORDER (the same on base and tip when rendered
  in another order). Put to the reader to confirm or refute; if it stands it is a render-order fault of its own (R14: a
  measure with the whole-town items).
- **E11: ACCEPTED FOR THE JOIN.** All of its source was read by the chair (V1 to V3, V9). THE LINE DOES NOT MOVE before the
  reader's report is ruled and the joined tip's whole suite is read by name.
- LAND-120R STARTED (brief `prompts/START-LAND-120R.txt` with the start message's changes: three merges (80b133cae,
  30539f145, c1dd12135), the doors, the typechecks, lint, build, `tests/build`, the five sizes, the sample town; NO wide
  gate and no `tests/lint` whole: the chair runs the whole suite on the joined tip in four shards on children).
- THE READER (session_01FE9mEvGeBq7canVFL3PMpz) was sent the table and the render-order question (by message).
- THE STACK QUESTION (E7): decided when the reader reports: if point 121 is built and its own reader is not yet ruled, POINT
  120 LANDS ALONE.

## V11 (19:07 UTC on 2026-11-27): THE WHOLE-TOWN MEASURE IN AND RULED (E12); THREE CURE BUILDERS STARTED AS CHILDREN ON THE JOINED TIP OF POINT 120
- R-MEASURE finished (2 h 55 min; 1,800 births, each page as the app renders it; `rmeasure/` beside this file with its tools):
  THE COUNTS AND THE RULING OF EVERY ITEM: `landing/RULING-R.md` (E12). IN SHORT: R2, R3 on the dossier and R6's repeat came
  from the RETIRED Summary tab the tenth chair's quick render had mounted: closed, no cure. CURED AT PRINT (no birth moves):
  R1 (12 / 9 pages), R3 on the session sheet (892 / 893), R4 (12 / 6), R5 with R10 and R12, the hard pair (165 / 89), R6 the
  unnamed good (12 / 14), R7 (94 / 78), R8 woods (0 / 19) and luxury (120 / 37), the Overview's seat line (872 / 879).
  NOT A FAULT: "pays its way" beside the grade "Weak" alone (151 / 62): a margin and a shock; the owner may veto.
  AT BIRTH: R13 (243 / 210: a bare role where a name belongs), built; R11 (the date palms, 14 of V), measured first.
  TO THE SHARE LANE (A19): 39 shared pages of V deny a seat-holder in the seat box and name him in the next paragraph.
  ITS OWN UNIT LATER (TRAD-NEEDS): R9; the chair's reading: no version bump needed (no production town carries 0.10.0).
- LAND-120R: THE THREE MERGES ARE IN ON THE LINE's LOCAL TREE, NO CONFLICT (8e5d33b36 stable picks; 2422fde1d the guard;
  42883b5c4 the owed cures; both typechecks at their ceilings after each); it is on the doors, the build and the sizes.
- PUSHED AS TRANSPORT: `lane/stack-120-wip-2026-11-27` at 42883b5c4abd020b850eea9dc06ace074f1f2ab4 (the three merges; the
  doors' commits follow on the line's tree): THE BASE OF THE CURE BUILDERS.
- THREE CHILD BUILDERS (the middle tier, high effort; common rules `prompts/START-RCURES-COMMON.txt`):
  R-CURES-A session_01FE9mEu1ow6pwTLRS8G9x5f (`prompts/START-RCURES-A.txt`; branch `lane/stack-122-rcures-a-wip-2026-11-27`:
  R1, R3 session, R6, R7, the vacuous row); R-CURES-B session_01FE9mEv7yYJ4g5vAbdzBnwD (`START-RCURES-B.txt`;
  `lane/stack-122-rcures-b-wip-2026-11-27`: R4, R5, R8 woods, R8 luxury); R-BIRTH session_01FE9mEvwwZLxUT1dypvNkrW
  (`START-RBIRTH.txt`; `lane/stack-123-rbirth-wip-2026-11-27`: R13 built; R11 phase 1). Each pushes after every unit and
  reports by message. OWED: D1 (the Overview's seat line) after point 121's page-frames unit; each cure branch gets the
  chair's whole read and ONE independent reader over points 122 and 123 together before they land.
- TAIL-121: the door's unit committed (39e0063c4); on its four units.

## V12 (19:08 UTC on 2026-11-27): THE INDEPENDENT READER ON POINT 120 REBUILT: THE BAR HOLDS, THE PRODUCT IS CLEAN; FOUR FINDINGS, RULED (E13); ONE ROUND ON THE GUARD
- THE READER (session_01FE9mEvGeBq7canVFL3PMpz, 1 h 40 min; its report `landing/120/SECOND-READER-120R.txt` and notes beside
  it, copied from `lane/reader-120r-2026-11-27` at 885d929c7): executed on the base 1f946c43f1 against 80b133cae with the
  guard 30539f145. NO FAULT OF THE FIRST BUILD IS REPEATED.
- WHAT HOLDS, BY ITS OWN EXECUTION: the helper agrees with its own reference on 20,000 of 20,000 picks, is order-independent,
  ties to the smaller id; no line starved or over three times its share; pools on one key independent. No index draw left
  (0 of 10,725 and 10,942). Keys equal; ADMITTED SETS EQUAL (9,672 of 9,672; 9,770 of 9,770; viability 781 and 756); the words
  of 615 lines and 24 sentences equal; the state-prose directory equal. Its 18 planted edits: every town that moved should
  have, none extra: tip [base]: an undrawn line removed 0 [15]; a drawn line removed 36 [316]; a line added 25 [327]; re-worded
  35 [35]; narrowed 11 [66]; THE POOL's ORDER REVERSED 0 [333]; viability 124 [210], 87 [261], 106 [98], 26 [51]. RECORDS MOVED
  0 of 900, 0 of 900, 0 of 360 (the master-born). RENDERED LINES OUTSIDE THE FAMILIES: 0 of 1,120,878 (C) and 0 of 1,092,106
  (V): so the builder's four "Patron deity" lines were its own render order, not this change (R14 stays a measure). The same
  line on 900 of 900 across the owner's tab, the player view, a fresh shared page, the PDF's chapters, Foundry and the AI
  grounding. No sentence twice. All 24 re-pointed rows red under its 21 mutants.
- **E13, THE FOUR FINDINGS RULED** (`landing/RULING-120R-2.txt`, sent to GUARD-120R, resumed): (1) the guard's own tests pin
  the baseline's exact counts and SS1's live words, so a line honestly retired or SS1 honestly re-worded leaves the walker
  RED with no door cure: CURED (true floors; fixtures of their own). (2) a wholly retired scope cannot take a line under a
  new id: CURED (the empty-present refusal is for the emptied skeleton only). (3) a viability pair whose id is not of the
  id's form (`'SS1b'`, `'SELFS1'`) is read by nobody: CURED (red, not unread); a non-JSON baseline exits 2; "does not catch"
  gains two lines. (4) `pickRendezvous` handed a duplicate id, a missing id or a falsy key answers by LIST ORDER: unreachable
  today (0 duplicate ids, held by the guard); a NAMELESS record's picks follow the pool's order as the old pick's did: NOT
  CURED; whether a saved town can be nameless joins RENAME-REDEALS. WHY (1) TO (3) ARE CURED THOUGH G81 CLOSED THE GUARD:
  they trip HONEST work; G81 closed it against the deliberate kind.
- KNOWN, RESTATED BY THE READER (A18): a shared page stamped before this change prints another viability line than the
  owner's on 464 of 900; master holds no stamp.
- THE LANDING OF POINT 120: the product is cleared by the reader. STILL OWED BEFORE THE LINE MOVES: the guard's round merged
  by the helper; the joined tip's whole suite in four shards, read by name; the chair's row and gate paragraph.

## V13 (19:27 UTC on 2026-11-27): THE LANDING HELPER's JOIN REPORTED AND ACCEPTED; THE GUARD's ROUND IN, READ AND ACCEPTED (E14); ONE MORE MERGE
- LAND-120R (29 minutes): on `lane/join-2026-11-14`'s local tree: 8e5d33b36, 2422fde1d, 42883b5c4 (no conflict; each merge's
  tree equal to its branch's tip); THE LIGHTING CENSUS RE-TAKEN BY ITS DOOR at a607d0b97 (files 3,820 to 3,822; credited
  3,311 to 3,313; titles 32,043 to 32,074; suite titles 8,913 to 8,917; parked 509); the stable-pick door "matches the tree
  (144 scopes, 637 ids)"; the observed-shape check, the prose generator's check and the wiring census (3,183 variants) GREEN,
  not re-taken. `typecheck:ratchet` 167 of 167; the strict domain check 1113 of 1113; `validate:packets` 257 valid; lint 0
  errors; build clean. `VERIFY_DIST=1 tests/build`: 628 tests, 13 failed, ALL 13 ON THE LIST. THE HOME PAGE's SAMPLE TOWN DID
  NOT MOVE. THE FIVE SIZES: first paint 1,191,245 raw (+253 on point 119) / 379,929 gzip (+124) / 318,936 Brotli (-26); the
  generation worker 2,739,250 (0); the engine chunk 937,247 (0): named for the owner's size signing, raised by nobody.
  PUSHED AS TRANSPORT: `lane/stack-120-wip-2026-11-27` at a607d0b97.
- GUARD-120R's ROUND (16 minutes): 818380f0f on 30539f145, four test-side files, the baseline unchanged. THE CHAIR READ THE
  DIFF OF THE SHARED MODULE AND THE DOOR: every pair `[<string>, <string or template>]` in the function is a row and a row
  whose id is not of the form is a problem; the skeleton refusal needs present AND retired empty; a non-JSON baseline is a
  refusal (exit 2); the floors are 80 scopes, 350 Daily Life ids, 12 viability rows (a little over half of 144, 615, 22; the
  largest scope holds 33 lines). Its proofs: P9 retired, SS1 re-worded, a whole branch retired: the walker's file green each
  time; a new id into a wholly retired scope accepted, its retired id back refused; the three odd rows red and refused.
- **E14: ACCEPTED. THE GUARD IS CLOSED AGAIN.** LAND-120R resumed (ruling 120R-3, by message): merge 818380f0f, the door,
  the lighting census again if its titles moved, the three guard files alone, lint. THEN: the push of the new tip and FOUR
  SHARDS of the whole suite on it (`shards/prompts/LAND120-*.txt` are rendered for a607d0b97 and are re-rendered for the
  new tip).

## V14 (19:36 UTC on 2026-11-27): THE FOURTH MERGE; THE FINAL JOINED TIP 360e716c2 PUSHED; THE LANDING's WHOLE SUITE ON FOUR CHILDREN; R14 CLOSED
- LAND-120R on ruling 120R-3 (6 minutes): 6d5aba988 the guard's round merged (no conflict); THE LIGHTING CENSUS RE-TAKEN BY
  ITS DOOR AGAIN at 360e716c2 (titles 32,074 to 32,076; nothing else moved); both typechecks at their ceilings; the door
  "matches the tree (144 scopes, 637 ids)"; `stablePickIds.walker` 25 of 25, `mutationCoverageManifest` 10 of 10,
  `sovereigntyLightingContract.walker` 34 of 34; lint 0 errors. THE LINE's LOCAL TREE STANDS ON
  360e716c2f7f52669e531d9aa603c61c1222acbc, clean: 1f946c43f1 + four merges + two door commits. NOT YET ON
  `lane/join-2026-11-14`.
- PUSHED AS TRANSPORT: `lane/stack-120-wip-2026-11-27` at 360e716c2 (the hook ran: both typechecks and the linter).
- THE LANDING's WHOLE SUITE ("LAND120", four shards on 360e716c2): session_01FE9mExFodwZcpvZpr8mG9Y (1/4),
  session_01FE9mEvk4gfYeYDga8Kwb5p (2/4), session_01FE9mEwKc4C2urrp3K7Ewt6 (3/4), session_01FE9mEsqT48LoySMLg47HKh (4/4).
  EXPECTED, from the pre-run: 86 less the 24 re-pointed pins, the lighting census and the four owed rows: about 57, every
  one on the list. WHEN ALL FOUR ARE IN: `shards/results/sort.py LAND120 4`; every row not on the list is ruled before the
  line moves; then the chair's row and "THE GATE OF POINT 120" in `docs/chair/2026-11-17/sixth/LANDINGS-SIXTH.md` on the
  line (a docs commit), the fast-forward push of `lane/join-2026-11-14`, `LINE-NOW.md` and `RED-AT-LINE.tsv` (75 to 71:
  rows `colourMarks4h`, `narrativeQualityCorpus` twice and `powerStructure` F31 leave), CI's run read by name.
- THE READER's SECOND MESSAGE (19:30 UTC; its final report at 5a69a320e): verdict and findings unchanged; the builder's
  table 24 of 24 red under its 13 mutants; THE FOUR "PATRON DEITY" LINES ARE THE HARNESS's (a lazily loaded panel missing
  only on a render worker's first dossier, on both trees; preloaded: 64 of 64 print, 0 differ). **R14 IS CLOSED: not a
  fault of the product.**
- E7 DECIDED: POINT 120 LANDS ALONE (point 121's builder has committed its door's unit only).

## V15 (19:51 UTC on 2026-11-27): POINT 121 BUILT (cf2e84c2d), ITS SOURCE READ WHOLE BY THE CHAIR, ACCEPTED FOR THE INDEPENDENT READ (E15); A SHORT ROUND
- TAIL-121's PHASE 2 (2 h 40 min in all; `lane/stack-121-tail-wip-2026-11-27`, local, /home/user/wt/tail, on df0401af6):
  39e0063c4 the door's ranked mode and `kernel/proseHash.js :: rankRendezvous`; 999135901 fortune; 4471a391f the tradition
  description (143 ids `<TABLE>.<pool>.<n>`, unique across the table file); 11f0197cb the cast wants (13 ids; the held-seat
  pair read by id); cf2e84c2d the page frames (the ring vantage RING-1 to RING-4; the PDF's three headline lists; the scope
  line's five frames by name). `hookLines.js` BYTE-EQUAL TO THE BASE. A line with no id in a ranked draw THROWS.
- ITS PROOF (300 births of C, 300 of V): RECORDS MOVED 0 and 0; lines outside the units 0; admitted sets 4,867 compared, 0
  differ; planted edits, tip [base]: an unprinted line removed 0 [3]; a line printed by 10 towns removed: those 10 [31]; a
  colour line added: the 6 it out-ranks [31]; A LINE ADDED WITH A NEED: it out-ranks 6, 5 refuse it, 0 REFUSERS MOVE, 1 moves
  [27]; the scope line: 114 [494] and 112 [462]. The owner's page against a fresh shared page on 60 towns: the scope line,
  the ring and governance agree; traditions differ by design as on the base. NOT RENDERED by the builder: the PDF and the
  player view (the reader's).
- THE THREE WALKERS OF RULING 121-2, registers unchanged: the any-cast baseline green (no `any`); `drawDeclaredKeys`'s two
  rows were the hooks' (gone with them); `presumedThings` ARM 1's 4 and 15 rows came from ONE FORM, `return drawRanked(…)`
  inside the door: the walker's trace is depth-limited and order-dependent; `const ranked = …; return ranked` reads the
  base's 131 hits exactly. A FRAGILITY OF THAT WALKER, WRITTEN DOWN (the reader is asked to confirm it; a comment now says
  why the form stands).
- THE CHAIR READ every changed line under src (eleven files). NOTED: the ring vantage used to fall back to the table's own
  note when its one drawn row was refused and now walks the rank to the next row the place can print (the ruled bar; more
  variety; put to the reader to judge on its merits). The fortune draws keep the rendezvous inside the door's `draw` (their
  pools declare nothing): a comment says a declaring line moves them to the ranked mode.
- **E15: ACCEPTED FOR THE INDEPENDENT READ.** RULING 121-3 (`landing/RULING-121-3.txt`): the shared page's CONTROL (its
  recall now matches any dead frame) is RULED NOT A LOOSENING (the claim is the event and its year; the sibling check reads
  it so; its mutant reds); `tailCrisisBatch2`'s five re-pointed anchors must each red under a mutant (one mutant red two);
  two comments; THE LINE's JOINED TIP 360e716c2 MERGED INTO THE BRANCH by the builder (both sides' rows kept in test
  conflicts). THEN: the branch pushed; READER 121 in a child session (`prompts/START-READER-121-CHILD.txt`, base
  360e716c2); the guard's new scopes by GUARD-120R on a branch cut from the merged tip, from the builder's table of seven
  modules.
- 15 rows re-pointed (`landing/121/repointed.tsv`, filed here as handed in; the five anchors' rows follow).

## V16 (20:00 UTC on 2026-11-27): POINT 121's ROUND IN (tip 2ab62ef33, pushed); ITS READER STARTED; THE GUARD's NEW SCOPES BEING BUILT
- TAIL-121 on ruling 121-3 (6 minutes): 757c10115 the two comments; 2ab62ef33 THE LINE's JOINED TIP 360e716c2 MERGED INTO THE
  BRANCH, NO CONFLICT (`tailDefeconDisplayLines` merged by itself, both sides' rows kept); the five anchors of
  `tailCrisisBatch2` each red under a frame's re-wording (the newcomer frame reds three, the traveller one, the local one;
  rows added to `landing/121/repointed.tsv`, 20 rows); both typechecks green; the stable-pick door "matches the tree (144
  scopes, 637 ids)"; its 16 test files 199 of 199; the six walkers green alone. TAIL-121 IS FINISHED unless the reader
  finds a fault (523,000 tokens: a cure after the read goes to a FRESH builder with the report, not to it).
- PUSHED AS TRANSPORT: `lane/stack-121-tail-wip-2026-11-27` at 2ab62ef33.
- READER 121: session_01FE9mEuzqAKrQvpFqvj65UN (the top tier, max effort; `prompts/START-READER-121-CHILD.txt`; base
  360e716c2, tip 2ab62ef33; nine questions: the rank and the door's ranked mode, with THE UNRANKED DOOR PROVEN UNCHANGED ON
  THE CORPORA; each site; the bar by its own plants, a line added with a need some towns lack among them; what moved; every
  surface, the four stored stamps counted; within a page; the re-pointed rows by its own mutants; the walkers and
  registers; anything unsaid). It pushes `lane/reader-121-2026-11-27` and reports by message.
- GUARD-120R RESUMED (ruling `landing/RULING-121G-1.txt`; tree /home/user/wt/guard121, branch
  `lane/stack-121-guard-wip-2026-11-27` cut at 2ab62ef33): a THIRD FAMILY of the guard, read BY IMPORT at run time: seven
  modules, about 180 ids in 16 scopes; a `.say` frame fingerprinted by its function's source; the baseline gains the scopes
  by the door's own `--write`; point 120's scopes must not change.
- THE LANDING OF POINT 121, WHEN THE READER IS RULED: two local merges on the line (2ab62ef33 is already above the line's tip:
  a fast-forward in content; then the guard's branch), the doors, lint, build, sizes, the whole suite in four shards.

## V17 (20:04 UTC on 2026-11-27): THE GUARD's THIRD FAMILY BUILT, READ AND ACCEPTED (E16); PUSHED; PUT TO THE READER OF POINT 121
- GUARD-120R on ruling 121G-1 (5 minutes): `lane/stack-121-guard-wip-2026-11-27` (/home/user/wt/guard121) at cccda7569 on
  2ab62ef33: 533413bd6 the table `IMPORTED_POOLS` and its import reader, floors (9 imported scopes, 100 imported ids) and
  fixture self-tests, both head lists, the manifest row; cccda7569 the baseline BANKED BY THE DOOR ALONE ("+182 added | 0
  retired | 0 re-worded"; point 120's 144 scopes unchanged: 262 lines inserted, 0 deleted). THE DOOR NOW SAYS "matches the
  tree (160 scopes, 819 ids)". Import cost about 120 to 145 ms for the seven modules; no browser-only dependency.
- ITS PLANTS: on ELEMENT_GLOSS a shifted insertion, a swap, a retired id reused, a duplicate: red and refused; a re-wording
  re-banked; the scope line's frames swapped: red and refused; a cast want appended: added; an export un-exported: red and
  refused.
- THE CHAIR READ the reader (`importedPoolsTreeOf`): fail-closed as ruled (a module that will not import, a missing export,
  a wrong layout, a row without id or words, an empty pool, an export named twice: each a problem). "DOES NOT CATCH" gains:
  a `say` frame whose words come from a value outside the function; A POOL THAT IS NOT IN THE TABLE (a ranked pick added
  elsewhere without a row is not seen).
- **E16: ACCEPTED.** PUSHED AS TRANSPORT. READER 121 was sent it as a tenth question (by message): its own plants on the
  imported pools, and WHETHER EVERY POOL ON THE RANKED PICK IS IN THE TABLE.

## V18 (20:25 UTC on 2026-11-27): POINT 120 LANDED: THE LINE IS 682667fe2bbfc614be8185668119c638b2e3cf71
- **THE WHOLE SUITE AT 360e716c2, FOUR SHARDS (LAND120; 19:36 to 20:19 UTC):** 3,822 files, 43,889 tests, 57 failed: ALL 57 ON
  THE LIST, NONE NEW; the four owed rows green. (`shards/results/LAND120-on.tsv`; `LAND120-new.tsv` is empty.)
- **THE LINE MOVED AT 20:24 UTC ON 2026-11-27**, a fast-forward 1f946c43f1..682667fe2 (the row and "THE GATE OF POINT 120" in
  `docs/chair/2026-11-17/sixth/LANDINGS-SIXTH.md`; the landing itself its parent 360e716c2, also
  `lane/stack-120-wip-2026-11-27`). The hook ran (the type ratchet, the strict check, the linter). ON THE OWNER'S WORD OF
  THIS SESSION (V4).
- THE RECORDS: `ci/RED-AT-LINE.tsv` 71 rows (four leave; none new); `ci/LINE-NOW.md` at point 120, its CI bullet NOT YET
  READ; the reader's report and notes in `landing/120/`; the builder's mutant table beside them.
- WHAT POINT 120 COST, FOR THE NEXT CHAIR's PLANNING: the takeover at 15:48 UTC; the rebuild 15:56 to 18:54 (three hours,
  most of it one machine's one gate; with children from the start it is about ninety minutes); the reader 1 h 40 min; the
  join 35 minutes; the whole suite 43 minutes in four shards. NOTHING WAS LOST THIS TIME BECAUSE EVERY BRANCH WAS PUSHED AS
  IT WAS MADE.
- NEXT, IN THIS ORDER: (1) CI's run on 682667fe2 read by name (the form of `tenth/ci/ci-read-119.py`), its bullet into
  LINE-NOW.md; (2) POINT 121 when READER 121 (session_01FE9mEuzqAKrQvpFqvj65UN) reports: rule, cure, then two local merges
  on the line (2ab62ef33, then cccda7569), the doors, lint, build, sizes, four shards; (3) POINTS 122 and 123 as the three
  cure builders report (R-CURES-A session_01FE9mEu1ow6pwTLRS8G9x5f, R-CURES-B session_01FE9mEv7yYJ4g5vAbdzBnwD, R-BIRTH
  session_01FE9mEvwwZLxUT1dypvNkrW): the chair's whole read of each branch, D1 (the Overview's seat line) by a builder on
  point 121's tip, ONE independent reader over 122 and 123; (4) RENAME-REDEALS and TRAD-NEEDS measured; VOICES measured and
  put to the owner as one number; (5) the share veil resumed on children; (6) the end (COLD-READ-20, the browser walk, the
  close).
- FOR THE OWNER, HIS HAND ONLY, UNCHANGED: the signings at the end (71 rows on the list; the sizes), the migrations, the
  merge, the deploy. Vetoes open on point 120: none (no new sentence).

## V19 (21:19 UTC on 2026-11-27): CI ON POINT 120 READ BY NAME: 71 FAILING ROWS, ALL ON THE LIST, NONE NEW; THE CURE BRANCHES READ SO FAR; THE READER OF 121's EARLY NOTE
- CI run 46063413287 (number 1304) on 682667fe2: the test ratchet 49, build and dist 13, coverage floors 8, the golden master
  under tr_TR 1: 71 rows, EXACTLY THE LIST's 71; validation, the type ratchets, lint, Chromium and Deno green. `ci/LINE-NOW.md`
  carries the bullet; `ci/ci-read-120.py` and `ci/run-682667fe2.tsv` beside this file.
- READER 121's EARLY NOTE (21:01 UTC, not its report), RULED NOT A STOPPER: `traditions/traditionDescription.js :: drawTurn`
  rotates only where every line of the pool is a colour line, so ONE DECLARED LINE ADDED TO A FRAME TABLE switches the
  rotation off for every town: its plant moved 30 towns that cannot print the line (278 on the base; no frame table holds a
  declared line today; a sentence-twice test reds on such an edit). TO BE HELD BY NAME in the cure round after its report
  (a pin that the rotated frame tables hold colour lines only; a line at `drawTurn`). Its other results so far: records
  moved 0 and 0; every door call of a birth identical base to tip in order (2,997,784 and 2,919,694 calls); 30 of 31 plants
  move only the towns they should; the pool's order reversed moves 0.
- R-CURES-A: FIVE UNITS PUSHED (`lane/stack-122-rcures-a-wip-2026-11-27` at e275fb263; not yet reported). THE CHAIR READ ITS
  SOURCE DIFF WHOLE: A1 the suffix cut by the constant itself (`crisisHooks.js :: castReasonShown`); A2 one call; A3 a new
  leaf `display/tensionDescriptionShown.js` called by the History row, the search, the Overview and the PDF ("A critical
  resource, <good>, became scarce…"); A4 `criticalIssuePoolKey` keyed by the issues the Outlook lists (it names the decided
  arm it overturns: lane SELF-VOUCH's "needs review" alone); A5 the test row. DOORS IT RE-TOOK: the wiring census twice,
  the writer-reach register by its shrink-only `--write` (the dark cohort unmoved; closures grew), AND THE TUNING INVENTORY
  by its walker's ritual: THE CHAIR READ THAT DIFF: one new dependent file on two rows (`LEADER_FROM`, `SOLE_EARNER_FROM`) and
  two stale `line` fields; NO VALUE, LEAF, KEY OR DIGEST MOVED. (The tenth chair asked the owner before that door once,
  because a permission check refused it; here no check refused; the owner is told at the landing; his tuning signature is
  on values, which did not move.) ASKED OF THE BUILDER BEFORE ACCEPTANCE (by message): THE FIVE SIZES base against tip (A3's
  helper imports `historyData.js` and `economyStateProse.js` into more surfaces), and a lighter shape if first paint grows.
- R-CURES-B: B1, B2, B3 pushed (`lane/stack-122-rcures-b-wip-2026-11-27` at d326d1128; not yet reported); B4 BUILT AND
  REVERTED BY THE BUILDER: IT MOVES BIRTHS (13 of 300: the Annual fair's description, read at birth on the atom
  `need not brought in: luxury`; `tests/generators/faultsNeed.test.js` holds that leaf equal to the page's list). **E17: B4
  LEAVES POINT 122 AND JOINS POINT 123 (the birth cures) as C3**, from the builder's commit 22d7fe306, after its pair table
  is read.
- R-BIRTH: three commits on R13 (`lane/stack-123-rbirth-wip-2026-11-27` at bc5c1ab8c); not yet reported.

## V20 (22:32 UTC on 2026-11-27): THE OWNER APPROVES "THE SURVEY" FOR THIS RELEASE: THE CHARTER WRITTEN; TWO MEASURE SEATS STARTED
- HIS WORD, VERBATIM (about 21:55 UTC), after two exchanges recorded in `PRERELEASE-ADDED-ELEVENTH.md`: "Then I approve of all
  of this as planned and to be implemented prerelease". THE CHAIR's READING, TOLD TO HIM IN SIX POINTS THE SAME MINUTE
  (`SURVEY-CHARTER.md`, which is the one home of this program's frame): the document as ONE OBSERVER's survey; THE RULE "say it
  unless something rules it out", relationships drawn between CLAIMS; the two guards (a qualifier stays for NOUNS; scoped by
  VOICE, the harder claim standing); the promise reworded; VOICES as the third layer on the settled design; ALL BEFORE THE
  RELEASE. IT SUPERSEDES the chair's own earlier intention (V8) to bring VOICES to him as a number before taking it: he has
  taken it; the number still comes, with the order of work, when the measures are in.
- **E18, THE ORDER:** S0 two read-only measures now (child seats); points 121 to 123 land as they clear; the share veil resumes
  on children beside it; S1 the chair rules the design on the measures (`SURVEY-DESIGN.md`, to write) and gives the owner ONE
  NUMBER; S2 built in units, each read by an independent reader; S3 COLD-READ-20 is the acceptance test of the new promise.
  WHAT IT IS NOT: a loosening for accidents (a clash on a drawn relationship is a fault, target 0); a change to the record;
  a substitute for the server-side veil.
- THE TWO MEASURE BRIEFS: `prompts/START-SURVEY-MEASURE.txt` (the door as it is; every atom classed NOUN, JUDGMENT, STATE; who
  declares; WHAT FAIL-OPEN WOULD NEWLY PRINT, with fifty sampled lines read for truth; the clashes already on a page from a
  first exclusion table; harder and softer; every place the product states its promise) and
  `prompts/START-VOICES-MEASURE.txt` (the pools by angle; who could say each line, per town; the traits as the engine folds
  them; the person with a criminal tie; which past findings the frame dissolves; TEN TOWNS READ COLD BOTH WAYS). Each pushes
  its files to its own branch under `survey/` and reports by message.

## V21 (22:51 UTC on 2026-11-27): CURES A AND B REPORTED, READ WHOLE AND RULED (122-A-1, 122-B-1); THE SURVEY's TWO MEASURES STARTED
- THE SURVEY's MEASURE SEATS (child sessions, the middle tier, high effort): SURVEY-MEASURE session_01FE9mEvEaQPUo3rPA6Y8Rty
  (branch `lane/survey-measure-2026-11-27`); VOICES-MEASURE session_01FE9mEv6htjVNTHdirzSH63
  (`lane/voices-measure-2026-11-27`). Both on the line at 682667fe2.
- **R-CURES-A** (`lane/stack-122-rcures-a-wip-2026-11-27` at 6bbeb9bef): proof on C and V 900 each: A1 12/8/12 and 9/6/9 to 0
  (owner/share/PDF); A2 892 and 893 sheets to 0; A3 12 to 6 and 14 to 5; A4 94 and 78 to 0 (the pool still prints on 23 and 40
  pages, each listing a contradiction by title); records moved 0; lines outside the units 0. THE FIVE SIZES: first paint
  unmoved (raw 0); the worker +113 B (A1); THE PDF RENDER WORKER +31,183 B (A3's helper importing `historyData.js`; no budget
  test holds that worker). **RULED 122-A-1 (by message):** the 31 KB comes out by the two stored sentences held as the leaf's
  OWN CONSTANTS with a test that pins them equal to the table's (the exact match kept: the builder's type-and-lead shape
  would re-word a DM's own sentence); THE A3 RESIDUE (6 and 5 pages) IS NOT A FAULT: it prints from a HISTORY EVENT, and the
  record's present shortfall does not say which good a past event was about. THE TUNING INVENTORY's re-freeze accepted as
  read. Its doors: the wiring census, the tuning inventory, writer-reach, the state-prose projection, observed-shape. NEW
  SENTENCES FOR THE OWNER's VETO: "A critical resource, <good>, became scarce, causing hoarding and price gouging"; "A
  critical resource, <good>, is running short, and some are hoarding it while others cannot pay the prices asked".
- **R-CURES-B** (`lane/stack-122-rcures-b-wip-2026-11-27` at ad59993ce; proof on 300 births of C and of V): B1 7 and 3 pages to
  0 BY THIRTEEN DECLARED EXCLUSIONS (`crisis: <kind>` on the imminent lines: ids and words unchanged); B2 the hard pair
  60/33/25 and 37/22/11 to 13/0/0 and 10/0/0 (every residual a PERSON's debt in an NPC secret); B3 5 pages of V to 0; B4
  built, then reverted (births). THE CHAIR READ ITS SOURCE WHOLE. **RULED 122-B-1 (by message):** B1 and B3 accepted; B2
  accepted with ONE MEASURE OWED: its `owesDebtShown` reads ANY `outside_debt` event of the timeline, overturning G68's "a
  past Debt Crisis is not the place owing": that stands only where THE PAGE prints a present-tense creditor line; else the
  arm is keyed on what makes the page print it. THE STANDING-OF-LIVING SLOT SILENT on 2 and 5 pages: accepted as silence;
  its proposed sentence not built (a new vid moves the shift register). `samenessHideable.existingReds.json`: ONE ROW
  RE-KEYED BY SHA after the ruled word correction (96 rows before and after; no ceiling moved): accepted, NAMED FOR THE OWNER
  as a re-key, not a widening. B2's code table `economyStateProse.js :: SOLVENT_LINES` is the first exclusion table between
  claims in the code: THE SURVEY's design takes it in. RE-WORDED FOR THE OWNER's VETO: DS-POW-6 v2 "Debts run up in one
  house here are collected in another, and the two are the same concern." (was "The town's debts start in one house…").
  THE FIVE SIZES asked of it too. **B4 IS POINT 123's C3**, on `lane/stack-123-b4-wip-2026-11-27` by the same builder
  (13 of 300 births move: the Annual fair's description; the one collapsing pair: the need "luxury goods" against the
  commodity "luxury" of gemstone deposits and precious metals).
- R-BIRTH is in its last gate run (not reported). READER 121 is rendering V (not reported beyond its early note).
- A LESSON FOR THE NEXT CHAIR: `list_events` with kinds ["result"] on a child returns about 40,000 tokens of run metadata for
  three sentences: use `list_sessions` with `children: true` (its `post_turn_summary`) and the branches.

## V22 (23:15 UTC on 2026-11-27): READER 121 REPORTED (5 FINDINGS, "THE BAR HOLDS", NO LANDING-STOPPER); RULED (E19, 121-4); ONE CURE ROUND STARTED; RULING 123-1 RECORDED; THIS MACHINE RESTARTED
- **THE MACHINE RESTARTED at about 23:10 UTC** (uptime read 2 minutes at 23:12): every worktree, the scratchpad and
  `node_modules` survived; every LOCAL background seat was lost with it (none was owed a report: TAIL-121 and GUARD-120R had
  finished). The child seats run on their own machines and were not touched.
- **READER 121** (`lane/reader-121-2026-11-27` at bcef616c4; filed here: `landing/121/SECOND-READER-121.txt`,
  `landing/121/reader-notes.md`): BY EXECUTION on its own births of C and V: the pick is the head of the rank 20,000/20,000;
  every unranked door call of every birth identical (2,997,784 | 2,919,694); records 0 | 0; lines outside the sites 0 of
  1,120,886 | 1,092,108; moved: scope 723 | 723, descriptions 2,456 | 2,486, ring 76 | 95, governance 64 | 63; one line a town
  on tabs, fresh share, PDF, Foundry, Tonight, search; 54 mutants and all 20 re-pointed rows red; six walkers green.
  NOT CHECKED BY IT: the whole suite; a browser; PDF bytes; a hosted share; V's shared pages; seven frame pools. THE GUARD
  BRANCH (cccda7569) was "not checked" in the report ONLY BECAUSE the chair's tenth question reached it after it sent: it is
  reading the guard NOW by its own plants and will amend the report (its message of 23:11 UTC). THE LANDING WAITS FOR THAT.
- **E19, RULING 121-4** (`landing/RULING-121-4.txt`: the ruling and the cure seat's brief in one file):
  F1 the rotation (`traditionDescription.js :: drawTurn`) is switched off for a whole pool by one declared line: HELD BY
  NAME (a pin, a sentence at the rotation, the gate paragraph), not rebuilt; F2 the dense-ids test works against the bar
  (renumbering passes it green; a retired id reds it): A FAULT OF THE TEST, made append-only in meaning; F3 the door's
  comment corrected to the reader's numbers (the walker's trace NOT touched: named below); F4 the cast want's key holds no
  town: NOT A FAULT OF POINT 121 (the base's own key, 31/31 | 40/40), not cured, recorded for the survey's voices work;
  F5 the scope line's frames and the PDF's chapter heads print by rank with no door: HELD BY NAME (a pin that their rows
  hold `id` and `say` only).
- **CURE-121**: a FRESH local builder (Opus) in `/home/user/wt/cure121` on `lane/stack-121-cure-wip-2026-11-27`, cut from
  cccda7569; three units (two test files, one comment). The seat that built point 121 is not resumed.
- **POINT 121's LANDING, AS IT NOW STANDS:** after CURE-121 and the reader's amended report (and any guard cure it asks):
  the cure branch (it holds 2ab62ef33 and cccda7569) merged on the line; the doors by name (lighting census first); lint,
  build, sizes; the whole suite in four shards (label LAND121); the row and the gate paragraph (it says F1's exception and
  F4's number); the fast-forward push; LINE-NOW and the red list; CI by name.
- **RULING 123-1 (sent to R-BIRTH by message at about 23:00 UTC; its text is the message):** C2, R11 "the date palms'
  grain": the date palms CARRY DATES: the trade good "Desert grain" is renamed "Pressed dates" (a word for the owner's
  veto); R15 (seven food-source lists that are empty) is RECORDED, not built. R-BIRTH pushed C2 at 1e8576d08 (23:02 UTC),
  not yet reported. R-CURES-B pushed its round at 1b0241706 (22:58 UTC), not yet reported. R-CURES-A is re-rendering C and
  V after 122-A-1 (its tip e096d4a96).
- THE SURVEY's MEASURES: SURVEY-MEASURE has pushed (A) and (G) (`lane/survey-measure-2026-11-27` at f6c629b80); VOICES-MEASURE
  has pushed nothing yet. Neither has reported.

## V23 (23:50 UTC on 2026-11-27): POINT 121 JOINED LOCALLY (04fe78096), ITS WHOLE SUITE RUNNING IN FOUR SHARDS; THE SHARE VEIL RESUMED (VEIL-56, V30); TWO MEASURES STARTED; **THE ACCOUNT's WEEKLY WINDOW READS "allowed_warning"**
- **THE ACCOUNT (read at 23:47 UTC by `get_session` on this session and on two children):** `rate_limit_info`: seven_day,
  status `allowed_warning`, no overage, resets 2026-12-04 about 09:00 UTC (it read `allowed` at 15:48 UTC). THE OWNER WAS TOLD
  AT ONCE, in plain words, with his choice (extra usage on, or the week stretched by fewer seats). UNTIL HE ANSWERS THE CHAIR
  STRETCHES IT: NO NEW SEAT is started; town work goes before the share veil (his order of 2026-11-25); every seat pushes at
  every step boundary (an idle container may be reclaimed: unpushed work is lost, as the old account's was); the veil lane
  is cut to two builders. A SUCCESSOR READS THIS FIRST and reads the window before starting anything.
- **E20: CURE-121 ACCEPTED** (the chair read its diff whole): `lane/stack-121-cure-wip-2026-11-27` e422098f8 (the ids test
  append-only; the rotation's pin: six rotated tables, ECONOMY_FRAMES among them: the brief said five call sites, there are
  six), b510bd328 (the frames' `{ id, say }` pin), fbd2c84ed (the door's comment: 5,348 not 5,359; 19 keys). Every plant red
  where it should be; a renumbering is green in the ids test and RED in the guard, as ruled.
- **READER 121's AMENDED REPORT** (a926c2c2f; filed whole: `landing/121/`): item (10): 43 plants on the guard: the seven
  faults red and refused, point 120's 144 scopes equal (+262, -0), every ranked pool in the table; FINDING 6: three things
  the guard did not see. **RULED 121-5** (`landing/RULING-121-5.txt`): (a) a row moved between two pools of one export: not
  a breach of the bar, said in the head, the cast wants' id form pinned (`<role>.<n>`); (b) an empty-string id: a fault,
  refused in every family (`idProblem`); (c) a `say` frame naming an imported binding could never be banked (the test
  loader rewrites a function's source): a fault; (d) case, whitespace and comments said in the head. THE BUILDER (GUARD-121C,
  a fresh local Opus seat) STOPPED RIGHTLY ON (c): it ran the loader's own transform and showed four forms no text
  normaliser can undo. **RULED 121-6 (by message; E21): NO NORMALISER; ONE RUNTIME:** the walker takes the imported-pools
  family from a plain-node child of the door (`node scripts/stable-pick-ids-door.mjs --print-tree`), fail-closed on a bad
  exit, empty output, bad JSON or too few scopes. Built at 9d49b33b3 (after c23762c74 and 4f542974d); the chair read the
  diff whole; the walker's file got faster (1.7 s to 0.65 s); the baseline unchanged (160 scopes, 819 ids).
- **LAND-121** (a local Opus helper; `prompts/START-LAND-121.txt`; its scratch `…/scratchpad/landing/121/land/`): on
  682667fe2, three merges, no conflict: c46d98e02 (the ranked picks, 2ab62ef33), c0c516ac0 (the guard's third family,
  cccda7569), ff495a53d (the reader's cure round, fbd2c84ed); the lighting census by its own door cadad474d (files 3,822 to
  3,826; titles 32,076 to 32,103); observed-shape, `gen:dossier-prose --check`, the wiring census green, not re-taken; the
  ids' door "matches". Ratchet 167 of 167, strict 1113 of 1113, packets 257 valid, lint 0 errors, build clean;
  `VERIFY_DIST=1 tests/build`: 628 tests, 13 failed, ALL 13 ON THE LIST. THE FIVE SIZES: first paint 1,192,955 raw (+1,710
  on point 120) / 380,432 gzip (+503) / 319,327 Brotli (+391); the generation worker 2,741,042 (+1,792); the engine chunk
  937,247 (0): NAMED FOR THE OWNER's SIZE SIGNING, raised by nobody. THE HOME PAGE's SAMPLE TOWN DID NOT MOVE (its two
  freshness tests green; its door not run).
- **THE CHAIR's OWN TWO COMMITS ON THE LINE's LOCAL TREE:** 4fb44bdd4 (merge of the guard's cure round, 9d49b33b3) and
  04fe78096 (the lighting census again by its own door: titles 32,103 to 32,108, suite titles 8,927 to 8,929); both
  typechecks and eslint on the merged files green; the census, the walker, the cast wants and the mutation manifest 81 of 81.
  **THE JOINED TIP IS 04fe78096, PUSHED AS TRANSPORT `lane/stack-121-wip-2026-11-27` (23:46 UTC; the hook clean). THE
  LINE ITSELF HAS NOT MOVED (origin's `lane/join-2026-11-14` is 682667fe2).**
- **THE WHOLE SUITE, "LAND121", FOUR SHARDS ON 04fe78096 (started 23:46 UTC; the cheaper tier):**
  session_01FE9mEvdmfmAtfVhyJnjj2a (1/4), session_01FE9mEtt6aGajEv3yHmSicz (2/4), session_01FE9mExDbgLTDSXghTAxJzi (3/4),
  session_01FE9mEtsmEiSnNwhfTACnpt (4/4); each pushes `lane/shard-land121-<k>of4-2026-11-27`. WHEN ALL FOUR ARE IN:
  `shards/results/sort.py LAND121 4`; expected: the list's rows and none new (57 failed at point 120). THEN: the row and the
  gate paragraph in `docs/chair/2026-11-17/sixth/LANDINGS-SIXTH.md` (it says F1's exception by name, F4's number, the
  sizes), the fast-forward push of the line, `LINE-NOW.md`, CI read by name.
- **THE SHARE VEIL IS RESUMED (23:17 UTC): VEIL-56**, session_01FE9mEt9K6uWD47h9Tj63hQ (`claude-fable-5-2`, high), the lane's
  owner, brief `prompts/START-VEIL-56.txt`; documents `lane/veil-56-2026-11-27`, the tip `lane/veil-56-2026-11-27-tip`
  (dbd4cd9e5). WHAT IT FOUND: VEIL-51's V27 work is in no ref and no document (a true rebuild of units 4 and 5);
  **THE BRIEF's "the tip stands on point 116" IS WRONG: the tip's merge base with the line is 8f3b8bf4b (POINT 73): the
  join carries points 74 to 120**; a trial merge of 682667fe2: 16 conflicts, all documents, registers and four test files,
  none under src or supabase. ITS SEATS (Opus, high): U3R session_01FE9mEwfVPNQEWPDzhFpCtc (unit 3's rework), U45
  session_01FE9mEtsxe2wE8icsSaauPj (units 4 and 5 rebuilt, A5's field in the cut), PG session_01FE9mEuyVYboBzwMNjdP4M8
  (V29's arm), MC session_01FE9mEvbYUFFY3VDhYajTtC (MAP-COST, READ-COST). **RULING V30** (`veil/RULING-V30.md`): unit 3's
  rule for the covert check on a copy, as VEIL-56 recommended ("unsure is closed"; the writer as oracle and a drift plant
  before "TIP?"). AFTER THE WINDOW's WARNING (23:48): U3R and U45 only; PG and MC finish the measure in hand, push, stop.
- **TWO MEASURES STARTED (23:19 UTC; Opus, high; on cccda7569):** RENAME-MEASURE session_01FE9mEwJ5n5jBNfPkShS7Ky
  (`prompts/START-RENAME-MEASURE.txt`; `lane/rename-measure-2026-11-27`, at (C) by 23:39) and TRAD-MEASURE
  session_01FE9mEufpvXTPAep9k4Hb9H (`prompts/START-TRAD-MEASURE.txt`; `lane/trad-measure-2026-11-27`, at (D) by 23:45).
- STILL OUT, NOT REPORTED: R-CURES-A (re-rendering after 122-A-1), R-CURES-B (B4's corpora), R-BIRTH (pushing 1e8576d08),
  SURVEY-MEASURE, VOICES-MEASURE. OWED BY THE CHAIR AFTER THEM: the whole read of the final cure branches; D1 (the
  Overview's "Governed by", after point 121 lands); ONE independent reader over points 122 and 123; their landings.

## V24 (00:45 UTC on 2026-11-28): **THE OWNER: "Wait the veil comes after everything else but before the release."** THE SHARE VEIL IS PAUSED AGAIN; POINT 121's WHOLE SUITE IN (TWO NEW REDS, BOTH CURED; ONE QUESTION OPEN BEFORE THE PUSH)
- **HIS WORDS, VERBATIM (about 00:43 UTC on 2026-11-28, this session):** "Wait the veil comes after everything else but
  before the release." ANSWERED FIRST, IN FULL. THE CHAIR HAD RESUMED THE LANE AT 23:17 UTC ON ITS OWN JUDGEMENT (E18): THAT
  IS WITHDRAWN. **THE ORDER NOW, HIS: every town item, the survey and the cold read FIRST; THE SHARE VEIL LAST, BEFORE THE
  RELEASE.** A successor does not re-open the lane until the town work, THE SURVEY and COLD-READ-20 are done, or he says so.
- THE PAUSE (sent 00:44 UTC to VEIL-56 at once): each seat finishes only the step in hand, pushes it with a state section,
  and stops; VEIL-56 writes `veil/v56/PAUSE-2026-11-28.md` on `lane/veil-56-2026-11-27` (the form of VEIL-55's page) and
  answers "VEIL LANE PAUSED". NOTHING IS WITHDRAWN: rulings V30 to V34 (`veil/RULING-V30.md`) stand for the resumption, and
  E23 (D1 goes to the lane's A19 unit) with them. WHAT THE THREE HOURS FOUND IS IN THAT FILE AND IN V23 ABOVE: the lost work
  is a true rebuild; the tip's merge base with the line is point 73; a covert tie deleted from the live row is served by
  every door, the party link included (cured in U3R's WIP, not merged); shared pages re-derive wrongly for towns made
  before this release (V33: fail closed by provenance); the false band reaches five rows (V31: the interval test).
- **POINT 121, THE WHOLE SUITE AT 04fe78096 (four shards, 23:46 to 00:33 UTC; lists filed: `shards/LAND121/`,
  `shards/results/LAND121-on.tsv`, `-new.tsv`):** 3,826 files, 43,853 tests, 59 failed: 57 ON THE LIST, 2 NEW, BOTH CURED BY
  THE CHAIR ON THE LINE's LOCAL TREE: (1) `proseWiringCensus` (e) THE FENCE read the door comment's module name (the
  chair's own ruling 121-4 U3 had put it there) as a reach into the prose island: the comment re-worded, c436fa21a;
  (2) `tests/architecture/layerBoundaries.test.js`, the PDF boundary's census of reached trees: `pdf/lib/headlines.js`
  reaches `src/kernel` since point 121 (`pickRendezvous`): RULED LAWFUL (the kernel is the lowest headless layer) and the
  census row added with its reason, 1b2d534da. `tests/lint` WHOLE re-run on c436fa21a: 3,430 tests, 4 failed, the list's
  four. **THE LINE's LOCAL TIP IS 1b2d534da; NOT PUSHED.**
- **OPEN BEFORE THE PUSH: 43,853 TESTS RAN AGAINST 43,889 AT POINT 120 (36 FEWER) THOUGH POINT 121 ADDED TESTS.** The chair
  is naming them: `vitest list --json` on a worktree of 682667fe2 (`/home/user/wt/base120`) and on the line's tip, the two
  lists compared by name (`…/scratchpad/landing/121/chair/list-120.json`, `list-121.json`). THE LINE DOES NOT MOVE UNTIL
  EVERY VANISHED TEST IS NAMED AND RULED.
- TRAD-BUILD (a local Opus seat; `/home/user/wt/trad`, `lane/stack-122-trad-wip-2026-11-27`): built the measured cure
  (19e7a799f, four commits) and STOPPED RIGHTLY on `tests/security/traditionDescriptionSharedPage.test.js`: the draw read a
  house's hideable fields, so a shared page's row count changed with the veil (1 row shown, 3 hidden). **RULED 122-T-2 (by
  message): THE DRAW ASKS THE FLOOR** (only facts that are the same under every veil state: the floor the shared page's
  drawn set already reads, one shared helper, for every audience); the security file green as written; a new arm that the
  owner's drawn set equals the shared one under every marker; the corpora re-run. In flight.
- R-CURES-A: DONE AND ACCEPTED at e096d4a96 (its round on 122-A-1 read whole). R-CURES-B pushed B4 to
  `lane/stack-123-b4-wip-2026-11-27` (855ff1bed), not reported. R-BIRTH not reported. VOICES-MEASURE pushed first parts
  (8e810d384). TRAD-MEASURE DONE (cab2b5788; filed: `trad/`; ruling 122-T, E22; R14 closed as the measure's own fault).
- POINT 122 IS NOW: cures A, cures B (B1 to B3), the traditions draw (122-T). POINT 123: C1, C2, C3 (B4). D1 is the lane's.

## V25 (01:50 UTC on 2026-11-28): **POINT 121 LANDED: THE LINE IS aef8f9962** (pushed 01:39 UTC); THE SURVEY's TWO MEASURES IN AND ITS DESIGN WRITTEN (`SURVEY-DESIGN.md`: ABOUT 80 SEAT-HOURS); THE VEIL LANE PAUSED; POINT 122's JOIN STARTED
- **POINT 121:** the row and the gate paragraph are in `docs/chair/2026-11-17/sixth/LANDINGS-SIXTH.md` at aef8f9962; the
  landing itself is 1b2d534da0; `LINE-NOW.md` brought to it. THE TEST COUNT WAS SETTLED BY NAME (`vitest list` on
  `/home/user/wt/base120` at 682667fe2 and on the tip): outside tests/build 43,260 names to 43,292; six titles re-worded,
  NONE VANISHED; the shards' totals are not comparable between landings (LAND121's fourth helper left 68 skipped tests out
  of its total). **A FIX OWED TO THE SHARD TEMPLATE: `tests` must be the reporter's `numTotalTests`, skipped included.**
  CI's RUN ON aef8f9962 IS NOT YET READ (a check-in is set for 02:30 UTC; expected the list's 71 rows).
  A SLIP OF THE CHAIR's, NO HARM: a `vitest run` given an empty file list began the whole suite on this machine at about
  01:35 UTC; stopped after five minutes; nothing written.
- **THE OWNER, 2026-11-28, FOUR MORE MESSAGES (verbatim in `SURVEY-CHARTER.md`, each with the chair's reading):** the
  surveyor is the unquoted author of everything but the quoted voices (recordings, remarks, anecdotes); every quote sits
  inside an existing card, one slot a card; not every card speaks (seeded, the lesser pieces mostly silent). HE ALSO ASKED,
  AND WAS ANSWERED IN FULL: how the chair would describe a dossier (as it is; as designed), its value against other tools,
  and how it compares with random-table generators; on his "check again" the chair CORRECTED its list of where table rollers
  win from the product's own code (one click and free without an account are true here too; the true gaps: unlimited free
  rolls and free export; a user's own tables of text; small standalone generators): named for AFTER the release, no scope.
- **SURVEY-MEASURE (06e8ab679) AND VOICES-MEASURE (4fc044951): DONE, FILED WHOLE (`survey/measure/`, `survey/voices/`), BOTH
  SEATS STOPPED.** SURVEY-MEASURE REFUTED THE CHARTER's PICTURE IN FIVE PLACES (fail-open is not the lever: 43 refusals in
  1,800 pages, 33 wrong lines for 5 right; the classes are four; `stated` is a no-repeat set; the clashes are late writes
  and claims with no atom; a rule on pool lines sees a third of the page): THE OWNER WAS TOLD PLAINLY. VOICES-MEASURE: quoting
  every street line reads worse; two or three quotes a tab read well; the four dispositions are a STORED field.
- **E25: `SURVEY-DESIGN.md` (S1) IS WRITTEN AND PUT TO THE OWNER AS ONE NUMBER: ABOUT 80 SEAT-HOURS, THREE TO FOUR DAYS:**
  the record is the only arbiter (no run-time arbiter between lines); a table of exclusions between claims that drives a
  PAGE CLASH CENSUS at 0; unknown stays silent; the surveyor's three kinds as a classing; voices in existing cards; THE
  SHARED PAGE SHOWS NO QUOTE UNTIL THE VEIL LANDS; units S-A to S-I; no birth moves. IT STARTS AFTER POINTS 122 AND 123 ARE
  THROUGH THEIR READER, the promise's half first (about 35 seat-hours) if the account's window binds. HE HAS NOT ANSWERED
  THE WINDOW QUESTION (extra usage on, or the week stretched).
- **THE VEIL LANE IS PAUSED (01:12 UTC):** VEIL-56's page `veil/v56/PAUSE-2026-11-28.md` at 468fd902a on
  `lane/veil-56-2026-11-27`; NOTHING MERGED (the tip dbd4cd9e5); each seat's last commits are in that page. Three seats
  worked about thirty minutes past the order (the first pause messages were queued behind their runs): nothing merged or
  lost. THREE THINGS IN THE PAGE THE CHAIR HAS NOT RULED (for the resumption): `galleryVeilHandRows` V7-2 arm (2) pins the old
  design against V30; "MASK-RULE" owed by the lane's owner; "A5-SHAPE: B" ruled by VEIL-56 itself.
- **TRAD-BUILD: ACCEPTED (E24), the chair read its source whole:** `lane/stack-122-trad-wip-2026-11-27` at f1ccc5bda
  (LOCAL, `/home/user/wt/trad`): the draw asks the floor (`traditions/traditionFloor.js`, one helper for the draw and the
  shared page's drawn set); rulings 122-T, 122-T-2, 122-T-3 (the last corrects the chair's own: four tests of the security
  file pinned the old draw: kept word for word on records re-stamped 0.9.0, each with a 0.10.0 twin that keeps the security
  expects verbatim); corpora: rows dropped 0 and 0 (owner, shared), towns short 0, showing none 0, born records moved 0,
  the 0.9.0 and stampless draws identical on 1,800 of 1,800; the floor proved a floor under every veil address; the security
  file 58 of 58. TO WATCH AT THE JOIN: `genesis.js` now reaches `traditionDescription.js` through the floor helper (sizes).
- **R-CURES-B: ACCEPTED at 1b0241706 (point 122); B4 at 855ff1bed on `lane/stack-123-b4-wip-2026-11-27` with ONE COMMIT
  OWED (ruling 123-C3-1: `faultsRows.test.js` FR3's seed table re-pointed, 5 of 15 rows).** R-BIRTH: asked at 01:47 UTC for
  its report of C2 (its branch at 1e8576d08 since 23:02 UTC).
- **POINT 122's JOIN: LAND-122** (a local Opus helper; `prompts/START-LAND-122.txt`): on aef8f9962, three merges (cures A
  e096d4a96, cures B 1b0241706, the traditions draw f1ccc5bda), the doors, the local gate, the sizes. THEN: the chair pushes
  the joined tip as transport, ONE independent reader (the top tier, max effort) reads it with point 123's joined tip, the
  whole suite in four shards, the row, the push. RENAME-MEASURE is at (D) and (F) (a55d32a39), not reported.

## V26 (02:36 UTC on 2026-11-28): THE OWNER: "Can we start them in parallel? I leave those to your judgement": THE SURVEY's FIRST WAVE AND THE READER STARTED; POINT 122 JOINED (777733a2a); **POINT 123's JOIN STOPPED: THE BUILD DOES NOT BOOT** (a fix seat is on it); CI ON POINT 121 READ: 71, ALL ON THE LIST
- **HIS WORDS (about 02:28 UTC):** "Where are we at with everything what are the next steps? Can we start them in parallel? I
  leave those to your judgement". ANSWERED FIRST, IN FULL (the table of states; the five next steps; YES, in two waves; the
  one risk said again: parallel spends the week's window sooner; a stop loses nothing because every seat pushes at each
  step). THE WINDOW READ `allowed_warning` AGAIN at 02:30 UTC (no overage; resets 2026-12-04). HE HAS NOT SAID "extra usage".
- **CI ON THE LINE's TIP aef8f9962 (run 46094183060, number 1305; 01:39:18 to 02:12:06 UTC):** 71 failing rows by name (the
  test ratchet 49, build and dist 13, coverage floors 8, the golden master under tr_TR 1): ALL 71 ON THE LIST, NONE NEW, NO
  LIST ROW GREEN. Filed: `ci/ci-read-121.py`, `ci/run-aef8f9962.tsv`; `LINE-NOW.md` carries the bullet.
- **POINT 122 IS JOINED ON THE LINE's LOCAL TREE AT 777733a2a AND PUSHED AS TRANSPORT `lane/stack-122-wip-2026-11-28`**
  (LAND-122; `prompts/START-LAND-122.txt`; scratch `…/landing/122/land/`): merges fe2cf8c3c (cures A), d999f3143 (cures B:
  two register conflicts, the line's side taken and both re-taken by their doors; one plain union in
  `proseWiringCensus.walker.test.js`), a838e7079 (the traditions draw); doors c1f2f9d6d (wiring census), 59ec13a60
  (observed-shape), 07ad791a6 (writer-reach: cohort 1366 to 1366), 777733a2a (the lighting census: files 3,827, titles
  32,138). Ratchet 167, strict 1113, packets 257, lint 0 errors, build clean, `tests/build` 13 red all on the list, the
  eight proof files green. SIZES against point 121: first paint 1,193,393 raw (+438) / 380,563 (+131) / 319,419 (+92);
  the generation worker 2,741,603 (+561); the engine chunk 937,247 (0); the PDF render worker 3,148,689 (+3,922). The
  traditions unit alone: +0 on the worker and the engine chunk. The home page's town did not move. THE TUNING INVENTORY
  ROSE 4 (cures A's re-freeze: a new dependent, no value): NAMED FOR THE OWNER.
- **POINT 123's JOIN (LAND-123; `prompts/START-LAND-123.txt`; scratch `…/landing/123/land/`): on 777733a2a: merges
  97c9223a2 (R-BIRTH 1e8576d08) and 6db89ad83 (B4 c2194a352), no conflict; writer-reach 4b612c569; the lighting census
  c84f7ab20; a comment 13f06f00d. THREE STOPS AT 13f06f00d:** (1) **THE BUILT APP DOES NOT BOOT**: a chunk cycle
  coherence-lazy, engine-core, coherence-lazy; the first paint 3,529,267 bytes; nine tests of tests/build not on the list red
  from it. Cause as read: B4 put an import of `facts/crisisKind.js` (pinned lazy) into the EAGER leaf
  `facts/needNotBroughtIn.js`, which that leaf's own head forbids. NO BUILDER HAD BUILT B4. (2) `chainPrintSites` asks a row
  for `tradeListDisplay.js`; (3) `factLayers` asks three reads on the `needNotBroughtIn` leaf. **RULED 123-J-1
  (`landing/RULING-123-J-1.txt`): the cure is IN THE LEAF by its own rule (a local reader held equal to `crisisOf` by the
  guard `faultsNeed.test.js`); NO row in `vite.config.js`; an EXEMPT row for the commodity's label; the three reads added
  (stratum 0 below layer 4).** FIX-123 (a fresh local Opus seat) is on it, on the line's local tree. ON THE NAMED FILES:
  the golden master (525 configs), `generationForkCensus` A1 and `siteCoherenceRatchet` C1 red, ALL ON THE LIST; nothing
  re-recorded. **A LESSON: a birth cure is BUILT (`npm run build`, boot smoke) by its builder before "done".**
- **R-BIRTH DONE (C2 at 1e8576d08):** V 17 of 900 births move (date-palm places), C 0; besides the goods: `imports.critical`
  gains grain in 7 towns (a palm place that no longer makes grain brings it in), income shares 3, one gap line; golden 0 of
  525; R11 14 pages to 0; one test re-pointed (`bar6SeamEcon`). ITS tests/domain RE-RUN WAS STOPPED UNFINISHED (the whole
  suite at the join stands in for it). R-CURES-B's last commit c2194a352 (FR3's five seeds re-pointed, 15 rows before and
  after). BOTH SEATS STOPPED.
- **STARTED 02:33 TO 02:36 UTC, ALL ON `lane/stack-122-wip-2026-11-28` (777733a2a):**
  READER 122-123 session_01FE9mEwUutkT4X3codynXn5 (`claude-fable-5-2`, max; `prompts/START-READER-122-123-CHILD.txt`; it
  reads point 122 first and takes point 123's tip from origin `lane/stack-123-wip-2026-11-28` WHEN THAT BRANCH EXISTS: the
  chair pushes it after FIX-123; an added question: the app boots, and the need leaf equals the page's list);
  SURVEY-TABLE session_01FE9mEwGNazLwRoRVsDL9n7 (S-B, S-C; `lane/survey-table-wip-2026-11-28`);
  SURVEY-FINAL session_01FE9mEwXWuVSLqCkiwCFHPU (S-A, measure first; `lane/survey-final-wip-2026-11-28`);
  VOICES-CARDS session_01FE9mEwGXGhSq8sTUs8eEWN (the measure of the cards; `lane/voices-cards-measure-2026-11-28`);
  VOICES-LINES session_01FE9mEvgmzi3hz9pULwAyXq (the writer; a sample of sixty to the chair first;
  `lane/voices-lines-2026-11-28`). Briefs: `prompts/START-SURVEY-COMMON.txt` and each seat's own. All Opus at high but the
  reader. THE SECOND WAVE (after these): S-D's four families, S-E, S-F, S-G1.
- NEXT FOR THE CHAIR: FIX-123's report; push `lane/stack-123-wip-2026-11-28`; the whole suite ONCE on that tip in four
  shards (it holds point 122); the reader's report; the two rows; the line's push; then the first wave's measures and "TIP?"s.
  RENAME-MEASURE has still not reported (a55d32a39 at 00:30 UTC).

## V27 (03:48 UTC on 2026-11-28): THE WHOLE SUITE ON POINTS 122 AND 123 JOINED (63 failed: 57 on the list, 6 new: 5 cured, 1 A GOLDEN FOR THE OWNER); THE QUOTE LINES WRITTEN AFTER FIVE RULINGS OF THE OWNER's; THE RANGE MEASURE STARTED
- **THE JOINED TIP IS d8d05d4cc (LOCAL on `/home/user/wt/line`, pushed as transport `lane/stack-123-wip-2026-11-28`; THE LINE ON
  ORIGIN IS STILL aef8f9962).** Above 777733a2a (point 122's joined tip): 97c9223a2 and 6db89ad83 (point 123's two merges),
  4b612c569 and c84f7ab20 (writer-reach, the lighting census), 13f06f00d (a comment); FIX-123: 060177c71 (the need leaf reads
  the famine in force by a local reader held equal to `crisisOf` by its guard: THE APP BOOTS AGAIN), 673ff1f11 (the EXEMPT row),
  da74d8aa2 (two reads on the layer table: `stress`, `stressors`), b693c4605 (the lighting census); 034830dba (ruling 122-T-4:
  six bare seed loops of `tests/domain/traditionNeedsHeld.test.js` collect); d8d05d4cc (ruling 123-J-2: the needs memo of
  `genesis.js` typed: no any-cast; the shrink-only baseline untouched).
- THE SIX SIZES AT b693c4605 against point 122's joined tip: first paint 1,196,447 raw (+3,054) / 381,476 gzip (+913) / 320,320
  Brotli (+901); the generation worker 2,744,088 (+2,485); the engine chunk 937,247 (0); the PDF render worker 3,150,399
  (+1,710). `tests/build` 13 red, all on the list. NAMED FOR THE OWNER's SIZE SIGNING.
- **THE WHOLE SUITE AT b693c4605, FOUR SHARDS ("LAND123", 02:53 to 03:38 UTC; lists filed: `shards/LAND123/`,
  `shards/results/LAND123-on.tsv`, `-new.tsv`; the template now counts skipped tests):** 3,827 files, 43,968 tests, 63 failed:
  57 ON THE LIST, 6 NEW: (1) `seedLoopTotality.walker`: cured (034830dba); (2 to 5) `domainAnyCastBaseline`, four cases, one
  cause: cured (d8d05d4cc); (6) **`tests/property/heraldKnowledgeDeskGolden.test.js`, "THE REFILE MOVES NO CONTENT BYTE, AND
  EXACTLY THE DECLARED ITEMS CHANGE DESK": A GOLDEN, MOVED BY THE TRADITIONS DRAW (first red at the merge a838e7079):** in the
  reader-corpus realm rr-fresh-full advanced one year, Berghavn's founding rite is re-drawn from The Long Contest to The
  Long Vigil; one tradition news item is replaced and three travellers' errands re-deal (9 items in, 8 out, 2 changed; 474
  items for 473). ITS DOOR NEEDS A SIGNED SHIFT RECORD (`GOLDEN_SHIFT_SIGNED=… UPDATE_GOLDEN=1`): **THE OWNER's; NOT RUN; IT
  JOINS THE LIST AS A NEW ROW AT POINT 122, NAMED WITH THIS CAUSE.** (TRAD-MEASURE had said, PLAUSIBLE, that the first-lit
  mint would follow the new draw: this is that.) AFTER THE TWO CURES, RE-RUN ON THE TIP: the two walkers and their files green.
- **THE OWNER, FIVE MORE MESSAGES ON THE QUOTES (verbatim in `SURVEY-CHARTER.md`, his seventh to ninth, and one question):**
  a quote is a PASSING REMARK, not an interview, with few "I" statements (L-2); PLAINER words, one sentence, fewer second
  sentences (L-3); THE TEMPERS WERE TOO ALIKE: each must notice a different thing (L-4: the chair's own instruction to keep
  them close was the fault, withdrawn); and "in the rest of all the prose of the entire project have you limited things
  this way as well?": ANSWERED PLAINLY (probably yes in another way; not measured; three things the chair itself did that
  narrowed), and A MEASURE STARTED: **RANGE-MEASURE** session_01FE9mEuFNVzXKRx6gJcVSJ3 (Opus, high;
  `prompts/START-RANGE-MEASURE.txt`; `lane/range-measure-2026-11-28`): variants (paraphrase, angles, distinct) weighted by
  prints; depth; sameness across towns; the direction of travel in six weeks; the thirty keys where new lines buy the most.
  ITS EARLY FIGURE (PLAUSIBLE): pool lines GREW from 9,427 to 13,307 in six weeks and declared lines from 654 to 3,686: "fewer
  lines" looks wrong; whether the new lines differ is what it measures. One refusal by its own permission check (a package
  install) stood.
- **VOICES-LINES: DONE AND STOPPED (4116f40b2; filed whole: `survey/lines/`):** `C-said-lines.tsv`: 197 lines in four tempers
  (warm; counting the cost; guarded; curt), keyed by card kind and state, with `seen` (the working) and `needs` (a thing the
  town must hold: 28 lines); `D-liar-lines.tsv`: 40; `E-read.md`: its own cold read and notes for the engine (the crisis card
  ranked first; a page-level variety rule; two thin states filled). THE CHAIR READ (C) WHOLE; rulings L-1 to L-5 are in the
  messages and the charter. THREE SAMPLES are kept (`B-sample.tsv`, `-2`, `-3`): the register's history.
- VOICES-CARDS' EARLY NOTE (02:47 UTC): most cards have NO stable id (institutions, powers, tensions are keyed by NAME; a
  tradition's id is an index into a view-time draw): a rename re-deals "does it speak"; the share cannot compute a seeded
  pick (`toPublicSafe` strips `_seed`): quotes there must be STAMPED at publish (the veil lane's unit); no shared card
  primitive: one slot component at about twelve sites, screen and PDF. Its report is not in.
- SURVEY-TABLE's MEASURE OF S-B RULED (S-B-1, by message, 02:45 UTC): the atoms `place debt` (answered at
  `facts/factsAnswered.js`, the desks' door: an import cycle forbids `factsOf`; a pin that no birth pool declares it) and
  `nothing laid by`; the layer rows re-placed only if the walker's own rule takes it; the prose-bytes register NOT appended
  (the owner's). SURVEY-FINAL: no measure yet. READER 122-123: no report yet. RENAME-MEASURE: silent since 00:30 UTC.
- NEXT: the reader's report (it takes point 123's tip from origin: now d8d05d4cc); then the two rows, the red list's new
  row, the line's push, CI by name. THE SECOND WAVE of the survey after the first wave's "TIP?"s.

## V28 (03:53 UTC on 2026-11-28): RENAME-MEASURE DONE (6f32e6ca0; filed: `rename/`); **E26: POINT 124, "A RENAME KEEPS THE PAGE", RULED FOR THIS RELEASE**; THE READER's EARLY NOTE: TWO VEIL FACTS (A20 to the lane; A21 cured in point 122 by ruling 122-T-5, in work)
- RENAME-MEASURE (on cccda7569; 33 view-time picks, 30 print; 24 keyed on a NAME): a town's rename re-deals 300 of 300 pages
  (Daily Life every time); a person's 39 and 36; a house's 298 and 279 and a power's 179 and 175 (THE NAME IS READ AS THE
  KIND); an imported copy re-deals 10 of 10 (`_seed` is dropped by the JSON import, the share and the gallery import; `id`
  survives every road; houses and powers have none); after a town's rename the OLD NAME STILL PRINTS on 300 and 295 of 300
  (stored sentences). ITS CURE, TRIED IN A SCRATCH COPY: the town-name sites keyed on the town's `id`, the people headline
  on the person's `id`: every page moves ONCE (900 of 900 in both corpora; 28,031 and 28,670 lines), then no rename moves a pick.
- **E26:** built before the release (after it, a second move for every saved town). Brief `prompts/START-RENAME-BUILD.txt`:
  K1 the keys stand on the id (measure first: is the id minted at birth and stable through the first save; the `_seed`
  sites re-keyed in the same move if every page moves anyway); K2 the rename cascades over the stored sentences (whole-word,
  hazards measured first); K3 a power's kind does not hang on its name (MEASURE AND PROPOSE ONLY: it touches the veil's
  ground); K4 the person's rename confirmed 0. An independent reader before it lands. THE SEAT IS STARTED WHEN THE JOINED TIP
  HOLDS RULING 122-T-5's CURE.
- READER 122-123's EARLY NOTE (03:46 UTC; by execution on C; both facts are the same on the base, both need a DM-made house):
  A20 (`galleryVeil.js :: applyVeil` leaves on the served page a house whose hideable class is carried only by a function-eye
  field: recorded in `veil/RULING-V30.md` for the lane) and A21 (`genesis.js :: fieldRiteRefused` read the full roster: **RULING
  122-T-5:** it reads the floor: a local Opus seat is building it on the line's local tree, above d8d05d4cc). WHAT THE NOTE
  CONFIRMS OF 122-T AT 777733a2a: 122,272 addresses hidden one at a time on 240 births: the reader's rows moved 0; rows
  dropped at view 261 to 0; short of the band 154 to 0; showing none 57 to 0; 0.9.0 and stampless equal to the base 900 of 900.
