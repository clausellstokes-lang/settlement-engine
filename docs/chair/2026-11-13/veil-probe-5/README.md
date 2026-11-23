# COHERENCE-VEIL-5 — the fifth seat's probes, logs and records (for the security reader)

Hand-back: `../COHERENCE-VEIL-PHASE2-HANDBACK-PART6.md`. Scratch tools, not pins. Paths inside them are absolute
to this seat's container (`SP`/`S` = `/tmp/claude-0/-home-user-settlement-engine/f87af9a7-d5c7-5553-9326-6c79fdba1af5/scratchpad`);
point them at your own.

## The red-first logs (`redfirst/`; each `.txt` is the gate-tail tail, each `.full.log` the whole run)
- `v4-red-at-5a2399cf9-211-and-client.*`: the five V4 pins (`-t "V4"`, galleryVeilCures) on the patched tree with
  migration 211 and `src/domain/display/galleryVeil.js` checked out from 5a2399cf9: **5 failed of 5**.
- `v4-red-at-325f1bbb4-211.*`: the same with 211 as it stood after patch 2 (6cc82965b, before V4-2): **2 failed**
  (V4-2's fixture rows, the 60-town class), **3 passed** (V4-1's three).
- `v5-red-at-5a2399cf9-211-and-client.*`: the V5 composition pin on the MERGED tree with 5a2399cf9's 211 and client:
  **1 failed** (master's `factionGoal` under a shut goals eye, sent by gallery, import and page).
- `v5-green-at-merged.*`: the same pin on the merged tree as committed: **1 passed**.
Recipe: a throwaway worktree of the tip, `node_modules` linked, `git checkout 5a2399cf9 -- supabase/migrations/211_server_side_share_veil.sql src/domain/display/galleryVeil.js`,
then `GATE_MUTEX_TIER=shared sh scripts/gate-tail.sh sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=1 tests/security/galleryVeilCures.pglite.test.js -t "V4"` (or `"V5"`).

## The deployed client's fixture (`master-client/`)
The fourth review's fixture (lane/review-veil-3-2026-11-12 :: docs/chair/2026-11-12/review-veil-3-probes/master-client),
paths re-pointed: `master` = a worktree of db832c892 with `npm ci`; `pgmod` = `npm i pg@8.13.1` outside the repo.
Build three native chains from the tip's files (`native/chain.sh m203 203 <migs>`, `mfull 211`, `m203p211 203 <migs> <migs>/211_*.sql`),
run `npx vitest run --config master-client/vitest.config.mjs` from the master worktree, then
`node master-client/classify.mjs mfull m203p211` (show-more on master's page by path: expected empty) and
`classify-less.mjs` (hide-more by path). Records: `out/master-client-review.json` (the review's run, before
the cures), `out/master-client-pre.json` / `out/master-client-merged.json` (this seat's, before and after the merge).

## Native (`native/`)
- `chain.sh <db> <through> <migdir> [extra file]`: 001..through, each file in its own transaction; scaffold `scaffold.sql`
  (the fourth review's, with Supabase-style default privileges). Cluster: PostgreSQL 16.15, `/var/tmp/cv5`, trust, unix socket.
- `rollback.sh <tag> <supabase dir>`: the exact rollback by `catalog.sql` (down = 210; down twice = 210; 211 again = 211;
  the 210/211 control). Records `out/rollback-pre.txt`, `out/rollback-post.txt`.
- `pdbuild.sh <db> 203 <migdir> <tree>`: the read-only block's fixture database at 203 (then
  `sh docs/chair/2026-11-12/veil-probe-3/predeploy-run.sh <db>`).

## The census and the meter
- `census-kinds.mjs <master galleryVeil.js> <lane galleryVeil.js>`: master's card-kind table, groupings and exports
  against the lane's (`out/census-kinds.json`).
- `meter.mjs <dist>`: the first-paint closure as tests/build/vendorPdfLazy.test.js walks it (raw, gzip -9, Brotli q11).
