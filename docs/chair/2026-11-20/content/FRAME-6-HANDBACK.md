# FRAME-6 — hand-back (the session sheet's lane, the owner after FRAME-5)

Last written 2026-11-20T13:35:12Z (`date -u`) by FRAME-6 on `lane/frame-6-2026-11-20`. The lane was taken at `5b7d57c70` on the chair's word "THE LANE IS YOURS at 5b7d57c70" (13:17 UTC). A successor needs this file and the briefs it names. Read it with `FRAME-5-HANDBACK.md` (rulings 26 to 34), `FRAME-4-HANDBACK.md` (18 to 25) and `FRAME-3-HANDBACK.md` (1 to 17), all in force.

## THE COUNT THE OWNER READS FIRST

**UNDER TODAY'S STANDING, at `4971555c3` (the line 43ab0f5eb merged), executed by FRAME-6 on the 330-town calm pool (tried 484):** the OWNER's sheet is framed in **63** towns (thorp 0, hamlet 8, village 15, town 7, city 14, metropolis 19); 267 keep today's sheet; cast-null 267 equals "without". By W1 to W3 alone: 58 (0, 8, 15, 5, 12, 18), re-executed at `48b84cb01` before the hand-over. Every other reader: 0 (the audience gate; FRAME-5's measure, not re-run by FRAME-6). The line's merge moved the count by 0.

**Instruments, one command each** (all in `docs/chair/2026-11-20/content/frame6/tools/`):
- The count: `sh count.sh <tree>/src/ <outdir> [ENV=VAL ...]`; reads `<outdir>/count.md`. ENV=VAL forces another lane's law on (the dark law of a ruler's standing, when it exists). `pool.mjs` and `cf11weight.mjs` are B2's, extracted verbatim from `frame2/B2-WEIGHT-RESULTS.md`. Its "framed" row includes W4; its W2 rows are B2's pre-B9 probe and read 0: not the count.
- The veil digests at any tree: `veilProbe.test.jsx.txt` (frameShareVeil's CF3 shared reads, verbatim, digests only). Copy it to `<full archive>/tests/security/veilProbe.test.jsx`, symlink `node_modules`, run `VEIL_OUT=<file> npx vitest run tests/security/veilProbe.test.jsx` there.

## RULINGS ADDED SINCE FRAME-5's LIST

35. **P1b-F, the chair's message of 13:17 UTC (its ruling of 12:52), which governs over ruling 34.** (1) `crisisPage.js :: CRISIS_ABSENCE_REACH.outsideHand` becomes "{keeper} keeps the {house}, where strangers lodge, and would know of them"; the pins that move with it are `crisisOutsideHand.test.js` and frameShareVeil's P1B arms; the 126 owner pages move by that clause alone; the stored record and every non-owner page stay identical. (2) A parity test: over the lane's pools `lodgingKeeperOf` and troubleCast's outsider rung name the same keeper or both none; one source at the join. Brief: `frame6/P1BF-WORDING-PARITY.md`.
36. **THE READERS THAT BREAK TIES BY A CARD'S `power`, FOR THE JOIN** (the chair, 13:17; ruling 30 extended): `troubleCast.js :: strongest`, the sheet's people to voice (`tonightSheet.js`), `crisisCast.js`'s exploiter and collaborator, and `crisisPage.js :: lodgingKeeperOf`. Another lane corrects the band of four pool roles at birth; the chair re-measures on the joined tree.
37. **THE LINE AT 43ab0f5eb (point 82) MERGED** before P4a's builder is cut (the chair, 13:17): `git merge --no-ff`, NOT refused by FRAME-6's permission check.

## EACH UNIT: STATE, BRANCH, COMMIT

| unit | state | commit | receipts |
|---|---|---|---|
| take-over | DONE | `5b7d57c70` (fast-forward) | count reproduced before it: 58 by size at `48b84cb01` |
| brief P1B-F | committed | `0f34be803` | `frame6/P1BF-WORDING-PARITY.md` |
| **P1B-F** | BUILDER OUT (branch `frame6-p1bf`, worktree scratchpad `wt-p1bf`, from `0f34be803`) | — | results land in `frame6/P1BF-RESULTS.md` on that branch |
| the line merge 43ab0f5eb | DONE | `b1190e092` | conflicts on two registers only: the manifest a union (0 and 0 entries dropped, 1251); lighting the line's side then its door. Every other path equals its side's blob (0 differ) |
| registers at the line merge | DONE | `4971555c3` | lighting by its door: files 3717, parked 473, credited 3244, titles 31303, suiteTitles 8673 (34/34); wiring `--dry` delta 0 |
| the lane's 71 governing files at the merged tip | DONE: 1 red, re-pinned by proof | `eac12b73e` | 70 of 71 files green (569 passed, 1 expected fail). The red: frameShareVeil CF3 "8 born towns…" (5 of 8). The veil probe: pre-merge lane = the old pins (8/8); line archive = merged tip (8/8). Rows moved, unsigned: village-0, city-8, metropolis-8 (galleryDmFull, imported); metropolis-1, metropolis-5 (all five). After: 9 passed |
| P4a, C2, P1, P2, P3a, P3b, P4b, measures, six sheets, build + verify:dist | NOT STARTED | — | order: P4a (after P1B-F merges: both edit `crisisPage.js` and the veil test) -> C2 -> P1 -> P2 -> P3a -> P3b -> P4b -> measures -> sheets -> build + `verify:dist`. Each stored unit adds CF12's five W4 towns to proof (a) |

## WHAT A SUCCESSOR MUST KNOW

- Builder worktrees live in the FRAME-6 scratchpad; their branches (`frame6-*`) are local and ride the lane by merge.
- `node_modules` is in `.git/info/exclude`: archives and worktrees symlink it.
- `tests/lint` whole has NOT yet been run by FRAME-6; the lane's last whole run is FRAME-5's at `eb555d407` (`tuningRegister` on three named rows).

## EXECUTED OR PLAUSIBLE

**Executed by FRAME-6:** the count at `48b84cb01` (58) and `4971555c3` (63 owner); the manifest union proof; the blob-equality check of the merge; the lighting door and the wiring dry run; the 71 governing files; the three-archive veil probe; the re-pinned veil test green. Logs: the scratchpad's `merge/` and `count/`.
