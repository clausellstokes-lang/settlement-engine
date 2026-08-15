# The Settlement Scene: one town, two presentations

## Decision

SettlementForge will offer an illustrated 3D settlement portrait as a first-class
presentation of a settlement. It does not create a second settlement engine.
Canonical settlement state remains the sole source of game truth; both the 2D
plan and 3D portrait are audience-aware projections of that truth.

The 3D portrait is available behind `settlementScene3d`, which ships on so the
implementation can be exercised. It is not yet the default:
`settlementScene3dDefault` ships off. Default promotion is governed by
[`TOWN_SCENE_PROMOTION_CONTRACT.json`](./TOWN_SCENE_PROMOTION_CONTRACT.json),
which deliberately separates evidence the repository can produce from evidence
that requires people, assistive technology, physical devices, and field-shaped
use.

The 2D plan is permanent. It remains the precision editing, accessibility,
export, and constrained-device surface even after a future 3D promotion.

## Capability is not promotion

Three different statements must remain separate:

1. **Implemented and available** means the manifest, viewer, worker, interaction,
   editing, fallback, and accessibility machinery exists and an eligible user
   can select Portrait.
2. **Certified for default consideration** means every required gate has a
   current, source-bound, artifact-backed receipt of the declared proof class.
   Repository automation can establish only part of that evidence.
3. **Promoted to default** means a later reviewed patch has deliberately enabled
   `settlementScene3dDefault` after an eligible certification receipt.

The first statement is true in this integration. The second and third are not:
no admissible evidence bundle is checked in, the certification result is
`withhold_default`, and the default flag remains false. That is an evidence
boundary, not an unfinished-code euphemism. Conversely, implementation
completeness is not permission to invent device, assistive-technology, user,
taste, or field-soak results.

## Product role

The portrait should answer a different first question from the plan:

- The portrait answers, “What does this place feel like, what matters here, and
  what has happened to it?”
- The plan answers, “Where exactly is it, how is it connected, and what can I
  inspect or change precisely?”

That division avoids forcing a cinematic camera to perform cartographic work or
reducing a living settlement to a decorative model. A default portrait may open
the experience; the plan remains one direct action away.

The target is an illustrated tabletop diorama: strong massing, legible districts,
recognizable landmarks, restrained materials, readable conditions, and authored
composition. Photorealism is not the goal. Visual detail that does not improve
identity, state legibility, or atmosphere is expendable.

## Constitutional invariants

### One canonical truth

The scene manifest is derived data. It may contain stable references, spatial
instructions, presentation vocabulary, and provenance, but never a competing
copy of mutable settlement rules.

Simulation writes flow through the existing command and persistence paths:

```text
canonical settlement / campaign state
                 |
          audience projection
          /               \
       GM-safe          player-safe
          \               /
        TownSceneManifest compiler
                 |
          immutable manifest
          /               \
       2D plan         lazy 3D portrait
```

A view may request navigation to an entity, propose an edit, or record a
cosmetic overlay. It may not directly mutate canonical state.

### Projection before compilation

Audience filtering happens before scene compilation, not as a last-minute
material toggle. A player-safe worker payload must never contain secrets,
hidden hazards, GM notes, undiscovered entities, or private provenance. If
sensitive data never crosses the projection boundary, it cannot leak through
labels, picking metadata, accessibility text, screenshots, exports, analytics,
or renderer errors.

### Fogged player sessions fail closed to the plan

Fog reveal is a second spatial authorization boundary, not a renderer effect.
The current shared-screen player surface therefore remains the canonical 2D
projection: it combines `audience: 'player'` with the active reveal set before
producing the visible map or handout. It never mounts the ordinary DM portrait
and never sends unrevealed scene records to WebGL.

A future fogged 3D player view is allowed only when reveal geometry can clip
terrain, roads, buildings, living-state marks, labels, picking records,
semantics, and provenance before `TownSceneManifest` compilation. Post-compile
visibility toggles, black cover geometry, material opacity, and camera occlusion
are not privacy controls. Until that precompile projection and its adversarial
tests exist, selecting a fogged player session intentionally uses the 2D plan.
This is a safe product fallback and an explicit default-promotion dependency,
not permission to omit fog behavior.

### Determinism where it matters

For the same:

- canonical input,
- audience projection,
- compiler and vocabulary versions, and
- persisted cosmetic overlay,

the compiler produces the same manifest. Rendering may adapt to the device, but
adaptive quality cannot change canonical identity, placement, provenance, or
export truth.

### Fail to a useful view

Unsupported WebGL, worker failure, malformed or unknown manifest versions,
context loss, memory pressure, and sustained overload all lead to the canonical
2D plan. “Canvas failed” is never an end state.

## The `TownSceneManifest`

The manifest is a versioned, serializable scene description. Its job is to make
the boundary between game meaning and rendering explicit.

A complete manifest should carry:

- schema, compiler, vocabulary, and projection versions;
- source identity and a deterministic manifest fingerprint;
- audience and redaction posture;
- bounds, scale, origin, terrain, water, and camera framing;
- roads, paths, plots, districts, walls, gates, bridges, and vegetation;
- building and landmark instances with stable canonical entity references;
- living-state treatments such as damage, repair, occupation, prosperity,
  abandonment, season, and scars;
- picking ids and safe provenance summaries;
- deterministic LOD representations and fallback massing;
- separately versioned cosmetic overlays;
- diagnostics that contain no private content.

Every record has a bounded fallback. A structure whose specialized vocabulary
is unknown still becomes a simple, selectable mass with identity and provenance.
A sparse historical save still becomes a complete settlement, not a partial
scene surrounded by exceptions.

## Spatial compilation

The compiler should proceed in named stages whose outputs can be inspected:

1. Normalize and validate the audience-safe input.
2. Establish deterministic world bounds, scale, terrain, and water.
3. Reconcile canonical roads, gates, districts, plots, and landmarks.
4. Complete missing graybox structure without overwriting supplied plan truth.
5. Select building vocabulary from role, culture, material, wealth, density,
   condition, and district context.
6. Apply living-state treatments using explicit precedence rules.
7. Generate deterministic LOD and picking tables.
8. Apply validated cosmetic overlays.
9. Sort, serialize, and fingerprint the manifest.

Random-looking variation comes only from stable seeded forks named by purpose and
entity. Iteration order must never become an accidental random source.

The existing deterministic architecture kernel remains isolated. Three.js is a
view dependency and must not enter deterministic `src/domain/townMap/arch`
modules.

## Visual vocabulary

The initial vocabulary must be complete before it becomes elaborate.

### Terrain and water

Terrain communicates setting and settlement logic: grade, cliffs, shorelines,
river crossings, flood edges, worked earth, fields, and important clearings.
Water needs a restrained readable surface, not expensive physical simulation.

### Routes and enclosure

Road hierarchy, paths, bridges, walls, towers, gates, ditches, and breaches must
remain legible from the default camera. The viewer should emphasize topology and
entry points over decorative surface noise.

### Buildings and landmarks

Buildings use a composable grammar:

- mass and footprint,
- storey and roof family,
- facade rhythm,
- material family,
- role markers,
- condition treatments, and
- deterministic small detail.

Important institutions and landmarks get distinct silhouettes before they get
more polygons. Repetition is controlled by stable variation, not nondeterministic
asset scattering.

### Vegetation and atmosphere

Vegetation supports biome, land use, season, exposure, and neglect. It is
instanced, bounded, and culled before structure. Fog, sky, particles, smoke, and
weather are subordinate to orientation and must honor reduced motion.

### Illustrated-diorama treatment

The production look combines:

- a small, coherent material palette;
- soft directional and ambient light;
- restrained contact grounding;
- readable crease or silhouette ink;
- controlled atmospheric depth;
- deliberate camera elevation and focal length; and
- color/contrast reserved for game-relevant condition and selection.

The canonical campaign calendar currently advances in whole weeks and seasons;
it does not contain an hour or day-phase axis. The supported presentation
therefore uses one fixed authored daylight rig
(`fixed-authored-daylight`) across WebGL, Portrait PNG, and Scene GLB. A renderer
must not infer dawn, dusk, or night from a seed, client clock, or elapsed week.
Dynamic time of day becomes a supported matrix axis only after the canonical
calendar owns a bounded day-phase value and the manifest contract projects it.

The look is certified as a matrix, not from one attractive hero settlement.

## Runtime boundary and lifecycle

The public viewer module is lazy-loaded from the already-lazy map surface. The
Three.js runtime is loaded only inside that viewer boundary. A stable sentinel,
`settlementforge:town-scene-3d:lazy-v1`, lets the production-build test prove
both halves of the contract: no 3D scene bytes in the entry closure, and real 3D
scene bytes somewhere in a fresh build.

The already-lazy map surface performs only the authorization step. It projects
the settlement and cosmetic edits for the requested audience, resolves an
audience-safe atmosphere, detaches the result, and seals those values in a
size-bounded `TownSceneCompileInput`. That exact envelope has no `worldState` or
`regionalGraph` field. `src/workers/townScene.worker.js` validates the envelope,
compiles and returns the renderer-neutral manifest, then lowers graybox and full
geometry. This order keeps raw sensitive state on the authorized side of the
transport boundary while moving the measured manifest and typed-array work off
the interaction path.

The worker entry keeps geometry lowering ready, but imports the heavier
canonical town-map vocabulary only after a compile request. All workers are ES
modules so that compiler support remains a separate, cacheable payload.
Production-build tests bound the worker entry, compiler support, and their
combined size, and prove that neither payload is module-preloaded at first
paint.

Every request has a monotonic identity. The client rejects stale replies,
terminates obsolete or aborted work, requires the manifest packet before any
geometry packet, verifies the final manifest digest join, transfers suitable
buffers, exposes a calm error result, and tears down the worker when its owner
unmounts. An exact manifest/quality cache hit may terminate geometry work after
the manifest establishes cache identity. The public synchronous
`compileTownSceneManifest` remains available to deterministic domain/export
callers and delegates to the same authorized input contract; the live viewer has
no synchronous compiler path.

Switching settlements or views disposes:

- animation frames;
- event listeners and observers;
- geometries, materials, textures, and render targets;
- selection/highlight resources;
- worker requests and object URLs; and
- renderer/context resources.

React Strict Mode double-mount behavior is part of the lifecycle test, not an
exception.

Portable Portrait exports follow a separate, nested lazy boundary. The shared
Map export menu imports `src/lib/townScene/townSceneExport.js` only when a user
chooses Portrait PNG or Scene GLB; encoding then runs in
`src/workers/townSceneExport.worker.js`. PNG is a deterministic CPU-rendered
illustration and GLB is a deterministic expansion of the renderer-neutral
geometry bundle—not a device-dependent framebuffer capture. Both are compiled
from the same audience-projected manifest, while SVG/PDF and precision-map
exports continue to use the canonical 2D plan.

## Adaptive quality is policy plus actuation

`src/lib/townScene/adaptiveQuality.js` is the canonical pure governor. It maps
synthetic or measured frame durations to a quality state with:

- a dead band;
- fast degradation and slow recovery;
- a user-selected quality ceiling;
- a usable massing-only floor; and
- a sustained-overload switch to the 2D plan.

`actuationPlanFor` names what the renderer must actually change:

| Actuator | High quality | Lower quality |
| --- | --- | --- |
| Render scale | 1.0 | trends toward 0.6 |
| Contact shadows | enabled | disabled |
| LOD bias | 0 | trends toward 2 |
| Crease ink | enabled | disabled |
| Detail cull scale | 1.0 | trends toward 0 |
| Massing only | false | true at the floor |
| Presentation | `scene3d` | `plan2d` after sustained floor overload |

Unit tests proving scalar movement are necessary but insufficient. Promotion
evidence must demonstrate that each actuator changes renderer work and that the
plan fallback stops or unmounts expensive 3D work.

## Caching

Cache identity includes every input that can change scene meaning or appearance:

```text
canonical source fingerprint
+ audience projection version and audience
+ manifest compiler version
+ visual vocabulary version
+ cosmetic overlay version
+ requested quality-independent scene options
```

Device quality is not part of canonical manifest identity. It selects how much
of an already-described scene is drawn. Caches are bounded, observable, and
invalidated rather than silently reused across schema versions.

## Picking, provenance, and product links

Picking resolves a renderer-local id through a manifest table to a stable
canonical entity id. It never relies on array position, mesh name, display label,
or color.

A selected entity can:

- open its structured summary;
- navigate to the Settlement Workbench;
- navigate to relevant Herald material;
- explain which canonical facts produced its location, form, and condition; or
- request a cosmetic edit.

If an entity is not safe for the current audience, it does not have a player
picking record.

## Cosmetic editing

Cosmetic editing exists for presentation choices that do not belong in the
simulation: camera bookmarks, approved material variants, prop visibility,
bounded vegetation choices, or an explicitly cosmetic position adjustment.

These edits live in a versioned overlay with:

- stable target ids;
- a closed operation vocabulary;
- schema and range validation;
- undo/redo history;
- deterministic application order;
- save/reopen and import/export behavior; and
- orphan handling when the canonical target disappears.

Game-meaningful changes use existing command paths. Calling a structural or
economic change “cosmetic” to bypass simulation ownership is prohibited.

Orphan handling is explicit and reversible. The viewer compares normalized
`sceneOverrides` with the current manifest's building anchors and reports every
missing target in the DM companion; it never deletes or retargets an override
during compilation or render. The GM may remove an orphan or relink it to an
explicitly chosen current building. Relinking refuses occupied targets rather
than merging or replacing another building's appearance. Either action is one
normalized parent map-edit commit, so the existing persistence and undo history
restore the complete pre-action overlay.

## Herald handoff

“Open the Herald” is a typed presentation handoff, not a route-only shortcut.
The campaign-scoped Herald session carries a bounded projection of the selected
scene id, entity kind, label, canonical reference, provenance references,
resolved provenance records, and the closed `inspect-scene-provenance` action.
The action opens the established Events/Stories address and the Herald renders
the exact portrait context above its normal material.

Scene ids, canonical ids, provenance ids, and RealmItem ids remain different
identity vocabularies. The handoff never converts one into another or guesses a
matching story. Unknown actions fail back to the Dashboard without retaining a
scene context; malformed or unrelated provenance records are dropped at the
session boundary. The context is session-only, DM-only, dismissible, and owns no
campaign fact or decision.

## Accessibility

The WebGL canvas is not the only representation. The same player-safe manifest
drives a structured companion with settlement summary, districts, routes,
landmarks, entities, conditions, provenance, and actions. It must support:

- keyboard selection and navigation;
- clear focus entry, containment where appropriate, Escape, and focus return;
- touch targets and non-gesture alternatives;
- zoom and orientation controls with names and state;
- reduced motion, forced colors, high zoom, and contrast;
- polite announcement of selection, quality changes, errors, and fallback; and
- a direct “Use 2D plan” action.

Automated checks guard regressions. Representative assistive-technology journeys
remain external promotion evidence.

## Flags and preference precedence

The two flags have different jobs:

1. `settlementScene3d` controls whether the portrait is available.
2. `settlementScene3dDefault` controls whether an eligible user with no stronger
   preference opens in the portrait.

View precedence is:

```text
hard capability or safety fallback
  > explicit current-session user choice
  > valid device-local saved preference
  > promoted-default flag
  > canonical 2D plan
```

The persisted id is `portrait3d`; existing `plan` and `panorama` records remain
valid. Unknown records normalize to `plan`. Automatic capability, worker, or
runtime recovery disables Portrait only for the current mount and preserves the
saved preference. A direct “Use 2D plan” action emits
`user-selected-plan` and runs through the normal view selector, so Plan and the
active lens persist across navigation and remount.

### Local deterministic matrix: diagnostic, not promotion evidence

`npm run audit:town-scene:local-matrix` exercises a deterministic pairwise
matrix across:

- settlement tier;
- biome;
- walls;
- water access;
- season;
- living condition; and
- DM versus player audience.

Every case compiles the manifest and transfer geometry twice, renders
deterministic CPU PNG and GLB exports twice, and fails on byte drift, an invalid
manifest/geometry/export join, a live player-secret sentinel, resource ceilings,
missing expected vocabulary, a blank reference portrait, or a grossly empty or
clipped composition. The machine report includes feature coverage, geometry
bytes, reusable-mesh counts, per-LOD reusable and expanded triangle counts,
artifact sizes, and SHA-256 digests. Seven authored representatives also write
PNG and GLB files below `artifacts/town-scene/local-matrix/`.

The report's evidence class is
`automated_local_deterministic_non_promotion`, and
`promotionEligible` is always `false`. The PNG is the renderer-neutral CPU
reference export, not a screenshot from the production WebGL path. The matrix
does not establish driver correctness, physical-device performance, browser
zoom appearance, forced-colors appearance, assistive-technology behavior, touch
hardware behavior, player recognition, or visual taste. It therefore cannot be
placed in the promotion evidence bundle or satisfy a local or external
promotion gate by itself.

Locally testable accessibility and browser semantics remain ordinary regression
contracts: forced-colors CSS, the high-zoom responsive stack, reduced-motion
threading, DOM focus order and focus return, WebGL context-loss callbacks, and
tap-versus-drag handling. Those tests prevent known regressions; they do not
replace the rendered browser/device and human journeys required below.

## Certification and promotion

`scripts/audit/town-scene-certification.mjs` reads the machine contract and an
evidence bundle. It:

- fingerprints every declared entry plus its complete repository-local
  dependency closure, including literal lazy imports and worker URLs, and fails
  closed if any local edge cannot be resolved;
- requires every record to identify its gate, proof class, accountable producer,
  and result summary;
- verifies referenced evidence artifacts and their SHA-256 digests;
- rejects boolean-only, missing, malformed, unverifiable, future-dated, expired,
  or source-stale evidence;
- reports local and external completeness separately;
- writes an atomic receipt;
- refuses an ineligible default-on configuration; and
- never changes a product flag.

Running the audit without evidence should succeed as an honest “withhold”
receipt. `--require-promotion` turns incompleteness into a non-zero release gate.
Local automation can never fabricate or stand in for device, accessibility,
recognition, taste, or field evidence. Those external receipts also expire on
gate-specific schedules: shipped capability is durable, but evidence about the
current physical-device, assistive-technology, human, and field environment is
not.

An evidence bundle is intentionally explicit. Each gate receives its own record;
one broad “QA passed” assertion cannot stand in for gate-specific proof:

```json
{
  "schemaVersion": 1,
  "kind": "town_scene_3d_evidence_bundle",
  "gates": {
    "TS3D-EXTERNAL-01": {
      "gateId": "TS3D-EXTERNAL-01",
      "evidenceKind": "human_observed_device_lab",
      "producer": "named device-lab workflow or accountable team",
      "summary": "What was exercised, on which matrix, and what passed.",
      "passed": true,
      "capturedAt": "<current ISO-8601 timestamp with timezone>",
      "sourceFingerprint": "<SHA-256 printed by the certification audit>",
      "evidenceRefs": [
        {
          "path": "artifacts/town-scene/device-lab/report.json",
          "sha256": "<SHA-256 of that immutable artifact>"
        }
      ]
    }
  }
}
```

The default is promoted only in a separate reviewed change after the receipt is
eligible. Promotion does not authorize deleting the 2D plan.

## Implementation map

The intended ownership boundaries are:

- `src/domain/townScene/` — pure projection, manifest, compiler, vocabulary, and
  cosmetic-overlay logic;
- `src/lib/townScene/` — worker client, caching, adaptive view policy, and
  application integration that does not belong to the domain;
- `src/components/townMap/scene3d/` — lazy presentation and Three.js runtime;
- `src/workers/townScene.worker.js` — live-view geometry transport boundary;
- `src/workers/townSceneExport.worker.js` — nested lazy PNG/GLB encoding boundary;
- `src/lib/lastMapView.js` — device-local view preference compatibility;
- `tests/architecture/` — determinism and dependency walls;
- `tests/build/townScene3dLazy.test.js` — source and production lazy-delivery
  contract; and
- `docs/TOWN_SCENE_PROMOTION_CONTRACT.json` plus the certification audit —
  evidence policy and promotion receipt.

If implementation pressure blurs one of these boundaries, change the boundary
deliberately and update its enforcing test. Do not solve it with an undocumented
cross-import.
