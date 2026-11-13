# W2-WRITE — the hand-back of the second seat

**Lane:** `lane/w2-write-2026-11-13`, continued from the first seat's tip `31f57e8eb` in a scratch worktree (the main checkout untouched; the worktree's local branch is `seat2-w2-write`, pushed to the lane by `HEAD:lane/w2-write-2026-11-13` because the main checkout already holds the lane's name).
**Status:** ROUND 1 (the cold list's corpus variants) DONE · STAGE 2 (the first seat's lines read town by town) DONE · STAGE 3 (waiting rows, empty cases, three per case) see its section · the measures see their section. This file is the continuation point; the first seat's file (`W2-WRITE-HANDBACK.md`) stays as it was.

## Commits
| sha | what |
|---|---|
| 91592cbf1 | Round 1: the cold list's 69 corpus variants (124 cold lines) — 36 cured by a declaration, 22 by rewording out a claim no condition can check, 1 judged true by reading, 10 waiting (each below with the condition it needs). 46 new lines for the cases the disqualifiers emptied or thinned. |
| 27bc147e0 | Stage 2: the first seat's 62 lines read against one town per case: 3 found false and cured by a declaration (4 lines), 1 line for the case one cure thinned. |
| c16d7292a | merge of the first seat's last docs commit (c5c52739e); pushed |
| f84cd4436 | Stage 3, the layer-2 list: 20 lines, 1 guard declared (DS-DEF-8's famine override v2 presumed a guard). |

## Measure first (the base, 31f57e8eb)
- The 30 fixture towns re-born at the base with the cold list's own recipe (`birthConfig({...DEFAULT_CONFIG, ...town.config})`, `generateSettlementPipeline(cfg, null, {seed})`) and rendered through the soak harness (`scripts/audit/soak-review/renderHarness.mjs`, 20 tabs + Tonight): **the same 30 towns** (name and population 30/30). **113 of the 124 cold corpus lines still printed at the base**; the eleven that did not: the first seat's cure of DS-ECO-12 v1 (c02), DS-GEN-13 MARKET-OPEN v1 (a reworded sibling), and DS-POW-6 ADVANCING v1/v3 (another variant drawn; the falsity stood in the pool).
- The census's 720 born at the base (`census.sh`, 3 workers): `census-base/` in the scratchpad (counts, per-seed, dumps).
- Every pool of a false variant probed on the 720 (the kernel hook of the mapping seat, `jsx-register.mjs`): per town, the eligible variants (player, owner) and the facts each disqualifier reads.

## Round 1 — the cold list's corpus variants, one by one
Columns: the fixture towns the variant printed false in (by their cold-list id prefix); how many of them still printed it at the base; how many print the variant now; what that pool prints there now (vid; "—" = none of its lines found in the text, i.e. the pool printed none or a line whose text the matcher folds); the verdict. "Prints now" on a REWORDED row is the reworded line, read in that town and true there unless the verdict says WAITING.

| variant | false in (fixture) | printed at base | prints now | what the pool prints there now (vid) | verdict |
|---|---|---|---|---|---|
| DS-CND-1::DIRECTION: worsening · CRISIS: famine v1 | c03 | 1/1 | 0/1 | c03: v2 | DECLARED tier: ≥ village (the queues of a crowd) |
| DS-DEF-11::WALLED-STRAINED v2 | c12 | 1/1 | 0/1 | c12: v4 | DECLARED no crisis: under_siege (v1 too); + 2 siege lines |
| DS-DEF-1::readiness CRITICAL v1 | c11 | 1/1 | 0/1 | c11: v4 | DECLARED no guardPresence; + v4 for a town with people under arms. NOTE: c11 is rated CRITICAL beside an Invasion & War row of Strong (military 67): the readiness label and the score disagree (the defence desk's) |
| DS-DEF-1::readiness WEAK v3 | c09 | 1/1 | 1/1 | c09: v3 | REWORDED: "has not been attacked lately" dropped (no atom reads a recent conflict) |
| DS-DEF-2::Beasts & Monsters: plagued, perimeter AND organized force v1 | c09, c11 | 2/2 | 2/2 | c09: v1; c11: v1 | REWORDED: "answered it properly" dropped (the row's band is not a condition; v3 already says the walls are barely keeping up) |
| DS-DEF-2::CHAIN: defence supplied v1 | c23 | 1/1 | 0/1 | c23: v6 | DECLARED no crisis: hunger (v2, v3, v4 too); + 2 hunger lines |
| DS-DEF-2::CHAIN: defence supplied v2 | c27 | 1/1 | 0/1 | c27: v5 | DECLARED no crisis: hunger |
| DS-DEF-2::CHAIN: food trades failing v1 | c27 | 1/1 | 0/1 | c27: v4 | DECLARED no crisis: under_siege ("if the town were cut off"; v2, v3 too); + 2 siege lines |
| DS-DEF-2::CHAIN: food trades failing v3 | c25 | 1/1 | 1/1 | c25: v3 | REWORDED to the salting and drying trades ("food trades" read as the whole food supply); c25's 9 months of stores do not make "less preserved food" false |
| DS-DEF-2::CHAIN: food trades working v2 | c21 | 1/1 | 1/1 | c21: v2 | WAITING (chain status): the key says the food-processing chain works where its status is vulnerable (c21). Under siege: declared no crisis: under_siege (v1-v3) + 1 siege line |
| DS-DEF-2::Economic Survival: STRONG v1 | c28 | 1/1 | 0/1 | c28: v3 | DECLARED no crisis: famine, prosperity: ≥ moderate (v2: no crisis: famine); + 1 famine line |
| DS-DEF-2::Economic Survival: WEAK v1 | c05, c14, c15 | 3/3 | 0/3 | c05: v4; c14: v5; c15: v4 | DECLARED guardPresence (v2 too); + 2 lines for a town that pays no defenders |
| DS-DEF-2::Invasion & War: neither walls nor force v2 | c16 | 1/1 | 1/1 | c16: v2 | REWORDED to the present ("Nothing threatens {settlement} now"): the town's history may hold an occupation |
| DS-DEF-2::Invasion & War: walls AND professional garrison v1 | c22 | 1/1 | 0/1 | c22: v3 | DECLARED no crisis: under_siege (v2 too); + 1 siege line |
| DS-DEF-2::Invasion & War: walls with NO force v2 | c17 | 1/1 | 0/1 | c17: v7 | DECLARED no watch, no crisis: under_siege (v1-v3); + 2 watch-only lines, 2 siege lines |
| DS-DEF-4::structure organized v4 | c26 | 1/1 | 1/1 | c26: v4 | WAITING (a current crime wave: history.currentTensions has no atom) |
| DS-DEF-5::ARCANE: alchemists v1 | c26, c27, c30 | 3/3 | 3/3 | c26: v1; c27: v1; c30: v1 | REWORDED: "its alchemists" (a house) -> alchemy practised here (the key reads the tradition) |
| DS-DEF-5::ARCANE: alchemists v2 | c28, c29 | 2/2 | 2/2 | c28: v2; c29: v2 | REWORDED: "from its alchemists" -> alchemical preparations bought |
| DS-DEF-5::FIXTURE: charter hall v1 | c25, c30 | 2/2 | 2/2 | c25: v1; c30: v1 | WAITING (desk): the flag hasCharterHall matches an adventurers' guild or a hireling hall; the desk test pins the words "charter hall"; the name should come through a slot. Reword withdrawn |
| DS-DEF-5::FIXTURE: gates v1 | c17 | 1/1 | 0/1 | c17: v5 | DECLARED no crisis: under_siege (v2, v3 too); + 1 siege line |
| DS-DEF-5::NO organized force at all v3 | c07 | 1/1 | 0/1 | c07: v4 | DECLARED no crisis: under_siege, no crisis: wartime (v1, v2 too: both cast a defender); + 2 lines |
| DS-DEF-5::charter hall ABSENT where the country warrants one v2 | c24 | 1/1 | 1/1 | c24: v2 | REWORDED: "cannot afford" dropped (prosperity is layer 2, refused by the layer walker in this pool) |
| DS-DEF-5::walls PRESENT v2 | c09, c10, c11, c12 | 4/4 | 0/4 | c09: v4; c10: v4; c11: v4; c12: v6 | DECLARED gate, guardPresence, no crisis: under_siege; + 2 no-gate lines, 1 siege line |
| DS-DEF-6::Naval Defense: Port only v3 | c23, c25 | 2/2 | 2/2 | c23: v3; c25: v3 | REWORDED: "harbour mouth" and "nobody watches" out (a river port; a harbour master's office): nothing armed meets a ship |
| DS-DEF-9::magicDependency true v3 | c14 | 1/1 | 1/1 | c14: v3 | WAITING (the practitioner atom: magicReliance.js :: magicPractitioners; the first seat's row) |
| DS-DEF-9::magicDependency true v4 | c23 | 1/1 | 1/1 | c23: v4 | REWORDED: "its few practitioners" -> the arcane work done here (the count; the practitioner word waits for its atom) |
| DS-DEF-9::magicDependency true, with a NAMED dependent chain v1 | c21, c26, c30 | 3/3 | 3/3 | c21: v1; c26: v1; c30: v1 | REWORDED "lives on" -> "made at"; c21's {good} (game meat with no hunting chain) is the desk's fill: WAITING (desk) |
| DS-DEF-9::magicDependency true, with a NAMED dependent chain v3 | c15 | 1/1 | 1/1 | c15: v3 | WAITING (the practitioner atom; divine provision is not an arcane workshop) |
| DS-ECO-10::POSTURE: entrepot v1 | c10, c27 | 2/2 | 1/2 | c10: v1; c27: v4 | REWORDED "full of" -> "some of" (c10: only the furs pass through); DECLARED no crisis: under_siege (v2, v3 too); + 2 siege lines |
| DS-ECO-10::POSTURE: established v1 | c05 | 1/1 | 1/1 | c05: v1 | WAITING (income concentration: the top source's share has no atom) |
| DS-ECO-10::POSTURE: established v2 | c03 | 1/1 | 0/1 | c03: v5 | DECLARED tier: ≥ village, no crisis: under_siege, no crisis: famine |
| DS-ECO-10::POSTURE: established v3 | c22 | 1/1 | 0/1 | c22: v7 | DECLARED no crisis: under_siege, no crisis: famine (v4 too); + 1 siege line, 1 famine line |
| DS-ECO-10::POSTURE: established v5 | c15 | 1/1 | 1/1 | c15: v5 | WAITING (income concentration) |
| DS-ECO-10::POSTURE: established v6 | c08 | 1/1 | 0/1 | c08: v8 | DECLARED no crisis: under_siege, no crisis: famine |
| DS-ECO-11::EXPLOITATION: fullyExploited v1 | c08, c22 | 2/2 | 1/2 | c08: v1; c22: v2 | DECLARED no crisis: under_siege; c08 ({institution} "Mill" the roster lacks) WAITING (desk fill, the first seat's row) |
| DS-ECO-11::EXPLOITATION: fullyExploited v3 | c26 | 1/1 | 1/1 | c26: v3 | REWORDED: "the trade the town is built on" dropped (c26: 3% of income) |
| DS-ECO-11::EXPLOITATION: partiallyExploited v4 | c27 | 1/1 | 0/1 | c27: v6 | DECLARED no crisis: under_siege (v1, v2 too); + 2 siege lines. c27's "hard half" done at home: WAITING (desk key) |
| DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks v2 | c22, c27 | 2/2 | 0/2 | c22: v3; c27: v3 | DECLARED no crisis: under_siege; + 1 siege line |
| DS-ECO-12::CRITICAL IMPORT: the land cannot give it v1 | c01 | 1/1 | 0/1 | c01: v4 | REWORDED to true with or without imports (the imports atom has no answer in the kernel sweep's calm double); + 2 no-imports lines |
| DS-ECO-12::INCOME MIX: one source carries the town v3 | c01, c11 | 2/2 | 0/2 | c01: v1; c11: v1 | DECLARED prosperity: ≥ moderate |
| DS-ECO-12::INCOME WEIGHT: the religious houses v1 | c02, c07 | 1/2 | 1/2 | c02: v3; c07: v1 | DECLARED by the first seat (sacredHouse); c07 still prints: the leaf counts a WAYSIDE SHRINE as a temple (factsOf.js :: sacredHouse via institutions.js) — the leaf's owner |
| DS-ECO-1::COMBINATION C4: a low rung on a working approach v1 | c02, c09, c15 | 3/3 | 2/3 | c02: v4; c09: v1; c15: v1 | DECLARED no crisis: under_siege, "earns less than it spends" dropped (v3 too); + 2 siege lines |
| DS-ECO-1::COMBINATION C4: a low rung on a working approach v2 | c04, c06, c07, c17 | 4/4 | 2/4 | c04: v2; c06: v2; c07: v4; c17: v5 | REWORDED ("plenty passes through" with no transit) and DECLARED no crisis: under_siege |
| DS-ECO-1::COMBINATION C4: a low rung on a working approach v3 | c12, c22, c27 | 3/3 | 0/3 | c12: v5; c22: v4; c27: v4 | DECLARED no crisis: under_siege |
| DS-ECO-6::TIER: minor shadow activity (≥3) v0 | c21 | 1/1 | 0/1 | c21: v4 | DECLARED no organised crime (v1, v2 too); + 2 player lines for organised crime |
| DS-ECO-6::TIER: minor shadow activity (≥3) v1 | c30 | 1/1 | 0/1 | c30: v5 | DECLARED no organised crime |
| DS-ECO-6::TIER: minor shadow activity (≥3) v2 | c26 | 1/1 | 0/1 | c26: v4 | DECLARED no organised crime |
| DS-ECO-8::POOR v2 | c04 | 1/1 | 0/1 | c04: v1 | DECLARED food: ≥ secure |
| DS-ECO-9::DEFICIT v1 | c17 | 1/1 | 0/1 | c17: v5 | DECLARED no crisis: under_siege (v2 too); + 2 siege lines |
| DS-ECO-9::DEFICIT v2 | c07 | 1/1 | 0/1 | c07: v5 | DECLARED no crisis: under_siege |
| DS-ECO-9::FOOD SOURCES: one source v1 | c08, c24 | 2/2 | 1/2 | c08: v4; c24: v1 | DECLARED no crisis: famine (v3 too); + 1 famine line. c24 (41% imported): WAITING (import share atom, the first seat's smallMargin row) |
| DS-ECO-9::FOOD SOURCES: several, the largest named v1 | c23, c30 | 2/2 | 1/2 | c23: v—; c30: v1 | DECLARED no crisis: famine (v2, v3 too); + 2 famine lines. c30 (the largest named is a depleted fishery): WAITING (desk fill) |
| DS-ECO-9::IMPORT-DEPENDENT v2 | c22 | 1/1 | 0/1 | c22: v6 | DECLARED no crisis: under_siege (v1, v4 too); + 2 siege lines |
| DS-ECO-9::IMPORT-DEPENDENT v4 | c27 | 1/1 | 0/1 | c27: v6 | DECLARED no crisis: under_siege |
| DS-ECO-9::SECURE v1 | c20, c21, c24, c25 | 4/4 | 4/4 | c20: v1; c21: v1; c24: v1; c25: v1 | WAITING (smallMargin: normalImportPct; the first seat's row) |
| DS-ECO-9::SECURE v3 | c14, c29 | 2/2 | 2/2 | c14: v3; c29: v3 | WAITING (onlyJust: growsMoreThanEats; the first seat's row) |
| DS-GEN-13::COMMERCE: a market, no guild v1 | c12 | 1/1 | 1/1 | c12: v1 | JUDGED TRUE: it states the rule of the stall (no guild's leave), true under siege; the false half of the reviewer's sentence was MARKET-OPEN v4 "where carts always stopped". v4 of this pool ("a stranger can set up ... on the next market day") DECLARED no crisis: under_siege |
| DS-GEN-13::MARKET-OPEN v1 | c30 | 0/1 | 0/1 | c30: v— | DECLARED tier: ≤ town (a market day presumes a periodic market) |
| DS-GEN-17::GREAT HOUSE: monastery v4 | c28, c29 | 2/2 | 2/2 | c28: v4; c29: v4 | REWORDED v1-v4: "the monastery" -> the monks (five to ten great houses in a metropolis) |
| DS-GEN-18::BOUGHT-IN v1 | c02, c15 | 2/2 | 1/2 | c02: v8; c15: v1 | REWORDED: "works {good}" -> cannot produce it, buys it in; no crisis: under_siege |
| DS-GEN-18::BOUGHT-IN v4 | c10, c12, c13, c25 | 4/4 | 3/4 | c10: v4; c12: v8; c13: v4; c25: v4 | REWORDED: "the worked {good}" -> pointed at the carts; no crisis: under_siege |
| DS-GEN-18::BOUGHT-IN v5 | c06, c07, c09 | 3/3 | 0/3 | c06: v9; c07: v7; c09: v9 | DECLARED guild ("workshops"), no crisis: under_siege; + 1 line with no workshop or market, 2 siege lines |
| DS-GEN-18::BOUGHT-IN v6 | c03, c08 | 2/2 | 0/2 | c03: v4; c08: v9 | DECLARED market, no crisis: under_siege, no crisis: famine (v2: market, no crisis: under_siege) |
| DS-GEN-18::STALLED v2 | c11, c14, c16, c18, c20, c21, c23, c24, c28, c30 | 10/10 | 10/10 | c11: v2; c14: v2; c16: v2; c18: v2; c20: v2; c21: v2; c23: v2; c24: v2; c28: v2; c30: v2 | REWORDED: "stands idle" -> short of what it needs from upstream (every chain read is vulnerable, not idle). c11/c14's "Cartographer's guild" for a workshop: WAITING (desk fill). Two house-free lines for the 93 towns where the desk withholds a plural house: WITHDRAWN, parked (the desk pins the silence) |
| DS-POW-5::council v3 | c15 | 1/1 | 1/1 | c15: v3 | WAITING (a rival power: the powers count has no atom; the first seat's powersCount row) |
| DS-POW-6::capture pressure ADVANCING (weak security, poor prosperity) v1 | c03, c08, c13, c17, c18, c27 | 0/6 | 0/6 | c03: v—; c08: v—; c13: v—; c17: v—; c18: v—; c27: v— | REWORDED to the pressure ("would go a long way"): capture is none in 217 of 295 towns; tier: ≥ village (streets) on v1, v2; + 1 line for a hamlet or thorp |
| DS-POW-6::capture pressure ADVANCING (weak security, poor prosperity) v3 | c02, c07, c12 | 0/3 | 0/3 | c02: v—; c07: v—; c12: v— | REWORDED to the pressure (officials paid little and watched less) |
| DS-SUP-2::UPSTREAM WEAK: a chain the town's work draws on is failing v1 | c20 | 1/1 | 1/1 | c20: v1 | REWORDED: the town's own {chain} short of supplies from elsewhere (c20 smelts locally on imported fuel) |
| DS-SUP-2::UPSTREAM WEAK: a chain the town's work draws on is failing v2 | c30 | 1/1 | 1/1 | c30: v2 | REWORDED likewise; c30's shortfall may be internal (hedged "not all its own") |

**By verdict:** DECLARED 36 · REWORDED 22 · WAITING 10 (and partial waits inside 7 cured rows) · JUDGED TRUE 1. **34 of the 69 variants no longer print in any town they printed false in; every other row's line now printing there is a reworded line read true there, or a WAITING row.**

**No case emptied (§4).** For each of the 47 pools of the list, on the 720: towns where the pool speaks to nobody, base -> tip: unchanged in 46; one more (DS-DEF-2 STRONG, a famine town rendered without the name slot) was found and closed by making the famine line slot-free. Cases that a disqualifier thinned to one line got a second line (WALLED-STRAINED, IMPORT-DEPENDENT, food trades failing, walls with NO force under siege).

### Calls taken without the chair (round 1)
1. **A claim no condition can check is reworded out of the line, not left waiting** where the line is otherwise true in its pool (22 rows): the band of a row ("answered it properly"), a monastery counted as one, "its alchemists" for an alchemy tradition, "stands idle" for a vulnerable chain, criminal money "reaching" officials where capture is none (217 of the pool's 295 towns), "few" practitioners, "works {good}" for an imported good. The procedure's "never delete a line true somewhere" holds: each keeps its pool and vantage. All 27 rewordings are on the veto list.
2. **Two STALLED lines withdrawn, parked** (the first seat's DS-CND-1 precedent): `tests/domain/generalStateProseDesk.test.js` › "⛔ {institution} REFUSES A PLURAL HOUSE" pins the pool SILENT where the desk withholds a plural house (93 of the 720: the largest empty case of round 1's pools). The lines, for the veto and the chair's word: `[ledger]` Part of {settlement}'s work is going short: something it needs from upstream is not arriving as it should. · `[street]` Some of the work at {settlement} is held up for want of supplies that should have come down the line by now. RECOMMEND: the pin re-keyed (the silence was honest only while no house-free line existed).
3. **The charter hall's rewording withdrawn**: `tests/domain/defenseStateProseDesk.test.js` › "W2 DEF C9: a fixture is said beside its own group's line" pins `/charter hall/` in the line, and the flag (`priorityHelpers.js :: hasCharterHall`) is set by "adventurers' guild", "multiple adventurers'" and "hireling hall" too. The cure is the desk's: the name through a slot. WAITING.
4. **`imports` not declared on DS-ECO-12 "the land cannot give it"**: the kernel's byte-identity sweep (`tests/domain/stateProseKernel.test.js` › "is BYTE-IDENTICAL to the pre-cure reader") reads every swept pool against `tests/helpers/calmFactsDouble.js`, which answers no `imports`; the two lines were reworded true with or without imports, and two `no imports` lines added. RECOMMEND: the double gains `imports: ['x'], exports: ['x']` (its own rule: "every presence atom holds") — then the lines can declare.
5. **`prosperity` and `church access` refused by the layer walker** in DS-DEF-5 ABSENT and DS-ECO-12 INCOME WEIGHT (layer 2 and 3 at or above the pool's): the first reworded, the second kept (all 74 houseless towns have a neighbour's church).
6. **A combined crisis exclusion is split** (`no crisis: debt` · `no crisis: famine`, not `no crisis: debt, famine`): the presumed-things walker reads the combined literal as an undeclared "famine". The declaration is the same (excludes are a list; a positive disjunction across tags is one list too).
7. **Pins re-keyed by identity with each cause**, as the first seat did (corpus totals, histogram, mean, shift register's five, the two annex anchors by their base text, the trailing-coordinate count, the units compared) and three more: proseWaveGate's WALLED-STRAINED unit count (2 -> 4, "two variants" -> "four"), composeStateProse's DECLARED_APART gains DS-ECO-6 minor (172 cells, `vid 4 / index 1`: the player face now reads organised crime, its two new lines appended after three dm-only lines), and proseComposed A0b: UNDER_CLAIM_OWED 560 -> 639 (the new lines' own per-line debt) and pools carrying a finding 303 -> 304. Over-claims 45 -> 44 (two rewordings first added `{access}`, which the census does not license, and were rewritten without it).
8. **Registers through their doors**: the undeclared-lines register (`RETAKE_DECLARATION_REGISTERS=1`: counts fell), the widened presumed-things register `--shrink` (two rows cured: "its few practitioners", the walls-AND-garrison key), the hand-kept register loses the harbour-mouth row its rewording cured. The prose byte baseline through declared rows.

## Rows WAITING, each with the condition it needs (round 1's ten, beside the first seat's nineteen)
| variant | towns | the condition it needs |
|---|---|---|
| DS-DEF-2 CHAIN: food trades working v2 | c21 | a chain-status atom: the key says working where the food-processing chain is vulnerable (the desk's key, or the chain leaf's atom) |
| DS-DEF-4 structure organized v4 | c26 | a current-tensions atom (crime_wave): "very little street violence" under a crime wave |
| DS-DEF-5 FIXTURE: charter hall v1 | c25, c30 | the desk: the name through a slot (call 3) |
| DS-DEF-9 magicDependency true v3 | c14 | the practitioner atom (the first seat's row) |
| DS-DEF-9 NAMED chain v3 | c15 | the practitioner atom; divine provision is no arcane workshop |
| DS-ECO-10 established v1, v5 | c05, c15 | income concentration: the top source's share (82%, 90%) has no atom |
| DS-ECO-9 SECURE v1, v3 | c20, c21, c24, c25; c14, c29 | smallMargin / onlyJust (the first seat's rows) |
| DS-POW-5 council v3 | c15 | a rival power: the powers count (the first seat's powersCount row) |
| partial, inside cured rows | | DS-DEF-9 NAMED v1 c21 and DS-ECO-9 several v1 c30 ({good} the desk fills with a minor or depleted source); DS-ECO-11 fullyExploited v1 c08 ({institution} "Mill", the first seat's row); DS-ECO-11 partially v4 c27 (the "hard half" done at home); DS-GEN-18 STALLED v2 c11, c14 ("Cartographer's guild" for a workshop); DS-ECO-9 one source v1 c24 (41% imported: the import share); DS-ECO-12 INCOME WEIGHT v1 c07 (the leaf counts a wayside shrine as a temple: `factsOf.js :: sacredHouse` through `institutions.js`'s temple kind) |

## Stage 2 — the first seat's 62 lines, read town by town
Read against one town of each case in the first seat's table, the facts of that town from the census's 720 (born at the base).
- **FALSE, cured (27bc147e0):** DS-GEN-3 Undefended v4 "walls nobody holds are only a fence" printed where a militia stands (10 towns: famine, occupied, siege): `no militia`. DS-GEN-3 military CRITICAL v4 "a stretch that nobody watches": false under siege: `no crisis: under_siege`. DS-ECO-6 significant off-book v4, v5 (duties paid and gathered) printed in 20 villages, hamlets and thorps with no market: `market`; the no-market player face gains v7.
- **Read true and kept:** DS-ECO-6 v6; DS-ECO-8 v4-v6 (not reached); DS-ECO-12 v3-v5 (every houseless town reached has a neighbour's church; the access atom is above the pool's layer); DS-DEF-3 insurgency v4, v5 and political fracture v4, v5; DS-GEN-3 CRITICAL v5, v6 and Undefended v3, v5; DS-GEN-5 v5-v7 and DS-GEN-6 v5-v10 (a river route on a coast where the water leaf says no river: two homes, listed for the leaf's owner, the lines follow the route); the 24 DS-GEN-9 event lines; DS-POW-5 crimeIsGovt v4; DS-POW-6 advisory v3-v5; DS-FTH-4 v3-v5 ×2.

## Stage 3
**Waiting rows, as their conditions arrive:** none arrived (no atom was added to the vocabulary in this lane's window); the first seat's nineteen and round 1's ten stand, each with its condition (tables above and in the first seat's file).
**Cases with no line:** unchanged and ruled: the ten DS-GEN-9 law-5 cases (the code request), DS-CND-1 provenance (the standing ruling), the covert player-only cases (§0e). The one player case new at the tip is DS-POW-6 ADVANCING split by the size gate: covert, dm-only by §0e; the owner's view holds 3 and 2 lines.
**Three for every case, layer 2 first (f84cd4436):** DS-DEF-8's guardless overrides (siege, famine, command split, tribute, security compromised, quarantine, insurgency, beast pressure ×2) and MIGRATION arrivals {guard}; DS-DEF-2 neither walls nor force {threat} ×2, frontier deterrence {threat}, settled-nothing-organized {threat}, plagued perimeter-and-force; DS-DEF-11 UNWALLED-SMALL ×2, UNWALLED-LARGE; DS-DEF-5 garrison PRESENT. Found on the way and cured: DS-DEF-8 INTERNAL PRESSURE (famine) v2 "the people who keep order spend their days at the food stores" printed in guardless towns: + guardPresence.
**What is left of stage 3, for the next seat, in this order:** (1) the round-1 crisis cases a disqualifier thinned to one or two lines (the gap list at the tip: DS-ECO-10 established, DS-DEF-2 STRONG, DS-GEN-18 BOUGHT-IN, DS-DEF-5 walls PRESENT and NO organized force, DS-ECO-1 C4, DS-ECO-8 POOR, DS-ECO-11 fullyExploited: each a siege, famine or no-market case with 1-2 lines; `gaps-tip/gaps.json` re-created by `probes/W2-WRITE/gaps.sh`); (2) the S list (53 cases, 65 lines) and the T list (158, 213) of the first seat's file, re-taken at the tip.

## The veto list
`docs/chair/2026-11-13/W2-WRITE-NEW-LINES-2.md`: 67 new lines (round 1: 46, stage 2: 1, stage 3: 20), 27 rewordings, every declaration moved, by pool.

## Measures (base 31f57e8eb, the first seat's tip, against this seat's tip)
- **The fixture, before and after:** the round-1 table above (30 towns re-born and rendered at both trees). Of the 124 cold corpus lines: 113 printed at the base; 34 of the 69 variants print in none of their false towns now; every other row is a reworded line read true in its town, or a WAITING row with its condition.
- **The gap list, re-taken with the mapping seat's script** (`depth.mjs` + the first seat's case probe, the census's 720, at c16d7292a, before stage 3): cases 597 -> 650 (the new declarations split cases: a case is the values of every fact a pool's lines read), **none for the owner 11 -> 11**, none for a player 24 -> 25 (the one new is DS-POW-6 ADVANCING, covert by §0e, split in two by the size gate; the owner's view holds 3 and 2), under three 221 -> 262 (owner 221 -> 263): the crisis cases a disqualifier thinned (stage 3's first item for the next seat). Every pool of a false variant: towns where it speaks to nobody, base -> tip, unchanged in all 47.
- **The census counter, base against tip** (`census.sh` + `compare.mjs`, at c16d7292a): **every row equal: no count rises, no new row**; GLANCE towns 716 -> 716, median rows per town [7, 7, 6.6] both. (The census's patterns do not count the cold list's mechanisms; the fixture is the measure.)
- **The false variants on the census's 720** (each variant's longest fixed run found in the rendered dossiers; a reworded line counted by its new text): 4,894 town-prints -> 4,357. Not a cure measure (a count falling is not a cure); the read is the table above.
- **The top line's share** (the mapping seat's `top1Actual`, the 720) for every pool this seat touched (58; 47 reached): **none above three draws in four** (highest DS-ECO-6 minor 0.608, from 1.000: its player face had one line; DS-DEF-11 WALLED-STRAINED 0.647 -> 0.605); corpus pools drawn 30 times or more at ≥ 0.75: 5 -> 4.
- **The six golden surfaces:** SURFACES_PENDING
- **Gates at every commit:** check-domain-strict exit 0, typecheck:ratchet exit 0 (each through `scripts/gate-tail.sh`); the push through the lane hook exit 0.
- **The whole suite at the final tip:** SUITE_PENDING
