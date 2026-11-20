**NO VERDICT YET: PHASE 1B (THE COLD PASS AT bedd5a392) DONE; PHASE 2 WAITS FOR THE CHAIR'S "FINAL <checksum>".**
REVIEW-VEIL-10, the fresh security reader of migration 212 (the owner's rule: 212 is not applied until a fresh reader
clears its final text). Four findings HIGH (V10-1, V10-3, V10-4, V10-6), two MED (V10-2, V10-5), one measurement for a
ruling (V10-7), all executed, each sent to the chair. 212 at this tip is `dae0ae6c…19e247` (NOT final: three builders
work on). Until section 7 of this file says CLEAR at a named checksum: **do not apply 212.**

# REVIEW-VEIL-10

Nothing outside this branch is changed by this seat. Every database is a scratch PostgreSQL 16 cluster in this
container (unix socket `/var/tmp/rv7` only, `listen_addresses = ''`, trust auth). No hosted database, no production
credential, no `supabase` command, no deploy, no pull request. Worktrees, all detached: bedd5a392 (the builders' base,
`lane/veil-18-2026-11-19`), ad093c92c (the last cold pass's tip), db832c892 (origin/master). One `HUSKY=0 npm ci` in the
master worktree (the shared git config diffed before and after: unchanged); the other two link its `node_modules` (all
three package-locks `dec2a793…`). Every test run with the `GIT_*` variables removed from its environment. Chains built
by REVIEW-VEIL-6's `native/chain.sh`: `x212` (001..212), `x211` (001..211), `xp212` (203+211+212), `xp211`.

Checksums at bedd5a392, read by me: 211 `eface6d0…be0b01`, its rollback `ce8474ff…49712f` (the frozen pair, equal);
212 `dae0ae6c344daab243af4136a6932ebd7da8cfceabce6df3d95bddf75e19e247`, its rollback
`45da09eb5c8ab2e134d613d56afa0cbc700f14a66233f77520e6cd67cf30a1c9`.

Probes: `probes/REVIEW-VEIL-10/` (each states its method in its head comment; `out/` holds every output quoted here;
`doors/` the catalogue reads of every function a non-owner may call). Run one with
`RV6_SRC=<worktree> [RV10_*=…] probes/REVIEW-VEIL-10/run.sh <probe> <log>` (it removes `GIT_*`, sets the socket and
the pg module at `/var/tmp/v16/pgmod`).

## 0. Findings (EXECUTED unless a cell says otherwise; every read as `anon` on x212 unless said)

| Id | Rank | Class | What | The proof (repro, numbers) | 211 alone? |
|---|---|---|---|---|---|
| **V10-1** | **HIGH** | every other door | **THE CHRONICLE.** `get_gallery_dossier` returns a column `chronicle` = `_gallery_chronicle_json(settlements.campaign_state -> 'eventLog')`, and `get_gallery_map` returns each member's `chronicle` the same way; neither passes through `_gallery_veil` or anything in 212, and the differ reads only `data`. The DM's own Make Changes events narrate the house by name: IMPOSE_CORRUPTION (buildEvent writes `payload.criminalInstitution`) "… has been turned by the Smuggling network. Corruption takes root in the shadows."; ADD_INSTITUTION "A new Black market was established."; the `event.type` IMPOSE_CORRUPTION ships too. PublicDossierView draws it (OutputContainer `publicChronicle`). | `chronicle.probe.jsx`: born towns at bedd5a392, the events made by the app's own `applyEvent`, the DEFAULT veil, Reveal DM off, live and snapshot: **4 of 4 towns with a criminal house**: `data` withholds the house whole (not sent, name nowhere) while `chronicle` carries its name, gallery read and campaign-map member alike; the party link has no chronicle (clean). `out/chronicle-new.json` | YES (`out/chronicle-x211.json`, identical) |
| V10-2 | MED | the switch (VS1) | **"Show all" opens eyes no hand can reach.** The switch writes every eye of `CARD_KINDS.institution.fields` for each criminal house and every faction depth eye; the curate screen draws the `people` eye only where `str(npc.institution)` equals the house's name (`curateModelFor :: staffed`), which is never true in the new stored shape (`npc.institution` is an object), so no hand can open `people`. | `switch.probe.jsx`, 36 born towns, reveal off/on: Show-all wrote addresses no screen offers 216 times (`people`), 52 (`services`), 16 each (faction members/goals/conflicts). SERVED(Show-all) against SERVED(every family eye a hand can open), gallery and link: one path differs, **Reveal-DM gallery reads: `npcs[].institution` = {key "Fence (word of mouth)", title "the fence", family, veiled: true} on 108 people under Show-all only**. The house is shown whole by the owner's choice, so its name is open; which people are its people is a depth no hand-curated share sends. `out/switch-new.json` | — (the switch is new) |
| **V10-3** | **HIGH** | every other door / text around the page | **THE TILE.** `_gallery_public_tile_rows` (last defined in 147; 211 and 212 never touch it) reads `stability`, `prosperity`, `threat_level`, `government_type` RAW from `settlements.data`. It feeds `list_gallery_dossiers`, `list_featured_dossiers`, `list_curated_dossiers`, `list_gallery_more_by_creator` AND `get_gallery_dossier`'s top-level columns (outside `data`: blind to the differ, and outside V8-9's closed answer). GalleryCard draws `stability` as a chip; the og-image card draws it when fewer than three other chips stand; `prosperity` is also a list FILTER. | `tile.probe.jsx`: 140 births (N=2), 89 with a hideable house; A, B (every hideable house cut at every step), C (control, as many ordinary houses cut); each stored with the DEFAULT veil (none sent: `sentHideable` 0 in 89 of 89) and read by `list_gallery_dossiers` as anon. **`stability` differs A/B in 11 towns, A/C in 0**: "Unstable (pervasive organized crime)" (9) and "Unstable — criminal governance" (2) against "Stable"; **`prosperity` A/B 34, A/C 2** ("Comfortable" against "Wealthy"). Repro: seed `rv10-tile-town-none-0-11` (town, crisis none), hidden "Smuggling operation" and "Street gang"; `stability` "Unstable (pervasive organized crime)". And under the closed answer (`closed.probe.jsx`): `data` = {name} only, beside `stability` "Unstable (pervasive organized crime)". `out/tile-new.json`, `out/closed-out.json` | YES (the function is 147's) |
| **V10-4** | **HIGH**, or the owner's pending (d): the chair's ruling | every other door | **A campaign map's member that was never listed is served UNVEILED.** `get_gallery_map`: `coalesce(public._gallery_veil(pub.j, s.gallery_member_overrides, false) -> 'body', pub.j)`; a member with no `$veil` (overrides `{}`, never shared itself) takes the sanitizer only: its criminal house WHOLE. The R4 ruling (2026-11-10, `VEIL-FIX-2026-11-10.md`) kept "an unmarked LISTED page" as before and gave the party link the default; this member is listed nowhere, and the deploy count (`where is_public …`) does not count it. | `chronicle.probe.jsx`'s row with its overrides set to `{}` and unpublished: `get_gallery_map('mp1')` as anon sends `institutions` holding {"name": "Black market", category Criminal}, the name in the member 1 time or more | YES (x211 alike) |
| V10-5 | MED | V8-2's threat model, a house's names | **An UNSTAMPED criminal house renamed name-only keeps its birth name on the wire.** 212's (17) finds a house's birth name by its `catalogId`; a house born without one (added by a later pass) has none, so after a rename that moves `name` only (REVIEW-VEIL-8's V8-2 writer) the veil searches only the new name. | `v82.probe.jsx`, seed `rv10-sw-city-none-18`: "Black market" (no catalogId, source `cascade`) renamed "Qqv Lantern Society", hidden whole by the DEFAULT veil: **gallery and link, reveal OFF**: `economicState.activeChains[25].label` "Black market", `.processingInstitutions[0]` "Black market", `economicState.situationDesc` "Honest trade gets by, but a busy black market undercuts it."; reveal ON adds the holder's `institution.key` "Black market" and role "the black marketeer". CONTROL, same town not renamed (`v82b.probe.jsx`): reveal off, the name nowhere. Census (`unstamped.probe.jsx`, 80 births): 9 of 182 criminal houses unstamped, in 8 towns (Black market ×3 and Front businesses from `cascade`, Street gang ×2 from `coherence_repair`, Underground network ×2 and Whisper market from `faction_boost`). `out/v82-out.json`, `out/v82-norename.json`, `out/unstamped-new.json` | not run on x211 (212's cure is the subject) |
| **V10-6** | **HIGH** | order and gaps | **The trace's numbering counts the hidden houses.** On Reveal-DM reads 212 withholds each `simulationTrace` step that names a hidden house, but the steps keep their `ts` counter, so the served sequence holds a HOLE per withheld step; the neighbours' `targetId` (`institution.<slug>`) place the holes in the catalogue's Criminal slot. A visitor learns that houses were withheld, how many, and of what kind, with no name. | `gaps.probe.jsx`, 30 born towns, default veil and every eye shut, reveal off/on, gallery and link: **holes on Reveal-DM gallery reads in 24 of 30 towns, both veils**; no other numbering with a hole. `trace.probe.jsx`: town (2 hidden) `…36,37,39,…,45,47…`; city (3) `…66,67,71…`; metropolis-occupied (6 + the criminal power's own step) `…90,96,97,99…`; each withheld step is a hidden house's selection step. Repro: seed `rv10-gap-town-none-0`, DEFAULT veil, `gallery_share_dm` true, `data->'simulationTrace'`. `out/gaps-new.json`, `out/trace-out.json` | the step itself is sent whole by 211 (the name; 212 cures it and leaves the hole) |
| V10-7 | for the chair's ruling (scope) | sizes and times | **A read is slower when something is hidden.** Server-side time of `get_gallery_dossier` (clock around the call, 6 interleaved samples, median), A (its hideable houses hidden by the default veil) against B (the same seed born without them) and against A with every family eye OPEN. | `timing.probe.jsx`, 7 born towns with a hideable house: **A/B 1.41 to 1.69, A/open 1.35 to 1.59**; absolute 86 to 220 ms (city 373 against 220; metropolis-occupied 644 against 420). Payload length A minus B: 1.2k to 7.7k characters. Over the network this needs a reference of the same size; a regression of read time on payload size across many towns would sort towns with hidden content from towns without. `out/timing-new.json` | not run |

## 1. What I tried that HELD (each executed)

- **V8-9's closed answer** (`closed.probe.jsx`): a born city whose hidden house's name grows to 17,000 code points (past
  the length bound) and to 4,500 Han code points of 1,000 distinct (past the weight bound): gallery and link, reveal off
  and on, every read serves `data` = {"name": town} only (1 leaf), the hidden name nowhere; 14,000 code points (under
  the bound): 5,798 leaves, the name nowhere. No visitor input reaches the search (no read takes a parameter but the
  slug; the list's search runs over the gallery title, description and tags only), so a visitor cannot make the closed
  answer happen; an owner can, only by writing a hidden name past 3.7 times the largest birth, and it then withholds
  more, never less. The one thing beside the closed `data` is V10-3's tile columns.
- **The switch, Hide all** (`switch.probe.jsx`): after every offered eye was opened by hand, Hide all served
  STRICTER than "every non-family eye opened" (the one differing path, `npcs[].allegiance` on Reveal DM, is withheld by
  Hide all: the per-person corruption eyes are the family's); its state read "hidden" in 72 of 72 reads.
- **The switch, a town changed after Show all** (same probe): a new criminal house (a copy under a new name, no id) and
  a rename of a shown one: **started hidden in 23 of 23 towns**, both. Not tried: a house founded again under a shown
  house's old name (its id, the slug of the name, would match the old Show).
- **V8-2 by identity** (`v82.probe.jsx`): every STAMPED criminal house renamed name-only and hidden whole: the birth
  name and the new name nowhere: 35 of 38 house-reads clean (19 reveal off, 19 on); the three reds are V10-5's
  unstamped house (reveal off and on) and, on reveal on, the holder's role "the black marketeer", which the unrenamed
  control sends alike (V9-2, known; VR9 to come).
- **Ids and counts** (`ids.probe.jsx`, `counts.mjs`): no served number equals a stored list length the veil shrank
  (institutions 106 → 99, chains, services, memberships); the houses carry no index. The `npc_veiled_` prefix and the
  holders' cards are the known V9-2 / VR9 / VR10 items (not yet built at this tip).
- **V8-5's class, every door** (`dangling.probe.jsx`, 25 born towns, default and every eye shut, reveal off/on,
  gallery and link, 200 reads): no read at this tip removes a person, so no reference can dangle. VACUOUS until VR9
  (the holder withheld whole) is built: **re-run at FINAL.**
- **The other doors read** (`doors/`): `settlements` and `saved_maps` are readable only by their owner (RLS); the report
  lists are gated by `current_user_is_privileged()`; comments, votes and reactions carry counts and user text, no town
  data; `import_gallery_dossier` serves the same veiled body as the gallery read (what VR16 governs), and the client saves
  only that; `get_unlisted_dossier` carries neither the chronicle nor the tile columns; the og meta (`api/_galleryMeta.js`)
  uses name, tier, terrain and population only; the PDF's document info carries the town's name and fixed words; 212
  raises no message of its own.
- **The map's world snapshot**: its chronicle headlines name houses ("<patron> buys an answer from <Whisper market>",
  `brokerageServicesRules.js`; "<house> falls quiet") and `serializeWorldSnapshotPublic` veils none of them, BUT
  `_gallery_world_snapshot_is_safe` refuses any key matching `.*chronicle.*`, so a snapshot with that section can never
  be stored or served (READ, not executed end to end; a side observation: the section looks unpublishable).

## 1b. THE CENSUS OF DOORS (the chair's VR20 ask, 00:44; from x212's catalogue, `doors/doors-cols.txt`)

Every function `anon` or `authenticated` may execute whose body reads `settlements`, `saved_maps` or gallery tables.
"212?" = does the veil (211/212's `_gallery_veil`) govern what it returns. E = executed by a probe here; R = read.

| Door | Caller | What it returns or lets a caller ask, and its source | 212? | Finding | E/R |
|---|---|---|---|---|---|
| get_gallery_dossier | anon, auth | `data`: veiled body (frozen copy in snapshot) | yes | the differ's ground | E |
| ″ | ″ | `population, terrain, government_type, magic_level, stability, primary_resource, threat_level` (tile, RAW live `data`; `prosperity` facet not returned here) | no | V10-3 (`stability`) | E |
| ″ | ″ | `chronicle` = live `campaign_state.eventLog` (narrativeSummary, cause, event.type) | no | V10-1 | E |
| ″ | ″ | `gallery_member_overrides` = the served marker (groupings list) | yes | — | R |
| ″ | ″ | `aliveness` (publish-time facet), title, description, tags, image (owner-written) | no | owner's own words | R |
| get_unlisted_dossier (party link) | anon, auth | `dossier` veiled body (default when unmarked), served marker, name, tier, author | yes | clean of V10-1, V10-3 | E |
| import_gallery_dossier | auth + premium | `data` veiled body; the client saves only it | yes | VR16 governs undrawn fields | R |
| list_gallery_dossiers | anon, auth | the tile row: `stability, prosperity (facet, else raw economicState.prosperity), threat_level, government_type, …` | no | V10-3 | E |
| ″ (not a column) | ″ | FILTERS on raw values: `prosperity`, `atWar` (facet), `magicLevel`, `terrain`, `culture`, `tier`, `hasDeity`, population range; SORT by population, votes, views, aliveness; SEARCH over title, description, tags only | no | `prosperity` filter is an oracle on a class value (V10-3: A/B 34, A/C 2); the others carry no house term by the differ | R (the column E) |
| list_featured_dossiers, list_curated_dossiers | anon, auth | id, slug, name, tier, dates, views, order | no | none | R |
| list_gallery_more_by_creator | anon, auth | the tile row (as the list) | no | V10-3 | R (same function) |
| get_gallery_map / import_gallery_map | anon, auth / auth | members[]: `settlement` veiled by the member's own `$veil`, ELSE the sanitizer only; `chronicle` raw; name, tier, slug; mapState allowlist; `world` = stored publish-time snapshot | members: only when marked | V10-4 (unmarked member whole), V10-1 (member chronicle) | E |
| get_unlisted_map | anon, auth | name, description, tags, image, the stored world snapshot/sections/realm-arc summary; NO members | no | world snapshot: chronicle key refused by the store guard; the rest names settlements, deities, wars | R |
| list_gallery_maps, list_featured_maps | anon, auth | map card: kind, backdrop, thumb, counts, `member_count` (= settlementIds length), `at_war`, `world_age`, `aliveness` (facets); filters kind/backdrop/tags/hasSettlements/importable | no | none of a house | R |
| get_gallery_vote_state, get_gallery_reaction_state, list_gallery_comments, toggle_*, add/report_* | anon/auth | counts, own flags, comment text (users') keyed by settlement uuid | no | none of a house; existence of a uuid is not a house | R |
| bump_public_view, bump_map_import | anon, auth | void | — | none | R |
| list_gallery_reports, list_open_report_targets, admin_*, set_curated/featured | gated by `current_user_is_privileged()` / role | report rows, names | — | not non-owner | R |
| list_my_*, publish_*, share_*, revoke_*, rotate_*, unpublish_* | auth, own rows (`auth.uid()`) | owner's own | — | owner | R |
| tables `settlements`, `saved_maps`, gallery_* | RLS: own rows only | — | — | closed | R |
| og-image (edge), api/gallery-meta | anyone | og card: population, government, magic, `stability` (from get_gallery_dossier's columns); meta: name, tier, terrain, population | no | V10-3 (`stability` on the card) | R |

Also asked (VR18's class: a transform that rebuilds the page after the veil): on the server nothing runs after
`_gallery_veil` in the three dossier reads and the map (the person filter only removes); everything outside `data`
above is computed BESIDE the veil from the raw or live row, which is the same class from the other side: in snapshot
mode the tile columns and the chronicle are read from the LIVE row, never the frozen copy.

## 2. What I did NOT reach

- Master's stored shape for the new doors (the tile, the chronicle, the gaps, the switch): run on the new shape only.
- The party link's timing (my statement-level clock read 0 around the inlined SQL function: method failed).
- The 720-town corpus; the import's later re-derivations in the importer's own app (VR17's copy sites are not built).
- Likes, votes and reactions beyond reading their functions.

## 7. Verdict

Not given. Phase 2 waits for the chair's "FINAL <checksum>". **Do not apply 212.**
