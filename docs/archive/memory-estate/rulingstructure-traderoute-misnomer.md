---
name: rulingstructure-traderoute-misnomer
description: "⚠️ generatePowerStructure's third positional \"tradeRoute\" is a neighbour RELATIONSHIP object, not a route — a refuted \"fix\" would have caused a real regression"
metadata: 
  node_type: memory
  type: project
  originSessionId: c0eb8c59-b585-45a4-afa4-24af69125d15
  modified: 2026-07-26T20:07:09.284Z
---

`generatePowerStructure(tier, economicState, tradeRoute, config, …)` in
`src/generators/power/rulingStructure.js` has a load-bearingly MISNAMED third
parameter: every call site passes a neighbour relationship object
`{ neighborName, relationshipType }` or null (generatePower.js's
`tradeRouteArg`; economyReconciliation replays it as `intent.tradeRoute`), and
its sole consumer is `buildGovernanceLabels`, which reads
`.relationshipType`/`.neighborName`. The generator holds NO resolved route of
its own — `config.tradeRouteAccess` is the resolved route there by design.

**Why it matters (2026-07-26, executed evidence):** after a genuine
discarded-route defect was fixed in `economicState.js`
(`resolveGenerationWorldLaw(null, config, { tradeRoute })`), an agent's hazard
report claimed rulingStructure:87 was the same defect, "proven" by passing
`'port'` into the relationship slot — API misuse whose tell was
"Ongoing tensions with undefined". A second agent applied the prescribed cure,
measured a REAL regression (a non-coastal seaport with a hostile neighbour
loses its maritime merchant prose; 2/13 pipeline hashes shifted), reverted it,
and shipped comment-only guards on the parameter and the world-law call.

**Probe hazard from the same work:** a `port` trade route auto-derives
`coastal` terrain (resolveConfig → getTerrainType), and coastal terrain ALONE
satisfies the maritime predicate — so route-driven maritime behavior is
invisible to probes unless an explicit non-coastal `terrainOverride` is set.
Ten of the first thirteen probe cases were insensitive for this reason.

**How to apply:** before "fixing" a producer to hand its positional to the
world law, shape-check what the positional actually IS at every call site —
`resolveGenerationWorldLaw`'s third argument has exactly one legitimate
consumer (economicState). One agent's executed proof can still be API misuse;
refute with the real contract before repeating a cure across "siblings".
OWNER-GATED follow-up: rename the parameter (`tradeRoute` →
`neighbourRelationship`) — it crosses the POWER_INTENT_VERSION frozen snapshot
shape. Related: [[unreachable-predicate-conjunction-class]],
[[generation-remediation-gate-state]].
