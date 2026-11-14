# EXPORTS-B1 HAND-BACK (2026-11-14)

The seat EXPORTS-B1 (session session_01ACmDYWsWZ8HhDFApg7x6Jf; the chair session_01ACmDYZrFEVXyZEUg1NDxxC). Branch
`lane/exports-b1-2026-11-14`, cut from the surfaces lane's tip as read back from origin: **c66333f0c** (the measure was
taken at 3c30fdeb4). Nothing merged. No pull request.

## The ruling (the chair's, on EXPORTS-MEASURE-1 B1: candidate C; vetoable by the owner)

THE READER'S TWO BRANCHES TAKE THE CONDITIONS THEIR WORDS NEED: the clergy line prints only where a house with clergy
stands on the live roster (not an access-only row, not a shrine alone); the "defenders paid late" line prints only where a
force stands; where none does, its twin: "Money is already short; a long crisis would empty the reserves." (new words:
read in three towns; the owner's veto list); "the defenders kept paid" becomes "the place kept going" where no force
stands. ONE FILE: src/domain/display/threatAssessment.js, and its guard.

The chair's ruling of 15:02Z on this seat's count stop: the difference from the measure (defenders 158 against 156; towns
285 against 284) is the base's own move. The targets stand at this base: clergy 221 to 0, defenders 158 to 0, towns 285
to 0, true lines lost 0.

## The cure — f00fb52fc

- `src/domain/display/threatAssessment.js :: buildThreatAssessment` (the one reader: the Defense tab's opened threat row,
  and the PDF's THREAT ASSESSMENT through `defenseDisplay.js :: deriveDefenseReadiness`). The measure's patch for this file
  (`candX.B1C-B2AB-B3A-B4.patch`, `git apply --include=src/domain/display/threatAssessment.js`), read whole against the
  ruling. Its two comments were reworded ("CANDIDATE" out), and the helper was typed as `liveInstitutionNames` types its
  record, so the any-cast ratchet gains no hole. Code as measured.
  - care: `f.hasChurch` (the economy compound: counts "Access to parish church" and a wayside shrine) becomes `clergyStand(r)`:
    a church, temple, cathedral, chapel, abbey, monastery, friary or priory on the live roster, not an ACCESS_ONLY row.
  - money 'late' with no force: the twin. Money 'long' with no garrison and no force: "the place kept going".
- GUARD `tests/pdf/threatAssessmentTwoSurfaces.test.jsx`. It renders the Defense tab and opens each threat row by its
  header, and renders the PDF's Defence chapter rows. Arms:
  (1) no clergy line: r2r-thorp-0 (access to a parish church, no force), r2r-hamlet-0 (siege), r2s-famine-thorp-0 (famine).
  (2) keep-guard: r2s-under_siege-village-0, whose own parish church keeps the clergy line.
  (3) the twin where no force stands: r2r-thorp-0, r2r-thorp-14.
  (4) keep-guard: r2r-thorp-1, where a force stands, keeps "The defenders are already paid late".
  RED FIRST at c66333f0c: arms 1 and 3 red, the guards green. With the clergy branch's cure removed alone, arm 1 alone
  is red. With the twin removed alone, arm 3 alone is red (EXECUTED).

## The counts (EXECUTED), beside the measure's

| figure | measure at 3c30fdeb4 | this seat at 3c30fdeb4 | at the base c66333f0c | at the tip f00fb52fc |
|---|---|---|---|---|
| false clergy (FAST b1false) | 221 | 221 | 221 | **0** |
| false defenders (FAST b1false / b1def) | 156 | 156 | 158 (thorp 53, hamlet 49, village 56) | **0** |
| towns with either | 284 | 284 | 285 | **0** |
| a house with clergy standing, no care line (true lines lost) | 0 | 0 | 0 | **0** |
| towns whose rows change (FAST b1fast, base to tip) | 284 | | | 285 |
| census hits for the writer (`--files src/domain/display/threatAssessment.js`) | 290 → 69 | | 290 (clergy 221, court 62, infirmary 9) | **69** (court 62, infirmary 9: towns, two hold both) |
| field diff of the record, base against tip (fielddiff.mjs) | 0 families | | | **0 towns, 0 families** (720 against 720) |

THE 69, read by roster (`rest69.mjs`, the tip's census): all 62 court towns hold a Town hall, which is the line the
measure named and another seat's leaf. The measure's "60" for it counts the same 69 towns less the two that also hold
an infirmary. All 9 infirmary towns hold a "Monastery or friary" (6) or "Multiple monasteries" (3): true. None is false
of this block. The census at the base: c66333f0c, full run, births+render 930 s, count+trace 495 s, exit 0. At the tip:
887 s and 361 s, exit 0.

The rows that move (b1fast, base to tip): clergy to "Nobody here treats the sick…" 221 (hamlet 107, thorp 90, and 24
under famine after "In famine."); defenders to the twin 158 (village 56, thorp 53, hamlet 49). Nothing else moves. "the
place kept going": 0 towns. True lines lost, by name: the 221 moved towns' sacred rows are "Access to parish church"
163, plus a wayside shrine 55, a wayside shrine alone 3. Every town with a church of its own keeps its line
(b1clergy, base against tip: 108 + 92 + 31 + 9 + 6 + 4 unchanged).

THE BASE'S OWN MOVE, by seed (`moved2.mjs`: the census's 720 born at 3c30fdeb4 and at c66333f0c, the defenders class
read in each by its own tree). No town has a force in either tree. The net +2 is three in and one out:
- r2s-occupied-hamlet-2 (59): Economic Survival CRITICAL 16 at 3c30fdeb4 → WEAK 22 at c66333f0c: enters.
- r2s-recently_betrayed-thorp-3 (16): CRITICAL 18 → WEAK 20: enters.
- r2s-monster_pressure-village-2 (242): CRITICAL 15 → WEAK 28: enters.
- r2s-under_siege-village-0 (281): WEAK 21 → CRITICAL 19: leaves (it prints "There is no money to meet a crisis…").
The towns-with-either figure rises by one, not two, because one entrant already printed the false clergy line.

## Every new or changed line, with the towns it was read in (the owner's veto list)

Read on the tab's OPENED row and the PDF's row (one script, the cured tree). The two surfaces print the same sentence in
every town read.
- NEW: "Money is already short; a long crisis would empty the reserves." (Economic Survival, Weak, no force). Read in:
  r2r-thorp-36 (5, the smallest), r2r-thorp-0 (11), r2r-thorp-14 (19), r2s-occupied-thorp-2 (28, OCCUPATION),
  r2s-famine-hamlet-2 (92, FAMINE), r2r-village-55 (102, SIEGE), r2s-recently_betrayed-village-2 (394, the largest).
  True in each: no force stands and the band is Weak. Beside the tab's own voiced line ("…pays nobody to defend it…",
  "…has been short of money for years…"). No contradiction; in r2s-famine-hamlet-2 the two say money is short twice.
- NEW, 0 towns: "…emergency measures can be paid for, and the place kept going while it lasts." (Strong, no force).
  Prints nowhere in the 720, so it was not read.
- MOVED, words not new: "Nobody here treats the sick, and a plague would run until it burned out." now prints where the
  roster holds only access to a neighbour's church and/or a wayside shrine. Read in: r2r-thorp-36 (5, the smallest),
  r2s-under_siege-thorp-2 (6, SIEGE), r2s-succession_void-thorp-0 (8, FAMINE), r2r-thorp-0 (11), r2s-occupied-thorp-0
  (13, OCCUPATION), r2s-famine-thorp-0 (19, FAMINE, after "In famine."), r2r-hamlet-0 (22, SIEGE), r2r-hamlet-24 (100,
  FAMINE, the largest). True: nobody here, and the neighbour's clergy are not here.
- KEPT (guards): "Clergy provide basic wound care…" in r2s-under_siege-village-0 (Parish church), r2r-village-55 and
  r2s-recently_betrayed-village-2 (Parish church). "The defenders are already paid late…" in r2r-thorp-1 and
  r2s-occupied-thorp-0 (a force stands).

## After the cure (EXECUTED)

- domain-strict 1113 / ceiling 1113; type ratchet 167 / ceiling 167; eslint on both files: exit 0 (`gate-tail.sh`).
- The 29 test files that name the file, its lines or its registers: 14 red at the tip, and the same 14 red at the base.
  None names this file at the tip and not at the base. The reds are the base's: dossierStateProseProjection,
  defenceFactReaders.walker, domainAnyCastBaseline (governingModifierWords.js), factLayers.walker,
  presumedThings.walker, tuningRegister.walker, defenseTabFlow STOP-2. The any-cast ratchet was red at this file on the
  first cut (an `{any}` JSDoc) and was cured before the push.
- presumed-things walker: identical rows at tip and base (160 = 160): no rise.
- twelve-birth grid (`page-census.mjs --grid`): 0 falls at base and tip, exit 0: no rise, no fall.

## Registers named stale (re-derived once, at the close; none touched here)

- In the tree: none. No test, walker, ratchet or register moves with this cure (the named tests' reds are the base's,
  the presumed-things rows are identical, the grid is unchanged, and the any-cast baseline is unchanged).
- Out of the tree, re-derived at the close: the census's worklist row for `threatAssessment.js :: buildThreatAssessment`
  (CENSUS-3 `worklist.json` / `worklist.top.md`, pattern a, subs clergy/healer/court-generic: 290 → 69 towns), and the
  census's pattern-a totals that row feeds; the measure's headline row for B1.

## Named by the measure, not this seat's

"There is a court but almost nowhere to hold anyone" where a Town hall alone sets the court flag (60 towns at the
measure's candidate; ruled elsewhere: another seat's leaf).

## What is left

Nothing of B1. The merge seat lands this branch. The owner's veto on the twin's words.

## How the instruments are re-made

The measure's probes: `git archive origin/lane/exports-measure-2026-11-14 docs/chair/2026-11-14/probes/EXPORTS-MEASURE-1`.
The census: `git archive origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3`; then
`HOLDERS=<P>/holders.tipA.json sh <P>/census3.sh <tree> <out> 4 --files src/domain/display/threatAssessment.js`.
FAST: `node b1false.mjs <out>/corpus.ndjson.gz <tree>`, `node b1fast.mjs <corpus> <base> <tip>`, `node b1clergy.mjs …`.
Run all of them from outside every repository tree.
