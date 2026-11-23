# MAP-PIPELINE — every step the gallery read applies to its `data`, and each other door (VEIL-44; BY READING at the tip 23bb8b8ae, 212 `ff20ed89…`; doors-3 at 3e1115c81 in brackets)
Read: 212 :: `get_gallery_dossier`, `get_unlisted_dossier`, `import_gallery_dossier`, `_gallery_apply_member_overrides`, `_gallery_veil`; 211 :: `get_gallery_map`;
072 :: `import_gallery_map`; 168 :: `get_unlisted_map`; 147 :: `_gallery_public_tile_rows`; doors-3's 212 section. A = APPLIED, S = SKIPPED, N = NOT NEEDED (reason).
Columns: GAL the gallery read (`get_gallery_dossier.data`); LINK `get_unlisted_dossier.dossier`; IMP `import_gallery_dossier.data`; MAP `get_gallery_map` members[].settlement;
LMAP `get_unlisted_map` (hands NO member dossier: its world snapshot only); MIMP `import_gallery_map` (= `get_gallery_map`'s payload, 072 :146); TILE `_gallery_public_tile_rows`
(147: the lists, filters, sorts, counts, and GAL's top-level tile columns).

| # | step (GAL) | LINK | IMP | MAP tip [doors-3] | LMAP | MIMP | TILE tip [doors-3] |
|---|---|---|---|---|---|---|---|
| 1 | source: the narration where narrated | A | A | A [A] | N: no member | as MAP | A: facet copies then `s.data` [A: marked rows read the read's own source] |
| 2 | source: the frozen copy in snapshot mode; a copy past the bound refused | N by 211's design: the link reads the LIVE town (doors-3 s5 (b): the chair's to say) | A | A, but no `copied` flag [A, no flag] | N | as MAP | S [A: the frozen copy] |
| 3 | projection: Reveal DM (`gallery_share_dm`) → DM-full less decrees/dmLayer/customContent*; else the sanitiser | N: always the sanitiser (players) | A | sanitiser ALWAYS: Reveal DM never honoured (SERVES LESS; no ruling names it) [same] | N | as MAP | S: raw columns [marked: band word + name withhold, not the veil] |
| 4 | member overrides (a): each person's revealDm (IMP: and allowImport) splice from the DM-full town | A (its dm_full is the projection + the live ties: widens nothing) | A (for_import) | S: SERVES LESS (a revealed person is not revealed) [S] | N | as MAP | N: no person |
| 5 | member overrides (b): the roster splice (V5-4) | A | A | N on a public projection (the sanitiser's already; 212's V5-4 header) [N] | N | as MAP | N |
| 6 | member overrides (c): THE COVERT CASE (VEIL-13 (5)): `prominentRelationship` whole, `pressureSentence` where it tells a dropped tie | A (the live town's ties) | A | **S: MAP-COVERT** [**S**] | N | **S** (through MAP) | N: no such text in a tile (PLAUSIBLE; asked of the door census) |
| 7 | `_gallery_veil` (link=false): resolve/apply where marked; npcs without name or role dropped; roster choices; withhold-always (R5-RECENT; later N49, E115/E122, N63, R4-IDS's re-key all land HERE) | A (link=true: an unmarked share takes the default veil, R4) | A | A, link=false: unmarked = withhold-always + roster choices [A, link=TRUE: an unmarked member takes the DEFAULT veil (VR23)] | **S: the world snapshot is served as stored** [S, but its `chronicle` dropped (VR40)] | as MAP | **S** [S: the tile rule instead, VR19/VR22/VR28 tier 2] |
| 8 | `data` = body, else the unmarked fallback with each `incomeSources[].weight` stripped | A (body always) | A | `coalesce(body, pub.j)`: body for every object, so the bare fallback reaches only a non-object (PLAUSIBLE harmless) [body only] | N | as MAP | N |
| 9 | the served marker (`vl.v -> 'served'`) with the freeze date (`copy`) | A (no `copy`) | N: the import returns no marker; its clone is built from `data` (PLAUSIBLE: the client's import reads none) | S: no marker sent [S] | N | as MAP | N |
| 10 | name and tier: the row's (doors-3: the frozen copy's in snapshot mode) | live, by 211's design | live [frozen: the two s7 hunks] | live [frozen] | N | as MAP | live [frozen] |
| 11 | chronicle (beside `data`): `_gallery_chronicle_json` raw at the tip (V10-1) [doors-3: `_gallery_doors_chronicle` under the read's own veil] | N: the link sends none | N: none | S at the tip (raw) [A, share_dm false] | N | as MAP | N |
| 12 | the client twin (the page's projection / re-derivation) | `fetchPublicDossier` | `fetchDossierForImport` | `fetchGalleryMap` RE-DERIVES, never projects; NO TWIN (U-UNMARKED) | — | the map import path | the cards' tile reads |

SKIPPED, the class (each the build's): MAP and MIMP row 6 (MAP-COVERT, THE FIRST RED); LMAP row 7 and MAP's world (the stored snapshot, units 2 and 3); TILE rows 2, 3, 7
(V10-3; doors-3's tile rule cures it); MAP row 11 at the tip (V10-1; doors-3 cures it); MAP row 9 and row 12 (no marker, no twin: N48's whole-document form cannot hold the
member until a twin exists).
SERVES LESS, NAMED, NOT A LEAK, NO RULING YET (for the door-equality arm): MAP rows 3 and 4 (Reveal DM at share and person level).
SEEN IN PASSING, NOT THE VEIL'S (a paid surface, the owner's): `import_gallery_dossier` refuses a caller without premium (mig 120); `import_gallery_map` (072) does not ask.
