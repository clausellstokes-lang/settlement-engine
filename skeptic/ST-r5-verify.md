# ST-r5-verify — THE SITES, refuting verifier (P3 round 5b)

Seat V-ST-r5 (Opus 5.5), chair 0a2e8bd9 (Fable 5.1) continuing a73343ed, 2026-10-19.

**What I read in full:**
- the README (RESUME BLOCK 2), VERIFY, and every rulings file through RULINGS-ROUND5 §A–§C;
- CHAIR-NOTES 1–19 and the last lines of the BOARD;
- the volume: 867 lines, sha256 `cb6717d4…`, which equals the lane's after-hash (copy at `ST-r5-verify-probe/ST.at-verify.md`);
- `ST-r4-verify.md`, `SEAMS-r4.md`, `BD-r4.md`, and `cure/D-ST-r5.md` with its probes;
- the ROUTES sections of all ten `cure/D-*-r5.md` files.

**Master receipts,** re-read at `81f1cd963` (`master-reads.out`): m1–m4 match; `raised` is quoted 0 times and `closeSiteWeek` appears 0 times.

No git. No tests.

## COUNTS
**holds 32 · fails 4 · stop 0 · new 1 (0 BLOCKING · 1 MAJOR) · routedUnapplied 1**

- **What was judged:** 36 rows — the lane's 31 inputs plus the five round-5 routes to ST (BD (a)–(d) and PS). CH, FOLD, MN, PL, PR, PT and RN route nothing to ST.
- **Substance:** one fail (A.5) and the new finding ST-Y1.
- **Mechanical:** two fails are RESIDUE.
- **Routed:** one fail is ROUTED-UNAPPLIED. Its route was written at 04:10, after the lane closed at 04:01.

## FAILS
| id | disposition | verdict | why / receipt (`ST-r5-verify-probe/receipts.out`) |
|---|---|---|---|
| **A.5** (V1's ST-X3) | CURED + REFINED | **FAILS in part — MAJOR (substance)** | **The sighting store moved, but the READ is still keyed by the TRUTH holder.**<br>**The read** (§2.4, l.193): "a MENACE holder through MN's `believedMenaces` … a BODY holder through THE BODIES' `believedBodyOf(worldState, courtId, bodyId)`". Both the arm and the `bodyId` come from the site's current holder.<br>**Why the line's own claim fails:** the same line says "a holder that LEFT unseen is still believed there, stale". For a body that cannot hold: step 1 (l.334) clears the holder when the body leaves, so no id is left to read.<br>**S36 (l.608) is false of the read too.** It says "a court that saw the gang there still believes the GANG there". After the re-point, the read takes MN's arm, where the Hill Wolves are still unheard. `known` therefore drops in the tick of an unperceived truth change.<br>**A third truth gate:** step 5's "and only while the force still holds it" (l.338).<br>**Cure:** `believedDenOf` reads BY PLACE over the court's own beliefs. It takes MN's entries whose newest place is the site, together with the entries in BD's list form `believedBodies(worldState, courtId)` (BD l.252) whose `baseId` is the site; the newest wins. It is never keyed by the truth holder.<br>**Residues:** OD-ST-25 l.644 "(they see the arrival, `holder.seenBy`)"; OD-ST-35 l.654; the label of §11 l.559. |
| **A.4** | CURED + REFINED | **FAILS in part — RESIDUE** | **The registry row still mints on truth.** §8 l.480 gives `site_reclaim`'s climax as "the week the site falls empty or untied and its `lastHolder` court stands".<br>§6.4 l.378 opens the same way: "offered … in the week the site falls empty or untied — or, where that court learns of it later, …".<br>**Cure:** both read "the first week that court believes it (§6.1 step 5)". |
| **B.3** (ST's citation) | CURED | **FAILS in part — RESIDUE** | **The withdrawn citation survives in one row.** The WC row of §7.4 (l.455) still says "its contest reads `siteTermAt(…, 'security')` beside `defenseLedger`".<br>§4.4's own round-5 bracket (l.306) withdraws exactly this: "two ST terms in one read; now ONE, the keep's readiness".<br>**Cure:** "`siteReadinessOf` for the qualifying keep beside `defenseLedger`". |
| **RU-BD-r5 (b)** | — (route 04:10, lane closed 04:01) | **FAILS — ROUTED-UNAPPLIED** | **The route** (D-BD-r5 l.105): "`settlementFundingBand` takes the bounty's one-step input under `bodyEffectsEnabled`". BD l.1043 (b) says the same: "a standing bounty lowers the court's band one step a season".<br>**The volume:** §2.4 l.184 reads "THE ONE settlement band: its `prosperityRank01` (…)". There are 0 hits for "bounty" in ST.<br>**Decide also:** `fundingBandOf` reads this band, so the step would also starve the court's own keeps (the want clock and their readiness). Say whether it reaches site funding. |

## NEW
| id | sev | site | claim | receipt | cure |
|---|---|---|---|---|---|
| ST-Y1 | MAJOR (a mechanism; introduced by R2 and A.3's hold) | §6.1 l.347 (the order) · step 6d l.343 · step 4 l.337 · MN l.393 / M63 | "a body or a menace … stands where it stood (its own stage keeps its place — ROUTE BD · MN)" | **The order:** "MN's stage → ST's stage … → PR's → THE BODIES' (its `arriveAt` calls) → ST's CLOSING CALL `closeSiteWeek`". The decision therefore comes after both movers have already run.<br>**MN:** l.393 promises "`where`, `state` and `leg` unchanged" but marks it "PLAUSIBLE that ST's answer reaches MN's leaf the same tick".<br>**BD:** carries nothing (0 `arriveAt`).<br>**ST itself:** `arriveAt` "runs this step … and REGISTERS it", which says both.<br>**The result:** the waiting challenger's record has already moved. Either two truths of its place stand for a week, or a rollback is needed that no volume names. | ST names ONE idiom: either (a) a move onto a site is a REQUEST, and the closing call returns `arrived · held` per mover for the owners' doors to apply in the same chain; or (b) the movers commit the next tick from ST's verdict. In both, `arriveAt` only registers. |

## NOTES (minor; not counted)
1. **R1** (curbed seizure only after a refused demand) is unreachable for a court below `funded`, or where the site is not of its own use (6b's bounds). Such a court can seize only by outlawing the creed. Say so.
2. **B.5:** ST excepts only "a paragon leading" (l.459, l.484). RN l.245 and BD's route admit an office-holder as the leader too.
3. **`repelled`** also names R5's "turns home, no draw" (l.193): two meanings on one card.
4. **A `site_sale`** that ends `sold` and a contest drawn the same week can each change the holder. Step 6d does not order them.
5. **R3** (the clearer holds after a solo clearing) gives a liege the member's keep. This is the lane's open question 1. PR R11 is already aligned (PR l.717).
6. **BD's to align** (V-BD's), each routed by ST:
   - l.252 sources sightings from "a site's `seenBy` entry";
   - l.503 and l.587 cite "ST §6.1 step 6" for the seizure;
   - §8.2 l.546 has no conclave exclusion, so S40 stays DARK;
   - BD carries no approach hold.
7. **The lane's residue claim does not reproduce.** It reported "0 live `holder.seenBy`". The bracket strip (`strip.py` → `residue-v.out`) finds three live hits.
8. **BD route (c)** (a holder-since field) is optional, so it is NOTED, not failed.

**Holds:**
- L-BD 30 · A.1 — the seizure is reachable by stance; the matrix was re-derived.
- RU-MN-r4 · A.2 — ST §6.7, MN l.146 / M59 and BD l.459 all say the same.
- ST-X1 · A.3 — the sides, the strongest contesting, and the clearer holding all hold. The hold mechanism is ST-Y1.
- ST-X2 · B.2 — holds on ST's side.
- V2 notes 1–6 — note 4's 0.50 and 0.40 were recomputed.
- The five round-4 routes; B.4; B.5; V1 notes 3–6; BD (a) and (d); PS.

## CONFIRMED vs PLAUSIBLE
**CONFIRMED:**
- every fail and ST-Y1, by quoting the volume against itself and its siblings (`receipts.out`);
- the master receipts (`master-reads.out`);
- the residues (`residue-v.out`).

**PLAUSIBLE:**
- how often ST-Y1's same-week collision bites at runtime;
- how often A.5's unperceived departure bites at runtime;
- every DRAFT constant.
