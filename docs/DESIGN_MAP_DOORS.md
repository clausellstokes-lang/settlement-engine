# DESIGN — THE THREE MAP DOORS (corpus entries; PRE-LAUNCH per OWNER RULING #8)
## Fable 5 architecture, 2026-07-17 — full corpus citizenship; BUILD SLOT MOVED PRE-LAUNCH by owner ruling #8 (2026-07-17, "no include them before launch"), superseding the same-day post-launch placement (filename renamed accordingly)

Each door is a frozen design with its coherence matrix per the standing practice. ALL
THREE BUILD IN THIS TAIL: door 1 is the named wave for which the engine-frozen rule lifts
(its commission = the corpus reopening; spatialConsequenceEnabled joins THE ONE REGEN
lighting list, commission-signed, vetoable); doors 2–3 are new product scales shipping at
launch under the launch-whole precedent (instrumented, ROUND 3 reviews them). SEQUENCING
(manager, vetoable): at the town-layout-v2 fold dispatch SM-5 ∥ DOOR 1 ∥ DOOR 3 (disjoint
fences: SM-5 owns existing map UI; door 1 is engine-side + canonize substrate; door 3 is
new interior files w/ its map entry-hook seamed at fold); DOOR 2 dispatches at the SM-5
fold (shared visibility machinery). Door 2's hosted realtime variant (v2) REMAINS
post-launch gated — the zero-server v1 is the launch scope.

---

## DOOR 1 — THE SPATIAL CONSEQUENCE LAYER (town-scale map→engine coupling)

**One sentence:** the urban fabric layer made the engine shape the stone (engine→map);
this door closes the dialogue — the stone shapes events (map→engine): fire spreads along
real adjacency, sieges breach real wall segments, and pressure diffuses through real
districts.

**The crown emergent (why it's worth building):** a siege breaches the exact northwest
wall segment → the fabric layer scars THAT segment's districts → layout v2 renders the
rebuilt grain there → the chronicle narrates the quarter that burned and the quarter the
wind spared — and the next siege finds the rebuilt wall. Stone and history in permanent
conversation; no generator on the market has either half.

**Architecture (the constitutional shape):**
- The engine NEVER reads the render or the layout model directly (the projection law
  survives). At generation/canonize time a compact **SPATIAL SUBSTRATE** is derived and
  stored sidecar (`spatialLedgers.spatialSubstrate`, the fabric/npcGrowth storage idiom):
  district adjacency graph + per-district density/flammability weights (from v2 lot grain
  + material vocabulary) + wall segment polyline with per-segment strength + gate
  positions. Small, prose-free, deterministic from seed+dossier.
- Kernels consume the substrate behind virtual `spatialConsequenceEnabled` — dark ⇒
  byte-identical (the dormancy-golden discipline; wiring lands with a committed dormancy
  golden before any lighting).
- **Fields, not entities:** fire/siege/diffusion act as intensity fields over DISTRICTS,
  never per-building simulation — simplicity-over-fidelity holds; per-building detail is
  render-side interpretation of the district field.
- Three consumers at v1: calamity toll distribution (fire class follows adjacency ×
  flammability; toll TOTALS keep their existing distribution — the field shapes WHERE,
  not HOW MUCH, preserving calamity balance), siege resolution (breach picks a wall
  segment deterministically from strength + attacker approach; scars gain segment
  precision), covert/rumor diffusion (district adjacency replaces uniform town-wide
  spread for corruption-web + information-statecraft pressures, dial-bounded).

**Coherence matrix:** urban fabric (scar records gain wallSegmentId/districtId precision;
deposit maps unchanged) · calamity bucket (WHERE-not-HOW-MUCH law; bucket-neutral prose
untouched — spatial precision lives in chronicle beats, never kind-assertions) · siege/
blockade endurance + Underways (smuggle routes interact with gate/wall state) · corruption
web + info statecraft (diffusion graph swap, leash dials bound it) · chronicle (beats may
name districts; honest-null when substrate absent) · D5 memory (unchanged — district
grief is NOT modeled; state-never-fate) · goldens (GOLDEN-SHIFTING when lit ⇒ lights only
inside an owner-signed regen batch) · determinism (substrate derived, no rng beyond the
seed fork) · first-paint (engine-side lazy leaf; zero eager).

**Build gates:** corpus reopening (new engine capability class) · owner-signed regen ·
the engine-frozen rule lifts only for this named wave · pulseKernel ceiling honored via
lazy-leaf mover (the npcGrowthKernel pattern).

---

## DOOR 2 — THE TABLE LAYER (in-app fog-of-war / session mode)

**One sentence:** a lightweight live-play surface on the town map — DM reveals, players
see the revealed world in the active lens — positioned as the theater-of-the-mind table,
NOT a VTT (no combat automation, no rules engine; UVTT export remains the answer for
Foundry-class play).

**Architecture:**
- Fog state = a visibility mask over the v2 model's districts/streets/buildings —
  display-layer only, ZERO engine coupling, ZERO canon writes. The SM-5 DM/player
  visibility split generalizes: fog is the player mask; DM pins with player-visible flags
  surface through it.
- **v1 scope (zero server):** second-window/shared-screen player view — one render
  surface, two audiences, same projection with the mask applied. Reveal tools: brush by
  district/street/building (snap to the semantic graph — reveals follow real edges, a
  differentiator over pixel-brush fog).
- **v2 scope (server-gated, separate decision):** hosted read-only live link for remote
  players (realtime channel; rides existing auth; anon never sees fog state or the
  unrevealed map).
- Persistence: per-(settlement, session) reveal state, blob-resident cosmetic-class
  (mapEdits idiom: dodges PRIVATE_KEY_RE, dormancy-lawful drop-when-empty, denylist-safe).
  Fogged handout export = the mask applied through the existing export matrix (WYSIWYG law
  extends to the mask).

**Coherence matrix:** SM-5 pin layer (visibility split shared) · v2 semantic graph
(snap-reveal) · lenses (fog renders under any lens incl. bespoke) · exports (masked
handout variant; the with/without-settlements realm precedent) · publicSafe/gallery (fog
state NEVER in anon projections — fail-closed like covert scrub) · mapEdits schema
(cosmetic-class keys) · pricing (premium-or-Surveyor surface; owner decision queued) ·
engine (untouched, by construction).

**Build gates:** post-launch demand check against UVTT adoption telemetry (if Foundry
import satisfies, this stays parked) · pricing decision · v2's realtime surface is a
separate owner gate.

---

## DOOR 3 — THE KEYED SCALE (building interiors)

**One sentence:** a third scale below town — seeded, semantic interiors for institution
buildings, derived like everything else: the corrupt guildhall HAS the back room, the
prosperous tavern IS bigger, and the wall segments are literal so VTT export arrives
pre-walled by construction.

**Architecture:**
- Fork: `${_seed}::interior:v1:<institutionId>` — pure projection, no engine coupling, no
  interior state. Template grammar per institution KIND × tier × facets (the facet law
  applied: declared facets pick template variants; absent ⇒ kind-default ⇒ byte-identical
  inference — custom institutions get interiors for free, the counterpart criterion
  honored).
- Envelope law: an interior fits its building's ACTUAL v2 footprint (the map and the
  interior can never disagree about a building's size or entrances).
- Semantic furnishing from the dossier (bounded vocabularies, THE WALL discipline: data-
  only definitions, no free geometry) — prosperity, corruption exposure, faith, and
  services select from typed furnishing/wing sets. NOT a dungeon designer: institution
  interiors only; wilderness/dungeon content stays out of charter.
- Surfaces: enter-from-map (hover→enter, InstitutionCard adjacency), lenses apply,
  interior UVTT export (walls literal ⇒ the wall-derivation law generalizes perfectly),
  the export bundle extends per-settlement (owner pricing decision: included vs new rung).

**Coherence matrix:** v2 model (footprint envelope; entrances shared) · facet law (variant
selection chokepoint; custom-content on-ramp) · institution lifecycle (an institution that
falls/changes hands re-derives its interior NEXT mint — interiors are projections, so no
lifecycle ghost-writes by construction; cosmetic interior edits ride a scoped mapEdits
sidecar and survive re-derivation via the edits-delta law) · lenses/styles (apply
unchanged) · exports + UVTT (pre-walled by construction) · gallery/publicSafe (interiors
ride the same scrub laws; covert corruption never furnishes a visible room) · goldens (a
NEW additive golden family — v1 town goldens untouched) · pricing (bundle extension
decision) · engine (untouched).

**Build gates:** post-launch · new golden + export surfaces (owner sign-off on scope) ·
the charter's simplicity clause re-affirmed at commission (institution interiors only).

---

**Standing note:** all three doors consume the v2 layout model and the SM-5 provenance/
visibility machinery — the tail being built RIGHT NOW is their shared foundation, which is
why they cost so little to keep alive as designs: the prerequisites ship at launch anyway.
