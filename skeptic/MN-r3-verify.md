# MN-r3-verify — refuting verifier over D-MN-r3's dispositions of `docs/DESIGN_FP_ARCH_MN.md` (P3 round 3b)

Seat V-MN-r3 (Opus 5.5), chair 0a2e8bd9, 2026-10-18. I read these whole: README (RESUME BLOCK 2), VERIFY, RULINGS-PL-MN, -AFTER-RESEARCH, -AFTER-COMPILE, CHAIR-NOTES, ROUND1 (+ADDENDUM), ROUND2, ROUND2b (+ADDENDUM), ROUND3 (§A–§F), the BOARD's menace lines, `skeptic/MN-r2-verify.md`, `cure/D-MN-r3.md` and its probes, the ROUTES of all nine `cure/D-*-r3.md`, and the volume (819 lines, mtime 17:59). Siblings I cross-read at the cited rows: CH §2.2, PL §4.3, ST §3.4 · ST10 · §8, PR §6.1 · §12, PS §2.5 · OD-PS-38, and the fold §3.1.30 · §3.4. Code of record: master `81f1cd963` (read-only). My probes are `skeptic/MN-r3-verify-probe/{union,receipt}.mjs` with their `.out` files. No other file written. No git. No suite.

## COUNTS

**holds 26 · fails 1 · stop 0 · new 3 MAJOR (0 BLOCKING) + 4 minor · routedUnapplied 1.**

- **What I judged:** all 26 D-MN-r3 rows. That covers both NEW MAJORs, the FAIL in part, PR-V2, all four minors, and all eight NOTED rows (spot-checked; each zero-hit claim re-grepped).
- **What holds:**
  - SEAMS-r2-7's three halves.
  - MN-V5's id rule (M37 scoped, M57).
  - MN-V6's shared car. ST §3.4, PR §12 and PS P14 now cite it, and the fold carries §3.1.30.
  - A.1, A.6, A.7, A.10, A.13, A.14 and A.15's form.
- **§E receipts pass:**
  - E.1: 0 hits for `full · … · empty` or for a bare `readiness01`; `SITE_READINESS` and `siteReadiness01` are cited.
  - E.2: 0 hits for "polity resolutions come before passage" and 0 for "a `sent` taken after the contest".
- **Routes addressed to MN:**
  - PL, PR, PS and ST: all applied.
  - CH: one half is unapplied.

## FAILS

| id | class | route (D-CH-r3 §5) | volume's current text | verdict |
|---|---|---|---|---|
| R-CH-1 | ROUTED-UNAPPLIED (minor; = SEAMS-r3-9) | "§5.2 and §5.5 apply `paragonLean(…, 'menace_siege_draw' \| 'menace_raid_wear').mult` as `x × mult`" | §5.2: "read through CH's ONE seam leaf `paragonLean(worldState, settlementId, 'wildland', side)`". §5.5: "through CH's `paragonLean`, as in §5.2". The volume has 0 hits for either seam word. CH §2.2's signature is `(worldState, settlementId, domain, seam)` ("the fourth argument named a side, which the seam word now carries"). | FAIL. The orientation half holds: `u × mult`, where mult > 1 reads toward holding. |

## NEW FINDINGS

| id | sev | site | claim | receipt | cure |
|---|---|---|---|---|---|
| MN-W1 | MAJOR | §3.2 (REFINED r3) and OD-MN-31, against §7's `menace_met` row, the §5.2 verdict table, M37 and M45; fold §3.4 `menace_met` ↳ r3 | The cure adds a third `menace_met` producer: a hostile column's arrival. MN's own registry row does not carry it, and its outcome contradicts MN's own rows. | MN §7's Climax column lists only "a relief column's ARRIVAL … OR a patrol DETACHMENT's arrival". In §5.2, "`menace_met` → `menace_beaten` … `relieved`" and "the relievers named". So Merewick, at war with Kell, would be named Kell's reliever, with `menace_relieved` news and PL's `protection_kept`. The fold row is unscoped ("a hostile settlement column's ARRIVAL at a town a menace holds under siege"), so it also fires in M37/M45's MINTED case, where the two armies co-besiege and no meeting is written. The §8 flags have no gate for the producer. | **Needs a ruling** (the chair's B-row named a meeting). Either strike the third producer, so that beside an adopted record the column co-besieges exactly as beside a minted one (M45), with the guard refusing only the crisis record. Or carry the producer in §7 with its scope, its default and an outcome map: a hostile column's `menace_beaten` gives `lifted`, never `relieved`, names no reliever and writes no protection row. Then re-bracket the fold. |
| MN-W2 | MAJOR | §3.2 receipt and M57 | `warSiegeRefused` is derived from `hostileNeighborsOf` alone. So the Why panel can claim a refusal that never ran, by a war that does not exist. | EXECUTED (`receipt.out`): `hostileNeighborsOf` returns `rival` and `cold_war` neighbours (`HOSTILE_RANK = { hostile: 3, cold_war: 2, rival: 1 }`), and their siege origin is `unattributed`, not a war. It takes only `(snapshot, settlementId)`, so no conflict pressure (`birthThreshold` 0.72) is consulted. The resulting line, "Merewick's war adds no second siege there", breaks the Evidence Law. | Derive the receipt from a would-be birth: a `type === 'hostile'` neighbour whose siege birth would interpret as `declared_war`, with conflict pressure at or above the siege `birthThreshold`. Never from `hostileNeighborsOf` alone. |
| MN-W3 | MAJOR (pre-dates r3; surfaced by A.1/E.3) | §4.7 Amount, §5.2 `reliefSent`, M9 | A menace siege's relief counts the reliever's ready keep. | §5.2: "`reliefSent` = Σ `homeDefense(reliever) × ALLY_RELIEF_FRACTION`". With THE SITES lit, `homeDefense` includes `siteDefense` (ST §6, ST10 "relief SUBTRACTS it"). A.1 says the keep "neither marches nor is drawn", and PL §4.3 and PS OD-PS-38 already read the field force. | `reliefSent` = Σ (`homeDefense − siteDefense`)(reliever) × 0.4, which is `computeAllyRelief`'s per-ally term as ST10 amends it. M9 follows. |

**Minor:**
- **N1.** MN5 and M50 say "NEVER LATCHES". That holds for the term but not for the union `T + p(1 − T)`. EXECUTED (`union.out`): a calm town at war exhaustion 0.8 has T = 0.36, and with p = 0.35 its raw threat is 0.584, so it latches. The same happens when occupied `extractive`. Add the condition "where the town's own ramp threat is under ~0.31", and state Kell's ramp in M50.
- **N2.** PLAUSIBLE: the calamity stage (`pulseKernel.js` l.2527) runs before the polity stage (l.2752). A first-week verdict may therefore read no relief answer. E.2's idiom is the cure: call `reliefAnswerOf` at first sight.
- **N3.** §6's sea-leg rule names no leg-mode test. CH and PS cite `classifyLegModes`.
- **N4.** §10 F still says "MN's fork". `menaceReliefAnswer` was struck in r1.

## CONFIRMED vs PLAUSIBLE

**CONFIRMED by execution against master's own modules:** N1 (the union latch) and MN-W2 (rival and cold-war neighbours named).

**CONFIRMED by read:**
- every hold;
- R-CH-1, MN-W1 and MN-W3 (text against text across MN, CH, ST, PL, PS and the fold);
- the E.1/E.2 receipts.

**PLAUSIBLE:** MN-W1's and MN-W2's frequency (both are on dark paths), N2, and every DRAFT constant.
