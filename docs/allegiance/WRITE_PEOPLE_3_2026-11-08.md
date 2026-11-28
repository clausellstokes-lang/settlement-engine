# WRITE-PEOPLE-3 — the record (2026-11-08)

**Seat:** WRITE-PEOPLE-3, one writer seat, a child of the cloud chair (session `01FbPLbejcfwX5nii12VM673`). **Brief:** `docs/chair/2026-11-08/BRIEF-WRITE-PEOPLE-3-2026-11-08.md` on `lane/chair-2026-11-08`. **Branch:** `lane/write-people-3-2026-11-08`, cut from `lane/write-people-2026-11-08` at `ac6c44316` (WRITE-PEOPLE-2's lane: this seat extends its file). **The owner's word (2026-11-08):** "Yeah do those before deploy", on WAVE-RULINGS item 15.

**Every line written here is DATA, listed in its data file FOR THE OWNER'S VETO.** No wiring. Nothing imports `src/data/people/titleSecretsPresentations.js`.

## 1. What landed

| commit | cause | files | lines |
|---|---|---|---|
| `fa80ecb5` | the tail: the last 64 fallback titles × (3 secrets + 3 presentations); the pin at every fallback title | `src/data/people/titleSecretsPresentations.js`, `tests/data/titleSecretsPresentations.test.js` | 384 (the file: 882) |
| `61428b62e` | the head line's tier noun cured (the chair's ruling; §6) | `src/data/people/titleSecretsPresentations.js` | 1 |
| this commit | this record and the measuring script of §3 | `docs/allegiance/WRITE_PEOPLE_3_2026-11-08.md`, `docs/allegiance/write-people-3/measure-aspects.mjs` | — |

**The 64 titles and their cards on the 1,000** (2,287 cards; WRITE-PEOPLE's record §2a, re-measured here and matched title by title, §3): the guild's master 80 · the exchange's steward 79 · the printer 78 · the slave-market master 69 · the scroll scribe 67 · the killer 67 · the smith 64 · the eldest 63 · the circle-keeper 59 · the enchanter 59 · the golem-master 58 · the household elder 57 · the carriers' master 55 · the hiring master 54 · the master shipwright 52 · the carpenter 51 · the rookery boss 50 · the head shepherd 48 · the stable keeper 46 · the foundling-mother 45 · the barge master 44 · the dairy farmer 43 · the assayer 43 · the master of the hunt 43 · the camp foreman 42 · the watcher 41 · the eldest householder 40 · the almoner 39 · the fence 39 · the smuggler 38 · the post's master 38 · the troupe leader 37 · the jeweller 35 · the message-master 35 · the chancellor 35 · the necromancer-overseer 35 · the dream-keeper 35 · the headman 34 · the skydock master 32 · the gaoler 29 · the horse-coper 29 · the thatcher 27 · the planar factor 26 · the envoy 25 · the maltster 23 · the steward 21 · the hospitaller 20 · the peat-reeve 16 · the watch sergeant 14 · the warden 13 · the slaver 13 · the reeve 13 · the fishmonger 10 · the archdruid 9 · the beekeeper 8 · the musician 8 · the trafficker 8 · the dragon 8 · the bandit contact 7 · the waystation keeper 7 · the outlaw host 7 · the ringleader 7 · the wildfowler 6 · the scribe 4.

## 2. How the tail was written (judgment calls, each vetoable)

1. **The starting draft.** WRITE-PEOPLE wrote all 147 at `05dd0064c`, then cut the tail at the chair's 90% ruling. This seat started from that cut draft and re-read each of its 384 lines against the file's law: the face's own house and trade only, no tier word, no second institution, and no claim that no row holds. The house of each title was read from `src/data/institutionalCatalog.js :: face` (every tier row of the family).
2. **What the re-read changed** (the commit body lists the titles):
   - **Tier words out:** the watch sergeant's "the other side of the village"; the barge master's "the towns along it".
   - **A second institution out:** the scroll scribe's book "stolen from an academy" is now stolen from the wizard who wrote it.
   - **A house the title does not have:** the fence's "shop" (its house is `Fence (word of mouth)`); the carriers' master's "the hall's door" (its house is a hiring hall at village and a guild at town).
   - **A tail title that copied a head title's lines** was rewritten to its own house. Nine titles were rewritten whole or nearly whole: the stable keeper (the stable master's three), the fishmonger (the master fishmonger's), the hospitaller (the hospital's master's), the slaver (the slave-market master's), the gaoler (the prison warden's), the post's master (the exchange's steward's), the archdruid (the grove elder's), the musician (the troupe leader's) and the reeve (the steward's). Single lines were rewritten for fifteen more titles, wherever a pattern recurred across the criminal titles: "selling the X's own people to the authorities", "counts everything sooner or later", and the taken child.
   - **The thinnest presentations were filled out** (for example, the killer's "Uninterested in talk." / "Says nothing and leaves.").
3. **Same shapes, same law, no new field.** `{ secret, stakes }` and `{ impression, disposition, behaviour }`, as WRITE-PEOPLE's record §3 items 3–6 state. Magic is asserted only by the magic titles: the circle-keeper, the enchanter, the golem-master, the scroll scribe, the chancellor, the necromancer-overseer, the dream-keeper, the message-master, the skydock master, the planar factor, the envoy and the dragon. The test's own reader checks the rest.

## 3. The measure of the rest: which fallback titles still reach a CATEGORY pool (brief §2 item 2, measure only)

**Method.** `docs/allegiance/write-people-3/measure-aspects.mjs` births the soak 1,000 through `scripts/audit/soak-review/corpus.mjs` (`ensureLaws()` first). It uses WRITE-PEOPLE's census, which is PEOPLE-1's definition with the seat house found by `representatives.js :: seatHouseOf`. For every fallback card it records how the card's personality, hook and outgoing tie were drawn.

**The census reproduces.** 28,622 house faces; 22,892 fallback cards; 147 titles; **every title's count equals `TITLE_CARDS_ON_THE_1000`** (0 mismatches, 0 extra titles). 228 of the fallback cards are seat-house faces.

**What `POOL_BY_TITLE` holds.** The map has 183 keys. Each row is `[role, category, titleKey]`. The role keys the GOAL pool (`NPC_FACTION_GOALS`); this is car 4's binding, and not this seat's. The category keys the secret, hook, presentation and wants pools. The titleKey keys the cultural title. **No aspect has a pool by title today.** Every title-shaped draw reaches its prose through the row's category.

| aspect | what the draw is keyed by (code read) | fallback titles reaching a category pool | cards |
|---|---|---|---|
| personality | `npcGenerator.js :: generateReligionType`: flat lists (`NPC_PERSONALITY_TRAITS` positive/negative/neutral, `MANNERISMS`, `SPEECH_PATTERNS`), keyed by neither title nor category | **0** | **0** (all 22,892 carry drawn traits) |
| hook (the card's one person hook) | `poolMap.js :: hookPoolFor` → `NPC_FACTION_LOYALTY[category]`. The seat draws `government`; a magic pool where magic does not work draws `other`. No pool by title exists. | **147** | **22,892** (other 13,134 · economy 3,615 · government 2,313 · criminal 2,017 · military 976 · religious 489 · magic 348) |
| tie, kind chosen by the pair's categories | `relationshipArchetypes.js :: computeRelTension`, the category-pair branches (`gov_econ_dependence` 138 · `mil_crim_corruption` 123 · `mil_crim_suppression` 109 · `econ_crim_blur` 58 · `econ_crim_exploitation` 54 · `econ_mil_contract` 39 · `rel_crim_fraud` 19 · `mag_crim_market` 16 · `rel_mil_crusader` 6; `gov_mil_friction` 0) | **65** | **562** (head 476, tail 86) |
| tie, every other kind | the same function's power, personality and weighted branches; the prose is the archetype's own template, keyed by neither title nor category | (147) | 22,246 |
| no outgoing tie | a lone face draws none (`ties.js :: drawTies`) | — | 84 |

**Readings.**
- **Personality** is trait-driven. Nothing reaches a category pool, so there is nothing to write by title unless the design wants title-flavoured traits. That would be new capability.
- **The hook** is the one aspect where every fallback title, on every card, draws its category's list. W7 HOOKS's record (`docs/WIRING_W7_2026-11-07.md` on the integration branch) left "WAVE-RULINGS item 15, the person-hook pool by title" as a WAIT-FOR-CAR row; it wrote none.
- **Tie prose** is never by title. 562 cards (65 titles) have their tie's KIND chosen by the pair's categories; the rest are chosen by power, personality or weight.
- **Noticed, not in item 15's list:** the appearance `clothes` line draws `NPC_WANTS[category]` for every card (all 22,892 fallback cards).

**Nothing was written for these aspects.** The chair rules on this measure.

The top tie-by-pair titles: the front man 33/264 · the house boss 32/271 · the watch commander 29/332 · the whisper broker 24/152 · the gang boss 21/177 · the district madam 21/168 · the castellan 20/257 · the madam 19/151.

## 4. Proof

| gate | parent `ac6c44316` | tip | exit |
|---|---|---|---|
| `tests/lint/proseComposed.walker.test.js -t A0b` (variants · over · under · negations) | 2,344 · 67 · 1,344 · 13 | 2,344 · 67 · 1,344 · 13 | 0 / 0 |
| `tests/data/titleSecretsPresentations.test.js` | 5/5 (83 titles) | red-first against the 83-title file: 2/5 red ("expected 498 to be 882"; the 147 length) → 5/5 at 147 | 1 → 0 |
| the people suites (`tests/generators/people/*` + the three `tests/data` people tests), test by test | 45/45 | 45/45; 40 identical, the title test's 5 re-keyed by cause (the describe and the first title renamed for the cut law), 0 red | 0 / 0 |
| eslint on the two touched files | — | clean | 0 |

**The referee** and **the deltas** are in §5.

## 5. The referee and the generator moves, for the merge's record

**The referee** (`node scripts/audit/soak-review.mjs --count 1000 --workers 4`, read through `gate-tail.sh`) ran twice: at the tip `fa80ecb5`, and in a clean stage of the parent `ac6c44316`. Both runs gave 1,000 settlements, 702 findings and 0 errors, exit 0. **`settlements.jsonl` is byte-identical at parent and tip** (sha256 `c5f634ed879f6ce0…`). Every kind is at the base:

| kind | parent | tip |
|---|---|---|
| `info:battery-would-not-vouch` | 698 | 698 |
| `reader:tension-memory` | 61 | 61 |
| `A-09:behaviour-line-share` | 4 | 4 |
| `reader:hook-pools` | 3 | 3 |
| `cert:*` · `coh:*` (`coh:tier-noun` included) | 0 | 0 |

The cure `61428b62e` (§6) followed the tip run. Its line is dark, and its stage measures 0 on every surface (below), so the referee would read the same at that commit too.

**The deltas.** These were measured in clean stages (`scripts/audit/landing-stage.sh build` + `measure`). Each commit is compared with its own parent's stage; the parent stage is first compared with its committed fixtures. Both causes are UNSIGNED; the merge signs.

| stage | gm /525 | fence /360 | herald /470 | prose /1,050 | witness /8 | pdf view-model /18 |
|---|---|---|---|---|---|---|
| parent `ac6c44316` vs its fixtures | 0 | 0 (360 rows, 360 distinct) | 0 | — | 0 | — |
| `fa80ecb5` (the tail) vs parent | 0 | 0 | 0 | 0 | 0 | 0 |
| `61428b62e` (the cure) vs `fa80ecb5` | 0 | 0 | 0 | 0 | 0 | 0 |

**CONFIRMED** (executed): the census, the aspect table, A0b, the suites, the referee, and the deltas. **PLAUSIBLE** (read from code, not executed): personality draws reach no category pool. This rests on the code of `generateReligionType`; the measure shows that every card carries traits, but it does not instrument the draw.

## 6. Noticed, not mine (the intake rule)

- **A head line carried a tier noun:** the guildmaster of thieves' welcoming presentation said "the town's wealth". The chair ruled that the successor writer cures it, so it is cured in its own cause commit `61428b62e`: "Talks easily about the wealth around them and who is careless with it."
- **The appearance line is keyed by category** (§3): `clothes` is drawn from `NPC_WANTS[category]` for every card. It is not in item 15's list; reported for the chair's intake.
