# DESIGN_FP_ARCH_RN — THE RENOWN: one fame-and-regard model for every person, the party and every court

## Chair session a73343ed (Fable 5.1); compiled by lane L-RN (Opus 5.5), 2026-10-17.
## Compiled on the owner's word; DARK behind two virtual flags (`renownEnabled`, `renownLeansEnabled`) and their host flags; nothing scheduled.
## Bound by the FP constitution's requirements 1–24 (`DESIGN_FP_SPINE.md` §1; 15–24's text of record is `DESIGN_FP_COHERENCE_FOLD.md` §1) and by the fold.
## `[REFINED 2026-10-17 (fp-final) — …]` brackets may appear anywhere below; each is vetoable. The compile log, every STOP and the measurements are `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/L-RN.md`.

> **Status: COMPILED, DARK, NOT SCHEDULED.** Four ⛔ STOPS stand (§18): RN-S1 (the regard writer's host — the chair rules between the measured alternative and the fallback), RN-S2/S3/S4 (three role rows whose seams are unbuilt, each recorded with its slot). Nothing here dispatches a build: the gate list (push · merge · deploy · migration · dispatch) is the owner's. RN is a READ MODEL plus one deed ledger: it owns no engagement kind (§11).

**The owner's words (2026-10-17), verbatim.**
- "In terms of the renown system that we’ve thought of just though I would also like it to be appropriately applied to all of the other NPC‘s what do you think?"
- "But also for the court NPC as well"
- "Regarding reputation and sanctions, some often events by the party are simply just inherently good without any bias. Such as lifting a plague. Or getting rid of bandits. In such cases to whoever they have helped, that actors rivals may be upset that the act was helped, but it’s difficult difficulty for them to probably condemn the act at the party has made without reason. I think that this should be complicated and foiled by both alignment and personality of NPC’s and courts. Take the orphanage example again, if arrival settlement or court arrival is unambiguously of the evil alignment, it makes us that they still hold a grudge against the party. But if they were good or neutral and they were still rivals yeah they said that their enemy was helped, but the act of itself is fine. And so there should be some sort of inherent value for each action that the party may participate or champions may participate in." (the chair reads "arrival settlement or court arrival" as "a rival settlement or a rival court", and "it makes us that" as "it makes sense that")
- From the party message: "Every settlement NPC diety religion courts at large as their own individual reputation awareness with the party and those all contribute and conflict with each each other for the net effect." · "The DM can manually change all of these reputations for each actor at will or even direct their actions to the party at whim."
- From the champions messages: "They also have degrees of failure, configuraable in custom content, that can end them up failing, losing repuation (which would also affect their abilities to a degree)" · "I want them to also have relations with kingdoms, settlements, and other NPCs, champions, dieties that impact their behavior when nearby anything related to them foiled by their personalities, and such relationships are both emergent and dynamic over a set amount of time."
- The doctrines of the day: "Think of this tool as the DMs tool not the party … We only supply setting and consequence"; "The DM wants emergent experience that only when scrutinized upon shows coherence … we’re not trying to show the full machinery"; "Hearings only happen on the week."

**The answer in one paragraph.** Everyone the world remembers — an ordinary townsman, a high priest, a ruler, a champion, a villain, the party — is known and judged by ONE model. Four facts about a person are kept apart and never merged: how widely they are KNOWN (fame), how each other actor FEELS about them (regard), whether their WORD is trusted (credibility), and, for a ruler only, their RIGHT TO RULE (legitimacy, which renown never writes). Fame comes from office ("the High Priest of Kell") and from deeds; every deed is written down once, as lived history, with how far its tale could travel, and fame fades over years as the tale is forgotten — a town knows a person only as far as word of them has reached it. Regard is sparse: an actor feels something about someone only when the DM says so (the allies-and-enemies list, a champion's authored ties) or when it has heard of something they did; it reads every deed through two lenses — what the act is, judged by its own alignment, and whom it helped or hurt, judged by its friends and rivals — with its personality setting the mix, so a good rival grumbles that its enemy was helped and an evil one keeps the grudge. A court feels what its people of power feel, weighted by their power, plus what was done to the court itself; each of its acts comes from the officer whose office does that work, so on scrutiny the why is that officer's grudge. On the surface the DM reads words ("known across the river towns as a fair judge"; "Varn's lords curse the party for saving their rivals; their people do not"); bands, weights and reasons wait for an intentional look; and the DM can set any actor's regard at will.

---

## §0 WHAT THE CODE ALREADY IS (master `81f1cd963`; research `findings/R2.md` (substrate), `R1.md` §1–§2/§5, `R3.md` §1–§2; every load-bearing row re-measured by this lane, `cure/L-RN.md` §1)

**Nothing in the code is a general fame or regard of a person today.** Fame lives in two partial places, regard in none for persons, credibility in two dark hosts, legitimacy in one lit read (R2 Q4).

| `path :: symbol` | What it is (quoted) | What it gives RN | Gate · lit in | Host eff. lines /800 | Persisted / derived | Class |
|---|---|---|---|---|---|---|
| `worldPulse/bandedStock.js :: decayTowardNeutral` · `HALF_LIFE_BANDS` · `halfLifeFactor` · `bandCrossingReceipt` · `crossingOf` | "THE ONE DECAY SHAPE … ANTI-RATCHET"; `HALF_LIFE_WEEKS` "DERIVED from `INTERVAL_WEEKS`" (13 · 52 · 156 · 520 · 1040); "No BANDING primitive. A stock's band EDGES are a per-instance tuning row" | the ONE decay law for fame and regard; crossing receipts with a closed cause | none (pure) | 104 | pure | CONFIRMED |
| `worldPulse/factionPairLedger.js` (`factionPairStates`) | "`trust: 0..1` … `resentment: 0..1` … `incidents: [{ tick, type, sev, context? }]` ≤ 8, typed, decaying" — "BOTH signs" | the SHAPE of a sparse two-signed regard link with typed reasons | `memoryWeaveEnabled` | 138 | persisted `worldState.factionPairStates` | CONFIRMED |
| `worldPulse/npcLedger.js :: graduateNpc` (`wnpc_`) | "mint the durable identity once … One-way and idempotent"; "DORMANT ⇒ an immediate no-op returning the SAME worldState reference and a null id"; `hostSettlementId` "non-null ⇒ enters `placed` under that host" | the ONLY legal person key for a regard link; a court member graduates without leaving home | `npcConsequencesEnabled` — lit in NO preset | 429 | `spatialLedgers.npcLedger` | CONFIRMED |
| `worldPulse/npcLedgerFacets.js :: NOTORIETY_BANDS` | "How widely and how badly a person is spoken of" `['unknown','whispered','known','notorious','infamous']`; written by `npcVerdictTable.js`, read by `npcCirculation*`, `reputationRaceConsumer.js`, `heraldWanderers.js` | the landed fame×infamy COMPOUND RN must fold (law RN4) | `npcConsequencesEnabled` | 146 | persisted on the roamer record | CONFIRMED |
| `worldPulse/npcCirculationBelief.js :: believedReputation` | "Beliefs are derived ON DEMAND and NEVER stored per pair"; delay `hopDelayTicks` from ONE origin; "OMNISCIENT IS IDENTITY" | the precedent for fame as belief, derived on read | as above + a live infoMode | 79 | derived | CONFIRMED |
| `worldPulse/distancePricedNews.js :: hopDelayTicks(digest, originId, observerId)` | `if (!digest || String(originId) === String(observerId)) return 0;` · `Math.floor(weeks * NEWS_SPEED_FACTOR)` | the news delay a fame read prices arrival by | canonized map (else 0) | leaf | derived | CONFIRMED |
| `espionage/espionageMath.js :: operativeNotoriety01` + `roads/state.js :: embassyEnvoyWeight01` | `operativeNotoriety01(homeSettlement, npc)` = `embassyEnvoyWeight01({ importanceWeight01, factionPower01 })` = `clamp01(w * importance + (1 - w) * factionPower)`; "a notorious spy is easier to expose" via `(1 - T.NOTOR_W * fame)`, `NOTOR_W: 0.5` | THE landed fame-by-office scalar, already shared by envoys and spies — RN's office term | ES dark everywhere (consumers) | 163 | derived | CONFIRMED |
| `worldPulse/ransomChoices.js :: RANSOM_REGARD_BANDS` | "How much the home court values this particular person" `['forgotten','valued','beloved']`; "A beloved man is never abandoned; a forgotten one may be"; zero production callers | the landed `regard` word with no producer — RN becomes its producer (§4.6) | none; unwired | 143 | input only | CONFIRMED |
| `worldPulse/npcCredibility.js` | `TRUE_RISE: 0.6`, `LIE_FALL: 6.5`, `HALF_LIFE_TICKS: 52`; `decayedNpcCredibilityScore(entry, tick)`, `npcCredibilityWeight(score)` "NEUTRAL (0) ⇒ EXACTLY 1.0" | the person-credibility LAW the party's holder reuses (§7) | `infoStatecraftEnabled` + `npcCredibilityEnabled` — lit in no preset | 134 | `spatialLedgers.npcCredibility` | CONFIRMED |
| `worldPulse/informationStatecraft.js` (the credibility stock) | `CREDIBILITY_DELTA_KINDS = ['proven_true','deception','fracture','climb_down']`; read abroad by `pactFormation.js :: reserveFor` (`OATHBREAKER_PENALTY * disavowal`) | a COURT's word trusted — never touched by RN | `infoStatecraftEnabled` — lit in no preset | 781 | `spatialLedgers.credibility` | CONFIRMED |
| `governanceLedger.js :: governanceLedger` | "the ONE read-point for the conserved legitimacy quantity" | LEGITIMACY — RN never writes it | always | 67 raw | `powerStructure.publicLegitimacy` | CONFIRMED |
| `worldPulse/settlementAlignment.js :: settlementAlignment(item, worldState)` | `{ lawfulness01, malice01, aggressiveness }`; "EXACTLY 0.5 = no signal" / aggressiveness "EXACTLY 1.0 = no signal"; "not persisted state: recomputed per eval" | the TOWN's lens (§6) | always | 55 raw | derived | CONFIRMED |
| `worldPulse/warSeatBooks.js :: rulerAlignment` (module-private) · `data/npcTraitWeights.js :: TRAIT_ALIGNMENT, TRAIT_AGGRESSION` | "Declared alignment wins; otherwise the existing seeded npcState is the authority"; "Positive TRAIT_ALIGNMENT means good" | the PERSON's and the COURT's (by its ruler) lens — ⚠ needs an export car (RN-3 car-0) | always (read) | 492 | derived | CONFIRMED |
| `roles/roleCatalog.js :: INSTITUTION_ROLES` · `FACTION_SEAT_ROLES` | "The first entry is the senior office": High Priest · Watch Captain · Magistrate · Guildmaster · Master of Coin …; `INFLUENCE_BY_IMPORTANCE` (module-private) pillar 85 · key 60 · notable 35 · minor 10 | the only landed OFFICES (§5.2) | always | 96 raw | data | CONFIRMED |
| `factionPowerShare.js :: factionPowerShare01` · `rulingPower.js :: governingFactionOf` · `spatialLedgers.npcLadder` | "`factions[].power` is an INTEGER PERCENT SHARE"; ladder standing `RUNG_CAP_BY_TIER` | member POWER weights for a body's derived regard | ladder lit in realistic_regional · dramatic · living_realm · full | 64 raw | derived / ladder persisted | CONFIRMED |
| `spatial/rumorNetwork.js :: advanceRumorLedgers` · `tradeNeighbours` · `maxHopsFor` · `mergeArrival` · `degradeTelling` | "a significant event enters the rumor network at the settlements that WITNESSED it and travels HOP-BY-HOP"; `RUMOR_TOP_K = 24`; `RUMOR_TTL_TICKS = { major: 26, notable: 13 }`; `maxHopsFor` "major 4 hops (5 for a realm-shaking score), notable 2"; `RumorContent.scope` `'settlement' \| 'regional' \| 'realm'` | the one rumor road; the scope words fame reuses; the BFS fan-out projected scope reuses | road live iff a spatial digest ∧ infoMode ≠ omniscient: `perfect_delayed` in dramatic_campaign · living_realm; `full` in full_simulation; DORMANT in the default and three others | 364 | `spatialLedgers.rumorLedgers` | CONFIRMED |
| `display/settlementRumors.js :: RUMOR_DETAIL_THRESHOLD / OUTLINE / VAGUE` | "completeness decay drops low-salience FIELDS" (0.75 / 0.5 / 0.3) | the fixed field-loss order (PT's parts; RN reads the visible version) | as the road | 567 | derived | CONFIRMED |
| `worldPulse/partyImpactKinds.js :: PARTY_IMPACT_KINDS` · `partyImpact.js :: applyPartyImpact` | twelve kinds; "Party impacts are CANON by construction … no probabilistic roll"; reads `snapshot.regionalGraph` | the act vocabulary of §6's value table; the door that mints a party deed (PT) | none | 327 | effects + news; NO record | CONFIRMED |
| `store/operationRegistry.js :: recordPartyImpact` | `undoToken:null, undoState:'none'` | the party door has no undo — the deed's `struck` mark is its undo (§3) | — | — | — | CONFIRMED |
| `worldPulse/envoyPulse.js :: advanceEnvoyDiplomacyPulse` | "⛔ ENC-3 — THE DROP PASS, AND IT RUNS ABOVE THIS FUNCTION'S OWN EARLY RETURN"; the kernel: `memoryState = envoys.worldState;` | the measured host for RN-S1's alternative (§18) | its stages need `envoyDiplomacyActive`; the pre-gate pass runs always | 332 | — | CONFIRMED |
| `pulseKernel.js` (the rumor call) | `memoryState = setSpatialLedger(memoryState, 'rumorLedgers', rumors.next);` | proves a second ledger written inside the rumor module is dropped (RN-S1) | — | **1581 frozen** | — | CONFIRMED |
| `worldPulse/generosityKernel.js` (the deed→belief nudge) | "beliefMap.reconcileBelief with a deed-inflated ground truth (the deed is the evidence)" | the landed deed→belief precedent — at the ceiling, never extended | `beliefsActive` | **800** | beliefMaps | CONFIRMED |

**The binding prior words.**
- THE PROMISE (constitutional): a seed is a starting world forever; lived history is immutable; tuning is owner-signed. ⇒ deeds are append-only; a strike is a recorded mark, never a deletion.
- Law One (requirement 1): the engine models believers, never truth. ⇒ fame is belief; regard reads the version heard; a deed's REASON is a claim.
- Product scope: never a named character's fate; death is the DM's.
- The deity doctrine (ADDENDUM 15): "THE FOLLOWERS ACT, THE GOD DOES NOT." ⇒ a creed's faithful hold regard; a god holds none.
- FINITE SEMANTICS: closed vocabularies; the AI is a clerk, never a writer.
- The coup budget is full: `rulingPowerCoup.js :: resolveCoupVerdict` "FIVE signed terms … sum to exactly 0.815 against a DECLARED_BUDGET of 0.82 … taking it is an owner tuning act" (R3 §1d). ⇒ renown never enters a coup.
- The economy's statecraft rule, law E14 (`DESIGN_FP_ARCH_EC.md`): personal enmity colours court-to-court deciders only through their existing inputs, never past the hard war gates.
- The champions brief §2 "Failure": "RENOWN (not 'reputation', a landed token) rises and falls with deeds, scales the gift and the price, and is known to courts by report."
- RULINGS-AFTER-RESEARCH (chair, 2026-10-17, by delegation): the person substrate is the world-NPC ledger (§1); deeds ledger, projected scope, persisted regard links, the party's credibility holder, `ACT_OFFICE`, the tokens (§5); the TIER lines (§7). Where this volume departs from them it says so with a STOP or a REFINED bracket.

**The population facts that bound the design** (CONFIRMED unless marked). A world holds tens of settlements and, per settlement, a roster of NPCs with POSITIONAL ids (`npc_${idx + 1}`, R1 S2) that REBIND on reroll; only graduated persons hold a durable `wnpc_` id, and graduation is refused in every shipped preset today (`npcConsequencesEnabled` lit nowhere). The rumor ledger keeps at most 24 tellings per settlement for 26 or 13 weeks; the feed 240 entries plus the newest year; `pulseHistory` 80. Eleven of the twelve party-impact kinds never reach the rumor road through the feed (R2 Q1, EXECUTED). Four of seven presets have no rumor road at all (omniscient), two delay without weathering, one weathers (R2 Q2, EXECUTED). ⇒ Nothing may be stored per NPC beyond what an office already gives; deeds are the store; every per-pair opinion is either sparse and event-born or derived.

---
## §1 THE LAWS (RN1–RN16)

**RN1 — FOUR FACTS, NEVER MERGED.** FAME (how widely a person is known), REGARD (how each actor feels about them), CREDIBILITY (whether their word is trusted) and LEGITIMACY (a ruler's right to rule) are four quantities with four homes, and no read, band or sentence composes two of them into one. Fame is RN's derived read (§4). Regard is RN's sparse ledger plus its derivation (§5). Credibility is the landed `npcCredibility` law for persons, a holder on the party's sub-ledger for the party (§7), and the landed court stock for courts (never touched by RN). Legitimacy is `governanceLedger.js :: governanceLedger`, which RN never writes. "Infamy" is not a fifth fact: it is fame read beside a negative regard, on read, for one surface (RN4).

**RN2 — DEEDS ARE THE STORE; LIVED HISTORY IS IMMUTABLE.** Every renown fact that can change traces to a DEED: one append-only record in `spatialLedgers.deeds` (the `concludedWars` idiom: "APPEND-ONLY … never rewritten, folded or pruned — that is lived history"), minted with a zero-rng id that is never borrowed from `outcome.id` (R2 hazard 6: two removals in one settlement share an outcome id and would merge as one rumor). A deed's projected scope is computed ONCE at mint and frozen (§3.2). The DM's STRIKE writes a `struck` mark and the deed stops counting everywhere; the record stays (THE PROMISE; the landed party door has `undoState:'none'`, so the mark is its undo). A CORRECTION is its own deed carrying `correctsRef`, and it REPLACES the version it corrects wherever it is heard. Nothing is stored per NPC beyond what an office already gives.

**RN3 — FAME IS BELIEF, DERIVED ON READ, AND FADES OVER YEARS.** A person's fame derives from OFFICE (a ruler, a high priest, a guildmaster is known by position) and from the DEEDS they did, each deed contributing its frozen projected scope decayed on the spine's banded-stock half-life (`bandedStock.js :: decayTowardNeutral`, band `a_decade`, DRAFT) — no second decay law. A town knows a person only as far as word of them has reached it: the observer read asks whether the town lies inside a deed's projected reach and whether the tale has had time to arrive (`distancePricedNews.js :: hopDelayTicks` from the deed's witnesses). Fame is never stored per town and never stored per NPC.

**RN4 — ONE FAME.** The landed roamer facet `notorietyBand` ("How widely and how badly a person is spoken of") becomes, under `renownEnabled`, a PROJECTION: its "how widely" from RN's fame and its "how badly" from the person's believed moral read (RN9), through one table (§4.4); the W-H2 verdict that stamps it today becomes a deed source (`npc_verdict`). ES's `operativeNotoriety01` IS fame by office (`embassyEnvoyWeight01` of importance and faction power) and is re-pointed to RN's fame under the flag: the office floor is identical, deeds can only raise it. There is no third fame. [REFINED 2026-10-17 (fp-final) — R-RN-10/12: the notoriety facet folds by projection and its verdict writer becomes a deed source; the operative read re-points; both hosts are dark in every preset, so no shipped shift.]

**RN5 — REGARD IS SPARSE, EVENT-BORN, TWO-SIGNED, BANDED, WITH ONE PLAIN REASON.** An actor feels something about a subject only when an AUTHORED seed (the DM's allies-and-enemies list; a champion's authored relations) or a DEED it has heard of creates it; nothing is pre-populated. A regard holds two signs apart (warmth and grudge, the `factionPairStates` idiom, so "loved and hated" is expressible on scrutiny) and reads as one band on the seven-word ladder (§2.4); every change keeps ONE dominant reason in the world's words (the typed incident, concern 9b). Each holder tracks at most a capped number of subjects (DRAFT 12, UNMEASURED); the weakest drops first.

**RN6 — ONE DEED MOVES ONE HOLDER ONCE PER VERSION HEARD; NO RATCHETS.** A holder's regard of a subject carries at most one term per deed; a later, better or corrected version REPLACES that term, never adds (concern 9c). Every term decays toward its baseline on the half-life — authored links toward the authored band, emergent ones toward indifference (`decayTowardNeutral` is anti-ratchet by property: "never further from neutral … never on the far side"); repeated contact reinforces only by new deeds. Grudges fade unless renewed (requirement 2).

**RN7 — A BODY FEELS WHAT ITS PEOPLE OF POWER FEEL.** A court's (or a faction's, or a creed's faithful's) regard of anyone is DERIVED: its members' regards weighted by each member's power in it (the governing faction's share, ladder standing, the seat), plus its INSTITUTIONAL RECORD (the deeds whose target was the body itself), plus the DM's authored baseline for that body. There is never a second stored court opinion. A new ruler brings new attitudes and the court's stance moves with the people.

**RN8 — EACH ACT COMES FROM ITS OFFICE.** A court's attempt toward the party or a person is made by the member whose office does that work (the closed `ACT_OFFICE` table over the landed `INSTITUTION_ROLES` and `rulerId`, §5.2), driven by that member's own regard as well as the court's derived stance — so a welcoming court can still have the party watched by a hostile officer, and on scrutiny the why is that officer's grudge. RN supplies the read; the act itself is a hearing card owned by the program that owns the act (PT, CH). How courts treat each other stays with the landed diplomacy and war deciders (law E14).

**RN9 — EVERY ACTOR READS A DEED THROUGH TWO LENSES.** A deed's INHERENT VALUE is derived from its kind and its target on the landed alignment axes (kindness and lawfulness, plus aggressiveness as the third coordinate) — never a second judgment the DM must make (§6). Lens one: what the act is, read through the holder's own alignment. Lens two: whom it helped or hurt, read through the holder's friends and rivals. PERSONALITY sets the mix. A good or neutral rival grumbles and holds nothing against the doer; an unambiguously evil rival keeps the grudge; condemning a deed good on its face without a reason costs the condemner its own people's regard (one bounded term, never legitimacy); an ambiguous act reads NEUTRAL until the DM marks it.

**RN10 — THE PARTY IS JUDGED, NEVER JUDGES.** The party is a SUBJECT of fame and regard and a holder of credibility; it holds no regard of anyone, because the party's feelings are the table's. The engine never moves, captures or harms the party (PT's law); RN only reads what the world believes of it. [REFINED 2026-10-17 (fp-final) — R-RN-7: the brief left the party's own regard unstated; a party-held regard would be the engine deciding the players' feelings.]

**RN11 — THE DM'S HAND IS TOTAL.** The DM may set any holder's regard of any subject at will (a `dmSet` that wins until the DM lifts it), author seeds (the allies-and-enemies list: `declaredStance: ally · enemy`), strike any deed, and override a deed's moral weight (PT's mark). Every act is one typed DM verb through the established store-action lane (requirement 14; L10's one door), with its inverse for undo. The AI proposes typed operations only (finite semantics).

**RN12 — RENOWN LEANS, NEVER WRITES OTHER TRUTHS.** Renown never writes legitimacy, a court's credibility stock, a share, a strength or a stressor. Where fame or regard should matter to another program, it enters as ONE bounded lean `{ mult, reason }` at ONE landed seam that already receives `worldState` (§5.4), each lean named and capped; it never takes the coup's open slot (the budget is 0.815 of 0.82).

**RN13 — BEHIND THE SCENES.** The surface speaks in the world's words ("known across the river towns as a fair judge"; "in Varn they curse the party's name"); the reasons and the path of a tale appear on scrutiny (the Why panel, the cause walk); bands, weights and terms only on an intentional look. Unpredictable in prospect, legible and coherent on scrutiny: every regard has its reason, every fame its deeds.

**RN14 — THE MOUNT RULE.** Zero lines in `pulseKernel.js` (1581), `applyWorldPulse.js` (907) and `warTermination.js` (818); nothing in `generosityKernel.js` (800) or `armyTransitKernel.js` (798). Every RN module is a leaf under `src/domain/renown/`; every host it enters is named with its effective lines (§5, §10), and the one writer of persisted regard rides a host the chair rules (⛔ STOP RN-S1, §18).

**RN15 — THE PHYSICAL WORLD IS A SEAM.** Until the physical world lands, a place is a settlement and "how far word goes" is the rumor road's own scope words over settlement hops; afterwards the same reads take map distance through `hopDelayTicks` unchanged. Every RN wave is whole without a canonized map: aspatially, a deed is known at once inside its projected scope (the omniscient arm, §8).

**RN16 — ONE IDENTITY PER PERSON.** A person-keyed link (as holder or subject) keys on the durable `wnpc_` id and nothing else (`characterDrift.js`'s law: positional ids rebind on reroll). Graduation is the ledger's own (`graduateNpc`); until `npcConsequencesEnabled` lights (C1's lighting unit, OD-FC-39's slot), RN's regard is town-and-court level only — bodies derive their regard from their ruler's lens over heard deeds — and person fame is office fame plus the deeds of persons that already have a durable key (the party has its own ref, `{kind:'party'}`).

---

## §2 THE ONTOLOGY

### 2.1 The records (the only persisted shapes; lifecycles in §14)

**THE DEED** — `spatialLedgers.deeds = { [deedId]: Deed }`, append-only, one writer (`src/domain/renown/deedLedger.js :: mintDeed / strikeDeed`), absent-when-dark, drop-when-empty. [REFINED 2026-10-17 (fp-final) — R-RN-9: RN owns the deed ledger because every person's fame is stored in it (party, paragons, graduated persons); PT owns the party-mark fields and the party doors that call `mintDeed`; CH owns the paragon sources; one normalizer names every field (the `normalizeEntry` lesson).]

| Field | Type | Owner | Meaning |
|---|---|---|---|
| `deedId` | `deed.<fnv>` | RN | zero-rng FNV-1a of the canonical composite (source · source id or command id · tick · kind · target key), the `npcLedger` mint idiom; never `outcome.id`, never `now` |
| `tick` | integer | RN | the world tick of the act |
| `source` | `DEED_SOURCES` member | RN | which door minted it (§2.4) |
| `kind` | the source's closed kind | RN | for `party_impact` a `PARTY_IMPACT_KINDS` key; for `party_event` a settlement event type; for `paragon_act` CH's act kind; for `npc_verdict` a `VERDICTS` member; for `voiced_regard` `praise · condemnation` |
| `doer` | actor ref | RN | `{kind:'party'}` · `{kind:'person', id:'wnpc_…'}` · `{kind:'settlement', id}` (a court's act) |
| `target` | actor ref + optional `institution` / `factionId` / `stressorId` | RN | whom the act was done to (a positional NPC target is carried by its `wnpc_` when graduated, else by name, never by `npc_N`) |
| `witnessIds` | settlement ids, codepoint-sorted | RN (PT suggests) | the hop-0 witnesses: the target's settlement(s) + where the doer was present (the rumor road's witness meaning) |
| `projectedScope` | `settlement · regional · realm` | RN | frozen at mint (§3.2) |
| `reach` | `{ [settlementId]: hop }` capped DRAFT 64, or absent when `projectedScope = realm` reached every settlement | RN | the frozen BFS result the observer read consults |
| `magnitude` | `0..3` | RN | `rumorNetwork.js :: magnitudeBandOf(severity)` of the act's own magnitude (the DM's for a party impact) |
| `backing` | `{ by: actorRef }` | PT | the DM's sanction mark ("sanction" is the prose word; `sanctioned` is a landed economic channel) |
| `moralWeight` | `heroic · admirable · neutral · shameful · villainous` | PT | the DM's override; ABSENT = RN's derived inherent value |
| `proof` | `kept · told · shown` | PT | how the reason travels |
| `reasonGiven` | boolean | PT | whether a reason was told at all (the reason itself is the DM's prose, quoted, never parsed) |
| `correctsRef` | deedId | RN | this deed is the truth chasing that one |
| `struck` | `{ tick }` | RN | the DM struck it; it counts nowhere |
| `causedBy` | provenance ref | RN | requirement 20 |

**THE REGARD ENTRY** — `spatialLedgers.regard = { [holderKey]: { [subjectKey]: RegardEntry } }`, drop-when-empty at both levels, one writer (`src/domain/renown/regardLedger.js`), absent-when-dark. [REFINED 2026-10-17 (fp-final) — R-RN-5: an entry is persisted ONLY for what derivation cannot reproduce: (a) the DM's authored seeds and sets, (b) the version of a deed a holder heard where the rumor road delays or weathers it (the belief presets), (c) a person's first-hand meeting recorded at the table (PT's deed). In the omniscient arm every heard-deed term is derived on read from the deed ledger (§8). The chair's single-ledger preference is kept: courts, persons, champions, towns and the party's subjects share this one writer.]

| Field | Type | Meaning |
|---|---|---|
| `warmth`, `grudge` | `0..1` each (4-decimal) | the two signs, each the sum of its terms' decayed contributions, recomputed on read from `terms` (never a stored running stock — ratchets live in running stocks, R2 j3) |
| `terms` | `[{ deedId, ver, tick, cause, sev, sign }]` ≤ 8 | one per deed (RN6); `ver` = the visible-parts digest heard; `cause` from `REGARD_CAUSES`; the strongest live term is the ONE reason |
| `declared` | `ally · enemy` | the DM's authored seed (`declaredStance`) — the baseline the entry decays toward |
| `dmSet` | `{ band, tick }` | the DM's override; wins until lifted |
| `week` | integer | the decay anchor |

**THE PARTY'S CREDIBILITY** — a holder `{ score, lastUpdateTick }` on the party sub-ledger (`spatialLedgers.party.credibility`; the sub-ledger is PT's, the holder's law is RN's, §7).

### 2.2 The regard keys (closed grammar; RN-local, mapped from the actor-ref convention `{kind, id?}`)

| Key | Holder? | Subject? | Meaning |
|---|---|---|---|
| `p:<wnpc>` | yes | yes | a graduated person (an ordinary NPC, a court member, a paragon) |
| `party` | **never** (RN10) | yes | the party (`{kind:'party'}`, one per campaign; a second party is PT's additive slot) |
| `s:<settlementId>` | yes | yes (as the town) | the town's people, the commons |
| `c:<settlementId>` | authored/DM only (RN7) | yes | the court — a BODY, its regard derived |
| `f:<settlementId>:<factionId>` | authored/DM only | yes | a faction — a body |
| `creed:<deityRef>` | authored/DM only | yes | a creed's faithful — a body (the followers act; a god holds nothing) |

A menace is never a key (MN6: it has no mind, and the world's fear of it is MN's response channels).

### 2.3 The derived reads (signatures; all pure, rng-free, memoized per snapshot by WeakMap, the `tickIndices.js` idiom)

- `fameOf(worldState, actorRef, tick) → { scope: FAME_SCOPES member, office01, deeds: [{ deedId, scope }] }` — §4.
- `fameIn(worldState, actorRef, observerSettlementId, tick) → { scope, heard: [deedId], arm: 'omniscient'|'road'|'aspatial' }` — fame as belief at one town (§4.3).
- `inherentValueOf(worldState, deed) → { kind01, law01, force01, ambiguous: boolean }` — §6.1 (`inherentValue`, never stored).
- `readDeed(worldState, holderKey, deed, version) → { sign, sev, cause } | null` — the two lenses (§6.2).
- `regardOf(worldState, holderKey, subjectKey, tick) → { band, warmth, grudge, reason, arm }` — §5; for a body it composes `courtRegardOf`.
- `courtRegardOf(worldState, bodyKey, subjectKey, tick) → { band, members: [{ key, weight, band }], record: [deedId], baseline }` — §5.3.
- `actingOfficer(worldState, settlementId, act) → { key, office, band }` — §5.2.
- `ransomRegardBand(worldState, homeSettlementId, personKey, tick) → 'forgotten'|'valued'|'beloved'` — §4.6's projection, the producer the ransom leaf lacks.
- `notorietyProjection(fameScope, moralRead) → NOTORIETY_BANDS member` — §4.4.
- `partyCredibilityOf(worldState, tick) → { score, weight, band }` — §7.

### 2.4 The closed vocabularies (each checked with `rg -w` on master; receipts `cure/L-RN-probe/tokenCensus.out.tsv`; fold §5 rows owed at P4)

| Vocabulary | Words | Census and ruling |
|---|---|---|
| `FAME_SCOPES` | `unknown · settlement · regional · realm` | REUSES `RumorContent.scope` (`'settlement' \| 'regional' \| 'realm'`, the road's own "how far word goes") plus `unknown` (the landed `NOTORIETY_BANDS` mint rung, same meaning). `realm` here is the campaign world — the rumor road's landed meaning; the kingdom takes `polity`. [REFINED 2026-10-17 (fp-final) — R-RN-2: fame's band IS its scope; no fame word list is minted (R2 recommended `fameScope` with the scope words; the field is unnecessary because the band and the scope are one).] |
| `REGARD_BANDS` | `hatred · enmity · mistrust · indifference · fondness · esteem · adoration` (ascending; `indifference` = no feeling) | FREE or PROSE-ONLY: `hatred` (2 comments), `enmity` (one reason-string literal in `settlementPolitics.js`, same meaning — registered), `mistrust` (1 prose line), `indifference` (3 prose), `fondness` · `esteem` · `adoration` (0). [REFINED 2026-10-17 (fp-final) — R-RN-1: the champions brief's ladder `hatred · enmity · wary · neutral · warm · loyal · devoted` collides: `wary` is a `houseActs.js` rung and a `religiousAcceptance` value; `warm` is `canonRelationshipImpact.js`'s polarity; `loyal` is a personality TRAIT read by `thirdPartyRansom.js :: REFUSE_TRAITS`; `devoted` a mentor tone; `neutral` an `ALIGNMENT_READS` rung on the same roamer facets surface.] |
| `REGARD_CAUSES` | `heard_deed · met · pledge_kept · pledge_broken · ransomed_by · abandoned_by · refused_at_gate · banned_by · betrayed · served_with · gift · authored · condemned_a_good_deed · praised · condemned` | the incident types (the dominant one is the reason); FREE as literals (`gift` is prose); PT/CH append rows by registration only |
| `DEED_SOURCES` | `party_impact · party_event · paragon_act · npc_verdict · voiced_regard` | closed; grows only by a registry row in its owner's wave (PT owns the first two, CH the third, RN the last two) |
| `ACT_OFFICE` | §5.2's table | over `INSTITUTION_ROLES` keys and `rulerId`; no `marshal`, `spymaster` or `chancellor` office is minted (R2 Q6: none is a typed office) |
| `OFFICE_SCOPE` | §4.2's table | role → office fame scope |
| `INHERENT_SIGN` words (DM-facing) | `heroic · admirable · neutral · shameful · villainous` | PT's `moralWeight` words reused for the derived value's band (one vocabulary for "how it looks on its face"); `heroic` registered against `contentProfile` (R2) |
| `declaredStance` | `ally · enemy` | the landed NPC-pair relationship words (`npcData.js` templates; `RelationshipsTab.jsx`), SAME meaning — reused and registered |
| party credibility words | `discredited · doubted · ordinary · trusted` | REUSES `envoyTestimony.js :: TESTIMONY_CREDIBILITY_BANDS` ("Closed source-credibility bands. Ordinary is the neutral middle") — one vocabulary for "is their word trusted" |
| `renown` | the volume, the module dir `src/domain/renown/`, the flag `renownEnabled` | FREE (one prose hit: "a healer of some local renown") |

**Homonyms registered (fold §5 at P4).** `regard` (RN's link; the ransom leaf's `regardBand` is its PROJECTION, §4.6) · `deed` (the record; the Herald move `DEED` in `prose/moveGrammar.js` is a prose move) · `reach` (the deed's `reach` field is a hop map; the landed `REACH_BANDS` are travel weeks — the field is only ever read with "deed") · `realm` (the rumor scope word; never the kingdom) · `enmity` · `ally`/`enemy` (same meanings) · `heroic` (vs `contentProfile`) · `moralWeight` (vs a local in `generosityEV.js`).

---
## §3 THE DEED — THE ONE STORE (RN-0)

### 3.1 The mint (one writer, many doors)

**Reads:** TRUTH — a deed is what the DM recorded (canon by construction, the party door's law) or what a landed engine verdict decided; it is the world's fact, and every BELIEF about it is read downstream (§4.3, §5.1). **Writes:** `spatialLedgers.deeds` through `deedLedger.js :: mintDeed({ worldState, source, sourceId, tick, kind, doer, target, witnessIds, magnitude, snapshot }) → { worldState, deedId, minted }` only — idempotent (the same composite key mints nothing twice), absent-when-dark (`renownEnabled !== true` ⇒ the same `worldState` reference, `deedId: null`). **Callers (the `DEED_SOURCES` rows):**

| Source | Door (owner) | Seam | Host eff. lines | Lit when |
|---|---|---|---|---|
| `party_impact` | `partyImpact.js :: applyPartyImpact` (PT) — one call after the outcomes are built; every door that reaches it (the World Pulse panel, the composer's checkbox through `mapEventToPartyImpact`, the decree's party hand, the Surveyor, `roadsRescueInflame.js`) mints through it | `partyImpact.js` | 327 | `renownEnabled` ∧ PT's `partyEnabled` |
| `party_event` | the composer's `partyCaused` path (`settlementLifecycleHelpers.js`, `drainQueuedEvents.js`) for EVERY party-caused settlement event, not only the six that ripple (R2 R-14: "attribution only — no ripple" today leaves no world trace) (PT) | those two call sites, each one call | — (PT measures at its car) | as above |
| `paragon_act` | CH's weekly pass when a paragon uses its gift or fails (CH) | CH's leaf in `envoyPulse.js` (RF-17) | 332 | `renownEnabled` ∧ CH's flag ∧ `npcConsequencesEnabled` |
| `npc_verdict` | the W-H2 verdict lane (`npcVerdictTable.js`), in place of stamping `notorietyBand` (RN4) | the verdict writer, one call | 262 | `renownEnabled` ∧ `npcConsequencesEnabled` |
| `voiced_regard` | RN's own heard-regard pass (§5.5) | ⛔ RN-S1's host | — | `renownEnabled` and the host the chair rules |

**The counterforce (requirement 2):** a deed only ever ADDS a fact; what pushes back is time (§4's decay), the other lens (§6), the strike (the DM), the correction (§3.3) and the rival's voice (§5.5). No deed raises fame or regard without a half-life.

**Determinism:** ids are FNV-1a over a canonical composite (never `now`, never `Math.random()`, the `runRecordPartyImpact` wall-clock stamp is never an input — R2 hazard 15); iteration codepoint-sorted.

### 3.2 The projected scope (frozen at mint; replaces "peak reach observed")

[REFINED 2026-10-17 (fp-final) — per RULINGS-AFTER-RESEARCH §5 (R2 R-2): the chair's original "peak reach written as the tale arrives, a monotone max" needs a per-tick writer the frozen kernel cannot host; the projected scope is computed ONCE at mint by a pure BFS and stored, immutable — the deed's own telling, part of the event.] `deedLedger.js :: projectScope({ regionalGraph, digest, witnessIds, significance, score }) → { projectedScope, reach }`: a breadth-first walk from the witnesses over the landed carriers' adjacency — `rumorNetwork.js :: tradeNeighbours(graph, id)` (confirmed trade channels, both ways, codepoint-sorted), plus `distanceRead.js :: seaLaneNeighbourMap(digest)` and `teleportNeighbourMap(digest)` where a digest exists — to the rumor road's own hop budget `maxHopsFor({ significance, score })` (major 4, 5 at score ≥ 95; notable 2). The deed's significance comes from the DEED, not from `newsEntryForOutcome`'s severity×80 score (R2 R-18): `major` when its magnitude band is ≥ 2 or its target is a ruler, a court or a settlement-wide condition; else `notable` (DRAFT, UNMEASURED). Scope: `settlement` when the walk reaches only the witnesses, `regional` when it reaches beyond them, `realm` when it reaches DRAFT ≥ 60% of the world's settlements. `reach` keeps each reached settlement's hop (capped DRAFT 64, nearest first, codepoint ties). The live army, smuggle and migrant carriers are NOT read at mint (they are transient); the rumor road still carries the tale over them in the belief presets, and the road's actual arrival is what a holder hears there (§5.1) — the projected scope is the tale's ceiling for FAME, the road is the carrier for REGARD.

### 3.3 Strike and correction

`strikeDeed({ worldState, deedId, tick })` sets `struck: { tick }`; every read skips it; persisted regard terms carrying that `deedId` drop on the next normalize (R2 R-13). A strike is a DM verb with its inverse (unstrike). A CORRECTION is minted as its own deed (`correctsRef` = the original; PT's door: "the truth can chase the rumor") and travels the same road at the same speed; wherever it is heard, the holder's term for the original is REPLACED by its reading of the correction (§5.1). Corrections never re-use the original's `eventRef` (`mergeArrival` keeps `relayedTick`: "a settlement never re-relays a corrected telling", R2 hazard 4).

### 3.4 The deed's telling on the rumor road

The deed seeds the road FROM ITS OWN LEDGER inside `rumorNetwork.js :: advanceRumorLedgers` (it already receives `worldState`; zero kernel lines; it bypasses the feed's significance gate and `normalizeEntry`'s allowlist, R2 R-1): a deed arm reads `spatialLedgers.deeds` for unstruck deeds minted within `RUMOR_SEED_LOOKBACK_TICKS` and seeds an arrival record at each witness with `eventRef: deed:<deedId>`, significance and score from §3.2, and a typed content field `doerRef` (an actor-ref string; NEVER `partyIds`, whose entries are witnesses and settlement-shaped — R2 hazard 2). Host: `rumorNetwork.js` 364 → ≈ +30 in a leaf `renown/deedTelling.js` the host calls once. A non-deed event is byte-identical (the arm reads nothing when the ledger is absent). PT-4 adds the deed's PARTS (backing, reason, proof) and their visibility thresholds to the read model; RN reads only the visible version (`ver`, §5.1).

**Clock:** mint at the DM's act (immediate); scope frozen. **Receipt:** "Word of the deed at Kell goes out along the river road" (the dossier of each witness town). **Surface/scrutiny/machinery:** the surface says where the tale started and that it travels; scrutiny shows the deed, its witnesses and how far it could go ("as far as the river towns"); the BFS and the hop map only on intent.

---

## §4 FAME (RN-0)

### 4.1 The read

`fameOf(worldState, actorRef, tick)` = the widest of (a) the OFFICE scope (§4.2) and (b) each unstruck deed whose `doer` is the actor, its scope decayed: `ordinal = decayTowardNeutral(SCOPE_ORDINAL[projectedScope], 0, ageWeeks, 'a_decade')`, rounded half-up to a `FAME_SCOPES` index. [REFINED 2026-10-17 (fp-final) — R-RN-3: band `a_decade` (520 weeks; R2 offered `a_few_years` or `a_decade`) with rounding gives "obscurity returns with time" at a felt pace: a realm-wide deed is known realm-wide about two and a half years, across its region about ten, in its own town about twenty-six (DRAFT, UNMEASURED, FP-46 roster).] **Reads:** the deed ledger (truth of what was done) and office (truth of position); the RESULT is the world's widest knowledge, never a town's belief — the observer read (4.3) is the belief. **Writes:** nothing (derived; memoized per snapshot). **Counterforce:** time, by the one half-life; a struck deed; no deed, no fame beyond office.

### 4.2 Fame by office (the closed `OFFICE_SCOPE` table)

| Office (landed read) | Scope | Why |
|---|---|---|
| the ruler (`rulingPower.js :: governingFactionOf` → its leader, read as `rulerId`) of a polity's root (PL's `rootId`) | `realm` | the crown is known across the world |
| the ruler of a liege or of a city / metropolis | `regional` | known across its lands |
| the ruler of any other settlement | `settlement` | known at home |
| an `INSTITUTION_ROLES` pillar (`High Priest`, `Watch Captain`, `Magistrate`, `Guildmaster`, `Master of Coin`, `Master Smith`) or a faction `leader_champion` seat | `settlement` | known in their town |
| everyone else | `unknown` | ordinary NPCs "stay locally known, as they should" — known only by deeds |

The office term is ALSO the landed scalar `embassyEnvoyWeight01({ importanceWeight01, factionPower01 })` (`office01`), which RN exposes for the two consumers that already read it (envoys and spies); office never decays while the office is held, and drops the day it is lost (a new ruler is the one known by the crown).

### 4.3 Fame as belief (one town at a time)

`fameIn(worldState, actorRef, observerId, tick)`: the observer knows a deed iff the observer lies in the deed's `reach` (or the scope is `realm` with no `reach` map) AND `tick − deed.tick ≥ min over witnesses of hopDelayTicks(digest, witness, observer)` (the landed news delay, R2/M12; 0 aspatially). It knows an office iff the observer lies inside the office's scope (its own town; the ruler's lands by PL's walk; the world). The observer's fame of the actor = the widest scope it knows. ARMS: omniscient presets (the default `realistic_regional`, `quiet_local`, `static_campaign`, `narrative_campaign`) — known at once inside the projected scope, no delay, the full story (R2 R-15; R2 Q3 "yes": the party has fame in the default preset); the belief presets — the delay applies; aspatial — no delay (no digest). This is the roamer precedent (`believedReputation`) generalized from one origin to a list of deeds, which fixes its single-origin key (R1 RF-16, H15).

### 4.4 The notoriety projection (RN4)

| fame at the observer | believed moral read ≤ `shameful` (the holder-town's net regard ≤ `mistrust` and the deeds' dominant sign negative) | otherwise |
|---|---|---|
| `unknown` | `unknown` | `unknown` |
| `settlement` | `whispered` | `whispered` |
| `regional` | `notorious` | `known` |
| `realm` | `infamous` | `known` |

Under `renownEnabled` ∧ `npcConsequencesEnabled`, every reader of `reputation.notorietyBand` (`npcCirculation.js`, `npcCirculationTable.js :: rejectionFor`, `npcCirculationBelief.js`, `reputationRaceConsumer.js`, `heraldWanderers.js`, `npcLedgerProjection.js`) reads it through `notorietyProjection` for that observer; `scandalClass`, `alignmentRead`, `competenceRead` and `edictMark` stay the ledger's (they are not fame). Dark ⇒ the landed facet, byte-identical.

### 4.5 The operative's notoriety (RN4)

Under `renownEnabled`, `espionageMath.js :: operativeNotoriety01` returns `max(office01, FAME01[fameIn(…, the operative, the target court)])` with `FAME01 = { unknown: 0, settlement: 0.33, regional: 0.66, realm: 1 }` (DRAFT) — a spy whose deeds reached the court he spies on is easier to catch there; the office floor is the landed number exactly. One edit in `espionageMath.js` (163) through a leaf import. ES is dark everywhere: a lit-mutant pin, no shipped shift.

### 4.6 The ransom projection (the unwired leaf's producer)

`ransomRegardBand(worldState, homeSettlementId, personKey, tick)` = the home COURT's derived regard of its own captive (§5.3), floored at `valued` for an office holder (a court values its officers by office), projected: `forgotten` ← `hatred · enmity · mistrust`; `valued` ← `indifference · fondness`; `beloved` ← `esteem · adoration`. [REFINED 2026-10-17 (fp-final) — R-RN-4: R2 drafted `indifference → forgotten`; the leaf itself calls `valued` "ordinary regard" (`homeRansomAnswer`: "Strained means and ordinary regard: the price decides"), so a court that feels nothing in particular for its own man still values him; one idiom, a mapping table, per the brief's preferred arm.] The ransom leaf's `normalizeHomeCourt` row takes this band from RN when the ransom road that wires it lands (WR-7d's persistence is an OWNER gate; the roads hostage's own home pays over the term today) — RN is the producer, the consumer's wiring is the ransom road's unit.

**Clock:** derived per read; decay `a_decade`. **First-visible:** the week of the deed (the witness towns' dossiers). **Receipt / felt sentence:** "Known across the river towns as the ones who broke the siege at Kell." **Surface / scrutiny / machinery:** the surface says where a person is known and for what, in words; scrutiny lists the deeds behind it and where each reached; the ordinals, the half-life and `office01` on intent.

---
## §5 REGARD (RN-1, RN-2)

### 5.1 What a holder heard — the one writer and the derived arm

**Reads:** BELIEF — the version of a deed that reached the holder's town (the rumor ledger's record for `deed:<deedId>` at that settlement, its visible parts by the read model's completeness thresholds), or, in the omniscient arm, the deed itself inside its projected scope. A person holder hears what the town it STANDS IN has heard (the npcLedger `residency`/`placed` host; R1 RF-6). **Writes:** `spatialLedgers.regard` only, through `regardLedger.js :: writeHeardTerm({ worldState, holderKey, subjectKey, deedId, ver, reading, tick })` — the ONE writer; it replaces the holder's term for that deed (or for the deed it corrects) and never adds a second (RN6). **The pass:** `renown/regardHeard.js :: advanceHeardRegard({ worldState, tick })` scans each settlement's rumor ledger for `deed:` tellings whose visible-parts digest `ver` differs from the holder's stored term (an arrival, a better telling superseding — `mergeArrival` keeps the earliest `arrivalTick`, so "arrived this tick" alone would miss a better version — or a correction), reads each through §6's lenses for the town (`s:`) and for the graduated persons standing there (`p:`), and writes the term. Bounded: ≤ 24 tellings per settlement (`RUMOR_TOP_K`), ≤ 8 terms per entry, ≤ DRAFT 12 subjects per holder.

**⛔ STOP RN-S1 — THE HOST.** The ruling placed this pass "inside the rumor stage"; measured, the kernel persists only `rumors.next` into `rumorLedgers` (`pulseKernel.js`: `memoryState = setSpatialLedger(memoryState, 'rumorLedgers', rumors.next);`), so a second ledger written there is lost without a kernel line. MEASURED ALTERNATIVE (the chair rules): a pre-gate pass at the head of `envoyPulse.js :: advanceEnvoyDiplomacyPulse`, beside the ENC-3 drop pass that "RUNS ABOVE THIS FUNCTION'S OWN EARLY RETURN" — after rumors and beliefs, every tick in every preset, its world returned to the kernel unconditionally (`memoryState = envoys.worldState;`); `envoyPulse.js` 332 → ≈ 336; zero kernel lines. FALLBACK, buildable with no host: no persisted heard terms anywhere (the omniscient arm's derivation, §8, in every preset, with `hopDelayTicks` for arrival) — it loses the version a town heard in `full_simulation` once the 26/13-week telling expires, and voiced regard (§5.5) becomes DM-authored only. Until ruled, RN-1's charter carries the writer leaf and both mounts; nothing else in the volume depends on which.

**The derived arm** (every holder in the omniscient presets; every BODY in every preset; the fallback everywhere): `regardOf` sums, for each unstruck deed the holder has heard (§4.3's test from the holder's town), the lenses' reading decayed on `a_few_years` from the hearing tick — the same terms the writer would have stored, so the two arms agree wherever the road neither delays nor weathers. **The band:** `net = warmth − grudge` on `[−1, 1]` → `REGARD_BANDS` by DRAFT edges (±0.1 indifference; ±0.35; ±0.65), unless `dmSet` (wins) or `declared` (the baseline every term decays toward: `ally` ⇒ `fondness`, `enemy` ⇒ `enmity`). **The reason:** the strongest live term's `cause` and deed, in the world's words.

### 5.2 Each act from its office (`ACT_OFFICE`, closed)

| Act family (the owning program's hearing kinds) | Office that makes it | Landed read |
|---|---|---|
| summons, audience, invitation, recognition, offer of employment, a sanction voided or repudiated | the RULER | `rulerId` (the governing faction's leader) |
| arrest, warrant, refusal at the gate, a ban enforced | the WATCH | `INSTITUTION_ROLES.law_enforcement[0]` (`Watch Captain`) |
| judgment, a ban proclaimed, a bounty posted | the BENCH | `INSTITUTION_ROLES.civic[0]` (`Magistrate`) |
| a creed's welcome, condemnation or anathema | the TEMPLE | `INSTITUTION_ROLES.religious[0]` (`High Priest`) of that creed's institution |
| a price, a contract, a purse | the PURSE | `INSTITUTION_ROLES.finance[0]` (`Master of Coin`) or `trade[0]` (`Guildmaster`) |
| a quiet watch, a spy set on someone | no office — the espionage operative cast (importance-inverse, `espionageMissions.js`) | ES's own cast; RN supplies the cast person's regard |

`actingOfficer(worldState, settlementId, act)` returns the holder of that office (absent ⇒ the ruler acts) and their regard band of the subject; the owning program's card names the officer and the reason ("Kell's Watch Captain, who has not forgotten the riot, has posted men at the gate"). RN graduates these officers and the ruler on their first regard (`graduateNpc` with `hostSettlementId` = their own seat; it "writes nothing to npcs[]") — at most six persons per court. [REFINED 2026-10-17 (fp-final) — R-RN-11: graduation is bounded to the `ACT_OFFICE` holders and the ruler, so "court NPCs carry their own regard" never graduates whole rosters.]

### 5.3 A body's derived regard (`courtRegardOf`; RN-2)

`courtRegardOf(c:<sid>, subject)` = the authored baseline for the body (`dmSet` ⊳ `declared`) ⊕ `Σ_m w_m · net(regardOf(p:m, subject)) / Σ_m w_m` over the ruler and the `ACT_OFFICE` holders ⊕ the INSTITUTIONAL RECORD (each unstruck deed whose `target` is this settlement or its court, read through the ruler's lens at full weight — "what was done to the court as a body"). Weights (DRAFT, UNMEASURED): the ruler `1 + factionPowerShare01(governing faction)`; an officer the landed importance influence (pillar 0.85, key 0.60) × `(1 + its faction's share01)` when its faction governs; the ladder standing multiplies where `npcLadderEnabled` is lit (`spatialLedgers.npcLadder`). A faction body uses its seats (`FACTION_SEAT_ROLES`); a creed's faithful use that creed's temple officers in each town where the creed stands, weighted by the creed's standing (`cult · established · ascendant`). **Dark person arm** (`npcConsequencesEnabled` off, every preset today): members contribute through the RULER's lens over the heard deeds (derived, no person key), so courts still feel; no officer differs from the court until persons light. **Counterforce:** succession replaces the ruler's term at once (a new ruler brings new attitudes); members' terms decay; the institutional record decays like any term. **Never stored:** there is no court opinion field anywhere. [REFINED 2026-10-17 (fp-final) — R-RN-8: the brief's court derivation is generalized to every BODY (a faction through its seats, a creed's faithful through its temple officers weighted by standing), so "religions" and "courts at large" in the owner's party message share one read and the deity doctrine holds (the faithful feel; the god does not).]

### 5.4 Fame and regard applied by role (each a bounded lean at ONE landed seam, or a STOP with its slot)

| Role | What the owner said | Seam (`path :: symbol`; host eff. lines) | Lean | Status |
|---|---|---|---|---|
| spy | "a notorious spy is easier to expose" | `espionageMath.js :: operativeNotoriety01` (163) | §4.5 — fame at the target court replaces the office-only scalar, floor identical | buildable; ES dark (C1) |
| priest | "a beloved priest's word carries in the faith contest" | `religiousContest.js :: advanceReligionStates` → the creed's entry in `strengthByRef` before `advanceShares` (493; it already receives `worldState`, R3 §1d) | one `{ mult ∈ [1, 1.15] DRAFT, reason: "The High Priest of Kell is held in esteem, and her word carries" }` for a creed whose High Priest the town's commons hold at `esteem` or above and whose fame reaches the town | buildable; the local faith lane runs in any deity-bearing world |
| healer | "a renowned healer is called to plague towns" | CH's call board (the derived registry of calls; `DESIGN_FP_ARCH_CH.md`) reads `fameIn` to rank whom a plague town calls | a weight on the call, never a move | buildable for paragons (CH); ordinary NPCs never travel on their own (the W-H3 wander loop's only caller is CH), so for them it is a dossier line ("a healer of some renown") and nothing more — recorded, not a lean |
| envoy | "a famous envoy opens doors" | `pactFormation.js :: reserveFor` (565; receives `worldState`), the E14 shape, for an envoy carried by the errand spine | one relief `{ mult ∈ [0.9, 1] DRAFT on reserve01, reason }` | ⛔ STOP RN-S4: the errand spine is lit nowhere; slot C1 |
| general | "feared by enemies and sought by courts" | the generals design's army record (`commandQuality` / `deployment.general`, `warDeployment.js` 685) | — | ⛔ STOP RN-S2: unbuilt (branch-only design); slot C4 |
| councillor | "a councillor who hates the party argues against it at council" | INT's counsel (bloc-level, unbuilt) | — | ⛔ STOP RN-S3: slot C4 (INT carried by the generals chain) |
| any person at a gate | "refused at the gate to circumstance or reputation" | `npcCirculationTable.js :: rejectionFor` reading the believed notoriety | §4.4's projection | buildable; `npcConsequencesEnabled` |
| a paragon's gift and price | "losing repuation (which would also affect their abilities to a degree)" | CH's gift lean reads `fameOf` | CH's bounded scale | CH's |

### 5.5 Voices that carry (opinion leaders; depth one)

A holder whose fame is `regional` or wider and whose regard of a subject crosses into `enmity`/`hatred` or `esteem`/`adoration` mints ONE `voiced_regard` deed (`praise` or `condemnation`; doer the holder, target the subject), at most once per (holder, subject) per year (DRAFT; the cooldown tick rides the holder's entry). Its scope is the holder's own (`maxHopsFor` +1 hop when the holder is realm-famous — the bounded multiplier on the rumor's reach, DRAFT). A hearer reads a voiced deed through the SPEAKER: `sign × net(hearer's regard of the speaker) × DRAFT 0.5` toward the subject (a hearer who esteems the High Priest takes part of her contempt for the party; one who hates her leans the other way). **No cascade by construction:** a term whose cause is `praised` or `condemned` never triggers a crossing that mints another voice. **The condemner's cost (§8 of the party brief):** a `condemnation` of a deed whose inherent value is `admirable` or `heroic`, voiced by a holder the deed did not harm (its own lens two ≥ 0), writes one `condemned_a_good_deed` term (sev DRAFT 0.1) from the condemner's own town toward the condemner, unless the town's `malice01` ≥ 0.67 (its people share the malice) — regard only, never legitimacy. [REFINED 2026-10-17 (fp-final) — R-RN-6: "spreads further" is built as a depth-one opinion deed on the one road, so the bound is structural and the condemnation the owner said is "difficult … without reason" has a carrier.] The engine-minted voice needs RN-S1's host; under the fallback the DM records a voice as a deed.

### 5.6 The DM's hand (requirement 14)

Verbs (the store-action lane, `operationRegistry`-registered, each with its inverse): `SET_REGARD(holder, subject, band | clear)` → `dmSet`; `DECLARE_STANCE(holder, subject, ally | enemy | clear)` → `declared` (the allies-and-enemies list; any holder kind, bodies included); `STRIKE_DEED(deedId)` / unstrike. A party-facing set (the party as subject) bypasses the proposal queue like the party door (`applyMode: 'auto'`; R2 hazard 13: realm-verb dials are settlement-only and ≤4). The AI proposes these verbs from closed vocabularies only. Lifecycle survival is §14.

**Clock (regard):** weekly hearing (the pass); emergent terms decay `a_few_years` (156 weeks, "a bond, a standing, a grudge"); authored baselines never decay; `dmSet` holds until lifted. **First-visible:** the week a tale arrives — the town's dossier line. **Receipt / felt sentence:** "In Varn they curse the party's name for saving Kell, their old rival; the commons say it was well done." **Surface / scrutiny / machinery:** words on the surface (behind the party lens's "who has heard" toggle); the one reason and the deed on scrutiny; warmth, grudge, weights and terms on intent.

---

## §6 THE INHERENT VALUE OF A DEED AND THE TWO LENSES (RN-3)

### 6.1 The inherent value (derived, never stored; `inherentValueOf`)

Three coordinates on the landed axes, each on `[0, 1]` with 0.5 = no signal: `kind01` (kindness — the inverse of malice), `law01` (lawfulness), `force01` (aggressiveness, the third coordinate, concern 9e). ONE normalizer, declared once: `force01 = clamp01(aggressiveness / 2)`, because `settlementAlignment`'s aggressiveness is centered on 1.0 ("EXACTLY 1.0 = no signal") while the other two are centered on 0.5 (R2 hazard 14; its range is measured at RN-3's car-0). The DM-facing band reuses PT's words (`heroic · admirable · neutral · shameful · villainous`) by `kind01` edges (DRAFT 0.85 / 0.62 / 0.38 / 0.15). PT's `moralWeight` mark, when present, REPLACES the derived band for every reader (the night's context differs).

| Party-impact kind | kind01 | law01 | force01 | Target-dependent? | On its face |
|---|---|---|---|---|---|
| `resolve_stressor` | 0.85 | 0.5 | 0.5 | no (relief) | admirable; heroic at magnitude ≥ 2 |
| `ease_stressor` | 0.7 | 0.5 | 0.5 | no | admirable |
| `worsen_stressor` | 0.2 | 0.4 | 0.6 | no | shameful; villainous at magnitude ≥ 2 |
| `name_attacker` | 0.5 | 0.5 | 0.5 | no | neutral (no moral content) |
| `broker_relationship` | 0.7 | 0.6 | 0.35 | no (peace on its face) | admirable |
| `inflame_relationship` | 0.3 | 0.4 | 0.7 | yes — AMBIGUOUS (neutral) when either side's ruler reads `malicious` | shameful otherwise |
| `clear_condition` | 0.75 | 0.5 | 0.5 | yes — by the condition's own valence (a harmful condition cleared is relief); a condition with no valence is AMBIGUOUS | admirable |
| `impose_condition` | 0.25 | 0.4 | 0.6 | yes — the inverse | shameful |
| `bolster_faction` | by target: `1 − malice01` of the faction's leader | 0.5 | 0.5 | yes — AMBIGUOUS when the leader reads `balanced` | — |
| `undermine_faction` | by target: `malice01` of the leader | 0.45 | 0.55 | yes — AMBIGUOUS when `balanced` | — |
| `empower_npc` | by target: `1 − malice01` of the NPC | 0.5 | 0.5 | yes — AMBIGUOUS when `balanced` | — |
| `remove_npc` | by target: `malice01` of the NPC (unseating a cruel tyrant is not unseating a beloved healer) | 0.3 (0.6 inside a backing's reach — PT) | 0.75 | yes — AMBIGUOUS when `balanced` | heroic when the target is a `malicious` ruler |

AMBIGUOUS ⇒ the derived value is `neutral` until the DM marks it (concern 9f). Target reads are the landed person lens (6.2) and, for conditions, the condition catalog's row (PLAUSIBLE: the valence field is measured at RN-3's car-0; an absent valence is ambiguous). `party_event` kinds (the composer's event types), `paragon_act` kinds (CH) and `npc_verdict` kinds append rows to this table by registration in their owners' waves, under the same three coordinates; `voiced_regard` has no inherent value (it is read through the speaker, §5.5). The party volume cites this table and never re-specifies it.

### 6.2 The two lenses (`readDeed`)

**The holder's coordinates** (one read per holder kind, all landed): a TOWN — `settlementAlignment(item, worldState)`; a PERSON — the person lens `{ lawfulness01, malice01, aggression }` from the declared alignment, else the seeded `npcStates[...].alignment`, else `TRAIT_ALIGNMENT` / `TRAIT_AGGRESSION` (the logic of `warSeatBooks.js :: rulerAlignment`, which is MODULE-PRIVATE today: RN-3's car-0 moves it to a leaf `renown/personLens.js` that `warSeatBooks.js` re-imports, byte-identical); a BODY — its ruler's person lens.

**Lens one — what the act is:** `act = a·(kind01 − ½)·(1 − 2·malice01) + b·(law01 − ½)·(2·lawfulness01 − 1) + c·(force01 − ½)·(2·aggr01 − 1)` (DRAFT a 1.0, b 0.5, c 0.4): good holders approve kindness and condemn cruelty; evil holders shrug at kindness and may admire cruelty; lawful ones weigh law and backing; a warlike town admires a brutal victory a peaceful one condemns. **Lens two — whom it helped or hurt:** for each actor the deed helped or hurt (its target and, for relief, the relieved town; for the pair kinds, both sides), `ally = Σ ± net(holder's regard of that actor) × magnitude/3` (helping a friend or hurting a rival is warm; helping a rival or hurting a friend is a grudge). **Personality sets the mix:** `reading = (1 − μ)·act + μ·ally`, with μ from the holder's character (DRAFT): μ 0.7 for the flaws `pride`, `vengeance` and the traits weighted spiteful/proud in `TRAIT_AGGRESSION`; μ 0.3 for the ideals `mercy`, `faith`, `justice` and the magnanimous/devout traits; 0.5 otherwise and for towns.

**The owner's rule, by construction:** when lens one is ≥ 0 and the holder is not `malicious` (`malice01` < 0.67), lens two may cancel the warmth a good act earns but may not turn it into a grudge — the rival grumbles (a felt line about its enemy being helped, with no grudge term); a `malicious` holder's lens two stands, and the grudge is kept. **The deed's parts:** where the version heard lost its reason or backing (PT-4's thresholds), lens one reads the act ALONE (the orphanage three towns over); where heard, PT's backing softens a villainous-looking act toward excusable inside the backer's reach and amplifies a good one, and the doer's credibility weight (§7) scales how far a told reason is believed. **The result** is one term `{ sign, sev ≤ DRAFT 0.4 per deed, cause: heard_deed }` for the holder's regard of the doer — and of the backer, who shares the credit and inherits the grudges (PT's "shared ownership", read here as a second term of half weight, DRAFT).

**Clock:** the reading is taken at hearing (weekly). **Receipt / felt sentence:** "Varn's lords curse your name for saving their rivals; their people do not." **Surface / scrutiny / machinery:** the place's verdict in words; on scrutiny which lens carried it ("they are Kell's rivals"; "they thought it cruel"); coordinates, μ and weights on intent.

---

## §7 CREDIBILITY (RN-1, the party's holder; the other three homes untouched)

The party's word is trusted or doubted by ONE holder `spatialLedgers.party.credibility = { score, lastUpdateTick }` riding the landed person law verbatim: a KEPT pledge adds `TRUE_RISE · mag`, a REACHABLE BROKEN pledge or a reason EXPOSED as false subtracts `LIE_FALL · mag` (`NPC_CREDIBILITY_TUNING`: 0.6 / 6.5 — "personal trust dies faster than a court's"), decayed by `decayedNpcCredibilityScore` (`HALF_LIFE_TICKS: 52`, spent past `MAX_LOOKBACK_TICKS: 260`), weighted by `npcCredibilityWeight` (neutral ⇒ exactly 1.0). **The writer** is the PARTY DOOR (PT's pledge verdict and exposure), never the dark statecraft mover — so the party's credibility lives wherever `renownEnabled` and PT's flag are lit, independent of `infoStatecraftEnabled` (R2 R-5). **The words** reuse `TESTIMONY_CREDIBILITY_BANDS`: weight ≥ 1.08 `trusted`, ≥ 0.9 `ordinary`, ≥ 0.6 `doubted`, else `discredited` (DRAFT). **Readers:** the hearers' belief of a reason the party told (§6.2), an actor's willingness to accept "later" (PT), the truth chasing a rumor (PT). It never merges with fame or regard (RN1). A paragon's credibility is the landed `npcCredibility` holder for its `wnpc_` (lit where `npcCredibilityEnabled` is); a court's is the landed stock. **Felt sentence:** "In Tolle they say the party's word is worth little since they never came to Ashford."

---
## §8 THE ARMS — what each world gets (requirement 17; RULINGS-AFTER-RESEARCH §7)

| World | Fame | Regard | The version heard | Persons |
|---|---|---|---|---|
| the default `realistic_regional`, and `quiet_local`, `static_campaign`, `narrative_campaign` (infoMode omniscient — no rumor road) | THE OMNISCIENT ARM: every deed known at once inside its projected scope; office fame | derived on read from the deed ledger through the lenses (towns, courts, the party as subject) | the deed itself (no mutation) | dark until `npcConsequencesEnabled` lights (C1's unit) |
| `dramatic_campaign`, `living_realm` (perfect_delayed, canonized map) | the delay applies (`hopDelayTicks`) | persisted heard terms (⛔ RN-S1's host) — the road's own arrival | the whole tale, late (completeness stays 1.0) | as above |
| `full_simulation` (full, canonized map) | as above | persisted heard terms | the WEATHERED version (PT-4's parts fall away in the fixed order); a correction replaces | as above |
| any aspatial world | no delay (no digest) — the omniscient arm | derived | the deed itself | as above |
| `npcConsequencesEnabled` dark (every preset today) | office fame for roster persons; deeds only for actors with a key (the party; graduated persons once lit) | towns and courts (bodies through the ruler's lens); no officer differs from its court | — | no person keys (RN16) |

THE PAID TIER: renown is part of the simulator, which is premium (requirement 24(e); OD-FC-43): no free-tier arm.

---

## §9 THE VOICES (RN-4)

- **The dossier** (requirement 6's round trip): each town's page gains a "Known here" block under the party lens's and the court page's toggles — who is known in this town and for what ("the ones who broke the siege at Kell"), and how the town and its court take them ("the commons speak well of them; the Watch Captain does not") — in the world's words, the reason one click deeper, bands only on intent. A person's page shows where they are known and their ties with reasons ("an old enmity with Merewick's crown, since the burning of Tolle").
- **The Why panel and the cause walk** (C0.5): every regard term and every fame entry carries `causedBy` to its deed, and a voiced deed to the regard that voiced it, so the generic walk renders "why does Varn hate the party?" two hops deep (requirement 20; THE LEGIBILITY PIN).
- **The Herald:** one registered kind, `voiced_regard` (routing, voice pool, rumor phrase, the kind-registration freezes `KIND_REGISTRATION_FREEZES` +1 — R2 Q9); fame and regard changes themselves are CHRONICLE lines, never pushed (the push budget, chair notes item 2); the deed's own news is PT's/CH's.
- **The Evidence Law:** who, which power, what effect — "The High Priest of Kell, held in esteem across the river towns, has condemned the party; Kell's faithful have cooled toward them." Never a forecast; never a numeral; never a mechanism name.

---

## §10 THE HOSTS AND THEIR CARS (the mount rule, measured — `cure/L-RN-probe/effectiveLines.out.tsv`)

| Host | Eff. lines | RN's lines | Car |
|---|---|---|---|
| `pulseKernel.js` · `applyWorldPulse.js` · `warTermination.js` | 1581 · 907 · 818 frozen | **0** | — |
| `generosityKernel.js` · `armyTransitKernel.js` | 800 · 798 | **0** | — |
| `partyImpact.js` (PT's door) | 327 | ≈ 3 (one `mintDeed` call) | none needed |
| `rumorNetwork.js :: advanceRumorLedgers` | 364 | ≈ 4 (one call to `renown/deedTelling.js`) | none needed |
| `envoyPulse.js :: advanceEnvoyDiplomacyPulse` (RN-S1's measured alternative) | 332 | ≈ 4 (the pre-gate pass) | none needed — ⛔ the chair rules |
| `npcVerdictTable.js` (the verdict writer) | 262 | ≈ 3 | none needed |
| `npcCirculationBelief.js :: believedReputation` + `npcLedgerProjection.js` (the notoriety projection's two chokepoints) | 79 · leaf | ≈ 2 each | car-0 of RN-2 measures that every reader routes through one of the two (PLAUSIBLE until measured) |
| `espionageMath.js :: operativeNotoriety01` | 163 | ≈ 3 | none |
| `religiousContest.js :: advanceReligionStates` | 493 | ≈ 3 | none |
| `warSeatBooks.js` | 492 | −≈ 20 (the person lens moves out) + 1 import | RN-3 car-0: `renown/personLens.js` extracted leaf-first, `warSeatBooks.js` byte-identical in behaviour |

Every RN module is a new leaf under `src/domain/renown/` (`deedLedger.js`, `deedTelling.js`, `fame.js`, `regardLedger.js`, `regardHeard.js`, `courtRegard.js`, `actOffice.js`, `inherentValue.js`, `personLens.js`, `partyCredibility.js`, `renownLeans.js`), each far under 800, each opting into the walkers that govern `src/domain/` (R2 hazard: a new file opts into every walker of its directory).

---

## §11 THE HEARINGS

RN owns NO engagement kind and registers no row in the engagement registry (fold §3.4): it is a read model and a ledger of facts. Its reads appear ON other programs' cards — the acting officer and that officer's reason (§5.2), the requester's fame-born motive (PT's call board), a champion's regard (CH) — and never decide a card's default. Requirement 24's three choices therefore do not apply to anything RN mints; the DM's hand over renown is §5.6's verbs, available any week. **Long advances (requirement 24(c)):** a month, season or year advance runs the heard pass every tick inside the span (in the hosts the chair rules), decays by age, and mints voiced deeds where crossings occur; nothing queues and nothing waits for the DM; the party's default ("nothing has happened to the party yet") is untouched because RN never acts on the party.

---

## §12 THE FLAGS (virtual; absent-when-dark; read `=== true`; each with its certification row and lit-mutant pins)

[REFINED 2026-10-17 (fp-final) — the brief named one flag; the leans that move other programs' numbers are split onto a second flag so the reads and the store can light where the leans' same-seed shift has not been signed.]

| Flag | Gates | Host flags | May light in |
|---|---|---|---|
| `renownEnabled` | the deed ledger and its mint, the deed's telling arm, fame and regard reads, the regard ledger and the heard pass, the DM's verbs, the dossier blocks, the party's credibility law, the ransom projection | PT's `partyEnabled` (party deeds), CH's flag (paragon deeds), `npcConsequencesEnabled` (person keys and `npc_verdict`), a spatial digest ∧ a non-omniscient infoMode (the road arms) | every world-alive preset incl. the default (its derived arm is aspatial-safe and display-side: the deed telling seeds rumors only where a road exists) — lighting is a disclosed same-seed shift where a rumor road exists (deeds now seed it) and a display shift elsewhere |
| `renownLeansEnabled` | the priest's lean (§5.4), the operative re-point (§4.5), the notoriety projection into the gate (§4.4), voiced regard (§5.5) | `renownEnabled`; the faith local lane (deity worlds); ES (`espionageActive`); `npcConsequencesEnabled` | where each host is lit; a signed same-seed shift at its unit |

**Certification rows:** both virtual keys enter the simulation-rules manifest dark, with the absent-when-dark pin. **Lit-mutant pins:** (1) both dark ⇒ byte-identical on every golden seed; (2) `renownEnabled` lit with NO deed and NO DM seed ⇒ byte-identical (nothing is minted, nothing derives — the null world); (3) dark-after-lit ⇒ the ledgers kept, every read inert, every lean returns its host's identity; (4) `renownLeansEnabled` without `renownEnabled` ⇒ refused (reads `renownEnabled` first). `hearingWeekEnabled` is not a host flag (§11).

---
## §13 THE WAVES (every wave: leaf modules · hosts · FIRST-VISIBLE · TIER · DEGRADED ARM · EDITOR (seal · direction row · counterparty · states at the chokepoint · the cause) · Alignment · `causedBy`)

A coherence chain **C11 · THE RENOWN** (fold §6, at P4): it precedes C12 THE CHAMPIONS and C13 THE PARTY because both read it (chair notes item 6). Its first felt chain is RN-0 → RN-1 → RN-3: the DM records a deed, the witness towns know it that week, and a rival town's lords curse it while its commons approve.

**RN-0 — THE DEED AND FAME.** Leaves `renown/deedLedger.js` (`mintDeed`, `strikeDeed`, `projectScope`, the normalizer naming every field incl. PT's), `renown/deedTelling.js` (the deed arm of `advanceRumorLedgers`), `renown/fame.js` (`fameOf`, `fameIn`, `OFFICE_SCOPE`). Hosts: `partyImpact.js` (+3, the first `DEED_SOURCES` row; PT's door), `rumorNetwork.js` (+4). Pins: two removals in one settlement mint two deeds and two tellings (R2 hazard 6, negative case); a struck deed counts nowhere; a deed minted dark is never minted; `projectScope` is deterministic over a codepoint-shuffled graph; a realm deed reads realm about two and a half years and then regional. FIRST-VISIBLE: the week of the deed — the witness town's dossier "word of the deed at Kell goes out along the river road" (requirement 16). TIER: aspatial-safe (the omniscient arm); the road arm on a canonized map with a belief infoMode; party deeds need PT's `partyEnabled`. DEGRADED ARM: aspatially and in the omniscient presets, known at once inside the projected scope. EDITOR: seal — `STRIKE_DEED` (and unstrike) · direction row — the DM's deed record (PT's door) · counterparty — `real-only` (a deed's target is a real actor) · states at the chokepoint — `deedLedger.js` is the only writer · the cause — the DM's act or the engine verdict. Alignment: READ — the deed records the act; its moral read is RN-3's (alignment-empty here, by design: fame is not judgment). `causedBy`: each deed names its source act (the party impact's command, the verdict).

**RN-1 — THE REGARD IDIOM (the one writer; credibility; the ransom projection).** Leaves `renown/regardLedger.js` (the entry, the ladder, decay, the cap, `SET_REGARD` / `DECLARE_STANCE` and their inverses), `renown/regardHeard.js` (`advanceHeardRegard`), `renown/partyCredibility.js` (the holder's law; its writer is PT's door), the `ransomRegardBand` projection. Hosts: ⛔ RN-S1 — the envoyPulse pre-gate pass (+4) or the fallback (no host). Pins: one deed moves one holder once per version (a correction replaces — negative case: re-hearing the same version adds nothing); an emergent term decays to indifference and an authored one to its declared band; the thirteenth subject drops the weakest; the party never holds an entry (refused at the writer); `dmSet` wins until lifted and survives reload; the ransom projection's three rows. FIRST-VISIBLE: the week a tale reaches a town — its dossier's "Known here" line in that town's voice. TIER: towns and courts in every world-alive preset (derived); persisted heard terms where a rumor road exists; persons need `npcConsequencesEnabled` (C1). DEGRADED ARM: derived everywhere (the fallback). EDITOR: seal — `SET_REGARD`, `DECLARE_STANCE` · direction row — the DM's allies-and-enemies list · counterparty — `real-only` · states at the chokepoint — `regardLedger.js` alone writes `spatialLedgers.regard` · the cause — the deed heard or the DM's act. Alignment: READ (the lenses, RN-3). `causedBy`: each term names its deed; each DM set names the DM act.

**RN-2 — THE COURT'S DERIVED REGARD AND THE OFFICE OF THE ACT.** Leaves `renown/courtRegard.js` (`courtRegardOf`; faction and creed bodies), `renown/actOffice.js` (`ACT_OFFICE`, `actingOfficer`, bounded graduation of officers), the notoriety projection (`notorietyProjection`) and its two chokepoints, and the `npc_verdict` deed source in `npcVerdictTable.js` (+3; the verdict mints a deed instead of stamping the facet, RN4). Car-0: measure that every `notorietyBand` reader routes through `believedReputation` or `npcLedgerProjection` (else a third chokepoint is named, never a scatter). Pins: a succession replaces the ruler's term the same week (the court's stance moves with its people); a court whose officers never heard of the party is indifferent; the institutional record reads only deeds whose target is the court; no court opinion field exists anywhere (a source-scan pin); graduation touches at most the ruler and the `ACT_OFFICE` holders. FIRST-VISIBLE: the next card an officer makes (PT/CH) names the officer and the reason — or, with no card, the court page's "the Watch Captain does not forget the riot". TIER: aspatial-safe; officers distinct from the court only with `npcConsequencesEnabled`. DEGRADED ARM: the court through its ruler's lens alone. EDITOR: seal — `SET_REGARD` on a body sets its baseline · direction row — the DM may direct an officer through the owning program's verbs · counterparty — `real-only` · states at the chokepoint — derived (no writer) · the cause — the members' terms and the record. Alignment: READ (the ruler's lens). `causedBy`: an officer's card names the officer's term.

**RN-3 — INHERENT VALUE AND THE TWO LENSES.** Car-0: extract `renown/personLens.js` from `warSeatBooks.js :: rulerAlignment` leaf-first (byte-identical behaviour; the export the person and court lens need) and measure aggressiveness's range for the declared normalizer. Leaves `renown/inherentValue.js` (the twelve-row table and its registration door for PT/CH/verdict rows; the condition-valence read, measured at the car), the lenses inside `readDeed`. Pins: THE OWNER'S RULE — a good rival reading a good act that helped its enemy grumbles and holds no grudge, an evil rival keeps it (both negative cases); the orphanage without its reason reads as cruelty, with its reason and backing inside the backer's reach as excusable; an ambiguous act is neutral until marked; the DM's `moralWeight` replaces the derived band for every reader; a warlike town admires a brutal victory a peaceful one condemns. FIRST-VISIBLE: the same week as RN-1 (the reading is what the town's line says). TIER: aspatial-safe. DEGRADED ARM: none needed. EDITOR: seal — PT's `moralWeight` mark · direction row — none · counterparty — `real-only` · states at the chokepoint — derived · the cause — the deed's kind and target. Alignment: THE ENGAGEMENT — all three axes, both lenses (requirement 13's quadrant read). `causedBy`: the term names the deed and the lens that carried it.

**RN-4 — THE VOICES.** The dossier blocks, the person page's ties with reasons, the Why panel's renown rows over `causedBy`, the `voiced_regard` Herald kind (registered at every wall), voiced regard and the condemner's cost (§5.5; `renownLeansEnabled`), the priest's lean and the operative re-point (§5.4/§4.5; `renownLeansEnabled`). Pins: no felt sentence carries a numeral or a mechanism name (the prose walker); every pushed line resolves ≥ 1 hop in the walk (the legibility pin); a voice never mints a voice (depth one); the condemner's town cools only when the deed was good on its face and did not harm the condemner. FIRST-VISIBLE: the dossier and the Why panel at once; a voice the week the crossing happens. TIER: aspatial-safe; the priest lean in deity-bearing worlds; the operative where ES is lit. DEGRADED ARM: dossier lines without voices. EDITOR: seal — none new · direction row — none · counterparty — `real-only` · states at the chokepoint — the voice is a deed (RN-0's writer) · the cause — the crossing. Alignment: READ (the condemner's people's malice). `causedBy`: a voice names the regard term that crossed.

**RN-5 — THE MEASURE.** Envelopes on a seed family per lit preset: regard entries per holder (≤ cap), deeds per campaign-year, the share of deeds that reach `regional`/`realm`, the fame half-life felt (how long a realm deed stays realm-known), voices per year (bounded), the court-vs-officer divergence rate once persons light, the heard pass's cost per tick; the experience read (requirement 19) on C11's chain sentence. FIRST-VISIBLE: none — instrumentation, and it says so. Every DRAFT constant goes to the FP-46 roster with its measured spread.

| Wave | Leaf modules | Hosts (eff. lines → +RN) | FIRST-VISIBLE | TIER | DEGRADED ARM |
|---|---|---|---|---|---|
| RN-0 | `deedLedger`, `deedTelling`, `fame` | `partyImpact` 327 → +3 · `rumorNetwork` 364 → +4 | the deed's week (witness dossiers) | aspatial-safe; road arm on canon + belief infoMode | known at once in scope |
| RN-1 | `regardLedger`, `regardHeard`, `partyCredibility` | ⛔ RN-S1 (`envoyPulse` 332 → +4, or none) | the tale's arrival week | towns/courts everywhere; persons C1 | derived everywhere |
| RN-2 | `courtRegard`, `actOffice`, notoriety projection, the `npc_verdict` source | `npcCirculationBelief` 79, `npcLedgerProjection` (+2 each; car-0) · `npcVerdictTable` 262 → +3 | the next officer's card | aspatial-safe; officers with persons lit | ruler's lens only |
| RN-3 | `personLens` (car-0), `inherentValue` | `warSeatBooks` 492 → −20 | with RN-1 | aspatial-safe | — |
| RN-4 | dossier, Why rows, `voiced_regard`, `renownLeans` | `religiousContest` 493 → +3 · `espionageMath` 163 → +3 | dossier at once; voices at crossing | aspatial-safe; leans where hosts lit | lines without voices |
| RN-5 | envelopes, experience read | — | none (instrumentation) | lit presets | — |

---
## §14 THE LIFECYCLE OF EVERY PERSISTED SHAPE (requirement 22a)

**The deed — `spatialLedgers.deeds[deedId]`**

| Path | What happens |
|---|---|
| create | only `deedLedger.js :: mintDeed`, called by a registered `DEED_SOURCES` door; idempotent; refused dark |
| read | fame, the observer read, the lenses, the deed telling, the court's institutional record, the dossier, the Why panel |
| persist | rides the world blob inside `spatialLedgers` (zero first-paint bytes when absent); the normalizer names every field (the `normalizeEntry` lesson: an unnamed field is dropped) |
| regenerate | world-scoped, keyed by ids, untouched by a settlement reroll; a target that was a positional roster NPC is carried by its `wnpc_` or its name, never by `npc_N` (the `characterDrift` rebind lesson) |
| undo | the DM's `STRIKE_DEED` (a `struck` mark — the party door has no undo, `undoState:'none'`); an engine week is undone by the pulse's own snapshot restore, which drops the week's mints with it |
| import | the normalizer heals garbage to absent ("total on garbage") |
| migrate | an additive conditional key: no `WORLD_STATE_MIGRATIONS` entry (the additive-key rule) |
| dark-after-lit | kept, unread; nothing mints |
| death | the doer's or target's death leaves the deed standing (lived history); names resolve at read |
| veil | the deed is TRUTH (the DM's view shows it whole); every town sees only the version that reached it (§4.3, §5.1) |
| horizon (requirement 23) | APPEND-ONLY, never pruned (lived history, the `concludedWars` idiom). Measured rate owed at RN-5 (deeds per campaign-year); a deed is ~200 bytes plus a `reach` map of ≤ 64 hops; at a DRAFT ceiling of 200 deeds a year a century is ~20,000 records — RN-5 measures the real rate and, if the blob cost demands it, the chair rules a COMPACTION that keeps every deed's facts and drops only `reach` for deeds whose fame has decayed to `unknown` (never a deletion; recorded as an open row, OD-RN-14) |

**The regard entry — `spatialLedgers.regard[holderKey][subjectKey]`**

| Path | What happens |
|---|---|
| create | the DM's verbs (`dmSet`, `declared`); the heard pass's `writeHeardTerm` (⛔ RN-S1's host); PT's meeting deed read at the table |
| read | `regardOf`, `courtRegardOf`, the officers' cards, the dossier |
| persist | blob; drop-when-empty at both levels |
| regenerate | person keys are `wnpc_` only (RN16); town and court keys are settlement ids, stable across rerolls |
| undo | a struck deed's terms drop at the next normalize; DM verbs have inverses; the engine week by snapshot |
| import | normalizer; terms > 8 truncated weakest-first; unknown causes dropped |
| migrate | additive; none |
| dark-after-lit | kept, unread; no term written |
| death | a holder's death (the DM's `killNamedNpc` → `removeNpcRecord`) drops the holder's entries with it; entries ABOUT the dead stay until they decay (the dead are remembered) |
| veil | entries are BELIEF (what each holder heard); the DM's view may show the whole |
| horizon | bounded: ≤ 12 subjects × ≤ 8 terms per holder; terms decay to nothing on `a_few_years` and are pruned below DRAFT 0.02 |

**The party's credibility — `spatialLedgers.party.credibility`** (the sub-ledger is PT's; this holder's lifecycle is RN's)

| Path | What happens |
|---|---|
| create | the party door's first kept or broken pledge, or an exposed false reason |
| read | `partyCredibilityOf` |
| persist | blob, inside PT's sub-ledger |
| regenerate | world-scoped; untouched |
| undo | undoing the party's answer unwinds its pledge and the credibility charge with it (PT) |
| import | normalizer (finite score, integer tick) |
| migrate | additive; none |
| dark-after-lit | kept, unread |
| death | n/a (the party's fate is the table's) |
| veil | a town reads the party's credibility through the deeds it heard (a broken pledge it never heard of does not lower its trust) — the holder is the world's widest knowledge, the town's view is §4.3's test over the pledge deeds |
| horizon | one holder; spent past `MAX_LOOKBACK_TICKS: 260` |

---

## §15 THE SCENARIO MATRIX (each row a measurable assertion, or DARK)

| # | World | Assertion |
|---|---|---|
| R1 | both flags dark, any seed | byte-identical to master on every golden seed |
| R2 | `renownEnabled` lit, no deed, no DM seed | byte-identical (the null world) |
| R3 | default preset; the party resolves Kell's plague (magnitude 1) | one deed; witnesses = Kell (+ presence); `projectedScope` ≥ `regional` when Kell has trade neighbours; Kell's dossier "Known here" names the party the same week |
| R4 | the same deed, R3's world, Varn (Kell's rival, ruler `balanced`) | Varn's court reads ≥ `indifference` toward the party (it grumbles; no grudge term) |
| R5 | as R4 but Varn's ruler `malicious` | Varn's court holds a grudge term (`heard_deed`, reason "they saved Kell") |
| R6 | two `remove_npc` deeds in one settlement in one week | two deed ids; two tellings (no merge) |
| R7 | the DM strikes R3's deed | fame and every regard term from it vanish next read; the record stays with `struck` |
| R8 | `full_simulation`; the orphanage burned with backing and a told reason; a town four hops out | the version heard lost the reason; the town reads the act alone (a grudge, cause `heard_deed`); a correction later heard REPLACES the term (one term, not two) |
| R9 | `dramatic_campaign`; a town three hops out | the regard term appears the week the tale arrives on the road, not before |
| R10 | aspatial world | every deed known at once inside its scope; no `hopDelayTicks` |
| R11 | a realm deed, year 0 → year 3 → year 11 | fame `realm` → `regional` → `settlement` (the DRAFT pace) |
| R12 | the DM declares Merewick's crown an `enemy` of the party; no deeds | Merewick's court reads `enmity`; it never decays below its baseline; lifting the declaration returns indifference |
| R13 | `dmSet` adoration, then a villainous deed heard | the band stays `adoration` until the DM lifts the set; terms accrue underneath |
| R14 | a court's ruler succeeded | the court's derived regard moves the same week to the new ruler's terms |
| R15 | persons lit; a welcoming court with a Watch Captain at `enmity` | `actingOfficer(…, 'arrest')` returns the Watch Captain with his reason |
| R16 | a holder hears 13 subjects | the weakest drops; ≤ 12 kept |
| R17 | a realm-famous High Priest crosses into `hatred` of the party | one `condemnation` deed; hearers who esteem her cool toward the party; no second voice from any hearer (depth one) |
| R18 | she condemns a heroic deed that did not harm her; her town's malice < 0.67 | one `condemned_a_good_deed` term from her town toward her |
| R19 | the party keeps one pledge, breaks one reachable pledge | credibility rises 0.6·mag, falls 6.5·mag; band words follow the weight |
| R20 | a home court whose officers hold its captured officer at `indifference` | `ransomRegardBand` = `valued` |
| R21 | persons lit; a spy whose deeds reached the target court | `operativeNotoriety01` > its office-only value; equal when nothing reached |
| R22 | a month advance after a deed | the heard pass runs each tick of the span; nothing queues; no card is minted by RN |
| R23 | the party as a holder | refused at the writer (RN10) |
| R24 | a menace | never a regard key |
| R25 | the default preset, persons dark, a court | the court still feels (ruler's lens over heard deeds); no officer differs |

---

## §16 THE RULINGS (by delegation under the 2026-10-16 and 2026-10-17 words, vetoable; the owner's own words are marked)

| Row | The question | Ruling |
|---|---|---|
| OD-RN-1 | The token | `renown` for the volume, the module directory and the flags (`renownEnabled`, `renownLeansEnabled`) |
| OD-RN-2 | Four facts (the owner's "reputation awareness … contribute and conflict") | fame · regard · credibility · legitimacy, never merged (RN1); renown never writes legitimacy or a court's credibility |
| OD-RN-3 | Who carries renown ("appropriately applied to all of the other NPC's" · "also for the court NPC as well" — THE OWNER'S) | every person by office; deeds for every actor with a key; court members with their own regard once persons light; the party as subject only |
| OD-RN-4 | The store | the deed ledger `spatialLedgers.deeds` (a persisted shape), append-only, minted ids, `struck` and `correctsRef`; RN owns it, PT and CH write through it (R-RN-9) |
| OD-RN-5 | Fame's reach | projected scope frozen at mint (RULINGS-AFTER-RESEARCH §5, replacing "peak reach observed"); fame's band is the scope ladder `unknown · settlement · regional · realm` (R-RN-2) |
| OD-RN-6 | Fame's pace | `a_decade` with rounding (R-RN-3) — DRAFT, UNMEASURED, FP-46 |
| OD-RN-7 | One fame | the notoriety facet folds by projection; the verdict becomes a deed source; the operative read re-points (RN4) |
| OD-RN-8 | Regard's home (a persisted shape) | ONE ledger `spatialLedgers.regard[holderKey][subjectKey]`, persisted only for seeds, DM sets and the version heard (R-RN-5); bodies derived (RN7) |
| OD-RN-9 | The regard ladder | `hatred · enmity · mistrust · indifference · fondness · esteem · adoration` (R-RN-1) |
| OD-RN-10 | The ransom band | a projection of the home court's derived regard (R-RN-4) |
| OD-RN-11 | Offices | `ACT_OFFICE` over `INSTITUTION_ROLES` and `rulerId`; no new office; bounded graduation (R-RN-11) |
| OD-RN-12 | Inherent value and the lenses (the owner's §8 words — THE OWNER'S) | the twelve-row table; the two lenses; personality's mix; the owner's rule by construction; ambiguous ⇒ neutral; the condemner's cost on regard only |
| OD-RN-13 | Opinion leaders | depth-one voiced deeds, cooled once a year per pair (R-RN-6) |
| OD-RN-14 | The deed ledger's horizon | append-only; a `reach`-only compaction of fully forgotten deeds is the chair's to rule after RN-5's measured rate (never a deletion) |
| OD-RN-15 | The party's credibility (a persisted holder) | on PT's sub-ledger with the landed person law; written by the party door; the testimony credibility words |
| OD-RN-16 | The party's own regard | none (RN10, R-RN-7) |
| OD-RN-17 | The flags | two (the leans split, §12) |
| OD-RN-18 | The regard writer's host | ⛔ RN-S1 — the chair rules: envoyPulse pre-gate pass (recommended, measured) or no persisted heard terms |
| OD-RN-19 | Draft constants: the subject cap 12; terms ≤ 8; band edges ±0.1/±0.35/±0.65; per-deed severity ≤ 0.4; the backer's half term; the lens weights a 1.0 · b 0.5 · c 0.4; μ 0.3/0.5/0.7; the inherent-value table's numbers and band edges; scope threshold 60%; `reach` cap 64; the significance rule; the voice factor 0.5 and +1 hop; the condemner's 0.1; the priest's 1.15; `FAME01`; the credibility band edges; the regard half-life `a_few_years` | DRAFT rows, each UNMEASURED (requirement 18), on the FP-46 end-of-program roster for the owner's signature (THE PROMISE) |
| OD-RN-20 | Where RN sits | coherence chain **C11 · THE RENOWN**, before C12 and C13 (chair notes item 6) |

---

## §17 WHAT A DM READS (under the Evidence Law: who, which power, what effect; deeds, never forecasts)

- "Known across the river towns as the ones who broke the siege at Kell." *(surface; fame and its deed)*
- "In Varn the lords curse the party's name for saving Kell, their old rival; the commons say it was well done." *(surface; the two lenses, two holders)*
- "In the hill towns they say you burned an orphanage; they have not heard why." *(surface; the version heard — scrutiny shows where the reason was lost)*
- "Kell's Watch Captain, who has not forgotten the riot in the square, has posted men at the gate." *(surface on an officer's card; the officer's own reason)*
- "Merewick's crown counts the party among its enemies." *(the DM's declared stance, in the world's words)*
- "The High Priest of Kell, held in esteem across the river towns, has condemned the party; Kell's faithful have cooled toward them." *(a voice and its echo)*
- "Ashford's people grumble that their lord spoke against the ones who lifted the plague." *(the condemner's cost)*
- "In Tolle they say the party's word is worth little since they never came to Ashford." *(credibility, from a broken pledge heard)*
- "Captain Vey and Merewick's crown have been at odds since the burning of Tolle." *(a tie with its reason, on a person's page)*
- "Few outside Kell remember the siege now." *(fame faded — said only when looked at, never pushed)*

Every line names who and what was done; bands, weights and the half-life wait for an intentional look.

---

## §18 THE STOPS, THE REFINEMENTS AND THE OPEN QUESTIONS

| Id | What | Receipt | Slot / who rules |
|---|---|---|---|
| ⛔ RN-S1 | The persisted regard writer cannot live inside the rumor stage | `pulseKernel.js`: `memoryState = setSpatialLedger(memoryState, 'rumorLedgers', rumors.next);` (only `rumors.next` is persisted) | the chair: envoyPulse pre-gate pass (the ENC-3 precedent; +4 lines in a 332-line host) or no persisted heard terms |
| ⛔ RN-S2 | The general's renown lean | the generals design is branch-only and unbuilt; `armyTransitKernel.js` 798 | C4 THE GENERALS CHAIN |
| ⛔ RN-S3 | The councillor arguing at council | INT's counsel unbuilt, bloc-level, `settlementPoliticsEnabled` dark (J-INT-12) | C4 (INT carried) |
| ⛔ RN-S4 | The envoy's opened doors | the errand spine lit nowhere (`errandSpineEnabled`); seam `pactFormation.js :: reserveFor` | C1 THE STATECRAFT BAND |

REFINED (each marked in place): R-RN-1 the regard ladder · R-RN-2 fame's band is the scope ladder · R-RN-3 fame's `a_decade` pace · R-RN-4 the ransom mapping · R-RN-5 persisted only what derivation cannot reproduce · R-RN-6 depth-one voices · R-RN-7 the party never holds regard · R-RN-8 one derivation for every body · R-RN-9 RN owns the deed ledger · R-RN-10 the operative re-point · R-RN-11 bounded graduation of officers · R-RN-12 the verdict as a deed source · the second flag (§12).

OPEN FOR THE CHAIR: (1) RN-S1's host; (2) the deed ledger's ownership by RN (PT compiles after RN and cites it); (3) OD-RN-14's compaction, after RN-5's measurement.
