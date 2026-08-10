# DESIGN — TOWN CARTOGRAPHY (the deterministic MFCG-class settlement map)

## Owner-commissioned architecture, 2026-07-31 ("comprehensively architect it out").
### Status: ACTIVE IMPLEMENTATION. TC-0 through TC-2 are built; TC-3 through TC-8 remain.
### The owner's 2026-08-01 external-implementer order supersedes the earlier hold for
### implementation work. Soak, promotion, and the other owner-physical gates remain held.

> **Progress**
> - 2026-08-01 — TC-0/TC-1/TC-2 completed for WR-0 landing under the owner's renewed
>   implementation order. The dossier Map shell, additive manifest contract, deterministic
>   field/street/defense synthesis, and the REAL compiler mount are present. TC-2 keeps
>   provisional defense geometry synthesis-local and binds only deterministic nearby refs to
>   the canonical TownScene walls/gates/bridges, so no second infrastructure truth crosses the
>   manifest. Landed as `6e96e259`, with the strict-contract/generated-artifact repair in
>   `0dcc3b9d`. Final focused battery: 12 files, 183 passed / 3 distribution-only skips.
>   WR-0 full gate: exit 0 (2,110 files; 22,361 tests, 54 skipped), followed by a green
>   production build and 47-file / 364-test dist verification. TC-3 wards/parcels is the
>   next cartography slice.

> **Current implementation handoff (reconciled 2026-08-09):** this architecture
> supplies intent, not dispatch. Only
> [`implementation/packets/town-cartography/TC-3.md`](./implementation/packets/town-cartography/TC-3.md)
> may authorize TC-3, and only while that packet is marked READY. TC-4 through
> TC-8 remain deliberately uncompiled until TC-3 lands and the tree is re-derived.

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

- **TC-0 shell (buildable NOW, independent of the renderer):** the Map tab sub-tab
  container per §12 — Plan + 3D Portrait + Player View reorganized, lazy pins with the
  second assertion, presence gating, deep links, persisted sub-tab preference.
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

## 11. EXHAUSTIVENESS AMENDMENTS (owner asked "is it exhaustive?" 2026-07-31 — these
## close the audited gaps; each is BINDING on its slice)

- **A-1 Map-edits interplay (TC-1):** `projectMapEditsForScene` already carries user map
  edits into the scene. The new layers join that seam from day one: an edit's provenance
  outranks synthesis (the field/skeleton stages treat user-edited geometry as boundary
  conditions, never overwrite), and the TC-1 provenance model is the SAME vocabulary the
  edit projection already speaks — one edit truth, not two.
- **A-2 Custom content (TC-4):** `customBuildingPresentation.js` exists — custom
  institutions already declare presentation. Parcel binding honors it: custom-content
  footprint classes ride the same closed vocabulary with a declared-else-generic fall
  (THE WALL's grammar, as interiors did for facets). No custom item can inject geometry
  outside the vocabulary.
- **A-3 Byte budget (TC-1):** TOWN_SCENE_COMPILE_INPUT_MAX_BYTES is a live cap. The four
  layers get a per-tier byte budget table in TOWN_CARTOGRAPHY_TUNING, measured at TC-2
  and ratchet-pinned; metropolis fits by parcel-band streaming, not by raising the cap.
- **A-4 Degraded states (TC-5):** synthesis failure, rubric-floor exhaustion, or budget
  overflow degrade DETERMINISTICALLY to the plan view with a visible, honest notice —
  never a blank map, never a silent fallback (the fail-closed display doctrine).
- **A-5 Labels + naming (TC-3):** street/ward names draw from namingData through seeded
  substreams (`carto:names:*`); label placement obeys the legibility rubric; names are
  manifest data (exports/a11y read them), not paint-time decoration.
- **A-6 Satellites + seasons (TC-7):** a satellite thorp gets a MINIATURE of the same
  synthesis (orbit-context field, parent-derived palette), not a bespoke path; seasonal
  paint (seasons rule lit) is a palette modulation in the painter, never a geometry
  change — winter does not move houses.
- **A-7 Property invariants (TC-2, tests):** beyond goldens — planarity (no street
  self-crossings except bridges), parcel containment (footprint ⊂ parcel ⊂ ward),
  audience monotonicity (player manifest ⊆ DM manifest), all as seeded property tests
  over the corpus matrix, anchored per the walker laws.

## 11b. INSTITUTION MULTIPLICITY + COHESION PLACEMENT (owner directive 2026-07-31,
## BINDING: A-8 — governs TC-3 and TC-4)

- **Counts are DOMAIN truth, never painter invention.** A pure seeded derivation
  (`resolveInstitutionMultiplicity`) turns each catalog range ("Craftsmen 5-30") into THE
  canonical count from population-within-tier x economic profile (+ prosperity), seeded
  jitter, clamped to the authored range. Every surface projects it: map footprints,
  dossier prose ("the Craft Ward, seventeen workshops"), exports, Herald growth items.
  An envelope property pins monotonicity: expected count rises with population and
  economic strength (the Wave-A instrument, reused).
- **Cohesion decides the layout, from existing typed facts only** (stressors, alignment,
  religion, economic profile, powers, defense — no new state): a per-institution-class
  cohesion score maps to the CLOSED placement vocabulary
  { district | clustered | dispersed_orderly | dispersed_chaotic }. Strong guild + lawful
  order earns a named ward; corruption/unrest fragments placement with visibly chaotic
  footprint jitter — the settlement's inner state becomes glanceable texture (legibility
  law as cartography).
- **Instance identity is deterministic and APPEND-STABLE** (the NPC positional-id lesson,
  paid for 2026-07-30): growth appends instance N+1, never reindexes 1..N; user anchors
  (map edits, future interiors) survive recompile by construction.
- **v1 is presentation-canonical, engine-inert:** resolved counts derive FROM engine
  facts but do not feed economy/services math — zero golden shift, dormancy intact.
  Promoting counts into engine math is a recorded FUTURE owner-gated tuning decision.

## 11c. FULL COLOR IN THE HOUSE VOICE (owner directive 2026-07-31, BINDING: A-9 —
## governs TC-5)

The painter is FULL COLOR in the Watabou/FTG genre — ward tones, water, green space,
roofs, walls — but every color derives from `src/design/tokens.js`: a cartography palette
FAMILY extends the canonical tokens (muted house register), never a foreign color world.
Rules: Watabou/FTG define the color ROLES and their relationships (what gets tone, what
recedes, how water/green anchor the page); the tokens define the VALUES. Light/dark/print
coherence rides the token system for free. The palette lives in data (bespokeStyles +
sceneExportPalette discipline) so taste iterates without code. The visual-budget lint
rules (no-raw-color) apply to the painter like any surface — the map cannot smuggle hex.

## 11d. URBAN MORPHOLOGY LAW (owner directive 2026-07-31, BINDING: A-10 — governs
## TC-2..TC-5; "comprehensively cohesive to everything")

The full determination chain, each layer answering only to the one above it:

1. **STATE decides order vs chaos** (A-8 cohesion: stressors, alignment, law, corruption
   → district/clustered/dispersed_orderly/dispersed_chaotic).
2. **PROMINENCE decides space:** parcel area scales with power rank, economic
   contribution (an institution carrying the economy earns grounds), and faith-deity
   alignment (the aligned deity's temple takes a precinct on a node; contested faith
   scatters competing shrines). A closed prominence ladder in TOWN_CARTOGRAPHY_TUNING —
   authored bands, seeded jitter, never free-form.
3. **LYNCH decides structure:** the five elements are the synthesis targets — paths
   (streets), edges (walls/waterfronts), districts (wards), nodes (plazas/gates/market
   confluences), landmarks (prominent institutions) — and `lynchRubric` graduates from
   taste-gate to STRUCTURAL GRAMMAR: the skeleton/ward stages aim at the rubric's
   elements; the gate verifies the aim. Higher-order urban design is referenced through
   this one instrument, not scattered citations.
4. **WATABOU/FTG decide feel** (owner partiality, standing): organic-first geometry;
   grid cores ONLY where a planned era earns them (planning maturity derived from age +
   law + power stability — an authored table, engine facts only); the hand-drawn warmth
   is the rendering register, never overruled by theory.
5. **TOKENS decide color** (A-9).

Cohesion guarantee: every input in this chain is an existing typed engine fact; no layer
invents truth; the chain is total (every ward/parcel/building decision traces to exactly
one layer) — pinned by a TC-3 property test that walks a compiled manifest and asserts
each element carries its deciding-layer provenance tag.

## 11e. SKINS + USER/AI EDITING CONTROLS (owner directive 2026-07-31, BINDING: A-11 —
## governs TC-5/TC-6; substrate for the deferred styles marketplace)

- **A skin is data, never geometry:** a named override of the cartography palette FAMILY
  plus closed style knobs (ward tone intensity, label density, roof/wall style set,
  ground dress weight...). Skins repaint the SAME manifest — switching skins can never
  move a house, and every skin remains token-derived (A-9), so even user skins stay in
  the muted house register's gamut.
- **Basic controls, closed vocabulary:** every knob is an enumerated or banded value in
  the manifest's style block — no free-form hex, no arbitrary geometry input. The
  no-raw-color lint law extends to skin definitions.
- **AI editing obeys the FINITE-SEMANTICS LAW:** the AI is a bucketing clerk — it may
  MAP a user's intent ("weathered coastal fishing town") onto the SAME closed control
  values a human could set, and nothing else. No AI-emitted colors, no AI-emitted
  geometry, ever. AI-set controls carry ai-suggested provenance and are one-tap
  revertible.
- **Geometry editing stays in the existing edit seam (A-1):** user street/ward edits are
  the provenance-guarded map-edit vocabulary, deferred to post-TC-8 as recorded — skins
  do not reopen that door early.

## 12. THE DOSSIER MAP TAB — SUB-TAB SHELL (owner directive 2026-07-31, BINDING: J-TC-8)

The dossier's Map tab becomes a CONTAINER with one sub-tab per settlement map
presentation, each an audience-gated lazy leaf under the existing `new/tabs/` discipline:

  Map ▸ [ Plan | Illustrated (this program, flag-gated) | 3D Portrait (opt-in flag) |
          Player View (fog/audience projection) ]

Rules: sub-tab PRESENCE is audience- and flag-gated exactly like sibling dossier tabs
(absent, not disabled, when dark — the ai_notes presence lesson); each sub-tab is its own
lazy chunk with a build pin (the 5-layer *Lazy.test.js recipe; the parent Map tab is
itself lazy, so every pin carries the SECOND assertion per the lazy-parent lesson); Plan
remains first and default; deep-links address sub-tabs through the routes table; the
shell ships EARLY as **TC-0** (Plan + 3D + Player View reorganized under the container
now, Illustrated joining at TC-5) so the UI restructure is proven long before the new
renderer lands. State: one selected-sub-tab display preference, persisted per the
display-preference partialize rules.

## 13. DEFERRED (recorded, not bugs to re-find)

- Hand-editing of streets/wards (user cartography verbs) — after TC-8; requires the
  command-spine treatment (CREATE_ROUTE precedent from directive 3).
- Named-map styles marketplace (custom palette packs through custom-content) — after
  promotion; the manifest/palette split makes it cheap later.
- Interior-driven exterior detail (doors/windows from DOOR 3 footprints) — after DOOR 3
  wiring.
