# DESIGN — THE MOVEMENT GRAMMAR (MG): how every unit moves on the map, week by week, and why

## Chair session 6eb7b5b6 (Fable 5.1; the program of chairs a73343ed and 0a2e8bd9); compiled by lane L-MG (Opus 5.5, xhigh), 2026-10-20, P6a of the FP final architecture program (kit `settlement-engine-kits/fp-final-a73343ed-2026-10-17/`).
## Compiled on the owner's word; DARK behind three virtual flags (`movementGrammarEnabled`, `wingsEnabled`, `ridingEnabled`, §11); nothing scheduled.
## Bound by the FP constitution's requirements 1–24 (`DESIGN_FP_SPINE.md` §1; 15–24's text of record is `DESIGN_FP_COHERENCE_FOLD.md` §1) and by the fold. Owned (by the brief) under WAYFARE: WY owns the one physics; MG is a VERB LAYER over it, never a second travel law.
## The compile log, every measurement, every STOP and the routes: `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/L-MG.md` (probes `cure/L-MG-probe/`). Every claim about code is CONFIRMED (read at the cited symbol at master `81f1cd963`) unless marked PLAUSIBLE; a claim about a sibling volume's design is PLAUSIBLE until that volume's car-0.
## `[REFINED 2026-10-20 (fp-final P6) — what; why]` marks every place the measurement or the house's laws changed the brief `briefs/L-MG.md`; each is vetoable.

---

## THE OWNER'S WORDS, VERBATIM (BOARD, 2026-10-20)

08:43 CDT — "last thing, have you already worked out, with all of the new route works going on, how they would and should move on the map per unit? like double backing, hiding, etc?"

12:25 CDT — "also when thinking about the grammar of unit movements, think of all of the reasons why a unit would want to do all of those things in full detail. For example, splitting a unit into 2 or more could be to sacrficie one for hte greater good, to try to get the other unit to split into multiple as well for whatever reason, to increase speed since unit size correlates to speed, etc etc. That is one example."

12:41 CDT — "note that there is a limit to splitting up, even if possible at all, for ships (air ships or otherwise) unless we considered them a fleet"

12:49 CDT — "also i forget that we have an institution for mounts... how should those effect movement speed of units and when and what situtaiton and status of a unit or NPC do they apply? in army or military units, you could have a cavalary unit, but for larger armies, it is as slow as its slowest member, unless cavalry splits off. mounts can also be traded as cargo and bandits could steal some maybe. NPCs starting missions from a settlement that has a mount has a speed boost. but then what are the counterforces or what am i missing? what are your thoguhts?"

The doctrines this volume obeys by name: the tool is the DM's ("We only supply setting and consequence"); BEHIND THE SCENES; UNPREDICTABLE IN PROSPECT, LEGIBLE AND COHERENT ON SCRUTINY; THE HEARING WEEK (requirement 24); THE EVIDENCE LAW; THE WORLD HOSTS THE CAMPAIGN, NEVER COMPETES; THE ORDINARY LIFE IS THE DM'S READING OF THE DOSSIER (CHAIR-NOTES 20: every felt output lands as a settlement state or a named person's deed). The court's WAY OF WAR (the owner's 12:29 word, `DESIGN_FP_ARCH_WS.md`, compiled beside this volume) is the PRIOR of every motive below.

## THE ANSWER IN ONE PARAGRAPH (for the DM)

Every thing that moves on your map — an army, a part of an army sent ahead or left behind, a town's riders, a gang or a flock or a pack, a named traveller, a fleet — makes at most ONE movement choice a week from a short closed list: keep its course, hold, hide, lie in wait, double back, shadow, feint, force the pace, split, regroup, reroute, or (only when beaten) retreat. Whoever commands it chooses, on what it BELIEVES about its pursuers, its quarry, its clock, its roads, its food and its own strength, leaning the way its court makes war; every choice has a reason from a closed list and a price (weeks against the campaign's clock, worn men and horses, a part sacrificed, a risk of being found or of a lie exposed). The other side never sees the reason — it sees what the unit appears to do, or nothing at all, and decides for itself what that means. Nothing here is a new road, a new speed or a new battle: units still travel the one road network at the one pace the season allows; horses quicken a rider only on good roads and never on the hidden ways; an army moves at its slowest member unless its horse rides ahead; a ship never splits. Nothing is ever a hearing of its own — when two moving things meet, the meeting is the hearing its owner already registered, in its week. You see deeds ("Kell's column turned back at the ford"); you see the reasons only when you look at that unit's own page; you can set any unit's choice yourself.

---

## §0 WHAT THE CODE ALREADY IS (master `81f1cd963`; measured FIRST — `cure/L-MG.md` §1; CONFIRMED unless marked)

### 0.1 The substrate

| `path :: symbol` | What it is (the quoted line) | What it gives MG | Gate / preset | Host eff. lines (ceiling 800) | Persisted / derived |
|---|---|---|---|---|---|
| `spatial/armyTransit.js :: ArmyTransitRecord`, `armyRecordOf` | the army's transit record: `armyId` "the owning settlement id (one army per settlement)", `path`, `departTick`, `arrivalTick`, `position01`, `strength`, `readiness`, `supplyQuality`, `funding`, `beliefStaleness`; `armyRecordOf` rebuilds it FIELD BY FIELD | a column's place, path, clocks, aggregate strength — and the proof that an unknown key (a verb) is DROPPED on the next normalize (MG15) | spatial canon (`armyTransitActive`: "`Number.isInteger(marker) && Number(marker) > 0`") | 340 | persisted (`spatialLedgers.armyTransit`) |
| `spatial/armyTransit.js :: stepArmyPosition` | "`const position01 = span <= 0 ? 1 : clamp01((t - depart) / span);`" | position is LINEAR IN TIME: every stand-still is a clock shift, every change of path or pace a re-plan (MG1) | — | 340 | derived |
| `spatial/armyTransit.js :: armyMarchWeeks` · `ARMY_TRANSIT_TUNING` | "`Math.ceil((base * T.ARMY_SPEED_FACTOR) / Math.max(0.1, speedMult))`"; `ARMY_SPEED_FACTOR: 1.5` "An army marches SLOWER than a courier/caravan: baggage, foraging, formation"; `READINESS_SPEED_GAIN: 0.4`; `MAX_MARCH_WEEKS: 52` | the slowest-member law is ALREADY the landed factor (the train is in it, MG8); the forced march reuses the readiness ceiling (§6.4) | — | 340 | derived |
| `spatial/armyTransit.js :: retreatRoute` · `planMarch` · `detectCollisions` · `resolveFieldBattle` · `effectiveFieldStrength` | `retreatRoute` = "`chooseRoute(digest, worldState, fromId, homeId, riskTolerance, season)`"; collisions "share a common region in their REMAINING path and their transit windows overlap"; `FATIGUE_MAX: 0.3`, `GROUND_ADVANTAGE: 0.25` | the retreat (read, never chosen by MG); the ONE contact predicate a wing reuses (§6.3); the battle inputs a lie-in-wait leans | — | 340 | derived |
| `spatial/armyTransit.js :: siegeArrivalGate` (header) | "departTick / arrivalTick are frozen when the record is seeded … MAX_MARCH_WEEKS is strictly BELOW the war layer's SIEGE_MAX_AGE ceiling" | PS9's Bound 1 (`arrivalTick − sinceTick ≤ SIEGE_MAX_AGE − 1`, `SIEGE_MAX_AGE = 60`) bounds every week a verb costs a column | — | 340 | — |
| `worldPulse/armyTransitKernel.js` | the per-tick army stepper ("`const advanced = stepArmyPosition({ ...activePrior, strength, readiness, supplyQuality, funding }, stepTick);`") | the ONLY place a column's position is computed — reached through PS's car-0 stage, never directly | spatial canon | **798 — AT THE CEILING** | — |
| `spatial/armyTransit.js :: ARMY_ROLES` · `spatial/navalLayer.js :: navalRecordOf` · `navalTransitLedger` · `convoyTransitWeeks` · `stormMultOf` · `planConvoy` · `planBlockade` | roles `march · reinforcement · retreat · convoy · blockade` (CONVOY/BLOCKADE "ride the SIBLING `navalTransit` ledger"); a naval record is an army record + "`mode: 'sea'`", `ownerId`, `cargoId`, `cargoStrength`, `targetId` — NO SHIP COUNT | the fleet class's record (§7); the blockade IS a landed lie-in-wait at a port's approaches; the storm read prices a forced sail | spatial canon | `navalLayer.js` 278 · `navalKernel.js` 367 | persisted (`spatialLedgers.navalTransit`) |
| `worldPulse/routeNetworkConsumersTransit.js :: livedLegTicks` · `gradeLegMultiplier` · `ROUTE_TRANSIT_TUNING` | "`namedPersonLegTicks({ nominalWeeks: nominal, gradeMultiplier: gradeLegMultiplier(input.hop.grade), … })`"; `GRADE_LEG_MULTIPLIER` `{ highway: 0.75, road: 1, track: 1.5, hidden: 2 }`; "THE LEG RECORD IS H3'S SHAPE, EXACTLY: `{ fromId, toId, departTick, arrivalTick, hidden? }`. Not a superset." | the ONE leg price a person, a patrol detachment and a small wing travel by; the riding ratio composes into its multiplier (§8); a verb can NEVER ride the leg (MG15) | `routeLifecycleEnabled` (virtual) for the lived arm | 198 | leg persisted on its owner's record |
| `worldPulse/routeNetworkConsumers.js :: TRAVELLER_KINDS` · `HIDDEN_PATH_KINDS` · `mayUseHiddenPaths` | "`['army', 'caravan', 'covert_envoy', 'smuggler', 'wanderer']`"; hidden kinds "`['covert_envoy', 'smuggler', 'wanderer']`"; "fails CLOSED" | the access law every hidden-way verb obeys (PS's one widening by might, BD's `body` token) | — | 184 | derived |
| `spatial/modeSpeeds.js :: MODES` · `MODE_SPEEDS` · `distanceRead.js :: weeksPerCostOf` | "`['foot', 'cart', 'river', 'coastal', 'sea']`"; `foot: 150` "the base denomination"; `cart: 110` "Loaded wagons and ox-teams, which are slower than the walker who drives them"; "`if (mode == null \|\| read.kmScale == null) return read.weeksPerCost;`" | THE ONE MODE TABLE — the mount's speed lives here as a `horse` row (routed to WY, §8); `cart` < `foot` is the owner's "the train is slower than foot", already landed; the mode is IGNORED in every world today (`kmScale` never written) | data-gated (`kmScale`) | `distanceRead.js` 544 | derived |
| `display/forceComposition.js :: UNIT_TYPES` · `deriveForceComposition` | "`'baggage_train', 'bowmen', 'heavy_horse', 'levy_spears', 'men_at_arms', 'siege_crew', 'war_mages'`"; "these are authored proportions, and they move no engine number because nothing engine-side reads this file"; "Composition is derived FROM strength and NEVER feeds it" (§746.2) | the ONLY arms composition in the tree is a DISPLAY clerk — an army's horse is unknown to the engine (⛔ S-MG-1) | — | display | derived, display-only |
| `data/institutionalCatalog.js` (the stabling rungs) · `data/supplyChainData.js` · `worldPulse/tradeSalience.js :: MATERIEL_GOOD_PATTERN` | "`name: 'Stable district', desc: 'Concentrated stabling, horse trading, and farriery. Serves merchants, military, and travelers needing fresh mounts.'`" (hamlet `Stable yard`, village `Stable master`); the chain's members `'Stable yard', 'Stable master', 'Beast trainers'` → "`outputs: ['Cavalry mounts', 'Draft horses', …]`"; the materiel pattern "`…\|mount\|cavalry\|warhorse\|…`" | the stabling PRESENCE a rider departs from; the mounts as goods; NO stock, NO capacity field (⛔ S-MG-3) | — | data | catalog (static) |
| `worldPulse/habit/habitCurve.js :: habitFactor` · `habit/habitLedger.js :: writeHabits` · `habit/habitGate.js :: habitsActive` | the habit curve and its one writer; "`return rules.habitConditioningEnabled === true;`" | "a general who always feints is read" — the habit term of every roll (HB's curve, never a second learning law) | `habitConditioningEnabled` (virtual) | — | persisted (`habits`) |
| `components/new/tabs/WarTab.jsx` (the believed region) | "`const believedRegionId = currentRegion(stepArmyPosition(ours, believedTick));`" | the landed idiom for a column's place AS BELIEVED at a stale tick (the umbilical) — reused for the OWN court's picture of its own column | UI | — | derived |

### 0.2 The designed infrastructure this volume rides (PLAUSIBLE until each owner's car-0)
- **THE TRANSIT LEAF STAGE** (PS §4.1): `worldPulse/transitLeafStage.js :: TRANSIT_LEAVES`, a CLOSED registration list in PS's order (passage border → approach fort → screen → `armies_meet`), "one hold per record per tick (the first registrant in this order to hold wins)"; THE ONE HOLD HELPER `holdBeforeNode(record, tick, hold)` in modes `border · freeze`, bounded by Bound 1 always and Bound 2 only for PS's three capped registrants; car-0 extracts ~42 eff from `armyTransitKernel.js`. MG is its FIFTH registrant (§3.2; routed to PS — the order is written once, in PS §4.1).
- **THE RE-PLAN** (PS §4.1 step 6): "sets `departTick` to this tick and `arrivalTick` to this tick + `armyMarchWeeks(w, readiness)` … (so `position01` restarts at 0 on the new path — the unit never jumps), banks the holds so far on the march row … BANKS the column's field-battle travel inputs" (`fatigueFloor01`, `groundCap01`); `distanceRead.js :: routeAvoiding` (PS §5.3). MG asks PS to name it as the stage's SECOND helper, `replanFromNode` (§3.2; routed).
- **THE QUIET WAY** (PS §5.6): a unit at or below the capacity band `modest` may walk a hidden way its court KNOWS (`knownTrailsOf`, BD §2.3), priced at `gradeLegMultiplier('hidden')` 2, by PS's one widening `travellerMayWalk(kind, hop, { might })`.
- **THE BODIES** (BD §2.2, §4, §5.3, §6.7): `spatialLedgers.bodies` records with `where`, `might` (`thin · modest · capable · strong · formidable`), `bodySupply01`, `bodyCohesion01`, `choice: { word, tick, reasons }`; ONE weekly act choice (`bodyChoiceSet`, stream `bodies:<bodyId>:<tick>`) and ONE route choice (`bodyRouteChoice`, stream `bodies:route:<bodyId>:<tick>`); a body "advances at most one hop per week"; a gang's FISSION (§6.7).
- **THE PATROLS** (PR §2): placed weekly, never stepped (PR1); `PATROL_STATES = on_round · converging · engaged · escorting · looking · resting`; `DETACHMENT_AIMS = clear · screen · pursue · escort · look`; "A rider OUTMATCHED … SHADOWS — follows the prediction and reports" (PR §5.5, prose); THE ONE PLANNING READ `believedWatch(...) → { watch01, known, phase? }` (PR §8.3); THE ONE ENCOUNTER LAW `patrolEncounter` (PR §8.1, truth); `predictedPlaceOf` (belief).
- **THE CHAMPIONS** (CH §4–§5): a paragon's ONE weekly AIM in `paragonStage.js :: advanceParagons`, registered in RN's ONE PERSON STAGE; its leg by `planWanderLeg` → `openNamedPersonLeg`; the patron deity's lean enters CH's one roll (L-CH-PD, the owner's 12:44 word) — MG never reads the deity.
- **THE GENERALS** (`DESIGN_FP_GENERALS.md` G2): "`boldness01 = riskToleranceOf(npc)` (0.35 timid … 0.9 bold)"; `DIAL_BANDS = ['timid','wary','steady','bold','reckless']`; "every dial acts on `readBeliefStrength(home, enemyHome, worldState, truth)` and `believedOpponentStrengthBand`, NEVER on truth"; the ENGAGE/AVOID point already "marks the column RETREATING for the tick".
- **WAR CIRCULATION** (WC §1.4.1, §1.7): THE ONE-ARMY LAW ("an army remains ONE deployment record keyed by its home settlement id"; "Free units (1.7) are the ONE exception"); the ENDURANCE_ENVELOPE (a duration: "(carried supply + relay throughput) / burn rate"); free units' `rejoin` (a TAG event, free_unit → block) and `merge`; the SECOND totality manifest for COUNTS-MOVERS (WC-11's opener).
- **THE ONE SIGHTING STORE** (fold §3.3.16 ↳ P4 (8)): `spatialLedgers.sightings`, writer `recordSighting`, keyed court × subject `{ kind: 'menace' | 'body', id }`, rows `{ id, mightBand, tick }` — "a BELIEF record written at the tick of seeing".
- **THE MAP CONTRACT** (`refs/MAP-REPLY-HIDDEN-WAYS-2026-10-18.md`; the host document): the rung words `wild · way · trail · track · road · highway`; junctions named; door 1 — "the host's simulator never reads the map's geometry"; H17 "Send presentation messages: movers and embattlement phases, projected for the audience; the DM's believed view where belief is recorded"; H9 the events window; H23 the lens window (rows incl. "travellers, … columns").

### 0.3 The binding prior words
The owner's four words above (sacred). The 2026-10-16 delegation ("i want you to rule on the decisions. i give my permission now and for whatever is emergent"), the 10-17 program word ("I defer all judgement and decisions to you") and the 10-20 words ("I give all permissions now and in the future"; "i defer everything to your judgemetn") — every MG ruling is by delegation and vetoable; the gate list (push · merge · deploy · migration · dispatch) and every PERSISTED SHAPE stay the owner's. L-BD 11i (the owner's 22:5x word: a military unit on the ways "whether in pursuit, to take an enemy by surprise, to escape, or any other situation") is carried here as the column's way motives. L-BD 20 / 39 (pursuit and evasion as two learners on HB's one law) are the pursuit and evasion reads.

### 0.4 Population facts that bound the design
Armies are FEW ("one per settlement", `MAX_ARMIES: 128`; the belief envelope 5–30 settlements); a march is ≤ 52 weeks and a campaign ≤ 59 (Bound 1); bodies are capped per country (BD §3.4); patrols are a town's single-digit halves (PR §0.4); named travellers are tens. A weekly roll per moving unit is therefore tens of draws a week — the same order as BD's bodies and CH's paragons (CH §17).

### 0.5 What the measurement changed (each bracketed where it sits)
(a) No verb on a landed record: the army normalizer drops unknown keys and the H3 leg is "not a superset" — MG keeps its posture on its own ledger (MG15). (b) An army cannot split into two army records (the one-army law) — a split makes a WING on MG's ledger (§6). (c) The default verb is `keep_course`, never `advance` (the product's word for the DM's time advance). (d) The regroup is `regroup`, never `rejoin` (WC's tag event). (e) The army's horse is unknown to the engine (⛔ S-MG-1); the sea fleet has no ship count (⛔ S-MG-2); the stabling has no stock (⛔ S-MG-3). (f) The mount's pace already has its one home — WY's mode table (`cart` slower than `foot` is landed) — so MG mints no speed number (§8). (g) The forced march needs no new speed number either: it marches at the drilled ceiling of the landed readiness term (§6.4).

---

## §1 THE LAWS (MG1–MG15)

**MG1 — ONE GRAMMAR OVER ONE PHYSICS.** A verb never prices travel itself. Every stand-still (hold · hide · lie in wait) is THE ONE HOLD HELPER's FREEZE (PS9); every change of path or pace (double back · reroute · forced march) is THE ONE RE-PLAN from the node the unit stands in (PS §4.1 step 6); every leg is WY's leg (`livedLegTicks`, `armyMarchWeeks`, `convoyTransitWeeks`), every season the one seasonal law (SLOW, NOT SEVER), every hidden way the ladder's one price 2. MG adds no speed, no road, no clock.

**MG2 — ONE CHOICE PER UNIT PER WEEK; MACRO OVER MICRO.** A unit holds at most one movement verb a week, chosen once and applied by its class's landed mover; nothing is stepped finer than its landed stepper steps it. A long advance is N weekly calls, each choosing on that week's belief.

**MG3 — CLOSED VERBS PER CLASS, CLOSED MOTIVES PER VERB.** The verb set (`MOVEMENT_VERBS`, §2.3) and each class's admitted subset (§3.1) are closed; every verb carries a CLOSED motive set (`MOVEMENT_MOTIVES`, §4), each motive a NAMED believed-situation read with a bounded weight, its counterforce and its receipt line. Both grow only by the owner's word.

**MG4 — WHOEVER COMMANDS CHOOSES, ON BELIEF, BY THE ROLL ITS CLASS ALREADY HAS.** A column's general by the generals' dials; a paragon by CH's one roll; an envoy or operative by its errand's own mover; a body by BD's choice; a patrol by PR's aims; a fleet by its owner's admiral-less court (the court's way of war alone). MG never adds a second roll where one exists: for bodies and patrols it only NAMES the verb their own choice already made (§3.5–§3.6). Every input is BELIEF (Law One); the truth resolves only at contact.

**MG5 — THE TWO PICTURES.** The other side never sees a motive. It sees the BELIEVED VERB — or nothing, for a unit hidden from it — and assigns a believed motive from the same closed set by ITS OWN roll on ITS OWN picture; its answer is its own verb. An invitation ("make the pursuer split") may be declined; nothing is a forced reaction (the owner's 12:25 word, item 9b).

**MG6 — A VERB IS NEVER A HEARING.** Its CONTACTS are the kinds their owners already registered (`armies_meet`, `menace_met`, `patrol_engages`, `bodies_meet`, `passage_at_the_border`, `armed_incursion`, `raid`, `traffic_waylaid`, the site kinds), heard in their week (requirement 24). MG registers no engagement kind.

**MG7 — THE CARRIAGE LIMIT (the owner's 12:41 word).** A SHIP — at sea or in the air — is an atom of movement and never splits. A FLEET splits only along ship boundaries, never below one ship, and regroups at a named harbour, anchorage or sea node. A column CARRIED by ships takes the carriage's verbs while aboard and its own on landing.

**MG8 — THE SLOWEST MEMBER (the owner's 12:49 word).** A column moves at its slowest member: the landed `ARMY_SPEED_FACTOR` 1.5 already prices "baggage, foraging, formation", so a whole army is never faster for its horse. Only a part that LEAVES THE TRAIN — a wing (§6) — moves faster, by the size and the pace it then has.

**MG9 — THE MOUNT IS A PACE, NEVER A SECOND SPEED LAW.** A rider's gain is ONE ratio read off WY's one mode table (`MODE_SPEEDS.foot / MODE_SPEEDS.horse`, the `horse` row routed to WY), applied only on `road` and `highway` rungs; a rider walks on `track` and on a `trail`; a horse is BARRED from a way at `wild` or `way` (the quiet crossing is on foot). Mounts are a status of a person or a wing, never a field of the army record.

**MG10 — EVERY VERB HAS ITS PRICE (requirement 2).** Weeks against the campaign clock (Bound 1) for every stand-still and every backtrack; attrition and fatigue for the forced march; cohesion and a sacrificed part for the split; exposure for the feint (a credibility deed) and the hide (the look); the HABIT for repetition ("being known is the price", HB). No motive moves every roll: each weight is bounded `[0.25, 4]` and named.

**MG11 — THE MOUNT RULE.** Zero lines in `pulseKernel.js` (1581), `applyWorldPulse.js` (907), `warTermination.js` (818). `armyTransitKernel.js` (798) takes NOTHING of MG's: MG registers in PS's transit leaf stage (car-0's one call, PS11). `navalKernel.js` (367) takes ONE stage call and its import (MG-7). Persons ride RN's ONE PERSON STAGE (no host line of MG's). Bodies and patrols: no host line.

**MG12 — THE PHYSICAL WORLD IS A SEAM.** MG is a spatial program with an honest aspatial arm: without a canonized digest there are no positions — no verb is chosen, persons hop the relationship graph on their landed adapter (`UNPRICED_LEG_WEEKS`), and the dossier reads exactly as today.

**MG13 — BEHIND THE SCENES.** The surface shows DEEDS ("Kell's column turned back at the ford"); scrutiny shows the verb and its motive, on the unit's OWN court's page (the enemy's dossier says what it believed, never what was true); the machinery (weights, draws) is never pushed. A hidden unit is drawn for the DM only, behind a toggle; the map never computes movement (door 1).

**MG14 — THE DM'S HAND IS TOTAL.** The DM may set any unit's verb (`MOVEMENT_ORDER`, §5.5), pin it, or undo the week; requirement 24's three choices bind every contact a verb produces.

**MG15 — ONE RECORD PER UNIT; MG WRITES ITS OWN LEDGER ONLY.** MG never adds a field to a landed record (the army normalizer drops it; the H3 leg is "not a superset"). Its posture and its wings live on ONE drop-when-empty ledger, `spatialLedgers.movement`, with ONE writer, `movement/movementLedger.js` (§2.2) — THE OWNER'S persisted shape, declared.

---

## §2 THE ONTOLOGY

### 2.1 The unit, its class and its key
A UNIT is anything one verb moves. Its CLASS (`MOVEMENT_CLASSES`, closed): `column` (an army's transit record — `march`, `reinforcement`; a `retreat` record is read, never chosen for) · `wing` (an army's part on MG's ledger, §6) · `patrol` (PR's placement and detachments) · `body` (BD's record) · `person` (a named traveller on a leg: envoy, operative, paragon, courier, general riding apart) · `fleet` (a `navalTransit` record, `convoy` or `blockade`) · `air_fleet` (LG-2's stored commitment, when LG lands). A retained corps (CH §16b) and a free unit (WC §1.7) move by WC's free-unit stepper (WC-10..12, unbuilt) and take the `column` row of every table in that stepper's commit (routed). Its KEY: the unit key of PS §2.1 for a column and a corps; `wing:<armyId>:<n>`; `patrol:<detachmentId>` (PS's spelling); the body's own `body:<kind>:<hash>`; `person:<wnpcId>`; `fleet:<navalKey>`.

### 2.2 The persisted shape — ONE ledger, `spatialLedgers.movement` (NEW; THE OWNER'S, ⭐ OD-MG-1)
```
spatialLedgers.movement = {                 // drop-when-empty; the spatialLedgers conditional idiom ("ZERO eager first-paint bytes")
  postures: { [unitKey]: {                  // a row exists ONLY while the unit holds a verb other than `keep_course`
    verb,                                   // MOVEMENT_VERBS (§2.3) minus `keep_course` and `retreat`
    since,                                  // the tick the verb was first chosen (its dwell, its bound, its habit credit)
    motive,                                 // MOVEMENT_MOTIVES — the TRUE motive (the unit's own court reads it; no other reader)
    toward?,                                // `feint` only: the node the unit DISPLAYS as its heading; `shadow`: the quarry ref; `regroup`: the node
    reasons,                                // ≤ 3 { word, mult } — the roll's receipt (the BD idiom)
    causedBy,                               // requirement 20: the deed, sighting or hearing that raised the motive
    by?: 'dm',                              // MOVEMENT_ORDER: the DM set it (no roll while it stands)
  } },
  wings: { [wingKey]: {                     // ≤ 2 per column (DRAFT); §6
    parentKey, ownerId, share,              // share ∈ WING_SHARES ('a_third' | 'a_half'); the wing's strength = share × parent's at the split
    pace,                                   // WING_PACES: 'column' | 'light' | 'riding' (§6.2)
    path, departTick, arrivalTick, position01, strength, readiness, supplyQuality, funding, beliefStaleness, lastTick,  // armyRecordOf-shaped (§6.3)
    regroupAt?, sinceTick, causedBy,
  } },
  feints: [ { unitKey, toward, sinceTick, exposedAt?, causedBy } ],   // the ring of feints shown (≤ 16, newest first) — the exposure's one latch (§5.4)
  seq,
}
```
ONE WRITER: `src/domain/movement/movementLedger.js` (normalizer — field-closed and fail-closed, the WC-0E lesson —, mint, every field). Requirement 23: `postures` bounded by the units (one row each, dropped at `keep_course`, at the unit's end or arrival); `wings` ≤ 2 per column and ≤ `MAX_ARMIES`; `feints` ring 16.

### 2.3 The closed vocabularies (each `rg -w -i` on master `src`, `tests`, the worktree's `docs` and the ledger's `docs` — `cure/L-MG-probe/tokens-1.out`, `tokens-2.out`)
- `MOVEMENT_VERBS` (13): `keep_course` (the default; never stored) · `hold` · `hide` · `lie_in_wait` · `double_back` · `shadow` · `feint` · `forced_march` · `forced_sail` · `split` · `regroup` · `reroute` · `retreat` (LANDED as `ARMY_ROLES.RETREAT`; MG reads it as a verb word, never chooses it). [REFINED 2026-10-20 (fp-final P6) — the brief's `advance` is `keep_course`: `advance` is the product's word for the DM's time advance (`heraldCommandSession.js`: "`const TIME_LENSES = new Set(['advance', 'campaign']);`"; `UndoHistoryPanel.jsx` "`kind: 'advance'`"), the very surface a moving unit's line is read on; the brief's `rejoin` is `regroup`: `rejoin` is WC's people-ledger TAG event ("`'rejoin'`" in `peopleLedger.js`, free_unit → block), a different act (headcount between pools); the brief's `forced_march` for ships is the separate `forced_sail` (the owner's carriage word; its price is the storm, not the march's attrition).]
- `MOVEMENT_CLASSES` (7): `column · wing · patrol · body · person · fleet · air_fleet`.
- `MOVEMENT_MOTIVES` (closed, §4; 44 members).
- `WING_SHARES` (2): `a_third · a_half`. `WING_PACES` (3): `column · light · riding`.
- Reused, never re-minted: the might ladder `thin · modest · capable · strong · formidable` (MN's `STRENGTH_BANDS` keys); the rung words (the map contract); PS's hold modes; `DIAL_BANDS` (generals); BD's choice words; PR's states and aims.
- Homonyms registered (§16): `hold` (fold §5's `hold` row — MG's verb IS PS's march hold, one meaning on the movement surface); `reroute` (`strategyMoves.js` "`'reroute',`" is a court's TRADE move — compound-scoped by the field `verb`); `hide` (goods "`'hide'`"; IN's HIDE trade toll); `shadow` (the town map's "`op: 'shadow'`" render op); `split` (`heraldRouting.js` "`traditions: 'split'`"); `feint` (prose only in `design/organic/ink.js`); `wing` (prose only); `riding` (prose only).

### 2.4 The derived reads (pure; leaves under `src/domain/movement/`; each gates on its flag read `=== true` and returns the dark answer otherwise)
- `movementClassOf(worldState, unitKey) → MOVEMENT_CLASSES member | null`.
- `verbsAdmitted(worldState, snapshot, unitKey, tick) → string[]` — §3.1's table narrowed by the unit's facts (might vs the capacity band; carriage; rung; riding).
- `motivesOf(worldState, snapshot, unitKey, tick) → [{ motive, verb, mult, read, causedBy }]` — §4; every input a BELIEF read named in the motive's row.
- `movementChoiceOf(worldState, snapshot, unitKey, tick, rng) → { verb, motive, reasons, toward? }` — §5's roll (columns, wings, fleets, and persons through their mover).
- `postureOf(worldState, unitKey) → { verb, since, … } | { verb: 'keep_course' }` — the stored row, else the default.
- `bodyVerbOf(body) → verb` · `patrolVerbOf(patrol | detachment) → verb` — the NAMING maps of §3.5–§3.6 (no roll).
- `believedMotiveOf(worldState, snapshot, observerId, unitKey, tick, rng) → { motive, verb } | null` — the OTHER court's inference (MG5, §5.3): its own roll on its own picture; `null` when it sees nothing.
- `believedHeadingOf(worldState, observerId, unitKey, tick) → { toward, source, tick } | null` — the newest sighting's heading (§5.4) ∨ the war's declared target ∨ null; NEVER the unit's true path.
- `ridingOf(worldState, snapshot, unitKey) → boolean` · `ridingLegFactor(rung, riding) → number | 'barred'` (§8).
- `wingsOf(worldState, armyId) → WingRecord[]`.

---

## §3 THE VERBS BY CLASS — what each verb DOES, through whose writer (MG-1 … MG-5)

### 3.1 The admission table (✓ chosen by the class's roll · N named from the class's own choice, no MG roll · — never)
| Verb | column | wing | patrol | body | person | fleet | air_fleet | What it does (the one writer) |
|---|---|---|---|---|---|---|---|---|
| `keep_course` | ✓ | ✓ | N (`on_round`, `converging`, `escorting`, `looking`) | N (`move`, `roam`, `raid`, `smuggle`, `feud`, `confront`, `preach`…) | ✓ | ✓ | ✓ | nothing: the landed stepper steps it (no row stored) |
| `hold` | ✓ | ✓ | N (`resting`) | — (a body that stays chooses no move) | ✓ at rest only | ✓ at a port or anchorage | ✓ moored at a dock | column/wing/fleet: `holdBeforeNode(record, tick, { mode: 'freeze' })` (Bound 1); person: opens no leg this week (a walker MID-ROUTE "stays on the leg", `advanceLivedTraveller`) |
| `hide` | ✓ only at or below `modest` might | ✓ same | — | N (conclave `hide`; beast `lie_up` at its lair) | ✓ at rest, in a town or on a way | — (a fleet at sea is seen) | — | the FREEZE + the unit absent from every OTHER court's picture until LOOKED FOR (PR's look, a site's sighting) or met (the encounter law reads its cover); a column above `modest` cannot hide ("too many to hide", PS §5.6) |
| `lie_in_wait` | ✓ at a junction, ford, pass or node | ✓ | N (`screen`) | N (a gang's `raid` on traffic at a junction; a beast's `prowl` on a road) | — | N (the landed `blockade` role) | — (ground-force immunity, LG-3) | the FREEZE at the chosen place + ONE bounded lean on the FIRST contact's battle inputs that week (§6.5) |
| `double_back` | ✓ | ✓ | — | — | ✓ | ✓ on the lane | ✓ | the ONE RE-PLAN to `path[idx−1]` then onward (a week lost, the cover unchanged) |
| `shadow` | ✓ | ✓ | N (a `pursue` detachment whose band is below the quarry's believed might — PR §5.5's "SHADOWS") | — | ✓ (an operative's tail, ES) | ✓ on the lane | ✓ | the ONE RE-PLAN each week toward the quarry's BELIEVED place (`believedHeadingOf`; for a body PR's `predictedPlaceOf`), never entering its node: contact is never sought |
| `feint` | ✓ | ✓ | — | — | ✓ (a covert operative's false road, ES) | ✓ | ✓ | no change of path: the posture's `toward` is the heading SHOWN to every sighting this week (§5.4) |
| `forced_march` | ✓ | ✓ | — | N (`flee`) | ✓ riding only | — | — | the ONE RE-PLAN at the drilled ceiling (§6.4); attrition and fatigue banked |
| `forced_sail` | — | — | — | — | — | ✓ | — | the naval re-plan at `convoyTransitWeeks(base, 1)` with the storm's risk (§7.2) |
| `split` | ✓ (`wingsEnabled`) | — (a wing never splits) | N (PR's `disperse` — an EVENT, never MG's) | N (BD §6.7 fission) | — | ⛔ S-MG-2 | ✓ along commitments (LG-2) | §6: a WING minted on MG's ledger, its strength debited from the parent |
| `regroup` | ✓ | ✓ | N (PR's grouping) | N (BD's `merged`) | — | ⛔ S-MG-2 | ✓ | §6: the wing's strength credited back at the named node; the wing row dropped |
| `reroute` | ✓ | ✓ | — | — (BD's route choice IS the reroute) | ✓ | ✓ | ✓ | the ONE RE-PLAN over `routeAvoiding(digest, here, dest, [avoided])` re-scored as `chooseRoute` scores (PS §5.3) |
| `retreat` | read | read | — | — | — | read | — | the kernel's (COLLISIONS writes it); MG names it and never chooses it |

A carried column (a `convoy`'s cargo) takes the `fleet` column while aboard (MG7) and its own on landing (PS's incursion at the harbour gate).

### 3.2 The column — THE FIFTH REGISTRANT of THE TRANSIT LEAF STAGE (MG-1; routed to PS, the order's one author)
`movement/movementLeaf.js :: movementVerbLeaf` registers LAST in `TRANSIT_LEAVES` (after PS's border, ST's approach fort, PR's screen and WC Arc A's `armies_meet`) [REFINED 2026-10-20 (fp-final P6) — the brief left the place open; an IMPOSED hold (a border hearing, a fort, a screen, a contact) outranks a CHOSEN manoeuvre, and PS's law "the first registrant in this order to hold wins" then lets the commander re-choose next week on the new picture — no second order, no second hold arithmetic]. Per record, codepoint order by `armyId`, when `movementGrammarEnabled` is lit and the record is a `march` or `reinforcement` the tick has not already held: (1) read the posture row; a standing DM order wins (MG14); else (2) on the week the posture's dwell ends or a motive's read changed, roll `movementChoiceOf` (§5) on the stage's own rng child `rng.fork('movement')` (PS's no-`::` fork law); (3) apply through the two helpers only — `holdBeforeNode(record, tick, { mode: 'freeze' })` for `hold · hide · lie_in_wait`; **`replanFromNode(record, newPath, tick, { readiness })`** for `double_back · reroute · shadow · forced_march`, the SECOND HELPER the stage owns: PS §4.1 step 6's arithmetic extracted whole (`departTick := tick`; `arrivalTick := tick + armyMarchWeeks(w, readiness)`; `position01` restarts at 0; the march row banks `heldBefore`, `plannedArrival`, `pathSig`, `fatigueFloor01`, `groundCap01`; refused where it breaks Bound 1) [REFINED 2026-10-20 (fp-final P6) — PS's step 6 is written inside `passageBorderLeaf`; a second caller must not copy it (one re-plan law), so PS names it once as a helper; PLAUSIBLE until PS-0's car-0, ⛔ build-time STOP S-MG-a if it cannot be extracted without moving PS's behaviour]; `split` and `regroup` through `movementLedger.js` (§6); `feint` writes the posture only. (4) write the posture row (or drop it at `keep_course`). A refused hold or re-plan (Bound 1) leaves the column on its course and the posture `keep_course` with the reason `campaign_clock` on the receipt. With the flag dark the leaf returns its inputs by reference (byte-identical by construction).

### 3.3 The person — a word over the mover it already has (MG-4)
A named traveller's movement is its own mover's: a paragon's (CH §5, its ONE weekly aim in CH's one roll), an envoy's or operative's (the errand spine, ES; the leg by `openLivedLeg`), a general riding apart (the generals' `command` mission), a courier. MG adds NO pass of its own to RN's ONE PERSON STAGE: each mover calls `movementChoiceOf` at the moment it would open its next leg (AT REST — "at most one new leg opens"), and the verb maps onto what that mover does anyway: `keep_course` → the leg its plan names; `hold` / `hide` → no leg this week (a `hide` also marks the person absent from other courts' sighting writes while it lies low — ES's cover idiom, the covert operative's); `double_back` → a leg to the node it came from; `reroute` → the cheapest leg by its own believed watch (`believedWatch`, already CH's leg read); `shadow` → a leg toward the quarry's believed place, never into its node; `feint` → the posture's shown heading (a covert operative only); `forced_march` → a leg priced with the riding factor at the forced band (§8.4; a walker cannot force — `MIN_LEG_TICKS`). THE OPPORTUNITY's detour (`DESIGN_FP_ARCH_OP.md`, compiled beside this volume, `briefs/L-OP.md`) is a `reroute` whose motive is OP's, never MG's — MG names the verb, OP owns the reason and the roll (a cross-citation, routed to OP). The posture row is keyed `person:<wnpcId>`, never on the leg (MG15).

### 3.4 The wing — §6.

### 3.5 The body — NAMED, never rolled (BD's choice is the choice)
`bodyVerbOf(body)` maps BD's week (`record.choice.word` and the route choice's network) onto the grammar, for the map's verb word and the Why panel only: `move`/`roam`/`raid`/`smuggle`/`feud`/`confront`/`preach`/`supplicate`/`rally`/`recruit`/`bribe`/`defy` → `keep_course`; conclave `hide` and beast `lie_up` → `hide`; a gang's `raid` on traffic or a beast's `prowl` standing on a road's junction half → `lie_in_wait`; beast `flee` → `forced_march`; BD §6.7's fission → `split`; BD's `merged` (§9.1) → `regroup`; `scatter` → no verb (the body ENDS, BD's receipt). BD keeps its two rolls, its factors and its habits (`bodyHabitTilt`); MG adds no factor to them [REFINED 2026-10-20 (fp-final P6) — the brief's "a BODY by its weekly choice (BD §4)" read as a THIRD roll would break BD §4.1's "one choice per body"; the grammar is satisfied by naming].

### 3.6 The patrol — NAMED, never rolled (PR's aims are the choice)
`patrolVerbOf(p)` maps: `on_round` · `converging` · `escorting` · `looking` → `keep_course`; `resting` → `hold`; a `screen` detachment → `lie_in_wait`; a `pursue` detachment → `keep_course`, or `shadow` while its band is below the quarry's believed might (PR §5.5's "SHADOW AND GROUP", now a word on the map); `group` → `regroup`; `disperse` stays PR's EVENT. A patrol is placed, never stepped (PR1): no verb moves it [REFINED 2026-10-20 (fp-final P6) — the brief's "PR's shadow widened to every class" is carried as the `shadow` VERB for every class that moves itself; for patrols it remains PR's own outmatched pursuit, named].

---

## §4 THE MOTIVE TABLE (the owner's 12:25 word; items 9 · 9b · 9c · 9d)

Every motive is a BELIEVED-SITUATION READ that RAISES its verb in the commander's roll by a bounded multiplier `[1, 4]` (DRAFT, UNMEASURED, FP-46 roster) with its reason. The READ column names the read (L = landed at master; D = designed in the named volume, PLAUSIBLE until its car-0; ⛔ = no read exists — the motive is DARK until it does). Every receipt line obeys the Evidence Law (who, which power, what effect; no numerals); it is shown on the unit's OWN court's page; the enemy's dossier shows its believed motive instead (MG5). THE PRIOR of every row is the court's way of war, `wayOfWarOf(court)` (WS, §5.2).

| # | Verb | Motive (`MOVEMENT_MOTIVES`) | The believed read that raises it | What the unit wants | Its counterforce | Receipt (the unit's own court) |
|---|---|---|---|---|---|---|
| 1 | split | `sacrifice_rearguard` | a believed pursuer within a week behind (`believedHeadingOf` over the sighting store, D: MN ↳ MG widening; for a column the enemy record AS BELIEVED, the WarTab idiom, L) × the believed margin against it (`readBeliefStrength`, D: generals G2) below the engage band | the main body escapes; the rearguard holds the pursuers a week | the rearguard's strength is staked on a contest it is meant to lose (its losses are the kernel's `LOSER_MAX_LOSS`; its captives the custody slot's, ES-2b) | "Kell left a rearguard at the ford to hold Tolle's riders; the van went on to Ashby." |
| 2 | split | `invite_split` | the enemy's BELIEVED habit of dividing to pursue (HB person grain on the enemy general, `habitFactor`, D) × a believed pursuit (row 1's read) | dilution: draw the pursuer into dividing its strength | an invitation only — the pursuer's own roll may decline (MG5); a split column is weaker wherever the enemy does not divide | "Kell's column divided on the moor, hoping Tolle's host would do the same." |
| 3 | split | `gain_pace` | a CLOCK the whole column cannot meet at its pace (row 35's read) × a part that would meet it at the light or riding pace (§6.2) | the part arrives in time (a relief, a gate, a pass) | the main body is left slower and smaller; the wing arrives weaker than the whole | "Kell sent its lighter companies ahead to reach Varn before the gate was shut." |
| 4 | split | `forage_apart` | supply short of the stretch (`supplyQuality` L; WC's ENDURANCE_ENVELOPE D; the season L) | two smaller hosts feed on two stretches | two parts are two targets; a regroup costs a week | "Kell's host parted to forage the two valleys; it was too many to feed on one road." |
| 5 | split | `screen_flank` | a believed enemy on a parallel road (sightings, D) × the column's own road open | a wing watches the flank and warns | the screen is small and alone; a stronger enemy takes it | "Kell set a company on the hill road to watch for Tolle's horse." |
| 6 | split | `two_objectives` | the war's objectives (the deployment's target, L) × a second believed-weak place within reach (`believedOpponentStrengthBand`, D) | take both at once | each half is weaker than the whole at either | "Kell's host divided: one half to the siege of Varn, the other to burn the mill at Holt." |
| 7 | split | `hide_the_prize` | the general (or a carried captive or treasure) believed hunted (the generals' capture arm, D; G4) | the enemy cannot tell which band carries it | the prize's band is the smaller; if found, the whole deception is read (credibility, §5.4) | "Kell's captain rode with the smaller band; the banners went with the larger." (scrutiny, after the fact) |
| 8 | split | `take_the_way` | a hidden way the court KNOWS (`knownTrailsOf`, D: BD) whose capacity (`modest`) is below the column (L-BD 11i) | a way-sized band crosses unseen (PS §5.6) | cohesion and a week to part; the band is small where it emerges | "Kell sent a company by the goat path while the column kept the road." |
| 9 | split | `horse_ahead` | ⛔ S-MG-1 — the engine does not know an army's horse | the cavalry rides on at its own pace (the owner's 12:49 word) | — (dark until ruled) | "Kell's horse rode ahead of the column." |
| 10 | regroup | `mass_for_battle` | a believed contest within a week (row 1's read, or the target reached) | the whole strength at the contest | a week at the regroup node | "Kell's two halves met at Holt before the battle." |
| 11 | regroup | `end_deception` | the feint or the split's purpose spent (the posture's `since` × the believed enemy reaction, §5.3) | the parts become one again | a week | "Kell's columns joined again on the north road." |
| 12 | regroup | `rearguard_returns` | the rearguard alive and the pursuer believed stopped (sightings, D) | the rearguard rejoins the van | the week the van waited | "The rearguard came back to Kell's host at Ashby, fewer than it left." |
| 13 | regroup | `supply_restored` | supply restored on one stretch (row 4's read) | one host again | a week | "Kell's foragers rejoined the host once the valley was fed." |
| 14 | double_back | `shake_pursuer` | a believed pursuer (row 1's read) × a junction behind with a second road (the digest, L) | the pursuer overshoots | a week lost; the clock (Bound 1) | "Kell's column turned back at the crossroads; Tolle's riders went on past it." |
| 15 | double_back | `missed_junction` | a better road or a known way behind (`knownTrailsOf` D; `routeAvoiding` D) | take the road it passed | a week lost | "Kell's column turned back for the forest path it had passed." |
| 16 | double_back | `close_the_feint` | the column's own `feint` posture standing ≥ its dwell | turn from the shown heading to the true one | a week; the feint is read once the turn is seen (§5.4) | "Kell's column, seen marching on Varn, turned back toward Holt." |
| 17 | hide | `let_pass` | a believed stronger force on its road (`believedOpponentStrengthBand`, D) | let it pass unseen | weeks against the clock; found by a look, it is caught standing | "Kell's company lay in the woods while Tolle's host went by." |
| 18 | hide | `await_enemy_split` | an enemy believed about to divide (row 2's read, mirrored) | strike the smaller part after | weeks; the enemy may not divide | "Kell's company waited in the forest for Tolle's host to part." |
| 19 | hide | `wait_out_sweep` | a believed patrol sweep on its road (`believedWatch` with `phase`, D: PR §2.3, §8.3) | move between the visits | weeks; a habitual hider is read (HB) | "The Tolle band went to ground until Kell's riders had passed." |
| 20 | hide | `lie_up` | (a body's — BD's `lie_up`/`hide` choice, NAMED §3.5) | rest, breed, heal | BD's own | BD's receipt |
| 21 | hide | `lie_low` | an operative's cover believed thin (ES's suspicion read, D) | its cover recovers | the mission's clock | "Kell's agent kept to her lodging in Varn for a week." (scrutiny) |
| 22 | shadow | `keep_contact` | a quarry believed in reach (sightings, D; PR's `predictedPlaceOf` for a body, D) × the believed margin below the engage band | keep it in sight without a contest | the shadow's own weeks; a quarry that turns brings the contest anyway | "Kell's horse followed Tolle's column at a day's distance." |
| 23 | shadow | `wear_the_quarry` | the quarry's believed supply short (sightings' `mightBand` falling, D) | let hunger and the road weaken it | the shadow eats too | "Kell's riders kept on Tolle's heels until its men began to desert." |
| 24 | shadow | `learn_heading` | the quarry's heading unknown (`believedHeadingOf` null) | a heading for its court's picture (writes a sighting each week it sees) | exposure to a turn | "Kell's scouts followed Tolle's host until they knew it marched on Holt." |
| 25 | shadow | `escort_far` | a friendly column or caravan believed in danger (`believedWatch`, D) | guard at a distance | its own weeks | "Kell's riders kept a day behind the salt caravan." |
| 26 | shadow | `outmatched_watch` | (a patrol's — PR §5.5, NAMED §3.6) | keep the trail warm while the town groups | PR's own | PR's receipt |
| 27 | lie_in_wait | `ambush_crossing` | a believed enemy route through a junction, ford or pass ahead (sightings' heading, D; the digest's crossings L) × the court believes the enemy does not know the place watched (`believedWatch` mirror, D) | the first blow at a place of its choosing | weeks; a watched place turns the ambush round (L-BD 11i (v)) | "Kell's company waited at the ford; Tolle's column walked into it." |
| 28 | lie_in_wait | `cover_rearguard` | the column's own `split` with `sacrifice_rearguard` standing | the rearguard fights from cover | the rearguard is still staked | "Kell's rearguard held the ford from the alders." |
| 29 | lie_in_wait | `prey_on_traffic` | (a gang's or a pack's — BD, NAMED §3.5) | prey on a road | BD's own | BD's receipt |
| 30 | lie_in_wait | `raid_horse_lines` | an enemy believed riding (`ridingOf` on the enemy's believed composition — DARK with S-MG-1/S-MG-3) | take or kill its horses | weeks; a mounted enemy answers | "Kell's men fell on Tolle's horse lines at night." |
| 31 | feint | `draw_off_defender` | a target whose defenders would sortie toward a shown threat (`reliefAnswerOf`-shaped believing, D: PL) | the defenders leave the gate | the feint's weeks; exposure (§5.4) | "Kell's column marched on Holt to draw Varn's garrison out." (scrutiny) |
| 32 | feint | `misdirect_relief` | an enemy relief believed coming (PL's `reliefAnswerOf`, D) | the relief goes to the wrong border | as above | "Kell's march on the north border drew Tolle's relief away from Varn." (scrutiny) |
| 33 | feint | `invite_split_or_hold` | a believed pursuer (row 1's read) | the pursuer divides or waits on a false heading | the pursuer may read it (its habit read of this general, HB) | "Kell's host showed itself on the Holt road; Tolle's riders held at the bridge." |
| 34 | feint | `mask_objective` | the war's true target (L) × the enemy believed watching it (sightings of its own riders, D) | the true target is unready | weeks | "Kell's host marched toward Holt and fell on Varn." (scrutiny, after the fact) |
| 35 | forced_march · forced_sail | `beat_the_clock` | a CLOCK believed closing: a relief before a surrender (the siege's fall odds, L: `siegeFallOddsWordFor`), a gate before it shuts (PS's request clock, D), a pass before the season (the season L), Bound 1 itself (L) | arrive before the clock | attrition and fatigue (§6.4); a forced sail's storm risk (§7.2) | "Kell's relief marched day and night and reached Varn before it fell." |
| 36 | forced_march · forced_sail | `outrun_pursuit` | a believed pursuer closing (row 1's read) | outpace it | as above | "Kell's column forced the march and left Tolle's host behind." |
| 37 | forced_march · forced_sail | `surprise_arrival` | the target believed unready (`believedOpponentStrengthBand`, D) × the court's way of war shock-leaning (WS) | arrive before the target musters | as above; arrives tired | "Kell's host came on Holt a week before it was looked for." |
| 38 | hold | `await_regroup` | a wing of its own away (MG's ledger, D: §6) | the parts meet | the week | "Kell's host waited at Ashby for its companies." |
| 39 | hold | `await_season` | a ford in flood or a pass in snow on the next hop (the seasonal cost, L: `seasonalPathCost`) | cross when it is cheaper | the week, against the clock (SLOW, NOT SEVER: never a closure) | "Kell's host waited for the river to fall." |
| 40 | hold | `await_word` | an envoy ahead or a request pending (PS §6.1, D) | cross with leave | the week (PS9's bounds) | "Kell's host waited at the border for Holt's answer." |
| 41 | hold | `rest_and_refit` | fatigue high (`fatigue01` L / `fatigueFloor01` D) × supply restored at a friendly node | strength back before contact | the week | "Kell's host rested a week at Ashby." |
| 42 | reroute | `blocked_hop` | a refusal on the next hop (PS's `rerouted` road, D) | go around | the detour's weeks | "Kell's host turned aside from Holt's border." |
| 43 | reroute | `believed_ambush_ahead` | a believed watch or a believed enemy on the next hop (`believedWatch`, sightings — D) | avoid it | the detour's weeks; the belief may be false | "Kell's host left the valley road, fearing Tolle's riders at the bridge." |
| 44 | reroute | `better_way` | a cheaper road or a known way now believed open (`knownTrailsOf`, `routeAvoiding`, D) | a shorter or quieter road | the way's capacity; the risk of a watched way | "Kell's company took the drovers' path around Holt's watch." |

**`retreat`** carries no chosen motive: the kernel writes it (a lost contest, the general's ENGAGE/AVOID mark, the withdrawal homeostasis); MG names it with the kernel's reason. **Rows 20 · 26 · 29** are the bodies' and the patrols' own choices, named (§3.5–§3.6). **Row 9 · row 30** are DARK (⛔ S-MG-1, S-MG-3). Every other row's read is landed or designed; a motive whose designed read is unbuilt at its unit is dark at that unit (its factor reads 1) — never an invention.

---

## §5 THE COMMANDER'S ROLL AND THE TWO PICTURES (MG-1; the owner's items 9b · 9c · 9d)

### 5.1 The roll — the house idiom, one draw
`movementChoiceOf` scores each verb `v` the unit's class admits (§3.1, narrowed by `verbsAdmitted`): `score(v) = BASE[class][v] × Π motiveMult(m) × prior(v) × dial(v) × habit(v)` — (i) `BASE` DRAFT with `keep_course` dominant (a quiet week is the norm: a column keeps its course unless a motive stands); (ii) each motive of §4 whose read fires, bounded `[1, 4]`, its reason kept; (iii) THE PRIOR — the court's way of war (§5.2); (iv) THE DIAL — the commander's own: a column's general by the generals' `boldness01` (G2: a `bold` general weights `forced_march`, `lie_in_wait`, `split` for `gain_pace`; a `wary` one `hold`, `reroute`, `double_back`), a paragon's by CH's one roll (axes, habits, and the patron deity's lean carried INSIDE CH's roll — MG never reads the deity, L-CH-PD), an unnamed captain's by the court's ruling-seat axes; (v) THE HABIT — `habitFactor` on the commander's person grain (HB; `habitConditioningEnabled`, dark → 1): a verb used often is easier to choose AND easier for the enemy to read (MG10). Every factor except `BASE` is bounded `[0.25, 4]`; no motive and no habit decides alone (L-BD 39's balance). ONE pick by `weightedPick` on the stream `movement:<unitKey>:<tick>` (the pulse's PRNG forked by a stable key: consumption-independent, no other stream moves; the HBF row `movementChoicePick`, MG-1's commit). THE DWELL: a chosen verb stands `VERB_DWELL[v]` weeks (DRAFT: 1 for `hold`, `double_back`, `reroute`; 2 for `hide`, `lie_in_wait`, `shadow`, `feint`, `forced_march`) unless a motive's read flips — so a week does not flicker, and a long advance re-rolls on its own weeks.

### 5.2 THE PRIOR — the court's way of war (the owner's 12:29 word; WS)
`wayOfWarOf(court)` (`DESIGN_FP_ARCH_WS.md`, compiled beside this volume by L-WS; cited by its brief's design, PLAUSIBLE until WS's own text) returns the court's archetype; MG reads ONE bounded weight bundle per archetype over the verbs (DRAFT): `attrition` — `sacrifice_rearguard` and `split` readily, `hide` rarely; `harassment` — `shadow`, `lie_in_wait`, `double_back`, never seeks the field (`keep_course` into a believed contest down); `logistics` — `hold` at the ford, `forage_apart`, `rest_and_refit`; `shock` — `forced_march`, `surprise_arrival`; `fortress` — `hold`, `reroute` home; `coalition` — `await_regroup`, `await_word`; `raiding` — `split`, `take_the_way`, `lie_in_wait`. The bundle is WS's to name; MG's rows are the reading of it (routed to WS). The commander's dial deviates the prior; desperation (a believed margin below the engage band with the clock closing) flattens it toward 1 (the receipt names it).

### 5.3 THE OTHER PICTURE — the enemy infers (MG5)
When a court SEES a unit (its sighting written this week by a look, a patrol's report, a site, a spy, a column's own contact — the ONE sighting store), `believedMotiveOf` assigns the BELIEVED motive by THAT court's roll on THAT court's picture: the seen verb (or the believed heading, §5.4) × its believed situation × its HABIT READ of the seen commander ("a general who always feints is read": the observer's believed count of that general's exposed feints, HB's person grain read through the observer's own deed record, D) × its own dial; ONE draw on `movement:infer:<observerId>:<unitKey>:<tick>`. Its answer is its OWN verb next week (it may divide, hold, shadow, or ignore). Both pictures are belief; the truth resolves only at contact (the encounter law, the contest). A hidden unit is absent from the picture: there is nothing to infer.

### 5.4 THE FEINT AND THE BELIEVED HEADING — one writer
The believed heading of a seen unit is ONE field on the ONE sighting row: MG routes to MN (the store's owner) the widening `{ id, mightBand, tick, heading? }` with the subject kind `unit` beside `menace` and `body` (THE OWNER'S shape, ⭐ OD-MG-6; the store's one writer `recordSighting` writes it — MG never writes belief). A sighting of a unit records `heading` = the posture's `toward` when the unit is FEINTING, else the next node of its true path (what the watchers saw it march on). EXPOSURE — the feint's counterforce, IN's contradiction idiom ("a non-strength plant exposes by CONTRADICTION on a real fixture, not only by age", IN §J-INF-3): when the same court later sights the unit OFF that heading, or it arrives elsewhere, the feint is EXPOSED — `movementLedger.js` stamps `exposedAt` on the feint ring's row (one latch) and RN's deed source records the general's DECEPTION as a credibility deed (RN's one regard idiom; routed to RN: the deed word `feint_exposed`) — never a casus, never a grievance of MG's. `believedHeadingOf` reads the newest heading, else the war's declared target (public: the casus names it), else null — never the true path (K3: a court never reads another's truth).

### 5.5 THE DM'S HAND — `MOVEMENT_ORDER` (a realm verb; ≤ 4 dials; approval-routed; the edits-delta overlay; premium)
Dials: the unit · the verb (its class's admitted set) · `toward` (feint, shadow, regroup) · `until` (a week band). Writes the posture row with `by: 'dm'`; no roll while it stands; requirement 24's DM hand over every contact is untouched. Undo is the pulse snapshot (§13).

---

## §6 THE COLUMN'S WINGS — SPLIT AND REGROUP (MG-2; `wingsEnabled`)

### 6.1 Why a wing and not a second army
THE ONE-ARMY LAW stands (WC §1.4.1). A `split` mints a WING on MG's ledger — `wing:<armyId>:<n>`, `n ∈ {1, 2}` — never a second `armyTransit` record and never a free unit (a free unit belongs to no settlement; a wing stays under its court's command). Its STRENGTH is `share × parent.strength` at the split (`WING_SHARES` `a_third · a_half`, the commander's choice by motive: `sacrifice_rearguard`, `screen_flank`, `take_the_way` → `a_third`; `gain_pace`, `forage_apart`, `two_objectives`, `hide_the_prize` → `a_half`), DEBITED from the parent's aggregate `strength` through the stage's write-back (the leaf returns the parent with `strength − wing.strength`), and CREDITED back at the regroup (its own strength as it then stands). CONSERVATION PIN: `parent.strength + Σ wings.strength` equals the pre-split strength minus the losses the battle law wrote, on every tick. The roster (`deployment.blocks`, WC-6) is NOT split: a wing is a share of the aggregate, never a block fork (WC's forks stay news-gated, WC §1.5) [REFINED 2026-10-20 (fp-final P6) — the brief's "a column parts into way-sized bands" is built without touching the people ledger: no headcount moves between pools, so no tag event is minted].

### 6.2 The wing's pace — size and the train (the owner's 12:25 "unit size correlates to speed" and 12:49 "unless cavalry splits off")
`WING_PACES`: `column` — a wing whose might is above `modest` marches by `armyMarchWeeks` (a column is a column, the train goes with it); `light` — a wing at or below `modest` travels by the light-unit leg physics (`namedPersonLegTicks`, PR's detachment precedent: it leaves the train, so it no longer pays `ARMY_SPEED_FACTOR`) and may take a known way (PS §5.6); `riding` — a horse wing (⛔ S-MG-1 — dark until the engine knows an army's horse) by the light physics × the riding factor on road rungs (§8). No new speed number: the gain of splitting is exactly the landed gap between the column factor and the leg physics.

### 6.3 The wing moves and meets as an army does
A wing's record is `armyRecordOf`-shaped (§2.2) so the landed stepper steps it (`stepArmyPosition`; registered in WC's SECOND totality manifest for COUNTS-MOVERS, WC-11's opener — routed to WC) and the landed contact predicate reads it: MG's leaf runs `detectCollisions`' own test (shared region in the REMAINING path, overlapping windows) over (wings × hostile columns and wings) and hands each contact to WC Arc A's `armiesMeetLeaf` as that army's contact (fold §3.4 `armies_meet`: the wing is its army's present force; the hearing names the wing) — one contact law, one battle law (`resolveFieldBattle`), the wing's losses its own. A wing is held and re-planned only by the two helpers; Bound 1 reads the PARENT's `sinceTick`. A wing at or below `modest` meets patrols and bodies by PR's ONE encounter law like any small unit.

### 6.4 The forced march — the drilled ceiling, priced
`forced_march` re-plans with `armyMarchWeeks(w, 1)` — the readiness term at its ceiling (`speedMult` 1.4), NO new speed number — so a drilled army gains little and a levy gains most [REFINED 2026-10-20 (fp-final P6) — the brief's "speed up one band" priced on the landed readiness law]. ITS PRICE, banked at the re-plan: `fatigueFloor01` raised by `FORCED_FATIGUE` (DRAFT 0.15; the column fights tired — the landed `FATIGUE_MAX` term) and `supplyQuality` lowered by `FORCED_WEAR` (DRAFT 0.1 per forced week; the army's own condition — WY-8a's contract: "low supply drags the ARMY'S OWN `accumulatedAttrition` — NEVER the realm's `warExhaustion`"). A wing at `light` or `riding` pace forces at the riding factor's forced band only when riding (§8.4).

### 6.5 Lie in wait — the first blow, bounded
A column or wing holding `lie_in_wait` at a place, met there in its dwell by a hostile unit whose court did NOT believe the place watched (the mirror of `believedWatch`, PR §8.3), gets ONE bounded lean on that contest's battle inputs: the defender's `groundAdvantage01` read at 1 for the waiting side and the arriving side's `fatigue01` raised by `AMBUSH_LEAN` (DRAFT 0.15) — passed through PS-V2's battle-input overrides (`leaf.inputOverrides`), never a second battle law (L-BD 11i (iv): "a BOUNDED LEAN on the contest's defender term … cite WC's battle inputs — PS-V2's ground/fatigue car is the seam"). If the arriving court DID believe the place watched, no lean (the ambush is read); if the place is a hidden way's junction the ENEMY knows and watches, the lean goes to the enemy (L-BD 11i (v)).

### 6.6 The general's band and the sacrificed rearguard
`hide_the_prize` moves the general's co-location to the wing (the generals' `command` mission pinned to the army now pinned to the wing — a slot in the generals' C4 unit, routed; dark until it lands). A `sacrifice_rearguard` wing is a wing like any other: its contact is `armies_meet`, its rout the kernel's retreat, its captives the custody slot's (ES-2b; dark until it lands); no named fate (CH3).

### 6.7 Regroup
`regroup` names a node (`regroupAt`); the wing re-plans toward it; when the wing and the parent stand on that node in one tick (`currentRegion` of both), the wing's strength is credited to the parent and its row dropped (the receipt). A wing whose parent ENDS (recalled, dissolved, withdrawn home) re-plans home and is credited to the deployment's homecoming by WC's proportional homecoming (WC §1.12.1; routed) — never orphaned. A wing past Bound 1 is recalled with its parent.

---

## §7 THE CARRIAGE — FLEETS AT SEA AND IN THE AIR (MG-7; the owner's 12:41 word)

### 7.1 What exists
A SHIP is no record anywhere at master: a naval record is a `navalTransit` row — an army record plus "`mode: 'sea'`", `ownerId`, `cargoId`, `cargoStrength`, `targetId` — whose `convoy` carries a column (the fold §3.3's sea rulings: a ship is a column's or army's carriage) and whose `blockade` holds a port's approaches (`planBlockade`). Its capability is a 0..1 read of the naval institutions (`navalCapability01`), never a count. LG's AIR FLEETS are LG-2's "derived counts, stored commitments" (`DESIGN_FP_ARCH_LG.md` §4, unbuilt).

### 7.2 The fleet's verbs (`fleet`)
`keep_course`; `hold` (at a port or anchorage only — the FREEZE through MG's one stage call in `navalKernel.js`, which steps naval records by `stepArmyPosition` like the land kernel); `lie_in_wait` = the landed `blockade` (NAMED, never minted: a fleet lying in wait at a port IS the blockade); `double_back`, `reroute`, `shadow` on the lane (the naval re-plan over `planConvoy`'s path read); `feint` by heading (§5.4); `forced_sail` — re-plan at `convoyTransitWeeks(base, 1)` (the readiness ceiling, the column's idiom) with the STORM as its price: in a storm season (`stormMultOf(digest, season) > 1`) a forced sail rolls ONE loss chance `FORCED_SAIL_RISK × (stormMult − 1)` (DRAFT 0.1, UNMEASURED) priced through the landed `sharedFateLoss(cargoStrength, margin01)` (one loss law: the convoy's own); no `hide` (a fleet at sea is seen), no `forced_march`. ⛔ **S-MG-2: `split` / `regroup` are ABSENT for `fleet`** — no record carries a ship count, so "along ship boundaries" has nothing to divide; a fleet never splits (the carriage limit holds trivially) until the owner declares a ship count on the naval record (his shape). A single ship's row never splits, ever (MG7).

### 7.3 The air fleet's verbs (`air_fleet`, in LG-3's commit)
`keep_course`; `hold` moored at a dock (LG's one-origin-port law); `double_back`, `reroute`, `shadow`, `feint`; `split` and `regroup` ALONG COMMITMENTS — one LG-2 commitment row becomes two, each at least one vessel, regrouped at a dock; never `hide` (an airship is seen), never `lie_in_wait` (ground-force immunity; interception is LG-4's), never a forced pace (the speed factor is LG's chair band). Dark until `vesselFleetsEnabled` and LG-2/LG-3 land; routed to LG.

### 7.4 A column aboard
A carried column takes the fleet's row while aboard (no hide, no split below the ship, the forced sail instead of the forced march) and its own row the week it lands (the landing is PS's incursion at the harbour gate; THE SITES' `harbour_works` its WHERE once lit).

---

## §8 THE MOUNT — one status, one pace, one supply, every counterforce (MG-6; `ridingEnabled`; the owner's 12:49 word)

### 8.1 Who rides — the status
RIDING is a STATUS of a PERSON or a WING, never a field of the army record (MG15) and never a word of the army's composition (the clerk is display-only, ⛔ S-MG-1). `ridingOf(unit)` is DERIVED: (a) a PERSON departs riding when its mission warrants it (an envoy, a courier, a paragon on an errand, a general riding apart — DRAFT per mission kind) AND its departure town has a STABLING RUNG (`Stable yard` · `Stable master` · `Stable district` · `Beast trainers` among its institutions, the landed ladder) — a covert operative WALKS (riding is conspicuous: the cover term reads it); (b) a PATROL's riders ride where the home has a stabling rung (PR's riders: the Stable district's first consumer — the riders' reach is PR's, routed); (c) a WING rides only with S-MG-1 ruled; (d) a BODY rides when it has TAKEN mounts (§8.5). The PARTY's mounts are the table's (the hosting doctrine).

### 8.2 The pace — one ratio, the road rungs only
`ridingLegFactor(rung, riding)` = `MODE_SPEEDS.foot / MODE_SPEEDS.horse` on `road` and `highway` (the `horse` row ROUTED TO WY: a new member of the closed `MODES`, its km/week owner-signed at the tuning sitting — DRAFT 250, UNMEASURED); `1` on `track` and on a way at `trail` (a horse walks); `'barred'` on a way at `wild` or `way` (the access law gains the constraint, PS's one widening extended by WY — a rider dismounts or takes the road; the quiet crossing is on foot). It composes INTO the one leg price — `livedLegTicks`'s `gradeMultiplier` becomes `gradeLegMultiplier(grade) × ridingLegFactor(rung, riding)` (one line in `routeNetworkConsumersTransit.js`, 198 eff) — never a second speed law [REFINED 2026-10-20 (fp-final P6) — measured: `weeksPerCostOf` ignores `mode` whenever `kmScale` is absent ("`if (mode == null || read.kmScale == null) return read.weeksPerCost;`"), i.e. in every world today, so a `horse` mode passed to `hopWeeks` would change nothing anywhere; MG reads the RATIO off WY's one table in the leg pricer instead — one number, one home, both arms. WY's ruling, routed].

### 8.3 The slowest member, kept
A whole column never rides (MG8): the landed `ARMY_SPEED_FACTOR` stands for every army record, so no army is byte-shifted by the mount. A riding wing (S-MG-1) is the owner's "unless cavalry splits off".

### 8.4 The forced pace of a rider
A RIDING person or wing may `forced_march`: the leg's factor drops one more band (`ridingLegFactor × FORCED_RIDING` DRAFT 0.8), paid in the horses — the rider's next leg out of a town without a stabling rung is AT FOOT PACE (blown horses; no remount) and in winter a forced ride costs the rider a week's rest (`hold`, motive `rest_and_refit`) at its next stabled town (DRAFT). A walker cannot force (`MIN_LEG_TICKS`).

### 8.5 Mounts as cargo, taken and answered
Mounts move as the landed goods (`Cavalry mounts`, `Draft horses`, counted materiel by `MATERIEL_GOOD_PATTERN`) on the landed caravans (WY-3's shipments, TR); a BODY's `raid` on such a caravan (BD §9.6 `traffic_waylaid`, §9.7) may TAKE them — the gang RIDES (faster on roads by §8.2; wider believed reach — PR's `believedWatch` reads a riding gang's reach one band wider, routed; conspicuous; fodder-bound: BD's sustenance need up one band in winter) until its riding status lapses after `RIDING_LAPSE` (DRAFT one season) without a stabled base or a fresh take — answered by riding patrols (an arms race the dossier reads: "the Tolle gang rides now; Kell's riders ride the hill road first"). BD's loot record gains ONE flag, `riding?: { sinceTick }` — a field on BD's declared shape, THE OWNER'S (⭐ OD-MG-7), routed to BD. ⛔ **S-MG-3: the STOCK** — the stabling institutions carry NO stock and NO capacity field (catalog entries: name, description, `baseChance` per tier), so THE BREEDING CLOCK (years to replace a lost cavalry), the levy's riders capped by the stock, and a town's horses STOLEN from its stables have no ledger; until the owner declares a stock (his shape; a slow stock on the institution or the settlement), riding is the stabling rung's PRESENCE only — no depletion, no theft from a town (a theft from a caravan is a flag on the gang, above), no breeding clock.

### 8.6 The counterforces of the mount (requirement 2)
THE TRAIN (a whole army never rides, MG8) · FODDER AND THE SEASON (a riding gang's winter need; a riding person's winter rest, §8.4; CHAIR-NOTES 13's climate band when it lands) · TERRAIN, RUNG AND FORDS (no gain off the road rungs; barred on the narrow ways) · CONSPICUOUSNESS (the spy walks; a riding gang is seen wider) · STABLING AT THE DESTINATION (no remount without a stabling rung) · THE CARRIAGE (horses aboard take ship capacity — the convoy's `cargoStrength`, routed to WY-3/TR as a slot) · THEFT BOTH WAYS (row 30's motive, dark with S-MG-3) · PURSUIT ASYMMETRY (a riding pursuer gains on the road rungs only; foot quarry escapes by a way the horse cannot take — evasion by the hidden rung, by construction of §8.2) · THE BREEDING CLOCK and THE PURSE (⛔ S-MG-3; FS's fiscal seat prices riders when the stock exists — routed to FS, `briefs/L-FS.md`).

---

## §9 THE MAP — the window, never the door (door 1 stands)
The host sends each moving unit's PLACEMENT and its VERB WORD through H17 (movers "projected for the audience; the DM's believed view where belief is recorded") and the column and traveller rows of the lens window (H23); a feint's exposure and a split or regroup are dated events in the events window (H9). PROJECTION BY AUDIENCE: a `hide` unit is drawn for the DM only, behind the movement toggle (the DM's tool), and for no player audience; a `feint` is drawn, for an audience whose court believes it, AS ITS BELIEVED HEADING (the sighting's `heading`), and for the DM as the true path with the shown heading ghosted behind the toggle; a wing is drawn as its own piece tied to its army's banner; a riding person's piece carries the rider word. The map NEVER computes movement, a heading, a motive or a pace (door 1); the motive is never sent to the map (scrutiny lives in the host's Why panel). A map-only world (no host movement) draws today's movers.

---

## §10 THE HEARINGS (requirement 24) — MG OWNS NO ENGAGEMENT KIND
A verb is never a hearing (MG6). The CONTACTS a verb produces are heard as their owners registered them, WHERE from the closed `ENGAGEMENT_WHERE_KINDS` list (a junction is a KEY under `road (a, b)`, never a sixth WHERE):
| A verb's contact | The kind (owner) | WHERE | CLIMAX / STANDING · its DEFAULT |
|---|---|---|---|
| two hostile columns or wings meet (incl. a `sacrifice_rearguard` wing, a `lie_in_wait` at a ford) | `armies_meet` (WC Arc A) | `road (a, b)` / the node | STANDING-at-contact (S5) · WC's default; the lie-in-wait lean rides the battle inputs (§6.5) |
| a column or wing meets a menace | `menace_met` (MN) | as MN's | MN's |
| a hidden or shadowing small unit met by riders | `patrol_engages` (PR) | `road (a, b)` / junction key | PR's |
| a riding gang or a lying-up pack met by another body | `bodies_meet` (BD) | BD's | BD's |
| a unit entering a stranger's land by a reroute or a double back | `passage_at_the_border` / `armed_incursion` (PS) | the crossing's | PS's (the re-plan re-asks at first sight: PS's march row reads the new `pathSig`) |
| a gang taking mounts from a caravan | `traffic_waylaid` / `caravan_seized` (BD / WY-6) | `road (a, b)` | the owner's |
| a wing or column arriving on a site | the site kinds (ST) | `site` | ST's |
Requirement 24's three choices (leave · tilt · decree) bind each in its week; a PARTY kind's default is always "nothing has happened to the party yet". LONG ADVANCES: a month/season/year is N weekly calls; each week's roll runs on that week's belief and every contact defaults by its owner — nothing queues, and no verb waits for the DM. The DM's `MOVEMENT_ORDER` is a verb, never a hearing.

## §11 THE FLAGS (virtual; absent-when-dark; read `=== true`; each lands with its certification row in `subsystemRowsVirtual.js` and its lit-mutant pins; lit in NO preset at landing; premium)
| Flag | Gates | Requires | Lit-mutant pins | Presets |
|---|---|---|---|---|
| `movementGrammarEnabled` | the roll, the posture ledger, every verb except split/regroup and the mount; the person and fleet arms | spatial canon; the transit leaf stage landed (PS-0 car-0) | a lit world with no motive firing is byte-identical to dark (every unit `keep_course`); a forced march shortens arrival and raises fatigue; a `hide` above `modest` is refused | belief presets only once C0 lights (the roll reads belief); never the omniscient preset's default |
| `wingsEnabled` | `split` · `regroup` (columns; air fleets with LG) | `movementGrammarEnabled` | the conservation pin; a wing never splits; a wing's contact is `armies_meet` | as above |
| `ridingEnabled` | §8 (the riding status, the leg factor, the riding gang) | `movementGrammarEnabled`; WY's `horse` row signed | a lit world with no stabling rung anywhere is byte-identical; a rider gains on `road` only; barred on `wild`/`way` | as above |
`hearingWeekEnabled` is not MG's (MG owns no kind). With all three dark the estate is byte-identical by construction (the leaf returns its inputs by reference; `routeNetworkConsumersTransit.js`'s factor reads 1).

## §12 THE WAVES (MG-0 … MG-7)
| Wave | Leaves · hosts | FIRST-VISIBLE (req 16) | TIER (req 17) | DEGRADED ARM | EDITOR (L10) | Alignment (req 13) | `causedBy` |
|---|---|---|---|---|---|---|---|
| MG-0 | car-0: PS's stage helpers named (`holdBeforeNode`, `replanFromNode` — ⛔ S-MG-a if not extractable); `movement/movementLedger.js` (normalizer, writer); the token census; the HBF row | none (instrumentation) | spatial canon | absent | (b) the normalizer's fail-closed pin | — | — |
| MG-1 | `movementLeaf.js :: movementVerbLeaf` (the 5th registrant) · `movementChoice.js` (the roll, §5) · `movementMotives.js` (§4) | the week a column turns back, holds at a ford or forces a march: a dossier line on its court's war page (one week's latency) | spatial canon; belief infoMode | dark: every column keeps its course (today) | (a) the roll a pinnable fork `MG-F1`; (c) `MOVEMENT_ORDER` | the general's conscience never reads a verb; the way of war carries the court's temper | every posture row and receipt names its motive's read |
| MG-2 | wings in `movementLedger.js`; the wing contact in the leaf; WC's counts-movers manifest row | a column seen to divide; a rearguard's stand | spatial canon | no split: the column moves whole | `MG-F2` (the split's share) | — | the split's deed |
| MG-3 | the feint: MN's sighting `heading` widening (routed); `believedMotiveOf`; the exposure latch; RN's `feint_exposed` deed (routed) | an enemy holding at a bridge while the column falls elsewhere | belief infoMode only | no feint (no believed heading store) | (c) | RN's credibility | the exposure names the contradicting sighting |
| MG-4 | the person arm: `movementChoiceOf` called by CH's pass, the errand spine and ES's mover at leg-open (no MG host line) | an envoy who waited at a border; a courier back early | spatial canon; RN's person stage | persons move as today | (c) | CH's roll carries it | the leg's mission |
| MG-5 | `bodyVerbOf` · `patrolVerbOf` (naming only) | the map's verb word on a body's or a patrol's piece | spatial canon | no word | — | BD's / PR's | their own |
| MG-6 | the mount: `ridingOf`, `ridingLegFactor` (one line in `routeNetworkConsumersTransit.js`); WY's `horse` row (routed); BD's `riding` flag (routed) | a rider arriving a week sooner on the high road; "the Tolle gang rides now" | spatial canon | everyone walks (today) | (c) | — | the stabling rung, the take |
| MG-7 | the carriage: one stage call + import in `navalKernel.js` (367 eff); LG-3's commit for air fleets | a convoy's forced sail lost to a storm; a fleet at anchor | spatial canon; `vesselFleetsEnabled` for air | fleets as today | (c) | — | the season's storm |
Chain placement (for the P7 fold lane, routed): MG-0/MG-1 immediately after C14 THE PASSAGE's PS-0 car-0 (they register in its stage) and after GENERALS UNIT 0; MG-2 after WC-11's counts-movers manifest; MG-3 after MN's sighting store (C10/C17); MG-6 after WY's `horse` row is signed; MG-7 after WY-3 and, for the air, LG-3.

## §13 THE LIFECYCLE OF EVERY PERSISTED SHAPE (requirement 22a)
| Path | `postures` | `wings` | `feints` (ring 16) |
|---|---|---|---|
| create | the roll or the DM's order, at a verb other than `keep_course` | `split` | a `feint` shown to a sighting |
| read | the leaf, the movers, the Why panel (own court only) | the stepper, the contact test, the conservation pin | `believedMotiveOf`; the exposure test |
| persist | `spatialLedgers.movement` (drop-when-empty) | same | same |
| regenerate (re-canonize) | dropped with the transit records it keys (a re-canonized world re-plans every march) | credited back to the parent then dropped | kept (history) |
| undo | the pulse snapshot restores the ledger whole | same | same |
| import | the field-closed normalizer; unknown verbs/motives dropped (fail-closed) | same; an orphan wing (no parent) credited home | same |
| migrate | none (new shape; absent ⇒ dark) | same | same |
| dark-after-lit | rows inert; the leaf no longer reads them; dropped at the unit's next arrival | wings re-plan home and are credited at homecoming (WC §1.12.1) | inert |
| death | the unit ends (army withdrawn, body ended, person dead — the DM's) ⇒ row dropped | parent ends ⇒ §6.7 | kept |
| veil | the motive never leaves the unit's own court's page | a wing seen is a sighting like any unit | the true `toward` is the owner court's; others hold only their sighting |
Requirement 23's horizon: `postures` ≤ one per unit; `wings` ≤ 2 per column; `feints` ring 16, newest first.

## §14 THE SCENARIO MATRIX (each row a pin family at its wave)
| # | Scenario | Measurable assertion |
|---|---|---|
| S1 | all three flags dark, every preset | byte-identical saves and news over 520 weeks against the base |
| S2 | lit, no motive fires | every unit `keep_course`; byte-identical to S1 |
| S3 | an aspatial world, lit | no roll, no posture row; persons hop the relationship graph as today |
| S4 | a long advance (a year), lit | 52 rolls per column; no posture older than its dwell without a standing motive; nothing queued |
| S5 | a pursued column, `sacrifice_rearguard` | a wing of `a_third`; `armies_meet` with the wing; the van's arrival unchanged by the contact; the conservation pin holds |
| S6 | the pursuer's court sees the split | `believedMotiveOf` draws on its own stream; across 200 seeds it divides in some and not all (an invitation, never forced) |
| S7 | a `hide` at `capable` | refused (above `modest`); posture `keep_course`, reason `capacity` |
| S8 | a `hold` past Bound 1 | refused; the column keeps its course; reason `campaign_clock` |
| S9 | a `forced_march` by a levy and by a drilled army | the levy's arrival shortens more; both carry the raised fatigue floor |
| S10 | a `lie_in_wait` at an unwatched ford met by a column that did not believe it watched | the lean applied once; with the arriving court believing it watched, no lean |
| S11 | a feint toward Holt then a sighting near Varn | `exposedAt` stamped once; RN's `feint_exposed` deed; the observer's next inference reads the habit |
| S12 | a riding envoy from a town with a `Stable master` on a highway, a track and a `wild` way | faster on the highway; equal on the track; the way refused |
| S13 | a whole army with heavy horse in its display composition | `armyMarchWeeks` unchanged (MG8); no wing rides while S-MG-1 stands |
| S14 | a gang takes `Cavalry mounts` from a caravan | `riding` set; its believed reach one band wider; lapses after a season without a stabled base |
| S15 | a convoy forced through a storm season | one loss chance through `sharedFateLoss`; never split |
| S16 | the DM orders a column to hold | no roll while the order stands; undo restores the prior posture |

## §15 THE COUPLINGS (each the sibling's to confirm)
WY (owner of the physics): the `horse` row of `MODES` and its owner-signed speed; the riding ratio read in the normalized arm; the rider's bar on `wild`/`way` in the access law · PS: MG as the fifth `TRANSIT_LEAVES` registrant; `replanFromNode` named beside `holdBeforeNode` (S-MG-a); a re-plan re-asks the border by the new `pathSig` · WC: the wing's contact into Arc A's `armies_meet`; the wing in WC-11's counts-movers manifest; the homecoming credit; WY-8a's attrition contract for the forced march · PR: `patrolVerbOf` names its states and aims; `believedWatch` and `predictedPlaceOf` read by the motives; a riding gang's wider believed reach · BD: `bodyVerbOf`; the `riding` flag on the body (OD-MG-7) · MN: the sighting row's `heading` and the `unit` subject kind (OD-MG-6) · RN: the `feint_exposed` credibility deed · CH / L-CH-PD: a commanding paragon's verbs through CH's one roll (the deity inside it) · the generals: the dials; the general's co-location with a wing (C4 slot) · ES: the operative's `hide`/`shadow`/`feint` and its cover read · IN: the exposure by contradiction idiom · OP (`briefs/L-OP.md`, compiled beside): the detour is a `reroute` whose motive is OP's · WS (`briefs/L-WS.md`, compiled beside): `wayOfWarOf` as the motive prior · FS (`briefs/L-FS.md`): the purse of riders once a stock exists · LG: the air fleet's verbs in LG-3; split along LG-2 commitments · HB: the person-grain habit of a verb · the map (the next exchange): H17's verb word, the hidden unit's audience, the feint's believed heading · the fold (P7): §5 rows (§16), §3.3 "one grammar" row, the chain placement (§12).

## §16 THE TOKEN REGISTER (fold §5 rows MG asks the fold lane to add; census `cure/L-MG-probe/tokens-*.out`)
| Token | Status at master | Meaning (one surface) |
|---|---|---|
| `MOVEMENT_VERBS`, `MOVEMENT_CLASSES`, `MOVEMENT_MOTIVES`, `WING_SHARES`, `WING_PACES` | FREE | §2.3 |
| `keep_course` · `double_back` · `lie_in_wait` · `forced_march` · `forced_sail` · `regroup` | FREE (0 quoted files; `regroup` prose only) | the verbs |
| `hold` | HOMONYM — fold §5 `hold` row (PL's hold, MN's holds, the strategy move, `HABIT_HOLD_BANDS`, the ransom `CAPTOR_CHOICES` "`'hold'`") | MG's verb IS PS's march hold (one week still) |
| `reroute` | HOMONYM — `strategyMoves.js` "`'reroute',`" (a court's trade move) | the unit's re-plan; scoped by the field `verb` |
| `hide` · `shadow` · `split` · `feint` | HOMONYMS — goods "`'hide'`", IN's HIDE toll; the render op "`op: 'shadow'`"; `heraldRouting.js` "`'split'`"; `feint` prose only (ink) | the verbs |
| `rejoin` | LANDED (WC's TAG event) — MG NEVER uses it | — |
| `advance` | LANDED (the DM's time advance) — MG NEVER uses it as a verb | — |
| `wing` · `riding` | FREE (prose only) | an army's part on MG's ledger · the rider status |
| `movementGrammarEnabled` · `wingsEnabled` · `ridingEnabled` | FREE | the flags |
| `feint_exposed` | FREE (routed to RN as a deed word) | the exposure deed |
| `horse` (a `MODES` member) | PROSE ONLY in `src` (arrival prose "`'horse'`") | routed to WY |
| `mounted` | ⛔ NEVER a code token here — the estate's word for a wired host ("mounted by pulseKernel"; the mount rule) | prose may say "rode" |

## §17 THE RULINGS (by delegation under the 2026-10-16, 2026-10-17 and 2026-10-20 words, vetoable; ⭐ = the owner's own row; every DRAFT constant UNMEASURED, on the FP-46 roster)
| Id | Ruling |
|---|---|
| ⭐ OD-MG-1 | THE PERSISTED SHAPE `spatialLedgers.movement` (`postures`, `wings`, `feints`, `seq`) — the owner's, declared (§2.2, §13) |
| OD-MG-2 | MG is a verb layer: no speed, road, clock or battle law of its own (MG1); the hold and the re-plan are PS's helpers |
| OD-MG-3 | MG is the FIFTH and LAST registrant of the transit leaf stage (imposed holds first) — routed to PS |
| OD-MG-4 | the brief's `advance` → `keep_course`; `rejoin` → `regroup`; ships' forced pace → `forced_sail` |
| OD-MG-5 | bodies and patrols are NAMED, never rolled (one choice per body; PR's aims) |
| ⭐ OD-MG-6 | the sighting row's `heading` and the `unit` subject kind — a widening of MN's declared shape, the owner's |
| ⭐ OD-MG-7 | BD's `riding` flag on a body — a field on BD's declared shape, the owner's |
| OD-MG-8 | an army's split makes a WING (a share of the aggregate, ≤ 2, never a block fork, never a second army record) |
| OD-MG-9 | the wing's pace = the landed gap between the column factor and the leg physics (no new speed) |
| OD-MG-10 | the forced march = `armyMarchWeeks(w, 1)` + `FORCED_FATIGUE` 0.15 + `FORCED_WEAR` 0.1 (DRAFT) |
| OD-MG-11 | the lie-in-wait lean = `AMBUSH_LEAN` 0.15 on the arriving side's fatigue + the waiting side's ground at 1, once (DRAFT) |
| OD-MG-12 | the motive table (§4) is closed at 44; weights `[1, 4]`, factors `[0.25, 4]`; `VERB_DWELL` (DRAFT) |
| OD-MG-13 | the way of war is the motive prior (WS); desperation flattens it |
| OD-MG-14 | the feint's exposure is a credibility deed (RN), never a casus |
| ⭐ OD-MG-15 | WY's `MODES` gains `horse` (DRAFT 250 km/week) — owner-signed tuning (THE PROMISE); the riding ratio read in both arms |
| OD-MG-16 | riding is a status of persons and wings only; a whole army never rides (MG8); barred on `wild`/`way` |
| OD-MG-17 | `FORCED_RIDING` 0.8, `FORCED_SAIL_RISK` 0.1, `RIDING_LAPSE` one season (DRAFT) |
| ⛔ S-MG-1 | an army's horse is unknown to the engine (`forceComposition.js` is display-only by its own law) — the riding wing and `raid_horse_lines` are DARK until the owner rules a stored arms field or an existence-gate read |
| ⛔ S-MG-2 | no ship count on any naval record — `fleet` never splits until the owner declares one |
| ⛔ S-MG-3 | the stabling has no stock — the breeding clock, the stock cap and theft from a town are DARK until the owner declares a stock |
| ⛔ S-MG-a (build-time) | if PS's step-6 arithmetic cannot be extracted as `replanFromNode` without moving PS's behaviour, MG-1's re-plan verbs stay dark |

## §18 WHAT A DM READS (deeds, never forecasts; no numerals)
1. "Kell's column turned back at the crossroads; Tolle's riders went on past it." (surface)
2. "Kell left a rearguard at the ford to hold Tolle's riders; the van went on to Ashby." (surface; the motive on Kell's page)
3. "Kell's relief marched day and night and reached Varn before it fell; it came in worn." (surface)
4. "Kell's company waited at the ford; Tolle's column walked into it." (surface)
5. "Tolle's host held at the bridge, believing Kell marched on Holt; Kell fell on Varn." (surface after the fact; the feint on scrutiny)
6. "Tolle's court has learned that Kell's captain shows one road and takes another." (scrutiny, Tolle's page)
7. "The envoy from Ashby rode the high road and reached Holt early." (surface)
8. "The Tolle gang rides now; Kell's riders ride the hill road first." (surface)
9. "Kell's horse followed Tolle's column at a day's distance." (scrutiny)
10. "Kell's two halves met at Holt before the battle." (surface)
11. "The salt convoy forced its sail into the autumn storms and lost a ship's worth of its cargo." (surface)
12. "Kell's company lay in the woods while Tolle's host went by." (DM only, behind the movement toggle, while hidden; surface once found)

END OF VOLUME.
