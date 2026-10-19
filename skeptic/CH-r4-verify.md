# CH-r4-verify — the refuting verifier for THE CHAMPIONS, P3 round 4b (V-CH-r4, Opus 5.5; chair 0a2e8bd9 continuing a73343ed; 2026-10-19 02:57 EDT by `date`)

**COUNTS: 42 holds · 6 fails (5 ROUTED-UNAPPLIED, 1 NOTED-WRONG; 2 MAJOR, 4 minor) · 0 stop · 3 new (0 BLOCKING · 2 MAJOR · 1 minor) · routedUnapplied 5.**

**What I read.**
- Read whole: the kit README (RESUME BLOCK 2), VERIFY, SKEPTIC, DISPOSE and RESEARCH-COMMON.
- Every rulings file, whole: PL-MN, AFTER-RESEARCH, AFTER-COMPILE, CHAIR-NOTES 1–18 (17 and 18 (a)–(f) included), ROUND1 with its addendum, ROUND2, ROUND2b with its addendum, ROUND3 §A–§G, ROUND4 §A–§E, and ROUND5 §A. The latest ruling wins.
- `skeptic/CH-r3-verify.md`, `skeptic/SEAMS-r3.md`, and `cure/D-CH-r4.md` with its probe directory.
- The ROUTES section of all ten `cure/D-*-r4.md` files. Routes to CH come from PT, RN, FOLD, PR and BD. MN, PL, PS and ST route nothing to CH.
- The volume `docs/DESIGN_FP_ARCH_CH.md`, whole: 1,173 lines, sha1 `222dd3ff…`, unchanged since 22:30. A snapshot is at `CH-r4-verify-probe/CH.at-verify.md`.
- Sibling text read at the cited lines: PT, RN, BD, PR, ST, MN and the fold.

**Code of record:** master `81f1cd963`, read-only.

**Probes**, in `CH-r4-verify-probe/`:
- I re-ran the lane's three probes. `findingsArrival`, `banKeysUndo` and `banLapse` are all byte-identical to the lane's output.
- `banishThenVerdict.mjs` is NEW and executed: F1's reverse order.
- The strict table check found 24 tables and 0 mismatches.

I did not touch git or the suite, and edited no other file.

## Holds (42)

**RU-2 · A.8 · n3 holds.** `beliefMap.js :: readBeliefRelationship` reads "`if (b.source === 'belief') return b.record.allianceLabel || truthType;`". The believed label can be `'hostile'` (beliefMap l.282, l.999). PT l.326 and P49 quote CH's read verbatim, and PT's A8 probe agrees.

**Other dispositions that hold.**
- RU-1: RN l.186 `heardAt` gives `doerKey` "AS HEARD", with no delay in the omniscient arm.
- RU-3: PT l.115's three clauses.
- CH-Wm1, and CH-Wm2 in CH's own shape.
- n1: `assignRoamer` refuses `'active_errand'` (l.267) and `'no_route'` (l.295, l.306).
- n2 and n5.
- n4: PR l.457, "a villain's `1 − d`".
- n6: `ensureRelationshipState` gives a neutral pair trust 0.45, while `accrueSaleGrievance` uses `(Number(current?.trust) || 0) - m`.
- n8: `atWarWith` l.74–75.
- n7: MN now has 4 + 4 seam-word hits.
- The RN seam note: RN l.269 copies `relayedTick` and `arrivalTick` and gives the origin as the employer's seat.
- SEAMS-r3 "CH: —", and the three r3 routes.
- BD (1), (2) and (3) in substance.
- A.12, A.3, ST's `person` class (ST l.148: "a paragon's living `polarity` decides its sign").
- 14 of the 15 NOTED A-rows.

**Routed halves that hold.**
- PR: `predictedPlaceOf(worldState, snapshot, settlementId, bodyId, tick)` (PR l.199), the lean applying only in a week with the riders, and §4.4's watch term.
- BD: `leads`, the bounty as a call, the hunt, the single exposure source, and the free-company birth path (note n8).
- PT (1).

**Held in CH's own text, but each opened a seam.**
- L-BD 32 opened CH-X2.
- L-BD 33 has an unapplied route, F4.
- L-BD 40 opened CH-X1.

VERIFY lets X1 and X2 be read as fails of L-BD 32 and L-BD 40. They are counted once, as new.

## FAILS

| Id | Class · sev | The route / ruling (quoted) | The volume now | Cure |
|---|---|---|---|---|
| F1: A.19 · RU-PT-2 (D-PT-r4 ROUTES CH (2)) | ROUTED-UNAPPLIED · **M** | "add `untilTick` to `paragon.banKeys` and re-write it in the inverse where still ahead … CH's own `banKeysUndo.out` covers A–C only" | l.186 has `banKeys?: [≤8 { settlementId, episode }]`. In l.554 the inverse restores only "the edge that stood at that door before it". S45 covers the forward order only. **EXECUTED** in `banishThenVerdict.out`: (1) `banish` with prior `null`; (2) the BENCH's window is merged into the indefinite edge; (3) undo. The result is `afterUndo: null` and `bannedAt150: false`, so the court's later ban is LOST. PT l.115 claims that CH "takes the same field by ROUTE", which is now false. | Carry `untilTick` on `banKeys`. After restoring the prior edge, the inverse re-writes any window still ahead. Add a reverse-order pin beside S45. |
| F2: A.16 (NOTED "0 veil text") | NOTED-WRONG · **M** | "at-hand courts learn of a kept-secret den only by WITNESS" (also ROUND5 A.4: "a KEPT-SECRET den is never reclaimed") | The §14 den row (l.614) comes from ST's `sitesNear`, which ST l.183 defines as "every site attached to a settlement", with no observer. l.619 says it is known by PRESENCE ("a court knows itself"; "a paragon sees the town it stands in"). PT l.269 says "a court knows its own needs by presence". So a kept-secret den becomes a call and a party request: a truth read in a leaf that decides (CHAIR-NOTES 18 (d)). | The den row should read ST's `believedDenOf(worldState, courtId, siteId, snapshot)`, and a paragon should read its town's belief. Presence should never count a kept-secret den. |
| F3: L-BD 41 · D-PR-r4 CH route ("the town's public-security office is held by the warden archetype") · D-BD-r4 CH route ("the warden = `wildland` paragon in the office") | ROUTED-UNAPPLIED (partial) · m | brief item 41: "HOLDING the public-security OFFICE … KNOWS every hidden way" | l.402: "a WARDEN … RETAINED by a court … its job is its retainer … its court's KNOWN set counts them (PR §5.5 and BD's union read)". Every other source says the office: PR l.295 ("Where the town's public-security office is held by CH's WARDEN archetype"), BD l.969 (7) and the fold's OD-FC-48 ↳. CH cites PR for a rule PR does not hold. | The chair should rule open question 3. Until then, CH should state the office reading and mark the retainer reading as the vetoable alternative. |
| F4: RU-PT-3 (D-PT-r4 ROUTES CH (3)) | ROUTED-UNAPPLIED · m | "CH §14's bounty call names its body in its `source` so PT's request takes `need: { bodyId }`" | l.614 says "its SOURCE id is the bounty's own record". BD's bounty sits at `courtStances[court]['g:<bodyId>'].bounty` (BD l.206) and has no id of its own. PT l.143 needs `need: { bodyId }`. | The source should be `{ bounty: courtId, bodyId }`. |
| F5: RU-RN (D-RN-r4 ROUTES CH) | ROUTED-UNAPPLIED · m | "`arrivalTick` = tick + (meeting = seat ? 0 : `Math.max(1, finiteNumber(hopWeeks(…), 1))`) … the widened signature `(worldState, tick, { digest, season })`" | l.483 gives `tick + hopWeeks(digest, <meeting>, <employerId>, season)`, with graph hops × 1 aspatially. l.504 and l.915 say "a pure function of `(worldState, tick)`". `hopWeeks` returns `null` for an unreachable pair (`if (cost == null) return null;`), so the sum lands at once. Aspatially RN gives 1 week where CH gives N hops. The lane's probe priced RN's form, not the volume's. | Cite RN's formula and signature verbatim. |
| F6: RU-FOLD (D-FOLD-r4 ROUTES CH) | ROUTED-UNAPPLIED · m | "'WHERE the stretch or the trail' / 'WHERE the trail' → 'WHERE `road (a, b)`, the trail named on the card'" | l.551 "WHERE the stretch or the trail"; l.692 "`road{a, b}` or the trail `trail:<a\|b>` … for a body's turn-back"; l.866 S50 "WHERE the trail". Fold l.622: "THE TRAIL IS NO SIXTH WHERE KIND". | Change all three sites to WHERE `road (a, b)`, with the trail named on the card. |

## NEW (introduced by the round-4 cures)

| Id | Sev | Site | Claim | Receipt | Cure |
|---|---|---|---|---|---|
| CH-X1 (concurs with SEAMS-r4-7) | **MAJOR** | §2.2b `hunt_won` (l.223, l.252) · L-BD 40 | One success mints two deeds. | CH: "`hunt_won` (a hunt the paragon LED … ONE deed per hunt, minted at the mission's close)". RN l.245 `patrol_clash`: the doer is "the NAMED person who led the riders — a paragon (CH's warden) … (L-BD 40: a hunt's success is its leader's deed)", taken from PR's verdict record. RN l.247: "ONE ACT, ONE DEED". BD l.587 and l.607 add a third claim-deed. RN has 0 `hunt_won` hits. The leader's fame therefore counts twice (PLAUSIBLE arithmetic). | Keep one door. Either `hunt_won` mints only at the close, carrying the clash's `sourceEventRef` so RN's idempotence refuses the second, or it is struck in favour of `patrol_clash`. BD §9.11 should cite whichever door stands. |
| CH-X2 | **MAJOR** | P2 `leads` (l.190) · §7 (l.465) · L10 (l.807) · L-BD 32 | The leader relation is persisted twice, with two writers. | CH has `paragon.leads: { bodyId, sinceTick }`. BD l.187 has `leaderRef?: { kind: 'person', id }` on the body, written by BD's single writer `bodyLedger.js`. CH L10 says a heard `polarity_turn` drops `leads`. BD l.801 drops `leaderRef` only on "a LEADER's death". So after a turn, the body still reads the departed leader's axes and cohesion (BD l.465). This is a ghost, PLAUSIBLE. CH says BD reads the leader "through `paragonOf`" and never names `leaderRef`. | Keep one store. Derive the other side, write both from one act through `setLeader`, and handle every drop path on that one record. |
| CH-X3 | minor | §11 road arm (l.551) · L-BD 41 (b) | The warden attempt has no card. | BD l.565: a gang may "BRIBE … or to KILL him — the attempt is a DEED through CH's road arm and a hearing in its week". CH: verdicts are `admitted · refused`, and "NOTHING ELSE CAN HAPPEN TO A PARAGON AT A BODY'S HAND". A warden who holds the office but is not a paragon has no CH road arm at all. | Either BD re-points the attempt to a BD kind, or CH adds an attempt arm whose default is "nothing happened" (death stays the DM's). |

## Minor notes (not counted)

- **n1.** A CH-Wm1 residue: the CH-7 car-0 at l.749 still lists the leak's inputs as "`exertion.{tick, outcome}` and where the paragon stands".
- **n2.** §5 l.402 and OD-CH-42 still say "⚠ ONE PRICE, TWO NUMBERS … ROUTED to BD and the chair". ROUND4 §E has since RULED that the landed `HIDDEN_PATH_SLOWDOWN` wins.
- **n3.** Under omniscience the volume says two different things. S8 says "behaves as a plain retainer". §11 says a covert employer counts only "at `confident`", and no rows exist under omniscience.
- **n4.** `gateDefault` says it reads "BELIEF wherever it reads another court's facts", but step 2 reads the root's ban as a fact. Only the hold is believed.
- **n5.** `championForHunt` asks whether a paragon's choice "would take `hunt_body`", but §4.2 admits `hunt_body` only once the paragon is NAMED. The check should be read as the hypothetical choice.
- **n6.** BD's tie-kind metadata (BD l.642) is not among the arguments of `exposeCovertHire`. BD's latch is `exposed?` (BD l.633), where CH says `exposedAt`.
- **n7.** CH maps a gang's bounty to `wildland · war · order`, while BD l.586 maps it to `order` only. This is a superset, and BD's S26 still holds.
- **n8.** BD l.454 says the market was "closed into CH … ROUTE CH · WC". CH §16b says the institution's hired swords "are WC's and BD's". One owner needs to be named.
- **n9.** CH §4.2 (3) says the leader's leg "MIRRORS" the body's, while BD l.465 says it moves "by its OWN mover alongside the body".

## CONFIRMED vs PLAUSIBLE

- **CONFIRMED by execution:** F1 (`banishThenVerdict.out`), the three byte-identical re-runs, and the table check.
- **CONFIRMED by code read at `81f1cd963`:** `readBeliefRelationship`, `allianceLabel 'hostile'`, `atOpenWar`/`atWarWith`, `ensureRelationshipState`, `accrueSaleGrievance`, `assignRoamer`, `HIDDEN_PATH_SLOWDOWN`, `openNamedPersonLeg`, `hopWeeks`'s `null`/0/≥1, `roleCategory`, `factionRoles` and `NPC_ROLE_ARCHETYPES`.
- **CONFIRMED by quoting:** every sibling line above.
- **PLAUSIBLE, not upgraded:** CH-X1's double count, CH-X2's ghost on the turn path, F2's builder reading, and CH-X3's impact.
