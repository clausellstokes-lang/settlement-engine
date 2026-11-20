# COHERENCE-VEIL — hand-back, part 20: the nineteenth seat (B, C, D; the registry R2 to R7; VR17 merged; E)

Seat: VEIL-19, branch `lane/veil-19-2026-11-20`, cut from origin/lane/veil-18-2026-11-19 at **bedd5a392** (read back
from origin first: equal). Assignment: `lane/chair-2026-11-08 :: docs/chair/2026-11-20/seventh/prompts/VEIL-19.txt`
(the seventh chair is session_019yED1SUxGVHyjQnoqoFvQ8). Every database is an in-process pglite or a scratch native
PostgreSQL 16.15 cluster in this container (`/var/tmp/v18pg`, locale C.UTF-8, trust auth, unix socket `/var/tmp/rv7`
only, `listen_addresses = ''`). No hosted database, no production credential, no `supabase db push`, no `migration
repair`, no deploy, no pull request. **Nothing is applied anywhere but those local databases.**

**TIP:** the commit carrying the latest copy of this file, read back from origin.

## 0. The rulings this seat works to (each vetoable by the owner)

PART 19 section 0 and PART 18 sections 0 and 4 stand whole: VR1 to VR17 and THE CLEARANCE STANDARD. The laws and the
push paragraph of `prompts/VEIL-17.txt` bind word for word. THE SEVENTH CHAIR'S RULING SV1 (the split): this seat owns
212, its rollback and the twin's rule files; VEIL-R1 (`lane/veil-r1-2026-11-20`) builds stage R1 of SUB-BRIEF-VR7;
VEIL-VR17 (`lane/veil-vr17-2026-11-20`) builds VR17 (and may change the VEILED_GROUPINGS mechanism of
`galleryVeil.js`); each is merged here with `--no-ff` on the chair's "R1 <commit>" / "VR17 <commit>". Until VR17 is
merged, markVeiled, veilGroupingsOf and isVeiled of `galleryVeil.js` stay as they are. The stored-figure registers
(the lighting census, the writers' reach, the wiring census, the tuning inventory) are taken once by this seat at the
merged tree.

Rulings received by this seat (with their hour, as received): 00:11 UTC, THE GIT HAZARD (the fifth chair's record of
2026-11-15): tests run with git's variables in the environment can drive fixtures against the real repository
(core.bare=true, a user "Fixture", unsigned commits); so never a push with nothing to send, never a non-fast-forward,
never a ref but this lane; tests from a shell with `env | grep '^GIT_'` printing nothing (this container's harness sets
11 `GIT_` variables: proxy and credential config, no `GIT_DIR`; every run is prefixed `env -u …` for all 11); the
author of every commit read before a push; config checked (core.bare false, user Claude, at 00:21 UTC). Relayed to
every builder as binding. 00:26 UTC: the receipts on origin (section 2).

## 1. The bytes (kept current)

| File | sha256 |
|---|---|
| `supabase/migrations/211_server_side_share_veil.sql` (FROZEN) | `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` (proved at bedd5a392) |
| `supabase/rollback/211_server_side_share_veil.down.sql` (FROZEN) | `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` (proved at bedd5a392) |
| 212 at the base (bedd5a392) | `dae0ae6c344daab243af4136a6932ebd7da8cfceabce6df3d95bddf75e19e247` / down `45da09eb5c8ab2e134d613d56afa0cbc700f14a66233f77520e6cd67cf30a1c9` |

212 is NOT final.

## 2. The base, measured first (the seat's own, 2026-11-20 00:10 to 00:17 UTC)

The base's code equals 2d92ddde5's (bedd5a392 adds docs only: `git diff --stat 2d92ddde5 bedd5a392` touches three
files under `docs/chair/`). All three readings of PART 19 section 2 REPRODUCED on `git archive bedd5a392`:
- THE ACCEPTANCE RUN (REVIEW-VEIL-7 `run-all.sh`): exit 1; checks 37 | PASS 35 | FAIL 2; a07 and d06 the only FAIL
  rows; server against twin "(all 15 equal)" (the library's hand rows, not born towns: VR15 (c)).
- THE READER'S DIFFER, the twin (`differ.probe.jsx`, N=2, four shards, 96 s): towns 140, with a hideable house 91, B kept
  a hideable house 0, threw 0; every eye shut: 235 differ A/B in two towns or more, **IN THE CLASS 130** (CRIME-WORDED 28,
  OTHER 40, NUMBER/BOOLEAN 49, HISTORY RE-DRAW 13), re-roll 94; the default veil 138.
- THE SAME DIFFER THROUGH THE SERVER (`measure/differ/run-differ-server.sh`, a chain 001..212 of the base, the gallery
  read, 215 s): the reader's gate (empty registry, the VR13 rng ruling) **`registered 0 | diffuse 0 | rng-only 20 |
  UNREGISTERED 124`**.

THE RECEIPTS (the chair, 00:26 UTC: every figure this file quotes has its output beside it): `out/v19/acceptance-at-bedd5a392.txt`,
`out/v19/differ-twin-classes-all-at-bedd5a392.txt`, `out/v19/differ-twin-merge-all-at-bedd5a392.txt`,
`out/v19/differ-twin-merge-default-at-bedd5a392.txt`, `out/v19/differS-gate-at-bedd5a392.txt` (all under
`docs/chair/2026-11-20/veil/`).

## 3. The list (the assignment's, in order), as it stands

| Item | State |
|---|---|
| 1. First act, measured | DONE (section 2) |
| 2. B, C, D (`briefs/SUB-BRIEF-BCD.md`) | IN HAND |
| 3. R2 under VR16 (after R1 is merged) | waiting on "R1 <commit>" |
| 4. R3, R4, R5, R6 | not started |
| 5. R7 (VR15 (b)) | not started |
| 6. VR17 merged | waiting on "VR17 <commit>" |
| 7. E | not started |

## 4. How the instruments are re-made

PART 17 section 5 and PART 19 section 4, at the SAME paths VEIL-18 used, so every committed measure script runs
unchanged: the cluster `/var/tmp/v18pg` (socket `/var/tmp/rv7`); `pg@8.13.1` in `/var/tmp/v18/pgmod`; the readers'
library `git archive 72a3bb24f …REVIEW-VEIL-6 …REVIEW-VEIL-7 …REVIEW-VEIL-8` (72a3bb24f is the head of
origin/lane/review-veil-3-2026-11-12: fetch that branch first) and `git archive origin/lane/review-veil-9-2026-11-19
docs/chair/2026-11-19/veil/probes/REVIEW-VEIL-9`, both into `/var/tmp/v18/lib`; the reader's probes copied flat into
`/var/tmp/v18/rv9` with their three `/var/tmp/v16/rv9/` imports re-pointed to `/var/tmp/v18/rv9/`; the base's bytes
`/var/tmp/v18/base` = `git archive bedd5a392`, `node_modules` linked. Outputs under `/var/tmp/v18/out/`.
