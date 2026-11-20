# PEOPLE-2 hand-back (kept current at every push; last written 2026-11-20T17:27Z)

Seat: PEOPLE-2 of the seventh chair (chair session_019yED1SUxGVHyjQnoqoFvQ8; this seat session_019yED1QfbBhtLaDuWfGxc42). Assignment: `git show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/prompts/PEOPLE-2.txt` (it binds `PEOPLE-1.txt` with my names). Branch: `lane/people-2-2026-11-20`, started on c71e403f4, fast-forwarded to PEOPLE-1's docs tip 2783260be (src identical to the working line 43ab0f5eb). Builder branches: `lane/people-2-<unit>-2026-11-20`.

## The split (the chair, 17:13 UTC; `PEOPLE-1-HANDBACK.md`, THE SPLIT, governs)
PEOPLE-1 keeps B1 (structuralPosition, then activeConstraint: `npcStructure.js`, `src/data/npcStructureVariants.js`) to its merge. PEOPLE-2 holds: factions[].desc, factionRelationships[].narrative, settlementReason[], founding. NO builder for the three before the chair's verdict on their lines. Nothing under `src/` or `tests/` before "THE LANE IS YOURS at <commit>".

## THE CHAIR'S VERDICT ON THE THREE (17:21 UTC): APPROVED TO BUILD with strikes, four rewordings for the powers, three for settlementReason; the bar BY THE SENTENCE over all places of a size (150 a size; 20% passes as sampling); step B (codas) ships with step A; a SECOND TRANCHE authored to the chair's eye (six heaviest codas x7+, LOCAL_MERCHANTS, two noble ladder lines, nobles-ahead coda, Grand Merchant Oligarchy seat line); pick `pickVariantMixed` (MERGE `lane/kernel-mix-2026-11-20` at bd42d63c7, never cherry-pick); power-of-two NOT extended; hideable rule = `cardVeil.js :: isHideableHouse` + no crime fact, every other needed house listed by pool. Quoted verbatim in briefs P2-M6, P2-B2, P2-B3.

## State, field by field
| field | lines | ruling | unit |
|---|---|---|---|
| factions[].desc + factionRelationships[].narrative | PROPOSAL-factions-desc.md, PROPOSAL-factionRelationships-narrative.md (760384abf) | APPROVED 17:21 with changes | B2 brief `briefs/P2-B2-powerLines-BUILD.md`, cut at THE LANE IS YOURS (after merging kernel-mix and picking M6's scripts); second tranche: M6 (`briefs/P2-M6-power-tranche2-AUTHOR.md`, 686d62e9d) on `lane/people-2-m6-2026-11-20`, lines to the chair, then a later unit |
| settlementReason[] | PROPOSAL-settlementReason.md | APPROVED 17:21 with changes | B3 brief `briefs/P2-B3-settlementReason-BUILD.md`, cut at THE LANE IS YOURS; `narrativeGenerator.js` is the goals lane's: build on the commit the chair names |
| founding (foundedBy, overcoming) | PROPOSAL-founding.md (M3), not sent | IN SCOPE (prints through the traditions card); noble founder where no lord rules: LEAVE IT | M5 measure (`briefs/P2-M5-founding-MEASURE.md`, 9110b9861) on `lane/people-2-m5-2026-11-20` |

## Next
1. THE LANE IS YOURS: merge `lane/kernel-mix-2026-11-20` (bd42d63c7) into my lane; pick M6's scripts; cut B2 and B3 (two builders, path-disjoint; one heavy gate at a time).
2. M5 returns: push its branch, pick its commit, read section 0, send "PEOPLE-LINES founding <commit>".
3. M6 returns: push, pick, read, send "PEOPLE-LINES power-tranche2 <commit>".
4. At each merge: read the diff once, re-run red and green, two trees, lighting and wiring censuses by their doors, then "PEOPLE <field> <commit>"; the pipeline line and the factionDynamics line to the chair BEFORE the merge.
