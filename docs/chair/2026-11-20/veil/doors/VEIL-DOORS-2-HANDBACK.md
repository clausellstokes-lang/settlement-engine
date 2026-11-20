# VEIL-DOORS-2 — hand-back (finishing the doors beside `data`)

Seat: VEIL-DOORS-2, branch `lane/veil-doors-2-2026-11-20`, cut from origin/lane/veil-doors-2026-11-20 at **cca49cb8d** (read
back from origin first: equal). Assignment: `lane/chair-2026-11-08 :: docs/chair/2026-11-20/seventh/prompts/VEIL-DOORS-2.txt`,
read at 6cb1e2003. Written 2026-11-20 02:37 UTC; kept current at every push. Every database local: a scratch PostgreSQL 16.15 in this
container (unix socket `/var/tmp/vd2/sock`, `listen_addresses = ''`, read back empty), and in-process pglite. **TIP: the commit
carrying this file.**

## 1. The bytes
| File | sha256 |
|---|---|
| 211 (FROZEN) | `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` (proved at cca49cb8d) |
| 211 down (FROZEN) | `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` (proved at cca49cb8d) |
| 212 at the base | `a79c285206c85ae9554d8c19c0420b9e57a52357db8355317118169c7285c576` (equal to the predecessor's 04704a660) |
| 212 down at the base | `f8bcf5426b811cf209ce3f67140d7e4403a303ae69b0272ebd8e17fd64b6a019` |

## 2. The base, measured (item 1)
Each figure with its output file beside it (`docs/chair/2026-11-20/veil/doors/v2/out/`), read by its count lines.
- The doors' arms and the walker: `base-doors-arms.txt`: Test Files 2 passed (2), Tests 13 passed (13) (galleryDoors.pglite
  7 of 7, galleryDoors.walker 6 of 6), exit 0.
- `tests/security` WHOLE (the predecessor's two re-keys included; it had not re-run the directory): `base-tests-security.txt`:
  Test Files 158 passed | 1 skipped (159); Tests 2003 passed | 1 skipped (2004); exit 0. The predecessor's 11 reds of
  04704a660 are gone at cca49cb8d (its two re-keyed files are among the 158).
- The instruments: the native chain loader (the pglite arms' scaffold with Supabase's default privileges, then every
  migration on disk in order); born towns by the engine's own pipeline through vite's loader (the browser's wizard
  defaults, the four sizes cycled, `publicProse` composed); the cost harness (median of 9 after one warm-up, read as anon).

## 3. Item 2 — the one-row dossier read (the chair's conditions (a) and (b)), as built (written 2026-11-20 03:17 UTC)
- **Mechanism.** A new helper `_gallery_doors_tiles(data, overrides, narrated, ai_data, facet culture, facet prosperity,
  facet deity)`: THE TILE RULE for one row, the predecessor's marked/unmarked expressions moved verbatim into one plain SQL
  function (no definer, no SET), which the planner INLINES into each caller (read back: `explain` shows no function scan).
  `_gallery_public_tile_rows` reads its ten tile columns from it (every list, filter, sort and count: one rule);
  `get_gallery_dossier`'s join to the tile rows of EVERY public row is replaced by ONE hunk: a lateral over its own row
  (the helper, the row's own columns as the tile rows state them, its vote and live-comment counts by its id).
  Revoked from visitors by the doors' loop (`_gallery_doors_%`); its drop added to the doors' block of the rollback.
- **The cause of an unmarked row's extra cost, found and cured:** the predecessor's `offset 0` fence on the source
  document. Measured on 500 unmarked rows, `select count(*) from _gallery_public_tile_rows()`: bedd5a392 3.66 / 3.85 s;
  the same rule with the fence 5.44 / 5.28 s; without it 3.91 / 3.74 s. The fence is gone (a comment says why).
- **Red and green.** The arm THE ONE-ROW READ (galleryDoors.pglite): its body check red at cca49cb8d ("the dossier read
  computes the tile rows of EVERY public row to read its one": `out/item2-red-at-cca49cb8d.txt`, 1 failed | 7 passed);
  green at the commit with the other doors' guards: galleryDoors.pglite, galleryDoors.walker, galleryVeilCures (its
  rollback arm included), galleryMapMemberCount: 4 files, 57 of 57 (`out/item2-green.txt`). The arm also pins every row
  and tile column the dossier sends EQUAL to the list's row over five shares (unmarked, the default veil, Reveal DM, a hand
  veil, snapshot mode), with a vote, a live comment, a deleted one and a gallery title.
- **The cost rows** (`out/item2-cost-rows.txt`; native PG 16.15, 4 cores, read as anon, median of 9 after one warm-up;
  born towns of the four sizes, ~250 KB each, each with a chronicle of one entry per house; list = page 0 of 24, newest;
  "filtered" adds a prosperity filter). THIS container is about twice as slow as the predecessor's: its 231 ms base read
  measures 487 ms here, so every comparison below is made on this machine, same corpus, back to back.

| Read | rows | bedd5a392 | base cca49cb8d | this commit |
|---|---|---|---|---|
| get_gallery_dossier, an unmarked row | 50 / 500 | 423 ms / 3.47 s | 487 ms / 5.01 s | **116 ms / 103 ms** |
| get_gallery_dossier, a marked row (default veil) | 50 / 500 | 436 ms / 3.48 s | 599 ms / 5.23 s | **135 ms / 125 ms** |
| list, every row unmarked | 50 / 500 | 322 ms / 3.41 s | 388 ms / 4.97 s | **330 ms / 3.44 s** (1.02x / 1.01x of bedd5a392) |
| list, every row marked | 50 / 500 | 323 ms / 3.36 s | 461 ms / 5.12 s | **407 ms / 4.08 s** (1.26x / 1.21x) |
| list filtered, unmarked / marked, 500 | 500 | 3.37 s / 3.42 s | 4.93 s / 5.17 s | 3.39 s / 4.16 s |

  (a) MET: the dossier read at 50 rows ends at 116–135 ms, below the base's (487–599 ms here) and below the predecessor's
  231 ms figure; it no longer grows with the gallery (500 rows: 103–125 ms). (b) MET: an unmarked row's read is faster than
  at bedd5a392, and an unmarked row's place in the list costs what it did (1.01x–1.02x, within the run's noise). The
  marked list now sits at 1.21x–1.26x, under the accepted 1.3–1.5x.
- **Bytes at this commit:** 212 `3fe9def3bc8535e50f884ec3b5bc582f9bcccdd800b01d89976cdf4d30276563`; down
  `f443aff7eb6b5ccce4794689fb610ca45136905af85ad9552dc7cb5cb528d086`. The cost rows ran on a chain whose 212
  differs from these bytes by one comment (the fence's), nothing else.
- **A pin red, NAMED, not touched:** `tests/lint/migrationSearchPathPin.test.js`, 2 of 5 red AT THE BASE already
  (`out/searchpath-pin-at-cca49cb8d.txt`): `public._gallery_public_tile_rows` is pinned now (the predecessor's restatement
  took the pg_temp pin), so its rows in the shrink-only baseline `tests/lint/.migration-searchpath-baseline.json` and in
  the test's POST_CONVENTION_BARE ledger are stale. The cure is to delete those two rows (the test's own instruction); it is
  a stored register, so it is the lane owner's at the merged tree.
