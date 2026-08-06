---
name: generator-probe-corpus-hazard
description: Probing generatePowerStructure directly instead of generateSettlementPipeline yields an unrepresentative corpus that silently understates defects
metadata: 
  node_type: memory
  type: project
  originSessionId: 77f0a972-0810-45b7-812e-3dadfadb7f79
  modified: 2026-07-20T01:26:25.195Z
---

⚠️ **`generatePowerStructure(tier, econ, route, config, insts)` is NOT a stand-in for `generateSettlementPipeline(cfg, null, {seed, customContent})` when measuring how often something is wrong.** The bare power step omits everything the pipeline layers on: stress factions, capture states, legitimacy crises, and the NPC affiliation pass. Its faction records show only `[faction, power, desc, category, rawPower, powerLabel]` + `isGoverning`/`modifier` on the seat; the pipeline additionally produces `crisisNote`, `legitimacyCrisis`, `modifiers`, `captureState`, and materially different power distributions.

**Two measurements I made that flipped when re-run through the pipeline (2026-07-19):**

| Question | Bare generator | Full pipeline |
|---|---|---|
| Does the highest-power fallback pick the true `isGoverning` seat? | 360/360 agree → reads "harmless coincidence" | **66/180 = 36.7% WRONG** → live defect |
| Does the governing seat have affiliated NPCs? | 125/125 EMPTY → "narrowing would be a regression" | **0/180 empty** → narrowing is correct |

Both bare-generator readings would have shipped a wrong justification in a code comment.

**Why:** the pipeline is where NPCs get `factionAffiliation`, and `rulingStructure` sorts the faction array governing-first *regardless of power* — so the seat is routinely not the strongest faction. Array order hides this from a casual read; any code that re-sorts by power lands on the wrong record.

**How to apply:** when measuring PREVALENCE of a defect ("how often is this wrong?"), always go through `generateSettlementPipeline`. Use the bare step only for cheap breadth on record SHAPE, and say in the test/commit which corpus a number came from. If a probe says a suspected bug never actually fires, suspect the corpus before concluding the bug is latent — that is exactly how [[faction-key-defect-class-census]] instance #4 was mis-triaged as latent in its own brief.

Related: [[wrong-lineage-worktree-trap-2026-07-14]], [[worktree-npmci-eusage-node-modules-walkup]].
