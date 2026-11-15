# TAIL-DEFECON-R · HAND-BACK · a house is short of its input only where the record says none reaches it

Seat: TAIL-DEFECON-R, builder. Branch `lane/tail-defecon-r-2026-11-14`, cut from the DEFECON group's tip
`345f13157` (lane/tail-defecon-2026-11-14 as read at 00:45 UTC). File: `src/generators/resourceGenerator.js`, the gap
logic only (the line near 46, an income label's key, is TAIL-DEFECON-2's and is untouched). Two declared moves, one
commit each: M-S `5a446d29b`, M-V (next commit). Nothing merged, no pull request.

## THE RULINGS WORKED TO (the chair's, 2026-11-15 00:44 UTC and 01:41 UTC; each vetoable by the owner)

- **(M-S) A HOUSE IS SHORT ONLY IF NONE OF ITS INPUTS REACHES IT, and the copper synonym is read.** Build from `ms`;
  counts must match or say why.
- **(M-V) GRAPES AND SAND COME BY ANY ROUTE** (an input a house may run on by import reaches it wherever the town can
  bring goods in). Its one loss (the line "runs on imported grapes" where no grapes are on the import list) is the
  seat's to settle: measure the candidate "the input joins the import list"; build it only if it moves the import list
  alone; else leave the list and name the line.
- 01:41 UTC, on this seat's M-S and its M-V proposal: (1) M-S dropping only the `missing` rows is right (`ms` dropped
  true rows); (2) M-V as proposed is granted: where a route can bring the input, NO GAP ROW; (3) the import-list join is
  NOT this seat's: the chair names it for the economy seat, measured before built.
- The brief's laws (BRIEF-TAIL.md): a cure that moves the record is a declared move with its field diff; UNDER A SIEGE
  nothing comes in by road, gate or water; the golden master is the owner's door; a pin a cure moves is re-keyed by
  identity in the same commit; reds carried from the base are named, not this seat's.

## M-S · `5a446d29b` · DECLARED MOVE

Cause: `evaluateInstitutionChain` judged a house of several chains chain by chain; the Smelter (iron ore, copper ore,
gold/silver ore) "exists but lacks access to copper ore" in 238 of 238 smelter towns while it smelted iron or bought ore.
Cure: the `missing` row is not written where another chain of the house is worked here or another input is held locally
or bought in (`reachedByAnotherInput`, reading `supplyOfInput`).

Against `ms`, two differences, both measured:
- `ms` hunk 1 (the copper synonym in `supplyOfInput`) is **not built**: at this base `recordHoldsGood` already folds
  `terrainSynonymsFor` in; hunk 1 alone moves 0 of 720 towns; no census town holds copper (0 of 720). The ruling's
  "the copper synonym is read" holds at the base.
- `ms` drops `imported` rows too, silencing TRUE rows: "Smelter runs on imported iron ore" (90 towns), "... gold/silver
  ore" (88), and 20 towns' military note resting on them. Built: only `missing` rows go. Hence priorityNotes 2, not 22
  (the chair, 01:41: right).

Field diff by family on the 720 (`fielddiff.mjs`, before = `345f13157`): towns moved **255**; `resourceAnalysis.gaps`
255, `resourceAnalysis.priorityNotes` 2. Rows no longer written (all `missing`): Smelter/copper ore 234, Smelter/
gold-silver ore 113, Smelter/iron ore 9, Apothecary/hot_springs_mineral 13, Alchemist shop/hot_springs_mineral 12,
Sawmill/mountain_timber 3. Smelter/copper denied 238 -> **4** (r2r-city-5, r2r-city-17, r2r-city-36, r2r-metropolis-33:
no input at all; their three rows stay). Notes gone: "Military focus highlights gap: mountain_timber processing is
incomplete, strategic vulnerability." (r2r-village-20), "... iron ore processing is incomplete, ..."
(r2s-insurgency-city-1).

## M-V · (next commit) · DECLARED MOVE

Cause: no record yields grapes and no import list names grapes, must or wine, so every census vintner "lacked grapes"
(184 of 184; the page "No grapes reach the vintner.") though the house's text presses must brought in; every
glassblower lacked glass sand (13 of 13). Cure: `supplyOfInput` reads a new kind `'route'`: grapes or glass sand reach
the house wherever the town can bring goods in (`hasTradeRouteConnection`, the route leaf) **and no siege shuts the road**
(`config.stressTypes` holds `under_siege`, the reading the economy's income lines use); `'route'` writes no row, as
`'local'`.

Why not `msmv` as written (measured on this seat's M-S): its `imported` row leaves the page line printing in all 184
towns. The Resources reader (`validationOnPage.js :: resourceGapLines`) takes every house row whatever its kind, and
answers an input only from the record's goods, so the record moved and the page did not. The import-list join (probe by
mutation, not built) moves `economicState.primaryImports` and `resourceAnalysis.gaps` only (191 towns) and brings the
page to 5/1. But `primaryImports` has one writer (`economy/economicState.js:775`, `computeActiveChains.js ::
deriveImportsFromChains`), and a second from this file breaks ONE HOME FOR ONE FACT. The no-row form gives the same page
and leaves no "runs on imported grapes" row to contradict the list. Granted 01:41 UTC.

THE SIEGE, this seat's addition (vetoable): under `msmv` and the granted form as first built (191 towns), six besieged
towns lost "Vintner exists but lacks access to grapes", which the siege law makes TRUE there: r2r-metropolis-14
(271,164), r2s-under_siege-city-0, -city-2, -metropolis-1, -metropolis-2, -metropolis-3. Built: their rows stay.

Field diff by family on the 720 (against M-S): towns moved **185**; `resourceAnalysis.gaps` 185, nothing else. Rows no
longer written (all `missing`): Vintner/grapes 173, Glassblower/glass sand 12, Glassblower/glass_sand 12. Vintner
denied 184 -> **11** (isolated 5: r2r-city-48, r2r-city-49, r2r-metropolis-9, r2r-metropolis-44, r2r-metropolis-54;
besieged 6 above); Glassblower 13 -> **1** (r2r-town-9, isolated). Both moves against the base: 294 towns,
`resourceAnalysis.gaps` 294, `priorityNotes` 2.

PIN RE-KEYED BY IDENTITY (same commit): `tests/generators/gapSaysWhichKind.test.js`, "missing: the TRUE gaps stay
written ...": its vintner pair sat on soak1k-5 (a metropolis on a port, now reached by trade, no row). Re-seated on the
first soak birth that seats a Vintner and reads it missing: soak1k-9 (a town of 1,867, isolated). Assertion unchanged;
green at M-S and here.

## THE PAGE (one census before at `345f13157`, one after at M-S + M-V; tabs and exports)

PENDING: the AFTER census is rendering at this push. The record-side reading (`resourceGapLines` run on the after
records): "No grapes reach the vintner." 184 -> 11 towns; "No glass sand reaches the glassblower." 13 -> 1; "No iron
ore, copper ore or gold or silver ore reaches the smelter." 3 -> 3 (unmoved). The inventory diff of tabs and exports
and the inheritors read come in the next push.

## GUARDS

`tests/generators/houseInputReaches.test.js`: (M-S) five fed smelters (319 to 344,689; a siege; a famine) write no
`missing` row; their imported rows still print; the four unfed smelters keep all three. (M-V) seven route towns
(vintners 540 to 344,689 with a famine and an occupation; glassblowers 511 to 2,465 with a famine) write no row;
KEEP: two isolated vintners, an isolated glassblower, two besieged vintners keep the `missing` row. Each arm red at its
base (M-S's first arm at `345f13157`; M-V's first arm at M-S); plants (every house reached; the siege check struck)
red the KEEP arms; not committed.

## GATES (each commit)

domain-strict 1113/1113; type ratchet 167/167; eslint clean on the touched files; presumed-things `--check` fresh 147
at the base and at each commit (carried red, no rise); the twelve-birth grid 2 falls at the base and at each commit
(r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a; carried).

REDS CARRIED FROM THE BASE (named, not this seat's): of the 16 test files naming the file, the same six at the base and
here: coherenceAgreeCures.test.js (the walled-with-no-gate line; the gate-mark fixture), r3c10FoodLinesTrue.test.js (the
two herding arms), r3c9ReaderLinesTrue.test.js (the rival account), worldFactRederive.test.js A7. Of the 39 golden-master
readers, the same 69 non-passing assertions at the base and here (generatorGoldenMaster.test.js, engineBundleReplay,
vendorPdfLazy, generationForkCensus, the pinned-mode, edit-corpus and prose-manifest arms among them).

## NAMED FOR OTHER SEATS

- **The economy seat** (the chair's, 01:41): the vintner's must and the glassblower's sand as chain imports
  (`computeActiveChains.js :: deriveImportsFromChains`, the import list's one home). Measured here as a probe: moves
  `primaryImports` alone on the 720 (191 towns); the region's trade links (which read `primaryImports`) are NOT measured
  by the 720 single-town births.
- **The priority notes** (this file, not cured: outside the two moves): "Military focus highlights gap: iron ore
  processing is incomplete, strategic vulnerability." prints where the smelter runs on imported iron ore (the note reads
  its first strategic gap row, the `imported` ones included): 45 of the 125 towns that hold the note after both moves
  (r2r-town-9, r2r-town-34, r2r-town-45 ...); a staff-panel line on no census dump. Unchanged by these moves.
- **The display** (another leaf's, per the prompt): the Resources reader takes any house row whatever its kind; with
  these moves no route-fed row is left for it to misread.

## REGISTERS NAMED STALE

The golden master (`tests/fixtures/generator-golden-master.json`) moves with both cures (`resourceAnalysis.gaps`,
`priorityNotes`): THE OWNER'S DOOR, not re-taken. No other register read the moved rows.

## WHAT IS LEFT

1. The page: the AFTER census's inventory diff (tabs; `SURFACES=PDF,Journal`), the gap lines that go with their
   towns, and the inheritors read (a vintner's, a smelter's and a glassblower's rows, three towns each).
2. The golden-master readers re-run at M-V (at M-S: the same 69 as the base).
3. Nothing else of the assignment.

## HOW THE INSTRUMENTS ARE RE-MADE

1. `git archive` out of their lanes into a directory outside every tree: `docs/chair/2026-11-14/probes/CENSUS-3`
   (lane/census-3-2026-11-14), `docs/chair/2026-11-14/probes/READ-ALL` (lane/chair-2026-11-08),
   `docs/chair/2026-11-14/probes/RECORD-MEASURE-1` (lane/record-measure-2026-11-14: `births-only.sh`, `fielddiff.mjs`,
   `load.cjs`), `docs/chair/2026-11-14/probes/RECORD-MEASURE-2` (lane/record-measure-2-2026-11-14: `ms.patch`,
   `msmv.patch`, `inputgap.mjs`).
2. A scratch worktree of `345f13157` with `npm ci`; the base and each candidate tree symlink its `node_modules`.
3. BEFORE / AFTER: `sh census3.sh <tree> <out> 4`; `python3 -I inventory.py <out> tabs.json` and
   `SURFACES=PDF,Journal python3 -I inventory.py <out> exp.json`; `inventory_diff.py before.json after.json`.
4. A candidate's record: `CENSUS3_PROBES=<CENSUS-3> sh births-only.sh <tree> <out>` (~1 min), then
   `node fielddiff.mjs <before corpus> <after corpus> [depth]` and `node inputgap.mjs <tree> <corpus>`.
5. This seat's two probes (in the scratchpad, not committed; their text is in this file's commit body where it
   matters): `gapdiff.cjs <load.cjs> <A> <B>` (house rows and priority notes gone or new, by text, with towns) and
   `pagegap.mjs <tree> <corpus> <load.cjs>` (the Resources reader's vintner, glassblower and smelter lines off the record).
