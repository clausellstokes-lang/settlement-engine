# LANE TE-R3 RECEIPT — COMPLETE, GREEN, PINNED

SLOT: claude/composite-r4 = 510c51b766a4ef329a697d61f3006e23d4fb2325
PIN:  refs/preserve/holding-r3 = 5efef38fad73c20135f585704df25b21ca8a1cd3
  commit 1 (code half):   264225618970eab64b85f34b42c3983c95e084da   49 files
  commit 2 (packet half): 5efef38fad73c20135f585704df25b21ca8a1cd3    4 files
WORKTREE: .../scratchpad/laneR3-tree (npm ci, 468 pkgs, .husky/_ present, hooks ran)

## GATE (verbatim)
[test-ratchet] OK — no test regressions (11 known failure(s) of 29044 tests, ceiling 11).
[test-ratchet] STRICT DIST OK — 53 discovered/reported file(s), 467 test(s), zero failed/non-run/uncollected/missing/extra/duplicate rows.
[gate-tail] exit: 0 (the gate's own status, not a pipe's)
TRUE_EXIT=0
free disk at end: 18,428 MB

## RE-DERIVED FIGURES
- 75 files / 75 rows / 0 unregistered / 0 ghosts. 6 marked, 69 bare = 46 AI + 23 cohort A. **46 CONFIRMED.**
- jpg 24 / webp 16 / mp4 6, over 52,755,638 B. Payload delta +71,229 B (~0.135%).
- Masters 82: 32 C2PA, 25 Google credit, 10 job-id-and-no-Google. Matches the register.
- 5 shipped files descend from the 2 no-Google masters (measured by pixel RMS, not filename).
- Packets 177 -> 178.
- CENSUS +0/+0/+0/+9 titles/+1 suite -> 2525/366/2159/21026/5848.
- Strict dist 458 -> 467 (+9). Source ratchet unmoved at 29,044: tests/build/** is SOURCE_TEST_EXCLUDE.

## PROOFS
- All 46 decode pixel-identical before/after; round-trip reproduces shipped bytes exactly.
- ffmpeg corroboration: leg-1 rgb24 sha identical (121 frames), differs when mdat mutated.
- Injector mutations M1-M6 each red their intended arm; M0/M7 green.
- Census controls C1 (single-file revert -> slot tuple exactly), C2/C3 substitutions red.
- 6 survivors + 23 cohort-A files all byte-identical to the slot (hashed).

## NOT DONE (deliberate)
- No C2PA re-created/re-attached. No cohort-A change. No CAS, no pin deletion, no push.
