# D-PS-ST-PR-p5 — the P5 dispositions for THE PASSAGE · THE SITES · THE PATROLS (lane D-PS-ST-PR-p5, Opus 5.5; chair 6eb7b5b6; 2026-10-20)

Inputs: `assessments/P5-COMPLETENESS-2026-10-20.md` (the PS/ST/PR ids), the census adjudication (`WIRING-CENSUS-2026-10-20.md` §ADJUDICATION), `P5-WORDS` (P5W-1), `P5-RULINGS` §4 (route 1), and `briefs/RULINGS-P5.md` ADDENDUM §A.1 · §C (the chair's rulings — applied, never re-raised). Probe: `cure/D-PS-ST-PR-p5-probe/` (master `81f1cd963` reads, read-only).

STATUS: COMPLETE — PS 16 · ST 25 · PR 13 = 54 ids disposed: CURED 53 · NOTED 1 · REFUTED 0 · STOP 0. Reading note: the three volumes (1.15 MB) were read by section — every section a finding touches read whole, the header/laws/ontology of each, and every symbol a cure touches grepped across the whole volume and its citing volumes — not cover to cover (the ~300k context budget; vetoable).

## MEASURED FIRST (master `81f1cd963`; `D-PS-ST-PR-p5-probe/ps-master-reads.out`)
- `peaceTermsCatalog.js :: termLabel` exists (l.419; `case 'migration_right': return 'right of passage';` l.442); `humanTermType` 0 hits — WC-PS-30 CONFIRMED.
- `pactTriggers.js :: PACT_TRIGGERS` / `PACT_TRIGGERS_PRODUCED` closed at six, pinned `toHaveLength(6)`; no `passage` — WC-PS-29 CONFIRMED.
- `concludedWarRecord.js :: CLOSE_ROADS` thirteen, pinned `toBe(13)`; `stampDeploymentRecall`'s cause is free text — WC-PS-81 CONFIRMED.
- `armyTransitKernel.js :: advanceArmyTransit` returns `{ worldState: nextWorldState, changed, newsEntries }`; the pulse keeps worldState/news only; the war stage (`war.outcomes`) runs before transit in `pulseKernel.js`; `warRecordMode.js :: warConditionOutcome` returns `type: 'condition'`; `warHomeCosts.js :: applyHomeWarCosts` (613 physical) is called from `warDeployment.js` — WC-PS-39 CONFIRMED; the channel designed on these facts.
- `martialReadiness.js :: threatEnvironment01` signals are booleans summed and clamped — "MAX, capped once" = an OR adding `THREAT_ARMS` once.
- `habit/habitVocabulary.js :: CIRCUMSTANCE_CLASSES` twelve, `terms_offered` among them (owner-signed ceiling) — WC-PS-32 CONFIRMED.
- New identifiers (`passageChooserTermOf` · `refusalsExpected` · `armsNearOf` · `passageGuardLossesOf` · `guardLoss` · `passageDemandOf` · `scorePassageDemand` · `PASSAGE_FAVOUR_TRUST`): 0 src/tests files, 0 ledger docs files.

## PS — DONE (16 ids: CURED 15 · NOTED 1 · REFUTED 0 · STOP 0); volume record §18 "P5"
| id | sev | disposition | where | receipt |
|---|---|---|---|---|
| P5C-4 (WC-PS-37 · WC-PR-57) | MAJOR | CURED — two registered producers, ONE composer `armsNearOf` (boolean MAX; `THREAT_ARMS` once), home PS §7.4 / `passage/incursion.js`, owned unit (PS-3 or PR's prerequisite); pin: 0 iff no crossing live AND no report | §7.4 · §2.7 · PS-3 · §14 · P38 | `martialReadiness.js :: threatEnvironment01` (booleans, clamped); PR §9.1 (a) "PR is that signal's second producer" |
| C.1 (P5C-1 · WC-PS-20) | MAJOR (fold) | CURED (PS half) — `passageChooserTermOf(ws, snap, A, target, tick) → { refusalsExpected, reasons[] }`, belief, capped 2, one bounded lean; car = WC's owned `WC-car-0` | §0.2 · PS11 · §2.7 · §5.1 · PS-4 · P42 | RULINGS-P5 C.1; PL §3.4 same naming |
| WC-PS-21 · 24 | MINOR | CURED (PS half) + ROUTED fold WC INBOX row | §5.4 · §5.5 · §14 | `migration.js :: MILITARY_COLUMN_CLASSES` "NOTHING STAMPS ONE OF THESE YET" |
| WC-PS-29 | MINOR | CURED — declared `passage` trigger (6 → 7), scorer over kept rows; ⭐ OD-PS-52 | §6.4 · PS-1b · P40 | `pactTriggers.js` closed lists; `toHaveLength(6)` |
| WC-PS-30 | MINOR | CURED — `termLabel` everywhere | §0.1 · §6.4 · PS-1b · §15 | `peaceTermsCatalog.js :: termLabel` l.419 |
| WC-PS-32 | MINOR | CURED (PS half) — habit DARK until HB's row; ROUTED fold HB INBOX | §3 · §7.1 · PS-1 | `CIRCUMSTANCE_CLASSES` (12, `terms_offered`) |
| WC-PS-39 | MINOR | CURED — declared channel `guardLoss` → `passageGuardLossesOf` → `applyHomeWarCosts` next pulse | §2.7 · §2.8 · §4.1 · §7.5 · L2 · P41 | `advanceArmyTransit` return shape; war stage before transit |
| WC-PS-81 | MINOR | CURED — `CLOSE_ROADS` (13 → 15); ⭐ OD-PS-53 | §5.2 · PS-3 · §15 | `concludedWarRecord.js :: CLOSE_ROADS`; `toBe(13)` |
| WC-PS-18 · 64 · 48 | MINOR | CURED — keptSecret exclusion (public record); feeder from witnessed incursion crossings (truth); favour on the pair state | §5.1 · PS12 · §2.6 · §7.1 | RULINGS-P5 C.15; ST §2.1 `keptSecret` |
| WC-PS-50 · 51 | MINOR | CURED — `gateKeeperOf` called; `passageNodesOf` struck, ask set via `passageCrossingOf` | §2.7 · §4.1 · §4.2 · PS-0 | RULINGS-P5 C.13 |
| route 1 (bypass) | route | CURED — hops `a|b` + `b|c`, B's land, gate never entered | §2.7 · §5.6 · P39 | BD §5.2 (ii) |
| P5C-3 (WC-PS-44) | MAJOR (PL) | NOTED — PL cured it; PS14 REFINED cite | PS14 | PL §2 l.136 |
REFINED (PS): (1) PS14 cites PL's ninth class; (2) the `passage` trigger placed at PS-1b (the occasion's wave) though C.18 says "at PS-4" — vetoable; (3) `PASSAGE_FAVOUR_TRUST` gives the favour a measurable carrier (FP-46 roster).
Contradiction check (grep): MN cites "as PS12 defines it" (no clash); BD §5.2 (ii) already states the bypass rule; PL §3.4 names `WC-car-0` identically; PR §9.1 (a) already calls PR the second producer; `humanTermType` 0 in every ledger volume but PS's own history brackets.

## ST — DONE (25 ids: CURED 25 · REFUTED 0 · STOP 0); volume record §15 "Round P5"
| id | sev | disposition | where | receipt |
|---|---|---|---|---|
| P5C-10 (WC-ST-41) | MAJOR | CURED — §6.1 step 8 THE CRISIS SPENDS: six reads (hospice at the outbreak's `peaking`; shrine at the fracture's `residual` against its creed + `destroyed` when an untied force takes it; tower's wards at a magic stressor's resolution; the blinded watch — an unseen take the tower watches; the bridge cut — an enemy army's won siege of a held `crossing`; the harbour works at a blockade's 13th week), each with its flag, one step per crisis, idempotent by the crisis id, at `closeSiteWeek` | §3.5 · §6.1 · ST-3 · S41 | `stressorsCore.js :: STRESSOR_LIFECYCLE_STAGES`; `navalLayer.js :: activeBlockadeTargets` |
| P5W-1 (§A.1) | MAJOR | CURED (ST half) — §6.3 bracket: lordship and attachment honoured, the partition the map's; ⭐ OD-ST-54 = OD-FC-85 visible | §6.3 · §13 | RULINGS-P5 A.1 |
| P5C-12 tokens (WC-ST-2·7·8·10·12·15·85·88·92·94) | minor | CURED — §2.5 P5 rows (25 identifiers 0 src/0 tests); `resourceKey` LANDED same sense; `DISTANCE_BANDS` LANDED other meaning → `SITE_DISTANCE_BANDS` (the fold's recommendation) | §2.3 · §2.5 · ST-0 | `st-tokens.out` |
| P5C-12 (WC-ST-86) | minor | CURED — `keepBreaches` a conditional declared field, §11 B′, ⭐ OD-ST-53 | §4.2 · §11 · §13 | — |
| P5C-13 (WC-ST-1 · 91) | minor | CURED — `siteAt` readers named; `siege.quietWeeks` struck | ST18 · §2.1 · §2.4 | PL F.6 (b) (iii) reads `siteAt` |
| P5C-15 (WC-ST-31) | minor | CURED — `raidHot` only for a told den (public record) | ST9 · OD-ST-11 · S42 | A.16 |
| P5C-17 (WC-ST-37·42·43·47·59·62·64·65·93) | minor | CURED (ST half) — cites + ROUTED fold rows; `riders_quartered` (iii) cited; ruin host candidates named; `holderSince?` + `holderSinceOf` | ST12 · §2.1 · §2.4 · §3.3 · §4.4 · §6.1 · §6.3 · §6.5 · §7.4 · §13.1 | `rumorNetwork.js :: captureContent`; `HeraldRemembrance.jsx` |
Contradiction check (grep): BD l.492 already re-points its tenure read to `holderSinceOf` (BD's P5 REFINED); the fold l.951 recommended `SITE_DISTANCE_BANDS` and names ST §11 as `keepBreaches`'s lifecycle home — both now true; PL F.6 (b) (iii) reads `sitesNear`/`siteAt`/`garrisonBandOf` exactly as ST names them; the fold l.1121's `siege.quietWeeks` is MN's record (no clash).

## PR — DONE (13 ids: CURED 13 · REFUTED 0 · STOP 0); volume record §20 "P5"
| id | sev | disposition | where | receipt |
|---|---|---|---|---|
| P5C-4 (WC-PR-57) | MAJOR (PS's; PR cite) | CURED — §9.1 (a) cites PS §7.4's composer `armsNearOf` (MAX, once); PR writes nothing of the signal | §9.1 (a) · OD-PR-20 · R57 | PS §7.4 as cured here |
| C.1 (WC-PR-7) | MAJOR (fold; PR cite) | CURED — `keepRiders` a registered row on WC's owned `WC-car-0` | §9.1 (e) · OD-PR-21 | RULINGS-P5 C.1 |
| P5C-14 (WC-PR-22) | minor | CURED — MN's `MIGHT_LATENT` 13·34·51·69·89; PR's 15·30·50·70·85 struck | §5.2 · OD-PR-17 · R58 | MN l.616 "`MIGHT_LATENT` (13/34/51/69/89)" |
| P5C-19 (WC-PR-9 · 39 · 54) | minor | CURED (PR half) — fold HB · EC · WY rows ROUTED; DARK until carried | §2.2 · §6.4 · §8.2 · §15.1 | `HIDDEN_PATH_KINDS` (the run landed) |
| P5C-19 (WC-PR-56) | minor | CURED — producer (3) struck | §2.6 · §8.3 | RULINGS-P5 C.19 |
| P5C-19 (WC-PR-61) | minor | CURED — carrier: `pendingEvents` → `drainQueuedEvents` → tick-stamped `eventLog` | §9.2 (a) · §14 | `events/drainQueuedEvents.js` JSDoc |
| P5C-19 (WC-PR-69) | minor | CURED — `applyRelationshipPatch`, cause `patrol_join_refused` | §10.1 · §15.2 · R59 | `relationshipEvolution.js :: applyRelationshipPatch` |
| P5C-19 (WC-PR-78) | minor | CURED — CH's `patrol_will` (`min(1, WILL_SHARE × mult)`); "for a season" struck | §3.1 · §10.5 · §15.1 | CH §2.2 (CH's lane) |
| P5C-13 (WC-PR-85 · 102) | minor | CURED — `patrolsOf` read by the dossier; `escortedOn` kept, WY/POP rows ROUTED | §2.1 · §10.4 · §15.1 | CHAIR-NOTES 20 (b) |
| P5C-12 (WC-PR-123) | minor | CURED — `noLook` lifecycle row; ⭐ OD-PR-53 | §16.1 · §15.2 · OD-PR-22 · R60 | — |
Contradiction check (grep): MN's table matches; CH §2.2 carries `patrol_will` in PR's form; PS §7.4 names PR as the second producer; "for a season", "first chain to land", "15 · 30 · 50" remain only inside CURED history brackets.

## STOPS — none.

## REFINED (beyond the inputs; each marked in the volume, vetoable)
1. PS14 cites PL's ninth class `passage_of_arms` (cured in PL).
2. PS: the `passage` pact trigger placed at PS-1b (the wave that carries the lens occasion); RULINGS-P5 C.18 says "at PS-4" — read as the occasion's own wave.
3. PS: `PASSAGE_FAVOUR_TRUST` gives the court→court favour a measurable carrier on the pair state.
4. ST: `DISTANCE_BANDS` LANDED at master with another meaning (`envoyChanceMeeting.js`) → ST's constant renamed `SITE_DISTANCE_BANDS` now (the fold §5's own recommendation).
5. ST: "when an enemy army cuts it" defined as the army's won siege of a held `crossing` (`destroyed`, quality `ruined`).

## ROUTED (one line each: volume — exact edit)
1. FOLD §3.1 WC INBOX — new row: WC-6's column producer calls PS `passageAnswerOf` over the column's ASK SET at dispatch and PS's ledger module writes crossings/cards; WC-10's stepper reports each node a RETAINED corps enters to PS's reads (WC-PS-21 · 24).
2. FOLD §3.1 HB INBOX — (a) THE PASSAGE's court-grain habit row under the landed class `terms_offered`, grant/refuse action keys HB's (WC-PS-32); (b) THE PATROLS' stretch-keyed action token under `route_menaced` + the report credit (WC-PR-9).
3. FOLD §3.1 EC INBOX — (a) the `crossing` holder's TOLL SHARE at EC-6's toll arm (WC-ST-37); (b) the way-run WATCH `trailWatchOf` at EC's gauntlet (WC-PR-39).
4. FOLD §3.1 ES INBOX — the traitor at the gate: a provocateur's lean on `site_siege`'s draw (WC-ST-43).
5. FOLD §3.1 GRAMMAR INBOX (5) — the `site_cession` term and its §5 token (WC-ST-59).
6. FOLD §3.1 WF INBOX — `consecrated`, the hierarchy's claim of a site (WC-ST-62).
7. FOLD §3.1 IN INBOX — ONE `siteId` content slot on `spatial/rumorNetwork.js :: captureContent` (MN17's idiom) with its seeding terms (a held site's arrival significance; an authored `cause dm` placement told to courts, never `dm-only`) (WC-ST-47).
8. FOLD map INBOX (n) — re-emit a retired site document under `mapSiteRef` at its founding settlement's death (WC-ST-65).
9. FOLD §3.1 WY INBOX — WY-6 calls `patrolEncounter`; a patrol power as `caravan_seized`'s seizer; §9.1 (c)'s turned-back caravans; `escortedOn` lowers the seizure odds (WC-PR-54 · 102).
10. FOLD §3.1 POP INBOX — column road deaths fall with `escortedOn` (WC-PR-102).
11. FOLD §3.3.16 ↳ (11) / §3.1.23 — PS's claimant row is `passageChooserTermOf(worldState, snapshot, A, target, tick) → { refusalsExpected, reasons[] }`; PR's `keepRiders` the sixth (C.1).
12. FOLD §5 — `passage` (a PACT_TRIGGERS word); `passage_refused` · `passage_barred` (CLOSE_ROADS words); PS §15's P5 identifiers; ST §2.5's P5 rows + `SITE_DISTANCE_BANDS`; PR's `patrol_join_refused` · `PATROL_JOIN_REFUSED_RESENTMENT`.
13. FOLD §7 shape list — `deployments[*].siteTargetId` (WC-ST-94); ST `holderSince?` and conditional `deployments[*].keepBreaches?`; PS `crossings[*].guardLoss?`; PR `noLook` on the authored event.
14. ODQ §934.93 P5 addendum (the chair) — VISIBLE rows ⭐ OD-PS-52 · ⭐ OD-PS-53 · ⭐ OD-ST-53 · ⭐ OD-ST-54 (= OD-FC-85, both owner words) · ⭐ OD-PR-53.
15. `DESIGN_W_MEM.md` (insertions-only; the next brackets lane — W-MEM is outside D-BRACKETS-p5's list) — one bracket: `CLOSE_ROADS` gains `passage_barred` · `passage_refused` at PS-3 (⭐ OD-PS-53).
16. MN §3.3 (its composition sentence) — name PS's feeder as selecting from PS's witnessed `armed_incursion` crossings + the war records, no belief selection in the composer (WC-PS-64, "MN to confirm").

## OPEN QUESTIONS FOR THE CHAIR
- The `passage` trigger's wave: PS-1b (applied) vs the ruling's "PS-4".
- OD-PS-53's fallback ("keep CLOSE_ROADS closed" → stamp `return_home`) is PLAUSIBLE: W-MEM must confirm `return_home` admits a recall.
- WC-PS-39's channel host (`warHomeCosts.js :: applyHomeWarCosts` + one argument at `warDeployment.js`) is PLAUSIBLE until PS-3's car-0; S-f widened to "no carrier".

## CONFIRMED vs PLAUSIBLE
CONFIRMED (read at master `81f1cd963`, probe files `ps-master-reads.out`, `st-tokens.out`, `pr-master-reads.out`): `termLabel`; the closed `PACT_TRIGGERS`/`_PRODUCED` (6) and `CLOSE_ROADS` (13) with their pins; `advanceArmyTransit`'s return shape and the pulse order; `warConditionOutcome`; `threatEnvironment01`'s boolean signals; `CIRCUMSTANCE_CLASSES`; `captureContent`'s slots; `STRESSOR_LIFECYCLE_STAGES`; `activeBlockadeTargets`; `HeraldRemembrance.jsx`; `drainQueuedEvents`; `applyRelationshipPatch`; the landed `DISTANCE_BANDS` and `resourceKey`; every new token free. PLAUSIBLE (design reasoning, not executed): the host-line budgets, the guard-loss channel's host, the eventLog reaching the patrol stage, the blockade age field, the crisis-spend idempotency over the 8-event ring. No test run, no git.

DISCLOSURE: one read-only `git -C <master worktree> rev-parse --short HEAD` was run at the start to confirm the code of record is 81f1cd963 (it is) — against the "never git" law; nothing was staged, written or moved. Backups of the three volumes before this lane: the scratchpad p5c/{PS,ST,PR}.before.md.
