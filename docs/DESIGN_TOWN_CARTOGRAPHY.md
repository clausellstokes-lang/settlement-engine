# DESIGN — TOWN CARTOGRAPHY (the deterministic MFCG-class settlement map)

## Owner-commissioned architecture, 2026-07-31 ("comprehensively architect it out").
### Status: DESIGN ONLY — nothing here is scheduled until the owner sequences it. Builds
### AFTER the seven realm directives (DESIGN_REALM_DIRECTIVES.md), whose W-E and W-G waves
### construct raster-sampling and terrain-fitting substrate this program reuses.

## 0. THESIS

The settlement map becomes a Watabou-class organic town map — tier-appropriate street
webs, wards, building footprints, walls, water adaptation, the beloved color language —
generated ENTIRELY from the engine's own deterministic truth (dossier, topology,
geography, resources) so that:

1. **Same seed ⇒ same map, byte for byte.** The moat's visual form. No market tool can
   claim it.
2. **The map and the dossier cannot disagree.** Every footprint is a projection of a
   canonical fact; click a building, reach the institution, reach the NPC, reach the
   interior (DOOR 3) — three zoom levels of one truth.
3. **The map is ALIVE.** It ages with the pulse: the new quarter after the boom decade,
   the burned ward after the siege, the satellite thorp on the ridge, the relic ruin when
   a city dies. MFCG is static; ours remembers. This is the product thesis made visible.

Style target is the *genre* (organic medieval cartography, colored wards, hand-drawn
warmth), never Watabou's code or assets (MFCG is not open source; we clone nothing). The
current Watabou iframe (frame-src allowlisted) remains an optional external view until
promotion, then retires.

## 1. THE ONE LAW THAT DECIDES EVERYTHING

**The cartography layer is a SYNTHESIS STAGE inside the TownSceneManifest pipeline, never
a parallel generator.** Street graph, wards, parcels, and footprints become manifest
layers compiled by the existing renderer-neutral spine
(`src/domain/townScene/compileTownSceneManifest.js` → `manifestContract.js` schema). The
painter is a renderer over the manifest; the 3D portrait consumes the SAME parcels
(building placement upgrades for free); the current 2D plan remains the permanent
precision/accessibility/export fallback. A map generated beside the manifest and then
decorated is a second settlement truth and is FORBIDDEN — that failure mode forks the
temple on the map from the temple in the roster within a month.

## 2. WHAT ALREADY EXISTS (verified against the tree, 2026-07-31 — build on, not beside)

- `townScene/`: versioned, audience-safe manifest (TOWN_SCENE_SCHEMA_VERSION, PLAN_EXTENT,
  TERRAIN_GRID, AUDIENCES, SHAPE/LOD families), stable digests, compile-input contract
  with byte cap, worker lowering to transferable geometry, GLB/PNG export, promotion
  contract precedent (TOWN_SCENE_PROMOTION_CONTRACT.json).
- `townMap/`: institutionAssignment (the dossier→map join EXISTS at glyph level),
  fabricRead (urbanFabricKernel consumption), groundDress, ageOverlay (temporal texture
  precedent), lynchRubric (urban legibility scoring — the taste gate has a metric),
  audienceProjection, fog, anchors, bespokeStyles, asymmetrySources.
- Kernel: deterministicPng (byte-contract raster), toneCurve LUT (no platform gamma),
  integer-geometry discipline proven in `domain/interior/` (trig-free rotation, per-room
  seeded forks, golden corpus).
- Engine feeds: tier/population, terrain + terrainOverride, water/coast, trade routes
  (incl. the seasonal mountain_pass tier), resources + strikes, institutions catalog,
  urbanFabric growth state, settlement lifecycle (satellites, remnant grades), war/siege
  state, seasons.

## 3. CANONICAL MODEL — the manifest gains four layers (schema-versioned, additive)

```
TownSceneManifest (existing) +
  streets:   { arterials[], lanes[], gates[], bridges[] }      — polyline graph, integer coords
  wards:     { id, kind, polygon, tone, provenance }[]         — kind from a CLOSED vocabulary
  parcels:   { id, wardId, polygon, anchor }[]                 — footprint slots
  buildings: { parcelId, institutionRef|dwelling, footprint,
               height01, age01, condition, styleSeed }[]       — every institutionRef resolves
                                                                 into the SAME roster the
                                                                 dossier renders; dwellings are
                                                                 population-derived filler with
                                                                 NO parallel identity
```

Rules: integer coordinates on the existing PLAN_EXTENT grid (the interiors discipline —
no float geometry crosses the contract); every layer JSON-safe, digest-stable, and
audience-projected through the existing seam (covert/DM-only structures obey the
`audienceProjection` law — a concealed site never reaches a player/public manifest);
ward `kind` and building `condition` are CLOSED vocabularies (finite-semantics law);
provenance on every ward/parcel (generated | pulse:<tickRef> | user-edit) so regen,
reroll, and import preserve user cartography (the write-that-ghosts class is pre-answered
here, not patched later).

## 4. THE SYNTHESIS PIPELINE (pure, seeded, staged like the settlement pipeline)

`S-CARTO runner` inside the manifest compile, per-stage forked PRNG streams (`carto:*`
labels — the delimiter contract applies):

1. **Field stage** — read spatial rasters (terrain, water, slope from the realm position;
   satellite orbit context) into a local tensor field; roads/routes enter as boundary
   conditions (the user route from directive 3 lands here as an arterial seed).
2. **Skeleton stage** — arterials via field-following growth from gates/waterfront/route
   ends; lanes via space-colonization infill scaled by tier density bands; bridges where
   arterials cross water; walls at tier ≥ the walled band (data-driven, tuning table
   `TOWN_CARTOGRAPHY_TUNING`, same shape as SETTLEMENT_LIFECYCLE_TUNING).
3. **Ward stage** — partition enclosed regions; assign ward kinds from engine truth
   (market ward at route confluence, temple ward from faith, industry wards DOWNWIND /
   DOWNRIVER of the wind/flow rasters, poor wards from prosperity distribution) — flavor
   logic is authored tables, not prose.
4. **Parcel stage** — carve block edges into parcels (ward-density bands per tier);
   institutionAssignment upgrades from glyph-anchor to parcel binding (the existing
   module is the seam — extended, not replaced).
5. **Building stage** — footprint packing per parcel; institutions first (catalog-driven
   footprint classes), population-derived dwelling fill after; age01 from history/urban
   fabric; condition from stressors/war state.
6. **Dress stage** — groundDress + ageOverlay extended to the new layers; lynchRubric
   scores the result (legibility floor is a GATE, not a hope: a map under the rubric
   floor re-rolls its lane substreams deterministically — bounded retries, seeded).

Purity: no stage reads the store, the clock, or the party (endogeneity holds — the map
observes the world, never the players).

## 5. PULSE REACTIVITY (the living map)

The pulse never mutates cartography directly. Consequences write typed facts (already
mostly extant: urbanFabric deltas, siege/occupation state, lifecycle events, tier
changes); the NEXT manifest compile derives the visible change (burned condition, new
ward growth ring, satellite appearing, remnant greying). One direction only:
`pulse facts → manifest compile → paint`. The ageOverlay precedent generalizes: the map's
memory IS the settlement's recorded history, so a rebuilt manifest at tick T is
byte-identical for byte-identical history — replay-safe cartography for free.

## 6. THE PAINTER (renderer layer)

- SVG-first (crisp print/PDF/zoom; the export lane's strength), rasterized through
  deterministicPng for byte-contract PNG artifacts; palette through sceneExportPalette's
  discipline + bespokeStyles for the color language (authored tone tables per ward kind,
  tier, biome — the "colors" half of the owner's ask is an authored palette program, and
  taste iterates in data, not code).
- Audience variants ride the existing seam: player-safe map omits covert structures BY
  PROJECTION (never by paint-time filtering).
- Interaction: parcel hit-map → institution dossier → interior (DOOR 3 mount seam,
  publicSafe threaded per its wiring law). Keyboard-navigable structure list mirrors the
  map (a11y: the map is never the only path to a fact — legibility law).
- LOD: three bands (settlement overview / ward / parcel) reusing TOWN_SCENE_LOD_FAMILIES;
  metropolis budgets via worker synthesis + per-band culling.

## 7. DETERMINISM + PERFORMANCE CONTRACTS

- Golden corpus: seed × tier × terrain × route matrix of manifest digests (stableSceneDigest)
  PLUS rendered-PNG hashes for a pinned subset (deterministicPng makes this host-stable).
- Synthesis runs in the townScene worker lane (compile input byte cap respected; the
  262KB-in-worker precedent); first-paint cost ZERO (lazy leaf; the budget is at 4.5KB
  margin — nothing here goes eager).
- Bounded work: every stage carries hard iteration caps (space colonization and packing
  are the rabbit holes — caps + rubric-gated deterministic re-rolls, never open-ended
  search). Target: town-tier synthesis < 250ms in-worker on the reference machine;
  metropolis < 2s with progressive ward streaming.

## 8. SHIPPING SHAPE

Dark virtual flag `townCartographyEnabled` (absent from DEFAULT_SIMULATION_RULES — though
this is presentation-side, the flag gates manifest layer emission, so dormancy = absent
layers = byte-identical manifests, golden-pinned). Promotion to default follows the
TOWN_SCENE_PROMOTION_CONTRACT pattern: local matrix, rendered matrix, device evidence,
a11y evidence, the owner's eye, field soak. The 2D plan remains the permanent fallback
post-promotion; the Watabou iframe retires only at promotion.

## 9. SLICES (each: dark, gated, one commit, full gate, ledger row)

- **TC-1 contract:** manifest schema extension + closed vocabularies + digest/golden
  scaffolding + dormancy pins. (The keystone; everything else is additive.)
- **TC-2 skeleton:** field + street synthesis + walls/gates/bridges + iteration caps +
  determinism corpus.
- **TC-3 wards+parcels:** partition, ward-kind assignment tables, parcel carving,
  institutionAssignment parcel binding.
- **TC-4 buildings:** footprint packing, dwelling fill, age/condition derivation.
- **TC-5 painter:** SVG renderer + palette program + audience variants + PNG goldens.
- **TC-6 joins:** hit-map → dossier → interior chain; a11y structure list; fog
  integration.
- **TC-7 reactivity:** pulse-fact derivations (fabric growth, war damage, lifecycle,
  seasons) + replay-safety pins.
- **TC-8 exports+promotion:** PDF/gallery/OG/Foundry lanes + promotion contract JSON +
  the evidence program.

## 10. RISKS, HONESTLY

- **Aesthetic bar** (highest): Watabou is a decade of taste. Mitigation: palette/tables
  in data for cheap iteration, lynchRubric as a floor, rendered-matrix + owner-eye gates,
  and the explicit permission to ship at "handsome" and iterate to "beloved."
- **Geometry rabbit holes:** capped iterations + rubric-gated seeded re-rolls; integer
  robustness from day one (the interiors lesson).
- **Scope creep toward GIS:** simplicity-over-fidelity is a product law; the rubric floor
  is also a CEILING review — a map that needs a legend to read has failed.
- **Metropolis perf:** worker + LOD + streaming; budgeted in TC-2 before beauty in TC-5.
- **User cartography vs regen:** solved structurally in TC-1 (provenance on every layer)
  or not at all — this is the program's write-that-ghosts hazard and it is pre-committed,
  not deferred.

## 11. DEFERRED (recorded, not bugs to re-find)

- Hand-editing of streets/wards (user cartography verbs) — after TC-8; requires the
  command-spine treatment (CREATE_ROUTE precedent from directive 3).
- Named-map styles marketplace (custom palette packs through custom-content) — after
  promotion; the manifest/palette split makes it cheap later.
- Interior-driven exterior detail (doors/windows from DOOR 3 footprints) — after DOOR 3
  wiring.
