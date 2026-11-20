# VEIL-DOORS-2 — hand-back (finishing the doors beside `data`)

Seat: VEIL-DOORS-2, branch `lane/veil-doors-2-2026-11-20`, cut from origin/lane/veil-doors-2026-11-20 at **cca49cb8d** (read
back from origin first: equal). Assignment: `lane/chair-2026-11-08 :: docs/chair/2026-11-20/seventh/prompts/VEIL-DOORS-2.txt`,
read at 6cb1e2003. Written 2026-11-20 02:37 UTC; kept current at every push. Every database local: a scratch PostgreSQL 16.15 in this
container (unix socket `/var/tmp/vd2/sock`, `listen_addresses = ''`, read back empty), and in-process pglite. **TIP: the commit
carrying this file** (the last build is 3a57e3a0c; this file's commit adds docs only).

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

## 4. Item 3 — VR27 as amended (written 2026-11-20 03:22 UTC)
- **212 holds no revoke of the eight older helpers**: its three revoke statements name `_gallery_public_tile_rows()`, the
  `_gallery_veil%` loop and the `_gallery_doors_%` loop; none of the eight matches either pattern. 212 is UNCHANGED by
  this item. Now pinned (walker arm 7: no `revoke` in 212 names one of the eight).
- **The walker's catalogue arm, amended form** (`galleryDoors.walker.test.js` arm 7): every underscore function of the
  share's family (named `_gallery_*` or `_saved_maps_*`, or whose body names a town or a map) that anon or
  authenticated may execute stands on VISITOR_LIST: `_gallery_world_snapshot_is_safe` (needed: a signed-in user's map
  save, run as that user by the invoker trigger) and `_saved_maps_world_snapshot_guard` (the trigger function itself) by
  their visitor context; the other seven older helpers by SEC-GRANTS's catalogue class (an invoker that grants nothing,
  "VISITOR-NEEDED" or "INTERNAL, for 213"), left to 213. No listed row may be a definer; red on an unlisted one and on a
  stale row. **My reading, for the chair to veto:** the ruling's "a written list that names the visitor context that needs
  it" would red on the seven invokers no visitor needs; VR27 as amended also says they are not 212's to revoke. So the list
  names, for each, either the context that needs it or the catalogue's class that leaves it to 213; the arm's scope is the
  share's family, not the whole catalogue (the whole catalogue's 26 visitor-executable underscore functions on this chain
  include 11 definers outside the veil, e.g. `_surveyor_byok_secret()`, `_audit_action(...)`: SEC-GRANTS's catalogue already
  classes them "INTERNAL, revoked now"; a whole-catalogue arm here would red until 213 lands).
- **Every door as anon and as authenticated after 212, and a map saved by a signed-in user** (arm 8): ten visitor doors
  called as both roles on a chain holding a shared town (default veil, listed and unlisted) and a shared campaign map,
  each answering with the row; the two imports as authenticated; a signed-in user INSERTS and UPDATES their own map with a
  world snapshot and sections (the saved_maps trigger's path). The walker's scaffold now also grants tables and sequences
  to the visitor roles, as Supabase's default privileges do (needed for the RLS write; the census reads functions only).
- **Red first, by plant and removal** (212 restored byte-equal after each, sha256 read back): (i) a visitor-executable
  `_gallery_plant_vr27()` reds arm 7 naming it (`out/item3-red-plant1-unlisted-helper.txt`: 1 failed | 7 passed); (ii) THE
  CHAIR'S WITHDRAWN FIRST WORDING (`revoke ... _gallery_world_snapshot_is_safe(jsonb) from public, anon, authenticated`)
  reds arms 7 and 8 (`out/item3-red-plant2-revoke-snapshot-guard.txt`: 2 failed | 6 passed): "a signed-in user's map save:
  permission denied for function _gallery_world_snapshot_is_safe". The amendment's reason, executed. Green: walker 8 of 8,
  mutationCoverageManifest 10 of 10 (`out/item3-green.txt`); eslint 0. The manifest's row for the walker is extended with
  arms 7 and 8 and their plants.

## 5. Item 4 — the map import under VR23 (written 2026-11-20 03:27 UTC)
- **The path the browser really runs** (read whole): `src/store/galleryImportMap.js :: importGalleryMapWithCampaignImpl`
  (and `importGalleryMapImpl` for a plain map) -> `src/lib/gallery.js :: fetchGalleryMap` -> `supabase.rpc('get_gallery_map')`
  -> each `members[].settlement` normalised and scrubbed -> `saves.save` as the importer's own record. So VR23's cure in
  `get_gallery_map` (the predecessor's) IS the import's; nothing is restated for this item.
- **`import_gallery_map(text)` has no caller**: none in `src/`, `api/`, `scripts/`, `supabase/functions/` (searched by name);
  in SQL only comments of 106 and 120 name it. SEC-GRANTS's catalogue lists it "INTERNAL — revoked now" (its caller column
  "sql: bump_map_import" is a comment, and `bump_map_import` itself has no caller in `src/` either). It is SEC-GRANTS's to
  close; the owner's emergency script revokes it on production. Not touched here.
- **The born arm on that path** (galleryDoors.pglite, "VR23 ON THE BROWSER'S IMPORT PATH"): the client's `rpc` is routed to
  the chain as a signed-in visitor, the save service captured; a campaign map of two members (one unmarked, one with the
  default veil) imported through `importGalleryMapWithCampaignImpl`: each record holds the open Mill and no Black market.
  RED at bedd5a392 (`out/item4-red-at-bedd5a392.txt`: the unmarked member's record carried
  `$.institutions[0].name = "Black market"` and its `catalogId`); GREEN at this commit: the doors' file 9 of 9
  (`out/item4-green.txt`); eslint 0.

## 6. Item 5 — the event-type table, on purpose (written 2026-11-20 03:34 UTC); with the surprise of 03:24 UTC cured
THE SURPRISE (told to the chair at 03:24 UTC, executed at ebe9387a2): the chronicle's name search knew only the houses
still in the projection, so on a marked share an entry naming a criminal house the town NO LONGER HAS ("A new Smugglers den
was established.") passed, live or frozen (a house added after a freeze is in neither the copy nor its projection).
THE CURE (my proposal, sent; built unless vetoed): the names the LOG ITSELF acts on (each house/person/power entry's target,
as the registry narrates it; each house it places a person at, `payload.institution`/`criminalInstitution`) that the
served body does not show (an open house's name, label or catalogue identity; a shown power's; a shown person's name or id;
squeezed fold) join the withheld names, so every entry naming one is withheld whole. It fails toward withholding: a killed
person's entries go, and so do a renamed house's under its old name.

THE TABLE (43 types the app writes: the registry's 41 by `EVENT_TYPES`, the settlement row's RENAME_SETTLEMENT, the table
ledger's TABLE_INCIDENT: 43 by the walker's own scan; the predecessor's "43 rows + 1 = 44" appears to count DESTROY_SETTLEMENT,
a registry type it also listed as a row writer, twice; a type any other writer puts in the log is unclassed, so withheld). Every rule below applies on a MARKED share only; an unmarked listed page keeps 032's chronicle (VR23, R4).
Every class also passes the name search (a withheld house, person or hidden power named anywhere in the entry's summary,
targets or payload withholds it). The served entry is summary, time, partyCaused and type, never the payload.

| Type | Class | Rule on a marked share | Why (the default veil's classes: secret, hooks, rumour/war truth, housekeeping, corruption) | Example summary |
|---|---|---|---|---|
| ADD_INSTITUTION | house | target must be shown | names a house; a criminal house is hidden whole | "A new Mill was established." |
| REMOVE_INSTITUTION | house | target must be shown (a removed house is not: withheld) | as above; a gone house cannot be judged | "The Smugglers den closed or was dissolved." |
| DAMAGE_INSTITUTION | house | target must be shown | as above | "The Mill was damaged." |
| IMPAIR_INSTITUTION | house | target must be shown | as above | "Mill suffered a capacity setback." |
| RESTORE_INSTITUTION | house | target must be shown | as above | "Mill recovered." |
| ADD_NPC | person | target and the house it names must be shown | a person's house tie (people of a hidden house) | "Vess arrived as Miller at the Mill." |
| KILL_NPC | person | target must be shown (a dead person is not: withheld) | a gone person cannot be judged (their house) | "Old Gant is gone." |
| ASSIGN_NPC_TO_ROLE | person | target and its house must be shown | a role at a hidden house is membership | "Vess took up Miller at the Mill." |
| KILL_LEADER | person | target must be shown | as KILL_NPC | "Old Gant (the settlement's leader) is gone." |
| PROMOTE_NPC | person | target must be shown | names a person (no power: the registry's own rule) | "Vess rises within their power, ..." |
| DEMOTE_NPC | person | target must be shown | as above | "Vess is pushed down the ranks of their power." |
| IMPAIR_FACTION | power | target must be a shown power | a hidden power is withheld on a non-DM read | "The Millers lost standing." |
| RESTORE_FACTION | power | as above | as above | "The Millers recovered." |
| ADD_FACTION | power | as above | as above | "A new power, The Millers, has formed." |
| CHANGE_RULING_POWER | power | as above | a hidden power taking power tells it | "The Millers took power in Rookford by coup." |
| IMPOSE_CORRUPTION | covert | withheld under a shut criminal grouping (the default) | CORRUPTION: the underworld's own act | "Mill has been turned by the Smuggling network. ..." |
| EXPOSE_CORRUPTION | covert | as above (RE-CLASSED from target) | CORRUPTION: exists only because a house was corrupt; it tells which | "Corruption inside Mill has been publicly exposed." |
| APPLY_STRESSOR | stressor | withheld under a shut criminal grouping when its key is criminal_corridor, infiltration or infiltrated (RE-CLASSED) | a crime-worded label otherwise reaches the page | "Criminal corridor grips the settlement." / "Famine pressure grips the settlement." (served) |
| RESOLVE_STRESSOR | stressor | as above (RE-CLASSED) | as above | "Criminal corridor no longer grips the settlement." |
| TABLE_INCIDENT | withheld | never on a marked share (RE-CLASSED) | the DM's free text at the table (the session ledger's flavor): hooks, truths and secrets no rule can read | "The party paid off a fence at the docks." |
| DEPLETE_RESOURCE | target | name search | a resource, no house/person/power | "Iron is no longer available." |
| CUT_TRADE_ROUTE | target | name search | a road to a neighbour | "Trade route (Harrowgate) cut." |
| CREATE_ROUTE | target | name search | a road | "A road to Harrowgate is chartered; ..." |
| SETTLEMENT_DISPUTE | target | name search | a neighbour's public relation (served on the page; not the war's truth-vs-belief block) | "Relations with Harrowgate soured to rival." |
| DESTROY_SETTLEMENT | target | name search | the town itself | "Rookford was destroyed by fire." |
| REFUGEE_WAVE | target | name search | a neighbour | "A medium refugee wave arrived from Harrowgate." |
| PLAGUE | target | name search | a disease | "A plague "red cough" is spreading." |
| RAID_OR_MONSTER_ATTACK | target | name search | an outside attacker | "The settlement was attacked by wolves." |
| REMOVED_THREAT | target | name search | an outside threat | "The threat (wolves) was neutralized." |
| BROKERED_ALLIANCE | target | name search | a neighbour | "An alliance was brokered with Harrowgate." |
| STARTED_RIOT | target | name search | a place | "A riot broke out in the docks." |
| OPENED_TRADE_ROUTE | target | name search | a neighbour | "A trade partners trade route with Harrowgate has opened." |
| RECOVERED_RESOURCE | target | name search | a resource | "The Iron has been recovered." |
| ADD_TRADE_GOOD | target | name search | a good | "The settlement now exports Wool." |
| REMOVE_TRADE_GOOD | target | name search | a good | "Wool no longer moves through the settlement's markets." |
| ADD_RESOURCE | target | name search | a resource | "Iron is now worked near the settlement." |
| SET_PRIMARY_DEITY | target | name search | a god (served on the page) | "Aster is proclaimed the settlement's patron deity." |
| IMPOSE_CULT | target | name search | a god's cult (not hidden by the default veil) | "A cult of Vael takes root in the settlement, ..." |
| SHIFT_TIER | target | name search | the tier | "The settlement swells to a larger tier, ..." |
| REMOVE_RESOURCE | target | name search | a resource | "Iron is gone. No longer worked, no longer counted on." |
| FORCE_RELIEF | target | name search | a neighbour | "Grain wagons rolled to Harrowgate: relief by decree." |
| OFFER_CREDIT | target | name search | a neighbour | "A measure of grain went to Harrowgate: as a loan, not a gift." |
| RENAME_SETTLEMENT | target | name search | the town's own name (a floor) | "Rookhold is now known as Rookford." |

No type exists for a secret, a hook or a rumour's truth: none of those reaches `narrativeSummary` (ADD_NPC's `payload.secret` is
never served). RE-CLASSED from the predecessor's table: EXPOSE_CORRUPTION, APPLY/RESOLVE_STRESSOR, TABLE_INCIDENT, and the 15
house/person/power types (from target, now judged by what the body shows).

RED AND GREEN. The arm THE EVENT-TYPE TABLE ON PURPOSE (galleryDoors.pglite): at f9f9b4c0c (the commit before) a visitor
read 19 entries it must not, at least one of EVERY re-classed type (`out/item5-red-at-f9f9b4c0c.txt`); at this commit the four
open entries alone, server equal to twin; the unmarked page keeps all 23 (032). Walker arm 5 re-keyed by identity to the
seven classes (each with its rule in the SQL comment). Green: the doors' two files 18 of 18 (`out/item5-green.txt`), eslint 0.
tests/security WHOLE at this commit's tree (`out/item5-tests-security.txt`): Test Files 158 passed | 1 skipped (159); Tests 2008 passed | 1 skipped (2009); exit 0. Bytes: 212 `a99f3ad4b1e6af6604c4c7dd7af7c822f0d4a12a49a1d9be7c577fcc4d39a91e`; down `f443aff7eb6b5ccce4794689fb610ca45136905af85ad9552dc7cb5cb528d086` (unchanged by this item).

## 7. Item 6 — snapshot mode (written 2026-11-20 04:08 UTC)
MEASURED FIRST (native chain at ebe9387a2, read as anon; snapshot is the DEFAULT share mode, `galleryVeil.js :: VEIL_MODES`):
a share frozen at T, then the live town changed (a criminal house and events added, the town renamed, its tier shifted, a
save): the frozen share's `chronicle` showed every post-freeze entry (the new criminal house by name: the 03:24 surprise),
its `name` and `tier` (dossier and list) followed the live row; `updated_at` followed the live save where the row was never
re-published (`gallery_updated_at` null). The body and the tiles were already the copy's.
BUILT (212 and the twin): (a) THE CHRONICLE of a read that serves the frozen copy keeps only entries whose time (as served:
`timestamp` where truthy, else `appliedAt`) is at or before the freeze's `$veil.at`; an entry with no readable time, or a
freeze with none, serves nothing; `_gallery_doors_time` parses without ever failing a read (twin: `timeOf`); the chronicle's
helper takes the freeze marker as a sixth argument (the dossier and the map member pass it where they serve the copy).
(b) NAME AND TIER of a frozen share are the copy's (the gallery title still first on the gallery read): the tile rows, the
dossier's own row, a map's member, and the import's two columns (`import_gallery_dossier`: TWO ONE-LINE HUNKS in the lane
owner's function, flagged here: its `name` and `tier` beside the data it already served from the copy). (c) TIME: a frozen
row's `updated_at` is `gallery_updated_at`, else `published_at`, never the live save (list and dossier; the "recently
updated" sort reads it). What a page loses: a frozen page's chronicle stops at its freeze, as its body does; nothing else.
RED at eafece56a (`out/item6-red-at-eafece56a.txt`): the gallery read of a frozen share sent "Rookford is now known as
Rookhold." and the tier shift, name "Rookhold", tier "city", and the live save time. GREEN: the doors' guards and the rollback
arm, 4 files, 62 of 62; eslint 0.
tests/security WHOLE at this commit's tree (`out/item6-tests-security.txt`): Test Files 158 passed | 1 skipped (159); Tests 2009 passed | 1 skipped (2010); exit 0. Bytes: 212 `35c91700e0c930e375a99c1ed7f0656b768fc7f2eb9a74b936018a4b98331ccc`; down `b5f15a7a25edf36ebb8298db42afcaef8e27b5775cd59cf5559273d2047a590c`.

## 8. Item 7 — the world columns, MEASURED, NOT BUILT (the chair rules first; message sent 03:49 UTC)
Evidence: `out/item7-world-measure.json`. 3 born campaign worlds x 6 member towns, the world pulse advanced 12 months
(`advanceCampaignWorld`, pinned now), the share editor's own `serializeWorldSnapshotPublic` with all five sections on, and
`buildRealmArcSummary`. Of 41 hideable houses and hidden powers: NO name reaches `world.snapshot`, `world.sections` (section
keys only) or `realmArcSummary` (empty here: no war or deity arc formed in 12 months). BUT 31 CRIME-WORDED HEADLINES naming
member towns reach `snapshot.chronicle`: "Thieves and racketeers are working Vysokoino's streets in the open.", "Criminal
corridor is taking hold in Khankhel", "...protection rackets, smuggling habits and guard corruption." `_gallery_world_snapshot_is_safe`
refuses KEYS only (the hard-deny ledger keys, any depth, case-folded), never a value. My reading and options are in the
message; the same stored columns serve `get_unlisted_map`. EXECUTED (the measure); the ruling is the chair's.

## 9. What a visitor's bytes held, before and after (this seat's items)
Before (cca49cb8d): on a marked share the chronicle named a criminal house the town no longer had, or one added after a
freeze; it served exposed corruption, a crime stressor's label, the DM's table notes, and every post-freeze entry; a frozen
share's name, tier and save time followed the live row (dossier, list, map member, import). After (this tip): none of these
(arms red at the commit before each cure, green here). Unchanged and stated: the world columns (item 7, awaiting the ruling);
VR28's tier-2 residual (the prosperity band and the stability word as stored).

## 10. What a card, a page and an import lose
A card: nothing new (a frozen card shows its copy's name and tier, as its body already did). A page (marked shares only):
chronicle entries of exposed or imposed corruption, crime stressors, table notes, and every entry that names a house, person
or power the served page does not show (a removed or renamed house under its old name, a dead person); a frozen page's
chronicle stops at its freeze. An import: a frozen share's record takes the copy's name and tier.

## 11. Stored figures this change moves (not re-frozen here; the lane owner takes each door once at the merged tree)
The lighting census (new test titles in galleryDoors.pglite: the one-row read, the import path, the event-type table,
snapshot mode; walker arms 7 and 8); the wiring census and the writers' reach if they read galleryDoors.js's exports
(`CHRONICLE_CLASSES` is now built from its own table, no longer from `EVENT_TYPES`); `scripts/mutation-coverage-manifest.json`
(the walker's row extended, done here). A pin red, named, not touched: `tests/lint/migrationSearchPathPin.test.js` 2 of 5, red
AT THE BASE already (section 3). No new top-level named numeric constant in `src/`.

## 12. LEFT, said plainly (at the mark, 2026-11-20 04:11 UTC)
1. ITEM 7's build, after the chair's ruling (my recommendation: cure at the source in `serializeWorldSnapshotPublic`, drop
   crime-class outcomes; and a read-time drop of the chronicle section for maps published before).
2. ITEM 8 NOT RUN: the reader's repros (`probes/REVIEW-VEIL-10`: chronicle, tile, gaps) red at bedd5a392 and green at this
   tip, and the acceptance run. Staged for the next seat: the probes archived at `/var/tmp/vd2/rv10` with a runner on this
   container's instruments (lost with the container: re-make by `git archive origin/lane/review-veil-10-2026-11-20
   docs/chair/2026-11-20/veil/probes/REVIEW-VEIL-10`, `RV6_PGMOD` = a checkout with `node_modules/pg`, `PGHOST` the scratch
   socket, `RV10_TPL` a chain database).
3. The chair's veto points: the event-type classes and the log's-own-names rule (section 6), the VISITOR_LIST reading
   (section 4), the two hunks in `import_gallery_dossier` (section 7).
4. The three gates, read at 3a57e3a0c's push (the hook's own run, `out/push-gates-at-3a57e3a0c.txt`):
   `typecheck:ratchet` OK (167 errors, ceiling 167); `typecheck:domain:strict` OK (1113, ceiling 1113); `lint` 0 errors
   (38 warnings, none new in the files this seat touched by its eslint runs). This hand-back's own commit changes docs only.

EXECUTED vs PLAUSIBLE: every red, green, cost row and measure above is executed here, with its output file. PLAUSIBLE only:
production's default privileges (not read: no hosted database); whether other writers than the walker's scan put other
types in a chronicle (any such type is unclassed, so withheld).
