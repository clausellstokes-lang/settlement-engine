CLEAR

# REVIEW-AGREE-3, second pass — the agreement lane at 69b53decd (2026-11-13)

The eighth seat's cures (faa20bc6c → 69b53decd, 15 commits), read against my first file
(`REVIEW-AGREE-faa20bc6c-2026-11-13.md`, beside this one). Base: the line 3575cf061. The reviewer changed nothing on
the lane. Section A was committed before PART SEVEN was read.

## A — COLD, TWENTY FRESH TOWNS AT 69b53decd (before PART SEVEN)

Seeds never used before: `r3-<size>-<i>` (every dial random, as the census births) and `r3s-under_siege-<size>-0`,
rendered through the tip's own `OutputContainer` as the owner with the census's walk (every tab, every disclosure).
The twenty: river `r3-town-24 r3-city-16 r3-metropolis-4 r3-village-3`; port `r3-town-21 r3-city-0
r3-metropolis-15 r3-thorp-0`; crossroads `r3-town-9 r3-town-11 r3-thorp-1 r3-hamlet-1`; mountains `r3-town-3
r3-town-12` (with a pass) and `r3-thorp-2` (without); off the mountains with coal `r3-thorp-24 r3-village-2`; river
on the coast `r3-thorp-4`; siege `r3s-under_siege-town-0 r3s-under_siege-city-0`. Read: the Economy tab, the
people's goals ("Wants"), the Summary.

What reads right: no "Strategic Crossroads" off a crossroads anywhere on the twenty pages (the two hits are the
crossroads towns 9 and 11); river and port towns say "River Toll" / "Harbour Dues"; every chain an NPC's goal names
("Herbalism & Remedies", "Gambling & Arena", "Taverns & Social Life" …) is a flow card on that town's page; no pass
off the mountains; no "gate tally" beside "few ways in".

What reads wrong:

A1. **"Managed felling and sawmilling" beside "No one here works the timber."** r3-thorp-0 (port, shipbuilding
timber), r3-town-3 (mountain timber; its Timber & Lumber card Vulnerable), r3-city-0 (port; its imports also list
"Timber"). Three of the six towns that print the felling line.

A2. **The coal twin under a head it denies.** "Iron & Metalwork — Coal is dug here and sold to the forges of other
towns; no forge here burns it" in four towns (r3-thorp-24, r3-thorp-4, r3-village-2, r3s-under_siege-town-0). The
words are true of the forge, and the town exports Coal; but the income head still says Iron & Metalwork, and in
three of the four nothing on the roster digs coal (no mine, no charcoal burner, no coal flow): "dug here" has no
one digging.

A3. **"Local quarry provides dressed stone" beside "No one here works the stone"** — r3-city-16, r3-thorp-2 (the
parked F4 class, as ruled).

A4. Not the lane's, seen in passing: "fed, but only just" beside "grows a little more than it eats" (r3-thorp-24,
census row 1a); "support dense populations" in a twelve-person thorp (row 14); r3-thorp-2's origin "grew at a
strategic mountain pass" on a mountain town that holds no pass resource.

## B — THE TOLL'S NAME, BY MY MEASURE (executed)

| Surface | Instrument (mine) | faa20bc6c | 69b53decd |
|---|---|---|---|
| Every stored string of the 4,141's 3,520 births off a crossroads, but `activeChains[].label/.resource` | a walk of every string, by path | 636 births (simulationTrace 636, goal.short 139 lines, goal.long 109) | **0** |
| The 720's rendered pages (the census's walk, owner's view) | `census.sh`, then a grep of every page off a crossroads | 12 towns | **0** |
| The 720's 605 towns off a crossroads: the PDF document text, the Foundry module files, the world export's importer journals, the tonight sheet, the AI grounding prompt, the daily life, the causal views, the explanation rail for every entity | my own sweep through vitest, the repository's eight builders, every town | PDF 1, Foundry import 12, AI prompt 87, causal 87, explanation 87 | **0 on every one** |
| The world export itself (player and DM) | a walk of every string, by path | 87 | 87, every one `settlements[].dossier.economicState.activeChains[].label/.resource`, the two ruled carriers |

The instrument is live: it reads the renamed toll ("River Toll" / "Harbour Dues") in 97 of the 605 towns on both
trees. **F1 is cured on every surface I could drive.**

**Plants, each alone in a scratch tree at 69b53decd, reverted, against the print-site walker, the writers' walker,
`tollNamePrintedEverywhere`, `coherenceAgreeCures`, `projectionAgreement` and `chainPrintName` (98 tests, green
unplanted):**

| Plant | Red |
|---|---|
| TP3: the pipeline appends a toll's catalogue `label` to the stored `pressureSentence`, read by destructuring `({ label }) =>` | **3** (the sweep pin, all three seeds) |
| TP1: a page component (`OverviewTab.jsx`, the Notable connection heading) prints `activeChains.map(({ label }) => label)` | **0 — green** |
| TP2: the same through `x['label']` | **0 — green** |

The walker's binding grammar (`chainBindings`) sees `chain.label`, `ch.label` and a named binding from a chain list,
not a destructured or bracketed read; the sweep pin drives the record and the exports, not the rendered dossier,
and the census that does render it is not a test. A page written later that prints the record's name this way ships
green. **Not a live fault** (0 on the 720 pages); a guard gap, LOW (G1 below).

## C — THE TRADE LISTS (executed)

My instrument (every export and produced-locally entry, read raw, with its parenthetical off, and through the
institutional service map's `exportLabel → output`, plus a loose substring read, against
`goodsOnlyRefusedChainsMake` of the town's chains), the 4,141: **faa20bc6c 69 births** (Educational services 38,
Pilgrimage & religious tourism 25, Financial services 14: PART SEVEN's 77 lines exactly) → **69b53decd 0**, loose read 0.

A plant of a writer that takes the list under another name (`addRefused(primaryExports, activeChainsList)` pushing a
refused chain's outputs, in a new file) is **red at run time** (4: the F2 pins and both arm-2 seed sets); the
writers' walker stays green on it, by design (it reads names).

**A thirty-first writer, by reading:** `src/domain/events/mutateWorld.js :: addTradeGood` writes the list through a
computed key (`nextEc = { ...nextEc, [listKey]: [...list, written] }`), which the walker's `WRITES` pattern cannot
see. It is a user-authored world event (class USER; it also writes `config.customTradeGoods` so a regeneration
re-applies it), so it is not a birth fault and asks no leaf by right; the census is short one row (G2 below).

## D — THE THREE LINES AND THE FELLING ORIGIN (executed; pages read)

- **The gate tally.** 720 pages with "gate tally" and "few ways in": faa20bc6c 22 → **0**. The tally left 86 pages,
  every one a town whose gate home (`defenceOf(record).gate`) is false; the 103 that keep it all have a gate. No
  true line removed.
- **Agriculture.** Against the line the 720 lose it in **22**, and I read every one in the record: all 22 riverside
  towns, cities and metropolises, none earning Agricultural Rents, 21 fed by their fishing, 1 by no food chain. "None
  farm" holds.
- **The coal twin.** 294 births of the 4,141 (52 of the 720 pages); no forge house in any (0 of 294 by the census's
  words); the forge line it replaced stood in 294 with none, and the 472 that keep the forge line all have one. I
  read thirty pages: 28 export Coal beside "Coal is dug here and sold to the forges of other towns". **Three of the
  720 do not** (r2r-thorp-45 and r2s-under_siege-village-3: "No significant exports."; r2r-village-21 exports only
  fish), 7 of the 4,141: the new words name a sale the trade list does not carry (G3). And "dug here" is a working
  claim: by the ruled home (`chainWorksResource`) a chain works the coal in 54 of the 294.
- **The felling line, an origin.** 83 births revert to "Timber sourced from more distant forests and resold or
  processed locally" (none holds a wood house by the census's words). **In 6 of the 83 a chain works the town's own
  timber** (rvw12-town-73, rvw12-city-63, rvw12b-village-217, -220: Mountain Timber ✓ Running through the Charcoal
  burner, exporting its own Hewn timber and Pine planks; agree-village-35 and r2r-village-50, whose Timber & Lumber
  card is Vulnerable, a working state by the leaf, exporting Barrels and containers). Rendered at
  69b53decd, rvw12-city-63 reads "Timber Trade — Timber sourced from more distant forests …" beside its exports
  "Hewn timber, Pine planks" and the card "Mountain Timber ✓ Running". The cure judged "worked" by roster names, not
  by the chain model the chair ruled its home; in these six it removed a truer line and printed a false one (G4).
  One of them is on the 720's pages (r2r-village-50).

## E — THE CENSUS AND THE MOVES (executed)

`census.sh` at 69b53decd (720, exit 0) against my line run: every row as PART SEVEN states it; **against faa20bc6c
only F4 moves (254 → 202, BETTER)**; no row rises against faa20bc6c; against the line the rises are faa20bc6c's.
Town by town against the line, every entrant of every rising key is a holder **except row 2's six** (r2r-thorp-37,
-51, -52, r2s-famine-city-3, r2s-famine-metropolis-3, r2s-religious_conversion-thorp-1), whose cause I measured in my
first file (cure 6 moves `storageMonths`; the two sentences round it differently): **exposure, as PART SEVEN says**,
owed by the second wave's Lane 1b. P12saw's and P12coal's non-holder entrants are 0 now.

The seat's field diff, my run, faa20bc6c → 69b53decd, the 4,141: **1,138 births** (golden 156); families
simulationTrace 636, incomeSources 374, npcs 228 (goal.short 148 lines, goal.long 109, secret.what 9: words only, no
person changes), economicStrengths 210, primaryExports 69, pressureSentence 5, arrivalScene 2. **0 label moves**;
no roster, chain, score, power or food figure moves.

## F — THE SUITE (executed)

`sh scripts/gate-tail.sh npx vitest run --maxWorkers=2` at 69b53decd, the ledger ref fetched first, 6,277 s, exit 1:
**36 failed files of 3,221; 51 failed tests; 38,733 passed; 254 skipped**. Title by title against my own run at
faa20bc6c: **the same 55 entries (50 tests and 5 files at load), plus one**: `editCorpusRatchet` A5, a 600 s timeout
(its assertion never ran) while my census, sweeps and plants loaded the machine. Re-run alone on a quiet machine
(`sh scripts/gate-tail.sh npx vitest run tests/property/editCorpusRatchet.test.js --maxWorkers=1`): **A5 passes**;
the file's reds are A4, A6, A7, A8, as PART SEVEN lists them. (A5 took 440 s at faa20bc6c under the same suite; it
runs close to its 600 s limit, a flake under load, not the lane's.) None of PART SEVEN's nine own reds and none of
its thirteen bundle reds fails. **The failing set is otherwise my first review's, title for title; none is the
lane's to cure.** The golden surfaces read as PART SEVEN states them: the fence's driven hash 1062f65c…, the herald
02d3fa8e…, the PDF golden scoreAvg 41 / institutions 43 / npcs 35, the lighting witness green, the generator golden
moved (156 rows by this seat in my field diff).

## G — VERDICT AND FINDINGS

**CLEAR.** Both findings of my first review that held the release are cured by my own measure: the toll's
catalogue name is gone from every stored field of the 4,141 but the two ruled carriers, from the 720's pages, the
PDF, the Foundry journals, the AI prompt, the causal views and the explanation rail; the refused-only goods are gone
from both trade lists, all 77 lines, with nothing else moved. The gate tally and Agriculture are cured, no label
moves, no census row rises against faa20bc6c, and row 2's six are exposure as stated. Four LOW findings remain;
none is a fault the release must wait on, and each has a named home.

- **G1 (LOW, guard gap).** A page component printing the record's toll name through `({ label })` or `x['label']`
  turns nothing red (plants TP1, TP2); the print-site walker reads named bindings and the sweep pin does not render
  the dossier. CURE: a rendered-dossier arm in the sweep (the census's walk on its three seeds), or the walker reads
  a destructured `label`/`resource` beside `activeChains`.
- **G2 (LOW, census short a row).** `src/domain/events/mutateWorld.js :: addTradeGood` writes `primaryExports`
  through a computed key the writers' walker cannot see; class USER. CURE: its row, and `\[\w+Key\]\s*:` in `WRITES`.
- **G3 (LOW, new words).** The coal twin "Coal is dug here and sold to the forges of other towns" stands where the
  export list carries no coal: 3 of the 720 pages (r2r-thorp-45, r2s-under_siege-village-3: "No significant
  exports."; r2r-village-21), 7 of the 4,141. And a chain works the coal in only 54 of its 294 towns. CURE: the
  twin's sale clause only where Coal is exported (or the W2 lanes' chain-worked reading), at the owner's veto of the
  words.
- **G4 (LOW, a cure that printed a false line).** The felling origin's revert judged "worked" by roster names: in 6
  of the 83 (r2r-village-50 among the 720; rvw12-city-63 rendered) a chain works the town's own timber and the town
  exports it, and the page now says "Timber sourced from more distant forests". CURE: the revert keys on
  `chainWorksResource` (the home the chair ruled), keeping the local line where a chain works the timber.
