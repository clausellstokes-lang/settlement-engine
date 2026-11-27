# RENAME-MEASURE running notes
- tree: lane/stack-121-guard-wip-2026-11-27 at cccda7569; chair record worktree ../chair at c218485f3 (lane/chair-2026-11-08 tip)
- tools copied from chair rmeasure/tools to /tmp/rename/tools; npm ci ok; unshallow fetch run
- (A) static census delegated to a read-only subagent -> A-keys.draft.tsv, then checked by me
- (A) census returned: 33 sites, 24 with a name in the key; checked against the executed pick log (every name-keyed site the log saw is in the list). A-keys.tsv = the census + 3 columns.
- (B) roads: B.jsonl (identity parts per road), BR.jsonl (owner page vs imported copy). _seed dropped by JSON import, share projection, gallery import; id, names, person ids kept everywhere; houses/powers have no id. Imported copies re-deal 10/10 pages (seed-keyed sites; traditions re-derived).
- (C) renames written from reading + greps; nameless probe pending (after D).
- (D) running: work/D-C.jsonl then D-V.jsonl, first 300 of each plan (= thorps and hamlets only: the plans are ordered by size). Process peaks ~2.0 GB at chunk 75.
- house = institution; its writer (institutionRename.js) has no UI caller; (D) uses the writer.
