# Town Cartography / TC-5b-i — the cartography manifest seam (headless producer)

- **Status:** READY
- **Status note:** promoted by the chair 2026-08-11 (chair session `c42c8924`), from Lane F's
  reconciled draft. §12's four open items are CLOSED below by **CR-TC5BI-1..5**, and §12d's
  six draft-lane judgments are **FABLE-VALIDATED at this promotion**. TC-5b was REFUSED as one
  packet and split producer-first at **CR-TC5B-1**; this is slice (i).
  ⏸ **One item is deliberately left for the chair at dispatch: O-5 (§7, §12).**
- **Packet version:** `1`
- **Drafted by:** Lane F (read-only compile lane), 2026-08-11, Opus-era — see §12d.
  Promoted by Lane J under the Fable chair, 2026-08-11.
- **Verified base:** `claude/composite-r4` at `e1e9fd6a62b851dcce92a2fb4f84d9d76d1b238d`
- **⚠⚠ Base note — RE-VERIFIED AT PROMOTION, AND THE TREE IS LIVE.** Lane F drafted at
  `904b7bb0`; HEAD has since moved three commits to `e1e9fd6a` — `73f5be96` (the Fable
  survey, the serialization law, the marker conversions), `195113e4` (the chair flips R3/R6)
  and `e1e9fd6a` (`validate:packets` stops believing CREATE rows). **CONFIRMED by Lane J at
  promotion:** `git log --oneline 904b7bb0..HEAD -- src/lib/townScene/ src/domain/townScene/
  src/domain/townCartography/ src/components/townMap/ src/workers/ src/lib/mapSubTabs.js
  src/lib/lastMapView.js src/design/ tests/lint/sovereigntyLightingContract.walker.test.js`
  returns **exactly one commit — `73f5be96`, and it touches only the lighting-census walker,
  comment-only** (the `⏳ OPUS-ERA` → `✅ FABLE-VALIDATED` marker conversions; 10 insertions,
  5 deletions, all comment lines). **The five census figures did NOT move; the row moved
  from `:3676` to `:3681`** — §4b B5 carries the new line number. TC-5a's landing `41b39220`
  is an ancestor (CONFIRMED, exit 0), as is `904b7bb0`.
- **⚠ Working-tree dirt at promotion: SEVEN foreign modified files, ZERO untracked.**
  CONFIRMED by Lane J: six `supabase/functions/_shared/*` edge-bundle artifacts plus
  `tests/domain/explanation.test.js`. **All seven are disjoint from §7's four paths.** ⭐ The
  one dirty *test* file changes **zero** `it(`/`test(`/`describe(` title lines
  (`git diff HEAD -- tests/domain/explanation.test.js | grep -cE '^[+-].*(\bit\(|\btest\(|\bdescribe\()'`
  = `0`), so it did not move the census as measured — **but this is a snapshot of a shared,
  live tree.** ⛔ **The implementer re-derives §4's preflight at dispatch and treats a fresh
  `git status` as authority over this line.** Foreign dirt is RESERVED and never touched.
- **Depends on:** TC-5a at `41b39220`; TC-4 at `5a6f76fe`; TC-3b at `a45c969d`;
  TC-3a at `5066c34b`; TC-0..TC-2 at `6e96e259` + `0dcc3b9d`
- **Collision group:** `town-cartography-contract-and-compiler`. ⭐ **NOT** the
  `map-tab-shell` group TC-5b-ii opens — this packet touches no shell file (§7b).
- **Blocks:** TC-5b-ii (the painter mount). ⛔ TC-5b-ii must not dispatch before this lands.
- **Commit authority:** to be stated by the chair at dispatch.

> **THIS IS THE PRODUCER HALF OF THE TWO-WAY TC-5b SPLIT** ratified as **CR-TC5B-1**.
> Lane E measured that a compiled `TownSceneManifest` is unreachable from the dossier's Map
> tab and refused TC-5b as one packet. This packet builds the missing producer. It mounts
> nothing, renders nothing, and has **zero production importers** — exactly TC-5a's posture.

---

## -1. THE SEAM SHAPE — three candidates measured, two rejected

The task is one sentence: **make a compiled cartography block reachable from a non-3D,
non-worker caller, headlessly.** Four shapes are available in live code. All four were
measured at `aa585167`; the rejections are one sentence each, as the chair asked. **The
candidate record is preserved verbatim at the chair's instruction: the reasoning, not only
the verdict, is what a successor needs.**

| # | Shape | Verdict |
|---|---|---|
| **A** | Extend `townSceneWorkerClient.compile()` with a `manifestOnly` mode | ⛔ **REJECTED** |
| **B** | Reuse the worker client as-is; take the manifest from `onManifest`, then abort | ⛔ **REJECTED** |
| **C** | Cache the manifest beside geometry in `sceneCache.js` | ⛔ **REJECTED — structurally impossible** |
| **D** | A lazily-loaded main-thread compile module, mirroring the LANDED `townSceneExport.js` | ⭐ **RATIFIED — CR-TC5BI-1** |

**A — the worker gains a manifest-only mode.** ⛔ Rejected: the worker and the manifest
compiler are two of the four **filename-matched bounded build artifacts**
(`tests/build/townScene3dLazy.test.js:53-57`, ceiling `worker + compiler < 400_000`), so
every byte of new protocol lands inside a guarded ceiling to serve a reader who wants **no
geometry at all** — and the client's `result` packet is contractually geometry-bearing
(`townSceneWorkerClient.js:210-225`), so a manifest-only resolution changes a shipped
transport's return shape for a second caller's convenience.

**B — reuse the client, abort after `onManifest`.** ⛔ Rejected: `compile()` resolves **only**
on the `result` packet, so aborting after the manifest **rejects the promise with an
`AbortError`** (`:281-284`) — the caller would have to read success out of a rejection —
and the worker compiles geometry unconditionally after posting the manifest
(`townScene.worker.js:79-96`), so the work is done and thrown away either way.

**C — cache the manifest beside geometry.** ⛔ Rejected as **impossible, not merely
undesirable**: `townSceneCacheKey(manifest, options)` *derives the key from the manifest it
would store* — `manifest.source`, `manifest.compiler`, `manifest.schemaVersion`
(`sceneCache.js:24-54`) — so the cache can never answer "give me a manifest for this
settlement"; and it is explicitly session-local (`:158`, *"never crosses accounts, reloads,
or workers"*), so a cold Map tab misses by construction. It is an optimization over a
producer, never a producer.

**⭐ D — a lazily-loaded main-thread compile module. RATIFIED at CR-TC5BI-1.** Not a new
architecture: **it is the exact shape that already ships.**
`src/lib/townScene/townSceneExport.js:147-166` is a landed, lazily-imported main-thread
module that reads the cartography flag through
`townCartographyActive(worldState?.simulationRules)`, dynamically imports `NAMING_DATA` only
when lit, and calls `compileTownSceneManifest(...)` **synchronously on the interaction
thread** behind a user's click. **The chair ratified the seam on that precedent.** TC-5b-i
needs precisely that minus the raster/GLB half.

Four measurements make D cheap where it looks expensive:

1. **The compiler graph never touches the shell.** The seam is reached through one `import()`,
   so `sourceClosure()`'s static walk (`mapTabShellLazy.test.js:104-135`; its specifier regex
   requires `import` + whitespace + quote and therefore **cannot match `import(`**) excludes
   it by construction. §6.4 turns that into this packet's prevention guard.
2. **The flag predicate costs one module.** `townCartographyActive` lives in
   `cartographyContract.js`, which CONFIRMED at HEAD has **zero `import` statements at all**
   (291 effective lines, a true leaf) — so the hook can decide dark-vs-lit without dragging
   anything.
3. **`mapEdits` needs no threading and no second normalizer.** CONFIRMED
   `sceneProjection.js:75-77`: when `explicitMapEdits` is `null`/`undefined` the projection
   calls `readMapEdits(source)` itself. Passing `mapEdits: null` therefore compiles against
   the settlement's own persisted edits — the same truth the Plan view shows — with **zero
   imports** and **zero restated guards**. ⭐ This is the finding that shrinks the seam's
   input to exactly the four props `MapTabShell` already holds.
4. **Audience already fails closed.** `normalizeSceneAudience` returns `'public'` — the
   **narrowest** projection — for anything that is not `'dm'` or `'player'`
   (`sceneProjection.js:30-34`). The seam therefore must **not** declare an `audience = 'dm'`
   default of its own; see §6.1 and C8.

**The one real cost of D, stated plainly:** the manifest compile runs on the interaction
thread. It is bounded by three facts — it is off the render path (an effect, not a render),
it runs once per input identity, and it runs **only for a reader who lit
`townCartographyEnabled`** — CONFIRMED a **VIRTUAL** rule with no `DEFAULT_SIMULATION_RULES`
entry (`src/domain/worldPulse/simulationRules.js:648`), so every existing world is dark by
construction. **CR-TC5BI-3 makes measuring it a MANDATORY PREFLIGHT PROBE with a `600 ms`
STOP** (§4 B6), so the packet cannot ship on a draft lane's optimism.

---

## 0. Why this packet exists, and what it starts from

TC-5a landed `buildCartographyDrawList` and the ROLE program with **zero production
importers by design**. Lane E then measured the gap that stops TC-5b: **nothing outside the
3D portrait can obtain a `manifest.cartography` block.** CONFIRMED independently by Lane F
at `904b7bb0` — `grep -rn "compileTownSceneManifest" src/components src/hooks src/store`
returns nothing; the only `src/` holders of the symbol are
`src/lib/townScene/townSceneExport.js`, `src/workers/townScene.worker.js`, and the
`src/domain/townScene` family itself.

TC-5b-i builds the producer: one transport that compiles a block for a settlement, and one
hook that owns its lifecycle. It is the **presence oracle** ruled at **CR-TC5B-3** — after
this lands, "does this settlement have a cartography sheet?" has an answer a caller can ask
without mounting a canvas, a worker, or a renderer.

**Observable result:** none. No production module imports either new file; the built bundle
is byte-identical; the reader sees nothing new. What changes is that TC-5b-ii becomes
**compilable** — its `cartographyAvailable` fact acquires a source, and its 15-line
`MapTabShell.jsx` budget becomes achievable.

---

## 1. Reconciled authority

1. **`PACKET_STANDARD.md` governs.** One behavior family (acquire a block + its lifecycle),
   one necessary integration path (none — there is no consumer), one prevention guard (§6.4).
2. **CR-TC5B-1 (the split) is BINDING**, producer-first. This is slice (i).
3. **CR-TC5B-3 (the seam is the presence oracle) is BINDING.** §6.2's status vocabulary is
   written to answer presence, and §6.5 states exactly what TC-5b-ii reads off it.
4. **CR-TC5BI-1..5 are BINDING** and each closes an open item of this packet's draft:
   **CR-TC5BI-1** ratifies the lazily-imported main-thread compile seam on the
   `townSceneExport.js:147-166` precedent (§-1 D); **CR-TC5BI-2** rules the two homes —
   transport in `src/lib/townScene/`, hook in `src/components/townMap/` (§6.1, §6.2);
   **CR-TC5BI-3** accepts the `600 ms` B6 compile-cost STOP **as a MANDATORY PREFLIGHT PROBE,
   never a test assertion** (§4 B6); **CR-TC5BI-4** accepts the ~30-line `sourceClosure()`
   duplication for this wave, with extraction deferred until BOTH halves land (§6.4, §7b);
   **CR-TC5BI-5** requires the `PACKET_MANIFEST.json` row to be authored from §7's REAL
   paths (§7b, §12 O-4 — DONE at this promotion).
5. **CR-TC3A-1 is BINDING and inherited verbatim:** naming pools are **injected across the
   lazy edge**, never imported by the compiler. A lit compile without them throws a named
   `TypeError` at `compileTownSceneManifest.js:509-515` — CONFIRMED, and C5 asserts it.
6. **Landed code outranks design prose on the transport's shape.** `townSceneExport.js` is
   the precedent; this packet copies it rather than inventing a second idiom.
7. **The manifest's own projection is the ONLY audience truth.** TC-5a's docblock
   (`cartographyPaint.js:30-36`) forbids a second, paint-time filter; §6.1 extends that
   prohibition to the seam — it threads `audience` and adds nothing.

The implementer does not reopen these by rereading design prose.

---

## 2. Outcome and non-goals

**Definition of done:** a caller holding `{ settlement, worldState, regionalGraph, audience }`
can obtain, headlessly and asynchronously, either a compiled `manifest.cartography` block
with its `planExtent`, or an explicit unavailable/failed status — and can do so without any
static edge from the caller to the manifest compiler, the compile-input seam, or the naming
table. The block so obtained is provably accepted by TC-5a's `buildCartographyDrawList`. The
built bundle, every golden, and the bounded pair are **unmoved**.

In scope:

1. `src/lib/townScene/townCartographyBlock.js` — the transport (compile → block).
2. `src/components/townMap/useTownCartographyBlock.js` — the lifecycle hook.
3. The static-closure prevention guard that keeps the compiler graph out of any future
   caller's chunk (§6.4).

Explicit non-goals — each is another packet or another authority:

- **The painter component, the sub-tab seat, the shell mount, the ROLE→colour binding, and
  the A-4 notice — all TC-5b-ii.** ⛔ This packet imports no token module, emits no SVG, and
  edits no file under `src/components/townMap/` other than the one new hook.
- **PNG / raster — TC-5c. Skins and style knobs — TC-5d.** No `townMapStyles.js`, no
  `bespokeStyles.js`, no `TOWN_MAP_LENS_IDS`, nothing entitlement-bearing.
- **AI editing controls** (A-11 bullet 3) — deferred beyond TC-5d.
- **Any schema, contract, vocabulary, or version change**; any edit to
  `cartographyContract.js`, `compileTownSceneManifest.js`, `sceneCompileInput.js`,
  `sceneProjection.js`, or either TC-5a leaf.
- **Any persisted change of any kind.** This packet writes no store slice, no localStorage
  key, no settlement blob field. `TOWN_MAP_VIEW_IDS` and `displayPrefs` are untouched.
- **Any worker-protocol change.** `townSceneWorkerClient.js` and `townScene.worker.js` are
  forbidden edits (§-1 A/B).
- **Any cache.** The seam memoizes within one mounted hook and nothing more (§11 D-4).
- **Tuning of any landed band**, including TC-5a's role/tone numbers.
- Hit-maps and a11y structure — TC-6. Pulse reactivity — TC-7. Exports/promotion — TC-8.
- Soak, promotion, deployment, marketplace activation.

### 2b. Why a producer with no consumer is NOT the ES-7 anti-pattern

ES-7 was refused because **five waves of consumers** were built against a dispatcher nobody
had chartered. This packet is the mirror image, and the mirror image is the cure: it builds
the producer first and leaves the consumer for TC-5b-ii. The precedent is one packet old —
TC-5a landed two leaves with zero production importers and the chair promoted it.

The one honest risk of producer-first is that the seam's **shape** is wrong in a way only the
mount would reveal. C3 removes it: the seam's real output, from the real compiler, is fed to
**TC-5a's real `buildCartographyDrawList`** inside this packet's own tests and must satisfy
TC-5a's length identity. The two halves are proven to meet **before** any UI exists. That
proof is the reason this packet is worth landing on its own.

---

## 3. Hard scope budget

| Limit | Packet budget | Default | Note |
|---|---:|---:|---|
| Behavior families | `1` | `1` | acquire a block + its lifecycle |
| New persisted record families / writers | `0 / 0` | `1 / —` | nothing here persists |
| Feature flags / user-facing surfaces | `0 / 0` | `1 / 1` | reads the virtual `townCartographyEnabled`; adds none |
| Direct production consumers | `0` | `2` | deliberately none — TC-5b-ii is the first |
| New logic-bearing production leaves | `2` | `2` | **at cap** — the transport and the hook |
| Existing logic-bearing production files | `0` | `3` | |
| Registration-only files | `0` | `3` | |
| Handwritten files total | `4` | `12` | §7 |
| Effective production-line delta | `<=180` | `400` | projected `~150` |
| New leaf — the transport | `<=80` | `250` | projected `~65` |
| New leaf — the hook | `<=100` | `250` | projected `~85` |
| Acceptance cases | `8` | `8` | **at cap** |

**MEASURED layer ceilings** (eslint `max-lines`, `skipBlankLines` + `skipComments`), CONFIRMED
at `904b7bb0` from `eslint.config.js:576-589`:

| Path | Layer ceiling | Source |
|---|---:|---|
| `src/lib/**/*.{js,jsx}` | `800` | the size-ratchet coverage extension block |
| `src/hooks/**/*.{js,jsx}` | `800` | same block |
| `src/components/**/*.js` | `800` | same block — **`.js` modules under `src/components` take 800, not the 600 `.jsx` ceiling** |

Both new files sit far below their layer ceiling; the packet caps above bind first.

⛔ **`scripts/.size-baseline.json` must NOT gain an entry.** `tests/lint/sizeBaseline.test.js`
asserts EXACT SET equality between the baseline's keys and the set of files strictly OVER
their layer ceiling, and pins each number in both directions — a compliant file's entry REDS
the gate. (PLAUSIBLE — inherited from Lane E §3; not re-executed here, and irrelevant unless
an implementer tries to add a row, which is already forbidden.)

---

## 4. Preflight

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor 41b39220 HEAD      # TC-5a
git merge-base --is-ancestor e1e9fd6a HEAD      # this packet's promotion base

# Substrate untouched since the promotion base.
git log --oneline e1e9fd6a..HEAD -- \
  src/lib/townScene/ src/domain/townScene/ src/domain/townCartography/ \
  src/components/townMap/ src/workers/ \
  tests/lint/sovereigntyLightingContract.walker.test.js         # expect EMPTY

# New files absent.
test ! -e src/lib/townScene/townCartographyBlock.js
test ! -e src/components/townMap/useTownCartographyBlock.js
test ! -e tests/lib/townCartographyBlock.test.js
test ! -e tests/hooks/useTownCartographyBlock.test.jsx

# ⭐ NOTHING EXISTING IS MODIFIED BY THIS PACKET, so there is no dirty-target check to run.
# Foreign dirt elsewhere is RESERVED and never touched. ⚠ At promotion the tree carried
# SEVEN foreign modified files and ZERO untracked — re-derive; the header's list is a
# snapshot, not permission.

# Live symbols this packet consumes.
rg -n 'export function compileTownSceneManifest' src/domain/townScene/compileTownSceneManifest.js
rg -n 'export function townCartographyActive|TOWN_CARTOGRAPHY_RULE_KEY|TOWN_CARTOGRAPHY_MANIFEST_KEY|TOWN_CARTOGRAPHY_BLOCK_KEYS' \
  src/domain/townScene/cartographyContract.js
rg -n 'export const TOWN_SCENE_PLAN_EXTENT' src/domain/townScene/manifestContract.js
rg -n 'export function buildCartographyDrawList' src/domain/townCartography/cartographyPaint.js
rg -n 'export const NAMING_DATA|NAMING_DATA' src/data/namingData.js
rg -n 'expectAbsentWithAnchor|expectPresentThenAbsent' tests/helpers/anchoredNegatives.js
rg -n 'GOLDEN_CONFIGS' tests/fixtures/townMapFixtures.js
```

⚠ **The base named above is the base the CHAIR observed at promotion (2026-08-11).** HEAD is
shared and moves; **the implementer re-runs every line of this preflight at dispatch** and
treats its own output as authority over any figure written into this document. Any target
collision or material symbol drift makes this packet `STALE`.

### 4b. Baselines

⚠ The drafting lane executed **no** test, build, or gate command (read-only draft lane; the
gate mutex was not its to take). Rows are **AUTHOR-TIME-UNMEASURED** unless marked MEASURED.

| # | Premise | Exact command | Expected / recorded |
|---|---|---|---|
| B1 | The townScene lib + cartography suites are green at base | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lib/townSceneExport.test.js tests/lib/townSceneWorkerClient.test.js tests/domain/townSceneCartography.test.js tests/domain/townCartographyPaint.test.js tests/domain/townCartographyDeterminism.test.js tests/property/townCartographyDormancyGolden.test.js` | **UNMEASURED** — exit 0 |
| B2 | Bounded pair at base | `npm run build && npm run verify:dist` | **UNMEASURED.** TC-5a recorded `77,455 + 307,682 = 385,137` at `58436804` (PLAUSIBLE at HEAD). This packet's expected delta is **`0`** — §6.3 |
| B3 | Typecheck posture | `npm run typecheck:ratchet && npm run typecheck:domain:strict` | **UNMEASURED** — exit 0 both, named separately (two-typechecker receipt law). ⚠ An unbaselined new file's error allowance is **ZERO** |
| B4 | Effective-line ceilings | §3 | **MEASURED by read of `eslint.config.js:576-589`** |
| B5 | ⭐ Lighting census row | read `tests/lint/sovereigntyLightingContract.walker.test.js` | **MEASURED BY READ AT THE PROMOTION BASE `e1e9fd6a`: line `:3681` = `files: 2395, parked: 365, credited: 2030, titles: 19732, suiteTitles: 5568`.** ⚠ Lane F measured the same five figures at `:3676`; `73f5be96` inserted five comment lines above the row and moved **the line number only**. ⛔ Re-derive from the FILE at preflight, never from a packet |
| B6 | ⭐⭐ **THE COMPILE-COST ROW — MANDATORY PREFLIGHT PROBE, WITH A STOP (CR-TC5BI-3)** | see below | **UNMEASURED — the implementer must produce this number before writing the hook** |
| B7 | Pre-existing gate reds | committed-base run | Only the owner-approved `generatorGoldenMaster` golden. ⛔ `observedShapeReaders.walker` is **NOT** a free attribution (PLAUSIBLE — Lane E §4c item 2: the excuse was discharged at `ffc85a90`) |

**B6, exactly — and CR-TC5BI-3 rules what it is.** Shape D's only genuine cost is a
main-thread compile. It is a **preflight probe**, run before either production file exists,
and its number is **evidence in the completion receipt — never an assertion in a test.**
Measure it against the largest lit corpus row, inside the seam's own test file, with the
probe removed before landing:

```js
// TEMPORARY probe, inside tests/lib/townCartographyBlock.test.js, removed before landing.
const t0 = performance.now();
await compileTownCartographyBlock({ settlement: GOLDEN_CONFIGS.at(-1).settlement,
  worldState: { simulationRules: { townCartographyEnabled: true } }, audience: 'dm' });
console.log('TC-5b-i compile ms:', Math.round(performance.now() - t0));
```

⛔ **STOP THRESHOLD: `600 ms`, RATIFIED at CR-TC5BI-3.** Above it, this packet stops and
reports to the chair rather than shipping a reader-visible main-thread stall; the fallback is
shape A (a worker `manifestOnly` mode) as its own packet, which is a bounded-artifact change
and therefore a different, larger slice. Below it, the seam ships as written. ⚠ The number is
**wall-clock on the implementer's machine and is evidence, not a pin** — it is recorded in the
completion receipt and **never** written into a test as an assertion (that would be a flake
factory). ⛔ **The threshold is a STOP, not a tuning knob:** an implementer may not raise it.

### 4c. ⚠ Corrections carried forward from Lane E — do not re-discover them

Both are Lane E's measurements, re-stated here because this packet lands first and its
implementer will read the same stale sources. Labelled PLAUSIBLE where the drafting lane did
not re-execute the check.

1. **The census figures and line number in `TC-5A.md` are STALE by two re-records.**
   TC-5A.md cites `:3621` and `2392/365/2027/19659/5552`. **CONFIRMED at the promotion base
   `e1e9fd6a`: the row is line `:3681` and reads `2395/365/2030/19732/5568`.**
   ⚠⚠ **The ~24-line comment block above the row is also stale** — it names ES-6a as an
   in-flight lane and excuses a red for a foreign reason. ES-6a has LANDED (`53d538b4`).
   ⛔ Treat the arm as expected-GREEN at a clean base. (PLAUSIBLE for the provenance chain;
   CONFIRMED for the row's current text.)
2. **The `observedShapeReaders.walker` "pre-existing red" excuse has expired** — discharged
   at the schema-5 genesis `ffc85a90` (PLAUSIBLE — inherited from Lane E), **and the baseline
   moved again inside the drafting window: `904b7bb0` re-recorded
   `scripts/.observed-shape-readers-baseline.json` down to `1977` rows** (CONFIRMED — it is
   one of that commit's two changed script files). ⛔ If that walker reds under this packet it
   is **this packet's** until proven otherwise against a committed-base run, and its baseline
   is a **forbidden edit** (§5).
3. ⭐ **NEW AT PROMOTION — `validate:packets` no longer believes CREATE rows.** Lane E's O-4
   measured that `scripts/implementation-packets.mjs` skipped existence checks for `CREATE`
   rows entirely. **That blind spot was CURED at `e1e9fd6a`:** a `CREATE` row whose status is
   `LANDED` is now existence-checked (`:466-468`), and the TC-5A row's three fictional paths
   were corrected in the same commit. ⛔ **The consequence for this packet is a landing
   obligation:** at the flip to `LANDED`, §7's four `CREATE` paths must exist **exactly as
   spelled**, or `validate:packets` reds. A file renamed during implementation is now a gate
   failure rather than a silent fiction — rename the manifest row in the same change, or do
   not rename.

---

## 5. Verified tree contract

| Role | File | Symbol | Required fact/use |
|---|---|---|---|
| **The compiler (the state authority)** | `src/domain/townScene/compileTownSceneManifest.js` | `compileTownSceneManifest(input, options)` | CONFIRMED `:551-556` — the backward-compatible synchronous entry; runs `prepareTownSceneCompileInputForSynchronousCompiler` then the one authorized compiler. **Forbidden edit.** ⛔ Imported by the transport through its **direct specifier, never the `index.js` barrel** (§6.1). |
| **The lit gate** | `src/domain/townScene/cartographyContract.js` | `townCartographyActive(rules)`, `TOWN_CARTOGRAPHY_RULE_KEY = 'townCartographyEnabled'`, `TOWN_CARTOGRAPHY_MANIFEST_KEY = 'cartography'`, `TOWN_CARTOGRAPHY_BLOCK_KEYS` | CONFIRMED `:617-619`, `:68`, `:71`. ⭐ CONFIRMED **zero `import` statements in the whole file** (291 effective lines) — importing it costs no transitive drag. **Forbidden edit.** |
| **The block's attachment point** | same file | `attachTownCartographyLayers` | CONFIRMED `:632-635`: dark returns the manifest **by reference** (no `cartography` key); lit returns `{...manifest, cartography: layers}`. This is why absence of the key **is** the dark signal. **Forbidden edit.** |
| **The naming-pool injection law** | `src/domain/townScene/compileTownSceneManifest.js` | the CR-TC3A-1 premise throw | CONFIRMED `:509-515`: a lit compile with `options.namingPools == null` throws a named `TypeError`. The seam must inject. **Forbidden edit.** |
| **The pools** | `src/data/namingData.js` | `NAMING_DATA` | Fetched **only** through `await import(...)` on the lit path. **Forbidden edit.** |
| **The audience normalizer** | `src/domain/townScene/sceneProjection.js` | `normalizeSceneAudience`, `projectSettlementForScene` | CONFIRMED `:30-34` — an absent/unknown audience becomes `'public'`, the **narrowest**. CONFIRMED `:75-77` — a `null` `mapEdits` makes the projection read `settlement.mapEdits` itself. **Both are why §6.1 declares no defaults.** **Forbidden edit.** |
| **The extent** | `src/domain/townScene/manifestContract.js` | `TOWN_SCENE_PLAN_EXTENT` (`= 1000`); `space.planExtent` | CONFIRMED `:24`, built at `:461-462`, pinned to exact equality by the validator at `:215`. The seam **reads it off the compiled manifest**, never restates the constant. **Forbidden edit.** |
| **⭐ The consumer this seam must satisfy** | `src/domain/townCartography/cartographyPaint.js` | `buildCartographyDrawList(cartography)` | CONFIRMED it needs **only the block** — no manifest, no extent, no audience. **TEST-ONLY import here** (C3). ⛔ A production import from either new file is a STOP (§6.3). **Forbidden edit.** |
| **⭐ The transport precedent to copy** | `src/lib/townScene/townSceneExport.js` | `downloadTownSceneArtifact` (`:147-166`) | The landed main-thread compile: flag read → dynamic `NAMING_DATA` import → `compileTownSceneManifest`. **Copy this shape** — it is the precedent CR-TC5BI-1 ratifies. **Forbidden edit.** |
| **The lifecycle precedent** | `src/components/townMap/scene3d/SettlementScene3D.jsx` | the `compileInputResult` `useMemo` (`:166-186`) and its aborting effect | The identity-by-`inputDigest` idiom the hook copies. ⛔ **Forbidden edit** — this packet does not touch the 3D leaf. |
| **The hook's siting precedent** | `src/components/townMap/useTownMapPresentation.js` | whole file | Map-tab hooks live beside the shell, not in `src/hooks/`. Ruled at CR-TC5BI-2. |
| **The prevention-guard walker to copy** | `tests/build/mapTabShellLazy.test.js` | `sourceClosure()` (`:104-135`) | CONFIRMED its specifier regex requires `import` + whitespace + quote, so `import(` is correctly excluded. ⛔ **Copy the function; do NOT edit this file — it is TC-5b-ii's reserved target** (§7b). |
| **The bounded-pair guard** | `tests/build/townScene3dLazy.test.js` | the bounded-payload `it` (`:645-680`) | **Run, never edit.** Owns `<400_000` (pair) and — ⚠ **the forward hazard** — `expect(manifestCompilers).toHaveLength(1)` (§6.3). |
| **Real settlements for tests** | `tests/fixtures/townMapFixtures.js` | `GOLDEN_CONFIGS` | The frozen 18-config corpus the dormancy golden already drives. Use it; do not run a generator. |
| **Negative-anchor helper** | `tests/helpers/anchoredNegatives.js` | `expectAbsentWithAnchor`, `expectPresentThenAbsent` | Every negative uses one. New files start at an un-anchored-negative ceiling of **ZERO**. |

Forbidden production edits: everything above marked forbidden, plus all of
`src/domain/townCartography/**` and `src/domain/townScene/**`, `src/workers/**`,
`src/lib/townScene/townSceneWorkerClient.js`, `src/lib/townScene/sceneCache.js`,
`src/lib/mapSubTabs.js`, `src/lib/lastMapView.js`,
`src/components/townMap/MapTabShell.jsx`, `src/store/**`, `src/design/**`,
`vite.config.js`, `eslint.config.js`, `scripts/.size-baseline.json`,
`scripts/.observed-shape-readers-baseline.json`, `scripts/.forked-color-baseline.json`,
`tests/fixtures/town-cartography-dormancy-golden.json`, and every file outside §7.

---

## 6. Exact contracts

### 6.1 New leaf — the transport

**Home: `src/lib/townScene/townCartographyBlock.js`** (sibling of `townSceneExport.js`) —
**ruled at CR-TC5BI-2**; the rejected homes are preserved at §12 O-1.

```js
/**
 * @param {{ settlement: unknown, worldState?: unknown,
 *           regionalGraph?: unknown, audience?: 'dm'|'player'|'public' }} input
 * @returns {Promise<TownCartographyBlockResult>}
 */
export async function compileTownCartographyBlock(input)
```

```js
/** @typedef {{ status: 'ready',       block: Record<string, unknown>, planExtent: number }
 *          | {  status: 'unavailable', block: null, planExtent: null }} TownCartographyBlockResult */
```

**Exact behavior, in order — no other branch:**

1. `townCartographyActive(input.worldState?.simulationRules)` is `false` ⇒ return
   `{ status: 'unavailable', block: null, planExtent: null }` **without importing the naming
   pools and without compiling anything.** This is the dark path and it must be free.
2. Lit ⇒ `const { NAMING_DATA } = await import('../../data/namingData.js');` — CR-TC3A-1,
   copied verbatim from `townSceneExport.js:161`.
3. `const manifest = compileTownSceneManifest({ settlement: input.settlement,
   mapEdits: null, worldState: input.worldState ?? null,
   regionalGraph: input.regionalGraph ?? null, audience: input.audience },
   { namingPools: NAMING_DATA });`
   ⭐ **`mapEdits: null` is deliberate and load-bearing** — `projectSettlementForScene`
   reads `settlement.mapEdits` itself (`:75-77`), so the seam gets the reader's own persisted
   edits with no import and no second normalizer.
   ⛔ **`audience` is passed through EXACTLY as received, including `undefined`.** The seam
   declares **no default**: `normalizeSceneAudience` already lands an absent audience on
   `'public'`, the narrowest. A `= 'dm'` default parameter here would silently widen the
   projection and is a **STOP** (C8).
4. `const block = manifest?.[TOWN_CARTOGRAPHY_MANIFEST_KEY] ?? null;` — a `null` block ⇒
   `{ status: 'unavailable', block: null, planExtent: null }`. **Absence of the key IS the
   dark signal** by `attachTownCartographyLayers`'s own contract (`:632-635`); the transport
   does not second-guess it.
5. Otherwise `{ status: 'ready', block, planExtent: manifest.space.planExtent }`.

**Failure semantics.** The transport **does not catch**. A compiler throw (malformed
settlement, the CR-TC3A-1 premise, a validator error) **propagates as a rejected promise**;
owning failure is the hook's job (§6.2), and one failure home is the point. ⛔ A `try/catch`
here is a STOP.

**Purity/shape.** No React, no DOM, no store, no clock, no randomness, no module-scope
mutable state, no cache, no `while`/`do`. Exactly one dynamic import and exactly one static
compiler import.

**Permitted imports — anything else is a STOP:**
`../../domain/townScene/compileTownSceneManifest.js` (⛔ **the direct specifier, NOT
`../../domain/townScene/index.js`** — the barrel would drag the whole `townScene` family,
and matching the worker's own specifier is what lets Rollup share one compiler chunk; §6.3),
`../../domain/townScene/cartographyContract.js`, and the one `await import()` of
`../../data/namingData.js`.

### 6.2 New leaf — the lifecycle hook

**Home: `src/components/townMap/useTownCartographyBlock.js`** (beside
`useTownMapPresentation.js`) — **ruled at CR-TC5BI-2**; rejected homes at §12 O-1.

```js
/**
 * @param {{ settlement: unknown, worldState?: unknown,
 *           regionalGraph?: unknown, audience?: 'dm'|'player'|'public' }} input
 * @returns {{ status: 'idle'|'compiling'|'ready'|'unavailable'|'failed',
 *             block: Record<string, unknown>|null, planExtent: number|null,
 *             available: boolean }}
 */
export function useTownCartographyBlock(input)
```

**The closed status vocabulary, and what each means to a caller:**

| status | meaning | `available` |
|---|---|---|
| `idle` | dark, or no settlement — nothing was attempted | `false` |
| `compiling` | a lit compile is in flight | `false` |
| `ready` | a block exists | **`true`** |
| `unavailable` | the compile ran and produced no block | `false` |
| `failed` | the compile threw | `false` |

⭐ **`available` is the presence oracle (CR-TC5B-3), and it is `status === 'ready'` — one
derived boolean, never a second predicate.** TC-5b-ii threads exactly this into
`resolveMapSubTabs`.

**Exact behavior:**

1. **The dark gate is read in the hook, statically**, via `townCartographyActive` from
   `cartographyContract.js` — a zero-import leaf (§-1 measurement 2). Dark ⇒ `idle`, and the
   transport module is **never imported**, so a dark reader fetches no chunk and pays nothing.
2. Lit ⇒ an effect (never render-time) does
   `const { compileTownCartographyBlock } = await import('../../lib/townScene/townCartographyBlock.js');`
   then awaits it. ⛔ **A static `import … from` of the transport is a STOP** — it is exactly
   the edge §6.4's guard exists to prevent.
3. **Identity.** The effect is keyed on a memoized identity derived from
   `{ settlement, worldState?.simulationRules?.[TOWN_CARTOGRAPHY_RULE_KEY], regionalGraph,
   audience }` by reference. ⛔ **The hook must NOT call `prepareTownSceneCompileInput` to
   get `inputDigest`** — that seam statically imports the compile-input graph and would put
   it in the caller's chunk, defeating §6.4. Reference identity is sufficient because the
   caller's props are `useMemo`-stable, and a redundant recompile is a cost, not a defect.
   ⭐ Record this as the one place this packet **deviates from** `SettlementScene3D.jsx`'s
   digest idiom, and why (§11 D-2).
4. **Supersession.** Every in-flight compile carries a generation counter; a result whose
   generation is not current is **dropped silently**. An unmount drops the pending result
   without calling `setState`. (The `AbortController` idiom is unavailable — a synchronous
   compile cannot be interrupted; this is the same reason `townSceneWorkerClient.js:143-145`
   terminates rather than cancels.)
5. **Failure.** A rejected transport promise ⇒ `failed`, `block: null`. The error is passed
   to `console.warn` **once per generation** and never rethrown into React. ⛔ **No error
   text reaches any returned value** — legibility law; the reader-facing notice is
   TC-5b-ii's A-4 copy, not a raw `premise` string.
6. **No `useStore`, no `useFlag`, no clock, no randomness, no persistence.**

**Permitted imports — anything else is a STOP:** `react`,
`../../domain/townScene/cartographyContract.js`, and the one `await import()` of the
transport.

### 6.3 Bundle posture — ZERO, and the exact receipt

**This packet's expected bundle delta is `0` bytes, and unlike TC-5a's C7 the reason is not
subtle: both new files have zero production importers, so they are not reachable from any
entry and never enter the graph at all.**

**The exact receipt an implementer must produce** — all three, quoted verbatim in the
completion receipt:

1. `npm run build && npm run verify:dist` at base and after; **the bounded pair figure is
   identical** (B2). ⚠ **Label it honestly:** this is a **no-regression control, not a live
   guard** — with zero importers it would pass even if the seam imported the world. TC-5a's
   §9 note said the dist half "becomes load-bearing at TC-5b"; measured, it becomes
   load-bearing at **TC-5b-ii**, not here.
2. `tests/build/townScene3dLazy.test.js` and `tests/build/mapTabShellLazy.test.js` **run,
   not edited**, both green, with `VERIFY_DIST=1`.
3. ⭐ **§6.4's source-closure guard — the only live instrument in this packet**, and it is
   live precisely because it needs no build and no importer.

⚠⚠ **THE FORWARD HAZARD TC-5b-ii MUST MEASURE, recorded here because this packet is where
the shape is fixed.** `townScene3dLazy.test.js:653` asserts
`expect(manifestCompilers).toHaveLength(1)` — **exactly one** chunk matching
`^compileTownSceneManifest-[A-Za-z0-9_-]+\.js$`. When TC-5b-ii gives the seam its first
importer, a **second** such chunk would red that arm. Two facts reduce the risk and both are
this packet's to fix now: the transport imports the compiler through **the same direct
specifier the worker uses** (`townScene.worker.js:27-29`), maximizing chunk sharing; and the
seam is reached by exactly one `import()`, not several. ⛔ Never add a `manualChunks` rule,
never edit `townScene3dLazy.test.js`, never raise a literal.

⚠ **The CSS budget does not bind here.** `firstPaintNonJs.test.js` sums only stylesheets
linked from `dist/index.html`; this packet adds no `.css` import and no component. (PLAUSIBLE
— Lane E §6.6 measured `19,795 B` against `19_800`.) ⛔ Corollary STOP: neither new file may
`import './x.css'`.

### 6.4 ⭐ THE PREVENTION GUARD — the compiler graph stays behind the dynamic edge

This is the packet's one guard, and it is the thing that makes TC-5b-ii safe.

Copy `sourceClosure()` from `tests/build/mapTabShellLazy.test.js:104-135` **into
`tests/lib/townCartographyBlock.test.js`** (⛔ do not import from, or edit, that file — it is
TC-5b-ii's reserved target). **The ~30-line duplication is ACCEPTED FOR THIS WAVE at
CR-TC5BI-4**; extraction to a shared helper happens only after BOTH halves land (§12 O-3).
Walk the **transitive static** closure of
`src/components/townMap/useTownCartographyBlock.js` and assert:

- **ABSENT:** `src/domain/townScene/compileTownSceneManifest.js`,
  `src/domain/townScene/sceneCompileInput.js`, `src/domain/townScene/sceneProjection.js`,
  `src/data/namingData.js`, `src/lib/townScene/townCartographyBlock.js`,
  `src/domain/townCartography/cartographyPaint.js`.
- **PRESENT (the liveness anchor):** `src/domain/townScene/cartographyContract.js` — the hook
  genuinely reaches it, so a resolver that silently resolved nothing cannot pass.
- **Non-vacuity, the `mapTabShellLazy.test.js:211-215` idiom:** the closure has at least two
  members.

Every absence goes through `expectAbsentWithAnchor` (new files start at an un-anchored
ceiling of **ZERO**).

⚠ **Why this guard is not vacuous today even with no consumer:** it constrains the hook's own
source, which exists the moment this packet lands. It is the inverse of TC-5a's C7 — TC-5a
proved the painter stays *out* of the compiler's closure; this proves the compiler stays
*out* of the caller's.

### 6.5 What TC-5b-ii reads off this seam — the reconciliation, now APPLIED

TC-5b-ii's draft predates this seam's shape. Three reconciliations. ⭐ **Items 2 and 3 were
ruled at this promotion and are already WRITTEN INTO `TC-5B-II.md`** — the implementer of
either half reads a reconciled pair, not a document owing an amendment.

1. **`cartographyAvailable`** (TC-5B-II §6.4 item 3) `=== useTownCartographyBlock(...).available`.
   One hook call, one boolean, inside the 15-line `MapTabShell.jsx` cap.
2. **⚠ APPLIED: `planExtent` arrives as a RESOLVED NUMBER, not as a `manifest` prop.**
   TC-5b-ii's draft had the painter read `manifest?.space?.planExtent`. **This seam never
   exposes a manifest** — deliberately: handing a whole audience-projected manifest to a UI
   leaf is a wide surface for a component that needs one integer, and it would give the
   painter a second route to facts the block already carries. TC-5b-ii's painter takes
   `planExtent` and `block`. Its §7 row and C1 (`viewBox="0 0 1000 1000"`) are otherwise
   unchanged, and **TC-5B-II §6.2 and §7 now say so**.
3. **Failure division stays as TC-5b-ii drafted it.** A compile failure ⇒ `available === false`
   ⇒ **the tab is ABSENT** (CR-TC5B-3: presence gates on the block). A-4's visible notice
   therefore covers the *remaining* case — a block that exists but that
   `buildCartographyDrawList` rejects, i.e. a compiler-validator defect. ⭐ That case is
   genuinely reachable-in-principle and genuinely rare, and the seam must **not** dry-run the
   painter to pre-empt it: doing so would put TC-5a's leaf in the seam's graph, make the
   painter's own A-4 arm dead, and give one question two answers.

⛔ **APPLIED: TC-5b-ii's split table said TC-5b-i "makes TC-5a's leaf reachable for the first
time." Measured, that is not accurate, and it is CORRECTED in `TC-5B-II.md` at this
promotion:** TC-5a's leaf gains its first production importer at **TC-5b-ii**. What this
packet makes reachable is the **block** TC-5a's leaf consumes. C3 proves the two meet; it
does not create a production edge.

---

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Instruction |
|---|---|---|---:|---|
| `CREATE` | `src/lib/townScene/townCartographyBlock.js` | `compileTownCartographyBlock`, the result typedef | `80` | §6.1. Dark returns early and imports nothing; lit injects `NAMING_DATA` across `await import()`; `mapEdits: null`; **no `audience` default**; no `try/catch`. Imports per §6.1 only. |
| `CREATE` | `src/components/townMap/useTownCartographyBlock.js` | `useTownCartographyBlock` | `100` | §6.2. Static gate via `townCartographyActive`; the transport reached **only** through `await import()`; generation-guarded supersession; `failed` on rejection; `available === status === 'ready'`. Imports per §6.2 only. |
| `CREATE` | `tests/lib/townCartographyBlock.test.js` | C1, C3, C5, C7, C8 | `n/a` | Drive `GOLDEN_CONFIGS`; per-test `120_000` timeouts on corpus cases; the §6.4 closure guard lives here. Straight-line registration only — §7c item 1. |
| `CREATE` | `tests/hooks/useTownCartographyBlock.test.jsx` | C2, C4, C6 | `n/a` | ⚠ **The file must open with the `@vitest-environment jsdom` docblock pragma**, exactly as `tests/hooks/useTownMapPresentation.test.jsx:1-2` does — CONFIRMED the repo default is `environment: 'node'` (`vitest.config.js:787`). Copy that file's `renderHook`/`act` shape. |

Generated artifacts: `NONE`. Do not edit `scripts/.size-baseline.json`,
`tests/build/townScene3dLazy.test.js`, `tests/build/mapTabShellLazy.test.js`,
`eslint.config.js`, or any file in §7b's reservation list.

⭐ **These four paths, and only these four, are the packet's reserved change paths.** The
`PACKET_MANIFEST.json` row authored at this promotion (CR-TC5BI-5) carries exactly them, as
four `CREATE` rows, spelled identically. ⚠ Per §4c item 3 the spelling is now load-bearing at
the LANDED flip.

> ⏸ **O-5 — OPEN AT PROMOTION, FOR THE CHAIR AT DISPATCH. The lighting-census file is NOT a
> reserved change path, and §7c item 2 tells the implementer to edit it.**
> §7's manifest — and the `PACKET_MANIFEST.json` row derived from it — reserve exactly the
> four paths above. §7c item 2 and §8 step 8 nonetheless instruct the implementer to
> re-derive and re-record `tests/lint/sovereigntyLightingContract.walker.test.js`, which is
> outside that set. **The promoting lane did not resolve this: which lane re-records a shared
> census is a decision, not a transcription.** ⛔ **Until the chair rules, the implementer
> STOPS at §8 step 8 and reports** the five re-derived figures and this packet's isolated
> delta rather than choosing.
> The two lawful shapes, both with precedent: **(a)** add a fifth reserved row
> (`TEST`, that path) and re-record IN THE SAME CHANGE — the serialization law's default,
> and what TC-5a did; **(b)** a **CHAIR POST-LANDING re-record** on the ES-6a precedent
> (`9892eda1`), where the implementer reports figures and delta and never touches the walker.
> ⚠ Shape (a) requires the manifest row to gain the path before dispatch; shape (b) requires
> nothing. Both are consistent with the serialization law ruled at `73f5be96`, which forbids
> only landing a red walker as debt and quantifying a foreign lane's uncommitted delta.

### 7b. Reservations and collisions — CONFIRMED CLEAR at promotion

**⭐ Disjointness against TC-5b-ii's nine reserved paths, checked pairwise.** TC-5b-ii
reserves `src/components/townMap/subtabs/cartographyColours.js`,
`src/components/townMap/subtabs/MapCartographySubTab.jsx`, `src/lib/mapSubTabs.js`,
`src/components/townMap/MapTabShell.jsx`, `src/design/boundBook.js`,
`tests/ui/mapCartographySubTab.test.jsx`, `tests/lib/mapSubTabs.test.js`,
`tests/ui/mapTabShell.test.jsx`, `tests/build/mapTabShellLazy.test.js`.

**This packet's four paths intersect that set in ZERO places, and the split shares nothing
by design.** The two lanes meet only through a symbol (`useTownCartographyBlock`), never
through a file. That is the strongest form of the split and it is deliberate: TC-5b-ii can be
compiled, reviewed, and landed without re-opening a single line this packet writes.
⭐ **CONFIRMED MECHANICALLY at this promotion:** both packets are now rows in
`PACKET_MANIFEST.json` at **non-terminal** statuses, so `implementation-packets.mjs:448-456`
holds both path sets under exclusive reservation and `validate:packets` would refuse the
overlap. It does not — the validator ran green with both rows present.

⚠ **The one shared *test* target, named explicitly:** `tests/build/mapTabShellLazy.test.js`
is TC-5b-ii's. This packet **copies** its `sourceClosure()` function into its own suite rather
than editing or importing it (§6.4). Duplicating ~30 lines of a walker is the correct trade
against a cross-lane file collision — **ACCEPTED for this wave at CR-TC5BI-4**; extraction to
a shared helper is its own tiny slice once both halves have landed (§12 O-3).

- **Packet-manifest reservations — CONFIRMED at promotion by re-reading the manifest.** The
  non-terminal reservers are **IA-2 [STALE]**, TC-5B-I and TC-5B-II. IA-2's paths are all
  `scripts/implementation-*`, `tests/scripts/*`, `package.json`, `docs/implementation/*` —
  **ZERO overlap** with this packet's four. (Lane E's original claim was PLAUSIBLE-inherited;
  it is now CONFIRMED.)
- **Working-tree dirt at promotion: SEVEN foreign modified files, ZERO untracked** — six
  `supabase/functions/_shared/*` edge-bundle artifacts plus `tests/domain/explanation.test.js`,
  a concurrent lane's. **None of those paths is in §7**, and the dirty test file changes zero
  `it(`/`describe(` title lines, so the census was not moved by it as measured.
  ⚠ **This is a snapshot of a shared, live tree** — re-derive at preflight and treat a fresh
  `git status` as authority over this line.
- **Chair action owed: DISCHARGED.** TC-5B-I's `PACKET_MANIFEST.json` row was authored from
  §7's real paths at this promotion (CR-TC5BI-5; §12 O-4).

### 7c. Landing discipline this manifest incurs — FIVE obligations, all measured

1. ⚠⚠ **THE PARKED-SUITE TRAP, and it takes the WHOLE FILE.** A `test(`/`it(` registered
   inside a `for` loop is `TEST_UNREGISTERED` and **the entire file parks**, losing every
   other title in it. A `describe` whose body is not straight-line parks the same way;
   `.each()` parks via `TEST_TABLE_UNPROVEN`. **This bit TC-5a: `townCartographyPaint.test.js`
   scored 0 live titles against 34 real tests on its first cut.** Register every test
   straight-line in **both** new suites, and verify `credited` moved — not just `files`.
   ⚠ §6.4's guard is tempting to write as `for (const forbidden of ABSENT) it(...)`. **That is
   exactly the trap.** Write the absences straight-line, or put the loop *inside* one `it`.
2. ⭐ **THE LIGHTING CENSUS MOVES, AND EXTENDING A FILE WOULD NOT HAVE SAVED YOU.** All five
   arms are `.toBe(...)` — exact equality — and `titles` counts **every** `it()` in the repo,
   so any packet that adds a test moves it whether the test lands in a new file or an old one.
   The "prefer extending an existing test file" hazard protects `files`, the
   mutation-coverage manifest, and the parked-file blast radius — **not** the census. Two new
   files here move `files` by `2`.
   **Re-derive all five figures in ONE run and re-record them whole** — never patch `files`
   alone. Base to fold onto (MEASURED at the promotion base `e1e9fd6a`, line `:3681`):
   **`2395 / 365 / 2030 / 19732 / 5568`**, with the `parked + credited === files`
   cross-check.
   ⚠ **The sequence hazard is live:** while any arm is red the census **stops measuring**, so
   later arms may read anything. ⭐ Probe with a temporary `console.log` **inside the existing
   census test, before its first assertion**, so it mints no title and cannot move what it
   measures.
   ⛔ **HEAD moved three times inside the drafting/promotion window and the tree carries
   foreign dirt.** Re-verify at preflight; **if a foreign `it(`/`describe(` title has appeared,
   STOP and report** rather than freezing foreign WIP into a frozen census. Never census a
   live shared tree.
   ⏸ **AND SEE O-5 (§7): who performs this re-record is OPEN until the chair rules at
   dispatch.** The measurement and the report are owed either way; the *edit* is not,
   until ruled.
3. ⚠ **THE MUTATION-COVERAGE NAMING TRAP — both new names were chosen to avoid it.**
   `tests/lint/mutationCoverage.shared.mjs:27-39` requires a manifest row for any test under
   `tests/{lint,design,docs,data,copy,security,edgeFunctions}` **or** whose basename matches
   `/(census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin)/i`.
   CONFIRMED: `tests/lib/townCartographyBlock.test.js` and
   `tests/hooks/useTownCartographyBlock.test.jsx` match neither the dirs nor the pattern.
   ⛔ **Do not rename either file into the pattern** — `…Contract`, `…Pin`, `…Coverage`,
   `…Walker`, `…Golden` and the rest of that list are the live trap words — and do not site
   either under `tests/design/`, `tests/lint/`, or any other enforcer dir.
   ⛔ Never re-serialize `mutation-coverage-manifest.json`.
   ⚠ **And per §4c item 3 a rename is now doubly costly:** the manifest's `CREATE` rows are
   existence-checked at the LANDED flip.
4. **ANCHORED NEGATIVES.** `ceilingFor` gives a **new file ZERO**. Every `not.toContain` /
   `not.toMatch` / `not.toHaveProperty` in both new suites goes through
   `tests/helpers/anchoredNegatives.js` or a reviewed `// anchored:` line **immediately
   above**. ⚠ The inventory arm also reds when a count **falls** below its frozen row, so do
   not "helpfully" clean an unrelated file.
5. **GATE THROUGH THE MUTEX, AND NEVER THROUGH A PIPE.** Every vitest invocation goes through
   `sh scripts/gate-mutex.sh --run -- …`; the landing gate is `npm run check:tail`. An
   observational preflight followed by a separate command is not ownership. ⚠ Trust no exit
   status you did not capture yourself.

⚠ **What should NOT move, and is a STOP if it does:** `deepCraftKillList`'s
`borderRadius`/`boxShadow`/`rgba(` counts over `src/components` (this packet's one
`src/components` file is a hook with no styling), any snapshot, any golden, the dormancy
fixture, and the bounded pair.

---

## 8. Ordered coding sequence

0. Run §4 preflight and record every baseline. Stop on mismatch.
1. **Measure B6 first** — the compile-cost probe, before either production file exists. Above
   `600 ms`, STOP and report; do not write the hook. (CR-TC5BI-3.)
2. Add the smallest failing focused test — C1's lit/dark transport pair — **before** the
   transport exists.
3. Implement `townCartographyBlock.js`; make C1, C5, C8 green.
4. Add C3 (the producer↔consumer proof against TC-5a's real `buildCartographyDrawList`).
5. Implement `useTownCartographyBlock.js`; make C2, C4, C6 green.
6. Add the §6.4 closure guard (C7) — straight-line, anchored.
7. Remove the B6 probe. Run §10 focused checks; then `npm run build && npm run verify:dist`
   and confirm the bounded pair is **unchanged**.
8. Re-derive the lighting census WHOLE (§7c item 2). ⏸ **Whether you also RE-RECORD it is
   O-5, open for the chair at dispatch** — absent a ruling, report all five figures and this
   packet's isolated delta and do not touch the walker; STOP per §7c item 2's condition if a
   foreign title has appeared.
9. Run the wave-end gate. Report exact deltas, counts, the pair against B2, the B6 number,
   the census row, and `deviations: NONE` or a STOP.

Do not start by changing a golden, baseline, budget, or persisted shape.

---

## 9. Acceptance matrix — the complete edge-case denominator

| ID | Case | Required observation | Test home |
|---|---|---|---|
| C1 | Main reachable behavior | For a lit `GOLDEN_CONFIGS` row: `status === 'ready'`, `planExtent === 1000`, and the block's own key set equals `TOWN_CARTOGRAPHY_BLOCK_KEYS` exactly (both directions). The same settlement with `simulationRules` absent, `{}`, and `{townCartographyEnabled: false}` each returns `unavailable` with `block === null` | `townCartographyBlock.test.js` (`120_000`) |
| C2 | Absent / disabled, and it costs nothing | Dark: the hook settles on `idle`, `available === false`, and **the transport module is never imported** — assert via an injected/spied dynamic-import boundary, not by timing. **Anchored:** the same hook lit DOES reach `compiling` | `useTownCartographyBlock.test.jsx` |
| C3 | ⭐ **THE PRODUCER↔CONSUMER PROOF** | C1's real block, passed to TC-5a's real `buildCartographyDrawList` (**test-only import**), returns a non-empty frozen list satisfying TC-5a's length identity `wards + arterials + lanes + buildings`, with ward ops before street ops before building ops. **Negative control:** the same block with one layer replaced by a non-array THROWS `premise` | `townCartographyBlock.test.js` (`120_000`) |
| C4 | Failure is owned, once, and never rethrown | A transport rejection (inject a settlement the compiler rejects) drives the hook to `status === 'failed'`, `block === null`, `available === false`; nothing throws into React; `console.warn` fires **exactly once**; **no error text appears in any returned value** (anchored negative) | `useTownCartographyBlock.test.jsx` |
| C5 | The CR-TC3A-1 injection is real | The lit transport does **not** throw the compiler's `namingPools was not injected` `TypeError`. **Anchored:** calling `compileTownSceneManifest` directly with `cartography.enabled` and no pools DOES throw it, proving the assertion is live and not vacuously green | `townCartographyBlock.test.js` |
| C6 | Lifecycle: idempotence and supersession | Re-rendering with the same input compiles **once** (spy count `1`); changing `audience` compiles again and the **later** generation's result wins even if the earlier settles last; unmounting before settlement produces **no** state update and no warning | `useTownCartographyBlock.test.jsx` |
| C7 | ⭐ **THE PREVENTION GUARD** | The transitive **static source** closure of `useTownCartographyBlock.js` excludes `compileTownSceneManifest.js`, `sceneCompileInput.js`, `sceneProjection.js`, `namingData.js`, `townCartographyBlock.js`, and `cartographyPaint.js`; **anchored** on `cartographyContract.js` being present and the closure having ≥2 members. Plus, with `VERIFY_DIST=1`, the bounded pair is **unchanged** (labelled a no-regression control — §6.3) | `townCartographyBlock.test.js` + `townScene3dLazy.test.js` (**run, not edited**) |
| C8 | Privacy boundary — the seam widens nothing | The transport declares **no `audience` default**: called without one, the compiled manifest's `source.audience` is `'public'`, the narrowest. **Anchored:** an explicit `'dm'` call yields `'dm'`. Plus a source scan: the transport's text contains no `audience = ` default and no audience-conditional branch (anchored on a control string) | `townCartographyBlock.test.js` |

Do not add a ninth case or a speculative cross-product.

### 9b. LIT-OUTPUT POSTURE — this packet moves NOTHING, and that is the assertion

> **TC-5b-i changes no output at all — lit or dark.** It adds two files that **no production
> module imports**. There is no declared behavior shift; the obligation is the strict inverse
> of a shipping packet's.
>
> **THE IMPLEMENTER'S OBLIGATION:** run the full gate at BASE and record the green
> golden/pin set. After the change, **any** golden, pin, dormancy fixture, manifest byte, or
> bundle figure that moved is a **STOP**, not a re-record — it means an edge reached
> somewhere this packet does not go.
> ⛔ Specifically: `tests/fixtures/town-cartography-dormancy-golden.json` byte-identical; the
> lit and dark manifests byte-identical to base; the bounded pair unchanged; the
> `manifestCompilers` chunk count still exactly `1`.
> ⚠ The **only** figures permitted to move are the five sovereignty-lighting-census numbers,
> because §7 mandates two new test files. Recorded whole, in one run, with the cause stated —
> ⏸ subject to O-5 on who performs the record.
> ⚠ **The ONLY pre-existing red to attribute is the owner-approved `generatorGoldenMaster`
> golden.** ⛔ `observedShapeReaders.walker` is **NO LONGER** a free attribution (§4c item 2);
> if it reds here it is this packet's until proven otherwise against a committed-base run.

---

## 10. Verification commands

```sh
# Baseline B1 — the test slot is acquired in the same chain.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lib/townSceneExport.test.js tests/lib/townSceneWorkerClient.test.js \
  tests/domain/townSceneCartography.test.js tests/domain/townCartographyPaint.test.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/property/townCartographyDormancyGolden.test.js

# Focused behavior (C1–C8).
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lib/townCartographyBlock.test.js \
  tests/hooks/useTownCartographyBlock.test.jsx

npx eslint src/lib/townScene/townCartographyBlock.js \
  src/components/townMap/useTownCartographyBlock.js

npm run typecheck:ratchet
npm run typecheck:domain:strict

# C7's dist half + the bounded pair — build FIRST; verify:dist reads dist/ and skips without it.
npm run build
npm run verify:dist

# Census re-derivation (§7c item 2 — see O-5), then the landing gate.
npm run check:tail
```

⚠ **Never read a gate through a pipe** — `npm run check:tail` or
`sh scripts/gate-tail.sh <command...>`; a piped read reports the PIPE's status and has
greenwashed red gates twice.
⚠ **Budget the wall-clock:** `observedShapeReaders.walker`'s `beforeAll` is sized to **900 s**
because it measures ~264 s contended. A timeout there skips all 27 tests and then trips the
test ratchet's skip sentinel — a cascade that looks like a defect and is not.

---

## 11. Recorded deviations from design prose and from sibling documents (each vetoable)

1. **D-1 — The seam compiles on the MAIN THREAD, against `townSceneWorkerClient.js`'s own
   docblock.** That file's header (`:7-9`) says *"Manifest and geometry compilation never run
   on the interaction thread."* **Measured, that sentence already describes only the viewer
   path:** `townSceneExport.js:163` compiles a manifest on the main thread today, and the one
   test that enforces the rule is scoped to a single file —
   `townScene3dLazy.test.js:284` asserts `expect(viewer).not.toContain('compileTownSceneManifest')`
   where `viewer` is **`SettlementScene3D.jsx` only**. CONFIRMED. There is no repo-wide
   prohibition. B6 is what keeps this from being a licence, and CR-TC5BI-1 ratifies the seam
   on that footing.
2. **D-2 — The hook keys on REFERENCE identity, not on `inputDigest`.** `SettlementScene3D.jsx`
   memoizes `prepareTownSceneCompileInput(...).inputDigest` and keys its effect on it. Copying
   that would statically import the compile-input graph into the hook — precisely the edge
   §6.4 forbids. Reference identity costs at worst a redundant compile; the digest would cost
   the guard. **The guard wins.**
3. **D-3 — No cache, deliberately.** `townSceneCache` exists and would fit a session-scoped
   block cache — but its key is derived from the manifest (§-1 C), so it cannot serve, and a
   new module-level `Map` would be mutable module state with an unbudgeted eviction policy. A
   mounted hook retains its block across sub-tab switches; leaving the Map tab recompiles.
   **Deliberately deferred — documented, not a bug to re-find.** If measurement later shows it
   matters, it is its own slice.
4. **D-4 — The transport takes no `mapEdits` and imports no `readMapEdits`.** The obvious
   wiring (`readMapEdits(settlement)`) would import `src/domain/townMap/mapEdits.js`, which
   CONFIRMED imports `../../design/townMapStyles.js` — the **paid lens surface** TC-5b-ii's
   D-3 refused to couple to. `mapEdits: null` reaches the same value through the projection's
   own read (`sceneProjection.js:75-77`) with no back-edge at all. ⭐ A coupling avoided by
   measurement, not by luck.
5. **D-5 — The seam exposes `{block, planExtent}`, never a manifest** (§6.5 item 2). A
   narrower surface, and it keeps the audience-projected manifest out of the component layer.
   **This amendment is APPLIED in `TC-5B-II.md` §6.2 and §7 at this promotion.**
6. **D-6 — TC-5b-ii's split table overstated this slice.** It said TC-5b-i "makes TC-5a's leaf
   reachable for the first time." Measured, TC-5a's first production importer is TC-5b-ii's
   painter. This packet makes the **block** reachable. **CORRECTED in `TC-5B-II.md` §-1 at
   this promotion.**
7. **D-7 — The drafting lane considered and REJECTED a fail-closed audience guard.** An
   earlier draft had the transport throw on a missing/unknown audience.
   `normalizeSceneAudience` already fails closed to `'public'` (`sceneProjection.js:30-34`),
   so a throwing guard would be a **second truth about audience** — the exact shape TC-5a's
   docblock forbids. **The code refuted the design; the code wins.** Recorded because the
   rejected version looks safer.

---

## 12. Open items — CLOSED at promotion, except O-5

**None was owner-gated.** This packet adds no persisted key, no vocabulary member, no flag, no
schema field, and no paid surface. The evidence and the rejected alternatives are preserved
below the rulings, because a successor needs the reasoning and not only the verdict.

- **O-1 — THE TWO HOMES. ✅ CLOSED — CR-TC5BI-2.**
  **RULED: transport at `src/lib/townScene/townCartographyBlock.js`; hook at
  `src/components/townMap/useTownCartographyBlock.js`.**
  **Evidence:** `src/lib/townScene/` already holds exactly this kind of module —
  `townSceneExport.js` (lazy main-thread transport), `townSceneWorkerClient.js`,
  `sceneCache.js`, `viewPolicy.js` — and `MapTabShell.jsx:51` already imports from that
  directory. Map-tab hooks live **beside the shell**: `useTownMapPresentation.js` and
  `useTownScenePaneBridge.js` are both in `src/components/townMap/`, not in `src/hooks/`.
  Both candidate directories carry the same `800` `max-lines` ceiling (B4).
  **Rejected, and why:** a single combined file (puts React in `src/lib/` and makes the
  compile untestable without a renderer); `src/hooks/useTownCartographyBlock.js` (contradicts
  the local townMap idiom); a `src/domain/` home (the transport performs a dynamic import and
  is a transport, not a domain law).

- **O-2 — ⛔ THE B6 STOP THRESHOLD. ✅ CLOSED — CR-TC5BI-3.**
  **RULED: `600 ms`, accepted as a MANDATORY PREFLIGHT PROBE and never a test assertion.**
  The probe runs before either production file exists; above the threshold the packet STOPS
  and reports rather than shipping a main-thread stall; the number is a receipt figure, and
  an implementer may not raise it.
  **Evidence:** the compile is off the render path, memoized per input, and only reachable for
  a reader who lit `townCartographyEnabled` (absent from `DEFAULT_SIMULATION_RULES`). The
  drafting lane executed nothing, so the real figure is unknown; the nearest proxy is the
  dormancy golden's `180_000 ms` budget for **54** whole-manifest compiles plus fixture
  construction, which bounds a single compile loosely and not usefully. `600 ms` sits above a
  comfortable interaction budget but below the point where a narrated wait becomes dishonest.
  ⚠ A wall-clock assertion in a suite would be a flake factory; that is why the ruling names
  the probe rather than a pin.

- **O-3 — THE DUPLICATED `sourceClosure()` WALKER. ✅ CLOSED — CR-TC5BI-4.**
  **RULED: accept the ~30-line duplication for this wave; extraction to a shared helper
  happens ONLY after BOTH TC-5b halves have landed, as its own small slice.**
  **Evidence:** §6.4 copies ~30 lines from `tests/build/mapTabShellLazy.test.js:104-135`
  rather than importing them, because that file is TC-5b-ii's reserved target and a
  cross-lane edit would collide (§7b). Extracting now would put a third lane in both files.
  **Rejected:** importing across test files (a test file is not a module contract); editing
  TC-5b-ii's target (a landing collision by construction).

- **O-4 — `PACKET_MANIFEST.json` NEEDS A ROW. ✅ CLOSED — CR-TC5BI-5, and the validator's
  blind spot is CURED.**
  **RULED: TC-5B-I's row is authored from §7's four REAL paths, never by copying another
  packet's — DONE at this promotion.**
  **Evidence, and what changed under it:** Lane E measured that
  `scripts/implementation-packets.mjs` skipped existence checks for `CREATE` rows entirely,
  so TC-5A's row declared three paths that never existed while `validate:packets` stayed
  green. ⭐ **That is no longer true.** At `e1e9fd6a` the validator existence-checks a
  `CREATE` row once its packet is `LANDED` (`:466-468`) — the structural cure Lane E's O-4(c)
  proposed — and the TC-5A row was corrected to its landed names in the same commit. Future
  CREATE paths remain lawful at READY/BLOCKED, by design: before a packet lands the file must
  NOT exist. ⛔ The live obligation this creates for this packet is §4c item 3.

- **⏸ O-5 — WHO RE-RECORDS THE LIGHTING CENSUS. OPEN — FOR THE CHAIR AT DISPATCH.**
  §7's reserved path set has four members and does not include
  `tests/lint/sovereigntyLightingContract.walker.test.js`, yet §7c item 2 and §8 step 8
  instruct the implementer to re-record it. The promoting lane declined to resolve this,
  because which lane edits a shared census is a decision rather than a transcription. The two
  lawful shapes, with precedent, are set out in §7's O-5 block. ⛔ **Absent a ruling the
  implementer measures, reports, and does not edit.** This does not block dispatch of the
  code work; it decides one step of it.

---

## 12d. Draft-lane judgments — ✅ FABLE-VALIDATED AT THIS PROMOTION

CR-TC5B-1 (the split) and CR-TC5B-3 (the presence oracle) are Fable-issued; building to them
owes nothing. The six judgments below were added by the Opus draft lane and each carried
validation debt. **The chair validated all six at this promotion; no `⏳` marker lands.**

1. **✅ FABLE-VALIDATED 2026-08-11 (chair session `c42c8924`, at promotion) — SHAPE D over
   A/B/C** (§-1), on four measurements: the bounded-artifact cost of A, the inverted
   resolution semantics of B, the derived cache key that makes C impossible, and the landed
   `townSceneExport.js` precedent for D. Ratified as **CR-TC5BI-1**.
2. **✅ FABLE-VALIDATED 2026-08-11 (chair session `c42c8924`, at promotion) — the seam exposes
   `{block, planExtent}`, not a manifest** (§6.5 item 2, D-5). The amendment it owed to
   TC-5b-ii is **APPLIED** in `TC-5B-II.md` at this promotion.
3. **✅ FABLE-VALIDATED 2026-08-11 (chair session `c42c8924`, at promotion) — the hook keys on
   reference identity rather than `inputDigest`** (D-2), trading a possible redundant compile
   for the §6.4 guard.
4. **✅ FABLE-VALIDATED 2026-08-11 (chair session `c42c8924`, at promotion) — a fail-closed
   audience guard was considered and REJECTED** because the landed normalizer already fails
   closed and a second guard would be a second truth (D-7).
5. **✅ FABLE-VALIDATED 2026-08-11 (chair session `c42c8924`, at promotion) — the `600 ms` B6
   STOP threshold**, ratified as **CR-TC5BI-3** and bound to a preflight probe rather than a
   test assertion (O-2).
6. **✅ FABLE-VALIDATED 2026-08-11 (chair session `c42c8924`, at promotion) — TC-5b-ii's split
   table is corrected** on what this slice makes reachable (D-6). The correction is
   **APPLIED** in `TC-5B-II.md` §-1 at this promotion.

---

## 13. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md`, stop if:

- **⛔ The B6 compile measurement exceeds the ruled `600 ms` threshold.** Report; do not ship
  a main-thread stall, do not "optimize" the compiler, and do not raise the number.
- **⛔ Either new file would need a STATIC import outside §6.1 / §6.2's permitted lists** —
  in particular any static edge from the hook to the transport, the compiler, the
  compile-input seam, or the naming table. That edge is the whole reason this packet exists.
- **⛔ The transport would need a `try/catch`, a cache, module-scope mutable state, or an
  `audience` default.** Each is a second truth (§6.1, D-3, D-7).
- **⛔ Any edit would reach a worker, the worker client, `sceneCache.js`, the compiler, the
  compile-input seam, `sceneProjection.js`, `cartographyContract.js`, or either TC-5a leaf.**
- **⛔ Any edit would reach one of TC-5b-ii's nine reserved paths** (§7b) — including
  `tests/build/mapTabShellLazy.test.js`.
- The seam would need to call `buildCartographyDrawList` in **production** (§6.5 item 3), or
  to filter, re-sort, or re-project the block in any way.
- Any solution needs a schema field, vocabulary member, version bump, feature flag, new
  persisted key, PRNG draw, clock read, or float.
- A golden, pin, dormancy fixture, or bundle figure moves at all (§9b), or
  `manifestCompilers` stops being exactly `1`.
- A concurrent lane holds uncommitted test titles at census-re-record time (§7c item 2) —
  report, do not re-record, do not census a live shared tree.
- **⏸ §8 step 8 is reached and O-5 is still unruled** — measure, report, and stop short of
  the walker edit.
- Any packet premise here is refuted by live code. **The code wins; the packet stops.**
