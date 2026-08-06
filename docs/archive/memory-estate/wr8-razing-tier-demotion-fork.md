---
name: wr8-razing-tier-demotion-fork
description: "WR-8's razing is blocked by a DESIGN fork, not size/scope: tierEligibility (tierResourceDynamics.js:106) is the ONE tier writer and demotes off live population, so the razing must emit NO tierChange — but the second rung falls through strainedBelowFloor's LEGITIMACY conjunct, so severity-picks-the-rung has three costly resolutions and the volume settles none"
metadata:
  node_type: memory
  type: project
  date: 2026-08-03
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
---

Measured 2026-08-03 by lane W8-B on `claude/composite-r4` in
`.claude/worktrees/minifold`, while the razing (WR-8 amendments R + R2) was
being scoped. Three WR-8 waves have now stopped, each naming a different
blocker — size, then scope, and now neither.

**The mouth is not the problem.** `evaluateOccupations` in
`src/domain/worldPulse/occupation.js` is 555 effective against the 800 layer
ceiling (245 free) and carries no size-baseline entry. Its fresh-conquest loop
(the `freshConquestsFrom(warOutcomes)` seeding at "Step 1+2") is exactly the
fork the razing needs: seed an occupation record, or seed none and leave.

**FACT 1 — the tier law is already satisfied, for free, and nobody wrote this
down.** `tierEligibility` in `src/domain/worldPulse/tierResourceDynamics.js:106`
is documented in-file as "THE ONE TIER-TRANSITION ELIGIBILITY (promotion and
demotion both)" and demotes on `hardPopulationFailure = pop < currentMin * 0.82`
read off the LIVE population. So the razing satisfies the volume's "demotion
RIDES popToTier, never a second writer" by emitting **no tier write at all** —
deaths land through `populationDeltas` (the same channel warDeployment's P3 sack
uses at `warDeployment.js:1722`), and this evaluator demotes on a later tick.
Emitting `tierChange` from the razing would BE the second writer §0b forbids,
because `applyTierOutcomeToSettlement` (tierOutcomeApply.js:228) takes an
explicit `{fromTier,toTier,direction}` and writes the tier directly.

**FACT 2 — but the one-or-two-rung derivation does not close on that path, and
this is the actual blocker.** The volume's CORRECTED clause binds
severity → target rung → death fraction "conservation-exact". `tierEligibility`
demotes ONE rung per tick. At the second rung the survivors sit inside band
*t−2*, where `hardPopulationFailure` (`pop < min(t−1) x 0.82`) is **not
guaranteed** — whether the second rung falls then depends on
`strainedBelowFloor`, whose second conjunct is `support < 0.45`, a LEGITIMACY
read, not a sack read. Three resolutions, all with costs: (a) let the second
rung ride an unrelated support term; (b) drive the fraction below the target
band, breaking "conservation-exact"; (c) let the razing write the transition,
breaking §0b. **The volume settles none. Do not invent one — the ransom-claim
precedent applies.**

**FACT 3 — the vengeance licence is a new persistence surface**, and CR-WR8-A
declined to let the razing author one (`memoryHorizon`, "the engine's first
author of a new persistence surface") exactly one ruling earlier. Whether that
refusal scopes to `memoryHorizon` alone or to the licence ledger too differs by
a whole slice and is a chair call.

**Why:** every prior WR-8 stop was recorded as a size or budget blocker, so
successors keep re-measuring headroom and finding it adequate, then rediscovering
the tier fork from scratch. The fork is invisible from the razing's own files —
it lives two modules away, in a promotion/demotion evaluator nobody reading
amendment R would think to open.

**How to apply:** before building the razing, get the chair to rule fact 2's
three-way fork and fact 3's persistence scoping. Then: the razing intent belongs
in a NEW leaf, never in `src/domain/worldPulse/conquestIntent.js`, because that
module's exhaustive "punish is unreachable" walk IS the I4-deception scoping
proof and a razing read there destroys it (`punish` is already declared in
`CONQUEST_INTENTS` for exactly this reason). CR-WR8-B's resentment baseline must
be IMPORTED as `RELATIONSHIP_DEFAULTS.hostile.resentment` (= 0.78) from
`relationshipState.js`, never hardcoded. The atrocity casus now EXISTS
(@ `a80dd74a`), so CR-WR8-B's composite can read its second conjunct
(`grievance` OR `atrocity_answer` at/above the licence-adequacy band) whole.

Related: [[wr8-atrocity-casus-landed]], [[fable-build-era-takeover]],
[[queue-rows-list-specs-not-open-work]].
