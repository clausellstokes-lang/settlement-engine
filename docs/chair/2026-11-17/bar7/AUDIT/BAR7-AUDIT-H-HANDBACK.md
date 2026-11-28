# BAR7-AUDIT-H · LAW 8 WIDENED · the page's mark on every surface — HAND-BACK

Seat H of BRIEF-BAR7-AUDIT (the chair's lane: `docs/chair/2026-11-14/briefs/BRIEF-BAR7-AUDIT.md`). Rendered at the tip I was
given, the joined line's **cfc2b680a** (unchanged when I started), in a scratch worktree with its own `npm ci`, every render
outside every tree (PAGE-COPY's `census3.sh --count-only`). **I CURED NOTHING**: no line under `src/` changed, no prose line,
no annex row, no stored figure, no test file. No file of another seat or an earlier auditor is edited: seat B's `pageB.mjs`
and auditor D's `law8.mjs` readers are imported and run as they are.

MY FILES (all new):
- `tests/helpers/pageLaws/law8H.mjs` — THE DETECTOR (rules 8f to 8k; pure over `{ record, tabs }` read by `pageB.mjs :: readTown`).
- `docs/chair/2026-11-17/bar7/AUDIT/runH.mjs` — THE RUNNER, for the chair over ANY PAGE-COPY render:

      node docs/chair/2026-11-17/bar7/AUDIT/runH.mjs <render-dir> <out.json> [SECOND-CHECK.final51.json]

  It prints counts by rule (towns, instances, distinct lines, things), what the seam in flight holds of each (`heldBy`), the
  split by cause, the census of a marked house's person lines by kind, and with the second-check file the controls table
  (`controlsH.json`; exit 3 when a STANDS control is missed or an EXPLAINED one is found).
- `docs/chair/2026-11-17/bar7/AUDIT/tablesH.mjs` — the count table below from the runner's outputs.
- `docs/chair/2026-11-17/bar7/AUDIT/controlsH.json`; the runs `RUN-H.30.txt`, `RUN-H.150.txt`, `RUN-H.720.txt` and the
  instances `out-h/h<pop>.json.gz` (each instance names its line and the page line of the mark it disagrees with).

THE SPLIT BY CAUSE, in every count: **born-calm** = every mark the instance reads is the SHORT mark, in a town with no crisis
(a house BORN short: the born-short audit holds the root; a rule by kind of house may dissolve the mark itself) · **short in a
crisis town** = the short mark, in a besieged, starving, warring or occupied town (still a birth gap: the same root) ·
**crisis** = a crisis's mark (stopped, curtailed, scarce): the mark stays and every surface must carry it — THE NEXT ROUND'S
NUMBER. A rule's `.mild` form is a house the crisis CURTAILS or makes SCARCE (its trade goes on, thinly): counted apart, WEAK by
the second check's rule 1.

## 1. THE RULES AS COUNTED

| rule | 30 (towns / inst / lines) | 150 (towns / inst / lines) | 720 (towns / inst / lines) | 720: born-calm · short-in-crisis · crisis | 720: held by the seam |
|---|---|---|---|---|---|
| 8f.chain | 1 / 1 / 1 | 0 / 0 / 0 | 4 / 4 / 2 | 0 · 0 · 4 | 0 |
| 8f.short | 5 / 6 / 4 | 14 / 14 / 3 | 85 / 85 / 4 | 79 · 6 · 0 | 0 |
| 8g.export | 2 / 2 / 1 | 0 / 0 / 0 | 2 / 2 / 1 | 2 · 0 · 0 | 0 |
| 8h.deal | 18 / 56 / 40 | 89 / 258 / 63 | 386 / 1028 / 71 | 817 · 140 · 71 | 0 |
| 8h.deal.mild | 9 / 22 / 18 | 36 / 103 / 39 | 57 / 154 / 58 | 0 · 0 · 154 | 0 |
| 8h.secret | 18 / 65 / 50 | 84 / 309 / 85 | 402 / 1492 / 108 | 1216 · 221 · 55 | 0 |
| 8h.secret.mild | 8 / 25 / 23 | 24 / 74 / 43 | 49 / 155 / 67 | 0 · 0 · 155 | 0 |
| 8h.wants | 2 / 3 / 3 | 16 / 23 / 20 | 63 / 74 / 35 | 55 · 13 · 6 | 0 |
| 8h.wants.mild | 2 / 3 / 3 | 8 / 12 / 10 | 15 / 19 / 16 | 0 · 0 · 19 | 0 |
| 8i.chainStopped | 1 / 2 / 2 | 0 / 0 / 0 | 1 / 2 / 2 | 0 · 0 · 2 | 0 |
| 8i.resource | 1 / 1 / 1 | 1 / 1 / 1 | 1 / 1 / 1 | 0 · 0 · 1 | 0 |
| 8i.surplus | 1 / 1 / 1 | 1 / 1 / 1 | 4 / 4 / 3 | 0 · 0 · 3 (+1 unmarked, calm) | 0 |
| 8j.exports | 0 / 0 / 0 | 2 / 2 / 2 | 10 / 10 / 10 | 9 · 1 · 0 | 0 |
| 8j.local | 0 / 0 / 0 | 1 / 1 / 1 | 0 / 0 / 0 | 0 · 0 · 0 | 0 |
| 8j.outputs | 1 / 1 / 1 | 2 / 2 / 1 | 21 / 21 / 3 | 17 · 4 · 0 | 21 (SEAM-ECON 8) |
| 8k.market | 1 / 1 / 1 | 0 / 0 / 0 | 0 / 0 / 0 | 0 · 0 · 0 | 0 |
| 8k.trade | 1 / 1 / 1 | 7 / 7 / 5 | 20 / 21 / 8 | 17 · 4 · 0 | 16 (SEAM-SCENES 9, SEAM-SCENES 3) |
| 8k.trade.mild | 1 / 1 / 1 | 6 / 7 / 5 | 5 / 6 / 4 | 0 · 0 · 6 | 3 (SEAM-SCENES 3) |
| ALL but .mild | 22 / 140 / 106 | 100 / 618 / 182 | 441 / 2744 / 247 | | |
| ALL but .mild and 8h | 11 / 16 / 13 | 25 / 28 / 14 | 128 / 150 / 33 | | |

Read the table so: the 720 is the census's (PAGE-COPY `seeds.txt`), the 150 the wide read's (`rand-27` to `rand-41`), the 30
the sixth read's (`rand-42` to `rand-44`), all born and rendered at cfc2b680a. **Beyond the person lines the rules hold 150
instances in 128 towns of the 720 (33 distinct lines); 37 of them are held by the seam (SEAM-ECON 8: 21; SEAM-SCENES 9 and 3:
16); of the rest, 113, the crisis-made are 10 (8f.chain 4, 8i 6) plus 1 unmarked maltster in a calm hamlet, and 102 are a
house born short (8f.short 85, 8j.exports 10, 8k.trade 5 beyond the seam, 8g 2).** The person lines (8h) are 2,594 in 438
towns (2,922 in 452 with
`.mild`): one cure of form, §2 8h.

THE CONTROLS (the sixth read's thirty, `RUN-H.30.txt`): **every STANDS control of the seat is FOUND, no EXPLAINED control is
(`controls off: 0`)**. My rules also find none of seat I's sixteen negatives or its two WEAK rows, and none of the twenty
EXPLAINED rows of `SECOND-CHECK.final51.json`; of the 139 LOW rows they find 25 (15 person deal lines, 5 secrets, a Wants line,
the maltster's chip, the alchemical export C34039, the herbalist's income row C41828, the forges under a curtailed siege).

| sub-rule | control | verdict | found by | cause |
|---|---|---|---|---|
| 8f | C8021, C40674 (cloth woven, weavers and fuller short) | STANDS | 8f.short | short |
| 8f | C41826, C41825 (metal worked, the share cell too) | STANDS | 8f.short | born-calm |
| 8f | C33921 (alchemy draws customers) | STANDS | 8f.short | born-calm |
| 8f | C4828 (timber "production consistent" under a siege) | STANDS | 8f.chain | crisis |
| 8g | C39519 (Alchemical Trade · Export○ Operational) | STANDS | 8g.export | short (occupied town) |
| 8h | C2524 (toll-keeper) · C8842 (stablemaster) | STANDS | 8h.deal | crisis (stopped) |
| 8h | C43844 (sawyer "turns back to the logs") | STANDS | 8h.deal | born-calm |
| 8h | C37251 (the line opens with the mark) | EXPLAINED | clear | |
| 8i | C7539 (shipyard's chips, both tabs) | STANDS | 8i.chainStopped | crisis |
| 8i | C20104 (maltster) | STANDS | 8i.surplus | crisis |
| 8i | C20287 ("✓ Fully exploited · Fish") | STANDS | 8i.resource | crisis |
| 8i | C19589, C4179 (a chip under a marked card) | EXPLAINED | clear | |
| 8j | C44447 (Milled lumber) | STANDS | 8j.outputs (SEAM-ECON 8) | born-short (famine town) |
| 8k | C12508 (looms) | STANDS | 8k.trade (SEAM-SCENES 9) | short |
| 8k | C45015 ("a busy market") | STANDS | 8k.market | crisis |
| 8k | C37728 (market day under an occupation), C9756 (pilgrims) | EXPLAINED | clear | |

PRECISION, each instance read against the page and the record by the second check's rules (draws seeded, `runH`'s outputs):

| rule | read | stand | weak | clear | what the weak and the clear are |
|---|---|---|---|---|---|
| 8f.short | 20 (6 of the 30, 14 of the 150) | 20 | 0 | 0 | — every one is "Metal is smelted or worked here." / "Cloth is woven or finished here." / "Remedies … made and sold here" / the alchemy line beside the trade's only houses, each marked short, no unmarked maker |
| 8f.chain | 1 | 1 | 0 | 0 | the control |
| 8g.export | 2 | 2 | 0 | 0 | C39519 and C34039 (a reader's LOW: the same row) |
| 8h.deal | 42 (22 of the 30, 20 of the 150) | 30 | 8 | 4 | the 4 clear (a line of manner: "Polite enough …", "Says nothing about …", "Tells you to see the clerk", "Talks about who is building …") are now excluded by name (`MANNER_ONLY`); weak: talk of who buys, a craft explained, an inn's lodging under a stopped inn district |
| 8h.secret | 22 | 11 | 5 | 6 | clear: a past event ("lost an arm at the blade", "built a roof with green timber"), a debt, a hiding place, "pots bought in from another workshop"; weak: a past habit under a stopped house |
| 8h.wants | 29 (all 6 of the 30, 23 of the 150) | 8 | 21 | 0 | stand: "… while it runs well", "Take on more hands … keep them busy", "one more pair of hands", "Win new business"; weak: "do more … with the same hands", "Train an apprentice …" |
| 8i.chainStopped · 8i.surplus · 8i.resource | 2 · 2 · 2 | 2 · 1 · 2 | 0 · 1 · 0 | 0 | the weak: a calm village 4% short of food (bar0-village-calm-rand-38), the maltster bare |
| 8j.outputs · 8j.exports · 8j.local | 3 · 2 · 1 | 3 · 2 · 1 | 0 | 0 | "Fulled cloth" (fuller short) on the Outputs and the Exports; "Leather goods" produced locally beside the only tanner short |
| 8k.market · 8k.trade | 1 · 8 | 1 · 8 | 0 | 0 | the looms, "Bolts of cloth hang drying" (×3), the kilns, the forge smoke, the tanning pits |
| 8k.trade.mild | 8 | 0 | 3 | 5 | explained: the forge fires of a war that curtails and FEEDS the smiths (army contracts); weak: sawdust beside a sawmill curtailed by the siege |

OVER THE 720 (every instance of the small rules, a seeded draw of twelve of the others; `out-h/h720.json.gz`): 8f.short's
85 are four lines, each the controls' shape ("Cloth is woven or finished here." 44, "Metal is smelted or worked here." 37,
the herbalist's two 4): stand. 8f.chain 4: 3 stand (the timber line under a siege, as C4828), 1 weak (a famine village's iron
chain Impaired, its row "Metal is … worked here"). 8g.export 2/2 stand. 8j.exports 10/10 ("Fulled cloth" ×9, "Glassware"
beside glassmakers short of glass sand). 8k.trade 12 read: 11 stand ("Bolts of cloth hang drying" and the looms, held; the
forges' hammering, held; "Unterthal's smithy has a queue for wheel-rims", beyond the four), 1 weak (a war line: the forges
run "on the army's contracts" beside a smith short of iron). 8i.surplus 4: 2 stand (besieged hamlets, 61% and 60% short), 2
weak (a village at war 8% short; a calm hamlet 1 lb a day short). **8i.chainStopped 2 of the 720: CLEAR** — a temple's
"Religious services" under "Pilgrimage & Holy Sites … Normally yields Religious services · Hospitality for travellers /
Stopped by the siege.": the temple serves its own people inside the walls, so THE CHIP IS TRUE AND THE CHAIN CARD'S YIELDS LINE
IS THE FAULT; with the shipyard of the 30, 2 of 4 stand as chips. That is why §2 puts this rule's fact on the chain card.

## 2. FOR EACH RULE: THE ONE FACT, WHERE THE MARK DOES NOT REACH, AND WHY EACH CONTROL WAS NOT SEEN

THE LEAF (`src/domain/display/crisisStoppedRow.js`): `rowMarkText(settlement, kind, row)` = the crisis's mark
(`rowStoppedBy`) then the short mark (`rowShortOf` over `housesShortOfInput`, which reads `houseInputAtHand.js ::
housesWantingTradeInput` and the record's gaps). **`rowShortOf` answers kinds `house` and `service` only.** Every surface below
either reads the crisis half alone, reads a second fact of its own, or reads nothing.

### 8f · THE INCOME ROW (S3 of auditor D's census)
- THE ONE FACT: `housesShortOf` through the leaf, for a share of a house's trade — the trade's houses are
  `crisisDependence.js :: INCOME_TRADE_HOUSES` / `INCOME_REMEDY_HOUSES`.
- WHERE IT DOES NOT REACH: `crisisStoppedRow.js :: incomeHouseKind` (read by `rowStoppedBy(…, 'income')`, printed by
  `economicsCrisisMarks.js :: incomeKindShown` in `EconomicsTab.jsx`) takes a mark only where EVERY trade house carries a
  CRISIS mark: it never calls `rowShortOf`. And the description is chosen in the generator, `economy/incomeLineSiblings.js ::
  trueIncomeDesc`, by the CHAIN's stored status (`impaired(['textiles'])` → `CLOTH_SHORT_LINE`; `impaired(['alchemy',
  'herbalism'])` → `REMEDIES_SHORT_LINE`), never by the houses' short mark; `METAL_WORKED_LINE` and `TIMBER_LINE` have no such arm.
- WHY EACH CONTROL WAS NOT SEEN: C8021, C40674 — "Wool & Textile Trade" is NOT a row of `INCOME_TRADE_HOUSES`, and the weavers'
  and fuller's mark is the short mark, which `incomeHouseKind` does not read; the twin "Little cloth is made here …" exists
  but answers the textiles chain's status, not the houses. C41826/C41825 — "Iron & Metalwork" IS in the table; the smith's mark
  is short, not a crisis's; the share cell ("8%") carries no mark of its own anywhere (a mark rides the description; a
  marked description covers its cell). C33921 — `INCOME_REMEDY_HOUSES` holds it; the same: crisis only. C4828 — "Timber
  Trade" is in the table but the sawmill takes no siege mark (the house goes on inside the walls), so the share takes none;
  the chain that feeds it ("Timber & Lumber · Impaired", "Contributes to Timber Trade - 2%") is read by NEITHER the mark nor
  `trueIncomeDesc :: TIMBER_LINE`; auditor D's 8d.income reads only a chain of the SAME NAME on DEPLETED ground.
- HELD: nothing. The born-short audit holds the root of the 5 calm and 9 crisis-town shares of the 150 (all short).

### 8g · THE SERVICE ECONOMY'S ROW (S5)
- THE ONE FACT: the leaf's worse state of a house, `crisisStoppedRow.js :: setsWithMarkedHousesWorse` — the Institutions card
  head reads it ("Alchemist shop · Crafts · Impaired").
- WHERE IT DOES NOT REACH: `EconomicsTab.jsx :: impairedHousesOf` reads `computeChainSets(town).impaired` RAW, so the service
  card (`economicsCrisisMarks.js :: serviceCardShown` over `chainStateShown.js :: serviceStateShown`) prints "○ Operational"
  through a house the same page prints Impaired and short.
- C39519: auditor D's 8d.export reads a SIEGE only (the export's reach); this town is occupied, the house short: the house's
  state is the missing reading, not the export's reach.

### 8h · A PERSON'S OWN LINES (S10)
- THE WRITER OF THE MARK ON A PERSON'S LINE: `src/components/new/npcComponents.jsx :: dealingShown` — the house's
  `rowMarkText` set IN FRONT OF "How they deal", and only where the line matches `TRADE_LINE` (sells, cuts, grinds, mixes, deals
  in, rents, brews, bakes, hires, weighs, pours, trades). THE WRITERS OF THE LINES: How they deal — `presentation.behaviour`,
  `src/data/people/titleSecretsPresentations.js :: TITLE_PRESENTATIONS` (by title, through `npcGenerator.js :: pickTitle`; the
  generic `npcData.js :: dealingLineFor` lines speak of no trade); Secret — `TITLE_SECRETS` (same file, stored `{ what, stakes }`);
  Wants — `src/data/people/goalFamilies.js :: GOAL_FAMILY_LINES.SUPPLY.expansion`, chosen by `src/generators/people/goals.js`
  where "the card's house processes a running or operational chain" (`RUNNING_STATUSES`): the CHAIN's status, not the house's
  mark. THE PDF's person card (`src/pdf/lib/viewModel.js`, `dealing:`) prints the raw `presentation.behaviour`: no mark at all.
- WHY THE CONTROLS WERE NOT SEEN: C2524 "Takes the toll and lifts the gate", C8842 "Talks horses …", C43844 "Shouts the price …
  turns back to the logs" match no word of `TRADE_LINE`, so `dealingShown` gives them nothing; auditor D's 8b.person reads only
  lines that sell, grind or mix.
- THE CENSUS (every person of a marked house, by kind of line; `RUN-H.*.txt`, "PERSON LINES OF A MARKED HOUSE"). OVER THE 720:
  2,139 keepers of a marked house (1,781 of a house marked short, 358 of a house a crisis marks) in 453 towns; of their "How
  they deal" lines **550 carry the mark IN FRONT** (480 short, 70 crisis) and **1,589 carry none** (1,507 of them lines of the
  person's own trade); no Wants and no Secret line carries a mark (1,663 secrets of the trade, 93 Wants of the working
  family); 21 hooks name the keeper. Over the 150: of 622 "How they deal" lines of a marked house's keeper, 126 carry the mark IN FRONT (the
  form every reader read as broken: the 25 LOW rows) and 496 carry none (441 of them lines of the person's own trade);
  no Wants and no Secret line carries a mark (622 each; 386 secrets of the trade, 35 Wants of the working family); 38 hooks
  name the keeper (all 38 speak of the crisis itself: not counted as instances, 0 of 7 read stood).
- THE FORM, TESTED AGAINST THE CARD: the card prints `<name>●` / `▲` / `<House> · member of <faction>` / `<title>` / traits /
  `Wants …` / `Standing …` / `How they deal …` / `Secret: …`. The chair's leaning holds: **the house's mark as ONE LINE OF ITS
  OWN, straight under `<House> · member of …` (e.g. "Toll bridge · member of Arcane Council" / "Stopped by the siege."), said
  once, and the person's sentences left as written.** It reaches every person of a marked house (2,139 cards over the 720,
  not the 550 `TRADE_LINE` now marks), it ends the broken front form (550 → 0), and by the second check's rule 1 (a card's mark
  covers what its rows say) it covers every unmarked deal, Wants and secret line at once: the 779 instances of 8h over the 150
  and the 2,922 of the 720 (`.mild` included) go to 0 with no line of prose touched. The detector already reads a mark line of its own on the card as
  covering (`law8H.mjs :: readPersons`, `cardMark`), so this runner is that cure's guard as it stands. The same line belongs on
  the PDF's person card (`viewModel.js`), which today prints the line bare.
- HELD: nothing (the seam has no person seat for this).

### 8i · A HOUSE'S ROWS AND CHIPS THE LEAF DOES NOT KNOW
- 8i.chainStopped (C7539): `crisisDependence.js` declares the shipyard's work goes on under a siege (its `HOUSE_DEPENDENCE`
  note: "shipyard (builds from timber in its yard)"; `SERVICE_DEPENDENCE` "Ship construction": NONE, "Repair and refit": NONE),
  while the chain "Harbour and Maritime" (`harbour_trade`: TRAVELLERS, GOODS) is stopped and its card's "Normally yields"
  names "Ship construction" because the shipyard is on its Via. TWO READINGS OF ONE SERVICE: the chain card's yields line
  against the house's rows. THE ONE FACT is the service's own dependence (the table's ruling: the yard builds): the stopped
  chain's "Normally yields" should not name a service whose own row the leaf keeps on offer (the chain card's output list,
  `tradeListDisplay.js :: chainOutputsShown` — the SEAM-ECON seat's file: sequence after it joins).
- 8i.surplus (C20104): the maltster's card says "Requires grain surplus." (`institutionDescVariants.js`); its dependence is
  `[GRAIN, INPUT]` and the siege stops no GRAIN (a famine does: auditor D's 8c.surplus); `housesShortOf` reads the grain as at
  hand where it is imported or grown, never against the FOOD BALANCE. WHICH TABLE SHOULD HOLD IT: the input fact,
  `houseInputAtHand.js` (`HOUSE_TRADE_INPUT` maltster: grain): a house that works only a SURPLUS is short where the page's food
  line is short ("Short of grain."), in a crisis or not.
- 8i.resource (C20287): `economicsCrisisMarks.js :: fullCardWordUnderSiege` returns null where ANY chain card of the ground
  prints a working word, and "Fishing & Seafood · Vulnerable" counts as working (`WORKING_CHAIN_STATUSES`) though its only Via
  house (Fisher's landing) is "Curtailed by the siege."; the leaf's `setsWithMarkedHousesWorse` lifts HOUSES, not chain cards.
  THE ONE FACT: the Via houses' marks; a chain card all of whose houses the leaf marks is not a working card for this function.
- HELD: nothing.

### 8j · A GOOD WHOSE EVERY MAKER IS MARKED SHORT, ON THE LISTS (S4, S6)
- THE ONE FACT: `housesShortOf`, through `rowShortOf`, per maker of the good (the SEAM-ECON seat's item 8 reads it in
  `tradeListDisplay.js :: chainOutputsShown`: 8j.outputs is ITS rule, counted here to say so).
- BEYOND THE SEAM: `tradeListDisplay.js :: exportsAsPrinted` and `localProductionAsPrinted` (through `tradeListsAsPrinted`)
  print "Fulled cloth" on Exports and "Leather goods" under Produced locally where every maker is short. The same file as the
  seam's item 8: a builder takes it after the seam joins, with the same reading.

### 8k · A SCENE OR AN OVERVIEW LINE (S12)
- 8k.trade: the arrival scenes (`src/data/arrivalProse.js`) declare `trade at work: <key>` (`src/domain/facts/tradeAtWork.js ::
  tradeAtWorkOf`, which reads `housesShortOf`) or only `institution: smith`. HELD by SEAM-SCENES: cloth MADE answered by a dyer
  (item 9: C12508, "Bolts of cloth hang drying" ×3), the tanners' lines (item 2), the smiths' four dominant lines (item 3).
  BEYOND THE SEAM: "The kilns are lit all through the day, …" (`needs: ['trade at work: kilns']`): the generic `kilns` key
  keeps its old reading (`tradeAtWork.js`'s header: "keeps its reading for the lines any kiln answers"), so it answers with
  the potter, the brickmaker and the charcoal burner ALL marked short (bar0-metropolis-calm-rand-32).
- 8k.market (C45015): `src/generators/narrativeText.js` "Outsiders see a busy market …" declares `needs: ['market']`,
  `crisis: ['any']`; `src/domain/facts/market.js` is a PRESENCE atom (a house tagged market stands) and reads no mark. THE ONE
  FACT: the market house's crisis mark (`rowStoppedBy(house)`, a display leaf: a fact may not import it — the layer law — so
  the fact must read the same data table, `crisisDependence.js`, or the line must exclude the crises that stop its market).
- C37728 and C9756 are clear: a market only "Vulnerable" carries no crisis mark; pilgrims are no market.

## 3. A WORKLIST FOR BUILDERS (disjoint files; each brings its rule to the count named, by `runH.mjs`)

EVERY SEAT BELOW TOUCHES A FILE A SEAM SEAT IN FLIGHT HOLDS (SEAM-ECON: `crisisDependence.js`, `houseInputAtHand.js`,
`tradeListDisplay.js`; SEAM-SCENES: `tradeAtWork.js`, `narrativeText.js`; SEAM-PDF: `src/pdf/`), so they are the round AFTER
the seam joins, and each is briefed from the seam's joined tip. Each seat's guard is this runner, run at its own tip over
the 720 and the 150: `node docs/chair/2026-11-17/bar7/AUDIT/runH.mjs <render> <out.json>`; the counts below are the 720's
(the 150's in brackets).

| seat | rules | files (disjoint) | the cure, at ONE fact | brings to |
|---|---|---|---|---|
| **H-ECON** · the Economics tab's marks | 8f.short, 8f.chain, 8g.export, 8i.resource | `src/domain/display/crisisStoppedRow.js` (`incomeHouseKind`), `src/data/crisisDependence.js` (`INCOME_TRADE_HOUSES`: the "Wool & Textile Trade" row), `src/domain/display/economicsCrisisMarks.js` (`incomeKindShown`/`incomeDescShown`; `fullCardWordUnderSiege`), `src/generators/economy/incomeLineSiblings.js` (`trueIncomeDesc :: TIMBER_LINE`), `src/components/new/tabs/EconomicsTab.jsx` (`impairedHousesOf`) | an income share whose EVERY trade house the leaf marks short takes the short mark (`rowShortOf` per house, as the crisis half does); the timber line reads the timber chain's status as the cloth and remedies lines do; the service card reads `setsWithMarkedHousesWorse`; a ground card whose chains' every Via house is marked is not "Fully exploited" | 8f.short 85 → 0 (14), 8f.chain 4 → 0 (0), 8g 2 → 0 (0), 8i.resource 1 → 0 (1) |
| **H-PEOPLE** · the person's card | 8h.deal, 8h.secret, 8h.wants (and `.mild`) | `src/components/new/npcComponents.jsx` (`dealingShown` → one card line), `src/pdf/lib/viewModel.js` and `src/pdf/sections/NotableNPCs.jsx` (the PDF's person card) | THE FORM (§2 8h): the house's `rowMarkText` as ONE line of its own under the card's house line, once; `dealingShown` sets nothing in front of the sentence; the PDF prints the same line | 8h 2,594 → 0 (590 of the 150), `.mild` 328 → 0; the front form 550 → 0 |
| **H-INPUT** · a house's input and a list's goods | 8i.surplus, 8i.chainStopped, 8j.exports, 8j.local | `src/domain/facts/houseInputAtHand.js` (a house that works only a grain SURPLUS is short where the food line is short), `src/domain/display/tradeListDisplay.js` (`exportsAsPrinted`, `localProductionAsPrinted`; `chainOutputsShown` for a STOPPED chain's "Normally yields") | the input fact read by the surplus house; a good whose every maker the leaf marks short leaves Exports and Produced locally (the seam's item 8 reading, on the two lists); a stopped chain's yields line names no service whose own row the leaf keeps on offer | 8i.surplus 3 → 0 (+1 calm: the owner's call, a hamlet 1 lb a day short), 8j.exports 10 → 0 (2), 8j.local 0 (1), 8i.chainStopped 2 → 0 by the chain card (the chips stay as printed) |
| **H-SCENES** · the scene and the market line | 8k.trade beyond the seam, 8k.market | `src/domain/facts/tradeAtWork.js` (the generic `kilns` key reads `housesShortOf` as its kinds do), `src/generators/narrativeText.js` (the "busy market" line excludes the crises that stop or starve its market, or takes a twin) | the short mark through the trade key; the market's crisis mark read from the data table (the layer law: a fact imports no display) | 8k.trade 5 beyond the seam → 0 (1), 8k.market 0 (0; 1 of the 30) |

THE SEAM'S OWN COUNTS, measured by this runner at cfc2b680a, so the chair can read its join: SEAM-ECON item 8 holds 8j.outputs
21 of the 720 (2 of the 150); SEAM-SCENES items 9 and 3 hold 8k.trade 16 of the 720 (6 of the 150) and 3 of `.mild`. After the
seam joins these read 0, or the seam's cure missed them.

## 4. WHAT SHOULD NOT BE DONE

- **Do not widen `dealingShown`'s `TRADE_LINE`.** It would put the front form every reader read as broken (550 lines of the
  720 now) on up to 1,507 more trade lines of the 720. The cure is the card line, not more front marks.
- **Do not rewrite person lines or secrets one by one.** 2,594 instances of the 720 are 214 distinct lines (`.mild` apart) in
  the title pools of `titleSecretsPresentations.js`. A card's mark covers them all by rule 1; a sentence-by-sentence cure
  touches hundreds of the owner's vetoable lines and lowers the next read by about a fifth (the brief's measure).
- **Do not change the Wants draw** (`goals.js`'s `expansion` reading the house's mark): it moves stored people at the next
  birth. Only 93 lines of the 720 are of the working family, and the card's mark covers them.
- **Do not mark the income share cell or a chip on its own.** The share cell (C41825) and every chip are covered when their row
  or card carries the mark (rule 1). One mark a row is enough.
- **Do not stop the shipyard** (`HOUSE_DEPENDENCE`) to answer C7539. The table's own ruling is that the yard builds from its
  own timber. The 720's two other instances of the rule are a temple whose chip is TRUE. The chain card's yields line is
  the fault.
- **Do not cure 8k.trade.mild.** 5 of the 8 read are explained (a war curtails AND feeds the forges); the rest are a thin trade
  under a mark that says so.
- **Do not dissolve the short mark in the calm towns before the owner rules on the born-short design.** Of the 113 instances
  beyond the person lines and the seam, 102 are a house born short (the born-short audit holds the root). If the rule by kind
  of house lifts a mark, those instances go with it, and H-ECON and H-INPUT shrink to what is left. The 10 crisis-made are the
  round's floor either way.

## 5. STATE

- Every count here is a run I saw end, at cfc2b680a: the 30 (`census3.sh … 4 --seeds s30 --count-only`, births+render 99 s),
  the 150 (2 workers, exit 0) and the census's 720 (3 workers, births+render 2,237 s, `DONE rc=0`, 720 dumps), all with
  PAGE-COPY's `census3.sh` from `lane/chair-2026-11-08`. Then `runH.mjs` over each, each run to the end (`RUN-H.<pop>.txt`,
  exit 0, `controls off: 0`).
- Nothing is left running. No population is uncounted.
- The net before my last push: `npm run typecheck:domain:strict`, `npx eslint` on my new files, `npx vitest run
  tests/architecture`, each alone through `sh scripts/gate-tail.sh`: typecheck exit 0 ("no strict-type regressions (1113 errors, ceiling 1113)"),
  eslint exit 0 (no finding on `law8H.mjs`, `runH.mjs`, `tablesH.mjs`), architecture exit 0 (21 files, 347 tests passed).
- UNSETTLED, named with what I measured: (1) the maltster in a calm hamlet 1 lb a day short (r2r-hamlet-27) — whether "Requires
  grain surplus" bare there is false is a matter of degree; the cure proposed (short where the food line is short) would mark
  it. (2) 8h.secret's precision is 11 of 22 strict (past events and debts are not the house at work); the card line covers
  them whatever their verdict, so it does not change the seat. (3) 8i.chainStopped is 2 of 4 as chips; I put its fact on the
  chain card, and whether a stopped chain should keep naming its houses' outputs at all is the chair's to rule.
