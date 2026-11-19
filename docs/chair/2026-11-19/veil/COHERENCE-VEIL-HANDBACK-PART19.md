# COHERENCE-VEIL — hand-back, part 19: the eighteenth seat (212 finished: V8-2/4/5, B, C, D, VR7, E)

Seat: VEIL-18, branch `lane/veil-18-2026-11-19`, cut from origin/lane/veil-17-2026-11-19 at **1f501779b** (read back
from origin first: equal). Assignment: `lane/chair-2026-11-08 :: docs/chair/2026-11-19/veil/prompts/VEIL-18.txt` (the
chair is session_01FbPLbcLDSJzZFzb5B7EjxR). Every database is an in-process pglite or a scratch native PostgreSQL 16
cluster in this container (`/var/tmp/v18pg`, locale C.UTF-8, trust auth, unix socket `/var/tmp/rv7` only,
`listen_addresses = ''`). No hosted database, no production credential, no `supabase db push`, no `migration repair`,
no deploy, no pull request. **Nothing is applied anywhere but those local databases.**

**TIP:** the commit carrying the latest copy of this file, read back from origin.

## 0. The rulings this seat works to (each vetoable by the owner)

PART 18 section 0 and section 4 stand whole: VR1 to VR14 and THE CLEARANCE STANDARD (at FINAL the reader re-runs the
differ; every differing path is in the registry with its rule (a) or (b), or ruled diffuse (VR8), or rng-only (VR13):
zero unregistered paths). The laws and the push paragraph of `prompts/VEIL-17.txt` bind word for word.
THE SWITCH (the owner, 2026-11-19 ~07:30 UTC): a separate seat, VEIL-SWITCH, owns `src/components/gallery/CurateMode.jsx`
and `src/domain/display/criminalVeilSwitch.js`; this seat does not edit them; on "SWITCH <commit>" it merges that commit
with `--no-ff` before E.

## 1. The bytes (kept current)

| File | sha256 |
|---|---|
| `supabase/migrations/211_server_side_share_veil.sql` (FROZEN) | `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` (proved at 1f501779b) |
| `supabase/rollback/211_server_side_share_veil.down.sql` (FROZEN) | `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` (proved at 1f501779b) |
| 212 at the base | `d1b5da911f66d41c3f0350cf93dcf792b4e000fe5ca39f1fe5ea69cd9103a938` / down `5b3eb697ae2531f83c2586d2c59b5afe414e6647ba65b9a884e9dfd09ddf694f` |

212 is NOT final.

## 2. The base, measured first (the seat's own)

- THE ACCEPTANCE RUN (REVIEW-VEIL-7 `run-all.sh` on `git archive 1f501779b`): exit 1; checks 37 | PASS 35 | FAIL 2; a07
  and d06 the only FAIL rows; server against twin: all 15 equal. As PART 18 states.
- THE READER'S DIFFER (`differ.probe.jsx` of origin/lane/review-veil-9-2026-11-19, N=2, 140 births, 91 with a hideable
  house, the base's own twin, 92 s on four shards): every eye shut, 235 paths differ A/B in two towns or more, **130 IN
  THE CLASS** (49 NUMBER/BOOLEAN, 28 CRIME-WORDED, 40 OTHER, 13 HISTORY RE-DRAW), 94 re-roll; the default veil 138 in
  the class. The reader's bound (130) reproduced exactly.

## 3. The list (PART 18 section 6), as it stands

| Item | State |
|---|---|
| V8-2, V8-4, V8-5 | IN HAND: a builder to `briefs/SUB-BRIEF-V8-245.md` (worktree `/home/user/wt/b1`, branch `v18-b1`) |
| B, C, D | not started |
| VR7 (the registry), VR9, VR10 | measuring |
| E | not started |

## 4. How the instruments are re-made

PART 17 section 5 with `/var/tmp/v18` for `/var/tmp/v16` and `/var/tmp/v18pg` for the cluster; `pg@8.13.1` in
`/var/tmp/v18/pgmod`; the readers' library: `git archive 72a3bb24f docs/chair/2026-11-13/probes/REVIEW-VEIL-6
docs/chair/2026-11-13/probes/REVIEW-VEIL-7 docs/chair/2026-11-14/probes/REVIEW-VEIL-8` and `git archive
origin/lane/review-veil-9-2026-11-19 docs/chair/2026-11-19/veil/probes/REVIEW-VEIL-9`, both into `/var/tmp/v18/lib`.
The differ: `/var/tmp/v18/rv9/run-differ.sh <tree> <outdir> [N]` (the reader's probe, four shards, then its merge and
classify scripts). A builder's worktree takes `cp -al <real node_modules>` (PART 18 section 5's symlink trap).
