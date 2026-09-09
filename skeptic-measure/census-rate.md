# SKEPTIC FOLD — LENS: THE CENSUS COLUMNS AND THE RATE CORPUS (cars 0, 0c, 0e, 0f)

Seat: Opus 5 — Fable-unvalidated (the verifier). Pinned dock `$SC/skepMEASURE` @ `fcd98a3db`.
`git status --porcelain | wc -l` — BEFORE **0**, AFTER **0**.
Every figure below is from a command I ran in that dock and whose output I saw.

---

## 0. WHAT REPRODUCED EXACTLY (no correction owed)

`node scripts/wiring-census.mjs --print` and `node scripts/prose-rate-corpus.mjs --out …`
(28 s, re-run) return, byte for byte, the receipt's tip figures:

708 / 68 / 2266 · RESOLVED 318 · UNRESOLVED 390 · predicate 185 · clean 185 · 118 key
functions · 29 tables · MISSING 34 · THIN 483 · COVERED 225 · MISSING-AT-TIER 44 ·
branch grain 287 / function 421 · read paths 529 | 757 · k = 0 **49 | 121** · cannot-attach
**22 | 26** · absent 377 / 10 / 64 · covert 4 · objectClass 99 · mounted 566 ·
customReachable 21 over 8 kinds · relations 165 = 131 + 28 + 6, all `a->b`, source (d) 0 ·
JOIN strict 0 · tier marginals 128 × 6 · fired 267 · silences 347 = 303 + 44 ·
departure 70 / 197 · pairs 729 / 590 / 226 / 170 / 503 · alias draft 37 / 15 / 74 / 4.

The **Wilson arithmetic is exact**: I recomputed the interval by hand on four pairs
(768, 763, 501, 51 towns) — `[9950,10000] [9849,9972] [6180,6852] [509,863]` bp, identical —
and re-derived the bound independently: `wilson(50,768).lo = 0.049730`, `wilson(51,768).lo =
0.050866`, so **≥ 51 of 768** is right.
**Pairs are counted per TOWN** (`coOccurringPairs` builds a `Set` of facts per town, then
unordered pairs), and `rateTable` de-duplicates per town the same way. `minTowns: 1`, so 729
is the true distinct-pair count, not a count at a floor.
**The departure bit derives from the pool's OWN rate** — `table.rows.filter(r => r.rateBp < 1000)`.
**`--check` drives both limbs**: I planted a zeroed composer sha (distinct "stamp is stale"
refusal, exit 1), `totals.pools = 707`, a single row column, and a whitespace-only
re-serialisation — each refused with "is stale; run …". Restored `cmp`-identical, md5
`bc6a6959acd2761b5e9e734082815ec8`.
**Ten predicate rows re-derived by hand** from the key-function source: `wallRationalePoolKey`
(all five rows, STRAINED = {walls, gate} exactly), `navalDefensePoolKey` (the `!navy && !port`
path guard is correctly carried), `internalRowPoolKey`, `forceCorePoolKey`, `charterPoolKey`,
`foodSecurityPoolKey`, `granaryPoolKey`, `tradeFlowPoolKey`, `exportPosturePoolKey`,
`shadowEconomyPoolKey`, `viabilityUnderStressPoolKey` — **all match the shipped `reads`**.
All 185 predicate rows carry `readsGrain: 'branch'` (0 exceptions).
**0e.5's refusal ground is exact**: `MONSTER_FAMILY_OF` maps `heartland -> 'settled'`
(defenseStateProse.js:216-221), so the value hop would be false. DS-DEF-2 is 26 pools,
4 RESOLVED, ONE key function, ONE read set `["court","prison"]`, to the row.
**All seven lane plants still red at the tip** (baseline 52 passed): #86 → 2, #87 → 3,
#88 → 4, #89 → 10, #90 → 9, #91 → 1, #92 → 2; each restored `cmp`-identical, porcelain 0.

---

## 1. ⛔⛔ HIGH — THE RATE CORPUS DOES NOT CALL THE ECONOMY DESK BY ITS SHIPPED RECIPE, AND THREE OF THE FIVE HEADLINE RATE FIGURES MOVE

`scripts/prose-rate-corpus.mjs:206` calls `economyDeskRead(s, opts)` with `opts = {seed,
audience}`. `economyDeskRead` takes its readings from **`options.foodBalance`,
`options.granaryOutlook`, `options.flowDrift`, `options.impairedInstitution`** and defaults
each to `null` (economyDeskRead.js:104-110). The shipped caller, `EconomicsTab.jsx:323`,
passes `foodBalance: fbal, granaryOutlook: granary, flowDrift`; `ServicesTab.jsx:100` passes
`impairedInstitution`. The corpus passes **none of them**.

`deriveFoodBalance(s)` is a pure read of the settlement and the tab always calls it. Measured
over the corpus's own 768 towns: **`available` is true on 768 of 768**. So DS-ECO-2's three
FOOD pools can never fire in this corpus, and one of them is among the most common pools in
the estate.

```
$ node $SC/skeptic-measure/probe-econ.mjs
towns 768 | deriveFoodBalance.available 768 | deriveGranaryOutlook.available 0
pools firing ONLY when the tab readings are passed: 3
    DS-ECO-2 :: FOOD: balanced = 11 towns = 143 bp
    DS-ECO-2 :: FOOD: deficit  = 735 towns = 9570 bp
    DS-ECO-2 :: FOOD: surplus  = 22 towns = 286 bp
```

Re-running the whole corpus with only that one reading restored (`probe-full-recipe.mjs`,
same grid, same seeds, shipped `rateTable` / `tierSilences` / `coOccurringPairs`):

| figure | shipped receipt | with the tab reading | who reads it |
|---|---|---|---|
| pools that fired | **267** of 708 | **270** | F2, walker `rate.rows.length` |
| departure bits at 10 % | **70** / 197 | **72** / 198 | SITTING **§O.4** (the line the chair SET) |
| per-tier silences | **347** (303 / 44) | **351** (307 / 44) | SITTING **§O.5** (the wave's per-tier table) |
| pairs / clearing / usable / usable-clearing | 729 / 590 / 226 / 170 | 729 / 590 / 226 / 170 | §O.3 — **unmoved** |

The census carries `rateBp: null` on eleven pools for this reason class; four of the eleven
(DS-ECO-2's GRANARY ladder) are LAWFUL (`deriveGranaryOutlook.available` is 0 on all 768),
`tradeFlow` is LAWFUL (no campaign worldState ⇒ the tab yields null too), DS-ECO-9's two are
LAWFUL (no blockade on the corpus). **The three FOOD rows are not lawful.**
`impairedInstitution` is a fourth omitted caller reading (ServicesTab derives it); its effect
is UNTESTED here.

The script's own docblock (`prose-rate-corpus.mjs:35-40`) claims the composers are called
"Through the SHIPPED desk-read recipes, never with `{}` readings — the taste sample's own
hazard". For the economy desk that claim is false in the direction the hazard names.

**Cure:** thread `foodBalance: deriveFoodBalance(s)` (and `granaryOutlook`) into
`deskReturns`, re-run, re-commit the rate half, and re-state §O.4's ground at 72 of 270.

---

## 2. ⛔ HIGH — NO GATE CAN REFUTE ANY RATE FIGURE: `--check` AND THE WALKER BOTH READ THE COMMITTED RATE HALF

`scripts/wiring-census.mjs:1065` — `if (!rates && committed) rates = JSON.parse(committed).rate;`
— so `--check` re-injects the committed rate half before comparing. The walker does the same:
`tests/lint/proseWiringCensus.walker.test.js:683` builds `committed` as
`buildCensus({ rates: JSON.parse(readFileSync(CENSUS_JSON)).rate })`, then asserts
`267` (:1241), `347` (:1247), `303` (:1281), `729` (:1335), `226` (:1341), `170` (:1342) and
the departure report (:1344-1346) **against the very data those integers came from**.

The census half is genuinely re-derived (a real defence — every plant on `wiringCensus.js`
reds the byte-identity arm). The RATE half is self-certifying. Finding 1 is exactly the class
this hides: a wrong corpus run commits, `--check` is green, the walker is green, and the
chair's §O.3 / §O.4 numbers rest on it. The blindness IS declared in the script's docblock
(:20-25) — it is **not** declared in `receipt-measure.md`, whose §7 lists the RATE arms among
the walker's new convictions without saying they cannot fail.

---

## 3. ⛔ MEDIUM-HIGH — CAR 0e BROKE A STANDING MUTATION PLANT AND NOBODY MEASURED IT

`scripts/mutation-sweep.sh:1117` (plant **#80**, INSTR-912's anti-vacuity strike on the
census's UNRESOLVED fallthrough) is a `perl -0` anchor requiring
`predicate: [],\n    fieldsRead: [],\n    status: WIRING_STATUS.UNRESOLVED,`.
Car 0e inserted `branchReads: [],` between those lines (`wiringCensus.js:699-702`).

Executed, verbatim from the committed sweep line, on a copy: **md5 unchanged — the plant
mutates nothing**, and the walker then reports `Tests 52 passed (52)`. I ran all nine sweep
lines that target this lane's four files: eight mutate, **one is a no-op**.

The sweep's own `check_caught` guard (:149-152) does catch this as `BROKEN GAP (mutation did
not apply — stale anchor?)`, so it is a RED rather than a false green — but it is a red the
lane shipped and the receipt does not mention. The receipt's §13 quotes car 11's lesson and
proves it for **its own** plants (#86-#88, #89-#92, each anchor once); the pre-existing plant
on the same file it re-shaped went unchecked.

---

## 4. ⛔ MEDIUM — THE `not-produced` LIMB IS BLIND TO ES6 SHORTHAND WRITES; F5's "A REAL MEASUREMENT, NOT A BLIND INDEX" IS PARTLY WRONG

`producerIndex()` (`scripts/wiring-census.mjs:104-105`) matches only `key:` and `.key =`.
It cannot see a shorthand object property. Three of the 24 distinct `not-produced` paths are
written that way, so **6 of the 64 `not-produced` cells carry a wrong verdict**:

```
src/generators/safetyProfile.js:684        blackMarketCapture,
src/domain/worldPulse/foodStockpile.js:418 blockadeBypass,
src/generators/narrativeGenerator.js:1113  prominentRelationship,
```

The estate already knows this shape: `src/domain/fieldManifest.js:373` carries
`producerProbe: '(?<![.\\w])blockadeBypass\\s*,'` — *the shorthand property write* — for the
same field the census now calls not-produced.

Separately, **30 of the 64 cells are on a bare key-function parameter** (`prison`, `forces`,
`navy`, `magicWorks`, `structureKey`, `namedChain`, `eco`, `hist`, `warBeat`, `anyTreaty`,
`faithHidden`, `hasPatron`) — a leaf no writer would ever spell as a key, so the verdict is
guaranteed by construction rather than measured. One more (`eco.incomeSources.reduce`) is a
JS array method, not a field at all. F5's grep evidence for `prison` / `forces` / `navy`
reproduces (0 hits each), but it is evidence about parameter names.

---

## 5. ⛔ MEDIUM — THE `default` COLUMN, WHICH THE CENSUS CALLS "THE FINDING CLASS", IS 7 FALSE POSITIVES OUT OF 10

`absenceOf` (`wiringCensus.js:1258`) tests `\b<chain>\b\s*(?:\|\||\?\?)`. That regex cannot
tell `x || <fallback>` from `!x || typeof x !== 'object'` — a guard that REFUSES, which is the
opposite of a default wearing a reading's clothes. The three `default` paths at the tip:

| path | rows | the read site | verdict |
|---|---|---|---|
| `doc.termLines` | 3 | `warFaithStateProse.js:437` `const lives = (doc.termLines \|\| [])` | **correct** |
| `readings.inst` | 5 | `generalStateProse.js:1178` `if (!inst \|\| typeof inst !== 'object') return null;` | **wrong** |
| `link` | 2 | `generalStateProse.js:1483` `if (!link \|\| typeof link !== 'object') return null;` | **wrong** |

So `default 10` is `default 3`. The column also cannot see caller-side defaults: the four
`options.x ?? null` fallbacks in `economyDeskRead.js:104-110` are real defaults the census
never inspects, because `absenceOf` reads the KEY FUNCTION body only.

---

## 6. ⛔ MEDIUM — `objectClass` IS INFERRED FROM THE POOL KEY'S ENGLISH, AND 12 OF THE 99 SILENTLY FIRST-WIN

`objectClassOf(poolKey)` (`wiringCensus.js:1215-1221`) tokenises the **pool key string** and
returns the FIRST class of the frozen list whose token appears. The list is genuinely closed
by an assertion (`Object.keys(CIVIC_OBJECT_CLASSES).length === 10`, walker :874) — that limb
holds. But the class is a reading of authored English, which is the label trap the estate's
own `tradeFlowPoolKey` docblock forbids ("KEYED ON THE PRODUCER'S OWN BAND TOKEN, never on its
`label` … the display word and not the datum").

Measured: **12 of the 99 classed keys match more than one class**, and the object-literal
order silently decides:

```
DS-DEF-2 :: Disasters & Famine: granary AND hospital     -> store/care   chosen=store
DS-DEF-6 :: Medical Readiness: Clergy care               -> temple/care  chosen=temple
DS-DEF-6 :: Logistics & Supply: Granary + port           -> store/road   chosen=store
DS-SUP-1 :: ENTREPÔT PASS-THROUGH (no workshop …)        -> road/craft   chosen=road
DS-GEN-5 :: market (route crossroads)                    -> market/road  chosen=market
… 12 in all
```

T-F12 exists to refuse an attach whose spine and modifier name the SAME civic object. On
"granary AND hospital" the census answers `store`, so a `care` modifier about the hospital
would be admitted beside a spine that already names it — the restatement the rule forbids.
The walker's own arm (:872) pins one of these twelve as `store` without noting the ambiguity.
**Consequence for the wave:** every pool key the authoring wave rewrites can move its class,
and no gate would say so.

---

## 7. ⛔ MEDIUM — `covert` RESTS ENTIRELY ON ONE BARE PARAMETER; THE PUBLISHED COVERT-SOURCE LIST MATCHES NOTHING

All four covert rows are DS-WAR-1's mobilization ladder, and the **only** covert read path in
the whole census is the bare token `covert`:

```
distinct covert read paths: covert
```

`isCovertPath` has two limbs: the six-entry `COVERT_SOURCES` list, and
`chain.split('.').includes('covert')`. **Zero rows match the list** — not
`compromisedSecurityInstitutions`, not `npc.corrupt`, not `blocs.covert`. The frozen constant
the receipt calls "published as a frozen constant" is inert on the shipped corpus; the walker
exercises it only on synthetic strings (:862-864). Refusal 3 records the column as a floor
for the OVER-marking reason; the UNDER-marking side (a covert reading spelled any other way is
missed, fail-open) is not recorded. Car 1's paired-town arm is vacuous for the same reason.

---

## 8. ⛔ MEDIUM — 21 OF THE 226 "USABLE" PAIRS ARE A JS ARRAY METHOD, AND 19 OF THEM CLEAR THE CHAIR'S FLOOR

`pairMemberClass` (`prose-rate-corpus.mjs:445-448`) calls anything containing a `.` a `fact`.
`eco.incomeSources.reduce` is `Array.prototype.reduce`, not a reading of the world.

```
USABLE pairs whose member ends in a JS METHOD name: 21 of 226
  the offending members: eco.incomeSources.reduce
  of those pairs, clearing the bound: 19
```

Four of the receipt's own printed "twenty most frequent USABLE pairs" carry it. SITTING §O.3
sets the co-occurrence floor **over the usable pairs only (226 / 170 clearing)** — so **19 of
the 170 licensed pairs (11 %) are on a method call**, and one of the wave's most frequent
"facts" is `.reduce`. The docblock names two bookkeeping shapes it excludes; this is a third
it does not.

**Receipt arithmetic correction (LOW):** "503 (a table-rung synthetic label on 437, an
unrooted bare parameter on 108)" reads as a partition and is not one — 437 + 108 = 545, and
the two sets overlap on 42 pairs (437 ∪ 108 = 503). Both integers are right; the "on … on …"
phrasing is wrong.

---

## 9. ⛔ MEDIUM — 7 OF THE 44 `MISSING-AT-TIER` ROWS SIT ON A RUNG THAT CANNOT EVER BE LAWFUL

The LAWFUL limb requires "some OTHER pool of the SAME RUNG fired at that tier". Measured
against the census's own pools-per-rung:

```
single-pool rung: DS-DEF-5 :: contractedForcePoolKey | thorp hamlet village town | splitLadder false
single-pool rung: DS-POW-6 :: operationRolePoolKey   | thorp hamlet village      | splitLadder false
single-pool rung: DS-GEN-6 :: originTierPoolKey      | 4 tiers                   | splitLadder TRUE (already declared)
```

For a rung the census knows exactly one pool for, the LAWFUL limb is structurally unreachable,
so every tier where that pool is quiet is automatically `rung-dark`. `contractedForcePoolKey`'s
own docblock says why it is single-pool by design — *"The corpus wrote no 'hires nobody' pool,
and inventing silence-as-absence prose here would be the desk improvising past its own
corpus"* — which makes its silence at thorp/hamlet/village/town a value-class silence in
substance, i.e. LAWFUL. **7 of the 44 rows the AUTHORING WAVE inherits (§O.5) are not wave
work.** The receipt declares the 123 block-grain rows and the 12 split-ladder rows; it does
not declare this third coarseness.

Related and already declared: 108 of the 303 LAWFUL rows rest on the BLOCK grain, and 14 of
those sit on a block carrying more than one key function, where "the same ladder ran there"
is provably not what was measured.

---

## 10. ⛔ MEDIUM — `customReachable` IS 21 HITS OVER **9** POOLS, AND 19 OF THE 21 ARE STRING COLLISIONS

```
customReachable hit rows 21 by via { value: 19, bucket: 2 }
distinct (block,pool) pairs 9
matched tokens {"none":4,"moderate":2,"metropolis":3,"city":3,"thorp":3,"critical":4,"factions":2}
```

Every row is counted once **per kind**, so the census line "customReachable rows 21 over 8
kinds" (car 0: 22) is a hit count, not a pool count — the in-house pools that reach a custom
definition number **nine**. Nineteen of the twenty-one come from the `value` limb, matching on
`metropolis` / `city` / `thorp` (tier names, because a custom kind's `tierMin`/`tierMax`
enumerate them) and `critical` / `moderate` / `none`. A pool keyed on `settlement.tier ===
'metropolis'` does not read a fact a custom institution carries; it shares a word with that
kind's tier enum. The two `bucket` hits are on `factions`, a kind with **zero** mechanical
fields.

§O.6's DIRECTION survives — the true reach is smaller, not larger — but the number the ruling
quotes is not a count of reachable pools.

---

## 11. ⛔ MEDIUM — THE ALIAS DRAFT'S `generator-write` LIMB MATCHES COMMENTS AND PROSE STRINGS, AND ALL FOUR "WOULD JOIN" ROWS REST ON IT

I opened all nine cited lines. Five of the nine are not writes of world state:

| row | cited line | what is actually there |
|---|---|---|
| `cause:underfunded -> forces` | structuralValidator.js:588 | inside a `reason:` PROSE STRING |
| `condition:famine -> row` | defenseGenerator.js:608 | a **COMMENT** line |
| `condition:siege -> name` | narrativeText.js:53 | inside a template STRING |
| `condition:famine -> name` | stressNarrative.js:80 | `famine: (name) =>` — a key of a PROSE-TEMPLATE table, root = the arrow's param |
| `signal:occupied -> name` | stressNarrative.js:83 | same shape |

Four are sound (`historyEventStrands.js:42`, `factionLeaderSecret.js:56`, `npcGenerator.js:169`,
`defenseGenerator.js:552`). The receipt's own rule reads "a generator that WRITES the leaf as a
key or an assignment, on a line NAMING the root" — technically satisfied, semantically empty.

**The four rows printed as "RELATION ROWS THAT WOULD JOIN" all depend on one of these five or
on a docblock**; not one of them uses two `identifier`-grade aliases. 0f.2's disclosure ("THE
THREE IDENTIFIER ROWS ARE THE DRAFT'S WHOLE STRENGTH") is honest as far as it goes and does not
say that the strength and the four joins are disjoint. 0f.4 replaced a first cut *because* "a
draft that overstates its ground is worse than a thin one"; the second cut still does, by less.

---

## 12. ⛔ LOW — `sites` IS THE ONE NEW COLUMN WITH NEITHER A PLANT NOR A FIXTURE ARM

`grep -c "566\|mountedRows" tests/lint/proseWiringCensus.walker.test.js` → **0**. The census
prints "rows with a mount 566" and the JSON carries `totals.mountedRows`; no arm asserts it and
no plant strikes it. It is covered only by the blunt "byte-identical to a fresh build" arm,
which is a change-detector and not a statement about the column. The brief's car-0 item 4 asks
for "every new column convicted by a plant or a fixture that MUST fire".

## 13. ⛔ LOW — TWO CAR-0 PRINTED TABLES ARE STALE AND 0e.2's "WHAT MOVED" LIST OMITS THEM

0e.2 lists the figures the branch grain moved. Two printed tables also moved and are not in it:
the ATTACH-COVERAGE per-block `facts` and `meanReach` columns (`DS-STR-2` 3 → **2** facts,
5000 bp; `DS-CND-1` 8 → **5**, 7500 bp; `DS-DEF-5` 10 → **8**; `DS-WAR-1` 14 → **10**;
`DS-ECO-11` 7 → **5**; `DS-GEN-6` 10 → **9**; `DS-FTH-1` 6 → **4**), and the MOUNTS-PER-FACT
top-twelve (`readings.tradeRouteAccess spine 4 · modifier 16` has left it; `readings.primaryStress`
has entered). A chair reading § CAR 0 §2 alongside the tip gets two disagreeing tables.

---

## 14. WHAT I COULD NOT TEST

* `impairedInstitution`'s effect on the rate figures (ServicesTab's derivation is tab-local).
* 0e.5's "50 status flips / 7 guards / 8 atoms" — the probe scripts are in `laneMEASURE`,
  which is fenced from me. The *mechanism* is CONFIRMED (`MONSTER_FAMILY_OF` heartland→settled).
* Whether the full mutation sweep is otherwise green at this tip (never run a whole sweep).
