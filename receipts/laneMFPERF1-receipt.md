# Lane MF-PERF1 — THE PERFORMANCE PASS: receipt

**Lane MF-PERF1 (Opus 5), 2026-08-17, ODQ §267.5a, re-sequenced ahead of W1 on MF-INT1's evidence.**
**Mandate: make the fabric affordable for eight more waves, and change NO pixel and NO semantics.**

**ISOLATION HELD.** Every write landed in
`scratchpad/mf-proto/build-out/**` (the sandbox) and in `scratchpad/laneMFPERF1-tip/` (a
disposable full-repo copy synced FROM build-out by `MFPERF1-sync.sh`, never edited directly).
**No git command of any kind was run. Neither git tree was touched. No memory write, no ODQ
edit, no spec edit, no stash.** `laneMFW0-tip` was READ ONLY throughout — it is the A side of
every A/B and the baseline of every sha, and it is verifiably still MF-W0's bytes (`grep -c
circuitProbe` = 0 on all four files this lane changed). Scratch carries `MFPERF1-` prefixes;
exemplars are in `mf-proto-out/perf1/`.

---

## §0 · THE VERDICT, STATED FIRST

> ⭐⭐⭐ **THE COST WAS NOT WHERE THE PROFILE SAID IT WAS, AND FINDING THAT OUT IS THE WHOLE
> WAVE.** MF-INT1 measured **14.1 % of the entire build inside `Number.prototype.toFixed(6)`**
> and named `q6`/`topoText` as the first item of the performance pass. That share was real and
> its cause was not string formatting. `circuitBandSide` and `circuitHold` each opened with
> `verifyCircuit(node)`, which re-serializes every wall ring at topology precision and re-hashes
> the text four times — and the §232 partition asks them once per grid cell, once per region
> vertex and once per straddler sample. **MEASURED on one metropolis build: the freshness gate
> ran 12,283 times and serialized 40.2 MB of ring text.** ⭐ **THE CLASS: A GUARD THAT IS CORRECT
> PER CALL BECOMES A COST PER CALL, AND PROFILES AS ITS INNERMOST HELPER RATHER THAN AS ITSELF.**

> ⭐⭐⭐ **THE RESULT: 1.62× ON THE WHOLE CORPUS, 2.05× AT METROPOLIS, 2.46× AT POLYCENTRIC —
> AND EVERY ONE OF THE 32 EXEMPLAR PLATES IS BYTE-IDENTICAL, ACROSS TEN PROCESSES, AT A DIGEST
> EQUAL TO MF-W0's OWN.** Not "no visible difference": the same sha-256, plate for plate, and
> the ten-process corpus digest `98a29755cbb7db6564dab80c9f621a6cd2eea1de3d25451df06f75ecca980bc1`
> is character-for-character MF-W0's published figure. Every standing drawn census, every
> per-tier op ceiling and every water total is **identical to MF-W0's sealed battery**; the only
> two lines that differ in the whole battery are the purity scan's file count (45 → 46) and
> `buildFabric.js`'s size (791 → 733).

> ⭐⭐ **AND THE NEXT BOTTLENECK IS A DELIVERABLE, NOT AN AFTERTHOUGHT: `accessLaw.js`, 30.3 %,
> and it is now the top of the profile by a factor of four.** It is a 1,200² raster built and
> flooded **six times per walled leaf**. I took the one redundancy that is provably free (the
> street seed mask, identical in all six) and refused the large one, because it moves geometry:
> **MEASURED, the §202 repair ladder's three shrink rounds are worth a further 1.13–1.21× and
> they free ZERO bodies on every walled leaf in the corpus.** That is a defect finding as well as
> a cost, and §7.1 states it with its evidence.

> ⭐⭐ **TARGET 1 IS REFUSED WITH A NUMBER, WHICH IS THE POINT OF MEASURING AFTER A CURE RATHER
> THAN BEFORE ONE.** With the gate no longer re-running, the ENTIRE topology-key surface now
> costs **0.051 – 0.075 % of a build**, of which `toFixed` is at most 41 %. An integer/numeric
> quantization would therefore buy **at most ~0.03 %** while changing every content-hash value
> and altering the rounding rule at exact ties in a decision that defines geometric identity.
> **I did not land it.** §6.

> ⭐ **`buildFabric.js`: 791 → 733 effective lines. W1's substrate is unblocked** — 67 lines of
> headroom against the 800 domain ceiling, up from nine. §9.

---

## §1 · METHOD, AND THE LIMITS THAT GOVERN EVERY NUMBER

**⚠⚠ THE CAVEAT MF-INT1 WROTE AND THIS LANE INHERITS.** This is one loaded 8-core Mac.
`uptime` read **load averages 2.6 – 4.5** throughout (better than the spike's 15, still not a
quiet box). **Absolute milliseconds are an UPPER BAND.** Every conclusion here rests on a
**same-process ratio**: `MFPERF1-ab.mjs` imports BOTH module graphs into ONE process, warms both,
and builds the SAME leaf alternately from each, reporting the **minimum of n repetitions** — a
maximum or a mean measures the sibling jobs, a minimum measures the code. A fixed CPU benchmark
(3×10⁷ `Math.sqrt`) is taken before and after each sweep; the final run read **30 ms / 31 ms**,
so conditions did not move across it.

| instrument | what it establishes |
|---|---|
| `MFPERF1-ab.mjs` | the same-process A/B ratio, per leaf and corpus-wide |
| `MFPERF1-shas.mjs` | sha-256 of all 32 folio SVGs — **the primary receipt** |
| `MFPERF1-counts.mjs` / `-counts2.mjs` | the call counts that located the real cost, before and after |
| `MFPERF1-acount.mjs` | how many 1,200² grids the §202 pass builds and floods |
| `MFPERF1-prof.mjs` / `-profread.mjs` | `node --cpu-prof`, **self time merged BY FUNCTION NAME** |
| `MFPERF1-q6cost.mjs` | prices what is left of target 1 |
| `MFPERF1-budget.mjs` | per-census runtime + completeness status (ODQ item 5) |
| `MFPERF1-size.mjs` | effective lines, both trees, the battery's own definition |
| `MFPERF1-plates.mjs` | the 32 exemplars + manifest to `mf-proto-out/perf1/` |

⚠ **ONE INSTRUMENT CORRECTION WORTH RECORDING, BECAUSE IT CHANGED WHAT THE PROFILE SAID.** V8
emits one profile node **per call site**, so `q6` appeared as four separate rows of 4.4 / 2.8 /
2.2 / 1.1 % and read as four small costs. `MFPERF1-profread.mjs` merges by function name: the
same baseline profile then reads **`q6` 12.9 %, the single hottest frame in the build**.
⭐ **THE CLASS: AN UNMERGED PROFILE UNDERSTATES ITS HOTTEST FUNCTION BY ITS CALL-SITE COUNT.**

---

## §2 · WHAT CHANGED — six files, one new module, and every change a MOVE or an INDEX

| file | eff lines | what, and why it is output-neutral |
|---|---|---|
| `fabric/reservedGround.js` | 192 → **255** | **NEW: `ringNearestSegment` (the definition) and `ringNearestIndex` (a BVH over contiguous ring arcs)** — MF-ARCH's item 5, handed off unstarted by MF-ARCH-2 §9.1. §2.1. |
| `fabric/wallCircuit.js` | 292 → **318** | **ONE law body, TWO instruments.** `circuitProbe` verifies once at acquisition and indexes once; `circuitProbeExhaustive` is the walked reference; `circuitBandSide`/`circuitHold` keep their per-call gate and their exact behaviour. §2.2. |
| `fabric/districtPartition.js` | 101 → **115** | acquires the probe once per pass (3 loops); `districtStraddlers` now publishes `complete` / `sampling` / `status`. §2.2, §8. |
| `fabric/builtUmbrella.js` | 197 → **198** | `epochCircuitRing` uses the module's own **exact** `ringIndex` instead of a raw `pointInPolygon` per grid cell. |
| `fabric/accessLaw.js` | 338 → **342** | **NEW `streetSeeds(fabric)`; `buildGrid`, `repairAccess`, `accessCensus`, `circuitPermeability` take it as a REQUIRED argument.** §2.3. |
| `fabric/leafCensus.js` | 277 → **278** | derives the seeds once and hands them to all three consumers (J-W0-1's shape). |
| `fabric/waterMode.js` | 181 → **209** | **MOVED IN, verbatim:** `deriveWatercourse` — the drainage trace, the meander and the traced shore, seated beside the relationship they feed. §9. |
| `fabric/compoundGround.js` | — → **13** | **NEW.** The §15.3 compound disc test, which the assembly carried as **four literal copies**. §9. |
| `fabric/buildFabric.js` | 791 → **733** | the two extractions above; **−58 effective lines**. |
| `tests/domain/townMapWallCircuit.test.js` | — | **+4 titles** (the equivalence pins, the tie counterfactual, the completeness ladder) and **2 new expectations inside an existing title** (the probes red at acquisition). |
| `tests/lint/derivationGraph.walker.test.js` | — | **+1 title** — `streetSeeds` has ONE home and ONE caller, with a planted-fallback counterfactual. |
| `tests/domain/townMapFabricBuildOut.test.js` | — | 5 call sites re-pointed at the new `accessCensus` signature. **No new titles.** |

### §2.1 · THE SPATIAL INDEX, AND WHY IT IS A BVH RATHER THAN A GRID

`claimIndex` and `segmentHash` answer *"which claims are within r"* well, and answer NEAREST
badly: a point deep inside a walled town is 200 units from its wall, so an expanding-cell search
sweeps hundreds of empty cells before its bound closes. `ringNearestIndex` is a **binary
bounding-volume hierarchy over contiguous ring arcs**, pruned by point-to-box distance, so a far
query costs what a near one does.

**IT IS EXACT BY THREE SEPARATE PROPERTIES, and the third one is where a naive index fails:**

1. **THE CANDIDATE ARITHMETIC IS THE SAME ARITHMETIC** — every candidate goes through
   `nearestOnSeg`, the same call in the same operand order, so a visited segment's `d2`, `qx`
   and `qy` are bit-identical to the walk's.
2. **THE TRAVERSAL IS ASCENDING SEGMENT INDEX** (left arc, then right), and improvement is on
   strict `<` — so an exact tie keeps the LOWEST-indexed segment, exactly as the walk does.
3. **THE PRUNE IS A TRUE LOWER BOUND**, compared **strictly** (`>`), so a subtree whose bound
   merely equals the incumbent is still opened.

⚠ **THE RESIDUAL, STATED RATHER THAN ARGUED AWAY.** The box bound and the candidate distance are
different expressions, so a tie at a distance exactly equal to a box face could in principle
invert by one ulp. It is **measured to zero** by §5's equivalence pin — every query the corpus
makes — and by the 32 byte-identical plates.

⭐ **WHY PROPERTY 2 IS LOAD-BEARING AND NOT PEDANTRY.** A nearest-segment query returns a POINT
as well as a distance, and `circuitHold` **projects a district boundary onto that point**. An
index that agreed about every distance and disagreed about one tie would move a drawn district
edge while every count stayed equal. §5's tie fixture is built to fail exactly that index.

### §2.2 · ONE LAW BODY, TWO INSTRUMENTS — the freshness gate is not weakened

`bandSideOf` and `holdOf` carry §232's law; `bandRigs(node, indexed)` supplies either the walked
rig or the indexed one. The exhaustive rig is therefore the **definition**, and the pin is a real
comparison rather than a tautology.

⭐ **THE GATE IS NOT WEAKENED, IT IS ACQUIRED.** `circuitProbe(node)` runs `verifyCircuit` at the
moment the instrument is taken, and the caller holds it for one synchronous derivation pass —
**the same guarantee, with the same declared limit, that `publishCircuitRings`' memoized
`fabric.walls` getter already carries and states.** The one-shot `circuitBandSide` /
`circuitHold` still verify per call and are behaviourally untouched, so §230's counterfactual
still reds at every accessor; the pin now also asserts that **both probes throw at acquisition**,
because a reference rig that skipped the gate would be a second, unguarded door.

### §2.3 · THE §202 GRID's STREET SEEDS ARE A LOOP INVARIANT NOBODY HAD NAMED

**MEASURED (`MFPERF1-acount.mjs`): a walled leaf built the 1,200² grid SIX times** — four repair
rounds, the census, and the permeability statistic — **and stamped the identical street mask into
all six**, because the access pass moves BODIES and never channels. `fillBand` alone profiled at
**6.2 %** of the build; it now reads **1.2 %**.
⭐ **THE CLASS: A PURE FUNCTION CALLED IN A LOOP OVER AN ARGUMENT THAT DOES NOT VARY IS A
LOOP-INVARIANT NOBODY NAMED.**
⚠ `seeds` is a **REQUIRED** argument with **no default**, deliberately — MF-W0's standing hazard
says a recomputation added "for safety" restores the defect silently. A walker pin (§5) holds it
to one home and one caller, with a planted fallback that convicts.

---

## §3 · THE BEFORE / AFTER PROFILE

### §3.1 · The same-process A/B — `MFPERF1-ab-final.log`, min of 4, benchmark 30/31 ms

| leaf | `buildFabric` A (MF-W0) | B (this lane) | **RATIO** |
|---|---|---|---|
| thorp | 142 ms | 155 ms | 0.91× |
| hamlet | 176 ms | 166 ms | 1.06× |
| village | 185 ms | 182 ms | 1.01× |
| **town** | 1,300 ms | **779 ms** | **1.67×** |
| **city** | 1,490 ms | **945 ms** | **1.58×** |
| **metropolis** | 1,503 ms | **732 ms** | **2.05×** |
| **polycentric** | 1,248 ms | **507 ms** | **2.46×** |
| **highwater** | 1,215 ms | **736 ms** | **1.65×** |
| mountain | 164 ms | 162 ms | 1.01× |
| fjord | 632 ms | 617 ms | 1.02× |
| siege / plague / famine | 1,273 / 1,281 / 1,261 ms | 731 / 759 / 749 ms | 1.74× / 1.69× / 1.68× |
| migration | 1,481 ms | 917 ms | 1.61× |
| year-018 | 1,928 ms | 1,398 ms | 1.38× |
| year-100 | 2,461 ms | 1,430 ms | 1.72× |
| **CORPUS** | **17,740 ms** | **10,966 ms** | **1.62×** |
| `renderFolio`, corpus | 140.0 ms | 136.1 ms | 1.03× (untouched, as expected) |

⭐ **THE FIVE UNWALLED LEAVES ARE THE CONTROL AND THEY DID NOT MOVE** (0.91–1.06×, i.e. noise).
Every gain is on a leaf that has a circuit — which is exactly what the diagnosis predicts, and
what an unrelated machine-state improvement would NOT look like. ⚠ thorp's 0.91× is a 13 ms
difference on the corpus's smallest build and is inside this machine's noise; it is reported
rather than smoothed.

### §3.2 · The call counts — the diagnosis, stated as numbers

| per build | MF-W0 | MF-PERF1 | |
|---|---|---|---|
| `verifyCircuit` calls, metropolis | **12,283** | **5** | 2,457× |
| topology-key text serialized, metropolis | **40.2 MB** | **16.4 KB** | 2,457× |
| ditto, corpus | **445 MB** | **0.28 MB** | |
| segment visits, town | 574,896 | **171,123** | 3.36× |
| segment visits, polycentric | 842,400 | **276,331** | 3.05× |
| segment visits, year-100 | 1,148,326 | **348,329** | 3.30× |
| segment visits, metropolis | 319,254 | **158,960** | 2.01× |

⚠ **METROPOLIS GAINS LEAST FROM THE INDEX AND MOST FROM THE GATE**, and the reason is worth
recording: its working ring carries **26 vertices** where the town's carries **112**. A tree over
26 segments with 4-segment leaves cannot prune much. The index is a town-family cure; the gate
was everybody's.

### §3.3 · ⭐⭐ THE NEW TOP OF PROFILE — the next wave's starting point

`node --cpu-prof`, 3 warm metropolis builds, self time merged by function name.
⚠ **Profiling inflates the run; read the SHARES.** Total sampled fell **7.53 s → 3.92 s**.

| module | MF-W0 | **MF-PERF1** | |
|---|---|---|---|
| `accessLaw.js` | 19.0 % | **30.3 %** | ⛔ **the new bottleneck** |
| `wallCircuit.js` | **22.7 %** | **< 1 %** | out of the top fourteen modules entirely |
| `fabricGeometry.js` | 19.0 % | 7.1 % | |
| `parcels.js` | 4.0 % | 7.9 % | |
| `reservedGround.js` | 3.5 % | 6.9 % | |
| `groundLaw.js` | 3.3 % | 6.6 % | |
| `streets.js` | 3.0 % | 5.1 % | |
| garbage collector | 2.1 % | 3.3 % | |

| hottest frames | MF-W0 | **MF-PERF1** |
|---|---|---|
| `fabricGeometry.q6` | **12.9 %** | — (not in the top 30) |
| `wallCircuit.circuitBandSide` | 9.1 % | — |
| `wallCircuit.circuitHold` | 5.7 % | — |
| `wallCircuit.contentHash` | 3.5 % | — |
| `builtUmbrella.epochCircuitRing` | 3.6 % | — |
| `accessLaw.fillBand` | 3.5 % | 1.2 % |
| **`accessLaw.labelOpen`** | 5.6 % | **10.2 %** |
| `accessLaw.bodyReaches` | 2.6 % | 4.7 % |
| `accessLaw.accessCensus` | 2.6 % | 4.6 % |
| `accessLaw.fillPoly` | 2.0 % | 3.7 % |
| `accessLaw.streetLabels` | 1.9 % | 3.6 % |
| `reservedGround.segSegClosest` | 1.7 % | 3.6 % |

⭐ **THE SHAPE HAS CHANGED AND THE NEXT WAVE SHOULD KNOW IT.** MF-INT1 could say "70 % of the
build is in three modules and the two hottest frames are a string hash and a missing index".
**That is no longer true.** What remains is **one rasterization module at 30 % and a long diffuse
tail** — no single output-neutral frame above 4 % outside `accessLaw`. The concentrated,
free-of-charge wins are spent.

---

## §4 · THE BYTE-IDENTITY PROOF — the primary receipt

```
$ node MFPERF1-shas.mjs                       # 16 leaves × {parchment, darkFantasy}
$ MFPERF1_TIP=laneMFW0-tip node MFPERF1-shas.mjs
$ diff MFPERF1-shas-before.json MFPERF1-shas-after3.json
  ⭐ ALL 32 PLATE SHAs BYTE-IDENTICAL

$ node MFPERF1-plates.mjs                     # written to mf-proto-out/perf1/ with a manifest
  32 of 32 plates BYTE-IDENTICAL to the MF-W0 base; 0 moved
```

```
CROSS-PROCESS DETERMINISM — 10 processes, whole corpus, two lenses (MFW0-det.mjs)
  identical = 10 · mismatched = 0
  98a29755cbb7db6564dab80c9f621a6cd2eea1de3d25451df06f75ecca980bc1
  ⭐ CHARACTER-FOR-CHARACTER MF-W0's OWN PUBLISHED DIGEST (laneMFW0-receipt.md §7)
```

⭐⭐ **THE STRONGEST FORM OF THE CLAIM, AND IT IS WORTH SAYING PRECISELY: the ten-process digest
covers the WHOLE corpus in two lenses, so a per-process difference anywhere in the fabric, the
chrome or the splice would move it. It did not move, and it did not move away from MF-W0's
either.** The change is output-neutral across process boundaries, not merely within one run.

---

## §5 · THE EQUIVALENCE PINS — identical OUTPUTS, not identical counts

Four new titles in `tests/domain/townMapWallCircuit.test.js`, one in the walker.

| pin | what it asserts | non-vacuity arm |
|---|---|---|
| **the indexed nearest EQUALS the walked nearest, index and point, over a real circuit** | `{i, d2, qx, qy}` deep-equal for **every** query, on the 128² lattice the partition walks **plus every ring vertex** (the degenerate case: a query exactly on a segment endpoint) | asserts `idx.indexed === true` and `nodes > 2` — a "index" that fell back to the walk would make every comparison a tautology; asserts `compared > 2000` |
| **⛔ COUNTERFACTUAL — a TIE fixture where an out-of-order index returns a different POINT** | a square queried at its centre: 4 equidistant sides, 4 distinct points, the walk keeps `i = 0`. Then a 64-facet diamond that DOES earn a tree: 8 tied segments, 4 distinct points | proves the tie is real (`new Set(d2).size === 1`) and that the tied segments carry **more than one** distinct point, so the tie-break is load-bearing |
| **the PROBE and the EXHAUSTIVE rig give identical §232 answers on every corpus query** | `side` and `hold(±1)` compared value-for-value over the 128² lattice **and every district-region vertex**, on all four walled fixtures | asserts the sweep saw **> 3,000 queries and all three side values `[-1, 0, 1]`** — an "identical answers" pass would otherwise only mean the queries never met the circuit |
| **a census that did not run can never read as a clean one** | walled: `complete`, `SAMPLED(step 2)`, `sampled > 0`, `straddlers 0`. Unwalled: **the same 0**, `complete === false`, `NOT APPLICABLE` | the arm IS the counterfactual: two identical zeros that must be distinguishable |
| **(walker) `streetSeeds` has ONE home and ONE caller, and a fallback REDS** | one `export function`, one caller (`leafCensus.js`), one call; `buildGrid` no longer stamps the mask | plants `s \|\| streetSeeds(f)` and asserts the shape is detected in the plant and absent in the real source |

Extended inside the existing `⛔ COUNTERFACTUAL — a MUTATED circuit reds at EVERY accessor`
(no new title): `circuitProbe(tampered)` and `circuitProbeExhaustive(tampered)` both throw
`/STALE OR MUTATED/`.

---

## §6 · TARGET 1 — MEASURED, AND REFUSED, WITH THE NUMBER

The brief's first target was to replace the string topology key with an integer/numeric
quantization. **After the gate stopped re-running, here is what that is worth** (`MFPERF1-q6cost.mjs`):

| leaf | build | `ringsText` | `ringsText`+`contentHash` | verifications | **total topology-key cost** |
|---|---|---|---|---|---|
| town | 1,004 ms | 0.0444 ms | 0.1079 ms | 5 | **0.755 ms = 0.075 %** |
| metropolis | 858 ms | 0.0264 ms | 0.0631 ms | 5 | **0.442 ms = 0.051 %** |
| year-100 | 1,540 ms | 0.0440 ms | 0.0953 ms | 10 | **1.144 ms = 0.074 %** |

**`toFixed` is at most 41 % of that** (`ringsText` ÷ `ringsText`+`contentHash`), so a perfect
integer rewrite buys **≤ 0.03 % of a build**. Against that it would:

- **change every `contentHash` and `inputsHash` value.** Invisible in the SVG (grep-verified:
  the hashes appear only on the node and in tests that recompute them), but it is a moved value
  in a governed artifact and would have to be declared;
- **change the rounding rule at exact ties.** `v.toFixed(6)` rounds the exact decimal value half
  away from zero; `Math.round(v * 1e6)` rounds the PRODUCT half toward +∞. The quantum decides
  geometric IDENTITY — "did this geometry change" — so a tie-rule difference is a
  determinism-critical change bought for three hundredths of a percent.

⛔ **NOT LANDED.** The brief's own instruction: *if an optimisation cannot be made output-neutral,
report it with its measured saving and the reason.* It could probably be made output-neutral; it
is not worth the proof. ⭐ **AND THE GENERAL LESSON IS THE ONE TO BANK: A PROFILE SHARE IS A
PROPERTY OF A CALL COUNT AS MUCH AS OF A FUNCTION, SO AN OPTIMISATION TARGETED FROM A PRE-CURE
PROFILE CAN BE AIMED AT THE WRONG HALF OF ITS OWN EVIDENCE.**

---

## §7 · WHAT I LEFT ON THE TABLE — measured, named, and priced

### §7.1 ⛔⛔ THE §202 REPAIR LADDER: 1.13–1.21× AVAILABLE, AND IT FREES NOBODY

**This is a defect finding as much as a cost finding, and it is the most valuable thing in this
section.** `repairAccess` runs `MAX_ROUNDS = 4`; each round builds and floods a 1,200² grid and
computes reach for every drawn body. **MEASURED (`MFPERF1-acount.mjs`), the sealed set does not
move across the ladder on ANY walled leaf:**

```
town   sealed[15,15,15,15]   city  sealed[34,34,34,34]   metropolis sealed[78,78,78,78]
polycentric sealed[2,2,2,2]  highwater sealed[6,6,6,6]   fjord sealed[4,4,4,4]
year-018 / year-100 sealed[15,15,15,15,18,18,18,18]   (two builds per leaf)
```

and the published meta closes the loop:

```
town       shrunk  45 (= 15 × 3)  dropped 15   landlockedAfter 0
city       shrunk 102 (= 34 × 3)  dropped 34   landlockedAfter 0
metropolis shrunk 234 (= 78 × 3)  dropped 78   landlockedAfter 0
```

⭐ **THE BODIES SEALED AT ROUND 0 ARE EXACTLY THE BODIES DROPPED AT THE END. The three shrink
rounds shrink each of them three times and then delete them anyway.** The published
`accessFreed = shrunk − dropped` reads 30 / 68 / 156 and is counting **shrink operations, not
freed buildings** — a figure whose name says "freed" and whose body counts something else, which
is this estate's own §230 docstring class one more surface out.

**PRICED BY COUNTERFACTUAL, not estimated** — a disposable copy with `MAX_ROUNDS = 1`, measured
same-process against this lane's tip and then **deleted**:

| leaf | this lane | `MAX_ROUNDS=1` | further ratio |
|---|---|---|---|
| town | 757 ms | 666 ms | 1.14× |
| city | 987 ms | 869 ms | 1.14× |
| metropolis | 694 ms | 572 ms | **1.21×** |
| polycentric | 479 ms | 401 ms | 1.19× |
| year-100 | 1,457 ms | 1,289 ms | 1.13× |

⛔ **REFUSED HERE.** It is **not** output-neutral: where the sealed body is an institution the
ladder shrinks its NEIGHBOURS or cuts a corridor through them, and those neighbours survive and
are drawn. Removing rounds would move drawn geometry, which this wave's non-negotiable forbids.
**It is a declared shift for a later wave, and it should be taken as a CORRECTNESS question
first** — a bounded repair that provably frees nobody on the whole corpus is either mis-tuned
(`ACCESS_INSETS` too small), mis-targeted (it shrinks the wrong bodies), or genuinely impossible
on these leaves, and the answer changes what the right fix is.

### §7.2 · `accessLaw.labelOpen` — 10.2 %, and the cheap-looking cure is not one

90 floods of a 1,200² grid across the corpus. The obvious win — hoisting the two
`Int32Array(1.44 M)` allocations — was **microbenchmarked and rejected**: alloc 0.424 ms +
`.fill(-1)` 0.128 ms + a second alloc 0.424 ms ≈ **1.0 ms per call**, i.e. **6 ms of a ~900 ms
walled build (0.7 %)** for module-scope mutable scratch that would return a shared buffer to its
caller. Not worth the aliasing hazard. **The 10.2 % is the DFS itself over 1.44 M cells**, and
the only lever on it is `GRID_N`, which is a **declared and argued resolution** (accessLaw's own
header) — a semantics change, not mine.

### §7.3 · `circuitPermeability` still rebuilds `accessCensus`'s blocked raster

The two are called back-to-back on the identical `live` set; only the street mask is now shared.
Caching the blocked array too is provably exact and worth roughly **1 of 6 grid builds ≈ 1.7 %**.
Left because it needs either a memo keyed on object identity (the §230 staleness class this
estate keeps getting bitten by) or a further signature change to a law module, for 1.7 %.

### §7.4 · `districtStraddlers` costs 516.8 ms at metropolis — more than every other census combined

It is a **test-only instrument** (no `buildFabric` caller), so it costs nothing at render time —
but it is **the single most expensive census in the programme** and it is now on the budget sheet
(§8). It fell from a pre-lane figure that would have been ~2–3× worse; it is still the row to
watch when the corpus grows.

### §7.5 · The diffuse tail

`reservedGround.segSegClosest` 3.6 %, `fabricGeometry.pointInPolygon` 2.8 %,
`groundLaw.overlapping` 2.5 %, `parcels.admissible` 2.5 %, `streets.webConnectivity` 2.1 %, GC
3.3 %. **No single output-neutral frame above 4 % outside `accessLaw`.** Named so a later wave
does not go looking for another `q6`.

---

## §8 · PER-CENSUS RUNTIME BUDGETS AND THE COMPLETENESS LADDER (MF-ARCH item 5, second half)

⚠⚠ **THE DESIGN DECISION FIRST, BECAUSE IT IS THE INTERESTING PART.** A runtime is a wall-clock
reading and the fabric layer's purity law forbids `Date` outright — and worse, a duration that
reached `fabric.meta` would be a **non-deterministic field inside a byte-stable artifact**, which
is the one thing this whole programme exists to prevent. So the requirement splits:

- **THE COMPLETENESS STATUS IS A FACT ABOUT THE DERIVATION** and lives in the DOMAIN, derived and
  byte-stable: `districtStraddlers()` now returns `complete`, `sampling` and `status`.
- **THE RUNTIME IS A FACT ABOUT THE MACHINE** and lives in the harness (`MFPERF1-budget.mjs`).

**THE LADDER — four statuses, and only one is a pass:**

| status | meaning |
|---|---|
| `MEASURED` | it ran, over a subject that exists |
| `NOT APPLICABLE` | its subject does not exist on this leaf. **A zero here is not a clean bill; it is an absence of a question** |
| `SAMPLED(...)` | it ran over a **declared** lattice rather than an enumeration; the lattice is published so a later wave can check the argument instead of re-deriving it |
| ⛔ `SKIPPED` | **it did not run. This can never be green** — the instrument exits non-zero |

```
census                                 worst ms  at           corpus ms   PROPOSED per-leaf budget
§202 access + §201B orphan streets         89.9  metropolis      1095.8   270 ms
§161m.4 circuit permeability               30.7  metropolis       254.9    93 ms
§205A water right-of-way                   18.3  fjord             58.0    55 ms
§203 zones (containment + fill)            16.1  metropolis        70.5    49 ms
GAP-B radial density                        0.5  metropolis         3.6     2 ms
GAP-C street classes                        0.3  polycentric        2.2     1 ms
§232 district straddlers                  516.8  metropolis      1862.5  1551 ms
⭐ NO CENSUS WAS SKIPPED                                             TRUE_EXIT=0
```

⚠ **THE BUDGETS ARE PROPOSED, NOT PINNED** — 3× this run's worst, on one loaded machine. MF-W0's
J-W0-9 is the precedent: *binding a tolerance on n=1 is tuning wearing measurement's clothes.*
**The chair binds them; this lane publishes the measurement and the method.**

⭐ **THE LADDER PAID FOR ITSELF ON ITS FIRST RUN.** It shows `metropolis` and `polycentric`
reading **§205A NOT APPLICABLE** (dry leaves) — two leaves whose water census reports zero
because there is no water, not because the water is clean. That distinction did not exist in any
published figure before this run.

---

## §9 · THE LINE BUDGET — `buildFabric.js` 791 → 733, and W1 IS UNBLOCKED

MF-W0's hazard read: *"`buildFabric.js` IS AT 791 EFFECTIVE LINES AGAINST 800. Nine lines of
headroom… W1's substrate cannot land inside it."* Two extractions, both **verbatim moves**, both
proved by the 32 byte-identical plates:

**(a) `deriveWatercourse` → `waterMode.js`** (−~24 eff). The drainage trace, the meander and the
traced shore now sit beside the RELATIONSHIP they are the input to. The one-decider rule is
untouched: the landed model still says WHETHER, this says WHERE. ⚠ **One new module edge**,
`waterMode → relief` (for `shoreContour`); `relief` imports only modules already upstream of
`waterMode`, and the module-import-graph pin confirms the fabric layer is **still acyclic**.

**(b) `compoundGround.js`** (−~34 eff, +13 in a new file). ⛔ **THE ASSEMBLY CARRIED THE §15.3
COMPOUND DISC TEST AS FOUR LITERAL COPIES** of `dx*dx + dy*dy < c.r*c.r` — in
`forbiddenWithCompounds`, in `forbiddenPhysical`, and twice more inside `forbiddenFor`. ⭐ **THE
CLASS this programme keeps finding, one more member: A PRIVATE SPELLING OF A SHARED RULE IS A
DIVERGENCE WAITING FOR SOMEBODY TO EDIT ONE COPY** (`wallCircuit`'s `n6`/`polyText`, the gate
split, the reroll salt, `wallClaims`). Four copies of one circle is four chances for a later lane
to widen a compound in three places. `over(base)` returns `true`/`false` exactly as the four
hand-written closures did.

```
sizeBaseline (EFFECTIVE lines, domain ceiling 800)
buildFabric.js   733 eff / 1272 raw        (MF-W0: 791 / 1348)
streets.js       691    parcels.js  668    substrate.js 531
MAX 733 (buildFabric.js) against 800 — UNDER          ⭐ 67 lines of headroom, was 9
```

⚠ **THE LANDING EXECUTOR OWES A `sizeBaseline` ROW FOR `compoundGround.js`** (13 eff) — the
first new fabric source file since `epochAxis.js`/`lateGround.js`, and MF-ARCH-2's hazard applies
unchanged. ⚠ INT1 measured 796 with the REPO's own `sizeBaseline.test.js` definition against this
lane's 791 under the sandbox battery's; the two definitions differ slightly and **the executor
should re-measure with the repo's**, not inherit either figure.

---

## §10 · THE STANDING FLOOR, RE-QUOTED AT MY TIP

```
vitest (lane config, bare)              7 files / 178 tests passed        TRUE_EXIT=0
                                        (MF-W0: 173 — +5 titles, 0 new test FILES)
cross-process determinism               10 processes, identical=10 mismatched=0
                                        98a29755…980bc1  ⭐ EQUAL TO MF-W0's
32-plate sha vs MF-W0's tip             32 of 32 BYTE-IDENTICAL, 0 moved
§17 / §17.4 / §205A / §200 drawn census 0 / 0 / 0 / 0 over 22,067 bodies (12,084 distinct-site)
§202 landlocked · §201B orphan streets  0 · 0
op ceiling (§217 per-tier ratchet)      96/96 renders UNDER — headroom thorp 86 · hamlet 86
                                        · village 136 · town 146 · city 532 · metropolis 1422
purity scan (comments stripped)         46 files — Math.random / Date / localeCompare /
                                        Math.pow / runtime trig: NONE
sizeBaseline                            MAX 733 (buildFabric.js) against 800
T-01 grain                              every leaf IN BAND
per-census completeness (§8)            NO CENSUS SKIPPED                 TRUE_EXIT=0
```

⭐⭐ **AND THE SHARPEST FORM OF THE WHOLE RECEIPT: `diff` OF MY FULL BATTERY AGAINST MF-W0's
SEALED ONE HAS EXACTLY TWO HUNKS** — the purity file count (45 → 46) and `buildFabric.js`'s size
(791 → 733). Every water total, every exemption by name, every violation by cause, every drawn
census, every op-ceiling headroom, every grain figure: **identical**.

---

## §11 · WHAT I DID NOT DO — stated plainly

1. ⛔ **NO GIT WRITE OF ANY KIND, NO MEMORY WRITE, NO ODQ OR SPEC EDIT.** The repo is untouched.
2. ⛔ **THE TOPOLOGY QUANTUM'S REPRESENTATION IS UNCHANGED** (§6) — measured at ≤ 0.03 %, refused.
3. ⛔ **THE §202 REPAIR LADDER IS UNCHANGED** (§7.1) — 1.13–1.21× available, not output-neutral,
   and it wants a correctness ruling before an optimisation.
4. ⛔ **`GRID_N` IS UNCHANGED.** The 1,200² raster is `accessLaw`'s declared and argued
   resolution; lowering it is a semantics change and a chair call.
5. ⛔ **`circuitPermeability`'s BLOCKED RASTER IS STILL REBUILT** (§7.3) — ~1.7 %, left because
   the cures available are a staleness-class memo or a further law-module signature change.
6. ⛔ **NO BROWSER OR PDF RE-MEASUREMENT.** MF-INT1's §4.4/§4.5 rows are unchanged by this lane
   (`renderFolio` moved 1.03×, i.e. not at all) and I did not re-run them. **The §220 first-render
   figure should be re-derived by the integration path, not inferred from my ratio** — my A is
   MF-W0's sandbox tip, not INT1's overlaid app tree.
7. ⛔ **NO PLATE WAS VIEWED.** Deliberate and, for once, fully justified: all 32 are
   **sha-identical** to the set MF-W0 sealed, so there is nothing new to look at. **MF-W0's 19
   still-unviewed moved plates remain W1's first act** — this lane did not discharge that debt
   and did not add to it.
8. ⛔ **I DID NOT RE-RUN THE APP-TREE GATE.** MF-INT1's §4.7 finding — the sandbox suite did not
   finish in 15 minutes inside the app tree — is untouched by this lane, although **§13 notes the
   one thing that has changed about it**.

---

## §12 · JUDGMENTS (all vetoable)

- **J-P1-1 · THE FRESHNESS GATE WAS NOT MEMOIZED; AN INSTRUMENT WAS INTRODUCED.** The cheap fix
  was a module-scope `WeakSet` on `verifyCircuit`, which would have bought the same speed by
  quietly narrowing a §230 guarantee everywhere. `circuitProbe` narrows nothing: the gate runs at
  acquisition, the one-shot accessors keep their per-call check, and the counterfactual pins fire
  on all four entry points. *Veto and the memo is two lines — but it would be a semantics change
  in a wave that forbids them.*
- **J-P1-2 · THE EXHAUSTIVE WALK IS KEPT AS AN EXPORTED, TESTED PATH RATHER THAN DELETED.** It
  costs one function and it is what makes the equivalence pin a comparison instead of a
  tautology. *It is the shape §234's spatial-indexing rule actually needs.*
- **J-P1-3 · A BVH, NOT A UNIFORM GRID.** `claimIndex`/`segmentHash` are this module's precedent
  and both answer "within r"; nearest-with-a-far-query is a different question and a grid answers
  it badly (§2.1). *The measured alternative was an expanding-cell search sweeping ~1,800 cells
  for a query 200 units from its wall.*
- **J-P1-4 · TARGET 1 IS REFUSED ON A POST-CURE MEASUREMENT, NOT ON THE BRIEF'S PRE-CURE
  SHARE.** The brief named it first and the evidence moved under it. *Veto and I will build it; the
  saving is ≤ 0.03 % and the cost is a declared hash shift plus a tie-rule change in an identity
  decision.*
- **J-P1-5 · `streetSeeds` IS A REQUIRED ARGUMENT WITH NO DEFAULT**, so a caller that forgets it
  throws instead of silently recomputing. MF-W0's J-W0-1 and its "do not add a fallback" hazard
  are the precedent, and the walker pin is the enforcement. *The cost is five updated test call
  sites, which is the price of the guarantee.*
- **J-P1-6 · I TOOK TWO EXTRACTIONS THAT ARE NOT PERFORMANCE WORK**, because the brief makes
  W1's landing depend on the line budget and because the compound-disc quadruplication is a
  member of the defect class this programme is organised around. Both are verbatim moves proved
  by 32 byte-identical plates. *Veto either and `buildFabric.js` returns toward 791.*
- **J-P1-7 · THE COMPLETENESS STATUS WENT INTO THE DOMAIN AND THE RUNTIME DID NOT.** A duration
  in `fabric.meta` would be a non-deterministic field in a byte-stable artifact. *Veto and the
  budgets can live in the domain — but only as a static table, never as a measurement.*
- **J-P1-8 · THE BUDGETS ARE PUBLISHED AS PROPOSED, NOT PINNED** (J-W0-9's precedent). *The chair
  binds them; I will not ratchet a tolerance from one loaded machine's n=1.*
- **J-P1-9 · I REPORTED THE §202 LADDER AS A CORRECTNESS FINDING, NOT ONLY AS A COST.** A repair
  that shrinks fifteen bodies three times and then deletes the same fifteen is not primarily a
  performance problem. *It is named in §7.1 with its evidence and left for a wave that can move
  pixels.*
- **J-P1-10 · thorp's 0.91× IS REPORTED RATHER THAN SMOOTHED.** It is 13 ms on the corpus's
  smallest build and the four other unwalled leaves read 1.01–1.06×. *Reporting the one row that
  moved the wrong way is what makes the other fifteen credible.*

---

## §13 · WHAT W1 (AND THE WAVES BEHIND IT) INHERIT

1. ⭐⭐⭐ **A CORPUS THAT BUILDS 1.62× FASTER WITH A DIGEST EQUAL TO MF-W0's.** Every wave that
   adds a fabric stage now pays a profile with the wall-circuit gate and the un-indexed
   nearest-segment scan removed from it. **Eight waves × 1.62× is the wave's actual product.**
2. ⭐⭐ **`buildFabric.js` AT 733/800 — 67 LINES OF HEADROOM, WAS 9.** W1's substrate can land.
   ⚠ And the two extractions are the pattern for the next one: the `meta` object literal is
   ~270 raw lines of the assembly and is the obvious third extraction when the budget tightens
   again — it needs ~50 locals, which is why I did not take it.
3. ⛔ **THE NEXT BOTTLENECK IS NAMED AND PRICED: `accessLaw.js`, 30.3 %**, six 1,200² grids and
   floods per walled leaf, of which **three rounds free nobody** (§7.1) and are worth a further
   **1.13–1.21×** as a declared shift. ⭐ **Take it as a correctness question first.**
4. ⭐ **A REUSABLE SPATIAL INDEX WITH ITS EXACTNESS ARGUMENT AND ITS PIN.**
   `reservedGround.ringNearestIndex` is not wall-specific; any census asking "nearest segment of
   a ring" can take it, and the equivalence-pin pattern (`exhaustive` exported beside `nearest`)
   is the template §234 asks for.
5. ⭐ **A PER-CENSUS BUDGET SHEET AND A COMPLETENESS LADDER** (§8), with `districtStraddlers`
   already reporting its own status. ⚠ **Every census added from here owes a `complete`/`status`,
   or the ladder rots into decoration.**
6. ⚠ **A NEW SOURCE FILE (`compoundGround.js`) AND A NEW MODULE EDGE (`waterMode → relief`).**
   The executor owes a `sizeBaseline` row; the module graph is pinned acyclic and passes.
7. ⚠ **THE TEST CENSUS MOVED BY EXACTLY 5 TITLES AND 0 FILES.** Five waves of titles are now
   queued behind one landing (b8b + MF-ARCH + MF-ARCH-2 + W0 + this). The ceiling hazard
   compounds and is not mine to spend.
8. ⚠ **`accessCensus`, `circuitPermeability`, `repairAccess` AND `buildGrid` CHANGED SIGNATURE**
   (a required `seeds`). Five test call sites moved with them; **any consumer outside this
   sandbox must move too**, and it will throw rather than degrade.
9. ⭐ **ONE THING THAT HAS CHANGED ABOUT MF-INT1's §4.7 GATE FINDING.** The sandbox suite did not
   finish in 15 minutes inside the app tree, and its likely driver was named as
   `townMapFabricBuildOut.test.js` calling `build(s)` dozens of times at 0.4–3.3 s each. **Those
   builds are now 1.6–2.5× cheaper on every walled leaf.** The lane suite runs 7 files / 178
   tests in **94 s**. That does not make the app-tree gate green — it was never diagnosed — but
   **it removes the largest term from the hypothesis, and the run should be repeated before any
   sharding work is designed for it.**
10. ⚠ **MF-W0's 19 STILL-UNVIEWED MOVED PLATES ARE STILL W1's FIRST ACT.** This lane moved no
    plate and viewed none; the debt is exactly where W0 left it.

---

## §14 · ARTIFACTS

| artifact | what it produces |
|---|---|
| `MFPERF1-sync.sh` | build-out → `laneMFPERF1-tip` (never `--delete`) |
| `MFPERF1-ab.mjs` · `MFPERF1-ab-final.log` | §3.1's same-process A/B |
| `MFPERF1-shas.mjs` · `-shas-{before,after,after2,after3}.json` | §4's byte-identity proof |
| `MFPERF1-det.log` | §4's 10-process determinism |
| `MFPERF1-counts.mjs` · `MFPERF1-counts2.mjs` | §3.2's call counts, before and after |
| `MFPERF1-acount.mjs` | §2.3 / §7.1's grid, flood and repair-round counts |
| `MFPERF1-prof.mjs` · `MFPERF1-profread.mjs` · `MFPERF1-prof-{base,p1,final}/` | §3.3's profiles |
| `MFPERF1-prof-final.log` | the published NEW top of profile |
| `MFPERF1-q6cost.mjs` | §6's refusal, priced |
| `MFPERF1-budget.mjs` · `MFPERF1-budget.log` | §8's per-census runtime + completeness ladder |
| `MFPERF1-size.mjs` | §9's effective-line diff, both trees |
| `MFPERF1-suite.log` | §10's 7 files / 178 tests |
| `MFPERF1-battery.log` | §10's full proof battery (diffable against `MFW0-battery-FINAL.log`) |
| `MFPERF1-plates.mjs` · `mf-proto-out/perf1/` | 32 exemplar SVGs + `manifest.json` |

`laneMFPERF1-tip/` (34 MB) is disposable — it is a copy of `laneMFW0-tip` with build-out synced
over it, and `MFPERF1-sync.sh` rebuilds its sandbox half from `build-out` at any time. The
measurement copy used for §7.1's counterfactual (`laneMFPERF1-probe`, `MAX_ROUNDS = 1`) was
**deleted after its one measurement and never synced anywhere**.
