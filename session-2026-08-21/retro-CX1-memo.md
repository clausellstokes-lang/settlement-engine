# CX-1 MEMO — the codex first-map vertical slice, read-only verification

**Subject:** `codex/first-map-vertical-slice` @ `eedd4e9c`, built directly on the build tip
`4eafca31` (claude/composite-r4), 2026-08-20 21:18 → 08-21 02:34.
**Lane:** CX-1, read-only. No git state mutated, no gate run, no checkout. Every figure below
is either quoted from a committed object or recomputed by me from a committed object.
**For:** ODQ §296, the Fable chair.

---

## WHAT IT ACTUALLY IS — in plain language

It is **not a map generator.** It is a **compiler stack with no input producer.**

Nothing in `src/` can construct the one plan shape the whole stack admits. I grepped for every
construction of the admitted plan kind across the entire tree:

```
=== who constructs the plan? ===
src/domain/townMap/fabric/settlementFoundation.js:5:export const ORTHOGONAL_CROSS_PLAN_KIND = 'ORTHOGONAL_CROSS_V1';
tests/fixtures/townMapSettlementFabricFixtures.js:42:    kind: 'ORTHOGONAL_CROSS_V1',
```

Two hits. One declares the constant; one is a **test fixture** with hand-typed coordinates
(`groundRing: [[50,50],[950,50],[950,950],[50,950]]`, streets at fixed quantized bands). There is
no `settlement → plan` step, no dossier read, no seed, no RNG. Given that plan, the stack derives
street centerlines → a cadastral boundary arrangement → a planar DCEL → a parcel registry →
frontage-first plot subdivision → two explicit building masses → a fixed-survey projection →
canonical save bytes → one registered fantasy construction. Every one of those steps is a **pure,
replay-checked, hash-sealed function over explicit inputs.**

So: it is the **structural foundation and contract home** — DCEL, registries, artifact identity,
persistence, operations, projection seam — exactly the thing §287.9 says the repaired sandbox
`fabric/**` should eventually port *into*. It is **not** a rival to the sandbox generator, because
it has nothing to generate *from*. It is **dormant**: zero consumers anywhere in `src/` outside
its own directory.

The one honest caveat: `frontage.js` does *derive* morphology (plot widths, stagger, backland)
from four numeric axes plus a threshold keyed off the foundation's content hash. That is the same
*kind* of work the sandbox's `parcels.js`/`streets.js` do. The difference is where the axes come
from: here they are caller-supplied integers with the tier/culture/wealth doors nailed shut; in
the sandbox they are dossier-conditioned. Same shape of computation, opposite end of the wire.

---

## 0. Scope correction — the brief undercounts the branch

**CONFIRMED.** The §296 census says "five packets." The branch actually lands **thirteen**:

```
eedd4e9c docs(town-map): terminalize MF-T1X fantasy construction
f4ad467d feat(town-map): land MF-T1X fantasy construction
d9953a29 docs(town-map): promote MF-T1X fantasy construction
39715d75 docs(town-map): terminalize MF-T1S persistence
136efaa5 feat(town-map): land MF-T1S persistence
84ed1d71 docs(town-map): promote MF-T1S persistence
7913cab3 docs(town-map): terminalize MF-T1V projection
66dbed7c feat(town-map): land MF-T1V massing projection
4cdeec49 docs(town-map): promote MF-T1V projection packet
838710e9 docs(implementation): terminalize MF-T1M
bffd1bcb feat(town-map): land MF-T1M explicit massing roster
9403370a docs(implementation): promote MF-T1M massing roster
8ba553a3 docs(implementation): terminalize MF-T1F
325e16aa feat(town-map): land MF-T1F fabric root
78f44f53 docs(implementation): seal MF-T1F fixture contract
56d1ce8d docs(implementation): ready MF-T1F
d6b4b3d5 docs(implementation): terminalize MF-T1P
7fd8ad3f feat(town-map): land MF-T1P parcel registry
...
7c34f50f feat(town-map): land MF-VS1 canonical slice
```

Thirteen packet IDs — **MF-VS1, MF-SH1, MF-W3S1, MF-T1G, MF-T1N, MF-T1A, MF-T1D, MF-T1P, MF-T1F,
MF-T1M, MF-T1V, MF-T1S, MF-T1X** — all `LANDED` in `PACKET_MANIFEST.json`. The manifest goes
**116 → 129 packets, 0 READY** (recomputed from both blobs).

Also: **18** fabric modules, not 19 (`ls` of the directory at HEAD returns 18 files including
`index.js`). The §296 row's list is right; the count is one high.

**Codex worktree state** — `/Users/cstokes/.codex/worktrees/first-map-vertical-slice`:

```
PORCELAIN_START
PORCELAIN_END exit=0
## codex/first-map-vertical-slice
--- untracked incl ignored dirs count ---
       0
```

**Clean. No dirt, no untracked files, HEAD == eedd4e9c.** Nothing of the owner's is at risk there.

---

## 1. PACKET DISCIPLINE

**Verdict: the strongest part of the work. Receipts are real, detailed, and quoted — with one
structural gap at the tip.**

### 1a. Every packet carries a full completion receipt — CONFIRMED

All five subject packets (and the eight predecessors) carry a `## Completion receipt` section with
base SHA, seal/capsule digests, effective-line ledgers against declared budgets, per-case A1–A6
results, both typecheck configurations, byte pins, and a whole-tree gate line. Example, MF-T1F §12:

> - Wave-end gate stages: final `npm run check:tail` exit `0`; test ratchet `28,616` tests with the
>   inherited `11` known failures and no new failure; lint `29` warnings/`0` errors; build passed in
>   `27.80s`; prerender wrote `314` routes; strict dist `409/409`
> - Both typecheck configurations: full ratchet `173/173`, no regression; domain-strict `1134/1134`
> - Base-versus-wave failure identity diff: `NONE`

MF-T1X §16 goes further, quoting the actual artifact hashes and the privacy invariant:

> PUBLIC before/after remains exactly `scene-v1-b90080500e9e0a99b6ee469444832743`.

These are not lifecycle prose. They are the receipt shape this program uses.

### 1b. The terminalize commits carry NO receipt — CONFIRMED, and it matters

```
----- eedd4e9c -----
docs(town-map): terminalize MF-T1X fantasy construction
(no body)
```

All five terminalize commits are bare one-line subjects. The receipts live in the packet `.md`
files, which is the program's normal home — so this is **form, not substance**, *except* that the
terminalize commits are where the receipt text was *written*, i.e. after the last gate. See §6.

### 1c. `requiredSymbols` rows are sane — CONFIRMED

I parsed all 13 new manifest rows and regex-scanned every `symbol` value for figures or line
references:

```
suspicious requiredSymbols (figures/lines): NONE
```

Every row is `{path, symbol}` with symbols of the form `export function sealFabricFoundation`,
`export const CURRENT_MAP_TRADITION_ID`. No re-recorded figure was trapped into `requiredSymbols`
— the hazard that traps every later train is **not** incurred here.

### 1d. `PACKET_MANIFEST.json` was NOT re-serialized — CONFIRMED

```
docs/implementation/PACKET_MANIFEST.json | 2536 ++++++++++++++++++++++++++++++
 1 file changed, 2536 insertions(+)
```

**Zero deletions.** Purely additive. The never-re-serialize law holds.

### 1e. One item the packets did that no packet should — FLAG

The `MF-VS1` commit rewrote the top of `docs/implementation/INDEX.md` — the CANONICAL dispatch
surface — with **self-authored governance prose**:

> - **Fable / Opus handoff law:** there is no coding authority. Do not redispatch
>   MF-T1X or infer a successor from the historical program log. Any continuation
>   must first derive and promote a new finite packet.

and demoted the standing pointer:

> - **Historical integration record (retained below):** the older minifold status
>   is provenance, not the active first-map continuation state.

An implementing lane wrote a "handoff law" into the canonical index and relabelled the chair's
own code-of-record pointer as "historical." That is a governance act, not an implementation act.

---

## 2. ARCHITECTURE CONFORMANCE against §287–§290

| Law | Verdict | Evidence |
|---|---|---|
| **(a) §289.1 origin-neutral compiler, four origins** | **CONFORMANT — CONFIRMED** | `building.js:21` `CANONICAL_ORIGIN_KINDS = Object.freeze(['AUTHORED','BUILT_IN','CUSTOM','IMPORTED'])`; `building.js:244` — *"Geometry-only compiler. Origin is deliberately not an argument."* `compileOriginNeutralBuildingGeometry(input)` takes no origin; `bindBuildingOrigin` attaches it **after** geometry is sealed. `townMapCustomParity.test.js:24` pins `custom.mass.geometry` `toEqual` `builtIn.mass.geometry` while the recipe and mass hashes differ — exactly §289.2's "hashes may differ, invariants may not." |
| **(b) §287.5 integer coordinate ABI, versioned** | **CONFORMANT — CONFIRMED** | `FABRIC_COORDINATE_ABI = 'plan-q1-0-1000-v1'`, `SHAPE_COORDINATE_ABI = 'plan-q1-xy-zup-radial16-v2'`. All coordinates pass `requireCanonicalInt` (`Number.isSafeInteger`, 0..1000). Circular shapes use an integer unit ring over `UNIT_DENOMINATOR = 1024`, not trig. Every artifact stamps `coordinateAbiVersion` and every downstream compiler asserts equality. **Caveat:** two ABIs coexist and there is no ABI manifest artifact — MF-T1F §1.3 says so honestly: *"The full `CanonicalFabricArtifact` contract also requires genuine `coordinateAbiRef`, `lawManifestRef` and `provenanceRef`. Those artifact families do not yet exist… so this packet may not claim `artifactKind: 'FABRIC'`."* |
| **(c) §287.5 exact solid intersection for volume legality** | **NOT IMPLEMENTED — and not claimed** | Grep for `overlap\|intersect\|legality` in `fabric/` returns only DCEL noding checks and one area-conservation sum. Volume disjointness is enforced by **identity**, not geometry: `operations.js:257-261` refuses on duplicate `buildingId`, duplicate `plotId`, or duplicate `constructionOperationId`. Footprints are forced to equal the fitted W3 footprint (`building.js:195`), so one plot ⇒ one body by construction. No solid/solid test exists. |
| **(d) identity vs address; keyed randomness; no ambient nondeterminism** | **CONFORMANT — CONFIRMED** | `grep -rn "Math\.random\|Date\.now\|new Date\|toLocale\|performance\.now\|crypto\.\|process\.env\|Intl\." src/domain/townMap/fabric/` → **NONE**. The only stochastic-looking value is `frontage.js:64-68` `stopThresholdQ`, which reads 8 hex chars out of the **foundation content hash** — keyed, not sampled, and commented as such: *"Seeded stop threshold, not a sampled plot-size distribution."* IDs are content-derived (`massing-construction-state:${sceneDigest(...)}`) or caller-supplied canonical IDs, kept separate from positions. |
| **(e) §287.4 no same-pass map→economy→map feedback** | **CONFORMANT — CONFIRMED** | `grep localStorage\|supabase\|writeFile\|fetch(\|indexedDB\|sessionStorage` in `fabric/` → **NONE**. Every exported function is pure: input → frozen artifact. Nothing writes world state; there is no writer at all. `executeFantasyConstruction` returns `{constructionState, receipt}` and mutates nothing. |
| **(f) §287.7 MapDocument/undo vs accepted lived history** | **NOT ENGAGED — CONFIRMED** | `grep -rn "undo\|revert\|rollback\|history\|lived"` in `fabric/` → **zero hits.** There is no undo, no event log, no history surface. Nothing can remove accepted lived history because nothing touches it. |
| **(f′) §287.7 the domain door** | **DIVERGENT — flag** | The slice mints its **own** operation family — `artifactKind: 'CANONICAL_SPATIAL_OPERATION'`, `gate: 'EXPLICIT_FANTASY_CANON'`, its own `FANTASY_CONSTRUCTION_RECEIPT` — entirely outside the app's existing operation registry, authority, `ActionResult` and durable outbox. §287.7 calls that door "non-negotiable" for accepted canonical changes. Defensible today (nothing here is *accepted*; it is headless), but it is a **second operation vocabulary** that a later port must reconcile or delete. |
| **(g) §289.3 missing-package read-only recovery** | **CONFORMANT — CONFIRMED, with a naming split** | `content.js:209` `readOnly: resolutionReport.unresolved.length > 0`; `assertFirstSliceMutable` throws `unresolved custom content makes this map artifact read-only`; the saved masses are **preserved byte-for-byte** (`expect(saveFirstSliceDocument(loaded.document)).toBe(bytes)`), never omitted. `projection.js:367` emits `warnings: [{ code: 'UNRESOLVED_CUSTOM_CONTENT', entityId }]` and a visible `UNRESOLVED_CUSTOM_CONTENT` semantic primitive. The **resolution report** uses a different token, `'UNRESOLVED_PACKAGE_MISSING'`; §289.3's word appears only on the projection side. Semantics right, vocabulary forked. |
| **(h) §288.8 PLANAR_V1 / no probe / no height fabrication** | **MIXED** | `grep -rn "PLANAR_V1" src/ tests/` → **zero hits anywhere in the repo.** Legacy maps were not touched, so §287.6's PLANAR_V1 clause is simply not engaged. Heights are **not fabricated** — `baseElevationQ`, `wallTopQ`, `roof.eaveQ`, `roof.ridgeQ` are all explicit caller inputs, range-checked, and `eaveQ !== wallTopQ` throws. No probe mode exists. **But** the slice *does* publish a light profile (`FIXED_SURVEY_LIGHT_V1`, `mode: 'FIXED_SURVEY'`, `directionQ: [2,1]`, `shadowRunDenominatorQ: 4`) while §288.8 states *"IMPLEMENTATION IS DORMANT"* and puts fixed survey after D4. That profile carries **no `GLOBAL_CELESTIAL` source, no azimuth/elevation pair, no Sun/Moon typing, no receiver-separation or clamp-law record** — §288.2 and §288.3 require all of those of "every published dimensional light profile." It is an integer shadow-offset approximation wearing the §288.4 name. |
| **(i) §287.15 / §289.5 EUROPEAN_FANTASY_BASE, no culture-token geometry** | **CONFORMANT — CONFIRMED** | `CURRENT_MAP_TRADITION_ID = 'EUROPEAN_FANTASY_BASE'` is stamped on every artifact and **asserted for equality** at every downstream compiler (`streetGeometry.js:55`, `streetGraph.js:63`, `boundaryArrangement.js:182`, `dcel.js:79`, `parcelRegistry.js:169`, `fabricRoot.js:89`). Grep for `culture|arabic|east_asian|mesoamerican|south_asian|steppe|tier|wealth|prosperity|medieval` in `fabric/` returns **three comment lines only**, all of which are refusals: *"no district/tier/culture-specific variant exists"*, *"Nothing is inferred from tier, culture, wealth, evidence, or a renderer."* And `townMapFrontageW3.test.js:42-46` executes that refusal — `{...axes, tier:'city'}`, `{...axes, culture:'anything'}`, `{...axes, wealth:900}` each `.toThrow(/must be exactly/)`. |

**§290.1 vs §287–§288 build order — the real architectural tension.** §288.8 and §291.4 both fix the
order as *retrovalidation → D0 offset → manifest/ABI/solid/receipt/DCEL → fresh W3 → D3a → D4 → the
parity slice*. This branch built **the parity slice first** (§290.1's release-blocking tranche) and
back-filled DCEL/registry foundations underneath it, skipping D0, the offset kernel, the solid
legality family, D4 occlusion, and fresh W3. The result is coherent in itself but arrives at
§290.4's "MANDATORY REVIEW STOP" from the wrong direction.

---

## 3. THE FIFTH-AUTHORITY QUESTION (§287.9)

**Verdict: NOT a fifth authority. It is the contract/foundation home, and it is DORMANT.**
Four independent lines of evidence:

**(i) No input producer.** Already quoted above: the only construction of `ORTHOGONAL_CROSS_V1` in
the entire repo is a test fixture. `sealFabricFoundation(input)` requires an explicit `plan` object;
`compileOrthogonalCrossStreetGeometry` requires an already-sealed foundation and refuses anything
else (`street geometry requires the admitted surface cross foundation`). The chain bottoms out in a
hand-typed 900×900 rectangle. **A settlement cannot be mapped by this code today.**

**(ii) No dossier or world reads.** Full outbound import list for the 18 modules:
`../../deterministicSort.js`, `../../townScene/stableScene.js`, `../townMapDraw.js`,
`../../../design/townMapExportPalette.js`. Four modules, all leaf utilities. **No settlement, no
dossier, no worldState, no pulse, no fabricRead.**

**(iii) No consumers.** I grepped every exported symbol across `src/` excluding the fabric dir:

```
--- compileOrthogonalCrossFirstSliceFabricRoot ---   (no src consumer outside fabric/)
--- subdivideSettlementFrontages ---                 (no src consumer outside fabric/)
--- projectFirstSliceFixedSurvey ---                 (no src consumer outside fabric/)
--- executeFantasyConstruction ---                   (no src consumer outside fabric/)
--- createFirstSliceMassingDocument ---              (no src consumer outside fabric/)
--- compileExplicitBuildingMass ---                  (no src consumer outside fabric/)
```

Neither `TownScene` nor `TownMapModel` nor any React/PDF/export surface touches it. The `fabric*`
hits elsewhere in `src/` are all the **pre-existing, unrelated** `townMap/fabricRead.js` (task #39
urban-fabric read API) — a name collision, not a consumer.

**(iv) The one wire that does exist.** `src/domain/townMap/index.js` gained:

```js
// MF-VS1 — the bounded canonical fabric path. This is headless and explicit-input: …
// It does not wake the legacy generators.
export * from './fabric/index.js';
```

That barrel **is** imported by 14 live modules (`src/pdf/SettlementPDF.jsx`,
`src/components/townMap/useTownMapPresentation.js`, `src/lib/townMapExport.js`, …). So the fabric is
now inside the *static* import graph of the app — but the barrel's own header records why that is
survivable:

> This barrel (and everything under src/domain/townMap/) is imported by NOTHING eager
> — only test files and the future lazy viewer pane import it — so the entry
> static closure stays byte-identical (the first-paint budget is unmoved).

and `tests/build/townMapLazy.test.js` exists precisely to enforce that (*"must stay OUT of the
entry's…"*). It is a gate member and the packets report the full chain green. I checked for ESM
`export *` name ambiguity against the barrel's ~120 other exports and found **no collision**.

**Conclusion.** This is the structural foundation the repaired sandbox `fabric/**` is meant to port
into — DCEL, registries, artifact identity/hashing, save bytes, the operation seam, the
projection/DrawList seam. It cannot compete with the sandbox generator because it has no generator.
**Dormant, addressable, and directly on §287.9's stated target path.**

---

## 4. TEST SUBSTANCE

**Verdict: substantially real. No member of the four pin-vacuity families found. The
`tests/property/` label is a misnomer — these are example-based determinism tests, not
property-based ones, and there are no seeds to fork (the design has no RNG).**

### Strongest four

**1. `tests/property/townMapPlanarDcelDeterminism.test.js` (112 lines) — genuinely independent
oracle.** It does not compare the DCEL to itself. It walks the half-edge `next` cycles by hand,
resolves each `originVertexId` back through `geometryRef` into the **arrangement's** coordinates,
and computes shoelace signed areas:

```js
expect(variantAreas.filter((area2) => area2 > 0)).toHaveLength(9);
expect(variantAreas.filter((area2) => area2 < 0)).toHaveLength(1);
expect(variantAreas.filter((area2) => area2 > 0).reduce((sum, a) => sum + a, 0)).toBe(-exteriorArea2);
```

Nine bounded faces + one exterior, and interior area sums to the exterior's negation. Euler-class
evidence computed from a *different* artifact than the one under test. It also pins **purity** —
`expect(Object.isFrozen(replayedFoundation.ground.ring)).toBe(false)` — catching the classic
"compiler froze the caller's witness" defect. And a maximum-ID arm proving member IDs don't grow
with the artifact ID.

**2. `tests/domain/townMapFantasyConstruction.test.js` (383 lines, 6 titles) — the strongest single
file.** It carries (a) **snapshot-once accessor probes**: `expect([mechanismProbe.reads(),
operationProbe.reads(), executionProbe.reads()]).toEqual([1, 1, 1])` — a real anti-TOCTOU control;
(b) a **privacy invariant executed both ways**: adding a DM-private third building leaves
`stableSceneStringify(publicAfter)` byte-equal to `before` *and* the SVG string identical, while the
DM projection gains exactly `['SHADOW','BUILDING','ROOF_RIDGE']`; (c) a **six-class refusal matrix**
driven through `expect(run, \`${classLabel}: ${label}\`).toThrow(TypeError)`; (d) **literal external
hash pins** (`scene-v1-b90080500e9e0a99b6ee469444832743`) that also appear in the MF-T1S and MF-T1X
receipts; (e) an **absence pin** that no second executor alias exists.

**3. `tests/domain/townMapMassingPersistence.test.js` (424 lines, A1–A6)** — A1 pins detached bytes
*and* non-freezing of caller input; A2 proves an empty active-package view preserves visible
geometry and flips read-only; A5 keeps the unresolved identity DM-only while PUBLIC bytes and SVG
stay equal. That last one is the §289.3 + privacy pair tested together, which is the right shape.

**4. `tests/domain/townMapCustomParity.test.js` (78 lines)** — three tests, all doing work: the
origin-neutrality differential; a negative control that a *different* recipe cannot be substituted
at the binding boundary (`.toThrow(/cannot be substituted/)`); and full save → remove-package →
reload → still-visible → read-only → projection-warning → SVG round trip. Honest caveat: test 1's
`custom.mass.geometry toEqual builtIn.mass.geometry` is **structurally guaranteed** because origin
is not a parameter — it is a real leak guard, but a low-yield one.

### `townMapFrontageW3.test.js` (47 lines) — REAL WORK, not a name reservation. CONFIRMED

Three tests. The middle one is the good one — a **four-way differential responsiveness matrix**
proving each of the four morphology axes moves a *distinct, named* metric and no other:

```js
expect(size.metrics.stopThresholdQ).not.toBe(base.metrics.stopThresholdQ);
expect(chaos.metrics.splitStaggerQ).not.toBe(base.metrics.splitStaggerQ);
expect(variation.metrics.frontageWidthSpreadQ).not.toBe(base.metrics.frontageWidthSpreadQ);
expect(emptiness.metrics.backlandAreaQ).not.toBe(base.metrics.backlandAreaQ);
```

Third test is the tier/culture/wealth refusal quoted in §2(i). This is a real dial-liveness pin of
the kind this program built the "unreachable arm" doctrine for.

### Weakest two

**1. `tests/property/townMapSettlementFabricDeterminism.test.js` (28 lines, 1 title).** Runs the
fixture twice, once with reversed cells, once through JSON round-trip; compares bytes. That is
idempotence + input-order invariance + serialization stability — all genuine, but all comparing the
function **to itself**. It cannot catch a wrong-but-stable derivation. Its last line,
`expect(replayed.contentHash).toBe(first.subdivision.contentHash)`, is **subsumed** by the byte
equality two lines above — a mild instance of the redundant-guard shape.

**2. `tests/property/townMapStreetGeometryDeterminism.test.js` (31 lines, 1 title).** Same shape,
plus a purity check that is asserted **twice in the same test** with no intervening mutation
(`expect(Object.isFrozen(replayedFoundation.ground.ring)).toBe(false)` at line 20 and again at line
29). The first assertion is vacuous — it fires before the compiler has run.

**Neither is a vacuity-family member** (the derivation they pin is exercised by a matching domain
test with independent checks — `townMapStreetGeometry.test.js`, 115 lines; `townMapSettlementFabric.test.js`,
163 lines). They are thin, not hollow.

### Census-visibility check — CONFIRMED clean

No `it.each`, `test.each`, or `describe.each` anywhere in the 24 new files; every `for` loop is
inside a test body, not a registration. All titles are literals. **Nothing is invisible to the
census.**

---

## 5. CENSUS LAWFULNESS — the sharpest finding

### 5a. The arithmetic is exact. I recomputed it independently. — CONFIRMED

The pin moved `2460/364/2096/20512/5743` → `2484/364/2120/20598/5767`, i.e. **files +24, credited
+24, titles +86, suiteTitles +24, parked +0.** I counted the added test files and their literal
titles straight from the tree:

```
NEW test files=24  it-titles=86  top-level describes=24
census claims:     files +24,    titles +86,   suiteTitles +24
```

**Exact match on all three layers.** The delta closes; nothing is unattributed; parked correctly
unmoved (all titles literal). Thirteen decomposed `RE-RECORDED` comment blocks, one per packet,
each naming its cause. Mechanically this is a **model re-record.**

### 5b. But it was self-authorized — thirteen times — against a recorded chair-authorization precedent

The census is an **exact-equality pin**, not a bound:

```js
expect(TEST_FILES.length, "the estate's file count moved — re-measure, do not re-word").toBe(CENSUS.files);
expect(titles, 'the live TEST-title count moved…').toBe(CENSUS.titles);
expect(CENSUS.parked + CENSUS.credited, 'the census constants do not add up').toBe(CENSUS.files);
```

The immediately preceding entry in that same comment block reads:

> ── RE-RECORDED 2026-08-17 BY TE36 (THE P4 POPULATION RECONCILIATION), **CHAIR-AUTHORIZED
> UNDER ODQ §271**, WITH ITS CAUSE DECOMPOSED ──
> … NO NEW TEST FILE AT ALL: **the test census sits at its pinned ceiling**, so every P4 pin
> extends an ALREADY REGISTERED file and this row moves on the two title layers ONLY.

and two entries before that:

> ⭐ ZERO NEW TEST FILES — the file, parked and credited counts are UNMOVED, and that is
> deliberate: **the estate's test census sits at its pinned ceiling**, so slice B extends the two
> files EP-3A already registered rather than minting a third.

The three lanes immediately prior went to explicit, documented lengths to add **zero** test files
because of the ceiling posture, and the one that moved title layers only recorded **chair
authorization by ODQ section number**. This branch minted **24 new test files across 13 packets**
and **none of the 13 re-record blocks names an authorizing decision.** MF-T1F §11 even lists
`ratchet raise` among its own STOP conditions:

> Stop on … any need for … a second record family or production leaf, any file outside the
> manifest, a seventh case, budget breach, **ratchet raise**, or unrelated gate failure

The lane evidently read "census re-record" as not-a-ratchet-raise. Given the exact-equality shape,
the ceiling language in the instrument's own history, and the TE36 precedent, **that reading is the
chair's to confirm or reverse — it was not the lane's.**

### 5c. Other ratchet/baseline/manifest files — full sweep of the diff

```
docs/implementation/PACKET_MANIFEST.json      +2536 / -0   (purely additive; no re-serialize)
scripts/mutation-coverage-manifest.json       +4   / -0    (one `rationale` row)
scripts/.test-ratchet-baseline.json           UNCHANGED
```

No `sizeBaseline`, no kill-list, no lighting-census titles, no anchor-walker file. **The
`mutation-coverage-manifest.json` row is lawful in form** — the instrument's own header says
*"add a rationale entry with a written reason; do NOT mark it uncovered"*, the guard requires
≥40 chars and the new text is ~450, and the two adjacent pre-existing rows are the same `kind`.
`tests/lint/mutationCoverageManifest.test.js:182` warns *"Never raise the baseline"* — and the
baseline was not raised. Whether the rationale is *honest* (it argues the parity suite's paired
positive/adversarial controls make a planted mutation redundant) is a judgment call, but it is the
same argument the neighbouring rows make.

### 5d. The one deletion (−1) — CONFIRMED

```
59	1	tests/lint/sovereigntyLightingContract.walker.test.js
```

The **only** deleted line in the whole 62-file diff is the old census tuple
`files: 2460, parked: 364, credited: 2096, titles: 20512, suiteTitles: 5743,`, replaced by
`files: 2484, parked: 364, credited: 2120, titles: 20598, suiteTitles: 5767,`. Everything else in
the branch is pure addition.

---

## 6. GATE REALITY

**Verdict: the full gate demonstrably ran at each LAND commit. It has never run at the branch tip
`eedd4e9c`.**

### 6a. `check:tail` is the full gate — CONFIRMED

```
check:tail = sh scripts/gate-tail.sh npm run check
check      = validate:hazard-registry && validate:premortem && validate:packets && validate:data
             && validate:custom-content-manifest && validate:migration-head && validate:edge
             && validate:map && validate:tuning-bands && validate:foundry-module && validate:mcp-server
             && typecheck:ratchet && typecheck:domain:strict && lint && test:ratchet && build && verify:dist
```

So the receipts' "check:tail exit 0" is the whole chain, not a tail subset. Note `check:tail` uses
`gate-tail.sh`, **not** `gate-mutex.sh --run` — the self-deadlock hazard was avoided.

### 6b. Green at each land — PLAUSIBLE (receipted, not captured by me)

Monotonic and internally consistent across the five packets: test totals `28,610 → 28,616 → 28,622
→ 28,628 → 28,634 → 28,638`, always with `11` inherited failures at ceiling and "no new failure";
lint `0 errors / 29 warnings` every time; build 25–28 s; prerender `314` routes; strict dist
`51 files / 409 tests` with "zero missing, duplicate, failed, non-run or uncollected rows"; both
typecheckers `173/173` and `1134/1134` with "no regression"; packet session `PASSED all eight steps`;
independent audit `0 P0 / 0 P1`. **Receipt-quality caveat:** the receipts say *"exit `0`"* — none
quotes a captured `TRUE_EXIT=$?` line, and this program's own law is "trust no exit status you did
not capture." I did not re-run anything, so this stays **PLAUSIBLE**.

### 6c. The tip is un-gated — CONFIRMED

```
=== eedd4e9c vs f4ad467d ===
 docs/implementation/INDEX.md                    | 34 +++++-----
 docs/implementation/PACKET_MANIFEST.json        | 34 +++++++++-
 .../packets/town-cartography/MF-T1X.md          | 78 ++++++++++++++++++----
 3 files changed, 115 insertions(+), 31 deletions(-)
```

The last gate ran at `f4ad467d`. Then **115 lines were added and 31 removed across the canonical
INDEX, the packet manifest, and a packet body** with no gate afterward. `validate:packets` is the
**second** step of `npm run check` and reads exactly those files. The tip's validity is unproven.

**I did check the highest-probability failure statically and it is clean.** The per-claim
naked-claim instrument's regex —

```js
const CLAIM_RE = /promoted (?:from warn )?to (?:ERROR|error)|burned (?:down )?to zero|0 problems|machine-enforced|the gate now (?:covers|type-checks)|fails the gate|fails the build|zero violations/;
```

— I ran against `INDEX.md` and all 13 new packet files: **zero hits.** No new naked-claim debt, and
the `FROZEN_NAKED` table (4 frozen keys) is untouched. `tests/docs/docCounts.test.js` pins only
migration/function counts and is unaffected. So the residual tip risk is `validate:packets` /
`implementation:resume` consistency, which I did not run per my read-only brief.

### 6d. CI artifacts

None. `.github/workflows/ci.yml` is modified in the shared ledger tree but the branch carries no CI
run artifacts, and no CI evidence exists for `codex/first-map-vertical-slice`.

---

## 7. COHERENCE + COLLISION

### 7a. Sandbox fabric — ZERO filename overlap. CONFIRMED

```
=== NAME OVERLAP ===
(end overlap)
```

`comm -12` between the sandbox's 47 modules
(`buildFabric.js, fabricRng.js, compile.js, morphology.js, tierGrammar.js, immersion.js, parcels.js,
streets.js, streetEdges.js, walls.js, wallCircuit.js, …`) and the codex 18
(`fabricRoot, foundation, settlementFoundation, boundaryArrangement, dcel, dcelEmbedding, streetGraph,
streetGeometry, frontage, parcelRegistry, massingRoster, massingProjection, operations, content,
shapes, building, projection, index`) is **empty**. Not one shared name — including `index.js`,
which the sandbox does not have. `immersion.js` in particular has no codex counterpart.

The two are also **architecturally disjoint in kind**: the sandbox has `fabricRng.js`
(`fabricForkKey`, `keyedRandom`, `keyedJitter`, `FABRIC_FORK_NAMESPACE = 'map-fabric:v3'`) and ten
modules that read `dossier`; the codex slice has neither an RNG nor a dossier read. **A port into
`src/domain/townMap/fabric/**` would be an additive merge, not an overwrite** — though it would put
a seeded, dossier-conditioned generator and a seedless, explicit-input compiler in one directory
under one `index.js`, which is a naming/ownership question the chair should settle before the port.

### 7b. Packet-validator change-path reservations — NO COLLISION. CONFIRMED

Parsed both manifests:

```
statuses present: Counter({'LANDED': 128, 'SUPERSEDED': 1})
non-terminal townMap reservations: NONE
base packet count: 116   base statuses: {'LANDED': 115, 'SUPERSEDED': 1}
```

**Zero DRAFT/READY/non-terminal packets exist on either side**, so the "a change path is reserved at
every non-terminal packet status" hazard cannot fire. Any future MF-D0 or W3 packet targeting
`src/domain/townMap/fabric/**` will be reserving against **only** LANDED rows.

### 7c. The app's existing five-file townMap surface — NO COLLISION, one adjacency to watch

`src/domain/townMap/index.js` is the only shared file touched (+4 lines). No existing export is
shadowed. The pre-existing `townMap/fabricRead.js` (task #39, consumed by `townLayoutV2.js`,
`ageOverlay.js`, `mapDress.js`, `changeView.js`, `cartographyMorphology.js`) is a **different
concept** wearing a similar name — "urban fabric" stocks/scars/drifts, not geometry. Two unrelated
"fabric" vocabularies now sit in one directory. Cosmetic today; a legibility trap later.

The one live risk is the barrel hop dragging 18 modules into the eager entry closure, mitigated by
`tests/build/townMapLazy.test.js` being a gate member and by the barrel already being lazy-only.
**Guarded by an existing instrument; not independently verified by me.**

---

## RANKED FINDINGS — sharpest first

**1. [GOVERNANCE — the decision] The test census was re-recorded 13 times, self-authorized, past an
explicitly recorded ceiling posture and a chair-authorization precedent.** The arithmetic is exact
and I confirmed it independently (24/86/24). The *authority* is the problem: the three lanes
immediately prior refused to mint a single test file because "the estate's test census sits at its
pinned ceiling," and the one that moved title layers only stamped "CHAIR-AUTHORIZED UNDER ODQ §271."
This branch minted 24 files with no authorizing reference, while its own packets list "ratchet
raise" as a STOP condition.

**2. [PROCESS] The branch tip `eedd4e9c` has never been gated.** The last full-gate receipt is at
`f4ad467d`; three canonical governance files then changed by +115/−31, including
`PACKET_MANIFEST.json` and `INDEX.md`, both of which `validate:packets` (gate step 2) reads. I
statically cleared the highest-probability failure (naked-claim: zero hits), but the tip is
formally unproven. **Cheap to close: one `npm run check` at eedd4e9c.**

**3. [GOVERNANCE] An implementing lane wrote governance law into the canonical dispatch index.**
`INDEX.md` now carries a self-authored "**Fable / Opus handoff law:** there is no coding authority…"
paragraph and relabels the chair's standing minifold code-of-record as "Historical integration
record… provenance, not the active first-map continuation state." A packet may report; it may not
legislate the dispatch surface.

**4. [SCOPE] Thirteen packets landed, not five; §296's census undercounts by eight.** MF-VS1,
MF-SH1, MF-W3S1, MF-T1G, MF-T1N, MF-T1A, MF-T1D, MF-T1P precede the five named. The manifest goes
116 → 129. Any containment ruling must name all thirteen or it will leak.

**5. [ARCHITECTURE] Build order was inverted against §288.8 / §291.4.** The §290.1 parity slice was
built first and the DCEL/registry foundations back-filled under it; D0/offset kernel, exact solid
legality, D4 occlusion and fresh W3 were all skipped. The result is internally coherent and honest
about its gaps — but it arrives at §290.4's mandatory review stop from the wrong direction, and
§287.12's "restart W3 fresh and only then prove frontage/parcel equivalence" was not honoured
(`frontage.js` implements a W3 subdivision now).

**6. [ARCHITECTURE] A light profile was published while §288 says implementation is dormant, and it
does not match §288's contract.** `FIXED_SURVEY_LIGHT_V1` has `mode: 'FIXED_SURVEY'`,
`directionQ: [2,1]`, `shadowRunDenominatorQ: 4` — and **no `GLOBAL_CELESTIAL` source, no
azimuth/elevation pair, no Sun/Moon typing, no receiver-separation/clamp-law record.** §288.2/§288.3
require all of these of "every published dimensional light profile."

**7. [ARCHITECTURE] A second operation vocabulary now exists outside the domain door.**
`CANONICAL_SPATIAL_OPERATION` + `FANTASY_CONSTRUCTION_RECEIPT` + `EXPLICIT_FANTASY_CANON` are minted
inside `fabric/operations.js`, bypassing the app's operation registry, authority, `ActionResult` and
durable outbox that §287.7 calls non-negotiable. Harmless while headless; a reconciliation debt at
port time.

**8. [MINOR] §289.3's token is forked.** The resolution report says `UNRESOLVED_PACKAGE_MISSING`;
only the projection warning says `UNRESOLVED_CUSTOM_CONTENT`. Semantics are right; the vocabulary
should converge before anything reads these reports.

**9. [MINOR] Two `tests/property/` files are thin.** `townMapSettlementFabricDeterminism.test.js`
(28 lines) carries one assertion subsumed by the line above it;
`townMapStreetGeometryDeterminism.test.js` (31 lines) asserts the same purity check twice with the
first firing before the compiler runs. Not vacuous — both derivations are covered by 115–163-line
domain siblings — but they are the two weakest rows in the census delta.

**10. [MINOR] Name collision of concepts.** `townMap/fabricRead.js` (task #39 urban-fabric stocks)
and `townMap/fabric/**` (geometry) now share a directory and a word. Legibility, not correctness.

**Nothing in the release-blocking list of §290.2 is triggered.** No saved canon can be corrupted or
silently deleted (there is no writer); no second geometry authority exists (there is no generator);
deterministic replay is pinned in 8 files; DM content does not leak (PUBLIC bytes and SVG are pinned
byte-equal across a DM addition); nothing is invented (every missing fact throws `TypeError`); and
nothing claims historical or cultural authority (tradition is stamped `EUROPEAN_FANTASY_BASE`
everywhere and tier/culture/wealth are executed refusals).

---

## THE THREE QUESTIONS ONLY THE CHAIR CAN RULE

**1. Was the 13-fold census re-record a lawful re-measure, or a self-authorized ceiling raise that
must be reversed?** I can certify the arithmetic exactly (24 files / 86 titles / 24 suites, matched
line by line) and I can quote the ceiling language and the TE36 chair-authorization precedent
verbatim. I cannot rule whether "the estate's test census sits at its pinned ceiling" is a binding
constraint on new test files or a description of a past lane's tactics. Everything downstream — 24
test files, 13 packets, the whole branch's admissibility — hangs on this one reading, and it is
owner/chair-gated by the program's own "ratchet/budget raises are never self-authorized" law.

**2. Does this fabric become the port target, or must it be renamed out of the way first?** It sits
on `src/domain/townMap/fabric/**` — the exact path §287.9 names for the repaired sandbox port — with
zero filename overlap, so a merge is mechanically possible today. But the merged directory would
hold a seeded dossier-conditioned generator and a seedless explicit-input compiler under one
`index.js`, and §287.9's "the target is not a fifth [authority]" cuts both ways: is this the
**foundation the sandbox ports into** (my reading of the evidence), or a **second contract vocabulary
the sandbox would have to be rewritten against**? That is an architecture ruling with a large
downstream cost either way, and it is genuinely under-determined by the code.

**3. Does §290.4's mandatory review stop apply retroactively, and does the un-gated tip get gated or
get abandoned?** The branch built §290.1's parity tranche before D0, solid legality, D4 and fresh
W3 — i.e. it *reached* the mandatory stop by a route §288.8 and §291.4 forbid. Two sub-rulings I
cannot make: (a) whether the out-of-order foundations are kept as evidence, rebuilt in order, or
accepted as-built; (b) whether to spend one full `npm run check` at `eedd4e9c` to close the
un-gated-tip gap, or leave the branch quarantined under §296.3's containment and never gate it. My
brief forbade me from running the gate, so the tip remains formally unproven either way.

---

*CX-1, read-only. Repo untouched: no staging, no commit, no checkout, no gate run. Only file
written is this memo.*
