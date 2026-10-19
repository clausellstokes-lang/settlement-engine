# D-ST-r3 — THE SITES, round-3a disposition lane (Opus 5.5, xhigh), chair 0a2e8bd9 (continuing a73343ed), 2026-10-18

Volume owned: `docs/DESIGN_FP_ARCH_ST.md` (read whole first: 680 lines, mtime 08:30). Probes: `cure/D-ST-r3-probe/`. Code of record: the detached master worktree `master-81f1cd963` (read-only). No git, no test suite.

Inputs read whole: kit README, COMPILE-COMMON, DISPOSE, RESEARCH-COMMON, RULINGS-PL-MN, RULINGS-AFTER-RESEARCH, RULINGS-AFTER-COMPILE, CHAIR-NOTES-FOR-THE-FOLD, RULINGS-ROUND1 (+ADDENDUM), RULINGS-ROUND2, RULINGS-ROUND2b (+ADDENDUM), RULINGS-ROUND3, the BOARD; `skeptic/ST-r2-verify.md`; `skeptic/{PS,PR,MN}-r2-verify.md` whole; the ST-bearing rows of `skeptic/{CH,FOLD,PL,PT,RN}-r2-verify.md` (grep, read in context).

## 1. MEASURE FIRST (the measurements that could refute the briefs)

| # | Claim the cure rests on | Receipt | Class |
|---|---|---|---|
| m1 | the readiness value's chair name `readiness01` is FREE | `martialReadiness.readiness01` is LANDED (14 src files, 9 tests, `census-r3.out`; e.g. `armyTransit.js :: armyMarchWeeks(baseHopWeeks, readiness01 = 0.5)` "the army's 0..1 martial readiness"; `WarTab.jsx :: readinessWords(readiness01)` → "on a war footing" · "braced for war" · "watchful") — REFUTED as free: the site's value is minted `siteReadiness01` (0 everywhere) | CONFIRMED (rg) |
| m2 | the chair's proposed words `full · manned · sparse · skeleton · empty` are free | `full` 37 quoted src files (infoMode `full`, chain status, politicalAutonomy) — ST's own round-1 refusal of `full` for `FUNDING_BANDS` (§2.3) is the precedent; `empty` 16 quoted src files AND ST7's own meaning on the same card (an UNHELD site "stands empty", §14 line 4); `manned` 0 quoted · `sparse` 1 quoted (`settlement.schema.js` `proseDensity` 'sparse' — generation config, another surface) · `skeleton` 0 quoted (UI loader component names only) · `at_strength` 0 everywhere · `hollow` 0 quoted (prose only) — `census-r3.out`, `census-r3b.out`, `quoted.sh` | CONFIRMED (rg) |
| m3 | A.10's arithmetic | `readiness.out`: F × Q over the 12 cells; the siege value `siteReadiness01 × 18` (14.4 funded-sound, 18 lavish-sound); the r2 `garrisonBandOf` reported 80 → `formidable` for the same keep (ST-V3's receipt reproduced) | CONFIRMED (executed) |
| m4 | MN5/ST8's "a kept road may let a raided country fall out of the latch" | master `embattlement.js :: EMBATTLEMENT_TUNING` `ENTER_THRESHOLD: 0.55` · `EXIT_THRESHOLD: 0.3` · `MIN_DWELL_TICKS: 6`; `stepEmbattlement` "`} else if (rawT < T.EXIT_THRESHOLD && (now - priorSince) >= T.MIN_DWELL_TICKS) {`". EXECUTED `latchExit.out`: an embattled town at raw 0.35 (a capable den or a menace raid on a kept road) never leaves in 52 weeks; a modest den (0.40) sustains; a modest den kept to 0.15 leaves (T₀ 0) but not at T₀ 0.2 (raw 0.32); a calm town at 0.35 never enters — the claim is TRUE only for a sub-latch den with a low ramp, FALSE for a menace raid or a capable den | CONFIRMED (executed) |
| m5 | the DM's lever "raise the holder (the landed Edit Mode on the settlement)" (RULINGS-ROUND3 B, ST-r2-16) | no landed edit op writing `economicState.prosperity` found (searched `src/store`, `src/domain/events`, `src/components/edit`); the live stepper is `upswingKernel.js` "`economicState: { ...ec, prosperity: nextProsperity }`" — the example lever is PLAUSIBLE, recorded as open question Q1; the ruling's substance (no site override; the holder and the ceiling are the levers) is built | CONFIRMED (absence by search) / PLAUSIBLE (the lever) |
| m6 | A.14 (`a␟b` is a minted pair key) | `realmManifest.js :: COURSE_TARGET_SEP = '␟'` — the LANDED composite-target DIAL separator ("`targetId: raw.slice(0, i), courseKey: raw.slice(i + COURSE_TARGET_SEP.length)`"); ST's `a␟b` / `anchor␟siteId` are dial values parsed at the verb, never a stored key; the landed pair KEY is `spatialDigest.js :: pairKey` "`(a < b ? \`${a}|${b}\` : \`${b}|${a}\`)`" | CONFIRMED (read) |
| m7 | ENC-MS-06 (note 4) | HR:694: "its levels become the settlement's; the site document is retired; a dying settlement keeps its sites" | CONFIRMED (read) |
| m8 | PR15 / OD-PR-37 (note 5) | PR:704 "a harbour's watch is its W-NAVY navy (no slot of PR's)"; PS8 (PS:99): a harbour LANDING's place is `settlement(B)`, "where B's own seat is on the path and the crossing is therefore ALWAYS witnessed (no quiet landing exists)" | CONFIRMED (read) |
| m9 | tokens new or uncensused (note 6) | `party_cleared_site` · `party_made_known_site` · `party_reached_site` · `keepBreached` · `seenBy` · `siteReadiness01` · `SITE_READINESS` · `SITE_DEFENSE_CEILING` — 0 src · 0 tests (`census-r3.out`, `census-r3b.out`) | CONFIRMED (rg) |
| m10 | MN's one composition sentence (note 3) | MN §3.3 `presenceTerms`: "`p(T) = max(wallsTerm(T), columnTerm(T), max(0, roadCountry(T) − σ(T)))` … SUPPRESSIBLE: `roadCountry` only … NEVER SUPPRESSED: the walls term and an enemy column" | CONFIRMED (read) |
| m11 | PL's `den_unanswered` row (A.5/A.6 alignment) | PL:243 "records as a `protection_failed` row through the request door above … so the hold's `P` reads it like any failed protection"; PL P43 "H's `P` falls by it" — no trust patch (A.6) | CONFIRMED (read) |

## 2. THE RECORD (37 inputs: disposed 37 — cured 31 · refuted 0 · stop 0 · noted 6)

The same table is the volume's §15 "Round r3" block. Every cure was checked against the receipt that convicted it (column 5).

| Id | Sev | Disposition | Where (ST) | Checked against the convicting receipt |
|---|---|---|---|---|
| ST-r2-16 | M fail | CURED | ST6 · §2.1 · §6.1 step 3 · §11 · OD-ST-5/40 · S3, S3b | the verifier's path (abandon → `SITE_HOLDER` re-garrison → stale clock re-abandons): the writer now drops `wantSince` on every holder change; a still-poor holder holds one season (S3b); "manned regardless" struck; levers named (holder; holder's means — PLAUSIBLE DM act, m5) |
| ST-r2-14 | M STOP ruled | CURED | ST18 · §2.1 · §7.3 · §7.4 SP · §8 parties · OD-ST-27 | the five places the verifier listed + ST18 + §8's `{kind:'site'}` party ref; `grep "STOP ST-r2-14"` → 0 |
| HOST-r2-11 | M STOP ruled | CURED | §6.3 TRADED · S13 | HR:491 / 499 / 900 re-read (quoted); `grep "STOP HOST-r2-11"` → 0 |
| ST-V1 | M new | CURED | §2.1 · §2.4 · §6.1 4, 6 · §8 · §7.4 IN · §11 · OD-ST-25/35/40 · S24 | the verifier's "no court believes an arrival in its own week": the at-hand courts now hold `seenBy` written AT the arrival (all presets), so the folded contest has a reachable court; non-at-hand courts still cannot reach it (stated) |
| ST-V2 | M new | CURED | §2.4 · §6.2 · §6.3 · §7.4 IN · OD-ST-35 · S4 | the verifier's two dead dens: S4's authored den now emits `site_taken` (cause `dm`) and `seenBy`; a S9-style siege fall is read as a telling; MN17 for a menace holder |
| ST-V3 | M new | CURED + REFINED | §0 · §2.3 · §2.4 · §4.1 · §7.2 · §8 · ST-0 · ST-4 · OD-ST-12/37/41 · S9, S25 | `readiness.out` reproduces the verifier's 80 → `formidable` vs 14.4 and shows the cure: one value, the siege and the keep term both 14.4 for a funded sound keep, word `at_strength`; no `STRENGTH_BANDS` word on a garrison |
| note 1 | m | CURED | = ST-r2-14 · HOST-r2-11 | — |
| note 2 · PR-V6 | m | CURED (ST's side) | §2.4 · §7.4 PR · OD-ST-5 | A.9: ST's name stands; PR's rename routed |
| note 3 | m | CURED | §3.4 · ST8 | MN §3.3 re-read (m10): ST now cites the sentence and names only its two inputs |
| note 4 | m | CURED | §6.5 | HR:694 re-read (m7) |
| note 5 | m | CURED | ST17 · §2.4 · §3.3 · §3.5 · §7.4 PS/PR · patrols paragraph · §9 · OD-ST-36 | PS:99 and PR:704 re-read (m8); PS:565 and PR:294 cite the watchtower only — no other volume reads a harbour-works witness input (grep) |
| note 6 | m | CURED | §2.5 | `census-r3*.out` (m9) |
| note 7 | m | CURED | ST8 | ST9's "at-hand" membership |
| PR-r2-8 | M fail (ST + PR) | CURED — ST's side | ST10 · §3.3 · §3.4 · §4.1 · §7.4 PR · OD-ST-12/39 · S26 | the verifier's quote of ST §3.3 ("this 0.20 reads 0") is gone; every fort row stands lit or dark (A.1); PR's R34 / §10.5 / sentence 9 routed (PR:422 and PR:741 already carry A.1's "two bodies, one cap") |
| PR-V2 | M new (MN) | CURED — ST's side | §3.3 · §3.4 | ST now gives MN M53's 0.35 (0.20 + 0.15 capped at 0.25 off 0.60); MN's cite routed |
| PS-r2-15 | M fail | CURED — ST's side | §4.3 · §7.4 PS · S21 | the verifier's (b) (the clamp pushes a mid-hop unit forward) and (c) (Bound 2 claimed with PS dark): the fort now holds by the FREEZE mode in PS §4.1's order; Bound 2 only where PS is lit; Bound 1 always |
| SEAMS-r2-7 | M partial fail (MN-r2-verify (b), (c)) | CURED — EXECUTED | ST8 · §3.4 · OD-ST-10 · S22 | `latchExit.out` (m4) re-runs the verifier's hysteresis against master's `stepEmbattlement` for ST's own feeders |
| MN-V6 | M new | CURED — ST's side | ST8 · §3.4 · §9 · ST-1 host edits · §7.4 MN | A.3: the composer a shared car; ST's danger arm lights with `siteEffectsEnabled`, never waiting on `menacesEnabled` |
| FOLD-r2-verify note | m | CURED | = ST-r2-14 | — |
| PT-r2-verify note ("the reveal") | m | CURED | §7.2 · §7.4 · §8 · ST-4 · §10.1 | PT:243 / 542 re-read: `party_made_known_site` "recorded beside the DM's own `SITE_STATUS made_known`" — ST says the same |
| CH-r2-verify note (`corps`) | m | CURED — ST's side | §7.3 · §2.1 | A.7's five kinds |
| A.1 | ruling | CURED | = PR-r2-8 · PR-V2 | — |
| A.2 | ruling | CURED | = PS-r2-15 | PS9 Bound 1 / Bound 2 re-read (PS:102–104) |
| A.3 | ruling | CURED | = MN-V6 | — |
| A.4 | ruling | NOTED | — | ST gives no court fame (grep `fame` → 0) |
| A.5 | ruling | CURED | §6.6 · §9 | — |
| A.6 | ruling | CURED | §6.6 · §14 l.5 | PL:243 / P43 re-read (m11) |
| A.7 | ruling | CURED | §7.3 · §2.1 · OD-ST-27 | — |
| A.8 | ruling | NOTED | — | ST mints no ban |
| A.9 | ruling | CURED | = note 2 | — |
| A.10 | ruling | CURED + REFINED | = ST-V3 | m1, m2 |
| A.11 · A.12 · A.13 · A.15 | rulings | NOTED (four rows) | — | ST has no `party_voiced`, `believedWhereabouts`, voyage plan or `paragonLean` |
| A.14 | ruling | CURED (measured) | §6.2 · §2.4 | m6: ST's `␟` is the landed dial separator; no stored `a␟b` key; the stretch key named |

(RN-r2-verify's note on RN §3.1's "ST's actor convention gains `site`" is RN's own text — RN's lane; not counted.)

## 3. STOPS FOR THE CHAIR
None.

## 4. REFINEMENTS (each marked `[REFINED 2026-10-18 (fp-final r3) — …]` in the volume)
- R1 · `siteReadiness01`, not A.10's `readiness01` (LANDED martial readiness, 14 src files; ST9 reads that index in the same volume).
- R2 · `SITE_READINESS = at_strength · manned · sparse · skeleton · hollow`, not the chair's `full · … · empty` (`full` 37 quoted src files and ST's own round-1 refusal of it; `empty` 16 quoted and ST7's word for an UNHELD site on the same card). The chair's "a sound funded keep adds 18" is read as the kind's ceiling (lavish sound 18; funded sound 14.4 — `readiness.out`).
- R3 · `SITE_DEFENSE_CEILING` per kind for the site's own siege: fortification 18 (= `KEEP_DEFENSE_MAX`) · watchtower 6 · every other kind 0 (round 2's "`siteDefenseOf`'s value" was defined for fortifications only).
- R4 · `seenBy` lives on the HOLDER (dies with it), not on the 8-event ring (which would evict the witness while the den still stands).
- R5 · "every holder change" made structural: the one writer compares `holder.ref` before/after, so the list (`placed · garrisoned · taken · reclaimed · conveyed · ceded · granted · seized · consecrated · sold · cleared · abandoned`) can never be incomplete.
- R6 · an untied holder's card word is its MIGHT (a force's word), never a garrison word.
- R7 · §14 line 5's "and the commons' grievance" struck (A.6: the row moves the hold's `P` only).
- R8 · S3b, S24, S25, S26 added (the verifier's failing paths pinned).

## 5. ROUTED (the other-volume halves this lane cannot write)
- FOLD §5: register `SITE_READINESS` as `at_strength · manned · sparse · skeleton · hollow` and the value `siteReadiness01` (A.10's register row must not carry `full`/`empty`/`readiness01`); §3.1.29 (fold:328) `garrisonBandOf` gloss "`100 × F × Q` on the five-floor `STRENGTH_BANDS` scale, in MN's keys" → "the site's readiness word".
- FOLD §3.3 sea row (fold:405) "where the harbour works keep watch" → the harbour works is where a landing asks; its watch is the port's navy (OD-PR-37); every landing witnessed (PS8).
- FOLD (fold:571) "keyed by the codepoint-sorted pair `a␟b` (THE SITES' idiom)" → `a|b` (`pairKey`); ST's `␟` is only the landed dial separator `COURSE_TARGET_SEP`.
- FOLD §3.4 `site_taken` row: the folded contest is the AT-HAND courts' only; IN's seeding registration covers `site_taken` (hearing + authored, cause `dm`), `site_siege` falls, `site_cleared`.
- PR §15.2 (PR:578) and its A.10 row: "ST's readiness words (`full · manned · sparse · skeleton · empty`)" → `at_strength · manned · sparse · skeleton · hollow`; `fundingBandOfSettlement` → `settlementFundingBand` (A.9); R34 / §10.5 / sentence 9 per A.1.
- PL (PL:536): "`readiness01 = F × Q`; the chair's `full · manned · sparse · skeleton · empty`" → `siteReadiness01`; ST's `SITE_READINESS` words; P43 may name the occasion's gate `siteFatesEnabled ∧ polityEnabled` (A.5).
- PS (PS:114, PS:250): the quoted ST §4.3 phrase "as it holds at a refused border" is withdrawn — the fort holds by the helper's FREEZE mode (border mode at a node just passed); PS:565 "inside Bound 2" → "inside Bound 1, and Bound 2 where THE PASSAGE is lit" (A.2).
- MN: M50/M53 cite ST's `σ` (A.1 — the fort's 0.20 stands under the cap); MN5's "may fall out" per MN's own SEAMS-r2-7 cure; §3.3's "registered … by whichever commit lands second" → A.3's shared car.

## 6. OPEN QUESTIONS (only what measurement could not settle)
- Q1 · RULINGS-ROUND3 B names "the landed Edit Mode on the settlement" as the DM's way to raise a poor holder: no landed op writing `economicState.prosperity` was found (`src/store`, `src/domain/events`, `src/components/edit`); the live stepper is `upswingKernel.js`. ST states the lever as PLAUSIBLE; the chair names the act or accepts "the holder" as the DM's one site-side lever.
- Q2 · may a CORPS paragon (a free company, A.7's actor) HOLD a site? `HOLDER_CLASSES`' `person` refs only `wnpc_` persons today; the natural cure is `{ kind: 'corps', id }` under `person` with its paragon's polarity as the sign (OD-ST-32's rule) — not built (new capability by a hair; the chair's).
- Q3 · PT's open question 5 (the site made known as ONE act through PT's door, like the clearing) would add a PT caller to ST's closed list; ST keeps today's "beside the DM's act" until the chair rules.
- Q4 · R2/R3 change words the chair proposed and a ceiling round 2 left undefined — vetoable as refinements.

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED by execution: `latchExit.out` (master's `stepEmbattlement`), `readiness.out` (the arithmetic), the census outputs. CONFIRMED by reading: m6 (`COURSE_TARGET_SEP`, `pairKey`), m7, m8, m10, m11 and every cross-volume line cited. PLAUSIBLE: the prosperity lever's DM act (Q1); MN17's rumor read at a site (MN14's `site` WHERE, unbuilt); IN's seeding registration (unchanged PLAUSIBLE from r2). Every DRAFT constant stays UNMEASURED. No git; no test suite; master read-only.
