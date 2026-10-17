# DESIGN_FP_ARCH_PL — THE POLITY: the kingdom above the settlement, built from the vassal chain

## Chair session 2fc13d59 (Opus 5.5), 2026-10-17. Compiled on the owner's word; DARK
## behind five virtual flags; nothing scheduled. Bound by the FP constitution's
## requirements 1–24 (`DESIGN_FP_SPINE.md` §1) and by `DESIGN_FP_COHERENCE_FOLD.md`.


> ⛔ **DRAFT WITH OPEN BLOCKING FINDINGS (2026-10-17).** The adversarial review ran (three Opus seats; the two Fable seats asked for hit the account's Fable limit). It found **5 BLOCKING · 15 MAJOR · 8 MINOR** in this volume (`settlement-engine-kits/dominion-xf-2fc13d59-2026-10-17/skeptic/SPL.md`) and seams shared with the menace (`skeptic/SX.md`: 6 BLOCKING · 20 MAJOR). The worst: κ on the foreign book leaves a town 2–22% of its own decision (cap the liege below half, drop κ as a multiplier); the foreign book never sees the counterparty and the declaring decision reads no book; a `crown` fifth book needs the frozen `warTermination.js`; a crown war along a sworn link fights itself in seven one-hop readers (recall, relief, levy, sue, tribute, trade override, peace step); the protection record as turning points is erased by `ensureRelationshipState`; genesis polities are 87–94% two-town. NOT YET DISPOSED — the next session cures this volume from those files before anything relies on it. ⛔ ALSO OPEN (owner's question, 2026-10-17: "how does the conversion of culture and relligion happen in kindgom through chains of vassalage"): the volume does not yet design it. Today rite imposition (`traditions/relations.js:44-49`, ~0.3/yr) reaches only CONQUEST-matured vassals one step down, culture otherwise travels with migrants, and no vassalage read converts faith. The chair's proposal for the cure session: rites flow down the chain tier by tier with lag (extended to sworn links, scaled by the crown's hold and the link's closeness, diluted by distance), and up and sideways by court influence and migrants; the crown's faith works on courts first (shared faith raises closeness; standing missionary access by charter) and on people only through the faith contest's own forces; imposition raises resentment and lowers deference, so a faith difference is the fault line of breaks and crown wars; champions (saints, heretics) are the accelerant — all through the one rite writer and the one faith writer family. ⛔ AND (owner, 2026-10-17, verbatim): "as well as government structure, voice in the court, etc... Essentially, the ways in which the crown and higher order vassals try to keep their lower order vassals in line nad limit coups and rebellions. But of course there are counterforces as well. And these conversions that happen are slow." — the chair's proposal for the cure session: the CONTROL INSTRUMENTS, each through an existing writer — recognition (the liege lends or withdraws legitimacy, which the coup and rebellion gates already read, §736.1); backing in a coup (the live intervention road; ⛔ the coup adj budget is FULL at 0.815/0.82, `rulingPowerCoup.js:182-201` — the crown enters only through the existing intervention and foreign-seat terms); a voice at the vassal's court (the foreign book + a resident envoy) and the great vassals' voice at the crown's council (INT's counsel: control and counterforce in one); shaping government (the crown backs the vassal faction mirroring its own ruling power through the lit faction competition; at the hard end appointment, a landed `RULING_POWER_CAUSES` member); bonds (the §13 court bonds: match, fosterage, hostage exchange); garrisons (upkeep + resentment); spies on vassals (suspicion, counter-intelligence); divide and rule (charters to rivals, feud rulings, transferring a lord's vassals via WR-10); rewards and punishments. Great lords do the same down their own chains; under absolute cohesion the crown reaches past them (the crown-and-towns-against-the-barons move). COUNTERFORCES: burden → resentment; distance; local legitimacy against appointees; faith and culture fault lines; leagues of vassals (a charter of liberties or a crown war); outside patrons courting the restive; the commons; agitators and claimant-backing champions; the overreach cost of every instrument. PACE: convergence of government, culture and faith is SLOW (years; tier by tier with lag); control instruments act fast and wear; cohesion is the balance of the centralizing and centrifugal terms — its inputs are these.

**The owner's words (2026-10-17), verbatim.** "the physical world is being built now. The user is the interface between the party and the world. Think of this tool as the DMs tool not the party. the DM presents chohices and options to the party and then uses this tool to bring about consequences rather than the party directly. This is not a tool for the whole table. We only supply setting and consequence." — and, building the chair's idea of "the realm layer above settlements": "For this last one, it has to be based in the vassalage system and we also have to make it coherent and compatible with our FP per individual settlement. for example, a chain of vassalages and the one that sits at the very top is the capital, referencing a feudal like system. how do settlement relationships of a kingdom work between individual settlemetns vsersus a kingdom when it comes to matters of trade, war, alliance, etc.? Who takes precedents... are there nuances, are there comprimises,, etc. Does a civil war still mean its the same kingdom but despite that different settlemetns are organizing against each other? comprehensivley think it ou."

**Status: COMPILED, DARK, NOT SCHEDULED.** The dispatch gate is the owner's: nothing here builds before the UI + prose release is pushed and deployed (the gate every FP program shares). The rulings in §12 are the chair's, taken under the owner's standing delegation ("i give my permission now and for whatever is emergent", 2026-10-16) and vetoable by one clause; the rows the owner reserved for himself are named as his.

**The answer in one paragraph.** A kingdom is not a new thing in the world; it is the shape the vassal edges already make, read upward to the settlement that answers to no one. That settlement is the capital. Every settlement keeps its own court, its own beliefs and its own choices; being sworn adds a voice to those choices — the liege's — whose weight the owner already fixed ("scales by how close the vassal is in culture and trade and relationship with the overlord"). The crown speaks for the kingdom abroad, each town rules itself at home, and obligations bind the seam both ways; how far "abroad" reaches is set by how strong the crown's hold is. Nothing is forbidden: a town may defy its liege, at a price, and two acts are not defiance but the breaking of fealty itself. A feud is towns of one kingdom at war over their own quarrel; a break is a town leaving; a civil war is towns of one kingdom at war over the crown itself — and yes, it is still the same kingdom, its towns on two sides.

---

## §0 WHAT THE CODE ALREADY IS (census `settlement-engine-kits/dominion-xf-2fc13d59-2026-10-17/findings/V-vassalage.md`, `D-deciders.md`; master `81f1cd963`)

**Nothing above the settlement exists.** No polity id on any settlement record, no stored polity, no chain walk anywhere in `src/` (V §1.14, §6.1–2; D §0). Hierarchy is a PAIRWISE edge read one hop at a time.

| Substrate | Where | What it gives the polity |
|---|---|---|
| The sworn edge | relationship type `vassal` (from = overlord), `relationshipState.js:419-431` direction stamps `overlordSaveId/vassalSaveId`; UI selections `overlord_of`/`vassal_of` `canonicalRelationship.js:309-314` | the one link a polity is made of |
| The matured conquest | `occupations[S].state === 'vassalized'` (`occupation.js:1041-1115` relabels the edge to `vassal`); rungs below `vassalized` are OCCUPATION (`rulingPowerSeat.js:241-260`) | held lands and sworn lands |
| THE ONE "who looms over S" read | `foreignSeatOf(worldState, snapshot, id)` `rulingPowerSeat.js:471-543` → `{regime, patronSettlementId, weight01, band, basis, grip01, closeness01, trade01, rung, primacy}`; bands `dominant ≥0.70 · strong ≥0.45 · present ≥0.20 · marginal` (:92-95); patrons EXCLUDED by the owner's ruling (:591-595); multiplicity CODEPOINT-FIRST (:630-633); UNGATED itself (only the coup term :578-584 and the suitors are gated) | the walk's single step and the liege's weight |
| Genesis | `assignGenesisRelations` `genesisDiplomacy.js:216-270`: a ≥2-rung tier gap may make an overlord; the SUZERAIN CLOSURE (at most one overlord) holds only inside this pass (:200-202, :248-255) | chains are BORN in ~2% of medium/large realms, at most three seats deep (executed, V §1.14) |
| The per-tick vassal rules | `vassalRules` `relationshipRulesCore.js:587-852`: tribute (:617-641), cold-war support (:646-672), overlord-weakness memory (:686-714), protection burden (:718-734), stable compact (:739-760), REBELLION stressor (:768-806) → `vassal_rebellion_succeeds` relabels to `rival` (:812-829) or `_quashed` (:832-848) | dues, strain, and the break road — LIT in six presets incl. the default |
| The formation cascade | `resolveRelationshipHierarchy` `relationshipHierarchy.js:211`, ONE-SHOT at vassalization, called from the frozen `applyWorldPulse.js:815-823` | the only writer that aligns a vassal to its overlord, once |
| The levy | `computeLevySources` `warHomeCosts.js:109-133` (senior levies junior on `vassal`); MEASURED SILENT ("every one of the seven completed release cases reads war_levy exactly ZERO", `subsystemRowsWar.js:202`); `warLevyEnabled` full_simulation only | service, one hop, involuntary |
| Relief | `computeAllyRelief` `warCapacityReads.js:63-97` — SYMMETRIC on the edge (a vassal relieves its overlord exactly as the reverse) | protection, unoriented |
| The chooser's duty | `settlementStrategy.js` (763/800): own `vassalIds` read TRUE (:364-370, "the lord knows his own vassals"); recall when a vassal is besieged (:1109-1135); no `sue_for_peace` while one is (:628-634) | the liege's duty, one hop |
| The trade override | `tradeWar.js:186-194, :420-470` — the overlord wins its vassal's supply contest outright and stamps `vassal_trade_coercion` | the one hard trade precedence |
| The foreign book | `readWarSeatBooks` `warSeatBooks.js:618-811`: `SEAT_BOOK_KINDS = ['realm','seat','patron','foreign']` (:540); "A fifth book then joins by adding one row" (:530-532); ten call sites in war/peace/coalition/envoy/army/sovereignty; gated `foreignSeatEnabled` (lit nowhere) | THE PRECEDENCE MECHANISM, built and dark |
| Primacy | `FOREIGN_PRIMACY_CLASS` `foreignPrimacy.js:79-98` at the ONE choke `candidateEvents.js:669`; OCCUPATION ONLY ("A vassal overlord has a real book and NO primacy", :155-159) | ordering rights — not for vassalage |
| Succession of treaties | GR-4 `treatySuccession*.js`: a `seatTransitions` row (coup · challenge · succession · vacancy) opens a question per sworn treaty; "A coup VERDICT, a conquest, a DM CHANGE_RULING_POWER … write NO row" (:36-41); hierarchy reads: zero | the fealty-renewal machinery, for treaties only |
| Coup backing | `convergence.js:237-251, :884-893` `preserve_order` — an overlord backs its vassal's incumbent (LIVE in war presets) | the liege in a member's seat |
| The fallen overlord | NOTHING reads a conquered court's vassals; probe: after C conquers M, M's vassal L still names M (D §1A, §7) | a gap |
| Pacts, peace, mediation, commerce | hierarchy-blind: a vassal signs a pact with its overlord's enemy byte-identical to the no-hierarchy control (executed, D §7) | gaps |

**Binding prior words.**
- ODQ §12 (owner): *"Nothing intrinsically makes a settlement a capital. The closest in-system analog is an overlord."* — the capital is DERIVED.
- `DESIGN_COHESION_WEAVE.md` §F.3b (owner refinement): an empire is *"A PATTERN, NEVER AN ENTITY … NAMING POLITIES IS DM TERRITORY … the engine builds the bones, THE DM BAPTIZES"* (built as `hegemony.js:10-15`; its christening hook `canonLabelFor` is unwired, `RealmDashboard.jsx:420-423`).
- ODQ §735.2 (owner): *"When it comes to an occupied or vassal settlement, the ruling power will have an equal or greater counterpart in all decision-makings that is derived from the overlord or occupier… When occupied, the occupier's influence is always just greater than the legitimate ruler … In vassalage, which is much more concrete, it can be lower than an occupier's, scales by how close the vassal is in culture and trade and relationship with the overlord, and is still influential."*
- ODQ §736.1 (owner): *"any attempted coup or rebellion has a scaling factor according to the legitimacy of the ruling powers."* · §741.1 (owner): *"…it needs to also consider what each foreign power — allied or neutral or enemy settlement — will react … regarding each decision as part of any process or major decision."*
- ODQ §934.87 (owner): *"Build real realm borders"* — the State-borders switch becomes a real borders lens drawn from *"the seat read `foreignSeatOf`, its root sovereign, over the territory partition"*.
- Amendment I (owner): *"expand all of this to wars between allied kingdoms and to three-or-more-party wars"* → *"a multi-party war is NOT a monolithic object with a winner — it is A GRAPH OF BILATERAL RELATIONSHIPS"*. Amendment S (owner): *"originals and overlords may TRADE their satellite or vassalized settlements"*.
- W-SEAT laws (`DESIGN_W_SEAT.md` §2): ONE RESOLVER PER QUANTITY · DERIVED, NEVER PERSISTED, except where a DECISION is state · PRIMACY IS ORDERING, WEIGHT IS SCALAR ("a tuning pass can never invert the owner's 'always just greater'") · `foreignSeatEnabled` is OWNER-LIT at the owner's walk (ODQ §820 Q-S3).
- Spine requirement 10: "out-of-posture acts are priced and receipted news, never forbidden"; requirement 24: THE HEARING WEEK.

---

## §1 THE LAWS (PL1–PL15)

**PL1 — THE POLITY IS A PATTERN, NEVER AN ENTITY.** A polity is the closure of SWORN links upward to a ROOT: the settlement whose own looming read names no overlord. Members, tiers, the root and every band are DERIVED per read; membership is never stored. THE CAPITAL IS THE ROOT — derived, never a field (ODQ §12). A sworn link is a `foreignSeatOf` view with `regime: 'vassalage'` and a `basis` of the vassal edge or the `vassalized` rung; a treaty-only subordination is HEGEMONY's pattern (a sphere), not membership; a patron is influence, not sovereignty, and is never a member (§735.2).

**PL2 — ONE ROOT READ ABOVE THE ONE SEAT READ.** `polityOf(worldState, snapshot, id)` walks `foreignSeatOf(…).patronSettlementId` upward with a cycle guard and a depth cap; it never re-derives who looms over a settlement (W-SEAT: one resolver per quantity). This is §934.87's "root sovereign", given its one spelling.

**PL3 — THE ENGINE BUILDS THE BONES; THE DM NAMES THE KINGDOM.** The default display is descriptive ("Merewick and its sworn towns", the hegemony precedent `hegemony.js:239`); the engine never mints a polity name. The ONLY persisted polity datum is the DM's christening, keyed to the root, carried across a lawful passing of the crown (PL10, PL11, §5), dropped when the polity dissolves. It is the persistence lane `canonLabelFor` was waiting for: one lane for both patterns (polity and sphere).

**PL4 — THE LIEGE'S VOICE IS THE OWNER'S SCALAR, AND IT COMPETES HONESTLY.** In every decision of a sworn member, its immediate liege is a counterpart with weight `foreignSeatOf(…).weight01` — the owner's "scales by how close the vassal is in culture and trade and relationship" — carried through the seat books' FOREIGN book. Vassalage NEVER orders: primacy (veto, referral) is occupation's alone, and no PL multiplier may lift a vassal-liege's weight to or past an occupier's ("always just greater" is never inverted). PL mints NO loyalty quantity: a member's DEFERENCE is its seat weight, and its word is the seat's band (`dominant · strong · present · marginal`).

**PL5 — THE VASSAL OF MY VASSAL IS NOT MY VASSAL — UNLESS THE CROWN IS ABSOLUTE.** The root reaches a sub-vassal only through the mid-lord's own decisions (the mid-lord's books carry its liege). Under ABSOLUTE cohesion only, the root's interest joins every sub-vassal's books as a fifth book, `crown`, by the partition's own rule ("a fifth book then joins by adding one row", `warSeatBooks.js:530-532`) — liege homage. Below absolute the fifth book's weight is zero and the partition is bit-identical.

**PL6 — THE CROWN SPEAKS ABROAD; THE TOWN RULES AT HOME; OBLIGATION BINDS THE SEAM; COHESION SETS HOW FAR "ABROAD" REACHES.** (The precedence law; §3 is its table.)

**PL7 — NOTHING IS FORBIDDEN; TWO ACTS ARE DEFINED.** A member's deciders remain its own; precedence is priced deference and receipted news (requirement 10). Two acts are not defiance but the breaking of fealty, by definition: (a) a SEPARATE PEACE with its liege's enemy while the liege still fights it; (b) JOINING a war or coalition AGAINST its own liege. Either act takes the edge's existing break road (`vassal_rebellion_succeeds` → `rival`, `relationshipRulesCore.js:812-829`) as a proposal whose cause IS the act, heard by the DM (requirement 24).

**PL8 — OBLIGATIONS RUN BOTH WAYS, ARE ANSWERED, AND ARE REMEMBERED ON THE EDGE.** Up: SERVICE (the levy), DUES (tribute), AID. Down: PROTECTION, ARBITRATION, PASSAGE. An up-obligation is answered by the member's own fork wherever its road exists (WC-5's call-in for service; the tribute rule's condition for dues). A down-obligation is a duty whose keeping or failure is recorded on the sworn edge by the ONE relationship writer (`applyRelationshipPatch`, `relationshipEvolution.js:490`) as a turning point and a trust/resentment patch — and so moves the owner's scalar. Protection kept is how deference is earned; there is no second loyalty law.

**PL9 — FEUD, BREAK, CROWN WAR: THREE DIFFERENT THINGS.** A FEUD is members at war with each other over their own quarrel; the polity is not at war and the common liege is the first mediator. A BREAK is a member leaving its liege (the rebellion road, and the war that may follow). A CROWN WAR is members at war over THE CROWN ITSELF: every sworn link stays sworn in name, the polity stands, and its members take SIDES. The crown war's contest is the one decision persisted (W-SEAT: "except where a DECISION is state").

**PL10 — THE CROWN PASSES BY THE ROOT'S OWN SUCCESSION, AND FEALTY IS ANSWERED AT EACH.** When the root's seat changes hands through the producers GR-4 already reads (a `seatTransitions` row: coup · challenge · succession · vacancy), each direct vassal answers a FEALTY QUESTION: renew · withhold · press a claim · go free. This is GR-4's question-and-answer machinery extended from sworn TREATIES to sworn LINKS — GRAMMAR owns the question and the answer (coherence fold §3.1.10); PL supplies the reads.

**PL11 — A FALLEN LORD NEITHER TAKES ITS VASSALS WITH IT NOR LEAVES THEM BLIND.** When the root or a mid-lord falls to conquest (a `power_transfer` with cause `conquest`), each of its direct vassals answers: submit to the conqueror · stand by the remnant (`legitimateRemnantOf`, `rulingPowerSeat.js:318-349`) · go free. (Today nothing reads a fallen court's vassals.)

**PL12 — ONE LIEGE, NO CIRCLE.** A member has exactly one liege. Where two overlord links exist, the liege is the one with the greater seat weight (the owner's scalar), codepoint-first only on a tie — replacing pure codepoint-first in `foreignSeatOf`'s multiplicity rule, behind `polityEnabled`, dark-identical wherever no multiplicity exists. A circle is never a polity: the walk stops at the first repeat and receipts the anomaly; a subjugation that would close a circle is NAMED in its proposal (a suggestive guard — the DM decides).

**PL13 — EVERY POLITY ENGAGEMENT IS HEARD.** The fealty question, the crown's fall, the claim, each member's allegiance, the crown's arbitration and the break are registered engagement kinds (requirement 24; §7). The crown war is STANDING: in any of its weeks the DM may force the hand.

**PL14 — THE MOUNT RULE.** Zero lines in `pulseKernel.js` (1581, frozen), `applyWorldPulse.js` (907, frozen), `warTermination.js` (818, frozen). Hosts at the ceiling take nothing without a leaf-first car: `generosityKernel.js` 800, `peaceTerms.js` 799, `armyTransitKernel.js` 798, `roadsKernel.js` 838 (baselined), `WorldMap.jsx` 599/600. Every PL module is a leaf; every behaviour enters an existing decider as ONE more bounded signal (the E14 precedent: "one more signal each … NEVER a target chosen … the hard war gates stand").

**PL15 — THE PHYSICAL WORLD IS A SEAM, NOT A PREMISE.** The borders' geometry (§934.87's lens over the territory partition) and distance from the capital (a far town's looser hold) read the physical world when it lands. Every PL wave has an aspatial arm and is whole without it.

---

## §2 THE ONTOLOGY

**Member classes** (derived): `root` — answers to no overlord and has at least one sworn member · `sworn` — linked to a liege by a sworn link, at tier 1..n (tier = steps from the root) · `held` — occupied below `vassalized` by a member of the polity (the occupier's primacy governs it, W-SEAT; it counts toward the polity's lands and strength but not its cohesion).

**The read.** `polityOf(worldState, snapshot, id)` → `{ rootId, liegeId, tier, path: [id … rootId], class, members (only when asked for the root), cohesion, deference }`. `politiesOf(worldState, snapshot)` → every polity with ≥ 2 settlements, codepoint-sorted. Lazy, pure, never persisted; stays out of the first-paint closure (the `foreignSeatOf` rule, `rulingPowerSeat.js:12-20`).

**Cohesion — the crown's hold** (derived, one band per polity): `nominal · loose · firm · absolute`. Inputs, all existing reads: (i) the mean deference of the root's DIRECT vassals (their seat weights); (ii) the root's legitimacy band; (iii) the root's share of the polity's strength (a weak king among strong dukes reads `nominal`; truth for the root's own court — "the lord knows his own vassals" — belief for every other observer); (iv) the strain on the sworn links (resentment mean); (v) the protection record (PL8's kept/failed turning points in a seasonal window). Bounded, banded, no decay law of its own: it moves only as its inputs move.

**Deference** (per member) = the seat weight and band (PL4). Its prose words are the seat band's: a member under a `dominant` hold "answers to Merewick in all things"; `marginal`, "owes Merewick little but the name".

**The crown** = the root's court in its polity role. One court, two hats: the root decides as a town for itself and as the crown for the polity, with the same deciders and polity-scope inputs (§3). The engine mints no separate actor.

**The polity's prose noun** follows the root's ruling power (one closed table; prose only, never a token): autocrat → kingdom, "the crown of X" · council → commonwealth, "X's council" · theocracy → see, "the see of X" · merchant_league → league, "the league of X" · criminal → sway, "X's sway" · mixed → realm-in-prose is FORBIDDEN (the campaign world's word) → "X and its sworn towns". The descriptive default stands until the DM christens.

---

## §3 PRECEDENCE — WHO DECIDES WHAT (the owner's question, answered class by class)

The rule beneath every row: **the member decides; the liege's interest is a weighted voice in that decision (PL4); the CLASS sets a bounded multiplier κ on that voice; the polity's COHESION sets κ.** κ = 1 is the owner's scalar untouched; κ never lifts a liege's weight to an occupier's. Nothing in this table is a veto.

| Class of decision | Sphere | κ at `nominal` / `loose` / `firm` / `absolute` | What it means in play |
|---|---|---|---|
| WAR ABROAD — declaring or joining a war on an outsider | RESERVED to the crown | 1 / 1.25 / 1.6 / 2.0 (capped below occupier weight) | A sworn town that marches on a neighbour its liege is at peace with pays in deference and in its liege's regard; under a firm crown it rarely does, under a nominal one it does as it likes. |
| PEACE ABROAD | RESERVED + PL7(a) | as WAR ABROAD; a SEPARATE peace with the liege's live enemy is the break, by definition | When the crown makes peace with Kell, each member at war with Kell receives the crown's peace as an OFFER on its own front, pressed by its book (Amendment I: a graph of bilateral peaces, never one treaty for all). |
| MILITARY ALLIANCE ABROAD — `defensive_pact`, `allied` with an outsider | RESERVED at firm+; RETAINED below | 1 / 1 / 1.6 / 2.0 | A pact with the liege's ENEMY is priced by the liege's book and its anticipated reaction (§741.1), heavily under firm+; a pact with the liege's ally costs nothing. |
| TRADE ABROAD — trade pacts, stances, caravans to outsiders | RETAINED; under absolute, priced | 1 / 1 / 1 / 1.4 | Towns trade as they like; when the crown EMBARGOES an outsider, each member's stance toward it carries the crown's stance as one input (EC-6's derivation; firm+), and a member that keeps trading is smuggling in the record's voice. |
| TRADE AT HOME — between members | the crown's PASSAGE (owed down) | — | Under firm+ the polity's internal tolls are waived for members (the entrepot read gains a same-polity arm); the landed trade-war override (the liege wins its vassal's supply contest, one hop) stands unchanged. |
| DUES — tribute up | OWED | — | The landed tribute rule (`vassal_tribute_extraction`) unchanged; dues flow to the IMMEDIATE liege only. |
| SERVICE — the levy | OWED | firm: the crown summons its direct vassals, each mid-lord summons its own; absolute: the crown summons every member directly | Rides WC-5's call-in when it lands (one road): each summons is ANSWERED (`answered · half_answered · refused · lapsed`). A mid-lord may withhold its own vassals' service — the great vassal's leverage. |
| PROTECTION — relief down | OWED by the liege | firm+: the root owes a sub-vassal when the mid-lord cannot | Relief becomes ORIENTED (liege → member is a duty; the symmetric ally relief stays as the generic arm) and CHAIN-AWARE. Kept or failed, it is written on the link (PL8). |
| JUSTICE — a feud between members | the crown's PEACE | nominal: tolerated · loose: the liege mediates · firm/absolute: the liege may order it ended | The common liege is the first mediator (§6); the order is a hearing the DM may seal. |
| A MEMBER'S OWN SEAT — coups, councils, faith at home | RETAINED | — | Unchanged: the landed `preserve_order` lets a liege back its member's incumbent (convergence, war presets). |
| FEALTY ITSELF — changing liege, breaking free | the member's own | — | The landed rebellion road, priced by fear and dependency; heard by the DM. |

**Compromises — where the nuance lives** (each is a typed act or a term, never a free rule):
- **Scutage** — coin in place of men: a member answers a summons by paying the crown a war contribution through the treasury (W-COIN, when lit) instead of sending a contingent. The crown's strength is smaller; the member's deference is spared.
- **Half service** — `half_answered`: some men, not all.
- **Commuted dues** — dues lowered in exchange for service, or the reverse (the tribute condition's severity traded against the levy's draw), a charter term between liege and member.
- **The charter** — the liege GRANTS a member `toll_exemption`, `market_access` or `exclusivity`: the three trade-rights rows (`peaceTermsCatalog.js:306-308`) finally get a PRODUCER — the liege's grant, drafted by GRAMMAR's lens on a `charter` occasion (a restive member, a deference falling toward `present`). A granted charter lifts the member's closeness and so its deference.
- **The autonomy charter** — a liege grants one member a narrower reserved sphere (its κ fixed at 1 for named classes). A new GRAMMAR term row (§12 OD-PL-9); the only way a firm crown keeps a proud town inside without forcing it.
- **The court bond** — a marriage or fosterage between the root's court and a member's (the compiled fold §13's court bonds) raises closeness.
- **Arbitration** — the crown's ruling in a feud (§6).

---

## §4 OBLIGATIONS IN DETAIL

**Service.** Today the levy is one hop, involuntary and measured silent. PL-5 (after WC-5) makes it a SUMMONS answered by each member: the answer's fork reads the member's deference, its own war exhaustion, its own threat (an outside menace on its walls excuses it in the record's voice — "Kell kept its levy home against the Ashen Host"), its strength, and the liege's protection record. Under firm cohesion the summons CASCADES: the crown summons its direct vassals; each mid-lord answers for itself and summons its own; what arrives is credited by WC's contribution ledger (WC-1). The levy's silence is cured first (a car-0 measurement of why the release cases read zero).

**Dues.** Unchanged (the landed rule), one hop.

**Protection.** The liege's chooser already recalls its army when a vassal is besieged and refuses to sue while one is (`settlementStrategy.js:628-634, :1109-1135`). PL-4 makes protection ORIENTED and CHAIN-AWARE: the duty runs liege → member (the symmetric ally relief keeps its generic arm); under firm+ the root's duty reaches a sub-vassal whose mid-lord cannot relieve it. When a member is struck (a siege, a menace, a raid) and its liege could have come and did not, the link records `protection_failed`; when it came, `protection_kept`. These move trust and resentment and so the owner's scalar — and they are what a town remembers at the next fealty question.

**Aid.** The landed generosity duty (`generosityKernel.js:382, :620, :888`, `vassalBreach`) unchanged; its host is at the ceiling, so PL reads it, never extends it.

**Passage.** Members cross each other's lands toll-free under firm+; members' columns, caravans and armies are not hostile to one another's roads.

---

## §5 THE CROWN WAR — CIVIL WAR, THOUGHT THROUGH

**Is it still the same kingdom? Yes.** In a crown war every sworn link stays sworn in name; the polity read returns ONE polity for the contest's whole life; the dossier says "the crown of Merewick is contested by Brenmoor"; outsiders still treat with "Merewick and its sworn towns". What changes is that the members are on SIDES, and the sides fight.

**How it starts — the claim.** A CLAIM to the crown is pressed by a SWORN member's court (never by an outsider, which is conquest). Two occasions: (1) at the root's succession (PL10), a member answers the fealty question with "press a claim"; (2) a strong member against a weak crown — cohesion `nominal` or `loose`, the member's strength share at or above the root's, its own legitimacy above the root's — presses a claim at any time (a barons' war). The claim's strength reads the basis the claimant's ruling power implies (`CLAIM_BASIS_BY_RULING_POWER`, `titularSuccession.js:137-144`: autocrat blood · council council · theocracy faith · merchant_league wealth · criminal arms · mixed ladder; dark until heirs light — the aspatial arm reads strength share, legitimacy and a court bond with the root). The claim is a hearing (`crown_claim`).

**Sides — every member chooses.** Each sworn member answers an `allegiance_choice`: the CROWN · the CLAIMANT · STANDS ASIDE. The choice reads its deference to the root versus its closeness to the claimant (culture, trade, relationship — the owner's own three), its belief of the two sides' strength, its faith alignment, its protection record, its own ambition (SP-C's appetite). A mid-lord's choice carries its own vassals' default (they may answer differently — their own fork).

**The persisted fact.** `spatialLedgers.crownContests[contestedLiegeId] = { claimantId, crownId, sinceTick, sides: { [memberId]: 'crown' | 'claimant' | 'aside' } }` — one record per contested liege (a contest may form at any tier: a mid-lord's own sworn towns may contest ITS seat), drop-when-empty, one writer, closed vocabulary. It is the only thing PL persists besides the christening. It is a DECISION, so it is state (W-SEAT law).

**War between the sides.** The contest supplies a LEGALITY exception: sworn links never make war targets today (`warIntent.js:98-102`); during a contest, a member on one side may make war on a member of the other (the treaty-block legality idiom in reverse). The main front is the claimant against the crown. Battles, sieges, occupations, terms — all the existing war machinery. Coalition joining and intervention extend their motives to the contest: an outsider may back a side (convergence's motive, a pact with the claimant priced by the crown's anticipated reaction).

**Foreign affairs during the contest.** The crown's treaties stand for the crown's side; the claimant's side keeps its own; outsiders may RECOGNISE a side (a pact or a peace with the claimant is recognition, in the record's voice).

**Endings.**
- **The claim prevails.** The claimant's settlement becomes the root: every sworn link to the old root RE-POINTS to the claimant through the fealty question (each answers renew · go free), and the old root answers its own (swear to the new crown · go free · held if conquered). The DM's christening FOLLOWS the polity: it is the same kingdom under a new capital ("the crown passes to Brenmoor").
- **The crown prevails.** The claimant's side re-swears (the link kept, its deference cut by the patch) or is stripped (conquered towns held by occupation; a town the crown chooses to cast off goes free).
- **Partition.** A peace between the sides that leaves the claimant uncrowned but unbeaten: the claimant's sworn side RE-POINTS to the claimant — two polities. The one that holds the old root keeps the christening; the other is unnamed until the DM names it. The chronicle records the lineage ("Brenmoor's towns broke from the crown of Merewick").
- **The claim lapses.** Neither side fights for a season; the claimant withdraws or the DM ends it.

**Feud and break, set beside it.**

| | Feud | Break (secession) | Crown war (civil war) |
|---|---|---|---|
| Who fights | two members | a member against its liege | members against members, over the crown |
| What is at stake | their own quarrel | the member's freedom | who holds the crown |
| Is the polity at war? | no | no — the polity loses a member if the break holds | yes, with itself; still one polity |
| The links | stay sworn | the breaker's link → `rival` | all stay sworn in name; sides recorded |
| The crown's role | the first mediator; may order it ended under firm+ | the party broken from; may make war to bring it back | a side |
| Ends in | arbitration, exhaustion, a peace | the break held (free), or quashed (re-sworn / held) | the claim prevails · the crown prevails · partition · lapse |

---

## §6 THE CROWN'S PEACE — FEUDS AND ARBITRATION

Co-vassals of one liege may be hostile to each other with no rule today (the cascade excludes `vassal`, `relationshipHierarchy.js:12-13`). PL-7 makes the common liege THE FIRST MEDIATOR: the ONE mediator finder (`findCrossPressuredMediator`, `peaceTermsGraph.js:103-121`, "THE ONE FINDER, never a second algorithm") gains ONE precedence rule — a common liege of both parties is tried first, cross-pressured or not; no second algorithm. Under firm+ cohesion the liege may go further and ORDER the feud ended: a `crown_arbitration` hearing whose answers are accept · refuse; the refuser's defiance is priced (PL7's spirit, not its definitions) and, under absolute cohesion, is cause for the liege's war of submission.

---

## §7 THE HEARINGS (requirement 24 — the engagement registry rows PL owns)

| Kind | Owner | Climax | Verdict words | Class |
|---|---|---|---|---|
| `fealty_question` | GRAMMAR (GR-4 extended) with PL's reads | the week after the root's (or a mid-lord's) seat changes hands | `renew · withhold · claim · free` | CLIMAX |
| `crown_fallen` | the war volume with PL's reads | the week after a lord's fall to conquest | `submit · remnant · free` | CLIMAX |
| `crown_claim` | PL (PL-9) | the claimant's decision tick | `pressed · withdrawn` | CLIMAX |
| `allegiance_choice` | PL (PL-9) | each member's answer, the week after a claim | `crown · claimant · aside` | CLIMAX |
| `crown_war` | PL (PL-9) | every week the contest stands | `continues · claim_prevails · crown_prevails · partition` | STANDING |
| `crown_arbitration` | PL (PL-7) via GR-6 | the liege's order | `accept · refuse` | CLIMAX |
| `fealty_broken` | the relationship plane (the landed break road) with PL's definitions | the break's resolution | the landed `succeeds · quashed` | CLIMAX |
| `call_in_answer` | WC (WC-5) — PL's summons rides it | the summoned member's answer | `answered · half_answered · refused · lapsed` | CLIMAX (already registered) |

At a one-week advance each climax is docketed and the DM may leave it, tilt it or give a verdict; month, season and year advances run them on the engine's default (requirement 24(c)). A crown war's verdict in any week forces the hand that week — the owner's siege idiom ("the DM can decide who wins during any one of those weeks forcing the hand").

---

## §8 THE FLAGS (virtual; absent-when-dark; read `=== true`; each lands with its certification row and its lit-mutant pins)

| Flag | Gates | Host flags it needs |
|---|---|---|
| `polityEnabled` | the walk, cohesion, the christening lane, the dossier and Herald lines, the borders lens's read, the multiplicity cure (PL12) | none (aspatial) |
| `polityPrecedenceEnabled` | the class multipliers κ, the `crown` book, PL7's definitions | `polityEnabled` + `foreignSeatEnabled` (OWNER-LIT, Q-S3 — PL never lights it) |
| `polityObligationsEnabled` | oriented chain-aware protection, the protection record, the service cascade, scutage, charters, internal passage | `polityEnabled`; the service arm also WC-5's flags; scutage `treasuryEnabled` |
| `politySuccessionEnabled` | the fealty question at a seat change, the fallen lord's vassals | `polityEnabled` + `oathHolderEnabled` (GR-4's host) |
| `crownContestEnabled` | claims, allegiance, the contest record, the legality exception, endings and partition, the feud order | `politySuccessionEnabled` + `warLayerEnabled` for the war arm |

---

## §9 THE WAVES (every charter carries requirement 16/17's line)

**PL-0 — THE WALK.** A pure leaf `src/domain/polity/polity.js`: `polityOf`, `politiesOf`, member classes, tiers, the cycle guard (stop at first repeat, receipt `polity_circle`), the depth cap; the multiplicity cure in `foreignSeatOf` behind `polityEnabled` (PL12). No consumer. Pins: a chain H→M→L reads root H for L (the D §7 probe inverted); a circle A→B→C→A yields no polity and one receipt; dark-identity of `foreignSeatOf` with the flag absent. FIRST-VISIBLE: none — instrumentation · TIER: aspatial-safe · DEGRADED ARM: dark.

**PL-1 — THE NAME AND THE PAGE.** The christening persistence (`campaign.canonLabels.polity[rootId]` and the hegemony sphere's twin; lifecycle §10); the dossier line on every member ("Sworn to Ashford, under the crown of Merewick" — the DM's name or the descriptive default); the root's dossier ("Merewick: seven sworn towns, two held; the crown's hold is firm"); Herald kinds for fealty changes already minted by the landed roads (vassalization, rebellion) re-voiced to name the polity; the §934.87 borders lens's READ (the root id per territory cell — the lens itself is the map program's). FIRST-VISIBLE: immediate — the dossier line the week the flag lights · TIER: aspatial-safe; the borders lens needs spatial canon · DEGRADED ARM: the dossier lines without a map.

**PL-2 — THE HOLD.** Cohesion and deference as derived bands; the Why panel ("the crown's hold is loose: its strongest vassal outweighs it, and it failed Kell last winter"); the protection record's read. FIRST-VISIBLE: the hold's band on the root's dossier, immediate; its change, at the week it moves · TIER: aspatial-safe · DEGRADED ARM: dark.

**PL-3 — THE LIEGE'S VOICE.** The class multipliers κ on the foreign book across the ten landed book call sites; the pact answer and EC-6's stance derivation gain the book read (pacts are hierarchy-blind today); the `crown` fifth book under absolute cohesion; PL7's two definitions routed to the break road. Waits on the owner's lighting of `foreignSeatEnabled` (it rides it, never lights it). Hosts: the book partition (`warSeatBooks.js`, 492), the pact answer (`pactFormation.js`, 565), EC-6's leaf. FIRST-VISIBLE: the receipt on a member's decision ("Ashford stayed its hand: its liege is at peace with Kell") at the week it decides · TIER: aspatial-safe; host flag `foreignSeatEnabled` · DEGRADED ARM: today's hierarchy-blind deciders.

**PL-4 — DUTIES DOWN.** Oriented, chain-aware protection; the recall and no-sue rules extended to sub-vassals under firm+; the protection record (`protection_kept` / `protection_failed` turning points via the one writer). Host: `settlementStrategy.js` takes ONE bounded signal (it has 37 lines; EC-17 also claims one — the two share a single context read, a car-0 measurement). FIRST-VISIBLE: "Merewick did not come when Kell was besieged" on Kell's dossier the week the siege resolves · TIER: war arm needs `warLayerEnabled`; the record is aspatial · DEGRADED ARM: the record without the recall.

**PL-5 — DUTIES UP.** The service cascade on WC-5's call-in (the levy's silence measured and cured first); scutage on the treasury; half service; charters as the trade-rights rows' first producer (GRAMMAR's lens, `charter` occasion); internal passage (the entrepot same-polity arm). FIRST-VISIBLE: the summons hearing at the week the crown goes to war · TIER: aspatial-safe; scutage needs `treasuryEnabled` · DEGRADED ARM: the landed one-hop levy.

**PL-6 — THE BREAK, DEFINED AND FOUGHT.** PL7's definitions; the rebellion-homonym cure (`activeRebellionAgainstVassal` keyed to the vassal rule's own stressor by origin, `relationshipRuleHelpers.js:572-578` — a domestic uprising no longer arms the vassal break); a casus `fealty_broken` with its peace mirror `fealty_restored` (the reasons taxonomy's bijection, `warReasonTaxonomy.js:106-123`); the liege's war of submission; the `fealty_broken` hearing. FIRST-VISIBLE: the break's hearing card the week it resolves · TIER: the war arm needs `warLayerEnabled`; the break itself is aspatial · DEGRADED ARM: the landed relabel.

**PL-7 — THE CROWN'S PEACE.** The common-liege precedence in the one mediator finder; the `crown_arbitration` hearing under firm+. Host: `peaceTermsGraph.js` (the finder) and `mediationPressure.js` (154). FIRST-VISIBLE: "Merewick has bid Ashford and Kell lay down their quarrel" at the week of the order · TIER: GR-6's hosts (`mediationGeneralizedEnabled`) · DEGRADED ARM: today's cross-pressure broker.

**PL-8 — THE CROWN PASSES.** The fealty question at a seat change (GR-4's machinery, GRAMMAR's question and answer, PL's reads); the fallen lord's vassals (PL11). FIRST-VISIBLE: the fealty hearing the week after the seat changes · TIER: aspatial-safe; host `oathHolderEnabled` · DEGRADED ARM: dark (today's silence).

**PL-9 — THE CROWN WAR.** Claims, allegiance, the contest record, the legality exception, the endings including partition and the christening's rule, outsiders' recognition. FIRST-VISIBLE: the claim's hearing and the dossier's "the crown is contested" line, the week of the claim · TIER: the war arm needs `warLayerEnabled`; the contest and sides are aspatial · DEGRADED ARM: the claim and sides without battles (the contest resolves on its hearings).

**PL-10 — THE MEASURE.** Envelopes over a seed family: polities per realm, depth, the cohesion mix, contests per century, partitions per contest, breaks per century, the fraction of feuds arbitrated; the experience read that closes the chain (requirement 19). FIRST-VISIBLE: none — instrumentation.

---

## §10 THE LIFECYCLE OF THE TWO PERSISTED FACTS (requirement 22a)

| Path | The christening (`canonLabels.polity[rootId]`) | The crown contest (`spatialLedgers.crownContests`) |
|---|---|---|
| create | the DM's naming act (an Edit Mode op, L10's one door) | the claim hearing's `pressed` |
| read | PL-1's display; the Herald's naming | the walk (one polity while it stands), the war legality exception, the dossier |
| persist | campaign record, drop-when-empty | the spatial ledger, drop-when-empty |
| regenerate | a regeneration re-derives the polity; the name survives when the root survives; an orphaned name (root gone) is kept as history in the chronicle and leaves the label table | a regeneration that removes a side's settlement ends the contest by lapse, receipted |
| undo | the naming op's own inverse | the hearing's seal undone restores the pre-claim world (the docket idiom) |
| import | carried as the campaign's labels; a root id unknown to the import is dropped with a receipt | carried; a contest naming unknown ids is dropped with a receipt |
| migrate | absent-when-dark; no migration | absent-when-dark; no migration |
| dark-after-lit | kept, unread | kept, unread; no war legality exception while dark |
| death | the root razed or dissolved: the name moves to the chronicle | a side's leader destroyed: its side's next member by strength leads, or the contest lapses |
| veil | the name is the DM's; it shows wherever the polity shows | the contest is public news; each side's members are as known as their choices |

---

## §11 THE SCENARIO MATRIX (each row is a pin family at its wave)

| # | World | What must happen |
|---|---|---|
| P1 | H ← M ← L (two links) | `polityOf(L).rootId = H`, tier 2; H's dossier lists M and L |
| P2 | A ← B ← C ← A (a circle) | no polity; one `polity_circle` receipt; the subjugation that closed it was named in its proposal |
| P3 | L sworn to M and to N | the liege is the greater seat weight; codepoint only on a tie; dark: today's codepoint |
| P4 | H at peace with K; M (H's vassal) marches on K, firm cohesion | the march is priced (κ=1.6 on the liege's book); if M marches, H's regard of M falls; nothing forbids it |
| P5 | H at war with K; M signs a separate peace with K | the break, by definition: the rebellion road's proposal with the peace as cause |
| P6 | M joins K's coalition against H | the break, by definition |
| P7 | M signs a trade pact with K, H hostile to K, loose cohesion | allowed at κ=1; the record says "against its liege's quarrel" |
| P8 | H embargoes K; M keeps trading with K, firm | M's stance carries H's as one input; continued trade reads as smuggling |
| P9 | K besieges M; H could relieve and does not | `protection_failed` on H–M; M's deference falls |
| P10 | K besieges L (H ← M ← L); M cannot relieve; firm | H's duty reaches L; failure recorded on H–M and M–L |
| P11 | H goes to war; summons M (firm) | M answers; M summons its own L; WC credits what arrives |
| P12 | M answers the summons with scutage | coin to H's treasury; no contingent; deference spared |
| P13 | M and N (both sworn to H) feud | H tried first as mediator; under firm+ an order; refusal priced |
| P14 | H's ruler dies; a weak heir | each direct vassal answers the fealty question |
| P15 | H's heir weak; M strong, autocrat with a blood tie | M may press a claim → `crown_claim` → sides |
| P16 | Contest: M claims H's crown; N and O choose | sides recorded; M–H front legal; the polity reads as one |
| P17 | Contest resolved: M prevails | the root moves to M; every link re-points through the fealty question; the christening follows |
| P18 | Contest resolved: peace leaves M unbeaten | partition: two polities; H keeps the name; M's unnamed |
| P19 | K conquers H (the root) | H's vassals answer `crown_fallen`: submit · remnant · free |
| P20 | K conquers M (a mid-lord) | M's vassals answer at M's tier |
| P21 | a vassal sold (WR-10) | the walk reads the seat (which reads the ledger); the relationship plane's split is a known gap (V §1.8) cured by the sale writing the edge stamp (a WR-10 car) |
| P22 | a menace strikes M; H sends no relief | `protection_failed`; the strongest test of a crown (MN) |
| P23 | M's own commons rise (a domestic rebellion) | NOT the vassal break (the homonym cure) |
| P24 | aspatial world | every row above except the war arms and the borders lens holds |
| P25 | all flags dark | byte-identical to today on every seed |

---

## §12 THE RULINGS (by delegation under the 2026-10-16 word, vetoable; the owner's own rows marked)

| Row | The question | Ruling |
|---|---|---|
| OD-PL-1 | The token. `dominion` is a persisted roads purpose (`roads/state.js:129`); `kingdom` widens the AI door to the whole campaign (`doorRouter.js:61`) and meant one court in the owner's earlier rulings; `realm`, `seat`, `sovereign`, `crown`, `capital`, `bloc`, `chain` are landed | `polity` in code (free; prose-only today); "kingdom", "crown", "capital" in prose only, per the §2 noun table |
| OD-PL-2 | A persisted polity identity? | NO — a pattern (§F.3b; ODQ §12); only the DM's christening persists |
| OD-PL-3 | The christening's shape and its rule across a passing of the crown | `canonLabels.polity[rootId]`, follows the polity when the root moves lawfully (§5), stays with the old root at a partition |
| OD-PL-4 | The precedence mechanism | the owner's §735.2 scalar through the foreign book, κ by class and cohesion, never above an occupier's weight; no vetoes |
| OD-PL-5 | Does PL light `foreignSeatEnabled`? | NO — the OWNER'S row (Q-S3, "at the owner's walk"); PL-3 waits on it |
| OD-PL-6 | The two definitional acts (separate peace; joining against the liege) | ruled as definitions, routed to the landed break road, heard by the DM |
| OD-PL-7 | Multiplicity (two overlords) | the greater seat weight is the liege; codepoint only on a tie; behind `polityEnabled` |
| OD-PL-8 | The crown contest record (a persisted shape) | `spatialLedgers.crownContests` as §5, drop-when-empty, one writer |
| OD-PL-9 | The autonomy charter (a new GRAMMAR term row) | YES — one row, GRAMMAR's catalog, drafted on the `charter` occasion |
| OD-PL-10 | Partition: who keeps the name | the side holding the old root |
| OD-PL-11 | Cohesion's four words | `nominal · loose · firm · absolute` (none collides: `contested` is an occupation rung and is avoided) |
| OD-PL-12 | κ values | the §3 table as DRAFT rows, each marked UNMEASURED (requirement 18) and listed on the FP-46 end-of-program tuning roster for the owner's review |
| OD-PL-13 | Genesis | unchanged: born chains are read as they are born; the physical world's seeding of polities (when the map carries political regions) is the map program's question, recorded as the seam |
| OD-PL-14 | Where PL sits in the order | a coherence chain, **C9 · THE CROWN**: PL-0/1/2 (the polity seen) + PL-4 (protection) as its first felt chain, after C2 (WC-5's call-in is PL-5's road); chosen at the previous chain's read (FP-40) |

---

## §13 WHAT A DM READS (the felt sentences, under the Evidence Law)

- "Ashford is sworn to Merewick; Merewick answers to no one."
- "The crown of Merewick holds seven towns; its hold is loose — Brenmoor outweighs it in the field."
- "Kell kept its levy home: the Ashen Host is camped below its walls."
- "Merewick did not come when Kell was besieged."
- "Ashford signed a peace with Kell while Merewick still fought it; Ashford's oath to Merewick is broken."
- "Brenmoor has pressed its claim to the crown of Merewick. Ashford and Tolle stand with Brenmoor; Kell stands with the crown."
- "The crown passes to Brenmoor; Merewick swears to it."
- "Merewick has bid Ashford and Kell lay down their quarrel; Kell refused."

Every sentence names who, upon whom, and what happened (the Evidence Law), and says nothing about what might happen.
