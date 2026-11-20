# FRAME-3 — hand-back (FRAME-PART: the first half; FRAME-4 takes the second)

Written 2026-11-20T09:51:58Z (`date -u`) by FRAME-3 on `lane/frame-3-2026-11-20`. This lane is cut by fast-forward from FRAME-2's final tip `1fe37f10e`, at the chair's word "THE LANE IS YOURS at 1fe37f10e" (08:20Z). A successor needs only this file and the briefs it names. Every ruling below is the chair's, and the owner may veto any of them.

## THE COUNT THE OWNER READS FIRST

**AS BUILT AT THIS LANE'S TIP (`36c640d36`): 93 calm towns framed, 237 keep today's sheet** (thorp 0, hamlet 9, village 15, town 9, city 29, metropolis 31). That is W2 ONE-SIDED, FRAME-2's build. **"58" IS NOT BUILT until B9 merges.** B9 is measured, not merged: 58 framed, 272 keep today's sheet, by tier thorp 0, hamlet 8, village 15, town 5, city 12, metropolis 18. The opening trouble by type under B9: crime_wave 12 (20.7%), succession_crisis 10, trade_dispute 10, outside_debt 6, trade_collapse 5, resource_scarcity 5, the rest 3 or fewer. No type opens more than a third.

**Why the spread follows size** (the chair's measure: 300 fresh towns at untouched settings, scripts under `docs/chair/2026-11-20/seventh/measures/holistic/` on the chair's branch). Among towns born under no crisis, a village's ruler reads Contested in 72% and a hamlet's is Contested or in crisis in 46%. Every city's ruler is Approved or Endorsed, and 92% of metropolises read Endorsed. So "legitimacy below 45" is nearly always true in a village and nearly never in a city. Where it holds, W1 rests on the seat-type tension alone. The small tiers are framed by the seat; the large ones by a high conflict between two powers or by an impaired chain.

**FRAME-3's independent recount**: `docs/chair/2026-11-20/content/frame3/FRAME3-CF11-RECOUNT.md`. It is written from the ruling's words, not the lane's code, and gives each town, the tension it opens on, and the strain's grade. The strict reading gives 56; the lane's rule gives 58. The lane's rule also counts a corruption scandal whose sides name the ruler, which adds frame-calm-hamlet-19 and frame-calm-village-10. The re-born pool on the merged tree frames the same towns, town by town.

## THE RULINGS IN FORCE (one list; every one vetoable by the owner)

1. **CF1 (amended).** The frame is shown only where the record holds a trouble of weight. A calm town with none keeps TODAY'S SHEET BYTE FOR BYTE, and "today" means the working line as last merged (now `e356c94f2`). A town in crisis keeps its crisis sheet as it is.
2. **CF2.** The frame is derived at render, with nothing stored and no random draw. A choice is a hash of the seed, the tension's id and the side (`castHash`).
3. **CF3, with the explicit audience gate.** `composeTonightSheet(s, { audience })` draws the frame for `'owner'` only and fails closed. The stripped seed is the second lock. The born test opens the sheet on the gallery page and on the party link (`tests/security/frameShareVeil.test.jsx`).
4. **CF4 to CF8.** As in `prompts/FRAME-1.txt` on the chair's branch:
   - the variety ladder;
   - at most one side filled by office alone;
   - the archetype table;
   - every face carries its reason, from a closed set;
   - the measure the owner reads;
   - the house's laws for sentences, registers and numbers (one tuning table, `FRAME_TUNING`).
5. **CF9.** The frame's words are level, held as a closed set by a walker (`tests/domain/tension/frameWordsLevel.test.jsx`). A framed opening sits under the neutral accent. No sentence says more than the record holds.
6. **CF10.** Counterparts for the crisis kinds:
   - **Built in this lane before the deploy:** P1b and P4a (render-only); then P1, P2, P3 (P3a and P3b) and P4b (stored), each its own cause, builder and commit, red first.
   - **After the deploy:** P5, P6 and P3c.
   - **The law for each:** every face is a person or a power the record already holds, with its reason. There is no new draw that moves another town's or another role's result. Who stands in each role is measured by kind, before and after.
7. **CF11 (final).** A calm town holds a trouble of weight only where its own record grades a strain AND one of its tensions is about that strain:
   - **W1:** the incumbent is ungated, or legitimacy is below 45 by the gates' own read, WITH a seat-type tension (a `corruption_scandal` counts only where its sides name the ruler).
   - **W2:** a `powerStructure.conflicts` row of intensity HIGH whose TWO powers are BOTH sides of the tension.
   - **W3:** an impaired chain, food below Secure, or a creditor power, WITH a supply, debt or food tension.
   - The sheet opens on the trouble with the highest strain grade, the record's order breaking a tie. There is NO QUOTA.
8. **THE NAMES RULE in the lane's files.** A power in a sentence goes through `powerNameInProse`, which is the line's own form since `e356c94f2`.
9. **A PERSON IN THE CRISIS CAST IS NEVER "IT".** Every `CAST_REASONS` string an `npcRow` can carry that says "it" or "its" of its holder is in scope, in three families: the waverer, `instigatorGains`, and `bruntBase` except `public_legitimacy`, with its siblings.
   - A person takes their own `gender`'s possessive, else "their".
   - A power or an institution keeps "its".
   - The five reds are cured by cause and never loosened. `castDerived`'s floor of 500 stays.
   - The stored figures are named and signed by nobody.
10. **THE TWO-CRISIS POOL.** Each STORED cast change (P1, P2, P3, P4b) proves byte-identity also on a forced two-crisis pool (`config.stressTypes`), pairing its kind with every kind it links (`CRISIS_LINKS`) or contradicts (`CONTRADICTORY_ROLE_PAIRS`, the town caps). The other crisis keeps its roles byte for byte; otherwise the difference is named and ruled before the unit merges.
11. **CONFINEMENT BETWEEN BASE AND TIP.** The generator's golden master is already red on the line, so a stored unit's movement of it is masked. Each stored unit therefore proves confinement on born towns with the shared tool: `origin/lane/names-3-2026-11-20` at `d1d8ffff8`, `node docs/chair/2026-11-20/content/tools/confinement/trees.mjs <rev-before> <rev-after> <workdir> [--words=number|names|none] [--control]`. It diffs the golden's 525 and the census's 720, born in each tree, key by key.
12. **THE RE-PINS AT A MERGE OF THE LINE.** They are the merge's own work, in the merge commit, with no assertion weakened:
    - (a) the calm digests are re-measured AT THE LINE, which carries no frame code, and each must equal the merged tree's;
    - (b) the crisis digests are re-measured at the line plus B5's `crisisHooks.js` diff alone;
    - (c) the veil test's shared reads are re-printed by its own `FRAME_VEIL_PRINT` door in an archive of the line.
13. **AT EVERY MERGE ON THE LANE, BY THE INTEGRATOR:**
    - run `tests/lint` WHOLE and name every red with its cause;
    - re-take the lighting census by its door (`LIGHTING_CENSUS_REFREEZE='<seat>' LIGHTING_CENSUS_NOTE='<why>' npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js`, in a CLEAN worktree with `node_modules` in `info/exclude`; it exits 1 by design, then run it again plain for the green);
    - re-take the wiring stamp by its door (`node scripts/wiring-census.mjs --dry`, then without `--dry`; confirm the delta is exactly the lane's new src files, by name);
    - put both in one `chore(registers)` commit after the merge.
14. **NAMED, SIGNED BY NOBODY** (the owner's one signing at the close):
    - `tuningRegister` (FRAME_TUNING is "measured, not in the inventory"; CRISIS_CAST_TUNING's "dependents moved"; both rows listed below);
    - the generator golden rows any stored unit moves;
    - `institutionBudgetPromise`'s committed hashes;
    - the pinned-mode A-arms on a moved golden row.
15. **KNOWN REDS ON THE LINE THAT ARE NOT THIS LANE'S**, signed by nobody before the close:
    - the generator's golden master (521 of 525);
    - `generationForkCensus` A1;
    - the golden-corpus arms of `pipelinePinnedChoosers`, `rosterFinalUnderHeldRoster` and `powerEconomyFreshness`;
    - `worldFactRederive` A7;
    - `espionageDormancyFence` FENCE 1.
16. **FOR THE SECURITY LANE, said here and cured nowhere by this lane:**
    - every new kind of holder a stored cast role can now carry (a criminal power as creditor; another foreigner reached through a lodging keeper; the record-keeper; a trade's master), and the stored strings that name each;
    - the owner audience is inferred at one mount (`OutputContainer.jsx`), and the Table View mount is still ungated on the gallery and the party link (the frame stays off by the two locks).
17. **CANDIDATE WORDINGS FOR AFTER THE DEPLOY** (none before it):
    - "keeps the taverns" (the house key is a plural type);
    - "would know of them" (no record fact);
    - "her power could go either way" (reads as her personal power where the vocabulary means her house).

## EACH UNIT: STATE, BRANCH, COMMIT

| unit | state | branch / commit | brief |
|---|---|---|---|
| cut | DONE | fast-forward to `1fe37f10e`, pushed | — |
| `tests/lint` whole at the cut | DONE | 6 failed in 5 files, each named and ruled (the merge commit's body) | — |
| the line `e356c94f2` | MERGED, pushed | `993865a02` (manifest union; the three re-pins, ruling 12) | — |
| registers | DONE, pushed | `36c640d36` (lighting 3705 → 3711; wiring stamp 1435 → 1437; proseNumerics 404 → 406) | — |
| briefs | pushed | `4421fbf6c` | — |
| **B9** both powers + **B9b** the veil test's seed loops | BUILDER RETURNING (it had committed and was running its last gates when this was written). **UNREAD by FRAME-3.** | local branch `frame3-b9`: `af4e6f861` (B9), `0ed7e47c5` (B9b) at writing; FRAME-3 relays the final commit and pushes it as `lane/frame-3-2026-11-20-b9` | `frame2/B9-W2-BOTH-POWERS.md` + `frame3/B9-ADDENDUM.md` |
| **B11** a person is never "it" | BUILDER OUT; no commit yet at writing. **UNREAD.** | local branch `frame3-b11`; relayed and pushed as `lane/frame-3-2026-11-20-b11` | `frame3/B11-PERSON-NOT-IT.md` (lead: `origin/lane/frame-2-2026-11-20-b10` at `d8a1b1657`) |
| phone floor census, B6 re-seat, P1b, P4a, P1, P2, P3, P4b, the measures, the six sheets | FRAME-4's | — | `frame2/B6-RESEAT.md`, `frame2/B8-CF10-BUILDS.md` + rulings 10 and 11 above |

**Expected back from B9, and what to check first in its diff:**
- In `troubleOfWeight`, the W2 test reads `.every` over the row's two parties, and nothing else moves.
- The count is 58 and equals `frame3/FRAME3-CF11-RECOUNT.md` town by town; any difference is named.
- The new calm pins were measured at the LINE `e356c94f2`, not at `7e0c77ae2`.
- `WITH_CRIMINAL` is re-seated from the 12 crime_wave openers, and at least two frames name the criminal power.
- B9b converts all four bare loops with no assertion dropped (diff each loop body before and after), and `seedLoopTotality` is green.

**Expected back from B11, and what to check first:**
- `personReason` and the exported reverse fold (stored reason → vocabulary sentence) live in `crisisCast.js` as ONE function.
- `castDerived` reads through it, its floor is still 500, and the count it reads is stated.
- The two re-pins assert the same guard.
- The stored figures are named, not re-recorded.
- The confinement table: calm identical, untouched crisis identical, every moved leaf is one of the three families.

**Merge them one after the other**, with `tests/lint` whole after each and the registers by their doors (ruling 13). B9 touches `troubleCast.js`, the tension tests and the veil test. B11 touches `crisisCast.js`, the crisis tests and `castDerived`. No file is in both fences.

**Ruled to FRAME-4 by the chair, not built here:** the crisis page's audience argument and the owner-only lines (P1b, P4a, and the counterpart lines the stored units write).

## THE STORED FIGURES THE "IT" CAUSE MOVES (named, signed by nobody)

From B10's results (`frame2/B10-PERSON-NOT-IT-RESULTS.md`). B11 re-measures them on this lane's tree and must report its own before and after.
- `tests/property/generatorGoldenMaster.test.js`: 5 of 525 rows (`metropolis|germanic|coastal|port|civilized`, `metropolis|arabic|mountain|road|civilized`, `metropolis|mesoamerican|mountain|road|civilized`, `metropolis|south_asian|coastal|port|civilized`, `metropolis|south_asian|mountain|road|civilized`; seed `golden-master-v3`). Each row moves one leaf, stored twice: the infiltrated instigator's "its power gains from the crisis" becomes "her power gains from the crisis". The line's golden is already red at 521 of 525 for other causes.
- `tests/generators/institutionBudgetPromise.test.js`: 6 of 60 committed hashes (`x46-promise-` 21, 39, 51, 52, 53, 57), these reasons only.
- `tests/generators/pipelinePinnedChoosers.test.js` A1 and `tests/generators/pipelinePinnedMode.test.js` A1, A2, A5: all on the one golden row `metropolis|south_asian|mountain|road|civilized`.
- `tuningRegister` (named, unsigned): `src/domain/tension/sideArchetypes.js#FRAME_TUNING` is measured but not in the inventory (before: absent; after: the measured row); `src/domain/crisis/crisisCast.js#CRISIS_CAST_TUNING`'s dependents moved (before: the inventory's committed dependents; after: those plus `troubleCast.js` and `tonightSheet.js`'s import path).

## THE MEASURING SCRIPTS (one command each)

- **The calm pool:** FRAME-1's pool script (`FRAME-1-HANDBACK.md`, "How to re-measure"). `node pool.mjs 55 pool.json` takes about 45 seconds and gives 484 tried, 330 calm. To born on another tree, set its `R` to that tree's `src/`.
- **CF11, from the ruling's words:** `node cf11final.mjs pool.json <src/> framed.txt`. The script is in `frame3/FRAME3-CF11-RECOUNT.md`.
- **CF11 and the face table, by the lane's own code:** B2's scripts (`frame2/B2-WEIGHT-RESULTS.md`, "The scripts").
- **The crisis casts, B7's pool:**
  - `node gen.mjs pool.json`, then `node measure.mjs pool.json` (`frame2/B7-CF10-PROPOSAL-RESULTS.md`, "The scripts").
  - The measure reproduces B7's summary table exactly at `79db75eb2`.
- **The re-pins at a line merge:** a vitest file that prints the weight test's digests in an archive of the line (FRAME-3's `repinDigests.test.js`, kept in this session's scratchpad). Its logic is the weight test's own `digest(JSON.stringify(composeTonightSheet(born(seed))))`, plus the journal page. For the veil reads, use the veil test's own `FRAME_VEIL_PRINT=<file>`.

## EXECUTED OR PLAUSIBLE

- **Executed:**
  - FRAME-3's CF11 recount, on the pool born at `79db75eb2` and again on the merged tree.
  - The town-by-town comparison with the lane's code, both `.some` (93) and `.every` (58, the latter in an archive copy).
  - B7's measure reproduced at `79db75eb2`.
  - The scratch merge, then the real merge: the targeted set green (110 passed, 1 expected fail).
  - `tests/lint` whole at the cut and at the merge: 6 failed in 5 files, the same 5 causes both times.
  - The three re-pins, each measured in an archive.
  - The registers, each by its door (the lighting census green after its refreeze: 34 passed).
- **Plausible, not executed by FRAME-3:**
  - B10's figures, until B11 re-measures them.
  - Everything B9 and B11 report: UNREAD at this hand-over.
- **Not done here:** the phone floor census, B6, CF10, the measures and the six sheets (FRAME-4).
