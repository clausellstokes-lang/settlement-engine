# BAR8-K-POWERS · HAND-BACK · 13g, 14a, 14d, 15b cured at their one fact

Seat K-POWERS of the round BAR8 (BRIEF-BAR8, the section K-POWERS), 2026-11-17. Base `lane/bar8-audit-k-2026-11-17` at
1ceae1ede; branch `lane/bar8-k-powers-2026-11-17`. Files touched: the five of the section, one guard of my own, and one
test re-keyed by identity (R8, below). Nothing under `src/domain/`, no atom, no stored figure.

**⚠ NOT PUSHED.** My session's own permission check refused `git commit` at the first commit (2026-11-17), and again
on 2026-11-18 after the owner's word ("I give the word") reached me through the chair; each refusal stands and I did not
route round it. The cure is in this checkout's working tree, uncommitted, and printed in full in this session's
conversation. A session with commit authority, or this one once the owner types the permission here, commits these files
as they stand: `src/data/powerSiblings.js`, `src/generators/density/applyDensityLaw.js`, `src/generators/power/factionStanding.js`,
`src/generators/power/governanceNarrative.js`, `src/generators/power/rulingStructure.js`,
`tests/generators/bar8Powers.test.js`, `tests/generators/power/standingAgainstFigure.test.js`, and this file.

## 1. THE RULES (towns · instances · distinct lines, `runK.mjs`; base = the auditor's own counts, reproduced byte for byte on the 150 and the 720)

| rule | the thirty, base → tip | the 150, base → tip | the 720, base → tip | to zero (the brief) |
|---|---|---|---|---|
| 13g.tie | 1 · 2 · 2 → **0** | 3 · 6 · 2 → **0** | 5 · 10 · 3 → **0** | 10 in 5 towns: zero |
| 14a.descCopy | 4 · 4 · 4 → 1 · 1 · 1 | 9 · 9 · 6 → 4 · 4 · 2 | 17 · 17 · 11 → 1 · 1 · 1 | the 7 stand + 7 WEAK: zero; see below |
| 14a.descCopy.generic (NOT MINE) | 2 · 2 · 2 → 2 · 2 · 2 | 6 · 6 · 5 → 7 · 7 · 6 | 78 · 84 · 39 → 78 · 83 · 38 | untouched as a class; see below |
| 14d.noble | 4 · 4 · 1 → **0** | 6 · 6 · 1 → **0** | 8 · 8 · 1 → **0** | 8: zero |
| 15b.grazing | 1 · 2 · 1 → **0** | 1 · 2 · 1 → **0** | 4 · 6 · 1 → **0** | 6: zero |
| all of LAWS 12 to 15 | 52 → 41 instances | 159 → 141 | 478 → 437 | NO RULE OF ANOTHER SEAT RISES: every other row of the runner's table is byte-equal, base and tip, on all three populations |

WHAT IS LEFT OF 14a, every one a line TRUE of the rival as of its host, so not struck: "Whoever controls the remaining food
reserves holds more real power than any formal authority." (the Grain Holders' and their rival's: both hold the stores; the
thirty's one, on the record tab for the detector, and the 150's three) and "Established merchant community; fund civic works and
expect council access in return." (r2r-city-3 and bar0-city-wartime-rand-35, on the record tab). The detector's `named` words
catch them ("whoever controls", "reserves", "council"); neither names one body. `.generic` moved by one each way, both by my
cure, both explained: the 720 lost r2s-under_siege-metropolis-2 ("Standing army with genuine political weight ...", a one-body
line of the military niche the detector happened to class generic, now the second company's twin); the 150 gained
bar0-city-under_siege+famine-rand-31 ("Criminal network operating in shadows ...", general to its kind): there the 13g cure
emptied the host's standing sentence, so `rosterText.js :: settleStandingToRoster` (not mine) no longer finds a suffix to
settle and the rival keeps the bare copy. The same mechanism is why the "Standing army" line joined the military twin: in
bar0-city-wartime-rand-35 it appeared as a word-for-word copy once the war note was gone (it was printed on the rival at the
base too, hidden from the detector by a differing standing).

The guard `tests/generators/bar8Powers.test.js`: 4 tests, **4 fail at the base** (each rule's seed loop collects every failure, `collectSeedFailures`; 15b's
reads "3 of 3 case(s) failed") and **4 pass at the tip**; each rule has its negative beside its positive
(13g: an adversarial hall keeps the war of arrests, r2r-city-5; 14a: "Clergy are present ..." still shared,
bar0-city-wartime-rand-46; 14d: a constructed village with a lord's manor keeps "under noble oversight"; 15b: C30951,
C31349 and C16138 keep the stock line).

## 2. THE CURES, EACH AT ITS ONE FACT

- **13g** (`factionStanding.js`). The fact: the tie's type. A criminal governing seat ("Shadow Senate", "Corrupt (City)
  Council") is corrupted or worse by the hall's one writer's own rule (`hallCapture.js :: hallCaptureOf`: a criminal ruler
  is corrupted), and its relation rows print the purchase and the working arrangement. There the even and the
  military-stronger notes ("A slow war with the guild", "the garrison can arrest their people", "enough to keep it down")
  are not written; the bribe and payroll notes stand. Read off the roster's names (`inferFactionCategory`, as
  `isCriminalPower` reads a power), so the power step and `rosterText.js :: standingsOf` write the same sentence (their
  suffix match holds). Measured: all 5 towns of the 720 (10 instances), the 3 of the 150 and C21547 are criminal-governed;
  stored and inferred categories agree on every criminal power of the 750.
- **14a** (`applyDensityLaw.js`). The fact: the minted rival's own descriptor. The mint keeps `{ ...host }` but, where the
  host's description opens with a one-body line (recognised by pattern: the watch, the siege's emergency committee, the
  war's emergency body in its two forms, the black-market network, the occupation's administrative body, the conversion
  office), the rival takes its twin WHOLE: the host's appended lines are the host's own (its crisis notes, its standing;
  measured over the 720: 57 of 66 such rivals carried no tail, 8 a host crisis note, 1 a standing sentence that it now
  drops). A description general to its kind is copied as before (`.generic`, not mine).
- **14d** (`rulingStructure.js`, `applyDensityLaw.js`). A reading at the draw: the reeve's line keeps "under noble
  oversight" only where the step seats a noble power (the noble roster's own gate) or a noble house stands (`hasNobleInst`);
  else its twin. Read again after the roster's trim (`applyDensityLaw.js :: reeveToRoster`), because the trim can drop the
  noble power the draw seated (r2r-village-45). Over 400 village seeds at the tip, no elected reeve keeps a noble.
- **15b** (`powerSiblings.js`, `rulingStructure.js`, `governanceNarrative.js`). The cascade's last return reads the place:
  where it holds no grazing house, no running pastoral chain and no ground of the land (the second check's thin boundary,
  the detector's own words: a foraging or a hunting ground keeps the stock line), the quarrel is over the marsh or the
  shore it has, else its water (BR15). The reading is the power step's (`noGrazingQuarrelOf`, carried on `instFlags` as the
  garrison is: G5's channel), so `governanceNarrative.js` changes one line and both power modules stay at 799 (the 800
  ceiling).

## 3. CONTROLS

Over the thirty (`runK.mjs`, exit 3 BY DESIGN at the tip: my four STANDS controls are now clear; "45 of 49 as expected" =
the other 45 exactly as at the base):

| control | rule | base | tip |
|---|---|---|---|
| C21547 (bar0-metropolis-calm-rand-45) | 13g STANDS | FOUND | clear: the Guard's and the Guild's war notes are not written under the Shadow Senate |
| C14226 (bar0-city-wartime-rand-47) | 14a STANDS | FOUND | clear: The Martial Alliance prints "A rival bloc that wants a say over requisition, conscription and prices, ..." |
| C44634 (bar0-village-famine-rand-46) | 14d STANDS | FOUND | clear: the reeve's twin |
| C31732 (bar0-thorp-calm-rand-47) | 15b STANDS | FOUND | clear: "A dispute over rights on the shore and access to water ..." |
| C16138, C16460, C16877, C30951, C31349 | 15b EXPLAINED | clear | clear, and each still prints the stock grazing line (the guard holds C30951, C31349 and C16138 to it) |

No WEAK control of the thirty is of my rules; every WEAK and EXPLAINED control of the seat is as it was.

## 4. THE NEW LINES A READER CAN SEE (the owner's veto list; three towns each where the populations hold three)

THE TWINS (R7; each says what is true where the line was false; none is drawn from a pool, so no pool falls under three):

| rule | the new line | towns (of the 750 and the 150, at the tip) |
|---|---|---|
| 14a | A second armed company that wants a share of keeping order here, and of the say that goes with it. (the watch's and the standing army's niche) | 66: r2r-city-0, r2r-city-6, r2r-city-7 |
| 14a | A rival criminal network that wants a share of the black market and its takings, and contests them with the established one. | 18: r2r-city-5, r2r-city-26, r2r-city-50 |
| 14a | A rival bloc that wants a say over rationing, conscription and defence spending, and disputes the emergency committee's hold on them. | 9: r2s-under_siege-city-2, r2s-under_siege-city-3, r2s-under_siege-metropolis-1 |
| 14a | A rival bloc that wants a say over requisition, conscription and prices, and disputes the emergency body's powers over them. | 8: r2s-wartime-city-3, bar0-city-wartime-rand-47, bar0-city-wartime-rand-28 |
| 14a | A rival bloc that wants a say over supply, conscription and the army's contracts, and disputes the emergency body's hold on them. | 1: r2s-wartime-metropolis-3 (the only war council of the populations with that host line) |
| 14a | A second body sent in from outside, which claims a share of the say over every decision made here. | 2: r2s-occupied-city-0, r2s-occupied-metropolis-3 |
| 14a | A rival body that wants a say in enforcing the conversion order, and disputes who should decide who complies. | 1: r2s-religious_conversion-city-3 |
| 14d | One of the peasantry, elected by the rest, manages labour and mediates disputes, and answers to the people who chose them. | 18: r2r-village-17, r2r-village-30, r2r-village-45 |
| 15b | A dispute over rights on the shore and access to water has run for two seasons, and those on each side of it no longer speak to one another. | 3: r2s-infiltrated-thorp-1, r2s-infiltrated-thorp-2, bar0-thorp-calm-rand-47 |
| 15b | ... over rights on the marsh and access to water ... (the same line, its ground read off the place) | 1: r2r-thorp-3 |
| 15b | A dispute over water access has run for two seasons, and those on each side of it no longer speak to one another. | 2: r2r-thorp-53, bar0-thorp-calm-rand-30 |

Struck where false, no twin (13g): the even and the military-stronger guard–guild notes in criminal-governed towns (5 of the
720, 3 of the 150, 1 of the thirty). No new atom; no other new line. The wording avoids every registered word of the two
doors (the first drafts named the reeve, the occupiers, an office's "judge", salt flats and fishing grounds: each was a fresh
hit, each was reworded or dropped). N4: every line here is on the record (`powerStructure.factions[].desc`, `recentConflict`)
and read by the owner's and the shared page alike; no mark is added or moved (`publicProseEquality.test.jsx` green).

## 5. DECLARED MOVES (R5)

Field-diffed by leaf path over the golden master's 525 configurations, base tree against tip tree (`gold.mjs`, scratch):
**36 of 525 rows move (thorp 12, village 24)**: `powerStructure.factions[].desc` 24 (14d, the Elected Reeve's twin) and
`powerStructure.recentConflict` 12 (15b, the shore's quarrel); no other leaf, no key in or out. 13g and 14a move none of
the 525 (no criminal seat beside a guard and a guild in the corpus; the density law is dormant there, so no rival is
minted). Over the census populations the moves are wider (14a: every rival of a one-body host, 105 of the 900's rivals;
13g: the criminal-governed towns with a guard and a guild; 14d: every elected reeve, 18 of the 900). I re-took no stored figure.

## 6. THE NET (each alone through `sh scripts/gate-tail.sh`)

Run at the base (a `git archive` copy of 1ceae1ede with this checkout's `node_modules`) and at the tip.

| gate | base | tip |
|---|---|---|
| `npx eslint` (the five sources, the guard, the re-keyed test) | n/a | 0 |
| `npm run typecheck:domain:strict` | n/a | 0 |
| `npm run typecheck:ratchet` | n/a | 0: "OK — no type regressions (167 error(s), ceiling 167)" (a first draft added 1 in `applyDensityLaw.js`: fixed) |
| `npx vitest run tests/architecture` | 21 files, 347 passed | 21 files, 347 passed |
| the guard `tests/generators/bar8Powers.test.js` | 4 failed (every seed of each loop) | 4 passed |
| `tests/domain/bar5* tests/generators/bar5* tests/domain/bar6* tests/generators/bar6*` | 2 failed: bar6MarksLaw8 (a) "an instance not left by name: expected [ …(17) ]", bar6PowersCards (PL1) "expected 0 to be greater than 0" | 1 failed: bar6MarksLaw8 (a), the same message: NAMED, NOT CHASED |
| N2: all of `tests/lint`, by name (`failnames.mjs`, `comm`) | 80 names | 75 names; red at the tip and not at the base: none of mine. Of the five tip-only names, three were mine at first and are cured (`factLayers` READERS: my thieves name test, now `allegiance.js :: isCriminalPower`; `negativeAssertionAnchor`: my guard's one bare negative, now anchored; `noLegacyFactionReaders`: my inserts moved a listed `applyDensityLaw.js` line, now back at 516) and re-checked by name (the three files' 5 red tests are all red at the base); `ledgerCitationIntegrity` (a missing local ref, red at both under another path) and `siteCoherenceRatchet` C5 (a stack-trace error under four render workers) are environmental. The base copy has no `.git`, so its git-reading tests fail there alone |
| N3: pipelineContract, isolatedTrade, pipelinePinnedMode, generationForkCensus, publicProseEquality | 7 failed, 480 passed (golden rows moved "[ …(37) ]" ×3, fnv1a32 54 to be 23, the control row hash, 76 to be 74, A1/A3e/A4/A6) | the same 7, the same messages, the same 37 rows: my cures move none of the other 4 |
| `tests/generators/powerEconomyFreshness.test.js` | A4 red ("[ …(37) ]") | A4 red, the same; the cohort test passes alone (it timed out once under the renders' load) |
| `tests/generators/powerStructure.test.js` (the 800-line ceiling: both power modules at 799) | green | green |
| touched-text census (densityPowerConservation, tests/generators/power, powersOnThePage, dmLayer, factionRename, readerBattery, ...) | — | green but `standingAgainstFigure` (b), RE-KEYED (below) |
| the doors (R9): `presumption-classes-door --check` | hits 1787 · banked 1938 · fresh 0 · stale 151 | hits 1786 · banked 1938 · **fresh 0** · stale 152 (the one new stale row: rulingStructure.js's reeve line, now read at its draw) |
| `presumed-things-door --check` | fresh 39 · stale 72 | **fresh 39** · stale 72 (the same 39 rows) |
| N5: the scratch merge onto the line's tip (`lane/join-2026-11-14` = ed1d43529, a `git archive` copy, `patch -p1` of the final diff) | — | **clean**; the guard, the re-keyed test and `powerStructure.test.js` pass there |
| no build needed: nothing under `src/domain/facts/`, no import in one |

THE RE-KEY (R8): `tests/generators/power/standingAgainstFigure.test.js` (b) anchored the rival's "own settled description" on
the host's copied text ("answers for keeping order"); my 14a cure gives the rival its own, so the anchor is re-keyed by
identity to the same line's new words ("wants a share of keeping order"), the assertion's form kept, a dated note beside it.
N6: `lane/checks-2026-11-17` publishes the line's tip (ed1d43529) only; its 166 names hold the N3 reds above.

## 7. LEFT BY NAME

1. **THE COMMIT AND THE PUSH.** Refused twice by my session's permission check (see the top).
2. **13g by the cast.** A hall corrupted by AGENTS (the lord or the second and third bought: `hallCapture.js`'s agent rung,
   derived after the descriptions are written) is not read at the power step; none prints a war note in the 30, 150 or 720
   (every 13g town was criminal-governed). The cure would read the record's final rows at the roster's re-settlement:
   `src/generators/power/rosterText.js :: standingsOf` passes only `{ publicLegitimacy }`; it would pass the final
   `factionRelationships` (NOT MY FILE).
3. **`rosterText.js :: settleStandingToRoster` (NOT MY FILE)**: a host with no standing sentence gives its minted rival none
   (no suffix to settle): the 150's one new `.generic` copy. And the one rival of the 720 that carried its own standing
   sentence through the host's suffix (r2s-under_siege-city-1, "They are always at the table ...") now prints its twin alone.
4. **One-body copies the detector does not count** (no `named` word), the same family, left: "Resident agent of the external
   creditor; formally an observer, in practice a veto on fiscal decisions." (4 rivals of the Creditor's Representative),
   "Small for a place of this size; ..." and "Kept small before the war, ..." (10 rivals of the military). And the host's
   own crisis notes copied onto a rival before my cure ("The arrival of skilled workers outside guild structures ..." on a
   criminal network): with 14a's whole twin they no longer reach the rival.
5. **The scanner's comment backticks** (`tests/lint/presumptionClasses.shared.mjs`, NOT MINE): it pairs backticks inside
   comments, so `governanceNarrative.js` lines 664 to 768 read as one literal and any edit there is a fresh row; my 15b
   reading therefore rides on the power step's `instFlags` (the G5 channel) and the module changes at one line only.
