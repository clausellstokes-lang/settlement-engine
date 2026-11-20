# VEIL-DOORS — hand-back (the doors beside `data`: V10-1, V10-3, V10-4)

Seat: VEIL-DOORS, branch `lane/veil-doors-2026-11-20` (cut from origin/lane/veil-18-2026-11-19 at bedd5a392, read back
equal). Assignment: `lane/chair-2026-11-08 :: docs/chair/2026-11-20/seventh/prompts/VEIL-DOORS.txt`. Written 2026-11-20 01:51 UTC.
Every database local (scratch PostgreSQL 16, unix socket `/var/tmp/rv7`, `listen_addresses = ''`; pglite). **TIP: the
commit carrying this file.** The build is **04704a660**; this file follows it.

## 1. The bytes
| File | sha256 |
|---|---|
| 211 (FROZEN) | `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` (proved at beccbc2c2 and 04704a660) |
| 211 down (FROZEN) | `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` (same) |
| 212 at 04704a660 | `a79c285206c85ae9554d8c19c0420b9e57a52357db8355317118169c7285c576` |
| 212 down at 04704a660 | `f8bcf5426b811cf209ce3f67140d7e4403a303ae69b0272ebd8e17fd64b6a019` |

## 2. The census of doors (the seat's, read off the grants and bodies on a chain 001..212; matches the reader's ten rows)
| # | Function (grant) | Column / filter / sort / count | Source | Governs at bedd5a392 |
|---|---|---|---|---|
| 1 | get_gallery_dossier (anon, auth) | data | the town, projected | 211 + 212 veil (VEIL-19) |
| 2 | get_gallery_dossier | gallery_member_overrides | `served` allowlist | 211 |
| 3 | get_gallery_dossier | population, terrain, government_type, magic_level, stability, primary_resource, threat_level | `_gallery_public_tile_rows` RAW `settlements.data` | NONE (V10-3) |
| 4 | get_gallery_dossier | chronicle | `campaign_state.eventLog` via 032's allowlist | NONE (V10-1) |
| 5 | get_gallery_dossier | id, public_slug, name (gallery title or name), tier, published_at, updated_at, view_count, is_curated, gallery_description, gallery_image_url/alt, gallery_tags, gallery_share_dm, gallery_importable, net_votes, comment_count, author_name, aliveness | the row, owner-written columns, counts | not derived from `data` (owner-authored or counted) |
| 6 | list_gallery_dossiers (anon, auth) | the tile columns of 3 + culture, prosperity, primary_deity, at_war, importable, aliveness, reactions | tile rows: RAW data; prosperity/culture/deity facet columns (publish-time copies of data) | NONE (V10-3) |
| 7 | list_gallery_dossiers | FILTERS tier, terrain, magicLevel, culture, prosperity, hasDeity, atWar, populationMin/Max, importable, hasImage, hasComments, curatedOnly | tile rows (RAW) | NONE: prosperity / terrain / culture / magic / deity / population read raw (an oracle on a marked row) |
| 8 | list_gallery_dossiers | SEARCH name / description / tags; SORTS votes, views, comments, newest, updated, population, name, most_alive, relevance; COUNT total_count | owner-written text, counts, population | population (floor), the rest not derived from `data` |
| 9 | list_gallery_more_by_creator (anon, auth) | tile columns as 6 | tile rows RAW | NONE (V10-3) |
| 10 | list_featured_dossiers, list_curated_dossiers (anon, auth) | id, slug, name, tier, published_at, view_count, order | the row | not derived from `data` |
| 11 | list_my_gallery_dossiers (auth, owner-scoped) | tile columns | tile rows | OWNER read: not a door |
| 12 | _gallery_public_tile_rows() (SECURITY DEFINER; anon, auth by the default privileges: `revoke ... from public` only) | every tile column RAW + owner_id of every public row | RAW data | NONE: callable directly |
| 13 | get_unlisted_dossier (anon, auth) | dossier; gallery_member_overrides; name (s.name), tier, author_name, is_owner | the town | 211 + 212; no chronicle, no tiles |
| 14 | import_gallery_dossier (auth, premium) | data; name, tier | the town | 211 + 212 |
| 15 | get_gallery_map (anon, auth) | members[].settlement | member town, sanitised | 211's `_gallery_veil(..., false)`: an UNMARKED member RAW (V10-4) |
| 16 | get_gallery_map | members[].chronicle | member eventLog via 032 | NONE (V10-1) |
| 17 | get_gallery_map | members[].name (s.name), tier, public_slug, old_id | the row | town's own name (a floor) |
| 18 | get_gallery_map | world.snapshot, world.sections, realmArcSummary | STORED at publish (worldSnapshotPublic: tick headlines, affected settlements) | NONE: not derived from a town's `data` at read; headlines may carry world-pulse words (not measured here) |
| 19 | get_gallery_map | mapState (placements, labels, markers, fmgSnapshot, customBackdrop, forests), description, tags, image | the map (owner-authored) | not derived from a town |
| 20 | import_gallery_map (auth) | = get_gallery_map | as 15-19 | as 15-19 |
| 21 | get_unlisted_map (anon, auth) | world_snapshot, world_sections, realm_arc_summary, description, tags | STORED | as 18 |
| 22 | list_gallery_maps, list_featured_maps (anon, auth) | facets (at_war, world_age, aliveness), member_count, backdrop, thumb | the map row; member_count counts members | not derived from a town's `data` |
| 23 | get_gallery_vote_state, get_gallery_reaction_state, list_gallery_comments (anon, auth) | counts, comments | user content | not derived from `data` |
| 24 | og-image edge function; api/gallery-meta (consumers of 1 and 3) | name, tier, terrain, population, government_type, magic_level, stability | get_gallery_dossier's top-level columns | follow 3 |

NEW beyond the reader's census: row 12 (`_gallery_public_tile_rows()` callable by anon directly; also found by VEIL-19's
measure; ruled VR27) and, OUTSIDE this lane, the same default-privilege class reaches `handle_premium_downgrade`, six
`admin_*` taking a caller-supplied `p_actor`, and the two `purge_*` (CONFIRMED on the local chain with Supabase's default
privileges emulated; PLAUSIBLE on production: told to the chair 01:4x UTC with the read-only query).

## 3. The mechanisms, as built (04704a660)
Placement (the chair, 01:40 UTC): ONE section of 212 immediately before `[212: RESTATED] public.get_gallery_dossier`
(helpers, the restated tile rows, get_gallery_map); two in-place hunks in get_gallery_dossier (the chronicle line; the
seven tile columns); a revoke loop for `_gallery_doors_*` beside section 7; one block at the end of 212's down file.
- **(A) TILES.** `_gallery_public_tile_rows` restated, same signature, pg_temp pin. Unmarked row: 147's columns exactly
  (VR23). Marked row, read from the read's own source (narration, then the frozen copy): stability = band word alone
  (`_gallery_doors_band`, labelBands.js STABILITY_BANDS); prosperity = its stored band (VR28 tier 2); every tile drawn
  from the town NULL where a hideable house's or hidden power's name (name-search fold, squeezed) lies inside it
  (`_gallery_doors_names`, `_gallery_doors_tile`, `_gallery_doors_squeeze`); facet copies not read for a marked row.
  Dossier: every tile NULL beside the closed answer (`_gallery_doors_closed`). Revoked from public, anon, authenticated.
- **(B) CHRONICLE.** `_gallery_doors_chronicle(log, proj, v, src, share_dm)`: unmarked → 032 exactly; closed → null;
  entry withheld whole if its type is unclassed, if `covert` and a criminal grouping is shut or a house removed, or if
  the name search (VEIL-19's `_gallery_veil_name_search` / `_name_hits` / `_named`, called) finds in its summary, its
  targets or its payload a removed house (proj minus body by id: name, label, catalogId), a removed person, or (non-DM)
  a hidden power; then the newest 50 of the served (VR21); each served entry = appliedAt (timestamp if truthy, else
  appliedAt), narrativeSummary, partyCaused (true or absent), event.type; no id.
- **(C) WALKER.** `tests/security/galleryDoors.walker.test.js`: 63 visitor-callable functions touching towns or maps
  registered (13 door, 21 owner, 14 admin, 11 social, 4 system), every door's column, filter and sort with its rule; the
  tile rows executable by no visitor; the chronicle class table equal in both engines and covering every type the app
  writes; the band table one. Manifest rows added for both new test files.
- **(D) MAP.** get_gallery_map restated at 211's body with ONE change: `_gallery_veil(pub.j, overrides, true)` (an
  unmarked member takes the default veil), its chronicle by (B) under that veil.
- **Twin:** `src/domain/display/galleryDoors.js` (tileBand, hideableNames, doorTile, tilesUnderVeil, CHRONICLE_CLASSES,
  veilChronicle).

THE CHRONICLE CLASS TABLE AS BUILT: `covert` IMPOSE_CORRUPTION; `target` every other registry type (40) plus
RENAME_SETTLEMENT, DESTROY_SETTLEMENT, TABLE_INCIDENT (43 rows + 1 = 44). The chair's addition (each type classed ON PURPOSE
against the default veil's classes: secret, hooks, rumour/war truth, housekeeping, corruption) is NOT yet done: next seat.

## 4. Red and green (executed)
- Base bedd5a392: the six server arms RED, each for its own finding (`/var/tmp/vd/out/red-base.log`: 6 failed of 6).
- 04704a660: galleryDoors.pglite 7 of 7 (server against twin, default and hand veils, Reveal DM off and on, the closed
  answer), walker 6 of 6; typecheck:domain:strict exit 0; typecheck:ratchet exit 0 (167, ceiling 167); lint 0 errors;
  mutationCoverageManifest 10 of 10; galleryVeilCures' rollback arm green in a scratch tree of the same bytes.
- tests/security whole at 04704a660: Test Files 2 failed | 156 passed | 1 skipped (159); Tests 11 failed | 1992 passed | 1
  skipped (2004). BOTH CAUSES THIS SEAT'S, both cured by re-keying BY IDENTITY in the next commit: (i)
  galleryMapMemberCount.pglite (3): it loads only `_gallery_veil*` helpers net-current, so get_gallery_map's new call to
  `_gallery_doors_chronicle` did not exist there; its loader now takes `_gallery_(veil|doors)*` -> 11 of 11. (ii)
  galleryServerVeil.pglite (8, every born row): its pin "the map member equals the listing" held an UNMARKED member to the
  unveiled listing; VR23 rules that member takes the default veil, so for the unmarked share its reference page is now the
  party link's (the default veil), for every marked share still the listing's -> 17 of 17. The whole directory was NOT
  re-run after the re-keys (the two files were; the other 156 files passed on the same SQL).
- Measured on 140 births (89 hideable), the default veil: stability A/B 11, A/C 1; prosperity 34 / 7; government 0/12.
  The reader's repros (origin/lane/review-veil-10-2026-11-20) were NOT re-run as reds by this seat (my own repros of the
  same rows were: next seat runs theirs).

## 5. What a visitor's bytes held, before and after
Before: the chronicle named the hidden house and the covert act on the gallery read and every map member; the stability
tile carried its cause ("Unstable (pervasive organized crime)") on cards, the social card, the dossier column and lists;
tiles beside the closed answer; an unmarked map member served whole; the tile rows callable directly with owner_id.
After: none of these (arms above). THE RESIDUAL (VR28 tier 2, stated plainly): a card shows AS STORED the prosperity
band and the stability band word (their inversion counts are the recorded residual: prosperity 34 vs 7, stability 11 vs 1
in the seat's census).

## 6. What a card and a page lose
Marked rows only: the stability chip loses its cause (keeps the band word); any tile/chip whose text holds a hideable
house's or hidden power's name goes (rare: a sharer's own config); the dossier's tile columns beside the closed answer;
chronicle entries that name a withheld house, person or power, every covert act under a shut criminal grouping, any
unclassed type; the entry ids (the page numbers what it gets). Map members with no veil now show the default-veiled page.

## 7. The cost rows (native chain, median of 9)
| Read | base bedd5a392 | the mechanism (scratch, same SQL as built) |
|---|---|---|
| list_gallery_dossiers 50 rows | 198–204 ms | 278–292 ms (1.40–1.47x) |
| list_gallery_dossiers 500 rows | 2.01 s | 2.60–3.03 s (1.30–1.51x, noisy) |
| get_gallery_dossier at 50 / 500 public rows | 231 ms / 1.97 s | 316–335 ms / 2.59–3.03 s |
Accepted by the chair at 1.3–1.5x on the list on two conditions NOT YET MET: (a) the dossier read takes its ONE row's
tiles and becomes faster than 231 ms at 50; (b) show an unmarked row costs what it did. FOR THE OWNER: the gallery's list
already costs about 2 s at 500 public towns BEFORE any veil, because it computes every town's tiles on every request; that
debt is older than this work, and its cure is stored public tiles (VR28's "public face", after the deploy).

## 8. Stored figures this change moves (not re-frozen here; VEIL-19 takes each door once)
The lighting census (new test titles: galleryDoors.pglite 7, galleryDoors.walker 6); the wiring census and the writers'
reach (a new module, src/domain/display/galleryDoors.js, imported by tests only); scripts/mutation-coverage-manifest.json
(two rationale rows, added); two pins RE-KEYED by identity (section 4: galleryMapMemberCount's helper loader, galleryServerVeil's map-member reference page). No new top-level named numeric constant in src/.

## 9. LEFT FOR THE NEXT SEAT (the chair's rulings of 01:20–01:40 UTC), in order
1. The ONE-ROW dossier read (needs a third hunk in get_gallery_dossier: the tile-rows join, or a one-row tile helper);
   the 50/500 read rows before and after; the unmarked-row cost shown equal.
2. VR27: revoke by name from anon and authenticated the eight other helpers (`_gallery_chronicle_entry`,
   `_gallery_chronicle_json`, `_gallery_map_backdrop`, `_gallery_apply_member_overrides`, `_gallery_npc_key`,
   `_gallery_dm_full_json`, `_gallery_sanitize_public_json`, `_gallery_world_snapshot_is_safe`), every door tested as
   anon after; the walker's arm over the whole catalogue (every underscore function executable by neither role); the
   deploy document's read-only grants query.
3. import_gallery_map restated (VR23 binds the import; today it calls get_gallery_map, so it already follows: confirm and
   restate as ruled).
4. The 44-type class table re-read against the default veil's classes (secret, hooks, rumour/war truth, housekeeping,
   corruption), the table with class, rule, why in this file.
5. Snapshot mode: the chronicle (and any column beside the body) of a frozen share must not tell what the DM did after
   the freeze: measure (freeze, then change the live town), then compute from the copy or withhold. The tiles already read
   the frozen copy.
6. The reader's own repros as reds; the acceptance run (exit 1, a07 and d06 the only FAIL rows) — NOT run by this seat.

EXECUTED: sections 2 (grants, bodies), 4 (as listed), 7 (cost rows). PLAUSIBLE: production's default privileges (row 12
and the outside-lane functions) — one read settles it.
