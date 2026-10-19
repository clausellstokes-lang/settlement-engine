# FOLD-r3-verify — the refuting verifier of D-FOLD-r3 (the fold, the spine §1 and SP-4, CN), P3 round 3b

Seat V-FOLD-r3 (Opus 5.5), 2026-10-18 ~18:55–19:1x EDT. I read the fold WHOLE, the spine §1, CN, every rulings file and all nine ROUTES sections. Claims were checked against the sibling volumes and master `81f1cd963`. The detail is in `FOLD-r3-verify-probe/minors-and-holds.txt` and `receipts-r3v.out`. No git, no tests, no other file edited.

## COUNTS

**holds 44 · fails 1 · stop 0 · new 0 (0 BLOCKING · 0 MAJOR) · routedUnapplied 0** — over D-FOLD-r3's 45 dispositions.

- **Insertions-only proof, re-executed:** fold +79/−0, spine +2/−0, CN 0. All 66 inserted table rows have the correct pipe count.
- **§E.1 receipt:** no superseded readiness words remain, outside §5:784's forbidden-form note.
- **§E.2 receipt:** neither the "polity before passage" sentence nor the "a `sent` … adds nothing" sentence appears anywhere.
- **§E.4:** all 36 routed halves addressed to FOLD are carried. The PS and ST card notes are recorded for P4, as their routes ask.

## FAILS

| id | disposition | verdict | why / receipt |
|---|---|---|---|
| A.4, the fold's half (SEAMS-r2-11 class, MAJOR) | CURED: "the landed pair state through belief"; receipt "CH §11 r3; PT §9.2 r3" | **FAILS** — the fold names a read the leaf's owner does not use | **What the fold says:** §3.1.25 ↳ r3 (fold:322) and §5 ↳ r3 (fold:730) define `enemy_in_service` as a court "this court believes `hostile`", read by `beliefMap.js :: readBeliefRelationship`.<br>**What CH says:** CH OWNS `gateDefault` (§3.1.25). Its §11 step 3 reads TRUTH: "`roads/embassyHazard.js :: relationshipTypeBetween(graph, worldState, courtId, servedId) === 'hostile'`". CH has 0 hits for `readBeliefRelationship`.<br>**What PT says:** PT §9.2 and P49 read BELIEF.<br>Both symbols resolve on master (embassyHazard.js:36, beliefMap.js:448). They diverge wherever a belief record exists. The PT→CH route (D-PT-r3 §3 (2)) is unapplied. The result is three texts and two reads for one leaf, under step 3's own heading "from belief". By §3.4's own rule ("the volume wins"), the fold's cell is the error.<br>**Cure:** the chair rules ONE read; CH, PT and the fold's two rows then name it. |

## NEW FINDINGS

None at BLOCKING or MAJOR. I refuted one candidate myself: "THE PASSAGE does not cite A.3's shared car". PS12, §10 PS-3, OD-PS-19 and its MN-V6 row all cite THE SHARED PRESENCE CAR.

**Minors (8), detailed in the probe file:**
- §6 ↳ r3 says "C14's first wave"; PS says PS-3 builds the car.
- The §9.6 A.15 row carries a stale "0 hits".
- The readiness-word census at §5:784 is slightly off.
- `POSTURE_ACTOR_KINDS` is widened to `menace`/`party`, against r2b's "posture-bearing DECIDERS".
- fold:408 files a cult under WC-12's band slot, contrary to §D.2 CORRECTED.
- MN's REFINED 2 is stated as settled.
- Two citation slips.

**For the chair:** L-FOLD2 items 4 (four actor kinds) and 5 (`relief_answer` "ONE kind") would re-open A.7 and the r1 strike if P4 folds them literally.

## CONFIRMED vs PLAUSIBLE

**CONFIRMED by execution:** the diff, the pipe check and the token census.
**CONFIRMED by read:** the A.4 fail (both texts and both symbols quoted) and every code receipt and sibling match.
**PLAUSIBLE, not upgraded:** that the two reads diverge in play.
