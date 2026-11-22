# Unit 4's lists for SIDES (PAGE-13, the security reader's and the join's; measured at dcec26dff's tree)

## 1. The towns and surfaces SIDES moves
- MEASURED (`towns.mjs` -> `towns.out.txt`, the chair's 300, `hxd-<size>-0..49`, DEFAULT_CONFIG): **89 of 300** towns show
  some tension's sides differently from the stored words. By size: thorp 16, hamlet 13, village 15, town 20, city 15,
  metropolis 10. The town list and every change by kind (stored -> shown) are in `towns.out.txt`. This equals PAGE-9's 89
  (`build/SIDES/pinCause.out.txt`: the pin moved for exactly those towns and no other).
- THE CHANGES ARE OF THREE SORTS ONLY: (a) a `named` fill puts the ruler's name in place of "The sitting authority",
  "Those in charge", "Authorities", "Those in authority" (legitimacy_crisis, popular_uprising, trade_dispute,
  heresy_trial) or a merchant power's name (population_friction, 1 town); (b) a `presumes` row is shown its `without`
  where the town lacks the house ("Legal class profiting from ambiguity" -> "Those who profit from the muddle", "Price
  regulators" -> "Those who would fix a fair price", "Merchants who benefit ..." -> "Those who benefit ...", "the merchant
  class" -> "Those who pull the strings", "the orthodox clergy" -> "The orthodox faithful", "Local enforcement" -> "Those
  in charge"); (c) a side the generator wrote over keeps no power of another party ("the criminal network" -> "Lawbreakers"
  in every crime_wave that stores it: 22 tensions here; a stored economy power -> "Those growing richer", 4).
- THE SURFACES THAT PRINT A SIDE (all through `tensionShown.js :: tensionSidesShown`; `build/SIDES/READERS.md`):
  - walked by the old reader pin (5 of its 11): the Overview tab as the gallery, the reveal share and the player share
    mount it; `pdf.vm` (the view model's `parties`); the Foundry journal (`journalPages.js` prints the conflicts'
    `parties`, joined " vs ");
  - NOT walked by that pin: the History tab (`HistoryTab.jsx :: TensionRow`), the dossier search's found tension
    (`DossierSearchResults.jsx :: RENDERERS.tension`), the PDF History chapter (`HistoryFounding.jsx`, the vm's `parties`),
    the PDF Overview chapter (the same `parties`), and the owner's own page.
- OWNER AGAINST SERVED (PAGE-9's `build/SIDES/parity.out.txt` at SIDES' tip): 0 differences over 8,745 pairs (1,749
  tensions x 5 projections; 1,020 towns). Re-run at the lane's merged tip is unit 4's, not yet done here.

## 2. Every reader that chooses a wording by a house (or by a power of a kind)
ONE reader: `src/domain/display/tensionShown.js :: tensionSidesShown`. Its choices, each from the document in hand only:
| branch | reads | houses / kinds | hideable or crime? |
|---|---|---|---|
| rule 4, `presumes` | `factsOf` + `atomHolds` on the row's atoms | `market` (3 rows), `force: kept` (2), `legal house` (1), `healer` (1), `clergy` (1), **`organised crime` (2: "Criminal organisations", "the criminal network")** | **`organised crime` is a fact about crime** |
| rule 1-2, `named` fill | `data/tensionSidePower.js :: solePowerNameOf` on `powerStructure.factions[].category` / `isGoverning` | ruler (9 rows), economy (merchant power, 3), religious (faith, 2), military, **criminal (`MEANS_CATEGORY['criminal power']`: the row "Criminal organisations", `named: "{power}"`)** | **criminal is a veiled power kind** (`cardVeil.js :: isVeiledPower`) |
| header rules 2-3, written-over sides | `isPowerOf(words, category)`, `holdsPowerOf(category)` on the roster | the same categories, criminal included | **criminal** |

MEASURED ON THE 1,020 BORN TOWNS (PAGE-9's parity): the criminal `named` fill never fires (the stored crime_wave side is
always "the criminal network", which takes the written-over branch and shows "Lawbreakers" whatever the town holds), and
owner = served on every pair. BUT BY CONSTRUCTION the reader CAN choose a wording by a criminal power and by the
`organised crime` atom: a stored "Criminal organisations" in a town with exactly one criminal power would print that
power's name, and a town lacking organised crime would print "Lawbreakers". That is PAGE-9's rule ("no wording by a
hideable house or a fact about crime") NOT HELD by construction; it is unit 3's declaration for `TENSION_SIDE_MEANINGS`
(the line's hideable walker), put to the chair before any builder.

The lane's other house readers (PAGE-4's list, unchanged): the card's weight (`cardStandingRead.js`), MAGIC's Overview
line (`magicMeasuresApart.js`), SAFETY (`safetyShown.js`, capture: owner's page only).
