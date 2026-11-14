# TAIL-CORPUS-ECO · hand-back (kept current after every batch)

Seat: TAIL-CORPUS-ECO, builder. Branch `lane/tail-corpus-eco-2026-11-14`, cut from the joined line `lane/join-2026-11-14`
at **48fedbe98** (read back from origin at the start). Worklist: `docs/chair/2026-11-14/read-all/WORKLIST-CORPUS-ECO.{md,json}`
on the chair's lane (148 rows, HIGH 6, read at e5b421802). Files: `src/data/dossierStateProse/economy.generated.js`,
`general.generated.js` (GENERATED: edited in their source `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, the DS-ECO, DS-GEN,
DS-SUP sections only) and tests.

## The rulings worked to (the chair's, 2026-11-14; each vetoable by the owner)

- (C1) YOUR POOLS: ids beginning DS-ECO, DS-GEN, DS-SUP. A line is cured by a declaration or by rewording in the SOURCE
  document, never by striking a middle row; the leaves are rebuilt through the corpus's own door
  (`node scripts/generate-dossier-state-prose.mjs`; its `--check` must pass before you push; if it refuses for a stale wiring
  census, that register is re-taken through its own door, `node scripts/wiring-census.mjs`, in its own commit).
- (C2) MEASURE BY REPLAY, as the lane's seats did: the probes under docs/chair/2026-11-14/probes/W2-WRITE-13/ on the joined
  line: a declaration needs no second render: every pool re-drawn from the render's own eligible lists, per variant before
  and after, the inheritors read. One census run at your base gives the lists.
- (C3) NO CEILING IS RAISED, AND A FALSE LINE IS NOT PARKED BEHIND ONE: a state a declaration would leave MUTE takes A TWIN
  TRUE IN THAT STATE. Land POOL BY POOL. (The seat before: "what is left" of W2-WRITE-SIDE-HANDBACK-14 read: its batch is
  landed whole; its bar rows #168 PROSPEROUS "halls", #275 entrepot, are in this worklist and taken here.)
- (C4) CORPUS-DEF edits the same source in ITS sections: no section of DS-DEF, DS-POW, DS-FTH or DS-CND is touched.
- BRIEF-TAIL whole: a flag is a candidate, verified by the record; batches; silence is true but a silence of TRUE lines in
  more than twenty towns is told first; a state left mute takes a twin; a draw is not moved outside the row's pool; under a
  siege nothing comes in or goes out; under a famine no line offers the food that failed; no new vocabulary word; every new or
  reworded line listed for the veto with three towns.

## The instruments (how they are re-made)

- The census: CENSUS-3 `census3.sh` copied to `census3d.sh` with ONE change: the render (`render.census3d.jsx`) also writes, per
  town, `<seed>.draws.json` (the kernel's `drawVariant` wrapped: per pool, the eligible vids and the drawn vid, W2-WRITE-5's
  `render.w5.jsx` mock verbatim) and `records/<seed>.json` (the born record), so the replay has its lists. Same 720 seeds,
  same configuration, same dumps (the inventory reads `dumps/*.txt` only). ~50 minutes at 4 workers here.
- `inventory.py` / `inventory_diff.py` (READ-ALL) on the census out-dirs.
- The replay: W2-WRITE-13 `replay.mjs` + the side seat's change (a NEW vid is eligible where its pool was reached and its
  declaration admits; `node replay.mjs <tree> <render> x <baseTree>`), `moved.mjs`.
- `facts.mjs` (this seat): one compact row of facts a town (`factsOf` + the economy fields the rows name) over
  `corpus.ndjson.gz`; `rows.py`: each worklist row's printing towns (the before inventory) with the named facts.

## Batches

THE BEFORE RUN at 48fedbe98 (the 720, census3d): 29,876 distinct sentences. Of the 148 rows, 12 are GONE AT THE BASE (all
DS-GEN-16, LIVING-MEMORY / LEGACY-*: the joined line prints those lines in their template form now, the reader's folds no longer
print) and 3 no longer print in the town they were read in (DS-GEN-13 MARKET-OPEN v3 23470: plague-cured at the base, 71 towns
left; WAREHOUSES v2 02808 02809: siege-cured at the base). The replay reproduces the render's draws (probe mode: 49,112
single draws, 0 misses).

### Batch 1 · DS-ECO-12 (the income mix, the critical imports) · REWORDED, no draw moved

Nine lines reworded to claim no more than every printing town bears (vid unchanged, so no draw moves: the measure is the
record's count of printing towns where the old claim is false; the after census reads the inventory):

| row(s) | line | prints | false by the record | the cure |
|---|---|---|---|---|
| B13238 | INCOME MIX one source v1 "comes from a single trade" | 170 | 20 with no exports and no imports (the one source is `Agricultural Rents` in every town but one) | "a single source" |
| B03337 | INCOME MIX one source v2 "depends on one trade" | 158 | 13 (as above) | "one source of income, whether or not they earn from it directly" |
| 18271 | INCOME MIX criminal present v2 "honest traders compete against it" | 119 | 23 with no market | "the people who earn theirs honestly do not know who is making it" |
| 01193 | INCOME MIX broad spread v1 "none of them brings in a real portion" | 15 | 14 with a leader at 15-19% (a real portion = ≥15, DS-ECO-6's own scale) | "lives on many trades, and no one of them carries the town" |
| 20338 20336 20354 20341 20334 20335 | CRITICAL IMPORT land v1 "the country produces no {good}" | 18/15/11/10/3/1 | 7/9/7/5/3/1 (the good made or listed here: luxury, gems, timber, grain) | "does not give the town enough {good}, so the town buys in what it needs" |
| 14987 | CRITICAL IMPORT land v2 "None of the {good} ... comes from the country here" | 3 | 3 | "Not enough of the {good} ... ; the town brings in the rest" |
| 20355 | CRITICAL IMPORT land v3 "produces no {good}" (no imports) | 2 | 2 | "does not give the town enough {good}, so the town must look elsewhere for the rest" |
| 18237 18245 18246 18231 18224 | CRITICAL IMPORT house v1 "the country ... produces none" | 15/6/2/1/1 | 15/6/2/1/1 (grain grown; dairy, grazing; a fisher's landing; hides) | "does not give enough of it" |
| 28786 | CRITICAL IMPORT house v2 "Whatever {good} ... must come from elsewhere" | 8 | 8 (dairy farmer, grazing) | "A good part of the {good}" (not "Much of": the slot takes plural goods, "grapes") |

Rows cured: 18 (B13238 B03337 18271 01193 20338 20336 20354 20341 20334 20335 14987 20355 18237 18245 18246 18231 18224 28786).
PARKED, a word the vocabulary lacks (told to the chair): INCOME WEIGHT the practice of magic v1 v2 (B12119 28731 28726 28745
21275): the line says practitioners carry a large part of the town's business; the pool's key is `compound.magicInfluence` ≥ 60
and the `magic` atom (magic functions) holds in every printing town, but in 5 of the 54 towns that print the pool the page itself
says "No arcane practitioners on the rolls" (r2r-town-29, r2r-village-2, r2s-indebted-hamlet-0, r2s-indebted-village-0,
r2s-recently_betrayed-thorp-3): the fact needed is "a practitioner is on the rolls", which no atom answers (a tier cut would
silence a true village, r2s-insurgency-village-2, and leave r2r-town-29 false).
GUARD: `tests/domain/corpusEcoTailGuards.test.js` (new, the batch's ONE collected test): 9 GONE rows (each red at the base for
the right reason: the old wording drawn) and 9 KEEP rows (the same vid still drawn in another town, its unchanged stem: green
before and after); the plant (v1 broad spread's old text put back in the leaf, not committed) reds its row.
Doors: generator --check 0; presumed --check fresh 147 = the base's 147; the grid 2 falls = the base's 2 (r2r-city-0,
r2s-insurgency-metropolis-0 P7a); strict-domain 0, the type ratchet 0, eslint 0 on the touched files; the 57 test files that name
the corpus leaves: the base's 38 reds (16 files) exactly, carried from the joined line, none new; the batch's 18 green.

## The veto list (every new or reworded line, with the towns it was read in)

Batch 1 (DS-ECO-12; read where the old line printed, the reword in its place; smallest / largest / a crisis):
- INCOME MIX one source v1: "More than half of what {settlement} earns comes from a single source, and most households depend on
  it one way or another." — r2r-thorp-0 (Izamitza), r2s-wartime-village-1 (Puribagh), r2r-thorp-58 (Tallpatan, a siege).
- INCOME MIX one source v2: "Almost everyone's living at {settlement} depends on one source of income, whether or not they earn
  from it directly." — r2r-thorp-1 (an occupation), r2s-mass_migration-town-2 (Shivanand), r2r-thorp-17 (a famine).
- INCOME MIX criminal present v2 (dm-only): "Some of the money in {settlement} is made outside the law, and the people who earn
  theirs honestly do not know who is making it." — r2r-thorp-10, r2s-wartime-metropolis-3 (Nanwan), r2r-village-43 (a siege).
- INCOME MIX broad spread v1: "{settlement} lives on many trades, and no one of them carries the town." — r2r-town-16 (Birkhel),
  r2s-wartime-metropolis-3 (Nanwan), r2s-famine-town-1 (Hongcheng, a famine).
- CRITICAL IMPORT land v1: "The country around {settlement} does not give the town enough {good}, so the town buys in what it
  needs." — r2r-thorp-0 (metals), r2s-wartime-city-1 (grain), r2r-thorp-40 (timber, an occupation).
- CRITICAL IMPORT land v2: "Not enough of the {good} used at {settlement} comes from the country here; the town brings in the
  rest, or goes without." — r2r-thorp-12 (metals), r2s-slave_revolt-city-2 (luxury goods), r2s-famine-thorp-0 (a famine).
- CRITICAL IMPORT land v3: "The country around {settlement} does not give the town enough {good}, so the town must look elsewhere
  for the rest." — r2r-thorp-1 (an occupation), r2s-wartime-hamlet-3, r2r-thorp-54 (a famine).
- CRITICAL IMPORT house v1: "Some of {settlement}'s work cannot go on without {good}, and the country around the town does not
  give enough of it, so the town buys from outside or that work stops." — r2r-hamlet-19 (livestock), r2s-wartime-metropolis-3
  (grain), r2s-occupied-village-1 (an occupation).
- CRITICAL IMPORT house v2: "A good part of the {good} {settlement}'s work uses must come from elsewhere; when none comes, that
  work stands idle." — r2r-hamlet-12 (livestock), r2s-wartime-metropolis-1 (grapes), r2s-famine-hamlet-2 (a famine).

## Rows struck (true by the record), with why

- GONE AT THE BASE (the fold prints nowhere at 48fedbe98): 03994 B21024 B03874 B21019 21304 B14751 B19451 B14745 B14746 B03823
  B00464 B21016 (DS-GEN-16). NOTE, honestly: the same pool lines still print in their template wording (e.g. LIVING-MEMORY v2 "Ask
  about the village's present quarrels in X and before long somebody brings up the succession crisis.", 9 towns); the readers'
  reason (no present quarrel on the record) may hold there too: NOT measured here, left in "what is left".

## Rows named for other groups

## Registers named stale

- The shift register (`docs/content/prose-shift-register.json`, SEAM car 4) and the prose byte baseline: red at the base already
  (carried); every reword moves the per-pool hashes and bytes again. Named, re-derived once at the close.

## Guards owed

## What is left of the worklist
