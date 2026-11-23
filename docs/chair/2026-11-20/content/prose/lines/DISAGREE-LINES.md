# DISAGREE: the lines for the chair (PROSE-6; drafted on line tip 244fa84ef; form as in item (1))
LINES TAKEN by the chair 2026-11-23 00:46 UTC, with its changes applied here: F2 and W2 reworded word for word; F3 gains `stores: < 12`; F4 reads "against hard times".
Marks use the grammar's own atoms: `food` (band, FOOD_BAND_WORDS), `force: paid` (orderForce), `guardPresence`, `stores`, `prosperity`.
No line says "the town". Defence is spelled as the pool spells it.

## FOOD: DS-DEF-2 `CHAIN: food trades failing` (the other cell: DS-ECO-9 [SECURE]; its fact as an atom here is `food: ≥ secure`)
POOL LINE (v4, flat, gains `food: ≤ pressured`): `[unfolding · no crisis: under_siege · stores: < 12]` {settlement}'s food trades are failing, and what they fail to put by is food the town would miss if it were cut off.
POOL LINE (v1, flat, gains `food: ≤ pressured`): `[ledger · no crisis: under_siege · stores: < 12]` {settlement}'s food trades are failing, so less food is being put by than should be; ...
POOL LINE (v3, flat, gains `food: ≤ pressured`): `[street · no crisis: under_siege · stores: < 12]` The food trades at {settlement} are struggling to keep up, ...
POOL LINE (v2, unchanged: it already says both truths): `[ledger · no crisis: under_siege · stores: ≥ 12]` {settlement}'s food trades are failing, though its stores would still carry it if it were cut off.
NEW F1 `[ledger · no crisis: under_siege · food: ≥ secure · stores: < 12]` {settlement} eats well enough today, but its food trades are failing, and less is being put by than it would need if it were cut off.
NEW F2 `[street · no crisis: under_siege · food: ≥ secure · stores: < 12]` There is food enough on the tables at {settlement}, though its food trades are failing and its stores are thinner for it.
NEW F3 `[unfolding · no crisis: under_siege · food: ≥ secure · stores: < 12]` {settlement}'s tables are full for now, but its food trades are failing, and what they fail to put by would be missed only if it were cut off.
NEW F4 `[visitor · no crisis: under_siege · food: ≥ secure]` The tables at {settlement} are full, but the trades that put food by against hard times are failing.
NEEDS: F1-F4 `food: ≥ secure` (the rung DS-ECO-9 prints); F1-F3 `stores: < 12` (as v1, v3, v4). The siege variants v5, v6 are left as they are (DS-ECO-9 SECURE is rarely printed under a siege: the census arm says so, or names it).

## WAGES: DS-DEF-2 `Economic Survival: WEAK` (the other cell: DS-GEN-17 [GARRISONED] v2, "pays wages"; its fact as an atom here is `force: paid`)
POOL LINE (v2, flat, gains `no force: paid`): `[street · guardPresence · prosperity: ≤ comfortable]` The people who would have to hold {settlement} through something know there is no money to pay them for it.
POOL LINE (v1, flat, gains `no force: paid`): `[ledger · guardPresence · prosperity: ≤ comfortable]` {settlement} is always short of money for its defence: no money is laid by to pay for a long one, and whoever is called to make one knows it.
NEW W1 `[ledger · guardPresence · force: paid · prosperity: ≤ comfortable]` {settlement} pays its guards as the seasons come, but nothing is laid by to pay them through a long defence.
NEW W2 `[street · guardPresence · force: paid · prosperity: ≤ comfortable]` Those who guard {settlement} are paid from season to season, and they know nothing is laid by to go on paying them through a long defence.
NEW W3 `[threshold · guardPresence · force: paid · prosperity: ≤ comfortable]` {settlement} can pay its guards from one season to the next and not much longer: a long defence would find the money gone.
NEEDS: W1-W3 `guardPresence`, `force: paid` (a garrison, a paid watch or a hired company: `orderForce.js :: orderForceOf`), `prosperity: ≤ comfortable` (as v1, v2). They say "paid", never "paid in full": the guard's pay may be short (`guardPay.js :: guardPayOf`), and no atom reads it.

## THE FAULT OF FACTS, CURED IN ITS OWN ROW: DS-GEN-17 `GARRISONED` v2
POOL LINE (gains `force: paid`): `[ledger · walls · no crisis: occupied]` {settlement} pays wages for its defense as well as keeping its walls, and the money is found every season.
WHY: its key holds on a roster whose only watch is the village's unpaid rota (`guardPay.js :: watchIsUnpaidRota`), where nobody is paid. With `force: paid` it is never drawn there, and so never beside a flat WEAK v1, v2. NAMED, NOT CURED: "the money is found every season" where the guard's pay reads 'short' (no atom).

## WHAT THE TOOTH READS (item 3), one registered row a pair
| pair | flat side A | flat side B |
|---|---|---|
| FOOD | DS-DEF-2 `CHAIN: food trades failing` v1, v3, v4 | DS-ECO-9 `SECURE` (any variant) |
| WAGES | DS-DEF-2 `Economic Survival: WEAK` v1, v2 | DS-GEN-17 `GARRISONED` v2 |

## THE CHAIR'S CONDITIONS, ANSWERED (00:40 and 00:46 UTC)
(a) `force: paid` reads `orderForce.js :: orderForceOf(record).paid`: a garrison, a hired company, or a watch that is not the unpaid rota alone. It is FALSE under the unpaid rota (`watchIsUnpaidRota`). IT CANNOT TELL 'short' FROM 'full' (`guardPayOf`: the record's `pay` field is beside it, not in the atom). So GEN-17 v2 is measured first, as ruled. W1-W3 say "paid", never "in full". W2's "from season to season" is the same question, so the builder counts W-branch pages where pay reads 'short', by size; if any, W2 comes back to the chair.
(b) Reach by size and each new line's share: owed in the build. FOOD has four lines (F4 is its only line where stores ≥ 12, beside v2); WAGES has three.
(c) ECO-9 SECURE v1-v10 and GEN-17 GARRISONED v1 are read against F1-F4 and W1-W3 by the builder; I read its list. The tooth's table holds both pairs; on 900 births its count is 0.
(c2) No cell left empty, on 900 births: owed; 0, or STOP.
(d) FOR THE VEIL'S READER. `food` reads the food rung (`famine.js :: famineOf`); `stores` the stored months; `prosperity` the prosperity rung; `guardPresence` a watch, garrison, militia or hired company; `force: paid` as in (a). None reads a fact about crime. `guardPresence` and `force: paid` read defence houses: garrison, watch, militia, mercenary. They are NOT a hideable kind by the catalogue; the builder proves it with `cardVeil.js :: isHideableHouse` = false on every such row of the 900 births. Every new line reads only facts every shared read serves (COMMON-RULES 14 (e)).
(e) No new line says "the town"; no season, climate or age ("from season to season" is pay's rhythm, and "hard times" replaced "a hard season").
(g) A walker that reds a new line brings the line back to the chair, never banked around.
