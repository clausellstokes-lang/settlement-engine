# lane REG-BRIDGE — THE RIVER GAINS A SHAPE · DECKS · NARROWS · FORDS — RECEIPT

Seat: Opus implementer. Chair = Fable. Charter: ODQ §641.5 (verbatim scope), §637 (L-REG-32),
program doc A8/A9. Base: `a303815ae` — `refs/preserve/map-sandbox-reg5-drawnworld`, the REG-5 seal.
Worktree: `$SP/laneBRIDGE-tree` (detached). **TIP: `9de7290218d01d0777262787b013c397414834cf`**
(one commit, every path staged EXPLICITLY; `node_modules/` left untracked and confirmed surviving).

---

## §0 · THE VERDICT IN ONE TABLE

| deliverable | state | the number that says so |
|---|---|---|
| 1 · THE RIVER-PROFILE MINT | **BUILT** | 9 of 9 river leaves carry a profile; spread **1.909–2.100×** against the 1.06 meander-only figure REG-5 measured. Flat-substrate control collapses it to 1.160 |
| 2 · FORDS DRAWN | **BUILT — and the census is a finding** | the pass exists and emits; **2 of 17** records are drawn, **15 are lawfully exempt as already carrying a deck**. The ford records ARE the bridge crossings (measured, §4.1) |
| 3 · NARROWS RE-SITING | **BUILT** | 18 of 18 decks sit at their **admissible** narrows (`pinchAdm ≤ 1.001`); 17 of 18 re-sited, max displacement 40.3 units |
| 4 · THE TWO FLOATING DECKS + DECK LAW | **CURED** | **18 of 18 decks dry both ends**; **18 of 18 inside ±15°**; **18 of 18 excess ≤ 1.086**. The historical control convicts exactly the two decks REG-5 named |
| 5 · `carto:bridge` DISPOSITION | **MEASURED — and it CORRECTS THE CHARTER** | `carto:bridge` reaches **no pixel at all**; the family users see is a **THIRD** one. Recommendation: let it die at cutover (§6) |

**DORMANCY: 29 of 29 byte-identical to the seal — re-proved AT THE COMMITTED TIP `9de729021`.**
**WALKERS: 318 / 318 at that same tip.** **NEW TEST FILES: none — three-ratchet delta 0 / 0 / 0.**
⚠ The tip's own bytes were compared against the working tree for the three largest files
(`git show ${SHA}:path | shasum` vs the file) — **no hook re-staged anything**, so `git diff HEAD`
was not blind and the green above belongs to the commit rather than to a pre-hook snapshot.

⛔ **THE ONE THING THE CHAIR MUST READ FIRST:** §6's disposition memo does not merely dispose of
`carto:bridge` — it **refutes the premise §641.5 states about it**. `carto:bridge` is not "the one
users see today"; it is drawn nowhere, and its whole causal reach is choosing which *other*
module's ids get listed in an array behind a flag that is `false` in every shipped configuration.

---

## §1 · SETUP PROOF

```zsh
git worktree add "$SP/laneBRIDGE-tree" a303815ae972975a475dd2461daac536478c3542
cd $SP/laneBRIDGE-tree && mkdir -p node_modules
cp -R /Users/cstokes/Desktop/settlement-engine/node_modules/seedrandom node_modules/
# for the GATE: per-package symlinks, plus .bin — ⚠ THE RECEIPTED RECIPE OMITS `.bin`
cd node_modules && for e in …/node_modules/*;    do b=$(basename $e); [ -e "$b" ] || ln -s "$e" "$b"; done
cd node_modules && for e in …/node_modules/.bin/*; do b=$(basename $e); [ -e ".bin/$b" ] || ln -s "$e" ".bin/$b"; done
```
⚠⚠ **A LANE-SETUP CORRECTION WORTH BANKING.** REG-5 §14's per-package symlink recipe links
`node_modules/*` only, which does **not** create `node_modules/.bin/`. The gate then dies with
`sh: vitest: command not found` — a message that reads like a missing dependency and is in fact a
missing shim directory. The `.bin` loop above is the fix; both loops are needed.

`tests/setup/fastCheckSeed.js` is **in the tree** at this seal (§642.1 committed the borrow), so
the REG-5 hazard is discharged and nothing had to be copied by hand. Confirmed present.

**Baseline:** `node harness/exemplars.mjs $SP/bridge-base` → **28 SVG + manifest = 29 files**,
sha-recorded to `$SP/bridge-base.sha`. Every dormancy claim below diffs against that file.

---

# §2 · DELIVERABLE 1 — THE RIVER-PROFILE MINT

## §2.1 · ⭐⭐ THE DESIGN, AND WHY IT IS A READING RATHER THAN A TAPER

`waterMode.js:89` set **one scalar per leaf** — `7 + builtRadius * 0.030` — and the renderer
stroked a constant-width line. REG-5's consequence is the whole reason this wave exists:
`span/narrows = 1.000–1.059` for every bridge in the corpus, because **every point of a
constant-width river is a local narrows**, so L-REG-32 was not measurable at all.

The profile is **READ FROM THE GROUND, NOT MINTED** — the same doctrine `waterBearing` states two
functions below it in the same file, and for the same reason: a taper minted from a hash is a
seed-permanent world fact under THE PROMISE, while a taper read from the heightfield the river
already drains cannot contradict a later truth. ⭐ **NOTHING IN THE DERIVATION HASHES.** No
`fabricRng`, no `hashUnit`, no new random namespace — which is why this mint owes **neither** of
the two registries REG-5 §15 banked (`stageManifest` S4 namespaces; the walker's hand-minted
inventory). That was a design constraint, not a happy accident.

### The three terms, each measured before it was chosen
`$SP/laneBRIDGE-tree/harness/laneBRIDGE/probeProfileInputs.mjs` measured every candidate signal
along the drawn channel of all 9 river leaves before a single constant was written:

| signal | range on `town` | verdict |
|---|---|---|
| `flow` (substrate accumulation) | 0.0315 → 1.0000 | strong range, **but rises head→mouth on only 58 % of sampled steps** (56–67 % across the corpus) |
| `confine` (bank rise at ±1.5 w) | −0.0253 → +0.0132, median +0.0005 | real, small, sign-meaningful |
| `curv` (tangent turn over a 1.5 w arc) | 0 → 1.000, p90 0.467 | strongest range of the three |

⭐⭐ **THE ACCUMULATION IS NOT MONOTONE AND THE CURE IS PHYSICS, NOT SMOOTHING.** The raw `flow`
sample wanders because the DRAWN channel is the meandered line and leaves the D8 trunk the
accumulation was computed on, and because both tails are run out past the basin to the frame edge.
**Discharge physically never decreases downstream**, so the taper reads the **running maximum
head→mouth** — the envelope the physics guarantees. `drainageTrace` returns headwater → mouth in
reading order, which is what makes "downstream" a fact here rather than a convention.

## §2.2 · THE PROPOSED CONSTANTS — the chair signs; nothing below is pinned

`waterMode.js` · `RIVER_PROFILE`. All dimensionless, so the table does not change meaning between
a thorp's brook and a metropolis's trunk river.

| row | value | the argument |
|---|---|---|
| `taper` | **0.34** | the accumulation amplitude ± about the mean. The visible half of the mint, and the half the reference grammar (Watabou/FTG) shows most plainly |
| `pinch` | **0.22** | how far a fully confined valley narrows the channel. Deliberately well under `taper`, so a narrows is a LOCAL event on a downstream trend and not a competing trend |
| `bend` | **0.16** | the cut-bank widening. Smallest of the three: a bend is a detail, not a régime |
| `window` | **1.5** | the arc window in nominal widths for tangent, curvature and bank samples. Below ~1 width it reads polyline sampling noise |
| `smooth` | **3** | 1-2-1 passes along arclength. A width that jitters vertex-to-vertex is noise wearing a river's clothes |
| `lo` / `hi` | **0.72 / 1.55** | hard bounds as a fraction of nominal — a drawable headwater, a mouth that does not swallow its banks |

⚠⚠ **THE ARC-WEIGHTED MEAN IS PRESERVED, AND THAT IS A DELIBERATE CHOICE, NOT A DETAIL.** A profile
that also INFLATED the river would move the water claim's area, the ground law's refusals, the
field clip and the op/byte spend — and the declared shift would then be *"the river got bigger"*
tangled with *"the river got a shape"*. Preserving the mean makes this mint a **redistribution**,
so every figure that moves, moves because of the SHAPE. Measured residual drift after the
two-pass normalize-then-clamp: **+0.17 % to +0.67 %.**

## §2.3 · THE LIVENESS CENSUS — `harness/laneBRIDGE/profileCensus.mjs --controls`

```
   leaf         nominal    min    mean     max   max/min  mean/nominal  verts
   town          16.712 12.033    16.8  23.163    1.9249       1.00525    290
   town-2        16.323 11.752   16.35  24.678    2.0998       1.00165    296
   highwater     17.567 12.648  17.684  24.144     1.909       1.00667    290
   siege/plague/famine/year-018/year-100/crossing — the `town` river, six leaves, one site
   VERDICT: 9 of 9 river leaves carry a profile whose spread exceeds 1.06 — EXIT MET
```
**The exit asked for max/min "meaningfully > 1.06". It is 1.91–2.10.** CONFIRMED, executed.

### THE CONTROLS — all three LIVE
```
   C1 · UNARMED: 0 of 9 river leaves carry a profile
        → LIVE — the mint is dormant with the flag off
   C2 · FLAT SUBSTRATE on town: spread 1.1600  vs the real ground's 1.9249
        → LIVE — the taper is READ from the ground: flatten it and the spread collapses
   C3 · SAME-SEED DOUBLE RUN: 0 of 9 rows differ
        → LIVE — deterministic
```
⭐ **C2 IS THE ONE THAT MATTERS AND IT IS THE ONE THAT WOULD HAVE BEEN SKIPPED.** A profile that
ignored the ground entirely would still publish a healthy spread, and no census of the spread could
tell it from a decoration. Flattening the heightfield and the flow field kills the accumulation and
confinement terms and leaves only the meander bend — and the residual 1.160 is exactly that term.
The measurement therefore says *what the number is made of*, not merely that it is large.

## §2.4 · ⭐⭐ THE CONSUMER CENSUS — 30 read sites, every one dispositioned

The width is not one variable, it is a contract. A subagent census enumerated every read site in
`src/`, `harness/` and `tests/`; each was ruled LOCAL (a question about a place) or NOMINAL (a
leaf-scale constant). **Ruled NOMINAL with a reason is a disposition, not an omission.**

| site | what it does | ruling |
|---|---|---|
| `waterMode.js:533` `isInWater` | the wet absolute — the fabric's hottest predicate | **LOCAL** |
| `waterWorks.js:127` `waterMeetings` half | decides the corpus's whole TRANSIT set | **LOCAL** |
| `waterWorks.js:229` `waterClaims` | the ground law's reservation footprint | **LOCAL** (via `widths`, §2.5) |
| `waterWorks.js:308` `span` on the bridge record | the deck's own span | **LOCAL** — the single most semantically wrong nominal read in the tree |
| `waterWorks.js:435/466` probe + `wetAt` | a probe and its predicate | **LOCAL, in lockstep** — see below |
| `waterWorks.js:529` water-gate `span` | the arch spans the channel at the cut | **LOCAL** |
| `waterWorks.js:563/571/589` field clip | half, grid cell, wet test | **LOCAL per-segment**, cell from **MAX** |
| `waterWorks.js:625` densify pitch | the §190a between-corners guarantee | **MIN-local** |
| `leafCensus.js:154/234/247` | reach, claim band, lattice pitch | **LOCAL** (reach/band), **MIN** (pitch) |
| `renderFolio.mjs:1036` the drawn stroke | the channel's ink | **LOCAL — structurally** (§2.6) |
| `bridgeAngles.mjs:48/53/59/81` | the census's own wet set | **LOCAL**; cell/bbox **MAX**, radial step **MIN** |
| `publication.js:56` `waterText` | the governed-surface content hash | **LOCAL** (digest appended, §2.7) |
| `wallCircuit.js:181` `waterWidth` | a FROZEN input-hash column | **LOCAL** (value widened, never a new key, §2.7) |
| `waterWorks.js:321` de-dup `apart` | how far apart two decks may stand | **NOMINAL** — a leaf-scale spacing |
| `waterWorks.js:509` water-gate `apart` | gate spacing | **NOMINAL** — the code already rules this: *"the spacing is the CIRCUIT'S, not the channel's"* |
| `walls.js:390` the half-ring filter | drops circuit vertices the river defends | **NOMINAL, DELIBERATELY** — `walls.js:454` and `rampartWorks.js:518` both record this filter as frozen because moving it moves the ring, the band, the district partition and every census downstream. Not this lane's to move (§9 deferral 1) |
| `seating.js:146`, `wallRuns.js:247` | "near enough to the water" thresholds ×1.6 | **NOMINAL** — the DISTANCE term is already per-candidate; only the threshold is leaf-scale (§9 deferral 2) |
| `substrate.js:1180-82` `meanderChannel` | the meander's own wavelength | **NOMINAL, FORCED** — it runs *before the centreline exists*. Feeding it a profile would move every meander on every river leaf and make the taper unattributable |
| `fabricDcel.js:203-207` `WATER_EDGE` | the planar arrangement's water boundary | **LOCAL, UNCURED** (§9 deferral 3) |
| `src/domain/townScene/**` `widthPlan` | minted from `frame.water` as `coast?150:42` | **NOT A CONSUMER** — a separate pipeline, never reads the fabric |
| `spatialReceipt.js:87` | the spatial digest | **NOT A CONSUMER** — reads `kind/line/polygon/body/key`; width never enters |

⭐ **THE PROBE-AND-PREDICATE PAIR IS THE ONE THAT WOULD HAVE RE-MINTED A SHIPPED BUG.**
`waterWorks.js`'s own comment records the class in the voice of the defect that produced it — *"a
PROBE and a PREDICATE measured in the same units still disagree if the probe steps past the
predicate's own reach"* — and a half-local/half-nominal split reproduces it exactly. Both now read
`widthAt` at the SAME point (the bank station), so they cannot drift apart again.

⛔⛔ **EVERY LOCAL SITE BRANCHES ON THE PROFILE'S PRESENCE, AND THE UNARMED SPELLING IS LEFT
CHARACTER-FOR-CHARACTER AS IT WAS.** `stationAt` computes the same distance by the same formula as
`distToPolyline`, but *"the same formula"* is not *"the same bits"* once an accumulation order
differs — and `isInWater` decides where every parcel in the corpus may stand. Branching on presence
makes dormancy true **by construction** rather than true by a float comparison nobody can inspect.

## §2.5 · ⭐⭐ THE CLAIM TAPERS WITH THE DRAWING, AND IT IS STILL **ONE** CLAIM

A river drawn 23 units wide at its mouth while the ground law reserves 16.7 puts buildings **in the
drawn water** at every wide reach — §205 A's dominant class (*a drawn surface with no claim is a
surface no law governs*) re-minted by its own cure.

The obvious fix — return N per-segment claims — **reds `townMapFabricBuildOut.test.js:1415`'s
`expect(claims).toHaveLength(1)`**, and that pin is right: a claim is a THING (the channel), not a
list of slices of one. So the claim carries its own `widths` and `claimSegments` spends them per
segment. ⭐ **`claimIndex` WAS ALREADY BUILT FOR THIS** — it sizes its cell from `maxHalf` and grows
every segment's box by *that segment's* own half — so the exactness claim (*"a segment whose bucket
the query does not touch cannot be within `half` of it"*) survives a variable half **without one
word of it changing**. The ground law was local-ready and nobody had noticed.

## §2.6 · ⛔⛔ A TAPERING RIVER CANNOT BE A STROKE

`stroke-width` is one number for a whole path. As long as the channel was ink laid down by a
stroke, **the drawing could not have tapered even if the fabric had said it should.** Where a
profile exists the channel becomes a BODY: two banks offset by the LOCAL half-width, closed into
one ring. The thin dark centreline is unchanged — it is a thalweg mark, not a bank.

⛔ **`fill-rule="nonzero"` IS LOAD-BEARING**, not a default copied out of habit. An offset of half a
channel width on the inside of a tight meander can fold back on itself; under even-odd that fold
punches a **hole** in the river, under nonzero it fills as the union. The failure mode is a white
bite out of the water at exactly the bends the meander law exists to produce.

⛔ **AND THE BANKS ARE DECIMATED, BECAUSE BYTES ARE THE BINDING GATE.** §641.4 leaves town a
4,638-byte margin at its fixed point. Two full-resolution banks cost ~2× the stroke's own path
data. Keeping a station only where the bank turns (>4°, as a dot product — no runtime trig),
changes width (>4 % of nominal) or has simply run far enough (1.2 nominal widths) costs **LESS than
the single stroke it replaces**: measured **−5,321 B on `town`**, −4,432 on `town-2`, −5,284 on
`siege`. The mint's most expensive-looking act is a net byte saving.

## §2.7 · THE TWO CONTENT HASHES THAT WOULD HAVE GONE BLIND

Both were found by the consumer census, neither by reading the diff:

1. **`publication.js:56` `waterText`** digests the water relation for `governSurface`. A profile
   digested as one nominal scalar means **a mutated profile reads CLEAN** — the precise blindness
   that function exists to refuse. The profile's own quantized widths are appended, **only when a
   profile exists**, through the same `q6` the scalar uses (a digest with its own rounding is a
   second spelling). `townMapD1Foundations.test.js:411`'s 6-dp pin is untouched.
2. **`wallCircuit.js:181` `waterWidth`** is a column of a FROZEN input roster feeding
   `assertCircuitFresh`. Its own header records the hazard: *"a consumer could verify an
   UNTERMINATED ring set against the inputs of a TERMINATED one and be told it was fresh."*
   ⭐ **THE VALUE IS WIDENED, NEVER A KEY ADDED** — `inputsText` writes `k=∅` across the whole
   frozen list, so a new key would move every leaf's `inputsHash`. Armed, the value becomes
   `nominal|min|max`; unarmed it is the same number it always was.

---

# §3 · DELIVERABLES 3 + 4 — THE DECK LAW, THE NARROWS, THE FOUR ANGLES, THE TWO FLOATING DECKS

## §3.1 · THE ORDER, AND WHY IT HAS TO BE THAT ORDER

**RE-SITE → RE-AIM → RE-LENGTH → BEND THE ROAD.** The aim depends on where the deck ends up, the
length depends on the aim, and the road's kink depends on where the deck's two ends finished.

## §3.2 · ⛔⛔ THE WINDOWED TANGENT WAS TRIED FIRST AND IT IS NOT THE LAW'S OBJECT

The first cure aimed decks at the perpendicular of a 1.5-width chord — the obvious reading of *"the
normal of the river's local tangent"*. **MEASURED: 22–28° off the true normal on `town`'s own high
street**, a deck REG-5's window-free census scores 6.3° from square. That is J-REG5-BR-2 in
miniature, and it convicts the windowed reading rather than the drawing.

The deck is therefore aimed on the **shortest wet crossing**, scanned in integer trig indices
(`cosI`/`sinI` off the frozen table — never runtime trig, the module's purity law): a coarse ±45°
sweep every 12 indices (~4.2°) to RANK stations, then a ±14-index refinement at one index (0.35°)
to BUILD on. One index is twenty times finer than the band it is judged in.

⚠⚠ **THE CONSEQUENCE IS DECLARED, NOT HIDDEN: THE ANGLE CENSUS IS NO LONGER INDEPENDENT OF THE
CURE.** Both now read the same geometric object, so `18 of 18 in band` is not by itself evidence.
Its value moves entirely onto (a) the planted controls, (b) the endpoint-clearance and narrows arms,
which measure different things, and (c) the historical control in §3.6, which convicts a real
defect nobody planted. **Aiming at anything else would have been aiming at an artefact of a window
somebody chose**, so the tautology is the price of correctness and is paid openly.

## §3.3 · THE PROPOSED CONSTANTS — `DECK_LAW`, the chair signs

| row | value | the argument |
|---|---|---|
| `abutment` | **0.34** | how far past each bank the deck lands, as a fraction of the LOCAL width. ⭐ NOT INVENTED: it is what the fifteen CONFORMING decks in the shipped corpus already measure (clearance +2.42…+6.13 on a 16.7-unit channel), so cured decks keep the look the good ones had |
| `abutmentRoad` | **0.5** | a floor on the same figure as a fraction of the ROAD's width — a wide arterial needs a real landing even over a narrow brook |
| `corridorBlocks` | **3** | J-REG5-BR-1, ratified §641.2 |
| `kinkMaxTan` | **3.73 (75°)** | see §3.4 — this one changed, and the change is a finding |
| `window` | **1.5** | matches the profile's window; one reading of "which way the river runs here" |
| `reachCap` | **14** | how far a crossing walk may go, in local widths, before reporting NO CROSSING |

### ⭐⭐ J-REG5-BR-1's "MEDIAN BLOCK DIMENSION" IS √AREA, AND THE SPELLING MATTERS
Reproduced digit for digit before it was used:

| leaf | median √area | median bbox side | REG-5's published figure |
|---|---|---|---|
| town | **26.80** | 37.76 | **26.80** ✔ |
| highwater | **28.43** | 39.92 | **28.43** ✔ |
| crossing | **29.81** | 41.54 | **29.81** ✔ |

A bbox side gives 37.8 and would have been a **different law** wearing the same words. The corridor
is `3 ×` that: **80.4 / 85.3 / 89.4 units.**

## §3.4 · ⛔⛔ THE KINK BUDGET WAS DOING THE CORRIDOR'S JOB — a constant re-derived from the law

The first value was 0.70 (≈35°), chosen as "a real road bend". It sited **2 of 8** decks. A sweep
over the whole river corpus:

| kinkMaxTan | ≈ | town | highwater | crossing | sited |
|---|---|---|---|---|---|
| 0.36 / 0.58 / 0.70 | 20/30/35° | 1/2 | 1/4 | 0/2 | **2/8** |
| 0.84 | 40° | 1/2 | 2/4 | 1/2 | 4/8 |
| 1.00 | 45° | 0/2 | 2/4 | 2/2 | 4/8 |
| 1.19 | 50° | 2/2 | 2/4 | 1/2 | 5/8 |
| 1.43 | 55° | 2/2 | 2/4 | 2/2 | 6/8 |
| **1.73** | **60°** | 2/2 | 4/4 | 2/2 | **8/8** |

⭐ **THE READING IS NOT "LOOSEN IT UNTIL IT PASSES" — IT IS THAT THE CLAUSE HAD INVERTED ITS OWN
LAW.** L-REG-31 is explicit that where the road and the crossing disagree the **DECK WINS**: *"the
approach road kinks at the bridgehead; the deck is never skewed to save the road a bend."* A kink
budget that trades squareness against a road's convenience implements the opposite of the law it
serves. The only thing the clause is entitled to refuse is a road **doubling back**, which is what
75° names; **how far a bridge may move is the CORRIDOR's question** (§637.1's *"within reasonable
distance to major roads"*) and it is answered there.

⚠ **THE SWEEP IS NOT MONOTONE (45° sites fewer than 40°) AND THAT IS REAL, NOT NOISE:** loosening
the budget admits a BETTER-scoring station which then fails a different clause. A constant chosen
off a single reading of a non-monotone curve would have been chosen off an accident.

**Measured displacement at the signed value: 12.3–40.3 units** (under 2.5 local widths). The roads
bend; they do not wander.

## §3.5 · ⭐⭐ TWO BUGS THAT PRESENTED AS LAWFUL REFUSALS — both worth banking

Every refusal in the first three runs was attributed, never counted — *"4 refused"* is a number
nobody can act on; *"4 refused, all on the kink budget, with `noCrossing` and `wetEnd` both ZERO"*
points at a line.

⛔ **1 · THE FRAME.** The road runs `…→ line[ia-1] → PA → [deck] → PB → line[ib+1] →…`, so the chord
`PA→headA` runs WITH the approach's course while `PB→headB` runs BACK along it. Measured against an
unnegated `dirB`, every candidate scored `along < 0` and was refused by the (correct) *"a deck
behind its approach is not a bridge"* guard. `highwater` refused 4 of 4 and looked lawful.

⛔⛔ **2 · THE SHORT CHORD — the one that matters.** `headA` lands within a unit or two of `PA` on a
well-sited deck, because the road already arrives where the deck begins. That chord is a NEAR-ZERO
VECTOR whose direction is numerical noise, and `side/along` on it is arbitrarily large. **MEASURED:
`town/street.high|46` — a deck the census scores 6.3° from square, one of the best in the corpus —
was refused, and so were all 34 stations inside its corridor.** ⭐ **THE CLASS: a ratio whose
denominator goes to zero at exactly the configuration you are trying to accept.** The cure measures
the angle the law actually names — the bend between the approach's course and the DECK'S AXIS —
with the reach chord charged only once it is long enough to have a direction.

⛔ **3 · A THIRD, FOUND BY ARITHMETIC.** `highwater`'s regional approach was the corpus's last
refusal and its own attribution added to **283 of 290 stations**. The 7 unaccounted-for stations
were the ones that had PASSED the sweep — the fine refinement (±4.9°) had flipped a marginal kink
and the deck was dropped. ⭐ **A refinement that can REFUSE what the sweep accepted is a bug hiding
as a lawful refusal**; the coarse bearing is known to fit and is now the fallback.

⭐ **THE COMMON SHAPE OF ALL THREE: a correct guard firing on a correct configuration because the
caller handed it the wrong frame, the wrong anchor, or a later answer.** Each presented as a clean,
plausible refusal — the failure mode that does not look like a failure.

## §3.6 · THE DECK CENSUS — `harness/laneBRIDGE/deckCensus.mjs --controls`

```
   ENDPOINT CLEARANCE  18 of 18 decks DRY BOTH ENDS  ✔ EXIT MET
   L-REG-31 ANGLE      18 of 18 inside ±15°  ✔ EXIT MET
   L-REG-32 EXCESS     18 of 18 at or under 1.086  ✔ EXIT MET
   L-REG-32 SITING     18 of 18 sited decks stand at their ADMISSIBLE narrows (pinchAdm ≤ 1.001)  ✔
   VERDICT: sited 18/18 · dry 18/18 · band 18/18 · excess 18/18 · at-admissible-narrows 18/18
```
Clearances run **+5.27 … +7.50 on both ends of every deck**. Deviations run **0.0°–4.3°**.

### ⭐⭐ TWO NARROWS ARE PUBLISHED, NOT ONE — and the pair is the honest statement of §637
`narrowsCorridor` is the shortest crossing ANYWHERE in the corridor; `narrowsAdmissible` is the
shortest one the ROAD CAN REACH. **A census scoring a deck against the corridor minimum alone
convicts the law for obeying its own second clause.**

| leaf | deck | crossed | admissible | corridor | pinchAdm | pinchCorridor |
|---|---|---|---|---|---|---|
| town | `street.high\|46` | 17.32 | 17.34 | 15.42 | **0.999** | 1.123 |
| town | `…approach.corridor.1` | 25.54 | 25.56 | 24.27 | **0.999** | 1.052 |
| highwater | `street.high\|86` | 21.06 | 21.07 | 17.85 | **1.000** | 1.180 |
| highwater | `ringOld.E2\|13` | 24.98 | 25.00 | 25.00 | **0.999** | 0.999 |
| highwater | `ringOld.E2\|4` | 15.68 | 15.68 | 15.68 | **1.000** | 1.000 |
| highwater | `…approach.corridor.1` | 25.56 | 25.56 | 24.75 | **1.000** | 1.032 |
| crossing | `street.high\|55` | 19.29 | 19.33 | 16.74 | **0.998** | 1.152 |
| crossing | `…approach.corridor.1` | 24.57 | 24.58 | 20.21 | **1.000** | 1.216 |

**Every deck stands at its admissible narrows.** Two of them also stand at the corridor's absolute
narrows; on the other six the absolute narrows is 3–22 % tighter and the road cannot reach it.

### ⛔⛔ THE `excess` FIGURE WAS A PHANTOM DEFECT FOR ONE RUN, AND THE NUMBER WAS BELIEVABLE
The first census measured *"the water actually crossed"* with `isInWater` (the LAW's predicate,
`d < 0.62 w`) against a shortest crossing measured on the DRAWN set (`d ≤ 0.5 w`), and **every deck
in the corpus scored `excess = 1.22`, uniformly, including decks whose deviation was 0.0°.** The
ratio was not a defect: **0.62 / 0.5 = 1.24**, the two predicates' own quotient.
⭐ **THE CLASS, banked: a ratio between two measurements taken against two different definitions of
the same object is a constant wearing a finding's clothes — and it convicts UNIFORMLY, which is
exactly what a real corpus-wide defect looks like.** Cured by exporting `crossingOnBearing` from
the REG-5 instrument so both readings come off one wet set.

### THE CONTROLS — four arms, all LIVE
```
   C1a · THE UNARMED (SHIPPED) CORPUS: 2 of 19 decks stand in the water
         highwater/wallLane.main.run.new-cutting.12|3  endA -18.15  endB -18.15
         crossing/street.high|55                       endA -17.27  endB -17.27
        → LIVE — the endpoint census convicts the defect REG-5 measured BY HAND, and it convicts
          EXACTLY those two decks and no others
   C1b · EVERY DECK CUT TO 40 % OF ITS OWN CROSSING: 18 of 18 now stand in the water — LIVE
   C2  · A 30° SKEW planted on every deck: 18 of 18 conforming decks now RED — LIVE
   C3  · EVERY DECK SLID 40 UNITS ALONG THE CHANNEL: 9 of 18 now RED on pinch — LIVE
   C4  · NEGATIVE (unmutated re-run): 0 of 18 rows differ — LIVE
```
⭐⭐ **C1a IS THE STRONGEST CONTROL IN THIS RECEIPT AND IT REPLACED A DEAD ONE.** The first plant —
re-imposing the pre-cure deck LENGTH on the cured SITING — **reds nothing**, because a deck sited at
a narrows is short enough that even the old fixed 1.7×-nominal formula spans it. ⛔ **THE DEAD
READING WAS THE FINDING: the floating decks were never a length defect alone — they were a length
defect ON AN OBLIQUE, MIS-SITED CROSSING**, and only the pre-cure geometry reproduces them. Running
the census on the shipped corpus convicts the two REG-5 named, independently and by name.
⚠ The magnitudes differ from REG-5's (−18.15 vs −6.94): this instrument walks in from the deck end
along the deck axis to the first wet/dry transition, REG-5 measured perpendicular clearance to the
claim. **The two agree on WHICH decks and on the sign; they are not the same quantity.**

## §3.7 · THE `across` FIELD-NAME TRAP — FIXED, AND THE OLD NAME KEPT
`waterWorks.js:306`'s `across` holds the RIVER's own tangent, verified by REG-5 to 0.1° on all 19
decks — it reads as the exact opposite of what it stores. A rename in place is not available: it is
a published field of a fabric record. It is kept, and the honest spelling `tangent` now stands
beside it. ⭐ **The consumer census confirmed `across` has ZERO read sites anywhere in `src/`,
`harness/` or `tests/`** — so the honest field is free, and the lying one costs nothing to leave.

---

# §4 · DELIVERABLE 2 — FORDS DRAWN

## §4.1 · ⭐⭐ THE MEASUREMENT THAT RESHAPED THE DELIVERABLE

Before designing a glyph, the 17 records were measured against the drawn web:

**ALL 17 FORDS SIT AT DISTANCE 0.00 FROM A DRAWN CHANNEL, ALL 17 ARE IN THE WATER, AND THEY SIT ON
THE SAME TWO CHANNELS THE BRIDGES ARE ON** (`street.high` and `street.road.approach.corridor.*`).

REG-5 wrote that *"the ford that justifies the site and the bridge that gets drawn are two
unconnected derivations from the same river"*. Measured, the statement is stronger than that:
**they are two readings of ONE crossing.** That is why this register's first clause is that a ford
is never drawn under a deck — drawing both would lay a ford's dashes across a bridge's parapets.

## §4.2 · THE PROPOSED CONSTANTS — `FORD_LAW`, the chair signs

| row | value | the argument |
|---|---|---|
| `corridorWidths` | **5** | ⚠ it cannot be the block-scale corridor: a ford is a countryside crossing on a regional corridor and there are no blocks out there. 5 widths = 83.6 units on `town`, inside the bridge corridor's measured range (80.4–89.4) — the two laws look over comparable ground, which is what makes "the mirror" a fair comparison |
| `wideBand` | **0.97** | a band, not a maximum: two adjacent stations of a smoothed profile differ by less than a percent, and choosing between them on the third decimal is choosing on noise |
| `deckClear` | **2.2** | one crossing, one work |
| `obliqueMax` | **2.5** | ⛔ NOT COSMETIC — see below |

⛔ **`obliqueMax` EXISTS BECAUSE THE WIDE-REACH SEARCH FOUND A STATION WHERE THE ROAD RUNS DOWN THE
CHANNEL RATHER THAN ACROSS IT.** MEASURED: `town-2` first produced a ford whose road dipped through
**57.5 units of a 15.4-unit river** — a 3.7× obliquity that would have drawn a ford glyph longer
than the reach it crosses. A crossing is a place where a road CROSSES.

## §4.3 · ⛔⛔ AN IDENTITY RESOLVED AFTER A MOVE IS RESOLVED AGAINST THE DESTINATION

The first spelling re-sited the ford and *then* took the nearest drawn channel. A ford that walked
80 units up the bank landed on whatever lane happened to be closest, and `town`'s ford came out
keyed **`ford|street.block.org.district.religious_quarter|5|1#0|0`** — a regional river crossing
drawn on a block lane inside a precinct, at a 61° obliquity. ⭐ **THE CLASS: an identity resolved
after a move is resolved against the destination, not the subject** — and it produces a record that
is internally consistent and completely wrong. The owning road is now the channel nearest the
**founding record**, and only stations that road still reaches are candidates.

## §4.4 · ⚠⚠ THE DRAWN FORD MOVES; THE FOUNDING RECORD DOES NOT — and the alternative is owner-gated

`routes.crossings` is computed at STAGE 0b, before any nucleus exists, and it feeds `corridorPull`,
which is an input to the site search. **Re-siting the record at birth would move the NUCLEUS on
every river leaf**, and the whole town moving would swamp the visual evidence for everything else
this wave changed. So the founding fact stays — *a corridor crosses this river here* — and the
DRAWN ford is where that crossing is actually made. §637.2 describes exactly this: *"A road that
meets the river far from any narrows follows the bank to the crossing (the period riverside
road)."*
⭐ **THE ALTERNATIVE IS STRONGER AND IS WRITTEN UP RATHER THAN TAKEN** (J-BR-6): re-siting at birth
makes the founding record true and is a much larger declared shift. **Owner/chair call.**

## §4.5 · THE FORD CENSUS

```
   town         — none drawn: underDeck 2  oblique 0  offRoad 0
   town-2       ford|street.high|0                  rank high    span 15.11  wet 20.82  obliq 1.38  moved
   highwater    — none drawn: underDeck 2  oblique 0  offRoad 0
   siege/plague/famine/year-018/year-100 — none drawn: underDeck 2 each
   crossing     ford|street.road.high.corridor.0~f  rank artery  span 16.22  wet 36.39  obliq 2.24  moved
   TOTAL records 17 | drawn 2 | refused: underDeck 15, oblique 0, offRoad 0
```

⭐⭐ **THE RESULT IS §637.2's LEGIBILITY GIFT ARRIVING BY ITSELF, AND IT IS THE BEST THING IN THIS
WAVE.** `town-2` is the corpus's one riverside town that **never earned a crossing** — it has ZERO
bridges — and it is the leaf that now shows a **FORD**. Every town that earned a bridge shows a
bridge and no ford. *A reader who sees a crossing at a pinch reads BRIDGE; at a broad reach, FORD*
— and the corpus produces that distinction without being told to.

⚠ **THE EXIT SAID "EVERY FORD DRAWN" AND THE HONEST ANSWER IS 2 OF 17.** The other 15 are named,
not silently passed: they are exempt under *one crossing, one work*, in the idiom §262.2(e) already
established for this module. **If the chair wants all 17 drawn, the rule to change is `deckClear`,
and the consequence is a ford's dashes beside a deck's parapets at the same crossing** — which is a
real period fact (the old ford survives beside the new bridge) and a taste call, not a bug.

## §4.6 · THE GLYPH — and it is reported **THIN**

Plan-view, minimal ink, deliberately the OPPOSITE mark to the deck: a deck is a SOLID with two hard
parapets; a ford is an ABSENCE with two DASHED margins and three transverse bed bars. 2 elements,
5 primitives per ford, in its own `<g id="fords">`.

⚠⚠ **THERE IS NO FORD PLATE IN THE DETAIL REGISTER, AND IT IS REPORTED THIN RATHER THAN CITED** —
exactly as V-QUAY's header requires of a member with no anchor. The dashed-margin idiom is the
convention this file already uses for a bound that is CROSSED rather than built (the sanctuary
bound, the wall ditch, the market's fossil outline); the bed bars are `pierDeckEdge`'s pile row
turned across the way. **Flagged for the chair's taste gate.**

⭐ **THE GROUP ID IS A CLASSIFICATION, NOT TIDINESS.** Instrument 4 reads salience by group and ink
at the SVG root falls to the classifier's chrome rule. ⚠ **THE BRIDGES ARE STILL AT ROOT AND ARE
THEREFORE STILL MIS-FILED** — a REG-3-owned classification question, recorded rather than grabbed
(§9 deferral 4).

---

# §5 · THE §110.3 DECLARED-SHIFT TABLE

⭐⭐ **NOTHING IS RE-RECORDED, BECAUSE NOTHING SHIFTED UNARMED.** §110.3 requires the table to be
quoted in the commit that re-records a declared shift; this wave's shift is **armed-only**, so the
28 sealed artifacts and the manifest are byte-identical and no golden moves. The table below is
therefore the declaration of **what moves when each arm is lit**, enumerated per artifact and per
arm, so a reader can attribute any future movement to one flag rather than to the wave.

| artifact | `--river` | `--deck` | `--ford` |
|---|---|---|---|
| `town-town-parchment.svg` | MOVES | MOVES | — |
| `town-town-watercolor.svg` | MOVES | MOVES | — |
| `town-town-darkFantasy.svg` | MOVES | MOVES | — |
| `town-town-vtt.svg` | MOVES | MOVES | — |
| `town-town-accessible.svg` | MOVES | MOVES | — |
| `town-town-illustrated.svg` | MOVES | MOVES | — |
| `town-2-town-parchment.svg` | MOVES | — | MOVES |
| `highwater-town-parchment.svg` | MOVES | MOVES | — |
| `siege-town-parchment.svg` | MOVES | MOVES | — |
| `plague-town-parchment.svg` | MOVES | MOVES | — |
| `famine-town-parchment.svg` | MOVES | MOVES | — |
| `year-018-town-parchment.svg` | MOVES | MOVES | — |
| `year-100-town-parchment.svg` | MOVES | MOVES | — |
| `crossing-town-parchment.svg` | MOVES | MOVES | MOVES |
| `manifest.json` | MOVES | MOVES | MOVES |

**MOVED by at least one arm: 15 of 29. UNMOVED: 14** — `city` × 6 lenses, `fjord`, `migration`,
`hamlet`, `metropolis`, `mountain`, `polycentric`, `thorp`, `village`.

⭐ **THE UNMOVED SET IS THE STRONGEST STATEMENT IN THIS TABLE.** It is exactly the leaves with no
RIVER — the three COASTAL ones (`city`, `fjord`, `migration`) and every dry leaf. A width profile
that leaked into a coast, or a deck law that touched a leaf with no water, would show here. None
does. ⚠ `town-2` moves under `--river` and `--ford` but **not** under `--deck` — it has zero
bridges, which is why it is the leaf that ends up showing a ford (§4.5).

---

# §6 · THE CORPUS LEG — rule-first crops

`harness/laneBRIDGE/bridgeCrops.mjs`, tier **`quicklook`** (§634.2's ITERATION tier — noted as
such: an EXIT leg owes headless Chrome, and these are for judging shape). ⭐ **THE RULE IS WRITTEN
BEFORE ANYTHING IS RENDERED** and travels beside every box, per the kit's own law:

| crop | rule | box | selected |
|---|---|---|---|
| `town` DECK | *the deck whose displacement between the unarmed and armed arms is the LARGEST on this leaf* | `550 417 190 190` | `bridge\|street.high\|46`, moved **12.34** units |
| `crossing` DECK | (same rule) | `535 408 190 190` | `bridge\|street.high\|55`, moved **41.73** units |
| `highwater` DECK | (same rule) | `549 419 190 190` | `bridge\|street.high\|86`, moved **13.02** units |
| `town-2` FORD | *the FIRST drawn ford in key order on this leaf* | `421 259 190 190` | `ford\|street.high\|0`, span 15.11, wet 20.82, re-sited |
| `crossing` FORD | (same rule) | `464 455 190 190` | `ford\|street.road.high.corridor.0~frame.0\|1` |
| `town` FORD | (same rule) | — | **RULE UNSATISFIED, and the refusal is printed**: no ford is drawn on this leaf |

BEFORE and AFTER share the SAME box — a crop pair whose frames differ is two pictures, not a
comparison. Plus 90-unit `ZOOM-*` pairs on `town` DECK and `town-2` FORD.
All in `$SP/bridge-crops/`, with `SHEET.txt` carrying every rule beside its box.

## ⭐ WHAT THE CROPS ACTUALLY SHOW — read honestly, including what is not good

**The taper is unmistakable.** On `town`'s 190-unit crop the channel is visibly narrow upstream and
visibly broad downstream, with the meander bends fuller than the straights. This is the single most
legible change in the wave and it is exactly the "generator's tell" §641.5 named.

**The deck reads as a structure square to its river, with the road bending onto it.** Before, the
deck was a thin quad lying ALONG the road and reading as a patch of pavement; after, it is a slab
across the channel with parapets and pier bars, and the carriageway turns to meet it.

⚠⚠ **AND THE THING THE CHAIR SHOULD SEE, WHICH THIS WAVE DID NOT CAUSE AND DID NOT CURE: THE ROAD
BAND IS DRAWN OVER THE WATER.** Streets paint at stage 11, the watercourse at 6a, so at every
crossing the river disappears under the carriageway — which caps how much ANY bridge can read as a
bridge, because there is no visible water for it to span. The deck law makes the geometry right
and the ink cannot fully show it. **This is a z-order/ink question for REG-6 or a lens wave, it
moves every river leaf, and it is recorded rather than grabbed** (§9 deferral 8).

⚠ **THE FORD GLYPH IS THE WEAKEST INK IN THE WAVE and it is flagged, not defended.** At page
register the two dashed margins read as *"two dashed lines"* more than as *"a crossing"*, and the
three bed bars are nearly lost. It is reported **THIN** (§4.6) because there is no ford plate in the
detail register to bind to. **Taste gate: the chair should look at `ZOOM-town-2-FORD-AFTER` before
this glyph is treated as settled.**

---

# §6b · DELIVERABLE 5 — THE `carto:bridge` DISPOSITION

## §6.1 · ⛔⛔ THE CORRECTION OF RECORD THE CHAIR MUST SEE FIRST

§641.5 describes `carto:bridge` as *"the one users see today."* **That is false, and the code says
so in two greps.**

`grep -rn "carto:bridge" src tests harness` returns **exactly two hits, both inside its own
producer** (`cartographyDefenses.js:241` and `:254`). I ran this myself rather than inheriting it.

The record is `{ id, waterIndex, waterSegment, streetId, position }` — **no centreline, no heading,
no width, no deck.** It is a bare point. `bindCanonicalInfrastructureRefs`
(`cartographySynthesis.js:250-253`) then **drops the id on the floor**: it builds
`witnessRows.push({ position })` and returns *canonical* manifest ids. Verified by reading the
function. So a `carto:bridge`'s entire causal reach is: *its position selects which already-existing
manifest bridges get listed in `cartography.streets.bridgeRefs`* — and that block is
`townCartographyEnabled: false` (`simulationRules.js:746`, under a comment reading **"DECLARED
DARK"**), verified.

**No `carto:bridge` feature has ever been drawn, labelled, exported or sold.**

## §6.2 · ⭐⭐ THERE IS A **THIRD** FAMILY, AND IT IS THE ONE USERS SEE

`buildSceneWaterInfrastructure` — `src/domain/townScene/sceneTerrainNetwork.js:358`, ids
`bridge:<digest>`. Unlike the carto family it has everything the carto family lacks: **length
derived from river width** (`lengthPlan = water.widthPlan + (causeway ? 26 : 16)`, `:392`), a real
**centreline** (`:394-399`), an **orientation** (`headingStep`, `:410-413`), width, deck elevation,
material, and a `causeway` variant for coasts. It reaches pixels through
`compileTownSceneGeometry.js:563-566` → `deckBatch(...)`, on the 3D settlement portrait
(`SettlementScene3D` → `TownSceneCanvas`), behind `settlementScene3d: true` with
`settlementScene3dDefault: false`.

`buildFabric` has **no application-side caller** — confirmed: every import is test or harness, and
`grep -rn "from .*buildFabric.js" src/` is empty. `renderFolio` is harness-only.

## §6.3 · RECOMMENDATION: **LET IT DIE AT CUTOVER**

The decisive evidence is `cartographySynthesis.js:250-253` dropping the candidate id, not the cost.
Aligning `carto:bridge` would mean plumbing a river-width profile into a second pipeline that has
no width channel at all, **breaking the cartography block's own founding law** (`cartographyContract.js:82`,
*"Gates and bridges are REFERENCES, never copies"*), and re-capturing a **54-digest whole-manifest
golden** (`tests/property/townCartographyDormancyGolden.test.js`, 18 configs × 3 audiences) — all
for records that reach no pixel, in a module the owner's own doctrine says *"does not grow into a
parallel generator"* (ODQ:10936) and must not be *"extend[ed] in parallel"* (HANDOFF:459).

⭐ **AND A RECOMMENDATION THE CHARTER DID NOT ASK FOR:** if the chair wants a **user-visible** bridge
win before cutover, the file to open is `src/domain/townScene/sceneTerrainNetwork.js:358`, not
`cartographyDefenses.js`. That family already derives its deck length from river width and already
orients its deck — it is the closest thing in the shipped product to what this lane just built, and
it would consume a width profile naturally. **Owner-gated (paid/shipped surface); flagged, not
touched.**

⚠ **§641.5's sentence should be amended when this disposition is banked.**

---

# §7 · THE ALWAYS BLOCK

## §7.1 · DORMANCY — **29 of 29 byte-identical to the seal, TWICE, taken after the last edit**
```
   D-off-1   29 of 29 BYTE-IDENTICAL to the seal
   D-off-2   29 of 29 BYTE-IDENTICAL to the seal
```
Proved three times over the lane's life: after the profile mint, after the consumer sweep, and at
the tip. Every local-width site branches on the profile's PRESENCE, so this is true by
construction and not by a float comparison (§2.4).

## §7.2 · DETERMINISM — **29 of 29 on five arms, every one with its own liveness control**
⛔ **LITERAL FLAGS ON THE COMMAND LINE.** zsh does not word-split an unquoted `$var`, so a
flags-in-a-variable loop passes the whole string as ONE argument and every arm renders UNARMED
while the double-run still reads 29/29 (§635.1, banked). Every arm below is spelled out.
```
   arm                                                double-run   differs-from-unarmed
   (none)                                              0 of 29       0 of 29   (the reference)
   --river                                             0 of 29      15 of 29   LIVE
   --river --deck                                      0 of 29      15 of 29   LIVE
   --river --deck --ford                               0 of 29      15 of 29   LIVE
   ALL REG ARMS + --river --deck --ford                0 of 29      29 of 29   LIVE
```
⭐ **AND EACH NEW ARM'S OWN CONTROL, which the rows above cannot give** — the row
`--river --deck` vs unarmed cannot tell a live `--deck` from a `--deck` that renders nothing,
because `--river` already moved those 15 files:
```
   --river --deck            vs  --river                    14 of 29 differ   LIVE
   --river --deck --ford     vs  --river --deck              3 of 29 differ   LIVE
   --deck ALONE              vs  unarmed                    14 of 29 differ   LIVE
   ALL + the three new arms  vs  ALL REG ARMS (no new)      15 of 29 differ   LIVE
```
⭐ **`--ford`'s 3 IS THE MOST INFORMATIVE NUMBER HERE**: `town-2`, `crossing` and the manifest —
exactly the two leaves that draw a ford (§4.5) and nothing else. A ford pass that drew on every
river leaf, or on none, would read differently.
⭐ **`--deck ALONE` at 14 proves the deck law is live WITHOUT a profile**, which is what J-BR-5's
arm split was for: it cures the floating decks and the four angles against a constant width.

## §7.3 · THE BYTE + OP CEILINGS AT THE **FULL** ARM SET — every tier holds, and a tier-setter MOVES
Measured at `--fuse --rampart --shapes --market --footprint --quay --vquay --river --deck --ford`,
which is the arm set §641.4's table was minted from PLUS this wave.
```
   OVER the signed BYTE ceiling:  NONE
   OVER the signed OP   ceiling:  NONE
   TIGHTEST bytes:  crossing (town)   margin  1,859 = 0.33 %
   TIGHTEST ops:    migration (city)  margin     80 = 0.79 %
```

⚠⚠ **THE CHAIR MUST RULE ON ONE THING: THIS WAVE MOVES THE BYTE TIER-SETTER AND HALVES TOWN'S
MARGIN.** §641.4 signed town at 560,000 against a fixed-point maximum of 555,362 set by
`polycentric` — a margin of **4,638 B / 0.84 %**. Armed with this wave, `polycentric` is unchanged
(it has no river) but **`crossing` rises to 558,141**, leaving **1,859 B / 0.33 %**. The town tier
is now set by a leaf the byte table never named, at 40 % of the margin that was signed.

**It is not an overrun and nothing is over.** But §641.4's own coupling law — *"an op-ceiling raise
owes a byte re-measure in the same act"* — plainly generalizes: **an ARM owes a byte re-measure
too**, and town's headroom is now thin enough that the next wave to add ink on a river leaf will
meet it. Recorded so the chair signs it deliberately rather than meeting it on the next wave.

### AND THE WAVE IS A NET SAVING, which is not what a mint usually is
```
   town       −9,766 B  −266 prims      siege     −9,733 B  −268 prims
   town-2       −233 B  −104 prims      plague    −9,767 B  −266 prims
   highwater  +11,036 B  +132 prims     famine    −9,762 B  −266 prims
   year-018   −6,115 B  −139 prims      year-100  −7,758 B  −186 prims
   crossing   +16,045 B   +31 prims
   ─────────────────────────────────────────────────────────────────
   TOTAL      −26,053 B  −1,332 prims
```
⭐ The decimated water band is cheaper than the constant-width stroke it replaces (J-BR-4), and the
tapered claim frees or takes ground per leaf — `crossing` gains 36 parcels at its narrows while
`town` loses 53 at its wide reaches. **The two positive leaves are fabric changes, not ink changes.**

## §7.4 · THE WALKERS — **318 / 318 AT THE COMMITTED TIP `9de729021`**
Run three times over the lane: after the fabric sweep, at the working tip, and again after the
commit. The figure quoted is the last one. Fifteen files, 318 collected, 318 passed.
⭐ **NOTHING WAS REGISTERED AND NOTHING NEEDED TO BE**, and that was designed for: the profile
hashes nothing (no new `randomNamespaces`, no `statefulForkSites` move, no hand-minted key), and
every new derivation lives inside `waterMode.js` / `waterWorks.js` / `routes`-adjacent code whose
stage nodes ALREADY allow the imports used (`S4` allows `substrate.js`; `S7` and `S17` already
allow `waterMode.js`; `S4>S7` and `S4>S17` already exist). J-REG5-8's precedent, applied on
purpose rather than discovered.

## §7.5 · NEW TEST FILES — **NONE.** Three-ratchet delta: **0 / 0 / 0**
Every new probe is a HARNESS file (`harness/laneBRIDGE/*`), not a test. `tests/` gained no file and
the touched test files gained no case — in fact **no test file was touched at all**. Collected
stays 318.

---

# §8 · JUDGMENT CALLS — all vetoable

| # | call | why, and what was rejected |
|---|---|---|
| **J-BR-1** | The profile is **READ from the substrate** (accumulation envelope · valley confinement · meander bend) and **hashes nothing**. | A seeded taper would be a seed-permanent world fact under THE PROMISE (§251.5's own ground), and it would owe both key registries REG-5 §15 banked. Reading the ground costs neither and cannot contradict a later truth. Rejected: a hashed per-leaf taper amplitude — cheaper to write, impossible to defend. |
| **J-BR-2** | The profile's **arc-weighted mean is normalized to the nominal width**. | Rejected: letting the mean float. That would tangle *"the river got bigger"* into a declared shift that is supposed to be about SHAPE, and it would move the claim area, the ground law's refusals and the byte spend for a reason nobody could attribute. Measured residual drift +0.17…+0.67 %. |
| **J-BR-3** | `rel.width` keeps its meaning (**nominal**) and the profile is a NEW field with ONE accessor (`widthAt`/`stationAt`). | Rejected: redefining `rel.width` as a local function. Thirty read sites, of which at least six genuinely want a leaf-scale constant (de-dup spacing, gate spacing, grid cells). Redefining the scalar would have silently made those six wrong. |
| **J-BR-4** | The channel is drawn as a **decimated filled band**, not a segmented variable stroke. | A per-run stroke sequence costs ~90 bytes of element overhead per run — at 40–80 runs a leaf that is +4–7 KB against town's 4,638-byte §641.4 margin. The decimated band measures **−5,321 B on town**. Rejected on the byte gate, which §641.4 says binds first at town+. |
| **J-BR-5** | **THREE arms** (`--river`, `--deck`, `--ford`), each dormancy-provable alone. | The REG-4 precedent is explicit (`--market` / `--footprint` split *"because that arm can SUPPRESS a drawn body"*). `--deck` is meaningful without `--river` (it cures the floating decks against a constant width); `--ford` is meaningful without either (it draws records that exist). One arm would have made every figure unattributable. |
| **⭐⭐ J-BR-6** | The **drawn** ford re-sites; the **founding** `routes.crossings` record does not. | Re-siting at birth moves `corridorPull` → moves the nucleus → moves the whole town on every river leaf, swamping this wave's visual evidence. §637.2's *"the road follows the bank to the crossing"* is a faithful reading of the split. **⚠ THE ALTERNATIVE IS STRONGER AND IS OWNER-GATED, NOT REFUSED** — veto this and the record moves too, at the price of a corpus-wide re-baseline. |
| **⭐⭐ J-BR-7** | `kinkMaxTan` **0.70 → 3.73 (75°)**. | Not "loosen until it passes": the clause had inverted L-REG-31, which says the DECK WINS and the road bends. A budget trading squareness against a road's convenience implements the opposite of its own law. Swept over the corpus before changing (§3.4); the corridor answers the distance question. |
| **J-BR-8** | The deck is aimed on the **shortest wet crossing**, not on a windowed tangent — **accepting that this makes the angle census non-independent**. | Measured: the windowed normal is 22–28° off on `town`'s own high street. Aiming at a window aims at an artefact. The tautology is declared in §3.2 and the census's weight is moved onto its controls and onto the endpoint/narrows arms. Rejected: keeping the windowed aim to preserve an independent census — that preserves the *appearance* of evidence at the cost of the drawing. |
| **J-BR-9** | The narrows census scores against **`narrowsAdmissible`**, with `narrowsCorridor` reported beside it. | §637.1 has two clauses and scoring against the corridor minimum alone convicts the law for obeying its second one. Both figures are published so the chair can see the gap (3–22 %) rather than take my word that it is lawful. |
| **J-BR-10** | A ford is **never drawn under a deck** (`deckClear = 2.2 local widths`), which leaves **2 of 17** drawn. | The records and the decks are the same crossings (measured, §4.1). Rejected: drawing all 17 — that lays dashes across parapets. ⚠ The opposite call is defensible (the old ford beside the new bridge is a real period fact); it is a taste call and the constant is the one to change. |
| **J-BR-11** | `waterClaims` still returns **ONE claim**, carrying `widths`; `claimSegments` spends them per segment. | Rejected: N per-segment claims — reds `townMapFabricBuildOut:1415`, and that pin is right (a claim is a thing, not a list of slices of one). `claimIndex` was already local-ready. |
| **J-BR-12** | `across` is **kept and left lying**, with `tangent` added beside it. | A published fabric field cannot be renamed in place. The census proved `across` has zero readers, so the honest field is free and the lying one is inert. Rejected: deleting `across` — a record-shape change for no reader's benefit. |
| **J-BR-13** | `walls.js:390`'s half-ring filter, `seating.js:146` and `wallRuns.js:247` stay **NOMINAL**. | All three are leaf-scale defensive reaches, and `walls.js:454` / `rampartWorks.js:518` both record the half-ring filter as deliberately frozen because moving it moves the ring, the band, the district partition and every census downstream. Dispositioned, not missed. |

---

# §9 · DEFERRED, WITH REASONS — documented, not bugs to re-find

1. **`walls.js:390`'s half-ring filter reads the NOMINAL width.** Deliberately frozen by two
   standing comments; moving it moves the ring on every bankside and coastal leaf. J-BR-13.
2. **`seating.js:146` and `wallRuns.js:247`** — port/mill siting reach and the
   `water-termination` threshold, both `width × 1.6`, both left nominal. `townMapWallRuns.test.js:127-140`
   carries a NON-VACUITY arm that reds if `water-termination` runs stop being produced, so a
   thoughtless local-ization here has a tripwire.
3. **`fabricDcel.js:203-207`'s `WATER_EDGE` offsets** are still nominal. `offsetLine` would need a
   per-vertex offset. Its header declares it *"only quantizes and nodes"* a boundary the domain
   published, so the variable offset must come from the domain — a real change, not a patch, and
   the DCEL is not exercised by this corpus.
4. **The BRIDGES are still emitted at the SVG root with no group id**, so the salience classifier
   files them as chrome. Fixing it moves a REG-3 baseline. Recorded; the fords take a group.
5. **`buildFabric.js:1423-24`'s `riverClaimWidth` / `riverDrawnWidth` meta pair** now reports
   `claims[0].width` (nominal) beside the drawn nominal — the coherence check still passes but no
   longer sees the profile. A min/median/max digest would be the honest replacement.
9. **`RAMPART_TAIL_RESERVE` is declared and never used** (`renderFolio.mjs:245`). Noticed while
   costing the ford pass against `TAIL_RESERVE`; not this lane's.
10. **The main checkout is carrying 3,374 unstaged deletions and 1,267 modifications**, including
   all of `src/domain/townCartography/`. Observed while verifying §6 (nothing touched). ⚠ If that
   is not a sibling mid-operation, someone should look.

---

# §10 · FILE MANIFEST

| file | +/M | why |
|---|---|---|
| `src/domain/townMap/fabric/waterMode.js` | **M** | `RIVER_PROFILE`, `deriveWidthProfile`, `stationAt`, `widthAt`, `widthAtIndex`; the profile carried across `deriveWaterMode`'s whitelist; `isInWater` asks the local width |
| `src/domain/townMap/fabric/waterWorks.js` | **M** | `DECK_LAW` + `siteDeck`/`fitDeck`/`shortestCrossingAt`/`wetCrossing`; `FORD_LAW` + `deriveFords`; local width in `waterMeetings`, `waterClaims`, the bridge span, the mooring probe, `wetAt`, the water gate, the field clip; `tangent` beside `across` |
| `src/domain/townMap/fabric/buildFabric.js` | **M** | the three arms threaded; `medianBlockDimension` (√area); the ford register derived and published |
| `src/domain/townMap/fabric/reservedGround.js` | **M** | `claimSegments` spends a per-vertex `widths` when a claim carries one |
| `src/domain/townMap/fabric/leafCensus.js` | **M** | the census's reach, claim band and lattice pitch track the profile |
| `src/domain/townMap/fabric/publication.js` | **M** | `waterText` digests the profile, so a governed surface cannot go blind to it |
| `src/domain/townMap/fabric/wallCircuit.js` | **M** | the frozen `waterWidth` column's VALUE widens; no key added |
| `harness/renderFolio.mjs` | **M** | `paintRiverBody` (the decimated variable-width band); the deck honours `reach`; the ford pass |
| `harness/exemplars.mjs` | **M** | `--river`, `--deck`, `--ford` |
| `harness/laneREG5/bridgeAngles.mjs` | **M** | the wet set reads the profile; radial step from the MIN; `crossingOnBearing` exported |
| `harness/laneBRIDGE/probeProfileInputs.mjs` | **+** | the taper-signal measurement that preceded every constant |
| `harness/laneBRIDGE/profileCensus.mjs` | **+** | the profile liveness census + 3 controls |
| `harness/laneBRIDGE/deckCensus.mjs` | **+** | the endpoint / angle / narrows censuses + 4 controls |
| `harness/laneBRIDGE/bridgeCrops.mjs` | **+** | the rule-first corpus leg |

---

# §11 · EXACT RE-RUN

```zsh
SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad
git worktree add "$SP/laneBRIDGE-tree" a303815ae972975a475dd2461daac536478c3542
cd $SP/laneBRIDGE-tree && mkdir -p node_modules
cp -R /Users/cstokes/Desktop/settlement-engine/node_modules/seedrandom node_modules/
cd $SP/laneBRIDGE-tree/node_modules && for e in /Users/cstokes/Desktop/settlement-engine/node_modules/*; do b=$(basename $e); [ -e "$b" ] || ln -s "$e" "$b"; done
mkdir -p .bin && for e in /Users/cstokes/Desktop/settlement-engine/node_modules/.bin/*; do b=$(basename $e); [ -e ".bin/$b" ] || ln -s "$e" ".bin/$b"; done   # ⛔ REG-5 §14 OMITS THIS

cd $SP/laneBRIDGE-tree
node harness/exemplars.mjs $SP/bridge-base                    # 29 files, the dormancy reference
node harness/laneBRIDGE/probeProfileInputs.mjs                # the signals, before the constants
node harness/laneBRIDGE/profileCensus.mjs --controls          # 9/9 live · C1/C2/C3 LIVE
node harness/laneREG5/bridgeAngles.mjs --controls             # REG-5's instrument, unchanged verdict on the seal
node harness/laneBRIDGE/deckCensus.mjs --controls             # 18/18 ×4 · C1a/C1b/C2/C3/C4 LIVE
node harness/laneBRIDGE/bridgeCrops.mjs --out=$SP/bridge-crops --leaf=town,town-2,crossing
npx vitest run tests --pool=threads --maxWorkers=2            # 318 / 318
#   ⛔ NOT `--reporter=basic`; ⛔ `--poolOptions.threads.*` does not exist in vitest 4

# ── the always block · ⛔ LITERAL FLAGS, NEVER $flags (zsh passes the whole string as ONE arg)
node harness/exemplars.mjs $SP/bridge-always/D-off-1
node harness/exemplars.mjs $SP/bridge-always/D-off-2
node harness/exemplars.mjs $SP/bridge-always/D-r-1    --river
node harness/exemplars.mjs $SP/bridge-always/D-r-2    --river
node harness/exemplars.mjs $SP/bridge-always/D-rd-1   --river --deck
node harness/exemplars.mjs $SP/bridge-always/D-rd-2   --river --deck
node harness/exemplars.mjs $SP/bridge-always/D-rdf-1  --river --deck --ford
node harness/exemplars.mjs $SP/bridge-always/D-rdf-2  --river --deck --ford
node harness/exemplars.mjs $SP/bridge-always/D-d-1    --deck
node harness/exemplars.mjs $SP/bridge-always/D-all-1  --fuse --rampart --shapes --market --footprint --quay --vquay --river --deck --ford
node harness/exemplars.mjs $SP/bridge-always/D-all-2  --fuse --rampart --shapes --market --footprint --quay --vquay --river --deck --ford
node harness/exemplars.mjs $SP/bridge-always/D-allNoBr-1 --fuse --rampart --shapes --market --footprint --quay --vquay
```

⚠ **`--deck` roughly doubles a river leaf's build time** (the crossing sweep is ~34 stations ×
25 bearings × a bisected wet walk). Corpus render: 15.7 s unarmed → ~35 s with `--deck`.

---

# §12 · MEMORY ROWS PROPOSED TO THE CHAIR

Topic files not written; **`MEMORY.md` NOT touched**, per the index law.

1. **`a-ratio-between-two-wet-definitions-is-a-constant.md`** — 0.62 vs 0.5 produced a uniform
   `excess = 1.22` across the whole corpus, on decks measured 0.0° from square. A ratio taken
   against two definitions of the same object convicts UNIFORMLY, which is what a real corpus-wide
   defect looks like.
2. **`a-correct-guard-firing-on-the-wrong-frame.md`** — three bugs in one deliverable, all
   presenting as clean lawful refusals: the wrong direction frame, the near-zero chord whose
   denominator vanishes at exactly the configuration you want to accept, and the refinement that
   refuses what the sweep accepted.
3. **`the-lane-node-modules-bin-shim.md`** — REG-5 §14's per-package symlink recipe omits
   `node_modules/.bin`, and the gate then dies with `vitest: command not found`, which reads as a
   missing dependency and is a missing shim directory.
4. **`identity-resolved-after-a-move.md`** — the ford keyed to a religious-quarter block lane.
5. **`carto-bridge-reaches-no-pixel.md`** — the §641.5 premise correction, with the two-hit grep
   and `bindCanonicalInfrastructureRefs`' id drop as the evidence.
