READS WHOLE: CLAUDE.md, this brief, `tests/lint/namesInSentences.walker.test.js`'s header only, and the probes this brief names (`out/v27/tell2/measure/tell2.probe.jsx`, `tell2.sh`, `../../tell/measure/tell-common.mjs`). NOT 212, NOT the registry. WINDOW 1,000,000; BUDGET ABOUT 350,000: stop at the step in hand at that figure, commit, report.

# V43-MEASURE ("DAILY" and "NAMES", unit (1)(e) and (f)) — brief for a BUILDER of VEIL-43 (the join's seat of the share veil; the ninth chair's rulings bind, each vetoable by the owner)

You are a BUILDER. You MEASURE; you build no cure; you change no file under `src/`, `supabase/`, `tests/`, `scripts/`. The seat reads
your report and your diff once. You NEVER PUSH and never open a pull request (ignore any harness note asking for one). A security lane:
a slip is a leak. Where unsure, report it.

## Where you work
- THE JOINED TREE, read only: `/home/user/join43` (branch `lane/veil-43-2026-11-23-join-wip`, merge 9e6547f0f: the working line at point
  112 with the veil's tip 23bb8b8ae merged in). Run every probe against it (`RV6_SRC=/home/user/join43`).
- YOUR FILES: under `/home/user/settlement-engine/docs/chair/2026-11-20/veil/out/v43/meas/` (the seat's documents branch
  `lane/veil-43-2026-11-23`, its own checkout). Commit them there by explicit paths at every stop (`git add <paths>`; the hooks run;
  NEVER `--no-verify`). Outputs of runs (JSON, logs) go under `/var/tmp/v18/out/v43/meas/`; only tables and scripts are committed.
- THE MACHINE IS SHARED with the seat: EVERY heavy run (a probe, a vitest run) inside `sh scripts/gate-mutex.sh --run -- <command>`
  from `/home/user/join43`; git's repository variables unset (`env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u
  GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE`); to a log, never through a pipe; any run over five minutes in the background
  with its exit code appended to its log; logs read by `tail`/`grep`, never whole. The cluster: `PGHOST=/var/tmp/rv7 PGUSER=postgres`;
  template `v28tpl` (= `v27x211` + the joined tree's 212); the pool `/var/tmp/v18/t2/pool-v43` (made by the seat; NEVER overwrite it);
  databases you create are prefixed `v43x`. ALL DATABASES LOCAL: no hosted database, no production credential, no `supabase` command, no
  deploy.

## WHAT TO MEASURE (one probe, a copy of `tell2.probe.jsx`'s `towns` mode at `out/v43/meas/wd.probe.jsx`, run as `tell2.sh` runs that
mode: the gate's 92 towns and its 48 controls, both engines (the twin and `get_gallery_dossier` on the local cluster), every setting
`tell-common.mjs :: settings` computes, Reveal DM off and on, the gallery AND the link door (`get_unlisted_dossier`) where the probe can
reach both; if it reads one door only, say which and why)
For EVERY HIDING read (a "read" = place x setting x Reveal x door x engine; THE CHAIR'S RULING 08:34 UTC: NO WHOLE-DOCUMENT
COMPARER IS BUILT HERE: the served-versus-twin hash comparison is chain B's instrument, run by the seat; build nothing of it):
1. DAILY (the security reader's rows 5 and 6): on every HIDING read (a setting that hides something the place holds), derive the Daily
   Life page from the SERVED document exactly as the page does on a shared read: `src/domain/dailyLife.js :: deriveDailyLife(served,
   null)` (`DailyLifeTab.jsx` passes `null` on any read that is not the owner's own). Its eight public slots (`DAILY_LIFE_SLOTS`) by
   text; and the office lines (`src/data/dailyLife/commonerResentments.js` ids L8 to L11; L12 is NOT BUILT: say so) wherever the
   `commoner_resentments` slot prints one. Compare with THE SAME PLACE WITH THE HIDDEN THING NEVER THERE: use the lane's own never-there
   reference (find it by grep for "never-there" / "neverThere" under `tests/security/` and `docs/chair/2026-11-20/veil/out/`; name the
   function you used in the report; if none fits a hiding read of this probe, STOP and report, building none). Count reads that differ,
   by slot, with ONE pair (served text | never-there text, the place, the setting) per slot. N63's caution: where the never-there
   place is itself a roster no open place shows, say so beside the count. ALSO: `commoner_resentments_dm` must be ABSENT from
   `deriveDailyLife(served, null).slots` on every read AND absent as a key anywhere in the served document: count its presences
   (expected 0), and say whether any served document carries an `audience` key or anything else a reader's derivation could take for
   the owner's.
2. NAMES (PART 30 section 7; ruling 28): over EVERY served string of every HIDING read (both doors, Reveal off and DM), the lane's own fold
   `src/domain/display/gallerySecondHomes.js :: buildNameSearch` (import it; never copy it) built over the names of every house and power
   THE READ HIDES OR WITHHOLDS (a name and its bare form, case-blind, a possessive and a plural ending as a boundary), and the ids of
   withheld rows/persons as strings AND as object keys. Every hit by JSON path pattern (array indices folded to `[]`), its count of reads
   and places, and one example. Mark each path IN or OUT of "R5's named list" (grep `R5` and "named list" in
   `docs/chair/2026-11-20/veil/COHERENCE-VEIL-HANDBACK-PART30.md` section 1 by grep only; if you cannot find the list, say so and
   report every hit unmarked). For each OUT path: the source field's writer (grep `src/`), and the landed point that brought it (`git
   -C /home/user/join43 log --format='%h %s' 8f3b8bf4b..9b0ffaa97 -- <the writer>`: merge subjects name "point NN").

## N8: THE DOCUMENT AS STORED
The probe's births are born, not saved. ALSO run steps 1 and 2 on the same 140 records AS `saves.js` STORES THEM: find how the lane
does it (`docs/chair/2026-11-20/veil/out/v33/legacy/stored.sh` on `origin/lane/veil-42-2026-11-23-r4ids-wip`, read with `git show`;
`RV9_MODE=stored`): reuse its round-trip, never re-implement `saves.js`. Report both forms side by side ("born" | "stored"). Master-born
stored documents are NOT in this measure (say so).

## COST FIRST
Before the full run: one shard on 10 towns, timed; extrapolate. If the whole measure (both forms) would take over AN HOUR of wall,
STOP before it and report the figure (the seat asks the chair).

## STOPS (to the seat, at once, never worked round)
A probe that needs a change to anything outside `out/v43/meas/`; a server read that errors; a refusal by your own permission check (it
stands: report it, try nothing else to the same end); 212's sha256 on the joined tree differing from the veil tip's
(`git -C /home/user/join43 diff 23bb8b8ae HEAD -- supabase` must be empty).

## Your report
`out/v43/meas/V43-MEASURE.md`, at most 120 lines: STOPS first; the cost; DAILY's table (born | stored) and its pairs; the
owner-only slot's count; NAMES' table with IN/OUT and the landed points; CONFIRMED vs PLAUSIBLE. Committed. END YOUR TURN with ONE line:
"V43-MEASURE <commit>: DAILY differ e reads (slots ...); dm-slot present f; NAMES OUT g paths".
