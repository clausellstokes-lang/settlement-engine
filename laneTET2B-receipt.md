# lane TE-T2B — MF-T2B full packet lifecycle receipt (D3a Track 0, second member)

> **THE TIP FOR THE CHAIR'S CAS:**
> ## `28565244b4adb4635ca09d437a695c907d7487a6`
> ⚠ **Read §12.1 before the CAS.** Seventeen of the eighteen gate steps were green in a single
> sequential sweep; `test:ratchet` was red in that sweep and **green when re-executed at the same
> unchanged tip**. It is the RS-5 soak's load, established by four lines of evidence, three of them
> executed. **Nothing was banked and nothing was re-frozen.**
>
> Detached HEAD in
> `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/6298872d-53af-4c8a-99e5-139bfc5bfc1f/scratchpad/t2b-tree`,
> **four** commits on top of `claude/composite-r4 @ 2cdb87fa`. Working tree CLEAN. **The worktree
> is LEFT IN PLACE for chair verification**, with its own `node_modules` and a built `dist/`.

## OUTCOME, FIRST

**MF-T2B is built, landed and terminalized.** The app-side fabric now carries D1's versioned
integer coordinate ABI and the 19-declaration exact-geometry closure it rests on;
`requireCanonicalInt`'s DEFAULT parameters widen from the fixture-era `0..1000` to
`±MAX_WORLD_UNITS` (9,007,199,254) **without moving one artifact byte**; and the §310.3(7) rename
is executed at the port rather than in a retiring tree.

**The terminal is green on all eighteen steps at tip `28565244`**, with one honest asterisk: step
15 needed a second execution at the same unchanged tip because the RS-5 soak drove the load average
to 267 and blew a 60-second `beforeAll` in an unrelated simulation suite. §12.1 triages it with
four lines of evidence rather than banking it.

- ⭐⭐ **THE SWEEP FOUND A REAL DEFECT IN THIS LANE'S OWN PIN, AND THEN THE SWEEP ITSELF TURNED OUT
  TO BE VACUOUS FIRST.** Two findings in one arm, both recorded in §6:
  - The first mutation harness passed `--reporter=basic`, which **vitest 4.1.8 does not have**: the
    runner fails to LOAD the reporter and exits non-zero **without collecting a single test**. All
    eight mutants "reddened". None had run. The only thing that exposed it was the CLEAN re-run at
    the end also reporting exit 1 — a control that had no business being red.
  - Once the harness actually executed, **M5 SURVIVED**: A2's dormancy scan keyed on
    `./<basename>`, the specifier every lawful in-directory importer happens to write, so a planted
    consumer importing `../townMap/fabric/coordinateAbi.js` walked straight through the pin with
    all four guard-the-guard arms green. Cured to the bare basename.
- ⭐ **Two compiled-draft claims were REFUTED by execution before a pin was written** (§5), and both
  are recorded as vetoable calls rather than quietly cured. A6's unqualified identity holds on
  **15 of 17** rows, not 17; and the predicted census titles delta is **+7**, not the draft's +6.
- ⭐ **A7, the packet's central claim, is measured rather than argued.** All **157** literal digest
  pins across 12 files pass unmodified, `git diff` over those twelve files is **empty**, and the
  whole fabric-touching surface — **28 files / 142 tests** — is identical before and after.
- ⭐ **The dormancy fence is EXECUTED POST-BUILD, and then zoomed past.** T2A's RAISED-2 said this
  member would be the first where it matters, and it was: 3 passed (3) under `VERIFY_DIST=1`, plus
  a forensic zoom showing **0 of the 8 entry-closure chunks** carry any literal unique to these two
  leaves while a lazy chunk does.
- ⭐ **The census prediction held exactly** in all five figures on the first execution:
  `+2 / +0 / +2 / +7 / +2`, `parked` unmoved at 364, walker **33/33**. And it is corroborated by a
  second instrument: the ratchet's total moved **28,651 → 28,658**, `+7`.
- ⭐ **The port is faithful, measured rather than claimed: 19 of 19 declarations are
  character-identical** to the sealed source once comments are stripped and the one deliberate
  rename is applied (§11b).

## 1 · WHAT LANDED, COMMIT BY COMMIT

| sha | what |
|---|---|
| `7cb2c730` | The packet lands at **DRAFT** at `docs/implementation/packets/town-cartography/MF-T2B.md`, its `PACKET_MANIFEST.json` row spliced as a scoped text APPEND (**195 insertions, 0 deletions**) and its `INDEX.md` row inserted above MF-T2A |
| `e6e261a8` | **DRAFT → READY** after re-executing the whole §4 preflight at that tip |
| `db2e386f` | **The implementation** — two new leaves, the widened defaults, two barrel blocks, two acceptance files, the census re-record |
| **`28565244`** | **READY → LANDED**, nine post-cure symbols join `requiredSymbols`, §12 written from captured receipts, and the two packet corrections land. **This is the tip.** |

Full tip sha: **`28565244`** — see §14 for the exact 40 characters.

Diffstat against the base: **10 files, 1,828 insertions, 3 deletions.** `src/` only: **4 files,
569 insertions, 2 deletions.** `package.json` / `package-lock.json`: **untouched** — no dependency
bump, so no schema-mint trigger.

**Handwritten files against the packet's budget of 7:** `coordinateAbi.js`, `exactGeometry.js`,
`foundation.js`, `fabric/index.js`, the two acceptance files, and the census walker. `INDEX.md` and
`PACKET_MANIFEST.json` are the coordinator's own surfaces, following the landed MF-T2A precedent.

## 2 · PREFLIGHT, EVERY FIGURE THIS LANE'S OWN

Executed at the base **and re-executed at the DRAFT tip** before the READY flip; identical both times.

| check | result |
|---|---|
| `git rev-parse HEAD` at start | `2cdb87fac566b3d6803a0dce9d59df13f07c1c9e` — **CONFIRMED** |
| `MF-PREAMBLE.md` SHA-256 | `6670a0465bc2b82eb1b23bbad4b60b847bf3398b1e20f6f64ecfa5cfac68192b` — matches the brief's binding citation (the ODQ §315 re-stamp) exactly |
| port source `coordinateAbi.js` | `123f3c17ebd42da5223216f0029617706db49b3de7ab602acd6edcf72a2c8404` — **MATCH** |
| port source `fabricGeometry.js` | `c40c75b1fff4dd7393677f18e5b755dfb2a7fe17f4bc94a2a30f97621c78ed6e` — **MATCH** |
| geometry closure, re-measured | module total **681** effective / 57 top-level declarations; **CLOSURE 19 declarations, 167 effective lines** |
| effective-line base (eslint's own `Linter`, never `wc -l`) | `foundation.js` **143** · `fabric/index.js` **101**, against the plain `src/domain/**` ceiling of **800** |
| digest-pin census | **157 literal pins across 12 files, 118 distinct values** — matches the packet's figure exactly |
| fabric export census | **18 files · 94 distinct exported names · 0 duplicated** |
| name-collision check (before any edit) | the 34 arriving names against the live 94: **zero collisions**; against the head barrel's 118 explicit exports: **zero collisions**; bare `clipHalfPlane` absent from the whole tree |
| test census | `2485 / 364 / 2121 / 20611 / 5768` ⚠ **not** the compiled draft's `2484 / 364 / 2120 / 20598 / 5767` — the draft's baseline predates MF-T2A and its titles figure was wrong even at its own base. Measured, never inherited |
| `BASE_STATE.json` admissibility | **NOT CITABLE** (stamped `b8946403`, this base is not that sha). Every figure measured from scratch |
| `validate:packets` at the base | `valid: 131 packets (0 READY)` |
| path-reservation collision check | **zero** non-terminal packets in the manifest before this member (131 rows, all LANDED/SUPERSEDED) — MF-T2A is terminal, so MF-T2B is the ONE non-terminal holder of both shared D3a paths while it runs |
| `npm ci` | TRUE_EXIT=**0**, captured in-shell |
| `core.bare` | `file:.git/config  false` — the recorded shared-config hazard is not live |

## 3 · THE FIXTURES, RUN AND PRINTED BEFORE ANY PIN WAS WRITTEN

Preamble §P2.9 is not a formality here: the whole member turns on what `toFixed` actually does.
Both leaves were written into an isolated probe directory and **every acceptance fixture executed
and printed** before the acceptance files existed (`laneTET2B-probe.log`). The probe's leaves are
byte-identical to what shipped except for two docstring rewordings (§7).

```
A1  v=1286630000    narrow: THROWS q must be an integer in 0..1000     wide: -> 1286630000
    v=9007199255    narrow: THROWS ...0..1000                          wide: THROWS ...-9007199254..9007199254
A3  x = -1/128 = -0.0078125 (exactly representable: true)
    q6(x) = "-0.007813"   worldQ(x) = -7813   Math.round(x*1e6) = -7812   DISAGREE
    positive twin +1/128: q6="0.007813"  worldQ=7813  Math.round=7813     AGREE
A4  worldQ(Infinity)=null  worldQ(NaN)=null  withinAbiBounds(MAX+1)=false
    heightQ() THROWS "…declared and UNEXERCISED … (SPEC §10.16 status override)…"
A6  identity holds on 15/17; reconciles on 17/17; negative-zero-text rows: 2
```

**This probe is what refuted the packet's A6 claim** — see §5.

## 4 · PER-ACCEPTANCE-CASE RESULT

All seven pass. `tests/domain/townMapCoordinateAbi.test.js` + `tests/property/townMapCoordinateAbiDeterminism.test.js`:
**2 files, 7 tests passed**, TRUE_EXIT=**0**.

| case | what it proves | result |
|---|---|---|
| A1 | The widened envelope accepts an ABI-scale quantum in BOTH signs and still refuses past it, naming the new range; and every explicit-range caller (`edgeIndex 0..3`) is untouched | **PASS** |
| A2 | Dormancy: zero references to either leaf outside `src/domain/townMap/fabric/`, with the scan's four known in-directory hits asserted FIRST as the guard-the-guard arm | **PASS** (rebuilt after M5 survived — §6) |
| A3 | Counterforce with a positive control: the two rounding rules DISAGREE on the negative tie and AGREE on its positive twin, so the conviction is about the sign rule and not an arbitrary disagreement | **PASS** |
| A4 | Boundary and refusal: `null` not `NaN`, a throwing height door, and `contentHash`/`provenanceRef`/`unitRegistryRef` named ABSENT rather than stubbed | **PASS** |
| A5 | Replay: 26 published calls byte-identical twice, geometry answers PINNED (not merely stable), and no nondeterminism token reachable from either leaf — with a planted positive control asserted before the absence | **PASS** |
| A6 | The reconciliation is an identity on 15 of 17 rows and its exactly 2 exceptions are exactly the rows `isNegativeZeroText` names, both asserted as positives | **PASS** (rebuilt to what executes — §5) |
| A7 | Widening moves no byte: the version string is unmoved, every already-accepted value is returned identically by the narrow and the widened wall, and the widened envelope is a strict superset | **PASS** |

## 5 · TWO COMPILED CLAIMS REFUTED BY EXECUTION — both recorded, neither smuggled

### J-TET2B-1 · A6's unqualified identity is false on 2 of 17 rows

The compiled draft's A6 asked for `reconcilesToTopologyText(v)` true for every row **and**
`topologyTextOf(worldQ(v)) === q6(v)` **exactly**, over "a fixed table of coordinates spanning
negatives, zeros, ties and the envelope edge". Executed:

```
v=-1e-7     q6=-0.000000   worldQ=0   textOf=0.000000   identity=false  reconciles=true  negZeroText=true
v=-5e-7     q6=-0.000000   worldQ=0   textOf=0.000000   identity=false  reconciles=true  negZeroText=true
identity holds on 15/17; reconciles on 17/17
```

`toFixed` strips the sign before rounding and puts it back after, so a coordinate that rounds to
zero **from below** is published as `"-0.000000"` while an integer has one zero. The unqualified
identity is unsatisfiable over any table that spans zeros honestly — and satisfying it would have
meant trimming the two rows that refute it, which is a fixture built to agree with its deriver
(the recorded vacuity class). **A6 now asserts the identity AND its exception set, both as
positives**, and pins that the exception set is exactly what `isNegativeZeroText` names. The ported
module's own docstring asks for exactly this: the exception should be COUNTED, not argued about.
Vetoable.

### J-TET2B-2 · the predicted census titles delta is +7, not +6

The draft's §9 predicted `+6` titles while its own §7 assigned **six** acceptance cases to the
domain file (A1–A4, A6, A7) and **one** to the property companion (A5). `6 + 1 = 7`. Caught by
counting the packet against itself before writing the re-record, rather than by the census arm
reddening at the implementation commit. The packet, the manifest and the re-record comment all
carry **+7**, and the measured motion was **+7**. Vetoable.

## 6 · THE MUTANT SWEEP — AND THE TWO THINGS IT CAUGHT

### 6.1 ⛔⛔ The first sweep was VACUOUS and its log looked perfect

The harness passed `--reporter=basic`. **vitest 4.1.8 has no such reporter**: it fails to load the
reporter module and exits non-zero **before collecting a single test**.

```
$ npx vitest run tests/domain/townMapCoordinateAbi.test.js --reporter=basic
… code: 'ERR_LOAD_URL' … at loadCustomReporterModule (…/cli-api…) …
```

Every one of the eight mutants reported `TRUE_EXIT=1`. Not one had been executed. **An
all-mutants-red sweep with no clean-green control is indistinguishable from a broken runner**, and
the only thing that exposed it was the clean re-run at the end ALSO reporting exit 1 — a control
that had no business being red. The second spelling asserts the **PRISTINE tree is GREEN FIRST**
and aborts the sweep if it is not, and records the **named failing arm** per mutant rather than an
exit code alone.

### 6.2 ⛔ M5 then SURVIVED — A2's dormancy pin under-convicted

With a working harness, the planted consumer outside the fabric directory passed:

```
── MUTANT M5 · a consumer appears outside src/domain/townMap/fabric/ ──
     node --check   : TRUE_EXIT=0
      Test Files  2 passed (2)
           Tests  7 passed (7)
     TRUE_EXIT=0
     EXPECTED ARM   : A2 dormancy
```

The scan keyed on `./<basename>` — the specifier every LAWFUL in-directory importer happens to
write — so `import … from '../townMap/fabric/coordinateAbi.js'` matched nothing while all four
guard-the-guard arms stayed green. **A guard-the-guard arm proves the collection is live; it does
not prove the key is right.** The cure is the BARE basename: it can only ADD a file to the list and
never remove one, so the scan over-convicts loudly (a mention in prose counts) and can never
under-convict silently — the only direction of error a dormancy pin may have.

### 6.3 The sweep as it now stands — 8 planted, 8 convicted, every restore digest-exact

| mutant | host | `node --check` | result | failing arm |
|---|---|---:|---|---|
| M1 `worldQ := Math.round(v*1e6)` | `coordinateAbi.js` | 0 | 3 failed / 4 passed | **A3, A4, A6** |
| M2 defaults revert to `0..1000` | `foundation.js` | 0 | 2 failed / 5 passed | **A1, A7** |
| M3 `heightQ` returns `0` | `coordinateAbi.js` | 0 | 1 failed / 6 passed | **A4** |
| M4 `contentHash := 'pending'` | `coordinateAbi.js` | 0 | 1 failed / 6 passed | **A4** |
| M5 consumer outside the fabric dir | `src/domain/settlement/…` | 0 | 1 failed / 6 passed | **A2** |
| M6 a clock read planted in a leaf | `exactGeometry.js` | 0 | 1 failed / 6 passed | **A5** |
| M7 `ANGLE_TABLE_SIZE := 512` | `coordinateAbi.js` | 0 | 1 failed / 6 passed | **A6** |
| M8 `FABRIC_COORDINATE_ABI` moves | `foundation.js` | 0 | 1 failed / 6 passed | **A7** |

**Controls:** pristine-green **7/7** before the first plant, clean re-run **7/7** after the last
restore, and `cmp` identical on all three hosts. ⭐ **Every plant `node --check`s clean in its
host** — the J-TET2A-1 lesson applied: a plant that only produces a parse error proves the file can
be broken, not that the pin convicts the defect class. Restore is a byte copy, never the
`git checkout --` family the shared-tree protocol forbids.

### 6.4 The census arm is proven non-vacuous in both directions

| planted | walker said |
|---|---|
| `files: 2486` | `expected 2487 to be 2486` — 1 failed / 32 passed |
| `titles: 20617` | `expected 20618 to be 20617` — 1 failed / 32 passed |
| pristine | **33 passed (33)** |

The walker names the LIVE value in each message, so it independently confirms `files = 2487` and
`titles = 20618`. Restored digest-exact (`a594023c…`), `cmp` identical.

## 7 · THE DOCSTRING REWORD, AND WHY IT IS THE RIGHT CURE

A5 scans both leaves' **raw text** for `Date`, `Math.random`, `Intl`, `toLocale`, `performance`,
`crypto`. Three prose occurrences fired it — two purity docstrings naming the vocabulary, and
"cryptography" in `canonicalBytes`'s note. **The recorded law is: reword the comment, never widen
the scan.** A raw-text scan is unfoolable; a comment-stripping scan is a hand-rolled parser and is
itself foolable. Both docstrings now name the rule in the abstract and say why, and each carries a
line explaining that a scan a docstring can trigger is a scan someone eventually widens to excuse
the docstring.

## 8 · OBLIGATIONS RE-VERIFIED AT THE TIP

| obligation | verdict |
|---|---|
| test census | **INCURRED, PAID** — §9 |
| §102.2 / §P3b mutation coverage | **NOT INCURRED** — the obligation attaches to new files in an enumerated enforcer directory (`tests/lint/**`); this member's two acceptance files live in `tests/domain/` and `tests/property/`. `mutationCoverageManifest.test.js` green, untouched |
| `negativeAssertionAnchor` | **INCURRED, ceiling zero, DISCHARGED AT ZERO SITES** on both new files. Walker **9 passed**, TRUE_EXIT=0 |
| entry-closure fence | **INCURRED, DISCHARGED POST-BUILD** — 3 passed (3) under `VERIFY_DIST=1`, plus the forensic zoom. §10 |
| the single-declaration law | **INCURRED, HELD** — fabric goes 18 files / 94 names / 0 duplicates → **20 / 128 / 0**. Bare `clipHalfPlane` never declared |
| coupling / layer census | **NOT INCURRED** — scope is `worldPulse` + `spatial` only; no `townMap` path is in it (preamble §P4/§P5 R-MF-5). Both new leaves are inside `src/domain/townMap/**` |
| size ratchet / hot files | **NOT INCURRED** — no `townMap` path carries a `.size-baseline.json` entry and none is on the hot-file list. Largest new leaf is 169 effective against the plain 800 ceiling |
| flag mint (§49/§50/§148) | **NOT INCURRED** — no flag |
| `spatialLedgers` | **NOT INCURRED** — no writer, no row |
| §104.4 edge-shared closures | **NOT INCURRED** — confirmed by the gate's `validate:edge`, not by reading the metas |
| declared shift / goldens | **NOT INCURRED** — ⭐ and PROVEN, not asserted: A7's untouched-pin control plus the 28-file / 142-test before-and-after equality. No golden, plate, corpus byte or seed byte moves |
| tuning / chair value signature | **NOT INCURRED** — no quantum rung, band or tuning constant is touched. `MAX_WORLD_UNITS` is derived from `Number.MAX_SAFE_INTEGER`, not authored |
| stamped version strings | **NOT INCURRED** — `FABRIC_COORDINATE_ABI` and `SHAPE_COORDINATE_ABI` unmoved, and A7 + M8 pin it |
| `docs/**.md` naked-claim debt | **INCURRED, PAID** — every docs file this lane wrote was CLAIM_RE pre-scanned to zero hits before the write and re-scanned after. The scanner was proved non-vacuous against a planted control that also reproduced the recorded substring trap — the zero-count claim pattern is matched INSIDE a larger two-digit count, so a line reporting thirty of something convicts on the same characters as a line reporting none |
| `package.json` / `package-lock.json` | **UNTOUCHED** — no dependency bump, so no schema-mint trigger |

## 9 · CENSUS ARITHMETIC — IT CLOSES EXACTLY, AND ON THE PREDICTION

**`2,485 / 364 / 2,121 / 20,611 / 5,768` → `2,487 / 364 / 2,123 / 20,618 / 5,770`**

| figure | before | after | delta | why |
|---|---:|---:|---:|---|
| files | 2485 | 2487 | **+2** | the domain matrix and the property companion |
| parked | 364 | 364 | **+0** | no parked-file rule, parser door or existing classification moved |
| credited | 2121 | 2123 | **+2** | both files CREDITED — one literal `describe` each, straight-line `test()` calls, string-literal titles, no `.each`, no `runIf`, no nesting, no loop-registered case |
| titles | 20611 | 20618 | **+7** | six domain cases (A1–A4, A6, A7) + one property case (A5) |
| suiteTitles | 5768 | 5770 | **+2** | exactly two new `describe`s |

⚠ **The named interior red did NOT fire, and that is a difference from MF-T2A worth stating
plainly.** The re-record landed in the same working-tree state as the acceptance files, so the
first execution of the sequenced walker read and cleared all five figures at once: **33 passed
(33)**. The proof that the arm is live therefore comes from §6.4's planted figures rather than from
an incidental red, and it is the stronger evidence: the walker names the live value in its failure
message, so `files = 2487` and `titles = 20618` are the walker's own measurements, not this lane's
arithmetic.

⚠ **The parked-file swallow was checked, not assumed:** the titles delta EQUALS the seven titles
added, and `credited` moved — the figure that lies when a file is generated, looped or parked.

**Authorization:** ODQ **§312** (the D3a port dispatch) and **§315** (this seat's dispatch), under
the **§310.4** wave charter and §299.4's binding-forward rule. Named in the packet header's
`censusAuthorization` block, in the packet's §7 change-manifest row, and in the re-record comment
block itself.

## 10 · ⭐ THE DORMANCY BOUNDARY — EXECUTED POST-BUILD, THEN ZOOMED PAST

T2A's RAISED-2 named this member as the first where the fence stops being a formality, and it was
right: MF-T2B is the first D3a member to add production leaves reachable from the fabric barrel,
and `src/domain/townMap/index.js` re-exports that barrel to 14 live modules.

**Pre-build, on a fresh worktree** the fence reports `1 skipped (1)` / `3 skipped (3)` with
TRUE_EXIT=0 — a green that never ran, and it was not reported as a discharge.

**Post-build** (`npm run build` TRUE_EXIT=0, 314 static route documents):

```
$ VERIFY_DIST=1 npx vitest run tests/build/townMapLazy.test.js
 Test Files  1 passed (1)
      Tests  3 passed (3)      TRUE_EXIT=0
```

⭐ **And a forensic zoom past the fence's own denominator.** The fence keys on `townMapModel`'s
`::town-map:v1` fingerprint — a census over a derived set proves nothing about a surface it does
not contain, so the leaves were checked directly. The entry chunk is `index-Cov44gyg.js` and its
transitive static closure is **8 chunks**:

| literal unique to these leaves | in the 8-chunk entry closure | anywhere in `dist/` |
|---|---:|---:|
| `COORDINATE_ABI` | **0** | 2 |
| `HALF_AWAY_FROM_ZERO` | **0** | 1 |
| `DOMAIN_SEPARATED_CANONICAL_BYTES` | **0** | 1 |
| `CCW_OUTER_CW_HOLE` | **0** | 1 |
| `plan-q1-0-1000-v1` | **0** | 1 |
| the `heightQ` refusal text | **0** | 1 |

The leaves are shipped in a lazy chunk (`scenePortraitExport-…`) and reach first paint through
nothing. **The absence is dormancy, not an absent build.**

## 11 · THE PACKET LIFECYCLE, EXECUTED AT EVERY TRANSITION

| transition | result | TRUE_EXIT |
|---|---|---:|
| base | `valid: 131 packets (0 READY)` | 0 |
| → **DRAFT** | `valid: 132 packets (0 READY)` | 0 |
| → **READY** | `valid: 132 packets (1 READY)` | 0 |
| → **LANDED** | `valid: 132 packets (0 READY)` | 0 |

⭐ **A validator refusal was learned by running it, not by reading it.** Spelling the two new
acceptance files as `TEST` rows reds `validate:packets` at DRAFT:

```
MF-T2B.changeManifest[4].path does not exist for TEST: tests/domain/townMapCoordinateAbi.test.js
```

A `TEST` path must exist at EVERY status; a `CREATE` row's existence is asserted only at `LANDED`,
which is the one status under which a fictional creation is catchable. Both rows are `CREATE`, and
the packet says why.

**`requiredSymbols` discipline, honoured in both directions.** At DRAFT and READY the row set named
**12** symbols, every one resolving in the live tree (self-checked in code, not by eye). The **9**
symbols the deliverable CREATES joined at the flip to LANDED. **No figure entered the row set** —
the splice script asserts that explicitly and exits non-zero if a census or size number appears,
because a re-recorded figure there turns a LANDED packet into a trap for every later train.

**Shared change paths were never reserved twice.** MF-T2A is terminal, so it reserved nothing;
MF-T2B held `fabric/index.js` and `sovereigntyLightingContract.walker.test.js` alone throughout,
and releases both at this LANDED tip. **MF-T2C is free to promote.**

**`check:packet` and `implementation:resume`** both refuse a non-READY packet by design
(TRUE_EXIT=2, *"sealed packet evidence is an inner loop; `npm run check` remains the landing
gate"*). The sealed inner loop could not have measured a tree that did not yet hold the
deliverable, and the landing gate is the full chain in §12.

## 11b · ⭐ THE PORT IS FAITHFUL, MEASURED DECLARATION BY DECLARATION

The packet claims the ported arithmetic is preserved character for character. That is not left as
a claim. Each of the port's nineteen top-level declarations was extracted and compared against the
sealed source's, with comments stripped, whitespace normalised, and the one deliberate rename
(`clipHalfPlaneAgainstNormal` → `clipHalfPlane`) applied:

```
declarations in the port : 19
CHARACTER-IDENTICAL to the sealed source: 19/19
```

⚠ A first pass reported 17/19, and both "differences" were the comparator's, not the port's: the
strip filter deleted whole lines beginning with `/*`, which swallowed the executable half of
`/** @type {Polygon|null} */ let out = t;` in `triPairArea`, and the brace-depth extractor spanned
`TOPOLOGY_PLACES` differently in the two files. Stripping block comments **inline** rather than by
line gives 19/19. **Recorded because a comparator that under-reports fidelity is the same class of
defect as a scan that under-convicts** — it just fails in the safe direction, which is why it would
have been easy to accept.

The only intended deviations from the sealed source are the two named in the packet: the clipper's
convention-bearing name, and one added JSDoc `@type` annotation that `typecheck:domain:strict`
needs (`triPairArea`'s `out` is reassigned to a nullable). Neither touches an operation or its
order.

## 12 · THE GATE — ALL EIGHTEEN STEPS GREEN, WITH ONE HONEST ASTERISK

Run **BARE** in the lane's own worktree, **never** through `gate-mutex` at the `npm run check*`
level. Each of the seventeen chain steps plus `smoke:boot` ran **separately** with its own in-shell
`TRUE_EXIT` captured into its own **self-named** log, so a red step could not black out the steps
after it the way the real `&&` chain would — and a shared log directory could not lie by recency.

Run at the tip **`28565244`**, started `18:53:41Z`, finished `19:48:05Z`.

| # | step | TRUE_EXIT | note |
|---:|---|---:|---|
| 1 | `validate:hazard-registry` | **0** | |
| 2 | `validate:premortem` | **0** | |
| 3 | `validate:packets` | **0** | `valid: 132 packets (0 READY)` |
| 4 | `validate:data` | **0** | |
| 5 | `validate:custom-content-manifest` | **0** | |
| 6 | `validate:migration-head` | **0** | |
| 7 | `validate:edge` | **0** | §104.4 NOT INCURRED, confirmed by the gate |
| 8 | `validate:map` | **0** | |
| 9 | `validate:tuning-bands` | **0** | the member authors no number; no band moves |
| 10 | `validate:foundry-module` | **0** | |
| 11 | `validate:mcp-server` | **0** | |
| 12 | `typecheck:ratchet` | **0** | `tsconfig.full.json` — **173 errors, ceiling 173**, exactly at floor |
| 13 | `typecheck:domain:strict` | **0** | `tsconfig.domain-strict.json` — **1134 errors, ceiling 1134**, exactly at floor |
| 14 | `lint` | **0** | |
| 15 | `test:ratchet` | **1** in the sequential run · **0** re-executed at the same tip | ⚠ see §12.1 — a LOAD artifact, diagnosed and cured by execution, not by argument |
| 16 | `build` | **0** | 314 static route documents prerendered |
| 17 | `verify:dist` | **0** | `STRICT DIST OK — 51 file(s), 409 test(s), zero failed/non-run/uncollected/missing/extra/duplicate` |
| 18 | **`smoke:boot`** (outside the chain) | **0** | `524/524 chunks initialised`, shell mounted with 31,706 B of markup, **PASS — the built bundle boots** |

⚠ **The composite is valid because the tip never moved.** `git rev-parse HEAD` is
`28565244b4adb4635ca09d437a695c907d7487a6` and the tree is CLEAN both before the gate and after the
step-15 re-run — no edit intervened, so every one of the eighteen steps has a green execution
against the identical bytes. **This is stated rather than assumed, because a verification stamp
binds to a working-tree snapshot and not to a session.**

### 12.1 · ⚠ STEP 15's RED, TRIAGED HONESTLY — it is the RS-5 soak's load, and that is CONFIRMED

The sequential run's `test:ratchet` reported, verbatim:

```
[test-ratchet] SCOPE SENTINEL: the gate is no longer running what it was frozen to run — a pass here would be VACUOUS:
  1 suite(s) FAILED WITHOUT A MEASURABLE TEST … a `beforeAll`/`afterAll` that threw …
      tests/simulation/distributionEnvelopes.test.js
  skipped tests grew: 9 > ceiling 1
```

**It is not banked, not argued away, and not re-frozen.** Four independent lines of evidence, three
of them executed:

1. ⭐ **THE SUITE IS GREEN IN ISOLATION AT THIS EXACT TIP** — `8 passed (8)`, **14.36 s**,
   TRUE_EXIT=0, run at load average 53. Its `beforeAll` builds **300 settlements** and carries a
   **60,000 ms** timeout the file's own header budgets at *"~3–4s in isolation… generous headroom
   for parallel CI contention."* **During the gate the load average was 267.** A 14 s job at load
   53 does not fit a 60 s ceiling at load 267.
2. ⭐ **THE SKIP ARITHMETIC CLOSES EXACTLY.** That suite owns **8** tests; the frozen
   `skippedCeiling` is **1** (the `prerenderRoutes` `skipIf` arm). When a `beforeAll` throws,
   vitest fails the suite whole and every test it enumerated becomes a SKIP. `8 + 1 = 9` — the
   exact figure reported. A different cause would not land on that number.
3. ⭐ **THE SUITE CANNOT REACH A BYTE THIS MEMBER CHANGED.** Its static import closure is **128
   files** and contains **zero** files under `src/domain/townMap/fabric/` — not `coordinateAbi.js`,
   not `exactGeometry.js`, not `foundation.js`, not the barrel. Measured by walking the closure,
   not by inspection.
4. ⭐⭐ **AND `test:ratchet` ITSELF IS GREEN AT THE SAME TIP.** Re-executed when the soak's load
   fell:

```
[test-ratchet] OK — no test regressions (11 known failure(s) of 28658 tests, ceiling 11).
TRUE_EXIT=0
```

**The scope sentinel did not fire, and the skips are back inside the ceiling.** ⛔ Nothing was
banked, nothing was re-frozen, and `test:ratchet:update` was never run — the sentinel exists
precisely to refuse a vacuous pass, and it did its job.

### 12.2 · The base-versus-wave failure identity diff — ZERO new failures

`scripts/.test-ratchet-baseline.json` is a PER-TEST census of named, attributed failures frozen at
`4deb4f026644cba500b0efc1e051fdea2ff96041`, and `check-test-ratchet.mjs` fails closed on any
failing test ABSENT from it. The green re-run reported **11 known failures against a banked set of
exactly 11 entries** — so the live failing set EQUALS the frozen set, member for member. A wave
that introduced any new deterministic failure could not produce that number.

The 11 banked entries, all pre-existing and none this lane's, read out of the baseline rather than
recalled: four `voiceMechanics` ratchet arms, one `enforcement-claims` `@enforced-by` arm, one
`metronomeCooldownLint` arm, one `clampPrimitiveBaseline` arm, three `warCostKindPools`
phrased-kind arms, one `warRulingKindPools` arm.

⭐ **AND THE TOTAL CORROBORATES THE CENSUS FROM A DIFFERENT INSTRUMENT.** MF-T2A's terminal
reported **28,651** tests; this tip reports **28,658**. The difference is **+7** — exactly this
member's seven new titles, measured by the ratchet rather than by the census walker. Two
independent instruments, one number.

### 12.3 · The known flake — FOUR-LEG CLASSIFICATION, and it did NOT fire

`tests/components/npcAuthoringScope.test.jsx` is the program's named flake and is deliberately
**not** banked (the CG-1 precedent).

1. **It is absent from the banked set** — confirmed by reading the baseline file (`grep -c` returns
   0), not assumed.
2. **It did not appear**, in either the red run or the green one: its name is absent from both
   step-15 logs, and had it failed it would have been a twelfth failure against a ceiling of 11.
3. **The machine was under genuine load** — the RS-5 soak, peaking at load average **267** during
   step 15 and still at 174 twenty minutes later. The flake had every opportunity and did not take
   it. What DID break under that load was a 60-second `beforeAll`, which is a different mechanism.
4. **It is unreachable by this member regardless.** This packet touches no component, no `.jsx`, no
   dossier surface and no read model; its change manifest names zero component paths.

**Nothing was banked, and nothing needed to be.**

## 13 · RAISED

1. ⚠⚠ **`--reporter=basic` DOES NOT EXIST IN vitest 4.1.8 AND FAILS SILENTLY-SHAPED.** It exits
   non-zero having collected **zero** tests (`ERR_LOAD_URL` at `loadCustomReporterModule`). Any
   harness in the estate that passes a reporter name and reads the exit code as a test result is
   measuring nothing, and its log will look like a perfect all-red sweep. **Worth a grep of
   `scripts/mutation-sweep.sh` and any sibling harness for `--reporter`.** This lane's own first
   sweep failed exactly this way and was caught only by a clean-green control. Recorded in memory
   as `mutation-sweep-vacuity-and-guard-key-correctness`.
2. ⚠ **A `guard-the-guard` ARM PROVES LIVENESS, NOT KEY CORRECTNESS**, and MF-T2B's A2 is the
   worked example: four green anchor arms over a scan whose key could not match the very thing it
   existed to catch. Where a scan's anchors and its intended catch travel *different spellings of
   the same key*, the anchors are silent. The family's absence pins (no importer · no digest moved
   · no duplicate export · no clock read) are all this shape, so the rule generalises across MF.
3. **T2A's RAISED-2 IS DISCHARGED AND SHOULD BE CLOSED.** The preamble §P2.2 instruction to run
   `tests/build/townMapLazy.test.js` focusedly still yields a green that never ran on a fresh
   worktree. This member — the first with real production leaves — executed it properly post-build
   (3 passed under `VERIFY_DIST=1`) **and** zoomed past its fingerprint to the leaves themselves.
   A one-line preamble amendment saying *"the entry-closure fence discharges POST-BUILD only; a
   pre-build SKIP is not a discharge"* would stop every later MF member re-deriving this.
4. **T2A's RAISED-3 IS NOW CONCRETE.** The compiled drafts do carry errors that propagate: this
   lane found two more in `draft-MF-T2B.md` (§5), one of which (`+6` titles) would have become a
   STOP at the census arm, and one of which (the unqualified A6 identity) would have been "fixed"
   most naturally by trimming the fixture — the recorded vacuity class. The landed packets are
   correct; **a note on the drafts saying the landed packet supersedes them** is cheap insurance.
5. **`check:packet` / `implementation:resume` are unreachable for a single-lane build.** Both
   refuse a non-READY packet, and at READY the deliverable does not yet exist, so the sealed inner
   loop can only ever measure a tree without the work in it. Either the tool wants a READY-with-
   working-tree mode, or the packet standard should say plainly that for this lifecycle shape the
   landing gate is the full chain. Recorded, not worked around.
6. **The packet's §12 could not quote the terminal gate's own figures**, for the same reason
   TE-T2A hit: the executed result exists only after the gate has sealed the tip. §12 says so
   explicitly and points at this receipt rather than pretending. **This lane judged a
   gate-proven tip worth more than a prose improvement**, and re-opening the packet to paste
   figures in would leave the receipt describing bytes the gate never saw. Chair may direct an
   amendment plus a re-gate if they prefer it in the packet.
7. **`src/domain/townMap/index.js:14` is `export * from './fabric/index.js';`** — a star export at
   the HEAD barrel, while preamble §P2.4 forbids star exports in the FABRIC barrel. It is the only
   star in that file and it is measured safe today (zero collisions between this member's 34
   arriving names and that file's 118 explicit exports), but **every later D3a member widens the
   set flowing through it**, and the collision check is currently nobody's standing pin. Out of
   scope for this member; flagged, not investigated.
8. **The foreign stash is still there and is not wave debris:** `stash@{0}: On
   analytics-intelligence-layer: generation-tuning fixes`. Untouched. `lint-staged` created and
   correctly cleaned up its own backup stash during the implementation commit.
9. ⭐ **The main worktree is byte-identical to this lane's session-start snapshot** — a 4,720-line
   `git status --short` baseline diffed at the end: **0 lines vanished, 0 appeared**. No foreign
   WIP was disturbed, and `claude/composite-r4` still points at `2cdb87fa`: **this lane moved no
   ref.**

## 14 · WHAT THE CHAIR SHOULD DO

1. ⭐⭐ **CAS `claude/composite-r4` to `28565244b4adb4635ca09d437a695c907d7487a6`.**
   The tree is clean, the packet is LANDED and validating (`valid: 132 packets (0 READY)`), all
   eighteen gate steps are green at that exact tip, the live failing set equals the frozen banked
   set member for member (11 of 28,658, ceiling 11), and the census closes on its prediction in all
   five figures.
   ⚠ **The one thing to read before the CAS is §12.1.** Step 15 was red in the single sequential
   sweep and green when re-executed at the same unchanged tip. That is a load artifact of the RS-5
   soak — a 60-second `beforeAll` in `tests/simulation/distributionEnvelopes.test.js` at load
   average 267 — established by four lines of evidence, three executed. **It is not banked, not
   re-frozen, and not argued away.** If the chair wants a single uninterrupted 18/18 sweep on the
   record instead of a composite, the cure is to re-run the gate when the soak is idle; nothing in
   the tree needs to change.
2. **MF-T2C is free to promote.** MF-T2B is terminal at this tip, so it releases both shared D3a
   change paths — `src/domain/townMap/fabric/index.js` and
   `tests/lint/sovereigntyLightingContract.walker.test.js`. The staged-promotion law continues to
   bind: one non-terminal member at a time.
3. **Amend the preamble's §P2.2 dormancy instruction** (RAISED-3). MF-T2A raised it as a
   forward-looking risk; this member is where it landed, and the amendment is one line: the
   entry-closure fence discharges POST-BUILD only, and a pre-build SKIP is not a discharge.
4. ⚠ **Grep the estate's mutation harnesses for `--reporter`** (RAISED-1). `vitest 4.1.8` has no
   `basic` reporter and fails by exiting non-zero over zero collected tests — a sweep harness that
   reads that exit as a conviction produces a perfect-looking, entirely vacuous log. This lane's
   own first sweep failed exactly that way.
5. **Optionally note on the compiled drafts that the landed packets supersede them** (RAISED-4).
   Two more draft errors were caught here by execution, one of which would have become a census
   STOP and one of which invited the recorded fixture-mirrors-deriver cure.

### The remaining arc

| item | state |
|---|---|
| **MF-T2A** | LANDED, terminal at `37fb6916` |
| **MF-T2B** | ⭐ **LANDED, terminal at `28565244` — awaiting ONE chair CAS** |
| **MF-T2C** | unblocked and free to promote: the BigInt conversion of `orient`/`compareRay` plus the four DCEL divergences, which this member deliberately did not pull forward |
| MF-T2D onward | per `draft-D3A-PLAN.md` §9.1 |

⛔ **This lane moved no ref.** `claude/composite-r4` still points at `2cdb87fa`; the four commits
live only on the detached HEAD of the lane worktree, which is **left in place** with its own
`node_modules` and a built `dist/`.

---

# ADDENDUM · THE CAS-SLOT LANDING (chair directive, ODQ §324.5)

> **THE TIP FOR THE CHAIR'S CAS — THIS SUPERSEDES §14's:**
> ## `b25907f94c5581969fe169fed553b23b1293516b`
> **FIVE** commits on `claude/composite-r4 @ cdfe5a96`. Working tree CLEAN. ⭐⭐ **AND THIS TIME
> THE SWEEP IS UNINTERRUPTED: all EIGHTEEN steps green in ONE sequential run, step 15 included, on
> a quiet machine.** No composite, no asterisk. `28565244` is superseded and should not be CAS'd.

## A1 · OUTCOME

WF-1C landed under this member, so the four gated commits were cherry-picked onto `cdfe5a96` and a
fifth added: the §P2.2 preamble amendment MF-T2A raised and this member proved, with every citing
packet re-stamped in the same landing per §314.2.

⛔⛔ **THE CHAIR'S NOTE THAT WF-1C "TOUCHES SIMULATION/WF SURFACES ONLY, NO townMap/fabric BYTES" IS
TRUE OF `src/` AND NOT OF THE SHARED SURFACES.** WF-1C also moved
`tests/lint/sovereigntyLightingContract.walker.test.js`, `docs/implementation/PACKET_MANIFEST.json`
and `docs/implementation/INDEX.md` — three of this member's seven manifest paths. Measured before
the first pick, not discovered during it.

⭐⭐ **AND THE CENSUS COLLISION WAS A REAL TRAP THAT WOULD HAVE LOST SEVEN TITLES SILENTLY.**

| | files | parked | credited | **titles** | suites |
|---|---:|---:|---:|---:|---:|
| the `2cdb87fa` compile base | 2485 | 364 | 2121 | 20611 | 5768 |
| WF-1C's landed value at `cdfe5a96` | 2485 | 364 | 2121 | **20618** | 5768 |
| this member's ORIGINAL after | 2487 | 364 | 2123 | **20618** | 5770 |
| ⭐ the correct UNION | 2487 | 364 | 2123 | **20625** | 5770 |

**`20618` is simultaneously WF-1C's AFTER and this member's original AFTER — the same number
meaning two different things.** A resolution that "kept mine" would have recorded WF-1C's
post-value as MF-T2B's and dropped seven titles. The census arm would eventually have caught it,
but the comment block would have lied in the meantime, and the natural cure for that red — nudging
one figure — is precisely what the family law forbids. The tuple was re-derived by **execution**.

## A2 · THE CHERRY-PICK, WITH ITS TWO NAMED RESOLUTIONS

`git cherry-pick 7cb2c730 e6e261a8 db2e386f 28565244` onto `cdfe5a96`, detached. Two conflicts,
both on shared surfaces, both resolved by RE-DERIVATION rather than by hand-merging:

1. **`PACKET_MANIFEST.json` (DRAFT commit) — seven shredded hunks** from two independent JSON
   appends. ⛔ Not hand-resolved. The new base's manifest was byte-restored and this lane's own
   append script re-run with the same DRAFT row — the script asserts the result parses, that
   exactly one row was added, that the new row is last, and that **every pre-existing row is
   byte-identical**. Result: `132 → 133 packets`, WF-1C's row intact.
2. **`sovereigntyLightingContract.walker.test.js` (implementation commit) — the census.** Resolved
   so that **BOTH re-record blocks survive in landing order**, WF-1C's verbatim, and the tuple is
   the union. This member's block was re-baselined (its BEFORE is now WF-1C's AFTER) and carries an
   explicit note naming the coincidence-of-value trap. The resolver asserted no conflict marker
   survived and that neither block was lost — the MERGE-DESTROYS-CURES law, enforced in code.

`INDEX.md` auto-merged; both rows verified present afterwards. The `Current measured checkpoint`
figure was moved `132 → 133`, following WF-1C's own precedent of maintaining it.

⭐ **THE PICK IS PROVEN EQUIVALENT, FILE BY FILE.** Every one of this member's six deliverable files
is **byte-identical** across the rebase to the gated originals, and every one of WF-1C's eight files
is **preserved byte-identical**:

```
IDENTICAL 424500a82068e84a coordinateAbi.js   IDENTICAL dcd163704c748d2a exactGeometry.js
IDENTICAL 1ada51b68dbf9710 foundation.js      IDENTICAL fc7286e23287811e fabric/index.js
IDENTICAL 07522ef7b69a9377 townMapCoordinateAbi.test.js
IDENTICAL d69ad9bac65a472b townMapCoordinateAbiDeterminism.test.js
PRESERVED  pulseKernel · pantheon · realmEvents · chroniclersLetter · settlementRumors
PRESERVED  pantheon.test · impactKindWalkers.test · WF-1C.md
```

Only the three genuinely shared surfaces moved, which is the correct and complete answer.

## A3 · THE PREFLIGHT, RE-EXECUTED AT THE NEW BASE

Every §4 figure re-measured at `cdfe5a96` — identical to `2cdb87fa` in all but one:

| row | at `cdfe5a96` | moved? |
|---|---|---|
| port sources `123f3c17…8404` / `c40c75b1…ed6e` | MATCH | no |
| `foundation.js` **143** · `fabric/index.js` **101** effective | MATCH | no |
| digest pins **157 across 12 files, 118 distinct** | MATCH | no |
| fabric exports **18 files / 94 distinct / 0 duplicated** | MATCH | no |
| test census `titles` | **20618** | ⭐ **yes, +7 (WF-1C)** |

## A4 · THE FIFTH COMMIT — THE AMENDMENT AND THE RE-STAMP

`b25907f9`, three files, **40 insertions / 13 deletions**.

**§P2.2 gains two clauses**: the fence discharges POST-BUILD only and a pre-build SKIP is not a
discharge; and a member that adds production leaves owes the **forensic zoom**, because the fence
keys on `townMapModel`'s fingerprint rather than on the arriving leaf — an absence measured against
a denominator that does not contain the surface proves nothing about it. The preamble header gains
an **Amendments** line recording §315 and §324.5 so the supersession chain is legible.

**The re-stamp**: both citers found by grepping the live hash (MF-T2A and MF-T2B are the only two),
and after the write the live SHA-256 was compared against the string in each packet — MATCH on
both. Old `6670a046…192b` → new **`0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed`**.

⚠ **THE RE-STAMP RAN TWICE, AND THE SECOND RUN IS THE RECEIPT FOR THE LAW.** The first pass stamped
`ba41c74b…dd5c`; adding the Amendments line then re-hashed the file, so every citer went stale
**inside the same commit**. Caught by re-deriving the live hash *after the last edit* instead of
trusting the one computed before it — which is exactly the failure §314.2 exists to force into the
open. The intermediate stamp never shipped; `git grep ba41c74b` returns nothing.

MF-T2B's own baseline figures were re-derived in this commit too (§A1's table), and its
`censusAuthorization` block now records that the move's SIZE is unchanged while its BASELINE is not.

## A5 · THE TERMINAL — EIGHTEEN OF EIGHTEEN, ONE UNINTERRUPTED SWEEP

Run BARE, per step, self-named logs (`laneTET2B-r2-gate-*.log`), in-shell `TRUE_EXIT`. At tip
**`b25907f9`**, `21:36:59Z → 21:52:31Z` (**15 m 32 s**), machine quiet (load 4.05 at start).

| # | step | TRUE_EXIT | figure |
|---:|---|---:|---|
| 1–11 | the eleven `validate:*` steps | **0** each | `validate:packets` → `valid: 133 packets (0 READY)` |
| 12 | `typecheck:ratchet` | **0** | `tsconfig.full.json` — **173 errors, ceiling 173** |
| 13 | `typecheck:domain:strict` | **0** | `tsconfig.domain-strict.json` — **1134 errors, ceiling 1134** |
| 14 | `lint` | **0** | 29 problems, **0 errors**, 29 warnings |
| 15 | `test:ratchet` | **0** | ⭐ **11 known failures of 28,665 tests, ceiling 11 — GREEN ON THE FIRST PASS** |
| 16 | `build` | **0** | 314 static route documents |
| 17 | `verify:dist` | **0** | `STRICT DIST OK — 51 file(s), 409 test(s), zero failed/non-run/uncollected/missing/extra/duplicate` |
| 18 | `smoke:boot` | **0** | `524/524 chunks initialised`, **PASS — the built bundle boots** |

⭐⭐ **THE ASTERISK IS GONE.** §12.1's red does not recur: step 15 passed on its first execution in
15 minutes rather than 31, on a machine at load 4 rather than 267. That is the load diagnosis
confirmed a fifth time, now by absence.

⭐ **AND THE TEST TOTAL CLOSES ACROSS THREE MEMBERS AND TWO INSTRUMENTS.** MF-T2A's terminal read
**28,651**; this member alone on `2cdb87fa` read **28,658** (+7); this tip reads **28,665** — T2A's
base plus WF-1C's seven plus this member's seven. The census walker and the ratchet agree.

**Nothing was banked. `test:ratchet:update` was never run. No ratchet, baseline, budget or ceiling
was raised.**

## A6 · THE AMENDED OBLIGATION, DISCHARGED AT THE NEW TIP

The clause this member wrote into the family law was then executed against the member itself:

```
$ VERIFY_DIST=1 npx vitest run tests/build/townMapLazy.test.js
 Test Files  1 passed (1)      Tests  3 passed (3)      TRUE_EXIT=0
```

Forensic zoom — entry closure **8 chunks**, and every literal unique to these two leaves:

| literal | entry closure | elsewhere in `dist/` |
|---|---:|---:|
| `COORDINATE_ABI` | **0** | 2 |
| `HALF_AWAY_FROM_ZERO` · `DOMAIN_SEPARATED_CANONICAL_BYTES` · `CCW_OUTER_CW_HOLE` · `plan-q1-0-1000-v1` | **0** each | 1 each |

## A7 · JUDGMENT CALLS AT THIS LANDING (each vetoable)

1. **Both conflicts resolved by RE-DERIVATION, not hand-merge.** For the manifest, restore the new
   base and re-run the asserting append script; for the census, reconstruct from both landed blocks
   with the tuple recomputed. Chose reproducible re-derivation over editing a shredded interleave.
2. **`verifiedBase` stays `2cdb87fac566…`.** That is the commit the packet was compiled and gated
   against, and it remains an ancestor. `Last revalidated` names `cdfe5a96` with the re-executed
   figures. Chose truthful provenance over making the two fields agree by overwriting history.
3. **`INDEX.md`'s measured checkpoint moved `132 → 133`.** It is a figure this landing moves, on a
   file already in the manifest, and WF-1C set the precedent of maintaining it.
4. **The Amendments line was added to the preamble header**, beyond the one line the chair
   specified, so the §315 → §324.5 supersession chain is legible from the law itself. It is what
   forced the second re-stamp, and the second re-stamp is now the worked example in the record.

## A8 · WHAT THE CHAIR SHOULD DO

1. ⭐⭐ **CAS `claude/composite-r4` to `b25907f94c5581969fe169fed553b23b1293516b`.** Clean tree,
   `valid: 133 packets (0 READY)`, **eighteen of eighteen green in one uninterrupted sweep**, live
   failing set equal to the frozen banked set (11 of 28,665), WF-1C preserved byte-identical.
   **No inherited-red argument is needed for this terminal — it is simply green.**
2. **MF-T2C is free to promote.** MF-T2B is terminal and releases both shared D3a change paths.
3. ⚠ **The estate-wide `--reporter` grep (RAISED-1) is still open** and is not this member's to
   close.
4. ⚠ **A note for the next lane that lands into a moved CAS slot:** "no `src/` overlap" is not "no
   conflict". The census walker, `PACKET_MANIFEST.json` and `INDEX.md` are touched by essentially
   every member of every family, so a rebase across ANY landing collides there — and when two
   members happen to move the same figure by the same amount, the stale value is indistinguishable
   from the correct one by inspection. Re-derive; never carry a tuple across a rebase.

⛔ **This lane moved no ref.** `claude/composite-r4` still points at `cdfe5a96`; the five commits
live only on the detached HEAD of the lane worktree, which is left in place with its own
`node_modules` and a built `dist/`.
