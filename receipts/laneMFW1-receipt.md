# Lane MF-W1 — `waterViolations` 114 → 165 CHARACTERIZED (ODQ §252.3b): receipt

**Lane MF-W1 (Opus 5), 2026-08-17, a SMALL CHARACTERIZATION LANE under the FEATURE-LAW FREEZE.**
**Touched:** the sandbox only, under `MFW1-*` / `laneMFW1-*` prefixes. **NO git tree write, NO
repo gate, NO branch move, NO memory write, NO state-mutating git command.** The one git command
used was the read-only `git show refs/heads/review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md`
the brief specifies (plus `git -C … log/status` to confirm I had written nothing — the repo HEAD
has moved under me to `7298fa41` by a sibling lane; I touched none of it).
⚠ **`mf-proto/build-out/**` IS BYTE-UNCHANGED BY THIS LANE** — `find … -newermt "04:23"` returns
**0 files**. Every measurement ran in private copies (`laneMFW1-tip`, `-base`, `-cf1…cf5`).

---

## §0 · THE VERDICT, STATED FIRST

> ⭐⭐⭐ **THE MOVE IS NOT A REGRESSION. IT IS A DIFFERENT RIVER.** `waterViolations` 114 → 165
> is **+47 from the fork-key salt cure re-rolling the river's meander (cause 101)** and
> **−13 from the epoch / wall / version work (causes 97–100), which IMPROVED the figure.**
> The two orderings of the same 2×2 agree to the unit: +64/−13 and +4/+47, both totalling +51.

> ⭐⭐⭐ **AND THE CAUSE MF-ARCH-2 NAMED IS REFUTED BY EXECUTION.** §8 said "the wall pulling
> inward pushed fabric — and with it street channels — into ground near the water." **`year-018`
> HAS NO CIRCUIT AT ALL (0 rings) AND MOVED BY EXACTLY THE SAME +10, WITH A BYTE-IDENTICAL
> VIOLATION KEY SET, as the five walled leaves beside it.** No wall can explain a move on a leaf
> that has no wall. Isolating the wall work on the two leaves the meander key cannot reach
> (`city`, `migration` — coastal) gives **−7 each, a 16 % improvement.**

> ⚠⚠ **AND THE COMPARISON IS SMALLER THAN IT LOOKS, BECAUSE THE CORPUS IS NOT 16 WORLDS.**
> **SEVEN of the sixteen leaves are seed `mf-town-01` + riverside** (town · siege · plague ·
> famine · year-018 · year-100 · highwater) and **TWO are `mf-city-01` + coastal.** The corpus
> §205A total publishes a one-river move up to **six times**. The +51 is really **+10 on one
> river town (×6) +5 on that same town demoted −7 on one coastal city (×2)**.

**VERDICT: MIXED, and the mixture is 92 % SAMPLE / 8 % ARCHITECTURE, with the architecture half
pointing the RIGHT way.** No cure is owed by MF-ARCH-2. One genuine pre-existing defect was found
and is handed to wave nine with an exact, pixel-free blast radius (§5).

---

## §1 · IS IT THE SAME INSTRUMENT? — ANSWERED FIRST, BECAUSE NOTHING ELSE IS MEANINGFUL UNTIL IT IS

The brief's suspicion was right about the *headline* and wrong about the *comparison*, and the
distinction is the whole of question 3.

**CONFIRMED, by sha of the function text itself** (`awk '/^export function waterRightOfWay/,/^}$/'
| shasum), so the claim rests on bytes rather than on reading a diff:

```
laneMFARCH-tip        f4da4212383bd06ac087a1364f017e78df39e7e9   ⟵ MF-ARCH's cured predicate
laneMFARCH2-tip       f4da4212383bd06ac087a1364f017e78df39e7e9   ⟵ IDENTICAL
mf-proto/build-out    f4da4212383bd06ac087a1364f017e78df39e7e9   ⟵ IDENTICAL
laneMFB8b-tip         857163fd147623ee4abc4e819f8169c35aeb9fc5   ⟵ the BLIND predicate
reservedGround.js     2a2989d2… at ARCH / ARCH-2 / build-out; 321fad32… at B8b
```

⭐ **SO `114 → 165` IS SAME-INSTRUMENT AND THE MOVE IS REAL. `100 → 165` IS NOT.** MF-ARCH's
predicate cure and MF-ARCH-2's fabric change are two independent things, and the honest way to
publish them is the 2×2, **every cell of which I executed this session**:

| | **B8b BLIND predicate** | **MF-ARCH CURED predicate** | predicate contributes |
|---|---|---|---|
| **MF-ARCH fabric** (old river) | **100** ✔ *(= MF-B8b published)* | **114** ✔ *(= MF-ARCH published)* | **+14** |
| **MF-ARCH-2 fabric** (new river) | **153** *(new)* | **165** ✔ *(= MF-ARCH-2 published)* | **+12** |
| **fabric contributes** | **+53** | **+51** | |

**THE TRUE PRE-CURE FIGURE UNDER THE CORRECTED PREDICATE IS `114`, AND MF-ARCH ALREADY PUBLISHED
IT.** The landing owes no re-derivation: MF-ARCH re-measured the B8b fabric with the cured
predicate and declared zero pixel movement, so 114 and 165 sit on the same instrument. **What the
landing must NOT do is quote `100 → 165` as one movement** — that sentence silently adds a
+12 honesty correction to a +51 sample change.

⚠ **THE INSTRUMENT USED HERE IS THE CENSUS'S OWN OUTPUT, NOT A RE-DERIVATION.** `buildFabric` in
my private tips hands the run `closing.water` through an inert probe (`if (globalThis.__MFW1_SPY)
…`, one falsy read when unset), and every run asserts the spied triple equals
`meta.waterCrossings/waterExempt/waterViolations`; `spyDisagreements=0` on every run below.
⭐ **THE PROBE IS PROVED INERT BY SHA:** my tip's run-1 parchment digests are **byte-identical to
MF-ARCH-2's published table** — `town 85fe7726…`, `city ae2eb05f…`, `highwater ed8a78f0…`,
`fjord 8c083827…`. ⛔ *The first version of this instrument rebuilt the census's inputs from the
fabric's published surfaces instead, and was **wrong on six leaves** — `fabric.landmarks` is
`seating.seated` while the census walks `seatedAll = seating.seated.concat(compoundPass.seated)`.
The equality assert caught it. **A DECOMPOSITION REBUILT FROM PUBLISHED SURFACES IS A SECOND
SUBJECT UNTIL AN EQUALITY ASSERT SAYS OTHERWISE.***

---

## §2 · THE DECOMPOSITION — THIS TABLE IS THE DELIVERABLE

### §2.1 · BY LEAF: only THREE distinct worlds moved at all

```
leaf          rings  water |  violations  base→tip   Δ  |  STREET c/x/v base → tip  |  BODY c/x/v base → tip
thorp/hamlet/village/mountain/metropolis/polycentric  — no watercourse — 0 → 0, all six
town            1   river  |     3 →  13   +10        |   5/ 3/  2 →  10/ 1/  9    |   1/ 0/ 1 →  7/ 3/ 4
siege           1   river  |     3 →  13   +10        |   5/ 3/  2 →  10/ 1/  9    |   1/ 0/ 1 →  7/ 3/ 4
plague          1   river  |     3 →  13   +10        |   5/ 3/  2 →  10/ 1/  9    |   1/ 0/ 1 →  7/ 3/ 4
famine          1   river  |     3 →  13   +10        |   5/ 3/  2 →  10/ 1/  9    |   1/ 0/ 1 →  7/ 3/ 4
year-018    ⭐ 0   river  |     3 →  13   +10        |   5/ 3/  2 →  10/ 1/  9    |   1/ 0/ 1 →  7/ 3/ 4
year-100        1   river  |     3 →  13   +10        |   5/ 3/  2 →  10/ 1/  9    |   1/ 0/ 1 →  7/ 3/ 4
highwater       2   river  |     6 →  11    +5        |   5/ 3/  2 →   9/ 2/  7    |   4/ 0/ 4 →  4/ 0/ 4
city            2   coast  |    44 →  37    −7        |  39/ 2/ 37 →  32/ 0/ 32    |   7/ 0/ 7 →  5/ 0/ 5
migration       2   coast  |    44 →  37    −7        |  39/ 2/ 37 →  32/ 0/ 32    |   7/ 0/ 7 →  5/ 0/ 5
fjord           0   coast  |     2 →   2    +0        |   2/ 0/  2 →   2/ 0/  2    |   2/ 2/ 0 →  2/ 2/ 0
─────────────────────────────────────────────────────────────────────────────────────────────────
CORPUS                     |   114 → 165   +51        |  115/25/ 90 → 135/ 8/127   |  26/ 2/24 → 58/20/38
                              (+60 town family, +5 highwater, −14 coastal city family)
```

⭐⭐⭐ **THE `year-018` ROW IS THE PROOF.** It carries **zero circuits** (`§11.11 the town in
year 18: NO CIRCUIT — it was raised in year 49`) and it moved by **+10 with the SAME NINE ADDED
AND SAME TWO GONE violation keys** as the five walled leaves. A cause that requires a wall cannot
produce that row.

⚠ **AND THE SIX ROWS THAT READ +10 ARE ONE RIVER SIX TIMES.** town / siege / plague / famine /
year-018 / year-100 are all `seed: mf-town-01, terrain: riverside`; highwater is the same seed
demoted. The distinct-site denominator is **10 worlds, not 16 leaves**.

### §2.2 · BY CAUSE: the paired counterfactual, both directions

Two probe tips, each edit asserted to hit exactly 2 sites so a silent no-op cannot pass as a
result: **cf1** = MF-ARCH-2's tip with `fork('meander')` reverted to `` `${seed}|meander` ``;
**cf2** = MF-ARCH's tip with the meander key advanced to `fabricForkKey(seed,'meander',{variant})`.

```
leaf          base  cf2(meander only)  cf1(everything else)   tip  ||  meander@W1  everything-else@M0
town family      3         13                   6              13  ||     +7            +3
highwater        6         10                   6              11  ||     +5            +0
city/migration  44         44                  37              37  ||     +0            −7
fjord            2          2                   2               2  ||     +0            +0
─────────────────────────────────────────────────────────────────────────────────────────────
CORPUS         114        178                 118             165  ||    +47            +4
                       (+64 alone)        (+4 alone)                   interaction −17
```

**BOTH SEQUENCINGS CLOSE ON +51 EXACTLY:** `+64 (meander) −13 (rest)` = `+4 (rest) +47 (meander)`
= **+51**. ⭐ **THE FORK-KEY MEANDER CURE IS 92 % OF THE MOVE (47/51); EVERYTHING ELSE MF-ARCH-2
DID IS +4 IN THE OLD RIVER'S WORLD AND −13 IN THE SHIPPED ONE.**

⭐ **WHY THE MEANDER KEY MOVES THE RIVER AT ALL.** `fabricForkKey(seed,'meander',{variant:0})`
composes `` `${seed}::map-fabric:v3::meander::y0` ``, which is a **different string** from
`` `${seed}|meander` `` — a different `xmur3` seed, a different `sfc32` stream, a different
meander train. MF-ARCH-2 correctly classified that key as **LATENT for the REROLL SALT** (its
trace input already carried the variant); **latent-for-the-salt is not the same claim as
byte-neutral at variant 0**, and the receipt did not distinguish them.
⭐⭐ **THE CLASS: A KEY-SPELLING CURE IS ALWAYS A SAME-SEED SHIFT EVEN WHEN THE DEFECT IT CURES
IS LATENT.** MF-ARCH-2 declared this correctly as cause 101 ("moves every leaf in the corpus");
what it did not do is connect cause 101 to the wrong-way figure, and attributed it to the wall.

**MEASURED WITNESS: THE WATER CENTRELINE ITSELF MOVED ON EXACTLY THE RIVER LEAVES.** Comparing
`waterRel.line` vertex-for-vertex, base → tip: `⛔ LINE MOVED` on town/siege/plague/famine/
year-018/year-100/highwater; `LINE IDENTICAL` on city/migration/fjord (coasts, which take no
meander). Bridge counts moved with it — the town family **3 → 2**, highwater **2 → 3**, corpus
**20 → 15**.

### §2.3 · BY ARM AND BY THE RULE THAT REFUSES THE EXEMPTION

Every street violation classified against `deriveBridges`' own three refusals:

| class | what it means | MF-ARCH | MF-ARCH-2 |
|---|---|---|---|
| **A · PASSAGE** | `deriveBridges` skips `rank === 'passage'` outright — *a person-wide gap does not bridge* — so a passage crossing water can NEVER be exempted | 10 | **20** |
| **B · NO CENTRELINE CROSS** | the channel enters the water BAND but never intersects the centreline, so the deriver's `crossPoint` cannot see it **at all** | 50 | **72** |
| **C · UNDER-DECKED** | the channel does cross (≥1 true intersection) but `covered === inside` fails: the deriver takes the FIRST crossing per channel and `break`s, and dedups by distance | 30 | **35** |
| | **total street violations** | **90** | **127** |

⭐⭐⭐ **92 OF 127 STREET VIOLATIONS (72 %) CANNOT BE EXEMPTED BY CONSTRUCTION — AND 60 OF 90
(67 %) COULD NOT BEFORE MF-ARCH-2 EITHER.** The share barely moved; only the sample did.

⛔⛔ **AND CLASS B IS THE §238 CLASS LEFT HALF-CURED ACROSS A MODULE BOUNDARY.** MF-ARCH made the
census segment-true (`segSegClosest(...) < half`) and **did not carry the change to the bridge
deriver**, which still asks `crossPoint` — a *true intersection with the centreline*. The two
modules now ask different questions of the same two lines, so **the census convicts exactly the
crossings the deriver is structurally blind to**. This is a MF-ARCH-era gap that MF-ARCH-2
inherited; it is not a MF-ARCH-2 regression.

⚠ **AND THE COAST IS A DIFFERENT ANIMAL THE STREET ARM WAS NOT DESIGNED FOR.** On `city`,
`street.road.approach.corridor.2~frame.2` reports **inside = 775, covered = 43, centreline
crossings = 775**; on `fjord`, **555 / 0 / 555**. That is not a road in the sea — it is a road
running **alongside** a meandering shoreline, inside the drawn shore's own half-width for its
whole length. "Crossing" is ill-defined for a coast, and the two coastal leaves carry 32–37 of
the corpus's 127 street violations because of it.

---

## §3 · IS +10 A REGRESSION OR THE STATISTIC'S ORDINARY SPREAD? — THE DISTRIBUTION SETTLES IT

A single-variant comparison is one draw against one draw. Both tips were swept over reroll
variants of the **same** settlement and of the **whole** corpus.

**ONE RIVER TOWN, 12 rerolls at MF-ARCH-2's tip vs 6 at MF-ARCH's:**

```
MF-ARCH-2 tip   variants 0…11: 13,13,15,2,11,8,6,9,11,0,12,0   min 0  max 15  mean 8.3  sd 5.0
MF-ARCH base    variants 0…5 :  3, 8,20,3, 6,10               min 3  max 20  mean 8.3  sd 5.8
```

⭐⭐⭐ **THE TWO MEANS ARE IDENTICAL AT 8.3.** MF-ARCH's published `3` is **1.1 sd BELOW** its own
distribution's mean; MF-ARCH-2's `13` is **0.9 sd ABOVE** its. The wave did not make the town
wetter — it re-rolled the river, and the before-figure happened to be a lucky draw.

**THE WHOLE CORPUS, 6 reroll variants per tip:**

```
                       corpus violations                distinct-site violations (10 worlds)
MF-ARCH base    114,104,202,144,77,151  mean 132.0 sd 39.9   55,50,82,88,36,68  mean 63.2 sd 18.1
MF-ARCH-2 tip   165,131,187,140,106,132  mean 143.5 sd 26.0   63,47,85,90,39,64  mean 64.7 sd 18.4
```

⭐⭐⭐ **THE DISTINCT-SITE MEAN MOVED +1.5 AGAINST sd ≈18. THAT IS NOISE.** The published
114 → 165 is **−0.45 sd → +0.83 sd**: two ordinary draws from two indistinguishable
distributions. ⭐ MF-ARCH-2's reroll spread is also *tighter* (sd 26.0 vs 39.9).

⭐ **AND THE SWEEP IS ITSELF THE FORK-KEY CURE'S BEHAVIOURAL PROOF** — the one MF-ARCH-2 said it
could not produce (§4: *"provable by construction and not by a moved sha"*). At MF-ARCH's tip the
meander key carried no variant, so a reroll could only move the river through its trace input; at
MF-ARCH-2's tip the meander stream itself re-rolls, and **12 variants produce 12 distinct rivers.**

---

## §4 · SIBLING FIGURES — ALL THREE VINTAGES, RE-MEASURED BY ME, IN ONE TABLE

Every cell below was executed this session at `laneMFW1-{cf5,base,tip}`; the three published
vintages are reproduced to the unit, which is what licenses the fourth column.

| meta field | **MF-B8b** (blind predicate, old fabric) | **MF-ARCH** (cured predicate, old fabric) | **MF-ARCH-2** (cured predicate, new fabric) | reading |
|---|---|---|---|---|
| `waterCrossings` | 125 ✔ | 141 ✔ | **193** ✔ | +16 instrument, +52 sample |
| `waterExempt` | 25 ✔ | 27 ✔ | **28** ✔ | |
| `waterViolations` | 100 ✔ | 114 ✔ | **165** ✔ | +14 instrument, +51 sample (§2) |
| `zoneOutside` | 281 ✔ | 281 ✔ | **237** ✔ | **improvement, −44** |
| `zoneMajorityOutside` | 444 ✔ | 258 ✔ | **217** ✔ | −186 instrument, **−41 improvement** |
| `zoneOffBand` | 54 ✔ | 54 ✔ | **63** ✔ | moved with the fabric |
| ⭐ `zoneUnwashedBodies` | 4,261 ✔ | 4,261 ✔ | **2,137** ✔ | **UNREPORTED BY MF-ARCH-2 — a 50 % improvement** |
| `bridges` | 20 ✔ | 20 ✔ | **15** ✔ | **UNREPORTED — moved with the river** |
| `riverClaimWidth` | 145.4 ✔ | 145.4 ✔ | **145.4** ✔ | unchanged |
| `landlocked` · `orphanStreets` | 0 · 0 ✔ | 0 · 0 ✔ | **0 · 0** ✔ | preserved |
| `physicalViolations` | 1 ✔ | 1 ✔ | **1** ✔ | polycentric, unchanged all three waves |

⚠ **TWO FIGURES MF-ARCH-2's §8 TABLE DOES NOT CARRY AND THE LANDING SHOULD**: `zoneUnwashedBodies`
**halved** (4,261 → 2,137 — the largest single improvement in the wave, unreported), and `bridges`
**20 → 15**, which is the visible consequence of the re-rolled river and belongs beside
`waterCrossings` rather than being discovered later as a surprise.

### ⭐ THE ONE AUTHORITATIVE SET THE LANDING SHOULD DECLARE

> **§205A / §203 AT THE LANDING TIP** — `waterCrossings` **193** · `waterExempt` **28** ·
> `waterViolations` **165** · `bridges` **15** · `riverClaimWidth` **145.4** ·
> `zoneOutside` **237** · `zoneMajorityOutside` **217** · `zoneOffBand` **63** ·
> `zoneUnwashedBodies` **2,137** · `landlocked` **0** · `orphanStreets` **0** ·
> `physicalViolations` **1**.
>
> **Stated against MF-B8b as ONE movement with TWO named halves, never as one number:**
> *"MF-ARCH's predicate corrections account for `waterCrossings` +16, `waterViolations` +14 and
> `zoneMajorityOutside` −186 on a byte-identical fabric; MF-ARCH-2's fabric change accounts for
> the rest. `waterViolations` 114 → 165 is one draw against another from a reroll distribution
> whose mean did not move (63.2 → 64.7 per distinct site, sd ≈18); 92 % of it is the meander
> fork-key cure (cause 101) re-rolling the river, and MF-ARCH-2's epoch and wall work moved the
> figure DOWN by 13."*

---

## §5 · THE ONE REAL DEFECT FOUND — MEASURED, PIXEL-FREE, AND HANDED OFF

⛔⛔ **A BANK-ROOTED WATERMILL STANDING ON ITS OWN RIVER IS CONVICTED AS AN UNLAWFUL STRUCTURE,
BECAUSE THE EXEMPTION PREDICATE CANNOT READ THE FIELD THAT WOULD ACQUIT IT.**

`leafCensus.js`, the marine exemption:

```js
const marine = /port|quay|mill|ferry|bridge|dock|wharf/i.test(String(lm.archetype || lm.anchorKey || ''));
```

**MEASURED on the town family:** `inst.name.mill#0#0` carries `archetype = "extraction"`,
`anchorKey = "name:mill"`, `rooted = true`. The `||` short-circuits on the truthy archetype, so
**`anchorKey` is unreachable for every landmark that has an archetype — which is all of them** —
and the regex's own word `mill` can never fire. A mill is the archetypal lawful water work; the
rule already names it; the string it is tested against simply cannot contain it.

⭐ **THE CLASS, and it is this programme's dominant one wearing a new costume: `a || b` READS AS
"a, FALLING BACK TO b" AND IS IN FACT "a, AND b IS DEAD CODE" WHENEVER `a` IS RELIABLY TRUTHY.**
A fallback that never falls back is a §238 blind predicate with an idiom instead of a comment.

**THE NARROWEST CURE, BUILT AND MEASURED IN `laneMFW1-cf3`** — read both strings:

```js
const marine = /…/i.test(`${String(lm.archetype || '')} ${String(lm.anchorKey || '')}`);
```

**BLAST RADIUS, EXECUTED:**

```
crossings   193 → 193   UNCHANGED — the subject set does not move
exempt       28 →  34   +6, all into `bank-rooted work`
violations  165 → 159   −6, exactly one on each of the six mf-town-01 replicas
street arm  127 → 127   UNTOUCHED
run-1 parchment sha, town/city/highwater/fjord — ⭐ BYTE-IDENTICAL (85fe7726… / ae2eb05f… /
                                                  ed8a78f0… / 8c083827…). NOT ONE PIXEL MOVES.
```

⛔ **I DID NOT LAND IT, DELIBERATELY (J-W1-2).** Three reasons, all of which outrank its
smallness: it *widens a census exemption*, which is the exact class MF-ARCH (§3.3, the §205A
subject set) and MF-ARCH-2 both refused under the §234.4 feature-law freeze, and a third lane
quietly taking the opposite decision would break that consistency; it moves a **published
figure**, and this lane exists to give the landing ONE set of water numbers rather than a fifth
vintage; and the correct home for it is the same wave-nine pass that must also rule on classes A
and B in §2.3, since all three are the same question — *which crossings the law intends to
forgive*. **It is proved, costed and ready; it needs a ruling, not a lane.**

---

## §6 · WHAT WAVE NINE INHERITS, IN PRIORITY ORDER

1. ⭐⭐⭐ **RULE ON THE THREE STRUCTURAL EXEMPTION GAPS TOGETHER** — they are one question.
   **(A)** `deriveBridges` refuses `rank === 'passage'` while §205A convicts passages: **20
   violations**, permanently unexemptable. **(B)** `deriveBridges` asks `crossPoint` (true
   centreline intersection) while the cured census asks `segSegClosest < half` (band incursion):
   **72 violations the deriver is structurally blind to** — MF-ARCH's segment-true cure never
   crossed the module boundary. **(C)** the deriver takes the FIRST crossing per channel and
   `break`s while the census demands `covered === inside`: **35 violations**. Together **92 of
   127 street violations (72 %)**. ⚠ *The cure is NOT to convict less — it is to decide whether a
   band incursion without a centreline crossing is a crossing at all, and to say so in one place.*
2. ⭐⭐ **THE MILL EXEMPTION** (§5) — one line, −6, zero pixels, proved.
3. ⭐⭐ **THE §205A STREET ARM WAS DESIGNED FOR A RIVER AND IS APPLIED TO A COAST.** A shore-
   parallel road scores 775 "crossings" on `city` and 555 on `fjord`. Until that is ruled on, the
   coastal leaves dominate the corpus street total and the figure is not comparable across
   terrains. *(This is the §205A analogue of the half-ring exemption MF-ARCH-2 had to turn from a
   tolerance into a rule.)*
4. ⚠⚠ **THE CORPUS CANNOT CARRY A CORPUS-WIDE §205A TOTAL HONESTLY WHILE 7 OF 16 LEAVES SHARE ONE
   SEED.** Either publish the **distinct-site** total (10 worlds) beside it, or the next wave will
   again read a one-river move as a sixfold corpus regression. **This is the cheapest structural
   prevention available and it costs one line in the harness.**
5. ⚠ **MF-ARCH's `substrate.js` second salt spelling (4 sites) is still open**, and it is the same
   class as the meander key: converting it will move every leaf once, for no measured defect, and
   **that shift must be declared as a re-roll rather than attributed to whatever geometry work
   rides beside it.** This lane is the worked example of the mis-attribution.

---

## §7 · WHAT I DID NOT DO — stated plainly

1. ⛔ **I DID NOT LAND ANY CURE.** `build-out` is byte-unchanged (`find -newermt` = 0 files). The
   mill cure exists only in the disposable `laneMFW1-cf3`.
2. ⛔ **I DID NOT RE-RUN THE SUITE OR THE GATE.** The brief forbids the repo gate and this lane
   changed no shipped source; MF-ARCH-2's 162/162 and its determinism digest stand untouched, and
   my tip's four render SHAs re-quoted above are byte-identical to its published table, which is
   the evidence that my measurements were taken at its tree and not at a drifted one.
3. ⛔ **THE COAST CASE IS NAMED, NOT SOLVED** (§6.3). I measured `inside=775` and stopped; deciding
   what "crossing a shoreline" means is a law question under freeze.
4. ⛔ **THE REROLL SWEEPS ARE 6–12 VARIANTS, NOT A SOAK.** They are ample to refute "the mean
   moved" (a +1.5 shift against sd 18) and are **not** a distributional characterization of
   §205A. A wave that wants to *tune* this figure needs more.
5. ⛔ **I DID NOT AUDIT THE OTHER FOUR FORK-KEY CHANGES INDIVIDUALLY** (`umb`, `built-umb`,
   `built|wall`, `colonize`). They sit inside the "+4 everything-else" residual together with the
   epoch axis. ⭐ *That residual is +3 on `year-018`, which has no wall — so on the town family the
   wall's own contribution is **0**, and the +3 belongs to those four keys, not to the circuit.*
6. ⛔ **NO MEMORY WRITE, NO PLATE REVIEW, NO ODQ EDIT.** §252.3(c) already closed the zoom gap.

---

## §8 · JUDGMENTS (all vetoable)

- **J-W1-1 · I MEASURED THE CENSUS'S OWN OUTPUT THROUGH AN INERT PROBE RATHER THAN REBUILDING ITS
  INPUTS.** The rebuild-from-published-surfaces version was **wrong on six leaves** and only the
  equality assert caught it. The probe costs one guarded falsy read in two private tips and is
  proved inert by four byte-identical render SHAs. *Veto and I will re-measure by re-derivation,
  carrying the `seatedAll` discrepancy explicitly.*
- **J-W1-2 · THE MILL CURE IS HANDED OFF, NOT LANDED** (§5). It is small, provable and pixel-free,
  and it is still an exemption widening under a freeze that two prior lanes honoured on the
  adjacent item — and landing it would hand the landing a fifth vintage of the very numbers this
  lane exists to unify. *Say "veto" and it is a one-line edit with a measured −6.*
- **J-W1-3 · I REPORT THE DISTINCT-SITE TOTAL BESIDE THE CORPUS TOTAL** rather than silently
  replacing it. The corpus total is what every prior receipt published and continuity matters; the
  distinct-site total is what the figure MEANS. *Both are given so neither reading is smuggled.*
- **J-W1-4 · I DECLARE THE MOVE "NOT A REGRESSION" ON DISTRIBUTIONAL EVIDENCE, NOT ON THE ABSENCE
  OF A FOUND DEFECT.** Three real defects WERE found (§5, §6.1) — but all three pre-date
  MF-ARCH-2, their share of violations barely moved (67 % → 72 %), and the reroll means are
  indistinguishable. *The honest verdict is "MF-ARCH-2 introduced none of this", not "there is
  nothing here".*
- **J-W1-5 · I CORRECTED MF-ARCH-2's STATED CAUSE RATHER THAN ELABORATING IT.** §8's "the wall
  pulling inward pushed fabric into ground near the water" is refuted by `year-018` and by the
  paired counterfactual. *Recorded as a correction because the receipt is otherwise exemplary and
  the error is instructive: **the wave's most visible change is not the default explanation for
  its most surprising number.***

---

## §9 · MEMORY-WORTHY FACTS FOR THE CHAIR

1. ⭐⭐⭐ **A KEY-SPELLING CURE IS A SAME-SEED SHIFT EVEN WHEN THE DEFECT IT CURES IS LATENT.**
   `${seed}|meander` → `fabricForkKey(seed,'meander',…)` is a different string, therefore a
   different stream, therefore **a different river** — and it moved a published census figure by
   **+47** while its own receipt attributed the move to a wall.
2. ⭐⭐⭐ **A CORPUS THAT REPLICATES ONE SEED SEVEN TIMES PUBLISHES A ONE-WORLD MOVE SEVENFOLD.**
   `+51 corpus-wide` was `+10 on one river town`. Always report the distinct-site denominator.
3. ⭐⭐⭐ **BEFORE CALLING A MOVED STATISTIC A REGRESSION, MEASURE ITS REROLL SPREAD.** §205A on a
   river town: mean **8.3** at both tips, sd **5.0 / 5.8**, spanning **0–15** and **3–20** across
   the two sweeps. The "before" (3) and "after" (13) were
   ordinary draws from the same distribution — and the two tips' MEANS ARE IDENTICAL.
4. ⭐⭐⭐ **A HALF-CURED PREDICATE ACROSS A MODULE BOUNDARY MANUFACTURES VIOLATIONS.** MF-ARCH made
   the census segment-true and left `deriveBridges` asking for a true centreline intersection —
   so **72 of 127** street violations are crossings the bridge deriver is structurally unable to
   see, let alone deck.
5. ⭐⭐ **`a || b` IS "a, AND b IS DEAD CODE" WHENEVER `a` IS RELIABLY TRUTHY.** The marine
   exemption's `String(lm.archetype || lm.anchorKey || '')` made its own word `mill` unreachable
   and convicted a bank-rooted watermill on its own river.
6. ⭐⭐ **A DECOMPOSITION REBUILT FROM PUBLISHED SURFACES IS A SECOND SUBJECT UNTIL AN EQUALITY
   ASSERT SAYS OTHERWISE.** `fabric.landmarks` is `seating.seated`; the census walks `seatedAll`.
   Six leaves were silently wrong until the assert red.
7. ⭐ **AN UNWALLED LEAF IS THE CHEAPEST CONTROL A WALL WAVE CAN HAVE, AND `year-018` IS ONE
   INSIDE THE CORPUS ALREADY.** It refuted a wall hypothesis in a single table row.

---

## §10 · ARTIFACTS (all in the scratchpad root, `MFW1-*` / `laneMFW1-*`)

| file | what it is |
|---|---|
| `MFW1-water.mjs` | §205A decomposed by leaf and arm at a tip, via the inert census probe, with the meta-equality assert |
| `MFW1-attrib.mjs` | every street violation classified A/B/C against `deriveBridges`' own refusals; every body violation with both exemption strings |
| `MFW1-diff.mjs` | base → tip per-leaf table, context inputs, and the violation KEY SETS (added/gone/held) |
| `MFW1-spread.mjs` · `MFW1-corpus-spread.mjs` | reroll-variant distributions, one town and the whole corpus, with the distinct-site denominator |
| `MFW1-mkcf.mjs` | mints the paired counterfactual tips, asserting each edit hits exactly 2 sites |
| `MFW1-meta.mjs` · `MFW1-rendersha.mjs` | the full published meta table; run-1 parchment SHAs |
| `MFW1-water-{arch,arch2,cf1..cf5}.json` · `MFW1-attrib-{base,tip}.json` · `MFW1-diff.txt` · `MFW1-corpus-spread-{base,tip}.log` | the measurements |
| `laneMFW1-{tip,base,cf1,cf2,cf3,cf4,cf5}` | disposable private tips — **cf3 carries the proved mill cure** |
