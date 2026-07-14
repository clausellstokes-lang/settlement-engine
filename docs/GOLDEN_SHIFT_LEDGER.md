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
