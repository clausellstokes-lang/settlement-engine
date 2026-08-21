# Lane MF-CB1 · **THE COUNTERFACTUAL CAUSAL BENCHMARK (G-43), PULLED FORWARD** (ODQ §304.3; chartered §275.2 / §276.1b; contract §287.8; SPEC §4.1d G-43 + §10.14): receipt

**Lane MF-CB1 (Opus 5), 2026-08-21.** Predecessor: `laneMFD1-receipt.md` (the sealed foundations).
⛔ **THE REPO WAS READ-ONLY IN EVERY SENSE.** No git write, no repo gate, no repo test run, no
repo file edit — not even a spec touch. The only repo access was reading
`docs/OWNER_DECISION_QUEUE.md` and `map-corpus/docs/GENERATION-SPEC.md`.
**Working tree:** `<scratchpad>/laneMFCB1-tip` (copied from `laneMFD1-tip`; own hardlinked
`node_modules` from `rs4/`, per MF-D0 §11).
⛔ `laneMFD1-tip`, `laneMFD0-tip`, `laneMFW3F-*` and `mf-proto/build-out` were never written to —
verified by `diff -rq` (D1's `src`/`tests`/`harness` are byte-identical to mine except the five
files §9 lists) and by an mtime sweep. ⚠ `laneMFW3F-tip` **did** move under me while I worked; that
is the concurrent W3F lane, and I neither read from nor wrote to it.

---

## §0 · THE VERDICT, STATED FIRST

> ⭐⭐⭐ **G-43 IS BUILT, PRE-REGISTERED AND RUN. SEVEN ARMS, 50 REGISTERED DIRECTIONS, 1,054
> MEASURED MOVEMENTS. TWO ARMS PASS, FOUR REPORT MISWIRED, ONE FIRES THE HARD RED.** Suite
> **286 → 321**, `TRUE_EXIT=0`. Plate bytes moved: **0 of 170 keys on 17 leaves**, key-by-key,
> zero added and zero removed. The instrument sits in the manifest's `FOUNDATIONS` node, so
> "read-side only" is an edge-set fact and not a promise.

> ⭐⭐⭐ **THE HARNESS PROVED ITSELF BEFORE IT JUDGED ANYTHING, AND THE PROOF IS THE STRONGEST
> SHAPE THIS INSTRUMENT CAN TAKE: ARM B'S MUTATED LEAF CAME BACK IDENTICAL TO A LEAF IT NEVER
> SAW.** The `crossing` exemplar differs from the `town` exemplar by exactly one dossier word.
> Withdraw that word inside the counterfactual and the result is **409 of 409 components identical
> to the independently built `town` leaf** — the same plate SHA, the same wall ring, the same
> 1,022 parcels. A counterfactual with an answer key, and it hit it.

> ⛔⛔ **THE HARD RED IS REAL AND IT IS THE WAVE'S MAIN FINDING: A 40% POPULATION CUT CONTRACTS THE
> BUILT EXTENT, BECAUSE THE HIGH-WATER LAW IS UNREACHABLE ON EVERY DOSSIER THE PRODUCT
> GENERATES.** `A ∩ F` = `{meta.builtRadius, meta.highWater.population, wall#0.area, wall#0.band,
> wall#0.perimeter}`. §276.1b's own clause is *"the wall must NOT contract"*, and the extent fell
> 309.3 → 294.0 view units. **The law is not broken — it is starved.** `deriveHighWater` has three
> evidence channels (a stored tier above the derived one, `populationHistory`, `calamityHistory`)
> and **sixteen of the seventeen corpus leaves carry NONE of them.** The declared control isolates
> it exactly: run the same cut on `highwater`, whose stored tier *is* above its derived tier, and
> the high water holds at 8,001, the extent tier holds at `city`, and `builtRadius` holds to the
> last decimal.

> ⛔⛔ **AND THE SECOND ENGINE FINDING IS SHARPER STILL, BECAUSE IT IS A TOTAL ABSENCE: SHIFTING
> THE WALL'S CONSTRUCTION DATE BY 142 YEARS MOVES ZERO WALL GEOMETRY.** Arm D doubled the
> settlement's age; the derived vintage moved 142 → 284 and the age-at-build 49 → 98, and the ring
> came back **byte-identical** — same polygon SHA `a47982dfbe89`, same epoch extents
> `[0.591, 0.836, 1]`, same perimeter to six decimals. The whole leaf moved **7 components**, of
> which two are the vintage numbers themselves and three are the plate. **The wall's date is a
> printed number with no consequence in the drawing.**

> ⛔ **THIRD: A CATHEDRAL ADDED TO A TOWN'S DOSSIER REACHES THE MAP BUT RESERVES NO GROUND.** It
> is drawn (91 → 92 landmarks, worship 4 → 5) and it is **not monumental** and it takes **no
> compound**: §15.3's reservation is an absolute threshold on the body's own drawn size, the
> cathedral measures 12.60 and the floor at this leaf is 15.37. §15.3's celebrated claim — *"real
> cathedral closes interrupt their street grids"* — is not reachable by putting a cathedral in the
> dossier of a 3,502-soul town.

> ⭐⭐ **THREE OF §276.1b's SEVEN ARMS CANNOT BE RUN AS WRITTEN, AND THAT LIST IS ITSELF A
> DELIVERABLE.** The dossier has **no resource LOCATION**, **no wall CONSTRUCTION DATE** and **no
> institution FOUNDING YEAR**. Each arm ran the nearest executable mutation and DECLARED the
> substitution in its own registration before the run; a pin refuses any of the three that stops
> declaring it. §7 RAISED-1 carries the three missing surfaces as a build request.

> ⚠⚠ **TWO OF THE FOUR MISWIRED VERDICTS ARE THE INSTRUMENT'S FAULT, NOT THE ENGINE'S, AND THEY
> ARE REPORTED AS SUCH RATHER THAN QUIETLY RE-REGISTERED.** Arm A lost two tokens to badly chosen
> components (`reliefField.cragShare` is a NORMALIZED share, invariant to the amplitude change the
> mutation makes; `resourceCoherence.status` is a status word, not a verdict) — while the arm's
> SUBSTANCE passed: the extraction site moved 566 units across the leaf, from (265.6, 630.2) to
> (546.9, 119.8), and the substrate's rock bias fell 0.28 → 0.12. Arm G lost one token to a
> `VANISH` predicate where `BECOMES:dry` was correct — `deriveWaterMode` returns a relationship
> object with a fourth vocabulary value, never a null relationship. **§4.1d forbids tuning a
> direction away after inspection, so nothing was re-registered; the corrections are RAISED for
> the chair to adopt at the next wave seal (§7 RAISED-2).**

> ⛔⛔ **AND ONE HAZARD THE HARNESS WALKED INTO AND THEN PINNED: A DOSSIER FACT WITH THREE
> SPELLINGS.** `resolveTerrain` reads `terrainType || terrainOverride || terrain`, and the live
> generator writes the first two. **Writing only `terrainOverride` — the field the exemplar
> harness itself passes in — is a SILENT NO-OP: 0 of 409 components move and the counterfactual
> reports a perfectly clean "nothing happened".** Measured as CONTROL 4. A benchmark that had
> written that one field would have published a false negative with a straight face.

---

## §1 · THE BASELINE, RE-MEASURED AT MY OWN TREE BEFORE ANY EDIT

⭐ ODQ Law L3: every figure below traces to a self-named captured log in the scratchpad.

| figure | measured at `laneMFCB1-tip` before any edit | log | status |
|---|---|---|---|
| suite | **13 files / 286 tests passed**, `TRUE_EXIT=0` | `laneMFCB1-baseline-suite.log` | ⭐ CONFIRMED — matches MF-D1 §10 exactly |
| tree provenance | `src`/`tests` `diff -rq` identical to `laneMFD1-tip` at copy time | (inline, §9) | ⭐ CONFIRMED |
| plate SHAs | 17 leaves × {parchment, darkFantasy, both primitive counts, tier, rings, epochs, runs, demoted, ceiling} = **170 keys** | `laneMFD1-shas-TIP.json` (inherited base) | ⭐ CONFIRMED |

---

## §2 · ⭐⭐⭐ DELIVERABLE 1 — THE TYPED TOKEN REGISTRY (§287.8)

`fabric/counterfactualTokens.js` (481 lines) + `fabric/counterfactualObservation.js` (262 lines).

### §2.1 · THE ONE STRUCTURAL RULE: `E ∩ F = ∅` IS PROVED BY THE CONSTRUCTOR

§10.14 says the benchmark *"must prove `E ∩ F = ∅` before it runs"*. Here that is not a step a
harness may forget — **a registration whose expected and forbidden sets intersect cannot be
constructed**, so it can never reach a run. That is `spatialReceipt.js`'s law (MF-D1 §7) applied
one seam over: make the illegal state unrepresentable rather than forbidden.

The intersection is **by identity**, exactly as §10.14 requires — *"token identity ignores the
predicate/tolerance suffix"* — so an `INCREASE`/`ABS:1` expectation and a `REL:0.5` prohibition
over one component are still one component and still a contradiction. Pinned both ways.

### §2.2 · WHAT ELSE THE REGISTRY REFUSES, AND WHY EACH REFUSAL EARNS ITS PLACE

| refused | reason |
|---|---|
| an unknown direction predicate or tolerance | a closed registry is what makes "every direction REGISTERED" checkable rather than a habit |
| a predicate/tolerance argument mismatch (`BECOMES` with no argument, `INCREASE:7`) | a grade that parses two ways grades nothing |
| a token with no `why` | ⭐ **a direction without an argument is a guess that has been written down.** Every one of the battery's 50 expected and 90 forbidden tokens carries its source-quoted reason, and a pin holds each to >20 characters |
| a FORBIDDEN token carrying a direction | the only legal claim about a forbidden component is that it held |
| a duplicate identity inside E or F | it would weight one component twice in every fraction |
| an arm with an empty E | an arm with no expectation cannot fail |
| ⭐⭐ an arm with **no FIRING set** | MF-D1 §15's class, applied where it bites hardest — see §2.4 |
| an unknown zero-denominator policy | §10.14: *"declared per benchmark before execution; it may not be improvised after the result"* |

### §2.3 · THE ALGEBRA IS §10.14's, SYMBOL FOR SYMBOL

```
A   observed tokens whose values moved BEYOND their registered tolerance
M   members of E whose directional predicate PASSED
D   changed expected tokens whose directional predicate FAILED
F   forbidden component tokens

DirectionalResponsiveness = |M| / |E|     CausalPrecision           = |M| / |A|
CollateralShare           = |A \ E| / |A| DirectionalViolationShare = |D| / |A ∩ E|
hard safety = A ∩ F = ∅   — a hard RED independent of any average score
```

Three of §10.14's finer clauses are implemented and pinned rather than paraphrased:

1. *"A correct-direction change below tolerance is not counted in `A` or `M`."* — the tolerance
   gate runs before the predicate is ever asked. Pinned with an `ABS:5` token moved by 2.
2. *"A wrong-direction change is counted in `A` and `D`, not `M`."* — pinned on real geometry.
3. *"Thus collateral is not merely the complement of precision."* — the pin asserts
   `CollateralShare ≠ 1 − CausalPrecision` on a hand-built case (3/5 against 1 − 1/5).

⭐ **THE DOMAIN IS THE UNION OF BOTH OBSERVATIONS' KEYS**, so a component that APPEARS or VANISHES
is countable. A domain taken from the base alone would have been structurally blind to exactly the
movements arms F and G are about.

⭐ **ZERO DENOMINATORS REPORT `null`, NEVER 1.** A 1.00 from an empty set is the single most
flattering lie this instrument could tell, and the policy is named `NULL_NEVER_ONE` in a closed
registry that every arm cites.

⭐ **THE AGGREGATE PUBLISHES BOTH A POOLED FIGURE AND A MEAN OF ARMS**, because averaging per-arm
fractions weights a five-token arm equally with a ten-token one while pooling weights a
206-movement arm equally with a 7-movement one. Neither can be quoted alone; the pin proves they
differ (0.25 against 0.50 on a two-arm example).

### §2.4 · ⭐⭐ THE FIRING SET — MF-D1's OWN LESSON, APPLIED WHERE IT BITES

MF-D1 §15: *"an instrument that reports zero must first report that it fired."* A counterfactual
is precisely that shape — **"nothing moved" is both the interesting result and the way a broken
mutation looks.** So every registration names `firing` tokens that MUST move for the mutation to
have taken at all, and the harness computes them BEFORE any fraction. A failure there reports
`NOT_FIRED`, never `MISWIRED`.

⛔ **AND IT IS NOT HYPOTHETICAL: CONTROL 4 IS A REAL SILENT NO-OP** (§5.4). Without a firing set,
that arm would have reported |A| = 0, `CausalPrecision = null` and a clean forbidden set — and a
reader would have concluded that removing a river changes nothing.

### §2.5 · THE OBSERVATION ROSTER — what an "exact component path" is allowed to name

A path is only exact if something can refuse a path that does not exist. `observeFabric` publishes
a **closed, scalar-only** surface — **409 graded components on the `town` leaf across 10 entities**
(`leaf`, `counts`, `wall#0`, `water`, `resourceSite#0`, `nucleus#0`, `nucleus#1`, `landmarks`,
`parcels`, `plate`) — and `evaluateCounterfactual` reports any registered token outside it as
`outOfRoster` rather than silently scoring it "did not move". Pinned with a planted bad path.

⭐⭐ **TWO ROSTERS, AND ONLY ONE IS GRADED.** `structural` carries facts; `prose` carries the
derivations' own sentences (52 rows on the `town` leaf). Prose deltas are REPORTED beside every arm
— a changed reason string means a different branch was taken — but they are NOT graded, because a
reason sentence RESTATES numbers that are already tokens, and grading both would count one movement
twice and quietly halve `CausalPrecision` on every arm.

⭐ **AN ABSENT ENTITY IS STILL ADDRESSABLE.** A dry leaf publishes `water::*` as `null`, because an
arm that removes the water needs something to point a `VANISH` at. Pinned.

---

## §3 · ⭐⭐⭐ DELIVERABLE 2 — THE SEVEN PRE-REGISTERED ARMS (§276.1b)

`fabric/counterfactualBattery.js` (423 lines). **50 expected tokens, 90 forbidden tokens, 7 firing
tokens — counted, not estimated — every one carrying its source-quoted argument.**

### §3.1 · THE PRE-REGISTRATION IS MECHANICAL, NOT A PROMISE

The runner **logs the SHA-256 of all three registry modules before the first build and re-reads
them at exit**, and exits non-zero rather than reporting if either moved. Final run:

```
counterfactualTokens.js      b039f254fdf4694b308454810a8413d731ec3c827fba482e788caef0c3349e9e
counterfactualObservation.js e921e33e04fa0744292313c84c38ce3b773824af08dc043c961455c89c400037
counterfactualBattery.js     63b0d6287c903f154469e42bae4c355982961331404c03d20c9e71155a78dcf6
```

⚠⚠ **THE REGISTRATION FILE WAS EDITED TWICE AFTER THE FIRST RUN AND THE EDITS WERE PROSE ONLY —
STATED PLAINLY BECAUSE IT IS EXACTLY THE THING A PRE-REGISTRATION EXISTS TO MAKE CHECKABLE.** Two
forbidden tokens (`E`'s `meta.settlementAge`, `F`'s `meta.waterMode`) carried reasons shorter than
the pin's 20-character floor. No direction, no tolerance, no token identity, no leaf and no
mutation changed. **The whole battery was re-run end to end and `diff` reports the two logs
IDENTICAL apart from the sha lines** (`laneMFCB1-battery-run1.log` against `laneMFCB1-battery.log`).
The figures in this receipt are the shipped file's.

### §3.2 · THE BATTERY, ARM BY ARM

| arm | leaf | dossier fact mutated | mutation |
|---|---|---|---|
| **A** | `town` | `resourceAnalysis.availableResources` | `'gems' → 'salt'` — the one word the ground recognises |
| **B** | `crossing` | `config.tradeRouteAccess` | `'crossroads' → 'road'` — §273.6's minting fact, withdrawn |
| **C** | `town` | `history.founding.kind` | `'military' → 'organic'` |
| **D** | `town` | `history.founding.age` | `191 → 382` years |
| **E** | `town` | `population` | `3502 → 2101` (−40%) |
| **F** | `town` | `institutions` | append one cathedral |
| **G** | `town` | `config.terrainType` (+ its two aliases) | `'riverside' → 'plains'` |

⛔ **THE THREE DECLARED SUBSTITUTIONS.** §276.1b's arms (a), (d) and (f) name dossier surfaces that
do not exist. Each registration declares the substitution in its own `notes`, and a pin refuses any
of the three that stops declaring it:

- **(a) "move the resource SITE"** — there is no resource LOCATION anywhere in the dossier.
  `resourceAnalysis.availableResources` is a list of WORDS; `substrate.siteResources` derives an
  (x, y) from the ground plus a hash of the word. The nearest executable mutation changes the
  resource KIND, which relocates the extraction ground by changing the contract it must satisfy.
- **(d) "shift the WALL YEAR"** — no wall-construction event or date exists;
  `compile.deriveWallVintage` says so in terms and derives the vintage from the founding age. The
  only dossier lever on the wall's date is the settlement's age.
- **(f) "add a monument AT YEAR N"** — an institution record carries a category, a name, a
  catalogId and tags, and **no date**. `snapshot.settlementAtYear` re-dates the event log and the
  founding age and passes the institution roster through untouched.

⭐⭐ **ARM D's CEILING WAS REGISTERED AS A PREDICTION, NOT DISCOVERED AS AN EXCUSE.** Its notes
state, before the run: *"`ageAtBuild = age × (TOWN_FLOOR ÷ peak)` scales LINEARLY with age, so
doubling the age leaves the FRACTION of the settlement's life at which the wall was built exactly
where it was. If the circuit geometry is a function of that fraction, the three geometry tokens
will not move and the arm will report MISWIRED."* It did. §4.4 is the trace.

---

## §4 · ⭐⭐⭐ THE FIRST RUN — RESULTS, HONESTLY

`laneMFCB1-battery.log`, `laneMFCB1-battery.json`, `TRUE_EXIT=0`.

### §4.1 · THE TABLE

| arm | verdict | \|E\| | \|A\| | \|M\| | \|D\| | \|A∩F\| | collateral | DirResp | Precision | Collateral | DirViol |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **A** move the resource site | ⛔ MISWIRED | 8 | 189 | 6 | 0 | 0 | 183 | 0.750 | 0.032 | 0.968 | 0.000 |
| **B** remove the crossing | ⭐ **PASS** | 9 | 180 | 9 | 0 | 0 | 171 | **1.000** | 0.050 | 0.950 | 0.000 |
| **C** flip founding.kind | ⭐ **PASS** | 5 | 147 | 5 | 0 | 0 | 142 | **1.000** | 0.034 | 0.966 | 0.000 |
| **D** shift the wall year | ⛔ MISWIRED | 6 | 7 | 3 | 0 | 0 | 4 | 0.500 | 0.429 | 0.571 | 0.000 |
| **E** cut population 40% | ⛔⛔ **COLLATERAL** | 7 | 187 | 5 | 0 | **5** | 182 | 0.714 | 0.027 | 0.973 | 0.000 |
| **F** add a monument | ⛔ MISWIRED | 5 | 138 | 4 | 0 | 0 | 134 | 0.800 | 0.029 | 0.971 | 0.000 |
| **G** swap the water mode | ⛔ MISWIRED | 10 | 206 | 9 | **1** | 0 | 196 | 0.900 | 0.044 | 0.951 | 0.100 |
| **POOLED (7 arms)** | **1 hard RED** | **50** | **1054** | **41** | **1** | **5** | **1012** | **0.820** | **0.039** | **0.960** | **0.024** |
| **MEAN OF ARMS** | | | | | | | | **0.809** | **0.092** | **0.907** | **0.014** |

**PASS = 2 · MISWIRED = 4 · COLLATERAL = 1 · NOT_FIRED = 0.** ⭐ Every arm fired cleanly; no
result in this table is a zero from an instrument that did not run.

⚠⚠ **READ `CausalPrecision` AS A MEASUREMENT OF DEPTH, NOT OF SLOPPINESS — AND THAT IS ITSELF THE
BATTERY'S LOUDEST STRUCTURAL FINDING.** Five of the seven arms move 130–210 of ~410 components,
because in this engine **a dossier fact is a GROUND fact**: the resource lifts the substrate's
relief floor and rock bias (§161a), trade access sets the road count and grade the heightfield is
cut to, the founding kind chooses the street grammar, and the terrain is the landform itself. So a
single-fact perturbation genuinely re-derives a third to a half of the leaf. **The map answers to
the dossier emphatically. What it does NOT do is answer LOCALLY** — and the two are different
properties. Arm D is the control that proves the instrument can read a narrow blast radius when
there is one: |A| = 7.

### §4.2 · ⭐⭐⭐ ARM B — THE COUNTERFACTUAL THAT REPRODUCED A LEAF IT NEVER SAW

All nine registered directions held.

```
leaf::meta.waterMode      BECOMES:bankside   "through" → "bankside"   ⭐
water::mode               BECOMES:bankside   "through" → "bankside"   ⭐
leaf::meta.routeCorridors DECREASE           3 → 2                    ⭐
leaf::meta.foodEconomy    BECOMES:tillage    "trade" → "tillage"      ⭐
wall#0::halfRing          APPEAR             false → true             ⭐  the river becomes the fourth wall
wall#0::gates.count       DECREASE           3 → 2                    ⭐  the gate the street crossed by is gone
leaf::meta.streetChannels CHANGE             635 → 640                ⭐
leaf::meta.waterCrossings CHANGE             13 → 19                  ⭐
plate::sha                CHANGE             37e5896a… → bbe4cfe5…    ⭐
```

⭐⭐⭐ **CONTROL 1: the mutated `crossing` leaf is 409 of 409 components IDENTICAL to the
independently built base `town` leaf** — including the plate SHA `bbe4cfe5…`, the wall polygon and
all 1,022 parcels. The two leaves differ in the corpus by exactly this one word, so the arm had a
free answer key and hit it exactly.

### §4.3 · ⛔⛔ ARM E — THE HARD RED, AND THE CONTROL THAT ISOLATES IT

```
E HELD    meta.households   700 → 420      meta.roofs 1127 → 971
          meta.drawnShapes  876 → 762      parcels::total 1022 → 897      plate::sha moved
E FAILED  meta.highWater.deficit  INCREASE   0 → 0          (registered from §276.1b's own clause)
          meta.highWater.demoted  BECOMES:true  false → false

A ∩ F  ⛔⛔ FIVE VIOLATIONS
  leaf::meta.builtRadius          309.32466295073624 → 293.9686419698205   (−5.0%)
  leaf::meta.highWater.population 3502 → 2101
  wall#0::perimeter               2264.266846 → 2302.135386   (+1.7%)
  wall#0::area                    302164.916601 → 309728.469579  (+2.5%)
  wall#0::band                    4.731546658242107 → 4.889833095546328
```

⭐⭐ **THE PRECISE SHAPE MATTERS AND IS NOT WHAT THE CLAUSE ANTICIPATED.** §276.1b says *"the wall
must NOT contract"*. The **extent** contracted (−5.0%) — a true violation of §240.4's dividend —
while the **ring itself did not contract, it WOBBLED LARGER** (+1.7% perimeter, +2.5% area,
centroid moved 285 units). Two different failures wearing one clause: the extent is starved of
evidence, and the circuit is traced against the DRAWN FABRIC rather than against the extent, so it
follows occupancy even when the extent is pinned.

⭐⭐⭐ **CONTROL 2 SEPARATES THEM.** The same −40% cut on `highwater` (stored tier `city` over a
town-scale population — the one corpus leaf with high-water evidence):

```
leaf::meta.highWater.population    8001 → 8001            HELD ⭐
leaf::meta.highWater.evidence.count   1 → 1               HELD ⭐
leaf::meta.extentTier              "city" → "city"        HELD ⭐
leaf::meta.builtRadius             352.2178871096697 → 352.2178871096697   HELD ⭐ to the last decimal
wall#0::perimeter                  2589.524375 → 2610.678197   MOVED ⛔
wall#0::area                       482989.246877 → 483631.070172  MOVED ⛔
```

**So the high-water law is CORRECT and STARVED**, and the ring-follows-occupancy defect is
SEPARATE and survives the control. That separation is pinned in the suite as a law
(`§240.4 / §161f · the high-water law holds the extent WHEN the dossier carries its evidence`),
phrased so it stays green after any cure — **no defect is banked.**

### §4.4 · ⛔⛔ ARM D — THE WALL'S DATE HAS NO GEOMETRIC CONSEQUENCE

```
E HELD    meta.wallVintage.year        142 → 284     meta.wallVintage.ageAtBuild  49 → 98
          plate::sha                   moved
E FAILED  wall#0::vintageRatio  CHANGE  0.8355533850098201 → 0.8355533850098201   (identical)
          wall#0::perimeter     CHANGE  2264.266846 → 2264.266846                 (identical)
          leaf::meta.faubourgBuildings CHANGE  1 → 1                              (identical)
```

`laneMFCB1-trace.log`, measured directly:

```
wall polygon sha  base a47982dfbe89   mutated a47982dfbe89   ⛔ IDENTICAL
epochExtents      base [0.591,0.836,1]  mutated [0.591,0.836,1]  ⛔ IDENTICAL
```

**The entire leaf moved SEVEN components**: the two vintage numbers, `settlementAge`,
`snapshotYear`, and three plate rows. The two prose rows that moved are the vintage's own sentence
and the market-colonization threshold text. The plate's one-primitive change is the marginalia
re-dating (`y19/y87/y155 → y210/y278/y346`), which is lettering, not fabric.

⭐ **AND THE CAUSE IS STRUCTURAL, NOT A BUG IN A LINE:** `ageAtBuild = age × (TOWN_FLOOR ÷ peak)`
is a fixed FRACTION of the settlement's life, set by population alone. **No dossier fact can shift
the wall's vintage RELATIVE to the fabric.** §276.1b's arm 4 is therefore unrunnable as written
today, and §239.3's "pre-wall fabric share and faubourg pattern must move" has no lever.

### §4.5 · ⛔ ARM F — THE CATHEDRAL REACHES THE MAP AND RESERVES NOTHING

```
E HELD    landmarks::total 91 → 92    landmarks::archetype.worship 4 → 5
          counts::landmarks 91 → 92   plate::sha moved
E FAILED  leaf::meta.compoundsReserved  INCREASE  1 → 1
```

Trace (`laneMFCB1-trace.log`):

```
the cathedral as the fabric records it:
  archetype=worship  rung=parish-church  rungSourced=false
  via="name rule temple|church|shrine|cathedr (NOT in the atlas — a derivation)"
  size=12.602552850814815   monumental=FALSE   prominent=false   ring=intramural
compounds base = 1: [{ key: inst.name.fishmonger#0, r: 20.75 }]
compounds mutated = 1: (the same one)
the smallest body that cleared the compound floor at this leaf: size=15.368144481522528
```

⭐⭐ **THE MECHANISM IS DELIBERATE AND THE CONSEQUENCE IS PROBABLY NOT.** `buildFabric` says so in
its own comment: the compound class is *"a THRESHOLD on the institution's OWN drawn size, a fact
about that institution alone"* — never the monumental rank — precisely because a rank reaching
shared geometry broke the §11.0 inertia pin. **The threshold is correct engineering and it is
absolute**, so at town frontage a cathedral does not clear it. Two further observations, reported
without a cure:
- the cathedral is **not even monumental**: eleven bodies out-draw it, ten of them markets and
  merchant guilds, because `prominent` (×1.26) tracks the town's allied faction category and this
  town's power sits with the economy. That is a *coherent* causal story, not obviously a defect.
- `Cathedral` is **not in the atlas**; it reaches `worship` through a name rule and lands on the
  `parish-church` rung.

### §4.6 · ⭐ ARM G — NINE OF TEN, AND THE ONE FAILURE IS MINE

```
E HELD    meta.waterMode BECOMES:dry      "bankside" → "dry"
          meta.bridges VANISH             3 → 0
          meta.waterGates VANISH          2 → 0
          meta.waterCrossings VANISH      19 → 0
          meta.riverDrawnWidth VANISH     16.3 → 0
          meta.landform BECOMES:plains    "riverside" → "plains"
          wall#0::waterGates.count VANISH 2 → 0
          wall#0::halfRing VANISH         true → false    ⭐ the circuit closes when the river goes
          plate::sha CHANGE
E FAILED  water::mode  VANISH   "bankside" → "dry"   ⛔ WRONG DIRECTION (the battery's only D)
```

`fabric.water` on a dry leaf is `{ mode: "dry", kind: null, width: 0, line: null, crossing: null }`
— a relationship object with a **fourth vocabulary value**, never a null relationship. The correct
registration is `BECOMES:dry`, which the sibling `leaf::meta.waterMode` token used and which held.
**This is the instrument's error and it is left standing in the result of record** (§4.1d: *"neither
may be tuned away after inspection"*); the amendment is RAISED.

### §4.7 · ⭐ ARM A — THE SITE MOVED; TWO OF MY EIGHT TOKENS WERE THE WRONG INSTRUMENT

```
E HELD    resourceSite#0::key   BECOMES:salt        "gems" → "salt"
          resourceSite#0::needs BECOMES:flat-pan    "workable-slope" → "flat-pan"
          meta.strainedFacts.joined CHANGE          "ore|relief" → (empty)
          meta.strain DECREASE                      2 → 0
          meta.reliefField.slopeP50 CHANGE          (moved in the 13th decimal)
          plate::sha CHANGE
E FAILED  meta.reliefField.cragShare      CHANGE    0.17274305555555555 → identical
          meta.resourceCoherence.status   CHANGE    "MEASURED" → "MEASURED"
```

The substance passed, measured directly:

```
base    resourceSites: gems / workable-slope at (265.625, 630.2083)  fit 0.807
mutated resourceSites: salt / flat-pan       at (546.875, 119.7917)  fit 0.983
                                             ⇒ 566 view units, right across the leaf
base    substrate shape: relief 0.30  wetBias 0.14  rockBias 0.28
mutated substrate shape: relief 0.26  wetBias 0.22  rockBias 0.12
```

Both failures are the instrument's: `reliefField.cragShare` / `steepShare` / `flatShare` are shares
of a NORMALIZED slope distribution and are invariant to the amplitude change the resource contract
makes; `resourceCoherence.status` is the string `"MEASURED"` on every leaf — the verdict is
`.coherent`, which is the component the token should have named.

---

## §5 · THE DECLARED CONTROLS

| control | what it establishes | result |
|---|---|---|
| **0** the unmutated harness path vs the corpus's own `buildOne` | the arms measure the RIGHT base | ⭐ `town` 409/409 and `crossing` 407/407 IDENTICAL; the runner exits 3 rather than reporting if not |
| **1** arm B's mutated leaf vs the base `town` leaf | a counterfactual with an independent answer key | ⭐⭐⭐ 409/409 IDENTICAL |
| **2** arm E's cut on `highwater` | isolates "law starved" from "law broken" | ⭐ extent HELD; ring still moved (§4.3) |
| **3** arm F's cathedral on the year-18 snapshot | the DATED half of §276.1b arm 6 | ⛔ landmarks 91 → 92 **on the year-18 leaf too** — an institution carries no date, so a monument "added at year N" stands on every earlier leaf |
| **4** the terrain swap written ONLY to `config.terrainOverride` | the alias trap | ⛔⛔ **0 of 409 components move — SILENT NO-OP** |

⭐ **CONTROL 4 IS THE ONE A FUTURE LANE MUST NOT LOSE.** `domain/resolveTerrain.js` resolves
`terrainType || terrainOverride || terrain`, and `harness/exemplars.mjs` itself passes
`terrainOverride` into the pipeline. A counterfactual that wrote the field the harness writes would
have measured nothing and reported a clean result.

---

## §6 · THE PINS — 35 ARMS, AND THREE OF THEM PLANT FAILURES ON REAL GEOMETRY

`tests/domain/townMapCounterfactualBenchmark.test.js`, **+35 tests**, all green.

| group | arms | what it proves |
|---|---|---|
| the registry refuses | 9 | §2.2's table, including `E ∩ F = ∅` at construction, by identity, both ways |
| the algebra is §10.14's | 6 | the four fractions on hand-built cardinalities; below-tolerance ≠ moved; collateral ≠ 1 − precision; union domain; `null` on a zero denominator; pooled ≠ mean-of-arms |
| ⭐⭐⭐ **the harness convicts** | 5 | see below |
| the observation roster | 6 | scalar-only; identity spelling agrees with `tokenIdentity`; structural ⊥ prose; **every declared structural string path exists on a real fabric (a RENAME REDS)**; an absent entity is still addressable; a plate never rendered is `null` |
| the battery's shape | 6 | seven arms in §276.1b's order; every `E ∩ F = ∅` re-asserted; every token carries a >20-char reason; every `dossierPath` starts `settlement.`; the three substitutions DECLARE themselves; **every `apply` is a pure dossier edit that mutates nothing** |
| the FOUNDATIONS assignment | 1 | all three modules on the node whose outbound edge set the manifest walker refuses to grow |
| ⭐⭐ the high-water law | 1 | with evidence present, a −40% cut holds `builtRadius`, `extentTier` and the high water — the positive control, pinned as a LAW so it survives a cure |

**THE FIVE CONVICTION ARMS, all on real built fabric (`makeTownFixture`, ~1.0 s per build):**

1. **PLANTED MISWIRED** — a real founding-kind flip with `meta.landform` registered as expected.
   Convicts: verdict `MISWIRED`, `M = {morphologyOrder}`, `unmoved = {landform}`,
   responsiveness 0.500 — and `|A| > 50`, so the plant is non-vacuous.
2. **PLANTED WRONG DIRECTION** — a real −40% cut with `meta.households` registered `INCREASE`.
   Convicts: `D = {households}`, `M = ∅`, `DirectionalViolationShare = 1`, and households is still
   counted in `A` (a wrong-direction move is a move).
3. **PLANTED F-VIOLATION** — the same cut with `meta.households` FORBIDDEN. Convicts:
   `hardSafety = false`, `A ∩ F = {households}`, verdict `COLLATERAL` — **while
   `DirectionalResponsiveness` is 1.000**, which is the point: §10.14's hard red is independent of
   any average score.
4. **NOT_FIRED** — an arm whose mutation did nothing. Reports `NOT_FIRED`, names the firing token,
   `|A| = 0`, and `CausalPrecision` is `null` rather than 1.
5. **BAD PATH** — a firing token naming a component that does not exist. Reports `NOT_FIRED` with
   `ABSENT from the observation roster` rather than a silent "did not move".

⚠ The forbidden component in arm 3 is `households` under a population cut — chosen deliberately
because households MUST follow souls, so the plant convicts by construction and the pin cannot rot
if a real defect is later cured. **No pin in this file banks a defect.**

---

## §7 · ⭐⭐⭐ RAISED TO THE CHAIR — judgment-dense, decided by nobody in this lane

### §7.0 · DECIDED IN LANE, EACH VETOABLE

Six calls sat inside the brief and I made them rather than bouncing them back. Each is stated so
the chair can flip it with one word.

| # | chose | over | because |
|---|---|---|---|
| 1 | put the three modules in `fabric/` on the `FOUNDATIONS` node | a directory outside `fabric/` the manifest walker cannot see | MF-D1 §15's own instruction, and it converts "read-side only" from a promise into an edge-set fact arm 10 enforces. The cost is that the three modules may import nothing outside their node — which they do not |
| 2 | a CLOSED, scalar-only observation roster | flattening the whole fabric generically | a token can only be "exact" if a wrong path can be refused; a generic flatten has no failure mode for a typo |
| 3 | grade `structural`, report `prose` | grade everything | a `…Reason` sentence restates numbers that are already tokens; grading both halves precision on every arm |
| 4 | register `meta.builtRadius`, `wall#0.perimeter/area/band` in arm E's FORBIDDEN set | leave them to collateral | §276.1b says *"the wall must NOT contract"* in terms. A clause registered as forbidden is a clause that can fail loudly; one left to collateral is a clause nobody reads |
| 5 | run arms (a), (d) and (f) as declared SUBSTITUTIONS | skip them, or silently redefine them | a skipped arm reports nothing; a silently redefined one reports a lie. A declared substitution reports a neighbouring truth AND the missing surface |
| 6 | leave the three mis-registered tokens standing in the result of record | re-register and re-run | §4.1d: *"neither may be tuned away after inspection"*. The corrected figure is offered as PLAUSIBLE in RAISED-2 and is not the headline |


**RAISED-1 · ⭐⭐ THREE DOSSIER SURFACES DO NOT EXIST, AND THE BATTERY CANNOT BE COMPLETE WITHOUT
THEM.** This is the list §304.3 asked for, as a build request:

| §276.1b arm | missing surface | what a full arm needs |
|---|---|---|
| (a) move the resource site | a resource **LOCATION** | `resourceAnalysis` carries words only. A `{ resourceId, site: {x,y} \| bearing \| districtId }` record would let an arm move a mine without changing what is mined — the only way to separate "the site moved" from "the economy changed" |
| (d) shift the wall year | a **dated construction operation** | the vintage is `age × (TOWN_FLOOR ÷ peak)`, a fixed fraction of life set by population alone. §287.7's canonical operation registry is the natural home: a `CONSTRUCT` operation dated at year N, which `epochAxis` reads instead of deriving |
| (f) add a monument at year N | an **institution founding year** | `settlement.institutions[]` has no date and `settlementAtYear` passes the roster through untouched (CONTROL 3). A `foundedAtAge` on the institution record, honoured by the snapshot filter, is the minimum |

⭐ Until those exist, the benchmark's arms (a), (d) and (f) measure a NEIGHBOURING question and say
so in their own registrations. The chair may (i) accept the substitutions permanently, (ii) route
the three surfaces to D3a/A0–A5 as prerequisites for W8's full battery, or (iii) retire the three
arms from the battery and re-charter them when the surfaces land. **My recommendation is (ii):**
all three are small typed additions, all three are things the product's own vocabulary already
implies, and arm (d) in particular is the difference between a wall date that prints and a wall
date that draws.

**RAISED-2 · ⚠⚠ FOUR REGISTRATION AMENDMENTS, PROPOSED FOR THE NEXT SEAL AND DELIBERATELY NOT
APPLIED IN THIS RUN.** §4.1d forbids tuning a direction away after inspection, so these are a
request, not an edit:

| arm | token | as registered | proposed | why |
|---|---|---|---|---|
| G | `water::mode` | `VANISH` | `BECOMES:dry` | `deriveWaterMode` returns a fourth vocabulary value, never a null relationship |
| A | `meta.reliefField.cragShare` | `CHANGE` | drop, or use `meta.relief` | the reliefField shares are NORMALIZED and invariant to amplitude |
| A | `meta.resourceCoherence.status` | `CHANGE` | `meta.resourceCoherence.coherent` | `status` is `"MEASURED"` on every leaf; the verdict is `coherent` |
| E | `meta.highWater.demoted` / `.deficit` | as registered | **keep** | these two SHOULD move and their failure is the finding, not the registration |

⭐ With those three corrections the battery would read **PASS 4 / MISWIRED 2 / COLLATERAL 1**,
pooled `DirectionalResponsiveness` ≈ 0.894. **That figure is PLAUSIBLE and is NOT the result of
record**; the result of record is §4.1's table.

**RAISED-3 · ⛔⛔ THE HIGH-WATER LAW IS STARVED AND THE CURE IS A DOSSIER DECISION, NOT A GEOMETRY
ONE.** Sixteen of seventeen corpus leaves have zero high-water evidence, and the live generator
writes neither `populationHistory` nor `calamityHistory` on the leaves I inspected. Three
candidate cures, none of them mine to pick: (a) have the generator emit a `populationHistory` ring;
(b) treat a `historicalEvents` entry of a loss type as `calamityHistory` evidence — the town
already carries three dated events including a siege; (c) accept that a settlement with no recorded
history has no defensible high water and REMOVE §240.4's dividend claim from the spec for that
case. **(b) is the cheapest and the most historical**, and it is a derivation change, so it is the
chair's.

**RAISED-4 · ⚠⚠ THE RING FOLLOWS OCCUPANCY EVEN WHEN THE EXTENT IS PINNED** (§4.3, CONTROL 2). On
`highwater` the extent held to the last decimal and the circuit still moved +0.8% in perimeter.
Whether that is correct (the wall traces against the fabric that exists) or a defect (the wall is
an EVENT and should not re-trace when only occupancy moves) is a §239/§240 question I have no
authority over. It is a separate finding from RAISED-3 and would survive its cure.

**RAISED-5 · ⚠ THE COMPOUND FLOOR IS ABSOLUTE AND NO TOWN CATHEDRAL CLEARS IT** (§4.5). The
threshold shape is deliberate and correct; the consequence is that §15.3's street-grid interruption
is unreachable from the dossier at town tier. A tier-relative floor would restore the rank problem
the threshold exists to remove. A third option — a per-ARCHETYPE floor, so a worship or hall body
reserves at a lower size than a market body — is a member property and keeps the inertia guarantee.
**Not attempted; the trade-off is a tuning-signature call.**

**RAISED-6 · ⚠⚠ A DOSSIER FACT WITH THREE SPELLINGS IS A LIVE RENAME HAZARD** (CONTROL 4).
`terrainType || terrainOverride || terrain`, with the harness writing the second and the resolver
preferring the first. Every future counterfactual, every migration and every editor surface has the
same trap in front of it. **A single canonical spelling with the others as read-only aliases is the
cure**; it is a persistence-shape change and therefore owner-gated.

**RAISED-7 · ⚠ THE `.joined` ROSTER ASYMMETRY, FOUND WHILE RUNNING AND DELIBERATELY NOT FIXED
MID-BATTERY.** `walkMeta` emits `<path>.joined` only for a NON-EMPTY string array, so a list that
empties leaves the domain rather than reading `""`. Arm A hit it (`"ore|relief" → undefined`) and
the comparison was still correct. **I did not change the extractor after seeing results** — that is
exactly the edit a pre-registration exists to prevent — so it is a one-line amendment for the next
seal, alongside RAISED-2.

**RAISED-8 · ⚠ THE BENCHMARK NOW RE-RUNS AT EVERY WAVE SEAL (§304.3), AND IT NEEDS A HOME.** Today
it is a scratchpad runner over a sandbox tip. Two decisions the chair owns: (i) does the battery
become a suite test (it costs **18 full leaf builds plus 18 folio renders** — counted from the
runner: 4 for CONTROL 0, 7 mutated arms, 2 for CONTROL 2, 2 for CONTROL 3, 1 for CONTROL 4, on top
of 2 cached bases — which is a gate cost, not a pin cost), or a harness command the collecting
chair runs and pastes? (ii) does an arm's verdict
regressing from PASS to MISWIRED red a wave, or is it reported? **My recommendation: a harness
command with a captured log at every seal, and a RATCHET on `|A ∩ F|` only** — the hard red is the
part that must never grow, while responsiveness is a measurement the chair reads.

---

## §8 · THE PROOF FLOOR AT MY TIP

```
                                    SEALED MF-D1 TIP        MF-CB1 TIP
suite (lane config, bare)           13 files / 286 tests    14 files / 321 tests   TRUE_EXIT=0
                                    laneMFCB1-baseline-suite.log   laneMFCB1-suite-final.log
⭐⭐⭐ BYTE IDENTITY                  —                       0 of 170 keys moved
                                                            0 added · 0 removed · key-by-key
                                                            laneMFCB1-byteident.log
counterfactual battery              —                       7 arms, 50 directions, 1054 movements
                                                            laneMFCB1-battery.log  TRUE_EXIT=0
pre-registration                    —                       3 shas logged at entry, UNMOVED at exit
harness faithfulness (CONTROL 0)    —                       409/409 and 407/407 IDENTICAL
```

**THE SUITE ARITHMETIC, ATTRIBUTED: 286 + 35 = 321.** All 35 are the one new file
`tests/domain/townMapCounterfactualBenchmark.test.js`; **no existing test file was edited and no
ratchet constant was moved.** The stage-manifest walker's twelve arms stayed green across the
`FOUNDATIONS` assignment — run alone as well as in the suite.

---

## §9 · WHAT CHANGED, FILE BY FILE

| file | what |
|---|---|
| **`fabric/counterfactualTokens.js`** ⭐ NEW | the typed token registry, the closed predicate/tolerance/zero-policy registries, `E ∩ F = ∅` at construction, the firing set, and §10.14's four quantities plus the battery aggregate |
| **`fabric/counterfactualObservation.js`** ⭐ NEW | the closed, scalar-only observation roster over 10 entity families; the structural/prose split; `identityOf` matching `tokenIdentity` |
| **`fabric/counterfactualBattery.js`** ⭐ NEW | §276.1b's seven arms, every direction registered with its source-quoted argument, the three substitutions declared |
| `fabric/stageManifest.js` | ⭐ ONE ROW: the three modules join `FOUNDATIONS`. `allowedImports`, `randomNamespaces`, `statefulForkSites` and `NODE_EDGES` are all unchanged, because the three modules import only each other |
| **tests** | `domain/townMapCounterfactualBenchmark.test.js` **+35** (new file) |

⚠ **NO NEW CROSS-NODE EDGE.** The three modules import nothing outside their own node, so the
derived edge set is untouched and `FOUNDATIONS` still has zero outbound edges. The walker proves it.

---

## §10 · WHAT I DID NOT DO — stated affirmatively

1. ⛔ **NO REPO WRITE OF ANY KIND** — no git operation, no gate, no repo test run, no spec touch,
   no ODQ edit, no memory write. Two repo files were READ.
2. ⛔ **I CURED NOTHING.** Every defect in §4 is reported with its trace and left standing, per the
   brief. The only edits to the fabric tree are three new read-side modules and one manifest row.
3. ⛔ **I DID NOT RE-REGISTER A DIRECTION AFTER SEEING A RESULT.** The four amendments are RAISED-2.
4. ⛔ **I DID NOT FIX THE OBSERVATION ROSTER MID-RUN** (RAISED-7), for the same reason.
5. ⛔ **I DID NOT BANK A DEFECT IN A PIN.** The high-water arm is pinned as the LAW (the positive
   control), never as the current wrong value.
6. ⛔ **I DID NOT RUN THE BATTERY OVER ALL 17 LEAVES.** Seven arms on two leaves is §276.1b's
   battery; a per-leaf sweep is a W8 question and a much larger bill.
7. ⛔ **NO MEMORY WRITE.** The receipt is the durable artifact and the chair folds it, per the
   MF-D0/MF-D1 lane precedent.
8. ⛔ **I DID NOT TOUCH `laneMFD1-tip`, `laneMFD0-tip`, `laneMFW3F-*` OR `mf-proto/build-out`.**
   Proved by `diff -rq` and an mtime sweep. The W3F tree moved under me; that is its own lane.
9. ⚠ **THE TWO PROSE-ONLY REGISTRATION EDITS ARE DECLARED IN §3.1**, with the identical-figures
   diff that proves they moved nothing.

---

## §11 · ARTIFACTS (scratchpad, `laneMFCB1-*`)

| file | what it is |
|---|---|
| `laneMFCB1-tip/` | ⭐ **THE TIP.** From `laneMFD1-tip`; own hardlinked `node_modules` from `rs4/` |
| `laneMFCB1-battery.mjs` · `-battery.log` · `-battery.json` | ⭐⭐⭐ the harness, the run of record, and its machine-readable form |
| `laneMFCB1-battery-run1.log` · `-run1.json` | the first run, kept so the prose-only edit is auditable by diff |
| `laneMFCB1-trace.mjs` · `-trace.log` | ⭐⭐ the causal traces for arms A, D, F and G |
| `laneMFCB1-recon.mjs` · `-recon.log` | the BASE-ONLY corpus recon that chose the exemplars (no counterfactual executed) |
| `laneMFCB1-roster.mjs` · `-roster-{town,crossing}.log` | the observation roster, dumped so tokens name real paths |
| `laneMFCB1-probe*.mjs` · `-probe.log` | the dossier-shape reconnaissance |
| `laneMFCB1-fixprobe.mjs` | the fixture behaviour measured BEFORE the pins were written |
| `laneMFCB1-shas-TIP.json` · `-byteident.log` | ⭐⭐⭐ the zero-byte attribution, key by key |
| `laneMFCB1-{baseline-suite,suite-final}.log` · `-pins-{1,2,3}.log` | the suite, before and after |

⚠ **EVERY INSTRUMENT TAKES AN EXPLICIT TREE** via `MFCB1_TREE=`. None of them defaults to a tree,
because MF-D1 §14's hazard is that a defaulted tree is somebody else's.

---

## §12 · HAZARDS FOR THE NEXT LANE

- ⛔⛔ **A DOSSIER FACT WITH ALIASES MAKES A COUNTERFACTUAL A SILENT NO-OP.** `terrainType ||
  terrainOverride || terrain`, and the harness writes the one the resolver ignores. **Any arm that
  reports a clean "nothing moved" must first prove its firing set moved** — that is what the firing
  set is for and CONTROL 4 is why it exists.
- ⛔⛔ **AN INSTRUMENT THAT REPORTS ZERO MUST FIRST REPORT THAT IT FIRED** (MF-D1 §15, met again in
  a new shape). Here it is per-arm and structural: `NOT_FIRED` is its own verdict and it is
  computed before any fraction.
- ⚠⚠ **`CausalPrecision` ON THIS ENGINE IS 0.03–0.05 AND THAT IS NOT A DEFECT.** A dossier fact is
  a ground fact; a single-fact perturbation re-derives a third of the leaf. Quote precision with
  the blast radius beside it or the number will be read as sloppiness.
- ⚠⚠ **DO NOT GRADE THE PROSE ROWS.** Every `…Reason` string restates numbers that are already
  tokens; grading both halves precision on every arm. The split is declared in
  `STRUCTURAL_META_STRINGS`, and ⚠ a NEW structural string lands in `prose` by default — safe, but
  invisible until someone adds it.
- ⚠⚠ **A NEW MODULE IN `fabric/` REDS THE MANIFEST WALKER, AND THAT IS THE POINT.** Assign it. If
  it is read-side machinery, assign it to `FOUNDATIONS` and import NOTHING outside the node —
  `allowedImports`, `randomNamespaces` and `NODE_EDGES` are all derived and all compared for
  equality, so one stray `../../` import is three walker arms.
- ⚠⚠ **`wall#i` IS AN ORDINAL, AND AN ARM ON A LEAF WHOSE RING COUNT CAN MOVE IS ADDRESSING TWO
  DIFFERENT OBJECTS EITHER SIDE OF ITS OWN PERTURBATION.** Both battery leaves publish exactly one
  ring; a metropolis arm would not have that luxury.
- ⚠ **THE OBSERVATION IS SCALAR-ONLY BY CONSTRUCTION.** An arm that wants to talk about a polygon
  talks about its vertex count, perimeter, area or centroid. Adding an array to the graded map
  would make every tolerance a comparison function wearing a number's clothes.
- ⚠ **A REGISTRATION EDIT AFTER A RUN IS A PRE-REGISTRATION FAILURE EVEN WHEN IT IS HARMLESS.** I
  made two prose-only edits and the honest cost was a full re-run plus a diff proving no figure
  moved. Write the reasons long enough the first time (the pin's floor is 20 characters).
- ⚠ **SIX LEAVES ARE ONE SITE** (§255.2d, inherited). `town`, `siege`, `plague`, `famine`,
  `year-018` and `year-100` all build from `mf-town-01` riverside; five of this battery's seven
  arms run on that one geometric configuration. A per-leaf sweep at W8 must divide it out.
