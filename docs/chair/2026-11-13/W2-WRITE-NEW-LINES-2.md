# W2-WRITE — the second seat's lines for the owner's veto

Base: the first seat's tip 31f57e8eb. Tip: the lane. NEW = a line written by this seat; CHANGED = a line whose declaration or text moved (text shown old -> new). Round 1 (the cold list) and stage 2 (the first seat's lines read town by town); the case each new line is for is its own marks (a siege line carries crisis: under_siege, and so on).

**DS-ECO-1::COMBINATION C4: a low rung on a working approach**
- CHANGED v1 `[colour]` -> `[no crisis: under_siege]` · text: "Traffic moves along {settlement}'s {access} every day, and little of its money stays. The place earns less than it spends." -> "Traffic moves along {settlement}'s {access} every day, and little of its money stays behind."
- CHANGED v2 `[]` -> `[no crisis: under_siege]` · text: "Plenty passes through {settlement}, and little of it stops. The town is poor, and its people say so to anyone who asks." -> "{settlement} is poor though the trade routes serve it well, and its people say so to anyone who asks."
- CHANGED v3 `[market]` -> `[market · no crisis: under_siege]`
- NEW v4 `[crisis: under_siege]` With the siege closing every way in, {settlement} has lost even the little that passing trade used to leave behind.
- NEW v5 `[crisis: under_siege]` {settlement} was poor even while its trade moved freely, and the siege has stopped it moving at all.

**DS-ECO-6::TIER: significant off-book activity (≥15)**
- CHANGED v4 `[colour]` -> `[market]`
- CHANGED v5 `[colour]` -> `[market]`
- NEW v7 `[no market]` Much of what changes hands at {settlement} changes hands quietly, between people who would rather nobody counted it.

**DS-ECO-6::TIER: minor shadow activity (≥3)**
- CHANGED v0 `[colour]` -> `[no organised crime]`
- CHANGED v1 `[dm-only · colour]` -> `[dm-only · no organised crime]`
- CHANGED v2 `[dm-only · colour]` -> `[dm-only · no organised crime]`
- NEW v4 `[organised crime]` Little of {settlement}'s trade goes unrecorded, but what does goes through the same organised hands each time.
- NEW v5 `[organised crime]` The shadow trade at {settlement} is small, but it is not casual: somebody organises it.

**DS-ECO-8::POOR**
- CHANGED v2 `[no hunger]` -> `[no hunger · food: ≥ secure]`

**DS-ECO-9::IMPORT-DEPENDENT**
- CHANGED v1 `[crisis: any]` -> `[crisis: any · no crisis: under_siege]`
- CHANGED v2 `[grain · crisis: any]` -> `[grain · crisis: any · no crisis: under_siege]`
- CHANGED v4 `[hunger]` -> `[hunger · no crisis: under_siege]`
- NEW v5 `[crisis: under_siege]` Whatever {settlement} used to buy for its table, none of it has come since the siege closed the roads.
- NEW v6 `[crisis: under_siege]` The trade that fed {settlement} is shut out by the siege, and the town is finding out what it can live without.

**DS-ECO-9::DEFICIT**
- CHANGED v1 `[]` -> `[no crisis: under_siege]`
- CHANGED v2 `[]` -> `[no crisis: under_siege]`
- NEW v4 `[crisis: under_siege]` {settlement} grows far less food than it needs, and with the roads cut by the siege nothing comes in to make up the difference.
- NEW v5 `[crisis: under_siege]` Nothing has come into {settlement} since the siege closed the roads, and what the town can still grow is not near enough.

**DS-ECO-9::FOOD SOURCES: one source**
- CHANGED v1 `[colour]` -> `[no crisis: famine]`
- CHANGED v3 `[colour]` -> `[no crisis: famine]`
- NEW v4 `[crisis: famine]` {settlement} lived off its {good} and little else, and the {good} has failed; there is nothing else to turn to.

**DS-ECO-9::FOOD SOURCES: several, the largest named**
- CHANGED v1 `[colour]` -> `[no crisis: famine]`
- CHANGED v2 `[colour]` -> `[no crisis: famine]`
- CHANGED v3 `[colour]` -> `[no crisis: famine]`
- NEW v4 `[crisis: famine]` {settlement}'s food comes from more than one source, and this year that has not been enough: the town is hungry all the same.
- NEW v5 `[crisis: famine]` Having more than its {good} to rely on has not kept the famine out of {settlement}.

**DS-SUP-2::UPSTREAM WEAK: a chain the town's work draws on is failing**
- CHANGED v1 `[colour]` -> `[colour]` · text: "Some of {settlement}'s work depends on {chain} done elsewhere, and that supply is failing: what should come down the line arrives short." -> "Some of {settlement}'s {chain} depends on supplies from elsewhere, and those supplies are failing: what should come down the line arrives short."
- CHANGED v2 `[colour]` -> `[colour]` · text: "Work is slowing at {settlement} for a fault that is not the town's own: the {chain} it relies on upstream has gone short." -> "Work is slowing at {settlement} for a fault that is not all its own: its {chain} is short of what it needs from upstream."

**DS-ECO-10::POSTURE: entrepot**
- CHANGED v1 `[]` -> `[no crisis: under_siege]` · text: "{settlement} sells on what it never made. The export column is full of goods that entered the town as imports the same season." -> "{settlement} sells on goods it never made: some of what leaves the town entered it as imports the same season."
- CHANGED v2 `[]` -> `[no crisis: under_siege]`
- CHANGED v3 `[]` -> `[no crisis: under_siege]`
- NEW v4 `[crisis: under_siege]` {settlement} lived by moving other people's goods, and the siege has stopped the moving.
- NEW v5 `[crisis: under_siege]` Goods that were only passing through {settlement} are stuck there now, with the roads closed and nowhere for them to go.

**DS-ECO-10::POSTURE: established**
- CHANGED v2 `[colour]` -> `[tier: ≥ village · no crisis: under_siege · no crisis: famine]`
- CHANGED v3 `[colour]` -> `[no crisis: under_siege · no crisis: famine]`
- CHANGED v4 `[colour]` -> `[no crisis: under_siege · no crisis: famine]`
- CHANGED v6 `[colour]` -> `[no crisis: under_siege · no crisis: famine]`
- NEW v7 `[crisis: under_siege]` {settlement} had several trades sending goods out before the siege, and none of them can send anything now.
- NEW v8 `[crisis: famine]` {settlement} has more than one trade sending goods out, and the famine has made every one of them harder to keep going.

**DS-ECO-11::EXPLOITATION: partiallyExploited**
- CHANGED v1 `[]` -> `[no crisis: under_siege]`
- CHANGED v2 `[]` -> `[no crisis: under_siege]`
- CHANGED v4 `[]` -> `[no crisis: under_siege]`
- NEW v5 `[crisis: under_siege]` {settlement} used to send its {resource} out half-worked; with the roads cut by the siege it piles up instead, and nobody here can finish it.
- NEW v6 `[crisis: under_siege]` Half of this trade was always done elsewhere, and with the siege closing the roads, the half the town does has nowhere to go.

**DS-ECO-11::EXPLOITATION: fullyExploited**
- CHANGED v1 `[]` -> `[no crisis: under_siege]`
- CHANGED v3 `[colour]` -> `[colour]` · text: "This is the trade the town is actually built on, and the town has taken it as far as it goes." -> "The town has taken this trade as far as it goes, from the ground to the finished thing."

**DS-ECO-12::INCOME MIX: one source carries the town**
- CHANGED v3 `[no hunger]` -> `[no hunger · prosperity: ≥ moderate]`

**DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks**
- CHANGED v2 `[colour]` -> `[no crisis: under_siege]`
- NEW v3 `[crisis: under_siege]` {settlement}'s {institution} has had no {good} since the siege closed the roads, and its work has stopped or soon will.

**DS-ECO-12::CRITICAL IMPORT: the land cannot give it**
- CHANGED v1 `[colour]` -> `[colour]` · text: "{settlement} has to buy its {good} from outside: the country around the town produces none." -> "The country around {settlement} produces no {good}: whatever the town has of it comes from outside."
- CHANGED v2 `[colour]` -> `[colour]` · text: "Every load of {good} used at {settlement} comes from elsewhere, because the country here produces none." -> "None of the {good} used at {settlement} comes from the country here; it is brought in or done without."
- NEW v3 `[no imports]` The country around {settlement} produces no {good}, and nothing comes in from outside to make up for it, so the town does without.
- NEW v4 `[no imports]` {settlement} neither grows nor buys any {good}; people there do without.

**DS-DEF-1::readiness WEAK**
- CHANGED v3 `[crisis: any · no crisis: threat, unrest]` -> `[crisis: any · no crisis: threat, unrest]` · text: "{settlement} has not been attacked lately, and if it were, it would struggle to hold." -> "{settlement} would struggle to hold against anything more than a handful of raiders, and the people who live there know it."

**DS-DEF-1::readiness CRITICAL**
- CHANGED v1 `[crisis: any]` -> `[crisis: any · no guardPresence]`
- NEW v4 `[crisis: any · guardPresence]` {settlement} has people under arms, but too few and too badly placed to hold off a serious attack for long.

**DS-DEF-2::Beasts & Monsters: plagued, perimeter AND organized force**
- CHANGED v1 `[colour]` -> `[colour]` · text: "The country around {settlement} is thick with creatures and the town has answered it properly: there is a wall to hold and there are people to hold it, and both are in use constantly." -> "The country around {settlement} is thick with creatures, and the town keeps both a wall and people to hold it, and both are in use constantly."

**DS-DEF-2::Invasion & War: walls AND professional garrison**
- CHANGED v1 `[]` -> `[no crisis: under_siege]`
- CHANGED v2 `[]` -> `[no crisis: under_siege]`
- NEW v4 `[walls · garrison · crisis: under_siege]` The siege at {settlement} is being met on the walls by paid soldiers, and the walls are holding.

**DS-DEF-2::Invasion & War: walls with NO force**
- CHANGED v1 `[]` -> `[no watch · no crisis: under_siege]`
- CHANGED v2 `[]` -> `[no watch · no crisis: under_siege]`
- CHANGED v3 `[]` -> `[no watch · no crisis: under_siege]`
- NEW v4 `[watch · no crisis: under_siege]` {settlement}'s walls are kept by its watch and nobody else, which is enough to see who comes and goes and nothing like enough to hold them.
- NEW v5 `[watch · no crisis: under_siege]` The only people on {settlement}'s walls are the watch on their rounds, and everyone knows that would not stop an army.
- NEW v6 `[crisis: under_siege]` {settlement} had nobody to put on its walls until the siege came; the people on them now are townsfolk who have never held a wall before.
- NEW v7 `[crisis: under_siege]` Since the siege began, {settlement}'s walls are manned by whoever can be spared from everything else.

**DS-DEF-2::Invasion & War: neither walls nor force**
- CHANGED v2 `[no threat · crisis: any]` -> `[no threat · crisis: any]` · text: "Nothing has come for {settlement} and nothing about the town would stop it. The safety here is entirely a matter of nobody having wanted to." -> "Nothing threatens {settlement} now, and nothing about the town would stop it if something did. Its safety rests on nobody wanting it."

**DS-DEF-2::Economic Survival: STRONG**
- CHANGED v1 `[no crisis: debt]` -> `[no crisis: debt · no crisis: famine · prosperity: ≥ moderate]`
- CHANGED v2 `[no crisis: debt]` -> `[no crisis: debt · no crisis: famine]`
- NEW v4 `[crisis: famine]` The famine is costing the town dearly, and the town is paying: its money is going on food, and so far there is money enough.

**DS-DEF-2::Economic Survival: WEAK**
- CHANGED v1 `[]` -> `[guardPresence]`
- CHANGED v2 `[]` -> `[guardPresence]`
- NEW v4 `[no guardPresence]` {settlement} pays nobody to defend it, and could not find the wages if it had to hire someone in a hurry.
- NEW v5 `[no guardPresence]` If {settlement} ever had to hire people to defend it, it would have to borrow the money first.

**DS-DEF-2::CHAIN: defence supplied**
- CHANGED v1 `[]` -> `[no crisis: hunger]`
- CHANGED v2 `[]` -> `[no crisis: hunger]`
- CHANGED v3 `[]` -> `[no crisis: hunger]`
- CHANGED v4 `[]` -> `[no crisis: hunger]`
- NEW v5 `[crisis: hunger]` Food is short at {settlement}, but the trades that arm its defenders are still working, so the defence is not short of gear.
- NEW v6 `[crisis: hunger]` You can see that {settlement}'s defenders are armed and equipped from the town's own trades; you can also see that they eat no better than anyone else.

**DS-DEF-2::CHAIN: food trades working**
- CHANGED v1 `[]` -> `[no crisis: under_siege]`
- CHANGED v2 `[]` -> `[no crisis: under_siege]`
- CHANGED v3 `[]` -> `[no crisis: under_siege]`
- NEW v4 `[crisis: under_siege]` {settlement} is cut off now, and what its food trades salted and dried before the siege is what stands between the town and hunger.

**DS-DEF-2::CHAIN: food trades failing**
- CHANGED v1 `[]` -> `[no crisis: under_siege]`
- CHANGED v2 `[]` -> `[no crisis: under_siege]`
- CHANGED v3 `[]` -> `[no crisis: under_siege]` · text: "{settlement}'s food trades are failing, and each season they fail the town has less to fall back on if it is cut off." -> "{settlement}'s salting and drying trades are failing, and each season they fail the town has less preserved food to fall back on if it is cut off."
- NEW v4 `[crisis: under_siege]` {settlement} is cut off now, and the trades that salt and dry its food were failing before the siege began, so there is less put by than the town will need.
- NEW v5 `[crisis: under_siege]` With {settlement} cut off, people count the salted and dried stores every week, and they were thin before the siege began.

**DS-DEF-5::walls PRESENT**
- CHANGED v2 `[colour]` -> `[gate · guardPresence · no crisis: under_siege]`
- NEW v4 `[no gate · no crisis: under_siege]` {settlement} has a wall but no proper gate in it: people come and go by gaps everyone knows, and the wall slows trouble more than it stops it.
- NEW v5 `[no gate · no crisis: under_siege]` The wall around {settlement} turns back a wandering beast and slows a raid; nobody counts who comes in, because there is no gate to count them at.
- NEW v6 `[crisis: under_siege]` {settlement}'s wall is all that stands between the town and the siege, and every stretch of it is watched now.

**DS-DEF-5::NO organized force at all**
- CHANGED v1 `[]` -> `[no crisis: under_siege · no crisis: wartime]`
- CHANGED v2 `[]` -> `[no crisis: under_siege · no crisis: wartime]`
- CHANGED v3 `[]` -> `[no crisis: under_siege · no crisis: wartime]`
- NEW v4 `[crisis: under_siege · crisis: wartime]` {settlement} kept no defenders of its own, and the people defending it now are neighbours who stepped forward when the trouble came.
- NEW v5 `[crisis: under_siege · crisis: wartime]` There was never a force at {settlement}; whoever leads the defence now is learning the work as the trouble goes on.

**DS-DEF-5::charter hall ABSENT where the country warrants one**
- CHANGED v2 `[]` -> `[]` · text: "{settlement} knows it needs specialists against the creatures and cannot afford to keep them." -> "{settlement} knows it needs specialists against the creatures, and has none of its own to send."

**DS-DEF-5::FIXTURE: gates**
- CHANGED v1 `[]` -> `[no crisis: under_siege]`
- CHANGED v2 `[]` -> `[no crisis: under_siege]`
- CHANGED v3 `[]` -> `[no crisis: under_siege]`
- NEW v5 `[crisis: under_siege]` {settlement}'s gates are shut and barred, and nothing has come through them since the siege began.

**DS-DEF-5::ARCANE: alchemists**
- CHANGED v1 `[]` -> `[]` · text: "The magical help at {settlement} comes from its alchemists, who brew for the defenders." -> "Part of the magical help at {settlement} is brewed: alchemy is practised here, and some of what it makes goes to the defenders."
- CHANGED v2 `[]` -> `[]` · text: "{settlement} buys its magical support from its alchemists by the batch, and the town's accounts carry it as a purchase, not a defence." -> "{settlement} buys alchemical preparations for its defence by the batch, and the town's accounts carry them as a purchase, not a defence."

**DS-DEF-6::Naval Defense: Port only**
- CHANGED v3 `[crisis: any · no crisis: threat, unrest]` -> `[crisis: any · no crisis: threat, unrest]` · text: "You can sail into {settlement} unchallenged; nobody watches the harbour mouth." -> "Nothing armed meets a ship coming into {settlement}; the waterfront is kept for trade, not for defence."

**DS-DEF-9::magicDependency true**
- CHANGED v4 `[]` -> `[]` · text: "{settlement} does better than its ground and roads would explain, and the reason is its few practitioners." -> "{settlement} does better than its ground and roads would explain, and the reason is the arcane work done here."

**DS-DEF-9::magicDependency true, with a NAMED dependent chain**
- CHANGED v1 `[]` -> `[]` · text: "The {good} that {settlement} lives on cannot be made here without arcane work, which puts the whole line behind a very small number of people." -> "The {good} made at {settlement} cannot be made without arcane work, which puts the whole line behind a very small number of people."

**DS-DEF-11::WALLED-STRAINED**
- CHANGED v1 `[watch]` -> `[watch · no crisis: under_siege]`
- CHANGED v2 `[colour]` -> `[no crisis: under_siege]`
- NEW v3 `[crisis: under_siege]` {settlement}'s {defwork} was short of hands before the siege; now everyone who can hold a weapon has a place on it, and most of them are learning as they go.
- NEW v4 `[crisis: under_siege]` The siege has put more people on {settlement}'s {defwork} than the town could ever find for it in quieter seasons.

**DS-GEN-3::scores.military: CRITICAL**
- CHANGED v4 `[walls · crisis: any]` -> `[walls · crisis: any · no crisis: under_siege]`

**DS-GEN-3::defenseProfile.readiness.label: Undefended**
- CHANGED v4 `[walls · no garrison]` -> `[walls · no garrison · no militia]`

**DS-GEN-13::MARKET-OPEN**
- CHANGED v1 `[no crisis: under_siege · crisis: any]` -> `[no crisis: under_siege · crisis: any · tier: ≤ town]`

**DS-GEN-13::COMMERCE: a market, no guild**
- CHANGED v4 `[colour]` -> `[no crisis: under_siege]`

**DS-GEN-17::GREAT HOUSE: monastery**
- CHANGED v1 `[institution: monastery]` -> `[institution: monastery]` · text: "Robed men and women from the monastery are a common sight on the way into {settlement}." -> "Robed monks and nuns are a common sight on the way into {settlement}."
- CHANGED v2 `[institution: monastery]` -> `[institution: monastery]` · text: "The monastery keeps its own hours, and the rest of {settlement} leaves it to them." -> "The monks keep their own hours, and the rest of {settlement} leaves them to it."
- CHANGED v3 `[institution: monastery]` -> `[institution: monastery]` · text: "Anyone new to {settlement} who needs a meal or a bed is sent to the monastery door." -> "Anyone new to {settlement} who needs a meal or a bed is sent to the monks."
- CHANGED v4 `[institution: monastery]` -> `[institution: monastery]` · text: "The monastery answers to its own order before it answers to whoever governs {settlement}." -> "The monks answer to their own order before they answer to whoever governs {settlement}."

**DS-GEN-18::STALLED**
- CHANGED v2 `[]` -> `[]` · text: "{settlement}'s {institution} stands idle: its supply has failed upstream, though the building and the skilled hands are still there." -> "{settlement}'s {institution} is short of what it needs from upstream, though the building and the skilled hands are all still there."

**DS-GEN-18::BOUGHT-IN**
- CHANGED v1 `[]` -> `[no crisis: under_siege]` · text: "{settlement} works {good} it cannot produce; it buys the raw stuff in, and always has." -> "{settlement} cannot produce its own {good}, so it buys it in."
- CHANGED v2 `[]` -> `[market · no crisis: under_siege]`
- CHANGED v4 `[]` -> `[no crisis: under_siege]` · text: "Carts bring {settlement} what its workshops need, and carry the worked {good} away again." -> "Ask where {settlement}'s {good} comes from and you are pointed at the carts, not at anyone in the town."
- CHANGED v5 `[]` -> `[guild · no crisis: under_siege]`
- CHANGED v6 `[]` -> `[market · no crisis: under_siege · no crisis: famine]`
- NEW v7 `[crisis: under_siege]` {settlement} bought its {good} from outside, and since the siege nothing has come in; what is left is being made to last.
- NEW v8 `[crisis: under_siege]` The carts that kept {settlement}'s trades supplied have not come since the siege began.
- NEW v9 `[no crisis: under_siege]` What {settlement}'s trades use comes in from elsewhere more often than from its own ground.

**DS-POW-6::capture pressure ADVANCING (weak security, poor prosperity)**
- CHANGED v1 `[dm-only]` -> `[dm-only · tier: ≥ village]` · text: "Criminal money is reaching the officials of {settlement} one at a time, because the town is poor and its streets are badly watched, and a bribe goes a long way here." -> "Criminal money would go a long way with the officials of {settlement}: the town is poor, its streets are badly watched, and nobody has shut the door."
- CHANGED v2 `[dm-only]` -> `[dm-only · tier: ≥ village]`
- CHANGED v3 `[dm-only]` -> `[dm-only]` · text: "Officials at {settlement} are spending money their posts never paid them, and nobody in the town asks where it came from." -> "Officials at {settlement} are paid little and watched less, and a purse offered in the right doorway would not be turned away."
- NEW v4 `[dm-only · tier: ≤ hamlet]` {settlement} is too poor to pay the few people who hold office here, and anyone with money to spare could buy their goodwill cheaply.

**DS-CND-1::DIRECTION: worsening · CRISIS: famine**
- CHANGED v1 `[]` -> `[tier: ≥ village]`
