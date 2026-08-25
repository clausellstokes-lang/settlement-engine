# lane REG-SEAM — THE BAND-SEAM CURE — RECEIPT

Lane: REG-SEAM (Opus implementer seat). Chair: Fable. Scope ruled at **ODQ §631.3** (R1(a)(ii)
adopted) plus **§632.4 / §633.3** (the `OP_CEILING_BY_TIER` §628 landing + a mandatory
seam-window liveness probe).

- **Base / seal:** `7fba086d507de09de5586bd7ee7436a01abda002` = `refs/preserve/map-sandbox-reg4-markets` (the CORRECTED REG-4 seal, §633.1).
- **Worktrees:** cure tree `$SP/laneREGSEAM-tree` (detached) · **pristine control tree `$SP/regseam/BASE-tree`** (detached at the same SHA, used for every pre-cure reading).
- **Evidence dir:** `$SP/regseam/`.
- Never edited the shared tree; never `git add -A`; never moved a ref.

---

## §0 · SCOPE ECHO — the six items, as ruled

| # | Item (§631.3 verbatim scope) | Status |
|---|---|---|
| 1 | `TIER_PROFILE.pop` reconciles to POPULATION_RANGES exactly — town [901,5000] · city [5001,25000] · metropolis [25001,100000] | ✅ DONE |
| 2 | Comment repairs: the `:510-512` docblock made TRUE and noted; the §161f-quoting prose verified consistent | ✅ DONE (+2 further comment repairs found and made) |
| 3 | `compile.js:115` provenance string — confirm truthful by reading what `tierScale` feeds it | ✅ CONFIRMED (see §3) |
| 4 | Delete the vestigial identical-branch conditional at `tierScale()` | ✅ DONE |
| 5 | THE GUARD — producer-equality both ways, ADDED CASES in an existing fabric test file, with a convicting mutation | ✅ DONE |
| 6 | `OP_CEILING_BY_TIER` lands the §628-signed values + the FIXED-POINT re-measure | ✅ DONE — ⛔ **and it convicts: the city tier now breaches its signed ceiling** |

---

## §1 · SETUP PROOF

```
git worktree add "$SP/laneREGSEAM-tree" 7fba086d507de09de5586bd7ee7436a01abda002   → exit 0
mkdir -p node_modules && cp -R <repo>/node_modules/seedrandom node_modules/         → exit 0
node harness/exemplars.mjs <dir>                                                    → 29 files  ✅ BASELINE
```

⚠ A second pristine worktree `$SP/regseam/BASE-tree` was cut at the SAME SHA so every pre-cure
reading is taken by EXECUTION at the seal rather than by memory or by reverting the cure tree.
`git stash` was not used (briefs forbid it).

⚠ **VITEST RESOLUTION, DECLARED.** The sparse sandbox ships no lockfile, so `npm ci` fails with
EUSAGE. For the test arms the main repo's `node_modules` entries were **symlinked per-entry**
(438 linked, `seedrandom` kept as the real copy). The sandbox's `package.json` is the repo's own
40-dep manifest, and the resolution check reports **3 missing: `three`, `@types/node`, `pg`** —
none of which the fabric suite imports (3D scene, TS types, postgres). ⛔ Per the standing law an
exit code with no collected-test count is not a verdict, so **every test figure below is quoted
with its collected count.**

---

## §2 · THE DIFF, ITEM BY ITEM

### Item 1 — `src/domain/townMap/fabric/tierGrammar.js` · `TIER_PROFILE.pop`

```
- town:       { pop: [901, 8000],   ...
- city:       { pop: [8001, 40000], ...
- metropolis: { pop: [40001, 200000], ...
+ town:       { pop: [901, 5000],   ...
+ city:       { pop: [5001, 25000], ...
+ metropolis: { pop: [25001, 100000], ...
```
Thorp / hamlet / village rows byte-unchanged. A ~40-line docblock was added above the table
stating the defect, the elegy inversion, the mirror law, the pinned thorp exception and the
§110.3 declared shift.

### Item 2 — comment repairs (four, two of them beyond the ruled two)

| Site | Repair |
|---|---|
| `tierForPopulation` docblock (was :510-512) | The equivalence claim is now TRUE and is **noted as having been FALSE when written** — the file asserted a contract its own table broke. Points at the guard that now enforces it. |
| `GRAIN_SEAMS` docblock (was :453-454) | §161f's "a 5,000-soul town and a 5,001-soul city" quotation **VERIFIED consistent** — no edit needed; recorded as CHECKED so a later reader does not "helpfully" update it to a fork's numbers. |
| ⭐ `bandPosition` docblock (found, not in the brief) | Its worked example read "a town spans 900→8,000" — a **third** place the old fork was spelled in prose. Corrected to 901→5,000 with the argument restated (the reconciled bands still span 5.5× / 5× / 4×, so the square-root read is if anything better justified). |
| ⭐ `renderFolio.mjs` §217 docblock (found, not in the brief) | Said "THE FIGURES BELOW ARE THE MEASURED MAXIMUM…" naming the pre-REG-2 ladder, and the `REG_OP_CEILINGS` block said "the pin below is **NOT** the signed table". Both were made false by item 6 in the same commit; both repaired. |

### Item 4 — the vestigial conditional

```
- const occupancyTier = typeof settlement?.tier === 'string' && TIER_PROFILE[settlement.tier]
-   ? tierForPopulation(current)                         // occupancy always follows souls
-   : tierForPopulation(current);
+ const occupancyTier = tierForPopulation(current);
```
Recorded in place as a **fossil of the REJECTED R2 cure** (wiring occupancy to the stored tier),
not as dead tidying: R2 would make stored and derived tiers always agree and blind §161g's
demotion signal permanently. An identical-branch conditional is an invitation to "finish" exactly
that. A test pin (§5, arm 7) now reds if anyone does.

### Item 6 — `harness/renderFolio.mjs` · `OP_CEILING_BY_TIER`

```
- thorp: 1000, hamlet: 1200, village: 1800, town: 4600, city: 6400, metropolis: 9700,
+ thorp: 1000, hamlet: 1400, village: 2000, town: 9300, city: 10000, metropolis: 14200,
```

---

## §3 · ITEM 3 — THE PROVENANCE STRING, TRACED (CONFIRMED)

`compile.js:115` publishes `put('tier-occupancy', scale.tier, 'popToTier(population)', 'derived')`.
Traced by reading, hop by hop, at the cured tip:

| hop | file:line | what it establishes |
|---|---|---|
| 1 | `fabric/compile.js:109` | `const scale = tierScale(s);` |
| 2 | `fabric/compile.js:115` | the published VALUE is `scale.tier` |
| 3 | `fabric/tierGrammar.js` `tierScale()` | `const occupancyTier = tierForPopulation(current)` (post item 4, unconditional) |
| 4 | same | `current = Number.isFinite(settlement?.population) ? Number(settlement.population) : 0` |
| 5 | same, return | `tier: occupancyTier` |
| 6 | the guard, `townMapFabricBuildOut.test.js` | `tierForPopulation ≡ popToTier` by execution over 120,000 populations |

So the published value **is** `popToTier(population)`, and the receipt is truthful.
⚠ It was ALREADY truthful in intent and false in fact before this car — which is precisely how the
defect hid for four waves. **No edit made** (the brief expected none): the string names the
CANONICAL authority, which is what a provenance receipt should name, and changing it to name the
local spelling would trade a now-true statement for a less useful one. Consumer census run: the
only other occurrence of the `tier-occupancy` key is its vocabulary description at
`fabric/compile.js:50`; **zero** tests or modules match on the source string.

---

## §4 · THE SEAM-WINDOW LIVENESS PROBE — MANDATORY, AND IT FIRES

Instrument: `harness/laneREGSEAM/probeSeam.mjs` (new harness file — **not** a test file, so no
ratchet is billed). Run at the pristine BASE-tree and at the cure tree, byte-identical script.
Full outputs: `$SP/regseam/probe-PRECURE.txt` · `$SP/regseam/probe-POSTCURE.txt`.

### (a) OCCUPANCY TIER FLIPS — through the real `generateSettlementPipeline → buildTownMapModel → buildFabric` path

| synthetic leaf | stored tier | fabric `meta.tier` PRE | fabric `meta.tier` POST |
|---|---|---|---|
| healthy city @ 6,500 | `city` | ⛔ `town` | ✅ `city` |
| healthy metropolis @ 30,000 | `metropolis` | ⛔ `city` | ✅ `metropolis` |

### (b) THE FALSE ELEGY — `deriveHighWater` on the two HEALTHY probes

```
PRE-CURE                                        POST-CURE
healthy city @ 6,500 (stored 'city')            healthy city @ 6,500 (stored 'city')
  peak population : 8001  ⛔ INVENTED             peak population : 6500
  demoted         : true                          demoted         : false
  deficit         : 0.1876                        deficit         : 0.0000
  evidence: ["stored tier 'city' over a           evidence        : []
             town-scale population — a
             recorded demotion"]
healthy metropolis @ 30,000                     healthy metropolis @ 30,000
  peak population : 40001 ⛔ INVENTED             peak population : 30000
  demoted         : true                          demoted         : false
  deficit         : 0.2500                        deficit         : 0.0000
```

### (c) A REAL DEMOTION STILL FIRES — stored `city` holding 3,000 souls

```
PRE-CURE                                POST-CURE
  derived tier    : town                  derived tier    : town
  peak population : 8001                  peak population : 5001
  demoted         : true                  demoted         : true      ← STILL FIRES
  deficit         : 0.6250                deficit         : 0.4001    ← THE ELEGY SHRINK
```
⭐ **The skeptic panel's figures reproduce exactly** (0.6250 → 0.4001). Declared: a genuine
demotion's step-1 floor drops 8,001 → 5,001 at city and 40,001 → 25,001 at metropolis, so a real
elegy renders slightly smaller. That is the claim getting honest, not the instrument going blind.

### (c2) CONTROLS
```
healthy town @ 4,900                    : demoted=false deficit=0.0000   (both runs — negative control clean)
history-peak town @ 4,000 (ring 12,000) : peak=12000 demoted=true deficit=0.6667   (both runs — UNCHANGED)
```
The history path is a MEASURED population, not a band floor, so no band edit may move it. It did not.

### (e) ⭐ THE MORPHOLOGY BREAK, ON A LEAF WITH NO STORED TIER — a refinement of TE-SEAM's own narrative

TE-SEAM listed "square kind 'market' not 'market-plural', blockDepth 2 not 3" among the visible
breaks. **Both of those read from the EXTENT tier's profile, not the occupancy tier's** — so on a
leaf whose stored tier is `city`, the seam's own false demotion pushed the extent tier back up to
`city` and ACCIDENTALLY restored the city square. The undressed break shows on a leaf carrying no
stored tier at all:

| quantity | @6,500 PRE | @6,500 POST | @30,000 PRE | @30,000 POST |
|---|---|---|---|---|
| occupancy / extent tier | town / town | **city / city** | city / city | **metropolis / metropolis** |
| squareKind | `market` | **`market-plural`** | market-plural | market-plural |
| blockDepth | 2 | **3** | 3 | 3 |
| accentBand | 0.78 | **0.58** | 0.58 | **0.44** |
| organismBand | [6, 6] | **[8, 9]** | [9, 9] | [8, 9] |
| monumentalBudget | 11 | **18** | 18 | **26** |
| roofs / cellsAcross | 1373 / 67.48 | **1414 / 74.79** | 1805 / 84.51 | **2204 / 95.89** |
| footprint | 0.3432 | **0.4311** | 0.5144 | **0.6161** |

### (d) THE CLASSIFIER SWEEP, 1..120,000
```
PRE-CURE   DISAGREEMENTS : 18000    windows : 5001–8000, 25001–40000
POST-CURE  DISAGREEMENTS : 0        windows : (none)
```

---

## §5 · THE GUARD + THE CONVICTING MUTATION

**Home:** `tests/domain/townMapFabricBuildOut.test.js`, describe `§631.3 THE BAND SEAM — producer
equality both ways against the landed POPULATION_RANGES`. **ADDED CASES in an existing file —
zero new test files** (a new test file bills three ratchets at landing).

`src/data/constants.js` **DOES exist in this sandbox tree** (2,704 B, `POPULATION_RANGES` +
`popToTier` byte-identical to the landed spelling), so per the brief it is imported and asserted
BOTH WAYS rather than the table being embedded. It is the file's only generation-side import and
the reason is written in place: the FABRIC may not import it (bounded closure), so the two tables
are spelled twice on purpose and the equivalence must be proved from outside both — and a test is
outside both.

**Census delta, by execution:** pristine BASE-tree **311 collected** → cure tree **318 collected**
= **+7 tests, +0 test FILES**. Same 15 files both sides.

### The seven arms
| # | arm | what it refuses |
|---|---|---|
| 1 | boundary cases | `tierForPopulation ≡ popToTier` at {60,61,240,241,400,401,900,901,5000,5001,**8000,8001,25000,25001,40000,40001**,100000} — the bolded four are in the list BECAUSE they are the old fork's own steps |
| 2 | the 120,000 sweep | zero disagreements; the pre-cure reading of this exact range was **18,000**, so the zero is not vacuous |
| 3 | tables both ways | same tier keys, `TIERS === TIER_ORDER`, ceilings strictly increasing (order matters: the classifier walks low-to-high) |
| 4 | ceilings + floors | every `pop[1]` = `POPULATION_RANGES.max`; every `pop[0]` = `.min` **except the pinned thorp grading floor**; and the bands must TILE (each floor = predecessor's ceiling + 1) |
| 5 | COUNTERFACTUAL | the comparison convicts a mutated COPY (TIER_PROFILE is frozen, so it cannot be sabotaged in place) — the negative control for arms 1–4 |
| 6 | THE CONSEQUENCE ARM | the elegy fires on real demotions and NOT on healthy growth — because a future edit could restore the fork inside `deriveHighWater` and arms 1–5 would all still pass |
| 7 | occupancy follows souls | the rejected R2 cure cannot creep back; extentTier still DOES read the stored tier, so the two are not conflated in either direction |

### THE CONVICTING MUTATION — executed, verbatim
`town.pop[1]` re-planted at the old fork's **8000**.
`sha256` before `e72316e0a0933fed8403430bff031863ba0f08a3927733f9a398d9edb8dfcf0b` → after
`f86015fcd423937c7f40d79fc479e7a204f9e5e350a2ffd6818c8b43a5d3d0f9`.

```
Failed Tests 5

 FAIL … > the two CLASSIFIERS agree on every boundary case, including the four old fork points
AssertionError: expected '5001:town' to be '5001:city' // Object.is equality

 FAIL … > the two CLASSIFIERS agree across a 120,000-population SWEEP — zero disagreements
AssertionError: expected [ 5001, 5002, 5003, 5004, 5005, 5006 ] to deeply equal []

 FAIL … > every band CEILING matches POPULATION_RANGES.max exactly, and every FLOOR matches min — with one PINNED exception
AssertionError: expected 'town.max=8000' to be 'town.max=5000' // Object.is equality

 FAIL … > THE CONSEQUENCE ARM — the elegy fires on REAL demotions and NOT on healthy growth
AssertionError: expected [ Array(1) ] to deeply equal []
+   "stored tier 'city' over a town-scale population — a recorded demotion",

 FAIL … > OCCUPANCY FOLLOWS SOULS UNCONDITIONALLY — the rejected R2 cure cannot creep back in
AssertionError: expected 'town' to be 'city' // Object.is equality

 Test Files  1 failed (1)
      Tests  5 failed | 2 passed | 75 skipped (82)
```
**5 of 7 arms convict.** The two that held are the two that should: arm 3 (ceilings are still
strictly increasing at 8000 — it is an ORDER arm, not a value arm) and arm 5, whose forked copy is
self-contained by construction.

**RESTORE:** `sha256 e72316e0…dfcf0b` — **BYTE-IDENTICAL**, verified by `shasum -a 256`.
**Re-run clean:** `Tests 7 passed | 75 skipped (82)`, exit 0.

---

## §6 · THE CORPUS DELTA — ENUMERATED, AND IT IS **NOT** NEAR-ZERO

⛔ **THE BRIEF'S EXPECTATION WAS WRONG, AND THE MEASUREMENT SAYS SO.** The brief predicted
"ZERO-OR-NEAR" because no corpus leaf lives in the seam windows. **26 of 29 artifacts move in
each arm.** The prediction was right about the WINDOWS and wrong about the MECHANISM: the
reconcile does not only re-classify the windows, it **narrows every town+ band**, and
`bandPosition` is `sqrt((p − lo)/(hi − lo))`. The town band goes from 7,099 wide to 4,099, so a
same-seed leaf sits HIGHER in its band and every interpolated quantity — footprint, organisms,
grain cells, roofs — rises with it. TE-SEAM's own R1(a)(ii) note predicted exactly this ("a broad
same-seed shift across the corpus register"); the chair adopted R1(a)(ii) knowing it.

Both arms rendered at three states — the seal, bands-only, and the cured tip:

| arm | leg 1 seal→bands | leg 2 bands→ceilings | NET seal→tip | unchanged end-to-end |
|---|---|---|---|---|
| unarmed | 25/29 | 25/29 | **26/29** | thorp · hamlet · village |
| all-waves armed | 25/29 | 21/29 | **26/29** | thorp · village · mountain |

⭐ **THE UNCHANGED SET IS THE PROOF OF ATTRIBUTION**: it is exactly the CENSUS-TIER leaves, whose
bands did not move. (`mountain` is a village-tier leaf that moves in the unarmed arm by the
CEILING only — the village ceiling 1,800→2,000 lets its 1,540-primitive spend ration differently;
`hamlet` is the mirror case in the armed arm.)

### Per-leaf, unarmed
| leaf | tier | pop | bandPos PRE→POST | parcels | roofTarget | primitives |
|---|---|---|---|---|---|---|
| thorp | thorp | 27 | 0.6638 → 0.6638 | 4 → 4 | 5 → 5 | 904 → 904 |
| hamlet | hamlet | 220 | 0.6849 → 0.6849 | 43 → 43 | 44 → 44 | 1126 → 1126 |
| village | village | 512 | 0.4716 → 0.4716 | 103 → 103 | 102 → 102 | 1226 → 1226 |
| mountain | village | 512 | 0.4716 → 0.4716 | 73 → 73 | 102 → 102 | 1529 → 1540 (ceiling only) |
| town | town | 3,502 | 0.6053 → **0.7966** | 1016 → 1197 | 1127 → 1291 | 4386 → 4918 |
| town-2 | town | 2,497 | 0.4742 → **0.6240** | 941 → 1073 | 1021 → 1142 | 4526 → 5136 |
| polycentric | town | 3,334 | 0.5854 → **0.7704** | 981 → 1195 | 1110 → 1268 | 4378 → 5107 |
| fjord | town | 3,140 | 0.5616 → **0.7391** | 1103 → 1240 | 1091 → 1240 | 4584 → 5236 |
| siege·plague·famine·year-018·year-100·crossing | town | 3,502 | 0.6053 → **0.7966** | (follow mf-town-01) | | 4340–4421 → 4674–4823 |
| city | city | 20,091 | 0.6147 → **0.8686** | 1487 → 1755 | 1648 → 1834 | 5799 → 6814 |
| migration | city | 20,091 | 0.6147 → **0.8686** | 1487 → 1755 | 1648 → 1834 | 5803 → 6818 |
| metropolis | metropolis | 71,325 | 0.4425 → **0.7859** | 2290 → 2786 | 2488 → 3064 | 7985 → 9557 |
| **highwater** | town | 3,502 | 0.6053 → 0.7966 | 1087 → 1129 | 1127 → 1291 | 4451 → 4531 |

⭐ **`highwater` IS THE ELEGY-FLOOR SHIFT MADE VISIBLE.** It is the corpus's declared demotion
fixture (town population, stored tier `city`). Its `extentTier` stays `city` — the real demotion
is correctly preserved — but its high-water population drops **8,001 → 5,001**, so its extent is
now sized on the city band's TRUE floor. Its parcels move far less than the healthy town leaves'
(1087→1129 against 1016→1197) precisely because its extent is graded on the high water, and the
high water came DOWN while the band position went UP.

### The seam windows themselves
5,001–8,000 and 25,001–40,000 — **18,000 populations, ZERO corpus leaves.** Their behaviour is
proved by §4's liveness probe, never by the corpus. That is what the probe is for.

---

## §7 · THE TWO OP TABLES — AND THE CITY TIER IS OVER

Instrument: `harness/laneREG4/probeOps4.mjs`, unedited. **PRE** column re-executed on the pristine
BASE-tree with `REG_OP_CEILINGS` set to the signed table; **POST** executed on the cured tip with
`REG_OP_CEILINGS` **UNSET** — a native reading at the landed pin, as §632.4 required.

⭐ **INSTRUMENT IDENTITY CONFIRMED:** the PRE column reproduces REG-4's receipt §5 **digit for
digit** across all 18 leaves × all five arms and all six per-tier rows. The instrument is the same
instrument, so the POST movement is attributable.

| leaf | tier | ceiling | BASE PRE→POST | ALL-WAVES PRE→POST | over |
|---|---|---|---|---|---|
| thorp | thorp | 1,000 | 904 → 904 | 968 → 968 | 0 |
| hamlet | hamlet | 1,400 | 1,126 → 1,126 | 1,256 → 1,256 | 0 |
| village | village | 2,000 | 1,226 → 1,226 | 1,431 → 1,431 | 0 |
| mountain | village | 2,000 | 1,540 → 1,540 | 1,764 → 1,764 | 0 |
| town | town | 9,300 | 4,447 → 4,918 | 6,577 → 7,377 | 0 |
| town-2 | town | 9,300 | 4,666 → 5,136 | 6,765 → 7,248 | 0 |
| polycentric | town | 9,300 | 4,428 → 5,107 | 6,583 → **7,514** | 0 |
| highwater | town | 9,300 | 4,610 → 4,699 | 7,305 → 7,484 | 0 |
| fjord | town | 9,300 | 4,743 → 5,236 | 6,205 → 6,766 | 0 |
| siege | town | 9,300 | 4,396 → 4,866 | 6,561 → 7,367 | 0 |
| plague | town | 9,300 | 4,454 → 4,925 | 6,584 → 7,384 | 0 |
| famine | town | 9,300 | 4,453 → 4,924 | 6,583 → 7,383 | 0 |
| year-018 | town | 9,300 | 4,479 → 4,949 | 5,938 → 6,584 | 0 |
| year-100 | town | 9,300 | 4,542 → 5,020 | 6,803 → 7,435 | 0 |
| crossing | town | 9,300 | 4,580 → 4,868 | 6,841 → 7,092 | 0 |
| **city** | city | 10,000 | 5,799 → 6,814 | 8,185 → **10,004** | ⛔ **4** |
| **migration** | city | 10,000 | 5,803 → 6,818 | 8,189 → **10,008** | ⛔ **8** |
| metropolis | metropolis | 14,200 | 7,985 → 9,557 | 11,301 → **13,136** | 0 |

| tier | ceiling | worst leaf | ALL-WAVES PRE | POST | verdict |
|---|---|---|---|---|---|
| thorp | 1,000 | thorp | 968 | 968 | headroom 32 (tightest, unchanged) |
| hamlet | 1,400 | hamlet | 1,256 | 1,256 | headroom 144 |
| village | 2,000 | mountain | 1,764 | 1,764 | headroom 236 |
| town | 9,300 | highwater → **polycentric** | 7,305 | 7,514 | headroom 1,786 |
| **city** | 10,000 | migration | 8,189 | **10,008** | ⛔ **OVER BY 8 — REPORTED, NOT RAISED** |
| metropolis | 14,200 | metropolis | 11,301 | 13,136 | headroom 1,064 |

### ⛔ THE BREACH — what the chair needs
1. **Magnitude: 4 and 8 primitives on a 10,000 ceiling — 0.04 % / 0.08 %.** Both city-tier leaves
   are the same site (`mf-city-01` coastal, 20,091 souls) in two states.
2. **It fires ONLY in the ALL-WAVES-ARMED arm** — REG-1 fusion + REG-2 rampart + REG-3 shape code
   + REG-4 both arms, every one of which is DORMANT today. The BASE arm prices at 6,814 / 6,818
   against 10,000. **This is a bill payable when the register arc lands (REG-P / the D3a port),
   not a live regression.**
3. **Cause is arithmetic, not waste:** the 20,091-soul city's bandPosition rose 0.6147 → 0.8686,
   taking roofs 1,648 → 1,834 and parcels 1,487 → 1,755.
4. **NOT RAISED.** A §217 raise is a chair act and this lane will not spend a gated decision on
   its own consequence. §217's own sentence asks efficiency FIRST, which is a separate effort.

### The fixed point, demonstrated
town BASE **4,386** at the old pin → **4,447** at the signed pin for an UNCHANGED drawing (REG-4's
figure, reproduced) → **4,918** after the reconcile. The first step is the ration's fixed point;
the second is the band. Both legs are separately measured, so no figure has to be guessed at.

⭐ **`REG_OP_CEILINGS` PROVED BYTE-EQUIVALENT TO THE PIN** (validates J-REG4-10): the cured tree
run with the override set back to the OLD table reproduces the old-pin render **29/29
byte-identical**. The override is a faithful stand-in for moving the pin.

---

## §8 · DETERMINISM — AND THE TRAP THAT NEARLY FAKED IT

**RESULT: 29/29 byte-identical on a double-run, in all four arm combinations, AND every arm proved
LIVE.**

| arm | run 1 vs run 2 | vs unarmed (liveness) | town primitives |
|---|---|---|---|
| unarmed | **29/29** ✅ | — | 4,918 |
| REG-1/2/3 (`--fuse --rampart --shapes`) | **29/29** ✅ | 0/29 identical → LIVE | 7,489 |
| REG-4 (`--market --footprint`) | **29/29** ✅ | 0/29 identical → LIVE | 4,849 |
| all waves | **29/29** ✅ | 0/29 identical → LIVE | 7,377 |

Cross-check: the all-waves determinism run matches the independent `FRESH-allwaves` render 29/29,
and three separate fresh all-waves runs are 29/29 with each other.

### ⛔⛔ BANKABLE HAZARD — **zsh DOES NOT WORD-SPLIT AN UNQUOTED `$var`, SO A FLAGS-IN-A-VARIABLE LOOP SILENTLY RUNS THE UNARMED ARM**

The FIRST determinism pass was run as `for spec in …; flags="${rest%%:*}"; node harness/exemplars.mjs "$d" $flags`.
In bash `$flags` word-splits into `--fuse --rampart …`; **in zsh it does not** — it is passed as
ONE argument, and `process.argv.includes('--fuse')` never matches. All four "armed" combinations
rendered the **UNARMED** corpus.

⛔ **AND IT PASSED.** Every arm was 29/29 against its own double, and the four arms were internally
consistent — a perfect determinism receipt for a measurement that had never armed anything. This
is the fourth-stack law verbatim: *identical readings are what a dead instrument returns.*

**How it was caught, and the lesson:** not by suspicion but by a CONTRADICTION between two
measurements — the "armed" determinism renders disagreed 0/29 with an independent armed render
made minutes later from the same tree. Chasing that led to the manifest, where the "all-waves"
figures were **exactly** the BASE column of the op probe (thorp 904/64, hamlet 1126/87, town
4918/268 …). ⭐ **THE GENERAL RULE THIS BANKS: a determinism proof MUST carry a liveness control —
the armed arm has to be shown DIFFERENT from the unarmed one in the same measurement.** A
double-run that only compares an arm to itself cannot tell "deterministic" from "never ran".
Every arm above now carries that control. Proof of the trap, executed:

```
f="--fuse --rampart"; node -e '…' X $f       → argv after outDir: []
f="--fuse --rampart"; node -e '…' X ${=f}    → argv after outDir: ["--rampart"]
```
**The cure used here: literal flags on every invocation, never a variable.**

---

## §9 · PDF / PRERENDER TRACE — BOTH ROWS PROMOTE

Traced read-only in the main repo (no file created, modified or deleted; no state-mutating git
command). Line numbers are at `00f858d3e`.

### A. PRERENDER — **NOT-APPLICABLE (no settlement tier is emitted)** — promoted from PLAUSIBLE
`scripts/prerender-routes.mjs` **never loads a settlement record.** Its whole import set (`:48-57`)
is routes, site graph, compendium head, `COMPENDIUM_INDEX`, `GALLERY_HUBS`, `injectGalleryMeta`,
`isIndexable`. `main()` (`:256-271`) emits three families only: static route views, gallery hubs,
compendium index. The per-slug gallery family — the only one carrying real settlements — is
excluded by construction at `:65` `const DYNAMIC_VIEWS = new Set(['gallery']);`, enforced at
`:140`. Decisive: it imports `injectGalleryMeta` but **not** `buildGalleryMeta`, which is the only
function in `api/_galleryMeta.js` that reads a settlement tier (`:103`). **No settlement tier can
reach a prerendered head.**
⭐ It DOES emit the tier VOCABULARY (labels + population bands), and that chain is **truth A**:
`src/data/constants.js:7-14` → `scripts/generate-compendium-data.mjs:478-483` →
`compendiumData.generated.js:58-65` → `src/domain/compendium/searchIndex.js:74-77` →
`prerender-routes.mjs:203-207` → `injectNoscript :118-120` → `writeHtml :155-159`.
⚠ Residue: source-level, not artifact-level — `dist/` in this checkout has no prerendered routes,
so emitted bytes were not inspected. `npm run build` would settle it.

### B. PDF / DOSSIER — **CONFIRMED: the STORED field `settlement.tier`** — promoted from PLAUSIBLE
`src/pdf/**` contains **zero** references to `popToTier` or `POPULATION_RANGES`. Hop chain:
entry (`SettlementCard.jsx:105` · `SettlementDetail.jsx:421` · `ExportDraftButton.jsx:57` ·
`SingleDossierSuccessPage.jsx:182`) → `src/utils/generateSettlementPDF.js:220` `normalizeSettlement`
→ `src/domain/normalizeSettlement.js:131` (pass-through, `tier: settlement?.tier ?? null`) →
`generateSettlementPDF.js:222-223` → `src/utils/pdfRender.worker.js:49` → `src/pdf/SettlementPDF.jsx:93`
→ `src/pdf/lib/viewModel.js:124,127,149,153` → **THE CLASSIFIER LINE, `viewModel.js:263` (and
identically `:204`)**:
```js
tier: s?.tier ? (TIER_LABELS[s.tier] || s.tier) : null,
```
`TIER_LABELS` (`viewModel.js:53-56`) is a pure display relabel and reads no population. Printed at
`IdentityDailyLife.jsx:38` · `Overview.jsx:86` · `Cover.jsx:144,147,151` · `TownMapPlate.jsx:153` ·
`headlines.js:21-23,116`.
⚠ **`scripts/.pdf-field-manifest.json` WAS A STRUCTURALLY DEAD LEAD** and TE-SEAM was right to get
nothing from it: its own `_doc` says it registers *writable form-field* names, it holds exactly two
(`cover.campaign`, `tonight.scratch`), and its walker collects only react-pdf `TextInput` names.
Tier is static `<Text>`. That manifest could never have answered the question.

### C. SEVEN FURTHER TIER-PRINTING SURFACES the TE-SEAM table missed
1. **World Book / campaign PDF** — `src/utils/generateCampaignPDF.js:198,302,327,413-415,577`, stored `s.settlement?.tier`. A wholly separate jsPDF document that never touches `buildViewModel`.
2. **Crawler og:description for shared worlds** — `api/_galleryMeta.js:103,115`, served at RUNTIME by `api/gallery-meta.js:78` and `api/meta-shell.js:102`. This is the surface the prerender yields to.
3. Client-side twin — `src/lib/seoDossier.js:37,55`.
4. Public dossier on screen — `src/components/PublicDossierView.jsx:65,103` (DB row's `dossier.tier`).
5. Dossier summary — `src/components/new/SummaryTab.jsx:107,129,170`.
6. Daily Life tab — `src/components/new/dailyLifeLogic.js:127` → `tabs/DailyLifeTab.jsx:157`.
7. **MIXED chains** (stored-first, `popToTier` fallback) — `src/components/map/heraldRegister.js:96`, `src/components/settlement/eventComposer/EventComposerTierField.jsx:21`.

⭐ The PDF (`src/pdf/**`, react-pdf) and the on-screen dossier (`src/components/**`) are SEPARATE
component trees with separate view models. They agree only because both read the same stored field.

### D. TWO OBSERVATIONS FOR THE CHAIR (neither is this lane's to act on)
1. ⚠ **The shared working tree at `/Users/cstokes/Desktop/settlement-engine` is missing ~3,262
   files that exist at its own HEAD** (1,137 under `src/`, 1,548 under `tests/`, 96 under
   `scripts/`), including `scripts/prerender-routes.mjs` and `scripts/.pdf-field-manifest.json`.
   `git ls-files` lists them; `ls` does not. **A lane grepping the WORKING TREE for a classifier in
   those files gets a clean, honest, empty result because the file is not there.** This trace was
   therefore run against HEAD via `git show`/`git grep`. ⚠ I do NOT claim this is why TE-SEAM's two
   rows were PLAUSIBLE — TE-SEAM states it read via `git show` at pinned SHAs and gave a scope
   reason ("a one-hour trace if the chair wants it CONFIRMED"). It is reported as an independent
   condition of the shared tree, pre-existing and untouched by this lane.
2. ⚠ **A narrative-export seam, noticed and NOT chased.** `viewModel.js:127` sets
   `const active = useAi ? ai : raw`, and `identitySlice(active, raw)` therefore reads `ai.tier`
   when narrative mode is on. `Cover.jsx:144` carries a `settlement?.tier` fallback;
   `IdentityDailyLife.jsx:38` and `Overview.jsx:86` do not. Whether any AI payload ever sets a
   `tier` key was not determined. Its own car if it matters.

### E. TE-SEAM-B — the alarm that ISN'T one (a ref confusion, checked before repeating)
A first reading reported "both inline chains are still inline at `00f858d3e`, so TE-SEAM-B's
conversion is not landed". **Verified directly, and the claim is a REF CONFUSION, not a defect:**
`00f858d3e` is the LEDGER branch tip (`review-fixes-2026-07-08`), a different line from the build
slot. §633.2 landed TE-SEAM-B on the BUILD SLOT `e4ed27f48 → 73f5dfc02`, and at `73f5dfc02`:
```
  1: import { popToTier } from '../../data/constants.js';
 39: return popToTier(settlement.population ?? 0);
 38: // @guarded-by tests/data/popToTierBoundary.test.js — the producer-equality block.
```
**TE-SEAM-B is landed exactly as §633.2 declared.** Banked as a lane lesson: *a claim about "the
repo" is meaningless in a two-branch topology — name the ref and check it there.*

---

## §10 · JUDGMENT CALLS — all vetoable

**J-SEAM-1 — `thorp.pop[0]` stays 1; it is NOT reconciled to `POPULATION_RANGES.thorp.min` (8).**
The probe found a FOURTH row disagreement the ruling did not name: the brief states
"thorp/hamlet/village rows already agree", and they agree on every CEILING (which is what the
classifier tests) but thorp's FLOOR is 1 against the engine's 8. Chose to leave it because
§631.3 names three rows, the two numbers answer different questions (8 = the smallest settlement
the generator emits; 1 = the floor `bandPosition` interpolates from), and moving it would change
the interpolation denominator for the WHOLE thorp band — `bandPosition(30,'thorp')` 0.70 → 0.65 —
moving the thorp exemplar's grading, unmeasured by the panel and unruled by the chair. Pinned BY
NAME in the guard so the exception cannot widen into a second fork. *Say "veto" to reconcile it,
and it becomes a fourth declared shift.*

**J-SEAM-2 — `compile.js:115`'s provenance string is NOT edited.** It reads
`'popToTier(population)'` while the code calls `tierForPopulation`. Chose to leave it: post-cure
the two are equal BY EXECUTION, the string names the CANONICAL authority (which is what a
provenance receipt should name), and zero consumers match on it. The alternative — naming the
local spelling — trades a now-true statement for a less useful one. ⚠ Recorded honestly: this
string was *true in intent and false in fact* for four waves, which is exactly how the defect hid.
It is now true in both senses only because the guard holds it there.

**J-SEAM-3 — the city ceiling breach is REPORTED, NOT RAISED.** A §217 raise is a chair act
(§632.4, and REG-2/REG-3/REG-4 each declined the same move). Chose to land the cure, measure the
consequence natively, and hand the chair the figure. *The alternative — raising city to 10,100 in
the same commit — would have spent a gated decision to hide this lane's own cost.*

**J-SEAM-4 — two comment repairs beyond the ruled two.** `bandPosition`'s "a town spans 900→8,000"
and `renderFolio`'s "the pin below is NOT the signed table" were both made false by this car's own
edits. Chose to repair them in the same commits rather than defer: this car exists because a
comment asserting a contract its table broke went unnoticed for four waves, and shipping two fresh
instances of that exact class would be indefensible.

**J-SEAM-5 — vitest resolved by per-entry symlink from the main repo's `node_modules`.** The
sparse sandbox has no lockfile (`npm ci` → EUSAGE). Chose per-entry symlinks (438 linked,
`seedrandom` kept as the real copy) over a full copy or a whole-dir symlink, so the real
`seedrandom` is preserved and the resolution gap is measurable — it is 3 packages (`three`,
`@types/node`, `pg`), none imported by the fabric suite. Every test figure is quoted with its
collected count so no exit status stands alone as a verdict.

**J-SEAM-6 — the liveness probe lives in `harness/`, not `tests/`.** It must run at TWO SHAs (the
pristine seal and the cure) to be a before/after measurement, and a test file cannot do that. A
harness file bills no ratchet; the permanent enforcement is the test-side guard (§5 arm 6), which
pins the same consequences.

---

## §11 · DEFERRED, WITH REASONS (documented, not bugs to re-find)

1. ⛔ **THE CITY CEILING BREACH (8 primitives, all-waves arm).** Chair's, per J-SEAM-3.
2. ⚠ **`GRAIN_BAND`'s "measured, 10 seeds/tier at 6b337fb1" was taken under the OLD bands.** The
   endpoints are per-tier measurements and do not move, but WHICH TIER a seam-window population is
   graded in has changed, so the curve's shape in 5,001–8,000 and 25,001–40,000 rests on a
   measurement taken when those populations were town/city rather than city/metropolis. TE-SEAM
   flagged this as "a re-measure bill at the seam windows"; it is not paid here and it is not this
   car's scope. The monotonicity pin (`townMapFabricBuildOut.test.js:878`) still passes.
3. ⚠ **The three pre-existing suite reds are NOT this car's** — `stageManifest.walker` arms 1 and
   2, and `derivationGraph.walker`'s hand-minted fork keys, all complaining about REG-1/2/3/4's
   own modules (`frontageFusion.js`, `rampartWorks.js`, `shapeCode.js`, `marketRegister.js`,
   `minFootprint.js`, `faubourgOrigin.js`) not being in the stage manifest. §632.4 already books
   this: "the five new closed vocabularies' totality walker is ONE bill for three waves and lands
   at REG-P."
4. ⚠ **§631.2's "the seal suite is 237/237 GREEN unmodified under the reconciled table" DOES NOT
   HOLD AT THE ACTUAL STACK TIP,** and §631.3 anticipated exactly this ("a re-run of the panel's
   differential at the ACTUAL stack tip — REG-4 may have added tests"). Re-run, executed: the
   pristine REG-4 seal is **311 collected, 308 passed, 3 FAILED**. The panel's 237 predates REG-4.
   The reds are REG-4's, not the reconcile's — proved by executing them on a clean worktree at the
   seal — and the reconciled table adds none.
5. ⚠ The prerender verdict is source-level; `dist/` carries no prerendered routes in this checkout.
6. ⚠ The narrative-export `ai.tier` seam (§9 D2) — its own car if it matters.

---

## §12 · EXACT RE-RUN

```
git worktree add <tree> 7fba086d507de09de5586bd7ee7436a01abda002
cd <tree> && mkdir -p node_modules && cp -R <repo>/node_modules/seedrandom node_modules/
node harness/exemplars.mjs <out>                                     # 29 files — the baseline
node harness/laneREGSEAM/probeSeam.mjs                               # the liveness probe
node harness/laneREG4/probeOps4.mjs                                  # native, REG_OP_CEILINGS UNSET
npx vitest run --config vitest.laneMFB1.config.js --pool=threads --maxWorkers=2 \
  tests/domain/townMapFabricBuildOut.test.js -t "§631.3"             # the guard, 7 cases
node harness/exemplars.mjs <out2> --fuse --rampart --shapes --market --footprint
#   ⛔ LITERAL FLAGS ONLY — see §8. `$flags` from a variable is passed as ONE argument in zsh
#      and every arm renders UNARMED while the determinism proof still reads 29/29.
```

---

## §13 · THE FINAL GATE, AT THE COMMITTED TIP

⛔ Verification binds to a snapshot, so this is a run **at the tip, after the last edit**, with the
committed blobs proved identical to the working files.

```
committed blob == working file:
  ✅ src/domain/townMap/fabric/tierGrammar.js    e36aa1659f7da8ffef86581275074346b5f14ff6
  ✅ harness/renderFolio.mjs                     5b0771538cadc6246c8afd19bb0091c7090530ed
  ✅ tests/domain/townMapFabricBuildOut.test.js  314af0e3eee23f6c13ff7de1e490e107c32d6f46
  ✅ harness/laneREGSEAM/probeSeam.mjs           33b96bad2eea77fce20ed677dcf2e51355a8c960
ancestry: ✅ 7fba086d5 is an ancestor of 6cd4b19ef
working tree: clean (only untracked node_modules/ — ⚠ NOT gitignored in this sparse sandbox,
              so every commit staged EXPLICIT paths; `git add -A`/`.` was never run)
```

| run | files | collected | passed | failed |
|---|---|---|---|---|
| pristine seal `7fba086d5` (control) | 15 | **311** | 308 | **3** |
| cured tip `6cd4b19ef` | 15 | **318** | 315 | **3** |
| delta | 0 | **+7** | +7 | **0** |

**The +7 is exactly the guard's seven added cases; ZERO new test files.** The 3 failures are the
same three by name at both SHAs — `stageManifest.walker` arms 1 and 2 and `derivationGraph.walker`'s
fork-key inventory, all complaining about REG-1/2/3/4's modules missing from the stage manifest.
**Pre-existing, proved by execution on a clean worktree at the seal, not asserted.** §632.4 already
books them to REG-P.

### VERDICT
**PASS with one chair-gated finding.** All six ruled items done; the seam is closed by execution
(18,000 disagreements → 0); the elegy fires on real demotions and not on growth; determinism
29/29 × four arms with every arm proved live; both PLAUSIBLE trace rows promoted.
⛔ **THE ONE THING THE CHAIR MUST RULE: the city tier is 8 primitives over its §628-signed 10,000
in the all-waves-armed arm.** Reported, not raised.

**LANE TIP: `6cd4b19efb763a3f7799d9d30974436236ac6545`** (detached; no ref moved — the chair seals).

### Memory rows proposed to the chair (topic files written; MEMORY.md NOT touched, per the index law)
1. `determinism-proof-needs-a-liveness-control.md` — ⛔⛔ zsh does not word-split an unquoted
   `$var`, so a flags-in-a-variable loop renders the UNARMED arm while the determinism proof still
   reads 29/29 on all four "armed" combinations. A double-run compares an arm to itself and cannot
   tell deterministic from never-ran; every determinism proof needs an in-measurement liveness
   control (armed vs unarmed) and a per-arm scalar quoted beside the hashes.
2. `band-reconcile-moves-the-whole-corpus-not-the-window.md` — ⚠⚠ a band reconcile moves every
   leaf ALREADY IN the band (bandPosition's denominator), not just the reclassified window: 26/29
   artifacts, and it pushed the city tier over its signed op ceiling. Carries the tip, the
   per-tier op table, the fixed-point rule, and the proof that `REG_OP_CEILINGS` is byte-equivalent
   to moving the pin.

---

## §14 · SHARED-TREE NOTE (checked at lane close)

The ledger branch `review-fixes-2026-07-08` **advanced during this lane**, `00f858d3e` →
`d564c7e13` ("§634: the efficiency program implements") — a parallel session, not this one.
Diff is `docs/HANDOFF_CURRENT.md` + `docs/OWNER_DECISION_QUEUE.md` only, so **none of the files in
§9's PDF/prerender trace moved and every verdict there stands at the new tip**. This lane never
wrote to the shared tree, never staged anything there, and moved no ref; all work is on the
detached worktree `laneREGSEAM-tree` and its pristine control `regseam/BASE-tree`. Both worktrees
are LEFT IN PLACE as evidence — the chair seals from `6cd4b19ef`.
