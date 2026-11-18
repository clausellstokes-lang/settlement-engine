# BAR8 · PEOPLE-2 · hand-back

Seat PEOPLE-2 of BAR8 (2026-11-18). Base 20b44f97c (`lane/landing-k-people-2026-11-18`: the line's 99ca9ad51 with K-PEOPLE's
0c135c83a merged). Branch `lane/bar8-people-2-2026-11-18`. Chair session_01FbPLbcLDSJzZFzb5B7EjxR.

**IN SHORT.** PART A is done (76ffc8eef, tests only). PART B stopped at item 3 (the owner's question was YES, §2) and was
resumed on the chair's call of 05:14 UTC under the owner's deferral ("as i said before, i defer all judgement to you now nad
in hte future", 04:39 UTC). Built: item 3's guard arms and the owner's line, and item 4 (66f609d14, a test file only).
LEFT BY NAME, each with what blocks it: item 5 (11e.wantBuy) and item 6 (14e), §5. Nothing under `src/` is changed on this
branch, so no rule of any runner moves.

## 1. PART A · the two stale anchors re-keyed BY IDENTITY (rule R8; ruling BR27 (1)) · commit 76ffc8eef

| test | the anchor that left, and why | the anchor that joins, and the check | red once |
|---|---|---|---|
| `tests/components/tonightSeatSecret.test.jsx` "the twelve seam seeds" | soak1k-28: the sortie "Authorised an illegal sortie…" is now kept by the company captain (Ivor Ryan; a separate `secret` row); the seat-holder (Padraig Fitzgerald, Master of the Guilds) voices their own want | **soak1k-0**: the first seam in corpus order not in the set (seams at the base over soak1k-0..239: 0, 2, 18, 34, 36, 37, 38, 42, 45, 62, 67, 72, …; 36 in all, 34 with a want overridden). Its seat's own line (`voicedLineOf`) is the voiceable want "manage the influx without the old residents concluding…", overridden by the crisis secret "Knows the migration was triggered by something upstream…" | with `says: 'secret'` struck from the seam's overwrite (`tonightSheet.js :: peopleOf :: add`), all twelve red, soak1k-0 first; restored (`git diff src/` empty) |
| `tests/generators/people/coachingInnUnderCrisis.test.js` POWERS-14 "every town of the read" | r2s-famine-city-1: its keeper now keeps a famine crisis secret ("Has documentation proving the famine was made worse…") and presents by a compromised card's generic line ("Efficient and correct in every interaction…"), true under the famine | **r2s-famine-city-10**. Of the reader's eight candidates, all eight deal the transactional line at the base; with the welcoming line's `crisis: famine` exclusion reverted in a scratch tree (the test's own "false before the cure"), town-5, city-5, city-6 and city-9 STILL deal the transactional line (never false: not the claim) and city-10, metropolis-4, -5 and -10 deal the welcoming line (false before). city-10 is the first of those | in that scratch tree the test reds on r2s-famine-city-10 (and on metropolis-3, as before) |

Each assertion's form is kept; each carries a dated note naming the old anchor and why it left.

**THE SWEEP THE SEAT'S NET MISSED.** Every test file that reads `STRESS_INSTITUTION_EFFECTS` / `stressInstitutionEffects`,
a crisis secret, `tonightSheet` / `TonightSheet`, a card's `presentation`, `assignHandlers`, `faceHonorifics` or `dealGoals`
by text or import (83 files), and every test file that imports a module that imports those (`npcGenerator`, `rareSecrets`,
`tonightSheet`'s 14 importers, `allegiance`'s 21, `faceHonorifics`' 5, `goals`' 2, `npcGenerator`'s 6: 890 files): **892 test
files**, each in its own fork, at 99ca9ad51 and at 20b44f97c (archived trees; json reporter; compared by name AND message):
85 reds at the line tip, 87 at the base. 83 are the same by name and message at both. The rest:

- `tonightSeatSecret` and `coachingInnUnderCrisis`: red at the base only: the two above (re-keyed, green at the tip).
- `tests/build/engineBundleReplay.test.js` "the espionage fence's 360-settlement driven corpus": red at BOTH, the message
  moves "321 of 360 fence settlements differ bundle vs in-process" → "322 of 360". It compares the COMMITTED engine bundle
  (`supabase/functions/_shared/engineBundle.js`, a built stored figure) with the in-process birth; K-PEOPLE's births move one
  more fence settlement. Not made untrue by the cure and anchored on no seed: NAMED, LEFT (the bundle is the close's).

No other test was made untrue. K-PEOPLE's own guard `tests/generators/bar8People.test.js` (absent at the line) is green at
the tip.

## 2. PART B · ITEM 3 · THE OWNER'S QUESTION WAS YES; THE CHAIR'S CALL: GO ON

`assignHandlers` deals only cards whose `allegiance.handler` is unset or names no card on the roster; the swap cure
(`ownHandlersOfTheSwap`) exchanges handlers only among the cards so dealt. Its two other callers:
`settlementMigrations.js :: migrateV2toV3` (line 317) and `mutateEntities.js :: imposeCorruption` (line 835).

THE CONSTRUCTION (scratch probe; nothing committed): 60 towns (r2r-city-0..19, r2r-metropolis-0..19, r2r-town-0..19) BORN
AT 99ca9ad51 (a town saved before the change), JSON round-tripped, then loaded at 99ca9ad51 and at 20b44f97c:

| path | cases | stored handler naming a live card rewritten | result differs, old code -> new code |
|---|---|---|---|
| load (`migrateSettlementToLatest`) | 60 towns, 38 with allegiances | 0 | 0 (a v3 record is not re-migrated) |
| A · `IMPOSE_CORRUPTION` on each of the first six clean cards | 360 events | 0 | 0 |
| B · a houses'-pool handler removed from the roster as `partyImpact.js:378` removes it, then `IMPOSE_CORRUPTION` | 208 events | 0 | **9 (r2r-city-0, -3, -13)** |
| M · the same town as a v2 record (legacy `corrupt` fields), migrated | 38 towns | none stored | 1 (r2r-city-10) |

FOR THE OWNER'S LIST, IN PLAIN WORDS (the chair's three things):

1. **WHAT A SAVED TOWN SEES, AND WHEN.** Nothing changes when a saved town is loaded: every handler it stored is kept. A
   change can come only later, in one case: the party has removed a person who was running agents (so those agents' stored
   handler is now nobody), and the DM then makes another person corrupt. That event finds the agents with no handler and
   gives them one; under the new rule each such agent is given a handler from their own criminal house where the old rule
   could cross two houses over. The one other change is a very old save (schema 2, before the hidden allegiance existed):
   the first time it is opened, its corrupt people are given their first handlers by the new rule (1 of 38 towns differs).
   A handler that names a person still in the town is never rewritten, by the load or by the event (0 of 568).
2. **THE THREE TOWNS OF THE CONSTRUCTION** (the party removes the handler named; the DM then imposes corruption on the
   card named; "before" is the old code's deal, "after" the new):
   - r2r-city-0: Ilya Kovalyov (Smuggling network) removed; the event on Anna Loginov (Professional city watch). Zina Nikitin
     (Fish market; agent of Front businesses): stored Ilya Kovalyov -> before Zina Kovalev (Underground network) -> after
     Zoya Gusev (Front businesses). Predojka Marković (Brothel; agent of Underground network): stored Ilya Kovalyov -> before
     Zoya Gusev (Front businesses) -> after Zina Kovalev (Underground network).
   - r2r-city-3: Nikomedissa Akropolites (Smuggling network) removed; the event on Kyriakos Photeinopoulos (Mint). Maroula
     Bryennios (Inns and taverns; agent of Whisper market): stored Nikomedissa Akropolites -> before Evdokia Photeinopoulos
     (Black market) -> after Xenodoche Nikerites (Whisper market). Loukas Melas (Craft guilds; agent of Black market): stored
     Nikomedissa Akropolites -> before Xenodoche Nikerites (Whisper market) -> after Evdokia Photeinopoulos (Black market).
   - r2r-city-13: Anita Deshpande (Contract killer) removed; the event on Supriya Bajaj (Craft guilds), made an agent by it.
     Supriya Bajaj: new -> before Gayatri Das (Black market) -> after Ananya Sarkar (Multiple criminal factions). Ekalavya
     Yadav (Bowyers & fletchers; agent of Black market): stored Anita Deshpande -> before Ananya Sarkar (Multiple criminal
     factions) -> after Gayatri Das (Black market).
3. **THE GUARD** `tests/generators/bar8People2.test.js` (constructed records): "a stored handler that names a live card is
   never rewritten", at the load and at the event, with the event's new allegiance dealt as the positive beside it. RED WHEN
   PLANTED: with `assignHandlers` re-dealing every allegiance (its unhandled filter struck), the event arm reds; restored.

Also seen: in these callers `ownHandled` reads only the cards being dealt, so a house whose own people already handle part
of its network on the stored record can still be "swapped" by an event (the exchange is between the two re-dealt agents).

## 2b. PART B · ITEMS 3 AND 4 BUILT (66f609d14; the guard, a test file only)

| arm | what it holds | red when planted (each restored, `git diff src/` empty) |
|---|---|---|
| (14b) the migration | a v2 record whose two houses' agents the round would cross: after `migrateSettlementToLatest`, each network handled by its own face | `ownHandlersOfTheSwap` struck: red |
| (14b) the event | `IMPOSE_CORRUPTION` re-dealing a stale handler beside the new agent: each network handled by its own face | the same: red |
| (14b) the owner's line | §2.3 | `assignHandlers`' unhandled filter struck: red |
| (13b) the held friend, each line alone | every handler-tie line that holds someone inside ("held by the", "inside", "the prisoner") declares `prison`; exactly three such lines, found; THE POSITIVE BESIDE IT: no other line declares it | the description's `needs` reverted alone: red; the tension's alone: red |

The arms guard cures the base already holds, so they are green at the base and the tip (rule R8's "red at the base" does
not apply to an arm that guards an existing cure; each is shown red by its plant instead). No seed loop; no `test.each`; the
negatives stand beside positives in the same `it`.

## 3. MEASURED FIRST AND LAST (the base's renders, PAGE-COPY `census3.sh --count-only`; the tip changes nothing under `src/`, so its counts are the base's)

| rule | the thirty | the 150 | the 720 | control |
|---|---|---|---|---|
| 11e.wantBuy (runJ) | 2 · 2 | 0 | 6 · 6 | C8867 FOUND (runJ exit 0) |
| 14e.hookTrade (runK) | 1 · 1 | 5 · 5 | 4 · 4 | C5296 FOUND (runK exit 3 at the base, as K-PEOPLE left it) |

These equal the auditors' counts. No rule of any runner moves on this branch (nothing under `src/`).

## 4. DECLARED MOVES (R5)

THIS BRANCH MOVES NO FIELD (tests and this file only).

**FOR THE SEAT K-PEOPLE** (its births at 99ca9ad51 against its births at 20b44f97c, field-diffed): the 720 reproduce its
hand-back exactly (152 towns; `npcs[].secret` 565 cards in 117 towns, `presentation` 174 in 80, `goal` 45 in 41, `allegiance`
22 in 11; top level `npcs` 149, `relationships` 16, `simulationTrace` 11, `generationCoherenceReceipt` 1), and so do the 525
(16 rows: `relationships` 7, `npcs[].goal` 9). THE FAMILIES ITS HAND-BACK MISSED, found in the 180 (the thirty + the 150):

- `npcs[].personality` (its `dominant`, moving with the secret): **4 cards of the 180**, 0 of the 720, 0 of the 525:
  bar0-city-wartime-rand-47 Pitao Ku, the toll-keeper (honest → brave); bar0-city-under_siege+famine-rand-30 Khutulun Qatagin,
  First Magnate (warm-hearted → incorruptible); bar0-city-under_siege+famine-rand-35 Hyunji Yoshida, the master butcher
  (warm-hearted → incorruptible); bar0-city-wartime-rand-37 Rian Kelly, the cooper (incorruptible → warm-hearted).
- **the one goal that follows it**: Hyunji Yoshida's `goal.long` ("See every child they know grow up fed and safe." →
  "Protect the people in their care for as long as they are able."; the short goal unchanged).
- ONE MORE, NOT IN ITS HAND-BACK OR BR27: top-level `prominentRelationship`, 1 town of the 150
  (bar0-city-under_siege+famine-rand-30: the Silent Partnership of Jelme Budaad with Zulzaga Nogai → with Kadan Fergana);
  0 of the 720, 0 of the 525.

## 5. LEFT BY NAME

- **ITEM 5 · 11e.wantBuy** (6 in the 720, 2 in the thirty, 0 in the 150; C8867 FOUND). MEASURED, NOT CURED. The one fact is
  `tradeListDisplay.js :: importsAsPrinted().needed`. Importing it from `goals.js` (tried in place, reverted) reds
  `tests/architecture/engineCoreLazyEdge.test.js`, both arms: a generator's import of the unpinned `tradeListDisplay.js`
  derives it, and `chainStateShown.js` behind it, into engine-core, whose edges then reach seven coherence-lazy modules
  (`factsOf`, `houseInputAtHand`, `foodSurplus`, `crisisKind` ×2, `magic`, `institutions`). `goals.js` itself is in the `engine`
  chunk and may import a PINNED lazy module (it reads `factsOf`), but no pinned module carries the need. The roads the
  brief names: (a) an import-free leaf the eager core may import: the need list is `displayTradeList` over the primary and
  critical imports, less what arrives (`needMetBy`) and what is made here (`madeHere`); a leaf that answers it without
  those imports is a second matcher of the need, which the brief forbids; (b) the need handed in at `dealGoals`' callers
  (`generateSettlementPipeline.js:607`, `narrativeGenerator.js:1065`): not my files; (c) a `vite.config.js` pin: forbidden.
  THE CURE NEEDS ONE OF: the callers given to the seat, or `tradeListDisplay.js` pinned lazy beside `factsOf` (the close's
  vite convention, measured beside the pin).
- **ITEM 6 · 14e.hookTrade** (4 in the 720, 5 in the 150, 1 in the thirty; C5296 FOUND). MEASURED, NOT CURED. The fact is
  the card's own house AND seats. In `representatives.js :: drawCardHooks` the card is at hand (its house), but the seats
  land later (`narrativeGenerator.js :: enrichNpcCoherence`); the trade line comes by the crisis bias of
  `npcGenerator.js :: generatePlotHook` (famine, indebted, migration -> 'economy'). A refusal on the house alone at the draw
  would strike the EXPLAINED C5328 and C5358 (bar0-city-under_siege+famine-rand-47: a castellan and a watch commander whose
  merchant seat makes the hook true), which must still print. The one reading after the seats land is
  `people/personHooks.js :: truePersonHooks`, called from `steps/assembleSettlement.js` (R5 forbids that file; neither is
  mine). THE CURE NEEDS: `personHooks.js` (a per-card reading of a trade hook against the house and seats) or
  `npcGenerator.js :: ownPoolHook` given the economy pool and the card.
- `engineBundleReplay`'s fence count (321 -> 322) and `sovereigntyLightingContract`'s estate file count (3681 at the base,
  3682 at the tip with the new guard, against a stored 3641, red at both): stored figures, the close's.

## 6. THE NET (each alone through `sh scripts/gate-tail.sh`; the base as an archived tree of 20b44f97c, the tip this checkout)

Nothing under `src/` differs between base and tip; the tip adds the two re-keyed test files, the guard
`tests/generators/bar8People2.test.js` and this file.

- `typecheck:domain:strict` 0 at base and tip; `typecheck:ratchet` 0 at both (re-run with the guard: 0). `npx eslint` on the
  two changed tests and the guard: 0. The guard green (6 tests).
- `tests/architecture` green at both; `tests/joins` green at both; `tests/build/vendorPdfLazy.test.js -t "WEAVE ST-2"` green
  at both (12 passed).
- ALL of `tests/lint` BY MESSAGE: 69 reds at the tip, every one red at the base with the same message (the one path
  difference is `ledgerCitationIntegrity`'s missing local ref `refs/heads/review-fixes-2026-07-08`, at both). The base's 9
  more (`controlBytes`, `declaredLineShape`, `drawDeclaredKeys`, `observedShapeSentinel` M8/M9, `tuningRegister` ×4,
  `wiringCensusDeclared`) are `git` commands failing in the archived tree (no `.git`); green at the tip. No walker names the
  two re-keyed files. With the guard added (re-run at the tip): the same 69 reds, one message moved by one in a count:
  `sovereigntyLightingContract` "the estate's file count moved: expected 3682 to be 3641" (3681 before the guard; red at the
  base): named, the close's. `mutationCoverageManifest` and the other registers name no file of this branch red.
- N3 (`pipelineContract`, `isolatedTrade`, `pipelinePinnedMode`, `generationForkCensus`, `publicProseEquality`): the same 6
  reds with the same messages at 99ca9ad51, at the base and at the tip (`pipelinePinnedMode` 3, `generationForkCensus` 3:
  stored figures); the other three green.
- THE OLDER TESTS: the sweep of §1 (892 files at the line and the base) and the two re-keyed files alone at the tip, green.
- N5 not run: no scratch merge is owed by a branch that changes no source; the line's tip 99ca9ad51 is an ancestor of the
  base.
