# BAR2-PLACES-2 · hand-back (2026-11-15)

Seat BAR2-PLACES-2, the successor of BAR2-PLACES on `lane/bar2-places-2026-11-15`. Base: the branch's tip **fd4e69e8b** (read at seating; the joined line at dcb069bff already merged into it by the predecessor). The predecessor's hand-back (`BAR2-PLACES-HANDBACK.md`) is my state; nothing committed there is redone. Work in two scratch worktrees (`wt` at the base for the before-census and the base books; `wt2` for the cures), detached, pushed by explicit refspec. The repository's main checkout was not touched.

## The rulings worked to

The predecessor's (PL1 to PL6, copied in its hand-back), the brief's laws, and **the chair's grant PT3** (vetoable by the owner): a reworded line that names a registered thing and is TRUE WHEREVER IT PRINTS may stand; its fresh hit in the presumed-things register is NAMED here and the register is not touched.

## Batch 3 (one commit): C3396 and the slavic social texture

Measured on a fresh census at the base (fd4e69e8b, the 720: `runs/before`, 720 births, 0 errors) and on the reader's own town born as the census bears it.

| id | writer | prints / false at base | cure |
|---|---|---|---|
| C3396 | `src/domain/crisis/crisisCast.js :: exploiterCandidates` (CAST_REASONS.exploiterPower) | the line "exploits it: / profits: <person> · the strongest figure in a power that gains" prints in **16 of the 720** (6 exploiter, 10 profiteer) and is **false in 0** (each holder is ranked first, membersByRank's order, in a power that gains); **false in the reader's town** bar0-city-under_siege+famine-rand-5 (not among the 720): the famine's exploiter Bertram Krüger, the blade captain, card power 9, holds NO rank in the War Council (rank 1: Hinrik Maier) nor in the Grain Holders. The grade-2 pick sorts by CARD power, so the strongest card wins whether or not it holds a rank. | the pick is KEPT (no draw moves); the reason says the standing the record holds: "the strongest figure in a power that gains" only for the one ranked first in a power that gains; any other grade-2 pick is **"one of a power that gains by the crisis"** (new: `CAST_REASONS.exploiterMember`, in the brunt's own form `bruntMember`). Names no power (factionRename.js's law for this vocabulary). |
| (the slavic social texture) | `src/data/cultureProfiles.js :: CULTURE_PROFILES.slavic.socialTexture[1]` | **27 of the 720 by the record** (the exports print it in 9, the towns with a bathhouse): "shared ovens" false in **27** (no oven house: the vocabulary names none, the catalogue's Bakers is a guild bakehouse); "bathhouses" false in **18** (its declaration `institution: bathhouse` was read only at the draw, in resolveConfig, where only the tier is known, so it was never enforced: 9 of 27 hold a bathhouse: the 8 cities and metropolises and one town, r2s-mass_migration-town-0); "wells" false in **8** (the cities and metropolises drink from an aqueduct, cisterns and fountains) | reworded to what every printing town holds: **"Shared water and seasonal work make private life unusually communal."** (the water source is required in every town: institutionalCatalog.js :: 'Water source', the waterSupply group; a well or spring in a thorp, an aqueduct in a city). The row becomes a plain string (its `needs` dropped: the text names no bathhouse). The slot keeps its draw: the declaration was never answerable at the draw, so no town's pick moves (the hashes below). |

### The after-run (the census's 720 at the tip against fd4e69e8b)

`inventory_diff.py` on the tabs (World, Systems, Summary, Table): 29,965 → 29,965, **nothing gone, new or moved**: neither line prints on the tabs' inventory in the 720 the way it changed (the cast line is true in all 15 dumps that print it, before and after; the culture line prints only on the exports). On the exports (`SURFACES=PDF,Journal`): 36,851 → 36,851; GONE "Shared ovens, bathhouses, wells, …" and its "Cultural notes:" form, **9 → 0** (the PDF's culture row reads the declaration against the record, so it printed only in the 9 towns with a bathhouse: false in all 9 by the ovens, in 8 by the wells); NEW "Shared water and seasonal work …" and its "Cultural notes:" form, **0 → 12**: the 9 inheritors, and 3 towns (r2r-town-43, r2s-monster_pressure-town-2, r2s-wartime-town-1) whose exports' Social texture row was empty before (the old line was refused there for want of a bathhouse) and now prints a line TRUE there (each holds its water source: "Wells, fountains, or piped water"); "Social texture" and "CULTURAL NOTES" 357 → 360 and 350 → 353 with them. No other sentence moved.

### The presumed-things register (PT3)

The reword names NO registered thing: the rule book reads no word for water or seasonal work. So it makes **no fresh hit** (`--check`: fresh 0). What it does make is ONE STALE ROW: the widened register's `src/data/cultureProfiles.js` row `["house: bathhouse", "family", "Shared ovens, bathhouses, wells, and seasonal work make private life unusually communal.", "df619364bd557acb"]` matches nothing. The walker's law ("⛔ no stale row: a cured line leaves the register in its own commit") would red on it, so I removed exactly that row through the door's shrink-only mode (`node scripts/presumed-things-door.mjs --shrink`: the one row; banked 4687 → 4686; `--check` fresh 0 stale 0), as the predecessor's two rows were shrunk. **This is the one touch of the register, a shrink, never a bank: for the chair's veto** (PT3 said "not touched"; it was written for a fresh hit, which this cure does not make). Reverting it is one hunk.

### The guard

`tests/generators/bar2Places2Rows.test.js`: 8 arms on census births. RED AT THE BASE: 5 (the C3396 CURED arm and its LAW arm over five births; the three slavic CURED arms: r2r-thorp-23, r2s-wartime-metropolis-1, r2s-under_siege-thorp-1). KEEP, green at both: 3 (r2s-famine-town-3's exploiter and r2s-under_siege-city-3's profiteer, each ranked first, keep "the strongest figure"; r2r-thorp-10 keeps the pool's row 0, "Household and communal labor obligations …": the slot keeps its draw). A PLANT (not committed: the twin disabled) reds the two C3396 arms. Green at the tip, 8 of 8.

### Every new or changed line (the veto list), with three towns it is read in

| line | smallest | largest | crisis |
|---|---|---|---|
| CAST_REASONS.exploiterMember "one of a power that gains by the crisis" | (none in the 720: no grade-2 pick there is unranked) | bar0-city-under_siege+famine-rand-5 (the reader's town, a city) | the same (under siege and famine) |
| slavic socialTexture[1] "Shared water and seasonal work make private life unusually communal." | on the exports: r2r-town-43 (record: r2r-thorp-23) | r2s-wartime-metropolis-1 | r2s-wartime-town-1 (war), r2s-plague_onset-city-0 (plague); record only: r2s-under_siege-thorp-1 (siege), r2s-famine-hamlet-3 (famine), r2s-occupied-village-3 (occupation) |

## Gates at the tip

strict-domain 0; the type ratchet 0; eslint on the three touched source and test files 0; the presumed-things door `--check` fresh 0 stale 0 (after the one-row shrink above); the twelve-birth grid 0 falls.

Re-keyed by identity (the same file's own form): `docs/census/declarations/CULTURE_PROFILES_DAILY.json` (the slavic socialTexture[1] line's text, its `needs` emptied and its `stop` "shared ovens" dropped, a dated note beside it). NOT ledgered (a guard owed, for the census ledgers' seat): the new reason `exploiterMember` has no row in `docs/census/declarations/CRISIS_CAST_REASONS.json` nor `crisisCast.CAST_REASONS.json` (no test reds on the absence; I did not add one, to move no ledger count).

## The books (F2), for what I touched

ONE RUN ALONE at the tip through `sh scripts/gate-tail.sh`: 71 files (every test file naming `crisisCast`, `cultureProfiles` or the widened register, plus the brief's seventeen law suites, all present). 64 pass. 7 files red, 12 arms:
- `tests/domain/facts/census2dTables.test.js` (2 arms: the ledger line verbatim; the row's declaration): MINE, a stored ledger moved by the declared reword; re-keyed by identity as above; green alone after.
- the other 6 files, 10 arms, ALL RED AT THE BASE fd4e69e8b with BYTE-IDENTICAL failure messages (the same files run alone there, the messages compared with paths stripped): CARRIED from the predecessor's declared cures, none moved by mine: `tests/property/generatorGoldenMaster.test.js` (1), `tests/generators/pipelinePinnedMode.test.js` (A1, A2, A5), `tests/generators/generationForkCensus.test.js` (A1, A3e), `tests/lint/proseWiringCensus.walker.test.js` (the dry read; the committed census), and two the predecessor's table did not name, red at fd4e69e8b all the same: `tests/generators/institutionBudgetPromise.test.js` (sixty seeds byte-identical with the density factor at 1.0: 37 rows) and `tests/lint/generationForkRegistry.contract.test.js` (A3s: the FINAL comparand tally, same 26 against 28). Both read golden-type fixtures; for the close's doors' seat with the rest.
- NO LAW IS RED BY MY CURES. The owner's door's six tests (townCartographyCalibration 2, dossierProseManifest 3, presetLightingWitness 1) were not touched.

THE REFERENCE CONFIGURATIONS: every record of `goldenCorpus` hashed whole and by top-level field at fd4e69e8b and at my tip: **0 of the 525 move beyond the predecessor's 334** (no field family). Why, measured: the corpus's 42 slavic towns all draw socialTexture row 0, and no golden town's exploiter or profiteer is an unranked grade-2 pick.

## What is left

Nothing of my two rows. Owed: the cast-reason ledgers' row for `exploiterMember` (above). For the chair's veto: the one-row register shrink (PT3).

## Instruments

As the predecessor's: `git archive origin/lane/chair-2026-11-08 docs/chair/2026-11-14/probes/READ-ALL` and `origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3` into the scratchpad; `census3.sh <tree> <out> 4`; `inventory.py <out> before.json`. One seed alone: `TREE=<tree> OUT=<out> SEEDS=<file> node <CENSUS-3>/births.mjs` (with `node_modules` linked into `<out>`). The 525 hashes: a scratch test file (never committed) that births `goldenCorpus()` and writes each record's whole and per-field hash.

## The hand-back's state

Handed back by count: my meter read 209,956 at 16:59 UTC, past the 200,000 line, mid-batch; the batch was finished (its after-run read) and pushed as the hand-back. I push nothing more.
