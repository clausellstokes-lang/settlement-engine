# V-FS-r3: refuting verifier for `docs/DESIGN_FP_ARCH_FS.md` THE FISCAL SEAT (P6b round r3)

Chair 6eb7b5b6 (Fable 5.1). Seat: Opus 5.5. 2026-10-20. Code of record: master `81f1cd963` (the detached worktree, READ-ONLY; HEAD confirmed `81f1cd963`). Probe: `skeptic/FS-r3-verify-probe/untargeted-riot.mjs` → `.out` (imports master's `treasury.js` read-only). Nothing edited but this report. No git, no test suite.

**COUNTS: 10 holds · 1 fail · 0 stop · 0 new BLOCKING/MAJOR.**

`skeptic/FS-r3.md` and `skeptic/SEAMS-P6.md` do not exist (RULINGS-P6 E.10), so the inputs are the D-FS-r3 record's 19 ids. Every MAJOR was judged: FS-V3 and FS-V4, plus the five held MAJORs FS-r1-6, FS-r1-7, WS-r1-6, FS-V1 and FS-V2. The three cured MINORs and X-DWS2-FS-b were judged too. The eight NOTED notes and routes (FS-V-n1 · D11-Q2 · WSV-R-FS-1 · WSV-N-FS-2 · L-MG-R-FS · L-WS-R-FS · X-DWS2-FS-a · WSV2-res) change no text, and their HOLDs at V-FS-r2 stand. No row is REFUTED and no row is STOP.

## The table

| id | disposition | verdict | why / receipt |
|---|---|---|---|
| FS-V3 (M) | CURED (E.8): the stamp stands at `refusal` and at `riot` | **FAILS** | **The inversion survives through POP-2's no-target jump.** The stamp follows only a riot "entered from a targeted refusal" (D-FS-r3 §5 POP route; FS §2.1 "at or above refusal against this hand"). POP-2 says: "No live target ⇒ the ladder skips the rung as a TWO-STEP JUMP after ONE dwell (gathering→riot in a single escalation)". FS §6.1 makes `hand` a target only after it "has stood at least one commons dwell". So in two cases the riot carries no target, takes no stamp, opens no card and collects the FULL raise: (A) a town at `gathering` when the seat raises, because the exaction row lifts it to the riot band inside the hand's first dwell; (B) a town already at `riot` when the seat raises. When the street then quiets to `refusal` against the now-live hand, the stamp is set and the town collects custom. **EXECUTED:** `untargeted-riot.out` shows the riot collecting more than the refusal that followed it in 66 of 66 active cells, in both cases (A) and (B). Trace for criminal.port_customs: "1:riot:extractive … 20:riot:extractive 21:refusal:customary". The volume's general claims are therefore false on this path: §6.2 "a rioting town never pays more than a refusing one", OD-FS-8 "(a riot never collects more …)" and the answer's "for a riot does not end it". **The receipt does not cover this path.** `stamp-law.mjs` only walks ladders one rung at a time from `gathering`, never the jump, and its r3 zeros compare the r3 law with itself: "const ref = collect(seq, 'r3', STEPS[hand]);". |
| FS-V4 (M) | CURED (E.9, by design) | HOLDS | E.9 is applied at FS7, FS17, §0.1, §6.3, §10.2, rows 10 and 27, §15 and OD-FS-22. The master order is confirmed: `assizeKernel.js` "V-23 THE COMMONS' VOICE — first" and "V-22 THE ASSIZE — second". "Met inside FS's pass" now survives only inside history brackets (l.113, l.375). The REFINED `commons_answered` timing is routed to POP. |
| FS-r1-6 (M) | NOTED | HOLDS | The D.8 schedule is unchanged (FS6, §4.2, row 8). The stamp-life residue belongs to FS-V3. |
| FS-r1-7 (M) | NOTED | HOLDS | The next-week mint is unchanged, and it is widened consistently by E.9 (row 27). |
| WS-r1-6 (M) | NOTED | HOLDS | No text changed (§0.3, §3.1). |
| FS-V1 (M) | NOTED | HOLDS | Narrowed to the attacker: `warTermination.js:637-638` "readWarHomeFront({ actorId: attackerId". |
| FS-V2 (M) | NOTED | HOLDS | FS13, OD-FS-25 and row 15 are consistent. |
| FS-Vm1 / Vm2 / Vm3 (m) | CURED | HOLD | Vm1: the §0.2 bracket is present. Vm2: the attacker-only reading appears at FS2, §7.5, row 17 (b), §15 WC and OD-FS-23. Vm3: `abated` appears at FS3, §3.4, §5.3, §6.3, row 8 and mutant (m). |
| X-DWS2-FS-b | CURED | HOLDS | WS contains "keeps a SECOND, landed loop of its own" (1 hit). |

**Cure for the FS-V3 residual (one bracket, for the chair's consolidation).** Key the stamp to the target's liveness, as the r2 verifier proposed, rather than to how the riot was entered. `refused` is true while the ladder stands at `refusal` or `riot` and the hand is a live target. A riot entered by the jump, or already standing, adopts the target once the hand has stood its dwell, and the card opens then. Route POP to say this. Pin it with a path (A)/(B) fixture under row 31.

## New findings
None at BLOCKING or MAJOR. The residual is carried as FS-V3's fail, not double-counted.

MINORs (not counted):
- **(n1)** E.8 literally reads "the stamp clears when the ladder de-escalates (at once)". The lane reads that as clearing only below `refusal`, so a riot→refusal ease keeps the stamp. The reading is sensible but is recorded only in `cure/D-FS-r3.md` §3, not in the volume: the chair should confirm it.
- **(n2)** Row 10 says "the commons de-escalate one rung a pass" from the next tick. POP-2's "refusal holds while its target act is live + a decay tail" makes the refusal rung linger through the tail. Make the wording "after POP-2's tail".

## CONFIRMED vs PLAUSIBLE
CONFIRMED by reading master `81f1cd963` (the order, the attacker-only read, the ladder's one-step ease) and by execution (`untargeted-riot.out`). PLAUSIBLE: how often paths (A) and (B) occur in play, and POP-2's unbuilt riot→refusal step with a live target (the probe's ladder is synthetic, as the lane's is).
