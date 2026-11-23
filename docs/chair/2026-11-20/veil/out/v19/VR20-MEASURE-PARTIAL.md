# VR20 MEASURE (PARTIAL: stopped by the coordinator when the chair moved VR20 to another seat)

Tree: `/var/tmp/v18/base` (bedd5a392). Chains: `vr20a` = 001..212, `vr20b` = 001..211, on the local cluster (`/var/tmp/rv7`), built
with REVIEW-VEIL-6's `chain.sh` with no FAIL lines. Both were DROPPED at the stop. No tracked file was changed. Probes and outputs are
next to this file: `p1/` (the red repro), `p2/` (born towns), `p3/` (hand cases for the side columns), `p4/` (cost),
`probe-grants.*`, `probe-underscore-anon.out`, `policies.out`, `fdefs/` (the final definitions, dumped from the 212 chain),
`list-types.*`.

The final section ("THE CHAIR'S EXPECTATION, REFUTED OR REFINED") was NOT written. Below it are only the seat's notes so far, not a
proposal.

## 1. THE CHRONICLE

**Event types (EXECUTED, `list-types.mjs`/`.out`).** `EVENT_REGISTRY` (src/domain/events/registry.js) has **41** types. The script
narrated every type with the target `inst.black_market` and the payload names role, institution, cause and criminalInstitution. In 37 of
41 the target's label appears in narrativeSummary (`labelOf(targetId)`). APPLY/RESOLVE_STRESSOR, ADD_TRADE_GOOD and ADD_RESOURCE put
`payload.label` into the text instead. ADD_NPC and ASSIGN_NPC_TO_ROLE also take `payload.institution` and `payload.role`.
IMPOSE_CORRUPTION takes `payload.criminalInstitution`. KILL_NPC and KILL_LEADER take `payload.cause`. PROMOTE_NPC and DEMOTE_NPC
take the person's name. SET_PRIMARY_DEITY, IMPOSE_CULT and SHIFT_TIER do not name the target.

**Other writers (READ).** These write top-level entries with no `.event` key:
- DESTROY_SETTLEMENT (settlementSlice.js:635). Its id is `destroy.<saveId>.<ts>` and its summary carries a free-text reason.
- RENAME_SETTLEMENT (settlementRenameHelpers.js). Its id is `rename.*`.
- Table flavor `TABLE_INCIDENT` (settlementPendingEditWriters.js / tableLedger.js). Its id is `flavor.<TYPE>.<ts>.<n>`, so **the type
  travels inside `id`**. Its narrativeSummary is the DM's own words, up to 2,000 characters.
- Table engine events (tableLedger.js): RESOLVE/APPLY_STRESSOR, EXPOSE_CORRUPTION, IMPAIR/RESTORE_INSTITUTION and
  DEPLETE/RECOVERED_RESOURCE. Their event id is `table.<intentId>`.
- World-pulse drains (drainQueuedEvents.js) reuse applyEvent entries and add `viaTick`.

A full applyEvent entry also carries before/afterState, deltas, factionResponses (with factionName and hookSeed), causalStateDeltas,
factionRelationshipDeltas and undo. The helper drops all of these.

**The helper (READ: 032, never redefined; 046…212 only call it).** `_gallery_chronicle_entry` keeps these keys: `id`, `appliedAt`,
`timestamp`, `narrativeSummary`, `cause`, `partyCaused`, and `event.{id,type,cause,partyCaused}`. `_gallery_chronicle_json` keeps
the newest 50 object entries. It sets **no length cap** on any value. Nothing caps the eventLog on write either.

**What the page draws (READ).**
- Client re-filter: gallery.js sanitizeChronicle keeps the same keys, scalars only, and the last 50 entries.
- Then `PublicDossierView` passes the entries to `OutputContainer.publicChronicle`, which runs `buildChronicleFeed`
  (chronicleFeed.js normalizeEntry) and hands the result to `ChronicleTab`.
- Drawn: the title as `humanizeIfToken(event.type)`, the summary as `narrativeSummary`, the source tag from
  partyCaused/`cause==='party_action'`, and `event.id`/`id` as the DOM key and anchor (`entityAnchor('event',{id})`).
- `at` sets the order only.
- The map page draws each member's chronicle the same way (CampaignWorldView.jsx:286).
- **The client twin (galleryVeil.js / gallerySecondHomes.js) has no chronicle path at all.**

**The red repro (EXECUTED, `p1/read.sh`, outputs in `p1/out212`, `p1/out211`).**
- Set-up: the town has Black market and Smuggling network, both Criminal. The veil marker is `{"$veil":{"v":1,"mode":"live","deltas":[]}}`,
  i.e. the default veil. The eventLog holds:
  - the chair's ADD_INSTITUTION entry;
  - an IMPOSE_CORRUPTION entry ("Ada Quill has been turned by the Smuggling network…");
  - a TABLE_INCIDENT flavor entry with the spelling "black-market";
  - an open DAMAGE_INSTITUTION entry.
- Result on BOTH 212 and 211 (identical), read as anon: `data` withholds both houses (`blackMarketInData:false`,
  `smugglingInData:false`), on the player share and on the Reveal-DM share.
- `chronicle` sends all four entries verbatim. That includes "A new Black market was established.", `event.type`
  "IMPOSE_CORRUPTION" with the Smuggling-network sentence, and `id` "flavor.TABLE_INCIDENT…".
- `get_gallery_map` member `chronicle`: the same four entries, while the member's settlement withholds the house. **V10-1 CONFIRMED.**
- The link (`get_unlisted_dossier`, EXECUTED) has 10 keys and **no chronicle**: author_name, dossier, gallery_member_overrides,
  gallery_share_dm, id, is_owner, name, slug, tier, unlisted. Neither hidden name appears in it.

**Born towns (EXECUTED, `p2/born.mjs`, `p2/born-212-s1.json`, 212 chain, seed 0).**
- Set-up: 12 towns in all, one per size × {no stress, infiltrated}, each stored as 36 shares (live player, live Reveal-DM, snapshot).
  Real applyEvent entries: DAMAGE_INSTITUTION and IMPOSE_CORRUPTION on each house the default veil hides (at most 3 per town), plus
  an open IMPAIR_INSTITUTION and a STARTED_RIOT.
- Result: 132 chronicle entries were served, and **60 of them name a house that `data` withholds** (42 of 42 DAMAGE, 18 of 18
  IMPOSE_CORRUPTION). Example: "Npc charcoal burner has been turned by the Smuggling waypoint."

## 2. THE SIDE COLUMNS

**Functions (EXECUTED on the 212 chain, `probe-grants.out`).** 58 public functions both reference a shared town and are executable by
anon or authenticated. The reads among them, by their final definitions:

| function | non-owner returns | source of each column | veil today |
|---|---|---|---|
| get_gallery_dossier (212) | id, public_slug, name, tier, data, published_at, updated_at, view_count, is_curated, gallery_description, gallery_image_url, gallery_image_alt, gallery_tags, gallery_share_dm, gallery_importable, gallery_member_overrides, population, terrain, government_type, magic_level, stability, primary_resource, threat_level, net_votes, comment_count, **chronicle**, author_name, aliveness | `data`: veiled. The other 8 tile columns: RAW s.data by way of `_gallery_public_tile_rows` (147), always the LIVE row, never the narrated or frozen copy. `name` is gallery_title or s.name. description, tags and image_alt are owner text. `chronicle` is campaign_state. The rest are counters or other tables. | `data` and `gallery_member_overrides` only |
| list_gallery_dossiers (147) | the tile rows plus culture, prosperity, primary_deity, at_war, importable, author_name, reactions, total_count | RAW s.data, or the gallery_facet_* columns (the client writes them raw: ShareToGallery.jsx:212-215) | none. The search runs over name, description and tags. Filters run over terrain, magicLevel, culture, prosperity, deity, atWar, population. Sorts include population and name. |
| list_gallery_more_by_creator, list_my_gallery_dossiers (owner) | the same tile set | the same | none |
| list_curated_dossiers, list_featured_dossiers | id, public_slug, name (s.name), tier, published_at, view_count, order | columns | n/a |
| get_unlisted_dossier (212) | see §1 | `dossier` veiled. `name` is s.name. | dossier |
| import_gallery_dossier (212, authenticated, premium) | id, name, tier, data | data veiled | data |
| get_gallery_map (211) | slug, name, kind, description, tags, imageUrl, imageAlt, realmArcSummary, mapState{fmgSnapshot, seed, customBackdrop, placements, labels, markers, forests}, world{snapshot, sections}, members[{old_id, name, tier, public_slug, settlement, **chronicle**}] | settlement veiled (with no member splice). The member chronicle is RAW. The world snapshot is stored at publish and is not veil-aware (READ). | member settlement only |
| get_unlisted_map, import_gallery_map | the map header plus world_snapshot and sections; import calls get_gallery_map | stored | none |
| list_gallery_maps, list_featured_maps | slug, name, kind, description, tags, backdrop_kind, thumb_url, counts, importable, author_name, image_url, image_alt, at_war, world_age, aliveness | saved_maps columns | n/a |
| get_gallery_vote_state, get_gallery_reaction_state, list_gallery_comments | counts, own flags, comment rows | other tables | n/a |
| **_gallery_public_tile_rows()** | the whole raw tile set **plus owner_id** for every public town | RAW | none. **anon may call it directly** (`probe-underscore-anon.out`): it was revoked only from PUBLIC (019/063/071/147), and the scaffold's `alter default privileges … to anon, authenticated` (the Supabase default) grants it outright. `_gallery_chronicle_json`, `_gallery_sanitize_public_json` and `_gallery_dm_full_json` are callable the same way (they are pure functions of their input). |

No table read is open to non-owners: every SELECT policy is `auth.uid() = owner` (`policies.out`).

**Born towns (EXECUTED, p2).** Each of the 14 tile and list columns was checked across 36 shares. **Every one equals the same chain
evaluated over the VEILED `data`**, and no column holds a withheld name. On born towns with the default veil, then, the columns do not
leak.

**Hand cases (EXECUTED, `p3/hand.sql`, `hand-vr20a.out` / `hand-vr20b.out`).**
- **H1** (212): the stored document says government "Black market", stability "Captured (the Black market decides)", threat "Black
  market enforcers", resource "Black market contraband" and prosperity "Rich on Black market coin". The veiled `data` sweeps every
  one of these, but the columns `government_type`, `stability`, `threat_level` and `primary_resource`, plus the list's `prosperity`,
  still send them RAW (likewise `_gallery_public_tile_rows`). The owner-written title, description, tags and image_alt pass raw too.
- **The list as an oracle:** search 'black market', filter prosperity = 'Rich on Black market coin', and filter culture each return
  the share.
- On 211 the document itself also keeps those strings, since 211 has no name sweep.
- **H2** (snapshot mode): `data` is the frozen copy (population 1000, government Council). The columns send the LIVE row (population
  4321, government "Smuggling network", stability "Captured"), and the `populationMin` filter selects on the live value.

So the column leaks are: 4 tile columns in the read and the list (government_type, stability, threat_level, primary_resource), plus
population, terrain and magic_level in snapshot mode, plus the 3 facet columns (prosperity, culture, deity), plus 4 owner-text
columns. All of them were shown or are possible by hand only. None leaked on born towns.

## 4. COST (EXECUTED in part, `p4/cost.sql`, `cost-vr20a.out`, before the stop)

The heaviest born share (metropolis): the document is 439,783 characters (259,670 once veiled), with 6 hidden houses and 83 open.

| call | time |
|---|---|
| `_gallery_veil_name_hits` (212's one-pass search) on that share's own chronicle (1,111 characters) | 0.22 ms |
| the same on 50 entries × 2,000 characters (102,300) | 8.9 ms |
| the same on the veiled document | 30.1 ms |
| the whole read | 515 ms |
| `_gallery_chronicle_json` today | 0.6 ms |

The 50 × 80 run had a fault (its name was cut off) and its rerun was stopped. The search's cost is linear in text length, and it
could run once over the chronicle with the same `srch` the veil already builds (`_gallery_veil_second_homes`, 212:1355). That `srch`
is local today and is not returned.

## Notes toward (B), not a proposal

- The name search covers houses only (`gone`).
- A corruption entry gives away a shut class (npc corruption) even when no house is named.
- Flavor ids carry the type.
- The world snapshot's chronicle (worldSnapshotPublic.js) is a sibling door that this seat did not measure.
