# FP ARCHITECTURE — THE SITES (`ST`): forts, towers, shrines and dens on the land, and what they do to the towns they are attached to

## Chair session a73343ed (Fable 5.1); compile seat L-ST (Opus 5.5), 2026-10-18.
## Compiled on the owner's word; DARK behind four virtual flags; nothing scheduled.
## Bound by the FP constitution's requirements 1–24 (`DESIGN_FP_SPINE.md` §1; 15–24's text of record is `DESIGN_FP_COHERENCE_FOLD.md` §1) and by the fold.
## `[REFINED 2026-10-18 (fp-final) — what; why]` marks an adjustment beyond the brief (the owner's word of 10-17 ~19:2x: "also mark and make appropriate adjustments in areas you see for refinement"); `⛔ STOP-ST-n` marks a ruling that cannot be built as written at master `81f1cd963` (the compile log `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/L-ST.md`).

> **Status: COMPILED, DARK, NOT SCHEDULED.** First attack by the round-2 skeptic and the seams skeptic. The persisted shape (`spatialLedgers.worldSites`) is taken BY DELEGATION on the owner's own request (OD-ST-1) and is the host half of the map builder's asked world-site record (ENC-HL-01..03, V14 Q2; the owner's "i told the mapmaker i do as it suggested", 2026-10-18 05:57). Two STOPs (§13). Every constant is DRAFT and UNMEASURED on the FP-46 roster.

---

## THE OWNER'S WORDS, VERBATIM (2026-10-18)

1. (~01:1x) "and a fort or otherwise occupied fortification, occupied by military or a settlement, corresponding to their funding and quality, increase the internal secruity of said related terriotry (or territories) that it is attached to directly. the opposite if it becomes a \"den of thieves\" also for the other options such as IDK a lone wizard tower or anything else that makes sense (i defer judgement to you) if occupied provide other benefits, such as increased magical support for example. THe bonus they apply correlates to appropraite attached neighbor/settlement and distance. What are your thoughts?"
2. (~01:2x) "if they are not occupied or taken by forces not tied toa settlement, then their negative effects are general if that makes sense. noone gets bonuses but everyone gets varying degrees of negative. Of course if it was previously occupied, the prefernce is whoever is the last owner to take action. these areas can also simply be abandonded due to lower prosperity, traded between settlements along with their surroudnig terriotry, conquered via siege (same as settlemetns) by a hostile power, or whatever other reasoanble action."
3. (~01:3x) "also if a settlemetn is created over a site but the settlement fails the site still persists"
4. (~01:4x) "now of the closed catalogue, what are your thoughts to their effects and statuses? let's think about it all"
5. (~01:5x) "also what about in defense for a settlement. a fortification, if left unscathed and ready, will drastically increase the defense score and defensibility of a town if it is under siege."
6. (~02:0x) "and make sure that appropairet counterparts for the others where appropraite for other functions of a settlement."
7. (~01:0x) "btw empty doens't have any negative or positive effects."
8. (~01:1x) "and make sure that sites are considered in all risks, military strategieis, travel strategies, safety, basically everything that would happen on FP that is appropriate."
9. (~01:4x) "well they have no purpose or destiny unless directed by the user, but if left alone, then absolutely correct. by the way, menaces are DM authored only, never organically emergent."

And the doctrine every FP volume now carries (~01:31): "and remember, this does not compete with the campaign, it just provides a living world to host a campaign and story in it."

## THE ANSWER, IN ONE PARAGRAPH

A SITE is a place on the land outside a town — a keep, a watchtower, a mage's tower, a shrine, an inn on the road, a bridge, a mine, a hospice, a harbour mole, a barrow. The DM places it (or adopts one the map offers) and names it; the engine never invents one. Whoever HOLDS it decides what it does: a town's paid garrison in a sound keep makes the towns near it safer, harder to besiege and quicker to hear trouble; the same keep held by brigands or a DM's menace makes every town near it less safe; an EMPTY site does nothing at all. Every benefit is bought with upkeep and shrinks with distance and neglect; every hazard grows with the strength of whoever squats there. Sites change hands the way towns do — abandoned when the money runs out, traded with their land, ceded in a peace, granted as a fief, taken by siege, cleared by a sortie or by the party — and the last town that cared for a site gets the first chance to take it back. A site outlives the town built over it. Nothing a site does is a second number: each effect is one bounded lean inside a quantity the world already keeps (the town's defence in a siege, the danger on its roads, the crime and raider pressures, the plague's care, a creed's standing, a route's cost, what a town has heard), so every decider that already reads those quantities — the war chooser, the siege, the caravans, the migrants, the passage planner, the faith contest, the plague — considers sites with no wiring of its own.

---

## §0 WHAT THE CODE ALREADY IS (master `81f1cd963`; measured first by this seat, `cure/L-ST.md` "MEASURE FIRST", every row CONFIRMED by reading the cited symbol unless marked)

| `path :: symbol` | What it is (quoted) | What it gives ST | Gate / preset | Host (eff. lines / 800) | Persisted / derived |
|---|---|---|---|---|---|
| `resourceSites.js :: deriveResourceSites` | "A Shape-1 PURE DERIVER … NOTHING IS STORED … Depletion is NOT read"; each `{ resource, bearing, band ∈ AT_HAND · NEAR · DAYS_REACH, terrainAnchor, sourceKind: 'DERIVED_V1' }` | the `resource` kind ADOPTS a derived location BY REFERENCE (`resourceKey`); no yield law lives here (⛔ STOP-ST-2) | dark; golden-inert; imported only by `undercity/monotoneComponents.js` | 221 raw | derived |
| `defenseLedger.js :: defenseLedger` | "the ONE read-point for the conserved defense quantities" — reads the GENERATED `defenseProfile.scores` (`internal` "0..100 internal security / public order") | NOTHING is added here: its importers include `armyTransitKernel.js` (798, frozen headroom 2) and `militaryStrength.js`; the dossier shows a site's term BESIDE the stored score from the same leaf the war reads (ST5) | always | 27 | derived from a generated profile |
| `stressorGates.js :: STRESSOR_SPAWN_GATES` / `gateResult` | birth-side leans as `{ mult, reason }` rows, product clamped to `[GATE_MULT_MIN 0.1, GATE_MULT_MAX 3]`; `monsterRaiderGate` ("Standing defenses patrol the approaches." 0.85), `criminalCorridorGate` ("A practised watch chokes smuggling at the gates." 0.75), `magicDeadzoneGate` ("Standing wards resist the silence, for now." 0.8); `snapshot.worldState` in scope | ST's birth-side rows (one row per gate per sign; the felt sentence is the row's reason) | the stressor layer, every preset | 609 (191 headroom) | derived |
| `stressorDynamics.js :: counterforceAssessment` / `STRESSOR_COUNTERFORCES` | "weights are normalized at evaluation time"; `monster_raider_pressure`: `defense_readiness 0.5 · institution defense 0.3 · ally military_protection 0.2`; `criminal_corridor`: `… institution security 0.3 …` | the run-side lean: ONE additive post-blend term per stressor type ST touches (a new SOURCE would dilute every siteless town — a dark shift) | every preset with stressors | 759 (41 headroom) | derived |
| `embattlement.js :: advanceEmbattlement({ threats, worldState, tick })` · `rampThreat` · `EMBATTLEMENT_TUNING` | "a region's embattled level IS its routes' danger term"; `ENTER_THRESHOLD: 0.55` · `EXIT_THRESHOLD: 0.3` · `W_SIEGE: 0.85` · `SECURITY_MAX_RELIEF: 0.25` ("a garrison can never nullify an active siege"); the ramp's inputs are read in the frozen kernel | MN5's ONE PRESENCE TERM is composed inside `advanceEmbattlement` (it receives worldState); ST is its second feeder and its suppressor (ST8) | `spatialCanonVersion` marker (physical; not info-mode gated) | 172 | persisted `spatialLedgers.embattlement` (not ST's) |
| `embattlement.js :: scoreRoute(path, worldState, baseCost, riskTolerance, medianHopCost)` · `tollRateOf` | base + danger (`embattlementLevel` per traversed node) + toll (`spatialLedgers.entrepots[id].toll`, intermediaries only) | ONE additive per-hop SITE term (a crossing or a waystation lowers a stretch's cost); no site toll until EC-6's toll arm | the movers (canonized worlds) | 172 | derived |
| `warCapacityReads.js :: buildCapacityLookup` · `computeAllyRelief` | "`const homeDefense = Math.max(0, offensive - armyAway);`"; relief = allies' `homeDefense × ALLY_RELIEF_FRACTION` | THE ONE DEFENCE READ: the ready keep enters `homeDefense` as a named envelope field `siteDefense`; relief SUBTRACTS it (ST10) | `warLayerEnabled` (war presets) | 143 | derived per tick |
| `warSiegeVerdict.js :: resolveSiegeVerdict` · `SIEGE_VERDICT_BANDS` | "`defenderCap.homeDefense) + (Number(defenderReliefBonus) \|\| 0)`"; bands `costly_success · decisive_fail · decisive_success · narrow_fail` | the siege leans hard to `holds` against a ready keep, by construction | `warLayerEnabled` | 180 | derived |
| `warDeployment.js :: evaluateWarLayer` | "`if (!snapshot?.byId?.has?.(targetId)) continue;`" — a non-settlement target is dropped; returns `worldStatePatch` | the keep's BREACH STOCK is spent at the verdict (ST11); a `site` target needs a deployer car (ST-2b) | `warLayerEnabled` | 685 (115 headroom) | `deployments` persisted (the war's) |
| `pulseKernel.js` (frozen 1581) | "`worldState = { ...worldState, ...war.worldStatePatch, deployments: war.deployments, warExhaustion: war.warExhaustion };`" (the razing precedent) | the in-tick channel by which the war layer's call to ST's one writer persists — zero kernel lines | — | 1581 (ZERO lines) | — |
| `martialReadiness.js :: buildThreatByCid(snapshot, worldState)` | "the per-cid THREAT-ENVIRONMENT index (0..1) from the world's WAR RECORDS ONLY … STRICTLY ENDOGENOUS" | an UNTIED site at hand is a threat input (the town mobilizes); a held fort is never a threat (ST9) | the martial layer | 264 | derived |
| `pestilenceKernel.js :: care01Of` | "`const care01Of = (id) => careCapacity(classifyCareRoster(itemById.get(id)?.settlement?.institutions));`" | the hospice's one seam: an additive term on care, bounded | the pestilence front | 169 | derived |
| `religiousContest.js :: advanceReligionStates` (`strengthByRef`) | the faith contest's strength by creed per town (RULINGS-AFTER-RESEARCH §4: "the run-side seams for faith … already receive `worldState`") | the shrine's one seam: a bounded lean on the HOLDING CREED's local strength in the attached towns (the followers act) | `faithSpreadEnabled` arms (dramatic, full) | 493 | persisted `religionStates` (not ST's) |
| `treasury.js :: UPKEEP_LEDGERS` · `advanceTreasury(settlement, options = {})` | "`UPKEEP_LEDGERS = Object.freeze(['deployments'])`"; no worldState; one caller, the frozen kernel | NO coin upkeep row today (CH-r1-5's precedent): FUNDING is a DERIVED band (ST6) | `treasuryEnabled` lit nowhere | 438 | — |
| `prosperityRank.js :: prosperityRank01` | "THE ONE ladder for a prosperity LABEL as 0..1" over the seven-rung ladder (`Subsistence … Wealthy`) | a settlement holder's funding band | always | — | derived |
| `events/realmManifest.js :: REALM_MANIFEST` · `realmVerbExecution.js :: applyRealmVerbOrder` | entry shape "dials ≤4", `lane: 'proposal'`; "a lapsed order REFUSES VISIBLY" | the DM's four verbs (ST3) | premium | 474 · 663 | proposals (the queue's) |
| `calamityKernel.js :: advanceCalamity({ settlementUpdates, worldState, snapshot, digest, pIndex, rules, rng, season, prevWeeks, weeks, tick, now })` | MN's menace stage sits at its head (OD-MN-20) | ST's ONE stage mounts after MN's in the same head (ST2) | — | 461 | — |
| `settlementLifecycleFirstClass.js :: lifecycleStatusOf` | "Is this settlement a remnant (dead — a status, never a deletion)?" | a dead holder or anchor is detected by read, with no hook in razing or abandonment (ST14) | — | 462 | derived |
| `spatial/spatialLedgerAccess.js :: getSpatialLedger / setSpatialLedger / dropSpatialLedger` · `spatialDigest.js` (`territory`, `tiers`) · `distanceRead.js :: hopWeeks`, `calibration` | the drop-when-empty namespace; per-cell territory; tier 1/2/3 neighbours; the one distance law | the record's home; the distance bands (relative, never absolute weeks — the host's law 3) | — | — | — |

**The binding prior words.** The owner's 10-17 doctrines (the tool is the DM's — "We only supply setting and consequence"; BEHIND THE SCENES; UNPREDICTABLE IN PROSPECT, LEGIBLE AND COHERENT ON SCRUTINY; HEARINGS ONLY ON THE WEEK); the hosting doctrine (above); the Evidence Law; THE PROMISE (a seed is a starting world forever — no site is ever generated into a seed); MN12 and the owner's ninth word (menaces are the DM's alone); the map builder's standing rules (`refs/HOST-REQUIREMENTS-2026-10-18.md` "Encounter maps and world sites": law 1 "A site's status change or an adoption must reach the host as a dated event", law 3 "No absolute week numbers until the real scale is written", law 10 "No invented fact", J384 (10) "Holy places and hidden cult sites are only DM-placed, tagged with a deity, DM-only by default, and offered to the host for adoption. Never generated.", J384 (11) steadings are members of the parent's realm, not sites, ENC-HP-01 a settlement founded on a site adopts it); the fold §3.1.28 (the world-site record is THE SITES') and §3.1.29 (garrisons and held sites are THE SITES'; the WC inbox's vassal-garrison row moves here; OD-PL-33).

**The population facts.** No site exists in any seed or save today (`rg -w worldSites` over master: 0 files). The digest carries per-cell territory and tier-1/2/3 neighbours on canonized worlds; aspatial worlds carry only the relationship graph. `treasuryEnabled` is lit nowhere; `warLayerEnabled` only in the war presets; the rumor road only under infoMode `full`.

---

## §1 THE LAWS (ST1–ST20)

**ST1 — A SITE IS ON THE LAND; AN INSTITUTION IS IN THE TOWN.** A site is a place outside a settlement with a kind, a name and a holder. It is never an institution: `institutionFounding.js` and the institution roster are untouched, and a town's own walls stay its institutions (already folded into its generated military score — `defenseLedger.js`'s header names the double count it cured). No second institution system.

**ST2 — ONE SITE TRUTH, ONE WRITER.** `spatialLedgers.worldSites` is the only record of a site; it is the host half of the map's asked `WorldSiteHost`/`WorldSiteRecord` (ENC-HL-01..03): the map reads it through its window and never keeps a second. One module writes it — `src/domain/sites/siteLedger.js :: applySiteEvent(worldState, event) → { worldState, siteId, applied }` — called only by a CLOSED, pinned list of callers (the realm verb arm, ST's one stage, the war layer's keep leaf, and the existing writers of §6.3's roads — a walker fails on any other importer); every write is a dated EVENT (law 1 of the host). Drop-when-empty at every optional key and at the ledger; absent while dark.

**ST3 — THE ENGINE NEVER SPAWNS A SITE.** The DM PLACES a site, or ADOPTS one the map offers (map-tier until adopted; the adoption is the DM's act), or accepts "leave a ruin" on a dying settlement's card. The engine changes a site's FATE (who holds it, its quality, its state) and never its existence. Ids are minted zero-rng (FNV over the minting verb's event id — RN's deed-id idiom), never borrowed.

**ST4 — NO SITE DECIDES ANYTHING; HOLDERS DECIDE.** A site has no mind, no economy, no faction, no belief, no population. Its holder's own deciders act (a court funds or abandons; a menace's course is the DM's; a brigand body moves by WC-12's rules); the site only changes the numbers those deciders already read.

**ST5 — EVERY EFFECT IS ONE BOUNDED LEAN INSIDE A QUANTITY THE WORLD ALREADY KEEPS.** Defence (`homeDefense`), danger (the one presence term), crime and raider pressure (the gates and counterforces), readiness (the threat index), health (`care01Of`), faith (the contest's strength), magic (the arcane plane), route cost (`scoreRoute`), and what a town has heard (the witness set). Each lean is a named `{ mult, reason }` row or a named additive term at one seam, clamped, DRAFT, UNMEASURED, on the FP-46 roster. No site has a number of its own that any decider reads; no second defence score, danger, crime, plague, faith or magic law.

**ST6 — FUNDING IS A DERIVED BAND, NEVER A COIN STORE.** [REFINED 2026-10-18 (fp-final) — the brief's "the ONE upkeep-shaped sink (the `UPKEEP_LEDGERS` row the champions volume uses)" does not exist: `UPKEEP_LEDGERS = ['deployments']`, `advanceTreasury(settlement, options = {})` takes no worldState and is called once from the frozen kernel, and CH-r1-5 struck CH's row for that reason.] A holder's funding band is derived each read from what it has: a settlement from its prosperity rung (`prosperityRank01`), a creed from its standing in the holder's seat town, a person from its purse band (CH's derived purse), an UNTIED holder from nothing (its sites only wear). The DM may set the band by hand (it then holds until the DM clears it). Coin upkeep joins W-SEAT SEAT-8's `UPKEEP_LEDGERS` widening car as a fourth member beside `civilContests`, `interventions` and CH's retainers — the SLOT; when it lands the band reads the paid share.

**ST7 — EMPTY IS NOTHING.** A site with no holder leans on nothing — no bonus, no hazard, no draw (the owner's seventh word). Its quality still wears, so a later holder inherits what neglect left. The call board, a dungeon's draw for adventurers, a "something stirs in the old barrow" line are the DM's to author, never automatic.

**ST8 — THE UNTIED HOLDER IS A GENERAL HAZARD.** A site held by a force tied to no settlement — a brigand body, a cult, a DM's menace, a villain — gives NO town a bonus and EVERY attached town a hazard, scaled by the holder's MIGHT × the site's quality × the distance band (the owner's second word: "noone gets bonuses but everyone gets varying degrees of negative"). Danger enters as the second feeder of MN5's ONE PRESENCE TERM — per town the MAX of its feeders, capped once — so three dens on one road never triple the danger (requirement 2). A HELD site never lowers the war's own drivers: it SUBTRACTS from the presence term only, floored at zero, so the latch logic's floor holds (`W_SIEGE 0.85 − SECURITY_MAX_RELIEF 0.25 − ENTER_THRESHOLD 0.55` leaves 0.05 of margin — any other relief would let a besieged town fall out of the latch). [REFINED 2026-10-18 (fp-final) — the brief's "danger on the roads under it lowered within bounds" made exact: the only lowering is on what dens, menaces and roosts added; patrols (THE PATROLS, `briefs/L-PR.md` item 5) subtract on the same term.]

**ST9 — A FORT IS NOT A THREAT; A DEN IS.** The readiness index (`buildThreatByCid`) takes an untied site at hand as a threat input — the town mobilizes against the den on its road. A held fort adds no readiness term: it is standing defence, not alarm. [REFINED 2026-10-18 (fp-final) — the brief's "READINESS ↑" for a held fort would have RAISED mobilization through a threat index whose sign is alarm; the fort's gain is defence, security and notice, its den's cost is alarm.]

**ST10 — THE READY KEEP IS THE TOWN'S FIRST LINE.** A `fortification` at hand that is `sound` and held by a funded settlement garrison enters `homeDefense` as a LARGE bounded term (the owner's fifth word: "drastically"), named on the envelope (`siteDefense`), so the siege verdict and MN-2's menace verdict lean hard to `holds` by construction; allied relief subtracts it (a keep never marches to another town's walls). The dossier's defence page reads the same leaf (one term, two readers).

**ST11 — UNSCATHED IS A STOCK THE CRISIS SPENDS FIRST.** In its function's crisis a ready site is spent before the town: a siege's fall lands on the keep first (`sound → worn`, then `worn → ruined`) and only then on the town; a plague overwhelms the hospice before the town's own care; a desecration strikes the shrine before the seated creed. Each spend is a dated event with its receipt. A relieved or lifted crisis leaves the site as it stands; funding restores it over years (§4.3).

**ST12 — EVERY POSITIVE NAMES ITS COUNTERFORCE.** Upkeep (the funding band's wear), resentment (a crown's garrison in a member's land — PL's control instrument), the siege it invites (a fort is a target), a traitor at the gate (ES's product), a den if the garrison is withdrawn. A den invites a clearing. Requirement 2, per kind (§3).

**ST13 — THE LAST TO ACT HAS THE FIRST CLAIM; NOTHING IS FORBIDDEN.** The record keeps `lastHolder` (the last settlement-tied holder) and the week it last ACTED (funded, garrisoned, restored). When a site falls empty or is taken by an untied force, that court is OFFERED THE RECLAIM first, in its week (`site_reclaim`); a decline, or a court that no longer stands, opens it to whoever acts next. A preference, never a right (the owner's second word).

**ST14 — A SITE OUTLIVES ITS TOWN.** No settlement's death deletes a site (the owner's third word). When a holder or anchor settlement fails (a remnant status, a razing, an abandonment, a world imported without it), the site PERSISTS: holder → none if it was that settlement, an `abandoned` event, quality unchanged then wearing, its attachments re-derived to the surviving neighbours, and the dead court's first claim LAPSES. A dying settlement's card OFFERS "leave a ruin" — a `ruin` site at its place, the DM's act — with the dead settlement as `lastHolder` for the chronicle only.

**ST15 — WHO MAKES A DEN.** A den arises only when an UNTIED holder takes a site: an engine-born BRIGAND BODY (WC-12's located raiders — emergent, the world's own; WC-12 is unbuilt, so engine-born dens wait on it), a cult (the faith system's own — a slot until WF names a cult actor), or a MENACE — and a menace is DM-AUTHORED ONLY and never organically emergent (MN12; the owner's ninth word): a menace takes a site only where the DM's course sent it. Every lifecycle and scenario row says which dens are emergent and which are the DM's.

**ST16 — PURPOSE AND DESTINY ARE THE DM'S.** A site has no purpose, no quest and no destiny unless the DM directs one; left alone it is consequence only (the owner's ninth word and the hosting doctrine). The party is never made important by a site; a den on the road is a fact of the world, never a call aimed at the party.

**ST17 — WHAT A TOWN HEARS IS BELIEF.** A held watchtower makes its attached towns WITNESSES of what passes in its country or on its stretch — the report reaches them a hop earlier (Law One; the rumor road's hop-0 witness set; the passage volume's quiet crossing is defeated by a manned tower). It never reveals truth outside the omniscient arm and never places a site's id where a settlement's belongs (the fake-settlement hazard MN7 cured).

**ST18 — SITES ARE CONSIDERED EVERYWHERE, BY CONSTRUCTION, AND BY ONE READ WHERE A SITE MUST BE KNOWN AS A SITE.** Every effect enters a single read the deciders already consume (§7's COVERAGE CENSUS, pinned by a walker: no decider reads a parallel number); where a decider must know a site AS a site — the war chooser's target, the passage planner's path, the call board, the menace's course, a paragon's choice, the party's doors, the dossier, a hearing's WHERE — it reads ONE derived read, `sitesNear(worldState, settlementId)` / `siteAt(worldState, siteId)`, and the actor convention gains `site`.

**ST19 — THE MOUNT RULE.** Zero lines in `pulseKernel.js` (1581), `applyWorldPulse.js` (907), `warTermination.js` (818); nothing in `armyTransitKernel.js` (798) or `generosityKernel.js` (800). ST's one stage is a leaf after MN's at the head of `calamityKernel.js :: advanceCalamity` (461); every lean is a leaf the named host calls in ≤ 4 lines; every host near the ceiling (`stressorDynamics.js` 759) takes its lines through a leaf-first car measured at the wave's car-0.

**ST20 — THE PHYSICAL WORLD IS A SEAM.** Until the world canon carries a site's point, WHERE is the country around a settlement (`{ kind: 'country', ids: [a] }`) or a road between two (`{ kind: 'road', ids: [a, b] }`) — MN's WHERE idiom, node-keyed; distance is the relationship graph's hop count. On a canonized world the attachment bands read the digest's tiers and `hopWeeks` relative to the realm's median primary hop (`calibration`), never absolute weeks (the host's law 3). When the canon carries a WORLD POINT for a site (H5; the host-fixed position outranks the map's siting, ENC-HL-03), WHERE gains `position` additively; never a cell key (HOST-r1-11). Every wave is whole without the map.

---
## §2 THE ONTOLOGY

### 2.1 The record (persisted shape 1 of 2; OD-ST-1)

```
spatialLedgers.worldSites[siteId] = {
  kind,                 // SITE_KINDS (§2.2)
  name,                 // the DM's words, quoted, never parsed (MN2's law); '' reads "an unnamed <kind word>"
  where: { kind: 'country' | 'road', ids: [a] | [a, b], position? },   // node-keyed now; `position` (a world point) when the canon carries one (ST20)
  holder?: { class, ref, role?, creed?, might? },                       // ABSENT = unheld (ST7)
  quality,              // SITE_QUALITY: sound · worn · ruined (stepped only by dated events)
  fundingSet?,          // a DM-set FUNDING_BAND; absent = derived each read (ST6)
  lastHolder?: { ref, actedTick },                                      // the last SETTLEMENT-tied holder and the week it last acted (ST13)
  siege?: { by: actorRef, sinceTick, quietWeeks },                      // a standing `site_siege` (§8)
  hidden?: true,        // unknown to the world's courts until revealed or until its holder acts (J384 (10): holy and cult sites DM-only by default)
  deity?,               // a shrine's tag (J384 (10)): the creed key the DM chose
  resourceKey?,         // a `resource` site: the roster entry it adopts by reference (`deriveResourceSites`)
  placedBy,             // 'dm' · 'adopted' · 'ruin_left'
  offerRef?,            // an adopted site: the map's offer id (provenance; ENC-HP-01)
  events: [{ word, tick, causedBy, by? }],                              // SITE_EVENTS, newest last, bounded ring of 8 (DRAFT, UNMEASURED); the map's dated statuses (ENC-HL-02)
  sinceTick, lastTick,
}
```

- **Holder.** `class ∈ HOLDER_CLASSES = settlement · faith · person · untied`. `ref` is the ONE actor-ref convention `{ kind, id? }` (fold §3.3.12): `settlement` → `{ kind: 'settlement', id }` with `role ∈ garrison · civil`; `faith` → `{ kind: 'settlement', id: <the seat whose clergy serve> }` with `creed` (the deity key); `person` → `{ kind: 'person', id: 'wnpc_…' }` (a ledger person; a paragon's living `polarity` decides its sign, §3.1); `untied` → `{ kind: 'menace', id }` (MN's record — `might` is READ from it, never copied) or `{ kind: 'band', id? }` (a brigand body: WC-12's unit id when that wave lands; a DM-authored band carries `might`) or `{ kind: 'cult', id? }` (a slot until WF names a cult actor; DM-authored meanwhile). [REFINED 2026-10-18 (fp-final) — `band` and `cult` are holder REF kinds on this record only, never actor kinds of the convention; the convention widens by `site` alone (§7.3).]
- **State is derived, never stored.** `held` when `holder` is present, else `unheld`. [REFINED 2026-10-18 (fp-final) — the brief's STATE `held · unheld · ruined` put `ruined` on one record twice (a state and a quality); `ruined` is the QUALITY band alone (one word, one meaning per record) and "a ruin" in prose is a site of quality `ruined`.]
- **Attachments are derived, never stored.** [REFINED 2026-10-18 (fp-final) — the brief's persisted `attachedTo: [{ settlementId, distanceBand }]` would go stale the week a neighbour dies; derived, it RE-POINTS by construction (the owner's third word, ST14).] `attachmentsOf(worldState, siteId, digest?) → [{ settlementId, band }]`, codepoint-sorted, dead settlements skipped (`lifecycleStatusOf` non-empty or absent from the campaign): the anchor (`ids[0]`; both ends of a road) at `at_hand`; on a canonized world tier-1 neighbours of the anchor at `nearby` and tier-2 at `distant` (`spatialDigest.js` `tiers`), each demoted one band where `hopWeeks` exceeds the realm's median primary hop × 1.5 (DRAFT, spectrum-relative per the host's H2); aspatially graph hop 1 `nearby`, hop 2 `distant`. Nothing beyond `distant` is attached.

### 2.2 The catalog — ten kinds, a free name (closed: `SITE_KINDS`)

| Kind | What it covers (display nouns are DISPLAY ONLY, never a rule) | The map's word (V14, per the host document) |
|---|---|---|
| `fortification` | keep, fort, castle, motte, redoubt | "fort" (the host document's "a ruin, fort, camp or crypt"; H13 "held sites (forts, watchposts)") |
| `watchtower` | watchtower, signal tower, watchpost | "watchpost" (H13) |
| `tower` | a mage's tower, an arcane outpost | — (a V14 kind name, if any, maps here) |
| `shrine` | shrine, abbey, holy place, hermitage (J384 (10): DM-placed, deity-tagged) | holy place |
| `waystation` | inn, tollhouse, caravanserai, coaching post (always on a road) | — |
| `crossing` | bridge, ford, pass (always on a road) | the canon's crossings (H16) name the GATE; a crossing site is a held structure there |
| `resource` | mine, quarry, logging camp (adopts a `deriveResourceSites` location by `resourceKey`) | "camp" when it is a working camp |
| `hospice` | hospice, leper house, infirmary | — |
| `harbour_works` | lighthouse, mole, naval station (on a port node) | — |
| `ruin` | dungeon, barrow, crypt, ruined city (quality fixed `ruined`; re-kinding is `END_SITE` then `PLACE_SITE`) | "ruin", "crypt" |

NO `lair` kind (the chair's ruling 14): a menace or an untied band in ANY site makes it a lair in prose; when it is broken or leaves, the site is unheld again. The map's own kind vocabulary was NOT reported to this seat (HOST-r1 lists none; V14 is the map's repository) — the mapping column above names only the words the host document quotes; the full alignment is OPEN QUESTION Q1 to the chair (one vocabulary where they meet; a map kind with no row here maps to the nearest kind or is refused as an invented fact, the host's law 10). STEADINGS ARE NOT SITES (J384 (11): members of the parent's realm drawn at their frozen cells).

### 2.3 The bands (closed vocabularies)

| Vocabulary | Values | Meaning |
|---|---|---|
| `SITE_QUALITY` | `sound · worn · ruined` | the structure's condition — the SAME meaning as the town map's condition words (`townScene/cartographyContract.js`: `'pristine', 'sound', 'worn', 'damaged', 'burned', 'ruined'`) and the institution roster's inactive `'ruined'`; a registered consistent homonym |
| `FUNDING_BANDS` | `unfunded · meagre · funded · lavish` | what the holder can spend on it (ST6). [REFINED 2026-10-18 (fp-final) — the brief's `none · thin · fair · full`: `thin` is MN's might word on the same cards (`thin · modest · capable · strong · formidable`), `fair` 12 and `full` 30 string-literal files on master; `meagre` and `lavish` are free, `unfunded` free as a literal] |
| `DISTANCE_BANDS` | `at_hand · nearby · distant` | an attachment's band, RELATIVE to the realm (never weeks). [REFINED 2026-10-18 (fp-final) — the brief's `near · a_day · far`: `a_day` is an absolute time on worlds without `kmScale`, which the host's law 3 forbids ("must not label a site 'two weeks away' in absolute terms"); `at_hand` carries the same meaning as `resourceSites.js`'s `AT_HAND` (a location band)] |
| `HOLDER_CLASSES` | `settlement · faith · person · untied` | §2.1 |
| `SITE_EVENTS` | `placed · adopted · garrisoned · held · abandoned · taken · cleared · reclaimed · breached · worn · destroyed · restored · conveyed · ceded · granted · seized · consecrated · sold · besieged · relieved · ended` | each a DATED event on the record (ENC-HL-02's five — `garrisoned · abandoned · destroyed · cleared · restored` — are among them); `breached` and `worn` step quality down by one band (siege · neglect), `destroyed` sets it to `ruined`, `restored` steps it up by one |

### 2.4 The derived reads (signatures; each pure, memoized per snapshot)

- `siteAt(worldState, siteId) → SiteView | null` — the record plus `state`, `fundingBand`, `attachments`, `effectClass` (`tied · untied · none`), `mightBand`.
- `sitesNear(worldState, settlementId, digest?) → [{ siteId, kind, band, effectClass }]` — every site attached to a settlement, codepoint-sorted (THE SITE READ of ST18).
- `fundingBandOf(worldState, siteId, snapshot) → FUNDING_BAND` — `fundingSet` if present; else by holder: a settlement's `prosperityRank01` (`< 0.2` unfunded · `< 0.45` meagre · `< 0.8` funded · else lavish, DRAFT); a creed by its standing band in its seat town (`cult` unfunded · `established` funded · `ascendant` lavish — the faith contest's landed standing words, PLAUSIBLE until ST-3's car-0 names the field); a person by CH's derived purse band (a slot until CH lights; `meagre` meanwhile); an untied holder `unfunded`.
- `siteTermAt(worldState, settlementId, seam, snapshot) → { value, sites: [siteId], reason }` — THE ONE LEAF every host calls (§3.3): the bounded lean of every site attached to that settlement on that seam, with the receipt naming the sites.
- `sitePresenceFeeder(worldState, settlementId) → { value, siteId }` and `siteSuppression(worldState, settlementId) → { value, siteId }` — the danger ledger's feeder and suppressor (§3.4).
- `siteWitnesses(worldState, place) → [settlementId]` — the attached towns that see a place through a held watchtower (ST17).
- `siteDefenseOf(worldState, settlementId, snapshot) → number` — the keep's `homeDefense` term (§4.1).

### 2.5 The token census (each searched `rg -w` on master `src/`, `tests/` and the ledger `docs/`; `cure/L-ST-probe/tokens-{1,2,3}.tsv`)

| Token | Census | Ruling |
|---|---|---|
| `worldSites` · `siteLedger` · `worldSitesEnabled` · `siteEffectsEnabled` · `siteFatesEnabled` · `siteWarTargetEnabled` · `lastHolder` · `site_taken` · `site_cleared` · `site_reclaim` · `site_siege` · `site_cession` · `party_reached_site` · `PLACE_SITE` · `SITE_STATUS` · `SITE_HOLDER` · `END_SITE` · `harbour_works` · `at_hand` · `meagre` · `lavish` | 0 src · 0 tests (the ledger docs' one `worldSites` hit is the fold's pointer) | FREE — minted |
| `fortification` | 12 literal files (`institutionalCatalog.js` tags `['defense', 'fortification']`) | REGISTERED HOMONYM — an institution TAG in the town vs a site KIND on the land (ST1 is the line); never the same field |
| `watchtower` · `tower` · `shrine` · `waystation` · `hospice` · `ruin` | 4 · 8 · 13 · 2 · 1 · 7 literal files (glyph kinds, institution keywords, prose pools) | REGISTERED HOMONYMS — glyph and institution-name keywords, never a site kind field |
| `crossing` | 2 literal files (prose comments "crossing") ; fold §5 rules "stance crossing" vs "entrepot crossing" | a `crossing` SITE is a held structure at the canon's crossing; prose always qualifies it ("the bridge at …") |
| `resource` | 28 literal files | the kind value only on `worldSites[*].kind`; registered |
| `garrison` | 35 literal files | NOT minted as a token: the holder ROLE is `garrison` on `holder.role` only (registered homonym of the institution keyword and the map's "garrison presence") |
| `held` · `unheld` | 23 · 0 literal files (`held` = a payout status, a defeated-house disposition, …) | `held · unheld` are DERIVED state words on a site view; registered |
| `sound` · `worn` · `ruined` | 4 · 3 · 24 literal files: the town map's condition vocabulary (`cartographyContract.js`), the institution roster's inactive `'ruined'`, and a HOUSE-FINANCE band (`houseActs.js`: `'overdrawn', 'tight', 'sound', 'flush'`) | the same meaning as the condition words (a structure's condition) — registered consistent; the house-finance `sound` is a REGISTERED HOMONYM on another surface (PL's census marked it "LANDED — not used" and moved its hold words to `frayed · shaky · staunch · unbroken`, OD-PL-11), so no FP surface carries two meanings |
| `nearby` · `distant` | 0 · 2 literal files | FREE as values; registered |
| `destroyed` · `restored` · `placed` · `taken` · `cleared` · `granted` · `seized` | 27 · 9 · 4 · 1 · 2 · 2 · 2 literal files (institution statuses, misc.) | event VALUES on `events[*].word` only; registered |
| `den` · `lair` | 0 literal · 0 literal | PROSE words only, never tokens |
| `untied` | 0 src (1 test, 4 docs prose) | the holder CLASS value; FREE |

---

## §3 THE EFFECT TABLE AND ITS LAWS

### 3.1 The sign is the holder's

| Holder | Effect class | Who feels it |
|---|---|---|
| `settlement` (garrison or civil) · `faith` (clergy of a creed) · `person` (a ledger person; a paragon whose living `polarity` is `champion`) | `tied` — BENEFITS | the attached towns, by distance band |
| `untied` (a band, a cult, a menace) · a `person` whose paragon `polarity` is `villain` | `untied` — the GENERAL HAZARD (ST8) | EVERY attached town, by distance band; no town benefits |
| none | `none` — NOTHING (ST7) | nobody |

### 3.2 The scale (every factor DRAFT, UNMEASURED, FP-46 roster)

- TIED term = `BASE[kind][seam] × F(funding) × Q(quality) × D(distance)`; `F`: unfunded 0.15 ("walls without defenders") · meagre 0.45 · funded 0.8 · lavish 1.0; `Q`: sound 1 · worn 0.5 · ruined 0; `D`: at_hand 1 · nearby 0.5 · distant 0.2. A `person` or `faith` holder of a `fortification` counts at half (a lord-errant's hall is not a garrison).
- UNTIED term = `BASE_H[kind][seam] × M(might) × Qu(quality) × D(distance)`; `M`: thin 0.2 · modest 0.4 · capable 0.6 · strong 0.8 · formidable 1.0 (MN's might words, the J-CNC-5 keys); `Qu`: sound 1 · worn 0.65 · ruined 0.35 (a ruined site gives the mildest hazard, the owner's second word as the chair ruled). So "a sound keep of brigands at the gate is a crisis and a crumbling barrow three days off is a rumour" (ruling 16b).
- Per seam, per town: the terms of several sites COMBINE BY MAX within a sign (no stacking; requirement 2) and the result is clamped to the seam's cap below.

### 3.3 The table — kind × holder → seam · sign · scale (BASE values DRAFT, UNMEASURED; every seam named; ⛔ where none exists)

| Kind | TIED (benefit) — seam · BASE | UNTIED (hazard) — seam · BASE_H | EMPTY |
|---|---|---|---|
| `fortification` | `homeDefense` += `siteDefense` (at_hand only; cap +18 latent points, §4.1) · raider counterforce +0.15 (additive post-blend, `counterforceAssessment`) · `monsterRaiderGate` row ×0.8 "A garrisoned keep watches the approaches." · `criminalCorridorGate` row ×0.85 and the infiltration gate row ×0.9 "The keep's garrison keeps order on the roads." (internal security, the owner's first word) · presence suppression 0.20 (§3.4) | presence feeder BASE_H 1.0 (a `capable` band in a `sound` keep `at_hand` gives 0.60 and crosses the latch, `ENTER_THRESHOLD` 0.55 — the crisis of ruling 16b; a `modest` band gives 0.40, which sustains an embattled town but never latches a calm one alone; capped at MN5's one cap) · `monsterRaiderGate` row ×1.3 "Brigands hold the old keep above the road." · `criminalCorridorGate` row ×1.25 (contraband) · threat input to `buildThreatByCid` 0.4 · raider counterforce −0.10 | nothing |
| `watchtower` | witnesses: the attached towns join the hop-0 witness set of tellings in its country or on its stretch (belief presets; ST17) · `monsterRaiderGate` row ×0.9 "Watchers on the hill see raiders coming." · presence suppression 0.10 | presence feeder BASE_H 0.30 (a lookout, not a host) · `criminalCorridorGate` row ×1.15 "Robbers watch the road from the old tower." | nothing |
| `tower` (arcane) | `magicDeadzoneGate` row ×0.8 and `magicalInstabilityGate` row ×0.85 "A warded tower stands over the town." · arcane counterforce +0.15 on `magic_deadzone` and `magical_instability` (additive post-blend) — the magical support the owner named | `magicalInstabilityGate` row ×1.3 "A rogue mage works the old tower." · presence feeder BASE_H 0.25 | nothing |
| `shrine` | the holding creed's local strength in each attached town (the faith contest's strength by creed, bounded +0.10 × F×Q×D of the creed's own strength; the followers act — the deity doctrine) · care +0.04 on `care01Of` | the TAGGED creed's local strength −0.10 (desecration) · `religiousConversionGate` row ×1.2 "Heretics preach at the old shrine." | nothing |
| `waystation` | `scoreRoute` per-hop discount on its stretch 0.10 × median hop × F×Q · presence suppression 0.10 on its stretch's ends · tolls: none until EC-6's toll arm (the slot) | presence feeder BASE_H 0.45 on its stretch's ends · `criminalCorridorGate` row ×1.2 "The old inn is a robbers' roost." | nothing |
| `crossing` | `scoreRoute` per-hop discount on its stretch 0.25 × median hop × F×Q; its holder is the GATE's holder for THE PASSAGE's answers on that stretch (a read, PS) | presence feeder BASE_H 0.45 on its stretch's ends · `criminalCorridorGate` row ×1.15 "A toll-robber holds the bridge." | no bonus: the stretch costs its base (the absence of a benefit, never a hazard — ruling 19) |
| `resource` | ⛔ STOP-ST-2 — no live yield read is keyed by a resource site at master (`resourceSites.js`: "Depletion is NOT read"; it derives location only); the record, the holder and the dossier line stand | presence feeder BASE_H 0.20 · `criminalCorridorGate` row ×1.15 (contraband from the working) · the yield loss ⛔ STOP-ST-2 | nothing |
| `hospice` | `care01Of` += 0.08 × F×Q×D (×2.5 while a `disease_outbreak` stands in that town — the crisis counterpart, §3.5) | `diseaseOutbreakGate` row ×1.2 "A plague pit festers at the old hospice." — a lean on the plague's own gate, never a second plague | nothing |
| `harbour_works` | presence suppression 0.15 at its port node; the sea arms (W10 per-hop sea hazard behind `seaRoadsEnabled`, W11 naval blockade) — PLAUSIBLE seams, named at ST-3's car-0, slot C7 | presence feeder BASE_H 0.45 at its port node ("piracy at bandit parity") | nothing |
| `ruin` | nothing (held or watched, it is simply not a hazard). [REFINED 2026-10-18 (fp-final) — the brief's "a one-time salvage" had no landed seam (an invented effect, the host's law 10); the DM may author a salvage] | presence feeder BASE_H 0.40 · `monsterRaiderGate` row ×1.2 "Something has made the old barrow its den." | nothing (ruling 19) |

Caps per seam (DRAFT): presence feeder ≤ MN5's one cap; presence suppression ≤ 0.25 combined with THE PATROLS' subtraction, never below zero and never on the walls term; raider counterforce ±0.15; arcane counterforce +0.15; gate rows inside `[0.1, 3]` by `gateResult`'s own clamp; `care01Of` ≤ +0.20; faith ±0.10 of the creed's strength; `scoreRoute` discount ≤ 0.25 median hop per hop; `siteDefense` ≤ 18 latent points.

### 3.4 The danger ledger: one presence term, two feeders, one cap, one suppressor (ruling 21; MN5)

Inside `embattlement.js :: advanceEmbattlement`, before the step, per town T: `presence(T) = min(CAP, max(menaceFeeder(T), sitePresenceFeeder(T)))` where the ST feeder is the MAX over untied sites attached to T; then `presence'(T) = max(wallsTerm(T), max(0, roadCountry(T) − min(0.25, siteSuppression(T) + patrolSubtraction(T))))` — the walls term (a menace at T's walls, MN5) is never suppressed; the suppressor is the MAX over held suppressor sites attached to T (fortification · watchtower · waystation · crossing · harbour_works). MN's danger term and ST's hazard are ONE term with two feeders (MN's disposition lane cites this paragraph). Zero kernel lines: `advanceEmbattlement` already receives worldState. Every danger consumer then follows by construction (§7.1). Dormancy: off the spatial marker the ledger is a no-op (the landed gate) — so the danger arm is CANONIZED-ONLY (TIER lines say so); the gates, counterforces, care, faith and defence arms are aspatial-safe.

### 3.5 The crisis counterpart, per kind (ruling 18; ST11)

| Kind | The function | Its crisis | The one read | What the crisis spends first |
|---|---|---|---|---|
| `fortification` | defence | a siege; a menace at the walls | `homeDefense` (`siteDefense`, LARGE) | the keep's quality (`breached`: sound → worn → ruined), §4.2 |
| `hospice` | health | an outbreak in the town | `care01Of` (×2.5 while it stands) | the hospice's capacity: one `worn` step when an outbreak in an attached `at_hand` town peaks while held (DRAFT) |
| `shrine` | faith | an unseating; a `religious_conversion_fracture` in the town | the seated creed's strength (the shrine's lean ×2.5 while the fracture stands, if the shrine's creed is the seated one) | the shrine's standing: a `worn` step when the fracture resolves against its creed; `destroyed` when an untied heretic takes it |
| `tower` | magic | `magic_deadzone` · `magical_instability` in the town | the arcane counterforce (+0.15 — it acts only in the crisis) | the wards: a `worn` step when the crisis resolves in that town while held |
| `watchtower` | watch | an incursion, a spy ring, a quiet crossing | the witness set; PS's notice read | the tower's watch: a `worn` step when an untied force takes a site at hand unseen |
| `crossing` | supply and the march | a siege's supply lines; a relief column's route | `scoreRoute`; the army supply read (`warCapacityReads.js :: logisticsBurdenFor`, PLAUSIBLE, named at ST-3's car-0) | the bridge: `destroyed` when an enemy army cuts it (ST-2b) or the DM says so |
| `harbour_works` | sea trade and sea defence | a blockade; piracy | the sea arms (slot C7) | the works: a `worn` step when a blockade holds a season (slot) |
| `resource` | yield | a famine or a dearth of its good | ⛔ STOP-ST-2 | the working (claim-jumped: an untied holder takes it) |
| `waystation` | trade on the road | a route disruption | `scoreRoute` ONLY, modestly — NO drastic term | the station (a roost: an untied holder takes it) |
| `ruin` | none | none | none | — |

### 3.6 The three laws of the effects (ruling 16)

(a) Every positive names its counterforce (ST12; the per-kind rows of §5). (b) The untied hazard scales by the holder's MIGHT × quality × distance (§3.2). (c) Every effect has exactly ONE felt sentence (the gate row's reason, or §14's line) and ONE seam; no site has a truth of its own.

---
## §4 THE FORTIFICATION — THE FIRST FELT CHAIN (ST-1; ruling 22)

### 4.1 The ready keep in the one defence read (the owner's fifth word; ruling 17a)

**Reads:** TRUTH — the site record and the holder's funding band (a physical fact of the world, like the walls). **Writes:** nothing (a derived term). **Seam:** `warCapacityReads.js :: buildCapacityLookup` (143 eff): the envelope gains `siteDefense = siteDefenseOf(snapshot.worldState, id, snapshot)` and `homeDefense = Math.max(0, offensive − armyAway) + siteDefense` (+2 host lines); `computeAllyRelief` reads `homeDefense − siteDefense` for each ally (+1 line). `siteDefenseOf` = for the `fortification` sites attached to the town at `at_hand`, the MAX of `18 × F × Q` latent points (DRAFT, UNMEASURED: one `STRENGTH_BANDS` step on the 0..100 latent scale whose floors are 78/60/42/26/0 — a ready keep lifts the defender about one band; the army-away penalty it outweighs is `ARMY_DEPLOYED_CAPACITY_PENALTY = 14`), counted only when the holder is the town itself, or a settlement that is neither the besieger nor at war with the town (an ally's or a liege's garrison stands with the town against a third party; a crown's garrison never defends a member against the crown). So: sound and lavishly kept → the full term; worn or unmanned ("walls without defenders") → small; ruined → none.
**By construction** the siege verdict (`resolveSiegeVerdict`'s `defenderCap.homeDefense`), the defender-attrition ledger's seed, MN-2's menace siege (might vs `homeDefense`, MN-r1-1) and the war chooser's weighing of a target all read the keep. **One coverage defect named:** `display/warResolve.js` recomputes "`const homeDefense = Math.max(0, offensive - (besieging.length ? ARMY_DEPLOYED_CAPACITY_PENALTY : 0));`" — ST-1 adds the same `siteDefenseOf` term there (one leaf, every reader; the §7 walker pins it). The dossier's defence page shows the keep's line beside the stored generated score (never inside `defenseLedger`, whose importers include the frozen `armyTransitKernel.js`).

### 4.2 Unscathed is a stock the siege spends (ruling 17b; ST11)

**Seam:** `warDeployment.js :: evaluateWarLayer` (685 eff), right after "`const verdict = resolveSiegeVerdict({ … });`": `const kept = keepTakesTheBreach(worldState, targetId, verdict, snapshot)` (+3 lines). When `verdict.falls` and a qualifying keep at hand is `sound` or `worn`, the fall lands on the KEEP: the verdict becomes `holds` with `keepBreached: siteId` in its receipt, and a `breached` event (one quality step: `sound → worn`, `worn → ruined`) is queued; only when no keep qualifies does the town's own fall run. **The write** goes through ST's one writer inside the war layer's returned `worldStatePatch` (composed with razing's patch), which the kernel already merges ("`worldState = { ...worldState, ...war.worldStatePatch, … }`") — zero kernel lines. **ST-1's car-0 STOP condition:** if any `spatialLedgers` sub-ledger is written between the war call and that merge (kernel ~994 → ~1081) the patch would clobber it — then the FALLBACK: the war layer stamps `keepBreaches` on the besieger's own deployment record (the war's writer) and ST's stage applies the step the same tick, idempotent by (deployment, count). **The card:** "Kell's keep stands ready." · "Kell's keep is breached; the town's walls still hold." A relieved or lifted siege leaves the keep as it stands; funding restores it over years (§6.1 step 2).

### 4.3 A fort on the approach delays the siege (ruling 17c)

A held `fortification` on the hostile unit's route — on the stretch it travels (`where.kind = 'road'`) or `at_hand` to the next node it enters — is its own `site_siege` (STANDING; §8) that the attacker must resolve or BYPASS before the town's siege begins. **Seam:** THE PASSAGE's per-tick transit leaf (the border read over units in transit, `briefs/L-PS.md` item 9 — "the border check is a LEAF stage beside WC Arc A's planned `armies_meet` leaf"); the fort is read there through `sitesNear` and the unit HOLDS at the fort as it holds at a refused border. Bypass is a ROUTE CHOICE under PS's rules (the mover's believed cost, PS item 5: the fort's siege weeks enter the path's believed cost; a detour may cost weeks or be impossible). So a chain of forts buys a kingdom time and a rotten one buys nothing. **Honest dependency:** this arm waits on PS's transit leaf (and its STOP if that leaf has no host) and on ST-2b's deployer arm; the at-hand keep of §4.1 does not.

### 4.4 The fort's other leans and its counterforces

- **Internal security** (the owner's first word): the crime-side gate rows and the counterforce term of §3.3, at `at_hand` and `nearby`; WC-12's located-brigand contest (which reads "defense + internal security … through defenseLedger(settlement)", WC §1.8.1) reads `siteTermAt(…, 'security')` beside it when WC-12 lands (WC's wave registers the read; the slot).
- **The raider counterforce** — a fort IS a defence institution on the land: +0.15 additive after `counterforceAssessment`'s blend for `monster_raider_pressure` (zero where no site — a new weighted source would have diluted every siteless town).
- **Danger:** the suppression of §3.4.
- **Counterforces (ST12):** UPKEEP — the funding band falls with the holder's prosperity and the keep wears (§6.1); RESENTMENT — a crown's garrison in a member's land is PL's control instrument (OD-PL-33): ST supplies the occasion and PL's sworn-edge writer records it as a typed decaying incident (the memory-weave idiom PL already uses for instruments that wear; PL registers the incident word in its own commit); THE SIEGE IT INVITES — a held fort is a target (ST-2b); A TRAITOR AT THE GATE — ES's product, a provocateur's lean on `site_siege`'s draw (ES's inbox; slot); A DEN IF WITHDRAWN — an abandoned keep is an unheld site an untied band may take (§6.7).

---

## §5 THE OTHER KINDS — counterforce, receipt, and when each lights (ruling 22: every other kind lights with its own system)

| Kind | Counterforce (requirement 2) | The felt receipt (one per effect) | Lights with |
|---|---|---|---|
| `watchtower` | upkeep; a blinded watch (`worn` when an untied force takes a site at hand unseen); the omniscient arm makes it moot (no rumor road) | "Thornwatch's watchers saw the column cross the ford." | C1 (the belief presets; IN/ES's witness plane) |
| `tower` | the arcane gates' own counterweights; the tower's wards spent in a crisis; a rogue mage's tower is an arcane hazard | "The warded tower above Kell holds the dead ground back." | the magic program's lighting (MF is outside FP per OD-FC-38; the landed arcane stressors are the seam) |
| `shrine` | the incumbent creed's hysteresis; a rival creed's shrine pulls the other way; desecration | "The abbey at Merewick keeps the old faith strong in the valley." | C5 (WF; `faithSpreadEnabled`, dramatic and full) |
| `waystation` | upkeep; tolls wait on EC-6; a roost if abandoned | "Caravans rest at the Crossed Keys and the road runs cheaper." | C7 (WY) / PS |
| `crossing` | upkeep; an enemy cuts it; a toll-robber | "The bridge at Ashford stands; the road to Kell is short." | C7 / C14 (PS: the border gate) |
| `resource` | ⛔ STOP-ST-2 (no yield seam) | — | by reference now (the record only) |
| `hospice` | the outbreak overwhelms it; upkeep | "The hospice at Tolle took in the sick." | the plague front (PG; the pestilence front lit) |
| `harbour_works` | upkeep; a blockade wears it; a pirate haven | "The mole at Saltmere shelters the fleet." | C7 (the sea arms; the war program's W10/W11) |
| `ruin` | — | — (held: nothing; a den: §14) | ST-2 (dens) |

---

## §6 HOW A SITE CHANGES HANDS

### 6.1 The one stage (ST-0's car; `src/domain/sites/siteStage.js :: advanceSites`)

A LEAF called at the head of `calamityKernel.js :: advanceCalamity` right after MN's menace stage (+3 host lines: the call and the merge of `{ worldState, newsEntries, receipts }`), before the calamity's own flag gate; zero kernel lines. It runs every tick, in this fixed order, each step a call to ST's one writer with `causedBy` on every event:
1. **Holders that ended.** A settlement holder or anchor that no longer stands (`lifecycleStatusOf` non-empty, or absent from the campaign) → holder cleared if it was that settlement, `abandoned`, `lastHolder` lapses (ST14). A person holder the DM has killed (the ledger's verdict; death is never the engine's) → `abandoned`. A menace holder that ended, stilled, waned or moved on (MN's record) → the site unheld, `cleared`, `causedBy` the menace's own event (the MN-r1-2 release idiom).
2. **Wear and restoration** (on a YEAR crossing, keyed by year — the rite idiom; `seasonForTick(...).year`): a tied holder at `funded`/`lavish` → `restored` one band if below `sound`; `meagre` → holds; `unfunded` → `worn` one band; an unheld or untied site → `worn` one band every second year (DRAFT, UNMEASURED). A `ruin` never changes quality.
3. **Abandonment by want** (the owner's "abandonded due to lower prosperity"; ruling 11a): a tied holder whose derived band has read `unfunded` for one season (DRAFT 13 weeks, UNMEASURED; the dwell tracked by the last `worn`/`garrisoned` event's tick, no new field) → `abandoned`, holder cleared, `lastHolder` set. A DM-set band never abandons.
4. **Dens** (ST15): an untied force arriving at an unheld site → `site_taken`; at a held site → `site_siege`. The arrivals are produced by their owners: WC-12's located unit choosing a site as its parking place (WC-12's resolver calls ST's door; unbuilt — the slot), a menace whose DM-set course is `toward <site>` or `besieges <site>` (MN's `MENACE_COURSES` gain a site target when ST lands — MN's additive row), a DM verb.
5. **Reclaim offers** (ST13): for each site that became unheld or untied this tick whose `lastHolder` court stands → `site_reclaim` in its week.
6. **Clearings:** an attached tied court whose town the den presses (the ST presence feeder on that town ≥ 0.40, DRAFT) and whose own force can contest it (`offensive` from the capacity lookup against the den's might, ratio ≥ 1.2, DRAFT) SORTIES through its own `clearingFork` — the court's landed risk posture (`strategicPosture.js`, requirement 10) as the one bounded signal — → `site_cleared`. The reclaim's `moves` against an untied holder opens the same contest; a grouped patrol (THE PATROLS) and the party (PT's door) are the other clearers.
7. **Standing sieges:** each `site_siege` resolves its week (§8).

**Clock** (requirement 9): weekly steps; wear and restoration yearly; abandonment after a season; reclaim and clearing in the week. **Kernel order:** the danger step (`advanceEmbattlement`, kernel ~2391) runs BEFORE the calamity stage (~2527), so a site change is felt on the roads the following tick (read-last, write-next; stated, not a defect).

### 6.2 The DM's hand — four realm verbs (each ≤ four dials; a realm-manifest row; a proposal whose `targetSaveId` is the site's ANCHOR settlement with the site on a `subject` dial, `anchor␟siteId` — MN9's convention; AUTHOR acts provenance-marked as authorship; premium)

| Verb | Hat | Dials | What it does |
|---|---|---|---|
| `PLACE_SITE` | AUTHOR | `kind` (enum) · `name` (text) · `where` (target: a settlement = its country, or `a␟b` = the road) · `holder` (enum: none · the anchor's garrison · the anchor's civil hold · the anchor's clergy · a ledger person · an untied band) | mints the record (`placed`; or `adopted` when it comes through the map's offer with its `offerRef` and position as provenance; or `ruin_left` from a dying settlement's card); quality `sound` (a `ruin` `ruined`); a shrine takes the anchor creed's key as its `deity` unless the DM picks another, and is `hidden` by default (J384 (10)) |
| `SITE_HOLDER` | ORDER (AUTHOR when `hat` = `author`) | `subject` · `holder` (target/enum) · `might` (enum, an untied band only) · `hat` (`order · author`) | an ORDER goes through the world's grammar (a court's garrison moves in = `garrisoned`; a band is set down = `taken`); an AUTHOR act "is so" |
| `SITE_STATUS` | AUTHOR | `subject` · `event` (enum: `abandoned · destroyed · restored · consecrated · revealed · hidden`) · `funding` (enum: a band, or `derived`) · `quality` (enum, or `as is`) | the DM's dated events and the funding override |
| `END_SITE` | AUTHOR | `subject` · `reason` (enum: `gone · razed · re_kinded`) | writes `ended`, a chronicle line, and drops the record (lived history stays in the chronicle; undo restores it) |

### 6.3 The world's ordinary roads (the owner's second word; ruling 11) — each through an EXISTING writer that calls ST's one writer

| Road | The existing writer / hearing | The site event |
|---|---|---|
| ABANDONED by want | ST's stage, step 3 | `abandoned` |
| TRADED with its land | WR-10's sovereignty conveyance (`sovereigntyIntent.js`; `TRANSFER_SOVEREIGNTY`'s asset dial — "Every holding a campaign court could convey" — gains sites; the landed `sovereignty_conveyance` hearing, `conveyed · refused`); the SITE conveys at once; the LAND moves only through the host's territory mechanism (on a canonized world a receipted, DM-confirmed re-canonize — J388; aspatially the land stays and only the holder changes, so the receiver is attached by distance from the site) | `conveyed` |
| CONQUERED BY SIEGE (same as a settlement) | `site_siege` (§8); a `falls` hands the site to the attacker's holder class — a hostile settlement's garrison, or an untied force (then ST8) | `besieged` · `taken` / `seized` · `relieved` |
| CEDED in a peace | GRAMMAR's peace-term catalog: a `site_cession` TERM row beside the trade-rights rows (GRAMMAR's commit; the seam executor calls ST's writer) | `ceded` |
| GRANTED as a fief | PL's charter occasion (a site given to a member with its attachment; PL's commit) | `granted` |
| SEIZED in a polity war | PL's verdict writer (`applyPolityVerdict`'s typed patches, PL-r1-2) names the site; ST's writer applies it | `seized` |
| CLAIMED by a faith | WF's hierarchy (the clergy as holder) — WF unlanded: the slot; the DM's `SITE_HOLDER` meanwhile | `consecrated` |
| SOLD | the conveyance road with coin when the treasury lights (`treasuryEnabled`); dark meanwhile | `sold` |

[REFINED 2026-10-18 (fp-final) — ST2's "one writer" is exact: ONE module (`siteLedger.js`) with a CLOSED, pinned list of callers — the realm verb arm, ST's stage, the war layer's keep leaf, GRAMMAR's peace-term executor, PL's charter and verdict leaves, WR-10's conveyance arm — the ONE PERSON STAGE's registration idiom; a walker fails on any other importer of its write functions.]

### 6.4 The last to act has the first claim (ST13; ruling 10)

`site_reclaim` is offered to `lastHolder`'s court in the week the site falls empty or untied, BEFORE any other court's clearing or garrisoning may move on it that week. Its DEFAULT (the court's own fork): `moves` when the court stands, its funding band is at least `meagre`, and — against an untied holder — its force can contest the den (§6.1 step 6); else `declines`. `moves` on an unheld site = `reclaimed` + `garrisoned`; on an untied one = the `site_cleared` contest. A decline (or a court that cannot) opens the site to whoever acts next: the attached courts by distance band (nearest first, codepoint tie-break), the party by deed. A preference, never a right — nothing is forbidden, and the DM may decide any week.

### 6.5 A site outlives its town (the owner's third word; ruling 13; ST14)

A settlement founded over a site (ENC-HP-01: the map's placement folds the site in; or the DM's founding) HOLDS it like any holder: the site's anchor and holder name the settlement (the site carries the reference; no settlement field is added — one reference direction). When that settlement fails by ANY lifecycle path — terminal decline, the DM's `forceAbandonSettlement`, a razing, a world imported without it, a regeneration that does not re-create it — §6.1 step 1 leaves the site standing: holder none, `abandoned`, quality unchanged then wearing, attachments re-derived to the surviving neighbours, the first claim lapsed. The dying settlement's card OFFERS "leave a ruin" (`PLACE_SITE`, kind `ruin`, `placedBy: 'ruin_left'`, the dead settlement as `lastHolder` for the chronicle only) — the DM's act; the engine never spawns one.

### 6.6 A den that presses a member (ruling 12 — the legible consequence)

When an untied site's presence feeder on a SWORN member's town has stood at or above 0.40 (DRAFT) for one season (DRAFT 13 weeks, UNMEASURED) and no clearing has been opened against it by the member or its liege (the liege's own sortie if it is attached; else its army through ST-2b; or a decided relief PL already owns), ST supplies the occasion `den_unanswered` and PL's fealty-record writer records `protection_failed` on the sworn edge — PL's one writer, the occasion registered in PL's own commit (the SEAMS-r1-2 registration idiom) — carrying the member's resentment patch `protection_failed` already carries (PL §4.3, P9). So a crown that lets its border forts rot loses their protection AND makes dens that press its own members, and its hold frays by the protection record it already reads. The clock: weekly check, one season's dwell; the receipt names the den and the liege.

### 6.7 Who makes a den (the owner's ninth word; ruling 23; ST15)

| The untied holder | Who brings it | Emergent or the DM's |
|---|---|---|
| a brigand body | WC-12's located raiders choosing a site to park in (unbuilt — until it lands, engine-born dens do not occur) | EMERGENT — the world's own |
| a cult | the faith system's own heresy (a slot until WF names a cult actor) | EMERGENT when WF lands |
| a menace | the DM's course (`toward` / `besieges` a site), or `SITE_HOLDER` | THE DM'S ALONE — never organically emergent (MN12) |
| a DM-authored band or cult | `PLACE_SITE` / `SITE_HOLDER` with `might` | THE DM'S |
| a villain paragon | its own weekly choice (CH §4.4's weights gain a site row: a post, a tower, a lair) — the paragon exists only because the DM introduced it | EMERGENT CHOICE of a DM-introduced person; its purpose only by the DM's direction |

Promotion of an ambient brigand den into a named menace is the DM's act (MN12's adoption road: `RAISE_MENACE` in that country), never the engine's.

---
## §7 SITES CONSIDERED EVERYWHERE (the owner's eighth word; ruling 20; ST18)

### 7.1 BY CONSTRUCTION — the coverage census (every decider that reads these numbers considers sites with no wiring of its own)

| The one read (ST's seam) | Its consumers (`path :: symbol`) | Evidence |
|---|---|---|
| `homeDefense` (`buildCapacityLookup` + `siteDefense`) | the siege verdict `warSiegeVerdict.js :: resolveSiegeVerdict`; the defender-attrition seed in `warDeployment.js :: evaluateWarLayer`; allied relief `warCapacityReads.js :: computeAllyRelief` (minus `siteDefense`); MN-2's menace siege resolver (MN §5); the war chooser's target weighing through the same `capacityFor` (`buildOriginEnvelope`); the dossier's war page `display/warResolve.js` (the DEFECT ST-1 cures: it recomputes `homeDefense` itself) | CONFIRMED (the chooser's read PLAUSIBLE) |
| the danger ledger (`advanceEmbattlement`'s presence term) | `embattlement.js :: scoreRoute` / `chooseRoute` (caravans, columns, supply shipments re-score by danger), `routeDangerLevel` + `banditryLoss` (realized trade loss), the roads gauntlet, migration road deaths, charters and the believed view (MN5's list) | the four exports CONFIRMED; the rest by MN5 (PLAUSIBLE here) |
| the stressor birth gates (`STRESSOR_SPAWN_GATES` rows) | every stressor birth the raider, criminal-corridor, infiltration, arcane, conversion and outbreak gates decide (`stressors.js`) | CONFIRMED |
| the counterforce (`counterforceAssessment` + the additive site term) | every stressor's resolution chance and decay (`stressors.js` lines calling `counterforceAssessment`); the resolution receipt's source list | CONFIRMED |
| the threat index (`buildThreatByCid`) | martial readiness and mobilization (`martialReadiness.js`) | CONFIRMED |
| care (`care01Of`) | the pestilence front's spread and relaxation (`spatial/pestilence.js` reads `care01Of(id)`) | CONFIRMED |
| faith strength (the contest's `strengthByRef`) | the faith contest's spread, conversion and standing (`religiousContest.js`) | PLAUSIBLE (named at ST-3's car-0) |
| route cost (`scoreRoute`'s site term) | every mover that re-scores candidate routes; THE PASSAGE's believed cost (PS item 5) | CONFIRMED (PS by its brief) |
| the witness set (`siteWitnesses`) | the rumor road's hop-0 witnesses (IN; RN's arrival records); THE PASSAGE's notice (the quiet crossing); THE PATROLS' notice | PLAUSIBLE (each named at ST-3's car-0) |

**THE COVERAGE WALKER** (`tests/lint/siteCoverage.walker.test.js`, ST-5): (1) every module that computes a home-defence figure reads `siteDefenseOf` or `buildCapacityLookup` (no parallel number); (2) every host of §3.3 imports its lean from `sites/siteEffects.js :: siteTermAt` (one leaf); (3) only `sites/siteLedger.js` writes `worldSites`, and its importers are exactly §6.3's closed caller list; (4) `defenseLedger.js` imports nothing from `sites/`.

### 7.2 BY ONE NAMED READ — where a decider must know a site AS a site

| Decider | The read | Status |
|---|---|---|
| THE WAR CHOOSER — target a den or a fort | `sitesNear` + the deployer's `site` target arm (ST-2b: a deployment record gains `siteTargetId`; the siege loop resolves `site_siege` through ST's resolver instead of dropping the target — `warDeployment.js` today: "`if (!snapshot?.byId?.has?.(targetId)) continue;`") | a CAR (ST-2b), measured at its car-0 |
| THE PASSAGE planner — forts on the path as sieges to take or bypass | `sitesNear` on each node of the path; the fort's siege weeks in the believed cost (PS item 5) | PS's wave cites it |
| THE CALL BOARD — dens as calls | CH §14's `wildland` domain gains a source row: an untied-held site attached to a settlement, `side: 'help'`, known by presence, arrival or belief like every call | CH's commit registers the row |
| THE MENACE'S course — aim at a site | `MENACE_COURSES` `toward <site>` / `besieges <site>` (MN's additive row; `MENACE_WHERE_KINDS` gains `site` — MN14) | MN's commit |
| A PARAGON'S weekly choice — a post, a tower, a lair | CH §4.4's weights gain one site row (a warden weighs a watchtower, a wizard a tower, a villain an unheld keep) | CH's commit |
| THE PARTY — journey, presence, reach, clearing | PT's `presentAt` gains `siteId?` additively; `party_reached_site` (ENC-HL-04's event) and the reveal are PT DEED DOORS (`party_event`); a party clearing a den is a `party_event` deed with the DM's `SITE_HOLDER` act in the same week | PT's commit |
| THE DOSSIER — the threat page and the defence page | `sitesNear` (the town's sites, their holders, their effects, each with its felt line) | ST-1 / ST-3 surfaces (EDITOR lines) |
| THE MAP — lenses and the world-site record | the window reads `worldSites` (H17/H23 rows; the map's `WorldSiteHost`), never re-derives a holder; H13's "held sites (forts, watchposts) with holder and garrison band" (`PolitySite`) and a patrol's round trip "measured from the nearest garrisoned seat or site" read it | ST-4 (the map's adoption); the map's own milestones |
| EVERY HEARING CARD's WHERE | the fold's WHERE table's `site` row (§3.4 companion table) | the fold |

### 7.3 THE ACTOR CONVENTION GAINS `site`

`settlement · person · party · menace · site` — the fold's SP-4a amendment row (OD-FC-57; `strategicPosture.js :: POSTURE_ACTOR_KINDS`) widens again by one name; a site is an actor ref only as a hearing's WHERE and a target (`{ kind: 'site', id }`), never a decider; the proposals' `targetSaveId` stays the anchor settlement and the site rides the `subject` dial.

### 7.4 THE COVERAGE TABLE — one row per FP program (the seams skeptic attacks this; each existing volume gains ONE bracket in round 2 citing its row: "sites considered: …")

| Program | How it considers sites |
|---|---|
| SP (the shared spine) | BY THE SITE READ — `POSTURE_ACTOR_KINDS` gains `site`; SP-9's docket hosts ST's four kinds (`registerEngagementKind`) |
| CW (the cross-wires; C0.5 THE CAUSE WALK) | BY THE ONE READS — every site event carries `causedBy`; the walk reaches a site's events and the gate row's reason with no wiring |
| GR (the pact grammar) | BY THE SITE READ — a `site_cession` term row (beside the trade-rights rows); a treaty's terms may name a site |
| IN (information) | BY THE ONE READS — the watchtower's witnesses ride the rumor road; a `hidden` site is in no court's belief |
| ES (espionage) | BY THE ONE READS + a slot — a spy ring or a quiet crossing is noticed through the witness set; a traitor at a fort's gate is ES's product (a provocateur's lean on `site_siege`'s draw — ES's inbox) |
| TR/EC (trade, economy) | BY THE ONE READS — `scoreRoute`'s site term; EC-6's toll arm is the slot for a site's tolls; ⛔ STOP-ST-2 the resource yield |
| WF (faith) | BY THE ONE READS — the shrine's lean on the contest's strength; WF's hierarchy claims (`consecrated`) and a cult holder are WF's slots |
| POP (populations) | BY THE ONE READS — migration road deaths read the danger ledger; columns' route choice reads `scoreRoute`; steadings are NOT sites (J384 (11)) |
| INT (the interior) | NOT APPLICABLE — the interior's factions and councils read the town's own numbers; a site touches them only through those numbers (crime, faith, defence) |
| WY (wayfare) | BY THE ONE READS — the inhabited roads read danger and `scoreRoute`; a waystation or crossing is felt on the stretch; WY's single projection carries a site's map piece |
| HB (habit conditioning) | BY THE ONE READS — a den's buy-off or a clearing teaches through WC-12's graded close (WC §1.8.1 → HB 4.1); ST mints no habit |
| WC (war circulation) | BY THE SITE READ — WC-12's located unit parks in a site (dens); its contest reads `siteTermAt(…, 'security')` beside `defenseLedger`; the vassal-garrison inbox row has MOVED HERE (fold §3.1.29) |
| EP (the advance epoch) | BY THE ONE READS — a long advance runs §6.1 on defaults; site events are lived history (immutable; THE PROMISE) |
| PL (the polity) | BY THE SITE READ — a crown's fort in a member's land is the control instrument (OD-PL-33); a den pressing a member unanswered is a `protection_failed` occasion (§6.6); fiefs and seizures are §6.3's roads |
| MN (the menace) | BY BOTH — the presence term's second feeder (MN5); a menace in a site makes a lair (MN14); `MENACE_COURSES` gain a site target; a keep stands in `homeDefense` against MN-2 |
| RN (the renown) | BY THE ONE READS — a cleared den is a deed through the doors that already mint (PT's for the party; an engine court source is RN's slot row `site_verdict`, §8) |
| CH (the champions) | BY THE SITE READ — the call board's `wildland` row; a paragon's choice weighs a post, a tower, a lair; a villain paragon holder is untied |
| PT (the party) | BY THE SITE READ — presence at a site, reach and reveal doors, clearing deeds |
| PS (the passage) | BY BOTH — a crossing's holder is the gate's holder; forts on the path are sieges to take or bypass; a manned watchtower defeats the quiet crossing |
| PR (the patrols) | BY BOTH — a fort's garrison patrols its attached stretches; patrols subtract on the same presence term; a grouped patrol may open `site_cleared`; a watchtower extends a patrol's notice |
| LG (logistics) | BY THE ONE READS — journeys and fleets read `scoreRoute` and the danger ledger; a harbour works is C7's sea arm |
| PG (pestilence) | BY THE ONE READS — the hospice's lean on `care01Of`; a plague pit's lean on the outbreak gate (one plague truth; the host's plague-10.2-7 defect is PG's) |
| the war volume | BY BOTH — `homeDefense` and the siege words; ST-2b's site target |
| the map | BY THE SITE READ — the world-site record, H13's held sites, the patrol round trip's origin, the hearing card's WHERE |

---

## §8 THE HEARINGS (requirement 24; the registry rows ST owns; WHERE = `site`)

| Kind | Owner | WHERE | Climax tick | Verdict vocabulary | Class | The engine's DEFAULT | Parties | The tilt |
|---|---|---|---|---|---|---|---|---|
| `site_taken` | ST (ST-2) | `site` | the week an untied force arrives at an UNHELD site | `held_by_them · driven_off` | CLIMAX | `held_by_them` — unless an attached tied court sorties that week (§6.1 step 6), whose contest then decides | `{ kind: 'menace' \| …band ref… }` upon `{ kind: 'site', id }` | a draw bias on the contest, ±0.05 / ±0.15 (DRAFT; MN's idiom) |
| `site_cleared` | ST (ST-2) | `site` | the week a tied force moves on an untied-held site (a sortie, a reclaim's `moves`, a grouped patrol, an army through ST-2b) | `cleared · repelled` | CLIMAX | the contest: the force's strength (its `offensive`, or the patrol's band) against the holder's might on `SIEGE_VERDICT_BANDS`, one keyed draw (stream `site_cleared:<siteId>:<tick>`) | the clearer `{ kind: 'settlement', id }` upon the holder | the same draw bias |
| `site_reclaim` | ST (ST-2) | `site` | the week the site falls empty or untied and its `lastHolder` court stands | `moves · declines` | CLIMAX | the court's fork (§6.4) | `{ kind: 'settlement', id: lastHolder }` toward `{ kind: 'site', id }` | the DM may decide either way; no tilt (a choice, not a contest) |
| `site_siege` | ST (ST-2b for armies; ST-2 for menaces) | `site` | every week an army or a menace besieges a HELD site | `holds · falls · relieved · lifted` — the siege kind's ONE vocabulary (`relieved` = ended by relief, the fold's R-10 meaning) | STANDING | ST's resolver: the attacker's strength (an army's effective strength; a menace's might on the latent scale) against the site's GARRISON BAND in place of walls (`siteDefenseOf`'s value for the holder's own seat, at full distance), on `SIEGE_VERDICT_BANDS`, with MN-r1-1's seasonal wear and the age ceiling (a siege that neither falls nor lifts for DRAFT 13 weeks lifts by exhaustion), so no endless `holds` | the attacker upon the holder | the same draw bias; the DM may give any verdict |

[REFINED 2026-10-18 (fp-final) — the brief's `site_fallen` (CLIMAX; `holds · falls`) and `site_siege` (STANDING; the siege words) were one fact heard twice; ONE kind, `site_siege`, carries it on the registry's one siege vocabulary.] **No party kind:** none of ST's kinds is a party kind; the party's dealings with a site are PT's doors, and requirement 24's party default ("nothing has happened to the party yet") is never ST's to compute. **Not hearings:** the party's reach and reveal (PT deed doors, never the engine deciding the party's fate); wear, restoration and abandonment (the world's slow course, receipted, never a docket item — they decide nothing between two parties); the DM's own verbs. **The three choices** (requirement 24): at a one-week advance the DM may leave the week to the engine, tilt it, or give the verdict; the hearing seal is read FIRST by ST's resolvers. **Only on the week:** each kind is minted only at the DM's one-week advance and lives that week; a month, season or year advance resolves every week on the default and leaves each week's receipt; nothing queues (requirement 24's binding on every kind). **The docket:** ST registers its four resolvers with SP-9 (`registerEngagementKind`); with `hearingWeekEnabled` dark the default resolves in its tick. **The card** (requirement 24(g), the Evidence Law): who, upon whom, where, the default — "Brigands under the Red Hand have come to the abandoned keep at Thornwatch. Left alone, they hold it." · "Kell's levy has marched on the robbers at the Crossed Keys. Left alone, the levy drives them out." · "The keep at Thornwatch, Kell's last, stands empty. Kell may send a garrison." On scrutiny the card names its READ (the force's band against the holder's might, in the might words). **RN:** a court's clearing mints no deed until RN's ENGINE-SOURCE slot opens; ST names its candidate source row `site_verdict` for that slot (RN §3.1).

---

## §9 THE FLAGS (virtual; absent-when-dark; read `=== true`; lit in NO preset at landing; premium)

| Flag | Gates | Requires | Lit-mutant pins | Presets it may light in |
|---|---|---|---|---|
| `worldSitesEnabled` | the record, the DM's four verbs, the map's adoption, the stage's steps 1–3 (endings, wear, want), the dossier lines | — | dark: no `worldSites` key ever written, the verbs absent from the manifest, the stage returns the same worldState object; lit-mutant: a placed site survives save/load/regenerate | every preset (the record is aspatial-safe); the default preset only through the host's BIRTH-DOOR CHECK first (fold §7: a born campaign carries the default preset's name but none of its switches) |
| `siteEffectsEnabled` | every lean of §3 (`siteTermAt`, `siteDefense`, the presence feeder and suppressor, the witness set, the `scoreRoute` term) | `worldSitesEnabled` | dark: every host's lean returns its neutral (×1 rows absent, +0) and `homeDefense` is byte-identical; lit-mutant: a sound funded keep at hand moves `homeDefense` by its term; an untied keep's town latches embattled on a canonized map | the stressor presets (gates, counterforces, care, faith arms by their own flags); the danger arm on canonized worlds; the defence arm under `warLayerEnabled` |
| `siteFatesEnabled` | the stage's steps 4–7 (dens, reclaim, clearing, sieges) and ST's four hearings | `worldSitesEnabled`; `hearingWeekEnabled` for the pause (dark → defaults in-tick) | dark: no site ever changes hands but by the DM; lit-mutant: an abandoned keep a band arrives at becomes `taken` in that tick on the default | as `siteEffectsEnabled` |
| `siteWarTargetEnabled` | ST-2b: a settlement's army may target a site; the approach fort's `site_siege` on PS's transit leaf | `siteFatesEnabled` ∧ `warLayerEnabled` | dark: `warDeployment.js` drops a site target exactly as today | the war presets |

Certification rows: one per flag in the certification registry (the house's subsystem rows), each with its aliveness signal (`worldSites` entries; site leans fired per year; site hearings minted; site sieges resolved).

---
## §10 THE WAVES (each carries requirement 16's FIRST-VISIBLE, 17's TIER and DEGRADED ARM, L10's five-member EDITOR line, 13's Alignment line and 20's `causedBy`)

ST is a coupling CARRIER across **WAR · TRADE · INFO · FAITH · HEALTH**; its prefix `ST` is chartered with its first coupling-registry row (requirement 21(a)/(c)). HBF rows minted, each in its wave's commit (L10(a)): `siteClearedContest`, `siteSiegeVerdict` (each one keyed draw). Chain **C15 THE SITES** sits with C14 THE PASSAGE (they share the border gate), after C0 · C0.5 · C1 and before the polity's deeper waves (the chair's order note, ruling 22); its FIRST FELT CHAIN is ST-0 → ST-1 (the fortification alone); every other kind lights with its own system (§5).

**ST-0 — THE RECORD, THE DM'S HAND, THE MAP'S ADOPTION.**
- **Car-0 (a MEASUREMENT before any ST line):** re-measure MN-0's stage host with ST's leaf beside MN's (`calamityKernel.js :: advanceCalamity` 461; MN-0's four STOP conditions inherited verbatim; ⛔ STOP at build if the host cannot carry a second leaf under 800 or if MN-0 chose another host — then ST's stage follows MN's host); measure `realmManifest.js` (474) and `realmVerbExecution.js` (663) for four entries (leaf-first: the entry objects live in `sites/siteVerbs.js`, the manifest spreads them, ≤ 3 host lines; the apply arm dispatches to `sites/siteVerbApply.js`, ≤ 4 host lines).
- **Leaves.** `src/domain/sites/siteLedger.js` (the one writer, `applySiteEvent`; the normalizer; FNV ids; the vocabularies of §2.3); `sites/siteRead.js` (`siteAt`, `sitesNear`, `attachmentsOf`, `fundingBandOf`); `sites/siteStage.js :: advanceSites` (steps 1–3 of §6.1); `sites/siteVerbs.js` + `siteVerbApply.js`. **Host edits.** `calamityKernel.js` (+3); `realmManifest.js` (+≤3); `realmVerbExecution.js` (+≤4); `spatialUsage.js` (a TRACKED `worldSites` row); the dying settlement's card (the "leave a ruin" offer; a UI leaf).
- **FIRST-VISIBLE:** the authorship receipt and the dossier line at the approval, the same advance — "Kell's garrison holds the keep at Thornwatch." · **TIER:** aspatial-safe; every preset; premium; the omniscient default's arm is the same (no belief involved); the map's adoption only on a bound map world (canonized ≠ premium — the chair's HOST-r1-2 ruling) · **DEGRADED ARM:** without the map, node-keyed places and no positions · **EDITOR:** (a) forks — none (ids from the verb's event id; registers nothing and says so); (b) seals and conditions — the predicate `sitePresent`; the four verbs' predicates with `realmVetoProse` reasons `site_gate_dark` · `site_unknown` · `site_holder_invalid`; (c) the counterparty — the verbs anchor on real settlements only; a site is never an anchor; (d) the tick and the states — no institution or person writes; (e) the record and the vocabularies — `worldSites` is worldState-side lived history outside the record register and `rederive`; `SITE_KINDS · SITE_QUALITY · FUNDING_BANDS · DISTANCE_BANDS · HOLDER_CLASSES · SITE_EVENTS` are save-data contract · **Alignment:** alignment-empty WITH REASON — a site is not a court · **`causedBy`:** every event's parent is the verb's outcome id (or the dying settlement's death receipt for `ruin_left`).

**ST-1 — THE FORTIFICATION (C15's first felt chain).**
- **Car-0:** measure `buildCapacityLookup`'s callers (every reader of `homeDefense` gets the term — the census of §7.1 executed, `display/warResolve.js` included); measure the war layer's patch window (§4.2's STOP condition, then the fallback); measure `counterforceAssessment`'s headroom (759: ≤ 2 lines through `sites/siteEffects.js`; ⛔ STOP at build if more are needed — then the term rides the stressor's resolution receipt only).
- **Leaves.** `sites/siteEffects.js` (`siteTermAt`, `siteDefenseOf`, `keepTakesTheBreach`, `sitePresenceFeeder`, `siteSuppression`). **Host edits.** `warCapacityReads.js` (+3: `siteDefense` and the relief subtraction); `warDeployment.js` (+3: the breach); `display/warResolve.js` (+1); `embattlement.js` (+≤3: the feeder and the suppressor inside the presence composition MN-1 builds); `stressorGates.js` (the fortification's and the untied rows: ≤ 6 lines through one leaf call per gate); `stressorDynamics.js` (+≤2); `martialReadiness.js` (+≤2: the untied threat input).
- **FIRST-VISIBLE:** the siege card's keep line the first siege week — "Kell's keep stands ready." — and, for a den, the town's danger and the gate row's reason the week the den is placed ("Brigands hold the old keep above the road.") · **TIER:** the defence arm under `warLayerEnabled` (war presets) and MN-2 wherever menaces light; the gates and counterforce aspatial-safe in every stressor preset; the danger arm on canonized worlds only (the embattlement marker); premium; the omniscient default carries the gates, the counterforce and (where the war layer is lit) the defence arm; FUNDING rides `treasuryEnabled` for coin (dark everywhere: the band is derived from prosperity or DM-set, so "the crown let its forts rot" reads prosperity, not a treasury) · **DEGRADED ARM:** aspatial — no danger term, everything else whole · **EDITOR:** (a) forks — none in ST-1 (the breach rides the siege's own draw); (b) seals — the siege card's keep line; (c) the counterparty — a keep's holder must be a real settlement for `siteDefense`; (d) the tick — the war layer's verdict tick; the quality step through the patch or the fallback; (e) the record — `siteDefense` is a derived envelope field, never stored · **Alignment:** alignment-empty WITH REASON (no court decides in ST-1) · **`causedBy`:** a `breached` event's parent is the siege outcome's id.

**ST-2 — THE DENS, THE RECLAIM AND THE CLEARING (`siteFatesEnabled`).**
- **Leaves.** `siteStage.js` steps 4–7; `sites/siteHearings.js` (the four resolvers, registered with SP-9); `sites/clearingFork.js`. **Host edits.** none beyond SP-9's registration (the docket is SP-9's).
- **FIRST-VISIBLE:** the week a band arrives at an abandoned keep — "Brigands under the Red Hand have come to the abandoned keep at Thornwatch." · **TIER:** aspatial-safe (hops); every stressor preset; premium; engine-born dens need WC-12 (`freeCompaniesEnabled`) — until then dens are the DM's (placed bands) and menaces' (the DM's courses); `hearingWeekEnabled` for the pause · **DEGRADED ARM:** no engine-born dens; reclaim and clearing still run on DM-placed dens · **EDITOR:** (a) forks — `siteClearedContest` and `siteSiegeVerdict`, each `rng.fork('site:<kind>:<siteId>:<tick>')`; (b) seals — the four hearing seals read first; (c) the counterparty — the clearer and the reclaimer are real settlements; an untied holder is a ref, never a court; (d) the tick — weekly; (e) the record — `siege` and `lastHolder` fields · **Alignment:** the `clearingFork` reads the court's risk posture (requirement 10) — the alignment coupling rides that read (requirement 13: a lawful court answers a den on its road, a chaotic one lets it lie unless pressed) · **`causedBy`:** each hearing's verdict parents its site event.

**ST-2b — THE WAR'S SITE TARGET (`siteWarTargetEnabled`).**
- **Car-0:** measure `warDeployment.js` (685) for the `siteTargetId` arm (a deployment record gains the field — persisted shape 2 of 2, the war's record; the siege loop routes such a deployment to `site_siege` instead of `continue`); measure THE PASSAGE's transit leaf for the approach fort's hold (⛔ STOP at build if PS's leaf has no host — then the approach fort waits on WC Arc A's `armies_meet` leaf, and only the at-hand keep defends).
- **FIRST-VISIBLE:** the week the army arrives — "Ashford's host is at the keep of Thornwatch." · **TIER:** war presets (`warLayerEnabled`); premium · **DEGRADED ARM:** sites are taken by menaces, bands and the party only · **EDITOR:** (a) forks — `siteSiegeVerdict`; (b) seals — the siege card; (c) the counterparty — a site target always has an anchor settlement; (d) the tick — the war layer's; (e) the record — `siteTargetId` on the deployment record (declared, drop-when-absent) · **Alignment:** the war chooser's own · **`causedBy`:** the deployment's id.

**ST-3 — THE OTHER KINDS.** One car per kind, each lit with its system (§5): `tower` (the arcane gates and counterforce), `shrine` (the faith contest's strength — car-0 names the field; C5), `hospice` (`care01Of`; the plague front), `watchtower` (the witness set — car-0 names the rumor road's witness seam; C1), `waystation`/`crossing` (`scoreRoute`'s per-hop term; C7/C14), `harbour_works` (the sea arms — car-0 names W10/W11's seams; C7). `resource`: ⛔ STOP-ST-2. Each with FIRST-VISIBLE its §5 receipt; TIER per its system; DEGRADED ARM the record without the lean; EDITOR (a) none; (b) the gate rows' reasons; (c) real settlements; (d) the host's tick; (e) none stored · **Alignment:** alignment-empty WITH REASON · **`causedBy`:** the lean's receipt names the site.

**ST-4 — THE MAP'S WINDOW AND THE PARTY'S REACH.** The window rows (H17/H23) carrying `worldSites` to the map as the host record (one name chosen with the map — OPEN Q2); H13's `PolitySite` and the patrol round trip read it; PT's `party_reached_site` and reveal doors (PT's commit); the call board's den row (CH's commit). **FIRST-VISIBLE:** the map draws the site with its holder and status the advance after placement · **TIER:** a bound map world; canonized ≠ premium · **DEGRADED ARM:** the dossier lists the town's sites · **EDITOR:** (e) the window rows are presentation; nothing stored · **`causedBy`:** the reach deed's parent is the DM's act.

**ST-5 — THE MEASURE.** The coverage walker (§7.1); the soak rows (§12): sites per world, leans fired per year, keep breaches per siege, dens taken and cleared per decade, the presence term's distribution under the cap; every DRAFT constant onto the FP-46 roster with its measured spread (requirement 18); the same-seed shift recorded at each lighting unit.

### 10.1 The waves table

| Wave | What it lands | Leaves | Host edits (eff. lines) | FIRST-VISIBLE | TIER | Flag |
|---|---|---|---|---|---|---|
| ST-0 | the record, the DM's verbs, adoption, endings, wear, want, "leave a ruin" | `siteLedger` · `siteRead` · `siteStage` (1–3) · `siteVerbs` · `siteVerbApply` | `calamityKernel` 461 (+3) · `realmManifest` 474 (+≤3) · `realmVerbExecution` 663 (+≤4) | the authorship line, same advance | aspatial-safe; every preset; premium | `worldSitesEnabled` |
| ST-1 | the fortification: `siteDefense`, the breach, security rows, the raider counterforce, the danger feeder/suppressor, the den's threat input | `siteEffects` | `warCapacityReads` 143 (+3) · `warDeployment` 685 (+3) · `warResolve` (+1) · `embattlement` 172 (+≤3) · `stressorGates` 609 (+≤6) · `stressorDynamics` 759 (+≤2) · `martialReadiness` 264 (+≤2) | the keep line on the first siege week; the den's gate reason | war presets (defence); stressor presets (rows); canonized (danger) | `siteEffectsEnabled` |
| ST-2 | dens, reclaim, clearing, menace sieges of sites; four hearings | `siteStage` (4–7) · `siteHearings` · `clearingFork` | SP-9 registration only | the den's arrival line | aspatial-safe; WC-12 for engine-born dens | `siteFatesEnabled` |
| ST-2b | an army's site target; the approach fort | (in `siteHearings`) | `warDeployment` 685 (+≤6) · PS's transit leaf | the army at the keep | war presets | `siteWarTargetEnabled` |
| ST-3 | tower · shrine · hospice · watchtower · waystation · crossing · harbour (resource ⛔) | `siteEffects` rows | per kind (≤ 3 each) | each kind's §5 line | with its own system | `siteEffectsEnabled` |
| ST-4 | the map's window, H13's held sites, the party's reach and reveal, the call board's den row | (window rows) | the window builder; PT · CH commits | the map's site piece | bound map world | `worldSitesEnabled` |
| ST-5 | the walker, the soak, the roster | tests | — | — | — | — |

---

## §11 THE LIFECYCLE OF EVERY PERSISTED SHAPE (requirement 22a; a requirement-23 horizon for each)

**A. `spatialLedgers.worldSites` (the record, with its `events` ring, `lastHolder`, `siege`, `fundingSet`).**

| Path | What happens |
|---|---|
| create | only the DM (`PLACE_SITE`; the map's adoption; "leave a ruin"); the engine never spawns one (ST3) |
| read | `siteRead.js` and `siteEffects.js` only; the window; the dossier |
| persist | `spatialLedgers.worldSites`, drop-when-empty at every optional key and at the ledger (the namespace drops with its last sub-ledger); a TRACKED row in `spatialUsage.js` |
| regenerate | a regenerated SETTLEMENT does not touch the site; if the regeneration removes the anchor or holder, §6.1 step 1 applies (ST14); a regenerated WORLD (a new seed) carries no sites (THE PROMISE: sites are never generated) |
| undo | the advance ring's snapshot undo restores the ledger whole (the landed undo of `worldState`); a DM verb's undo is its proposal's undo |
| import | an imported world without a site's anchor: the site stands, unheld and re-attached (ST14); an imported site whose kind or band is not in the closed lists is REFUSED with a typed receipt (finite semantics), never coerced |
| migrate | none at landing (a new sub-ledger); the `where.position` arm is additive when the canon carries points (H5); a rename of any vocabulary withdraws pending decrees through §20.3's resolver |
| dark-after-lit | the ledger is KEPT and inert (no lean, no stage step); relighting resumes from it; the verbs vanish from the manifest |
| death | a holder's or anchor's death → §6.1 step 1; a menace holder's end → `cleared`; a person holder only by the DM's verdict |
| veil | a `hidden` site is in no court's belief and on no player-facing surface until `revealed` or until its holder acts where it is felt; the DM sees it always |
| horizon (requirement 23) | the `events` ring keeps the newest 8 per site (DRAFT); older events live in the chronicle (the advance history); the ledger is bounded by the DM's placements (no engine growth) |

**B. `deployments[*].siteTargetId` (ST-2b; the war's record, a declared additive field).** create — the war chooser's site target; read — the siege loop; persist — the war's `deployments` (drop-when-absent); regenerate — none; undo — the ring; import — refused if the site is unknown (the deployment resolves as a withdrawal, the landed wind-down); migrate — none; dark-after-lit — `siteWarTargetEnabled` dark: the deployment withdraws (the landed withdrawal path), never `continue`s silently; death — the site ended → the deployment withdraws; veil — none. Horizon: the deployment's own life.

---
## §12 THE SCENARIO MATRIX (each row a measurable assertion, or DARK)

| # | Setup | Assertion |
|---|---|---|
| S0 | every ST flag dark, any seed | the advance output is BYTE-IDENTICAL to master (no `worldSites` key, `homeDefense` unchanged, every gate row absent, the verbs absent from the manifest) |
| S1 | THE FUNDED FORT: Kell (`Prosperous`) holds a `sound` keep at hand; Ashford besieges Kell; war preset | `homeDefense(Kell)` = the base + `18 × 0.8 × 1` (DRAFT) and the siege card reads "Kell's keep stands ready"; `computeAllyRelief` for Kell's ally excludes the term; with all else equal the verdict's `pFall` falls by the term's log-odds share (measured in the soak) |
| S2 | the same, and the verdict rolls `falls` | Kell does NOT fall that week: the verdict reads `holds` with `keepBreached`; the keep is `worn` (one `breached` event); the next `falls` makes it `ruined`; the third falls the town |
| S3 | THE FORT UNPAID FOR TEN YEARS: Kell drops to `Struggling` (`unfunded`) | after one season `abandoned` (holder cleared, `lastHolder` Kell); the quality steps `worn` then `ruined` across the decade (one band a year while held unfunded, then one every second year unheld); no lean of any kind while empty (ST7) |
| S4 | THE DEN OF THIEVES ON THE BORDER ROAD: a DM-placed `capable` band takes the abandoned keep (`SITE_HOLDER`, author); canonized; Kell and Tolle attached `at_hand` / `nearby` | Kell's presence feeder 0.60 (`1 × 0.6 × 1 × 1` ≥ `ENTER_THRESHOLD`): Kell latches `embattled` the next tick; Tolle's 0.30 (no latch alone); `monsterRaiderGate` at Kell carries ×1.3 "Brigands hold the old keep above the road."; no town gets a bonus |
| S5 | three untied sites attached to Kell, each feeding 0.40–0.60 | Kell's presence = the MAX (0.60), capped once — never the sum (requirement 2) |
| S6 | THE WIZARD'S TOWER: a ledger wizard (a `champion` paragon) holds a `sound` tower at hand; a `magic_deadzone` stands in Kell | the deadzone's counterforce carries +0.15 × F × Q × D (DRAFT) and its resolution receipt names "the warded tower"; the deadzone gate at Kell carries ×0.8; if the wizard is killed (the DM's verdict) the tower is `abandoned` the next tick |
| S7 | THE ABBEY: a `shrine` of Kell's seated creed, clergy holder, `faithSpreadEnabled` lit | the creed's strength in Kell and its `nearby` neighbours rises by the bounded lean; in a `religious_conversion_fracture` at Kell the lean is ×2.5; a heretic band taking it (`untied`) LOWERS the tagged creed's strength and fires the conversion gate row |
| S8 | THE PARTY CLEARS THE DUNGEON: the DM records the party clearing the band from a `ruin` (a `party_event` deed + `SITE_HOLDER` none, same week) | the site is `cleared` and unheld; its hazard is gone the next tick; RN's deed exists with the party as doer; `site_reclaim` is NOT minted (no settlement-tied `lastHolder`); the engine minted no hearing about the party |
| S9 | A MENACE TAKES THE OLD KEEP: the DM sets the Ashen Host's course `toward` the Thornwatch keep (held by Kell's garrison) | on arrival a `site_siege` (STANDING) is minted at the week advance; its default reads might vs the garrison band; on `falls` the keep is `taken`, the menace its holder (a lair in prose), the hazard rides the presence term at the menace's might; when the DM ends the menace the keep is `cleared` and unheld, and Kell is offered `site_reclaim` |
| S10 | THE MAP OFFERS A HOLY SITE AND THE DM ADOPTS IT | `PLACE_SITE` through the offer: `placedBy: 'adopted'`, the `offerRef` and the map's position as provenance, `hidden: true`, the deity tag; no effect until a holder is set (empty = nothing); the map keeps the site where the host fixed it (ENC-HL-03) |
| S11 | a settlement founded over a site fails (terminal decline) | the site persists: holder none, `abandoned`, attachments re-derived; "leave a ruin" was offered on the dying card; no `site_reclaim` (the claim lapsed) |
| S12 | the reclaim: Kell's keep is taken by a band; Kell stands, `funded`, force ratio ≥ 1.2 | `site_reclaim` minted for Kell in that week; default `moves`; the `site_cleared` contest follows the same week; no other court's clearing that week |
| S13 | conveyance: Kell conveys the keep to Ashford (`TRANSFER_SOVEREIGNTY` with the site asset; `conveyed`) aspatially | the holder is Ashford's garrison; the land stays Kell's country; Ashford benefits only by its attachment band; Kell no longer does |
| S14 | an aspatial world | every arm but danger runs on hop bands; no embattlement write; the site record is whole |
| S15 | a year advance with a site siege standing | each week resolved on ST's default with its receipt; a siege neither falling nor lifting for 13 weeks lifts by exhaustion; nothing queued past the advance |
| S16 | `siteEffectsEnabled` lit then dark again | the ledger stays; every lean returns its neutral; `homeDefense` byte-identical to dark |
| S17 | an empty `crossing` (`ruined`) on the Kell–Ashford stretch | the stretch costs its base in `scoreRoute`; no hazard (ruling 19) |
| S18 | the coverage walker | passes: no parallel home-defence number; one leaf; one writer with its closed callers |

---

## §13 THE RULINGS (by delegation under the owner's words of 2026-10-16 — "i give my permission now and for whatever is emergent" — and 2026-10-17 — "I defer all judgement and decisions to you"; each vetoable by one owner clause; the owner's own rows marked ⭐)

| Id | Ruling |
|---|---|
| OD-ST-1 ⭐ | THE PERSISTED SHAPE `spatialLedgers.worldSites` — taken by delegation ON THE OWNER'S OWN REQUEST (the nine words; the map document's V14 Q2 accepted by the owner's "i told the mapmaker i do as it suggested"); the host half of `WorldSiteHost`; signed at ST-0's unit with a fold §7 row (the chair's) |
| OD-ST-2 | ONE writer module, a closed caller list (ST2; §6.3) |
| OD-ST-3 | ten kinds, no `lair`; the map's kinds align by OPEN Q1 |
| OD-ST-4 | quality `sound · worn · ruined`; state DERIVED `held · unheld` (`ruined` is quality alone) [REFINED] |
| OD-ST-5 | funding DERIVED `unfunded · meagre · funded · lavish` from the holder's own means; coin upkeep joins SEAT-8's `UPKEEP_LEDGERS` car as a fourth member (slot) [REFINED; the brief's sink does not exist] |
| OD-ST-6 | distance RELATIVE `at_hand · nearby · distant`; attachments DERIVED [REFINED; host law 3] |
| OD-ST-7 | the sign is the holder's: tied benefits, untied hazards, empty nothing (the owner's second and seventh words) |
| OD-ST-8 | the scale `F × Q × D` (tied) and `M × Qu × D` (untied) — every factor DRAFT, UNMEASURED, FP-46 |
| OD-ST-9 | the effect table §3.3 — each lean at its named seam; per seam per town the MAX within a sign |
| OD-ST-10 | the danger ledger: ST is MN5's second feeder; held sites SUBTRACT on the presence term only, floored, never on the walls term (the latch margin 0.05) [REFINED] |
| OD-ST-11 | a fort is not a threat; a den is (`buildThreatByCid` takes untied sites only) [REFINED] |
| OD-ST-12 | THE READY KEEP: `siteDefense` ≤ 18 latent points in `homeDefense`; relief subtracts it; the dossier reads the same leaf; `defenseLedger` untouched [REFINED] |
| OD-ST-13 | THE BREACH STOCK: a siege's fall lands on the keep first, through the war layer's `worldStatePatch` (fallback: the deployment stamp) |
| OD-ST-14 | the approach fort is its own `site_siege` on THE PASSAGE's transit leaf; bypass is PS's route choice |
| OD-ST-15 | the crisis counterpart per kind (§3.5); the waystation and the ruin get no drastic term |
| OD-ST-16 | the tower leans on the arcane crisis plane, not the static magic dial [REFINED] |
| OD-ST-17 | the shrine leans on the holding creed's strength (the followers act); legitimacy only through the contest's own endorsement [REFINED] |
| OD-ST-18 | site tolls wait on EC-6's toll arm (no second toll law) [REFINED] |
| OD-ST-19 | no one-time salvage from a held ruin (an invented effect) [REFINED] |
| OD-ST-20 | ONE stage after MN's at the head of `advanceCalamity`; steps 1–7 in that order |
| OD-ST-21 | the four DM verbs (`PLACE_SITE · SITE_HOLDER · SITE_STATUS · END_SITE`), ≤ 4 dials, anchor + subject |
| OD-ST-22 | the last to act has the first claim (`site_reclaim`); a preference, never a right |
| OD-ST-23 | a site outlives its town; "leave a ruin" is offered, never automatic |
| OD-ST-24 | who makes a den: bands (WC-12, emergent), cults (WF, emergent when it lands), menaces and authored bands (the DM's alone) |
| OD-ST-25 | four hearings — `site_taken · site_cleared · site_reclaim · site_siege`; `site_fallen` folded into `site_siege` [REFINED] |
| OD-ST-26 | the roads of change (§6.3) each through its existing writer; `site_cession` is GRAMMAR's term row |
| OD-ST-27 | the actor convention gains `site` (the fold's SP-4a row, the chair's) |
| OD-ST-28 | the coverage census and its walker (§7.1); one "sites considered" bracket per existing volume in round 2 |
| OD-ST-29 | four flags (`worldSitesEnabled · siteEffectsEnabled · siteFatesEnabled · siteWarTargetEnabled`), lit in no preset at landing; the default preset only after the host's birth-door check |
| OD-ST-30 | C15 THE SITES after C0 · C0.5 · C1 beside C14; the first felt chain is the fortification (ST-0 → ST-1) |
| OD-ST-31 | the same-seed shift at each lighting unit is DECLARED (every born world with a placed site changes; worlds without sites stay byte-identical — sites are never generated) |
| OD-ST-32 | a person holder's sign follows a paragon's living `polarity`; a non-paragon ledger person is tied |
| ⛔ STOP-ST-1 | the brief's item 3 FUNDING "through the ONE upkeep-shaped sink (the `UPKEEP_LEDGERS` row the champions volume uses for retainers)" cannot be built as written: `treasury.js :: UPKEEP_LEDGERS = Object.freeze(['deployments'])`, `advanceTreasury(settlement, options = {})` takes no worldState and has one caller in the frozen kernel, and CH-r1-5 struck CH's row for exactly that reason. RESOLVED WITHIN THE RULINGS (no invention): items 11(a) and 22 already name the derived band ("derived from its treasury/prosperity rung … the treasury when lit"; "dark: the band is DM-set") — ST6/OD-ST-5 carry it; coin upkeep is SEAT-8's widening car (slot). The chair confirms or re-rules. Beyond it, the car-0 STOP CONDITIONS of ST-0, ST-1 and ST-2b stand, each with its named fallback |
| ⛔ STOP-ST-2 | the `resource` kind's YIELD lean: `resourceSites.js` derives location only ("Depletion is NOT read"; "NOTHING IS STORED"), and no live yield read keyed by a site exists at master; the kind keeps its record, holder and dossier line; its tied lean and its untied "yield lost" are NOT DESIGNED until EC's condition (when lit) or a landed per-resource production read is measured — the chair's slot (C7/EC) |

Every persisted shape is declared: `spatialLedgers.worldSites` (ST's) and `deployments[*].siteTargetId` (the war's record, ST-2b). Every DRAFT constant (`F`, `Q`, `D`, `M`, `Qu`, every BASE, every cap, the season's dwell, the 13-week siege ceiling, the year wear, the 8-event ring, the clearing thresholds 0.40 and 1.2, the 18-point keep) is UNMEASURED on the FP-46 roster.

---

## §14 WHAT A DM READS (the Evidence Law: who, which power, what effect; deeds only, never forecasts; no numerals; no mechanism names)

1. "Kell's keep stands ready; Ashford's host cannot easily take the town while it holds." — the siege card (surface); on scrutiny the card names the keep's term in the defence read.
2. "Kell's keep is breached; the town's walls still hold." — the siege card and the Herald (surface).
3. "Brigands hold the old keep above the road; Kell's roads are dangerous and Tolle's are watchful." — the dossier's threat page (surface); the danger lens behind its toggle (scrutiny).
4. "The keep at Thornwatch has stood empty since Kell stopped paying its garrison." — the dossier (surface); the dated events (scrutiny).
5. "Kell let its border keeps fall empty, and robbers have taken two of them; Kell's lord has not come to clear them." — the Herald when a den presses a sworn member a season unanswered (surface); PL's `protection_failed` on the sworn edge and the commons' grievance (scrutiny) — ruling 12's legible consequence: a crown that lets its border forts rot loses their protection AND makes dens that press its own members.
6. "Kell's levy drove the robbers out of the Crossed Keys." — the Herald (surface).
7. "The warded tower above Kell holds the dead ground back." — the deadzone's resolution receipt (scrutiny).
8. "The abbey at Merewick keeps the old faith strong in the valley." — the faith page (scrutiny).
9. "The hospice at Tolle took in the sick." — the plague's course (surface in an outbreak).
10. "Thornwatch's watchers saw the column cross the ford." — the belief presets' news (surface).
11. "Kell is gone, but its keep still stands over the empty valley." — the chronicle (surface) when a settlement founded over a site fails.
12. "The Ashen Host has made the old keep at Thornwatch its lair." — the Herald (surface) when the DM's menace takes a site.

The surface shows the site's holder, its condition word and its one felt line behind the map's site toggle and on the dossier; the funding band, the distance bands and each lean's term are scrutiny only (the Why panel, the cause walk); the machinery (the factors, the caps) is never pushed.
