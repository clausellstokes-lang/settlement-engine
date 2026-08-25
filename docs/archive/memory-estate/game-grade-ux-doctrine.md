---
name: game-grade-ux-doctrine
description: "Owner north star 2026-07-22 — six core surfaces must reach Sims/SimCity/Civ/Bannerlord/Warhammer-grade legibility, UX, and navigability"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T23:27:48.701Z
---

Owner directive (2026-07-22, verbatim intent): for the **generator, settlement editor, map editor, the realm, custom content, and the Herald**, treat legibility, user experience, and navigability at the level of **The Sims, SimCity, Civilization, Mount & Blade (incl. Bannerlord), Total War: Warhammer** (owner added SimCity and Mount & Blade explicitly). M&B's distinct contribution beyond the encyclopedia: (7) every entity is a menu of VERBS, not just facts (click a lord -> talk/locate/relations), and the world legibly moves without you ("Count X is besieging Y" ambient awareness) — "that is the level of detail, prose polish, overview, experience, that we should focus on." The walk (polish backlog) continues under this bar, especially legibility + UX.

**Why:** these games solve exactly our problem — deep simulation made effortlessly readable. Their shared machinery, translated: (1) every number decomposes into its causes on demand (Civ tooltip breakdowns = our recorded cause DAGs, surfaced at hover-grade not just click-grade); (2) every internal state has a name, icon, cause, and duration (Sims moodlets = our band words + chips); (3) the encyclopedia is one click from anywhere and everything links to everything (Bannerlord N-key = Compendium deep-links + the address web); (4) forecast before commit (Warhammer pre-battle preview = Divination/Adjudication substrate + projected consequences in editors); (5) map lenses per question (Civ lenses = our 6 lenses); (6) an orientation layer that says what to look at next (advisors = needs-attention). 

**THE TRANSLATION PRINCIPLE (owner, 2026-07-22, load-bearing):** "we have deterministic formulas. We are NOT trying to show those formulas — we are trying to TRANSLATE them to a wide audience." Decomposition-on-demand means the recorded cause rendered as plain-language meaning ("The harvest failed, so grain ran short"), NEVER modifier arithmetic ("+2 food_pressure × 0.3"). Civ's always-answerable "why" is the feature; Civ's formula-term tooltip is explicitly NOT the format. Bands and sentences over raw numbers; the discourse kernel is the voice. (This leans the parked stat-bars bands-vs-numbers decision toward bands, but that ruling stays formally open.)

**How to apply:** frame every wave as *game-grade presentation of the simulation we already record* — NEVER game-grade simulation additions (simplicity-over-fidelity and [[product-scope-boundaries]] still govern; [[legibility-law]] is the test, this doctrine sets its ceiling). Our lever vs those studios: they hand-author tooltip formulas; our cause DAG is already recorded, so their hardest UX feature is a rendering problem here. The gap is cross-surface CONSISTENCY (six surfaces from different eras) more than capability — audits should score each surface against the six machinery points above. Related: [[realm-inspector-news-architecture]], [[the-herald-shipped]], [[legibility-wave-shipped]].
