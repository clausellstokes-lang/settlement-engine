# V-FS-r2: refuting verifier for `docs/DESIGN_FP_ARCH_FS.md` THE FISCAL SEAT (P6b round r2)

Chair 6eb7b5b6 (Fable 5.1). Seat: Opus 5.5. Written 2026-10-20 16:0x–16:1x CDT by `date`.

**COUNTS: 9 holds · 0 fails · 0 stop · 2 new (0 BLOCKING · 2 MAJOR).**

**What was judged.** Every id in the D-FS-r2 record was judged except four that are NOTED and change nothing:
- the five MAJORs: FS-r1-6, FS-r1-7, WS-r1-6, FS-V1 and FS-V2;
- the applied ruling D11-Q2;
- the MINOR FS-V-n1;
- the two WS routes, WSV-R-FS-1 and WSV-N-FS-2.

The four NOTED ids not judged are D11-Q1, D11-Q3, L-MG-R-FS and L-WS-R-FS.

The record has no REFUTED row and no STOP row.

**Inputs that do not exist.** `skeptic/FS-r2.md` and `skeptic/SEAMS-P6.md` do not exist. `SEAMS-P6.md` is only a brief in `briefs/`, and RULINGS-P6 D.13 says round 2 runs over the r1 verifier's tables. So 0 ids come from either file.

**Code of record:** master `81f1cd963` (the detached worktree, READ-ONLY).

**Probes** are in `skeptic/FS-r2-verify-probe/`:
- The lane's four probes were re-run. All four are byte-identical (`*-rerun.out`).
- The new probe is `riot-before-completion.mjs` with its output `.out`.

Nothing was edited except this report.

## The table

| id | disposition | verdict | why / receipt |
|---|---|---|---|
| FS-r1-6 (M) | CURED (D.8: completion over time) | HOLDS | A refused `exacting` hand now completes: custom in the first refused season, then the hand's own band (FS6, §2.2 `pressedHandOf`, §4.2 `band = refused ? pressed : raised`). Re-run of `completion.out`: 96/96 cells start at custom, never decrease, complete and never pass the raise. The schedule assumes the refusal stands, and it does not always stand: see FS-V3. |
| FS-r1-7 (M) | CURED (D.9: next week's mint, no SP-9 stage) | HOLDS | No residue claiming an SP-9 stage was found by grep. `assizeKernel.js` has a composition write channel ("settlementUpdates: … (prior.settlementUpdates)"). The mint runs at `pulseKernel.js` 649, `settlementUpdates` is built at 1868 and the composition runs at 2735, so row 27 can now pass. The cure leaves one commons-side gap: see FS-V4. |
| WS-r1-6 (M, routed) | CURED (D.10: posture as master has it) | HOLDS | `courtPostureOf`: "} else if (entry) { const signed = standingSigned(actor.id, entry); present.standing", with no SP flag. `appetite` only appears "if (strategicPostureActive(rules) …". `posture-live.out` and `roll-r2.out` re-run identical. WS §13 agrees. |
| FS-V1 (M, new) | CURED (the loop named, bounded and soaked) | HOLDS | The five home-front components are always present ("score01: roadScore … marketScore"), and coffers is the sixth when observed. Read with `DURATION_GAIN_CAP` 1 and `HOME_FRONT_CONTINUE_W` 0.35, this gives the ≤ 0.1167 bound; `homefront-bound.out` re-run identical. `warSeatBooks.js` reads no vault (0 hits), so there is no second road from the vault into the war. FS2, §7.5, row 17 (b) and OD-FS-23 say the same thing. (MINOR: only the ATTACKER is read, `readWarHomeFront({ actorId: attackerId …})`.) |
| FS-V2 (M, new) | CURED (cure (b): a DM-directed raise is never refused) | HOLDS | FS13, FS6, §4.2, §6.1, §8, row 15, row 9, mutants (f)/(i) and OD-FS-25 all agree. No line still says the DM's raise is collected short or lifted (grep). This is consistent with A.7. (MINOR, unreconciled: FS §0.2 still cites EDITOR's POP-2 row "the refused levy supplies the refusal reason to the existing `set-muster`/`set-levy` acts".) |
| D11-Q2 (ruling) | CURED (the consumer car named and cut with FS-1; OD-FS-24 visible) | HOLDS | Matches D.11 Q2 word for word. `decreeHook.js :: applyDecreesToSaves` exists, and runs at the head of the tick, before the settlement loop (`pulseKernel.js` "const decreeTick = applyDecreesToSaves(…)"). |
| FS-V-n1 (m) | CURED | HOLDS | The `books` flip re-ran identical. WS §13: "`courtTemperOf` passes NO `books` to `courtPostureOf`". |
| WSV-R-FS-1 (route) | CURED | HOLDS | FS §7.5 quotes `coffers_bare` and `levy_thin`. WS §5 "THE FISCAL LOOP … FS §7.5 names its half". |
| WSV-N-FS-2 (note) | CURED | HOLDS | No stale "coalition purse" or "corps purchase" remains in FS (grep). |

## New findings

| id | sev | site (FS §) | claim (quoted ≤1 line) | refuting receipt | cure |
|---|---|---|---|---|---|
| FS-V3 | MAJOR | FS6; §2.1 `refusedSinceWeek`; §6.2; §6.3 `held_firm`; row 8 | "The stamp and the steps clear the tick the refusal leaves the ledger." | **The ladder at master.** `commonsVoiceKernel.js :: advanceLitCommonsVoice` escalates one rung after `DWELL_TICKS` and de-escalates at once: "} else if (target < curRung) { nextRung = curRung - 1;". **Riot.** §6.3 says a held refusal "may climb to `riot`". At riot the refusal leaves the ledger, the stamp clears, and the mint collects the FULL raise (`band = refused ? pressed : raised`), so a rioting town pays more than a refusing one. **A one-tick ease.** The refusal drops, the stamp clears, and re-entry resets `refusedSinceWeek`, so collection goes back to custom. **D.8's own example never plays out.** EXECUTED (`riot-before-completion.out`, with the dips ignored): a criminal seat's `wringing` hand reaches master's riot threshold in 6–9 weeks, and an autocrat's in 12–17, which is before the second refused season. So "customary → heavy → extractive" cannot happen at master's constants. POP-2 says "refusal holds while its target act is live + a decay tail", and FS never states that this hold survives riot or flicker. | Define the stamp's life by POP-2's hold, not by the rung word. `refused` stays true while the target `hand` is live, at refusal or riot, through the decay tail. `refusedSinceWeek` is not reset by a one-step ease inside the tail. Pin both cases: riot is never above the pressed band, and a flicker never resets the steps. Route POP to confirm the refusal hold at the riot rung. |
| FS-V4 | MAJOR | FS7; §6.3; §10.2 "Leave"; row 10; row 27 | "requirement 24 (b)'s 'FIRST, from the seal or the default' is met inside FS's pass" | **Order.** `assizeKernel.js` runs "V-23 THE COMMONS' VOICE — first", then the assize, and FS mounts THIRD. So in the tick that resolves a sealed `remitted`, POP's kernel runs before the verdict. It reads `exaction01` through the still-stored hand (the record drops only in FS's pass), so it can still escalate. **What can follow.** A riot can be entered: LEGIT_DIP, +0.10 unrest, and "the streets rise over the new taxes". Then, in the same tick, `commonsAnswer.js` emits "the seat heard them, and the square emptied". **Against the ruling.** The fold §3.4 ruling (5) says "the next advance resolves the docket FIRST". D.9 excused the MINT's lag only. Row 10 admits that the commons react to the verdict a tick late, but it treats only de-escalation. | Mount FS's resolver and its verdict arm (`taxRefusal.js` → `applyFiscalVerdict`) FIRST in the commons composition, before `advanceCommonsVoice`; it is still a name-only mount with zero kernel lines. Keep the hand's roll and the stamp third. The mint lag (D.9) is unchanged. Row 10's "that tick" becomes true, and the pin is that the resolving tick emits no escalation beat for a remitted hand. |

**MINORs (not counted):**
- (m1) Route EDITOR to strike `set-levy` from POP-2's refusal-reason pairing. The levy meant there is homonym (1), the military levy; `set-levy` is meaning (3), a tax band, and is never refused (OD-FS-25).
- (m2) §7.5 and row 17 (b) should say "an ATTACKING court". `warTermination.js` reads only the attacker's home front.
- (m3) A season whose first refused week is answered `abated` pays no dip, even if it is held firm afterwards. This is the lane's Q3, still open.

## CONFIRMED vs PLAUSIBLE
CONFIRMED by reading the symbols cited at master `81f1cd963` and by execution (the four re-runs, identical, and `riot-before-completion.out`):
- every verdict in the table;
- FS-V3's mechanism and its timing at master's constants;
- FS-V4's composition order.

PLAUSIBLE, and not upgraded:
- how often FS-V4 occurs in play: it needs the dwell to be met in the resolving tick;
- FS-V3's thresholds once POP-2 adds its fifth rung: its threshold is unbuilt, and the riot threshold of 0.75 is master's.
