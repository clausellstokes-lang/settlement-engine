# cure/D-OP-r1.md — DISPOSITION LANE over `docs/DESIGN_FP_ARCH_OP.md` (THE OPPORTUNITY), P6b round r1

Seat: D-OP-r1 (Opus 5.5), chair 6eb7b5b6 (Fable 5.1). Began 2026-10-20 15:03 CDT (by `date`). Code of record: master `81f1cd963` detached worktree (READ-ONLY). Never git; never the suite. Probes under `cure/D-OP-r1-probe/`.

## INPUTS (enumerated before any edit)
1. `skeptic/OP-r1.md` — OP-r1-1 … OP-r1-28 (2 BLOCKING · 15 MAJOR · 11 MINOR).
2. `skeptic/SEAMS-P6.md` — ABSENT at seat start (`find` returns only `briefs/SEAMS-P6.md`, the brief; the seams seat runs after P5c per BOARD 14:11 and RULINGS-P6 preamble) ⇒ 0 ids routed to OP this round.
3. Other skeptics' ROUTES to OP: `MG-r1.md` → MG-r1-15 (MAJOR), MG-r1-26 (MINOR); `WS-r1.md` → none; `FS-r1.md` → none.
4. Other compile logs' ROUTES to OP: `cure/L-MG.md` §5 cross-citation "OP … the detour is a `reroute` with OP's motive and roll" (id here: X-LMG-OP); `cure/L-WS.md` §4 "OP / FS: the fiscal seat's war purse … cite only" (id here: X-LWS-OP); `cure/L-FS.md` §5 "OP · MG | none" (no id).
Rulings applied: `briefs/RULINGS-P6.md` §A.3 · §A.5 · §B.1 (and §C's OP-related routes).

(record table and STOPs follow; saved as the work proceeds)

## MEASUREMENTS RE-RUN AT MASTER (each convicting receipt re-read before its cure; 15:0x–15:3x CDT)
- OP-r1-1: `certification/subsystemRowsWar.js` (envoyDiplomacyEnabled row `other`): "all nine immediate WR-7b facts are DM-only until a separate observation carrier earns public knowledge"; `envoyNews.js :: WR7B_KIND_SET` has `'envoy_held'`; HEADLINE `envoy_silence_inference: (x) => \`${x.settlement} fears ${x.counterpart} has taken its legate\``. CONFIRMED.
- OP-r1-2: `envoyDiplomacy.js :: expectedRoundTripTick` — "A conservative round-trip window used before WR-7b opens the actual return." builds the return plan from `outboundHome + 1` and returns its `expectedReturnTick`; `buildEnvoyRoutePlan` returns `expectedReturnTick: Number(legs.at(-1).arrivalTick)`. Zero slack. The skeptic's probe `skeptic/OP-r1-probe/slack.out` (lateBy 2) stands; not re-executed (the read is sufficient and the probe is deterministic). CONFIRMED.
- Covert travellers: `espionage/espionageRider.js` — "EXACTLY ONE STOP, and it is the embassy's own destination"; `espionageWariness.js` lapses `never_arrived` / `never_left` read `expectedReturnTick` ("a REQUIRED field on every errand row"); `espionageMissions.js` header "NOTHING UNDER src/ CALLS THIS FILE" (ES-1's dispatcher is a later wave). CONFIRMED.
- OP-r1-3: `envoyErrandParlay.js :: frozenParlayPictures` (K4, quoted by the skeptic) — taken as read; `envoyDiplomacy.js :: envoyDeparturePicture` "Freeze the offerer's own true-at-departure picture into closed WR-7a words". CONFIRMED.
- OP-r1-4: `envoyErrandParlay.js :: resumeFromEncounter` normalizes against `{ fromId: encounter.venueId, toId: encounter.destinationId, journey: encounter.priorJourney }`; `envoyErrand.js :: beginEnvoyReturn` → `current.state !== 'parlaying' … 'invalid_state'`; `npcDmVerbs.js` pardon: `buildEnvoyRoutePlan({ fromId: activeForeignHold.venueId, toId: continuation.destinationId, journey: continuation.journey })` → `closeForeignGuestHold(reason 'pardon')` → `releaseHeldEnvoy` → `syncEnvoyNpcTransit` → `placeNpcRecord` (= `moveNpcRecord`, "the ordinary helper quite properly declines a leg that did not begin at home"). `npcDmVerbs.js` 711 eff (`D-OP-r1-probe/efflines-r1.txt`). CONFIRMED.
- OP-r1-5: `envoyInterceptionStage.js :: holdVenueFromEncounter` — `['allied_hall','occupied_enemy_settlement','host_settlement']` → `{ kind: 'settlement' }`; `field_node` → `{ kind: 'route_node' }`; "no reachable row can take this arm until ES-2b opens the producer" (host_settlement). CONFIRMED.
- OP-r1-6: `espionageMath.js :: catchChance01` — `if (!Number.isFinite(rung) || !rungs.includes(rung)) return 0;`; `espionageGauntlet.js :: gauntletCatchFactors` — `relationshipTypeBetween(…, text(homeId), targetId)` (TRUTH, home → the venue town). CONFIRMED.
- OP-r1-7/8: `roads/thirdPartyRansom.js` — `if (payerId === homeId || payerId === captorId) continue;` · `if (atOpenWar(a.graph, payerId, captorId)) continue;` · `} else continue;`; `payerRefuseProbability` = `base(motive) + refusing − accepting − SERVED_FRACTION_GAIN × servedFraction` (REFUSE_BASE `friendship 0.02 · succor_ally 0.05 · succor_unbonded 0.25 · leverage 0.55`; REFUSE_TRAIT_GAIN 0.30); `willConvert` → "CAPTOR PRECEDENCE … forced to DEBT". CONFIRMED.
- OP-r1-9: `skeptic/OP-r1-probe/lieWillingness.out` (lawful_evil 0.70–1.00; lawful_neutral up to 0.50; lawful_good 0). CONFIRMED (executed by the skeptic; the lane accepts it — a cure, not a refutation).
- OP-r1-10: `disinformationPlant.js :: commissionedPlantAt` — exact keys incl. `receipt.marketId`, `receipt.marketName`, `PAID_PLANT_PRICE_BANDS.has(…)`, `hostId !== liarId` refused; `informationStatecraft.js :: processLies` step (3): the bluff `{ liarId, subjectId: liarId, audienceId, assertedBand, trueBand: selfBand, seededTick, lineageId, …(mouthpiece ? { spokespersonNpcId })}` keyed `lie:${liarId}:${audienceId}`, "one active bluff per (liar, audience)"; exposure: `if (rec.spokespersonNpcId) { npcDeltas.push({ id: …, kind: 'deception', … }) }`; IN-0a's take: "null for every uncommissioned bluff". CONFIRMED.
- OP-r1-11: `foreignGuestHold.js` — "`caught_spying` is the FIFTH member and the espionage layer's one covert custody cause … the ONE spelling that TR-8's capture will also use"; `FOREIGN_GUEST_HOLD_COVERT_CAUSE = FOREIGN_GUEST_HOLD_CAUSES[4]`. CONFIRMED.
- OP-r1-12: fold §1 req 24 (b) l.229 "the word \"decree\" is the landed Decree Registry's and is not used"; fold §5 l.755. CONFIRMED.
- OP-r1-13: CH §14 "`side: 'help'` … `side: 'harm'`"; "The PARTY volume reads the same board for the requests actors bring to the party"; PT §7.3 `party_request` "the court of a call's settlement". CONFIRMED.
- OP-r1-15: CH §2.1 `aim?: { purpose, destId, sinceTick, reasons, exert?, bodyId? }` on the `paragon` field of `spatialLedgers.npcLedger.{roamers|placed}[wnpcId]` (CH §21 L1). CONFIRMED.
- OP-r1-18 / MG-r1-26: MG §8.1 "`ridingOf(unit)` is DERIVED … a covert operative WALKS"; MG §2 "`ridingOf(worldState, snapshot, unitKey) → boolean`". CONFIRMED.
- OP-r1-19: RN §4.5 "Under `renownLeansEnabled` … `operativeNotoriety01` returns `max(office01, FAME01[fameIn(…)])`". CONFIRMED.
- OP-r1-20: `display/giftsAndDebtsRead.js :: projectAct` — `const actClass = role === 'giver' ? nominalActClass(kind) : 'tribute';`; `nominalActClass` → `'aid'` for any kind but `intervention`. CONFIRMED.
- OP-r1-21: fold l.358 "the owner's ERRAND-ROW SLOT … and ES-2b's custody are ONE PAIRING". CONFIRMED.
- OP-r1-25: `envoyChanceMeetingLedger.js` — "A second successful compromise of the same person toward the same court steps `leaning` to `won_over`"; `applyMeetingLeanLedger(worldState, nextWorldState, { writes, tick, ttlTicks, converted, vanished })` "A fresh write for an existing key REPLACES it"; `CHANCE_MEETING_TUNING.leanTtlTicks: 52`; `corruptionWeb.js :: meetingLeanChannels` reads every lean row (no band filter) and pins one `npcKey` per directed pair. CONFIRMED.
- OP-r1-28: fold §3.4 ruling (5) "the split lives in each resolver's own module … the next advance resolves the docket first"; req 24 (b) "read by the resolver FIRST … in the resolver's own module". CONFIRMED.
- Token census (`D-OP-r1-probe/tokens-r1.out`, `rg -w -i` src · tests · master docs; the ledger docs re-checked with `rg --no-ignore` from inside `docs/` because the script's absolute-path run undercounts there): FREE — `bonded_captive` · `stranger_captive` · `would_not_run` · `slackTicks` · `releaseFromForeignHold` · `foreignHoldRelease`; `stood_down` is LANDED-DESIGN (BD's `hunt_taken` verdict) — NOT used; `ridingOf` · `riding` are MG's (prose-only at master).

## PROGRESS (15:2x CDT) — volume edits applied by script (`D-OP-r1-probe/edits/b1.py … b19.py`, each asserting a unique anchor; snapshot before: `D-OP-r1-probe/OP-before-r1.md`): header · answer · §0 · §1 (OP3 · 4 · 5 · 6 · 7 · 9 · 10 · 11 · 12 · 13 · 15 · 19) · §2.1–§2.5 · §3 · §4 · §5 · §6 · §7 · §8 · §9 · §10 · §11 · §12 · §13 (L4 added) · §14 (rows 25–30 added). Remaining: §15 · §16 · §17 · §18 · §19 CURE RECORD.

## PROBES (this lane, `cure/D-OP-r1-probe/`)
- `slack-rerun.out` — the skeptic's `slack.mjs` re-run unchanged: expectedReturnTick 7, a two-week detour normalizes and lands the envoy home at 9 (lateBy 2). CONFIRMED (executed).
- `lieWillingness-rerun.out` — byte-identical to `skeptic/OP-r1-probe/lieWillingness.out` (diff empty). CONFIRMED (executed).
- `slack-cure.out` — THE CURE checked on the same plan: cured `missionSlack` = 0; the landed validator still accepts the detour (`normalizeRoutePlan` proves no slack) but the cured envoy `via` guard refuses it (projected home 9 > 7); a rescue's one-week `delay` normalizes and makes the envoy late by 1, silence-eligible from tick 8 — the receipted price OP6 names. CONFIRMED (executed).
- `efflines-r1.txt` (host eff lines) · `tokens-r1.out` (census). CONFIRMED (executed).

## THE RECORD
| id | sev | disposition | where (volume) | receipt |
|---|---|---|---|---|
| OP-r1-1 | B | CURED | OP3 · §2.5 · §9 · §11 (iii-b) · §14 r6 · OD-OP-26 | `subsystemRowsWar.js` "all nine immediate WR-7b facts are DM-only"; RULINGS-P6 A.5 |
| OP-r1-2 | B | CURED | answer · §0.1 · §0.3 · OP6 · §2.5 · §3.2–3.5 · §4.2 · §8 · §14 r5/r25 · §18 · OD-OP-6/25 | `expectedRoundTripTick`; `slack-rerun.out`; `slack-cure.out`; RULINGS-P6 B.1 |
| OP-r1-3 | M | CURED | OP3 · §2.2 · §2.5 · §4.2 | `frozenParlayPictures` K4; `envoyDeparturePicture`; A.5 |
| OP-r1-4 | M | CURED | §0.1 · OP7 · §5.3 · §12 OP-3 · §14 r9 · OD-OP-13/29 | `resumeFromEncounter`; `beginEnvoyReturn` `'invalid_state'`; `npcDmVerbs.js` pardon arm |
| OP-r1-5 | M | CURED | §0.1 · §4.3 · §5.1 · §6.3 · §10.1 · §14 r3/r26 | `holdVenueFromEncounter` |
| OP-r1-6 | M | CURED | OP10 · §4.3 · §5.2 · §14 r27 · OD-OP-7 | `catchChance01` friend rule; `gauntletCatchFactors` truth rung |
| OP-r1-7 | M | CURED | §0.1 · OP9 · §2.4 · §2.5 · §5.2 · OD-OP-11 | `resolveThirdPartyRansom` `continue`s |
| OP-r1-8 | M | CURED | §2.4 · §5.2 · §5.3 · §6.4 · §14 r11 · §18 · OD-OP-28 | `payerRefuseProbability` terms; "CAPTOR PRECEDENCE" |
| OP-r1-9 | M | CURED | §0.1 · OP11 · §2.3 · §4.2 · §7.1 · §11 (iii) · §14 r7 | `lieWillingness.out`; B.1 |
| OP-r1-10 | M | CURED (+ the §C STOP below) | §0.1 · OP11 · OP12 · §2.1 · §4.2 · §7.1 · §11 · §12 OP-2 · §14 r28 · §18 · OD-OP-27 | `commissionedPlantAt` keys; `processLies` bluff record; IN-0a "null for every uncommissioned bluff" |
| OP-r1-11 | M | CURED | §0.1 · OP7 · §2.4 · §5.3 · §11 (v) · §12 · §13 L3 · §14 r10 · §16 · OD-OP-4 | `foreignGuestHold.js` "one covert custody cause"; B.1 |
| OP-r1-12 | M | CURED | §5.2 · §10.1 · §10.3 · §12 · §14 r17 · OD-OP-15 | fold req 24 (b) l.229; fold §5 l.755 |
| OP-r1-13 | M | CURED | OP13 · §9 · §14 r30 · §15 | CH §14; PT §7.3; B.1 |
| OP-r1-14 | M | CURED | §2.2 · §4.3 · §5.2 · §6 · §9 · §14 r29 | CH §12.4 |
| OP-r1-15 | M | CURED | §2.1 · §9 · §13 L4 · OD-OP-24 ⭐ | CH §2.1 `aim`; CH §21 L1; B.1 |
| OP-r1-16 | M | CURED (MG side applied by D-MG-r1, re-read) | §3.3 · §15 | A.3; MG §3.3 (a) |
| OP-r1-17 | M | CURED | §2.3 · §9 | owner 08:41; B.1 |
| OP-r1-18 | m | CURED | OP19 · §2.2 · §3.3 · §7.2 · §14 r20 · §16 | MG §8.1 `ridingOf`; A.6 |
| OP-r1-19 | m | CURED | §8 | RN §4.5 |
| OP-r1-20 | m | CURED | §0.1 · §6.6 · §12 · §18 | `giftsAndDebtsRead.js :: projectAct` |
| OP-r1-21 | m | CURED | §9 · §11 · §14 r23 · OD-OP-19 | fold l.358 ONE PAIRING |
| OP-r1-22 | m | CURED | OP15 · §3.3 · §12 OP-1 · §13 L1 · §16 | volume lines |
| OP-r1-23 | m | CURED | §7.2 · §10.2 | §2.3 |
| OP-r1-24 | m | CURED | OP4 · §10.1 · OD-OP-12/30 | brief item 2 |
| OP-r1-25 | m | CURED (+ S-8) | §0.1 · OP8 · §6.2 · §14 r9 · OD-OP-1 | `envoyChanceMeetingLedger.js` step law; `meetingLeanChannels` no band filter |
| OP-r1-26 | m | CURED | §3.5 · §18 l.12 | — |
| OP-r1-27 | m | CURED (ROUTE RN for the values) | §2.4 · §7.1 · §15 | RN §6.1; D-2 "a court speaks with one voice" |
| OP-r1-28 | m | CURED | §2.1 · §5.1 · §10.1 | fold §3.4 ruling (5); req 24 (b) |
| MG-r1-15 | M | CURED (OP's share) | §3.3 · §9 · §15 | A.3 · A.6 |
| MG-r1-26 | m | CURED | §2.2 · OP19 · §16 | MG §16 |
| X-LMG-OP | — | CURED (reconciled) | §3.3 · §15 | A.3; MG §3.3 (a) |
| X-LWS-OP | — | NOTED (no OP edit; FS's line, cite only) | — | `cure/L-FS.md` §5 "OP · MG — none" |

COUNTS: 32 of 32 disposed — 31 CURED · 0 REFUTED · 0 STOP · 1 NOTED; SEAMS-P6: file absent at start (0 ids).

## ⛔ STOP FOR THE CHAIR (one; the volume is cured either way)
- **STOP-C-IN (raised by the OP-r1-10 cure):** RULINGS-P6 §C's IN route "`commissionedPlantAt`'s carrier field" is refuted by `disinformationPlant.js :: commissionedPlantAt` — an exact-key BROKERAGE validator (`receipt.marketId`, `receipt.marketName`, `PAID_PLANT_PRICE_BANDS.has(String(receipt.priceBand))`, `hostId !== liarId` refused). Proposed re-wording for the brackets lane: "IN: `processLies` seeds a carried word as the LANDED self-bluff with the carrier as `spokespersonNpcId` in one fold arm (S-4 (i)) · IN-0a's take reader admits a carried bluff for `plant_taken`, IN declaring how one is told apart (S-4 (ii); a persisted marker is the owner's) · a declared carried-plant shape for third-party claims (a slot)".

## BUILD-TIME STOPS (in the volume)
S-1 RESOLVED (§4.2) · S-4 RESTATED (§7.1: (i) the fold arm's order, (ii) the take admitting a carried bluff — else `false_word` dark) · S-5 RESOLVED by B.1 · S-8 NEW (the freed's positional `npcKey` for the lean; else `debt`) · S-9 NEW (the pardon's release arm extracted byte-identical; else the held-errand rescue arm dark) · S-2 · S-3 · S-6 · S-7 unchanged.

## REFINED (beyond the inputs; each marked in the volume)
(1) the errand verb's three contracts `via` · `delay` · `mark`; (2) ONE release road with the DM's pardon (`releaseFromForeignHold`); (3) a detour's unseen risk by the catch law's neutral inputs at `UNSEEN_RUNG` (`cold_war`, DRAFT); (4) a courtless paragon read at `T4_RUNG.hostile`; (5) a refusal is quiet (OD-OP-28); (6) a mid-leg stop's `delay` applied at the next node reached (A.6's rule); (7) the L-MG item 11 (b) rung split struck from OP (A.6); (8) `map_way` reads only trails known at departure (`since` ≤ the departure tick, BD §2.3's row); (9) a resolution re-reads the custody's own guard (an emptied cell lapses the attempt); (10) a `covert`-face word stamps no mouthpiece.

## OPEN QUESTIONS FOR THE CHAIR
1. STOP-C-IN above (§C's IN line).
2. OD-OP-25 ⭐ — the declared margin `slackTicks` is ES's/WR-7's to mint and the owner's VISIBLE row; until it lands NO envoy ever detours (presence-only), and a co-located rescue makes an envoy late (the silence inference is the receipted price) — confirm that price is acceptable for envoys, or bar envoys' rescues until the margin lands.
3. OD-OP-28 — the refusal is quiet (no betrayal arm): the simplest lawful reading after `turned_by_captor` fell; a betrayal arm would need a declared refusal-input term (D-5's owner's).

## CONFIRMED vs PLAUSIBLE
Every BLOCKING and MAJOR cure was checked against its convicting receipt re-read at master `81f1cd963` (CONFIRMED by read), the two skeptic probes were re-run identically and the slack cure executed (`slack-cure.out`, CONFIRMED); PLAUSIBLE and left to car-0: S-8's positional-key mapping, S-9's byte-identical extraction, S-4 (i)'s fold-arm byte-identity, the departure picture's `strengthBand` scale as a desperation input, and the `processLies` +8 eff estimate.
