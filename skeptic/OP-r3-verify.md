# OP-r3-verify — REFUTING VERIFIER V-OP-r3 over `docs/DESIGN_FP_ARCH_OP.md` (THE OPPORTUNITY), P6b round r3

Seat: V-OP-r3 (Opus 5.5) for chair 6eb7b5b6 (Fable 5.1), 2026-10-20 ~16:3x CDT. I read these WHOLE: the kit README (RESUME BLOCK 3 and the laws), the BOARD's 2026-10-20 lines, `briefs/VERIFY.md`, `briefs/RULINGS-P6.md` (§A–§E), `skeptic/OP-r2-verify.md`, `cure/D-OP-r3.md` and the volume (738 lines; it is byte-identical to the lane's `vol-r3.diff`). I also read the cited CH, RN and MG rows, and master `81f1cd963` (READ-ONLY). I ran no git and no suite. Two of the named inputs do not exist: `skeptic/OP-r3.md` and `skeptic/SEAMS-P6.md` (§E.10: round 3 runs over the r2-verify NEW rows plus §E). Receipts are in `skeptic/OP-r3-verify-probe/receipts.txt` (77 lines).

## COUNTS

**Judged 14: HOLDS 13 · FAILS 1 (a minor; the fail is the new MAJOR) · STOP 0 · NEW 1 (0 BLOCKING · 1 MAJOR).** The two route rows the lane NOTED (X-LMG-OP, X-LWS-OP) are unchanged since r1 and were not judged.

## THE TABLE

| id | disposition | verdict | why / receipt |
|---|---|---|---|
| OP-V3 (M) | CURED (E.5) | HOLDS | §9, OP1, §12 OP-6, r34, §15 and OD-OP-33 all agree with E.5: the home must be the employer or its ally, the jailer must sit at a T4 rung, the champion leaves the lands only by `court_errand`, and a free paragon answers by its own roll. CH l.373 (`answer_call` "bound: inside the lands") and CH l.381 (`court_errand` "never offered until then") match. No bound champion now walks to cells it may not break. The inside-the-lands leg is marked REFINED and agrees with CH l.373. |
| OP-V4 (M) | CURED (E.6) | HOLDS | The twin is minted from the jailer's record. Knowledge comes by presence in the belief presets and by the preset's law in omniscient ones, which matches CH l.683 "the board is the truth" and RN l.421 "no rumor road". The help row still needs an arrived record (r31, r36). The finding is closed by ruling, not by narration. |
| E.7 Q1 | CURED | HOLDS | The dependency is written in §12 OP-1, §12 OP-6 (i), r31 and OD-OP-32. |
| E.7 Q2 | CURED | HOLDS | `jailerOf` (the hall's lord), r35 and OD-OP-31 agree with §0.1 and §5.3. |
| X-DMG2-OP | CURED | HOLDS | MG l.336 "EACH PRICER … `livedLegTicks` … an errand's whole plan". On master, `buildEnvoyRoutePlan` calls `livedLegTicks`, which wraps `namedPersonLegTicks` with `gradeLegMultiplier`. |
| R-PD-8 | CURED (OP half) | HOLDS | CH l.259/261 read "no (a watch kept)" and "no (false reports)" as quoted. B.1 stands. The CH wording is routed, and the lane's open question goes to the SEAMS seat. |
| OP-Vm1 (m) | CURED (OP half) | **FAILS** | The cure opens a new contradiction, logged as OP-V5. |
| OP-Vm2 (m) | CURED | HOLDS | On master, `relationshipTypeBetween` returns the edge type with no since-tick. The staleness is declared DRAFT. |
| OP-Vm3 (m) | CURED | HOLDS | `RansomRec.startedTick` and `captureCauseId`, as quoted (lane receipts). |
| OP-r1-1 · OP-r1-5 · OP-V1 · OP-V2 · STOP-C-IN | NOTED | HOLD | Not regressed: r31, r32, r33, r34 and OD-OP-27 still stand. |

## NEW FINDINGS

| id | sev | site | claim | receipt | cure |
|---|---|---|---|---|---|
| OP-V5 | MAJOR (PLAUSIBLE) | §9 "its exert there answers the call … reads … the source's `venueId` as here"; §15 CH; OP-6 | The rescuer's ordinary calling exertion fires at the JAILER's town. | CH §4.5: "(or it arrives where its domain calls), it EXERTS". CH §6.1 order row: "a magistrate, hears the people's grievances in <town>" (×0.8 at `exertion.settlementId`). CH l.229 `patrol_will` "a magistrate `1 + d`". CH l.242/569: the deed `paragon_exerted` on its living side, "its target the town". OP carves none of these out (0 hits). The result: a champion breaking Kell's cells calms Kell's streets, stiffens Kell's watch, and earns an admirable deed AT Kell. A villain in an occupied venue harms the occupied court, not the occupier (D.2's class). | For a `captive_held` source, the exert is the rescue card only. It writes no calling stay, no seam lean and no `paragon_exerted`, and the deed is OP's `opportunity_act`, targeted at `jailerOf`. Route to CH §4.5, §6 and §2.2b. |

Minor (not counted): (1) §2.5 `detourCandidates` and OP16 still price by bare `namedPersonLegTicks`, which drops the grade multiplier that §3.3 now names. (2) CH l.427's `court_errand` classes "`religious · diplomatic · covert · commercial · factional` by domain" have no `order` class, while `captive_held` is an `order` call. E.5's road may never carry an order champion (PLAUSIBLE; for the SEAMS seat). (3) OP-1's "the persisted demand is the only arrival" omits OP3 (b)'s RN telling. (4) R-PD-8's CH route should also name CH l.569's "on its LIVING side". (5) OP-6 FIRST-VISIBLE's "bound … inside its employer's lands" for a roads hostage is likely unreachable (the captor's own town).

## CONFIRMED vs PLAUSIBLE

Every HOLDS is CONFIRMED by read, of master `81f1cd963` or of the ledger volumes at the cited rows. OP-V5 is PLAUSIBLE: it is a text-level composition of CH §4.5, §6.1 and §2.2b with OP §9, and nothing was executed.
