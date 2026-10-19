# PT-r4-verify — refuting verifier for THE PARTY, P3 round 4b (V-PT-r4, Opus 5.5; chair 0a2e8bd9 continuing a73343ed; 2026-10-19 03:02 EDT by `date`)

**COUNTS: 37 holds · 2 fails · 0 stop · 1 new (0 BLOCKING · 1 MAJOR) · 1 routedUnapplied (counted inside the 2 fails).**

**Outcome.** The round's three headline cures hold, and so do the 35 lane ids except two.
- **A.8.** CH §11 step 3 now reads the pair label through belief in the same form PT quotes. I re-ran the lane's probe and got byte-identical output.
- **RU-1.** The graph is threaded at every `gateDefault` call and at the pass.
- **PT-W1 / A.19.** The prior-edge restore is exact in cases A–F, and R4-1 holds.

Two of the round's new texts fail:
- **L-BD 33.** PT reads a conclave's bounty under the `faith` domain, where CH and BD both say `order`.
- **L-BD 36.** PT and BD give the owner's verb "REVEAL a trail to the party" two homes. BD's route to PT was never applied.

There is one new MAJOR (PT-X1): by construction, an accepted bounty can never fall short.

**Read whole:**
- README (both resume blocks), VERIFY, RESEARCH-COMMON and SKEPTIC.
- Every rulings file: PL-MN (grep), AFTER-RESEARCH, AFTER-COMPILE, CHAIR-NOTES 1–18, ROUND1+addendum, ROUND2, ROUND2b+addendum, ROUND3 §A–§G and ROUND4 §A–§E. I also read ROUND5 §A, which has no PT rows.
- `PT-r3-verify`, `SEAMS-r3` (its ROUTES say "PT: —"), and `D-PT-r4` with its probe.
- The volume: 819 lines, sha1 `5a518346…`, identical to the lane's output.

**ROUTES (§E.4):** I read all ten `D-*-r4.md` files. The halves addressed to PT come from CH (2), BD (2) and RN (1); PS, MN, PR, ST, PL and FOLD route none.

**Code:** master `81f1cd963`, read-only. The re-run is `PT-r4-verify-probe/beliefReadAndRestore.rerun.out` (identical), and the quoted receipts are in `receipts.out`.

## Fails and new
| id | verdict · class | receipt (current text) · cure |
|---|---|---|
| L-BD 33 (owner item, CURED) | **FAILS** — new contradiction | **PT §7.2:** "the party is known for the quarry's domain (a gang → `order`, a beast → `wildland`, a conclave → `faith` — the domain table gains `body_ended` by the ended body's kind)". **BD §9.9:** "in the `order` domain for a gang or a flock and the `wildland` domain for a beast". **CH §14:** "an `outlawed` conclave's an `order` call only (… never a faith call: the followers act, the god does not)". So PT tests a different domain than the call carries, and it books the scattering of a flock as `faith` work. **Cure:** the bounty request reads the call's own domain (CH's), and `body_ended` for a conclave maps to `order`. |
| L-BD 36 · BD route (4) (`D-BD-r4` §5: "**PT** §15 … `TRAIL_KNOWN` `to: party` marks the party's record"; BD §19.0: "a mark on the party's record (PT's shape and writer)") | **FAILS · ROUTED-UNAPPLIED** (and a contradiction) | **BD §11 (l.665):** "`TRAIL_KNOWN` \| to (a town · the party) · trail · known / forgotten … REVEALS it TO THE PARTY (a mark on THE PARTY's record — PT's shape and writer …; ROUTE PT)". BD l.225 says the same. **PT §3.1 (l.212):** "BD's `TRAIL_KNOWN` (town · trail · known/forgotten) a fourth, `party`" and "A trail REVEALED TO THE PARTY is the players' known places — the host's map record (ENC-HS-01, §4), never PT's". **PT P54:** "a trail revealed TO the party writes nothing in PT". PT §2.1 shape 1 has no field for this. The two volumes disagree on both the dial grammar and the record. BD-r4 says "PT: agrees", which is false. **Cure (the chair's pick):** keep PT's home, the host's one writer (ENC-HS-01), and have BD strike "a mark on THE PARTY's record". Then define how `to: party` and PT's `party` dial on `to: <town>` combine. PLAUSIBLE: whether the host's known-places list admits a trail address. |
| **PT-X1** (MAJOR, new) | — | **PT §8.2 HUNT:** "no PLACE a journey could be priced to … so `earliestArrivalTick` has no target and the pledge runs under PATIENCE and can never be `fell_short`". P53 pins the result. **This premise is refuted by PT's own text.** §9.2's body half reads "a BODY whose own `where` that week is that stretch … the body's record AS IT STANDS (truth …)", and BD's record carries `where: { kind: 'country' \| 'road' \| 'trail' \| 'site', ids }` every week. The fault law (§8.4) only needs a place for each week, with no forecast. **Effect:** a party that says yes to every bounty and never rides pays nothing ("came_to_nothing" whenever another hand breaks the body). That runs against the owner's "of the party fails to meet and they accepted it and that is on the reputation". This is also an unmarked judgment: it carries a CURED bracket and no REFINED one. **Cure:** price `earliestArrivalTick` each week to the body's `where` anchor (truth, as §9.2 reads it), so a reachable miss counts. Or keep patience-only as a visible REFINED row for the chair. |

## Holds (one line each)
- **SEAMS-r2-11 · A.4 → A.8:**
  - The fork of r3 is closed: CH l.540 reads `readBeliefRelationship(courtId, servedId, worldState, relationshipTypeBetween(graph, …)) === 'hostile'`.
  - PT §9.2 and P49 quote that read, with `atOpenWar` first.
  - Master's signatures match: `beliefMap.js :: readBeliefRelationship(observerId, subjectId, worldState, truthType)`, `embassyHazard.js :: atOpenWar(graph, homeId, hostId)` and `atWarWith`.
  - The re-run is identical.
- **RU-1:** all five `gateDefault` forms carry `graph: regionalGraph`. `advanceEnvoyDiplomacyPulse({ …, regionalGraph, … })` receives it from `pulseKernel` ("`regionalGraph: applied.regionalGraph`"). `liveSieges({ worldState, regionalGraph })` exists.
- **PT-W1 / A.19 / R4-1:** cases A–F are exact on master's writers. `liftExclusionEdges` and `addExclusionEdge` are gated alike, so a dark-after-lit undo is symmetric. A seat change that falls inside an indefinite window self-corrects at the next pass.
- **m1:** holds, and PR l.145 and l.382 agree.
- **m2:** CH l.556 adopts the three clauses.
- **m3:** holds.
- **m4:** the REFINED bracket is present.
- **A.3:** holds, with 0 live "cult as villainy" text and `IMPOSE_CULT` confirmed as the composer's cult-deity event (`buildEvent.js`, `EventComposerDeityField.jsx` "Cult").
- **A.12:** holds; "five" survives only in history brackets.
- **A.15:** holds (RN OD-RN-45).
- **A.16:** holds (§4 (6), P56).
- **The BODIES' route (road arm and body half):** holds (BD l.561, S17).
- **Routes and NOTED rows:**
  - CH route: P49/`atOpenWar`, and the body half being PT's.
  - BD route (3): the mirror.
  - RN route: the veil.
  - SEAMS-r3 "PT: —".
  - The CH-r3 1/2, PL-r3 and PR-r3 routes.
  - Ruling rows A.1, A.2, A.4–A.7, A.9–A.11, A.13, A.14, A.17, A.18 and A.20 (their tokens appear only in the cure record).
  - The census: `body_ended`, `party_made_known_trail` and `reaches_party` show 0 in src/tests, and `'passed'` 0 quoted.

## Minor carries (not counted)
- **m1.** The §7.3 `party_request` row's `need` list omits `{ bodyId }`; §2.2 and §7.2 carry it.
- **m2.** §8.1 and PT10 say "patience only for a pledge whose need has no clock", yet the hunt has a state clock.
- **m3.** The hunt's clock ends when "the posting court lifts its bounty", but BD has no lift. A BD bounty LAPSES after 52 weeks, or DROPS at a claim or when its body loses its name.
- **m4.** CH §14's bounty call carries "its SOURCE id is the bounty's own record", not the body. PT's route (3) to CH is unapplied.
- **m5.** §2.4 says `banKeys` has "ONE sense on two records", yet CH l.186 has no `untilTick`. SEAMS-r4-6 counts this on CH's side.
- **m6.** RN's veil route uses the trigger `party_made_known_site`, while PT §4 (6) uses the site's `made_known`. PT's trigger is right; RN should align.
- **m7.** `party_gate` now carries two verdict sets under one kind. The fold's §3.4 row must register both (routed).

**CONFIRMED vs PLAUSIBLE:**
- **CONFIRMED by execution on master's readers and writers:** A.8 and A.19 (the re-run is byte-identical).
- **CONFIRMED by quoting both sides' current lines:** the two fails and PT-X1's refuted premise.
- **PLAUSIBLE:** PT-X1's MAJOR severity, whether the host's known-places list admits trails, and that BD and CH will take PT's routed dials and fields. Nothing was upgraded.
