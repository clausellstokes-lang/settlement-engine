# R5D-PAGE-B2 hand-back (VEIL-40, chain A; brief `briefs/R5D-PAGE-B-BRIEF.md` at 928576c43, ADDENDUM 1's B2 items (1)-(5); the chair's N67)

Worktree `/home/user/wt/r5desc`, branch `lane/veil-40-2026-11-23-r5desc-wip`. NOT PUSHED by me. Nothing under `src/` or `supabase/`
changed. Written 2026-11-23T12:41Z (date -u). **RETURNED AT THE BUDGET, NOT DONE**: what is not run is listed below, each with why.

## 1. Commits, files, runs, `tests/lint` and `tests/copy` whole, what is not run

**Commits**: c7a4e9a4e (the seat's "WIP, UNPROVED" of my tree, on the chair's order); then mine on top: the never-there tension
cure, the final N67 table and this hand-back (its hash in the seat's `git log`; never amended).

**Files**
- `tests/security/galleryVeilDesc.pglite.test.js`: items (2) 5c's stored halves and the publicProse count, (3) the share-class arm,
  (4) case-blind name arms, (5) the two titles; reader B's differential; N67's shas.
- `tests/security/galleryVeilRecent.pglite.test.js`: item (4) (case-blind, exact forms); its header names `R5C6_POOL=full` as 107 (2)'s.
- `out/v33/legacy/dump.probe.jsx`, `dump.sh`: VEIL-33's, by `git show 216cb46d8:<path>` (nothing merged; `legacy.probe.jsx`,
  `stored.sh`, `lp-an.mjs` NOT taken: B3's).
- `out/v40/r5dpage-b/b2/b2.sh` (the runner: dump; vitest; a batch under ONE mutex hold); `stored-wholedoc-shas.tsv` (N67).

**THE STORED POOLS (item (1); B3 reads them)**, both by `b2.sh <log> dump` = VEIL-33's `dump.sh` (LP_A 45, LP_B 30, LP_TOWNS 1):
| pool | dir | tree | docs | roles | publicProse | made |
|---|---|---|---|---|---|---|
| today-born, AS SAVED | `/var/tmp/v18/t2/stored-v40/today/` | this worktree at 9b1fe3c34 (`LP_PROSE=auto`: composed, `withPublicProse(u, composePublicProse(u))`) | 440 | A 180, B 120, T 140 | 440 of 440 | 07:03:57-07:05:07Z, 4 shards rc=0 |
| master-born | `/var/tmp/v18/t2/stored-v40/master/` | scratch detached worktree `/home/user/wt/b-master` at db832c892 (node_modules a symlink) | 440 | A 180, B 120, T 140 | 0 (master has no composer) | 07:05:07-07:05:31Z, 4 shards rc=0 |
- DEVIATION: the seed index `LP_POOL` is `/var/tmp/v18/t2/pool-v40` (the seat's tell pool, 1200 A + 608 B births): VEIL-33's default
  `/var/tmp/v18/t2/pool-r5c-1` is gone from this box. So parts A and B are other seeds than VEIL-33's 440; the 140 towns are the same
  `r3m-<size>-<crisis>-<k>-<idx>`. Each dir: `<seed>.json`, `index-shard<s>.json` ({seed, role, size, crisis, k, dial, prose}), `meta.txt`.

**Runs** (vitest through `gate-mutex.sh --run`, read by `gate-tail.sh`; no git variables; logs under `/var/tmp/v18/t2/stored-v40/logs/`)
| run | what | exit |
|---|---|---|
| dump | the two pools (`logs/exits.txt`) | 0, 0 |
| run1 | galleryVeilDesc whole, standing slice, stored slice in-process (`logs/run1/`, measures `desc-measures.txt`) | **1**, 07:50:45Z: 13 passed, 4 red (below) |
| full1 | batch of 10 (`logs/full1/`): storedS0-S2 (`R5DP_STORED=.../today`, `R5DP_SHARD=i/3`, N67 on) | S0-S2 still RUNNING at 12:41Z (their plant arm); fidelity, differential lines landed |
| full1 | the other 7 (standing re-run; descF0-F2 `R5DP_POOL=full`; recentF0-F2 `R5C6_POOL=full`) | **DIED at start-up, 09:30Z**: xargs ate the `\(` of my test-name pattern (an invalid regex); cause sent to the seat |
| full2 | the 7 re-queued (`.` for `(`) | WITHDRAWN before it held the lock (the seat's mutex order); NOT RUN |
| typecheck | `node scripts/check-full-typecheck.mjs` (`logs/typecheck.log`) | 0 (167, ceiling 167) |
| eslint | both test files, after every change | 0 |

**run1's 4 reds, by title (the RED FIRST of the share-class tooth, at its strict reading)**: THE DIFFERENTIAL (item 4) and THE STORED
HALF OF THE DIFFERENTIAL: 8 rows each, the same 2 records (r3m-city-insurgency-0-34, The Merchant Bloc, MC-outpaced | MC-ahead;
r3m-metropolis-occupied-0-55, Military/Guard, GR-line | none), "[not the share class: gapOnly]" under GAP = the rank forms alone;
THE SHARE CLASS: 28 reads on 7 records against the pin 36 on 9. Then GAP widened to every figure-difference form (section 2, 1):
28 + 8 = 36 reads, 7 + 2 = 9 records, the pin's figure exactly (arithmetic on run1's lines; the re-run died: PLAUSIBLE until run).
THE STORED HALF OF THE PLANT: 128 (g) faults (the hand-made towns' "every tension stays" applied to born places: a test fault, cured:
born places judge (g) by the tension an owner-hidden party sits in) and **4 named "107 (3), the chair's"** (r3m-city-none-0-37, The
Trade Compact "Craft guilds regulating...", player view; reproduced here on the standing slice). Not re-run.

**Figures, the full stored pool (today, 440; storedS0-S2 summed; CONFIRMED from `logs/full1/m-storedS*.txt`)**
- FIDELITY (stored half): 1,752 nothing-hidden engine-door pages, 7,464 rows, 7,320 equal, 56 LISTED seat-contest (7 places), 40 desc
  not served (field veil), **48 FAULTS = 6 rows x 8 reads on 6 t2p places** (t2p-city-politically_fractured-179, t2p-city-under_siege-237
  and -267 and -47, t2p-metropolis-under_siege-937 and -327): a density rival (The Garrison Bloc, The Shield Compact, The Martial
  Alliance) whose STORED desc carries NO standing, to which reader S appends one ("They are always at the table...", "Behind The Guard
  by too much..."). Cause PLAUSIBLE: the rival is minted after the last standing write (resizePoliticalRoster), so no stored tail;
  S writes one for every served row. A page-reader class in `src/` (pageRederive.js :: rederiveStanding): a STOP, section 2, 2.
- DIFFERENTIAL (stored half): 529 hiding records (house hides; hand hides of a density host and a noble power, each saved again),
  1,058 hiding reads, 4,232 engine-door reads, 3,772 equal; the share class LISTED by the four conditions: **508 rows, 460 reads, 115
  records** (rank family alone 448 rows; a pair form among them 60 rows, 60 reads, 15 records); rows failing a condition 0; E136 (a) 0.
  **40 faults**: a current tension on the never-there page and not on the hiding page (the player view), e.g. r3m-city-none-1-101,
  Military/Guard hidden: the projection's sweep withholds a tension whose own words name the hidden power, A's never-there kept it.
  A TEST fault (the never-there construction), CURED in the test after the run (never-there drops a tension whose own words name a
  withheld power by the fold); NOT re-run.
- READER B (107 (2)) on the stored pool: 4,232 engine-door reads, 4,200 drawn, **4,232 equal, 0 faults** (case-blind name and mask).
- N67: **2,992 stored engine-door reads (page and import, the own setting, Reveal off and DM), 0 differ** (server sha = twin sha on
  every one; `stored-wholedoc-diffs/` therefore empty and not made). Judged by nothing. Reads of the master pool: none made by me.
- THE PLANT (stored half) and THE publicProse COUNT on the full stored pool: running at 12:41Z; their lines land in
  `logs/full1/m-storedS{0,1,2}.txt` ("R5DP plant, stored half", "R5DP publicProse count"). NOT IN THIS HAND-BACK.

**Figures, the standing slice (run1; CONFIRMED)**: plants (a)-(g), teeth: 0 faults; fidelity 168 of 168 (born) and 168 of 168
(stored, in-process); differential 39 records, 312 reads, 276 equal; reader B 312 of 312 equal (born), 304 of 304 (stored); the
arm (item 0 (c)) 0 faults over 2,872 reader-written strings, 8 served bases naming a hidden host (the 107 (3) class, listed by exact
form "Noble families", "Craft guilds"). **THE publicProse COUNT: 352 stored engine-door reads, every one serving publicProse; 0 block
fields hold a stored desc, base or standing (>= 12 characters), word for word or by the fold.**

**`tests/lint` whole, `tests/copy` whole: NOT RUN** (the seat's order: no lock until its word; then the 7 re-runs first).
**Not run**: the 7 jobs (born full: the share class re-counted, reader B; R5-RECENT full); the standing re-run after the GAP
widening, the (g) and never-there cures (run1's 4 reds stand un-re-run); master-pool reads; the red-first plant for case-blindness by
title (done instead by execution: the old `includes` misses "An unseen interest" and "AN UNSEEN INTEREST", `maskForms` lists both).

**Comparisons between engines (ruling 110)**: N67's whole documents (sha of the canonical form, recorded only); the differential's
withheld sets (names); everything else per engine against its own never-there read, page descs and the sentence string by string.

## 2. What needs a ruling (each a STOP rather than an invention)

1. **"GAP-BASED" (107 (1) (iii)), my reading, vetoable**: every standing form picked by a DIFFERENCE between two served figures
   against a threshold (the rank family R1-*, R2-*, RL-few and their M-/H- wordings; AND the pair forms AR, RA, CM, MC, MT, NM, GT, TG,
   RT, GR, ST and their wordings); not gap-based: OC-* only. The stricter reading (rank family alone) leaves 8 rows on 2 records of the
   standing slice (60 rows on 15 records of the stored pool) as faults: the same cause (a pair margin crossed by the re-share), and
   the pin 36 on 9 holds only under mine. One line in the test (`GAP_BASED`) changes it.
2. **The rival with no stored standing (48 rows, stored fidelity)**: reader S appends a standing to a row whose stored desc had none.
   A cure is in `src/` (`rederiveStanding`): STOP. The arm stays red on the full stored pool.
3. **107 (3), the chair's**: the stored plant reds on it (4 reads on the slice); built, run, named, not pinned.

## 3. Item by item
- (1) above. (2) 5c: `storedPoolOf` (dump dir or in-process `asSaved`), `fidelityOver`, `differentialOver('stored')` with reader B
  and the share class, THE STORED HALF OF THE PLANT, THE publicProse COUNT (0 by construction once (a') lands: it asserts only that
  it walked). (3) four conditions per row, each failure counted by name; families counted apart. (4) `formsOf` / `maskForms` / `ci`
  in both files: the fold's verdict, the whole-text, exemption, mask and sentence compares without case, faults list exact forms.
  (5) the two titles' brackets gone, asserts untouched; `tests/` and `scripts/` grepped for the old words: no pin names them.
