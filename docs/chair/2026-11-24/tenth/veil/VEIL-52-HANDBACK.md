# VEIL-52 HAND-BACK: THE DOORS (the share veil's lane, the tenth chair; the successor of VEIL-44 on IMPORT-DOOR with MAP-COVERT)

THE LANE'S OWNER IS VEIL-50 (session_019yED1SiNQusY1PJm5kVM1N); THE CHAIR IS session_019yED1SUxGVHyjQnoqoFvQ8. MY START MESSAGE IS A
FILE: `docs/chair/2026-11-24/tenth/prompts/START-VEIL-52.txt` on `lane/chair-2026-11-08`; RULING V1 (`docs/chair/2026-11-24/tenth/veil/RULING-V1.md`
there) governs where they differ. IF YOUR CONTEXT BEGINS WITH A SUMMARY: tell VEIL-50 in one line, re-read that file and this section
before judging anything. Every hour here is read from `date -u`. No pull request, ever; no hosted database; never the `supabase` command.

## 1. WHERE THE SEAT STANDS (my memory; current at every push)

STATE (21:35 UTC 2026-11-24): unit (0) sent to VEIL-50 at 21:25. Unit (1), THE THREE MEASURES, being set up. NOTHING built, nothing merged;
no SQL before VEIL-50's "R4-IDS MERGED <commit>".

BRANCHES: `lane/veil-52-2026-11-24` (documents and run scripts; cut at b58abc48b, the lane's tip "PIN-3 MERGED"). No -wip branch yet.

THE MACHINE (this container; scratch, never pushed): PG16 `/var/tmp/v18pg`, socket `/var/tmp/rv7`; `make-instruments.sh` on the tip worktree
(VEIL-50's recipe; log `/var/tmp/v52/log/m0.log`, exits `/var/tmp/v52/out/seated/exits.txt`): template `v28tpl`. Worktrees (detached):
`/home/user/wt/tip` b58abc48b, `master` db832c892, `i42` d71a3ee44 (dump.sh), `i43` b126c9813 (wd), `i44` 6edc79094 (um, MAP-COVERT's copy),
`door` db9fddc7d (VEIL-44's door -wip), `join` = THE TRIAL JOIN REBUILT LOCALLY (9e6547f0f + f03e9a868 + b58abc48b, both merges clean;
local commit e19f756d7; the veil's source and SQL byte-equal to the tip's: `git diff b58abc48b HEAD -- <veil paths> supabase` empty).
Every worktree's node_modules links the main checkout's (package-lock byte-equal at tip, master, i43, join).

THE MEASURES (unit (1)), scripts on this branch under `docs/chair/2026-11-24/tenth/veil/v52/`:
- `q52.sh` steps: dumps (the 140 stored three ways: today-born at the tip, master-born, lit-born at the trial join; VEIL-50's recipe);
  miplant/mitip/mimaster/mijoin (1b); snplant/sntip/snmaster/snjoin (1a); n115 (1c). Receipts `/var/tmp/v52/log/q52.log`; out `/var/tmp/v52/out/`.
- (1a) `meas/snap.probe.jsx` + `snap.sh` + `snap-an.mjs`: A COPY OF wd reading both map reads' world snapshots (D4). DIFF TO VEIL-50
  BEFORE IT RUNS.
- (1b) `meas/wdmi.probe.jsx` + `wdmi.sh` + `wdmi-an.mjs`: A COPY OF wd with `import_gallery_map`'s member as a fifth server door, and a
  planted positive (WD_PLANT=1). DIFF TO VEIL-50 BEFORE IT RUNS.
- (1c) `n115.sh` + `n115.mjs`: a TIMING RECIPE (judges nothing served): the tip's chain against master's own chain on the same 840 and
  1 public rows, every door. Declared to VEIL-50 as not a wd copy.

NEXT: VEIL-50's read of the two copies' diffs, then the plants, then the full runs; (1c) runs meanwhile.
