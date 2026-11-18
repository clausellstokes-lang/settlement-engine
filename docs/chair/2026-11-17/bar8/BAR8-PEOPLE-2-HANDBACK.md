# BAR8 · PEOPLE-2 · hand-back

Seat PEOPLE-2 of BAR8 (2026-11-18). Base 20b44f97c (`lane/landing-k-people-2026-11-18`: the line's 99ca9ad51 with K-PEOPLE's
0c135c83a merged). Branch `lane/bar8-people-2-2026-11-18`. Chair session_01FbPLbcLDSJzZFzb5B7EjxR.

**IN SHORT.** PART A is done and pushed (76ffc8eef, tests only). PART B STOPPED AT ITEM 3, as the brief says to: the
owner's question is **YES**. A saved town's stored handler that names a card no longer on the roster (the party's
removal, `worldPulse/partyImpact.js:378`) is re-dealt by an `IMPOSE_CORRUPTION` event, and the new exchange
(`allegiance.js :: ownHandlersOfTheSwap`) changes what it is re-dealt to (constructed and measured, §2). Items 3's guard
arms, 4, 5 and 6 are NOT BUILT. Nothing under `src/` is changed on this branch.

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

## 2. PART B · ITEM 3 · THE OWNER'S QUESTION IS YES: PART B STOPPED

`assignHandlers` deals only cards whose `allegiance.handler` is unset or names no card on the roster; the swap cure
(`ownHandlersOfTheSwap`) exchanges handlers only among the cards so dealt. Its two other callers:
`settlementMigrations.js :: migrateV2toV3` (line 317) and `mutateEntities.js :: imposeCorruption` (line 835).

THE CONSTRUCTION (scratch probe; nothing committed): 60 towns (r2r-city-0..19, r2r-metropolis-0..19, r2r-town-0..19) BORN
AT 99ca9ad51 (a town saved before the change), JSON round-tripped, then loaded at 99ca9ad51 and at 20b44f97c:

| path | cases | stored VALID handler rewritten | result differs old → new code |
|---|---|---|---|
| load (`migrateSettlementToLatest`) | 60 towns, 38 with allegiances | 0 | 0 (a v3+ record is not re-migrated) |
| A · `IMPOSE_CORRUPTION` on each of the first six clean cards | 360 events | 0 | 0 |
| B · a houses'-pool handler removed from the roster as `partyImpact.js:378` removes it, then `IMPOSE_CORRUPTION` | 208 events | 0 | **9 (r2r-city-0, -3, -13)** |
| M · the same town as a v2 record (legacy `corrupt` fields), migrated | 38 towns | none stored | 1 (r2r-city-10) |

THE YES (B): in r2r-city-0, the party removes npc_veiled_aa666ffff1c62fca; the stored handlers of npc_fish_market and
npc_brothel_red_light_district now name no card. The DM then imposes corruption on any clean card (npc_professional_city_watch,
npc_merchant_guilds_15_40, …): the two stored agents are re-dealt; the old code gives fish_market → npc_veiled_fa784936…,
brothel → npc_veiled_d9d4f5ce…; the new code exchanges them. In r2r-city-13 the new card and a stored stale agent are
exchanged. So a SAVED town's STORED (stale) handlers are rewritten under the new exchange by an event; a stored handler that
names a card on the roster never is (0 of 568). The migration rewrites no stored handler (a v2 record stores none; its
first deal at load differs in 1 of 38). PER THE BRIEF, A SAVED RECORD'S CHANGE IS THE OWNER'S: PART B STOPPED HERE, the guard
arms included (an arm that pins the exchange in these callers would pin the behaviour the owner is asked about).

Also seen (the owner may want it with the question): in these callers `ownHandled` reads only the cards being dealt, so a
house whose own people already handle part of its network from the stored record can still be "swapped" by an event.

## 3. MEASURED FIRST (the base's renders, PAGE-COPY `census3.sh --count-only`; nothing after, PART B not built)

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

- **ITEM 3's guard arms and the question**: stopped for the owner (§2).
- **ITEM 4** (the held friend's `needs: ['prison']` on the description and the tension alike): not built (PART B stopped).
- **ITEM 5 · 11e.wantBuy** (6 in the 720, 2 in the thirty, C8867): not built.
- **ITEM 6 · 14e.hookTrade** (4 in the 720, 5 in the 150, 1 in the thirty, C5296): not built.
- `engineBundleReplay`'s fence count (321 → 322): the committed bundle, the close's.

## 6. THE NET (each alone through `sh scripts/gate-tail.sh`; the base as an archived tree of 20b44f97c, the tip this checkout)

Nothing under `src/` differs between base and tip; the tip adds the two re-keyed test files and this file.

- `typecheck:domain:strict` 0 at base and tip; `typecheck:ratchet` 0 at both. `npx eslint` on the two changed tests: 0.
- `tests/architecture` green at both; `tests/joins` green at both; `tests/build/vendorPdfLazy.test.js -t "WEAVE ST-2"` green
  at both (12 passed).
- ALL of `tests/lint` BY MESSAGE: 69 reds at the tip, every one red at the base with the same message (the one path
  difference is `ledgerCitationIntegrity`'s missing local ref `refs/heads/review-fixes-2026-07-08`, at both). The base's 9
  more (`controlBytes`, `declaredLineShape`, `drawDeclaredKeys`, `observedShapeSentinel` M8/M9, `tuningRegister` ×4,
  `wiringCensusDeclared`) are `git` commands failing in the archived tree (no `.git`); green at the tip. No walker names the
  two re-keyed files.
- N3 (`pipelineContract`, `isolatedTrade`, `pipelinePinnedMode`, `generationForkCensus`, `publicProseEquality`): the same 6
  reds with the same messages at 99ca9ad51, at the base and at the tip (`pipelinePinnedMode` 3, `generationForkCensus` 3:
  stored figures); the other three green.
- THE OLDER TESTS: the sweep of §1 (892 files at the line and the base) and the two re-keyed files alone at the tip, green.
- N5 not run: no scratch merge is owed by a branch that changes no source; the line's tip 99ca9ad51 is an ancestor of the
  base.
