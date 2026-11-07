# PEOPLE-4 TIES — one outgoing relationship per card, directed; the graph holds the rest (2026-11-07)

Seat: PEOPLE-4 TIES, lane 4 of the people car, an Opus 5.5 child of the cloud chair (Fable 5.1, session `01FE9mEvGxnFx6WTBkEC6ie9`), under the owner's full delegation of 2026-11-06. Branch `lane/people-4-ties-2026-11-07`, cut from `origin/lane/people-1-cast-2026-11-07` at `8fa9de5b8` as the prompt named it. Brief: `docs/chair/2026-11-07/BRIEF-PEOPLE-4-TIES-2026-11-07.md`, the common part, `PEOPLE-RULINGS-2026-11-07.md` (R-P7 verbatim is the rule; M-1b, M-3, M-4), PEOPLE-0 §4, PEOPLE-5-PREP §4 (all read on the integration branch with `git show`; nothing merged). Every commit is pushed with the bypass in the plain-commands form.

The owner's rule: "one relationship per NPC (allies rivals enemies leverage etc) per NPC … in a single NPC card they can only have one relationship with another. But an NPC, if called by two or more (including itself) unique NPCs could have multiple relationships."

**Base note for the chair.** Lane 1 pushed `5f455dcb9` (its wide-run cures) after this lane's base. A rebase onto it was refused by this session's permission layer, so the lane stays on `8fa9de5b8` as the prompt named it. Two files carry hunks from both lanes: `src/domain/edit/recordRegister.js` (lane 1 adds `'npcs[].memberships': 'power'` two lines above this lane's `relationships` key) and `tests/lint/heldKeyWriterCensus.walker.test.js` (lane 1 re-keys `disperseNamedRoster` → `assignCastPowers`; this lane adds the `drawTies` row and its A5 block). Both are adjacent, not overlapping edits. `scripts/.writer-reach-baseline.json` is untouched on lane 1's branch after `8fa9de5b8`, so this lane's re-bank cannot conflict.

## 1. What was built, by ruling, with the file manifest as it ended

| step · commit | ruling | what | files |
|---|---|---|---|
| 1 · `141383cd4` | R-P7, M-6 | **The directed tie.** `src/generators/people/ties.js :: drawTies`: in roster order each card draws ONE outgoing tie on its own keyed fork (`people-ties::<card id>`; the family forked once, keyed per card). The target is drawn by weight = the target's X-45 house weight (0.5 at weight 0; 1 for a minted face or a card of no house) × 3 when the two share a power (any membership in common), never itself. The kind comes from `relationshipArchetypes.js :: computeRelTension` as today. A lone face draws none. The tie is drawn at the coherence seam (`narrativeGenerator.js :: generateCoherence`) over the final cast, after the memberships the rule reads, under the `relationships` pin. The population step provides `[]` under its chooser. On the pre-law (v1) path the structural appender adds cards after the seam; those cards, and a card the seam left untied because it was alone there, draw their tie in assembly on `people-ties-late`. `pressureSentence` moved after the ties on its own named child: its relationship branch reads them, so a fresh generation saw `[]` while a pinned rederive saw the ties (pipelinePinnedMode A2 caught it). The NPC section-regen draws over its final merged roster. **Retired:** `npcGenerator.js :: generateRelationships` and its scorer `generateFactionGoal`. **The register key:** `recordRegister.js` `relationships: ['from','to','type']`, still HELD (GENERATION_CONTRACTS.md read first). **Readers re-pointed** to `from`/`to`, no shim, `TODO(PEOPLE-5)` at the reader. | `generators/people/ties.js` (new), `generators/{npcGenerator,narrativeGenerator,generateSettlementPipeline,generationReceiptJudgments}.js`, `generators/steps/{generatePopulation,assembleSettlement}.js`, `generators/power/{conflicts,relationshipArchetypes}.js`, `domain/edit/recordRegister.js`, `domain/{npcProfile,factionRename,regenerationPreservation}.js`, `domain/ai/personaSlicer.js`, `domain/display/galleryVeil.js`, `domain/generation/generationForkRegistry.js`, `data/npcData.js` (a comment), and 13 test files re-keyed (§3) |
| 2 · `902389733` | R-P7, M-4 | **The card line and the prose.** `src/domain/relationships/cardTies.js` (new, pure): `tiesOfCard` and `cardTieLines` return the card's own tie first, then the ties naming it ("called by"), each the same record. The NPC card (`npcComponents.jsx :: NPCInlineCard`, the card `NPCsTab.jsx` renders) carries the relationships line: the own tie's kind and target, then each caller with the kind, linked. The Relationships tab's tie card links its ends by `from`/`to`. The PDF (`pdf/lib/viewModel.js`, read by `NotableNPCs.jsx`) gets the same list (the minimal read; PEOPLE-5 does the broad rewiring). No new prose: `settlementNarrative.js`'s existing rumour templates read the directed tie with `npc1Name` (the `from` end) leading. The suite `tests/generators/people/ties.test.js` and the instrument `docs/chair/2026-11-07/people-4/` came with this step. | `domain/relationships/cardTies.js` (new), `components/new/npcComponents.jsx`, `pdf/lib/viewModel.js`, `generators/power/settlementNarrative.js`, `tests/generators/people/ties.test.js` (new), `docs/chair/2026-11-07/people-4/{measure,aggregate}.mjs` + the aggregates |
| 3 · `f9638cedb`, `a9fc780d4` | M-3 | The registers through their doors (§3). | `scripts/.observed-shape-readers-baseline.json`, `scripts/.writer-reach-baseline.json`, `scripts/lib/writer-dark-register.mjs`, `src/domain/npcProfile.js` |

**The record, and the reader each field serves** (`{ id, from, to, type, … }`; the undirected `npc1Id`/`npc2Id` pair is NOT written; `npc1*` is the `from` end's, `npc2*` the `to` end's):

| field | readers kept |
|---|---|
| `id` (`tie_<from>`: one outgoing per card makes it unique and stable) | the gallery veil's id and floor |
| `from`, `to` | the NPC card line and the PDF row (`cardTies.js`), the tie card's links, `npcProfile` (the primary relationship), `personaSlicer`, the receipt's missing-end findings, `conflicts.js` (crossing ties), `refreshRelationshipProjections`, the gallery veil |
| `type` | `conflicts.js` (rival/enemy), `genRelNarrative`'s stress flavour, the Relationships tab's styles and filters, `aiLayer`, the PDF, search |
| `typeName` | the tie card's label, the card line's kind, the rumours, the PDF |
| `description`, `tension` | the tie card, the rumours, the PDF, search, the primary relationship |
| `strength` | the tie card's subtitle |
| `npc1Name`, `npc2Name` | the tie card, the PDF Relationships section, the rumours, search, the rename ledgers, the Relationships tab's settlement filter, the receipt's drift check, the card line's names |
| `npc1Role`, `npc2Role` | the tie card's subtitle, search, the rename ledgers |
| `archetypeKey`, `proseVariant` | the rename path's re-render (`refreshRelationshipProjections`) |
| `flagDriven` | the Relationships tab's emergent count, the print prose's banner pool, the rumour scoring |

## 2. The measurement, before → after (soak 1,000 and golden 525; `docs/chair/2026-11-07/people-4/`)

"Before" is this lane's base (lane 1's cast under the retired pair writer), measured by the same script (`measure.mjs` reads both shapes); PEOPLE-0 §4 (today's NPCs) is quoted beside it.

**Soak 1,000, per tier** (`aggregate-soak-1000.md`):

| tier | cards (min / median / max) | ties PEOPLE-0 → base → after (median) | out-degree = 1, cards with a peer | lone faces with 0 ties | named by nobody | named by exactly one | named by two or more | max in-degree | PEOPLE-0 §4 simulation (nobody / one / 2+) |
|---|---|---|---|---|---|---|---|---|---|
| thorp | 1 / 2 / 4 | 0 → 1 → 2 | 94/94 | 73/73 | 7% | 86% | 7% | 2 | 30 / 65 / 4 |
| hamlet | 1 / 3 / 10 | 2 → 3 → 3 | 136/136 | 31/31 | 31% | 45% | 24% | 5 | 33 / 46 / 21 |
| village | 3 / 9 / 18 | 8 → 21 → 9 | 167/167 | 0/0 | 38% | 34% | 27% | 6 | 38 / 34 / 27 |
| town | 9 / 25 / 43 | 18 → 61 → 25 | 167/167 | 0/0 | 40% | 33% | 27% | 8 | 40 / 34 / 26 |
| city | 23 / 59 / 84 | 36 → 147 → 59 | 166/166 | 0/0 | 41% | 32% | 27% | 7 | 40 / 34 / 26 |
| metropolis | 52 / 79 / 98 | 65 → 195 → 79 | 166/166 | 0/0 | 41% | 32% | 27% | 8 | 41 / 33 / 26 |

Self-ties 0; ends off the roster 0. A "card" is every NPC but the crisis cast's temporary person (`temporary: true`, appended by `resolveCrisisCast` after assembly and removed when its crisis resolves: lane PEOPLE-2's, never a face). The 73 thorps with no tie are towns of ONE face (plus, on some, that temporary person). The in-degree is REPORTED, not tuned (R-P7). From the village up it lands within one or two points of PEOPLE-0's simulation. The thorp differs because a two-face thorp's two faces always name each other.

**Golden 525** (`aggregate-golden-525.md`): out-degree 1 on 84/84 · 84/84 · 84/84 · 105/105 · 84/84 · 84/84 settlements; ties (median) 0 → 2 (thorp), 0 → 5 (hamlet), 13 → 7, 43 → 20, 135 → 56, 188 → 78. The base's v1 thorps and hamlets had a median of 0 ties because the pair writer drew before the pre-law appender added their cards; the late draw cures that.

**The kinds (soak 1,000), share before → after** — all nine present, each with its count:

| kind | PEOPLE-0 | base (count, share) | after (count, share) |
|---|---|---|---|
| political | 17.3% | 12,453 (17.7%) | 5,093 (17.6%) |
| debtor_creditor ("leverage") | 16.0% | 8,085 (11.5%) | 5,019 (17.4%) |
| rival | 17.2% | 18,524 (26.3%) | 4,601 (15.9%) |
| ally | 16.1% | 10,269 (14.6%) | 4,221 (14.6%) |
| mentor_student | 12.2% | 5,126 (7.3%) | 3,895 (13.5%) |
| respect | 10.6% | 7,491 (10.6%) | 2,964 (10.3%) |
| enemy | 5.1% | 3,657 (5.2%) | 1,647 (5.7%) |
| family | 3.9% | 3,125 (4.4%) | 1,328 (4.6%) |
| patron_client | 1.6% | 1,644 (2.3%) | 148 (0.5%) |
| all | 21,530 | 70,374 | 28,916 |

The base's rival surplus came from the pair writer's scorer, which favoured same-category partners (+0.3). The one-tie rule draws its target by house weight and shared power, not by that scorer, so the shares fall back near PEOPLE-0's. `patron_client` thins (0.5%): it is reached only through stress archetypes on specific category pairs. This is reported, not tuned.

## 3. The registers re-derived, each with its cause and its commit

- **The record register** (`recordRegister.js`, `141383cd4`): `relationships` keyed `['from','to','type']`, HELD carried over. `recordRegisterTotality` A5 (the composite key holds on `conflicts`) went red when the conflicts vanished under the first draft, and is green again once `conflicts.js` reads the directed ends. The walker's other red (A3, `npcs[].memberships` undeclared) is the base's, cured on lane 1's later tip.
- **The held-key census** (`heldKeyWriterCensus.walker.test.js`, `141383cd4`): ROSTER 15 → 16. `drawTies` is a producer on its own named family and the family's SECOND lawful skip: both call sites are gated on the `relationships` pin, pinned from source (the family forked once, the `people-ties-late` child once). Its two remaining reds are the base's (`disperseNamedRoster`, cured at `5f455dcb9`).
- **The fork census** (`generationForkRegistry.js`, the arms' own printed figures, `141383cd4`): `generatePopulation|relationships` keyMoves 53 → 0, class drawn → pure, onRecord/producedOnRecord same → transformed (63/63). The step's key no longer moves under its stream, and the record's ties are the seam's. `fnv1a32External` 15 → 16 (the test pin 17 → 16). Only A1 (the golden control row) stays red. The repeated-seed pin holds.
- **The observed-shape register** (`f9638cedb`): NO RUNG CUT, by measurement. The scan at the tip found NEW 0 · OVER 0 · GONE 3: the directed tie adds no read of an unwritten key, so the door is the governed shrink `--write` from a clean commit (schema 30, lane 1's rung). It froze 2,068 → 2,065 findings and 1,470 → 1,467 identities; the bank (77/51) is unmoved. The three GONE rows are dead arms this lane cut: `npc1N`/`npc2N on relationships` in `npcProfile.js`, and `relationships on npcs` in the PDF view row. The five observed-shape suites are green (175/175).
- **Writer reach** (`a9fc780d4`): the dark register's `archetypeKey`/`proseVariant on relationships` rows follow their writer to `ties.js`, and `anyActive on flags`'s consumer is now the tie draw. The re-bank used the governed growth door with `--charter='§934.105'` (lane 1's door): cohort 1,416 → 1,411, 30 stale folded out, 25 admitted. This lane's share: `npc1Id`/`npc2Id on relationships` leave, `from`/`to on relationships` arrive LIT on the same four surfaces, and `id on relationships` arrives name-lit. Two simulation bank members go stale (`elected_reeve`, `town_council` on `leaderNpcIds`: FPZ's leader pick reads the old pair). The base's share: 28 stale and 25 dark-unregistered ledger identities from lane 1's step-1c id re-spelling, red at the base and at lane 1's tip by the same run. **The re-bank caught a real loss before it landed.** LIT first read 595 → 589: the primary-relationship read in `npcProfile.js` used an array spread, which the resolver cannot follow, so the tie's prose lost its PDF/Foundry/world-book credit. It is rewritten as one filter and finds, and LIT is back to 595.
- **The source-citation roster** (`tests/lint/.source-citation-baseline.json`): `dated` 94 → 95 with `_rosterGrowth2026-11-07-people-4`, for this record (it carries no `path:line` citation of its own).
- **Not moved:** the lighting census, the wiring census and the tuning inventory (this lane changes no table and no surface the lighting census counts; their walkers were in the wide run, §4); `densityBands.js` is byte-identical (M-5).

**Re-keys, each with its cause in the file** (`141383cd4`): `pipelinePinnedMode` (derive-half draws 36 → 0 and the step stream 281 → 0: the pair writer's draws were the step stream's; the inner cast fork is the discriminator now), `rosterFinalUnderHeldRoster` (six coherence children; the control run holds the record's ties), `narrativeQualityCorpus` (`drawTies`; the cycle arm's liveness is kept by one large town), `mergeLadderHeldKeys` (restated conflict citations 7 → 40, the no-foreign-citation law unchanged), `regenPreservesUserCanon`, `regenPreservation`, `generationReceiptJudgments`, `generationCertificationCorpus`, `conflictsSeam`, `npcProfile`, `generalStateProseDesk` (the flagDriven writer moved to `ties.js`).

## 4. The red list

_(filled from the wide run below)_

## 5. FPZ's files, broken by design at birth (M-6)

- `src/domain/worldPulse/settlementPolitics.js` reads `relationships[].npc1Id`/`npc2Id` in its leader-ally scoring and finds no pair on a born record. The field it needs is the directed `from`/`to` (or the v1 pair via PEOPLE-5's migration). Its one measured consequence is two `leaderNpcIds` identities stale in writer reach (§3).
- `relationshipEvolution.js` and `relationshipRules{Core,Adversarial,Helpers}.js`, listed as the brief asks, were MEASURED NOT to read the NPC ties. Every `relationships` read there is `snapshot?.regionalGraph?.edges || snapshot?.relationships`, the world snapshot's regional edges, not a settlement's NPC ties. They are not broken by this lane.
- `src/domain/dossier/plotHooks.js` (lane 3's) keeps a typedef naming `npc1Id`/`npc2Id`; it reads neither.

## 6. What the writing wave must author (M-4)

Nothing was reachable only by new prose: every tie draws from an existing archetype pool, and the direction picks which name leads. For W4 PEOPLE, the tie lines are written for an undirected pair ("X and Y …"); a directed tie would read better with lines that say what `from` holds over `to`, kind by kind. `patron_client` is thin under the one-tie rule (0.5%), and its pool is reached only through stress archetypes.

## 7. CONFIRMED vs PLAUSIBLE

CONFIRMED: every figure in §2, measured by the committed instrument (`people-4/measure.mjs`, the same script on the base and the tip); out-degree exactly 1 on every card with a peer and 0 on every lone face, on the 525 and the soak 1,000, and in the suite on the 525 and the soak's first 300; no self-tie; both ends on the roster; all nine kinds present; the registers' movements in §3 are the doors' own printed figures; the LIT loss and its cure (595 → 589 → 595) were measured by the instrument. PLAUSIBLE: the attribution of `mergeLadderHeldKeys`' 7 → 40 to the directed key and the re-drawn ties (the law's assertion holds; the trial-by-trial trace was not done); the attribution of the two stale `leaderNpcIds` members to `settlementPolitics.js`'s pair read (read-only grep, not traced through the advance loop).

## 8. The tip

_(filled at the end)_
