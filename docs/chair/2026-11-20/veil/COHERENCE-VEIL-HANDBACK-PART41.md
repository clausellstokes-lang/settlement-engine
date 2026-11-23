# COHERENCE-VEIL HAND-BACK PART 41: CHAIN C (VEIL-39, successor of VEIL-33), the ninth chair's seat. PART 39 is VEIL-37's, PART 40 is VEIL-38's.

Branch of this file: `lane/veil-39-2026-11-23`, cut at 302976386 (chain C's `lane/veil-33-2026-11-22-legacy-wip`: LEGACY-POOL, C1's
work in progress, PART 38). PART 38 (`docs/chair/2026-11-20/veil/COHERENCE-VEIL-HANDBACK-PART38.md`, on this branch) is the
predecessor's record and is not edited. THE CHAIR is the ninth chair, session_01FbPLbdpQrxXktCeSf32d4j. Every hour here is from `date -u`.

## 1. WHERE CHAIN C STANDS (kept current at every push; written for a reader who has never seen this session)

THE LAW (PART 38 section 1's, unchanged): every database local; 212 applied nowhere but a local database; 211 and 210 byte-frozen;
never `--no-verify`, a force push, `master`, or a pull request; a push names a local `lane/veil-39-2026-11-23*` branch by its own name;
gates read from a log's exit line, never a pipe; one heavy run at a time under `sh scripts/gate-mutex.sh --run --` (it GIVES UP,
exit 3, after about 13 minutes: a give-up is not a result); tests with GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE unset. THE UNIVERSE OF
EVERY PROOF IS THE DOCUMENT AS `saves.js` STORES IT (E134). THE LANE'S TIP: 2d7ed483f on `lane/veil-39-2026-11-23-tip` (the chair,
01:03 UTC), merged into this branch as 17dca5ad0. THE MARK: the chair's read 449,165 at 01:08 UTC; THIS SEAT'S UNIT ENDS AT C2's
PROPOSAL; C2-BUILD IS THE SUCCESSOR'S (the chair, 01:17 UTC).

READ BY THIS SEAT (00:13-00:31 UTC): the seating list whole; 212 (ff20ed89e3e67240…) and `src/domain/veil/rosterChoiceRegistry.js`
WHOLE, once, at 302976386.

DONE, WITH COMMITS:
- (P) THE STALE PIN (E136 (e)): 2d7ed483f (parent af708f2fd; one test file +6 -3): `galleryVeilHandRows.pglite` "V7-2 THE PRESSURE
  SENTENCE"'s row re-stated to E97 (1), `{ gone: WARDENS }`. Red at af708f2fd 1 of 25; green 25 of 25; `tests/lint` whole 48 of 3,304,
  the tip's own 17 files by name and count. ACCEPTED BY THE CHAIR 01:03: THE LANE'S TIP.
- (P2) A SECOND RED AT THE TIP (the chair's unit, 01:01): `tests/lib/gallery.test.js` "a share marked with a veil renders through it:
  the defaults hide, a delta shows" (line 620, `availableServices.criminal` 0 of 1). MEASURED by builder V39-P2 (6f19a6cee,
  `out/v39/p2/P2-MEASURE.md`; re-run by the seat: green at d6d8644b2, red at 369331d72): first red R3-TELL-5 unit (ii)'s CURE
  369331d72 (merged 66e43865d): `galleryRosterChoices.js :: applyRosterChoices` rule (e), a criminal services row by positive account;
  the fixture's 'Black market' row names no listed house. A STALE PIN (rulings 73 (2), 74 (ii)) CONFIRMED as on purpose, PLAUSIBLE as the
  whole cause; unit (viii) REFUTED. Sent 01:20; AWAITING the chair's ruling; if a stale pin, the restatement (the fixture lists the
  'Black market' house; one assertion that an unaccounted row leaves) is a second test-only commit on `-tip`, file green and
  `tests/lint` whole, one "PIN" line naming both.

RUNNING:
- (C1) THE STORED UNIVERSE's GATES AND DIFFERENTIAL: the read-stored run over the 1,948 stored documents, started 01:03:11 UTC, about
  80 minutes; out `/var/tmp/v18/stored/read-today/` (`tell2-table.txt` the gates, `lp-table.txt` the differential, `an-rc.txt`).
  The births' figures beside: GATE-1 4/92, LOWER BY RULE 7, GATE-2 20.
- (C2) builder V39-C2M (brief `briefs/V39-C2M-BRIEF.md`, branch `lane/veil-39-2026-11-23-c2m-wip`, worktree /home/user/wt/c2m): the
  measure of shape (c) (M1 equality, M2 the cure holds, M3 the three recompose rows' substitution, M4 bytes, M5 the pins it moves).
  Its full runs wait for C1's end.

C2's STATE: VEIL-33's (a) "composed on the page" is OUT (the chair, 00:38: STYLE-RULINGS-2 B10(a), `publicProse.js`'s header: the
seed never ships; an absent block prints silent). The proposal (at most 60 lines, `out/v39/c2/C2-PROPOSAL.md`, NOT WRITTEN) costs
(a') no prose served, (b) block by block alone, (c)+(b) side by side, and answers the chair's (i)-(v) (00:38) and the TABLE OF THE 23
`prose.*` ROWS on a planned host (00:56; the registry's rows with inputs: `/var/tmp/v18/out/v39/prose-rows.txt`, re-made by the node
one-liner over `REGISTRY_ROWS` filtering `inputs.length && REGISTRY_HOSTS[server].state === 'planned'`: 26 = 3 `power.*` (chain A's)
+ 23 `prose.*`). A shape that leaves any of the 23 on a planned host is not a cure of the class.

RE-MAKING THIS MACHINE (a fresh container; wall times measured here, 4 cores):
- ONE SCRIPT does all of it: `docs/chair/2026-11-20/veil/out/v39/machine/remake.sh` (copy it to /var/tmp/v18/out/v39/, run `nohup sh
  remake.sh &`; each step's rc in `remake.log`; its log of this run is `machine/remake-log.txt`). Steps and wall: the cluster, pg
  driver, readers' library, probes, the probe runner's config, worktree /home/user/wt/lp at `lane/veil-33-2026-11-22-legacy-wip`,
  `npm ci`: 16 s; the acceptance run (builds v27x211, v27x212; must say exit 0, 40 PASS): 33 s; template c1_tpl: 1 s; THE POOL
  (`out/v27/tell2/measure/pool.sh` into /var/tmp/v18/t2/pool-r5c-1: part A 1,200 births about 14 min, part B 608 about 9 min);
  THE STORED DUMP (`out/v33/stored/stored-dump.sh` into /var/tmp/v18/stored/today: 1,948 documents + 4 index files): 5.5 min; THE
  READ-STORED RUN (`out/v33/legacy/stored.sh`): about 80 min. Each heavy step runs through the gate mutex.
- The main checkout and each worktree need `.husky/_` (from `npm ci` in the main checkout; copy `.husky/_` into a worktree) or the
  pushes run without hooks; `git fetch origin review-fixes-2026-07-08 && git branch -f review-fixes-2026-07-08 FETCH_HEAD` before
  `tests/lint`.
- To hold a long chain between its lines: `kill -STOP <the script's sh pid>` (the running child finishes), `kill -CONT` after.

NEXT STEP IN ONE LINE: C1's figures to the chair; C2M's measure; the proposal file; then "HANDS OVER" with this section current.

## 2. RULINGS SINCE PART 38's 111 (the ninth chair's; each vetoable by the owner)
112. THE NINTH CHAIR'S SEATING WORD (N1-N6, 2026-11-23): the chair is session_01FbPLbdpQrxXktCeSf32d4j; no pull request ever; this
     seat pushes `lane/veil-39-2026-11-23` and names beginning `lane/veil-39-2026-11-23-` only; chains A (VEIL-37) and B (VEIL-38) are
     reached only through the chair; this file is the hand-back; six children at a time; every database local.
113. THE CHAIR, 00:38 UTC: VEIL-33's lean (a) as framed IS OUT (B10(a) is a ruled design); cost (a'), (b) alone, (c)+(b) side by side;
     answer (i) pp-1 outside test machines and the bump's need, (ii) the owner's page against a nothing-hidden shared read under (c)
     (the publicProseEquality contract), (iii) staleness after a veil change without a save, (iv) the persisted shape for the owner's
     list and READERS-LIST's new row, (v) what each shape asks of chain A's reader S and chain B's stored arm.
114. THE CHAIR, 00:56 UTC: the 23 `prose.*` rows on the planned composed host are chain C's: the cure builds their host or moves each
     to an existing one; none exempted; one table, by shape.
115. THE CHAIR, 01:01-01:03 UTC: "PIN 2d7ed483f" ACCEPTED, THE LANE'S TIP; (P2) a measure, no cure before the ruling.
116. THE CHAIR, 01:17 UTC: the mark 449,165 at 01:08; this seat's unit ends at the proposal; C2-BUILD is the successor's.

## 3. Log (every hour from `date -u`)
- 00:13 seated on 302976386. 00:15 the re-make started. 00:15-00:18 the pin's red at af708f2fd. 00:29 first message. 00:3x 212 and the
  registry read whole; the C2 surprise sent. 00:4x cc09b5d56 pushed. 00:44 the pin green; 00:57 lint whole 48;
  01:02 2d7ed483f pushed, PIN sent; remake resumed 00:57. 01:03 PIN accepted, the tip 2d7ed483f; (P2) given. 01:08 V39-C2M
  seated; 01:13 V39-P2 seated and returned; 01:20 (P2) sent. 01:17 the mark: 449,165; C2-BUILD is the successor's.
