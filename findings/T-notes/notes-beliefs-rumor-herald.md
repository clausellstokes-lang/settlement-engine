# Seat T measurement — can beliefs / rumors / herald carry a NON-settlement subject?

Code of record: CR = scratchpad/master-00b648c9d (detached at master 81f1cd963). All paths relative to CR.
Method: read-only (cat/sed/awk/rg). READ = I read the line; PLAUSIBLE = inferred.

## 1. BELIEFS

### 1.1 Ledger shape (READ)
- `worldState.spatialLedgers.beliefMaps = { [observerId]: { [factionId]: { [subjectId]: BeliefRecord } } }` — src/domain/worldPulse/beliefMap.js:10-12.
- Faction keys: `'seat'` (GOVERNING_SEAT_KEY, beliefMap.js:74), `'public'` (beliefMap.js:87), per-faction archetypes merchant/military/criminal/religious (FACTION_CARRIER_FRAMING, beliefMap.js:102-107). Reserved sentinel `'__seededAt'` at observer level (beliefMap.js:82).
- BeliefRecord typedef (beliefMap.js:335-350): readiness (warPosture-derived), strengthBand (0..4 via settlementStrength), allianceLabel (observer<->subject relationship label), faithLabel (primaryDeitySnapshot name), confidence01, lastUpdateTick; optional hostilityInference (envoy_silence), populationTrendBand, observanceLabel (D-1), scarcityBands, conditionsBands, devotionBand (SP-B).
- Every base field is SETTLEMENT-shaped: groundTruthBelief (beliefMap.js:485-510) reads `ctx.byId.get(subjectId)` (snapshot settlement item), `settlementStrength(item, ...)`, `worldState.warPosture[subjectId]` (beliefMap.js:463-470), `item.settlement.config.primaryDeitySnapshot.name` (beliefMap.js:458-461). If the subject is not in byId, strength falls back to NEUTRAL band (beliefMap.js:487-489), readiness to 0, faith to null.
- beliefAxisSubjects.js is NOT a registry of subject KINDS; it defines three subject AXIS FAMILIES (fields) on the SAME record: SUBJECT_AXIS_FIELDS = ['conditionsBands','devotionBand','scarcityBands'] (src/domain/worldPulse/beliefAxisSubjects.js:130); CONDITIONS_KEYS (4) at :123; ladders SCARCITY_BANDS :85, STORES_BANDS :92, ROUTE_POSITION_BANDS :99, PULL_BANDS :107, DEVOTION_BANDS :115. All ground truths read `item.settlement` (:383-401, :269, :303) or `religionStates[subjectId]` (beliefMap.js:506).
- D-1 axes (beliefAxes.js): populationTrendBand + observanceLabel, ground truth from settlement.populationHistory / settlement.traditions (src/domain/worldPulse/beliefAxes.js:165-175).

### 1.2 Subject key (READ)
- Accessor: `beliefRecord(worldState, observerId, subjectId, factionId='seat')` — String(subjectId), no kind check (beliefMap.js:225-231).
- Selector `belief(observerId, subjectId, ws)` (beliefMap.js:366-371) — any string.
- Cold start seeds ONLY settlement neighbours: relationshipNeighbourhood over regionalGraph edges (beliefMap.js:713-737) and `if (!byId.has(subjectId)) continue;` (beliefMap.js:1290).
- NORMAL path: subjects = prior slot keys ∪ reportsBySubject keys (beliefMap.js:1160). reportsBySubject derives subject ids from rumor `content.whereId ∪ content.partyIds` (beliefMap.js:777-781, 802-806), excluding only the observer itself (:803). reconcileSlot has NO `byId.has(subjectId)` guard (beliefMap.js:1158-1219).
  => PLAUSIBLE: a rumor whose whereId/partyIds names a non-settlement id would MATERIALIZE a belief row keyed by that id with neutral strength/0 readiness/null faith (a "phantom settlement" record). Not observed in a run; inferred from code.
- Observers = realObserverKeys ∪ rumorLedgers keys ∪ neighbours keys (beliefMap.js:1325) — observer is a settlement-keyed rumor ledger owner.

### 1.3 Writers (READ) — NOT single-writer
- src/domain/worldPulse/ledgerOwnershipManifest.js:74-106: id 'belief_maps', ownership 'ordered_multi_writer'; writers: pulseKernel simulateCampaignWorldPulse (:83), beliefMap applyEnvoySilenceInference (:84), clearEnvoySilenceInference (:85), informationStatecraft advanceInformationStatecraft (:86), generosityKernel advanceGenerosity (:87), espionageProducts landEspionageProduct (:88, out-of-band). Order: belief commit -> envoy silence apply -> clear -> info statecraft -> generosity (:96).
- Kernel commit: src/domain/worldPulse/pulseKernel.js:2181 setSpatialLedger(memoryState,'beliefMaps', beliefs.next); drop at :2184.
- In-advance sub-writers: applyAllyIntelSharing (beliefMap.js:1046-1136) — guarded `ctx.byId.has(receiverId)` (:1084) and enemyId (:1098); applyPatronFeeds (beliefMap.js:1403-1412).
- Pinned by tests/domain/pulseStageContracts.test.js (imports LEDGER_OWNERSHIP_MANIFEST).

### 1.4 Closed lists / walkers (READ)
- NO subject-KIND registry exists for beliefs. rg for subjectKind|SUBJECT_KINDS|subjectType over src/ finds only unrelated hits (realmItemReadModel.js:283 `subjectKind:'settlement'`, ransomClaim.js:44 RANSOM_SUBJECT_KIND='person', brokerageStamps.js:365-369 heraldChannelOf(section, subjectKinds), pulseFingerprint.js:131,231).
- The CLOSED lists that DO exist are AXIS FIELDS, not subject kinds: SUBJECT_AXIS_FIELDS pinned verbatim at tests/lint/spAxisVocabulary.walker.test.js:288-290 (exactly ['conditionsBands','devotionBand','scarcityBands']); CONDITIONS_KEYS length 4 at :271-272; a total src/ scan of field spellers at :252-265. Ladders borrowed-by-spelling pinned both ways (header :7-22).
- tests/domain/beliefAxisSubjectsFoldPin.test.js pins the fold arm through the real engine (two-step advance; header :22-28).
- Ledger-writer roster pinned via LEDGER_OWNERSHIP_MANIFEST in tests/domain/pulseStageContracts.test.js.

### 1.5 Non-settlement belief subjects today (READ)
- STORED beliefMaps: none by design — every ground-truth read is a settlement snapshot item / settlement-keyed ledger (above). The fold's only `what`-aware arms are 'migration_flight' and 'tradition_change' (src/domain/worldPulse/beliefAxes.js:247-260).
- DERIVED-ON-READ precedent for a NON-settlement subject: npcCirculationBelief.js — what a settlement believes about a ROAMER (person). "Beliefs are derived ON DEMAND and NEVER stored per pair ... no setter, no ledger key" (src/domain/worldPulse/npcCirculationBelief.js:14-20). Needs an ANCHOR settlement: `believedReputation({worldState, originId, observerId, roamerId, truth, elapsedTicks})` (:164), distance price = hopDelayTicks(digest, originId, observerId) (:183-188). The subject (roamer) never becomes a key; the origin settlement carries the distance.

## 2. RUMOR

### 2.1 Ledger + record (READ)
- `worldState.rumorLedgers = { [settlementId]: { [eventKey]: ArrivalRecord } }` (src/domain/spatial/rumorNetwork.js:11). Key `trade:${eventRef}` (rumorEventKey :257-259).
- RumorContent typedef (rumorNetwork.js:152-161): what (impact-kind token), whereId ("primary settlement id"), scope, magnitude 0..3, partyIds ("involved settlement ids (swap-mutable)"), causeClass (DM-only), deityName, visibility 'mechanical'.
- RumorArrivalRecord (rumorNetwork.js:168-184): eventRef, eventTick, carrier, arrivalTick, hopCount, lineageIds, corroborationRoots, provenance{originId, relayIds}, completeness01, accuracy01, framing[], significance, score, content, relayedTick.
- captureContent (rumorNetwork.js:392-404): what = String(entry.impactKind || entry.kind || 'stirring'); whereId = first codepoint-sorted settlementId; partyIds = all entry.settlementIds. Free prose NEVER copied (:147-150, :385-391).

### 2.2 Minting (READ)
- SOLE seed substrate = news feed entries: kernel composes feedEntries = wizardNews.entries + internalRumorSeeds (state-only history seeds + applied.rumorSeedEntries) + carrier.flightEntries (src/domain/worldPulse/pulseKernel.js:2087-2096), then advanceRumorLedgers (:2097-2107), commit :2110 / drop :2113.
- Seed gate (rumorNetwork.js:587-598): entry.id; tick window (lookback 4, :128); passesSignificanceGate (major OR score>=60; :119-122, :407-411); covert!==true; audience!=='dm-only'; settlementIds non-empty; no 'proposal' tag.
- WITNESSES = content.partyIds = every entry.settlementIds member gets a hop-0 record in ITS OWN ledger (rumorNetwork.js:607-647; provenance.originId = sid :624).
- Relay keyed per SETTLEMENT NODE: trade edges (tradeNeighbours over confirmed export_market/trade_dependency/trade_route channels, :106-108, :298-317), army/criminal/refugee mover paths (path node ids, :330-382), ship (seaLaneNeighbourMap), teleport (teleportNeighbourMap) (:742-750). hopWeeks(digest, sid, neighbourId) (:692). Unreliable garble swaps a partyId ONLY to a real digest settlement id (:490-499).
- Precedent for a NON-settlement MOVER becoming a rumor: migrationRumors.js flightEntryFor (src/domain/spatial/migrationRumors.js:97-113) synthesises a feed-shaped entry {id: `migration.${origin}.${dest}.${departTick}`, impactKind:'migration_flight', settlementIds:[originId,destId], causeClass, ...}. The column itself is NOT a subject; its endpoint settlements are the witnesses/subjects; identity rides only in impactKind + the eventKey string.
- Writers of rumorLedgers: pulseKernel.js:2110/2113 AND roadsKernel.js:1202-1209 (boostHomeRumorFidelity, src/domain/roads/verification.js:57-78 — matches records by content.whereId/partyIds === subjectId). NOTE migrationRumors.js:9-10 calls advanceRumorLedgers "the rumor SINGLE WRITER" — contradicted by roadsKernel.js:1209 (READ).

### 2.3 Can a rumor be about a non-settlement subject today? (READ + PLAUSIBLE)
- READ: nothing in the record has a non-settlement subject slot; whereId/partyIds are typed/documented as settlement ids (:154-157). The ONLY free-ish channel is `what` (the impactKind token) + causeClass.
- PLAUSIBLE (not executed): putting a non-settlement id into a news entry's settlementIds would (a) create a rumor ledger keyed by that id (a phantom witness, :609-646), which relays nowhere (no trade edge / path), and (b) through beliefMap.js:1325 make it an OBSERVER and, via partyIds, a belief SUBJECT with neutral settlement-shaped fields.

### 2.4 Rumor display (READ)
- Player fiction is built ONLY from content.what (-> whatPhrase), whereId/partyIds (-> settlement NAMES via nameFor), magnitude band, activated deity name (src/domain/display/settlementRumors.js:755-794). HEADLINE_FRAMES all carry {where} = a settlement name (:707-736). nameOf('') -> 'parts unknown' (:689-691).
- Player whitelist comment: "subjectIds / whereId — settlement ids only" (:812-814).
- WHAT_PHRASES is a closed what-token -> phrase map, 258 rows (:123-513); an unregistered token is REFUSED to UNREGISTERED_SUBJECT 'a matter of some moment' (:539, :588-617). Existing external-ish rows: plague_arrival 'a sickness spreading' (:380), calamity 'a great disaster' (:381), webwar_raid (:291), supply_raid_ordered (:501). Walkers cited at :117-121: tests/domain/impactKindWalkers.test.js, tests/lint/newsSubjectVocabulary.walker.test.js, tests/lint/heraldRouting.walker.test.js.
- => A DM-authored threat NAME has no slot in a rumor packet at all (free prose never copied, rumorNetwork.js:147-150); only a registered what-token phrase can say it.

## 3. HERALD / NEWS

### 3.1 News entry shape (READ)
- WizardNewsEntry typedef src/domain/region/wizardNews.js:78-115; normalizeEntry is an ALLOWLIST rebuilder (:655-772) run on every append AND every load ("a field the writer sets and normalizeEntry does not name is silently dropped", :727-732).
- Place = settlementIds (:94, :680). Actor layer (NEWS ADDRESS LAW): npcIds, factionIds, thirdPartyIds, venueIds, termSheetIds — typed ids, spread only when non-empty (:692-713). region = a settlement id (:108-110, :734-736). familyId (:740), audience 'public'|'dm-only' (:741-743), section in WIZARD_NEWS_SECTIONS (7 desks, :17-19, :744-746), sectionAuthority closed to 4 registries war_rulings/war_coalition/envoy/sovereignty (:764-770) mirrored by hand with heraldRouting (:747-753).
- thirdPartyIds's only minter is envoyNews.js:278-280 and it is ALSO a settlement (resolved via settlementName(snapshot, thirdPartyId) envoyNews.js:147-154; pushed into settlementIds :271-273). So no news field today addresses a non-settlement, non-npc, non-faction actor.

### 3.2 Herald routing (READ)
- SECTION is decided by KIND TOKEN only: heraldSectionOfRecord (src/domain/realm/heraldRouting.js:670-688) -> pending/resolved -> adjudication; emerging stressor -> divination; governed section+sectionAuthority; else SECTION_OF(routingKeyOf(record)) (:537-556), routingKeyOf reads impactKind > candidateType > stressor.type > payload.kind > type > kind (:590-605).
- TOTAL law: "a NEW producer kind fails the totality walker (tests/lint/heraldRouting.walker.test.js) until a human files it" (:21-26). EXACT_SECTION (:91-418), PREFIX_RULES (:428-510), DELEGATING_PREFIXES stressor_birth_/escalate_/spread_/realm_/regional_ (:515-521).
- Existing EXTERNAL-THREAT-shaped kinds already routed: monster_raider_pressure -> events (:282), hostile_raid -> war (:95), calamity/plague/plague_arrival/custom_crisis -> events (:293-294), disaster -> events (:373), calamity_forced / realm_verb_force_calamity -> events (:376, :381). decisionTier.js:199 `stressor_birth_monster_raider_pressure: { class: 'calamity', ... rationale: 'Monster/raider pressure is a calamity-shaped external threat.' }`. All are SETTLEMENT-scoped (the settlement is the subject).
- Shrink-only trap (READ): an EXACT_SECTION row for a token with no phrased pool grows LEGACY_UNVOICED_TOKENS "whose 274 has never moved", asserted SHRINK-ONLY (:446-451, :469-486; kindPoolFloors.walker). Hence prefix routing for treasury_/occupation_.

### 3.3 Which feed/dossier an entry lands in (READ)
- buildHeraldFeed (src/components/map/heraldFeed.js:203-285) is REALM-wide: every wizardNews entry is filed (no settlement filter) by section (:248-252); live stressors too (:257-276).
- HeraldItem.subject = outcomeSubjectDescriptor -> {npcId, factionId, factionName, settlementId} only (heraldFeed.js:41, src/components/map/WorldPulseData.js:61-72); "resolves to nothing (subjectless, e.g. a plague) when the record names no addressable actor" (WorldPulseData.js:59-60). affectedIds = collectSettlementIds (WorldPulseData.js:41-53).
- Settlement FOCUS (the "which settlement" filter) = settlementIdsOf(item) over subjects/affectedEntities with kind === 'settlement' (src/components/map/heraldCommandSelectors.js:69-77, :175-177).
- RealmItem subject kinds are CLOSED to 'settlement' | 'npc' | 'faction' (src/domain/realm/realmItemReadModel.js:207-225, :276-299). A settlementIds member absent from the settlement index => diagnostic 'missing_settlement_subject', routeable:false, fallbackLabel 'A settlement no longer in this campaign' (:279-295).

### 3.4 Existing NON-settlement actor carriers (READ) — the closest precedents
- STRESSOR originContext attacker: "a siege's attacker may be a goblin warband with no settlement at all" (src/domain/worldPulse/stressorsCore.js:356-360). setStressorAttacker names "a force with no settlement base at all — a goblin warband, a mercenary company — which only the DM can name" (src/domain/worldPulse/stressors.js:601-631) writing originContext.{attackerSettlementId, attackerLabel}. stressorDynamics.js:594-598: "Nothing downstream assumes an attacker exists."
  - DM door: party kind `name_attacker` (src/domain/worldPulse/partyImpactKinds.js:25) -> partyImpact.js:175-203 -> a 'narrative' outcome, candidateType `party_name_attacker` (baseOutcome partyImpact.js:78-92), targetSaveId = the stressor's settlement, the name only in headline/summary PROSE + metadata.attackerLabel. UI: src/components/map/WorldPulsePanel.jsx:452-462. Display: WorldPulseData.js:224-226 ('Attacker'); chronicle snapshot: src/domain/worldPulse/chronicle.js:98-101 (`attacker: originContext.attackerLabel`).
  - Reach: attackerLabel appears in NONE of wizardNews.js, worldPulseFeedCuration.js, rumorNetwork.js, beliefMap.js, settlementRumors.js (rg -i attacker: zero hits). So the DM name never enters a rumor content or a belief record.
- Stressor catalog row monster_raider_pressure (stressorsCore.js:140-148; spreadChannels wilderness_frontier/trade_route/resource_competition); stressorAftermath.js:31 maps it to 'external_threat'; realmEvents.js:93 'The Raids'; decisionTier.js:199 calamity class.
- FORCE_CALAMITY verb dials include a cosmetic DM `flavor` freetext (src/domain/worldPulse/calamityKernel.js:557-576), stored as stamp.flavorText (:489-497); the news entry headline is the stamp NAME, impactKind 'calamity', settlementIds:[id] (:846-871); "the flavor is the DM's slot" (:838-840).
- plague_arrival news (src/domain/worldPulse/pestilenceKernel.js:276-303): settlementIds:[id], subjectless.
- moral_reckoning (src/domain/spatial/moralDrift.js:301-341): settlementIds [mover, victim] — settlement-to-settlement.
- No literal "beyond the map"/"host from beyond" anywhere in the tree (rg over ., only unrelated 'beyond the grave'/'beyond the mountains'). ABSENT.

### 3.5 Voice / phrasing registries a new kind binds (READ)
- Crier voice: newsVoiceCategory (src/domain/display/newsVoice.js:607-658) closed categories incl. 'pestilence','calamity' (:41); set-but-unclassified guard: unknown non-empty impactKind => NO voice (:644-650).
- tests/domain/impactKindWalkers.test.js: every literal `impactKind:` mint must have a WHAT_PHRASES row (:8-10) AND an EXPECTED_VOICE classification (:12-16, :60, :256-268).
- tests/lint/newsSubjectVocabulary.walker.test.js: "exactly one place a token becomes the SUBJECT of a rumor: captureContent" (:5-8); resolves constants/templates, CONVICTS an unresolvable mint (:20-31).
- tests/lint/heraldRouting.walker.test.js: discovery = matchAll of impactKind:/candidateType: literals + frozen producer constants incl STRESSOR_CATALOG (:10-21, :43-57, :73-74); a new minted kind reds until filed.
- Kind registries: tests/helpers/kindRegistryRoster.js — 13 families (:46-77) and KIND_REGISTRATION_FREEZES registries 13, registeredKinds 127, routedTokens 393, unvoicedTokens 274 SHRINK-ONLY, registeredMinusRouted 8 (:123-158); attribution rule (:86-103): a new desk-bearing kind = +1 registeredKinds and +1 routedTokens; a routed token with no row = STOP. Mirrored literals in tests/lint/kindPoolFloors.walker.test.js:155, :233, :255 and parsed by scripts/base-state-capsule.mjs.
- Registry row shape example: FAITH_KIND_REGISTRY faithKindRow('faith_last_altar_dark','major','public','faith',[slots...]) (src/domain/worldPulse/faithNews.js:118-123) — named evidence slots ('creed','settlement','temple'); corpus in docs/content/RECEIPT_POOLS_*.md (13 files).
- tests/lint/proseFamilyContract.walker.test.js: exact-totality over an observed corpus (families chronicle/pulseHistory/regionalLog/timeline, scripts/lib/prose-family-contract.mjs:23) with a sha-pinned baseline tests/lint/.prose-family-contract-baseline.json; any new observed field/value moves it.

### 3.6 Belief display (READ)
- settlementBeliefs (src/domain/display/settlementBeliefs.js:146-188): DM-only; nameFor = "settlement id → display name" (:143); every row is settlement-shaped (readiness/strength/alliance/faith).
- rumorHeraldLink joins rumor->Herald by eventRef only (src/domain/display/rumorHeraldLink.js:57-61, :76-95) — subject-agnostic.

### 3.7 Feed plumbing (READ)
- appendObservedWizardNewsEntries (src/domain/region/wizardNews.js:1154-1160): raw receipts copied to `receiptSink` (audit only) BEFORE normalization; then appendWizardNewsEntries runs normalizeEntry on every raw entry (:1052-1065). Id-less receipts are dropped from both feed and sink (:1067-1074, :1128-1142).
- The rumor seeder reads the NORMALIZED feed (pulseKernel.js:2094-2096) => any new field a writer adds (e.g. an external-force id) is stripped before rumors unless normalizeEntry's allowlist names it.
- Realm-scope subjectless precedent: pantheon_extinction/ascendancy/twilight entries carry scope 'realm', settlementIds: [] (src/domain/worldPulse/realmEvents.js:306-327, :329-341, :355-364); the deity rides only in headline/summary prose and tags (:312-325). Such an entry reaches the Herald realm feed, NEVER a settlement focus (heraldCommandSelectors.js:175-177), and NEVER a rumor (rumorNetwork.js:597 requires settlementIds non-empty) => never a belief.
- realm_${type} entries (realmEvents.js:433-442) carry settlementIds and REALM_LABELS (monster_raider_pressure: 'The Raids', :93).
- Stressor births mint candidateType `stressor_birth_${type}` (src/domain/worldPulse/stressors.js:509), promoted to impactKind by newsEntryForOutcome (src/domain/worldPulse/worldPulseFeedCuration.js:95), settlementIds = affectedSettlementIds||[targetSaveId] (:98).

## 4. EXECUTED RECEIPTS (CONFIRMED — node, inline -e, CR code, no files written)
- whatPhrase: 'stressor_birth_monster_raider_pressure' => "a matter of some moment" (UNREGISTERED_SUBJECT); 'stressor_birth_siege' => same; 'party_name_attacker' => same; 'external_threat' => same; 'monster_raider_pressure' => "monster raider pressure"; 'calamity' => "a great disaster"; 'plague_arrival' => "a sickness spreading"; 'hostile_raid' => "hostile raid".
  => the closest existing external-threat beat (a monster/raider stressor birth) would speak in the rumor mill as "a matter of some moment".
- Toy world (2 settlements a,b, one confirmed trade_route, infoMode perfect_delayed, spatialCanonVersion 1) + ONE news entry {impactKind:'external_host', settlementIds:['a','host:ashen'], major, score 90}:
  - advanceRumorLedgers ticks 5..7 => rumor ledger OWNERS ['a','b','host:ashen']: the phantom id became a hop-0 WITNESS; relay a->b at hop 1 (arrival 6); whereId 'a'.
  - advanceBeliefMaps tick 7 (cold start: a,b only) then tick 8 => observers a and b each MATERIALIZE a belief keyed 'host:ashen' = {readiness 0, strengthBand 2 (neutral), allianceLabel 'unknown', faithLabel null, confidence01 0.3685 / 0.3251}; and 'host:ashen' became an OBSERVER holding a belief about 'a'.
  - settlementRumors player projection at b: headline "The caravans carry word of a matter of some moment in Aldenmoor"; detail "They call it a grave calamity. The tale names Aldenmoor, host:ashen." (raw id leaks through the default nameFor; production nameFor fallback not measured — PLAUSIBLE leak). When the phantom id sorts codepoint-first it becomes whereId: "A matter of some moment, here in 0host".

## 5. ANSWER (summary)
- Beliefs: subject key is a free string, but EVERY field and ground-truth read is settlement-shaped; no subject-kind registry; a non-settlement id is carried only as a phantom neutral settlement (CONFIRMED). The only non-settlement belief precedent is derive-on-read (npcCirculationBelief, roamers) anchored at an origin SETTLEMENT.
- Rumor: subject = what-token + settlement ids; no slot for an outside force or its DM name; spread is per settlement node; a phantom id becomes a witness/ledger owner (CONFIRMED). Precedent for a non-settlement mover = migration_flight synthetic feed entry (endpoints as witnesses, identity in impactKind + eventKey).
- Herald: routing by kind token; settlement focus by settlementIds; RealmItem subjects closed to settlement|npc|faction; DM-named non-settlement force exists only as stressor.originContext.attackerLabel (prose/chronicle/panel, never rumor/belief). Extension point for a new external-threat news kind = a new impactKind token registered in: EXACT_SECTION or a PREFIX_RULES family (heraldRouting.js), WHAT_PHRASES or FALLBACK pools (settlementRumors.js), EXPECTED_VOICE (impactKindWalkers), a KIND_REGISTRIES family + KIND_REGISTRATION_FREEZES (kindRegistryRoster.js / kindPoolFloors.walker), and — for any new typed actor field — normalizeEntry's allowlist (wizardNews.js:655-772) + realmItemReadModel subject kinds (:207-225).
- Counts (CONFIRMED by import): WHAT_PHRASES 258 keys; EXACT_SECTION 393 (= KIND_REGISTRATION_FREEZES.routedTokens); PREFIX_RULES 19; HERALD_SECTIONS 7; SUBJECT_AXIS_FIELDS 3; CONDITIONS_KEYS 4.
- SECTION_OF('external_host') = 'events' with isExplicitlyRouted false (an unfiled new token falls to the catch-all; the totality walker reds once it is minted as a literal). SECTION_OF('stressor_birth_monster_raider_pressure') = 'events', explicit via DELEGATING_PREFIXES.
