# DESIGN — THE ROADS (Engine Lift #5: named-NPC travel · capture · ransom · conversion)
### FROZEN 2026-07-19 · owner ruling "build it all!" + three same-day amendments
### (A: the Travelers Overlay · B: the Road Scene · C: military-quality protection ·
### D: THE SECRETS SEAM). Code base of record: claude/the-composite @ aad6265e.
### Recon receipts: the five-lens workflow journal (wf_5d89d60f-8e5) — three lenses
### landed (travel-absence / threat-classes / determinism-rails), two returned stubs
### and were RE-DERIVED by the architect against the same tip; every anchor cited
### below was re-verified against aad6265e. GREENFIELD: no NPC-travel layer exists
### (CONFIRMED — spatial/index.js roster has no npc mover; no location field on
### SimNpc; no travel purposes, stream, or flag).

## §0 OWNER SPEC (binding spine, verbatim intent)
Named NPCs travel to NEIGHBOR settlements on PURPOSED missions: tradition
observances at neighbors · trade-agreement business · diplomatic repair of
strained relations · personal/ladder rank missions ("a mission or goal that helps
them improve their power ranking"). Travel is "usually, but not always, left to
those that are not the most influential" — envoys from the middle ranks; the
great travel only for tradition-critical or personal missions. ROUTING reads the
faction's KNOWN picture (rumor ledgers / infoMode — stale or unreliable knowledge
included) while OUTCOMES roll against truth: a poorly-informed faction walks
people into armies it didn't know about. FOUR THREAT CLASSES, descending capture
strength: hostile army on the route / occupation during stay > siege-during-stay
> embattled roads (bandits/monsters/calamity) > hostile-reception arrival — and
"an army and occupation poses stronger and more likely chance" (partial
protection bypass). CAPTURE is a weighted PRNG: threat strength × exposure ÷
protection, where protection scales with importance (more guards) AND the home
settlement's military might ("better soldiers and equipment do make a
difference"). HOSTAGE = STASIS: one chokepoint predicate every participation
system consults. The party may intervene via the edit dispatcher; absent
intervention the faction pays RANSOM over time commensurate with the captive's
influence, debiting legitimacy through existing machinery. On capture, a LOW
personality-weighted chance the captive turns COVERT compromised for the captor —
through the EXISTING corruption system. Cadence governed: infrequent, near,
~1-week stays, return-home default; extended only by siege or all-roads-hostile.

## §0.5 THE BOUNDARY AMENDMENT (named-NPC motion is now sanctioned — owner 2026-07-19)
Two kernel headers carve named-NPC protection as law and MUST be amended in place
(scope notes only — the deeper boundary is PRESERVED, see law 1):
- `src/domain/worldPulse/traditionsKernel.js:51-52` — "AGGREGATE culture motion — a
  settlement's observances hold or fail; never a named soul's fate." AMEND the
  scope note to: "…never a named soul's fate. (Named-NPC MOTION is the roads
  layer's sanctioned province — roadsKernel, owner ruling 2026-07-19; fates
  remain unresolvable everywhere, DESIGN_THE_ROADS §1 law 1.)"
- `src/domain/worldPulse/migrationKernel.js:18-19` — "AGGREGATE, NAMED-NPC-SAFE
  (owner boundary): this moves population COUNTS only." AMEND the trailing clause
  to point at the same sanction: "…named NPCs are the §4h protected excursion
  model — their sanctioned mover is the roads layer (DESIGN_THE_ROADS), never
  this kernel."
- DECLARATION: the roads layer is the SOLE sanctioned named-NPC motion system.
  Any future system that moves a named NPC extends the roads ledger, never a
  parallel one. The no-death law (§1 law 1) is what makes this compatible with
  the deeper carve: travel SUSPENDS a named character's participation; it never
  RESOLVES their fate. `armyTransit.js:27` (commander flagged-at-risk, never
  removed) and `spatial/calamity.js:41` are untouched and remain binding.

## §1 FROZEN LAWS (violating any of these is a design defect)
1. THE NO-DEATH LAW (CARVED, non-negotiable): captivity NEVER resolves a named
   character's fate. Outcomes are release (ransom / rescue / events), expulsion,
   or covert conversion. NO execution branch exists, ever — no code path removes,
   kills, or permanently disappears a named traveler. The verification charter
   carries a roster-conservation assert (§19) and a source-scan probe.
2. DARK VIRTUAL FLAG: `roadsEnabled`, ABSENT from DEFAULT_SIMULATION_RULES
   (the WAVES idiom, simulationRules.js:207 — but NOT added to the WAVES bag:
   it is a pure virtual key like `infoStatecraftEnabled`, riding preset
   ...overrides only at THE ONE REGEN, owner-queued §20 Q1). Gate reads
   `rules?.roadsEnabled === true`. Absent ⇒ immediate no-op: zero derivation,
   zero ledger key, zero whereabouts mirror, zero news — byte-identical, proven
   by `tests/property/roadsDormancyGolden.test.js` (template:
   npcLadderDormancyGolden / traditionsDormancyGolden — full-advance mechanical
   hash with the gate absent + contract assertions + lit anti-vacuity block).
3. BORROWED-PURPOSE LAW: no new reason vocabulary. Every mission purpose derives
   from an EXISTING calendar or ledger: the traditions windows
   (spatialLedgers.traditions), confirmed trade edges (tradeNeighbours,
   rumorNetwork.js:288), relationship rungs (relationshipState.js — rival :74 /
   cold_war :83), and ladder goals (npcLadderGoals, when lit).
4. KNOWN-vs-TRUE LAW: dispatch + routing read the faction's KNOWN picture
   (rumorLedgers + beliefMaps + infoMode); every outcome roll reads TRUTH.
   Omniscient infoMode ⇒ known ≡ true (the layer still runs; nobody walks into
   a known army). The known-view is a pure projection (§5) — never persisted.
5. TRAVEL IS NARRATIVE, CAPTIVITY IS MECHANICAL (v1 law — JUDGMENT, vetoable):
   a traveling NPC (outbound/visiting/returning) remains in every participation
   read — their absence is chronicle texture, not a seat vacancy; routine trips
   must never churn the court. A HOSTAGE is mechanically off-stage through the
   ONE existing chokepoint (§8). This is the smallest honest cut; widening
   travel to mechanical absence is a recorded deferred seam (§21).
6. SINGLE-WRITER + WRITE-BOUNDED (the traditions §5/§14 constitution): the roads
   mover writes ONLY (a) its own `spatialLedgers.roads` sidecar, (b) the
   `npc.whereabouts` display mirror via settlementUpdates, (c) publicLegitimacy
   .score via the applyLegitimacyHits idiom (momentum.js:1094; reimplemented
   self-contained per the traditions precedent), (d) prosperity band-steps via
   the upswing applicator idiom (upswingKernel.js:890, same precedent),
   (e) wizardNews entries, (f) outcome/provenance ids via existing passes.
   NOTHING ELSE. ⛔ NEVER write `faction.power` — it is DERIVATION OUTPUT,
   re-computed every tick (factionCompetition.js:125); a patch there is
   clobbered by construction. ⛔ NEVER write ladder standing — the ladder's
   single-writer law (npcLadderKernel.js header) owns it; a hostage's rank cost
   emerges FREE through standing decay (STAND_HALF_LIFE_WEEKS=156,
   npcLadderState.js) and ladder-eligibility exclusion (§8).
7. CONVERSION RIDES THE EXISTING CORRUPTION SYSTEM: beneficiary = captor, the
   foreign-patron shape (npcAgency.js:815-828 foreignFields; corruptionWeb.js §2
   creation). Zero new corruption machinery; covert ⇒ NO news (the
   seedBetrayalTraitor covert-no-news template). Gated on the web being active —
   web dark ⇒ no conversion (§10, §20 Q6).
8. KERNEL-STATE RULE: ALL state rides the kernel's returned worldState /
   settlementUpdates — surviving BOTH commit paths (runAdvanceCampaignWorld
   Phase-2, campaignAdvanceSession.js:311-313, AND the resume re-stamp,
   :497-514) for free. NO store-side cursors. The mover is a pure per-tick
   function: no Date, no Math.random, fixed injected now, tolerant of ≤26
   back-to-back invocations (CATCH_UP_CAP_WEEKS, simulationRules.js:418). It
   banks NO out-of-band residue ⇒ NO RESIDUE_STRIP_SITES entry (pulseKernel.js
   :121 registry deliberately untouched — state this in the slice report).
9. RNG DISCIPLINE: per-tick event draws fork the pulse rng confluence with
   stable labels (`roads-genesis:${sid}:${tick}`, `roads-hazard:${missionId}:
   ${tick}`, `roads-reception:${missionId}:${tick}` — the armyTransit
   `battle:${a}:${b}:${tick}` idiom); the YEARLY cadence gate uses a
   tick-invariant WORLD-seed fork `createPRNG(`${rngSeed}::roads:cadence:
   ${npcKey}:${year}`)` (the seasonalSeverityFor / traditions §4 pattern) so
   collapsed catch-up never shifts who travels. Fork labels are LOAD-BEARING
   (prng.js:65 — a changed label breaks goldens).
10. HOT-FILE CEILINGS: pulseKernel (1387) and npcAgency (833) are frozen at
   their size-baseline ceilings (scripts/.size-baseline.json — shrink-only).
   The mover is a NEW lazy leaf that NAME-SWAPS the chain:
   `advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditions`
   (pulseKernel.js:73 import, :2342 call) becomes `…AndTraditionsAndRoads` on
   the SAME lines — roads runs LAST, after traditions, over the fully-settled
   tick (it reads this tick's traditions windows for observances/guest-right
   and this tick's armies/embattlement for hazards). No engine logic enters a
   capped file; belts at census sites (§8) are one-line predicate widenings.
11. ZERO EAGER BYTES except the DECLARED ~≤600 B (§16): all UI lazy; the mover
   and every roads domain leaf imported only from the lazy engine/dossier
   chunks. The sim NEVER reads entitlements.
12. STORE ACTIONS → operationRegistry + `npm run gen:compendium-data` regen
   (+ EXEMPT_CEILING only shrinks — operationRegistry.js:319). New edit kinds
   JOIN COMMITTABLE_EDIT_KINDS (pendingEdits.js:69 — the standing rule).
13. THE SECRETS SEAM (amendment D — render-layer law): sim state is untouched;
   which LENS a viewer gets is governed by ONE fail-closed discipline. Any
   context not provably the owning DM's authenticated session renders the
   redacted view; unknown/ambiguous ⇒ secrets hidden; redaction means THE DATA
   DOES NOT SHIP, never CSS hiding. Binding + classification table in §15;
   the data-probe is charter-mandatory (§19).
14. CHRONICLE PROSE follows the eventProse idioms: pools in a NEW src/data leaf
   registered through the eventProse registry (eventProse.js pickLine/fnv1a32),
   CANONICAL-AT-ZERO (index 0 = canonical, falsy seed ⇒ 0), no calamity
   substrings (the F24 scan), distance-priced spread untouched.

## §2 THE LANDSCAPE (what exists — recon receipts)
- NPC travel: ABSENT everywhere (lens 1 verdict, verified). NPCs nest under
  their owning settlement (settlement.schema.js:195 `npcs?: SimNpc[]`); SimNpc
  carries NO location/whereabouts field; npcLadderGoals verbs are raise/hold
  only (:196); spatial/index.js movers are all aggregates.
- The regional graph + timing: hopWeeks(digest, from, to, season) —
  distanceRead.js:708, floored ≥1, capped, season-aware. Trade partners:
  tradeNeighbours(graph, sid) (rumorNetwork.js:288). Route choice EXISTS and is
  reused wholesale: candidateRoutes + scoreRoute (embattlement.js:347 — danger =
  Σ per-hop embattlement level × riskTolerance + tolls) + chooseRoute (:407).
- The KNOWN picture: rumorLedgers (worldState.rumorLedgers[sid][eventKey] =
  ArrivalRecord w/ lineage + fidelity; rumorNetwork.js:5-9), beliefMaps
  (beliefMap.js:227 BeliefRecord — strength/relationship/faith, NO positional
  axis; belief() selector :250), infoMode (INFO_MODES simulationProfile.js:44;
  infoModeOf accessor). Army positions are OMNISCIENT truth only
  (armyTransit.js:242 currentRegion / :251 remainingRegions — consumed only by
  collision detection). Route choice today reads ONLY truth embattlement.
- Threat state (lens 2, verified): occupations 5-rung ladder (occupation.js:8,
  STATE_LADDER :91); live sieges = war_front channels (warFrontReads.js:50;
  settlementWarStatus display read warStatus.js:260 → {besiegedBy,
  besiegingTargets, atWar}); army transit records {path[], departTick,
  arrivalTick, position01} (armyTransit.js:180-232); embattlement per-region
  danger scalar + phase latch (embattlement.js); banditry = route consequence,
  not an entity (:52). NO hostage/prisoner/ransom state anywhere (grep-empty).
- Hostage substrate that DOES exist: `npc.stasis = { reason }` with
  STASIS_REASONS ['journey','imprisoned','missing','sequestered'] (npcOps.js
  :116), predicate isInStasis (:151), ops enterStasis/returnNpc, edit kinds
  'stasis-npc'/'return-npc' ALREADY in COMMITTABLE_EDIT_KINDS (pendingEdits.js
  :69), and THE PARTICIPATION CHOKEPOINT: buildWorldSnapshot filters stasis
  NPCs out of the settlement every pulse kernel reads (worldSnapshot.js:88-93),
  with a ladder belt at npcLadderState.js:146. DM-authored today
  (DESIGN_NPC_LIFECYCLE §2); the roads wave EXTENDS this shape, never forks it.
- Conversion substrate: corruption mint shape corruptionProfile {corrupted,
  vector}, CORRUPTIBLE_FLAWS (corruption.js:52), covert/revealed split
  (corruption.js:590-627), the foreign leash + patron endpoint
  (npcAgency.js:810-828), the web's creation gates with scarcity-as-law
  (corruptionWeb.js §2 header).
- Effects machinery: applyLegitimacyHits (momentum.js:1094, integer clamp,
  legacy-shape guarded), prosperity band-step applicator idiom
  (upswingKernel.js:808/:890), wizardNews via the mover's newsEntries[]
  (applyPulseMover fold, pulseKernel.js:2342). faction.power = derived each
  tick (factionCompetition.js:125) — NOT a write target.
- Importance: IMPORTANCE_WEIGHT {minor:0.0, notable:0.4, key:0.7, pillar:1.0} +
  inferImportance fallback (entities/npcs.js:72-95); importanceWeight(npc).
- Military quality (amendment C anchors): deriveMilitaryCapacity /
  militaryCapacityScalar (militaryStrength.js:148/:312 — facets incl.
  garrison/homeDefense from deployment state; defense ledger walls+garrison
  score :184-188) and readinessOf(settlement) + experience/rust
  (martialReadiness.js:251/:220/:235).
- Party/edit machinery: pendingEdits queue (session-only, deterministic ids),
  applyNpcOp dispatch (settlementSlice.js:534), PARTY_IMPACT_KINDS incl.
  remove_npc "killed, exiled, captured" and inflame_relationship
  (partyImpactKinds.js:21+).
- Share/redaction machinery (amendment D recon): toPublicSafe
  (display/publicSafe.js — FAIL-CLOSED top-level ALLOWLIST + recursive denylist
  + NPC allowlist, mirroring the server's `_gallery_sanitize_public_json`
  (get_gallery_dossier RPC, fused migration 123), pinned by
  tests/security/gallerySanitizeAllowlist.contract.test.js); the briefs
  audience rule is STRUCTURAL (briefs/composers.js header — player composers
  fail closed); display truth splices gate on includeGroundTruth
  (credibilityRead.js:56). NO "show DM secrets" toggle exists anywhere
  (grep-empty across src/ + supabase/) — and NO campaign-level share link
  exists; sharing today is settlement-scope (gallery dossier + playerView).
- Overlay substrate (amendment A recon): LayersPanel.jsx is the layer-toggle
  registry (mapState.layers + toggleLayer/setLayerFilter; the mapChains
  visible-but-locked gate precedent lives there); ChainEdges.jsx /
  MarkersLayer.jsx are the derived-render siblings; NO transit renderer exists.
- Composer substrate (amendment B recon): briefs/composers.js (settlementBrief /
  regionalBrief / sessionPrep — pure, sourced, INERT-NOT-CRASH), citations law
  in briefs/citations.js; migration columns carry originId/destId/arrivalTick +
  human reason strings (migration.js:326-341; migrationKernel.js:265).

## §3 STATE MODEL — sidecar ledger + the ONE schema change
- Engine truth: `worldState.spatialLedgers.roads` (set/getSpatialLedger idiom,
  distanceRead.js — zero persisted bytes when absent; drop-when-empty). Shape —
  object-keyed at EVERY level (deepCloneConditionalLedger + byte-stable
  serialization; codepoint-sorted key folds before every iteration):
  ```
  roads = {
    missions: { [missionId]: MissionRec },
    ransoms:  { [ransomId]:  RansomRec },
    cadence:  { [npcKey]: lastJourneyYear }   // pruned when the NPC vanishes
  }
  MissionRec = {
    id,                      // `road.${homeId}.${npcKey}.${departTick}`
    npcKey, npcName,         // npcId(sid, npc, index) — the ladder/agency idiom
    homeId, destId,
    purpose: { kind: 'observance'|'trade'|'diplomacy'|'ladder', ref },
                             // ref = traditionId | destId | relationshipKey | goal signalVar
    phase: 'outbound'|'visiting'|'returning',
    path: [ids…],            // the chosen (KNOWN-scored) route, frozen at dispatch
    departTick, legArrivalTick, stayWeeks,      // legArrivalTick per current leg
    escort01, riskTolerance01,
    knownDangerAtDispatch,   // the receipt that proves stale-intel dispatches
    trappedBySiege: false,   // stay extended (the §7 T2 extension)
    startedYear
  }
  RansomRec = {
    id,                      // `ransom.${missionId}`
    npcKey, npcName, homeId, captorId, threatClass,
    startedTick, termWeeks, remainingWeeks,
    conversionRolled: bool, willConvert: bool   // §10 — rolled once at capture
  }
  ```
- THE ONE SCHEMA-SHAPE CHANGE (⚠ OWNER-VISIBLE, §20 Q2): SimNpc gains ONE
  optional field, the display MIRROR written only by the mover via
  settlementUpdates (the npcLadder/traditions mirror precedent):
  ```
  npc.whereabouts = {
    state: 'traveling'|'visiting'|'returning'|'hostage',
    placeId,                 // destId while traveling/visiting; captorId while hostage
    purposeKind,             // the §4 purpose vocabulary, for display
    sinceTick,
    expectedReturnTick|null, // null while hostage or trappedBySiege
    missionId
  }        // ABSENT when home — dark worlds never carry the key.
  ```
  settlement.schema.js SimNpc typedef gains the matching loose `@property`
  line. The field is NOT added to publicSafe's NPC allowlist nor the server
  sanitize — it is SECRET BY CONSTRUCTION (§15).
- PERSISTENCE LIFECYCLE TRACE (every path, per the program's most-bitten class):
  * CREATE — mover only, inside the kernel result (ledger on returned
    worldState; mirror via settlementUpdates) ⇒ survives BOTH commit paths
    (§1 law 8) with zero new store code.
  * READ — kernels read the ledger; display reads the mirror; both null-safe.
  * PERSIST — spatialLedgers already rides worldState persist/clone
    (worldState.js:286-300, :352); the mirror rides the saves. No new persist
    surface.
  * REGENERATE — none: roads state exists only inside campaigns (tick-time);
    draft/pre-campaign settlements never carry it; generator goldens untouched
    by construction (the traditions §2 mint-time ruling's logic).
  * UNDO — undoLastPulse restores worldState + saves from the SAME snapshot ⇒
    ledger and mirror revert atomically; no orphan possible. PIN: an
    edit→advance→undo round-trip leaves no whereabouts key and no ledger.
  * CLONE — object-keyed-both-levels satisfies deepCloneConditionalLedger.
  * MIGRATE/IMPORT — campaignSync/accountImport carry worldState + saves
    wholesale (no field enumeration to extend); GALLERY import can never carry
    whereabouts because the public projection drops it (§15) — nothing to scrub.
  * DM-OP COLLISIONS — a DM `stasis-npc` on a traveler: the mover, on its next
    tick, CANCELS the mission ('overtaken' resolution, quiet receipt, no
    roll) — DM sovereignty always wins. A DM `return-npc` has no roads effect
    (roads never writes npc.stasis). A DM deleting/removing the NPC
    (remove_npc): mission + ransom records prune on the roster scan (the
    cadence-prune pass); no dangling keys. Each pinned.

## §4 MISSION GENESIS — purposes · cadence · selection · risk
- Runs once per tick per settlement inside the mover, AFTER the prune pass.
  Hard dampers first: settlement besieged/occupied/at-war-mobilizing ⇒ no new
  dispatches (warStatus + warPosture reads); flag-dark ⇒ unreachable.
- PURPOSES (borrowed-purpose law; scanned in this priority order, first match
  per candidate NPC):
  1. OBSERVANCE — a neighbor within range has a tradition whose window opens
     within OBSERVANCE_LEAD (≤ hop travel time + 2 weeks) and scaleBand ≥
     town-scale (spatialLedgers.traditions windows; weekOfYear from
     seasonOfWeek/clockOfTick, traditions/almanac.js:40/:50). This CLOSES the
     traditions §16 deferred seam "cross-settlement pilgrimage attendance".
  2. TRADE — destId ∈ tradeNeighbours(graph, homeId); candidate NPCs of
     merchant/economy category.
  3. DIPLOMACY — relationship home↔dest at rung `rival` or `cold_war`
     (relationshipState.js:74/:83) ⇒ a repair mission; government/noble
     category candidates. `hostile` = open war ⇒ NO routine envoys — but PEACE
     EMBASSIES are the sanctioned wartime journey (owner ruling 2026-07-19,
     §11b/R-8): the embassy DEPOSITS, the peace machinery CONSUMES; roads
     still never writes war state.
  4. LADDER — only when npcLadderEnabled is lit: a rung-holder with an active
     dynamic goal draws a seeded personal mission whose destination is the
     range-nearest settlement bearing on the goal's domain (e.g. a trade-domain
     goal → the richest trade partner). NARRATIVE-ONLY in v1: completion is a
     chronicle receipt naming the ambition; the mechanical deed credit stays
     with the ladder's own goal machinery, untouched (single-writer law).
     JUDGMENT (vetoable): no standing deposit from journey completion in v1.
- RANGE: destinations within MAX_JOURNEY_HOPS=2 on the trade graph AND
  hopWeeks ≤ 3 (near-radius law). STAY: stayWeeks = 1 + (scale/purpose seeded
  0..1) — "~1-week stays".
- CADENCE: per-NPC ≤ 1 GENESIS journey per year — the tick-invariant world-seed
  draw (law 9) fires with JOURNEY_CHANCE=0.35 per eligible NPC-year, checked
  against `cadence[npcKey] < year`; per-settlement concurrency cap ABROAD_CAP=2.
  Expected outcome: a court of ~8 notables produces ~2-3 journeys/year —
  infrequent by construction (§19 soak band).
  CLARIFIED 2026-07-28 (EP-l adjudication; roadsCharter.test.js encoded this
  from birth): the law governs GENESIS DISPATCH only. A captivity-release
  return leg (releasedFromRansom) is the RESOLUTION of the same journey (§9
  "release → phase 'returning'"), not a fresh genesis — the kernel mints a new
  mission id for the release leg with startedYear = the release year, so any
  instrument that counts mission ids per NPC-year double-counts interrupted
  journeys and will read phantom cadence violations (EP-l's 5-of-16-seeds
  finding was exactly this). Count genesis only.
- SELECTION (importance-INVERSE): eligible = importance ∈ {notable, key,
  pillar} (weight ≥ 0.4 — minor/nameless NPCs never travel), not in stasis,
  not away, not hostage. Draw weight = (1.15 − importanceWeight) for
  observance-routine/trade/diplomacy ⇒ notables carry most missions, pillars
  almost none. EXCEPTIONS (the great DO travel): (a) TRADITION-CRITICAL — the
  destination observance is the neighbor's LARGEST scaleBand ⇒ the owner-rank
  candidate set (seat/faction-owner NPCs) joins at full weight; (b) LADDER —
  the goal-holder travels regardless of rank. Deterministic pick: weighted
  draw off `roads-genesis:${sid}:${tick}`, codepoint tiebreak.
- RISK COHERENCE: riskTolerance01 from personality (npc.personality.dominant /
  .flaw — the corruption npcAlignmentScore read surface): cowardly/paranoid
  0.35 · cautious-dominant 0.5 · base 0.65 · bold/prideful/zealous 0.9.
  JUDGMENT (vetoable): no faction-strategy term in v1 — settlementStrategy
  exposes moves, not a posture vocabulary; the war-posture damper above
  carries the faction-level caution instead.

## §5 ROUTING — the KNOWN picture chooses the road
- THE KNOWN VIEW (new pure read, roads leaf `knownWorld.js`):
  `knownEmbattlementView(worldState, observerId)` returns a MINIMAL synthetic
  `{ spatialLedgers: { embattlement: believedLevels } }` object:
  * infoMode 'omniscient' (or no spatial canon) ⇒ return the REAL worldState
    (known ≡ true; zero allocation).
  * else, per settlement s in range: believed level = decay-weighted fold of
    the observer's rumorLedgers records that reference s with war/occupation/
    calamity/army event kinds (arrival recency in ticks; 'unreliable' mode
    fidelity already degraded the payload — reuse the record's own magnitude
    band), blended with belief() strength/relationship where beliefsActive
    (beliefMap.js:250). SILENCE DECAYS TOWARD CALM (SILENCE_CALM_WEEKS=26):
    no news from a region ⇒ it is ASSUMED safe — this single rule is what
    walks a poorly-informed faction's envoy into an army it didn't know about.
- ROUTE CHOICE: `chooseRoute(digest, knownView, homeId, destId,
  riskTolerance01, season)` — the EXISTING scorer over the believed overlay
  (embattlement.js:407; candidates frozen, scorer unchanged — zero forked
  route logic). The chosen path freezes onto the MissionRec.
- DISPATCH REFUSAL: if the best route's believed danger sum exceeds
  riskTolerance01 × DANGER_REFUSAL_CEILING ⇒ the mission is REFUSED at genesis
  (receipted in the ledger's cadence stamp — the year is spent; a cautious
  court stays home). knownDangerAtDispatch records the believed sum — the
  stale-intel receipt every capture chronicle cites.

## §6 THE JOURNEY — legs, arrival, return
- Legs ride the armyTransit idiom (armyTransit.js:180-232): departTick +
  legArrivalTick = tick + hopWeeks(home, dest, season); position01 derived at
  read time ((tick − departTick) ÷ span, clamp01 — never stored). Phases:
  outbound → (arrive) visiting for stayWeeks → returning → (arrive) HOME:
  mission resolves, whereabouts mirror DROPPED (field deleted via
  settlementUpdates), cadence stamped, return receipt minted.
- Per-tick mover order (deterministic, codepoint-sorted missions):
  1. prune (roster/DM collisions §3) → 2. advance phases/arrivals →
  3. hazard evaluation on in-flight missions (§7) → 4. ransom ticks (§9) →
  5. new-mission genesis (§4) → 6. mirrors + news fold.
- EXTENSIONS (the only two, per spec): trappedBySiege (§7 T2) holds phase
  'visiting' with expectedReturnTick null until the siege lifts; ALL-ROADS-
  HOSTILE — at return time, if every candidate route's believed danger exceeds
  the refusal ceiling, the traveler WAITS (phase 'visiting', re-checked each
  tick, receipt minted once).

## §7 THE GAUNTLET — threat classes · capture formula · the matrix
- Evaluated per in-flight mission per tick against TRUTH (law 4), one fork per
  mission (`roads-hazard:${missionId}:${tick}`), at most ONE hazard resolution
  per mission per tick (strongest applicable class wins; no double jeopardy).
- currentHop(mission, tick) = the path node at floor(position01 × (len−1)) —
  travelers occupy hop regions exactly as army columns do.
- PROTECTION (amendment C): `protection = (1 + ESCORT_SCALE × importanceWeight)
  × militaryQuality01`, ESCORT_SCALE=1.0 ⇒ notable 1.4 · key 1.7 · pillar 2.0
  escort factor. `militaryQuality01 = clamp(0.6 + 0.5×readiness01 +
  0.3×experience01 + 0.2×capacityBand01, 0.6, 1.6)` — readiness/experience
  from readinessOf(settlement) (martialReadiness.js:251), capacityBand01 the
  normalized militaryCapacityScalar (militaryStrength.js:312) of the HOME
  settlement at dispatch (frozen onto escort01 — the guards who left with you
  are the guards you have). "Better soldiers and equipment do make a
  difference." JUDGMENT (vetoable, amendment C's optional deepening): escorts
  do NOT debit home garrison effectiveness in v1 — composing that with the
  deployment/readiness accounting demands new bookkeeping (a transient
  garrison modifier ledger); DEFERRED to §20 Q5 with a recommendation against.
- EXPOSURE: `exposure = clamp01(0.45 + 0.08 × legWeeks + 0.15 × (phase ===
  'visiting' ? 1 : 0))` — long roads and foreign courts expose more.
- THE FOUR CLASSES (descending capture strength; α = protection exponent —
  the partial-bypass law: armies barely respect escorts):
  | # | class | trigger (TRUTH read) | base | α (protection^α divisor) |
  |---|---|---|---|---|
  | T1 | ARMY ON THE ROUTE / OCCUPATION DURING STAY | a live armyTransit column whose currentRegion (armyTransit.js:242) = the traveler's currentHop AND hostile to home (relationship/war read) — OR worldState.occupations[destId] exists while visiting | 0.35 | 0.25 |
  | T2 | SIEGE DURING STAY | isLiveWarFront into the host while visiting (warFrontReads.js:50 / warStatus.js:260 besiegedBy) | 0.22 | 0.5 |
  | T3 | EMBATTLED ROADS | currentHop embattlement phase 'embattled' (level ≥ 0.35) — bandits/monsters/calamity ground | 0.12 × level | 1.0 |
  | T4 | HOSTILE RECEPTION | at arrival + weekly while visiting: relationship home↔host NOW rival/cold_war/hostile (soured mid-visit or stale-intel dispatch) | host roll, below | 1.0 |
  captureP(T1-T3) = clamp(base × exposure ÷ protection^α, 0, 0.6).
- T4 THE HOST ALSO ROLLS (self-balancing): detentionP = 0.10 × hostilityRung
  (rival 1 · cold_war 2 · hostile 3) × exposure ÷ protection × restraint.
  `restraint = atOpenWar(home, host) ? 1.0 : LEGITIMACY_RESTRAINT=0.4` — a
  host NOT at open war pays applyLegitimacyHits −2 on detention (the detainer's
  own seat bleeds standing with its neighbors); the restraint factor prices
  that cost into the roll. GUEST-RIGHT (ON by default, vetoable §20 Q7): any
  tradition window active at the host this week (spatialLedgers.traditions +
  weekOfYear) ⇒ detentionP × GUEST_RIGHT_MULT=0.35 — observance periods
  protect the guest.
- THE THREAT-CLASS × OUTCOME MATRIX (one roll r per resolved hazard):
  | class | r < captureP → | else r < captureP+expelP → | else |
  |---|---|---|---|
  | T1 | HOSTAGE (captor = army's home / occupier) | — | DELAYED: legArrivalTick +1 week (receipt) |
  | T2 | HOSTAGE (captor = besieger) | — | TRAPPED: trappedBySiege until lifted |
  | T3 | HOSTAGE (captor = the embattled hop's settlement — the bandit ground's seat holds the captive market; a wilderness hop with no seat ⇒ nearest hop settlement) | — | ROBBED: news-only texture, journey continues |
  | T4 | HOSTAGE (captor = host) | EXPELLED (expelP = detentionP — turned back at the gates: immediate 'returning', mission failed, news) | RECEIVED: visit proceeds under strain (receipt) |
  NO CELL removes, kills, or resolves a named character — the matrix IS the
  no-death law made mechanical.

## §8 CAPTIVITY = STASIS — the chokepoint + the participation census
- On capture: mission → ransom record; mirror → `whereabouts.state='hostage'`,
  placeId=captorId, expectedReturnTick=null; MAJOR news.
- THE ONE CHOKEPOINT: `isOffStage(npc)` (exported from the roads state leaf) =
  `isInStasis(npc) || npc?.whereabouts?.state === 'hostage'` — the predicate
  the commission demands, built ON the existing one (npcOps.js:151), consulted
  at the EXISTING master gate: the buildWorldSnapshot participation filter
  (worldSnapshot.js:88-93) widens from `n.stasis` to `isOffStage(n)`. Because
  EVERY pulse kernel reads the snapshot's settlement (pulseKernel.js:283 et
  seq.), one edit excludes a hostage from agency, growth, recruitment, blocs,
  ladder, councils, and coups in one move. Presence-driven, flag-free at the
  filter: the whereabouts key only exists when the mover wrote it ⇒ dark
  worlds byte-identical without a rules read.
- SEAT SEMANTICS: a hostage inherits DM-stasis vacancy semantics exactly
  (DESIGN_NPC_LIFECYCLE §2): the court copes — role-fill may cover the seat
  (successorNpc / seatNpcsIntoFactions on later ticks); MEMORY KEEPS FLOWING
  (D5 — grievances/warmth decay normally); return = the reunion inherits the
  interim. Travelers (law 5) are NEVER filtered — no churn on routine trips.
- THE PARTICIPATION-CHOKEPOINT CENSUS (the design's most defect-prone seam —
  every `.npcs` reader in worldPulse enumerated from the grep census, each
  DISPOSITIONED; the implementer re-runs the grep at build time and treats any
  NEW reader as a census defect):
  | reader | anchor | disposition |
  |---|---|---|
  | buildWorldSnapshot | worldSnapshot.js:88-93 | THE MASTER GATE — widen to isOffStage (the one code change) |
  | npcAgency (agency/corruption/succession loops) | npcAgency.js (5 sites) | via-snapshot — NO EDIT (file at ceiling; protected by the gate) |
  | npcGrowthKernel | npcGrowthKernel.js (3) | via-snapshot — no edit |
  | npcLadderState.eligibleMembersOf | npcLadderState.js:146 | BELT: widen `n.stasis` → isOffStage (defense-in-depth, mirrors existing) |
  | npcLadderKernel / npcLadderChallenge | (4+1 sites) | via eligibleMembersOf + snapshot — no further edit |
  | corruptionWeb (asset/target picks) | corruptionWeb.js (4) | via-snapshot — no edit; §10 uses the RANSOM record, not the roster |
  | factionCapture / factionCompetition | (1 each) | via-snapshot — no edit |
  | disposition / clergyTraitPlane / causeLifecycle / religionLegitimacy / momentum / corruptionImpair / settlementLifecycleFirstClass | (1-2 each) | via-snapshot — no edit |
  | successorNpc (role-fill) | successorNpc.js (2) | via-snapshot — vacancy behavior INHERITED deliberately (above) |
  | partyImpact (DM edits) | partyImpact.js (4) | RAW READER — deliberately UNGATED: the DM may always target a hostage (sovereignty; remove_npc prunes roads records per §3) |
  | traditions kernel | traditionsKernel.js | reads factions/institutions, never npcs — n/a |
  | DISPLAY/dossier/briefs/aiGrounding | view layer | NOT gated — they SHOW the hostage with a whereabouts badge (§12), subject to §15 |
  PIN SET: a hostage fixture appears in zero participation receipts across a
  10-tick lit advance while a traveling fixture appears in ALL of them; the
  census grep count is itself pinned (a new `.npcs` reader fails the test
  until dispositioned — the inventory-ratchet discipline).

## §9 RANSOM — influence-priced, paid over ticks
- Term: `termWeeks = 13 + round(26 × importanceWeight)` — notable ~23w · key
  ~31w · pillar 39w. The captive's faction pays over the term; no player action
  required (the default path).
- THE WRITE SCHEDULE (all through §1 law 6 applicators, all bounded):
  * AT CAPTURE: home seat applyLegitimacyHits −(1 + round(2×importanceWeight))
    (notable −2 · key −2 · pillar −3); MAJOR news names the road and the captor.
  * DURING: remainingWeeks decrements; NO per-tick writes (silence is bounded).
  * AT TERM END (ransom paid): release → phase 'returning' home over hopWeeks;
    home seat −1 legitimacy (the treasury bled); captor settlement +1
    prosperity band-step for key/pillar captives (the upswing applicator
    idiom); home −1 band-step for PILLAR captives only (§20 Q10); NOTABLE news.
  * The POWER cost is EMERGENT, never written: the hostage's ladder standing
    decays toward baseline while off-stage (STAND_HALF_LIFE_WEEKS=156) and
    they can neither defend nor challenge (§8) — captivity erodes rank through
    the ladder's own physics. faction.power untouched (law 6).
- EARLY RELEASE EVENTS (each checked in the ransom tick, receipted): peace
  between home and captor (war termination reads) · captor occupied/liberated
  (occupations transition) · captor settlement razed/abandoned (lifecycle
  read) · party intervention (§11). Early release skips the captor prosperity
  credit and the final legitimacy hit.
- EXPULSION (T4 alternative) is not ransom: immediate return, no records
  beyond the mission receipt.

## §10 CONVERSION — the captor's covert asset, through the existing web
- Rolled ONCE at capture (`roads-hazard` fork; stamped conversionRolled/
  willConvert on the RansomRec): `p = 0.05 × flawFactor × durationFactor`,
  flawFactor = npc.personality.flaw ∈ CORRUPTIBLE_FLAWS (corruption.js:52) ?
  1.6 : (dominant zealous/principled ? 0.4 : 1.0); durationFactor =
  clamp(termWeeks/26, 0.5, 2). LOW by construction (~2-10%).
- APPLIED AT RELEASE (they return home CARRYING the leash — the foreign-patron
  shape needs them seated at home): the roads mover emits a RETURNED-CAPTIVE
  CHANNEL record into the ledger the corruption web's creation pass already
  consumes (corruptionWeb.js §2 — channels are hostile/rival edges, criminal
  corridors, smuggle paths; the returned captive joins as a fourth,
  quality-boosted channel keyed (captorId→homeId, npcKey)). The WEB then mints
  through its OWN gates — scarcity-as-law, one live asset per (patron,
  target), per-patron cap, E0 rarity — with the pick pinned to the returned
  captive. Beneficiary = captor; foreignFields shape (npcAgency.js:815-828);
  COVERT ⇒ NO news (law 7). ZERO new corruption machinery — the roads supply
  a channel, the web does everything else.
- GATING COHERENCE: conversion requires corruptionWebActive; web dark ⇒ the
  release resolves clean and the D5 relationship memory carries the grudge
  instead (§20 Q6 ratifies). Party RESCUE (§11) also skips conversion — the
  captor's leverage was broken, not bargained.

## §11 THE PARTY'S HAND — edit-dispatcher intervention
- TWO new edit kinds (names vetoable, §20 Q3), joining COMMITTABLE_EDIT_KINDS
  (pendingEdits.js:69) with pure op bodies in the lazy roads ops leaf (the
  npcOps.js pattern), dispatched through the existing commitPendingEdits
  applyNpcOp arm (settlementSlice.js:534):
  * `ransom-npc` — the party pays it off: ransom settles NOW (release +
    returning leg; home skips the final legitimacy hit — the party's coin
    covered it; captor still books the prosperity pulse). Receipt: the party
    bought a captive home.
  * `rescue-npc` — the jailbreak: immediate release + returning leg; NO captor
    credit; conversion voided; the captor-home relationship worsens through
    the EXISTING inflame_relationship party impact (partyImpactKinds.js —
    reused verbatim, no new relationship writer).
  * JUDGMENT (vetoable): NO `recall-npc` in v1 — aborting a routine 2-week
    trip has no drama and doubles the op surface; deferred (§21).
- Store surface: the dispatch rides pendingEdits (session-only queue,
  deterministic ids); any NEW store action this needs registers in
  operationRegistry + `gen:compendium-data` regen (law 12). Both ops ship
  guidance whispers (the lifecycle-doc covenant).

## §11b R-8 — THE EMBASSY EXTENSION (owner ruling 2026-07-19; implements after R-7)
- PURPOSE 5 — PEACE EMBASSY (wartime-only): a court dispatches an envoy to a
  settlement it is at open war with, intent = sue for peace. TWO VENUES:
  (a) ROAD PARLEY — interception by the TARGET's own army column converts the
  T1 encounter from a capture roll into a negotiation on the road; (b) COURT
  SUIT — arrival at the enemy gate as a declared embassy → negotiation there.
  THIRD-PARTY RULE: if the target is at war with 2+ powers, any OTHER enemy
  encountered en route does NOT negotiate — the suit wasn't addressed to them;
  standard T1 capture applies ("simply take them hostage").
- THE AMPLIFIER — envoy weight = f(envoy ladder rank/importance, envoy
  faction's power standing in the suing settlement), THE INSULT/HUMILITY
  CURVE: lowest-of-the-lowest reads as INSULT (negative modifier — may worsen
  the suit); highest-of-the-highest reads as HUMILITY (strongest positive).
  THE TRADE-OFF IS EMERGENT and deliberate: a greater envoy amplifies peace
  AND signals humility AND walks a richer ransom prize into the lion's den —
  dispatch refusal (§5) and faction tolerance weigh it. "The better the
  effort of pursuing peace, the least damaged out of the negotiations."
- SINGLE-WRITER PRESERVED (the returned-captive precedent, §10): the embassy
  writes an EMBASSY RECORD into the roads ledger (venue, envoyWeight,
  amplifier, tick); the EXISTING war-termination/peace machinery consumes it
  through its OWN gates as a peace-probability modifier + causal receipt
  ("peace was sued at the gates of X by Y"). RECON-FIRST for the implementer:
  locate the exact war-termination seam; if no consumable hook exists, add
  the MINIMAL consumption limb in the war system (deposit-and-consume, never
  a roads-side war write). Roads never resolves the war; it carries the suit.
- FAILURE (honor & chivalry — the no-death law in period costume): the court
  (or parley captor) rolls disposition: HOSTAGE (standard ransom machinery,
  captor = the target) or TURNED HOME (expulsion-shape return, receipted).
  Never worse. Success: the peace machinery does what it does; the envoy
  returns home under escort with a NOTABLE receipt.
- THE PEACE AMNESTY (generalizing the existing early-release event): when
  peace settles between two powers, ALL hostages EITHER side holds release
  IMMEDIATELY and begin the journey home under armed escort (the ordinary
  return leg; escort = the RELEASING side's courtesy detail). The existing
  "peace between home and captor" early-release trigger becomes bilateral
  and universal; pinned both directions.
- THE INTERCEPTION RACE (owner refinement, same day: "third party, if the
  news reaches them, may try to intercept peace negotiations"): an embassy's
  departure mints a QUIET news event that propagates through the EXISTING
  rumor network (hop-by-hop over trade edges, hopWeeks-delayed, fidelity-
  degraded — no new carrier). Any third-party power AT WAR WITH THE TARGET
  whose rumor ledger RECEIVES the embassy news while the mission is in
  flight acquires the strategic motive (a separate peace frees the target's
  armies against them) and becomes an INFORMED HUNTER: its army columns
  within reach of the embassy's route gain a HUNT AMPLIFIER on the T1
  encounter roll for THAT mission (they are actively looking). Outcome on
  interception = the third-party rule (capture, no negotiation) — and the
  suit dies unheard. THE RACE IS EMERGENT AND HONEST: a short road may
  outrun the news entirely; a distant suit gives the rumor time to arrive;
  an 'unreliable' infoMode third party may never learn or learn wrong; an
  omniscient one hunts from the first tick. The intel layer now matters a
  THIRD time (routing · verification · interception). Zero new machinery:
  the rumor lattice carries the news, armyTransit already knows where the
  hunters are, and the hazard evaluation reads one amplifier term.
- PURPOSE 6 — DOMINION INSPECTION: an envoy of an occupying/suzerain power
  travels to view an occupied or vassalized holding (destination = a
  settlement under the home power's occupation-ladder rung); low external
  threat, hostile-population texture; receipts feed the occupation display.
- PURPOSE 7 — RUMOR VERIFICATION: travel to a MORE TRUSTED source settlement
  to confirm information ("confirm information and rumors from a more
  trusted source") — the journey's RETURN explicitly WRITES the home rumor
  ledger with a freshness/fidelity boost for the verified events (this
  promotes the coherence-mandate seed archetype — traveler-writes-rumor —
  from loop candidate to first-class purpose; the write rides the mover's
  sanctioned ledger surface, LAW 6 amended to include the home rumor-ledger
  deposit as write (g)).
- ESCORT REFINEMENT (amendment to the §7 protection formula, ALL purposes):
  protection = (1 + ESCORT_SCALE × importanceWeight) × militaryQuality01 ×
  settlementWeight01, where settlementWeight01 = clamp(0.8 + 0.2 ×
  powerRank01 + 0.15 × influenceRank01, 0.8, 1.3) — the home settlement's
  power and influence rankings scale the escort's weight alongside military
  might and the traveler's rank ("scales the protection weight based on the
  military might, power ranking, and influence ranking of that settlement
  and that NPC"). Read-only derivation from existing rankings; frozen at
  dispatch like the rest.

## §12 CHRONICLE + SURFACES
- NEWS (mover newsEntries[] → applyPulseMover fold, pulseKernel.js:2342;
  distance-priced spread untouched): departure (quiet; NOTABLE for pillar or
  tradition-critical) · capture (MAJOR) · ransom-paid/return (NOTABLE) ·
  expulsion (NOTABLE) · robbed/delayed (texture) · conversion (NOTHING — law 7).
- PROSE: `src/data/roadsProse.js` (new lazy data leaf — the CONTENT-GT
  max-lines ratchet rule) registered through the eventProse pool idiom
  (pickLine/fnv1a32, canonical-at-zero, no calamity substrings): departure /
  capture-per-class / ransom / return / expulsion / guest-right pools, each
  with `{npc}` `{home}` `{dest}` `{captor}` `{purpose}` interpolation.
- DOSSIER: the NPC card gains ONE whereabouts line when the mirror is present
  ("Away — attending the Hearthfire in Dulwich, back by spring" · "Held in
  Dulwich — the ransom is being raised"); lazy, display-read only.
- Almanac/RealmStrip "expected travelers" line: DEFERRED (§21).
- Both overlay and scene surfaces below are DM-SECRET per §15.

## §13 R-6 — THE TRAVELERS OVERLAY (amendment A: the realm-map transit layer)
- REGISTRATION (the LayersPanel precedent, LayersPanel.jsx — checkbox row +
  optional filter sub-list; store: mapState.layers + toggleLayer/
  setLayerFilter): new layer key `travelers` (default false), row "Travelers &
  columns", filter sub-list {armies, migrants, envoys}. The mapChains
  visible-but-locked gate precedent is NOT needed (no tier gate — this is a
  DM-truth lens, §15 governs sharing, not pricing).
- RENDERER: `TravelersLayer.jsx`, a lazy sibling of ChainEdges/MarkersLayer
  (derived-at-render-time discipline — ChainEdges.jsx header), drawing along
  the trade-graph road edges between placements:
  (a) ARMIES — worldState.spatialLedgers.armyTransit records: position =
      interpolation along the path polyline at position01 (the advancePosition
      math, armyTransit.js:220-232, recomputed pure at render); direction
      chevron toward path[i+1]; faction/banner identity from the army's home;
      ETA tooltip = (arrivalTick − tick) weeks (hop timing).
  (b) MIGRANT COLUMNS — migration ledger records {originId, destId,
      arrivalTick} (migration.js:326-331): ROAD-BORNE ONLY — render only when
      candidateRoutes yields a land path for the pair (sea-lane-only and
      teleport pairs excluded); derived position01 = 1 − (arrivalTick − tick)
      ÷ max(1, hopWeeks(originId, destId, season)).
  (c) NAMED TRAVELERS — roads ledger missions: marker + direction + a
      purpose-class tooltip ("An envoy of Dulwich, bound for the Hearthfire").
      Renders ONLY when roadsEnabled is lit (no ledger ⇒ sub-layer absent —
      trivially dormancy-safe).
- CONSTITUTION: purely derived read-only rendering; zero sim mutation; lazy
  chunk; zero eager bytes beyond the declared layers-key default (§16). The
  army/migration sub-layers are THE WAVE'S ONLY NOT-FLAG-GATED DELIVERABLE —
  safe because they are a plain UI lens over LIVE systems' existing ledgers:
  no write path exists, dormant ledgers render an empty layer, and no golden
  hashes any UI. (The roads NPC sub-layer stays flag-coupled as above.)

## §14 R-7 — THE ROAD SCENE (amendment B: party-travel staging for the DM)
- The party (the PLAYER's group) is NEVER a sim entity: this is a LENS + a
  COMPOSER, full stop — party travel writes NOTHING into sim state (pinned:
  compose leaves worldState reference-equal). Hostage-intervention hooks stay
  in §11's edit-dispatcher design.
- COMPOSER: `src/domain/briefs/roadScene.js` — `composeRoadSceneBrief({
  originId, destId, worldState, settlements, regionalGraph, tick, season })` →
  a sourced Brief bundle (the briefs/composers.js S2 idiom: pure, citation-law
  via briefs/citations.js, INERT-NOT-CRASH — a quiet realm yields dropped
  sections, never a throw). Reads TRUTH at the current tick. Sections:
  * THE ROAD — the chosen route (chooseRoute over TRUTH; the party sees the
    real best road) with per-hop conditions: embattlement level/phase,
    banditry ground, tolls, active calamity stamps.
  * ON THE ROAD — armies crossing the route (armyTransit currentRegion/
    remainingRegions + direction + allegiance) · migrant columns WITH their
    causal reason (the migration reason vocabulary — e.g. "Refugee column
    arrives from a shed settlement", migrationKernel.js:265 + the
    populationHistory reason strings — the causal-reasons layer supplies the
    why) · traveling named NPCs with purpose + escort posture (escort01 band).
  * AT THE GATES — destination context: siege state (warStatus.js:260),
    occupation rung (occupation.js STATE_LADDER), festival/guest-right timing
    (traditions windows + §7 guest-right note).
- AFFORDANCE (JUDGMENT, vetoable): "Stage the road" action in RealmInspector
  when origin + destination are picked on the realm map (the realm surface
  already owns settlement picking); panel lazy. A QuickInspector entry is
  deferred (§21).
- AI DRESSING (optional): one button routing the composed bundle through the
  EXISTING metered AI surfaces (the S1/S3 grounding lane — the parley/
  ai-analyst pattern): normal credit spend, sessionGate applies, zero new AI
  machinery; the un-dressed bundle stands alone (the composers' law).

## §15 THE SECRETS SEAM (amendment D — the render-layer redaction law)
- RECON RECEIPTS: the redaction chokepoint EXISTS — toPublicSafe
  (display/publicSafe.js: FAIL-CLOSED top-level allowlist + growing recursive
  denylist + NPC allowlist), mirroring the SERVER'S authoritative
  `_gallery_sanitize_public_json` (get_gallery_dossier RPC; fused migration
  123), pinned identical by tests/security/gallerySanitizeAllowlist.contract
  .test.js. The corruption covert-leak protection (CERTIFIED, W-DOCTRINE-3)
  rides this same seam: covert states never reach shared payloads. Briefs are
  structurally audience-gated (composers.js header). A "show DM secrets"
  toggle DOES NOT EXIST (grep-empty), and neither does a campaign-level share
  link — sharing today is settlement-scope (gallery dossier / playerView).
- THE BINDING (no parallel seam invented — the roads join the EXISTING one):
  1. `npc.whereabouts` is NOT added to the publicSafe NPC allowlist NOR the
     server sanitize ⇒ every shared/gallery/anonymous payload drops it BY
     CONSTRUCTION (fail-closed allowlists — the reason they exist). The
     contract test extends with an explicit whereabouts-never-ships assertion.
  2. `worldState` (roads ledger, ransoms, army positions) NEVER ships to any
     shared surface today (gallery payloads are settlement-scope) — asserted,
     not assumed, by the §19 data-probe.
  3. THE PREDICATE (single-chokepoint discipline, the stasis-predicate twin):
     `viewerSeesDmSecrets(ctx)` exported from ONE lazy display leaf — TRUE
     only for the owning DM's authenticated session on their own campaign;
     FALSE for every share/gallery/anonymous/unknown context (FAIL CLOSED —
     ambiguity = hidden). Every roads render surface (overlay, road scene,
     whereabouts card line in any shared rendering path) consults it. Today
     it is truth-constant per surface (roads surfaces only mount in owner
     sessions); it exists so the FUTURE campaign-share surface flips ONE
     switch: when that surface lands, it adds the owner-facing "show DM
     secrets" toggle (default OFF) as the predicate's one input — designed
     here, built with the share surface (§21).
- THE CLASSIFICATION TABLE (roads outputs; every item recorded):
  | output | class | rationale |
  |---|---|---|
  | a settlement's tradition/festival window (calendar) | PLAYER-SAFE | public culture; already on public surfaces via traditions |
  | roads chronicle prose that reached a settlement's news | PLAYER-SAFE via the EXISTING public-chronicle/rumor channel only — what arrived as news is what the world knows | the rumor network IS the in-fiction disclosure model |
  | npc.whereabouts field (raw) | DM-SECRET (by construction, binding 1) | live movement data |
  | a traveling NPC's marker/direction/purpose (overlay c) | DM-SECRET | movement + intent |
  | army positions, directions, ETAs (overlay a) | DM-SECRET | the owner's explicit example |
  | migrant column positions (overlay b) | DM-SECRET | derived movement lens (the aggregate FACT of migration reaches players via news; the live map does not) |
  | road-scene briefs (all sections) | DM-SECRET | truth composer (a player-safe variant is a deferred seam §21) |
  | roads ledger / ransom records | DM-SECRET | never leaves worldState |
  | hostage FACT in public chronicle (capture was MAJOR news) | PLAYER-SAFE through the news channel | a lord's capture is the realm's gossip — the players plausibly know |
- Redaction is RENDER-LAYER only: sim state untouched; and it means the DATA
  DOES NOT SHIP — the §19 probe loads a shared view and asserts zero
  secret-bearing payloads reach the client (network/payload assertion, never
  a CSS check).

## §16 FLAG · DORMANCY · GOLDENS · BUDGET
- `roadsEnabled` virtual (law 2); ⚠ BOOLEAN_KEYS/RULE_COMPARISON_KEYS derive
  from DEFAULT_SIMULATION_RULES — adding it there changes preset identity and
  persists bytes (the traditions §12 warning verbatim). Lit ONLY at THE ONE
  REGEN (owner-queued §20 Q1); tests light it locally.
- INTERPLAY LEDGER (gates the mover consults, each null-safe): spatial canon
  marker (no digest ⇒ no roads — aspatial/teleport campaigns stay dormant,
  byte-identical, the migration §9 precedent) · traditionsEnabled (dark ⇒ no
  observance purpose; other purposes run) · npcLadderEnabled (dark ⇒ no ladder
  purpose) · corruptionWebActive (dark ⇒ no conversion §10) · warLayerEnabled
  (dark ⇒ T1/T2 can never trigger; T3/T4 still live) · infoMode (omniscient ⇒
  known≡true §5). Each combination is a dormancy-golden variant or a pin.
- GOLDENS: `tests/property/roadsDormancyGolden.test.js` — (a) flag-absent
  full-advance mechanical hash vs committed manifest (byte-identical), on a
  war-shaped SPATIAL world; (b) dormancy CONTRACT — no spatialLedgers.roads
  key, no npc.whereabouts on any save, no roads news kinds, even lit-war;
  (c) LIT ANTI-VACUITY — gate ON mints missions and stays bounded (the
  supplyWebWarfare golden's three-block shape :146/:201/:207). Generator
  goldens untouched by construction (tick-time only, §3).
- EAGER BUDGET (declared, measured at every slice): COMMITTABLE_EDIT_KINDS
  strings (~60 B) + operationRegistry entries (~200-300 B) + the
  mapState.layers `travelers:false` default (~20 B) ⇒ DECLARED CEILING 600 B
  eager, everything else lazy. Headroom receipt: the de-eagering lane holds
  closure 1,022,962 vs budget 1,040,000 (≈17 KB headroom) — the wave fits;
  the slice gates run the closure check and quote the number.

## §17 COHERENCE MATRIX (reads → / writes ⇒)
READS: trade graph + hopWeeks/candidateRoutes/scoreRoute/chooseRoute ·
rumorLedgers + beliefMaps + infoMode · traditions windows + almanac clock ·
relationshipState rungs · npcLadder goals/instability (null-safe) ·
armyTransit records · occupations · warFrontReads/warStatus · embattlement
levels/phase · warPosture · readinessOf/experience + militaryCapacityScalar ·
importanceWeight · personality (dominant/flaw) · CORRUPTIBLE_FLAWS ·
migration ledger (overlay/scene) · stasis (isInStasis).
WRITES ⇒ ONLY (law 6): spatialLedgers.roads · npc.whereabouts mirror ·
publicLegitimacy score (idiom) · prosperity band-steps (idiom) · newsEntries ·
the returned-captive channel record (consumed by the web's OWN creation pass) ·
outcome/provenance ids via existing passes. The review greps the lane's diff
against this list (the traditions §14 enforcement).

## §18 SLICES (lane: claude/the-roads off the composite; Opus implementer;
lettered commits; focused gates per slice + the FULL suite at lane end with the
flake-isolation protocol; every JUDGMENT labeled vetoable in slice reports;
git: stage explicit files only, `git stash` FORBIDDEN)
- R-1 THE STATE + THE FLAG: a) roads state leaf (`src/domain/roads/state.js`:
  ledger shapes, isOffStage, tuning tables) + unit tests · b) flag gate +
  mover skeleton (`worldPulse/roadsKernel.js`, name-swapped chain, no-op body)
  + roadsDormancyGolden (all three blocks) · c) SimNpc typedef @property +
  publicSafe/server-allowlist contract extension (whereabouts never ships) +
  viewerSeesDmSecrets predicate leaf. GATES: focused vitest + the golden +
  gallerySanitizeAllowlist contract. DONE-WHEN: dark full-advance hash
  byte-identical (executed); allowlist pin green; closure delta quoted.
- R-2 MISSIONS + ROUTING: a) purpose scan + cadence (world-seed fork) +
  importance-inverse selection + knownWorld.js + chooseRoute dispatch +
  refusal receipts · b) journey legs/arrival/return + mirror writes + prune/
  DM-collision pass + departure/return prose + news + lit anti-vacuity.
  GATES: focused + golden re-run. DONE-WHEN: a 3-year lit spatial run
  (executed test) shows journeys of every available purpose, a
  known-danger refusal, and clean return-home; dark still byte-identical.
- R-3 THE GAUNTLET: a) hazard evaluation + T1-T3 capture formula + protection
  (military-quality reads frozen at dispatch) · b) T4 host roll + restraint
  legitimacy cost + guest-right + expulsion + trappedBySiege + all-roads-
  hostile wait + matrix prose/news. GATES: focused matrix fixture suite —
  EVERY matrix cell exercised via forced fixtures (executed). DONE-WHEN: each
  cell lands its exact outcome; roster conservation asserted across every
  fixture; no protection bypass exponent regression (pinned numbers).
- R-4 CAPTIVITY: a) snapshot chokepoint widen + ladder belt + the census pin
  set (§8 — including the `.npcs`-reader ratchet grep test) · b) ransom
  records + write schedule + early-release events · c) the returned-captive
  channel + corruptionWeb consumption + covert-no-news pin + conversion
  gating pins. GATES: focused + participation pins + web goldens untouched.
  DONE-WHEN: capture→ransom→release round-trip executed in a lit walkthrough;
  hostage in zero participation receipts, traveler in all; conversion mints
  only web-lit and only via the web's own gates.
- R-5 THE PARTY'S HAND + SURFACES: a) ransom-npc/rescue-npc op bodies + kinds
  + dispatcher arm + operationRegistry + gen:compendium-data regen + whispers ·
  b) dossier whereabouts line + prose pools data leaf + a11y. GATES: focused +
  the operationRegistry walker + compendiumDataFreshness. DONE-WHEN: both ops
  round-trip through commitPendingEdits (executed); an undo after each leaves
  no orphan state (§3 pin); eager delta re-quoted ≤600 B cumulative.
- R-6 THE TRAVELERS OVERLAY: a) layers key + LayersPanel row + TravelersLayer
  with army + migrant sub-layers (plain UI over live ledgers — the wave's only
  not-flag-gated deliverable, §13 justification) · b) the envoy sub-layer
  (ledger-presence-coupled) + direction/ETA tooltips + filters + a11y ·
  c) eager-budget proof (delta ≈20 B, quoted) + the §19 shared-view data
  probe covering the overlay. DONE-WHEN: seeded fixtures render all three
  sub-layers; dark world renders army/migrant only; zero overlay data in a
  shared context (executed probe).
- R-7 THE ROAD SCENE: a) roadScene composer + INERT-NOT-CRASH + citation
  tests · b) RealmInspector affordance + lazy panel + optional AI-dressing
  pass through the existing metered surface (sessionGate asserted) ·
  c) secrets classification enforcement + the composer's zero-write pin
  (worldState reference-equal). DONE-WHEN: a war-shaped fixture composes all
  three sections with sources; a quiet world composes an empty bundle; zero
  sim writes proven.
- R-8 THE EMBASSY EXTENSION (§11b): a) embassy purpose + venues + amplifier +
  embassy record + the war-seam consumption limb (recon-first) · b) failure/
  amnesty (bilateral release pinned both ways) + escort refinement + purposes
  6/7 (dominion inspection · rumor verification with the return-side ledger
  write) · c) charter extension: embassy cells join the walkthrough (a peace
  sued and settled; an insult suit; a third-party capture; the amnesty
  release) + prose pools. GATES: focused + dormancy re-run + the war-system
  goldens untouched except via its own consumption gates.
ORDERING: R-1 → R-2 → R-3 → R-4 → R-5; R-6 after R-2 (mission records exist);
R-7 after R-3 (threat reads exist); R-8 after R-4 (it consumes ransom/release
machinery) — a separate dispatch after the R-5..R-7 lane closes. R-6a may land any time after R-1 if the
lane needs parallelism. FULL SUITE at lane end (the focused-gates blind spot
is proven — owner memory; resto2-style flake isolation: diff isolation runs,
never raw failing sets).

## §19 VERIFICATION CHARTER
- THE LIT WALKTHROUGH (the traditions T-2 proof pattern, mandatory before the
  lane closes): a 12-year lit run on a war-shaped SPATIAL world (executed
  test, quoted output) demonstrating — journeys fire within the cadence band
  (0.2-0.6 per eligible NPC-year; per-NPC ≤1 GENESIS/year absolute — release
  legs are the same journey resuming, excluded from the count per §4's
  2026-07-28 clarification) · every purpose
  kind observed · ≥1 capture per threat class (fixtures may force the rare
  ones) · a ransom term completes with the full write schedule · a conversion
  mints (web lit) and does NOT (web dark) · every captured NPC is released,
  expelled, or converted — ZERO named-NPC removals (roster conservation
  asserted every tick) · dark twin of the same run byte-identical.
- CATCH-UP EQUIVALENCE: a 26-week collapsed catch-up ≡ 26 serial one-week
  advances (state hash equality — the §1 law 8 proof); the cursor re-stamp
  covered by existing tests in BOTH commit paths (campaignAdvanceSession.js
  :311/:497) — the roads add no cursor, asserted by review grep.
- PAUSE/DISMISS BYTE-EQUIVALENCE: no residue banked ⇒ the existing
  residueStripRegistry test stays green with ZERO new entries (explicit
  assertion in the R-1 report).
- SOAK METRICS (certification bands, not assumptions): journey cadence band
  above · capture rate 2-10% of journeys with conditional strength ordering
  T1 > T2 > T3 > T4 · ransom completion ≥80% absent intervention · conversion
  2-10% of captivities (web lit) · guest-right measurably suppresses T4 in a
  festival-window A/B · legitimacy net-drift bounded (no runaway from
  capture stacking).
- THE ADVERSARIAL PASS (a dedicated skeptic pass over the assembled lane;
  findings are defects): 1. NO-DEATH source scan — no removal/termination
  branch reachable from any roads path (walker over the matrix code + the
  fixture sweep). 2. THE SECRETS DATA-PROBE — load a shared/gallery/anonymous
  view of a campaign-bearing settlement with roads state: assert the payload
  carries NO whereabouts field, NO roads ledger, NO army-position data (
  payload/network assertion, not CSS); re-run against the server sanitize
  fixture. 3. STALE-INTEL PROOF — an 'unreliable' faction dispatches into a
  believed-calm/truly-embattled route (knownDangerAtDispatch < truth) and the
  capture receipt cites it. 4. DM-COLLISION fuzz — stasis/remove/return ops
  fired at every mission phase leave no orphan records (executed matrix).
  5. DOUBLE-JEOPARDY — one mission, one tick, at most one hazard resolution.
  6. LEDGER-SHAPE fuzz — malformed/legacy records normalize, never throw.

## §20 OPEN QUESTIONS (owner-gated; each ships with a recommendation and a
safe default that requires no answer to build)
1. THE ONE REGEN membership: `roadsEnabled` joins the lit-flag batch? REC: yes,
   with the other engine lifts. DEFAULT BUILT: dark.
2. ⚠ OWNER-VISIBLE — the SimNpc.whereabouts field shape (§3): the wave's one
   schema-shape change. REC: as specified. DEFAULT BUILT: as specified;
   renaming/reshaping before the lane is free, after it is a migration.
3. Edit-kind names `ransom-npc` / `rescue-npc` (+ the withheld `recall-npc`).
   REC: as named. DEFAULT: as named.
4. travelMode reconciliation: the profile carries a LOCKED `travelMode:
   'instant'` axis (simulationProfile.js:116 canonicalization). REC: keep
   `roadsEnabled` separate — travelMode remains the future player-facing
   travel axis; a later unlock may fold the flag into it. DEFAULT: separate.
5. ESCORT-DRAIN (amendment C's optional deepening): escorts debit home
   garrison effectiveness for the journey. REC: NO — requires a transient
   garrison-modifier ledger (new bookkeeping) for marginal realism on 2-5
   guard escorts. DEFAULT: not built (JUDGMENT recorded §7).
6. Conversion gated on corruptionWebActive (web dark ⇒ no conversion). REC:
   ratify — "through the existing corruption system" implies its gates.
7. Guest-right ON by default. REC: yes (it is the self-balancing half of T4).
8. Hostage seat semantics inherit DM-stasis vacancy (role-fill may cover the
   seat; reunion inherits the interim). REC: ratify — one shelf, one law.
9. The "show DM secrets" share toggle: designed (§15), buildable only WITH a
   campaign-share surface, which does not exist. REC: build the toggle with
   that surface; this wave ships the predicate + fail-closed posture.
10. Pillar-grade home prosperity debit at ransom completion (−1 band-step,
   pillar only). REC: yes — a realm notices ransoming a pillar. DEFAULT: built.

## §21 DEFERRED SEAMS (recorded, never silent)
Travel as mechanical absence (law 5's widening) · `recall-npc` · a player-safe
road-scene composer variant · almanac "expected travelers" line · QuickInspector
road-scene entry · sea-lane journeys (roads × seaLanes/naval) · ladder-mission
standing deposits (single-writer negotiation with the ladder lane) ·
escort-drain (Q5) · the campaign-share surface + its secrets toggle (Q9) ·
journey arcs/animation beyond markers on the overlay · roads-aware trade-lane
bonus (a successful trade mission nudging channel strength).

## §22 RECON HAZARDS BOUND INTO THE BRIEFS (fire = defect)
Weeks are canonical (4-4-5, 52-week year; never derive from months) · ALL state
in kernel results — both commit paths, no store cursors · spatialLedgers
namespace, object-keyed at every level, drop-when-empty · tick-invariant
world-seed forks for cadence, pulse-confluence forks for events — labels are
load-bearing, never rename · prosperity via prosperityRank only, never
string-match · publicLegitimacy legacy bare-number guard
(Number.isFinite(pl?.score)) · faction key = `.faction`, never `.name` ·
faction.power is DERIVATION OUTPUT — never write it · pulseKernel (1387) and
npcAgency (833) are at size-baseline ceilings — name-swap + lazy leaves only,
no edits beyond the snapshot filter line · worldSnapshot filter widening must
preserve the same-reference dormant path (no `.filter` allocation when nobody
is off-stage) · publicSafe allowlists FAIL CLOSED — never add whereabouts; the
denylist only grows · eventProse canonical-at-zero + no calamity substrings
(F24: python byte-count check for NUL evasion) · migration ledger due columns
read pre-drain (traditions §9 precedent) if the overlay needs origins ·
react-pdf renderToBuffer is non-deterministic — never byte-compare PDFs ·
resto2 full-suite is parallelism-flaky — diff isolation runs · worktrees
silently test against MAIN node_modules (npm ci EUSAGE walk-up) · never read a
gate through `| tail` — run bare, check ITS exit code · `npm run build` before
dist contracts · new src/domain files must not import the store (FOUR ratchets)
· stage explicit files only; `git stash` FORBIDDEN in agent lanes.
