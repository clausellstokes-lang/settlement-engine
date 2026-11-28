# BAR5-THINGS · hand-back (LAW 4 · the page names no thing the town lacks: the people's lines)

**Base.** `lane/join-2026-11-14` at `600b7683a` (no later tip). **Branch.** `lane/bar5-things-2026-11-16`. I merged both audit branches first: B at `d40d6ab28`, then A at `c0ea05497`. They bring helpers and documents only. **Brief.** `BRIEF-BAR5.md`, seat BAR5-THINGS, with BRIEF-BAR2 and the amendments it names.

**The instruments.** PAGE-COPY `census3.sh … --count-only` rendered three populations, at the base and at my tip, each in its own scratch worktree:
- the sixty read towns (`seeds.bar4.txt` with `seeds.bar5.txt`);
- the census's 720 (`seeds.txt`);
- the fresh 300 (`seeds.fresh300.txt`).

Each population was read by the audit's runner, `run-a.mjs`.

## THE RULES

Each count is towns · instances, by the audit's detector `law4n` (`tests/helpers/pageLaws/law4.mjs`). The detector is unchanged: see "The detector" below.

| rule | the two readings, and where | the one fact made | sixty before → after | 720 before → after | fresh 300 before → after |
|---|---|---|---|---|---|
| 4n-notary | **The line:** the tie tension "… left a copy with a notary." (`src/data/npcData.js`, mutual_leverage), declared `colour` and reading nothing. **The register:** the word `notary` (`registeredWords.js`), whose reader of absence was its own name test (a guild or a government counted) and which had no atom to declare. | **`legal house`** (`src/domain/facts/legalHouse.js`): a courthouse, the court buildings, a scroll scribe or a village scribe on the live roster, by catalogue identity. The register's word `notary` takes it as its atom and reads it as its absence; the clerk's scene line declares it. **The tie line itself is REWORDED** ("… left a sealed copy with a third party.", `colour`). A `needs` on it refused the tie's whole index, whose true description ("… sit on opposite sides of most questions …") was silenced with it in 49 towns of the fresh 300, and the pair closure has no town facts for a twin. Measured, then withdrawn. | 3 · 4 → **0** | 46 · 49 → **0** | 22 · 23 → **0** |
| 4n-weeks | **The secret:** "… besieging camp three weeks ago" (`stressInstitutionEffects.js`, under_siege). **The siege's age the page prints:** "The siege has entered its second week" (`narrativeText.js`). | No fact: the line carries no count. "… in the first days of the siege", declared `needs: crisis: under_siege`. | 2 · 2 → **0** | 1 · 1 → **0** | 7 · 7 → **0** |
| 4n-patron | **The hook:** "They owe their post to a patron …" (`npcData.js` NPC_FACTION_LOYALTY.government), undeclared. **The holder's card:** "Nobody named them to it" (the Household elder's every description). | **`appointed post`** (`src/domain/facts/appointedPost.js`): false where a Household elder, by catalogue identity, is the town's voice. The hook declares `needs: ['appointed post']`. | 1 · 1 → **0** | 0 → **0** | 0 → **0** |
| 4n-clay (the kilns) | **The scene:** "… the dust of fired clay is on everything" (`arrivalProse.js` kilns.dominant), declared `needs: trade at work: kilns`. **That atom:** answered by any kiln house, a charcoal burner's included. Two things for one word. | **The atom split:** `trade at work: clay kilns` (a potter or a brickmaker) and `trade at work: charcoal kilns` (a charcoal burner), in `tradeAtWork.js :: KILN_KINDS`. A kind is unanswered where no house of it stands, so a draw door refuses both its line and its twin there. Each kiln line now reads its own kind. | 1 · 1 → **0** | 2 · 2 → **0** | 0 → **0** |

**What the one change cured, and what was cured line by line:**

- **The notary.** The tie's reword cured the rule. The fact makes the register's word and the clerk's line read one reading. Three more lines that named a notary or an advocate were cured line by line:
  - `npcData.js` "has hired an advocate to sue" is reworded to "has brought a claim against".
  - `stressInstitutionEffects.js` "{npc} is a notary who helped draft it" is reworded to "{npc} was in the room when it was signed". `{npc}` is any card, never a notary by the record.
  - `arrivalProse.js` "A notary's clerk hurries past …" now declares `needs: legal house`.
- **The register's walker** reads every line that names a notary against the one fact. This is its own ARM 2, through the word's reader.
- **The weeks, the patron and the kilns** were each cured by the one change shown in the table.

**The named exclusions.** None in the audit's detector.

**The guard.** `tests/domain/bar5ThingsLaw4.test.js`. The guard's own detector (`law4ThingsFindings`) adds one named exclusion: a town where a person's own role or title is a notary's.

**The detector.** It is the audit's, unchanged. I widened its legal-house test to the halls (a Town hall's "Record filing", a City hall's "Contract witnessing", a City administration's "Public records"), measured it, and **withdrew it**:
- At the base it took the 720's notary count from 46 towns to 15.
- The audit's hand-judged precision draw (seed 517) had judged the notary line STANDS in three towns whose only such house is a Town hall: r2s-indebted-town-1, r2s-monster_pressure-town-3 and r2s-religious_conversion-town-0.

So the fact made reads the audit's houses (court and scribe), not the halls.

**The guard and its positive control.** `tests/domain/bar5ThingsLaw4.test.js`:

- **The detector over the census-shaped 720 births.** The census's own rule, in the shape of `bar4ScenePresumption`, through the totality helper:
  - red at 600b7683a in 20 of the 720 (notary 17, weeks 1, kilns 2);
  - 0 at my tip.
- **The positive control.** A town made to lack each thing, carrying the read's own rows C44306, C2000, C30295 and C15951. All four things fire.
- **The three facts pinned to the catalogue they copy:**
  - every legal house holds a catalogued service of a notary's work;
  - the Household elder's own description denies an appointment;
  - the kiln kinds are parts of the kilns' house words, and a kind no house of which stands is unanswered;
  - the fired-clay scene and its twin are refused where only a charcoal burner stands, and the charcoal line is admitted there.

**LAW 5, my files.** The audit's static inventory (`law5-inventory.mjs`), run at my tip. Before: 9 undeclared lines (`arrivalProse.js` 5, `npcData.js` 4). After: **0**. Each line left the list by its own declaration:

| line | declaration |
|---|---|
| "The smell of fresh bread meets you on the road in." | `excludes: crisis: hunger, crisis: under_siege`, with a twin "An oven is lit somewhere close, though the smell of bread on the air is thin." |
| "Pilgrims still pass through on the old route …" | `excludes: crisis: under_siege` |
| "Pilgrim badges are nailed above doorways …" | `crisis: any` (years past) |
| "The road in is worn smooth by pilgrim feet." | `crisis: any` (years past) |
| "People here still talk about the years when the caravans stopped coming." | `crisis: any` (a memory) |
| "They agreed to hold a parcel for a traveller …" | `crisis: any` (a traveller once, callers from within) |
| "They buried someone last season … 'the traveller'" | `crisis: any` |
| "… after the last caravan was lost. No caravan has been lost since …" | `excludes: crisis: under_siege` |
| "… end their quarrel before the next feast." | `crisis: any` (a day of the calendar) |

`stressInstitutionEffects.js`, `hookThemes.js` and `tradeAtWork.js` hold no row of the inventory.

## (e) The register's lord, court and quarters words

- **Court.** It gains `civilian courts` (C31780).
- **Quarters.** It gains `several quarters`, but never "from several quarters", which is a direction (C37631). The page pass (4r) now finds C37631 on the sixty.
- **Lines these two words add to ARM 1.** Each is in a file that is not mine, NAMED here:
  - `src/generators/power/governanceNarrative.js:479` "The military commanders are pushing for expanded authority over civilian courts …". This file is no seat's. The line is code-gated on `hasCourt`, a name test that takes a town hall for a court. It needs `court` declared, or a gate on the court's own houses.
  - `src/data/institutionDescVariants.js:728` "Several quarters, each with its house of worship." This file is BAR5-MARKS's. The line needs `population: ≥ middling` declared.
- **Lord: NOT MADE. This is a question to the chair.** Registering "the lord / liege / overlord" adds 98 undeclared ARM 1 lines in about 45 files, nearly all other seats' or no seat's (world-pulse receipts, `institutionServices.js`, `institutionDescVariants.js`, rumours).

## THE VETO LIST (every new or changed line, with three towns it is read in)

| line | towns it is read in |
|---|---|
| "Passed information about the settlement's water supply to someone in the besieging camp in the first days of the siege" (secret) | bar0-hamlet-under_siege-rand-105, bar0-city-under_siege+famine-rand-24, and 33 more besieged towns of the fresh 300 |
| "X has written down what Y owes and left a sealed copy with a third party." (tie tension) | every town that printed the notary line: 46 + 332 named in the 720 (after the final render) |
| "X has brought a claim against Y for what Y's people did last month. The case comes before the council this season." (tie) | bar0-metropolis-calm-rand-26 (one only in the sixty and the 300) |
| "An oven is lit somewhere close, though the smell of bread on the air is thin." (twin) | bar0-village-famine-rand-118 (one only in the sixty and the 300) |
| "{npc} was in the room when it was signed. They've been avoiding eye contact for six months" (stakes, indebted) | none in the sixty or the 300 |
| "The military commanders are pushing for expanded authority over the town's disputes, …" (twin, `powerSiblings.js`) | none: the site's own gate reads the same court |

The final render's towns for the last five rows are owed: it was in flight at hand-back.

New vocabulary (amendment 5b; vetoable by the owner):
- `legal house`, beside `court`;
- `appointed post`, beside `ruling body`;
- `trade at work: clay kilns` and `trade at work: charcoal kilns`, beside `kilns`.

## THE Each file below is red at my tip. Its red at 600b7683a is noted:

- `tests/lint/presumedThings.walker.test.js`: register rows the cures leave stale, plus ARM 2 rows the word `notary`'s new reader moves. Named. The one owed row (`institutionDescVariants.js:728`, quarters, BAR5-MARKS's file) is entered through the door (`--bank word --base 600b7683a --thing quarters`).
- The golden-derived files, red at base too: `generationForkCensus` and `pipelinePinnedMode`.
- `tieProseDeclared`, `mutationCoverageManifest`, `colourMarks4h` and `tailHouses1Gaps`: red at base too (same file; message compare owed).
- Red at tip, with the base run unread at hand-back: `observedShapeReaders.walker`, `poolDominance.walker`, `proseCorpusBytes`, `proseTasteCorruption.walker`, `proseWiringCensus.walker`, `tuningRegister.walker`, `writerReach.walker`. These are registers and stored rows my cures' text moves; to be classed by the close.

Cured at my tip (red only there, now green):
- `w2FixDataArrival`, `census2fColour`, `textOf`, `stressSecretDeclared`, `bar4ScenePresumption`: own-form re-keys with dated notes.
- `census5bOffCensusDeclarations`, `tieDrawDeclared`, `tieDrawUnprinted`: the calm double now answers `court`, `legal house` and `appointed post`.
- `bar3PeopleTies`: the reword restores the tie's index. MY CURES MOVE (stored figures; named, not re-taken)

Each file below is red at my tip. Its red at 600b7683a is noted:

- `tests/lint/presumedThings.walker.test.js`: register rows the cures leave stale, plus ARM 2 rows the word `notary`'s new reader moves. Named. The one owed row (`institutionDescVariants.js:728`, quarters, BAR5-MARKS's file) is entered through the door (`--bank word --base 600b7683a --thing quarters`).
- The golden-derived files, red at base too: `generationForkCensus` and `pipelinePinnedMode`.
- `tieProseDeclared`, `mutationCoverageManifest`, `colourMarks4h` and `tailHouses1Gaps`: red at base too (same file; message compare owed).
- Red at tip, with the base run unread at hand-back: `observedShapeReaders.walker`, `poolDominance.walker`, `proseCorpusBytes`, `proseTasteCorruption.walker`, `proseWiringCensus.walker`, `tuningRegister.walker`, `writerReach.walker`. These are registers and stored rows my cures' text moves; to be classed by the close.

Cured at my tip (red only there, now green):
- `w2FixDataArrival`, `census2fColour`, `textOf`, `stressSecretDeclared`, `bar4ScenePresumption`: own-form re-keys with dated notes.
- `census5bOffCensusDeclarations`, `tieDrawDeclared`, `tieDrawUnprinted`: the calm double now answers `court`, `legal house` and `appointed post`.
- `bar3PeopleTies`: the reword restores the tie's index.

**The reference.** My cures move **226 of the 525** reference configurations against 600b7683a (each record hashed whole and by top-level field at both trees; `ref525.mjs` below):

| field family | configurations moved |
|---|---|
| `relationships` | 220 (text only: the notary tension's words and the claim line; no index moves) |
| `arrivalScene` | 6 (the clerk's line refused where no legal house stands) |
| `prominentRelationship` | 5 |

By size: metropolis 84, city 82, town 41, thorp 11, hamlet 6, village 2.

**Why they move.** These are declared moves:
- The notary tie's tension is reworded: a text-only move wherever it printed.
- The notary's clerk scene line is refused in the same towns. The arrival scene redraws once from its clean lines, on its own substream.

## REGISTRATIONS OWED

- **Mutation-coverage manifest.** None: my one new test file is under `tests/domain`, not `tests/generators`.
- **Goods roster.** None: no new goods import.
- **Two new modules.** `legalHouse.js` and `appointedPost.js` import only `institutionRoster.js` and `customContentSemanticAuthority.js`, as `tradeAtWork.js` does. `engineCoreLazyEdge` is run in the net below.

## NAMED FOR OTHER SEATS

- **BAR5-WORLD.** The two fired-clay instances of the 720 at base are outside my files: `cultureProfiles.js` (architectural details) and `narrativeData.js` STRESS_DESCS.plague_onset. Each should read `trade at work: clay kilns` where it names fired clay.
- **BAR5-MARKS.** `institutionDescVariants.js:728`, "Several quarters", as in (e) above.
- **No seat.** `governanceNarrative.js:479`, "civilian courts", as in (e) above.
- **No seat.** `src/generators/power/settlementNarrative.js` TIE_GLOSS names a notary: one distinct line in the sixty and the fresh 300, by the audit's writer trace.

## WHAT IS 1. **THE SOVEREIGN WORDS (ruling LD1).** "the lord / liege / overlord", not widened. Lord alone adds 79 undeclared ARM 1 lines in 35 files; the 98 I first sent counted all three words, widened broadly, together. Measured by `arm1.mjs` with the word added to `registeredWords.js`. By file: worldPulse/relationshipRulesCore 9, institutionServices 8, institutionDescVariants 6, relationshipHierarchy 4, sovereigntyReceiptPools 4, stressPowerFaces 3, traditionProse 3, humanizeEngineTokens 3, heraldDeeds 3, and 26 more files with 1 or 2 each. Samples: "The overlord was seen to falter"; "are settling into overlord and vassal"; "'s overlord is "; "One of the lord's choosing governs, and noble authority overrides …"; "The overlord has enough coercive advantage to quash the rebellion for now."
2. **The final render's count**, at the reworded tip: the sixty was done at hand-back; the fresh 300 and the 720 were in flight. The prior tip read 0 for all four rules in all three populations, and the reword removes the notary word entirely.
3. **The net's base side, for the seven files above**; then `npm run build` and `verify:dist`. Not run.
4. **Named for others:** "Notary services" printed as the legal chain's output in towns whose only legal house is a Town hall (BAR5-CHAINS, `computeActiveChains.js`); the faction label "Regulation advocates" read by the word `notary` (BAR5-WORLD, `historyData.js`)., IN ORDER

1. **THE SOVEREIGN WORDS (ruling LD1).** "the lord / liege / overlord", not widened. Lord alone adds 79 undeclared ARM 1 lines in 35 files; the 98 I first sent counted all three words, widened broadly, together. Measured by `arm1.mjs` with the word added to `registeredWords.js`. By file: worldPulse/relationshipRulesCore 9, institutionServices 8, institutionDescVariants 6, relationshipHierarchy 4, sovereigntyReceiptPools 4, stressPowerFaces 3, traditionProse 3, humanizeEngineTokens 3, heraldDeeds 3, and 26 more files with 1 or 2 each. Samples: "The overlord was seen to falter"; "are settling into overlord and vassal"; "'s overlord is "; "One of the lord's choosing governs, and noble authority overrides …"; "The overlord has enough coercive advantage to quash the rebellion for now."
2. **The final render's count**, at the reworded tip: the sixty was done at hand-back; the fresh 300 and the 720 were in flight. The prior tip read 0 for all four rules in all three populations, and the reword removes the notary word entirely.
3. **The net's base side, for the seven files above**; then `npm run build` and `verify:dist`. Not run.
4. **Named for others:** "Notary services" printed as the legal chain's output in towns whose only legal house is a Town hall (BAR5-CHAINS, `computeActiveChains.js`); the faction label "Regulation advocates" read by the word `notary` (BAR5-WORLD, `historyData.js`).

## FOR THE In about one town in fifteen, a line named something the town did not have: a notary, a siege three weeks old in its second week, a post owed to a patron by a head of household nobody appointed, or fired clay where only charcoal burns. Each now reads what the town holds:
- the debt's copy goes to "a third party";
- the betrayal happened "in the first days of the siege";
- the patron's hook is not given where no one is appointed;
- the clay lines need a potter or a brickmaker, and the charcoal lines a charcoal burner.

Three new facts are yours to veto: "a legal house", "an appointed post", and the kilns split into clay and charcoal. The wider question of lords and crowns named where the town has none is left, measured, for the next wave., IN PLAIN WORDS

In about one town in fifteen, a line named something the town did not have: a notary, a siege three weeks old in its second week, a post owed to a patron by a head of household nobody appointed, or fired clay where only charcoal burns. Each now reads what the town holds:
- the debt's copy goes to "a third party";
- the betrayal happened "in the first days of the siege";
- the patron's hook is not given where no one is appointed;
- the clay lines need a potter or a brickmaker, and the charcoal lines a charcoal burner.

Three new facts are yours to veto: "a legal house", "an appointed post", and the kilns split into clay and charcoal. The wider question of lords and crowns named where the town has none is left, measured, for the next wave.

## How the instruments are re-made

- **Render.** `HOLDERS=<PAGE-COPY>/holders.tipA.json sh <PAGE-COPY>/census3.sh <tree> <out> 4 --seeds <seeds> --count-only`. PAGE-COPY is on the chair's lane, at `docs/chair/2026-11-16/probes/PAGE-COPY`. The seeds are:
  - the sixty: `seeds.bar4.txt` with `seeds.bar5.txt`, from READ-ALL packets10 and 12;
  - the 720: `seeds.txt`;
  - the fresh 300: READ-ALL packets11 `seeds.fresh300.txt`.
- **Count.** `node docs/chair/2026-11-16/bar5/AUDIT/run-a.mjs <out> <out.json> [final72 final75]`.
- **ARM 1.** `node arm1.mjs <tree> <out.json>` runs the walker's `scanTree` over a tree. I diffed the base against the tip.
- **LAW 5.** `node docs/chair/2026-11-16/bar5/AUDIT/law5-inventory.mjs <tree> <out.json>`.
- **The reference.** `node ref525.mjs <tree> <out.json>` hashes each of `goldenMasterCorpus()`'s 525 configurations, whole and by top-level field.

The three scripts are in `docs/chair/2026-11-16/bar5/THINGS/`.
