---
name: single-writer-claim-needs-a-behavioral-pin
description: "⚠⚠ A pin that calls the single-writer HELPER directly proves the helper, NEVER that the writer still calls it — TCD-1's drift was replantable with 9 suites green. Cure = drive the REAL writer over REAL worlds and read what it PERSISTED, then prove it by planting the pre-fix spelling back."
metadata: 
  node_type: memory
  type: project
  modified: 2026-08-07T11:27:45.457Z
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
---

# A SINGLE-WRITER CLAIM IS NOT A GUARD

TCD-1 (`9ecec2a2`) introduced `seatTransitionGoverningFactionId` in
`src/domain/worldPulse/npcLadderKernel.js` so that applyWorldPulse's approved-transfer path
and npcLadderKernel's organic-succession path "cannot drift again". **That sentence was the
only thing holding the invariant.**

A verifier planted the exact pre-fix spelling back at
`src/domain/worldPulse/applyWorldPulse.js` —
`const governingFactionId = String(governingFaction?.id || installerFactionId || '');` —
left the helper untouched, and ran **NINE suites: ALL GREEN**.

**WHY THE EXISTING PIN COULD NOT SEE IT.** The pin that mentioned the helper
(`both seat-transition writers spell governingFactionId the same way`) calls
`seatTransitionGoverningFactionId(...)` **directly**. It proves the HELPER is correct and says
nothing whatever about whether the WRITER still calls it. This is a general shape:

> A pin that imports the chokepoint and exercises it proves the chokepoint.
> Only a pin that drives the PRODUCTION PATH and reads what it PERSISTED proves the
> chokepoint is still on that path.

## The cure that landed (`65ed49fd`)

`tests/domain/warSeatBooksFactionAddress.test.js` now drives the real
`applyWorldPulseOutcomes` over the real generated worlds of its corpus and reads the row it
actually wrote onto the `npcLadder` spatial ledger. Four assertions: the persisted
`governingFactionId` is the HOLDER's `ladderFactionKey`; it is **NOT** the installer's id;
it equals `seatTransitionGoverningFactionId` by name; and `installerFactionId` still survives
under its own honest field. **The plant now reds 4 of 13, gate exit 1 — proven by planting it
back, not argued.**

## How to drive applyWorldPulse's seat-transition writer (hard-won; reusable)

Three preconditions, all of which silently produce **nothing** when missed:
1. `worldState.simulationRules` needs **both** `warLayerEnabled: true` **and**
   `warTerminationEnabled: true` (`warRulingsLit`, applyWorldPulse.js ~:535).
2. The outcome needs `proposalPayload.kind === 'government_change'` **and**
   `metadata.factionName` naming a **non-governing** faction on that settlement's real roster
   — `applyFactionPayloadEffect` no-ops when the faction is absent or already governs, and the
   whole block is gated on `nextSettlement !== entry.settlement`.
3. ⚠⚠ **THE LADDER MUST HAVE RESOLVABLE RUNGS.** `normalizeSeatTransitions`
   (`npcLadderState.js:709`) **DROPS** any row with no seat on either side
   (`if ((!fromRulerId && !toRulerId) || !cause || !hasTick …) continue`). With no `npcLadder`
   ledger, `rulingSeatNidOf` returns null on both sides and **the writer runs and persists
   NOTHING** — every per-row assertion then iterates an empty list and reports **GREEN**.
   Seed the ledger via `setSpatialLedger(ws, 'npcLadder', { [sid]: { factions: { [ladderFactionKey(f)]: { rungs: [realNpcId] } } } })`
   using **real npc ids from the same generated world**.

**Therefore the denominator must be a TOTAL POSITIVE PREDICATE:**
`expect(WRITTEN).toHaveLength(ROWS.length)` — never a credit-side count, which fails open
(see [[credit-side-enumeration-fails-open]]).

## The persisted-value shift this uncovered (declared @ `65ed49fd`)

TCD-1's "DECLARED GOLDEN SHIFT" listed the prose-variant move and "two new field appearances"
and **omitted a value change on an existing persisted field**. Measured 30/30 real worlds:

| | value |
|---|---|
| before | `hamlet-7100:merchant_guilds` — `installerFactionId`, factionCompetition's `${saveId}:${stablePart(name)}` space |
| after | `fac.merchant_council` — `ladderFactionKey` of the body that HOLDS the seat, `fac.<slug>` space |

**Doubly a change, and the second half was not in the report.** THE SUBJECT MOVES:
`transferRulingPower` seats a **new** governing body derived from the challenger's government
preference — the post-transfer holder shares a name with **neither** the prior holder (0/30)
**nor** the installer (0/30): *"Feudal Stewardship"* + installer *"Merchant Guilds"* ⇒
*"Merchant Council"*. So the old value named a body that never held the seat. THE ID SPACE
MOVES: the two spaces are disjoint, so no reader could have accepted both.

**Apply:** when a repair changes which value lands in an already-persisted field, that is a
declared shift **even when no golden file moves** and even when the field is "new-ish". Measure
it over real worlds, state the before/after and the RATE, and pin it by **re-deriving the
pre-fix expression each run** rather than quoting its result — a quoted figure rots
([[derive-dont-restate-and-mutant-must-change]]).
