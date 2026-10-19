# D-CH-r5 — THE CHAMPIONS, round-5a disposition lane (Opus 5.5; chair 0a2e8bd9 continuing a73343ed; 2026-10-19 04:02–04:4x EDT by `date`)

Lane: `docs/DESIGN_FP_ARCH_CH.md` (read WHOLE first: 1,173 lines, sha1 `222dd3ff…` — the verifier's snapshot, unchanged since 22:30) + this file + `cure/D-CH-r5-probe/`. Never git; never the suite; master `81f1cd963` read-only (the detached worktree of `briefs/RESEARCH-COMMON.md`, HEAD verified `81f1cd963553…`).

Inputs read WHOLE: README (RESUME BLOCK 2), COMPILE-COMMON, DISPOSE, RESEARCH-COMMON, RULINGS-PL-MN, -AFTER-RESEARCH, -AFTER-COMPILE, CHAIR-NOTES 1–18 (incl. 17), RULINGS-ROUND1 (+addendum), -ROUND2, -ROUND2b (+addendum), -ROUND3 (§A–§G), -ROUND4 (§A–§E), -ROUND5 (§A–§C); the BOARD's owner lines on the champions, the warden, the hunt and the hidden ways (18:27–22:52, 04:02); `skeptic/CH-r4-verify.md` WHOLE (6 fails, 3 new, 9 notes) and its probe; `skeptic/SEAMS-r4.md` WHOLE (ROUTES "CH: SEAMS-r4-6 · -7 · -13 · -14"); `skeptic/BD-r4.md` WHOLE (ROUTES' CH line: BD-r4-17, BD-r4-3); the ROUTES of all ten `cure/D-*-r4.md` (CH lines from BD · FOLD · PR · PT · RN; none from MN · PL · PS · ST); THE BODIES' round-5 text as it stood while this lane wrote (`cure/D-BD-r5.md`, BD §2.2/§2.3/§2.5/§5.2/§9.5/§9.9/§9.11/§19.0b), read so each shared shape is written once on both sides.

Volume at close: 1,231 lines (+58), sha1 `172431fc…` (`D-CH-r5-probe/CH.after-r5.sha`); 64 `(fp-final r5)` brackets; `volume.diff` against `CH.before-r5.md`; `tablecheck.out` 25 tables · 0 strict mismatches.

## 1. MEASURED FIRST (the measurements that could refute the inputs; CONFIRMED by read or execution at `81f1cd963`)

- **m1 (F1) the one exclusions writer.** `npcLedgerFacets.js :: normalizeExclusionEdges` — one edge per (door, kind): "`if (prior.indefinite === true) continue; // already the strictest`", a later window wins over an earlier; `npcLedger.js :: addExclusionEdge` / `liftExclusionEdges` / `isExcludedFrom(worldState, wnpcId, settlementId, tick, kinds)`; `npcDmVerbs.js :: undoDmVerb` — "pardon: re-shut every door, with its original window". The verifier's `banishThenVerdict.mjs` RE-RUN → `banishThenVerdict.rerun.out`, byte-identical to its `.out` (the court's later ban LOST by the round-4 inverse). The cure MODELLED → `banKeysWindow.mjs` / `.out`: F (reverse order) the key's window re-written — barred at 150, open at 230; S45 (forward) the prior window restored exactly (barred 250, open 310); G (window passed by the undo) nothing re-written, key dropped; H (no prior, no key) open; I (prior authored indefinite) stands; J (re-ban) one key, newer episode, stricter window 300.
- **m2 (B.4 · BD-r4-3) master's hidden rung.** `routeNetworkConsumers.js`: "`HIDDEN_PATH_KINDS = Object.freeze(['covert_envoy', 'smuggler', 'wanderer'])`", `mayUseHiddenPaths` "fails CLOSED", `hiddenHopsFor(worldState, kind)` "returns that callback for a wanderer or a smuggler and NULL for anything else … NULL on a dark world too" (`routeLifecycleActive`); `routeNetworkLedger.js :: ROUTE_GRADES` "`['highway', 'road', 'track', 'hidden']`", `routeLifecycleEnabled` VIRTUAL; `routeNetworkConsumersTransit.js :: GRADE_LEG_MULTIPLIER` "`hidden: 2`" ("THE HIDDEN RUNG IS 2 BECAUSE H3'S IS … The agreement is pinned instead"); `npcCirculationTransit.js :: nextHopToward` — a hidden hop replaces the road hop only "when the hidden way lands strictly closer … Ties keep the road"; `planWanderLeg` — "`gradeMultiplier: hop.hidden ? NPC_CONSEQUENCES_TUNING.HIDDEN_PATH_SLOWDOWN : 1`". ⇒ a paragon (a named person on H3's wander physics) is the landed `wanderer` kind: NO new CH access token; a way beside the road on the same pair is never chosen by `nextHopToward` (so CH's week chooses it, opening the same leg shape).
- **m3 (F5 · SEAMS-r4-13) the arrival.** `spatial/distanceRead.js :: hopWeeks` — "same settlement ⇒ 0 … unreachable / absent pair ⇒ null"; `spatial/rumorNetwork.js :: advanceRumorLedgers` — "`const travelTicks = Math.max(1, finiteNumber(weeks, 1));`". EXECUTED `arrivalForm.mjs` → `arrivalForm.out`: with no digest or an unknown pair `hopWeeks` is `null` and the round-4 bare sum `10 + null` is `10` — the report lands AT ONCE (not `NaN`, as SEAMS-r4-13 reasoned; the verifier's "lands at once" is the executed truth); RN's guarded form gives 11; the same town gives 10 (0).
- **m4 (n6) the blowback source.** `corruptionWeb.js :: foreignExposuresFrom` copies only `settlementId · patronId · patronKind · name · importance · kind` — a tie kind has no home there; it rides the receipt and the deed.
- **m5 (n8) the landed market.** `mercenaryMarket.js` header: "Where local mercenary / adventurer-guild institutions exist (the catalog SUPPLY), that shortfall becomes DEMAND they answer"; WC's volume: "THE SUPPLEMENT IS UNTOUCHED … Hiring FOREIGN force remains a capability read, exactly as it is today … IF THE CHAIR LATER UNPARKS THE FORCE MARKET, it is its own wave … an owner-gated widening".
- **m6 (F2) the den read.** ST §2.4 `believedDenOf(worldState, courtId, siteId, snapshot)` — one read over the holder's one belief, every arm named ("in the omniscient arm a kept-secret site is known to no court BY THE TRUTH ARM, while a WITNESS still informs the court that saw"); ST l.183 `sitesNear(worldState, settlementId, digest?)` — "every site attached to a settlement" (no observer).
- **m7 (B.12 · B.13 · B.5 · F4 · n7) THE BODIES' r5 shapes** (BD's lane mid-write; quoted): `leaderOf(worldState, bodyId)` "a READ of CH's `paragon.leads` through `paragonOf`", `BODY_LEADER` "writes THROUGH CH's leaf `paragonRetainer.js :: setLeader`"; `knownTrailsOf(worldState, snapshot, settlementId, tick)` with the office arm "HELD by a person of THE WARDEN ARCHETYPE — for a paragon, CH's ONE predicate `isWardenParagon` … NEVER a warden merely RETAINED"; `hiddenWayEdges(worldState, digest)` "ONE read over ONE ladder"; `hunt_won` "at the mission's close … DOER the LEADER the card named (`ledBy` — a paragon or a company … an office-holder on the person ledger by the same registered row)"; the bounty call "`order` for a gang or a flock, `wildland` for a beast", its source "`{ kind: 'body_bounty', courtId, bodyId }`"; the latch `exposedAt` "replacing the tie's `exposed`". PT l.271 and PR l.299–300 (r5) already carry B.5/B.13 and BD's source form.
- **m8 token census** `census-r5.sh` → `census-r5.out`: `heldOffice` · `public_security` · `securityOfficeOf` · `tieKind` · `withstood` · `warden_attempted` 0 · 0 · 0 · 0 · 0; `bribed` 3 src prose, 0 quoted; `body_bounty` 0 src (BD's); `wanderer` 31 src, 4 quoted (the landed kind); `hiddenHopsFor` 1 src; `untilTick` 5 src (the edge's own field).

## 2. THE RECORD (id · severity · disposition · where · receipt)

| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| F1 · SEAMS-r4-6 · D-PT-r4 CH (2) | **M** | CURED | P2 `banKeys` · §11 Authored/Lifted · L3 · CH-5 · OD-CH-34/45 · S45b | EXECUTED m1 (`banKeysWindow.out` F; re-run byte-identical); PT §2.1/§6 R4-1's field and rule, one sense on two records |
| F2 (A.16 NOTED-WRONG) | **M** | CURED | §14 wildland row · BELIEF (a) · S38 | m6: the den read is `believedDenOf`, never presence; RULINGS-ROUND4 A.16, ROUND5 A.4 |
| CH-X1 · SEAMS-r4-7 · B.5 | **M** | CURED | §2.2b `hunt_won` + rows · §18 champion arm · CH-3 · §12.4 · OD-CH-43 · S48 | B.5 verbatim; one door `mintHuntWon`, doer `ledBy` (paragon · corps · office-holder), `sourceEventRef` the engagement; BD/PR/RN r5 texts agree (m7) |
| CH-X2 · B.12 | **M** | CURED | P2 `leads` · §7 · §4.2 (3) · L10 · CH-4 · OD-CH-44 · S49 | B.12 verbatim; `setLeader` one writer, one leader per body; BD's r5 strikes `leaderRef` (m7) |
| F3 · D-PR-r4 CH (a) · D-BD-r4 CH (d) · B.13 | m | CURED (+REFINED) | §5 trail arm · P1 `heldOffice` · §2.2 `securityOfficeOf` · §4.2 · §18 · §19 · L1b · CH-4 · OD-CH-42/46 · S48 · S54 · §24 | B.13 verbatim; the retainer widening struck; the office reachable by a paragon only by the DM's appointment |
| F4 · D-PT-r4 CH (3) | m | CURED | §14 bounty row | BD's source `{ kind: 'body_bounty', courtId, bodyId }` (m7); PT l.271 already reads it |
| F5 · SEAMS-r4-13 · D-RN-r4 CH (a) | m | CURED | §8 · §9 road 1 · OD-CH-40 · S52 | RN l.269 verbatim; EXECUTED m3 |
| F6 · SEAMS-r4-14 · D-FOLD-r4 CH | m | CURED | §11 road arm · §18 row and scope · §5 · S50 | the fold's WHERE ↳ r4 ("THE TRAIL IS NO SIXTH WHERE KIND") |
| CH-X3 | m | CURED (+REFINED) | §11 attempt card · §2.2b `warden_attempted` + rows · §18 · §19 · OD-CH-41/47 · S53 · §24 | the chair's L-BD 41 ruling (BOARD 18:33: "a gang may bribe or kill the warden — a deed through CH's road arm"); BD §9.5 l.595 already sends it here |
| BD-r4-3 · B.4 | B (BD's) | CURED | §0 two rows · §5 trail arm · §11 · §17 · §19 · CH-1 · OD-CH-42 · S55 | m2; one network, one seam (`planWanderLeg`'s `hiddenHopsOf`), one price |
| n1 | m | CURED | CH-7 car-0 | `exertion.{tick, outcome, settlementId}` |
| n2 | m | CURED | §5 · OD-CH-42 | RULINGS-ROUND4 §E ("the LANDED constant wins") |
| n3 | m | CURED | §9 Tier · §11 step 3 · S8 | one omniscient reading: the secret unmodelled, so never a ground of refusal |
| n4 | m | CURED | §2.2 `gateDefault` · §11 step 2 | the crown's proclamation the leaf's one named truth-read (a public edict, `readBeliefRelationship`'s own reason) |
| n5 | m | CURED | §18 champion arm · OD-CH-43 | the hypothetical choice |
| n6 | m | CURED | §9 ONE IDIOM · OD-CH-14 | m4; `tieKind` on the receipt and the deed; `exposedAt` the one latch word (BD r5) |
| n7 · B.15 · D-BD-r4 CH (b) | m | CURED | §14 bounty row · S48 | one call, one domain (BD m7); the hunting callings read it |
| n8 · D-BD-r4 CH (f) | m | CURED | §16b · OD-CH-36 | m5; one owner per piece; BD/fold halves routed |
| n9 | m | CURED | §4.2 (3) | one act, two words; BD's r5 says "MIRRORS" (m7) |
| SEAMS-r4-6/-7/-13/-14 | — | CURED | = F1 · CH-X1 · F5 · F6 | — |
| BD-r4-17 | m (BD's) | NOTED | — | BD's own cite; BD r5 l.635 names `hunt_body` |
| D-BD-r4 CH (a) · (c) · (e) | — | NOTED | §7 · §4.2 · §9 | held in 4b; (a) strengthened by CH-X2, (e) by n6 |
| D-PR-r4 CH (b) · (c) | — | NOTED | §4.2 · §4.4 · §5 | held in 4b |
| D-PT-r4 CH (1) | — | NOTED | §11 step 3 | held in 4b (RU-2) |
| D-RN-r4 CH (b) | — | NOTED | §7 | held; B.12 makes `leads` the record BD reads |
| D-MN/PL/PS/ST-r4 → CH | — | NOTED | — | nothing routed |
| RULINGS-ROUND5 §A | — | NOTED | — | no row names CH |
| B.5 · B.12 · B.13 · B.15 | — | CURED | = CH-X1 · CH-X2 · F3 · n7 | — |
| B.22 (CH's five ROUTED-UNAPPLIED) | — | CURED | = F1 · F3 · F4 · F5 · F6 | — |

**Counts: 47 items — 37 CURED · 0 REFUTED · 0 STOP · 10 NOTED** (the volume's §25 Round 5a block carries the same table).

**After the resumed pass (§8): 56 input items — 38 CURED · 0 REFUTED · 0 STOP · 18 NOTED, plus 2 self-found cross-volume drifts CURED as REFINED (X-r5-1, X-r5-2).**

## 3. STOPs
None.

## 4. REFINED (each bracketed in the volume, vetoable)
1. **`heldOffice` / `securityOfficeOf` (P1, §2.2, L1b, OD-CH-46).** With B.13 striking the retainer reading, a CHAMPION warden (the owner's "or whoever you deem is the most appropriate champion archetype") reaches the office's ways only by HOLDING the office, and nothing wrote that a paragon holds one — THE BODIES' office read (1)(i) had no writer. The DM appoints a BOUND paragon (`introduce`), one holder per court (a second refused with a receipt), the office lapsing with the bound tie. Alternative: every bound warden paragon is its court's office-holder (CH9's "BOUND = AN OFFICE") — doubtful under B.13's "never to any retained warden", and two bound wardens would share one office.
2. **The attempt on a warden (§11, OD-CH-47).** An arm of `person_at_the_gate`'s road arm (no new kind): `withstood · bribed`, default `withstood`, `bribed` only where the wages go unpaid (never for a paragon until W-COIN), its effect THE BODIES' `bribe` row's; ONE `warden_attempted` deed minted by the card's close (the hearing's owner mints, B.5's law); death never a verdict (CH3). Alternative: the verifier's first option, a kind of THE BODIES' own.
3. **One leader per body; B.12's "resignation" read as the DM's removal (§7).** `setLeader` drops a prior leader's `leads` in the same write; no engine step-down (purpose only by the DM). Alternative: a weekly step-down choice.
4. **A way beside the road on the same pair (§5).** `nextHopToward` never prefers it ("Ties keep the road"), so the paragon's week chooses it and opens `planWanderLeg`'s own leg shape at the same price — read as within "one seam, one price".
5. **§12.4 aligned with B.2 · B.5 · B.7** (rows that name BD and the fold, not CH): the withdrawn "a good conclave takes no hostage" absolute replaced by the god's axes as a weight; "the freer's deed" named as the led hunt's `hunt_won`; the three ransom closings stated as B.7's partition.

## 5. ROUTED (the other-lane halves; one line each — volume · exact edit)
- **BD** §2.3 `knownTrailsOf` office arm · §9.11 (1)(i): "a paragon HOLDING the office" → "the paragon CH's `securityOfficeOf(worldState, courtId)` returns (the DM's appointment, CH P1 `heldOffice`), then `isWardenParagon` on it; else the roster `warden`".
- **BD** §9.5 "A WARDEN IN THE WAY" (l.595): the attempt is CH's `person_at_the_gate` road-arm card (`withstood · bribed`, default `withstood`; WHERE `road (a, b)` or `settlement`); its ONE deed is CH's `warden_attempted` (doer the named gang); `bribed`'s effect is BD's `bribe` row; "or to KILL him" stays the gang's CHOICE, never an outcome (the warden's death is the DM's own `kill`).
- **BD** §6.8 (b) (l.484) and §19 (9): "HIRES OUT to courts through the parked MERCENARY MARKET (WC (e), closed into CH …): contracts as ties, the hired swords a unit in WC's union" → "supplies the LANDED market `mercenaryMarket.js` (its own town's shortfall; `mercSupplementOf` untouched); a cross-court hire is CH's corps alone; an institution contracting abroad is WC's parked force market unparked — owner-gated, WC's".
- **BD** §10.4 (l.672) "the tie's kind in its metadata" → "the tie's kind as `exposeCovertHire`'s `tieKind` (`employed · sponsorship`), carried on the receipt and the `covert_hire_exposed` deed, never the blowback source (`foreignExposuresFrom` copies no such field)".
- **BD** §2.2 l.231 / §6.10 l.495 "its resignation that drops `leads`" → "the DM's removal (`BODY_LEADER` remove)" — CH admits no engine step-down (CH §7; vetoable).
- **RN** §6.1 `paragon_act` block: CH's registered kinds gain `warden_attempted` (doer a NAMED body by its RN key `g:<bodyId>`, target the warden `p:<wnpcId>`; two rows, bribe and strike); `hunt_won`'s doer any leader the card names (`p:` · `u:`) — the same as BD's route (a) to RN.
- **PT** l.271 "(a court knows its own needs by presence)" → "(… by presence — save a DEN, known only through ST's `believedDenOf`, CH §14)".
- **FOLD (P4)** §3.4 `person_at_the_gate`: the attempt arm (`withstood · bribed`, default `withstood`; WHERE `road (a, b)` · `settlement`; no new kind, the count unchanged); §5: `heldOffice` (`public_security`), `securityOfficeOf`, `tieKind`, `warden_attempted`, `withstood · bribed`, `banKeys.untilTick`; §7: OD-CH-46 · OD-CH-47 rows (by delegation, vetoable); CHAIR-NOTES 16's row: "the NAMED company's cross-court hire closes into CH; a gang-founded institution supplies the landed W-C2 market".
- **PR · ST · PS · PL · MN:** none (PR's r5 text already carries B.5 at l.299 and B.13 at l.300; ST's `believedDenOf` is read as written).

## 6. OPEN FOR THE CHAIR
1. REFINED 1 — keep the DM's office appointment (`heldOffice`), or read every bound warden paragon as its court's office-holder?
2. REFINED 2 — the attempt on a warden as CH's road-arm card (as the chair's L-BD 41 line says), or a kind of THE BODIES' own?
3. B.12's "resignation" — the DM's removal only (as cured), or an engine step-down?
4. n8 — confirm CHAIR-NOTES 16's "the parked mercenary market … closes into CH" means the NAMED company's hire; an institution contracting abroad would then be the parked market unparked (WC's "owner-gated widening").

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED by execution: F1's cure (`banKeysWindow.out`, modelled over master's one writer) and the verifier's conviction re-run byte-identical; F5's arrival forms (`arrivalForm.out`, master's own `hopWeeks`); table integrity (25 tables, 0 strict mismatches); the token census. CONFIRMED by read at `81f1cd963`: the hidden rung (`HIDDEN_PATH_KINDS`, `hiddenHopsFor`, `ROUTE_GRADES`, `gradeLegMultiplier`, `nextHopToward`'s strict rule, `planWanderLeg`'s multiplier), `hopWeeks`' null, the relay's `travelTicks` line, `foreignExposuresFrom`'s fields, `mercenaryMarket.js`'s header, the exclusion merge and the pardon replay. CONFIRMED by quoting the siblings' current text: BD r5 (m7), ST §2.4, PT l.115/l.271, PR l.299–300, RN l.246/l.269, the fold's WHERE ↳ r4. PLAUSIBLE, not upgraded: that BD's lane calls `securityOfficeOf` and the attempt card as routed; the host line count (`npcDmVerbs.js` ≤ 12 at CH-5); every DRAFT constant (the `warden_attempted` cells included); that a way beside the road chosen by the week is "one seam" as the chair meant it.

## 8. RESUMED 2026-10-19 07:31–07:5x EDT (the same lane re-seated by the workflow's resume; Opus 5.5)

The volume was byte-identical to round 5a's close (sha1 `172431fc…` = `CH.after-r5.sha`), so nothing above was redone. The pass re-verified the record and re-read every sibling's CLOSED round-5 text at CH's seams. Three of those texts closed after this lane quoted them: BD 04:09, RN 04:29 and PT 04:23.

**Re-executed, byte-identical:** `banKeysWindow.rerun2.out` matches `banKeysWindow.out`; `arrivalForm.rerun2.out` matches `arrivalForm.out`; `banishThenVerdict.rerun2.out`, the verifier's conviction, matches its own `.out`. The strict table check gives 25 tables and 0 mismatches (`tablecheck.resume.out`). The denominator was re-derived from the inputs: CH-r4-verify gives 6 fails, 3 new and 9 notes; SEAMS-r4 routes to CH give -6, -7, -13 and -14; BD-r4 routes to CH give -3 and -17; the ten r4 ROUTES give BD (a)–(f), PR (a)–(c), PT (1)–(3), RN (a)–(b), FOLD (1), with none from MN, PL, PS or ST; RULINGS-ROUND5 §A names CH in no row, and §B names CH in B.4, B.5, B.12, B.13, B.15 and B.22. Every one of these is in §2.

| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| X-r5-1 (self-found) | m | CURED (REFINED) | §2.1 P2 comment · §7 · CH-4 · L10 · S49 · OD-CH-44 · the record | BD §2.5 now reads "`bodyLeaderOf` … (`leaderOf` bare is a module-local function in `urbanFabricKernel.js`, avoided — `census-r5b.out`)". At master, `src/domain/worldPulse/urbanFabricKernel.js` l.471 has "`function leaderOf(stocks) {`" (`census-r5-resume.out`: `leaderOf` src 1; `bodyLeaderOf` 0). CH had cited BD's mid-write name 11 times; all 11 are renamed. |
| X-r5-2 (self-found) | m | CURED (REFINED) | §19 `paragonsEnabled`/`paragonRetainersEnabled` rows · CH-1 leaves · CH-1 and CH-4 wave rows | BD §13 l.737 reads "the BOUNTY and THE HUNT LED MOVE to `bodyEffectsEnabled` (B.16)". BD §8.5 l.555 reads "the bounty's CALL on CH's board … light with `bodyEffectsEnabled`". RN §3.1 l.233 reads "`hunt_won` also THE BODIES' `bodyEffectsEnabled`". CH had gated all of them on `bodiesEnabled`. `leads` and the road arm keep `bodiesEnabled`. |
| D-RN-r5 CH (b) | m | CURED | §9 ONE IDIOM | RN l.208/l.270 `leak:body:<bodyId>:<courtId>:<sinceTick>` ("the employing or the sponsoring court"); BD §7.1 `<employerId>`, §10.4 `<sponsorId>` — the same slot; CH named the employer only |
| D-RN-r5 CH (a) · (c) | — | NOTED | §2.2b · §8/S52/OD-CH-40 | already cured in 5a (CH-X1, F5); read at 07:3x |
| D-PT-r5 CH (the bounty's domains) | — | NOTED | §14 | already cured in 5a (n7 · B.15) |
| D-BD-r5 CH (a)–(e) | — | NOTED | §5 · §2.2 · §2.2b · §9 · §14 | already cured in 5a (B.4/B.13 · F3 · CH-X1 · n6 · F4); BD l.1040 read at 07:3x |

**Cross-volume agreement found, so nothing is owed by these volumes on these points.**
- RN §3.1/§6.1 (l.129, l.233, l.246, l.397, l.648, OD-RN-49) agrees with B.5: one door, CH's `hunt_won`; RN's value rows equal CH's (`0.70 · 0.65 · 0.65`, `0.40 · 0.60 · 0.70`).
- PR l.301, l.426, l.601, l.752 and l.759 agree with B.5.
- BD l.231 and l.495 agree with B.12: no stored `leaderRef`, and the leader is written through `setLeader`.
- BD l.245 and l.633 agree with B.13: the office arm, `isWardenParagon` or the roster role `warden`.
- BD l.616 and PT l.271/l.276 agree on `body_bounty`.
- The signatures `knownTrailsOf(worldState, snapshot, settlementId, tick)`, `hiddenWayEdges(worldState, digest)` and `predictedPlaceOf(worldState, snapshot, settlementId, bodyId, tick)` are spelled the same in CH, BD, PR and PS.
- ⭐ PT has ALREADY APPLIED this lane's PT route: l.271 reads "save a DEN, a call the court knows only through ST's `believedDenOf`".

**ROUTED — updated (one line each: the volume and the exact edit).**
- **PR** §2.5 l.191, "which BD reads (`leaderOf`)" → "which BD reads (`bodyLeaderOf`, BD §2.5)". This is new (X-r5-1), and PR's lane is being resumed.
- **PT:** nothing more. The §5 PT route is APPLIED (PT l.271, l.847).
- **BD:** the five §5 routes are still owed, each confirmed by a 07:3x read:
  - `securityOfficeOf` has 0 hits in BD;
  - `warden_attempted` has 0 hits in BD;
  - l.484 still reads "HIRES OUT … through the parked MERCENARY MARKET";
  - l.672 still reads "the tie's kind in its metadata";
  - l.231 and l.495 still read "its resignation".
- **RN:** the `warden_attempted` rows are still owed (0 hits in RN).
- **FOLD (P4):** still owed as in §5. The FOLD r5 lane had not closed at 07:3x.

**Open for the chair:** unchanged, the four items of §6.

**CONFIRMED vs PLAUSIBLE.**
- CONFIRMED by execution (this pass): the three re-runs, byte-identical; the table check; the census of `bodyLeaderOf`, `leaderOf` and `bodyEffectsEnabled`.
- CONFIRMED by read: every sibling line quoted in this section, and master's `leaderOf` at `urbanFabricKernel.js` l.471.
- PLAUSIBLE, not upgraded: that the resumed PR, MN and FOLD lanes leave CH's seams as read at 07:3x (their files may still change; round 5b's verifier re-reads them).

Volume after the resumed pass: 1,237 lines, sha1 `bded0f5d…` (`CH.after-r5-resume.sha`). The diff against `CH.before-r5-resume.md` is in `volume.resume.diff`: 13 lines changed and 6 added.
