# FOLD-r4-verify — the refuting verifier of D-FOLD-r4 (the fold, the spine §1 and SP-4, CN), P3 round 4b

Seat V-FOLD-r4 (Opus 5.5), 2026-10-19 ~03:0x–03:2x EDT by `date`. I read the fold WHOLE, the spine's r4 brackets in context, CN's two r4 brackets, every rulings file (ROUND4 §A–§E whole), SEAMS-r3, FOLD-r3-verify, D-FOLD-r4, and the ROUTES of all ten `cure/D-*-r4.md` (plus BD §19.0, which D-BD-r4 §5 names as its full list). I checked every mirrored cell against its owning volume and master `81f1cd963`. The per-row verdicts, the minors and the receipts are in `FOLD-r4-verify-probe/minors-and-holds.txt`, `receipts-r4v.out` and `pipes-r4v.out`. I edited no other file. No git, no tests.

## COUNTS

**holds 125 · fails 6 · stop 0 · new 2 (0 BLOCKING · 2 MAJOR) · routedUnapplied 4**

- **The 127 dispositions:** 125 hold and 2 fail. A further 4 fails sit outside the 127: three are §E.4 routes D-BD-r4 sent to the fold, and one is a §E ruling made after the lane closed.
- **Insertions-only, re-executed:** fold +92/−0, spine +2/−0, CN +2/−0. All 80 inserted table rows match their table's pipe count.
- **A.8 holds:** CH §11 step 3, CH §2.2, PT §9.2/P49 and both fold rows read `readBeliefRelationship(court, served, ws, relationshipTypeBetween(…))`. This matches master's signature (`beliefMap.js:448`).

## FAILS

| id | disposition | verdict | why / receipt |
|---|---|---|---|
| SEAMS-r3-5 (fold half, MAJOR) | CURED, §5 `fealty_*` ↳ r4 (1) | **FAILS** — the fold drifted from the owning volume | **The fold says:** "`protection_failed` when the clock ends unanswered".<br>**ST §6.6 (ST:379) and OD-ST-46 say:** failed "when the clock EXPIRES with the den still holding … whether the liege came and was repelled … or never came", and "NO row when the den ends or leaves … by its own course".<br>By §3.4's own rule the volume wins. The fold's cell is therefore the error on the repelled-liege case and the self-ending case. PL carries the same old words, and ROUND5 A.8 already routes PL's half. |
| D-PL-r4 route: the REQUESTED family (B-row `peace_unkept`) | CURED | **FAILS — ROUTED-UNAPPLIED (mis-applied)** | **The route says:** "the REQUESTED family ST's second den closing and BD's two rows".<br>**The fold says:** "OBLIGATION gains `peace_unkept`".<br>**PL §4.8 (1) (PL:263) says:** "It is the REQUESTED family's (§8)". PL §8 (PL:400) lists "THE BODIES' `peace_unkept` and harbouring (`body:`)" under the requester's flag ∧ `polityEnabled`.<br>The fold's family rule (r3: OBLIGATION under `polityObligationsEnabled`) would gate the row on the wrong flag. |
| RU-BD-1 | — | **FAILS — ROUTED-UNAPPLIED** | **The route says:** "§7 … OD-BD-34's visible reading".<br>**The fold has:** 0 hits for `OD-BD-34`. OD-FC-74 lists only OD-BD-31 and OD-BD-35.<br>**Why it matters:** BD §17 OD-BD-34 is "⚠ VISIBLE": the chair read the owner's 18:46 word as "does NOT harm them", and it is the owner's to correct. |
| RU-BD-2 | — | **FAILS — ROUTED-UNAPPLIED** | **The route says:** "THE FIRST SOAK's BODIES row (L-BD 45 …)".<br>**The fold has:** "first soak" hits for EC only (§3.2.11, §6 C6, §9.2). |
| RU-BD-3 | — | **FAILS — ROUTED-UNAPPLIED** | **The route says:** "§5 — … `spread_faith` … aligned … `dispersed` · `ranged_away`, `by_office`".<br>**The fold has:** 0 hits for each. `dispersed` appears only as POP's `column_at_the_wall` verdict (fold:498), so BD's end word now meets an unregistered homonym. |
| §E OD-RN-48 | — (ruled after the lane) | **FAILS — §E-UNAPPLIED** | **§E says:** "D-FOLD-r4's §3.1.25 ↳ r4 cites it".<br>**The fold has:** no such citation, and §5's RN row still calls the question "the chair's (OD-RN-48)". |

## NEW FINDINGS

| id | sev | site | claim | receipt | cure |
|---|---|---|---|---|---|
| FOLD-X1 | MAJOR | §1 r4 (2); the spine's r4 mirror | "it CLOSES only at its automatic resolution" | **It contradicts:** requirement 24(b), "the verdict forces the hand that week"; the owner's 10-16 words, "the DM can decide who wins during any one of those weeks forcing the hand"; and BD §9.10's "`pay` at any week ends the race". | Reword: it closes at its resolution — the clock's end, or the week a verdict or that week's line resolves it. |
| FOLD-X2 | MAJOR | §3.3.13 ↳ r4; §3.4 `ransom` ↳ r4 | `ransom_granted` "(the body survived the clock)" · `captive_released` "(the clock ran out)" | **Two closings for one event.** The owner (18:54): "if the gang can survive with teh NPC for long, then they will have the ransom granted". BD §9.10 carries the same pair, and only its `abandon` branch separates them. | BD states which closing the clock's end mints (e.g. `released` only after `abandon`); the fold then re-mirrors it. |

**Minors (9, in the probe file):**
- The map contract (MINOR under §E): six rungs unregistered, `junction:<id>` against the trail WHERE ruling, inbox (n) stale.
- OD-FC-70 unbracketed.
- §5 still says "THREE feeders".
- The `raid` ref lacks `bodyKind`.
- The recount's party list.
- §3.3.15 omits PL F.4's `staunch` bound.
- PS's `banner` field is unregistered.
- CN C14–C16 homonyms.
- Push-once wording.

**Chair notes:**
- `briefs/L-FOLD2.md` item 4 still says four actor kinds.
- A PS→PR seam on the banner's two reads is passed to SEAMS-r4.

## CONFIRMED vs PLAUSIBLE

- **CONFIRMED by execution:** the diff, the pipe check, and the master receipts and token census.
- **CONFIRMED by read:** every fail and new finding (both sides quoted; 0-hit greps for the unapplied routes).
- **PLAUSIBLE, not upgraded:** that a builder would act on X1/X2 and on the two drifts as worded.
