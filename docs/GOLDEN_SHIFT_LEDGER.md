# GOLDEN SHIFT LEDGER — G1a "THE WAR MACHINE OBEYS ITS POLITICS"

Wave: G1a (golden-shifting track, branch `claude/review-fix-golden-track`).
Fixes: [worldpulse-war-2..6]. This ledger records every golden/pin/fixture the five
fixes turned RED, the exact semantic cause, and a before/after excerpt — per the
golden-shifting-track constitution. Fixtures are left BYTE-IDENTICAL to base; goldens
are only re-captured by the owner, never here.

## HEADLINE RESULT — no golden turned red (byte-identity held across the whole suite)

Running the FULL domain + property suite after all five fixes:

```
$ npx vitest run tests/domain/ tests/property/
 Test Files  382 passed (382)
      Tests  4685 passed (4685)
```

Every existing golden manifest is byte-identical — including
`tests/property/worldpulseSpatialGolden.test.js`, which drives real pulses with
`warLayerEnabled: true` + `spatialCanonVersion: 1` (beliefs active), i.e. a MEANINGFUL
negative control, not a vacuous one. No fixture was regenerated; none needed to be.

### Why each fix is byte-safe (the gate that keeps the goldens green)

- **war-2 (faction payloads apply):** the real effects fire only for a
  **payload-carrying** faction outcome, and every such outcome is `applyMode:'proposal'`
  (government_change always; institution_capture/suppression only at severity ≥ 0.68 or
  criminal; faction_power_shift only at severity ≥ 0.7). Auto-tick goldens QUEUE those
  proposals — they are not applied until DM-approved (or auto-resolved), so a golden that
  never approves a faction proposal is byte-identical. A faction-free / low-severity world
  never generates a payload.
- **war-3 (sue-for-peace withdraws the siege):** stamps a deployment recall only when a
  `hostile → less-hostile` `relationship_label_change` applies AND a live deployment
  exists between the two edge parties. No deployment (or war layer off) ⇒ `stampDeploymentRecall`
  is a no-op. Co-located with the existing `windDownSponsoredStressors` block, same trigger.
- **war-4 (return_home executes):** stamps a recall only when a `strategy_return_home`
  outcome carrying `metadata.recallTargetId` applies AND the named army exists. Requires
  `settlementStrategyEnabled` + a besieged home + an army abroad. The spatial golden runs
  `warLayerEnabled` but NOT `settlementStrategyEnabled`, so no return_home is emitted.
- **war-5 (M9a levers apply):** the lever relationship-nudge only exists when the chooser
  emits a lever move, which requires `beliefsActive` (spatialCanonVersion + non-omniscient)
  AND a merchant/church/warlord governing seat (`O.levers` present) AND
  `settlementStrategyEnabled`. Absent any of these the lever set is empty (byte-identical to
  Wave-A). No valid edge ⇒ the lever falls back to its old inert marker.
- **war-6 (pacific reactions apply):** negotiate/seek_allies gain a relationship nudge only
  when `evaluateMobilizationReactions` fires them, which needs `warLayerEnabled` + a visible
  mobilizer + a threatened neighbour whose disposition is below `FORTIFY_AGGR` (0.95). The
  spatial golden's few-tick scenarios never surface a below-threshold pacific reactor, so no
  negotiate/seek_allies lands a patch.

## Behavior shift IS real — proven by the wave's own pins (not goldens)

The fixes DO change same-seed behavior on the paths above; that shift is captured by the
16 new pins in `tests/domain/warMachineObeysPolitics.test.js` (all green), e.g.:

- war-2 `government_change` — before: `governingFactionOf` unchanged (ledger cosmetic);
  after: the challenger ascends (`+6` power, `'ascendant'`) and the seat relabels.
- war-2 `faction_power_shift` — before: rosters unchanged; after: `A 50→58`, `B 40→32`
  (bounded transfer of 8, conserved).
- war-3/war-4 — before: `war.resolvedDeployments` empty for the sued/recalled army; after:
  `{ attackerId, outcome:'withdrawal' }`, the front in `retiredChannels`, and NO phantom
  conquest of the abandoned target.
- war-5/war-6 — before: the lever / pacific reaction carried no `relationshipPatch`; after:
  a bounded, clamped nudge + a typed `recentIncidents` entry.

## Conditions under which a FUTURE golden will legitimately shift (for the next session)

If a new golden fixture is added that (a) approves a faction proposal, (b) de-escalates a
hostile edge while a siege deployment is live, (c) enables `settlementStrategyEnabled` with
a besieged-home/army-abroad or a merchant/church/warlord belief-active seat, or (d) surfaces
a below-`FORTIFY_AGGR` pacific mobilization reactor — that fixture SHOULD shift, and the shift
is the intended semantic change. Re-capture it with `UPDATE_GOLDEN=1` and record the cause.

## Non-golden reds carried by this wave: NONE (any-cast ratchet held at 2252 exact)

The new engine logic is fully typed against the shared sim-shape typedefs
(`pulseShapes.js` — including a new shared `RelationshipNudge` typedef — plus
`settlement.schema.js`'s `SimSettlement`/`SimFaction`/`SimInstitution`), so
`tests/lint/domainAnyCastBaseline.test.js` is GREEN with the ceiling at **2252 exact**
(`node scripts/count-domain-any.mjs` → 2252 holes, 2213 any + 39 suppress) and the
strict domain typecheck at 0 errors. Two FORCED SEAMS were bridged with zero-any
`unknown` double-casts (each commented at its site in applyWorldPulse.js): the same
runtime settlement objects belong to two structurally-incompatible typedef families —
`SimPowerStructure.government: string|Object` vs rulingPower.js's
`PowerStructure.government?: string` (the transferRulingPower call), and
`SimInstitution.status: string|Object` vs entities/status.js's
`StatusEntity.status?: string` (the withImpairment call). Reconciling those typedef
families is a pre-existing repo-wide debt item, not a G1a artifact.

---

# GOLDEN SHIFT LEDGER — G1b "WAR MECHANICS"

Wave: G1b (same golden-shifting branch `claude/review-fix-golden-track`, built on G1a @ 7e1886dd).
Fixes: [worldpulse-war-1] posture≠engagement · [spatial-engine-3 / sim-logic-counterparts-3]
field-battle RETREAT · [spatial-engine-4] courier-umbilical fog READ · [worldpulse-war-8]
defender disposition wins · [worldpulse-war-9] occupation constrains the occupied · [worldpulse-war-7]
vanished-party deployment prune. This ledger records the semantic shift of each fix, why the
existing goldens stayed byte-identical, and the conditions under which a FUTURE golden will
legitimately shift — per the golden-shifting-track constitution.

## HEADLINE RESULT — no golden turned red (byte-identity held across the whole suite)

The FULL domain + property suite after all six fixes:

```
$ npx vitest run tests/domain/          → Test Files 364 passed (364)   Tests 4614 passed (4614)
$ npx vitest run tests/property/        → Test Files  19 passed  (19)   Tests   83 passed   (83)
```

Every existing golden manifest — including `tests/property/worldpulseSpatialGolden.test.js`
(real pulses with `warLayerEnabled: true` + `spatialCanonVersion: 1`, a MEANINGFUL negative
control) — is byte-identical. No fixture was regenerated; none needed to be.

### Why each fix is byte-safe for the golden scenarios (the gate that keeps the goldens green)

- **war-1 (posture ≠ engagement):** a martialReadiness record materializes ONLY in a faith
  world with a patron + war experience. The wiring change (engagement reads a LIVE war-front-
  into read, not own `mobilized` posture) alters `experience01` ONLY for a settlement where
  `real-besieged XOR mobilized` holds AND a record materializes. The spatial golden's few-tick
  scenarios surface no such faith settlement, so byte-identical. (An actually-besieged town that
  was ALSO mobilized reads the SAME 0.9 as before.)
- **spatial-engine-3 (RETREAT):** the RETREAT re-role + the `recalled:{cause:'field_battle_retreat'}`
  deployment stamp fire ONLY when a FIELD BATTLE resolves — two hostile in-transit columns whose
  remaining paths cross. The golden's few-tick scenarios never produce a crossing-column battle
  (the same reason the existing `armyTransit` ledger is byte-identical there).
- **spatial-engine-4 (fog READ):** the `fought_blind` news tag + reason fire ONLY on a field
  battle where a combatant's umbilical fog ≥ FOUGHT_BLIND_FOG (0.3 ⇒ staleness ≥ ~4 ticks, route
  home CUT, belief-active + non-omniscient). No golden field battle ⇒ no receipt. The physics
  (winner, strengths, rng draws) are UNCHANGED — the fog only annotates the receipt.
- **war-8 (defender win):** the mirror win delta fires ONLY on a siege break-off
  (withdrawal/forcedLift) or an occupation collapse. dispositionDeltas fold into the NEXT-tick
  `dispositionStats` ledger; the golden's short scenarios run no siege to withdrawal nor
  occupation to collapse, so byte-identical.
- **war-9 (occupation constrains):** the deploy gate diverges ONLY when an OCCUPIED town would
  otherwise open a siege on a third party; the mobilization cooling ONLY at an extractive+
  occupation. The golden has no occupied-would-deploy / firmly-occupied scenario.
- **war-7 (prune):** fires ONLY when a deployment's target or attacker is ABSENT from the
  snapshot (a roster/canon mutation) — a pure no-op on every ordinary tick. The golden never
  removes a party mid-siege.

## Behavior shift IS real — proven by the wave's own pins (not goldens)

The fixes DO change same-seed behavior on the paths above; that shift is captured by 12 new pins
in `tests/domain/warMechanicsG1b.test.js` (all green), e.g.:

- war-1 — before: a `mobilized` (posturing) faith town seeded `experience01 = 0.9` (siege-grade,
  rust ≈ 0); after: `experience01 ≈ 0` (near-maximal rust — the blundered first war can fire),
  while an actually-besieged town reads `≈ 0.9`.
- spatial-engine-3 — before: the loser kept its MARCH role and re-fought the same pair every tick;
  after: `ledger.borin.role === 'retreat'`, `destId === home`, and `deployments.borin.recalled`
  is stamped ⇒ the war layer resolves it as a `withdrawal` (no phantom conquest).
- spatial-engine-4 — before: `beliefStaleness` was write-only; after: a deep-fog battle carries
  `tags:['…','fought_blind']` + a "half-blind" reason, with the true 5:1 favourite still winning.
- war-8 — before: `dispositionDeltas` credited only the attacker's loss; after: one
  `{id:targetId, outcome:'win'}` on a survived siege, and `{id:occupiedId, outcome:'win'}` on a
  thrown-off occupation.
- war-9 — before: an occupied town opened a siege on a third party; after: `deployments.occTown`
  is undefined against a third party BUT defined against its own occupier (the uprising path); an
  extractive-occupied town's posture `cooled`.
- war-7 — before: a vanished-target deployment ground `war_drain` forever; after: it resolves as
  a `withdrawal` within one tick (a vanished attacker's ghost record is dropped).

## Conditions under which a FUTURE golden will legitimately shift (for the next session)

A new/extended golden fixture SHOULD shift — and the shift is the intended semantic change,
re-captured with `UPDATE_GOLDEN=1` and recorded here — if it: (a) runs a faith world long enough
to materialize a martial record for a settlement whose real-siege state differs from its
mobilization posture; (b) crosses two hostile marching columns into a FIELD BATTLE (retreat +
recall + possibly a fought-blind receipt); (c) runs a siege to break-off or an occupation to
collapse (defender/occupied win deltas); (d) has an occupied settlement that would otherwise
deploy, or holds an extractive+ occupation while a town ramps; or (e) removes a besieger/target
from the roster mid-siege.

## Non-golden reds carried by this wave: NONE (any-cast ratchet held at 2252 exact)

All new engine logic is typed against the existing shared typedefs (the local `DeploymentRecord`
gained a typed `recalled?: { cause?, tick? }` field; the martial graph read uses an `unknown`
double-cast; `warFrontsInto`/`retreatRoute`/`currentRegion`/`armyMarchWeeks`/`umbilicalFog`/
`staleAssessment`/`hopWeeks` are typed imports). `node scripts/count-domain-any.mjs` → **2252
holes (2213 any + 39 suppress)** exact; `npm run typecheck:domain:strict` → **0 errors**;
`npx eslint` on the five touched source files → clean.

---

# GOLDEN SHIFT LEDGER — G1c "POLITICS, EVENTS, RELIGION"

Wave: G1c (same golden-shifting branch `claude/review-fix-golden-track`, built on G1b @ 0b499818).
Fixes IMPLEMENTED (16): [domain-events-region-2/3/4/5/6/9], [worldpulse-core-2/3],
[worldpulse-religion-trade-1/5/8], [spatial-engine-5/6]. Fixes DOCUMENTED/DEFERRED (3 — no
behavior change, per the Phase-V verdicts): [worldpulse-core-4], [worldpulse-core-6],
[worldpulse-religion-trade-3]. Fixes NOT YET BUILT (STOP-AND-REPORT remainder, 4): region-1,
region-7, religion-trade-2, religion-trade-4 (see the wave report).

## HEADLINE RESULT — every GOLDEN FIXTURE stayed byte-identical; only 2 behavior-ASSERTION pins shifted

The FULL domain + property suite after all G1c fixes:

```
$ npx vitest run tests/domain/ tests/property/
 Test Files  384 passed (384)
      Tests  4724 passed (4724)
```

Every committed golden MANIFEST — including `tests/property/worldpulseSpatialGolden.test.js`
(real pulses with `warLayerEnabled: true` + `spatialCanonVersion: 1`, beliefs active) — is
BYTE-IDENTICAL. No fixture was regenerated; none needed to be. The conditional-materialization /
dormancy discipline held: the changed engine paths never fire in the golden scenarios.

## The two LEGITIMATELY-RED pins (updated in place — assertion pins, NOT golden fixtures)

Two direct-assertion pins encoded the exact OLD behaviors two fixes intentionally change. Neither
is a `.golden`/serialized fixture — they are `expect()` assertions on the OLD semantics, so per the
constitution they are UPDATED to the new correct behavior (the shift is the point), and recorded here:

1. **`tests/domain/tierResourceDynamics.test.js` — "a depleted primary-export resource does not
   quietly recover"** → renamed to "…recovers under SUSTAINED DEEP CALM (no longer a permanent
   ratchet)". SEMANTIC CAUSE: [worldpulse-religion-trade-8] — a depleted `primary_export` anchor was
   carved out of the quiet-recovery path entirely (a permanent one-way ratchet). It now recovers
   under the deeper `perceivedPressureScore ≤ 0.2` gate at the slow 0.02 probability.
   - Before: `recoveries.some(c => c.targetSaveId === 'exporter')` === **false**.
   - After:  `recoveries.some(c => c.targetSaveId === 'exporter')` === **true** (bystander local
     resource unchanged: recovers under the shallower ≤ 0.32 gate).

2. **`tests/domain/clergyLegitimacyDrag.test.js` — "a HOSTILE court amplifies the scandal; a
   synergistic court shields it"**. SEMANTIC CAUSE: [worldpulse-religion-trade-1] — `deityRulerFit`
   now reads DERIVED temper (`deityTemper`) instead of the retired stored `temperamentAxis`. The
   test's `fitting`/`clashing` deities differed ONLY by their stored `temperamentAxis` (both
   `align='neutral', law='neutral'`), so derived temper (from evil+chaos vs good+law) reads them
   IDENTICAL — the assertion `dragClashing > dragFitting` became `0.112 > 0.112` (false).
   - Fixture change (no golden regen): the deities now differ by ALIGNMENT/LAW that DRIVE the
     derivation — `fitting` = `{align:'evil', law:'chaotic'}` (derives warlike), `clashing` =
     `{align:'good', law:'lawful'}` (derives peacelike). The test's INTENT (ruler-temper
     misalignment amplifies clergy scandal drag) is preserved and green.

## Behavior shift IS real — proven by 27 new pins in `tests/domain/politicsEventsReligionG1c.test.js`

The fixes DO change same-seed behavior on their conditional paths; that shift is captured by the new
pins (all green). Why each stayed byte-safe on the goldens:

- **region-2 (REMOVED_THREAT suppression):** writes `stressorEdits.resolved` only on a SUCCESSFUL
  strike (removed ≠ null); a no-match strike is an identity no-op. Goldens run no REMOVED_THREAT
  events (party/DM events aren't in the auto-tick pulse). Undo restores it (SNAPSHOT_CONFIG_KEYS).
- **region-3 (PLAGUE twin):** `twinDirectiveForEvent`/`crisisWithdraw`/`crisisTwinFor` gain a PLAGUE
  branch → `disease_outbreak`. Fires only on a PLAGUE event; goldens run none.
- **region-4/5/9 (KILL_LEADER map / IMPOSE_CORRUPTION ref / plague healing vocab):** event-layer
  wiring the auto-tick goldens never exercise.
- **region-6 (hostile no-trade):** the goods-driven candidates are gated `!tradeBlocked`; byte-safe
  unless a discovery runs on a `hostile` pair with matching goods (the golden discovery corpus
  carries no such pair).
- **religion-1 (derived temper + peacelike key):** the ruler-fit lens shifts ONLY for deities whose
  DERIVED temper diverges from the old stored-axis read — concentrated on peacelike deities (pool
  ones stored `'peacelike'` previously MISSED the `TEMPER_POS` key → 0.5; now → 0). No golden
  scenario carries a peacelike patron through a ruler-fit or occupation-tGap read.
- **religion-5 (disposition on aggressor):** byte-identical whenever the disposition ledger is empty
  (factor 1.0) — which every legacy golden is (war layer off / no disposition stats).
- **religion-8 (export recovery):** a new recovery candidate only for a depleted `primary_export`
  under deep calm; no golden reaches that state.
- **core-2 (remove_npc roster drop):** only on a party remove_npc action; goldens run none. The
  `evaluateNpcRules` `state.removed` guard skips only states carrying `removed:true` (written only
  by remove_npc) — absent in every golden.
- **core-3 (actor-major DM-time expiry):** byte-identical for single-tick advances (the ≥HOLD check
  already implies `p.tick < startTick`); the guard only bites a COMPOSED/catch-up advance, and only
  for `strategy_deploy`/`coup_succeeded` proposals — none pending in any golden.
- **spatial-5 (belief seed sentinel):** the sentinel materializes ONLY at the decayed-empty boundary
  (a belief ledger that decays fully below MIN_CONFIDENCE). The golden's few-tick scenarios never
  fully decay, so no sentinel key ever appears ⇒ byte-identical. Consumers read by settlement id,
  so the reserved `__seededAt` key is inert to them.
- **spatial-6 (calamity demote dedup):** `alreadyStanding` now considers any-status rows and the
  demote resets description/tags. Fires only on a calamity STRIKE with a same-name collision; the
  disaster mover is preset-gated OFF and runs in no golden.

## DEFERRAL LEDGER (deliberately NOT fixed this wave — documented, NOT bugs to re-find)

- **[worldpulse-core-4] — mergeStressorUpsert birth proxy — OWNER-GATED, parked (Wave-5 bornTick
  piggyback).** The `createdAt === now` same-tick collision test conflates every tick of a composed
  advance (advanceInterval threads ONE pinned `now`). The clean fix — a per-record `bornTick === tick`
  stamp — is a PERSISTENCE-SHAPE change (a new field on every persisted stressor) that shifts
  same-seed stressor goldens, so it awaits the owner-signed `UPDATE_GOLDEN` regen (TEMPORAL_AUDIT
  §3c / backlog Wave-5). Per the Phase-V verdict, NO non-shifting interim exists (threading `tick`
  as the collision key shifts the same goldens). Documented at `applyWorldPulse.js` mergeStressorUpsert.
- **[worldpulse-religion-trade-3] — dead inter-deity stance half — FORMALIZED (not wired).** Per the
  verdict, `stanceOf`'s `aggression` + `treatyDurability` are a DELIBERATE W-F2 build-ahead; the
  relationship-WEIGHT coupling (aggression → inter-deity hostility/escalation tilt; treatyDurability
  → pactStrength decay) is the Phase-4 W-F4 half. Wiring it is an OWNER-GATED new-capability /
  deferred-wave resurrection; excising the fields would delete owner-tuned model state. So it is
  documented in-code (deityStance.js) as a deferral, neither wired nor excised.
- **[worldpulse-core-6] — M11a plague spread under political autonomy — RULING DOCUMENTED + OWNER-NOTE.**
  Per the verdict, NATURE acts autonomously and is EXEMPT from the §11 political-autonomy axis:
  canonizing a map upgrades plague travel from DM-gated to autonomous, which is intended (a plague
  is not a political actor). Documented at `candidateEvents.js` (the M11a reconcile). **OWNER-NOTE
  (product policy — for the owner):** the alternative — gating the front's stressor MATERIALIZATION
  through the proposal queue under `dm_only`/`recommendations` (front still advances; only the mint
  waits), mirroring the M9d withhold-then-re-mint pattern — is a product-policy call left to the
  owner, not decided here.

## Constitutional checks (this wave)

- `node scripts/count-domain-any.mjs` → **2252 holes (2213 any + 39 suppress)** — EXACT, ratchet held.
- `npm run typecheck:domain:strict` → **0 errors** (ceiling 0).
- `npx eslint` on all 22 touched source files + 3 test files → clean.
- New shared exports were typed against real/`unknown` types (no new `any`): `withStressorResolved`
  (crisisLifecycle), `NO_TRADE_RELATIONSHIPS` (tradeLinks), `BELIEF_SEED_KEY` (beliefMap),
  `actorSaveId` param (candidateBase), `intervalStartTick` (kernel).

## Conditions under which a FUTURE golden will legitimately shift (for the next session)

A new/extended golden fixture SHOULD shift — and the shift is the intended semantic change,
re-captured with `UPDATE_GOLDEN=1` and recorded here — if it: (a) runs a PLAGUE / REMOVED_THREAT /
party KILL_LEADER / IMPOSE_CORRUPTION event; (b) runs a discovery on a HOSTILE pair with matching
export/import goods; (c) carries a PEACELIKE patron deity through the ruler-fit / occupation-tGap
lanes, or a deity whose stored temperamentAxis diverges from its derived temper; (d) populates the
disposition ledger and runs a victim-attributed adversarial candidate (raid/tribute/proxy/sanction/
embargo); (e) drives a depleted `primary_export` resource under sustained deep calm; (f) runs a
party `remove_npc`; (g) holds a `strategy_deploy`/`coup_succeeded` proposal across a COMPOSED advance;
(h) decays a belief ledger fully empty then advances again (the seed sentinel appears); or (i) fires
a calamity STRIKE (disastersEnabled) with a same-name institution collision.

## STOP-AND-REPORT remainder (4 fixes NOT built — a coherent "new-lane couplings" sub-group)

G1c completed 16 code fixes + 3 documented/deferred. The remaining 4 each ADD a mechanical lane
(not a surgical wiring), are individually golden-shifting, and each warrants its own read-edit-pin-
battery cycle. They are handed off as a coherent next sub-wave (G1d):

- **[domain-events-region-1] — DM relationship events reach the live conflict layer (HEADLINE,
  owner=True).** TWO lanes: (1) PARTY-caused — extend `EVENT_TO_PARTY_KIND` (partyEventLinkage.js)
  with `BROKERED_ALLIANCE→broker_relationship` / `SETTLEMENT_DISPUTE→inflame_relationship`, deriving
  a `relationshipKey` that MATCHES the pulse's `relationshipKeyFromEdge` (edge.id else `rel.from.to`)
  — the current `mapEventToPartyImpact` only supports a single `targetField`, so this needs a
  key-derivation path. (2) NON-party CANON lane — `rippleEventThroughWorld` (STORE layer,
  settlementSlice.js:202) must call `syncRelationshipChannelBundle` (region/graph.js:649) + a pulse
  `relationshipState` type-upsert for the three relationship events, plus `applyStressor`'s instigator
  souring. Store-layer (won't shift domain goldens; needs store tests). Heaviest fix in the wave.
- **[domain-events-region-7] — recovery/relief propagation.** Add a RELIEF lane to propagation.js's
  rule table (positive polarity): map `route_restored`/`export_gained`/`local_production_gained`/
  `depleted_good_lost` through trade/service channels to a new `relief` impact whose apply step
  early-expires the matching NEGATIVE condition at the target (reuse applyWorldPulse ghost-reconcile
  ~L1032-1055) + a "pressure eases" wizard-news transition. Bounded, additive, mirrors the shock
  machinery with positive sign.
- **[worldpulse-religion-trade-2] — three per-tick re-emitters get cooldown discipline (HIGH,
  persist=True, owner=True).** targeted footholds (religiousContest.js ~791), faith pacts
  (deityStanceLane.js pact branch ~306), vassal_trade_coercion (tradeWar.js ~425). Add per-arc
  cooldowns/latches mirroring `BETRAYAL_COOLDOWN_TICKS` (gate vassal coercion on `result.changed ||
  tick - lastCoercionTick >= RENEWAL` via tradeWarState; foothold/pact once per (cid,rival,npc)/pair
  until broken). Consider extending `isDriftOnlyOutcome` / a standing-state marker so recurring
  condition refreshes become metronome-eligible (structural prevention). Persist=True (a lastTick
  ledger).
- **[worldpulse-religion-trade-4] — earned pantheon tier feeds conversion strength (owner=True).**
  Blend the earned tier into rank strength: `effective = max(DEITY_RANK_STRENGTH[rankAxis],
  DEITY_RANK_STRENGTH[pantheonTier])`, gated on religion-active. NOTE: this threads the pantheon
  ledger (`worldState.pantheon[deityId].tier`) into BOTH `deityRankStrength` implementations
  (cultImpositionApply.js:55 + religiousContest.js:246, ~7 call sites) — not a one-liner; each caller
  must resolve the deity→pantheon entry. `DEITY_RANK_STRENGTH` is already keyed identically for the
  tier vocabulary (`major`/`minor`/`cult`), so the max() is well-defined.

---

# GOLDEN SHIFT LEDGER — G1d "NEW-LANE COUPLINGS"

Wave: G1d (same golden-shifting branch `claude/review-fix-golden-track`, built on G1c @ 9bdfa8fa).
Fixes IMPLEMENTED (3 full + 1 half): [domain-events-region-1] **Lane 1 only** (party-caused),
[domain-events-region-7] (relief propagation), [worldpulse-religion-trade-2] (three re-emitter
cooldowns), [worldpulse-religion-trade-4] (pantheon tier → conversion strength).
STOP-AND-REPORTED: [domain-events-region-1] **Lane 2** (the STORE-layer non-party / OPENED_TRADE_ROUTE
type-upsert + APPLY_STRESSOR souring ripple) — see the remainder note below.

## HEADLINE RESULT — exactly ONE golden fixture legitimately RED; all other goldens byte-identical

The FULL domain + property suite after all G1d fixes:

```
$ npx vitest run tests/domain/            → Test Files 366 passed (366)   Tests 4656 passed (4656)
$ npx vitest run tests/property/          → Test Files  18 passed | 1 failed (19)   (1 legitimate red)
```

The one red is `tests/property/worldpulseSpatialGolden.test.js` case **`sp-a|4|one_week`** — the
pact-cooldown metronome (religion-trade-2) suppresses re-announced faith pacts, which the golden
exercises. Every OTHER golden fixture — including the rest of the spatial-golden corpus — is
BYTE-IDENTICAL. The fixture is left byte-identical (NOT regenerated); this ledger records the shift
for the owner's batched `UPDATE_GOLDEN` regen.

## THE ONE LEGITIMATELY-RED GOLDEN FIXTURE (reverted / not regenerated)

**`tests/property/worldpulseSpatialGolden.test.js` — `sp-a|4|one_week`.** SEMANTIC CAUSE:
[worldpulse-religion-trade-2] — the faith-pact metronome. In the sp-a scenario two good-aligned
patron settlements (Ashford + Crownhold, both Dawnfather) form a faith pact that RE-ANNOUNCED every
~half-tick; the new `pactCooldownPairs` cooldown suppresses the re-announcements.
- Before: the projection's `candidateTypes` histogram carried `faith_pact_formed: 8` over 4 ticks.
- After:  `faith_pact_formed: 2` (the fresh announcements; re-prints within the 6-tick window are
  suppressed) — so the manifest hash for `sp-a|4|one_week` no longer matches.
- Isolation CONFIRMED: neutralising ONLY the pact cooldown makes the golden pass again; the foothold
  cooldown, the coercion metronome, the relief lane, and the pantheon-tier blend each leave every
  golden byte-identical. Fixture NOT regenerated (owner-signed batched regen pending).

## Behavior shift IS real — proven by 15 new pins in `tests/domain/newLaneCouplingsG1d.test.js` + 1 updated assertion pin

- **region-1 Lane 1** — before: a DM-brokered/disputed relationship event only wrote the home
  settlement's neighbourNetwork (cosmetic); after: a PARTY-CAUSED `BROKERED_ALLIANCE` /
  `SETTLEMENT_DISPUTE` maps through `broker_relationship`/`inflame_relationship`, resolves the live
  edge via `relationshipKeyFromEdge`, and measurably moves the pulse `relationshipState` + relabels
  the graph edge the war layer reads (hostile→cold_war on broker; neutral sours on dispute).
- **region-7** — before: `route_restored`/`export_gained`/`import_gained`/`local_production_gained`/
  `depleted_good_lost` propagated NOTHING; after: they mint a bounded, single-hop `relief` impact
  through trade/service channels whose apply step early-expires the matching negative regional
  condition at the target (import-shortage lifts NOW; unrelated conditions survive; relief never
  waves into a phantom downstream shock).
- **religion-trade-2** — before: footholds re-print every tick, pacts every ~2 ticks, vassal coercion
  every tick a prize is held; after: each re-announces at most once per 6-tick window
  (`pactCooldownPairs`/`footholdCooldownKeys` ride pulseHistory; coercion rides a new
  `lastCoercionTick` on the EXISTING `tradeWarState` entry — no new top-level worldState key). First
  emission is never on cooldown ⇒ byte-identical for a fresh event.
- **religion-trade-4** — before: a cult-rank deity that won 6 seats still converted at cult strength
  0.35; after: `rankStrengthOf = max(snapshot rank, DEITY_RANK_STRENGTH[pantheon tier])` lifts the
  projected authority + prevalence + legitimacy of a seat-won creed (pin: a cult-rank patron promoted
  to a `major` pantheon tier mints religious_authority at 0.7675 vs the 0.6175 baseline — exactly
  `(0.95−0.35)×0.25`). Gated on a present pantheon ⇒ base-only when religion is dormant.

## The ONE updated assertion pin (updated in place — behavior-assertion, NOT a golden fixture)

**`tests/domain/tradeWar.test.js` — "sustained forced coercion raises vassal strain past the rebellion
gate".** SEMANTIC CAUSE: [worldpulse-religion-trade-2] — the vassal_trade_coercion metronome. Over 16
ticks the coercion now re-stamps its strain condition ~3× (once per 6-tick window) instead of every
tick.
- Before: `expect(on.maxStrain).toBeGreaterThan(off.maxStrain)` — the coercion, re-stamping every
  tick, pushed the peak strain strictly above the no-coercion baseline.
- After: the peak strain is now driven by the DURABLE `vassal_extraction` + resentment ratchet (which
  reaches the same peak in both arms), so `on.maxStrain === off.maxStrain`. The assertion is updated
  to encode the fix's actual guarantee: the escape valve STILL crosses the rebellion gate
  (`on.maxStrain > VASSAL_REBELLION_STRAIN_GATE`, not a silent trap) AND the coercion is METRONOMED
  (`0 < on.coercionCount < 16`, no longer a per-tick flood). The escape valve is preserved; the flood
  is gone.

## Constitutional checks (this wave)

- `node scripts/count-domain-any.mjs` → **2252 holes (2213 any + 39 suppress)** — EXACT, ratchet held.
  (New engine logic typed against real/`unknown` types — no new `any`; the +11 introduced during
  implementation were retyped to `unknown`/concrete before landing.)
- `npm run typecheck:domain:strict` → **0 errors** (ceiling 0). Two new typedef properties were added
  (`ImpactDetail.relievesArchetype?`, `deityLocalStrength`/`deityLegitimacyTarget` `rankStrengthOf?`).
- `npx eslint` on all 8 touched source files + 2 test files → clean.
- any-cast baseline lint test (`tests/lint/domainAnyCastBaseline.test.js`) → green.

## Conditions under which a FUTURE golden will legitimately shift (for the next session)

A new/extended golden fixture SHOULD shift — and the shift is intended, re-captured with
`UPDATE_GOLDEN=1` and recorded — if it: (a) records a PARTY-CAUSED `BROKERED_ALLIANCE`/
`SETTLEMENT_DISPUTE` on a live edge (region-1 Lane 1); (b) runs a settlement to a recovery
(route reopened / export or production regained / depletion ended) that flows relief through a trade/
service channel while a matching regional condition is live (region-7); (c) RE-announces a faith pact
on a pair, a targeted foothold on a (cid,rival,minister) triple, or a held vassal coercion across
successive ticks within the 6-tick window (religion-trade-2 — this is the `sp-a` red's class); or
(d) carries a deity whose EARNED pantheon tier strictly exceeds its snapshot rankAxis through a
conversion / prevalence / legitimacy read (religion-trade-4).

## STOP-AND-REPORT remainder — [domain-events-region-1] Lane 2 (store-layer)

Lane 1 (party-caused) is BUILT and satisfies the acceptance test (a DM-brokered alliance measurably
moves pulse `relationshipState`; a dispute sours it). Lane 2 — the NON-party CANON ripple — is NOT
built: it is store-layer (`rippleEventThroughWorld`, settlementSlice.js) and needs a store-test
battery outside this wave's domain-only golden-track batteries. Precise remaining scope:
- For a NON-party `BROKERED_ALLIANCE`/`SETTLEMENT_DISPUTE`/`OPENED_TRADE_ROUTE`, and for
  `APPLY_STRESSOR` carrying an instigator, `rippleEventThroughWorld` must upsert the pulse
  `relationshipState` to the event's SPECIFIC type (not a ladder nudge — the verdict's "type upsert"),
  relabel the edge, and call `syncRelationshipChannelBundle` (region/graph.js:649).
- Recommended shape: a new domain applier (sibling to `applyPartyImpact`) that builds a
  `relationship_label_change` outcome carrying the event's `toType` + a signed relationshipPatch and
  routes it through the EXISTING `applyWorldPulseOutcomes` (which already does applyRelationshipPatch +
  applyRelationshipLabelToGraph + syncRelationshipChannelBundle + neighbourNetwork writeback + siege
  wind-down), invoked from a new store method the store's `rippleEventThroughWorld` calls for the
  non-party branch. `findRelationshipEdgeForPair` (now in partyImpact.js) can be lifted/shared for the
  edge resolution. This won't shift DOMAIN goldens (store-triggered, not auto-tick) but needs store
  tests.

---

# GOLDEN SHIFT LEDGER — G2 "GENERATION COHERENCE"

Wave: G2 (same golden-shifting branch `claude/review-fix-golden-track`, built on G1d @ f5fbc41f).
The constraint-driven moat stops dropping user intent and half-integrating content. Fixes span
GROUP A (config-seam intent), GROUP B (NPC/content coherence), GROUP C (data joins).

IMPLEMENTED (18 fixes): [generators-pipeline-1..7], [generators-domain-3/5/7], [domain-top-1/3],
[data-tables-1/2/5/6], [content-immersion-4], [pdf-6].
STOP-AND-REPORTED (4 coherent remainders): [generators-domain-2], [generators-domain-4],
[generators-domain-6], [generators-domain-1 + data-tables-3]. See the remainder notes below.

## HEADLINE RESULT — cumulative EXACT generator-golden drift = 134 of ~190 configs

Measured with the authoritative method the task prescribes: `UPDATE_GOLDEN=1` to regenerate the
manifest, `git diff tests/fixtures/generator-golden-master.json` to read the changed config keys,
then `git checkout` to REVERT. The manifest is left BYTE-IDENTICAL (never regenerated here) for the
owner's batched `UPDATE_GOLDEN` regen. (The vitest-failure `drift[]` array TRUNCATES for long lists —
it is unreliable for exact per-fix counts; the manifest diff is authoritative.)

```
Non-golden verification (all GREEN):
$ node scripts/count-domain-any.mjs        → 2252 holes (2213 any + 39 suppress) — EXACT, ratchet held
$ npm run typecheck:domain:strict          → 0 errors (ceiling 0)
$ npx eslint <24 touched src + 17 test files> → clean
$ npx vitest run tests/generators/ tests/joins/  → 91 files, 807 tests passed
$ npx vitest run tests/domain/                   → 369 files, 4664 tests passed
$ 17 new G2 pin files                            → 59 tests passed
```

The two RED property goldens are: `generatorGoldenMaster` (the intended 134-config shift, this
ledger) and `worldpulseSpatialGolden sp-a|4|one_week` — a PRE-EXISTING G1d red (the religion-trade-2
pact-cooldown metronome), CONFIRMED still red on a clean worktree at the base commit f5fbc41f, i.e.
NOT a G2 artifact.

## THE SHIFT MAP — which fix shifts which configs, and why

The 134-config drift spans every tier (metropolis 28, town 42, village 28, hamlet 20, city 16) and
every terrain (plains 27, mountain 23, coastal 20, desert 20, forest 20, hills 12, riverside 8,
auto 4). Attribution by fix (semantics — `computeActiveChains`/services draw NO rng, so their blast
is bounded to the configs that actually exercise the changed path):

- **[generators-pipeline-6] legitimacy-defense reconcile (GOLDEN-SHIFTING, ~23 configs).** The
  assembly defense-readiness patch already rewrote publicLegitimacy's label + gov/crim multipliers on
  a band cross; the fix now RE-DERIVES the faction powers from their preserved `rawPower` base with the
  patched multipliers (idempotent when the band did NOT cross, so the shift is confined to
  band-crossing settlements: hamlet/town forest|isolated, village coastal/desert, metropolis plains,
  town none/mountain). Residual (bold-option domain, deferred): the governance narrative/dominance
  line is still baked from the provisional ranking. Pins: `legitimacyDefenseReconcile.test.js`.
- **[data-tables-2] terrain institution-boost renames (GOLDEN-SHIFTING, broadest — plains/forest/
  hills/mountain/desert across all tiers).** 13 dead modifier `name` patterns renamed/re-pointed to
  live catalog substrings (Bowyer/Fletcher→Bowyer, Herbalist→Apothecary, Weavers' guild→Weavers,
  Tanners'→Tanner, Cheesemaker→Dairy farmer, Carpenters'→Carpenter, Foresters'→Sawmill,
  Shepherds'→Shepherd, Stonemasons'→Stone quarry, Jewelers'→Jeweller, Salt merchant→Salt works,
  Water merchant→Aqueduct, Livestock market→Butcher). The boosts now actually multiply institution
  selection odds for those terrains → institution rolls shift. Pin +ratchet:
  `terrainInstitutionModifiersReachable.test.js`.
- **[data-tables-5] fish/fishing chain dedup (GOLDEN-SHIFTING — coastal + riverside only).** The thin
  `fish` chain (duplicate of `fishing`) is retired; `fishing_grounds`/`river_fish` resource→chain maps
  redirected to the richer chains; `river_fishing` no longer substitute-activates on `Fishing grounds`
  (the riverless "River Fishing" bug). `computeActiveChains` draws NO rng, so ONLY configs with an
  active fishing chain shift. CROSS-CONSUMER: `resourceEconomicRole`/tierResourceDynamics builds its
  resource→goods vocabulary from the chain's rawInputs/intermediateGoods/outputs — 'River fish' was
  folded into the surviving `fishing` chain's rawInputs so the fishing_grounds economic-role
  classification is PRESERVED (the retirement is a display dedup, not a reclassification; without this,
  5 tierResourceDynamics pins regressed). Pins: `fishingChainDedup.test.js`.
- **[data-tables-6] priorityCategory spot-fix (GOLDEN-SHIFTING, ~16 configs — metropolis + village
  hills/riverside).** 4 metropolis Criminal entries 'entertainment'→'criminal'; Midwife 'magic'→
  'crafts', Village scribe→'government', Wildfowler→'economy'. Feeds `hasCriminal` (historyGenerator)
  + the moralMartialLean/mercenaryMarket haystacks → history-tension shifts. ⚠️ OWNER-GATE FLAG: the
  verdict Blast marks this owner_gated=True (it touches categoryVocabulary.js's "divergence is data"
  governance area) but adjudicated THESE specific runs as copy-paste drift, not intent; implemented as
  task-directed drift-correction — owner may veto. Pin+ratchet: `priorityCategoryPlausibility.test.js`.

## BYTE-SAFE on the generator-golden corpus (0 drift) — why each holds

- **[generators-pipeline-1/2] manual resource mode** (allow-list survival + terrain override): the
  golden corpus uses RANDOM resource mode (no `nearbyResourcesState`/`nearbyResourcesRandom:false`),
  so the manual branch never runs. Pins exercise it directly. `manualResourceSeam.test.js`.
- **[generators-pipeline-3] adversarial-relationship gate** (canonical vocab + shared
  `isAdversarialRelationship`): the corpus binds NO neighbour, so `effectiveConfig.neighborRelationship`
  is absent and `tradeRouteArg` is null in both old and new code. Pin binds a hostile neighbour
  directly. `adversarialNeighbourGovernance.test.js`.
- **[generators-pipeline-4] category toggles** (shared `categoryToggleReader.isCategoryEnabled` in
  assembleInstitutions + factionCorrelation): the corpus carries empty `_categoryToggles`, so every
  category is enabled in both. Pin uses a disabled category on random/custom settTypes.
  `categoryToggleRandomCustom.test.js`.
- **[generators-pipeline-5] metropolis catalog reachable** (lookups.js merges city+metropolis): the
  lookups are imported ONLY by store/UI (InstitutionalGrid, CatalogTabs, selectors), NEVER by a
  generation step, so generation output is unchanged. Pin+ratchet: `metropolisCatalogReachable.test.js`.
- **[generators-pipeline-7] terrain-derived-from-route trace**: the new receipt fires only on
  auto-terrain + EXPLICIT route, which no corpus config uses (grid rows pin a terrain; random_trade
  rows roll it). Trace-only; generation output unchanged. `terrainRouteTrace.test.js`.
- **[generators-domain-3] regen NPC enrichment** (regenNPCsPipeline runs the shared enrichNpcCoherence
  tail extracted from generateCoherence): the full-assembly extraction is BYTE-IDENTICAL (same calls,
  same order); regen is a separate live-reroll path not in the generator golden. `regenNpcEnrichment.test.js`
  + regenRngRestore/randomConfigReroll green.
- **[generators-domain-5] magic-agriculture tier sentinel** (foodBalance reads `config.tier||settType`):
  the corpus never sets `priorityMagic > 75`, so `isMagicHighTier` is false in both. Pin drives a
  high-magic random-tier town. `foodBalanceTierSentinel.test.js`.
- **[generators-domain-7] inferFactionCategory** (drop 'Bloc' from economy; add Claimant/Loyalist to
  noble): the succession blocs are minted only by politically_fractured/succession_void stress, which
  the corpus does not trigger (0 new drift). Table pin: `inferFactionCategoryBloc.test.js`.
- **[domain-top-1] ASSIGN_NPC_TO_ROLE preserves the sheet** (`{...npc,...structural}`): an event-path
  mutation, not called during generation. `assignNpcPreservesSheet.test.js`.
- **[domain-top-3] institution→faction impairment fallback** (archetype-match default in
  factionInstitutionStrength): propagate.js is imported only by event/worldPulse paths (corruptionImpair,
  mutateWorld, mutateEntities), never generation. `institutionFactionFallback.test.js`.
- **[data-tables-1] government civic services** (5 dedicated INSTITUTION_SERVICES entries): services are
  a DISPLAY read-model, NOT baked into the generated settlement object → 0 generator-golden drift (the
  verdict's goldens=True was conservative). Pins: `governmentServicesCivic.test.js`.
- **[content-immersion-4] naming decontamination**: the corpus cultures are germanic/celtic/norse/
  mediterranean; the edited pools are east_asian + mesoamerican → 0 manifest drift. The shift (NOT in
  corpus) is the 1-for-1 replacements — 8 JP surnames→JP given names, Kayla→Seoyeon, burg→cheng,
  Ixchel→Tepeu, Venus/Gemini/Pleiades/Zero→Citlali/Metztli/Yaretzi/Itzel, Quijada/Valladolid/Yucatan→
  Quej/Vukub/Yaxche. Pool sizes preserved. `namingDecontamination.test.js`.
- **[pdf-6] viability filter parity**: PDF + web display only (shared `viabilityFilter.isViabilityItem`).
  `viabilityFilter.test.js`.

## STOP-AND-REPORT remainders (4 — coherent, each warrants its own read-edit-pin cycle)

- **[generators-domain-2] structural-NPC resolver.** factionRoles.js REVERTED to clean. DISCOVERY: the
  verdict's "synonym dedup" framing is insufficient. `ensureFactionStructuralNpcs` walks
  `settlement.factions` (NPC GROUPINGS — 2 entries, category=undefined) which SHADOWS
  `powerStructure.factions`; grouping factionIds do NOT match the seat-holders' factionAffiliation (a
  powerStructure name like 'Military/Guard'), so a name-keyed role-synonym resolver never resolves
  (stamped-real = 0). Flipping to walk powerStructure.factions makes resolution work but
  over-synthesizes 5–7 empty 'The <Role>' placeholders/settlement (worse than the original few
  duplicates). FAITHFUL FIX (own cycle): keep grouping-walk, add a CATEGORY-based match layer — resolve
  a proposed seat (grouping archetype A) to an existing NPC whose role is a seat-synonym AND whose REAL
  powerStructure faction (looked up by factionAffiliation) has archetype A; stamp importance/linkage;
  synthesize only when no archetype-matching NPC holds the seat. ROLE_SYNONYMS table validated against
  the real role vocabulary during this session.
- **[generators-domain-4] dual food model reconcile.** A single-writer rewrite of the 340-line
  `deriveFoodBalanceAnalysis` (paid Viability tab + PDF) to consume generateFoodSecurity's
  dailyProduction/dailyNeed/deficit; reconciles TWO different magic-food models (magicSupplement
  fraction vs +0.3 agriMod boost + separate magicFoodOffset) — choosing canonical = owner-tunable
  economics + tick foodStockpile input; broad golden shift. PLAN in-notes. (generators-domain-5's
  tier-sentinel fix is independent and SHIPPED.)
- **[generators-domain-6] timeline variety.** Needs: hoist the typeMap out of the find() callback +
  seeded weighted-pick among matching templates (variety); re-key the FINAL dedup (~L1017) off the
  CATEGORY onto the template type to let city+ reach the 20-event budget while PRESERVING the
  documented 'The Occupation' title-collision guard; verify the anchor pass (~L878-1007) preserves/
  threads the template-type tag. Broad golden shift + intricate dedup redesign + anchor interaction.
- **[generators-domain-1 + data-tables-3] 5 newer stress types integration.** A register-sensitive
  content wave of its own: 4 STRESS_DESCS arrival vignettes × 5 types; add the 5 keys to SEVEN weight
  tables (npcGenerator STRESS_BOOSTS/STRESS_SECRET_BOOSTS/STRESS_MANDATORY_ROLES/STRESS_TO_CATEGORY,
  historyGenerator STRESS_BOOSTS, stressGenerator STRESS_SEVERITY_WEIGHT, settlementNarrative
  STRESS_FLAVOR) + buildStressContext coupling blocks (slave_revolt↔slave-economy, wartime↔hostile
  neighbour, insurgency↔low legitimacy, mass_migration↔route); real tension templates for
  legitimacy_crisis/demographic_pressure/trade_dispute; dt3: 5–8 STRESS_INSTITUTION_EFFECTS secret/
  stakes rows × 5. Plus a structural-prevention walker (every STRESS_TYPE_MAP key present in each
  consuming table). Golden-shifting; owner-sensitive register → deserves focused authoring.

## Constitutional checks (this wave)

- `node scripts/count-domain-any.mjs` → **2252 holes (2213 any + 39 suppress)** — EXACT, ratchet held.
  (New domain code — canonicalRelationship.isAdversarialRelationship, propagate.js archetype fallback,
  display/viabilityFilter.js — typed against real types; the one `{*}` introduced during work was
  retyped before landing.)
- `npm run typecheck:domain:strict` → **0 errors** (ceiling 0). New typedef props: PropagationInstitution
  `.category`; INSTITUTION_CATEGORY_ARCHETYPE `Record<string,string>`; the VIABILITY_EXCLUDED_* arrays
  typed `readonly string[]`.
- `npx eslint` on all 24 touched source files + 17 new test files → clean.
- any-cast baseline test (`tests/lint/domainAnyCastBaseline.test.js`) → green.

## Conditions under which a FUTURE golden will legitimately shift (for the next session)

Beyond the 134 already shifted here, a new/extended golden fixture SHOULD shift — intended, re-captured
with `UPDATE_GOLDEN=1` and recorded — if it: (a) runs MANUAL resource mode with an abundant/depleted
marking or a terrain-override; (b) binds an adversarial neighbour (pipeline-3); (c) sets a category
disable on a random/custom settType (pipeline-4); (d) drives `priorityMagic > 75` on a random/custom
town+ (domain-5); (e) mints a politically_fractured/succession bloc faction (domain-7); (f) generates
in an east_asian/mesoamerican culture (content-immersion-4); or (g) once STOP-AND-REPORT domains
2/4/6 and 1+dt3 land, per their own shift conditions.
