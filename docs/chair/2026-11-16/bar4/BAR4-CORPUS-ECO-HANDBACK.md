# BAR4-CORPUS-ECO hand-back (BRIEF-BAR4: what the town eats and lives on, against the state of its sources; one size for one fact)

Base: 8aef8e7d4 (measured there); the branch stands on a71788851 (8aef8e7d4 plus one document, the chair's correction of 07:50).
Instruments: the census's one command (`census3.sh <tree> <out> 4 --count-only`, and `--seeds` for the fresh 300); the detectors in
`tests/helpers/corpusEcoKinds.js`, run over a census output by a scratch runner (see the last section).

## THE KINDS

| kind | detector (file :: function) | 720 before | 720 after | fresh 300 before | fresh 300 after | named exclusions (judged true) | guard and its positive control |
|---|---|---|---|---|---|---|---|
| E1 the food line and its source: (a) spent ground | `tests/helpers/corpusEcoKinds.js :: detectE1` (`leadingSourceSpent`) | 31 towns (59 printed lines) | AFTER-RUN PENDING | 23 towns | PENDING | a member that DECLARES `source spent` or `own plots` (the twins written for the state) is not watched | `tests/domain/bar4CorpusEcoKinds.test.js`: the zero in 8 base towns; the control is a fish-led record over a depleted `river_fish` (fires), the same over an available one (silent) |
| E1 (b) own plots beside one source (the chair's FW1) | `detectE1` (`plotsBesideOneSource`) | 98 towns (fish 51, livestock 25, game 22) | PENDING | 29 towns | PENDING | as above | the zero in 8 base towns, each now printing an own-plots twin |
| E1 K6 split (the record itself) | `leadingSourceSpent` (no line) | 36 towns | not mine to cure (see "rows named") | 24 towns | — | — | — |
| E2 a reassurance while the tables are short | `detectE2` (`tablesShort`, `calmFalse`) | 38 towns (SECURE v2 under a crisis over a shortfall 35; several-sources v1 at a deficit band or a siege 3) | PENDING | 18 towns (14; 4) | PENDING | (1) a siege over a town whose own band is Pressured or better: the band says it feeds itself inside the lines; (2) the Secure band's structural lines v1 ("in an ordinary season … or near enough"), v3, v7 (the stores) under a crisis over a shortfall the band still calls Secure | the zero in 11 base towns; controls: a deficit band with "does not empty" (fires); wartime over a 3% shortfall with "not a subject anyone raises" (fires) |
| E3 one fact, one size (the unrecorded trade) | `detectE3` (`shadowTradeSize`: the DS-ECO-6 tiers over `safetyProfile.blackMarketCapture`) | 55 towns (POW-6 duty evasion v2 "not small", v3 "A good share" at a minor or no capture) | PENDING | 12 towns | PENDING | none | the zero in 10 base towns; control: capture 11 with "A large share" (fires), capture 31 (silent) |

The 30 READ towns (packets10, rand-21..23), base → tip: E1 8 → 5 (the 5 left were own-plots towns rendered before the own-plots
read was right; the after-run re-reads them), E2 2 → 0, E3 2 → 0.

## The rows (the worklist)

| row | class | verified by the record | cure |
|---|---|---|---|
| C26403, C30469 | STANDS | fish leads the food record over grounds the config lists depleted (`river_fish`; `fishing_grounds`) | DS-ECO-9 one source v1-v3 declare `no source spent`; twins v4, v5 declare `source spent`; several v1-v3, v6, v7 declare `no source spent`, twin v8. Both towns now print v4 |
| C33209 | WEAK | game the one source; a Subsistence farming house stands | the chair's FW1: v1-v3 declare `no own plots`; twins v6, v7 declare `own plots` |
| C19130, C20588 | STANDS | a siege, band Deficit | several v1 now `no crisis: under_siege · food: ≥ importDependent`; twins v6 (`food: ≤ deficit`, no siege) and v7 (`crisis: under_siege`). Both towns now print v7 |
| C13374 | WEAK | wartime over a 3% shortfall, band Secure | SECURE v2 + `no crisis` (the mark the SECURE pool already answers): the pool's other members print |
| C30692 | STANDS | capture 11: the economy desk's tier is minor ("small"); POW-6 said "not small" | ONE HOME SIZES IT: POW-6 duty evasion v2 and v3 reworded size-free; DS-ECO-6's tiers alone size the share |
| C43690 | WEAK | 71% one source; "trade" said of the harvest | DS-ECO-12 one source v3: "lives largely on one source of income … if that source has a bad year" |
| C38176 | WEAK | in every one of the 70 towns of the 720 printing it, the alchemy row is the SMALLEST share | `ALCHEMY_TRADE_LINE` loses "thriving" (a DECLARED MOVE of the income family's desc) |
| C47622 | LEFT-BY-BAR3 | 5 of the 31 towns printing the twin score Economic Resilience 72-100 | `MODERATE_GAP_TWIN`: "for a price that is not paid in coin" (a DECLARED MOVE of the outlook hooks) |

## The veto list (every new or changed line; towns it is read in are in the after-run, PENDING)

- DS-ECO-9 FOOD SOURCES one source v4 `[ledger · source spent]` {settlement}'s own food once came first from its {good}, and the grounds are worked out: what the town still raises for itself is the less for it.
- v5 `[street · source spent]` {settlement} has worked out the grounds of its {good}, and there is less of its own food on every table for it.
- v6 `[ledger · own plots · no source spent]` {settlement}'s own food comes from its {good} and from the holdings its families till, so a bad season for either is felt at every table.
- v7 `[street · own plots · no source spent · no crisis: famine]` Of the food {settlement} raises for itself, its {good} and what each family grows on its own holding come first, and a poor season in either means less to go round.
- DS-ECO-9 several v6 `[ledger · no crisis: famine · no crisis: under_siege · food: ≤ deficit · no source spent]` … the {good} most of all, and this year all of them together fall short of what the town eats.
- several v7 `[ledger · crisis: under_siege · no crisis: famine · no source spent]` … the {good} most of all, and with the siege on, what they give and what is stored is all the town has to eat.
- several v8 `[ledger · no crisis: famine · source spent]` {settlement} eats from more than one source, but the grounds its {good} came from are worked out, and the others now carry more of the load.
- DS-ECO-12 one source v3 (reworded) {settlement} lives largely on one source of income. It is doing well enough now, but if that source has a bad year, the whole town has a bad year.
- DS-POW-6 duty evasion v2 (reworded) A share of what arrives at {settlement} never appears at the gate, and the dues on it are never paid.
- DS-POW-6 duty evasion v3 (reworded) Some of the goods that reach {settlement} pay none of the dues owed on them.
- `ALCHEMY_TRADE_LINE` An alchemical trade in reagents, preparations, and curative potions draws customers from surrounding settlements.
- `MODERATE_GAP_TWIN` The settlement grows less food than it eats, and a merchant has offered to make up the difference for a price that is not paid in coin.
- NEW VOCABULARY (amendment 5b, beside the food-source atoms): `source spent` (`src/domain/facts/leadingSourceSpent.js`) and `own plots` (`src/domain/facts/ownPlots.js`, the chair's FW1).

## Rows named for other seats

- THE K6 SPLIT (no seat's this round; one line to the chair): `src/generators/foodLand.js :: fishSource` admits a fish row on water (`fishRowOnWater`) as the catch where every fishing ground is on `config.nearbyResourcesDepleted`, so `foodRecord.foodSources` names fish against the resource record's depleted grounds: 36 towns of the 720, 24 of the fresh 300.
- `src/domain/coherence/crisisBlindFindings.js:69` keys a finding on SECURE v2's words; untouched (not my file).

## The books my cures move (named; NOT re-taken)

| test | arm | base → tip | door |
|---|---|---|---|
| `tests/data/dossierStateProseProjection.contract.test.js` | SHIFT REGISTER pins (variant count, faces, vids) | 2959 → 2966 variants and their hashes | its register ("THIN-pool growth (car 9b), owner-gated") |
| `tests/lint/proseEntryContradiction.walker.test.js` | the composed figures | 3427 → 3434; 2722 → 2729 | the close (the COMPOSED figure re-measured at the line's final tree); two line anchors RE-KEYED by text (2420 → 2427, 6167 → 6174) |
| `tests/lint/proseComposed.walker.test.js` | the shipped state corpus | 2959 → 2966 | the same |
| `tests/lint/proseWiringCensus.walker.test.js` | the variant column, the tiers, the holder census, the committed `docs/content/wiring-census.json` | 2959 → 2966 | amendment 4: the close re-takes the census JSON once |
| `tests/lint/observedShapeReaders.walker.test.js` | the input-drift arm (the two generated desks changed) | — | its shrink-only `--write` re-freeze |

Re-keyed by identity in their own form (dated notes): `tests/domain/corpusEcoTailGuards.test.js` (four GONE rows: what prints instead is the new twin), `tests/generators/tailDefeconBatch4Lines.test.js` (the alchemy KEEP pair), `tests/domain/crisisBlindDossierProse.test.js` (two facts setters for the new atoms), `tests/domain/economyStateProseDesk.test.js` (the several-sources fixture carries its band).

## Registrations owed

- manifest entry owed: none (the new test file is under `tests/domain`).
- roster row owed: none (no goods module imported).

## What is left, in order (for a successor)

1. THE AFTER-RUN (PENDING at this push): `census3.sh <tip> <out> 4 --count-only` over the 720 and the fresh 300, then the detector runner; fill the table's after columns and the veto list's towns.
2. The wide books of amendment 2 at the final tip, each alone; one `npm run build` and `verify:dist`; the count of the 525 reference configurations moved (the record moves only where `ALCHEMY_TRADE_LINE` or `MODERATE_GAP_TWIN` is on the record).

## How the instruments are re-made

`git archive` of `docs/chair/2026-11-14/probes/READ-ALL/` (lane/chair-2026-11-08) and `docs/chair/2026-11-14/probes/CENSUS-3/` (lane/census-3-2026-11-14) to a scratch directory; `census3.sh <tree> <out> 4 --count-only` at 8aef8e7d4 and at the tip (`--seeds packets11/seeds.fresh300.txt` for the fresh 300; `--seeds packets10/seeds.bar4.txt` for the 30 read towns); then, for each output, a runner that imports the TREE's own `tests/helpers/corpusEcoKinds.js` (copied into the base tree for the before count, so each tree's detector reads its own pools), reads `corpus.ndjson.gz` and `dumps/<seed>.txt`, and calls `detectE1/E2/E3(record, dumpLines)` and `leadingSourceSpent(record)`; counts are towns (and printed lines) per kind.
