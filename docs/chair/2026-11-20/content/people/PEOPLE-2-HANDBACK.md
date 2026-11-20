# PEOPLE-2 hand-back (kept current at every push; last written 2026-11-20T17:22Z)

Seat: PEOPLE-2 of the seventh chair (chair session_019yED1SUxGVHyjQnoqoFvQ8; this seat session_019yED1QfbBhtLaDuWfGxc42). Assignment: `git show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/prompts/PEOPLE-2.txt` (it binds `PEOPLE-1.txt` with my names). Branch: `lane/people-2-2026-11-20`, started on c71e403f4, fast-forwarded to PEOPLE-1's docs tip 2783260be (src identical to the working line 43ab0f5eb). Builder branches: `lane/people-2-<unit>-2026-11-20`.

## The split (the chair, 17:13 UTC; `PEOPLE-1-HANDBACK.md`, THE SPLIT, governs)
PEOPLE-1 keeps B1 (structuralPosition, then activeConstraint: `npcStructure.js`, `src/data/npcStructureVariants.js`) to its merge. PEOPLE-2 holds: factions[].desc, factionRelationships[].narrative, settlementReason[], founding. NO builder for the three before the chair's verdict on their lines. Nothing under `src/` or `tests/` before "THE LANE IS YOURS at <commit>".

## State, field by field
| field | lines | ruling | unit |
|---|---|---|---|
| factions[].desc | PROPOSAL-factions-desc.md, sent 88ed4a8fb | placement APPROVED (new data file + one line in generateSettlementPipeline.js after withConflictRelations; one line in factionDynamics.js for the regen's vote matcher, function and line to the chair before the merge); "village priest" index 0 takes `priest` as a NEED; verdict on lines and "quietly resented" PENDING | none until the verdict |
| factionRelationships[].narrative | PROPOSAL-factionRelationships-narrative.md, sent 88ed4a8fb | as above | none until the verdict |
| settlementReason[] | PROPOSAL-settlementReason.md, sent 88ed4a8fb | one argument in steps/generateNarratives.js APPROVED; power-of-two law on per-place lists: PEOPLE-1 proposes YES, ruling PENDING; dominance: new rows by the register's door, existing rows only shrink | none until the verdict |
| founding (foundedBy, overcoming) | PROPOSAL-founding.md (M3), not sent | IN SCOPE (prints through the traditions card); noble founder where no lord rules: LEAVE IT | M5 measure (brief `briefs/P2-M5-founding-MEASURE.md`, 9110b9861) on `lane/people-2-m5-2026-11-20` |

## Next
1. M5 returns: push its branch, pick its commit, read section 0, send "PEOPLE-LINES founding <commit>".
2. The chair's verdict on the three: one builder per unit (brief file first, red first), the power pair as one unit (one data file, one pass).
