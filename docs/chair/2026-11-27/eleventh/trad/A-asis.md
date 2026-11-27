# (A) THE DRAW AND THE DROP AS THEY ARE (tree cccda7569, read whole; PLAUSIBLE unless a count is cited)

**THE FIRST FACT: THE DRAW IS NOT A STEP OF THE GENERATOR.** No file under `src/generators/` calls genesis (grep: 0). The draw `src/domain/traditions/genesis.js :: deriveFoundingTraditions(settlement)` is a pure function of the FINISHED record (seed `_seed ?? id`), run at two times only:
- VIEW TIME, every render, while the record holds no lit mirror: `shownTraditions.js :: shownOver` (the owner's tab, the PDF section, the dossier search, the description rotation) and, at the owner's SAVE, `publicProseCompose.js` site `traditions` -> `sharedTraditionRowsOf` (the shared page prints that stamped text, never a draw).
- ONCE, at the first lit tick: `worldPulse/traditionsKernel.js` (PASS 1, `baseRecs = priorRecs || deriveFoundingTraditions(s)`), which STORES the recs in the spatial ledger / `settlement.traditions` mirror. All 1,800 births of C and V are in preview (no mirror) and stamped `0.10.0` (CONFIRMED).

So EVERY fact of the place exists when the draw runs: institutions (live or not), economy, terrain, route, crises, the food record. Nothing a rite needs is unknowable at the draw. What CAN differ from the draw's facts is only (i) a later tick (a lit mirror is drawn once and then the record moves under it: a market closes, a smith burns; the tab drops the stored row then), and (ii) the shared page's floor (below).

**THE BAND** (rows a place is meant to hold): `genesis.js :: COUNT_BAND` (thorp 1-2, hamlet 1-2, village 2-2, town 3-3, city 4-5, metropolis 5-7, capital 6-8); the draw takes `band[0] + randInt(0, band[1]-band[0])` (fork `count`); `traditionCountCap` exports the upper bound (T-4 adoption cap). Row 0 is the founding core (elements with `foundingFit`: founding, first-landing, charter); rows 1.. are additions over all 16 elements, with a 5-attempt motif reroll (forks `el:k`/`act:k`).

**WHAT THE DRAW ALREADY KNOWS** (weights, not needs): `foundingElementWeight` / `elementWeight` weigh `first-landing`, `river`, `tide` at 0 where `tradeRouteSemantics.js :: waterAccessKind(terrain, route)` answers `none` (CENSUS-1c unit 6), but NOT river at a coast or tide at a river; and the field rule `fieldRiteRefused` (G64/G72, floor `FIELD_RITE_SINCE = '0.10.0'`) rerolls a field rite where the food record names sources without grain and farmland is off the roster (up to ten further attempts; never dropped). Market, smith and the fair's market are NOT read by the draw.

**THE DROP** `src/domain/traditions/shownTraditions.js :: shownOver` -> `facts/drawDeclared.js :: filterDeclared` (poolId `traditions:tab`, kind A) over `motifNeeds(rec)` = the element's corpus `needs` (`data/traditionCorpus.js :: TRADITION_ELEMENTS`) plus `ACT_NEEDS` (`fair` -> `market`, NOLANE-2, held in shownTraditions.js itself). A need admits only when `factVocabulary.js :: atomHolds` answers `true` (`declarationAdmits`: unanswered refuses). A DM's custom row (`custom:` id) stands as authored. Every need and its reader:

| need | declared by | reader (`factsOf`) | knowable at the draw? |
|---|---|---|---|
| `market` | element `market`; act `fair` | `facts/market.js :: marketOf`: a LIVE (`institutionRoster.js :: isLiveInstitution`) institution tagged `market` or `guild`+`trade` (own tags, else the catalogue's by name) | yes (the roster is final at view/mint) |
| `institution: smith` | element `forge` | `facts/institutions.js :: hasInstitution(record,'smith')`: a live name matching `smith(y|s)|forge|blacksmith`, not an access row | yes |
| `navigable` | element `first-landing` | `facts/water.js :: waterOf`: `waterAccessKind(terrainClassOf, tradeRouteOf) !== 'none'` | yes; the draw's own weight already reads the same kind (0 mismatches of 1,800, CONFIRMED) |
| `river` | element `river` | `waterOf().river` (kind `river`) | yes |
| `coast` | element `tide` | `waterOf().coast` (kind `maritime`) | yes |
| (field) | element `field` | not a drop: genesis's own reroll (`fieldRiteRefused`) | yes, already at the draw |

**WHAT ELSE DROPS A ROW AT VIEW TIME:** nothing on the owner's tab (no audience, veil or crisis gate; the player view uses the same set, only its descriptions are the reader's). THE SHARED PAGE (`sharedTraditionRowsOf` -> `drawnSetOf`) draws the SAME set and admits it over THE FLOOR: the live roster less every hideable house (`people/cardVeil.js :: isHideableHouse`) and less the function-eye fields (`traditionDescription.js :: withoutFunction`), so `market` and `smith` can only answer less there. On C and V the floor drops EXACTLY the owner's rows (0 extra, CONFIRMED). A lit mirror is held to the same filter at every view.
