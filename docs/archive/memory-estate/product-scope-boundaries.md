---
name: product-scope-boundaries
description: "The four deliberate design boundaries that filter what simulation substance belongs in SettlementForge — world-only, sub-century, simplicity-over-fidelity, never-resolve-named-fate"
metadata: 
  node_type: memory
  type: project
  originSessionId: 95cca3f6-d313-4fe1-91f6-b4b3a29fb5ef
---

The owner clarified (2026-07-12) four deliberate boundaries that filter ALL simulation-substance decisions. Test every proposed mechanic against them.

1. **WORLD-ONLY, NOT PARTY-FACING.** The product provides a *background dynamic world/setting*; how the party interacts with it is unlimited and is the **DM's territory**. OUT OF SCOPE by design: party renown/reputation, quest hooks addressed to the party, rival adventuring parties, consequence-return-to-players. "We only provide the setting and background dynamic world."

2. **SUB-CENTURY HORIZON.** Campaigns generally don't run over ~100 years, so mechanics that only pay off over generations/eras are low-value: natural mortality clocks, dynastic/hereditary turnover, positive-feedback "age ratchets," multi-generation memory.

3. **SIMPLICITY OVER FIDELITY.** Deliberate abstractions keep tracking manageable — e.g. deities are keyed to **ALIGNMENT** (two axes + rank), NOT domain/portfolio, "because it is simpler to track." Reject substance that adds tracking burden for fidelity.

4. **NEVER RESOLVE NAMED-CHARACTER FATE.** The sim must not prematurely kill or force-change a NAMED character (the DM may have plans; fantasy species may be long-lived). World events (plague/disaster/war) act on AGGREGATE population/economy/institutions and may FLAG a named character at-risk as a HOOK, but the DM owns the resolution.

**Corollary principle:** the sim RAISES stakes and tension around the world and its characters; the DM SPENDS them. In-scope drama = background world dynamism (nature, the wild, the arcane, faction/NPC plots, economy, war, faith, trade, occupation). Out-of-scope = anything resolving player or named-character outcomes.

**How to apply:** given these, the strongest *remaining* substance gaps are WORLD-as-actor forces the current political-economic-faith-war engine lacks — nature (plague/disaster), the wild (monster incursions), the arcane-as-event — plus making the already-rolled-but-inert NPC underworld (secrets, bonds, plots, non-reverting grudges) churn as living background. Related: [[whole-sim-empirical-assessment]], [[spatial-engine-direction]], [[owner-fix-philosophy]].

**6th boundary (owner, 2026-08-06) — SETTING-AGNOSTIC MEDIEVAL, THE CLOUD-WORLD TEST.**
The product targets ANY medieval-inspired TTRPG campaign or platform — not
D&D specifically — including exotic cosmologies ("a world made entirely of
clouds"). Therefore NO terrain-bound geophysical catastrophe mechanics
(volcanoes, floods) by design: the engine is CAUSE-AGNOSTIC and
CONSEQUENCE-FOCUSED — the DM authors the physical cause (the attributed-edit
doctrine generalized from faith to physics), the engine metabolizes the
universal consequences through the EXISTING crisis/stressor machinery
(scarcity, displacement, route disruption, capacity, news). Acceptance test
for any proposed mechanic: does it survive a cosmology with no geology?
Sociology, information, trade, war, belief, plague pass; terrain physics
fails. NOTE (verified 2026-08-06): plague/disease ALREADY EXISTS as a
first-class cause-agnostic crisis class across ~12 domain modules
(capacityModel, crisisLifecycle, supplyChainState, threatProfile,
stressorPicker, dailyLife, regionalGraph, diseaseLift) — an earlier chair
assessment calling epidemics a structural absence was WRONG and is corrected
here. Related: [[deity-doctrine-no-premade-pool]] (the sibling law).

**5th standing design law (owner, 2026-07-14) — THE LOADED-DICE LAW:** wherever possible and
appropriate, PRNG forks stay SITUATION-WEIGHTED: seeded fork on a stable composite key, sampling
a distribution the situation loads (EV/pressures/character/alignment/ties/credibility). Flat
draws only where the fiction is genuinely indifferent; the loading factors double as the
outcome's receipts; tuning adjusts weights, never fork keys/draw order (that is a golden-shift
event). Canonical: DESIGN_COHESION_WEAVE §H + playbook §0.0.2 row. Applies to every future wave
(E-family, W-PEACE, W-DOCTRINE, SM, Surveyor content rolls).