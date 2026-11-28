# BAR8 · K-PEOPLE · HAND-BACK (seat K-PEOPLE, 2026-11-17)

Base `lane/bar8-audit-k-2026-11-17` at 1ceae1ede. Branch `lane/bar8-k-people-2026-11-17`.

**THE BRANCH CARRIES NO COMMIT.** My own permission check refused `git add` / `git commit` (the checkout's CLAUDE.md:
"Do not ... stage, commit ... without explicit authority"). The brief says such a refusal stands, so I did not route round
it. The whole cure, this hand-back and the guard sit UNCOMMITTED in the seat's working tree
(`/home/user/settlement-engine`, branch `lane/bar8-k-people-2026-11-17` at 1ceae1ede); the same diff is saved as a patch
in the session's scratchpad (`k-people.patch`). Pushing it needs a session with commit authority.

Measured with the auditor's runner (`docs/chair/2026-11-17/bar8/AUDIT/runK.mjs`) over PAGE-COPY renders of THE THIRTY
(seeds.bar7.txt), THE 150 (seeds.w150.txt) and THE 720 (PAGE-COPY seeds.txt), base and tip, each rendered by
`census3.sh --count-only` (the base's 720 and 150 reproduce the auditor's RUN-K.720 / RUN-K.150 rule rows exactly).

## 1. THE RULES (towns · instances, base → tip)

| rule | the thirty | the 150 | the 720 | |
|---|---|---|---|---|
| 13b.gaol | 1·1 → **0** | 2·3 → **0** | 5·5 → **0** | cured (declaration) |
| 14b.handler (the swap) | 2·4 → **0** | 5·8 → **0** | 11·20 → **0** | cured (declared move) |
| 14b.handler.cross (NOT MINE) | 2·2 → 2·2 | 24·49 → 23·40 | 56·106 → 52·99 | see §3 |
| 14e.hookTrade | 1·1 → 1·1 | 5·5 → 5·5 | 4·4 → 4·4 | **LEFT** (§5) |
| 14f.secret.sortie | 2·2 → **0** | 1·1 → **0** | 1·1 → **0** | cured (declared move) |
| 14f.secret.stores | 0 → 0 | 2·2 → **0** | 2·2 → **0** | cured |
| 14f.secret.surrender | 0 → 0 | 2·2 → **0** | 0 → 0 | cured |
| 14f.secret.supplies (NOT MINE) | 1·1 → 1·1 | 3·3 → 3·3 | 4·4 → 4·4 | kept: the person's own supplies |
| 14g.sexTitle | 1·1 → **0** | 0 → 0 | 3·4 → **0** | cured (Emira) |
| 14h.winMore | 2·2 → **0** | 6·6 → **0** | 29·29 → **0** | cured (AMENDMENT 1 gave goals.js; declared move) |
| 11e.wantBuy (AMENDMENT 1, seat J's rule) | 2 | 0 | 6 (J's count) | **LEFT** (§5): not measured at the tip, no cure |

THE GUARD: `tests/generators/bar8People.test.js` (12 tests): red at the base (7 fail: the ten holder rows, the reader,
the held ties, the swap, Emira, the member declaration, the win-two law), green at the tip. Anchors are the 720's towns where the base printed each instance, each
negative beside a positive (the watch captain's sortie and the granary reeve's stores still dealt; a town with a prison
keeps the held friend, r2r-city-10; a one-way `.cross` still stands, r2r-city-10).

NO RULE OF ANOTHER SEAT ROSE: over the thirty and the 150 every rule of laws 12 to 15 outside mine reads the same at base
and tip (diffed row by row); the 720: the same (every row of laws 12 to 15 outside 13b, 14b, 14f.sortie/.stores and 14g reads the same; ALL 277·478 → 251·410).

## 2. THE CONTROLS (the thirty; `runK.mjs` exits 3 at the tip BY DESIGN)

| id | rule | base | tip |
|---|---|---|---|
| C37891 | 13b (held by the watch, no prison) | FOUND | **clear** (the held-friend index refused; the archetype's other lines carry the tie) |
| C6183 | 14b (the swap, Rival gangs ↔ Black market) | FOUND | **clear** (each network handled by its own) |
| C6865 | 14f (a sortie on a guild archmage) | FOUND | **clear** |
| C36170 | 14g ("Emir" on a woman) | FOUND | **clear** (prints "Emira") |
| C5296 | 14e (price-fixing on a garrison commander) | FOUND | FOUND: LEFT (§5) |
| C14564 | 14h (win two more of a power of three) | FOUND | **clear** |
| C5328, C5358 | EXPLAINED (castellan / watch commander with a merchant seat) | clear | clear, and STILL PRINT |
| C6290 | WEAK | clear | clear |

Every other STANDS control of laws 13 and 14 (other seats') is FOUND at the tip as at the base.

## 3. THE CURES

- **14f · `src/data/stressInstitutionEffects.js`, `src/generators/npcGenerator.js :: generateCrimeLevel`.** The ten crisis
  rows the auditor's census names carry `holder` in the very rare rows' vocabulary (`rareSecrets.js :: HOLDER_KEYS`, read,
  not changed): `roles` / `category` (either answers), `notRoles`, `keepsHouse`. The reader `crisisHolderAdmits` sits
  beside the rows (pure, import-free: npcGenerator.js is at its banked max-lines ceiling, so no line was added there).
  The deal draws exactly as before (the same domain, the same roll); a drawn row the card fails is refused as a held row
  is (drawDeclared's own resolution: hash argmax over the admitted rows), so the pool's other rows carry the draw. The
  holder is read off what the card keeps at the deal: role, category, house (its seats are not landed yet). Every crisis
  pool keeps at least three rows with no holder test (the guard asserts it), so no person's pool falls under three.
  The supplies row takes `keepsHouse: true` (their own house's supplies): it refuses no holder of the 720 (`.supplies`
  stays 4, as the brief wants).
- **13b · `src/data/people/handlerTieLines.js`.** The held friend (handler_leverage_loved desc 3), its tension ("fallen
  ill inside") and the crewmate "get the prisoner out" (handler_leverage_crime tension 3) declare `needs: ['prison']` (the
  existing atom, `defenseFacts.js :: hasPrison`, what the Legal row prints) in place of `colour`. Refused, the index moves
  to the archetype's other indices (`createTieProseDraw`): each archetype keeps 3 of its 4 lines in every town.
- **14b · `src/domain/people/allegiance.js :: assignHandlers` (`ownHandlersOfTheSwap`).** After the round of the houses'
  pool, an agent of A on a face of B and an agent of B on a face of A exchange handlers, ONLY where neither A's network
  nor B's has any of its own people among its handlers (the swap; BR13). Every handler keeps its count (the bound holds);
  draw-free. `.cross` is not cured: on the thirty it reads 2 → 2; on the 150, 49 → 40, and ALL 9 that go were lines of a
  house the swap cure gave its own handler (that house's network is now handled by its own people first and goes round the
  pool for the rest, which the detector no longer reads); no `.cross` of an untouched house moved; none is new. On the 720, 106 → 99: 8 go, all in
  a house the swap cure gave its own handler; 1 reads `.cross` at the tip that the base counted as `14b.handler`
  (r2r-city-0, "handled by Ilya Kovalyov ... (Smuggling network)" under Underground network: Smuggling network stood in
  TWO swaps, with Front businesses and with Underground network; the first exchange gave it its own handler, so the
  second pair is now the auditor's one-way shape, the deal's design. The line printed at the base too). A first
  version that exchanged any reciprocal pair also moved a one-way `.cross` (bar0-city-under_siege+famine-rand-46): narrowed.
- **14h · `src/data/people/goalFamilies.js :: GOAL_LINE_MIN_MEMBERS`, `src/generators/people/goals.js :: cellCandidates`**
  (AMENDMENT 1 made goals.js mine). The cells' shape law keeps `line`, `needs`, `excludes` only, so the declaration stands
  beside the cell, keyed by the line: "Win two more people in {power} ... before {above} notices" needs FOUR members (the
  person, the one above, two more), counted as the Power tab counts them (`cardPowers.js :: facesInPower`). Fewer marks the
  line `refused` and the draw goes on draw-free (`drawVantage` / `admittedAfter`, the charter refusal's own path).
- **14g · `src/data/faceHonorifics.js`.** Arabic "the lord": `[{ male: "Emir", female: "Emira" }]`. The other one-string
  culture forms are office titles and stay.

RE-KEYED (R8): `tests/data/faceHonorifics.test.js` PINS arabic "the lord" `['Emir', 'Emir']` → `['Emir', 'Emira']` (the
same assertion, a dated note). No other test was changed; two tests my first vocabulary turned red were cured by mending
the vocabulary, not the tests: `tailNarrativeRows` B5 17522 (r2r-thorp-17: the eldest householder, a thorp's head, sells
the stores: `eldest` added to the head words) and `stressSecretNoCommodity` #327 (a militia captain authorises the works
of a monster-pressed village: the works row admits a military card).

## 4. DECLARED MOVES (R5) AND NEW VOCABULARY

THE 720 (records born at base and tip, field-diffed): 152 towns move (129 before 14h; 14h adds `npcs[].goal` on 33 cards). `npcs[].secret` 565 cards in 117 towns (the holder
refusals and the roster's held-set cascade that follows them) with `npcs[].presentation` 174 (read off the secret's words);
`npcs[].allegiance.handler` 22 cards in exactly the 11 swap towns (no other town changes any handler) with `simulationTrace`
11; `npcs[].goal` 45 cards (12 goals that name a handler, 33 the 14h refusals); `relationships[]` 16 towns (the prison declaration and the handler
ties); `generationCoherenceReceipt` 1. THE 525 (the golden corpus): 16 rows move: `relationships[]` 7 (the prison
declaration) and `npcs[].goal` 9 (14h); no handler or secret of the 525 moves. The golden master is already red at the line's tip
(names.final.txt): the close re-records. No new field on the saved record.

NEW VOCABULARY FOR THE OWNER'S VETO, each with three towns it prints in:
- "Emira" (14g): r2s-under_siege-metropolis-2, r2s-wartime-city-0, r2s-wartime-metropolis-0 (the 720); bar0-town-calm-rand-47
  (the thirty, C36170).
- THE HOLDER KEYS ON THE CRISIS ROWS (14f; words in `stressInstitutionEffects.js`: HEAD_WORDS, NOT_HEAD, COMMAND_HOLDER,
  SIGNS_HOLDER and the per-row lists): the sortie stays on r2r-metropolis-14, r2s-under_siege-town-1, r2s-under_siege-town-2
  (watch commander / watch captains); surrender terms on r2r-metropolis-14, r2s-under_siege-thorp-0, r2s-under_siege-hamlet-2
  (chief magistrate, Elder, Headman); the emergency stores on r2r-thorp-17, r2s-famine-town-1, r2s-famine-city-2 (the eldest
  householder, the granary reeve, the chief magistrate).
- NO holder key on the hooks (14e is left).

THE DOORS (R9), last lines at base and tip, identical: classes `hits 1787 · banked 1938 · fresh 0 · stale 151 · ceiling
1938`; things `fresh 39 · stale 72 · first-register stale 7 · banked 4688 · strips fresh 0 stale 0 banked 107`. No fresh
line added.

## 5. LEFT BY NAME

- **14e · the trade hook on a soldier (4 in the 720, 5 in the 150; C5296).** The hook is drawn CARD-LESS:
  `people/representatives.js :: drawCardHooks` hands `npcGenerator.js :: drawPersonHook` only the pool's key, and the
  crisis bias (famine, indebted, migration → 'economy') pulls a military card into the economy pool. The holder test the
  brief names ("the holder's own house OR SEAT is a trade's") needs the seat, and the seats land after the hook
  (`narrativeGenerator.js :: enrichNpcCoherence`). A test on the pool's category alone would strike the EXPLAINED C5328
  and C5358 (a castellan and a watch commander whose MERCHANT SEAT makes the hook true), which must still print. The cure
  needs `src/generators/people/representatives.js` (to hand the card) and a post-landing reading
  (`src/generators/people/personHooks.js` / `src/domain/coherence/hookTruthRecord.js`): not my files.
- **11e.wantBuy (AMENDMENT 1, seat J's rule; 6 in the 720, C8867).** THE ONE FACT's only reader,
  `src/domain/display/tradeListDisplay.js :: importsAsPrinted().needed`, is coherence-lazy, and `people/goals.js` sits in the
  eager engine core. Importing it from goals.js (tried, measured, reverted) turns `tests/architecture/engineCoreLazyEdge.test.js`
  (FIRSTPAINT-4, both arms) and `tests/architecture/factHomesLazy.test.js` (a), (b) red: engine-core would statically import
  `tradeListDisplay.js -> factsOf.js / houseInputAtHand.js / foodSurplus.js` and `chainStateShown.js -> crisisKind.js /
  institutions.js`, all `[coherence-lazy]`. The sanctioned fix the test names is a pin in `vite.config.js`
  (FIRSTPAINT2_LAZY_DOMAIN), which R5 forbids; the other road is the need list handed to `dealGoals` by its callers
  (`src/generators/generateSettlementPipeline.js:607`, `src/generators/narrativeGenerator.js:1065`), not my files, or an
  import-free leaf of the need list (a second home of tradeListDisplay's own reading: not done). Seat J's runner was not run.

## 6. THE NET (each alone, through `scripts/gate-tail.sh`)

- `typecheck:domain:strict` 0; `typecheck:ratchet` 0 (167, ceiling 167); eslint on every changed file 0;
  `tests/architecture` 21 files / 347 tests green.
- My guard green. The rounds' guards (bar5*, bar6*): `tests/domain/bar6MarksLaw8.test.js` (a) red at base and tip with the
  same message (17 instances not left by name); all else green at the tip.
- N2, `tests/lint` by name: no test red at the tip that is not red at the base with the same message
  (`generationForkRegistry.contract` A2 "74 to be 76" and `heldKeyWriterCensus` A2 "14 vs 13" at both;
  `ledgerCitationIntegrity` fails in this clone on a missing local ref `refs/heads/review-fixes-2026-07-08`, at base and tip).
- N3: `pipelineContract`, `isolatedTrade`, `publicProseEquality` green at base and tip; `pipelinePinnedMode` (3) and
  `generationForkCensus` (4) red at both with the same messages (stale stored figures). N4: the shared page's equality
  (`publicProseEquality`) holds; the secrets, handlers and handler ties are the DM's layer; "Emira" is the card door's, alike
  on both.
- The 50 test files that read my files (goals.js and goalFamilies.js included): at the tip red only where red at the base
  (vendorPdfLazy's goods roster `crisisStoppedRow.js`, generationForkCensus ×4), same messages; the walkers re-run at the
  final tree name the same 71 failures as before the 14h cure.
- No file under `src/domain/facts/` and no facts import changed: no build owed (R11).
- N5: the line's tip (lane/join-2026-11-14 = ed1d43529) is already an ancestor of the base: the scratch merge is a no-op,
  clean.
