# DISAGREE PHASE 1: the measure on the uncured tree (244fa84ef)
Script `map/disagree-phase1.mjs`, run `TREE=/home/user/wt-disagree node <script> 150` through `gate-mutex.sh --run`; 900 births (seeds `dz-<size>-<i>`, i < 150), 161.3 s, exit 0 (log `/home/user/logs/disagree-phase1-900-c.log`).

| size | n | GEN-17 v1 | GEN-17 v2 | v2 full | (i) v2 & short | (ii) v2 & rota | (iii) WEAK key | (iii) W elig. | (iii) W & short | (iv) CHAIN key | (iv) F elig. | (iv) stores < 12 | (iv) ≥ 12 | (v) rows | (v) hideable |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| thorp | 150 | 0 | 0 | 0 | 0 | 0 | 124 | 0 | 0 | 0 | 0 | 0 | 0 | 13 | 0 |
| hamlet | 150 | 0 | 0 | 0 | 0 | 0 | 123 | 0 | 0 | 0 | 0 | 0 | 0 | 4 | 0 |
| village | 150 | 5 | 0 | 0 | 0 | 0 | 104 | 0 | 0 | 3 | 3 | 3 | 0 | 8 | 0 |
| town | 150 | 58 | 43 | 0 | 8 | 0 | 2 | 2 | 2 | 9 | 9 | 9 | 0 | 179 | 0 |
| city | 150 | 24 | 20 | 0 | 0 | 0 | 0 | 0 | 0 | 12 | 12 | 12 | 0 | 412 | 0 |
| metropolis | 150 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 51 | 44 | 0 | 44 | 450 | 0 |
| ALL | 900 | 87 | 63 | 0 | 8 | 0 | 353 | 2 | 2 | 75 | 68 | 24 | 44 | 1066 | 0 |

Seeds of (i): dz-town-2, dz-town-5, dz-town-22, dz-town-36 (the first four). (ii) and (v): none.
Eligible sets: WAGES, W1 W2 W3 together on both pages; FOOD, F1-F4 on 24 (all stores < 12), F4 alone on 44 (all stores ≥ 12).

## HOW EACH COLUMN IS READ
- GEN-17 variant printed: each GARRISONED variant's text of `general.generated.js` made a template (regex-escaped; `{slot}` a lazy wildcard; "the town" as "the" and any one word, for the tier noun; first letter either case; final stop dropped), searched in every mount text of `buildPrintProse(s, {})`. THE PAGE CUTS v2 AT ITS CLAUSE: it prints "The town pays wages for its defense as well as keeping its walls." (dz-town-2, overview.market), so each template also matches as each of its clause prefixes (cut at `, ` `; ` `: `) closed by a stop. "v2 full" is the uncut text ("...and the money is found every season"): printed on 0 pages.
- (i) `guardPay.js :: guardPayOf(s) === 'short'`; (ii) `watchIsUnpaidRota(liveInstitutions(s))`.
- (iii) key: `defenseStateProse.js :: economicRowPoolKey(s.defenseProfile.scores.economic)` = `Economic Survival: WEAK`. (iv) key: `foodTradesPoolKey(s.defenseProfile.chainModifiers)` = `CHAIN: food trades failing`. Keys only: whether the row's line composed on the page is not read here.
- Eligibility: the new lines (DISAGREE-LINES.md, marks as written) put at the END of their generated pools with the next vids (W1-W3 = v7-v9, F1-F4 = v7-v10), and `stateProseKernel.js :: eligibleVariants` run on the pool with the desk's own entry answers (`factsAnswered(crisisAnswered(wallsAnswered(s, { slots })))`, as `defenseThreatProse`). A page counts when any new line is admitted.
- (iv) stores split: `factVocabulary.js :: atomHolds('stores: < 12' | 'stores: ≥ 12', factsOf(s))`.
- (v) `cardVeil.js :: isHideableHouse` on every row of `s.institutions` that `partitionDefenseInstitutions` buckets as garrison, watch, militia or mercenary (deduplicated; live or not).
