---
name: pipeline-config-slot-silent-key-traps
description: "⚠️⚠️ generateSettlementPipeline SILENTLY IGNORES config-slot `seed`, `tier`, `terrain` and `terrainType` — a pin written that way is flaky/narrow by construction and reds nothing; seed goes in options (3rd arg), tier is `settType`, terrain is `terrainOverride`. Config-slot seed now THROWS (guard @ 4dbef1d1)"
metadata: 
  node_type: memory
  type: project
  modified: 2026-08-03T23:52:15.069Z
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
---

`generateSettlementPipeline(config, importedNeighbour, options)` reads the seed from
`options.seed || config._seed || generateSeed()`. Four keys that read like config and are NOT:

| written as | actually ignored, resolves to | the real key |
|---|---|---|
| `{ seed }` | a fresh `generateSeed()` — a different world every run | `options.seed` (3rd arg), or `config._seed` for replay |
| `{ tier: 'town' }` | the default tier (village) | `settType` |
| `{ terrain: 'riverside' }` | the default terrain | `terrainOverride` |
| `{ terrainType: 'riverside' }` | the default terrain | `terrainOverride` |

**Both bit lane PT2 in one session, in opposite directions:**
1. The spine's real-generation pins (`tests/domain/simulationSpine.test.js`, `tests/components/pipelineRailSpineProse.test.jsx`) and `tests/domain/aiGroundingLensSource.test.js` used `generateSettlementPipeline({ seed, tier: 'town' })`. They ran UNSEEDED for their entire life while asserting seed-stable prose, over villages while claiming towns. Two "same-seed" runs produced entirely different worlds ("raw wool and livestock" vs "transit trade and toll revenue"). Nothing ever red — no assertion can tell "this seed produces this world" from "some world produced something acceptable" when the seed never arrives, so a determinism assertion was not merely missing, it was UNWRITABLE.
2. A census looping `terrain` over five values silently measured ONE terrain. It made the origin-corpus census read 5 distinct bodies instead of 9 and made the port sub-arms look dead when all three are reachable (`terrainOverride=riverside` → "A river port built around navigable inland water"; `terrain=riverside` → the default "A coastal seaport").

**Why:** these are silent by design — a config bag accepts unknown keys, so a confident, wrong call site gets no feedback. The failure is invisible precisely at the call sites written to be rigorous (seeded pins, arm-space censuses).

**How to apply:**
- Generate through the estate's ONE spelling: `gen(config, seed)` from `tests/simulation/simHelpers.js` = `generateSettlementPipeline(config, null, { seed, customContent: {} })`. It is already imported cross-directory from `tests/domain/`, `tests/copy/`, `tests/generators/`. `customContent: {}` is what makes it headless/store-independent.
- Assert the inputs ARRIVED: `expect(settlement._seed).toBe(seed)` and `expect(settlement.tier).toBe(config.settType)`. Cheap, and the only thing that catches a slot slip.
- Use a seed FAMILY spanning the arms, never one seed (single-seed pins are vacuous — see [[wave-e-hazard-classes]]), plus a determinism pin (same seed → identical output) AND its negative control (different seeds → different worlds), or a constant-returning derivation satisfies determinism perfectly.

**STRUCTURALLY CURED for `seed` only** (@ `4dbef1d1`): `generateSettlementPipeline` now THROWS on a config-slot `seed`, matching the pre-existing guard on an options bag misplaced into the `importedNeighbour` slot. `config._seed` is deliberately NOT rejected — it is the saved-settlement replay path under THE PROMISE. Pinned by `tests/generators/pipelineSeedSlotContract.test.js` (E-A manifest `kind:'mutation'`, sweep plant #65 "generation/pipeline seed-slot guard removed"). **`tier`/`terrain`/`terrainType` are still silent — no guard exists for them.**
