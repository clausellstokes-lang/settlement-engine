# MEASURE-LIT: the contest measured LIT for the first time (the chair, 16:34Z: "nothing is put to the owner for a signature that was never measured lit"). Builder BML (SEAT-5's last unit). Written 2026-11-20T16:38:47Z, read from `date -u`. A MEASURE ONLY.

**Nothing under `src/` or `tests/` is ever committed.** Every plant and every merge lives in a scratch copy and is removed after. You commit only the script and its outputs under `docs/chair/2026-11-20/content/seat/u4/`.

**Read first:**
- `/home/user/settlement-engine/CLAUDE.md`;
- `briefs/COMMON.md`;
- `SEAT-5-HANDBACK.md` §0 ("WHAT LIGHTS THE CONTEST") and items 51 and 52;
- `src/domain/seat/seatCircumstances.js` WHOLE (`SEAT_CONTEST_LIT`, `SEAT_CIRCUMSTANCE_TUNING`, and where its PROPOSED figures sit beside the 1s);
- `docs/chair/2026-11-20/content/seat/u4/measure-u4.mjs`;
- `docs/chair/2026-11-20/content/seat/confine/confine-two.sh` (the plant idiom);
- the chair's joint reading: `git show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/measures/joint-reading/{report.txt,joint-measure.mjs,joint-report.mjs}`. Its section (a) is the merge with its six conflicts; "HOW THE LAWS WERE FORCED" is how the two laws are set after `birthConfig`. The definitions of calm, crisis-born, protected and contested (risk label Contested or Critical from `rulingPowerCoup.js`) are ITS, so your figures compare with the chair's.

## The one command
`sh docs/chair/2026-11-20/content/seat/u4/measure-lit.sh [<seat tip>] [--fortune <fortune commit>]`. The defaults are this branch's tip and `c167b5f11`. It writes `u4/measure-lit.{md,json}` beside itself.

It builds two scratch trees by `git archive` / a detached scratch worktree, never the checkout. Tree S is the seat tip. Tree SF is the seat tip merged with the fortune commit, the six conflicts resolved exactly as the chair's report section (a) says. Each tree gets three plant variants, in a copy of the tree, with the plant stopping if its text is not found:
- **D, dark:** as committed.
- **L1, lit at 1:** `SEAT_CONTEST_LIT = false` → `true`.
- **LP, lit with the proposed figures:** L1 plus every factor of `SEAT_CIRCUMSTANCE_TUNING` set to its PROPOSED figure, read from the module's own declaration (its note or draft field), never retyped.

## The arms
Each arm is a born config forced after `birthConfig`:
- **Arm 0, today:** no law forced, tree S, D. This is the reference.
- **Seat law arms:** `_seatLawVersion=2` on S × {D, L1, LP}.
- **Seat and fortune arms:** `_seatLawVersion=2` and `_fortuneLawVersion=2` on SF × {D, L1, LP}.

## The pools
- `measure-holder.mjs`'s two pools (default 900, presets 960).
- The chair's 600 places `hxd-<size>-0..99`, for the calibration.

## The calibration (it can refute the instrument; do it FIRST)
On the chair's 600 places, arm "seat and fortune, D" must reproduce the chair's calm-contested figures: thorp 0, hamlet 1.5, village 17.1, town 8.6, city 16.4, metropolis 10.4 %. Arm 0 must reproduce today's: 0, 7.6, 70, 8.6, 0, 0 %. If either differs, STOP and report both tables.

## The output, per arm and per pool
- the contender table per kind (present, contending), as `measure-u4.mjs` prints it;
- the risk label by size, calm and crisis-born apart;
- calm places whose seat reads contested (Contested or Critical), by size: **THE COUNT THE OWNER WILL ASK FOR**;
- crisis-born incumbents protected, by size;
- for LP, the circumstances held (count per circumstance) and the kinds that enter or leave the top three against L1.

Write "under today's standing" beside the seat-law-only rates. Report 0 errors or name each.

## Laws
- No `src/` or `tests/` edit committed. `git diff --quiet <base> HEAD -- src tests` holds at your tip.
- No push. No census.
- The scratch worktree is removed at the end; `git worktree list` shows it gone.
- No merge or commit on any real branch other than yours.
- Run every gate or command into a file and read its count lines.
- Have none of GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX set.

**Your branch:** `lane/seat-2026-11-20-measure-lit`, cut from the lane's tip, in worktree `/home/user/wt-mlit`.

Commit by explicit paths with SEAT-5's trailers. Hand back to SEAT-5 in at most 250 words: the calibration first, then the six-arm table of calm-contested by size (default pool and the chair's 600), and one CONFIRMED-vs-PLAUSIBLE sentence.
