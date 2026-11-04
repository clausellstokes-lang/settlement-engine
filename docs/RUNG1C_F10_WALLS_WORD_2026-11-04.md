# F10 WALLS-WORD: the walls named in places that have none (rung 1C, 2026-11-04)

> A dated lane record. Branch `lane/rung1c-f10-walls-word-2026-11-04`, cut from `lane/window-rung1-2026-11-04` at `64aeda874`. It answers `docs/SOAK_1000_RUNG1C_2026-11-04.md` §5 (the stop on `coh:defense-words`, kind 4, 57 of 1,000). Counts are settlements on the rung corpus.

## 1. Measure first: the brief's premise does not hold

- **60 at the base** (`node scripts/audit/soak-review.mjs --count 60 --workers 4 --out artifacts/f10-base`, 40 s, 0 errors): `coh:defense-words` **4 of 60** (thorp 1, town 3), the chair's figure. But only one of the four is the siege family (`soak1k-24`, Power). The others are `soak1k-21` "The halls, the walls and the roads are all better than a town this size strictly requires." (DS-ECO-8, Daily life), `soak1k-45` "its people stand on the walls." (`crisisCast.js`), `soak1k-15` "Walls, wells, roads, and the watch" (`institutionServices.js`).
- **1,000 at the base** (`--out artifacts/f10-base1k`, 123 s, 0 errors): **57**, as 1C recorded. **The 57 are not one sentence family.** By settlement, 22 carry only dossier-pool wall lines, 1 carries a pool line and another writer's, and **34 carry no pool line at all**. Their writers are F1's residue (`docs/F1_DEFENCE_WORDS_2026-11-04.md` §3), unchanged:

| settlements | writer | sentence |
|---|---|---|
| 11 | `npcData.js` plot hook | "Someone is paying their soldiers more than their salary. The soldiers aren't saying who." |
| 10 | DS-POW-2 `siege matched` v1 (pool) | "…the walls have settled the argument." |
| 8 | DS-POW-2 `siege matched` v4 (pool) | "…being decided outside the walls rather than inside them…" |
| 6 | `institutionServices.js` civic office | "Walls, wells, roads, and the watch" |
| 5 | DS-ECO-8 `PROSPEROUS` v2 (pool) | "The halls, the walls and the roads are all better than a town this size strictly requires." |
| 3 | `crisisCast.js :: CAST_REASONS` | "holds the garrison's office." |
| 3 | `crisisCast.js :: CAST_REASONS` | "its people stand on the walls." |
| 3 | institution service (smugglers) | "Move people beneath the walls unseen." |
| 3 | siege hook | "Identify the person inside the walls who is communicating with the besiegers…" |
| 5 | `npcGenerator.js` wartime goal | "…conscription pulls away experienced soldiers…" |
| 1 each | waystation desc "behind walls"; "garrison-backed"; "A guild's private soldiers arrested a rival's factor." | |

So a cure through the dossier pools can reach **at most 23 of the 57** (the 22, and the pool half of the mixed one). The other 34 are generation-time writers in other files (they move generated towns, so goldens), outside this lane's render-time brief; they are listed in §5 as intake.

- **The red, on the three births** (`corpus.mjs :: birth(i)`, i = 24, 92, 336, normalized, read through `powerStateProse`): all three have `defenseFactsOf(s).hasWalls === false` and `defenceNames: []`, stability `Critical (active siege — survival priority)`, and print the stability header quoted in 1C §2.

## 2. The audit: every state-prose variant that names walls, wall, gates or ramparts

Generated from the six state leaves at the cure (`src/data/dossierStateProse/*.generated.js`; the base leaves list the same variants without the marks). "Reachable without walls" is read from the selection code: the block's mount (`dossierMounts.js :: DOSSIER_MOUNTS`, or `UNMOUNTED_BLOCKS`), and for DS-DEF the desk's key functions (`defenseStateProse.js :: beastsRowPoolKey`, `invasionRowPoolKey`, the walls bucket of DS-DEF-5 and DS-DEF-11). Pool-level reachability inside a mounted block is PLAUSIBLE: no key function in those blocks reads the enclosure, so nothing confines a pool to walled places.

**Summary.** 103 variants name walls, a wall or gates. **40 are reachable without walls and print the place’s walls: each now carries the `walls` mark and has a wall-free twin (40 twins).** 13 are already gated by their DS-DEF pool key. 29 sit in unmounted blocks (DS-DEF-7, DS-DEF-10, DS-SUP-1, DS-POP-1, DS-GEN-1, DS-GEN-10, DS-WAR-5) and cannot render. 3 name a building’s wall or a simile. 18 name only a gate: reachable, but "gate" is not the check’s term and `hasGate` is a separate fact, so they are left and raised (§6).

| variant | block | state (pool) | reachable without walls | cure |
|---|---|---|---|---|
| v1 "The gate returns are thin in both columns. What arrives is short of what the town has c…" | DS-ECO-3 | `SHORTAGE × trade-dependent` | yes | open: a gate, not the check's term (`hasGate`) |
| v1 "Little moves on {settlement}'s roads and the books barely register it. The town buys an…" | DS-ECO-3 | `SHORTAGE × not trade-dependent` | yes | marked `walls`; twin v4 (`no walls`) |
| v2 "Follow {resource} through {settlement} and it does not stop anywhere. It goes into {ins…" | DS-SUP-1 | `COMPLETE LINE, output exported` | no: block unmounted | none now; owed when the block is lit |
| v2 "{settlement} is visibly well off. The halls, the walls and the roads are all better tha…" | DS-ECO-8 | `PROSPEROUS` | yes | marked `walls`; twin v4 (`no walls`) |
| v2 "The wealth here is not the kind a stranger has to look for. It is in the scale of every…" | DS-ECO-8 | `WEALTHY` | yes | open: a gate, not the check's term (`hasGate`) |
| v1 "The stores are sealed off from the road. What is inside the walls is what the town has,…" | DS-ECO-9 | `BLOCKADED` | yes | marked `walls`; twin v4 (`no walls`) |
| v2 "{settlement} is built against the cold rather than against anybody, and the building sh…" | DS-ECO-11 | `TERRAIN: Tundra` | n/a: not the place's defences | none (a building, a simile) |
| v2 "Nothing about this line is left on the table at {settlement}. A stranger following it f…" | DS-ECO-11 | `EXPLOITATION: fullyExploited` | yes | open: a gate, not the check's term (`hasGate`) |
| v1 "A good portion of what {settlement} consumes is made inside its own walls, and never ap…" | DS-ECO-12 | `TRADE PROFILE: local production listed` | yes | marked `walls`; twin v4 (`no walls`) |
| v2 "The loss runs into thousands. The town retains its walls, its plan and its name, and ve…" | DS-POP-1 | `QUANTITY: thousands` | no: block unmounted | none now; owed when the block is lit |
| v1 "Two towns share {settlement}'s walls (one counts its year in surplus and the other in w…" | DS-GEN-1 | `economic_disparity` | no: block unmounted | none now; owed when the block is lit |
| v5 "{settlement} watches its strangers and lets them stay. The suspicion is a habit of the …" | DS-GEN-1 | `infiltration_fear` | no: block unmounted | none now; owed when the block is lit |
| v1 "{settlement} owes outside its walls, and the owing is written into the shape of the yea…" | DS-GEN-1 | `outside_debt` | no: block unmounted | none now; owed when the block is lit |
| v3 "{settlement} looks poorer than its trade suggests, and the reason is not in the town: t…" | DS-GEN-1 | `outside_debt` | no: block unmounted | none now; owed when the block is lit |
| v1 "{settlement} can put a real body of armed men on its walls, and the men look like they …" | DS-GEN-3 | `scores.military: STRONG` | yes | marked `walls`; twin v4 (`no walls`) |
| v2 "The muster at {settlement} covers the gates and the walls and does not stretch past them." | DS-GEN-3 | `scores.military: ADEQUATE` | yes | marked `walls`; twin v4 (`no walls`) |
| v1 "The watch at {settlement} is a watch and not a garrison, and the difference is visible …" | DS-GEN-3 | `scores.military: WEAK` | yes | open: a gate, not the check's term (`hasGate`) |
| v2 "{settlement} keeps no muster worth the name; the gate is shut at night by whoever is ne…" | DS-GEN-3 | `scores.military: CRITICAL` | yes | open: a gate, not the check's term (`hasGate`) |
| v2 "Walls, garrison and stores at {settlement} are all of a piece, which is rarer than any …" | DS-GEN-3 | `defenseProfile.readiness.label: Fortress` | yes | marked `walls`; twin v3 (`no walls`) |
| v1 "{settlement} has walls in the sense that there is a line where the town stops." | DS-GEN-3 | `defenseProfile.readiness.label: Lightly Defended` | yes | marked `walls`; twin v3 (`no walls`) |
| v3 "{settlement}'s market is well supplied and almost none of it was grown within sight of …" | DS-GEN-3 | `foodSecurity.label: Import-Dependent` | yes | marked `walls`; twin v5 (`no walls`) |
| v1 "{settlement} is under siege, and the trade income on its books is what the town earned …" | DS-GEN-7 | `stress_economic: siege against trade income` | yes | open: a gate, not the check's term (`hasGate`) |
| v4 "What {settlement} was worth in trade is being spent down rather than earned, and the st…" | DS-GEN-7 | `stress_economic: siege against trade income` | yes | open: a gate, not the check's term (`hasGate`) |
| v2 "{settlement}'s walls and what they are actually for." | DS-GEN-10 | `PRINT-NATIVE CHAPTER OPENERS: defense` | no: block unmounted | none now; owed when the block is lit |
| v4 "{settlement} is safer than its country, and what threatens it comes from outside the wa…" | DS-HK-1 | `category safety: the streets are the opening` | yes | marked `walls`; twin v5 (`no walls`) |
| v2 "What is not coming into {settlement} through the gate is a gap, and gaps in a town like…" | DS-HK-1 | `clock smuggling_rise` | yes | open: a gate, not the check's term (`hasGate`) |
| v2 "Everything green in {settlement} is deliberate, and the deliberateness says more about …" | DS-GEN-12 | `DRY-GROUND` | n/a: not the place's defences | none (a building, a simile) |
| v1 "No market or fair stands in {settlement}: what trade the town does is done at the gate,…" | DS-GEN-13 | `NO-MARKET` | yes | open: a gate, not the check's term (`hasGate`) |
| v2 "A stranger finds no market square in {settlement}, only trade done at the gate, at the …" | DS-GEN-13 | `NO-MARKET` | yes | open: a gate, not the check's term (`hasGate`) |
| v1 "Everything at {settlement} answers to the siege now. Whatever the hall was arguing abou…" | DS-POW-2 | `siege matched` | yes | marked `walls`; twin v5 (`no walls`) |
| v2 "The {seat} at {settlement} governs a besieged town, which means it governs rationing, t…" | DS-POW-2 | `siege matched` | yes | open: a gate, not the check's term (`hasGate`) |
| v4 "{faction}'s hold on {settlement} is being decided outside the walls rather than inside …" | DS-POW-2 | `siege matched` | yes | marked `walls`; twin v6 (`no walls`) |
| v1 "Nothing at {settlement} is moving the town's view of its rulers: not the harvest, not t…" | DS-POW-6 | `neutral baseline (nothing pulling either way)` | yes | marked `walls`; twin v4 (`no walls`) |
| v2 "A share of what arrives at {settlement} never appears at the gate, and the share is not…" | DS-POW-6 | `operation role duty evasion` | yes | open: a gate, not the check's term (`hasGate`) |
| v1 "The fractious have closed ranks at {settlement} because of what is at the walls; the co…" | DS-POW-7 | `glue threat (a common danger at the walls)` | yes | marked `walls`; twin v4 (`no walls`) |
| v1 "Nothing moves through the gates. {settlement} lives on what is already inside the walls…" | DS-STR-1 | `UNDER SIEGE` | yes | marked `walls`; twin v7 (`no walls`) |
| v2 "The walls are held from outside; the fields beyond them have not been worked since the …" | DS-STR-1 | `UNDER SIEGE` | yes | marked `walls`; twin v8 (`no walls`) |
| v3 "Trade stops at the gate rather than the market now. The siege decides what the town eats." | DS-STR-1 | `UNDER SIEGE` | yes | open: a gate, not the check's term (`hasGate`) |
| v4 "{settlement} is shut, and the shutting is not the town's decision; every arrangement in…" | DS-STR-1 | `UNDER SIEGE` | yes | marked `walls`; twin v9 (`no walls`) |
| v6 "Nobody goes in or out of {settlement}, and the walls have people on them at hours walls…" | DS-STR-1 | `UNDER SIEGE` | yes | marked `walls`; twin v10 (`no walls`) |
| v3 "The garrison is quartered inside the walls, and the town's business is conducted around…" | DS-STR-1 | `UNDER OCCUPATION` | yes | marked `walls`; twin v7 (`no walls`) |
| v1 "A share of everything {settlement} earns leaves for a creditor beyond the walls, and th…" | DS-STR-1 | `INDEBTED TO AN OUTSIDE POWER` | yes | marked `walls`; twin v7 (`no walls`) |
| v3 "{settlement} keeps more watch than it can afford; the country beyond the walls has stop…" | DS-STR-1 | `BEAST & RAIDER THREAT` | yes | marked `walls`; twin v7 (`no walls`) |
| v1 "People are arriving faster than the town can house them. The camps outside the wall are…" | DS-STR-1 | `MASS MIGRATION` | yes | marked `walls`; twin v7 (`no walls`) |
| v1 "The hunger cannot lift while the lines hold. Relief exists; it is simply on the wrong s…" | DS-STR-2 | `SYNERGY: famine × siege` | yes | marked `walls`; twin v4 (`no walls`) |
| v2 "Whoever is doing this has not troubled to identify themselves, and knew precisely where…" | DS-STR-2 | `ORIGIN: unattributed` | yes | marked `walls`; twin v4 (`no walls`) |
| v2 "The soldiers here have stopped being the seat's instrument and started being its rival;…" | DS-STR-2 | `ORIGIN: barracks_coup` | yes | marked `walls`; twin v4 (`no walls`) |
| v3 "What moves against the government is armed, disciplined, and already inside the walls b…" | DS-STR-2 | `ORIGIN: barracks_coup` | yes | marked `walls`; twin v5 (`no walls`) |
| v2 "{settlement} is the home of a campaign rather than its battlefield. The cost shows in t…" | DS-CND-1 | `FAMILY: war layer, aggressor side` | yes | marked `walls`; twin v4 (`no walls`) |
| v2 "The town is short of the people who would ordinarily be here, and the shortness is felt…" | DS-WAR-1 | `statusLabel: On campaign` | yes | open: a gate, not the check's term (`hasGate`) |
| v3 "{settlement} is at war with {counterpart} and has not been touched by it; the distance …" | DS-WAR-1 | `statusLabel: At war (no front at the walls, no army abroad)` | yes | marked `walls`; twin v4 (`no walls`) |
| v3 "The outlying country around {settlement} is dangerous because of {counterpart} and the …" | DS-WAR-1 | `feasibility harassment` | yes | marked `walls`; twin v4 (`no walls`) |
| v2 "The danger to {settlement} from {counterpart} is internal by necessity. The walls are n…" | DS-WAR-1 | `feasibility require_betrayal` | yes | marked `walls`; twin v4 (`no walls`) |
| v3 "{counterpart} has stopped looking at {settlement}'s walls and started looking at its qu…" | DS-WAR-1 | `feasibility require_betrayal` | yes | marked `walls`; twin v5 (`no walls`) |
| v1 "{counterpart}'s garrison keeps the walls of {settlement} without incident: resented tho…" | DS-WAR-2 | `territorial · honored` | yes | marked `walls`; twin v4 (`no walls`) |
| v3 "The garrison at {settlement} keeps the walls without incident and has kept them long en…" | DS-WAR-2 | `territorial · honored` | yes | marked `walls`; twin v5 (`no walls`) |
| v1 "The garrison keeps {settlement}'s walls uneasily now; the townspeople chafe, stones are…" | DS-WAR-2 | `territorial · strained` | yes | marked `walls`; twin v4 (`no walls`) |
| v3 "The garrison at {settlement} is spending more of its strength on the town than on the w…" | DS-WAR-2 | `territorial · strained` | yes | marked `walls`; twin v5 (`no walls`) |
| v3 "What holds {settlement}'s walls is now under attack from inside them, and the occupatio…" | DS-WAR-2 | `territorial · defaulted` | yes | marked `walls`; twin v4 (`no walls`) |
| v2 "The town's own dispute is no longer the town's own, and the people who made it somebody…" | DS-WAR-2 | `sovereignty · defaulted` | yes | open: a gate, not the check's term (`hasGate`) |
| v2 "The gates are shut and there is something outside them, and the something is not a rumour." | DS-WAR-5 | `live war_front INTO the settlement (a genuine siege)` | no: block unmounted | none now; owed when the block is lit |
| v3 "What decides {settlement} now is being decided outside its walls, and nothing the town …" | DS-WAR-5 | `live war_front INTO the settlement (a genuine siege)` | no: block unmounted | none now; owed when the block is lit |
| v1 "{settlement} and {counterpart} are hostile and nothing is standing outside the walls; t…" | DS-WAR-5 | `phantom front (hostility with no army behind it)` | no: block unmounted | none now; owed when the block is lit |
| v1 "The army outside {settlement} has gone. The gates are open, the town is counting, and t…" | DS-WAR-5 | `aftermath siege_lifted` | no: block unmounted | none now; owed when the block is lit |
| v2 "The siege at {settlement} has been lifted and the town's condition has not yet caught u…" | DS-WAR-5 | `aftermath siege_lifted` | no: block unmounted | none now; owed when the block is lit |
| v1 "{creed} is the patron here, and it is no local creed. The same rite is kept across enou…" | DS-FTH-1 | `PATRON: rankAxis: major` | yes | marked `walls`; twin v4 (`no walls`) |
| v3 "Outside these walls {creed} is a curiosity. Inside them it is the calendar, the oath an…" | DS-FTH-1 | `PATRON: rankAxis: cult` | yes | marked `walls`; twin v4 (`no walls`) |
| v3 "Faith props the government here modestly, the way a wall props a roof that would mostly…" | DS-FTH-1 | `MANDATE: a measure of divine mandate` | n/a: not the place's defences | none (a building, a simile) |
| v1 "The country around {settlement} is thick with creatures and the town has answered it pr…" | DS-DEF-2 | `Beasts & Monsters: plagued, perimeter AND organized force` | no: the pool key reads the enclosure | already gated |
| v2 "Defense at {settlement} is not an emergency arrangement, it is the week's work: the rot…" | DS-DEF-2 | `Beasts & Monsters: plagued, perimeter AND organized force` | no: the pool key reads the enclosure | already gated |
| v1 "{settlement} has a wall and nobody to man it. The line is a chokepoint on paper and a c…" | DS-DEF-2 | `Beasts & Monsters: plagued, perimeter but NO force to hold it` | no: the pool key reads the enclosure | already gated |
| v2 "A stranger finds spears at {settlement} and no wall for them to stand on, and can see h…" | DS-DEF-2 | `Beasts & Monsters: frontier, force without a perimeter` | no: the pool key reads the enclosure | already gated |
| v1 "There is very little in the country around {settlement} and there are substantial works…" | DS-DEF-2 | `Beasts & Monsters: settled, defenses beyond the need` | no: the pool key reads the enclosure | already gated |
| v2 "A stranger sizing {settlement} up sees the two things that matter together (the wall an…" | DS-DEF-2 | `Invasion & War: walls AND professional garrison` | no: the pool key reads the enclosure | already gated |
| v1 "Walls at {settlement} with townspeople behind them: credible against raiders, and inade…" | DS-DEF-2 | `Invasion & War: walls with citizen militia` | no: the pool key reads the enclosure | already gated |
| v1 "{settlement} has walls and nobody to put on them. A determined attacker takes this town…" | DS-DEF-2 | `Invasion & War: walls with NO force` | no: the pool key reads the enclosure | already gated |
| v1 "There is a line around {settlement} and it is kept: the gates shut, the works are repai…" | DS-DEF-5 | `walls PRESENT` | no: the pool key reads the enclosure | already gated |
| v3 "The town has a wall and arranges its day around the gates without noticing that it does." | DS-DEF-5 | `walls PRESENT` | no: the pool key reads the enclosure | already gated |
| v3 "A stranger at {settlement} is counted at the gate by somebody whose job that is, and is…" | DS-DEF-5 | `garrison PRESENT` | yes | open: a gate, not the check's term (`hasGate`) |
| v2 "There are people walking the town at {settlement} at night, and the town's sense of its…" | DS-DEF-5 | `watch PRESENT` | yes | open: a gate, not the check's term (`hasGate`) |
| v2 "A stranger at {settlement} is measured at the gate in a way he cannot quite identify, a…" | DS-DEF-5 | `arcane defense PRESENT` | yes | open: a gate, not the check's term (`hasGate`) |
| v3 "A bad year does not empty {settlement}'s walls, and the reason is the pay rather than t…" | DS-DEF-6 | `Economic Backing: Well-funded` | yes | marked `walls`; twin v4 (`no walls`) |
| v3 "What the walls at {settlement} cannot see is somebody's charge rather than nobody's, an…" | DS-DEF-6 | `Arcane Support: Present` | yes | marked `walls`; twin v4 (`no walls`) |
| v3 "The town can name what has cost it at {settlement}, exactly, and names it whenever the …" | DS-DEF-7 | `a contributor with a RECORDED reason, adverse` | no: block unmounted | none now; owed when the block is lit |
| v3 "{settlement} would be thinner on the walls without {reason}, and the difference is ente…" | DS-DEF-7 | `a contributor with a RECORDED reason, favourable` | no: block unmounted | none now; owed when the block is lit |
| v1 "There is an army at {settlement}'s walls. Everything the town does now is done inside t…" | DS-DEF-7 | `besiegedBy present` | no: block unmounted | none now; owed when the block is lit |
| v2 "The town has sent its soldiers to sit outside somebody else's walls, and is quieter and…" | DS-DEF-7 | `besiegingTargets present (the army is abroad)` | no: block unmounted | none now; owed when the block is lit |
| v3 "What {settlement} is spending on {counterpart} it is spending out of its own walls; the…" | DS-DEF-7 | `besiegingTargets present (the army is abroad)` | no: block unmounted | none now; owed when the block is lit |
| v2 "Everything the town does now is measured against the stores and the walls, and nothing …" | DS-DEF-10 | `posture ACTIVE SIEGE` | no: block unmounted | none now; owed when the block is lit |
| v3 "What {settlement} can ask of the people on its walls falls with what it can feed them, …" | DS-DEF-10 | `posture INTERNAL PRESSURE (famine)` | no: block unmounted | none now; owed when the block is lit |
| v1 "{settlement}'s defense is not {settlement}'s. What stands on these walls answers to {co…" | DS-DEF-10 | `posture UNDER OCCUPATION` | no: block unmounted | none now; owed when the block is lit |
| v3 "Orders reach the gate at {settlement} from two directions, and the people at the gate h…" | DS-DEF-10 | `posture COMMAND SPLIT (politically fractured)` | no: block unmounted | none now; owed when the block is lit |
| v3 "The tribute at {settlement} is met first and the walls are met with the remainder, and …" | DS-DEF-10 | `posture UNDER TRIBUTE (indebted)` | no: block unmounted | none now; owed when the block is lit |
| v1 "{settlement} is closed against a sickness rather than against an army; the gates are he…" | DS-DEF-10 | `posture QUARANTINE ACTIVE (plague onset)` | no: block unmounted | none now; owed when the block is lit |
| v3 "The gates at {settlement} are being held against the town's own country, and every week…" | DS-DEF-10 | `posture QUARANTINE ACTIVE (plague onset)` | no: block unmounted | none now; owed when the block is lit |
| v3 "Nobody at {settlement} can order the walls held and several people could, and the sever…" | DS-DEF-10 | `posture SUCCESSION CONTESTED` | no: block unmounted | none now; owed when the block is lit |
| v2 "The people who would stand together on the walls at {settlement} are not currently spea…" | DS-DEF-10 | `posture RELIGIOUS UPHEAVAL` | no: block unmounted | none now; owed when the block is lit |
| v1 "More people are arriving at {settlement} than the town's arrangements were built for, a…" | DS-DEF-10 | `posture MIGRATION SURGE` | no: block unmounted | none now; owed when the block is lit |
| v2 "The town is fuller than it was by {band}, and nothing about the watch, the water or the…" | DS-DEF-10 | `posture MIGRATION SURGE` | no: block unmounted | none now; owed when the block is lit |
| v3 "A stranger arriving at {settlement} is not remarkable, because so many people have arri…" | DS-DEF-10 | `posture MIGRATION SURGE` | no: block unmounted | none now; owed when the block is lit |
| v2 "The {defwork} stands ahead of any present need; walls are easier to keep than to raise,…" | DS-DEF-11 | `WALLED-QUIET` | no: the pool key reads the enclosure | already gated |
| v1 "{settlement} is too small to wall and knows it; the town's safety is its neighbours, it…" | DS-DEF-11 | `UNWALLED-SMALL` | no: the pool key reads the enclosure | already gated |
| v2 "No wall marks where {settlement} ends; at this size the country and the town simply agr…" | DS-DEF-11 | `UNWALLED-SMALL` | no: the pool key reads the enclosure | already gated |
