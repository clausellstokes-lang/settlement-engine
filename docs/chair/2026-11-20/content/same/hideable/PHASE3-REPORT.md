# SAME-2 · BRIEF H · THE HIDEABLE WALKER, PHASE 3: THE REPORT

Builder H, 2026-11-20, branch `lane/same-2-hideable-2026-11-20`. The walker is `tests/lint/samenessHideable.walker.test.js`.

## UNIT 4: DAILY LIFE'S OWNER-ONLY SLOT, DM-ONLY BY CONSTRUCTION

**THE GATE, MEASURED.** The gate is not code yet on any branch. `commoner_resentments_dm` is absent from the src and tests of
`lane/daily-1-2026-11-20` (0eadcb032), `lane/daily-1-2026-11-20-b1` (de69de46a) and `lane/daily-2-2026-11-20` (ae5a7ae88).
It exists only as DAILY-2's brief B3, item E1 (`docs/chair/2026-11-20/content/daily/briefs/B3-THE-OTHER-FIVE-AND-DM.md`, at
ae5a7ae88). That brief writes the gate as `src/domain/dailyLife.js :: deriveDailyLife(record, { audience })`, which derives
the slot ONLY when `audience === 'owner'` and fails closed with no default. Its proof is a new test file (not yet named)
that shows the key absent on a read with no audience and on all 900 `toPublicSafe` documents. Ruling 6 (18:26) is the
same: DAILY-1-HANDBACK.md line 36. **The test SAME-2's message names (absent on every `toPublicSafe` document) does
not exist on `lane/daily-1-2026-11-20`; B3 E1 still owes it.**

**THE ARM (built against a fixture; DAILY's code is not needed).**
- `DM_BY_CONSTRUCTION` declares tables that are dm-only by construction. It is empty today. Its rows are added when the
  Daily Life seat names its data files ("DAILY <commit>").
- A table whose name carries the owner-only mark (`_dm`, `Dm`, `_DM`, in the path or the symbol) qualifies only if its
  row names two things, and each must be found in the file it names:
  - `gatedBy`: the gate, as `path :: symbol`;
  - `provedBy`: the test that proves the slot absent on every `toPublicSafe` document, as `path :: title`.
- Such a table's lines are then quiet: they are neither red nor banked. This is not an exemption row.
- **What reds** (`byConstructionFaults`):
  - a dm-named hand table with no row; it also reads as public, so its lines red like any other;
  - a row that names no dm-named hand table;
  - a row whose gate or proof is not found.
- Every other rule reads the table as usual.
- **At the join** this row is expected:
  `src/data/dailyLife/commonerResentmentsDm.js :: <its symbol>` (the file name comes from brief B3 E2), with
  `gatedBy: src/domain/dailyLife.js :: deriveDailyLife` and `provedBy` set to B3 E1's test and its title.
- Fixture plants pass: no row faults; a wrong gate symbol faults; a row on a table that is not dm-named faults.

## THE COMMITS

| Commit | Unit | What it does |
|---|---|---|
| 26241a090 | 0 | GOALS' two key lists go on the hand list; `HAND_CEILING` 42 -> 44 |
| c98a87237 | measure | `PHASE3-MEASURE.txt` |
| 83a878316 | 1 | The hand pools' lines are read. Superseded by 1b. |
| 7b24a1e97 | 1b | Banks the by-key reds only; the free-text reading waits for the chair (19:12) |
| 7a0fefe03 | 2 | `withheldBy` / `provedBy`; DS-HK-1 proved |
| 02bdbd0af | 3 | The known limit, in the chair's words, with a test |
| c56bdd83f | 4 | The dm-by-construction arm |
| (this) | 5 | This report |

Every unit was red first (a plant, then restored) and then green on the three receipts. Bare eslint is clean.

## UNIT 1: THE GAP CLOSED; THE BANK

The walker now reads every hand-listed table on this line, walked down to its lines:
- A **declared row** (`needs` / `marks`) is read by its atoms: rule 1 by atom, and rule 2 lists its houses (136 house readings, the
  `hand` rows of `houseReadings.json`).
- A **function line** is read from its own source (literals and template quasis); no line is called. This follows R3.
  `STRESS_ECONOMIC_EFFECTS` is read through pairProse's `lines`, and 0 lines are unreadable, so no known limit is needed for it.
- A **line under a crime-word key** is in a crime pool.

**BANKED: 154 lines, all by key; 0 by atom; 0 by word** (the free-text reading is pending). `EXISTING_CEILING` goes from 96 to 250
(96 + 154). The figure is 154, not 140, because `STRESS_ECONOMIC_EFFECTS`' lines are now read; the measure could not read them.

| Pool | Lines by key | Withholding line, where found in passing (information only; it grants no exemption) |
|---|---|---|
| INSTITUTION_DESC_VARIANTS::\<tier\>\|Criminal\|* (39 keys) | 78 | Candidate: `src/domain/people/cardVeil.js :: isHideableHouse` (the criminal kind). Not proved for the description line. |
| NPC_FACTION_LOYALTY::criminal | 18 | None found. |
| NPC_WANTS::criminal | 8 | None found. |
| STRESS_ECONOMIC_EFFECTS::mil_crim_corruption (desc, tension) | 16 | Candidate: `src/domain/display/publicSafe.js` drops an NPC's `relationships` (line 229). Not traced to this slot. |
| GOAL_FAMILY_LINES::POWER::corrupted (short, long) | 12 | Candidate: `publicSafe.js` drops an NPC's `goal` (line 229). |
| GOAL_SECRET_REFUSAL_ROWS::criminal.* | 10 | Candidate: `publicSafe.js` drops an NPC's `secret` / `goal` (line 229). |
| ARRIVAL_TENSIONS::criminal_governance | 4 | None found. |
| DESC_VARIANT_SIBLINGS (sentence keys "Organised bands of hired blades", "guild-organised" cartographers…) | 6 | These are false KEY hits: the key IS a sentence. The key list is unchanged. |
| SERVICE_DESC_SIBLINGS ("Organised road transport…") | 2 | A false key hit, as above. |

## UNIT 2: DS-HK-1, PROVED

- **withheldBy:** `src/components/new/generalDeskRead.js :: generalDeskLines`. `plot_hooks.framing` is a GLANCE mount, so
  `framingLines` is empty both privately and publicly. Print reads the same `framingLines`. A public dossier reads
  `GENERAL_STATE_PROSE_SILENT`, and `PUBLIC_SITE_GROUP` ships no hooks group.
- **provedBy:** `tests/ui/generalDeskTabFlow.test.js`, the test "no "Plot hooks" title and no DS-HK-1 framing, privately or
  publicly". That test passes `clockIds: []`. The clock lines go through the same glance mount in code, but the test does not
  plant a clock: a gap worth one assertion on the owner's side.
- DS-HK-1 is the only `EXEMPT` entry.

## UNIT 5: THE NEW POOLS SINCE 17:48

These are read only, with no hand row added.

- **Safety line (PLACE-1):** `lane/place-1-safetydesc-2026-11-20-wip` 4ce037536, `src/data/safetyDescLines.js`. The code is
  232c8d3e4's build, read in a detached scratch worktree that has since been removed. **The 19 more rows are NOT in code:**
  they are docs at 9c916162b / 4ce037536 (village lines; TINY_MODERATE +6, MIXED_CORNERS +5).
  - 77 lines in 9 tables. Red by key: 0. By atom: 0.
  - By word (pending): 4, all in UNSAFE_OPENING ("Crime is a persistent and visible problem.", "Crime here is common…").
  - Rule 2: 39 lines name houses. Houses listed: walls, palisade, gate, guardPresence, garrison, watch, market, militia.
- **Hooks tranche 3 (DEPTH-3):** docs only. `docs/chair/2026-11-20/content/depth/lines/HOOKS-4.md` at e962311bf (60
  lines, ruled 18:39). Its builder brief is ba2d5cf30. No code is on `lane/depth-3-2026-11-20` (bef0a4704).
  - Lines: 60 (other 20, government 12, economy 10, religious 10, magic 8).
  - Red by key: 0 (no crime key). By word: 0.
  - Rule 2: none can be listed yet, because the docs declare no `needs`.
- **The powers' second tranche (PEOPLE-2):** `powerLineVariants.js` exists on no reachable branch. B2's branch
  `lane/people-2-b2-2026-11-20` is not pushed. The lines are docs: `LINES-power-tranche2.md` at e44ab2711 (78 wordings).
  NOT READ.
- **The founding (PEOPLE-2):** not cut; its build brief is `P2-B4-founding-BUILD.md` at 5d34c083a. The lines are in
  `PROPOSAL-founding.md` at a8dd55a0f. NOT READ.

## THE FREE-TEXT TABLE (R2 as the chair ruled at 19:12; NOTHING BANKED)

- **Hit lines:** the hand pools' bare lines whose text has a word beginning with a stem of `CRIME_KEY_WORDS`: 74 lines.
- **K:** a hit in a crime-keyed pool, where the word is moot because that line is already banked by key.
- **No hits:** smuggl, black market, capture, operation role, off-book, off the books.

| Word | Hits (K) | Says a crime | Does not | Proposed form | Hits it keeps |
|---|---|---|---|---|---|
| criminal | 17 (11) | 13: "The criminal syndicate the city has never rooted out", "Warehouses, taverns, and shops that mask criminal work" | 4: "Commercial, criminal, and ecclesiastical benches", "Holds debtors, criminals, and political prisoners alike" | `\bcriminal\b(?!s)(?![^.]*\b(?:courts?\|benches)\b)` | 12 (it wrongly drops K "shelter for criminals") |
| organised / organized | 30 (8) | 6: "A chapter of organised crime", "An organised trade in contraband" | 24: "Guild-organised carpenters, joiners…", "A body of spellcasters organised together." | `\borgani[sz]ed crime\b` (the chair's) | 1 (the other 5 say a crime but are K) |
| underground | 11 (2) | 2: "A standing underground market dealing contraband…", "…a permanent underground bazaar" | 9: "Drains laid underground.", "…kept in a common underground store" | `\bunderground (?:market\|bazaar\|network\|trade\|city)\b` | 2 |
| thief / thieves | 3 (1) | 2: "On the payroll of the thieves' guild…", "…blames the thief" (after a robbery) | 1: "…enough to discourage the casual thief" (a palisade) | `\bthieves'? guild\b\|\bthe thief\b` | 2 |
| gang | 7 (6) | 6: "Rival gangs, forever disputing their turf.", "…open gang war would be worse" | 1: "…dressed by a gang of quarrymen" | `\bgang(?:s\|\s+war)?\b(?! of\b)` | 6 |
| crime | 2 (1) | 1: "A chapter of organised crime." | 1: "Separate courts for trade, for crime, and for the church." | `\b(?:organi[sz]ed crime\|crime (?:wave\|ring\|lord\|family\|boss))\b` | 1 |
| corrupt | 3 (2) | 2: "…corrupted border infrastructure hold it together" (twice) | 1: the personality trait "corrupt" (NPC_PERSONALITY_TRAITS) | `\bcorrupt(?:ed\|ion)\b` | 2 |
| clandestine | 2 (2) | 2: "An entirely clandestine trade in persons…" | 0 | as is | 2 |
| syndicate | 1 (1) | 1 | 0 | as is | 1 |
| underworld | 1 (1) | 1 | 0 | as is | 1 |
| racket | 1 (0) | 1: "…a "security fee" that is, in practice, a protection racket" | 0 | `\b(?:protection racket\|racketeer\w*)\b` (drops the noise sense) | 1 |
| shadow | 2 (0) | 0 | 2: "Never end up in {other}'s shadow.", "passed under a shadow" | `\bshadow (?:market\|economy\|trade\|guild\|broker)s?\b` | 0 |

**FREE-TEXT FALSE HITS, by pool** (lines that "do not" under the present list):

| Pool | False hits |
|---|---|
| INSTITUTION_DESC_VARIANTS | about 35 (organised 21, underground 7, criminal 4, crime 1, gang 1, thief 1) |
| DESC_VARIANT_SIBLINGS | 1 (organised) |
| SERVICE_DESC_SIBLINGS | 1 (organised) |
| NPC_PERSONALITY_TRAITS | 1 ("corrupt") |
| GOAL_SECRET_REFUSAL_ROWS | 1 (underground: rope that fails underground) |
| GOAL_FAMILY_LINES | 1 (shadow) |
| TRAD_OUTCOME_PHRASE | 1 (shadow) |

Under the proposed forms, the free-text reds outside K pools fall to:
- 1: BACKING_ARCHETYPES "criminal" (a backing-archetype id);
- 1: the robbery tension "blames the thief";
- 1: the protection racket.

So 3 lines would be banked by word alone; every other kept hit is a K line, already banked by key.

## PHASE 3b (SAME-2 brief H2; the chair's ruling of 19:29)

Builder H2, branch `lane/same-2-hideable-b-2026-11-20`. Each unit was red first (a plant, then restored), then green on
the three receipts. Bare eslint is clean.

| Commit | Unit | What it does |
|---|---|---|
| 79647877a | 1 | `CRIME_TEXT_FORMS`, the precise forms as ruled, with one hit and one non-hit planted per form |
| 6da138cdb | 2 | A sentence key is read by the forms, not the key list. The 8 false by-key lines leave the bank |
| 0f45c616d | 3 | `POWER::corrupted` stays banked: corruption is a crime fact (a plant pins it) |
| 7d9e5b811 | 4 | `FREE_TEXT_READ` true, the word reds banked, `EXISTING_CEILING` 250 -> 247 |
| b8fe31f01 | 5 | The watch guard |

- **The forms.** One difference from the table above: `criminal` skips a court's whole sentence, before the word as well as
  after it. With the lookahead alone, "Several courts sitting at once, each to its province: commercial, criminal,
  appellate…" was a hit.
- **The flip moved to unit 4.** If unit 1 had flipped `FREE_TEXT_READ`, the bank would have held 255 rows, over the
  ceiling of 250, before unit 2 un-banked the 8. So the flip goes in with the bank it opens.
- **A sentence key** has five or more words and no `|`. Measured, the rule takes every key of five tables:
  DESC_VARIANT_SIBLINGS (55), SERVICE_DESC_SIBLINGS (18), HISTORY_DESC_SIBLINGS (28), FOODWAYS_PRINT_SIBLINGS (4) and
  NPC_HOOK_SIBLINGS (2). It takes no other table's key, and a live test pins that. Eight words would miss 3 + 4 keys of the
  two named tables. The three extra tables are sentence-keyed too, and none of their keys hits a form.
- **The 8 are un-banked.** These are the hired blades (2), the sellsword companies (2), the guild-organised cartographers
  (2) and the organised road transport (2). None of them is a free-text hit, so none is banked by word.
- **The bank:** 96 rows + 151 hand rows = 247 = `EXISTING_CEILING`. The hand rows split 146 by key, 5 by word and 0 by
  atom; 22 crime-pool lines carry their word beside the key. The table above projected 3 by word; there are 5:
  - BACKING_ARCHETYPES "criminal";
  - the protection racket;
  - "blames the thief";
  - the city's Large prison, two lines ("Holds debtors, criminals, …" and "For debtors, for criminals, …"). These come from
    the plural, which is kept as ruled.
- **The watch.** `watchBase` holds the 9 lines on 43ab0f5eb that carry a bare crime word outside the forms. Its block goes
  to stderr, because this runner swallows a passing test's `console.warn` (measured with a probe). **On the tree it lists 1
  line**, which is new since 43ab0f5eb: GOALS-3's "Takes a bribe from merchants to sell from the stores at low prices
  when grain is dear" (GOAL_SECRET_REFUSAL_ROWS, the granary reeve). Read against 1c9673e84, the line the hand bank
  stands on, the list would be empty.
- **No form and no watch:** "black market" has neither. It had no hit (see the table above).

## PHASE 3c (SAME-2 brief H3; the chair's rulings of 19:58)

Builder H2, on the same branch. Each unit was red first (a plant, then restored), then green on the three receipts
(53 tests). Bare eslint is clean.

| Commit | Unit | What it does |
|---|---|---|
| 31ec8b7df | 1 | The granary reeve is banked by its declared key, with its reason; ceiling 247 -> 248 |
| 25e44fcbe | 2 | smuggl reds; the forms are derived from the catalogue; bribe and extort are added to the hand forms; ceiling -> 252 |
| 1a472b66d | 3 | The watch reads outside both form sets (its message corrects unit 2's count: 17 forms, not 15) |

- **The reeve.** `HAND_CRIME_KEYS` declares `GOAL_SECRET_REFUSAL_ROWS::title:the granary reeve[1]` with its reason and two
  cited lines, each checked in its file: `titleSecretsPresentations.js :: TITLE_SECRETS` and
  `publicSafe.js :: PRIVATE_KEY_RE`. Its line reds `crime key, declared`.
- **The catalogue.** `src/data/institutionalCatalog.js :: institutionalCatalog`. A house is `{ category: shelf, name, ...row }`,
  as `assembleInstitutions` seats it. `isHideableHouse` takes 22 names.
- **The derivation** (`derivedCrimeForms`, exported, fed the catalogue or a fixture). A word of a hideable name is
  distinctive when all three hold:
  - its stem is in no public house's name, description or tags;
  - another hideable house's text repeats it;
  - no hand form governs it (gang keeps "dropped before of").

  A word always followed by the same word in the names is read as that pair. A name with no distinctive word is read
  whole. That gives **17 forms**:
  - the words smuggl- and fence-;
  - the pairs "thieves guild" and "black market";
  - 13 whole names.
- **The hand stems** (only for names with no distinctive word): assassin, kidnap, traffick and outlaw. Each is the act the
  house is named for; the catalogue holds it in that one house only, so nothing can corroborate it. Bandit is ordinary,
  because the public houses' text names bandits.
- **Newly banked: 5.**
  - The reeve, by its declared key.
  - "settle a bribe" (NPC_FACTION_LOYALTY other), by the bribe hand form.
  - "moving a fence" (the same table), by the derived fence. A false hit (a garden fence), banked with that reason.
  - The town Slave market's two "trafficked" lines, by the traffick hand stem.
- **The bank:** 96 rows + 156 hand rows = 252 = `EXISTING_CEILING`. The hand rows split 147 by key (1 declared), 6 by word,
  3 by house and 0 by atom.
- **The watch on the tree:** 0 lines.
- **Daily Life's owner-only smuggler lines** wait for DAILY's arm (not now).
