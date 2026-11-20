# PEOPLE-1 hand-back (kept current at every push; last written 2026-11-20T16:29Z)

Seat: PEOPLE-1 of the seventh chair (chair session_019yED1SUxGVHyjQnoqoFvQ8). Assignment: `git show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/prompts/PEOPLE-1.txt`.
Branch: `lane/people-1-2026-11-20`, cut from the working line `lane/join-2026-11-14` at `43ab0f5eb`. Builder branches: `lane/people-1-m<N>-2026-11-20` (pushed as each returns; the integrator cherry-picks their commits).

## State, field by field
| field | measure | lines to chair | ruling | build |
|---|---|---|---|---|
| npcs[].activeConstraint | M1 done (PROPOSAL-activeConstraint.md) | sent with 01351d72d | awaited | — |
| npcs[].structuralPosition | M1 done (PROPOSAL-structuralPosition.md) | sent with 01351d72d | awaited | — |
| spatialLayout.quarters[].desc | M2 done (PROPOSAL-quarters-desc.md, branch m2 184940d47); follow-up asked: the minimal ordered atom set, whether an item-table slot can be declared without an atom per item | not yet | — | — |
| settlementReason[], history.founding.* | M3 measuring (held fields) | — | — | waits for the chair's commit |
| factionRelationships[].narrative, factions[].desc | M4 measuring (held fields) | — | — | waits for the chair's commit |

## Rulings and rules in force
- The chair, 16:10 UTC: `factVocabulary.js` is read-only; an atom the record holds is asked one at a time ("ATOM <key> : <home> : <wording>"), appended by the chair. Asked so far: export good (with the M1 lines). Queued: import good; whether the card's own house needs an atom.
- My read of M1 (READ-M1-npcStructure.md): B; one cure over every pooled row; five strikes or rewrites; pool id stays NPC_STRUCTURE.<key>.

## Known blemish
- The commits b53a665e7 (dangling), 6e84a81a7, b1f782f05 and 01351d72d carry a mistyped Claude-Session line (`session_019yED1Sri7MHNbHp`); the right one is `session_019yED1Rzt4qD1sri7MHNbHp`. Pushed history is not rewritten.

## Next
1. On M2's follow-up: read it, send "PEOPLE-LINES quarters-desc <commit>" with the atom question.
2. On the chair's rulings for M1's fields: cut ONE builder (brief file first, red first), read its diff once, re-run red and green, take the lighting and wiring censuses by their doors, merge, send "PEOPLE <field> <commit>".
3. M3/M4: read, send lines; build only on the commit the chair names.
