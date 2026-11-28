# ALLEGIANCE-CAR2 — the guild's push in the rank deal, and the hall-capture state derived from one source (2026-11-08)

Seat: ALLEGIANCE-CAR2 (session `session_01FbPLbdsxRuWjBRZkbVTW9F`), a child of the cloud chair (`session_01FbPLbejcfwX5nii12VM673`) under the owner's full delegation. Brief: `docs/allegiance/BRIEF-ALLEGIANCE-CAR2-2026-11-08.md` (the integration branch's copy is the text of record; byte-identical to this branch's); design `ALLEGIANCE_DESIGN_2026-11-08.md` §2 A3/A6, §3.2, §3.4, §4 I-1 / I-5 / I-13, §5; rulings J-11, J-13. Branch `lane/allegiance-car2-2026-11-08`. Every figure is **CONFIRMED** (read from a named command's own output) unless it is marked **PLAUSIBLE**.

## 0. The base

- Cut from car 1's final tip `7395b5dab` (`git rev-parse origin/lane/allegiance-car1-2026-11-08` = `7395b5dab…`).
- **The base's reds**: the full vitest run in a clean worktree of `7395b5dab` (`--reporter=json`): **37,755 tests, 76 failed, 53 files with a red** (81 lines with the 5 file-level reds; the list is kept in the scratch `base-reds.txt` and compared line for line in §8). Car 1's record says 75 at its tip; §8 says why the one-red difference has no name.
- `2d2df70d1`: WRITE-PEOPLE's `1f60470eb` merged (the DM view's capture sentences, data only: `src/data/people/dmPowerLines.js`, `tests/data/dmPowerLines.test.js`), so the hall's receipt reads its sentence shapes from their home (the brief §1). Car 1's precedent: `f14e6de1e`.

## 1. The steps, each with its commit

| step | commit | what |
|---|---|---|
| merge | `2d2df70d1` | WRITE-PEOPLE `1f60470eb` (CAPTURE_LINES) |
| 2 invariants, red-first | `6694756af` | I-1 (soak slice + control), I-5 (an arm per floor under a maximal push + the checker's control), I-13 (the push and the ranks keyed), J-13's one-writer scan (+ control), the soak kind `coh:capture-without-agent` |
| 3 A3, the push | `bbb1a4abc` | `GUILD_PUSH_TUNING`, `guildPushOf`, the one draw line in `rankPowers`; the tuning row through its door |
| 4 A6, the hall | `ce90cf16e` | `domain/people/hallCapture.js` (`HALL_CAPTURE_TUNING`, `hallCaptureOf`, `writeHallCapture`), the A6 line at the seam, the two old writers silenced, the tuning row |
| the tip's reds, cured by measurement | `b741ac35e` | A6 on a HELD roster (pinned mode A2: the rederived record lost `criminalCaptureState`) |
| | `30303b2b6` | the holder census: the producer re-cited to the ONE writer, `prominentRelationship` to its symbol; the census re-taken through its door; two drawn-prose anchors in the car's own test computed |
| | `81d853e43` | `rulingStructure.js` back under the power/ module line ceiling (804 → 798 of 800) |
| | `7f111daa7` | the fork registry: `npcs[].role` `computed` → `drawn` (7/42, bisected to A3) |
| | `08cc27dac` | the captured taste town re-taken by its own rule: `rate-69-0` → `rate-105-2` |
| registers | `6ee3f8198` | the tuning inventory refrozen through its ritual (76/76) |
| registers (a register seat, this car's subagent) | `7017f5096` / `45c9e64c6` | the observed-shape rung **36** (review `docs/allegiance/osr-rung36-guild-push-review.json`): NEW 0 · GONE 12 · SAME 1,534, all 12 bisected to the push (the corpus's year re-dealt: the rung-35 `nearbyResourcesState` / `resourceHistory` rows); the walker's corpus pins 396/2525/396/80 → 396/2535/396/81 |
| registers | `e08d528d1` | writer reach re-banked (`--rebank --charter='§934.105'`): cohort 1408 → 1418, 6 stale folded out |
| registers | `aedde149b` | the edge-shared bundles rebuilt |
| STOP 3, ruled | `d32d3fc2c` / `aca93cbc5` | the relation matrix's capture rows re-derived from the ONE state (red-first: 10 on the slice; 50 → 0 on the 1,000) |
| J-20, ruled | `1dee00911` / `89870c0ad` | the hall's hold on no public page: a targeted strip in `publicSafe.js` + migration **207** (a FILE; applying it is the owner's) |
| the final run's reds, cured | `fa844fe41` | migration 207's doors (the rehearsal's tail wave, the head pins, `@rollback`, ARCHITECTURE / DEPLOY / CURRENT_STATE) |
| | `212f18692` | the fork registry contract's computed count 7 → 6 (`7f111daa7`'s cause, its second pin) |
| | `8628dd669` | writer reach re-frozen (`--write`, shrink-only): J-20's strip reads the relation rows |
| | `5ce11d3a3` | the edge-shared bundles rebuilt again |
| the owner's word (1) | `e9af75938` | the capture-at-birth envelopes RE-RATIFIED, re-keyed by identity as derived bounds |
| the owner's word (2) | `2ab1d6db2` | THE ROT BENEATH THE ORE's receipt 3 re-worded to what the seed holds |
| the record | this file's commit | the roster +1 |

## 2. The reader census (before any write)

`git grep -l 'criminalCaptureState\|captureState'` at the base: **83 files** (30 in `src`, 23 in `tests`, the rest docs and scripts). In `src`, by role:

| role | files :: symbol |
|---|---|
| **birth writers** (both silenced at A6) | `generators/power/rulingStructure.js :: generatePowerStructure` (the state and the governing row's seed); `generators/power/economyReconciliation.js :: reconcilePowerStructure` (the re-projection; `captureState` on `TRANSIENT_PROJECTION_FIELDS`) |
| **readers inside generation** | `generators/npcStructure.js :: getPrimaryCondition` (A5 — reads the state: "corruption" condition); `generators/factionDynamics.js :: computeFactionRelationships` (its own call of the classifier: the gov↔criminal and criminal↔military relation rows' `type`, `captureState`, `narrative`) |
| display / prose / PDF (read the stored state) | `display/stateProse/powerStateProse.js`, `defenseStateProse.js`, `prose/holderTable.js`, `pdf/lib/viewModel.js`, `viewModelBodySlices.js`, `components/new/tabs/PowerTab.jsx`, `display/galleryVeil.js` (deletes the three keys on the gallery projection), `coherence/crisisFactFindings.js`, `crisis/crisisCast.js` |
| the simulation (play time; its own ladder) | `domain/worldPulse/*`: `pulseKernel.js` (mirrors the faction rung onto the state), `factionCapture.js`, `factionCompetition.js`, `causeLifecycle.js`, `causeVocabulary.js`, `migrationKernel.js`, `npcLadder*`, `settlementPolitics.js`, `thievesGuild.js`, `beliefMap.js` |
| typedefs / registries | `settlement.schema.js`, `prose/wiringCensus.js`, `corruption.js` (a comment) |

## 3. The invariants (red-first at `6694756af`, green at the tip)

Red-first: `npx vitest run tests/generators/people/hallCapture.test.js tests/generators/people/castPowers.test.js` in a clean stage of `6694756af`: **11 failed, 10 passed** — every new arm red for its named reason, every control green:

| # | arm | red at `6694756af` (why) | at the tip |
|---|---|---|---|
| I-1 | the soak slice by the raw record + the soak kind | red: 4 strengths-only 'corrupted' halls, towns 154, 160, 221, 232 (no agent in the ruling three, no criminal governing power) | TIP-I1 |
| I-1 | the control (a planted strengths-only capture / corrupted) | green (the checks are live) | green |
| I-1 | re-reading a born record returns its stored state | red (no module) | TIP |
| §3.4 | the rungs, the climate cap, the receipt, the writer's key order | red (no module) | TIP |
| J-13 | `criminalCaptureState` written at ONE site; the governing row's seed at ONE site | red: the power step's and the re-projection's writers | TIP |
| J-13 | the scan's control | green | green |
| I-5 | the floors under a MAXIMAL push (FLOOR 1, FLOOR 2), the push live | red (no push) | TIP |
| I-5 | the floor checker's control (a planted swap) | green | green |
| I-13 | removing a card: every other card's push, and the ranks of every power it held no membership in, byte-identical | red (no `guildPushOf`) | TIP |
| dials | `GUILD_PUSH_TUNING`, `guildPushOf` | red (no export) | TIP |

## 4. The generator moves, for the merge's record (UNSIGNED; nothing re-recorded on this branch)

Each measured stage to stage with `scripts/audit/landing-stage.sh measure` in a clean stage of the commit (the trees of `6694756af`, `ea8577a3d`/`bbb1a4abc` and `e2595cadf`/`ce90cf16e` — the message rewrite kept each tree byte-identical).

| cause commit | gm /525 | fence /360 | herald | prose /1,050 | witness | pdf |
|---|---|---|---|---|---|---|
| `bbb1a4abc` A3, the push (vs `6694756af`) | **105** (city 38, metropolis 67) | **70** (town 1, city 30, metropolis 39) | rows 450 → 448: 2 moved, 0 added, 2 removed | **66** | 0 | 0 |
| `ce90cf16e` A6, the hall (vs `bbb1a4abc`) | **15** (metropolis 15, named in the commit) | **22** (town 2, city 9, metropolis 11) | 0 (448) | 0 | 0 | 0 |
| `b741ac35e` … `d32d3fc2c` (the cures, the registers; vs `ce90cf16e`) | 0 | 0 | 0 | 0 | 0 | 0 |
| `aca93cbc5` the capture rows read the one state (vs `d32d3fc2c`) | **15** (metropolis 15) | **21** (town 1, city 9, metropolis 11) | 0 | 0 | 0 | 0 |

The checks commit `6694756af` moves no generator byte (tests and the soak instrument only). The A6 writer keeps the record's key order (`criminalCaptureState` after `factionRelationships`; the governing row's `captureState` after `powerLabel`, the places the power step's writes left them), so a town whose state does not change moves no byte.

## 5. The bands (§5, car 2's rows), on the soak 1,000

The instrument: a scratch probe (`scratchpad/probe/hall.mjs`) birthing the soak 1,000 through `scripts/audit/soak-review/corpus.mjs :: birth`, 0 errors, at the base `7395b5dab` and the tip. "Organized crime" is car 1's `organizedCrimeOf` (J-5); the design's §0 baseline used `criminalEffective ÷ 100`, so the base column is re-measured here on car 1's dial.

| measure | base `7395b5dab` | tip | the design's band | verdict |
|---|---|---|---|---|
| towns with an agent in the ruling three, organized crime 0 | 0 of 592 | **0 of 592** | never | inside |
| the same, organized crime in (0, 0.4) | 12 of 106 towns (1.7% of the 698 below 0.4) | **12** (1.7%) | ≤ 3% of towns | inside |
| the same, 0.4–0.6 / 0.6–0.8 | 4 of 24 / 9 of 55 | 4 / 9 | — | — |
| the same, 0.8+ | 48 of 223 (21.5%) | **52 of 223 (23.3%)** | 25–40% | **under by 1.7 points** — a question |
| agent lords | 29 | **29** | 25–40, never through the push | inside (unchanged: the push never reaches FLOOR 1) |
| agents' weighted ranks in legitimate powers (rank 2 / rank 3) | 130 / 111 | **151 / 127** | — | the push is live |
| capture / corrupted / equilibrium / adversarial / none | 4 / 70 / 81 / 94 / 751 | **4 / 71 / 101 / 35 / 789** | capture 5–20, every one an agent lord; corrupted 60–110; none ≥ 700 | capture **under by 1** (all 4 agent lords); corrupted, none inside |
| 'capture' or 'corrupted' with no agent and no criminal ruler | **25** | **0** | 0 (I-1) | inside |

**PLAUSIBLE readings.** Capture needs an agent lord AND an agent second (3 + 2): 29 agent lords give 4 such halls, the lords' own A2 roll (car 1) times the second's. The push raises only rank 3 of the ruler (J-11), worth 1 point, never enough. Adversarial falls 94 → 35 because the climate rung reads the seam's FINAL roster (§6 judgment 2): in 39 + 10 + 10 base 'adversarial' towns the criminal power the step-12 classifier saw is gone from the final roster, or is under 5 points. The 0.8+ band was 21.5% at the base; the push adds 4 towns. Nothing here is tuned: the dials are the owner's.

## 6. Judgment calls (each with the default applied; vetoable)

1. **A6 sits BEFORE A5, not after it** (the STOP, the default applied): `npcStructure.js :: getPrimaryCondition` reads `criminalCaptureState` (the "corruption" condition). With the power step silenced, the design's "after the structure" would hand A5 no state. A6 reads only the ranks and the handlers (A3, A4), so it moves up one line.
2. **The climate rung is the classifier over the seam's CURRENT roster** (`rulingStructure.js :: captureClimateOf`). `hallCapture.js` is domain code and cannot import the classifier (the domain → generators boundary), so the seam computes the rung and hands it in. Carrying the step-12 verdict forward would need a stored field (a new persisted key) or a side channel. Measured at the base: the seam's recompute equals the stored state in **912 of 1,000** towns; the 88 others are towns whose roster changed after step 12 (48 'adversarial' → 'none', 17 'equilibrium' → 'none', 20 'corrupted' → 'equilibrium', …). The final roster is the one the page shows.
3. **`HALL_CAPTURE_TUNING.climateCap = 2`** ('equilibrium', unit rank): a fourth leaf so the cap is no bare number (car 1's `weightZeroHouse` precedent).
4. **The push in LEGITIMATE powers only**: a criminal power's own deal is never pushed (the design's "each of its LEGITIMATE powers").
5. **I-13 read as the push and the untouched powers' ranks**: removing a card from a power's pool lawfully moves that power's weighted pick, so "every other card's ranks byte-identical" is asserted for every power the removed card held no membership in, plus every card's push.
6. **The governing row's seed keeps the power step's rule**: stamped at equilibrium and above, only where the row carries none.
7. **The receipt** is the rung's label and WRITE-PEOPLE's variant-0 line (`CAPTURE_LINES[state][0]`), e.g. "Corrupted: The second and the third of Elder Council answer to Thieves' Guild." **For the owner's veto**: the lines are WRITE-PEOPLE's; two read oddly when wired — `criminalsOf` falls back to the lower-case "the criminal houses" at a sentence's start ("the criminal houses works against …", 'adversarial' variant 0), and the ruler takes no article ("of Elder Council").

## 7. STOPs and findings

- **STOP 1 (default applied)**: A6 before A5 (§6.1).
- **STOP 2 (default applied)**: the climate rung recomputed at the seam (§6.2).
- **STOP 3 — RULED and CURED (`aca93cbc5`)**: the manifest extended by this cause to `factionDynamics.js :: computeFactionRelationships`'s capture read (the two builders extracted unchanged; `withCaptureRelations` re-derives the rows at A6). At the tip: **0** of 1,000 towns with a disagreeing row (50 before). The measure that ruled it: `factionDynamics.js :: computeFactionRelationships` keeps calling the classifier for the gov↔criminal and criminal↔military relation rows (`type` 'corrupted', `captureState`, and the narrative "X is a front. Y makes the actual decisions …"). At the tip, **50 towns** carry a relation row whose `captureState` differs from the derived state; in **4** a relation row says 'capture' ("is a front") under a hall that is not captured, and in **26** a row says 'corrupted' or 'capture' under a hall below 'corrupted'.
- **STOP 4 (held keys and regeneration)**: (a) a birth with `npcs` HELD skipped A6 — MEASURED by pinned mode's A2 at the tip (the rederived record lost `criminalCaptureState`), CURED at `b741ac35e` (the same writer over the held cast); (b) a birth with `powerStructure` HELD has its state re-derived from the cast (byte-identical whenever the cast and roster are, which A2 proves for the record-built bag); (c) a section regeneration (`regenNPCsPipeline`) derives the state on its own view for A5 and returns no `powerStructure`, so the stored state stays the old cast's while the regenerated cast's allegiances are new — outside the manifest (`generateSettlementPipeline.js`), for the chair (PLAUSIBLE, argued from the code; not measured on a store).
- **STOP 5 — DECIDED BY THE OWNER, 2026-11-09 ~03:5x UTC ("Yes", relayed by the chair): the envelopes RE-RATIFIED at the measured rates; landed at `e9af75938` as bounds re-derived through the manifest's own law (town 20 → 25, city 7 → 34, a new city-capture entry with bound 7; every capture asserted to be an agent lord's hall with a criminal power standing). Nothing was hand-loosened.** The paragraph the owner read: *The owner's paragraph:* `tests/generators/captureBirthScale.test.js` sweeps 400 ordinary germanic births per tier (seeds `cap-ord-*`). With the hall's state derived from its agents (A6), a hall whose LORD holds a hidden allegiance reads 'corrupted' (the design §3.4: "corrupted if the lord is an agent"). Measured, the base `7395b5dab` against the A6 tree: corrupted-or-capture **town 3 → 12 of 400 (3.0%), city 1 → 19 (4.75%), village 0 → 4 (1.0%)**. Every one of the 35 has an agent in the ruling three, and 31 are an agent lord alone. All 19 cities stand at organized crime ≥ 0.88; 10 of the 12 towns and all 4 villages stand below 0.4 with no criminal power. The design's own band for the clean end (§5: agents in the ruling three "rarely below 0.4 (≤ 3% of towns)") holds: towns 2.5%, villages 1.0%. **One full capture**, `cap-ord-city-235`: an agent lord and an agent second (3 + 2 = 5 ≥ `captureScore`), a criminal power standing, organized crime 1.00. §3.4 allows it, and no §4 invariant forbids it (I-1 holds). The 2026-07 envelopes (`tests/fixtures/distribution-envelopes.manifest.json`: ordinary cities corrupted ≤ 7, derived from 1/400; no full capture in an ordinary birth) were set for the strengths-only classifier. The decision is the owner's: re-ratify them at the measured rates (the chair recommends it), or tune A6.
- **STOP 5 (detail)**: `tests/generators/captureBirthScale.test.js` — "ordinary cities corrupted" reads 19 against the derived bound 7 (`tests/fixtures/distribution-envelopes.manifest.json`, owner-ratified 2026-07-26/28), and "ordinary settlements never read full capture" reads 1. Green at the push's stage, so A6's: agents now corrupt halls in ordinary towns (the design's "rarely in a clean town"). The envelope is the owner's; not loosened.
- **STOP 6 (curated content; left red)**: `tests/data/foundingSeeds.probe.test.js` "THE ROT BENEATH THE ORE — … criminal arrangements": the showcase seed's strengths-only 'corrupted' hall is gone, so `npcStructure.js`'s corruption-condition goals no longer print its receipt. Green at the push's stage, so A6's. **DECIDED BY THE OWNER (2026-11-09 ~03:5x UTC, "Yes") and RULED (the chair, ~04:1x UTC, claims-parity), landed at `2ab1d6db2`:** receipt 3 → "Figures in the town answer in secret to its criminal houses." (the probe: at least two cards carry an allegiance; mini-3 holds 4). The recommended "a hall-holder …" was withdrawn as false: mini-3's ruling three hold no allegiance, and mini-0..2999 holds no seed with Contested + a major uprising + an agent in the ruling three. The new line is FOR THE OWNER'S VETO. The earlier measure: The seed's own door ("re-verify the claim or re-choose the seed"): mini-0..2999 (mining_colony, town, the probe's own forge) scanned at the A6 tree; NO seed holds all three receipts (on mini-0..59: Contested 7, a major uprising ≤ 15 years 1, the corruption goal 3, the first two together 1, mini-3 itself, whose hall reads equilibrium). The chair recommends receipt 3 re-worded to the new model's own expression of the rot (a hall-holder with a hidden criminal allegiance) and the scan re-run; the owner decides.
- **J-20 — RULED and BUILT (`1dee00911` red-first, `89870c0ad`; doors `fa844fe41`)**: a targeted strip by path (no denylist token), client `publicSafe.js :: publicVeilPass` and its SQL twin, migration **207** redefining `_gallery_sanitize_public_json` only (206's body + the block; `_gallery_world_snapshot_is_safe` untouched). Rows carrying a capture rung, or typed 'corrupted', are DROPPED, never re-typed. **The veil walk** (`toPublicSafe`, the soak 1,000 and the golden 525 at `89870c0ad`): capture keys **0 / 0**, corrupted rows **0 / 0**, capture rows **0 / 0**, "is a front." **0 / 0**, allegiance keys **0 / 0**, covert ties **0 / 0**. The raw records carry the state in 1,000 / 525, with 271 / 336 capture rows. **Public posture, for the owner**: the public dossier and the gallery no longer show the governing↔criminal or criminal↔military relation rows, or the capture state. Players see less; the DM sees all. 207 is NOT applied (check-migration-head: repo 207, prod 203). The earlier measure: `criminalCaptureState` on the public page. Measured: the client projection keeps `powerStructure` whole. `toPublicSafe` is pinned equal to the SQL sanitizer (pglite), and every client token must sit inside the world-snapshot scanner, so a client-only veil turns those suites red. A denylist token would also make the scanner reject world snapshots carrying `factionStates[].captureState`. The relation rows' public narrative says the same thing in words. Held unbuilt for the chair's ruling (security posture).

## 8. The reds: the base's vs the tip's

**The base, re-run for flakes (the chair's measure):** every base-red file (52, the ledger walker apart) run twice more in the clean worktree of `7395b5dab`: **76 failed both times, the same 76 by name** (`diff` empty). So there is no flake. Car 1's "75" is ARITHMETIC (§9 of its record: "the base's minus 13 cured: 75 = 88 − 13", at its own measured tip `914fff008`/`0abfa096e`), not a run at `7395b5dab`, and car 1 kept no failing list by name. The 76th cannot be named by a diff; it is a measurement-condition difference between the two counts. The 5 file-level reds (no test inside counted) include `tests/lint/ledgerCitationIntegrity.test.js`: its worktree holds no local `refs/heads/review-fixes-2026-07-08`, a condition of a clean clone.

**The tip's full run** (`--reporter=json`, a clean worktree of `5ce11d3a3`, the code-final tip before the owner's two words): **37,779 tests, 79 failed = the base's 76 + exactly the 3 owner-decision arms** (captureBirthScale ×2, foundingSeeds ×1). Every other base red holds, line for line; none is tip-only. (The ledger walker's file-level red is the base's own; only its worktree path differs.) Those three are cured at `e9af75938` and `2ab1d6db2` (their suites 28/28 and 24/24 at the tip), so **the lane tip's reds = the base's 76**, PLAUSIBLY exactly (the two later commits touch only those suites' fixture, test and seed text; no full run after them).

The tip-only reds the earlier runs found, all cured by measurement, one cause per commit: the first run at `ce90cf16e` (34 lines, §1's cure rows) and the run at `89870c0ad` (16 lines: 207's doors, the fork contract's second pin, the writer-reach re-freeze, the edge bundles). The golden suites' rows are red at the base and the tip alike (the UNSIGNED moves); §4 counts this lane's moves by cause.

## 9. The soak 1,000

`node scripts/audit/soak-review.mjs --count 1000 --workers 2`, each in a clean worktree:

| tree | verdict | findings | battery-would-not-vouch | reader:tension-memory | A-09 | reader:hook-pools | coh:capture-without-agent | errors |
|---|---|---|---|---|---|---|---|---|
| base `7395b5dab` | CLIMB | 702 | 698 | 61 | 4 | 3 | — (no kind) | 0 |
| `ce90cf16e` (A3 + A6) | CLIMB | 702 | 698 | 61 | 4 | 3 | **0** | 0 |
| `89870c0ad` (+ ruling 3, J-20) | CLIMB | 702 | 698 | 61 | 4 | 3 | **0** | 0 |

The findings equal the base's, class for class; cert and coh at 0.

## 9b. The other proofs

- `npx eslint` on every JS file the lane touched (28; the generated edge bundles excluded): exit 0.
- `npm run build` at `5ce11d3a3`: exit 0.
- Types, at the final code: `tsc -p tsconfig.full.json` **179** `error TS` lines, the base's **179**. `check-full-typecheck` and `check-domain-strict` print the SAME regression lists as the base, file for file (publicSafe.js strict 11 = the base's 11). These are the base's own reds. No new any-cast.

## 10. CONFIRMED vs PLAUSIBLE

CONFIRMED: every figure in §0, §2–§5 and §7–§9b, each read from the named command's output in a clean worktree or stage of the named sha. PLAUSIBLE: §5's readings of why capture and the 0.8+ band sit under their bands (argued from the formulas, not bisected); the `npcs[].role` chain (push → ranks → importance → the coupling's cards; the 7/42 measured); the regeneration finding of STOP 4(c); that the lane tip's reds equal the base's 76 exactly (the last full run was at `5ce11d3a3`; the two owner-word commits after it were proven by their own suites).
