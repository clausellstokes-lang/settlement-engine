# RENAME-MEASURE running notes
- tree: lane/stack-121-guard-wip-2026-11-27 at cccda7569; chair record worktree ../chair at c218485f3 (lane/chair-2026-11-08 tip)
- tools copied from chair rmeasure/tools to /tmp/rename/tools; npm ci ok; unshallow fetch run
- (A) static census delegated to a read-only subagent -> A-keys.draft.tsv, then checked by me
- (A) census returned: 33 sites, 24 with a name in the key; checked against the executed pick log (every name-keyed site the log saw is in the list). A-keys.tsv = the census + 3 columns.
- (B) roads: B.jsonl (identity parts per road), BR.jsonl (owner page vs imported copy). _seed dropped by JSON import, share projection, gallery import; id, names, person ids kept everywhere; houses/powers have no id. Imported copies re-deal 10/10 pages (seed-keyed sites; traditions re-derived).
- (C) renames written from reading + greps; nameless probe pending (after D).
- (D) running: work/D-C.jsonl then D-V.jsonl, first 300 of each plan (= thorps and hamlets only: the plans are ordered by size). Process peaks ~2.0 GB at chunk 75.
- house = institution; its writer (institutionRename.js) has no UI caller; (D) uses the writer.
- (C) done: nameless by JSON import CONFIRMED (N.jsonl). (E) scratch tree /tmp/rename/rekey (git archive of cccda7569 + 7 key edits, never committed); bundles e-base.mjs / e-rekey.mjs tested.
- (D) done: D-C/D-V (300 each, 0 errors); owner vs share restricted to rendered tabs (the non-DOM surfaces are owner-only); the 39 owner/share differences after rename all = the owner-only DM resentments slot (A6). Classifier decodes HTML entities.
- (F) done: 4 stored homes hold the town name (arrivalScene, stress.summary, pressureSentence, stress[].summary); 300/300 C, 295/300 V pages still print the old name.
- (E) running: E-base-C/V then E-rekey-C/V (900 each, chunks of 40).

- 02:27 UTC: the first E run was stopped by the harness's background time limit at E-rekey-C 637/900 (E-base-C and E-base-V complete, 900 each). Resumed from line 637 with run-e.sh (it resumes from existing lines; torn line trim); rekey-V follows.
- E done: run-e.log `exit 0`, 4 x 900 lines, 0 errors. analyze-e.mjs C / V and analyze-e-groups.mjs C / V. The cure moves 900 / 900 pages once in each corpus. tools/rekey.patch is the scratch re-key (diff of cccda7569 src against /tmp/rename/rekey/src), never applied to any tracked tree.
