# TE36 — THE P4 POPULATION RECONCILIATION (ODQ §219.3, dispatched §268.4a)

**Tip for the chair's CAS: `4eafca31a295b5288f8c5b0b551e248e386e7791`**, four commits stacked
DETACHED on `ac243e1c` in `.claude/worktrees/minifold`. No branch ref moved, nothing pushed,
no ledger-branch or memory write. The foreign stash (`analytics-intelligence-layer`) is
untouched and still present; the working tree is clean.

```
4eafca31 chore(TE36/P4): re-record the 13 lit-corpus rows — CHAIR-AUTHORIZED, ODQ §271
2d1e09ce chore(TE36/P4): re-bundle edge-shared — demographicsRates is a real bundle input
335d0176 fix(TE36/P4): the veto's score read is strict-clean and NaN-safe
0f59d0ea fix(TE36/P4): the decline lane and the death term stop both answering one settlement
ac243e1c docs(WF-1a flip): TC32-WF-1's stage-1 row READY -> LANDED at 66fda66d …
```

28 files, +1720 / −264. No new file minted (the test census sits at its ceiling; every pin
extends an already-registered file).

## ⭐ THE TERMINAL IS GREEN

```
[test-ratchet] OK — no test regressions (11 known failure(s) of 28552 tests, ceiling 11).
[gate-tail] exit: 0 (the gate's own status, not a pipe's)
TRUE_EXIT=0
```

`npm run check:tail` all seventeen steps, and `smoke:boot` green beside it (§7). The
thirteen rows §5.3 and §7.1 reported are re-recorded under the chair's ODQ §271 ruling and
the census is back at its frozen ceiling of 11 — the same 11 that were red at base.

---

## 1. HEADLINE — CONFIRMED

**Both firing cells are cured, and neither is cured by a floor.**

| cell | base (`ac243e1c`) | cured (`2d1e09ce`) |
|---|---|---|
| `w0-soak::30::4::ca-015` (RS-1 F1) | 17,682 → **793** (×0.04) **FAIL** | 17,682 → **7,914** (×0.45) **PASS** |
| `w0-soak::30::4::ca-bd7e00d6` (RS-3 F1) | 17,682 → **680** (×0.04) **FAIL** | 17,682 → **5,466** (×0.31) **PASS** |

The base figures reproduce RS-1 and RS-3 **exactly** (793 and 680 against their recorded
793 and 680), from a clean `git archive ac243e1c` outside any repository with that
archive's own lockfile install — post-install `package-lock.json` sha256
`111faef6642f95d5bacdc84f6cb2a6d47a493bf2b1eb5f2e314d39c6d453983b`, byte-identical to
RS-1's. So the before/after is measured on one substrate, one node major, one lockfile.

The cured world is **still grim** — which is the point. Per settlement on `ca-015`:

```
  soak-a (city):    8865 → 4624   (min 4624, max 8371)
  soak-b (town):    4318 → 2057   (min 2057, max 3783)
  soak-c (town):    3615 → 1208   (min 1208, max 3180)
  soak-d (village):  884 →   25   (min    0, max  887)
```

Every settlement more than halves; the village goes to twenty-five people and touches
zero on the way. Nothing was made survivable. What changed is that the fall now **ends**.

---

## 2. WHAT WAS BUILT

### R-B — one cause, one channel (`populationDynamics.js`, `demographicsRates.js`, `demographicsKernel.js`)

The legacy pressure-decline lane and the demographic death term stopped both answering a
pressured settlement:

1. **When `demographicsEnabled` is lit, `populationCandidate` emits ONLY a conserved
   transfer.** Bare decline is refused exactly as bare growth already was (P1). Mass
   emigration survives, and only when the migration path is live to receive it, because a
   departure has credited destinations and a bare shed does not. The gate is one line:

   ```js
   if (rules.demographicsEnabled === true && !(isMassEmigration && migrationLive)) return null;
   ```

2. **The crisis signal is re-expressed, not discarded.** `crisisStress01` reads the SAME
   condition classes at the SAME relative severities — the legacy lane's own monthly
   penalties (food −0.013, disease −0.020, war −0.016, burden −0.006) normalised against
   the largest of them, so `CRISIS_MORTALITY_WEIGHTS` is `{food 0.65, disease 1, war 0.8,
   burden 0.3}`. A source-scan walker holds the two vocabularies in bijection and re-reads
   the penalties out of the lane's own source, so a retune on either side reds by name.

3. **The death multiplier gains the crisis term, scaled by OCCUPANCY.** That scaling IS the
   fixed point: as a pressed settlement empties, its crises stop being lethal and the birth
   band catches the death band. Below the ease points the crossing solves to

   ```
   p* = (birth/death − 1 − DEATH_DEFICIT_GAIN × deficit) / (DEATH_CRISIS_GAIN × crisis)
   ```

   of the settlement's own `min(K_food, D_tier)` — 25.7% of bound at thorp scale down to
   4.8% at metropolis scale under maximal sustained crisis, executed per tier.

**`DEATH_CRISIS_GAIN = 3.0` is derived, not chosen.** At the bound under full crisis the
composite sheds −13.4%/yr against the legacy lane's measured −13.0%/yr expectation
(DX1 §4.5). The severity the world was tuned around is preserved; only the floor is added.
It also mirrors the existing `DEATH_DEFICIT_GAIN`, so the two external mortality drivers
weigh the same.

### R-C — the marker's lifecycle answers to the ledger (`candidateEvents.js`, `demographicsRates.js`)

DX1 named the famine marker; the loop that keeps it alive is now traced end to end and
**CONFIRMED at source**:

```
famine condition present
  → pressureModel.js  food += 0.18   ("active condition: famine")
  → causalState.js    applyConditions(…, 'food_security', { scale: 20 })  ⇒ score −13
                      ⇒ pressureFromScore((70−score)/70) rises ~+0.19
  → food pressure ≈ 0.79, past pressureConditionCandidate's 0.5 promotion floor
  → famine minted again, ten-tick expiry outrun
```

Gain above one, and **nothing in the loop reads `foodLedger`**. Without the two
self-terms the same settlement reads ≈0.44 — below the floor — and the marker lapses,
which is exactly what the passing `maximal-lawful` row does on the same world.

The cure gives the conserved ledger a veto, **as a ceiling and never a lift**:
`foodCorroboration01` = `clamp01((population / K_food) / DEATH_EASE)`. It caps the score
the condition-promotion gate reads, and the same read scales the food class's mortality
weight. A settlement at or past `DEATH_EASE` of its granary reads 1 and is untouched
byte-for-byte; the soak's failing city, holding a seventh of its capacity, reads 0.16.

**⚠ `deficitPct` was DELIBERATELY REFUSED as a second arm, and the reason is recorded in
the source** so nobody re-adds it as an oversight. It is unusable as an arbiter twice over:
`foodStockpile.js` carries `baseDeficitPct` forward from generation and never re-reads the
head count (so a settlement that has lost seven eighths of its people still books the same
5% "unmet need" it booked at full size — that frozen ratio IS the second food truth), and
an emergent famine condition raises `effectiveDeficit` in that same file, so a
corroboration read through it would be the marker corroborating itself. The deficit still
reaches mortality directly through `DEATH_DEFICIT_GAIN`, unchanged. **Making `deficitPct`
population-relative is a real repair and is deferred to the food lane — documented, not a
bug to re-find.**

---

## 3. THE ANTI-FLOOR PROOF — CONFIRMED

The chair's own test — a reconciliation that made collapse impossible would have replaced
one defect with a worse one. Five independent arms, all executed:

**(a) Past a tier's own starvation deficit there is NO positive fixed point.**
`starvationDeficit01Of` is derived from the authored tables, never authored:
`(BIRTH_BANDS[t] / NATURAL_DEATH_BANDS[t] − 1) / DEATH_DEFICIT_GAIN` — 25.6% at thorp,
13.9% at town, 8.7% at city, 4.8% at metropolis. Executed per tier on both sides of the
boundary: at **half** the starvation deficit the crossing occupancy is > 0.1 (the place can
feed itself back up); at **1.2×** it is ≤ 0.002, meaning deaths beat births at every
occupancy including an almost empty one, and the settlement empties. Collapse is not merely
possible, it is unavoidable, and the boundary is a property of the tables.

**(b) A granary that fails takes the floor down with the bound.** The floor is a SHARE of
`min(K_food, D_tier)`, so destroying capacity destroys the floor. Executed: same settlement,
same crisis, one number apart — the fields' output — and the resting population falls by
more than 10×.

**(c) The terminal lane is still reachable, and reachable only for cause.** A hamlet whose
granary feeds 46 against 120 people walks hamlet → thorp and the terminal candidate fires
at **tick 106**; the SAME fixture with a sound granary survives the same 700-tick horizon
with `deathTick === null`. The positive control is what stops the death pin from passing
for the boring reason that everything dies at that horizon — which is the reading the old
lane earned.

**(d) The floor is not a constant.** Three settlements identical in every respect except
how much food their fields make, all starting at 300 above their own bound, come to rest on
three different numbers in the order of their granaries (bounds 90 / 120 / 160 → 75 / 94 /
119). And at half the crisis, twice the resting occupancy. A floor-raise would have put all
of them on one number.

**(e) Nothing anywhere clamps a population.** Both rates stay strictly positive and finite
at every occupancy the read admits, including `pressure01 = 1e9`. The equilibrium is a
crossing of two rates, as the design's law 1 requires.

---

## 4. THE CAPSULE CELLS AND THE LAWFUL CONTROLS — CONFIRMED

Fourteen cells, seven configurations × two trees, every one executed in this lane. The
base column is a clean `git archive ac243e1c`; the cured column is the same archive with
this lane's diff applied and the SAME `node_modules`, so the two differ by the patch and
nothing else.

| cell | base | cured | verdict |
|---|---|---|---|
| `w0-soak` ca-015 (RS-1 F1) | 17,682 → 793 (**×0.04 FAIL**) | 17,682 → 7,914 (**×0.45 PASS**) | **CURED** |
| `w0-soak` ca-bd7e00d6 (RS-3 F1) | 17,682 → 680 (**×0.04 FAIL**) | 17,682 → 5,466 (**×0.31 PASS**) | **CURED** |
| `w0-soak` maximal-lawful | 17,682 → 5,387 (×0.30 PASS) | 17,682 → 10,207 (×0.58 PASS) | still passing |
| `w0-soak-b` ca-bd7e00d6 | 20,013 → 10,733 (×0.54 PASS) | 20,013 → 12,988 (×0.65 PASS) | still passing |
| `w0-soak-c` ca-bd7e00d6 | 21,890 → 11,091 (×0.51 PASS) | 21,890 → 12,352 (×0.56 PASS) | still passing |
| `w0-soak-b` maximal-lawful | 20,013 → 11,005 (×0.55 PASS) | 20,013 → 13,100 (×0.65 PASS) | still passing |
| `w0-soak-c` maximal-lawful | 21,890 → 11,081 (×0.51 PASS) | 21,890 → 12,337 (×0.56 PASS) | still passing |

**Every base figure reproduces its recorded original.** RS-1's ca-015 793; RS-3's
ca-bd7e00d6 680, `w0-soak-b` 0.536 (measured 0.54) and `w0-soak-c` 0.507 (measured 0.51).
The substrate is faithful, so the cured column is a real before/after and not a different
world.

**The two firing cells are the only cells whose VERDICT changes.** Everything else was
lawful and stays lawful. Nothing approaches the ×20 growth ceiling — the largest cured
ratio is ×0.65, and no cell grows at all.

**The two already-lawful worlds do not move materially.** `w0-soak-b` goes 0.54 → 0.65 and
`w0-soak-c` 0.51 → 0.56 — +0.11 and +0.05 of the start population, against the failing
world's +0.41 and +0.27. That asymmetry is the cure's own signature and is the clearest
single piece of anti-floor evidence in this report: the reconciliation bites in proportion
to how far below its capacity a settlement was driven, so a world whose settlements sat
near their bounds barely notices it, and the world that had been driven to 4% is the one
that moves. A raised floor would have done the opposite — it would have lifted the failing
world to the floor and left the healthy ones untouched, which is the shape NOT observed.

## 5. THE DECLARED SHIFT, ATTRIBUTED

### 5.1 Nothing shipped moves — by construction

Every behavioural change reads `rules.demographicsEnabled === true`. **Re-verified by
EXECUTION rather than by reading the source** (condition 4), enumerating every shipped preset:

```
quiet_local              demographicsEnabled = ABSENT
realistic_regional       demographicsEnabled = ABSENT
dramatic_campaign        demographicsEnabled = ABSENT
static_campaign          demographicsEnabled = ABSENT
narrative_campaign       demographicsEnabled = ABSENT
living_realm             demographicsEnabled = ABSENT
full_simulation          demographicsEnabled = false
PRESETS LIGHTING IT: 0 []
DEFAULT_SIMULATION_RULES has key: false
```

Zero of seven light it; six omit it entirely and `full_simulation` declares it `false`
precisely so the certification totality walker can census it. Every existing campaign, every
shipped golden and every dark-control cell therefore takes the identical path. **The only
golden that moved is the both-flags one that lights the flag on purpose (§5.3.1), and its
every named projection is byte-identical.**

### 5.2 The behaviour-neutral half moves nothing — measured

Stage one was executed as its own tree (`TE36-neutral`): `demographicsRates.js`'s additive
exports and its `crisis01` term (which defaults to 0), plus the certification-row prose, with
`demographicsKernel.js`, `populationDynamics.js` and `candidateEvents.js` reverted to base.
The `ca-015` cell on that tree:

```
  PASS  isolated worker output equals the direct domain path — e7bb233828de == e7bb233828de
  FAIL  realm population bounded — 17682 → 793 (×0.04; envelope 0.05–20)
  soak-a (city): 8865 → 562   soak-b (town): 4318 → 36
  soak-c (town): 3615 → 188   soak-d (village): 884 → 7
```

**Byte-identical to base on every measure** — the same composite hash `e7bb233828de`, the
same 793, and the same per-settlement `[562, 36, 188, 7]`, which are also DX1's recorded
figures. The additive half moves nothing. **Every figure in §4's cured column is therefore
attributable to the three behavioural edits and to nothing else.**

### 5.3 The behaviour half moves the LIT corpora — RE-RECORDED UNDER ODQ §271

**THE AUTHORITY.** This lane stopped and reported rather than banking these rows; the chair
ruled the re-record authorized and gave the reasoning to quote here: the three constants are
**DERIVED-TO-PRESERVE, not authored for feel** — `DEATH_CRISIS_GAIN = 3.0` was fitted to
reproduce the legacy lane's own measured −13.0%/yr at the bound, and the deficit gain and the
granary ceiling preserve measured severity rather than choose it. That makes P4 **a faithful
port of existing behaviour into a lane that has a fixed point, not a re-balancing**, which is
why it is a chair call rather than an owner tuning act. All three are nonetheless flagged for
the owner's tuning signature at the tuning pass; **if he vetoes them there, this re-record is
redone at his values.**

**ONE CAUSE BEHIND ALL THIRTEEN ROWS.** They all read one corpus,
`scripts/lib/observed-shape-corpus.mjs`, which builds its world by lighting **every**
`*Enabled` flag it can find in source (76 here — `line 716: Object.fromEntries(flags.map(f =>
[f, true]))`). It is the one place in the estate that observes the engine with
`demographicsEnabled` lit. Under that flag WAVE P4 retires the bare `population_decline`
candidate, and everything below is that single retirement counted five different ways.

Attributed before any of it was banked: the same suites pass in a clean `git archive
ac243e1c` and fail in the same archive with this lane's patch applied, so the cause is this
diff alone and not the live tree.

#### Each row, explained at its own site (condition 2) — never a bulk re-baseline

**`newsHeadlineContract.walker` A3 / A5 / A6 — 3 rows.** The rule count is **UNCHANGED at
26**: no rewrite rule was added or deleted, and exactly one CROSSED from active to inert
(17/9 → 16/10, and 16/9 → 15/10 in A6's derived 25-rule twin). The mechanical lane loses 21
"population may fall" headlines (77 → 56); its *distinct* values RISE (24 → 29) because the
retired family was repetitive, so removing 21 occurrences of a handful of spellings leaves a
shorter, more varied lane. The union follows the mechanical lane alone (228 → 207). The new
inert row is `\bmay fall\b`, **the exact sibling of `\bmay grow\b` that P1 put in the same
list for the same reason one wave earlier** — design law 1 has two halves, and P4 closes the
second. Its written reason names both the live seam and the scope: inert in this corpus and
**nowhere else**, because `demographicsEnabled` is false in every shipped preset.

**`observedShapeReaders.walker` — 1 row.** Corpus 1321/8637/14650 → 1300/8607/14586 and the
scalar meta's `regionalEventLog` 109 → 73. **Every figure moves DOWN**, which is the safe
direction for a reader-with-no-writer ratchet: fewer observed shapes can only ever mean fewer
resolvable reads, never a new blind spot. **The findings inventory did not move at all** — the
frozen per-file debt in `.observed-shape-readers-baseline.json` is byte-identical, so no
reader gained or lost a writer; only the corpus that exercises them is smaller.

**`proseFamilyContract.walker` A1 / A2 / A3 / A5 / A6 — 5 rows.** **63 identities before, 63
after, ZERO added, ZERO removed**; four families still nonempty; `chronicle` and `timeline`
byte-identical. The cause in one row: `pulseHistory[].*.populationDeltas[].reason` goes
distinctValues **2 → 1** and occurrences 41 → 5 (consequence) / 40 → 4 (mechanical). Everything
else follows: `consequenceOutcomes[].type` 9 → 8 distinct and `mechanicalOutcomes[].type` 3 → 2
(the retired candidateType), the headline/summary/reasons counts on both lanes, the rumour-seed
family those outcomes used to seed, and `regionalGraph.eventLog[]` 109 → 73. ⭐ The sharpest
detail: `regionalGraph.eventLog[].changes[].kind` is **byte-identical at 6/92** — the retired
outcomes carried a sourceEvent but no graph change, so only the sibling row moves. That
asymmetry is the cleanest evidence in the file that the retirement was surgical. A3's
counterfeit-baseline arm needed its arithmetic carried too (1301/5878 → 1236/5253) or the
validator would reject it before reaching the immutability guard it exists to prove.

**`proseNumerics` — 2 rows. PURE ADDRESS ROT, no behaviour at all.** 413 rows before and
after; an exact-identity diff shows **two identities out and two in**, same file, same
category, same snippet — `populationDynamics.js` line **458 → 485**, moved by the 27 comment
lines P4 added. This is the HAND-KEYED-ADDRESS ROT class the estate's own history names, and
the cure is to re-point, never to re-baseline blindly: no debt was gained, none was lost.

**`sovereigntyLightingContract.walker` — 1 row.** Titles **20,489 → 20,512 (+23)** and suite
titles **5,737 → 5,743 (+6)**, decomposed per file in the WF-1a idiom and closing with nothing
left over: +16 `demographicsRates` / +5 `demographicsWorldsHand` / +2 `demographicsFloor`, and
+5/+1 describes. **`files`, `parked` and `credited` are all UNCHANGED at 2460/364/2096** —
because the test census sits at its pinned ceiling, P4 minted no new test file and every pin
extends an already-registered one. `demographicsKernel`, `subsystemRowsGrowth` and
`subsystemRowsPeople` carry zero new titles by construction: each re-points an existing pin
rather than adding one.

**`demographicsLifecycleGolden` (property) — 1 row.** §7.3.

#### 5.3.1 THE GOLDEN, PROVEN KEY-BY-KEY (condition 1)

The chair required the diff, not the capture's exit code. Executed over the manifest before
and after `UPDATE_GOLDEN=1`:

```
keys before  : 64
keys after   : 64
keys ADDED   : 0  []
keys REMOVED : 0  []
keys CHANGED : 4
   p5b-a.hash  - 5c0ee08aed7b6ed869dca20766b3b0a93d7fcf970673f38616cbcd031c378871
               + 0d72e97513dacafe3479bb67bf809f3d8360a3b296263a7d07820640bfbd4e90
   p5b-b.hash  - 122f66a83281a72ecf61880c1531f3cecd3956e89d12b4661b297938767e9037
               + e9c6d5b0a1ef8937275c325007610e0d96430784f6b57c9962420272436bb7d5
   p5b-c.hash  - ed5b0a486e610c4e53286ee646852bf027a10a2b4ba0e709dab6d279e7a5ce24
               + 422dbaa0fde172d18aa8592105ddd52a8ae6201426ab38ae162603f3ff0d086a
   p5b-d.hash  - 505e4344d4ec29d1e11b014db716327e8e04b6389d94435bdda6de29cacd3c2d
               + cebbe5e5d17109c102c244185187b1c4b8f617609e0b39c706aa3b30ab993dbf

CHANGED KEYS THAT ARE NOT A COMPOSITE HASH: 0 []
KEYDIFF_TRUE_EXIT=0
```

**Zero keys added, zero removed, exactly four changed, and all four are `.hash`.** Every named
projection across all four seeds is byte-identical — founding ticks, plan ids,
`finalPopulations` (Brimhold 8,601 and its siblings), `satelliteIds`, receipt histograms. That
the populations do NOT move is itself the finding: this fixture's settlements were never in
the pathological regime, so the reconciliation had nothing to correct there and touched none
of their people. The hash moves because the candidate slate does.

#### 5.3.2 One thing never moves anywhere in this diff

**The news layer.** `wizardNewsFinalEntries` 240, `wizardNewsAccumulatedEntries` 1567,
`wizardNewsUnique` 272 — unchanged in every instrument. Ordinary population drift was already
`recordMode: 'state_only'` and never a Chronicle beat, so only the state lane got quieter.
That is the arithmetic that tells the two layers apart, and it is why no reader of the game
could have noticed this change even if a preset had lit the flag.

### 5.4 Pre-existing reds, earned rather than assumed

Re-run against the base state in a clean archive and confirmed red there too, so they are
not this lane's:

- `tests/domain/metronomeCooldownLint.test.js` — `razingExecution.js` (base exit 1).
- `tests/lint/clampPrimitiveBaseline.test.js`, `tests/lint/observedShapeSentinel.test.js`,
  `tests/lint/warCostKindPools.walker.test.js` ×3, `tests/lint/warRulingKindPools.walker.test.js`
  (base sweep: 6 failures across 4 files).

---

## 6. THE PINS THAT MOVED, AND WHY EACH MOVED

Nine landed pins asserted the behaviour P4 was chartered to change. **Not one was deleted or
re-baselined; every one was RE-POINTED at the lane that now carries its claim,** and each
kept or gained its negative control.

| pin | was | is |
|---|---|---|
| `demographicsKernel` "only the GROWTH side is replaced" | the decline lane must still fire | the lane writes population ONLY as a conserved transfer — with a DARK control proving the same fixture is a torrent of bare decline, and an arm proving emigration still moves people when the migration path is live |
| `demographicsFloor` §1 "declines every tick, monotonically" | monotone descent forever | the fixture leaves the deadband AND comes to rest above zero (a monotone-forever descent is not a cure with a floor missing, it IS the missing floor) |
| `demographicsFloor` §1 negative control | re-impose the integer deadband | **strip the occupancy scaling and the ledger veto** — the pre-P4 shape expressed in the term that replaced it — and the ratchet returns (< 100 where the cured run rests near 282) |
| `demographicsFloor` §2 "still declines lit" | descent | MOTION (dark: exactly one value in 200 ticks; lit: six) |
| `demographicsFloor` §2 fractional carry | the lane's shed magnitudes | the KERNEL's realized deaths — same `integerize` primitive, at the site that now carries it |
| `demographicsFloor` §3 THE DESCENT | any pressure walks a settlement to death | a settlement whose GRANARY fails does, with a positive control proving a sound-granary twin survives |
| `demographicsFloor` §7 H3 floor | `declineOnly` over the population lane | `kernelOnly` over the death draw, on a failed granary so the cast is actually reached (min = 24 exactly; castless control goes under) |
| `demographicsFloor` §9 dither | the lane's `hash01` key | the kernel's `demographics:<id>` fork, compared on the whole trajectory rather than an endpoint (two random walks can land on one number by luck) |
| `subsystemRowsGrowth` / `subsystemRowsPeople` source addresses | old literals | re-pointed, and the certification INVARIANT widened: `population_decline` must now also read exactly zero when lit, while `population_emigration` stays unconstrained |

New coverage added (all in already-registered files): 16 pins in `demographicsRates.test.js`
(the fixed point per tier against its closed form, the anti-floor per tier on both sides,
the ledger veto with its control, the vocabulary bijection walker, and a dormancy arm proving
`crisis01` omitted reads byte-identically to `crisis01: 0` at every occupancy) and 6 in
`demographicsWorldsHand.test.js` (the mint gate, with a DARK control and a "only the food
kind is arbitrated" arm).

---

## 7. GATE — GREEN, verbatim, captured in-shell, never through a pipe

`npm run check:tail` run BARE in a fresh shell (never wrapped in `gate-mutex --run` — the
self-deadlock hazard), exit captured in the same shell, outlasted in this lane's own turn.
**All seventeen steps pass.**

```
> settlementforge@1.0.0 validate:hazard-registry
[hazard-registry] OK — 29 class(es): MACHINERY 12, PARTIAL 11, DOCUMENT 6, ACCEPTED 0. DOCUMENT 6/6, OWED 17/18 (shrink-only), MACHINERY 12/9 (grow-only), floor 27.
> settlementforge@1.0.0 validate:premortem
[premortem] SELF-CHECK OK — 28 predicates (16 derived, 12 authored of which 3 hybrid), 23/29 registry classes routed to a trigger, 6 uncovered and each explicitly exempted with a reason.
> settlementforge@1.0.0 validate:packets
> settlementforge@1.0.0 validate:data
> settlementforge@1.0.0 validate:custom-content-manifest
> settlementforge@1.0.0 validate:migration-head
> settlementforge@1.0.0 validate:edge
> settlementforge@1.0.0 validate:map
> settlementforge@1.0.0 validate:tuning-bands
> settlementforge@1.0.0 validate:foundry-module
foundry-module OK — module.json valid, 3 script(s) parse, README present.
> settlementforge@1.0.0 validate:mcp-server
mcp-server OK — package.json valid + dependency-free, 3 module(s) parse, read-only tool manifest, no write/network path.
> settlementforge@1.0.0 typecheck:ratchet
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
> settlementforge@1.0.0 typecheck:domain:strict
[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).
> settlementforge@1.0.0 lint
✖ 29 problems (0 errors, 29 warnings)
> settlementforge@1.0.0 test:ratchet
[test-ratchet] OK — no test regressions (11 known failure(s) of 28552 tests, ceiling 11).
> settlementforge@1.0.0 build
✓ built in 20.98s
> settlementforge@1.0.0 postbuild
[prerender] wrote 314 static route documents (13 views + 15 gallery hubs + 286 compendium entries) under dist/
> settlementforge@1.0.0 verify:dist
[test-ratchet] STRICT DIST OK — 51 discovered/reported file(s), 409 test(s), zero failed/non-run/uncollected/missing/extra/duplicate rows.
[gate-tail] exit: 0 (the gate's own status, not a pipe's)
TRUE_EXIT=0
```

**The census is back at its frozen ceiling of 11 — the same 11 that were red at base**, so
this lane hands back a terminal in exactly the state it found it, with 28,552 tests run.

### 7.1 `smoke:boot` — GREEN

`sh scripts/gate-tail.sh npm run smoke:boot`, same discipline, exit captured in-shell:

```
boot-smoke: 523 chunks · entry index-BiJH_6Nw.js
boot-smoke: stage 1: 6558 static chunk edges
boot-smoke: stage 3: shell mounted, 31706 B of markup under #root
boot-smoke: stage 2: 523/523 chunks initialised
boot-smoke: PASS — the built bundle boots.
[gate-tail] exit: 0 (the gate's own status, not a pipe's)
TRUE_EXIT=0
```

### 7.2 The edge bundles — cured, not re-recorded

An earlier gate run listed **17** rows; four were `tests/edgeFunctions` bundle-freshness.
Those were never a behaviour shift: `demographicsRates.js` is input 110 of `aiCharterBundle`
and 111 of `aiOutputSchemaBundle`, so the P4 additions legitimately move both `sourceHash`es
and the artifact had to be re-derived (`npm run build:edge-shared`, commit `2d1e09ce`).
`npx vitest run tests/edgeFunctions` is **38 files / 953 tests, all passing**. ⚠ A first pass
kept only the two bundles whose CONTENT changed and reverted the three whose meta moved only
in `generatedAt`; `edgeSharedBundleReproducibility`'s "all bundles share a single build
window — no stale siblings left behind" reds on exactly that. The provenance stamp is
load-bearing: five bundles built in one window must say so.

## 8. WHAT RS-4 MUST CHECK

1. **The full SK-4 grid, not these seven cells.** This lane measured the two firing cells and
   five controls. Every cell that lights `demographicsEnabled` moves; the grid-wide
   distribution (median ratio, cells under 0.5, the growth tail) has not been re-measured.
   RS-1's median was 0.449 and RS-3's 0.507 — expect both to rise.
2. **The GROWTH envelope.** Removing a lane that only ever subtracted must not push any cell
   through the ×20 ceiling. RS-3's growth tail already reached ×8.00 (`w0-soak-b::ca-435f4356`)
   and ×7.91 (`ca-0216b6bd`), both in rows that light `populationDynamics` + `migrationFlows` +
   `upswingArcs`. Those two rows are the ones to watch, and they were NOT measured here.
3. **`population_decline` must read exactly zero** in every receipt recording
   `demographicsEnabled: true` — that is the widened certification invariant, and it is now
   receipt-expressible, so the row can grade itself on it.
4. **The five lit-corpus walker figures** (§5.3) — whichever the chair rules on, RS-4 should
   confirm the banked numbers are the ones the tree actually produces.
5. **`spatialLedgers.demographicPlans` and `realmDemography`.** The reconciliation leaves far
   more people alive, so the P3 overflow lane and the P4 realm-demography channel will fire in
   cells where they previously could not. Nothing here measured them.
6. **The 55% mass-emigration conservation leak is STILL OPEN** (R-06's separate finding). The
   aspatial emigration path credits `abs × 0.45` and loses the rest. It is now the ONLY way the
   legacy lane writes population when lit, so the leak is the only remaining unconserved shrink
   outside the kernel — but it is small (DX1 measured `population_emigration` at −152 over 30
   years against the decline lane's −16,097). **Deliberately deferred — documented, not a bug
   to re-find.**
7. **`deficitPct` is population-blind** (§2). Until the food lane makes it relative to the live
   head count, a shrinking settlement carries a frozen mortality penalty forever. This does not
   block the cure (the deficit term has no positive fixed point past the starvation threshold,
   which is the anti-floor arm), but it is a real defect with a real consequence.

---

## 9. JUDGMENT ROWS, HAZARDS, AND WHAT WAS DELIBERATELY NOT DONE

### Judgment rows (each vetoable)

1. **JUDGMENT: chose to route only the CONDITION classes into the death term, retiring the
   legacy lane's `stability` base rate, because DX1 measured that the stability term alone
   never flipped the population rate's sign in 1,560 ticks × 4 settlements × 2 rows, and
   because generalized pressure still reaches the death term through the markers the same
   pressure axes mint at ≥ 0.5 — say "veto" to carry the stability term across too.**
   Consequence, stated plainly: a settlement with all six pressure axes high and NO
   condition markers no longer declines at all when lit.

2. **JUDGMENT: chose `DEATH_CRISIS_GAIN = 3.0` because it reproduces the legacy lane's own
   measured severity at the bound (−13.4%/yr against −13.0%/yr) and mirrors the existing
   `DEATH_DEFICIT_GAIN`, rather than a value chosen to hit a target ratio — say "veto" to
   retune it.** Every §4 figure moves with this constant; it is tuning-pass property under
   THE PROMISE and this lane claims no signature on it.

3. **JUDGMENT: chose the granary CLAIM alone as the ledger's veto and REFUSED `deficitPct`
   as a second arm, because that field is denominated against a generation-frozen
   `dailyNeed` and is itself raised by the famine it would arbitrate — say "veto" to admit
   it.** Recorded in the source at the function, not only here.

4. **JUDGMENT — RAISED, RULED, AND EXECUTED. Chose to report the thirteen lit-corpus rows
   rather than bank them, because `newsHeadlineContract`'s own A5 arm declares an inert-row
   addition authority-gated ("New inert rows require authority") and because every figure is
   downstream of judgment rows 1–3.** THE CHAIR RULED THE RE-RECORD AUTHORIZED (ODQ §271) on
   the ground that the three constants are derived-to-preserve rather than authored, making
   P4 a faithful port rather than a re-balancing; all thirteen are now banked under the four
   binding conditions, each explained at its own site. The constants remain flagged for the
   owner's tuning signature, and a veto there re-does this re-record at his values.

5. **JUDGMENT: chose to RE-POINT nine landed pins at the lane that now carries their claim
   rather than delete or re-baseline them, and to give each a fresh negative control — say
   "veto" to any individual re-point.** The full list is §6. The sharpest is
   `demographicsFloor` §1's negative control, which no longer re-imposes the integer
   deadband (a property of a lane that no longer writes) but instead **strips the occupancy
   scaling and the ledger veto** — the pre-P4 shape expressed in the term that replaced it —
   and watches the ratchet come back.

### Hazards this lane hit, for the next lane

- **⚠ A `--lighting` argv string of ~2,100 characters is SIGKILLed instantly (exit 137,
  zero output) under this harness's sandbox.** The capsule `replay.mjs` files are written
  that way. `--rules-json <path>` is the working spelling and takes the identical overlay;
  every figure in this report was measured through it.
- **⚠ `git archive` of a tip is NOT a valid substrate for `tests/edgeFunctions`.** Those
  rows assert inputs are *git-tracked*, and an archive is not a repository, so they red for
  the wrong reason (16 failures at base). A `git worktree add --detach <sha>` with a linked
  `node_modules` is the substrate that answers the question; there all four suites pass.
- **⚠ The edge-shared bundles must be rebuilt AS A SET.** Keeping only the two whose content
  changed and reverting the three whose meta moved only in `generatedAt` reds
  `edgeSharedBundleReproducibility`'s "all bundles share a single build window — no stale
  siblings left behind". The provenance stamp is load-bearing exactly as recorded.
- **⚠ `src/domain/worldPulse/demographicsRates.js` is an EDGE BUNDLE INPUT** (110 of
  `aiCharterBundle`, 111 of `aiOutputSchemaBundle`). Any edit to it reds four
  `tests/edgeFunctions` rows until `npm run build:edge-shared` runs. Not obvious from the
  file.
- **⚠ `scripts/lib/observed-shape-corpus.mjs:716` lights EVERY `*Enabled` flag it can find
  in source.** Five frozen walker instruments read that corpus, so ANY behaviour change
  behind ANY virtual flag — however dark in every shipped preset — moves all five. This is
  the mechanism by which a "nothing shipped moves" change still reds the gate.

### Not done, deliberately

- **The thirteen frozen figures were NOT re-recorded on this lane's own authority** — they
  were reported, ruled on by the chair (ODQ §271), and only then banked. §5.3.
- **No soak-grid re-run.** Seven configurations were measured, not 162. §8.
- **No `pressureModel.js` or `causalState.js` edit.** The famine self-reinforcement loop is
  traced through both (§2) but cured at the MINT rather than at either source term, because
  both are consumed by lanes far outside this charter and a demographics-gated edit inside
  the causal substrate would be a much larger blast radius for the same effect.
- **The 55% mass-emigration conservation leak is untouched** (R-06's separate finding). §8.6.
- **`deficitPct` is left population-blind.** §2, §8.7.
- **No ledger-branch write, no memory write, no ODQ write, no push, no branch ref moved.**

---

## 10. ARTIFACT INDEX

| artifact | what it is |
|---|---|
| `/private/tmp/TE36-base-cells.txt` | the seven base cells, one line each, with exit codes and wall-clock |
| `/private/tmp/TE36-cure-cells.txt` | the seven cured cells, same shape |
| `/private/tmp/TE36-BASE-*.log`, `TE36-CURE-*.log` | the full soak output for all fourteen cells |
| `/private/tmp/TE36-NEUTRAL-ca015-w0.log` | the behaviour-neutral arm (§5.2) |
| `/private/tmp/TE36-gate3.log` | the final `check:tail`, `TRUE_EXIT=1` captured in-shell |
| `/private/tmp/TE36-smokeboot.log` | `smoke:boot`, `TRUE_EXIT=0` |
| `/private/tmp/TE36-base-lintbuild.log`, `TE36-lintbuild.log` | base vs cured lint/build sweeps |
| `/private/tmp/TE36-cure-three.log`, `TE36-cure-two.log` | the five walkers in the PATCHED archive (attribution) |
| `/private/tmp/TE36-base-five.log` | the same five in the CLEAN archive (all pass) |
| `/private/tmp/TE36-basewt-edge.log` | the edge + golden suites in a real base worktree (all pass) |
| `/private/tmp/TE36-gate4.log` | the FINAL `check:tail`, all 17 steps, `TRUE_EXIT=0` |
| `/private/tmp/TE36-smokeboot2.log` | the final `smoke:boot`, `TRUE_EXIT=0` |
| `/private/tmp/TE36-keydiff.py` | the key-by-key differ used for condition 1 |
| `/private/tmp/TE36-golden-before.json` | the golden manifest as committed before the re-record |
| `/private/tmp/TE36-news-before.json`, `TE36-pf-before.json` | the two walker baselines before the re-record |
| `/private/tmp/TE36-prose-regen2.mjs` | the exact-identity differ proving proseNumerics is address rot |
| `/private/tmp/TE36.patch` | the source diff used to build the cured and neutral trees |
| `/private/tmp/TE36-base`, `-cure`, `-neutral` | the three measurement trees |
