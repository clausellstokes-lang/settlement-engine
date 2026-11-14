# REVIEW-POWERS-5 · lane/powers-follow-up-2026-11-13 read from 3909655c3 to 0ea65f574

An independent reader. I changed nothing on the lane. My branch: `lane/review-powers-5-2026-11-14`. Step 1 (every new or
reworded line read where it prints) is in `REVIEW-POWERS-5-LINES-READ.md` (pushed at c64e23278, before I opened the lane's
statement or any commit message of the range). Probes and outputs: `probes/REVIEW-POWERS-5/`. EXECUTED unless a row says PLAUSIBLE.

## THE VERDICT: NOT CLEAR at 0ea65f574

Two MEDIUM findings are the stage's own:
- **M1:** the new "criminal sway" chip is false in 48 of 95 prints.
- **M2:** the hall line's new "make their own decisions" is false in 38 of 307 prints.

Both are new lines of this stage, read on the page, each contradicted by another line of the same Power tab.

The stage's other cures hold, by my own counts. #272 the raw modifier on the screen: 395 → 0. #291: 12 → 0. NEW1: 11 → 0.
ww#375: 128 → 0. #101: 6 → 0. Each is held by a guard that reds on its own plant.

The generator move changes the stability label only. It moves no power, no legitimacy band and no person.

**The chair ruled (12:22 UTC): M1 and M2 go to the lane's next seat (POWERS-15) as cures with guards, as does the PDF's raw modifier (C1). They hold this lane's next landing, not the join; the lane lands only after those cures are made and a reader has read that seat's range.**

## Findings, ranked

| # | Rank | Whose | EXECUTED? | Town and sentence | The fact against it |
|---|---|---|---|---|---|
| M1 | MEDIUM (g) | THE STAGE'S OWN (`domain/display/governingModifierWords.js :: modifierBorneOut`, the crime family) | EXECUTED, 48 of 95 prints in 1,716 births, every size thorp to metropolis | `r2r-thorp-8`: "The power Elder Council (dominant)criminal sway". `r2r-city-3`: "The power City-State Council (strong)criminal sway" | The same Power tab's hall: `r2r-thorp-8` "Free of the criminals. Nobody at the head of Elder Council answers to a criminal house, and no criminal power here is strong enough to push it." (Defense: Diffuse criminal presence). `r2r-city-3` "…none of them takes orders from the criminals." The family's test is `crime !== 'none'`, so any crime, diffuse included, "bears out" criminal sway, while the hall reads the ruling three. True in the other 47 (a corrupted rung, or an agent in the three). The lane's own read (P7.2) named r2r-thorp-8 and r2r-metropolis-5 as true; both are among the 48 |
| M2 | MEDIUM (c, g) | THE STAGE'S OWN (`domain/people/patronage.js :: hallOf`, the syndicate variant) | EXECUTED, 38 of 307 prints: 28 under an occupation (3 towns, 10 cities, 15 metropolises), 10 infiltrated | `r2s-occupied-town-1`: "Free of the criminals. The head, the second and the third of Merchant oligarchy make their own decisions; none of them takes orders from the criminals." | The same page: Stability "Suppressed (under occupation: resistance simmers)"; Plot Hooks "In the occupation, the occupier's orders come through Járnsaxa Eindriðason of Occupation Authority." Also `r2s-infiltrated-metropolis-3`, where Stability reads "Vulnerable (decisions shaped from outside)". The lane read r2s-occupied-town-1 as true (P8.2). The base's line there claimed nothing of who decides |
| C1 | HIGH (h) | CARRIED (`src/pdf/sections/PowerStructure.jsx:38`; untouched by the stage, false at the base too). **Ruled FOR THE JOIN by the chair** (P8.0 "NAMED, NOT MINE: … #312 and ww#656, the PDF's and the Summary tab's chips") | EXECUTED (`pdf5.test.jsx`, all 720) | The PDF's Power chapter, GOVERNING "Elder Council" / "mage-advised" (`r2r-thorp-21`), in **395 of 395** towns that store a key | An identifier printed: the twin of the screen chip this stage cured. Not counted against the stage, by the chair's ruling. Listed so the join does not land without it |
| C2 | MEDIUM (c) | CARRIED (`data/people/titleSecretsPresentations.js`, the coaching-inn keeper's secrets: no declaration row) | EXECUTED, 16 keepers under a siege | `r2s-under_siege-town-1`: "Secret: Changes tired horses for fresh ones and sells the good ones on, giving travellers the worst of the stable". `r2s-under_siege-metropolis-2`: "Secret: Tells a band on the road which coaches carry money and when they leave" | Critical (under siege). The stage declared the siege for the same title's presentation rows and not for these. The lane names it as a candidate left (P8.5) |
| L1 | LOW | THE STAGE'S OWN (the faith family) | EXECUTED, 29 of 142 | `r2r-hamlet-2`: "The power Headman's Authority (dominant)church sway" | No religious power stands on the roster, only a shrine. A stretch |
| L2 | LOW (c) | THE STAGE'S OWN (#101's re-route) | EXECUTED, 24 | Under a siege: "How they deal Pleasant, but asks where you are going and when, and writes it down." (`r2s-under_siege-town-1`) | Nobody leaves a besieged town; doubtful |
| L3 | LOW | THE STAGE'S OWN | EXECUTED, 9 | M2's line in infiltrated towns whose label does not say "shaped from outside" | the infiltration card beside it |
| L4 | LOW (g) | CARRIED (`data/people/dmPowerLines.js :: CAPTURE_RUNG_LABELS`) | EXECUTED, 307 | "Free of the criminals." beside "Criminal structure: Organized syndicate" | The lane names it for the owner's veto (P8.5); I agree it can read as the town |

**Lines I would strike, for the owner's veto.** M1's chip in the 48 towns (the cure: read the stored capture rung or an agent in the
three, the hall's own reader, not the crime structure). M2's clause "make their own decisions" under an occupation or an announced
infiltration (the hall's other variants fit: e.g. "{ruler} rules in its own name" is false there too; the line wants a twin that
claims only the criminals). L1 where no religious power stands.

## Step 2: the stage's statement (PART 7 and PART 8)

| Row the stage says it cured | Gone? (row's town; my births) | What prints in its place | Judgement |
|---|---|---|---|
| #272 THE RAW MODIFIER on the Power tab: 395 pages → 0 | **Yes**: 0 stored keys in 991 rendered pages. 395 of the 720 store a key; 206 print words, 189 nothing | the chip's words: TRUE in 171 of 206 on the 720 (false: 20 M1, 15 L1) | **Cured; its replacement still false in M1.** The silenced 565 (1,716) were all identifiers (h): cured by silence. The PDF's twin stays (C1, FOR THE JOIN) |
| #291 market, court and merchant lines that did not read the roster: 12 → 0 | **Yes**: 12 → 0 on the 720, 10 → 0 in mine; at the tip none of the five lines prints where the town lacks what it names (`roster12.mjs`, 0 in 1,716) | the ladder's next lines (grazing, the armed household, the communal stores, the household that sells most, a monster incursion): TRUE in all 22 | **Cured and true.** All 22 removed lines read: all false at the base |
| NEW1 the stability label against the Defense verdict: 11 → 0 | **Yes**: 11 → 0 (720), 4 → 0 (mine) | "Stable" (9), "Tense — regional monster threat" (4), "Vulnerable (decisions shaped from outside)…" (2): TRUE in all 15 | **Cured and true.** All 15 removed read false |
| ww#375 the none rung's line beside a syndicate: 128 → 0 | **Yes**: 128 → 0 (720), 179 → 0 (mine). The first line now prints only where no criminal power stands (1,075 prints) | the second line, 307 prints | **Cured, but false in its place in 38 (M2).** The removed line read in 30 of 128 towns: all 30 beside "Criminal structure: Organized syndicate", none with a criminal power on the roster |
| #101 the coaching inn under a crisis: 6 → 0 | **Yes**: 6 → 0 (720), 38 moved in 1,716; no keeper under a siege keeps either line, none under a famine the welcoming | famine: the transactional (14) TRUE; siege: the cautious (24) LOW (L2) | **Cured**; the same title's siege secrets left (C2, named by the lane) |
| The six red titles of REVIEW-POWERS-4 | At the base: 6 red. At the tip: the four files run, 3 red (the toll's three: r2r-city-8, r2r-metropolis-8, r2r-metropolis-49) | mintedFaceUnderworld, styledTitleOnRows, the walker's grid row: green | **As stated.** The toll's three are the next seat's by the chair's ruling: not counted again |

**The rulings.** I would rule differently in one place. The ruling on the raw modifier ("prints in plain words only where the
town's own record bears it out") was met for four families. For crime, though, the seat chose a fact (the crime structure) that
the same page contradicts. A ruling that a modifier is borne out by "the reader that page already uses for the same claim" would
have caught it. Otherwise the stage meets the rulings I can read.

## Step 3: the laws

- **Field diff, base → tip** (`fd5.mjs`, every leaf):
  - The 720: 26 towns move, in four paths only: `powerStructure.recentConflict` (12, #291), `powerStructure.stability` (11, NEW1), `npcs[].presentation.{impression,disposition,behaviour}` (6, #101) and `pressureSentence` (3, the conflict line's copy).
  - My 996: the same four (10, 4, 32, 4).
  - Each family is one the stage's cures declare. Nothing else moved.
- No key added or removed in the record. No draw added or moved: no other field moved, faction powers and NPC stats included.
- No new word in the vocabulary: the `crisis: under_siege` / `crisis: famine` atoms are already used in `arrivalProse.js` and `structuralValidator.js`.
- No name a user can hide is written into a stored sentence: the conflict lines it re-routes name no person, and the chip is composed at display.
- The page shows ratings, not machinery.
- **Registered surfaces** (`tests/fixtures/.golden-freeze-register.json`, 51 surfaces): the stage touches no fixture; every registered file's sha256 equals its pin.
  - Sampled the eight power, people and dossier suites. `generatorGoldenMaster` and `dossierProseManifest` are red at the tip AND at the base with the same counts (513 config rows; 1,038 prose rows; 178 ≠ 203), so they are CARRIED and the stage moves neither count.
  - The six dormancy goldens are green. The stage's draft shift record is not read (outside PART 7/8's rows).

## Step 4: plants (`plants5.py`, in a detached tip worktree used for nothing else)

Each plant re-opens one cured fault, and each one reds its guard. 13 plants, 13 red:
- The chip, three plants: crime always borne out; arcane always borne out; the raw key printed. Each reds `powerTabSupport.test.jsx`.
- The conflict ladder, four plants: levies without a market; courts without a court; murdered merchants without a market; the noble lines without a market. Each reds `conflictLadderReadsRoster.test.js`.
- The stability label, three plants: underdefended unguarded; ordered unguarded; the reconcile not copying stability. Each reds `stabilityReadsReadiness.test.js`.
- The hall's syndicate test removed: reds `hallLineReadsCrime.test.js`.
- The inn, two plants: the declaration's `excludes` dropped by `settleTitleLines`; the transactional's siege atom dropped. Each reds `coachingInnUnderCrisis.test.js`.

The clean tip is green on all six files. **Guards missing:**
- No test reads the chip against the hall line (M1).
- No test reads the hall line under an occupation (M2).
- No test reads the PDF's GOVERNING leaf (C1).

## Step 5: the merge

**None in the stage** (`git log --merges 3909655c3..0ea65f574` is empty). The registers the stage touched:
- `page-census.register.json`, the grid: `node scripts/census/page-census.mjs --grid` at the tip reads 0 falls and exits 0, so the grid equals the door.
- The banked P4 96 → 0 and NEW1 11 → 0 against the 720 door: `node scripts/census/page-census.mjs` at the tip (the 720, the door's own run) reads P4 0 and NEW1 0, each equal to its banked 0; "the banked corpus reads at or under the register", exit 0 (`results/pc720.tail.txt`). Every other row reads at its banked count.
- `tests/lint/.lighting-census-baseline.json`: its walker is green at the tip.

## Step 6: the gates (at the tip, `sh scripts/gate-tail.sh`)

- `typecheck:domain:strict` exits 0. `typecheck:ratchet` exits 0.
- eslint on the stage's 14 touched `.js`/`.jsx` files exits 0.
- The six test files plus the reader's four: 58 passed, 3 red at the tip (the toll's three, carried). At the base 6 red (the six titles).

## Step 7: CENSUS-2 as a second eye

`census2.sh <tree> <out> 4 --files <the stage's eight src files>` was run at the base and at the tip, on the 720.

**No kind rises.**

| Pattern | Base (towns · distinct lines) | Tip |
|---|---|---|
| a | 712 · 607 | 712 · 593 |
| b | 70 · 101 | 70 · 101 |
| c | 301 · 298 | 301 · 298 |
| d | 382 · 40 | 382 · 40 |
| e | 60 · 20 | 60 · 20 |
| f | 720 · 343 | 720 · 343 |
| g | 720 · 6 | 720 · 6 |
| h | 20 · 73 | 20 · 73 |

By the stage's files:
- `governanceNarrative.js`: a 34 towns / 20 lines → 24 / 8 (#291's cure); c 8 / 8, equal.
- `titleSecretsPresentations.js`, `poolMap.js` and `patronage.js`: equal.

The census traces no line to `governingModifierWords.js`. Its patterns do not see a chip that contradicts the hall (M1), so this second eye cannot catch M1.

Counts: `results/c2.counts.{base,tip}720.txt`.

## Step 8: the two HIGH rows and the generator move

- **#272: 395 → 0** on my count. 0 stored keys print on 991 rendered pages; 395 of the 720 store one.
  - In their place, 206 print words and 189 print nothing.
  - The words are read in A1–A6 of step 1 (M1 and L1 are the false ones).
- **#291: 12 → 0** on the 720 and 10 → 0 on my 996, by `roster12.mjs`. All 22 replacements read true (B1–B5).
- **The generator move (2768c53c7).**
  - The power replay already ran after the defence profile at the base: `assembleSettlement.js:247` is unchanged, and it already handed `defenseLabel` to the replay.
  - The stage adds two things. The governance labels now read that label (`rulingStructure.js` hands `projection.defenseLabel`). The reconcile now keeps the replay's `stability`.
  - Measured: **stability moves in 11 of the 720 and 4 of my 996, and nothing else moves with it.**
    - No faction's power, category or modifier moves.
    - No `publicLegitimacy` moves: the legitimacy label is equal at base and tip in all 15.
    - No person moves.
    - The pressure sentence moves only by the conflict line.
  - The changed order cannot move a power or a band by construction: the replay's faction powers, legitimacy and relationships were already copied at the base, and the stage adds only `stability`.
  - Stability is read after the reconcile by `generateCoherence` and the pressure sentence, and neither moved.
  - The history and narratives are composed before the reconcile and read the first pass's label. That is safe here: their only test is `=== 'Unstable'`, which no moved label crosses. No stale "underdefended" or "military presence" survives on the 11 moved pages.
- **The six red titles:** three green at the tip. The toll's three (`tollNamePrintedEverywhere`: r2r-city-8, r2r-metropolis-8, r2r-metropolis-49, "no goal names a crossroads …") are red, and are the next seat's first item by the chair's ruling.

## What I did not measure

- The PDF rendered as pages: its view-model text leaves were read instead.
- The Foundry journal by build: it reads none of the changed fields but the stored stability and conflict, verbatim.
- The whole suite.
- The 33 other registered golden surfaces.
- The stage's draft shift record.
- The impression line on any surface: it is dark everywhere.
- A content profile beyond grounded and grim.
