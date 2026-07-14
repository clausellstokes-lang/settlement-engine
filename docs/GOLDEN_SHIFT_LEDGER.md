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
