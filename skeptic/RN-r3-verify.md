# RN-r3-verify — refuting verifier V-RN-r3, P3 round 3b: THE RENOWN (`docs/DESIGN_FP_ARCH_RN.md`, 880 lines, read whole)

Seat V-RN-r3 (Opus 5.5), chair 0a2e8bd9, 2026-10-18. I read the README (RESUME BLOCK 2), VERIFY, SKEPTIC, every rulings file through RULINGS-ROUND3 §A–§F, the BOARD's 10-18 rows, `skeptic/RN-r2-verify.md`, `cure/D-RN-r3.md` and its probe, and the ROUTES of all nine `cure/D-*-r3.md` files. Code was read at master `81f1cd963`, read-only. My probe is `RN-r3-verify-probe/rnR3Verify.mjs`, with its output in `rnR3Verify.out`. I touched no git and no tests.

## COUNTS
**holds 32 · fails 1 · stop 0 · new 1 MAJOR (0 BLOCKING) · routedUnapplied 3.** That gives 4 FAIL rows in all: one failed disposition and three ROUTED-UNAPPLIED halves. Those four rows share one cure site, RN §3.4 and §2.4.

The verdicts by group:
- **RN-V2 HOLDS.** The triple is in §5.1 and §5.3. `mergeArrival` returns `{ ...better, … }`, and `pickBetterTelling` is as quoted.
- **RN-V6 HOLDS.** PS l.122 and l.577 carry the clause only inside their strike brackets.
- **RN-V7 HOLDS.** The cap, the ceiling and `a_year` all hold, and every cited symbol exists.
- **All 16 NOTED rows hold.**
- **PT's four routed halves are carried.**
- **E.1 and E.2 hold.** RN carries none of `readiness01`, `full · … · empty`, "polity resolutions come before passage" or "adds nothing" (the one hit for "adds nothing" is about re-hearing).

## FAILS
| id | disposition | verdict | why / receipt |
|---|---|---|---|
| CH-r2-verify note "seed `relayedTick`" | CURED (r3) | **FAILS** (MAJOR-grade) | The r3 bracket at §3.4 says every registered seed takes "`relayedTick: null`), so the relay's continuation guard … relays it exactly as a feed seed". RULINGS-ROUND3 B (CH-V4) and CH §8 l.466 say the opposite: "the CONTINUATION GUARD PRE-STAMPED … the report lives in the home court's ledger alone". **EXECUTED** (P1): RN's seed is held by `fourth, home, meet, post, third`, which includes the post that was spied on. CH's seed is held by `home` only. |
| ROUTED-UNAPPLIED (D-CH-r3 §5 → RN) a | — | **FAILS** | The route says: "The `TELLING_SOURCES` arm copies a row's declared `relayedTick` onto the seed". RN §3.4 still has the arm write `relayedTick: null` (above). |
| ROUTED-UNAPPLIED b | — | **FAILS** | The route says: "The findings' origin is 'the employer's seat', not 'the meeting town'". RN §3.4 still says "one telling about its post, hop-0 origin the meeting town". |
| ROUTED-UNAPPLIED c | — | **FAILS** | The route says: "The leak `eventRef` gains `:<retainer.sinceTick>`". RN §2.4 (l.201) and §3.4 (l.262) still have `leak:<wnpcId>:<employerId>`, while CH l.485 has `…:<retainer.sinceTick>`. |

## NEW
| id | sev | site | claim | receipt | cure |
|---|---|---|---|---|---|
| RN-W1 | MAJOR | §5.5's court arm (r3, A.11), R59, OD-RN-41 | A court's voice moves **every** hearer by `sign × credibilityWeight(…) × 0.5` and reads no hearer relation. | **EXECUTED** (P2): the stock is absent, so the weight is 1, so the term is −0.5. That is **`enmity`** for a hearer indifferent to the court and the same −0.5 for the court's sworn enemy. The person voice in the same section gives 0 and +0.25 for those two hearers ("one who hates her leans the other way"). The court's term is above the per-deed lens cap of 0.4. It also drags the voicing court's own commons, which defeats §17's "the lords curse … the commons say it was well done" and the owner's words "contribute and conflict". | Weigh a town or court hearer by the landed pair state with the speaking court (`pairNet`, RN's lens-two read, which is not an RN regard). Weigh a person by its `c:` regard. Multiply by credibility, and cap the term at the voice maximum. The voicing court's own commons judge by their own lens. The chair re-rules A.11's "exactly as `party_slander`". |

MINOR, not counted:
- §5.1's writer scans every `deed:` telling with no cap filter, although `heardAt` says a capped deed is "heard only inside its capped `reach`".
- §5.5's crossing test "band a tick ago" cannot be rebuilt after RN6 replaces a term in place, so a false re-voice is possible once the cooldown lapses.
- §4.6's clock still says `a_decade`.
- A doer swapped to a settlement hits the refused pair at an `s:` holder, and the text does not say so.
- In the road presets, the cap's ring 1–2 `known` may still be louder than the landed distance fade. This is PLAUSIBLE, and RN-5 measures it.

## CONFIRMED vs PLAUSIBLE
The FAIL, the three routes and RN-W1's arithmetic are CONFIRMED by execution and by quoting both volumes. How often RN-W1 fires, and the ring-2 residual, are PLAUSIBLE. Nothing has been upgraded.
