# Design note — the political-autonomy boundary: nature acts autonomously

**Status:** ruling, owner-decided. **Source:** `[worldpulse-core-6]` verdict in
`docs/COMPREHENSIVE_REVIEW_2026-07-13.md` (CONFIRMED / final medium — ruled *document*, not *gate*).
**Do not "fix" this in either direction without an owner ruling** (see the successor note below).

## The ruling (one paragraph)

The political-autonomy axis (`politicalAutonomy`: `routine` / `recommendations` / `dm_only`) gates
**political initiations** — the stochastic candidate families routed through the `authorityFor`
choke point in `candidateEvents.js` (`deriveCandidates`, the block under *Political-autonomy
AUTHORITY routing*): stressors, relationship shifts, faction competition, NPC agency, trade/migration
flows, settlement strategy, mobilization reactions, wars and coups. Under `dm_only` /
`recommendations` those candidates are forced to `proposal` — "every action awaits your word."
**Post-apply mover layers that model nature and physics — the M11a epidemic front
(`pestilenceKernel`, disease travel along trade channels), M11b calamity (`spatial/calamity.js`),
and their kin — act autonomously under `dm_only` BY DESIGN.** They are not political actors; a plague
crossing a trade route or a flood reaching a riverside town is a *consequence of world state*, not an
*initiation by an agent that holds authority*. The DM adjudicates the realm's politics, not its
weather and its contagions. Nature is therefore exempt from the political-autonomy axis, and that
exemption is intentional, not an oversight.

## The one nuance the survey caught (and why it is the intended boundary)

Under the spatial-canon marker, the M11a reconcile in `candidateEvents.js` drops the *aspatial*
`stressor_spread_disease_outbreak` spread candidate that the epidemic **front** replaces (ONE PLAGUE
TRUTH — no double-count), because the front materializes that same `disease_outbreak` stressor
hop-by-hop *post-apply*, never passing through `authorityFor`. The consequence: canonizing a spatial
map silently upgrades plague *travel* from DM-gated (the aspatial spread candidate would have routed
to `proposal` under `dm_only`) to autonomous (the front mints the stressor directly). This is:

- **byte-identical for the golden battery** — the aspatial and peaceful-spatial golden fixtures
  carry no *active* `disease_outbreak`, so the reconcile filter removes nothing on those seeds; and
- **a real change in DM-gating under `dm_only`** — which the reconcile's own "ONE PLAGUE TRUTH /
  equivalence" framing understates. The equivalence holds for *goldens*, not for *authority routing*.

That change is the ruling in action: plague spread, as a natural process, should advance without
waiting for the DM's word. Gating it behind the proposal queue would mismodel contagion as a
petitioner asking permission to infect the next town.

## Successor note — do not "fix" this in either direction

1. **Do not gate the nature movers behind the proposal queue** to "restore symmetry" with the
   aspatial spread. That would make the DM approve each hop of a plague or each week of a flood — a
   category error (nature is not a political initiator) and a product regression against the
   living-world design.
2. **Do not re-assert that the M11a reconcile is DM-neutral.** It is byte-neutral for goldens but it
   *does* move plague travel from gated to autonomous under `dm_only`. The `candidateEvents.js`
   reconcile comment now records this explicitly; keep it honest.

If a future design genuinely wants nature under DM control (e.g. a "pause the world's disasters"
mode), that is a new capability and an **owner decision** — route it through the owner-gated queue,
do not retrofit it as a silent "fix" to this boundary.
