# Town cartography / MF-T2A — the fabric single-declaration law (D3a's first act)

> **DRAFT compiled by lane TC-D3A (OPUS COMPILE seat, ODQ §291.5) for the FABLE chair.**
> Not dispatchable. Promotion to `READY`, the INDEX row, the `PACKET_MANIFEST.json` row and
> the landing are chair acts. This lane made no git write, no gate run and no repo edit.

- **Status:** `DRAFT`
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `9d851fae`
- **Last revalidated:** 2026-08-21 at `9d851fae` (compile-time measurement; re-execute at dispatch)
- **Depends on:** `NONE` — this member depends on nothing and protects everything after it
- **Collision group:** `d3a-port` — shares `tests/lint/sovereigntyLightingContract.walker.test.js`,
  `scripts/mutation-coverage-manifest.json` and `scripts/mutation-sweep.sh` with every later D3a
  member. ⛔ **Staged promotion, never simultaneous** (plan §9.3)
- **Commit authority:** edits only; the coordinator commits
- **Baseline posture:** measured at `9d851fae`, not inherited —
  `src/domain/townMap/fabric/**` has **0 duplicated export names of 94 distinct names across 18
  files**; test census `2484 / 364 / 2120 / 20598 / 5767`; `BASE_STATE.json` is stamped
  `b8946403` and is therefore **NOT citable at this base** (its own `consumptionLaw`)

> **Family preamble:** `town-cartography` has no signed family preamble at `9d851fae`.
> `draft-MF-PREAMBLE.md` is compiled and awaits a chair signature. ⛔ **This packet is complete on
> its own structured fields and does not depend on that signature**; when the preamble lands, this
> header gains the SHA-256 citation line and the sections it duplicates are cut. MF-T1X's measured
> local precedent — three governance files, no fourth — is preserved until then.

> **`censusAuthorization`:** this packet moves the test census. Its authorizing decision is
> **ODQ §310.4** ("THE PORT WAVE (D3a) COMPILE DISPATCHES"), under §299.4's binding-forward rule
> that *"a packet that moves any census/ratchet NAMES ITS AUTHORIZING DECISION in the packet
> body."*

---

## 1. Reconciled authority

1. **ODQ §310.3(7)** is the ordering ruling: *"⛔ two same-named `clipHalfPlane` exports with
   OPPOSITE conventions: the rename micro-item is ORDERED into the next map wave's first act, plus
   a source scan refusing same-name/different-contract exports (the D1 walker family's next arm)."*
2. **ODQ §310.4 / §304.4** make D3a that next map wave and charter it as the port wave.
3. **`PACKET_STANDARD.md`** — statuses, the scope budget, the `tests/lint/**` mutation-coverage
   obligation priced AT COMPILE, the census-burn law's victory-assertion shape, the STOP set.
4. **Live code decides.** Measured at `9d851fae`, not read from a document:

```
$ node laneTCD3A-dupexports.mjs 9d851fae src/domain/townMap/fabric
files scanned: 18 · distinct exported names: 94
names exported from MORE THAN ONE file: 0 · pairs: 0

$ git grep -n 'clipHalfPlane' 9d851fae -- src tests scripts
(empty)
```

**Resolved contradictions:**

- *"the rename micro-item is ORDERED into the next map wave's first act"* → **the rename is not
  executable in this tree.** Both `clipHalfPlane` exports live only in the sealed sandbox tip
  (`fabric/groundLaw.js:88`, `fabric/fabricGeometry.js:116`), which is **not a git repository**,
  is the program's only copy of the sealed W3 evidence, and retires as geometry code of record at
  the port's seal. Editing it breaks a seal to fix a defect this guard catches on arrival. **This
  packet lands the order's second half — the source scan — and the guard discharges the rename
  when the geometry ports.** Flagged as plan RAISED-2; the chair may take the literal reading, and
  nothing in this packet depends on the refusal.
- *"refusing same-name/**different-contract** exports"* → **a mechanical detector cannot compare
  contracts.** The walker's rule is the honest, detectable proxy and the packet says so in the
  file: **two DECLARATIONS of one name inside `src/domain/townMap/fabric/**` are two
  implementations, which is two contracts until someone proves otherwise.** Re-exports
  (`export { X } from './y.js'`) are NOT declarations and do not fire — which is exactly right,
  because a re-export is one implementation with two addresses.
- *A whole-`src/` scan* → **refused, measured.** `src/` carries **92** duplicated names across
  **199 (name,file) pairs** at `9d851fae`; such a walker cannot land without a 92-row frozen
  baseline, and a baseline is the shape this law must not have. `src/domain/townMap/**` carries
  **one** (`TOWN_MAP_OVERLAY_VERSION`, declared independently in `townLayoutV2.js:62` and
  `townMapModel.js:50`) and would need a one-row baseline. **`fabric/**` carries zero.**

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome

**Observable result:** `src/domain/townMap/fabric/**` gains a standing law that no exported name
may be declared in two files, asserted at **exactly zero**, so that the port about to pour 54
sandbox modules into that directory cannot land two same-named opposite-convention functions.

**Definition of done:** one `tests/lint/**` walker enumerates every `.js` under
`src/domain/townMap/fabric/`, collects top-level `export function|const|let|class` declarations,
and asserts the duplicate set is exactly empty with a message naming the offending name and both
files; a non-vacuity arm proves the enumeration is not empty; a re-export arm proves the rule does
not fire on `export … from`; the mutation sweep carries a planted duplicate that reds it; and the
mutation-coverage manifest carries the row that new file owes.

**In scope:**

1. **One primary behavior** — the single-declaration law over the fabric directory.
2. **One necessary integration path** — the mutation-sweep plant that proves the walker's removing
   power (`kind: 'mutation'`, the manifest's preferred form).
3. **One prevention guard** — the walker *is* the guard; its own non-vacuity arm guards it.

**Explicit non-goals:**

- ⛔ **No production line moves.** Zero `src/` bytes change in this packet.
- ⛔ **No rename**, in either tree. The sandbox is not edited; the app tree has nothing to rename.
- ⛔ **No widening past `src/domain/townMap/fabric/**`.** The 92-offender `src/` surface and the
  one `src/domain/townMap/**` offender are out-of-scope observations, recorded in the receipt
  without investigation.
- ⛔ **No baseline, no allow-list, no exemption door.** The population is zero; a door would be a
  place to bank the first offender.
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families | `0` | ≤1 |
| Named state writers | `0` | ≤1 |
| Feature flags | `0` | ≤1 |
| User-facing surfaces | `0` | ≤1 |
| Direct consumers | `0` | ≤2 |
| New logic-bearing production leaves | `0` | ≤2 |
| Existing logic-bearing production files modified | `0` | ≤3 |
| Additional registration-only files | `0` | ≤3 |
| Handwritten files total | `4` | ≤12 |
| New/changed effective production lines | **`0`** | ≤400 |
| Effective lines per new leaf | `n/a` | ≤250 |
| Delta in a shared/hot file | `0` — no manifest path is on the hot-file list | ≤15 |
| Acceptance cases | `5` | ≤8 |

Overrides approved before dispatch: `NONE`.

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- MF-T2A
```

Then, **before any edit**, re-execute the baseline this packet is priced on — it is a measured row
this manifest touches, so §P8's re-execution law binds and the capsule cannot cover it:

```sh
node laneTCD3A-dupexports.mjs <HEAD> src/domain/townMap/fabric   # MUST report 0 duplicated names
git grep -n 'clipHalfPlane' <HEAD> -- src tests scripts          # MUST report nothing
```

⛔ **A non-zero duplicate count at dispatch is a STOP, not a baseline.** It means a member landed
a duplicate between compile and dispatch, and the law must be landed by the member that broke it,
not banked here.

## 5. Verified tree contract

| Role | File | Symbol | Verified fact at `9d851fae` | Required use |
|---|---|---|---|---|
| Enumeration root | `src/domain/townMap/fabric/` | — | 18 `.js` files, 94 distinct exported names, 0 duplicated | the walker's scan root; read from disk, never a hard-coded list |
| Shape precedent | `tests/lint/townMapMassingSilhouette.walker.test.js` | `describe('massing silhouette totality …')` | 74 lines; one `describe`, four straight-line `test()` calls, literal titles, a `guard-the-guard` non-vacuity arm first | **copy this proof shape exactly** |
| Sweep precedent | `scripts/mutation-sweep.sh` | entry 28, `check_caught "massing/silhouette totality unmapped kind"` | a `perl -0pi -e` plant followed by `check_caught "<label>" <file> "npx vitest run <walker>"` | copy this plant shape |
| Manifest precedent | `scripts/mutation-coverage-manifest.json` | `invariants["tests/lint/townMapMassingSilhouette.walker.test.js"]` | `{"kind": "mutation", "label": "massing/silhouette totality unmapped kind"}` | copy this row shape |
| Enumeration law | `tests/lint/mutationCoverage.shared.mjs` | `ENFORCER_DIRS` | includes `tests/lint` — a new file there **is** an enumerated invariant the moment it lands | the reason the manifest row is owed AT COMPILE |
| Census | `tests/lint/sovereigntyLightingContract.walker.test.js` | the `CENSUS` object | `files: 2484, parked: 364, credited: 2120, titles: 20598, suiteTitles: 5767` | re-record with the cause stated; **never re-serialise the file** |
| Plant target | `src/domain/townMap/fabric/foundation.js` | `CURRENT_MAP_TRADITION_ID` | declared **exactly once** in the whole fabric directory, at `:18` | the sweep plants a second declaration of this name in `dcel.js` |

**Forbidden alternatives:**

- no allow-list, exemption map, baseline file, or `.skip`;
- no widening of the scan root beyond `src/domain/townMap/fabric/`;
- no edit to any `src/**` file;
- no edit to the sealed sandbox tip;
- no files outside the manifest.

## 6. Exact contracts

### The rule

A **declaration** is a top-level `export` of `function` (incl. `async`/generator), `const`, `let`
or `class` binding a single identifier, in a `.js` file directly under
`src/domain/townMap/fabric/`. **Two declarations of one identifier in two files is a violation.**

Not declarations, and therefore never violations: `export { X } from './y.js'`, `export * from`,
`export default`, and any binding declared inside a function or block.

### Inputs and outputs

```js
// The walker is a test file, not a module. Its internal shape:
//   readdirSync('src/domain/townMap/fabric')  ->  files: string[]   (.js only, sorted)
//   declarationsOf(source: string)            ->  names: string[]
//   duplicates: Array<{ name: string, files: string[] }>   // files sorted, length >= 2
// Required assertion: expect(duplicates).toEqual([])
```

### Absence rules

- **absent** (directory empty or unreadable): a **STOP**, not a pass. The non-vacuity arm asserts
  `files.length >= 18` and `names.size >= 94`, so an emptied scan reds instead of passing on
  nothing.
- **empty** duplicate set: the required steady state.
- **`null`**: forbidden — the walker returns arrays, never `null`.

### Determinism

- Stable enumeration: `readdirSync(...).filter(f => f.endsWith('.js')).sort()`, then names sorted
  by codepoint. No `Intl`, no locale ordering.
- No hash, no fork key, no draw.

### Flag and dormancy

- Flag: `NONE`. ⛔ Per `PACKET_STANDARD`'s ungated-persistence law a guard is never flag-gated;
  this one has nothing to gate anyway.
- Golden posture: **unchanged.** No golden, no plate, no seed byte is touched.

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| n/a | the walker reads source text at test time | n/a | n/a | n/a | n/a | n/a | n/a — no runtime surface |

### Receipts and privacy

- Closed kinds: `NONE` — no receipt is emitted.
- DM-only fields: `NONE`. Player/public projection: unaffected; nothing runs at runtime.

### Alignment and edit story

- Alignment: `DECLARED EMPTY: a source-scan enforcement walker has no alignment surface.`
- Edit story: `ENGINE-ONLY: a lint walker is not DM-editable and proposes nothing.`

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `TEST` | `tests/lint/townMapFabricSingleDeclaration.walker.test.js` | `describe('fabric single-declaration law …')`, cases A1–A5 | `n/a` | Copy `townMapMassingSilhouette.walker.test.js`'s shape exactly: ONE `describe`, five straight-line `test()` calls, string-literal titles, non-vacuity arm first. Header docblock states the rule, the §310.3(7) authority, and the TO-COMPLY instruction |
| `MODIFY` | `scripts/mutation-sweep.sh` | new numbered entry after entry 28 | `+6` | Plant a second `export const CURRENT_MAP_TRADITION_ID` declaration into `src/domain/townMap/fabric/dcel.js` with `perl -0pi -e`, then `check_caught "town-map/fabric duplicate export declaration" src/domain/townMap/fabric/dcel.js "npx vitest run tests/lint/townMapFabricSingleDeclaration.walker.test.js"` |
| `MODIFY` | `scripts/mutation-coverage-manifest.json` | `invariants` — ONE surgical insert beside its siblings | `+1 row` | Add `"tests/lint/townMapFabricSingleDeclaration.walker.test.js": {"kind": "mutation", "label": "town-map/fabric duplicate export declaration"}`. ⛔ **NEVER re-serialise the file**; verify the diff is a pure insert (`1 insertion, 0 deletions`). ⛔ **NEVER an `uncovered` row** — that list only shrinks. `uncoveredBaseline` is untouched |
| `MODIFY` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the `CENSUS` object | `+10` | Append ONE re-record block naming its cause and citing **ODQ §310.4**, then move the tuple to the predicted figures in §9 |

Generated artifacts: `NONE`. No other file may be edited.

## 8. Ordered coding sequence

0. Dispatch and seal. Stop on any preflight mismatch, **including a non-zero duplicate count**.
1. **Capture the dormancy/baseline evidence:** run the two preflight commands of §4 and record
   both outputs verbatim in the receipt. Then run the anchor walker focusedly (§10) — a new test
   file has ceiling zero for un-anchored negative assertions in every tree.
2. Add the failing walker with cases A1–A5. It reds on A2 (the plant is not yet in the sweep) —
   **no**, it must red for the right reason: write A1 first against a deliberately planted local
   duplicate, watch it red, remove the plant, watch it green. Record both.
3. Implement nothing — there is no production leaf.
4. — (no writer)
5. — (no consumer)
6. Add the sweep plant and the mutation-coverage row.
7. Run focused verification (§10).
8. Run the wave-end gate and write the completion receipt.

**Bounded algorithm (the walker body):**

```text
1. files := readdirSync('src/domain/townMap/fabric').filter(endsWith '.js').sort()
2. for each file: source := readFileSync(utf8)
3.    for each top-level match of
         /^export\s+(?:async\s+)?(?:function\*?|const|let|class)\s+([A-Za-z_$][\w$]*)/gm
         record (name -> file)
4. duplicates := entries with >= 2 distinct files, sorted by name, files sorted
5. assert files.length >= 18 and distinct names >= 94        (non-vacuity)
6. assert duplicates deep-equals []                           (the law)
7. failure message names, per offender: the identifier, every declaring file, and the
   TO-COMPLY instruction — "give the two implementations distinct names; a re-export
   (`export { X } from`) is the lawful way to have one implementation at two addresses"
```

⚠ **Step 3's regex is line-anchored (`^export`) deliberately.** An indented `export` is not valid
at module top level, so anchoring is exact rather than approximate — and it means a `export`
inside a template literal or a comment cannot fire. The A4 case proves that.

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| **A1** | The law holds | the live `src/domain/townMap/fabric/` directory | `duplicates` deep-equals `[]` | the walker |
| **A2** | Non-vacuity | the same live directory | `files.length >= 18` **and** distinct names `>= 94` — an emptied or mis-rooted scan reds instead of passing on nothing | the walker |
| **A3** | Counterforce — it convicts | an in-test synthetic two-file source map declaring one name twice | `duplicates` names that identifier and **both** file paths | the walker |
| **A4** | Boundary — a re-export is not a declaration | in-test sources: `export { X } from './a.js'`, `export * from './b.js'`, `export default f`, and an `export` inside a template literal | none of the four contributes a declaration; `duplicates` stays `[]` | the walker |
| **A5** | The named historical regression | in-test sources reproducing the sealed tip's two `clipHalfPlane` signatures — `groundLaw` keeping `(p−q)·n ≥ 0` and `fabricGeometry` keeping `(p−o)·n ≤ 0` | `duplicates` convicts `clipHalfPlane` and the message names both files — **the §310.3(7) defect, caught by name before it can arrive** | the walker |

⚠ **A5 is the packet's point** and is written as a *fixture*, not as a scan of the sandbox: the
sandbox is not in this tree and must not be reachable from a test. The fixture reproduces the two
signatures so the guard's convicting power against the actual ordered defect is executed, not
argued.

⛔ **Anchor law:** A2, A4 and A5 all assert absences. Each negative assertion carries either a
`tests/helpers/anchoredNegatives.js` call **by name on the same line**, or a
`// anchored: <why this cannot go vacuous>` comment on the assertion line or the line immediately
above it. ⚠ For a multi-line comment only the **LAST** line counts.

**Predicted census motion — one credited file, five literal titles, one suite:**

```
2484 / 364 / 2120 / 20598 / 5767   →   2485 / 364 / 2121 / 20603 / 5768
                                       +1 file · +0 parked · +1 credited · +5 titles · +1 suite
```

⛔ **`parked` MUST stay at 364.** Every title is a string literal inside one `describe` with
straight-line `it`/`test` calls. **No `.each`, no `for…of` generating tests, no `runIf`, no
nesting** — a generated test is invisible to the census and parks the whole file, which keeps the
arithmetic closing while `credited` silently does not move. A3/A4/A5's synthetic sources are
built and asserted **inside** a single named test, which is the recorded SP-D idiom.

⚠ **This is a NAMED INTERIOR RED.** The census arm is an exact equality against a recorded
constant, so at this member's own implementation commit the census walker **reds by construction**
until the tuple is re-recorded. Predicted figures are above. A train plan carrying this member and
declaring zero interior reds has mis-declared.

## 10. Verification commands

```sh
# Anchor preflight — MANDATORY for a new test file, run BEFORE the member proof is declared green
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js ; echo TRUE_EXIT=$?

# Focused static
npx eslint tests/lint/townMapFabricSingleDeclaration.walker.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

# Focused tests — acquire the one test slot IN THE SAME COMMAND
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/townMapFabricSingleDeclaration.walker.test.js \
  tests/lint/mutationCoverageManifest.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js

# Dormancy: the fabric must stay out of the entry closure
sh scripts/gate-mutex.sh --run -- npx vitest run tests/build/townMapLazy.test.js

# Sealed receipt and exact-state handoff; neither is landing authority
npm run check:packet -- MF-T2A
npm run implementation:resume -- MF-T2A

# Wave-end — BARE, fresh shell, never piped, and OUTLAST it in your own turn
npm run check:tail ; echo TRUE_EXIT=$?
```

⛔⛔ **NEVER wrap `npm run check*` in `gate-mutex.sh --run`** — `test:ratchet` re-acquires and
self-deadlocks, and **exit 3 is the mutex giving up, not a red.**
⚠ **Trust no exit status you did not capture.** A backgrounded ratchet that outlasts its window
reports the wrapper's exit, not the gate's.
⚠ **The census is SEQUENCED**: when `files` reds, `parked`/`credited`/`titles`/`suiteTitles` never
execute. A green there is a green that never ran.

Expected: every command exits `0`. `test:ratchet` carries its inherited known failures and no new
one. Report actual counts; **do not copy the historical counts in this packet.**

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md`:

- the duplicate count at dispatch is not zero (§4);
- `clipHalfPlane` has appeared in `src/` between compile and dispatch — the port has begun out of
  order and this guard must precede it;
- the census moves by other than `+1 / +0 / +1 / +5 / +1`, **or `parked` leaves 364**. ⚠ A delta
  **smaller** than the titles added is not arithmetic to accept: a parked file swallows its titles
  and nothing reds. Attribute by reverting one test file at a time;
- `mutation-coverage-manifest.json`'s diff is not a pure insert, or `uncoveredBaseline` moved;
- the sweep plant does not red the walker — a guard that cannot be reddened cannot be proven;
- any `src/**` byte would change;
- any allow-list, baseline, exemption or `.skip` would be needed to land green;
- another D3a member is simultaneously non-terminal on `sovereigntyLightingContract.walker.test.js`,
  `mutation-coverage-manifest.json` or `mutation-sweep.sh` (§9.3 of the plan).

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into the
next wave.

## 12. Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas (expected: **0 production lines**):
- Preflight duplicate count and `clipHalfPlane` scan, verbatim:
- Acceptance cases A1–A5:
- Anchor-walker preflight exit:
- Focused commands, exits, and counts:
- Sweep plant: label, planted file, and the executed red proof:
- `mutation-coverage-manifest.json` diff statistics (must be `1 insertion, 0 deletions`):
- Census before → after, and `parked`:
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations:
- Wave-end gate stages actually executed (`npm run check` is a 17-step `&&` chain; a red step
  blacks out every later step — say which steps ran):
- Base-versus-wave failure identity diff:
- Dormancy result (`tests/build/townMapLazy.test.js`):
- Generated artifacts: `NONE`
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls: `NONE`
