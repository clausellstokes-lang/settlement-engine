# Town Cartography / TC-5b-ii — the painter's mount (colour binding + the sub-tab)

- **Status:** BLOCKED
- **Status note:** ⛔ **BLOCKED ON TC-5b-i LANDING — and on nothing else.** The §-1 refusal
  that produced this status is DISCHARGED as a refusal: **CR-TC5B-1 ratified the two-way
  producer-first split**, and the producer is `TC-5B-I.md`, promoted READY at this same
  documentation change. This document is written for slice (ii) and is otherwise reconciled;
  it flips READY when TC-5b-i lands, its base is re-derived at that SHA, and **CR-TC5B-4's
  deferred item (O-2, the A-4 notice copy) is ruled at that promotion.**
- **What is NOT the blocker:** the mount/seat question. That one is **SETTLED, measured,
  and NOT owner-gated** (§2b). The chair's `8738f5ea` ruling holds and is safe to keep.
- **Packet version:** `1`
- **Drafted by:** Lane E (read-only compile lane), 2026-08-11, Opus-era — see §12d.
  Reconciled against TC-5b-i and recorded by Lane J under the Fable chair, 2026-08-11.
- **Verified base:** `claude/composite-r4` at `ffc85a90368e3cdb16018dd5e25ef5ec0bceedc5`
- **Base note:** CONFIRMED at draft time — branch `claude/composite-r4`, HEAD `ffc85a90`.
  TC-5a's landing `41b39220` is an ancestor (`git merge-base --is-ancestor` exit 0). Four
  commits sat between; **none touched this packet's substrate** —
  `git log 41b39220..ffc85a90 -- src/lib/mapSubTabs.js src/lib/lastMapView.js
  src/components/townMap/ src/domain/townCartography/ src/design/` returns EMPTY.
  ⭐ **FORWARD-VERIFIED AT TC-5b-i's PROMOTION (2026-08-11, Lane J).** HEAD has since moved to
  `e1e9fd6a`. `git log --oneline 904b7bb0..e1e9fd6a -- <the same substrate + townScene>`
  returns exactly one commit, `73f5be96`, and it touches only
  `tests/lint/sovereigntyLightingContract.walker.test.js`, **comment-only** — the census
  figures did not move; the row moved from `:3676` to `:3681` (§4b B6). ⛔ **The base above is
  deliberately NOT restamped to `e1e9fd6a`:** a BLOCKED packet keeps the base it was measured
  at, and the coordinator re-derives it whole at the READY flip against TC-5b-i's landing SHA.
- **⚠ The tree is DIRTY with FOREIGN work.** At draft time: 16 modified, 0 untracked.
  At TC-5b-i's promotion: **7 modified, 0 untracked** (six `supabase/functions/_shared/*`
  edge-bundle artifacts plus `tests/domain/explanation.test.js`). CONFIRMED disjoint from
  every path named here (§7b) on both measurements. Reserved and untouched.
- **Depends on:** ⛔ **TC-5b-i (the manifest seam) — the blocking dependency, not yet landed.**
  Then TC-5a at `41b39220`; TC-4 at `5a6f76fe`; TC-3b at `a45c969d`;
  TC-3a at `5066c34b`; TC-0..TC-2 at `6e96e259` + `0dcc3b9d`
- **Collision group:** `town-cartography-contract-and-compiler` **plus a new
  `map-tab-shell` group** (§7b) — serialize against every other TC wave AND against any
  lane touching the Map tab shell.
- **Commit authority:** to be stated by the chair at the READY flip.

---

## -1. THE REFUSAL THAT PRODUCED THE SPLIT — measured, and RATIFIED at CR-TC5B-1

TC-5A.md §-1 scoped TC-5b as *"the `Map ▸ Illustrated` sub-tab: lazy leaf, presence gate,
token→colour binding, SVG render, A-4 degraded state"* — one behavior family, one surface.
That scoping rests on an unstated premise: **that a compiled `TownSceneManifest` carrying
`manifest.cartography` is already reachable from the dossier's Map tab.**

**It is not. CONFIRMED, three independent ways:**

1. `grep -rn "compileTownSceneManifest" src/components src/hooks src/store` → **ZERO hits.**
2. The **only** React holder of a manifest anywhere in the tree is
   `src/components/townMap/scene3d/SettlementScene3D.jsx` — the portrait3d leaf. It obtains
   one asynchronously: `:159` `createTownSceneWorkerClient()`, `:252-272`
   `workerClient.compile(compileInput, options, { onManifest: … setManifest(nextManifest) })`,
   held in local `useState` (`:136`). It is the sole consumer of that client in `src/`.
3. **No manifest is ever persisted or cached.** `grep` for a manifest on the settlement blob
   / saves / store → **ZERO hits**; `src/lib/townScene/sceneCache.js` caches compiled
   **geometry** only. The manifest lives exactly as long as `SettlementScene3D`'s local
   state.

So a cartography sub-tab cannot read `manifest.cartography` from any prop, store slice,
hook, or cache. **It must acquire one, and both available shapes are new plumbing:**

- **(a) The worker path** — `prepareTownSceneCompileInput` + `createTownSceneWorkerClient` +
  `onManifest`, then abort the now-useless geometry pass. ⚠ CONFIRMED the client has **no
  manifest-only mode**: `compile()` normalizes only `{lodBias, massingOnly}`
  (`townSceneWorkerClient.js:260`, `:277-278`), and the worker compiles geometry
  unconditionally after posting the manifest. This is async lifecycle, abort semantics,
  error states, and a naming-pools gate.
- **(b) The synchronous path** — call the compiler in-leaf plus
  `await import('../../data/namingData.js')`, dragging the compiler graph and the naming
  table into the leaf's chunk.

**Either way that is a second behavior family with its own lifecycle, its own failure
modes, and its own guard** — against a budget of one. `PACKET_STANDARD.md` forbids
renegotiating the budget, so the packet stopped and proposed the smallest split.

### ⭐ AND THE SPLIT ORDER IS NOT ARBITRARY — the program has already paid for getting it wrong

The tempting split is "paint first on an injected block, wire the producer later". **That is
exactly the shape ES-7 was REFUSED for**: five waves of consumers built against a dispatcher
nobody had chartered, leaving 5 of 6 Herald kinds with **no reachable producer**. TC-5a is
already one consumer-side wave with zero production importers; adding a second before the
producer exists would repeat the pattern at the point where it becomes expensive to unwind.

**The split, producer-first — RATIFIED at CR-TC5B-1:**

| Slice | Behavior family | Surface | Why separable |
|---|---|---|---|
| **TC-5b-i** — the cartography manifest seam | Acquire a compiled cartography block for a settlement, with its lifecycle (idle / compiling / ready / unavailable / failed) | none (a transport plus a hook) | It is the PRODUCER. Testable headlessly against the real compiler; it makes the **BLOCK** reachable for the first time |
| **TC-5b-ii** — the painter mount | The `Map ▸ Cartography` sub-tab: seat, colour binding, SVG render, A-4 degraded state | one | Consumes the seam. Owns the only user-facing surface, the only first-paint risk, and **TC-5a's leaf's FIRST PRODUCTION IMPORTER** |

⚠⚠ **CORRECTION APPLIED AT TC-5b-i's PROMOTION (its D-6; validated 2026-08-11).** This table
previously said TC-5b-i *"makes TC-5a's leaf reachable for the first time."* **Measured, that
is wrong and the rows above are corrected:** TC-5a's leaf (`buildCartographyDrawList`) gains
its first **production** importer at **TC-5b-ii — this packet.** What TC-5b-i makes reachable
is the **block** that leaf consumes; TC-5b-i's own C3 imports the leaf **test-only**, to prove
producer and consumer meet, and creates no production edge.

TC-5c (PNG goldens) and TC-5d (skins) are unchanged and still not compiled.

**Everything below §0 is written for TC-5b-ii** and is reconciled against live code and
against `TC-5B-I.md`, so the chair can flip it READY the moment TC-5b-i lands.

---

## 0. Why this packet exists, and what it starts from

TC-5a landed two pure leaves — `cartographyPaint.js` (`buildCartographyDrawList`) and
`cartographyPaintRoles.js` (the ROLE program) — with **zero production importers by
design**. CONFIRMED at draft time: the only importers anywhere are two test files. Nothing
renders a cartography block.

TC-5b-ii builds the mount: the sub-tab seat, the ROLE→colour binding, the SVG render, and
the A-4 degraded state. It is the first packet that makes the painter reachable by a reader.

**Observable result:** with the flag lit and a block available from TC-5b-i's seam, the
dossier's Map tab offers a `Cartography` sub-tab that draws the block in house-voice colour;
dark, the sub-tab is ABSENT; the dark path stays byte-identical.

---

## 1. Reconciled authority

1. **`DESIGN_TOWN_CARTOGRAPHY.md` §12 governs the shell and §11c (A-9) colour** — both
   amended by landed code, recorded in §11.
2. **The chair's seat ruling (`8738f5ea`, TC-5A §12 O-1) is BINDING:** a **NON-PRESENTATION**
   sub-tab, like `player`. §2b proves it touches no closed persisted vocabulary.
3. **The chair's naming ruling is BINDING:** the id is **`cartography`**, never
   `illustrated` (`townMapStyles.js:74` — a live pickable lens over the LEGACY
   `TownMapModel` with a paid `LENS_COUNT` warning).
4. **Landed TC-5a outranks design prose on the painter's shape.** The op vocabulary, the
   role vocabulary, and the length identity are fixed and may not be re-litigated.
5. **The colour rules are LINT LAW, not prose** — `visual-budget/no-raw-color` (error) and
   `no-forked-color-const` (error, `src/components/**`), with
   `scripts/.forked-color-baseline.json` = **`[]`, EMPTY** (CONFIRMED). One
   `const X = '#hex'` in the new component is a hard error.
6. **CR-TC5B-1..4 are BINDING.** **CR-TC5B-1** ratifies the producer-first split (§-1);
   **CR-TC5B-2** rules the token entry — the binding lives at
   `src/components/townMap/subtabs/cartographyColours.js` and imports `src/design/tokens.js`
   directly (§6.1, §12 O-1); **CR-TC5B-3** rules that the presence oracle is **the BLOCK**,
   not the flag (§6.3 edit 4, §12 O-3); **CR-TC5B-4** DEFERS the A-4 notice's exact copy to
   **this packet's own promotion** (§12 O-2 — still OPEN, deliberately).
7. **`TC-5B-I.md` outranks this document on the seam's shape.** It is the producer's contract;
   §6.2 and §7 below are written to what it actually exposes.

---

## 2. Outcome and non-goals

**Definition of done:** a lit settlement's Map tab shows a `Cartography` sub-tab; selecting
it renders TC-5a's draw list as SVG with every colour resolved through the token system; a
dark flag or an unavailable block means the tab is ABSENT; a compile/paint failure degrades
to a visible honest notice (A-4), never a blank panel; the leaf rides its own lazy chunk;
`TOWN_MAP_VIEW_IDS` is **untouched**; the dark path and every golden are byte-identical.

In scope: the `cartography` id/label/presence gate in `mapSubTabs.js`; the lazy mount in
`MapTabShell.jsx`; the SVG painter leaf; the ROLE→colour binding; the A-4 state; the
lazy-chunk guard.

Explicit non-goals — each is another packet or another authority:

- **The manifest seam — TC-5b-i.** ⛔ This packet consumes it and never builds it.
- **PNG / raster — TC-5c.** **Skins and style knobs — TC-5d** (no `townMapStyles.js`, no
  `TOWN_MAP_LENS_IDS`, no `bespokeStyles.js`, nothing entitlement-bearing).
- **AI editing controls (A-11 bullet 3)** — deferred beyond TC-5d.
- **The lynch-rubric gate (A-10)** — CONFIRMED unbuilt and SYNTHESIS-side; `scoreLynch`
  scores `townLayoutV2`'s legacy shape and is never called from cartography. Chair recorded
  it as slice `TC-2r`.
- **Any schema, contract, or vocabulary change**; any edit to `cartographyContract.js` or
  either TC-5a leaf.
- **Any persisted-vocabulary change** — `TOWN_MAP_VIEW_IDS` / `PRESENTATION_SUB_TAB_IDS`
  are forbidden edits (§2b).
- **Tuning of any landed band**, including TC-5a's §6.1 numbers (chair-approved as
  authored; ⛔ the implementer may not tune them).
- Hit-maps/a11y structure list — TC-6. Pulse reactivity — TC-7. Exports/promotion — TC-8.
- Soak, promotion, deployment, marketplace activation.

### 2b. ⭐ THE MOUNT QUESTION, SETTLED BY MEASUREMENT — the seat is NOT owner-gated

**The task asked whether every existing mount point IS the persisted vocabulary. It is
not.** There are **two** mount lists, and only one is persisted:

| List | File:line | Persisted? |
|---|---|---|
| `PRESENTATION_SUB_TAB_IDS` | `src/lib/mapSubTabs.js:56-58` | **YES** — it *is* `TOWN_MAP_VIEW_IDS`, by direct alias |
| `MAP_SUB_TAB_IDS` | `src/lib/mapSubTabs.js:61-64` | **NO** — `[...PRESENTATION_SUB_TAB_IDS, MAP_SUB_TAB_PLAYER]` |

CONFIRMED, `mapSubTabs.js:56-58`:

```js
export const PRESENTATION_SUB_TAB_IDS = /** @type {ReadonlyArray<
 * 'plan'|'panorama'|'portrait3d'
 * >} */ (TOWN_MAP_VIEW_IDS);
```

and `lastMapView.js:23-27` defines `TOWN_MAP_VIEW_IDS` with the docblock *"Never rename an
id in place: old device entries may outlive several releases."* — a closed,
migration-bearing, localStorage-persisted vocabulary. Joining THAT is owner-gated. **This
packet does not.**

**`player` is the live, shipped precedent**, and it settles the question by existence:

- `MAP_SUB_TAB_PLAYER = 'player'` (`:49`) sits in `MAP_SUB_TAB_IDS`, **not** in
  `PRESENTATION_SUB_TAB_IDS`.
- `presentationViewFor(id)` returns `null` for it (`:188-190`), so `MapTabShell.jsx:157-160`
  writes **no** `lastMapView` sidecar entry.
- `isPresentationSubTab('player')` is `false` (`:91-93`), so the pane never receives it.
- CONFIRMED independently: `tests/ui/mapTabShell.test.jsx:240-247` is an existing test named
  for exactly this — *"the Player View choice records NOTHING"*. **It is the template C7
  copies.**

**THE ONE THING THE SEAT STILL TOUCHES, and why it is nonetheless safe.**
`MapTabShell.jsx:151` calls `setMapSubTab(id)` for **every** sub-tab, and `displayPrefs`
**is** persisted (`store/index.js:120` `partialize`; registered at
`tests/store/lifecycleRoundTrip.test.js:135`). So selecting `Cartography` **will** persist
the string `'cartography'` into `displayPrefs.mapSubTab`.

That is **not** a persisted-vocabulary change, for four measured reasons:

1. **No new key, no new record family** — `displayPrefs.mapSubTab` already exists
   (`displayPrefsSlice.js:75`).
2. **The setter is SHAPE-guarded, never VOCABULARY-guarded** (`:119-124`, accepts any
   non-empty string). Its docblock (`:31-37`) says so outright: *"The vocabulary is owned by
   lib/mapSubTabs.js and deliberately NOT re-spelled here… The store holds an opaque
   string."* The persisted value space is **already unbounded**.
3. **The reader re-normalizes against PRESENCE every render** — `MapTabShell.jsx:147`
   `normalizeMapSubTab(chosen ?? persistedSubTab, present)`. An unknown, retired, or
   gated-off value opens Plan. Stricter than vocabulary membership.
4. **`'player'` is ALREADY persisted into that exact key today**, already outside
   `TOWN_MAP_VIEW_IDS`. The shape is one the shipped product has carried since TC-0.

No migration seam to extend, no rename hazard: nothing keys off the value except a
normalizer that already fails safe.

**VERDICT: CONFIRMED — the non-presentation seat is compilable and NOT owner-gated.** The
chair's ruling holds. This packet adds the one thing the ruling did not state: the seat
still persists an id into `displayPrefs`, and that is safe by the four facts above rather
than by silence. Recorded so no reviewer rediscovers it as a defect.

---

## 3. Hard scope budget

| Limit | Packet budget | Default | Note |
|---|---:|---:|---|
| Behavior families | `1` | `1` | draw list → painted sub-tab |
| New persisted record families / writers | `0 / 0` | `1 / —` | §2b |
| Feature flags / user-facing surfaces | `0 / 1` | `1 / 1` | reuses the virtual `townCartographyEnabled` |
| Direct production consumers | `2` | `2` | at cap — `mapSubTabs.js`, `MapTabShell.jsx` |
| New logic-bearing production leaves | `2` | `2` | at cap — painter component, palette |
| Existing logic-bearing production files | `2` | `3` | |
| Registration-only files | `1` | `3` | `src/design/boundBook.js` (§7c) |
| Handwritten files total | `9` | `12` | §7 |
| Effective production-line delta | `<=330` | `400` | projected `~250` |
| New leaf — the palette | `<=90` | `250` | projected `~70` |
| New leaf — the painter component | `<=240` | `600` (jsx layer) | projected `~180` |
| `mapSubTabs.js` delta | `<=15` | `15` | shared-file cap; **at cap** |
| `MapTabShell.jsx` delta | `<=15` | `15` | shared-file cap; **at cap** |
| Acceptance cases | `8` | `8` | at cap |

**MEASURED layer ceilings and current counts** (eslint `max-lines`, `skipBlankLines` +
`skipComments`):

| File | Effective lines | Layer ceiling | Headroom |
|---|---:|---:|---:|
| `src/lib/mapSubTabs.js` | `57` | `800` | `743` |
| `src/components/townMap/MapTabShell.jsx` | `109` | `600` | `491` |
| `src/components/townMap/subtabs/MapPlayerSubTab.jsx` | `104` | `600` | `496` |
| `src/design/tokens.js` | `435` | **none** — `src/design/**` matches no `max-lines` glob | — |

⛔ **`scripts/.size-baseline.json` must NOT gain an entry.**
`tests/lint/sizeBaseline.test.js:98` asserts **EXACT SET equality** between the baseline's
keys and the set of files strictly OVER their layer ceiling; `:115-120` pins each number to
**exact equality in both directions** (shrinking without lowering also reds). A compliant
file's entry REDS the gate.

The two shared-file deltas are the binding constraints — not any byte ceiling.

---

## 4. Preflight

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor 41b39220 HEAD     # TC-5a
git merge-base --is-ancestor <TC-5b-i SHA> HEAD # the manifest seam — MUST exist

# Substrate untouched.
git log --oneline <TC-5b-i SHA>..HEAD -- \
  src/lib/mapSubTabs.js src/lib/lastMapView.js src/components/townMap/ \
  src/domain/townCartography/ src/design/                      # expect EMPTY

# The seam this packet consumes exists and has the shape TC-5B-I.md specifies.
rg -n 'export async function compileTownCartographyBlock' src/lib/townScene/townCartographyBlock.js
rg -n 'export function useTownCartographyBlock' src/components/townMap/useTownCartographyBlock.js

# New files absent.
test ! -e src/components/townMap/subtabs/MapCartographySubTab.jsx
test ! -e src/components/townMap/subtabs/cartographyColours.js
test ! -e tests/ui/mapCartographySubTab.test.jsx

# Targets clean (path-scoped — foreign dirt elsewhere is RESERVED, never touched).
git diff --quiet -- src/lib/mapSubTabs.js
git diff --quiet -- src/components/townMap/MapTabShell.jsx
git diff --quiet -- src/design/boundBook.js
git diff --quiet -- tests/lib/mapSubTabs.test.js
git diff --quiet -- tests/ui/mapTabShell.test.jsx
git diff --quiet -- tests/build/mapTabShellLazy.test.js
git diff --quiet -- tests/design/deepCraftKillList.test.js
git diff --quiet -- tests/lint/sovereigntyLightingContract.walker.test.js

# Live symbols.
rg -n 'export function buildCartographyDrawList' src/domain/townCartography/cartographyPaint.js
rg -n 'export const CARTOGRAPHY_PAINT_ROLES' src/domain/townCartography/cartographyPaintRoles.js
rg -n 'MAP_SUB_TAB_IDS|MAP_SUB_TAB_PLAYER|resolveMapSubTabs|presentationViewFor' src/lib/mapSubTabs.js
rg -n 'TOWN_SCENE_PLAN_EXTENT' src/domain/townScene/manifestContract.js
rg -n 'expectAbsentWithAnchor|expectPresentThenAbsent' tests/helpers/anchoredNegatives.js
```

Any target collision or material symbol drift makes this packet `STALE`. ⛔ **The whole
preflight is re-derived at the READY flip against TC-5b-i's landing SHA — the base in the
header is the draft-time measurement, not a dispatch base.**

### 4b. Baselines

⚠ The drafting lane executed **no** test, build, or gate command (read-only draft lane; the
gate mutex was not its to take). Rows are **AUTHOR-TIME-UNMEASURED** unless marked MEASURED.

| # | Premise | Exact command | Expected / recorded |
|---|---|---|---|
| B1 | Map-shell suites green at base | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lib/mapSubTabs.test.js tests/ui/mapTabShell.test.jsx tests/build/mapTabShellLazy.test.js tests/hooks/useTownMapPresentation.test.jsx tests/ui/mapPresentationControlledSeam.test.jsx` | **UNMEASURED** — exit 0 |
| B2 | Cartography suites green | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/townCartographyPaint.test.js tests/domain/townCartographyDeterminism.test.js tests/property/townCartographyDormancyGolden.test.js` | **UNMEASURED** — exit 0 |
| B3 | Bounded pair | `npm run build && npm run verify:dist` | **UNMEASURED** — TC-5a landed it at `385,137`. Expected delta **`0`** (§6.5) |
| B4 | Typecheck posture | `npm run typecheck:ratchet && npm run typecheck:domain:strict` | **UNMEASURED** — exit 0 both, named separately. ⚠ An unbaselined new file's error allowance is **ZERO** |
| B5 | Effective-line ceilings | see §3 | **MEASURED** |
| B6 | ⭐ Lighting census row | read `tests/lint/sovereigntyLightingContract.walker.test.js` | **MEASURED BY READ at `e1e9fd6a`: line `:3681` = `files: 2395, parked: 365, credited: 2030, titles: 19732, suiteTitles: 5568`.** ⚠ The draft measured the same five figures at `:3676`; `73f5be96` moved the line number only. ⛔ See §4c — TC-5A.md's figures are TWO re-records stale, and **TC-5b-i will move this row again** |
| B7 | Render-blocking CSS | `npm run build`, then the one linked stylesheet | **MEASURED: `19,795 B` vs `CSS_BUDGET_BYTES = 19_800`.** ⭐ **NOT BINDING here — §6.6** |
| B8 | Forked-colour baseline | `cat scripts/.forked-color-baseline.json` | **MEASURED: `[]` — EMPTY.** Zero grandfathering |
| B9 | Pre-existing gate reds | committed-base run | **⚠ CORRECTED — see §4c.** Only `generatorGoldenMaster` remains |

⛔ **B6 will be stale at the READY flip by construction.** TC-5b-i mints two new test files
and moves all five figures. **Re-derive from the FILE at the flip, never from this row.**

### 4c. ⚠⚠ TWO CORRECTIONS TO LANDED PACKET DOCUMENTS — do not inherit either

Both would mislead an implementer, and both are measured.

1. **THE CENSUS FIGURES AND LINE NUMBER IN `TC-5A.md` ARE STALE — by two re-records.**
   TC-5A.md `:191` and `:434` cite line `:3621` and `2392 / 365 / 2027 / 19659 / 5552`.
   **CONFIRMED the row is line `:3681` at `e1e9fd6a` and reads
   `2395 / 365 / 2030 / 19732 / 5568`.** Provenance by `git log -S`:
   `41b39220` (TC-5a) → `2393/365/2028/19696/5560`; `53d538b4` (ES-6a) →
   `2395/365/2030/19719/5568`; `36159389` (schema-5 code half) → `…/19732/…`.
   ⛔ **Re-derive from the FILE at preflight. Never from a packet, never from `INDEX.md`.**
   ⚠⚠ **AND DO NOT TRUST THE COMMENT ABOVE THE ROW EITHER.** The ~24-line block above it is
   **TC-5a-era prose that was not rewritten when the row was re-recorded
   twice**. It names ES-6a as an in-flight concurrent lane holding untracked test files and
   ends *"Until that fold lands, this arm reds in the shared working tree for a FOREIGN
   reason, not for this packet's."* **ES-6a has since LANDED (`53d538b4`) and the row was
   folded**, so that sentence now describes a resolved situation. ⛔ **An implementer who
   reads it at preflight would wrongly excuse a real red as foreign.** Treat the arm as
   expected-GREEN at a clean base, and attribute any red on measured evidence.
2. **THE `observedShapeReaders.walker` "PRE-EXISTING RED" EXCUSE HAS EXPIRED.**
   TC-5A.md §9b and ES-6A.md both say to attribute `observedShapeReaders.walker`
   (violations 1, stale 4) as pre-existing and never chase it. **That red was discharged at
   the schema-5 genesis** (`ffc85a90`): its commit body records both named reds gone and the
   gate reduced to exactly one failing test outside the frozen census.
   ⛔ **If that walker reds under this packet, it is THIS PACKET'S.** The only legitimate
   pre-existing red to attribute is the **owner-approved `generatorGoldenMaster` golden.**

⭐ **A third, recorded at TC-5b-i's promotion:** `validate:packets` no longer skips existence
checks on `CREATE` rows. At `e1e9fd6a` a `CREATE` row is existence-checked once its packet is
`LANDED` (`scripts/implementation-packets.mjs:466-468`), and TC-5A's three fictional paths
were corrected in the same commit — the structural cure §12 O-4(c) proposed. **The
consequence for this packet:** §7's three `CREATE` paths must exist **exactly as spelled** at
the LANDED flip, so a rename during implementation must move the manifest row in the same
change.

---

## 5. Verified tree contract

| Role | File | Symbol | Required fact/use |
|---|---|---|---|
| The draw list | `src/domain/townCartography/cartographyPaint.js` | `buildCartographyDrawList` | `(cartography) -> ReadonlyArray<CartographyDrawOp>`; frozen; absence → frozen `[]`; malformed → throws `premise`. **Forbidden edit.** ⭐ **This packet is its FIRST PRODUCTION IMPORTER** (§-1). |
| The role vocabulary | `src/domain/townCartography/cartographyPaintRoles.js` | `CARTOGRAPHY_PAINT_ROLES` | The 10 frozen roles the palette binds exact-set-both-ways. **Forbidden edit.** |
| ⭐ The block's producer | `src/components/townMap/useTownCartographyBlock.js` | `useTownCartographyBlock(input)` → `{ status, block, planExtent, available }` | **TC-5b-i's seam.** ⛔ Consumed, never built here (§-1). **Forbidden edit.** `available === (status === 'ready')` is the presence oracle (CR-TC5B-3). |
| ⭐ The block's transport | `src/lib/townScene/townCartographyBlock.js` | `compileTownCartographyBlock` | TC-5b-i's. ⛔ **Never imported by this packet** — the hook is the only door. **Forbidden edit.** |
| Sub-tab vocabulary | `src/lib/mapSubTabs.js` | `MAP_SUB_TAB_IDS`, `LABELS`, `resolveMapSubTabs` | **MODIFY** — the new id joins `MAP_SUB_TAB_IDS` only. ⛔ `PRESENTATION_SUB_TAB_IDS` **forbidden**. |
| ⛔ Persisted vocabulary | `src/lib/lastMapView.js` | `TOWN_MAP_VIEW_IDS` | **FORBIDDEN EDIT — the owner-gated surface (§2b).** |
| The shell | `src/components/townMap/MapTabShell.jsx` | `lazy()` block, panel switch | **MODIFY** — one lazy leaf + one branch. |
| ⭐ Non-presentation exemplar | `src/components/townMap/subtabs/MapPlayerSubTab.jsx` | whole file | **Copy its shape.** CONFIRMED: **exactly ONE prop** (`{ settlement }`, `:54-56`); **store-free** (no `useStore`); mints and STAMPS a sentinel (`:46-47`, `:86`); owns a **narrated** empty state (`:129`). |
| ⭐ The token entry (CR-TC5B-2) | `src/design/tokens.js` | `color`, `semantic` | The palette imports **this module directly**, not the `src/components/theme.js` shim. ⚠ CONFIRMED the current house idiom is the shim; the shim's own header says new code should import `tokens.js` directly, and the chair ruled with it. **Forbidden edit.** |
| The viewBox extent | `src/domain/townScene/manifestContract.js` | `TOWN_SCENE_PLAN_EXTENT` (`= 1000`) | ⭐ **The block carries NO extent** — the seam resolves it. §6.2. **Forbidden edit.** |
| Persisted display prefs | `src/store/displayPrefsSlice.js` | `setMapSubTab` | Shape-guarded, already unbounded (§2b). **Forbidden edit.** |
| Lazy-chunk guard | `tests/build/mapTabShellLazy.test.js` | `BODIES`, `FORBIDDEN_IN_SHELL_CLOSURE`, `sourceClosure()` | **TEST edit** — §7c lists all five obligations. ⚠ TC-5b-i **copies** `sourceClosure()` rather than editing this file; extraction to a shared helper is a post-both-halves slice (TC-5B-I §12 O-3, CR-TC5BI-4). |
| Bounded-pair guard | `tests/build/townScene3dLazy.test.js` | the bounded-payload `it` | **Run, never edit.** ⚠ Its `expect(manifestCompilers).toHaveLength(1)` arm is the forward hazard TC-5b-i recorded for this packet: giving the seam its first importer must not mint a second compiler chunk (TC-5B-I §6.3). |
| Negative-anchor helper | `tests/helpers/anchoredNegatives.js` | `expectAbsentWithAnchor(collection, member, anchor, context?)`, `expectPresentThenAbsent(before, after, member, context?)` | Every negative uses one. New files start at ceiling **ZERO**. |

Forbidden production edits: everything above marked forbidden, plus all of
`src/domain/townCartography/**` and `src/domain/townScene/**`, `src/lib/townScene/**`,
`src/design/townMapStyles.js`, `src/design/townMapExportPalette.js`,
`src/domain/townMap/**`, `src/store/**`, `src/kernel/deterministicPng.js`,
`vite.config.js`, `eslint.config.js`, `scripts/.size-baseline.json`,
`scripts/.forked-color-baseline.json`, `scripts/.observed-shape-readers-baseline.json`,
and every file outside §7.

---

## 6. Exact contracts

### 6.1 New leaf — the ROLE→colour binding

**Home: `src/components/townMap/subtabs/cartographyColours.js`, importing
`src/design/tokens.js` DIRECTLY — RULED at CR-TC5B-2.** Rationale and rejected homes: §12 O-1.

Exhaustive over `CARTOGRAPHY_PAINT_ROLES`, both directions, **built — never authored as a
parallel table. Copy TC-5a's `exhaustiveOver` discipline
(`cartographyPaintRoles.js:66-81`)**: a missing member or foreign key throws at module load.

```js
resolveRoleFill(role, tonePermille) -> string
```

- Every value derives from the token system. **No hex literal, no `rgb(`/`hsl(`, no local
  `const X = '#…'`** — B8 makes this a hard error with zero grandfathering.
- `tonePermille` (integer `0..1000`) modulates the role's base value. State the exact
  rounding; **no float may reach the emitted string.**
- An unknown role **THROWS** — never falls back (TC-5a's fail-open reasoning, `:24-28`).

⚠ **THE VACUITY TRAP.** `CARTOGRAPHY_PAINT_ROLES` has **10** members but only **8** are
reachable from a draw op: CONFIRMED no ward kind maps to `green` or `water`
(`WARD_ROLE_BY_KIND`, `:87-100`), and the leaf's docblock (`:44-48`) says the vocabulary is
*"deliberately WIDER than the ward map"*. **C3 must therefore bind over the ROLE
VOCABULARY, not over observed ops** — an "every op's role resolves" test is vacuous for
`green`/`water` and would let a half-populated binding ship.

**Permitted imports — anything else is a STOP:**
`../../../domain/townCartography/cartographyPaintRoles.js` and `../../../design/tokens.js`.

### 6.2 New leaf — the painter component

**Home: `src/components/townMap/subtabs/MapCartographySubTab.jsx`.** Prop surface mirrors
`MapPlayerSubTab.jsx`'s minimal idiom. Renders one `<svg>` from
`buildCartographyDrawList(block)` **in the emitted op order** — wards, streets, buildings,
painter's algorithm back to front. **The component must not re-sort**; re-sorting would be a
second ordering truth.

⭐⭐ **THE VIEWBOX — AMENDED AT TC-5b-i's PROMOTION (its D-5; validated 2026-08-11).**
**`planExtent` arrives as a RESOLVED NUMBER prop. There is no `manifest` prop, and the
component must not ask for one.**

The substrate fact is unchanged: CONFIRMED the block carries no extent —
`TOWN_CARTOGRAPHY_BLOCK_KEYS` is exactly `[buildings, parcels, schemaVersion, streets, wards]`
(`cartographyContract.js:74-80`), and the validator takes `planExtent` from a **context**
argument (`:486`, `:496`). What changed is **who resolves it**: this packet's draft had the
painter read `manifest?.space?.planExtent` off a manifest prop, on the
`townSceneLivingPresentation.js:52` precedent. **TC-5b-i's seam never exposes a manifest** —
deliberately: handing a whole audience-projected manifest to a UI leaf is a wide surface for
a component that needs one integer, and it would give the painter a second route to facts the
block already carries. `useTownCartographyBlock` returns `{ status, block, planExtent,
available }`, and **the shell threads `block` and `planExtent` down as two props.**
⛔ **A `manifest` prop on this component is a STOP.** ⛔ Do not invent a bounds pass and do not
restate `TOWN_SCENE_PLAN_EXTENT`. `viewBox="0 0 <planExtent> <planExtent>"`; C1's
`viewBox="0 0 1000 1000"` assertion is unchanged.

**Geometry.** `PlanPoint` is an integer `[x, y]` pair (CONFIRMED `cartographyWards.js:240`;
validator `cartographyContract.js:342-359` requires integers `0..extent`). Ward/building
`polygon` → `<polygon points>`; street `polyline` → `<polyline points>`. Coordinates emitted
verbatim — **the component owns no geometry and performs no vertex arithmetic.**

**Colour.** `resolveRoleFill(op.role, op.tonePermille)` per op. Street stroke derives from
`widthPlan` and `weightPermille`, **both already on the op** — author no second weight table.

**A-4 DEGRADED STATE (BINDING).** `buildCartographyDrawList` **throws** `premise` on a
malformed block (`cartographyPaint.js:75-116`). The component MUST catch it and render a
**visible, honest notice** — never a blank panel, never a silent fallback, and **never the
raw error text** (legibility law). A legitimately **EMPTY** draw list (the frozen `[]`)
renders the leaf's own narrated empty state — a **different** case, tested separately (C5).
⏸ **The exact copy is CR-TC5B-4's deferred item and is ruled at this packet's promotion
(§12 O-2). ⛔ The packet must not ship placeholder wording.**

⚠ **`fallback={null}` IS FORBIDDEN.** `tests/lint/loadingNarrationRatchet.test.js` pins
`NULL_FALLBACK_PIN = 40` and `BARE_LOADING_PIN = 33` at **exact equality**; a new silent
Suspense boundary or a bare "Loading…" reds. Copy `MapPlayerSubTab.jsx:132-139`'s narrated
fallback.

**Purity/first paint.** No store read, no clock, no randomness. Mounted only through
`lazy()` — **zero** first-paint bytes.

### 6.3 The sub-tab seat — exact edits to `mapSubTabs.js`

Four edits, and no others:

1. `export const MAP_SUB_TAB_CARTOGRAPHY = 'cartography';`
2. `MAP_SUB_TAB_IDS` becomes
   `[...PRESENTATION_SUB_TAB_IDS, MAP_SUB_TAB_PLAYER, MAP_SUB_TAB_CARTOGRAPHY]`.
   ⛔ **`PRESENTATION_SUB_TAB_IDS` is NOT touched** — that is the whole ruling (§2b).
3. `LABELS` gains `cartography: 'Cartography'`.
4. `resolveMapSubTabs` gains **one** presence arm on a new resolved-fact input
   (`cartographyAvailable`), pushed **after** `player`. ⭐ **CR-TC5B-3: that fact is the
   BLOCK's availability, not the flag** — it is `useTownCartographyBlock(...).available`,
   which is `status === 'ready'` and nothing else.

⚠ **PRESENCE, NEVER A DISABLED TAB** (the file's own law, `:20-28`). **`resolveMapSubTabs`
stays PURE** — it takes a resolved boolean, exactly as `sceneAvailable` and `savedMap`
already do. The vocabulary module never reads a manifest, a flag, or a store.

⛔ **Rewrite the stale `EXTENSION POINT` docblock (`:30-34`).** It currently says the
painter's id "joins `PRESENTATION_SUB_TAB_IDS`" — the design's wrong plan, and the exact
trap `8738f5ea` caught. Leaving it would re-plant the trap for the next reader.

### 6.4 The shell mount — exact edits to `MapTabShell.jsx`

1. One `const MapCartographySubTab = lazy(() => import('./subtabs/MapCartographySubTab.jsx'));`
   ⚠ **This literal spelling is required** — `mapTabShellLazy.test.js:166` matches it
   textually. No intermediate variable, no wrapper, no import options.
2. One panel branch beside the existing `MAP_SUB_TAB_PLAYER` ternary (`:195-208`). ⚠ The
   current shape is a two-arm ternary; a third arm needs a small restructure — keep it
   within the 15-line cap or STOP. ⭐ The branch passes **`block` and `planExtent`** — two
   props, no manifest (§6.2).
3. One `useTownCartographyBlock(...)` call, with `cartographyAvailable` = its `.available`,
   threaded into `resolveMapSubTabs` (`:129-132`) and its `useMemo` deps.

⚠ **`setMapSubTab(id)` at `:151` is left EXACTLY AS IS.** It already handles a
non-presentation id correctly and `presentationViewFor` already returns `null` for one
(§2b). **Touching that line is a STOP** — the seat ruling rests on it.

### 6.5 Bundle posture — ZERO, and why it is not a hope

TC-5a's C7 note warned the dist half *"becomes load-bearing at TC-5b"*. **Measured, the
bounded pair still cannot move.** It bounds four **filename-matched build artifacts** —
`townScene.worker-*`, `compileTownSceneManifest-*`, `three.module-*`,
`townSceneExport.worker-*` (`tests/build/townScene3dLazy.test.js:53-57`, `:671-679`). This
packet's importer is a **lazy React component**: it lands in a UI chunk and creates no edge
**from** `compileTownSceneManifest.js`. The C7 source-closure exclusion
(`tests/domain/townCartographyDeterminism.test.js:360-376`) holds by construction.

⭐ **CONFIRMED GREEN LIGHT:** the TC-5a determinism suite constrains what the paint leaves
**import** (`:378-393`, an allowlist) and forbids them from the compiler's closure — but
**nothing constrains who imports THEM.** TC-5b may import `buildCartographyDrawList` freely
without redding TC-5a's suite. This packet is C7's first non-vacuous run.

⚠⚠ **THE ONE ARM TC-5b-i HANDED FORWARD.** `townScene3dLazy.test.js:653` asserts
`expect(manifestCompilers).toHaveLength(1)` — exactly one chunk matching
`^compileTownSceneManifest-[A-Za-z0-9_-]+\.js$`. **This packet gives TC-5b-i's seam its
first importer, so this is the run where a second such chunk could appear.** TC-5b-i minimized
the risk by importing the compiler through the **same direct specifier the worker uses** and
by placing the seam behind exactly one `import()`. ⛔ If a second chunk appears, that is a
STOP — never add a `manualChunks` rule, never edit `townScene3dLazy.test.js`, never raise a
literal.

### 6.6 ⚠ THE CSS BUDGET IS NOT THIS PACKET'S CONSTRAINT — a correction to TC-5a

TC-5A §4 B7 and the `8738f5ea` commit body both flag *"FIVE BYTES of headroom"* as TC-5b's
binding risk. **Measured, it does not bind, and treating it as a blocker is a false
constraint.**

`tests/build/firstPaintNonJs.test.js:69-83` sums only the stylesheets **linked from
`dist/index.html`** — exactly one, assembled from the four static `.css` imports in
`src/main.jsx`. This repo styles components with **inline JS style objects**
(`MapTabShell.jsx:47`, `:90-98`; `MapPlayerSubTab.jsx` identical), and there is **no `.css`
import anywhere under `src/components/townMap/`** except the 3D scene's. A new inline-styled
`.jsx` emits **ZERO** render-blocking stylesheet bytes.

The 5 bytes are real and remain a standing hazard for any packet adding an **eager**
stylesheet. This is not that packet.

⛔ **Corollary STOP:** the new leaf must NOT `import './x.css'`. Inline styles only.

---

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Instruction |
|---|---|---|---:|---|
| `CREATE` | `src/components/townMap/subtabs/cartographyColours.js` | `resolveRoleFill` + built role map | `90` | §6.1. Exhaustive both ways over all **10** roles; values from `src/design/tokens.js` **directly** (CR-TC5B-2); unknown role throws. |
| `CREATE` | `src/components/townMap/subtabs/MapCartographySubTab.jsx` | default export + sentinel | `240` | §6.2. SVG in emitted order; ⭐ **props are `block` and `planExtent` — a RESOLVED NUMBER, never a `manifest`**; A-4 notice (copy per §12 O-2); narrated fallback; **mint and STAMP a unique sentinel**. |
| `MODIFY` | `src/lib/mapSubTabs.js` | §6.3's four edits | `15` | ⛔ `PRESENTATION_SUB_TAB_IDS` untouched; rewrite the stale docblock; the presence fact is the BLOCK's availability. |
| `MODIFY` | `src/components/townMap/MapTabShell.jsx` | lazy const, panel arm, presence fact | `15` | ⛔ Do not touch `setMapSubTab` at `:151`. Thread `block` + `planExtent`, never a manifest. |
| `REGISTER` | `src/design/boundBook.js` | `ARTWORK_SURFACE_MANIFEST` | `3` | One `artwork(...)` row for the new leaf — §7c item 5. |
| `CREATE` | `tests/ui/mapCartographySubTab.test.jsx` | C1–C6 | `n/a` | ⚠ **Name and site it exactly as given** — §7c item 3. Straight-line registration only — §7c item 1. |
| `TEST` | `tests/lib/mapSubTabs.test.js` | 8 exact `toEqual` arms + the seat negative | `n/a` | C7. Copy `mapTabShell.test.jsx:240-247`'s "records NOTHING" template. |
| `TEST` | `tests/ui/mapTabShell.test.jsx` | 5 exact `toEqual` label arms **+ 2 keyboard-nav arms** | `n/a` | ⚠ `:268-273` assert the **LAST** tab is `'Player View'` — appending `cartography` reds them. §7c item 2. |
| `TEST` | `tests/build/mapTabShellLazy.test.js` | `BODIES`, `FORBIDDEN_IN_SHELL_CLOSURE` | `n/a` | C8 — all five obligations, §7c item 4. |

Generated artifacts: `NONE`. Do not edit `scripts/.size-baseline.json`,
`scripts/.forked-color-baseline.json`, `scripts/.observed-shape-readers-baseline.json`,
`tests/build/townScene3dLazy.test.js`, or `eslint.config.js`.

⭐ **These nine paths are the packet's reserved change paths**, and the `PACKET_MANIFEST.json`
row authored at TC-5b-i's promotion carries exactly them, spelled identically. ⚠ Per §4c's
third note the spelling of the three `CREATE` rows becomes load-bearing at the LANDED flip.

### 7b. Reservations and collisions — CONFIRMED CLEAR

- **Packet-manifest reservations.** Only non-terminal packets reserve change paths
  (`scripts/implementation-packets.mjs:429-456`). At TC-5b-i's promotion the non-terminal
  reservers are **IA-2 [STALE]** — all `scripts/implementation-*`, `tests/scripts/*`,
  `package.json`, `docs/implementation/*` — plus **TC-5B-I** and this packet. **ZERO overlap**
  in all three directions; `validate:packets` ran green with all three rows present, which is
  the mechanical proof rather than a reading.
- ⭐ **Disjointness against TC-5b-i, pairwise.** TC-5b-i reserves
  `src/lib/townScene/townCartographyBlock.js`,
  `src/components/townMap/useTownCartographyBlock.js`,
  `tests/lib/townCartographyBlock.test.js`, `tests/hooks/useTownCartographyBlock.test.jsx`.
  **Zero intersection with the nine above.** The two halves meet only through a symbol
  (`useTownCartographyBlock`), never through a file.
  ⚠ **The one shared *test* target is this packet's:** `tests/build/mapTabShellLazy.test.js`.
  TC-5b-i **copies** its `sourceClosure()` rather than editing or importing it; extraction to
  `tests/helpers/sourceClosure.js` is deferred until both halves land (CR-TC5BI-4).
- **Working-tree dirt (another lane's)** — CONFIRMED disjoint at both measurements. At draft
  time, 16 modified / 0 untracked:
  `src/domain/{hookEscalation,pendingEditsPreview,simulationSpine}.js`,
  `src/domain/worldPulse/{disposition,npcAgency,npcLadderState}.js`,
  `src/generators/aiLayer.js`, `src/lib/{generationTelemetry,structuralFingerprint}.js`,
  `src/utils/{generateCampaignPDF,generateWorldBook}.js`, and five test files including
  **`tests/security/ingestCheckRate.pglite.test.js`**. At TC-5b-i's promotion, 7 modified /
  0 untracked: six `supabase/functions/_shared/*` edge-bundle artifacts plus
  `tests/domain/explanation.test.js`. **This packet touches none of them.**
- **Chair action owed: DISCHARGED.** This packet's manifest row was authored from §7's real
  paths at TC-5b-i's promotion — see §12 O-4.

### 7c. Landing discipline this manifest incurs — SIX obligations, all measured

1. ⚠⚠ **THE PARKED-SUITE TRAP, and it is worse than "titles don't count."** A `test(`/`it(`
   registered inside a `for` loop is `TEST_UNREGISTERED`, and **the WHOLE FILE parks** —
   losing every other title in it too (`sovereigntyLightingContract.walker.test.js:1266-1271`,
   `:1308-1314`). A `describe` whose body is not straight-line parks the same way; `.each()`
   parks via `TEST_TABLE_UNPROVEN`. **This bit TC-5a: `townCartographyPaint.test.js` scored
   0 live titles against 34 real tests on its first cut.** Register every test
   straight-line, and verify `credited` moved — not just `files`.
2. ⭐ **THE LIGHTING CENSUS.** Re-derive **all five figures in ONE run and re-record them
   whole** — never patch `files` alone. ⛔ **The base to fold onto is NOT the row below.**
   `2395 / 365 / 2030 / 19732 / 5568` at `:3681` is the figure as of `e1e9fd6a`, **before
   TC-5b-i's two new test files**; re-derive from the FILE at the READY flip. All five arms
   are `.toBe(...)` — **exact equality** — plus a `parked + credited === files` cross-check
   (`:3682-3705` at the draft-time line numbering).
   ⚠ **The sequence hazard is live:** while any arm is red the census **stops measuring**,
   so later arms may read anything. ⭐ Probe with a temporary `console.log` **inside the
   existing census test, before its first assertion**, so it mints no title and cannot move
   what it measures.
   ⛔ **A CONCURRENT LANE HOLDS UNCOMMITTED FILES.** MEASURED at draft time: of the 16, five
   were test files and **none changed an `it(`/`describe(` title line** (per-file
   `git diff | grep -cE '^[+-].*(\bit\(|\btest\(|\bdescribe\()'` = 0), with zero untracked.
   Re-measured at TC-5b-i's promotion: one dirty test file
   (`tests/domain/explanation.test.js`), **also zero title lines**, zero untracked.
   **A re-record was safe on both days' evidence — but the tree is LIVE. Re-verify at
   preflight; if a foreign title has appeared, STOP and report rather than freezing foreign
   WIP into a frozen census.**
   ⚠ The serialization law ruled at `73f5be96` binds here: a shared census is re-derived
   WHOLE in the change that moves any figure, a lane that cannot do that without freezing
   foreign WIP **SERIALIZES rather than landing a red walker as debt**, and **no lane ever
   quantifies a foreign lane's uncommitted delta.** Attribute your own delta in isolation.
3. ⚠ **THE MUTATION-COVERAGE TRAP IS A NAMING TRAP.** `tests/lint/mutationCoverageManifest.test.js:81`
   requires a manifest row for any test file under `tests/{lint,design,docs,data,copy,security,edgeFunctions}`
   **or** whose basename matches
   `/(census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin)/i`
   (`tests/lint/mutationCoverage.shared.mjs:27-39`). **`tests/ui/mapCartographySubTab.test.jsx`
   avoids it entirely.** ⛔ Do not rename it to `…Contract.test.js` and do not site it under
   `tests/design/`.
4. **THE LAZY-CHUNK PIN — five obligations, or the coverage is a hole**
   (`tests/build/mapTabShellLazy.test.js`): (a) the literal `lazy(() => import('./subtabs/X.jsx'))`
   spelling (`:166`); (b) the specifier absent from the shell's static list (`:173`);
   (c) a **unique** sentinel present in exactly one file under `src/` (`:189-205`,
   `toHaveLength(1)`); (d) a `BODIES` row (`:70-73`); (e) the leaf **and its heavy transitive
   deps** added to `FORBIDDEN_IN_SHELL_CLOSURE` (`:76-81`).
5. **THE ARTWORK MANIFEST.** `src/design/boundBook.js:120` already carries
   `artwork('town-map.player-subtab', …, 'MapPlayerSubTab', 'plate')`. An artwork-bearing
   surface without a row emits an `unregisteredArtwork` finding. **An SVG map render
   qualifies** — add the row. ⚠ `audit:bound-book` is a standalone npm script, **not** part
   of `npm run check`, so this will not red the gate; it is owed regardless.
6. **ANCHORED NEGATIVES.** `tests/lint/negativeAssertionAnchor.walker.test.js:728` —
   `ceilingFor` gives a **new file ZERO**. Every `not.toContain` / `not.toMatch` /
   `not.toHaveProperty` goes through `tests/helpers/anchoredNegatives.js` or a reviewed
   `// anchored:` line. ⚠ The inventory arm also reds when a count **falls** below its
   frozen row, so do not "helpfully" clean an unrelated file.

⚠ **TWO MORE THAT WILL LIKELY MOVE, and are not this packet's to repair:**
`tests/design/deepCraftKillList.test.js:290` asserts `borderRadius`/`boxShadow`/`rgba(`
line counts over all of `src/components` at **exact equality** (`.toBeLessThanOrEqual` AND
`.toBe`) — a styled SVG leaf will move it; re-record with the cause stated.
`tests/lint/observedShapeReaders.walker.test.js:499` pins an exact cohort **and its own
header warns it reds in files the commit never touched** when the scanned file set changes.
Attribute carefully — but per §4c item 2, its old excuse has expired.

---

## 8. Ordered coding sequence

0. Run §4 preflight and record every baseline. Stop on mismatch. ⛔ **`<TC-5b-i SHA>` must be
   a real landed SHA; if TC-5b-i has not landed, this packet is not dispatchable.**
1. Capture pre-wiring evidence: the dark-path goldens and the bounded pair (B3).
2. Add the smallest failing focused test — C3's role-coverage case — **before** the palette
   exists.
3. Implement `cartographyColours.js`; make C3 green.
4. Implement `MapCartographySubTab.jsx` (viewBox from the `planExtent` prop → wards →
   streets → buildings → A-4 arm).
5. Wire the seat: `mapSubTabs.js` (§6.3), then `MapTabShell.jsx` (§6.4), in that order.
6. Add the `BODIES` row, the `FORBIDDEN_IN_SHELL_CLOSURE` entries, the `boundBook.js` row,
   and the seat negative (C7).
7. Run §10 focused checks; then `npm run build && npm run verify:dist`; confirm the pair is
   **unchanged** and `manifestCompilers` is still exactly `1` (§6.5).
8. Re-derive and re-record the lighting census WHOLE (§7c item 2), or STOP per its
   condition.
9. Run the wave-end gate. Report exact deltas, counts, the pair against B3, the census row,
   and `deviations: NONE` or a STOP.

Do not start by changing a golden, baseline, budget, or persisted shape.

---

## 9. Acceptance matrix — the complete edge-case denominator

| ID | Case | Required observation | Test home |
|---|---|---|---|
| C1 | Main reachable behavior | Lit + block available: the strip offers `Cartography`; selecting it renders one `<svg>` with `viewBox="0 0 1000 1000"` **built from the `planExtent` prop**; the emitted element count equals the draw list's length identity; ward elements precede street elements precede building elements | `mapCartographySubTab.test.jsx` |
| C2 | Absent / disabled | Dark flag, or no block available: the tab is **ABSENT from the strip**, not present-and-disabled; Plan still renders; no lazy chunk is requested | `mapCartographySubTab.test.jsx`, `mapSubTabs.test.js` |
| C3 | Colour binding DERIVED and TOTAL | Role-map keys ≡ `CARTOGRAPHY_PAINT_ROLES` **exact-set-both-ways (all 10, incl. the unreachable `green`/`water` — §6.1)**; every emitted fill is token-derived. **Negative control:** `resolveRoleFill('not_a_role', 500)` THROWS rather than returning a default | `mapCartographySubTab.test.jsx` |
| C4 | No colour smuggled | Neither new file's source matches a raw-colour literal nor declares a local hex const. **Anchored:** the same scan DOES match a spliced control string | `mapCartographySubTab.test.jsx` |
| C5 | A-4 degraded state, and empty ≠ malformed | A block that makes `buildCartographyDrawList` THROW renders a visible notice and **no** `<svg>`, and the raw error text is **absent** from the DOM; a legitimately EMPTY block renders the narrated empty state and **does not** show the failure notice. Two arms, asserted separately | `mapCartographySubTab.test.jsx` |
| C6 | Determinism of the rendered surface | The same block renders byte-identical markup twice; a block whose layer arrays are reversed renders identically (the draw list sorts; the component must not) | `mapCartographySubTab.test.jsx` |
| C7 | ⭐ THE SEAT GUARD | `TOWN_MAP_VIEW_IDS` and `PRESENTATION_SUB_TAB_IDS` do **not** contain `'cartography'`; `isPresentationSubTab('cartography')` is `false`; `presentationViewFor('cartography')` is `null`; selecting the tab writes **no** `sf.lastMapView.*` entry. **Anchored:** selecting `panorama` DOES write one, proving the probe is live | `mapSubTabs.test.js`, `mapCartographySubTab.test.jsx` |
| C8 | Lazy boundary / no first-paint cost | The new leaf rides its own chunk (sentinel absent from the shell's chunk and the entry closure) and `MapTabShell.jsx`'s static import list does not name it — the SECOND assertion, because the parent is itself lazy | `mapTabShellLazy.test.js` |

Do not add a ninth case or a speculative cross-product.

### 9b. LIT-OUTPUT POSTURE — this packet MOVES a surface, and says so

> **TC-5b-ii is the first cartography packet that changes what a reader sees.** Unlike
> TC-5a's and TC-5b-i's strict no-motion posture, a legitimate behavior shift exists and must
> be **declared, not discovered**.
>
> **THE DECLARED SHIFT:** with the flag lit AND a block available, the Map strip gains one
> tab. **Dark, nothing moves at all** — `townCartographyEnabled` is virtual and absent from
> `DEFAULT_SIMULATION_RULES` (`simulationRules.js:666`), so every existing world stays dark
> by construction.
>
> ⛔ **The dark path must be byte-identical, and that is an assertion:**
> `tests/fixtures/town-cartography-dormancy-golden.json` byte-identical; lit and dark
> manifests byte-identical to base; the bounded pair unchanged; `manifestCompilers` still
> exactly `1` (§6.5).
> ⚠ Figures permitted to move, each re-recorded whole with the cause stated: the five
> lighting-census numbers (§7c item 2), the `deepCraftKillList` line counts, and any
> snapshot that legitimately gains the tab.
> ⚠ **The ONLY pre-existing red to attribute is the owner-approved `generatorGoldenMaster`
> golden.** ⛔ **`observedShapeReaders.walker` is NO LONGER a free attribution** — see §4c
> item 2. If it reds here, it is this packet's until proven otherwise against a
> committed-base run.

---

## 10. Verification commands

```sh
# Baselines B1/B2 — the test slot is acquired in the same chain.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lib/mapSubTabs.test.js tests/ui/mapTabShell.test.jsx \
  tests/build/mapTabShellLazy.test.js tests/hooks/useTownMapPresentation.test.jsx \
  tests/ui/mapPresentationControlledSeam.test.jsx

sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townCartographyPaint.test.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/property/townCartographyDormancyGolden.test.js

# Focused behavior.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/ui/mapCartographySubTab.test.jsx tests/lib/mapSubTabs.test.js \
  tests/ui/mapTabShell.test.jsx

# Lint law — the colour guards bite here.
npx eslint src/components/townMap/subtabs/cartographyColours.js \
  src/components/townMap/subtabs/MapCartographySubTab.jsx \
  src/lib/mapSubTabs.js src/components/townMap/MapTabShell.jsx

npm run typecheck:ratchet
npm run typecheck:domain:strict

# C8 + the pair — build FIRST; verify:dist reads dist/ and skips without it.
npm run build
npm run verify:dist

# Census re-derivation (§7c item 2), then the landing gate.
npm run check:tail
```

⚠ **Never read a gate through a pipe** — `npm run check:tail` or
`sh scripts/gate-tail.sh <command...>`; a piped read reports the PIPE's status and has
greenwashed red gates twice.
⚠ **Budget the wall-clock:** `observedShapeReaders.walker`'s `beforeAll` was re-sized to
**900 s** because it measures ~264 s contended. A timeout there skips all 27 tests and then
trips the test ratchet's skip sentinel — a cascade that looks like a defect and is not.

---

## 11. Recorded deviations from design prose (each vetoable)

1. **D-1 — ⭐ The design's mount is a PERSISTENCE change; this packet takes the other door.**
   §12 and `mapSubTabs.js:30-34` seat the painter in `PRESENTATION_SUB_TAB_IDS`, which
   **is** `TOWN_MAP_VIEW_IDS`. The non-presentation seat reaches the same product outcome
   and touches it not at all (§2b). Ruled at `8738f5ea`; restated because the wrong plan is
   still written in the code's own comment (§6.3 edit 4).
2. **D-2 — The id is `cartography`, not `Illustrated`.** `ILLUSTRATED_STYLE_ID` is a live
   pickable **paid-adjacent** lens over the legacy `TownMapModel` (`townMapStyles.js:74`).
   ⚠ CONFIRMED bonus: `tests/lib/mapSubTabs.test.js` uses `'illustrated'` as its
   **unknown-id** fixture in five places — naming the tab `illustrated` would have flipped
   five passing pins into reds. The chair's ruling is load-bearing in a second way nobody
   claimed.
3. **D-3 — ⚠ The palette does NOT live in `bespokeStyles`/`sceneExportPalette`; design §6 is
   refuted.** `src/domain/townMap/bespokeStyles.js:28` imports `resolveTownMapStyle` and
   `TOWN_MAP_LENS_IDS` — welded to the legacy `TownMapStyle` shape and the **paid lens
   surface**. Routing cartography colour through it would create a back-edge into the legacy
   townMap family AND touch an entitlement-bearing surface (owner-gated). The binding lives
   in the component layer, exactly as TC-5a's landed docblock (`:4-6`) already states, and
   CR-TC5B-2 rules it there.
4. **D-4 — Deep links do NOT go through the routes table.** §12 says they do; measured,
   `readMapSubTabParam` (`:164-174`) reads the search string directly, and the file's own
   comment (`:41-44`) records that widening the first-paint-eager routes table was
   deliberately rejected. The new id inherits the seam free — **a routes-table edit is a
   STOP.**
5. **D-5 — No `lynchRubric` gate.** `scoreLynch` is never called from cartography. Chair
   recorded it as synthesis-side slice `TC-2r`.
6. **D-6 — ⚠⚠ AMENDED: the viewBox extent is a RESOLVED PROP, not a manifest read.** The
   draft recorded that the extent comes from the manifest rather than the block, on the
   `townSceneLivingPresentation.js:52` precedent. **TC-5b-i's seam exposes no manifest**, so
   the component takes `planExtent` as a number prop (§6.2, §7). The underlying substrate
   fact is unchanged — the block still carries no extent — but the route is. Amended at
   TC-5b-i's promotion (its D-5, validated 2026-08-11).
7. **D-7 — ⭐ Both CSS figures in the record are wrong for this packet.** Design §7 claims a
   4.5KB margin; the real figure is 5 bytes. But the budget measures only
   `index.html`-linked stylesheets and this repo styles with inline JS objects — so an
   inline-styled lazy `.jsx` moves it by **zero** (§6.6). Recorded because inheriting either
   number would distort the packet.
8. **D-8 — Two role names are unreachable.** `green` and `water` are in
   `CARTOGRAPHY_PAINT_ROLES` but no ward kind maps to them. C3 binds over the vocabulary,
   not over observed ops, so the binding cannot ship half-populated.
9. **D-9 — ⛔ Design §9's TC-5 assumed a reachable manifest. It was not reachable** (§-1).
   That was a gap in the design's own dependency chain rather than a packet omission, and it
   is closed by building TC-5b-i first (CR-TC5B-1).
10. **D-10 — ⚠⚠ AMENDED: the split table overstated TC-5b-i.** It said the seam makes
    TC-5a's leaf reachable for the first time. Measured, **this packet** is that leaf's first
    production importer; the seam makes the **block** reachable. Corrected in §-1 at
    TC-5b-i's promotion (its D-6, validated 2026-08-11).

---

## 12. Open items for the chair

**None is owner-gated.** The one genuinely owner-gated question — the persisted vocabulary —
was measured OUT (§2b). O-0, O-1, O-3 and O-4 are CLOSED; **O-2 is OPEN by the chair's own
deferral and is ruled at this packet's promotion.**

- **O-0 — RATIFY THE SPLIT (§-1). ✅ CLOSED — CR-TC5B-1.**
  **RULED: the two-way split, PRODUCER FIRST** — `TC-5b-i` (the manifest seam, headless),
  then `TC-5b-ii` (this document). ⭐ **Order matters and is not a preference:** building the
  painter first against an injected block would repeat exactly the shape ES-7 was refused for
  — consumers built against a producer nobody chartered.
  **Evidence:** zero hits for `compileTownSceneManifest` in `src/components|hooks|store`;
  the sole React manifest holder is `SettlementScene3D.jsx`; no manifest is persisted or
  cached; the worker client exposes no manifest-only mode
  (`townSceneWorkerClient.js:260`, `:277-278`).
  **Rejected:** widening TC-5b's budget (the standard forbids renegotiation); a synchronous
  in-leaf compile (drags the compiler graph and the naming table into the leaf and moves a
  main-thread cost onto a reader's click).

- **O-1 — WHICH TOKEN ENTRY POINT THE PALETTE READS. ✅ CLOSED — CR-TC5B-2.**
  **RULED: the binding is sited at `src/components/townMap/subtabs/cartographyColours.js`
  and imports `src/design/tokens.js` DIRECTLY** (`color` / `semantic`), not the
  `src/components/theme.js` shim.
  **Evidence:** `src/design/**` has no `max-lines` ceiling and sits outside
  `no-forked-color-const`'s glob (`eslint.config.js:606`, which covers `src/components/**`
  only); `src/domain/**` → `src/design/**` imports are established (14 files, incl.
  `townMapDraw.js:46-47`); `scripts/.forked-color-baseline.json` is `[]`. ⚠ **CONFIRMED
  house idiom: no file under `src/components/townMap/` imports `design/tokens.js` — all go
  through the `src/components/theme.js` shim**, whose own header says new code should import
  `tokens.js` directly. The component home is what TC-5a's docblock already promises and —
  decisively — the only home where `no-forked-color-const` **enforces A-9 structurally**
  instead of by review; the direct token import follows the shim's own stated migration
  direction rather than deepening a back-compat dependency.
  **Rejected:** `src/design/cartographyPalette.js` (inverts the dependency by making
  `src/design/` import a domain vocabulary, and sits outside the colour lint's jurisdiction);
  a `src/domain/` home (contradicts TC-5a's docblock and puts colour in the layer whose
  contract is "NO COLOUR, EVER").

- **⏸ O-2 — THE A-4 NOTICE'S EXACT COPY. OPEN — DEFERRED TO THIS PACKET'S PROMOTION BY
  CR-TC5B-4.**
  **Evidence:** the shell's existing wait-state copy (`MapTabShell.jsx:96-97`) and
  `MapPlayerSubTab.jsx:129` set the register — narrated, in the surveyor's voice, never
  technical. The legibility law forbids leaking a raw `premise` string to a reader.
  **RECOMMENDATION carried forward: a two-line notice in that register — one line naming that
  the sheet could not be drawn, one pointing to Plan as the permanent fallback — with the raw
  error to `console` only.** ⛔ **The wording is the chair's, and the packet must not ship
  placeholder copy.** This is the one item that must close before the READY flip.

- **O-3 — DOES PRESENCE GATE ON THE FLAG, OR ON THE BLOCK? ✅ CLOSED — CR-TC5B-3.**
  **RULED: gate on the BLOCK's availability, not the flag.** "PRESENCE, NEVER A DISABLED TAB"
  (`:20-28`) means a tab whose content *cannot exist* is absent; a lit flag with no block is
  exactly that, and gating on the flag alone would offer a tab whose normal state is the A-4
  notice. ⭐ **This is what makes TC-5b-i's seam the presence oracle, and it is a second
  reason the producer lands first.** The fact threaded into `resolveMapSubTabs` is
  `useTownCartographyBlock(...).available`.
  **Evidence:** `townCartographyActive(rules)` (`cartographyContract.js:617-619`) answers
  "is the flag lit"; a block's availability answers "is there something to draw". They
  disagree whenever a lit compile fails. `resolveMapSubTabs` is pure over resolved booleans
  (`:122-132`), so either fact can be threaded. ⭐ Note `tests/ui/mapTabShell.test.jsx`'s
  `mountShell` passes no `worldState` (`:84-86`), so a gate defaulting **falsy** leaves every
  existing presence assertion green — a real implementation convenience.

- **O-4 — `PACKET_MANIFEST.json`'s TC-5A ROW WAS FICTION, AND THE VALIDATOR COULD NOT SEE IT.
  ✅ CLOSED — all three parts.**
  **Evidence, CONFIRMED at draft time:** the TC-5A entry declared three CREATE paths that
  **did not exist** — `cartographyDrawList.js`, `cartographyPaletteRoles.js`,
  `townCartographyDrawList.test.js`. What landed at `41b39220` is `cartographyPaint.js`,
  `cartographyPaintRoles.js`, `townCartographyPaint.test.js`. Its eight `acceptanceCases`
  strings also did not match TC-5A.md §9, and it declared a `DOC` row the packet never had.
  **Root cause:** `if (row.action !== 'CREATE' && !fileExists(...))` — a CREATE row was never
  checked for existence, before OR after landing, so a packet renamed during implementation
  kept fictional paths forever and `validate:packets` stayed green.
  **DISPOSITION: (a)** this packet's row is authored from §7's real paths, done at TC-5b-i's
  promotion (CR-TC5BI-5 covers the sibling); **(b) + (c) LANDED at `e1e9fd6a`** — the TC-5A
  row was corrected to its landed names, and the validator now existence-checks a `CREATE`
  row once its packet is `LANDED` (`scripts/implementation-packets.mjs:466-468`), which is
  exactly the structural cure this item proposed. ⚠ The live consequence is §4c's third note.

---

## 12d. Draft-lane judgments — ✅ FABLE-VALIDATED 2026-08-11

The `8738f5ea` seat and naming rulings are **Fable-issued**; building to them owes nothing.
The five judgments below were added by the Opus draft lane and each carried validation debt.
**The chair validated all five at TC-5b-i's promotion; no `⏳` marker lands.**

1. **✅ FABLE-VALIDATED 2026-08-11 (chair session `c42c8924`, at promotion) — TC-5b REFUSED as
   one packet** (§-1), on the measured unreachability of a compiled manifest, with a
   producer-first split proposed. Ratified as **CR-TC5B-1**.
2. **✅ FABLE-VALIDATED 2026-08-11 (chair session `c42c8924`, at promotion) — the seat is safe
   DESPITE persisting an id** (§2b). The `8738f5ea` ruling asserted the seat "touches no
   persisted vocabulary at all"; measured, it touches an unbounded shape-guarded key —
   materially different, and still safe. Recorded rather than glossed.
3. **✅ FABLE-VALIDATED 2026-08-11 (chair session `c42c8924`, at promotion) — two landed packet
   documents corrected** (§4c): stale census figures/line number, and an expired
   `observedShapeReaders` attribution.
4. **✅ FABLE-VALIDATED 2026-08-11 (chair session `c42c8924`, at promotion) — the CSS 5-byte
   constraint is retired for this packet** (§6.6 / D-7), against two landed documents that
   flag it as TC-5b's binding risk.
5. **✅ FABLE-VALIDATED 2026-08-11 (chair session `c42c8924`, at promotion) — design §6's
   palette home is refuted** (D-3), on the grounds that `bespokeStyles` is
   entitlement-bearing. Ratified into a home by **CR-TC5B-2**.

⚠ **Two amendments arrived from TC-5b-i and are APPLIED above rather than owed:** the
resolved-`planExtent` prop (§6.2, §7, D-6) and the split-table correction (§-1, D-10).

---

## 13. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md`, stop if:

- **⛔ The TC-5b-i manifest seam is not landed.** This packet has no producer without it
  (§-1) and must not grow one.
- **⛔ O-2's A-4 copy has not been ruled.** The packet must not ship placeholder wording.
- **⛔ The component would need a `manifest` prop**, or would read `manifest?.space?.planExtent`
  rather than the resolved `planExtent` number (§6.2, D-6).
- **⛔ Any edit would reach `TOWN_MAP_VIEW_IDS`, `PRESENTATION_SUB_TAB_IDS`,
  `normalizeTownMapView`, or `displayPrefsSlice.js`.** That is the owner-gated persistence
  surface this packet exists to avoid.
- **⛔ `MapTabShell.jsx:151`'s `setMapSubTab(id)` needs changing.** The seat ruling rests on
  that line already being correct.
- **⛔ Any edit would reach one of TC-5b-i's four reserved paths** (§7b), including the
  transport and the hook.
- Either new file needs a colour literal, a local hex const, a `.css` import, a
  `townMapStyles.js` / `bespokeStyles.js` / `townMapExportPalette.js` import, or anything
  entitlement-bearing.
- A `fallback={null}` or a bare "Loading…" would be introduced (§6.2).
- The component needs to re-sort, re-filter, or recompute the draw list. **A paint-time
  audience filter is a second truth and is forbidden by construction**
  (`cartographyPaint.js:30-36`).
- Either shared-file delta would exceed 15 effective lines, or any §3 cap would be exceeded.
- A golden, pin, dormancy fixture, or manifest byte moves outside §9b's declared set.
- The bounded pair moves at all, `manifestCompilers` stops being exactly `1`, or the compiler
  source-closure gains either paint leaf.
- Any solution needs a schema field, vocabulary member, version bump, feature flag, new
  persisted key, PRNG draw, clock read, or float.
- A concurrent lane holds uncommitted test titles at census-re-record time (§7c item 2) —
  report, do not re-record, do not census a live shared tree.
- Any packet premise here is refuted by live code. **The code wins; the packet stops.**
