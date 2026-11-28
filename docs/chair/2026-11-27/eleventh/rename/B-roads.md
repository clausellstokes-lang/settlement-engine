# (B) WHAT SURVIVES THE ROADS

By execution (CONFIRMED) on ten towns of C (plan rows 0, 90, ..., 810: two thorps, two hamlets, a village, two towns, two cities, a metropolis), tree cccda7569. Scripts: `tools/roads-harness.jsx` (the identity parts read off each road's record), `tools/roads-render.jsx` + `tools/analyze-br.mjs` (the owner's page of the town against the owner's page of its imported copy, every tab walked, every hash pick logged). Results: `work/B.jsonl`, `work/BR.jsonl`.

The roads, each by the product's own functions (glue named where a function is not exported):

| road | functions run |
|---|---|
| R1 save + reload (local) | `lib/saves.js :: saves.save` -> `saves.list` (supabase mocked unconfigured: the local backend) |
| R1c save + reload (cloud) | a row whose `data` is the stamped record (as `supabaseSave` / `mutationRow` write it: `withPublicProse(settlement, stamp)`, replicated) -> `lib/saves.js :: admitSupabaseSavedSettlementRows` |
| R2 JSON export + import | `lib/accountData.js :: buildAccountExport` -> JSON text -> `lib/accountImport.js :: validateAccountImport` -> `prepareSettlementEntry` |
| R3 the shared page's projection | `domain/display/publicSafe.js :: toPublicSafe(.., {full:false})` -> `domain/display/galleryVeil.js :: projectShareVeil(.., null)` (as `rmeasure/tools` used them) |
| R4 gallery import (a second user's copy) | the server's `_gallery_sanitize_public_json` (SQL, migration 048: NOT executable here; mirrored by `toPublicSafe(full:false)`, and `full:true` for `gallery_share_dm`) -> `lib/gallery.js :: stripImportConfidential` (not exported: its 8 deletes replicated) -> `veilPublicPayload` -> `store/galleryImportSettlement.js :: importGallerySettlementImpl`'s entry (`normalizeSettlement({...src, _seed: undefined, ...})` + the four `importScrub.js` scrubs) |
| R5 the PDF's composer input | `normalizeSettlement` -> `pdf/lib/viewModel.js :: buildViewModel` (its `vm.raw`) |
| R6 Foundry export | `foundry/moduleBuilder.js :: buildFoundryModuleFiles` (what the written files hold) |

## What each road keeps, drops or rewrites (10 towns; k = kept, d = dropped, a = absent at the source)

| part | R1 local | R1c cloud | R2 JSON import | R3 share | R4 gallery import | R5 PDF input | R6 Foundry files |
|---|---|---|---|---|---|---|---|
| town `_seed` | k10 | k10 | **d10** | **d10** | **d10** (also `_config`, `config._seed`) | k10 | not written (0/10) |
| town `id` | k10 | k10 | k10 | k10 | k10 | k10 | the id's last 6 in the module id (10/10); the full id not written |
| town `name` | k10 | k10 | k10 | k10 | k10 (the save ROW is named "<name> (imported)"; `settlement.name` unchanged) | k10 | k10 |
| person `id` | k10 | k10 | k10 | k10 | k10 | k10 | not written |
| person `name` | k10 | k10 | k10 | k10 | k10 | k10 | k10 |
| house (institution) `id` | a10 | a10 | a10 | a10 | a10 | a10 | - |
| house `name` | k10 | k10 | k10 | k10 | k10 | k10 | - |
| power (faction) `id` | a10 | a10 | a10 | a10 | a10 | a10 | - |
| power `name` | k10 | k10 | k10 | k10 | k10 | k10 | - |
| the shared page's stamp (`publicProse`) | k10 | k10 | k10 (the OLD stamp rides in; the importer's save re-stamps it) | k10 (read by the share) | k10 | k10 | - |

Houses and powers carry NO id on a born record (10/10, and `institutionRename.js`'s own count: "17,361 of 17,361 generated records carry `name`; none carries `id`"). A key that must survive a rename of a house or power has no id to take.

## A part a road drops is a re-deal on that road

Only `_seed` is ever dropped, by R2, R3 and R4. The sites of (A) whose key holds `_seed`: A11 deriveViability (`_seed ?? id ?? name`), A12-A14 the state-prose kernel (`_seed ?? id`), A21 arrangementOf (`_seed ?? id ?? name`), A22-A24 the traditions (description draws and the founding PREVIEW's PRNG, `_seed ?? id`), A25 withRingVantage (`_seed` alone), A29 cultureScopeLine (`_seed` alone: a null key takes the first frame).

MEASURED, the owner's page of the town against the owner's page of its imported copy (each copy re-stamped as the importer's save would stamp it):

| road | pages moved | lines moved | where (lines) | sites whose key changed (pick log) |
|---|---|---|---|---|
| R2 JSON import | **10 of 10** | 474 | PDF prose 168, Traditions 97, Defense 62, Economics 48, Power 26, Overview 24, History 14, Resources 10, Daily Life 8, Magic 7, Outlook 5 | A29 cultureScopeLine 10/10 (key `dp-thorp-0::culture-scope-line` -> null: the first frame, 9 pages' scope line moved); A22/A23 traditions 10/10 (`dp-thorp-0::tradition.dp_thorp_0.0#done` -> `s_83fa…::tradition.s_83fa….0#done`: the preview's rec ids are slugs of the seed, so the copy's TRADITIONS THEMSELVES are re-derived: 10 of 10 Traditions tabs moved, e.g. dp-thorp-0's "The Great Offering" and "The Lesser Furrow Vigil" become one "The Moon Feast"); A11 viability (`dp-thorp-90|viability` -> `s_5376…|viability`); A25 ring vantage (1 page, key gone); A12-A14 state prose (its own hash, not in the proseHash log: the Economics/Defense/History/Resources/PDF lines) |
| R4 gallery import | **10 of 10** | 977 | as R2, plus the public projection's own losses (NPC Foundry pages, Relationships, secrets veiled: not re-deals) | as R2 |
| R3 share | (the share is measured in (D): its seed-keyed lines are the owner's, read from the stamp composed at save; no seed-keyed pick runs on the share page: pick log) | | | |

Example (R2, dp-thorp-0 Linyuan, Systems/Resources): "The people of Linyuan know what their ground is worth to others, and know that is reason enough for someone to come for it." becomes "A newcomer to Linyuan soon hears what its ground is worth to the powers around it, and how little of that worth stays in the thorp."

So: an imported copy (a DM's own JSON round trip, or a second user's gallery import) is a DIFFERENT PAGE from the town it came from, at every `_seed`-keyed site, today and with no rename. The NAME, which a rename moves, survives every road; the `_seed` survives no road that leaves the owner's library. The `id` survives every road and every rename (no rename writer touches `settlement.id`, and `normalizeSettlement` stamps an id only where one is absent).

R6 Foundry: the export is one-way and frozen at export (name, people, prose as printed); a later rename does not reach an exported module.
