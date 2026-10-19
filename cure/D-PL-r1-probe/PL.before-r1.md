# DESIGN_FP_ARCH_PL — THE POLITY: the kingdom above the settlement, built from the vassal chain

## First compiled by chair session 2fc13d59 (Opus 5.5), 2026-10-17; CURED by lane L-PL (Opus 5.5)
## under chair session a73343ed (Fable 5.1), 2026-10-17. Compiled on the owner's word; DARK behind
## seven virtual flags; nothing scheduled. Bound by the FP constitution's requirements 1–24
## (`DESIGN_FP_SPINE.md` §1; 15–24's text of record is `DESIGN_FP_COHERENCE_FOLD.md` §1) and by the fold.
## `[CURED 2026-10-17 (fp-final) — <id>: …]` and `[REFINED 2026-10-17 (fp-final) — …]` brackets mark every change.

**Status: CURED 2026-10-17 (fp-final) from SPL/SX under the chair's rulings; the two open questions compiled as §14 and §15; awaiting the adversarial re-review.** Every SPL and SX id is disposed in §16 THE CURE RECORD (two ⛔ STOPs are left marked for the chair: §5's ending arm and §5.6's owed producer). The dispatch gate is the owner's: nothing here builds before the UI + prose release is pushed and deployed. The rulings in §12 are taken by delegation under the owner's words of 2026-10-16 ("i give my permission now and for whatever is emergent") and 2026-10-17 ("I defer all judgement and decisions to you"), each vetoable by one clause; the rows the owner reserved for himself are named as his. The measurements this cure rests on are in `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/L-PL.md` (master `81f1cd963`).

**The owner's words (2026-10-17), verbatim.** "the physical world is being built now. The user is the interface between the party and the world. Think of this tool as the DMs tool not the party. the DM presents chohices and options to the party and then uses this tool to bring about consequences rather than the party directly. This is not a tool for the whole table. We only supply setting and consequence." — and, building the chair's idea of "the realm layer above settlements": "For this last one, it has to be based in the vassalage system and we also have to make it coherent and compatible with our FP per individual settlement. for example, a chain of vassalages and the one that sits at the very top is the capital, referencing a feudal like system. how do settlement relationships of a kingdom work between individual settlemetns vsersus a kingdom when it comes to matters of trade, war, alliance, etc.? Who takes precedents... are there nuances, are there comprimises,, etc. Does a civil war still mean its the same kingdom but despite that different settlemetns are organizing against each other? comprehensivley think it ou." (The owner's two later questions — conversion through the chain, and the crown's control of its vassals — head §14 and §15 verbatim.)

**The answer in one paragraph.** A kingdom is not a new thing in the world; it is the shape the vassal edges already make, read upward to the settlement that answers to no one. That settlement is the capital. Every town keeps its own court, its own beliefs and its own choices; being sworn adds one voice to those choices — the liege's — whose weight the owner already fixed ("scales by how close the vassal is in culture and trade and relationship with the overlord"), and the town always keeps the larger share of its own decision. The crown speaks abroad, each town rules at home, obligations bind the seam both ways, and how many kinds of decision the liege is heard in depends on how strong the crown's hold is. Nothing is forbidden: a town may defy its liege, at a price, and two acts are the breaking of fealty itself. A feud is towns of one kingdom fighting their own quarrel; a break is a town leaving; a civil war is towns of one kingdom fighting over the crown — and yes, it is still the same kingdom, its towns on two sides. Faith, rites and the form of government drift down the chain slowly, over years; the crown's instruments of control act quickly and wear; and every one of them has a counterforce already in the world.

---

## §0 WHAT THE CODE ALREADY IS (census `dominion-xf-2fc13d59-2026-10-17/findings/V-vassalage.md`, `D-deciders.md`; research `fp-final-a73343ed-2026-10-17/findings/R4.md`; the cure's own measurements `cure/L-PL.md`; master `81f1cd963`)

**Nothing above the settlement exists.** No polity id on any settlement record, no stored polity, no chain walk anywhere in `src/` (V §1.14, §6.1–2; D §0). Hierarchy is a PAIRWISE edge read one hop at a time. Effective line counts are eslint's own (`cure/L-PL-probe/effLines.out`, CONFIRMED).

| Substrate (`path :: symbol`) | What it is (evidence) | What it gives the polity | Gate · presets | Host lines / 800 | Persisted? |
|---|---|---|---|---|---|
| relationship type `vassal` · `relationshipState.js :: ensureRelationshipState` (direction stamps `overlordSaveId/vassalSaveId`) | the sworn edge; `canonicalRelationship.js` maps the UI aliases `liege`/`suzerain` to `'vassal'` | the one link a polity is made of | ungated | 360 | PERSISTED (`relationshipStates`) |
| `occupation.js` rung `vassalized` | a matured conquest relabels the edge to `vassal`; rungs below are OCCUPATION | held lands and sworn lands | war presets | 738 | PERSISTED |
| `rulingPowerSeat.js :: foreignSeatOf` | `{regime, patronSettlementId, weight01, band, basis, grip01, closeness01, trade01, rung, primacy}`; `weight01 = grip01 × (0.6 + 0.2·closeness01 + 0.2·trade01)`; bands `dominant ≥0.70 · strong ≥0.45 · present ≥0.20 · marginal`; multiplicity CODEPOINT-FIRST (W-SEAT A1.2.15) | the walk's single step and the liege's weight | the read UNGATED; its coup term and suitors gated | 295 | derived |
| `rulingPowerSeat.js :: closenessBetween` | `cultureAffinity(buildCultureVector(A), buildCultureVector(B), { tradeTie01 })`; the vector carries the patron deity's AXES, alignment, economy, regime + same `governingName`, and shared rite motifs | closeness ALREADY holds a faith, a rite and a government term (R4 C5/C8) | ungated | 295 | derived |
| `genesisDiplomacy.js :: assignGenesisRelations` | a ≥2-rung tier gap may make an overlord; the suzerain closure holds only inside this pass | polities are BORN: 87–94% of born polities are two towns, none above four, 0 of 72,332 with a member at or above the root's tier; 64/80/86% of small/medium/large realms hold one (SPL-M8, executed over a substitute stream) | genesis | 154 | PERSISTED (edges) |
| `relationshipRulesCore.js :: vassalRules` | tribute, cold-war support, the overlord-weakness streak, protection burden, the stable compact, `independencePressure`, the rebellion stressor → `vassal_rebellion_succeeds` (→ `rival`) or `_quashed`; no faith or culture term; `vassalConfidence` reads TRUE strength | dues, strain, the break road | `relationshipDynamicsEnabled`, all six presets | **744** | PERSISTED |
| `relationshipState.js :: allianceCalls` (`RELATIONSHIP_ALLIANCE_CALL_CAP = 24`, `normalizeAllianceCalls`) appended only by `relationshipEvolution.js :: applyRelationshipPatch` from `outcome.metadata.allianceCall` | WR-6's bounded archive, kept by `ensureRelationshipState`; turning points admit only label changes (`isRelationshipTurningPoint`) | the idiom of the fealty record (§4) | ungated | 360 · 438 | PERSISTED |
| `relationshipHierarchy.js :: resolveRelationshipHierarchy` | ONE-SHOT at every `toType:'vassal'` apply, from frozen `applyWorldPulse.js` | the formation cascade | — | frozen caller | — |
| `warHomeCosts.js :: computeLevySources` | senior levies junior on `vassal`; MEASURED SILENT (`subsystemRowsWar.js`: every release case reads `war_levy` zero) | service, one hop | `warLevyEnabled`, full only | 324 | derived |
| `warCapacityReads.js :: computeAllyRelief` | `ALLY_SUPPORT_TYPES` symmetric on the edge | protection, unoriented | war presets | 143 | derived |
| `settlementStrategy.js` | own `vassalIds` read TRUE ("the belief fogs their STATE, not the contract"); recall when a vassal is besieged; no `sue_for_peace` while one is | the liege's duty | `settlementStrategyEnabled` | **763** | — |
| `tradeWar.js` `vassal_trade_coercion` | the overlord wins its vassal's supply contest | the one hard trade precedence | trade presets | 449 | condition PERSISTED |
| `warSeatBooks.js :: foreignBookFor(state, snapshot, actorId)` · `readWarSeatBooks` | `SEAT_BOOK_KINDS = ['realm','seat','patron','foreign']`; the foreign term is the liege RULER's temperament (`rulerBiases`), counterparty-blind; `const keep = 1 - foreignWeight01;`; the caller holds `opponentId` | the voice of the liege — built, dark, blind to the counterparty | `foreignSeatEnabled` (lit nowhere; OWNER-LIT, Q-S3) | 492 | derived |
| `warTermination.js :: blendBooksTerm` | blends exactly three named masses | a fifth book is impossible without a frozen line | frozen 818 | — | — |
| `foreignPrimacy.js :: FOREIGN_PRIMACY_CLASS` | OCCUPATION ONLY ("A vassal overlord has a real book and NO primacy") | ordering rights — never vassalage | — | — | — |
| `rulingPower.js :: transferRulingPower` → `powerStructure.previousGovernments` (`{ label, cause, tick }`, cap 6) | every RULING-POWER transfer: coup verdicts and conquest (`applyWorldPulse.js` powerTransfer), appointment (`applyWorldPulseFactionRoster.js` government_change), the DM's event (`mutateWorld.js`, `{ cause }`, no tick) | the fealty question's first producer (§5.6) | ungated | 288 | PERSISTED |
| `npcLadderKernel.js` `seatTransitions` | PERSON-grain seat changes: coup · challenge · succession · vacancy · government_change; GR-4's only trigger (`treatySuccession.js`: "A coup VERDICT, a conquest, a DM `CHANGE_RULING_POWER` … DM KILL/ASSIGN … write NO row") | the fealty question's second producer | `npcLadderEnabled` (four presets) | 106 (GR-4) | PERSISTED |
| `convergence.js :: scorePreserveOrder` | `FRIENDLY_REL = ['allied','trade_partner','vassal']` — a liege backs its member's incumbent; `install_friendlier_regime` needs `HOSTILE_REL`; `kinshipIncumbent01: 0` (a zeroed motive slot) | backing in a coup | `warLayerEnabled && interventionEnabled` (dramatic, full) | 764 | intervention ledger |
| `rulingPowerCoup.js :: resolveCoupVerdict` | "The five bounds sum to exactly 0.815 against a DECLARED_BUDGET of 0.82" | the coup budget is FULL | — | 121 | — |
| `warPeaceDecision.js :: PEACE_STEP` | `{ hostile: 'cold_war', cold_war: 'rival', rival: 'trade_partner' }`; the suit checks the STORED type and writes `toType` | the peace road IS a relabel (⛔ STOP-1, §5) | war presets | 370 | — |
| `warIntent.js` `HOSTILE_TYPES = ['hostile','cold_war','rival']` | "A vassal/patron hierarchy edge is never a besiege candidate" | a sworn link is never a war target; `rival` is | war presets | 154 | — |
| `peaceTermsGraph.js :: findCrossPressuredMediator` | "THE ONE FINDER, never a second algorithm" | the crown's arbitration seat | `mediationGeneralizedEnabled` (dramatic, full) | 78 | derived |
| `hegemony.js :: hegemonyRead` | treaty-only sphere; `canonLabelFor` an INJECTED resolver with NO persistence anywhere ("when the persistence lane lands", `RealmDashboard.jsx`) | the sister pattern and the christening's hook | lazy | 154 | derived |
| `dispositionChannels.js :: advanceTreatiesWithDisposition` | the kernel's treaty-advance call (snapshot, worldState, graph, tick, now); returns `{…treaty, worldState, newsEntries}` | THE POLITY STAGE'S HOST — after this tick's treaties, zero kernel lines | — | **55** | — |
| `traditions/relations.js :: applyImposition` / `applyRestoration` | ONE trade per overlord per vassalage on a YEAR-keyed draw (`IMPOSE_CHANCE = 0.3`), triggered only by `vassalOverlordOf` (the `vassalized` rung) | the one rite writer (§14) | `traditionsEnabled` (default, dramatic, living_realm, full) | 212 | PERSISTED |
| `religiousContest.js :: faithCarriersOut` | the vassal edge carries faith both ways at 0.45; the overlord's `political_authority` channel carries the liege's creed down at 0.82, distance-weighted | faith ALREADY flows down the chain | `faithSpreadEnabled` (dramatic, full ONLY) | 493 | shares PERSISTED |
| `religionLegitimacy.js :: neighbourEndorsement` | counts carrier-neighbours holding the creed as patron; a court's acceptance (`LAG 0.12`/tick) | the courts-first seam (§14) | spread-gated | 227 | PERSISTED |
| `generosityUpdates.js :: applyLegitimacyDeltasToUpdates` | the one cross-settlement legitimacy writer | the recognition act (§15) | caller's gate | 90 | writes `publicLegitimacy` |

**Binding prior words.**
- ODQ §12 (owner): *"Nothing intrinsically makes a settlement a capital. The closest in-system analog is an overlord."* — the capital is DERIVED.
- `DESIGN_COHESION_WEAVE.md` §F.3b (owner refinement): an empire is *"A PATTERN, NEVER AN ENTITY … NAMING POLITIES IS DM TERRITORY … the engine builds the bones, THE DM BAPTIZES"*.
- ODQ §735.2 (owner): *"When it comes to an occupied or vassal settlement, the ruling power will have an equal or greater counterpart in all decision-makings that is derived from the overlord or occupier… When occupied, the occupier's influence is always just greater than the legitimate ruler … In vassalage, which is much more concrete, it can be lower than an occupier's, scales by how close the vassal is in culture and trade and relationship with the overlord, and is still influential."*
- ODQ §736.1 (owner): *"any attempted coup or rebellion has a scaling factor according to the legitimacy of the ruling powers."* · §741.1 (owner): *"…it needs to also consider what each foreign power — allied or neutral or enemy settlement — will react … regarding each decision as part of any process or major decision."*
- ODQ §934.87 (owner): *"Build real realm borders"* — the borders lens drawn from *"the seat read `foreignSeatOf`, its root sovereign, over the territory partition"*.
- Amendment I (owner): *"expand all of this to wars between allied kingdoms and to three-or-more-party wars"* → a multi-party war is *"A GRAPH OF BILATERAL RELATIONSHIPS"*. Amendment S (owner): *"originals and overlords may TRADE their satellite or vassalized settlements"*.
- W-SEAT laws (`DESIGN_W_SEAT.md` §2): ONE RESOLVER PER QUANTITY · DERIVED, NEVER PERSISTED, except where a DECISION is state · PRIMACY IS ORDERING, WEIGHT IS SCALAR · `foreignSeatEnabled` is OWNER-LIT (ODQ §820 Q-S3). [CURED 2026-10-17 (fp-final) — SPL-M4: W-SEAT A1.2.15 (`foreignSeatOf`'s codepoint-first multiplicity, pinned in the seat suite) is AMENDED BY NAME here: PL12's greater-weight rule applies INSIDE `polityOf` only, so two tie rules live on two surfaces, both registered; `foreignSeatOf` and its four production readers are untouched.] [CURED 2026-10-17 (fp-final) — SPL-m4: the patron exclusion in `foreignSeatOf` is the chair's vetoable READING of §735.2, not an owner ruling.]
- W-SEAT's deferred `civilContests` ("an owner-gated class no lane may take alone", `irregularForce.js`) is a contest INSIDE one town; the polity contest is BETWEEN towns of one polity — registered apart; this program's delegation (10-16, 10-17) is the authority for `polityContests` (SX-26).
- Spine requirement 10: "out-of-posture acts are priced and receipted news, never forbidden"; requirement 24: THE HEARING WEEK.

[CURED 2026-10-17 (fp-final) — R4-13: three facts the draft's banner had wrong are corrected in place: (1) faith ALREADY flows along sworn links in the two spread presets (`faithCarriersOut`); (2) rite imposition is ONE trade per conquest-made vassalage, not a steady yearly flow; (3) `closeness01` ALREADY carries a faith term.]

---

## §1 THE LAWS (PL1–PL17)

**PL1 — THE POLITY IS A PATTERN, NEVER AN ENTITY.** A polity is the closure of SWORN links upward to a PARAMOUNT: the settlement whose own looming read names no overlord. Members, tiers, the paramount and every band are DERIVED per read; membership is never stored. THE CAPITAL IS THE PARAMOUNT — derived, never a field (ODQ §12). A sworn link is a `foreignSeatOf` view with `regime: 'vassalage'`. [CURED 2026-10-17 (fp-final) — SPL-M11: ONE pattern with two arms — the polity IS §F.3b's sworn-link arm; `hegemonyRead` keeps its treaty-only arm as the SPHERE; one christening ledger serves both (`.polity`, `.sphere`); `hegemonyFear` gains the polity as a second source of `fear_of_dominance` (§3.4).] A patron is influence, not sovereignty, and is never a member.

**PL2 — ONE ROOT READ ABOVE THE ONE SEAT READ.** `polityOf` walks `foreignSeatOf(…).patronSettlementId` upward with a cycle guard and a depth cap; it never re-derives who looms over a settlement (W-SEAT: one resolver per quantity). [CURED 2026-10-17 (fp-final) — SPL-M3 · SX-22: THE WALK STOPS AT ANY NON-VASSALAGE VIEW. An occupied lord is a paramount (or mid-lord) IN CHAINS: its own class is `occupied`, its sub-tree stays sworn to it, and the polity stands with a held head until each direct vassal answers `polity_fallen` (§5.7).] [CURED 2026-10-17 (fp-final) — SPL-M7: the walk is memoized per snapshot (the `foreignPrimacy.js` per-pass idiom) with a cost pin (DRAFT ≤ 2 ms per tick at 14 settlements, UNMEASURED).]

**PL3 — THE ENGINE BUILDS THE BONES; THE DM NAMES THE KINGDOM.** The default display is descriptive ("Merewick and its sworn towns"); the engine never mints a polity name and NEVER MOVES ONE. The only persisted naming datum is the DM's christening, written only by the DM's `NAME_POLITY` act. [CURED 2026-10-17 (fp-final) — SPL-M10: the engine never re-keys the name; at a `claim_prevails` verdict the card OFFERS the re-key as the DM's act; the default leaves the name on the old paramount's settlement as history and the polity under the new paramount unnamed until named.]

**PL4 — THE LIEGE'S VOICE IS THE OWNER'S SCALAR, UNTOUCHED, AND THE TOWN KEEPS THE MAJORITY.** [CURED 2026-10-17 (fp-final) — SPL-B1 · SX-05: κ IS STRUCK.] In a decision of a sworn member, its immediate liege is a counterpart whose weight is `foreignSeatOf(…).weight01` — the owner's "scales by how close the vassal is in culture and trade and relationship" — UNSCALED, capped at ONE CEILING: in a sworn member's book partition the foreign share never exceeds `POLITY_LIEGE_CEILING` (DRAFT `0.45`, UNMEASURED, FP-46 roster), so `keep ≥ 0.55` — the town always holds the larger share of its own decision (§735.2's "still influential", never "ordering"). What the polity's hold and the decision's CLASS set is the SPHERE: in which classes the liege's voice is heard at all (§3). Vassalage NEVER orders: primacy is occupation's alone, and the old "capped below an occupier's weight" clause is dropped (occupation orders by primacy, never by weight). PL mints NO loyalty quantity: a member's DEFERENCE is its seat weight and its word is the seat band.

**PL5 — THE VASSAL OF MY VASSAL IS NOT MY VASSAL — UNLESS THE CROWN'S HOLD IS UNBROKEN.** [CURED 2026-10-17 (fp-final) — SPL-B3 · SX-02: NO FIFTH BOOK.] The paramount reaches a sub-vassal only through the mid-lord's own decisions. Under an `unbroken` hold only, the paramount's stance (`liegeStanceToward` read for the paramount) composes INTO the member's ONE foreign book inside `foreignBookFor` as a declared blend with the immediate liege's stance (DRAFT `0.7 liege / 0.3 paramount`, UNMEASURED) — liege homage; below `unbroken` the paramount's share is zero and the partition is bit-identical. Frozen `warTermination.js` takes zero lines.

**PL6 — THE CROWN SPEAKS ABROAD; THE TOWN RULES AT HOME; OBLIGATION BINDS THE SEAM; THE HOLD SETS HOW MANY KINDS OF DECISION THE LIEGE IS HEARD IN.** (The precedence law; §3 is its table.)

**PL7 — NOTHING IS FORBIDDEN; TWO ACTS ARE DEFINED, PRICED ON THE SPOT, AND HEARD.** A member's deciders remain its own; precedence is a weighted voice and receipted news (requirement 10). Two acts break fealty by definition: (a) a SEPARATE PEACE with its liege's enemy while the liege still fights it; (b) JOINING a war or coalition AGAINST its own liege. [CURED 2026-10-17 (fp-final) — SPL-M15 · SX-23: the act is PRICED AT ONCE as defiance (a `fealty_defied` row in the fealty record and a deference patch through the one relationship writer) AND the break is proposed as the `fealty_break` hearing; a dismissal leaves the price. The detector is the polity stage (§0's host) reading this tick's new treaties and coalition joins. The remedy for a separate peace is the liege's war of submission, never a `quashed` roll. Act (b) is DARK wherever coalitions are dark (`coalitionLedgerEnabled` is false even in full_simulation) — PL-6's TIER line says so.]

**PL8 — OBLIGATIONS RUN BOTH WAYS, ARE ANSWERED, AND ARE REMEMBERED IN THE FEALTY RECORD.** Up: SERVICE, DUES, AID. Down: PROTECTION, ARBITRATION, PASSAGE. An up-obligation is answered by the member's own fork; a down-obligation is a DECIDED act of the liege. [CURED 2026-10-17 (fp-final) — SPL-B5 · SX-01: keeping and failing are written to `relationshipState.fealtyRecord`, a bounded archive on the sworn edge in the `allianceCalls` idiom (§4.6), never as turning points (the turning-point filter admits label changes only and erases anything else).] Protection kept is how deference is earned (through the trust/resentment patch that moves grip); there is no second loyalty law.

**PL9 — FEUD, BREAK, POLITY WAR: THREE DIFFERENT THINGS, AND A PAIR IS NEVER A WAR.** A FEUD is members at war over their own quarrel; a BREAK is a member leaving its liege; a POLITY WAR ("civil war" in prose) is members at war over THE CROWN ITSELF — every sworn link stays sworn in name, the polity stands, its members take SIDES, and the contest is the one persisted decision. [CURED 2026-10-17 (fp-final) — SPL-M8: a polity of two is a PAIR — a claim inside it is a BREAK (the rebellion road), never a polity war; the claim path requires three or more members.]

**PL10 — FEALTY IS ANSWERED AT EVERY SEAT CHANGE OF A LORD, BY PL'S OWN DECIDER.** [CURED 2026-10-17 (fp-final) — SPL-M2 · SX-14: the fealty question is PL's own decider (`fealtyQuestion`), not GR-4 extended; GRAMMAR keeps the treaty question (`succession_reaffirmation`), fold §3.1.10 amended to say so (the chair's).] Its producers, what each answer writes, and the one-hearing-per-pair rule are §5.6.

**PL11 — A FALLEN LORD NEITHER TAKES ITS VASSALS WITH IT NOR LEAVES THEM BLIND.** When a paramount or mid-lord falls to conquest, each direct vassal answers `polity_fallen`: `submit` · `stand_by` · `free` (§5.7). [CURED 2026-10-17 (fp-final) — SPL-M3 · SX-22: `remnant` (which names the landed faction `legitimateRemnantOf`) is replaced by `stand_by`.]

**PL12 — ONE LIEGE, NO CIRCLE.** A member has exactly one liege in the polity read: where two overlord links exist, the greater seat weight, codepoint only on a tie — INSIDE `polityOf` ONLY, behind `polityEnabled` [CURED 2026-10-17 (fp-final) — SPL-M4: the per-tick vassal rules keep serving every overlord edge as landed; multiplicity is rare by genesis; the lesser overlord keeps its dues and duties and is simply not the liege the walk names]. A circle is never a polity: the walk stops at the first repeat and receipts `polity_circle`; a subjugation that would close a circle is NAMED in its proposal (a suggestive guard — the DM decides).

**PL13 — EVERY POLITY ENGAGEMENT IS HEARD, ON THE WEEK.** Each kind in §7 is a registered engagement (requirement 24): minted only at the DM's one-week advance, alive that one week, resolved first at the next advance from the DM's answer or the default; month, season and year advances run defaults; nothing queues. The polity war is STANDING.

**PL14 — THE MOUNT RULE.** Zero lines in `pulseKernel.js` (1581), `applyWorldPulse.js` (907), `warTermination.js` (818), all frozen. Hosts at the ceiling take nothing without a leaf-first car: `generosityKernel.js` 800, `peaceTerms.js` 799, `armyTransitKernel.js` 798, `roadsKernel.js` 838 (baselined), and every host above 740 (`factionCompetition.js` 775, `convergence.js` 764, `settlementStrategy.js` 763, `relationshipRulesCore.js` 744) takes ONE call into a leaf, never logic. The POLITY STAGE is a leaf called from `dispositionChannels.js :: advanceTreatiesWithDisposition` (55 lines) [REFINED 2026-10-17 (fp-final) — the draft named no per-tick host (SX-04's class of defect); the treaty-advance wrapper is the measured home: it runs after this tick's treaties, holds snapshot, worldState, graph and tick, and returns worldState and news the kernel already reads].

**PL15 — THE PHYSICAL WORLD IS A SEAM, NOT A PREMISE.** The borders' geometry and distance from the capital read the physical world when it lands (`mappedDistanceWeight`, aspatial = 1). Every PL wave has an aspatial arm and is whole without it.

**PL16 — BELIEF, NEVER TRUTH, EXCEPT THE CONTRACT.** [CURED 2026-10-17 (fp-final) — SPL-M5 · SX-21: every observer reads the polity's state — strength, sieges, the hold — through its own belief (K3; truth only in the omniscient preset); a lord reads its own sworn CONTRACTS true (the landed carve-out: "the belief fogs their STATE, not the contract"). The hold is therefore per observer, never one band per polity.]

**PL17 — CONVERSION IS SLOW; INSTRUMENTS ARE FAST AND WEAR.** [REFINED 2026-10-17 (fp-final) — R4-14, R4-12: the owner's "these conversions that happen are slow" is BUILT, not tuned: every conversion draw in §14 is keyed by YEAR (the rite idiom `…:${sid}:${year}`) and every constant is named on `INTERVAL_WEEKS`; every control instrument in §15 is a typed decaying incident on the sworn edge (the memory weave's idiom), one decay law for all.]

---

## §2 THE ONTOLOGY

**Member classes** (derived; closed `POLITY_CLASSES`): `paramount` — answers to no overlord and has at least one sworn member · `vassal` — sworn to a liege, at tier 1..n (the landed word in its landed meaning) · `occupied` — held below `vassalized` by a member (the occupier's primacy governs it; it counts toward the polity's lands and strength, not its hold), or a lord in chains (PL2). [CURED 2026-10-17 (fp-final) — SX-16 · SPL-m1: `root · sworn · held` are struck as values (`root` generic in 205 files, `sworn` = `treaty.sworn`, `held` three landed meanings); `paramount` is free (0 src · 0 tests · 0 docs); `rootId` and `liegeId` live only as compound fields.] Prose says "the capital", "sworn to", "held by".

**The reads** (pure, lazy, memoized per snapshot, never persisted, outside the first-paint closure):
- `polityOf(worldState, snapshot, id)` → `{ rootId, liegeId, tier, path: [id … rootId], polityClass, members? }` (members only when asked for the paramount). `politiesOf(worldState, snapshot)` → every polity with ≥ 2 settlements, codepoint-sorted.
- `polityHoldOf(worldState, snapshot, rootId, observerId)` → `{ hold01, band, terms }` — the crown's hold as `observerId` believes it (§3.5's DRAFT formula).
- `liegeStanceToward(worldState, snapshot, memberId, counterpartyId)` → `{ liegeId, label, atWar, stance: 'for' | 'against' | 'none' }` — the liege's own label and war state toward the counterparty, READ THROUGH THE MEMBER'S BELIEF of its liege (truth in the omniscient preset).
- `swornLinkSuspended(worldState, snapshot, edge)` → boolean — true while a polity contest stands and the edge's ends are on different sides, or either end is the claimant or the crown (§5.3).

**The hold** (per observer; compound field `polityHold`; band words `frayed · shaky · staunch · unbroken`, lowest to highest). [CURED 2026-10-17 (fp-final) — SX-16 · R4-9: `cohesion` is landed three times (`LAW_BAND_KEYS`, faction cohesion, cartography); `nominal · loose · firm · absolute` all collide (`'nominal'` npcGenerator, `firm` PULL_BANDS rung, `loose` pulseKernel, `'absolute'` CSS).] [REFINED 2026-10-17 (fp-final) — the chair's fourth word `sound` is LANDED (`houseActs.js`: `'overdrawn', 'tight', 'sound', 'flush'`); `staunch` is free (0 · 0 · 0) and takes its place.]

**Deference** (per member) = the seat weight and band (PL4); prose: a `dominant` hold "answers to Merewick in all things"; `marginal`, "owes Merewick little but the name".

**The crown** = the paramount's court in its polity role: one court, two hats, the same deciders. The engine mints no separate actor.

**The polity's prose noun** follows the paramount's ruling power (one closed prose table, never a token): autocrat → kingdom, "the crown of X" · council → commonwealth, "X's council" · theocracy → see, "the see of X" · merchant_league → league, "the league of X" · criminal → sway, "X's sway" · mixed → "X and its sworn towns". "Realm" is the campaign world's word and is never used; `polity` stays out of DM-visible prose (the institutional catalog already says "an independent polity", SPL-m6).

**Precedence classes** (closed `PRECEDENCE_CLASSES`): `war_abroad · peace_abroad · alliance_abroad · diplomacy_abroad · trade_abroad · justice_at_home · own_seat · fealty_itself` (§3).

**THE TOKEN CENSUS** (`rg -w -i`, worktree `src/` (generated excluded) · `tests/` · the ledger's `docs/`; `cure/L-PL-probe/tokens.out`, CONFIRMED):

| Token | src · tests · docs | Verdict |
|---|---|---|
| `polity` | 13 src (prose "an independent polity") | code token for the pattern; never DM-visible prose |
| `paramount` · `polityHold` · `polityHoldOf` · `staunch` | 0 · 0 · 0 | FREE — minted |
| `frayed` · `shaky` · `unbroken` | 4 · 4 · 6 src, prose only (no quoted value) | FREE as values |
| `sound` | 30 src, quoted `'sound'` (`houseActs.js`) | LANDED — not used |
| `apex` | 13 src | LANDED — not used |
| `polityContests` · `polityNames` · `fealtyRecord` · `fealtyRow` · `swornLinkSuspended` · `liegeStanceToward` · `applyPolityVerdict` · `fealtyQuestion` · `rebellionKind` · `relief_answer` | 0 · 0 · 0 | FREE — minted |
| `polity_claim` · `polity_war` · `polity_fallen` · `polity_arbitration` · `polity_recognition` · `fealty_break` · `fealty_question` · `allegiance_choice` | 0 src (docs only: this volume and the fold) | FREE — minted (the draft's `crown_*` renamed: `crown` collides with `crown_jewel` and `historyGenerator.js`'s `'crown'`) |
| `fealty_broken` · `fealty_restored` (casus pair) · `fealty_withheld` · `fealty_defied` · `protection_kept` · `protection_failed` · `relief_sent` · `relief_kept` · `service_answered` · `service_refused` | 0 src | FREE — minted |
| `war_abroad` … `fealty_itself` · `PRECEDENCE_CLASSES` · `POLITY_HOLD_BANDS` · `stand_by` | 0 · 0 · 0 | FREE |
| `SWEAR_FEALTY` · `RELEASE_VASSAL` · `OPEN_CLAIM` · `NAME_POLITY` | 0 · 0 · 0 | FREE — realm-manifest rows |
| `submit` | 26 src (`copy/en.js` key `submit:`) | verdict word; homonym registered (a UI copy key) |
| `lapsed` | 63 src (`'lapsed'` realm item actions; WC's `call_in_answer`; GR-5's `pact_renewal`) | verdict word with the SAME meaning (ran out undecided); registered |
| `withheld` · `recognized` | 58 · 19 src (`grammarWalker.js` key; `simulationProfile.js` key) | verdict words on the docket only; homonyms registered |
| `renew` | 5 src, unquoted | verdict word; registered beside GR-5's `renewed` |
| `partition` | 65 src, unquoted (`seatBooksPartition`) | verdict word; this volume says "the books' shares" for book weights |
| `charter` | landed route-charter verdict and DefenseTab force | stays a treaty OCCASION word; homonyms registered |
| `imposition` · `rite_imposed` · `endorsement` · `appointment` · `religious_contest_conversion` · `religious_conversion_fracture` · `hostage_exchange` | LANDED | reused in their landed meanings only (§14, §15) |
| `court_match` · `fosterage` | 0 · 1 prose | FREE — the court-bond flavours' slot words (§15) |
| `liege` · `suzerain` | UI relationship aliases → `'vassal'` | PROSE-ONLY; `liegeId` a compound field only |
| `league` | `merchant_league` | never a code token for vassals' leagues |
| `crown` (verdict word in `allegiance_choice`; compound `crown_prevails`) | 57 src (`'crown'` in `historyGenerator.js` generator data; `crown_jewel` appraisal band) | kept as a VERDICT word on the docket only (the ruling renamed kinds, not verdicts); homonyms registered — never a kind, book or ledger token [REFINED 2026-10-17 (fp-final) — SPL-m1 left the verdict words standing; the register now records them] |

---

## §3 PRECEDENCE — WHO DECIDES WHAT (the owner's question, answered class by class)

The rule beneath every row: **the member decides; its immediate liege is one voice in that decision at the owner's scalar `weight01`, never above the ceiling (PL4); the CLASS and the HOLD set only whether that voice is heard at all — the SPHERE.** Nothing here is a veto. [CURED 2026-10-17 (fp-final) — SPL-B1 · SX-05: the κ column is replaced by a SPHERE column per hold band; SPL-m3: every DRAFT cell is marked UNMEASURED.]

**3.1 Whose hold sets the sphere.** The hold the DECIDING member believes its IMMEDIATE liege has over that liege's direct vassals (`polityHoldOf(worldState, snapshot, liegeId, memberId)` — every lord is the head of its own sub-tree for this read). [REFINED 2026-10-17 (fp-final) — the ruling forbids keying a sub-vassal to the paramount's hold (SPL-B1's "a third court's band"); reading the immediate liege's own hold over its own vassals keeps the quantity on the pair, and the paramount enters a sub-vassal's decision only through PL5 under `unbroken`.]

**3.2 THE SPHERE TABLE** (✓ = the liege's book is read in this class; — = the member decides as an unsworn town; the ceiling `0.45` binds wherever ✓; every cell UNMEASURED, FP-46 roster):

| Class (`PRECEDENCE_CLASSES`) | `frayed` | `shaky` | `staunch` | `unbroken` | What it means in play |
|---|---|---|---|---|---|
| `war_abroad` — declaring or joining a war on an outsider | ✓ | ✓ | ✓ | ✓ (+ the paramount's stance, PL5) | A sworn town that marches on a neighbour its liege is at peace with is pulled back by its liege's voice; under a frayed hold that pull is still there but nothing else is. |
| `peace_abroad` — making or accepting peace with an outsider | — | ✓ | ✓ | ✓ | When the crown makes peace with Kell, each member at war with Kell weighs it on its own front (Amendment I: a graph of bilateral peaces); a SEPARATE peace while the liege still fights is PL7(a), in every band. |
| `alliance_abroad` — `defensive_pact`, `allied` with an outsider | — | — | ✓ | ✓ | A pact with the liege's enemy is weighed against the liege's stance and its anticipated reaction (§741.1). |
| `diplomacy_abroad` — envoys and offers to outsiders | — | — | ✓ | ✓ | The two envoy reads (interception, the negotiation picture) hear the liege. |
| `trade_abroad` — trade pacts and stances toward outsiders | — | — | — | ✓ | Under an unbroken hold, the crown's EMBARGO is one input to each member's trade stance (EC-6) at a named rung (§3.3); below it, towns trade as they like. |
| `justice_at_home` — a feud between members | tolerated | the liege mediates first | the liege may order it ended (`polity_arbitration`) | as staunch | §6. |
| `own_seat` — coups, councils, faith at home | — | — | — | — | Unchanged; the landed `preserve_order` lets a liege back its member's incumbent (§15). |
| `fealty_itself` — changing liege, breaking free, being conveyed | the member's own | | | | The landed break road (heard, §7); WR-10's sale of a vassal is the LIEGE's own act in this class. |

**3.3 The liege's stance — the term that sees the counterparty.** [CURED 2026-10-17 (fp-final) — SPL-B2: the foreign book's term was the liege ruler's temperament (`rulerBiases`), blind to the opponent.] `liegeStanceToward` becomes the foreign book's DIRECTIONAL term for sworn members, composed inside `warSeatBooks.js :: foreignBookFor` (host 492; its caller `readWarSeatBooks` already holds `opponentId`, so the module-private function gains the argument): at peace with the counterparty → the book leans against war with it (its `continueBias01` toward peace); at war with it → for war; no relation → the temperament term alone. The blend is declared once (DRAFT `0.6 stance / 0.4 temperament`, UNMEASURED). The ceiling binds at the one place it can: `keep = 1 − min(POLITY_LIEGE_CEILING, weight01)` for `regime === 'vassalage'` only (occupation untouched). Everything sits behind `foreignBookFor`'s landed gate (`foreignSeatEnabled !== true → null`), so PL-3 waits on the owner's lighting (OD-PL-5). The crown's embargo enters EC-6's stance derivation at a new rung BELOW the pair's own war stance and ABOVE the trade-memory rung (DRAFT; EC's volume takes the bracket — the chair's).

**3.4 The ten book call sites, classed** (`rg 'readWarSeatBooks('`, CONFIRMED). `readWarSeatBooks` takes `decisionClass`; absent ⇒ `peace_abroad`, because the two callers that cannot pass an argument are frozen `warTermination.js`'s, and they ARE the termination decision. [CURED 2026-10-17 (fp-final) — SPL-B2's unclassed sites.]

| Call site | Class |
|---|---|
| `warTermination.js` ×2 (frozen) | `peace_abroad` (the default; zero lines) |
| `warPeaceDecision.js` · `peaceTermsCoalition.js` | `peace_abroad` |
| `warCoalitionDecision.js` · `warCoalitionRefusal.js` | `war_abroad` |
| `envoyInterceptionStage.js` · `envoyNegotiationPictureBuilder.js` | `diplomacy_abroad` |
| `sovereigntyIntent.js` (the sale) | `fealty_itself` (the liege conveying a vassal is its own act; the member's book is not asked) |
| `armyTransitKernel.js` (798/800) | EXEMPT — passage, not a decision: `decisionClass: 'exempt'` rides INLINE on the existing call line (zero effective lines; measured at PL-3's car-0, else the default stands and is recorded) |

The DECLARATION of war reads no book today (zero `readWarSeatBooks`/`foreignSeatOf` calls in `settlementStrategy.js`, `warIntent.js`, `warDeployment.js`, `pactFormation.js`, `tradeWar.js`). It reads the book through W-SEAT D2's owed chooser seat term, built on THE CHOOSER'S SHARED-SIGNAL CAR (SX-08: one context read in `settlementStrategy.js` that EC-17, MN-4, PL-4, HB row 7 and INT's factor seam all consume; built by the first of those chains to land; the fold records it as a cross-program unit). PL-3 names that car as its car-0 and waits on it. The pact answer (`pactFormation.js`, 565) reads the book for `alliance_abroad` through one call.

**3.5 The hold — the DRAFT formula** (every weight and threshold UNMEASURED, FP-46 roster). [CURED 2026-10-17 (fp-final) — SPL-M5 · SX-21; REFINED by R4-6 and the chair's §6 ruling: the mean seat weight already carries grip (leverage, dependency, pact, fear, resentment) and closeness (faith axes, rites, government, the trade label); adding resentment, burden or fault lines again would double-count.]

`hold01(head, observer) = clamp01( 0.45·D̄ + 0.20·L + 0.20·Sᵦ + 0.15·P − 0.15·G − 0.10·X )`
- `D̄` — mean `foreignSeatOf(member).weight01` over the head's DIRECT vassals (landed).
- `L` — the head's `publicLegitimacy.score / 100` as the observer believes it (recognition given lands HERE, §15.1).
- `Sᵦ` — the head's BELIEVED strength share among head + direct vassals (the head reads its contracts true and its vassals' strength believed).
- `P` — protection kept ÷ (kept + failed) over the head's fealty records in a `INTERVAL_WEEKS.year` window; 0.5 when empty.
- `G` — share of direct vassals in a standing coalition against the head (0 while `coalitionLedgerEnabled` is dark).
- `X` — mean `1 − mappedDistanceWeight(head, member)` (0 aspatial).
Bands by `SEAT_TUNING.BANDS`' floors (0.70 · 0.45 · 0.20; one band derivation, the hegemony idiom): `unbroken ≥ 0.70 · staunch ≥ 0.45 · shaky ≥ 0.20 · frayed`. The hold has no decay law of its own; it moves only as its inputs move.

**3.6 The kingdom's encirclement counterforce.** [CURED 2026-10-17 (fp-final) — SPL-M11.] `hegemonyFear.js` (92 lines) reads `politiesOf` as a second source of `fear_of_dominance` beside the treaty sphere, with the same belief-side `strengthOf`: neighbours fear the kingdom they believe in (requirement 2). Behind `polityEnabled`; a same-seed shift wherever war reasons are lit, signed at PL-2's lighting.

**Compromises — where the nuance lives** (each names the LANDED input it moves; closeness01 is moved by NONE of them — it is culture and trade). [CURED 2026-10-17 (fp-final) — SPL-M6 · SX-17.]
- **Scutage** — coin in place of men (W-COIN's treasury, when lit): the summons is answered `answered` with coin; the member's BURDEN (protection-burden resentment) is spared; the crown's contingent is smaller.
- **Half service** — WC's `half_answered`; a `service_answered` row with the fraction.
- **Commuted dues** — one charter term trading the tribute rule's severity against the levy draw (two landed knobs).
- **The charter** — a TREATY between liege and member drafted by GRAMMAR's `PACT_DRAFT_LENS` on a `charter` occasion (a restive member; deference falling toward `present`) [CURED 2026-10-17 (fp-final) — SPL-M14: fold §3.1.1 rules the lens as the producer; the chair amends its row to add the occasion; `peaceTerms.js` (799/800) takes it through a leaf car named in PL-5]. The three trade-rights rows (`toll_exemption · market_access · exclusivity`) are its terms; a charter enters grip's `pact` term, and so deference.
- **The autonomy charter** — a charter whose term narrows the member's sphere for named classes (one GRAMMAR term row, OD-PL-9). ⚠ Its code token avoids `autonom…` (`relationshipRuleHelpers.js :: ESCALATION_HINT` matches it, R4 H7): the term is `narrowed_sphere`.
- **The court bond** — §15.6 (a slot, not built here).
- **Arbitration** — §6.

---

## §4 OBLIGATIONS IN DETAIL

**4.1 Service.** Today one hop, involuntary and measured silent. PL-5 (after WC-5) makes it a SUMMONS answered by each member on WC's `call_in_answer` (`answered · half_answered · refused · lapsed`): the fork reads the member's deference, its own war exhaustion, its own threat (an outside menace at its walls excuses it in the record's voice — "Kell kept its levy home: the Ashen Host is camped below its walls"), its strength, and its fealty record. Under `staunch`+ the summons CASCADES (the crown summons its direct vassals; each mid-lord answers for itself and summons its own); under `unbroken` the crown may summon every member directly. Each answer writes a `service_answered` / `service_refused` row. The levy's silence is cured first (PL-5's car-0 measures why the release cases read zero).

**4.2 Dues.** Unchanged (the landed rule), one hop, to every overlord edge (PL12).

**4.3 Protection — ONE relief decision with a refusal arm.** [CURED 2026-10-17 (fp-final) — SX-07: wall relief was automatic and symmetric, the recall a probability-1 override, so "Merewick did not come" could never fire.] On a SWORN edge, relief is a DECIDED act `relief_answer: sent · kept` by the liege's own fork — deference owed (the seat band), its own threat, its exhaustion, and its BELIEF of the siege — taken by the polity stage in the week a member's siege (or a menace at its walls, MN's besieger union) first appears, and written as a `relief_sent` / `relief_kept` row keyed by the siege episode. `warCapacityReads.js :: computeAllyRelief` (143) reads that row for sworn edges (counts the liege only on `sent`); the generic symmetric ally relief stays automatic for unsworn allies until WC-4's contribution dispatch lands (then one road). Relief is counted in the siege verdict OR as a REINFORCE army, never both (MN-4 obeys the same rule). The failure window is the strike's hearing week: when the siege resolves with the liege `kept`, the row's sibling `protection_failed` is written; `sent` writes `protection_kept`. Under `staunch`+ the paramount's duty reaches a sub-vassal whose mid-lord answered `kept`. Each row also patches trust/resentment through the one relationship writer, which moves grip and so the owner's scalar — that is how protection earns deference.

**4.4 Aid.** The landed generosity duty (`generosityKernel.js`, `vassalBreach`) unchanged; its host is at 800, so PL reads it, never extends it.

**4.5 Passage.** [CURED 2026-10-17 (fp-final) — SPL-M13: a toll waiver set by the crown's band was a hard override and a second exemption law.] Passage is a CHARTER TERM: the crown grants `toll_exemption` polity-wide (GRAMMAR's lens, `charter` occasion), executed by EC-6's ONE `toll_exemption` executor. "Members' armies are not hostile on one another's roads" is STRUCK — feuding members may be hostile; passage is tolls only.

**4.6 THE FEALTY RECORD — `relationshipState.fealtyRecord` (persisted shape 3 of 4).** [CURED 2026-10-17 (fp-final) — SPL-B5 · SX-01.] [REFINED 2026-10-17 (fp-final) — measured (`cure/L-PL.md` §1b): in the `allianceCalls` idiom the archive is NORMALIZED by `ensureRelationshipState` and APPENDED only by the one relationship writer `applyRelationshipPatch` from `outcome.metadata.allianceCall`; so the polity module MINTS a `fealtyRow` on a relationship outcome and `applyRelationshipPatch` appends it (`outcome.metadata.fealtyRow` → `appendRelationshipFealtyRow`) — the ruling's "one writer in the polity module" would have been a second writer of relationship state.] Shape: a closed row `{ rowId, tick, kind, relationshipKey, episodeId?, fraction? }`, `kind ∈ protection_kept · protection_failed · relief_sent · relief_kept · fealty_withheld · fealty_defied · service_answered · service_refused · fealty_renewed`; `rowId = [kind, relationshipKey, episodeId ?? tick].join('.')` (exact-once); cap 24 (`RELATIONSHIP_FEALTY_RECORD_CAP`, beside the alliance-call cap), oldest-wins dedupe, newest-cap, drop-when-empty; malformed imports never become facts. Readers: the hold's `P` (§3.5), the fealty question (§5.6), the allegiance choice (§5.3), PL-4's felt line, HB's closes. Round-trip pinned through ensure and normalize (the `tp-probe` case inverted). No turning point is written for it.

---

## §5 THE POLITY WAR — CIVIL WAR, THOUGHT THROUGH

[CURED 2026-10-17 (fp-final) — SPL-m1: renamed from "crown war" in every code token; prose says "civil war" and "the crown".]

**5.1 Is it still the same kingdom? Yes.** Every sworn link stays sworn IN STORAGE; the polity read returns ONE polity for the contest's whole life; the dossier says "the crown of Merewick is contested by Brenmoor"; outsiders still treat with "Merewick and its sworn towns". What changes is that the members are on SIDES, and the sides fight.

**5.2 The claim.** A CLAIM to the crown is pressed by a SWORN member's court (never an outsider — that is conquest) in a polity of THREE OR MORE members (a pair's claim is a break, PL9). Occasions: (1) a member answers the fealty question `claim` (§5.6); (2) a strong member against a weak crown — PL's own decider in the polity stage, weekly: the hold `frayed` or `shaky` as the member believes it, the member's believed strength share at or above the paramount's, its legitimacy above the paramount's [CURED 2026-10-17 (fp-final) — SX-12: occasion (2) is decoupled from GR-4's host, so the claim and the sides are preset-blind and aspatial; born vassals sit two tiers down, so this occasion is rare on born polities — PL-10 measures claims per century before C9]; (3) the DM's `OPEN_CLAIM` (§9). The claim's strength reads `CLAIM_BASIS_BY_RULING_POWER` (`titularSuccession.js`), dark until heirs light; the aspatial arm reads strength share, legitimacy and a court bond with the paramount when bonds land. The claim is the `polity_claim` hearing (`pressed · withdrawn`).

**5.3 Sides, and the suspended link.** Each sworn member answers `allegiance_choice` (`crown · claimant · aside`), reading its deference to the paramount against its closeness to the claimant (the owner's three), its BELIEF of the two sides' strength, its fealty record, and its own appetite (SP-C); a mid-lord's answer carries its vassals' default, which they may answer differently. [CURED 2026-10-17 (fp-final) — SPL-B4 · SX-20, decision side.] ONE shared leaf predicate `swornLinkSuspended` (§2): while true, the sworn edge READS AS `rival` to every war and peace decider — a legal war target (`HOSTILE_TYPES` includes `rival`) and no longer a friend. Nothing is relabeled; the christening and the walk stand. Each reader takes the predicate as a one-line guard behind `polityContestEnabled`. [REFINED 2026-10-17 (fp-final) — measured (`vassalReaders.txt`, 52 files name the vassal type): the ruling's nine readers are joined by five more war-side readers, and a WALKER pins the set.]

| Reader (guarded) | Host lines | Car |
|---|---|---|
| recall + the no-sue gate (`settlementStrategy.js`) | 763 | the chooser's shared-signal car (§3.4) |
| relief (`warCapacityReads.js :: computeAllyRelief`) | 143 | — |
| the levy (`warHomeCosts.js :: computeLevySources`) | 324 | — |
| tribute + the stable compact (`relationshipRulesCore.js :: vassalRules`) | 744 | a leaf call (PL14) |
| the trade override (`tradeWar.js`) | 449 | — |
| the peace step (`warPeaceDecision.js`) | 370 | — (⛔ STOP-1 below) |
| `preserve_order` (`convergence.js`) | 764 | a leaf call |
| `vassalBreach` (`generosityKernel.js`) | **800** | a leaf-first car out of the kernel before PL-9 |
| the war target legality (`warIntent.js`) | 154 | — |
| `deploymentReturn.js` (an army returning to a vassal home) · `warCosts.js` (the friendly set) · `warAllianceRisk.js` (`responseWeight`) · `mobilizationReactions.js` (`DEPENDENT_TYPES`) · `conquestDoctrineStage.js` (`COALITION_FRIENDLY_LABELS`) | measured at PL-9's car-0 | — |

The walker `tests/lint/swornReaders.walker.test.js` lists every `src/domain` file that reads the vassal type and REDS unless it is in GUARDED (above) ∪ EXEMPT (with a reason: the display, the canonical alias table, genesis, the seat read itself) — a new reader cannot forget the predicate (structural prevention; shrink-only exemptions).

**5.4 The persisted fact — `spatialLedgers.polityContests` (persisted shape 2 of 4).** `polityContests[contestedLiegeId] = { contestId, claimantId, crownId, sinceTick, sides: { [memberId]: 'crown' | 'claimant' | 'aside' }, causedBy }` — one record per contested lord (a contest may form at any tier), drop-when-empty, closed vocabulary, ONE writer (`polity.js :: writePolityContest`, called by the polity stage at a `pressed` verdict and by `applyPolityVerdict`). It is a DECISION, so it is state (W-SEAT). A TRACKED/EXEMPT row in `spatialUsage.js` (EXEMPT: not a mover). [CURED 2026-10-17 (fp-final) — SPL-m7: PL-9's stage is the polity stage; its writer is named.]

**5.5 Endings — the one typed writer.** [CURED 2026-10-17 (fp-final) — SPL-M1.] `applyPolityVerdict` (the polity module) is the ONE ending writer; its AUTHORITY IS THE HEARING SEAL (the DM's verdict, or the engine's default when the docket resolves). It writes the relabels and the one new `vassal` edge (old paramount → new paramount) through `applyRelationshipPatch` with the hearing's provenance (`causedBy` = the seal event), NEVER through the proposal policy — one fact, one hearing (requirement 24); the always-proposal rule for `relationship_label_change` (`changeAuthorityPolicy.js`) is exempted BY NAME for this writer. The formation cascade (frozen `applyWorldPulse.js`) is NOT suppressed: it is the correct one-shot alignment of a re-sworn link; the writer orders its relabels so the cascade runs last on the final shape (pinned). Verdicts of `polity_war` (`continues · claim_prevails · crown_prevails · partition · lapsed`) [CURED 2026-10-17 (fp-final) — SPL-m2 · SX-20: `lapsed` added]:
- **`claim_prevails`** — the claimant becomes the paramount: every link to the old paramount re-points to the claimant (each direct vassal answers the fealty question at the next week: `renew · free`), and the old paramount answers its own. The card OFFERS the DM the christening's re-key (PL3).
- **`crown_prevails`** — the claimant's side re-swears (links kept; a deference-down patch) or is stripped (conquered towns held; a town the crown casts off goes free).
- **`partition`** — the claimant's sworn side re-points to the claimant (the claimant's own link to the old paramount is relabeled `rival` by the same writer): two polities. The name stays with the side holding the old paramount; the other is unnamed until the DM names it. The chronicle records the lineage ("Brenmoor's towns broke from the crown of Merewick").
- **`lapsed`** — neither side has fought for a season (`INTERVAL_WEEKS.season`) or the DM ends it; the contest record drops; links un-suspend.
- **`continues`** — the default every week the contest stands and none of the above holds.

⛔ **STOP-1 (SPL-B4 · SX-20, the ending arm).** The ruling reads "PEACE_STEP's existing rows apply and the member wars end by the existing peace machinery; NOTHING is relabeled". Both cannot hold at master: `warPeaceDecision.js :: PEACE_STEP` maps `rival: 'trade_partner'`, and the suit checks the STORED type (`currentTypes.some((currentType) => currentType !== offeredFromType) || PEACE_STEP[offeredFromType] !== offeredToType`) and writes `toType` — so a peace on a suspended sworn edge either fails (stored `vassal`) or relabels the link to `trade_partner`. Left for the chair: (A) the suit is refused on a suspended edge and a member war ends when the verdict lifts the suspension (the edge reads `vassal` again and is no war target; whether the war record closes cleanly on that read is UNMEASURED); or (B) a flagged polity arm of the step, `rival (suspended) → the stored label`, whose patch is a truce mark in `polityContests` and writes no label. Nothing in this volume relies on either until the chair rules.

**5.6 THE FEALTY QUESTION — PL's own decider.** [CURED 2026-10-17 (fp-final) — SPL-M2 · SX-14.] [REFINED 2026-10-17 (fp-final) — measured (`cure/L-PL.md` §1e): no single landed record carries every seat change; the ruling's "rulingPowerHistory" does not exist.] PRODUCERS, both LIVE: (1) a new row on the lord's `powerStructure.previousGovernments` (`transferRulingPower`: coup verdicts, conquest, appointment, and the DM's `CHANGE_RULING_POWER`, whose row carries no tick — the stage keys each row by its position and label, exact-once through a `fealty_renewed`/`fealty_withheld` row's `episodeId`); (2) a new `seatTransitions` row (coup · challenge · succession · vacancy · government_change). ⛔ **STOP-2 (owed producer):** a DM KILL/ASSIGN writes neither, so it opens no question until GR's six-site succession record is chartered (recorded with that slot; nothing invented). Each DIRECT vassal of the lord answers `fealty_question` at the next one-week advance: `renew` (nothing but a `fealty_renewed` row and a small deference-up patch) · `withhold` (the link stands; a `fealty_withheld` row; dues suspended one season — a priced sulk; the liege may arbitrate or make war) · `claim` (opens `polity_claim`, in a polity of three or more; else it is `free`) · `free` (the landed break road's proposal with cause `fealty_question`). ONE HEARING PER PAIR: where GR-4's `succession_reaffirmation` would fire for a treaty between the same pair, the fealty question subsumes it and the treaty question is re-asked only after `renew`. The decider reads the vassal's deference, its fealty record, its belief of the new lord's strength and legitimacy, and the cause (a coup's heir is weighed harder than a succession's).

**5.7 The fallen lord.** When a paramount or mid-lord falls to conquest (`previousGovernments` row with cause `conquest`), the walk stops at it (PL2) and each direct vassal answers `polity_fallen` at the next week: `submit` (the typed writer re-points its edge to the conqueror) · `stand_by` (keeps its edge to the held lord's court) · `free` (the break). Default: `stand_by` where the vassal's deference band is `strong`+, else `free`.

**5.8 Feud, break and polity war, side by side.**

| | Feud | Break (secession) | Polity war (civil war) |
|---|---|---|---|
| Who fights | two members | a member against its liege | members against members, over the crown |
| At stake | their own quarrel | the member's freedom | who holds the crown |
| Is the polity at war? | no | no — it loses a member if the break holds | yes, with itself; still one polity |
| The links | stay sworn | the breaker's link → `rival` | stay sworn in storage; read `rival` across sides while suspended |
| The crown's role | the first mediator; may order it ended under `staunch`+ | the party broken from; may make war to bring it back | a side |
| Ends in | arbitration, exhaustion, a peace | the break held (free) or quashed | `claim_prevails · crown_prevails · partition · lapsed` |
| Smallest polity | three (two members) | two | three |

---

## §6 THE CROWN'S PEACE — FEUDS AND ARBITRATION

Co-vassals of one liege may be hostile with no rule today (the cascade excludes `vassal`). PL-7 makes the common liege THE FIRST MEDIATOR: the one mediator finder (`peaceTermsGraph.js :: findCrossPressuredMediator`, 78 lines, "THE ONE FINDER, never a second algorithm") gains ONE precedence rule — a common liege of both parties is tried first, cross-pressured or not. Under `staunch`+ the liege may ORDER the feud ended: `polity_arbitration` (`accept · refuse`); refusal is priced (a `fealty_defied` row and the deference patch) and, under `unbroken`, is cause for the liege's war of submission. [CURED 2026-10-17 (fp-final) — SPL-M12 · SX-13: the finder's precedence rule and the war of submission sit under `polityObligationsEnabled`; the finder is lit in dramatic and full, so lighting is a declared same-seed shift there.]

---

## §7 THE HEARINGS (requirement 24 — the engagement-registry rows PL owns)

[CURED 2026-10-17 (fp-final) — SPL-m1 · SPL-m2 · SX-16 · SX-14: renamed kinds (`crown_*` → `polity_*`; the hearing `fealty_broken` → `fealty_break`, the casus keeps `fealty_broken`); `remnant` → `stand_by`; `lapsed` added; the fealty question is PL's, not GR-4's. The chair replaces the fold §3.4 rows.] Every kind's parties use the one actor-ref convention `{kind:'settlement', id}`; the proposals queue's `targetSaveId` is always a real settlement.

| Kind | Owner | Climax | Verdict words | Class | DEFAULT verdict |
|---|---|---|---|---|---|
| `fealty_question` | PL (PL-8) | the week after a lord's seat changes hands (§5.6) | `renew · withhold · claim · free` | CLIMAX | the decider's answer (§5.6) |
| `polity_fallen` | PL (PL-8) with the war volume's reads | the week after a lord falls to conquest | `submit · stand_by · free` | CLIMAX | `stand_by` at `strong`+ deference, else `free` |
| `polity_claim` | PL (PL-9) | the claimant's decision week | `pressed · withdrawn` | CLIMAX | the decider's choice |
| `allegiance_choice` | PL (PL-9) | each member's answer, the week after `pressed` | `crown · claimant · aside` | CLIMAX | the decider's choice |
| `polity_war` | PL (PL-9) | every week the contest stands | `continues · claim_prevails · crown_prevails · partition · lapsed` | STANDING | `continues` (the ending conditions of §5.5 when met) |
| `polity_arbitration` | PL (PL-7) via GR-6 | the liege's order | `accept · refuse` | CLIMAX | the member's fork |
| `fealty_break` | the relationship plane's break road with PL's definitions | the break's resolution; or the week of a definitional act (PL7) | the landed `succeeds · quashed` | CLIMAX | the landed roll; a definitional act defaults `succeeds` |
| `relief_answer` | PL (PL-4) | the week a member's siege first stands | WC's `sent · kept` (same meaning) | CLIMAX | the liege's fork (§4.3) |
| `polity_recognition` | PL (PL-12) | the week after a member's seat changes hands | `recognized · withheld` | CLIMAX | the liege's fork (§15.1) |
| `polity_appointment` | PL (PL-12) | the liege's appointment act | `appointed · refused` | CLIMAX | `refused` (an appointment is never the engine's default — the DM's or the member's yes only) |
| `call_in_answer` | WC (WC-5) — PL's summons rides it | the summoned member's answer | `answered · half_answered · refused · lapsed` | CLIMAX (registered) | WC's |

At a one-week advance each climax is docketed and the DM may leave it, TILT it (a bounded thumb: a declared term on the decider's score where the decider draws no randomness — every PL decider above draws none — so each PL kind's tilt is a score term, slight · heavy) or give a VERDICT; month, season and year advances run defaults (requirement 24(c)); nothing is held over an advance. A polity war's verdict in any week forces the hand that week. No PL kind involves the party, so no party default applies.

---

## §8 THE FLAGS (virtual; absent-when-dark; read `=== true`; each lands with its certification row and its lit-mutant pins; every arm also needs `hearingWeekEnabled` for its pause — dark, each climax resolves in its tick as today)

| Flag | Gates | Host flags it needs | Presets it may light in |
|---|---|---|---|
| `polityEnabled` | the walk, the hold, the christening ledger, dossier and Herald lines, the borders lens's read, PL12 in `polityOf`, `hegemonyFear`'s polity source, the rebellion-homonym cure and the `fealty_broken`/`fealty_restored` casus [CURED 2026-10-17 (fp-final) — SPL-M12 · SX-13: both changes gated; the homonym cure is a declared same-seed shift in the six presets where the vassal rules are lit, signed at PL-2's lighting] | none (aspatial) | all six |
| `polityPrecedenceEnabled` | the sphere, the ceiling, `liegeStanceToward` in the book, the paramount's blend under `unbroken`, PL7's definitions and their price | `polityEnabled` + `foreignSeatEnabled` (OWNER-LIT, Q-S3 — PL never lights it) | wherever the owner lights the seat |
| `polityObligationsEnabled` | the relief decision, the fealty record's writes, the summons cascade, scutage, charters, passage, the common-liege mediator rule, the war of submission | `polityEnabled`; the service arm WC-5's flags; scutage `treasuryEnabled`; relief `warLayerEnabled` | war presets for relief; the record everywhere |
| `politySuccessionEnabled` | the fealty question, the fallen lord's vassals | `polityEnabled`; producer (2) needs `npcLadderEnabled` | all six (producer 1 is ungated) [REFINED 2026-10-17 (fp-final) — the draft hung this on `oathHolderEnabled` (dramatic + full only, SX-12); PL's own decider needs no GR-4 host] |
| `polityContestEnabled` | claims, allegiance, `polityContests`, `swornLinkSuspended` and its guards, `applyPolityVerdict`, partition | `politySuccessionEnabled`; the war arm `warLayerEnabled` | the claim and sides everywhere; the fighting in war presets |
| `polityConversionEnabled` | §14's widened rite trigger and the liege's endorsement weight; the fault line in the break | `polityEnabled` + `traditionsEnabled` (rites); `faithSpreadEnabled` (the faith arm, dramatic + full only) | rites: four presets; faith: two |
| `polityControlEnabled` | §15's recognition, appointment, the kinship motive's faith/culture input, outside patrons across a strained link, the crown-backed faction tilt, the wearing incidents | `polityEnabled`; backing `interventionEnabled && warLayerEnabled`; the tilt `factionCompetitionEnabled`; wear `memoryWeaveEnabled` | per instrument (§15) |

Lit-mutant pins: each flag's arm, lit alone, moves only its own outputs (the dark-identity golden for the rest). [CURED 2026-10-17 (fp-final) — SX-27: `hearingWeekEnabled` named.]

---

## §9 THE WAVES (every wave: leaf modules · hosts · FIRST-VISIBLE · TIER · DEGRADED ARM · EDITOR · Alignment · `causedBy`)

[CURED 2026-10-17 (fp-final) — SPL-M9: every wave gains L10's five-member EDITOR line (seal · direction row · counterparty · states at the chokepoint · the cause) and requirement 13's Alignment line; SX-24: every child receipt names its `causedBy` parent; SX-15: PL is a CARRIER across GRAMMAR · WAR · INTERIOR · TRADE · INFO (the chair amends fold 21(a)); SX-28: no wave that lands behaviour is called instrumentation.] THE VERBS (realm-manifest rows, ≤4 dials, settlement targets; AUTHOR acts stage-then-approve, the landed shape): `SWEAR_FEALTY` (member · liege — it is so) · `RELEASE_VASSAL` (liege · member) · `OPEN_CLAIM` (claimant → the `polity_claim` hearing) · `NAME_POLITY` (paramount · name; also a sphere's centre). The contest's outcome is the `polity_war` hearing's verdict, never a verb.

**PL-0 — THE WALK.** Leaf `src/domain/polity/polity.js`: `polityOf`, `politiesOf`, classes, tiers, the cycle guard (`polity_circle`), the depth cap, PL12 inside the walk, the per-snapshot memo and its cost pin. No consumer. Pins: H→M→L reads paramount H for L; A→B→C→A yields no polity and one receipt; `foreignSeatOf` byte-identical with the flag absent. FIRST-VISIBLE: none (a read with no consumer). TIER: aspatial-safe; belief-blind (structure only). DEGRADED ARM: dark. EDITOR: no seal · no direction · counterparty `real-only` · no person cast · no news. Alignment: alignment-empty (structure, not soul). `causedBy`: the `polity_circle` receipt names the tick's relationship snapshot.

**PL-1 — THE NAME AND THE PAGE.** `spatialLedgers.polityNames` (§10) and the `NAME_POLITY` verb; the dossier line on every member ("Sworn to Ashford, under the crown of Merewick"); the paramount's dossier ("Merewick: seven sworn towns, two held"); Herald re-voicing of the landed fealty kinds (vassalization, rebellion) to name the polity; the borders lens's READ (the paramount per territory cell — the lens is the map program's). FIRST-VISIBLE: immediate — the dossier line the week the flag lights. TIER: aspatial-safe; the lens needs spatial canon; omniscient default: every observer sees the structure. DEGRADED ARM: the lines without a map. EDITOR: `NAME_POLITY` direction row · counterparty `real-only` · no person · cause row `table`. Alignment: alignment-empty (a name). `causedBy`: the naming event.

**PL-2 — THE HOLD.** `polityHoldOf` and its bands; the Why panel ON SCRUTINY ("the crown's hold is shaky: its strongest vassal outweighs it, and it did not come when Kell was besieged") — never pushed to the surface; `hegemonyFear`'s polity source; the rebellion-homonym cure keyed on `originContext.rebellionKind` (§10, shape 4). FIRST-VISIBLE: the hold's word on the paramount's dossier behind the polity toggle, immediate; its change at the week it moves. TIER: aspatial-safe; belief infoMode reads each observer's picture; omniscient default: one truth. DEGRADED ARM: dark. EDITOR: no seal (derived) · no direction · `real-only` · none · none. Alignment: reads none (the hold is power, not soul) — declared. `causedBy`: a hold-band receipt names the input that moved.

**PL-3 — THE LIEGE'S VOICE.** The sphere, the ceiling, `liegeStanceToward` in `foreignBookFor`, the class argument at nine call sites, the paramount's blend under `unbroken`, PL7's two definitions priced and heard. Hosts: `warSeatBooks.js` (492), `pactFormation.js` (565), the chooser's shared-signal car (car-0, owned by the first chain to land). FIRST-VISIBLE: the receipt on a member's decision ("Ashford stayed its hand: Merewick is at peace with Kell") the week it decides. TIER: aspatial-safe; host `foreignSeatEnabled` (OWNER-LIT); belief: the member's belief of its liege's stance. DEGRADED ARM: today's hierarchy-blind deciders. EDITOR: seal = a DIRECTION over the member's decision (the landed war/peace directions) · no new row · `real-only` · no person · cause row `table`. Alignment: the liege's stance is read through the liege ruler's lawfulness (a lawful liege's peace weighs heavier — the landed `rulerAlignment`). `causedBy`: the decision receipt names the liege's stance read.

**PL-4 — DUTIES DOWN.** The relief decision, the fealty record (shape 3), the chain-aware duty under `staunch`+. Hosts: the polity stage; `warCapacityReads.js` (143) one read; `relationshipState.js` (360) the normalizer; `relationshipEvolution.js` (438) the append. FIRST-VISIBLE: "Merewick did not come when Kell was besieged" on Kell's dossier the week the siege resolves. TIER: war arm `warLayerEnabled`; the record aspatial; belief: the liege's belief of the siege. DEGRADED ARM: the record without the decided relief (unsworn relief as today). EDITOR: seal = a PIN on `relief_answer`'s two words · direction: none · counterparty `real-only` · no person · cause row. Alignment: a merciful liege (the landed `moralityBand`) leans `sent`; declared. `causedBy`: every fealty row names the siege episode.

**PL-5 — DUTIES UP.** The summons cascade on WC-5 (the levy's silence measured first), scutage, half service, charters (the lens's `charter` occasion through a leaf car out of `peaceTerms.js` 799), passage through EC-6's executor. FIRST-VISIBLE: the summons hearing the week the crown goes to war. TIER: aspatial-safe; scutage `treasuryEnabled`. DEGRADED ARM: the landed one-hop levy. EDITOR: seal = PIN on `call_in_answer` (WC's) · direction: none new · `real-only` · none · cause row. Alignment: a lawful member answers more fully — declared. `causedBy`: each answer names the summons.

**PL-6 — THE BREAK, DEFINED AND FOUGHT.** PL7's definitions priced and heard; the homonym cure's reader (`activeRebellionAgainstVassal` reads `originContext.rebellionKind === 'vassal'`); the casus `fealty_broken` with its mirror `fealty_restored` (the reasons taxonomy's bijection); the liege's war of submission; `fealty_break`. Hosts: the polity stage (the detector), `relationshipRuleHelpers.js` (486), `warReasons.js` (515). FIRST-VISIBLE: the break's hearing card the week it resolves. TIER: the war arm `warLayerEnabled`; act (b) DARK where coalitions are dark (`coalitionLedgerEnabled`, false in every preset); the break aspatial. DEGRADED ARM: the landed relabel. EDITOR: seal = PIN on `fealty_break` · direction: `RELEASE_VASSAL` · `real-only` · none · cause row. Alignment: breaking an oath reads against the breaker's lawfulness (the world's judgment on the observer's axis). `causedBy`: the casus names the defiance row.

**PL-7 — THE CROWN'S PEACE.** The common-liege precedence in the one finder; `polity_arbitration`. Hosts: `peaceTermsGraph.js` (78), `mediationPressure.js` (154). FIRST-VISIBLE: "Merewick has bid Ashford and Kell lay down their quarrel" the week of the order. TIER: GR-6's host `mediationGeneralizedEnabled` (dramatic, full). DEGRADED ARM: today's cross-pressure broker. EDITOR: PIN on `polity_arbitration` · none · `real-only` · none · cause row. Alignment: a lawful liege orders more readily. `causedBy`: the order names the feud's war.

**PL-8 — THE CROWN PASSES.** The fealty question (§5.6) and the fallen lord (§5.7). Host: the polity stage. FIRST-VISIBLE: the fealty hearing the week after the seat changes. TIER: aspatial-safe; producer (2) `npcLadderEnabled`. DEGRADED ARM: dark (today's silence). EDITOR: PIN on both kinds · `SWEAR_FEALTY` / `RELEASE_VASSAL` · `real-only` · the new ruler read at the chokepoint (`NPC_UNAVAILABLE_STATUSES`) · cause row. Alignment: a lawful vassal renews more readily. `causedBy`: each answer names the `previousGovernments` / `seatTransitions` row.

**PL-9 — THE POLITY WAR.** Claims, allegiance, `polityContests`, `swornLinkSuspended` and its guarded readers (the walker), `applyPolityVerdict`, partition, the christening offer. Hosts: the polity stage; the guarded readers (§5.3; `generosityKernel.js` 800 through a leaf-first car). FIRST-VISIBLE: the claim's hearing and "the crown of Merewick is contested by Brenmoor" on the dossier, the week of the claim. TIER: claim and sides aspatial and preset-blind; the fighting `warLayerEnabled`. DEGRADED ARM: the claim and sides without battles (resolved on the hearings). EDITOR: PIN on `polity_war` (verdict any week) · `OPEN_CLAIM` · `real-only` · none · cause row. Alignment: allegiance reads closeness (faith axes inside it) and the member's lawfulness toward the crown. `causedBy`: every relabel names the seal. ⛔ The ending arm waits on STOP-1.

**PL-10 — THE MEASURE (car 0 of C9).** Envelopes over a seed family: polities per realm, depth, the hold mix, claims and contests per century, partitions per contest, breaks per century, feuds arbitrated, relief kept/failed, rite trades and patron flips along chains per century; the experience read that closes the chain (requirement 19). FIRST-VISIBLE: none — a measurement, by design (it lands no behaviour). TIER: all presets. EDITOR: none. Alignment: none. `causedBy`: n/a.

**PL-11 — CONVERSION (§14).** FIRST-VISIBLE: a PLANTING LINE at the cause (the fold §4 idiom) — "Merewick's rite of the long fast was laid on Ashford this year" (rites), "Merewick's priests are honoured at Ashford's court" (the liege's endorsement) — the year's line on the member's dossier behind the faith toggle; the slow verdict (a patron flip, a rite turned) names the planting as its cause. TIER: rites `traditionsEnabled` (four presets incl. the default); faith `faithSpreadEnabled` (dramatic, full only — the default gets the rite arm only, an owner lighting act recorded as a slot); spatial dilution with an aspatial arm (=1). DEGRADED ARM: today's conquest-only rite trade and spread-only faith. EDITOR: PIN on the rite draw (traditions are a registered drawing family) · no direction · `real-only` · no person · cause row. Alignment: faith conversion moves the CONSTITUENTS through the one faith writer family only (requirement 13's write side). `causedBy`: every conversion receipt names the sworn link and the year's draw.

**PL-12 — CONTROL (§15).** FIRST-VISIBLE: the recognition hearing the week after a member's seat changes; "Merewick withheld its blessing from Ashford's new council" on Ashford's dossier. TIER: per instrument (§15's table). DEGRADED ARM: each instrument's landed arm or dark. EDITOR: PINs on `polity_recognition` and `polity_appointment` · no new direction (appointment rides the landed `government_change`) · `real-only` · the appointee read at the chokepoint · cause row. Alignment: recognition and appointment read the liege ruler's lawfulness and the member's (a lawful court withholds from a usurper). `causedBy`: every legitimacy delta names the recognition event.

---

## §10 THE LIFECYCLE OF EVERY PERSISTED SHAPE (requirement 22a) — FOUR shapes

[CURED 2026-10-17 (fp-final) — SX-26 · SX-24 · SPL-M10: all four declared here, in §12 and in the fold's OD-FC-45 (the chair's).]

| Path | 1 · the christening `spatialLedgers.polityNames` `{ polity: { [paramountId]: { name, sinceTick, eventId } }, sphere: { [centerId]: … } }` | 2 · `spatialLedgers.polityContests` (§5.4) | 3 · `relationshipState.fealtyRecord` (§4.6) | 4 · the stressor's `originContext.rebellionKind: 'vassal'` |
|---|---|---|---|---|
| create | the DM's `NAME_POLITY` only (the engine never writes it) | the polity stage at `pressed` | `applyRelationshipPatch` from a polity outcome's `fealtyRow` | the vassal rule stamps it on its rebellion stressor (`relationshipRulesCore.js`, a leaf call) |
| read | PL-1's display; `hegemonyRead`'s injected `canonLabelFor` | the walk, `swornLinkSuspended`, the dossier | the hold's `P`, the fealty question, allegiance, PL-4's line | `activeRebellionAgainstVassal` |
| persist | worldState, drop-when-empty; a spatialUsage EXEMPT row | worldState, drop-when-empty; EXEMPT row | relationship state, drop-when-empty, cap 24 | the stressor record (normalize keeps `originContext`) — PLAUSIBLE until PL-2 pins the round-trip through the stressor writer |
| regenerate | campaign state, not generation output: survives; a name whose settlement is removed moves to the chronicle and leaves the ledger, receipted | a regeneration that removes a side's settlement lapses the contest, receipted | survives with the edge; dropped with it | survives with the stressor |
| undo | the pulse snapshot ring; the naming op's own inverse | the snapshot ring; undoing the seal restores the pre-verdict world (the docket idiom) | the snapshot ring | the snapshot ring |
| import | carried; an unknown id dropped with a receipt | carried; unknown ids dropped with a receipt | normalized; malformed rows never become facts | carried |
| migrate | absent-when-dark; none | none | none | none |
| dark-after-lit | kept, unread | kept, unread; no suspension, no guards; ⚠ a member war opened under suspension finds its edge reading `vassal` again — the same question as STOP-1's ending arm, ruled with it | kept, unread; relief reverts to automatic | kept; the cure's reader dark → the landed homonym returns |
| death | the paramount razed: the name moves to the chronicle | a side's leader destroyed: its next member by strength leads, else `lapsed` | dropped with the edge | resolved with the stressor |
| veil | the DM's; shown wherever the polity shows | public news; each member's side as known as its choice (belief) | each court knows its own record; others by rumor | machine evidence, never shown |
| horizon (req. 23) | one per paramount; unbounded only by the DM's acts | one per contested lord | 24 rows ≈ at a measured event rate of a few rows a year, years of memory (UNMEASURED; PL-10) | the stressor's life |

[REFINED 2026-10-17 (fp-final) — the christening lives in `spatialLedgers` (not a new campaign-record root): the snapshot ring gives undo, import carries it, MN's DM-authored record set the precedent, and one DM writer keeps the engine from ever moving it.]

---

## §11 THE SCENARIO MATRIX (each row a pin family at its wave; a measurable assertion or DARK)

[CURED 2026-10-17 (fp-final) — SPL-m5: every row asserts; heir-dependent rows are marked DARK.]

| # | World | Assertion |
|---|---|---|
| P1 | H ← M ← L | `polityOf(L).rootId === 'H'`, tier 2; H's dossier lists M and L |
| P2 | A ← B ← C ← A | `politiesOf` excludes all three; exactly one `polity_circle` receipt |
| P3 | L sworn to M and N | `polityOf(L).liegeId` = the greater `weight01`; codepoint on a tie; `foreignSeatOf(L)` byte-identical lit and dark |
| P4 | H at peace with K; M (H's vassal) weighs war on K; `staunch` | M's foreign share ≤ 0.45 (keep ≥ 0.55); `foreignContinueBias01` below the temperament-only value |
| P5 | H at war with K; M signs peace with K | one `fealty_defied` row the same tick AND one `fealty_break` docket row; dismissing it leaves the row |
| P6 | M joins K's coalition against H | as P5 where `coalitionLedgerEnabled`; DARK elsewhere |
| P7 | M signs a trade pact with K, H hostile to K, `shaky` | no book read for `trade_abroad` (sphere —); the pact's receipt names the liege's quarrel |
| P8 | H embargoes K; M trades with K; `unbroken` | EC-6's stance for M→K is one rung tighter than the unsworn control |
| P9 | K besieges M; H answers `kept` | `relief_kept` then `protection_failed` on H–M; M's resentment rises by the patch; relief in the verdict excludes H |
| P10 | K besieges L (H ← M ← L); M `kept`; `staunch` | H's relief fork runs for L; `protection_failed` on M–L and, if H keeps, on H–M |
| P11 | H goes to war; summons M (`staunch`) | one `call_in_answer` for M; M's own summons to L follows |
| P12 | M answers with scutage | coin moves to H's treasury; no contingent; M's burden term unchanged |
| P13 | M and N feud | H tried first by the finder; under `staunch`+ a `polity_arbitration` row |
| P14 | H's governing power changes by coup | one `fealty_question` per direct vassal at the next week |
| P15 | a DM `CHANGE_RULING_POWER` at H | as P14 (producer 1, tick-less row, exact-once) |
| P16 | a DM KILL of H's ruler | no question (STOP-2), receipted as the owed producer |
| P17 | H's heir weak; M claims by blood | DARK until heirs light |
| P18 | three-member polity; M presses a claim | `polityContests[H]` written; `swornLinkSuspended(M–H) === true`; every guarded reader sees `rival` |
| P19 | two-member polity; M "claims" | routed to the break road; no contest record |
| P20 | contest; verdict `claim_prevails` | one new `vassal` edge H→M by `applyPolityVerdict`; the cascade runs last; the name stays on H; the card offers the re-key |
| P21 | contest; verdict `partition` | two polities; M's link to H relabeled `rival` by the same writer |
| P22 | contest; no fighting for a season | `lapsed`; the record drops; suspension lifts |
| P23 | K conquers H (paramount) | the walk stops at H (class `occupied`); one `polity_fallen` per direct vassal |
| P24 | a vassal sold (WR-10) | the walk reads the seat; the sale writes the edge stamp (a WR-10 car) |
| P25 | a menace besieges M; H answers `kept` | as P9 through MN's besieger union |
| P26 | M's commons rise (a domestic rebellion) | `activeRebellionAgainstVassal(M)` false (the cure, lit) |
| P27 | a sworn vassal under `polityConversionEnabled`, rites lit | at most one rite trade per link per year (year-keyed draw); `applyRestoration` does not restore it while the link stands |
| P28 | a member's seat changes; H withholds recognition | one negative `publicLegitimacy` delta on M through `applyLegitimacyDeltasToUpdates`; no coup term moved |
| P29 | aspatial world | every row above except the war arms, the lens and the distance term holds |
| P30 | a one-year advance with a contest standing | 52 weekly `polity_war` defaults resolve without a pause; one receipt each |
| P31 | all flags dark | byte-identical to today on every seed |

---

## §12 THE RULINGS (by delegation under the 2026-10-16 and 2026-10-17 words, vetoable; the owner's own rows marked; every DRAFT constant UNMEASURED and on the FP-46 roster)

| Row | The question | Ruling |
|---|---|---|
| OD-PL-1 | The token | `polity` in code; "kingdom", "crown", "capital", "civil war" in prose only (§2); classes `paramount · vassal · occupied`; the hold `polityHold` with `frayed · shaky · staunch · unbroken` [CURED 2026-10-17 (fp-final) — SX-16 · SPL-m1] |
| OD-PL-2 | A persisted polity identity? | NO — a pattern (§F.3b; ODQ §12) |
| OD-PL-3 | The christening | `spatialLedgers.polityNames` (shape 1), the DM's `NAME_POLITY` its only writer; the engine never moves it; the re-key is OFFERED at `claim_prevails`; at a partition it stays with the side holding the old paramount [CURED — SPL-M10] |
| OD-PL-4 | The precedence mechanism | the owner's scalar UNTOUCHED, the sphere by class and hold, ONE ceiling; no vetoes; κ struck [CURED — SPL-B1 · SX-05] |
| OD-PL-5 | Does PL light `foreignSeatEnabled`? | NO — THE OWNER'S ROW (Q-S3); PL-3 waits on it |
| OD-PL-6 | The two definitional acts | priced on the spot AND heard (`fealty_break`); the remedy for a separate peace is the war of submission [CURED — SPL-M15 · SX-23] |
| OD-PL-7 | Multiplicity | inside `polityOf` only; A1.2.15 amended by name [CURED — SPL-M4] |
| OD-PL-8 | The contest record | `spatialLedgers.polityContests` (shape 2), one writer; reconciled with W-SEAT's `civilContests` (§0) [CURED — SX-26] |
| OD-PL-9 | The autonomy charter | YES — one GRAMMAR term row `narrowed_sphere` (the chair routes it to GRAMMAR's catalog; `autonom…` avoided, R4 H7) |
| OD-PL-10 | Partition: who keeps the name | the side holding the old paramount |
| OD-PL-11 | The hold's words | `frayed · shaky · staunch · unbroken` (`sound` landed; `staunch` free) |
| OD-PL-12 | The ceiling | `POLITY_LIEGE_CEILING = 0.45` (keep ≥ 0.55), DRAFT UNMEASURED |
| OD-PL-13 | Genesis | unchanged; the population recorded (§0); kingdoms of depth come from the DM's verbs today and from the map program's political regions later (the seam) [CURED — SPL-M8] |
| OD-PL-14 | The order | chain **C9 · THE CROWN**: PL-10 (car 0) → PL-0/1/2 + PL-4 as the first felt chain; PL-3 after the owner's lighting and the chooser's car; PL-5 after C2; PL-6/7/8/9/11/12 chosen at each read (FP-40) |
| OD-PL-15 | The stance blend in the foreign book | DRAFT `0.6 stance / 0.4 temperament`, UNMEASURED |
| OD-PL-16 | The paramount's blend under `unbroken` | DRAFT `0.7 liege / 0.3 paramount`, UNMEASURED |
| OD-PL-17 | The hold's formula and floors | §3.5, every weight UNMEASURED; floors reuse `SEAT_TUNING.BANDS` |
| OD-PL-18 | The fealty record | shape 3 in the `allianceCalls` idiom, appended by the one relationship writer, cap 24 [CURED — SPL-B5 · SX-01; REFINED] |
| OD-PL-19 | The homonym cure's key | shape 4, `originContext.rebellionKind: 'vassal'`; a declared same-seed shift in six presets at lighting [CURED — SPL-M12 · SX-13] |
| OD-PL-20 | The polity stage's host | a leaf called from `dispositionChannels.js :: advanceTreatiesWithDisposition` [REFINED] |
| OD-PL-21 | The sworn-reader set | GUARDED ∪ EXEMPT pinned by a walker [REFINED] |
| OD-PL-22 | The ending of member wars under a contest | ⛔ STOP-1 — THE CHAIR'S to rule ((A) or (B), §5.5) |
| OD-PL-23 | The fealty question's DM-kill producer | ⛔ STOP-2 — recorded as owed, GR's six-site succession slot |
| OD-PL-24 | Sworn-link rite imposition | `IMPOSE_CHANCE × weight01` on sworn links, conquest flat 0.3, year-keyed, one trade per liege per link; restoration widened with it (§14.2) |
| OD-PL-25 | The crown's faith | through LEGITIMACY (`neighbourEndorsement` weighted by `weight01`), never share; spread-gated; reaching the default preset is an OWNER LIGHTING ACT (a slot) |
| OD-PL-26 | The fault line | `independencePressure += κ_f·(1 − closeness01)`, DRAFT `κ_f = 0.12`, UNMEASURED |
| OD-PL-27 | The conversion rate | a design rule (year-keyed draws, `INTERVAL_WEEKS` constants) AND an FP-46 row for the rate (R4 Q3) |
| OD-PL-28 | Recognition | a one-off act at a member's seat change through `applyLegitimacyDeltasToUpdates`; DRAFT `+6 / −8` score points, UNMEASURED; standing withdrawal stays SEAT-8's |
| OD-PL-29 | Outside patrons across a strained link | `install_friendlier_regime` admits a non-hostile edge when the member's link to its liege has resentment ≥ DRAFT 0.5 |
| OD-PL-30 | The kinship motive | carries shared faith/culture as `closeness01` between backer and faction's patron court (the zeroed slot filled) |
| OD-PL-31 | The crown-backed faction tilt | one bounded term (DRAFT ±0.08), a leaf-first car out of `factionCompetition.js` (775) |
| OD-PL-32 | Wear | typed decaying incidents (the memory weave's idiom); lighting the weave is a declared same-seed shift (lit nowhere) |
| OD-PL-33 | Garrisons, court bonds, sworn-link spies, a resident envoy | NOT BUILT in PL: garrisons are NEW CAPABILITY (WC's inbox, a slot); court bonds a GRAMMAR unit (the parked `hostage_exchange` is a persisted-vocabulary change — owner-visible); spies ES's inbox; the resident envoy the errand spine's inbox |
| OD-PL-34 | The persisted shapes | FOUR (§10) — declared by delegation; the fold's OD-FC-45 amended (the chair's) |

---

## §13 WHAT A DM READS (felt sentences under the Evidence Law — deeds only, never forecasts; the surface shows the outcome, the WHY is on scrutiny)

- "Ashford is sworn to Merewick; Merewick answers to no one." (surface: the dossier line)
- "Kell kept its levy home: the Ashen Host is camped below its walls." (surface)
- "Merewick did not come when Kell was besieged." (surface; the scrutiny walk names the siege and the answer)
- "Ashford signed a peace with Kell while Merewick still fought it; Ashford's oath to Merewick is broken." (surface)
- "Brenmoor has pressed its claim to the crown of Merewick. Ashford and Tolle stand with Brenmoor; Kell stands with the crown." (surface)
- "The crown passes to Brenmoor; Merewick swears to it." (surface)
- "Merewick has bid Ashford and Kell lay down their quarrel; Kell refused." (surface)
- "Merewick withheld its blessing from Ashford's new council." (surface; the legitimacy it cost is scrutiny)
- "Merewick's rite of the long fast was laid on Ashford this year." (surface behind the faith toggle — a planting line)
- "Ashford's court now honours Merewick's god." (surface — the slow verdict, naming the planting on scrutiny)
- On scrutiny only: "The crown's hold is shaky: Brenmoor outweighs Merewick in the field, and Merewick did not come when Kell was besieged." (bands and weights never surface)

Every sentence names who, upon whom, and what happened; none says what might happen; no numerals.

---

## §14 CONVERSION — RITES, FAITH AND THE FORM OF GOVERNMENT THROUGH THE CHAIN (wave PL-11)

**The owner's question (2026-10-17), verbatim:** "how does the conversion of culture and relligion happen in kindgom through chains of vassalage"

**The answer.** Culture in this engine has no stored value to convert: it is DERIVED from faith, alignment, economy, the form of government and shared rites (`cultureDistance.js`: "NEVER a new authored coordinate"). So a kingdom converts its towns when their RITES, their FAITH and their GOVERNMENT drift toward the crown's — slowly, a link at a time, a year at a time — and the town's closeness to its liege (inside the owner's scalar) rises as they do. [REFINED 2026-10-17 (fp-final) — R4-2: no culture writer is minted.]

**14.1 What already happens (R4, CONFIRMED).** Rites: one trade per CONQUEST-made vassalage on a year-keyed draw, restored when the vassalage ends. Faith: the vassal edge carries faith both ways and the overlord's `political_authority` channel carries the liege's creed down, distance-weighted — but only where `faithSpreadEnabled` is lit (dramatic, full). Closeness already reads faith axes, rites and government.

**14.2 Rites down sworn links (the one rite writer).** `traditions/relations.js :: applyImposition`'s trigger widens from `vassalOverlordOf` (the `vassalized` rung) to the LIEGE named by the walk's one step, passed in by `traditionsKernel.js` (493; `advanceRelations` receives only worldState, so the kernel passes the liege map in — one call into a leaf). The chance on a sworn link is `IMPOSE_CHANCE × weight01` (conquest keeps the flat 0.3) [REFINED 2026-10-17 (fp-final) — R4-1: scaled by the LINK, not the crown's hold], diluted by `mappedDistanceWeight` (aspatial 1), drawn on the landed YEAR-keyed fork; one trade per liege per link (the landed `suppressedBy` idempotency). ⚠ `applyRestoration` widens WITH the trigger (R4 H1: it reads `vassalOverlordOf`, so a sworn-link imposition would be restored the next tick). Tier-by-tier lag is emergent: a mid-lord whose top rite is an imposed copy passes it down a year or more later (PLAUSIBLE; `buildImposedCopy` caps scale at the local band — PL-10 measures it). Kinds reuse the landed `imposition` (`mutationLog`) and `rite_imposed` (incident); never `crown_conversion`.

**14.3 The crown's faith works on courts first.** [REFINED 2026-10-17 (fp-final) — R4-3.] The immediate liege counts inside `religionLegitimacy.js :: neighbourEndorsement` weighted by its `weight01` (the landed word `endorsement`; no new weight in the sum-one target; host 227), so the liege's creed raises its own LEGITIMACY in the member (the court's acceptance) and never touches the SHARE step (the people move only by the contest's own forces). The liege's patron is sampled once per year (`INTERVAL_WEEKS.year`), so the court's drift is slow by construction. Spread-gated by the landed code (`const neighbourIds = spread ? neighbourIdsOf(snapshot, cid) : []`): in the default preset the crown's faith does nothing — reaching it is an OWNER LIGHTING ACT recorded as a slot (OD-PL-25). The patron flip, when it comes, is the landed `religious_contest_conversion`; a flip forced against the people is the landed `religious_conversion_fracture`. Deity doctrine: the followers act, the god does not. ⚠ Closeness compares deity AXES, not identity (R4 H4): no felt sentence may say "they share the crown's god" from closeness — the sentence reads the patron itself.

**14.4 Government converges** through §15.4 (appointment) and §15.5 (the crown-backed faction), which `cultureDistance`'s government term then reads.

**14.5 Missionary access by charter** — a `grant`-executor term row read by `faithCarriersOut` as a carrier: NOT built in PL-11 (the catalog row needs a leaf car out of `peaceTerms.js` 799); recorded as a slot in GRAMMAR's catalog.

**14.6 The fault line.** [REFINED 2026-10-17 (fp-final) — R4-5.] The break's `independencePressure` reads `(1 − closeness01)` ONCE (`relationshipRulesCore.js :: vassalRules`, 744 → one leaf call; DRAFT coefficient 0.12, UNMEASURED): a town of a different faith, rite or government strains its oath more — "Kell keeps the old gods; its oath to Merewick frays" becomes backable. The polity war's `allegiance_choice` reads closeness to each side (§5.3).

**14.7 Champions as accelerant** — a saint's or heretic's deed enters the faith family through landed terms that read events (`chronicleMomentum`, `clergyDrag`); the design is `DESIGN_FP_ARCH_CH.md`'s (being compiled) — a pointer, nothing built here.

**14.8 The clocks (requirement 9).** Rites: yearly draw, one trade per link (years). The liege's endorsement: sampled yearly; legitimacy follows at the landed `LAG 0.12`/tick (the fast echo); the patron flip after the landed share lead (the slow verdict, months to years given the yearly sample). The fault line: weekly with the vassal rules (it reads a slow quantity). FIRST-VISIBLE: the planting line the year of the draw.

**14.9 Counterforces.** Imposition raises resentment (the landed `rite_imposed` grievance; weave-gated, lit nowhere — lit, it lowers grip and so deference); the fault line raises the break; a break restores the suppressed rite (the landed restoration); distance dilutes.

**14.10 Same-seed shifts.** Behind `polityConversionEnabled` everything is dark-identical; lit, the rite arm shifts the four presets where `traditionsEnabled` is lit wherever a sworn vassal exists (64–86% of realms), and the faith arm shifts dramatic and full — declared, signed at PL-11's lighting.

---

## §15 CONTROL AND COUNTERFORCES — HOW THE CROWN KEEPS ITS VASSALS IN LINE (wave PL-12)

**The owner's words (2026-10-17), verbatim:** "as well as government structure, voice in the court, etc... Essentially, the ways in which the crown and higher order vassals try to keep their lower order vassals in line nad limit coups and rebellions. But of course there are counterforces as well. And these conversions that happen are slow."

**The answer.** Every instrument runs through a writer that already exists; each acts fast and WEARS (a typed decaying incident on the sworn edge — one decay law); great lords use the same instruments down their own chains (every instrument is pairwise); under an `unbroken` hold the crown reaches past them only through PL5. The hold (§3.5) takes their results: recognition lands in `L`, protection in `P`, leagues in `G`, and resentment from every instrument's wear inside `D̄`.

| Instrument | The existing writer / seam | Clock · wear | Counterforce (landed read) | Gate · presets |
|---|---|---|---|---|
| **15.1 Recognition** | a one-off act at a member's seat change: `polity_recognition` (`recognized · withheld`) → `generosityUpdates.js :: applyLegitimacyDeltasToUpdates` on the member's `publicLegitimacy.score`, which already feeds the coup's `govMultiplier` and the ≥75 floor of the rebellion and insurgency gates — zero new terms [REFINED — R4-4] | once per seat change; the delta decays with legitimacy's own law | a usurper withheld from rallies the commons (`stressorGates.js :: rebellionGate`); standing withdrawal is SEAT-8's typed stake | `polityControlEnabled`; all six presets |
| **15.2 Backing in a coup** | `convergence.js :: scorePreserveOrder` (a liege backs its member's incumbent; LIVE in war presets). ⛔ The coup budget is FULL: "The five bounds sum to exactly 0.815 against a DECLARED_BUDGET of 0.82" — no new coup term. A liege can never back a challenger in its own member (landed). The zeroed `kinship` motive carries shared faith/culture (R4-10, OD-PL-30) | the intervention's own life | OUTSIDE PATRONS court the restive: `install_friendlier_regime` admits a non-hostile edge when the member's link is strained (R4-11, OD-PL-29; `convergence.js` 764 → a leaf call) | `interventionEnabled && warLayerEnabled` (dramatic, full) |
| **15.3 A voice at the court** | down: the ONE `liegeStanceToward` read in the member's book (§3.3); up: the weighted mean of the great vassals' stances toward a counterparty as ONE bounded signal (DRAFT ±0.1) in the crown's declaration, through the chooser's shared-signal car — no fifth book [REFINED — R4-7] | per decision | the great vassals' voice IS the counterforce at the crown's council | `polityPrecedenceEnabled` (owner-lit seat) |
| **15.4 Appointment (the hard end)** | the landed `government_change` proposal with cause `appointment` (seed 45, its own stability line), always the `polity_appointment` hearing; `puppet_seat` executes nothing [REFINED — R4-8] | instant on the verdict; wears as the appointee's legitimacy seeds low | local legitimacy against appointees (seed 45, `oldPull 0.10`); the deposed house keeps its place and its grudge (`transferRulingPower`) | `polityControlEnabled` |
| **15.5 Shaping government** | one bounded tilt (OD-PL-31) in the lit faction competition toward the member faction whose government preference mirrors the liege's ruling power; a leaf-first car out of `factionCompetition.js` (775) | seasonal | rival factions' own power bases; the internal party of independence (`settlementPolitics.js` `break_vassalage`, dark) | `factionCompetitionEnabled` (five presets) |
| **15.6 Bonds · spies · a resident envoy · garrisons** | NOT BUILT — slots (OD-PL-33): court bonds (`court_match`, `fosterage`, `hostage_exchange`) a GRAMMAR unit; spies along sworn links ES's inbox; a resident envoy the errand spine's inbox; VASSAL GARRISONS new capability, WC's inbox | — | — | — |
| **15.7 Divide and rule** | charters to a rival member (§3 compromises), the crown's arbitration (§6), WR-10's transfer of a lord's vassals (dark) | per act | a member slighted by a rival's charter feels it in its own grip (the patch) | per seam |
| **15.8 Rewards and punishments** | rewards: charters (GRAMMAR's lens); punishments: the landed tribute and `vassal_trade_coercion`, withheld recognition, the war of submission | per act; wear as typed incidents | burden → resentment (landed); the overlord-weakness memory (landed streak) | per seam |

**15.9 Wear.** [REFINED 2026-10-17 (fp-final) — R4-12.] Every instrument's act mints a typed decaying incident on the sworn edge through the memory weave's one writer (`mintMemoryWeaveIncident`, the `rite_imposed` idiom) — never a turning point. Incident types avoid `overreach` and `autonom…` (`ESCALATION_HINT` would class them, R4 H7): `recognition_withheld · appointment_imposed · faction_backed · charter_granted`. The weave is lit nowhere: lighting it is a declared same-seed shift on the six presets where the relationship rules run.

**15.10 The counterforces, each with its landed read.** Burden → resentment (tribute and protection-burden conditions) · the overlord-weakness streak · the break road and its fault line (§14.6) · local legitimacy against appointees · the commons (the domestic rebellion gate) · outside patrons (15.2) · distance (`mappedDistanceWeight`, spatial) · leagues of vassals — the coalition plane's own word, dark while `coalitionLedgerEnabled` is dark (enters the hold as `G`) · the internal party of independence (dark). The overreach cost is not a separate law: it is the wear above, feeding resentment.

**15.11 Pace.** Instruments act within the week of their act and wear over seasons; conversion (§14) runs over years; the hold is their balance and moves only as they move.

---

## §16 THE CURE RECORD (every SPL id and every SX id that names PL)

| Id | Disposition |
|---|---|
| SPL-B1 | CURED §1 PL4, §3.2 (κ struck; scalar untouched; sphere; ceiling 0.45) |
| SPL-B2 | CURED §3.3–§3.4 (`liegeStanceToward` in `foreignBookFor`; ten sites classed; the declaration via the chooser's car) |
| SPL-B3 | CURED §1 PL5 (no fifth book; the paramount's blend inside the one foreign book) |
| SPL-B4 | ⛔ STOP-1 for the ending arm (§5.5); decision side CURED §5.3 (`swornLinkSuspended`, fourteen guarded readers, the walker) |
| SPL-B5 | CURED §4.6, §10 shape 3 (the fealty record, appended by the one relationship writer) |
| SPL-M1 | CURED §5.5 (`applyPolityVerdict`, authority the seal, the cascade ordered last) |
| SPL-M2 | CURED §5.6 (PL's own decider; two live producers; answers' writes; one hearing per pair); the DM-kill producer recorded owed (STOP-2) |
| SPL-M3 | CURED §1 PL2, §5.7 (the walk stops; `stand_by`) |
| SPL-M4 | CURED §0, §1 PL12 (inside `polityOf`; A1.2.15 amended by name) |
| SPL-M5 | CURED §1 PL16, §3.5 (per observer; belief; DRAFT formula) |
| SPL-M6 | CURED §3 compromises (each names its landed input; closeness moved by none) |
| SPL-M7 | CURED §1 PL2 (memo + cost pin) |
| SPL-M8 | CURED §0, §1 PL9, §5.2, §11 P19 (the population; a pair is a break) |
| SPL-M9 | CURED §9 (four verbs; EDITOR and Alignment on every wave) |
| SPL-M10 | CURED §1 PL3, §10 shape 1 (one DM writer; the re-key offered) |
| SPL-M11 | CURED §1 PL1, §3.6 (one pattern, two arms; the kingdom's fear source) |
| SPL-M12 | CURED §8, §10 shape 4 (both changes gated; `rebellionKind`) |
| SPL-M13 | CURED §4.5 (passage a charter term via EC-6's executor; "not hostile" struck) |
| SPL-M14 | CURED §3 compromises (GRAMMAR's lens, `charter` occasion, a leaf car) |
| SPL-M15 | CURED §1 PL7 (priced on the spot and heard; the detector; act (b) dark) |
| SPL-m1 | CURED §2, §7 (`polity_*`, `polityContests`, `fealty_break`) |
| SPL-m2 | CURED §7 (`lapsed`; one token per surface; `renew` registered) |
| SPL-m3 | CURED §3.2, §12 (UNMEASURED on every DRAFT cell) |
| SPL-m4 | CURED §0 (the patron exclusion attributed to the chair's reading) |
| SPL-m5 | CURED §11 (every row measurable or DARK) |
| SPL-m6 | CURED §2 (`polity` out of DM prose) |
| SPL-m7 | CURED §3.4, §5.3, §5.4 (the chooser's car named; PL-9's stage and writer named) |
| SPL-m8 | CURED by routing — `pact_refused`'s erasure is a GRAMMAR inbox row (the chair's, fold §3.1) |
| SX-01 | CURED §4.6 (= SPL-B5) |
| SX-02 | CURED §1 PL5 (= SPL-B3) |
| SX-04 | CURED §1 PL14, §5.2 (the claim's host is the polity stage) |
| SX-05 | CURED §1 PL4 (= SPL-B1) |
| SX-07 | CURED §4.3 (one relief decision with a refusal arm; no double count; the hearing-week window) |
| SX-08 | CURED §3.4 (the chooser's shared-signal car, owned by the first chain to land) |
| SX-12 | CURED §5.2, §8 (occasion (2) decoupled; preset scope in TIER lines) |
| SX-13 | CURED §8 (= SPL-M12) |
| SX-14 | CURED §5.6 (= SPL-M2) |
| SX-15 | CURED §9 header (PL a carrier across GRAMMAR · WAR · INTERIOR · TRADE · INFO) |
| SX-16 | CURED §2 token census (classes and hold words renamed; homonyms registered) |
| SX-17 | CURED §3 compromises, §3.3 (= SPL-M6/M14; EC-6's rung named) |
| SX-20 | ⛔ STOP-1 for the termination road (§5.5); tribute suspended by the predicate (§5.3); one hearing for the outcome; `lapsed` added |
| SX-21 | CURED §1 PL16, §3.5 (= SPL-M5) |
| SX-22 | CURED §1 PL2, §5.7 (= SPL-M3) |
| SX-23 | CURED §1 PL7 (= SPL-M15) |
| SX-24 | CURED §9 (`causedBy` per wave), §10 (engine-written states traced) |
| SX-26 | CURED §0, §10, §12 (four shapes; `civilContests` reconciled) |
| SX-27 | CURED §8 (`hearingWeekEnabled`); the counts are the chair's (fold) |
| SX-28 | CURED §9 (no behaviour-landing wave called instrumentation; OD-PL-9 routed to GRAMMAR) |
