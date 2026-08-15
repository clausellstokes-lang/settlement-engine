# INFRA / RN-A1 — one home, one writer: the output-neutral re-exporter

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `a8f09e14eba7cc9f7ab40addce1204cbbbf132da`
  (RN-A0's implementation commit)
- **Landed:** `d8236665b1e5e6a4c97a74401724823f94509c6e` — chain: promotion `24ac90fa` →
  content `d8236665`. Battery green first run (10 files / 115 passed + 10 skipped, exit 0);
  both typecheck ratchets at their exact floors; OSR, eslint and the anchor walker exit 0.
  ⭐ **`RNS-25` IS MEASURED AND ITS FORK IS NOT TAKEN**: the three first-paint budget guards
  skip without a build, so this lane BUILT `dist/` and ran them for real — entry-closure raw,
  gzip and Brotli all under budget, 28/28 exit 0 under `VERIFY_DIST=1`. The premise is
  promoted from UNVERIFIABLE-AT-BASE to measured, at the member that owns it.
  Effective lines: `canonicalRelationship.js` 174 → 184 (+10, within the ≤15 contract),
  `relationshipState.js` 360 → 352 (net **−8**).
- **Train:** `rn-1`, member **2 of 4**
- **Preamble:** `docs/implementation/preambles/INFRA-PREAMBLE.md` @ SHA-256
  `c691af9fe6ade05097857699829771062058b289e55e0445aba2eee9498e64fa`
- **Predecessor:** `RN-A0`, landed at `a8f09e14`. **Genuine dependency: none** — A1 is
  premise-disjoint and path-disjoint from A0. It is second only because §64.7's arm ladder
  is LAW.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§64.1** (J-RNC-2: the canonical table lives in
  `canonicalRelationship.js`; lazy→eager is the only lawful import direction; J-RNC-4: case
  and empty/nullish policies stay PER-PLANE, both load-bearing) · **§64.4** (the census
  question is RULED RE-POINT) · **§101** (the compile accepted) · **§102.3** (every new
  `tests/lint/` file owes its coverage row).
- **Compile of record:** `laneTC18-RN1-PLAN.md` §4.2, §5.2.
- **Code of record:** `/Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold`.

---

## §1 · BEHAVIOR — AND THE ONE THING THIS MEMBER MUST NOT GET WRONG

`canonicalRelationship.js` becomes the single **HOME** for relationship spelling knowledge.
`relationshipState.js` becomes a pure **re-exporter**: it re-exports the relationship-plane
alias table from the canonical home and rebuilds `normalizeRelationshipType` over it,
keeping its own Axis-2 and Axis-3 policy byte-for-byte in behaviour, and re-exporting both
existing names so **not one call site moves**.

⛔ **ONE HOME IS NOT ONE TABLE.** A1 relocates the relationship plane's 8-entry alias set
into `canonicalRelationship.js` **as its own named export, BESIDE — not merged into — the
11-entry regional table.** Merging the two tables' CONTENT is **arm B1** and is owner-gated.
If A1 merged them, `normalizeRelationshipType('trade_partners')` would move
`'trade_partners' → 'trade_partner'` and the member would stop being output-neutral.

**The single-writer walker enforces one FILE; the identity pin proves ZERO output motion.**

## §2 · THE EXACT CONTRACT

| File | Region | Change | Δ eff. lines |
|---|---|---|---:|
| `src/domain/relationships/canonicalRelationship.js` | `:11-25` | correct the false header — the "ONE alias table" claim becomes TRUE in this commit rather than merely edited | 0 (comment) |
| `src/domain/relationships/canonicalRelationship.js` | after `:44` | host the relationship-plane alias set as a second named frozen export | ≤ 15 |
| `src/domain/worldPulse/relationshipState.js` | `:113-128` | `RELATIONSHIP_TYPE_ALIASES` re-exported from the canonical home; `normalizeRelationshipType` rebuilt over it; `normalizeType` stays the alias | ≤ 15 |
| `tests/lint/implicitNeutralSingleSource.test.js` | new arm | the single-writer walker + the banked-shim frozen inventory | +N |
| `tests/domain/regionalNeighbourSeam.test.js` | new `it()` | the exact-equality identity pin over the 40-input corpus | +N |
| `scripts/mutation-coverage-manifest.json` | new `meta:` key | §102.3's coverage row for the walker's second invariant | — |

### 2.1 ⛔ `normalizeType === normalizeRelationshipType` MUST STAY REFERENTIALLY TRUE

CONFIRMED true at base. It is **load-bearing** at `relationshipState.js:406-408`, where
`ensureRelationshipState` calls `normalizeType(rawType)` twice in one expression alongside a
`legacyRelationshipType === 'client'` test. Re-exporting them as two separately constructed
functions would satisfy every value test and break this identity silently.

### 2.2 THREE POLICIES THAT DO NOT UNIFY (J-RNC-4, re-confirmed at this base)

Axis-2 case (`canonical` preserves the original on a miss, `state` always lowercases) and
Axis-3 empty/nullish (`''` vs `'neutral'`) are **per-plane and load-bearing** —
`region/graph.js:449`'s `if (liveType && …)` refresh guard and `region/graph.js:637`'s
falsy-type early return read them. Unifying either **moves generated output**, unlike the
table divergence, which is unreachable from generation.

⭐ The corpus makes the subtlety concrete and the pin locks it: `''` → state `'neutral'`
(falsy, so the `|| "neutral"` default fires) while `'  '` → state `''` (truthy, so it trims
to empty). Two inputs that look interchangeable resolve differently, on purpose.

### 2.3 THE IDENTITY PIN, EXACTLY

For every one of the **40** inputs in the corpus — including `''`, `'  '`, `null`,
`undefined`, `'Trade_Partners'`, `'HOSTILE'`, `'Hostile rival'` — assert
`normalizeRelationshipType(x)` and `canonicalRelationshipLabel(x)` return the
**byte-identical** values they return at the verified base.

⛔ **17 of the 40 must still DIVERGE between the two resolvers.** That divergence is the
pin's **negative control**: a cure that accidentally converged the two planes reds here
rather than at a golden. The expected table is generated from a `git archive` of the
pre-feature base, never from the working tree, so it cannot mirror the cure.

## §3 · THE IMPORT DIRECTION — MEASURED, NOT ARGUED

`relationshipState.js` is a **zero-import pure leaf** whose header records that it was
extracted to break the last ESM import cycle. A1 gives it exactly one import.

- **No cycle is possible:** `canonicalRelationship.js` is itself a **zero-import leaf**, so
  the new edge is strictly downward.
- **Zero coupling-registry rows, with the mechanism read rather than inherited:**
  `couplingInclusion.walker.test.js`'s `CENSUS_SCOPE_RE` is
  `/^src\/domain\/(?:worldPulse|spatial)\//`, so `src/domain/relationships/` **can never
  enter the unlayered census at all**; and `scanCrossLayerPairs` iterates LAYERED importers
  and skips any dependency with no layer, which `canonicalRelationship.js` has none.
  `relationshipState.js` is LAYERED INTERIOR, so it is filtered out of `LIVE_UNLAYERED` too.
  The 179-entry baseline names **0** entries under `src/domain/relationships/`.
- ⭐ **The direction is already exercised in the tree:**
  `applyWorldPulseRelationshipGraph.js:16` already imports from
  `../relationships/canonicalRelationship.js`. A1 adds no new architectural edge; it adds a
  second traveller on a road that exists.
- **The header's own claim survives:** `relationshipState.js` says it takes "no rng, no
  Date, no worldPulse imports". `canonicalRelationship.js` is under `relationships/`, not
  `worldPulse/`, and is pure. The claim is re-stated precisely rather than left ambiguous.

⚠ **`RNS-25` IS THE TRAIN'S ONE SIGNED FORK.** If the lazy→eager import breaches an exact
first-paint/size ceiling at execution, `relationshipState.js` keeps a **LOCAL frozen copy**
of the plane table instead of importing it, bound to `canonicalRelationship.js` by the same
exact-equality identity pin. Single source is then enforced BY TEST rather than by import,
the bundle delta is zero, and it lands in ONE commit. ⛔ This is **NOT** the refused
alternative 5.6(iv), which pinned the DIVERGENCE between two disagreeing tables; this pins
EQUALITY against the one table A1 has just made canonical.

## §4 · THE SINGLE-WRITER WALKER — FROZEN-INVENTORY FORM, AND WHY

§64.4's ruled re-point host is **`tests/lint/implicitNeutralSingleSource.test.js`**. Its
chokepoint is `src/domain/relationships/effectiveNeighbours.js` — **the same directory A1
makes the single home** — and its stated purpose is that a relationship-plane reading *"can
never be forked into a second, drifting implementation."* A1's law is that sentence one
level up: the relationship **spelling** reading can never be forked into a second, drifting
table. Same directory owner, same single-writer law, same WRITE-shape source-scan technique.

⭐ **THE ROSTER IS ASKED OF THE CORPUS, NEVER GUESSED.** A declaration-shaped scan for
spelling→label object-literal pairs over all of `src/` returns **exactly five** files at
this base: the home, `relationshipState.js` (whose table A1 moves), and **three** banked
shims — `mutateWorld.js`, `regionalGraph.js`, `canonRelationshipImpact.js`.

⚠ **THE COMPILE'S SHIM LIST IS CORRECTED HERE BY MEASUREMENT.** `laneTC18-RN1-PLAN.md` §4.2
names **four** shims, including `generosityGate.js`. `generosityGate.js` carries a
**one-branch inline fold** (`k === 'trade_partners' ? 'trade_partner' : k`), not a table, so
a declaration-shaped scan correctly does not see it. The inventory is **three**, and the
correction is recorded rather than absorbed. `generosityGate.js`'s fold is **arm B1's** row.

The walker takes **frozen-inventory (only-shrinks)** form, so the shims are enumerated as
banked debt rather than blocking the landing — which is what keeps A1 at two modified
production files. Its second arm is guard-the-guard: the HOME must itself match the
signature, so the scan can never pass by finding nothing anywhere.

### 4.1 §102.3 — the coverage row, priced

`implicitNeutralSingleSource.test.js` already carries an `invariants` entry
(`kind:'mutation'`, label `neutral-neighbour/second implicit minter`). A1 adds a **SECOND
independent invariant** to that file, and the manifest's own `_doc` rules that case exactly:
*"a SECOND independent invariant living inside a file whose single entry above is already
spent on a different plant… needs its own key"* in the `meta` section.

This member therefore adds one `meta:` key of **`kind:'rationale'`**. That is schema-legal
and needs no sweep plant: the meta-test bars only `uncovered` from `meta:` keys
(`mutationCoverageManifest.test.js:110`), accepts `rationale` with a written reason of ≥40
characters, and bidirectionally label-matches only `kind:'mutation'` entries. A build lane
may not run `scripts/mutation-sweep.sh` at all — its revert is `git checkout -- <file>`
against the live shared tree, which this program's protocol forbids outright — so the
rationale idiom is the only lawful discharge here, and it is the one the estate already uses
for this exact reason.

⚠ **The other two re-point hosts owe nothing**, measured: `postureNameCollision.walker.test.js`
carries `kind:'rationale'` over a whole-tree single-definition scan that A0's three names
widen rather than duplicate, and `vocabularyTotality.walker.test.js` carries the
`self-proving-meta` rationale, whose guard-the-guard property covers a new arm built the
same way. **rn-1 creates no new `tests/lint/` file, so §102.3's headline obligation is not
incurred at all.**

## §5 · The change manifest (5 rows)

| # | Action | Path |
|---:|---|---|
| 1 | `MODIFY` | `src/domain/relationships/canonicalRelationship.js` — corrected header + the plane table as a second named export |
| 2 | `MODIFY` | `src/domain/worldPulse/relationshipState.js` — the re-exporter |
| 3 | `TEST` | `tests/lint/implicitNeutralSingleSource.test.js` — the single-writer walker + banked-shim inventory |
| 4 | `TEST` | `tests/domain/regionalNeighbourSeam.test.js` — the 40-input identity pin |
| 5 | `MODIFY` | `scripts/mutation-coverage-manifest.json` — the §102.3 `meta:` rationale key |

⛔ **No `CREATE` row.** **2 existing logic-bearing production files — WITHIN the default
budget of three**; this member does not draw on §101.2's recorded wider budget.

### 5.1 Prices measured NOT INCURRED
§92.2 certification, §49/§50 flags, §85.4 registry mint (both production files scanned for
`decisionFork|registerChooser|seededPick|makeChooser|forkRegistry` — **0 hits each**), §95.2
census burn. Coupling registry: **0 rows** (§3).

## §6 · Declared terminals

| Figure | Expectation | Why |
|---|---|---|
| Same-seed goldens | **UNMOVED** | no table content changes; the identity pin proves all 40 resolutions byte-identical |
| The 17-of-40 divergence | **UNMOVED at 17** | the pin's negative control; convergence here is a STOP |
| `normalizeType === normalizeRelationshipType` | **referentially TRUE** | asserted directly (§2.1) |
| Lighting census | `titles` +N only | new `it()` blocks in already-CREDITED files; **no new test file** |
| Both typecheck ratchets | **UNMOVED at 173/173 and 1134/1134** | exact floors; any movement is a STOP |
| `tests/build/vendorPdfLazy.test.js` | **GREEN** | the first-paint budget is the fork trigger (§3) |
| `negativeAssertionAnchor` | **UNMOVED** | both edited test files are at ceiling 0 unanchored; this member writes no bare negative |

⚠ **ONE DOWNSTREAM ADDRESS ROTS, AND IT IS MEASURED, NOT REPAIRED HERE.**
`RELATIONSHIP_TURNING_POINT_CAP` sits at `relationshipState.js:136`, nine lines below the
block A1 rewrites. The CW volume's S12 VERIFY-AT-BUILD ring cites *"turningPoints 24 =
`relationshipState.js:136`"* (`laneTLF-round.md:526`). **A1 moves that address.** The value
and the symbol do not change; the hand-keyed address does. Docketed to the CW volume's
micro-act.

## §7 · ⛔ MANDATORY STOPS

1. **Any merge of the two tables' CONTENT** → STOP. That is arm B1 and it is owner-gated.
2. **`normalizeType === normalizeRelationshipType` stops holding** → STOP.
3. **Any of the 40 corpus resolutions moves**, or the divergence count leaves 17 → STOP.
4. **A unification of the Axis-2 case or Axis-3 empty/nullish policy** → STOP; both are
   per-plane and load-bearing on `region/graph.js`.
5. **Either typecheck ratchet moves off its floor**, or a new OSR finding → STOP.
6. **`vendorPdfLazy.test.js` reds** → this is `RNS-25`; take the signed local-copy fork in
   ONE commit, never a ceiling raise.
7. **A new file joins the spelling-table roster** → STOP. The inventory only shrinks.

## §8 · Acceptance cases

| id | case |
|---|---|
| A1 | the 40-input identity pin passes: every `normalizeRelationshipType` and `canonicalRelationshipLabel` result is byte-identical to the pre-feature base |
| A2 | exactly **17 of 40** inputs still diverge between the two resolvers |
| A3 | `normalizeType === normalizeRelationshipType` is referentially true |
| A4 | the single-writer walker passes: the spelling-table roster is exactly the home plus the three banked shims |
| A5 | the walker's guard-the-guard arm passes — the home itself matches the signature |
| A6 | `tests/domain/regionalNeighbourSeam.test.js`, `relationshipPatchGhostWrite`, `directionalRelationshipLabel`, `commercialReasons` and `regionRelationshipB06Fixes` pass unchanged |
| A7 | `tests/build/vendorPdfLazy.test.js` and `tests/lint/sizeBaseline.test.js` pass — the import is bundle-lawful |
| A8 | `tests/lint/couplingInclusion.walker.test.js` passes with no new registry row |

## §9 · Checks

```
npx vitest run tests/domain/regionalNeighbourSeam.test.js tests/domain/canonicalRelationship.test.js
npx vitest run tests/domain/regionRelationshipB06Fixes.test.js tests/domain/relationshipPatchGhostWrite.test.js
npx vitest run tests/domain/directionalRelationshipLabel.test.js tests/domain/commercialReasons.test.js
npx vitest run tests/lint/implicitNeutralSingleSource.test.js tests/lint/couplingInclusion.walker.test.js
npx vitest run tests/build/vendorPdfLazy.test.js tests/lint/sizeBaseline.test.js
npx vitest run tests/lint/mutationCoverageManifest.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
```
