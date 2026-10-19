# MN-r4-verify — refuting verifier over D-MN-r4's dispositions of `docs/DESIGN_FP_ARCH_MN.md` (P3 round 4b)

Seat V-MN-r4 (Opus 5.5), chair 0a2e8bd9 (Fable 5.1), 2026-10-19. Read whole: the kit README (RESUME BLOCK 2), VERIFY, SKEPTIC, RESEARCH-COMMON, RULINGS-PL-MN, -AFTER-RESEARCH, -AFTER-COMPILE, CHAIR-NOTES 1–18, ROUND1 (+addendum), ROUND2, ROUND2b (+addendum), ROUND3 §A–§G, ROUND4 §A–§E, ROUND5 (as begun), the BOARD's menace and body lines, `skeptic/MN-r3-verify.md`, `skeptic/SEAMS-r3.md`, `cure/D-MN-r4.md` and its probes, the ROUTES of all ten `cure/D-*-r4.md`, and the volume (880 lines, sha256 `2c1b0fb9…`; the lane's table check named `fd848202…`, so the file changed after it — re-checked: 22 tables, 0 column mismatches). Sibling rows cross-read: CH §2.2, ST §2.1/§2.4/§7.1/OD-ST-40/44, PL §4.3/OD-PL-48/55, PS §2.5, BD BD16/BD23/§8.2/§9.8 (d)/§11/S16/§19.0, the fold §3.4 `menace_met` ↳ r4 and `armies_meet` ↳ r4 and WC inbox (6) ↳. Code of record: master `81f1cd963`, read-only. Probes and receipts: `skeptic/MN-r4-verify-probe/` (the lane's two probes re-run byte-identical; `relief-timing.out`, `seenBy.out`, `tablecheck.out`). No other file written; no git; no suite.

## COUNTS

**holds 44 · fails 3 (1 a cure defect, already ruled by ROUND5 A.5; 2 ROUTED-UNAPPLIED) · stop 0 · new 1 MAJOR (0 BLOCKING) + 7 minor · routedUnapplied 2.**

What holds: R-CH-1 / SEAMS-r3-9 / A.10 (CH §2.2's seam words, `x × mult`, oriented to holding); MN-W1 / A.13 (two producers in §3.2, §7 and OD-MN-31; the fold carries the r4 withdrawal and the `armies_meet` ↳ r4 rewording); MN-W2 / A.14 (EXECUTED: `wouldbe.rerun.out` byte-identical, and `stressors.js :: stressorTypesForPressure` reads "`pressure.score >= rule.birthThreshold`", while `siegeGate` returns `gateResult` and never null); MN-W3 / A.5 (ST §7.1 lists MN's `reliefSent` among the field-force readers); N1 (EXECUTED: `union.rerun.out` byte-identical, and `rampThreat` takes no stressor input); N2, N3 (`classifyLegModes(digest, path)` read) and N4; L-BD routes (1)–(4); A.2 and A.12; the D-CH-r4 and D-PL-r4 routes; and every NOTED row spot-checked (`cult` and bare `readiness01` appear only inside the record row).

## FAILS

| id | class | route / disposition | the volume's current text | verdict |
|---|---|---|---|---|
| A.17 (= D-ST-r4's route) | CURE DEFECT (MAJOR, Law One) — already RULED by ROUND5 A.5 | CURED: ST's `holder.seenBy` rows are a registered source of `believedMenaces` | §3.3: a sighting counts only "on a site whose holder ref is `{ kind: 'menace', id: menaceId }`". ST OD-ST-40 says `seenBy` is "dropped with the holder". | FAIL. A departure the court did not perceive erases its belief: truth gates belief. ROUND5 A.5 moves the sighting into the court's own belief record. But MN has no such record: MN7 says "No new belief writer", and §3.5 lists none. MN's half therefore needs a home, either a telling on the court's rumor ledger (A.17's own "a telling on its channel") or a newly declared persisted shape. |
| R-BD-5 | ROUTED-UNAPPLIED (needs a ruling) | D-BD-r4 §5: "`PROMOTE_BODY` hands a NAMED body's name (a nameless one takes the DM's)" | §2: "a body's own derived place-and-kind name is never carried"; REFINED 4 | FAIL. BD also contradicts itself: BD16 says "place, size and name"; §11 and S16 say "the DM's name". |
| R-BD-6 | ROUTED-UNAPPLIED | D-BD-r4 §5: "a recruiting course takes NAMED gangs only" | §6 admits "a GANG … whose `where` touches that country". M58 merges a `thin` gang, which BD23's `NAMING_BAND` (`modest`) leaves nameless, and §13 then names it in a line. | FAIL |

## NEW FINDINGS

| id | sev | site | claim | receipt | cure |
|---|---|---|---|---|---|
| MN-X1 | MAJOR (it pre-dates r4; N2's cure makes it explicit) | §4.7 Candidates and ONE CADENCE; M17 | Decided menace relief never fires by default in a belief preset. | **The text.** Candidates must BELIEVE the siege. The answer is taken "in that first week … for each candidate" and re-asked only on three listed changes. A neighbour coming to believe is not one of them. **The code** (`relief-timing.out`). The rumor stage (l.2097) runs before the calamity stage (l.2527). Every hop is "`const travelTicks = Math.max(1, …)`". So no neighbour believes in the siege's first week, no later week asks again, and M17's "after" can never relieve. This bites the preset CHAIR-NOTES 18 (b) makes the default. | Take each candidate's answer the first week IT believes, keyed (candidate, `siege.sinceTick`), and add "a candidate comes to believe" to the re-ask list. PL §4.3's "the week … first appears" needs the same change (route PL). |

**Minor:**
- **m1.** MN5 still says "on the first-to-land-owns idiom". §4.2 and the MN-1 leaves say the same. §3.3's r4 REFINED instead makes the composer an OWNED unit, and CHAIR-NOTES 18 (d) "REPLACED" that idiom. One ownership sentence is owed.
- **m2.** OD-MN-2, THE OWNER'S ROW, still lists COURSE as four words. `enlists` needs its B-row bracket there.
- **m3.** `enlists` names no state guard. A `stilled` or `waned` menace with the course still standing enlists, and absorption can raise a waned menace (against MN10). Three more gaps: the order of two absorptions in one tick, `wear.weeks` on absorption, and §10 A's missing `absorbBody` path.
- **m4.** PROMOTE_BODY's companion `MENACE_COURSE` cannot mint "in the same act". Its subject comes from `menaceOptions` and its anchor is "DERIVED at mint from the record", which does not exist until the raise is approved (`menace_unknown`).
- **m5.** Once WC's people ledger runs, a deserter gang IS a `free_unit` (BD §3.2 (d)). Absorbing it into a menace that is not people (MN6) needs an untag path.
- **m6.** PL §4.3 says "the same function answers `siege` and `menace_siege` from the polity stage". MN §4.7 calls it from MN's own leaf. That makes two named callers (route PL).
- **m7.** Pact-bound answers have no home after week 1, because only sworn rows are minted. Each week's resolver falls back to the default, against "never re-drawn weekly". Separately, `reliefBy`/`keptBy` "on the Herald entry" are not among the two allowlisted names.

## CONFIRMED vs PLAUSIBLE

**CONFIRMED by execution against master's own modules:** MN-W2 and N1.

**CONFIRMED by read:**
- every hold;
- the A.17 FAIL;
- both ROUTED-UNAPPLIED rows (text against text);
- MN-X1's two code premises.

**PLAUSIBLE:**
- MN-X1's reading that no candidate is asked after week 1, and how often it bites;
- m3–m7;
- every DRAFT constant.
