# Seat T measurement — can a DM place a thing at a POINT / ROUTE / REGION on the realm map?

Code of record: CR = scratchpad/master-00b648c9d (detached, HEAD 81f1cd963). Every path:line below is relative to CR.
Method: rg / sed / awk reads only. Nothing edited in CR. Labels: CONFIRMED = read in code; PLAUSIBLE = inferred.

## Q1. FMG embed, its native marker layer, and the bridge

### Where FMG lives
- Vendored fork at `public/map/` (FMG MIT, LICENSE-FMG.txt). Core engine bundle `public/map/index-Bp79q281.js` (minified, 28 lines), FMG `public/map/main.js` (1397 lines), integration `public/map/sf-bridge.js` (1728) + `public/map/sf-origin.js` (69).
- Design doc claim: `docs/azgaar-bridge.md:3` "In embedded mode FMG generates geography only"; React layer draws settlements/routes/overlays.

### FMG's own marker layer EXISTS in the embedded copy (CONFIRMED)
- `public/map/main.js:86` `let markers = viewbox.append("g").attr("id", "markers");`
- `public/map/main.js:778` `Markers.generate();` and `:779` `Zones.generate();` run UNCONDITIONALLY inside `generate()` (`main.js:721`).
- `public/map/index-Bp79q281.js:23` `window.Markers=new GS` ; `:21` class has `generate(){...pack.markers=[],this.generateTypes()}`, `addMarker(t,n)`, a delete-marker method (filters `pack.markers` and `notes`).
- Default marker types are geography-driven (volcanoes, hot-springs, water-sources, mines, bridges, inns, lighthouses, waterfalls, battlefields, dungeons, lake-monsters, sea-monsters …) — `index-Bp79q281.js:21` (getDefaultConfig). Each generated marker also pushes a `notes` entry (`index-Bp79q281.js:23` `notes.push({id:t,name:a,legend:i})`).
- FMG UI editors vendored: `public/map/modules/ui/markers-editor.js`, `markers-overview.js`, `notes-editor.js`, `zones-editor.js`, `routes-creator.js`, `routes-editor.js`.
- PLAUSIBLE: in embedded mode (0 states, 0 burgs — `sf-bridge.js:139-149`) the burg-dependent types (inns, lighthouses?, bridges?) find few/no candidates, but terrain types (volcanoes, hot springs, waterfalls, sea/lake monsters) still populate `pack.markers`. Not executed.

### It is HIDDEN and NOT bridged (CONFIRMED)
- `public/map/sf-bridge.js:187` `body.sf-embedded #markers { display: none !important; }`; `:188` `#zones` hidden; `:181` `#routes` hidden; `:189` `#armies` hidden; `:184` `#borders`, `:186` `#labels` hidden.
- `public/map/sf-bridge.js:46-48` comment: the React overlay "owns all relationship/chain/label/marker/forest rendering. The FMG bridge no longer draws overlays itself."
- Bridge command table `public/map/sf-bridge.js:502-643`: requestBurgList, placeSettlement, removePlacement, clearAllPlacements, restorePlacements, computeRoadNetwork, getSpatialPack, exportThumb, getViewport, setViewport, fitMap, saveSnapshot, loadSnapshot, resetMap, activateTool (heightmap/rivers/coastline/lakes/biomes only, `:1505-1526`), deactivateTool, terrainUndo/Redo, setEmbeddedMode, setFmgLayer (`:1587-1593` keys stateBorders/cultures/biomes/routes/rivers — NO markers/zones), setTemplate, getTemplates. NO marker / note / zone command.
- App-side typed client `src/lib/mapBridge.js:277-336` — same set; zero `marker|zone|note` hits in `src/lib/mapBridge.js` (rg).
- `placeSettlement` (`sf-bridge.js:509-553`) only converts screen→map coords + `findCell`, mints synthetic `sf_…` burgId; does NOT call addBurg; the icon is React-drawn.
- Phantom wrapper: `sf-bridge.js:1717` reads `window.regenerateMap`, but FMG declares it `const regenerateMap = debounce(...)` at `public/map/main.js:1360` — a script-scoped lexical, never a window property, so the re-notify wrapper at `sf-bridge.js:1718-1727` never installs (CONFIRMED by reading: main.js is a classic `<script defer>` at `public/map/index.html:8530`, so its top-level const is a global lexical binding, and no file binds `window.regenerateMap` (rg); not executed in a browser; matches memory hazard BR-1). `resetMapCmd` (`sf-bridge.js:488-498`) uses the bare identifier and works.

### Persisted? Only as opaque bytes inside the FMG snapshot (CONFIRMED for the FMG side)
- FMG save: `public/map/modules/io/save.js:101` `const markers = JSON.stringify(pack.markers);`, `:76` notes; load: `public/map/modules/io/load.js:428` `pack.markers = data[35] ? JSON.parse(data[35]) : [];`, `:302` notes.
- So FMG markers/notes ride inside the `prepareMapData()` text blob that `saveSnapshot` returns (`sf-bridge.js:462-465,1447-1454`). Whether that blob is stored on the campaign: see Q2.

## Q2. mapState, the realm map surface, what a user can click to place

### Architecture
- `src/components/WorldMap.jsx:1-14`: iframe (FMG geography) + `<MapOverlay>` React SVG on top; mode switcher; sidebar settlement palette (drag to place).
- `src/components/MapOverlay.jsx:316-361` renders inside one transformed `<g>` (map coords): TerritoryLayer (`:332`), ForestsLayer (`:333`), RoadsLayer (`:336`), ChainEdges (`:337`), RelationshipEdges (`:338`), TimelapseLayer (`:342`), RegionalCausalityLayer (`:343`), WarFaithMapOverlay (`:347`), TravelersLayer (`:351`), TravelRingsLayer (`:354`), HoverGlowLayer (`:357`), PlacementsLayer (`:358`), MarkersLayer (`:359`), LabelsLayer (`:360`). HitLayer (`:307-314`) only when interactive.
- Overlay is pointer-passive except ANNOTATE mode: `MapOverlay.jsx:243-250`.

### Modes / tools (CONFIRMED)
- `src/store/mapSlice.js:58-67` MAP_MODES = view | terrain | annotate | routes. `:79-84` ANNOTATE_TOOLS = select | label | marker | forest.
- Mode pill mounted unconditionally: `src/components/map/WorldMapToolbar.jsx:385-387` -> `src/components/map/ModeSwitch.jsx:24-29` (Annotate hint "Mark the map. Place labels and notes." `:27`; image-mode hides Terrain+Routes `:29`).
- Annotate toolbar: `src/components/map/WorldMapContextToolbars.jsx:21-23` (hidden while campaign panel shows); tools/options `src/components/map/AnnotateToolbar.jsx:63-86` (Select/Text/Marker/Forest), marker icon pin/star/skull/flag + color `:127-149`, forest style/radius/density `:151-185`, Delete `:190-200`, Undo/Redo `:204-205`.
- CLICK-TO-PLACE: `src/components/map/HitLayer.jsx:48-66` — click with MARKER tool => `addMarker({x,y})` (`:61-63`); LABEL => `addLabel` (`:57-59`); FOREST drag paints discs every ~40 map units (`:68-91`). Coordinates are raw map coords (`:24-37`).
- Marker edit: drag-to-move in Annotate/Select (`src/components/map/MarkersLayer.jsx:30,44-75`); double-click opens a dialog that edits TITLE ONLY (`src/components/MapOverlay.jsx:363-383`). The `note` field exists in the shape but no UI writes it (rg: only mapSlice + mapDirtyFingerprint touch `note`).

### Persisted map shape (CONFIRMED)
- Slice default `src/store/mapSlice.js:153-178` (`freshMapState`): `{ fmgSnapshot, seed, customBackdrop, placements:{}, labels:[], markers:[], forests:[], layers:{...DEFAULT_LAYERS}, viewport }`.
- Marker row `src/store/mapSlice.js:678-688`: `{ id:'mrk_<ts>_<rand>', x, y, icon, color, title, note }`. Label row `:654-665` `{id:'lbl_…', x, y, text, fontSize, color, fontFamily, rotation}`. Forest row `:701-711` `{id:'fst_…', x, y, radius, density, treeStyle}`. Placement row `:415-420` `{settlementId, x, y, cellId, placedAt}` keyed by opaque burgId.
- Campaign write `src/store/campaignSlice.js:814-836` (`saveCampaignMap`): `campaign.mapState = { schemaVersion, fmgSnapshot, seed, customBackdrop, placements, labels, markers, forests, layers, viewport, savedAt }`. Header doc `campaignSlice.js:8-29` (localStorage `sf_campaigns` + `saved_maps` cloud).
- Cloud row: `src/lib/campaigns.js:477-489` `saved_maps.map_data = {kind, version, campaign}` (`:332-337`) — whole campaign incl. mapState; `burg_settlement_map = mapState.placements`. Validator: labels/markers/forests must be arrays `src/lib/campaigns.js:100-104`; fmgSnapshot string `:110-115`.
- Writers: explicit save `src/components/WorldMap.jsx:518-535` (bridge.saveSnapshot -> setMapSnapshot -> saveCampaignMap); debounced autosave `src/hooks/useMapAutosave.js:47,63`; dirty fingerprint includes marker id/x/y/icon/color/title/note `src/components/map/mapDirtyFingerprint.js:28-30`.
- Load: `src/components/WorldMap.jsx:433-444` replaceMapState(ms) then `bridge.loadSnapshot(ms.fmgSnapshot)`; merge-with-defaults `src/store/mapSlice.js:773-797`.
- Undo covers placements/labels/markers/forests only `src/store/mapSlice.js:185`.
- Gallery share/import copies markers verbatim: `src/store/galleryImportMap.js:404-406`.
- Op registry: `src/store/operationRegistry.js:443` addMarker klass 'mechanical', targetScope 'campaign'.

### Markers are COSMETIC (CONFIRMED by absence)
- rg `mapState\??\.markers|\bmarkers\b` over src/domain, src/store, src/lib, src/hooks, src/workers, src/kernel, src/application: the only readers of the user-marker array are store plumbing (mapSlice, campaignSlice:828, galleryImportMap:405). No domain/engine module reads a DM marker; no marker has a type, owner, tick, or settlement link.

### Routes: no free-drawn route exists (CONFIRMED)
- Roads are DERIVED: `src/components/map/RoadsLayer.jsx:1-11` (computeRoadEdges(saves, placements) -> bridge `computeRoadNetwork` A*), polylines held in React state only (`RoadsLayer.jsx:47`). `src/store/mapSlice.js:446-447` "routes are derived (computeRoadEdges), not hand-drawn".
- Routes mode toolbar is filters/toggles only: `src/components/map/RoutesToolbar.jsx:1-24`.
- The one DM-authored route: "Charter a road" — `src/store/userRouteCharter.js:59-147` + `src/domain/roads/userRoutes.js:4-9,129-162`: settlement->settlement only, endpoints must be in `digest.settlementIds` (`userRoutes.js:136-141`), cost READ from `digest.distanceMatrix` (`:146-151`), mode land|water derived (`:95-99`); emitted as canon event `CREATE_ROUTE` (`userRouteCharter.js:83-101`), recorded on settlement `config._userRoutes` / `neighbourNetwork` linkId `route.*` (`userRoutes.js:171-187`). UI is in the dossier, not the map: `src/components/settlementDetail/CharterRoadCard.jsx:55,86`. No waypoint, no geometry, no mid-route point.

### Other placement writes (CONFIRMED)
- Settlement drag-drop: FMG inline drop handler `public/map/main.js:632` (MIME `application/settlementforge`) posts `fmg:settlementPlaced` with `settlementId: sfData.id` (`:660-662`) -> `src/hooks/useMapBridge.js:162-174` (calls `addPlacement` at `:168`) -> the gate (campaign / canon / no-duplicate) `src/store/mapSlice.js:387-404`.
- Keyboard placement `src/components/map/KeyboardPlacementControl.jsx:1-14`; autoplacement (pre-canonize only) `src/store/mapSlice.js:538-634`, `src/domain/realm/placementRaster.js:9-23`.
- Move-lock: `updatePlacement` refuses once `worldState.canonizedAt` (`src/store/mapSlice.js:487-494`). `addMarker` has NO campaign/canon gate (`mapSlice.js:678-688`).
- Every placement is a SETTLEMENT. No non-settlement placement kind exists in `mapState.placements`.

## Q3. Non-settlement things rendered at a map position today

| Thing | File:line | Position source | DM-placeable? |
|---|---|---|---|
| User pin markers (pin/star/skull/flag, title) | `src/components/map/MarkersLayer.jsx:10-137`; create `HitLayer.jsx:61-63` | free x,y in map coords (`mapSlice.js:681-687`) | YES — cosmetic, no engine reader, no audience field |
| User text labels | `LabelsLayer.jsx`; `HitLayer.jsx:57-59` | free x,y | YES — cosmetic |
| Forest brush discs | `ForestsLayer.jsx`; `HitLayer.jsx:68-91` | free x,y + radius (a disc "area") | YES — cosmetic decoration only |
| Army columns / migrant columns / envoys | `src/components/map/TravelersLayer.jsx:75-130` | interpolated along a PATH OF SETTLEMENT IDS (`:71,80-82`) from `worldState.spatialLedgers.armyTransit / migration / roads.missions` | NO — engine-derived, read-only (`:7`), DM-secret (`:14,51`), opt-in layer default off (`mapSlice.js:112`), pointerEvents none (`:140`) |
| Deployment arrows, siege rings, occupation shading, trade-war prize | `src/components/map/WarFaithMapOverlay.jsx:1-26,48-58` | settlement placements | NO — derived from war read-models |
| Regional channels + impact markers | `RegionalCausalityLayer.jsx:21-40` -> `src/lib/regionalMapOverlay.js:30-35,59` | settlement placements | NO (channels between settlements) |
| Territory dot field | `src/components/map/TerritoryLayer.jsx:1-31` | `digest.territory` per cell + LIVE pack centroids (digest has no coordinates `:12-14`) | NO — derived |
| Travel rings | `TravelRingsLayer.jsx:1-23` | halos on settlements banded by hopWeeks | NO |
| Timelapse pulses/tint | `TimelapseLayer.jsx:2-11` | rings on settlements | NO |
| Roads | `RoadsLayer.jsx:1-11` | A* polylines between placements | NO (derived); "Charter a road" adds a settlement-pair edge, no geometry |
| Satellite steadings | `PlacementsLayer.jsx:317-330` | cosmetic orbit around parent | NO (engine lifecycle) |

- NOT rendered on the realm map at all (rg over src/components/map, MapOverlay.jsx, regionalMapOverlay.js): embattlement, pestilence fronts, calamity. Only text surfaces (e.g. `AdvanceReport.jsx:49`).
- `src/components/map/settlementThreat.js:1-62` is a DISPLAY helper for the per-settlement `config.monsterThreat` tier (heartland/frontier/plagued, `src/data/monsterThreat.js:28`), set in the generator ("Regional Threat" select `src/components/ConfigurationPanel.jsx:454`); shown as a pill (SettlementPalette, DossierHeaderRow, HeraldGazetteer). No position.
- `src/domain/mapProfile.js:241-262` `hazardMarkers` (from `threatProfile.js`, settlement-scoped) carry NO x/y; consumed by the TOWN map (`src/domain/townMap/townLayoutV2.js:542,775`; `townMapModel.js:552`), never the realm map.
- Realm PNG plate draws sea-lines, land, relief, road MST, settlement markers, furniture only — no user markers (`src/domain/realmMap/realmPlateRenderer.js:332-350`).
- DM forcing surface (Realm Verb Composer) `src/components/map/RealmVerbComposer.jsx:1-12` over `src/domain/events/realmManifest.js`: 17 verbs (`:310-617`, DECLARE_CASUS … FORCE_RESETTLE); dial kinds only enum/target/band (+text from parked entries) (`:276-283`); EVERY entry has `targetsFrom: 'campaignSettlements'` (17 entries + the helper at `:280`). ROUTE-SHAPED VERBS ARE DEFERRED: INTERCEPT "Intercept a believed column" (`:490-503`) and REINFORCE (`:471-489`) are registered with a predicate that always refuses — "nothing to intercept spatially in wave 1" (`:500`); even INTERCEPT's dial is the column OWNER settlement (`:494`). ORDER_CONVOY / DECLARE_BLOCKADE take a port PAIR (`:506-537`). FORCE_CALAMITY targets "The stricken settlement" (`:565-571`). No point / route / region target kind exists.
- Precedent (TOWN map, not realm): DM annotations with x/y/label/audience 'dm'|'player' in settlement `mapEdits.annotations` — `src/domain/townMap/mapEdits.js:90-99,306-330`. The realm markers have no audience split.

## Q4. Regions and the spatial digest

### No region/zone entity in the campaign model (CONFIRMED)
- FMG political generation zeroed: states/manors/religions/provinces = 0 `public/map/sf-bridge.js:139-149`; `#borders`,`#statesHalo` hidden `:184-185`. The "State borders"/"Culture regions"/"Biomes" toggles only flip FMG `<g>` display via `setFmgLayer` (`src/components/WorldMap.jsx:286-309`; `sf-bridge.js:1583-1621`). PLAUSIBLE (matches memory measurement 10-02, not re-executed): state borders paint nothing because no states exist.
- FMG Zones module present `public/map/index-Bp79q281.js:11` (`window.Zones=new $S`; config invasion/rebels/proselytism/crusade/disease/disaster/eruption/avalanche/fault/flood/tsunami) and `Zones.generate()` runs (`main.js:779`); `pack.zones` is serialized in the snapshot (`modules/io/save.js:104`, `load.js:430`), the layer is CSS-hidden (`sf-bridge.js:188`), and NOTHING in src reads `pack.zones`/`pack.markers` (rg `pack\.markers|pack\.zones|Markers\.|Zones\.` over src = 0 app hits). PLAUSIBLE: burg-seeded zone types (disease etc. need burgs, `index-Bp79q281.js` addDisease) produce nothing with 0 burgs.
- Regional graph `src/domain/region/graph.js:18-22`: `RegionNode` = settlement (`settlementId`), edges/channels between settlements, `queuedImpacts`. "Region" = the campaign realm, not a sub-area.
- Embattlement, "the design's UNIFYING region state", is keyed by settlementId: `worldState.embattlement = {[settlementId]: {level, phase, sinceTick, lastTick}}` `src/domain/spatial/embattlement.js:4-19`. The engine's only region = a settlement's territory.
- `config.region` read at `src/domain/mapProfile.js:135` only (a nullable string input); not an entity.

### Spatial digest (realm) — node/edge types (CONFIRMED)
- Builder `src/domain/spatial/spatialDigest.js:587-923`; written whole to `campaign.worldState.spatialDigest` with `spatialCanonVersion` (`src/store/campaignSpatialCanonize.js:186`), size cap 400,000 B (`:36,158-161`); deep-frozen (`:168`).
- Inputs: captured pack + `mapState.placements` ONLY (`src/lib/spatialPackCapture.js:84-85,119-120`) — DM markers never enter the digest.
- Return shape `spatialDigest.js:902-922`:
  - NODES: `settlementIds` (`:906`) — settlements only.
  - `distanceMatrix` id->id int cost; `tiers` id->id 1|2|3 (`:912-913`) — settlement-pair edges.
  - `gates`: `{between:[a,b], cellA, cellB, cost}` (`:814-817`) — the cheapest boundary-cell crossing per adjacent territory pair; `routeReceipts` per primary hop with terrain breakdown (`:819-841`). Cell ids, not nodes.
  - `territory`: DENSE per-cell -> settlement index, -1 ocean/unreached (`:689-695`) — the Voronoi-of-settlements partition (`:14-16`).
  - `costField`: per-cell quantized entry cost, IMPASSABLE for water (`:645`; `spatialCost.js:448-455`).
  - `reserved`: `{airField:null, seaLanes, seasonalOverlay, teleportEdges}` (`:193-195`). SeaLanes `{ports:string[], edges:[{between:[id,id],cost,capacity}], stormSeasonCost}` (`distanceRead.js:272-275`); TeleportEdges `{nodes:string[], edges:[{between,cost,capacity}]}` (`distanceRead.js:394-397`) — both settlement-pair edge sets. Canonize lights seasonalRoads/seaLanes/teleport/lakes (`campaignSpatialCanonize.js:122-144`); biomes/climate only under virtual flags (`:95,103`).
  - `lakes` (opt-in, lit at canonize): `{version, bodies:[{id, cells(count), shoreline:number[] land-cell ids, subtype, temp, flux, evaporation}]}` (`waterBodies.js:258-259,331`) — the ONLY non-settlement entities in the digest; they are not graph nodes and carry no coordinates.
  - optional `biomes`, `climate` (per settlement), `captureReceipt`, `kmScale`.
- NO cell coordinates are persisted: `src/domain/realm/placementRaster.js:12-16` ("The per-cell centroid array `p` is CONSUMED at build time and never persisted"); TerritoryLayer must fetch the live pack (`TerritoryLayer.jsx:12-18`). No per-cell distance field is persisted (Dijkstra `dist` is not in the return).
- No waypoint, route-hop, crossroads, or water-body NODE exists; routes are settlement->settlement only (`distanceRead.js:5-14`).

### `spatialSubstrate.js` is the TOWN substrate, not the realm (CONFIRMED)
- `src/domain/spatial/spatialSubstrate.js:1-44,123-168`: derived from a TownMapModel; shape `{v, sig, lyr, d:[{id, cat, cx, cy, flam, den}] districts, adj (district adjacency), w (wall segments {i,x1,y1,x2,y2,str,did}), g (gates {x,y,seg})}` in the 1000x1000 town view (`:90-93`). Nodes = districts of ONE settlement.

## Summary of what is ABSENT
1. No DM placement of a thing with ENGINE MEANING at a point, on a route, or over a region of the realm map. The only free-position DM objects (markers, labels, forests) are cosmetic annotations no engine module reads.
2. No route-attached placement: user markers have only x,y; no edge/route id; roads have no persisted geometry; the charter verb makes settlement-pair edges only.
3. No region/zone entity in the campaign: FMG states/provinces zeroed; FMG zones/markers generated-but-hidden-and-unread inside the opaque snapshot; the engine's region = a settlement territory (per-cell index in the digest).
4. No bridge command for FMG markers/notes/zones; `setFmgLayer` knows only stateBorders/cultures/biomes/routes/rivers.
5. No cell id on a user marker (placements carry cellId; markers do not), and the frozen digest has no coordinates, so a point->territory lookup needs the live pack (`getSpatialPack` / `findCell`) at write time.
6. No DM/player audience on realm markers (the town map has one).
7. Realm verbs (the DM forcing surface) target campaign settlements only; the one column-intercept verb is registered-but-deferred (`realmManifest.js:490-503`).
