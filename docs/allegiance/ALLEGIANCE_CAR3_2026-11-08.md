# ALLEGIANCE-CAR3: patronage derived by one function, the DM view "who really runs this town", the bands, the bought watch, the leash-only card and the dormant law (2026-11-08)

Seat: ALLEGIANCE-CAR3 (session `session_01FbPLbfazXvhVK4gcHY4yCa`), a child of the cloud chair (`session_01FbPLbejcfwX5nii12VM673`) under the owner's full delegation. Brief: `docs/allegiance/BRIEF-ALLEGIANCE-CAR3-2026-11-08.md` on `origin/lane/chair-2026-11-08` (the integration copy plus the chair's four late rows). Branch `lane/allegiance-car3-2026-11-08`, cut from car 1's final tip `7395b5dab`. Every figure is **CONFIRMED** (read from a named command's output) unless marked **PLAUSIBLE**.

## 0. The base

- Cut from `7395b5dab` (car 1's hand-back tip, rev-parse confirmed at 23:14 UTC).
- `7013bbb2f` merged `origin/lane/write-people-2026-11-08` (`ac6c44316`): `dmPowerLines.js` for the panel; the citation roster `dated` 161 + 1 = 162 (`docs/allegiance/WRITE_PEOPLE_2026-11-08.md`).
- The base's reds: §8.

## 1. The commits, one cause each

| commit | what |
|---|---|
| `1b7ef4814` | `src/domain/people/patronage.js :: patronageOf`, `RULING_PATRONAGE_TUNING` (draft row), `tests/domain/people/patronage.test.js` (I-6, I-7, red-first) |
| `62cc95004` | the tuning inventory refrozen through its ritual |
| `e9070d614` | **the bands' cause**: `ALLEGIANCE_TUNING.organizedCrime` 0.10 → 0.05 (generator move, UNSIGNED) |
| `6ce72a3ce` | the tuning inventory refrozen |
| `7013bbb2f` | write-people merged |
| `6bce9b415` | the DM panel: `patronage.js :: dmPowerViewOf`, `WhoRunsThisTownPanel.jsx`, the `PowerTab.jsx` mount; the W7 test and I-10's car-3 arm, red-first |
| `60a9fa111` | the PDF's DM section (`WhoRunsThisTown.jsx`), `viewModel.js`'s opt-in `dmLayer` |
| `a63effa93` | **the bought watch** on the local axis (late row 1); corruption.js leaves the dormant list |
| `b0080394c` | the wiring census re-taken through its door |
| `ea94d85c1` | the edge-shared bundles rebuilt after `e9070d614` |
| `78d60e47c` | `institutionTable.js`'s drifted cite re-addressed to its symbol |
| `b0dbfe4b2` | this record; the citation roster 162 → 163 |
| `2022fbb2a` | the patronage soak arms take the 300 s slice budget (a timeout under load) |
| `8567f490d` | **J-10 amended by cause** (the chair's ruling): the handler deal goes round the pool (generator move, UNSIGNED); J-10 bracketed and the front target corrected in the design |
| `880cc6217` | the edge-shared bundles rebuilt after `8567f490d` |

## 2. The strength-reader census (J-9), with a denominator

An Explore seat swept `src/` for every reader of a power's numeric `power` (excluding membership and allegiance `power` names): **111 readers** — GENERATOR 20, WRITER 16, SIMULATION 24, DM-DISPLAY 19, PUBLIC 1 (`src/foundry/journalPages.js :: powerPage`), AMBIGUOUS 31 (a display reader shared by the public dossier or the player view, a module used both at birth and on screen, or a module nothing imports).

**Disposition (a STOP, default applied; RULED by the chair: the default stands):** all 111 stay on the BASE figure; only the two new DM surfaces read `patronageOf`. Why: (1) the generator, writer and simulation readers produce stored data, and J-9 / I-7 forbid patronage there; (2) the existing display readers are shared with player and public surfaces — `PowerStrata.jsx` renders on the public dossier and the player view, and `viewModel.js :: powerSlice` feeds the Foundry journal — so re-pointing any of them would publish a hidden power's boost (§8 of the design). The design's own reader list (§3.3: the Power tab's DM layer, the dossier's evidence sentence, the DM view, the derived capture state, which reads ranks) is exactly what this car built. The chair's ruling names the 19 DM-display and 31 ambiguous readers as ROWS FOR A LATER DM/PUBLIC SPLIT of the display readers (not this car):

- DM-display (19): `src/domain/dossier/powerStrata.js :: pushPower`, `:: rulingChainOf`, `:: outrankingRivalOf`; `src/domain/dossier/powerSupport.js :: powerIndex`, `:: backingLedger`; `src/domain/dossier/dossierSearch.js :: push`; `src/domain/display/institutionBackingFaction.js :: institutionBackingFactionName`; `src/domain/display/warResolve.js :: readLeadership`; `src/domain/display/stateProse/powerStateProse.js :: governingSharePoolKey`; `src/components/new/dailyLifeLogic.js :: extractSettlementContext`; `src/pdf/lib/viewModel.js :: summarySlice`, `:: powerSlice` (also feeds Foundry); `src/pdf/lib/headlines.js :: powerHeadline`; `src/pdf/sections/PowerStructure.jsx :: PowerStructure`, `:: FactionCard`; `src/domain/magicProfile.js :: deriveLegality`, `:: deriveInstitutionalControl`, `:: deriveReligiousAcceptance`, `:: deriveRoles`.
- Ambiguous (31): `src/components/new/tabs/power/PowerStrata.jsx :: TheFactions`, `:: FactionRow` (public dossier too); `src/components/new/SummaryTab.jsx :: FactionBar`, `:: SummaryTab` (unimported); `src/generators/aiLayer.js :: extractFullContext`; `src/generators/crossSettlementConflicts.js :: engagingFactions`; `src/domain/rulingPowerCoup.js :: coupContenders`; `src/domain/spatial/cohesionWeave.js :: structuralLensOf`; `src/domain/dossier/powerSupport.js :: dealDoubledNiches`; `src/domain/dossier/faithReading.js :: religiousFactionOf`, `:: factionLine`; `src/domain/causalState.js :: deriveRulingAuthority`, `:: deriveFactionPower`, `:: deriveLawOrder`, `:: deriveCriminalOpportunity`, `:: deriveReligiousAuthority`; `src/domain/explanation.js :: explainFaction`; `src/domain/contradictions.js :: detectOrphanedFactionPower`; `src/domain/dailyLife.js :: deriveDawnWork`, `:: deriveOutsiderImpressions`; `src/domain/capacityModel.js :: factionPower`; `src/domain/causalViews.js :: viewFaction` (unimported); `src/domain/counterfactual.js :: manualMutate` (unimported); `src/domain/hookEscalation.js :: deriveEscalationClocks`; `src/domain/simulationSpine.js :: deriveRealPower`; `src/domain/districtProfile.js :: inferDominantFaction`; `src/domain/townCartography/cartographyMorphology.js :: powerConcentration`; `src/domain/factionProfile.js :: deriveFactionProfile`; `src/domain/crisis/crisisCast.js :: instigatorCandidates`; `src/domain/people/allegiance.js :: criminalPowersOf`; `src/lib/structuralFingerprint.js :: extractSettlementFingerprint`.

## 3. Patronage (§3.3)

`patronageOf(settlement)` → `{ ruler, rulerBase, powers: [{ power, base, raw, boost, effective, bound, hidden, patrons }] }`, one row per power other than the ruler that a face of the ruling three belongs to (openly, or through `hiddenMembershipOf`). `boost = Σ byRank[rank] × share × base`, bounded by `cap·base` and `max(0, ruler − ceilingGap − base)`; a power above the ruler at base gains 0. Nothing is written. `effectiveStrengthOf` is its one-power view.

The bands on the soak 1,000 at the tip (`scratchpad walk.mjs`, `patronageOf` itself):

| measure | the design's §0 | band | the tip | verdict |
|---|---|---|---|---|
| towns touched: a ruling-three face holds another power (REACH; the chair's ruling: the band counts reach) | 265 | 260–270 | **265** open; **289** with the hidden allegiances | inside (open reach); the hidden reach recorded beside it |
| towns with a boost > 0 | — | — | **195** | — (J-9's above-ruler rule zeroes 96 powers) |
| median boost | 0.99 points, 7.5% | ≤ 1.2, ≤ 8% | **0.75 points, 6.0%** | inside |
| boosted powers passing the ruler (I-6) | 15 uncapped | 0 | **0** (and 0 on the golden 525) | inside |
| hidden boosts | — | — | 25 (1,000), 9 (525) | — |

## 4. The invariants, red-first then green

| # | where | red-first (the plant) | green |
|---|---|---|---|
| I-6 / I-7 | `tests/domain/people/patronage.test.js` | the module storing its uncapped effective (`f.power = base + raw`): 3 of 6 red | 6 / 6 |
| W7 surface | `tests/components/whoRunsThisTownPanel.test.jsx` | the mount's DM gate removed: 1 of 3 red | 3 / 3 |
| I-10 (car 3) | `tests/security/allegianceVeil.pglite.test.js` | `dmPowerViewOf` writing its lines onto a power row: red | 6 / 6 |
| the PDF layer | `tests/pdf/whoRunsThisTownDm.test.jsx` | `dmLayer` defaulted on: 1 of 3 red | 3 / 3; tests/pdf 502 / 502 |
| the bought watch | `tests/domain/corruptionDuality.test.js` | the re-keyed file run against the parent's code: 4 red | 130 / 130 with the taste walker, the gauntlet, the I-15 walker |

Car 1's veil pin (a receipt STORED on a power row is public) stays green and unloosened.

**The veil walk** (`toPublicSafe` over every town; the DM view's strings: every boost line, every lends line, every "answers to {guild}"): soak 1,000 — 536 strings, **0** on the public page, 0 `allegiance` keys, 0 stored patronage; golden 525 — 550 strings, **0**, 0, 0.

## 5. The DM view (§9)

The Power tab mounts `WhoRunsThisTownPanel` beneath the criminal underside (`PowerTab.jsx`'s touched lines, for MERGE-TRAIN beside OWNER-WORDS-DOSSIER's governance section: the import at line 25 and the mount block at lines 460–464 of this tip — the UNDERSIDE region only), only when `!publicDossier && !playerView`. The PDF prints the same blocks in the Power Structure chapter, from `vm.dm`, which `buildViewModel` builds only when the caller passes `dmLayer: true` (SettlementPDF, the DM's own dossier); the Foundry journal builds its own view model without it. The blocks: the ruling three · who answers to whom · the fronts · the hall · the boosts; "who hunts whom" (car 4) is a mounted, empty, hidden slot on screen and absent in the PDF.

**The hall block reads today's stored `criminalCaptureState`** with `CAPTURE_LINES`' rung line (variant 0, the receipt in rank words; a 'capture' rung with no agent in the three takes variant 2, the only one that names no agent). **RE-READ AT CAR 2'S TIP**: when car 2's `hallCaptureOf` owns the rung, `patronage.js :: hallOf` reads its receipt instead. Car 2 had not pushed at this car's proof.

**Lines wired, FOR THE OWNER'S VETO.** WRITE-PEOPLE's sentences (`dmPowerLines.js`): PATRONAGE_LINES open and hidden — variant 0 in the boosts block (it carries the figure), variant 1 beside the head, the third and a steward, variant 2 beside the second; CAPTURE_LINES as above. This car's own words: `HANDLER_TIE_WORDS` (7: "a silent partnership", "a patron no one names", "sworn to the cause", "held over them: a debt / a secret / a past crime / someone they love"), `VIA_WORDS` (3, allegiance.js's receipt words: "protection and decisions", "a place for the money and the goods", "information and small favours"), and the panel's labels: "Who really runs this town", "For the DM only. Nothing here appears on a player view or a shared page.", "The ruling three of {ruler}", "Who answers to whom", "led by", "handled by", "brings", "The fronts", "fronts for", "The hall", "The boosts", "{base} on its own, +{boost}, {effective} in all", "answers to {guild} through {handler}", "also {rank} in {power}"; the PDF's kicker "FOR THE DM ONLY".

## 6. The bands of car 1 (late row 4): measured per term, one dial tuned, two rules to the chair

The instrument is car 1's (agents ÷ eligible; its tip figures reproduced exactly: 5.7 / 14.4 / 36.6; front 48.1; handler max 10).

| measure | base `4297838f3` | car 1's tip (0.10) | this car (0.05) | band | verdict |
|---|---|---|---|---|---|
| no criminal power, crime low / mid / high | 2.6 / 9.3 / 28.4 | 5.7 / 14.4 / 36.6 | **4.5 / 10.7 / 31.2** | base ±3 | **inside** (+1.9 / +1.4 / +2.8) |
| where organized crime reads 1 (210 towns) | — | 30.6% | 25.9% (+4.5 over the term's zero) | up to +10 | inside |
| `via` front / office / retainer | — | 48.1 / 19.9 / 32.0 | 48.5 / 19.9 / 31.7 | front **40–50** (TARGET CORRECTED by the chair's ruling; was 30–45), office 20–30 | front inside the corrected target; office 0.1 under |
| agents per handler, median / max | 1 / 3 (§0.8) | 1 / 10 | 1 / 8; **after `8567f490d` (round the pool): 1 / 5**, handlers above 4 in 32 → 21 → **2** towns | max ≤ 4 | J-10 AMENDED BY CAUSE (the chair's ruling); the 2 residual towns are a STOP (below) |

THE TERMS: in the 230 no-power towns organized crime reads 0.66 / 0.81 / 0.87 (eligible-weighted, by crime band) from the criminal HOUSES alone (76 read 1), so J-5's own formula lifts towns the ±3 band assumed it would not; 75 of the 106 low-crime towns sit at the spawn floor (0.02) without the term, where any term multiplies the rate. Expected rates by the dial (the per-card chance summed): 0.10 → 5.4 / 16.0 / 35.4; 0.05 → 4.1 / 12.2 / 31.1; 0.03 → 3.7 / 10.7 / 29.4; 0 → 3.3 / 8.7 / 26.8. Re-born at 0.05 and at 0.04 (4.4 / 10.1 / 30.5): **0.05 chosen**, the largest round value inside ±3 on all three, realized. THE HANDLER MAXIMUM is the dealing rule: 15 agents over 6 handlers deal 1, 1, 1, 1, 1, 10 (soak1k-100); 32 towns hold a handler above 4 at 0.10, 21 at 0.05. THE CHAIR'S RULINGS: the dial landed; the front target moves to 40–50 (J-7's table is the design's own: a target correction, not a tune; bracketed in the design §5); the handler maximum does NOT move — J-10 is amended by cause to deal ROUND the pool (bracketed in the design §1.5), landed at `8567f490d`. **THE RESIDUE (a STOP, sent to the chair, default: nothing more applied):** two towns still hold a handler with 5 agents — soak1k-537 (a pool of ONE non-boss handler; the guild's boss sits out under J-10's boss-last rule; a "the boss joins when one handler would carry more than 4" reading would make it 3 / 2) and soak1k-849 (the guild's boss is the town's ONLY criminal face: a supply limit no dealing rule cures).

## 7. The bought watch, the leash-only card and THE DORMANT LAW (late rows 1–3)

**The dormant law, the lit run** (`scratchpad dormant.mjs`: the reader corpus's fp-read-2 realm, the statecraft head on, twenty yearly advances, every save read each year):

| tree | covert / revealed / drag, each of 21 readings | cards homed by `npcHomeInstitution` | spy scandals | mobilizations |
|---|---|---|---|---|
| base `4297838f3` | 0 / 0 / 0 | 0 | 22 | 40 |
| car 1's tip, before the re-point | 0 / 0 / 0 | 0 | 22 | 52 |
| after the re-point (`a63effa93`'s tree) | 0 / 0 / 0 | — | 22 | 52 |

The tip equalled the base before the re-point: no defect (the person arm was already dead at the base — the people car removed the field family it homed by). The realm's 7 agents hold no security house, so it reads 0 after as well (**PLAUSIBLE**: live wherever a watch face is an agent). Non-vacuity, on the soak 1,000 at birth after the re-point: **53 towns** hold a bought watch (59 institutions; drag summed 8.85), against **0** before. Mobilizations 40 → 52 is car 1's J-19 residue (its §8), not this cause.

**The re-point:** a security house's FACE holding a local hidden allegiance (a house set — never the foreign leash), not ousted, not exposed (`corruptMarkOf`). Both functions moved to `corruptionLeash.js`; the names and `PATRONAGE_TUNING` keep. corruption.js leaves the dormant list (17 → 16).

**The leash-only card** (`scratchpad leash.mjs`: fp-read-2 with the corruption web lit, 1,040 weekly ticks, read at each year's end): **1** card held a web leash with no local allegiance (year 1), 1 leash in all; **decision: the sidecar** (`npcStates[id].corruptionLeash`), no leash-only `allegiance` persisted on the card — about one card per 1,000 ticks does not earn a persisted shape. PLAUSIBLE caveat: a leash minted and severed inside one year is not seen by a year-end read.

## 8. The generator moves, for the merge's record (UNSIGNED)

Measured stage to stage with `scripts/audit/landing-stage.sh measure` in a clean worktree of each commit, against the previous measurement.

| cause commit | gm /525 | fence /360 | herald | prose /1,050 | witness /8 | pdf /18 |
|---|---|---|---|---|---|---|
| `e9070d614` organizedCrime 0.05 (vs `62cc95004`) | **170** (town 2, city 84, metropolis 84) | **128** (village 2, town 13, city 54, metropolis 59) | rows 450 → 443: 2 moved, 44 added, 51 removed | **46** | 0 | 0 |
| `e9070d614..60a9fa111` the merge, the panel, the PDF section (vs `e9070d614`) | 0 | 0 | 0 / 443 | 0 | 0 | **0** |
| `a63effa93` the bought watch (vs `60a9fa111`) | 0 | 0 | 0 / 443 | 0 | 0 | 0 |
| `8567f490d` the round-robin deal (vs `a63effa93`; nothing between moves the generator) | 0 | **11** (town 2, city 6, metropolis 3) | 0 / 443 | 0 | 0 | 0 |

The PDF golden view-model snapshot does not move: the DM rows ride the opt-in `dmLayer`, which the snapshot (and Foundry) leave off.

## 9. The proof

PROOF_SECTION

## 10. Judgment calls (each with the default applied; vetoable)

1. **The reader census's disposition** (§2): no existing reader re-pointed; the new DM surfaces read `patronageOf`.
2. **I-6 read with the base's own position**: a power whose base already stands within `ceilingGap` of the ruler (or level with it) gets 0 and keeps its base; I-6 holds as "the boost never lifts a power past `ruler − ceilingGap`".
3. **The steward**: the rank-1 face of a ruling row carrying the `vacant` modifier (`powerStrata.js :: rulingChainOf`'s own vacancy fact) counts at `steward`; measured 0 towns on the 1,000 with no rank-1 face.
4. **A patron's share of a bounded boost** is its raw part scaled by `boost / raw`; the boosts block's sentence is the LEAD patron's.
5. **`dmPowerViewOf` lives in `patronage.js`** (in the manifest), not a new module.
6. **The PDF mount lines outside the manifest**: `SettlementPDF.jsx` (the opt-in) and `PowerStructure.jsx` (the mount) — over a `vm` field every caller carries, since Foundry builds from the same view model.
7. **The bands**: `organizedCrime` 0.05 tuned (§6); the front split and the handler maximum sent to the chair, RULED (§6).
11. **The round-robin's slice arm reads the pool size from the handlers the agents were dealt** (a pool deals to its first min(agents, handlers)), so the check needs no generator import.
8. **The bought watch moved module** (corruption.js → corruptionLeash.js) rather than an injected reader: the eager module may not import the allegiance reader; first paint loses the two functions.
9. **The leash-only card: the sidecar** (§7).
10. **No pull request** (the operating standard's rule 24a; the brief).
