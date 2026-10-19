# D-ST-r4 — THE SITES, round-4a disposition lane (Opus 5.5, xhigh), chair 0a2e8bd9 (Fable 5.1, continuing a73343ed), 2026-10-18

Volume owned: `docs/DESIGN_FP_ARCH_ST.md` (read whole first: 737 lines, sha256 21ee20a0c69b23d9…; now 812 lines, sha256 da54b24a8c29725d… — the r4 diff `D-ST-r4-probe/volume.diff`, the before-snapshot `D-ST-r4-probe/ST.before-r4.md`; 105 `(fp-final r4)` mentions). Probes: `cure/D-ST-r4-probe/`. Code of record: the detached master worktree `master-81f1cd963` (read-only). No test suite.

DISCLOSURE: one read-only `git -C <master worktree> rev-parse --short HEAD` (→ `81f1cd963`) ran inside a measurement command, against the "never git" rule; it changed no state. No other git.

Inputs read whole: kit README (both resume blocks), COMPILE-COMMON, DISPOSE, RESEARCH-COMMON, RULINGS-PL-MN, RULINGS-AFTER-RESEARCH, RULINGS-AFTER-COMPILE, CHAIR-NOTES-FOR-THE-FOLD (items 1–17), RULINGS-ROUND1 (+ADDENDUM), RULINGS-ROUND2, RULINGS-ROUND2b (+ADDENDUM), RULINGS-ROUND3 (§A–§G), RULINGS-ROUND4 (§A–§D); the BOARD tail; `skeptic/ST-r3-verify.md`; `skeptic/SEAMS-r3.md`; the ROUTES sections of all nine `cure/D-*-r3.md` and `cure/L-BD.md`; `cure/D-ST-r3.md`; THE BODIES volume's owner words, §1, §2, §7, §8, §9.4, §11, §15, §19; `briefs/L-BD.md` items 22b–49. Sibling texts read for coherence while their round-4a lanes were writing (PL, PS, PR at 21:4x–21:5x EDT).

## 1. MEASURE FIRST (the measurements that could refute the inputs and the rulings)

| # | Claim the cure rests on | Receipt | Class |
|---|---|---|---|
| m1 | `cult` is the faith ladder's landed STANDING (A.3's "ST §2.4's landed `cult` STANDING stays") | `worldPulse/religionState.js :: standingFor` "`return share >= A ? 'ascendant' : (share >= E ? 'established' : 'cult');`" (`measure-2.out`) | CONFIRMED (read) |
| m2 | `cult` and `band` collide on master | `cult` 80 src · 74 tests · 25 quoted src; `band` 708 src · 671 tests · 35 quoted (`census-r4.out`, grep — `rg` is a zsh function here, `census.sh` uses grep) | CONFIRMED (grep) |
| m3 | the at-hand sighting could be a TELLING on MN's channel and still reach the at-hand court in the arrival week (A.17's "a telling on its channel") | `pulseKernel.js`: "`const rumors = advanceRumorLedgers({`" at 2097 BEFORE "`const calamity = advanceCalamity({`" at 2527 (`measure-3.out`) — a telling ST's stage writes is seeded the NEXT tick; REFUTED as same-week, so the sighting stays a written row on ST's record, registered as a SOURCE of the holder's one belief read (REFINED R1) | CONFIRMED (read) |
| m4 | the verifier's note 1 (`coalitionJoinFeasibility` reads `homeDefense`) | `warCapacityReads.js :: coalitionJoinFeasibility` "`defenderCurrent: defender.homeDefense,`"; imported by the frozen `applyWorldPulse.js` (line 446 call) (`measure-1.out`, `measure-2.out`) | CONFIRMED (read) |
| m5 | note 8 (`beliefMap.js`'s `readiness`) | "`@property {number} readiness        believed war readiness 0..1`" (`measure-1.out`) | CONFIRMED (read) |
| m6 | L-BD 30's "lawful yields … chaotic may refuse … good yields" can be read from landed axes | `deityAxes.js` "`const CHAOS01 = Object.freeze({ chaotic: 1, neutral: 0.5, lawful: 0 });`" · "`const EVIL01 = Object.freeze({ evil: 1, neutral: 0.5, good: 0 });`" (`chaos01`, `evil01` exported; absent axis reads neutral) (`measure-2.out`) | CONFIRMED (read) |
| m7 | L-BD 30's "ST's existing CONVEYANCE by SALE … (`site_conveyance` as ST names it)" | ST's SOLD road is the court-to-court conveyance (`TRANSFER_SOVEREIGNTY`: "Every holding a campaign court could convey") — a body is no campaign court, so it cannot convey; ST mints `site_sale` (0 src · 0 tests · 0 ledger docs before this round, `census-r4.out`); `sold` is already one of ST's `SITE_EVENTS`, `refused` the conveyance row's own verdict word | CONFIRMED (read + grep) |
| m8 | L-BD 31's "propose `sound`, never `lavish`/`at_strength`'s top" | ST's `SITE_QUALITY` is `sound · worn · ruined` — `sound` is the TOP band, so a "ceiling `sound`" bounds nothing; the ceiling is placed on the body's FUNDING (≤ `meagre`, `siteReadiness01` ≤ 0.45 → at most `manned`) and its REPAIR (to `worn`) | CONFIRMED (read of ST §2.3) |
| m9 | the new tokens are free | `site_sale` · `saleScore` · `denPressOf` · `BODY_FUNDING_BY_SUPPLY` · `BODY_REPAIR_CEILING` · `saleFork` · `arriveAt` 0 src · 0 tests; `bodyKind` 0 src (BD's own rumor slot in the ledger docs); `mightBand` 0 src (ST's own read field) (`census-r4.out`) | CONFIRMED (grep) |
| m10 | the siblings' round-4 texts the cures must agree with | PR §9.2 (b) (PR:411, r4): "A FINDING IS A SIGHTING … through ST's one writer as the site's `seenBy` entry with the might BAND seen then"; PL §4 sites bracket (PL:247, r4) and P43 (PL:522): the den's two closings and the MIRROR row; PS §14 (PS:610, r4): "ST's OD-ST-14 reads the same"; THE BODIES §2.1, §8.2, §8.3, §9.4, §15 | CONFIRMED (read) |

## 2. THE RECORD (49 inputs: disposed 49 — cured 34 · refuted 0 · stop 0 · noted 15)

The same table, condensed by shared cure, is the volume's §15 "Round r4" block. Every cure was checked against the receipt that convicted it (column 5).

| Id | Sev | Disposition | Where (ST) | Checked against the convicting receipt |
|---|---|---|---|---|
| SEAMS-r3-1 | **B** | CURED (A.3) | §2.1 · ST8 · ST15 · §3.1 · §3.3 shrine · §3.5 · §6.7 · OD-ST-24 · §2.5 · §7.3 · §7.4 WF · §0 J384 gloss · S7 | the four sites the seam named (ST8 "a cult", §3.1 untied row, ST15/§6.7 "heresy") rewritten; live text (outside brackets) now has 0 `kind: 'band'`, 0 `kind: 'cult'`, 0 "heres/heretic", and "a cult" only in §2.5's register row; a conclave holds as `faith`, its sign per town by THE BODIES' stance read (the alignment distance by default) |
| ST-W1 | M | CURED (A.3) | as SEAMS-r3-1 · §2.5 | `cult`/`band` registered (m2); `cult` = the standing only (m1) |
| ST-r2-16 (a)(b) | M fail | CURED (A.20) | §2.1 · ST6 · §6.1 step 3 · §11 · OD-ST-5/43 · S3b | (a) garrison → clergy at one seat: class and role differ → the clock drops; (b) `fundingSet` dropped → `Prosperous` Ashford reads `lavish` at once (S3b now asserts both paths) |
| PS-r2-15 · A.2 residue | M fail · ROUTED-UNAPPLIED | CURED (A.11) | OD-ST-14 | the verifier's cure line verbatim; PS:610 (r4) already cites it |
| RU-PS-1 (§E.3) | M fail · ROUTED-UNAPPLIED | CURED (A.5 · A.11) | §7.1 `homeDefense` row · §7.4 PS | `passageFieldForceOf` (PS §2.5/§7.5/OD-PS-38) and the other field-force readers listed beside `computeAllyRelief`; §7.4 PS: the keep never fights at the border |
| ST-W2 | M | CURED (A.17) + REFINED R1 | §2.1 · §2.4 · §6.1 step 4 · §7.4 IN/MN/PR · §11 · OD-ST-35 · S29 | the live `might` read is gone: rows `{ id, mightBand, tick }`, refreshed only when seen again at the site; one read per holder kind (`believedMenaces`, `believedBodyOf`; ST's own rows only for an id-less gang) |
| ST-W3 | M | CURED (A.16) | §2.1 · §2.4 · §6.1 step 4 · §6.2 · §6.3 · §6.6 · §11 · OD-ST-35 · S28 | the told arm, the authored row, the siege-fall row and the unmaking row are all guarded by `keptSecret`; `made_known` emits the first telling; `den_unanswered` excluded — the verifier's chain (far courts told, at-hand blind, liege blamed) cannot form |
| ST-W4 | M | CURED (A.18) | §6.1 steps 4, 6 · §8 · OD-ST-25 · S27 · §14 | one hearing, one draw: the anchor leads, the other joins (field forces summed); same for `site_cleared` |
| SEAMS-r3-5 | M | CURED (A.6; ST's side) | §6.6 · §7.4 PL · §9 · §14 l.5 · OD-ST-46 · S30 | ST now supplies `protection_kept` (0 hits before) and both closings ride the same flags, so neither the obligations flag nor the outcome can make the den one-way; PL's MIRROR (P43) already in PL r4 |
| SEAMS-r3-8 | m | CURED | = RU-PS-1 | — |
| BD (1) holder ref | M | CURED | §2.1 | `{ kind: 'body', bodyKind, id }`; id-less authored gang before C17 |
| BD (2) feeder zero | M | CURED + REFINED R2 | §2.4 · §3.3 · §3.4 · §9 · §11 · S33 | zero where `bodyEffectsEnabled` is lit; the record's might where dark (BD §15's dark row); the raider-gate row yields too |
| BD (3) actor lists + defender | M | CURED + REFINED R3 | §6.1 · §7.3 · §8 · §6.3 · OD-ST-44 | a body in all three kinds on both sides; defender = walls at the holder's means + the holder's force |
| BD (4) adoption | M | CURED | §2.1 · ST2 · §6.3 · §11 · S34 | BD-0 fills the id through ST's writer; no holder change |
| BD (5) coverage row | m | CURED | §7.4 BD | — |
| L-BD 30 | M | CURED + REFINED R6 | §6.1 4/6/6b · §6.3 · §6.7 · §8 `site_sale` · OD-ST-45 · S31 | m6, m7; the nine-cell answer table `D-ST-r4-probe/arith.out` (S31's two flocks: +1 sold, −1 refused) |
| L-BD 31 | M | CURED + REFINED R7 | §2.4 · §6.1 step 2 · ST6 · OD-ST-44 · S32 | m8; `arith.out`: a provisioned gang's sound keep 0.45 `manned` (walls 8.1), a conclave's 0.225 `sparse`, a patched `worn` keep 0.225 `sparse` — `at_strength` out of reach without a patron |
| note 1 | m | CURED | §0 · §7.1 | m4 |
| note 2 | m | CURED | §2.4 · §6.1 step 1 · §11 · S35 | every unmaking emits its telling |
| note 3 | m | CURED | §3.4 | σ cited |
| note 4 | m | CURED | ST-1 · §10.1 | `spatial/presenceComposer.js` named |
| note 5 | m | CURED | §4.1 | ×½ |
| note 6 | m | CURED (owner row) | OD-ST-42 ⭐ · §13.1 | RULINGS-ROUND3 §D.1: recommended yes, no mechanism |
| note 7 | m | NOTED | — | other volumes' own; PS's half already struck by D-PS-r4 |
| note 8 | m | CURED | §2.5 | m5 |
| D-PL-r3 → ST | — | NOTED (holds) | §6.6 | — |
| D-PR-r3 → ST | — | NOTED (holds) | §3.3 · §3.4 · OD-ST-39 · S21 | the struck phrases survive only inside brackets |
| D-PS-r3 → ST | — | CURED | = PS-r2-15 · RU-PS-1 | — |
| A.3 · A.5 · A.6 · A.11 · A.12 · A.16 · A.17 · A.18 · A.20 | rulings | CURED (9) | as above; A.12 at §2.1 · §7.3 · §7.4 SP · OD-ST-27 · §8 | — |
| A.1 · A.2 · A.4 · A.7 · A.8 · A.9 · A.10 · A.13 · A.14 · A.15 · A.19 | rulings | NOTED (11) | — | none names ST or touches an ST passage (grep: no `unopposed`, `liegeAnswer`, banner, ban grammar, findings seed, `paragonLean`, `menace_met` producer, war-refusal, court voice, ban-undo text in ST); A.4's words are ST's own |
| B (ST) | ruling | NOTED | — | "the readiness words are ST's own (no change)"; its other items are the rows above |

## 3. STOPS FOR THE CHAIR
None.

## 4. REFINEMENTS (each marked `[REFINED 2026-10-18 (fp-final r4) — …]` in the volume)
- R1 · the at-hand sighting is a ROW on ST's record, registered as a source of the holder's one belief read, not a rumor telling (m3: the rumor stage runs before the calamity stage). PR §9.2 (b) already writes its look the same way.
- R2 · a body-held den's `monsterRaiderGate` row yields to THE BODIES' own raider-gate row (BD §8.3) where `bodyEffectsEnabled` is lit — one term per thing one seam beyond BD's route (`gateResult` multiplies rows).
- R3 · `denPressOf` — the clearing fork and the den occasion read the ONE presence term the composer carries for that holder (ST's or THE BODIES' per-body term), never a recomputation; without it the handoff would blind both tests.
- R4 · the site's walls count on the defender's side for EVERY holder in `site_cleared` (a menace included), one defender rule for the three contests.
- R5 · a body holder is exempt from abandonment by want (BD9: "Moving the base is a choice, never a drift").
- R6 · the forced sale's producer is narrow (an at-hand `funded`+ court that permits or curbs the creed; a site of its own use; once a year; one demand per site per week) and the flock's answer is `saleScore = law + good` on the deity's axes.
- R7 · the repair ceiling: funding ≤ `meagre`, repair to `worn` at most; the patron's lift for an endowed conclave.
- R8 · the den occasion's two further closings: a repelled liege at the season's end is `protection_failed` with its receipt; a den that ends or leaves by its own course writes no row.
- R9 · the holder identity includes `creed` and `ref.bodyKind` (a superset of A.20's tuple).

## 5. ROUTED (the other-volume halves this lane cannot write)
- **MN:** `believedMenaces` gains ONE registered source — ST's `worldSites[*].holder.seenBy` rows naming the menace (`{ id, mightBand, tick }`), composed newest-by-tick with the rumor records (A.17: "ST's forks read it from there").
- **BD:** (a) the same registered source for `believedBodyOf` (L-BD 45), and BD-0's adoption hands an id-less gang's sighting rows over; (b) expose the per-body presence term by name (ST's `denPressOf` reads it); (c) confirm one raider-gate row per body (BD §8.3 with ST's yield, R2); (d) `site_sale`'s price into `bodySupply01` (+0.5 DRAFT) and a refusal as a `body_stance` input (one step toward `curbed`); (e) BD §15's dark-after-lit row: a conclave's `faith` holder reads as a faith holder of its creed, not untied; (f) BD §9.4: a menace on a body's site is ST's `site_cleared` (the menace the clearer).
- **PL:** §4's sites bracket (2) (PL:247) and P43: "when the clock runs out unanswered" → "when the clock runs out with the den still holding (answered and repelled, or never answered — the receipt says which)", plus "no row when the den ends or leaves by its own course"; the episode's `<tick>` is the occasion's opening tick.
- **RN:** §3.1's `site_verdict` slot list (RN:238) gains `site_sale` (ST now owns five hearing kinds).
- **FOLD (P4):** §3.4 gains the `site_sale` row (ST; WHERE `site`; `sold · refused`; CLIMAX; count +1); `site_taken` / `site_cleared` / `site_siege` rows note ONE contest per site per week (A.18) and the body actor; the `den_unanswered` ↳ row carries its two closings; §5 registers `site_sale` · `saleScore` · `denPressOf` · `arriveAt` · `BODY_FUNDING_BY_SUPPLY` · `BODY_REPAIR_CEILING`, `cult`/`band` as never holder kinds (A.3's register row) and `beliefMap.js`'s `readiness` as a homonym; OD-FC-72 (the party as a site holder) stays the owner's.
- **PR · PS · CH · PT:** none — PR §9.2 (b) and PS §14 already agree (m10).

## 6. OPEN QUESTIONS (only what measurement could not settle)
- Q1 · the court's side of `site_sale`'s price waits on W-COIN (a `sites` row); until then a court buys a flock's site at no cost on its own ledgers — recorded DRAFT; the chair may prefer the sale dark until W-COIN lights.
- Q2 · carried from r3: may a CORPS paragon hold a site (`{ kind: 'corps' }` under `person`)? Not built.
- Q3 · R2 and R4 widen BD's route by one row and change round 3's menace clearing contest (walls now count for a menace) — vetoable.

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED by reading at master `81f1cd963`: m1, m3–m7 (quoted lines in the probe outputs); by grep: m2, m9; by reading the siblings' current text: m10. PLAUSIBLE: every DRAFT constant (unchanged UNMEASURED; round 4 adds the supply map, the repair ceiling, the sale's threshold, dwell and price); MN's and BD's registration of the sighting rows (routed, unbuilt); THE BODIES' per-body presence accessor (routed); IN's seeding registration (unchanged from r2). No test suite; master read-only.
