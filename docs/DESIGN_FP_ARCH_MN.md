# DESIGN_FP_ARCH_MN — THE MENACE: one generic threat from outside the settlement system, named by the DM, answered by the world

## Chair session 2fc13d59 (Opus 5.5), 2026-10-17. Compiled on the owner's word; DARK
## behind four virtual flags; nothing scheduled. Bound by the FP constitution's
## requirements 1–24 (`DESIGN_FP_SPINE.md` §1) and by `DESIGN_FP_COHERENCE_FOLD.md`.


> ⛔ **DRAFT WITH OPEN BLOCKING FINDINGS (2026-10-17).** The adversarial review found **6 BLOCKING · 20 MAJOR · 8 MINOR** in this volume (`settlement-engine-kits/dominion-xf-2fc13d59-2026-10-17/skeptic/SMN.md`) and shared seams (`skeptic/SX.md`). The worst: a severity floor cannot keep an episodic stressor alive (only §128.2's unbuilt pin can); `setStressorAttacker` cannot clear a hostile neighbour's attacker, so the menace inherits and is blamed on that neighbour's siege; the catalog siege is invisible to `liveSieges`, seal 6 and the war verdict, against §128a's "simulates identically"; a breach through the calamity pipeline IS a calamity; `falls` has no carrier without a razer settlement; no stage host is named; the menace record has no stressor link that avoids reading the name; requirement 24's scope extension should be an owner row. NOT YET DISPOSED — the next session cures this volume first.

**The owner's words (2026-10-17), verbatim.** "We only supply setting and consequence." — and, of the chair's idea ("Threats from outside the settlement system. FP is settlement upon settlement. A dragon, an orc horde, a plague of undead, nomads, a monster lair on the trade road: none is an actor … A small, setting-agnostic 'external force' family would make every other program sharper. It would press on borders, reorder alliances, close routes and spike prices"): "i like these ideas, comprehensively build them out based in our current architecture" … "regarding threats from outside, there should be just a very simple generic option rather than a list of options of what the threat is so the DM can keep soveringty over the story".

**Status: COMPILED, DARK, NOT SCHEDULED.** The dispatch gate is the owner's: nothing here builds before the UI + prose release is pushed and deployed. The rulings in §11 are the chair's under the owner's standing delegation ("i give my permission now and for whatever is emergent", 2026-10-16), vetoable by one clause.

**The answer in one paragraph.** A menace is one thing: a hostile presence the DM places in the world that belongs to no settlement. The DM gives it a name in the DM's own words, says where it is, how mighty it is, and whether it stays, goes somewhere, or roams — and that is all the engine is ever told. The engine never asks what it is. It has no mind: it does not choose, trade, believe or breed. The engine only moves it on the course the DM set, wears it down when it is beaten, and makes the WORLD answer it through machinery that already exists — the town it presses suffers the stressor it already knows, the roads near it grow dangerous, its news travels by word of mouth, the courts that hear of it arm, flee, call their allies, or swear common cause with old rivals, and the crown that fails to protect its towns pays for it in their loyalty. When it strikes, the DM hears it a week ahead and may let it run, tilt it, or decide it.

---

## §0 WHAT THE CODE ALREADY IS (census `settlement-engine-kits/dominion-xf-2fc13d59-2026-10-17/findings/T-threats.md`; master `81f1cd963`)

**Nothing in the code can be an outside force today.** Every actor the engine moves, and every subject it believes or reports, is a settlement (T §6).

| Substrate | Where | What it gives the menace |
|---|---|---|
| The PHANTOM | `src/domain/edit/phantoms.js`: `{ id, kind:'phantom', name, seed, traits:{culture,size,terrain} }` (:73-76); `applyOffStage` returns the world BY IDENTITY (:281-309); the seven off-stage ops are all home → phantom (`operationsOffStage.js:82-158`); the "home procedures" are unbuilt (`decreeHook.js:235-237`) | the OFF-STAGE counterparty — the wrong shape for a threat (no might, no place, never acts back) |
| The stressor's ATTACKER | `normalizeStressor` `stressorsCore.js:325-389` persists `originContext.attackerSettlementId/attackerLabel` ("a siege's attacker may be a goblin warband with no settlement at all", :357-361); `setStressorAttacker` `stressors.js:600-631`; the DM's `name_attacker` party impact (`partyImpactKinds.js:25`, `partyImpact.js:175-205`); NO simulation reader of the label | the landed seam a DM-named force writes to |
| The catalog's outside-threat stressors | `monster_raider_pressure` (`stressorsCore.js:140-148`: episodic; pressure kinds conflict + crime; spreads along wilderness frontier, trade route, resource competition; residuals abandoned_roads, militia_burden, fearful_hamlets); `siege` (:55-63; with no enemy the pressure-born siege is `unattributed`, `stressorDynamics.js:776-797`); counterforce of the raider row (defence readiness .5, defence institution .3, ally protection .2, :253-260) | the ONE crisis truth the menace drives |
| Wandering stressors | the catalog `wander: {chance, maxFootprint, channels}` moves a stressor along regional-graph channels and vacates its oldest ground (`stressors.js:198-298`; used only by `magic_deadzone`) | the landed roaming mechanic |
| THE ONE DANGER SCALAR | `embattlement.js`: ledger `spatialLedgers.embattlement[settlementId] = {level, phase, …}` (:9-19); `rampThreat` inputs occupation · besieged · war exhaustion · crime · security · target premium (:194-206); ⛔ the ramp's reads live in the FROZEN `pulseKernel.js:2357-2399`; consumers: route choice (:347-423), `routeDangerLevel` (:382-387), `banditryLoss` (:436-449), the roads gauntlet T3 (`roadsKernel.js:652-662`), migration road deaths (`migration.js:219-226`), route charters, the believed view (`roads/knownWorld.js:50-59`); live iff the map is canonized (:172-176) | the one danger truth the menace adds to |
| The calamity bucket | `calamity.js`: one type-blind strike (K institutions, bounded death ≤14%, exodus ≤26%, `CALAMITY_TUNING` :45-76); `FORCE_CALAMITY` realm verb = a severity band + a cosmetic `flavor` text (`calamityKernel.js:565-576`) | the precedent for a generic DM act, and the one bounded damage pipeline |
| Army strength words | `STRENGTH_BANDS` (`display/armyStrength.js:48-54`, 0..100 latent capacity): formidable ≥78 · strong ≥60 · capable ≥42 · modest ≥26 · thin | the might vocabulary (J-CNC-5: "a new scale would fork a closed corpus") |
| Readiness | `buildThreatByCid` (`martialReadiness.js:377-447`) reads war fronts, occupations and `WAR_STRESSOR_TYPES = ['siege','wartime','occupation','betrayal']` (`warStressorTypes.js:14`); the raider stressor is NOT a member | a gap |
| Response channels | condition promotion maps a monster/raider stressor to `war_pressure` (`conditionPromotion.js:31-35, :80-90`); `flow_migration` takes `monster_raider_pressure` at severity ≥0.6 (`flows.js:42-45`); crisis flight takes `war_pressure` (`populationDynamics.js:120`); faith crisis disorder sums any live stressor (`religiousContest.js:181-206`); the pact `shared_threat` occasion needs a hostile SETTLEMENT (`pactFormation.js:1069-1072`); `mutualDefenseFor` has no caller (`treatyEnforcement.js:328`); armies deploy only against settlements (`warDeployment.js:402, :494`) | what already answers, and what cannot |
| Belief, rumor, the Herald | beliefs are settlement-shaped (`beliefMap.js:10-12`); the only non-settlement belief is a derive-on-read roamer belief anchored at a settlement (`npcCirculationBelief.js:14-20, :164-188`); rumor content `{what, whereId, scope, magnitude 0..3, partyIds, causeClass, deityName}` (`rumorNetwork.js:150-161`) — `deityName` is a named non-settlement subject riding a rumor; the migration-rumor precedent carries a mover by its two witness towns (`migrationRumors.js:97-113`); a non-settlement id in `settlementIds` becomes a FAKE SETTLEMENT (executed, T §1.11); the Herald's `normalizeEntry` is an allowlist that drops unnamed fields (`wizardNews.js:655-772`) | the witness idiom, and the failure to avoid |
| The map | DM markers are cosmetic, with `Date.now()` ids (`mapSlice.js:678-688`); the digest's nodes are settlements, a region is a settlement's territory (`spatialDigest.js:689-695, :906`); no cell coordinates persist | until the physical world lands, a place is a settlement, a road between two, or the country around one |
| Reader-less state already waiting | `settlement.threats[]` read by `threatProfile.js:431-442` with no producer; `systemState.externalThreat` (display, `deriveSystemState.js:266-307`); `config._raidHistory` (no reader); `defenseProfile.scores.monster` (display) | surfaces a menace lights without a new writer |

**Binding prior words.**
- §128a (owner, 2026-08-15): *"a siege's other party is an OPTION — an intelligent monster's bandit or monster host may besiege a town with no settlement behind it"*; the chair then: "an EXTERNAL AUTHORED BESIEGER — a typed record … (name, strength band, disposition; setting-agnostic buckets, never a simulated character) with no faction economy behind it. The BESIEGED side simulates identically … the machinery reads THE SIEGE, not the besieger's pedigree"; "authored monsters can lose"; "the external-host record shape is written so §125.5's bandit-class encounters could later share it (roaming hosts)".
- The calamity bucket (owner, 2026-07-15): *"Calamity should be a catch-all term... it could be a beast wave, it could be a literal hand of god, a fire, drought, flood, earthquake, tarrasque — the flavor is for the DM; the effects we are going to bucket into one."*
- Piracy at bandit parity (owner, 2026-07-15): *"treat them the same as bandits in embattled regions/roads."*
- §934.43 THE PHANTOM CONSEQUENCE RULE (owner): *"if an army is sent out the effects are that they won or lost, and simply have returned following standard simulation procedures that we have made … These were phantom cities or settlements, so their actual impact on the settlement in question is minimal despite whatever consequence happens — unless it's a real settlement."*
- §129 THE TWO-HAT LAW (owner): ORDER moves through the world's grammar; AUTHOR is "instant placement — 'it is so' — provenance-marked AS AUTHORSHIP … and the world DISCOVERS the placed thing through the normal belief plane".
- §128 (owner): *"every stressor gains a DM-authority PIN … a pinned siege/plague/famine persists through ALL time advances"*.
- §934.36: the flavour tier "may be quoted by narration but never parsed into facts".
- ONE PLAGUE TRUTH (`pestilence.js:3-11`): "we drive that stressor, never a parallel one". Coherence fold §3.1.16: "a brigand siege is ONE MORE RAMP TERM on `embattlement.js`, never a parallel stressor".
- Spine requirement 24, THE HEARING WEEK (owner).

---

## §1 THE LAWS (MN1–MN14)

**MN1 — ONE KIND; THE STORY IS THE DM'S.** A menace is one generic kind. The engine never asks, stores or infers what it is. The DM's whole interface is a NAME and three dials (§2). There is no type list, no motive, no behaviour catalogue, and no rule anywhere reads the name.

**MN2 — THE NAME IS QUOTED, NEVER PARSED.** The DM's words appear in narration exactly as written (the §934.36 flavour tier); no rule, classifier or AI reads meaning from them. A blank name reads "an unnamed menace".

**MN3 — ON THE MAP, FULL CONSEQUENCE; BEYOND IT, A PHANTOM.** A menace is ON-STAGE: the besieged side simulates identically (§128a) and the world answers in full. A force beyond the map stays a PHANTOM under §934.43 (home procedures and a record). The two never merge. CN cn-5's "external authored host" IS a menace (re-ruling OD-FC-38's reconciliation with the phantom, §11 OD-MN-10); §128b's conversion valve converts a pinned besieging army into a menace.

**MN4 — IT DRIVES THE ONE CRISIS TRUTH.** On every settlement it presses, the menace DRIVES the stressor the world already knows — `monster_raider_pressure` while it raids, `siege` while it besieges — as that stressor's named ATTACKER (`setStressorAttacker`: `attackerLabel` = the DM's name, `attackerSettlementId` null). While the menace presses, it holds the stressor at a floor set by its might against the town's defence (the §128.3 clamped-floor idiom); when it leaves, the stressor runs its own lifecycle and leaves its own residue (abandoned roads, militia burden, fearful hamlets). Migration, faith disorder, conditions and the stressor's counterforce already read the stressor. A menace never mints a parallel crisis.

**MN5 — IT ADDS ONE TERM TO THE ONE DANGER TRUTH.** Where it is, `embattlement` takes ONE bounded term; every danger consumer (route choice, banditry loss, the roads gauntlet, migration road deaths, charters, the believed view) follows. The frozen kernel is never edited: the term composes inside `embattlement.js` if its advance receives the ledgers, else the menace stage applies it after the kernel's embattlement step through an `embattlement.js` export — the car-0 measurement of MN-1 decides which (§6).

**MN6 — IT HAS NO MIND.** No deciders, no economy, no faction, no belief of its own, no population. It is not PEOPLE: it holds no census credit, and the people ledger's conservation (`CONSERVATION_ENDPOINTS`, `peopleLedger.js:106-109`) is untouched; the deaths it causes are ordinary sinks. The engine moves it on its course and wears it when it is beaten. Everything else is the world's response.

**MN7 — THE WORLD KNOWS IT BY REPORT.** Courts answer what they have heard (Law One). Its news is carried by its WITNESS settlements — the towns where it is seen — and never by placing its id where a settlement's belongs (the executed fake-settlement failure). Its id and the DM's name ride typed fields (a rumor slot beside `deityName`; two names on the Herald's allowlist). A court's picture of a menace is DERIVED ON READ from the reports it holds (the roamer-belief precedent): where it was last seen, how long ago, how mighty the tale made it. The tale may swell or shrink in the telling (rumor magnitude). No new belief writer.

**MN8 — ITS ENGAGEMENTS ARE HEARD, AND THE ENGINE NEVER RAZES.** A menace besieging a town is a STANDING engagement; an army meeting it is a CLIMAX engagement (requirement 24, extended by §11 OD-MN-8). The engine's worst default verdict is a BREACH — casualties, damaged institutions, stores lost, through the calamity strike's bounded pipeline (one damage truth). That a town FALLS is the DM's verdict only, and then the existing razing road carries it.

**MN9 — THE DM HOLDS BOTH HATS (§129).** AUTHOR: raise it, move it — it is so, provenance-marked as authorship, discovered by the world through the belief plane. ORDER: set its course, and the world's grammar carries it. Every act is a typed realm verb through the one door (L10; J-EM-2), replayed exactly as an order in the world.

**MN10 — A MENACE CAN LOSE.** Repelled, its might falls one band; beaten in the field, one or two; below `thin` it is BROKEN and gone (§128a: "authored monsters can lose"). The DM may HOLD its might (the §128 pin idiom), and then it is worn by nothing.

**MN11 — A STRIKE IS NOT A PRESENCE.** A calamity is a strike: once, then its tail. A menace is a presence: it stays, presses, can be fought, moves and can lose. A "beast wave" the DM wants as a single blow is a calamity; as a host that lingers on the road, a menace. One damage truth serves both; they never double-count.

**MN12 — THE AMBIENT WORLD STAYS THE AMBIENT WORLD.** The engine never spawns a menace. Ambient raider stressors are born by their own gates as today (`monsterRaiderGate`, `stressorGates.js:635-656`), unnamed. A DM may PROMOTE one into a menace (the phantom-promotion idiom): the menace adopts the stressor as its driven stressor.

**MN13 — THE MOUNT RULE.** Zero lines in `pulseKernel.js`, `applyWorldPulse.js`, `warTermination.js`; hosts at the ceiling take nothing without a leaf-first car (`armyTransitKernel.js` 798, `stressorDynamics.js` 759 is close, `realmItemReadModel.js` 784, `beliefMap.js` 781). Every MN module is a leaf; every behaviour enters an existing decider as ONE bounded signal (the E14 precedent).

**MN14 — THE PHYSICAL WORLD IS A SEAM.** WHERE becomes a point, a cell and a route on the map when the physical world lands; until then it is a settlement, a road between two settlements, or the country around a settlement. Every MN wave is whole without the map.

---

## §2 THE DM'S HAND — THE WHOLE INTERFACE

| Field | Values | Meaning |
|---|---|---|
| NAME | free text (quoted, never parsed) | "the Ashen Host", "Old Grimtooth", "the Pale Riders" — the DM's story |
| WHERE | at a settlement · on a road (two settlements) · in the country around a settlement | where it is now |
| MIGHT | `thin · modest · capable · strong · formidable` | the army's own five words, on the same latent scale; the engine always says it RELATIVE to what it presses ("more than Kell's walls can hold"), the reference-price idiom |
| COURSE | `stays` · `toward` a settlement · `wanders` | it holds where it is; it goes there by road; it roams the country nearby |

**The verbs** (realm verbs, one door): `RAISE_MENACE` (AUTHOR: name, where, might, course; optionally `from` an ambient raider stressor it adopts) · `DIRECT_MENACE` with one of: move it (AUTHOR, it is so) · set its course (ORDER) · raise or lower its might one band · hold its might (pin) / release · still it (it stays but presses nothing) / rouse it · rename it · end it (it is gone). Every verb is premium (the simulator is gated for premium). Every verb has its inverse for undo.

**What the DM never sets**: what it is, what it wants, how it fights, whom it hates. Those are the DM's story, told at the table.

---

## §3 THE RECORD (the one persisted shape)

`spatialLedgers.menaces[menaceId] = { name, where: { kind: 'settlement' | 'road' | 'country', ids: [a] | [a, b] }, might: <band>, course: { kind: 'stays' | 'toward' | 'wanders', targetId? }, state: <state>, mightHeld, path?, sinceTick, lastTick }` — drop-when-empty, absent-when-dark, one writer (`src/domain/menace/menaceLedger.js`), closed vocabularies, DETERMINISTIC ids (`menace.<tick>.<n>` from the tick and an ordinal — never `Date.now()` or `Math.random()`).

**States** (engine-derived from where, might and course): `abroad` (on a road, between towns) · `raiding` (at a settlement whose defence holds against it, or in a country, or on a road it holds) · `besieging` (at a settlement whose defence it outweighs) · `stilled` (the DM's) · `broken` (beaten below `thin`) · `gone` (the DM ended it). A `broken` or `gone` record leaves the ledger at the end of the tick, with its chronicle line.

---

## §4 WHAT THE WORLD DOES — THE RESPONSE, CHANNEL BY CHANNEL

| Channel | The response | How (existing seam; what MN adds) |
|---|---|---|
| The pressed town | it suffers the stressor it already knows | MN4: drives `monster_raider_pressure` or `siege` with the named attacker, floor by might vs defence |
| The roads near it | grow dangerous; caravans reroute or are lost; columns die on them; charters cost more | MN5: one embattlement term at its nodes (a road raises both ends) |
| Readiness | towns near it arm | `buildThreatByCid` gains ONE menace term behind the flag — never by widening `WAR_STRESSOR_TYPES` (that would shift every lit world) |
| Flight | people leave the pressed country | already: `flow_migration` (raider stressor ≥0.6), crisis flight (`war_pressure`); nothing new |
| Faith | disorder in the pressed town | already: crisis disorder sums the stressor; no omen mechanic — meaning is the DM's to attribute (WF-4 as rebased) |
| News and belief | the tale travels town to town and may grow | MN7: witness-carried kinds, a rumor slot, derive-on-read belief |
| The pressed court | defends, holds, calls for help | ONE bounded `menaceAtHome` signal in the chooser (shares its context read with EC-17 and PL-4 — a car-0 measurement on `settlementStrategy.js`, 37 lines of room); the call-in rides WC-5 |
| Neighbours and allies | come to its aid | MN-4: in the strike's verdict, RELIEF from allied, sworn and pact-bound neighbours that believe the menace is there and are not pressed themselves (the `computeAllyRelief` idiom); armies in the field ride the relief road W-CONVERGENCE/WC-6 bind (`REINFORCE`), and meet the menace there (`menace_met`) |
| Old rivals | swear common cause | MN-5: the pact `shared_threat` occasion gains a menace arm (a menace believed to press both courts or their shared road); between hostile courts both pressed, the war chooser's hostility takes a bounded "common enemy" damper and a non-aggression occasion opens; `mutualDefenseFor` gets its reader (fold §3.2.3) so a sworn defence brings real help |
| The crown | owes protection to its towns | PL-4: a menace pressing a sworn town is the crown's protection test; kept or failed, it is written on the link and moves the town's loyalty |
| The commons | grow angry at a seat that cannot drive it off | a row in POP's `GRIEVANCE_INPUTS` registry: "unprotected" after a season of pressure with no relief |
| Trade | prices rise where roads are cut | EC's registry row when EC lights (a route-disruption pressure); dark until then |
| Intelligence | a court learns its true might by contact | a strike suffered, a battle fought, a fresh witness report; no espionage product (fold §3.1.17's precedent) |
| The dossier's threat profile | the menace appears on the pressed town's threat page | `threatProfile.js`'s collector gains the menace as a DERIVED source (its `settlement.threats[]` reader has no producer today); `systemState.externalThreat` takes the menace term — one reading of "pressure from outside" |
| Habit | courts learn who comes when they are struck | HB's closes, when built, read the protection record (PL8) |

**Opportunism needs no rule.** A town that has spent its strength on a menace is weaker; its rivals' existing reads see that.

---

## §5 THE STRIKE AND THE BATTLE (requirement 24, extended)

**`menace_strikes`** — a menace BESIEGING a town. STANDING: every week the siege stands is a hearing. The engine's default verdict reads the menace's might against the town's defence plus relief: `holds` (the siege goes on; the siege stressor's own effects bite) · `repelled` (it falls back; might down one band; it leaves the town for the country around it) · `breached` (it broke through for a time: the calamity strike's bounded pipeline — casualties, damaged institutions, stores lost; the siege goes on). The DM may leave it, tilt it (slight · heavy, for either side), or give a verdict, including `falls` — the DM's alone — which hands the town to the existing razing road.

**`menace_met`** — an army meets the menace in the field (a relief column arriving, or an army on its road). CLIMAX: `engage · withdraw`, then the battle's own outcome `menace_beaten · army_beaten · stand_off`; the menace's might falls one or two bands when beaten; the army's losses are the existing war machinery's.

**Raids are not hearings.** A menace raiding a town's country or holding a road presses through its stressor and its danger; the DM's existing doors on the stressor (ease · worsen · resolve) and the menace's own verbs are the hand there. (Otherwise one menace would flood the docket every week.)

At month, season and year advances every hearing resolves on the engine's default (requirement 24(c)).

---

## §6 THE COURSE — HOW IT MOVES

- `stays`: it holds where it is.
- `toward <settlement>`: it moves along the shortest road — the route network when it is written, else the settlements' neighbour links — one hop per road's travel time when the world scale exists (`hopWeeks`, WY-1), else one hop per two weeks (a DRAFT row, UNMEASURED). In transit it is `abroad` on the road and presses that road. At each town on its way it raids for one week and moves on; at its target it besieges or raids by might against defence.
- `wanders`: it roams the country nearby by the catalog's own wander step (the `wander` mechanic `stressors.js:198-298`, applied to the menace's own record — one mechanic, two users), within a footprint of its starting country.
- Piracy is parity (owner): a menace on a sea lane is a menace on a road; the seams are node-keyed and modality-blind.

**The car-0 measurement of MN-1** (before any MN line): where the danger term composes — read `advanceEmbattlement`'s arguments at master; if it receives the spatial ledgers, the term enters inside `embattlement.js`; else the menace stage runs after the kernel's embattlement step and raises the pressed nodes' level through an `embattlement.js` export, so the raised level is the next tick's starting level and decays by the ledger's own dynamics. Either arm keeps one danger truth and an untouched kernel.

---

## §7 THE FLAGS (virtual; absent-when-dark; read `=== true`; each with its certification row and lit-mutant pins)

| Flag | Gates | Host flags |
|---|---|---|
| `menacesEnabled` | the record, the verbs, the press (stressor drive, danger term, readiness term), the word (news, rumor slot, belief), the dossier and threat profile | `stressorsEnabled` (default on); the danger term needs a canonized map |
| `menaceStrikesEnabled` | the siege and battle hearings, verdicts, wear, the breach pipeline | `menacesEnabled`; the hearing docket (`hearingWeekEnabled`, SP-9) for the pause, else the default resolves in-tick |
| `menaceResponseEnabled` | relief in the verdict, the common-cause pacts and truces, the chooser's signal, call-ins against a menace, the crown's duty arm | `menacesEnabled`; pacts `pactFormationEnabled`; the crown arm `polityObligationsEnabled` |
| `menaceCourseEnabled` | `toward` and `wanders` | `menacesEnabled` |

---

## §8 THE WAVES (every charter carries requirement 16/17's line)

**MN-0 — THE RECORD AND THE DM'S HAND.** `menaceLedger.js` (one writer, normalizer, deterministic ids, closed vocabularies); the two realm verbs and their inverses; the promotion of an ambient raider stressor; the dossier line on each pressed town ("The Ashen Host is camped below Kell's walls — more than Kell can hold"); the authorship receipt. FIRST-VISIBLE: immediate — the dossier line and the receipt the moment the DM raises it · TIER: aspatial-safe; premium · DEGRADED ARM: dark.

**MN-1 — THE PRESS.** The stressor drive with the named attacker and the might-vs-defence floor; the danger term (car-0 first); the readiness term; the threat profile's derived source and the `externalThreat` term. FIRST-VISIBLE: the pressed town's stressor line and its neighbours' "the roads east of Kell are not safe", the first week · TIER: aspatial-safe except the danger term (canonized map) · DEGRADED ARM: without a map, the stressor and readiness arms alone.

**MN-2 — THE STRIKE.** `menace_strikes` and its verdicts; wear; the breach through the calamity pipeline; `falls` as the DM's verdict through the razing road. FIRST-VISIBLE: the hearing card the week the siege begins · TIER: aspatial-safe; the pause needs SP-9 · DEGRADED ARM: the engine's default resolves in the tick.

**MN-3 — THE WORD.** Witness-carried news kinds (`menace_seen`, `menace_moves`, `menace_strikes`, `menace_repelled`, `menace_breached`, `menace_broken`, `menace_gone`), each routed, voiced and registered (the Herald's walls); the rumor slot; derive-on-read belief; realm-scope news when it presses three towns or more (`realmEvents.js` threshold). FIRST-VISIBLE: the Herald's line the week it is first seen · TIER: news in every world; belief needs a belief-recording infoMode (in the default omniscient preset courts answer the truth) · DEGRADED ARM: truth-side news.

**MN-4 — THE ANSWER OF ARMS.** Relief in the strike's verdict; the chooser's `menaceAtHome` signal; `menace_met` on the relief road when it exists. FIRST-VISIBLE: "Ashford's levy marched to Kell's relief" the week it marches · TIER: relief is aspatial; armies need `warLayerEnabled` and the relief road · DEGRADED ARM: relief inside the verdict only.

**MN-5 — COMMON CAUSE.** The `shared_threat` menace arm; the rivals' damper and non-aggression occasion; `mutualDefenseFor`'s reader; call-ins against a menace (WC-5); the crown's duty (PL-4 joint). FIRST-VISIBLE: "Kell and Ashford, at odds since the border war, have sworn to stand together against the Ashen Host", the week the pact signs · TIER: `pactFormationEnabled` (lit in the default) · DEGRADED ARM: the menace without common cause.

**MN-6 — THE ROAD.** `toward` and `wanders`. FIRST-VISIBLE: "the Ashen Host is on the Kell road, bound for Ashford" the week it moves · TIER: aspatial on neighbour links; scaled by `hopWeeks` on a canonized map · DEGRADED ARM: `stays` only.

**MN-7 — THE ECHOES AND THE MEASURE.** The rows in other programs' registries (POP's "unprotected" grievance; EC's route-disruption pressure; HB's closes), each landed in its owner's commit; envelopes (menaces per campaign, breaches per siege-season, the share of strikes relieved, pacts sworn against a menace); the experience read. FIRST-VISIBLE: none — instrumentation.

---

## §9 THE LIFECYCLE OF THE RECORD (requirement 22a)

| Path | What happens |
|---|---|
| create | only the DM's `RAISE_MENACE` (or a promotion); the engine never spawns one |
| read | the menace stage, the dossier, the Herald, the belief derivation, the verdicts, the threat profile |
| persist | `spatialLedgers.menaces`, drop-when-empty |
| regenerate | a menace is campaign state, not generation output, and survives a regeneration; if a settlement it is tied to is removed, it moves to the nearest surviving neighbour or is stilled, with a receipt |
| undo | each verb has its inverse; the engine's moves undo with the pulse's own snapshot restore |
| import | carried; a menace tied to unknown ids is stilled with a receipt |
| migrate | absent-when-dark; no migration |
| dark-after-lit | kept, unread; its driven stressors are no longer held and run their own lifecycle |
| death | `broken` or `gone`: the record leaves the ledger; its chronicle line and its stressors' residue remain |
| veil | the truth is the DM's (the DM's view shows it); courts see what they have heard; the dossier speaks a court's belief in that court's voice |

---

## §10 THE SCENARIO MATRIX

| # | World | What must happen |
|---|---|---|
| M1 | the DM raises "the Ashen Host", formidable, at Kell, stays | Kell's dossier says it; `siege` driven with attacker "the Ashen Host" (its might outweighs Kell); the hearing card next week |
| M2 | the same, but modest against a strong town | `monster_raider_pressure` driven (it raids, it cannot besiege) |
| M3 | menace on the Kell–Ashford road | both nodes' danger rises; caravans reroute; Kell and Ashford's dossiers say the road is not safe |
| M4 | siege week: the DM leaves it | default verdict by might vs defence + relief |
| M5 | siege week: the DM tilts for Kell, heavy | the tilt enters the verdict; the receipt says so |
| M6 | siege week: the DM gives `falls` | the razing road carries it; the engine never chose it |
| M7 | repelled three times | might falls three bands to thin; once more and it is broken |
| M8 | the DM holds its might | no wear; still repelled, never broken |
| M9 | Ashford (allied to Kell) believes the menace is at Kell and is not pressed | its relief enters Kell's verdict |
| M10 | Kell and Ashford are hostile; both pressed | the hostility damper; a non-aggression occasion; a truce may sign |
| M11 | Kell sworn to Merewick; Merewick sends no relief for a season | PL-4: `protection_failed`; Kell's loyalty falls |
| M12 | course `toward` Ashford from Kell | moves a hop per road time (or two weeks aspatially), raids Tolle on the way for one week, besieges or raids Ashford |
| M13 | course `wanders` | roams the country near Kell within its footprint |
| M14 | the DM moves it (AUTHOR) | it is there at once, provenance-marked; the world learns of it by the witness news |
| M15 | an ambient raider stressor at Tolle; the DM promotes it to "the Pale Riders" | the menace adopts the stressor; the stressor's attacker becomes the name |
| M16 | the default (omniscient) preset | courts answer the truth; no belief derivation |
| M17 | a belief preset; Ashford far from Kell | Ashford answers only after the tale reaches it, and answers the tale's might, not the truth |
| M18 | the DM ends it | `gone`; the stressors run their lifecycle and leave their residue |
| M19 | no map (aspatial) | everything but the danger term and the scaled pace |
| M20 | a menace and a calamity at once | they never double-count: the strike is once; the menace's breach uses the same bounded pipeline on its own week |
| M21 | a besieging army pinned by the DM, its settlement withdrawn | §128b's valve: it becomes a menace with the army's might band |
| M22 | the menace's id placed nowhere as a settlement | no fake settlement in any belief or rumor ledger (the executed failure pinned) |
| M23 | month advance during a siege | each week's hearing resolves on the default; the receipts say so |
| M24 | all flags dark | byte-identical to today on every seed |

---

## §11 THE RULINGS (by delegation under the 2026-10-16 word, vetoable)

| Row | The question | Ruling |
|---|---|---|
| OD-MN-1 | The token (`threat`, `host`, `raid`, `brigand`, `calamity`, `phantom`, `externalThreat`, `monster_pressure` are all landed) | `menace` in code; the DM's name in prose |
| OD-MN-2 | The interface | NAME + WHERE + MIGHT + COURSE; no type list (the owner's word) |
| OD-MN-3 | The might words | the army's five (`STRENGTH_BANDS`, J-CNC-5), exported once from `armyStrength.js` as the shared vocabulary, read relative to defence |
| OD-MN-4 | The record (a persisted shape) | `spatialLedgers.menaces` as §3 |
| OD-MN-5 | One crisis truth | it drives `monster_raider_pressure` / `siege` as their named attacker; never a parallel stressor |
| OD-MN-6 | One danger truth | one term in `embattlement`; the frozen kernel untouched; car-0 decides the arm |
| OD-MN-7 | Readiness | a term behind the flag; `WAR_STRESSOR_TYPES` is not widened |
| OD-MN-8 | Requirement 24's scope | EXTENDED by this ruling: engagements between a settlement (or its army) and a menace are registered kinds (the owner's "so that the user can always fix them however they want" covers them); raids are not hearings |
| OD-MN-9 | Razing | the engine never razes; `falls` is the DM's verdict only |
| OD-MN-10 | Menace vs phantom | on-stage vs off-stage; OD-FC-38's reconciliation of cn-5's host with the phantom is re-ruled: cn-5's host IS a menace; §128b's valve converts into a menace |
| OD-MN-11 | Menace vs calamity | presence vs strike; one damage pipeline; never double-counted |
| OD-MN-12 | News and belief | witness-carried; a typed rumor slot beside `deityName`; two names on the Herald allowlist; derive-on-read belief; no new belief writer |
| OD-MN-13 | Intelligence | no espionage product for a menace |
| OD-MN-14 | The DM's verbs | two realm verbs, `RAISE_MENACE` and `DIRECT_MENACE` (J-EM-2: a realm-manifest row, never a bespoke op type); AUTHOR and ORDER hats per §129 |
| OD-MN-15 | The engine spawning menaces | never (MN12); promotion only |
| OD-MN-16 | Draft constants (the might-vs-defence floor table, the danger weight, the readiness weight, the aspatial pace, the verdict odds, the wear steps) | DRAFT rows, each UNMEASURED (requirement 18), on the FP-46 end-of-program tuning roster for the owner's review |
| OD-MN-17 | Where MN sits | coherence chain **C10 · THE MENACE**; the chair recommends it as the first chain chosen after C0, because its strike IS a hearing and its first four waves are leaves |
| OD-MN-18 | The reader-less surfaces | the threat profile and `externalThreat` derive the menace; `config._raidHistory` stays as it is (not a second record) |

---

## §12 WHAT A DM READS (under the Evidence Law)

- "The Ashen Host is camped below Kell's walls — more than Kell can hold."
- "The roads east of Kell are not safe; the Tolle caravans have turned back."
- "Ashford's levy marched to Kell's relief."
- "Kell and Ashford, at odds since the border war, have sworn to stand together against the Ashen Host."
- "Merewick sent no one to Kell's aid."
- "Kell's walls held; the Ashen Host fell back into the hills."
- "The Ashen Host broke through at Kell for a night; the granary burned."
- "Word in Tolle has the Ashen Host larger than any army in the realm." *(a believed tale, in a court's voice)*

Every line names who, upon whom, and what happened, and says nothing of what might.
