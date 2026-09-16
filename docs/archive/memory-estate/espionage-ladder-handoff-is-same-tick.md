---
name: espionage-ladder-handoff-is-same-tick
description: "ES-5d D7 — the espionage→ladder credit handoff is SAME-TICK, not one-tick-lagged: pulseKernel.js calls advanceEnvoyDiplomacyPulse BEFORE the ladder chain, unconditionally, in ONE function, on the SAME worldState.tick. A depositTick===tick-1 window is SILENTLY DEAD because the deposit pass prunes the prior tick before the ladder looks. The ES-5D packet, its acceptance case A5, AND DESIGN_FP_ARCH_ES §3.14 all specified the dead window; the lag claim had been transferred from espionagePresence.js, whose one-tick lag belongs to a DIFFERENT pair (the whereabouts mirror, written by advanceRoads LAST)."
metadata: 
  node_type: memory
  type: project
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T15:22:42.441Z
---

2026-08-11, ES-5d Opus implementation lane, build branch `claude/composite-r4`.
All figures EXECUTED.

## Why (the shape of the failure)

Three independent authorities — the ES-5D packet (§5, §5b, §6.1, acceptance case
A5), the chair's own promotion note, and `DESIGN_FP_ARCH_ES.md` §3.14's prose
("consumed by the ladder's maintenance ONE TICK LATER") — all mandated a
`depositTick === tick - 1` consume window for the mission-credit deposit.

Measured, that window is **provably dead, and dead silently**, which is the worst
combination: every unit pin around it stays green because the leaf's own
read/write round-trip is self-consistent at *any* window. Only a test that drives
BOTH real movers in the real order can see it.

## The measurement

`src/domain/worldPulse/pulseKernel.js`, inside `simulateCampaignWorldPulse`:

- `advanceEnvoyDiplomacyPulse({` at **:2031** — the espionage product pass
- `…AndLadderAndTraditionsAndRoadsAndCommonsAndAssize({` at **:2563** — the ladder

Both are unconditional statements in ONE function body, in that order, and both
are handed **`tick: worldState.tick`** — the same value. So the DEPOSITOR runs
EARLIER IN THE SAME PULSE than the CONSUMER.

Under `tick - 1`: at tick T the espionage pass replaces the whole record set
(dropping T−1's deposits) *before* the ladder at tick T looks for T−1's deposits.
The fold never fires, on any world, ever.

## How to apply

- The correct carrier is **`readGratitudeBondEvents`** (`gratitudeBonds.js:96`,
  `ev.tick === now`), whose header states the reason outright: *"generosity ran
  earlier THIS tick; events carry tick === now"*. The ladder already hoists it at
  `npcLadderKernel.js:444`, one line from where the credit Map now hoists.
- It is **NOT** the `readRoadsBondEvents` shape. That deposit's one-tick lag is
  real but exists only because **ROADS runs LAST, strictly AFTER the ladder**.
  ⚠⚠ The two idioms sit adjacent in the same file and look interchangeable. They
  are not. **Which one you need is decided by pulse ORDER, nothing else.**
- ⚠⚠ **THE CLASS: a lag claim transferred from a different producer/consumer
  pair.** The packet justified its lag by citing `espionagePresence.js:17-31`.
  That lag is genuine — but it is the WHEREABOUTS MIRROR's, written by
  `advanceRoads` in the consequence_fold stage, LAST. Before inheriting any
  declared lag, re-derive it for YOUR pair from the pulse call order.
- Consume-once does **not** come from the lag. It comes from the deposit pass
  REPLACING the whole record set once per pulse, plus a strict tick equality on
  the read. Switching windows costs nothing in consume-once safety.
- The pin that keeps this from rotting: `tests/property/espionageCareerCreditDormancy.test.js`
  A5 asserts the two call-site offsets in `pulseKernel.js` directly
  (`indexOf('advanceEnvoyDiplomacyPulse({') < indexOf('AndCommonsAndAssize({')`,
  matched in CALL form so imports and prose cannot be mistaken for call sites).
  **If the pulse is ever reordered, that test REDS instead of the feature dying.**

## The general law (merged here 2026-08-11 from the duplicate file `a-handoff-window-can-be-provably-dead.md`, now a stub)

**A cross-pass handoff specified with the WRONG TICK ships green and does NOTHING.** A
vacuous feature is invisible to every test that only checks its parts, because the leaf's
own read/write round-trip is self-consistent at *any* window. **The pin that catches it
must assert the ORDER OF THE TWO PASSES, not the behaviour of either.**

**How to apply — for ANY cross-pass handoff, in this estate or elsewhere:**
1. Before designing the window, read `pulseKernel.js` and establish whether the writer and
   the reader sit in the SAME pulse, and in which order. Then PIN that order.
2. ⭐ Ask: *"if this window were off by one, would any test fail?"* If the answer is no,
   the window is unpinned and will eventually be wrong.
3. A lag is a property of a WRITER/READER PAIR, never of a file or a design volume.
   Re-derive it per pair; never carry one across.
4. Copy the sibling that shares your ACTUAL ordering — the cure that is machinery, not
   vigilance.

Related: [[npcs-dotted-token-convicts-a-new-worldpulse-leaf]] (the other ES-5d lane hazard,
same session) · [[receipt-vacuity-and-shared-ratchet-rules]] ·
[[credit-side-enumeration-fails-open]] · [[unreachable-arm-and-self-supplied-anchor]] ·
[[es5d-compiled-architecture-beta]].
