# BAR3-SERVICES-2 · hand-back (kept current after every push)

Seat BAR3-SERVICES-2 (group SERVICES), successor of BAR3-SERVICES, branch `lane/bar3-services-2026-11-15`. Started at its
tip ef0803d97 (as told). My predecessor's hand-back (`BAR3-SERVICES-HANDBACK.md` beside this file) stays as it is.

## Step 0 — the line merged

`git merge --no-ff 52f0a1684` (the joined line at 52f0a1684, amendment 10): ONE merge commit, 7a57fc34f, no conflict. No
page line moved by it: under `src/` it brings only `src/domain/goods.schema.js` (+1 row) and `vite.config.js` (1 line).
Pushed alone. From here the second tree of my books is 52f0a1684.

## Step 1 — the test corpus's laws on my predecessor's guard (amendment 11)

Each run alone at the merged tip through `gate-tail.sh`:
- `negativeAssertionAnchor.walker`, `seedLoopTotality.walker`, `proseDrawnAnchors.walker`: each RED, and every offender
  each names is the base's (`tests/components/bar2MagicWords.test.jsx`, `tests/generators/bar2Places2Rows.test.js`,
  `tests/generators/power/bar2People3Funding.test.js`, `tests/domain/bar2CorpusGuards.test.js`): NONE names
  `tests/components/bar3ServicesRows.test.jsx` (before my batch 2 and after it). Nothing to cure in my test.
- `mutationCoverageManifest`: red on nine `tests/generators/bar2*` and `power/*` files of the base; it asks NO entry for a
  file of my branch (my branch adds no file under `tests/generators`). MANIFEST ENTRIES OWED: none.
- THE GOODS ROSTER (amendment 12), by a grep of the imports my branch adds under `src/` against 52f0a1684: my predecessor's
  batch added none; my batch 2 adds one, `src/domain/display/crisisStoppedRow.js -> ../dossier/entityLinks.js
  (serviceRowsOf)`, which is no goods module. ROSTER ROWS OWED: none. `engineCoreLazyEdge` green at my tip.

## Batch 2 — ruling SV7: a house is "Stopped" only if every row of it is stopped

THE RULE, ONE AT THE LEAF (`src/domain/display/crisisStoppedRow.js`): where the siege stops a house (`rowStoppedBy(...,
'house', ...)`) but a row of the house's own on the record (`availableServices`, joined by `institution`) prints on offer
beside it (stopped by no crisis in force, and not the siege's own twin), the house's kind is the siege's partial kind
(`under_siege:curtailed`), whose mark is "Curtailed by the siege." (a declared line of the mark pool, `needs ['crisis:
under_siege']`), whose door word is "curtailed", and whose head line is the siege's. The rows stay as they are.
- THE MEASURE (`sv7.mjs`, the 720 at the merged tip, every live house a crisis marks with a row of its own unmarked):
  before, 50 houses in 30 towns. Read row by row:
  - 21 house rows over the siege towns are the ruling's class (the declared-free rows on offer in ordinary wording): Inns and
    taverns (district) "Entertainment" 6, Luxury goods quarter "Custom commissions" 6, Cemetery network "Central register"
    3, Inn (multiple) "Meals and drink" 3, Cartographer's workshop "Map making" / "Copying and reproduction" 2, Travelers'
    inn "Meals" 1. AFTER: all 21 read "Curtailed by the siege."; 0 left.
  - 21 house rows beside the SIEGE'S OWN TWIN, not a row on offer: Access to external mill 11 ("With the roads cut, grain is
    ground by hand at home until the carts can get through again."), Coaching inn 6 ("Relay horses ... none go out."),
    Annual fair 2 ("None can reach it while the roads are held."), Carriers' guild 2 ("the wagons stand idle in the
    yard"): the row says in its own words that the work stopped: the house's "Stopped by the siege." is TRUE: unchanged
    (KEEP_STOPPED). (One doubt left in order below: the coaching inn's "Lodging" twin reads "the rooms stand mostly
    empty".)
  - 8 house rows under an outbreak (Listening post 3, Cartographer's workshop 2, Inn (multiple) 2, Market square 1): the
    outbreak's mark already reads "Curtailed by the outbreak.": TRUE as it stands: no partial kind. No famine house has a
    row on offer (0).
- THE JOURNAL AND THE PDF FOLLOW: both read the house's kind off the same leaf (`journalPages.js :: institutionsPage`:
  `rowStoppedBy` then `crisisMarkText`; `pdf/lib/crisisMarksOnPage.js :: markedOnPage`, `stoppedWordOnPage`,
  `ordinaryTimesOnPage`), so the partial kind gives the same mark, word and head line with no change under `src/pdf/` or
  `src/foundry/`: shown by the guard on all three surfaces (the tab, the PDF's `markedOnPage`, the Journal's Institutions
  page) and by the moved pins below.

### The batch's guard
`tests/components/bar3ServicesRows.test.jsx`, a second `describe` (batch 2): CURTAILED 6 pairs (the smallest town it
reaches to the largest; each checked on the Institutions tab, the PDF and the Journal, and its free row printing with no
door word), every pair red at the merged base (run there alone: 18 failures, the KEEP arm green; the base stands as the
plant); KEEP_STOPPED 2 houses (a house whose rows are the siege's twins still reads "Stopped by the siege.", tab and
PDF), green at both. Green at the tip (5 of 5). The three corpus walkers name no offender in this file.

### Pins moved by the declared cure (guards of the line, re-keyed by identity beside a dated note in each file)
- `tests/components/crisisStoppedRows.test.jsx`: r2s-under_siege-city-1's "Multiple inn districts..." and "Silks, spices,
  precious goods." (institutions), and S8's cemetery_network (r2s-under_siege-metropolis-0) and cartographer_s_workshop
  (r2s-under_siege-village-0): "Stopped by the siege." -> "Curtailed by the siege.".
- `tests/foundry/journalMarksCrisisRows.test.js`: r2s-under_siege-town-3's "- **Inns**: Stopped by the siege. ..." ->
  "Curtailed by the siege.".
- `tests/pdf/tailExportsPdf2Batch2.test.jsx`: E17/house r2s-under_siege-town-2 (Inn (multiple)) -> "Curtailed by the
  siege.".

### Gates (batch 2)
eslint on the touched files: exit 0. Run alone, green at the tip: the pins above, `bar2ServicesRows`,
`displayEconCrisisMarks`, `displayEconRelianceFoodWords`, `notableAbsences`, `servicesGeneratorTierSentinel`,
`servicesStructure`, `upkeepHired`, `upkeepVocation`, `proxyIsNotProvider`, `serviceCategoryRegistration`,
`tailExportsPdf3Batch3`, `generationWorkerLazy`; the laws `factLayers`, `layerBoundaries`, `engineCoreLazyEdge`,
`presumedThings`, `proseWiringCensus`, `writerReach`, `proseComposed`, `proseEntryContradiction`, `ruinFilterRoster`,
`observedShapeReaders`. The census after this batch: to follow in the next push (the record does not move: a display
cure).

## Every new or changed line (THE VETO LIST)

| line | towns it is read in |
|---|---|
| "Curtailed by the siege." on a house the siege stops but for a row of its own on offer (SV7), and its door word "curtailed" | r2s-under_siege-village-0 (village: Travelers' inn, Cartographer's workshop), r2s-under_siege-town-1 (town: Inn (multiple)), r2r-metropolis-14 (metropolis, a siege: Inns and taverns (district), Luxury goods quarter, Cemetery network) |

## Left, in order (for a successor)

1. SV7's census after-run and inventory diff (display only: the 21 house marks and nothing else should move).
2. SV8 (the field work beyond the gates under a siege): measure first, town by town, against the record's own reading of
   the siege.
3. My predecessor's items 3 and 4 (r2s-plague_onset-thorp-2's fishery with no chain; the salt works on spent flats and the
   mine on no ore ground).
4. The coaching inn's "Lodging" siege twin ("the rooms stand mostly empty") under a house marked "Stopped by the siege."
   (6 towns): the twin says the house goes on, thinly; a wording question, not measured further.
5. THE BOOKS (amendments 2 and 10) at my last tip against 52f0a1684.

## How the instruments are re-made

`git archive` of `docs/chair/2026-11-14/probes/READ-ALL` (chair's lane) and `.../CENSUS-3` (census lane) to the scratch
directory; `census3.sh <tree> <out> 4 --count-only` (12 minutes here); `inventory.py <out> <json>`. My measures:
`sv7.mjs` (every live house a crisis marks, with its own rows that print unmarked, by the tree's own leaf over
`corpus.ndjson.gz`), `sv7b.mjs` (those rows' descriptions and dependences).
