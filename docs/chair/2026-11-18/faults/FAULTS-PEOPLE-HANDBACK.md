# FAULTS-PEOPLE hand-back

Seat FAULTS-PEOPLE of the round FAULTS (BRIEF-FAULTS, 2026-11-18). Base `lane/faults-base-2026-11-18` at 4288049ba; branch
`lane/faults-people-2026-11-18`. Commits: 10413cd0c (14e), d6d2cdc1c (FR5), f18ebaab1 (the guard), 272e6d6c9 (14e: the pool
read by membership, so the presumed-things door's strip arm stays at its base), 8b30cc806 (this hand-back), b0edec006 (the
guard's two negatives anchored). Files touched: `src/generators/people/personHooks.js`,
`src/data/npcData.js` (one new export at the file's end), `src/generators/people/poolMap.js`,
`src/data/people/titleSecretsPresentations.js` (one new export at the file's end), the NEW guard
`tests/generators/faultsPeople.test.js`, this file. No other file. No new field on the saved record; nothing under
`src/domain/facts/`; no file of another seat.

## 1 · The items, each with its proof

### 14e · a trade's hook on a soldier: CURED (10413cd0c, 272e6d6c9)

THE FACT IS THE CARD'S OWN HOUSE AND SEATS, read after the seats land: `people/personHooks.js :: truePersonHooks` (it runs in
`assembleSettlement.js` after `storeTrueHooksOnly`, when `memberships` are final; the file itself is not touched). A card
KEEPS NO TRADE where its house is a standing force's (a roster row of category `Defense` with the military's priority: a
watch, a garrison, a citadel, a militia, a barracks, a veterans' lodge) that hires out for no coin (`free_company_hall`,
`mercenary_quarter`, `hireling_hall` are excluded by catalogue id: a hireling hall hires for coin, a customers hook is true
of it; the Mercenary quarter is filed on the adventurers' priority in any case), and sits on no power of trade (a
`powerStructure.factions[]` row of category `economy` or `crafts`, matched by the seat's power name). For such a card a line
of `NPC_FACTION_LOYALTY.economy` is refused unless it is one of the six named true of any holder
(`npcData.js :: ECONOMY_HOOKS_TRUE_OF_ANY_HOLDER`, the form of its precedents `MILITARY_HOOKS_TRUE_OF_ANY_HOLDER` and
`RELIGIOUS_HOOKS_TRUE_OF_ANY_HOLDER`: debts bought up; a contract's clause; a supplier gone dark; a supplier of doubtful
goods; a supplier left unpaid; a crate come by mistake). The refused card REDRAWS by the file's own walk (its title pool,
then `dryPoolWalk` from its category), draw-free, with the same refusal applied to every candidate, so it is never left
without a hook (R7) and never takes another trade line.

The class is the pool's, not the auditor's word list: the law's `TRADE_HOOK` pattern counts 4 / 5 / 1; the cure moves every
trade line it finds on such a card, 21 cards in 20 towns (below), every one a soldier on no trade seat whose old line names
a shop, customers, a batch, buyers, a rival in business, a bookkeeper on every sale, a mark, hands hired, a partner or a
master craftsman. No true line is struck: the controls on the merchant seat print.

| | the thirty | the 150 | the 720 |
|---|---|---|---|
| `14e.hookTrade` (runK) before → after | 1 → 0 | 5 → 0 | 4 → 0 |
| cards whose hook moved (the record diff) | 1 card, 1 town | 9 cards, 8 towns | 11 cards, 11 towns |
| runK LAWS 12 TO 15 all rules, instances | 9 → 8 | 75 → 70 | 247 → 243 |

CONTROLS (the thirty, `--controls`): C5296 (FOUND at the base) is GONE ("✗ clear": the garrison commander of
bar0-city-under_siege+famine-rand-47 now holds "A recruit they turned away has since joined a different outfit. …");
the control count reads 23 → 22 of 49 "as expected" because C5296's expectation was FOUND. THE EXPLAINED C5328 and C5358
(the castellan and the watch commander there, each on the Merchant oligarchy) STILL PRINT, byte for byte.

The 21 moved cards (old → new): r2r-hamlet-16 militia captain (partner died owing → "One of their best people has asked to
be released, …"); r2r-town-1 watch captain (a bad batch → "They signed for supplies that never arrived, …"); r2r-town-7 watch
captain (the note on their shop → signed for supplies); r2s-famine-village-1 militia captain (goods under their mark → best
people released); r2s-famine-village-3 militia captain (a controlling interest in a competitor → best people released);
r2s-indebted-village-0 militia captain (a young trader undercutting them → best people released); r2s-indebted-town-0 lodge
master @ Veteran's lodge (two best hands hired away → "The lodge's oldest rule would bar its richest new member, …", its
title pool); r2s-indebted-city-3 watch commander (master craftsman → "Three guards have gone missing …"); r2s-mass_migration-town-0
watch captain (goods under their mark → signed for supplies); r2s-mass_migration-city-0 watch commander (a family put out of
business → three guards missing); r2s-mass_migration-city-3 castellan (scales found heavy → "The pay chest came up short
again …"); bar0-city-under_siege+famine-rand-47 / -28 / -29 / -32 (two cards) / -34 / -36 / -40 garrison and watch
commanders (price-fixing, partnership, bookkeeper ×2, shop's note, a bad batch ×2, a season of goods → "A recruit they turned
away …", "Three guards have gone missing …", "They are carrying out orders they believe are wrong. …"); bar0-village-famine-rand-37
and -40 militia captains (two buyers; a young trader → best people released). Every replacement is an existing line of the
card's own military or title pool; no new text.

### FR5 · the fishmonger's talk: CURED (d6d2cdc1c)

THE FACT: `trade at work: fish taken here` (the fish story's own atom, BAR8-SCENES, `tradeAtWork.js :: FISH_TAKEN_HERE`), NOT
the supply story's reading of the fish ground directly. WHY: the settling step (`poolMap.js :: settleTitleLines`, handed
`titleTown.facts = birthFactsOf({ institutions, config, tier })` by `representatives.js`) can answer it: the atom reads the
roster and the grounds (`config.nearbyResources` / `nearbyResourcesDepleted`, settled at `resolveResources`, before the
people), and it is the one the page's scenes already declare. MEASURED (a probe inside `settleTitleLines`, removed): over
every town of the 900 that births a fishmonger (355 towns), the reading at the settling step equals the final record's
`tradeAtWorkOf(record, 'fish taken here')` in all 355, never unanswered, and is false exactly where law 11's story is
`bought-used` or `idle` (40 master fishmonger towns: 36 `bought-used`, 4 `idle`; 1 plain fishmonger town).

THE TWIN takes the false line's own slot: `titleSecretsPresentations.js :: TITLE_LINE_TWINS.presentation`, keyed by the
welcoming row's impression, `{ needs: ['trade at work: fish taken here'], behaviour: <twin> }`. In `settleTitleLines`, after the
existing refusal, a row with a twin whose declaration refuses it keeps its impression and its disposition and prints the
twin's `behaviour`. Not a fourth row, no next row, no draw (the welcoming row's existing `needs: ['navigable']` still sends a
town on no navigable water to the next row, as before).

| | the thirty | the 150 | the 720 |
|---|---|---|---|
| the line in a town with no catch landed (the record) before → after | 3 → 0 | 0 → 0 | 7 → 0 |
| runJ `11b` before → after (towns · instances) | 5·6 → 3·3 | unchanged | 26·36 → 20·30 |
| runJ `11b.fish` before → after | 3·4 → 1·1 | unchanged | 9·14 → 3·8 |
| runJ's own row of the line ("How they deal Talks about the boats, the catch …") | 3t → gone | — | 6t → gone |

(runJ prints the line in 6 towns of the 720; the record holds 7: r2s-slave_revolt-town-0's card is counted under another
row of the person by the law's `personCovered`. The brief's "none in the thirty" is 3 at this base: bar0-town-occupied-rand-45,
bar0-metropolis-calm-rand-45, bar0-village-calm-rand-47.)

THE SIBLING at about line 2093 ("Talks about the boats, the weather and what came in this morning.", the welcoming row of
`the fishmonger`): printed by that title ONLY, in 3 towns of the 900 (r2r-village-13 local; r2s-religious_conversion-village-0,
`bought-never` with the atom true; r2s-indebted-village-2, `bought-used`, the atom false). FR5 names one line: the sibling is
LEFT BY NAME (§5), one town of the 720.

## 2 · The rules, before and after (PAGE-COPY `census3.sh --count-only`, base and tip each rendered whole; runK and runJ)

| runner · population | base: towns · instances | tip: towns · instances | moved rules |
|---|---|---|---|
| runK · thirty | 8 · 9 | 8 · 8 | 14e 1 → 0 |
| runK · 150 | 44 · 75 | 43 · 70 | 14e 5 → 0 |
| runK · 720 | 149 · 247 | 145 · 243 | 14e 4 → 0 |
| runJ · thirty | 10 · 14 | 8 · 11 | 11b 6 → 3 (11b.fish 4 → 1) |
| runJ · 150 | unchanged | unchanged | none |
| runJ · 720 | 104 · 127 | 99 · 121 | 11b 36 → 30 (11b.fish 14 → 8) |

NO RULE OF EITHER RUNNER RISES (every other row of both runners' output is byte-equal, base against tip). The dumps: exactly 30
towns of the 900 differ base against tip (no probe noise, no re-render needed), 176 changed lines, every one carrying a moved
hook or the fishmonger's talk (the card, the Plot Hooks tab, the Tonight sheet, the PDF, the journal).

## 3 · The new and the changed lines (for the owner's veto list)

1. NEW LINE (the twin, FR5): "Talks about the price of fish, where any can be had and who has been in today; a good ear for
   news." (the master fishmonger, welcoming, where no catch is landed). Prints in r2r-town-29, r2r-metropolis-28,
   bar0-town-occupied-rand-45 (and r2r-metropolis-45, r2r-metropolis-58, r2s-recently_betrayed-city-2,
   r2s-monster_pressure-city-3, r2s-slave_revolt-town-0, bar0-metropolis-calm-rand-45, bar0-village-calm-rand-47; 48 of
   the 525 golden configurations). It drops "the boats", "the catch" and "market news" (the last so the presumed-things door
   banks no fresh `market` line).
2. NEW DECLARATION SET (14e, no text): `npcData.js :: ECONOMY_HOOKS_TRUE_OF_ANY_HOLDER`, the six economy lines named true of any
   holder (listed in §1). Every other economy line now presumes a trade for a card of a standing force. No line of the pool
   is changed, moved or renumbered.
3. NEW ATOM: none. NEW VOCABULARY: none (the twin's declaration uses the existing `trade at work: fish taken here`).

The shared page (N4): plot hooks never reach it (`toPublicSafe` strips `plotHooks`); the presentation does, verbatim. In all
10 twin towns `toPublicSafe(record).npcs` prints the twin on the same card as the owner's record. `publicProseEquality` in §6.

## 4 · Declared moves (R5)

- `npcs[].plotHooks[0]` (14e): 11 towns of the 720 (r2r-hamlet-16, r2r-town-1, r2r-town-7, r2s-famine-village-1,
  r2s-famine-village-3, r2s-indebted-village-0, r2s-indebted-town-0, r2s-indebted-city-3, r2s-mass_migration-town-0,
  r2s-mass_migration-city-0, r2s-mass_migration-city-3); 1 of the thirty (bar0-city-under_siege+famine-rand-47); 8 of the 150
  (bar0-city-under_siege+famine-rand-28, -29, -32 (two cards), -34, -36, -40, bar0-village-famine-rand-37, -40).
- `npcs[].presentation.behaviour` (FR5): 7 of the 720 (r2r-town-29, r2r-metropolis-28, r2r-metropolis-45, r2r-metropolis-58,
  r2s-recently_betrayed-city-2, r2s-monster_pressure-city-3, r2s-slave_revolt-town-0); 3 of the thirty
  (bar0-town-occupied-rand-45, bar0-metropolis-calm-rand-45, bar0-village-calm-rand-47); 0 of the 150.
- BYTE-EQUALITY OF EVERY OTHER CARD: every town of the 900 born at the base and the tip, the whole record flattened and
  compared leaf by leaf: 870 towns byte-identical; in the 30 that differ the ONLY leaves that move are the one card's
  `plotHooks.0` (21 leaves, one card per town but two in rand-32) or the one card's `presentation.behaviour` (10). No other
  person's draw, no other field.
- THE 525 (hashed by the golden's own procedure, `JSON.stringify` of `generateSettlementPipeline(cfg, null, { seed, customContent: {} })`,
  sha256; the file is not written): **48 of 525 move against the base**, every one by `npcs[].presentation.behaviour` alone
  (the twin): the coastal ports of town and city (12 cultures each) and the metropolis's riverside and coastal rows
  (24), whose fishing grounds the golden's config marks depleted and whose salted fish is bought in. 14e moves none of the 525.
  (The base itself differs from the committed manifest in 499 of 525 under this harness: the close's figure.)

## 5 · Left by name

1. THE SIBLING LINE "Talks about the boats, the weather and what came in this morning." (`the fishmonger`'s welcoming row,
   `titleSecretsPresentations.js` about line 2093): 1 town of the 720 where no catch is landed (r2s-indebted-village-2). FR5
   gives one twin to one line; a second twin is a new line not given. The same `TITLE_LINE_TWINS` row would cure it.
2. `the fishmonger` in r2s-religious_conversion-village-0: law 11's story `bought-never` where `trade at work: fish taken here`
   is TRUE (a fish house at work, no taker, no ground used up: the atom's own `!used` arm). The atom's reading, not this seat's
   (FAULTS-BIRTH and BAR8-SCENES' files). Its line is the sibling's, which reads true there.
3. A trade's hook on OTHER holders that keep no trade (a governor, a steward, a priest pulled into the economy pool by the
   crisis bias) is not read here: the brief's class is the soldier (do not widen it). The same `keepsNoTrade` reading would
   take them by widening its house test.

## 6 · The net (each gate alone through `sh scripts/gate-tail.sh`; the base and the tip each a scratch worktree of their commit)

Every gate ran alone, to a file, at the base (a scratch worktree of 4288049ba) and at the tip (a scratch worktree of
272e6d6c9; the last commit b0edec006 changes only the guard's two comments, and the guard and the walker were re-run on it).
Failing tests were compared BY NAME AND BY MESSAGE (the first line of each failure).

| gate | base | tip | read |
|---|---|---|---|
| `npm run typecheck:domain:strict` | 0 | 0 | green |
| `npm run typecheck:ratchet` | 0 | 0 | green |
| `npx eslint` (the five changed files) | 0 | 0 | green (warnings only, none in my lines) |
| `npx vitest run tests/architecture` | 0 | 0 | green |
| `npx vitest run tests/joins` | 0 | 0 | green |
| `tests/lint` (JSON) | 45 red | 47 red at 272e6d6c9 (2 of them mine, cured in b0edec006: the walker re-run green) | see below |
| N3 `pipelineContract`, `isolatedTrade`, `publicProseEquality` | 0 | 0 | green |
| N3 `pipelinePinnedMode` | 3 red | the same 3, same messages (38 drift rows) | the golden corpus, the close's |
| N3 `generationForkCensus` | 3 red (A1, A4, A6) | the same 3, same messages | the census, the close's |
| `tests/generators/people` | 0 | 0 | green |
| `bar8People`, `bar8People2`, `tonightSeatSecret` (each alone) | 0 | 0 | green |
| the guard `tests/generators/faultsPeople.test.js` | 7 of 9 red (the two NEGATIVES green) | 9 of 9 green | as R8 asks |
| THE OLDER TESTS (48 files each alone: every test naming `npcData`, `personHooks`, `poolMap`, `titleSecretsPresentations`, `truePersonHooks`, `settleTitleLines` or a moved trade line's text) | 4 files red | the same 4, same messages but one moved figure | below |

THE OLDER TESTS RED AT BOTH: `generatorGoldenMaster` (499 of 525 drift at both: the 48 my twin moves are among the 499
already drifted); `dossierProseManifest` (3 tests, 842 drift rows at both); `generationForkCensus` (as N3);
`espionageDormancyFence` (the driven golden's hash: MOVED BY ME, §7b). Every other of the 48 green at both
(`titleSecretsPresentations`, `loyaltyHooksRead`, `tailTies4Batch1`, `spareHookLineFactsWork`, `leftLines`, `bar8DesksEco`,
`bar3PeopleTies`, `seatHolderOnThePage`, `generationWorkerLazy`, …).

`tests/lint`, BY MESSAGE: 41 reds identical at both (factLayers.walker POOLS and importsAsPrinted; proseEntryContradiction
3510/3501 and 2802/2794; observedShapeReaders' six arms; writerReach; proseWiringCensus; poolDominance; presumedThings and
presumptionClasses' registers; tuningRegister; siteCoherenceRatchet; … the brief's known list). Those that differ:
- `negativeAssertionAnchor.walker` (2 tests): RED AT 272e6d6c9 ONLY, caused by my guard's two bare `not.toMatch`; FIXED in
  b0edec006 (each anchored on its own line); the walker is green there (18 of 18 with the guard).
- `observedShapeReaders.walker` A1/A7: red at both; `{ reads: 2213, identities: 1551 }` at the base, `{ reads: 2214,
  identities: 1552 }` at the tip, against the stored 2200/1542: ONE MORE READ (personHooks.js's reading of the house's
  category, priority and catalogue id and the power's category). A stored figure, §7b.
- `readerShapeResolver`: red at both; 272 at the base, 271 at the tip, against the ceiling 256 (one fewer). §7b.
- `sovereigntyLightingContract.walker`: red at both; the estate's file count 3690 at the base, 3691 at the tip (my new guard
  file), against the stored 3641. §7b.
- `ledgerCitationIntegrity`: red at both, the same message but for the worktree's path (a scratch worktree has no
  `refs/heads/review-fixes-2026-07-08`): the instrument's, not the code's.

R11's `npm run build` and the build tests: not required (no file under `src/domain/facts/` and no import in one changed);
`tests/build/generationWorkerLazy.test.js` and `vendorPdfLazy.test.js` ran among the older tests, green at both.

## 7 · Doors (R9), scratch merges (N5)

- `presumption-classes-door.mjs --check`: base `hits 1788 · banked 1938 · fresh 3 · stale 153 · ceiling 1938`; tip the same,
  the same three fresh rows (all `institutionDescVariants.js`, not mine). No fresh line.
- `presumed-things-door.mjs --check`: base `fresh 38 · stale 72 · first-register stale 7 · banked 4688 · strips fresh 0 stale 0
  banked 107`; tip the same, the same 38 fresh rows. (My first build of 14e read the pool by `.map(textOf)` and raised `strips
  fresh 2`; 272e6d6c9 reads it by membership and the strip arm is back at 0.)
- N5: the line's `lane/join-2026-11-14` is 70e557d5b, an ancestor of my base (clean by construction). The sibling seats, each
  merged `--no-commit` on my tip in a scratch worktree: FAULTS-BIRTH, -NEED, -ROWS, -WATCH, -DESKS each CLEAN; my guard green
  under BIRTH (with BIRTH's own guard, 19 of 19) and under WATCH+NEED (9 of 9). Aborted.

## 7b · Stored figures my work moves (the close's; none re-taken)

| figure | where | base | tip | stored |
|---|---|---|---|---|
| the 525 golden hashes (`tests/fixtures/generator-golden-master.json`) | 48 rows move base → tip (§4) | 499 of 525 drift | 499 of 525 drift (the 48 among them) | not re-taken |
| the driven golden of `espionageDormancyFence` (360 settlements) | its hash | `8938469f33a4046a…` | `d43b74d4fcecc455…` | `8e5881d64d3c2b89…` |
| `observedShapeReaders` A1/A7 | reads · identities | 2213 · 1551 | 2214 · 1552 | 2200 · 1542 |
| `readerShapeResolver` | the pulse count | 272 | 271 | ceiling 256 |
| `sovereigntyLightingContract` | the estate's file count | 3690 | 3691 (the guard file) | 3641 |
| the two doors | fresh lines | classes 3, things 38, strips 0 | the same | not banked by me |

The composed-prose manifest (842 drift rows), the fork census, the pinned-mode corpus (38) and the registers' counts read
the same at the base and the tip.

## 8 · Not raised

Code clean-up: none built.
