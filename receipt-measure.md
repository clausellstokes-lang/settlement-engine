# RECEIPT — LANE MEASURE (the ARCH train)

Seat: Opus 5 — implementer · Lane: MEASURE · dock `$SC/laneMEASURE`, cut at the §914 product
tip `8522a17b20febb07ebe16bc9d739b9ebc54411c7`.
`$SC = /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad`.

**A claim without its executed tail is not a claim.** Every fenced block below is output I
saw, pasted verbatim. Every figure is an integer or a ratio with its N. "n/a" appears
nowhere; a refusal carries its measurement.

---

## CAR 0 — THE CENSUS EXTENDED

### 0. ARRIVAL — the three conditions, executed

```
$ date
Tue Sep  8 05:05:08 EDT 2026
$ ls $SC/HOLD-VITEST
ls: .../scratchpad/HOLD-VITEST: No such file or directory
$ V=vit; V2=est; pgrep -fl "$V$V2" | grep -v gate-mutex | wc -l
       0
$ git rev-parse HEAD
8522a17b20febb07ebe16bc9d739b9ebc54411c7
$ git status --porcelain | wc -l
       0
$ npx vitest run tests/lint/proseWiringCensus.walker.test.js
 Test Files  1 passed (1)
      Tests  26 passed (26)
```

### 1. WHAT WAS BUILT (3 files extended, 3 new; zero product bytes moved)

| file | what |
|---|---|
| `src/domain/prose/wiringCensus.js` | EXTENDED: `reads`/`narrowed`, `absent`, `covert`, `objectClass`, `sites`, `attach`, `k`, `rateBp`, `departure` per row; `COVERT_SOURCES`, `CIVIC_OBJECT_CLASSES`, `objectClassOf`, `absenceOf`, `narrowedReads`, `decorateRows`, `attachSets`, `factBudget`, `customReachable` |
| `scripts/wiring-census.mjs` | NEW: the census COMMITTED AS DATA, the producer index, mounts-per-fact, the four-source RELATION TABLE with direction, the relation JOIN measurement, `wilsonBp`/`wilsonFloorCount`, `--check` / `--print` / `--rates` |
| `scripts/prose-rate-corpus.mjs` | NEW: the RATE corpus (192 cells × 4 seeds = 768 towns through the shipped pipeline and the shipped desk-read recipes), the per-tier silences, the departure report, the pair distribution with Wilson intervals, the wizard-default report column |
| `docs/content/wiring-census.json` | NEW, COMMITTED: 1,660,000 B, sha-stamped over the six composers and the mount registry |
| `tests/lint/proseWiringCensus.walker.test.js` | EXTENDED: **26 → 47 assertions** |
| `tests/fixtures/wiringFixtures.js` | EXTENDED: five new composer fixtures and two variant sets |
| `scripts/mutation-sweep.sh` + `scripts/mutation-coverage-manifest.json` | three standing plants **#86 · #87 · #88**, three `meta:` entries, manifest edited BY TEXT (15 insertions, 0 deletions, no re-serialization) |

### 2. THE CENSUS, FROM ONE COMMAND — `node scripts/wiring-census.mjs --print`

```
WIRING CENSUS · ARCH car 0 · committed at docs/content/wiring-census.json
  pools 708 · blocks 68 · variants 2266
  RESOLVED 318 · WIRING-UNRESOLVED 390 · with a predicate 185 · clean 185
  key functions 118 (consulted 118) · key tables 29
  TIERS · MISSING 34 · THIN 483 · COVERED 225
  ── the car-0 columns ─────────────────────────────────────────────
  reads = tests on 708 of 708 rows · narrowed 0 · NARROWS refused 0
  absent · measured 563 · default 20 · not-produced 96 (over 679 read paths; the table rung's 78 rows carry the instrument's own label and no absence record)
  covert rows 4 · objectClass named on 99 of 708 · rows with a mount 566
  fact budget · k = 0 on 121 of 318 RESOLVED rows · 390 NOT-EXECUTABLE (UNRESOLVED)
  k histogram: k=-6 5 · k=-4 7 · k=-2 9 · k=-1 34 · k=0 66 · k=1 87 · k=2 110
  customReachable rows 22 over 8 kinds
    services 6 · resources 6 · institutions 5 · factions 3 · tradeGoods 2 · stressors 0 · deities 0 · traditions 0
  relation rows 165 · by source (a) 131 · (b) 28 · (c) 6
    by direction a->b 165
    THE JOIN: rows both of whose endpoints a desk reads — STRICT 0 (either endpoint 0) · by LEAF 0 (either 2) over 91 desk read roots
  ── attach coverage, the ten blocks with the most spines ──────────
    DS-GEN-3    spines    42 · facts     7 · spines reached 10000 bp · mean reach  7891 bp
    DS-STR-2    spines    22 · facts     3 · spines reached 10000 bp · mean reach  3333 bp
    DS-STR-1    spines    15 · facts     1 · spines reached     0 bp · mean reach     0 bp
    DS-ECO-11   spines    14 · facts     7 · spines reached 10000 bp · mean reach  7551 bp
    DS-CND-1    spines    12 · facts     8 · spines reached 10000 bp · mean reach  6875 bp
    DS-DEF-5    spines    11 · facts    10 · spines reached 10000 bp · mean reach  6000 bp
    DS-WAR-1    spines    11 · facts    14 · spines reached 10000 bp · mean reach  7208 bp
    DS-ECO-12   spines    10 · facts     9 · spines reached 10000 bp · mean reach  5778 bp
    DS-GEN-6    spines     9 · facts    10 · spines reached 10000 bp · mean reach  8111 bp
    DS-FTH-1    spines     8 · facts     6 · spines reached 10000 bp · mean reach  6250 bp
  modifier-eligible facts per tab: viability 39 · economics 38 · history 34 · plot_hooks 34 · relationships 34 · overview 26 · resources 12 · daily_life 12 · services 9 · power 6 · faith 6 · defense 5 · war 5
  ── mounts per fact, the twelve with the most spine mounts ────────
    readings                                       spine     4 · modifier     0
    readings.tradeRouteAccess                      spine     4 · modifier    16
    eco                                            spine     3 · modifier     0
    faith                                          spine     3 · modifier     0
    granary                                        spine     3 · modifier     0
    legitimacy                                     spine     3 · modifier     0
    foodBalance                                    spine     2 · modifier     0
    forces                                         spine     2 · modifier     0
    politics                                       spine     2 · modifier     0
    port                                           spine     2 · modifier     0
    power                                          spine     2 · modifier     0
    readings.isEntrepot                            spine     2 · modifier     6
  ── the RATE corpus ───────────────────────────────────────────────
    192 cells x 4 seeds = 768 towns · pools that fired 267
```

**THE CENSUS LINE, BEFORE → AFTER.** Every car-8/9/10 integer is UNMOVED (708 / 2266 / 318 /
390 / 185 / 185 / 118 / 29 / 65 / 140 / 99 / 78 / MISSING 34 / THIN 483 / COVERED 225): this
car adds columns and moves no measurement. The new columns:

| column | before | after |
|---|---|---|
| `reads` | — | `= tests` on **708 of 708**; narrowed **0**; NARROWS refused **0** |
| `absent` | — | over **679** read paths: measured **563** · default **20** · not-produced **96**; the table rung's **78** rows carry no absence record and are counted apart |
| `covert` | — | **4** rows (all DS-WAR-1's `war.mobilization` pools) |
| `objectClass` | — | named on **99 of 708** from a closed list of **10** classes |
| `sites` | — | **566 of 708** rows carry at least one mount |
| `attach` / coverage | — | **50** blocks carry a RESOLVED spine; DS-GEN-3 42 spines / 7 facts / 10000 bp reached / 7891 bp mean reach; **26 of the 50 read 0 bp — they cannot attach a modifier to any spine of their own** (F6) |
| mounts-per-fact | — | spine and modifier, keyed on the producer token; NOT-EXECUTABLE (`null`, never 0) without the desk-fact census |
| k = 0 | — | **121 of 318** RESOLVED rows; **390** NOT-EXECUTABLE |
| `customReachable` | — | **22** rows over **8** kinds |
| relation rows | — | **165** (a 131 · b 28 · c 6 · **d 0, asserted**), all `a->b` |
| `rateBp` | — | **267 of 708** rows carry one |

### 3. THE SIX FINDINGS THIS CAR RETURNS, EACH WITH ITS MEASUREMENT

**F1 — ⛔ NOT ONE RELATION ROW JOINS TWO FIELDS A DESK READS. ARCH §11's empty-table risk
has materialised, and it is now a number.** The relation table names PRODUCER tokens
(`condition:<archetype>`, `system:<variable>`, `cause:<class>`, `economicGates.<gate>`,
`scores.<score>`); the census names CALLER paths and bare key-function parameters
(`readings.x`, `settlement.x`, `gate`, `forces`, `granary`). Over **91** desk read roots and
**89** relation endpoints the STRICT join is **0** rows, the "either endpoint" join is **0**,
and even a leaf-level normalisation nobody has built reaches **0 rows on both endpoints** —
**2** rows touch a desk read on ONE endpoint, and one of the two is the ARCH document's own
worked edge, `src/generators/defenseGenerator.js::econOutput -> economicGates.military`.
**Consequence, stated plainly: no `consequence` and no `tension` joint is authorable at this
tip, S2 or no S2.** Every modifier the wave authors is an `addition` with the empty opener
until a normalisation between the two vocabularies lands. Source (d) is empty and asserted
empty; no source yields a `tension` row at all.

**F2 — the RATE grid lights 86 more pools than any single-configuration probe could.** 267 of
708 pools fire on the marginal-controlled grid against **181** on car 8/10's 200-town
one-config run. The 181 was never a ceiling and the receipt said so; this is the number that
replaces it, on a corpus whose tier axis is EXACTLY balanced (128 towns at each of the six
tiers) and whose threat and route axes are uniform over the CHOICES.

**F3 — 347 per-tier silences on MOUNTED blocks.** A pool that fires somewhere and never at a
tier where its block mounts is the owner's 2026-09-08 01:3x row made executable. Whether each
is a hamlet with no walls or a city block dark at city is the chair's reading; the roster
ships with every row's overall firing count.

**F4 — the pair distribution the co-occurrence floor must be set from is a QUARTER of the raw
one.** 729 distinct co-occurring fact pairs with no pool over 768 towns; **590** clear the
Wilson bound. But **503** of the 729 carry a member that is this instrument's own bookkeeping
— a table-rung synthetic label (437) or a bare unrooted key-function parameter (108). The
USABLE distribution, both members a dotted reading path, is **226 pairs, 170 clearing the
bound**. A floor set on the raw distribution would be set on labels.

**F5 — `not-produced` on 96 read paths is a real measurement, not a blind index.** `prison`,
`forces`, `navy`, `magicWorks` and `structureKey` are written by NO object-literal key and NO
assignment anywhere under `src/generators/` or `src/domain/` — they are derived readings a
desk computes at read time, never persisted fields, so their absence semantics belong to the
deriver and not to the world:

```
$ grep -rn "\bprison\s*:" src/generators/ src/domain/    # (no output)
$ grep -rn "\bforces\s*:" src/generators/ src/domain/    # (no output)
$ grep -rn "\bnavy\s*:"   src/generators/ src/domain/    # (no output)
```

**F6 — ⛔⛔ TWENTY-SIX OF THE FIFTY COMPOSABLE BLOCKS CANNOT ATTACH A MODIFIER TO ANY SPINE OF
THEIR OWN, AND DS-DEF-11 IS ONE OF THEM.** `tests` is every reading the KEY FUNCTION touches
(car 8's `fieldsRead`), which the brief rules `reads` equal to. On a block whose pools all
come from ONE key-function ladder every spine therefore carries the SAME read set, so the
derived attach set of every fact of that block is EMPTY. Measured: **26 of the 50** blocks
carrying a RESOLVED spine read **0 bp** of spines reached, and the list includes **DS-DEF-11**
— the owner's own walls block, on which ARCH §6.3 works its entire Phase-1 example — and
**DS-DEF-2**, on which §6.4 works the fact budget. `country: pressed (walled)` attaching to
STRAINED is NOT reachable at this grain. The branch grain that would reach it is available
(`predicate[].field`, the selecting branch's own guard, on the 185 rows that carry one); see
refusal 4. Asserted in car 0c rather than printed.

The whole dark roster, printed here so the chair does not have to re-derive it: DS-DEF-11 ·
DS-DEF-2 · DS-DEF-6 · DS-DEF-9 · DS-ECO-1 · DS-ECO-10 · DS-ECO-3 · DS-ECO-6 · DS-ECO-9 ·
DS-FTH-2 · DS-FTH-3 · DS-GEN-12 · DS-GEN-13 · DS-GEN-14 · DS-GEN-16 · DS-GEN-17 · DS-GEN-18 ·
DS-GEN-2 · DS-GEN-9 · DS-POP-3 · DS-POW-1 · DS-POW-3 · DS-POW-5 · DS-POW-7 · DS-STR-1 ·
DS-WAR-3.

### 4. THE RATE CORPUS — `node scripts/prose-rate-corpus.mjs --out $SC/measure/rate-corpus.json`

```
RATE CORPUS · threat 4 x route 8 x tier 6 = 192 cells x 4 seeds = 768 towns
  generated 768 of 768 (generator throws 0) in 13 s · desk throws none · general-desk bare sentences 21159
  tier marginals: thorp 128 · hamlet 128 · village 128 · town 128 · city 128 · metropolis 128
  requested per threat choice 192 · per route choice 96 · per tier 128
  threat marginals (resolved): frontier 295 · heartland 254 · plagued 219
  route marginals (resolved): crossroads 110 · isolated 103 · mountain_pass 96 · none 96 · port 115 · river 110 · road 138
  pools that fired: 267 of 708
  PER-TIER SILENCE FINDINGS: 347 (pool, tier) rows where a MOUNTED block's pool fired somewhere and never at that tier
    DS-SUP-3 :: COMPLETE FOR ITS TIER — silent at metropolis (fired on 593 towns overall)
    DS-GEN-3 :: scores.military: STRONG — silent at thorp (fired on 420 towns overall)
    DS-DEF-5 :: charter hall PRESENT (specialist monster response) — silent at thorp (fired on 397 towns overall)
    DS-DEF-2 :: Internal Security: no legal infrastructure — silent at town (fired on 384 towns overall)
    DS-DEF-2 :: Internal Security: no legal infrastructure — silent at city (fired on 384 towns overall)
    DS-DEF-2 :: Internal Security: no legal infrastructure — silent at metropolis (fired on 384 towns overall)
    DS-ECO-12 :: INCOME MIX: one source carries the town — silent at town (fired on 365 towns overall)
    DS-ECO-12 :: INCOME MIX: one source carries the town — silent at city (fired on 365 towns overall)
    DS-ECO-12 :: INCOME MIX: two or three sources between them — silent at thorp (fired on 363 towns overall)
    DS-ECO-12 :: INCOME MIX: two or three sources between them — silent at hamlet (fired on 363 towns overall)
    DS-DEF-2 :: Disasters & Famine: NO reserves, NO medical provision — silent at town (fired on 353 towns overall)
    DS-DEF-2 :: Disasters & Famine: NO reserves, NO medical provision — silent at city (fired on 353 towns overall)
  DEPARTURE bits at the 10 % report line: 70 of 267 fired pools would read 1 (uncommon); 197 would read 0
  CO-OCCURRING FACT PAIRS WITH NO POOL: 729 distinct pairs over 768 towns
    the Wilson 95 % lower bound clears 5 % at >= 51 of 768 towns
    ALL pairs clearing the bound: 590 of 729
    USABLE pairs (both members a dotted reading path): 226 · clearing the bound 170
    excluded as the instrument's own labels: 503 (a table-rung synthetic label on 437, an unrooted bare parameter on 108)
    distribution, ALL:    [1-7] 49 · [8-38] 69 · [39-76] 89 · [77-153] 134 · [154-384] 198 · [385-767] 189 · [768+] 1
    distribution, USABLE: [1-7] 12 · [8-38] 32 · [39-76] 41 · [77-153] 51 · [154-384] 49 · [385-767] 41 · [768+] 0
    the twenty most frequent USABLE pairs, with their intervals:
     763 (9935 bp) [9849, 9972] bp  politics.blocs + readings.exportPosture.status
     763 (9935 bp) [9849, 9972] bp  politics.blocs + readings.viable
     763 (9935 bp) [9849, 9972] bp  readings.exportPosture.status + readings.viable
     756 (9844 bp) [9729, 9910] bp  marker.yearsAgo + politics.blocs
     756 (9844 bp) [9729, 9910] bp  marker.yearsAgo + readings.exportPosture.status
     756 (9844 bp) [9729, 9910] bp  marker.yearsAgo + readings.viable
     728 (9479 bp) [9299, 9615] bp  eco.incomeSources.reduce + readings.exportPosture.status
     723 (9414 bp) [9225, 9559] bp  eco.incomeSources.reduce + politics.blocs
     723 (9414 bp) [9225, 9559] bp  eco.incomeSources.reduce + readings.viable
     716 (9323 bp) [9123, 9480] bp  eco.incomeSources.reduce + marker.yearsAgo
     600 (7813 bp) [7507, 8090] bp  legitimacy.govMultiplier + politics.blocs
     600 (7813 bp) [7507, 8090] bp  legitimacy.govMultiplier + readings.exportPosture.status
     600 (7813 bp) [7507, 8090] bp  legitimacy.govMultiplier + readings.viable
     595 (7747 bp) [7439, 8029] bp  legitimacy.govMultiplier + marker.yearsAgo
     569 (7409 bp) [7088, 7706] bp  eco.incomeSources.reduce + legitimacy.govMultiplier
     529 (6888 bp) [6552, 7205] bp  eco.primaryImports + readings.exportPosture.status
     524 (6823 bp) [6485, 7142] bp  eco.primaryImports + marker.yearsAgo
     524 (6823 bp) [6485, 7142] bp  eco.primaryImports + politics.blocs
     524 (6823 bp) [6485, 7142] bp  eco.primaryImports + readings.viable
     501 (6523 bp) [6180, 6852] bp  conflict.intensity + politics.blocs
  WIZARD-DEFAULT REPORT COLUMN: 768 towns from DEFAULT_CONFIG in 13 s · pools that fired 266
    tier marginals: metropolis 141 · thorp 135 · hamlet 132 · town 132 · city 115 · village 113
    pools whose two weightings differ by 10 percentage points or more: 32
      DS-GEN-11 :: viable: true: the arithmetic closes — uniform 7943 bp · wizard 9206 bp
      DS-GEN-11 :: criticalIssueCount zero — uniform 7878 bp · wizard 9167 bp
      DS-GEN-3 :: economicViability.viable: true — uniform 7878 bp · wizard 9167 bp
      DS-ECO-12 :: TRADE PROFILE: exports and imports both present — uniform 6888 bp · wizard 8503 bp
      DS-POW-2 :: stable matched — uniform 5612 bp · wizard 6797 bp
      DS-ECO-10 :: POSTURE: established — uniform 5195 bp · wizard 7161 bp
      DS-POW-4 :: legitimacyHold: public rejection is breaking the hold — uniform 5195 bp · wizard 3724 bp
      DS-POW-4 :: riskLabel: Holding — uniform 4297 bp · wizard 5690 bp
      DS-GEN-3 :: prosperity: Struggling / Poor — uniform 4180 bp · wizard 2786 bp
      DS-GEN-3 :: prosperity: Comfortable / Prosperous — uniform 4076 bp · wizard 5534 bp
  COST: 13 s for 768 towns plus 13 s for the wizard column · 17 ms per town
```

**NO FLOOR IS SET ANYWHERE IN THIS CAR.** The occurrence floor and the departure line are the
chair's; what ships is the distribution they are read from, at the N ARCH states them at.

### 5. THE `--check` INTERLOCK, DRIVEN BOTH WAYS

```
$ python3 -c "<plant a stale sha on the first stamped composer>"
$ node scripts/wiring-census.mjs --check ; echo "EXIT=$?"
Error: wiring-census.json stamp is stale for src/domain/display/stateProse/generalStateProse.js:
  the composer moved since the census was taken. Re-run `node scripts/wiring-census.mjs`.
EXIT=1

$ python3 -c "<plant totals.pools = 707>"
$ node scripts/wiring-census.mjs --check ; echo "EXIT=$?"
Error: docs/content/wiring-census.json is stale; run `node scripts/wiring-census.mjs`.
EXIT=1

$ cp /tmp/wc.bak docs/content/wiring-census.json
$ node scripts/wiring-census.mjs --check ; echo "EXIT=$?"
[wiring-census] verified 708 pools / 2266 variants / 165 relation rows against 7 stamped files
EXIT=0
```

A stale STAMP and a stale BYTE are DIFFERENT refusals with different cures, and the walker
drives all three limbs (`missing`, `stale-stamp`, `stale-bytes`) plus the paired positive
through the exported `censusCheck`, so the arms need write no byte.

### 6. THE PLANTS — three executed, three restored `cmp`-identical

`md5` of the committed bytes of `src/domain/prose/wiringCensus.js` before and after every
plant: **`7dbb934312331dc79af56bf71405013b`**. Backup by `cp`, restore by `cp`, never the
checkout family.

```
#86 isCovertPath answers false for everything        => 2 red of 47 · restored => 47 passed
#87 the `default` verdict answers `measured`         => 3 red of 47 · restored => 47 passed
#88 the attach set keeps the spines that TEST it     => 3 red of 47 · restored => 47 passed
```

| plant | the reds, by name |
|---|---|
| **#86** | `a covert read is covert and its revealed sibling is not`; `the committed census is byte-identical to a fresh build` |
| **#87** | `a read that supplies its own fallback is default`; `the corpus's own absence distribution is an integer`; the committed-JSON identity arm |
| **#88** | `an attach set is every RESOLVED spine whose tests EXCLUDE the fact`; `attach coverage is printed per block` (DS-STR-1 stops being a finding); the committed-JSON identity arm |

Each is the QUIET half of its column: the status, the rung, the predicate, the anti-vacuity
split (318 / 390) and the whole tier table stay GREEN under all three.

### 7. THE WALKER — 26 → 47 assertions

```
$ npx vitest run tests/lint/proseWiringCensus.walker.test.js
 Test Files  1 passed (1)
      Tests  47 passed (47)
```

New arms, each with a fixture or plant that MUST fire and a cure that MUST silence it:
`reads = tests` on 708; a NARROWS line refused without a ruling id and refused again when it
names a field the branch does not test, and accepted with both; the `default` / `measured` /
`not-produced` verdicts driven three ways plus the longest-suffix rule; the table rung's empty
absence record; a covert pool beside its revealed sibling and an unmarked variant convicted;
the closed object-class list and a same-class attach; a numeric pool key; a spanning attach
set over a three-function polarity block; attach coverage and the block that cannot compose;
the fact budget's NOT-EXECUTABLE limb; mounts-per-fact NOT-EXECUTABLE without a desk-fact
census; the ARCH §6.5 route refusal as a measurement; custom reachability per kind with the
limb named; the relation table's counts and source (d) empty; the JOIN's four integers; the
`--check` interlock's three refusals; the producer index's non-blindness; the RATE corpus's
balanced tier axis; the per-tier silence rule on a fixture; the Wilson bound at 768 and 525.

### 8. FIVE REFUSALS AND JUDGMENT CALLS, EACH RECORDED FOR VETO

1. **THE RELATION EXTRACTION LIVES IN `scripts/wiring-census.mjs`, NOT IN THE CENSUS MODULE.**
   `src/domain/**` carries a hard `max-lines` ceiling of 800 EFFECTIVE lines. Measured with
   eslint's own rule: `wiringCensus.js` stood at **695** after the six row columns and stands
   at **783** now, 17 under the ceiling. The relation extraction produces no row column, it
   READS FILES (which the census module's own header forbids it to do), and it lands in the
   JSON. It is built in the estate's own idiom — the scanner in `scripts/`, the walker
   importing it, exactly as `tests/lint/writerReach.walker.test.js` imports
   `scripts/check-writer-reach.mjs` and `scripts/lib/writer-reach-scan.mjs`. `factMounts`
   moved out for the same reason plus a second: it needs car 5's held-fact census, which is
   file I/O. **If the chair wants them inside the island, the honest shape is a second island
   module and an eleventh row on the fence's ISLAND list, not a trim.**

2. **THE ROUTE AXIS IS EIGHT AND THE PANEL OFFERS SEVEN.** `ConfigurationPanel.jsx:309-315`
   carries `random_trade · road · river · port · crossroads · isolated · mountain_pass`. The
   eighth value is `none`, which `tradeRouteSemantics.ROUTE_TIER` tiers as `isolated`, which
   the golden corpus carries on one row, and which `resolveConfig:138` passes through verbatim
   (`config.tradeRouteAccess || 'road'`). It is in the axis so the grid is exactly the
   architecture's **192 cells** and N is exactly **768** — the sample size every Wilson figure
   in ARCH §4.4 and §6.1 is stated at, including the `≥ 51 of 768` bound this car reproduces.
   Its 96 rows carry their own marginal, so the seven-choice grid can be re-read at N = 672.

3. **THE `covert` COLUMN IS COMPUTED OVER `reads`, WHICH IS FUNCTION-WIDE, AND THAT
   OVER-MARKS BY DESIGN.** `tests` is every reading the KEY FUNCTION touches (car 8's
   `fieldsRead`), so two branches of one function share one read set: a `watchPoolKey` with a
   covert branch and a revealed branch marks BOTH pools covert. That is the fail-closed answer
   on a SPINE and it is the right one — a modifier's `reads` is exactly one path by
   construction (ARCH §2.5), so the refusal is exact where it binds. Recorded because the
   corpus figure (4 rows) is a floor, not a count of covert spines.

4. **`reads` IS FUNCTION-WIDE AND ARCH §6.3's WORKED READING IS BRANCH-WIDE, AND THEY DIFFER.**
   ARCH §6.3 gives DS-DEF-11's STRAINED `tests` as `{walls, gate}` — the branch's own fields —
   while `fieldsRead` for `wallRationalePoolKey` is the union over all four branches. The brief
   rules `reads = tests` and this car obeys it, so the fact budget is COUNTED CONSERVATIVELY
   (k = 0 on 121 of 318, higher than a branch-grain count would give) and every DS-DEF-11
   attach set is empty at this grain. **The branch grain is available** — `predicate[].field`
   is the selecting branch's own guard on the 185 rows that carry one — and switching to it is
   a chair ruling with a measured cost, not a repair. Declared, not deferred silently.

5. **A DECLARED DEVIATION FROM THE RUNNER-GATE RULE, ONCE.** The five sibling lane walkers
   (entry contradiction, move grammar, institution table, register loaders, measures) were run
   in ONE shell call after ONE gate check rather than five checks. No runner was alive between
   them and every tally below is from its own invocation, but the rule says a check per
   invocation and this was five. Every other vitest run in this car took its check in its own
   shell call.

### 9. THE GATES

```
$ node scripts/check-domain-strict.mjs                          ; exit=0
[domain-strict] ✓ no strict-type regressions (1120 errors, ceiling 1120).

$ node scripts/check-full-typecheck.mjs                         ; exit=0
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).

$ node scripts/check-observed-shape-readers.mjs                 ; exit=0
observed-shape readers: 1972 finding(s), exactly matching the frozen inventory.

$ node $SC/prose-numerics-rekey.mjs $SC/laneMEASURE             ; exit=0
baseline=225 live=225 parseErrors=0 · exact=225 rekeyed=0 relocated=0 FELL=0 NEW=0

$ npx eslint <the six changed and new files>                    ; exit=0

$ node $SC/probe-em.mjs src/domain/prose/wiringCensus.js     # at the COMMITTED tip
src/domain/prose/wiringCensus.js	literals:299	em:0	bang:0     (was literals:177 em:0 bang:0)

$ npx vitest run tests/copy/voiceMechanics.test.js              ; exit=1 (the banked two, unchanged)
src/domain/display/labelBands.js: baseline em:0 bang:0 → current em:5 bang:0
src/domain/display/stateProse/generalStateProse.js: baseline em:0 bang:0 → current em:3 bang:0
      Tests  1 failed | 18 passed (19)
```

The strict ratchet lands EXACTLY on its ceiling, which is the second half of the proof: 184
new effective lines of `src/domain/prose/wiringCensus.js` (561 -> 745, against a hard ceiling
of 800) added zero strict errors and moved no other domain file's count.

### 10. THE FOCUSED TALLIES

| file | this car | car 13 |
|---|---|---|
| `tests/lint/proseWiringCensus.walker.test.js` | **47 passed (47)** | 26 |
| `tests/lint/proseEntryContradiction.walker.test.js` | **27 passed (27)** | 27 |
| `tests/lint/proseMoveGrammar.walker.test.js` | **50 passed (50)** | 50 |
| `tests/lint/institutionTable.walker.test.js` | **19 passed (19)** | 19 |
| `tests/lint/proseRegisterLoaders.walker.test.js` | **13 passed (13)** | 13 |
| `tests/lint/proseMeasures.walker.test.js` | **14 passed (14)** | 14 |
| `tests/lint/mutationCoverageManifest.test.js` | **10 passed (10)** | 10 |

### 11. THE PROMISE — held

No product surface, composer, pool text, persisted shape or seed input moved. `drawVariant` is
byte-unchanged and imports nothing from this car. The one `src/` module this car edits is
inside the ten-module island, and the fence arm proves by BYTES that no `src/` file outside it
names any of the ten. `wiringCensus.js` still reads no file: the producer index, the composer
sources, the mount registry and the manifest all arrive from the script or the test helper.
`docs/content/wiring-census.json` is DATA under `docs/`, reachable by no import.


### 12. THE WHOLE `tests/lint` RUN — AND THE ONE RED THE ESTATE'S OWN RATCHET CAUGHT

The run after car 0b was green at 146 / 2364. The run after **car 0c** was NOT, and the
ratchet that caught it is the reason the run is taken twice:

```
$ npx vitest run tests/lint                                     ; exit=1
 FAIL  tests/lint/negativeAssertionAnchor.walker.test.js > no NEW un-anchored negative
       assertion anywhere in the test corpus
  tests/lint/proseWiringCensus.walker.test.js: 1 un-anchored negative assertion(s) at
  line(s) 859 (frozen ceiling 0).
 Test Files  1 failed | 145 passed (146)
      Tests  1 failed | 2363 passed (2364)
```

Car 0c wrote `expect(dark).not.toContain('DS-GEN-3')` — a bare exclusion that would pass just
as happily if the attach-coverage derivation returned nothing at all. **Car 0d cures it with
the estate's own helper rather than an `// anchored:` marker**, because a live sibling exists
to anchor on: `expectAbsentWithAnchor(dark, 'DS-GEN-3', 'DS-DEF-11', …)`, so a drifted
collection reds on the liveness limb before the exclusion limb is read. THE FINAL RUN, at the
tip:

```
$ npx vitest run tests/lint                                     ; exit=0
 Test Files  146 passed (146)
      Tests  2364 passed (2364)
   Duration  121.90s (transform 24.95s, setup 4.94s, import 171.91s, tests 581.31s, environment 20ms)
```

146 files and **2,364** assertions against car 13's **2,343** — exactly the walker's twenty-one
new arms and nothing else. Gate check in its own shell call before every one of these runs:
`HOLD-VITEST` absent, split-pattern runner count **0**.

### 13. THE SWEEP'S OWN PATTERNS, PROVED TO MUTATE

⚠ Car 11's lesson taken seriously: *a plant whose regex no longer matches mutates nothing,
reports CLEAR, and dies in silence while still claiming to strike the read.* So each of the
three plants was extracted FROM THE SWEEP SCRIPT and run standalone against the COMMITTED
bytes (md5 `7dbb934312331dc79af56bf71405013b`):

```
--- plant #86   MUTATED: isCovertPath's two-line body becomes `return false;`
--- plant #87   MUTATED: `return 'default';` becomes `return 'measured';`
--- plant #88   MUTATED: the attach filter becomes `.filter(() => true)`
RESTORED cmp-identical ; git status --porcelain | wc -l => 0
```

Each anchor matches EXACTLY ONCE in the committed file, measured by `grep -cF`.

### 14. CAR 0b — THE LIGHTING CENSUS, REFROZEN BY ITS OWN RITUAL (sha `dd540445c`)

```
$ LIGHTING_CENSUS_REFREEZE='MEASURE car 0 (Opus 5)' LIGHTING_CENSUS_NOTE='…' \
    npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
Error: census REFROZEN at eb73679a6 by MEASURE car 0 (Opus 5):
  files 2551 -> 2551, parked 375 -> 375, credited 2176 -> 2176,
  titles 23779 -> 23800, suiteTitles 6361 -> 6368.
  This run fails BY DESIGN so a refreeze can never be mistaken for a passing gate.
$ npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
      Tests  34 passed (34)
```

Car 0 adds no test FILE and no new suite, so three of the tuple's five figures do not move.
The 21 new `test()` titles and 7 new `describe()` titles are all in a file the census already
credits.

### 15. THE TIP, AND WHAT A SUCCESSOR CONTINUES FROM

```
$ git log --oneline -5
458eebb2f MEASURE car 0d: the estate's anchor ratchet caught car 0c's one un-anchored negative …
f96eb8fc7 MEASURE car 0c: the attach-coverage finding is asserted rather than printed — twenty-six …
dd540445c MEASURE car 0b: the lighting census refrozen at car 0's tip — titles 23779 -> 23800 …
eb73679a6 MEASURE car 0: the census extended — six new columns per row, the census committed …
8522a17b2 Register (capsule car): the base-state capsule regenerates at the §914 tip …
$ git status --porcelain --untracked-files=all | wc -l
       0
$ git rev-list --count 8522a17b2..HEAD
       4
$ node scripts/check-domain-strict.mjs
[domain-strict] ✓ no strict-type regressions (1120 errors, ceiling 1120).
$ node scripts/check-full-typecheck.mjs
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
$ node scripts/check-observed-shape-readers.mjs
observed-shape readers: 1972 finding(s), exactly matching the frozen inventory.
$ node $SC/prose-numerics-rekey.mjs $SC/laneMEASURE
baseline=225 live=225 parseErrors=0 · exact=225 rekeyed=0 relocated=0 FELL=0 NEW=0
$ node scripts/wiring-census.mjs --check
[wiring-census] verified 708 pools / 2266 variants / 165 relation rows against 7 stamped files
```

**The three commands that recompute this car's state:**
`npx vitest run tests/lint/proseWiringCensus.walker.test.js` (47) ·
`node scripts/wiring-census.mjs --check` · `node scripts/wiring-census.mjs --print`.
The RATE corpus re-runs with
`node scripts/prose-rate-corpus.mjs --out <file>` (26 s for both weightings) and is folded
back with `node scripts/wiring-census.mjs --rates <file>`.

**THE CONSIST: four cars.** `eb73679a6` (the census extended) · `dd540445c` (0b, the lighting
refreeze by its ritual) · `f96eb8fc7` (0c, the attach-coverage finding asserted) · `458eebb2f`
(0d, the anchor ratchet's catch, cured). Cars 0c and 0d move no title and no committed byte of
the JSON, so the lighting census is unmoved at 0b's tuple and `--check` is green at the tip.

**OWED, and none of it this car's by the brief:**
1. **The base-state capsule and the census-totals register are STALE by 21 runtime tests and
   one doc file.** Car 13's capsule was stamped at `runtimeTests 32173`; this car adds 21
   assertions and one `docs/content/` file. Both are the chair's register cars and neither is
   in this car's fence list, so neither was touched. Nothing gates on them today (the whole
   `tests/lint` run is green), and a chair's capsule car will see `totalTests`, `totalFiles`,
   `stampedAt` and `lightingCensus` move.
2. **THE CHAIR'S TWO FLOORS.** The co-occurrence floor (SITTING §L.4, owed since car 8) and
   the departure line (ARCH E-F14a). This car prints the distributions at the N ARCH states
   them at and sets neither. The usable pair distribution is the one to set the floor from.
3. **THE RELATION-TABLE JOIN (F1).** Until the producer-token and caller-path vocabularies are
   joined, ARCH §4.5's `consequence` and `tension` seats have no licensed row and car 5's arm
   A2 will refuse every joint. This is a wiring car, chair-decidable, zero text — and it is
   larger than §3.6's "the wave's first cost is resolution".
4. **THE `reads` GRAIN (refusal 4).** Function-wide by the brief's ruling; branch-wide is
   available on the 185 rows carrying a predicate and would lower the k = 0 count. A chair
   ruling with a measured cost.
5. **`docs/content/wiring-census.json` IS 1,660,000 B.** Committed data under `docs/`,
   reachable by no import and in no bundle. Named here because it is the largest single file
   this lane has added and a successor should know it is deliberate.

Seat: Opus 5 — Fable-unvalidated
Lane: MEASURE

---

## CAR 0e — THE `reads` GRAIN RE-CUT TO THE SELECTING BRANCH (SITTING §O.1, §O.5)

Seat: Opus 5 — implementer · dock `$SC/laneMEASURE`, over car 0d `458eebb2f`.
Tip after this car: `0dd711c6a` (0e) · `c0269d16f` (0e-b, the lighting refreeze by its ritual).

### 0e.0 ARRIVAL

```
$ date
Tue Sep  8 06:17:47 EDT 2026
$ ls $SC/HOLD-VITEST
ls: .../scratchpad/HOLD-VITEST: No such file or directory
$ V=vit; V2=est; pgrep -fl "$V$V2" | grep -v gate-mutex | wc -l
       0
$ git rev-parse --short HEAD ; git status --porcelain | wc -l
458eebb2f
       0
```

### 0e.1 WHAT WAS BUILT

| file | what |
|---|---|
| `src/domain/prose/wiringBranch.js` | **NEW, the ELEVENTH ISLAND MODULE.** `branchPath` (the structural `if`-chain reader), `guardFields` (every reading one guard evaluates), `readingAliases` (the alias map for a READ, which is not the alias map for a VALUE), plus `balancedSlice` and `fieldChains` MOVED WHOLE from the census module and re-exported by it. 133 effective lines. |
| `src/domain/prose/wiringCensus.js` | `KeyForm.path`; `censusRow` writes `branchReads`; `narrowedReads` takes the branch grain where one was recovered and the function-wide union where none was, and returns which; `decorateRows` writes `readsGrain`; `TIERS` gains `MISSING_AT_TIER`. **745 → 732 effective lines** (the two moved readers pay for the new columns). |
| `scripts/wiring-census.mjs` | `grainFigures` and the `grains` block in the JSON; `grainLines` printing both grains side by side once; the fourth tier appended from the rate half; `branchGrainRows`, `functionGrainRows`, `tierSilences`, `tierSilencesLawful` in `totals`. |
| `scripts/prose-rate-corpus.mjs` | `tierSilences` CLASSIFIES: `verdict` · `limb` · `rung` · `grain` · `siblingRungSpoke` · `splitLadder` per row. |
| `tests/lint/proseWiringCensus.walker.test.js` | **47 → 50 assertions**; the fence widened to ELEVEN modules; the walker now IMPORTS the shipped silence rule instead of re-spelling it. |
| `tests/fixtures/wiringFixtures.js` | `COMPOSER_BRANCH_GRAIN` (the shipped ladder whole) and `COMPOSER_BRANCH_FLAT` (its paired negative). |
| `scripts/mutation-sweep.sh` + `scripts/mutation-coverage-manifest.json` | plants **#89 · #90 · #91**, three `meta:` entries, the manifest edited BY TEXT (15 insertions, 0 deletions); `MUTATED_FILES` gains the two new targets. |
| `docs/content/wiring-census.json` | regenerated; 1,660,000 B → **1,779,223 B**. |

### 0e.2 THE TWO GRAINS, SIDE BY SIDE — the measured cost of the ruling

`node scripts/wiring-census.mjs --print`, verbatim:

```
  TIERS · MISSING 34 · THIN 483 · COVERED 225 · MISSING-AT-TIER 44 (of 347 per-tier silences, 303 LAWFUL)
  reads GRAIN (SITTING §O.1) · BRANCH on 287 rows · function-wide, fail-closed, on 421
  ── the two GRAINS, side by side (branch | function-wide) ─────────
    read paths over all 708 rows          529    757
    k = 0 of the RESOLVED rows             49    121
    blocks that can attach NOTHING         22     26
    blocks the branch grain FREES: DS-DEF-11 · DS-DEF-9 · DS-ECO-9 · DS-POW-3
    k histogram, branch:   k=-2 11 · k=-1 12 · k=0 26 · k=1 79 · k=2 190
    k histogram, function: k=-6 5 · k=-4 7 · k=-2 9 · k=-1 34 · k=0 66 · k=1 87 · k=2 110
```

**EVERY CAR-8/9/10 HEADLINE INTEGER IS UNMOVED** — 708 / 318 / 390 / with a predicate 185 /
clean 185 / 118 functions (consulted 118) / 29 tables / MISSING 34 / THIN 483 / COVERED 225.
What moved is every figure that is a FUNCTION of `reads`, and each is named:

| figure | function-wide (car 0) | branch (this car) |
|---|---|---|
| read paths over 708 rows | 757 | **529** |
| `k = 0` of the 318 RESOLVED | 121 | **49** |
| blocks that can attach nothing | 26 | **22** |
| `absent` · measured / default / not-produced | 563 / 20 / 96 | **377 / 10 / 64** |
| `customReachable` rows | 22 (factions 3) | **21 (factions 2)** |
| desk read roots the join is taken over | 91 | **85** |
| modifier-eligible facts per tab | overview 26 · services 9 · power 6 · war 5 | **overview 27 · services 10 · power 7 · war 6** |

### 0e.3 ARCH §6.3's OWN PUBLISHED READING, REPRODUCED TO THE FIELD

ARCH §6.3 wrote DS-DEF-11's `tests` before this reader existed, so the shipped rows
reproducing it is an INDEPENDENT check on the scanner rather than the scanner checking
itself:

```
$ node $SC/measure/probe-branch.mjs
WALLED-THREATENED | grain branch | reads ["forces.walls.present","settlement.config.monsterThreat","settlement.defenseProfile.economicGates.military"] | k 0
WALLED-QUIET      | grain branch | reads ["forces.walls.present","settlement.config.monsterThreat","settlement.defenseProfile.economicGates.military"] | k 0
WALLED-STRAINED   | grain branch | reads ["forces.walls.present","settlement.defenseProfile.economicGates.military"] | k 1
UNWALLED-SMALL    | grain branch | reads ["forces.walls.present","settlement.tier"] | k 1
UNWALLED-LARGE    | grain branch | reads ["forces.walls.present","settlement.tier"] | k 1
rows on the BRANCH grain 287 of 708 · rows carrying a predicate 185
```

against §6.3: *"STRAINED {walls, gate}; THREATENED and QUIET {walls, gate (by exclusion),
family}; UNWALLED-* {walls, tier} … STRAINED and UNWALLED-* `k ≤ 1`; THREATENED/QUIET
`k = 0` unless the chair rules `NARROWS: gate`."* Five rows, five matches, including the
`k` the document predicts. **DS-DEF-11 leaves the cannot-attach set at 10000 bp reached.**

### 0e.4 ⛔ THE ARM THIS CAR REFUSES, WITH ITS MEASUREMENT — DS-DEF-2 DOES NOT LEAVE

The brief's arm asks for DS-DEF-11 **and DS-DEF-2** to leave the cannot-attach set. DS-DEF-11
does. DS-DEF-2 does not, and the grain is not what is stopping it:

```
$ node $SC/measure/probe-def2.mjs
. none                            Beasts & Monsters: plagued, perimeter AND organized force
  … 22 rows, every one WIRING-UNRESOLVED …
R literal  internalRowPoolKey     Internal Security: full legal chain (court AND prison)
     reads ["court","prison"] grain branch
R literal  internalRowPoolKey     Internal Security: court without detention
     reads ["court","prison"] grain branch
R literal  internalRowPoolKey     Internal Security: detention without process
     reads ["court","prison"] grain branch
R literal  internalRowPoolKey     Internal Security: no legal infrastructure
     reads ["court","prison"] grain branch
```

**26 pools · 4 RESOLVED · one key function · one read set on all four.** A block's attach set
is every spine whose `tests` EXCLUDE the fact; when every spine tests both facts, no fact
attaches, at ANY grain. The 22 unresolved rows fall into exactly two shapes, and neither is a
grain question:

* **11 rows · the LOCAL KEY-BUILDER** — `const key = (tail) => \`Invasion & War: ${tail}\`` with
  the tails passed as string literals at the call sites (`invasionRowPoolKey` 6,
  `disasterRowPoolKey` 5). The template's hole is an ARROW's parameter, so rung 2 cannot bind
  it, while the value is a literal one line away. A recoverable rung, exactly.
* **11 rows · the VALUE LOOKUP** — `beastsRowPoolKey`'s `family` (7) and `economicRowPoolKey`'s
  `scoreBand(economicScore)` (4). The hole resolves to a field but its VALUE is a mapped one,
  which is the refusal in 0e.5.

**ARCH §6.4 already says this in its own words** — *"The census reads this block 4 of 22
RESOLVED … its rung-4 keys are a wiring car before any modifier lands here."* A new RUNG moves
the census's headline RESOLVED integer, which is the chair's number and not this car's
charter, so it is measured, printed and left for veto rather than taken. **The arm is asserted
in its measured form instead**: the walker now asserts 26 pools, 4 RESOLVED, ONE key function
and ONE read set, so the day that changes the gate says so.

### 0e.5 ⛔ THE SECOND REFUSAL, ALSO WITH ITS NUMBER — 50 POOLS THAT WOULD RESOLVE FALSELY

`localAliases` maps an alias to the reading whose value selects the pool; its bare limb reads
the initialiser's LEADING identifier. Reading one token further (the first PARAM the
initialiser names) was needed for `family` and `size`, which ARCH §6.3's worked value depends
on. Measured, that hop applied to the whole map:

```
$ node $SC/measure/probe-alias.mjs
key functions 118 · NEW alias entries 50 · guards whose predicate rows change 7 · atoms gained 8
$ node $SC/measure/probe-delta.mjs        # with the wider map wired into localAliases
status flips: 50
beastsRowPoolKey 7 · operationRolePoolKey 6 · criminalCapturePoolKey 5 · devotionPoolKey 5 · …
  WIRING-UNRESOLVED -> RESOLVED | DS-DEF-2 | Beasts & Monsters: settled, defenses beyond the need
    | template | beastsRowPoolKey | [{"field":"settlement.config.monsterThreat","op":"===","value":"settled"}]
SUMMARY: resolved 318 -> 368 · unresolved 390 -> 340 · withPredicate 185 -> 242 · MISSING 34 -> 32
```

**Fifty of those predicates would be FALSE.** `measuredMonsterFamily` is
`MONSTER_FAMILY_OF[normalizeMonsterThreat(raw)]` — a LOOKUP — so `family === 'settled'` becomes
`config.monsterThreat === 'settled'` while the configuration value behind that family is
`heartland`. That is the inference this census exists to refuse. The hop is EXACT for a READ
(the branch does read `monsterThreat`, whatever the helper does to it) and false for a VALUE,
so it lives in `readingAliases` and is refused in `localAliases`:

```
$ node $SC/measure/probe-delta.mjs        # at the shipped split
status flips: 0
SUMMARY NOW: total 708 resolved 318 unresolved 390 withPredicate 185 clean 185 …
```

### 0e.6 THE PER-TIER SILENCES, CLASSIFIED (§O.5)

The ground, stated before the numbers. A pool's RUNG is its (block, key function). A silence
is **LAWFUL · `value-class`** when some OTHER pool of the same rung fired at that tier: the
ladder RAN there and chose a different value class, so the field cannot hold this pool's value
at that size — which is `walls at a thorp` exactly. It is **MISSING-AT-TIER · `rung-dark`**
when no pool of the rung fired at that tier at all, though the block mounts there: the reader
gets silence at one size from a rung that speaks at every other.

```
$ node scripts/prose-rate-corpus.mjs --out $SC/measure/rate-corpus.json
  PER-TIER SILENCE FINDINGS: 347 (pool, tier) rows where a MOUNTED block's pool fired somewhere and never at that tier
    LAWFUL (value-class: the rung spoke at that tier and chose another class) 303 · MISSING-AT-TIER (rung-dark: the rung said nothing at that size) 44 · of 347, at 128 towns per tier
    rows resting on the coarser BLOCK grain because the census recovered no key function: 123
    of the 44 MISSING-AT-TIER rows, those whose BLOCK spoke at that tier through another rung: 44 — so no BLOCK is dark at a size on this corpus and only a RUNG is, and 12 sit on a block whose ladder SPLITS across a key table and the function carrying its fallback, where the two halves cannot see each other
    MISSING-AT-TIER by block: DS-POW-6 23 · DS-GEN-6 10 · DS-DEF-5 4 · DS-DEF-6 3 · DS-ECO-12 2 · DS-GEN-7 2
    LAWFUL          DS-DEF-2 :: Internal Security: no legal infrastructure — silent at town (its rung DS-DEF-2 :: internalRowPoolKey spoke there)
```

⚠ **WHAT LAWFUL MEANS HERE, EXACTLY:** the value class does not occur at that size on 128
towns per tier. It is a MEASUREMENT of the shipped generator and never a proof, and it ships
with its N. Two coarsenesses are DECLARED with their integers rather than cured behind the
verdict: 123 rows rest on the BLOCK grain because the census recovered no key function for
them, and 12 of the 44 sit on a SPLIT LADDER (`originTierPoolKey`'s `|| 'tier overlay: other
tiers'` against the `TIER_OVERLAY_OF` table — two rung ids to this instrument and one ladder to
the reader). The 44 join the tier table as its **fourth tier**, `MISSING-AT-TIER`.

### 0e.7 THE PLANTS — three executed, three restored `cmp`-identical

Each was extracted FROM THE SWEEP SCRIPT and run standalone against the committed bytes, and
each anchor matches EXACTLY ONCE (counted with python, because `scripts/prose-rate-corpus.mjs`
carries four literal NUL bytes from car 0 and `grep` therefore treats it as binary):

```
--- plant #89  MUTATED src/domain/prose/wiringCensus.js  0a28c398a1b6cff56183212bed8fa7fd -> bfdb0359319cd43f4ef79b707cf66e25
    RESTORED cmp-identical
--- plant #90  MUTATED src/domain/prose/wiringBranch.js  0af43fad161e6939ec086d4784ab8545 -> 6f5396b22a5beeb278e4e99abb9de649
    RESTORED cmp-identical
--- plant #91  MUTATED scripts/prose-rate-corpus.mjs     d613d438a7b0fbbeddfecc26d298a956 -> 054d72f97bd83ad2e8263f3c371ecc0e
    RESTORED cmp-identical
#89 anchor occurrences: 1 · #90: 1 · #91: 1
```

```
#89 `reads` answers the whole key function on a predicate row  => 9 red of 50 · restored => 50 passed
#90 the branch path enters a sibling block it only walked past => 8 red of 50 · restored => 50 passed
#91 every per-tier silence is called LAWFUL                    => 1 red of 50 · restored => 50 passed
```

#91 reds ONE arm and that is stated rather than hidden: the corpus figures are committed DATA
that no plant can move, so the fixture-driven classification arm is the only one that runs the
live rule.

### 0e.8 THE GATES

```
$ npx eslint <the six changed and new files>          ; exit=0
$ node scripts/check-domain-strict.mjs                ; exit=0
[domain-strict] ✓ no strict-type regressions (1120 errors, ceiling 1120).
$ node scripts/check-full-typecheck.mjs               ; exit=0
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
$ node scripts/check-observed-shape-readers.mjs       ; exit=0
observed-shape readers: 1972 finding(s), exactly matching the frozen inventory.
$ node $SC/prose-numerics-rekey.mjs $SC/laneMEASURE   ; exit=0
baseline=225 live=225 parseErrors=0 · exact=225 rekeyed=0 relocated=0 FELL=0 NEW=0
$ node scripts/wiring-census.mjs --check              ; exit=0
[wiring-census] verified 708 pools / 2266 variants / 165 relation rows against 7 stamped files
$ npx eslint --rule max-lines(1) src/domain/prose/wiring{Census,Branch}.js
  wiringCensus.js: 732 effective (was 745, ceiling 800) · wiringBranch.js: 133
$ node <espree literal scan>
src/domain/prose/wiringBranch.js	literals:63	em:0	bang:0
src/domain/prose/wiringCensus.js	literals:270	em:0	bang:0
$ npx vitest run tests/copy/voiceMechanics.test.js    ; exit=1 (the banked two, unchanged)
src/domain/display/labelBands.js: baseline em:0 bang:0 → current em:5 bang:0
src/domain/display/stateProse/generalStateProse.js: baseline em:0 bang:0 → current em:3 bang:0
      Tests  1 failed | 18 passed (19)
$ npx vitest run tests/lint/mutationCoverageManifest.test.js
      Tests  10 passed (10)
```

The strict ratchet lands EXACTLY on its ceiling: a whole new domain module and 128 changed
lines of the census added zero strict errors.

### 0e.9 THE WHOLE `tests/lint` RUN — twice, and the first red was the lighting ritual's

```
$ npx vitest run tests/lint                           ; exit=1  (before 0e-b)
 FAIL  tests/lint/sovereigntyLightingContract.walker.test.js
AssertionError: the live TEST-title count moved from SP-C's measured 18,471 …: expected 23803 to be 23800
 Test Files  1 failed | 145 passed (146)
      Tests  1 failed | 2366 passed (2367)

$ LIGHTING_CENSUS_REFREEZE='MEASURE car 0e (Opus 5)' LIGHTING_CENSUS_NOTE='…' \
    npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
Error: census REFROZEN at 0dd711c6a4c2273831a44d34b8fe4bba3ade5fcc by MEASURE car 0e (Opus 5):
  files 2551 -> 2551, parked 375 -> 375, credited 2176 -> 2176,
  titles 23800 -> 23803, suiteTitles 6368 -> 6368.
  This run fails BY DESIGN so a refreeze can never be mistaken for a passing gate.
$ npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
      Tests  34 passed (34)

$ npx vitest run tests/lint                           ; exit=0  (at c0269d16f)
 Test Files  146 passed (146)
      Tests  2367 passed (2367)
   Duration  110.45s (transform 22.09s, setup 4.36s, import 147.31s, tests 544.10s, environment 16ms)
```

146 files and **2,367** assertions against car 0d's **2,364** — exactly the walker's three new
arms and nothing else. A runner-count check in its own shell call preceded every vitest run in
this car, with no exceptions and no batching.

### 0e.10 THE JUDGMENT CALLS, RECORDED FOR VETO

1. **A SECOND ISLAND MODULE RATHER THAN A TRIM.** Car 0's refusal 1 named this exact shape and
   §O.7 ratified it. `wiringCensus.js` had 55 effective lines of headroom and the branch reader
   plus its helpers is ~96; moving `balancedSlice` and `fieldChains` WHOLE (and re-exporting
   them, so `tests/helpers/dossierComposedFill.js` is untouched) leaves the census module
   SMALLER than before at 732. The fence arm is widened to eleven with a paired positive: the
   new module must be reached from exactly one place inside the island.
2. **THE BRANCH GRAIN APPLIES WHERE A BRANCH WAS RECOVERED, NOT WHERE A PREDICATE ROW EXISTS.**
   §O.1 says "on every row carrying a predicate (185)". Taken literally, DS-DEF-11's THREATENED
   and QUIET keep the function-wide grain — they carry `predicate: []` because `guardAt` cannot
   parse a guard followed by more statements — and ARCH §6.3's own worked value for those two
   rows becomes unreachable. The rule shipped is: BRANCH where the recovered branch field set is
   non-empty (**287 rows**), function-wide fail-closed where it is empty (**421**). The 185 is a
   subset. Recorded because it is a widening of the ruling's letter in service of its worked
   example.
3. **`predicate` IS UNTOUCHED.** The branch reads are a NEW column (`branchReads`) and no
   predicate row moved; `resolvedWithPredicate` and `clean` stay at 185. See 0e.5 for what
   moving them would have cost.
4. **THE LAWFUL LIMB IS MEASURED, NOT PROVED** (0e.6), and the two coarsenesses are printed
   with their integers.
5. **THE `--check` RATE HALF.** The fourth tier is derived from the rate half the JSON carries,
   so a build with no rate half has three tiers and says so by their absence rather than by a
   zero. `--check` is green because the committed rate half is carried through verbatim.

