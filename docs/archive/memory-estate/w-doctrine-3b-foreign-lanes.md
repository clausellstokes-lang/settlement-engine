---
name: w-doctrine-3b-foreign-lanes
description: W-DOCTRINE-3b/3c (THE FOREIGN LANES) — §2/§3/§4 blowback/§6 composer COMPLETE + §5 PARTIAL, now COMMITTED on review-fixes-2026-07-08 @ 6481e5ce; full gate GREEN. ✅ THE BUDGET FLAG is RESOLVED (FP-G4 @ 9e63d801): the veto is KEPT + a −12,730 B economicData eager-trim cleared the 0-margin landmine → budget ratcheted #6 to 1,149,256 (measured 1,149,172 + 84 B house margin). Remaining §5 deferrals below.
metadata:
  node_type: memory
  type: project
  originSessionId: 049d4c82-58c0-4be1-956a-d47c628ee704
---

## W-DOCTRINE-3c UPDATE (2026-07-15, session 049d4c82) — §4 + §6 COMPLETE, §5 PARTIAL

Built on review-fixes-2026-07-08 @ 0ae0f4f9 (UNSTAGED for the manager; foreign stash@{0} untouched;
HEAD unchanged). FULL GATE GREEN: tsc full 0, strict 0/ceiling 0, eslint 0 err, vitest 9370 pass/1 skip,
build OK, verify:dist 113/113, dormancy golden byte-identical + EXTENDED (§4/§5 dormancy assertions).
any-cast baseline unchanged.

### ✅ §4 THE FOREIGN CONSEQUENCE LANE (COMPLETE)
- `corruptionWeb.js` (LAZY): `applyForeignExposureBlowback` fires THE BLOWBACK TRIPLE on a foreign
  exposure — (1) the decaying `spatialLedgers.exposedCorruption` ledger keyed `${corrupted}>${patron}`
  (the war-reason fuel; decay-on-read `exposedCorruptionForPair`, prune-on-write); (2) a people-held
  grievance (`applyRelationshipPatch`, incidentType `foreign_corruption_exposed` — DISTINCT so it does
  NOT trip revanchism's betray-regex) bumping resentment on the (corrupted↔patron) edge → feeds
  scoreGrievance same tick; (3) a deception-class credibility charge on the patron via `advanceCredibility`
  (gated internally on infoStatecraft ⇒ no-op if dark). BOTH-court legitimacy hits returned as `courtHits`
  and stamped by the KERNEL (withActiveCondition 'corruption_exposed', rotten/villainous copy) — npcAgency
  has no cross-settlement handle. `foreignExposuresFrom` filters exposures the mover ANNOTATED with
  `foreign:true`+patron endpoint (byte-neutral — corruptionEvents picks only 5 fields; blowback gated).
  Wired in pulseKernel right after the localSettlements loop (~L552).
- **warReasons.js**: `scoreCorruptionExposed` now reads `exposedCorruptionForPair(worldState, from, to, tick)`
  (was the `undefined` stub). ⚠️ CYCLE-BREAK: warReasons imports corruptionWeb (one-way); corruptionWeb
  INLINES `corruptionPairKey` (never imports warReasons.reasonPairKey — a drift-guard pin asserts parity).
- **causeLifecycle.js Terminal 2b**: the local-institution-death terminal GENERALIZED — a foreign leash whose
  endpoint (`foreignEndpointLive`: settlement gone/destroyed/occupied) is dead re-points/resolves the leash,
  SAME resolve-vs-recatch fork. GATED on corruptionWebActive (a betrayal traitor in a NON-lit world keeps
  today's behavior — byte-identical). LOCAL receipt strings kept BYTE-IDENTICAL (branched copy).
- **Double-surfacing**: inherent — a cutout resolves non-foreign ⇒ runs the LOCAL path (names the local org),
  the patron rides DM-truth only; the blowback never fires for a cutout. Pinned.

### ✅ §6 THE COMPOSER (COMPLETE)
- `EventComposerCorruptionFields.jsx` + `EventComposer.jsx`: a BENEFICIARY picker — "This settlement's
  underworld" (default, byte-identical) vs a foreign court (from campaignSettlementOptions). `buildEvent.js`
  stamps `payload.leash` (normalized) for a `foreign:<id>` beneficiary; local ⇒ today's criminalInstitution.
- `mutateEntities.js imposeCorruption` (⚠️ EAGER): stamps `corruptTies.leash` from payload.leash (a minimal
  stamp — buildEvent normalizes; imposeCorruption must NOT import the lazy resolver); vetoes `no_beneficiary`
  when a foreign leash lacks a settlement endpoint; local path byte-identical. affordanceManifest coversVetoCodes
  += 'no_beneficiary' (walker-legal). `publicNpc` auto-safety pinned (the allowlist drops corruptTies wholesale).

### ✅ THE BUDGET FLAG — RESOLVED (2026-07-15, verified read-only from a sibling worktree)
The 0-margin landmine described below was CLEARED by a parallel Fable session, NOT by dropping the veto.
Committed history on review-fixes: `6481e5ce` (3c completes) → `9e63d801` FP-G4 MARGIN RESTORE. FP-G4 found
`economicData.js` dragging the 21 KB TRADE_DEPENDENCY_NEEDS raw-material table eager to serve a 9 KB
finished-goods classifier → split to a `finishedGoodsCategory` leaf, **−12,730 B** (the npcData/npcTraitWeights
idiom). Budget RATCHET #6 → **1,149,256** (measured closure 1,149,172 + 84 B house margin). The
`no_beneficiary` veto is **KEPT** at HEAD (mutateEntities.js `imposeCorruption` + affordanceManifest
`coversVetoCodes`) — the earlier "drop the veto to reclaim ~55 B" option is now moot AND would be wrong
(sacrifices input-validation for headroom that already exists structurally, at 231× the scale). Posture = the
"dedicated eager microtrim elsewhere, keep the veto" path, executed as a structural reclaim. NO owner gate
tripped (a ratchet-DOWN is house-legal; raises are the owner-signed thing). Original flag text preserved below
for provenance:
> §6's imposeCorruption leash-stamp is in the EAGER first-paint closure (`index` chunk). It consumed the FULL
> 84 B headroom: first-paint WAS EXACTLY 1,161,902 B = budget, 0 MARGIN (was 1,161,818). To RECLAIM margin the
> owner could drop the `no_beneficiary` veto (~55 B — composer picker always supplies a valid id, guards only
> malformed API input; a missing endpoint stamps an inert leash resolveLeash/foreignAssetsByPatron ignore) or a
> dedicated eager microtrim elsewhere. KEPT the veto (correct engineering) + flagged.

### DEFERRED (documented, not dropped)
- **§5 severance war-declaration / peace-purge triggers**: patron-RETREAT severance IS delivered (causeLifecycle
  2b resolves/re-points on endpoint death). The war-declaration + peace-purge-term legs are NOT wired. severance
  can't generalize inside the EAGER `severCorruptionTiesTo` (importing the lazy resolver blows first-paint) — the
  resolver-aware foreign severance belongs in a NEW LAZY helper (corruptionWeb) fired from the lazy peaceTerms /
  war-stressor seams. Deferred: the helper + its two trigger wires.
- **§5 purge honest-costs** (paranoia pressure + false-accusation odds vs the fog + admit-rot legitimacy): the
  EXPOSE machinery + organic exposure already purge; the §5 honest-cost enhancement is unbuilt. Deferred seam.
- **§4 explicit treaty-ledger strain**: the relationship-EDGE state damage (resentment) IS delivered; an explicit
  treaties-ledger complianceState nudge is not (advanceTreaties may read the resentment). Thin deferred seam.
- **HIDE degrading a LIVE asset's effect reads** (directionBias/foreignGrip/paidEyes): the mint-side HIDE degrade
  IS delivered + pinned; coupling HIDE to a live asset's effects is the infoStatecraft deferred-coupling idiom.
- **§6 foreign-FACTION beneficiary in the composer**: the picker offers foreign SETTLEMENTS only; the resolver +
  blowback handle faction endpoints generally, but the composer + the imposeCorruption endpoint guard are
  settlement-focused (the guard checks settlementId only, for eager-byte economy). Deferred.

---

# W-DOCTRINE-3b — THE FOREIGN LANES (§2 creation + §3 effects landed; §4/§5/§6 deferred)

Authority: docs/DESIGN_CORRUPTION_WEB.md §2/§3. Built on review-fixes-2026-07-08 @ base
02b66c4c (Phase A: resolveLeash chokepoint + innocent-guild fix). ALL WORK UNCOMMITTED /
UNSTAGED (brief rule: never add/commit/push/stash; foreign stash@{0} untouched). Session 2026-07-15.

## What SHIPPED (gate-green, dormancy-proven, first-paint BYTE-IDENTICAL)
- **NEW `src/domain/worldPulse/corruptionWeb.js`** (LAZY leaf — imported only by lazy
  pulseKernel/factionCapture/supplyWebWarfare; ZERO first-paint bytes):
  - `corruptionWebActive(ws)` = `beliefsActive(ws) && simulationRules.corruptionWebEnabled===true`
    (the infoStatecraft virtual-flag idiom; NO DEFAULT_SIMULATION_RULES entry). ⚠️ beliefsActive
    needs `infoMode != 'omniscient'` — default IS omniscient, so lit fixtures MUST set `infoMode:'full'`.
  - §2 MOVER `advanceCorruptionWeb({snapshot, worldState, rng, tick, nameFor})` → `{worldState,
    changed, newsEntries, deferrals}`. Mints ONE covert asset/patron/tick through a CHANNEL
    (hostile/rival edge, criminal_corridor channel, or smuggle path via spatialLedgers.supplyShipments),
    under scarcity (one per (patron,target) via the leash scan; per-patron cap MAX_ASSETS_PER_PATRON=3
    → visible `deferrals` entry; affordability upkeep gate in the prosperity vocabulary; E0 loaded-dice
    gate `u < INITIATE_BASE·weight²`). Recruitment weight = channelQuality × (1+obligationBoost·E1debt)
    × (1−HIDE degrade). Deterministic target-NPC pick = seedBetrayalTraitor template (IMPORTANCE_RANK
    {pillar:3,key:2,notable:1} + name codepoint). **Writes npcStates only** (corruption + a
    `corruptionLeash` sidecar); the MIRROR carries the leash onto settlement.npcs.
  - §3 EXPORTED READS: `foreignGripOf(ws,snapshot,patron)` (saturating puppet-readiness — the
    W-PEACE puppet_seat feed, SEAM-NOTED not wired), `directionBias(ws,snapshot,target,patron)`
    (bounded weight-tamper read, exported — not yet wired to a decision consumer), `assetSightFidelityOf`
    (paid eyes — WIRED into supplyWebWarfare.readSupplyWeb via Math.max, byte-safe). All return 0 dormant.
  - `foreignAssetsByPatron(snapshot)` = the scarcity/effect scan (derived from leashes via resolveLeash,
    NOT a persisted ledger — "derived, not persisted beyond the leash itself").
- **`npcAgency.js` mirrorCorruptionOntoSettlement** (EXTENDED): carries `st.corruptionLeash` →
  `corruptTies.leash` (the dual-write mirror discipline). Inert when the sidecar is absent ⇒ byte-identical.
- **`factionCapture.js` THE FORK** (§3): gated behind corruptionWebActive — a foreign-leashed corrupt
  seat is EXCLUDED from the LOCAL capture climb (→ feeds foreignGrip, not thievesGuildStrength). Dark ⇒
  the set is empty ⇒ byte-identical (a betrayal traitor's "accidental" local-guild feed persists dormant).
- **`pulseKernel.js`**: `advanceCorruptionWeb` wired right AFTER advanceFactionCapture (so a fresh asset
  appears fully-leashed next tick, no fork glitch). **`supplyWebWarfare.js`**: paid-eyes Math.max.
- **Tests**: tests/domain/corruptionWebPins.test.js (+11 §2+§3 pins: THE FORK PIN, cutout-leaves-local-green,
  scarcity-cap-with-visible-deferral, paid-eyes, mint anti-vacuity, channel/obligation, dormant-neutral reads)
  + NEW tests/property/corruptionWebDormancyGolden.test.js (dormancy manifest + contract + lit anti-vacuity)
  + tests/fixtures/corruption-web-dormancy-golden.json.

## ✅ VERIFIED (final tree, 2026-07-15)
tsc full (0), typecheck:domain:strict (0, ceiling 0), eslint (0 err), FULL vitest 9350 pass / 1 skip / 0 fail
(byte-identical dormancy — the real pre-wire proof), validate:data/migration/edge/map OK, build OK,
VERIFY_DIST 113/113, **first-paint closure = 1,161,818 B (byte-identical to base, 84 B under the 1,161,902
budget — zero eager bytes added)**. domainAnyCastBaseline unchanged (⚠️ do NOT add `@type {any}` — cast to a
concrete type e.g. `SimNpc[]`; the factionCapture fork loop learned this the hard way).

## ⚠️ ARCHITECTURE NOTES for the next session
- The mint is npcStates-only → mirror → settlement.npcs → saves → NEXT tick's snapshot. One-per-pair holds
  in the real pipeline with a harmless 1-tick lag (mover runs once/tick, no double-mint window). mintAssetInto
  ALSO guards on in-progress npcStates.corruption (two patrons can't overwrite one NPC's leash in a tick).
- JUDGMENTs (vetoable, in the code): substrate = beliefsActive (not warLayer); E0 via loaded dice not a new
  drama class (dramaClassRegistry pinned at 7 — the LIE precedent); obligationDebt01 = sum-then-clamp across kinds.

## DEFERRED — §4/§5/§6 (documented, not dropped; the scope-overflow order was §2+§3 FIRST). Exact seams:
- **§4 FOREIGN CONSEQUENCE LANE**: npcAgency exposure block (lines ~780-814) resolves the leash (789) but a
  foreign leash is a pure no-op beyond nulling attribution. Add: emit foreign-exposure signals → the blowback
  triple. SEAMS: `warReasons.js:537 scoreCorruptionExposed({exposedCorruption01: undefined})` is a STUB — feed
  a real magnitude for the (corrupted→patron) directed pair. Grievance = the applyExposureGrievances idiom
  (informationStatecraft.js:1021, applyRelationshipPatch, incidentType:'deception_betrayal'). Credibility charge
  = advanceCredibility deltas. Legitimacy BOTH courts = impairByName(patronSettlement,...,{type:'legitimacy'})
  at the pulseKernel level (localSettlements Map — npcAgency has no cross-settlement handle). causeLifecycle
  re-adjudicate (TERMINAL 2, line 360) NEVER fires for a foreign leash (sustainingInstitution:147 returns null) —
  add a sibling terminal keyed on the foreign endpoint's liveness for leash re-pointing on patron death/retreat.
  Double-surfacing = the rumor lineage (rumorNetwork.js content.causeClass = DM-truth; settlementIds withhold the
  patron until a 2nd-hop entry). DM-truth vs player = settlementRumors.js projectTruth/includeGroundTruth (already built).
- **§5 COUNTERPLAY**: official-pay posture (onset/exposure resistance, prosperity vocabulary); purges via EXPOSE
  machinery (paranoia + false-accusation + admit-rot legitimacy cost); HIDE already degrades the MINT channel
  (targetSecrecy01) but not yet a live asset; severance = generalize `severCorruptionTiesTo` (mutateEntities.js:673,
  PRIVATE + name-only match) to be exported + resolver-aware (match resolveLeash foreign endpoints), fired on
  war-declaration / peace-purge / patron-retreat.
- **§6 COMPOSER**: EventComposerCorruptionFields.jsx + buildEvent.js:101 + imposeCorruption (mutateEntities.js:697,
  stamp `corruptTies.leash` from `event.payload.leash`) + IMPOSE_CORRUPTION manifest entry (affordanceManifest.js:453 —
  stays scope:'settlement' walker-legal; add any new veto code to coversVetoCodes for the predicateParity walker).
  publicNpc (publicSafe.js:155) already drops corruptTies wholesale (auto-safe for the default player projection);
  ⚠️ the `full:true` / `revealDm` gallery paths do NOT strip it (owner-gated, same class as the pre-existing covert-
  impairment-description leak in w-doctrine-3-corruption-web.md).
- Paid-eyes belief-decay coupling (makeSightFn) and directionBias consumer-wiring are thin deferred seams (the reads
  are live + exported; only the consumer wire is unbuilt — the infoStatecraft precedent for deferring a coupling).
</content>
