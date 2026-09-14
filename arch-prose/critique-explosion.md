# CRITIQUE-EXPLOSION — v1 attacked on THE BOUNDS ARITHMETIC

**Seat: Opus 5 — Fable-unvalidated (the adversary). Read-only throughout; nothing written outside `$SC/arch-prose/`.**
Target: `ARCH-COMPOSED-PROSE.md` v1 (639 lines). Product read at `$SC/laneB6` = 3b1c0eaa5; instruments at `$SC/skepINSTR` = 74a1aa0e8. No vitest, no build, no git write.

**Provenance.** CONFIRMED = a command I ran in this pass whose output I saw. CITED = a `file:line` I read. ESTIMATE = arithmetic on cited inputs, marked.

**Commands executed here** (all read-only, all under `$SC/arch-prose/`):
- `_crit-pools.mjs` → `DS-DEF-11: pools=5 variants=12 hist={2:3,3:2}` · `DS-DEF-2: pools=26 variants=78 hist={3:26}` · `DS-GEN-3: pools=42 variants=128 hist={2:6,3:28,4:8}` · `ESTATE pools 708 variants 2266 textBytes 280581 meanTextBytes 123.8`
- `_crit-gen3.mjs` → DS-GEN-3's 42 pool keys with per-pool variant counts
- `_crit-occ.mjs` → C's 200-town output re-read: 56 cells; per-fact firing totals sum to exactly 200 per fact (a PARTITION); DS-GEN-3 fired 38 of 42 pools, 4 never fired
- `_crit-flat.mjs` → 141,600 reads: grouped flatten preserves the semantic variant on **45.21 %**, **interleaved flatten on 100.00 %**, faces uniform 25.11/25.18/24.93/24.78 %
- `_crit-stats.mjs` → Wilson intervals, floor-crossing probabilities, repeat-census collision expectations, coverage and byte arithmetic
- reads: `laneB6/tests/property/generatorGoldenMaster.test.js:767-850` (the 525-row corpus builder), `laneB6/src/domain/display/stateProse/defenseStateProse.js:300-330,355-372`, `laneB6/src/data/cultureProfiles.js:525`, and v1 whole.

---

## F1 — BREAKS · HIGH · `attach ≤ 3` turns §6.2's LINEAR law into a discounted PRODUCT; the design buys linearity or coverage, never both

**v1 claims** (§6.2): "Authored pieces = `k·(|S| + Σ|V_i|)` semantic sentences … **LINEAR in the facts and their values**. Hand-authoring the cells costs `k·|S|·Π(|V_i|+1)` — the product the owner named."

**The omitted factor.** `attach` is a list of **spine KEYS of this block, ≤ 3** (`§2.3`; `§2.5` refuses "> 3"). A modifier that should speak on all of a block's `|S|` spines must therefore be replicated `⌈|S|/3⌉` times, each replica a full pool of `k` variants × 4 faces. The honest law is

```
pieces = k·|S|  +  k · Σ_i ( |V_i^authored| · ⌈coverage_i / 3⌉ )
```

**Measured on the design's own worked blocks** (CONFIRMED, `_crit-pools.mjs`):

| block | spine pools `|S|` | v1's modifier budget | spines reachable | share |
|---|---|---|---|---|
| DS-GEN-3 | **42** | 3 pools (one refused ⇒ 2 live), attach 3 each | 4 (`military ADEQUATE/WEAK/CRITICAL`, `internal WEAK`) | **9.5 %** |
| DS-DEF-2 | **26** | 2 pools, attach 3 (the same 3 disaster cells) | 3 | **11.5 %** |
| DS-DEF-11 | 5 | 3 pools | 5 | 100 % (only because `|S| = 5`) |

To cover DS-GEN-3's 42 spines with its two modifiers costs `2 × ⌈42/3⌉ = 28` pools = **84 semantic pieces**, not the 6 §6.5 budgets. That is still 4.5× cheaper than the hand-cut alternative (42 × 3 states × 3 = 378) — real, but a **discounted product, not a linear corpus**. §6.6's flat "≈ 3 modifier pools × 3 variants on each of ≈ 50 blocks" holds the corpus linear by holding coverage at `9/|S|`, which on the estate's largest blocks is 10 %.

**Fix.** Restate §6.2's law with the `⌈coverage/3⌉` factor and print, per block, the ATTACH COVERAGE (share of spine pools reachable by any modifier) as a car-0 acceptance number; then either raise `attach` to "every spine of the block whose branch does not `test` the modifier's field, derived by the census, with a printed refusal above a ceiling" (the echo bound already caps the reach across mounts, so `attach ≤ 3` is a second, redundant, coverage-destroying cap), or state in §6.6 and §14 that composition reaches ~10 % of the estate's spine cells in wave one.

---

## F2 — BREAKS · HIGH · the DEPTH bound ("never four") is settable by the author, and v1's own worked block already sets it

**v1 claims** (§4.4): "`k ≤ 3 − |spine.reads|`, where `reads` is the spine's **DECLARED** claim set … A modifier reads exactly one field, so a unit never holds four facts — the brief's DEPTH bound ('never four') **made structural**."

**It is not structural; it is declarative.** `tests` is recovered by the census ("every field the pool's selecting branch evaluates", §2.3); `reads` is the author's declaration, constrained only by `reads ⊆ tests`. A smaller declaration buys modifier budget.

**v1's own worked table does exactly this.** Source (CONFIRMED, `defenseStateProse.js:309-317`):

```js
export function invasionRowPoolKey(walls, garrison, militia) {
  if (walls) {
    if (garrison) return key('walls AND professional garrison');
    return militia ? key('walls with citizen militia') : key('walls with NO force');
  }
  ...
```

To reach `walls with citizen militia` the branch evaluates **walls, garrison (false), militia** — `tests` = 3 fields. §6.4 declares its `reads` as `{walls, militia}` and awards it **k ≤ 1**. The resulting unit carries walls + the implicit *no professional garrison* + militia + one modifier field = **four facts**, the exact thing the brief forbids. The sole guard is arm A0's "the text claims every declared field and no other" (§8.4) — an arm whose hardest case is precisely an **implicit negative claim** ("citizen militia" means *no professionals*), and v1 nowhere says A0 can convict one.

**Fix.** Compute the budget from `tests`, not `reads` (`k ≤ 3 − |tests|`), and let a *declared* narrower `reads` buy budget only through an explicit, chair-ruled `NARROWS:` annex line naming the excluded field and the reason, with A0 planting an implicit-negation control (a spine text that discriminates on a field it does not name) as a convict-or-fail case in car 5.

---

## F3 — BREAKS · HIGH · the norm/occurrence denominator is a generator-stability fixture: 504 of 525 rows are one factorial at one threat value, 516 of 525 are one seed

**v1 claims** (§3.4, §13 row 14): "The sample is the golden master's 525-row corpus builder (`generatorGoldenMaster.test.js:802-847`) so tier, culture, terrain, route and threat all vary". The `rateBp` measured on it becomes `proseNorms.generated.js`, "an OWNER-FACING SEED INPUT from the day it ships" (§2.3) that orders salience on installed worlds (§13 row 6), and the occurrence floor is "≥ 27 of 525" (§6.1).

**What the builder actually is** (CITED, `generatorGoldenMaster.test.js:767-850`, and CONFIRMED by counting):

```
TIERS 6 × CULTURES 12 × TERRAINS 7 = 504 grid rows, every one at
  base = { monsterThreat: 'civilized', _seed: 'golden-master-v3' }
+ 23 one-dimension sweep rows (7 trade, 1 mountain-pass, 4 threat, 8 random_trade, 3 extra seeds), 2 deduped = 525
```

- **96.0 %** of the sample (504/525) holds `monsterThreat = 'civilized'`; `frontier` and `plagued` appear on **2 rows = 0.38 %**.
- **98.3 %** of the sample (516/525) carries the single seed `golden-master-v3`; only 9 rows carry another.
- Routes are an artefact of `TERRAIN_ROUTE` (`plains/hills/mountain/desert → road`), so 288 of 504 grid rows (**55 %**) are on a road, and the file states in its own comment that the weighted terrain roll is reachable only through the 8 `random_trade` rows — the grid **bypasses the product's own weighting by construction**.

**Consequences that are arithmetic, not taste.** (a) `country: pressed` — one of the three Phase-1 modifiers of the owner's own block (§6.3), 3 variants × 4 faces = 12 wordings — is exercised on **2 of 525** towns in car 6's taste run and car 1's manifest. (b) Every fact whose value is rolled from the seed rather than the config (scores, prosperity band, foodSecurity) has its `rateBp` measured at effectively **one seed**, so the norm leaf's variance is a fixture's variance. (c) A departure line and an occurrence floor computed on a *uniform factorial* answer "how many grid cells", never "how many towns a reader will meet".

**Fix.** Split the two jobs. Keep the 525 grid as the **manifest's** determinism sample (it is excellent at that — categorical branch coverage). Build a separate, seeded **RATE SAMPLE** for the norm leaf: N ≥ 2,000 settlements drawn through the product's own config roll (unpinned terrain, `random_trade`, the threat distribution the panel actually offers), stratified only where the product stratifies, with the seed varying per row. Print both denominators in the census, and make §13 row 6 name which one the norm leaf carries.

---

## F4 — BREAKS · HIGH · the 5 % occurrence floor is not resolvable at N = 525; it gates a permanent authoring act on a coin flip

**v1 claims** (§4.4, §6.1, §13 row 5): "a cell earns hand-written text (a turn) only at ≥ **5 %** of the sample (≥ 27 of 525)".

**Computed (CONFIRMED, `_crit-stats.mjs`).** Wilson 95 % interval at 27/525 = 5.14 % → **[3.56 %, 7.38 %]**. Probability a cell clears ≥ 27 of 525, by its true rate (normal approximation):

| true rate | 3.0 % | 3.5 % | 4.0 % | 4.5 % | **5.0 %** | 5.5 % | 6.0 % | 7.0 % |
|---|---|---|---|---|---|---|---|---|
| P(count ≥ 27) | 0.3 % | 2.7 % | 11.0 % | 27.3 % | **48.0 %** | 67.5 % | 82.1 % | 96.0 % |

A cell exactly at the floor is a **coin flip**; a cell truly at 4 % passes one time in nine; a cell truly at 6 % fails one time in five. There is no hysteresis rule, no re-measurement rule, and — per F3 — the binomial model overstates the precision, because 516 of the 525 rows share one seed and are therefore not independent draws of the seed-borne facts. C's own probe was worse still: 10/200 = 5.00 %, CI **[2.74 %, 8.96 %]**.

**Fix.** Gate on the **lower bound**, not the point estimate: a turn is authored when the Wilson 95 % lower bound of its rate is ≥ 5 % (≥ 40 of 525 at today's N, or ≥ 27 at N ≈ 1,200), and a turn is *retired* only when the upper bound falls below 5 % — a hysteresis band that stops a re-measure from churning authored text. Print N, the count, the interval and the power for every list row; declare the row NOT-EXECUTABLE (the §908 law v1 itself invokes at §3.5) where the interval straddles the floor.

---

## F5 — BREAKS · HIGH · §6.4 and §6.5's payoff figures use three connective forms where v1's own table gives ONE

**v1 claims.** §6.5: "Surfaces at that cell: 12 × (3 × 12) × (3 × 12) = **15,552**". §6.4: "spine 3 × 4 = 12 × opener 3 × modifier 12 = **432**". §7: "with one modifier and a joint: 1/432".

**v1's own connective table (§4.5) contradicts them.** The `addition` row's forms column reads: **"empty opener only"** — `c = 1`. And §6.5's second modifier `roll: falling` is declared `addition` (§6.5's table); §6.4's `stores: short` and `stores: import-fed` are both declared `addition` (§6.4). `contrast` likewise reads "empty opener; a fronted contrast is refused" — also `c = 1`.

**Corrected arithmetic** (the doc's own inputs):

| figure | v1 | corrected | why |
|---|---|---|---|
| DS-GEN-3 fully-loaded cell | 15,552 | **5,184** | 12 × (3 × 12)ᶜᵒⁿˢᵉᑫ × (**1** × 12)ᵃᵈᵈ |
| DS-DEF-2 `granary AND hospital, stores short` | 432 | **144** | 12 × **1** × 12 |
| §7's chance floor, one modifier | 1/432 | **1/144** for an addition modifier | same |

(§6.3's 288 uses `openers ≈ 3` for a `tension` modifier whose §4.5 list holds four — that one is a conservative hedge, and it is the only one of the four that is.)

**Fix.** Recompute every §6 surface figure and §7's chance floor from the ratified connective list lengths per relation × seat, and print the list lengths beside each figure. The headline that reaches the owner ("tens of thousands") rests on the largest of these numbers, and it is 3× too large.

---

## F6 — BREAKS · HIGH · the REPEAT CENSUS has no statistical power at N = 525 on exactly the composed cells it exists to police

**v1 claims** (§7): "The REPEAT CENSUS … distinct texts ÷ towns per state cell against the **CHANCE FLOOR** … A mount whose collision rate sits ABOVE the floor is a finding … a mount AT the floor is the owner's sentence made exact."

**Computed (CONFIRMED, `_crit-stats.mjs`)**, taking the estate's most populous composed cell — DS-GEN-3's `scores.military: WEAK`, 11 % of towns on C's 200-run → ≈ 58 towns of 525, 1,653 town-pairs:

| cell shape | surfaces | expected collisions in 1,653 pairs | Poisson sd |
|---|---|---|---|
| bare 3 × 4 spine | 12 | **137.8** | 11.7 |
| one addition modifier (c = 1) | 144 | 11.5 | 3.4 |
| one tension modifier (c = 3) | 432 | 3.8 | 2.0 |
| two modifiers (F5-corrected) | 5,184 | **0.32** | 0.56 |
| two modifiers (v1's figure) | 15,552 | **0.11** | 0.33 |

A test whose expectation under the null is 0.32 events cannot distinguish "at the floor" from "twice the floor"; on a typical cell (≈ 20 towns, 190 pairs) the expectation is 0.01. The measure is well-powered **only on bare spines** — that is, only where the design changes nothing. §7 presents it as the operational form of the owner's promise.

**Fix.** Keep the repeat census as a report on **bare-spine and one-modifier cells only**, with N, expected, observed and power printed per cell, and declare it NOT-EXECUTABLE below a stated pair count. Promote A's **DUPLICATE-UNIT RATE** (share of (position, text) pairs seen on more than one town, aggregated across cells — already in §7) to the owner-facing staleness statistic, because it pools every cell and therefore *is* measurable at 525; it is the number §14 should promise.

---

## F7 — BREAKS · HIGH · the two-edge-band authoring rule aims every modifier at the rarest values; on v1's own worked block, composition reaches ≤ 6.5 % of towns

**v1 claims** (§8.2): "MISSING held fact → a MODIFIER pool per notable value class (2–3 values → 1–2 pools; **a band of ≥ 4 → the two edge bands, never the middle**)", reinforced by the DEPARTURE signal, which rewards a candidate whose rate is ≤ 10 % (§4.3). Owner's want: "nothing will ever be stale" (`ARCH-BRIEF.md:7`).

**Measured on C's own 200-town output** (CONFIRMED, `_crit-occ.mjs`; the per-fact cells sum to exactly 200, so these are shares of towns):

| fact | edge bands | towns of 200 |
|---|---|---|
| `prosperity` (5 bands) | `Poverty / Impoverished` + `Wealthy / Thriving` | **0 + 0 = 0** |
| `foodSecurity.label` (6) | `Surplus` + `Deficit × Active Famine` | **0 + 3 = 1.5 %** |
| `scores.internal` (4) | `STRONG` + `CRITICAL` | 0 + 32 = 16 % |
| `defenseProfile.readiness.label` (6) | `Fortress` + `Undefended` | 18 + 17 = **17.5 %** |

Four of DS-GEN-3's 42 pools never fired at all on that run (`scores.internal: STRONG`, both prosperity edge bands, `foodSecurity.label: Surplus`) — the rule points authors at three of them.

**Carried into §6.4's worked block.** Its two modifiers read `foodSecurity.label`: `stores: short` = {Deficit 3, Famine 3} = **3.0 %** of towns; `stores: import-fed` = {Import-Dependent 7} = **3.5 %**. Union **6.5 %**, and only on the 3 of 5 disaster cells the attach set covers. So DS-DEF-2's whole composition programme — 6 new semantic pieces, 24 wordings, a census row, two licence cards, an echo refusal and a sitting — changes what **≤ 6.5 %** of towns read, while the other 93.5 % read the block exactly as today (multiplied by the four faces, which cost no composition at all).

**This separates the two halves of the design and v1 never does.** The FACES buy a uniform 4× on 699 of 708 pools for every town; COMPOSITION buys specificity on a rare tail. §6.6's "surfaced readings per block go from hundreds to tens of thousands" is the faces' work at the block level and the composition's work at one rare cell.

**Fix.** State the split explicitly in §6.6 and §14: faces = the staleness cure, measured as the duplicate-unit rate over every town; modifiers = the specificity cure, measured as ATTACH COVERAGE × predicate rate, i.e. the share of (town, mount) reads that carry ≥ 1 modifier. Make that share a car-0 printed number and a car-9 acceptance. And amend §8.2: for a band of ≥ 4, author the **two most populous** classes plus one edge, not the two edges, unless the departure signal is deliberately the point — the current rule optimises the corpus for the towns fewest readers will see.

---

## F8 — STRAINS · MEDIUM · the fact budget is anti-monotone in specificity: the most specific shipped cells are the ones that can never gain a fact

**v1 says** (§6.4): "The rule bites exactly where the cell was hand-cut as a three-fact conjunction, and nowhere else."

That is stated as a virtue (retiring the hand-cut shape). Its reader-facing consequence is the inverse of the owner's want. Under `k ≤ 3 − |reads|` and §2.8's rule that the conjunction-keyed pools "stay SPINES … are never GROWN", **7 of DS-DEF-2's 26 shipped pools are k = 0 forever** (§6.4's own table: invasion `walls with NO force`, `militia only`, `neither walls nor force`; beasts' two three-clause cells; disasters `granary AND parish care only`, `granary, NO medical provision`) — 26.9 % of the block (26 pools CONFIRMED, `_crit-pools.mjs`). A town whose walls stand with no force behind them — the most interesting invasion state on the tab — reads 3 variants × 4 faces = 12 surfaces forever and never learns a fourth thing. A town with a granary and a garrison gets a modifier. **The more the engine already knows about a town's primary state, the less it may add.**

**Fix.** Say it out loud in §6.4 and §13 row 5 as a named consequence of the ≤ 3 number the owner is asked to veto, with the estate-wide count of k = 0 pools printed by car 0; and offer the owner the alternative form — a budget on *sentences* and *clauses* (≤ 2 sentences, ≤ 1 joint, already binding) with no separate fact cap, letting a three-fact spine take one modifier and reach four facts across two sentences, which is what his own five-fact example asks for.

---

## F9 — STRAINS · MEDIUM · owner row 2's stated ground is an artefact of one memory layout; an interleaved flatten preserves the semantic variant on 100 %

**v1 claims** (§2.6, §13 row 2): "the flatten preserves the semantic variant on **45.21 %** and the two-level roll on 100.00 % … Veto returns the flatten and **forfeits the wording-only proof**."

**The 45.21 % is a property of the flatten's layout, not of flattening** (CONFIRMED, `_crit-flat.mjs`, the same 141,600 reads over the same 708 shipped pools). `draw-reroll.mjs:26` measures a **grouped** layout, `Math.floor(draw(key, L*4)/4)` — faces of variant *i* at 4i..4i+3. Under an **interleaved** layout (index *j* → variant `j % L`, face `⌊j/L⌋`), because `4L ≡ 0 (mod L)`:

```
GROUPED     flatten: semantic preserved  45.21 %
INTERLEAVED flatten: semantic preserved 100.00 %
            faces:   25.11 / 25.18 / 24.93 / 24.78 %   (one hash, uniform)
```

So the brief's flatten *can* be wording-only and uniform with a single hash. The two-level roll is still the right ruling — but for the reason v1 gives **elsewhere** (§2.2: nested wordings make eligibility identity structural; four flat siblings could drop out per town and turn one-in-four into one-in-three). Owner row 2 currently asks the owner to sign a number that measures a scratch script's array order.

**Fix.** Replace owner row 2's stated ground with the eligibility-identity argument, and record the 45.21 % as what it is — a grouped-layout artefact — with the 100.00 % interleaved figure printed beside it so no later reader re-derives the wrong reason.

---

## F10 — STRAINS · MEDIUM · the connectives leaf declares eight relation × seat lists; four are unreachable and two hold exactly one phrase, so owner row 5's acceptance is unsatisfiable

**v1 declares** (§2.3): `dossierConnectives.generated.js {relation: {clause: string[], sentence: string[]}}` — 4 relations × 2 seats = **8 lists**, "+ DEFAULT (the totality floor)". **v1 binds seats to relations** (§4.4): "the CLAUSE seat ← `consequence` ONLY … the SENTENCE seat ← `tension`, `contrast`, `addition`", and `form` is "BOUND to relation — consequence ⇒ fragment; the rest ⇒ sentence" (§2.3). **Owner row 5** asks the owner to veto "**≥ 3 phrases per relation per seat**".

**Arithmetic.** Reachable lists: `consequence.clause`, `tension.sentence`, `contrast.sentence`, `addition.sentence` = **4 of 8**. Of those, §4.5 gives `contrast` "empty opener; a fronted contrast is refused" and `addition` "empty opener only" — **1 phrase each**. So the acceptance number the owner signs (8 lists × 3 = 24 phrases) is satisfiable on **2 lists**, and the leaf's real content is `consequence.clause` (3 forms) + `tension.sentence` (4 forms) = **7 phrases**. A totality floor asserted over four lists that no draw can reach is a green that proves nothing.

**Fix.** Shape the leaf on the reachable pairs only (`{consequence: {clause: []}, tension: {sentence: []}, contrast: {sentence: []}, addition: {sentence: []}}`), restate owner row 5 as "≥ 3 phrases on `consequence.clause` and `tension.sentence`; exactly one (the empty opener) on `contrast` and `addition`", and let the totality arm assert those four lists and refuse a fifth key.

---

## F11 — STRAINS · MEDIUM · the census's co-occurrence axis is unbounded, and §6.6's ≈ 40 turns / ≈ 150 modifier pools are derived from neither the census nor the design's own ceilings

**v1 specifies** (§3.1): `fact = { …, combos: [{with, pools, rateBp}] }` — "fact-pair co-occurrence by execution"; and (§3.2) "MISSING = a held fact or **a co-firing pair at or above the occurrence floor** with no pool"; and (§8.2) each MISSING pair "→ the two MODIFIERS first, a TURN only with a registry id"; and (§6.6) "turns at the floor ≈ 40 × 3 = 120 … ≈ 3 modifier pools × 3 variants on each of ≈ 50 blocks ≈ 450".

**Cell counts.**
- `(block, pool)` rows: **708**, finite and pinned as an integer (§3.4). Sound.
- `fact` rows: **72** (`read-facts §2`). Finite.
- `combos` at **fact grain**: `C(72,2) = 2,556`. Finite.
- `combos` at **value-class grain** — which is the grain the MISSING tier needs, since a modifier is keyed on a value class: DS-GEN-3 holds **42 classes over 10 facts** (CONFIRMED, `_crit-gen3.mjs`) = 4.2 per fact; extrapolated over 72 facts ≈ 300 classes ⇒ ≈ **45,000 pair cells** (ESTIMATE). Each town contributes `C(72,2) = 2,556` co-firing pairs, so 525 towns yield **1,341,900 pair-observations** over those cells — a mean of ≈ 30 per cell, i.e. the *mean* value-pair cell sits at ≈ **5.7 %**, above the 5 % floor. The MISSING list is therefore bounded by nothing in the document; §8.2 gives it a sort order ("by `rateBp` × departure") but **no cut**.

**What actually caps the work** is elsewhere and unreconciled: the TURN_KEY_REGISTRY (§5.3 tiers 1a/1b AVAILABLE: 46 condition archetypes × up to 4 severity bands + 2 corruption ids ≈ **186 ids**) and the echo bound (§4.6 (ii)/(iii): one fact backs a modifier at ≤ 3 mounts per page-set; §8.2 gives ≤ 2 pools per fact per site ⇒ **72 × 2 × 3 = 432 modifier pools** ceiling). §6.6's ≈ 40 turns is **4.6× below** the registry ceiling and its ≈ 150 modifier pools **2.9× below** the echo ceiling; neither is derived from either.

**Fix.** Give the list an explicit CUT rule ("take MISSING rows in sorted order until the echo ceiling for the fact is exhausted; the remainder prints as `BELOW-CUT` with its rate"), state the two ceilings (186 registry ids, 432 modifier pools) in §6.6 as the design's actual upper bound, and make car 0's acceptance print the MISSING row count at both grains so the wave is sized on a measured number rather than "≈".

---

## F12 — STRAINS · MEDIUM · the owner's five-fact walls example yields three facts in both phases; two of the five have no route to the reader at all

**v1 closes §0** with "the owner's own sentence, three facts, two sentences, one joint" and tells the owner in §14 that "a fourth waits for its own place on the page".

**Walk the owner's five facts** (`ARCH-BRIEF.md:5`) through v1's own bounds:

| owner's fact | Phase 1 (car 8) | Phase 2 (car 10, owner-gated) |
|---|---|---|
| walls stand | spine | spine |
| garrison underpaid (`economicGates.military`) | spine's 2nd read | clause seat (`muster: short`) |
| guard alignment evil/neutral/good | **no field exists** (§13 row 11) — never | never |
| members compromised | 1 modifier, sentence seat | sentence seat (`watch: bought`) |
| granaries lacking | **echo-refused on this block** (§6.3 table) | echo-refused |

Three of five in both phases. The fourth's "own place" is DS-DEF-2's disaster row, reachable only if that town's disaster spine is one of the **3 of 5** cells in the attach set (§6.4) — and both remaining cells are k = 0 (F8), so for those towns the stores fact has no home on the defense tab at all. The fifth has no home anywhere by design. Separately, both remaining Phase-2 candidates (`country: pressed`, `watch: bought`) are `tension` ⇒ **sentence seat**, and there is exactly **one** sentence seat, so the third fact crowds out the fourth structurally, not for want of authoring.

**Fix.** Put the table above into §6.3 verbatim and into §14 in plain words ("your wall sentence will say three of the five things; the granary is said elsewhere on the tab when the town's disaster row allows it; the guards' character is not a thing the engine holds"), so the owner's veto on the ≤ 3 number (row 5) and on the alignment field (row 11) is taken against the delivered reading, not against the mechanism.

---

## F13 — STRAINS · LOW · §6.6's per-piece byte price is 69 % above the estate's own measured mean; the 2.3 MB total is right at the ceiling and wrong at the budget

**v1 claims** (§10): "≈ 770 new pieces × 4 faces ≈ **630 KB**" inside "≈ 2.3 MB raw for the state register".

**Measured** (CONFIRMED, `_crit-pools.mjs`): the six shipped leaves hold **280,581 B of variant text over 2,266 variants = 123.8 B per sentence**. v1's own 3× line uses that figure correctly ("3 × 280,577 B ≈ 842 KB"), then prices the *new* pieces at `630 × 1024 / 3,080 =` **209.5 B** per sentence — 69 % above the estate's mean, with no stated reason.

At the estate's mean, 3,080 new wordings = **372 KB**, not 630 KB. The 630 KB figure happens to be almost exactly right for a different quantity — the design's own **ceiling** of 432 modifier pools × 3 variants × 4 faces = 5,184 wordings × 123.8 B = **627 KB** (CONFIRMED). Two errors (a piece count ~3× low per F11, a byte price ~1.7× high) partly cancel, so 2.3 MB survives for the wrong reason and does **not** bracket the ceiling's turns, second grammars, or the `poolMeta` for 432 new pools (≈ 56 KB).

**Fix.** Price new text at the measured 123.8 B and state the total twice — at the budget (≈ 2.05 MB) and at the design's own ceiling (≈ 2.5 MB) — so §13 row 16's first-paint/lazy-chunk ceiling is signed against the worst case the bounds permit, not the median case the estimate assumes.

---

## F14 — STRAINS · MEDIUM · the DEPARTURE line is calibrated on a distribution of the wrong kind, and the relation table's lookup grain for multi-field spines is unspecified

**(a) The departure line.** v1 sets it at "≤ 10 %" against C's distribution: "14 of 56 general-desk cells at ≤ 10 %, 9 at ≤ 5 %, 28 at ≤ 25 %" (§4.3; all four counts re-verified CONFIRMED, `_crit-occ.mjs`: 9 at ≤ 5 %, 14 at ≤ 10 %, 47 at ≥ 5 %). But those 56 cells are **spine pool keys**, and my run shows each fact's cells sum to exactly 200 — they are a **partition** of the town space, whose mean rate is mechanically `1/|V| ≈ 24 %`. A modifier predicate partitions nothing; it is an independent boolean that may fire at 50 %. Calibrating a rarity line for non-partitioning predicates on the quantiles of a partition is a category error, and it is the line that decides which fact a reader sees first on every town, forever (§13 row 6 makes it a seed input).

**(b) The relation table's grain.** §4.5 licenses a joint by "a RELATION TABLE row … between **the spine's field** and the modifier's" — singular. But 18 key functions read two facts, 8 read three and 1 reads four (`read-facts §5.1`), so a spine routinely has 2–4 fields. v1 never says whether arm A2 requires a row for **every** spine field × the modifier's (which multiplies the hand-ratified source-(d) rows by |reads|) or **any one** (which lets an incidental pair license a tension the spine's primary fact does not support). Related: source (d) rows are hand-ratified at a **single** sitting (car 7, §12), while cars 9 and 11 author modifiers and turns block by block — with **no recurring ratification door**, a wave that discovers a new tension pair has nowhere to take it.

**Fix.** (a) Re-derive the departure line from the **modifier candidates' own** measured firing rates on the new rate sample (F3), not from spine-key partition quantiles, and hold it as REPORT until those rates exist. (b) Specify A2 as "a row for the spine's **primary** field (the first entry of `reads`) × the modifier's field, and no other field may be the licence", and add a standing source-(d) ratification door to cars 9 and 11's acceptance.

---

## What HOLDS (checked, not assumed)

- **§0's 288 and §6.3's 288** are arithmetically sound on their stated inputs (2 spine variants CONFIRMED for `WALLED-STRAINED`; 2 × 4 × 3 × 4 × 3 = 288), and §6.3's cell counts (14 DM / 11 player, from 5) recompute exactly.
- **§6.4's piece counts** recompute (78 + 6 = 84; 84 × 4 = 336) and its `5 → 11` disaster-row cell count is right under its own exclusivity and k ≤ 1 assumptions.
- **§6.5's authored figure** (128 + 6 = 134; × 4 = 536) recomputes, and `3¹⁰ = 59,049` is right.
- **§2.6's face arithmetic**: 2,266 × 4 = 9,064; "face differs from face 0 on ≈ 75 %" is exact for a uniform 4-face die; the measured 25.05 % face-0 share reproduces (25.11 % on my re-run).
- **C's 200-town figures as quoted by v1** (56 cells · 9 below ten towns · 4 on every town · 2 on one town · 14 at ≤ 10 % · 47 at ≥ 5 %) all reproduce exactly (CONFIRMED, `_crit-occ.mjs`). The quotation is accurate; F3/F4/F7/F14 attack the *use*, never the citation.
- **The corpus census** (708 pools / 2,266 variants / mean 3.20) and the three worked blocks' pool counts reproduce exactly.
