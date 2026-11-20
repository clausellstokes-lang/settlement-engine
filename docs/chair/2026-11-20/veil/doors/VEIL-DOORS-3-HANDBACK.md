# VEIL-DOORS-3 — hand-back (the doors beside the main document: the last list)

Seat: VEIL-DOORS-3, branch `lane/veil-doors-3-2026-11-20`. Assignment: `lane/chair-2026-11-08 ::
docs/chair/2026-11-20/seventh/prompts/VEIL-DOORS-3.txt`, read at 95931eb0e. Base: origin/lane/veil-doors-2-2026-11-20
had MOVED one docs-only commit past the named 4994ee371, to **97efb7fcf** (the predecessor's hand-back, +15 lines); told
to the chair at seating; built on it. Written 2026-11-20 05:39 UTC (the hour read from `date -u`). Every database local:
a scratch PostgreSQL 16.15 (unix socket `/var/tmp/vd3/sock`, `listen_addresses` read back empty) and pglite (under node
and, new here, under jsdom). **TIP: the commit carrying this file.** The last code commit is 8af1cb703.

## 1. The bytes
| File | at the base 97efb7fcf | at the tip |
|---|---|---|
| 211 (FROZEN) | `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` | the same (proved, section 9) |
| 211 down (FROZEN) | `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` | the same |
| 212 | `35c91700e0c930e375a99c1ed7f0656b768fc7f2eb9a74b936018a4b98331ccc` | `8773ece97a6b4d25d75072d10c96c80e834d8b72e8dac42ccd7993266c271e99` |
| 212 down | `b5f15a7a25edf36ebb8298db42afcaef8e27b5775cd59cf5559273d2047a590c` | `0feea5c3dd25c8fb5d44f72ca3dd8b4cc6d7f8c1d183a69a7255227b0a012daa` |

## 2. Item 1 — the instruments and the base (4274504b8)
`npm ci` (exit 0); the scratch cluster; born worlds by the app's own Instant World birth (`composeInstantWorld`) through
vite's SSR loader; the readers' native chains (`instruments/chain.sh.txt`, REVIEW-VEIL-11's script re-pointed, the
doors' walker scaffold as `scaffold.sql`). The doors' two files 19 of 19 (`out/base-doors-arms.txt`); `tests/security`
WHOLE 158 passed | 1 skipped (159), 2009 passed | 1 skipped, exit 0 (`out/base-tests-security.txt`): the predecessor's
last figure, reproduced.

## 3. Item 2 — VR40, its three parts and its measure (447809df0)
- **(1) The editor** (`WorldSectionToggles.jsx :: NOT_SHAREABLE_YET`, `MapShareEditor.jsx`): the chronicle's control
  shown off and disabled, "Not shareable yet: its headlines can tell what a town's share hides."; the editor's section
  keys leave it out (a saved list holding it re-enables nothing), its serializer option is false; the kind picker's
  helper (`galleryMapsUtils.js :: KIND_OPTIONS`) no longer promises it. BORN ARM through the client's own path
  (`tests/security/galleryWorldShare.pglite.test.jsx`: a born Instant World advanced three months, its members stored
  as the owner's towns, the editor rendered under jsdom, "Map and campaign", "Share to gallery", its own
  buildShareOpts -> shareMap -> publish_map on the chain): RED at 97efb7fcf, "the publish raised: expected 'World
  snapshot contains a forbidden p…' to be null"; GREEN: the publish succeeds, the stored snapshot holds worldClock,
  pantheon, warNetwork, dashboard and no chronicle, its section list the four, the gallery read the same.
- **(2) Both map reads drop a stored chronicle** (212 + twin): `_gallery_doors_world` (an object's top-level
  `chronicle` dropped whatever it holds; a snapshot that is not an object served as none), `_gallery_doors_world_sections`
  (the key out of the list); `get_gallery_map`'s world through them; `get_unlisted_map` restated at 168's statement with
  that one change. Twins `galleryDoors.js :: publicWorld, publicWorldSections`. Rollback: `get_unlisted_map` back to 168
  verbatim with 168's grant; the two helpers dropped (the rollback arm green). RED at 4274504b8 by a row planted past
  091's guard: both reads served "Thieves and racketeers are working Rookford's streets in the open."
- **(3) The guard is not loosened**: an arm holds publish_map's refusal of a snapshot with a chronicle on every run.
- **FOUND (told to the chair)**: `get_gallery_map` bumps `view_count`, so 091's BEFORE UPDATE guard fires on the READ:
  a row holding a chronicle makes the gallery read RAISE today (nothing served); `get_unlisted_map` writes nothing and
  served it. The arm reads the link with the guard on and the gallery read with it held off for that read.
- **MEASURED, goods[].label**: a channel's goods are taken from the EXPORT side only (`goodsIntersect` keeps the
  export's good; the import's text rides as `matchedLabel`, which `publicChannels` drops); the criminal supply chains
  are `exportable: false`. 30 born towns (15 at priorityCriminal 90; 74 hideable houses): no export carries a crime
  word (two imports do: "Stolen horses", "Contraband silk and spice", never a label). If a crime output ever did reach
  an export, `normalizeGood` keeps its own words ("Smuggling network", "Fencing stolen goods" stay custom labels):
  PLAUSIBLE path, not observed. `out/item2-vr40-goods-measure.json`.
- **WHAT A SHARED MAP'S WORLD SHOWS NOW**: worldClock, pantheon, warNetwork (sieges, trade wars, dispositions, public
  channels), dashboard (simulation rules, realm-arc lines), as stored at publish; no chronicle on either read. On six
  born worlds advanced 12 months (`out/item2-vr40-world-measure.json`): the chronicle would have held 109 crime-worded
  headlines; the four sections that travel: 0 crime words, 0 hideable house or hidden power names; public goods: 0.
- Counts: RED as above (`out/item2-red-*`); GREEN the doors' guards + rollback + born arm 5 files 65 of 65; every test
  naming the editor, the serializer, the toggles or the kind list 24 files 286 of 286; `tests/lint` WHOLE the same 14
  files and 20 titles red as at the base (section 8).

## 4. Item 3 — the stressor catalogue, read whole (8af1cb703)
IN ONE LINE (the chair's (1) of 04:36): every LABEL and SUMMARY a stressor entry can print was read, and only the three
catalogue entries below are crime-worded; their labels now withhold as their keys did. Read: `stressorsCore.js :: STRESSOR_CATALOG` (21 types), `stressTypes.js :: STRESS_TYPE_MAP` (15, the composer's
picker unions both), the registry's narration ("<payload.label || labelOf(targetId)> grips / no longer grips the
settlement."), the table's obligation types (debt, famine, scarcity, unrest, siege, plague). Crime-worded: only
criminal_corridor "Criminal corridor", infiltration "Infiltration network", infiltrated "Infiltrated". Judged NOT
crime-worded (a public crisis, not the underworld): betrayal "Betrayal shock" / recently_betrayed, monster_raider_pressure
"Monster or raider pressure" / monster_pressure "Beast & Raider Threat" (an outside raid, served as RAID_OR_MONSTER_ATTACK
is), insurgency, slave_revolt, rebellion, and the rest. THE GAP: the label. A free-text "Infiltration network", a target
`world_stressor.infiltration_network`, "The infiltration network" matched no key by equality. CURE (212 + twin): under a
shut criminal grouping, withheld when key, label, targets or summary hold a crime key by containment in the squeezed
fold. RED at 447809df0: three such entries served; GREEN 4 files 64 of 64. A custom stressor's own name is the DM's text
(owner-authored): only the name search governs it.

## 5. Item 4 — VR41 (a-ii) and (b) (711135617; the measure told to the chair at 05:2x UTC)
54 born towns, a lived log of 1,393 entries by the composer's own `buildEvent` + `applyEvent` over real targets, the
default veil, read as anon (twin = server on all 54): **served 1,344; withheld 49; by the log's-own-names rule alone
42 (3.0%)**. None is a removal (a removed house stays in the body: REMOVE_INSTITUTION 163 of 164 served). All 42 name
something the served body shows: **31 event-born persons** (id `npc.<slug>_<rand>`; the narrated label drops `npc.`,
the body's id keeps it) and **11 former governments** (out of the body's factions, named in previousGovernments,
memberships, conflicts). Removal payloads carry no catalogue identity or category (REMOVE_INSTITUTION {}, KILL_NPC
{importance}). **The narrowing: NOT BUILT** (counts both ways: 42 withheld as built, 42 with it). Two narrowings that
would serve all 42 and nothing the body hides are the chair's to rule: (i) also compare the RAW targetId's fold; (ii) a
power counts as shown where the served body names it anywhere.
**(b) What still follows the live row after a freeze** (named, not frozen; read from the dossier's columns): the
listing's own acts — `gallery_title` (it wins over the copy's name), `gallery_description`, `gallery_tags`,
`gallery_image_url`/`_alt`, `gallery_importable`, `gallery_share_dm` (a later Reveal DM re-projects the frozen COPY,
never the live town), `gallery_updated_at` (a re-publish's time); the counts (`view_count`, `net_votes`,
`comment_count`, `reactions`, the comments); the author's public name (`profiles.external_name`); curation and featuring;
the facet columns `at_war` and `aliveness` (stored at publish or a details save; PLAUSIBLE, read not executed); on a
map, the map's own header and whether a member is public (`public_slug`). And, by its own design (211), the party link
`get_unlisted_dossier` reads the LIVE town with the live `name`/`tier`, not the frozen copy (read, not executed): the
chair's to say whether a freeze governs the link.

## 6. Item 5 — the reader's repros and the acceptance run
Probes from origin/lane/review-veil-10 (chronicle, tile, gaps) and review-veil-11 (worldcol), unchanged, on native
chains built from each tree's migrations (`out/probes/`):
| Probe | bedd5a392 | tip 8af1cb703 |
|---|---|---|
| chronicle (8 shares, live + snapshot) | RED: the house in the gallery chronicle 8/8, in the map member's 8/8 | GREEN: 0/8, 0/8 |
| tile (stability) | RED: the cause on 6 towns ("Unstable (pervasive organized crime)", "Unstable — criminal governance") | GREEN for tier 1: the band word alone; A/B still differ on 6 (the band), prosperity 22 (VR28 tier 2, the recorded residual) |
| gaps | `simulationTrace[].ts` holes, 24 (V10-6: the DATA veil's finding, not a door) | the same 24: unchanged by the doors (the data veil's, VEIL-20's) |
| worldcol (N=1: 14 towns, 4 with a binding) | refused at storage ("cannot be stored"): no leak | the same: refused at storage, no leak (the guard is not loosened; the read now drops a stored chronicle too) |
THE ACCEPTANCE RUN: NOT RUN. Its runner (REVIEW-VEIL-7 `run-all.sh`, library at 72a3bb24f per PART 19 section 4) is on
no branch this clone reaches and a short sha cannot be fetched. The chair (05:42 and 05:52 UTC) took item 5 off this
list: the lane's owner (VEIL-22) runs the acceptance run and re-runs the reader's repros at the merged tree, where B, C
and D stand and the expected result is exit 0. The probes above are recorded as run here, N=1.

## 6b. VR43 (the chair, 05:42 UTC): the gallery read that raises on a row holding a chronicle. NO BUILD; the guard stays.
It fails closed (nothing served). (a) CAN SUCH A ROW EXIST? The column `gallery_world_snapshot` came in 088; 089's
`_gallery_world_snapshot_is_safe` refuses any key matching `.*chronicle.*`, but 089 guards ONLY publish_map; the direct
owner write (`updateMapGalleryMetadata`, RLS) was guarded only from 091 (its own header: "Closes the
updateMapGalleryMetadata direct-update bypass"). So a row written by a direct metadata save on a database that ran 088
or 089 without 091 CAN hold one; on a database where 091 stood from 088 onward, none can (any write of such a row raises).
Read from the migrations, not executed against any hosted database. (b) THE ONE-ROW COUNT, read-only, for the deploy note
(any depth, a KEY whose name holds "chronicle", as the guard's own pattern; a string value does not match; executed on
the local chain: 0):
`select count(*) as rows_with_chronicle from public.saved_maps where gallery_world_snapshot is not null and gallery_world_snapshot::text ~* '"[^"]*chronicle[^"]*"[[:space:]]*:';`

## 6c. What a visitor may still read (residuals, measured by the reader, NOT built; for the owner's list)
A SHORT FORM of a hidden house's name in the free text of a `target` entry ("Multiple crews rioted…" beside a house
named "Multiple criminal factions": the name search asks whole names); a CUSTOM stressor the DM named "Gang war",
served with the grouping shut (the DM's own label, also on the body as stored). Both are the DM's own words. And VR28's
tier 2: the stability band word and the prosperity band as stored.

## 7. Item 6 — the two one-line hunks in `import_gallery_dossier` (the data veil's function), for the lane's owner
`name` := `coalesce(case when src.copied then nullif(btrim(public._gallery_veil_str(src.j -> 'name')), '') end, s.name)`
and `tier` := the same with `'tier'`. WHY: in snapshot mode the import already served `data` from the frozen copy but
took `name` and `tier` from the live row, so a rename or tier shift the DM made after the freeze reached the importer's
record (and its library card). WHAT BREAKS WITHOUT THEM, executed (`out/item6-hunks-reverted.txt`, both reverted in a
scratch tree of the base): the SNAPSHOT MODE arm reds, "the importer's record: expected { name: 'Rookhold', tier: 'city' }
to deeply equal { name: 'Rookford', tier: 'town' }". Nothing else of the function differs from 211's statement.

## 8. Stored figures this work moves (not re-frozen)
The lighting census: new titles (galleryDoors.pglite: VR40, the stressor catalogue; galleryWorldShare: two) and its
estate file count, 3709 -> 3710 (`sovereigntyLightingContract` "the estate's file count moved", red at the base already
at 3709 vs its stored 3705). `scripts/mutation-coverage-manifest.json`: one row added for the new test file. `tests/lint`
WHOLE: 14 failed | 205 passed, 20 failed | 3211 passed at the base AND here, the same titles; the re-run diffed against
the base adds no offender (the predecessor's un-anchored assertion moved line 228 -> 233). No new top-level named
numeric constant in `src/`.

## 9. GREEN at the last code commit, and the bytes proved
The code is unchanged since 8af1cb703 (every later commit is docs). `tests/security` WHOLE there: **Test Files 159 passed
| 1 skipped (160); Tests 2013 passed | 1 skipped (2014); exit 0** (`out/tip-tests-security.txt`; the base's 158/2009 plus
the new file and the new arms). The three gates, the hook's own run at 8af1cb703's push (`out/push-gates-at-8af1cb703.txt`):
`typecheck:ratchet` OK (167, ceiling 167); `typecheck:domain:strict` OK (1113, ceiling 1113); `lint` 0 errors, 38 warnings
(the base's count). `tests/lint` WHOLE: section 8. Bytes proved at the tip (read 05:55 UTC): 211
`eface6d0…be0b01` and its rollback `ce8474ff…d49712f`, equal to the frozen figures; 212 `8773ece9…6c271e99`; 212 down
`0feea5c3…0a012daa` (section 1 in full).

## 9b. LEFT, said plainly (at the mark, about 355k of 350k by my estimate; get_session reads 0)
THE CHAIR'S RULING OF 05:42 UTC ON VR41 (a-ii), NOT BUILT: both narrowings in one commit, red first: (i) the compare
also folds the RAW targetId (an event-born person whose id the served body holds); (ii) a power target counts as shown
where the SERVED body, after the veil, names it anywhere, by the name search's fold; against what is served to that
reader, every other class rule still applying, the frozen copy in snapshot mode; PROOF: the 1,393 entries 42 -> 0
(`instruments/vr41-measure.mjs.txt` re-runs it) and a born arm with every hideable house hidden. Where it goes: 212's
`_gallery_doors_chronicle` (the "log's own names" block: the target's raw fold beside the narrated one; the shown
set widened by the served body's strings for a power) and its twin `galleryDoors.js :: veilChronicle`.

## 10. Executed and plausible; what a reader should attack
EXECUTED: every red, green and count above, with its output file. PLAUSIBLE: a crime output reaching an export label;
the facets' refresh; the link's live read. ATTACK: (a) any other writer of a world snapshot (only the editor and
`updateMapGalleryMetadata`; both go through the trigger); (b) a chronicle key nested below the top level of a stored
snapshot (`_gallery_doors_world` drops the top-level key only; 091's guard refuses `chronicle` at any depth); (c) a
custom stressor named in crime words (owner-authored, name search only); (d) the two VR41 narrowings, if ruled.
