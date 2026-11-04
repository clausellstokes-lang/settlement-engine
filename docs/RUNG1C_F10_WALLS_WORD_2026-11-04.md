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

## 3. The cure (unit 2, `4a49ae5b`)

**One gate.** The state-prose kernel's fail-closed mark channel (`stateProseKernel.js :: STATE_MARK_DIMENSIONS`, law 5) gains a `walls` fact dimension, `walls` / `no walls`. It is answered at all 17 desk entries by the F1 reader: `defense/defenseFacts.js :: wallsAnswered(settlement, options)`, which reads `defenseFactsOf(settlement).hasWalls`. A pool that names walls is unreadable to a caller that has not answered the dimension, so a new desk entry cannot leak a wall line silently. The general desk's two `dimensions` overrides (DS-GEN-6, DS-GEN-9) now keep the answer.

**The twins.** Each of the 40 variants in §2 carries `walls`; its twin, appended to the same pool in the same angle (`[angle · no walls]`, the next row number, so no vid moves), says the same thing without the walls. Examples: "the siege has settled the argument"; "being decided outside the hall rather than inside it"; "what threatens it comes from the country around it rather than from within"; "The halls, the houses and the roads". The twins add no defence term (no garrison, soldiers or hospital). One public wall-neutral line was added to DS-WAR-1 `feasibility require_betrayal` (v6). Without it the split would have left each wall value single-voiced for the player, and the thin-state ratchet would have risen from 14 to 16.

**Walled places are unmoved.** For a walled place the eligible set is unchanged: the `walls` variants plus every unmarked one. So the index-stable draw is unchanged. The exception is the require_betrayal pool, which gained the neutral line. The test proves it on the three births given a palisade: they print their base lines, byte for byte.

**The red-first** (`tests/domain/wallsWordDossierProse.test.js`). At `64aeda874` three of its four tests failed by title, and the sweep named 39 ungated mounted variants. After the cure all four pass. Births 24, 92 and 336 now print DS-POW-2 v5, v5 and v6 (the twins) where they printed v4, v1 and v4. The sweep also holds the rule going forward: a mounted variant that names walls must carry the mark or sit in a pool whose key reads the enclosure.

**The projection.** `npm run gen:dossier-prose` refuses at this base: the wiring census is stale against three desk files at `64aeda874` itself (`generalStateProse.js`, `defenseStateProse.js`, `warFaithStateProse.js`, from the self-vouch compose). Re-taking it (`wiring-census.mjs --dry`) would move 106 rows, mixing this lane's cause with the base's. So the leaves were projected by a scratch copy of the projector with only `assertCensusCurrent` bypassed, and the copy was deleted. Only the six state leaves moved (2,266 → 2,307 variants). The causal, connectives, norms and relations leaves are byte-identical. The census re-take and `--check` belong to the landing seat.

## 4. The count

| | base `64aeda874` | tip `4a49ae5b` |
|---|---|---|
| `coh:defense-words`, 60 | 4 (thorp 1, town 3) | **2** (town 2: `soak1k-45` crisisCast, `soak1k-15` civic office) |
| `coh:defense-words`, 1,000 | 57 (thorp 8, hamlet 8, village 18, town 23) | **35** (hamlet 3, village 15, town 17) |
| `A-12:self-vouch-false`, 1,000 | 2 | **0** |
| every other class, 1,000 | | unchanged |

Run times: 1,000 at the tip took 199 s, 0 errors. **No pool-family seed remains.** On A-12, both of its cases (`soak1k-171` Ravenko, `soak1k-313` Achilopolis) had exactly one contradiction finding, and it was DS-ECO-8's "The halls, the walls and the roads…" in a place with no walls. The twin clears both. So 1C's PLAUSIBLE reading of `soak1k-313` as an A-12 instrument reach is refuted, and `soak1k-171` is answered: the battery passes a record that holds no contradiction, and the soak contradicted a dossier sentence the battery does not read.

**The 35 that remain, every seed and sentence.** None is a dossier-pool line. All are the generation-time writers of §1.

- `soak1k-380` (village): In the war, the defence is led by Ciarán Walsh of Household Council: holds the garrison's office. // Keep unit cohesion as conscription pulls away experienced soldiers and replaces them with frightened substitutes — Protect their own through a war tha
- `soak1k-416` (village): In the war, the defence is led by Cairbre Tobin of Elder Council: holds the garrison's office.
- `soak1k-452` (village): Someone is paying their soldiers more than their salary. // The soldiers aren't saying who.
- `soak1k-476` (village): In the raids, the brunt falls on Étaín MacCarthy of Military/Guard: its people stand on the walls.
- `soak1k-620` (village): Someone is paying their soldiers more than their salary. // The soldiers aren't saying who.
- `soak1k-848` (village): Someone is paying their soldiers more than their salary. // The soldiers aren't saying who.
- `soak1k-872` (village): holds the garrison's office.
- `soak1k-45` (town): In the raids, the brunt falls on Umesh Kaur of Military/Guard: its people stand on the walls.
- `soak1k-165` (town): Move people beneath the walls unseen.
- `soak1k-213` (town): Wants to keep unit cohesion as conscription pulls away experienced soldiers and replaces them with frightened substitutes. // Keep unit cohesion as conscription pulls away experienced soldiers and replaces them with frightened substitutes — Rebuild guard morale after years of // Kyr Lekapenos** (Guard Captain · defends): Wants to keep unit cohesion as conscription pulls away experienced soldiers and replaces them with frighten
- `soak1k-321` (town): A guild's private soldiers arrested a rival's factor.
- `soak1k-397` (hamlet): Someone is paying their soldiers more than their salary. // The soldiers aren't saying who.
- `soak1k-441` (town): Walls, wells, roads, and the watch // In the raids, the brunt falls on Antonius Aquila of Monster Hunters / Adventurers: its people stand on the walls.
- `soak1k-597` (town): Walls, wells, roads, and the watch
- `soak1k-801` (town): Walls, wells, roads, and the watch
- `soak1k-86` (village): Someone is paying their soldiers more than their salary. // The soldiers aren't saying who.
- `soak1k-98` (village): Someone is paying their soldiers more than their salary. // The soldiers aren't saying who.
- `soak1k-134` (village): Someone is paying their soldiers more than their salary. // The soldiers aren't saying who.
- `soak1k-650` (village): Someone is paying their soldiers more than their salary. // The soldiers aren't saying who.
- `soak1k-686` (village): Waystation**: An overnight stop behind walls, offering stabling, a well, and basic supplies to caravans and long-haul travellers.
- `soak1k-782` (village): Someone is paying their soldiers more than their salary. // The soldiers aren't saying who.
- `soak1k-806` (village): Identify the person inside the walls who is communicating with the besiegers — End this siege in a way the settlement can recover from
- `soak1k-962` (village): Identify the person inside the walls who is communicating with the besiegers — End this siege in a way the settlement can recover from
- `soak1k-15` (town): Walls, wells, roads, and the watch
- `soak1k-315` (town): Walls, wells, roads, and the watch
- `soak1k-339` (town): The power Military Council (minor) garrison-backed
- `soak1k-375` (town): Wants to keep unit cohesion as conscription pulls away experienced soldiers and replaces them with frightened substitutes. // Keep unit cohesion as conscription pulls away experienced soldiers and replaces them with frightened substitutes — Rebuild guard morale after years of // Valdis Ketilsson** (Guard Captain · defends): Wants to keep unit cohesion as conscription pulls away experienced soldiers and replaces them with frigh
- `soak1k-403` (hamlet): Someone is paying their soldiers more than their salary. // The soldiers aren't saying who.
- `soak1k-543` (town): Keep unit cohesion as conscription pulls away experienced soldiers and replaces them with frightened substitutes — Protect their own through a war tha
- `soak1k-579` (town): Identify the person inside the walls who is communicating with the besiegers — End this siege in a way the settlement can recover from
- `soak1k-615` (town): Move people beneath the walls unseen.
- `soak1k-739` (hamlet): Someone is paying their soldiers more than their salary. // The soldiers aren't saying who.
- `soak1k-807` (town): Keep unit cohesion as conscription pulls away experienced soldiers and replaces them with frightened substitutes — Build something that doesn't need t // Keep unit cohesion as conscription pulls away experienced soldiers and replaces them with frightened substitutes — Achieve enough distinction to be re
- `soak1k-819` (town): Walls, wells, roads, and the watch
- `soak1k-831` (town): Move people beneath the walls unseen.

## 5. Reds this lane causes (none re-recorded here)

Attribution is by test title, against the same 55 governing files on a pristine copy of the base (`git archive 64aeda874`). The base carries 29 red tests in those files; the tip carries 43; 14 titles are this lane's, all from one cause (41 added lines, one dimension):
- **Registers:** the prose-shift register (`dossierStateProseProjection.contract` "recomputes every pin from the leaves", "MUTANT: a mechanism that moves without its row"); the prose byte ratchet (`proseCorpusBytes` RAW exact, GZIP band; bytes owed); `proseEntryContradiction` ×3 (its line-keyed anchors shifted by the inserted rows, and its loader counts 2030 → 2065, 2734 → 2774, trailing-coordinate 328 → 336); `proseWiringCensus` "the VARIANT column closes" (the census re-take).
- **Corpus totals and shrink-only readings:** `composeStateProse` 2266 → 2307; `warFaithStateProseDesk` 418 → 429; `proseComposed` ×3 (corpus 2307, the A0b field reading 1282 → 1306, the A13 citation habit 7 → 8, which the twins inherit from their originals); `proseWaveGate` units 383 → 385.
- **Masked under base-red titles (PLAUSIBLE additive):** `dossierProseManifest` "THE DRIFT ARM" (the composed prose of unwalled towns moves to the twins). `proseDrawnAnchors` was red at the base on `warFaithStateProseDesk.test.js` and is not added to: this lane's test computes its anchors with `variantByVid`.
- **Moved here with the mechanism (pins whose premise this lane changes):** the mark vocabulary (7 → 9, kernel and contract), the dimensioned block list (3 → 19), the undimensioned-pool floor (762 → 730), the DS-GEN-3 and DS-HK-1 dimensions, the warFaith leaf's dimension arm, and the 17 mount rows' `dimensions: ['walls']` declarations.
- **Goldens:** none. The row hash (sha256 of the generated settlement) of `soak1k-24`, `-92` and `-336` is identical before and after (`b51d754bd3e4690d`, `4d8b32dbc34cfb70`, `ad63cb573011e93e`). The prose is render-time.
- **Types:** `tsc --noEmit` reports the base's 167 errors, the same set; none is in a touched file. eslint: 0 errors.

## 6. VETOABLE content and open questions

- The 41 new lines (§2's "twin vN" and DS-WAR-1 v6): their wording is the owner's class.
- **The 34-writer residue** (§1, §4) is generation-time: `npcData.js` hooks, `institutionServices.js`, `crisisCast.js`, `npcGenerator.js`, a waystation desc and a guild line. Curing it moves generated towns, so goldens, one cause per signed shift. It is F1's intake and needs a lane of its own.
- **Gates** (18 variants) and **unmounted blocks** (29 variants) are left. "Gate" is not the check's term, and `hasGate` is its own fact. An unmounted block owes the same marks the day it is lit.
- **The census.** The wiring census was already stale at the base. The landing seat re-takes it once, over every composed lane.
- **Sibling lanes.** F9 edits the DS-DEF magic and crime blocks of the same pool doc. This lane touched DS-DEF only at DS-DEF-6's two `[counterforce]` rows. The six generated leaves conflict by construction: the landing re-projects them after the merge.

## 7. CONFIRMED vs PLAUSIBLE

**CONFIRMED:** the base and tip counts (60 and 1,000, read from `artifacts/f10-base*` and `artifacts/f10-tip*`); the red-first, red before and green after by its titles; the walled control byte-identical; the three row hashes; the base-attributed reds; the type and lint readings; the A-12 cause. **PLAUSIBLE:** pool-level reachability inside mounted blocks; the residue's writer names (sorted by quote); the drift manifest's additive move.

## 8. Unit 4: the 34 generation-time writers (the chair's ruling 5, 2026-11-04)

The chair lifted "goldens moving" for this unit under the house rule: the lane may change generation output, lists every golden row it moves, and re-records nothing.

**Two mechanisms, both reading `defenseFactsOf`.**
- **The hook-truth gate** (`coherence/hookTruth.js`, `hookTruthRecord.js :: storeTrueHooksOnly`). The gate now licenses "soldiers" by a garrison or hired company and "garrison" by a garrison alone, the defence-words check's own `TERMS`. Before, a militia counted for both. The gate also walks the copy of each NPC that a faction roster keeps (`factions[].members[].plotHooks`). `soak1k-452` had kept the dropped hook there after the NPC itself lost it.
- **One draw-free twin table** (`src/data/defenceTwinLines.js :: defenceTwinLine`), F5's inland-twin rule aimed at defence. It is keyed by the line's own text and taken after the draw. Each entry needs `walls`, `garrison` or `soldiers`, read the way the check reads them. The writers are edited in place on existing lines, so no line-keyed citation moves.

| cause | commit | writer → twin | soak seeds | golden rows moved (of 525) |
|---|---|---|---|---|
| A | `1652d3cb` | the "paying their soldiers" hook dropped by the gate | 11 | 0 |
| B | `1f1edc38` | public works "Walls, wells, roads, and the watch" → "Wells, roads and the common ground"; "Move people beneath the walls unseen." → "Move people in and out unseen." | 6 + 3 | **34** (all town rows: a town council's public works with no enclosure; the desc string only) |
| C | `51cf0b05` | siege goal "inside the walls" → "inside the settlement"; wartime "conscription pulls away experienced soldiers" (and its note) → "the call-up pulls away experienced hands" | 3 + 5 | 0 |
| D | `bdd576ef` | cast reasons "its people stand on the walls" → "its people stand guard"; "holds the garrison's office" → "holds the office of the guard" | 3 + 3 | 0 |
| E | `c8bc1063` | waystation "An overnight stop behind walls" → "inside a fenced yard" | 1 | 0 |
| F | `03264055` | "garrison-backed" → "arms-backed"; "A guild's private soldiers" → "A guild's hired guards" | 1 + 1 | 0 |

Golden rows were measured as the suite hashes them (whole-record sha256 over `goldenMasterCorpus.js :: goldenCorpus`) after each commit. Units 1 to 3 moved 0 rows (the base copy against `5877a2d3`).

**Red first** (`tests/generators/defenceTwinLines.test.js`, at `5877a2d3`). All three seed titles were red: `soak1k-452` (the hook), `soak1k-15` (public works) and `soak1k-213` (conscription). After the unit, 5 of 5 tests pass, including the table's laws: every keyed line is a defence-words finding on a bare place and its twin is not; a place that holds the thing keeps the line to the byte.

**The count.**

| | before unit 4 (`5877a2d3`) | after (`03264055`) |
|---|---|---|
| `coh:defense-words`, 60 | 2 | **0** |
| `coh:defense-words`, 1,000 | 35 | **0** |
| `info:battery-would-not-vouch` (informational), 1,000 | 713 | 691 |
| every other class, 1,000 | | unchanged; the line reads CLIMB |

The 1,000 run was `artifacts/f10-u4-1k`: 185 s, 0 errors, 1,000 of 1,000 rendered.

**Reds.** 152 governing files (every test naming a changed module) were run at the tip and on the pristine base copy. The tip carries 7 red titles the base does not. All 7 are unit 2's declared prose registers (`proseComposed` ×3, `proseEntryContradiction` ×3, `proseWiringCensus` ×1). **Unit 4 adds none.** PLAUSIBLE: a unit-4 movement may sit under a title already red at the base. The candidates are the generation-fork census control hash, the DM-layer golden isolation (525), the espionage driven corpus and `pipelinePinnedMode`; each was red at the base, and the landing seat reads them per cause.

**VETOABLE:** the ten twins in `defenceTwinLines.js`; "arms-backed" and "holds the office of the guard" are the least natural of them.
