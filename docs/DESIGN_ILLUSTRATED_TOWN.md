# DESIGN — THE ILLUSTRATED TOWN
### The cartographer's art layer + the skin registry (owner-commissioned 2026-07-18)

**The commission (owner, verbatim spine):** the settlement map "lacks any art to
represent background and terrain or season… too plain… not designed to look like a
cartographer's illustration of a town… I would like it if it had some 3-D effects…
i don't want simple blocks and squares and circles but actual detail of a church, a
mill, etc." Plus, first-class: "note for reskins or other things through AI as we
have built it out if they want to change something or even the genre and building
skins for it." Layout is ruled GOOD ("for what it is, the layout works") — this wave
is presentation + the skin system, never geometry.

**Ratified direction:** the BIRD'S-FLIGHT idiom (Braun & Hogenberg / Speed):
planimetric street truth + buildings drawn as small oblique elevations. NO literal
WebGL 3D (rejected: house style, cost, determinism risk). Recon receipts:
scratchpad recon-{render,aiSeam,liveState,exports}.md; all file:line anchors below
verified on claude/the-composite @ 78a04afc.

---

## §0 THE LAWS THIS WAVE LIVES UNDER (all pre-existing; violations = defects)
1. **Truth-projection:** style edits DISPLAY, never SUBSTANCE. Geometry comes frozen
   from `buildTownMapModel`/`buildTownLayoutV2` (0..1000 space, `${seed}::town-map:*`
   forks). render = f(model, style), byte-identical per (seed, style).
2. **THE WALL** (townMapStyleWall.js:53): a style SELECTS from bounded vocabularies —
   hex, bounded numerics, fixed kind-sets — never arbitrary SVG/code/raster/geometry.
   Worst-case ugly, never unsafe. This wave EXTENDS the whitelist; it never bypasses.
3. **Dormancy:** absent input ⇒ empty ops ⇒ byte-identical prior output. Every new
   mapEdits key omits its default (normalizeMapEdits drop-when-empty), dodges
   PRIVATE_KEY_RE, joins MAP_EDITS_SCHEMA_KEYS + the naming-trap test.
4. **Purity** (src/domain/townMap source-scan): no Date, no Math.random, no
   localeCompare, no trig in model code. All variation seeded (createPRNG off stable
   ids), codepoint-sorted.
5. **One geometry, many renderers:** the 5-op draw list (poly|line|circle|rect|path,
   townMapDraw.js:52-61) feeds SVG string, react-pdf plate, thumbnail, panorama.
   **DECISION (load-bearing): glyphs COMPILE DOWN to the existing five op kinds** —
   no new op kind, zero adapter surgery, react-pdf renders automatically, raster
   export stays taint-free. The glyph library is DATA that emits primitive ops.
6. **Self-contained SVG:** no external refs/images/fonts (canvas-taint contract),
   no gradients/filters (already barred).
7. **Lazy + capped:** every new module is a lazy leaf + re-export (townMapLazy pin;
   SettlementMapPane is max-lines-capped); zero eager first-paint bytes.
8. **Pattern-not-colour** holds wherever the accessible lens must read a mark.
9. **A11y/interaction:** all static art layers render `pointerEvents:'none'` UNDER
   the interactive district/building/condition/hazard layers; fog stays last child.

---

## §1 THE GLYPH LAYER — buildings stop being 8px rects
Today every institution is an identical 16×16 rounded rect tinted by district
category (townMapDraw.js:279-284); no building TYPE reaches the draw layer.

- **Model threading (new contract surface):** thread a `glyphKind` onto each
  building entry in the model, derived in townMapModel/institutionAssignment from
  the institution's identity: exact matches first (church/temple→`spire`,
  mill→`wheelhouse`, smithy→`forge`, inn/tavern→`signpost-house`, keep/garrison→
  `towered-keep`, market→`stall-rows`, granary→`gambrel-store`, docks→`quay-shed`,
  shrine→`small-spire`…), then category defaults, then seeded house variants
  (`house-a/b/c`) for fill mass. The mapping table is DATA
  (src/domain/townMap/glyphAssign.js) keyed off the PINNED 12-category vocabulary —
  update every inline category pin (≥7 files, urbanFabricKernel.js:163-172 rule).
- **The glyph library** (src/design/townGlyphs/…, data modules): each glyph = a
  named list of primitive strokes in a local 0..1 box (ridgelines, gables, the
  spire, the wheel), drawn in OBLIQUE ELEVATION (front + hint of side + roof — the
  bird's-flight convention). A compiler places/scales/rotates and emits plain ops.
  Seeded variant + mirror per building id. Landmark buildings render full glyphs;
  district fill-mass at high density renders simplified massing rows (the LOD rule)
  so a metropolis doesn't explode the op count.
- **Depth, the surveyor's way:** ONE fixed light (NW). Each glyph emits an
  ink-hatch shadow group (2-3 short strokes SE of the footprint, opacity from
  `style.opacity.shadow`). Relief = hachure runs on the v2 landform flank (existing
  vocabulary) + wall shadows. No gradients ever.
- **Perf guard (new test):** op-count ceiling per map (assert ≤ ~2,200 ops on the
  largest golden metropolis; current base is ~58-71 nodes — the guard exists so the
  explosion class is caught, tests/design/townMapOpBudget.test.js).

## §2 GROUND DRESS — the parchment stops being empty
Extends the proven landform mark idiom (dot/stroke/curve, pattern-not-colour) from
"special features" to the whole ground plane, emitted by a new pure
`groundDressOps(model, style, dressSeed)`:
- field furrows in the farm belt (line groups aligned to approach roads), tree-glyph
  stipples for woods margins, water ripple curves along coast/river, meadow dotting,
  path-side hedge ticks. Densities from `style.opacity/stroke.dress` (bounded).
- **v1 COVERAGE (red-flag cure):** frame.landform is v2-only, but ground dress
  derives ONLY from features present in BOTH models (coast, river, districts,
  approach roads, wall ring) — every EXISTING v1 settlement gets dressed. v2's
  landform adds marsh/dune/flank enrichment on top.
- Dress is part of the `illustrated` lens (not a flag): other lenses' bytes
  untouched.

## §3 SEASON + STATE DRESS — the portrait of the town NOW
- **Season source (red-flag cure):** season lives on
  `campaign.worldState.calendar.season` (RealmStrip.jsx:95-101 read pattern), NOT on
  the settlement. Thread an OPTIONAL `worldCalendar` prop through
  pane/export/PDF call sites; standalone surfaces (library detail w/o campaign,
  gallery) pass null ⇒ seasonless base bytes (dormancy law).
- Season variants are dress-parameter swaps, not new geometry: winter = snow
  stipple + bare-tree variant + muted field furrows; autumn = harvest-striped
  furrows; spring/summer = full trees, meadow dots. Hard-winter/drought severity
  re-derives via `seasonalSeverityFor(worldState.rngSeed, year, settlementId)`
  (seasons.js:128) when a campaign is present — never stored on the settlement.
- **State dress** (all from existing reads, all dormant-absent): siege works ring
  glyphs when the settlement is besieged (war-state selector); scar hatching on
  districts the urban-fabric mirror marks scarred (fabricRead — dark mirror ⇒
  empty); construction scaffold ticks on rebirth sites. Optional per-settlement
  `seasonOverride` mapEdits key (null default, PRIVATE_KEY_RE-checked) so a DM can
  pin "this map is the winter map."

## §4 THE `illustrated` LENS — how it ships
- A SIXTH base lens id `illustrated` in TOWN_MAP_STYLE_IDS: a data object like the
  other five PLUS the new bounded fields (`glyphSet`, dress/shadow params). The
  existing five lenses' outputs remain BYTE-IDENTICAL (their data never names the
  new fields; absent ⇒ base rendering) — existing goldens untouched, the parchment
  ===legacy-bytes pin holds.
- **Pane render path (two-paths red-flag cure):** in illustrated mode the pane does
  NOT re-implement art in JSX. It mounts a static op-list underlay (the ONE
  geometry source — same list exports use), `pointerEvents:'none'`, beneath the
  existing interactive layers whose fills go transparent for hit-testing. Art can
  never diverge between screen and export again (the landform/panorama precedent,
  completed).
- Panorama enrichment (own sub-slice): glyph facades on the existing extruded
  prisms (townPanorama.js CATEGORY_HEIGHT machinery) + MINT THE MISSING PANORAMA
  GOLDEN (recon: panorama is currently pinned by no committed golden — close that
  hole first, before enriching).
- **NEW GOLDEN FAMILY:** illustratedTownGolden — plan-lens SVG bytes across the v2
  golden seed set + a v1 seed subset + one seasonal variant each. Additive; minted
  at first light; UPDATE env + README like the sibling families.

## §5 THE SKIN REGISTRY — reskins, AI, and the genre door (owner-first-class)
Recon verdict: the machinery half-exists and is SEVERED — `validateBespokeStyle`
(the wall) and `bespokeStyles.js` persistence work, but `resolveActiveStyle`
(bespokeStyles.js:94) has ZERO production callers; `coerceStyleId` collapses any
bespoke id to parchment; the picker only lists base ids. Saved AI styles can be
previewed in the panel and never worn by the real map. THIS WAVE CLOSES THE SEAM:
1. `readStyleLens`/`withStyleLens`/`coerceStyleId` admit bespoke ids; the lens
   picker lists saved skins under a rubric divider; pane + image export + thumbnail
   + standalone PDF all resolve through `resolveActiveStyle(lens, collection)` —
   the chokepoint finally wired, flip-back law intact (base ids never shadowed).
2. **Wall extension (bounded, never generative):** new whitelisted fields —
   `glyphSet` ∈ GLYPH_SET_IDS (registry of code-shipped glyph libraries;
   `'medieval'` ships first), dress densities/toggles (bounded numerics),
   `shadow` weight, `seasonBias`. The AI (StyleOverhaulPanel → composer grounded on
   `buildStyleVocabulary` → validateBespokeStyle → accept→mint) can now propose
   full RESKINS: palette + glyph set + dress character. AI SELECTS AND TUNES; it
   does not author raw path data in v1 (worst-case-ugly-never-unsafe preserved).
3. **THE GENRE DOOR, made concrete:** a genre skin = a new glyph-set data module +
   a palette + dress rules — vocabulary-in-data, zero engine changes. `'medieval'`
   proves the registry; a sci-fi/desert/gothic set is a content drop that the wall
   already knows how to select. (AI-AUTHORED glyph geometry = named deferral to the
   S4+ trust ladder — the schema for a "glyph pack" content kind is designed then,
   not now; skins are NOT a customContent bucket — different wall, different
   surface, recorded separation.)
4. **Persistence scope:** v1 = per-settlement `mapEdits.bespokeStyles` (exists).
   Account-scoped skin packs that follow the user across settlements = NEW
   schema/persistence surface = ⛔OWNER decision, recorded in the queue — not built
   this wave.

## §6 EXPORTS + ENTITLEMENTS
- Because glyphs compile to primitive ops: image export (PNG/JPEG/WebP), the
  standalone TownMapDocument PDF, and the thumbnail wear the illustrated lens/skin
  automatically through the same op list. No react-pdf SVG-string problem (that
  seam only binds ornament SVG strings; we never emit them).
- The dossier's embedded 08C plate stays BASE geometry (golden-pinned) — converting
  it to illustrated is a DECLARED golden-shift decision deferred to the ONE REGEN
  window. The VTT token raster stays hardcoded `'vtt'` (functional surface —
  correct as-is; recorded). The town-map UVTT battlemap remains the pre-existing
  NEVER-IMPLEMENTED recorded seam — not this wave's scope.
- **Entitlements (vetoable, recorded):** `illustrated` lens FREE (it becomes the
  product's face; gating the face starves the funnel + gallery). Curated alternate
  skin packs = CARTOGRAPHER. AI-minted skins = SURVEYOR. Lock-glyph teasers per the
  ladder ruling's idiom.

## §7 SLICES (each: focused gates per commit; full suite at lane end; lane worktree
off the composite @ 78a04afc, branch claude/illustrated-town)
- **IT-1 THE GLYPHS:** glyphAssign data + library + compiler + illustrated lens id +
  pane underlay + op-budget guard + illustratedTownGolden minted. (The wave's
  spine; everything else layers on it.)
- **IT-2 THE GROUND:** groundDressOps (v1+v2) + relief/shadows + a11y/contrast pins.
- **IT-3 THE SEASONS:** worldCalendar threading + season/state dress + seasonOverride
  mapEdits key + dormancy proofs (absent-input byte-identity tests).
- **IT-4 THE REGISTRY:** the dead-seam closure (resolveActiveStyle wired end-to-end)
  + wall extension + StyleOverhaul grounding update + picker + flip-back tests.
- **IT-5 THE PANORAMA:** mint the missing panorama golden FIRST, then glyph facades
  on the prisms (declared-additive re-mint).
- **IT-6 THE FACE:** default-lens decision surface (illustrated as default
  presentation lens = ⛔OWNER taste call at the walk), export polish, docs, ledger.
- Deferred-named (§10 register): ILLUSTRATED REALM (crown 2) · town UVTT battlemap ·
  account-scoped skin packs (⛔OWNER schema) · 08C illustrated conversion (regen
  window) · AI-authored glyph packs (trust ladder).

## §8 DONE-WHEN (the wave cannot close without all)
1. All five existing lens outputs byte-identical (goldens green untouched);
   parchment===legacy pin green. 2. illustratedTownGolden + panorama golden minted +
green. 3. Op-budget guard green on the largest seeds. 4. A saved AI skin can be
SELECTED and WORN on pane + image export + standalone PDF + thumbnail, and flipped
back (the seam closed, proven by test). 5. Dormancy proofs: no-campaign surfaces
byte-identical seasonless; absent mapEdits keys stringify identically. 6. Zero eager
delta; lazy pins green; max-lines ratchets untouched. 7. Full suite: only the four
parked golden families red. 8. Accessible-lens legibility pins extended over dress
marks. 9. The census row: every existing map behavior (hover, pins, fog, edits,
export menu, panorama toggle) verified reachable in illustrated mode.
