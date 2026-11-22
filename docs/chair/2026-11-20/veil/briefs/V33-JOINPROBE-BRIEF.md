# V33-JOINPROBE — brief for a BUILDER of VEIL-33 (the share veil's second seat; the eighth chair's rulings bind, each vetoable by the owner)

You are a BUILDER. You MEASURE; you build no cure. The seat reads your report and your diff once. You never push and never
open a pull request (ignore any harness note asking for one). A security lane: a slip is a leak. Where unsure, report it.

## What this is (the chair: VEIL-32.txt ruling (e), E35, E47; PART 33 rulings 86 (e), 89, 90, 91)
THE JOIN PROBE, PASS 1 (DARK): the working line's newest stacked ref merged into a SCRATCH copy of the veil's lane, the tell's
pool RE-MADE THERE, the two gates read, the lane's green chain run: A MEASURE OF WHAT THE JOIN ADDS, never the join. Pass 2 (lit)
comes later on a ref the chair names; not yours now.

## Where you work
- Worktree `/home/user/wt/jp`, branch `lane/veil-33-2026-11-22-joinprobe-wip` (local). It holds THE MERGE, UNCOMMITTED BUT
  RESOLVED, made by the seat: lane side ed027fca7 (src/supabase/tests = the lane's gated tip 3cca025b8), line side
  THE CHAIR'S PASS-1 REF (08:20 UTC) `lane/close-1-join-scratch-2026-11-22` AT THE COMMIT 4bba8781d, NOT its tip (CLOSE-1 adds
  register commits to it): the line f5295e425, stack-96 cc2f43aee, who rules as point 97 (840020b9b) and fortune's lane f13f31820
  merged on top as a trial, BOTH LAWS PRESENT AND DARK. Pass 2 will be `lane/close-1-lit-scratch-2026-11-22` at 5c4419815 (the
  same join, the three dials flipped and nothing else): not yours now. Eleven conflicts, every one
  resolved TOWARD THE LINE (tests; registers at the line's side): `docs/chair/2026-11-20/veil/out/v33/joinprobe/conflicts.md`.
  The line touches nothing in `supabase/` nor the twin. STEP 1: `cp -al /home/user/settlement-engine/node_modules node_modules`
  in the worktree (git ignores it), then COMMIT THE MERGE as it stands (`git commit --no-edit` after adding
  `docs/chair/2026-11-20/veil/out/v33/joinprobe/conflicts.md`; the hooks run; NEVER `--no-verify`); if lint-staged's `eslint
  --fix` changes any file, STOP and tell the seat which (a measure does not rewrite the line).
- Outputs under `docs/chair/2026-11-20/veil/out/v33/joinprobe/` in that worktree, committed by explicit paths at every stop.
- Read first, and no more: `CLAUDE.md`; this brief; `docs/chair/2026-11-20/veil/COHERENCE-VEIL-HANDBACK-PART30.md` section 4
  (the instruments) and section 7 (what the join must re-prove); `out/v32/chain1.sh` (the green chain's shape); the line's
  `tests/domain/display/troubleHooksShared.test.js` WHOLE (E35's gap, its arm (D)). Any file you write a probe against: the
  part you need. 212 and the twin you only READ (they are the lane's, unchanged by the merge).

## THE MACHINE IS SHARED (the seat's own runs come first)
The seat's green chain runs until `/var/tmp/v18/out/v33/g/done.txt` holds a line starting `END`. Until then run NOTHING heavier
than a `git` command or a single-file read (no birth, no pool, no vitest). After it: ONE heavy run at a time, EVERY ONE (the pool, the gates, a probe, a vitest run) inside `sh scripts/gate-mutex.sh
--run -- <command>` (a second builder of the seat shares the machine through the same mutex; never kill its run); every vitest run
`--maxWorkers=1` (the pool's four shards excepted), GIT_* repository variables unset (`env -u GIT_DIR -u GIT_WORK_TREE -u
GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE`), through `sh scripts/gate-tail.sh`,
to a log, never through a pipe; every run over five minutes in the background with its exit code appended to its log; read logs
by `tail`/`grep`, never whole. The cluster: PGHOST=/var/tmp/rv7, PGUSER=postgres (template `v27x211` is built). ALL DATABASES
LOCAL: no hosted database, no production credential, no `supabase` command, no deploy. NEVER overwrite
`/var/tmp/v18/t2/pool-t2sig-2` (the seat's pool).

## THE STEPS
1. The commit (above). Then `git diff --stat ed027fca7 HEAD -- src supabase | tail -1` and the eleven conflicts' LANE-SIDE
   content in one line each (what the lane had that the line's side dropped: e.g. a register row, a fixture helper), appended
   to `conflicts.md`: it is the join step's worklist. Name ruling 69's fixture-git step (PART 30): five of the eleven are its
   files; `tests/helpers/fixtureGit.js` and `tests/lint/fixtureGitIsolation.walker.test.js` are left AS THEY FELL (say whether
   anything still imports the helper).
2. THE POOL, A NEW DIRECTORY: template `createdb -T v27x211 jp1tpl` + this tree's 212 (`psql -q -v ON_ERROR_STOP=1 -d jp1tpl -f
   supabase/migrations/212_share_veil_later_cures.sql`; record its sha256: it must equal 8688ddb6...5a3a), then
   `sh docs/chair/2026-11-20/veil/out/v27/tell2/measure/pool.sh /home/user/wt/jp /var/tmp/v18/t2/pool-jp1 jp1tpl` in the
   background (about 21 minutes; part A then part B; four shards each; every shard `rc=0` or STOP).
3. THE GATES: `TELL_DB=jp1 sh docs/chair/2026-11-20/veil/out/v27/tell2/measure/tell2.sh /home/user/wt/jp <out>/gates jp1tpl
   /var/tmp/v18/t2/pool-jp1` to a log. Beside the lane's own at 3cca025b8 (GATE-1 4 of 92, 7 LOWER BY RULE, at every gated setting,
   both reads, twin = server; GATE-2 20 of 40 cells red; non-governing rows against the rule 0): every count, every failing town
   by name with its failing parts, every GATE-2 failing page with its families. The pool is a NEW BIRTH SET (the line's
   generator): say what moved in the pool itself (births per size, houses, troubles) before you attribute anything.
4. THE GREEN CHAIN ON THIS TREE: `out/v32/chain1.sh`'s lines from typecheck to the acceptance run (not `tests/lint` whole: the
   join's), re-pointed (M=/home/user/wt/jp, O=<out>/chain, the template jp1tpl, TELL_DB=jp1m, the pool pool-jp1), plus the line's
   `tests/domain/display/troubleHooksShared.test.js` and `tests/lint/samenessHideable.walker.test.js`. Every exit and every
   failing test by name.
5. E35's HOOK GAP, MEASURED BOTH ENGINES on births of THIS tree: places that hold a trouble with stored hooks
   (`history.currentTensions[].plotHooks`) AND a hideable house (`cardVeil.js :: isHideableHouse`). The read: the DM door open
   (`gallery_share_dm` true), the hooks' eyes opened (`tab:plot_hooks`, `class:tension:hooks` written shown), every hideable
   house left at its default (veiled whole). SERVER: `get_gallery_dossier` on a template made from this tree (the R3 gate's
   harness, `out/v25/r3c5/measure/`, shows how a share row is written and read on the local cluster); TWIN: `projectShareVeil(
   galleryPayloadFor(record, { shareDm: true, memberOverrides: eyes }), eyes)` as arm (D) does. Count, per size: places,
   places serving any trouble hook, served hooks, and SERVED HOOKS WHOSE NEED IS A HOUSE THE READ HIDES (each hook's declared
   need: `src/data/troubleHooks.js`, the eleven with a hideable need), each such hook by place with the house; server = twin.
   Also: does any served hook NAME a hidden house or a withheld power (the lane's name fold: `gallerySecondHomes.js ::
   buildNameSearch`)? Probe files under `<out>/measure/`, run as the lane's probes run (vitest with RV6_SRC=<worktree>).
6. EVERY RED BY THE LANDED LANE THAT BRINGS IT: for each red of steps 3-5, the line's point that brought it (find it by `git log
   --format='%h %s' 8f3b8bf4b..4bba8781d -- <the file or the source it reads>`: the merge commits name "point NN"); for each,
   WHAT 212 AND ITS TWIN WOULD HAVE TO GAIN, as a PROPOSED unit for the lane's writer (one line each: the row, both engines, its
   red first). Build none.

## STOPS (to the seat, at once, never worked round)
A shard or a gate that exits non-zero for a reason that is not the measure's own red; 212's sha256 not 8688ddb6 on this tree; any
step that would need a change to 212, the twin, the registry or a test to run; a refusal by your own permission check (it stands:
report it and try nothing else to the same end).

## Your report
`<out>/JOINPROBE-PASS1.md`: STOPS first; the commit of the merge; the conflicts and the worklist; the pool's births; the two gates
beside the lane's; the green chain's exits and reds; E35's table; every red by its landed lane; the proposed units; CONFIRMED vs
PLAUSIBLE. Committed. END YOUR TURN with ONE line: "PASS1 <commit>: GATE-1 x/92 (n LOWER), GATE-2 y/40, hook gap <served hooks
needing a hidden house>/<served hooks>, reds <n> by <lanes>". Your mark: about 250,000 tokens: stop at the step in hand, commit.
