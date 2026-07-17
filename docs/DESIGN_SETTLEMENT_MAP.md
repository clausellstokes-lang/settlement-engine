# DESIGN — THE SETTLEMENT MAP (library-scoped V1)
## Fable 5, 2026-07-14 — commissioned by the owner ("design out the living settlement map piece and place it now appropriately"); grounded by a 7-agent read-only recon of the actual surfaces (dossier data, library UI, map tech, edit lifecycle, tier seams, house law, PDF pipeline)
### Status: DESIGN FROZEN, not built. Placement: display-lane waves SM-1..SM-3 parallel to the E-family; SM-4 near endgame. The deep campaign-evolving map (persistent scarring history) remains the owner's parked last thing.

---

## 0. THE OWNER'S DIRECTIVES (2026-07-14, verbatim constraints)

1. "I want the settlement map to only be viewed in the library."
2. "When viewing a settlement from the library, above the dossier there should be a toggle to
   switch between the dossier and the map."
3. "The map itself is interactable, if you move the cursor over a building, it should show what
   institution that building or buildings or district (such as is the case for lodging district
   for cities as an example)."
4. "It should also have basic editable options."
5. "But it is tied explicitly to the dossier — if one is impacted, so is the other."

Constraint 5 resolves the hardest question this feature ever had. It forbids a second truth
store. Everything below follows from taking it literally.

---

## 1. THE TRUTH MODEL — one law, everything else is corollary

**The dossier (the settlement object) is the only truth. The map is a pure, deterministic,
view-time projection of it.** `buildTownMapModel(settlement, mapEdits) → renderModel`, computed
when the Map pane opens, never persisted as geometry, never computed inside the generation
pipeline.

Corollaries, each load-bearing:

- **Mutual consistency is free, not enforced.** The map derives from the same settlement object
  the dossier renders — an event that razes an institution, a rename, a regenSection, a
  world-pulse tick on a canon member: the blob changes, the map re-derives, the two can never
  disagree. There is no sync protocol because there is nothing to sync.
- **Same-seed byte-identity is untouched.** The generator golden hashes
  `sha256(JSON.stringify(settlement))` over 187 pinned configs; a map computed in the pipeline or
  persisted onto the settlement would flip all 187 (owner-gated regen). View-time derivation
  costs zero golden shift.
- **Version-history revert, undoLastEvent, import, export all work on day one** — they operate
  on the blob, the map is a function of the blob.
- **The "living" in living map = re-derivation.** A canon campaign member's blob is rewritten by
  the world-pulse; the library map of that settlement shows the changed world on next open —
  hazard overlays from `activeConditions` + `mapProfile.hazardMarkers` (fire, plague, flood on
  the districts they struck). That is V1's whole living story. Persistent visual scarring
  *history* (the burned quarter that stays scarred after the condition clears, the boom district
  that visibly grew) is the deep version — **still the parked last thing, unchanged ruling.**

## 2. WHAT THE MAP DRAWS FROM (all of it already exists — recon-confirmed)

| Need | Existing source |
|---|---|
| Districts | `settlement.spatialLayout.quarters` (every settlement, regenerated per run from the final roster) enriched by `deriveAllDistricts` → category (12-enum), wealth, safety, dominantFaction, hook |
| Buildings | `settlement.institutions` — identity anchor `catalogId` (regen-stable slug) for catalog entries, `localUid` for custom, name-slug fallback |
| Terrain | `resolveTerrain(config)` — the ONE sanctioned read; plains/hills/forest/riverside/coastal/mountain/desert |
| Water/roads | `ctx.tradeRoute` ∈ crossroads/river/port/road/isolated (no geometry fields exist — the map synthesizes geometry from the class) |
| Walls/gates | `defenseProfileHasWalls()` (the hardened predicate — never re-implement; the phantom-wharf substring bug class) + `defenseProfile.institutions` buckets |
| Map hints | `deriveMapProfile(settlement)` — roadImportance, defensiveTerrain, hazardMarkers, suggestedFeatures. Purpose-built for exactly this consumer |
| Size/tier | `popToTier` / TIER_ORDER (thorp→metropolis) |
| Shared facts | `deriveDossierViewModel` — badges/labels read the same derivation the dossier, PDF, and AI read, so surfaces cannot drift |
| Hover content | `resolveInstitutionByName` + `deriveInstitutionProfile` → the existing InstitutionCard popover — **the map tooltip IS the dossier's own popover**, dossier-parity by construction |
| Seed | `settlement._seed` → `createPRNG(`${_seed}::town-map:v1`)` — the house fork idiom, zero pipeline draws disturbed |

One genuinely new derivation is required: **a total, deterministic institution→district
assignment.** `districtProfile`'s fuzzy name-stem matcher leaves most institutions unassigned
(fine for prose, fatal for a map where every building must stand somewhere). The map model gets
its own assigner — category→district-category affinity table, codepoint-sorted tie-breaks,
seeded fork for residual placement — living in the map model, NOT patched into districtProfile
(dossier behavior stays untouched). Quarter-less thorps/hamlets floor to a building-scatter
hamlet cluster (recon: small tiers frequently trigger zero quarters).

## 3. DETERMINISTIC SYNTHESIS (the geometry)

`src/domain/townMap/townMapModel.js` — domain placement deliberate: purity-banned (no
Date/Math.random/localeCompare — eslint + source-scan pins), any-cast baseline 0 for new files,
headless-testable. Pure function; explicit rng parameter (rngContext fails closed — never
ambient).

Synthesis order (all draws from the single `::town-map:v1` fork, iteration codepoint-sorted):
1. **Frame** — terrain edge (river course for riverside, coastline for coastal/port), approach
   roads by tradeRoute class, weighted by `mapProfile.roadImportance`.
2. **Skeleton** — street graph seeded from an anchor (market square / crossroads / water gate per
   tradeAccess), organic-radial at low tiers, denser grid fragments at city+.
3. **Districts** — quarter blocks partitioned along the skeleton; category drives placement
   priors (Waterfront hugs water, Noxious Trades downwind/edge, Government central, Shadows
   periphery — the quarters' own `location` prose already asserts these; the geometry honors it).
4. **Buildings** — every institution placed via the total assigner; singular institutions render
   as individual landmark buildings at ALL tiers; aggregate categories (lodging, residential)
   render as district fill at city/metropolis and individual buildings below (the owner's
   lodging-district example, inverted correctly for small tiers).
5. **Fortifications** — wall polygon + gates iff `defenseProfileHasWalls`; readiness label styles
   the wall weight.
6. **Overlays** — hazardMarkers + activeConditions → district-level condition badges (the living
   layer).

The model stamps version axes (`townMapGeometryVersion: 1`) + reserved-null slots (the
spatialDigest exemplar) so later geometry improvements are declared, not silent. **Layout
changes when the roster changes** — that is correct behavior (the map follows the dossier), and
anchor-keyed cosmetic edits (§5) survive because they key on catalogId/localUid, not coordinates.

## 4. THE VIEWER

- **Mount:** `SettlementDetail.jsx`, between the toolbar band and the body — a
  `primitives/Segmented.jsx` [Dossier | Map] control (the canonical pill, aria-pressed).
  **Never inside OutputContainer** — that component renders three surfaces (generate wizard,
  library, public gallery) and mounting there leaks the map to all of them. Library-scoped means
  SettlementDetail is the only mount. Gallery/PDF exposure is a deliberate later opt-in (§6).
- **Chunk:** the map pane is `lazy(() => import(...))` per the dossierLazyTabs idiom. **The
  first-paint margin is 77 bytes** — everything is lazy, zero new eager imports, zero lucide
  icons (IconsContext defaults off; the map renders its own pure-vector glyphs), and the wave
  battery must include an EMPIRICAL dist build: the FP-R precedent shows minting a new chunk can
  leak ~37 B into the entry preload map. Fallback if it does: static import inside the
  already-lazy settlements chunk (zero entry cost by construction).
- **Camera:** clone MapOverlay's image-mode branch (self-owned pointer pan, wheel zoom-at-cursor
  clamp, direct `<g>`-transform mutation, no per-frame React re-render). No FMG iframe, no
  bridge — the bridge doesn't exist outside WorldMap and never will here.
- **Hover:** HitLayer's getScreenCTM math; building hover → InstitutionCard popover via
  `deriveInstitutionProfile` (honesty-gated, deity-safe by authorship); district hover → district
  card from `deriveAllDistricts` (wealth/safety/dominantFaction/institution list). Click →
  pinned card (QuickInspector two-tier precedent). "Open in dossier" on the card defers to a
  later controlled-tab seam (OutputContainer.activeTab is internal state today; V1 does not
  fight it).
- **Mobile:** view + hover work (pan/zoom is touch-native in the cloned camera); edit affordances
  desktop-only. (Realm map blocks mobile entirely; the town map is far lighter — no iframe.)
- **Pure vector throughout** — no `<image href>`: keeps future canvas rasterization
  (thumb/share) taint-free.

## 5. EDITS — two classes, one writer

**Class A — cosmetic (map-native, V1):** building/district position nudges, label
show/hide, compass/legend preferences, and **layout variant reroll** (bump `layoutVariant`, an
integer salt appended to the fork key — same settlement, different deterministic arrangement).
Stored in a **`settlement.mapEdits` container inside the blob**:

- Zero migration: normalizeSettlement passes unknown keys through (explicit forward-compat
  contract); step-4 container defaulting on read.
- **Absent ⇒ byte-identical** (dormancy law): the pipeline NEVER stamps it; written only on
  first user edit; every reader treats absent as exactly-prior behavior.
- Free lifecycle correctness: blob-resident means snapshot/revert, undoLastEvent, export/import,
  and clone all carry it with the dossier they belong to — map state time-travels WITH the
  dossier, which is precisely constraint 5.
- Deltas keyed by stable anchors (`catalogId` / `localUid` / district id), deterministic FNV ids
  (the pendingEdits lesson: never Math.random in persisted state), dangling deltas dropped
  gracefully on roster drift (pinned by test).
- **Key-naming trap (recon catch, load-bearing):** PRIVATE_KEY_RE denylists unanchored
  substrings `seed`, `hook`, `compass`, `chronicle`, `secret`, `private` — a nested
  `layoutSeed` or `hooks` key would be SILENTLY STRIPPED from every public projection. The
  container schema uses `layoutVariant`, `pins`, `legendPrefs` — a lint-style guard test pins
  that no mapEdits key matches PRIVATE_KEY_RE.
- **Persistence at the action** (the applyEvent triple: stamp editedAt → updateSavedSettlement →
  persistSaveUpdate). Recon CONFIRMED the applyUserEditAction/renameNPC persist gap is live
  (store-only mutation; edits ghost on reload until some other action persists) — the map does
  NOT replicate that pattern, and the gap itself is surfaced to the owner as a standing bug.
- Public projection: top-level `settlement.mapEdits` is fail-closed DROPPED from gallery by the
  allowlist — the correct default for a library-only surface. Never home it in `config`
  (config's subtree is denylist-only and would leak it).
- Undo: rides the existing blob undo surfaces V1 (no separate map undo stack).

**Class B — substantive (never map-native):** anything that changes a FACT — rename an
institution, add/remove one, change a district's composition — is executed through the EXISTING
dossier ops (event pipeline / rename ops / userEdits), reached from the map via an "edit in
dossier" affordance on the hover card. The map never mints a second write path to canon.
"If one is impacted, so is the other" holds because there is only one thing to impact.

**Gates:** map cosmetic editing rides the same `canEdit` flag SettlementDetail already uses;
viewing is free at every tier (dossier parity). Canon policy: cosmetic-always (the
renameSettlement lane — cosmetics touch no canon fact), guarded at the store action, not just
the UI. Tier NEVER touches derivation (law 3): identical layout for every tier at the same seed.

## 6. SEAMS (tier, sanitize, budget, export)

- **Deity law, stated precisely (recon's sharpest finding):** the invariant is **dossier↔map
  PARITY, not deity-name suppression.** Free/anon settlements contain no deity names by
  construction (latent pantheon never activated); activated premium embeds legitimately show
  deity-named temples in the dossier — the map shows exactly what the co-rendered dossier
  shows, no more, because its tooltip model IS the dossier's popover model, derived from the
  same projected object the surrounding view renders. The map inspector never reads
  `config.latentPantheon` (the faithPanelModel constitutional rule) and never reads raw store
  state in a projected context.
- **Gallery (later, opt-in):** exposure = PUBLIC_TOPLEVEL_KEYS change + SQL sanitizer twin
  migration + the character-identical contract tests — a deliberate coupled owner-gated step,
  designed-for but not shipped in V1.
- **PDF plate (SM-4):** vector Svg plate (react-pdf 4.5.1 ships primitives; unprecedented in
  src/pdf — a spike validates the subset first). Constraints mapped: worker graph must stay
  dynamic-import-free, props structured-cloneable, sections render in node (no DOM/canvas at
  render time — pure data→Svg is safe), ASCII-only strings (fontGlyphCoverage), FaithWar-style
  self-gate (absent map data ⇒ chapter renders nothing ⇒ legacy exports byte-identical), kept
  out of lean variants (page-count relation pin). Rides the existing export entitlement ladder
  untouched ($2.99 / premium).
- **Library-card thumbnail (SM-4, owner-gated):** the serialize→canvas→JPEG pattern works
  standalone (no bridge); storage home is a new persistence surface = owner decision.
- **Analytics:** enrich existing events' props (map_viewed rides the reopened/viewed seam) —
  zero new event names, per the analytics-seam doctrine.

## 7. THE MANIFEST + BATTERY (how it stays honest)

- **New golden surface, additively:** `tests/property/townMapGolden.test.js` +
  `tests/fixtures/town-map-golden.json` per the spatialDigest fail-closed template — a small
  dedicated corpus (~18 configs spanning tier×terrain×walls×water, NOT the 187 — cost), hash +
  legible meta (building/district counts, version axes), same-build reproducibility test,
  anti-vacuity test, UPDATE_GOLDEN=1 capture.
- **Parity pins:** every institution appears exactly once (total assignment); hover model ===
  dossier popover model for the same institution; conditions overlay ⊆ activeConditions;
  publicSafe round-trip (map model built from a projected settlement contains nothing the
  projection dropped).
- **Lifecycle pins:** mapEdits survives save→load, export→import, snapshot→revert, undo;
  dangling-anchor drop; absent-container byte-identity; **the world-pulse blob-preservation
  trace** (§8) as its own pin.
- **Budget:** full dist build + VERIFY_DIST in every SM battery (the build-less blind spot class
  is documented); entry-closure assertion that the town-map chunk is ABSENT (the vendor-pdf
  absence test is the copyable shape).

## 8. PRE-BUILD VERIFICATION GATES (must run before SM-1 code)

1. **World-pulse blob preservation:** verify the pulse's mutateWorld/reconcile chain preserves
   unknown top-level settlement keys byte-for-byte when rewriting canon members — UNVERIFIED at
   design time; if it strips, the mapEdits home moves (or the chain gets a preserve guarantee +
   pin) BEFORE any edit code lands.
2. **Chunk-mint cost:** empirical build measuring the lazy map chunk's entry-preload leak
   against the 77 B margin; decides own-chunk vs settlements-chunk placement.

### VERDICTS (recorded at SM-1, 2026-07-14 — both gates RUN before the SM-1 code landed)

1. **World-pulse blob preservation → PRESERVES (blocksSM3: NO).** The canon-member rewrite chain
   was traced end-to-end (`simulateCampaignWorldPulse` → `advanceTime`/`applyFactionDeltasToSettlement`
   → the food/blockade/corruption passes → `applyWorldPulseOutcomes` → `applyOutcomeToSettlement`
   → faction/religion projection → a final `deepClone`) — every hop is an identity pass-through, a
   `{ ...settlement, <changed field> }` spread, or a deep clone. There is **no allowlist
   reconstruction** anywhere, and `advanceCampaignWorld` adds no normalize/serialize re-narrow, so an
   unknown top-level key survives byte-for-byte across single and repeated ticks. `settlement.mapEdits`
   is therefore a SAFE storage home for the world-pulse tick — SM-3 does not need to move it or add a
   preserve guarantee. (`normalizeSettlement` also spreads `{ ...settlement }`, preserving unknown keys
   at the save/load boundary; the PUBLIC/gallery projection deliberately DROPS top-level `mapEdits` via
   the `PUBLIC_TOPLEVEL_KEYS` allowlist — correct for a library-only surface.) **Pinned by**
   `tests/domain/worldPulseBlobPreservation.test.js` (4 tests, incl. an anti-vacuity guard proving the
   member is really rewritten into a different blob while the unknown keys still survive — preservation
   is not an identity-pass artifact). Independently re-traced by the manager; the pin's verdict and the
   trace agree.
2. **Chunk-mint cost → ZERO EAGER DELTA at SM-1.** SM-1 mints no chunk and is imported by NOTHING
   eager — `src/domain/townMap/**` is reached only by the three test files and (later) the lazy SM-2
   viewer pane. Empirical (real `npm run build`): the pre-SM-1 first-paint static closure was
   **1,216,273 B** (7 chunks, 77 B under the 1,216,350 budget); the post-SM-1 closure is **1,216,273 B**
   — **byte-identical, delta 0** — and `townMap` appears in NO dist chunk at all (fully tree-shaken).
   The ~37 B entry-preload leak the FP-R precedent warns about is a property of MINTING a lazy chunk;
   that measurement is owed at **SM-2** when the viewer chunk is actually created (own-chunk vs
   settlements-chunk decision resolves there). `verify:dist` green.

## 9. WAVES + PLACEMENT

- **SM-1 — the model:** townMapModel + total assigner + anchors + version axes; golden manifest
  + purity + reproducibility; gates §8. (Engine-untouching; zero eager bytes.)
- **SM-2 — the viewer:** Segmented toggle in SettlementDetail, lazy pane, camera, hover/click
  inspectors, condition overlays, mobile posture; budget proof with real build.
- **SM-3 — the edits:** mapEdits container + cosmetic ops with the persist triple; layout
  variant reroll; gates (canEdit, canon-cosmetic, tier-neutral derivation); lifecycle pin
  battery; PRIVATE_KEY_RE naming guard.
- **SM-4 — export surfaces (near endgame):** PDF vector plate (spike first), library-card thumb
  (owner-gated storage), gallery opt-in (owner-gated coupled change).

**Placement in the master sequence:** after the owed-work block (A-wave analytics → numeric
prices → drain-path/wallClockNow → Track K), SM-1..3 run as a **display lane in parallel with
the E-family engine lane** (E0 governor → E1 generosity → W-PEACE → W-DOCTRINE) — zero file
overlap, zero engine coupling, and the owner runs parallel sessions as a matter of course. Both
lanes complete before Surveyor (S5 settlement-construction gains a map-aware surface). SM-4
lands with endgame polish. The deep campaign-evolving scarred-history map stays parked last,
per the standing ruling.

## 10. OPEN OWNER DECISIONS (recommendations attached)

1. **Map editing entitlement** — recommend: same `canEdit` gate as dossier editing (premium/
   founder), viewing free everywhere. (Alternative: cosmetic edits free as a delight feature.)
2. **Gallery exposure timing** — recommend: not in V1; ship SM-4's coupled allowlist change only
   when the gallery advantage warrants the sanitizer surface growth.
3. **PDF plate priority** — recommend: SM-4 (near launch, artifact value), not blocking SM-1..3.
4. **The applyUserEditAction persist gap** (pre-existing, recon-CONFIRMED live): fix as its own
   small wave — recommend yes, it is the owner's most-bitten class running in production.

## 11. INCIDENTAL RECON FINDINGS (out of scope, surfaced separately)

- MapOverlay map-icon hover emission is gone on this lineage (QuickInspector's docstring claims
  MapOverlay emits; only SettlementPalette does) — likely a second silent casualty of the same
  wave-4f-2 merge that dropped data-map-overlay-svg. Master-merge reconciliation item.
- `TIER_GATE.mapChains` appears enforced nowhere (canUseMapChains has no consumer;
  ChainEdges.jsx computes with no tier check) — dead gate or missing enforcement; owner ruling.
- The applyUserEditAction/renameNPC persist gap (§10.4).

## 12. TOWN LAYOUT v2 — SOURCED ASYMMETRY (owner refinement, 2026-07-17; corpus entry)

(Amendment note: §11's recon items have since RESOLVED on this lineage — mapChains enforced
at all three affordances, hover emission restored, the persist gap fixed; the program ledger
carries the receipts.)

The v2 commission ("semantic urban planning", program ledger #38) is sharpened from "seeded
irregularity within constraints" to **ASYMMETRY WITH PROVENANCE**: nothing is perfectly
formal and nothing is noise — every deformation has a named cause from the dossier.

- **Three source families:** REGION (terrain/water/slope — water-first morphologies),
  RESOURCES (actual income sources + resource sites pull districts/roads/work-quarters —
  the tannery-downstream exemplar generalized), HABITS (desire paths cutting formal grids,
  market accretion at the gates facing farmland/trade bearings, habitual routes worn
  permanent — derived from institution adjacency + trade-route bearings + high-traffic
  pairs; the inference shapes are implementer JUDGMENTs, vetoable).
- **THE PLAN-RESPONSE LAW:** planned elements read as RESPONSES to asymmetries — walls kink
  to include what matters, grids deform where the stream cuts, squares sit where desire
  paths converge. Plan-around or exploit; never suppress.
- **NO UNIFORM JITTER:** irregularity applies per-cause only, deterministic from the
  `${_seed}::town-map:v2` fork + dossier. Zero-source settlements come out cleanly formal.
- **PROVENANCE RETAINED AS DATA:** the v2 layout model carries per-element
  `{sourceFamily, sourceRef, effect}` annotations (presence-pinned — a deformed element
  without a cause entry fails, which IS the no-uniform-jitter enforcement). Consumed by
  §13(1).
- **Composes with Lynch:** imageability requires distinctive irregularity; sourced asymmetry
  raises rubric scores; conflicts reconcile through the plan-response law and get recorded.

## 13. SM-5 — THE MAP LEGIBILITY WAVE (owner commission, 2026-07-17; corpus entry)

Principle: the map knows more than it tells — surface what is already simulated. Six
deliverables, one lane, serialized behind the v2 fold (shared map-UI files):

1. **THE MAP EXPLAINS ITSELF** — hover provenance rendered from §12's annotations
   (InstitutionCard-hover precedent; Surveyor's-notes register; the whisper laws apply).
2. **THE CHANGE VIEW** — "what changed" mode over fabricRead (prominence shifts, new scars,
   rebuilt blocks since last visit / over N advances) + calamityHistory; graceful empty
   state while fabric is dark pre-regen; the chronicle's spatial twin.
3. **EDGE ANNOTATIONS** — exits labeled to named neighbors with travel time from existing
   neighbour_links/route distance data.
4. **THE ATLAS IDENTITY** — unified lens treatment across realm+town exports (craft
   samples; owner taste veto).
5. **DM PIN/ANNOTATION LAYER** — DM-only vs player-visible markers riding the existing
   handout/reference export split; verify-first against current mapEdits coverage; keys
   dodge PRIVATE_KEY_RE; no new gate class, no schema change.
6. **ACCESSIBILITY LENS** — colorblind-safe/pattern-fill variant via the style schema.

**Coherence matrix (compact):** v2 provenance model (§12, read-only) · fabricRead
(empty-when-dark contract; drift null ≠ 0.5) · chronicle (change view mirrors its beats,
never re-derives) · guidance registry (map whispers registered, one-at-a-time law) ·
neighbour_links/routes (edge annotations read, never write) · style schema (lenses 4→5+,
bounded data-only definitions, THE WALL holds) · mapEdits (pins are cosmetic-class,
denylist-safe, dormancy-lawful) · exports (WYSIWYG law extends: pins honor visibility
split per export audience) · tier gates (untouched; mapChains enforcement unaffected) ·
first-paint (zero eager; map surface lazy by architecture).

## 14. POST-LAUNCH DOORS (designed intent recorded; deliberately NOT built in this tail)

- **Town-scale map→engine coupling** — fire along adjacent buildings, siege damage by wall
  segment, adjacency-shaped rumor/corruption spread. The inverse of the fabric layer
  (engine→map); a genuinely new engine capability class — waits for a corpus reopening
  after launch. Coupling note: would consume the v2 adjacency graph; the engine stays
  LLM-free and tick-deterministic regardless.
- **In-app fog-of-war / session mode** — the launch strategy remains meet-VTTs-where-they-
  are (UVTT pre-walled export); an in-app reveal layer would ride the v2 model + visibility
  split if ever built.
- **Building interiors** — a new scale (keyed interiors); out of scope for the world-only,
  simplicity-over-fidelity charter unless the owner reopens it.
