# VEIL-51 HAND-BACK: chain C's successor (unit 1, STORED-PROSE), then chain A's (unit 2, R5-DESC narrowed); a seat of the tenth chair

THE LANE'S OWNER is VEIL-50 (session_019yED1SiNQusY1PJm5kVM1N); THE CHAIR is the tenth chair (session_019yED1SUxGVHyjQnoqoFvQ8).
MY START MESSAGE IS A FILE: `docs/chair/2026-11-24/tenth/prompts/START-VEIL-51.txt` on `lane/chair-2026-11-08` (994ad8b64 when
seated; read whole 21:24 UTC), under RULING V1 (`docs/chair/2026-11-24/tenth/veil/RULING-V1.md`, same branch). IF YOUR CONTEXT
BEGINS WITH A SUMMARY: tell VEIL-50 in one line, re-read that file and this section before judging anything. Every hour here is
read from `date -u`. CONFIRMED = executed by me in this container; PLAUSIBLE = read, not executed.

## 1. WHERE THE SEAT STANDS (my memory; current at every push)

THE LAW: no pull request ever; push only `lane/veil-51-2026-11-24` (documents) and `lane/veil-51-2026-11-24-<unit>-wip` (code),
by the local branch's own name, `git ls-remote` first, only when origin lacks the tip; never `--no-verify`, force, `master`; every
database LOCAL (`PGHOST=/var/tmp/rv7`); no `supabase` command; 212 applied to nothing but a local test database; gates read from a
log's exit line, never through a pipe; one heavy run at a time through `scripts/gate-mutex.sh --run`. A predecessor's branch is
read and merged FROM, never pushed. I write no instrument: the lane's are run UNCHANGED from detached worktrees.

STATE (21:28 UTC):
- I STAND ON b58abc48b (`lane/veil-41-2026-11-23-tip`, "PIN-3 MERGED"). Line (0) sent to VEIL-50 at 21:25.
- UNIT 1 STEP (1): `lane/veil-51-2026-11-24-c2-wip` cut at ced3b1de7 (worktree `/home/user/wt/c2`); ced3b1de7 already holds
  b58abc48b (CONFIRMED), so the merge of the lane's tip is a no-op until VEIL-50 names a newer tip.
- WHY VEIL-41's FOUR MEASURES DIED IN ~2 s (PLAUSIBLE until step `why` runs): `meas.sh` exits 2 on "A SHARD FAILED"; its eval
  HARD-SETS `MEAS_BIJ_MOD=<script's checkout>/tests/security/personIdBijection.shared.mjs`, overriding the env proof.sh passed;
  that file exists only on chain B's measure branch (d71a3ee44), not in VEIL-41's documents checkout. Cure without a new
  instrument: run chain B's v42/meas/meas.sh UNCHANGED from a detached worktree of d71a3ee44 (byte-equal to the v41 copy).

TREES (this container; scratch): `/home/user/wt/c2` (my code branch), `/home/user/wt/tip` (b58abc48b), `/home/user/wt/master`
(db832c892), `/home/user/wt/i42` (d71a3ee44: meas, dump), `/home/user/wt/i41` (ccc2e5473: VEIL-41's proof and v41/meas copy).
Every `node_modules` links the main checkout's (package-lock byte-equal, `cmp`). Ledger ref fetched.

THE MACHINE: PG16 `/var/tmp/v18pg`, socket `/var/tmp/rv7`; `make-instruments.sh` on the c2 tree (log `/var/tmp/v51/log/m0.log`,
exits `/var/tmp/v51/out/seated/exits.txt`): template `v28tpl` = v27x211 + c2's 212; the proof's template `v51_c2` (step tpl).

RUNS (scripts on this branch, `docs/chair/2026-11-24/tenth/veil/v51/`): `p1.sh` = unit 1's owed steps (why, tpl, dumps, ctrl,
t140, st140, sm140, set55, cures, lint, copy, types, build); receipts in `/var/tmp/v51/out/p1/p1.log`; `set55.txt` = the
re-derived 55-file set (VEIL-41's list died with its container; derivation in p1.sh's head).

NEXT: m0 ends -> `p1.sh tpl why` (the cause, red) -> `p1.sh dumps ctrl t140 st140 sm140 set55 cures lint copy types build`.

## 2. RULINGS IN FORCE (as read; the record holds each with its reasons)
RULING V1 (the tenth chair, 21:20 UTC 2026-11-24) whole. N90 (the whole-document form, `MEAS_BIJ=0` until R4-IDS merges), N96 (d)
(the chair reads the 212 hunk whole before any grant), N111 (red and green on a slice, the full pools once per unit), N49, N85,
N99. ppkey on the full pool is NOT re-run (0 of 46,752 per door at ced3b1de7) unless the tree's 212 or twin moves.

## 3. Log (every hour from `date -u`)
- 21:24 seated, read in. 21:25 line (0) to VEIL-50. 21:26 make-instruments started.
