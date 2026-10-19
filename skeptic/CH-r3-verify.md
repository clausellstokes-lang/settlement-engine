# CH-r3-verify — the refuting verifier for THE CHAMPIONS, P3 round 3b (V-CH-r3, Opus 5.5, chair 0a2e8bd9 continuing a73343ed; 2026-10-18 18:44 EDT by `date`)

**COUNTS: 31 holds · 3 fails (all 3 ROUTED-UNAPPLIED) · 0 stop · 0 new BLOCKING · 0 new MAJOR (2 new minor) · routedUnapplied 3.**

**Inputs.** I read these whole:
- the kit README, including RESUME BLOCK 2;
- the BOARD;
- VERIFY;
- RULINGS-PL-MN, -AFTER-RESEARCH and -AFTER-COMPILE;
- CHAIR-NOTES;
- ROUND1 (with its addendum), ROUND2, ROUND2b (with its addendum), and ROUND3, including §D and §E;
- `skeptic/CH-r2-verify.md` and `cure/D-CH-r3.md`, with its probe directory;
- the ROUTES sections of all nine `cure/D-*-r3.md` files.

**The volume.** I read `docs/DESIGN_FP_ARCH_CH.md` whole: 1,094 lines, sha1 `1c821fcb…`. That is unchanged since the lane wrote it at 18:08, and the snapshot is in `CH-r3-verify-probe/CH.at-verify.md`.

**Code of record.** Master `81f1cd963`, read-only.

**Probes**, in `skeptic/CH-r3-verify-probe/`:
- I re-ran the lane's `findingsHome.mjs` and `banLapse.mjs` against master. Both outputs are byte-identical to the lane's.
- `tablecheck.py` found 23 tables and 0 pipe mismatches.

I did not touch git or the suite, and edited no other file. §F's absence is not raised.

## Holds (31)
- **The FAIL and the two NEW MAJORs.**
  - SEAMS-r2-11 / A.4: `enemy_in_service` reads the landed `hostile` label and no RN court regard. The accusation moves the pair through `applyRelationshipPatch` with `edge` passed, which satisfies `relationshipPatchEdgeCarry.walker`.
  - CH-V3: on master, the lit arm of `assignRoamer` refuses `no_route` mid-leg (`assignmentOrigin` returns `''` while in transit). The dark arm places at once and discards the leg. `advanceAssignedNpcTransits` places with `dmAssignment: null`. The kernel calls l.2194 before l.2222.
  - CH-V4 (CH's half): the re-run is held by `home` alone when stamped.
- **The 23 other dispositions** (minors 1–8, A.1–A.3, A.5–A.15, PL-r1-15, PT-V1's guard, the RN and ST/PR names, §D.2).
- **The §E.1 and §E.2 receipts.** There are 0 hits for `readiness01`, for `full · … · empty`, and for "polity … before passage" or "`sent` … adds nothing".
- **Routed halves the volume carries.**
  - MN's wildland `{ mult }` (l.427).
  - PL's flag and grammar (l.536, l.695, l.721, l.802, l.854).
  - PR's warden via `paragonLean` (l.398). PR's `fundingBandOfSettlement` route is moot.

## FAILS
| Id | Class · sev | The route (quoted) | The volume now | Cure |
|---|---|---|---|---|
| RU-1 (D-RN-r3 §5) | ROUTED-UNAPPLIED · m | "strike 'after the news delay' from the omniscient arm of `believedWhereabouts` … Also add 'a version heard under another doer places nobody'" | l.209: "in the omniscient arm the newest of its deeds inside whose projected reach the town lies, **after the news delay**". The read uses the true doer (`deedIndex(...).byDoer`) and `heardAt(…).heardTick`, never `heardAt(…).doerKey`. RN l.181 says the doerKey "must name it". | Strike the delay. Read the heard `doerKey`. Add RN's clause. |
| RU-2 (D-PT-r3 §3 item 2) | ROUTED-UNAPPLIED · **M** | "`enemy_in_service` should read the landed pair label through the same belief read PT names (`readBeliefRelationship`)" | l.521 reads `relationshipTypeBetween(graph, worldState, courtId, servedId) === 'hostile'`, which is truth. This sits under the step headed "Circumstance, from belief" (CH7). PT l.323 says "`hostile`, as this court believes it: `readBeliefRelationship(…)`", and PT P49 pins that read. The leaf is CH's and PT calls it, so one reason has two reads: SEAMS-r2-11's class. | `readBeliefRelationship(courtId, servedId, worldState, relationshipTypeBetween(…))`. `servedId` should read the employer as the court believes it, as `at_war_with_employer` already does; see note n3. |
| RU-3 (D-PT-r3 §3 item 1) | ROUTED-UNAPPLIED (partial) · m | "CH also needs the same cap rule (windowed only; oldest evicts first) and one key per door" | The windowed lift guard is carried (l.535, re-executed). The cap counts every key ("Past eight keys the oldest evicts first"). No key-per-door rule exists. A key at a door that is now indefinite still drops "either way" at a seat change. PT l.115 says the cap counts windowed keys only, gives one key per door, and makes an indefinite-door key "inert, outside the cap". Despite this, CH's REFINED bracket claims "as PT's ruling gives". | Adopt PT l.115's three clauses. Re-word §21 L3 to match. |

**Seam note (not counted; RN's own ROUTED-UNAPPLIED, and missed by SEAMS-r3, which lists "RN: —").** CH-V4 holds in CH's text, but not end to end. RN §3.4 l.262 still says the findings have "hop-0 origin the meeting town". It also says RN's arm builds every registered seed with "`relayedTick: null` … so the relay's continuation guard … relays it exactly as a feed seed". My re-run control row is that exact seed, and it is held by `home`, `meet` and `third`. That is CH-V4's broadcast. RN's leak `eventRef` also still lacks `:<retainer.sinceTick>`. OD-CH-40's "RN's arm copies the declared stamp" is false until D-RN-r4 applies D-CH-r3 §5's RN line.

## NEW (introduced or surfaced by the cures; all minor, not counted)
| Id | Sev | Site | Claim | Cure |
|---|---|---|---|---|
| CH-Wm1 | m | §4.2 "One mover", the dark arm; P2 `exertion` | `exertion` is `{ tick, outcome }` with no place. A dark-arm `assign` moves a paragon that exerted at A in week t−1 to B. In week t the stressor-gate rows and the leak row read the paragon "where it stands" at the t+1 latency, so one week's lean lands at B. PLAUSIBLE. | Write `settlementId` on `exertion`, or drop `exertion` when the place changes. |
| CH-Wm2 | m | §8 findings seed | The seed's origin is the employer's seat, at hop 0, the next tick. So the report reaches home with no travel time from the meeting town, which may be weeks away (a "second speed" for news). | Give the seed `arrivalTick = tick + hopWeeks(meeting, seat, season)`. The guard still skips it. |

**Minor notes.**
- n1: CH8 cites `assignRoamer`'s "two lifecycle owners" as a general law. On master the refusal is `active_errand` only.
- n2: §4.2 says "only `work_here` … `take_rest` … `keep_rendezvous`", but also offers `seek_work` as the resignation.
- n3: `enemy_in_service`'s `servedId` lacks the "as the court believes it" caveat. Without it, a covert employer's hostile pair would refuse at the gate and expose the hire.
- n4: §2.2's product gives a villain a `1 − d` on `patrol_rider_quality`, which §5 (d) and PR §10.5 never declare.
- n5: the "two incidents per court and hire" bound is latched only by a `paragonBeliefs` row that can be evicted or can expire.
- n6: `t − m`/`r + m` read raw. Following `accrueSaleGrievance`'s `|| 0`, an unmaterialized pair's trust becomes 0. Read the values through `ensureRelationshipState(edge, …)`.
- n7: I concur with SEAMS-r3-9: MN l.344 and PR l.420 still call `paragonLean(…, 'wildland', side)`.
- n8: the landed `embassyHazard.js` says "hostile = open war", while the REFINED split calls a hostile pair "enemy". The wording is vetoable.

**CONFIRMED vs PLAUSIBLE.**
- **CONFIRMED by execution:** the two re-runs and the table check.
- **CONFIRMED by code read at `81f1cd963`:** every master symbol above.
- **CONFIRMED by quoting:** RN l.181 and l.262, PT l.115 and l.323, MN l.344, PR l.420.
- **PLAUSIBLE, not upgraded:** CH-Wm1's leak, RU-2's size in the belief presets, and CH-V4 end to end.
