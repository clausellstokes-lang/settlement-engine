# F3 FOOD-WORDS — the measure and the cure (2026-11-04)

Lane `lane/rung1b-f3-food-words-2026-11-04`, cut from `lane/window-rung1-2026-11-04` at `f9ce225c`.
Brief: docs/SOAK_1000_RUNG1B_2026-11-04.md §2 (coh:food-words, 3) and §5 F3.

## 1. The measure on the base (`artifacts/f3-base`, 1,000 settlements, `f9ce225c`)

coh:food-words = **3**: `soak1k-20`, `soak1k-857`, `soak1k-890`, the same three as rung 1B. Every
other class: A-05 977, A-06 16, A-09 7, A-11 14, A-12 1, A-14 1, X-50 30, coh:defense-words 534,
info:battery-would-not-vouch 808.

**soak1k-20** (village, crossroads, inland). Writer: the export list (economicState.primaryExports,
the Economics tab and the Foundry journal's Exports row): "Furs and pelts · Game meat · Hunting
trophies · Transit trade · Toll revenue · Leather goods · Guild-manufactured goods · Preserved foods
· Meals and drink". The record: band **secure**, `growsMoreThanEats` **true**, sources **game**. The
place is NOT short of food. The finding is `source_not_held: livestock`, not a surplus claim: the
instrument reads the whole list as one sentence, "Meals" trips TABLE_WORDS and the "meat" of "Game
meat" trips the livestock source words (`domain/foodways.js :: SOURCE_WORDS.livestock`). "Preserved
foods" plays no part. The line is true by the record (game meat from a game source) — an
**instrument reach** reading of a game good as livestock. CONFIRMED (quote, record, regexes).

**soak1k-890** (village, port, waterAccessKind **maritime**). Writer: the Fishmonger's drawn
description (`src/data/institutionDescVariants.js`, the fishmonger pair, picked in
`assembleInstitutions.js`): "The trade that carries fish from the net to the table." The roster also
holds a Fisher's landing ("Primary protein source near water"). The record: band **pressured**,
`growsMoreThanEats` false, sources **none** — `foodGenerator.js` lists fish only with a fishing row
AND a `fishing_grounds`/`river_fish` resource, and this coast has no such resource. So the row is
licensed by water under the brief's own licence; the instrument flags it because the food record,
the one home, says the place has no fish source. The contradiction is between the food record and
the fishing rows, not between the text and the water fact. CONFIRMED.

**soak1k-857** (metropolis, river, stress **under_siege**). Writer: the siege pool of stress secrets
(`src/data/stressInstitutionEffects.js :: under_siege`, stakes "People are starving. The supplies
could last another month"), drawn by `npcGenerator.js :: generateCrimeLevel` from the stress alone;
two NPCs carry it (PDF and Foundry). The record: band **importDependent**, `growsMoreThanEats` false,
stores **15 months**. The place grows less than it eats but is not starving: the record denies the
line. Not instrument reach — a TRUE finding. CONFIRMED.

## 2. Unit 2 (EXPORTS) — STOP

The brief's premise for `soak1k-20` ("Preserved food on a place short of food") does not hold: the
place is secure and grows more than it eats, so the processed-food rule removes nothing there and
cannot go red-first on it. The rule itself has a population (measured on soak1k-0..119): **38 of 120**
places that grow less than they eat export a processed food good — e.g. `soak1k-12` a famine thorp
exporting Mountain cheese, `soak1k-3` a famine town exporting Baked goods, Salted fish, Smoked
seafood — but many are secure import-fed cities processing imported food (`soak1k-5`, `-16`,
"Preserved foods"), which the brief's "whose input is the place's own food" clause would keep. The
instrument does not read "Preserved foods" as a claim at all. Left for the chair: (a) whether to
rule the processed-food rule on its own red (a famine place exporting cheese) rather than on
soak1k-20, and (b) the soak1k-20 instrument reach ("Game meat" read as livestock; an export list
read as a sentence about the table).

## 3. Unit 3 (THE FISH LINE) — STOP

`soak1k-890` is maritime with a Fisher's landing: the brief's water licence licenses the line, so
gating on water changes nothing there and cannot go red-first. What would cure it is a ruling on
which of two facts governs: the food record (no fish source: no fishing-grounds resource) or the
fishing rows on water. ONE FACT, ONE HOME points at the record — gate the fish-trade texts on
`foodSources` including fish, or let a fishing row on water count fish as a source in
`foodGenerator.js` (which moves the food balance and the goldens). Left for the chair.
