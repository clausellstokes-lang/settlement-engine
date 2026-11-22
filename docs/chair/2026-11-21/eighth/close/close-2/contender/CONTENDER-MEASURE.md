# CONTENDER-MEASURE (seat CLOSE-2): a "Contests the seat" power is the ruler's own bargain partner in the web

**What the page prints.** `PowerStrata.jsx :: ThePowers` shows a "Contender" card, and `FactionRow` (:327) shows "Contests the seat", for every `role:'contender'` entry of `powerStrata.js :: derivePowerStrata`. That function lists `coupContenders(s).challengers` in order. `coupContenders` (rulingPowerCoup.js:94) takes every faction except the governing one (and, under the lit seat law, except the holder). It drops criminal factions and those below power 5, sorts by coup weight and keeps the top 3 (`slice(0, 3)`). It never reads `factionRelationships`. The component adds no filter and no limit. The script applies the same order and the same de-duplication against the ruler's name.

**The web's categories (counted).** `TheWeb` groups `powerStructure.factionRelationships` by `type`, using `RELATIONSHIP_KIND_ORDER`. That order is quoted from powerStrata.js:176: "the frictional kinds first ..., the cooperative kinds last". The list is `corrupted, competitive, tense | subordinate, dependent, symbiotic`. Two sets are counted:
- **N (bargain).** `symbiotic`, `dependent`. Source: factionDynamics.js:416 ("a bargain ("each props up the other", "each needs the other")") and :435 (`row.type !== 'symbiotic' && row.type !== 'dependent'`).
- **W (settled).** N plus `subordinate`. Source: factionDynamics.js:449 ("holds the pair settled ("subordinate", "symbiotic" or "dependent", and "stable")") and :458.

Only these six types appear across all 1,800 places (dark: dependent 860, subordinate 496, tense 429, symbiotic 155, competitive 115, corrupted 12). No printed contender pair carries both a cooperative row and a frictional row ("mixed" = 0 everywhere).

**Counts.** 150 places per size; every place has a ruler. Each cell reads N / W.
- "1st dep" / "any dep": the first contender, or any contender, is in the category.
- "w/ contender": places that print at least one contender.
- "all others dep": every faction other than the ruler is in the category.
- "cure → none": a contender prints today, and every member of the eligible pool (non-criminal, power at least 5) is in the category, so the expected cure would print no contender.

| size | tree | 1st dep | any dep | w/ contender | all others dep | cure → none |
|---|---|---|---|---|---|---|
| thorp | DARK | 0 / 0 | 0 / 0 | 8 | 0 / 0 | 0 / 0 |
| thorp | LIT | 0 / 0 | 0 / 0 | 6 | 0 / 0 | 0 / 0 |
| hamlet | DARK | 10 / 11 | 10 / 11 | 32 | 10 / 11 | 10 / 11 |
| hamlet | LIT | 10 / 13 | 10 / 13 | 25 | 15 / 18 | 10 / 13 |
| village | DARK | 40 / 40 | 43 / 47 | 150 | 38 / 38 | 38 / 38 |
| village | LIT | 80 / 80 | 84 / 84 | 141 | 80 / 88 | 71 / 79 |
| town | DARK | 97 / 108 | 133 / 133 | 150 | 55 / 57 | 55 / 57 |
| town | LIT | 119 / 123 | 131 / 132 | 150 | 58 / 60 | 58 / 60 |
| city | DARK | 84 / 123 | 102 / 140 | 150 | 0 / 1 | 1 / 2 |
| city | LIT | 75 / 108 | 113 / 125 | 150 | 1 / 2 | 1 / 2 |
| metropolis | DARK | 49 / 126 | 61 / 140 | 150 | 0 / 0 | 0 / 0 |
| metropolis | LIT | 94 / 114 | 127 / 138 | 150 | 0 / 0 | 0 / 0 |
| **all** | DARK | **280 / 408** | **349 / 471** | 640 | 103 / 107 | 104 / 108 |
| **all** | LIT | **378 / 438** | **465 / 492** | 622 | 154 / 168 | 140 / 154 |

Reading: on DARK, 280 of the 640 places that print a contender (44%) name as first contender a power the web calls the ruler's bargain partner. With `subordinate` counted, it is 408 (64%). LIT makes it worse: 378 of 622 (61%). In cities and metropolises almost every place keeps some non-allied power, so the cure there re-picks the contender rather than emptying the list. Emptied pages cluster in villages and towns (DARK 104, LIT 140 under N).

**Three seeds, page line beside web line.** Printed by measure.mjs; same text in DARK and LIT unless marked.
1. `visitor-hamlet-28`, ruler Feudal Stewardship.
   - Page: "Contender Military/Guard · Military · Strong", and the roster reads "Contests the seat".
   - Web: symbiotic (stable): "The Feudal Stewardship gives the orders and the Guard carries them out; each needs the other to stay strong."
2. `visitor-city-1`, ruler City Council.
   - Page: "Contender Religious Authorities · Religious · Minor", "Contests the seat".
   - Web: dependent (stable): "The City Council holds the seat and collects the taxes; the Religious Authorities tell people that the City Council's rule is right and ordained. Each props up the other." (This is the town-26 shape.)
3. `visitor-metropolis-1`, ruler Ducal Governorship. DARK and LIT differ:
   - DARK page: "Contender Noble Houses · Noble · Minor". DARK web: dependent (declining): "The Noble Houses live under the rule of the Ducal Governorship but keep enough rights of their own (land, courts, levies) to bargain, not simply obey."
   - LIT page: first contender Military/Guard. LIT web: symbiotic: "The Ducal Governorship gives the orders and the Guard carries them out; each needs the other to stay strong."

**The string's origin.** "Contests the seat" was first added by `fddb437de` (2026-11-03 16:31 UTC), "Who rules has one answer on the Power tab: ... challengers contest the seat" (lane RULERS).
- It is an ancestor of `origin/master`, first carried there by PR #72 `a07ee4e0a` (2026-11-04). It is also an ancestor of point 97 `1ec3e81d1`, point 96 `2486d1301` and `c110dd85b`.
- The local clone is shallow (`.git/shallow`, 12 boundaries), so local `merge-base --is-ancestor` falsely reports NOT for points 96 and 97. GitHub's compare API shows `fddb437de` behind each by 0.
- So the string is not new on the line: it has been on master since PR #72. Only how often it prints beside a bargain grew, as LIT shows.

**The cure's reach (read, not built).**
- **Where the list comes from.** It is computed when the page renders and is not stored on the record. `coupContenders` derives it from `powerStructure.factions` each time it is called.
- **Fix only in the page.** The cure would sit in `src/domain/dossier/powerStrata.js :: derivePowerStrata`: drop challengers whose tie with the ruler is N (or W), and take the next eligible power. That moves no births or goldens. But four other readers call `coupContenders` directly and would still name the old contender:
  - the coup-risk chip and `contenderCount` (`rulerRisk`)
  - `powerDeskRead.js`, `EngineSections.jsx`
  - `printProse.js` (PDF), `powerStateProse.js` (DS-POW-4)

  That leaves a new page-against-desk contradiction.
- **Fix in the shared function.** The cure would sit in `src/domain/rulingPowerCoup.js :: coupContenders`, which also needs the relation rows. That moves births, because birth code reads it too:
  - `src/generators/people/castPowers.js:677 contendersOf` ("The powers the Power tab prints as contesting the seat")
  - `src/generators/power/factionStanding.js:84-85` (`contestedBy`)
  - `successionGrammar.js`
  - every worldPulse coup verdict (`resolveCoupVerdict`: coup.js, deploymentReturn.js, stressorGates, convergence, irregularForce)
- **Tests that pin today's contenders:**
  - page: `tests/components/powerSeatRender.test.jsx:44-51` (one "Contests the seat" per `coupContenders` challenger); `tests/components/powerStrata.test.jsx:157-159`; `tests/components/powerTabSupport.test.jsx`
  - domain: `tests/domain/rulingPower.test.js`; `tests/domain/seat/seatContest.test.js` (25 refs); `tests/domain/seat/seatLawSavedTown.test.js`; `tests/domain/generationLawsSavedPlace.test.js`; `tests/domain/powerStateProseDesk.test.js`; `tests/domain/irregularForce.test.js`
  - generators: `tests/generators/people/seatKeeperContender.test.js`; `tests/generators/people/castPowers.test.js`; `tests/generators/densityLaw.test.js`
  - PDF: `tests/pdf/statePrintParity.test.jsx`
  - census: `tests/lint/proseWiringCensus.walker.test.js`

Script: `measure.mjs` (here). Logs: `dark.log`, `lit.log` (exit=0, 0 errors).
