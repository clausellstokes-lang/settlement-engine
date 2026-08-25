# lane REG-GROW-A — THE GROWTH LEDGER · THE CIRCUIT LAW · THE T2 MINT — RECEIPT

**Seat:** REG-GROW-A (Opus implementer). **Chair:** Fable.
**Base:** `9de7290218d01d0777262787b013c397414834cf` (`refs/preserve/map-sandbox-bridge-rivers`,
the REG-BRIDGE seal). **Worktree:** `$SP/laneGROWA-tree` (detached; no ref moved).
**Charter:** `docs/DESIGN_REG_GROW.md` body + **Amendment A1** (A1 wins every conflict),
ODQ §643, the five panel verdicts (`wf_ee93da7c-511/journal.jsonl`), laneREGT-receipt §2–§4.

## §1 · SETUP PROOF (executed)

```
git worktree add "$SP/laneGROWA-tree" 9de7290218d01d0777262787b013c397414834cf   → EXIT 0
  HEAD is now at 9de729021 "REG-BRIDGE: the river gains a shape, and the decks stop floating"
mkdir -p node_modules && cp -R <repo>/node_modules/seedrandom node_modules/        → seedrandom 3.0.5
node v24.12.0
BASELINE: node harness/exemplars.mjs "$SP/growa-base"  → 18 specimens, 29 artifacts
  (28 SVG + manifest.json), 15.1 s wall.
```

Baseline leaf line (verbatim, the three rows this car is about):

```
town          town        Mahabagh       morph=regularized  parc= 1197 els=  268 prim= 4918
year-018      town        Mahabagh       morph=regularized  parc= 1232 els=  250 prim= 4949
year-100      town        Mahabagh       morph=regularized  parc= 1232 els=  268 prim= 5020
```

## §2 · ⭐⭐⭐ DELIVERABLE 1 — THE ZERO-GROWTH DIAGNOSIS (§6.9), REPORTED BEFORE ANY BUILD

**Probes:** `$SP/growa/diagnose.mjs`, `diag2.mjs`, `diag3.mjs`, all run at the lane base against
the corpus's own driver (`harness/exemplars.buildOne`'s exact call shape).

### §2.1 · THE HEADLINE — AND IT IS STRONGER THAN THE CHARTER'S FRAMING

**CONFIRMED. No stage discards the year. The year is never handed to a stage that could grow
anything** — and the corpus's year-018 ≡ year-100 pair understates the defect. Measured, every
year of the town's whole 191-year life draws the **same 1,232 plots with the same geometry**:

```
present, NO stamps          parcels= 1197 geom=c6967f746104 walls=1
present, WITH stamps y=191  parcels= 1232 geom=9f7f4b73d600 walls=1
year 191 projection+stamps  parcels= 1232 geom=9f7f4b73d600 walls=1
year 154 projection+stamps  parcels= 1232 geom=9f7f4b73d600 walls=1
year 100 projection+stamps  parcels= 1232 geom=9f7f4b73d600 walls=1
year  18 projection+stamps  parcels= 1232 geom=9f7f4b73d600 walls=0
year   0 projection+stamps  parcels= 1232 geom=9f7f4b73d600 walls=0
```

The town **at its founding** is drawn parcel-for-parcel identical to the town at 191 years. The
only thing that moves across the entire life is the wall ring. C3 is not "snapshots show near-zero
growth"; it is **snapshots show exactly zero growth, at every year, by construction.**

### §2.2 · THE MECHANISM, LOCATED EXACTLY — a three-link chain, each link measured

| link | what it does | measured |
|---|---|---|
| 1 · `snapshot.settlementAtYear` (snapshot.js:73–97) | copies the record "at exactly the depth it changes": `history.age`, `history.founding.age`, `history.historicalEvents`. **`population` is not in that set — by declaration** (snapshot.js:23–30, "THE POPULATION IS HELD CONSTANT ACROSS SNAPSHOTS, DECLARED"). | top-level keys that moved at year 18 and year 100: `["history"]` only. `population` 3502 → 3502 IDENTICAL at both. |
| 2 · `tierGrammar.tierScale` (tierGrammar.js:719–806) | the SOLE sizer of everything that grows — `builtRadius`, `extentTier`, `footprint`, `maxNuclei`, `organismBand`, `roofs`. It reads `population`, `tier`, `populationHistory`, `calamityHistory`. **It reads no year at all.** | tierScale digest **`c01baf496667` at year 18, year 100 AND the present** — one value, three years. `builtRadius` 323.7416499630704 at all three. |
| 3 · the growth stages (buildFabric.js:322–467) | `growOrganisms` → `buildPartition` → `buildUmbrella` → `buildStreetWeb` → `packFabric` all size from `scale`, `field`, `sub` — every one year-blind. | organismGeom `d37e6f7641f0`, umbrellaGeom `2a8423934f66`, streetGeom `4f53cda18c2b`, builtInside 4365 cells: **identical at year 18, year 100 and the present.** |

So the discard is not a stage dropping a year it was given. **It is `settlementAtYear`'s key set:
the projection re-issues the EVENT HORIZON and never the SIZE**, and `tierScale` — the one funnel
every growth stage sizes through — has no year input to discard. The panel's S4 m1 read this
correctly from the source; this lane confirms it by execution and sharpens it: the year-0 leaf
proves the defect is total, not partial.

### §2.3 · THE ONLY TWO YEAR-SENSITIVE SURFACES AT HEAD, both measured

1. **The circuit's standing gate** — `wallStandingFor` (wallCircuit.js:284–290) with the
   caller-stamped `options.wallBuiltAtAge`. Measured: walls 0 at years 0 and 18, 1 from year 49.
   This is the whole of the year's reach into geometry.
2. **`marketColonization`** (snapshot.js:184–272) — threshold `presentAge × min(0.95, 0.42 +
   order·0.50)`. Measured on this leaf: threshold **year 128**, so `middleRows = 0` at year 18 AND
   at year 100 AND at the present (the corpus's own note says the rows harden in year 128; the
   fixture's order dial puts them at 128 and the present leaf still measures 0 rows because the
   register is dormant). It fires on no corpus year leaf at all.

### §2.4 · ⚠ A SECOND DEFECT FOUND WHILE DIAGNOSING — the caller-stamp cure kills the epoch ladder

**CONFIRMED, and it is not in any charter.** Stamping the present-day vintage — the §11.11 cure
for the fraction-of-now hazard — **changes the drawing by +35 parcels at the SAME year with the
SAME vintage value**:

```
none                  parcels= 1197 geom=c6967f746104
wallBuiltAtAge only   parcels= 1232 geom=9f7f4b73d600     ← the stamp alone, at year 191
year only             parcels= 1197 geom=c6967f746104     ← not the year
presentAge only       parcels= 1197 geom=c6967f746104     ← not presentAge
```

Root cause, read at the tip: `wallStandingFor` builds the stamped vintage as
`{ ageAtBuild, source }` — **with no `year` field** — while `epochAxis.deriveEpochs` gates on
`dated = vintage.ageAtBuild && vintage.year` (epochAxis.js:181). A stamped vintage is therefore
**undated**, so the ladder takes the `!dated` branch: ONE circuit at today's outermost extent
instead of the derived candidate ladder. Consequences: (a) every snapshot leaf in the corpus is
drawn against a collapsed epoch ladder that the present leaf does not use, so a year leaf is not
comparable to the present leaf even at the same year; (b) `settlementAtYear(s, presentAge)`
returns `s` by identity (snapshot.js:77) while `exemplars.buildOne` still stamps — the ladder has
a discontinuity **at its own top**.

⭐ The car's seam conversion removes the class outright: under A1.5 `deriveEpochs` reads the
ledger's dated circuit events, so there is no fraction-of-now to stamp around and no
shape-dependent `dated` gate.

### §2.5 · WHAT THE KERNEL MUST CURE — the mechanism, not the symptom

The cure named by A1.1 attacks link 2, which is the only link that can be attacked without
breaking the single-shot pipeline: **give the frame its own population.** A frame at epoch K is
the same single-shot pipeline run on a record whose `population` is the ledger's population at K
and whose `tier` carries the peak-so-far — so `tierScale` sizes the frame, every growth stage
follows it for free, and no stage is edited. The circuit law then freezes what the growth would
otherwise re-derive.


### §2.6 · ⛔⛔ THE FINDING THAT REACHES THE CHARTER — C1's EVIDENCE IS MEASURING TWO CIRCUITS

**CONFIRMED, verbatim from `epochAxis`' own published reason, on the corpus's own two leaves:**

```
town       extents= [{"i":0,"w":false,"x":0.5645},{"i":1,"w":true, "x":0.7983},{"i":2,"w":false,"x":1}]
           reason= 1 circuit(s), a SUBSET of 3 fabric epoch(s), from the town+ thresholds this
                   settlement passed (0.798 of today's extent; circuit cap 1 at town)
year-100   extents= [{"i":0,"w":false,"x":0.5645},{"i":1,"w":false,"x":0.7983},{"i":2,"w":true, "x":1}]
           reason= vintage unknown — ONE circuit on today's fabric, understated rather than
                   invented; the fabric carries 3 epoch(s) regardless (G-42)
```

Same settlement, same seed, same population, same vintage year 49 — and **the year-100 leaf's
circuit sits at extent 1.000 while the present leaf's sits at 0.798.** Measured enclosed area:
**429,937 vs 307,120 view units² — the year leaf's wall is 1.40× the present leaf's.**

The cause is §2.4's defect: `wallStandingFor`'s stamped vintage has no `year` field, so
`deriveEpochs` reads it as UNDATED and takes the "ONE circuit on today's fabric" branch.

⭐⭐ **THE CONSEQUENCE FOR THE MINT'S CONVICTION C1.** C1 reads *"intramural holdings FALL
1,414→883 between year 100 and the present while the suburb rises 64→536"* and cites it as
evidence the engine grows OUTWARD past a **standing** circuit. Re-measured at this lane's base
(dormant options, LOD-corrected, same predicate): **intramural 1,647→955, suburb 71→688** — the
same shape, and the same cause. But the circuit is **not standing** between those two leaves: it
shrinks by 20 % in radius and 29 % in enclosed area. A body count taken across two different
circuits is REG-4's own arm-1 finding — *"a monotone body count measured across four different
circuits is not a differential; it is four settlements"* — arriving on arm 2, where REG-4
believed the circuit was held fixed.

⚠ THIS DOES NOT REFUTE C1's DIRECTION. The present leaf genuinely draws 39 % of its urban growth
outside its circuit (measured below), which is a real fact about the fabric. What it refutes is
the **magnitude**: the 1,414→883 fall may not be cited as a measurement of outward growth,
because most of it is the ladder collapsing. **This is a chair decision** — C1's evidence row
needs re-basing on one circuit, and the natural instrument is the ledger (one dated circuit,
frozen, read by both leaves).

### §2.7 · THE CORPUS'S OWN SPLIT, MEASURED (the calibration target the tuning constants use)

`$SP/growa/measure-split.mjs`, 12 walled leaves at the base seal, LOD-corrected:

| leaf | tier | pop | intramural | extramural | extramural share | square ÷ enclosed |
|---|---|---|---|---|---|---|
| town | town | 3,502 | 955 | 688 | 0.419 | 0.0172 |
| town-2 | town | 2,497 | 1,152 | 601 | 0.343 | 0.0176 |
| polycentric | town | 3,334 | 865 | 759 | 0.467 | 0.0172 |
| crossing | town | 3,502 | 986 | 644 | 0.395 | 0.0146 |
| city | city | 20,091 | 1,837 | 760 | 0.293 | 0.0309 |
| metropolis | metropolis | 71,325 | 3,466 | 468 | 0.119 | 0.0205 |
| highwater | town | 3,502 | 1,488 | 55 | 0.036 | 0.0268 |
| year-100 | town | 3,502 | 1,647 | 71 | 0.041 | 0.0123 |

Extramural share: min 0.036 · **median 0.369** · max 0.467. Square share of enclosed area:
min 0.0123 · **median 0.0172** · max 0.0309. ⚠ The `highwater` and `year-100` rows are the
§2.6 artifact, not small suburbs.

## §3 · WHAT LANDED BEFORE THE STOP — TIP `51684eb9e5fee931667ac92b26ec84c4a7c7dfd7`

**⛔ CHAIR ORDER RECEIVED MID-FLIGHT: owner's full stop (§654). The lane stood down at a clean
checkpoint. The wiring act was NOT started.**

### §3.1 · WORKTREE STATE — COMMITTED, CLEAN, DORMANT

```
worktree : $SP/laneGROWA-tree (detached; NO ref moved)
base     : 9de7290218d01d0777262787b013c397414834cf  (refs/preserve/map-sandbox-bridge-rivers)
TIP      : 51684eb9e5fee931667ac92b26ec84c4a7c7dfd7  ← one WIP commit
git status at the tip: clean apart from `?? node_modules/` (the copied seedrandom, never staged)
```

Three files in the commit, staged by name (never `git add -A`):

| file | state | what |
|---|---|---|
| `src/domain/townMap/fabric/growthAnnotation.js` | **NEW** | A6.1's schema verbatim + transient channel + obligation + totality walker + reclamation reservation census |
| `src/domain/townMap/fabric/growthLedger.js` | **NEW** | the ledger pre-stage: trajectory · banding · circuit law · emission · quarter mints · truncation · frame projection · three seam readers · faubourg verifier · reserved LossRegion channel |
| `src/domain/townMap/fabric/stageManifest.js` | **M** | both modules assigned to S0; the S5>S0 refusal recorded in the row |

### §3.2 · MEASURED AT THE COMMITTED TIP (executed after the last edit, not before)

```
DORMANCY   node harness/exemplars.mjs "$SP/growa-tip"  → EXIT 0, 29 artifacts
           diff -r "$SP/growa-base" "$SP/growa-tip"    → IDENTICAL (29/29 byte-for-byte)
WALKER     node "$SP/reg5/deriveManifest.mjs" --wt=<lane tree>   (lifted; no vitest needed)
           ARM 1 assignment: onDisk 63 · declared 63 · UNASSIGNED 0 [] · phantom 0 []
           ARM 2/3/4 nodes with drift: 0
           ARM 5 NODE_EDGES: real 89 · declared 89 · ADD [] · DROP []
           ARM 6 backward edges AGREE  (["S13>S6","S6>S2"], no third inversion)
           ARM 7 "DISAGREE" — ⚠ PRE-EXISTING, EARNED NOT ASSUMED: the identical line prints at
                 the BASE seal in laneBRIDGE-tree with 61 modules and no edit of mine. It is the
                 lifted script's array-of-arrays vs array-of-objects comparison, not drift.
LEDGER LAW assertTrajectoryLaw + assertCircuitLaw + assertLossRegionsReserved over all 18
           corpus leaves → ZERO violations. 17/18 MONOTONE; only `highwater` (the declared
           demotion fixture) takes a decline shape — A1.2's "no fabricated famines" behaving.
           Bands 8–36 per leaf, all inside BAND_CEILING 40 (metropolis 36).
```

⚠ **NOT RUN, and named rather than implied:** the vitest suites (the lane tree has only
`seedrandom`, not the 435-package link set — the REG-5 method was not spent because the stop
arrived first), `tests/lint/derivationGraph.walker.test.js` (no fork key was minted, so no bill
is expected, but it is UNVERIFIED), the REG-4 differential under an armed kernel, and every
E1–E8 exit. No exit is claimed.

### §3.3 · TUNING CONSTANTS — PROPOSED, WITH THE MEASUREMENT THAT SET EACH

| constant | proposed | basis |
|---|---|---|
| `RISE_EXPONENT` | **1.0** | exactly `compile.deriveWallVintage`'s own arithmetic, so the trajectory is precedented at the seal rather than newly asserted. Any other value would be this lane minting a historical claim under a tuning constant's cover. |
| `SEVERITY_WEIGHT` | minor 1 · major 2 · catastrophic 3 | REG-T §3's pre-registered weights, reused unchanged so the two instruments cannot disagree about one record |
| `BAND_MAX_EXTENT_FRACTION` | **0.08** | the split cap; measured band counts 8–36 across the corpus, all inside the ceiling |
| `BAND_CEILING` | **40** | §5's envelope, as a hard cap so ledger size is bounded by construction |
| `SATURATION` | **1.00** | §161m.1's circuit economy raises the wall ON the fabric, so a ring has **zero** geometric headroom at its raise epoch by construction — measured share 1.000 at the raise on every walled leaf. A lower value would date the emission before the wall. |
| `SQUARE_CAPACITY_EXCLUSION` | **0.02** | measured median over 12 walled leaves (§2.7). ⚠ The first spelling was **0.06 — a guess, three times the measurement.** Corrected in the open. |
| `EXTRAMURAL_SHARE` | **0.40** | reproduces the corpus median 0.369. ⚠ The per-tier solution is **town 0.56 · city 0.40 · metropolis 0.19** — the constant is TIER-VARYING and the spread is reported, not averaged away. A tier table is NOT minted: measuring three numbers does not license choosing three. |

All seven ride the chair's signature and the owner's tuning-pass re-signature (§110.3's **second**
declared shift, which A1.6 requires be declared at signature time and never silently).

## §4 · JUDGMENT ROWS (vetoable)

| id | call | why |
|---|---|---|
| **J-GROWA-1** | The kernel is TWO new S0 modules, not machinery folded into an existing file. | J-REG5-8's lesson says a new module costs registration tax and the cheap answer often coincides with the right one — here it does not. The ledger is a PRE-STAGE consumed by the assembly and EXTENDED by car B; folding it into `snapshot.js` would put the replacement inside the thing it supersedes. **Measured cost: zero.** Both import S0 members only, so `allowedImports` and `NODE_EDGES` are unchanged (89/89, ADD [] DROP []). |
| **J-GROWA-2** | `growthLedger` spells `WALLED_TIERS` and `OUTGROWN_SHARE_LOCAL` locally instead of importing `epochAxis`. | An `epochAxis` import is an **S5>S0 backward edge — a THIRD public-order inversion**, which the manifest refuses at the door. The lawful direction is the opposite one A1.5 already orders: `deriveEpochs` becomes a READER of the ledger over the existing forward edge `S0>S5`. The two constants are pinned equal by test rather than by import. |
| **J-GROWA-3** | The frame projection **drops** `populationHistory` and `calamityHistory`, and returns the record **by identity** at the final epoch. | Both fields are PRESENT-DAY records; a lived world carrying them would hand `deriveHighWater` today's peak at every epoch and the zero-growth defect would walk back in through the one door the projection exists to close. The identity at the final epoch is `settlementAtYear`'s own short-circuit and it guarantees the map is sized from the untouched record — so the trajectory can never move the present-day drawing. |
| **J-GROWA-4** | The frame's peak reaches `tierScale` through the **stored-tier channel** (`tier = tierForPopulation(peakSoFar)`), not through a new peak argument. | `deriveHighWater` stays the SOLE peak deriver (A1.2 / the panel's M3(a)). Channel 1 is exactly *"a stored tier over a derived-tier-scale population — a recorded demotion"*, so a frame after a fall keeps its high-water extent by the sealed law. For the monotone case (17 of 18 leaves) the derived tier equals the stored tier and the peak is **exact**. |
| **J-GROWA-5** | The peak stands on the **eve** of the first loss anchor, not on the anchor year. | `snapshotYears`' own convention (*"every event year AND ITS EVE"*). Without it the peak is never a frame and the fall appears in a band with no anchor inside it — which is exactly what `assertTrajectoryLaw` clause (ii) **convicted on the `highwater` fixture** before the cure. The assertion found the bug; recorded rather than silently patched. |
| **J-GROWA-6** | `SATURATION` is proposed at **1.00**, which makes the dial inert under the current circuit-economy law. | Proposing a free-looking 0.90 would date extramural emission BEFORE the wall was raised. The honest report is that the value is structurally pinned by §161m.1 and only becomes free if the owner changes the circuit-economy law at the tuning pass. |

## §5 · ⭐⭐ RESUME BLOCK — WHERE THE NEXT SESSION PICKS UP, MID-LANE

Resume at tip **`51684eb9e5fee931667ac92b26ec84c4a7c7dfd7`** in `$SP/laneGROWA-tree` (detached).
Re-copy `node_modules/seedrandom` if the scratchpad was swept. Baseline render for every
comparison: `$SP/growa-base` (29 artifacts). Probes already written and re-runnable:
`$SP/growa/diagnose.mjs` · `diag2.mjs` · `diag3.mjs` · `probe-ledger.mjs` · `probe-ring.mjs` ·
`measure-split.mjs` — each takes the worktree path as argv[2].

**THE NEXT ACT, in order, with the exact seams:**

1. **Wire the pre-stage, flag-gated.** `src/domain/townMap/fabric/buildFabric.js` — import
   `buildGrowthLedger`/`ledgerFinalState` and compute the ledger immediately after
   `const record = compileSpatialRecord(...)` (line ~175), guarded by
   `options.growReplay === true`. ⚠ Name the **buildFabric option** `growReplay`, not only the
   env var: `REG_FABRIC_OPTS` is a harness pattern that gates instruments, not app callers
   (the panel's m5).
2. **The `deriveEpochs` reader (A1.5).** `epochAxis.js` — add `'ledger'` to `EPOCH_INPUTS` and,
   when present, take the boundaries from `ledgerEpochBoundaries(ledger, builtRadius, cap)`
   instead of the `thresholdRadius(t)/now` shares. ⛔⛔ **THE CRITICAL CONSTRAINT, ALREADY
   RESEARCHED:** `WALL_CIRCUIT_INPUTS` is a FROZEN list and `inputsText` writes `k=∅` for every
   key, so **adding a `ledger` key to `circuitInputsFrom` would move every leaf's `inputsHash`
   with the feature DORMANT.** The ledger must ride the EXISTING `epochExtents` key's VALUE
   (it is literally `epochLadder(a).extents`) — the same widen-the-value-never-add-a-key move
   §577's escarpment and §590's band regime both made, recorded at their sites in
   `wallCircuit.js:150-215`. Pass `ledger` through `wallHandles` (the un-hashed `raw` handles),
   never through `inputs`.
3. **The §18.4 consumer + the peaks read.** `buildFabric.js:1065` `marketColonization` gains the
   ledger clock via `colonizationFromLedger`; `metaSoFar.populationPeaks` (line 1053) and
   `compile.js`'s `population-peaks` row read `peaksFromLedger`.
4. **The cartouche needs NO edit.** `harness/renderFolio.mjs:3027` prints `m.population`, which is
   `fabric.meta.population` ← `s.population` — so the frame projection supplies the frame's souls
   automatically. **Verify this rather than assume it**; it is C3's user-visible exit and it is
   the reason the projection was designed as a record projection.
5. **Then the exits.** E4 dormancy first (the 29/29 diff is already the control), then E3
   determinism, then E1 — and E1 needs an arming route into `harness/laneREG4/densification.mjs`,
   which calls `buildFabric` with explicit options and so **bypasses `REG_FABRIC_OPTS`**. The
   minimal additive cure is to merge `REG_FABRIC_OPTS` into that instrument's two option bags
   (`buildAt`'s and arm 2's `buildOne`), inert when unset — the REG-3 convention. That is an edit
   to a preserved instrument and is a chair call.
6. **Deferred deliberately, documented, not a bug to re-find:** the geometric emission of typed
   faubourgs (the ledger stamps the ACTS; wiring them into `habitation.buildFaubourgs` so
   `deriveFaubourgOrigins` can verify against real districts is unstarted), the totality walker's
   wiring to a real drawn roster (the walker exists and is unit-testable; nothing calls it on a
   leaf yet), and every test file (none added — so no three-ratchet delta has been incurred, and
   the first added test file will owe **three** censuses).

**⚠ THE OPEN QUESTION THE CHAIR SHOULD RULE BEFORE THE WIRING RESUMES** is §2.6: C1's evidence
row is measuring two different circuits, so the mint's headline magnitude for outward growth is
not supported by the instrument that produced it. The kernel's frozen-circuit law is the natural
re-basing instrument, but whether C1's row is amended, and whether the stamped-vintage ladder
collapse (§2.4) is cured as a bug in its own right or only superseded by the ledger, are both
chair decisions this lane did not take.
