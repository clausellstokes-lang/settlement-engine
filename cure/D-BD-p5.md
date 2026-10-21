# D-BD-p5 — THE BODIES, P5c dispositions of THE COMPLETENESS CRITIC's findings (chair 6eb7b5b6, Fable 5.1; seat Opus 5.5; 2026-10-20, started 15:02 CDT)

Owns: `docs/DESIGN_FP_ARCH_BD.md` (sole writer this round) · this file · `cure/D-BD-p5-probe/`.
Inputs: P5C-5 (WC-BD-75 · 76) · P5C-9 (WC-BD-100) · P5C-23 (WC-BD-13 · 51 · 82) · P5C-13 (WC-BD-69) · P5C-15 (WC-BD-34 · 55) · ROUTED-UNAPPLIED 9 RESIDUE→BD (`arriveAt` registers only) · RULINGS-P5 §C.25's BD items · (A.2's BD bracket: ES-2b OPENED).
Rulings applied: `briefs/RULINGS-P5.md` ADDENDUM §A–§C (the latest wins).

## 0. STATUS — COMPLETE 2026-10-20 15:2x CDT (outcome: disposed 13 of 13 — cured 11 · refined 1 · noted 1 · refuted 0 · stop 0)
- [x] read BD whole (l.1–1358, 2026-10-20 15:0x–15:2x CDT)
- [x] measure first (m1–m11, §1)
- [x] cures applied (groups A–K below)
- [x] cross-volume greps (`xvol-greps*.out`; §6)
- [x] cure record appended to BD §20.5; §19.0d routes; §21 P5 line

## 1. MEASURED FIRST (master `81f1cd963`, the code of record; READ-ONLY; every row CONFIRMED by reading the cited symbol unless marked PLAUSIBLE)
Process note: one read-only `git log -1` was run on the code-of-record worktree to confirm HEAD `81f1cd963` (no mutation) — a deviation from "never git", recorded. Nothing else touched git; no test was run. BD backed up before any edit: `D-BD-p5-probe/BD.pre-p5.md` (sha256 `8b0a2d00…62fd`, `BD.pre-p5.sha`).

| m | What | Receipt (`path :: symbol`, quoted) | Consequence for the cure |
|---|---|---|---|
| m1 | ES's ONE covert decider is the doctrine stage's cadence | `worldPulse/espionage/espionageDoctrineStage.js :: dispatchCadenceFor` — its header: this stage answers "does this court want to send somebody, and how sure does it need to be". It does NOT mint a row; its roll "`const roll01 = hash01(key);`" on "`es.dispatch.${text(courtId)}.${Number(tick) \|\| 0}`" (`dispatchCadenceKey`); 115 eff lines (`efflines.mjs`) | P5C-5's car lives in THIS file (BD-9's owned unit), keyed on THIS stream (L1: keyed hashes, zero new PRNG streams); headroom 685 |
| m2 | the decider has NO production caller; no free-standing covert row exists | same file header: "a FREE-STANDING spy row still does not exist in this tree … the absence of a production caller is DECLARED here"; ES design l.1809 "blocked on a DISPATCHER wave nobody has chartered" | the offer CANNOT ride an ES errand row; it is ONE EVENT (macro, like the delivery); BD's stage is the CALLER of ES's decision for the `sponsor_body` objective (never the decider) — REFINED R1 |
| m3 | ES's doctrine words are the sponsor's character | `espionageDoctrine.js :: readEspionageDoctrine` → `targeting ∈ DOCTRINE_TARGETINGS = ['all_courts','foes_only','rivals_and_foes']`, `method ∈ ['lawful','lawless']`, `frequency01` | the objective's alignment gate reads ES's words (method lawful ⇒ only a flock of its own creed; lawless ⇒ any client; targeting filters the target court) — never a second alignment read |
| m4 | `sponsor` 0 in ES and IN volumes; 0 `sponsor_body` anywhere | `rg -w` (`census-p5b.out`); `census-p5.out`: `sponsor_body` src 0 · tests 0 · master docs 0 · ledger docs 0 | WC-BD-75 confirmed; the token is FREE |
| m5 | THE VISIBLE WALLS BAND exists, derived, public | `mapProfile.js :: deriveMapProfile` → `outputs.defensiveTerrain ∈ exposed · open · mixed · sheltered · fortified`; `deriveDefensiveTerrain`: "`if (hasWalls && defense >= 55) { idx = Math.max(idx, 4); …'Walls plus high readiness yields fortified terrain.'`" · "`else if (hasWalls) { idx = Math.max(idx, 3); … 'Walls present; sheltered.'`"; the town map draws it (`townMapModel.js`: "`readiness: DEFENSIVE_BANDS[readinessIdx] \|\| 'open'`") | P5C-9's choice read = this band (what the walls SHOW), the walls' rung dropped while the walls institution stands `ruined` (BD14's live collapse, equally visible) |
| m6 | THE LIVE POPULATION WRITER | `populationDynamics.js :: applyPopulationOutcomeToSettlement(settlement, outcome, saveId)` — reads `outcome.populationDeltas`, writes `population` and a `populationHistory` breadcrumb (`reason: outcome.headline \|\| outcome.candidateType`); `fieldManifest.js`: "`pulseWriter: 'src/domain/worldPulse/populationDynamics.js#applyPopulationOutcomeToSettlement'`"; called in BD's own host `calamityKernel.js :: applyExodusToUpdates` (the calamity's exodus on `settlementUpdates`) | WC-BD-51: BD names it; the raid's deaths are ONE population outcome on the stage's `settlementUpdates` channel (BD-Y3), the calamity host's own idiom |
| m7 | the people ledger is dark | `peopleLedger.js` l.42: "⚠ DARK-COMPLETE BY ABSENCE OF CALLERS: nothing under `src/` imports this module" | its `mortality` sink is struck as the raid's writer |
| m8 | HB's twelve classes (ceiling 12, owner-gated growth) | `habit/habitVocabulary.js :: CIRCUMSTANCE_CLASSES` (`faith_contested` · `route_menaced` · `crowding_pressed` …); HB l.821 `faith_contested` "schism, conversion pressure, or a tradition claim is live"; l.824 `crowding_pressed` "the demographic overflow band is `pressed` or `overflowing`"; l.826 `route_menaced` "a route this actor depends on carries live embattlement or toll pressure"; the writer refuses only "`if (!actorId \|\| !action \|\| !isCircumstanceClass(className)) return;`" | WC-BD-13: BD supplies the court grain's class ARGUMENT from these three landed classes; no HB row, no thirteenth class |
| m9 | ST's arrival door only registers | ST l.337: "calls ST's arrival door `siteStage.js :: arriveAt(worldState, siteId, arriverRef, tick)`, which only REGISTERS that arrival … whose per-mover verdict `arrived · held` the body's own door applies in the same chain (RULINGS-ROUND6 B.6)"; ST l.343 "the WINNING arrival is committed by its OWN owner's door (THE BODIES' writer through `arriveAt`'s commit …)" | ROUTED-UNAPPLIED 9: BD's move onto a site is a REQUEST; BD's writer commits only on `arrived` |
| m10 | RN's two fame reads | RN l.184 `fameOf(worldState, actorRef, tick) → { scope, office01, deeds: [{ deedId, scope }] }` (the actor's OWN fame, no observer); l.298 `fameIn` = "fame as belief at one town" (its ROAD arm the town's heard test; its OMNISCIENT/ASPATIAL arm "the observer lies inside the deed's WHOLE projected reach") | WC-BD-34: the gang reads its OWN deeds' reach (`fameOf` + RN's one ring rule `RING_BY_DECAY`), never the candidate town's heard test or `believedBodyOf` |
| m11 | the census for the cure's tokens | `census-p5.out`: `sponsor_body` · `commitArrival` · `body_raid` 0·0·0·0; `spills`/`spill` prose-only in src (0 quoted, 0 key forms — `census-p5b.out`) | each registered in §2.6 |

- [x] group A (P5C-5) applied 15:3x — 16 edits (g_a.py)
- [x] group B (P5C-9) applied — 12 edits (g_b.py)
- [x] group C (P5C-23) applied — 13 edits + 1 escape fix (g_c.py, g_c2.py)
- [x] group D (P5C-13 spill) applied — 10 edits (g_d.py)
- [x] groups E (P5C-15) · F (arriveAt) · H (holderSinceOf REFINED) applied — 15 edits (g_e.py)
- [x] group G (A.2 ES-2b OPENED, BD's brackets) applied — 12 edits (g_g.py)
- [x] group I (header · §2.6 · S62–S66 · OD-BD-63..65 · §19.0d · §20.5 · §21) applied — 7 edits (g_i.py)
- [x] group J (two consistency fixes; R2 REFINED) applied — 2 edits (g_j.py)

## 2. THE RECORD (every input id; BD §20.5 carries the same table)
| Id | Sev | Disposition | Where (BD) | Receipt that convicted → the cure checked against it |
|---|---|---|---|---|
| P5C-5 · WC-BD-75 | MAJOR | CURED (C.5) + REFINED R1 | BD26 · answer · §2.6 · §2.7 s6 · §10.4 · §13 · BD-9 · §14.1 · §19.0 ES/IN · S62 · OD-BD-63 | "`sponsor`: IN 0 · ES 0" → re-measured 0/0 (m4); the offer now has ONE producer: ES's decider + BD-9's car `sponsorObjectiveFor` (m1, m3); its caller BD's stage because the decider has none (m2) |
| P5C-5 · WC-BD-76 | MINOR (merged) | CURED | §10.4 (a)(d) · carriers' choice · §2.6 · BD26 | the two carriers with no ES/IN row are DARK; the choice is among `smuggler` · `cache_drop` |
| P5C-9 · WC-BD-100 | MAJOR | CURED (C.9) | BD12 · §0.1 · §2.5 · §4.2 (5 rows) · §4.3 · §9.2 · BD-4 · S63 · OD-BD-64 | "OUTMATCHES by the defence threshold" (truth) → the choice reads `bodyVisibleDefenceOf` (`mapProfile.js :: deriveMapProfile` `defensiveTerrain`, m5) + the ties' belief; the producer keeps `bodyDefenceOf` |
| P5C-23 · WC-BD-13 | MINOR | CURED (C.23) | §4.4 (a) · BD-10 · §19.0 HB · OD-BD-65 | "HB 0 `bounty`" → BD hands HB's writer three landed classes as ARGUMENTS (m8); no HB row exists or is needed |
| P5C-23 · WC-BD-51 | MINOR | CURED (C.23) | BD22 · §0.1 · §9.2 · B2 · §22 A1 · OD-BD-65 | `peopleLedger.js` l.42 "DARK-COMPLETE BY ABSENCE OF CALLERS" (m7) → the live writer `applyPopulationOutcomeToSettlement` (m6) named, with the outcome shape it reads |
| P5C-23 · WC-BD-82 | MINOR | CURED (C.23) | §2.3 · §2.6 · §13 · §19.0d | "ES 0 · IN 0" → both sources DARK until the fold's ES/IN rows (routed) |
| P5C-13 · WC-BD-69 | MINOR | CURED (C.13) | §10.1 (ii) · §2.2 `spills` · §2.5 · §2.7 s3 · §15.3 · §22 A12 · B9 · S64 · OD-BD-24 · OD-BD-1 | "`bodyHabitat` lists no spill term and nothing persists the draw" → a `spill` part with its decay; the fired tick persisted in a DECLARED `spills` map (⭐ OD-BD-1 widened) |
| P5C-15 · WC-BD-34 | MINOR | CURED (C.15) | §6.8 (e) · §6.8 (a) · §2.5 · S30 · S66 · OD-BD-34 | "another actor's belief record read to decide" → the gang's OWN deeds' decayed rings (`fameOf` + RN's `RING_BY_DECAY`, m10) and `believedStanceOf` |
| P5C-15 · WC-BD-55 | MINOR | CURED (C.15) | §9.5 · §7.1 · §9.9 · §2.5 `bodyOnRoute` · S36 · S66 | "a court DECIDES on the truth-attributed hand" → the outrage reaches the court as a TELLING (`bodyId` slot, rumor road); forks read `believedBodyOf`; attribution stays the receipt |
| RESIDUE → BD `arriveAt` (P5-RULINGS §4 row 9; C.25) | MAJOR-weight | CURED | §2.7 s5 · §5.4 · §9.4 · BD-4 · §2.6 · S65 | "0 `arriveAt` in BD" → BD's move on a site is a REQUEST through ST's `arriveAt`, committed by BD's writer on `arrived` only (ST l.337 · l.343, m9) |
| RULINGS-P5 A.2 (P5W-2's BD half) | MAJOR (owner-gated, ruled) | CURED | BD27 · §2.2 · §0.1 · §9.2 · §9.10 · §12 · §13 · §15.1 · S29 · OD-BD-40 · §22 A14 · (D) | every "DARK until ES-2b" site carries the dated OPENED bracket; the wave order kept |
| RULINGS-P5 C.17 (BD's tenure read) | — | REFINED | §6.8 (c) | reads ST's `holderSinceOf` once ST exports it; the ring's bound until then |
| C.25 other items · P5W-6 | — | NOTED | §19.0d (the chair) | P5W-6 is the chair's ODQ row (routed with the new read); P5W-7 · P5R-n1 the fold's |
Counts: 13 ids — CURED 11 (2 MAJOR critic findings, 1 MAJOR ruled bracket set, 1 MAJOR-weight route, 7 MINOR) · REFINED 1 · NOTED 1 · REFUTED 0 · STOP 0.

## 3. STOPs
None. (R1 is a REFINEMENT inside the car C.5 gives BD-9, measured and marked vetoable: the decider C.5 names has no production caller at master — m2 — so BD's stage calls it for the one objective; the alternative, the offer DARK until ES's dispatcher is chartered, is named on OD-BD-63.)

## 4. ROUTED (the halves this lane cannot write; BD §19.0d carries the same list)
- FOLD (D-FOLD-p5): (a) §3.1 ES INBOX row — BD-9's owned car `sponsor_body` (`sponsorObjectiveFor` in `espionageDoctrineStage.js`; ES's doctrine, cadence, keyed `dispatchCadenceKey(…)+':sponsor_body'`; BD's score `bodies/sponsorObjective.js`), wave BD-9, BD's stage the interim caller (C.5); (b) §3.1 ES INBOX row — the `operative` courier errand and the `by_survey` survey product (C.5 · C.23); (c) §3.1 IN INBOX rows — `temple_alms`' tithe scrutiny (with WF-7) and `by_broker`'s sale of a way (C.5 · C.23); (d) OD-FC-74 ↳ r5 (l.1139) "chosen by BELIEF, where its notoriety as those towns believe it is below the hunted or refused band" → "chosen by the gang's OWN reckoning — no decayed ring of its own deeds covers the town (BD §6.8 (e); P5C-15)"; (e) §5 register: `sponsor_body` · `sponsorObjectiveFor` · `sponsorObjectiveScore` · `bodyVisibleDefenceOf` · `spills` · `commitArrival` · `body_raid` (C.12); (f) §7: ⭐ OD-BD-1 widened by `spills`.
- ES (D-BRACKETS-p5): one insertion-only bracket at §3.12/ES-5a naming BD-9's owned car `sponsor_body` beside the cadence and THE BODIES' stage as its caller until the dispatcher wave lands.
- RN (D-PL-MN-RN-p5): §4.3 — expose the ring test over an actor's OWN deeds (`RING_BY_DECAY` around each deed's place, no heard test; `fameIn`'s omniscient-arm form) as one named read, or admit that arm by argument, for BD §6.8 (e).
- ST (D-PS-ST-PR-p5): export `holderSinceOf(worldState, siteId)` (C.17); nothing else (ST already matches `arriveAt`).
- PR (D-PS-ST-PR-p5): NOTED, optional — l.376 · l.485 "a body that SEEKS a patrol it outmatches (BD14)" may cite "(by its belief, `believedWatch` — BD12)".
- THE CHAIR (ODQ addendum): OD-BD-34's visible row now reads the different-region rule by the gang's own reckoning; OD-BD-63's R1 and ⭐ OD-BD-1 widened (`spills`) beside it.

## 5. REFINED (beyond the literal inputs; each marked in the volume)
- R1 — BD's stage is the CALLER of ES's decider for `sponsor_body` (m2: no production caller; ES's dispatcher unchartered); the offer is ONE event (no errand row — R-ES1-1). §10.4 · OD-BD-63.
- R2 — the delivery's `covertCompetence01` term applies only to a NAMED carrier; a smuggler's load is the gauntlet's catch, a cache the junction's watch (`covertCompetence01(homeSettlement, npc)` needs a person). §10.4.
- §6.8 (a)'s dispersal uses (e)'s one read (the gang's deeds' rings), never the towns' belief records (WC-BD-34's same defect in the sibling clause).
- §6.8 (c) reads ST's `holderSinceOf` once carried (C.17).
- The objective's alignment gate reads ES's own doctrine words (`method`, `targeting`) instead of a second alignment read (§7.1's tolerance) — one character read for one covert decider.

## 6. VERIFICATION
- The volume: `BD.pre-p5.md` sha `8b0a2d00…62fd` → `BD.after-p5.md` sha `137b8284…fec6`; 1,358 → 1,415 lines; `volume-p5.diff` (66 old lines changed, 123 new; 0 deletions; every changed line keeps ≥ 60% of its old text — difflib check); tables 21 → 23, 0 mismatches (`D-BD-r6-probe/tablecheck.py`); the strict GFM pipe check shows the ONE pre-existing mismatch (the r6 causalState row), none new (`strictpipes.out`).
- Stale-text sweep inside BD: every remaining hit of `IN/ES` · `OUTMATCHES` · `` `mortality` `` · "no belief inside the choice" · "HB's court rows" · "sends an operative" sits inside a CURED/SUPERSEDED bracket or names the landed sink as never the writer.
- Cross-volume: `xvol-greps.out` · `xvol-greps2.out` — no sibling cites IN/ES as the offer's decider, `bodySpillDraw`, HB court rows or BD's `mortality` sink; ST agrees on `arriveAt`; ONE drift found and routed (fold OD-FC-74 ↳ r5 l.1139).

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED (read at master `81f1cd963` or in the sibling volume at the cited line): m1–m11, every quoted code line, the census counts, the cross-volume greps, the table/diff checks (executed). PLAUSIBLE: the car's line count (+≈15 in a 115-line host), the visible-band factor's agreement with S10 (BD-4 calibrates), the per-season scoring cost of `sponsorObjectiveScore`, and RN's ring read being exposable without a second rule (routed). Nothing upgraded; no test run; no git beyond the one read-only `git log -1`.
