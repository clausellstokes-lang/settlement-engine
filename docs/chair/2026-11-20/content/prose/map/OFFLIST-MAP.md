# OFFLIST-MAP — SAME-1's STATE rows of OFF-LIST.md resolved to their pools (MAP-1, 2026-11-20)

Source: `origin/lane/same-1-2026-11-20:docs/chair/2026-11-20/content/same/census/OFF-LIST.md` (every row whose source is `publicProse.blocks.*`) against `draws.hxd.jsonl`. Each top sentence is matched to the drawn templates of that size (`{slot}` matches anything, `town` ↔ the size noun, `…` = prefix match). Columns and causes as in ALL-POOLS.md; eligible is per place (max over its draws of the pool). The EXCLUDED signature is STATIC (what the excluded variants carry that the drawn one does not); slot fills and fact values are not visible at the draw.

| size | OFF # | hxd top (SAME-1) | blockId | poolKey | vid | pool len | places drawing | eligible min/med/max | top vid share | cause |
|---|---|---|---|---|---|---|---|---|---|---|
| thorp | 1 | 100% (25/25) | DS-GEN-11 | criticalIssueCount: critical contradictions on the record | 3 | 3 | 25 | 1/1/1 | 100% | EXCLUDED: vid 1 name {band},{settlement}; vid 2 name {settlement},{band} |
| thorp | 2 | 100% (12/12) | DS-DEF-5 | arcane defense ABSENT | 3 | 3 | 50 | 3/3/3 | 40% (top is v1; row's v3 drawn by 12) | SPREAD |
| thorp | 3 | 100% (10/10) | DS-DEF-5 | charter hall ABSENT where the country warrants one | 1 | 3 | 34 | 3/3/3 | 35% (top is v2; row's v1 drawn by 10) | SPREAD |
| thorp | 4 | 50% (7/14) | UNRESOLVED | — | — | — | — | — | — | UNRESOLVED: no drawn template of this size matches the sentence (an engine string or a non-pool line in that block). Sentence: Nobody here is paid to keep order. |
| thorp | 5 | 48% (24/50) | DS-DEF-1 | readiness WEAK | 3 | 4 | 48 | 1/2/3 | 50% | SPREAD |
| thorp | 6 | 42% (21/50) | DS-DEF-2 | Internal Security: no legal infrastructure | 3 | 3 | 50 | 3/3/3 | 42% | SPREAD |
| thorp | 7 | 40% (20/50) | DS-POW-5 | council | 3 | 6 | 50 | 2/3/4 | 40% | SPREAD |
| thorp | 8 | 38% (19/50) | DS-ECO-12 | INCOME MIX: one source carries the town | 1 | 3 | 50 | 2/3/3 | 38% | SPREAD |
| thorp | 9 | 38% (19/50) | DS-DEF-9 | magicDependency false | 1 | 4 | 50 | 3/3/3 | 38% | SPREAD |
| thorp | 10 | 38% (18/48) | DS-ECO-1 | COMBINATION C3: the middle rungs | 2 | 3 | 34 | 1/2/2 | 53% | SPREAD |
| thorp | 11 | 36% (18/50) | DS-POW-4 | riskLabel: Stable (no challengers) | 1 | 6 | 46 | 2/3/3 | 39% | SPREAD |
| thorp | 12 | 35% (14/40) | DS-DEF-4 | structure null (nothing organized recognized) | 2 | 3 | 46 | 3/3/3 | 35% | SPREAD |
| hamlet | 1 | 100% (35/35) | DS-GEN-11 | criticalIssueCount: critical contradictions on the record | 3 | 3 | 35 | 1/1/1 | 100% | EXCLUDED: vid 1 name {band},{settlement}; vid 2 name {settlement},{band} |
| hamlet | 2 | 100% (13/13) | DS-DEF-5 | arcane defense ABSENT | 3 | 3 | 50 | 3/3/3 | 40% (top is v2; row's v3 drawn by 13) | SPREAD |
| hamlet | 4 | 64% (7/11) | DS-DEF-5 | charter hall ABSENT where the country warrants one | 1 | 3 | 27 | 3/3/3 | 37% (top is v2; row's v1 drawn by 7) | SPREAD |
| hamlet | 5 | 53% (25/47) | DS-DEF-1 | readiness WEAK | 3 | 4 | 40 | 1/2/2 | 63% | SPREAD |
| hamlet | 6 | 48% (24/50) | DS-ECO-12 | INCOME MIX: one source carries the town | 2 | 3 | 50 | 2/2/3 | 48% | SPREAD |
| hamlet | 8 | 42% (21/50) | DS-DEF-9 | magicDependency false | 3 | 4 | 50 | 3/3/3 | 42% | SPREAD |
| hamlet | 10 | 38% (19/50) | DS-DEF-2 | Internal Security: no legal infrastructure | 1 | 3 | 50 | 3/3/3 | 38% | SPREAD |
| hamlet | 11 | 38% (6/16) | DS-ECO-11 | EXPLOITATION: partiallyExploited | 4 | 5 | 7 | 1/1/3 | 86% | EXCLUDED: vids 1,2 name {settlement},{resource} + fact[no crisis: under_siege]; vid 3 name {chain},{resource},{good},{institution}; vid 5 name {settlement},{resource} + fact[crisis: under_siege] |
| hamlet | 12 | 34% (14/41) | DS-DEF-5 | NO organized force at all | 3 | 6 | 36 | 0/3/3 | 40% | SPREAD |
| village | 1 | 100% (14/14) | DS-GEN-11 | criticalIssueCount: critical contradictions on the record | 3 | 3 | 14 | 1/1/1 | 100% | EXCLUDED: vid 1 name {band},{settlement}; vid 2 name {settlement},{band} |
| village | 2 | 95% (20/21) | DS-DEF-5 | arcane defense ABSENT | 3 | 3 | 49 | 3/3/3 | 41% | SPREAD |
| village | 4 | 75% (9/12) | DS-DEF-5 | charter hall ABSENT where the country warrants one | 1 | 3 | 26 | 3/3/3 | 38% (top is v3; row's v1 drawn by 9) | SPREAD |
| village | 7 | 56% (10/18) | DS-ECO-11 | RESOURCE CONDITION: worked out, recovers in time | 1 | 2 | 16 | 2/2/2 | 63% | SPREAD |
| village | 8 | 55% (6/11) | DS-SUP-3 | ONE EXPECTED CATEGORY MISSING | 2 | 3 | 11 | 3/3/3 | 55% | SPREAD |
| village | 9 | 50% (25/50) | DS-DEF-2 | Internal Security: no legal infrastructure | 2 | 3 | 50 | 3/3/3 | 50% | SPREAD |
| village | 11 | 45% (5/11) | DS-DEF-12 | CAPACITY: enough | 4 | 4 | 11 | 2/3/3 | 45% | SPREAD |
| village | 12 | 42% (21/50) | DS-ECO-12 | INCOME MIX: one source carries the town | 2 | 3 | 47 | 2/2/3 | 45% | SPREAD |
| town | 1 | 100% (30/30) | DS-GEN-11 | criticalIssueCount: critical contradictions on the record | 3 | 3 | 30 | 1/1/1 | 100% | EXCLUDED: vid 1 name {band},{settlement}; vid 2 name {settlement},{band} |
| town | 3 | 83% (15/18) | DS-DEF-5 | arcane defense ABSENT | 3 | 3 | 47 | 3/3/3 | 36% (top is v2; row's v3 drawn by 15) | SPREAD |
| town | 5 | 67% (10/15) | DS-ECO-9 | HOW THE NEED IS MET: much of it brought in | 2 | 3 | 16 | 0/3/3 | 67% | SPREAD |
| town | 6 | 67% (8/12) | DS-ECO-11 | EXPLOITATION: partiallyExploited | 4 | 5 | 15 | 1/3/3 | 53% | SPREAD |
| town | 8 | 50% (11/22) | DS-DEF-5 | charter hall ABSENT where the country warrants one | 1 | 3 | 21 | 3/3/3 | 52% | SPREAD |
| town | 10 | 42% (19/45) | DS-DEF-5 | watch PRESENT | 1 | 3 | 41 | 1/3/3 | 46% | SPREAD |
| town | 11 | 40% (20/50) | DS-DEF-9 | magicDependency false | 2 | 4 | 44 | 3/3/3 | 45% | SPREAD |
| city | 1 | 100% (12/12) | DS-DEF-5 | garrison PRESENT | 3 | 3 | 50 | 3/3/3 | 42% (top is v1; row's v3 drawn by 12) | SPREAD |
| city | 2 | 57% (8/14) | DS-ECO-12 | INCOME WEIGHT: the practice of magic | 1 | 2 | 12 | 2/2/2 | 67% | SPREAD |
| city | 4 | 47% (8/17) | DS-SUP-2 | UPSTREAM WEAK: a chain the town's work draws on is failing | 2 | 2 | 17 | 2/2/2 | 53% | SPREAD |
| city | 5 | 46% (23/50) | DS-GEN-18 | STALLED | 3 | 4 | 39 | 2/2/2 | 59% | SPREAD |
| city | 6 | 44% (22/50) | DS-POW-4 | riskLabel: Holding | 3 | 3 | 44 | 2/3/3 | 50% | SPREAD |
| city | 7 | 44% (22/50) | DS-ECO-8 | PROSPEROUS | 2 | 4 | 39 | 3/3/3 | 56% | SPREAD |
| city | 8 | 41% (20/49) | DS-POW-5 | council | 3 | 6 | 37 | 0/3/4 | 56% | SPREAD |
| city | 10 | 38% (19/50) | DS-ECO-12 | INCOME MIX: two or three sources between them | 3 | 3 | 50 | 3/3/3 | 38% | SPREAD |
| city | 11 | 36% (13/36) | DS-DEF-5 | mercenary / contracted forces PRESENT | 2 | 3 | 36 | 3/3/3 | 36% | SPREAD |
| metropolis | 1 | 100% (15/15) | DS-DEF-5 | garrison PRESENT | 3 | 3 | 50 | 2/3/3 | 36% (top is v1; row's v3 drawn by 15) | SPREAD |
| metropolis | 4 | 50% (25/50) | DS-ECO-12 | INCOME WEIGHT: the practice of magic | 2 | 2 | 45 | 2/2/2 | 56% | SPREAD |
| metropolis | 5 | 45% (22/49) | DS-POW-6 | operation role duty evasion | 3 | 3 | 47 | 0/3/3 | 48% | SPREAD |
| metropolis | 6 | 43% (15/35) | DS-DEF-5 | mercenary / contracted forces PRESENT | 1 | 3 | 35 | 3/3/3 | 43% | SPREAD |
| metropolis | 7 | 42% (21/50) | DS-GEN-18 | STALLED | 2 | 4 | 41 | 1/2/2 | 51% | SPREAD |
| metropolis | 8 | 42% (17/40) | DS-SUP-2 | UPSTREAM WEAK: a chain the town's work draws on is failing | 1 | 2 | 40 | 2/2/2 | 55% | SPREAD |
| metropolis | 10 | 40% (20/50) | DS-DEF-2 | Internal Security: full legal chain (court AND prison) | 2 | 4 | 49 | 3/3/3 | 41% | SPREAD |
| metropolis | 11 | 39% (17/44) | DS-ECO-11 | RESOURCE CONDITION: worked out, recovers in time | 1 | 2 | 39 | 2/2/2 | 56% (top is v2; row's v1 drawn by 17) | SPREAD |
| metropolis | 12 | 38% (19/50) | DS-ECO-1 | COMBINATION C1: a high rung on a working approach | 2 | 4 | 42 | 1/3/3 | 52% | SPREAD |

ROWS: 54 STATE rows · EXCLUDED 5 · SPREAD 48 · UNRESOLVED 1

