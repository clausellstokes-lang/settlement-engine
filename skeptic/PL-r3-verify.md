# PL-r3-verify — the refuting verifier for THE POLITY, P3 round 3b (V-PL-r3, Opus 5.5, chair 0a2e8bd9; 2026-10-18 18:27 EDT by `date`)

**COUNTS: 10 holds · 3 fails (2 of them ROUTED-UNAPPLIED) · 0 stop · 1 new (0 BLOCKING · 1 MAJOR) · routedUnapplied 2.**

Inputs: `skeptic/PL-r2-verify.md`, `cure/D-PL-r3.md` and its probe directory, the volume as it now stands (255,201 B, read whole and unchanged since the lane wrote it), the ROUTES sections of all nine `cure/D-*-r3.md` files, and the rulings files through RULINGS-ROUND3 §E. §F's absence is not raised. I ran three read-only probes against master `81f1cd963`; the files are in `PL-r3-verify-probe/`:
- `measure.out` re-measured the stage order, `computeAllyRelief` and the grip law.
- `tablecheck.out` checked table integrity: 19 tables, 0 mismatches.
- `removed-sentences.txt` lists the sentences the round removed.

**Holds:**
- PL-r1-15, cured by A.5's four families.
- PL-V4: `patrol:` and `corps:` are registered and P40 is extended.
- PL-V5's REFUTED half. The `vassalageSeat` grip law reads leverage, dependency, pact, fear and resentment, and has no trust term.
- A.1, A.14, and the nine NOTED A-rows.
- E.2: PL has no "polity before passage" sentence.
- D-PR-r3's route and the `patrol:`/`corps:` half of D-PS-r3's route.
- D-ST-r3's optional P43 gate ("may"). The REQUESTED row of the families table already carries that gate.
- I spot-checked the six minors and the CH ban grammar, and all of them hold.

## FAILS
| Id | Disposition | Verdict | Why / receipt |
|---|---|---|---|
| PL-V5 (M) | CURED (A.6) | **FAILS (partial)** | The finding still holds in the `unopposed` arm. PS's answer (PS l.284) is "`barred` when the unit's size band against B is below `decisive` (B's field force …), else `unopposed` (B holds its walls …)". That threshold reads B alone, and no battle is fought unless the crossing stands `barred` (PS l.356). So when a large column meets a weak member, which is exactly the case where relief matters, the liege's `sent` enters nothing. Even so, PL writes `protection_failed` "sent, but too few" (§4.3 (3)) and the surface line "Merewick's soldiers came to Kell's border, too few to turn Brenmoor's column back" (§13). That is "came to its aid" with no deed behind it. The lane saw this and left it as "Optionally … PS's call" (D-PL-r3 §5). **Cure:** B's `barred`/`unopposed` threshold reads B's field force plus the share of a `sent` answer, which is in hand at first sight (PS and PL jointly). If that is not done, the receipt in this arm must state honestly that B did not bar the road. |
| A.10 → OD-PL-33 | CURED (one clause) | **FAILS, §E.1 receipt + ROUTED-UNAPPLIED** (D-FOLD-r3 §5, D-ST-r3 §5 "PL (PL:536)") | l.536 still reads "`readiness01 = F × Q`; the chair's `full · manned · sparse · skeleton · empty`". **Cure:** use `siteReadiness01` and ST's `SITE_READINESS` (`at_strength · manned · sparse · skeleton · hollow`). |
| D-PS-r3 §6 "PL §4.3 / P42 / P45" + §E.3 | — | **FAILS, ROUTED-UNAPPLIED** | The route says "the member's side of the border contest is its FIELD FORCE `homeDefense − siteDefense` … not `homeDefense`". The volume still carries the old wording: §4.3 (1) quotes PS as "B's `homeDefense` as the defender's size", a phrase PS l.356 no longer contains, and P45 reads "M's `homeDefense` plus H's share". **Cure:** use field force in both places. |

## NEW FINDINGS
| Id | Sev | Site | Claim / receipt | Cure |
|---|---|---|---|---|
| PL-W1 | MAJOR | §4.3 (2); §10 create (shape 3); P45; P9 | **The answer row and its patch are minted from the first-sight DEFAULT, before the DM's hearing-week word.** §4.3 (2) says: "The polity stage MINTS its `relief_sent` / `relief_kept` row from that line the same tick … later weeks reuse the minted row … The DM may set the line on the card like any input." E.2 makes the line "the card's DEFAULT during the hearing-week pause — the DM may tilt or decree it … the advance resolves the one border contest with the answer AS IT STANDS". Suppose the DM decrees `kept` over a `sent` default. The record then keeps `relief_sent` with a trust-up patch, the contest is fought with no share, and the receipt reads "sent, but too few", which is false. P45 also contradicts §4.3: "the hearing week lit … gives the same rows a week later". The siege arm has the same shape ("the week it is taken", P9). CONFIRMED (both texts). The false-receipt consequence is PLAUSIBLE. | Where the pause applies, mint the answer row and its patch at the card's resolution, from the line as it stands. Where hearings are dark or the advance is long, mint the same tick. Restate P9 and P45 to match. |

**Minor notes (not counted):**
- PL8's base text still says "through the trust/resentment patch that moves grip", which its own r3 bracket refutes.
- The REFINED siege arm changes how PL7 reads `protection_failed`: a `sent` followed by `falls` now defaults the break to `quashed`. P5 should say the siege did not fall.
- P42's pair of outcomes cannot both happen: a column turned back at M never reaches N.
- §10 OBLIGATION relight says "answered the week the stage first meets its episode", which conflicts with §4.3 (2)'s first-sight call for incursions.
- E.2 and fold l.683 cite "PL §4.9", which does not exist.
- PS l.356 still quotes "polity before passage inside the week", and has not declared the liege-line sub-field. Both are PS's half or the seams'.

**CONFIRMED vs PLAUSIBLE:**
- CONFIRMED by code read at `81f1cd963`: the stage order, the relief term and the grip law.
- CONFIRMED by quoting both texts: every fail and PL-W1's contradiction.
- PLAUSIBLE: PL-W1's false-receipt consequence and the frequency of the `unopposed` arm.
