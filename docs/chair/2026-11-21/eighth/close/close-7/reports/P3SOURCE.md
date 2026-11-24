# P3SOURCE: the P3source rise of 3, a measure, no cure (CLOSE-7 chain two; the chair's ruling of 20:12, brief at dbd296687)

READ ONLY. No file under `src/`, `tests/` or `scripts/` was changed in any tree. No register was touched, and the page-census door
was not run. I rendered with the lane's own runner (`read25/page-battery.mjs`, which gained a `--views` switch that writes the
printed views) and probed the records with a scratchpad script (`P3/probe.census.jsx`). The birth
is the door's own: `pageCensusWalk.shared.mjs :: configOf` with the census's dials and the crisis forced, options
`{ seed, customContent: {} }`. **The detached worktree for point 112 is `/home/user/wt/p112`** (9b0ffaa97, node_modules and
`.husky/_` linked). Nothing was written in it; `git status` is clean. CLOSE-7 removes it.

## (1) The three places as printed (the door's render; lit d447ee31e)
All three print the same Magic line and the same Defense row (CONFIRMED by render):
- **Magic**: "Magic in the world at large, not the thorp's own:" … **"Reliance on magic: Relied upon · for food (magical
  provision)"**. There is no " · supplied by …".
- **Defense**: "Active siege" … "**Arcane Support None**", then "**No arcane practitioners on the rolls.** Wards, detection and
  counterspell are beyond this settlement."

The three places:
- r2s-under_siege-thorp-1 (Lyssono, coastal): its Defense reads "Desperate — active siege" and "Whatever defence Lyssono keeps, a
  visitor would find nothing arcane in it."
- r2s-under_siege-thorp-2 (Agioslimani, hills): "Strained — active siege".
- r2s-under_siege-hamlet-2 (Kilshaw, plains): "Desperate — active siege" and "The hamlet has no arcane defense: …".

The finding on each reads: quote "Reliance on magic: Relied upon · for food (magical provision)", detail "No arcane practitioners on
the rolls". P3source is the only battery row these three carry.

## (2) At point 112 (9b0ffaa97, the laws dark): **3, not 0. It is not the flip's.**
The same three births, rendered on `/home/user/wt/p112` by the same runner, each fire P3source. Each prints the identical reliance
line, byte for byte with lit (CONFIRMED). The record probe at p112 gives the same reading, the same source and the same mark (below).
I rendered only these three at p112, not the whole 720.

## (3) The besieged places in the door's 720 (prefix r2, scale 1), by size
`economicState.foodSecurity.hasSiege` is true in this many births:

| | thorp | hamlet | village | town | city | metropolis | all |
|---|---|---|---|---|---|---|---|
| besieged, all | 6 | 5 | 7 | 4 | 4 | 5 | **31** |
| of them forced `under_siege` | 4 | 4 | 4 | 4 | 4 | 4 | 24 |
| of them calm births with a random siege | 2 | 1 | 3 | 0 | 0 | 1 | 7 |

The counts are identical at lit and at p112 (CONFIRMED by record). So the 3 sit in 31 besieged places: 2 of 6 thorps and 1 of 5
hamlets, all three forced sieges.

## (4) The line and its source
**The line.** `src/components/new/tabs/MagicTab.jsx` (the `magic-reliance` row) prints "Reliance on magic: {reliance.word}", then
" · for {relyFor}", then " · supplied by {supply.supply}" only where a supply is named. Where `supply.statable` is false the line
is not printed at all.
- The word comes from `domain/display/dossierViewModel.js :: deriveMagicRelianceView` over `domain/magicReliance.js ::
  deriveMagicReliance`. In the three it reads `relied-upon` ("Relied upon"), with practitioners `[]` and dependents
  `['Food supply']`.
- The food dependent is `magicReliance.js :: foodMagicShare` > 0, which reads `economicState.foodSecurity.magicOffset` and
  `.dailyNeed`. The values were not captured; they are positive by the dependent's own test.
- "for food (magical provision)" is `magicRelyNamesPrinted`.

**The source.** `dossierViewModel.js :: deriveMagicSupplyView` reads `domain/facts/magicSource.js :: magicSourceOf`. In all three
that gives houses `['Access to parish church']` and people `[]`: the divine tradition's house that holds up the food provision.
That house's card is marked **"Stopped by the siege."** (`display/crisisStoppedRow.js :: rowMarkText`, the row `{ text: 'Stopped by
the siege.', needs: ['crisis: under_siege'] }`).

BAR8 MARKS-2 item 6 (the sixth chair's BRIEF-BAR8, 2026-11-17, in `deriveMagicSupplyView`) rules that a house the page marks stopped
supplies nothing now. Where every supplier is so marked, "the reliance (the food ledger's) still prints, with no supplier named: the
record holds one, the crisis has stopped it". So the view returns `{ supply: null, statable: true }` (CONFIRMED in all three, at lit
and at p112). The line prints with no source beside the Defense tab's "No arcane practitioners on the rolls", and
`pageCensusFindings.js` P3source counts that as "reliance … stated with neither a practitioner nor a named source".

**THE CAUSE (CONFIRMED by read and record): two rulings disagree.** BAR8 MARKS-2 item 6 prints the reliance unsourced on purpose
when the siege has stopped its only source. P3source (the W2 census row 3 and its successor) reds every unsourced reliance where no
practitioner stands. The record does hold a source, the parish church access, which the siege has stopped. P3source's banked 0 must
date from before item 6 or before these births carried that supplier; I did not bisect which. The chair rules which reading stands.

Scratchpad: `P3/lit/rows`, `P3/p112/rows` (the renders with their printed views), `P3/probe-lit.json`, `P3/probe-p112.json`.
