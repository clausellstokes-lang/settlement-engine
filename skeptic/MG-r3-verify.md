# MG-r3-verify — the refuting verifier for THE MOVEMENT GRAMMAR, P6b round r3 (V-MG-r3, Opus 5.5; chair 6eb7b5b6; 2026-10-20 16:3x–16:4x CDT by `date`)

**COUNTS: 4 holds · 0 fails · 0 stop · 1 new (0 BLOCKING · 1 MAJOR).** I judged the four BLOCKING/MAJOR ids that `cure/D-MG-r3.md` disposes: MG-V2 and MG-V3 (both CURED), and MG-r1-9 and MG-V1 (both NOTED and re-checked). The lane recorded no REFUTED rows. `skeptic/MG-r3.md` and `skeptic/SEAMS-P6.md` do not exist (RULINGS-P6 §E.10), so they contributed no ids.

**What I read.** The README (RESUME BLOCK 3 and the laws), `briefs/VERIFY.md`, `briefs/SKEPTIC.md`, `briefs/RESEARCH-COMMON.md`, `briefs/RULINGS-P6.md` §A–§E, `skeptic/MG-r2-verify.md`, `cure/D-MG-r3.md` with its diff, and the volume whole: 580 lines, snapshot `MG-r3-verify-probe/MG.at-verify.md`. I checked the sibling text at PS PS9 and §4.1 (whole), HB l.1076–1112 and l.2558–2572, WS l.179, OP l.214, and PS/ST/PR for wing text (none). Master `81f1cd963` was read-only, with HEAD verified.

**Probes** (`MG-r3-verify-probe/`):
- The lane's `e3-gate-arith.mjs` and `e4-wing-holds.mjs` were re-run on master. Their outputs `e3.rerun.out` and `e4.rerun.out` are IDENTICAL to the lane's.
- `receipts.out` holds every quoted line below.

| Id | Disposition | Verdict | Why / receipt |
|---|---|---|---|
| MG-V2 | CURED (E.3) | **HOLDS** | The volume states ONE gate (the flag) and ONE bound (HB's ×[1, 1.2]) in the same words everywhere it matters: row 2, row 15, OD-MG-23, MG10, the §4 intro, §5.1 (ii)/(v), OD-MG-12 and S20. No per-dyad text survives; "stays dark while" appears only inside the cure bracket that quotes r2. `ANTICIPATION_SPAN: 0.2` is landed (`habitCurve.js :: HABIT_TUNING`, l.126). The re-run gives the doctrine's own effect ≤ ×1.20 and a bare pursuer ≤ ×1.20. Minor m1 is below. |
| MG-V3 | CURED (E.4) | **HOLDS** | The convicted case is closed. When an army is held by registrants (1)–(3), its wing is frozen the same tick (`e4.rerun.out`: "`wing r3 0.6667->0.6667 (held with its army)`"). The (a)-then-(b) order is buildable because PS's stage runs "after DERIVE + ADVANCE", and its FREEZE shifts "the clocks the record carries this tick, so `position01` stands exactly where the prior tick left it" (PS §4.1 / PS9). PS, ST and PR name no wing, which E.4 requires. The residue on a wing's own road is stated and depends on the arrival reader lighting. Minor m2 is below. |
| MG-r1-9 | NOTED | **HOLDS** | Step (0)(a) and `holdWingAtContact` are unchanged. (b) adds the wing to the held set, and Arc A "calls the writer only for a wing that set does not carry", so the one-hold-per-tick rule stays intact. |
| MG-V1 | NOTED | **HOLDS** | The r3 diff's changed ranges do not touch §7 (l.314–327), so the fleet text is unchanged. |

## NEW FINDINGS
| Id | Sev | Site | Receipt | Cure |
|---|---|---|---|---|
| MG-V4 | MAJOR | §11 `wingsEnabled` (l.374) vs §6.3 (l.298), S21 (l.429) and OD-MG-25 (l.482) | **The precondition.** `wingsEnabled` REQUIRES "PS's ruling on a wing's passage — INCLUDING PS's march row carrying the wing". §6.3 offers PS two options, "a fifth mover kind, or the wing under its army's key", and refuses only "until PS rules". **The r3 pins.** They assert "PS's, ST's and PR's leaves take no wing record", "PS's border leaf, which names no wing, is never asked one", and an unconditional `stranger_land` refusal (OD-MG-25), which matches E.4's "PS · ST · PR carry no wing text". **The conflict.** PS's march row is written by `passageBorderLeaf` "At first sight" (PS §4.1 step 1). Either of PS's options therefore puts wing text in PS's leaf. In any lit world the "until PS rules" refusal has expired, and S21 fails. | State that E.4 settles PS's wing-passage ruling AS the standing `stranger_land` refusal, until an owner names a wing. Drop "PS's ruling on a wing's passage" from `wingsEnabled`. Name the WRITER of a wing's march row (PS's stage helpers called from MG's leaf, never PS's border leaf), or narrow S21's scan to match. |

**Minors (not counted):**
- **m1.** The gate is named as the raw key `habitAnticipationEnabled`. HB's key is read "exactly once, in this one file" through `habitAnticipationActive`, which carries the order ladder. MG should name the gate function.
- **m2.** Under the E.4 decision source, a wing ANYWHERE freezes whenever its army is held, including up to the seven weeks of Bound 2 while the army waits on a passage answer. This is legible (the DM answer says so) but vetoable; it is the chair's open question 1.
- **m3.** A wing in its war's foe's land raises no `armed_incursion` card (§10). This is moot only while `wingsEnabled` stays gated as MG-V4 resolves.

**CONFIRMED vs PLAUSIBLE.** CONFIRMED by execution or read at master: MG-V2's arithmetic, MG-V3's convicted case, and the landed span. CONFIRMED by quoted text: MG-V4, MG-r1-9 and MG-V1. PLAUSIBLE: every sibling half (PS's held set and its helpers taking a wing record, and HB-7).
