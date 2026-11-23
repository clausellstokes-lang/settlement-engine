# COHERENCE-VEIL — phase 1: the measure, and the proposal for migration 211

Seat: COHERENCE-VEIL. Base: `decc7bf15` (tip of `lane/integration-2026-11-07` as found on the remote). Charter: §0 and §6 of `CHARTERS-COHERENCE-2026-11-11.md` on the chair's lane. Nothing under `src/` or `supabase/` changed; no migration written; nothing applied anywhere.

**THE ANSWER IN FOUR LINES.**
1. On every read a stranger can make, the server sends everything a DM hides by hand. On 24 towns veiled through the share panel, the gallery page and the party link each carry **14,749 strings the page hides** (all eyes shut). The default veil alone leaves **417**: the names, descriptions and services of the criminal houses hidden whole, and the criminal sentences of the power and defence desks.
2. Two reads are worse than the charter says. **The map page** (`get_gallery_map`) shows a member town with no veil at all, so all 14,749 are ON THE PAGE. **Import** (`import_gallery_dossier`) also ignores the veil, server and client both.
3. COHERENCE-POWERS's flag does not reach any response. The kept title lives in an in-memory record and never travels. Measured on 38 veiled faces: 0 carry a house, memberships, title or role in any response or page, and the house title's text appears 0 times. The control holds: all 38 titles are in the records.
4. The proposal is 211: one SQL veil function, the server twin of `galleryVeil.js`, applied inside the reads. It is executed against the real client page as its test, and needs three client lines. **The manifest §6 names is short by four files.** The client twin is `galleryVeil.js`, not `publicSafe.js` (§c.2). Eight rulings for the chair are listed at §e.

---

## (a) THE MEASURE, BY EXECUTION

**How.** `veil-probe/chain.mjs` applies **every migration 001→210 in order** into an in-process Postgres (pglite, with pgcrypto). It stubs `cron`, `storage` and the `auth` columns. Result: **0 of 210 files fail**. `get_gallery_dossier` is 147's body, `get_unlisted_dossier` 208's, `import_gallery_dossier` 131's and `get_gallery_map` 088's; `_gallery_sanitize_public_json` carries 210's `publicProse` token.

`veil-probe/measure.probe.mjs` then works through the following steps:
- **The towns.** It generates 24 towns with the browser's random dials (§0.4 configuration). Seeds `coherence-veil-<tier>-<k>`: 6 villages, 8 towns, 6 cities, 4 metropolises. Each record carries the `publicProse` stamp a save writes.
- **The rows.** It writes each as a row that is listed AND linked.
- **The veil.** It veils the row by hand with the share panel's own model and writer: `curateModelFor` → `writeShareVeil`, snapshot via `galleryPayloadFor`.
- **The reads.** It calls each public function as its reader: anon, or another premium DM for import.
- **The page.** It builds each PAGE with the **real client read** (`src/lib/gallery.js :: fetchPublicDossier`, `fetchDossierForImport`, `fetchGalleryMap`), over a fake `supabase` whose `rpc` runs the real SQL.
- **CARRIED** = a path in the response that is absent from the page (array rows matched by id or name).
- **READABLE** = a string of 6 or more characters in the response that appears nowhere in the page's text.
- **The baseline.** An unmarked listing scores **0 / 0** on all 24 towns. The client's `toPublicSafe` strips nothing the SQL sanitiser keeps, so every number below is the veil's alone.

Run: `npx vitest run --config docs/chair/2026-11-11/veil-probe/vitest.probe.config.mjs`. It takes about 6½ minutes. Tables land in `veil-probe/out/measure.json`.

### By kind of hidden thing (24 towns; the gallery page and the party link give IDENTICAL numbers)

| Configuration a DM sets by hand | Carried paths | Readable strings | What it is, by its largest families |
|---|---|---|---|
| none (the default veil, export untouched) | 1,025 | 417 | **blocks**: `publicProse.blocks.power:desk` (124), `…defense:criminal` (109), `safetyProfile.criminalInstitutions` / `crimeTypes` (98); **cards hidden whole**: the 37 criminal houses' `name`, `desc`, `tags`, `category`, `source` and their service rows |
| every grouping (tab / block) shut | 1,025 | 417 | the same: every grouping is already in the default set |
| every hideable house shut whole | 1,025 | 417 | the same: all 37 hideable houses are default-hidden (all 37 criminal by category; 0 clandestine, 0 illegal brokerage on this corpus) |
| **faces** (`card:npc:<key>`, i.e. `revealDm:false`) | 14,051 | 8,040 | `npcs[].physical.*`, `npcs[].personality.*` (944 each), `npcs[].institution.*` (906) and the roster copies: the whole depth of a face the page shows by name only |
| every eye on every face (**the fields of a veiled face**) | 14,051 | 8,040 | the same set as faces (a card delta expands to every depth eye) |
| every eye on every **power** | 1,155 | 547 | adds `powerStructure.factions[].desc` (127) over the default |
| every eye on houses, events, tensions, conflicts, ties | 11,018 | 6,976 | `institutions[].tags` / `desc` (1,647 / 1,107), `relationships[].tension` / `description` (924 each), `availableServices.*` rows |
| every class switch ("Secrets: hidden for everyone", …) | 17,634 | 9,639 | the union of the field classes |
| **all of the above** | **24,200** | **14,749** | |
| all, with "Reveal DM content" on (gallery) | 28,707 | 17,421 | the link stays at 24,200 / 14,749: it never widens (208 R1 holds) |

### By projection

| Read | Reader | What it carries that its page hides |
|---|---|---|
| `get_gallery_dossier` → `data` | anon | everything in the table above |
| `get_gallery_dossier` → `gallery_member_overrides.$veil.snapshot` (**a frozen copy**) | anon | the whole frozen copy, **verbatim**: all the same numbers again, beside the live `data`. With Reveal DM on, the frozen copy is the client's UNSTRIPPED full view: **47,245 / 26,787**, more than the live DM response, because `_gallery_dm_full_json` strips what the client's full mode keeps. `frozen.probe.mjs` executes the old-copy case: a copy holding a planted secret, a capture state and a seed is returned with all three. **The SQL sanitiser never reads a frozen copy** |
| `get_gallery_dossier` → `$veil.deltas` | anon | the DM's own list of hidden addresses (up to 640 KB on 24 towns). Shutting a house whole by hand puts its id (its name's slug) in this list |
| `get_gallery_dossier` → `data` in snapshot mode | anon | the LIVE row as well, though the page renders the frozen copy: anything saved after the freeze |
| `get_unlisted_dossier` → `dossier` (**the party link**) | anon | everything in the table above (the default veil applies even to a town shared by link alone, R4) |
| `get_unlisted_dossier` → `gallery_member_overrides` | anon | the deltas, as above. The frozen copy is stripped (0 of 240 link reads carried one: R8 holds) |
| `import_gallery_dossier` | a premium DM, on an importable town | **every one** of the 14,749 hidden strings, in the response AND on the importer's page. No veil is applied on either side |
| `get_gallery_map` → `members[].settlement` | anon | **every one** of the 14,749, **rendered on the map page** (`CampaignWorldView` → `PublicDossierView` with the member as sent). No veil is applied on either side, not even the default set |
| `list_gallery_dossiers`, `list_curated/featured_dossiers`, `list_gallery_more_by_creator` | anon | tiles only (no dossier body); out of class |
| `get_unlisted_map` | anon | the world snapshot only (no member dossiers); out of class |

**COHERENCE-POWERS's flag, verified.** "The player record" is `publicSafe.js :: publicVeiledRecordOf`. It is an in-memory record the power and defence desks read in player view, and it is never sent. Its only way into a response is the composed text (`publicProse`), which is stamped from it at save. Over the 38 faces the generator stamped veiled:
- **In responses and pages.** The face cards were matched in every response and page: 38 in each of the four (gallery and link, response and page). 0 carry `institution`, `memberships`, `title` or `role`.
- **As text.** The house title's text appears 0 times in any response or page, `publicProse` included.
- **Control.** All 38 titles are in the records, and 18 of the faces hold memberships there.

So the flag is **not a response fault**. It is a latent one: a future reader of `institution.title` in player view would print it. I propose no change in 211; the guard belongs with COHERENCE-POWERS's phase 2.

## (b) THE CLIENT'S VEIL, AND WHAT HOLDS ITS SQL TWIN

**Where the veil is applied.** `src/lib/gallery.js :: sanitizeDossier` applies the veil as `projectShareVeil(toPublicSafe(source, …), overrides)`. The code it runs is in `src/domain/display/galleryVeil.js`:
- **The resolver** (`resolveVeil`): the static grouping defaults, plus `DEFAULT_VEIL_RULES` over the projection, plus the DM's deltas, with `except:` exceptions.
- **The applier** (`applyVeil`): field drops by `CARD_KINDS`, houses hidden whole with their service rows and every face's tie to them, `GROUPING_REMOVERS`, the prose sites, and `markVeiled` for `DefenseTab`.
- **The two inputs.** `source` is the frozen copy in snapshot mode; the link takes the default veil when unmarked (R4).

**THERE IS NO SQL TWIN of the hand veil, and so no pin holds one.** The only server code that sees `$veil` is 208's single-key strip. Every pin that names the veil is client-only: `tests/lib/gallery.test.js` (44), `tests/lib/partyLinkClient.test.js` (7), `tests/domain/display/publicSafe.test.js` (57, of which the veil cases), `tests/domain/dossier/entityIndex.test.js` and the component tests. The SQL twins that ARE pinned field for field belong to the sanitiser, not the veil: `gallerySanitizer.pglite`, `factionMemberPublicParity.pglite`, `gallerySanitizeAllowlist.contract` and `galleryScannerMirrorTotality`. The baseline 0 / 0 above is that sanitiser parity, re-confirmed by execution.

**What the twin must reproduce, read field for field.** All of it is mechanical, and one finding makes it smaller than feared:
- `isHideableHouse` is **fully declarative**. `isClandestineInstitution` reads `facetOf(…,'clandestine' | 'institutionFunction' | 'subterranean')`. The inference tables (`cohesionWeave.js`) have NO row for `clandestine` and none whose value is `clandestine` or `subterranean`. So the predicate is: `category` or `priorityCategory` is `criminal`; or a declared `facets` value or a `facet:<kind>:<value>` tag; or `serviceKeys ∩ {info_calibration, info_query, info_feed, info_plant} ≠ ∅` with tags holding both `brokerage` and `criminal`. About 15 lines of SQL. The pin must keep it declarative: a future inference row would split the twins.
- **The ids**:
  - npc: `galleryMemberKey`, already twinned as 093's `_gallery_npc_key`.
  - institution: `id || refId || slug(name || label)`.
  - faction: `'faction.' || snake(faction || name)`.
  - event: `id || 'event.' || slug(name || title || label)`. The JS canonical-hash fallback for an anonymous event is not twinned; such an event is matched by no address on the server, and the corpus has 0 of 284.
  - tension, conflict and relationship: `id || '<kind>.' || slug(parts)`.
  - `slug` is `kernel/slugify.js`: lower-case, runs of non-`[a-z0-9]` become `-`, trimmed, at most 80 characters, `unknown` if empty. One edge to pin by execution: JS `toLowerCase` is Unicode-full, Postgres `lower()` follows the collation.
- **The groupings**: 12 fixed addresses, 4 of them no-ops on data (`rumors.dmTruth`, `war.truthVsBelief`, `housekeeping.firstSurvey` hold no settlement data; `defense.criminalStructure` also needs the client's `markVeiled`), and `defense.vulnerabilities` is one regex over `structuralViolations[].reason`.

## (c) THE PROPOSAL — MIGRATION 211

### c.1 The SQL: `211_server_side_share_veil.sql`

**THE RULE: every public read that serves a town's dossier serves it already veiled, and sends nothing of the veil but what the page needs to draw itself.**

1. **New helpers** (immutable, `search_path` pinned, execute revoked from `public`, `anon` and `authenticated`, called only inside the definers):
   - `_gallery_slug(text)`, `_gallery_hideable_house(jsonb)`, `_gallery_veil_card_id(kind text, card jsonb)`.
   - `_gallery_veil_hidden(pub jsonb, overrides jsonb, default_when_unmarked boolean) returns text[]`: the resolver.
   - `_gallery_apply_veil(pub jsonb, overrides jsonb, default_when_unmarked boolean) returns jsonb`: the applier, 1:1 with `applyVeil` including `VEILED_PUBLIC_PROSE`.
   - `_gallery_served_overrides(overrides jsonb) returns jsonb` (see step 5).
   - Every invisible or blank character is written as an escape (`E'\u…'`), never raw (low finding 4, for the new file).
2. **`get_gallery_dossier`** (restates 147). `data := _gallery_apply_veil(<today's data expression>, overrides, false)` when the row is marked. An unmarked listed page is unchanged: the owner's pending decision (d) of §0b is left exactly where it is.
   - **Snapshot mode**: the served body is the FROZEN COPY run through the same expression, and the live row is not sent at all. The base is `_gallery_sanitize_public_json(copy)`, or `_gallery_dm_full_json(copy)` where Reveal DM is on, then the member splice, then the veil.
   - **What this does for frozen copies**: every frozen copy, old or new, is sanitised and veiled on the server at read. **The SECOND LIMIT of §0b closes without a re-export**, and the old client's copies are cleaned at the first read after the push.
3. **`get_unlisted_dossier`** (restates 208). `dossier := _gallery_apply_veil(<208's body>, overrides, true)`: the default veil when unmarked, as the client's R4.
   - The lateral gets `offset 0` (**low finding 1, taken**), and the pin counts with an IMMUTABLE stand-in.
4. **`get_gallery_map`** (restates 088; **RULING 1**). Each member's `settlement := _gallery_apply_veil(_gallery_sanitize_public_json(s.data), s.gallery_member_overrides, false)`, so a member shows exactly what its own listing shows. This one CHANGES A PAGE: the map page shows less for veiled members.
5. **Overrides on the wire.** Both dossier reads return `gallery_member_overrides := _gallery_served_overrides(…)`. It is built from an ALLOWLIST, never by deleting keys (**low finding 2, taken in its fail-closed form**):
   - `$veil` is read only when `jsonb_typeof = 'object'`; an array, a string or a null reads as unmarked and never raises.
   - It sends `{ v: 2, mode, at, groupings: [<hidden tab:/block: addresses>] }`. Version 2 means "applied by the server". The groupings are static names that carry no data; the client needs them to draw `DefenseTab`'s marker.
   - It also sends each member's boolean `revealDm` / `allowImport` (the client's member projection reads them).
   - **No deltas, no frozen copy, no unknown key.**
6. **`import_gallery_dossier`** (restates 131; **RULING 2**). Recommended: the veil applies, so an importer's copy holds nothing the owner hid from other DMs on the gallery. Declined, it stays out of 211, and that must be said in the deploy step as a known limit.
7. **`@rollback`**: recreate `get_gallery_dossier` at 147's body, `get_unlisted_dossier` at 208's (as amended), `get_gallery_map` at 088's and `import_gallery_dossier` at 131's, then drop the six helpers.
   - **Order, LIFO with the release**: undo 211 FIRST, then 210, 207, 206 and 205 as §0b gives them. Undo it before 208's set, because 211 restates 208's read. 211 restates no sanitiser body, so the 205–207 and 210 chain is untouched by it.
   - **The client needs no rollback with it.** The new client draws a v1 marker exactly as today, so with 211 undone the page projects in the browser as before (and the response carries again).
   - No row is written or lost either way. 211 has no backfill, no constraint and no column.

**Low findings 3 and 5, declined with reasons.** Finding 3 (an id spelling a hidden power's name) and finding 5 (substring masking; a longer name half-masked) are the SANITISER's text mask, not the hand veil.
- 211's veil removes by ADDRESS, never by text, so neither touches it.
- Curing either changes what the sanitiser prints on every page, and needs a 211 restatement of `_gallery_sanitize_public_json`. That is a fourth link in the 205→210 LIFO chain, for 0 instances on generated towns.
- **Finding 4 is taken for 211 and declined for 206/207/210.** Re-spelling their class means restating the sanitiser once more, for a change no reader can see. A lint pin refuses a raw invisible character in any migration from 211 on.

### c.2 The client twin, and the files §6 does not name

**The twin of 211 is `src/domain/display/galleryVeil.js`, not `publicSafe.js`.** `publicSafe.js` holds the sanitiser's twin, which 211 does not touch. Phase 2's honest manifest:

| File | Change |
|---|---|
| `supabase/migrations/211_server_side_share_veil.sql` | new (§c.1) |
| `src/domain/display/galleryVeil.js` | `VEIL_LIMITS.servedVersion: 2`. `projectServedVeil(pub, overrides)`: when `$veil.v === 2`, apply ONLY the served groupings (an idempotent removal plus `markVeiled`), never the default rules; otherwise today's `projectShareVeil`. Header: the server twin is named. |
| `src/lib/gallery.js` | `sanitizeDossier`: call `projectServedVeil`; skip the link's R4 default when the server says v2; `snapshotAt` from `share.at` when `mode === 'snapshot'` (the copy no longer travels separately); the stale "CLIENT MIRROR" comments corrected. About 6 lines. |
| `scripts/ops/migrationRehearsalCore.mjs` | `MIGRATION_TRAIN_REPO_HEAD` 210 → 211; one wave entry, `expectedObjects` = the six helpers |
| `docs/DEPLOY.md` | the head line (pinned by `tests/docs/architectureFreshness`, `migrationContiguity` and `migrationAppliedHead`) |
| tests (§c.3) | new |

**Why the client must change at all.** If the server veils and the client re-applies the DEFAULT rules, a default the DM chose to SHOW (an `except:` eye) would be hidden again by the browser. The page would then lack what the response carries, which is the very fault in reverse. Version 2 tells the client the work is done.

**The window between `db push` and the new client.** The OLD client reads v2 as an ordinary marker with no deltas and applies the default set: it hides a little more than the DM chose, for minutes. That is the safe direction, and it is the same read the migrations review gave 204–210.

### c.3 The test that EXECUTES the SQL — `tests/security/galleryServerVeil.pglite.test.js`

It is the probe turned into a pin, with no rule re-implemented by hand:
- The chain 001→211 via the same scaffold, 0 failures.
- The §0.4 corpus with recorded seeds (60 villages, 160 towns, 100 cities and 40 metropolises, run as one shard set; the probe's 24 is the smoke).
- Every configuration of §a's table, live and snapshot, Reveal DM off and on. Each read goes through the REAL client read over the real SQL.

What it asserts:
1. **CARRIED = 0 and READABLE = 0** for the gallery `data`, the link `dossier`, the map member and the import (if ruled in), on every row.
2. **No page change.** The page at 211 deep-equals the page the 210 client draws from the same row: the client-only projection, run in the same test. The map, and the import if ruled in, are asserted equal to their member's gallery page instead.
3. **NEGATIVE CONTROL.** The same rows through the 210 bodies give exactly §a's numbers (14,749 readable on the 24-seed smoke), so the pin is live.
4. **The frozen copy.** A planted old copy (secret, capture state, seed) is served sanitised and veiled, and never verbatim.
5. **The `$veil` shapes**: array, string, null, an extra key and an oversized copy. None raises; none leaks.
6. **The sanitiser runs once per link read**, counted with an IMMUTABLE stand-in.
7. **The helpers' twins, by execution.** `_gallery_slug` against `slugifyEntity`, on the corpus's every name plus a hand-picked Unicode set. `_gallery_hideable_house` against `isHideableHouse`, on every declared-facet, tag and brokerage form. A guard that `cohesionWeave.js` grows no inference row for the three clandestine kinds.
8. **Grants**: `anon` and `authenticated` cannot execute any helper.

A lint row refuses a raw invisible character in migrations ≥ 211. The guard's register starts empty, shrink-only.

### c.4 The clone rehearsal (`docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md`)

With the wave entry above, the owner's rehearsal on the production-shaped clone runs:
- the dry-run, then the bounded push 204→211;
- contiguity through 211;
- the six helpers present;
- row counts unchanged (211 writes no row).

What it cannot see is the same as for 204–210: what a restated function DOES. That is the pin's job, and an independent reviewer's before the merge seat.

**One timing to measure in phase 2 and report.** The veil runs in plpgsql on every gallery and link read, over up to about 1 MB of `jsonb` for a "Force all" metropolis. Phase 2 times the read on the largest corpus town and on the deploy-check request. A read slower than a set bound is a STOP back to the chair.

## (d) WHAT CHANGES FOR THE OWNER AT THE DEPLOY

- **The migrations become EIGHT**: 204–211. `migration list` must show 211 pending; the ledger bump becomes 203 → 211; the rehearsal covers 211.
- **The rollback set gains one line**: undo 211 before anything else.
- **Pre-push queries.** No new question needs answering, but two counts are for information:

  ```sql
  -- (e) Listed towns whose page is a frozen copy: from 211 these copies are sanitised and veiled at
  --     every read, so they need NO re-export (the "re-export each listed town" line of §0b retires).
  select count(*) from public.settlements
   where is_public and jsonb_typeof(gallery_member_overrides -> '$veil') = 'object'
     and gallery_member_overrides #> '{$veil,mode}' = '"snapshot"';
  -- (f) Public maps whose members carry a veil (if ruling 1 is taken, these map pages will show less).
  select count(distinct m.id) from public.saved_maps m
    join public.settlements s on s.id::text in (select jsonb_array_elements_text(coalesce(m.map_data #> '{campaign,settlementIds}', '[]')))
   where m.is_public and m.share_kind = 'map_with_campaign' and m.gallery_share_campaign
     and jsonb_typeof(s.gallery_member_overrides -> '$veil') = 'object';
  ```

- **No re-save and no re-export.** The veil reads the row as it is.
- **§0b's two limits are rewritten.** "ONE LIMIT THAT REMAINS" becomes: the server sends what the page shows. "A SECOND LIMIT" retires. If ruling 2 is declined, import is named as the remaining limit.
- **The three-minute smoke gains one act.** On the party link, hide one sentence in the share panel, reload the link, and search the network response for that sentence: it must be absent.

## (e) THE RULINGS THIS PROPOSAL ASKS OF THE CHAIR

1. **The map page.** Does 211 veil member towns on `get_gallery_map`? It changes a public page, in the hiding direction. Recommended: yes.
2. **Import.** Does the veil apply to `import_gallery_dossier`? Recommended: yes. If not, it is a named limit.
3. **The manifest.** Phase 2 needs `galleryVeil.js`, `gallery.js`, `migrationRehearsalCore.mjs` and `DEPLOY.md` beside the migration and its tests; `publicSafe.js` is not needed. Is that granted?
4. **Version 2 in `$veil`.** Is the served marker's v2 admitted? It is a value, not a new key on the settlement record; `groupings` is a new key inside `$veil` on the WIRE only and is never stored.
5. **Snapshot mode.** Should the live row stop travelling beside the frozen copy?
6. **The low findings.** Is the take and decline above accepted (1, 2 and 4-for-211 taken; 3, 5 and 4-for-206/207/210 declined)?
7. **The powers flag.** Is it left to COHERENCE-POWERS (latent, not in any response)?
8. **The corpus.** Is the §0.4 corpus right for the pin, given about 16 seconds per town for every configuration through the real reads?

STOP. Nothing further until the chair rules.
