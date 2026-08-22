# laneTET2D-receipt.md — executor receipt for packet MF-T2D (D3a member 4, the boundary noder)

Lane **TE-T2D**, EXECUTOR seat. Chair rulings at ODQ §334 govern. No git ref moved by this lane;
the chair CASes. The main worktree was never touched. No `git stash` at any point.

- **Base:** `claude/composite-r4` = `f5332cf70520a1cdef6cc326ae000acec118da85` (the MF-T2C
  landing), verified by `git rev-parse HEAD` inside this lane's own detached worktree.
- **Worktree:** `<scratchpad>/tet2d-tree`, created with `git worktree add --detach`, with its OWN
  `node_modules` from `npm ci` (`TRUE_EXIT=0`).
- **Deliverables:** ONE new dormant leaf, TWO new acceptance files, ONE census re-record, ONE
  packet doc, plus the manifest and INDEX rows. **ZERO existing production files modified.**

---

## §1 · Preflight, executed at THIS base

| # | Check | Result | Verdict |
|---|---|---|---|
| 0 | `shasum -a 256 docs/implementation/preambles/MF-PREAMBLE.md` | `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` | MATCH |
| 1 | `git cat-file blob bc1880a2 \| shasum -a 256` (the sealed port source, preserved in-repo) | `01da024a8655ce9e468a75a53ffc49a4e28508d2d7a9400cbe2dbf1b6d81197b` | MATCH; `refs/preserve/map-sandbox-w3f-sealed` = `ee0db96d381a5a30efad63a7e2d355e0cc3db669` |
| 2 | collision scan over `src` + `tests` for `ARRANGEMENT_QUANTUM|nodeBoundarySegments|boundaryNoder|residualProperCrossings|duplicatesDropped|nodingPasses|arrangementQuantum|nodeSegments|buildBoundaryArrangement` | grep exit 1 — **zero hits** | the arriving names collide with nothing |
| 3 | the MF-T2A sweep-plant anchor, before AND after all work | `dcelEmbedding.js:140: export function derivePlanarDcelEmbedding(input) {` at column zero; file SHA-256 `46f24fdaf3cd710f7eb84159de1b81a79f9d3058c8da9b8c97738f3a05ee46fe` unchanged | byte-identical; the file was never opened for writing |
| 3b | `CURRENT_MAP_TRADITION_ID` NOT imported or declared in `dcelEmbedding.js` | absent from that file before and after; the new leaf does not import it either | precondition preserved |
| 4 | the fabric-touching battery (176 files, list re-derived at base by grep over `tests/` for `townMap`) | **173 passed, 3 skipped; 2,032 tests passed, 47 skipped**; `TRUE_EXIT=0` | the untouched-pin control's BEFORE arm |
| 5 | the census tuple | `2,490 / 364 / 2,126 / 20,663 / 5,778` | see §4 |
| 6 | `npm run typecheck:ratchet` · `npm run typecheck:domain:strict` | `173` at ceiling `173` · `1,134` at ceiling `1,134`; both `TRUE_EXIT=0` | no `townMap/fabric` key in `.domain-any-baseline.json`, so the new leaf carries zero allowed any-debt |

⚠ **Rows 4 and 6 were re-derived a SECOND time with the new leaf moved OUT of the tree**, because
the first capture's runs overlapped this lane's own file write and a walker that scans `src/`
could have seen it. The clean re-derivation is what is recorded above; both figures were
identical, so nothing turned on it — but the first capture was not admissible evidence and was
discarded rather than reasoned about.

⚠ **A captured exit status contradicted a wrapper's.** The first battery run was reported by the
harness as "exit code 0" while the in-shell `TRUE_EXIT` was `1` — the run had died on an invalid
`--reporter=basic` flag before executing a single test. Only the in-shell capture is evidence.

## §2 · Witness classes, re-executed at THIS base BEFORE any pin was written

```
P2  two crossing square rings, un-noded  -> kernel THROW 'DCEL boundaries must be atomically
                                            noded without crossings or overlaps'
P3  collinear overlap, on-grid           -> landed properCross = false; kernel THROW (same)
P5  the eps-band pair                    -> exact t = 9000000/81129642832791000000 = 1.109e-13
                                            < CROSS_EPS 1e-9; landed properCross = false;
                                            landed segIntersect = [0.00099920063948852,
                                            1.1093355875544885e-10]; kernel THROW (same)
P8  T-junction (stub ending ON an edge)  -> landed properCross = false; kernel THROW (same)
P8b the same T-junction, hand-noded      -> kernel EMBEDS V=6 E=6 F=2 C=1, Euler holds
NEW shared-endpoint collinear overlap    -> kernel THROW 'DCEL vertex has an angular tie'
P6  snap-past-wall arithmetic            -> MAX_WORLD_UNITS = 9007199254
                                            rung  1000: snaps to 9007199000 (delta -254) ACCEPTED
                                            rung  5000: snaps to 9007200000 (delta +746) REFUSED
                                            rung 25000: snaps to 9007200000 (delta +746) REFUSED
```

### §2.1 · ⭐⭐ FINDING — the FOURTH witness class (this lane's own; the compile carried three)

The landed kernel's `rejectNonAtomicIntersection` **returns early when two boundaries share
exactly one endpoint** — that is what an abutment looks like. A collinear overlap sharing an
endpoint therefore PASSES the atomic check and is refused further on by a *different* arm,
`compareRay`'s `'DCEL vertex has an angular tie'`. Inverting the atomic check literally would
therefore have left this class un-cut and the noder's output still inadmissible.

**Consequence, adopted:** the endpoint-on-interior arm is tested with **STRICT interiority**
(`p` collinear, inside the bbox, and equal to NEITHER endpoint) rather than the kernel's inclusive
`onSegment`. That spelling is strictly stronger than inverting the atomic check alone and cures
all four classes. Executed: the raw shape throws the angular tie; the noded output embeds
(`V=3 E=2 F=1 C=1`). Pinned at A4 with its own positive control.

### §2.2 · ⭐ FINDING — a correction to the compile receipt's §1.8

The compile recorded the eps-band pair's float and exact denominators as EQUAL
(`81129642832791000000` both). **That was a comparison of PRINTED values and it is refuted here.**
Compared exactly at this base:

```
float den (the double's true value) = 81129642832790994944
exact den (BigInt)                  = 81129642832791000000
absolute error                      = 5056
Number.isSafeInteger(float den)     = false   (MAX_SAFE_INTEGER = 9007199254740991)
```

The products of ABI-scale coordinate differences genuinely leave float exactness, which
**strengthens** preamble §P1 R-MF-2 rather than resting it on the family law alone. The refusal
MECHANISM in this witness is still the epsilon band, and the leaf's docblock states the executed
figure rather than repeating the compile's characterisation.

## §3 · The implemented member

`src/domain/townMap/fabric/boundaryNoder.js` — **201 effective lines** measured with eslint's own
`Linter` under `max-lines {skipBlankLines, skipComments}` (never `wc -l`), against the packet's
hard cap of 210 and the `src/domain/**` layer ceiling of 800.

Ported verbatim from the hash-verified sealed source: the snap/split/dedupe passes, the
uniform-grid bucketing (`gridCell` = mean manhattan extent), the pass cap of 14, the dominant-axis
cut ordering, the dedupe by unordered endpoint pair, and `ARRANGEMENT_QUANTUM_LADDER` with its
first-zero-residual walk. Diverging by ruling §334.2: the cut predicate.

⚠ **A defect this lane introduced and caught by re-reading its own work, before any test ran.**
The first ladder walk re-ran rung 0 and then kept the **LAST** attempt when no rung reached zero.
The ported rule keeps the **FINEST**. Falling through to the last attempt would publish the
coarsest grid on exactly the inputs that failed — the opposite of the sandbox's rule. Corrected to
seed with the finest attempt and replace it only when a later rung reaches zero; the reason is now
a comment on the walk so the next reader cannot lose the same half.

## §4 · Census — every figure CONVICTED, none added

Method: the tuple line was set to a placeholder of `-1` and the SEQUENCED walker was made to
convict on each figure in turn, five runs, each value taken verbatim from its own assertion
message. The pristine file was restored by byte copy first (`git diff` empty) so the re-record is
a clean single edit.

```
files       expected 2492 to be -1
parked      expected 364 to be -1
credited    expected 2128 to be -1
titles      expected 20671 to be -1
suiteTitles expected 5780 to be -1
```

```
BEFORE: 2,490 / 364 / 2,126 / 20,663 / 5,778
AFTER:  2,492 / 364 / 2,128 / 20,671 / 5,780
DELTA:  +2 files · +0 parked · +2 credited · +8 titles (7 domain + 1 property) · +2 suites
```

The delta matches the packet's predicted `+8`, and `parked` is unchanged at 364 — both new files
spell every title as a string literal, so door 3's reader credits them rather than parking them.
`TRUE_EXIT=0` on the census walker after the re-record (33 tests).

## §5 · Verification — in-shell TRUE_EXIT per step

| step | command | result | TRUE_EXIT |
|---|---|---|---|
| anchor preflight + single-declaration walker | `npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js tests/lint/townMapFabricSingleDeclaration.walker.test.js` | 2 files, 14 tests passed | `0` |
| focused lint | `npx eslint` over the leaf and both acceptance files | clean | `0` |
| effective lines | eslint `Linter`, `max-lines` max 1 | "File has too many lines (201)" ⇒ **201 effective** | n/a |
| acceptance battery | `npx vitest run` the two new files | **8 passed (8)** | `0` |
| census walker | `npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js` | 33 passed | `0` |
| typecheck ratchet, leaf present | `npm run typecheck:ratchet` | `173` at ceiling `173` — unchanged | `0` |
| typecheck domain strict, leaf present | `npm run typecheck:domain:strict` | `1,134` at ceiling `1,134` — unchanged | `0` |
| packet validator, DRAFT | `npm run validate:packets` | `valid: 136 packets (0 READY)` | `0` |
| packet validator, READY | `npm run validate:packets` | `valid: 136 packets (1 READY)` | `0` |
| packet validator, LANDED | `npm run validate:packets` | `valid: 136 packets (0 READY)` | `0` |
| naked-claim scan | the exact `CLAIM_RE` from `tests/docs/enforcement-claims.test.js` over the packet doc and INDEX | **0 hits** on both | n/a |
| forbidden anchor matchers quoted in prose | grep over the packet doc | **0** | n/a |

⚠ `npm run check:packet -- MF-T2D` exits `2` with *"packet MF-T2D is not READY"* — it is the
READY-time inner loop, and its own banner says `npm run check` remains the landing gate. Its
`checks` array ends in `check:tail`, i.e. the ONE full gate this lane must serialise against the
chair, so it was NOT auto-run; every other entry in that array was executed individually and is
recorded above.

## §6 · The removing-power sweep — eight mutants

Each planted in the leaf, convicted by a NAMED arm, restored by byte copy verified with `cmp`
(never the `git checkout --` family). Pristine-green control before (**8/8**), clean re-run after
(**8/8**).

| mutant | TRUE_EXIT | convicted by | first failure |
|---|---|---|---|
| M1 cut predicate := the landed float `properCross` | 1 | A2 | the eps pair rides through: 2 rows where 3 are required |
| M2 endpoint-on-interior arm deleted | 1 | A3, A4, A7 | the T-junction yields 5 rows where 6 are required |
| M3 dedupe deleted | 1 | A1, A2, A3, A4, A5, A7, A8 | 1 row where 12 are required |
| M4 canonical-direction ordering dropped | 1 | A1, A2, A3 | a direction key of 2000 where a negative is required |
| M5 support stamp wrong | 1 | A1, A2, A3, A4, A8 | the support record no longer deep-equals the kernel's rule |
| M6 ladder walk keeps the COARSEST attempt | 1 | A1–A8 | the published boundary list empties |
| M7 input validation removed (RE-TARGETED per §334.4) | 1 | A6 | an expected throw does not fire |
| M8 split points published UN-SNAPPED | 1 | A2, A7, A8 | an off-grid coordinate reaches the published surface |

⚠ **M8's first plant was a NO-OP** (a perl escaping error against the JSDoc cast). It was caught by
the sweep's own `cmp` guard, which distinguishes "the mutant did not apply" from "the mutant
survived" — without that guard a no-op plant reads as a surviving mutant and invites a bogus new
pin. Re-planted correctly and convicted.

⚠ **No BigInt-vs-Number mutant was chartered**, per the compile's skeptic pass: on rung-grid
inputs a float sign misread was not constructible, so such a mutant could not be convicted and
would be the vacuity class §P6 forbids. The BigInt requirement is carried by the executed
denominator error of §2.2, by the wall-margin argument, and by predicate ALIGNMENT with the
kernel's own exact check — stated as such in the leaf.

⚠ **No mutant targets the post-snap wall re-validation** (§334.4, §328.1): P6 shows the arm
unreachable at the finest rung, so a mutant there would be vacuous by construction.

## §7 · Judgment calls — all vetoable

- **J-TET2D-1 · The endpoint-on-interior arm is spelled with STRICT interiority**, which is
  strictly stronger than inverting the kernel's atomic check alone, because that check waves
  through the shared-endpoint collinear overlap (§2.1). Same predicate §334.2 adopted, spelled so
  it also covers the kernel's second refusal arm. Pinned at A4 with a positive control.
- **J-TET2D-2 · The compile receipt's float-denominator characterisation is corrected in the
  leaf's docblock** rather than repeated (§2.2). The docblock states the executed figure.
- **J-TET2D-3 · `residualProperCrossings` keeps its ported name** under the widened predicate.
  Analysed rather than waved through: every endpoint-on-interior violation always plans a cut
  (strict interiority guarantees the cut point is neither endpoint), so the pairs surviving to a
  terminating no-cut pass ARE proper crossings; only pass-cap exhaustion could carry a touch in
  the figure, and that case is documented in the leaf. Renaming would diverge from the
  chair-reviewed §6 contract and from the ported record shape.
- **J-TET2D-4 · `role` and `sourceId` are validated as non-empty strings by a local helper**, not
  by `requireCanonicalId`. Measured reason: the sandbox's own role vocabulary
  (`STREET_RIGHT_OF_WAY`, `WALL_FACE`) and source ids (`water|R`) do not match
  `requireCanonicalId`'s `^[a-z0-9][a-z0-9:._-]{0,95}$`, so that validator would refuse the
  ported vocabulary outright. The vocabulary stays open per the compile's J-TCT2D-7.
- **J-TET2D-5 · Two acceptance assertions were re-spelled after they red on CORRECT output.**
  `value % quantum` is `-0` for a negative coordinate and `Object.is` separates that from `+0`, so
  the pinned `toBe(0)` spelling reds the moment a fixture crosses the origin. Re-spelled as an
  equality with the reason on the line. The A8 non-vacuity control was likewise re-anchored onto
  the diagonal's un-snapped CROSSING after the first spelling (its endpoints) proved vacuous — the
  endpoints I chose were on-grid.
- **J-TET2D-6 · `check:packet` was not auto-run** because its `checks` array ends in the full gate
  (§5). Its other entries were run individually.

## §8 · Deferred and recorded — not dropped

- The codex jig's eventual retirement — §312.2c's dual-run-equivalence act, not D3a's.
- Real-leaf noding claims — out of scope by §334.4; the dual-run gate is where the ported noder
  meets real leaves.
- The role vocabulary is deliberately NOT closed (J-TCT2D-7 / J-TET2D-4).
- `ARRANGEMENT_QUANTUM` (the sandbox's second export, `= ladder[0]`) is deliberately NOT exported.
- No barrel registration; the noder is directory-internal until the extraction tranche wires it.

## §8b · The untouched-pin control, and the one delta that had to be attributed

| arm | files | tests |
|---|---|---|
| BEFORE (at base, leaf parked out) | 173 passed, 3 skipped (176) | 2,032 passed, 47 skipped (2,079) |
| AFTER (post-implementation) | 176 passed (176) | 2,057 passed, 22 skipped (2,079) |

⚠ **The arms DIFFER, and the difference was attributed rather than accepted.** Three files and 25
tests moved from skipped to passed. Cause, isolated and reproduced BOTH ways: this lane ran
`npm run build` between the arms for the dormancy discharge, and the seven `tests/build/*` files
in the battery are `VERIFY_DIST`-gated. With `dist/` parked away they report `4 passed | 3 skipped`
and `44 passed | 47 skipped`; with `dist/` restored, `7 passed` and `69 passed | 22 skipped`.

The arithmetic closes exactly on the **169 non-build files**, which are the untouched-pin
denominator that matters:

```
BEFORE non-build = 173 - 4 = 169 files passed, 0 skipped ; 2032 - 44 = 1,988 tests passed, 0 skipped
AFTER  non-build = 176 - 7 = 169 files passed, 0 skipped ; 2057 - 69 = 1,988 tests passed, 0 skipped
```

**No existing fabric-touching test changed its result.** The control HOLDS.

## §8c · Post-build dormancy discharge and forensic zoom

- `npm run build` → `TRUE_EXIT=0`.
- `VERIFY_DIST=1 npx vitest run tests/build/townMapLazy.test.js` → 3 passed, `TRUE_EXIT=0`.
- **Forensic zoom, with its denominator NAMED (§P2.12).** The entry chunk is
  `assets/index-DKqqFoYp.js`; its transitive static closure is **8 chunks** — that is the
  denominator. `dist/assets` holds **524** JS chunks in total.

| literal (unique to this member within `src/`) | entry-closure hits | whole-dist hits |
|---|---:|---:|
| `residualProperCrossings` | 0 | 0 |
| `boundary noder input` | 0 | 0 |
| `duplicatesDropped` | 0 | 0 |

| SCANNER CONTROL | whole-dist hits |
|---|---:|
| `buildTownMapModel` | 2 |
| `PLANAR_SURFACE` | 1 |
| `compileOrthogonalCrossCadastralArrangement` | 1 |

⚠ **A divergence from the packet's stated expectation, reported rather than smoothed.** The packet
anticipated the member-unique literal appearing in ZERO entry chunks *and in a lazy chunk
elsewhere in `dist/`*. It appears in **no chunk at all**: the member has no production consumer by
ruling (§334.4), so it is tree-shaken out of the bundle entirely. That is a STRONGER dormancy
result than the packet asked for, but it is a different result, and the "lazy chunk elsewhere" arm
is vacuous by construction for a member with no importer. The three scanner controls above are
what prove the scan is live rather than broken.

## §8d · The commit

`f7765cf1eb32dda3a05ba8fe4437070d63fabab2`, on this lane's own detached ref. **No ref moved.**
Seven files, `1,469` insertions, `1` deletion — the single deletion is the census tuple line.

Staging was explicit path-by-path; `git status --porcelain` immediately after the commit is empty,
so no untracked file was consumed by the pre-commit hook. The hook ran `eslint --fix` over the
four JS files and re-indexed; the leaf is **`cmp` byte-identical** to the pristine copy the mutant
sweep used, and its effective-line count is still **201**. A post-commit re-run of the acceptance
files plus the three walkers is green (5 files, 55 tests, `TRUE_EXIT=0`).

⚠ `git stash list` shows one entry, `stash@{0} On analytics-intelligence-layer: generation-tuning
fixes`. It is **foreign, pre-existing, and untouched** — this lane never invoked `git stash`;
lint-staged's own backup (`fb149a55`) was created and cleaned up by the hook itself.

## §8e · THE LANE COMMIT — the sha that matters for the CAS

> ⭐⭐ **LANE COMMIT (CURRENT, post-rebase): `27c250f94bb7c5c799693a62985c5ddecd4b6c7c`.**
> Its parent: `3ac279db4232cc65abb57c4fa016578efd0f695d` (WF-1E's landing). Fast-forward.
>
> Superseded: `f7765cf1eb32dda3a05ba8fe4437070d63fabab2` on base `f5332cf7`, the pre-rebase
> commit. ⛔ Do not CAS that one.
>
> ⚠ Corrected at the chair's instruction: this lane's first terminal-ready message led with the
> BASE sha in its header line where it should have led with the LANE COMMIT. The two are named
> distinctly everywhere in this receipt so the CAS cannot be aimed at the wrong object.

## §8e2 · THE REBASE ONTO WF-1E — executed, with the near-miss it exposed

WF-1E landed first at `3ac279db`. The rebase followed the chair's order exactly, and deliberately
**did not resolve a single conflict hunk by hand**:

1. Moved the worktree to `3ac279db` (tree verified clean first; the old commit stays reachable by
   sha).
2. Restored the four PURE-ADDITION files from `f7765cf1` — the leaf, both acceptance files, the
   packet doc. No conflict is possible on a file that does not exist at the base.
3. Confirmed the three shared meta files were **byte-identical to `3ac279db`** before touching
   them, then re-ran this lane's appends on top of WF-1E's versions.
4. Census re-record blocks left in LANDING ORDER: MF-T2C, then WF-1E, then MF-T2D.

⭐⭐ **THE CENSUS NEAR-MISS, AND WHY §325.2 IS NOT A FORMALITY.** WF-1E's tuple is
`2,490/364/2,126/20,669/5,778` — it added `+6` TITLES in two existing files and moved nothing
else. Re-convicting all five figures at the new tip gives:

```
BEFORE (at 3ac279db): 2,490 / 364 / 2,126 / 20,669 / 5,778
AFTER  (this member): 2,492 / 364 / 2,128 / 20,677 / 5,780
```

This lane's PRE-REBASE tuple was `2,492 / 364 / 2,128 / 20,671 / 5,780`. **Exactly one of the five
figures moved** — `titles`, by WF-1E's `+6`. Carrying the tuple would have red the census on a
single number while the other four corroborated it, which is the shape that makes a carried tuple
feel safe. Five fresh convictions were taken instead, each quoted from its own assertion message,
and the block in the walker records the near-miss so the next lane reads it as a law.

⚠ **The verifiedBase moved with the member.** The manifest entry and the packet doc now name
`3ac279db`, not the compile tip — the member is verified where it now sits.

### §8e3 · Cross-lane shear check (executed, not assumed)

`git diff f5332cf7..3ac279db` over this member's entire substrate:

| file | verdict |
|---|---|
| `src/domain/townMap/fabric/dcelEmbedding.js` | UNCHANGED |
| `src/domain/townMap/fabric/exactGeometry.js` | UNCHANGED |
| `src/domain/townMap/fabric/foundation.js` | UNCHANGED |
| `src/domain/townScene/stableScene.js` | UNCHANGED |
| `src/domain/deterministicSort.js` | UNCHANGED |
| `scripts/mutation-sweep.sh` | UNCHANGED |

The MF-T2A sweep-plant anchor is at `dcelEmbedding.js:140`, column zero, at the new tip, and
`CURRENT_MAP_TRADITION_ID` still has **zero** occurrences in that host. The only overlap between
WF-1E's diff and this lane's 176-file battery is the census walker itself.

### §8e4 · Re-verification at `3ac279db`

| step | result | TRUE_EXIT |
|---|---|---|
| preamble + port-source SHA-256 | both MATCH | — |
| acceptance + three walkers | 5 files, **55 passed** | `0` |
| eslint over leaf + both acceptance files | clean; leaf still **201** effective | `0` |
| `typecheck:ratchet` · `typecheck:domain:strict` | `173/173` · `1,134/1,134`, unmoved | `0` |
| `validate:packets` | `valid: 137 packets (0 READY)` | `0` |
| fabric battery | 169 non-build files, **1,988 passed / 0 skipped** — identical to both earlier arms | `0` |

⭐ **The mutant sweep was NOT re-run, and that is a claim with evidence rather than a shortcut.**
The leaf is `cmp` byte-identical to the pristine copy the sweep convicted, and
`git diff --quiet f7765cf1 --` reports both acceptance files unchanged. The sweep's subject is
exactly that leaf-and-tests pair, so its eight convictions carry unchanged.

## §8f · Chair rulings on this lane's three RAISED (received at the HOLD)

1. **RATIFIED — the strict-interiority endpoint arm.** The fourth witness class is §334.2's
   principle applied one step deeper: the kernel's REAL admission behaviour is the authority, and
   a literal inversion that leaves an executed violation class un-cut is not the accurate
   inversion. The fourth witness joins the declared-divergence record beside the compile's three.
2. **ACCEPTED AND RECORDED — the compile receipt's §1.8 equality claim is corrected on the
   ledger** at this lane's collection. The executed figure stays in the leaf docblock as written.
3. **DECLINED — `residualProperCrossings` keeps its ported name.** Renaming a ported record field
   buys zero proof while diverging from the sealed shape (§303.5 record-shapes-in), and the
   pass-cap caveat is already documented in the leaf.

All three are settled BEFORE the rebase, so the rebased commit carries them resolved.

## §8g2 · THE TERMINAL — RUN ON THE CHAIR'S GO, GREEN

`npm run check:tail` — **bare, fresh shell, not piped, not wrapped**, launched only after the
chair's explicit GO and outlasted inside this lane's own turn.

⭐ **Both exit reports agree, which is the point of the wrapper:** `gate-tail` printed
`exit: 0 (the gate's own status, not a pipe's)` and this lane's in-shell capture wrote
`TRUE_EXIT=0`. Neither was inferred from the other. Full body: 954 lines.

All twenty steps ran: `validate:hazard-registry`, `validate:premortem`, `validate:packets`,
`validate:data`, `validate:custom-content-manifest`, `validate:migration-head`, `validate:edge`,
`validate:map`, `validate:tuning-bands`, `validate:foundry-module`, `validate:mcp-server`,
`typecheck:ratchet`, `typecheck:domain:strict`, `lint`, `test:ratchet`, `prebuild`, `build`,
`postbuild`, `verify:dist`.

| verdict | figure |
|---|---|
| `implementation-packets` | `valid: 137 packets (0 READY)` |
| `typecheck-ratchet` | no regressions — `173` errors, ceiling `173` |
| `domain-strict` | no regressions — `1,134` errors, ceiling `1,134` |
| `test-ratchet` | no regressions — **`11` known failures of `28,693` tests, ceiling `11`** |
| `test-ratchet` STRICT DIST | `52` files, `433` tests, zero failed/non-run/uncollected/missing/extra/duplicate |

⭐ **Nothing was banked and no ceiling moved.** The known-failure count sits AT the frozen `11`,
unchanged — the five estate reds (the warCost/warRuling walkers and clampPrimitive) are inside it
and were not added to. A grep of the whole gate body for `boundaryNoder`, `BoundaryNoder` and
`MF-T2D` returns **zero** hits in any failure context, so this member contributed nothing to the
banked set. `npcAuthoringScope` appears **0** times, so the known four-leg flake did not fire and
no classification was needed.

⛔ `gate-mutex` acquired its atomic lock **after 0 polls** at both `test:ratchet` and
`verify:dist` — the self-deadlock hazard did not fire, because `check:tail` was never wrapped.

**Post-gate state:** lane commit still `27c250f9`, working tree clean (`dist/` is ignored), the
leaf still `cmp` byte-identical to the revision the mutant sweep convicted, and the branch tip
still `3ac279db` — so the commit remains a clean fast-forward awaiting the chair's CAS.

## §8g · Terminal status — HELD BY THE CHAIR (superseded by §8g2: GO given, gate green)

The branch tip was re-read immediately before requesting the terminal and was still
`f5332cf7`, unmoved. `SendMessage` to `main` carried the tip and the RAISED items.

⛔ **The chair replied HOLD, not GO.** TE-WF1E received the GO first and its full terminal is
running; one gate at a time. TE-WF1E also lands FIRST. `npm run check:tail` has NOT been run and
will not be started until the chair replies GO after the branch move. No soak process was touched.

**The rebase order the chair set, to be executed when the branch moves:**

1. Rebase this lane's ONE commit `f7765cf1` onto the new tip.
2. Expect conflicts ONLY in the three shared meta files: the census walker,
   `PACKET_MANIFEST.json`, `INDEX.md`.
3. **Byte-restore the new base's copies** of those three, then re-run this lane's asserting
   append on top — never merge the conflict hunks by hand.
4. Keep **ALL** census re-record blocks in LANDING ORDER: MF-T2C, then WF-1E, then MF-T2D.
5. **Re-derive all five census figures by placeholder-and-convict AT THE NEW TIP.** ⛔ WF-1E adds
   `+6` titles of its own, so this lane's `2,492/364/2,128/20,671/5,780` is DEAD the moment the
   branch moves. Never carry a tuple across a landing (§325.2).
6. Re-run the focused proof at the new tip, then request GO again.

## §9 · RAISED for the chair

1. **J-TET2D-1's strict-interiority spelling** is a widening of §334.2's letter (it also covers the
   angular-tie arm, which the atomic check alone does not). Recommended: confirm. Refusing it
   would leave the shared-endpoint overlap class un-cut and the noder's output inadmissible on a
   shape real fabric produces.
2. **§2.2's correction to the compile receipt** — the compile's "float den EQUALS exact den" line
   is refuted. Recommended: record the correction against the compile receipt so a later member
   does not inherit the wrong characterisation.
3. **J-TET2D-3's naming decision** on `residualProperCrossings`. Recommended: keep. A rename is
   available and cheap if the chair prefers the widened predicate to be visible in the field name.
