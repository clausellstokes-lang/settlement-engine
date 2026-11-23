# V43-MEASURE — STOPPED AT THE BUDGET, NOTHING MEASURED (VEIL-43's builder; brief 5de9073eb, amended by the chair's N91)

## STOPS
1. THE BUDGET (the seat's rule, 2026-11-23): this builder's context leaves under 120,000 of the 350,000. It stops before
   V43-PAGES and before NAMES' first run. A fresh builder takes both.
2. No other stop fired. 212 on the joined tree equals the veil tip's (`git -C /home/user/join43 diff 23bb8b8ae HEAD -- supabase`
   is empty). No server read errored: no run of this probe happened.

## WHAT STANDS (committed; never run)
- `wd.probe.jsx` is the brief's copy of `tell2.probe.jsx`'s `towns` mode: the 140 births, every setting, Reveal off and DM,
  both engines. Its doors: server gallery, link (`get_unlisted_dossier -> 'dossier'`), import (as reader 2222...), map member
  (`get_gallery_map #> '{members,0,settlement}'`, via a `saved_maps` row); twin gallery, and twin link (Reveal off). `RV9_FORM=stored`
  reads `<RV9_STORED_DIR>/<seed>.json` and compares it with the born document byte for byte.
- NAMES (step 2) is built in. HIDING READ = `withheldAllOf(stored, served)` non-empty. The judgment (`withheldOf`, `withheldAllOf`,
  `servedNamesOf`, `namesWithheld`, the never-there record) is carried line for line from
  `tests/security/galleryVeilRecent.pglite.test.js` and checked against that file's bytes at start. `buildNameSearch` is IMPORTED,
  memoized by its arguments. Withheld ids are power ids, house ids and the ids of stored npcs not served by name; they are matched
  as whole strings and as keys. Hits go by `norm(path)`. Map-member hits on `prominentRelationship` / `pressureSentence` are
  LISTED APART (by path; the map member never reads `gallery_share_dm`). Any other map hit makes `wd-an.mjs` exit 3, which is a
  STOP to the seat.
- DAILY (step 1) is WITHDRAWN (N91). It is switched off behind `WD_DAILY=1` (b1aeeaedc), never run, left as WIP. With it off,
  no never-there reads are made.
- `wd.sh <tree> <outdir> v28tpl <born|stored> [stored dir]` runs 4 shards (databases `v43x_<form>_<s>`). `RV9_PICK=14 WD_SHARDS=1`
  is THE COST SHARD (10 towns). It was queued twice and withdrawn twice for LOWER7 and LOWER7-B, so NO COST FIGURE EXISTS.
- THE STORED FORM: the lane's round trip, `out/v33/legacy/dump.sh` + `dump.probe.jsx` at origin/lane/veil-42-2026-11-23-r4ids-wip
  9f9b819f7, extracted unchanged to `/var/tmp/v18/out/v43/meas/lp-src/` (sha256 83ffd4d2… / d8eca0a2…). Run it with `LP_A=0 LP_B=0
  LP_POOL=/var/tmp/v18/out/v43/meas/emptypool` (the default pool dir does not exist; never point it at pool-v43). FOR THE SUCCESSOR:
  `saves.js :: supabaseSave` stores `withPublicProse(withNeighbourNetworkFromRelationship(settlement), composePublicProse(...))`,
  but dump.probe.jsx composes WITHOUT the neighbour step (it says it is a no-op without a neighbour). The probe counts births with a
  `neighborRelationship.name` and the stored-vs-born byte equality, so that claim is measured, not assumed. Master-born stored
  documents are not in this measure.

## FOR THE SUCCESSOR, IN ORDER
Cost shard (born), from /home/user/join43:
`sh scripts/gate-mutex.sh --run -- sh <meas>/wd.sh /home/user/join43 /var/tmp/v18/out/v43/meas/cost-born v28tpl born`, with
`WD_SHARDS=1 RV9_PICK=14` (and `GATE_MUTEX_MAX_POLLS=360`: the seat's chains hold the lock for long). Then the dump (stored) and
both forms in full. R5's named list is NOT in PART30 §1 as a list. §1 names two R5 items: rule 14's six alias paths
`publicProse.blocks.economy:{daily_life,resources,services}.{incomeMix,criminalLine}` and item (b) `powerStructure.factions[].desc`.
Mark against those and say so (PLAUSIBLE). The landed point of an OUT path's writer:
`git -C /home/user/join43 log --format='%h %s' 8f3b8bf4b..9b0ffaa97 -- <writer>`.

## CONFIRMED vs PLAUSIBLE
CONFIRMED: the supabase diff is empty; the carried judgment lines are checked by the probe at start (by design; not yet executed).
Everything else: UNMEASURED.
