# Town Cartography / TC-5a — the cartography paint leaf (draw list + palette program)

- **Status:** READY
- **Status note:** promoted by the chair 2026-08-11; §13's six open items are CLOSED below. TC-5 as designed was REFUSED as four packets; this is the first.
- **Packet version:** `0` (draft)
- **Verified base:** `claude/composite-r4` at `58436804982b41944478db6c728e579ac9853122`
- **Base note:** measured clean at authoring (`git status --porcelain` empty at HEAD).
  TC-4's landing `5a6f76fe` is an ancestor. `docs/implementation/INDEX.md` still carries
  header SHA `7699e367` while its body lists landings through `ES-5d` — the index header
  is stale relative to HEAD and the coordinator should re-derive it at this flip.
- **Depends on:** TC-4 at `5a6f76fe`; TC-3b at `a45c969d`; TC-3a at `5066c34b`;
  TC-0..TC-2 at `6e96e259` + `0dcc3b9d`
- **Collision group:** `town-cartography-contract-and-compiler`; serialize against every other TC wave
- **Commit authority:** to be stated by the chair at dispatch

> **THIS PACKET IS THE FIRST OF A FOUR-WAY SPLIT OF DESIGN §9's "TC-5 painter".**
> The single TC-5 named in `DESIGN_TOWN_CARTOGRAPHY.md` §9 cannot fit one packet under
> `PACKET_STANDARD.md`'s hard scope budget. The measurement and the proposed split are in
> §-1. Compiling TC-5 whole would have required renegotiating the budget, which the standard
> forbids.

---

## -1. REFUSE FORWARD — why TC-5 is not one packet, measured

Design §9 defines TC-5 as "**painter: SVG renderer + palette program + audience variants +
PNG goldens**", and three further BINDING amendments load onto the same slice: **A-9**
(§11c, full colour through `src/design/tokens.js`), **A-11** (§11e, skins + closed style
knobs + AI editing controls), **A-4** (§11, deterministic degraded states), plus **§12**
(the `Illustrated` sub-tab joins the Map container at TC-5).

Against `PACKET_STANDARD.md`'s hard budget — one behavior family, one user-facing surface,
**two** new logic-bearing production leaves, **400** new/changed effective production lines,
twelve handwritten files, **eight** acceptance cases — that is not a boundary dispute; it is
four to five behavior families. The nearest measured precedent: the existing plan-view SVG
emitter `src/domain/townMap/townMapDraw.js` is **264 effective lines by itself**
(measured, §4 B5) and emits no palette, no audience variant, no PNG, and no sub-tab.

**Proposed split, smallest-first:**

| Slice | Behavior family | Surface | Why it is separable |
|---|---|---|---|
| **TC-5a** (this packet) | Manifest block → deterministic draw-op list + the palette ROLE program | none (headless) | Pure, renderer-side, consumes only the landed v2 block; nothing calls it yet, so it moves no output at all |
| **TC-5b** | The `Map ▸ Illustrated` sub-tab: lazy leaf, presence gate, token→colour binding, SVG render, A-4 degraded state | one | Needs the draw list to exist first; owns the only user-facing surface and the only first-paint risk |
| **TC-5c** | PNG goldens through `src/kernel/deterministicPng.js` (`encodePng`) | none | Needs a rendered surface to rasterize; byte-contract goldens are their own verification family |
| **TC-5d** | A-11 skins + closed style knobs | one | A named override of TC-5a's role program; **AI editing controls (A-11 bullet 3) are deferred beyond TC-5d** — a finite-semantics clerk surface is its own design, not a painter slice |

TC-5b/c/d are **not compiled here**, per the standard's primary scope-control rule
("compile the next packet only when its dependencies are landed and its live substrate is
measurable").

---

## 0. Why this packet exists, and what it starts from

TC-4 landed the fourth and last cartography layer. The v2 block now carries complete
`streets` / `wards` / `parcels` / `buildings` records — and **nothing anywhere renders
them.** Recon confirmed the gap is total: no module under `src/` reads `manifest.cartography`
for display; `src/lib/mapSubTabs.js:30-34` documents the painter's mount as a deliberately
un-taken extension point.

TC-5a builds the pure half: the function that turns a compiled cartography block into an
ordered, deterministic, colour-free draw-op list, plus the palette ROLE program that says
what each record *means* tonally. It renders nothing, mounts nothing, and is imported by
nothing in production until TC-5b.

**Observable result:** a new pure leaf converts any lit `manifest.cartography` block into a
draw-op list whose length is an exact identity over the block's own record counts, whose
ordering is deterministic, which contains no colour value, and which is provably **outside**
the bounded worker/compiler chunk closure.

---

## 1. Reconciled authority

1. `DESIGN_TOWN_CARTOGRAPHY.md` §1 is controlling: cartography is a synthesis stage inside
   the manifest, and **the painter is a renderer OVER the manifest**. §1 also forbids the
   second-truth failure mode by name — this bears directly on §11's D-2 below.
2. **The landed contract outranks the design prose on colour.** `cartographyContract.js:38-42`
   ("NO COLOUR, EVER (A-9)") and its `rejectRawColour` validator (`:251`, `:440-451`) already
   ruled that the manifest carries tone INTENSITY in permille and **never** a colour value.
   This packet therefore takes colour resolution entirely renderer-side; see §11 D-1.
3. **CR-TC3B-BYTES governs, and this packet's posture is ZERO** (§6.4). TC-5a adds no edge
   into the bounded closure; the guard is a mandated acceptance case (C7), not a hope.
4. **CR-TC4-BAND-1's law is applied structurally** (`derive-dont-restate`): this packet
   authors **no** count band and **no** byte band. The draw-op ceiling is an *identity* over
   the block's own record counts, and every vocabulary map derives its key set from the
   contract's frozen vocabularies. See §6.2 and §11 D-3.
5. Design prose this packet deviates from is recorded in §11, each vetoable.

The implementer does not reopen these rulings by rereading design prose.

---

## 2. Outcome and non-goals

**Definition of done:** `buildCartographyDrawList` returns, for every lit corpus row, an
op list satisfying the §6.2 identity; the role program covers both frozen vocabularies
exactly; two builds are byte-identical; no colour value appears in any op or either leaf's
source; neither leaf is in `compileTownSceneManifest.js`'s transitive static closure; the
bounded pair, every golden, and the dormancy fixture are all **unmoved**.

In scope:

1. `buildCartographyDrawList` — the pure block → op-list conversion.
2. The palette ROLE program: paint roles, ward-kind→role, condition→tone shift.
3. The closure-exclusion prevention guard (C7) that keeps the painter out of the bounded pair.

Explicit non-goals: any SVG string, DOM, React, or component; any colour VALUE or
`src/design/tokens.js` read; the `Illustrated` sub-tab, `mapSubTabs.js`, or any UI mount
(TC-5b); PNG or raster of any kind (TC-5c); skins, style knobs, or AI controls (TC-5d);
audience variants (see §11 D-4 — already satisfied upstream, nothing to build); labels and
label placement (A-5 landed at TC-3a as manifest `name` data); any `lynchRubric` scoring or
gate (§11 D-5); any schema, contract, vocabulary, or version change; any compiler or
synthesis edit; hit-maps, interaction, a11y structure lists (TC-6); pulse reactivity (TC-7);
exports or promotion (TC-8); tuning of any landed band; full-gate repairs unrelated to the
eight acceptance cases.

---

## 3. Hard scope budget

| Limit | Packet budget | Default | Note |
|---|---:|---:|---|
| Behavior families | `1` | `1` | block → draw ops |
| New persisted record families / writers | `0 / 0` | `1 / —` | nothing here persists |
| Feature flags / user-facing surfaces | `0 / 0` | `1 / 1` | inert until TC-5b |
| Direct production consumers | `0` | `2` | deliberately none — TC-5b is the first |
| New logic-bearing production leaves | `2` | `2` | at cap |
| Existing logic-bearing production files | `0` | `3` | |
| Registration-only files | `0` | `3` | |
| Handwritten files total | `4` | `12` | |
| Effective production-line delta | `<=320` | `400` | projected `~250` |
| New leaf — `cartographyPaintRoles.js` | `<=90` | `250` | projected `~70` |
| New leaf — `cartographyPaint.js` | `<=230` | `250` | projected `~180` |
| Acceptance cases | `8` | `8` | at cap |

Per-file caps use ESLint's own counting (`max-lines`, `skipBlankLines` + `skipComments`).
Both leaves sit under `src/domain/**/*.js`, whose layer ceiling is **800** effective lines
(`eslint.config.js:556-560`, measured §4 B5); the packet caps above bind first. Neither file
has a `scripts/.size-baseline.json` entry and neither may acquire one. Both projections are
**AUTHOR-TIME-UNMEASURED** until the implementation exists; exceeding any cap is a STOP and
a split, never a renegotiation.

---

## 4. Preflight

Run before editing:

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor 5a6f76fe HEAD     # TC-4
git merge-base --is-ancestor 58436804 HEAD     # this packet's authoring base

# New files absent.
test ! -e src/domain/townCartography/cartographyPaint.js
test ! -e src/domain/townCartography/cartographyPaintRoles.js
test ! -e tests/domain/townCartographyPaint.test.js

# Target clean (the one existing file this packet touches).
git diff --quiet -- tests/domain/townCartographyDeterminism.test.js

# Live symbols this packet consumes.
rg -n 'TOWN_CARTOGRAPHY_WARD_KINDS|TOWN_CARTOGRAPHY_CONDITIONS|TOWN_CARTOGRAPHY_STREET_CLASSES|TOWN_CARTOGRAPHY_BUILDING_ROLES|RAW_COLOUR' \
  src/domain/townScene/cartographyContract.js
rg -n 'export function byCodepoint|export function list|export function record' \
  src/domain/townCartography/cartographyPlan.js
rg -n 'export function stableSceneStringify' src/domain/townScene/stableScene.js
rg -n 'expectAbsentWithAnchor|expectPresentThenAbsent' tests/helpers/anchoredNegatives.js
```

Expected: both ancestors hold; the three new files are absent; the one target is clean;
every named symbol exists. Foreign dirt anywhere else is reserved and untouched — the status
commands are path-scoped for that reason. Any target collision or material symbol drift
makes this packet `STALE`.

**Baselines.** Unlike TC-4, this lane held the test slot and executed the bundle and static
measurements; those are marked **MEASURED** with their receipt. The test-suite figures were
**not** run and are marked **AUTHOR-TIME-UNMEASURED**.

| # | Premise | Exact command | Expected / recorded |
|---|---|---|---|
| B1 | Focused cartography base is green | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/townCartographyWards.test.js tests/domain/townCartographyParcels.test.js tests/domain/townCartographyBuildings.test.js tests/domain/townSceneCartography.test.js tests/domain/townCartographyDeterminism.test.js tests/property/townCartographyDormancyGolden.test.js` | **AUTHOR-TIME-UNMEASURED** — exit 0; record counts |
| B2 | Bounded pair at base | `npm run build && npm run verify:dist` | **MEASURED at `58436804`: worker `77,455` + compiler `307,682` = `385,137`**, ceiling `< 400,000`, headroom **`14,862`**. TC-5a's expected delta is **`0`** |
| B3 | Dormancy golden green at base | included in B1 | **AUTHOR-TIME-UNMEASURED** — green |
| B4 | Typecheck posture | `npm run typecheck:ratchet && npm run typecheck:domain:strict` | **AUTHOR-TIME-UNMEASURED** — exit 0 both configs, named separately (two-typechecker receipt law) |
| B5 | Effective-line ceilings | `npx eslint --rule '{"max-lines":["error",{"max":1,"skipBlankLines":true,"skipComments":true}]}' <file>` | **MEASURED** — see §4b |
| B6 | Sovereignty lighting census row | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js` | **MEASURED (by read, not by run):** frozen row at `sovereigntyLightingContract.walker.test.js:3621` is `files: 2392, parked: 365, credited: 2027, titles: 19659, suiteTitles: 5552`. ⚠ `INDEX.md`'s ES-5d row states `19656` — **stale; the file is authority** |
| B7 | Render-blocking CSS headroom | `npm run build` then measure the one `index.html`-referenced stylesheet | **MEASURED at `58436804`: `dist/assets/index-CiMob2Ip.css` = `19,795 B` against `CSS_BUDGET_BYTES = 19_800` (`tests/build/firstPaintNonJs.test.js:37`) — `5 bytes` of headroom.** TC-5a's expected delta is `0` (no stylesheet, no component) |

A red B1/B3 at base means the substrate drifted: STOP, this packet is `STALE`.

### 4b. Measured effective-line table (B5 receipt, `58436804`)

| File | Effective lines | Ceiling | Headroom | Role here |
|---|---:|---:|---:|---|
| `src/domain/townScene/cartographyContract.js` | `291` | `800` | `509` | Import source for the frozen vocabularies; **forbidden edit** |
| `src/domain/townCartography/cartographyTuning.js` | `143` | `800` | `657` | **Not touched** — this packet authors no band |
| `src/domain/townMap/townMapDraw.js` | `264` | `800` | `536` | The plan-view precedent whose shape §6.2 copies; **forbidden edit** |
| `src/lib/mapSubTabs.js` | `57` | `800` | `743` | **TC-5b's file, not this one's** |
| `src/lib/lastMapView.js` | `37` | `800` | `763` | **TC-5b's concern** (see §12 O-1); persisted vocabulary |
| `src/design/tokens.js` | `435` | *(none — `src/design/**` is not covered by any `max-lines` block)* | n/a | **Forbidden import here**; TC-5b's concern |
| `src/domain/townCartography/cartographyPaintRoles.js` | *new* | `800` (packet cap `90`) | — | CREATE |
| `src/domain/townCartography/cartographyPaint.js` | *new* | `800` (packet cap `230`) | — | CREATE |

---

## 5. Verified tree contract

| Role | File | Symbol | Required fact/use |
|---|---|---|---|
| Input (the whole subject) | `src/domain/townScene/cartographyContract.js` | `attachTownCartographyLayers` output shape; `TOWN_CARTOGRAPHY_BLOCK_KEYS` | The block is `{ schemaVersion, streets, wards, parcels, buildings }`. **Forbidden edit.** |
| Frozen vocabularies | `src/domain/townScene/cartographyContract.js` | `TOWN_CARTOGRAPHY_WARD_KINDS` (12), `TOWN_CARTOGRAPHY_CONDITIONS` (6, ordered), `TOWN_CARTOGRAPHY_STREET_CLASSES` (2), `TOWN_CARTOGRAPHY_BUILDING_ROLES` (2) | The role program's key sets DERIVE from these. **Import; never restate.** **Forbidden edit.** |
| Colour law | `src/domain/townScene/cartographyContract.js` | `RAW_COLOUR` (`:251`), `rejectRawColour` (`:440`) | C4 reuses this exact regex rather than authoring a second one. **Forbidden edit.** |
| Shared narrowing kernel | `src/domain/townCartography/cartographyPlan.js` | `record`, `list`, `byCodepoint`, `premise` | **Import; never redeclare.** The `premise` prefix stays `townCartography TC-3 premise:` — a `TC-5` respelling is a STOP (the same pin TC-4 honored). |
| Stable serialization | `src/domain/townScene/stableScene.js` | `stableSceneStringify` | C5's byte-identity instrument. |
| Producer of the subject | `src/domain/townCartography/cartographySynthesis.js` | `compileTownCartography` | Read-only reference for the corpus harness. **Forbidden edit — importing it here would be the coupling back-edge.** |
| Bounded-pair guard | `tests/build/townScene3dLazy.test.js` | the bounded-payload `it` | **Run, never edit.** Owns `400,000` (pair), `300,000` (worker), `350,000` (compiler). |
| Negative-anchor helper | `tests/helpers/anchoredNegatives.js` | `expectAbsentWithAnchor`, `expectPresentThenAbsent` | Every negative in the new suite uses one of these (new files start at an un-anchored-negative ceiling of **ZERO**). |
| Proof precedents | `tests/domain/townCartographyBuildings.test.js` | `compileLeaves`, `leafInputFor`, per-test `120_000` timeouts | Copy the harness shape; per-test timeouts stay per-test (never raise the global — the flake-factory class). |
| Source-closure precedent | `tests/build/mapTabShellLazy.test.js` | its `sourceClosure()` walker | C7 copies this walk to prove the exclusion **without** needing a build. |

Forbidden production edits: everything above marked forbidden, plus
`compileTownSceneManifest.js`, `manifestContract.js`, `sceneCompileInput.js`,
`cartographyWards.js`, `cartographyParcels.js`, `cartographyBuildings.js`,
`cartographyMultiplicity.js`, `cartographyTuning.js`, `cartographyMorphology.js`,
`cartographySkeleton.js`, `cartographyField.js`, `cartographyDefenses.js`,
`src/lib/mapSubTabs.js`, `src/lib/lastMapView.js`, `src/design/tokens.js`,
`src/design/townMapStyles.js`, `src/domain/townMap/townMapDraw.js`,
`src/components/**`, `vite.config.js`, `eslint.config.js`,
`scripts/.size-baseline.json`, simulation rules, and every file outside §7.

---

## 6. Exact contracts

### 6.1 New leaf — `cartographyPaintRoles.js` (the palette PROGRAM, no colour)

A **role** is what a record means tonally; it is never a colour. The component layer
(TC-5b) is the only place a role becomes a value, and it does so through
`src/design/tokens.js`.

```js
/** Closed paint-role vocabulary. Sorted; the sort is the enumeration order. */
export const CARTOGRAPHY_PAINT_ROLES = Object.freeze([
  'civic', 'craft', 'default', 'green', 'ground',
  'industry', 'sacred', 'street', 'wall', 'water',
]);
```

**`WARD_ROLE_BY_KIND`** — an exhaustive map over `TOWN_CARTOGRAPHY_WARD_KINDS`. Authored
values (each individually vetoable; none is lit-surface tuning — the surface is dark and
this packet renders nothing):

| ward kind | role | ward kind | role |
|---|---|---|---|
| `arcane` | `sacred` | `merchant` | `civic` |
| `civic` | `civic` | `military` | `wall` |
| `craft` | `craft` | `noble` | `civic` |
| `criminal` | `ground` | `other` | `default` |
| `foreign` | `default` | `religious` | `sacred` |
| `industrial` | `industry` | `residential` | `ground` |

**`CONDITION_TONE_SHIFT_PERMILLE`** — an exhaustive map over `TOWN_CARTOGRAPHY_CONDITIONS`,
**monotone non-increasing along the frozen ladder** (index 0 best → last worst), applied to
a building's `heightPermille`-independent paint tone:

| condition | shift | condition | shift |
|---|---:|---|---:|
| `pristine` | `+80` | `damaged` | `-120` |
| `sound` | `0` | `burned` | `-260` |
| `worn` | `-60` | `ruined` | `-380` |

**`STREET_WIDTH_WEIGHT_PERMILLE`** — exhaustive over `TOWN_CARTOGRAPHY_STREET_CLASSES`:
`arterial: 1000`, `lane: 620`. Applied to the record's own `widthPlan`; it never replaces it.

**Required exports:** `CARTOGRAPHY_PAINT_ROLES`, `WARD_ROLE_BY_KIND`,
`CONDITION_TONE_SHIFT_PERMILLE`, `STREET_WIDTH_WEIGHT_PERMILLE`, and
`paintRoleForWardKind(kind)` which **throws the `premise` error** on an unknown kind — it
never falls to `default`. (A silent default is exactly the fail-open shape C3's negative
control exists to catch.)

**Permitted imports — anything else is a STOP:** `../townScene/cartographyContract.js`
(a **zero-import leaf**, verified §6.4), `./cartographyPlan.js`.

### 6.2 New leaf — `cartographyPaint.js`

```js
buildCartographyDrawList(cartography) -> ReadonlyArray<CartographyDrawOp>
```

Absence rule: a `null`/`undefined` block, or a block whose four layers are all empty,
returns a **frozen empty array** — never `null`, never a throw. A malformed block (a
non-array layer, a record missing a required key) throws the `premise` error.

**Op vocabulary (closed), and the emission order — painter's algorithm, back to front:**

1. every `wards[]` row → `{ op: 'ward', id, polygon, role, tonePermille }`
2. every `streets.arterials[]` then `streets.lanes[]` row →
   `{ op: 'street', id, polyline, classKind, widthPlan, weightPermille, role: 'street' }`
3. every `buildings[]` row →
   `{ op: 'building', id, polygon, role, tonePermille, condition }`

Within each group, rows are emitted in `byCodepoint` order of `id`. `parcels[]` emits **no
op** — a parcel is a placement slot, not a drawn thing (recorded deviation §11 D-6).

**Geometry is COPIED, never recomputed.** A ward op's `polygon` is the block's polygon
verbatim; a building op's `polygon` is the block's `footprint` verbatim. The painter owns no
geometry, so `footprint ⊂ parcel ⊂ ward` needs no re-proof here.

**Tone:** a ward op's `tonePermille` is the record's own. A building op's is
`clamp(0, 1000, ward.tonePermille + CONDITION_TONE_SHIFT_PERMILLE[condition])` where `ward`
is the ward owning the building's parcel; the clamp is inclusive at both ends.

**THE LENGTH IDENTITY (§1.4, `derive-dont-restate`):** this packet authors **no** op ceiling.

```
ops.length === wards.length + streets.arterials.length
             + streets.lanes.length + buildings.length
```

An identity cannot drift out of agreement with a cap the way two authored tables can. For
the chair's information only, the identity's implied per-tier maximum, derived from the
landed caps (`MAXIMUM_WARDS` + `ARTERIAL_SEEDS` + `LANE_NODES` + `MAXIMUM_CARTOGRAPHY_BUILDINGS`),
is thorp `32` / hamlet `52` / village `91` / town `188` / city `365` / metropolis `554` —
all far below the legacy plan-view `OP_CEILING = 2200`
(`tests/design/townMapOpBudget.test.js`), which governs a **different** producer and is not
inherited here (§11 D-7).

**Purity:** no PRNG, no fork label, no `while`/`do`, no clock, no store, no float, no
transcendental. Integer plan coordinates only.

**Permitted imports — anything else is a STOP:** `./cartographyPaintRoles.js`,
`./cartographyPlan.js`, `../townScene/cartographyContract.js`.

### 6.3 No colour, structurally

Neither leaf may contain a hex literal, `rgb(`/`rgba(`/`hsl(`/`hsla(`, or any import of
`src/design/tokens.js`, `src/design/townMapStyles.js`, or `src/design/townMapExportPalette.js`.
C4 enforces this by running the contract's **own** `RAW_COLOUR` regex over both leaves'
source text and over every emitted op — one regex, one law, no second spelling.

### 6.4 Bundle posture under CR-TC3B-BYTES — the posture is ZERO

**MEASURED at `58436804`.** The bounded pair is `77,455 + 307,682 = 385,137` against the
strict `< 400,000` ceiling: **`14,862` bytes of headroom**. This packet's expected delta is
**`0`**, because neither new leaf is reachable from the compiler entry.

The transitive static closure of `src/domain/townScene/compileTownSceneManifest.js` has
**107 members** at this base (measured; TC-3b's landed 105 plus TC-4's two leaves, exactly
as TC-4 §6.6 projected). Every module design §6 names for the painter was tested against
that closure and is **outside** it:

| Module | In compiler closure? |
|---|---|
| `src/domain/townMap/bespokeStyles.js` | **NO** |
| `src/domain/townMap/groundDress.js` | **NO** |
| `src/domain/townMap/ageOverlay.js` | **NO** |
| `src/domain/townMap/townMapDraw.js` | **NO** |
| `src/domain/townScene/sceneExportPalette.js` | **NO** |
| `src/design/tokens.js` | **NO** |

**This is the finding that makes TC-5a safe:** the painter family already lives outside the
bounded pair, and the manifest contract forbids colour inside it, so a correctly-sited
painter costs the pair nothing. The danger is not the painter's size — it is any edge that
drags it *in*. Hence C7.

`cartographyContract.js` was measured as a **zero-import leaf** (closure size `1`), so
importing the frozen vocabularies costs no transitive drag in either direction.

⚠ **A correction the implementer must not inherit blindly:** TC-4 §6.6 names
`src/data/institutionalCatalog.js` as being "outside the already-in-closure module families".
**Measured, it is already IN the compiler closure**, via
`src/domain/institutionClassify.js:26`. TC-4's ban on it was sound coupling hygiene but was
never byte protection. This packet's forbidden-import list is re-derived from the measured
closure rather than copied.

⛔ Never raise a literal, never edit `tests/build/townScene3dLazy.test.js`, never add a
`manualChunks` rule.

---

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Projected | Instruction |
|---|---|---|---:|---:|---|
| `CREATE` | `src/domain/townCartography/cartographyPaintRoles.js` | the five §6.1 exports | `90` | `~70` | The palette ROLE program: closed roles, both exhaustive maps, the street weights, the throwing accessor. Imports per §6.1 only. |
| `CREATE` | `src/domain/townCartography/cartographyPaint.js` | `buildCartographyDrawList` | `230` | `~180` | Block → ordered op list per §6.2; geometry copied verbatim; the length identity holds by construction. Imports per §6.2 only. |
| `CREATE` | `tests/domain/townCartographyPaint.test.js` | C1–C6, C8 | `n/a` | | Copy the `compileLeaves`/`leafInputFor` harness shape from `townCartographyBuildings.test.js`; per-test `120_000` timeouts on the corpus cases; every negative anchored via `tests/helpers/anchoredNegatives.js`. |
| `TEST` | `tests/domain/townCartographyDeterminism.test.js` | package pins and scans | `n/a` | | C5/C7 — exactly the four edits in §7b. **Read §7b before touching this file: three of its existing scans would become FALSE ANCHORS if the new leaves were added naively.** |

### 7b. The determinism-test edits, exactly — and the three scans that must NOT take them

`SOURCES` is derived by `readdirSync(PACKAGE)` (`:46`), so both new files enter it
automatically. The explicit rows are the real pin. **The four permitted edits:**

1. **Add two `toContain` rows** beside `:69-77`: `cartographyPaint.js`,
   `cartographyPaintRoles.js`.
2. **Add both leaves to the no-`while`/no-`do` list** at `:243-244`, which carries the
   `export function` liveness anchor at `:250` — an anchor both leaves genuinely satisfy.
3. **Add `cartographyPaint.js` ONLY to the `for (` list** at `:256-257`. It iterates the
   block's rows, so the anchor is true.
4. **Add the C7 source-closure exclusion** as a new assertion, anchored on
   `cartographyBuildings.js` being present in that closure.

⛔ **Three scans these leaves must NOT join, each because the anchor would be FALSE** — this
is TC-4's landing item 4 recurring, and it is a STOP if an implementer "fixes" it by making
the leaf satisfy the scan:

- **The `carto:` label scan (`:217-234`)** asserts each listed leaf spells **exactly one**
  fork label. Both paint leaves are pure presentation adapters that mint **no** label. Adding
  them would force an invented label — new entropy, for nothing.
- **The `sceneDigest(` positive (`:233`)** is part of that same loop. Neither leaf digests
  anything; it copies geometry and looks up a role.
- **The `for (` list (`:256-257`) must NOT take `cartographyPaintRoles.js`** — it is a data
  table with no loop, so demanding `for (` would red the day the file got simpler. This is
  precisely the false anchor TC-4 hit with `cartographyMultiplicity.js`.

Instead, assert the *correct positive* for these two leaves: neither source matches
`/'carto:[^']*'/` and neither matches `/\bsceneDigest\s*\(/`, each anchored on
`cartographyBuildings.js` matching **both** — proving the scan is live rather than vacuous.

Generated artifacts: `NONE`. Do not edit `tests/fixtures/town-cartography-dormancy-golden.json`,
`tests/build/townScene3dLazy.test.js`, `scripts/.size-baseline.json`, or `eslint.config.js`.

**Landing discipline this manifest incurs (standing, non-optional):**

- The one new test file moves the sovereignty lighting census. The implementer **re-derives
  all five figures in ONE run and re-records them whole** — never patching `files` alone
  (the sequence hazard has fired three times). Current row, read at
  `tests/lint/sovereigntyLightingContract.walker.test.js:3621`:
  `2392 / 365 / 2027 / 19659 / 5552`. ⭐ Measure by adding a temporary `console.log` **inside
  the existing census test, before its first assertion**, so the probe mints no title and
  cannot move what it measures.
  ⛔ If a concurrent lane has uncommitted `it(`/`describe(` titles in the tree, re-deriving
  would freeze foreign WIP into the frozen census — that is TC-4's landing item 2 recurring.
  In that case **STOP and report**, do not re-record.
- Every negative in the new suite is anchored. New files start at an un-anchored-negative
  ceiling of **ZERO**; prefer `expectAbsentWithAnchor` / `expectPresentThenAbsent`.

---

## 8. Ordered coding sequence

0. Run §4 preflight and record every baseline. Stop on mismatch.
1. Add the smallest failing focused test rows (C3's vocabulary-coverage cases) — before the
   leaves exist.
2. Implement `cartographyPaintRoles.js`; make C3 green.
3. Implement `cartographyPaint.js` (wards → streets → buildings → identity).
4. Complete C1, C2, C4, C5, C6, C8 in the new suite.
5. Add the C7 closure-exclusion guard and the determinism pins.
6. Run §10 focused checks; then `npm run build && npm run verify:dist`; confirm the pair is
   **unchanged at `385,137`**.
7. Re-derive and re-record the lighting census WHOLE (§7), or STOP per its condition.
8. Run the wave-end gate. Report exact deltas, counts, the pair measurement against B2, the
   census row, and `deviations: NONE` or a STOP.

Do not start by changing a golden, baseline, budget, or persisted shape.

---

## 9. Acceptance matrix — the complete edge-case denominator

| ID | Case | Required observation | Test home |
|---|---|---|---|
| C1 | Real lit compile → paint | Across the corpus: the §6.2 length identity holds exactly; every op's `id` names a record in the block; ward ops precede street ops precede building ops; within each group ids are `byCodepoint` ascending | `townCartographyPaint.test.js` (`120_000`) |
| C2 | Absence and malformation | `null`, `undefined`, and an all-empty block each return a frozen `[]` and do not throw; a block with a non-array layer, and one with a building missing `condition`, each throw the `premise` error — asserted by message prefix | `townCartographyPaint.test.js` |
| C3 | Vocabulary coverage is DERIVED, not restated | `Object.keys(WARD_ROLE_BY_KIND)` ≡ `TOWN_CARTOGRAPHY_WARD_KINDS` exact-set-both-ways; same for `CONDITION_TONE_SHIFT_PERMILLE` ≡ `TOWN_CARTOGRAPHY_CONDITIONS` and `STREET_WIDTH_WEIGHT_PERMILLE` ≡ `TOWN_CARTOGRAPHY_STREET_CLASSES`; every value ∈ `CARTOGRAPHY_PAINT_ROLES`. **Negative control:** `paintRoleForWardKind('not_a_kind')` THROWS — it does not return `default` | `townCartographyPaint.test.js` |
| C4 | No colour, structurally | The contract's own `RAW_COLOUR` regex matches nothing in either leaf's source text and nothing in any emitted op (walked recursively). **Anchored:** the same regex DOES match a spliced control string, proving the scan is live | `townCartographyPaint.test.js` |
| C5 | Determinism and purity | Two builds `stableSceneStringify`-identical; a block whose layer arrays are reversed paints byte-identically; neither leaf source matches `createPRNG`, `.fork(`, `while`, `do`, `Date`, `Math.random` — each negative anchored on a sibling that IS present | `townCartographyPaint.test.js`, `townCartographyDeterminism.test.js` |
| C6 | Geometry is copied, never derived | Every ward op's `polygon` is reference-equal-by-value to the block's ward polygon; every building op's `polygon` equals the block's `footprint`; all vertices integer; no op carries a key outside the §6.2 closed op shape | `townCartographyPaint.test.js` |
| C7 | ⭐ THE BUNDLE PREVENTION GUARD (CR-TC3B-BYTES) | Neither new leaf appears in the transitive **source** closure of `compileTownSceneManifest.js` (the `mapTabShellLazy.test.js` walk, no build needed). **Anchored:** `cartographyBuildings.js` IS in that closure, proving the walk is live. Plus, with `VERIFY_DIST=1`, the bounded pair is **unchanged at `385,137`** | `townCartographyDeterminism.test.js` + `tests/build/townScene3dLazy.test.js` (**run, not edited**) |
| C8 | Tone ladder | `CONDITION_TONE_SHIFT_PERMILLE` is monotone non-increasing along the frozen `TOWN_CARTOGRAPHY_CONDITIONS` order; a building whose ward tone is `0` and whose condition is `ruined` clamps to `0`, and one at `1000`/`pristine` clamps to `1000`; every emitted `tonePermille` is an integer in `0..1000` | `townCartographyPaint.test.js` |

Do not add a ninth case or a speculative cross-product.

**Note for C7 honesty (the TC-4 §9 precedent).** Because this packet's leaves have **zero
importers**, they are tree-shaken out of the build entirely — so the dist half of C7 ("the
pair still reads `385,137`") is a **no-regression control, not a live guard**: it would pass
even if the leaves were written to import the whole catalog. **The source-closure walk is the
real instrument**, which is why it carries its own liveness anchor. The dist half becomes
load-bearing at TC-5b, when the first importer exists — and that is the moment the bounded
pair can actually move. The matrix does not pretend otherwise.

## 9b. LIT-OUTPUT POSTURE — this packet moves NOTHING, and that is the assertion

> **TC-5a changes no output at all — lit or dark.** It adds two leaves that **no production
> module imports**. There is therefore no declared behavior shift, and the obligation is the
> strict inverse of ES-5c's §9b: rather than enumerating goldens that legitimately move,
> this packet asserts that **none does**.
>
> **THE IMPLEMENTER'S OBLIGATION:** run the full gate at BASE and record the green
> golden/pin set. After the change, **any** golden, pin, dormancy fixture, manifest byte,
> or bundle figure that moved is a **STOP**, not a re-record — it means an edge reached
> somewhere this packet does not go.
> ⛔ Specifically: `tests/fixtures/town-cartography-dormancy-golden.json` must be
> byte-identical; the lit and dark manifests must be byte-identical to base; and the bounded
> pair must read exactly `385,137`.
> ⚠ The **only** figures permitted to move are the five sovereignty-lighting-census numbers,
> and only because §7 mandates one new test file. Their new values are recorded whole, in one
> run, with the cause stated (§7).
> ⚠ Two gate reds are **pre-existing at this base and are NOT this packet's**:
> `generatorGoldenMaster` (owner-approved SHIFT-2, registered not re-recorded) and
> `observedShapeReaders.walker` (violations 1, stale 4). Attribute them; never chase them.
> A third red is this packet's until proven otherwise against a committed-base run.

---

## 10. Verification commands

```sh
# Baseline (B1) and focused behavior; the test slot is acquired in the same chain.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townCartographyWards.test.js \
  tests/domain/townCartographyParcels.test.js \
  tests/domain/townCartographyBuildings.test.js \
  tests/domain/townSceneCartography.test.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/property/townCartographyDormancyGolden.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townCartographyPaint.test.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/property/townCartographyDormancyGolden.test.js

npx eslint src/domain/townCartography/cartographyPaint.js \
  src/domain/townCartography/cartographyPaintRoles.js \
  tests/domain/townCartographyPaint.test.js \
  tests/domain/townCartographyDeterminism.test.js

npm run typecheck:ratchet
npm run typecheck:domain:strict

# C7 — build FIRST; verify:dist reads dist/ and skips without it.
npm run build
npm run verify:dist

# Census re-derivation (§7), then the landing gate.
npm run check:tail
```

Expected exit `0` everywhere. ⚠ **Never read a gate through a pipe** — use `npm run check:tail`
or `sh scripts/gate-tail.sh <command...>`; a piped read reports the PIPE's status and has
greenwashed red gates. Report actual counts, the measured pair against B2's `385,137`, the
re-derived census row, and the golden/pin no-motion result — a green run without the numbers
is not a receipt.

---

## 11. Recorded deviations from design prose (each vetoable)

1. **D-1 — The palette emits ROLES, not colours, and this packet never reads
   `src/design/tokens.js`.** Design §11c (A-9) says colour derives from tokens; the landed
   contract (`cartographyContract.js:38-42`, `rejectRawColour`) already ruled that colour
   cannot live in the manifest at all. Splitting role (here) from value (TC-5b) satisfies
   A-9 exactly while keeping this leaf provably colour-free and token-free.
2. **D-2 — ⚠ THE NAME `Illustrated` IS ALREADY TAKEN, and by a paid-adjacent surface.**
   `src/design/townMapStyles.js:74` defines `ILLUSTRATED_STYLE_ID = 'illustrated'`, a live,
   **pickable** lens in `TOWN_MAP_LENS_IDS` (`:78`) whose own docblock warns that misfiling
   it "would silently bump the paid `LENS_COUNT`". That lens paints the **legacy
   `TownMapModel`**, not the cartography block. Shipping a Map sub-tab also called
   "Illustrated", painting a *different* picture, is precisely the second-settlement-truth
   failure design §1 forbids. **This packet mounts nothing, so it does not resolve the
   collision — it records it as a blocking input to TC-5b (§12 O-2).**
3. **D-3 — No op ceiling is authored.** CR-TC4-BAND-1's lesson is applied one step further:
   instead of deriving a band from a cap, §6.2 states an **identity**, which cannot disagree
   with anything. The per-tier maxima in §6.2 are documentation, not a pin.
4. **D-4 — "Audience variants" (design §6) require NO work and are not in scope.** Measured:
   `compileTownSceneManifest.js` threads `audience` through the base manifest **before**
   the cartography stage runs (`:265`, `:516-519`), and the block derives entirely from that
   already-projected base. A player-audience manifest therefore already lacks covert
   structures, and the painter inherits the projection by construction. The obligation this
   creates is a prohibition, not a feature: **the painter must never filter at paint time.**
   §6.2 has no audience parameter, which is what enforces it.
5. **D-5 — No `lynchRubric` gate.** Design §4.6 and §11d cast `lynchRubric` as a structural
   grammar and a legibility GATE. Measured: `scoreLynch` is **never called from the
   cartography path** — it scores `townLayoutV2.js`'s legacy `LayoutCandidate` shape, a
   different type. Wiring a rubric gate means either an adapter or a second scorer, and it
   would gate *synthesis* (TC-2/3/4's compiler), not the painter. Out of scope; recorded for
   the chair as a genuine unbuilt piece of A-10 (§12 O-4).
6. **D-6 — `parcels[]` paints nothing.** A parcel is a placement slot; drawing it would put a
   non-thing on the map. If TC-5b's debug overlay wants them, it can read the block directly.
7. **D-7 — The legacy `OP_CEILING = 2200` is NOT inherited.**
   `tests/design/townMapOpBudget.test.js` governs `buildTownMapDrawList(model, 'illustrated')`,
   a different producer over a different input. Asserting this packet's output against it
   would be a pin aimed at the wrong subject.
8. **D-8 — Design §3's ward field is named `tone`; live emits `tonePermille`**
   (`cartographyWards.js:241`). §6.2 follows the code. Design prose drift, recorded not
   repaired.

---

## 12. Open items for the chair — the author could not settle these from code

Each carries a recommendation, per the standing instruction that a delegated call is decided
within scope and recorded vetoably rather than bounced back.

- **O-1 — TC-5b's mount is an OWNER-GATED persistence question, and the design's own plan for
  it is wrong as written.** `mapSubTabs.js:30-34` says the painter's id "joins
  `PRESENTATION_SUB_TAB_IDS`". Measured, that list **is**
  `TOWN_MAP_VIEW_IDS` from `src/lib/lastMapView.js:23`, the **persisted localStorage
  vocabulary**, whose own docblock reads: *"Never rename an id in place: old device entries
  may outlive several releases."* Joining it is a persisted-vocabulary change — an
  owner-gated class.
  **RECOMMENDATION: seat the painter as a NON-presentation sub-tab, exactly as `player` is**
  (`MAP_SUB_TAB_IDS = [...PRESENTATION_SUB_TAB_IDS, MAP_SUB_TAB_PLAYER, <painter>]`). Then
  `isPresentationSubTab()` is false, `presentationViewFor()` returns `null`, no sidecar write
  occurs, the persisted vocabulary is untouched, and the shell mounts its own leaf — which is
  architecturally correct anyway, because the painter is its own surface rather than a
  projection of the plan pane. This needs no owner gate. *Decide before TC-5b is compiled;
  it does not block TC-5a.*
- **O-2 — Name the painter surface.** Given D-2, `illustrated` is taken.
  **RECOMMENDATION: `cartography`, labelled "Cartography".** It is unambiguous against the
  legacy lens, matches the program and flag name (`townCartographyEnabled`), and leaves
  "Illustrated" meaning what it already means to paying users. Rejected: `illustrated2`,
  reusing `illustrated` and retiring the lens (a paid-surface change — owner-gated, and not
  a repair).
- **O-3 — The §6.1 authored numbers** (twelve ward-kind roles, six condition shifts, two
  street weights) are packet-authored tuning for a dark-flagged surface that renders nothing,
  per the `MAXIMUM_WARDS` / `PARCELS_PER_WARD` / TC-4 §6.4 precedent. Each is individually
  vetoable; none is owner-physical tuning of a lit surface, so none needs the tuning
  signature. **RECOMMENDATION: approve as authored**; C3 and C8 guard them against drift and
  against a silent default-fall.
- **O-4 — The A-10 rubric gate is genuinely unbuilt** (D-5). Design §11d makes `lynchRubric`
  the structural grammar for TC-2..TC-5, and no cartography code calls it.
  **RECOMMENDATION: record it as a named later slice (`TC-2r`, a synthesis-side rubric
  adapter) rather than silently absorbing it into a painter packet** — it gates geometry, and
  geometry landed three waves ago. It is a real gap in A-10's discharge, not a TC-5 omission.
- **O-5 — Ratify the four-way split** (§-1) or re-scope. The packet set is written assuming
  TC-5a lands alone and TC-5b is compiled only after it.
  **RECOMMENDATION: ratify.** TC-5b carries the only user-facing surface, the only first-paint
  risk (`5` bytes of CSS headroom, §4 B7), and the O-1/O-2 decisions; keeping it separate is
  what lets TC-5a be a zero-risk, zero-output-motion landing.
- **O-6 — Census re-record sequencing.** §7's mandated new test file moves the lighting
  census, and TC-4's landing already deferred one such re-record because a concurrent lane
  held uncommitted titles. **RECOMMENDATION: the chair confirms no concurrent lane holds
  uncommitted `it(`/`describe(` titles at dispatch time**, so TC-5a can re-record whole
  instead of deferring a second time — a second deferral would leave the census
  PARTIAL, which is the status the hazard-conversion law says hides.

---

## 13. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md`, stop if:

- **THE COUPLING-PAIR TRAP: a new module is ALWAYS a new importer.** Either leaf needing any
  import outside §6.1/§6.2's enumerated sets is a STOP, not a convenience. Verify by the
  cut-one-edge rule: for each import added, name the chain that already places the target in
  the painter's family; **and separately confirm the import does not create a path from
  `compileTownSceneManifest.js` to either leaf.**
- **Any production module imports either new leaf.** This packet's consumer count is `0` by
  design. The first importer is TC-5b's component, and it is not written here.
- `workerBytes + manifestCompilerBytes` reads anything other than `385,137`, or the compiler
  closure gains any member beyond the measured `107` — do not raise a literal, do not edit
  `townScene3dLazy.test.js`, do not add a `manualChunks` rule (CR-TC3B-BYTES).
- Any golden, pin, dormancy fixture, or manifest byte moves at all (§9b) — the only permitted
  motion is the five census figures.
- Any solution needs a schema field, key, vocabulary member, or version bump, or any edit to
  `cartographyContract.js`.
- Any solution needs a PRNG draw, a fork label, a `while`/`do` loop, a float, a colour value,
  a `src/design/` import, React, a store read, or a clock read.
- A concurrent lane holds uncommitted test titles at census-re-record time (§7) — report, do
  not re-record, do not census a live shared tree.
- Any §3/§7 cap — the `320` total, either leaf cap, the four files, the eight cases — would
  be exceeded. Propose the smallest split; never renegotiate the budget.
- The `illustrated`/naming collision (D-2) is resolved by touching `townMapStyles.js`,
  `TOWN_MAP_LENS_IDS`, or anything entitlement-bearing — that is a paid-surface change and
  is owner-gated.


## Chair rulings at the READY flip (2026-08-11) — all six items CLOSED

Fable-issued; implementing them owes no post-boundary row. Reopen none.

- **O-5 SPLIT RATIFIED.** TC-5 as designed is four-to-five behavior families against a
  budget of one. The calibration is decisive: the EXISTING plan-view emitter
  `townMapDraw.js` is **264 effective lines alone**, with no palette, no audience variant,
  no PNG and no sub-tab. **TC-5a** (pure draw-list + palette roles, headless) → **TC-5b**
  (sub-tab mount + colour binding + A-4 degraded states) → **TC-5c** (PNG goldens) →
  **TC-5d** (skins; AI controls deferred beyond). Compile each just-in-time after its
  predecessor lands, per CR-ES5B-7's precedent.
- **⭐ O-1 ACCEPTED — seat the painter as a NON-PRESENTATION sub-tab, like `player`.**
  This is the ruling I most want kept: `mapSubTabs.js`'s own documented extension point
  turns out to be `TOWN_MAP_VIEW_IDS`, which **IS the persisted localStorage vocabulary** —
  so following the design's stated plan would have silently made a UI addition into a
  PERSISTENCE-SHAPE change, owner-gated, discovered only after the fact. The
  non-presentation seat reaches the same product outcome and **touches no persisted
  vocabulary at all.** Take the door that is not a gate.
- **⭐ O-2 ACCEPTED — the id is `cartography`, NOT `illustrated`.** CONFIRMED at
  `src/design/townMapStyles.js:74`: `ILLUSTRATED_STYLE_ID = 'illustrated'` is a **live
  PICKABLE lens** that RE-SHAPES geometry and paints the LEGACY TownMapModel, with a
  docblock warning about the paid `LENS_COUNT`. Two pictures called "Illustrated" is
  precisely the second-truth mode the design's own §1 forbids.
- **O-3 APPROVED AS AUTHORED.** The §6.1 numbers are packet-authored tuning for a
  dark-flagged, headless, presentation-only surface (the MAXIMUM_WARDS / TC-4 O-3
  precedent). Individually vetoable; none is lit-surface tuning, so none needs the tuning
  signature. ⛔ The implementer may not tune them.
- **O-4 RECORDED AS A SEPARATE SLICE.** `scoreLynch` is never called from cartography — it
  scores `townLayoutV2`'s legacy shape — so the §4.6/§11d rubric gate is a real unbuilt
  piece of A-10 belonging to a SYNTHESIS-side slice, not to a painter. Deliberately
  deferred, documented, not a bug to re-find.
- **O-6 ANSWERED BY MEASUREMENT: the tree is clean.** `git status --porcelain` returns
  ZERO at `58436804`, so no lane holds uncommitted test titles and the census re-record is
  safe to take in-packet. ⚠ Re-verify at preflight — a second deferral would leave it
  PARTIAL, which is the status that hides.

**⚠⚠ TWO CORRECTIONS TO LANDED DOCUMENTS, recorded here rather than by rewriting them:**
1. **TC-4 §6.6 names `src/data/institutionalCatalog.js` a forbidden import "outside the
   closure". IT IS ALREADY IN THE CLOSURE**, via `institutionClassify.js:26`. The
   prohibition remains sound COUPLING HYGIENE but was never BYTE protection, and a future
   packet must re-derive its forbidden list **from the measured closure**, never by copying
   a sibling's.
2. The chair's own dispatch brief cited `§13b`/`§9b` for TC-4 (it has **§12b** and
   **§6.6** — `§9b` is an ES-5x convention) and told the lane to measure rendered CSS from
   `stats.html`, **which does not exist in this repo.** The lane measured from the dist
   artifact instead and was right to.

**⭐ THE BUNDLE CEILING IS NOT THIS PACKET'S BINDING CONSTRAINT, and that is measured, not
assumed:** the pair sits at **385,137 of a strict 400,000** (worker 77,455 + compiler
307,682; closure exactly 107 members, as TC-4 §6.6 projected). But **every module the
painter needs is OUTSIDE the compiler closure**, and `cartographyContract.js:38-42` already
rules *"NO COLOUR, EVER"* with a live `rejectRawColour` validator. A correctly-sited painter
costs the pair ZERO; the only risk is an edge dragging it in, which is why that is an
acceptance case rather than a hope.
⚠ **The CSS budget has FIVE BYTES of headroom** — 19,795 B against `CSS_BUDGET_BYTES =
19_800`, not the design's claimed 4.5KB margin. Measure RENDERED bytes from the dist
artifact.
⭐ The lane killed TC-4's two-inconsistent-tables class STRUCTURALLY rather than avoiding
it: every vocabulary map DERIVES its key set from the frozen contract vocabularies
(exact-set-both-ways, with a throwing accessor so an unknown kind cannot silently fall to
`default`), and the draw-op ceiling is **an identity over the block's own record counts** —
no band, no cap, nothing that can drift.
