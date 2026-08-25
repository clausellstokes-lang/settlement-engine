---
name: partial-projection-repair-silences-certifier
description: ⚠️ Repairing SOME denormalized copies of a renamed entity is worse than repairing none — the checker validates exactly the structured fields you fixed and goes green over prose that still names the departed
metadata: 
  node_type: memory
  type: project
  date: 2026-07-26
  tags: 
    - hazard
    - denormalization
    - verification
    - generation
  originSessionId: 6d49850a-ab42-4cf7-ba2d-1b3e1bafe5c6
  modified: 2026-07-26T18:28:28.152Z
---

Learned 2026-07-26 when a 5-lens adversarial refutation tore into the NPC reroll preservation fix ([[regen-edit-loss-hazard]]).

## The hazard
When an entity is substituted or renamed, its name lives in more places than the fields that carry it *structurally*. In SettlementForge a relationship denormalizes its NPCs into SIX things, not four:

- `npc1Name` / `npc1Role` / `npc2Name` / `npc2Role` — structured copies
- `description` / `tension` — **generated prose with both names interpolated**

`generationReceiptJudgments.finalGraphFindings` checks **only the structured four**. So a repair that fixed exactly those turned the certifier GREEN over a dossier rendering the keeper's name as a card header above a paragraph narrating someone no longer in the cast (297/1073 edges; 0/125 on the control). The half-repair was worse than no repair: without it the drift was at least *detectable*.

Same class on NPCs: `generateCrimeLevel` bakes a roster member's name into `secret.what` / `secret.stakes` — a path census found those the only other NPC fields carrying an interpolated roster name.

## How to apply
- Before repairing denormalized data, **census every field that embeds the value**, prose included. Grep the generator for template literals interpolating `.name`.
- **Never let the repaired field set equal the checked field set.** If your fix makes a validator green, ask whether the validator covers what a human would SEE, or only what you just touched.
- Prose is re-derivable when the variant picker is a hash: `pairProse` (src/data/npcData.js) uses `pickVariant(pool, fnv1a32(pairKey))`, NOT an RNG draw — so re-running `archetype.desc(a, b)` consumes zero randomness and is safe inside a seeded run. Check for this property before assuming prose must be preserved rather than regenerated.
- Assert the INVARIANT, not the field: "no relationship's description/tension and no NPC's secret.* may contain a name absent from the roster" catches the whole class; asserting `npc1Name === roster.name` catches only what you already fixed.

## Sibling lesson from the same review
A fixture that puts the qualifying entity at **index 0** cannot discriminate a predicate-driven selection from a positional `slice(0, N)`. A mutant that ignored the preservation predicate entirely passed all 27 tests. Bury the qualifier mid-collection.

And: `enrichNPCsWithStructure` leaves the roster **sorted by relevance**, so index 0 is the settlement's leader. Any scan that picks "the first matching slot" aims at the most important character — front-to-back matching erased the Mayor in 26/69 trials.
