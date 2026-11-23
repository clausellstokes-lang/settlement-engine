# (f) THE DOOR CENSUS AT THE TIP 23bb8b8ae (VEIL-44, 10:57 UTC 2026-11-23; re-run once more on the tip that carries R4-IDS)
Instrument: `census.mjs <tree>` (committed here): every SECURITY DEFINER function whose LATEST definition in `supabase/migrations` reads
`public.settlements` or `public.saved_maps`; columns name, latest migration, VEIL (its body calls `_gallery_veil`), definer, tables, returns,
grants after the definition, volatility. Out: `census-tip-23bb8b8ae.tsv` (63 rows: a WIDER net than v27's 28).
1. v27's 28 rows (`out/v27/imp/fn-census.txt`, decc8c9e7): EVERY ONE IDENTICAL at the tip by name, latest migration and VEIL
   (`diff` of the three columns: no line removed or changed). VEIL on `get_gallery_dossier`, `get_unlisted_dossier`, `import_gallery_dossier`
   (212) and `get_gallery_map` (211); `get_unlisted_map` (168), `import_gallery_map` (072), `_gallery_public_tile_rows` (147) unveiled.
   The three 212 reads are `stable` at the tip; R4-IDS makes them VOLATILE (the brief's item 5): the one row change expected.
2. THE 35 ROWS THE WIDER NET ADDS, read for what they hand a non-owner: none returns `data`, a world snapshot or a value derived from
   `data` except through `_gallery_public_tile_rows` (`list_gallery_more_by_creator` 147 anon; `list_my_gallery_dossiers` 147, the owner's):
   these ride the tile rule. ONE FIDELITY ITEM, NOT A LEAK: `list_curated_dossiers` (011) and `list_featured_dossiers` (168), both anon, hand
   the row's LIVE `name` and `tier`, where doors-3 gives a FROZEN share the copy's name and tier on the tile rows, the dossier, the map member
   and the import (VEIL-DOORS-2 item 6's class; the closed answer serves the name, so a name is never a withheld value). For the walker: enrol
   both with a row "no veil needed: name, tier, slug, time and counts only" or take them into the frozen rule (the chair's).
3. The walker (brief unit 1) is written after the census is re-run on the R4-IDS tip.
