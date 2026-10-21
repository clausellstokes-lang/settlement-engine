# OP-r2-verify — REFUTING VERIFIER V-OP-r2 over `docs/DESIGN_FP_ARCH_OP.md` (THE OPPORTUNITY), P6b round r2

Seat: V-OP-r2 (Opus 5.5), chair 6eb7b5b6 (Fable 5.1), 2026-10-20. I read these WHOLE: the kit README (RESUME BLOCK 3 and the laws), `briefs/VERIFY.md`, `briefs/SKEPTIC.md`, `briefs/RESEARCH-COMMON.md`, `briefs/RULINGS-P6.md` §D, `skeptic/OP-r1-verify.md`, `cure/D-OP-r2.md` and the volume (707 lines). Three of the round's inputs DO NOT EXIST: `skeptic/OP-r2.md`, `skeptic/SEAMS-P6.md` and the siblings' `-r2` skeptics. The round's inputs are therefore the r1 verifier's FAILS and NEW rows and its STOP, as RULINGS-P6 §D.13 says. The code of record is master `81f1cd963` (READ-ONLY). I ran no git and no suite. Receipts are in `skeptic/OP-r2-verify-probe/receipts.txt`, and the lane's mouthpiece probe was re-executed as `mouthpiece-key-rerun.out` (exit 0).

## COUNTS

**Judged 5 (1 BLOCKING · 3 MAJOR · the ruled STOP): HOLDS 5 · FAILS 0 · STOP 0 · NEW 2 (0 BLOCKING · 2 MAJOR).**

## THE TABLE

| id | disposition | verdict | why / receipt |
|---|---|---|---|
| OP-r1-1 (B) | CURED (D.1) | HOLDS | The help row exists only from an arrived record (`toldBy`), and its venue and captor are copied from that record. The receipts match master: `mintRansomClaim` sets `claimantId: captorId`, `ransomMessageLegs` sets `demandLeg.fromId = venueId`, `RansomRec` has `id`/`captorId`, and the stage persists nothing ("NOTHING IS PERSISTED HERE"). OP3 (b), `detourCandidates`, row 31 and OD-OP-14/32 agree. The harm twin's residue is OP-V4. |
| OP-r1-5 (M) | CURED (D.2) | HOLDS | `legalEncounterVenue` returns `occupied_enemy_settlement` only when "`occupierId === actor`". The kind survives on the errand's encounter (`venueRef: venue.encounterRef`, a member of `ENCOUNTER_KEYS`), and `captorId` is `encounter.interceptorId`. `hostRung` is one plain field of `gauntletCatchFactors`. Every jailer site reads `jailerOf`. |
| OP-V1 (M) | CURED | HOLDS | `npcId` = `${sid}:${npc.id…}`, `OriginRef.rosterId` is "the POSITIONAL slot id", `subjectByDurableId` requires both halves to agree, and `pickMouthpiece` and `buildLiveNpcIds` both use `npcId`. Re-executed: the durable key reads weight 1 and the positional key 0.479. |
| OP-V2 (M) | CURED (OP half; CH ROUTED) | HOLDS | `aim.destId` exists (CH §2.1). The route names the exact bracket. The cure's side effect is OP-V3. |
| STOP-C-IN | RULED §D.3 | HOLDS | §15 IN and OD-OP-27 restate D.3 verbatim in substance. |

## NEW FINDINGS (introduced by the cures)

| id | sev | site | claim | receipt | cure |
|---|---|---|---|---|---|
| OP-V3 | MAJOR | §9 "a BOUND champion answers only where that venue lies inside its employer's lands"; §14 r34; OD-OP-33 | The destination moved to the venue, but the lands rule was kept. | CH §4.2 `answer_call`: "bound only inside the employer's lands"; CH l.117 (a bound paragon leaves its lands only with an army or by `assign`); OP §4.3's friend rule (the jailer must be T4 toward the rescuer's court). The only bound champions now admitted are those whose lands hold the cells, which are the JAILER's own or its allies'. In the omniscient default ("the board is the truth") such a champion walks to the venue and can never act there. That is incoherent on scrutiny ("Varn's champion answered Tolle's call at Varn's cells"). | `answer_call` on a `captive_held` source should be a candidate only where the paragon's court (none for a free paragon) is not the jailer and sits at a T4 rung toward it. In practice, bound champions answer only to free a captive from an occupied member town of their own court. Route to CH. |
| OP-V4 | MAJOR | §9 harm twin "known there by presence alone" (the CH §14 route says the same) | The help row is known through its arrived record "in EVERY info mode", but the harm twin carries no such rule. | CH §14: presence-only sources are still "the truth" under the omniscient default. `subsystemRowsWar.js`: "all nine immediate WR-7b facts are DM-only until a separate observation carrier earns public knowledge". OP3: "WR-7b's facts are DM-only in every preset". In the default preset, every villain's board would list each foreign-guest hold. | The harm twin should be known only by an observer standing at the venue, in every info mode. CH's omniscient arm should skip it, as it skips a den. |

Minor (not counted): (1) CH's `work_here`/§4.5 exert gate still reads "a call … stands here", so the §15 ask for "the exert's offer … at the venue" needs the same CH bracket. (2) n4's "the court's OWN pacts at `departedTick`" reads pact history that the graph does not store, PLAUSIBLE. (3) `toldBy.tick` for a roads ransom is unnamed (presumably `startedTick`).

## CONFIRMED vs PLAUSIBLE

All five holds are CONFIRMED by read at `81f1cd963`, and OP-V1 is also CONFIRMED by re-execution. OP-V3 and OP-V4 are CONFIRMED as text-level admissions (CH §4.2/§14 against OP §9). Whether a jailer's champion would actually rank the call first is PLAUSIBLE.
