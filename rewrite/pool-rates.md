# POOL RATES — the whole resolved corpus, the 227 measured and the 134 that were not

Seat: Opus MEASURER, 2026-09-13. READ-ONLY against the DEF-2 dock `laneRW-DEF2` @ `49183bafe`
(`git status --porcelain` = 0 lines at the read). Nothing was written, staged or committed in
the dock; this file is the only thing this seat wrote inside the kit.

## HOW EVERY FIGURE HERE WAS COMPUTED

`rateBp` is **not** re-derived here. It is the shipped instrument's own figure:
`scripts/prose-rate-corpus.mjs` builds the 768-town RATE grid (threat 4 x route 8 x tier 6 =
192 cells x 4 seeds), composes each town through the SHIPPED desk-read recipes (`deskReturns`),
walks every return for `{blockId, poolKey}` provenance, and `rateTable()` counts each
(block, pool) key ONCE PER TOWN. `rateBp = Math.round(k / 768 * 10000)` — that is
`wilsonBp().rateBp` in `scripts/wiring-census.mjs`. The census gets the column by folding such
a run in with `--rates`; a pool with no row in the run is left `rateBp: null`, which is why a
third of the corpus reads blank. **Null in the census means the pool fired on ZERO towns.**

### THE REPRODUCTION CHECK — PASSED, EXACTLY

The census's `rate` block is not a figure of the dock tip: `git log` on
`docs/content/wiring-census.json` shows `rate.rows` byte-identical across every commit back to
`3e2a644ec` (2026-09-08, "MEASURE car 3") — the fold has been carried forward unchanged through
every later re-take. So the check was run at THAT tree (`git archive 3e2a644ec` into a scratch
directory, the dock's `node_modules` symlinked, nothing in the dock touched):

```
node scripts/prose-rate-corpus.mjs --no-wizard --out rate-repro-0908.json   # at 3e2a644ec
  271 rows against the census's 271 — keys present on only one side: 0 and 0
  rateBp mismatches: 0 · towns mismatches: 0 · byTier mismatches: 0
  bareSentences 21159 = 21159 · tierSilences 352 = 352 · pairs 729 = 729
```

Every one of the 271 known values reproduces exactly, per-tier halves included. The instrument
is also deterministic: two runs at the dock tip agree on all 273 rows, zero differences.

⚠ **AND THE CENSUS COLUMN IS STALE.** Re-run at the dock tip `49183bafe`, the same instrument
returns **273** fired pools rather than 271, and **62 of the 271** shared rows have moved (all
small — 1 to 3 towns — except `DS-POW-5 :: mixed`, 263 → 240 towns). Two pools that were dark
now fire: `DS-POW-4 :: riskLabel: Stable (no challengers)` (86 towns, 1120 bp) and
`DS-POW-6 :: capture reached a LEADER` (1 town, 13 bp). **The table below is the DOCK TIP run**,
so it is one instrument at one tree rather than two halves at two trees; the census's own 09-08
figure is printed beside it wherever the two differ.

## THE THREE BANDS, OVER THE WHOLE RESOLVED CORPUS (361 pools)

Exposure share = a pool's `rateBp` as a share of the sum of `rateBp` over all 361 resolved pools
(574,100 bp, i.e. 57.41 pool-firings on the average town). It is EXPECTED IMPRESSIONS and not
page area: a pool that fires on every town counts 10,000 whether the reader dwells on it or not.

| band | pools | share of pools | exposure (sum bp) | share of exposure |
| --- | ---: | ---: | ---: | ---: |
| under 5 % (rateBp < 500) | 168 | 46.5 % | 6,976 | 1.22 % |
| 5 – 15 % (500 – 1499 bp) | 64 | 17.7 % | 71,572 | 12.47 % |
| 15 % and over (>= 1500 bp) | 129 | 35.7 % | 495,552 | 86.32 % |

The long tail is **46.5 % of the writable corpus carrying 1.22 % of what a reader meets**, while
129 pools carry 86.3 %. Inside the under-5 % band, 132 pools fire on ZERO towns and 36 fire on 1
to 38 towns — the whole 6,976 bp of that band is carried by those 36.

The same bands read on the census's own 227 measured rows at the 09-08 figures — 1.22 % / 12.28 %
/ 86.49 % — so the shape is not an artefact of the re-run.

## THE 132 POOLS THAT FIRE ON ZERO TOWNS — THREE DIFFERENT THINGS

A zero is not a zero. Classified by the census's own RUNG rule (a pool's rung is its
`block :: keyFunction`, the ladder that produced its key — the rule `tierSilences` already uses):

### UNREACHABLE — 76 pools in 12 blocks the corpus cannot reach at all

The block fires on no town because the RATE corpus generates **world-less** settlements
(`generateSettlementPipeline(config, null, …)`), so the fact the site reads does not exist. A
probe over all 768 towns confirms each reason below, and the product agrees with itself: the
shipped test `tests/property/dossierProseManifest.test.js` carries a roster
`MOUNTS_THE_CORPUS_DOES_NOT_REACH` naming exactly these blocks, re-derived against the census
on every run.

| block | pools | why the corpus cannot reach it |
| --- | ---: | --- |
| DS-DEF-4 | 9 | no `criminalStructure` on any of the 768 (its derivation is owner-gated) |
| DS-ECO-3 | 1 | reads `flowDrift`, which EconomicsTab derives from the OWNING CAMPAIGN's worldState |
| DS-FTH-1 | 8 | `faithPanelModel(s)` returns no patron, no ranks and no piety on any of the 768 |
| DS-FTH-3 | 2 | `faithPanelModel(s)` returns no patron, no ranks and no piety on any of the 768 |
| DS-GEN-8 | 4 | no `settlement.steadings` on any of the 768 |
| DS-POP-3 | 5 | no `populationTrend` reading exists on any of the 768 |
| DS-POW-3 | 5 | its entry point is `powerLadderRung`, which PowerTab calls and `powerStateProse` does not, so the desk-read sequence never reaches it |
| DS-REL-1 | 4 | no `settlement.neighbours` on any of the 768; the recipe takes no `neighbours` or `crossEngagements` reading either |
| DS-STR-2 | 22 | the recipe passes `worldStressor: null` by construction |
| DS-WAR-1 | 11 | no `settlement.war` on any of the 768 |
| DS-WAR-2 | 4 | no `settlement.war` on any of the 768 |
| DS-WAR-3 | 1 | no `settlement.war` on any of the 768 |

**These pools have no measured rate at all.** 0/768 here is a statement about the corpus and
not about the product: a reader generating a settlement inside a realm may well meet them, and
this measurement cannot say how often.

### RUNG DARK — 29 pools whose own key function never produced a key

The BLOCK speaks on this corpus, but this rung never did. Read it as a value class the shipped
generator does not reach, on a surface that is otherwise live:

| rung | pools |
| --- | ---: |
| `DS-STR-1 :: CRISIS_POOL_OF` | 15 |
| `DS-ECO-2 :: granaryPoolKey` | 4 |
| `DS-CND-1 :: conditionArchetypePoolKey` | 3 |
| `DS-CND-1 :: conditionProvenancePoolKey` | 2 |
| `DS-ECO-9 :: foodSecurityPoolKey` | 2 |
| `DS-POW-2 :: governingSharePoolKey` | 2 |
| `DS-CND-1 :: conditionDurationPoolKey` | 1 |

The largest is `DS-STR-1 :: CRISIS_POOL_OF` — the crisis vocabulary (UNDER SIEGE, FAMINE, UNDER
OCCUPATION, POLITICALLY FRACTURED …). Stressors exist on 235 of the 768 towns, and not one of
them came up as a crisis token.

### SILENT — 27 pools whose rung RAN and chose another value class every time

This is a true 0 of 768 and reads exactly like the tier-grain `LAWFUL` verdict one level up:
some other pool of the same rung fired, so the ladder was live and this value never occurred.
The five largest sit on `DS-GEN-7 :: COHERENCE_POOL_OF` (5), `DS-GEN-3 :: PROSPERITY_POOL_OF`
(2), `DS-DEF-6 :: navalDefensePoolKey` (2), `DS-SUP-3 :: serviceCatalogPoolKey` (2) and
`DS-CND-1` (2, across two rungs); the rest are singletons.

## THE TEN LOWEST-RATE POOLS THAT FIRE AT ALL

(The 132 zeros above are lower still; these are the floor of the measured set.)

| rateBp | towns | block | pool |
| ---: | ---: | --- | --- |
| 13 | 1/768 | DS-POW-6 | capture reached a LEADER |
| 13 | 1/768 | DS-POW-6 | capture pressure RECOVERING (strong security, prosperity) |
| 13 | 1/768 | DS-DEF-11 | WALLED-QUIET |
| 26 | 2/768 | DS-POW-6 | neutral baseline (nothing pulling either way) |
| 26 | 2/768 | DS-DEF-3 | Safe |
| 52 | 4/768 | DS-SUP-3 | SEVERAL EXPECTED CATEGORIES MISSING |
| 65 | 5/768 | DS-GEN-7 | stress_economic: siege against trade income |
| 65 | 5/768 | DS-DEF-9 | magicDependency true, with a NAMED dependent chain |
| 91 | 7/768 | DS-GEN-3 | safetyProfile.safetyLabel: head word in {Secure, Controlled, Quarantined} |
| 104 | 8/768 | DS-DEF-9 | magicDependency true |

## THE TABLE — every resolved pool, rate descending

`tiers` names the tiers the pool fired on at all (128 towns per tier). `09-08` carries the
census's folded figure where it differs from the tip, and `new` where the census had none.
`note` is the zero classification above.

| # | block | pool | rateBp | towns | tiers | 09-08 | note |
| ---: | --- | --- | ---: | ---: | --- | ---: | --- |
| 1 | DS-ECO-11 | ECONOMIC STRENGTHS: the roster is populated | 10000 | 768 | all six |  |  |
| 2 | DS-ECO-11 | STRATEGIC VALUE: the generator's assessment, framed | 10000 | 768 | all six |  |  |
| 3 | DS-FTH-2 | PRIVATE DOSSIER | 10000 | 768 | all six |  |  |
| 4 | DS-DEF-3 | First-Survey qualification (the reading is a first look) | 9935 | 763 | all six |  |  |
| 5 | DS-POW-2 | recentConflict present | 9935 | 763 | all six |  |  |
| 6 | DS-POW-7 | layer DORMANT (no ledger materialized) | 9935 | 763 | all six |  |  |
| 7 | DS-REL-2 | flagDriven count zero | 9935 | 763 | all six |  |  |
| 8 | DS-DEF-9 | magicDependency false | 9831 | 755 | all six |  |  |
| 9 | DS-ECO-2 | FOOD: deficit | 9596 | 737 | all six | 9570 |  |
| 10 | DS-GEN-14 | FOUNDED-OLD | 8945 | 687 | all six |  |  |
| 11 | DS-GEN-11 | viable: true: the arithmetic closes | 7943 | 610 | all six |  |  |
| 12 | DS-GEN-11 | criticalIssueCount zero | 7878 | 605 | all six |  |  |
| 13 | DS-GEN-3 | economicViability.viable: true | 7878 | 605 | all six |  |  |
| 14 | DS-SUP-3 | COMPLETE FOR ITS TIER | 7721 | 593 | thorp · hamlet · village · town · city |  |  |
| 15 | DS-ECO-12 | TRADE PROFILE: exports and imports both present | 6888 | 529 | all six |  |  |
| 16 | DS-GEN-16 | LAYERED-ANCHORED | 6667 | 512 | all six |  |  |
| 17 | DS-DEF-5 | walls PRESENT | 6654 | 511 | all six | 6641 |  |
| 18 | DS-DEF-3 | Moderate | 6602 | 507 | all six |  |  |
| 19 | DS-DEF-5 | arcane defense ABSENT | 6003 | 461 | all six |  |  |
| 20 | DS-REL-2 | prominentRelationship present | 6003 | 461 | all six |  |  |
| 21 | DS-DEF-11 | WALLED-STRAINED | 5938 | 456 | all six | 5924 |  |
| 22 | DS-POW-2 | stable matched | 5612 | 431 | all six |  |  |
| 23 | DS-GEN-3 | scores.military: STRONG | 5469 | 420 | hamlet · village · town · city · metropolis |  |  |
| 24 | DS-ECO-10 | POSTURE: established | 5195 | 399 | all six |  |  |
| 25 | DS-POW-4 | legitimacyHold: public rejection is breaking the hold | 5195 | 399 | all six |  |  |
| 26 | DS-DEF-5 | charter hall PRESENT (specialist monster response) | 5169 | 397 | hamlet · village · town · city · metropolis |  |  |
| 27 | DS-ECO-6 | TIER: minor shadow activity (≥3) | 5169 | 397 | all six |  |  |
| 28 | DS-DEF-2 | Internal Security: no legal infrastructure | 5000 | 384 | thorp · hamlet · village |  |  |
| 29 | DS-ECO-12 | INCOME MIX: one source carries the town | 4753 | 365 | thorp · hamlet · village · metropolis |  |  |
| 30 | DS-ECO-12 | INCOME MIX: two or three sources between them | 4727 | 363 | village · town · city · metropolis |  |  |
| 31 | DS-DEF-2 | Disasters & Famine: NO reserves, NO medical provision | 4596 | 353 | thorp · hamlet · village |  |  |
| 32 | DS-GEN-3 | scores.monster: STRONG | 4518 | 347 | village · town · city · metropolis | 4479 |  |
| 33 | DS-DEF-2 | Economic Survival: STRONG | 4388 | 337 | town · city · metropolis | 4427 |  |
| 34 | DS-GEN-3 | scores.economic: STRONG | 4336 | 333 | town · city · metropolis | 4375 |  |
| 35 | DS-GEN-6 | road | 4284 | 329 | all six |  |  |
| 36 | DS-DEF-1 | terrain FAVOURABLE to the defender | 4258 | 327 | all six |  |  |
| 37 | DS-DEF-6 | Logistics & Supply: No reserves, landlocked | 4219 | 324 | thorp · hamlet · village |  |  |
| 38 | DS-GEN-18 | STALLED | 4219 | 324 | hamlet · village · town · city · metropolis |  |  |
| 39 | DS-ECO-1 | COMBINATION C3: the middle rungs | 4180 | 321 | all six | 4167 |  |
| 40 | DS-GEN-3 | prosperity: Struggling / Poor | 4180 | 321 | all six |  |  |
| 41 | DS-DEF-5 | garrison PRESENT | 4154 | 319 | town · city · metropolis | 4115 |  |
| 42 | DS-GEN-3 | prosperity: Comfortable / Prosperous | 4089 | 314 | all six | 4076 |  |
| 43 | DS-GEN-3 | scores.magical: CRITICAL | 4089 | 314 | thorp · hamlet · village |  |  |
| 44 | DS-GEN-3 | scores.internal: WEAK | 4076 | 313 | all six | 4089 |  |
| 45 | DS-DEF-2 | Invasion & War: walls AND professional garrison | 4036 | 310 | town · city · metropolis | 3984 |  |
| 46 | DS-POW-4 | riskLabel: Holding | 4036 | 310 | all six | 4297 |  |
| 47 | DS-GEN-3 | foodSecurity.label: Import-Dependent | 3971 | 305 | all six |  |  |
| 48 | DS-DEF-2 | Internal Security: full legal chain (court AND prison) | 3958 | 304 | town · city · metropolis | 3932 |  |
| 49 | DS-DEF-5 | arcane defense PRESENT | 3945 | 303 | hamlet · village · town · city · metropolis |  |  |
| 50 | DS-GEN-17 | ADMINISTERED | 3932 | 302 | town · city · metropolis |  |  |
| 51 | DS-GEN-9 | recency framing: Last century | 3633 | 279 | all six |  |  |
| 52 | DS-GEN-13 | MARKET-OPEN | 3607 | 277 | hamlet · village · town · city · metropolis |  |  |
| 53 | DS-DEF-2 | Disasters & Famine: granary AND hospital | 3581 | 275 | town · city · metropolis | 3542 |  |
| 54 | DS-GEN-9 | recency framing: Living memory | 3542 | 272 | all six | 3555 |  |
| 55 | DS-DEF-2 | Economic Survival: WEAK | 3385 | 260 | thorp · hamlet · village · town · city | 3372 |  |
| 56 | DS-GEN-3 | scores.economic: WEAK | 3372 | 259 | thorp · hamlet · village · town · city |  |  |
| 57 | DS-DEF-5 | walls ABSENT | 3346 | 257 | thorp · hamlet · village · town | 3359 |  |
| 58 | DS-GEN-3 | scores.monster: CRITICAL | 3320 | 255 | thorp · hamlet · village · town |  |  |
| 59 | DS-GEN-6 | tier overlay: other tiers | 3320 | 255 | village · town |  |  |
| 60 | DS-GEN-6 | tier overlay: thorp / hamlet | 3320 | 255 | thorp · hamlet |  |  |
| 61 | DS-GEN-18 | BOUGHT-IN | 3294 | 253 | all six |  |  |
| 62 | DS-GEN-3 | defenseProfile.readiness.label: Well-Defended | 3216 | 247 | town · city · metropolis |  |  |
| 63 | DS-DEF-5 | NO organized force at all | 3203 | 246 | thorp · hamlet · village |  |  |
| 64 | DS-GEN-13 | NO-MARKET | 3203 | 246 | thorp · hamlet · village |  |  |
| 65 | DS-GEN-3 | scores.internal: ADEQUATE | 3177 | 244 | town · city · metropolis | 3190 |  |
| 66 | DS-DEF-1 | readiness WEAK | 3086 | 237 | thorp · hamlet · village · town · city | 3099 |  |
| 67 | DS-GEN-3 | scores.magical: ADEQUATE | 3047 | 234 | hamlet · village · town · city · metropolis |  |  |
| 68 | DS-GEN-5 | ordinary (route road and the default) | 3047 | 234 | all six |  |  |
| 69 | DS-DEF-8 | override active (generic framing) | 3021 | 232 | all six |  |  |
| 70 | DS-GEN-17 | BARE | 3021 | 232 | thorp · hamlet · village |  |  |
| 71 | DS-DEF-11 | UNWALLED-SMALL | 3008 | 231 | thorp · hamlet · village |  |  |
| 72 | DS-DEF-6 | Logistics & Supply: Granary with road supply | 2969 | 228 | town · city · metropolis |  |  |
| 73 | DS-DEF-1 | strategic value HIGH | 2852 | 219 | all six |  |  |
| 74 | DS-DEF-3 | COMPOUND override (a crisis stress has rewritten the label) | 2852 | 219 | all six |  |  |
| 75 | DS-GEN-12 | WATER-EDGE | 2852 | 219 | all six |  |  |
| 76 | DS-DEF-2 | Invasion & War: neither walls nor force | 2839 | 218 | thorp · hamlet · village · town |  |  |
| 77 | DS-GEN-12 | HIGH-GROUND | 2839 | 218 | all six |  |  |
| 78 | DS-DEF-1 | terrain EXPOSED | 2826 | 217 | all six |  |  |
| 79 | DS-GEN-2 | intensity: low | 2721 | 209 | all six | 2578 |  |
| 80 | DS-GEN-2 | intensity: moderate | 2721 | 209 | all six | 2773 |  |
| 81 | DS-DEF-5 | charter hall ABSENT where the country warrants one | 2669 | 205 | thorp · hamlet · village · town · city |  |  |
| 82 | DS-POW-4 | legitimacyHold: public backing hardens the hold | 2617 | 201 | hamlet · village · town · city · metropolis |  |  |
| 83 | DS-GEN-17 | GARRISONED | 2591 | 199 | hamlet · village · town · city · metropolis |  |  |
| 84 | DS-POW-4 | riskLabel: Contested | 2591 | 199 | all six | 2982 |  |
| 85 | DS-GEN-5 | smoke (route isolated / mountain_pass) | 2578 | 198 | all six |  |  |
| 86 | DS-DEF-1 | readiness ADEQUATE | 2565 | 197 | hamlet · village · town · city · metropolis | 2578 |  |
| 87 | DS-DEF-1 | readiness STRONG | 2513 | 193 | town · city · metropolis | 2487 |  |
| 88 | DS-ECO-1 | COMBINATION C4: a low rung on a working approach | 2513 | 193 | all six |  |  |
| 89 | DS-GEN-7 | structuralSuggestions[] | 2513 | 193 | all six | 2565 |  |
| 90 | DS-GEN-3 | foodSecurity.label: Pressured | 2383 | 183 | all six | 2409 |  |
| 91 | DS-CND-1 | DIRECTION: worsening | 2344 | 180 | all six |  |  |
| 92 | DS-DEF-2 | Beasts & Monsters: plagued, perimeter AND organized force | 2292 | 176 | hamlet · village · town · city · metropolis | 2253 |  |
| 93 | DS-GEN-3 | defenseProfile.readiness.label: Vulnerable | 2266 | 174 | thorp · hamlet · village · town |  |  |
| 94 | DS-ECO-11 | EXPLOITATION: fullyExploited | 2240 | 172 | all six |  |  |
| 95 | DS-POW-4 | riskLabel: Critical. The seat could fall | 2188 | 168 | all six | 2656 |  |
| 96 | DS-ECO-10 | POSTURE: none | 2122 | 163 | all six |  |  |
| 97 | DS-POW-4 | legitimacyHold: public opinion neither helps nor hurts | 2122 | 163 | all six |  |  |
| 98 | DS-DEF-8 | override active, viability intact | 2109 | 162 | all six |  |  |
| 99 | DS-GEN-3 | defenseProfile.readiness.label: Lightly Defended | 2109 | 162 | thorp · hamlet · village · town · city |  |  |
| 100 | DS-DEF-5 | mercenary / contracted forces PRESENT | 2083 | 160 | city · metropolis |  |  |
| 101 | DS-GEN-11 | criticalIssueCount: critical contradictions on the record | 2057 | 158 | all six |  |  |
| 102 | DS-GEN-11 | viable: false: the arithmetic does not close | 2057 | 158 | all six |  |  |
| 103 | DS-GEN-3 | economicViability.viable: false | 2057 | 158 | all six |  |  |
| 104 | DS-GEN-3 | scores.magical: WEAK | 1953 | 150 | hamlet · village · town · city · metropolis |  |  |
| 105 | DS-POW-1 | governanceFractured true | 1953 | 150 | all six |  |  |
| 106 | DS-GEN-7 | structuralViolations[] | 1940 | 149 | all six | 1927 |  |
| 107 | DS-ECO-12 | TRADE PROFILE: no significant exports | 1914 | 147 | all six |  |  |
| 108 | DS-ECO-10 | POSTURE: entrepot | 1901 | 146 | all six |  |  |
| 109 | DS-DEF-1 | readiness CRITICAL | 1823 | 140 | thorp · hamlet · village |  |  |
| 110 | DS-GEN-3 | scores.internal: CRITICAL | 1745 | 134 | all six |  |  |
| 111 | DS-GEN-3 | foodSecurity.label: Secure | 1706 | 131 | all six | 1680 |  |
| 112 | DS-GEN-3 | scores.military: ADEQUATE | 1706 | 131 | all six |  |  |
| 113 | DS-ECO-1 | COMBINATION C5: a low rung on a narrow approach | 1693 | 130 | all six |  |  |
| 114 | DS-CND-1 | SEVERITY: high | 1667 | 128 | all six |  |  |
| 115 | DS-GEN-3 | prosperity: Moderate / Modest | 1667 | 128 | all six | 1680 |  |
| 116 | DS-GEN-6 | tier overlay: metropolis | 1667 | 128 | metropolis |  |  |
| 117 | DS-GEN-6 | tier overlay: city | 1641 | 126 | city |  |  |
| 118 | DS-POW-6 | capture pressure ADVANCING (weak security, poor prosperity) | 1628 | 125 | all six | 1615 |  |
| 119 | DS-GEN-5 | river | 1602 | 123 | all six |  |  |
| 120 | DS-DEF-2 | Invasion & War: walls with NO force | 1589 | 122 | thorp · hamlet · village · town | 1628 |  |
| 121 | DS-GEN-13 | MARKET-NARROW | 1576 | 121 | hamlet · village · town · city · metropolis |  |  |
| 122 | DS-DEF-2 | Beasts & Monsters: frontier, credible deterrence | 1563 | 120 | village · town · city · metropolis | 1549 |  |
| 123 | DS-GEN-3 | foodSecurity.label: Deficit | 1563 | 120 | all six |  |  |
| 124 | DS-GEN-13 | ENTREPOT | 1549 | 119 | hamlet · village · town · city · metropolis |  |  |
| 125 | DS-GEN-2 | intensity: high | 1549 | 119 | all six | 1523 |  |
| 126 | DS-GEN-3 | scores.military: CRITICAL | 1549 | 119 | thorp · hamlet · village · town |  |  |
| 127 | DS-DEF-2 | Beasts & Monsters: settled, defenses beyond the need | 1536 | 118 | thorp · village · town · city · metropolis |  |  |
| 128 | DS-SUP-3 | ONE EXPECTED CATEGORY MISSING | 1523 | 117 | town · city · metropolis |  |  |
| 129 | DS-DEF-2 | Beasts & Monsters: settled, nothing organized | 1510 | 116 | thorp · hamlet · village · town |  |  |
| 130 | DS-GEN-16 | ANCHORED-RECENT | 1484 | 114 | all six |  |  |
| 131 | DS-GEN-6 | port | 1471 | 113 | all six |  |  |
| 132 | DS-DEF-1 | strategic value LOW | 1432 | 110 | all six |  |  |
| 133 | DS-ECO-11 | TERRAIN: Coastal | 1432 | 110 | all six |  |  |
| 134 | DS-ECO-11 | TERRAIN: Forest | 1432 | 110 | all six |  |  |
| 135 | DS-ECO-11 | TERRAIN: Hills | 1432 | 110 | all six |  |  |
| 136 | DS-ECO-11 | TERRAIN: Plains | 1432 | 110 | all six |  |  |
| 137 | DS-ECO-11 | TERRAIN: River | 1432 | 110 | all six |  |  |
| 138 | DS-GEN-12 | OPEN-GROUND | 1432 | 110 | all six |  |  |
| 139 | DS-GEN-12 | WOODLAND | 1432 | 110 | all six |  |  |
| 140 | DS-DEF-2 | Disasters & Famine: granary AND parish care only | 1419 | 109 | town · city · metropolis | 1458 |  |
| 141 | DS-ECO-11 | TERRAIN: Desert | 1419 | 109 | all six |  |  |
| 142 | DS-ECO-11 | TERRAIN: Mountains | 1419 | 109 | all six |  |  |
| 143 | DS-GEN-5 | market (route crossroads) | 1419 | 109 | all six |  |  |
| 144 | DS-GEN-6 | crossroads | 1419 | 109 | all six |  |  |
| 145 | DS-GEN-6 | river | 1419 | 109 | all six |  |  |
| 146 | DS-GEN-12 | DRY-GROUND | 1393 | 107 | all six |  |  |
| 147 | DS-DEF-5 | militia PRESENT (no garrison) | 1380 | 106 | hamlet · village |  |  |
| 148 | DS-SUP-3 | A CATEGORY PRESENT BUT ITS CHAIN IMPAIRED | 1380 | 106 | hamlet · village · town · city · metropolis |  |  |
| 149 | DS-DEF-6 | Naval Defense: Port only | 1367 | 105 | town · city · metropolis |  |  |
| 150 | DS-GEN-3 | safetyProfile.safetyLabel: head word in {Tense, Strained, Restricted, Unsafe} | 1367 | 105 | all six |  |  |
| 151 | DS-DEF-6 | Logistics & Supply: Granary + port | 1354 | 104 | town · city · metropolis |  |  |
| 152 | DS-ECO-1 | COMBINATION C1: a high rung on a working approach | 1354 | 104 | hamlet · village · town · city · metropolis | 1367 |  |
| 153 | DS-GEN-6 | isolated | 1341 | 103 | all six |  |  |
| 154 | DS-GEN-9 | recency framing: Ancient | 1328 | 102 | all six | 1315 |  |
| 155 | DS-POW-6 | operation role criminal revenue stream (unclassified) | 1315 | 101 | town · city · metropolis |  |  |
| 156 | DS-ECO-11 | EXPLOITATION: unexploited, exportValue: medium or low | 1302 | 100 | all six |  |  |
| 157 | DS-DEF-2 | Economic Survival: ADEQUATE | 1289 | 99 | hamlet · village · town · city · metropolis | 1250 |  |
| 158 | DS-GEN-3 | scores.economic: ADEQUATE | 1289 | 99 | hamlet · village · town · city · metropolis | 1250 |  |
| 159 | DS-GEN-5 | port | 1289 | 99 | all six |  |  |
| 160 | DS-GEN-3 | safetyProfile.safetyLabel: head word in {Dangerous, Desperate} | 1250 | 96 | all six |  |  |
| 161 | DS-GEN-9 | recency framing: Recent | 1224 | 94 | all six |  |  |
| 162 | DS-GEN-3 | scores.military: WEAK | 1211 | 93 | thorp · hamlet · village · town |  |  |
| 163 | DS-ECO-11 | EXPLOITATION: partiallyExploited | 1172 | 90 | all six |  |  |
| 164 | DS-GEN-3 | defenseProfile.readiness.label: Defensible | 1159 | 89 | hamlet · village · town · city · metropolis |  |  |
| 165 | DS-GEN-3 | scores.monster: WEAK | 1133 | 87 | thorp · hamlet · village · town |  |  |
| 166 | DS-POW-4 | riskLabel: Stable (no challengers) | 1120 | 86 | thorp · hamlet | new |  |
| 167 | DS-POW-5 | autocrat | 1081 | 83 | all six |  |  |
| 168 | DS-DEF-2 | Internal Security: court without detention | 1042 | 80 | town · city · metropolis |  |  |
| 169 | DS-DEF-2 | Invasion & War: walls with citizen militia | 1029 | 79 | hamlet · village |  |  |
| 170 | DS-GEN-14 | FOUNDED-YOUNG | 990 | 76 | thorp · hamlet · village · town |  |  |
| 171 | DS-GEN-3 | scores.monster: ADEQUATE | 964 | 74 | hamlet · village · town · city · metropolis | 1003 |  |
| 172 | DS-DEF-8 | override active, viability threatened | 951 | 73 | all six |  |  |
| 173 | DS-DEF-2 | Economic Survival: CRITICAL | 938 | 72 | thorp · hamlet · village |  |  |
| 174 | DS-ECO-12 | INCOME MIX: a criminal line is present | 938 | 72 | hamlet · village · town · city · metropolis |  |  |
| 175 | DS-GEN-3 | scores.economic: CRITICAL | 938 | 72 | thorp · hamlet · village |  |  |
| 176 | DS-GEN-3 | scores.internal: STRONG | 938 | 72 | town · city · metropolis | 911 |  |
| 177 | DS-GEN-18 | UNWORKED | 859 | 66 | thorp · hamlet · village · town |  |  |
| 178 | DS-GEN-3 | scores.magical: STRONG | 846 | 65 | city · metropolis |  |  |
| 179 | DS-DEF-5 | watch PRESENT | 794 | 61 | town | 833 |  |
| 180 | DS-GEN-16 | ANCHORED-OLD | 794 | 61 | all six |  |  |
| 181 | DS-DEF-6 | Logistics & Supply: No reserves, port open | 768 | 59 | thorp · hamlet · village |  |  |
| 182 | DS-GEN-3 | defenseProfile.readiness.label: Fortress | 768 | 59 | town · city · metropolis |  |  |
| 183 | DS-CND-1 | SEVERITY: critical | 729 | 56 | all six |  |  |
| 184 | DS-SUP-3 | A METROPOLIS-TIER CATALOG, COMPLETE | 703 | 54 | metropolis |  |  |
| 185 | DS-ECO-12 | TRADE PROFILE: local production listed | 690 | 53 | thorp |  |  |
| 186 | DS-GEN-16 | UNMARKED | 677 | 52 | thorp · hamlet · village · town · city |  |  |
| 187 | DS-CND-1 | SEVERITY: medium | 664 | 51 | all six |  |  |
| 188 | DS-DEF-11 | WALLED-THREATENED | 638 | 49 | hamlet · village · town |  |  |
| 189 | DS-DEF-6 | Logistics & Supply: Granary in isolation | 625 | 48 | town · city · metropolis |  |  |
| 190 | DS-ECO-10 | POSTURE: vulnerable | 625 | 48 | town · city · metropolis |  |  |
| 191 | DS-ECO-6 | TIER: significant off-book activity (≥15) | 573 | 44 | hamlet · town · city · metropolis |  |  |
| 192 | DS-DEF-2 | Beasts & Monsters: plagued, perimeter but NO force to hold it | 547 | 42 | thorp · town | 586 |  |
| 193 | DS-ECO-12 | INCOME MIX: a broad spread, no leader | 521 | 40 | town · city · metropolis |  |  |
| 194 | DS-ECO-11 | EXPLOITATION: unexploited, exportValue: high | 417 | 32 | thorp · hamlet · village · city · metropolis |  |  |
| 195 | DS-GEN-3 | defenseProfile.readiness.label: Undefended | 417 | 32 | thorp · hamlet · village |  |  |
| 196 | DS-DEF-2 | Disasters & Famine: NO reserves, hospital present | 404 | 31 | village |  |  |
| 197 | DS-DEF-2 | Invasion & War: militia only | 352 | 27 | hamlet · village |  |  |
| 198 | DS-DEF-11 | UNWALLED-LARGE | 339 | 26 | town | 352 |  |
| 199 | DS-POW-2 | unstable matched | 339 | 26 | all six |  |  |
| 200 | DS-DEF-3 | Dangerous | 313 | 24 | thorp · hamlet · village |  |  |
| 201 | DS-GEN-3 | foodSecurity.label: Deficit × Active Famine | 313 | 24 | thorp · hamlet · village · city · metropolis |  |  |
| 202 | DS-ECO-12 | TRADE PROFILE: isEntrepot, transit goods marked among the exports | 299 | 23 | all six |  |  |
| 203 | DS-POW-2 | Desperate matched | 286 | 22 | thorp · hamlet · village · city · metropolis |  |  |
| 204 | DS-DEF-2 | Beasts & Monsters: frontier, force without a perimeter | 273 | 21 | hamlet · village · town | 286 |  |
| 205 | DS-ECO-2 | FOOD: surplus | 273 | 21 | thorp · hamlet · village · town | 286 |  |
| 206 | DS-ECO-1 | COMBINATION C2: a high rung on a narrow approach (isolated / mountain_pass) | 234 | 18 | town · city · metropolis |  |  |
| 207 | DS-GEN-16 | RECORDED-UNANCHORED | 221 | 17 | all six |  |  |
| 208 | DS-ECO-12 | TRADE PROFILE: imports only, nothing outward | 208 | 16 | thorp · hamlet · village · town |  |  |
| 209 | DS-GEN-17 | LETTERED | 208 | 16 | hamlet · village |  |  |
| 210 | DS-ECO-12 | INCOME MIX: the criminal line leads | 195 | 15 | town · city · metropolis |  |  |
| 211 | DS-POW-6 | capture reached an AGENT of a faction | 195 | 15 | town · city · metropolis |  |  |
| 212 | DS-GEN-17 | PROVISIONED | 182 | 14 | village |  |  |
| 213 | DS-POW-2 | siege matched | 182 | 14 | all six |  |  |
| 214 | DS-DEF-2 | Invasion & War: force with NO walls | 156 | 12 | town | 169 |  |
| 215 | DS-ECO-10 | POSTURE: limited | 156 | 12 | thorp · hamlet · village |  |  |
| 216 | DS-ECO-6 | TIER: a large share off the books (≥30) | 156 | 12 | city · metropolis |  |  |
| 217 | DS-DEF-3 | Unsafe | 143 | 11 | thorp · hamlet · village · city |  |  |
| 218 | DS-ECO-2 | FOOD: balanced | 130 | 10 | thorp · village · town · metropolis | 143 |  |
| 219 | DS-GEN-9 | recency framing: Deep history | 117 | 9 | thorp · village · city · metropolis |  |  |
| 220 | DS-DEF-9 | magicDependency true | 104 | 8 | village · town · city · metropolis |  |  |
| 221 | DS-GEN-3 | safetyProfile.safetyLabel: head word in {Secure, Controlled, Quarantined} | 91 | 7 | thorp · village · town · city · metropolis |  |  |
| 222 | DS-DEF-9 | magicDependency true, with a NAMED dependent chain | 65 | 5 | city · metropolis |  |  |
| 223 | DS-GEN-7 | stress_economic: siege against trade income | 65 | 5 | hamlet · village · town · city |  |  |
| 224 | DS-SUP-3 | SEVERAL EXPECTED CATEGORIES MISSING | 52 | 4 | city |  |  |
| 225 | DS-DEF-3 | Safe | 26 | 2 | town |  |  |
| 226 | DS-POW-6 | neutral baseline (nothing pulling either way) | 26 | 2 | village |  |  |
| 227 | DS-DEF-11 | WALLED-QUIET | 13 | 1 | town |  |  |
| 228 | DS-POW-6 | capture pressure RECOVERING (strong security, prosperity) | 13 | 1 | town |  |  |
| 229 | DS-POW-6 | capture reached a LEADER | 13 | 1 | hamlet | new |  |
| 230 | DS-CND-1 | ARCHETYPE: boom | 0 | 0 | — |  | RUNG DARK |
| 231 | DS-CND-1 | ARCHETYPE: flourishing | 0 | 0 | — |  | RUNG DARK |
| 232 | DS-CND-1 | ARCHETYPE: reconstruction | 0 | 0 | — |  | RUNG DARK |
| 233 | DS-CND-1 | DIRECTION: easing | 0 | 0 | — |  | SILENT |
| 234 | DS-CND-1 | DURATION: inside the expiry wind-down window | 0 | 0 | — |  | RUNG DARK |
| 235 | DS-CND-1 | PROVENANCE: causes[] or triggeredAt.sourceEventType populated | 0 | 0 | — |  | RUNG DARK |
| 236 | DS-CND-1 | PROVENANCE: no causes[] and no sourceEventType | 0 | 0 | — |  | RUNG DARK |
| 237 | DS-CND-1 | SEVERITY: low | 0 | 0 | — |  | SILENT |
| 238 | DS-DEF-2 | Beasts & Monsters: plagued, NO perimeter and NO force | 0 | 0 | — |  | SILENT |
| 239 | DS-DEF-2 | Disasters & Famine: granary, NO medical provision | 0 | 0 | — |  | SILENT |
| 240 | DS-DEF-2 | Internal Security: detention without process | 0 | 0 | — |  | SILENT |
| 241 | DS-DEF-3 | Very Safe | 0 | 0 | — |  | SILENT |
| 242 | DS-DEF-4 | capture adversarial | 0 | 0 | — |  | UNREACHABLE |
| 243 | DS-DEF-4 | capture capture | 0 | 0 | — |  | UNREACHABLE |
| 244 | DS-DEF-4 | capture corrupted | 0 | 0 | — |  | UNREACHABLE |
| 245 | DS-DEF-4 | capture equilibrium | 0 | 0 | — |  | UNREACHABLE |
| 246 | DS-DEF-4 | capture none | 0 | 0 | — |  | UNREACHABLE |
| 247 | DS-DEF-4 | structure diffuse | 0 | 0 | — |  | UNREACHABLE |
| 248 | DS-DEF-4 | structure null (nothing organized recognized) | 0 | 0 | — |  | UNREACHABLE |
| 249 | DS-DEF-4 | structure organized | 0 | 0 | — |  | UNREACHABLE |
| 250 | DS-DEF-4 | structure semi-organized | 0 | 0 | — |  | UNREACHABLE |
| 251 | DS-DEF-6 | Naval Defense: Naval force | 0 | 0 | — |  | SILENT |
| 252 | DS-DEF-6 | Naval Defense: Under blockade | 0 | 0 | — |  | SILENT |
| 253 | DS-ECO-10 | POSTURE: import_dependent | 0 | 0 | — |  | SILENT |
| 254 | DS-ECO-11 | ECONOMIC STRENGTHS: none recorded | 0 | 0 | — |  | SILENT |
| 255 | DS-ECO-2 | GRANARY: nearly empty | 0 | 0 | — |  | RUNG DARK |
| 256 | DS-ECO-2 | GRANARY: stocked | 0 | 0 | — |  | RUNG DARK |
| 257 | DS-ECO-2 | GRANARY: thin | 0 | 0 | — |  | RUNG DARK |
| 258 | DS-ECO-2 | GRANARY: well stocked | 0 | 0 | — |  | RUNG DARK |
| 259 | DS-ECO-3 | ADEQUATE | 0 | 0 | — |  | UNREACHABLE |
| 260 | DS-ECO-9 | BLOCKADE BYPASSED | 0 | 0 | — |  | RUNG DARK |
| 261 | DS-ECO-9 | BLOCKADED | 0 | 0 | — |  | RUNG DARK |
| 262 | DS-FTH-1 | MANDATE: a dominant church | 0 | 0 | — |  | UNREACHABLE |
| 263 | DS-FTH-1 | MANDATE: a measure of divine mandate | 0 | 0 | — |  | UNREACHABLE |
| 264 | DS-FTH-1 | MANDATE: contested, or patron security below the floor | 0 | 0 | — |  | UNREACHABLE |
| 265 | DS-FTH-1 | SINK: unaffiliated present, arc falling | 0 | 0 | — |  | UNREACHABLE |
| 266 | DS-FTH-1 | SINK: unaffiliated present, arc rising | 0 | 0 | — |  | UNREACHABLE |
| 267 | DS-FTH-1 | STANDINGS: a plural field, no majority | 0 | 0 | — |  | UNREACHABLE |
| 268 | DS-FTH-1 | STANDINGS: the patron dominant | 0 | 0 | — |  | UNREACHABLE |
| 269 | DS-FTH-1 | STANDINGS: the patron pressed by a near rival | 0 | 0 | — |  | UNREACHABLE |
| 270 | DS-FTH-3 | NICHE: every niche uncontested | 0 | 0 | — |  | UNREACHABLE |
| 271 | DS-FTH-3 | NICHE: the patron's niche carries a contestant | 0 | 0 | — |  | UNREACHABLE |
| 272 | DS-GEN-11 | the MARGINAL arm: neither verdict returned | 0 | 0 | — |  | SILENT |
| 273 | DS-GEN-14 | GROWN-UNRECORDED | 0 | 0 | — |  | SILENT |
| 274 | DS-GEN-18 | HOME-FED | 0 | 0 | — |  | SILENT |
| 275 | DS-GEN-3 | foodSecurity.label: Surplus | 0 | 0 | — |  | SILENT |
| 276 | DS-GEN-3 | prosperity: Poverty / Impoverished | 0 | 0 | — |  | SILENT |
| 277 | DS-GEN-3 | prosperity: Wealthy / Thriving | 0 | 0 | — |  | SILENT |
| 278 | DS-GEN-7 | historical_economic: the recovery narrative | 0 | 0 | — |  | SILENT |
| 279 | DS-GEN-7 | power_economic: criminal faction in a transit hub | 0 | 0 | — |  | SILENT |
| 280 | DS-GEN-7 | power_economic: powerful criminal faction in a prosperous settlement | 0 | 0 | — |  | SILENT |
| 281 | DS-GEN-7 | power_economic: temple economy under a secular seat | 0 | 0 | — |  | SILENT |
| 282 | DS-GEN-7 | power_stress: occupation against stated stability | 0 | 0 | — |  | SILENT |
| 283 | DS-GEN-8 | history.ancientRuin present | 0 | 0 | — |  | UNREACHABLE |
| 284 | DS-GEN-8 | steading row: charterPending | 0 | 0 | — |  | UNREACHABLE |
| 285 | DS-GEN-8 | steading row: organic | 0 | 0 | — |  | UNREACHABLE |
| 286 | DS-GEN-8 | steading row: provenance: 'forced' | 0 | 0 | — |  | UNREACHABLE |
| 287 | DS-POP-3 | FALLING-NARROW | 0 | 0 | — |  | UNREACHABLE |
| 288 | DS-POP-3 | FALLING-OPEN | 0 | 0 | — |  | UNREACHABLE |
| 289 | DS-POP-3 | LEVEL | 0 | 0 | — |  | UNREACHABLE |
| 290 | DS-POP-3 | RISING-NARROW | 0 | 0 | — |  | UNREACHABLE |
| 291 | DS-POP-3 | RISING-OPEN | 0 | 0 | — |  | UNREACHABLE |
| 292 | DS-POW-2 | critical matched | 0 | 0 | — |  | SILENT |
| 293 | DS-POW-2 | governing faction holds a DOMINANT share | 0 | 0 | — |  | RUNG DARK |
| 294 | DS-POW-2 | governing faction holds a NARROW plurality | 0 | 0 | — |  | RUNG DARK |
| 295 | DS-POW-3 | clear top rung, low instability | 0 | 0 | — |  | UNREACHABLE |
| 296 | DS-POW-3 | crowded top rung, low instability | 0 | 0 | — |  | UNREACHABLE |
| 297 | DS-POW-3 | high instability (churn at the top) | 0 | 0 | — |  | UNREACHABLE |
| 298 | DS-POW-3 | low instability, long-held order | 0 | 0 | — |  | UNREACHABLE |
| 299 | DS-POW-3 | shallow ladder (few rungs recorded) | 0 | 0 | — |  | UNREACHABLE |
| 300 | DS-POW-6 | present: false (no legitimacy reading) | 0 | 0 | — |  | SILENT |
| 301 | DS-POW-7 | an opposition bloc forms COVERT under an autarchy | 0 | 0 | — |  | SILENT |
| 302 | DS-REL-1 | client | 0 | 0 | — |  | UNREACHABLE |
| 303 | DS-REL-1 | cross-settlement NPC contacts | 0 | 0 | — |  | UNREACHABLE |
| 304 | DS-REL-1 | cross-settlement engagements | 0 | 0 | — |  | UNREACHABLE |
| 305 | DS-REL-1 | patron | 0 | 0 | — |  | UNREACHABLE |
| 306 | DS-REL-2 | flagDriven count > 0 | 0 | 0 | — |  | SILENT |
| 307 | DS-STR-1 | BEAST & RAIDER THREAT | 0 | 0 | — |  | RUNG DARK |
| 308 | DS-STR-1 | DISEASE OUTBREAK | 0 | 0 | — |  | RUNG DARK |
| 309 | DS-STR-1 | FAMINE | 0 | 0 | — |  | RUNG DARK |
| 310 | DS-STR-1 | INDEBTED TO AN OUTSIDE POWER | 0 | 0 | — |  | RUNG DARK |
| 311 | DS-STR-1 | INFILTRATED | 0 | 0 | — |  | RUNG DARK |
| 312 | DS-STR-1 | INSURGENCY | 0 | 0 | — |  | RUNG DARK |
| 313 | DS-STR-1 | MASS MIGRATION | 0 | 0 | — |  | RUNG DARK |
| 314 | DS-STR-1 | POLITICALLY FRACTURED | 0 | 0 | — |  | RUNG DARK |
| 315 | DS-STR-1 | RECENTLY BETRAYED | 0 | 0 | — |  | RUNG DARK |
| 316 | DS-STR-1 | RELIGIOUS CRISIS | 0 | 0 | — |  | RUNG DARK |
| 317 | DS-STR-1 | SLAVE REVOLT | 0 | 0 | — |  | RUNG DARK |
| 318 | DS-STR-1 | SUCCESSION VOID | 0 | 0 | — |  | RUNG DARK |
| 319 | DS-STR-1 | UNDER OCCUPATION | 0 | 0 | — |  | RUNG DARK |
| 320 | DS-STR-1 | UNDER SIEGE | 0 | 0 | — |  | RUNG DARK |
| 321 | DS-STR-1 | WARTIME | 0 | 0 | — |  | RUNG DARK |
| 322 | DS-STR-2 | LIFECYCLE: active | 0 | 0 | — |  | UNREACHABLE |
| 323 | DS-STR-2 | LIFECYCLE: easing | 0 | 0 | — |  | UNREACHABLE |
| 324 | DS-STR-2 | LIFECYCLE: emerging | 0 | 0 | — |  | UNREACHABLE |
| 325 | DS-STR-2 | LIFECYCLE: peaking | 0 | 0 | — |  | UNREACHABLE |
| 326 | DS-STR-2 | LIFECYCLE: residual | 0 | 0 | — |  | UNREACHABLE |
| 327 | DS-STR-2 | ORIGIN: abandoned_agent | 0 | 0 | — |  | UNREACHABLE |
| 328 | DS-STR-2 | ORIGIN: arcane_ascendancy | 0 | 0 | — |  | UNREACHABLE |
| 329 | DS-STR-2 | ORIGIN: arcane_burnout | 0 | 0 | — |  | UNREACHABLE |
| 330 | DS-STR-2 | ORIGIN: barracks_coup | 0 | 0 | — |  | UNREACHABLE |
| 331 | DS-STR-2 | ORIGIN: council_schism | 0 | 0 | — |  | UNREACHABLE |
| 332 | DS-STR-2 | ORIGIN: declared_war | 0 | 0 | — |  | UNREACHABLE |
| 333 | DS-STR-2 | ORIGIN: foreign_sponsored | 0 | 0 | — |  | UNREACHABLE |
| 334 | DS-STR-2 | ORIGIN: internal_conspiracy | 0 | 0 | — |  | UNREACHABLE |
| 335 | DS-STR-2 | ORIGIN: leyline_silence | 0 | 0 | — |  | UNREACHABLE |
| 336 | DS-STR-2 | ORIGIN: merchant_cabal | 0 | 0 | — |  | UNREACHABLE |
| 337 | DS-STR-2 | ORIGIN: palace_coup | 0 | 0 | — |  | UNREACHABLE |
| 338 | DS-STR-2 | ORIGIN: popular_revolt | 0 | 0 | — |  | UNREACHABLE |
| 339 | DS-STR-2 | ORIGIN: resistance | 0 | 0 | — |  | UNREACHABLE |
| 340 | DS-STR-2 | ORIGIN: servile_uprising | 0 | 0 | — |  | UNREACHABLE |
| 341 | DS-STR-2 | ORIGIN: tax_revolt | 0 | 0 | — |  | UNREACHABLE |
| 342 | DS-STR-2 | ORIGIN: temple_putsch | 0 | 0 | — |  | UNREACHABLE |
| 343 | DS-STR-2 | ORIGIN: unattributed | 0 | 0 | — |  | UNREACHABLE |
| 344 | DS-SUP-3 | THE FOOD GAP | 0 | 0 | — |  | SILENT |
| 345 | DS-SUP-3 | THE HEALING GAP | 0 | 0 | — |  | SILENT |
| 346 | DS-WAR-1 | mobilization: COVERT | 0 | 0 | — |  | UNREACHABLE |
| 347 | DS-WAR-1 | mobilization: climbing the ramp, still distant | 0 | 0 | — |  | UNREACHABLE |
| 348 | DS-WAR-1 | mobilization: climbing, close to ready | 0 | 0 | — |  | UNREACHABLE |
| 349 | DS-WAR-1 | mobilization: fully ready | 0 | 0 | — |  | UNREACHABLE |
| 350 | DS-WAR-1 | occupation.pays false (the occupation is a net drain on the holder) | 0 | 0 | — |  | UNREACHABLE |
| 351 | DS-WAR-1 | occupation.pays true | 0 | 0 | — |  | UNREACHABLE |
| 352 | DS-WAR-1 | occupierHoldings.strengthened | 0 | 0 | — |  | UNREACHABLE |
| 353 | DS-WAR-1 | occupierHoldings.stretchedThin | 0 | 0 | — |  | UNREACHABLE |
| 354 | DS-WAR-1 | statusLabel: At war (no front at the walls, no army abroad) | 0 | 0 | — |  | UNREACHABLE |
| 355 | DS-WAR-1 | statusLabel: Occupied | 0 | 0 | — |  | UNREACHABLE |
| 356 | DS-WAR-1 | statusLabel: On campaign | 0 | 0 | — |  | UNREACHABLE |
| 357 | DS-WAR-2 | document-level: the town is the LOSER side | 0 | 0 | — |  | UNREACHABLE |
| 358 | DS-WAR-2 | document-level: the town is the VICTOR side | 0 | 0 | — |  | UNREACHABLE |
| 359 | DS-WAR-2 | document-level: the treaty runs out within the year | 0 | 0 | — |  | UNREACHABLE |
| 360 | DS-WAR-2 | fraying set on a term with time still to run | 0 | 0 | — |  | UNREACHABLE |
| 361 | DS-WAR-3 | * | 0 | 0 | — |  | UNREACHABLE |

## LIMITS

1. **The 76 UNREACHABLE pools are not measured at 0 — they are not measured.** Every figure
   in this file is conditional on the RATE corpus, which generates settlements with a NULL
   world. War, treaties, faith standing, neighbour ties, steadings, population direction, trade
   flow, world stressors and the criminal structure do not exist on such a town at all. If the
   chair needs those rates, a corpus that generates towns inside a realm is a separate car.
2. The corpus is **uniform over the configuration space** (threat x route x tier) and not over
   what players actually generate. The wizard-default column in the same run moves 33 pools by
   ten percentage points or more.
3. **Exposure = expected firings per town**, summed over pools. It weights a pool that fires on
   every town at 10,000 whether or not the reader reads that surface, and it counts a pool once
   per town however many times its text is drawn on the page. It is a proxy for reader
   attention and not a measurement of it.
4. `n = 768`. A pool at 13 bp fired on ONE town, and its Wilson 95 % interval runs out past
   70 bp. The band boundaries are point estimates: a pool within a hundred bp of 500 could sit
   on either side of the line.
5. Resolved status is the census's own, read from the dock's committed census. 44 pools that
   fire are WIRING-UNRESOLVED and are excluded from every count here (273 fired, 229 of them
   resolved).
6. The census's `rateBp` column is a 2026-09-08 artefact and has drifted. If the chair means to
   act on the column rather than on this file, the fold is owed a re-run (`--rates`).

LAST LINE: MEASURED — the rate of all 361 resolved pools at dock tip `49183bafe`, reproduced
exactly against the census's 271 known values at `3e2a644ec`, plus the three-way classification
of the 132 pools that fire on no town. NOT MEASURED — the 76 pools in the 12 blocks no world-less
town can reach; they are named above, and they are a limit of the corpus rather than a zero.
