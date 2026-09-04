"""BATCH 3 — the COVERAGE Car 0 receipt folded into §6 (and §11.4's COVERAGE row).
Receipt: $SP/laneG0COV-receipt.md. Chair rulings: ODQ §882.5. Marks G0-32 … G0-46.
"""
import foldlib

R = '(COVERAGE Car 0 receipt, `$SP/laneG0COV-receipt.md`)'
f = foldlib.Folder()

# ── ⟦G0-32⟧ §6.0 — Struggling is not zero; the plausibility control reconciles ──
f.rep(
    'today they do not: `Wealthy` 0 and `Struggling` 0 among the 270 town-and-above rows (CONFIRMED-by-lane: `generatorGoldenMaster.test.js:149-158` "Comfortable 55 · Moderate 12 · Poor 24 · Prosperous 179")',
    'today they do not — ⟦G0-32⟧ **but only ONE of the two, MEASURED at C′: `Wealthy` is 0 over the whole 525; `Struggling` is NOT** (volume "`Struggling` 0" → MEASURED **36 rows**, thorp 12 · hamlet 12 · village 12 — the receipt\'s zero was true only of the town-and-above slice, so `Struggling` sits 12× over the floor and is struck as a widening target, §4 C11 ' + R + ') (CONFIRMED-by-lane: `generatorGoldenMaster.test.js:149-158` "Comfortable 55 · Moderate 12 · Poor 24 · Prosperous 179"; ⟦G0-32⟧ the same control RE-MEASURED at C′ over the 273 town-and-above rows reads **55 · 12 · 24 · 182** and reconciles to the unit — the 3 extra rows carry no criminal institution and return before `corruptionPass`, so nothing moved in prosperity between `6770f878f` and C′ despite the 305-row TE-AGNOSTIC re-record)',
)

# ── ⟦G0-33⟧ §6.0 — the route bands and the severityBand "0 by construction" claim ──
f.rep(
    '`mountain_pass` 2, `crossroads` 1, `none` 1; `activeConditions[].severityBand` 0 by construction because `corpus()` sets no stress (base config `:695` carries only the five key fields).',
    '`mountain_pass` 2, `crossroads` 1 → ⟦G0-33⟧ **MEASURED `crossroads` 3 — AT the floor** (`random_trade` is a sentinel resolved BEFORE persistence, so the key histogram\'s 1 and the persisted `config.tradeRouteAccess`\'s 3 legitimately differ; the same shape on terrain — keys give `plains` 84, the census measures 85), `none` 1; ⟦G0-33⟧ **so the first widening set is TWO route bands (`mountain_pass` 2 · `none` 1), not three**. `activeConditions[].severityBand` 0 by construction because `corpus()` sets no stress (base config `:695` carries only the five key fields) → ⟦G0-33⟧ **REFUTED BY EXECUTION: 516 of 525 rows carry an activeCondition** (`medium` 250 · `high` 230 · `critical` 36 · `low` 0) — `corpus()` sets no stress but `resolveConfig` ROLLS one (`config.stressTypes` = `infiltrated` on 480 rows, `famine` on 36, empty on 9), so the field is one of the roster\'s best-covered rows and only `low` needs a cure ' + R + '.',
)

# ── ⟦G0-34⟧ §6.1 roster row 3 — the chain vocabulary is the LEGACY one ──
f.rep(
    '(3) `status on activeChains` — pinned 7 (`supplyChainState.js:185-187 CANONICAL_STATUSES` is module-local); `captured`/`collapsing` "become reachable when Tier 4.2 … land" ⇒ likely `producer-less`',
    '(3) `status on activeChains` — pinned 7 (`supplyChainState.js:185-187 CANONICAL_STATUSES` is module-local); `captured`/`collapsing` "become reachable when Tier 4.2 … land" ⇒ likely `producer-less` → ⟦G0-34⟧ **REFUTED, AND IT IS THE ROSTER\'S LARGEST ERROR: all SEVEN canonical tokens score 0 rows over 1,029 rows.** The generator persists the LEGACY vocabulary (`operational` 441 · `running` 464 · `vulnerable` 441 · `entrepot` 91 · `impaired` 104 · `magically_sustained` 13 · `unexploited` 1 — the seven keys of `LEGACY_TO_CANONICAL`, `supplyChainState.js:174-182`); `canonicalSupplyChainStatus()` maps legacy→canonical **at READ time** and has exactly ONE consumer (`:547`); no `src/generators` file assigns any canonical token. **RULED (§882.5, vetoable): the field\'s `read(s)` APPLIES `canonicalSupplyChainStatus` so the census counts the CUSTOMER-VISIBLE bands, and the legacy-persisted vocabulary is recorded as a named WRWALKER/OSR HANDOVER row, never cured in COVERAGE.** As drafted the row was a 7/7-zero cell block plus a 7-token OOV block — a walker born red on a false claim, not a blind spot ' + R + ' §4 C1',
)

# ── ⟦G0-35⟧ §6.1 rows 2 + 11 — the two exemption blocks that would red on their first gate ──
f.rep(
    "(11) `severityBand on activeConditions` — `displayLabelsFor('condition')` 4, `gatedBy ['stressTypes']` ⇒ four `config-gated` exemptions + a `key-extension` proposal",
    "(11) `severityBand on activeConditions` — `displayLabelsFor('condition')` 4, `gatedBy ['stressTypes']` ⇒ four `config-gated` exemptions + a `key-extension` proposal → ⟦G0-35⟧ **the `gatedBy` and all FOUR exemptions are DROPPED (§882.5): 516/525 rows carry a condition** (`medium` 250 · `high` 230 · `critical` 36 · `low` 0) because `resolveConfig` rolls a stress the corpus never sets; the rows JOIN the denominator as measured and only `low` is an honest zero. Left as drafted, every one of the four would have red `exempt-but-reached` on its first gate — the §6.1 claim-inversion arm working exactly as designed, against the design's own draft " + R + " §4 C5",
)
f.rep(
    "`'Deficit — Active Famine'` `gatedBy ['stressTypes:famine']` ⇒ `config-gated`",
    "`'Deficit — Active Famine'` `gatedBy ['stressTypes:famine']` ⇒ `config-gated` → ⟦G0-35⟧ **DROPPED: the band is REACHED on 36 rows** (the famine rows the pipeline rolls); `Surplus` is this field's zero band, not Famine " + R + " §4 C6",
)

# ── ⟦G0-36⟧ §6.1 rows 12 + 13 — three fields that do not exist, five with no writer ──
f.rep(
    '(12) `magnitude on historicalEvents` · `severity on scars` — `tableEvents.js#MAGNITUDE_BANDS` exported 3',
    '(12) ⟦G0-36⟧ **`severity on historicalEvents`, at `settlement.history.historicalEvents[]`** (volume: `magnitude on historicalEvents` · `severity on scars` · `severity on settlement`, vocabulary `MAGNITUDE_BANDS`) — **all three drafted fields DO NOT EXIST at C′**: `settlement.scars` is KEY ABSENT on 525/525 and 504/504, `settlement.severity` is absent, and the 3,049 real events carry **no `magnitude` at all** (0 of 3,049). The real field is banded — `minor` 402 rows/730 occ · `major` 522/1,848 · `moderate` **0** — and its vocabulary is **NOT** `MAGNITUDE_BANDS`: **`catastrophic` (267 rows / 471 occ) is OUTSIDE it. RULED (§882.5): recorded as `knownDefects.outOfVocabulary`, never a silent catalog widening, and handed to the exhaustive review\'s backlog as a FINITE-SEMANTICS finding**; 9 phantom cells are removed and 1 real field added, its vocabulary re-derived from `historyGenerator.js` ' + R + ' §3(b)/§4 C3. The volume\'s original clause — `tableEvents.js#MAGNITUDE_BANDS` exported 3',
)
f.rep(
    '(13) `wealth|manpower|publicTrust|coerciveForce|informationAccess on factions.resources` — pinned 3',
    '(13) `wealth|manpower|publicTrust|coerciveForce|informationAccess on factions.resources` — ⟦G0-36⟧ **NO WRITER: 0 of 1,323 factions carry `.resources` (0/1,226 on carto).** A faction\'s keys at C′ are exactly `dominantCategory members name powerFactionCat powerFactionName powerFactionPower`; the schema\'s `:935-946` union is a reader-side promise with no producer. **RATIFIED (§882.5): five `notInDenominator: \'no-generator-writer\'` rows + a WRWALKER handover by name** — 15 phantom zero cells leave the roster ' + R + ' §3(a). The draft read: pinned 3',
)

# ── ⟦G0-37⟧ §6.1 D1 + D3 — the magic exports and capacity's duplicate 'absent' ──
f.rep(
    '`magicProfile.js:464-467`; read via `deriveMagicProfile`',
    '⟦G0-37⟧ **`magicProfile.js:468-471` and there are FOUR exports, not six** — `magicAvailabilityBands()`, `magicLegalityBands()`, `magicRiskBands()`, `magicRoleBands()`; `institutionalControl`, `cost` and `religiousAcceptance` have **no exported list at all** (their only frozen home is the JSDoc union at `settlement.schema.js:1660/:1661/:1663`), and each of the four exports is a **`+\'absent\'` SUPERSET** of its schema union (availability 7 vs 6, legality 6 vs 5, risk 6 vs 5, roles 4 = 4) — so the register must SAY WHICH of the two lists each `vocabulary` is; the volume\'s "schema unions 6/5/3/4/5/5 + 4" is CONFIRMED **for the schema** ' + R + ' §3(d) (volume: `magicProfile.js:464-467`); read via `deriveMagicProfile`',
)
f.rep(
    "D3 `capacity.<name>` (9 capacities; `displayLabelsFor('capacity')` 5 + `'absent'`",
    "D3 `capacity.<name>` (9 capacities; ⟦G0-37⟧ **`CAPACITY_BANDS` (`capacityModel.js:175-182`) ALREADY carries `'absent'` — it is SIX, not 5 + one**, so the roster imports it WHOLE and 9 duplicate cells are avoided " + R + " §4 C8; volume: `displayLabelsFor('capacity')` 5 + `'absent'`",
)

# ── ⟦G0-38⟧ §6.1 row 10 — the route-band proposals ──
f.rep(
    'crossroads 1 · none 1 · mountain_pass 2 are the first `seed-row` proposals',
    '⟦G0-38⟧ **`none` 1 · `mountain_pass` 2 are the first `seed-row` proposals — TWO, not three: `crossroads` MEASURES 3 and is already at the floor** (the sentinel `random_trade` resolves before persistence, so the key histogram and the persisted config differ by construction) ' + R + ' §4 C10 (volume: crossroads 1 · none 1 · mountain_pass 2)',
)

# ── ⟦G0-39⟧ §6.1 — the eleven roster corrections, as a block at the roster's fold point ──
f.insert_before(
    '\n> **JUDGMENT (COVERAGE J1):',
    '''
⟦G0-39⟧ **THE ROSTER IS MINTED FROM MEASUREMENT, NOT FROM THIS DRAFT — eleven of its rows were wrong at C′** ''' + R + ''' §4. Each is folded at its row above; the block is restated here so Car 1 has one list, and the law it teaches is banked: *a register's roster is MINTED FROM THE CORPUS, never transcribed from a design draft — a draft's "confirmed" row is a HYPOTHESIS until a probe prints it* (the §441 J7 law, now on the instrument side).

| # | the volume said | MEASURED at C′ | Car 1's consequence |
|---|---|---|---|
| C1 | row 3 chain statuses = `CANONICAL_STATUSES` (7) | 0/7 canonical over 1,029 rows; the LEGACY seven are live | `read(s)` applies `canonicalSupplyChainStatus`; the legacy vocabulary is a WRWALKER/OSR handover |
| C2 | row 8 `status`/`contentProfile` **on generationCoherence** | the persisted key is **`generationCoherenceReceipt`** (`settlement.generationCoherence` undefined on all 525); `contentProfile` lives on BOTH the receipt and `config`; two further unnamed fields exist — `checks[].status` (pass 525 / 8,925 occ, fail 0) and `judgments[].status` (pass 525/3,150, `pass_with_tension` 525/525, `needs_review` 0, `not_applicable` 0) | the §1.3 identity spelling changes on two rows; four sub-fields join the roster |
| C3 | row 12 three fields, vocabulary `MAGNITUDE_BANDS` | the three do not exist; the real field is `severity on historicalEvents` with `catastrophic` OOV and `moderate` 0 | −9 phantom cells, +1 real field |
| C4 | row 13 `factions.resources.*` "PLAUSIBLE persisted" | no writer, 0/1,323 | −15 phantom cells; 5 `notInDenominator` + a handover |
| C5 | row 11 `severityBand` 0 by construction ⇒ 4 exemptions | 516/525 carry a condition | the four exemptions DELETED |
| C6 | row 2 Famine `config-gated` | reached on 36 rows | the exemption DELETED |
| C7 | D1 magic exports `:464-467`, six | `:468-471`, four, each a `+absent` superset; three fields have no export | the register names WHICH list each vocabulary is |
| C8 | D3 capacity 5 + `'absent'` | `CAPACITY_BANDS` is already 6 | −9 duplicate cells |
| C9 | row 4 `paths[].type` (6) + `paths[].stability` (4) homed "schema :125-139" | the real unions are the JSDoc at **`isolationSupport.js:54` / `:56`** — type `local_foodshed\\|hinterland\\|reserves\\|seasonal_access\\|patronage\\|magical_transit`; stability `durable\\|seasonal\\|conditional\\|fragile` | without them 10/10 cells read OOV |
| C10 | row 10 `crossroads` 1 is a widening target | `crossroads` 3, at floor | the widening is TWO route bands |
| C11 | §6.0 `Struggling` 0 | 36 rows | the `Struggling` widening target is struck |

⟦G0-39⟧ **`absent` per field, MEASURED over 525** (the roster's blind-spot map, which the draft had no figure for): `status on activeChains` 48 (thorp/hamlet rows carry no chains) · `type`/`stability on isolationSupport.paths` 452 each (paths exist only on `tradeRouteAccess:'isolated'`) · `magicLicense on institutions` 228 · `importance on npcs` 339 (the EXPLICIT field only — §6.1 row 6's reading CONFIRMED) · **`densityRungRole on npcs` 525/525 — dial-gated and dark on every row, exactly as §810 predicts** · `severityBand`/`status on activeConditions` 9 each · `wealth`/`safety on districts` 60 each (60 rows derive no districts) · `threat.*` 3 · and 525/525 for the four fields that do not exist or have no writer.
''',
)

# ── ⟦G0-40⟧ §6.1 — the wall-clock, measured ──
f.rep(
    "Wall-clock: the golden's 525 generations ≈ 8.6–9.3 s solo, 59.7 s inside a 558-file parallel run (CONFIRMED (recon)); the census adds the same once more + the derivation tier (PLAUSIBLE < 1 s)",
    "Wall-clock: the golden's 525 generations ≈ 8.6–9.3 s solo → ⟦G0-40⟧ **MEASURED 8,276 ms generation (15.8 ms/row) + 575 ms derivation = 8,927 ms in-process, 9.33 s wall including node start** " + R + " §1/§3(f) — the prediction HELD to the tenth of a second and the derivation tier's PLAUSIBLE `< 1 s` is CONFIRMED at 575 ms; 59.7 s inside a 558-file parallel run (CONFIRMED (recon); the parallel leg is NOT settled by this probe — it is a property of a 558-file vitest run, and Car 0 names no suite)",
)

# ── ⟦G0-41⟧ §6.1 — the known-defect block, measured EXACT plus a second field ──
f.rep(
    '`"monsterThreat on config": { "civilized": 522, "safe": 1 }` predicted; MEASURED at Car 0',
    '`"monsterThreat on config": { "civilized": 522, "safe": 1 }` predicted; ⟦G0-41⟧ **MEASURED `{civilized: 522, safe: 1}` — EXACT, to the unit** ' + R + ' §2.1; and the block gains a SECOND field the volume never named: **`severity on historicalEvents`: `catastrophic` 267 rows / 471 occurrences** (outside `MAGNITUDE_BANDS`, `moderate` at 0), recorded here rather than widening the catalog (§882.5) — the seven legacy `status on activeChains` tokens are NOT known defects but the field\'s real read-time vocabulary (⟦G0-34⟧). MEASURED at Car 0',
)

# ── ⟦G0-42⟧ §6.5 Car 0 — DISCHARGED, and the printed tuple is the prediction ──
f.rep(
    '- **Car 0 — THE PREDICTION PROBE** (read-only):',
    '''- ⟦G0-42⟧ **Car 0 IS DISCHARGED at C′ `9a0584f0f` — HELD CLEAN, no STOP fired** ''' + R + '''; its printed tuple is now THE PREDICTION Car 1's register must reproduce cell for cell (a difference is a wrong prediction, investigated before the mint):

```
CORPUS            generator-golden-master (manifest keys)
rows              525          manifest bytes 67,779
manifestSha256    c22d3fb23e2a1c8318bf98d0130e26178e1fce8bf1834f4127c704db5c9b19db
keyOf round-trip  0 misses / 525          (§6.1 J2's losslessness CONFIRMED by execution)
fields            66     vocabulary cells 329
ZERO cells        146    UNDER-FLOOR (1-2) 8    at-or-above N=3  175
wall-clock        8,927 ms total (8,276 generation at 15.8 ms/row + 575 derivation)
```
```
CORPUS            cartography-calibration-corpus (calibrationRows())
rows              504    fields 66    vocabulary cells 329
ZERO cells        132    UNDER-FLOOR 4    at-or-above N=3  193
wall-clock        8,648 ms total (8,055 generation at 16.0 ms/row + 518 derivation)
```

The cell record is `$SP/cov-car0-census2.log` lines 10–605 (pass 2, the CORRECTED roster; `cov-car0-census.log` is pass 1, kept for the five vocabulary pins it exposed). The probes are preserved at `$SP/laneG0COV-bandCensus.probe.mjs` / `…Dial.probe.mjs`; the dock retired porcelain 0 at C′.

- **Car 0 — THE PREDICTION PROBE** (read-only, AS CHARTERED — the act, for the record):''',
)

# ── ⟦G0-43⟧ §6.5 Car 0's STOPs — neither fired ──
f.rep(
    "STOP: (f) > 60 s solo → switch to the fallback design (§6.7 R1) before Car 1; (e) shows Wealthy reachable WITHOUT the dial → rewrite row 1's `gatedBy`. Bill: none; the probe deleted in the same command.",
    "STOP: (f) > 60 s solo → switch to the fallback design (§6.7 R1) before Car 1; (e) shows Wealthy reachable WITHOUT the dial → rewrite row 1's `gatedBy`. Bill: none; the probe deleted in the same command. ⟦G0-43⟧ **NEITHER FIRED.** (f) measured **8,927 ms** — 6.7× under the 60 s switch, so §6.7 R1's fallback is NOT taken and COVERAGE J7's default stands. (e) measured **Wealthy 0/42 on the 6×7 base grid at the corpus default, 21/42 at `priorityEconomy: 95`** — and a negative control the charter did not ask for, **300 seeds on `metropolis|germanic|plains|road|civilized` at the DEFAULT dial produce ZERO Wealthy** (`{Prosperous 218, Comfortable 58, Moderate 13, Struggling 8, Poor 3}`) while the same config at 95 reaches Wealthy at seed index 1 — so row 1's `gatedBy ['priorityEconomy>=70-effective']` STANDS and the `Wealthy` exemption is `dial-gated` with a `key-extension` classification " + R + " §3(e).",
)

# ── ⟦G0-44⟧ §6.5 Car 1's authored exemption block, corrected ──
f.rep(
    '`densityRungRole`×4 dial-gated §810 · `severityBand`×4 config-gated · Famine config-gated · `needs_review` structurally-rare · `custom` config-gated · `Wealthy` dial-gated if (e) holds · chain `captured`/`collapsing` producer-less citing `supplyChainState.js:160-163` · `capacity.*.collapsed` as measured',
    '⟦G0-44⟧ **as Car 0 PROVED them, three drafted blocks struck**: `densityRungRole`×4 dial-gated §810 (KEPT — 525/525 absent, dark on every row) · `Wealthy` dial-gated (KEPT — E20 CONFIRMED) · `needs_review` structurally-rare · `custom` config-gated · `capacity.*.collapsed` as measured · ~~`severityBand`×4 config-gated~~ **STRUCK** (516/525 reached, ⟦G0-35⟧) · ~~Famine config-gated~~ **STRUCK** (36 rows, ⟦G0-35⟧) · ~~chain `captured`/`collapsing` producer-less~~ **STRUCK as drafted** — it named 2 of 7 unreached canonical tokens when all 7 are unreached, and the cure is the read-time canonical mapping, not an exemption (⟦G0-34⟧) · ~~the `Struggling` widening target~~ **STRUCK** (36 rows, ⟦G0-32⟧). Each struck block would have red `exempt-but-reached` or `unknown-band` on its first gate ' + R + ' §6',
)

# ── ⟦G0-45⟧ §6.7 R2 — re-priced at roughly double ──
f.rep(
    '| R2 | a walker born red: ≈ 20 persisted fields + 4 derived domains on a stress-free one-seed corpus ⇒ many zero cells | the genesis exemption block may hold 20–40 rows, each a true, self-retiring claim |',
    '| R2 | a walker born red: ≈ 20 persisted fields + 4 derived domains on a stress-free one-seed corpus ⇒ many zero cells | ⟦G0-45⟧ **RE-PRICED AT ROUGHLY 2×: the genesis authored block is 76 findings, not 20–40** — **71 FLOORED cells at ZERO** (full list `$SP/cov-floored-zeros.txt`; 27 of them `capacity.*`, 20 `magicProfile.*`) plus **5 FLOORED cells UNDER the floor** (`monsterThreat::frontier` 1 · `monsterThreat::plagued` 1 · `tradeRouteAccess::mountain_pass` 2 · `tradeRouteAccess::none` 1 · the legacy `unexploited` 1) — measured AFTER removing the 24 phantom cells C3/C4 create and setting aside D4/D5\'s 96 not-floored cells. Every one is a true, self-retiring claim under §6.1\'s inversion, but a 76-row authored block is a DIFFERENT Car 1 than a 30-row one and the §6.5 STOP ("a zero without an honest reason") now bites 76 times ' + R + ' §4.1. **19 of the 76 are cured OUTRIGHT by the carto corpus** — the strongest argument yet for COV-4 taking a reading other than "report, never floor" |',
)

# ── ⟦G0-46⟧ §6.7 R1 / J7 and J4 / COV-4 — both re-priced on measurement ──
f.rep(
    '**JUDGMENT (COVERAGE J7): the executed design is the default because the OSR/lighting idiom is execute-then-compare and 9 s is affordable; the fallback triggers only on (f) > 60 s solo or a measured CI-group breach — vetoable.**',
    '**JUDGMENT (COVERAGE J7): the executed design is the default because the OSR/lighting idiom is execute-then-compare and 9 s is affordable; the fallback triggers only on (f) > 60 s solo or a measured CI-group breach — vetoable.** ⟦G0-46⟧ **J7 STANDS ON MEASUREMENT: (f) = 8,927 ms solo, 6.7× under its own switch** ' + R + ' §3(f); the fallback specification is retained unexecuted, and the CI-group half of the trigger is the only live one.',
)
f.rep(
    'and because counting it in-gate would push the executed arm toward its 120 s allowance in a parallel run (1,029 pipelines ≈ 117 s) — vetoable; COV-4.**',
    'and because counting it in-gate would push the executed arm toward its 120 s allowance in a parallel run (1,029 pipelines ≈ 117 s) — vetoable; COV-4.** ⟦G0-46⟧ **J4\'S WALL-CLOCK PREMISE IS REFUTED AND COV-4 GAINS TWO NEW FACTS: carto\'s 504 rows cost 8,648 ms — 8.6 s, not ≈ 117 s (J4\'s figure assumed the carto suite\'s compile legs, which a band census does not run), so the two corpora together are ≈ 17.6 s solo; and carto is materially richer in stress (15 distinct `config.stressTypes` combinations against the golden\'s 3) and CURES 19 cells the golden leaves at ZERO** — `capacity.craft::surplus` · `capacity.healing::critical` · `capacity.labor::critical` · `capacity.religious_welfare::adequate` · `importance on npcs::notable` · `legality on magicProfile::restricted` · `status on activeConditions::stable` · `status on isolationSupport::resilient` · `threat.*.type::plague` · `::siege` · `type on isolationSupport.paths::hinterland` · `var.criminal_opportunity::adequate` · `var.defense_readiness::collapsed` · `var.economic_capacity::critical` · `var.housing_pressure::critical` · `var.labor_capacity::collapsed` · `var.public_legitimacy::critical` · `var.social_trust::critical` · `wealth on districts::destitute`. The golden covers FIVE carto leaves at zero (`tradeRouteAccess::crossroads`, `::mountain_pass`, `::none` — carto pairs terrain with its honest route and never emits them — plus `var.food_security::surplus` and the legacy `unexploited`); **127 cells are zero in BOTH**. The recommendation "count on the record arm, report, never floor" was priced against a wall-clock this probe measures at ONE THIRTEENTH of the estimate and against a coverage contribution the volume had no figure for at all ' + R + ' §3(g)/§6.',
)

# ── §6.6 Car 0's slot row — discharged ──
f.rep(
    '| Car 0 | any time after COUPLED lands; re-run at the Car 1 boarding tip | a prediction is only a prediction at the tree it is measured on |',
    '| Car 0 | ⟦G0-42⟧ **RUN AND DISCHARGED at C′ `9a0584f0f`, 2026-09-02 04:47–05:05 ET, no STOP** (dock `$SP/laneG0COV-tree`, porcelain 0, zero commits); re-run at the Car 1 boarding tip | a prediction is only a prediction at the tree it is measured on — and the tuple above is the prediction at C′ |',
)

# ── §11.4's COVERAGE row — the measured figure beside the believed one ──
f.rep(
    "| COVERAGE `bandCensus.walker.test.js` | `test:ratchet` (`tests/lint`) | +≈ 9 s solo · +≈ 60 s in a parallel slot (a second 525-generation file beside the golden's); fallback ≈ 0.2 s (J7) | CONFIRMED (recon) for the golden's figure |",
    "| COVERAGE `bandCensus.walker.test.js` | `test:ratchet` (`tests/lint`) | ⟦G0-40⟧ **+8.93 s solo MEASURED** (8,276 ms generation + 575 ms derivation at C′; volume ≈ 9 s — held to the tenth) · +≈ 60 s in a parallel slot (a second 525-generation file beside the golden's) still PLAUSIBLE, a property of the 558-file run this probe did not measure; fallback ≈ 0.2 s (J7, not taken) | **CONFIRMED (Car 0)** for the solo leg; PLAUSIBLE for the parallel |",
)

f.checkpoint(46, 84)
f.save('batch3 COVERAGE')
foldlib.fold_json(folded=[f'G0-{n}' for n in range(32, 47)])
