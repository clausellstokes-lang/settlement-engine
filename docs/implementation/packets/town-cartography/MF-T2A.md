# Town cartography / MF-T2A — the fabric single-declaration law (D3a's first act)

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `f20b9faa828469fed6f3fccae19f7c08508a5213`
- **Last revalidated:** 2026-08-21 at `f20b9faa` by lane TE-T2A, every row re-executed at this tip
- **Depends on:** `NONE` — this member depends on nothing and protects everything after it
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `6670a0465bc2b82eb1b23bbad4b60b847bf3398b1e20f6f64ecfa5cfac68192b` (re-stamped at ODQ §315 with the preamble's status-line fix; original citation `7a39a28e…4de8`. Its §P2 hazard dispositions,
  §P3 anchor preflight, §P3b mutation-coverage obligation, §P4 registration template, §P5 census
  law, §P6 mutant hygiene and §P7 STOP set bind this packet and are not restated here.
- **Collision group:** `d3a-port` — shares
  `tests/lint/sovereigntyLightingContract.walker.test.js`, `scripts/mutation-coverage-manifest.json`
  and `scripts/mutation-sweep.sh` with every later D3a member. Staged promotion, never simultaneous
  (`CR-HB2B-SPLITP`; plan §9.3, preamble §P7.11)
- **Commit authority:** the executing lane commits on its own detached ref; the chair moves the branch
- **Baseline posture:** measured at `f20b9faa`, inherited from nothing — `src/domain/townMap/fabric/**`
  carries **0 duplicated export names of 94 distinct names across 18 files**; test census
  `2484 / 364 / 2120 / 20606 / 5767`; `BASE_STATE.json` is stamped `b8946403` and is **NOT citable
  at this base** by its own `consumptionLaw` (preamble §P8)

> **`censusAuthorization`:** this packet moves the test census by one credited file, five titles and
> one suite title. Its authorizing decision is **ODQ §312 / §314** (the D3a port dispatch that
> commissions this member), under the wave charter at **§310.4** and §299.4's binding-forward rule
> that *"a packet that moves any census/ratchet NAMES ITS AUTHORIZING DECISION in the packet body."*
> The family's stamp is **GRANTED** at ODQ §312.2b, so `town-cartography` sits in the eight-member
> engine-train column (preamble, THE STAMP LINE).

---

## 1. Reconciled authority

1. **ODQ §310.3(7)** is the ordering ruling: *"two same-named `clipHalfPlane` exports with
   OPPOSITE conventions: the rename micro-item is ORDERED into the next map wave's first act, plus
   a source scan refusing same-name/different-contract exports (the D1 walker family's next arm)."*
2. **ODQ §310.4 / §304.4** make D3a that next map wave and charter it as the port wave; **§312 /
   §314** dispatch this member as its first act and authorize its census move.
3. **`PACKET_STANDARD.md`** — statuses, the scope budget, the `tests/lint/**` mutation-coverage
   obligation priced AT COMPILE, the census-burn law's victory-assertion shape, the STOP set.
4. **`MF-PREAMBLE.md`** at the SHA-256 above — the family law. §P4 already names this walker as one
   of the registers a fabric member fires, so the file path below is the family's own.
5. **Live code decides.** Re-measured at `f20b9faa` by the executing lane, not read from a document:

```
$ node laneTET2A-dupexports.mjs f20b9faa src/domain/townMap/fabric
files scanned: 18 · distinct exported names: 94
names exported from MORE THAN ONE file: 0 · total offending (name,file) pairs: 0

$ git grep -n 'clipHalfPlane' f20b9faa -- src tests scripts
(empty, exit 1)
```

**Resolved contradictions:**

- *"the rename micro-item is ORDERED into the next map wave's first act"* → **the rename is not
  executable in this tree.** Both `clipHalfPlane` exports live only in the sealed sandbox tip
  (`fabric/groundLaw.js`, `fabric/fabricGeometry.js`), which is not a git repository, is the
  program's only copy of the sealed W3 evidence, and retires as geometry code of record at the
  port's seal (preamble §P1 R-MF-4). Editing it breaks a seal to fix a defect this guard catches on
  arrival. **This packet lands the order's second half — the source scan — and the guard discharges
  the rename when the geometry ports.** Plan RAISED-2; nothing here depends on the refusal.
- *"refusing same-name/**different-contract** exports"* → **a text scan cannot compare contracts.**
  The walker's rule is the honest, detectable proxy and the file says so: **two DECLARATIONS of one
  name inside `src/domain/townMap/fabric/**` are two implementations, which is two contracts until
  someone proves otherwise.** Re-exports (`export { X } from './y.js'`) are NOT declarations and do
  not fire — which is exactly right, because a re-export is one implementation at two addresses.
- *A whole-`src/` scan* → **refused, measured.** Such a walker cannot land without a large frozen
  baseline, and a baseline is the shape this law must not have. `src/domain/townMap/**` would need a
  one-row baseline for a pre-existing overlay-version fork. **`fabric/**` needs none**, which is why
  it is the scope.

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome

**Observable result:** `src/domain/townMap/fabric/**` gains a standing law that no exported name may
be declared in two files, asserted at **exactly zero**, so that the port about to pour 54 sandbox
modules into that directory cannot land two same-named opposite-convention functions.

**Definition of done:** one `tests/lint/**` walker enumerates every `.js` directly under
`src/domain/townMap/fabric/`, collects top-level `export function|const|let|class` declarations, and
asserts the duplicate set is exactly empty with a message naming the offending identifier and every
declaring file; a `guard-the-guard` non-vacuity arm proves the enumeration is not empty; a boundary
arm proves the rule does not fire on `export … from`; the mutation sweep carries a planted duplicate
that reds it; and the mutation-coverage manifest carries the row that new file owes.

**In scope:**

1. **One primary behavior** — the single-declaration law over the fabric directory.
2. **One necessary integration path** — the mutation-sweep plant that proves the walker's removing
   power (`kind: 'mutation'`, the manifest's preferred form), together with the `MUTATED_FILES`
   dirty-guard row that plant obliges.
3. **One prevention guard** — the walker *is* the guard; its own non-vacuity arm guards it.

**Explicit non-goals, named affirmatively:**

- **No production line moves.** Zero `src/` bytes change in this packet.
- **No rename**, in either tree. The sandbox is not edited; the app tree has nothing to rename.
- **No widening past `src/domain/townMap/fabric/`.** The wider `src/` surface and the single
  `src/domain/townMap/**` offender are out-of-scope observations, recorded in the receipt without
  investigation.
- **No baseline, no allow-list, no exemption door.** The population is exactly zero; a door would be
  a place to bank the first offender.
- **No parser dependency.** The walker stays a text scan; §6 records exactly what that costs and in
  which direction it errs.
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
| Handwritten files total | `5` | ≤12 |
| New/changed effective production lines | **`0`** | ≤400 |
| Effective lines per new leaf | `n/a` | ≤250 |
| Delta in a shared/hot file | `0` — no manifest path is on the hot-file list | ≤15 |
| Acceptance cases | `5` | ≤8 |

Overrides approved before dispatch: `NONE`.

## 4. Preflight

Before any edit, re-execute the baseline this packet is priced on — these are measured rows this
manifest touches, so the preamble's §P8 re-execution law binds and the capsule cannot cover them:

```sh
node <dupexports measurer> <HEAD> src/domain/townMap/fabric   # MUST report 0 duplicated names
git grep -n 'clipHalfPlane' <HEAD> -- src tests scripts       # MUST report nothing
```

**A non-zero duplicate count at dispatch is a STOP, not a baseline.** It means a member landed a
duplicate between compile and dispatch, and the law must be landed by the member that broke it, not
banked here.

## 5. Verified tree contract

| Role | File | Symbol | Verified fact at `f20b9faa` | Required use |
|---|---|---|---|---|
| Enumeration root | `src/domain/townMap/fabric/` | — | 18 `.js` files, 94 distinct exported names, 0 duplicated | the walker's scan root; read from disk, never a hard-coded list |
| Shape precedent | `tests/lint/townMapMassingSilhouette.walker.test.js` | `describe('massing silhouette totality …')` | 74 lines; one `describe`, four straight-line `test()` calls, literal titles, a `guard-the-guard` non-vacuity arm first | **copy this proof shape exactly** |
| Sweep precedent | `scripts/mutation-sweep.sh` | entry 28, `check_caught "massing/silhouette totality unmapped kind"` | a `perl -0pi -e` plant followed by `check_caught "<label>" <file> "npx vitest run <walker>"` | copy this plant shape |
| Dirty guard | `scripts/mutation-sweep.sh` | `MUTATED_FILES` | the refusal list, asserted to name EXACTLY the files the sweep mutates, in both directions | the plant's host file joins this list in the same edit |
| Manifest precedent | `scripts/mutation-coverage-manifest.json` | `invariants["tests/lint/townMapMassingSilhouette.walker.test.js"]` | `{"kind": "mutation", "label": "massing/silhouette totality unmapped kind"}` | copy this row shape |
| Enumeration law | `tests/lint/mutationCoverage.shared.mjs` | `ENFORCER_DIRS` | includes `tests/lint` — a new file there **is** an enumerated invariant the moment it lands | the reason the manifest row is owed AT COMPILE |
| Census | `tests/lint/sovereigntyLightingContract.walker.test.js` | the `CENSUS` object | `files: 2484, parked: 364, credited: 2120, titles: 20606, suiteTitles: 5767` | re-record with the cause stated; **never re-serialise the file** |
| Plant name | `src/domain/townMap/fabric/foundation.js` | `CURRENT_MAP_TRADITION_ID` | declared **exactly once** in the whole fabric directory | the identifier the sweep plants a second declaration of |
| Plant host | `src/domain/townMap/fabric/dcelEmbedding.js` | — | neither declares nor imports `CURRENT_MAP_TRADITION_ID`, so it can host a **syntactically valid** second declaration | the sweep's plant target — see §11, J-TET2A-1 |

**Forbidden alternatives:**

- no allow-list, exemption map, baseline file, or `.skip`;
- no widening of the scan root beyond `src/domain/townMap/fabric/`;
- no edit to any `src/**` file;
- no edit to the sealed sandbox tip;
- no files outside the manifest.

## 6. Exact contracts

### The rule

A **declaration** is a top-level `export` of `function` (incl. `async`/generator), `const`, `let` or
`class` binding a single identifier, in a `.js` file directly under
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

### The scan's exact boundary, EXECUTED rather than asserted

The detector is a line-anchored text scan, `/^export\s+(?:async\s+)?(?:function\*?|const|let|class)\s+([A-Za-z_$][\w$]*)/gm`.
Lane TE-T2A ran every spelling before writing a pin. What it found:

| spelling | contributes a declaration? |
|---|---|
| `export { X } from './a.js'` | no |
| `export * from './b.js'` | no |
| `export default function f() {}` | no |
| an **indented** `export const` (inside a function, block, or template literal) | no |
| a **column-zero** `export const` inside a template literal | **YES** |
| a **column-zero** `export const` inside a block comment | **YES** |

**The last two rows refute the shape this packet was compiled with**, which claimed an `export`
inside a template literal could not fire. It can, when it sits at column zero. The finding is kept
rather than papered over, because the direction it errs in is the safe one and saying so is what
stops a later reader from re-deriving it as a defect:

**An extra text match can only ADD an identifier to the map, never remove one.** So this scan can
**over-convict** — red on a name that is not really declared twice — and can never **under-convict**.
A false red is a loud stop a human reads; a false green is a duplicate that lands. A guard whose only
failure mode is stopping too often is the correct trade for a law whose population is zero, and
A4 pins **both** directions so neither can be discovered by surprise later. Hardening the scan into a
parse is refused here as scope growth (§2) and is the successor's option, not this member's.

### Absence rules

- **absent** (directory empty or unreadable): a **STOP**, not a pass. The non-vacuity arm asserts
  `files.length >= 18` and distinct names `>= 94`, so an emptied scan reds instead of passing on
  nothing.
- **empty** duplicate set: the required steady state.
- **`null`**: forbidden — the walker returns arrays, never `null`.

### Determinism

- Stable enumeration: `readdirSync(...).filter(f => f.endsWith('.js')).sort()`, then names sorted by
  codepoint. No `Intl`, no locale ordering.
- No hash, no fork key, no draw.

### Flag and dormancy

- Flag: `NONE`. Per `PACKET_STANDARD`'s ungated-persistence law a guard is never flag-gated; this
  one has nothing to gate anyway.
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
| `CREATE` | `tests/lint/townMapFabricSingleDeclaration.walker.test.js` | `describe('fabric single-declaration law …')`, cases A1–A5 | `n/a` | Copy `townMapMassingSilhouette.walker.test.js`'s shape exactly: ONE `describe`, five straight-line `test()` calls, string-literal titles, non-vacuity arm first. Header docblock states the rule, the §310.3(7) authority, and the TO-COMPLY instruction |
| `MODIFY` | `scripts/mutation-sweep.sh` | a new numbered entry after entry 28, **and** one `MUTATED_FILES` row | `+8` | Plant a second `export const CURRENT_MAP_TRADITION_ID` declaration into `src/domain/townMap/fabric/dcelEmbedding.js` with `perl -0pi -e`, then `check_caught "town-map/fabric duplicate export declaration" src/domain/townMap/fabric/dcelEmbedding.js "npx vitest run tests/lint/townMapFabricSingleDeclaration.walker.test.js"`. **The host file joins `MUTATED_FILES` in the same edit** — the dirty-guard totality arm binds both lists |
| `MODIFY` | `scripts/mutation-coverage-manifest.json` | `invariants` — ONE surgical insert beside its siblings | `+1 row` | Add `"tests/lint/townMapFabricSingleDeclaration.walker.test.js": {"kind": "mutation", "label": "town-map/fabric duplicate export declaration"}`. **NEVER re-serialise the file**; verify the diff is a pure insert. **NEVER an `uncovered` row** — that list only shrinks. `uncoveredBaseline` is untouched |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the `CENSUS` object | `+10` | Append ONE re-record block naming its cause and citing **ODQ §312 / §314**, then move the tuple to the predicted figures in §9 |
| `DOC` | `docs/implementation/packets/town-cartography/MF-T2A.md` | this packet | `n/a` | The packet itself, its status transitions, and its §16 landing record |

Generated artifacts: `NONE`. No other file may be edited.

## 8. Ordered coding sequence

0. Prove branch, base, status, clean targets and required symbols. Stop on any preflight mismatch,
   **including a non-zero duplicate count**.
1. **Capture the dormancy/baseline evidence:** run the two preflight commands of §4 and record both
   outputs verbatim in the receipt. Run the anchor walker focusedly (§10) — a new test file has
   ceiling zero for un-anchored negative assertions in every tree.
2. Write the walker's A1 arm against a deliberately planted local duplicate, watch it red, remove the
   plant, watch it green. Record both. Then add A2–A5.
3. Implement nothing — there is no production leaf.
4. — (no writer)
5. — (no consumer)
6. Add the sweep plant, its `MUTATED_FILES` row, and the mutation-coverage row.
7. Run focused verification (§10).
8. Run the wave-end gate and write the completion receipt.

**Bounded algorithm (the walker body):**

```text
1. files := readdirSync('src/domain/townMap/fabric').filter(endsWith '.js').sort()
2. for each file: source := readFileSync(utf8)
3.    for each match of
         /^export\s+(?:async\s+)?(?:function\*?|const|let|class)\s+([A-Za-z_$][\w$]*)/gm
         record (name -> file)
4. duplicates := entries with >= 2 distinct files, sorted by name, files sorted
5. assert files.length >= 18 and distinct names >= 94        (non-vacuity)
6. assert duplicates deep-equals []                           (the law)
7. failure message names, per offender: the identifier, every declaring file, and the
   TO-COMPLY instruction — "give the two implementations distinct names; a re-export
   (`export { X } from`) is the lawful way to have one implementation at two addresses"
```

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| **A1** | The law holds | the live `src/domain/townMap/fabric/` directory | `duplicates` deep-equals `[]` | the walker |
| **A2** | Non-vacuity | the same live directory | `files.length >= 18` **and** distinct names `>= 94` — an emptied or mis-rooted scan reds instead of passing on nothing | the walker |
| **A3** | Counterforce — it convicts | an in-test synthetic two-file source map declaring one name twice | `duplicates` names that identifier and **both** file paths | the walker |
| **A4** | The scan's exact boundary, both directions | in-test sources: `export { X } from`, `export * from`, `export default`, an **indented** `export` inside a template literal — and, as the recorded over-convict arm, a **column-zero** `export` inside a template literal and inside a block comment | the first four contribute nothing; the last two DO contribute, proving the scan errs only toward a loud red and never toward a silent pass | the walker |
| **A5** | The named historical regression | in-test sources reproducing the sealed tip's two `clipHalfPlane` signatures — `groundLaw` keeping `(p−q)·n ≥ 0` and `fabricGeometry` keeping `(p−o)·n ≤ 0` | `duplicates` convicts `clipHalfPlane` and the message names both files — **the §310.3(7) defect, caught by name before it can arrive** | the walker |

**A5 is the packet's point** and is written as a *fixture*, not as a scan of the sandbox: the sandbox
is not in this tree and must not be reachable from a test. The fixture reproduces the two signatures
so the guard's convicting power against the actual ordered defect is executed, not argued.

**Anchor law:** every negative assertion carries either a `tests/helpers/anchoredNegatives.js` call
**by name on the same line**, or a `// anchored: <why this cannot go vacuous>` comment on the
assertion line or the line immediately above it. For a multi-line comment only the **LAST** line
counts.

**Predicted census motion — one credited file, five literal titles, one suite:**

```
2484 / 364 / 2120 / 20606 / 5767   →   2485 / 364 / 2121 / 20611 / 5768
                                       +1 file · +0 parked · +1 credited · +5 titles · +1 suite
```

**`parked` MUST stay at 364.** Every title is a string literal inside one `describe` with
straight-line `test` calls. **No `.each`, no `for…of` generating tests, no `runIf`, no nesting** — a
generated test is invisible to the census and parks the whole file, which keeps the arithmetic
closing while `credited` silently does not move. A3/A4/A5's synthetic sources are built and asserted
**inside** a single named test, which is the recorded SP-D idiom.

**This is a NAMED INTERIOR RED.** The census arm is an exact equality against a recorded constant, so
at this member's own implementation commit the census walker **reds by construction** until the tuple
is re-recorded. Predicted figures are above. A train plan carrying this member and declaring zero
interior reds has mis-declared.

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

# Wave-end — BARE, fresh shell, never piped, and OUTLAST it in your own turn
npm run check:tail ; echo TRUE_EXIT=$?
```

**NEVER wrap `npm run check*` in `gate-mutex.sh --run`** — `test:ratchet` re-acquires and
self-deadlocks, and **exit 3 is the mutex giving up, not a red.**
**Trust no exit status you did not capture.** A backgrounded ratchet that outlasts its window reports
the wrapper's exit, not the gate's.
**The census is SEQUENCED**: when `files` reds, `parked`/`credited`/`titles`/`suiteTitles` never
execute. A green there is a green that never ran.

Expected: every command exits `0`. `test:ratchet` carries its inherited known failures and no new
one. Report actual counts; **do not copy the historical counts in this packet.**

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and the preamble's §P7:

- the duplicate count at dispatch is not zero (§4);
- `clipHalfPlane` has appeared in `src/` between compile and dispatch — the port has begun out of
  order and this guard must precede it;
- the census moves by other than `+1 / +0 / +1 / +5 / +1`, **or `parked` leaves 364**. A delta
  **smaller** than the titles added is not arithmetic to accept: a parked file swallows its titles
  and nothing reds. Attribute by reverting one test file at a time;
- `mutation-coverage-manifest.json`'s diff is not a pure insert, or `uncoveredBaseline` moved;
- the sweep plant does not red the walker — a guard that cannot be reddened cannot be proven;
- the plant host would not parse with the plant applied — a plant that is a parse error proves the
  walker against the wrong defect class (see J-TET2A-1);
- any `src/**` byte would change;
- any allow-list, baseline, exemption or `.skip` would be needed to land green;
- another D3a member is simultaneously non-terminal on
  `sovereigntyLightingContract.walker.test.js`, `mutation-coverage-manifest.json` or
  `mutation-sweep.sh` (plan §9.3, preamble §P7.11).

Do not edit the packet, broaden the manifest, repair unrelated gate rows, or continue into the next
wave.

### Judgment calls held by the executing lane, both vetoable

- **J-TET2A-1 — the sweep's plant host moved from `dcel.js` to `dcelEmbedding.js`.** The compiled
  draft named `dcel.js`, which already imports `CURRENT_MAP_TRADITION_ID`; a planted second
  declaration there is a redeclaration, and `node --check` exits **1** on it. The walker would still
  have reddened — it reads text and never imports — but it would have been proven against a parse
  error rather than against the defect class under test: two syntactically valid same-named
  implementations. `dcelEmbedding.js` neither declares nor imports the name and accepts the plant
  with `node --check` exit **0**. Both exits were executed before the choice was made.
- **J-TET2A-2 — A4 pins the scan's over-convict direction instead of claiming immunity it does not
  have.** The compiled draft asserted that an `export` inside a template literal cannot fire. Run
  first, it fires at column zero, in a template literal and in a block comment alike. The pin now
  asserts what is true in both directions and §6 records why that direction is the safe one.

## 12. Completion receipt — EXECUTED

- **Base SHA:** `f20b9faa828469fed6f3fccae19f7c08508a5213` (`claude/composite-r4`, the MF-PREAMBLE
  landing). Built on a detached worktree; this lane moved no branch ref.
- **Final state:** four commits on top of the base — `5475110c` (DRAFT lands) → `ba6b0c68`
  (DRAFT → READY) → `37fb6916` (the implementation) → the flip to LANDED. Working tree clean.
- **Exact changed files and effective-line deltas:** four in the implementation commit —
  `tests/lint/townMapFabricSingleDeclaration.walker.test.js` (+144, new),
  `scripts/mutation-sweep.sh` (+13), `scripts/mutation-coverage-manifest.json` (+4, pure insert),
  `tests/lint/sovereigntyLightingContract.walker.test.js` (+13/−1, the re-record).
  **Production lines: 0.** `git diff --stat -- src/` over the whole member is EMPTY.
- **Preflight, verbatim, re-executed at this tip (not inherited from the compile):**
  `files scanned: 18 · distinct exported names: 94 · names exported from MORE THAN ONE file: 0 ·
  total offending (name,file) pairs: 0`; `git grep -n 'clipHalfPlane' -- src tests scripts` exits
  **1** (absent, required). Re-executed again at `5475110c` before promotion, identical.
- **Acceptance cases A1–A5:** all five pass. `5 passed (5)`, TRUE_EXIT=**0**.
- **Anchor-walker preflight:** `9 passed (9)`, TRUE_EXIT=**0**. The walker adds **zero**
  un-anchored negative-assertion sites, by construction: it asserts through `toEqual`, `toBe`,
  `toBeGreaterThanOrEqual` and positive `toContain`, and names none of the three scanned negative
  matchers anywhere — including in its prose, which the walker also counts.
- **Focused commands, exits, counts:** the five-file lint battery
  (this walker · `mutationCoverageManifest` · `sovereigntyLightingContract` ·
  `negativeAssertionAnchor` · `townMapMassingSilhouette`) → **5 files, 59 tests passed**,
  TRUE_EXIT=**0**. Scoped eslint on the new file: clean, TRUE_EXIT=**0**.
- **Sweep plant — label, host, and the EXECUTED red proof:** label
  `town-map/fabric duplicate export declaration`, host
  `src/domain/townMap/fabric/dcelEmbedding.js`, entry **28a**.
  Pre-plant digest `2612d04d225f64d65297f9e9259e9c32`; planted digest
  `7ee2c61a1d2d98c4a879d5b24cf78a84`; planted `node --check` exits **0**, so the plant PARSES.
  Planted walker run: **1 failed | 4 passed (5)**, TRUE_EXIT=**1**, and the single failing arm is
  `THE LAW` alone — an attributable conviction, not a blanket failure. The message named
  `CURRENT_MAP_TRADITION_ID  <-  dcelEmbedding.js, foundation.js` and carried the TO-COMPLY
  instruction. Restored by byte copy (never the `git checkout --` family), digest back to
  `2612d04d225f64d65297f9e9259e9c32`, `cmp` identical, `git diff` over the fabric directory empty,
  and the walker green again at **5 passed** — the sweep's own mutated-red / clean-green
  attribution control, executed by hand because a build lane may not run the sweep on this tree.
- **`mutation-coverage-manifest.json` diff statistics:** **4 insertions, 0 deletions** — a pure
  surgical insert beside its sibling row, never a re-serialisation. `uncoveredBaseline` untouched
  at its recorded value. `mutationCoverageManifest.test.js` → **8 passed**, TRUE_EXIT=**0**, which
  closes the label join AND the dirty-guard totality in both directions.
- **Census before → after, and `parked`:**
  `2484 / 364 / 2120 / 20606 / 5767` → `2485 / 364 / 2121 / 20611 / 5768`,
  exactly `+1 / +0 / +1 / +5 / +1`. **The prediction held on all five figures.** The interior red
  fired first exactly as named (`expected 2485 to be 2484` on `files`), and because the census is
  sequenced that red is itself the proof the later figures had not yet been read. After the whole
  tuple was re-recorded together the walker reached and cleared `suiteTitles`: **33 passed (33)**,
  TRUE_EXIT=**0**. `parked` held at 364. The delta EQUALS the five titles added, so no parked file
  swallowed one.
- **Both typecheck configurations:** `typecheck:ratchet` (`tsconfig.full.json`) — **173 errors,
  ceiling 173**, exactly at floor, TRUE_EXIT=**0**. `typecheck:domain:strict`
  (`tsconfig.domain-strict.json`) — **1134 errors, ceiling 1134**, exactly at floor,
  TRUE_EXIT=**0**. Neither moved: the member adds no production line and one test file.
- **Dormancy result:** **NOT ASSERTABLE BEFORE THE BUILD, and that is structural.**
  `tests/build/townMapLazy.test.js` is `describe.runIf(distExists)`, so on a fresh worktree with
  no `dist/` it reports `1 skipped (1) · 3 skipped (3)` — a skip, never a pass. It executes for
  real at the terminal, after gate step 16 builds `dist/` and step 17 re-runs it with
  `VERIFY_DIST=1`. Recorded rather than reported as green. Independently, this member cannot move
  the entry closure at all: it changes zero `src/` bytes.
- **Generated artifacts:** `NONE`.
- **Deviations:** `NONE`. Two compile-time claims were refuted by execution before any pin was
  written; both are recorded as vetoable judgment calls at §11 and neither widened the manifest.
- **Out-of-scope observations, without investigation:** a pre-existing foreign stash entry sits in
  the shared repository (`stash@{0}`, "On analytics-intelligence-layer: generation-tuning fixes").
  It is not this lane's, was not touched, and is noted only so it is not mistaken for wave debris.

## 13. Landing record

**Landed by lane TE-T2A (OPUS EXECUTOR seat, ODQ §291.5) on a detached worktree from
`f20b9faa`.** The lane moved no branch ref; the terminal tip is handed to the chair for the
compare-and-swap.

**The status sequence was executed, not reasoned about** — DRAFT, then READY, then LANDED, with
`validate:packets` run at every transition: `131 packets (0 READY)` at DRAFT, `131 packets
(1 READY)` at READY, and the terminal figure at LANDED. Zero other packets were non-terminal at
any point, so no shared change path was reserved twice and the staged-promotion law had nothing to
bite (plan §9.3, preamble §P7.11).

**What this member buys the port.** `clipHalfPlane` does not exist anywhere in this tree — the
defect ODQ §310.3(7) named lives only in the sealed sandbox, which is not in git and must not be
edited. So the ordered rename has no target here, and the guard is what discharges it: the habitat
is closed BEFORE the sweep. When the geometry ports at MF-T2B, one `clipHalfPlane` arrives; when
`groundLaw.js` ports in a later tranche, its opposite twin arrives, and this law reds on that day
unless the two land under distinct names. A5 executes exactly that future as a fixture today, so
the guard's convicting power against the real ordered defect is proven rather than promised.

**What a later MF member should read here before reaching for the same shapes.**

1. **The dormancy fence self-skips without `dist/`.** The family preamble §P2.2 tells every MF
   member to run `tests/build/townMapLazy.test.js` focusedly. On a fresh worktree that run
   reports SKIPPED, not passed. A member that adds `src/` bytes gets its real answer only at the
   terminal, and a receipt quoting a focused green for it would be quoting a green that never ran.
2. **A `tests/lint/**` plant owes TWO edits in `mutation-sweep.sh`, not one.** The numbered entry
   and a `MUTATED_FILES` row for its host. `mutationCoverageManifest.test.js` binds the two lists
   in both directions and it is a terminal-gate arm, so a missing guard row surfaces at the most
   expensive moment.
3. **Choose a plant host that can PARSE the plant.** See §11, J-TET2A-1.
