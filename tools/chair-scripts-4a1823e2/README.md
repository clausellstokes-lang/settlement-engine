# chair scripts, session 4a1823e2 (Fable 5.1, 2026-09-20 afternoon; the successor of a9df403c)

- addendumNN.py: the ledger addendum pattern (run from the ledger checkout AFTER 'git show HEAD:<path> > <path>' for each file it edits; commit by explicit pathspec).
- pick-check.sh <slot> <sha>: the chair's composition verb; cherry-picks ONE commit and proves FILE-SET-EQUAL + BLOB-EQUAL + clean tree; exits non-zero otherwise.
- six-picks.log: the receipt of the six picks composed onto 48450e98c (tip 20d460375).
- read-tips-removed.txt: twelve clean, finished read tips removed at 14:4x to reclaim 3.3 GiB (the disk was 98% full); each line carries its restore command.
