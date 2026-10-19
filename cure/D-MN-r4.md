# D-MN-r4 — disposition lane for THE MENACE, P3 round 4a (Opus 5.5; chair 0a2e8bd9, Fable 5.1; 2026-10-18 22:29–22:5x EDT by `date`)

**Outcome.** 45 of 45 input ids disposed: CURED 25 · REFUTED 0 · STOP 0 · NOTED 20. The FAIL (R-CH-1, ROUTED-UNAPPLIED) and the three new MAJORs (MN-W1, MN-W2, MN-W3) are closed under RULINGS-ROUND4 A.10 · A.13 · A.14 · A.5. MN-W2's cure was RE-RUN against the verifier's own convicting probe cases (`D-MN-r4-probe/wouldbe.out`), and N1's ramp bound was EXECUTED on master's `stepEmbattlement` (`union.out`). THE BODIES' four routes are applied. The recruitment question was RULED by the B-row and is built as the course `enlists`. One REFINED goes beyond the inputs (CHAIR-NOTES 18 (d)). No STOP.

**Inputs read whole.**
- The kit README (RESUME BLOCK 2), COMPILE-COMMON, DISPOSE, RESEARCH-COMMON.
- RULINGS-PL-MN, -AFTER-RESEARCH, -AFTER-COMPILE, CHAIR-NOTES 1–18 (17 and 18 included), ROUND1 (+addendum), ROUND2, ROUND2b (+addendum), ROUND3 §A–§G, and ROUND4 §A–§E.
- The BOARD's menace lines.
- `skeptic/MN-r3-verify.md` with its two probes.
- `skeptic/SEAMS-r3.md`.
- The ROUTES of all ten `cure/D-*-r3.md` files.
- `cure/L-BD.md` §2–§7.
- THE BODIES' §19 MN row, plus BD16, §8.2, §9.8 (d) and §11.
- The MN lines of the round-4a ROUTES that had already landed (CH, PL, PR, PS, ST, BD, RN, PT).
- The volume itself. Its §0–§13 and the round-2b and round-3a record blocks were read whole. The earlier §14 blocks were read by grep only, and that partial read is PLAUSIBLE coverage.

**Before and after.** The pre-cure copy is `D-MN-r4-probe/DESIGN_FP_ARCH_MN.pre-r4.md` (sha256 `5aacb05c…`). The volume now runs 880 lines (sha256 `fd848202…` at the table check). `tablecheck.out` reports 22 tables with 0 column mismatches.

**Constraints observed.** No git. No suite. Master `81f1cd963` was read-only.

## §1 MEASUREMENTS (each CONFIRMED by a read at the symbol on master unless marked)
- **(a) The siege birth (A.14).**
  - `stressorsCore.js :: STRESSOR_CATALOG.siege` reads "`pressureKinds: ['conflict'], birthThreshold: 0.72`".
  - `stressors.js :: evaluateStressorRules` runs the guards in this order:
    - `existingKeys.has(targetKey)`;
    - then "`if (activeIds.has(idFor({ type, originSettlementId: String(pressure.settlementId) }))) continue;`";
    - then the spawn gate;
    - then `candidateForTypeAndPressure`, which calls `interpretStressorOrigin`.
  - `stressorDynamics.js :: interpretOriginContext` reads "`if (hostiles.length && hostiles[0].type === 'hostile') { return { variant: 'declared_war', attackerSettlementId: hostiles[0].otherId,`". Anything else gives `unattributed`.
  - `stressorGates.js :: siegeGate` returns `gateResult` (`{ probabilityMult, reasons }`), so it never blocks.
- **(b) The executed check of (a).** `wouldbe.mjs` imports master's modules and runs the verifier's four edge types × three pressures.
  - The cured derivation names Merewick in 2 of 12 cases: a `hostile` edge at 0.72 and at 0.90.
  - The old `hostileNeighborsOf`-alone read names Merewick in 9 of 12.
- **(c) The union latch (N1).** `union.mjs` reads master's `EMBATTLEMENT_TUNING` (ENTER 0.55 · EXIT 0.3 · DWELL 6) and steps `stepEmbattlement` from calm with the raid part p = 0.35.
  - T* = 0.3077.
  - At T 0.30 the union is 0.545 and the town stays calm.
  - At T 0.31 the union is 0.5515 and the town goes embattled.
  - At T 0.36 the union is 0.584 and the town goes embattled. This matches the verifier's `union.out`.
- **(d) Relief (A.5).** `warCapacityReads.js :: computeAllyRelief` reads "`relief += (Number(capacityFor(ally)?.homeDefense) || 0) * ALLY_RELIEF_FRACTION;`". ST10's amendment ("relief SUBTRACTS it") is read in ST, as are PL OD-PL-48 and PS §2.7's `passageFieldForceOf`.
- **(e) Stage order (N2).** In `pulseKernel.js`, "`const calamity = advanceCalamity({`" (l.~2527) comes before "`const treatyAdvance = advanceTreatiesWithDisposition({`" (l.~2752). The verifier's PLAUSIBLE ordering is therefore CONFIRMED. PL §4.3 as cured in r4 makes `reliefAnswerOf` pure and draw-free and the card's default, and states OD-PL-55, "THE MINT WAITS FOR THE WEEK".
- **(f) The leg-mode test (N3).** `roads/seaRoads.js :: classifyLegModes(digest, path)` returns one `'land'|'sea'` per hop.
- **(g) The seam words (A.10).** CH §2.2 reads "`paragonLean` | `(worldState, settlementId, domain, seam)` … `menace_siege_draw` 0.05 · `menace_raid_wear` 0.10 … `mult > 1` reads the champion's way on that seam (MN orients its draw so)".
- **(h) The sighting rows (A.17).** ST §2.4 (r4) reads "THE ROW IS A REGISTERED SOURCE of the holder's one belief read … MN's `believedMenaces` and BD's `believedBodyOf` compose it beside their tellings, newest by tick (ROUTE MN · BD)". ST measured the reason: the rumor stage runs before the calamity stage.
- **(i) THE BODIES.**
  - BD §8.2: "THE BODIES REGISTER ONE ROW, `bodyPresenceFeeder(T)`, into MN §3.3's `roadCountry(T)` … gated by `bodyEffectsEnabled`".
  - BD16 and §11 `PROMOTE_BODY` (dials: body · the menace's name · its course).
  - §9.8 (d): "a gang may JOIN a menace that recruits — only by the menace's OWN authored course … ends `merged` … its might a band up where MN's rule allows".
  - The flags are `bodiesEnabled · bodyEffectsEnabled`.
- **(j) The token census** (`census.out`):
  - `enlists`, `absorbBody`, `menaceEnlisting` and `lastSiteId` have 0 hits in master `src` (word and quoted literal), `tests` and `docs`, and in the ledger's other volumes.
  - `recruits` has 9 src files of prose only (0 quoted), 3 master docs and 7 ledger docs. It is a near-homonym of BD's `recruit`, so it was not taken.

## §2 THE RECORD (fails and new MAJORs first; the full table is the volume's §14 round-4a block)

| id | sev | disposition | where | receipt |
|---|---|---|---|---|
| R-CH-1 (= SEAMS-r3-9, D-CH-r3, D-CH-r4, A.10) | m (FAIL, routed-unapplied) | CURED | §5.2 · §5.5 · OD-MN-33 · M44 · M54 | CH §2.2's seam words (g) |
| MN-W1 (A.13) | M | CURED | §3.2 · §7 · OD-MN-31; the r3 REFINED withdrawn | MN §7 against §5.2; fold l.360 / l.466 (routed) |
| MN-W2 (A.14) | M | CURED, re-run | §3.2 · OD-MN-31 · M57 | (a), (b) `wouldbe.out` |
| MN-W3 (A.5) | M | CURED | §5.2 · §4.7 · §0 · M9 | (d) |
| N1 | m | CURED, executed | MN5 · §3.3 · §4.2 · OD-MN-29 · M50 | (c) `union.out` |
| N2 (+ A.2, D-PL-r4) | m | CURED | §4.7 · §4.9 · M11 · §10 F | (e) |
| N3 | m | CURED | §6 | (f) |
| N4 | m | CURED | §10 F | — |
| L-BD (1)–(4) | route | CURED | §3.3 · MN5 · §2 · §6 · §8 · §9 · §10 · §13 · MN12 · OD-MN-19/40 · M42/M58/M59 | (i) |
| A.12 · A.17 (+ D-ST-r4) | ruling / route | CURED | §2 · §3.3 · §4.5 | (h) |
| the r3 routes PL · PR · PS · ST · FOLD | route | NOTED: held as applied (the verifier); N1 narrows MN5's sentence | — | — |
| A.1 · 3 · 4 · 6 · 7 · 8 · 9 · 11 · 15 · 16 · 18 · 19 · 20, §E ×2 | ruling | NOTED, each with its one-line reason in §14 | — | greps: `cult` 0, bare `readiness01` 0 |

## §3 STOPs
None.

## §4 REFINED (each bracketed in the volume; vetoable)
1. **The presence composer is an OWNED unit, and it reads TRUTH** (CHAIR-NOTES 18 (d)). It gets one manifest row, and its owner volume is MN (A.3 gave MN the text). It is cut with the first of C14 · C15 · C16 · C10. It resolves physics, so it reads truth. `reliefAnswerOf` is PL's unit and decides for an actor, so it reads belief. The timing in the volume is unchanged ("the first … to land"); only ownership and the read class are added.
2. **The course word is `enlists`, not `recruits`**, so it never shares a card with BD's gang choice `recruit`.
3. **MN's absorption rule.** A gang no more than one band below the menace adds one band. The might never rises above `formidable` and never rises while `mightHeld`. Conclaves and beasts are never absorbed. All DRAFT and UNMEASURED.
4. **A promoted body's derived name is never carried.** The DM names the menace (MN2). A trail is never an MN place: BD names the node country the body comes out at.

## §5 ROUTES (the halves this lane cannot write; one line each)
- **FOLD (D-FOLD-r4 / P4):**
  - Withdraw the §3.4 `menace_met` ↳ r3 row and §3.1 WC inbox (6) (fold l.360, "a third `menace_met` producer").
  - Re-word the `armies_meet` row (l.466) from "a menace meets an army only as `menace_met`" to "a hostile settlement's column meets a menace's force under this contest (A.13; WC's to define for a force with no transit record); a relief column or a patrol detachment meets it as `menace_met`".
  - Make OD-FC-46 ↳ read FOUR feeders (menace · untied site · enemy column · body).
  - Add §5 register rows: `enlists` (MENACE_COURSES), `absorbBody`, `menaceEnlisting`, `lastSiteId` (derived).
  - Add the §3.3 ownership row under 18 (d): `presenceComposer` is MN's and reads truth; `reliefAnswerOf` is PL's and reads belief.
- **WC (its inbox, the chair's):**
  - The round-3 note that "Arc A's contact leaf registers a hostile column's arrival as a `menace_met` producer" is WITHDRAWN.
  - Arc A's `armies_meet` says how a hostile column meets a menace's force, which has no transit record. Until it does, the column co-besieges (MN M45).
- **BD:**
  - §8.2 (l.516 "never latches") and its scenario row (l.817 "the country never latches (0.35 < 0.55)") inherit MN5's ramp bound: the union `T + p(1 − T)` latches once the town's own ramp is ≥ ~0.31.
  - §9.8 (d) cites MN's rule and writer: `absorbBody`, one band where the gang is ≤ one band below, never above `formidable` or while held. The course word is `enlists`.
  - BD-7's car-0 confirms `enlists`.
  - §11 `PROMOTE_BODY` maps onto RAISE_MENACE's four dials as MN §2 writes it, and names the node country for a trail-bound body.
- **ST:** a promotion re-points a body-held site's holder ref to `{ kind: 'menace', id }` through ST's one writer. Either the apply arm joins the closed caller list, or ST reacts to BD's `raised` end. ST's choice.
- **PL · PS · PR · CH · RN · PT:** none. PL's A.2 and A.5 halves are already written (OD-PL-55, OD-PL-48); CH's seam words stand.

## §6 OPEN QUESTIONS FOR THE CHAIR
1. **A.13's "meets the menace's force under WC Arc A's `armies_meet` contest."** That contest's live encounter is between two transit records, and a menace has none (MN6). MN therefore writes the meeting as WC's to define, and has the column co-besiege meanwhile (M45). If the chair wants a meeting resolved now, the work is a WC widening, not an MN kind.
2. **`enlists` excludes conclaves.** If the chair wants a menace to draw a hostile flock, that is a BD-side want and stays unbuilt.

## §7 CONFIRMED vs PLAUSIBLE
**CONFIRMED by execution against master's own modules:**
- MN-W2's cured derivation (`wouldbe.out`).
- N1's ramp bound (`union.out`).
- The volume's table integrity (`tablecheck.out`).
- The token census (`census.out`).

**CONFIRMED by read:**
- Every cited symbol in §1.
- The sibling texts at CH §2.2, ST §2.4/ST10/OD-ST-44, PL §4.3/OD-PL-48/OD-PL-55, PS §2.7 and BD BD16/§8.2/§9.8 (d)/§11/§19.
- The fold lines routed (l.360, l.466).

**PLAUSIBLE:**
- That `holder.seenBy`'s `mightBand` for a menace holder is its `STRENGTH_BAND_KEYS` word (ST names only "the might band SEEN").
- That BD's stage can call MN's writer in the same tick. BD runs after MN in `advanceCalamity`, so MN's might reads the absorption next tick.
- `armies_meet`'s reach to a menace (WC's).
- Every DRAFT constant, unchanged and UNMEASURED; the new band rule is added to the FP-46 roster.
