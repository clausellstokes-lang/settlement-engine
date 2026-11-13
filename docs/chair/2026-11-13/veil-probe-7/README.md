# veil-probe-7 — 211 frozen, its later cures re-homed into 212, proved equal (COHERENCE-VEIL-7)

Scratch tools and their outputs, not pins. Every database was a local scratch PostgreSQL 16.15 cluster on a unix
socket (`/var/tmp/cv7`, trust auth, no TCP). Nothing here touches a hosted database.

- `tools/gen212.py` built `supabase/migrations/212_share_veil_later_cures.sql` and its down file mechanically:
  `tools/spans.py` cuts every `create or replace function` statement out of a file; every statement the lane's 211
  at 28f52b1e4 adds or changes against the frozen 211 (333b33973) is copied verbatim into 212 (lead comments with
  it, the file's own order), the two restated reads' revoke/grant after them and 211's section 7 last; the down file
  copies the frozen 211's statements of the five changed functions verbatim and drops the ten new by signature.
  The headers are `tools/header212*.sql`. `tools/fdiff.py` and `tools/rest.py` measured, first, that the two 211s
  differ in those fifteen statements and in comments only (`out/fdiff-*.txt`, `out/rest-*.txt`, `out/verbatim-212.txt`).
- `native/rehearse7.sh` is the lane's rehearsal comparison (`veil-probe-6/native/rehearse.sh`: the review's
  `chain.sh` and `catalog.sql`, from `lane/review-veil-3-2026-11-12` at 4700d33eb,
  `docs/chair/2026-11-13/review-veil-5-probes/native/`) plus every comment (`native/comments.sql`):
  `sh native/rehearse7.sh <review native dir with comments.sql beside it> <the lane's migrations at 28f52b1e4> <supabase/migrations> <supabase/rollback> <out dir>`.
  Its output: `out/rehearse7.txt`.
