# DESIGN_FP_ARCH_PS — THE PASSAGE: a foreign military unit moving through another settlement's or kingdom's land

## Compiled by lane L-PS (Opus 5.5) under chair session a73343ed (Fable 5.1), 2026-10-18, on the owner's word of 2026-10-18 ~00:47 EDT.
## Compiled on the owner's word; DARK behind two virtual flags (`passageEnabled`, `passageStanceEnabled`, §9); nothing scheduled.
## Bound by the FP constitution's requirements 1–24 (`DESIGN_FP_SPINE.md` §1; 15–24's text of record is `DESIGN_FP_COHERENCE_FOLD.md` §1) and by the fold.
## The compile log, every measurement, the STOP conditions and the open questions: `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/L-PS.md` (probes `cure/L-PS-probe/`).
## `[REFINED 2026-10-18 (fp-final) — what; why]` brackets mark every place the measurement changed the brief; each is vetoable.

---

## THE OWNER'S WORDS, VERBATIM (BOARD, 2026-10-18 00:47 EDT)

"also one more behavior to add to the architecture, caution on one military unit of any foreign settlement moving through another kingdom or settlement's territory. expand upon this to be cmoprehensive, exhaustive, and complete. Allies (all based on belief) allow with reservation and to a limit of tolerance (which is increased during wartime) allies' to move through their territory. If they are not allies, it is important to request permission either at envoy being proactive or at teh border, else they have to find a different path, or they simply do not heed the warning due to hostiliites, intentional, or urgency that requires them to act. also think about all the varying ways it is recieved. what are your thoughts/"

The binding doctrines this volume obeys by name: the tool is the DM's ("We only supply setting and consequence"); BEHIND THE SCENES (immersion shown behind toggles, complexity only on purpose); UNPREDICTABLE IN PROSPECT, LEGIBLE AND COHERENT ON SCRUTINY; THE HEARING WEEK (requirement 24); THE EVIDENCE LAW; THE WORLD HOSTS THE CAMPAIGN, NEVER COMPETES (the owner, 10-18 01:3x).

## THE ANSWER IN ONE PARAGRAPH (for the DM)

When one town's soldiers — an army on campaign, a relief force, a returning contingent — must cross another town's land to reach where they are going, the town whose land it is decides, on what it BELIEVES about them, how to receive them. A friend lets them through with conditions (keep to the road, take nothing, do not linger) and only for as long as its patience lasts — longer in wartime, shorter when the column is large against its own strength. A town that is not a friend must be ASKED: by an envoy sent ahead, which is better received, or at the border itself, where an army on the doorstep is an argument of its own. A town at war with them is not asked at all: the crossing is an incursion and it fights with what it has. Every answer is one of eight — welcomed, granted, granted under watch, tolerated, refused, refused with a warning, barred by arms, or told to leave — and every answer is a hearing the DM may leave, tilt or decide. Refused, the column complies, finds another road, waits at the border, turns back, or crosses anyway — because it is at war, because it chooses to defy, or because a besieged friend cannot wait — and the receipt names which. A crossing kept builds trust; terms broken leave a grievance and a cause for war; repeated trespass closes a town's roads to that town's soldiers. Small companies on unwatched roads may slip through unseen, and then the town never learns of it. Nothing is forbidden; everything is priced; the DM sees the outcome, and the reasons wait for a look on purpose.

---

## §0 WHAT THE CODE ALREADY IS (measured at master `81f1cd963`; every row CONFIRMED unless marked; `cure/L-PS.md` §1)

### 0.1 The substrate

| `path :: symbol` | What it is (the quoted line) | What it gives THE PASSAGE | Gate / presets | Host eff. lines (eslint `max-lines`, `cure/L-PS-probe/effLines.out`) | Persisted / derived |
|---|---|---|---|---|---|
| `spatial/spatialDigest.js :: buildSpatialDigest` | "ONE multi-source integer Dijkstra … per land cell: nearest settlement (TERRITORY / a Voronoi-of-settlements partition)"; `gates`: `{ between: [g.a, g.b], cellA, cellB, cost }` — "the cheapest boundary crossing" per adjacent pair | THE BORDER TRUTH: every land cell is some settlement's territory; the gate between two neighbouring territories is a frozen host fact with two boundary cells (the hearing's WHERE) | the spatial canon (`spatialCanonVersion`) | 418 / 800 (READ only) | persisted, frozen at canonize |
| `spatial/armyTransit.js :: ArmyTransitRecord` · `planMarch` · `currentRegion` · `remainingRegions` | `path` "the settlement-id route origin→…→dest"; `position01` "0..1 fraction of the route covered"; `planMarch` → `chooseRoute(…)` "a marching army also prefers the safe road" | THE UNIT AND ITS NEXT NODE: an army's path names every territory it will cross; the node after `currentRegion` is the next border | `armyTransitActive` = the canon marker | 340 / 800 | the `armyTransit` ledger (`spatialLedgers`) |
| `worldPulse/armyTransitKernel.js :: advanceArmyTransit` | "DERIVE + ADVANCE: every committed deployment … is an army with a POSITION"; the hold idiom `const stepTick = dep.recalled ? num(priorRec.lastTick, nowTick) : nowTick;` | THE PER-TICK HOST of the border read (§4.1), through a leaf stage | the canon marker; `warLayerEnabled` (deployments) | **798 / 800** — two lines of headroom | writes `armyTransit` |
| `spatial/embattlement.js :: chooseRoute` · `scoreRoute` | "pick the minimum effective cost"; `effectiveCost: base + dangerCost + tollCost`; toll "levied on PASS-THROUGH" | THE ROUTE CHOICE the mover's believed passage cost joins (PS-4) | canon | 172 / 800 | derived |
| `spatial/distanceRead.js :: candidateRoutes` · `shortestPath` (module-private) · `K_CANDIDATES = 3` | "Remove each edge of the primary in turn → the cheapest detour around it" | the three cached detours; a node-avoiding reroute needs ONE new export (§5.3) | canon | 544 / 800 | derived, memoized |
| `spatial/migration.js :: MILITARY_COLUMN_CLASSES` · `isMilitaryColumn` | `'reinforcement_column', 'shed_column', 'veteran_return'` — "⛔ NOTHING STAMPS ONE OF THESE YET. WC-6 mints the first producer" | the COLUMN arm of the unit (dark by absence until WC-6) | WC-0B (built dark) | — | the migration column ledger (no path field) |
| `worldPulse/beliefMap.js :: belief` · `BeliefRecord` | "marker absent OR omniscient OR a SELF-read ⇒ { source: 'truth' }"; `{ readiness, strengthBand, allianceLabel, faithLabel, confidence01, lastUpdateTick }` | WHAT B BELIEVES OF A (label, readiness); B's own contracts read true | `beliefsActive` (canon ∧ infoMode ≠ omniscient) | — | persisted belief maps |
| `worldPulse/relationshipState.js :: RELATIONSHIP_DEFAULTS` | keys `neutral · trade_partner · allied · patron · client · vassal · rival · cold_war · hostile · criminal_network` | THE LADDER'S INPUT LABELS | always | — | persisted relationship state |
| `worldPulse/pactFormation.js :: reserveFor` | `reserve = clamp01(F.RESERVE_BASE01 * posture.factor - F.RISK_APPETITE_RELIEF * appetite.stock01 + F.OATHBREAKER_PENALTY * disavowal)` | THE ONE COURT RELUCTANCE: the base of every passage answer (§4.3), with CH's and RN's envoy leans arriving through its shared seam | `pactFormationEnabled` (the default and three more) | 565 / 800 | derived |
| `worldPulse/pactFormation.js :: PACT_DRAFT_LENS` | occasions `faith_communion · migration_pressure · shared_threat · trade_demand · renegotiation · renewal` | the STANDING right's producer (a `passage` occasion, §6.4) | `pactFormationEnabled` | 565 / 800 | derived |
| `worldPulse/peaceTermsCatalog.js :: TERM_CATALOG` · `humanTermType` | `market_access: { family: 'commercial', … executor: 'seam' }`; `case 'migration_right': return 'right of passage';` | the `passage_rights` row's idiom; ⚠ the Herald's "right of passage" is the MIGRATION right's | — | 117 / 800 (`peaceTerms.js` 799 is NOT touched) | treaty instrument (landed shape) |
| `worldPulse/envoyErrandVocabulary.js :: ERRAND_CONSUMERS` | rows `{ consumer, purposeClass, module, wave, built }`; `'pact proposals'` "business on the road exactly as an embassy is" | THE ENVOY AHEAD: one new row `passage requests` (§6.1) | `errandSpineEnabled` | — | the errand ledger (landed shape) |
| `worldPulse/warReasonTaxonomy.js :: WAR_REASON_TYPES` · `REASON_MIRRORS` | "walker-enforced for totality AND bijection across five surfaces … Registration-first is the only order this taxonomy admits" | THE CASUS ROAD: `passage_violated ↔ passage_redressed` (§7.3) | `warLayerEnabled` | 70 / 800 | persisted war-reason ledger |
| `worldPulse/martialReadiness.js :: threatEnvironment01` · `buildThreatByCid` | "from the world's WAR RECORDS ONLY"; three presence signals | THE WARNING: one fourth signal `armsNear` (§7.4) | the faith gate (records only where a patron exists) | 264 / 800 | per-cid record |
| `worldPulse/warSiegeVerdict.js :: SIEGE_MAX_AGE` · `armyTransit.js :: ARMY_TRANSIT_TUNING.MAX_MARCH_WEEKS` · `warArmyRecord.js` `deploymentAge` | `SIEGE_MAX_AGE = 60`; `MAX_MARCH_WEEKS: 52` "strictly BELOW the war layer's SIEGE_MAX_AGE"; `deploymentAge: Math.max(0, tick - sinceTick)` | THE TERMINATION BOUND every hold must respect (PS9) | `warLayerEnabled` | 685 (`warDeployment.js`) | persisted deployments |
| `worldPulse/relationshipState.js` + the one relationship writer `applyRelationshipPatch` (outcome-borne; PL §4.6's measurement) | "no hand-editing of relationshipStates anywhere" (`relationshipEvolution.js :: mintMemoryWeaveIncident`) | trust up on a kept passage, resentment on a broken one, through the ONE writer | always | 438 (`relationshipEvolution.js`) | persisted |
| `worldPulse/settlementLifecycleKernel.js` (the pact stage's host: "`advancePeacetimePacts` is a stage in `settlementLifecycleKernel.js`") | own-flag-before-host-gate stages | THE COURT STAGE host (§4.2) | per stage | 735 / 800 | — |
| `worldPulse/roadsKernel.js` PASS 3 THE GAUNTLET | interception of EMBASSIES ("a bandit road (T3) can still take an embassy that no army meets") | the envoy ahead can be intercepted on the way (landed; PS adds nothing) | `roadsEnabled` | 838 (baselined, frozen) | the roads ledger |

### 0.2 The binding prior words
- **The owner's PASSAGE word** (above) and the chair's design (`briefs/L-PS.md` items 1–9), executed except where §0.4's measurements refined it.
- **Requirement 24 (THE HEARING WEEK)** — every engagement between two settlements is a registered kind, paused at its climax for one week at a week-by-week advance; month, season and year advances run defaults; "the simulator is gated for premium".
- **PL §4.5** [CURED SPL-M13]: "Passage is a CHARTER TERM … the CHARTER's passage is tolls only"; its round-1 bracket: "members of one polity and liege/vassal stand as ALLIES (allowed with reservation, to a limit of tolerance)" on THIS volume's ladder. **PL8**: "Down: PROTECTION, ARBITRATION, PASSAGE." **PL16**: the belief map holds no third party's label.
- **MN5**: the ONE presence term in the ONE danger truth — "per town the MAX of its feeders, capped once". **MN6**: a menace "has no mind and is not people" — it asks nobody.
- **RULINGS-AFTER-RESEARCH §4**: actor kinds `settlement · person · party · menace`; the proposals queue's `targetSaveId` is always a real settlement.
- **RULINGS-AFTER-COMPILE**: THE CHOOSER'S SHARED-SIGNAL CAR (SX-08) is a cross-program unit owned by the first chain to land; the ONE PERSON STAGE idiom (a single leaf pass with a closed registration list).
- **The host document** (`refs/HOST-REQUIREMENTS-2026-10-18.md`): J385 "The host's intermediary settlement keeps each gate until the sway passes its 300-year soak" (HR:557); "the map never decides a war" (HR:501); "Patrols by address and week, never a roll" (HR:503); "A patrol is never drawn lowering danger" (HR:505); a border segment is a hearing card's "where" only through H16 (HR:82); plague-R7: a quarantine verb, when built, is "the host's own verb with a stance input, never a patrol fact" (HR:481).
- **The owner's PATROLS word** (BOARD 06:05): patrols are "extensions of military units" — THE PATROLS volume (`DESIGN_FP_ARCH_PR.md`, round 2) owns the noticing read this volume consumes (PS8's quiet crossing).

### 0.3 Population facts that bound the design
- Armies are FEW: one per settlement (`armyTransit.js` "one army per settlement"), "the belief-envelope 5–30" (`advanceArmyTransit`'s collision comment) — so a per-tick scan of units × path nodes is bounded and a border hearing per first entry does not flood the docket.
- A march is at most `MAX_MARCH_WEEKS` (52) weeks; a typical path crosses a handful of intermediary territories (every land cell belongs to some settlement, so EVERY intermediate node of a path is a crossing).
- No unit moves aspatially; no military column exists until WC-6.

### 0.4 What the measurement changed (each bracketed where it sits)
[REFINED 2026-10-18 (fp-final) — ten refinements from `cure/L-PS.md` §2: (1) the aspatial arm (PS10); (2) members' arms pass by the LADDER, not by a charter (PL §4.5: the charter is tolls only); (3) the one-off request is PS's errand and PERMIT, the lens drafts only the STANDING right (TERM_CATALOG durations are years; V-1 one instrument per pair); (4) the noticing read is THE PATROLS' (dark ⇒ every crossing witnessed); (5) a hold is a one-tick shift of the record's two clocks (no new field), bounded (PS9); (6) the tolerance band words renamed (`slight`, `narrow` collide); (7) the WHERE is the digest gate as `road (prev, B)` until H16 offers `border_segment`; (8) unit size reuses the ONE intensity ladder; (9) a routing army never asks; (10) the answer's base reluctance is the landed `reserveFor`.]

---

## §1 THE LAWS (PS1–PS16)

**PS1 — A PASSAGE IS ONE FOREIGN MILITARY UNIT ENTERING ONE TERRITORY THAT IS NEITHER ITS OWN NOR ITS DESTINATION.** The MOVER is settlement A (the unit's owner); the HOLDER is settlement B (the territory's settlement). A UNIT is (a) an army on the war layer's one-army ledger in transit — roles `march · reinforcement · retreat` (`armyTransit.js :: ARMY_ROLES`) — or (b) a WC military column of class `reinforcement_column` or `veteran_return` (`migration.js :: MILITARY_COLUMN_CLASSES`) once WC-6 mints them. NEVER a `shed_column` (a dissolving body, WC §1.12's absorption market), a refugee or migrant column (POP's wall idiom, `MIGRATION_REFUSALS`), a menace (MN6: it asks nobody; a menace crossing presses the lands it crosses as MN says), a person or a paragon (CH's gate, `person_at_the_gate`), or the party (PT's gate). The DESTINATION's own land is the purpose of the march (a siege, a relief, a homecoming) and is never a passage; the ORIGIN's own land is home. A passage arises at every INTERMEDIATE node of the unit's path.

**PS2 — ONE BORDER TRUTH: THE HOST'S TERRITORY PARTITION, NEVER THE MAP'S SWAY.** A unit enters B's territory when its path steps from node P into node B — across the digest's gate between P and B (`spatialDigest.js`: "the cheapest crossing cells are their GATE"). The gate's keeper is the settlement whose territory the path enters (J385: "the settlement whose territory a path crosses keeps it"). The map's sway, allegiance lens and debatable "marches" never enter a passage read (HR:501). The one function `gateKeeperOf(digest, fromId, toId)` returns `toId` today; if the owner ever adopts H16's per-gate holder offer, that function is the only line that changes (a recorded slot, §16 OD-PS-6). A KINGDOM's land is the union of its members' territories (PL1's derived walk); a passage through a kingdom is a passage through each member it touches, and the crown's voice enters each member's answer (PS14).

**PS3 — BELIEF, NEVER TRUTH, EXCEPT THE HOLDER'S OWN CONTRACTS.** B answers on what it BELIEVES of A (K3): the label it believes it holds with A (`belief(B, A).allianceLabel`), A's believed readiness, the unit's size as B's witnesses saw it (§2.5), and A's STATED purpose and destination — a CLAIM carried by A's envoy or announced at the gate (Law One), which may be false. B reads its OWN contracts true (the landed carve-out PL16 cites: "the belief fogs their STATE, not the contract") — so B knows whether the claimed destination is its friend or its enemy, but not whether the claim is honest. Dark beliefs (no canon, or the omniscient preset) read the truth verbatim, as every belief read does.

**PS4 — THE LADDER OF STANDING HAS THREE RUNGS, READ FROM THE HOLDER'S BELIEF.** `ally` — B believes `allied`, `vassal`/`patron` (the sworn link either way), or a live `mutual_defense` term, or A and B are members of ONE polity by PL's walk (PL1) with no believed `hostile` between them: allowed WITH RESERVATION and to a LIMIT OF TOLERANCE (PS5). `stranger` — `trade_partner`, `neutral`, `client`, `rival`, `cold_war`, `criminal_network`, or no record (`unknown`): must ASK (proactively by envoy, or at the border). `enemy` — `hostile` (the estate's "this is a war" mark, `pactFormation.js :: hostileBetween`: `=== 'hostile'`): no request is possible; the crossing is an `armed_incursion` (§7). [REFINED 2026-10-18 (fp-final) — the brief's "members' mutual passage by the polity-wide charter — SPL-M13's ruling" is struck: PL §4.5 cured SPL-M13 to "the CHARTER's passage is tolls only"; members' arms pass because members stand as ALLIES on this ladder, and feuding members read their believed label like anyone else.]

**PS5 — TOLERANCE IS A WIDTH, SPENT BY WEEKS IN THE LAND × THE UNIT'S SIZE; WAR WIDENS IT FOR FRIENDS AND NARROWS IT AT HOME.** Each holder holds, per guest, a derived tolerance WIDTH banded `none · scant · fair · wide` (DRAFT, UNMEASURED), composed in a fixed order (§4.4): the rung, B's own war state (B at war with someone else → one band WIDER for allies and for its enemy's enemies; B at war at HOME — a siege or an incursion inside its own land → `none` for all but its own liege), the unit's size against B's strength (`pressing` → one band narrower; `decisive` → two), the liege's stance (PS14), A's record on B's land (§2.8's archive), and the ruler's bias (the war-seat books' temperament). A guest SPENDS it each week it stands in B's land, by its size; spent out → `passage_overstayed`. A permit's own `leave_by` week is a second bound; whichever ends first ends the welcome. There is no second decay law: tolerance is not a stock that refills on a clock — it is recomputed from the record each week, and spending is the crossing's own count.

**PS6 — EVERY RECEPTION IS ONE OF EIGHT ANSWERS, AND SILENCE IS A CHOICE NOT TO CONTEST, NEVER CONSENT.** `welcomed` · `granted` · `granted_under_watch` · `tolerated` · `refused` · `refused_with_warning` · `barred` · `demanded_to_leave` (§2.3). `tolerated` means B answered nothing and chose not to fight; it is never a permit, the guest gains no right by it, and B's lord grumbles (a small grievance, PS13). Every answer is DERIVED from named reads (§4.3), each a lean with a reason the receipt can name.

**PS7 — NOTHING IS FORBIDDEN; EVERYTHING IS PRICED; THE CAUSE IS NAMED.** A may always cross. Refused (or never asking), its column takes one of five ROADS: `complied` (takes the terms) · `rerouted` (another road around B's land) · `waited` (at the border, for an answer or a change) · `turned_back` (home, or holds where it stands when home is unreachable) · `trespassed` — and a trespass names ONE of three CAUSES: `hostility` (an enemy: no request was possible) · `defiance` (A crosses though it is not B's enemy, by intention: priced as defiance) · `urgency` (a relief whose clock will not allow the detour: the chooser weighed the clock against the price, and the receipt says so). The price lands on the act (PS13), never a ban, never a rule that stops the march.

**PS8 — WHAT IS NOT SEEN DID NOT HAPPEN TO THE HOLDER.** A crossing is known to B only when it is WITNESSED. The noticing read is THE PATROLS' (`witnessedCrossing(worldState, holderId, gateKey, unit, tick)`, owned by `DESIGN_FP_ARCH_PR.md`): a patrol on that stretch that week, B's own seat on the path, or a unit too large to hide (size `pressing` or `decisive` against B's strength is ALWAYS witnessed). Until THE PATROLS lands, the read answers `true` — every crossing is witnessed (the conservative arm; no quiet crossing exists). An UNWITNESSED crossing writes nothing for B — no hearing, no grievance, no casus, no regard — and A's own archive keeps it (A knows what it did). If B later learns of it (a rumor, a spy, a later witness), it learns it as NEWS through the landed roads, never as a retroactive hearing. [REFINED 2026-10-18 (fp-final) — the brief's "the roads gauntlet's interception odds" watch MISSIONS (embassies), not armies (`roadsKernel.js` PASS 3), and "the map's patrol offer" has "No host consumer" (HR:555); the noticing read is therefore THE PATROLS' (the owner's 06:05 word: patrols as extensions of military units), and no second watch law is minted here.]

**PS9 — A HOLD IS A SHIFT OF THE MARCH'S CLOCK, AND EVERY HOLD IS BOUNDED BY THE SIEGE CEILING.** A unit that waits at a border, or stands for its border hearing, keeps its position: the transit leaf moves the record's `departTick` and `arrivalTick` one week later for each held week, so `stepArmyPosition` returns the same `position01` (no new field; the armyTransit ledger already persists both clocks). The CUMULATIVE passage hold of one march is capped at `PASSAGE_HOLD_CAP_WEEKS = SIEGE_MAX_AGE − MAX_MARCH_WEEKS − 1` (DERIVED, never tuned: 7 weeks at master), because `deploymentAge` counts from `sinceTick` and the march is the margin the siege ceiling relies on (`armyTransit.js :: siegeArrivalGate`: "MAX_MARCH_WEEKS is strictly BELOW the war layer's SIEGE_MAX_AGE"). A column whose cap is spent must choose a road that moves it (comply, reroute, turn back, trespass) — waiting is no longer offered. A reroute whose new arrival would put `arrivalTick − sinceTick` above `MAX_MARCH_WEEKS` is IMPOSSIBLE and is not offered. The pin asserts the bound on every lit fixture.

**PS10 — THE PHYSICAL WORLD IS A SEAM: THE PASSAGE IS A SPATIAL PROGRAM WITH AN HONEST ASPATIAL ARM.** Units move only under the spatial canon (`armyTransitActive`). ASPATIALLY no army travels, and the war targets a relationship NEIGHBOUR (`warIntent.js`: "besiege whichever hostile neighbour"), so no third settlement's land lies between — THE PASSAGE IS DARK BY ABSENCE aspatially and byte-identical. The relationship-graph hop arm ("a hop into a settlement's node is entering its territory") applies only to a unit that crosses a third node without the canon — a future WC-5 call-in contingent credited under WC-1's aspatial bank — and is built in that wave's commit through the same court read (§4.3) at dispatch. [REFINED 2026-10-18 (fp-final) — the brief's aspatial arm presumed aspatial armies travel; measured: they do not.] The canon's travel times, gates and paths are the world canon the map module's H5 rebuilds (PL15's carrier); THE PASSAGE reads them through the digest only.

**PS11 — THE MOUNT RULE.** Zero lines in `pulseKernel.js` (1581), `applyWorldPulse.js` (907), `warTermination.js` (818). `armyTransitKernel.js` (798) takes NOTHING until a LEAF-FIRST CAR extracts its field-battle news builders (`battleInputs`, `fieldBattleNews`: 42 effective lines measured on the byte slice) into a leaf; then it takes ONE stage call and its import — THE TRANSIT LEAF STAGE (§4.1), a closed registration list shared with WC Arc A's `armies_meet` leaf (one mount, two registrants; whichever lands first owns the car). `settlementLifecycleKernel.js` (735) takes one stage call and its import for THE COURT STAGE beside the pact stage. `roadsKernel.js` (838, baselined), `peaceTerms.js` (799) and `generosityKernel.js` (800) take nothing. `settlementStrategy.js` (763) takes nothing directly: the mover's planning signal rides THE CHOOSER'S SHARED-SIGNAL CAR (SX-08) where a chooser term is needed (§5.1).

**PS12 — ONE DANGER, ONE STANCE VOCABULARY, ONE RELUCTANCE, ONE CASUS ROAD.** An enemy column in a town's land feeds MN5's ONE presence term (a third feeder beside the menaces and THE SITES' untied holders: the max of feeders, capped once) — never a second danger law. The arms stance reuses EC-6's words `open · taxed · restricted · closed` (ONE vocabulary for goods and arms; two derived stances). Every passage answer's base reluctance is the landed `reserveFor` (one court-reluctance law). The trespass casus is a registered pair of the closed reasons taxonomy, never a side ledger of grievances.

**PS13 — WHAT IS KEPT IS REMEMBERED; WHAT IS BROKEN IS PRICED — THROUGH THE ONE WRITERS.** A passage kept moves trust up on the pair (the one relationship writer, outcome-borne); broken terms move resentment and register `passage_violated`; a trespass registers the casus for B (and, where PL's polity holds, the regard of B's body and its liege through RN's body derivation); `tolerated` is a small grievance on B's own court. Every passage's ending writes ONE row to the bounded archive (§2.8), which is the record the next answer reads. A commander carries the deed on its own fame only when the generals land (RN's slot `war_concluded` neighbour, C4) or a paragon captain rides with the army (CH's war seam, C4).

**PS14 — A FOREIGN ARMY IN THE KINGDOM IS THE CROWN'S BUSINESS AS FAR AS THE CROWN'S HOLD REACHES.** Under `polityPrecedenceEnabled`, B's answer reads B's ONE foreign book with the new precedence class `passage_of_arms` (PL §3's table gains the row, the chair's at P4): the immediate liege's stance toward A at `POLITY_LIEGE_SHARE[band]` (PL4) and the paramount's at reach `r` by `polityHold` (PL5). A member that grants passage to its liege's ENEMY is PRICED AT ONCE as defiance (a `fealty_defied` row through PL's door, PL7's spirit) — never a break, never forbidden. A member trespassed or invaded is a member whose liege owes PROTECTION (PL8): an `armed_incursion` into a member's land is an input on the polity's decided relief exactly as a siege is (PL §4.3's one relief decider, its war arm's gates).

**PS15 — BEHIND THE SCENES.** The SURFACE shows the deed in the world's words ("Ashford let Kell's column through on the river road"); the SCRUTINY layer (the Why panel, the pair card, the hearing card's reasons) shows the rung, the tolerance band, the size band, the terms and the reasons; the MACHINERY (widths, spends, scores) is never pushed. No sentence forecasts ("Ashford will refuse"): every line is a deed that happened. A unit's piece on the map says where it is, never where it is going (WY §3b: "A marker is a presence, never an intention").

**PS16 — THE DM'S HAND IS TOTAL.** Every answer is a hearing the DM may leave, tilt or decide (requirement 24); the arms stance has a DM verb (`SET_PASSAGE_STANCE`, §8); every permit, crossing and archive row is undone by the advance's undo and survives regenerate and import by the edits-delta idiom (requirement 14); the DM's hand at a hearing is the last word on the answer AND on the mover's road (one card, both choices). Surprise is safe because the DM can undo any advance, edit any state and decide any hearing (fold requirement 16's bracket).

---

## §2 THE ONTOLOGY

Every vocabulary below is closed; every token was searched on master (`cure/L-PS-probe/tokens.out`, `tokens2.out`, `literals*.out`) and against the fold §5. LANDED tokens are reused in their landed meaning or avoided; homonyms are registered in §15.

### 2.1 The unit and its key
`PASSAGE_MOVER_KINDS` = `army · column`. An `army` is an `armyTransit` record (`unitKey = 'army:' + armyId + ':' + departTick` — the march identity, so a re-seeded march is a new unit; `armyRouteId`'s idiom in `armyTransitKernel.js`). A `column` is a WC military column (`unitKey = 'column:' + columnKey(o, d, t)` — `migration.js :: columnKey`, "one record per origin→dest per dispatch tick"). The unit's SIZE is its aggregate strength (`record.strength` for an army; the column's carried strength when WC-6 names it).

### 2.2 The rung
`PASSAGE_STANDING` = `ally · stranger · enemy` (PS4). Derived per (holder, mover) per read by `passageStandingOf(worldState, snapshot, holderId, moverId)` from `belief(holder, mover).allianceLabel` (truth when beliefs are dark), the live treaty terms on the pair (`mutual_defense` → ally; `non_aggression` keeps a stranger a stranger but lowers the reserve, §4.3), and PL's walk (`polityOf`: one polity, no believed `hostile` → ally). `ally` and `enemy` reuse the generation's landed relationship literals (`settlementNarrative.js`) and PT's `declaredStance` in the SAME sense; `stranger` is FREE as a literal (prose in 54 files).

| Believed label (or fact) | Rung |
|---|---|
| `allied` · `vassal` · `patron` (either end of the sworn link) · a live `mutual_defense` term · members of one polity (PL1) | `ally` |
| `trade_partner` · `neutral` · `client` · `rival` · `cold_war` · `criminal_network` · no belief record (`unknown`) | `stranger` |
| `hostile` | `enemy` |

### 2.3 The answers — how it is received
`PASSAGE_ANSWERS` (closed, eight):

| Answer | Who can receive it | What it means | What it writes (§7) |
|---|---|---|---|
| `welcomed` | an ally, under tolerance | let through with the reservation terms of §2.6 | the crossing opens; spend begins |
| `granted` | a stranger (asked) or an ally beyond the reservation | let through on the PERMIT's terms | a permit; the crossing opens |
| `granted_under_watch` | a stranger or ally whose size or record worries B | let through, and B sends its own escort to walk beside — a DECIDED act at B's cost (the escort's strength is subtracted from B's home defence for the weeks it walks) | a permit with the `escort` term |
| `tolerated` | anyone not an enemy, when B chooses neither to permit nor to fight | B answers nothing and does not contest; never consent | a small grievance on B's court (resentment toward A); no permit |
| `refused` | a stranger, or an ally beyond tolerance | B says no and does not mobilize | none until A chooses its road |
| `refused_with_warning` | the same | B says no and makes ready: the readiness signal `armsNear` (§7.4) | readiness accrues while the unit stands at the border |
| `barred` | anyone, incl. an enemy | B's forces move to block: the field contest (`armies_meet` when B has an army afield; else the unit meets B's home defence at the gate, §7.5) | the war's own outcomes |
| `demanded_to_leave` | a guest whose tolerance or permit is spent | B tells it to go; refusing the demand is a BREACH (§7.2) | the crossing's clock to leave |

[REFINED 2026-10-18 (fp-final) — the brief's `contested` is LANDED as the occupation ladder's first state (`occupation.js`: "A fresh conquest STARTS at `contested`") and the `occupation_contest` hearing shares the docket; the answer is `barred` (FREE as a literal).] `tolerated` is a same-sense homonym of the magic legality `tolerated` (`magicProfile.js`: allowed without endorsement) — registered, another surface. `refused` and `granted` are reused in their landed sense (a court refusing or granting an ask: the pact state `refused`, the prose lexicon `granted`).

### 2.4 The mover's roads and the trespass causes
`PASSAGE_ROADS` = `complied · rerouted · waited · turned_back · trespassed` (all FREE as literals; `turned_back` 3 ledger-doc prose hits). `TRESPASS_CAUSES` = `hostility · defiance · urgency` (`defiance` FREE as a literal and PL7's same sense — defying a refusal; `hostility` a same-sense homonym of the landed pressure kind `'hostility'`, registered; `enmity` avoided: RN's regard band; `urgency` FREE as a literal). [REFINED 2026-10-18 (fp-final) — the brief's three causes kept; `turned_back` added because the brief's "may be impossible → return or wait" needs a road word.]

### 2.5 The unit's size against the holder — the ONE intensity ladder
`passageSizeBand(unit, holder)` = the unit's strength over B's home defence (`warCapacityReads.js :: buildCapacityLookup` — the `homeDefense` the siege verdict reads), banded on THE INTENSITY LADDER `unknown · quiet · present · pressing · decisive` (the walker's frozen rungs, `tests/lint/pressureLadderMints.walker.test.js`: "Reusing ONE intensity vocabulary across nine subjects is good design"): `quiet` < 0.25 · `present` < 0.6 · `pressing` < 1 · `decisive` ≥ 1 (DRAFT cuts, UNMEASURED). `unknown` until B's witnesses have seen it; an envoy's STATED size cap is a claim that sets the believed band until the unit is seen. [REFINED 2026-10-18 (fp-final) — no unit-size band exists on master; reusing the intensity ladder adds a subject, never a ladder.]

### 2.6 The terms
`PASSAGE_TERMS` (closed; a permit carries a subset): the RESERVATION every ally and every grant carries — `keep_to_road` (the unit stays on its declared path) · `no_foraging` (no requisition: the unit's supply is its own) · `no_halt_at_seat` (it never stops at B's own seat node) · `leave_by` (a week by which it must be out); the ASK's extras — `size_cap` (the unit may not exceed the band named) · `fee` (coin through the treasury when `treasuryEnabled` is lit: `treasury.js :: computeCoinTransfer` settlement→settlement; else a FAVOUR — a typed debt on the regard idiom, RULINGS-AFTER-RESEARCH §3: "Debts and favours ride the regard idiom with a typed reason") · `guarantee` (a hostage — the LANDED PARKED envoy kind `hostage_exchange`, `envoyTaskCatalog.js`; RECORDED as a slot, nothing designs on it: the term is offered only when that kind lands) · `escort` (B walks beside — `granted_under_watch`). All tokens FREE (`size_cap`, `keep_to_road`, `no_foraging`, `no_halt_at_seat`, `leave_by` 0 src hits; `fee` and `escort` as term ids are compound-scoped in the permit; `escort` is also a landed service word, another surface).

### 2.7 The derived reads (signatures; all pure, all in leaves under `src/domain/worldPulse/passage/`)
- `gateKeeperOf(digest, fromId, toId) → toId` (PS2's one swappable line).
- `passageNodesOf(path, originId, destId) → string[]` — the intermediate nodes (path[1 … n−2]).
- `passageStandingOf(worldState, snapshot, holderId, moverId) → { rung, label, source }`.
- `passageSizeBand(unit, holderId, ctx) → 'unknown'|'quiet'|'present'|'pressing'|'decisive'`.
- `toleranceOf(worldState, snapshot, holderId, unit) → { band, widthWeeks, reasons[] }` (§4.4).
- `passageAnswerOf(worldState, snapshot, holderId, unit, ask) → { answer, terms, score, reasons[] }` (§4.3; the DEFAULT verdict of every passage hearing).
- `moverRoadOf(worldState, snapshot, unit, holderId, answer) → { road, cause?, reasons[] }` (§5.2; the default of the mover's line on the same card).
- `believedPassageCost(worldState, snapshot, moverId, holderId, unit) → { weeks, priceBand, expected }` (§5.1; what A believes it will cost to cross B).
- `armsStanceOf(worldState, holderId, moverId) → 'open'|'taxed'|'restricted'|'closed'` (§8).
- `witnessedCrossing(worldState, holderId, gateKey, unit, tick) → boolean` — THE PATROLS' read (PS8); `true` until PR lands.

### 2.8 The persisted shapes — ONE ledger, three keyed maps (`spatialLedgers.passages`, drop-when-empty)
The ledger nests under `spatialLedgers` (the FP-R namespace: "ZERO eager first-paint bytes", the `armyTransit` precedent) and is ABSENT whenever it would be empty (the dormancy floor: no key, never an empty container).

| Map | Key | Row (closed fields) | Bound |
|---|---|---|---|
| `permits` | `permitId = fnv([holderId, moverId, unitKey, fromTick])` | `{ permitId, holderId, moverId, unitKey, answer ('welcomed'·'granted'·'granted_under_watch'), terms: PASSAGE_TERMS[], sizeBand, fromTick, leaveBy, source ('ally'·'request'·'border'·'treaty'), hearingRef? }` | at most one live permit per (holder, unit); expired permits are DROPPED at the unit's exit (the archive row keeps the fact) |
| `crossings` | `unitKey + '>' + holderId` | `{ unitKey, moverId, holderId, gate: [fromId, holderId], enteredTick, state ('awaiting'·'held'·'crossing'·'overstayed'·'trespassing'·'unwitnessed'), answer?, road?, cause?, spentWeeks, holdWeeks, witnessed (bool), causedBy }` | one row per live unit per territory it stands in or waits at; dropped at exit |
| `archive` | `holderId + '<' + moverId` (directed) | rows `{ rowId, tick, kind ('kept'·'broken'·'trespassed'·'overstayed'·'refused'·'barred'), cause?, unitKey }`, newest first | ≤ 8 rows per directed pair (the `allianceCalls` bounded-archive idiom); a row older than 104 weeks is dropped at write (requirement 23's horizon, DRAFT) |

`state` words: `awaiting` (landed prose word, 43 files, no literal; same sense: waiting on an answer) · `held` (a landed word in other surfaces — the roads hostage "held"; here a compound-scoped crossing state, registered) · `crossing` · `overstayed` · `trespassing` · `unwitnessed` — all FREE as literals except as noted.

Shapes reused, not new: the PASSAGE REQUEST rides the errand ledger as one `ERRAND_CONSUMERS` row (§6.1, the landed shape); the STANDING RIGHT `passage_rights` rides the treaty instrument (a new `TERM_CATALOG` row, §6.4); every hearing rides SP-9's pending ledger; a hold is the armyTransit record's own two clocks (PS9). **Persisted shapes: THREE new (the three maps of one ledger); FOUR rows added to landed shapes (the errand consumer row, the catalog row, the casus pair, the archive's fold into the relationship writer's patches — scalar only).**

---

## §3 THE LADDER AND THE RECEPTION — what moves the answer

Every input below is an EXISTING read, named; each moves the answer as a bounded lean with a reason the card can name (requirement 10's risk posture: "a state-derived" input on every decision surface).

| What moves it | The read (belief or truth, named) | Direction |
|---|---|---|
| The believed label (the rung) | `belief(B, A).allianceLabel` (belief); PL's walk (truth of B's own contracts) | ally → welcome under tolerance; stranger → reserve applies; enemy → incursion |
| The unit's size against B's strength | `passageSizeBand` (§2.5) over B's own `homeDefense` (B's own strength read true) and the unit as witnessed | `pressing`/`decisive` → toward refuse, warning or bar; a weak or ILLEGITIMATE seat (`publicLegitimacy.score` low — the landed read feeding the coup's `govMultiplier`) fears any army: one band harsher |
| B's own war state | B's own deployments, sieges and incursions (truth: B knows its own wars) | at war ABROAD → wider for allies and for its enemy's enemies (§4.4); at war AT HOME → none for all but its liege |
| The DESTINATION (a claim) | A's stated destination D (envoy or gate), read against B's OWN contracts with D | relieving B's friend → welcome (lean +); marching on B's friend → refuse (lean −−; `barred` if B is pact-bound to defend D); marching on B's enemy → welcome (lean +) |
| The ruler's temperament | `warSeatBooks.js :: readWarSeatBooks` temperament term (the ruler biases), class `passage_of_arms` | a martial or insular ruler leans refuse; a diplomatic ruler leans grant |
| The liege and the crown | PL's one foreign book (`foreignBookFor`): `liegeStanceToward(liege, A)` at `POLITY_LIEGE_SHARE[band]`, the paramount at reach `r` (PL4, PL5) | the crown at war with A → refuse; the crown allied to A → grant; granting the crown's enemy is PRICED as defiance (PS14) |
| A's record on B's land | the archive (§2.8): `kept` rows raise trust in the answer; `broken`, `trespassed`, `overstayed` lower it; the arms stance (§8) | a clean record → wider; a trespasser → narrower or closed |
| Faith and culture distance | `cultureDistance.js` (derived: faith, alignment, economy, government, shared rites) | far → harsher one step (DRAFT weight) |
| The envoy's person | CH's diplomacy gift and RN's envoy relief through `reserveFor`'s ONE shared seam leaf (CH §6: "composed through ONE leaf per seam with a joint cap and a fixed order (RN's lean, then CH's)") | a renowned envoy lowers the reserve |
| A habit | HB's habit curve at court grain (`habitCurve.js :: applyCredit`): "Ashford always lets Kell through" — repeated `kept` passages condition the answer | toward the habitual answer (bounded, HB's own law) |
| The DM's hand | the hearing (§9) | any answer |

What NEVER moves it: the truth of A's intentions (only its claims), any third party's label (PL16), the map's sway (PS2), a patrol drawn on the map (HR:505), the party's presence (the party is not a passage actor; a party deed may move regard, which moves the record — RN's door, not this volume's).

---

## §4 THE BORDER READ AND THE COURT'S ANSWER

### 4.1 THE TRANSIT LEAF STAGE (per tick; spatial canon) — the one mount in `armyTransitKernel.js`
**Car-0 (the leaf-first car, owned by whichever of PS-0 and WC Arc A lands first):** extract `battleInputs` and `fieldBattleNews` (42 effective lines on the byte slice, `cure/L-PS-probe/fieldBattleNews.slice.js`; PLAUSIBLE that the move is behaviour-neutral until the extraction's byte-identity pin runs) into `worldPulse/armyFieldBattleNews.js`; the host drops to ~758. **STOP condition (S-a):** if the extraction cannot free ≥ 4 effective lines without moving behaviour, STOP — no other host can hold a column in place (the position is computed only here). **Then** ONE call and its import: `({ records, worldState, newsEntries: leafNews } = runTransitLeaves({ records, priorRecords: prior, worldState, snapshot, digest, graph, tick: nowTick }))` placed after DERIVE + ADVANCE and the COURIER UMBILICAL and before COLLISIONS — so a held column is held before contact is read. `worldPulse/transitLeafStage.js :: TRANSIT_LEAVES` is a CLOSED registration list (pinned; the ONE PERSON STAGE idiom): PS's `passageBorderLeaf` and WC Arc A's `armiesMeetLeaf` (fold §3.4: "both armies HOLD at contact for the hearing week"), in that order (a column held at a border cannot meet beyond it). Each registrant gates on its own flag first; with every registrant dark the stage returns its inputs by reference (byte-identical by construction).

**What `passageBorderLeaf` does each tick, per record (codepoint order by `armyId`), when `passageEnabled` is lit:**
1. **At seeding** (a record new this tick): compute `passageNodesOf(path)`; for each node, the permit already held (a standing `passage_rights` term → `open`; an ally → `welcomed` pending tolerance) or nothing. The route itself was already chosen passage-aware by PS-4 (§5.1) when that wave is lit. The mover's envoys for its strangers were sent by the court stage (§4.2) when the deployment was decided — the transit leaf never mints an errand.
2. **Each tick:** `i = round(position01 × (path.length − 1))` (`currentRegion`'s own rounding); the NEXT node `N = path[i + 1]`. If `N` is an intermediate node and the record has no live crossing for `N`, the unit is AT N's GATE this tick: the leaf reads `witnessedCrossing`; if unwitnessed, it writes an `unwitnessed` crossing (no hearing; PS8) and lets the unit pass. If witnessed: an `ally` with tolerance remaining → `welcomed` (the contract's answer: a crossing and a permit of source `ally`, no card — §9, OD-PS-21); a live permit or a standing right → proceed; a pending request (`awaiting`) → HOLD this week (PS9) and wait for the court stage's answer; nothing → `passage_at_the_border` (§9) with the default from `passageAnswerOf` and `moverRoadOf`, and HOLD for its hearing week at a one-week advance; an `enemy` → open the `armed_incursion` crossing (STANDING; no hold — an enemy does not wait to be refused).
3. **Holding** is the clock shift of PS9 on the record (`departTick + 1`, `arrivalTick + 1`, `position01` restored to the prior value), counted into the crossing's `holdWeeks` and the march's cumulative hold; at the cap the leaf offers no `waited` road.
4. **Inside a territory** (a live crossing in state `crossing` or `trespassing`): spend tolerance by `size × weeks` (§4.4); spent out → mint `passage_overstayed`; past the permit's `leave_by` → the same.
5. **On exit** (the unit's index passes the node): close the crossing and write ONE archive row (`kept`, `broken`, `trespassed`, `overstayed`) and the relationship outcome (§7) — or nothing for B if the crossing was `unwitnessed` (A's own archive row only, keyed `moverId<holderId` with kind `trespassed` and `witnessed: false`).
6. **Reroute** (the road `rerouted` chosen by a hearing or the default): the leaf replaces `path` from the current node with `routeAvoiding(digest, current, dest, [N])` (§5.3) and recomputes `arrivalTick` from the current tick by `armyMarchWeeks` (the estate's ONE march derivation), refusing the reroute if PS9's bound would break.

**Retreats** (`role === 'retreat'`): never ask, never wait; any witnessed crossing of a stranger's or enemy's land on the way home is `trespassed` with cause `urgency` (a mauled army fleeing), an ally's is `welcomed` without spend (a friend lets the beaten home). [REFINED 2026-10-18 (fp-final) — not in the brief; a routing column that stopped to ask would contradict the retreat's own law ("routing home mauled", `hostilePairFor`).]

### 4.2 THE COURT STAGE (weekly; every preset where the flags are lit) — `settlementLifecycleKernel.js`, beside the pact stage
`passage/passageCourt.js :: advancePassageCourts({ worldState, snapshot, tick, rng })`, a stage beside `advancePeacetimePacts` (own-flag-before-host-gate; +2 host lines: the import and the call; host 735 → 737). Each week, in codepoint order:
1. **The envoy ahead (the mover's side, §6.1):** for every deployment that will march (the war layer's deployments ledger; read-last/write-next — the deployment seeded last tick) or every WC column about to dispatch, for each STRANGER on its believed path (A's belief, §5.1), mint ONE request errand through the errand spine's one head (the `ERRAND_CONSUMERS` row `passage requests`) unless a live permit or standing right exists.
2. **The answer at the dwell:** for every request errand whose envoy has dwelt its week at B's seat (the errand spine's dwell — the same "one-week dwell" the `pact_acceptance` row names), mint `passage_request` (§9) with the default from `passageAnswerOf`; at the next advance the seal or the default writes the permit (or the refusal) and the envoy's return leg carries the answer home (the errand spine's return; A learns the answer when the envoy is back or the unit reaches the gate, whichever is first).
3. **Overstays the transit leaf minted** are answered here at the next advance (`demanded_to_leave · tolerated · barred`); a `demanded_to_leave` the guest ignores for one week is a BREACH (§7.2).

### 4.3 THE ANSWER READ — `passageAnswerOf` (pure; the default of every passage hearing)
The holder's answer is a score against its RESERVE:
- **The reserve** is the landed `reserveFor({ worldState, responderId: B, proposerId: A, tick })` — B's posture × risk appetite, raised by A's oathbreaker credibility ("They will not treat with this court on its word alone") — with CH's and RN's envoy leans through its one shared seam leaf when the ask came by an envoy. ONE court-reluctance law. [REFINED 2026-10-18 (fp-final) — reuse of the landed reserve instead of a passage-specific threshold.]
- **The offer** is what the passage brings B: the destination lean (§3: relieving B's friend +, marching on B's enemy +), the fee or favour offered (a band, `none · token · handsome` — the request's own field, DRAFT; census owed at PS-1's car-0; `fair` avoided because the tolerance band uses it), the liege's stance (PS14), A's record (§2.8 archive: kept +), a habit (HB), a `non_aggression` term on the pair (+, DRAFT).
- **The threat** is what it costs B: the size band (`present` −, `pressing` −−, `decisive` −−−), B's legitimacy (low → the threat counts one band more), the destination lean (marching on B's friend −−), culture distance, the arms stance (§8: `restricted` −, `closed` → refuse outright).
- **The answer** (fixed order, first match): rung `enemy` → `barred` if B can field anything (home defence > 0), else `tolerated` (B cannot contest; the incursion still opens) · arms stance `closed` → `refused` (`refused_with_warning` if size ≥ `pressing`) · rung `ally` with tolerance remaining (§4.4) → `welcomed` · offer − threat ≥ reserve + `WATCH_MARGIN` → `granted` · ≥ reserve → `granted_under_watch` when size ≥ `present` or the record holds a `broken`/`trespassed` row, else `granted` · ≥ reserve − `TOLERATE_MARGIN` and B's posture is not martial → `tolerated` · size ≥ `pressing` or the destination is B's friend → `refused_with_warning` · the destination is B's pact-bound friend and B can field strength ≥ the unit → `barred` · else `refused`. Every margin DRAFT, UNMEASURED, FP-46 roster. The AT-THE-BORDER ask is the same read with two shifts: the reserve rises one step (the army on the doorstep "is a pressure") and every `granted` becomes `granted_under_watch` when size ≥ `present` — slower and less generous, as the brief rules.
- **Receipt:** the three strongest reasons, in the world's words ("Ashford fears so large a host"; "Kell marches to relieve Ashford's friend"; "the crown of Merewick is at war with Kell").

### 4.4 TOLERANCE — `toleranceOf` and its spend
- **Width** (weeks of passage for a unit of `present` size; DRAFT, UNMEASURED): `none` 0 · `scant` 2 · `fair` 4 · `wide` 8. **Composition, fixed order:** start `fair` for an ally (a stranger with a permit carries its permit's `leave_by` instead, no width); B at war ABROAD → one band wider (for an ally, and for a stranger who is its enemy's enemy, which also lifts that stranger to the ally treatment for tolerance only); B at war AT HOME (a siege or incursion in its own land) → `none` unless A is B's liege; size `pressing` → one narrower, `decisive` → two; the liege's stance toward A at war → one narrower, allied → one wider; the archive: any `trespassed`/`broken` in horizon → one narrower, three `kept` and none broken → one wider; the ruler's temperament (martial/insular → one narrower). Clamped to the four bands.
- **Spend:** each week inside B's land the crossing adds `sizeWeight(size)` weeks (`quiet` 0.5 · `present` 1 · `pressing` 2 · `decisive` 3, DRAFT) to `spentWeeks`; when `spentWeeks ≥ width` the crossing turns `overstayed` and mints `passage_overstayed`. Tolerance is RECOMPUTED each week (if B goes to war at home, an ally's width collapses to `none` that week and the guest is overstayed at once — the "war at home" sentence fires).
- **Wartime widening is the owner's word** ("which is increased during wartime"): the widening is ONE band for an ally whose holder is at war abroad, and the widening is visible on scrutiny ("Ashford is at war, and lets its friends' soldiers stay longer").
- **The counterforce** (requirement 2): size, the archive and war at home narrow it; nothing widens it beyond `wide`; the spend is monotone within one crossing.

---

## §5 THE MOVER — planning, the five roads, the three causes

### 5.1 The believed cost of a crossing (PS-4) — what A weighs before it marches
`believedPassageCost(worldState, snapshot, A, B, unit)` = A's belief of the answer it will get (A's believed rung with B — `belief(A, B).allianceLabel` — and A's believed size band against B's believed strength band, `strengthOfBand(belief(A, B).strengthBand)`), the envoy's weeks there and back (the errand spine's own leg time, `hopWeeks`), and the PRICE of a trespass (the casus B would hold, the regard fall, and — when B is a member — the liege's protection duty, PS14). It enters the march's ROUTE CHOICE as a third term beside danger and toll: `planMarch` (in `armyTransit.js`, 340 eff) calls `passage/passageRoute.js :: choosePassageRoute(digest, worldState, origin, dest, riskTolerance, season, unit)` when `passageEnabled` is lit — the same three cached candidates `chooseRoute` re-scores, each re-scored with `Σ believedPassageCost` over its intermediate nodes (a refusal-expected stranger costs its envoy weeks + the expected wait; an enemy costs its believed contest; an ally costs nothing). Dark → `chooseRoute` verbatim (byte-identical). The DECLARATION of a march (whether to go at all) is the war chooser's: where a passage term should weigh in it, it rides THE CHOOSER'S SHARED-SIGNAL CAR (SX-08; `settlementStrategy.js` 763 takes nothing of PS's own). [REFINED 2026-10-18 (fp-final) — the brief named "`warDeployment`'s route choice"; measured, the route is chosen in `armyTransit.js :: planMarch` (`warDeployment.js` mints the deployment; the transit kernel plans the march), so the planner's car is a leaf call inside `planMarch`, zero lines in the 798 kernel.]

### 5.2 After a refusal — `moverRoadOf` (the mover's line on the same card)
Scored in A's belief, fixed order, first match (every weight DRAFT, UNMEASURED):
1. **`trespassed` for `hostility`** — the rung is `enemy` (no request was possible): the crossing IS the incursion (§7.5); there is no refusal to defy.
2. **`trespassed` for `urgency`** — the unit is a relief (its destination is besieged, or a WC-5 call-in with a clock) and the RELIEF CLOCK cannot afford the detour: the weeks a reroute adds (or the wait) exceed the believed weeks the besieged friend can hold (the siege's own fall-odds word, `warDeployment.js :: siegeFallOddsWordFor`, as A believes it), and the price (the casus, the regard fall) is below the value of the relief (A's stake in the destination). The receipt says both halves ("Kell's column would not wait: Ashford's walls are near to falling").
3. **`complied`** — the answer was a grant with terms A can keep (the size cap fits; the fee is payable; the escort is acceptable to A's temperament).
4. **`rerouted`** — `routeAvoiding` finds a path without B whose added weeks are below A's patience and within PS9's bound.
5. **`waited`** — a pending answer, a short refusal (B's war at home may end), and the march's hold cap not yet spent.
6. **`trespassed` for `defiance`** — A is not B's enemy and chooses to cross anyway: A's martial or chaotic temperament (`settlementAlignment` — `lawfulness01` low, `malice01` high), A's contempt for B's strength (A's size `decisive` against B as A believes it), and A's low regard of B (RN's court regard when lit). PRICED (§7.3).
7. **`turned_back`** — nothing else is open: the unit goes home (the deployment is withdrawn through the war layer's own recall: `warIntent.js :: stampDeploymentRecall`, cause `passage_refused` — a new cause ROW in the landed recall vocabulary, registered at PS-3), or holds where it stands when home is unreachable.

### 5.3 The reroute read — ONE new export
`distanceRead.js :: routeAvoiding(digest, fromId, toId, avoidIds)` → `{ path, cost } | null`: the landed module-private `shortestPath(adj, from, to, blockedEdges)` with `blockedEdges` = every edge incident to an avoided node (a node-avoiding detour the three edge-removal candidates cannot guarantee: "Remove each edge of the primary in turn → the cheapest detour around it"). Memoized per digest like `candidateRoutes`. Host 544 → ~560 eff. Over the FROZEN digest only — never re-pathfound against the live world (the M1 law) — and re-scored for danger by `scoreRoute` like any candidate.

### 5.4 The column arm (WC-6, WC-5)
When WC-6 mints a military column, its producer asks THE PASSAGE once, at DISPATCH, over the column's derived path (`chooseRoute` on the frozen digest at the dispatch tick): every intermediate holder's answer is computed by `passageAnswerOf` with the column as the unit; a refused node reroutes or delays the column's `arrivalTick` (the column carries no position, so its crossing is judged whole at dispatch, and its hearings are minted that week, WHERE = each gate). A column's `veteran_return` homecoming is an ally's `welcomed` wherever the ladder reads ally, and a stranger's `granted` at the border by default (soldiers going home are rarely refused; DRAFT lean). This arm is BUILT IN WC-6's COMMIT through PS's reads (PS owns the reads; WC owns the producer).

---

## §6 THE ASK — the envoy ahead, the border, the permit, the standing right

### 6.1 The envoy ahead (PS-1) — one errand consumer row
`ERRAND_CONSUMERS` gains `{ consumer: 'passage requests', purposeClass: 'diplomatic', module: 'src/domain/worldPulse/passage/passageCourt.js', wave: 'PS-1', built: true }` (the GR-2 precedent: "A pact proposal is business on the road exactly as an embassy is — same class, same transit seam, same speed law"). The errand carries the REQUEST: `{ unitKey, route (the nodes through B), sizeCap (a band; a CLAIM), leaveBy (weeks), offer ('none'·'token'·'handsome'), stated destination (a CLAIM), termsOffered }`. The envoy rides the errand spine (interceptable on the road by the landed gauntlet; a lost envoy is a request never heard — the unit then asks at the border). The envoy is a person only where the person substrate lights (CH-r1-4: the errand-borne arms light with OD-FC-39's unit); otherwise the errand is the court's message on the spine, unchanged.

### 6.2 At the border
The unit at the gate asks for itself: `passage_at_the_border` (§9), the same read with the reserve one step higher and grants under watch for any unit of size `present` or more (§4.3). The army's presence is a pressure in both directions: a weak seat may grant out of fear (the size lean) and a proud one refuse out of affront (the reserve step).

### 6.3 The permit
A grant writes a PERMIT (§2.8): its terms, its `leaveBy`, its size band. Its counterforce is its own end: the permit expires at `leaveBy` or at the unit's exit, whichever is first. Breaking a term (§7.2) ends it at once.

### 6.4 The standing right — `passage_rights` (GRAMMAR's catalog; PS-1b)
`TERM_CATALOG.passage_rights = { family: 'passage', weight: 0.6, baseYears: 4, maxYears: 12, baseMag: 1.0, stream: false, executor: 'seam' }` (DRAFT numbers; its OWN family — neither commercial nor security, so it stacks with `market_access` and `non_aggression` under the one-per-family rule; the `amnesty`/`jubilee` precedent: "Each takes its OWN family"). Its executor IS the read: a live `passage_rights` term on the pair makes B's arms stance toward A `open` (§8) and every crossing of A's units through B a `granted` permit of source `treaty` with the reservation terms. Its PRODUCER is GRAMMAR's lens: `PACT_DRAFT_LENS.passage = [{ min: 0, terms: ['passage_rights'] }]`, an occasion the pact triggers raise when a pair has seen DRAFT two granted requests in a year (the demand) and no `broken`/`trespassed` row in horizon. Herald label: **"free road for soldiers"** (`humanTermType`). [REFINED 2026-10-18 (fp-final) — the brief had GRAMMAR's lens draft the one-off passage; TERM_CATALOG durations are years and one instrument per pair (V-1) would make every march a lineage act — the one-off is the permit (§6.3), the lens drafts the standing right; and the Herald may never say "right of passage", which is LANDED for `migration_right` (`humanTermType`: `case 'migration_right': return 'right of passage';`).] The catalog row needs a leaf car out of `peaceTerms.js` (799) only if the head must name it — it does not (the executor is a seam read in PS's leaf, the EC-6 precedent: "the executor IS the read; no ledger write").

---

## §7 WHAT IT WRITES — every consequence through its one writer

### 7.1 A passage kept
On a witnessed exit with every term kept: archive `kept`; ONE relationship outcome on the pair through the one relationship writer (`applyRelationshipPatch`, outcome-borne): trust `+PASSAGE_KEPT_TRUST` (DRAFT 0.02, UNMEASURED) — a small step; a habit credit at court grain (HB, `applyCredit`). The court-level deed is the relationship patch; a commander's deed waits on C4 (PS13).

### 7.2 Terms broken — the breach
A unit that FORAGES (its supply integrity falls below its own baseline while inside — the landed `supplyIntegrity` read — and B's stores drop; DRAFT test), HALTS at B's seat node, exceeds its `size_cap` (a witnessed band above the cap), or IGNORES `demanded_to_leave` for one week BREAKS the permit: archive `broken`; resentment `+PASSAGE_BROKEN_RESENTMENT` (DRAFT 0.08); the casus `passage_violated` for B against A (§7.3); between ALLIES the breach is the LANDED alliance breach road (a broken reservation between pact partners is a treaty breach: the `treaty_breach` registry row's own writer, never a second breach law); the permit ends; the crossing turns `trespassing`.

### 7.3 A trespass — the casus and its mirror
A witnessed `trespassed` (any cause) writes: archive `trespassed` with its cause; the casus `passage_violated` (a NEW pair in the closed reasons taxonomy, registered FIRST at PS-3 across the five walker surfaces — `warReasonTaxonomy.js` · `warReasons.js` (the scorer, reading the archive's in-horizon `trespassed`/`broken` rows) · `peaceReasons.js` · `warTerminationCauseTables.js` (dissolution mode) · `display/warAndRoadNames.js` (the two prose clauses)) with its peace mirror `passage_redressed` (the mirror keeps the passage as its subject — "the passage was redressed" — the `atrocity_*` precedent: "the mirror keeps the atrocity as its SUBJECT"; redress = a later kept passage or a reparation term between the pair). `passage_violated` is DERIVED (never DM-declarable: it rests on a durable fact, the archive row — the `NON_DECLARABLE_WAR_REASON_TYPES` reasoning). By cause: `hostility` writes nothing extra (the war already exists; the incursion is the war's own act); `defiance` writes resentment `+PASSAGE_DEFIANCE_RESENTMENT` (DRAFT 0.10) and a credibility charge on A's court (a `defiance` charge on the CREDIBILITY STOCK — the one landed quantity for a court's standing abroad, read by `reserveFor` through `credibilityScoreOf` — through the same charge door CH's `covert_hire_exposed` uses; PLAUSIBLE until PS-3's car-0 names that writer, STOP if it needs a new persisted field); `urgency` writes resentment at HALF that size (the world understands a relief's haste; DRAFT) and the receipt names the clock. Under PL: the trespassed member's LIEGE takes the same casus at its liege share (the polity's body), and RN's body derivation carries the regard fall to the members where RN's regard is lit (RN7: "A body feels what its people of power feel").

### 7.4 The warning — `armsNear`
`refused_with_warning`, a witnessed `trespassing` or `overstayed` unit, or an `armed_incursion` lights ONE fourth presence signal in `martialReadiness.js :: threatEnvironment01` — `armsNear` (DRAFT weight `THREAT_ARMS` beside `THREAT_FRONT`, `THREAT_OCCUPY`, `THREAT_RAID`) — on B (and B's relationship neighbours, the landed adjacency). Readiness accrues by the landed ratchet; nothing writes `warPosture` (B makes ready; it does not declare). Exactly 0 when no passage crossing is live (the module's neutrality theorem holds).

### 7.5 The incursion — an enemy in the land
An `enemy` unit witnessed in B's land opens the STANDING `armed_incursion` (§9): each week B's answer is `barred` (B moves to block: when B has an army afield, its deployment is pointed at the incursion and the field contest is WC's `armies_meet`; when it has none, the unit meets B's home defence at the gate as a field battle by the landed resolver `resolveFieldBattle` with B's home defence as the defender and full defender's ground — DRAFT; the loser's strength writes back as every field battle's does) or `unopposed` (B lets it pass and holds its walls). While the incursion stands, the enemy feeds MN5's ONE presence term at every node it stands in (the third feeder: the max of feeders, capped once; sized to cross `ENTER_THRESHOLD` like a menace "travelling" a road — DRAFT 0.60), so every danger consumer follows on its own: the roads gauntlet, route choice, banditry, migration road deaths, the landed FLIGHT (people leave an embattled town by the landed flight; PS writes no flight). The war's own border incidents and supply raids are untouched (they are the war's). A MEMBER's incursion is an input on the polity's decided relief (PL §4.3's one relief decider, its WAR arm and its gates: `warLayerEnabled ∧ allyDefenseEnabled`).

### 7.6 Tolerated, refused, barred — the small prices
`tolerated` writes resentment `+PASSAGE_TOLERATED_GRUDGE` (DRAFT 0.02) on B toward A (the lord grumbles; a silence is never free). `refused` writes an archive row `refused` (the record of the ask) and no relationship move. `barred` writes an archive row `barred` and the field contest's own outcomes; if the barred unit is not B's enemy, A takes NO casus from being barred — a holder defending its own land against an unpermitted column is within its right (the asymmetry is the owner's "they simply do not heed the warning" — the trespasser bears the price).

### 7.7 Harbouring the crown's enemy (PS14)
A member that answers `welcomed`, `granted`, `granted_under_watch` or `tolerated` to a unit whose mover is at war with the member's LIEGE (truth of the liege's contract, read by the member through PL's walk) is priced AT ONCE: a `fealty_defied` row through PL's door (`outcome.metadata.fealtyRow` → `appendRelationshipFealtyRow`, PL §4.6) with `toId` = the mover and `episodeId` = the crossing's `unitKey`, and the deference patch PL7 names — WITHOUT the `fealty_break` proposal (PL7 defines the break by two acts; a passage is neither). PL's disposition confirms the row does not trip the break detector (open question 3).

---

## §8 THE ARMS STANCE — `armsStanceOf` and `SET_PASSAGE_STANCE` (PS-0) — `passageStanceEnabled`

ONE derived stance per DIRECTED pair (B toward A's arms), per read, NEVER stored (EC-6's law E9), on EC-6's words `open · taxed · restricted · closed`. **Precedence, closed table:**
1. A live war front between them, or B `hostile` toward A in belief → `closed`.
2. The DM's `SET_PASSAGE_STANCE` overlay on the pair → that word (the overlay wins until cleared; the edits-delta idiom).
3. A live `passage_rights` term → `open` (overrides 4–6, never 1).
4. Repeated trespass: ≥ DRAFT 2 `trespassed`/`broken` archive rows in horizon → `closed`; one → `restricted`.
5. B's liege's embargo of A's arms (the crown at war with A, PS14) → `restricted` at the liege's share.
6. A fee policy (B's court reads `taxed` when its dominant disposition channel is mercantile — the same tariff read EC-6 uses for goods, `tariffBand`) → `taxed`.
7. Else `open`.

**What each word does to a passage:** `open` — the ladder as written; `taxed` — every grant carries the `fee` term; `restricted` — no `welcomed` (an ally must ask; a stranger's grant is under watch); `closed` — every ask is `refused` (with warning if size ≥ `pressing`), and a crossing is a trespass. ONE vocabulary, TWO stances (goods and arms), both derived, both relationship-born, each with its own DM verb on the same overlay idiom: the word set lives ONCE — in EC-6's `tradeStance.js :: STANCES` when EC-6 lands first; if PS-0 lands first, it mints the frozen constant in a shared leaf `worldPulse/stanceWords.js` that EC-6 imports (the first-to-land-owns-the-leaf idiom, SX-08's) — OD-PS-9. plague-R7's slot: a quarantine verb, when built, reads the same words at the gate for people (the host's own verb with a stance input); THE PASSAGE's arms stance is not that verb and never stands in for it.

---

## §9 THE HEARINGS (requirement 24 — the engagement-registry rows THE PASSAGE owns; each registered in the wave that builds it)

| Kind | Owner (wave) | Climax tick | Verdict vocabulary | Class | WHERE (`ENGAGEMENT_WHERE_KINDS`) | Default verdict |
|---|---|---|---|---|---|---|
| `passage_request` | PS (PS-1) | the week the envoy has dwelt at B's seat (the errand spine's dwell — the same one-week dwell `pact_acceptance` names) | `granted · granted_under_watch · refused · refused_with_warning` | CLIMAX | `settlement` (B's seat, where the envoy stands) | `passageAnswerOf` (request form) |
| `passage_at_the_border` | PS (PS-1; `trespassed` joins at PS-3) | the week a witnessed unit reaches B's gate with no permit, standing right or ally welcome | B's line: `welcomed · granted · granted_under_watch · tolerated · refused · refused_with_warning · barred`; then, on a refusal, A's line: `complied · rerouted · waited · turned_back · trespassed` (+ its cause) | CLIMAX (one card, two lines — one fact, one hearing, the `armies_meet` idiom of `engage · withdraw_a · withdraw_b`) | `road (prev, B)` — the digest gate between the two territories (the host fact); `border_segment` replaces it only when H16's offer is lit on the owner's word | both lines from `passageAnswerOf` (border form) and `moverRoadOf` |
| `passage_overstayed` | PS (PS-2) | the week a guest's spend reaches its width, or its permit's `leave_by` passes | `demanded_to_leave · tolerated · barred` | CLIMAX | `country (B)` (MN's WHERE kind: "the land around one settlement") | `demanded_to_leave` unless B cannot field strength (then `tolerated`) |
| `armed_incursion` | PS (PS-3) | EVERY week an enemy unit stands witnessed in B's land | `barred · unopposed`, then the contest's own outcomes (WC's `armies_meet` when B's army takes the field; else the home-defence field battle, §7.5) | STANDING | `road (prev, B)` the week it enters; `country (B)` after | `barred` when B can field strength ≥ a `present` fraction of the unit (DRAFT), else `unopposed` |

[REFINED 2026-10-18 (fp-final) — the fold's WHERE table offers `border_segment` for THE PASSAGE's border hearings "offered only — the map's reading through H16, lit on the owner's word, never a host fact before it"; the host fact today is the digest gate `(prev, B)`, which is exactly the `road (a, b)` WHERE (the stretch between two settlements whose territories meet), so the card names a real place from the first lit week.] [REFINED 2026-10-18 (fp-final) — the brief's `incursion` is LANDED (`threatProfile.js`: `vector: 'incursion'` on `monster_pressure`); the kind is `armed_incursion`; its verdict `barred` replaces the brief's `contested` (the occupation ladder's landed first state).]

**Which answers are hearings.** Every DECIDED answer is a hearing. Two answers are not decided in the week because they were decided before it: an ALLY's `welcomed` under its tolerance (the alliance answered it when it was sworn) and a STANDING RIGHT's open road (the treaty's own hearing was its signing). Both write a crossing and a permit of source `ally` or `treaty`; the DM's hand over them is the arms stance verb (§8), the overstay card (§9) when the welcome runs out, and the undo. [REFINED 2026-10-18 (fp-final) — the brief's "every answer a hearing" read literally would mint a card for every friendly column on every friendly road; the contract's answer is the answer already heard (OD-PS-21).]

**Requirement 24's three choices on every card:** LEAVE it (the default above resolves at the next advance), TILT it (`slight · heavy` toward B's grant or refusal; on the mover's line toward pressing on or giving way), or DECIDE either line (the DM's word is the verdict; never "decree" — the Decree Registry's word). At a one-week advance the unit HOLDS for its border card's week (PS9) — the card is the pause; the enemy of an `armed_incursion` never holds (it is not waiting to be answered). MONTH, SEASON AND YEAR advances run the defaults in the tick they arrive and nothing queues; a long advance's chronicle carries each answer as one line (the push budget: passages are chronicle, never pushed, unless a casus or a battle follows — then the war's own headline carries them as its cause, CHAIR-NOTES 2). No PASSAGE kind is a party kind (the party is never a passage actor), so requirement 24's party default ("nothing has happened to the party yet") does not arise here. The proposals queue's anchor `targetSaveId` is always B (a real settlement); the mover rides the `subject` dial as `{ kind: 'settlement', id: A }` (RULINGS-AFTER-RESEARCH §4's actor-ref convention). The registry count rises by FOUR kind names in four rows (the fold restates it at P4).

---

## §10 THE FLAGS (virtual; absent-when-dark; read `=== true`; each lands with its certification row and its lit-mutant pins)

| Flag | What it lights | Host flags it requires (all `=== true` or the marker) | Presets it may light in | Lit-mutant pins (each reds when its arm is planted dark) |
|---|---|---|---|---|
| `passageEnabled` | the transit leaf's border read, the court stage, the four hearings, permits, crossings, the archive, tolerance and spend, the mover's roads, the writes of §7 (trespass and incursion at PS-3), the planner (PS-4) | the spatial canon marker (`armyTransitActive`); `warLayerEnabled` (deployments exist); `hearingWeekEnabled` for the pause (dark ⇒ every card resolves on its default in its own tick: the degraded arm); `errandSpineEnabled` for the envoy ahead (dark ⇒ border asks only); `polityPrecedenceEnabled` for the crown's voice (dark ⇒ B's own book); `polityObligationsEnabled` + `allyDefenseEnabled` for the protection input; `treasuryEnabled` for coin fees (dark ⇒ a favour); THE PATROLS' flag for unwitnessed crossings (dark ⇒ always witnessed) | `dramatic_campaign` and `full_simulation` — the presets that light `warLayerEnabled` — and only with the canon (PREMIUM: "the simulator is gated for premium"; "canonized ≠ premium" per HOST-r1-2's bracket — a free canonized campaign runs the free arm, where this flag is dark) | (1) a planted ally crossing with the flag dark ⇒ the dormancy golden reds; (2) a planted hold that breaks PS9's bound ⇒ the termination pin reds; (3) a planted second danger feeder outside MN5's max ⇒ the one-danger pin reds; (4) a planted hearing resolved in its own tick at a one-week advance ⇒ the docket walker reds; (5) a planted `contested`/`incursion` literal ⇒ the vocabulary census reds |
| `passageStanceEnabled` | the arms stance `armsStanceOf`, `SET_PASSAGE_STANCE`, the `passage_rights` executor and the lens's `passage` occasion, the closing of borders by repeated trespass | `passageEnabled`; `pactFormationEnabled` for the lens occasion (dark ⇒ the right exists only by the DM's hand) | as `passageEnabled` | (1) a planted stance key in a ledger ⇒ reds (derived, never stored); (2) a planted `passage_rights` over a war front ⇒ the precedence pin reds; (3) a planted `'right of passage'` label on `passage_rights` ⇒ the homonym pin reds |

**The omniscient default's arm, named (RULINGS-AFTER-RESEARCH §7):** in `realistic_regional` no army marches (the war layer is dark), so THE PASSAGE does nothing there — declared, byte-identical. Where the war layer and the canon are lit but infoMode is `omniscient`, every belief read returns the truth and every crossing is witnessed (no fog). **The host lighting-claim note:** "lit in a preset" is trusted only after the BIRTH-DOOR CHECK (CHAIR-NOTES 9: a born campaign carries the default preset's name but none of its switches) — the host side's first executed act.

---

## §11 THE WAVES (every wave: leaves · hosts · FIRST-VISIBLE · TIER · DEGRADED ARM · EDITOR · Alignment · `causedBy`)

**PS-0 — THE BORDER READ AND THE STANCE.**
- **Car-0:** the leaf-first extraction in `armyTransitKernel.js` (`battleInputs`, `fieldBattleNews` → `armyFieldBattleNews.js`, ~42 eff) with its byte-identity pin; STOP (S-a) if it cannot free ≥ 4 eff lines; THE TRANSIT LEAF STAGE `transitLeafStage.js` (`TRANSIT_LEAVES`, closed, pinned) and its one call + import (owned by whichever of PS-0 and WC Arc A lands first; the other registers). Census at car-0 of every PS token (`scant`, `handsome`, `stranger`) on the then-current master.
- **Leaves:** `passage/passageReads.js` (`gateKeeperOf`, `passageNodesOf`, `passageStandingOf`, `passageSizeBand`), `passage/passageLedger.js` (the three maps' normalizer, drop-when-empty, the archive bound and horizon), `passage/passageBorderLeaf.js` (PS-0 scope: ally entries `welcomed` under a placeholder width of `fair`, unwitnessed rows, exits writing `kept`), `passage/armsStance.js` (under `passageStanceEnabled`), `stanceWords.js` if EC-6 has not landed. **DM verb:** `SET_PASSAGE_STANCE` (realm verb: pair, stance, reason; `realmManifest` + `realmVerbExecution`; approval-routed; edits-delta overlay; round-trip pinned; the AI proposes it typed) — requirement 14 in the wave that ships the stance.
- **FIRST-VISIBLE:** the week an allied column enters a friend's land — the unit's piece on the map shows "in Ashford's land" (behind the armies toggle) and the chronicle line "Kell's column crossed into Ashford's land by the river road, as friends may" (latency: the tick of entry; requirement 16) · the pair card's stance word the tick the stance changes.
- **TIER:** spatial canon + `warLayerEnabled` (dramatic, full); premium; belief reads under the belief presets, truth under omniscient · **DEGRADED ARM:** aspatial — dark by absence (PS10), byte-identical; canon without the war layer — no units, nothing.
- **EDITOR:** (a) no habit-fork row (an ally's welcome is deterministic); (b) the predicates `passageNodesOf`, `passageStandingOf`; (c) real-only — a phantom (a believed army that does not exist) never crosses, and a menace is never a unit; (d) `SET_PASSAGE_STANCE`; (e) the crossing row and the archive row are the receipts, each with `causedBy`.
- **Alignment (requirement 13):** none at PS-0 (the welcome reads the rung); the stance's tariff step reads the dominant disposition channel (EC-6's read).
- **`causedBy`:** every crossing names the march's seed receipt (the deployment's `war_front` mint); every archive row names its crossing.

**PS-1 — THE REQUEST AND THE BORDER HEARING.**
- **Leaves:** `passage/passageCourt.js` (the court stage: the envoy ahead, the answer at the dwell, overstay answers), `passage/passageAnswer.js` (`passageAnswerOf`, the reserve via `reserveFor`, the offer and threat leans), `passage/moverRoad.js` (`moverRoadOf`: `complied · rerouted · waited · turned_back` at this wave), the holds of PS9 in `passageBorderLeaf.js`, permits. **Host edits:** `settlementLifecycleKernel.js` (+2: import + stage call, 735 → 737); `envoyErrandVocabulary.js` (+7: the `passage requests` row); `distanceRead.js` (+~16: `routeAvoiding`); SP-9's registry (`passage_request`, `passage_at_the_border`). **PS-1b** (under `passageStanceEnabled` ∧ `pactFormationEnabled`): `TERM_CATALOG.passage_rights` (+1 row, `peaceTermsCatalog.js` 117 → 118), `humanTermType` (+1 case: "free road for soldiers"), `PACT_DRAFT_LENS.passage` (+3 in `pactFormation.js`, 565 → 568), the seam executor in `armsStance.js`.
- **FIRST-VISIBLE:** the border card the week a column reaches a stranger's gate ("Kell's column stands at Ashford's border and asks leave to cross") · the request card the week the envoy has dwelt ("Kell's envoy asks Ashford's council for leave to march through") · after the verdict, the Herald line "Ashford refused Kell's envoy leave to cross; Kell's column turned toward the hill road."
- **TIER:** as PS-0, + `errandSpineEnabled` for the envoy (OD-FC-39's lighting unit, dramatic and full — CH-r1-4) and `hearingWeekEnabled` for the pause · **DEGRADED ARM:** no errand spine ⇒ border asks only; no hearing week ⇒ defaults in their own tick.
- **EDITOR:** (a) the habit-fork row `passage_answer` (B's answer, band-pinnable — "Ashford always lets Kell through" is its habit) and `mover_road` (A's road); (b) the predicates `atGate`, `requestDwelt`; (c) real-only; (d) the two hearings are the DM's acts; (e) the permit row and the hearing seal are the receipts.
- **Alignment:** B's answer reads B's `settlementAlignment` through the ruler temperament term (a lawful court grants an asked passage more readily to a lawful asker; a malicious court refuses a rival's); A's road reads A's (`defiance` at PS-3 is the chaotic/malicious arm).
- **`causedBy`:** the request card names the envoy's errand; the border card names the crossing; the permit names its seal; a reroute names the refusal.

**PS-2 — TOLERANCE AND OVERSTAY.**
- **Leaves:** `passage/tolerance.js` (`toleranceOf`, the spend), the overstay mint in `passageBorderLeaf.js`, the breach detection (foraging, halting, size cap, the ignored demand) and the alliance-breach hand-off to the landed `treaty_breach` writer. **Host edits:** SP-9's registry (`passage_overstayed`).
- **FIRST-VISIBLE:** the week a guest's welcome runs out — "Ashford has told Kell's soldiers to be gone from its land" · scrutiny: the tolerance band and the weeks spent in words ("Ashford's patience with so large a column was scant").
- **TIER:** as PS-1 · **DEGRADED ARM:** without the hearing week the demand resolves on its default.
- **EDITOR:** (a) the fork row `overstay_answer`; (b) `overstayed`; (c) real-only; (d) the hearing; (e) the archive `overstayed`/`broken` rows.
- **Alignment:** a lawful holder's demand is `demanded_to_leave` before `barred`; a malicious holder bars sooner (DRAFT lean).
- **`causedBy`:** the overstay card names the crossing and the week tolerance fell to nothing (e.g. B's war at home).

**PS-3 — TRESPASS AND INCURSION.**
- **Leaves:** `passage/trespass.js` (the writes of §7.2–§7.3, §7.6, §7.7), `passage/incursion.js` (the STANDING card, the home-defence battle input, the MN5 feeder row, the `armsNear` signal), `moverRoad.js` gains `trespassed` with the three causes (the relief clock read for `urgency`). **Host edits:** the five walker surfaces of the casus pair (`passage_violated ↔ passage_redressed`, registration-first); `martialReadiness.js` (+~6: `armsNear` in `threatEnvironment01` and its index); MN5's presence composer (the third feeder row, in MN's leaf — MN's commit or PS's, whichever lands second registers into the first's); the recall cause row `passage_refused` in the landed recall vocabulary; PL's door for the `fealty_defied` row (PL's commit owns the shape); the credibility charge door (named at car-0, PLAUSIBLE); SP-9's registry (`armed_incursion`).
- **FIRST-VISIBLE:** the week of a witnessed trespass — "Kell's spears crossed Ashford's fields without leave; Ashford counts it a wrong" · the week an enemy enters — "Merewick's host has entered Tolle's land in arms" (the STANDING card each week) · the relief's haste: "Kell's column would not wait: Ashford's walls are near to falling."
- **TIER:** as PS-1; the casus under `warLayerEnabled`; the polity arms under PL's flags; the regard fall under RN's `renownEnabled` and `npcConsequencesEnabled` (persons) · **DEGRADED ARM:** without RN, the court-level relationship patch alone; without PL, B alone takes the casus.
- **EDITOR:** (a) the fork rows `incursion_answer` and the cause pick inside `mover_road`; (b) `trespassing`, `inLandAsEnemy`; (c) real-only; (d) the two hearings; (e) the casus record, the archive row, the fealty row (PL's).
- **Alignment:** `defiance` is chosen by low `lawfulness01` and high `malice01`; a lawful mover prefers `waited`/`rerouted`/`turned_back`.
- **`causedBy`:** the casus names the archive row; the incursion card names the crossing and, weekly, the prior week's card; a field battle names the `barred` seal.

**PS-4 — THE MOVER'S PLANNING SIGNAL.**
- **Leaves:** `passage/passageRoute.js` (`believedPassageCost`, `choosePassageRoute`). **Host edits:** `armyTransit.js :: planMarch` (+~3: the flag-gated call; 340 → 343); the chooser car's PS term where the declaration should weigh a hard crossing (SX-08, the first chain to land owns the car; PS adds one term row). **The envoy ahead** reads A's PLAN (the chosen path) at PS-1; PS-4 changes which path is chosen.
- **FIRST-VISIBLE:** the week a march is planned around a hostile neighbour's land — the chronicle "Kell's host marched by the long road, around Ashford's land" (scrutiny: "Kell did not expect Ashford to let it pass").
- **TIER:** as PS-1 · **DEGRADED ARM:** dark ⇒ `chooseRoute` verbatim (the column asks or trespasses where it happens to go).
- **EDITOR:** (a) none (route choice is a deterministic re-score); (b) `believedPassageCost`; (c) a believed army never plans; (d) none — the DM redirects a march by the landed army verbs; (e) the march seed's receipt gains the passage reason.
- **Alignment:** the risk tolerance from alignment that `planMarch` already threads (`riskToleranceFromAlignment`) also scales how much an expected refusal weighs (a bold mover discounts it).
- **`causedBy`:** the chosen path names the passage costs that moved it.

**PS-5 — THE MEASURE.**
- **What it measures:** the FP-46 roster rows of §16 on the soak corpus (the widths, the size cuts, the margins, the resentment and trust sizes, the hold cap's binding rate, the trespass rate per cause, the share of answers per rung); the experience read (requirement 19): over a seed family, the share of lit worlds in which each felt sentence of §17 fires at least once; THE LEGIBILITY PIN (CHAIR-NOTES 4): every pushed line from this volume resolves to ≥ 1 hop in the cause walk; the push envelope (passages never pushed alone).
- **FIRST-VISIBLE:** none of its own (it measures the others) · **TIER:** the soak harness · **EDITOR:** none · **Alignment:** the per-cause trespass rates by alignment quadrant are reported · **`causedBy`:** the measurement's receipts cite the runs.

---

## §12 THE LIFECYCLE OF EVERY PERSISTED SHAPE (requirement 22a)

**L1 — `spatialLedgers.passages.permits`**

| Path | Behaviour |
|---|---|
| create | only `passageCourt.js` (a sealed or defaulted `passage_request`) and `passageBorderLeaf.js` (a border seal/default, an ally's welcome, a standing right's open road); refused dark |
| read | `passageBorderLeaf.js` (proceed or ask), `armsStance.js` (no — the stance reads the archive and the terms, never permits), the Why panel and the pair card (scrutiny) |
| persist | inside `spatialLedgers` (zero eager first-paint bytes); ABSENT when empty |
| regenerate | permits key on settlement ids; a DM regeneration that keeps ids keeps them; a row naming an id that no longer exists is dropped by the normalizer |
| undo | the advance's undo restores `spatialLedgers` whole (the snapshot undo); no separate undo path |
| import | the normalizer drops malformed rows and unknown terms (closed vocabularies); a permit whose `leaveBy` is past is dropped |
| migrate | none — a new key; absent ⇒ empty (every save before PS-0 reads as no permits) |
| dark-after-lit | `passageEnabled` dark ⇒ nothing reads or writes the ledger; it lies inert; relit ⇒ the first normalize drops every permit whose unit no longer marches or whose `leaveBy` passed (no stale permit re-applies) |
| death | the holder destroyed, razed or absorbed ⇒ its permits dropped at the next normalize; the mover's unit ended (battle, recall, arrival) ⇒ the permit dropped at the unit's exit |
| veil | permits are open acts between courts; no veil |

**L2 — `spatialLedgers.passages.crossings`**

| Path | Behaviour |
|---|---|
| create | only `passageBorderLeaf.js` (at the gate) |
| read | the transit leaf (holds, spend, exits), `passageCourt.js` (overstays), the incursion card, the danger feeder, the readiness signal, the map piece's "in X's land" line (behind the armies toggle) |
| persist | as L1 |
| regenerate | as L1 |
| undo | as L1 (a hold's clock shift lives on the armyTransit record, restored by the same snapshot) |
| import | as L1; a crossing whose `unitKey` names no live transit record is dropped |
| migrate | none |
| dark-after-lit | inert; relit ⇒ crossings with no live unit dropped; a live unit standing inside a territory with no crossing gets one at the next tick as if it had just entered — WITHOUT a hearing (a relit world never retro-mints a climax; requirement 24's "nothing queues") |
| death | the unit ends inside (destroyed, recalled) ⇒ the crossing closes with NO archive row unless a breach was already written; the holder destroyed ⇒ dropped |
| veil | an `unwitnessed` crossing is visible to the DM and to A's reads only; B's reads, B's cards and every belief built for B never see it (PS8) |

**L3 — `spatialLedgers.passages.archive`**

| Path | Behaviour |
|---|---|
| create | only `passageBorderLeaf.js` at an exit or a hearing's seal (append-only) |
| read | `toleranceOf`, `passageAnswerOf`, `armsStanceOf`, the casus scorer in `warReasons.js` (the in-horizon `trespassed`/`broken` rows), HB's habit credit, the Why panel |
| persist | as L1; ≤ 8 rows per directed pair (the `allianceCalls` bounded-archive idiom) |
| regenerate | as L1 |
| undo | as L1 |
| import | as L1; rows beyond the cap or the horizon dropped |
| migrate | none |
| dark-after-lit | inert; relit ⇒ read as written (history is history; THE PROMISE: lived history immutable) |
| death | rows naming a destroyed settlement are KEPT until the horizon (a razed town's grievances die with it only by age) |
| veil | rows written from an `unwitnessed` crossing carry `witnessed: false` and live under the MOVER's key only |
| **requirement 23 horizon** | 104 weeks (DRAFT, UNMEASURED; two years of memory for the stance and the casus, beyond which the relationship scalars — which decay by their own one law — are the only memory) |

**Rows added to landed shapes (no new shape):** the errand row of `passage requests` (the errand ledger's own lifecycle: the spine's mint, return, interception, expiry); the `passage_rights` term (the treaty instrument's own lifecycle: signing, repudiation, expiry, the V-1 lineage); the casus record `passage_violated` (the war-reason ledger's own decay and termination); the `fealty_defied` row (PL's shape 3, its lifecycle table); the hold's clock shift (the armyTransit record's own fields). **Requirement 14 (the edit story):** the stance has `SET_PASSAGE_STANCE`; permits, crossings and archive rows are ENGINE-ONLY BY RECORDED DECISION — every one is the outcome of a hearing the DM could decide, and the DM's correction is the hearing, the stance verb or the undo.

---

## §13 THE SCENARIO MATRIX (each row a pin family at its wave; a MEASURABLE assertion or DARK)

| # | Scenario | Assertion | Wave |
|---|---|---|---|
| P1 | ALL FLAGS DARK | the hashed dormancy golden over the soak corpus is byte-identical; no `passages` key on any world | PS-0 |
| P2 | ASPATIAL world, flags lit | byte-identical to the dark run (no transit record exists); zero passage rows | PS-0 |
| P3 | THE ALLY'S RELIEF COLUMN — Kell (allied to Ashford) marches to relieve Tolle through Ashford's land | one crossing `welcomed` (source `ally`), NO hearing, spend recorded, exit writes `kept` and one trust patch; no hold | PS-0/PS-2 |
| P4 | A THOUSAND SPEARS AT A WEAK SEAT'S GATE — a `decisive` stranger unit at a low-legitimacy seat | the default answer ∈ {`refused_with_warning`, `granted_under_watch`, `tolerated`}, never plain `granted` or `welcomed`; `armsNear` > 0 on B while it stands there | PS-1/PS-3 |
| P5 | THE ENVOY AHEAD — Merewick plans through Ashford (stranger) | a `passage requests` errand minted the week after the deployment; the request card minted the week the envoy has dwelt; a granted permit lets the unit pass with NO border card | PS-1 |
| P6 | THE BORDER ASK — the errand spine dark | a border card the week the unit reaches the gate; at a one-week advance the unit holds one week: `position01` equal across the hold, `departTick`/`arrivalTick` each +1 | PS-1 |
| P7 | THE REFUSAL AND THE HILL ROAD | refused ⇒ default road `rerouted`; the new path contains no node of B; `arrivalTick − sinceTick ≤ MAX_MARCH_WEEKS` | PS-1 |
| P8 | THE QUIET CROSSING UNNOTICED — THE PATROLS lit, no patrol on the stretch that week, a `quiet` unit | one `unwitnessed` crossing; zero rows, cards, casus or patches for B; A's archive holds `trespassed` with `witnessed: false`; with THE PATROLS dark the same crossing is witnessed | PS-0/PR |
| P9 | THE URGENT TRESPASS WITH ITS RECEIPT — a relief to a besieged friend whose fall is believed near | refused ⇒ default road `trespassed`, cause `urgency`; the receipt names the clock; resentment = half the `defiance` size; casus `passage_violated` registered | PS-3 |
| P10 | THE MEMBER HARBOURING THE CROWN'S ENEMY — a member grants a unit whose mover is at war with its liege | one `fealty_defied` row (toId = the mover, episodeId = the unit) and the deference patch; NO `fealty_break` proposal | PS-3 |
| P11 | THE CLOSED BORDER — two witnessed trespasses by Kell into Ashford within the horizon | `armsStanceOf(Ashford, Kell) === 'closed'`; Kell's next ask defaults `refused` (with warning if size ≥ `pressing`) | PS-0/PS-3 |
| P12 | LONG ADVANCE — a season advance with a column crossing three territories | every card resolves on its default in its tick; the docket is empty after the advance; no hold beyond the defaults' roads; chronicle lines only (none pushed) | PS-1 |
| P13 | WAR AT HOME — an ally guest inside Ashford when Ashford is besieged | width `none` that week ⇒ `passage_overstayed` minted the same week; default `demanded_to_leave` | PS-2 |
| P14 | THE INCURSION — Merewick (hostile) enters Tolle's land | one STANDING card per week; MN5's presence term at the node ≥ `ENTER_THRESHOLD` (the latch, not the rise); Tolle's `armsNear` > 0; a member Tolle ⇒ its liege's relief input present on the polity's relief card | PS-3 |
| P15 | THE TERMINATION BOUND — a column held at successive borders | cumulative hold ≤ `SIEGE_MAX_AGE − MAX_MARCH_WEEKS − 1`; at the cap `waited` is absent from the mover's options; every lit fixture's `arrivalTick − sinceTick ≤ MAX_MARCH_WEEKS` | PS-1 |
| P16 | THE RETREAT — a mauled army routing home through a stranger's land | never held; one `trespassed` with cause `urgency`; through an ally's land `welcomed` without spend | PS-3 |
| P17 | THE WHERE — every border card | WHERE = `road (prev, B)` carrying the digest gate's `cellA`/`cellB`; `border_segment` only with H16 lit | PS-1 |
| P18 | ONE DANGER — an enemy column and a menace in one town | the presence term equals the max of the two feeders, capped once (never the sum) | PS-3 |
| P19 | THE OMNISCIENT ARM — war and canon lit, infoMode omniscient | every crossing witnessed; every standing read from truth; byte-identical answers to a belief run whose beliefs equal the truth | PS-0 |
| P20 | THE STANDING RIGHT — a pair with `passage_rights` | stance `open`; every crossing a permit of source `treaty`; no card; the Herald never prints "right of passage" for it | PS-1b |

---

## §14 THE COUPLINGS (each with its seam named; each the sibling's to confirm in round 2)

| Sibling | The coupling | The seam |
|---|---|---|
| WC (war circulation) | the column union (`reinforcement_column`, `veteran_return`) are units; WC-5's call-in contingents cross lands to arrive (passage applies at dispatch, §5.4); WC-1 credits arrival after any reroute; WC Arc A's `armies_meet` follows a `barred`; ONE transit leaf stage for both | `transitLeafStage.js :: TRANSIT_LEAVES`; WC-6's producer calls `passageAnswerOf` |
| PL (the polity) | the `passage_of_arms` precedence class (the crown's voice, PS14); members stand as allies (PL §4.5); the liege's protection on an incursion (PL §4.3's relief input); harbouring priced (`fealty_defied`, PL §4.6) | `foreignBookFor` / `readWarSeatBooks({ decisionClass: 'passage_of_arms' })`; `appendRelationshipFealtyRow` |
| GR (grammar) | the `passage` occasion and the `passage_rights` term; the passage request's answer shares the pact answer's reserve | `PACT_DRAFT_LENS.passage`; `TERM_CATALOG.passage_rights`; `reserveFor` |
| EC (economy) | ONE stance vocabulary `open · taxed · restricted · closed` (EC-6); the tariff read for `taxed` | `stanceWords.js` / `tradeStance.js :: STANCES`; `tariffBand` |
| MN (the menace) | an enemy column is a third feeder of MN5's ONE presence term; a menace is never a passage actor (MN6) | MN's presence composer inside `advanceEmbattlement` |
| ST (the sites) | a fort on the approach is crossed under these rules (L-ST item 17: "a fort on the approach = its own site_siege the attacker takes or bypasses under the passage rules"); the gate's keeper stays the territory's settlement; a site's holder is not a passage holder unless the site is a settlement | ST's coverage table row for PS (round 2) |
| PR (the patrols) | the noticing read `witnessedCrossing`; patrols themselves move inside their own territory and are never passage movers unless a patrol crosses a foreign border (then PS applies as to any unit — PR's call) | PR's witness read |
| RN (renown) | a DEED_SOURCES slot row `passage` (doer: the mover court; kinds `kept · broken · trespassed`; witnesses: the territories crossed) so a trespass travels as a tale and regard falls by RN7's body derivation; the commander's fame waits on C4 | RN §3.1's slot table; `mintDeed` |
| CH (champions) | a paragon envoy's diplomacy lean on the request (through `reserveFor`'s shared seam); a captain paragon riding with the army carries the deed (C4) | CH §6 shared seam leaf |
| ES / IN | reports of a unit's size and purpose; a lie about the destination (IN's lie machinery, a slot on IN's inbox); interception of the envoy (the landed gauntlet) | IN's inbox row; `roadsKernel.js` PASS 3 (untouched) |
| HB (habit) | "Ashford always lets Kell through": the `passage_answer` habit-fork row | `habitCurve.js :: applyCredit` at court grain |
| THE HEARING WEEK (SP-9) | four registered kinds; the pause holds the unit (PS9) | `registerEngagementKind` |
| PG (plague) | plague-R7's quarantine verb, when built, reads the stance words at the gate for PEOPLE; THE PASSAGE never stands in for it | the slot |

---

## §15 THE TOKEN REGISTER (fold §5 rows THE PASSAGE asks the fold lane to add at P4)

| Token | Meaning here | Census (master `81f1cd963`) and note |
|---|---|---|
| `passage` (code) | a foreign military unit's crossing of a territory | FREE as a literal; PROSE homonym: "right of passage" is the Herald label of `migration_right` (`humanTermType`) and "Safe passage" a criminal service — PS's prose never says "right of passage"; its term reads "free road for soldiers" |
| `passage_request` · `passage_at_the_border` · `passage_overstayed` · `armed_incursion` | the four hearing kinds | FREE (0 files each) |
| `passage_rights` | the standing treaty term (family `passage`) | FREE |
| `passage_violated` ↔ `passage_redressed` | the casus pair | FREE |
| `welcomed · granted · granted_under_watch · tolerated · refused · refused_with_warning · barred · demanded_to_leave` | the eight answers | `granted`, `refused` reused in their landed sense; `tolerated` same-sense homonym of the magic legality; the rest FREE; `contested` AVOIDED (the occupation ladder's first state) |
| `complied · rerouted · waited · turned_back · trespassed` | the mover's roads | FREE as literals |
| `hostility · defiance · urgency` | the trespass causes | `hostility` same-sense homonym of the pressure kind; `enmity` AVOIDED (RN) |
| `ally · stranger · enemy` | the rung | `ally`/`enemy` reuse the generation's literals and PT's `declaredStance` in the same sense; `stranger` FREE as a literal |
| `none · scant · fair · wide` | the tolerance band | `slight` (`DRIVER_STRENGTH_BANDS`) and `narrow` (`WAR_COST_TRAJECTORY_MARGIN_BANDS`) AVOIDED; a NEW ladder registered with `pressureLadderMints.walker` (no landed ladder measures a host's allowance) |
| `unknown · quiet · present · pressing · decisive` | the unit's size against the holder | THE INTENSITY LADDER reused (a new subject, no new ladder) |
| `keep_to_road · no_foraging · no_halt_at_seat · leave_by · size_cap · fee · guarantee · escort` | the permit terms | FREE as literals except `escort` (a landed service word, another surface) |
| `awaiting · held · crossing · overstayed · trespassing · unwitnessed` | the crossing states | `held` is the roads hostage's word on another surface (registered); the rest FREE as literals |
| `open · taxed · restricted · closed` | the arms stance | EC-6's words, ONE vocabulary for goods and arms |
| `passage_of_arms` | PL's new precedence class | FREE |
| `armsNear` | the fourth readiness signal | FREE |
| "gate" · "territory" · "patrol" · "march" | the host's words | "gate" = the digest crossing between two territories (one meaning, the host's); "territory" = the host's seat partition; "patrol" = THE PATROLS' unit; "march" here is ALWAYS the army's march (`planMarch`), never the map's debatable "march" (HR:493) — registered |

---

## §16 THE RULINGS (by delegation under the 2026-10-16 and 2026-10-17 words, vetoable; the owner's own row marked; every DRAFT constant UNMEASURED and on the FP-46 roster)

| Row | Ruling | Why |
|---|---|---|
| **OD-PS-0 (THE OWNER'S OWN ROW)** | the volume exists by the owner's word of 2026-10-18 00:47 (verbatim above): allies by belief with reservation and a tolerance widened in wartime; strangers asked by envoy or at the border; else another road, or no heed by hostility, intention or urgency; every way it is received | the owner's |
| OD-PS-1 | one new volume, two flags, six waves (PS-0 … PS-5), dark, premium, lit where the war layer and the canon are | the chair's design, executed |
| OD-PS-2 | THE TRANSIT LEAF STAGE: one mount in `armyTransitKernel.js` after a leaf-first extraction (~42 eff); a closed registration list shared with WC Arc A's `armies_meet`; owned by the first to land | two programs need the same two lines; the ONE PERSON STAGE precedent |
| OD-PS-3 | a unit is an army in transit (all three roles) or a `reinforcement_column`/`veteran_return`; never a `shed_column`, a refugee or migrant column, a menace, a person or the party | PS1 |
| OD-PS-4 | aspatial: dark by absence; the graph-hop arm built in WC-5's commit | PS10's measurement |
| OD-PS-5 | members of one polity are allies on the ladder; the charter's passage stays tolls only | PL §4.5 (SPL-M13 cured) |
| OD-PS-6 | one border truth `gateKeeperOf`; H16's per-gate holder offer is a slot adopted only on the owner's word | J385; HR:501 |
| OD-PS-7 | the destination is a claim checked against the holder's own contracts; a deliberate lie rides IN's lie machinery (an IN inbox slot) | Law One; PL16 |
| OD-PS-8 | the noticing read is THE PATROLS'; dark ⇒ every crossing witnessed | no host watch fact exists (HR:555) |
| OD-PS-9 | the stance words live once (first-to-land shared leaf); PS mints its own verb `SET_PASSAGE_STANCE` on EC-6's overlay idiom (alternative: widen `SET_TRADE_STANCE` with `of` — the chair's choice) | one vocabulary, two derived stances |
| OD-PS-10 | `passage_rights`: its own family `passage`, `seam` executor, the lens's `passage` occasion; Herald "free road for soldiers" | TERM_CATALOG idiom; the "right of passage" homonym |
| OD-PS-11 | the one-off request is an errand consumer row and a permit, never a treaty clause | durations in years; V-1 |
| OD-PS-12 | every answer's base reluctance is `reserveFor` | one court-reluctance law |
| OD-PS-13 | tolerance widths `none 0 · scant 2 · fair 4 · wide 8` weeks for a `present` unit; spend weights `quiet 0.5 · present 1 · pressing 2 · decisive 3` — DRAFT, UNMEASURED, FP-46 | PS5 |
| OD-PS-14 | the size band cuts `quiet < 0.25 · present < 0.6 · pressing < 1 · decisive ≥ 1` of B's home defence — DRAFT, UNMEASURED, FP-46 | the intensity ladder reused |
| OD-PS-15 | the hold cap is DERIVED (`SIEGE_MAX_AGE − MAX_MARCH_WEEKS − 1`); a reroute that would break `MAX_MARCH_WEEKS` is impossible | PS9 |
| OD-PS-16 | the casus pair `passage_violated ↔ passage_redressed`, derived, never DM-declarable | the taxonomy's registration-first law |
| OD-PS-17 | a barred trespasser takes no casus | the owner's "do not heed the warning": the trespasser bears the price |
| OD-PS-18 | harbouring the crown's enemy writes `fealty_defied` without the break proposal — PL to confirm | PL7's spirit |
| OD-PS-19 | an enemy column is MN5's third presence feeder, DRAFT 0.60 | one danger truth |
| OD-PS-20 | `armsNear` lights readiness; nothing writes `warPosture` | B makes ready; it does not declare |
| OD-PS-21 | an ally's welcome under tolerance and a standing right's open road are not hearings; every decided answer is | the contract's answer is already heard |
| OD-PS-22 | the holder's answer and the mover's road share ONE card | one fact, one hearing |
| OD-PS-23 | retreats never ask and never wait | the retreat's own law |
| OD-PS-24 | the archive: ≤ 8 rows per directed pair, horizon 104 weeks — DRAFT, UNMEASURED; permits, crossings and archive engine-only by recorded decision | requirement 22a, 23, 14 |
| OD-PS-25 | the column arm is built in WC-6's commit through PS's reads | WC owns the producer |
| OD-PS-26 | fees in coin under `treasuryEnabled`, else a favour; the hostage guarantee is a slot on `hostage_exchange`'s landing | the landed treasury; the parked kind |
| OD-PS-27 | the remaining DRAFT constants, all UNMEASURED and on the FP-46 roster: `WATCH_MARGIN`, `TOLERATE_MARGIN`, `PASSAGE_KEPT_TRUST` 0.02, `PASSAGE_BROKEN_RESENTMENT` 0.08, `PASSAGE_DEFIANCE_RESENTMENT` 0.10, the urgency half, `PASSAGE_TOLERATED_GRUDGE` 0.02, `THREAT_ARMS`, the home-defence battle's `present` fraction, the lens's demand count (two grants a year), the closed-border count (two), the reserve step at the border (one), the culture-distance weight, the size-of-legitimacy step | requirement 18 |

---

## §17 WHAT A DM READS (deeds only, never forecasts; no numerals; the surface shows the outcome, the WHY waits on scrutiny)

1. "Kell's column crossed into Ashford's land by the river road, as friends may." *(surface: the chronicle and the piece behind the armies toggle; scrutiny: the tolerance band, "wide — Ashford is at war and lets its friends' soldiers stay longer")*
2. "Kell's envoy asks Ashford's council for leave to march through." *(the request card)*
3. "Ashford refused Kell's envoy leave to cross; Kell's column turned toward the hill road." *(scrutiny: "Ashford fears so large a host; the crown of Merewick is at war with Kell")*
4. "Ashford let Kell's soldiers through on the river road, with its own riders beside them." *(granted under watch; scrutiny: the terms)*
5. "Ashford has told Kell's soldiers to be gone from its land." *(overstay; scrutiny: "its patience with so large a column was scant")*
6. "Kell's spears crossed Ashford's fields without leave; Ashford counts it a wrong." *(a trespass for defiance; scrutiny: the cause and the casus)*
7. "Kell's column would not wait: Ashford's walls are near to falling." *(a trespass for urgency — "near to falling" is the siege's own fall-odds word, a present state, never a forecast or a count)*
8. "Merewick's host has entered Tolle's land in arms." *(the incursion, each week it stands)*
9. "Tolle let Merewick's soldiers pass, though its crown is at war with Merewick." *(harbouring; scrutiny: the fealty row)*
10. "Ashford's roads are closed to Kell's soldiers." *(the arms stance; scrutiny: the two trespasses that closed them)*
11. "Kell's host marched by the long road, around Ashford's land." *(the planner; scrutiny: "Kell did not expect Ashford to let it pass")*
12. *(an unwitnessed crossing writes NOTHING a DM reads about the holder; on scrutiny of the MOVER the DM sees "Kell's company slipped through Ashford's land unseen")*

END OF VOLUME.
