# BAR6-POWERS · hand-back (LAW 10: 10f, 10h; LAW 6: 6d-members, 6d-blurb; the force line's missing key)

Seat BAR6-POWERS of the BAR6 round (brief `docs/chair/2026-11-14/briefs/BRIEF-BAR6.md` on the chair's lane, section
"BAR6-POWERS"). Base: the joined line `lane/join-2026-11-14` at **afa46d644**. Branch: `lane/bar6-powers-2026-11-16`.
Detectors: auditor F's `runF.mjs` (10f-*, 10h), auditor C's `runC.mjs` (6d-members, 6d-blurb), BAR5-AUDIT-A's `run-a.mjs`
(1c-force, BAR5-POWERS's own count). Renders: PAGE-COPY `census3.sh --count-only`, each population at the base and at the tip.

**First count (B2): my counts at afa46d644 EQUAL the audit's figures in all three populations; no difference to explain.**

## THE RULES

| rule | the two readings, and where | the one fact made | the 150 before → after | the 720 before → after | the fresh 300 before → after | cured by the one change / line by line |
|---|---|---|---|---|---|---|
| 10f-kind | the governing category (`chooseGoverning`: a City/Grand Council renamed High Theocratic, Ecclesiastical, Military …) vs the card (`govDescByLabel[govBody]`, the plain council's) in `rulingStructure.js` | the seat's card is read for the seat's own name for all three council bodies (`militaryForceLine.js :: COUNCIL_BODIES`; before, only a Town Council) | 3 / 3 → 0 | 8 / 8 → 0 | 0 → 0 | one change |
| 10f-tier · 6d-blurb | the merchants' lowest card ("a small group of traders who come on market days") vs the tier | `marketDayLineOf(tier, …)`: a city or a metropolis takes a twin | 1 / 1 → 0 · 1 → 0 | 2 / 2 → 0 · 2 → 0 | 1 / 1 → 0 · 1 → 0 | one change |
| 10f-weight | the nobles' card names "the merchant guilds" vs the power it weighed (the first "Merchant…" power: the ruling Grand Merchant Oligarchy) in `factionStanding.js` | the clause names the power it weighed (`arcaneAheadSaid`'s form) | 1 / 1 → 0 | 1 / 1 → 0 | 0 → 0 | one change |
| 10f-backs | `houseBacksOf` (catalogue shares: the seat's house lands on the ruler and on the leader of each archetype) vs the ruler's high quarrel | `powerSupport.js :: houseBacksShownOf`: THE RULER'S OWN SEAT DOES NOT BACK THE RULER'S HIGH RIVAL (narrowed by the chair to the fault counted), a reading at print, read by the Institutions tab (ruling IT1), the Power tab's web and the PDF | 5 / 5 → 0 | 28 / 28 → 0 | 15 / 15 → 0 | one change |
| 10h | `hookLines.js :: hookPartyOf` printed the raw roster label ("Military/Guard has …") vs the prose form `powerSentenceName` | the party prints its prose form; the draw keys on the raw label, so no hook is re-drawn | 2 / 2 → 0 | 5 / 5 → 1 (the Overview's line, BAR6-SCENES's `narrativeText.js`: not mine) | 4 / 4 → 0 | one change |
| 6d-members | DS-POW-5 › council v4 ("its members cannot agree") vs the page's "· 1 member" | NEW ATOM `seat members` (`src/domain/facts/seatMembers.js`): two members or more on the roster, as the Power tab counts them (`membersByRank`); none cast, the government's label (`rulingBody`) | 9 / 9 → 0 | 33 / 33 → 0 | 12 / 12 → 0 | declared on the line; a twin for one holder |
| 1c-force (BAR5-POWERS's) | the military card (step's roster) vs the settled roster | the late key: `forces: factsOf(settlement).defence` in assembleSettlement.js's late reconcile (= `defenceOf(settlement)`, through the fact home the file already imports: no import line added) | 1 → 0 | 9 → 0 | 3 → 0 | the one line |

Named exclusions in the detectors: none. Precision: the detectors are the auditors' as written; no change to any.

**The guard:** `tests/domain/bar6PowersCards.test.js`: (a) the zero, `law10f` and `law10h` over the record's printed lines
(the stored descriptions; each house and what it backs as the page reads it; the dossier's plot hooks) in every town where
10f or 10h fired at the base (42 of the 720, 20 of the 300), and `seat members` false in every town where 6d-members
fired (33 of the 720, 12 of the 300), with the declaration and its twin found by their own marks; (b) positive control:
a record built from the wide read's rows C121364, C128237, C110252, C102099, C1980 on which all five rules fire, and the atom
on one, two and no members; (c) ruling IT1's three conditions. And `tests/domain/bar5PowersStanding.test.js`'s named
exclusion `AWAITS_THE_LATE_KEY` is LIFTED (1c-force joins its zero; green).

**B3, the wide read's standing rows of my rules** (`regress.py <base-150> <tip-150> my-rows.json --verdict STANDS --list`):

    rows 7 · SAME 0 · CHANGED 0 · GONE 7
      GONE C102099 bar0-metropolis-calm-rand-28 | Backs · Craft Guilds · Grand Guild Consortium
      GONE C110252 bar0-metropolis-calm-rand-30 | The merchant guilds now have more say: …
      GONE C121364 bar0-metropolis-calm-rand-33 | A grand council of senior officials, guild masters, and appointed magnates governs the metropolis; …
      GONE C128237 bar0-metropolis-calm-rand-35 | A small group of traders who come on market days; …
      GONE C1980 bar0-city-under_siege+famine-rand-28 | Military/Guard has posted guards on what it says is its own, …
      GONE C76763 bar0-city-wartime-rand-40 | A ruling on authority over military conscription lists went Military/Guard's way, …
      GONE C91256 bar0-hamlet-under_siege-rand-30 | The Headman's Authority at Drumwood has left obvious decisions untaken because its members cannot agree on them.

What prints in their place, in the same towns: "Backs · Grand Guild Consortium"; "Grand Merchant Oligarchy has more say now: the
noble families keep …"; "High Theocratic Council (governing): Senior clergy hold civic authority; religious law and civil law
are functionally the same."; "Merchants trade here in number but carry little weight in how the place is run; …"; "The Guard
has posted guards on what it says is its own, and Merchant City Council says … was never The Guard's to hold."; "… went The
Guard's way, …"; "The Headman's Authority at Drumwood has left obvious decisions untaken, and nobody in the hamlet can make it
take them."

**B4, LAW 5 WIDENED for my files** (auditor G's `law5w-inventory-g.mjs`; stock = status none, colour, other, any):
**31 at the base → 0 at the tip.** 5 left by rewording (no size or members presumed), 26 by a reviewed reason in my table
`docs/chair/2026-11-16/bar6/AUDIT/tables/G.exclusions.POWERS.json` (a card bound to the power whose name gives its word,
a pool key that states its want, an idiom the lexicon misreads, a line `forceLineOf` reads against the roster). The four
sovereign-class cards of `rulingStructure.js` read SV1's atom: the Elected Reeve's "under noble oversight" (the atom TRUE in
all 23 towns printing it in the 150, the 720 and the 300, at the settled record and from the houses alone), and three noble
cards naming "the crown", drawn only where Royal Authority governs (their own condition; printed in none of the 1,170 towns).

## THE NET (B8), run at the tip

`npm run typecheck:domain:strict` green; `npm run typecheck:ratchet` green (167 of 167); `npx eslint` on every changed source
file green; my guard `tests/domain/bar6PowersCards.test.js` green (and shown able to red: two cures reverted in a throw-away
tree, the zero arm and the seat case red); the round before's guards (`tests/domain/bar5*.test.js`,
`tests/generators/bar5*.test.js`) green, `bar5PowersStanding` with its late-key exclusion lifted; `tests/architecture` green;
117 files of the net (the test files that pin a symbol I changed, the law suites of BRIEF-BAR2 F2, BRIEF-BAR3 a2 and
BRIEF-BAR4 a2): every red classed in "the books my cures move" below; the base's named there.

## What moved, by file

- `src/generators/power/rulingStructure.js` (799 lines, at its F31 ceiling: no line added): the seat card's read for all
  three council bodies; the merchants' lowest card through `marketDayLineOf`; the import line names the two.
- `src/generators/power/militaryForceLine.js`: `COUNCIL_BODIES`, `MERCHANTS_OF_LITTLE_WEIGHT_LARGE`, `marketDayLineOf`.
- `src/generators/power/factionStanding.js`: the nobles' "more say" clause names the power it weighed (its old words, byte
  for byte, where that power is the Merchant Guilds).
- `src/domain/dossier/powerSupport.js`: `houseBacksShownOf` (print only: the seat drops a power the ruler is in HIGH conflict
  with, its share to the ruler; a second power with no quarrel stays; an authored or founded list stands); `deriveFactionSupport`
  and `institutionBackers` read it. `houseBacksOf` is UNCHANGED (see "the premise the code showed false").
- `src/components/new/tabs/InstitutionsTab.jsx` (ruling IT1): the import name, the one call in `institutionsWithServices`,
  the two doc comments that cite it. Nothing else.
- `src/domain/dossier/hookLines.js`: `hookPartyOf` returns `{ name, plural, key }` (the name in prose form, the key raw);
  the draw keys on `key`; the PROPERTY line "… own members cannot agree whether to take it." reworded.
- sovereign by XA1 from a804fa1b5 (`src/domain/facts/sovereign.js` and its twelve lines), the leaf re-taken byte for byte
  from 244981234 (blob 50b0fa0d, import-free) on the chair's word.
- `src/domain/facts/seatMembers.js` (new), and the shared vocabulary: `seat members` beneath `seat outranked` in
  `factVocabulary.js` (with its typedef property), its getter beside `seatOutranked` in `factsOf.js`, its home beside it in
  `factLayers.js` (layer 4: npcs, powerStructure).
- THE POWER DESK of the annex (DS-POW-5 council v4 declared `seat members`, v5 the twin; four lines reworded) and
  `src/data/dossierStateProse/power.generated.js` (only my lines: checked by diff).
- `src/generators/steps/assembleSettlement.js`: THE ONE LINE (l.271), the key `forces: factsOf(settlement).defence`.

**Considered and refused (the chair's ruling of 2026-11-16):** the wider form, "the ruler's own seat backs the ruler
only", narrowed the seat's line in 83 towns of the 720: a second power with NO quarrel printed is true, no reader of the 150
flagged it, and it is the line's interest (a hall partly in another's pocket). Narrowed, the seat's Backs line changes in 29
towns of the 720 (the 28 faults and one town whose seat also listed a third power).

**The premise the code showed false (10f-backs):** the audit read `houseBacksOf` as display only. It is also the birth's
arithmetic: `generators/people/castPowers.js` deals the memberships from it and `generators/power/rulerKin.js` the ruler's
kin. Cured there, it re-drew people, ranks and ties in 50 of the 150 (measured, reverted). The cure is at print.

## THE VETO LIST (every new or newly reached line, with three towns it is read in)

Read at the tip f6c79e9a5 over the 150, the 720 and the fresh 300 (1,170 towns): the line, the towns printing it, three of
them (the smallest, the largest, one under a crisis where any).

| line | towns | read in |
|---|---|---|
| the merchants' twin (city, metropolis) | 4 | bar0-city-under_siege+famine-rand-109, bar0-metropolis-calm-rand-35 |
| the nobles' clause naming the power it weighed | 13 | bar0-city-wartime-rand-107, r2r-metropolis-47, bar0-city-wartime-rand-114 |
| High Theocratic Council's own card (newly reached) | 17 | r2r-metropolis-1, r2r-metropolis-14, r2s-recently_betrayed-metropolis-2 |
| Ecclesiastical Council's own card (newly reached) | 13 | r2s-recently_betrayed-city-0, r2s-insurgency-city-1, bar0-city-under_siege+famine-rand-41 |
| Military City Council's own card (newly reached) | 14 | bar0-city-wartime-rand-103, bar0-city-under_siege+famine-rand-110, bar0-city-wartime-rand-111 |
| Merchant City Council's own card (newly reached) | 10 | r2r-city-12, bar0-city-wartime-rand-115, bar0-city-wartime-rand-36 |
| Grand Military Council / Grand Merchant Senate / Arcane Senate / Shadow Senate / Corrupt City Council (newly reached) | 80 | bar0-town-occupied-rand-103, bar0-metropolis-calm-rand-38, bar0-town-occupied-rand-122 |
| DS-POW-5 council twin (one holder) | 50 | r2r-thorp-15, bar0-village-famine-rand-125, r2s-politically_fractured-thorp-1 |
| DS-POW-1 safety, reworded | 0 |  |
| DS-POW-5 stateCrime, reworded | 0 |  |
| DS-POW-5 stateCrime heavy, reworded | 0 |  |
| DS-POW-6 recovering, reworded | 0 |  |
| the property hook, reworded | 2 | bar0-city-under_siege+famine-rand-107, r2r-metropolis-25 |
| a hook naming The Guard | 9 | bar0-city-wartime-rand-40, r2s-wartime-metropolis-1, bar0-city-wartime-rand-108 |
| BAR5's no-patrol twin (newly reached by the key) | 12 | r2r-hamlet-52, r2r-village-28, r2s-recently_betrayed-hamlet-0 |
| BAR5's no-force twin (newly reached by the key) | 1 | bar0-village-famine-rand-35 |

- NEW VOCABULARY: the atom `seat members` (`src/domain/facts/seatMembers.js :: seatMembersOf`), beneath `seat outranked`; its
  form for the seam's class table: a presence atom, home `seatMembers` (layer 4: npcs, powerStructure), true where the
  governing power holds two members or more on the roster, false at one, the government label's answer (`rulingBody`) with
  none cast; declared by DS-POW-5 › council v4, its twin v5 `no seat members`. Import-free (EG1).
- The four reworded DS-POW lines (DS-POW-1 safety "is policed worse", DS-POW-5 stateCrime "keeps {settlement} quiet" and
  "find nobody about and soldiers wherever they look", DS-POW-6 recovering "it is well guarded") print in none of the 1,170
  towns: read on the annex (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, DS-POW-1, -5, -6).
- The council cards "newly reached" are the existing lines of `govDescByLabel` / `govDescByFaction`, now printed for the City
  and Grand councils their kind renames; the Arcane Council row also counts towns that printed it at the base.
- The two force twins are BAR5-POWERS's lines (`militaryForceLine.js`), newly reached through the late key: all 13 printed in
  the 1,170 agree with the final roster (no twin beside a militia, a watch, a garrison or a company).

## The books my cures move

Stored figures my declared cures move further than the base (every file red at afa46d644 and at the tip with the SAME
message is the base's and is named below it). I re-take none.

| test | arm | afa46d644 | tip | its door |
|---|---|---|---|---|
| tests/property/generatorGoldenMaster.test.js | every config byte-identical to the master | 442 configurations off | 477 | the reference refresh (the owner's word) |
| tests/property/espionageDormancyFence.test.js | the driven golden, 360 settlements | digest acf628bf1… | 7535fc8ec… | its chartered window |
| tests/generators/pipelinePinnedMode.test.js, pipelinePinnedChoosers.test.js | golden rows moved (four arms) | 33 | 36 | the golden-derived re-take at the close |
| tests/data/dossierStateProseProjection.contract.test.js | the shift register's mutant arm (variants) | 2979 | 2980 | `docs/content/prose-shift-register.json` (row `vids`) |
| tests/lint/proseComposed.walker.test.js | GUARD THE GUARD (the shipped state corpus) | 2979 | 2980 | the close |
| tests/lint/proseEntryContradiction.walker.test.js | the corpus loaders (rows; homes) | 2742; 3447 | 2743; 3448 | the close |
| tests/lint/proseWiringCensus.walker.test.js | the VARIANT column | 2979 | 2980 | `docs/content/wiring-census.json` (ruling AX1) |
| tests/lint/wiringCensusDeclared.walker.test.js | the declared columns equal a fresh annex reading | 17 rows | 18 (DS-POW-5 › council) | the wiring census (AX1) |

Committed by my own cures, in their own commits, as the files' forms ask: `tests/lint/presumedThings.widened.register.json` (the
five rows my cures left stale, and only those: four DS-POW "streets" rows and factionStanding's "merchant guild"; the ten stale
at the base stay); `tests/lint/factLayers.poolTable.json` (DS-POW-5::council at layer 5, ruling PL1); the re-keyed pins
(`drawDeclaredKeys.walker` #266 → #271; `conflictHookDraw`, `conflictHookPlural`; the `seat members` setter of
`crisisBlindDossierProse`). NAMED FOR THE CLOSE (ruling AX1): the wiring census (`docs/content/wiring-census.json`, re-taken in
my scratch tree only to let the generator run, never committed); `proseNorms.generated.js` and the other desks' generated files
were not moved by my runs.

RED AT THE BASE AND AT THE TIP WITH THE SAME MESSAGE (the base's, not chased): `tailHouses1Gaps`, `generationForkCensus`,
`tieProseDeclared`, `mutationCoverageManifest`, `observedShapeReaders.walker`, `proseCorpusBytes`, `proseTasteCorruption.walker`,
`tuningRegister.walker`, `writerReach.walker`, `factLayers.walker`'s two leaf arms (`legalHouse` reads `availableServices`), the
rest of `dossierStateProseProjection.contract` and `proseWiringCensus.walker` (the stale census), `presumedThings.walker`'s ten
base rows, and `tests/build/vendorPdfLazy.test.js`'s goods-roster arm (`houseInputAtHand.js` has no roster row).

## The reference (525 configurations) against afa46d644

**241 of the 525 move against afa46d644, all in ONE field family: `powerStructure.factions[].desc`** (hashed by family, both
trees, `ref525hash.mjs`). A seeded sample of 31 of the 241, read pair by pair: 21 are BAR5-POWERS's no-patrol twin through the
late key ("Armed patrol of able-bodied residents; …" → "No watch or patrol stands here; …"), the calm grid's villages holding no
militia and no watch at the settled roster; the rest are the nobles' clause naming the merchant power it weighed (a Merchant
oligarchy or a Merchant Council, never "the merchant guilds" unless that is the power). No other family moves (people, ties,
memberships, the economy: unmoved).

## Registrations owed

- New vocabulary: the atom `seat members` (B6: beneath `seat outranked`, its subject; its reader the leaf `seatMembers.js`).
- New test file `tests/domain/bar6PowersCards.test.js` (under `tests/domain`: no mutation-manifest entry owed).
- No new goods import; no new module reached by the eager core that imports a lazily pinned one:
  `tests/architecture` green at the tip (21 files, 347 tests). ONE `npm run build` and `tests/build/vendorPdfLazy.test.js`: first
  red in two arms of mine (a lazy chunk in first paint: `seatMembers.js` imported `rulingBody.js`, which moved `rulerKindLabel.js`
  into coherence-lazy and dragged it, narrative-mutations and data-lazy into the entry closure; proved by a bisect build); cured
  by EG1's form (the leaf imports nothing; `factsOf` hands it the label's answer); at the tip only the base's goods-roster arm
  stays red. `dist/` removed.

## Named for other seats (through the chair)

- BAR6-HOUSES: the four sovereign-class cards of `rulingStructure.js` above wait on SV1's atom (mine to declare once it lands).
- BAR6-SCENES: the fifth 10h instance of the 720 is the Overview's `narrativeText.js` line (`r.topFaction`), as the brief says.

## What is left, in order

1. THE OVERVIEW'S 10h LINE (1 of the 720: r2s-politically_fractured-metropolis-0): `src/generators/narrativeText.js`'s
   `r.topFaction`, BAR6-SCENES's, as the brief says.
2. THE BOOKS above, for the close: the golden-derived files and the reference (241 of 525, one family), the shift register,
   the wiring census and its counts.
3. THE COUNCIL'S OTHER TWO LINES (DS-POW-5 › council v1, v2: "the whole {seat} must agree", "goes to the whole {seat}") speak
   of a whole body; no detector counts them and no reader flagged them; they could take `seat members` the same way.
4. `seat members` for the seam's class table (above), and `sovereign` held by XA1 (resolved to BAR6-HOUSES's at the join).

## How the instruments are re-made

1. Two scratch worktrees: the tip, and a detached tree at afa46d644 (`npm ci` there; the tip symlinks its `node_modules`).
2. Render: `HOLDERS=<pc>/holders.tipA.json sh <pc>/census3.sh <tree> <out> 4 --seeds <seeds> --count-only` (PAGE-COPY); the
   150 are `bar0-<shape>-rand-27..41` for the ten shapes; the 720 PAGE-COPY's `seeds.txt`; the 300
   `READ-ALL/packets11/seeds.fresh300.txt`. ONE RENDER AT A TIME: two at four workers each killed the container once.
3. Count: `node docs/chair/2026-11-16/bar6/AUDIT/runF.mjs <render> <out.json>`, `runC.mjs` the same, and
   `docs/chair/2026-11-16/bar5/AUDIT/run-a.mjs` for 1c-force.
4. B3: `regress.py <base-150> <tip-150> <rows.json> --verdict STANDS --list` over the seven rows C102099 C110252 C121364
   C128237 C1980 C76763 C91256 of `review-wide-6/SECOND-CHECK.final221.json`.
5. B4: `node docs/chair/2026-11-16/bar6/AUDIT/law5w-inventory-g.mjs <tree> <out.json>`, the stock of my files less my table.
6. The annex (ruling AX1): re-take the wiring census IN THE SCRATCH TREE ONLY (`node scripts/wiring-census.mjs`), run
   `npm run gen:dossier-prose`, restore the census from git, commit only `power.generated.js`.

## FOR THE A power's card on the Power tab now fits the power. A city governed by its clergy gets the clergy's description, not a
guild council's. A metropolis's weak merchants are no longer "a small group of traders who come on market days". When the
nobles' card says another power "has more say", it names a power that really weighs more. The ruler's own hall no longer
claims to back the ruler's open rival. A plot hook names "The Guard", not the roster label "Military/Guard". A one-person
council is no longer said to have "members who cannot agree". And a military card that promised "armed patrols" where none
exist now says plainly that no watch stands. Measured on 1,170 towns, each of these faults now reads zero. Only the stored
power descriptions change in the record (no person, tie or draw moved). The reference set moves in that one field., IN PLAIN WORDS

A power's card on the Power tab now fits the power. A city governed by its clergy gets the clergy's description, not a
guild council's. A metropolis's weak merchants are no longer "a small group of traders who come on market days". When the
nobles' card says another power "has more say", it names a power that really weighs more. The ruler's own hall no longer
claims to back the ruler's open rival. A plot hook names "The Guard", not the roster label "Military/Guard". A one-person
council is no longer said to have "members who cannot agree". And a military card that promised "armed patrols" where none
exist now says plainly that no watch stands. Measured on 1,170 towns, each of these faults now reads zero. Only the stored
power descriptions change in the record (no person, tie or draw moved). The reference set moves in that one field.
