# WRITE-PEOPLE — the record (2026-11-08)

**Seat:** WRITE-PEOPLE, the allegiance train's writing seat B. The first seat wrote item 1; the second seat (WRITE-PEOPLE-2, session `01FbPLbdCcaPrZ5YxDP34LeK`) wrote items 2–5. Both are children of the cloud chair (session `01FbPLbejcfwX5nii12VM673`), under the owner's full delegation. **Brief:** `docs/allegiance/BRIEF-WRITE-PEOPLE-2026-11-08.md`. **Branch:** `lane/write-people-2026-11-08`, cut from `origin/lane/integration-2026-11-07` with `origin/lane/allegiance-design-2026-11-08` merged.

**Every line written here is DATA. Every line is listed in its data file FOR THE OWNER'S VETO**, and the owner may strike or change any of them with a word. No wiring was done. No edit touched `npcData.js`, `relationshipArchetypes.js`, `ties.js`, `poolMap.js`, `npcGenerator.js`, a golden fixture or a register; the one exception is the roster's two lines in item 5.

## 1. The manifest

| item | file(s) | lines | state |
|---|---|---|---|
| 1 | `src/data/people/handlerTieLines.js` + `tests/data/handlerTieLines.test.js` | 68: 3 kinds × (6 desc + 6 tension), 4 leverage sub-kinds × (4 + 4) | **the first seat's**, commit `ee20f15b4`, the brief's first push. The second seat measured it green at its base (4/4, exit 0) and did not touch it. |
| 2 | `src/data/people/dmPowerLines.js` + `tests/data/dmPowerLines.test.js` | 21: patronage 2 kinds × 3, capture 5 rungs × 3 | pushed `1f60470eb` |
| 3 | `src/data/people/titleSecretsPresentations.js` + `tests/data/titleSecretsPresentations.test.js` | 498: 83 titles × (3 secrets + 3 presentations), the chair's 90% coverage cut (§2a) | `05dd0064c` wrote all 147; the cut commit follows it |
| 4 | this record | — | this commit |
| 5 | `tests/lint/.source-citation-baseline.json` (`dated` 153 → 154, a `_rosterGrowth` note) and the walker header's dated line | — | this commit |

The lane's lines total 587: item 1's 68, item 2's 21 and item 3's 498.

## 2. The title list, measured (item 3)

**The measurement.** The soak 1,000 ran at the base (`node scripts/audit/soak-review.mjs --count 1000 --workers 4`, exit 0). A census on the same 1,000 seeds then ran through `scripts/audit/soak-review/corpus.mjs :: birth`. It used **PEOPLE-1's own definition** (`docs/chair/2026-11-07/people-1/measure.mjs`):
- house faces only;
- a seat house's face draws through the tier's seat role (`poolMap.js :: seatPoolFor`), every other face through `poolMap.js :: poolFor`;
- a title is listed when its pool row is a `fallback` on at least one card.

PEOPLE-1's seat test read `c.role`, which has been the title since M-1b. The census therefore finds the seat house by `representatives.js :: seatHouseOf`.

**The result: 147 titles fire as fallbacks, on 22,892 of the 28,622 house-face cards.** That is not design §6.5's 76.
- **Why the counts differ.** The 76 were the titles PEOPLE-1's prose names before "the rest of the long tail". The revised face census later added frequent rows that list never named: the warehouse factor 405, the master fishmonger 378, the watch commander 332, the master of granaries 332, the senior charter master 304, the stable master 266, and others.
- **The other cards on the 1,000.** 48 house titles fire and are not fallbacks: their roles hold a goal pool of their own. The 398 power faces are the two mints' cards: "the head of …", the seat mints and the `other` mints. The 23 cards with no title are the temporary crisis cards (`npc_temp_*`, category `civic`). They carry no secret and no presentation, so they are not a defect.
- **The list.** It runs in card-count order, from the miller 666 to the scribe 4. The data file's `TITLE_ORDER` holds the first 83 (§2a). Its first twenty: the miller · the innkeeper · the warehouse factor · the apothecary · the master smith · the master fishmonger · the master weaver · the bowyer · the master carpenter · the potter · the tailor · the brickmaker · the cobbler · the master butcher · the brewer · the cooper · the watch commander · the master of granaries · the smelt master · the master baker.
- **The pin.** `TITLE_CARDS_ON_THE_1000` holds each written title's count. The test pins the 83 titles, their 20,605 cards, the order, and the cut as the first prefix to reach 90%.

**The other fills the soak gave** (the brief's "real fills"):
- **Corrupt vectors:** greed 621 · fear 308 · forbidden_patron 292 · hunger_for_status 89 · fanaticism 0.
- **Criminal houses by card:** Gambling den 271 · Front businesses 264 · Smuggling waypoint 248 · Multiple criminal factions 177 · Black market 169 · Red light district 168 · Whisper market 152 · Brothel 151 · Underground network 118 · Fighting pits 102 · Thieves' guild chapter 101 · Underground city 89 · Assassins' guild 80 · Contract killer 67 · Rookery 50 · Listening post 41 · Fence 39 · the rest under 10.
- **Criminal powers:** Thieves' Guild 175 · Corrupt Council 23 · The Black Circle 18 · Corrupt City Council 11 · Shadow Senate 11 · The Shadow Compact 11 · The Hidden Hand 9 · The Underground 7.
- **Capture state:** none 751 · adversarial 94 · equilibrium 81 · corrupted 70 · capture 4.

All of these agree with design §0.2 and §0.5.

## 2a. The coverage curve and the cut (the chair's ruling)

The cut is the first prefix in card-count order whose cards reach 90% of the 22,892 fallback cards: **the charter master, title 83, at 20,605 cards (90.01%)**. That is under the chair's 110-title stop line, so the cut was applied without a stop.

| titles | the title at that rank | its cards | cumulative cards | cumulative % |
|---|---|---|---|---|
| 1 | the miller | 666 | 666 | 2.91% |
| 5 | the master smith | 386 | 2400 | 10.48% |
| 10 | the potter | 359 | 4241 | 18.53% |
| 20 | the master baker | 330 | 7617 | 33.27% |
| 30 | the customs collector | 285 | 10629 | 46.43% |
| 40 | the toll-keeper | 250 | 13243 | 57.85% |
| 50 | the mint master | 208 | 15493 | 67.68% |
| 60 | the workhouse master | 176 | 17412 | 76.06% |
| 70 | the salt master | 150 | 19014 | 83.06% |
| 76 | the arena master | 130 | 19861 | 86.76% |
| 80 | the pit boss | 102 | 20306 | 88.70% |
| 81 | the caravanserai keeper | 101 | 20407 | 89.14% |
| 82 | the guildmaster of thieves | 101 | 20508 | 89.59% |
| **83** | **the charter master (the cut)** | 97 | 20605 | **90.01%** |
| 84 | the guild's master | 80 | 20685 | 90.36% |
| 90 | the smith | 64 | 21109 | 92.21% |
| 100 | the rookery boss | 50 | 21667 | 94.65% |
| 110 | the eldest householder | 40 | 22102 | 96.55% |
| 120 | the dream-keeper | 35 | 22468 | 98.15% |
| 130 | the hospitaller | 20 | 22734 | 99.31% |
| 140 | the trafficker | 8 | 22846 | 99.80% |
| 147 | the scribe | 4 | 22892 | 100.00% |

**The tail: 64 titles, 2,287 cards. Each takes the category pool, as today.** the guild's master 80 · the exchange's steward 79 · the printer 78 · the slave-market master 69 · the scroll scribe 67 · the killer 67 · the smith 64 · the eldest 63 · the circle-keeper 59 · the enchanter 59 · the golem-master 58 · the household elder 57 · the carriers' master 55 · the hiring master 54 · the master shipwright 52 · the carpenter 51 · the rookery boss 50 · the head shepherd 48 · the stable keeper 46 · the foundling-mother 45 · the barge master 44 · the dairy farmer 43 · the assayer 43 · the master of the hunt 43 · the camp foreman 42 · the watcher 41 · the eldest householder 40 · the almoner 39 · the fence 39 · the smuggler 38 · the post's master 38 · the troupe leader 37 · the jeweller 35 · the message-master 35 · the chancellor 35 · the necromancer-overseer 35 · the dream-keeper 35 · the headman 34 · the skydock master 32 · the gaoler 29 · the horse-coper 29 · the thatcher 27 · the planar factor 26 · the envoy 25 · the maltster 23 · the steward 21 · the hospitaller 20 · the peat-reeve 16 · the watch sergeant 14 · the warden 13 · the slaver 13 · the reeve 13 · the fishmonger 10 · the archdruid 9 · the beekeeper 8 · the musician 8 · the trafficker 8 · the dragon 8 · the bandit contact 7 · the waystation keeper 7 · the outlaw host 7 · the ringleader 7 · the wildfowler 6 · the scribe 4.

## 3. The judgment calls, each with the default taken (all vetoable)

1. **The title list is 147, not 76** (§2). My first default was to write all 147, in card-count order (`05dd0064c`). **The chair ruled (2026-11-08):** the cut falls on COVERAGE. Titles are written by title in card-count order until they cover 90% of the 22,892 cards; every title below the cut takes the category pool, and car 4 wires that fallback. The cut is the charter master, the 83rd title, at 90.01% (§2a). The 64 tail titles' lines left the data file. They stay in git at `05dd0064c` if the cut ever moves.
2. **Only fallback titles.** J-16 names PEOPLE-1's list, which is the fallback list. The 48 titles with a role goal pool (the dean 499, the senior craft-guild master 499, …) also draw their secrets and presentations by category today. Default: they are **not** written. Widening the set is the chair's call, and the same file shape takes them.
3. **The presentation by title and the mode keying (the wiring question for car 4).** Default: the title lines are the BASE layer, `TITLE_PRESENTATIONS[title]`, and stand where `npcGenerator.js :: pickTitle(category)` stands. `NPC_PRESENTATION_MODES` stays the secret-driven override, chosen by `getStressHistory` from the secret's text and still keyed by mode on the outside. The two layers coexist without a shape change. **Question for car 4:** should a title's own presentation also resist the mode override? The default leaves today's 40% override in place.
4. **`behaviour` is written per line.** `pickTitle` derives `behaviour` from the disposition through `NPC_PLOT_HOOKS_DATA`; the mode rows carry their own. Default: a title line carries its own behaviour, the full `{ impression, disposition, behaviour }` record. The disposition is always one of the four keys, so car 4 can derive behaviour instead and drop the field.
5. **The secret rows are `{ secret, stakes }`** (`NPC_CRIMINAL_SECRETS_BY_HOLDER`'s row; the card stores `{ what, stakes }`). They are sentence-cased fragments with no closing stop, as the estate's rows are. No `type` bucket and no holder class: the title is the key. The world law's `allowsSecret` filter still applies at the draw. The test proves that no mundane title's line asserts magic, using the law's own reader (`magicAssertionText.js :: textAssertsFunctionalMagic`).
6. **The census law in item 3.** Every line presumes only the face's own house and its trade. None names another institution, a power, a tier word or the face's gender. The gender is drawn, so the test refuses a gendered reflexive, and every she/her was read by hand. A line about other people may name them: the widow, the boy's brother.
7. **The DM sentences' facts (item 2).** The closures read only the typedef'd receipt fields: `PatronFacts`, for one patron × one power, and `CaptureFacts`. They do not read a free slot string.
   - **The patronage line is per patron.** The boosts block of §9, one line per boosted power, joins its patrons' lines.
   - **`guild` is whatever the agent answers to:** the allegiance's power where one stands, else its house.
   - **Every rung's three lines hold on every derivation path of §3.4.** Equilibrium arises from one lesser agent or from the climate alone. Corrupted arises from an agent head, from the second and the third, or from a criminal ruler with or without an agent. Capture arises from the head and the second. The test walks each path.
8. **Rank 1 reads "the head", not "the lord"** (§9's sketch says the lord). The ruling power is often a council or a guild, so default: "the head".
9. **The rung label stays out of the line.** `CAPTURE_RUNG_LABELS` carries it, so the car prints "Corrupted:" beside the line and §9's example is reproduced exactly. Variant 0 is §9's receipt; variant 1 names the people; variant 2 says what the rung means for the town.
10. **Power names print bare** ("Elder Council rules in its own name"), as the estate's `{governing}` slot does. An article, if wanted, is the car's.
11. **Numbers on the DM layer.** Two of the three patronage lines per kind print `+{n}`, to one decimal (`pointWords`), as §9's "lends {power} +{n}" does. The third says it in words. This is DM-only, so the receipt may carry the figure.
12. **Fanaticism (J-6).** No DM sentence depends on it, and item 1's `handler_cause` already covers it.

## 4. Noticed, not mine (the intake rule)

- `structuralPosition`/`activeConstraint` prose on criminal cards carries the typo "demonstiting" ("Advancement within the hierarchy requires either demonstrating value to it or demonstiting threat to it"), seen on seed `soak1k-3`'s gang boss. For the chair's intake: the people/hooks area's next lane.
- The seat mints' fallback "the head of {power}" fires on the 1,000 with "the head of Town Mayor" (8) and "the head of Corrupt City Council" (1). The power names make awkward titles. This is mintTitles' table, owned by the people car.

## 5. Gates (each read through `sh scripts/gate-tail.sh`)

| gate | result | exit |
|---|---|---|
| `npx vitest run tests/data/handlerTieLines.test.js` at the base | 4/4 | 0 |
| `npx vitest run tests/data/dmPowerLines.test.js` | 7/7 | 0 |
| `npx vitest run tests/data/titleSecretsPresentations.test.js`, at 147 titles and again at the 83 of the cut | 5/5 | 0 |
| the three together | 16/16 | 0 |
| `npx eslint src/data/people/ tests/data/{handlerTieLines,dmPowerLines,titleSecretsPresentations}.test.js` | clean | 0 |
| `npx vitest run tests/lint/sourceCitationIntegrity.walker.test.js` at the base | 17/18; the one red is the archival roster's `tree` 112 vs 109 (MERGE-CAR's line, left to its owner); `dated` 153 green | 1 |
| the same walker at the tip | `dated` 154 green; `tree` still 112 vs 109, unchanged | 1 |
| type configs | `src/data` and `tests` are excluded from `tsconfig.json` and `tsconfig.full.json`, so they check nothing on these paths | — |

Every test has a planted control that turns it red: a missing name, a struck tic, an unfilled slot, a missing stop, an extra key, a bad disposition, an asserted magic.

## 6. The lines

Every line is in its data file, which is the veto copy: `src/data/people/handlerTieLines.js` (68), `src/data/people/dmPowerLines.js` (21) and `src/data/people/titleSecretsPresentations.js` (498). The files are the list; nothing is duplicated here, so the veto copy is single.
