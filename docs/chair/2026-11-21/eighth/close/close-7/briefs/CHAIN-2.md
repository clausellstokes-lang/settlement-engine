READS WHOLE: `close-7/briefs/CURES-COMMON.md` first (it names what else you read), then this file, then the header comment of
`scripts/census/page-census.mjs` and `src/domain/coherence/pageCensusFindings.js` whole. WINDOW: 1,000,000 tokens.

# CHAIN TWO: READ-25 (a measure), then B1(i)'s table, then C1's three answers, then B1(i)'s build (CLOSE-7; RULING-R24)

## PHASE 1 — READ ONLY (no file under src/, tests/ or scripts/ changed in any tree; no commit). Then SEND TO THE CHAIR (stop).
(1) READ-25 (R24-0): the page census's WHOLE battery of patterns (`pageCensusFindings`, as `scripts/census/page-census.mjs`
    applies it: the real OutputContainer as its owner sees it, every group, sub-tab and disclosure opened) run over V, LIT, on
    `/home/user/wt/lit`. The script does not take a plan of configs: write a RUNNER that does, reusing its renderer and
    `pageCensusFindings` unchanged, committed-to-be under `close-7/read25/` (chain one uses it for its proofs: make it take any plan
    file, C or V, and print per pattern the count by size and the seeds). Prove the runner on C against what the page census
    reports for the same kind of birth if you can; at least say its count of births rendered and patterns applied. OUTPUT: every
    pattern that fires on V, its count by size, three seeds each; and the same run on C beside it (what the plains-only corpus hid
    is what fires on V and not on C). No door is changed and no register is touched. Report `close-7/reports/READ-25.md`.
(2) B1(i)'S TABLE (R24-B1(i)), on V: every catalogue row of a house that lives on a thing the land gives (fish, timber, game, ore,
    stone, a harbour, salt, clay and the like: YOU NAME THE ROWS from `src/data/institutionalCatalog.js`, each with the thing it
    lives on), and per terrain the count of V places where it stands though neither the terrain, the route nor the place's nearby
    resources give that thing (say how you decide "gives": the terrain's data, the route, `RESOURCE_DATA`). One table, in
    `close-7/reports/B1I-TABLE.md`. Also read how `getResourceMultiplier` COMBINES the terrain modifier with the resource boosts
    (multiplied? maxed?), whole, and say whether a terrain row of 0 would also kill a resource's boost (the ruling: that is wrong),
    and the cascade's path (`applyCascadeInstitutions`): does it read the same multiplier?
(3) C1'S THREE ANSWERS (R24-C1), by grep and read: (a) does a clean form already carry "Town Council", "City Council" or "Senate"
    at the same size (`rulingStructure.js` and the seat table); (b) HOW MANY PLACES IN `src/` READ THE STORED NAME TO PRINT IT
    (`powerStructure.government`, `governingName`, the governing faction's `faction`): list each file :: symbol, and say which print
    and which compare or key on it (a reader that only compares must keep the stored name); (c) every test file and title that pins
    "Corrupt Council", "Corrupt City Council" or "Shadow Senate". Report `close-7/reports/C1-ANSWERS.md`.
Final message: READ-25's patterns that fire on V and not C (counts), the B1(i) table's totals by row, C1's (a)/(b)/(c) in a line each.

## PHASE 2 — B1(i)'S BUILD (on the chair's word on the table, which CLOSE-7 brings you), in `/home/user/wt/b1i`
ROWS ON THE TERRAIN'S OWN MODIFIER TABLE (`TERRAIN_DATA[terrain].institutionModifiers`) that take a named house's chance to
nothing where the land gives none of it AND the place's resources give none of it; a place whose resources or route give it keeps
its plain chance; the cascade obeys the same rule; NO CATALOGUE GATE; THE ROLL IS STILL MADE (no other house's draw shifts).
PROOF: C BYTE-IDENTICAL (the hash of the 900 births, before and after); on V only places of the named terrains differ, each only by
the loss of those houses and what follows from them (say what follows); red first on named desert hits from `read24/visitor/
b1i-hits.tsv`; the battery's pattern if the chair asks for one. Then stop.
