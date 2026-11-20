# PEOPLE-1 hand-back (kept current at every push; last written 2026-11-20T16:55Z)

Seat: PEOPLE-1 of the seventh chair (chair session_019yED1SUxGVHyjQnoqoFvQ8). Assignment: `git show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/prompts/PEOPLE-1.txt`.
Branch: `lane/people-1-2026-11-20`, cut from the working line `lane/join-2026-11-14` at `43ab0f5eb`. Builder branches: `lane/people-1-m<N>-2026-11-20` (pushed as each returns; the integrator cherry-picks their commits).

## State, field by field (the chair's order of 16:30 UTC, by SAME-1's render of 300 places)
| # | field | printed? | measure | lines | ruling | build |
|---|---|---|---|---|---|---|
| 1 | powerStructure.factions[].desc | YES (Power tab, PDF) | M4 done (PROPOSAL-factions-desc.md; READ-M4-powers.md) | sent with 88ed4a8fb | hold LIFTED: new data file + ONE call line in power/rulingStructure.js or claimStanding.js; the line and its function to the chair before the merge | — |
| 2 | powerStructure.factionRelationships[].narrative | YES (Power tab, village up) | M4 done (PROPOSAL-factionRelationships-narrative.md) | sent with 88ed4a8fb | as 1, the call line in factionDynamics.js | — |
| 3 | npcs[].structuralPosition | YES (people card) | M1 done | 01351d72d | APPROVED 16:41 UTC with four rulings and three atoms (quoted in briefs/B1) | B1 seated on c8c88cd4e |
| 4 | settlementReason[] | YES (Overview, PDF) | M3 done (PROPOSAL-settlementReason.md; READ-M3-origins.md) | sent with 88ed4a8fb | lines now; one call line in narrativeGenerator.js | — |
| 5 | history.founding.foundedBy / overcoming | PDF only | M3 done (PROPOSAL-founding.md) | NOT sent (last in order; noble/crown founder where no lord rules: put with its lines) | after the others | — |
| — | npcs[].activeConstraint | YES: proven by render, 38 of 38 holders show "Constraint: <stored>" on World/NPCs (scratchpad receipt, reported 16:5x) | M1 done | 01351d72d | awaiting the chair | after B1, same builder, same file |
| — | spatialLayout.quarters[].desc | printed NOWHERE | M2 done | cb4a00de2 | DROPPED by the chair (16:30); briefs/B2 is void | — |

## Rulings and rules in force
- The chair, 16:10 UTC: `factVocabulary.js` is read-only; an atom the record holds is asked one at a time ("ATOM <key> : <home> : <wording>"), appended by the chair. The chair ALLOWED own house, export good and import good (16:41); B1 appends them, and their three lines go to the chair as added.
- The chair, 16:25 UTC: prove a field PRINTS (by render, the surface named in the measure file) before measuring or writing for it; a field no page prints is dropped.
- My read of M1 (READ-M1-npcStructure.md): B; one cure over every pooled row; five strikes or rewrites; pool id stays NPC_STRUCTURE.<key>.

## Known blemish
- The commits b53a665e7 (dangling), 6e84a81a7, b1f782f05 and 01351d72d carry a mistyped Claude-Session line (`session_019yED1Sri7MHNbHp`); the right one is `session_019yED1Rzt4qD1sri7MHNbHp`. Pushed history is not rewritten.

## Builder in flight
- B1 (structuralPosition) on c8c88cd4e, branch lane/people-1-b1-2026-11-20 (local worktree; push it as it returns). At the merge: read its diff once; re-run its red and green; take the lighting census (LIGHTING_CENSUS_REFREEZE door, tests/lint/sovereigntyLightingContract.walker.test.js) and the wiring census (scripts/wiring-census.mjs) by their doors; send the chair the three atom lines as added; then "PEOPLE structuralPosition <commit>".

## Next
1. On M2's follow-up: read it, send "PEOPLE-LINES quarters-desc <commit>" with the atom question.
2. On the chair's rulings for M1's fields: cut ONE builder (brief file first, red first), read its diff once, re-run red and green, take the lighting and wiring censuses by their doors, merge, send "PEOPLE <field> <commit>".
3. M3/M4: read, send lines; build only on the commit the chair names.
