# BAR6-POWERS · hand-back (LAW 10: 10f, 10h; LAW 6: 6d-members, 6d-blurb; the force line's missing key)

Seat BAR6-POWERS of the BAR6 round (brief `docs/chair/2026-11-14/briefs/BRIEF-BAR6.md` on the chair's lane, section
"BAR6-POWERS"). Base: the joined line `lane/join-2026-11-14` at **afa46d644**. Branch: `lane/bar6-powers-2026-11-16`.
Detectors: auditor F's `runF.mjs` (10f-*, 10h), auditor C's `runC.mjs` (6d-members, 6d-blurb), BAR5-AUDIT-A's `run-a.mjs`
(1c-force, BAR5-POWERS's own count). Renders: PAGE-COPY `census3.sh --count-only`, each population at the base and at the tip.

**First count (B2): my counts at afa46d644 EQUAL the audit's figures in all three populations; no difference to explain.**

## THE RULES

| rule | the two readings, and where | the one fact made | the 150 before → after | the 720 before → after | the fresh 300 before → after | cured by the one change / line by line |
|---|---|---|---|---|---|---|
| 10f-kind | the governing category (`chooseGoverning`: a City/Grand Council renamed High Theocratic, Ecclesiastical, Military …) vs the card (`govDescByLabel[govBody]`, the plain council's) in `rulingStructure.js` | the seat's card is read for the seat's own name for all three council bodies (`militaryForceLine.js :: COUNCIL_BODIES`; before, only a Town Council) | 3 / 3 → 0 | 8 / 8 → TIP720 | 0 → TIP300 | one change |
| 10f-tier · 6d-blurb | the merchants' lowest card ("a small group of traders who come on market days") vs the tier | `marketDayLineOf(tier, …)`: a city or a metropolis takes a twin | 1 / 1 → 0 · 1 → 0 | 2 / 2 → TIP720 · 2 → TIP720 | 1 / 1 → TIP300 · BASE300 | one change |
| 10f-weight | the nobles' card names "the merchant guilds" vs the power it weighed (the first "Merchant…" power: the ruling Grand Merchant Oligarchy) in `factionStanding.js` | the clause names the power it weighed (`arcaneAheadSaid`'s form) | 1 / 1 → 0 | 1 / 1 → TIP720 | 0 → TIP300 | one change |
| 10f-backs | `houseBacksOf` (catalogue shares: the seat's house lands on the ruler and on the leader of each archetype) vs the ruler's high quarrel | `powerSupport.js :: houseBacksShownOf`: THE RULER'S OWN SEAT BACKS THE RULER ONLY, a reading at print, read by the Institutions tab (ruling IT1), the Power tab's web and the PDF | 5 / 5 → 0 | 28 / 28 → TIP720 | 15 / 15 → TIP300 | one change |
| 10h | `hookLines.js :: hookPartyOf` printed the raw roster label ("Military/Guard has …") vs the prose form `powerSentenceName` | the party prints its prose form; the draw keys on the raw label, so no hook is re-drawn | 2 / 2 → 0 | 5 / 5 → TIP720 (1 is the Overview's, BAR6-SCENES's `narrativeText.js`) | 4 / 4 → TIP300 | one change |
| 6d-members | DS-POW-5 › council v4 ("its members cannot agree") vs the page's "· 1 member" | NEW ATOM `seat members` (`src/domain/facts/seatMembers.js`): two members or more on the roster, as the Power tab counts them (`membersByRank`); none cast, the government's label (`rulingBody`) | 9 / 9 → 0 | 33 / 33 → TIP720 | BASE300 → TIP300 | declared on the line; a twin for one holder |
| 1c-force (BAR5-POWERS's) | the military card (step's roster) vs the settled roster | the late key: `forces: factsOf(settlement).defence` in assembleSettlement.js's late reconcile (= `defenceOf(settlement)`, through the fact home the file already imports: no import line added) | 1 → 0 | 9 → TIP720 | 3 → TIP300 | the one line |

Named exclusions in the detectors: none. Precision: the detectors are the auditors' as written; no change to any.

**The guard:** `tests/domain/bar6PowersCards.test.js`: (a) the zero, `law10f` and `law10h` over the record's printed lines
(the stored descriptions; each house and what it backs as the page reads it; the dossier's plot hooks) in every town where
10f or 10h fired at the base (42 of the 720, FRESH300N of the 300), and `seat members` false in every town where 6d-members
fired (33 of the 720, FRESH300M of the 300), with the declaration and its twin found by their own marks; (b) positive control:
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
**31 at the base → 4 at the tip.** 5 left by rewording (no size or members presumed), 22 by a reviewed reason in my table
`docs/chair/2026-11-16/bar6/AUDIT/tables/G.exclusions.POWERS.json` (a card bound to the power whose name gives its word,
a pool key that states its want, an idiom the lexicon misreads, a line `forceLineOf` reads against the roster). THE FOUR
LEFT are sovereign-class cards in `rulingStructure.js` that need ruling SV1's atom, which is BAR6-HOUSES's and not at my
base: "A reeve elected from the peasantry … under noble oversight." and three noble-house cards naming "the crown"
("The great noble houses are the crown's …", "Hereditary landowners whose cooperation the crown depends on …", "Noble
families nominally loyal to the crown …"). Named for BAR6-HOUSES's atom.

## What moved, by file

- `src/generators/power/rulingStructure.js` (799 lines, at its F31 ceiling: no line added): the seat card's read for all
  three council bodies; the merchants' lowest card through `marketDayLineOf`; the import line names the two.
- `src/generators/power/militaryForceLine.js`: `COUNCIL_BODIES`, `MERCHANTS_OF_LITTLE_WEIGHT_LARGE`, `marketDayLineOf`.
- `src/generators/power/factionStanding.js`: the nobles' "more say" clause names the power it weighed.
- `src/domain/dossier/powerSupport.js`: `houseBacksShownOf` (print only); `deriveFactionSupport` and `institutionBackers`
  read it. `houseBacksOf` is UNCHANGED (see "the premise the code showed false").
- `src/components/new/tabs/InstitutionsTab.jsx` (ruling IT1): the import name, the one call in `institutionsWithServices`,
  the two doc comments that cite it. Nothing else.
- `src/domain/dossier/hookLines.js`: `hookPartyOf` returns `{ name, plural, key }` (the name in prose form, the key raw);
  the draw keys on `key`; the PROPERTY line "… own members cannot agree whether to take it." reworded.
- `src/domain/facts/seatMembers.js` (new), and the shared vocabulary: `seat members` beneath `seat outranked` in
  `factVocabulary.js` (with its typedef property), its getter beside `seatOutranked` in `factsOf.js`, its home beside it in
  `factLayers.js` (layer 4: npcs, powerStructure).
- THE POWER DESK of the annex (DS-POW-5 council v4 declared `seat members`, v5 the twin; four lines reworded) and
  `src/data/dossierStateProse/power.generated.js` (only my lines: checked by diff).
- `src/generators/steps/assembleSettlement.js`: THE ONE LINE (l.271), the key `forces: factsOf(settlement).defence`.

**The premise the code showed false (10f-backs):** the audit read `houseBacksOf` as display only. It is also the birth's
arithmetic: `generators/people/castPowers.js` deals the memberships from it and `generators/power/rulerKin.js` the ruler's
kin. Cured there, it re-drew people, ranks and ties in 50 of the 150 (measured, reverted). The cure is at print.

## THE VETO LIST (every new or newly reached line, with three towns it is read in)

VETOTABLE

## The books my cures move

BOOKSTABLE

## The reference (525 configurations) against afa46d644

REF525

## Registrations owed

- New vocabulary: the atom `seat members` (B6: beneath `seat outranked`, its subject; its reader the leaf `seatMembers.js`).
- New test file `tests/domain/bar6PowersCards.test.js` (under `tests/domain`: no mutation-manifest entry owed).
- No new goods import; no new module reached by the eager core that imports a lazily pinned one (ENGINECORE).

## Named for other seats (through the chair)

- BAR6-HOUSES: the four sovereign-class cards of `rulingStructure.js` above wait on SV1's atom (mine to declare once it lands).
- BAR6-SCENES: the fifth 10h instance of the 720 is the Overview's `narrativeText.js` line (`r.topFaction`), as the brief says.

## What is left, in order

LEFT

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

## FOR THE OWNER, IN PLAIN WORDS

OWNER
