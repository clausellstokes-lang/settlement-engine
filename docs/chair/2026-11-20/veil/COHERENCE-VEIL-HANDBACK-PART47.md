# COHERENCE-VEIL — hand-back, part 47: the forty-eighth seat (VEIL-48), CHAIN A's writer (the ninth chair's N6; successor of VEIL-40, whose record is PART 42). Read with PART 42 (its block 0 and rulings 110-130) and the briefs.

Seat: VEIL-48, a seat of the NINTH chair (session_01FbPLbdpQrxXktCeSf32d4j; send_message, Claude Code Remote MCP). Start message:
`lane/chair-2026-11-08` :: `docs/chair/2026-11-23/ninth/prompts/START-VEIL-48.txt` (written 16:01 UTC). Seated about 16:05 UTC
2026-11-23 on a3bc0dc9d (VEIL-40's stop notes over 001715824). No pull request, ever. Unit: "R5-DESC" to its "TIP?" (T5 is VEIL-49's).

## 1. WHERE THIS SEAT STANDS (THIS SECTION IS THE SEAT'S MEMORY: kept current at every push, for a reader who has never seen this session)
IF YOU ARE THIS SEAT AFTER A SUMMARY: tell the chair in one line; re-read the start message, PART 42 section 1 and this section first.

### THE BRANCHES (pushed only by `/var/tmp/v18/out/v48/push.sh <worktree> <branch>`: lane/veil-48-2026-11-23* only, only when origin lacks the tip)
- `lane/veil-48-2026-11-23` (main checkout `/home/user/settlement-engine`): documents, briefs, this file.
- `lane/veil-48-2026-11-23-r5desc-wip` (worktree `/home/user/wt/r5desc`): THE CODE BRANCH: aa54a6791 + R5D-RIVAL 61a99a90d merged
  (172bf7a1a) + PIN-3 b58abc48b merged (20f718815), both plain, no conflict. NOT YET ON ORIGIN: the pre-push hook's
  `typecheck:domain:strict` reds `src/domain/veil/pageRederive.js` +1 (TS2345 :283, the `annotateFactionStanding(..., {
  publicLegitimacy })` call against `factionStanding.js`'s untyped `seat = null`): R5D-PAGE-A's line, the same red on 0544c77ad,
  measured; ASKED OF THE CHAIR 16:24 (which form clears it). Never `--no-verify`.
- `lane/veil-48-2026-11-23-r5rival-wip` (`/home/user/wt/r5rival`) at 61a99a90d; `lane/veil-48-2026-11-23-sskip-wip`
  (`/home/user/wt/sskip`) at 0544c77ad. Detached: `/home/user/wt/b-master` (db832c892, master-born dumps), `/home/user/wt/dump-today`
  (aa54a6791, today-born dumps). Each worktree has `node_modules` and `.husky/_` symlinked to the main checkout's.

### THE MACHINE (unit 0), started 16:11:46 under the mutex
- `/var/tmp/v18/out/v48/chain0.sh` (log `chain0.log`): npm ci rc=0; ledger ref rc=0; make-instruments rc=0 16:18:59 (template
  `v27x211`, `v28tpl`; out `/var/tmp/v18/out/v48/seated/`); then the pool seeds `/var/tmp/v18/t2/pool-v48` (pool.sh, mode pool).
- `dump-after.sh`: after chain0's END, VEIL-33's `dump.sh` (B2's recipe, LP 45/30/1, seed index pool-v48) to
  `/var/tmp/v18/t2/stored-v40/{today,master}` (THE DIRECTORY NAME KEPT so every instrument reads it unchanged).
- `queue1.sh` (log `queue1.log`): after the dump, SSKIP's deciding count (`count.sh` on `/home/user/wt/sskip`, out
  `/var/tmp/v18/out/v48/sskip-count/`), then the base tree's gates (`chain1.sh` = VEIL-37's with v48 names; out `/var/tmp/v18/out/v48/g/`).
- The order file every builder reads: `/var/tmp/v18/out/v48/mutex-order.txt`.

### WHAT IS OPEN, IN ORDER
(1) the deciding count -> the chair; then the SSKIP cure builder (red first on a slice), which also owes ruling 124's two mask
documents; (2) RIVAL's chains, arms (slices), after, cost (`out/v40/r5drival/run.sh <tree> <logdir> ...`); (3) SSKIP merged into the
code branch; (4) B2's owed re-runs on a slice; (5) B3; (6) the unit's proof on the stacked tree (a new pool and both gates, every arm on
the full pools in one hold, L1, the two N104 seeds by name, the mask documents, `tests/lint`/`tests/copy` whole, the 34-file set, cost);
(7) "TIP? R5-DESC".

## 2. RULINGS SINCE PART 42 (numbered on from 130)
(none yet)

## 3. Log (every hour from `date -u`)
- 16:14 first message to the chair. 16:24 the push red (above) to the chair.
