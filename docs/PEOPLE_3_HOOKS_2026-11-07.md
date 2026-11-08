# PEOPLE-3 HOOKS — one plot hook per representative; the tensions and the history kept; parties of every kind (2026-11-07)

Seat: PEOPLE-3 HOOKS, lane 3 of the people car, under the cloud chair (Fable 5.1), session `01FE9mEvGxnFx6WTBkEC6ie9`, by the owner's delegation of 2026-11-06 ("I also now give all permissions required now and in the future. I also defer all judgement to you."). Branch `lane/people-3-hooks-2026-11-07`, cut from `origin/lane/people-1-cast-2026-11-07` at `8fa9de5b8`; linear, nothing merged. Brief: `docs/chair/2026-11-07/BRIEF-PEOPLE-3-HOOKS-2026-11-07.md` and the common part, read on `origin/lane/integration-2026-11-07` with `git show`; the rulings `PEOPLE-RULINGS-2026-11-07.md` (§0, R-P6, M-1b, M-3, M-4); PEOPLE-0 §3; PEOPLE-5-PREP §1's PEOPLE-3 rows. The owner's rule built: "one plot hook per NPC rather than multiple … It should be both tensions, people, and history and it doesn't mean that hooks are between specific individual people it could be between powers, groups, or historical."

## 1. What was built, by ruling, with the file manifest as it ended

| step · commit | ruling | what | files |
|---|---|---|---|
| 1 · `79205fa19` | the owner's rule; M-4 | THE PERSON HOOK. The NPC hook pool (`npcData.js :: NPC_FACTION_LOYALTY`) is re-homed through the pool map: `poolMap.js :: hookPoolFor(title, shelf, { seat, category })` keys it by the face's TITLE (its `POOL_BY_TITLE` row), else its family's SHELF (a fallback, listed), the seat to `government`, a minted face by its mint row's category. ONE hook per card, drawn after the cast in roster order on its own keyed fork — `people-hooks::<card id>` (`representatives.js :: HOOKS_FORK_LABEL`, `drawCardHooks`; the `other` mints on `people-powers::people-hooks::<card id>`); `generateSingleNPC`'s coin-flip second hook (μ 0.5 per card) RETIRED. A line the roster already holds (the pool ran dry) is replaced draw-free by the next unheld line of the card's own pool, then the other pools in `dryPoolWalk`'s order — the portable ones first (`other`, the small settlement's, economy, government), the specialist ones last (criminal, military, religious); the MAGIC pool is walked by a magic face alone, because the world law forbids its lines where magic does not work (`spareHookLine`, `dryPoolWalk`; step 3d). THE REDRAW (HK-LAW-1, "drop or redraw"): the record's truth check drops a contradicted stored hook; a card left with none takes the next true line of its own pool, draw-free (`people/personHooks.js :: truePersonHooks`, in `assembleSettlement.js` under the held-roster gate). The `relationship` category (unemitted since X-2) deleted from the vocabulary with its dead readers (the registry, the source-page map, the PDF view model's source map, the dead typedef). The hook carries `parties: [{ kind: 'person', id }]` beside `links`; its sub-line reads the card's first power (the shim's answer while it stands, the memberships after PEOPLE-5: the PEOPLE-5-PREP row `plotHooks.js:407`). | `src/generators/people/{poolMap,representatives,castPowers,personHooks}.js`, `src/generators/npcGenerator.js`, `src/generators/steps/assembleSettlement.js`, `src/domain/dossier/plotHooks.js`, `src/pdf/lib/viewModel.js`, `tests/generators/people/personHooks.test.js`, re-keyed `tests/domain/plotHooks.test.js`, `tests/domain/generalStateProseDesk.test.js` (DS-HK-1 7 → 6) |
| 2 · `f0294c781` | the owner's rule; R-P6 | THE THREE CLASSES. `plotHooks.js :: PLOT_HOOK_CLASSES` = person · tension · history; every collected hook carries `class` and `parties`. **tension**: the current tensions (kept; parties their camps — a power where the camp is one on the roster, else a group), the crisis hooks (kept; the cast hook's role holder and that person's power, the lever hook's holder and the power that loses), the traditions (kept; the rite's keepers; the mirror is DARK at birth and left as it is), the conflict line (`hookLines.js`, one per conflict; the TWO POWERS), the economics and safety hooks (R-P6: text unchanged, `parties: [{ kind: 'place' }]`). **history**: `historicalEvents[].plotHooks`, `parties: [{ kind: 'history', eventId }]` (the event's name: the record writes no event id). `category` stays the surfaces' render token (colour, label, source page, the DS-HK-1 framing pools) and `links` stays beside `parties`, until PEOPLE-5 reads them. THE GATE'S PARTY ARM: `hookTruth.js :: hookPartyRosterOf`, `hookPartyViolations`, run first in `speakHooks`: a hook naming a person not on the roster (`party_not_on_the_roster`) or a power that does not exist (`power_that_does_not_exist`) is refused; an UNKNOWN roster refuses nothing (the defence half's `defenseKnown` rule). THE DEDUPE reads the person party: two cards on the same authored line keep one each; every other hook folds as before. THE CONFLICTS (`power/conflicts.js:63–96, 274`, the PEOPLE-5-PREP row): paired over the POWERS, each person's home its best-ranked membership, never the NPC grouping. | `src/domain/dossier/plotHooks.js`, `src/domain/coherence/hookTruth.js`, `src/generators/power/conflicts.js`, `src/generators/steps/assembleSettlement.js`, `src/generators/generateSettlementPipeline.js`, `tests/domain/dossier/plotHookParties.test.js`, re-keyed `tests/joins/conflictsSeam.test.js`, the instrument `docs/chair/2026-11-07/people-3/{measure,aggregate}.mjs` |
| 3a · `90b924fa0` | M-3 | the observed-shape walker's two NEW rows cured at the reader; the wiring census re-derived | `plotHooks.js`, `personHooks.js`, `docs/content/wiring-census.json` |
| 3b · `c87248a44` | M-3 | the pinned-mode census re-keyed (inner streams 1 → 2, step draws 281 → 280, the probe's tie draws 36 → 32) | `tests/generators/pipelinePinnedMode.test.js` |
| 3c · `e5b543b37` | M-3 | the any-cast ratchet cured at the reader; the raw-colour budget banked 1230 → 1229 | `src/domain/coherence/hookTruth.js`, `tests/lint/rawColorLiteral.test.js` |
| 3d · (this record's commit) | the soak; M-3 | the dry-pool walk widened (the soak's X-50 3,318 → 980), the lighting census refrozen, the dated roster +1, this record, the aggregate | `src/generators/people/{representatives,personHooks}.js`, `tests/generators/people/personHooks.test.js`, `tests/lint/.lighting-census-baseline.json`, `tests/lint/.source-citation-baseline.json`, this file, `docs/chair/2026-11-07/people-3/aggregate-soak-1000.md` |

**The gate's new arm, with its planted refusals** (`tests/domain/dossier/plotHookParties.test.js`): a conflict between `Merchant Guilds` and `The Old Grouping` (a name no power row carries) — its hook is refused at the page; the same hook between two real powers is kept (the liveness anchor). A famine lever whose loser is `The Old Grouping` — refused; the real loser's lever hook kept. The arm itself: a stranger id and a missing power each give their code; groups, history and the place are not roster facts; an unknown roster (no people, no powers) refuses nothing. On the soak 1,000 the arm is offered nothing the record does not hold: conflict parties not a power 0, crisis losers not a power 0, crisis role holders not on the roster 0.

**The pool map's additions and fallbacks (M-4).** One column added: the hook pool (`hookPoolFor`, `HOOK_POOLS` = the seven category lists of `NPC_FACTION_LOYALTY`; the eighth list, the small settlement's, stays reached by the draw's tier branch and by the dry-pool walk). Every one of the 184 titles maps by title (`via: 'title'`, no fallback — pinned in `personHooks.test.js`); no card on the 1,000 drew through the shelf or the generic row. What the writing wave (W7 HOOKS) must still author is §6.

## 2. The measurement, before → after, per tier (the soak 1,000; `docs/chair/2026-11-07/people-3/aggregate-soak-1000.md`)

"Before" is the lane's base `8fa9de5b8` (lane 1's cast, two hooks per card), measured by the same instrument; PEOPLE-0 §3's figures (today's estate before lane 1: totals 9 / 12 / 18 / 25 / 37 / 46) are the envelope's source.

| tier | hooks before → after (median; min–max after) | person hooks per card (page) | person (median) | tension | history | envelope · inside | median vs PEOPLE-0's |
|---|---|---|---|---|---|---|---|
| thorp | 10 → 9 (4–17) | 1 on every card | 2 → 2 | 5 → 5 | 2 → 2 | 4–15 · 165/167 | 9 vs 8 |
| hamlet | 13 → 12 (4–23) | 1 | 4 → 3 | 5 → 5 | 2 → 2 | 3–20 · 165/167 | 12 vs 10 |
| village | 24 → 20 (7–32) | 1 | 13 → 9 | 8 → 8 | 2 → 2 | 8–29 · 161/167 | 20 vs 18 |
| town | 43 → 38 (15–60) | 1 | 30 → 25 | 10 → 10 | 3 → 3 | 12–54 · 158/167 | 38 vs 35 (**+3**) |
| city | 62 → 75 (35–103) | 1 | 46 → 59 | 14 → 14 | 3 → 3 | 32–91 · 152/166 | 75 vs 66 (**+9**) |
| metropolis | 69 → 96 (66–117) | 1 | 51 → 79 | 15 → 15 | 3 → 3 | 58–98 · 97/166 | 96 vs 82 (**+14**) |

**THE PROOF.** The page's person hooks per card read EXACTLY one on every settlement of the 1,000 (29,020 cards; 0 settlements with a card at 0 or 2), and so does the record (`card.plotHooks.length === 1`). The 22 temporary crisis persons (`npc_temp_*`, no house, minted by the crisis step after assembly: lane 2's crisis cast) carry no hook, as at the base.

**THE THREE MEDIANS OUTSIDE ±2, with their cause.** The envelope (PEOPLE-0 §3) was built on PEOPLE-0's face column (2 / 2 / 9 / 23 / 51 / 68) and a tension class WITHOUT the economics and safety hooks. Two causes, both measured: (1) lane 1's cast is larger than that column at the top (the revised census's 31 returns to FACE and the mints: cards 25 / 59 / 79 at town / city / metropolis, +2 / +8 / +11); (2) R-P6 folds the economics and safety hooks into the tension class (+1 / +2 / +3 at the medians: tension 10 / 14 / 15 against the envelope's 9 / 12 / 12). Together +3 / +10 / +14 against the measured +3 / +9 / +14. Nothing of this lane's own exceeds its rule: one per card, the tensions and the history kept. The person class FELL where the base's second hook had been (village 13 → 9, town 30 → 25) and ROSE at the city and metropolis because the base's dedupe hid every card whose hooks repeated another card's (step 2's dedupe note in §1): at the base a metropolis showed 51 person hooks for 79 cards.

**By party kind** (corpus totals): before, by links — person 68.7 % · none 18.7 % · history 7.4 % · power 5.1 % (36,815 hooks). After, by parties — person 70.5 % · group 10.4 % · history 6.6 % · power 3.6 % · place 3.2 % · person+power 2.9 % · group+power 2.5 % · none 0.2 % (41,321 hooks). The "none" 103 are crisis lever hooks with no holder and no loser, and tensions that name no camp.

**The class table** (per-settlement medians, before classed by category):

| class | source | parties kind | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|---|---|
| person | the card's one hook | person | 2 → 2 | 4 → 3 | 13 → 9 | 30 → 25 | 46 → 59 | 51 → 79 |
| tension | current tensions · crisis · traditions · conflict line · economics · safety | group / power · person+power · group · power+power · place · place | 5 → 5 | 5 → 5 | 8 → 8 | 10 → 10 | 14 → 14 | 15 → 15 |
| history | historical events | history | 2 → 2 | 2 → 2 | 2 → 2 | 3 → 3 | 3 → 3 | 3 → 3 |

**Roster repeats** (a line two cards hold): 10,366 → 995 on the 1,000 (4,169 with the first walk of three pools; 995 with `dryPoolWalk`), all at the city and metropolis, where the roster holds more faces than the seventy-two walkable lines. The traditions class is 0 everywhere (the mirror is dark at birth).

## 3. The registers re-derived, each with its cause and its commit

- **The observed-shape register** (`node scripts/check-observed-shape-readers.mjs`): two NEW rows at `f0294c781` (`id on historicalEvents`, `text on plotHooks`) CURED at the reader, nothing admitted, no rung cut (no record shape changed: `class` and `parties` live on the collector's output, never on the record) — `90b924fa0`.
- **The wiring census** (`node scripts/wiring-census.mjs`): the stamp only, `producerIndexFiles` 1266 → 1267 (`people/personHooks.js`); 0 pool rows — the NPC hook pool and the conflict lines are not census pools, so the brief's "re-keyed" rows do not exist to re-key — `90b924fa0`.
- **The fork census** (`tests/generators/generationForkCensus.test.js`): its Tier-1 and Tier-2 literal arms green at this tip, no row moved (the new streams are sub-forks of the population step and of the coherence seam's `people-powers`). The fork is DECLARED in code (`HOOKS_FORK_LABEL`) and counted by the pinned-mode census: the step's inner streams 1 → 2 — `c87248a44`.
- **The pinned-mode census** (`tests/generators/pipelinePinnedMode.test.js`): `innerForks` 1 → 2, `UNPINNED_STEP_DRAWS` 281 → 280, `DERIVE_HALF_DRAWS` 36 → 32, each re-measured by the arm's recipe, cause one hook per representative — `c87248a44`.
- **Writer reach** (`node scripts/check-writer-reach.mjs`): RED at the base `8fa9de5b8` and at this tip with the IDENTICAL finding list (28 stale bank members and the dark rows keyed by lane 1's step-1c house ids, `osr…:npc_parish_church`, `npc_fish_market`, …); this lane writes no new field and retires none, so it banks nothing: the base's debt is lane 1's (its step 1c landed after its own re-bank `b1d1fb54`).
- **The lighting census**: refrozen through its door (`LIGHTING_CENSUS_REFREEZE='PEOPLE-3 HOOKS'`): files 2967 → 2969, credited 2595 → 2597, titles 27986 → 27998, suiteTitles 7452 → 7458; the plain run green after.
- **The source-citation roster**: `dated` 94 → 95 for this record, with `_rosterGrowth2026-11-07-people-3`.
- **The tuning inventory**: untouched (no table moved; `densityBands.js` byte-identical, M-5). The dark retention table's `relationship` weight (`hookRetention.js :: DEFAULT_RETENTION_TUNING.categoryWeight`) is a registered tuning row: left, named here (§6).

## 4. The red list

**The goldens (M-3), RED by construction, banked not re-recorded** — each suite run at this tip and at the base `8fa9de5b8`; the failing arms are the SAME at both:

| suite | arms red / total (tip) | the measured count at the tip (base) |
|---|---|---|
| `tests/property/generatorGoldenMaster.test.js` | 1 / 3 | 525 / 525 rows moved (525) |
| `tests/property/espionageDormancyFence.test.js` (the fence 360) | 1 / 21 | the driven corpus moved (moved at the base) |
| `tests/property/dossierProseManifest.test.js` | 2 / 17 | 958 rows whose composed prose moved (940); the drift corpus's tally arm |
| `tests/simulation/presetLightingWitness.test.js` | 0 / 7 | green at both |
| the other 22 dormancy fences (`tests/property/*DormancyFence*.test.js`) | 0 | green at both |
| `tests/generators/pipelinePinnedMode.test.js` | 3 / 15 | the golden arms A1, A2, A5-member (41 / 41 rows; the same at the base) |
| `tests/generators/generationForkCensus.test.js` | 2 / 7 | A1 the golden control row; A6 the external fnv1a32 count 15 vs 17 (the same at the base) |

**`tests/lint` + `tests/scripts`, WHOLE, at the tip vs the base** (JSON reports diffed by title): the base carries **34** reds in 11 suites, inherited from lane 1's tip and not this lane's — `writerReach.walker` 14 (the writer-reach bank, §3), `proseFamilyContract.walker` 5, `tuningRegister.walker` 4, `heldKeyWriterCensus.walker` 2, `institutionTable.walker` 2, `negativeAssertionAnchor.walker` 2, `generationForkRegistry.contract` 1, `mutationCoverageManifest` 1, `proseWiringCensus.walker` 1, `recordRegisterTotality.walker` 1, `scripts/implementationPackets` 1. This lane's run added **5** (`domainAnyCastBaseline` 4, `rawColorLiteral` 1), both cured at `e5b543b37`; the tip's set is the base's 34 exactly.

**Other suites run** (the touched surfaces, tip vs base): `tests/domain/dossier`, `tests/domain/coherence`, `tests/domain/crisis*`, `tests/joins`, `tests/pdf`, `tests/domain/plotHooks`, `tests/domain/generalStateProseDesk`, `tests/generators/people`, `hookTruthAtBirth`, `powerStructure`: 10 reds at the base (`seatHolder` 5, `crisisRenameCascade` 3, `crisisPageTierNoun` 1, `pdf/goldenViewModel` 1 — lane 1's cast and its seat read, lane 2's to cure), the same 10 at the tip; the 8 this lane's party arm first reddened (hand-built fixtures with no power roster) green by the unknown-roster rule. `tests/generators/hookThemeDraws.test.js`: 2 arms red at the base (HK-3's above-K beat repeats 66.0 %, the CS-A1 tell accumulator), the same 2 at the tip with the repeats FALLEN to 54.4 % — inherited from lane 1's cast size, improved here, not cured.

**The soak 1,000** (`node scripts/audit/soak-review.mjs --count 1000 --workers 4`, at this tip and at the base `8fa9de5b8`, both 0 errors, both STOP on the base's `cert:*`): every finding kind beside the base's (no `docs/census/` rung-2F table exists on this base; the base's own run is the comparand). Settlements in brackets.

| kind | base → tip | cause |
|---|---|---|
| `X-50:boilerplate-twice` (plot_hooks) | 0 → 980 (122) | **one hook per representative**: the page now keeps every card's one hook, and a city or metropolis holding more faces than the seventy-two walkable lines repeats a sentence (at the base the dedupe hid the repeats by dropping the person hooks: a metropolis showed 51 for 79 cards). Measured on the way: 3,318 (281) with a three-pool walk; 575 (90) walking the magic pool too, which put 27 settlements on `cert:receipt_check_failed` (`world_law_magic`) and was withdrawn. The cure is the writing wave's (W7 HOOKS, §6). |
| `cert:receipt_check_failed` / `_judgment_failed` | 174 (169) → 172 (169) | one hook per representative (two fewer contradicted hook rows; the same 169 settlements) |
| `cert:receipt_needs_review` | 169 → 169 | — |
| `cert:relationship_endpoint_name_drift` | 6 (1) → 3 (1) | the card bodies moved with the retired second hook (one settlement, as at the base) |
| `reader:hook-pools` | 156 (154) → 138 (136) | one hook per representative (fewer pool lines on the page that name a guard or the sea where there is none) |
| `reader:relation-types` | 987 (482) → 960 (469) | the card bodies moved (the ties are drawn over the cast; lane 4's) |
| `reader:tonight-wants` | 115 → 116 | the card bodies moved |
| every other kind (`coh:seat-holder` 641, `A-05` 587, `reader:validation-on-page` 1,767, …) | unchanged | — |

## 5. FPZ's files, broken by design at birth (M-6)

Nothing under `src/domain/worldPulse/`, `src/domain/events/`, `factionLifecycle.js`, `densityAscension.js` or the store's advance loop was touched. A simulation reader that counts an NPC's `plotHooks` reads one where it read one or two; no reader of the simulation reads the collector's `class` or `parties`. None found broken.

## 6. What the writing wave must author (M-4)

- **W7 HOOKS — one hook per card by title.** The pool map reaches a pool for every title, but the pools are the seven category lists (8–12 lines each) of `NPC_FACTION_LOYALTY`: a city or metropolis holds more faces of one kind than its pool and the generic pools have lines, so 995 roster repeats remain on the 1,000 (all city / metropolis; the soak's X-50 reads them, §4). The writing wave authors hooks keyed by title (the miller's, the innkeeper's, …) in the order lane 1's instrument counts the cards.
- **The DS-HK-1 corpus pool `category relationship: the ties are the opening`** (`src/data/dossierStateProse/general.generated.js`): prose, unclaimed and unreachable since the category's deletion; retire it at the corpus source.
- **The dark retention table's `relationship` weight**: a registered tuning row; the landing's tuning record retires it.
- **The temporary crisis persons** (`npc_temp_*`): no house, no hook; lane 2 (the crisis cast) or PEOPLE-5 decides whether a temporary is a card.

## 7. CONFIRMED vs PLAUSIBLE

CONFIRMED: every figure in §2 (the committed instrument `people-3/measure.mjs` at this tip and at the base, the same 1,000, run twice at the tip with identical output); the planted refusals and their anchors (their suite, green); the registers' movements in §3 (each door's own printed figure); the red list in §4 (each suite run at this tip and at the base, the failing titles diffed). PLAUSIBLE: the attribution of the three medians outside ±2 to the cast's size and R-P6's fold is arithmetic over the per-class medians (+3 / +10 / +14 against the measured +3 / +9 / +14), not a per-settlement decomposition; the claim that no simulation reader is broken is a read-only grep for `plotHooks` under the M-6 paths.

## 8. The tip

This record lands in the lane's last commit, pushed with the bypass to `origin/lane/people-3-hooks-2026-11-07`, on top of `e5b543b37`; the branch head is the tip (its sha is in the seat's final message). Linear from the base `8fa9de5b8`: `79205fa19` · `f0294c781` · `90b924fa0` · `c87248a44` · `e5b543b37` · this commit. Nothing merged; no golden re-recorded; nothing under `docs/shift-records/` touched.
